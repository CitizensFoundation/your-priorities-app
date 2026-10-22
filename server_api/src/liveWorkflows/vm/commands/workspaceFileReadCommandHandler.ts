import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { constants as fsConstants } from "node:fs";
import fs, { type FileHandle } from "node:fs/promises";
import path from "node:path";
import {
  YP_LIVE_WORKFLOW_VM_PROTOCOL,
  normalizeSafeRelativePath,
  VmWorkspaceFileReadCommandEnvelopeSchema,
  VmWorkspaceFileReadyResponseEnvelopeSchema,
  type WorkspaceFileReadPayload,
  type WorkspaceFileReadResponsePayload,
} from "../../contracts/index.js";
import type { DockerRuntimeManager } from "../docker/dockerRuntimeManager.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";
import { VmCommandValidationError } from "./runtimeEnsureImageCommandHandler.js";

const DefaultMaxBytes = 1_000_000;

export class WorkspaceFileReadCommandHandler implements VmCommandHandler {
  readonly path = "/commands/workspace.file.read";

  constructor(private readonly dockerRuntime: DockerRuntimeManager) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
    const envelope = VmWorkspaceFileReadCommandEnvelopeSchema.parse(body);
    const session = this.dockerRuntime.getSession(envelope.data.sessionId);

    if (!session) {
      throw new VmCommandValidationError(`VM agent session was not found: ${envelope.data.sessionId}`);
    }

    if (session.workspaceId !== envelope.data.workspaceId) {
      throw new VmCommandValidationError(`VM agent session does not belong to workspace: ${envelope.data.workspaceId}`);
    }

    const file = envelope.data.scope === "review_evidence"
      ? await readReviewEvidenceFile(
          envelope.data,
          this.dockerRuntime.resolveSessionEvidenceFile(envelope.data.sessionId, envelope.data.path),
          context.now()
        )
      : await readWorkspaceFile(envelope.data, session.layout.workspacePath, context.now());

    return VmWorkspaceFileReadyResponseEnvelopeSchema.parse({
      ok: true,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "workspace.file.ready",
      commandId: envelope.commandId,
      ts: context.now().toISOString(),
      data: file,
    });
  }
}

async function readWorkspaceFile(
  payload: WorkspaceFileReadPayload,
  workspacePath: string,
  now: Date
): Promise<WorkspaceFileReadResponsePayload> {
  const relativePath = normalizeSafeRelativePath(payload.path);

  if (!relativePath) {
    throw new VmCommandValidationError(`Workspace file path is not safe: ${payload.path}`);
  }

  return readFileBelowRoot(payload, workspacePath, relativePath, payload.path, now);
}

async function readReviewEvidenceFile(
  payload: WorkspaceFileReadPayload,
  resolved: { relativePath: string; rootPath: string },
  now: Date
): Promise<WorkspaceFileReadResponsePayload> {
  return readFileBelowRoot(payload, resolved.rootPath, resolved.relativePath, payload.path, now);
}

async function readFileBelowRoot(
  payload: WorkspaceFileReadPayload,
  rootPath: string,
  relativePath: string,
  responsePath: string,
  now: Date
): Promise<WorkspaceFileReadResponsePayload> {
  const resolvedWorkspacePath = path.resolve(rootPath);
  const destination = relativePath
    ? path.resolve(resolvedWorkspacePath, ...relativePath.split("/"))
    : resolvedWorkspacePath;

  if (!isPathInside(resolvedWorkspacePath, destination)) {
    throw new VmCommandValidationError(`Workspace file path escapes the workspace root: ${payload.path}`);
  }

  const workspaceRealPath = await fs.realpath(resolvedWorkspacePath);
  const maxBytes = payload.maxBytes ?? DefaultMaxBytes;
  const handle = await openNoFollow(destination);

  try {
    const [stat, handleRealPath] = await Promise.all([
      handle.stat(),
      realpathOpenFileHandle(handle),
    ]);

    const statOnly = payload.statOnly === true;
    if (!statOnly && !stat.isFile()) {
      throw new VmCommandValidationError(`Workspace path is not a regular file: ${payload.path}`);
    }
    if (statOnly && !stat.isFile() && !stat.isDirectory()) {
      throw new VmCommandValidationError(`Workspace path is not a regular file or directory: ${payload.path}`);
    }

    const fileRealPath = handleRealPath ?? await fs.realpath(destination);

    if (!isPathInside(workspaceRealPath, fileRealPath)) {
      throw new VmCommandValidationError(`Workspace file path escapes the workspace root: ${payload.path}`);
    }

    const checksumOnly = payload.checksumOnly === true;
    const read = statOnly
      ? { checksumSha256: sha256Buffer(Buffer.alloc(0)), content: "", truncated: false }
      : checksumOnly
        ? await checksumFileHandle(handle, Number(stat.size))
        : await readFilePrefix(handle, Number(stat.size), maxBytes);

    return {
      commandId: payload.commandId,
      sessionId: payload.sessionId,
      workspaceId: payload.workspaceId,
      path: responsePath,
      ...(payload.scope ? { scope: payload.scope } : {}),
      content: read.content,
      contentChecksumSha256: read.checksumSha256,
      sizeBytes: stat.size,
      maxBytes,
      ...(checksumOnly ? { checksumOnly: true } : {}),
      ...(statOnly ? { statOnly: true, entryType: stat.isDirectory() ? "directory" as const : "file" as const } : {}),
      truncated: read.truncated,
      readAt: now.toISOString(),
    };
  } finally {
    await handle.close();
  }
}

