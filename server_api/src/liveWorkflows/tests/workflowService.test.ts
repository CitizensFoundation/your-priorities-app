import test from "node:test";
import assert from "node:assert/strict";
import { WorkflowService } from "../workflowService.js";
import { ModelGateway } from "../modelGateway.js";
import type { ConnectorService } from "../connectors.js";
import type { VmBrokerRegistry } from "../services/vmBrokerRegistry.js";
import { HostDirectory, SecretBox } from "../secrets.js";
import { fixture, hostId, runId } from "./memoryStore.js";
import {
  VmSessionTurnStartPayloadSchema,
  YP_LIVE_WORKFLOW_VM_PROTOCOL,
  type CodexAuthMaterial,
} from "../contracts/index.js";
import { codexAuthMaterialFingerprintSha256 } from "../vm/codex/codexAuthMaterial.js";
import { fixtureModelsJson } from "./modelFixture.js";
import { randomUUID } from "node:crypto";
import { fingerprint } from "../schemas.js";
import { resolveAuthEnvironment } from "../vm/codex/codexAuth.js";
import type { VmSessionStartPayload } from "../contracts/index.js";
import type { PackageSnapshot } from "../packages.js";

async function setup(
  dispatch: (command: {
    messageType: string;
    data: Record<string, unknown>;
  }) => Promise<unknown> = async () => ({ ok: true }),
) {
  const { store } = await fixture();
  const broker = {
    dispatchCommand: dispatch,
    isConnected: () => true,
  } as unknown as VmBrokerRegistry;
  const hosts = new HostDirectory(
    JSON.stringify([
      {
        id: hostId,
        name: "test",
        token: "x".repeat(32),
        rootPath: "/tmp/workflows",
      },
    ]),
  );
  const service = new WorkflowService(
    store,
    broker,
    hosts,
    new SecretBox(Buffer.alloc(32, 3).toString("base64")),
    new ModelGateway(store, fixtureModelsJson),
    { snapshotBindings: async () => [] } as unknown as ConnectorService,
  );
  return { store, service };
}
test("new workspaces default both models to Luna; changing Codex leaves agent selections and materialized source intact", async () => {
  const commands: { messageType: string; data: Record<string, unknown> }[] = [];
  const { store, service } = await setup(async (command) => {
    commands.push(command);
    return {};
  });
  const state = await service.create(
    2,
    { userId: 10, admin: true },
    {
      packageId: "skills-first",
      hostId,
      operatorIds: [],
      budgetMicros: 2_000_000,
    },
  );
  assert.equal(state.config.codexModel, "gpt-6-luna");
  assert.equal(state.config.codexReasoningEffort, "max");
  assert.ok(
    state.graph.nodes
      .filter((node) => node.kind === "agent")
      .every((node) => node.models.default === "gpt-6-luna"),
  );
  const seed = (await store.transact(2, (tx) =>
    tx.get<PackageSnapshot>("seed", "initial"),
  ))!;
  assert.deepEqual(JSON.parse(seed.files["graph.json"]), state.graph);
  assert.equal(seed.hash, fingerprint(seed.files));
  const materialization = commands.find(
    (command) => command.messageType === "workspace.prepare",
  )!.data.materialization as { files: { path: string; content: string }[] };
  assert.equal(
    materialization.files.find((file) => file.path === "package/graph.json")!
      .content,
    seed.files["graph.json"],
  );
  await service.configure(
    2,
    { userId: 10, admin: true },
    { ...state.config, codexModel: "gpt-6-sol" },
  );
  const updated = await store.transact(2, async (tx) => tx.state);
  assert.equal(updated.config.codexModel, "gpt-6-sol");
  assert.deepEqual(updated.graph, state.graph);
});
test("operator takeover terminates the prior session and serializes competing claims", async () => {
  let finish!: () => void, entered!: () => void;
  const starting = new Promise<void>((resolve) => {
    entered = resolve;
  });
  const { store, service } = await setup(async (command) => {
    assert.equal(command.messageType, "session.terminate");
    entered();
    await new Promise<void>((resolve) => {
      finish = resolve;
    });
    return {};
  });
  await store.transact(1, async (tx) => {
    tx.state.sessionId = runId;
    await tx.put("session", runId, {
      id: runId,
      ownerId: 10,
      status: "ready",
      active: true,
    });
  });
  await assert.rejects(
    service.claim(1, { userId: 11, admin: true }, false),
    /explicit takeover/,
  );
  const takeover = service.claim(1, { userId: 11, admin: true }, true);
  await starting;
  await assert.rejects(
    service.claim(1, { userId: 12, admin: true }, true),
    /transition/,
  );
  finish();
  await takeover;
  const state = await store.transact(1, async (tx) => tx.state);
  assert.equal(state.operator?.userId, 11);
  assert.equal(state.sessionId, null);
  await assert.rejects(
    store.transact(1, async (tx) =>
      service.requireOperator(tx, { userId: 10, admin: false }),
    ),
    /operator/,
  );
});

