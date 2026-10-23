import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";
import { offlineOperator } from "./headlessRehearsal.js";
import { verifyDownload, verifySkillsFirstOutput } from "./verification.js";
import { resultRows, verifyReviewedRewrites } from "./headlessVerification.js";
export const browserFixture = fileURLToPath(new URL("fixtures/library-program-assistant.txt", import.meta.url));
export const browserGreeting = "Hello! Briefly say hello and that you are ready for my Skills First job description. Do not use tools or start processing yet.";
export const browserExperiment = "Use the job description I uploaded. Inspect the package instructions, workflow status and document through the workflow CLI. Validate the existing Skills First package and start exactly one one-record trial through the complete default pipeline, including analysis, rewrite, independent review and JSON/CSV/Markdown export. Keep the package, models and budgets unchanged and external connectors off. Tell me the run ID and what will run, then finish your turn without polling. Do not install dependencies, use provider credentials or start bulk work.";
export const browserInstructions = `<details><summary>Browser test steps and prompts</summary>
<p>This page waits for you. The local group and Your Priorities user are test fixtures; live mode uses your imported OpenAI API key.</p>
<ol><li>Choose Use imported test key. This submits the API-key login form without putting the real key into your browser. Offline mode uses a fake key.</li>
<li>Send this greeting and wait for Codex's reply:<pre>${browserGreeting}</pre></li>
<li><a href="/manual/fixture" download>Download the sample job description</a>, then use Data → Upload files to upload it. Or select the fixture path printed in the terminal.</li>
<li>Send this message to Codex:<pre>${browserExperiment}</pre></li>
<li>Watch the graph and cost. After the trial completes, open Results, then download and open all four skills-first files (.json, .csv, .xlsx and .md) from Data.</li>
<li>Return to the terminal and press Enter to verify and finish. Ctrl+C stops and cleans up an unfinished test.</li></ol>
<p>There are two Codex turns in this test. Nothing sends chat, uploads data, starts processing or approves spending automatically.</p></details>`;
export class BrowserEvidence {
    constructor() {
        this.requests = [];
        this.sequence = 0;
        this.observe = (req, res, next) => {
            if (req.path === "/" ||
                /^\/api\/live-workflows\/groups\/1\/(chat|codex-models|assistant-settings|graph|usage|storage|revisions(?:\/[^/]+)?|assets(?:\/[^/]+(?:\/preview)?)?|account\/(login|complete|api-key)|runs(?:\/[^/]+\/(start|pause|resume|results))?)$/.test(req.path)) {
                const order = ++this.sequence;
                res.once("finish", () => this.requests.push({
                    method: req.method,
                    route: req.path,
                    status: res.statusCode,
                    order,
                    ...(req.path.endsWith("/results")
                        ? {
                            searched: typeof req.query.search === "string" &&
                                req.query.search.trim().length > 0,
                            compared: typeof req.query.compare === "string" &&
                                req.query.compare.length > 0,
                            filtered: typeof req.query.filter === "string" &&
                                req.query.filter !== "all",
                        }
                        : {}),
                }));
            }
            next();
        };
    }
}
export function verifyBrowserActions(requests, assetIds, mode, batch) {
    const successful = requests.filter((item) => item.status === 200);
    const chats = successful.filter((item) => item.method === "POST" && item.route.endsWith("/chat"));
    const uploads = successful.filter((item) => item.method === "POST" && item.route.endsWith("/assets"));
    assert.equal(chats.length, 2, "Send the greeting and experiment through browser chat");
    assert.equal(uploads.length, 1, "Upload the one fixture through the browser");
    assert.ok(chats[0].order < uploads[0].order && uploads[0].order < chats[1].order, "Use hello → upload → processing chat order");
    const drafts = successful.filter((item) => item.method === "POST" && item.route.endsWith("/runs"));
    if (!batch)
        assert.equal(drafts.length, 0, "Ask Codex to run the trial; do not use the Run trial button");
    else {
        assert.equal(drafts.length, 1, "Estimate exactly one bulk run in the browser");
        const action = (operation) => {
            const matches = successful.filter((item) => item.method === "POST" &&
                item.route.endsWith(`/runs/${batch.bulkId}/${operation}`));
            assert.equal(matches.length, 1, `Use the browser ${operation} control exactly once`);
            return matches[0];
        };
        const start = action("start"), pause = action("pause"), resume = action("resume");
        assert.ok(chats[1].order < drafts[0].order &&
            drafts[0].order < start.order &&
            start.order < pause.order &&
            pause.order < resume.order, "Use experiment → estimate → approve → pause → resume order");
        assert.ok(successful.some((item) => item.method === "GET" &&
            item.route === "/" &&
            item.order > pause.order &&
            item.order < resume.order), "Refresh the browser while the batch is paused");
        assert.ok(successful.some((item) => item.method === "GET" &&
            item.route.endsWith(`/runs/${batch.trialId}/results`) &&
            item.order < start.order), "Review trial results before approving bulk spending");
        assert.ok(successful.some((item) => item.method === "GET" &&
            item.route.endsWith(`/runs/${batch.bulkId}/results`) &&
            item.searched &&
            item.order > resume.order), "Search the completed batch results in the browser");
    }
    for (const id of assetIds)
        assert.ok(successful.some((item) => item.method === "GET" && item.route.endsWith(`/assets/${id}`)), batch
            ? "Download both runs' adapted inputs and analysis results in the browser before finishing"
            : "Download all required exported documents in the browser before finishing");
    if (mode === "chatgpt") {
        const login = successful.find((item) => item.method === "POST" && item.route.endsWith("/account/login"));
        const complete = successful.find((item) => item.method === "POST" && item.route.endsWith("/account/complete"));
        assert.ok(login &&
            complete &&
            login.order < complete.order &&
            complete.order < chats[0].order, "Complete real ChatGPT sign-in through the browser before greeting Codex");
    }
    else {
        const login = successful.find((item) => item.method === "POST" && item.route.endsWith("/account/api-key"));
        assert.ok(login && login.order < chats[0].order, "Connect an API key through the browser before greeting Codex");
    }
}
export function offlineBrowserOperator(adapt = false) {
    let greeted = false;
    const operator = offlineOperator(adapt);
    return async (workspace) => {
        if (!greeted) {
            greeted = true;
            return "Hello! Ready for your Skills First job description. This is an offline fixture response.";
        }
        return operator(workspace);
    };
}
export async function verifyInteractiveBrowser(harness, evidence, outputDir, mode) {
    // Freeze observed interactions before the verifier retrieves artifact bytes itself.
    const observed = [...evidence.requests];
    const snapshot = await harness.request("");
    assert.equal(snapshot.codexAuthMode, mode === "chatgpt" ? "chatgpt" : "api-key", "Connect your Codex account first");
    assert.equal(snapshot.runs.length, 1, "Ask Codex to start exactly one trial");
    const run = snapshot.runs[0];
    assert.equal(run.mode, "trial");
    assert.equal(run.status, "completed", `Wait for the trial to finish (currently ${run.status})`);
    assert.equal(run.inputCount, 1);
    assert.deepEqual(run.nodeIds, [
        "normalize",
        "levels",
        "analyze",
        "rewrite",
        "export",
    ]);
    for (const id of run.nodeIds)
        assert.equal(run.nodeStates[id]?.status, "completed");
    const uploads = snapshot.assets.filter((asset) => asset.source === "upload");
    assert.equal(uploads.length, 1);
    const original = await readFile(browserFixture);
    verifyDownload(uploads[0], original);
    const job = {
        id: `${uploads[0].id}:${uploads[0].id}`,
        name: uploads[0].name,
        text: original.toString(),
    };
    const exports = ["json", "csv", "xlsx", "md"].map((extension) => {
        const asset = snapshot.assets.find((item) => item.name === `${run.id}-skills-first.${extension}`);
        assert.ok(asset, `Missing ${extension} export`);
        return { asset, extension };
    });
    verifyBrowserActions(observed, exports.map(({ asset }) => asset.id), mode);
    const codexUsage = harness.codexUsage.report();
    assert.equal(codexUsage.turns, 2);
    assert.equal(codexUsage.usageComplete, true, "Wait for Codex's final reply");
    for (const operation of ["status", "data", "validate", "trial"])
        assert.ok(harness.codexCalls.some((call) => call.operation === operation && call.status === 200), `Codex did not use ${operation}`);
    assert.equal(harness.codexCalls.filter((call) => call.operation === "trial" && call.status === 200).length, 1);
    const usage = await harness.request("/usage");
    assert.ok(usage.length && usage.every((item) => item.status === "settled"));
    assert.equal(usage.reduce((total, item) => total + (item.actualMicros ?? 0), 0), run.spentMicros);
    assert.ok(run.spentMicros > 0 && run.spentMicros <= run.budgetMicros);
    assert.equal(snapshot.workspace.spentMicros, run.spentMicros);
    assert.equal(snapshot.workspace.reservedMicros, 0);
    const downloads = [];
    let quality;
    for (const { asset, extension } of exports) {
        const response = await fetch(`${harness.baseUrl}/api/live-workflows/groups/1/assets/${asset.id}`, { signal: AbortSignal.timeout(30000) });
        assert.equal(response.status, 200);
        const bytes = Buffer.from(await response.arrayBuffer());
        verifyDownload(asset, bytes);
        if (extension === "json") {
            const output = JSON.parse(bytes.toString()).jobDescriptions;
            quality = verifySkillsFirstOutput([job], output);
            verifyReviewedRewrites(resultRows.parse(output));
        }
        else if (extension === "csv") {
            const rows = parse(bytes, { columns: true, from_line: 2 });
            assert.equal(rows.length, 1);
            assert.equal(rows[0].name, job.name);
            assert.equal(Object.keys(rows[0]).length, 74);
        }
        else if (extension === "md")
            assert.ok(bytes.toString().includes(job.name));
        else
            assert.equal(bytes.subarray(0, 2).toString(), "PK", "Expected an Excel ZIP artifact");
        await writeFile(path.join(outputDir, `skills-first.${extension}`), bytes, {
            mode: 0o600,
        });
        downloads.push({
            name: asset.name,
            bytes: asset.bytes,
            checksum: asset.checksum,
        });
    }
    return {
        runId: run.id,
        quality,
        downloads,
        processingSpentMicros: run.spentMicros,
        processingReservedMicros: snapshot.workspace.reservedMicros,
        requests: usage.length,
        sourceHash: run.sourceHash,
        runtimeImage: run.runtimeImage,
        codexCapabilities: harness.codexCalls,
        browserRequests: observed,
        chatgptLoginVerified: mode === "chatgpt",
        apiKeyLoginVerified: mode === "api-key",
        browserOperatorConfirmedReview: true,
        downloadEvidence: "HTTP deliveries observed before verification; saved-file review confirmed by the browser operator when finishing.",
    };
}
