import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  YP_LIVE_WORKFLOW_VM_PROTOCOL,
  type ArtifactCollectPayload,
} from "../../../contracts/index.js";
import {
  ArtifactCollector,
  InMemoryArtifactIndexStore,
  type ArtifactCollectorLogger,
  type ArtifactIndexEntry,
  type ArtifactIndexStore,
  type ArtifactObjectStorageClient,
  type ArtifactObjectStoragePutInput,
} from "../../artifacts/artifactCollector.js";
import { ArtifactCollectCommandHandler } from "../../commands/artifactCollectCommandHandler.js";

const now = new Date("2026-05-16T13:00:00.000Z");

test("artifact collector scans safe files and uploads through object storage", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  await fs.mkdir(path.join(artifactsPath, "results"), { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "results", "table.csv"), "gene,value\nHDAC1,1\n");
  await fs.writeFile(path.join(artifactsPath, "run.log"), "done\n");
  await fs.writeFile(path.join(artifactsPath, ".yp-live-workflow-cache"), "ignored\n");
  const tableChecksum = sha256("gene,value\nHDAC1,1\n");
  const logChecksum = sha256("done\n");
  const storage = new FakeArtifactObjectStorage("gs://private-artifacts");
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    objectStorage: storage,
    objectStoragePrefix: "artifacts",
    now: () => now,
  });

  const result = await collector.collect(artifactPayload({ artifactsPath }));

  assert.equal(result.uploadEnabled, true);
  assert.deepEqual(result.artifacts.map((artifact) => artifact.relativePath), ["results/table.csv", "run.log"]);
  assert.equal(result.artifacts[0]?.kind, "table");
  assert.equal(result.artifacts[0]?.contentType, "text/csv");
  assert.equal(result.artifacts[0]?.checksumSha256, tableChecksum);
  assert.equal(
    result.artifacts[0]?.objectUri,
    `gs://private-artifacts/artifacts/vm-collected/${tableChecksum.slice(0, 2)}/${tableChecksum}/run-1-step-1-session-1-results/table.csv`
  );
  assert.deepEqual(storage.puts.map((put) => put.objectKey), [
    `artifacts/vm-collected/${tableChecksum.slice(0, 2)}/${tableChecksum}/run-1-step-1-session-1-results/table.csv`,
    `artifacts/vm-collected/${logChecksum.slice(0, 2)}/${logChecksum}/run-1-step-1-session-1-root/run.log`,
  ]);
});

test("artifact collector classifies source code artifacts with previewable content types", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  await fs.mkdir(path.join(artifactsPath, "research_steps", "S01", "code"), { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "research_steps", "S01", "code", "analysis.py"), "print('ok')\n");
  await fs.writeFile(path.join(artifactsPath, "research_steps", "S01", "code", "plot.R"), "print('ok')\n");
  await fs.writeFile(path.join(artifactsPath, "research_steps", "S01", "code", "query.sql"), "select 1;\n");
  await fs.writeFile(path.join(artifactsPath, "research_steps", "S01", "code", "environment.yaml"), "name: step\n");
  await fs.writeFile(path.join(artifactsPath, "research_steps", "S01", "code", "analysis.ipynb"), "{}\n");
  const collector = new ArtifactCollector({ allowedRootPath: root, now: () => now });

  const result = await collector.collect(artifactPayload({ artifactsPath, upload: false }));
  const byPath = new Map(result.artifacts.map((artifact) => [artifact.relativePath, artifact]));

  assert.equal(byPath.get("research_steps/S01/code/analysis.py")?.kind, "source_code");
  assert.equal(byPath.get("research_steps/S01/code/analysis.py")?.contentType, "text/x-python");
  assert.equal(byPath.get("research_steps/S01/code/plot.R")?.kind, "source_code");
  assert.equal(byPath.get("research_steps/S01/code/plot.R")?.contentType, "text/x-r");
  assert.equal(byPath.get("research_steps/S01/code/query.sql")?.kind, "source_code");
  assert.equal(byPath.get("research_steps/S01/code/query.sql")?.contentType, "text/x-sql");
  assert.equal(byPath.get("research_steps/S01/code/environment.yaml")?.kind, "source_code");
  assert.equal(byPath.get("research_steps/S01/code/environment.yaml")?.contentType, "application/yaml");
  assert.equal(byPath.get("research_steps/S01/code/analysis.ipynb")?.kind, "notebook");
  assert.equal(byPath.get("research_steps/S01/code/analysis.ipynb")?.contentType, "application/x-ipynb+json");
});

