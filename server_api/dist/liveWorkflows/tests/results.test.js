import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { randomUUID } from "node:crypto";
import { ResultService } from "../results.js";
import { resultChunks } from "../runner/resultChunks.js";
import { AssetService } from "../assets.js";
import { fixture, workspace } from "./memoryStore.js";
test("result review paginates, searches, filters and compares immutable run records within the group", async () => {
    const { store, run } = await fixture();
    await store.create(workspace(2));
    const root = await mkdtemp(path.join(os.tmpdir(), "yp-results-"));
    try {
        const assets = new AssetService(store, root), results = new ResultService(store, assets);
        const compare = { ...run, id: randomUUID() };
        await store.transact(1, (tx) => tx.put("run", compare.id, compare));
        const rows = Array.from({ length: 105 }, (_, i) => ({
            id: `row-${i}`,
            name: `Technician ${i}`,
            status: i === 1 ? "unknown" : "complete",
            parentId: i < 2 ? "parent" : null,
            errors: i === 2 ? ["bad evidence"] : [],
            text: "Original <script>untrusted</script>",
        }));
        for (const [id, values] of [
            [run.id, rows],
            [compare.id, rows.map((row) => ({ ...row, text: "Compared" }))],
        ])
            for (const [part, content] of resultChunks(values).entries())
                await assets.upload(1, Readable.from(content), {
                    name: `result-${part}.json`,
                    length: Buffer.byteLength(content),
                    contentType: "application/json",
                    source: "artifact",
                    resultSet: {
                        runId: id,
                        nodeId: "analyze",
                        part,
                        count: JSON.parse(content).length,
                    },
                });
        const page = await results.page(1, run.id, {
            offset: 20,
            limit: 20,
            compare: compare.id,
        });
        assert.equal(page.total, 105);
        assert.equal(page.rows.length, 20);
        assert.equal(page.rows[0].value.id, "row-20");
        assert.equal(page.rows[0].comparison?.text, "Compared");
        assert.equal((await results.page(1, run.id, { filter: "children" })).total, 2);
        assert.equal((await results.page(1, run.id, { filter: "unknown" })).rows[0].value
            .id, "row-1");
        assert.equal((await results.page(1, run.id, { filter: "failed" })).rows[0].value
            .id, "row-2");
        assert.equal((await results.page(1, run.id, { search: "Technician 104" })).total, 1);
        await assert.rejects(results.page(2, run.id, {}));
        await assert.rejects(results.page(1, run.id, { compare: randomUUID() }));
        await assert.rejects(results.page(1, run.id, { limit: 51 }));
        assert.throws(() => resultChunks([{ text: "é".repeat(600000) }]), /1 MiB/);
    }
    finally {
        await rm(root, { recursive: true, force: true });
    }
});
