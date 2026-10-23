import test from "node:test";
import assert from "node:assert/strict";
import { WorkflowService } from "../workflowService.js";
import { ModelGateway } from "../modelGateway.js";
import { HostDirectory, SecretBox } from "../secrets.js";
import { fixture, hostId, runId } from "./memoryStore.js";
import { VmSessionTurnStartPayloadSchema, YP_LIVE_WORKFLOW_VM_PROTOCOL, } from "../contracts/index.js";
import { codexAuthMaterialFingerprintSha256 } from "../vm/codex/codexAuthMaterial.js";
import { fixtureModelsJson } from "./modelFixture.js";
import { randomUUID } from "node:crypto";
import { fingerprint } from "../schemas.js";
import { assistantSettings } from "../modelDefaults.js";
import { turnStartParams } from "../vm/codex/appServerRequests.js";
import { resolveAuthEnvironment } from "../vm/codex/codexAuth.js";
async function setup(dispatch = async () => ({ ok: true })) {
    const { store } = await fixture();
    const broker = {
        dispatchCommand: dispatch,
        isConnected: () => true,
    };
    const hosts = new HostDirectory(JSON.stringify([
        {
            id: hostId,
            name: "test",
            token: "x".repeat(32),
            rootPath: "/tmp/workflows",
        },
    ]));
    const service = new WorkflowService(store, broker, hosts, new SecretBox(Buffer.alloc(32, 3).toString("base64")), new ModelGateway(store, fixtureModelsJson), { snapshotBindings: async () => [] });
    return { store, service };
}
test("new workspaces default both models to Luna; changing Codex leaves agent selections and materialized source intact", async () => {
    const commands = [];
    const { store, service } = await setup(async (command) => {
        commands.push(command);
        return {};
    });
    const state = await service.create(2, { userId: 10, admin: true }, {
        packageId: "skills-first",
        hostId,
        operatorIds: [],
        budgetMicros: 2000000,
    });
    assert.equal(state.config.codexModel, "gpt-6-luna");
    assert.equal(state.config.codexReasoningEffort, "max");
    assert.equal((await service.snapshot(2, { userId: 10, admin: true })).assistantName, "Skills First Assistant");
    assert.ok(state.graph.nodes
        .filter((node) => node.kind === "agent")
        .every((node) => node.models.default === "gpt-6-luna"));
    const seed = (await store.transact(2, (tx) => tx.get("seed", "initial")));
    assert.deepEqual(JSON.parse(seed.files["graph.json"]), state.graph);
    assert.equal(seed.hash, fingerprint(seed.files));
    const materialization = commands.find((command) => command.messageType === "workspace.prepare").data.materialization;
    assert.equal(materialization.files.find((file) => file.path === "package/graph.json")
        .content, seed.files["graph.json"]);
    await service.configure(2, { userId: 10, admin: true }, { ...state.config, codexModel: "gpt-6-sol" });
    const updated = await store.transact(2, async (tx) => tx.state);
    assert.equal(updated.config.codexModel, "gpt-6-sol");
    assert.deepEqual(updated.graph, state.graph);
});
test("operator takeover terminates the prior session and serializes competing claims", async () => {
    let finish, entered;
    const starting = new Promise((resolve) => {
        entered = resolve;
    });
    const { store, service } = await setup(async (command) => {
        assert.equal(command.messageType, "session.terminate");
        entered();
        await new Promise((resolve) => {
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
    await assert.rejects(service.claim(1, { userId: 11, admin: true }, false), /explicit takeover/);
    const takeover = service.claim(1, { userId: 11, admin: true }, true);
    await starting;
    await assert.rejects(service.claim(1, { userId: 12, admin: true }, true), /transition/);
    finish();
    await takeover;
    const state = await store.transact(1, async (tx) => tx.state);
    assert.equal(state.operator?.userId, 11);
    assert.equal(state.sessionId, null);
    await assert.rejects(store.transact(1, async (tx) => service.requireOperator(tx, { userId: 10, admin: false })), /operator/);
});
function authMaterial(token) {
    return {
        format: "codex_home_files_v1",
        files: [
            {
                path: "auth.json",
                dataBase64: Buffer.from(JSON.stringify({
                    auth_mode: "chatgpt",
                    tokens: { access_token: token, refresh_token: "fixture-refresh" },
                })).toString("base64"),
            },
        ],
    };
}
function loginReply(command) {
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
test("API-key login encrypts per-user credentials, exposes only mode, and delivers them explicitly to Codex", async () => {
    const key = "sk-fake-user-key-for-unit-tests";
    let sessionAuth;
    const { store, service } = await setup(async (command) => {
        if (command.messageType === "session.start") {
            sessionAuth = command.data.auth;
            throw new Error("Stop at VM auth boundary");
        }
        return {};
    });
    const actor = { userId: 10, admin: false };
    await assert.rejects(service.connectApiKey(1, { userId: 99, admin: false }, { apiKey: key }), /Forbidden/);
    await assert.rejects(service.connectApiKey(1, actor, { apiKey: "bad" }));
    assert.deepEqual(await service.connectApiKey(1, actor, { apiKey: key }), {
        connected: true,
    });
    const stored = (await store.transact(1, (tx) => tx.get("account", "10")));
    assert.ok(!JSON.stringify(stored).includes(key));
    assert.deepEqual(service.secrets.open(stored.sealed, `account:10:${stored.id}`), { apiKey: key });
    assert.throws(() => service.secrets.open(stored.sealed, `account:11:${stored.id}`));
    const snapshot = await service.snapshot(1, actor);
    assert.equal(snapshot.codexAuthMode, "api-key");
    assert.equal(snapshot.chatgptConnected, false);
    assert.equal((await service.snapshot(1, { userId: 11, admin: true })).codexAuthMode, null);
    assert.ok(!JSON.stringify(snapshot).includes(key));
    assert.ok(!JSON.stringify(await store.events(1, 0)).includes(key));
    await assert.rejects(service.ensureSession(1, actor), /Stop at VM auth boundary/);
    assert.equal(sessionAuth?.authMode, "openai_api_key");
    assert.equal(resolveAuthEnvironment(sessionAuth, {}).apiKey, key);
    await store.transact(1, (tx) => tx.put("thread", "10", { id: "old-key-thread" }));
    await service.disconnect(1, actor);
    assert.equal((await service.snapshot(1, actor)).codexAuthMode, null);
    assert.equal(await store.transact(1, (tx) => tx.get("thread", "10")), undefined);
});
test("API-key replacement fences takeover, retains previous key on failure, and clears the old thread on success", async () => {
    let entered, finish;
    let fail = true;
    const stopping = new Promise((resolve) => {
        entered = resolve;
    });
    const { store, service } = await setup(async (command) => {
        assert.equal(command.messageType, "session.terminate");
        entered();
        if (fail) {
            await new Promise((resolve) => {
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
    const previous = (await store.transact(1, (tx) => tx.get("account", "10")));
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
    await assert.rejects(service.claim(1, { userId: 11, admin: true }, true), /transition/);
    await assert.rejects(service.connectApiKey(1, actor, { apiKey: newKey }), /pending account/);
    await assert.rejects(service.login(1, actor), /pending account/);
    await assert.rejects(service.disconnect(1, actor), /in progress/);
    finish();
    await assert.rejects(replacement, /VM unavailable/);
    const retained = (await store.transact(1, (tx) => tx.get("account", "10")));
    assert.equal(retained.sealed, previous.sealed);
    assert.equal(retained.operation, undefined);
    fail = false;
    await service.connectApiKey(1, actor, { apiKey: newKey });
    const updated = (await store.transact(1, (tx) => tx.get("account", "10")));
    assert.notEqual(updated.id, previous.id);
    assert.deepEqual(service.secrets.open(updated.sealed, `account:10:${updated.id}`), { apiKey: newKey });
    assert.equal((await service.snapshot(1, actor)).workspace.sessionId, null);
    assert.equal(await store.transact(1, (tx) => tx.get("thread", "10")), undefined);
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
    const waiting = (await store.transact(1, (tx) => tx.get("account", "10")));
    assert.equal(waiting.operation, undefined);
    assert.equal(waiting.loginId, "fixture-login");
    pending = false;
    assert.deepEqual(await service.completeLogin(1, actor), { connected: true });
    const connected = (await store.transact(1, (tx) => tx.get("account", "10")));
    assert.equal(connected.loginId, undefined);
    assert.equal(connected.operation, undefined);
    assert.deepEqual(service.secrets.open(connected.sealed, `account:10:${connected.id}`), authMaterial("fixture-access"));
    assert.equal(connected.fingerprint, codexAuthMaterialFingerprintSha256(authMaterial("fixture-access")));
    const publicEvents = JSON.stringify(await store.events(1, 0));
    assert.ok(!publicEvents.includes("fixture-access") &&
        !publicEvents.includes("dataBase64"));
});
test("account completion blocks competing takeover and stale credential refreshes cannot replace a new login", async () => {
    let release, entered;
    const completing = new Promise((resolve) => {
        entered = resolve;
    });
    const commands = [];
    const { store, service } = await setup(async (command) => {
        commands.push(command.messageType);
        if (command.messageType === "codex.auth.login.complete") {
            entered();
            await new Promise((resolve) => {
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
        await assert.rejects(service.claim(1, { userId: 11, admin: true }, true), /transition/);
        await assert.rejects(service.completeLogin(1, actor), /pending account operation/);
    }
    finally {
        release();
    }
    await completion;
    assert.ok(commands.includes("session.terminate"));
    assert.equal(await store.transact(1, async (tx) => tx.state.sessionId), null);
    assert.equal(await store.transact(1, (tx) => tx.get("thread", "10")), undefined);
    assert.equal(await store.transact(1, (tx) => tx.get("lease", "transition")), undefined);
    const connected = (await store.transact(1, (tx) => tx.get("account", "10")));
    await service.ingestAuth(hostId, {
        vmHostId: hostId,
        sessionId: runId,
        authProfileId: connected.id,
        baseFingerprintSha256: codexAuthMaterialFingerprintSha256(authMaterial("old-account")),
        currentFingerprintSha256: codexAuthMaterialFingerprintSha256(authMaterial("stale-refresh")),
        authMaterial: authMaterial("stale-refresh"),
        updatedAt: new Date().toISOString(),
    });
    assert.deepEqual(await store.transact(1, (tx) => tx.get("account", "10")), connected);
});
async function approvalFixture() {
    const { store, service } = await setup();
    const graph = (await store.transact(1, async (tx) => tx.state)).graph;
    const files = {
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
        "source/analysis.ts": "export async function run(_context: unknown, input: unknown) { return input; }",
    };
    const runtimeImage = `sha256:${"a".repeat(64)}`;
    const sent = [];
    service.broker.dispatchCommand = async (command) => {
        if (command.messageType === "workflow.snapshot")
            return { data: { files: structuredClone(files), runtimeImage } };
        if (command.messageType === "workflow.inputs")
            return { data: { inputCount: 1000 } };
        if (command.messageType === "workflow.graph")
            files["graph.json"] = JSON.stringify(command.data.graph);
        sent.push({
            messageType: command.messageType,
            data: command.data,
        });
        return { ok: true };
    };
    const asset = {
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
        trial.spentMicros = 50000;
        trial.nodeCosts = {
            analyze: { spentMicros: 50000, reservedMicros: 0, requests: 5 },
        };
        await store.transact(1, (tx) => tx.put("run", trial.id, trial));
        return trial;
    };
    return { store, service, files, sent, asset, actor, finishTrial };
}
test("bulk approval requires a matching completed trial and an explicit cap; concurrent starts dispatch once", async () => {
    const f = await approvalFixture();
    await assert.rejects(f.service.draftRun(1, f.actor, "bulk", [f.asset.id]), /Run a successful trial/);
    const trial = await f.finishTrial();
    const bulk = await f.service.draftRun(1, f.actor, "bulk", [f.asset.id]);
    assert.equal(bulk.estimate?.trialRunId, trial.id);
    assert.equal(bulk.estimate?.expectedMicros, 10000000);
    await assert.rejects(f.service.startRun(1, f.actor, bulk.id));
    assert.equal(f.sent.length, 0);
    const starts = await Promise.allSettled([
        f.service.startRun(1, f.actor, bulk.id, 20000000),
        f.service.startRun(1, f.actor, bulk.id, 20000000),
    ]);
    assert.equal(starts.filter((r) => r.status === "fulfilled").length, 1);
    assert.equal(f.sent.filter((command) => command.messageType === "workflow.run").length, 1);
    const approved = (await f.store.transact(1, (tx) => tx.get("run", bulk.id)));
    assert.equal(approved.budgetMicros, 20000000);
    assert.ok(approved.approvedAt);
});
test("a discounted reused trial cannot understate a fresh bulk estimate", async () => {
    const f = await approvalFixture();
    const trial = await f.finishTrial();
    trial.reuse = {
        runId: randomUUID(),
        fromNodeId: "analyze",
        nodeIds: ["normalize"],
        historicalMicros: 1000000,
    };
    await f.store.transact(1, (tx) => tx.put("run", trial.id, trial));
    await assert.rejects(f.service.draftRun(1, f.actor, "bulk", [f.asset.id]), /successful trial/);
});
test("bulk reuse needs a fresh matching trial, estimates remaining stages, and waits for new approval", async () => {
    const f = await approvalFixture();
    const graph = JSON.parse(f.files["graph.json"]);
    graph.nodes.push({
        ...graph.nodes[0],
        id: "research",
        label: "Research",
        configuration: { depth: 1 },
    });
    graph.edges.push({
        id: "research-edge",
        source: "analyze",
        target: "research",
    });
    f.files["graph.json"] = JSON.stringify(graph);
    await f.finishTrial();
    const original = await f.service.draftRun(1, f.actor, "bulk", [f.asset.id]);
    original.status = "completed";
    original.nodeStates.analyze = {
        status: "completed",
        processed: 1000,
        total: 1000,
    };
    const asset = {
        id: randomUUID(),
        checksum: "saved-output",
        stagePart: { runId: original.id, nodeId: "analyze", part: 0, parts: 1 },
    };
    original.stageOutputs = {
        analyze: {
            assets: [asset],
            checksum: "output",
            originRunId: original.id,
            sourceHash: original.sourceHash,
            fingerprint: original.nodeFingerprints.analyze,
            spentMicros: 10000000,
        },
    };
    await f.store.transact(1, async (tx) => {
        await tx.put("asset", asset.id, asset);
        await tx.put("run", original.id, original);
    });
    graph.nodes.find((n) => n.id === "research").configuration.depth = 2;
    f.files["graph.json"] = JSON.stringify(graph);
    const reuse = { runId: original.id, fromNodeId: "research" };
    await assert.rejects(f.service.draftRun(1, f.actor, "bulk", [f.asset.id], 5, undefined, reuse), /successful trial/);
    const trial = await f.finishTrial();
    trial.nodeCosts.research = {
        spentMicros: 20000,
        reservedMicros: 0,
        requests: 5,
    };
    trial.spentMicros += 20000;
    await f.store.transact(1, (tx) => tx.put("run", trial.id, trial));
    const rerun = await f.service.draftRun(1, f.actor, "bulk", [f.asset.id], 5, undefined, reuse);
    assert.equal(rerun.status, "awaiting_approval");
    assert.equal(rerun.approvedAt, undefined);
    assert.equal(rerun.budgetMicros, 0);
    assert.equal(rerun.estimate.expectedMicros, 4000000);
    assert.deepEqual(rerun.estimate.agents.map((a) => a.nodeId), ["research"]);
    assert.equal(rerun.estimate.trialRunId, trial.id);
    assert.equal(rerun.reuse.historicalMicros, 10000000);
    await assert.rejects(f.service.startRun(1, f.actor, rerun.id));
    await f.service.startRun(1, f.actor, rerun.id, 5000000);
    const dispatched = f.sent.find((command) => command.messageType === "workflow.run");
    assert.ok(dispatched);
    assert.deepEqual(dispatched.data.run.reuse.nodeIds, [
        "analyze",
    ]);
});
test("source, model prices, reasoning effort and concurrency changes invalidate prior trial approvals", async (t) => {
    for (const change of ["source", "prices", "effort", "concurrency"]) {
        await t.test(change, async () => {
            const f = await approvalFixture();
            await f.finishTrial();
            const bulk = await f.service.draftRun(1, f.actor, "bulk", [f.asset.id]);
            if (change === "source")
                f.files["source/analysis.ts"] += "\n// New prompt revision";
            else if (change === "prices")
                f.service.models.definitions[0].priceVersion = "changed";
            else if (change === "effort") {
                const graph = JSON.parse(f.files["graph.json"]);
                graph.nodes.find((node) => node.id === "analyze").reasoningEffort =
                    "high";
                f.files["graph.json"] = JSON.stringify(graph);
            }
            else
                await f.store.transact(1, async (tx) => {
                    tx.state.config.concurrency = 4;
                    tx.state.revision++;
                });
            await assert.rejects(f.service.draftRun(1, f.actor, "bulk", [f.asset.id]), /Run a successful trial/);
            await assert.rejects(f.service.startRun(1, f.actor, bulk.id, 20000000), /changed/);
            assert.equal(f.sent.length, 0);
            assert.equal(await f.store.transact(1, async (tx) => tx.state.spentMicros), 0);
        });
    }
});
test("model changes apply to future runs while prior selections, default reasoning and prices stay frozen", async () => {
    const f = await approvalFixture();
    const primary = f.service.models.definitions[0];
    primary.reasoning = true;
    primary.reasoningEffort = "max";
    f.service.models.definitions.push({
        ...primary,
        id: "alternative-model",
        label: "Alternative",
        reasoningEffort: "high",
    });
    const first = await f.finishTrial();
    const savedModel = structuredClone(first.modelCatalog[0]);
    assert.equal(savedModel.reasoningEffort, "max");
    primary.reasoningEffort = "low";
    primary.priceVersion = "updated";
    const state = await f.store.transact(1, async (tx) => tx.state);
    const graph = structuredClone(state.graph);
    graph.nodes[0].models = {
        default: "alternative-model",
        review: "test-model",
    };
    graph.nodes[0].reasoningEffort = "high";
    await f.service.updateGraph(1, f.actor, graph, state.revision);
    await assert.rejects(f.service.updateGraph(1, f.actor, graph, state.revision), /Graph changed/);
    await assert.rejects(f.service.draftRun(1, f.actor, "bulk", [f.asset.id]), /Run a successful trial/);
    const next = await f.service.draftRun(1, f.actor, "trial", [f.asset.id]);
    assert.deepEqual(next.graph.nodes[0].models, {
        default: "alternative-model",
        review: "test-model",
    });
    assert.equal(next.graph.nodes[0].reasoningEffort, "high");
    const snapshot = await f.service.snapshot(1, f.actor);
    const old = snapshot.runs.find((run) => run.id === first.id);
    assert.deepEqual(old.graph.nodes[0].models, { default: "test-model" });
    assert.equal(old.graph.nodes[0].reasoningEffort, undefined);
    assert.deepEqual(old.modelCatalog, [savedModel]);
    assert.equal(snapshot.workspace.config.codexModel, state.config.codexModel);
    assert.equal(snapshot.models.find((model) => model.id === "test-model").reasoningEffort, "low");
    // Runs created before the UI metadata field still have an immutable catalog in storage.
    delete first.modelCatalog;
    await f.store.transact(1, (tx) => tx.put("run", first.id, first));
    assert.deepEqual((await f.service.snapshot(1, f.actor)).runs.find((run) => run.id === first.id).modelCatalog, [savedModel]);
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
    await assert.rejects(f.service.draftRun(1, f.actor, "bulk", [updated.id]), /Run a successful trial/);
    await f.service.startRun(1, f.actor, bulk.id, 20000000);
    const dispatched = f.sent.find((command) => command.messageType === "workflow.run");
    assert.deepEqual(dispatched.data.assets, [f.asset]);
});
test("chat uses the active thread and the group administrator's selected Codex model", async () => {
    let sent;
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
    await service.chat(1, { userId: 10, admin: false }, "Review the inputs", false);
    assert.equal(sent?.codexThreadId, "thread-1");
    assert.deepEqual(sent?.overrides, {
        model: "test-codex",
        reasoningEffort: "max",
        serviceTier: "regular",
    });
});
test("live assistant settings apply on the next turn, preserve steering and reuse the thread", async () => {
    const commands = [];
    const { store, service } = await setup(async (command) => {
        commands.push(command);
        if (command.messageType === "session.turn.start")
            VmSessionTurnStartPayloadSchema.parse(command.data);
        return {};
    });
    const actor = { userId: 10, admin: false };
    const state = await store.transact(1, async (tx) => {
        tx.state.sessionId = runId;
        await tx.put("session", runId, {
            id: runId,
            ownerId: 10,
            status: "ready",
            active: false,
            threadId: "thread-1",
        });
        return tx.state;
    });
    service.workspaceGroups.set(state.id, 1);
    const original = assistantSettings(state.config);
    const selected = {
        model: "gpt-6-sol",
        reasoningEffort: "high",
        serviceTier: "fast",
    };
    const runBefore = await store.transact(1, (tx) => tx.get("run", runId));
    const event = (seq, eventType, turnId) => service.ingestSession(hostId, {
        seq,
        eventType,
        sessionId: runId,
        workspaceId: state.id,
        vmHostId: hostId,
        codexThreadId: "thread-1",
        codexTurnId: turnId,
        payload: {},
    });
    await service.chat(1, actor, "First message", false);
    await event(1, "turn.started", "turn-one");
    await service.updateAssistantSettings(1, actor, {
        settings: selected,
        expected: original,
    });
    const running = await service.snapshot(1, actor);
    assert.deepEqual(running.assistantSession, {
        active: true,
        turnSettings: original,
    });
    assert.equal(running.workspace.revision, state.revision);
    assert.deepEqual(running.workspace.graph, state.graph);
    assert.deepEqual(await store.transact(1, (tx) => tx.get("run", runId)), runBefore);
    assert.equal(running.workspace.config.budgetMicros, state.config.budgetMicros);
    await service.chat(1, actor, "Focus on the first record", true);
    assert.equal(commands.at(-1).messageType, "session.turn.steer");
    assert.equal(commands.at(-1).data.codexTurnId, "turn-one");
    assert.equal(commands.at(-1).data.overrides, undefined);
    await assert.rejects(service.chat(1, actor, "Do not overlap turns", false), /assistant is working/);
    // Discovery is available to the active operator, including a non-admin.
    await service.codexModels(1, actor);
    assert.equal(commands.at(-1).messageType, "workflow.models");
    await event(2, "turn.completed", "turn-one");
    await assert.rejects(service.chat(1, actor, "No active turn", true), /active assistant turn/);
    await service.chat(1, actor, "Second message", false);
    assert.deepEqual(commands.at(-1).data.overrides, selected);
    assert.equal(commands.at(-1).data.codexThreadId, "thread-1");
    assert.deepEqual((await service.snapshot(1, actor)).assistantSession, {
        active: true,
        turnSettings: selected,
    });
    await event(3, "turn.started", "turn-two");
    await event(4, "turn.completed", "turn-two");
    const standard = {
        ...selected,
        serviceTier: "regular",
    };
    await service.updateAssistantSettings(1, actor, {
        settings: standard,
        expected: selected,
    });
    await service.chat(1, actor, "Third message", false);
    // Verify the actual app-server request clears a previous Fast override.
    const params = turnStartParams({
        commandId: "test-command",
        sessionId: runId,
        runId: state.id,
        runStepId: "test-step",
        nodeId: "test-node",
        workspaceId: state.id,
        vmHostId: hostId,
        runtimeProfileId: state.id,
        inputPayload: {},
        runtimeSnapshot: { modelDefaults: { ...selected } },
        layout: {
            rootPath: "/tmp/workflow",
            workspacePath: "/tmp/workflow/workspace",
            codexHomePath: "/tmp/workflow/codex-home",
            artifactsPath: "/tmp/workflow/artifacts",
            cachePath: "/tmp/workflow/cache",
        },
    }, [{ type: "text", text: "Third message" }], commands.at(-1).data.overrides);
    assert.equal(params.model, selected.model);
    assert.equal(params.effort, selected.reasoningEffort);
    assert.equal(params.serviceTier, null);
    assert.ok(!commands.some((c) => ["session.start", "session.terminate", "session.interrupt"].includes(c.messageType)));
    const messages = (await store.events(1, 0)).filter((e) => e.type === "chat.user");
    assert.deepEqual(messages.map((e) => e.data.assistantSettings), [original, original, selected, standard]);
    assert.deepEqual(messages.map((e) => e.data.steer), [false, true, false, false]);
});
test("assistant settings reject stale edits, invalid values, and operators without current control", async () => {
    const { store, service } = await setup();
    const actor = { userId: 10, admin: false };
    const expected = assistantSettings((await service.snapshot(1, actor)).workspace.config);
    const settings = {
        ...expected,
        model: "gpt-6-sol",
        reasoningEffort: "high",
        serviceTier: "fast",
    };
    for (const invalid of [
        { ...settings, model: "  " },
        { ...settings, reasoningEffort: "auto" },
        { ...settings, serviceTier: "unlimited" },
        { ...settings, budgetMicros: 500 },
    ])
        await assert.rejects(service.updateAssistantSettings(1, actor, {
            settings: invalid,
            expected,
        }));
    for (const unauthorized of [
        { userId: 11, admin: true },
        { userId: 99, admin: false },
    ]) {
        await assert.rejects(service.updateAssistantSettings(1, unauthorized, { settings, expected }), /operator/);
        await assert.rejects(service.codexModels(1, unauthorized), /operator/);
    }
    await store.transact(1, (tx) => tx.put("lease", "transition", { id: "fixture" }));
    await assert.rejects(service.updateAssistantSettings(1, actor, { settings, expected }), /transition/);
    await store.transact(1, (tx) => tx.remove("lease", "transition"));
    await service.updateAssistantSettings(1, actor, { settings, expected });
    const current = (await service.snapshot(1, actor)).workspace.config;
    await assert.rejects(service.configure(1, { ...actor, admin: true }, {
        ...current,
        codexModel: expected.model,
        expectedAssistantSettings: expected,
    }), /settings changed/);
    await assert.rejects(service.updateAssistantSettings(1, actor, { settings: expected, expected }), /settings changed/);
    assert.deepEqual(assistantSettings((await service.snapshot(1, actor)).workspace.config), settings);
    assert.equal((await store.events(1, 0)).filter((e) => e.type === "assistant.settings.updated").length, 1);
});
test("disconnect serializes account replacement and takeover until the old session has stopped", async () => {
    let finish, entered;
    const starting = new Promise((resolve) => {
        entered = resolve;
    });
    const { store, service } = await setup(async () => {
        entered();
        await new Promise((resolve) => {
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
    await assert.rejects(service.claim(1, { userId: 11, admin: true }, true), /transition/);
    await assert.rejects(service.login(1, { userId: 10, admin: false }), /pending account operation/);
    finish();
    await disconnect;
    assert.equal(await store.transact(1, (tx) => tx.get("account", "10")), undefined);
    await service.claim(1, { userId: 11, admin: true }, true);
    assert.equal(await store.transact(1, async (tx) => tx.state.operator?.userId), 11);
});
test("an unacknowledged resume returns to a spending pause and can be retried", async () => {
    const { store, service } = await setup(async () => {
        throw new Error("offline");
    });
    await store.transact(1, async (tx) => {
        const run = (await tx.get("run", runId));
        run.status = "paused";
        await tx.put("run", runId, run);
        tx.state.activeRunId = runId;
    });
    await assert.rejects(service.controlRun(1, { userId: 10, admin: false }, runId, "resume"), /offline/);
    assert.equal((await store.transact(1, (tx) => tx.get("run", runId)))
        ?.status, "paused");
    assert.equal(await store.transact(1, (tx) => tx.get("run-control", runId)), undefined);
});
test("an unavailable VM cannot silently commit graph settings that were never written", async () => {
    const { store, service } = await setup(async () => {
        throw new Error("offline");
    });
    const before = await store.transact(1, async (tx) => tx.state), graph = structuredClone(before.graph);
    graph.nodes[0].models.default = "changed";
    await assert.rejects(service.updateGraph(1, { userId: 10, admin: false }, graph, before.revision), /offline/);
    assert.deepEqual(await store.transact(1, async (tx) => tx.state), before);
});
test("old container exits and duplicate events cannot corrupt a resumed run", async () => {
    const { store, service } = await setup();
    await store.transact(1, async (tx) => {
        tx.state.activeRunId = runId;
    });
    await service.runnerEvent(1, hostId, runId, "run.started", { executionId: "new" }, "start-new");
    await service.runnerEvent(1, hostId, runId, "run.failed", { executionId: "old", error: "old exit" }, "exit-old");
    assert.equal((await store.transact(1, (tx) => tx.get("run", runId)))
        ?.status, "running");
    await service.runnerEvent(1, hostId, runId, "run.completed", { executionId: "new" }, "complete-new");
    await service.runnerEvent(1, hostId, runId, "run.failed", { executionId: "new" }, "late-failure");
    assert.equal((await store.transact(1, (tx) => tx.get("run", runId)))
        ?.status, "completed");
    assert.equal(await store.transact(1, async (tx) => tx.state.activeRunId), null);
});
test("resuming requires reconciliation and records explicit increases to the approved cap", async () => {
    const { store, service } = await setup();
    await store.transact(1, async (tx) => {
        const run = (await tx.get("run", runId));
        run.status = "paused";
        await tx.put("run", runId, run);
        tx.state.activeRunId = runId;
        await tx.put("usage", "pending", { runId, status: "unknown" });
    });
    await assert.rejects(service.controlRun(1, { userId: 10, admin: false }, runId, "resume", 6000000000), /Reconcile/);
    await store.transact(1, (tx) => tx.remove("usage", "pending"));
    await service.controlRun(1, { userId: 10, admin: false }, runId, "resume", 6000000000);
    assert.equal((await store.transact(1, (tx) => tx.get("run", runId)))
        ?.budgetMicros, 6000000000);
    assert.ok((await store.events(1, 0)).some((e) => e.type === "run.allowance.approved"));
});
test("execution failures retain the active run and resume with the same paid request identity", async () => {
    const { store, service } = await setup();
    await store.transact(1, async (tx) => {
        tx.state.activeRunId = runId;
    });
    await service.runnerEvent(1, hostId, runId, "run.started", { executionId: "first" }, "first-start");
    await service.runnerEvent(1, hostId, runId, "run.failed", { executionId: "first", error: "Disk temporarily unavailable" }, "first-fail");
    const failed = (await store.transact(1, (tx) => tx.get("run", runId)));
    assert.equal(failed.status, "paused");
    assert.equal(failed.completedAt, undefined);
    assert.equal(await store.transact(1, async (tx) => tx.state.activeRunId), runId);
    await service.controlRun(1, { userId: 10, admin: false }, runId, "resume");
    const resumed = (await store.transact(1, (tx) => tx.get("run", runId)));
    assert.equal(resumed.status, "running");
    assert.equal(resumed.sourceHash, failed.sourceHash);
    assert.equal(resumed.id, failed.id);
});
test("agent messages persist with timestamps and bounded history without replacing parent progress", async () => {
    const { store, service } = await setup();
    const send = (data, key) => service.runnerEvent(1, hostId, runId, "node.progress", { nodeId: "analyze", executionId: "current", ...data }, key);
    const read = async () => (await store.transact(1, (tx) => tx.get("run", runId)));
    await service.runnerEvent(1, hostId, runId, "run.started", { executionId: "current" }, "started");
    await send({ processed: 2, total: 5, failedRecords: 1 }, "parent");
    await send({
        processed: 0,
        total: 1,
        child: "evidence",
        message: "Checking evidence for Records Clerk",
    }, "child");
    const initial = await read();
    assert.equal(initial.nodeStates.analyze.processed, 2);
    assert.equal(initial.nodeStates.analyze.total, 5);
    assert.equal(initial.nodeStates.analyze.failedRecords, 1);
    assert.equal(initial.nodeStates.analyze.message, "Checking evidence for Records Clerk");
    assert.ok(Number.isFinite(Date.parse(initial.nodeStates.analyze.updatedAt)));
    assert.equal(initial.childStates?.["analyze:evidence"].processed, 0);
    assert.equal(initial.agentMessages?.length, 2);
    assert.equal((await store.events(1, 0)).at(-1)?.data.message, initial.nodeStates.analyze.message);
    await send({ processed: 1, total: 1, message: "Duplicate delivery" }, "child");
    await send({ processed: 1, total: 1, message: "Old execution", executionId: "old" }, "old");
    await send({ nodeId: "unrelated", processed: 1, total: 1, message: "Other node" }, "other");
    assert.deepEqual((await read()).nodeStates, initial.nodeStates);
    assert.deepEqual((await read()).agentMessages, initial.agentMessages);
    for (let i = 0; i < 55; i++)
        await send({ processed: 0, total: 1, child: "evidence", message: `Update ${i}` }, `update:${i}`);
    assert.equal((await read()).agentMessages?.length, 50);
    assert.equal((await read()).agentMessages?.[0].message, "Update 5");
    await send({ processed: 5, total: 5, complete: true }, "done");
    const completed = await read();
    assert.equal(completed.nodeStates.analyze.status, "completed");
    assert.equal(completed.nodeStates.analyze.message, "Completed · 5/5 records processed");
    assert.equal(completed.nodeStates.analyze.failedRecords, 1);
    assert.equal(completed.spentMicros, 0);
    await service.runnerEvent(1, hostId, runId, "run.completed", { executionId: "current" }, "finish");
    await send({ processed: 0, total: 5, message: "Late update" }, "late");
    assert.deepEqual((await read()).agentMessages, completed.agentMessages);
});
test("failed records stay visible after final progress and cannot support a bulk estimate", async () => {
    const f = await approvalFixture();
    const trial = await f.service.draftRun(1, f.actor, "trial", [f.asset.id]);
    await f.service.startRun(1, f.actor, trial.id);
    await f.service.runnerEvent(1, hostId, trial.id, "node.progress", { nodeId: "analyze", processed: 5, total: 5, failedRecords: 1 }, "bad-row");
    await f.service.runnerEvent(1, hostId, trial.id, "node.progress", { nodeId: "analyze", processed: 5, total: 5, complete: true }, "final-progress");
    await f.service.runnerEvent(1, hostId, trial.id, "run.completed", {}, "finish");
    const completed = (await f.store.transact(1, (tx) => tx.get("run", trial.id)));
    assert.equal(completed.nodeStates.analyze.failedRecords, 1);
    await assert.rejects(f.service.draftRun(1, f.actor, "bulk", [f.asset.id]), /failed records/);
});
test("agent caps can only be raised explicitly within the run allowance when resuming", async () => {
    const { store, service } = await setup();
    await store.transact(1, async (tx) => {
        tx.state.activeRunId = runId;
        const run = (await tx.get("run", runId));
        run.status = "paused";
        run.nodeCosts = {
            analyze: { spentMicros: 50000, reservedMicros: 0, requests: 1 },
        };
        run.graph.nodes[0].budgetMicros = 60000;
        await tx.put("run", runId, run);
    });
    const actor = { userId: 10, admin: false };
    for (const caps of [
        { analyze: 49000 },
        { analyze: 6000000000 },
        { unknown: 100000 },
    ])
        await assert.rejects(service.controlRun(1, actor, runId, "resume", undefined, caps), /Agent allowance/);
    await service.controlRun(1, actor, runId, "resume", undefined, {
        analyze: 100000,
    });
    const resumed = (await store.transact(1, (tx) => tx.get("run", runId)));
    assert.equal(resumed.nodeBudgets?.analyze, 100000);
    assert.equal(resumed.graph.nodes[0].budgetMicros, 60000, "immutable graph is preserved");
    assert.ok((await store.events(1, 0)).some((e) => e.type === "run.agent_allowances.approved"));
});
test("record cap increases require approval, cover parent spend, and preserve the frozen graph", async () => {
    const { store, service } = await setup();
    await store.transact(1, async (tx) => {
        tx.state.activeRunId = runId;
        const run = (await tx.get("run", runId));
        run.status = "paused";
        run.graph.nodes[0].recordBudgetMicros = 60000;
        await tx.put("run", runId, run);
        await tx.put("usage", "paid", {
            runId,
            nodeId: "analyze",
            recordId: "parent",
            status: "settled",
            actualMicros: 50000,
            maximumMicros: 60000,
        });
    });
    const actor = { userId: 10, admin: false };
    for (const cap of [49000, 6000000000])
        await assert.rejects(service.controlRun(1, actor, runId, "resume", undefined, undefined, {
            analyze: cap,
        }), /Record allowance/);
    await service.controlRun(1, actor, runId, "resume", undefined, undefined, {
        analyze: 100000,
    });
    const resumed = (await store.transact(1, (tx) => tx.get("run", runId)));
    assert.equal(resumed.nodeRecordBudgets?.analyze, 100000);
    assert.equal(resumed.graph.nodes[0].recordBudgetMicros, 60000);
    assert.ok((await store.events(1, 0)).some((e) => e.type === "run.record_allowances.approved"));
});
test("a targeted trial cannot approve a broader set of agents", async () => {
    const f = await approvalFixture();
    const graph = JSON.parse(f.files["graph.json"]);
    graph.nodes.push({ ...graph.nodes[0], id: "later", label: "Later stage" });
    graph.edges.push({ id: "later-edge", source: "analyze", target: "later" });
    f.files["graph.json"] = JSON.stringify(graph);
    const trial = await f.service.draftRun(1, f.actor, "trial", [f.asset.id], 3, "analyze");
    assert.deepEqual(trial.nodeIds, ["analyze"]);
    assert.equal(trial.inputCount, 3);
    trial.status = "completed";
    await f.store.transact(1, (tx) => tx.put("run", trial.id, trial));
    await assert.rejects(f.service.draftRun(1, f.actor, "bulk", [f.asset.id]), /selected agents/);
    const bulk = await f.service.draftRun(1, f.actor, "bulk", [f.asset.id], 3, "analyze");
    assert.equal(bulk.estimate?.trialRunId, trial.id);
});
test("revision restore checks operator, draft version and active work, preserving saved sources", async () => {
    const f = await approvalFixture();
    const original = await f.service.packageSnapshot(1);
    assert.equal((await f.service.snapshot(1, f.actor)).assistantName, "Fixture Assistant");
    f.files["source/analysis.ts"] += "\n// updated";
    f.files["manifest.json"] = JSON.stringify({
        ...JSON.parse(f.files["manifest.json"]),
        assistantName: "Evidence Guide",
    });
    const edited = await f.service.packageSnapshot(1);
    assert.equal((await f.service.snapshot(1, f.actor)).assistantName, "Evidence Guide");
    const history = await f.service.revisions(1);
    assert.equal(history.currentHash, edited.hash);
    assert.equal(history.revisions.length, 2);
    assert.deepEqual((await f.service.revision(1, original.hash)).files, original.files);
    const revision = await f.store.transact(1, async (tx) => tx.state.revision);
    await assert.rejects(f.service.restoreRevision(1, { userId: 11, admin: false }, original.hash, revision), /operator/);
    await assert.rejects(f.service.restoreRevision(1, f.actor, original.hash, revision - 1), /draft changed/);
    await f.store.transact(1, async (tx) => {
        tx.state.activeRunId = runId;
    });
    await assert.rejects(f.service.restoreRevision(1, f.actor, original.hash, revision), /active run/);
    await f.store.transact(1, async (tx) => {
        tx.state.activeRunId = null;
        tx.state.sessionId = runId;
        await tx.put("session", runId, {
            id: runId,
            active: true,
            status: "ready",
        });
    });
    await assert.rejects(f.service.restoreRevision(1, f.actor, original.hash, revision), /Codex turn/);
    await f.store.transact(1, async (tx) => {
        tx.state.sessionId = null;
    });
    f.service.broker.dispatchCommand = async () => {
        throw new Error("offline");
    };
    await assert.rejects(f.service.restoreRevision(1, f.actor, original.hash, revision), /offline/);
    assert.equal((await f.service.revisions(1)).currentHash, edited.hash);
    f.service.broker.dispatchCommand = async (command) => {
        assert.equal(command.messageType, "workflow.restore");
        return { data: { hash: original.hash, backup: ".package-backup-fixture" } };
    };
    await f.service.restoreRevision(1, f.actor, original.hash, revision);
    assert.equal((await f.service.snapshot(1, f.actor)).assistantName, "Fixture Assistant");
    assert.equal((await f.service.revisions(1)).currentHash, original.hash);
    assert.deepEqual((await f.service.revision(1, edited.hash)).files, edited.files);
    assert.equal(await f.store.transact(1, async (tx) => tx.state.revision), revision + 1);
});
test("VM retention excludes active, paused, unsettled and recent runs", async () => {
    const pruned = [];
    const { store, service } = await setup(async (command) => {
        if (command.messageType === "workflow.prune") {
            pruned.push(command.data.runIds);
            return { data: { removed: command.data.runIds.length } };
        }
        return {
            data: { availableBytes: 10 * 1024 ** 3, minimumFreeBytes: 1024 ** 3 },
        };
    });
    const old = new Date(Date.now() - 40 * 86400000).toISOString();
    const eligible = [];
    await store.transact(1, async (tx) => {
        const base = (await tx.get("run", runId));
        for (const status of [
            "completed",
            "cancelled",
            "paused",
            "running",
            "completed",
            "completed",
        ]) {
            const id = randomUUID();
            const run = { ...base, id, status, createdAt: old, completedAt: old };
            if (eligible.length < 2)
                eligible.push(id);
            else if (status === "completed") {
                if (!(await tx.get("test", "unsettled"))) {
                    await tx.put("usage", id, { runId: id, status: "unknown" });
                    await tx.put("test", "unsettled", true);
                }
                else
                    run.completedAt = new Date().toISOString();
            }
            await tx.put("run", id, run);
        }
    });
    await store.transact(1, async (tx) => {
        const active = (await tx.get("run", runId));
        active.createdAt = old;
        tx.state.activeRunId = runId;
        await tx.put("run", runId, active);
    });
    await service.controlRun(1, { userId: 10, admin: true }, runId, "cancel");
    const cancelled = (await store.transact(1, (tx) => tx.get("run", runId)));
    assert.ok(Date.parse(cancelled.completedAt) > Date.now() - 60000, "retention starts when cancellation completes");
    await assert.rejects(service.storage(1, { userId: 10, admin: false }, true));
    assert.equal((await service.storage(1, { userId: 10, admin: true })).eligibleRuns, 2);
    assert.equal(pruned.length, 0);
    assert.equal((await service.storage(1, { userId: 10, admin: true }, true)).removed, 2);
    assert.deepEqual(pruned[0].sort(), eligible.sort());
    assert.equal((await service.storage(1, { userId: 10, admin: true })).eligibleRuns, 0);
    for (const id of eligible)
        assert.ok(await store.transact(1, (tx) => tx.get("run", id)), "audit records remain");
});
test("an unacknowledged chat turn retains its active marker until it can be stopped", async () => {
    const { store, service } = await setup(async (command) => {
        if (command.messageType === "session.terminate")
            return {};
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
    await assert.rejects(service.chat(1, { userId: 10, admin: false }, "Review the sources", false), /acknowledgement lost/);
    assert.equal((await store.transact(1, (tx) => tx.get("session", runId)))?.active, true);
    await service.sessionControl(1, { userId: 10, admin: false }, "terminate", {});
    assert.equal(await store.transact(1, async (tx) => tx.state.sessionId), null);
    assert.deepEqual(await store.transact(1, (tx) => tx.get("account", "10")), {
        sealed: "encrypted-existing-credential",
    });
    assert.deepEqual(await store.transact(1, (tx) => tx.get("thread", "10")), {
        id: "fixture",
    });
});
