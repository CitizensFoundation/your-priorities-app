/** Explicit executable: excluded from the normal *.test.ts suites. Never imports keys on preparation/rehearsal. */
import { parseArgs, format } from "node:util";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { workflowModelDefaults } from "../modelDefaults.js";
import { apiRoot, fixturePath, importFile, manualKeyName, importManualKey, readManualConfig, requireLiveOptIn, redactManualText, } from "./manual/environment.js";
const { values } = parseArgs({
    options: {
        prepare: { type: "boolean" },
        offline: { type: "boolean" },
        live: { type: "boolean" },
        config: { type: "string" },
        env: { type: "string" },
        auth: { type: "string", default: "api-key" },
        headed: { type: "boolean" },
    },
});
if ([values.prepare, values.offline, values.live].filter(Boolean).length > 1)
    throw new Error("Choose one of --prepare, --offline or --live");
if (!["api-key", "chatgpt"].includes(values.auth))
    throw new Error("--auth must be api-key or chatgpt");
const mode = values.live ? values.auth : "offline";
if (!values.offline && !values.live) {
    const jobs = JSON.parse(await readFile(fixturePath, "utf8"));
    console.info(JSON.stringify({
        status: "prepared",
        package: "skills-first",
        records: jobs.length,
        fixture: fixturePath,
        stages: ["normalize", "levels", "analyze", "rewrite", "export"],
        credentialsRead: false,
        providerCalls: 0,
        modelDefaults: workflowModelDefaults,
        pricingSource: "Backend NewAiModelSetup shared model definitions",
        next: "Run --offline now. For a paid run, copy manual/config.example.json to .live-workflow-manual/config.json, supply .envForImportOnly, --live and YP_WORKFLOW_MANUAL_LIVE=1.",
    }, null, 2));
}
else {
    let config;
    if (values.live) {
        requireLiveOptIn(process.env);
        config = await readManualConfig(path.resolve(values.config ??
            path.join(apiRoot, ".live-workflow-manual/config.json")));
        await importManualKey(path.resolve(values.env ?? importFile));
    }
    else
        config = {
            codexModel: "offline-codex",
            codexServiceTier: "regular",
            processingServiceTier: "regular",
            codexReasoningEffort: workflowModelDefaults.codexReasoningEffort,
            processingReasoningEffort: workflowModelDefaults.processingReasoningEffort,
            processingModel: {
                id: "offline-model",
                label: "Offline fixture",
                provider: "openai",
                reasoning: true,
                keyEnv: manualKeyName,
                inputMicrosPerMillion: 2000000,
                outputMicrosPerMillion: 8000000,
                maxOutputTokens: 4096,
                contextTokens: 200000,
                priceVersion: "fixture-only",
            },
            trialBudgetMicros: 2000000,
        };
    // Do not allow SDK error messages to disclose an imported key in stdout/stderr.
    for (const name of ["log", "info", "warn", "error", "debug"]) {
        const original = console[name].bind(console);
        console[name] = (...args) => original(redactManualText(format(...args)));
    }
    const directory = path.join(apiRoot, ".live-workflow-manual/results");
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const outputDir = await mkdtemp(path.join(directory, `${mode}-`));
    const { startManualHarness } = await import("./manual/harness.js");
    const { runManualScenario } = await import("./manual/scenario.js");
    let harness;
    const report = {
        mode,
        startedAt: new Date().toISOString(),
        passed: false,
        processingModel: config.processingModel.id,
        priceVersion: config.processingModel.priceVersion,
        codexModel: config.codexModel,
        codexServiceTier: config.codexServiceTier,
        processingServiceTier: config.processingServiceTier,
        codexReasoningEffort: config.codexReasoningEffort,
        processingReasoningEffort: config.processingReasoningEffort,
    };
    const interruption = new AbortController();
    const onSignal = () => interruption.abort(new Error("Manual test interrupted"));
    process.once("SIGINT", onSignal);
    process.once("SIGTERM", onSignal);
    try {
        harness = await startManualHarness(config, mode, {
            usageDirectory: outputDir,
        });
        interruption.signal.throwIfAborted();
        console.info(`[manual] Local workflow: ${harness.baseUrl}`);
        Object.assign(report, await runManualScenario(harness, outputDir, Boolean(values.headed), mode === "chatgpt", interruption.signal));
        report.passed = true;
    }
    catch (error) {
        report.error = redactManualText(error instanceof Error ? error.message : String(error));
        // Persist only status/cost/progress metadata, never account records, prompts, or request results.
        if (harness)
            try {
                const snapshot = await harness.request("");
                report.diagnostics = snapshot.runs.map((run) => ({
                    id: run.id,
                    status: run.status,
                    spentMicros: run.spentMicros,
                    reservedMicros: run.reservedMicros,
                    nodeStates: run.nodeStates,
                }));
            }
            catch {
                /* API may have failed during startup. */
            }
        report.interrupted = interruption.signal.aborted;
        process.exitCode = interruption.signal.aborted ? 130 : 1;
    }
    finally {
        try {
            await harness?.close();
        }
        catch (error) {
            report.cleanupError = redactManualText(error instanceof Error ? error.message : String(error));
            report.passed = false;
            process.exitCode = 1;
        }
        process.removeListener("SIGINT", onSignal);
        if (harness)
            report.codexUsage = harness.codexUsage.report();
        process.removeListener("SIGTERM", onSignal);
        report.finishedAt = new Date().toISOString();
        await writeFile(path.join(outputDir, "report.json"), redactManualText(JSON.stringify(report, null, 2)), { mode: 0o600 });
        console.info(`[manual] ${report.passed ? "PASS" : "FAIL"}: ${path.join(outputDir, "report.json")}`);
        if (report.error)
            console.error(report.error);
        if (report.cleanupError)
            console.error(report.cleanupError);
        delete process.env[manualKeyName];
    }
}