test("artifact collector classifies checksum, JSONL, and Parquet previews", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "manifest.sha256"), `${"a".repeat(64)}  results.parquet\n`);
  await fs.writeFile(path.join(artifactsPath, "records.jsonl"), '{"id":1}\n');
  await fs.writeFile(path.join(artifactsPath, "results.parquet"), "PAR1");
  const collector = new ArtifactCollector({ allowedRootPath: root, now: () => now });

  const result = await collector.collect(artifactPayload({ artifactsPath, upload: false }));
  const byPath = new Map(result.artifacts.map((artifact) => [artifact.relativePath, artifact]));

  assert.equal(byPath.get("manifest.sha256")?.contentType, "text/plain");
  assert.equal(byPath.get("records.jsonl")?.contentType, "application/x-ndjson");
  assert.equal(byPath.get("results.parquet")?.contentType, "application/vnd.apache.parquet");
  assert.equal(byPath.get("results.parquet")?.kind, "table");
});

test("artifact collector rejects symlinks and paths outside the trusted root", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.symlink("/etc/passwd", path.join(artifactsPath, "passwd-link"));
  const collector = new ArtifactCollector({ allowedRootPath: root });

  await assert.rejects(collector.collect(artifactPayload({ artifactsPath })), /refuses symlinks/);

  const outside = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-outside-"));
  await assert.rejects(collector.collect(artifactPayload({ artifactsPath: outside })), /outside the trusted VM workspace root/);
});

test("artifact collector validates the full tree before uploading safe files", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  const storage = new FakeArtifactObjectStorage("gs://private-artifacts");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "a.txt"), "a\n");
  await fs.symlink("/etc/passwd", path.join(artifactsPath, "z-passwd-link"));
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    objectStorage: storage,
    now: () => now,
  });

  await assert.rejects(collector.collect(artifactPayload({ artifactsPath })), /refuses symlinks/u);
  assert.deepEqual(storage.puts, []);
  assert.deepEqual(storage.deletedObjectUris, []);
});

test("artifact collector uploads content captured from the stable file handle", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  const artifactPath = path.join(artifactsPath, "result.txt");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(artifactPath, "stable artifact\n");
  const storage = new FakeArtifactObjectStorage("gs://private-artifacts", async (input) => {
    await fs.unlink(input.localPath);
    await fs.symlink("/etc/passwd", input.localPath);
  });
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    objectStorage: storage,
    now: () => now,
  });

  const result = await collector.collect(artifactPayload({ artifactsPath }));

  assert.equal(result.artifacts[0]?.checksumSha256, sha256("stable artifact\n"));
  assert.equal(storage.puts[0]?.content.toString(), "stable artifact\n");
  assert.equal(await fs.readlink(artifactPath), "/etc/passwd");
});

test("artifact collector uploads the same snapshot bytes that it hashes", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  const artifactPath = path.join(artifactsPath, "result.txt");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(artifactPath, "original artifact\n");
  const storage = new FakeArtifactObjectStorage("gs://private-artifacts", async (input) => {
    await fs.writeFile(input.localPath, "rewritten artifact\n");
  });
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    objectStorage: storage,
    now: () => now,
  });

  const result = await collector.collect(artifactPayload({ artifactsPath }));

  assert.equal(result.artifacts[0]?.checksumSha256, sha256("original artifact\n"));
  assert.equal(result.artifacts[0]?.sizeBytes, Buffer.byteLength("original artifact\n"));
  assert.equal(storage.puts[0]?.metadata?.checksumSha256, sha256("original artifact\n"));
  assert.equal(storage.puts[0]?.content.toString(), "original artifact\n");
  assert.equal(await fs.readFile(artifactPath, "utf8"), "rewritten artifact\n");
});

test("artifact collector treats disabled upload config as an upper bound", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "result.txt"), "result\n");
  const storage = new FakeArtifactObjectStorage("gs://private-artifacts");
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    objectStorage: storage,
    uploadEnabled: false,
    now: () => now,
  });

  const result = await collector.collect(artifactPayload({ artifactsPath, upload: true }));

  assert.equal(result.uploadEnabled, false);
  assert.equal(result.artifacts[0]?.objectUri, null);
  assert.deepEqual(storage.puts, []);
});

