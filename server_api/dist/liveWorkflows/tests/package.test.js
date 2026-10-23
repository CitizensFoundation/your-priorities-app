import test from "node:test";
import assert from "node:assert/strict";
import { skillsFirstPackage, validatePackage, withDefaultAgentModel, } from "../packages.js";
import { graphSchema, fingerprint } from "../schemas.js";
import { orderedAgents } from "../runner/run.js";
import { stratifiedSample } from "../runner/inputs.js";
import { workspace } from "./memoryStore.js";
import { reconnectEnabledTemplateAgents } from "../graph.js";
test("enabling detached optional research restores its template path without reordering upstream adapters", async () => {
    const { graph: template } = await skillsFirstPackage();
    const previous = structuredClone(template);
    previous.nodes.unshift({
        ...previous.nodes[0],
        id: "adapter",
        entrypoint: "source/custom.ts",
    });
    const research = new Set(["licenses", "education"]);
    previous.edges = previous.edges.filter((e) => !(previous.nodes.find((n) => n.id === e.source)?.kind === "agent" &&
        (research.has(e.source) || research.has(e.target))));
    previous.edges.push({ id: "bypass", source: "analyze", target: "rewrite" }, { id: "custom", source: "adapter", target: "normalize" });
    const next = structuredClone(previous);
    next.nodes.find((n) => n.id === "licenses").enabled = true;
    const repaired = reconnectEnabledTemplateAgents(next, previous, template);
    assert.deepEqual(orderedAgents(repaired).map((n) => n.id), [
        "adapter",
        "normalize",
        "levels",
        "analyze",
        "licenses",
        "rewrite",
        "export",
    ]);
    assert.ok(repaired.edges.some((e) => e.source === "licenses" && e.target === "education"));
    assert.ok(!repaired.edges.some((e) => e.id === "bypass"));
    const enabled = structuredClone(repaired);
    enabled.nodes.find((n) => n.id === "education").enabled = true;
    assert.deepEqual(reconnectEnabledTemplateAgents(enabled, repaired, template), enabled);
    const custom = structuredClone(next);
    custom.edges.find((e) => e.id === "bypass").target = "export";
    assert.throws(() => reconnectEnabledTemplateAgents(custom, previous, template), /custom graph/);
});
test("Skills First seed includes the complete suite, provenance prompts and deterministic graph", async () => {
    const seed = await skillsFirstPackage();
    assert.equal(seed.hash, validatePackage(seed.files).hash);
    for (const id of [
        "normalize",
        "analyze",
        "licenses",
        "education",
        "rewrite",
        "compare",
        "compare-license",
        "export",
    ])
        assert.ok(seed.graph.nodes.some((n) => n.id === id));
    assert.ok(seed.files["source/prompts.ts"].includes("educationRequirementAnalyzer"));
    assert.ok(seed.files["AGENTS.md"].includes("cannot approve bulk"));
    assert.deepEqual(orderedAgents(seed.graph).map((n) => n.id), ["normalize", "levels", "analyze", "rewrite", "export"]);
});
test("graph rejects cycles, dangling edges, duplicate IDs and missing agent source", async () => {
    const graph = workspace().graph;
    assert.throws(() => graphSchema.parse({
        ...graph,
        edges: [{ id: "loop", source: "analyze", target: "analyze" }],
    }), /acyclic/);
    assert.throws(() => graphSchema.parse({
        ...graph,
        edges: [{ id: "bad", source: "absent", target: "analyze" }],
    }), /unknown/);
    assert.throws(() => graphSchema.parse({ ...graph, nodes: [...graph.nodes, ...graph.nodes] }), /Duplicate/);
    const seed = await skillsFirstPackage();
    delete seed.files["source/analysis.ts"];
    assert.throws(() => validatePackage(seed.files), /Missing agent source/);
});
test("initial agent defaults preserve explicit roles and keep the materialized graph and source hash consistent", async () => {
    const original = await skillsFirstPackage();
    original.graph.nodes.find((node) => node.id === "analyze").models = {
        default: "gpt-6-sol",
        review: "gpt-6-astra",
    };
    original.graph.nodes.find((node) => node.id === "rewrite").models.review =
        "gpt-6-sol";
    const initial = withDefaultAgentModel(original, "gpt-6-luna");
    assert.deepEqual(initial.graph.nodes.find((node) => node.id === "analyze").models, {
        default: "gpt-6-sol",
        review: "gpt-6-astra",
    });
    assert.deepEqual(initial.graph.nodes.find((node) => node.id === "rewrite").models, {
        default: "gpt-6-luna",
        review: "gpt-6-sol",
    });
    assert.equal(original.graph.nodes.find((node) => node.id === "rewrite").models.default, undefined);
    assert.ok(initial.graph.nodes
        .filter((node) => node.kind === "connector")
        .every((node) => !node.models.default));
    assert.deepEqual(validatePackage(initial.files), initial);
    assert.notEqual(initial.hash, original.hash);
});
test("sample includes the smallest and largest records; source changes invalidate fingerprints", async () => {
    const sample = stratifiedSample(Array.from({ length: 100 }, (_, i) => ({ text: "x".repeat(i + 1) })), 5);
    assert.equal(sample.length, 5);
    assert.equal(sample[0].text.length, 1);
    assert.equal(sample[4].text.length, 100);
    const seed = await skillsFirstPackage(), before = seed.hash;
    seed.files["source/analysis.ts"] += "\n// updated prompt\n";
    assert.notEqual(validatePackage(seed.files).hash, before);
    assert.equal(fingerprint({ a: 1, b: 2 }), fingerprint({ b: 2, a: 1 }));
});
