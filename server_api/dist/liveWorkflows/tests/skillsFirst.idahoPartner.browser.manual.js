/** Explicitly invoked browser test. Never included in automatic/CI suites. */
import assert from "node:assert/strict";
import { parseArgs, format } from "node:util";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { apiRoot, importManualKey, importManualFirecrawlKey, manualKeyName, manualFirecrawlKeyName, requireLiveOptIn, resolveManualConfig, redactManualText, } from "./manual/environment.js";
import { BrowserEvidence } from "./manual/interactiveBrowser.js";
import { preparePartnerData, configurePartnerGraph, offlinePartnerOperator, boundedPartnerFirecrawl, partnerInstructions, partnerFirecrawlLimit, } from "./manual/idahoPartner.js";
import { writePartnerBundle } from "./manual/idahoPartnerReport.js";
import { prepareIdahoResearch, saveIdahoResearch, idahoMaximumCreditsPerRequest, } from "./manual/idahoResearch.js";
import { saveIdahoCosts } from "./manual/idahoReport.js";
import { archiveIdahoRun } from "./manual/idahoArchive.js";
import { recoverPartnerExports } from "./manual/idahoPartnerExports.js";
import { decodeStage } from "../runner/stageOutput.js";
import { connectorFixtures } from "./regression/connectorFixtures.js";
const { values } = parseArgs({
    options: {
        prepare: { type: "boolean" },
        offline: { type: "boolean" },
        live: { type: "boolean" },
        drive: { type: "boolean" },
        headed: { type: "boolean" },
        source: { type: "string" },
        output: { type: "string", default: "/tmp/skills-first-idaho-partner" },
        env: { type: "string" },
    },
});
assert.ok([values.prepare, values.offline, values.live].filter(Boolean).length <= 1, "Choose prepare, offline or live");
assert.ok(!(values.offline || values.live) || values.drive, "Browser runs require --drive");
if (values.live)
    requireLiveOptIn(process.env);
