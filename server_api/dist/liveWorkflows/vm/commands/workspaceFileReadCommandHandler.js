import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { constants as fsConstants } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { YP_LIVE_WORKFLOW_VM_PROTOCOL, normalizeSafeRelativePath, VmWorkspaceFileReadCommandEnvelopeSchema, VmWorkspaceFileReadyResponseEnvelopeSchema, } from "../../contracts/index.js";
import { VmCommandValidationError } from "./runtimeEnsureImageCommandHandler.js";
const DefaultMaxBytes = 1000000;
export class WorkspaceFileReadCommandHandler {
    constructor(dockerRuntime) {
        this.dockerRuntime = dockerRuntime;
        this.path = "/commands/workspace.file.read";
    }
    async handle(body, context) {
        const envelope = VmWorkspaceFileReadCommandEnvelopeSchema.parse(body);
        const session = this.dockerRuntime.getSession(envelope.data.sessionId);
        if (!session) {
            throw new VmCommandValidationError(`VM agent session was not found: ${envelope.data.sessionId}`);
        }
        if (session.workspaceId !== envelope.data.workspaceId) {
            throw new VmCommandValidationError(`VM agent session does not belong to workspace: ${envelope.data.workspaceId}`);
        }
        const file = envelope.data.scope === "review_evidence"
            ? await readReviewEvidenceFile(envelope.data, this.dockerRuntime.resolveSessionEvidenceFile(envelope.data.sessionId, envelope.data.path), context.now())
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
async function readWorkspaceFile(payload, workspacePath, now) {
    const relativePath = normalizeSafeRelativePath(payload.path);
    if (!relativePath) {
        throw new VmCommandValidationError(`Workspace file path is not safe: ${payload.path}`);
    }
    return readFileBelowRoot(payload, workspacePath, relativePath, payload.path, now);
}
async function readReviewEvidenceFile(payload, resolved, now) {
    return readFileBelowRoot(payload, resolved.rootPath, resolved.relativePath, payload.path, now);
}
async function readFileBelowRoot(payload, rootPath, relativePath, responsePath, now) {
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
            ...(statOnly ? { statOnly: true, entryType: stat.isDirectory() ? "directory" : "file" } : {}),
            truncated: read.truncated,
            readAt: now.toISOString(),
        };
    }
    finally {
        await handle.close();
    }
}
async function readFilePrefix(handle, sizeBytes, maxBytes) {
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
    let content;
    try {
        content = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(contentBuffer);
    }
    catch {
        throw new VmCommandValidationError("Workspace file content is not valid UTF-8 text; use checksumOnly for binary files");
    }
    return {
        checksumSha256: sha256Buffer(contentBuffer),
        content,
        truncated: sizeBytes > contentBuffer.byteLength || bytesRead > contentBuffer.byteLength,
    };
}
function completeUtf8PrefixLength(buffer) {
    if (buffer.byteLength === 0)
        return 0;
    let leadIndex = buffer.byteLength - 1;
    while (leadIndex >= 0 && isUtf8ContinuationByte(buffer[leadIndex])) {
        leadIndex -= 1;
    }
    if (leadIndex < 0)
        return buffer.byteLength;
    const expectedWidth = utf8SequenceWidth(buffer[leadIndex]);
    if (expectedWidth <= 1)
        return buffer.byteLength;
    return buffer.byteLength - leadIndex < expectedWidth ? leadIndex : buffer.byteLength;
}
function isUtf8ContinuationByte(value) {
    return (value & 0xc0) === 0x80;
}
function utf8SequenceWidth(value) {
    if ((value & 0x80) === 0)
        return 1;
    if (value >= 0xc2 && value <= 0xdf)
        return 2;
    if ((value & 0xf0) === 0xe0)
        return 3;
    if (value >= 0xf0 && value <= 0xf4)
        return 4;
    return 0;
}
async function checksumFileHandle(handle, expectedSizeBytes) {
    const hash = createHash("sha256");
    const buffer = Buffer.alloc(64 * 1024);
    let position = 0;
    while (true) {
        const { bytesRead } = await handle.read(buffer, 0, buffer.byteLength, position);
        if (bytesRead === 0)
            break;
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
async function openNoFollow(localPath) {
    try {
        return await fs.open(localPath, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW | fsConstants.O_NONBLOCK);
    }
    catch (error) {
        if (error.code === "ELOOP") {
            throw new VmCommandValidationError(`Workspace file read refuses symlinks: ${localPath}`);
        }
        throw error;
    }
}
async function realpathOpenFileHandle(handle) {
    try {
        return await fs.realpath(`/proc/self/fd/${handle.fd}`);
    }
    catch {
        return null;
    }
}
function sha256Buffer(value) {
    return createHash("sha256").update(value).digest("hex");
}
function isPathInside(basePath, targetPath) {
    const relative = path.relative(path.resolve(basePath), path.resolve(targetPath));
    return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