test("artifact collector logs and skips uploading artifacts over the maximum upload size", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  const content = "large artifact body\n";
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "large.bin"), content);
  const storage = new FakeArtifactObjectStorage("gs://private-artifacts");
  const logger = new FakeArtifactCollectorLogger();
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    logger,
    maxUploadBytes: 8,
    objectStorage: storage,
    now: () => now,
  });

  const result = await collector.collect(artifactPayload({ artifactsPath }));
  const metadata = result.artifacts[0]?.metadata as Record<string, unknown>;

  assert.equal(result.uploadEnabled, true);
  assert.equal(result.artifacts[0]?.relativePath, "large.bin");
  assert.equal(result.artifacts[0]?.sizeBytes, Buffer.byteLength(content));
  assert.equal(result.artifacts[0]?.checksumSha256, sha256(content));
  assert.equal(result.artifacts[0]?.objectUri, null);
  assert.equal(metadata.uploadSkipped, true);
  assert.equal(metadata.uploadSkippedReason, "max_upload_size_exceeded");
  assert.equal(metadata.maxUploadBytes, 8);
  assert.deepEqual(storage.puts, []);
  assert.equal(logger.errors.length, 1);
  assert.match(logger.errors[0]?.message ?? "", /exceeds maximum artifact upload size/u);
  assert.equal(logger.errors[0]?.metadata.event, "artifact_upload_size_exceeded");
  assert.equal(logger.errors[0]?.metadata.relativePath, "large.bin");
  assert.equal(logger.errors[0]?.metadata.maxUploadBytes, 8);
});

test("artifact collector writes a skipped-artifact manifest for files over the collection file limit", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  const content = "large artifact body\n";
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "large.bin"), content);
  const storage = new FakeArtifactObjectStorage("gs://private-artifacts");
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    maxFileBytes: 8,
    objectStorage: storage,
    now: () => now,
  });

  const result = await collector.collect(artifactPayload({ artifactsPath }));
  const artifact = result.artifacts[0];
  const metadata = artifact?.metadata as Record<string, unknown>;
  const manifest = JSON.parse(storage.puts[0]?.content.toString("utf8") ?? "{}") as Record<string, unknown>;

  assert.equal(result.uploadEnabled, true);
  assert.equal(result.artifacts.length, 1);
  assert.equal(artifact?.relativePath, "large.bin.skipped-artifact.json");
  assert.equal(artifact?.contentType, "application/json");
  assert.equal(artifact?.kind, "data");
  assert.notEqual(artifact?.checksumSha256, sha256(content));
  assert.match(storage.puts[0]?.content.toString("utf8") ?? "", /max_file_size_exceeded/u);
  assert.doesNotMatch(storage.puts[0]?.content.toString("utf8") ?? "", /large artifact body/u);
  assert.equal(manifest.schema, "yp-live-workflow.skipped-artifact.v1");
  assert.equal(manifest.reason, "max_file_size_exceeded");
  assert.equal(manifest.relativePath, "large.bin");
  assert.equal(manifest.sizeBytes, Buffer.byteLength(content));
  assert.equal(manifest.limitBytes, 8);
  assert.equal(metadata.skippedArtifact, true);
  assert.equal(metadata.skippedOriginalRelativePath, "large.bin");
  assert.equal(metadata.skippedOriginalSizeBytes, Buffer.byteLength(content));
  assert.equal(metadata.skippedOriginalLimitBytes, 8);
  assert.equal(metadata.uploadSkippedOriginal, true);
  assert.equal(metadata.uploadSkippedReason, "max_file_size_exceeded");
});

test("artifact collector keeps skipped-artifact manifests readable when uploads are disabled", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  const content = "large artifact body\n";
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "large.bin"), content);
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    maxFileBytes: 8,
    now: () => now,
  });

  const result = await collector.collect(artifactPayload({ artifactsPath }));
  const artifact = result.artifacts[0];
  const metadata = artifact?.metadata as Record<string, unknown>;
  const expectedManifestPath = path.join(artifactsPath, "large.bin.skipped-artifact.json");
  const manifest = JSON.parse(await fs.readFile(artifact?.localPath ?? "", "utf8")) as Record<string, unknown>;
  const second = await collector.collect(artifactPayload({ artifactsPath, commandId: "artifact-command-2" }));

  assert.equal(result.uploadEnabled, false);
  assert.equal(artifact?.relativePath, "large.bin.skipped-artifact.json");
  assert.equal(artifact?.localPath, expectedManifestPath);
  assert.equal(artifact?.objectUri, null);
  assert.equal(metadata.skippedManifestDurable, true);
  assert.equal(manifest.reason, "max_file_size_exceeded");
  assert.equal(manifest.relativePath, "large.bin");
  assert.equal(second.artifacts.length, 1);
  assert.equal(second.artifacts[0]?.relativePath, "large.bin.skipped-artifact.json");
});