await mkdir(path.resolve(values.output), { recursive: true, mode: 0o700 });
const mode = values.live ? "api-key" : values.offline ? "offline" : "prepare";
const output = await mkdtemp(path.join(path.resolve(values.output), `${mode === "api-key" ? "live" : mode}-`));
const data = await preparePartnerData(path.join(output, "input"), values.source ? path.resolve(values.source) : undefined);
if (mode === "prepare") {
    console.info(JSON.stringify({
        status: "prepared",
        output,
        selection: data.selection,
        credentialsRead: false,
        providerCalls: 0,
        records: 10,
        allAgents: true,
        processingCapUsd: 5,
        codexCostSeparate: true,
        bulkApprovalAllowed: false,
        next: "Use --offline --drive to rehearse. A paid run requires YP_WORKFLOW_MANUAL_LIVE=1 and --live --drive.",
    }, null, 2));
}
else {
    const config = resolveManualConfig({
        trialBudgetMicros: 5000000,
        codexServiceTier: values.live ? "fast" : "regular",
        processingServiceTier: values.live ? "fast" : "regular",
    });
    if (values.live) {
        const credentialFile = path.resolve(values.env ?? path.join(apiRoot, "../.envForAgentDoNotViewOnlyImport"));
        await importManualKey(credentialFile);
        await importManualFirecrawlKey(credentialFile);
    }
    else {
        config.codexModel = "offline-codex";
        config.processingModel = {
            ...config.processingModel,
            id: "offline-model",
            label: "Offline fixture",
            inputMicrosPerMillion: 2000000,
            outputMicrosPerMillion: 8000000,
            maxOutputTokens: 4096,
            contextTokens: 200000,
            priceVersion: "fixture-only",
        };
    }
    for (const name of ["log", "info", "warn", "error", "debug"]) {
        const original = console[name].bind(console);
        console[name] = (...args) => original(redactManualText(format(...args)));
    }
    const report = {
        passed: false,
        status: "starting",
        mode,
        startedAt: new Date().toISOString(),
        output,
        sourceRecords: 10,
        trialRecords: 10,
        processingCapMicros: config.trialBudgetMicros,
        codexModel: config.codexModel,
        processingModel: config.processingModel.id,
        codexReasoningEffort: config.codexReasoningEffort,
        processingReasoningEffort: config.processingReasoningEffort,
        codexServiceTier: config.codexServiceTier,
        processingServiceTier: config.processingServiceTier,
        webResearch: true,
        referenceDatasetProvided: false,
        bulkApprovalAllowed: false,
    };
    const save = () => writeFile(path.join(output, "report.json"), redactManualText(JSON.stringify(report, null, 2)), { mode: 0o600 });
    await save();
    const interruption = new AbortController();
    const onSignal = () => interruption.abort(new Error("Partner browser test interrupted"));
    const timeout = setTimeout(() => interruption.abort(new Error("Partner browser test reached its two-hour limit")), 120 * 60000);
    process.once("SIGINT", onSignal);
    process.once("SIGTERM", onSignal);
    const { startManualHarness } = await import("./manual/harness.js");
    let harness;
    let research;
    let costs;
    let run;
    let records = [];
    const fixtures = values.live ? undefined : connectorFixtures();
    const firecrawl = boundedPartnerFirecrawl(fixtures?.firecrawlFetch);
    try {
        const evidence = new BrowserEvidence();
        harness = await startManualHarness(config, mode, {
            browserLogin: true,
            codex: "operator",
            offlineTurn: offlinePartnerOperator,
            offlineProcessingDelayMs: 300,
            processingConcurrency: 3,
            usageDirectory: output,
            observeBrowserRequest: evidence.observe,
            connectors: {
                firecrawlFetch: firecrawl.firecrawlFetch,
                live: Boolean(values.live),
                processing: fixtures?.processing,
            },
            manualPage: {
                instructions: partnerInstructions,
                fixture: data.fixture,
                filename: path.basename(data.fixture),
            },
        });
        research = await prepareIdahoResearch(harness, values.live
            ? process.env[manualFirecrawlKeyName]
            : "fixture-firecrawl-key");
        assert.ok(research.before.remainingCredits >=
            partnerFirecrawlLimit * idahoMaximumCreditsPerRequest, "Insufficient Firecrawl credits for the bounded ten-record run");
        await configurePartnerGraph(harness);
        evidence.requests.length = 0;
        report.url = harness.baseUrl;
        report.status = "driving_browser";
        await save();
        console.info(`[idaho-partner] Browser: ${harness.baseUrl}\n[idaho-partner] Evidence: ${output}`);
        const { driveBrowserIdahoPartner } = await import("./manual/browserIdahoPartner.js");
        Object.assign(report, await driveBrowserIdahoPartner(harness, config, data, evidence, output, Boolean(values.headed), interruption.signal));
        report.passed = true;
        report.status = "passed";
    }
    catch (error) {
        report.status = interruption.signal.aborted ? "incomplete" : "failed";
        report.error = redactManualText(error instanceof Error ? (error.stack ?? error.message) : String(error));
        process.exitCode = interruption.signal.aborted ? 130 : 1;
    }
    finally {
        clearTimeout(timeout);
        if (harness) {
            try {
                await harness.drainPaidRequests();
                const snapshot = await harness.request("");
                assert.equal(snapshot.runs.filter((item) => item.mode === "bulk").length, 0);
                run = snapshot.runs.find((item) => item.mode === "trial");
                records = JSON.parse(await readFile(path.join(output, "last-run-results.json"), "utf8").catch(() => "[]"));
                await writeFile(path.join(output, "processing-ledger.json"), redactManualText(JSON.stringify(await harness.request("/usage"), null, 2)), { mode: 0o600 });
                if (run) {
                    await writeFile(path.join(output, "trial-run.json"), JSON.stringify(run, null, 2));
                    await archiveIdahoRun(harness, run, path.join(output, "private-run-archive"));
                    // A failed paid run must still leave reviewable checkpoint results.
                    // This is a local export, never a successful browser-run claim or retry.
                    if (!records.length && run.status !== "completed") {
                        try {
                            const stageId = run.nodeIds
                                .toReversed()
                                .find((id) => run.stageOutputs?.[id]);
                            const stage = stageId && run.stageOutputs?.[stageId];
                            if (stage && stageId) {
                                records = decodeStage(await Promise.all(stage.assets.map((asset) => readFile(harness.assets.path(1, asset.id), "utf8"))), stage);
                                const recovered = await recoverPartnerExports({
                                    output,
                                    runId: run.id,
                                    records,
                                    usage: await harness.request("/usage"),
                                    stage: stageId,
                                    method: "Recovered from the last complete, checksum-verified stage snapshot. Later unfinished work is not represented as complete.",
                                });
                                records = recovered.records;
                                const values = recovered.verification;
                                await writeFile(path.join(output, "last-run-results.json"), JSON.stringify(records, null, 2));
                                await writeFile(path.join(output, "value-verification.json"), JSON.stringify(values, null, 2));
                                report.recoveredOutput = values.delivery;
                            }
                        }
                        catch (error) {
                            // Artifact recovery must not prevent receipt/cost capture or cleanup.
                            report.recoveryError = redactManualText(String(error));
                        }
                    }
                }
                if (research)
                    report.research = await saveIdahoResearch(harness, output, research, records, firecrawl.paidRequests());
                costs = await saveIdahoCosts(harness, output, records.map((row) => String(row.id)));
                report.costs = costs;
            }
            catch (error) {
                report.diagnosticsError = redactManualText(String(error));
                report.passed = false;
                report.status = "failed";
                process.exitCode = 1;
            }
            try {
                await harness.close();
            }
            catch (error) {
                report.cleanupError = redactManualText(String(error));
                report.passed = false;
                report.status = "failed";
                process.exitCode = 1;
            }
            report.codexUsage = harness.codexUsage.report();
        }
        try {
            report.partnerBundle = await writePartnerBundle({
                output,
                data,
                mode,
                run,
                records,
                costs,
                executionPassed: report.passed === true,
                error: report.error || report.diagnosticsError || report.cleanupError
                    ? "This run did not complete successfully. Stage coverage and record errors identify the available results; private harness diagnostics remain outside this folder."
                    : undefined,
            });
        }
        catch (error) {
            report.bundleError = redactManualText(String(error));
            report.passed = false;
            report.status = "failed";
            process.exitCode = 1;
        }
        process.removeListener("SIGINT", onSignal);
        process.removeListener("SIGTERM", onSignal);
        report.finishedAt = new Date().toISOString();
        await save();
        console.info(`[idaho-partner] ${report.passed ? "EXECUTION PASS" : "INCOMPLETE / FAIL"}: ${path.join(output, "report.json")}`);
        console.info(`[idaho-partner] Share folder: ${path.join(output, "for-partners")}`);
        if (report.error)
            console.error(report.error);
        delete process.env[manualKeyName];
        delete process.env[manualFirecrawlKeyName];
    }
}
