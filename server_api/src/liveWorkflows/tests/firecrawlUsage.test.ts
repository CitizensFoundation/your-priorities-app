import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { BudgetService, type UsageReservation } from "../budget.js";
import { fixture, runId } from "./memoryStore.js";
import { normalizeFirecrawlBalance } from "../firecrawl.js";

test("Firecrawl credits survive unknown outcomes and settle once at their frozen price", async () => {
  const { store } = await fixture();
  const budget = new BudgetService(store);
  const id = randomUUID();
  const request = {
    id,
    runId,
    nodeId: "analyze",
    request: { query: "fixture" },
    maximumMicros: 12_000,
    description: "firecrawl:search",
    creditUsage: {
      provider: "firecrawl" as const,
      bindingId: "web",
      operation: "search" as const,
      maximumCredits: 12,
      creditMicros: 1000,
    },
  };
  await budget.reserve(1, request);
  await budget.unknown(1, id);
  let item = await store.transact(1, (tx) =>
    tx.get<UsageReservation>("usage", id),
  );
  assert.equal(item?.creditUsage?.maximumCredits, 12);
  assert.equal(item?.creditUsage?.actualCredits, undefined);
  await assert.rejects(budget.reserve(1, request), /pending or unknown/);
  await assert.rejects(
    budget.settle(1, id, 2000, null, true),
    /verified creditsUsed/,
  );
  await assert.rejects(
    budget.settle(1, id, 2000, { creditsUsed: 3 }, true),
    /verified creditsUsed/,
  );
  await budget.settle(1, id, 2000, { creditsUsed: 2, pages: [] }, true);
  item = await store.transact(1, (tx) => tx.get<UsageReservation>("usage", id));
  assert.equal(item?.creditUsage?.actualCredits, 2);
  assert.equal(item?.creditUsage?.creditMicros, 1000);
  assert.equal((await budget.reserve(1, request)).cached, true);
  await budget.settle(1, id, 2000, { creditsUsed: 2 });
  const state = await store.transact(1, async (tx) => tx.state);
  assert.equal(state.spentMicros, 2000);
  assert.equal(state.reservedMicros, 0);
});

test("Firecrawl account balances are explicit snapshots, including zero and prepaid balances", () => {
  assert.equal(
    normalizeFirecrawlBalance({
      success: true,
      data: { remainingCredits: 0, planCredits: 100000 },
    }).remainingCredits,
    0,
  );
  assert.equal(
    normalizeFirecrawlBalance({
      success: true,
      data: { remainingCredits: 120000, planCredits: 100000 },
    }).remainingCredits,
    120000,
  );
  assert.throws(() => normalizeFirecrawlBalance({ success: true, data: {} }));
  assert.throws(() =>
    normalizeFirecrawlBalance({
      success: false,
      data: { remainingCredits: 1, planCredits: 1 },
    }),
  );
});

test("credit display separates settled, reserved, unknown and legacy requests across runs", async () => {
  const { summarizeFirecrawlUsage } = await import(
    new URL(
      "../../../../webApps/client/src/live-workflows/firecrawlUsage.ts",
      import.meta.url,
    ).href
  );
  const base: YpWorkflowUsage = {
    id: "settled",
    runId: "first",
    nodeId: "licenses",
    description: "firecrawl:search",
    status: "settled",
    maximumMicros: 5000,
    actualMicros: 2000,
    creditUsage: {
      provider: "firecrawl",
      bindingId: "web",
      operation: "search",
      maximumCredits: 5,
      creditMicros: 1000,
      actualCredits: 2,
    },
  };
  const result = summarizeFirecrawlUsage([
    base,
    {
      ...base,
      id: "reserved",
      runId: "second",
      status: "reserved",
      actualMicros: undefined,
      creditUsage: { ...base.creditUsage!, actualCredits: undefined },
    },
    {
      ...base,
      id: "unknown",
      runId: "second",
      status: "unknown",
      actualMicros: undefined,
      creditUsage: {
        ...base.creditUsage!,
        operation: "scrape",
        actualCredits: undefined,
      },
    },
    { ...base, id: "legacy", creditUsage: undefined },
  ]);
  assert.equal(result.credits, 2);
  assert.equal(result.reservedCredits, 10);
  assert.equal(result.unknownRequests, 1);
  assert.equal(result.legacyRequests, 1);
  assert.equal(result.rows.length, 2);
  assert.equal(result.rows[0].costMicros, 2000);
  assert.equal(result.rows[1].costMicros, 0);
});