function authMaterial(token: string): CodexAuthMaterial {
  return {
    format: "codex_home_files_v1",
    files: [
      {
        path: "auth.json",
        dataBase64: Buffer.from(
          JSON.stringify({
            auth_mode: "chatgpt",
            tokens: { access_token: token, refresh_token: "fixture-refresh" },
          }),
        ).toString("base64"),
      },
    ],
  };
}
function loginReply(command: {
  messageType: string;
  data: Record<string, unknown>;
}) {
  const { commandId, authProfileId, vmHostId, rootPath } = command.data;
  const completing = command.messageType === "codex.auth.login.complete";
  return {
    ok: true,
    protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
    messageType: completing
      ? "codex.auth.login.completed"
      : "codex.auth.login.started",
    commandId,
    ts: new Date().toISOString(),
    data: {
      ok: true,
      commandId,
      authProfileId,
      vmHostId,
      rootPath,
      loginId: "fixture-login",
      ...(completing
        ? { account: null, authMaterial: authMaterial("fixture-access") }
        : {
            loginType: "chatgptDeviceCode",
            verificationUrl: "https://example.invalid/device",
            userCode: "FIXTURE-CODE",
          }),
    },
  };
}
type StoredAccount = {
  id: string;
  userId: number;
  sealed: string;
  loginId?: string;
  operation?: unknown;
  fingerprint: string;
  authMode?: "chatgpt" | "api-key";
};

test("API-key login encrypts per-user credentials, exposes only mode, and delivers them explicitly to Codex", async () => {
  const key = "sk-fake-user-key-for-unit-tests";
  let sessionAuth: VmSessionStartPayload["auth"];
  const { store, service } = await setup(async (command) => {
    if (command.messageType === "session.start") {
      sessionAuth = command.data.auth as VmSessionStartPayload["auth"];
      throw new Error("Stop at VM auth boundary");
    }
    return {};
  });
  const actor = { userId: 10, admin: false };
  await assert.rejects(
    service.connectApiKey(1, { userId: 99, admin: false }, { apiKey: key }),
    /Forbidden/,
  );
  await assert.rejects(service.connectApiKey(1, actor, { apiKey: "bad" }));
  assert.deepEqual(await service.connectApiKey(1, actor, { apiKey: key }), {
    connected: true,
  });
  const stored = (await store.transact(1, (tx) =>
    tx.get<StoredAccount>("account", "10"),
  ))!;
  assert.ok(!JSON.stringify(stored).includes(key));
  assert.deepEqual(
    service.secrets.open(stored.sealed, `account:10:${stored.id}`),
    { apiKey: key },
  );
  assert.throws(() =>
    service.secrets.open(stored.sealed, `account:11:${stored.id}`),
  );
  const snapshot = await service.snapshot(1, actor);
  assert.equal(snapshot.codexAuthMode, "api-key");
  assert.equal(snapshot.chatgptConnected, false);
  assert.equal(
    (await service.snapshot(1, { userId: 11, admin: true })).codexAuthMode,
    null,
  );
  assert.ok(!JSON.stringify(snapshot).includes(key));
  assert.ok(!JSON.stringify(await store.events(1, 0)).includes(key));
  await assert.rejects(
    service.ensureSession(1, actor),
    /Stop at VM auth boundary/,
  );
  assert.equal(sessionAuth?.authMode, "openai_api_key");
  assert.equal(resolveAuthEnvironment(sessionAuth, {}).apiKey, key);
  await store.transact(1, (tx) =>
    tx.put("thread", "10", { id: "old-key-thread" }),
  );
  await service.disconnect(1, actor);
  assert.equal((await service.snapshot(1, actor)).codexAuthMode, null);
  assert.equal(
    await store.transact(1, (tx) => tx.get("thread", "10")),
    undefined,
  );
});

