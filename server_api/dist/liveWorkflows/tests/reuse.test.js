import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID, createHash } from "node:crypto";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { stageFingerprints, planReuse } from "../reuse.js";
import { skillsFirstPackage, validatePackage } from "../packages.js";
import { stageChunks, decodeStage } from "../runner/stageOutput.js";
import { runPackage } from "../runner/run.js";
import { fixture, runId } from "./memoryStore.js";
test("reuse fingerprints track upstream code, helpers, graph, data, models and runtime but allow research edits", async () => {
    const seed = await skillsFirstPackage();
    for (const node of seed.graph.nodes)
        if (node.kind === "agent") {
            node.enabled = true;
            node.models.default = "luna";
        }
    seed.files["graph.json"] = JSON.stringify(seed.graph);
    const options = {
        assets: [{ id: "input", checksum: "original" }],
        models: [{ id: "luna", priceVersion: "1" }],
        connectors: [],
        concurrency: 2,
    };
    const original = stageFingerprints(seed, options);
    const changed = structuredClone(seed);
    changed.files["source/research.ts"] += "\n// new research prompt";
    changed.graph.nodes.find((n) => n.id === "licenses").configuration.maxSources = 6;
    changed.files["graph.json"] = JSON.stringify(changed.graph);
    const next = stageFingerprints(changed, options);
    for (const id of ["normalize", "levels", "analyze"])
        assert.equal(next[id], original[id], id);
    for (const id of ["licenses", "education", "rewrite", "export"])
        assert.notEqual(next[id], original[id], id);
    for (const edit of [
        "helper",
        "price",
        "input",
        "runtime",
        "edge",
        "effort",
    ]) {
        const revision = structuredClone(seed), settings = structuredClone(options);
        if (edit === "helper")
            revision.files["source/memory.ts"] += "\n// contract change";
        if (edit === "price")
            settings.models[0].priceVersion = "2";
        if (edit === "input")
            settings.assets[0].checksum = "new";
        if (edit === "runtime")
            revision.runtimeImage = "new";
        if (edit === "edge")
            revision.graph.edges = revision.graph.edges.filter((e) => e.target !== "analyze");
        if (edit === "effort")
            revision.graph.nodes.find((n) => n.id === "analyze").reasoningEffort =
                "high";
        assert.notEqual(stageFingerprints(revision, settings).analyze, original.analyze, edit);
    }
});
test("stage chunks preserve Unicode and reject corrupted, missing and reordered bytes", () => {
    const value = { text: "😀".repeat(300000), records: [1, 2, 3] };
    const { chunks, checksum } = stageChunks(value);
    const output = {
        checksum,
        assets: chunks.map((chunk) => ({
            bytes: Buffer.byteLength(chunk),
            checksum: createHash("sha256").update(chunk).digest("hex"),
        })),
    };
    assert.deepEqual(decodeStage(chunks, output), value);
    assert.throws(() => decodeStage(chunks.slice(1), output), /Missing/);
    assert.throws(() => decodeStage([...chunks].reverse(), output), /checksum/);
    assert.throws(() => decodeStage([chunks[0] + "x", ...chunks.slice(1)], output), /checksum/);
});
test("reuse rejects changed dependencies, missing outputs, failures, sample changes, bulk and other groups", async () => {
    const { store } = await fixture();
    const original = (await store.transact(1, (tx) => tx.get("run", runId)));
    original.mode = "trial";
    original.status = "completed";
    original.inputCount = 1;
    original.sample = {
        recordIds: ["one"],
        populationCount: 100,
        populationLengthRange: [1, 100],
        sampleLengthRange: [1, 1],
    };
    const asset = {
        id: randomUUID(),
        checksum: "hash",
        stagePart: { runId, nodeId: "analyze", part: 0, parts: 1 },
    };
    original.nodeFingerprints = { analyze: "same" };
    original.nodeStates = {
        analyze: { status: "completed", processed: 1, total: 1 },
    };
    original.stageOutputs = {
        analyze: {
            assets: [asset],
            checksum: "content",
            fingerprint: "same",
            originRunId: runId,
            sourceHash: original.sourceHash,
        },
    };
    await store.transact(1, async (tx) => {
        await tx.put("run", runId, original);
        await tx.put("asset", asset.id, asset);
    });
    const run = structuredClone(original);
    run.id = randomUUID();
    run.graph.nodes.push({ ...run.graph.nodes[0], id: "research" });
    run.graph.edges.push({ id: "next", source: "analyze", target: "research" });
    run.nodeIds.push("research");
    delete run.stageOutputs;
    const request = { runId, fromNodeId: "research" };
    await store.transact(1, (tx) => planReuse(tx, run, request));
    assert.deepEqual(run.reuse?.nodeIds, ["analyze"]);
    const disconnected = structuredClone(run);
    disconnected.graph.edges = [];
    await assert.rejects(store.transact(1, (tx) => planReuse(tx, disconnected, request)), /Reconnect the restart agent/);
    for (const change of [
        "fingerprint",
        "sample",
        "bulk",
        "missing-run",
    ]) {
        const changed = structuredClone(run);
        if (change === "fingerprint")
            changed.nodeFingerprints.analyze = "changed";
        if (change === "sample")
            changed.inputCount = 2;
        if (change === "bulk")
            changed.mode = "bulk";
        await assert.rejects(store.transact(1, (tx) => planReuse(tx, changed, {
            ...request,
            ...(change === "missing-run" ? { runId: randomUUID() } : {}),
        })));
    }
    original.nodeStates.analyze.failedRecords = 1;
    await store.transact(1, (tx) => tx.put("run", runId, original));
    await assert.rejects(store.transact(1, (tx) => planReuse(tx, run, request)), /Cannot reuse/);
    original.nodeStates.analyze.failedRecords = 0;
    await store.transact(1, async (tx) => {
        await tx.put("run", runId, original);
        await tx.remove("asset", asset.id);
    });
    await assert.rejects(store.transact(1, (tx) => planReuse(tx, run, request)), /unavailable/);
});
test("runner persists stage artifacts and reruns only downstream code on the same sampled IDs", async () => {
    const root = await mkdtemp("/tmp/workflow-reuse-runner-");
    const { store } = await fixture();
    const base = (await store.transact(1, (tx) => tx.get("run", runId)));
    const graph = {
        nodes: ["analyze", "research"].map((id) => ({
            id,
            label: id,
            enabled: true,
            kind: "agent",
            entrypoint: `source/${id}.ts`,
            models: {},
            configuration: {},
            position: { x: 0, y: 0 },
        })),
        edges: [{ id: "next", source: "analyze", target: "research" }],
    };
    const files = {
        "manifest.json": JSON.stringify({
            id: "reuse",
            name: "Reuse fixture",
            version: "1",
            runtime: "yp-live-workflow-v1",
            instructions: "AGENTS.md",
            graph: "graph.json",
        }),
        "graph.json": JSON.stringify(graph),
        "AGENTS.md": "fixture",
        "source/analyze.ts": "export async function run(c, input) { await c.model('cost', 'fixture', {}); return input.map(row => ({...row, analyzed:true})); }",
        "source/research.ts": "export async function run(c, input) { return input.map(row => ({...row, researched:true})); }",
    };
    const snapshot = validatePackage(files);
    const run = {
        ...base,
        id: randomUUID(),
        mode: "trial",
        inputCount: 1,
        graph,
        sourceHash: snapshot.hash,
        nodeIds: ["analyze", "research"],
        nodeFingerprints: { analyze: "stable", research: "stable" },
    };
    const saved = new Map();
    const stages = {};
    let calls = 0;
    const request = async (route, value) => {
        var _a;
        const data = value;
        if (route === "/status")
            return { status: "running" };
        if (route === "/model") {
            calls++;
            return { content: "{}" };
        }
        if (route === "/artifact") {
            const asset = {
                id: randomUUID(),
                checksum: createHash("sha256").update(data.content).digest("hex"),
                bytes: Buffer.byteLength(data.content),
            };
            saved.set(asset.id, data.content);
            if (data.stagePart) {
                stages[_a = data.nodeId] ?? (stages[_a] = {
                    assets: [],
                    checksum: "",
                    fingerprint: "stable",
                    originRunId: run.id,
                    sourceHash: run.sourceHash,
                });
                stages[data.nodeId].assets.push(asset);
            }
            return asset;
        }
        if (data.stageOutput)
            stages[data.nodeId].checksum = data.stageOutput.checksum;
        return {};
    };
    try {
        await mkdir(path.join(root, "source"));
        for (const [name, contents] of Object.entries(files))
            await writeFile(path.join(root, name), contents);
        const inputs = [
            { id: "short", value: 1 },
            { id: "long", value: "longer" },
        ];
        await runPackage({
            root,
            output: path.join(root, "first"),
            socket: "",
            run,
            inputs,
            request,
        });
        assert.equal(calls, 1);
        const analyzed = decodeStage(stages.analyze.assets.map((a) => saved.get(a.id)), stages.analyze);
        const reusedRun = {
            ...run,
            id: randomUUID(),
            reuse: {
                runId: run.id,
                fromNodeId: "research",
                nodeIds: ["analyze"],
                historicalMicros: 5,
            },
            sample: {
                recordIds: [analyzed[0].id],
                populationCount: 2,
                populationLengthRange: [1, 2],
                sampleLengthRange: [1, 1],
            },
        };
        await runPackage({
            root,
            output: path.join(root, "second"),
            socket: "",
            run: reusedRun,
            inputs,
            request,
            reusedOutputs: { analyze: analyzed },
        });
        assert.equal(calls, 1, "The upstream paid model must not run again");
        const result = decodeStage(stages.research.assets.slice(-1).map((a) => saved.get(a.id)), { ...stages.research, assets: stages.research.assets.slice(-1) });
        assert.equal(result[0].researched, true);
        await assert.rejects(runPackage({
            root,
            output: path.join(root, "third"),
            socket: "",
            run: reusedRun,
            inputs,
            request,
        }), /Missing verified/);
    }
    finally {
        await rm(root, { recursive: true, force: true });
    }
});
