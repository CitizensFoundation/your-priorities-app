/** Explicitly invoked local-data browser test; never matched by the automatic test suites. */
import { parseArgs, format } from "node:util";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  apiRoot,
  importManualKey,
  manualKeyName,
  requireLiveOptIn,
  resolveManualConfig,
  redactManualText,
} from "./manual/environment.js";
import { prepareIdahoData, idahoSample } from "./manual/idahoData.js";
import { BrowserEvidence } from "./manual/interactiveBrowser.js";
import {
  idahoInstructions,
  offlineIdahoOperator,
} from "./manual/interactiveBrowserIdaho.js";
import {
  saveIdahoCosts,
  writeIdahoWorkbook,
  idahoQuality,
} from "./manual/idahoReport.js";

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
  },
});
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
          "Ask Luna to adapt Idaho fields and run five sampled jobs through all non-web agents",
          "Review and download trial results",
          "Estimate 100 records without approving or executing bulk",
          "Save screenshots, XLSX, per-agent/task costs and separate Codex estimate",
        ],
        next: "Run --offline --drive to rehearse, or YP_WORKFLOW_MANUAL_LIVE=1 with --live --drive for the capped $5 trial. This case cannot approve bulk work.",
      },
      null,
      2,
    ),
  );
} else {
  const mode = values.live ? "api-key" : "offline";
  const config = resolveManualConfig({
    trialBudgetMicros: 5_000_000,
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
  try {
    const evidence = new BrowserEvidence();
    harness = await startManualHarness(config, mode, {
      browserLogin: true,
      codex: "operator",
      offlineTurn: offlineIdahoOperator(),
      offlineProcessingDelayMs: 300,
      processingConcurrency: 3,
      usageDirectory: output,
      observeBrowserRequest: evidence.observe,
      manualPage: {
        instructions: idahoInstructions,
        fixture: data.fixture,
        filename: path.basename(data.fixture),
      },
    });
    evidence.requests.length = 0;
    report.url = harness.baseUrl;
    report.status = "driving_browser";
    await save();
    console.info(
      `[idaho-browser] Browser: ${harness.baseUrl}\n[idaho-browser] Evidence: ${output}`,
    );
    const { driveBrowserIdaho } =
      await import("./manual/browserIdahoDriver.js");
    Object.assign(
      report,
      await driveBrowserIdaho(
        harness,
        config,
        data,
        evidence,
        output,
        Boolean(values.headed),
        interruption.signal,
      ),
    );
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
        const snapshot = await harness.request<YpWorkflowSnapshot>("");
        for (const run of snapshot.runs)
          await writeFile(
            path.join(
              output,
              `${run.mode === "trial" ? "trial" : "estimate"}-run.json`,
            ),
            JSON.stringify(run, null, 2),
            { mode: 0o600 },
          );
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
  }
}
