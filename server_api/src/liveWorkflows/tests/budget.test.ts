import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { BudgetService, estimateFromTrial } from "../budget.js";
import { tokenCost } from "../schemas.js";
import { fixture, runId } from "./memoryStore.js";

test("parallel $3,000 requests cannot exceed an approved $5,000 run", async () => {
  const { store } = await fixture(),
    budget = new BudgetService(store);
  const outcomes = await Promise.allSettled(
    Array.from({ length: 8 }, () =>
      budget.reserve(1, {
        id: randomUUID(),
        runId,
        nodeId: "analyze",
        maximumMicros: 3_000_000_000,
        request: { prompt: "test" },
        description: "large job",
      }),
    ),
  );
  assert.equal(outcomes.filter((o) => o.status === "fulfilled").length, 1);
  assert.equal(
    await store.transact(1, async (tx) => tx.state.reservedMicros),
    3_000_000_000,
  );
  assert.equal(
    (await store.transact(1, (tx) => tx.get<YpWorkflowRun>("run", runId)))
      ?.status,
    "paused",
  );
});
test("starting another API process leaves recent requests alone and recovers only expired reservations", async () => {
  const { store } = await fixture(),
    budget = new BudgetService(store),
    id = randomUUID();
  await budget.reserve(1, {
    id,
    runId,
    nodeId: "analyze",
    maximumMicros: 1_000_000,
    request: {},
    description: "pending",
  });
  await budget.recover(1);
  assert.equal(
    (await store.transact(1, (tx) => tx.get<{ status: string }>("usage", id)))
      ?.status,
    "reserved",
  );
  await budget.recover(1, Date.now() + 301_000);
  assert.equal(
    (await store.transact(1, (tx) => tx.get<{ status: string }>("usage", id)))
      ?.status,
    "unknown",
  );
});
test("settlement is idempotent; matching duplicate requests return the recorded result", async () => {
  const { store } = await fixture(),
    budget = new BudgetService(store),
    id = randomUUID();
  const request = {
    id,
    runId,
    nodeId: "analyze",
    maximumMicros: 1_000_000,
    request: { prompt: "same" },
    description: "test",
  };
  await budget.reserve(1, request);
  await budget.settle(1, id, 500_000, { answer: "cached" });
  await budget.settle(1, id, 500_000, { answer: "cached" });
  assert.equal((await budget.reserve(1, request)).cached, true);
  const state = await store.transact(1, async (tx) => tx.state);
  assert.equal(state.spentMicros, 500_000);
  assert.equal(state.reservedMicros, 0);
  await assert.rejects(
    budget.reserve(1, { ...request, request: { prompt: "changed" } }),
    /reused/,
  );
});
test("unknown paid outcomes retain reservations and pause the run without retrying", async () => {
  const { store } = await fixture(),
    budget = new BudgetService(store),
    id = randomUUID(),
    request = {
      id,
      runId,
      nodeId: "analyze",
      maximumMicros: 2_000_000,
      request: {},
      description: "test",
    };
  await budget.reserve(1, request);
  await budget.unknown(1, id);
  await assert.rejects(budget.reserve(1, request), /unknown/);
  assert.equal(
    await store.transact(1, async (tx) => tx.state.reservedMicros),
    2_000_000,
  );
  assert.equal(
    (await store.transact(1, (tx) => tx.get<YpWorkflowRun>("run", runId)))
      ?.status,
    "paused",
  );
  await budget.settle(1, id, 700_000, { reconciled: true });
  assert.equal(
    await store.transact(1, async (tx) => tx.state.reservedMicros),
    0,
  );
});
test("trial allowance remains cumulative across separate trials", async () => {
  const { store } = await fixture(),
    budget = new BudgetService(store);
  await store.transact(1, async (tx) => {
    const run = (await tx.get<YpWorkflowRun>("run", runId))!;
    run.mode = "trial";
    run.budgetMicros = 5_000_000;
    tx.state.trialSpentMicros = 4_000_000;
    await tx.put("run", runId, run);
  });
  await assert.rejects(
    budget.reserve(1, {
      id: randomUUID(),
      runId,
      nodeId: "analyze",
      maximumMicros: 2_000_000,
      request: {},
      description: "trial",
    }),
    /spending limit/,
  );
});
test("manual reconciliation cannot release in-flight requests or overwrite settled costs", async () => {
  const { store } = await fixture(),
    budget = new BudgetService(store),
    id = randomUUID();
  await budget.reserve(1, {
    id,
    runId,
    nodeId: "analyze",
    maximumMicros: 10_000,
    request: {},
    description: "pending provider response",
  });
  await assert.rejects(budget.settle(1, id, 0, null, true), /unknown outcome/);
  assert.equal(
    await store.transact(1, async (tx) => tx.state.reservedMicros),
    10_000,
  );
  await budget.unknown(1, id);
  await budget.settle(1, id, 3_000, { reconciled: true }, true);
  await assert.rejects(budget.settle(1, id, 0, null, true), /unknown outcome/);
  const state = await store.transact(1, async (tx) => tx.state);
  assert.equal(state.reservedMicros, 0);
  assert.equal(state.spentMicros, 3_000);
});
test("money arithmetic rounds up and completed trials produce explicit uncertainty", async () => {
  assert.equal(tokenCost(1, 1), 1);
  assert.equal(tokenCost(1_000_000, 2_000_000), 2_000_000);
  const { run } = await fixture();
  run.mode = "trial";
  run.status = "completed";
  run.inputCount = 5;
  run.spentMicros = 1_000_000;
  const estimate = estimateFromTrial(run, 25000);
  assert.equal(estimate.expectedMicros, 5_000_000_000);
  assert.equal(estimate.upperMicros, 10_000_000_000);
  assert.match(estimate.notes.join(" "), /not a statistical guarantee/);
  run.reservedMicros = 1;
  assert.throws(() => estimateFromTrial(run, 100), /reconciled/);
});

test("agent caps serialize concurrent reservations and cached settlements count only once", async () => {
  const { store } = await fixture();
  const budget = new BudgetService(store);
  await store.transact(1, async (tx) => {
    const run = (await tx.get<YpWorkflowRun>("run", runId))!;
    run.graph.nodes[0].budgetMicros = 900_000;
    await tx.put("run", runId, run);
  });
  const requests = [randomUUID(), randomUUID()].map((id) => ({
    id,
    runId,
    nodeId: "analyze",
    maximumMicros: 600_000,
    request: { prompt: "same" },
    description: "test",
  }));
  const results = await Promise.allSettled(
    requests.map((request) => budget.reserve(1, request)),
  );
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  const first = requests[results.findIndex((r) => r.status === "fulfilled")];
  await budget.settle(1, first.id, 400_000, { answer: "cached" });
  await budget.settle(1, first.id, 400_000, { answer: "cached" });
  assert.equal((await budget.reserve(1, first)).cached, true);
  const run = (await store.transact(1, (tx) =>
    tx.get<YpWorkflowRun>("run", runId),
  ))!;
  assert.deepEqual(run.nodeCosts?.analyze, {
    spentMicros: 400_000,
    reservedMicros: 0,
    requests: 1,
  });
  assert.equal(run.status, "paused");
  run.mode = "trial";
  run.status = "completed";
  run.inputCount = 4;
  const estimate = estimateFromTrial(run, 100);
  assert.deepEqual(
    estimate.agents?.find((a) => a.nodeId === "analyze"),
    {
      nodeId: "analyze",
      sampleMicros: 400_000,
      expectedMicros: 10_000_000,
      upperMicros: 20_000_000,
    },
  );
});
