import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { validatePackage } from "../../packages.js";
import { decodeStage } from "../../runner/stageOutput.js";
import { stageFingerprints } from "../../reuse.js";
import { redactManualText } from "./environment.js";
/** Retain all paid-run stage bytes and source before the disposable VM/DB closes.
 * Credentials, accounts, sessions and sealed connector records are never exported. */
export async function archiveIdahoRun(harness, run, directory) {
    const snapshot = await harness.request("");
    const source = await harness.service.revision(1, run.sourceHash);
    const ids = new Set([
        ...run.assetIds,
        ...Object.values(run.stageOutputs ?? {}).flatMap((s) => s.assets.map((a) => a.id)),
    ]);
    const assets = snapshot.assets.filter((a) => ids.has(a.id));
    assert.equal(assets.length, ids.size);
    await mkdir(path.join(directory, "assets"), { recursive: true, mode: 0o700 });
    for (const asset of assets) {
        const bytes = await readFile(harness.assets.path(1, asset.id));
        verifyBytes(asset, bytes);
        await writeFile(path.join(directory, "assets", asset.id), bytes, {
            mode: 0o600,
        });
    }
    const archive = {
        version: 1,
        run,
        assets,
        source: {
            ...validatePackage(source.files),
            runtimeImage: run.runtimeImage,
        },
        usage: (await harness.request("/usage")).filter((u) => u.runId === run.id),
        codexUsage: harness.codexUsage.report(),
    };
    await writeFile(path.join(directory, "archive.json"), redactManualText(JSON.stringify(archive, null, 2)), { mode: 0o600 });
}
function verifyBytes(asset, bytes) {
    assert.equal(bytes.length, asset.bytes);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.checksum);
}
/** Trusted, local fixture restoration only, into a newly created disposable group.
 * Historical run IDs/costs stay intact and count against the new session's cap. */
export async function restoreIdahoBaseline(harness, directory) {
    const archive = JSON.parse(await readFile(path.join(directory, "archive.json"), "utf8"));
    assert.equal(archive.version, 1);
    const { run } = archive;
    assert.equal(run.mode, "trial");
    assert.equal(run.status, "completed");
    assert.equal(run.reservedMicros, 0);
    assert.ok(!run.reuse && run.sample && run.inputCount === 5);
    assert.ok(archive.usage.every((u) => u.status === "settled" && u.runId === run.id));
    assert.equal(archive.usage.reduce((n, u) => n + u.actualMicros, 0), run.spentMicros);
    const before = await harness.request("");
    assert.equal(before.runs.length, 0);
    assert.equal(before.assets.length, 0);
    assert.ok(run.spentMicros < before.workspace.config.budgetMicros);
    assert.equal(run.concurrency, before.workspace.config.concurrency);
    const current = await harness.service.packageSnapshot(1);
    assert.equal(current.runtimeImage, run.runtimeImage, "Reuse requires the same processing runtime image");
    const source = {
        ...validatePackage(archive.source.files),
        runtimeImage: current.runtimeImage,
    };
    assert.equal(source.hash, archive.source.hash);
    if (!archive.recovery)
        assert.equal(source.hash, run.sourceHash);
    const connectors = await harness.connectors.snapshotBindings(1, 10, source.graph);
    const fingerprints = stageFingerprints(source, {
        assets: run.assetIds.map((id) => archive.assets.find((a) => a.id === id)),
        models: before.models,
        connectors: connectors.map((c) => ({
            binding: c.binding,
            readSnapshot: c.readSnapshot,
        })),
        concurrency: before.workspace.config.concurrency,
    });
    const files = new Map();
    for (const asset of archive.assets) {
        assert.match(asset.id, /^[0-9a-f-]{36}$/);
        const bytes = await readFile(path.join(directory, "assets", asset.id));
        verifyBytes(asset, bytes);
        files.set(asset.id, bytes);
    }
    for (const id of ["adapt-import", "normalize", "levels", "analyze"]) {
        const stage = run.stageOutputs[id];
        assert.equal(fingerprints[id], run.nodeFingerprints[id], `Historical dependencies changed for ${id}`);
        assert.equal(stage.fingerprint, fingerprints[id]);
        decodeStage(stage.assets.map((a) => files.get(a.id).toString("utf8")), stage);
    }
    for (const asset of archive.assets) {
        const destination = harness.assets.path(1, asset.id);
        await mkdir(path.dirname(destination), { recursive: true, mode: 0o700 });
        await writeFile(destination, files.get(asset.id), { mode: 0o600 });
    }
    await harness.store.transact(1, async (tx) => {
        tx.state.spentMicros = run.spentMicros;
        tx.state.trialSpentMicros = run.spentMicros;
        tx.state.storedBytes = archive.assets.reduce((n, a) => n + a.bytes, 0);
        assert.ok(tx.state.storedBytes <= tx.state.config.quotaBytes);
        for (const asset of archive.assets)
            await tx.put("asset", asset.id, asset);
        for (const receipt of archive.usage)
            await tx.put("usage", receipt.id, receipt);
        await tx.put("run", run.id, run);
        await tx.put("source", source.hash, source);
        await tx.emit("manual.baseline_restored", {
            runId: run.id,
            spentMicros: run.spentMicros,
            sourceHash: source.hash,
        });
    });
    await harness.service.restoreRevision(1, { userId: 10, admin: true }, source.hash, before.workspace.revision);
    harness.historicalCodexUsage = archive.codexUsage;
    return {
        trialRunId: run.id,
        restoredFrom: directory,
        historicalProcessingMicros: run.spentMicros,
        historicalCodexUsage: archive.codexUsage,
        recovery: archive.recovery ?? null,
    };
}
