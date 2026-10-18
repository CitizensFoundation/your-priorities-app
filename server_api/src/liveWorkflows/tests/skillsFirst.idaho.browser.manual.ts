/** Explicitly invoked local-data browser test; never matched by the automatic test suites. */
import { parseArgs, format } from "node:util";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  apiRoot,
  importManualKey,
  importManualFirecrawlKey,
  manualKeyName,
  manualFirecrawlKeyName,
  requireLiveOptIn,
  resolveManualConfig,
  redactManualText,
} from "./manual/environment.js";
import { prepareIdahoData, idahoSample } from "./manual/idahoData.js";
import { BrowserEvidence } from "./manual/interactiveBrowser.js";
import {
  idahoInstructions,
  idahoResearchInstructions,
  offlineIdahoOperator,
} from "./manual/interactiveBrowserIdaho.js";
import {
  saveIdahoCosts,
  writeIdahoWorkbook,
  idahoQuality,
} from "./manual/idahoReport.js";
import {
  boundedIdahoFirecrawl,
  prepareIdahoResearch,
  saveIdahoResearch,
} from "./manual/idahoResearch.js";
import { connectorFixtures } from "./regression/connectorFixtures.js";
import type { UsageReservation } from "../budget.js";
import {
  archiveIdahoRun,
  restoreIdahoBaseline,
} from "./manual/idahoArchive.js";

const { values } = parseArgs({
  options: {
    prepare: { type: "boolean" },
    offline: { type: "boolean" },
    live: { type: "boolean" },
    drive: { type: "boolean" },
    headed: { type: "boolean" },
    source: { type: "string" },
    output: { type: "string", default: "/tmp/skills-first-idaho" },
    env: { type: "string" },
    research: { type: "boolean" },
    "reuse-research": { type: "boolean" },
    "resume-baseline": { type: "string" },
    "trial-budget-usd": { type: "string", default: "5" },
  },
});
if (values["resume-baseline"]) values["reuse-research"] = true;
if (values["reuse-research"]) values.research = true;
if ([values.prepare, values.offline, values.live].filter(Boolean).length > 1)
  throw new Error("Choose --prepare, --offline or --live");
if ((values.live || values.offline) && !values.drive)
  throw new Error(
    "This on-command browser case requires --drive (optionally --headed)",
  );
