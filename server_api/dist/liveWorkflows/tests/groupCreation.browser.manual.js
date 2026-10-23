/** Explicitly invoked browser test; never imported by the ordinary test suites. */
import { parseArgs, format } from "node:util";
import { randomBytes } from "node:crypto";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import path from "node:path";
import { apiRoot, importManualKey, manualKeyName, readManualConfig, requireLiveOptIn, redactManualText, } from "./manual/environment.js";
import { workflowModelDefaults } from "../modelDefaults.js";
const { values } = parseArgs({
    options: {
        prepare: { type: "boolean" },
        offline: { type: "boolean" },
        live: { type: "boolean" },
        headed: { type: "boolean" },
        config: { type: "string" },
        env: { type: "string" },
        output: { type: "string", default: "/tmp/skills-first-group-creation" },
    },
});
if ([values.prepare, values.offline, values.live].filter(Boolean).length > 1)
    throw new Error("Choose --prepare, --offline or --live");
const configFile = new URL("manual/group-creation.config.example.json", import.meta.url).pathname;
if (!values.offline && !values.live) {
    console.info(JSON.stringify({
        status: "prepared",
        credentialsRead: false,
        providerCalls: 0,
        execution: "Explicit on-demand Chromium test; add --headed to watch",
        steps: [
            "Create a Live Workflow group in the normal group form",
            "Configure Skills First and a connected VM host with zero processing budgets",
            "Reload the saved group",
            "Take operator control and connect the server-imported API key",
            "Send one greeting, verify the streamed reply and cost",
            "Reload chat/settings and verify group isolation",
        ],
        fixtures: "Disposable PostgreSQL, application user/community, recorded background jobs; production group models, router, forms and workflow runtime",
        realYourPrioritiesLoginTested: false,
        chatgptLoginTested: false,
        modelDefaults: workflowModelDefaults,
        config: configFile,
        output: path.resolve(values.output),
        next: "Run --offline to rehearse, or YP_WORKFLOW_MANUAL_LIVE=1 with --live for one paid Codex greeting",
    }, null, 2));
}
else {
    const mode = values.live ? "api-key" : "offline";
    let config;
    if (values.live) {
        requireLiveOptIn(process.env);
        config = await readManualConfig(path.resolve(values.config ?? configFile));
        await importManualKey(path.resolve(values.env ?? path.join(apiRoot, "../.envForAgentDoNotViewOnlyImport")));
    }
    else {
        config = {
            codexModel: "offline-codex",
            codexServiceTier: "regular",
            processingServiceTier: "regular",
            codexReasoningEffort: "max",
            processingReasoningEffort: "max",
            trialBudgetMicros: 0,
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
    }
    for (const name of ["log", "info", "warn", "error", "debug"]) {
        const original = console[name].bind(console);
        console[name] = (...args) => original(redactManualText(format(...args)));
    }
    await mkdir(path.resolve(values.output), { recursive: true, mode: 0o700 });
    const output = await mkdtemp(path.join(path.resolve(values.output), `${mode}-`));
    const report = {
        passed: false,
        status: "starting",
        mode,
        startedAt: new Date().toISOString(),
        codexModel: config.codexModel,
        codexReasoningEffort: config.codexReasoningEffort,
        codexServiceTier: config.codexServiceTier,
        processingAllowanceMicros: 0,
        realYourPrioritiesLoginTested: false,
        chatgptLoginTested: false,
    };
    const save = () => writeFile(path.join(output, "report.json"), redactManualText(JSON.stringify(report, null, 2)), { mode: 0o600 });
    await save();
    const interruption = new AbortController();
    const stop = () => interruption.abort(new Error("Group creation browser test interrupted"));
    const timeout = setTimeout(() => interruption.abort(new Error("Group creation browser test exceeded 15 minutes")), 15 * 60000);
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
    const { startManualHarness } = await import("./manual/harness.js");
    let harness;
    try {
        const marker = `WORKFLOW_READY_${randomBytes(6).toString("hex")}`;
        harness = await startManualHarness(config, mode, {
            groupCreation: true,
            browserLogin: true,
            codex: "greeting",
            offlineTurn: async () => marker,
            usageDirectory: output,
        });
        console.info(`[browser-create-group] Browser: ${harness.baseUrl}`);
        console.info(`[browser-create-group] Evidence: ${output}`);
        report.status = "driving_browser";
        await save();
        const { driveGroupCreation } = await import("./manual/groupCreationDriver.js");
        Object.assign(report, await driveGroupCreation(harness, config, output, marker, Boolean(values.headed), interruption.signal));
        report.passed = true;
        report.status = "passed";
    }
    catch (error) {
        report.status = interruption.signal.aborted ? "incomplete" : "failed";
        report.error = redactManualText(error instanceof Error ? error.message : String(error));
        process.exitCode = interruption.signal.aborted ? 130 : 1;
    }
    finally {
        clearTimeout(timeout);
        if (harness) {
            try {
                await harness.close();
            }
            catch (error) {
                report.cleanupError = redactManualText(String(error));
                report.status = "failed";
                report.passed = false;
                process.exitCode = 1;
            }
            report.codexUsage = harness.codexUsage.report();
        }
        process.removeListener("SIGINT", stop);
        process.removeListener("SIGTERM", stop);
        report.finishedAt = new Date().toISOString();
        await save();
        console.info(`[browser-create-group] ${report.passed ? "PASS" : "FAIL"}: ${path.join(output, "report.json")}`);
        if (report.error)
            console.error(report.error);
        if (report.cleanupError)
            console.error(report.cleanupError);
        delete process.env[manualKeyName];
    }
}
