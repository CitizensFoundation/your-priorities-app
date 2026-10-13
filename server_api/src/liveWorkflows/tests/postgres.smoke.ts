import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { Sequelize } from "sequelize";
import { migrateLiveWorkflows } from "../migrate.js";
import { SequelizeWorkflowStore } from "../store.js";
import { BudgetService } from "../budget.js";
import { ModelGateway } from "../modelGateway.js";
import { fixtureModelsJson } from "./modelFixture.js";
import {
  proposeConnection,
  commitConnection,
} from "../connectionSetup.js";
import { workspace, run as runFixture, runId } from "./memoryStore.js";

const url = process.env.YP_WORKFLOW_TEST_DATABASE_URL;
if (
  !url ||
  new URL(url).hostname !== "127.0.0.1" ||
  new URL(url).pathname !== "/yp_live_workflow_test"
)
  throw new Error(
    "Use the dedicated local yp_live_workflow_test database",
  );
const first = new Sequelize(url, { logging: false }),
  second = new Sequelize(url, { logging: false });
try {
  await first.query("CREATE TABLE groups (id INTEGER PRIMARY KEY)");
  await first.query("INSERT INTO groups VALUES (1), (2)");
  await Promise.all([
    migrateLiveWorkflows(first),
    migrateLiveWorkflows(second),
  ]);
  const a = new SequelizeWorkflowStore(first),
    b = new SequelizeWorkflowStore(second);
  await a.create(workspace());
  await a.create({ ...workspace(2), id: randomUUID() });
  await a.transact(1, (tx) => tx.put("run", runId, runFixture()));
  const budgets = [new BudgetService(a), new BudgetService(b)];
  const results = await Promise.allSettled(
    Array.from({ length: 12 }, (_, i) =>
      budgets[i % 2].reserve(1, {
        id: randomUUID(),
        runId,
        nodeId: "analyze",
        maximumMicros: 3_000_000_000,
        request: { i },
        description: "concurrent test",
      }),
    ),
  );
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal(
    await a.transact(1, async (tx) => tx.state.reservedMicros),
    3_000_000_000,
  );
  assert.equal(
    await b.transact(2, async (tx) => tx.state.reservedMicros),
    0,
  );
  await assert.rejects(
    a.transact(1, async (tx) => {
      tx.state.spentMicros = 999;
      await tx.put("test", "rollback", { invalid: true });
      throw new Error("rollback");
    }),
    /rollback/,
  );
  assert.equal(
    await b.transact(1, (tx) => tx.get("test", "rollback")),
    undefined,
  );
  assert.equal(await b.transact(1, async (tx) => tx.state.spentMicros), 0);
  await Promise.all(
    [a, b].map((store) =>
      store.transact(1, (tx) =>
        tx.emit("test.replay", { text: "once" }, "duplicate-key"),
      ),
    ),
  );
  const events = await a.events(1, 0);
  assert.equal(events.filter((e) => e.key === "duplicate-key").length, 1);
  assert.deepEqual(
    events.map((e) => e.seq),
    Array.from({ length: events.length }, (_, i) => i + 1),
  );
  assert.deepEqual(await b.events(2, 0), []);

  // Independent API instances serialize proposal approval with binding installation.
  const binding: YpWorkflowConnector = {
    id: "jobs",
    label: "Jobs",
    kind: "your-priorities",
    resourceId: "2",
    writeEnabled: false,
    settings: {},
  };
  const proposal = await a.transact(1, (tx) =>
    proposeConnection(tx, 10, { binding, purpose: "Fixture import" }),
  );
  const approvals = await Promise.allSettled(
    [a, b].map((store) =>
      store.transact(1, (tx) =>
        commitConnection(
          tx,
          binding,
          11,
          "fixture-encrypted",
          proposal.id,
        ),
      ),
    ),
  );
  assert.equal(
    approvals.filter((result) => result.status === "fulfilled").length,
    1,
  );
  assert.equal(
    (
      await b.transact(1, (tx) =>
        tx.get<YpWorkflowConnectionProposal>(
          "connection-proposal",
          proposal.id,
        ),
      )
    )?.status,
    "approved",
  );
  assert.equal(
    await b.transact(2, (tx) => tx.get("connector", "jobs")),
    undefined,
  );
  const stale = await a.transact(1, (tx) =>
    proposeConnection(tx, 10, {
      binding: { ...binding, resourceId: "1" },
      purpose: "Replace",
    }),
  );
  await b.transact(1, (tx) =>
    commitConnection(
      tx,
      { ...binding, resourceId: "3" },
      11,
      "fixture-encrypted",
    ),
  );
  await assert.rejects(
    a.transact(1, (tx) =>
      commitConnection(
        tx,
        stale.binding,
        11,
        "fixture-encrypted",
        stale.id,
      ),
    ),
    /changed/,
  );
  assert.equal(
    (
      await b.transact(1, (tx) =>
        tx.get<YpWorkflowConnectionProposal>(
          "connection-proposal",
          stale.id,
        ),
      )
    )?.status,
    "pending",
  );

  // Two API instances must share paid-request identity, even while the provider
  // response is still in flight and after the originating connection closes.
  const paidRun = { ...runFixture(workspace(2)), id: randomUUID() };
  let providerCalls = 0,
    release!: () => void,
    entered!: () => void;
  const generating = new Promise<void>((resolve) => {
    entered = resolve;
  });
  const gateways = [a, b].map(
    (store) =>
      new ModelGateway(store, fixtureModelsJson, async () => {
        providerCalls++;
        entered();
        await new Promise<void>((resolve) => {
          release = resolve;
        });
        return {
          content: '{"answer":"persistent"}',
          tokensIn: 100,
          tokensOut: 20,
        };
      }),
  );
  await a.transact(2, async (tx) => {
    await tx.put("run", paidRun.id, paidRun);
    await tx.put("run-models", paidRun.id, gateways[0].catalog());
  });
  const request = {
    id: randomUUID(),
    runId: paidRun.id,
    nodeId: "analyze",
    system: "Analyze the fixture",
    input: { text: "test" },
  };
  const firstCall = gateways[0].call(2, request);
  await generating;
  try {
    await assert.rejects(
      gateways[1].call(2, request),
      /pending or unknown/,
    );
    assert.equal(providerCalls, 1);
    assert.ok(
      await b.transact(2, async (tx) => tx.state.reservedMicros > 0),
    );
    await assert.rejects(gateways[1].call(1, request), /Unknown run node/);
  } finally {
    release();
  }
  const paidResult = await firstCall;
  const settled = await b.transact(2, async (tx) => tx.state);
  assert.equal(settled.spentMicros, 360);
  assert.equal(settled.reservedMicros, 0);
  const documentRun = {
    ...runFixture(workspace(2)),
    id: randomUUID(),
    mode: "trial" as const,
    inputCount: 1,
    sample: {
      recordIds: ["parent"],
      populationCount: 10,
      populationLengthRange: [10, 100],
      sampleLengthRange: [50, 50],
    },
  };
  await b.transact(2, (tx) => tx.put("run", documentRun.id, documentRun));
  const documentBudgets = [new BudgetService(a), new BudgetService(b)];
  const limited = await Promise.allSettled(
    Array.from({ length: 6 }, (_, i) =>
      documentBudgets[i % 2].reserve(2, {
        id: randomUUID(),
        runId: documentRun.id,
        nodeId: "analyze",
        recordId: "parent",
        maximumMicros: 100,
        request: { document: i },
        description: "fixture document",
        requestLimit: { key: "documents", maximum: 2 },
      }),
    ),
  );
  assert.equal(limited.filter((r) => r.status === "fulfilled").length, 2);
  for (const result of limited)
    if (result.status === "fulfilled")
      await documentBudgets[0].settle(
        2,
        result.value.reservation.id,
        50,
        {},
      );
  assert.equal(
    (
      await b.transact(2, (tx) =>
        tx.get<YpWorkflowRun>("run", documentRun.id),
      )
    )?.recordCosts?.parent,
    100,
  );
  await first.close();
  const recoveredGateway = new ModelGateway(
    b,
    fixtureModelsJson,
    async () => {
      throw new Error(
        "Replayed paid requests must not contact the provider",
      );
    },
  );
  assert.deepEqual(await recoveredGateway.call(2, request), paidResult);
  assert.equal(
    await b.transact(2, async (tx) => tx.state.spentMicros),
    460,
  );
  assert.equal(
    (await b.transact(1, (tx) => tx.get<YpWorkflowRun>("run", runId)))
      ?.status,
    "paused",
  );
  console.log(
    "Postgres smoke passed: transactional migration, independent API connections, atomic connection approvals and stale proposal rejection, cap reservations, rollback, private event replay, concurrent model request deduplication, paid response replay after the originating API disconnects.",
  );
} finally {
  await first.close().catch(() => undefined);
  await second.close();
}