test("API-key replacement fences takeover, retains previous key on failure, and clears the old thread on success", async () => {
  let entered!: () => void, finish!: () => void;
  let fail = true;
  const stopping = new Promise<void>((resolve) => {
    entered = resolve;
  });
  const { store, service } = await setup(async (command) => {
    assert.equal(command.messageType, "session.terminate");
    entered();
    if (fail) {
      await new Promise<void>((resolve) => {
        finish = resolve;
      });
      throw new Error("VM unavailable");
    }
    return {};
  });
  const actor = { userId: 10, admin: false };
  const oldKey = "sk-old-fake-key-for-unit-tests";
  const newKey = "sk-new-fake-key-for-unit-tests";
  await service.connectApiKey(1, actor, { apiKey: oldKey });
  const previous = (await store.transact(1, (tx) =>
    tx.get<StoredAccount>("account", "10"),
  ))!;
  await store.transact(1, async (tx) => {
    tx.state.sessionId = runId;
    await tx.put("session", runId, {
      id: runId,
      ownerId: 10,
      status: "ready",
      active: true,
    });
    await tx.put("thread", "10", { id: "old-thread" });
  });
  const replacement = service.connectApiKey(1, actor, { apiKey: newKey });
  await stopping;
  await assert.rejects(
    service.claim(1, { userId: 11, admin: true }, true),
    /transition/,
  );
  await assert.rejects(
    service.connectApiKey(1, actor, { apiKey: newKey }),
    /pending account/,
  );
  await assert.rejects(service.login(1, actor), /pending account/);
  await assert.rejects(service.disconnect(1, actor), /in progress/);
  finish();
  await assert.rejects(replacement, /VM unavailable/);
  const retained = (await store.transact(1, (tx) =>
    tx.get<StoredAccount>("account", "10"),
  ))!;
  assert.equal(retained.sealed, previous.sealed);
  assert.equal(retained.operation, undefined);
  fail = false;
  await service.connectApiKey(1, actor, { apiKey: newKey });
  const updated = (await store.transact(1, (tx) =>
    tx.get<StoredAccount>("account", "10"),
  ))!;
  assert.notEqual(updated.id, previous.id);
  assert.deepEqual(
    service.secrets.open(updated.sealed, `account:10:${updated.id}`),
    { apiKey: newKey },
  );
  assert.equal((await service.snapshot(1, actor)).workspace.sessionId, null);
  assert.equal(
    await store.transact(1, (tx) => tx.get("thread", "10")),
    undefined,
  );
});

test("a pending device login is retryable and successful completion encrypts credentials without logging them", async () => {
  let pending = true;
  const { store, service } = await setup(async (command) => {
    if (command.messageType === "codex.auth.login.complete" && pending)
      throw new Error("Login pending");
    return loginReply(command);
  });
  const actor = { userId: 10, admin: false };
  assert.deepEqual(await service.login(1, actor), {
    verificationUrl: "https://example.invalid/device",
    userCode: "FIXTURE-CODE",
  });
  await assert.rejects(service.completeLogin(1, actor), /Login pending/);
  const waiting = (await store.transact(1, (tx) =>
    tx.get<StoredAccount>("account", "10"),
  ))!;
  assert.equal(waiting.operation, undefined);
  assert.equal(waiting.loginId, "fixture-login");
  pending = false;
  assert.deepEqual(await service.completeLogin(1, actor), { connected: true });
  const connected = (await store.transact(1, (tx) =>
    tx.get<StoredAccount>("account", "10"),
  ))!;
  assert.equal(connected.loginId, undefined);
  assert.equal(connected.operation, undefined);
  assert.deepEqual(
    service.secrets.open(connected.sealed, `account:10:${connected.id}`),
    authMaterial("fixture-access"),
  );
  assert.equal(
    connected.fingerprint,
    codexAuthMaterialFingerprintSha256(authMaterial("fixture-access")),
  );
  const publicEvents = JSON.stringify(await store.events(1, 0));
  assert.ok(
    !publicEvents.includes("fixture-access") &&
      !publicEvents.includes("dataBase64"),
  );
});

test("account completion blocks competing takeover and stale credential refreshes cannot replace a new login", async () => {
  let release!: () => void, entered!: () => void;
  const completing = new Promise<void>((resolve) => {
    entered = resolve;
  });
  const commands: string[] = [];
  const { store, service } = await setup(async (command) => {
    commands.push(command.messageType);
    if (command.messageType === "codex.auth.login.complete") {
      entered();
      await new Promise<void>((resolve) => {
        release = resolve;
      });
    }
    return command.messageType === "session.terminate"
      ? {}
      : loginReply(command);
  });
  const actor = { userId: 10, admin: false };
  await service.login(1, actor);
  await store.transact(1, async (tx) => {
    tx.state.sessionId = runId;
    await tx.put("session", runId, {
      id: runId,
      ownerId: 10,
      status: "ready",
      active: true,
    });
    await tx.put("thread", "10", { id: "prior-account-thread" });
  });
  const completion = service.completeLogin(1, actor);
  await completing;
  try {
    await assert.rejects(
      service.claim(1, { userId: 11, admin: true }, true),
      /transition/,
    );
    await assert.rejects(
      service.completeLogin(1, actor),
      /pending account operation/,
    );
  } finally {
    release();
  }
  await completion;
  assert.ok(commands.includes("session.terminate"));
  assert.equal(await store.transact(1, async (tx) => tx.state.sessionId), null);
  assert.equal(
    await store.transact(1, (tx) => tx.get("thread", "10")),
    undefined,
  );
  assert.equal(
    await store.transact(1, (tx) => tx.get("lease", "transition")),
    undefined,
  );
  const connected = (await store.transact(1, (tx) =>
    tx.get<StoredAccount>("account", "10"),
  ))!;
  await service.ingestAuth(hostId, {
    vmHostId: hostId,
    sessionId: runId,
    authProfileId: connected.id,
    baseFingerprintSha256: codexAuthMaterialFingerprintSha256(
      authMaterial("old-account"),
    ),
    currentFingerprintSha256: codexAuthMaterialFingerprintSha256(
      authMaterial("stale-refresh"),
    ),
    authMaterial: authMaterial("stale-refresh"),
    updatedAt: new Date().toISOString(),
  });
  assert.deepEqual(
    await store.transact(1, (tx) => tx.get("account", "10")),
    connected,
  );
});

