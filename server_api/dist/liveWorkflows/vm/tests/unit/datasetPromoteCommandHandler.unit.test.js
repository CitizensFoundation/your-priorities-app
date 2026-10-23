import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { YP_LIVE_WORKFLOW_VM_PROTOCOL } from "../../../contracts/index.js";
import { DatasetPromoteCommandHandler } from "../../commands/datasetPromoteCommandHandler.js";
import { DatasetManager } from "../../datasets/datasetManager.js";
const workspaceId = "22222222-2222-4222-8222-222222222222";
const vmHostId = "33333333-3333-4333-8333-333333333333";
const datasetVersionId = "12121212-1212-4121-8121-121212121212";
test("DatasetPromoteCommandHandler promotes a workspace dataset into the hot store", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-dataset-promote-"));
    const workspaceRoot = path.join(tempDir, "workspaces");
    const experimentRoot = path.join(workspaceRoot, "groups", "201", "experiments", "dataset");
    const sourcePath = path.join(experimentRoot, "workspace", "datasets", "reference");
    const hotRoot = path.join(tempDir, "hot");
    await fs.mkdir(sourcePath, { recursive: true });
    await fs.writeFile(path.join(sourcePath, "data.csv"), "id,value\n1,2\n", "utf8");
    await fs.mkdir(path.join(sourcePath, "nested"), { recursive: true });
    await fs.writeFile(path.join(sourcePath, "nested", "table.tsv"), "id\tvalue\n1\t2\n", "utf8");
    await fs.writeFile(path.join(sourcePath, ".yp-live-workflow-ignore.json"), "{}", "utf8");
    const handler = new DatasetPromoteCommandHandler(new DatasetManager({ hotRoot }), workspaceRoot);
    const response = await handler.handle(envelope(sourcePath, experimentRoot), {
        now: () => new Date("2026-05-23T00:00:00.000Z"),
    });
    assert.equal(response.messageType, "dataset.promoted");
    assert.equal(response.data?.datasetVersionId, datasetVersionId);
    assert.equal(response.data?.hotPath, path.join(hotRoot, datasetVersionId));
    assert.equal(await fs.readFile(path.join(hotRoot, datasetVersionId, "data.csv"), "utf8"), "id,value\n1,2\n");
    assert.deepEqual(response.data?.mountedFiles, ["data.csv", "nested/table.tsv"]);
    assert.equal(response.data?.mountedFileCount, 2);
    assert.equal(response.data?.mountedFilesTruncated, false);
});
test("DatasetPromoteCommandHandler caps promoted mounted-file inventory", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-dataset-promote-cap-"));
    const workspaceRoot = path.join(tempDir, "workspaces");
    const experimentRoot = path.join(workspaceRoot, "groups", "201", "experiments", "dataset");
    const sourcePath = path.join(experimentRoot, "workspace", "datasets", "large");
    const hotRoot = path.join(tempDir, "hot");
    await fs.mkdir(sourcePath, { recursive: true });
    for (let index = 0; index < 505; index += 1) {
        await fs.writeFile(path.join(sourcePath, `file-${String(index).padStart(3, "0")}.txt`), "x", "utf8");
    }
    const handler = new DatasetPromoteCommandHandler(new DatasetManager({ hotRoot }), workspaceRoot);
    const response = await handler.handle(envelope(sourcePath, experimentRoot), {
        now: () => new Date("2026-05-23T00:00:00.000Z"),
    });
    const mountedFiles = response.data?.mountedFiles;
    assert.equal(mountedFiles?.length, 500);
    assert.equal(mountedFiles?.[0], "file-000.txt");
    assert.equal(mountedFiles?.[499], "file-499.txt");
    assert.equal(response.data?.mountedFileCount, 505);
    assert.equal(response.data?.mountedFilesTruncated, true);
});
test("DatasetPromoteCommandHandler rejects source paths outside the owning workspace", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-dataset-promote-forbidden-"));
    const workspaceRoot = path.join(tempDir, "workspaces");
    const experimentRoot = path.join(workspaceRoot, "groups", "201", "experiments", "dataset");
    const sourcePath = path.join(tempDir, "outside");
    await fs.mkdir(experimentRoot, { recursive: true });
    await fs.mkdir(sourcePath, { recursive: true });
    const handler = new DatasetPromoteCommandHandler(new DatasetManager({ hotRoot: path.join(tempDir, "hot") }), workspaceRoot);
    await assert.rejects(() => handler.handle(envelope(sourcePath, experimentRoot), { now: () => new Date() }), /must stay inside the owning workspace root/u);
});
test("DatasetPromoteCommandHandler rejects source paths under symlinked workspace parents", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-dataset-promote-parent-symlink-"));
    const workspaceRoot = path.join(tempDir, "workspaces");
    const experimentRoot = path.join(workspaceRoot, "groups", "201", "experiments", "dataset");
    const datasetRoot = path.join(experimentRoot, "workspace", "datasets");
    const outsideRoot = path.join(tempDir, "outside");
    const sourcePath = path.join(datasetRoot, "link", "reference");
    await fs.mkdir(datasetRoot, { recursive: true });
    await fs.mkdir(path.join(outsideRoot, "reference"), { recursive: true });
    await fs.writeFile(path.join(outsideRoot, "reference", "data.csv"), "id,value\n1,2\n", "utf8");
    await fs.symlink(outsideRoot, path.join(datasetRoot, "link"));
    const handler = new DatasetPromoteCommandHandler(new DatasetManager({ hotRoot: path.join(tempDir, "hot") }), workspaceRoot);
    await assert.rejects(() => handler.handle(envelope(sourcePath, experimentRoot), { now: () => new Date() }), /must stay inside the owning workspace root|must not use symlinked directories/u);
});
test("DatasetPromoteCommandHandler rejects symlinked dataset contents", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-dataset-promote-symlink-"));
    const workspaceRoot = path.join(tempDir, "workspaces");
    const experimentRoot = path.join(workspaceRoot, "groups", "201", "experiments", "dataset");
    const sourcePath = path.join(experimentRoot, "workspace", "datasets", "reference");
    const outside = path.join(tempDir, "outside.csv");
    await fs.mkdir(sourcePath, { recursive: true });
    await fs.writeFile(outside, "id,value\n1,2\n", "utf8");
    await fs.symlink(outside, path.join(sourcePath, "outside.csv"));
    const handler = new DatasetPromoteCommandHandler(new DatasetManager({ hotRoot: path.join(tempDir, "hot") }), workspaceRoot);
    await assert.rejects(() => handler.handle(envelope(sourcePath, experimentRoot), { now: () => new Date() }), /contains a symlink/u);
});
function envelope(sourcePath, allowedSourceRootPath) {
    return {
        protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
        messageType: "dataset.promote",
        commandId: "dataset-promote-command-1",
        ts: "2026-05-23T00:00:00.000Z",
        data: {
            commandId: "dataset-promote-command-1",
            workspaceId,
            vmHostId,
            datasetVersionId,
            sourcePath,
            allowedSourceRootPath,
        },
    };
}
