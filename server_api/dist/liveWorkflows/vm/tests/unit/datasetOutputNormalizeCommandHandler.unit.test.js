import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { YP_LIVE_WORKFLOW_VM_PROTOCOL } from "../../../contracts/index.js";
import { DatasetOutputNormalizeCommandHandler, } from "../../commands/datasetOutputNormalizeCommandHandler.js";
import { DatasetManager } from "../../datasets/datasetManager.js";
const workspaceId = "22222222-2222-4222-8222-222222222222";
const vmHostId = "33333333-3333-4333-8333-333333333333";
test("DatasetOutputNormalizeCommandHandler makes hot dataset output host-readable", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-dataset-output-normalize-"));
    const hotRoot = path.join(tempDir, "hot");
    const allowedSourceRootPath = path.join(hotRoot, "outputs", "groups", "201", "experiments", "dataset");
    const sourcePath = path.join(allowedSourceRootPath, "reference");
    const nestedPath = path.join(sourcePath, "nested");
    await fs.mkdir(nestedPath, { recursive: true });
    await fs.writeFile(path.join(sourcePath, "data.csv"), "id,value\n1,2\n", "utf8");
    await fs.writeFile(path.join(nestedPath, "table.tsv"), "id\tvalue\n1\t2\n", "utf8");
    await fs.chmod(sourcePath, 0o700);
    await fs.chmod(path.join(sourcePath, "data.csv"), 0o600);
    const handler = new DatasetOutputNormalizeCommandHandler(new DatasetManager({ hotRoot }));
    const response = await handler.handle(envelope(sourcePath, allowedSourceRootPath), {
        now: () => new Date("2026-05-23T00:00:00.000Z"),
    });
    assert.equal(response.messageType, "dataset.output.normalized");
    assert.equal(response.data?.mode, "host");
    assert.equal(response.data?.fileCount, 2);
    assert.equal(response.data?.directoryCount, 2);
    assert.equal(((await fs.stat(sourcePath)).mode & 0o555), 0o555);
    assert.equal(((await fs.stat(path.join(sourcePath, "data.csv"))).mode & 0o444), 0o444);
});
test("DatasetOutputNormalizeCommandHandler rejects symlinked dataset output contents", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-dataset-output-normalize-symlink-"));
    const hotRoot = path.join(tempDir, "hot");
    const allowedSourceRootPath = path.join(hotRoot, "outputs");
    const sourcePath = path.join(allowedSourceRootPath, "reference");
    const outside = path.join(tempDir, "outside.csv");
    await fs.mkdir(sourcePath, { recursive: true });
    await fs.writeFile(outside, "id,value\n1,2\n", "utf8");
    await fs.symlink(outside, path.join(sourcePath, "outside.csv"));
    const handler = new DatasetOutputNormalizeCommandHandler(new DatasetManager({ hotRoot }));
    await assert.rejects(() => handler.handle(envelope(sourcePath, allowedSourceRootPath), { now: () => new Date() }), /contains a symlink/u);
});
test("DatasetOutputNormalizeCommandHandler falls back to container chmod on host permission errors", async () => {
    const calls = [];
    const sourcePath = "/hot/outputs/reference/raw";
    const allowedSourceRootPath = "/hot/outputs";
    const permissionError = new Error("EACCES: permission denied");
    permissionError.code = "EACCES";
    const datasets = {
        normalizeHotDatasetOutput: async () => {
            throw permissionError;
        },
        assertHotDatasetOutputReadable: async (input) => ({
            sourcePath: input.sourcePath,
            fileCount: 1,
            directoryCount: 2,
        }),
    };
    const containerNormalizer = {
        normalizeDatasetOutputInContainer: async (input) => {
            calls.push(input);
        },
    };
    const handler = new DatasetOutputNormalizeCommandHandler(datasets, containerNormalizer);
    const response = await handler.handle(envelope(sourcePath, allowedSourceRootPath, "session-1"), {
        now: () => new Date("2026-05-23T00:00:00.000Z"),
    });
    assert.deepEqual(calls, [{ sessionId: "session-1", containerPath: "/dataset-output/reference/raw" }]);
    assert.equal(response.data?.mode, "container_fallback");
    assert.equal(response.data?.fileCount, 1);
    assert.equal(response.data?.directoryCount, 2);
});
function envelope(sourcePath, allowedSourceRootPath, sessionId = null) {
    return {
        protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
        messageType: "dataset.output.normalize",
        commandId: "dataset-output-normalize-command-1",
        ts: "2026-05-23T00:00:00.000Z",
        data: {
            commandId: "dataset-output-normalize-command-1",
            workspaceId,
            vmHostId,
            sourcePath,
            allowedSourceRootPath,
            sessionId,
            metadata: { datasetSlug: "reference" },
        },
    };
}