async function approvalFixture() {
  const { store, service } = await setup();
  const graph = (await store.transact(1, async (tx) => tx.state)).graph;
  const files: Record<string, string> = {
    "manifest.json": JSON.stringify({
      id: "fixture",
      name: "Fixture",
      version: "1",
      runtime: "yp-live-workflow-v1",
      instructions: "AGENTS.md",
      graph: "graph.json",
    }),
    "graph.json": JSON.stringify(graph),
    "AGENTS.md": "Fixture instructions",
    "source/analysis.ts":
      "export async function run(_context: unknown, input: unknown) { return input; }",
  };
  const runtimeImage = `sha256:${"a".repeat(64)}`;
  const sent: { messageType: string; data: Record<string, unknown> }[] = [];
  service.broker.dispatchCommand = async (command) => {
    if (command.messageType === "workflow.snapshot")
      return { data: { files: structuredClone(files), runtimeImage } };
    if (command.messageType === "workflow.inputs")
      return { data: { inputCount: 1000 } };
    sent.push({
      messageType: command.messageType,
      data: command.data as Record<string, unknown>,
    });
    return { ok: true };
  };
  const asset: YpWorkflowAsset = {
    id: randomUUID(),
    name: "jobs.json",
    bytes: 100,
    version: 1,
    checksum: "a".repeat(64),
    contentType: "application/json",
    source: "upload",
    createdAt: new Date().toISOString(),
  };
  await store.transact(1, (tx) => tx.put("asset", asset.id, asset));
  const actor = { userId: 10, admin: false };
  const finishTrial = async () => {
    const trial = await service.draftRun(1, actor, "trial", [asset.id]);
    // Provider completion is exercised by the container test; use its settled outcome here.
    trial.status = "completed";
    trial.spentMicros = 50_000;
    trial.nodeCosts = {
      analyze: { spentMicros: 50_000, reservedMicros: 0, requests: 5 },
    };
    await store.transact(1, (tx) => tx.put("run", trial.id, trial));
    return trial;
  };
  return { store, service, files, sent, asset, actor, finishTrial };
}

