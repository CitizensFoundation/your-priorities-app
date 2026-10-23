import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { CodexWorkflowTools } from "../codexTools.js";
import { parseWorkflowArguments } from "../runner/cliArguments.js";
import { commitConnection, connectionProposalSchema, } from "../connectionSetup.js";
import { WorkflowService } from "../workflowService.js";
import { AssetService } from "../assets.js";
import { ModelGateway } from "../modelGateway.js";
import { HostDirectory, SecretBox } from "../secrets.js";
import { fixture, hostId } from "./memoryStore.js";
import { fixtureModelsJson } from "./modelFixture.js";
const actor = { userId: 10, admin: false };
const admin = { userId: 11, admin: true };
const binding = {
    id: "jobs",
    label: "Job descriptions",
    kind: "your-priorities",
    resourceId: "42",
    writeEnabled: false,
    settings: {},
};
async function setup() {
    const { store } = await fixture();
    const sent = [];
    const service = new WorkflowService(store, {
        dispatchCommand: async (command) => {
            sent.push(command);
            return {};
        },
        isConnected: () => true,
    }, new HostDirectory(JSON.stringify([
        {
            id: hostId,
            name: "fixture",
            token: "x".repeat(32),
            rootPath: "/tmp/workflows",
        },
    ])), new SecretBox(Buffer.alloc(32, 3).toString("base64")), new ModelGateway(store, fixtureModelsJson), {});
    return { store, service, sent };
}
test("Codex CLI accepts targeted samples and rejects spending or approval options", () => {
    assert.deepEqual(parseWorkflowArguments([
        "trial",
        "--reuse",
        "saved-run",
        "--from",
        "licenses",
        "--sample",
        "5",
        "input",
    ]).body, {
        assetIds: ["input"],
        sampleCount: 5,
        reuse: { runId: "saved-run", fromNodeId: "licenses" },
    });
    assert.throws(() => parseWorkflowArguments(["trial", "--reuse", "saved-run"]), /together/);
    assert.deepEqual(parseWorkflowArguments([
        "trial",
        "--target",
        "licenses",
        "--sample",
        "12",
        "asset",
    ]).body, { assetIds: ["asset"], targetNodeId: "licenses", sampleCount: 12 });
    assert.deepEqual(parseWorkflowArguments(["groups", "--search", "jobs"]).body, { search: "jobs" });
    assert.equal(parseWorkflowArguments(["propose-connection", "proposal.json"])
        .proposalFile, "proposal.json");
    for (const args of [
        ["bulk"],
        ["trial", "--budget", "100"],
        ["trial", "--sample", "21"],
        ["connections", "--credential", "secret"],
        ["status", "extra"],
        ["approve-connection", "x"],
    ])
        assert.throws(() => parseWorkflowArguments(args));
});
test("connection proposals reject credential fields and unreviewable resources", () => {
    for (const value of [
        { binding, purpose: "Input", credential: { apiKey: "secret" } },
        {
            binding: { ...binding, settings: { apiKey: "secret" } },
            purpose: "Input",
        },
        {
            binding: { ...binding, resourceId: "https://example.com" },
            purpose: "Input",
        },
        {
            binding: {
                ...binding,
                kind: "google-drive",
                resourceId: "file",
                writeEnabled: true,
            },
            purpose: "Input",
        },
    ])
        assert.equal(connectionProposalSchema.safeParse(value).success, false);
});
test("proposal retries deduplicate; installation and approval are atomic and stale approvals fail", async () => {
    const { store, service } = await setup();
    await assert.rejects(service.proposeConnection(1, admin, { binding, purpose: "Input" }), /operator/);
    const proposal = await service.proposeConnection(1, actor, {
        binding,
        purpose: "Input",
    });
    assert.deepEqual(await service.proposeConnection(1, actor, {
        binding,
        purpose: "Input",
    }), proposal);
    assert.equal(await store.transact(1, (tx) => tx.get("connector", binding.id)), undefined);
    await assert.rejects(service.connectionProposal(1, actor, proposal.id));
    const concurrent = await Promise.allSettled([1, 2].map(() => store.transact(1, (tx) => commitConnection(tx, binding, admin.userId, "encrypted", proposal.id))));
    assert.equal(concurrent.filter((r) => r.status === "fulfilled").length, 1);
    assert.equal((await service.snapshot(1, actor)).connectionProposals?.[0].status, "approved");
    const changed = await service.proposeConnection(1, actor, {
        binding: { ...binding, resourceId: "43" },
        purpose: "Replace",
    });
    await store.transact(1, (tx) => commitConnection(tx, { ...binding, resourceId: "44" }, admin.userId, "new-encrypted"));
    await assert.rejects(store.transact(1, (tx) => commitConnection(tx, changed.binding, admin.userId, "encrypted", changed.id)), /changed/);
    assert.equal((await service.connectionProposal(1, admin, changed.id)).status, "pending");
    await service.rejectConnection(1, admin, changed.id);
    await assert.rejects(store.transact(1, (tx) => commitConnection(tx, changed.binding, admin.userId, "encrypted", changed.id)), /pending/);
    assert.ok(!JSON.stringify(await service.snapshot(1, actor)).includes("encrypted"));
    const sameBinding = { ...binding, resourceId: "44" };
    const rotation = await service.proposeConnection(1, actor, {
        binding: sameBinding,
        purpose: "Update credentials",
    });
    await store.transact(1, (tx) => commitConnection(tx, sameBinding, admin.userId, "rotated-secret"));
    await assert.rejects(store.transact(1, (tx) => commitConnection(tx, sameBinding, admin.userId, "stale-secret", rotation.id)), /changed/);
});
test("Codex tools scope discovery, imports and trials to the operator and private workspace", async (t) => {
    const { store, service, sent } = await setup();
    const root = await mkdtemp(path.join(tmpdir(), "yp-codex-tools-"));
    t.after(() => rm(root, { recursive: true, force: true }));
    const assets = new AssetService(store, root);
    const reads = [];
    const tools = new CodexWorkflowTools(service, assets, {
        list: async () => [binding],
        read: async (group, id, user) => {
            reads.push([group, id, user]);
            if (id !== "jobs")
                throw new Error("Choose a data connector");
            return [{ id: "one", text: "Fixture" }];
        },
    }, async (user, search) => {
        assert.equal(user, 10);
        assert.equal(search, "jobs");
        return [{ id: 42, name: "Jobs" }];
    });
    assert.deepEqual(await tools.execute(1, actor, "groups", { search: "jobs" }), [{ id: 42, name: "Jobs" }]);
    assert.deepEqual(await tools.execute(1, actor, "check-connection", {
        bindingId: "jobs",
    }), { records: 1 });
    await assert.rejects(tools.execute(1, actor, "check-connection", {
        bindingId: "firecrawl",
    }), /data connector/);
    const imported = (await tools.execute(1, actor, "import-connection", {
        bindingId: "jobs",
    }));
    assert.equal(imported.version, 1);
    assert.equal(imported.source, "connector");
    assert.match(imported.checksum, /^[a-f0-9]{64}$/);
    const second = (await tools.execute(1, actor, "import-connection", {
        bindingId: "jobs",
    }));
    assert.equal(second.version, 2);
    const data = (await tools.execute(1, actor, "data", {}));
    assert.deepEqual(data.files.map((f) => f.id), [second.id]);
    assert.equal(data.files[0].path, `/workspace/data/${second.id}`);
    assert.equal(data.files[0].checksum, imported.checksum);
    assert.equal(sent.at(-1).data.groupId, 1);
    assert.ok(reads.every((r) => r[0] === 1 && r[2] === 10));
    let drafted, started;
    service.draftRun = async (...args) => {
        drafted = args;
        const draft = { id: "trial", status: "draft" };
        await store.transact(1, (tx) => tx.put("run", draft.id, draft));
        return draft;
    };
    service.startRun = async (...args) => {
        started = args;
        await store.transact(1, async (tx) => {
            const run = (await tx.get("run", "trial"));
            run.status = "running";
            await tx.put("run", run.id, run);
        });
    };
    const startedTrial = await tools.execute(1, actor, "trial", {
        sampleCount: 7,
        targetNodeId: "licenses",
    });
    assert.equal(startedTrial.status, "running", "Codex must see the current run state, not the draft");
    assert.deepEqual(drafted, [
        1,
        actor,
        "trial",
        [second.id],
        7,
        "licenses",
        undefined,
    ]);
    assert.deepEqual(started, [1, actor, "trial"]);
    const reuse = {
        runId: "99999999-9999-4999-8999-999999999999",
        fromNodeId: "licenses",
    };
    await tools.execute(1, actor, "trial", {
        sampleCount: 7,
        targetNodeId: "licenses",
        reuse,
    });
    assert.deepEqual(drafted.at(-1), reuse);
    for (const [command, body] of [
        ["trial", { mode: "bulk" }],
        ["trial", { sampleCount: 21 }],
        ["trial", { budgetMicros: 100 }],
        ["approve-connection", {}],
        ["status", { credential: {} }],
    ])
        await assert.rejects(tools.execute(1, actor, command, body));
    await store.transact(1, async (tx) => {
        tx.state.operator = { userId: 11, generation: 2 };
    });
    for (const command of [
        "groups",
        "status",
        "trial",
        "validate",
        "connections",
        "import-connection",
    ])
        await assert.rejects(tools.execute(1, actor, command, {}), /operator/);
});
