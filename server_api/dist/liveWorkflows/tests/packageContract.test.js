import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import { parseInput } from "../runner/inputs.js";
import { modelJson } from "../runner/modelJson.js";
import { packageManifest, packageValidators, validateData, } from "../runner/packageContract.js";
import { readPackage, selectedAgents, skillsFirstPackage, } from "../packages.js";
import { runPackage } from "../runner/run.js";
import { run as runFixture } from "./memoryStore.js";
test("a non-job package parses numeric data, executes and enforces input and output contracts", async () => {
    const root = fileURLToPath(new URL("./fixtures/numeric-package", import.meta.url));
    const snapshot = await readPackage(root);
    const dir = await mkdtemp(path.join(os.tmpdir(), "yp-package-contract-"));
    try {
        const file = path.join(dir, "numbers.json");
        await writeFile(file, JSON.stringify([{ value: 4 }, { value: 7 }]));
        const inputs = await parseInput(file, "numbers.json", "fixture");
        assert.equal(inputs[0].text, undefined);
        const run = {
            ...runFixture(),
            sourceHash: snapshot.hash,
            graph: snapshot.graph,
            nodeIds: ["sum"],
            inputCount: 2,
        };
        const artifacts = [];
        const requests = [];
        const progress = [];
        const request = async (route, data) => {
            requests.push(route);
            if (route === "/artifact")
                artifacts.push(data);
            if (route === "/progress")
                progress.push(data);
            assert.ok(["/status", "/progress", "/artifact"].includes(route));
            return { status: "running" };
        };
        const options = {
            root,
            output: path.join(dir, "output"),
            socket: "unused",
            run,
            inputs,
            request,
        };
        await runPackage(options);
        assert.ok(progress.some((item) => item.message ===
            "Adding the imported numbers"));
        assert.equal(artifacts.length, 2);
        assert.equal(artifacts[1].resultPart, 0);
        assert.deepEqual(JSON.parse(artifacts[0].content), { count: 2, total: 11 });
        assert.ok(JSON.parse(await readFile(path.join(dir, "output/completed.json"), "utf8")).nodeIds.includes("sum"));
        requests.length = 0;
        await assert.rejects(runPackage({ ...options, inputs: [{ value: "bad" }] }), /Input.*schema/);
        assert.equal(requests.length, 0, "invalid data must be rejected before capabilities or paid calls");
        const validators = packageValidators(snapshot.files);
        assert.throws(() => validateData(validators.output, { count: 2, total: "bad" }, "Output"), /Output.*schema/);
        await assert.rejects(runPackage({ ...options, run: { ...run, sourceHash: "changed" } }), /approved run/);
    }
    finally {
        await rm(dir, { recursive: true, force: true });
    }
});
test("package contracts reject unsupported SDKs, missing schemas and invalid model roles", async () => {
    const snapshot = await skillsFirstPackage();
    const manifest = JSON.parse(snapshot.files["manifest.json"]);
    for (const change of [
        { sdkVersion: 99 },
        { inputSchema: "schemas/missing.json" },
        { modelRoles: ["review"] },
        { modelRoles: ["default", "default"] },
        { assistantName: " " },
        { assistantName: "x".repeat(81) },
    ])
        assert.throws(() => packageManifest({
            ...snapshot.files,
            "manifest.json": JSON.stringify({ ...manifest, ...change }),
        }));
});
test("targeted experiments include upstream agents and exclude unrelated branches", async () => {
    const snapshot = await skillsFirstPackage();
    assert.deepEqual(selectedAgents(snapshot.graph, "analyze"), [
        "normalize",
        "levels",
        "analyze",
    ]);
    assert.throws(() => selectedAgents(snapshot.graph, "licenses"), /enabled/);
    assert.throws(() => selectedAgents(snapshot.graph, "unknown"), /enabled/);
});
test("local JSON repair preserves model data and tags unrecoverable responses", () => {
    assert.deepEqual(modelJson("```json\n{status: 'unknown', values: [1,2,],}\n```"), { status: "unknown", values: [1, 2] });
    assert.throws(() => modelJson('{"a": } {{'), (error) => error.code === "record_invalid");
});