test("bulk approval requires a matching completed trial and an explicit cap; concurrent starts dispatch once", async () => {
  const f = await approvalFixture();
  await assert.rejects(
    f.service.draftRun(1, f.actor, "bulk", [f.asset.id]),
    /Run a successful trial/,
  );
  const trial = await f.finishTrial();
  const bulk = await f.service.draftRun(1, f.actor, "bulk", [f.asset.id]);
  assert.equal(bulk.estimate?.trialRunId, trial.id);
  assert.equal(bulk.estimate?.expectedMicros, 10_000_000);
  await assert.rejects(f.service.startRun(1, f.actor, bulk.id));
  assert.equal(f.sent.length, 0);
  const starts = await Promise.allSettled([
    f.service.startRun(1, f.actor, bulk.id, 20_000_000),
    f.service.startRun(1, f.actor, bulk.id, 20_000_000),
  ]);
  assert.equal(starts.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal(
    f.sent.filter((command) => command.messageType === "workflow.run").length,
    1,
  );
  const approved = (await f.store.transact(1, (tx) =>
    tx.get<YpWorkflowRun>("run", bulk.id),
  ))!;
  assert.equal(approved.budgetMicros, 20_000_000);
  assert.ok(approved.approvedAt);
});

test("source, model prices, reasoning effort and concurrency changes invalidate prior trial approvals", async (t) => {
  for (const change of ["source", "prices", "effort", "concurrency"] as const) {
    await t.test(change, async () => {
      const f = await approvalFixture();
      await f.finishTrial();
      const bulk = await f.service.draftRun(1, f.actor, "bulk", [f.asset.id]);
      if (change === "source")
        f.files["source/analysis.ts"] += "\n// New prompt revision";
      else if (change === "prices")
        f.service.models.definitions[0].priceVersion = "changed";
      else if (change === "effort") {
        const graph = JSON.parse(f.files["graph.json"]) as YpWorkflowGraph;
        graph.nodes.find((node) => node.id === "analyze")!.reasoningEffort =
          "high";
        f.files["graph.json"] = JSON.stringify(graph);
      } else
        await f.store.transact(1, async (tx) => {
          tx.state.config.concurrency = 4;
          tx.state.revision++;
        });
      await assert.rejects(
        f.service.draftRun(1, f.actor, "bulk", [f.asset.id]),
        /Run a successful trial/,
      );
      await assert.rejects(
        f.service.startRun(1, f.actor, bulk.id, 20_000_000),
        /changed/,
      );
      assert.equal(f.sent.length, 0);
      assert.equal(
        await f.store.transact(1, async (tx) => tx.state.spentMicros),
        0,
      );
    });
  }
});

test("new input versions require a fresh trial while existing approvals retain the original inputs", async () => {
  const f = await approvalFixture();
  await f.finishTrial();
  const bulk = await f.service.draftRun(1, f.actor, "bulk", [f.asset.id]);
  const updated = {
    ...f.asset,
    id: randomUUID(),
    version: 2,
    checksum: "b".repeat(64),
  };
  await f.store.transact(1, (tx) => tx.put("asset", updated.id, updated));
  await assert.rejects(
    f.service.draftRun(1, f.actor, "bulk", [updated.id]),
    /Run a successful trial/,
  );
  await f.service.startRun(1, f.actor, bulk.id, 20_000_000);
  const dispatched = f.sent.find(
    (command) => command.messageType === "workflow.run",
  )!;
  assert.deepEqual(dispatched.data.assets, [f.asset]);
});
test("chat uses the active thread and the group administrator's selected Codex model", async () => {
  let sent: Record<string, unknown> | undefined;
  const { store, service } = await setup(async (command) => {
    sent = command.data;
    VmSessionTurnStartPayloadSchema.parse(sent);
    return {};
  });
  await store.transact(1, async (tx) => {
    tx.state.sessionId = runId;
    await tx.put("session", runId, {
      id: runId,
      ownerId: 10,
      status: "ready",
      active: false,
      threadId: "thread-1",
    });
  });
  await service.chat(
    1,
    { userId: 10, admin: false },
    "Review the inputs",
    false,
  );
  assert.equal(sent?.codexThreadId, "thread-1");
  assert.deepEqual(sent?.overrides, {
    model: "test-codex",
    reasoningEffort: "max",
  });
});
test("disconnect serializes account replacement and takeover until the old session has stopped", async () => {
  let finish!: () => void, entered!: () => void;
  const starting = new Promise<void>((resolve) => {
    entered = resolve;
  });
  const { store, service } = await setup(async () => {
    entered();
    await new Promise<void>((resolve) => {
      finish = resolve;
    });
    return {};
  });
  await store.transact(1, async (tx) => {
    tx.state.sessionId = runId;
    await tx.put("session", runId, {
      id: runId,
      ownerId: 10,
      status: "ready",
      active: true,
    });
    await tx.put("account", "10", {
      id: "account-10",
      hostId,
      sealed: "old-credential",
    });
  });
  const disconnect = service.disconnect(1, { userId: 10, admin: false });
  await starting;
  await assert.rejects(
    service.claim(1, { userId: 11, admin: true }, true),
    /transition/,
  );
  await assert.rejects(
    service.login(1, { userId: 10, admin: false }),
    /pending account operation/,
  );
  finish();
  await disconnect;
  assert.equal(
    await store.transact(1, (tx) => tx.get("account", "10")),
    undefined,
  );
  await service.claim(1, { userId: 11, admin: true }, true);
  assert.equal(
    await store.transact(1, async (tx) => tx.state.operator?.userId),
    11,
  );
});
test("an unacknowledged resume returns to a spending pause and can be retried", async () => {
  const { store, service } = await setup(async () => {
    throw new Error("offline");
  });
  await store.transact(1, async (tx) => {
    const run = (await tx.get<YpWorkflowRun>("run", runId))!;
    run.status = "paused";
    await tx.put("run", runId, run);
    tx.state.activeRunId = runId;
  });
  await assert.rejects(
    service.controlRun(1, { userId: 10, admin: false }, runId, "resume"),
    /offline/,
  );
  assert.equal(
    (await store.transact(1, (tx) => tx.get<YpWorkflowRun>("run", runId)))
      ?.status,
    "paused",
  );
  assert.equal(
    await store.transact(1, (tx) => tx.get("run-control", runId)),
    undefined,
  );
});
test("an unavailable VM cannot silently commit graph settings that were never written", async () => {
  const { store, service } = await setup(async () => {
    throw new Error("offline");
  });
  const before = await store.transact(1, async (tx) => tx.state),
    graph = structuredClone(before.graph);
  graph.nodes[0].models.default = "changed";
  await assert.rejects(
    service.updateGraph(
      1,
      { userId: 10, admin: false },
      graph,
      before.revision,
    ),
    /offline/,
  );
  assert.deepEqual(await store.transact(1, async (tx) => tx.state), before);
});
test("old container exits and duplicate events cannot corrupt a resumed run", async () => {
  const { store, service } = await setup();
  await store.transact(1, async (tx) => {
    tx.state.activeRunId = runId;
  });
  await service.runnerEvent(
    1,
    hostId,
    runId,
    "run.started",
    { executionId: "new" },
    "start-new",
  );
  await service.runnerEvent(
    1,
    hostId,
    runId,
    "run.failed",
    { executionId: "old", error: "old exit" },
    "exit-old",
  );
  assert.equal(
    (await store.transact(1, (tx) => tx.get<YpWorkflowRun>("run", runId)))
      ?.status,
    "running",
  );
  await service.runnerEvent(
    1,
    hostId,
    runId,
    "run.completed",
    { executionId: "new" },
    "complete-new",
  );
  await service.runnerEvent(
    1,
    hostId,
    runId,
    "run.failed",
    { executionId: "new" },
    "late-failure",
  );
  assert.equal(
    (await store.transact(1, (tx) => tx.get<YpWorkflowRun>("run", runId)))
      ?.status,
    "completed",
  );
  assert.equal(
    await store.transact(1, async (tx) => tx.state.activeRunId),
    null,
  );
});
test("resuming requires reconciliation and records explicit increases to the approved cap", async () => {
  const { store, service } = await setup();
  await store.transact(1, async (tx) => {
    const run = (await tx.get<YpWorkflowRun>("run", runId))!;
    run.status = "paused";
    await tx.put("run", runId, run);
    tx.state.activeRunId = runId;
    await tx.put("usage", "pending", { runId, status: "unknown" });
  });
  await assert.rejects(
    service.controlRun(
      1,
      { userId: 10, admin: false },
      runId,
      "resume",
      6_000_000_000,
    ),
    /Reconcile/,
  );
  await store.transact(1, (tx) => tx.remove("usage", "pending"));
  await service.controlRun(
    1,
    { userId: 10, admin: false },
    runId,
    "resume",
    6_000_000_000,
  );
  assert.equal(
    (await store.transact(1, (tx) => tx.get<YpWorkflowRun>("run", runId)))
      ?.budgetMicros,
    6_000_000_000,
  );
  assert.ok(
    (await store.events(1, 0)).some((e) => e.type === "run.allowance.approved"),
  );
});

test("execution failures retain the active run and resume with the same paid request identity", async () => {
  const { store, service } = await setup();
  await store.transact(1, async (tx) => {
    tx.state.activeRunId = runId;
  });
  await service.runnerEvent(
    1,
    hostId,
    runId,
    "run.started",
    { executionId: "first" },
    "first-start",
  );
  await service.runnerEvent(
    1,
    hostId,
    runId,
    "run.failed",
    { executionId: "first", error: "Disk temporarily unavailable" },
    "first-fail",
  );
  const failed = (await store.transact(1, (tx) =>
    tx.get<YpWorkflowRun>("run", runId),
  ))!;
  assert.equal(failed.status, "paused");
  assert.equal(failed.completedAt, undefined);
  assert.equal(
    await store.transact(1, async (tx) => tx.state.activeRunId),
    runId,
  );
  await service.controlRun(1, { userId: 10, admin: false }, runId, "resume");
  const resumed = (await store.transact(1, (tx) =>
    tx.get<YpWorkflowRun>("run", runId),
  ))!;
  assert.equal(resumed.status, "running");
  assert.equal(resumed.sourceHash, failed.sourceHash);
  assert.equal(resumed.id, failed.id);
});
test("failed records stay visible after final progress and cannot support a bulk estimate", async () => {
  const f = await approvalFixture();
  const trial = await f.service.draftRun(1, f.actor, "trial", [f.asset.id]);
  await f.service.startRun(1, f.actor, trial.id);
  await f.service.runnerEvent(
    1,
    hostId,
    trial.id,
    "node.progress",
    { nodeId: "analyze", processed: 5, total: 5, failedRecords: 1 },
    "bad-row",
  );
  await f.service.runnerEvent(
    1,
    hostId,
    trial.id,
    "node.progress",
    { nodeId: "analyze", processed: 5, total: 5, complete: true },
    "final-progress",
  );
  await f.service.runnerEvent(
    1,
    hostId,
    trial.id,
    "run.completed",
    {},
    "finish",
  );
  const completed = (await f.store.transact(1, (tx) =>
    tx.get<YpWorkflowRun>("run", trial.id),
  ))!;
  assert.equal(completed.nodeStates.analyze.failedRecords, 1);
  await assert.rejects(
    f.service.draftRun(1, f.actor, "bulk", [f.asset.id]),
    /failed records/,
  );
});
test("agent caps can only be raised explicitly within the run allowance when resuming", async () => {
  const { store, service } = await setup();
  await store.transact(1, async (tx) => {
    tx.state.activeRunId = runId;
    const run = (await tx.get<YpWorkflowRun>("run", runId))!;
    run.status = "paused";
    run.nodeCosts = {
      analyze: { spentMicros: 50_000, reservedMicros: 0, requests: 1 },
    };
    run.graph.nodes[0].budgetMicros = 60_000;
    await tx.put("run", runId, run);
  });
  const actor = { userId: 10, admin: false };
  for (const caps of [
    { analyze: 49_000 },
    { analyze: 6_000_000_000 },
    { unknown: 100_000 },
  ] as Record<string, number>[])
    await assert.rejects(
      service.controlRun(1, actor, runId, "resume", undefined, caps),
      /Agent allowance/,
    );
  await service.controlRun(1, actor, runId, "resume", undefined, {
    analyze: 100_000,
  });
  const resumed = (await store.transact(1, (tx) =>
    tx.get<YpWorkflowRun>("run", runId),
  ))!;
  assert.equal(resumed.nodeBudgets?.analyze, 100_000);
  assert.equal(
    resumed.graph.nodes[0].budgetMicros,
    60_000,
    "immutable graph is preserved",
  );
  assert.ok(
    (await store.events(1, 0)).some(
      (e) => e.type === "run.agent_allowances.approved",
    ),
  );
});
test("a targeted trial cannot approve a broader set of agents", async () => {
  const f = await approvalFixture();
  const graph = JSON.parse(f.files["graph.json"]) as YpWorkflowGraph;
  graph.nodes.push({ ...graph.nodes[0], id: "later", label: "Later stage" });
  graph.edges.push({ id: "later-edge", source: "analyze", target: "later" });
  f.files["graph.json"] = JSON.stringify(graph);
  const trial = await f.service.draftRun(
    1,
    f.actor,
    "trial",
    [f.asset.id],
    3,
    "analyze",
  );
  assert.deepEqual(trial.nodeIds, ["analyze"]);
  assert.equal(trial.inputCount, 3);
  trial.status = "completed";
  await f.store.transact(1, (tx) => tx.put("run", trial.id, trial));
  await assert.rejects(
    f.service.draftRun(1, f.actor, "bulk", [f.asset.id]),
    /selected agents/,
  );
  const bulk = await f.service.draftRun(
    1,
    f.actor,
    "bulk",
    [f.asset.id],
    3,
    "analyze",
  );
  assert.equal(bulk.estimate?.trialRunId, trial.id);
});
test("revision restore checks operator, draft version and active work, preserving saved sources", async () => {
  const f = await approvalFixture();
  const original = await f.service.packageSnapshot(1);
  f.files["source/analysis.ts"] += "\n// updated";
  const edited = await f.service.packageSnapshot(1);
  const history = await f.service.revisions(1);
  assert.equal(history.currentHash, edited.hash);
  assert.equal(history.revisions.length, 2);
  assert.deepEqual(
    (await f.service.revision(1, original.hash)).files,
    original.files,
  );
  const revision = await f.store.transact(1, async (tx) => tx.state.revision);
  await assert.rejects(
    f.service.restoreRevision(
      1,
      { userId: 11, admin: false },
      original.hash,
      revision,
    ),
    /operator/,
  );
  await assert.rejects(
    f.service.restoreRevision(1, f.actor, original.hash, revision - 1),
    /draft changed/,
  );
  await f.store.transact(1, async (tx) => {
    tx.state.activeRunId = runId;
  });
  await assert.rejects(
    f.service.restoreRevision(1, f.actor, original.hash, revision),
    /active run/,
  );
  await f.store.transact(1, async (tx) => {
    tx.state.activeRunId = null;
    tx.state.sessionId = runId;
    await tx.put("session", runId, {
      id: runId,
      active: true,
      status: "ready",
    });
  });
  await assert.rejects(
    f.service.restoreRevision(1, f.actor, original.hash, revision),
    /Codex turn/,
  );
  await f.store.transact(1, async (tx) => {
    tx.state.sessionId = null;
  });
  f.service.broker.dispatchCommand = async () => {
    throw new Error("offline");
  };
  await assert.rejects(
    f.service.restoreRevision(1, f.actor, original.hash, revision),
    /offline/,
  );
  assert.equal((await f.service.revisions(1)).currentHash, edited.hash);
  f.service.broker.dispatchCommand = async (command) => {
    assert.equal(command.messageType, "workflow.restore");
    return { data: { hash: original.hash, backup: ".package-backup-fixture" } };
  };
  await f.service.restoreRevision(1, f.actor, original.hash, revision);
  assert.equal((await f.service.revisions(1)).currentHash, original.hash);
  assert.deepEqual(
    (await f.service.revision(1, edited.hash)).files,
    edited.files,
  );
  assert.equal(
    await f.store.transact(1, async (tx) => tx.state.revision),
    revision + 1,
  );
});
test("VM retention excludes active, paused, unsettled and recent runs", async () => {
  const pruned: string[][] = [];
  const { store, service } = await setup(async (command) => {
    if (command.messageType === "workflow.prune") {
      pruned.push(command.data.runIds as string[]);
      return { data: { removed: (command.data.runIds as string[]).length } };
    }
    return {
      data: { availableBytes: 10 * 1024 ** 3, minimumFreeBytes: 1024 ** 3 },
    };
  });
  const old = new Date(Date.now() - 40 * 86400_000).toISOString();
  const eligible: string[] = [];
  await store.transact(1, async (tx) => {
    const base = (await tx.get<YpWorkflowRun>("run", runId))!;
    for (const status of [
      "completed",
      "cancelled",
      "paused",
      "running",
      "completed",
      "completed",
    ] as const) {
      const id = randomUUID();
      const run = { ...base, id, status, createdAt: old, completedAt: old };
      if (eligible.length < 2) eligible.push(id);
      else if (status === "completed") {
        if (!(await tx.get("test", "unsettled"))) {
          await tx.put("usage", id, { runId: id, status: "unknown" });
          await tx.put("test", "unsettled", true);
        } else run.completedAt = new Date().toISOString();
      }
      await tx.put("run", id, run);
    }
  });
  await store.transact(1, async (tx) => {
    const active = (await tx.get<YpWorkflowRun>("run", runId))!;
    active.createdAt = old;
    tx.state.activeRunId = runId;
    await tx.put("run", runId, active);
  });
  await service.controlRun(1, { userId: 10, admin: true }, runId, "cancel");
  const cancelled = (await store.transact(1, (tx) =>
    tx.get<YpWorkflowRun>("run", runId),
  ))!;
  assert.ok(
    Date.parse(cancelled.completedAt!) > Date.now() - 60_000,
    "retention starts when cancellation completes",
  );
  await assert.rejects(service.storage(1, { userId: 10, admin: false }, true));
  assert.equal(
    (await service.storage(1, { userId: 10, admin: true })).eligibleRuns,
    2,
  );
  assert.equal(pruned.length, 0);
  assert.equal(
    (await service.storage(1, { userId: 10, admin: true }, true)).removed,
    2,
  );
  assert.deepEqual(pruned[0].sort(), eligible.sort());
  assert.equal(
    (await service.storage(1, { userId: 10, admin: true })).eligibleRuns,
    0,
  );
  for (const id of eligible)
    assert.ok(
      await store.transact(1, (tx) => tx.get("run", id)),
      "audit records remain",
    );
});

test("an unacknowledged chat turn retains its active marker until it can be stopped", async () => {
  const { store, service } = await setup(async (command) => {
    if (command.messageType === "session.terminate") return {};
    throw new Error("acknowledgement lost");
  });
  await store.transact(1, async (tx) => {
    tx.state.sessionId = runId;
    await tx.put("session", runId, {
      id: runId,
      ownerId: 10,
      status: "ready",
      active: false,
      threadId: "fixture",
    });
  });
  await store.transact(1, async (tx) => {
    await tx.put("account", "10", { sealed: "encrypted-existing-credential" });
    await tx.put("thread", "10", { id: "fixture" });
  });
  await assert.rejects(
    service.chat(1, { userId: 10, admin: false }, "Review the sources", false),
    /acknowledgement lost/,
  );
  assert.equal(
    (
      await store.transact(1, (tx) =>
        tx.get<{ active: boolean }>("session", runId),
      )
    )?.active,
    true,
  );
  await service.sessionControl(
    1,
    { userId: 10, admin: false },
    "terminate",
    {},
  );
  assert.equal(await store.transact(1, async (tx) => tx.state.sessionId), null);
  assert.deepEqual(await store.transact(1, (tx) => tx.get("account", "10")), {
    sealed: "encrypted-existing-credential",
  });
  assert.deepEqual(await store.transact(1, (tx) => tx.get("thread", "10")), {
    id: "fixture",
  });
});