test("artifact collector refuses durable skipped-artifact manifests under symlinked parents", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  const outsidePath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-outside-"));
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.symlink(outsidePath, path.join(artifactsPath, "nested"), "dir");
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    maxFileBytes: 8,
    now: () => now,
  });
  const durableWriter = collector as unknown as {
    durableSkippedArtifactManifest: (
      rootPath: string,
      rootRealPath: string,
      skippedRelativePath: string,
      content: string
    ) => Promise<unknown>;
  };

  await assert.rejects(
    durableWriter.durableSkippedArtifactManifest(
      artifactsPath,
      await fs.realpath(artifactsPath),
      "nested/large.bin.skipped-artifact.json",
      "{}\n"
    ),
    /skipped-manifest parent is not a safe directory/u
  );
  await assert.rejects(
    fs.stat(path.join(outsidePath, "large.bin.skipped-artifact.json")),
    /ENOENT/u
  );
});

test("artifact collector reuses known skipped-artifact manifests", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "large.bin"), "large artifact body\n");
  const storage = new FakeArtifactObjectStorage("gs://private-artifacts");
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    maxFileBytes: 8,
    objectStorage: storage,
    now: () => now,
  });
  const first = await collector.collect(artifactPayload({ artifactsPath, upload: false }));
  const knownChecksum = first.artifacts[0]?.checksumSha256 ?? "";

  const result = await collector.collect(artifactPayload({
    artifactsPath,
    knownArtifacts: [
      {
        artifactId: "known-skipped-manifest-id",
        relativePath: "large.bin.skipped-artifact.json",
        checksumSha256: knownChecksum,
        objectUri: "gs://private-artifacts/known-skipped-manifest.json",
      },
    ],
  }));
  const artifact = result.artifacts[0];
  const metadata = artifact?.metadata as Record<string, unknown>;

  assert.equal(artifact?.artifactId, "known-skipped-manifest-id");
  assert.equal(artifact?.relativePath, "large.bin.skipped-artifact.json");
  assert.equal(artifact?.checksumSha256, knownChecksum);
  assert.equal(artifact?.sizeBytes, first.artifacts[0]?.sizeBytes);
  assert.equal(artifact?.objectUri, "gs://private-artifacts/known-skipped-manifest.json");
  assert.equal(metadata.manifestUploadSkipped, true);
  assert.equal(metadata.manifestUploadSkippedReason, "known_artifact");
  assert.deepEqual(storage.puts, []);
});

test("artifact collector fails when matched files exceed the collection file guardrail", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  const storage = new FakeArtifactObjectStorage("gs://private-artifacts");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "a.txt"), "a\n");
  await fs.writeFile(path.join(artifactsPath, "b.txt"), "b\n");
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    maxFiles: 1,
    objectStorage: storage,
    now: () => now,
  });

  await assert.rejects(
    collector.collect(artifactPayload({ artifactsPath })),
    /artifact_collection_limit_exceeded: artifact collection matched 2 files/u
  );
  assert.deepEqual(storage.puts, []);
});

test("artifact collector fails when matched bytes exceed the collection byte guardrail", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  const storage = new FakeArtifactObjectStorage("gs://private-artifacts");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "large.txt"), "large body\n");
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    maxTotalBytes: 8,
    objectStorage: storage,
    now: () => now,
  });

  await assert.rejects(
    collector.collect(artifactPayload({ artifactsPath })),
    /artifact_collection_limit_exceeded: artifact collection matched 11 bytes/u
  );
  assert.deepEqual(storage.puts, []);
});

test("artifact collector rechecks total bytes before uploading late-grown files", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  const bPath = path.join(artifactsPath, "b.txt");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "a.txt"), "a\n");
  await fs.writeFile(bPath, "b\n");
  const aChecksum = sha256("a\n");
  const aObjectKey = `artifacts/vm-collected/${aChecksum.slice(0, 2)}/${aChecksum}/run-1-step-1-session-1-root/a.txt`;
  const storage = new FakeArtifactObjectStorage("gs://private-artifacts", async (_input, putIndex) => {
    if (putIndex === 0) {
      await fs.writeFile(bPath, "expanded artifact\n");
    }
  });
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    maxTotalBytes: 8,
    objectStorage: storage,
    now: () => now,
  });

  await assert.rejects(
    collector.collect(artifactPayload({ artifactsPath })),
    /artifact_collection_limit_exceeded: artifact collection matched \d+ bytes, exceeding max 8; latest path b\.txt/u
  );
  assert.deepEqual(storage.puts.map((put) => put.objectKey), [aObjectKey]);
  assert.deepEqual(storage.deletedObjectUris, [`gs://private-artifacts/${aObjectKey}`]);
});

