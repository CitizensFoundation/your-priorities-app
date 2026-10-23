import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { randomUUID, createHash } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import express from "express";
import ExcelJS from "exceljs";
import { LiveWorkflowsController } from "../controller.js";
import { WorkflowService } from "../workflowService.js";
import { HostDirectory, SecretBox } from "../secrets.js";
import { ModelGateway } from "../modelGateway.js";
import { AssetService } from "../assets.js";
import { ForbiddenError } from "../services/errors.js";
import { WORKBOOK_SPEC_CONTENT_TYPE, XLSX_CONTENT_TYPE } from "../workbooks.js";
import { fixture, hostId, runId } from "./memoryStore.js";
import { fixtureModelsJson } from "./modelFixture.js";
test("VM workbook artifacts become private downloadable Excel files with checksums, quota accounting and retry deduplication", async (t) => {
    const { store } = await fixture();
    const directory = await mkdtemp(path.join(tmpdir(), "workflow-workbook-http-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const token = "x".repeat(32);
    const service = new WorkflowService(store, { isConnected: () => false }, new HostDirectory(JSON.stringify([
        { id: hostId, name: "fixture", rootPath: directory, token },
    ])), new SecretBox(Buffer.alloc(32, 7).toString("base64")), new ModelGateway(store, fixtureModelsJson), {});
    const controller = new LiveWorkflowsController({
        service,
        assets: new AssetService(store, directory),
        groupChoices: async () => [],
        groupAccess: async (groupId, userId) => {
            if (groupId !== 1 || userId !== 10)
                throw new ForbiddenError();
            return { userId, admin: true };
        },
    });
    t.after(() => controller.close());
    await controller.ready;
    const app = express();
    app.use(express.json({ limit: "12mb" }));
    app.use((req, _res, next) => {
        req.user = { id: Number(req.headers["x-test-user"] ?? 10) };
        next();
    });
    app.use(controller.path, controller.router);
    const server = app.listen(0, "127.0.0.1");
    await once(server, "listening");
    t.after(() => new Promise((resolve) => server.close(() => resolve())));
    const base = `http://127.0.0.1:${server.address().port}`;
    const body = {
        id: randomUUID(),
        nodeId: "analyze",
        name: "skills-first.xlsx",
        contentType: WORKBOOK_SPEC_CONTENT_TYPE,
        content: JSON.stringify({
            version: 1,
            sheets: [
                {
                    name: "Results",
                    rows: [
                        ["Title code", "Text"],
                        ["00042", "=SUM(1,2)"],
                    ],
                    widths: [20, 40],
                    headerRows: 1,
                },
            ],
        }),
    };
    const upload = (payload = body) => fetch(`${base}/api/live-workflows/vm/groups/1/runs/${runId}/artifact`, {
        method: "POST",
        headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
    });
    const response = await upload();
    assert.equal(response.status, 200);
    const asset = (await response.json());
    assert.equal(asset.contentType, XLSX_CONTENT_TYPE);
    const replay = await upload();
    assert.equal(replay.status, 200);
    assert.equal((await replay.json()).id, asset.id);
    const download = await fetch(`${base}/api/live-workflows/groups/1/assets/${asset.id}`);
    assert.equal(download.status, 200);
    const bytes = Buffer.from(await download.arrayBuffer());
    assert.equal(bytes.length, asset.bytes);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.checksum);
    assert.equal(await store.transact(1, async (tx) => tx.state.storedBytes), bytes.length);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(Uint8Array.from(bytes).buffer);
    assert.equal(workbook.getWorksheet("Results").getCell("A2").value, "00042");
    assert.equal(workbook.getWorksheet("Results").getCell("B2").type, ExcelJS.ValueType.String);
    const denied = await fetch(`${base}/api/live-workflows/groups/1/assets/${asset.id}`, { headers: { "x-test-user": "99" } });
    assert.equal(denied.status, 403);
    assert.equal((await upload({ ...body, id: randomUUID(), resultPart: 0 })).status, 400);
    assert.equal((await upload({ ...body, id: randomUUID(), name: "bad.json" })).status, 400);
    assert.equal((await upload({ ...body, id: randomUUID(), content: "{}" })).status, 400);
});
