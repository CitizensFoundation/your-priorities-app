/** On-demand browser session; --drive explicitly opts into the ui-features browser driver. */
import { parseArgs, format } from "node:util";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import path from "node:path";
import {
  apiRoot,
  importManualKey,
  manualKeyName,
  readManualConfig,
  requireLiveOptIn,
  redactManualText,
  type ManualConfig,
} from "./manual/environment.js";
import { workflowModelDefaults } from "../modelDefaults.js";
import {
  BrowserEvidence,
  browserFixture,
  browserGreeting,
  browserExperiment,
  browserInstructions,
  offlineBrowserOperator,
  verifyInteractiveBrowser,
} from "./manual/interactiveBrowser.js";
import {
  browserBulkFixture,
  browserBulkExperiment,
  browserBulkInstructions,
  verifyInteractiveBulkBrowser,
} from "./manual/interactiveBrowserBulk.js";
import {
  browserFeaturesExperiment,
  browserFeaturesInstructions,
  offlineBrowserFeaturesOperator,
  verifyInteractiveFeaturesBrowser,
} from "./manual/interactiveBrowserFeatures.js";

const { values } = parseArgs({
  options: {
    prepare: { type: "boolean" },
    offline: { type: "boolean" },
    live: { type: "boolean" },
    config: { type: "string" },
    env: { type: "string" },
    port: { type: "string", default: "0" },
    case: { type: "string", default: "simple" },
    drive: { type: "boolean" },
    headed: { type: "boolean" },
  },
});
if (!["simple", "approved-bulk", "ui-features"].includes(values.case))
  throw new Error("Choose --case simple, approved-bulk or ui-features");
const bulk = values.case === "approved-bulk";
const features = values.case === "ui-features";
if ((values.drive && !features) || (values.headed && !values.drive))
  throw new Error(
    "--drive is only for --case ui-features; --headed requires --drive",
  );
const fixture = bulk ? browserBulkFixture : browserFixture;
const experiment = features
  ? browserFeaturesExperiment
  : bulk
    ? browserBulkExperiment
    : browserExperiment;
if ([values.prepare, values.offline, values.live].filter(Boolean).length > 1)
  throw new Error("Choose --prepare, --offline or --live");
const port = Number(values.port);
if (
  !Number.isInteger(port) ||
  port < 0 ||
  port > 65535 ||
  (port > 0 && port < 1024)
)
  throw new Error("--port must be 0 (choose a free port) or 1024–65535");