test("artifact collector deletes uploaded objects when a later upload fails", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "a.txt"), "a\n");
  await fs.writeFile(path.join(artifactsPath, "b.txt"), "b\n");
  const aChecksum = sha256("a\n");
  const aObjectKey = `artifacts/vm-collected/${aChecksum.slice(0, 2)}/${aChecksum}/run-1-step-1-session-1-root/a.txt`;
  const storage = new FakeArtifactObjectStorage("gs://private-artifacts", async (_input, putIndex) => {
    if (putIndex === 1) {
      throw new Error("second upload failed");
    }
  });
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    objectStorage: storage,
    now: () => now,
  });

  await assert.rejects(collector.collect(artifactPayload({ artifactsPath })), /second upload failed/u);
  assert.deepEqual(storage.puts.map((put) => put.objectKey), [aObjectKey]);
  assert.deepEqual(storage.deletedObjectUris, [`gs://private-artifacts/${aObjectKey}`]);
});

test("artifact collector skips uploading known unchanged artifacts", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "result.txt"), "result\n");
  const resultChecksum = sha256("result\n");
  const storage = new FakeArtifactObjectStorage("gs://private-artifacts");
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    objectStorage: storage,
    now: () => now,
  });

  const result = await collector.collect(artifactPayload({
    artifactsPath,
    knownArtifacts: [
      {
        artifactId: "known-artifact-id",
        relativePath: "result.txt",
        checksumSha256: resultChecksum,
        objectUri: `gs://private-artifacts/artifacts/vm-collected/${resultChecksum.slice(0, 2)}/${resultChecksum}/run-1-step-1-session-1-root/result.txt`,
      },
    ],
  }));

  assert.equal(result.uploadEnabled, true);
  assert.equal(result.artifacts[0]?.artifactId, "known-artifact-id");
  assert.equal(
    result.artifacts[0]?.objectUri,
    `gs://private-artifacts/artifacts/vm-collected/${resultChecksum.slice(0, 2)}/${resultChecksum}/run-1-step-1-session-1-root/result.txt`
  );
  assert.equal((result.artifacts[0]?.metadata as Record<string, unknown>).uploadSkippedReason, "known_artifact");
  assert.deepEqual(storage.puts, []);
});

test("artifact collector reuses indexed unchanged artifacts without uploading again", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "result.txt"), "result\n");
  const storage = new FakeArtifactObjectStorage("gs://private-artifacts");
  const artifactIndex = new InMemoryArtifactIndexStore();
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    artifactIndex,
    objectStorage: storage,
    now: () => now,
  });

  const first = await collector.collect(artifactPayload({ artifactsPath }));
  const second = await collector.collect(artifactPayload({ artifactsPath, commandId: "artifact-command-2" }));

  assert.equal(first.artifacts[0]?.checksumSha256, sha256("result\n"));
  assert.equal(second.artifacts[0]?.checksumSha256, sha256("result\n"));
  assert.equal(second.artifacts[0]?.objectUri, first.artifacts[0]?.objectUri);
  assert.equal((second.artifacts[0]?.metadata as Record<string, unknown>).artifactIndexHit, true);
  assert.equal((second.artifacts[0]?.metadata as Record<string, unknown>).uploadSkippedReason, "artifact_index");
  assert.equal(storage.puts.length, 1);
});

test("artifact collector treats artifact index write failures as best-effort", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "result.txt"), "result\n");
  const storage = new FakeArtifactObjectStorage("gs://private-artifacts");
  const logger = new FakeArtifactCollectorLogger();
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    artifactIndex: new FailingArtifactIndexStore({ failWrites: true }),
    logger,
    objectStorage: storage,
    now: () => now,
  });

  const result = await collector.collect(artifactPayload({ artifactsPath }));

  assert.equal(result.artifacts.length, 1);
  assert.equal(result.artifacts[0]?.checksumSha256, sha256("result\n"));
  assert.equal(storage.puts.length, 1);
  assert.equal(logger.errors.length, 1);
  assert.equal(logger.errors[0]?.metadata.event, "artifact_index_failed");
  assert.match(logger.errors[0]?.message ?? "", /Artifact index write failed/u);
});

