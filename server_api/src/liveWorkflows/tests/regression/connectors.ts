import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import ExcelJS from "exceljs";
import { expect as playwrightExpect } from "@playwright/test";
import type { UsageReservation } from "../../budget.js";
import type { GroupCreationContinuation } from "../manual/groupCreationDriver.js";
import { waitFor, type ManualHarness } from "../manual/harness.js";
import {
  researchQuote,
  researchUrl,
  type connectorFixtures,
} from "./connectorFixtures.js";

const expect = playwrightExpect.configure({ timeout: 30000 });
export function connectorsScenario(
  harness: ManualHarness,
  output: string,
  signal: AbortSignal,
  fixtures: ReturnType<typeof connectorFixtures>,
): GroupCreationContinuation {
  return {
    budgetMicros: 2_000_000,
    async run({ page, groupId, check, screenshot, expectFailure }) {
      const workflow = page.locator("yp-live-workflow");
      const button = (name: string) =>
        workflow.getByRole("button", { name, exact: true });
      const state = () => harness.request<YpWorkflowSnapshot>("");
      const source = await harness.groupCreation!.sourceGroup();
      await button("Data").click();
      await workflow
        .getByText("Connect a Your Priorities group", { exact: true })
        .click();
      await workflow
        .getByLabel("Group name", { exact: true })
        .fill("Research source jobs");
      await button("Find accessible groups").click();
      await workflow
        .getByLabel("Group", { exact: true })
        .selectOption(String(source.id));
      await button("Connect group").click();
      await button("Test connection").click();
      await expect(
        workflow
          .getByRole("status")
          .filter({ hasText: "Research source jobs:" }),
      ).toContainText("1 records available");
      await button("Import a version").click();
      const uploaded = await waitFor(
        "imported source version",
        async () =>
          (await state()).assets.find((asset) => asset.source === "connector"),
        30000,
        signal,
      );
      const row = workflow.getByRole("row").filter({
        has: page.getByRole("link", { name: uploaded.name, exact: true }),
      });
      await row.getByRole("button", { name: "Preview" }).click();
      await expect(workflow.locator(".inspector")).toContainText(
        "Records Officer",
      );
      await screenshot("07-imported-group.png");
      const yp = (await state()).connectors.find(
        (c) => c.kind === "your-priorities",
      )!;
      await source.revoke();
      expectFailure(
        "POST",
        `/api/live-workflows/groups/${groupId}/connectors/${yp.id}/check`,
        403,
      );
      await button("Test connection").click();
      await expect(workflow.getByRole("alert")).toBeVisible();
      expectFailure(
        "POST",
        `/api/live-workflows/groups/${groupId}/connectors/${yp.id}/import`,
        403,
      );
      const rejectedImport = page.waitForResponse(
        (response) =>
          response.url().endsWith(`/connectors/${yp.id}/import`) &&
          response.status() === 403,
      );
      await button("Import a version").click();
      await rejectedImport;
      assert.equal((await state()).assets.length, 1);
      await check(
        "Your Priorities import uses real memberships; revocation blocks checking and importing while the immutable imported version remains",
      );

      await workflow
        .getByText("Add or update a connection", { exact: true })
        .click();
      const form = workflow
        .locator("form")
        .filter({ has: page.getByLabel("Binding ID", { exact: true }) });
      await form.getByLabel("Binding ID", { exact: true }).fill("firecrawl");
      await form.getByLabel("Label", { exact: true }).fill("Research web");
      await form
        .getByLabel("Connector", { exact: true })
        .selectOption("firecrawl");
      await form.getByLabel("Group or Google file ID").fill("web");
      await form
        .getByLabel("Settings (JSON)")
        .fill(JSON.stringify({ creditMicros: 1000, maxCreditsPerRequest: 5 }));
      await form
        .getByLabel("Credentials (JSON, encrypted)")
        .fill(JSON.stringify({ apiKey: "fixture-firecrawl-key" }));
      await form.getByRole("button", { name: "Save connection" }).click();
      await expect(
        workflow.getByText("Research web", { exact: true }),
      ).toBeVisible();
      await button("Usage").click();
      await button("Refresh account credits").click();
      await expect(
        workflow.getByRole("region", { name: "Firecrawl usage" }),
      ).toContainText("100,000 account credits remaining");
      const snapshot = await state();
      const graph = structuredClone(snapshot.workspace.graph);
      for (const node of graph.nodes) {
        if (["licenses", "education", "firecrawl"].includes(node.id))
          node.enabled = true;
        if (["licenses", "education"].includes(node.id))
          Object.assign(node.configuration, {
            maxPages: 1,
            queriesPerRound: 1,
            maxSources: 1,
            maxFollowupRounds: 0,
            maxDocuments: 1,
            maxDocumentPages: 1,
            maxDocumentChars: 1000,
          });
      }
      // Fixture graph setup via the production revision-checked API; all normal user actions use the browser.
      await harness.request("/graph", "PUT", {
        graph,
        revision: snapshot.workspace.revision,
      });
      await harness.request("/validate", "POST", {});
      await page.reload();
      await button("Data").click();
      const inputRow = workflow.getByRole("row").filter({
        has: page.getByRole("link", { name: uploaded.name, exact: true }),
      });
      await inputRow.getByRole("checkbox").check();
      await workflow.getByLabel("Trial records", { exact: true }).fill("1");
      await workflow.getByLabel("Trial records", { exact: true }).press("Tab");
      await button("Run 1-record trial").click();
      const completed = await waitFor(
        "research trial",
        async () => {
          const s = await state(),
            run = s.runs[0];
          if (!run) return false;
          if (["paused", "failed", "cancelled"].includes(run.status))
            throw new Error(`${run.status}: ${run.error}`);
          return run.status === "completed" && !s.workspace.activeRunId
            ? s
            : false;
        },
        180000,
        signal,
      );
      const run = completed.runs[0];
      const usage = await harness.request<UsageReservation[]>("/usage");
      const research = usage.filter((item) => item.creditUsage);
      assert.equal(fixtures.calls.length, 4);
      assert.equal(research.length, 4);
      assert.deepEqual(
        research.map((item) => item.creditUsage!.actualCredits).sort(),
        [1, 1, 2, 2],
      );
      for (const id of ["licenses", "education"]) {
        const items = usage.filter((item) => item.nodeId === id);
        assert.equal(
          items.reduce(
            (sum, item) => sum + (item.creditUsage?.actualCredits ?? 0),
            0,
          ),
          3,
        );
        assert.equal(
          items.reduce((sum, item) => sum + item.actualMicros!, 0),
          run.nodeCosts![id].spentMicros,
        );
      }
      assert.ok(usage.every((item) => item.status === "settled"));
      assert.equal(run.reservedMicros, 0);
      await button("Usage").click();
      const credits = workflow.getByRole("region", { name: "Firecrawl usage" });
      await expect(credits).toContainText(
        "6 credits used · 0 credits reserved · 0 unresolved requests",
      );
      await button("Refresh account credits").click();
      await expect(credits).toContainText("99,994 account credits remaining");
      await screenshot("08-research-usage.png");
      await check(
        "Both research agents use real connector/gateway code and reconcile four requests, six fixture credits and per-agent dollar costs",
      );

      const downloaded: Record<string, string> = {};
      for (const ext of ["json", "xlsx"]) {
        const asset = completed.assets.find(
          (item) => item.name === `${run.id}-skills-first.${ext}`,
        )!;
        assert.ok(asset);
        await button("Data").click();
        const pending = page.waitForEvent("download");
        await workflow.locator(`a[href$="/assets/${asset.id}"]`).click();
        const file = path.join(output, `research-results.${ext}`);
        await (await pending).saveAs(file);
        downloaded[ext] = file;
      }
      const memory = JSON.parse(await readFile(downloaded.json, "utf8")) as {
        jobDescriptions: {
          citations: { url: string; quote: string }[];
          analysis: {
            research: Record<
              string,
              { status: string; limits: { fetchedDocuments: number } }
            >;
          };
          degreeAnalysis: {
            deepResearchResults: { sourceUrl: string; evidenceQuote: string }[];
          };
        }[];
      };
      const job = memory.jobDescriptions[0];
      assert.equal(memory.jobDescriptions.length, 1);
      for (const id of ["licenses", "education"]) {
        assert.equal(job.analysis.research[id].status, "known");
        assert.equal(job.analysis.research[id].limits.fetchedDocuments, 1);
      }
      assert.ok(
        job.citations.some(
          (c) => c.url === researchUrl && c.quote === researchQuote,
        ),
      );
      assert.ok(
        job.degreeAnalysis.deepResearchResults.some(
          (c) =>
            c.sourceUrl === researchUrl && c.evidenceQuote === researchQuote,
        ),
      );
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(downloaded.xlsx);
      const legal = workbook.getWorksheet("legal research")!;
      assert.ok(legal);
      const cells: string[] = [];
      legal.eachRow((row) => row.eachCell((cell) => cells.push(cell.text)));
      assert.ok(cells.includes(researchUrl));
      const provenance = workbook.getWorksheet("Review and provenance")!;
      assert.ok(provenance);
      const exportedAnalysis = JSON.parse(
        provenance.getRow(2).getCell(9).text,
      ) as {
        research: Record<
          string,
          { citations: { url: string; quote: string }[] }
        >;
      };
      for (const id of ["licenses", "education"])
        assert.ok(
          exportedAnalysis.research[id].citations.some(
            (citation) =>
              citation.url === researchUrl && citation.quote === researchQuote,
          ),
        );
      await button("Results").click();
      await screenshot("09-research-results.png");
      await check(
        "Research URLs survive the legal research worksheet; exact quotes survive JSON memory and the workbook's review/provenance details",
      );
      await page.reload();
      await button("Usage").click();
      await expect(credits).toContainText("6 credits used");
      assert.equal(fixtures.calls.length, 4);

      // Prove disconnect stops follow-on research even while an already accepted request settles.
      const release = fixtures.holdNextSearch();
      try {
        await button("Data").click();
        await inputRow.getByRole("checkbox").check();
        await workflow.getByLabel("Trial records", { exact: true }).fill("1");
        await workflow
          .getByLabel("Trial records", { exact: true })
          .press("Tab");
        await button("Run 1-record trial").click();
        const pending = await waitFor(
          "reserved search credits",
          async () =>
            (await harness.request<UsageReservation[]>("/usage")).find(
              (item) => item.status === "reserved" && item.creditUsage,
            ),
          90000,
          signal,
        );
        await button("Usage").click();
        await expect(credits).toContainText("5 credits reserved");
        await screenshot("10-reserved-credits.png");
        await button("Data").click();
        await workflow
          .locator(".row")
          .filter({ has: page.getByText("Research web", { exact: true }) })
          .getByRole("button", { name: "Disconnect" })
          .click();
        release();
        await waitFor(
          "revoked run settles accepted request",
          async () => {
            const s = await state(),
              stopped = s.runs.find((item) => item.id === pending.runId)!;
            return stopped.status === "paused" && stopped.reservedMicros === 0;
          },
          60000,
          signal,
        );
        assert.equal(fixtures.calls.length, 5);
        await assert.rejects(
          harness.connectors.request(groupId, {
            id: pending.id,
            runId: pending.runId,
            nodeId: pending.nodeId,
            binding: "firecrawl",
            operation: "search",
            input: { query: "fixture statute", limit: 1 },
          }),
          /not bound/,
        );
        await button("Usage").click();
        await expect(credits).toContainText(
          "8 credits used · 0 credits reserved",
        );
        await screenshot("11-disconnected-research.png");
        await check(
          "Disconnect removes saved-run access, pauses research and still accounts for the already accepted search without another provider call",
        );
      } finally {
        release();
      }
      const ledger = await harness.request<UsageReservation[]>("/usage");
      await writeFile(
        path.join(output, "firecrawl-usage.json"),
        JSON.stringify(
          { simulated: true, ledger, providerCalls: fixtures.calls },
          null,
          2,
        ),
      );
      return {
        providerCalls: fixtures.calls.length,
        fixtureCreditsUsed: 8,
        realProviderCalls: 0,
        workbook: downloaded.xlsx,
      };
    },
  };
}
