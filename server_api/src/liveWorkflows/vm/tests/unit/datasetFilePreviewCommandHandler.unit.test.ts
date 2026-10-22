import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import { YP_LIVE_WORKFLOW_VM_PROTOCOL } from "../../../contracts/index.js";
import { DatasetFilePreviewCommandHandler } from "../../commands/datasetFilePreviewCommandHandler.js";
import { DatasetManager } from "../../datasets/datasetManager.js";

const vmHostId = "33333333-3333-4333-8333-333333333333";
const datasetVersionId = "12121212-1212-4121-8121-121212121212";
const datasetLocationId = "44444444-4444-4444-8444-444444444444";

test("DatasetFilePreviewCommandHandler previews a safe hot dataset file", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-dataset-preview-"));
  const hotRoot = path.join(tempDir, "hot");
  const datasetRoot = path.join(hotRoot, datasetVersionId);
  const content = "id,value\n1,2\n";
  await fs.mkdir(datasetRoot, { recursive: true });
  await fs.writeFile(path.join(datasetRoot, "data.csv"), content, "utf8");
  const handler = new DatasetFilePreviewCommandHandler(new DatasetManager({ hotRoot }));

  const response = await handler.handle(envelope(pathToFileURL(datasetRoot).href, "data.csv"), {
    now: () => new Date("2026-05-23T00:00:00.000Z"),
  }) as { messageType?: unknown; data?: Record<string, unknown> };

  assert.equal(response.messageType, "dataset.file.preview.ready");
  assert.equal(response.data?.content, content);
  assert.equal(response.data?.contentChecksumSha256, createHash("sha256").update(content).digest("hex"));
  assert.equal(response.data?.truncated, false);
});

test("DatasetFilePreviewCommandHandler normalizes accepted relative path separators", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-dataset-preview-normalize-"));
  const hotRoot = path.join(tempDir, "hot");
  const datasetRoot = path.join(hotRoot, datasetVersionId);
  await fs.mkdir(path.join(datasetRoot, "nested"), { recursive: true });
  await fs.writeFile(path.join(datasetRoot, "nested", "data.csv"), "normalized", "utf8");
  const handler = new DatasetFilePreviewCommandHandler(new DatasetManager({ hotRoot }));

  const response = await handler.handle(envelope(datasetRoot, "nested\\\\//data.csv"), {
    now: () => new Date("2026-05-23T00:00:00.000Z"),
  }) as { data?: Record<string, unknown> };

  assert.equal(response.data?.content, "normalized");
});

test("DatasetFilePreviewCommandHandler rejects locations outside trusted dataset roots", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-dataset-preview-untrusted-"));
  const outsideRoot = path.join(tempDir, "outside");
  await fs.mkdir(outsideRoot, { recursive: true });
  await fs.writeFile(path.join(outsideRoot, "data.csv"), "id,value\n1,2\n", "utf8");
  const handler = new DatasetFilePreviewCommandHandler(new DatasetManager({ hotRoot: path.join(tempDir, "hot") }));

  await assert.rejects(
    () => handler.handle(envelope(outsideRoot, "data.csv"), { now: () => new Date() }),
    /outside the VM trusted dataset roots/u
  );
});

test("DatasetFilePreviewCommandHandler rejects symlinked parent paths", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-dataset-preview-parent-symlink-"));
  const hotRoot = path.join(tempDir, "hot");
  const datasetRoot = path.join(hotRoot, datasetVersionId);
  const outsideRoot = path.join(tempDir, "outside");
  await fs.mkdir(datasetRoot, { recursive: true });
  await fs.mkdir(outsideRoot, { recursive: true });
  await fs.writeFile(path.join(outsideRoot, "data.csv"), "id,value\n1,2\n", "utf8");
  await fs.symlink(outsideRoot, path.join(datasetRoot, "link"));
  const handler = new DatasetFilePreviewCommandHandler(new DatasetManager({ hotRoot }));

  await assert.rejects(
    () => handler.handle(envelope(datasetRoot, "link/data.csv"), { now: () => new Date() }),
    /must not use symlinked directories|escapes the dataset root/u
  );
});

test("DatasetFilePreviewCommandHandler rejects symlinked files", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-dataset-preview-file-symlink-"));
  const hotRoot = path.join(tempDir, "hot");
  const datasetRoot = path.join(hotRoot, datasetVersionId);
  const outsideFile = path.join(tempDir, "outside.csv");
  await fs.mkdir(datasetRoot, { recursive: true });
  await fs.writeFile(outsideFile, "id,value\n1,2\n", "utf8");
  await fs.symlink(outsideFile, path.join(datasetRoot, "data.csv"));
  const handler = new DatasetFilePreviewCommandHandler(new DatasetManager({ hotRoot }));

  await assert.rejects(
    () => handler.handle(envelope(datasetRoot, "data.csv"), { now: () => new Date() }),
    /refuses symlinks/u
  );
});

function envelope(locationUri: string, previewPath: string, maxBytes?: number): Record<string, unknown> {
  return {
    protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
    messageType: "dataset.file.preview",
    commandId: "dataset-preview-command-1",
    ts: "2026-05-23T00:00:00.000Z",
    data: {
      commandId: "dataset-preview-command-1",
      vmHostId,
      datasetVersionId,
      datasetLocationId,
      locationUri,
      path: previewPath,
      ...(maxBytes ? { maxBytes } : {}),
    },
  };
}