test("artifact collector invalidates indexed artifacts when object storage identity changes", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "result.txt"), "result\n");
  const artifactIndex = new InMemoryArtifactIndexStore();
  const oldStorage = new FakeArtifactObjectStorage("gs://old-artifacts");
  const newStorage = new FakeArtifactObjectStorage("gs://new-artifacts");
  const firstCollector = new ArtifactCollector({
    allowedRootPath: root,
    artifactIndex,
    objectStorage: oldStorage,
    objectStorageIdentity: "gcs:old-artifacts",
    now: () => now,
  });
  const secondCollector = new ArtifactCollector({
    allowedRootPath: root,
    artifactIndex,
    objectStorage: newStorage,
    objectStorageIdentity: "gcs:new-artifacts",
    now: () => now,
  });

  const first = await firstCollector.collect(artifactPayload({ artifactsPath }));
  const second = await secondCollector.collect(artifactPayload({ artifactsPath, commandId: "artifact-command-2" }));

  assert.match(first.artifacts[0]?.objectUri ?? "", /^gs:\/\/old-artifacts\//u);
  assert.match(second.artifacts[0]?.objectUri ?? "", /^gs:\/\/new-artifacts\//u);
  assert.equal(oldStorage.puts.length, 1);
  assert.equal(newStorage.puts.length, 1);
  assert.equal((second.artifacts[0]?.metadata as Record<string, unknown> | undefined)?.artifactIndexHit, undefined);
});

test("artifact collector invalidates indexed artifacts when file identity changes", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  const resultPath = path.join(artifactsPath, "result.txt");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(resultPath, "old result\n");
  const storage = new FakeArtifactObjectStorage("gs://private-artifacts");
  const artifactIndex = new InMemoryArtifactIndexStore();
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    artifactIndex,
    objectStorage: storage,
    now: () => now,
  });

  await collector.collect(artifactPayload({ artifactsPath }));
  await sleep(10);
  await fs.writeFile(resultPath, "new result\n");
  const result = await collector.collect(artifactPayload({ artifactsPath, commandId: "artifact-command-2" }));

  assert.equal(result.artifacts[0]?.checksumSha256, sha256("new result\n"));
  assert.equal((result.artifacts[0]?.metadata as Record<string, unknown> | undefined)?.artifactIndexHit, undefined);
  assert.equal(storage.puts.length, 2);
});

test("artifact collector reuses indexed skipped-artifact manifests", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "large.bin"), "large artifact body\n");
  const storage = new FakeArtifactObjectStorage("gs://private-artifacts");
  const artifactIndex = new InMemoryArtifactIndexStore();
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    artifactIndex,
    maxFileBytes: 8,
    objectStorage: storage,
    now: () => now,
  });

  const first = await collector.collect(artifactPayload({ artifactsPath }));
  const second = await collector.collect(artifactPayload({ artifactsPath, commandId: "artifact-command-2" }));
  const metadata = second.artifacts[0]?.metadata as Record<string, unknown>;

  assert.equal(first.artifacts[0]?.relativePath, "large.bin.skipped-artifact.json");
  assert.equal(second.artifacts[0]?.relativePath, "large.bin.skipped-artifact.json");
  assert.equal(second.artifacts[0]?.checksumSha256, first.artifacts[0]?.checksumSha256);
  assert.equal(second.artifacts[0]?.objectUri, first.artifacts[0]?.objectUri);
  assert.equal(metadata.artifactIndexHit, true);
  assert.equal(metadata.manifestUploadSkippedReason, "artifact_index");
  assert.equal(storage.puts.length, 1);
});

test("artifact collector invalidates indexed artifacts when collection policy changes", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "result.txt"), "result\n");
  const storage = new FakeArtifactObjectStorage("gs://private-artifacts");
  const artifactIndex = new InMemoryArtifactIndexStore();
  const firstCollector = new ArtifactCollector({
    allowedRootPath: root,
    artifactIndex,
    objectStorage: storage,
    now: () => now,
  });
  const secondCollector = new ArtifactCollector({
    allowedRootPath: root,
    artifactIndex,
    maxUploadBytes: 64,
    objectStorage: storage,
    now: () => now,
  });

  await firstCollector.collect(artifactPayload({ artifactsPath }));
  const result = await secondCollector.collect(artifactPayload({ artifactsPath, commandId: "artifact-command-2" }));

  assert.equal(result.artifacts[0]?.checksumSha256, sha256("result\n"));
  assert.equal((result.artifacts[0]?.metadata as Record<string, unknown> | undefined)?.artifactIndexHit, undefined);
  assert.equal(storage.puts.length, 2);
});

