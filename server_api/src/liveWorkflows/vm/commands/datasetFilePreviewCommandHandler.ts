import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { constants as fsConstants } from "node:fs";
import fs, { type FileHandle } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  YP_LIVE_WORKFLOW_VM_PROTOCOL,
  normalizeSafeRelativePath,
  VmDatasetFilePreviewCommandEnvelopeSchema,
  VmDatasetFilePreviewReadyResponseEnvelopeSchema,
  type VmDatasetFilePreviewPayload,
  type VmDatasetFilePreviewReadyPayload,
} from "../../contracts/index.js";
import type { DatasetManager } from "../datasets/datasetManager.js";
import { VmCommandValidationError } from "./runtimeEnsureImageCommandHandler.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";

const DefaultMaxBytes = 1_000_000;

export class DatasetFilePreviewCommandHandler implements VmCommandHandler {
  readonly path = "/commands/dataset.file.preview";

  constructor(private readonly datasets: DatasetManager) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
    const envelope = VmDatasetFilePreviewCommandEnvelopeSchema.parse(body);
    const file = await previewDatasetFile(envelope.data, this.datasets, context.now());

    return VmDatasetFilePreviewReadyResponseEnvelopeSchema.parse({
      ok: true,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "dataset.file.preview.ready",
      commandId: envelope.commandId,
      ts: context.now().toISOString(),
      data: file,
    });
  }
}

async function previewDatasetFile(
  payload: VmDatasetFilePreviewPayload,
  datasets: DatasetManager,
  now: Date
): Promise<VmDatasetFilePreviewReadyPayload> {
  const sourceRoot = path.resolve(localPathFromUri(payload.locationUri));

  if (!path.isAbsolute(sourceRoot)) {
    throw new VmCommandValidationError("Dataset preview location must resolve to an absolute path");
  }

  if (!(await datasets.isTrustedLocalDatasetRoot(sourceRoot))) {
    throw new VmCommandValidationError("Dataset preview location is outside the VM trusted dataset roots");
  }

  const rootRealPath = await fs.realpath(sourceRoot);
  const relativePath = normalizeSafeRelativePath(payload.path);
  if (!relativePath) {
    throw new VmCommandValidationError(`Dataset preview path is not safe: ${payload.path}`);
  }
  const destination = path.resolve(rootRealPath, relativePath);

  if (!isPathInside(rootRealPath, destination)) {
    throw new VmCommandValidationError(`Dataset preview path escapes the dataset root: ${payload.path}`);
  }

  await assertNoSymlinkAncestors(rootRealPath, destination);
  const maxBytes = payload.maxBytes ?? DefaultMaxBytes;
  const handle = await openNoFollow(destination);

  try {
    const [stat, handleRealPath] = await Promise.all([
      handle.stat(),
      realpathOpenFileHandle(handle),
    ]);

    if (!stat.isFile()) {
      throw new VmCommandValidationError(`Dataset preview path is not a regular file: ${payload.path}`);
    }

    const fileRealPath = handleRealPath ?? await fs.realpath(destination);

    if (!isPathInside(rootRealPath, fileRealPath)) {
      throw new VmCommandValidationError(`Dataset preview path escapes the dataset root: ${payload.path}`);
    }

    const readLimit = Math.min(Number(stat.size), maxBytes + 1);
    const buffer = Buffer.alloc(readLimit);
    const { bytesRead } = readLimit > 0
      ? await handle.read(buffer, 0, readLimit, 0)
      : { bytesRead: 0 };
    const contentBuffer = buffer.subarray(0, Math.min(bytesRead, maxBytes));

    if (contentBuffer.includes(0)) {
      throw new VmCommandValidationError(`Dataset preview refuses binary-looking files: ${payload.path}`);
    }

    return {
      ok: true,
      commandId: payload.commandId,
      vmHostId: payload.vmHostId,
      datasetVersionId: payload.datasetVersionId,
      datasetLocationId: payload.datasetLocationId,
      locationUri: payload.locationUri,
      path: relativePath,
      content: contentBuffer.toString("utf8"),
      contentChecksumSha256: sha256Buffer(contentBuffer),
      sizeBytes: stat.size,
      maxBytes,
      truncated: Number(stat.size) > maxBytes || bytesRead > maxBytes,
      readAt: now.toISOString(),
    };
  } finally {
    await handle.close();
  }
}

async function openNoFollow(localPath: string): Promise<FileHandle> {
  try {
    return await fs.open(localPath, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW | fsConstants.O_NONBLOCK);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ELOOP") {
      throw new VmCommandValidationError(`Dataset preview refuses symlinks: ${localPath}`);
    }

    throw error;
  }
}

async function realpathOpenFileHandle(handle: FileHandle): Promise<string | null> {
  try {
    return await fs.realpath(`/proc/self/fd/${handle.fd}`);
  } catch {
    return null;
  }
}

async function assertNoSymlinkAncestors(basePath: string, targetPath: string): Promise<void> {
  const relative = path.relative(path.resolve(basePath), path.resolve(targetPath));
  if (relative === "" || relative.startsWith("..") || path.isAbsolute(relative)) {
    return;
  }

  const segments = relative.split(path.sep).filter(Boolean);
  let currentPath = path.resolve(basePath);

  for (let index = 0; index < segments.length - 1; index += 1) {
    currentPath = path.join(currentPath, segments[index]);
    const stat = await fs.lstat(currentPath);

    if (stat.isSymbolicLink()) {
      throw new VmCommandValidationError("Dataset preview path must not use symlinked directories inside the dataset root");
    }
  }
}

function localPathFromUri(uri: string): string {
  return uri.startsWith("file://") ? fileURLToPath(uri) : uri;
}

function isPathInside(basePath: string, targetPath: string): boolean {
  const relative = path.relative(path.resolve(basePath), path.resolve(targetPath));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function sha256Buffer(value: Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}
