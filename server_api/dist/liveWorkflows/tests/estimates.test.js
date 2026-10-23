import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { BudgetService, estimateFromTrial, remainingForecast, } from "../budget.js";
import { fixture, run } from "./memoryStore.js";
test("variable parent-record costs recommend a larger trial without changing the spending authorization", () => {
    const trial = {
        ...run(),
        mode: "trial",
        status: "completed",
        inputCount: 3,
        spentMicros: 1200,
        sample: {
            recordIds: ["a", "b", "c"],
            populationCount: 1000,
            populationLengthRange: [10, 2000],
            sampleLengthRange: [10, 2000],
        },
        recordCosts: { a: 100, b: 100, c: 1000 },
    };
    const estimate = estimateFromTrial(trial, 1000);
    assert.equal(estimate.expectedMicros, 400000);
    assert.equal(estimate.evidence?.coverage, 0.003);
    assert.equal(estimate.evidence?.maxRecordMicros, 1000);
    assert.equal(estimate.evidence?.needsMoreEvidence, true);
    assert.equal(estimate.evidence?.recommendedSampleCount, 6);
    assert.ok(estimate.upperMicros > estimate.expectedMicros * 2);
    assert.equal(trial.budgetMicros, run().budgetMicros);
    assert.ok(estimateFromTrial({ ...trial, sample: undefined, recordCosts: undefined }, 1000).notes.some((note) => note.includes("no per-record")));
});
test("attribution and document quotas settle exactly once under concurrent replay", async () => {
    const { store, run } = await fixture();
    run.mode = "trial";
    run.sample = {
        recordIds: ["parent"],
        populationCount: 10,
        populationLengthRange: [1, 100],
        sampleLengthRange: [10, 10],
    };
    await store.transact(1, (tx) => tx.put("run", run.id, run));
    const budget = new BudgetService(store);
    const request = {
        id: randomUUID(),
        runId: run.id,
        nodeId: "analyze",
        recordId: "parent",
        maximumMicros: 100,
        description: "document",
        request: { test: true },
        requestLimit: { key: "documents", maximum: 1 },
    };
    await budget.reserve(1, request);
    await budget.settle(1, request.id, 50, {});
    await budget.settle(1, request.id, 50, {});
    assert.equal((await budget.reserve(1, request)).cached, true);
    await assert.rejects(budget.reserve(1, { ...request, id: randomUUID() }), /document request limit/);
    const saved = await store.transact(1, (tx) => tx.get("run", run.id));
    assert.equal(saved?.recordCosts?.parent, 50);
});
test("remaining forecasts include reservations and signal a forecast above the cap", () => {
    const value = run();
    value.spentMicros = 100;
    value.reservedMicros = 50;
    value.budgetMicros = 200;
    value.nodeCosts = {
        analyze: { spentMicros: 100, reservedMicros: 50, requests: 3 },
    };
    value.nodeStates = {
        analyze: { status: "running", processed: 2, total: 10 },
    };
    const forecast = remainingForecast(value);
    assert.equal(forecast.totalMicros, 500);
    assert.equal(forecast.remainingMicros, 400);
    assert.equal(forecast.exceedsAllowance, true);
    value.status = "completed";
    value.reservedMicros = 0;
    assert.equal(remainingForecast(value).remainingMicros, 0);
});