test("artifact collector uploads known unchanged artifacts without object storage URI when uploads are enabled", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "result.txt"), "result\n");
  const resultChecksum = sha256("result\n");
  const storage = new FakeArtifactObjectStorage("gs://private-artifacts");
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    objectStorage: storage,
    now: () => now,
  });

  const result = await collector.collect(artifactPayload({
    artifactsPath,
    knownArtifacts: [
      {
        artifactId: "known-artifact-id",
        relativePath: "result.txt",
        checksumSha256: resultChecksum,
        objectUri: null,
      },
    ],
  }));

  assert.equal(result.uploadEnabled, true);
  assert.equal(result.artifacts[0]?.artifactId, undefined);
  assert.equal(
    result.artifacts[0]?.objectUri,
    `gs://private-artifacts/artifacts/vm-collected/${resultChecksum.slice(0, 2)}/${resultChecksum}/run-1-step-1-session-1-root/result.txt`
  );
  assert.equal((result.artifacts[0]?.metadata as Record<string, unknown> | undefined)?.uploadSkippedReason, undefined);
  assert.deepEqual(storage.puts.map((put) => put.objectKey), [
    `artifacts/vm-collected/${resultChecksum.slice(0, 2)}/${resultChecksum}/run-1-step-1-session-1-root/result.txt`,
  ]);
});

test("artifact collector uploads changed artifacts even when the path is known", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "result.txt"), "new result\n");
  const storage = new FakeArtifactObjectStorage("gs://private-artifacts");
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    objectStorage: storage,
    now: () => now,
  });

  const result = await collector.collect(artifactPayload({
    artifactsPath,
    knownArtifacts: [
      {
        relativePath: "result.txt",
        checksumSha256: sha256("old result\n"),
        objectUri: "gs://private-artifacts/old-result.txt",
      },
    ],
  }));

  assert.equal(result.artifacts[0]?.checksumSha256, sha256("new result\n"));
  assert.equal(storage.puts.length, 1);
});

test("artifact collect command returns an artifact.ready response envelope", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "report.md"), "# Report\n");
  const handler = new ArtifactCollectCommandHandler(new ArtifactCollector({ allowedRootPath: root, now: () => now }));

  const response = await handler.handle(
    {
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "artifact.collect",
      commandId: "artifact-command-1",
      ts: now.toISOString(),
      data: artifactPayload({ artifactsPath, upload: false }),
    },
    { now: () => now }
  ) as Record<string, unknown>;

  assert.equal(response.messageType, "artifact.ready");
  assert.equal((response.data as Record<string, unknown>).sessionId, "session-1");
  assert.equal(((response.data as Record<string, unknown>).artifacts as Array<Record<string, unknown>>)[0]?.kind, "report");
});

test("artifact collect command normalizes container permissions and retries after EACCES", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  await fs.mkdir(artifactsPath, { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "report.md"), "# Report\n");
  const collector = new ArtifactCollector({ allowedRootPath: root, now: () => now });
  let collectionAttempts = 0;
  const normalizedSessionIds: string[] = [];
  const handler = new ArtifactCollectCommandHandler(
    {
      async collect(payload) {
        collectionAttempts += 1;
        if (collectionAttempts === 1) {
          const error = new Error("EACCES: permission denied, open report.md") as NodeJS.ErrnoException;
          error.code = "EACCES";
          throw error;
        }
        return await collector.collect(payload);
      },
    },
    {
      async normalizeArtifactOutputInContainer(input) {
        normalizedSessionIds.push(input.sessionId);
        return true;
      },
      async makeArtifactDirectoryWritableInContainer() {
        assert.fail("readable retry should not request artifact directory write access");
      },
    }
  );

  const response = await handler.handle(
    {
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "artifact.collect",
      commandId: "artifact-command-1",
      ts: now.toISOString(),
      data: artifactPayload({ artifactsPath, upload: false }),
    },
    { now: () => now }
  ) as Record<string, unknown>;

  assert.equal(collectionAttempts, 2);
  assert.deepEqual(normalizedSessionIds, ["session-1"]);
  assert.equal(response.messageType, "artifact.ready");
});

