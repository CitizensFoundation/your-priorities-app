/** Explicit, small paid connector smoke. Uses no OpenAI credentials or paid model calls. */
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs, format } from "node:util";
import { expect } from "@playwright/test";
import {
  apiRoot,
  importManualFirecrawlKey,
  manualFirecrawlKeyName,
  redactManualText,
  requireLiveOptIn,
  resolveManualConfig,
} from "./manual/environment.js";
import { startManualHarness, type ManualHarness } from "./manual/harness.js";
import { driveGroupCreation } from "./manual/groupCreationDriver.js";
import { run as runFixture } from "./memoryStore.js";
import type { UsageReservation } from "../budget.js";
import { publicDocumentUrl } from "../firecrawl.js";

const { values } = parseArgs({
  options: {
    live: { type: "boolean" },
    prepare: { type: "boolean" },
    env: {
      type: "string",
      default: path.resolve(apiRoot, "../.envForAgentDoNotViewOnlyImport"),
    },
    output: { type: "string", default: "/tmp/skills-first-firecrawl" },
  },
});
if (values.prepare || !values.live) {
  console.info(
    "Firecrawl smoke: one Idaho search (two results), one observed document, cached replay, before/after account credits. Maximum 16 reserved credits across two requests. No paid models. Requires Docker/Chromium and --live plus YP_WORKFLOW_MANUAL_LIVE=1. Credentials remain server-side.",
  );
} else {
  requireLiveOptIn(process.env);
  for (const name of ["log", "info", "warn", "error", "debug"] as const) {
    const original = console[name].bind(console);
    console[name] = (...args: unknown[]) =>
      original(redactManualText(format(...args)));
  }
  await mkdir(values.output!, { recursive: true, mode: 0o700 });
  const output = await mkdtemp(path.join(values.output!, "live-"));
  const report: Record<string, unknown> = {
    passed: false,
    paidModelCalls: 0,
    mode: "live-firecrawl",
    maximumReservedCredits: 16,
  };
  let harness: ManualHarness | undefined;
  let paidCalls = 0;
  try {
    await importManualFirecrawlKey(values.env!);
    const config = resolveManualConfig({
      codexModel: "offline-codex",
      trialBudgetMicros: 100000,
    });
    const marker = `FIRECRAWL_READY_${randomUUID()}`;
    const boundedFetch: typeof fetch = async (url, init) => {
      const address = String(url);
      assert.ok(
        [
          "https://api.firecrawl.dev/v2/search",
          "https://api.firecrawl.dev/v2/scrape",
          "https://api.firecrawl.dev/v2/team/credit-usage",
        ].includes(address),
      );
      if (init?.method === "POST") {
        if (++paidCalls > 2)
          throw new Error(
            "Live smoke permits exactly two paid Firecrawl requests",
          );
      }
      return fetch(url, init);
    };
    harness = await startManualHarness(config, "offline", {
      groupCreation: true,
      browserLogin: true,
      codex: "greeting",
      offlineTurn: async () => marker,
      usageDirectory: output,
      connectors: { firecrawlFetch: boundedFetch, live: true },
    });
    const h = harness;
    await driveGroupCreation(
      h,
      config,
      output,
      marker,
      false,
      AbortSignal.timeout(300000),
      {
        budgetMicros: 100000,
        async run({ page, groupId, screenshot, check }) {
          const binding: YpWorkflowConnector = {
            id: "firecrawl",
            kind: "firecrawl",
            label: "Firecrawl live smoke",
            resourceId: "web",
            writeEnabled: false,
            settings: { creditMicros: 1000, maxCreditsPerRequest: 8 },
          };
          // The key goes directly to the server service, never to Playwright or a browser request.
          await h.connectors.bind(groupId, 10, binding, {
            apiKey: process.env[manualFirecrawlKeyName],
          });
          const before = await h.connectors.creditUsage(groupId, binding.id);
          assert.ok(
            before.remainingCredits >= 16 && before.planCredits > 0,
            "At least 16 credits and a known plan allowance are required",
          );
          // The user supplied a $99 plan. This is allocation of plan cost, not an additional invoice charge.
          const creditMicros = Math.ceil(99_000_000 / before.planCredits);
          assert.ok(
            16 * creditMicros <= 100000,
            "Credit-price estimate exceeds the $0.10 smoke cap",
          );
          binding.settings.creditMicros = creditMicros;
          await h.connectors.bind(groupId, 10, binding, {
            apiKey: process.env[manualFirecrawlKeyName],
          });
          const snapshot = await h.request<YpWorkflowSnapshot>("");
          const run = {
            ...runFixture(snapshot.workspace),
            id: randomUUID(),
            mode: "trial" as const,
            budgetMicros: 16 * creditMicros,
            inputCount: 1,
          };
          run.graph.nodes.find((node) => node.id === "analyze")!.configuration =
            { maxDocuments: 1, maxDocumentPages: 1, maxDocumentChars: 5000 };
          const frozen = await h.connectors.snapshotBindings(
            groupId,
            10,
            run.graph,
          );
          await h.store.transact(groupId, async (tx) => {
            await tx.put("run", run.id, run);
            await tx.put("run-connector", `${run.id}:firecrawl`, frozen[0]);
          });
          const request = {
            id: randomUUID(),
            runId: run.id,
            nodeId: "analyze",
            binding: "firecrawl",
            operation: "search",
            input: {
              query: "site:dopl.idaho.gov nursing licensure requirements",
              limit: 2,
            },
          };
          const search = (await h.connectors.request(groupId, request)) as {
            pages: { url: string }[];
            creditsUsed: number;
          };
          assert.ok(
            search.pages.length,
            "Live search should return an Idaho source",
          );
          assert.deepEqual(
            await h.connectors.request(groupId, request),
            search,
          );
          assert.equal(
            paidCalls,
            1,
            "Replay must return the saved response without consuming credits",
          );
          const url = publicDocumentUrl(search.pages[0].url);
          const document = (await h.connectors.request(groupId, {
            ...request,
            id: randomUUID(),
            operation: "scrape",
            input: {
              url,
              sourceRequestId: request.id,
              maxPages: 1,
              maxChars: 5000,
            },
          })) as Record<string, YpWorkflowJson>;
          assert.equal(typeof document.markdown, "string");
          assert.ok(
            String(document.markdown).trim(),
            "Observed source should provide document text",
          );
          const ledger = await h.request<UsageReservation[]>("/usage");
          assert.equal(ledger.length, 2);
          assert.ok(ledger.every((item) => item.status === "settled"));
          const used = ledger.reduce(
            (sum, item) => sum + item.creditUsage!.actualCredits!,
            0,
          );
          assert.ok(used <= 16);
          const after = await h.connectors.creditUsage(groupId, binding.id);
          Object.assign(report, {
            paidFirecrawlCalls: paidCalls,
            runId: run.id,
            creditsUsed: used,
            estimatedAllocatedCostMicros: used * creditMicros,
            creditMicros,
            planPriceUsd: 99,
            accountBefore: before,
            accountAfter: after,
            observedAccountDelta:
              before.remainingCredits - after.remainingCredits,
            balanceNote:
              "Account delta may include concurrent use or delayed provider accounting; request usage is authoritative for this smoke.",
          });
          for (const [name, value] of Object.entries({
            search,
            document,
            ledger,
          }))
            await writeFile(
              path.join(output, `${name}.json`),
              redactManualText(JSON.stringify(value, null, 2)),
              { mode: 0o600 },
            );
          await page.reload();
          await page
            .locator("yp-live-workflow")
            .getByRole("button", { name: "Usage", exact: true })
            .click();
          await page
            .getByRole("button", {
              name: "Refresh account credits",
              exact: true,
            })
            .click();
          await expect(
            page.getByRole("region", { name: "Firecrawl usage" }),
          ).toContainText("account credits remaining");
          await screenshot("07-live-firecrawl-credits.png");
          await check(
            "Live search, observed document, cached replay and exact request credits verified; account balance reported separately",
          );
          return { creditsUsed: used, paidFirecrawlCalls: paidCalls };
        },
      },
    );
    report.passed = true;
  } catch (error) {
    report.error = redactManualText(String(error));
    report.paidFirecrawlCalls = paidCalls;
    if (harness?.groupCreation?.groupId()) {
      const ledger = await harness
        .request<UsageReservation[]>("/usage")
        .catch(() => []);
      report.unresolvedRequests = ledger.filter(
        (item) => item.status !== "settled",
      ).length;
      report.creditsUsed = ledger.reduce(
        (sum, item) => sum + (item.creditUsage?.actualCredits ?? 0),
        0,
      );
      report.reservedCredits = ledger
        .filter((item) => item.status !== "settled")
        .reduce(
          (sum, item) => sum + (item.creditUsage?.maximumCredits ?? 0),
          0,
        );
      await writeFile(
        path.join(output, "ledger.json"),
        redactManualText(JSON.stringify(ledger, null, 2)),
        { mode: 0o600 },
      );
    }
    process.exitCode = 1;
  } finally {
    try {
      await harness?.close();
    } catch (error) {
      report.cleanupError = redactManualText(String(error));
      process.exitCode = 1;
      report.passed = false;
    }
    await writeFile(
      path.join(output, "report.json"),
      redactManualText(JSON.stringify(report, null, 2)),
      { mode: 0o600 },
    );
    console.info(
      `Firecrawl smoke ${report.passed ? "PASS" : "FAIL"}: ${output}/report.json`,
    );
  }
}
