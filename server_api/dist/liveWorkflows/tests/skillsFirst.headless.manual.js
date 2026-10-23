/** Explicit browser-free manual suite. No credential import or provider calls without both live opt-ins. */
import assert from "node:assert/strict";
import { parseArgs, format } from "node:util";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import path from "node:path";
import { apiRoot, importFile, manualKeyName, importManualKey, readManualConfig, requireLiveOptIn, redactManualText, } from "./manual/environment.js";
import { headlessCaseBudget, selectHeadlessCases, } from "./manual/headlessCases.js";
import { workflowModelDefaults } from "../modelDefaults.js";
const { values } = parseArgs({
    options: {
        prepare: { type: "boolean" },
        offline: { type: "boolean" },
        live: { type: "boolean" },
        case: { type: "string", default: "all" },
        config: { type: "string" },
        env: { type: "string" },
    },
});
if ([values.prepare, values.offline, values.live].filter(Boolean).length > 1)
    throw new Error("Choose one of --prepare, --offline or --live");
const selected = selectHeadlessCases(values.case);
if (!values.offline && !values.live) {
    console.info(JSON.stringify({
        status: "prepared",
        browser: false,
        scenarios: selected,
        credentialsRead: false,
        providerCalls: 0,
        modelDefaults: workflowModelDefaults,
        requirements: "Existing PostgreSQL and processing Docker images; live Codex cases also need the Codex image and Sysbox. No Playwright or UI build.",
        next: "Use --offline to rehearse. Paid runs require --live, YP_WORKFLOW_MANUAL_LIVE=1, --config and the import-only --env file. Processing allowance is divided across selected cases; Codex API charges are separate.",
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
            trialBudgetMicros: 2000000,
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
        };
    for (const name of ["log", "info", "warn", "error", "debug"]) {
        const original = console[name].bind(console);
        console[name] = (...args) => original(redactManualText(format(...args)));
    }
    const parent = path.join(apiRoot, ".live-workflow-manual/results");
    await mkdir(parent, { recursive: true, mode: 0o700 });
    const output = await mkdtemp(path.join(parent, `headless-${values.live ? "live" : "offline"}-`));
    const { startManualHarness } = await import("./manual/harness.js");
    const { runHeadlessCase } = await import("./manual/headlessScenarios.js");
    const { offlineOperator } = await import("./manual/headlessRehearsal.js");
    const reports = [];
    const allowance = headlessCaseBudget(config.trialBudgetMicros, selected.length);
    const startedAt = new Date().toISOString();
    const interruption = new AbortController();
    const onSignal = () => interruption.abort(new Error("Headless manual test interrupted"));
    process.once("SIGINT", onSignal);
    process.once("SIGTERM", onSignal);
    try {
        for (const name of selected) {
            interruption.signal.throwIfAborted();
            const directory = path.join(output, name);
            await mkdir(directory, { mode: 0o700 });
            const report = {
                name,
                passed: false,
                startedAt: new Date().toISOString(),
                processingAllowanceMicros: allowance,
            };
            reports.push(report);
            let harness;
            try {
                harness = await startManualHarness({ ...config, trialBudgetMicros: allowance }, values.live ? "api-key" : "offline", {
                    headless: true,
                    codex: "operator",
                    offlineTurn: offlineOperator(name === "adapt-format" || name === "approved-bulk"),
                    usageDirectory: directory,
                });
                Object.assign(report, await runHeadlessCase(name, harness, directory, interruption.signal));
                report.passed = true;
            }
            catch (error) {
                report.error = redactManualText(error instanceof Error ? error.message : String(error));
                process.exitCode = interruption.signal.aborted ? 130 : 1;
            }
            finally {
                if (harness)
                    try {
                        const snapshot = await harness.request("");
                        report.processingSpentMicros = snapshot.workspace.spentMicros;
                        report.processingReservedMicros = snapshot.workspace.reservedMicros;
                        const usage = await harness.request("/usage");
                        report.processingAppliedServiceTiers = [
                            ...new Set(usage.map((item) => item.result?.appliedServiceTier ?? "unreported")),
                        ];
                        report.diagnostics = snapshot.runs.map((run) => ({
                            id: run.id,
                            mode: run.mode,
                            status: run.status,
                            error: run.error,
                            spentMicros: run.spentMicros,
                            reservedMicros: run.reservedMicros,
                            nodeStates: run.nodeStates,
                        }));
                        assert.ok(snapshot.workspace.spentMicros <= allowance, "Scenario exceeded its processing allowance");
                    }
                    catch (error) {
                        report.diagnosticsError = String(error);
                        report.passed = false;
                        process.exitCode = 1;
                    }
                try {
                    await harness?.close();
                }
                catch (error) {
                    report.cleanupError = String(error);
                    report.passed = false;
                    process.exitCode = 1;
                }
                if (harness) {
                    report.codexUsage = harness.codexUsage.report();
                    const usage = harness.codexUsage.report();
                    if (!usage.usageComplete ||
                        !usage.pricingComplete ||
                        (["adapt-format", "codex-trial", "approved-bulk"].includes(name) &&
                            usage.turns !== 2)) {
                        report.codexUsageError =
                            "Codex usage is incomplete or unpriced; inspect codex-usage.json.";
                        report.passed = false;
                        process.exitCode = 1;
                    }
                }
                report.finishedAt = new Date().toISOString();
                await writeFile(path.join(directory, "report.json"), redactManualText(JSON.stringify(report, null, 2)), { mode: 0o600 });
                console.info(`[headless] ${report.passed ? "PASS" : "FAIL"} ${name}: ${path.join(directory, "report.json")}`);
                if (report.error)
                    console.error(report.error);
                if (report.cleanupError)
                    console.error(report.cleanupError);
            }
            if (!report.passed)
                break; // No whole-case paid retries or automatic allowance increases.
        }
    }
    catch (error) {
        console.error(error instanceof Error ? error.message : String(error));
        process.exitCode = interruption.signal.aborted ? 130 : 1;
    }
    finally {
        process.removeListener("SIGINT", onSignal);
        process.removeListener("SIGTERM", onSignal);
        const report = {
            passed: reports.length === selected.length &&
                reports.every((item) => item.passed === true),
            startedAt,
            finishedAt: new Date().toISOString(),
            mode: values.live ? "api-key" : "offline",
            browser: false,
            codexModel: config.codexModel,
            codexServiceTier: config.codexServiceTier,
            processingServiceTier: config.processingServiceTier,
            codexReasoningEffort: config.codexReasoningEffort,
            processingReasoningEffort: config.processingReasoningEffort,
            processingModel: config.processingModel.id,
            priceVersion: config.processingModel.priceVersion,
            processingAllowanceMicros: config.trialBudgetMicros,
            processingSpentMicros: reports.reduce((sum, item) => sum + Number(item.processingSpentMicros ?? 0), 0),
            processingReservedMicros: reports.reduce((sum, item) => sum + Number(item.processingReservedMicros ?? 0), 0),
            codexCostIncluded: false,
            codexEstimatedCostMicros: reports.every((item) => {
                const usage = item.codexUsage;
                return usage?.usageComplete && usage.pricingComplete;
            })
                ? reports.reduce((sum, item) => sum +
                    Number(item.codexUsage
                        .estimatedCostMicros), 0)
                : null,
            requestedCases: selected,
            cases: reports,
        };
        await writeFile(path.join(output, "report.json"), redactManualText(JSON.stringify(report, null, 2)), { mode: 0o600 });
        console.info(`[headless] ${report.passed ? "PASS" : "FAIL"} suite: ${path.join(output, "report.json")}`);
        if (!report.passed)
            process.exitCode || (process.exitCode = 1);
        delete process.env[manualKeyName];
    }
}