const liveConfig = new URL(
  features
    ? "manual/browser-features.config.example.json"
    : bulk
      ? "manual/browser-bulk.config.example.json"
      : "manual/browser.config.example.json",
  import.meta.url,
).pathname;
if (!values.live && !values.offline) {
  console.info(
    JSON.stringify(
      {
        status: "prepared",
        execution: values.drive
          ? "on-demand Chromium driver; never part of automatic test suites"
          : "interactive browser; never part of automatic test suites",
        authentication:
          "OpenAI API-key login via a server-side key import; isolated Your Priorities user/group fixture",
        case: values.case,
        fixture,
        records: bulk ? 10 : 1,
        credentialsRead: false,
        providerCalls: 0,
        modelDefaults: workflowModelDefaults,
        config: liveConfig,
        steps: [
          "Use imported test key",
          "Greet Codex",
          bulk ? "Upload ten-job recruitment export" : "Upload text document",
          "Ask Codex to run trial",
          ...(features
            ? [
                "Review first trial, graph activity and evidence",
                "Cancel a model edit, then save an alternative model, reasoning and agent cap",
                "Refresh; verify draft persistence and immutable first-run settings",
                "Start a second one-record targeted trial using the UI",
                "Compare results and models; inspect usage, revisions, storage and mobile popup",
                "Verify browser-saved source and both result documents",
              ]
            : bulk
              ? [
                  "Inspect adapter and dependencies; review two-record trial",
                  "Estimate and approve ten-record bulk run in browser",
                  "Pause at the checkpoint, refresh and resume without increasing the cap",
                  "Search results; download and open both runs' adapted inputs and analysis results",
                ]
              : ["Download and open JSON/CSV/Markdown"]),
          values.drive
            ? "Browser assertions and acceptance verifier finish the test"
            : "Press Enter in terminal to verify and finish",
        ],
        next: "Run --offline to rehearse through a real browser, or YP_WORKFLOW_MANUAL_LIVE=1 with --live to use API-key Codex and paid processing. Add --case ui-features --drive to explicitly automate the UI steps.",
      },
      null,
      2,
    ),
  );
} else {
  if (!process.stdin.isTTY && !values.drive)
    throw new Error(
      "Run this browser test in an interactive terminal (TTY); it waits for you to finish",
    );
  const mode = values.live ? "api-key" : "offline";
  let config: ManualConfig;
  if (values.live) {
    requireLiveOptIn(process.env);
    config = await readManualConfig(path.resolve(values.config ?? liveConfig));
    if (features && !config.comparisonProcessingModel)
      throw new Error(
        "ui-features requires comparisonProcessingModel in the config",
      );
    await importManualKey(
      path.resolve(
        values.env ?? path.join(apiRoot, "../.envForAgentDoNotViewOnlyImport"),
      ),
    );
  } else {
    config = {
      codexModel: "offline-codex",
      codexServiceTier: "regular",
      processingServiceTier: "regular",
      codexReasoningEffort: workflowModelDefaults.codexReasoningEffort,
      processingReasoningEffort:
        workflowModelDefaults.processingReasoningEffort,
      trialBudgetMicros: bulk || features ? 5_000_000 : 2_000_000,
      processingModel: {
        id: "offline-model",
        label: "Offline fixture",
        provider: "openai",
        reasoning: true,
        keyEnv: manualKeyName,
        inputMicrosPerMillion: 2_000_000,
        outputMicrosPerMillion: 8_000_000,
        maxOutputTokens: 4096,
        contextTokens: 200000,
        priceVersion: "fixture-only",
      },
    };
    if (features)
      config.comparisonProcessingModel = {
        ...config.processingModel,
        id: "offline-alternative",
        label: "Offline comparison model",
        inputMicrosPerMillion: 3_000_000,
        outputMicrosPerMillion: 9_000_000,
        priceVersion: "fixture-comparison-only",
      };
  }
  for (const name of ["log", "info", "warn", "error", "debug"] as const) {
    const original = console[name].bind(console);
    console[name] = (...args: unknown[]) =>
      original(redactManualText(format(...args)));
  }
  const parent = path.join(apiRoot, ".live-workflow-manual/results");
  await mkdir(parent, { recursive: true, mode: 0o700 });
  const output = await mkdtemp(
    path.join(
      parent,
      `browser-${features ? "features-" : bulk ? "bulk-" : ""}${mode}-`,
    ),
  );
  const report: Record<string, unknown> = {
    passed: false,
    status: "starting",
    mode,
    case: values.case,
    interactive: !values.drive,
    startedAt: new Date().toISOString(),
    codexModel: config.codexModel,
    processingModel: config.processingModel.id,
    comparisonProcessingModel: config.comparisonProcessingModel?.id,
    codexReasoningEffort: config.codexReasoningEffort,
    processingReasoningEffort: config.processingReasoningEffort,
    codexServiceTier: config.codexServiceTier,
    processingServiceTier: config.processingServiceTier,
    processingAllowanceMicros: config.trialBudgetMicros,
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
    interruption.abort(new Error("Browser test stopped before verification"));
  const timeout = setTimeout(
    () =>
      interruption.abort(
        new Error("Browser test reached its 90-minute session limit"),
      ),
    90 * 60_000,
  );
  process.once("SIGINT", onSignal);
  process.once("SIGTERM", onSignal);
  const { startManualHarness } = await import("./manual/harness.js");
  let harness: Awaited<ReturnType<typeof startManualHarness>> | undefined;
  let terminal: ReturnType<typeof createInterface> | undefined;
  try {
    const evidence = new BrowserEvidence();
    harness = await startManualHarness(config, mode, {
      port,
      browserLogin: true,
      browserBatch: bulk,
      codex: "operator",
      offlineTurn: features
        ? offlineBrowserFeaturesOperator()
        : offlineBrowserOperator(bulk),
      offlineProcessingDelayMs: features ? 1000 : undefined,
      usageDirectory: output,
      observeBrowserRequest: evidence.observe,
      manualPage: {
        instructions: features
          ? browserFeaturesInstructions
          : bulk
            ? browserBulkInstructions
            : browserInstructions,
        fixture,
        filename: path.basename(fixture),
      },
    });
    // Harness provisioning is not a browser interaction (including its initial graph save).
    evidence.requests.length = 0;
    interruption.signal.throwIfAborted();
    report.status = "waiting_for_browser";
    report.url = harness.baseUrl;
    await save();
    console.info(`[browser-manual] Open: ${harness.baseUrl}`);
    console.info(`[browser-manual] Fixture: ${fixture}`);
    console.info(`[browser-manual] Evidence directory: ${output}`);
    console.info(
      `[browser-manual] ${mode === "api-key" ? "Click Use imported test key in the browser. The real key stays on the local server." : "Click Use imported test key for offline login; no real keys were imported."}`,
    );
    console.info(`[browser-manual] First message: ${browserGreeting}`);
    console.info(
      `[browser-manual] Upload the fixture, then send: ${experiment}`,
    );
    if (values.drive) {
      const { driveBrowserFeatures } =
        await import("./manual/browserFeaturesDriver.js");
      report.status = "driving_browser";
      await save();
      Object.assign(
        report,
        await driveBrowserFeatures(
          harness,
          config,
          output,
          Boolean(values.headed),
          interruption.signal,
        ),
      );
      Object.assign(
        report,
        await verifyInteractiveFeaturesBrowser(
          harness,
          evidence,
          output,
          config,
        ),
      );
      report.passed = true;
      report.status = "passed";
      await save();
    } else {
      terminal = createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      terminal.on("SIGINT", onSignal);
      terminal.on("close", () => {
        if (!report.passed) onSignal();
      });
      while (!report.passed) {
        await terminal.question(
          "[browser-manual] After completing the browser steps and saving/opening all required downloads, press Enter to verify and finish (Ctrl+C to stop): ",
          { signal: interruption.signal },
        );
        interruption.signal.throwIfAborted();
        try {
          Object.assign(
            report,
            await (features
              ? verifyInteractiveFeaturesBrowser(
                  harness,
                  evidence,
                  output,
                  config,
                )
              : (bulk
                  ? verifyInteractiveBulkBrowser
                  : verifyInteractiveBrowser)(harness, evidence, output, mode)),
          );
          report.browserOperatorConfirmedReview = true;
          report.passed = true;
          report.status = "passed";
          delete report.lastCheckError;
        } catch (error) {
          report.lastCheckError = redactManualText(
            error instanceof Error ? error.message : String(error),
          );
          console.info(
            `[browser-manual] Not finished: ${report.lastCheckError}`,
          );
        }
        await save();
      }
    }
  } catch (error) {
    report.status = interruption.signal.aborted ? "incomplete" : "failed";
    report.error = redactManualText(
      error instanceof Error ? error.message : String(error),
    );
    process.exitCode = interruption.signal.aborted ? 130 : 1;
  } finally {
    clearTimeout(timeout);
    terminal?.close();
    if (harness) {
      try {
        const snapshot = await harness.request<YpWorkflowSnapshot>("");
        report.processingSpentMicros = snapshot.workspace.spentMicros;
        report.processingReservedMicros = snapshot.workspace.reservedMicros;
        report.diagnostics = snapshot.runs.map((run) => ({
          id: run.id,
          status: run.status,
          spentMicros: run.spentMicros,
          reservedMicros: run.reservedMicros,
          nodeStates: run.nodeStates,
        }));
      } catch {
        /* Keep the previous report if the API has stopped. */
      }
      try {
        await harness.close();
      } catch (error) {
        report.cleanupError = redactManualText(String(error));
        report.status = "failed";
        report.passed = false;
        process.exitCode = 1;
      }
      report.codexUsage = harness.codexUsage.report();
    }
    process.removeListener("SIGINT", onSignal);
    process.removeListener("SIGTERM", onSignal);
    report.finishedAt = new Date().toISOString();
    await save();
    console.info(
      `[browser-manual] ${report.passed ? "PASS" : "INCOMPLETE / FAIL"}: ${path.join(output, "report.json")}`,
    );
    if (report.error) console.error(report.error);
    if (report.cleanupError) console.error(report.cleanupError);
    delete process.env[manualKeyName];
  }
}