test("artifact collect command grants write only to a durable skipped-manifest parent", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  await fs.mkdir(path.join(artifactsPath, "reports"), { recursive: true });
  await fs.writeFile(path.join(artifactsPath, "reports", "large.bin"), "large artifact body\n");
  const collector = new ArtifactCollector({
    allowedRootPath: root,
    maxFileBytes: 8,
    now: () => now,
  });
  const manifestTempPath = path.join(
    artifactsPath,
    "reports",
    ".yp-live-workflow-skipped-artifact-123-large.bin.skipped-artifact.json.tmp"
  );
  let collectionAttempts = 0;
  const readableSessionIds: string[] = [];
  const writableRequests: Array<{ sessionId: string; containerPath: string }> = [];
  const handler = new ArtifactCollectCommandHandler(
    {
      async collect(payload) {
        collectionAttempts += 1;
        if (collectionAttempts <= 2) {
          throw permissionError(manifestTempPath);
        }
        return await collector.collect(payload);
      },
    },
    {
      async normalizeArtifactOutputInContainer(input) {
        readableSessionIds.push(input.sessionId);
        return true;
      },
      async makeArtifactDirectoryWritableInContainer(input) {
        writableRequests.push(input);
        return true;
      },
    }
  );

  const response = await handler.handle(
    {
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "artifact.collect",
      commandId: "artifact-command-1",
      ts: now.toISOString(),
      data: artifactPayload({ artifactsPath, upload: false }),
    },
    { now: () => now }
  ) as Record<string, unknown>;

  assert.equal(collectionAttempts, 3);
  assert.deepEqual(readableSessionIds, ["session-1"]);
  assert.deepEqual(writableRequests, [{
    sessionId: "session-1",
    containerPath: "/artifacts/reports",
  }]);
  assert.equal(response.messageType, "artifact.ready");
  assert.equal(
    ((response.data as Record<string, unknown>).artifacts as Array<Record<string, unknown>>)[0]?.relativePath,
    "reports/large.bin.skipped-artifact.json"
  );
});

test("artifact collect command refuses write normalization outside the artifact root", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifacts-root-"));
  const artifactsPath = path.join(root, "artifacts");
  await fs.mkdir(artifactsPath, { recursive: true });
  let collectionAttempts = 0;
  let writableRequests = 0;
  const outsideError = permissionError(path.join(
    root,
    "outside",
    ".yp-live-workflow-skipped-artifact-123-report.tmp"
  ));
  const handler = new ArtifactCollectCommandHandler(
    {
      async collect() {
        collectionAttempts += 1;
        if (collectionAttempts === 1) {
          throw permissionError(path.join(artifactsPath, "report.html"));
        }
        throw outsideError;
      },
    },
    {
      async normalizeArtifactOutputInContainer() {
        return true;
      },
      async makeArtifactDirectoryWritableInContainer() {
        writableRequests += 1;
        return true;
      },
    }
  );

  await assert.rejects(
    () => handler.handle(
      {
        protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
        messageType: "artifact.collect",
        commandId: "artifact-command-1",
        ts: now.toISOString(),
        data: artifactPayload({ artifactsPath, upload: false }),
      },
      { now: () => now }
    ),
    (error: unknown) => error === outsideError
  );
  assert.equal(collectionAttempts, 2);
  assert.equal(writableRequests, 0);
});

function artifactPayload(overrides: Partial<ArtifactCollectPayload> = {}): ArtifactCollectPayload {
  return {
    commandId: "artifact-command-1",
    sessionId: "session-1",
    runId: "run-1",
    runStepId: "step-1",
    workspaceId: "workspace-1",
    vmHostId: "vm-1",
    artifactsPath: "/tmp/missing-artifacts",
    upload: true,
    ...overrides,
  };
}

function permissionError(filePath: string): NodeJS.ErrnoException {
  const error = new Error(`EACCES: permission denied, open '${filePath}'`) as NodeJS.ErrnoException;
  error.code = "EACCES";
  error.path = filePath;
  return error;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

class FakeArtifactObjectStorage implements ArtifactObjectStorageClient {
  readonly puts: Array<ArtifactObjectStoragePutInput & { content: Buffer }> = [];
  readonly deletedObjectUris: string[] = [];

  constructor(
    private readonly baseUri: string,
    private readonly beforePut?: (input: ArtifactObjectStoragePutInput, putIndex: number) => Promise<void>
  ) {}

  async putFile(input: ArtifactObjectStoragePutInput) {
    await this.beforePut?.(input, this.puts.length);
    this.puts.push({
      ...input,
      content: await readStreamToBuffer(input.openContentStream()),
    });
    return { uri: `${this.baseUri}/${input.objectKey}` };
  }

  async deleteObject(objectUri: string) {
    this.deletedObjectUris.push(objectUri);
  }
}

class FailingArtifactIndexStore implements ArtifactIndexStore {
  constructor(private readonly options: { failReads?: boolean; failWrites?: boolean }) {}

  async readEntries(): Promise<ArtifactIndexEntry[]> {
    if (this.options.failReads) {
      throw new Error("index read failed");
    }

    return [];
  }

  async mergeEntries(): Promise<void> {
    if (this.options.failWrites) {
      throw new Error("index write failed");
    }
  }
}

async function readStreamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

class FakeArtifactCollectorLogger implements ArtifactCollectorLogger {
  readonly errors: Array<{ message: string; metadata: Record<string, unknown> }> = [];

  error(message: string, metadata: Record<string, unknown> = {}) {
    this.errors.push({ message, metadata });
  }
}
