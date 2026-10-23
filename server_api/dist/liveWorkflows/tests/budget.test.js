import { workflowSocketTimeoutMs } from "../runner/modelLimits.js";
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { BudgetService, estimateFromTrial } from "../budget.js";
import { tokenCost } from "../schemas.js";
import { fixture, runId } from "./memoryStore.js";
test("parent-record caps combine model and connector spend with concurrent reservations and cannot charge reused stages", async () => {
    const { store } = await fixture(), budget = new BudgetService(store);
    await store.transact(1, async (tx) => {
        const run = (await tx.get("run", runId));
        run.graph.nodes.find((n) => n.id === "analyze").recordBudgetMicros = 1000;
        await tx.put("run", runId, run);
    });
    const request = (recordId) => ({
        id: randomUUID(),
        runId,
        nodeId: "analyze",
        recordId,
        maximumMicros: 600,
        request: { recordId },
        description: "model",
    });
    const model = request("parent");
    await budget.reserve(1, model);
    await budget.settle(1, model.id, 400, {});
    const web = {
        ...request("parent"),
        description: "firecrawl:search",
        creditUsage: {
            provider: "firecrawl",
            bindingId: "web",
            operation: "search",
            maximumCredits: 6,
            creditMicros: 100,
        },
    };
    await budget.reserve(1, web);
    await assert.rejects(budget.reserve(1, request("parent")), /limit/);
    await budget.settle(1, web.id, 300, { creditsUsed: 3 });
    await store.transact(1, async (tx) => {
        const run = (await tx.get("run", runId));
        run.status = "running";
        await tx.put("run", runId, run);
    });
    await budget.reserve(1, request("another-parent"));
    await assert.rejects(budget.reserve(1, { ...request("parent"), recordId: undefined }), /attribution/);
    await store.transact(1, async (tx) => {
        const run = (await tx.get("run", runId));
        run.reuse = {
            runId: randomUUID(),
            fromNodeId: "next",
            nodeIds: ["analyze"],
            historicalMicros: 700,
        };
        await tx.put("run", runId, run);
    });
    await assert.rejects(budget.reserve(1, request("fresh-id")), /Reused/);
});
test("parallel $3,000 requests cannot exceed an approved $5,000 run", async () => {
    const { store } = await fixture(), budget = new BudgetService(store);
    const outcomes = await Promise.allSettled(Array.from({ length: 8 }, () => budget.reserve(1, {
        id: randomUUID(),
        runId,
        nodeId: "analyze",
        maximumMicros: 3000000000,
        request: { prompt: "test" },
        description: "large job",
    })));
    assert.equal(outcomes.filter((o) => o.status === "fulfilled").length, 1);
    assert.equal(await store.transact(1, async (tx) => tx.state.reservedMicros), 3000000000);
    assert.equal((await store.transact(1, (tx) => tx.get("run", runId)))
        ?.status, "paused");
});
test("starting another API process leaves recent requests alone and recovers only expired reservations", async () => {
    const { store } = await fixture(), budget = new BudgetService(store), id = randomUUID();
    await budget.reserve(1, {
        id,
        runId,
        nodeId: "analyze",
        maximumMicros: 1000000,
        request: {},
        description: "pending",
    });
    await budget.recover(1);
    assert.equal((await store.transact(1, (tx) => tx.get("usage", id)))
        ?.status, "reserved");
    await budget.recover(1, Date.now() + 301000);
    assert.equal((await store.transact(1, (tx) => tx.get("usage", id)))
        ?.status, "reserved", "A new API process must not abandon a live long reasoning call");
    await budget.recover(1, Date.now() + workflowSocketTimeoutMs + 1000);
    assert.equal((await store.transact(1, (tx) => tx.get("usage", id)))
        ?.status, "unknown");
});
test("settlement is idempotent; matching duplicate requests return the recorded result", async () => {
    const { store } = await fixture(), budget = new BudgetService(store), id = randomUUID();
    const request = {
        id,
        runId,
        nodeId: "analyze",
        maximumMicros: 1000000,
        request: { prompt: "same" },
        description: "test",
    };
    await budget.reserve(1, request);
    await budget.settle(1, id, 500000, { answer: "cached" });
    await budget.settle(1, id, 500000, { answer: "cached" });
    assert.equal((await budget.reserve(1, request)).cached, true);
    const state = await store.transact(1, async (tx) => tx.state);
    assert.equal(state.spentMicros, 500000);
    assert.equal(state.reservedMicros, 0);
    await assert.rejects(budget.reserve(1, { ...request, request: { prompt: "changed" } }), /reused/);
});
test("unknown paid outcomes retain reservations and pause the run without retrying", async () => {
    const { store } = await fixture(), budget = new BudgetService(store), id = randomUUID(), request = {
        id,
        runId,
        nodeId: "analyze",
        maximumMicros: 2000000,
        request: {},
        description: "test",
    };
    await budget.reserve(1, request);
    await budget.unknown(1, id);
    await assert.rejects(budget.reserve(1, request), /unknown/);
    assert.equal(await store.transact(1, async (tx) => tx.state.reservedMicros), 2000000);
    assert.equal((await store.transact(1, (tx) => tx.get("run", runId)))
        ?.status, "paused");
    await budget.settle(1, id, 700000, { reconciled: true });
    assert.equal(await store.transact(1, async (tx) => tx.state.reservedMicros), 0);
});
test("trial allowance remains cumulative across separate trials", async () => {
    const { store } = await fixture(), budget = new BudgetService(store);
    await store.transact(1, async (tx) => {
        const run = (await tx.get("run", runId));
        run.mode = "trial";
        run.budgetMicros = 5000000;
        tx.state.trialSpentMicros = 4000000;
        await tx.put("run", runId, run);
    });
    await assert.rejects(budget.reserve(1, {
        id: randomUUID(),
        runId,
        nodeId: "analyze",
        maximumMicros: 2000000,
        request: {},
        description: "trial",
    }), /spending limit/);
});
test("manual reconciliation cannot release in-flight requests or overwrite settled costs", async () => {
    const { store } = await fixture(), budget = new BudgetService(store), id = randomUUID();
    await budget.reserve(1, {
        id,
        runId,
        nodeId: "analyze",
        maximumMicros: 10000,
        request: {},
        description: "pending provider response",
    });
    await assert.rejects(budget.settle(1, id, 0, null, true), /unknown outcome/);
    assert.equal(await store.transact(1, async (tx) => tx.state.reservedMicros), 10000);
    await budget.unknown(1, id);
    await budget.settle(1, id, 3000, { reconciled: true }, true);
    await assert.rejects(budget.settle(1, id, 0, null, true), /unknown outcome/);
    const state = await store.transact(1, async (tx) => tx.state);
    assert.equal(state.reservedMicros, 0);
    assert.equal(state.spentMicros, 3000);
});
test("money arithmetic rounds up and completed trials produce explicit uncertainty", async () => {
    assert.equal(tokenCost(1, 1), 1);
    assert.equal(tokenCost(1000000, 2000000), 2000000);
    const { run } = await fixture();
    run.mode = "trial";
    run.status = "completed";
    run.inputCount = 5;
    run.spentMicros = 1000000;
    const estimate = estimateFromTrial(run, 25000);
    assert.equal(estimate.expectedMicros, 5000000000);
    assert.equal(estimate.upperMicros, 10000000000);
    assert.match(estimate.notes.join(" "), /not a statistical guarantee/);
    run.reservedMicros = 1;
    assert.throws(() => estimateFromTrial(run, 100), /reconciled/);
});
test("agent caps serialize concurrent reservations and cached settlements count only once", async () => {
    const { store } = await fixture();
    const budget = new BudgetService(store);
    await store.transact(1, async (tx) => {
        const run = (await tx.get("run", runId));
        run.graph.nodes[0].budgetMicros = 900000;
        await tx.put("run", runId, run);
    });
    const requests = [randomUUID(), randomUUID()].map((id) => ({
        id,
        runId,
        nodeId: "analyze",
        maximumMicros: 600000,
        request: { prompt: "same" },
        description: "test",
    }));
    const results = await Promise.allSettled(requests.map((request) => budget.reserve(1, request)));
    assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
    const first = requests[results.findIndex((r) => r.status === "fulfilled")];
    await budget.settle(1, first.id, 400000, { answer: "cached" });
    await budget.settle(1, first.id, 400000, { answer: "cached" });
    assert.equal((await budget.reserve(1, first)).cached, true);
    const run = (await store.transact(1, (tx) => tx.get("run", runId)));
    assert.deepEqual(run.nodeCosts?.analyze, {
        spentMicros: 400000,
        reservedMicros: 0,
        requests: 1,
    });
    assert.equal(run.status, "paused");
    run.mode = "trial";
    run.status = "completed";
    run.inputCount = 4;
    const estimate = estimateFromTrial(run, 100);
    assert.deepEqual(estimate.agents?.find((a) => a.nodeId === "analyze"), {
        nodeId: "analyze",
        sampleMicros: 400000,
        expectedMicros: 10000000,
        upperMicros: 20000000,
    });
});