async function readFilePrefix(
  handle: FileHandle,
  sizeBytes: number,
  maxBytes: number
): Promise<{ checksumSha256: string; content: string; truncated: boolean }> {
  const readLimit = Math.min(sizeBytes, maxBytes + 1);
  const buffer = Buffer.alloc(readLimit);
  const { bytesRead } = readLimit > 0
    ? await handle.read(buffer, 0, readLimit, 0)
    : { bytesRead: 0 };
  const requestedBuffer = buffer.subarray(0, Math.min(bytesRead, maxBytes));
  const sourceWasTruncated = sizeBytes > requestedBuffer.byteLength || bytesRead > requestedBuffer.byteLength;
  const completePrefixLength = sourceWasTruncated
    ? completeUtf8PrefixLength(requestedBuffer)
    : requestedBuffer.byteLength;
  const contentBuffer = requestedBuffer.subarray(0, completePrefixLength);
  let content: string;
  try {
    content = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(contentBuffer);
  } catch {
    throw new VmCommandValidationError(
      "Workspace file content is not valid UTF-8 text; use checksumOnly for binary files"
    );
  }
  return {
    checksumSha256: sha256Buffer(contentBuffer),
    content,
    truncated: sizeBytes > contentBuffer.byteLength || bytesRead > contentBuffer.byteLength,
  };
}

function completeUtf8PrefixLength(buffer: Buffer): number {
  if (buffer.byteLength === 0) return 0;
  let leadIndex = buffer.byteLength - 1;
  while (leadIndex >= 0 && isUtf8ContinuationByte(buffer[leadIndex]!)) {
    leadIndex -= 1;
  }
  if (leadIndex < 0) return buffer.byteLength;
  const expectedWidth = utf8SequenceWidth(buffer[leadIndex]!);
  if (expectedWidth <= 1) return buffer.byteLength;
  return buffer.byteLength - leadIndex < expectedWidth ? leadIndex : buffer.byteLength;
}

function isUtf8ContinuationByte(value: number): boolean {
  return (value & 0xc0) === 0x80;
}

function utf8SequenceWidth(value: number): number {
  if ((value & 0x80) === 0) return 1;
  if (value >= 0xc2 && value <= 0xdf) return 2;
  if ((value & 0xf0) === 0xe0) return 3;
  if (value >= 0xf0 && value <= 0xf4) return 4;
  return 0;
}

async function checksumFileHandle(
  handle: FileHandle,
  expectedSizeBytes: number
): Promise<{ checksumSha256: string; content: string; truncated: false }> {
  const hash = createHash("sha256");
  const buffer = Buffer.alloc(64 * 1024);
  let position = 0;
  while (true) {
    const { bytesRead } = await handle.read(buffer, 0, buffer.byteLength, position);
    if (bytesRead === 0) break;
    hash.update(buffer.subarray(0, bytesRead));
    position += bytesRead;
  }
  const finalStat = await handle.stat();
  if (position !== expectedSizeBytes || Number(finalStat.size) !== expectedSizeBytes) {
    throw new VmCommandValidationError("Workspace file changed while its checksum was being verified");
  }
  return {
    checksumSha256: hash.digest("hex"),
    content: "",
    truncated: false,
  };
}

async function openNoFollow(localPath: string): Promise<FileHandle> {
  try {
    return await fs.open(localPath, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW | fsConstants.O_NONBLOCK);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ELOOP") {
      throw new VmCommandValidationError(`Workspace file read refuses symlinks: ${localPath}`);
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

function sha256Buffer(value: Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

function isPathInside(basePath: string, targetPath: string): boolean {
  const relative = path.relative(path.resolve(basePath), path.resolve(targetPath));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
