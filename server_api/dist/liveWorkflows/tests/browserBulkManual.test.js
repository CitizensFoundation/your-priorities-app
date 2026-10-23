import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import express from "express";
import { fixture } from "./memoryStore.js";
import { BrowserEvidence, verifyBrowserActions, } from "./manual/interactiveBrowser.js";
import { BrowserBatchCheckpoint } from "./manual/browserBatchCheckpoint.js";
import { ManualCheckpointGate } from "./manual/checkpointGate.js";
test("batch browser acceptance rejects missing approval, refresh, search and downloads", () => {
    const observations = [
        ["POST", "account/api-key"],
        ["POST", "chat"],
        ["POST", "assets"],
        ["POST", "chat"],
        ["GET", "runs/trial/results"],
        ["POST", "runs"],
        ["POST", "runs/bulk/start"],
        ["POST", "runs/bulk/pause"],
        ["GET", "/"],
        ["POST", "runs/bulk/resume"],
        ["GET", "runs/bulk/results"],
        ...["trial-input", "trial-result", "bulk-input", "bulk-result"].map((id) => ["GET", `assets/${id}`]),
    ].map(([method, route], index) => ({
        method,
        route: route === "/" ? "/" : `/api/live-workflows/groups/1/${route}`,
        status: 200,
        order: index + 1,
        searched: route === "runs/bulk/results",
    }));
    const verify = (items) => verifyBrowserActions(items, ["trial-input", "trial-result", "bulk-input", "bulk-result"], "api-key", { trialId: "trial", bulkId: "bulk" });
    verify(observations);
    for (const [suffix, message] of [
        ["/start", /start control/],
        ["/pause", /pause control/],
        ["/resume", /resume control/],
        ["/bulk-result", /Download both/],
    ])
        assert.throws(() => verify(observations.filter((item) => !item.route.endsWith(suffix))), message);
    assert.throws(() => verify(observations.filter((item) => item.route !== "/")), /Refresh/);
    assert.throws(() => verify(observations.map((item) => ({ ...item, searched: false }))), /Search/);
    assert.throws(() => verify(observations.filter((item) => !item.route.endsWith("/trial/results"))), /Review trial/);
    assert.throws(() => verify(observations.map((item) => item.route.endsWith("/start") ? { ...item, status: 403 } : item)), /start control/);
});
test("manual batch gate waits for browser pause and records persisted state across refresh and resume", async (t) => {
    const { store, run } = await fixture();
    run.status = "awaiting_approval";
    run.inputCount = 10;
    run.nodeIds = ["levels", "analyze"];
    await store.transact(1, (tx) => tx.put("run", run.id, run));
    const gate = new ManualCheckpointGate();
    const calls = [];
    const control = new BrowserBatchCheckpoint(store, gate, async () => ({ checksum: "durable-output", records: 10 }), calls);
    const evidence = new BrowserEvidence();
    const app = express();
    app.use(express.json());
    app.use(gate.middleware);
    app.use(control.middleware);
    app.use(evidence.observe);
    let rejectStart = true;
    app.post(`/api/live-workflows/groups/1/runs/${run.id}/:operation`, async (req, res) => {
        if (rejectStart && req.params.operation === "start")
            return void res.sendStatus(403);
        await store.transact(1, async (tx) => {
            const value = (await tx.get("run", run.id));
            value.status = req.params.operation === "pause" ? "paused" : "running";
            value.executionId =
                req.params.operation === "resume" ? "execution-two" : "execution-one";
            await tx.put("run", value.id, value);
        });
        res.json({ ok: true });
    });
    app.get("/", (_req, res) => res.send("Manual page"));
    app.get(`/api/live-workflows/groups/1/runs/${run.id}/results`, (_req, res) => res.json({}));
    app.post(`/api/live-workflows/vm/groups/1/runs/${run.id}/progress`, (_req, res) => res.json({ ok: true }));
    const server = app.listen(0, "127.0.0.1");
    t.after(async () => {
        gate.release();
        server.closeAllConnections();
        await new Promise((resolve) => server.close(() => resolve()));
    });
    await once(server, "listening");
    const base = `http://127.0.0.1:${server.address().port}`;
    const post = (route, body = {}) => fetch(`${base}${route}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(5000),
    });
    const prefix = `/api/live-workflows/groups/1/runs/${run.id}`;
    assert.equal((await post(`${prefix}/start`)).status, 403);
    assert.equal(control.runId, undefined, "Rejected approval must not leave the gate armed");
    rejectStart = false;
    assert.equal((await post(`${prefix}/start`)).status, 200);
    assert.equal(control.beforeApproval?.run.status, "awaiting_approval");
    assert.equal(control.status().phase, "processing-levels");
    await store.transact(1, async (tx) => {
        const value = (await tx.get("run", run.id));
        value.spentMicros = 10000;
        await tx.put("run", value.id, value);
        await tx.put("usage", "paid-levels", {
            id: "paid-levels",
            runId: run.id,
            nodeId: "levels",
            status: "settled",
            actualMicros: 10000,
        });
    });
    // Matching checkpoint request stays pending until the actual pause endpoint responds.
    const pending = post(`/api/live-workflows/vm/groups/1/runs/${run.id}/progress`, { nodeId: "levels", complete: true });
    for (let i = 0; i < 100 && !gate.atCheckpoint(run.id, "levels"); i++)
        await new Promise((resolve) => setTimeout(resolve, 10));
    assert.equal(control.status().phase, "ready-to-pause");
    assert.equal((await store.transact(1, (tx) => tx.get("run", run.id)))
        .status, "running", "The test gate must not pause the run itself");
    assert.equal((await post(`${prefix}/pause`)).status, 200);
    assert.equal((await pending).status, 409);
    assert.equal(control.status().phase, "paused");
    assert.equal(Boolean(control.afterReload), false);
    await fetch(base);
    assert.equal(control.status().phase, "reloaded");
    assert.equal(control.afterReload?.run.spentMicros, 10000);
    assert.deepEqual(control.afterReload?.usage, control.beforePause?.usage);
    calls.push({ completed: true });
    await post(`${prefix}/resume`);
    assert.equal(control.status().phase, "resumed");
    assert.equal(control.beforeResume?.run.status, "paused");
    assert.equal(control.resumedCallOffset, 1);
    await fetch(`${base}${prefix}/results?search=Library`);
    assert.ok(evidence.requests.some((item) => item.searched));
    assert.ok(!JSON.stringify(evidence.requests).includes("Library"), "Evidence records only whether search was used, not user-entered contents");
});