const data = await prepareIdahoData(
  values.source ? path.resolve(values.source) : undefined,
);
if (!values.live && !values.offline) {
  const { rows: _rows, ...selection } = data;
  console.info(
    JSON.stringify(
      {
        status: "prepared",
        selection,
        trialRecords: idahoSample,
        credentialsRead: false,
        providerCalls: 0,
        outputParent: values.output,
        steps: [
          "Upload first-100 CSV in the browser before login/chat",
          "Import API key on the server",
          values.research
            ? "Ask Luna to adapt Idaho fields and run five sampled jobs through all agents, including Firecrawl license/education research"
            : "Ask Luna to adapt Idaho fields and run five sampled jobs through all non-web agents",
          "Review and download trial results",
          "Estimate 100 records without approving or executing bulk",
          "Save screenshots, XLSX, per-agent/task costs and separate Codex estimate",
        ],
        webResearch: Boolean(values.research),
        next: "Run --offline --drive to rehearse, or YP_WORKFLOW_MANUAL_LIVE=1 with --live --drive for the capped $5 trial. This case cannot approve bulk work.",
      },
      null,
      2,
    ),
  );
} else {
  const mode = values.live ? "api-key" : "offline";
  const config = resolveManualConfig({
    trialBudgetMicros: Number(values["trial-budget-usd"]) * 1e6,
    codexServiceTier: values.live ? "fast" : "regular",
    processingServiceTier: values.live ? "fast" : "regular",
  });
  if (values.live) {
    requireLiveOptIn(process.env);
    await importManualKey(
      path.resolve(
        values.env ?? path.join(apiRoot, "../.envForAgentDoNotViewOnlyImport"),
      ),
    );
    if (values.research)
      await importManualFirecrawlKey(
        path.resolve(
          values.env ??
            path.join(apiRoot, "../.envForAgentDoNotViewOnlyImport"),
        ),
      );
  } else {
    config.codexModel = "offline-codex";
    config.processingModel = {
      ...config.processingModel,
      id: "offline-model",
      label: "Offline fixture",
      inputMicrosPerMillion: 2_000_000,
      outputMicrosPerMillion: 8_000_000,
      maxOutputTokens: 4096,
      contextTokens: 200000,
      priceVersion: "fixture-only",
    };
  }
  for (const name of ["log", "info", "warn", "error", "debug"] as const) {
    const original = console[name].bind(console);
    console[name] = (...args: unknown[]) =>
      original(redactManualText(format(...args)));
  }
  await mkdir(path.resolve(values.output), { recursive: true, mode: 0o700 });
  const output = await mkdtemp(
    path.join(
      path.resolve(values.output),
      `${mode === "api-key" ? "live" : "offline"}-`,
    ),
  );
  const { rows: _rows, ...selection } = data;
  await writeFile(
    path.join(output, "selection.json"),
    JSON.stringify(selection, null, 2),
    { mode: 0o600 },
  );
  const report: Record<string, unknown> = {
    passed: false,
    status: "starting",
    mode,
    startedAt: new Date().toISOString(),
    output,
    trialRecords: idahoSample,
    population: 100,
    trialCapMicros: config.trialBudgetMicros,
    codexModel: config.codexModel,
    processingModel: config.processingModel.id,
    codexReasoningEffort: config.codexReasoningEffort,
    processingReasoningEffort: config.processingReasoningEffort,
    codexServiceTier: config.codexServiceTier,
    processingServiceTier: config.processingServiceTier,
    bulkApprovalAllowed: false,
    realYourPrioritiesLoginTested: false,
    webResearch: Boolean(values.research),
  };
  const save = () =>
    writeFile(
      path.join(output, "report.json"),
      redactManualText(JSON.stringify(report, null, 2)),
      { mode: 0o600 },
    );
  await save();
  const interruption = new AbortController();
  const onSignal = () =>
    interruption.abort(new Error("Idaho browser test interrupted"));
  const timeout = setTimeout(
    () =>
      interruption.abort(
        new Error("Idaho browser test reached its 90-minute limit"),
      ),
    90 * 60_000,
  );
  process.once("SIGINT", onSignal);
  process.once("SIGTERM", onSignal);
  const { startManualHarness } = await import("./manual/harness.js");
  let harness: Awaited<ReturnType<typeof startManualHarness>> | undefined;
  const fixtures =
    values.research && !values.live ? connectorFixtures() : undefined;
  const firecrawl = boundedIdahoFirecrawl(fixtures?.firecrawlFetch);
  let research: Awaited<ReturnType<typeof prepareIdahoResearch>> | undefined;
  try {
    const evidence = new BrowserEvidence();
    harness = await startManualHarness(config, mode, {
      browserLogin: true,
      codex: "operator",
      offlineTurn: offlineIdahoOperator(
        Boolean(values.research && !values["reuse-research"]),
        Boolean(values["reuse-research"]),
      ),
      offlineProcessingDelayMs: 300,
      processingConcurrency: 3,
      usageDirectory: output,
      observeBrowserRequest: evidence.observe,
      ...(values.research
        ? {
            connectors: {
              firecrawlFetch: firecrawl.firecrawlFetch,
              live: Boolean(values.live),
              processing: fixtures?.processing,
            },
          }
        : {}),
      manualPage: {
        instructions:
          values.research && !values["reuse-research"]
            ? idahoResearchInstructions
            : idahoInstructions,
        fixture: data.fixture,
        filename: path.basename(data.fixture),
      },
    });
    if (values.research) {
      research = await prepareIdahoResearch(
        harness,
        values.live
          ? process.env[manualFirecrawlKeyName]!
          : "fixture-firecrawl-key",
      );
      report.firecrawl = research;
    }
    evidence.requests.length = 0;
    report.url = harness.baseUrl;
    report.status = "driving_browser";
    await save();
    console.info(
      `[idaho-browser] Browser: ${harness.baseUrl}\n[idaho-browser] Evidence: ${output}`,
    );
    const { driveBrowserIdaho } =
      await import("./manual/browserIdahoDriver.js");
    const baselineOutput = values["reuse-research"]
      ? path.join(output, "baseline")
      : output;
    await mkdir(baselineOutput, { recursive: true });
    const baseline = values["resume-baseline"]
      ? await restoreIdahoBaseline(
          harness,
          path.resolve(values["resume-baseline"]),
        )
      : await driveBrowserIdaho(
          harness,
          config,
          data,
          evidence,
          baselineOutput,
          Boolean(values.headed),
          interruption.signal,
          Boolean(values.research && !values["reuse-research"]),
        );
    Object.assign(report, baseline);
    if (!values["resume-baseline"]) {
      const completed = (
        await harness.request<YpWorkflowSnapshot>("")
      ).runs.find((r) => r.id === baseline.trialRunId)!;
      await archiveIdahoRun(
        harness,
        completed,
        path.join(output, "baseline-archive"),
      );
    }
    if (values["reuse-research"]) {
      const { driveBrowserIdahoReuse } =
        await import("./manual/browserIdahoReuse.js");
      report.reuse = await driveBrowserIdahoReuse(
        harness,
        baseline.trialRunId,
        output,
        Boolean(values.headed),
        interruption.signal,
      );
    }
    report.passed = true;
    report.status = "passed";
  } catch (error) {
    report.status = interruption.signal.aborted ? "incomplete" : "failed";
    report.error = redactManualText(
      error instanceof Error ? (error.stack ?? error.message) : String(error),
    );
    process.exitCode = interruption.signal.aborted ? 130 : 1;
  } finally {
    clearTimeout(timeout);
    if (harness) {
      try {
        await harness.drainPaidRequests();
        const snapshot = await harness.request<YpWorkflowSnapshot>("");
        // Preserve paid receipts even when a stage pauses before producing final artifacts.
        await writeFile(
          path.join(output, "processing-ledger.json"),
          redactManualText(
            JSON.stringify(
              await harness.request<UsageReservation[]>("/usage"),
              null,
              2,
            ),
          ),
          { mode: 0o600 },
        );
        for (const run of snapshot.runs)
          await writeFile(
            path.join(
              output,
              `${run.mode === "trial" ? "trial" : "estimate"}${values["reuse-research"] ? `-${run.id}` : ""}-run.json`,
            ),
            JSON.stringify(run, null, 2),
            { mode: 0o600 },
          );
        for (const run of snapshot.runs.filter(
          (r) => Object.keys(r.stageOutputs ?? {}).length,
        )) {
          // A recovered legacy baseline already has its own externally retained archive.
          if (values["resume-baseline"] && run.id === report.trialRunId)
            continue;
          try {
            await archiveIdahoRun(
              harness,
              run,
              path.join(output, `archive-${run.id}`),
            );
          } catch (error) {
            report.archiveError = redactManualText(String(error));
          }
        }
        report.diagnostics = snapshot.runs.map(
          ({
            id,
            mode,
            status,
            error,
            spentMicros,
            reservedMicros,
            nodeStates,
          }) => ({
            id,
            mode,
            status,
            error,
            spentMicros,
            reservedMicros,
            nodeStates,
          }),
        );
        const saved = await readFile(
          path.join(output, "last-run-results.json"),
          "utf8",
        ).catch(() => "[]");
        const rows = JSON.parse(saved) as Record<string, unknown>[];
        if (research)
          report.research = await saveIdahoResearch(
            harness,
            output,
            research,
            rows,
            firecrawl.paidRequests(),
          );
        const costs = await saveIdahoCosts(
          harness,
          output,
          rows.map((row) => String(row.id)),
        );
        report.costs = costs;
        // Retain reviewable output even if the product refuses an estimate or acceptance fails.
        if (rows.length) {
          // Keep the exact browser-downloaded artifact, even during failure cleanup.
          // A local re-export is only a fallback when no download reached disk.
          const downloaded = await readFile(
            path.join(output, "idaho-trial-results.xlsx"),
          ).catch((error: NodeJS.ErrnoException) => {
            if (error.code === "ENOENT") return undefined;
            throw error;
          });
          report.workbook = await writeIdahoWorkbook(
            output,
            rows,
            costs,
            downloaded,
          );
          report.qualityReview = idahoQuality(rows);
        }
      } catch (error) {
        report.costReportError = redactManualText(String(error));
      }
      try {
        await harness.close();
      } catch (error) {
        report.cleanupError = redactManualText(String(error));
        report.passed = false;
        report.status = "failed";
        process.exitCode = 1;
      }
      report.codexUsage = harness.codexUsage.report();
    }
    process.removeListener("SIGINT", onSignal);
    process.removeListener("SIGTERM", onSignal);
    report.finishedAt = new Date().toISOString();
    await save();
    console.info(
      `[idaho-browser] ${report.passed ? "PASS" : "INCOMPLETE / FAIL"}: ${path.join(output, "report.json")}`,
    );
    if (report.error) console.error(report.error);
    delete process.env[manualKeyName];
    delete process.env[manualFirecrawlKeyName];
  }
}
