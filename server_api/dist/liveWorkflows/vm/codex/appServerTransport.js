import { spawn } from "node:child_process";
import { constants as fsConstants } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
export class BoundedFileLogSink {
    constructor(filePath, maxBytes = 5 * 1024 * 1024, trustedRootPath) {
        this.filePath = filePath;
        this.maxBytes = maxBytes;
        this.trustedRootPath = trustedRootPath;
        this.bytesWritten = 0;
        this.truncated = false;
        this.pending = Promise.resolve();
        this.writeFailed = false;
        this.parentReady = false;
    }
    writeStderr(chunk) {
        if (!chunk || this.truncated || this.maxBytes <= 0) {
            return;
        }
        const content = Buffer.from(chunk);
        this.pending = this.pending
            .then(() => this.appendBounded(content))
            .catch((error) => {
            if (!this.writeFailed) {
                this.writeFailed = true;
                console.error("Failed to write Codex app-server stderr log", error);
            }
        });
    }
    async close() {
        await this.pending.catch(() => undefined);
        const handle = await this.handlePromise?.catch(() => undefined);
        await handle?.close().catch(() => undefined);
    }
    async appendBounded(content) {
        const remaining = this.maxBytes - this.bytesWritten;
        if (remaining <= 0) {
            this.truncated = true;
            return;
        }
        let nextContent = content;
        if (content.length > remaining) {
            const marker = Buffer.from("\n[yp-live-workflow] Codex app-server stderr log truncated\n");
            const contentLimit = Math.max(0, remaining - marker.length);
            nextContent = Buffer.concat([
                content.subarray(0, contentLimit),
                marker.subarray(0, remaining - contentLimit),
            ]);
            this.truncated = true;
        }
        const handle = await this.logHandle();
        await handle.writeFile(nextContent);
        this.bytesWritten += nextContent.length;
    }
    async logHandle() {
        this.handlePromise ?? (this.handlePromise = this.openLogHandle());
        return this.handlePromise;
    }
    async openLogHandle() {
        await this.ensureParentDirectory();
        try {
            return await fs.open(this.filePath, fsConstants.O_WRONLY | fsConstants.O_CREAT | fsConstants.O_APPEND | fsConstants.O_NOFOLLOW, 0o600);
        }
        catch (error) {
            if (error.code === "ELOOP") {
                throw new Error(`Codex app-server stderr log refuses symlinks: ${this.filePath}`);
            }
            throw error;
        }
    }
    async ensureParentDirectory() {
        if (this.parentReady) {
            return;
        }
        const parentPath = path.dirname(path.resolve(this.filePath));
        if (this.trustedRootPath) {
            await ensureSafeDirectoryUnderRoot(this.trustedRootPath, parentPath);
        }
        else {
            await fs.mkdir(parentPath, { recursive: true });
            await assertSafeDirectory(parentPath);
        }
        this.parentReady = true;
    }
}
export class StdioCodexAppServerTransport {
    constructor(options) {
        this.pending = new Map();
        this.pendingServerRequests = new Set();
        this.notificationHandlers = new Set();
        this.exitHandlers = new Set();
        this.stderrHandlers = new Set();
        this.exitPublished = false;
        this.nextId = 1;
        this.serverRequestMode = options.serverRequestMode ?? "defer";
        this.stderrLogSink = options.stderrLogSink;
        this.child = spawn(options.command, options.args, {
            cwd: options.cwd,
            env: options.env,
            stdio: ["pipe", "pipe", "pipe"],
        });
        const lines = readline.createInterface({ input: this.child.stdout });
        lines.on("line", (line) => this.handleLine(line));
        this.child.stderr.setEncoding("utf8");
        this.child.stderr.on("data", (chunk) => {
            this.stderrLogSink?.writeStderr(chunk);
            this.publishStderr(chunk);
            if (chunk.trim().length > 0) {
                console.error(`[codex app-server stderr] ${chunk.trimEnd()}`);
            }
        });
        this.child.once("error", (error) => {
            this.childError = error;
            this.rejectPending(error);
        });
        this.child.once("close", (code, signal) => {
            const childError = this.childError;
            if (!childError) {
                this.rejectPending(new Error(`Codex app-server exited (${signal ?? code ?? "unknown"})`));
            }
            void this.publishExitAfterStderrDrain({
                exitCode: code,
                signal,
                error: childError?.message ?? null,
            });
        });
    }
    request(method, params) {
        const id = this.nextId;
        this.nextId += 1;
        this.write(this.child.stdin, {
            id,
            method,
            ...(params !== undefined ? { params } : {}),
        });
        return new Promise((resolve, reject) => {
            this.pending.set(id, { resolve, reject });
        });
    }
    notify(method, params) {
        this.write(this.child.stdin, {
            method,
            ...(params !== undefined ? { params } : {}),
        });
    }
    onNotification(handler) {
        this.notificationHandlers.add(handler);
    }
    onExit(handler) {
        this.exitHandlers.add(handler);
    }
    onStderr(handler) {
        this.stderrHandlers.add(handler);
    }
    respondToServerRequest(id, result = null) {
        if (!this.pendingServerRequests.delete(id)) {
            if (this.terminalError) {
                throw this.terminalError;
            }
            throw new Error(`Codex app-server request is not pending: ${String(id)}`);
        }
        this.write(this.child.stdin, { id, result });
    }
    rejectServerRequest(id, error) {
        if (!this.pendingServerRequests.delete(id)) {
            if (this.terminalError) {
                throw this.terminalError;
            }
            throw new Error(`Codex app-server request is not pending: ${String(id)}`);
        }
        this.write(this.child.stdin, { id, error });
    }
    async close() {
        if (!this.child.killed) {
            this.child.kill("SIGTERM");
        }
        await this.stderrLogSink?.close?.();
    }
    handleLine(line) {
        if (line.trim().length === 0) {
            return;
        }
        let message;
        try {
            message = JSON.parse(line);
        }
        catch {
            return;
        }
        if (message.id !== undefined && (message.result !== undefined || message.error !== undefined)) {
            const pending = this.pending.get(message.id);
            this.pending.delete(message.id);
            if (!pending) {
                return;
            }
            if (message.error) {
                pending.reject(new Error(message.error.message));
            }
            else {
                pending.resolve(message.result);
            }
            return;
        }
        if (message.id !== undefined && message.method) {
            if (isDeferredServerRequestMethod(message.method)) {
                if (this.serverRequestMode === "defer") {
                    this.pendingServerRequests.add(message.id);
                    this.publish(message);
                }
                else {
                    this.rejectUnconfiguredServerRequest(message);
                    this.publish(message);
                }
                return;
            }
            this.rejectUnsupportedServerRequest(message);
            this.publish(message);
            return;
        }
        this.publish(message);
    }
    publish(message) {
        for (const handler of this.notificationHandlers) {
            handler(message);
        }
    }
    publishExit(exit) {
        if (this.exitPublished) {
            return;
        }
        this.exitPublished = true;
        for (const handler of this.exitHandlers) {
            handler(exit);
        }
    }
    publishStderr(chunk) {
        for (const handler of this.stderrHandlers) {
            handler(chunk);
        }
    }
    async publishExitAfterStderrDrain(exit) {
        await this.stderrLogSink?.close?.().catch((error) => {
            console.error("Failed to close Codex app-server stderr log", error);
        });
        this.publishExit(exit);
    }
    write(stdin, message) {
        stdin.write(`${JSON.stringify(message)}\n`);
    }
    rejectUnsupportedServerRequest(message) {
        if (message.id === undefined) {
            return;
        }
        this.write(this.child.stdin, {
            id: message.id,
            error: {
                code: -32601,
                message: "LiveWorkflow VM agent has not implemented this Codex app-server callback yet",
            },
        });
    }
    rejectUnconfiguredServerRequest(message) {
        if (message.id === undefined) {
            return;
        }
        this.write(this.child.stdin, {
            id: message.id,
            error: {
                code: -32000,
                message: "LiveWorkflow VM agent approval responder is not configured",
            },
        });
    }
    rejectPending(error) {
        this.terminalError = error;
        for (const pending of this.pending.values()) {
            pending.reject(error);
        }
        this.pending.clear();
        this.pendingServerRequests.clear();
    }
}
function isDeferredServerRequestMethod(method) {
    return (method === "item/commandExecution/requestApproval" ||
        method === "item/fileChange/requestApproval" ||
        method === "item/permissions/requestApproval" ||
        method === "item/tool/requestUserInput");
}
async function ensureSafeDirectoryUnderRoot(rootPath, targetPath) {
    const root = path.resolve(rootPath);
    const target = path.resolve(targetPath);
    if (!isPathInside(root, target)) {
        throw new Error(`Codex app-server stderr log directory is outside the trusted root: ${target}`);
    }
    await assertSafeDirectory(root);
    const relative = path.relative(root, target);
    if (!relative) {
        return;
    }
    let current = root;
    for (const segment of relative.split(path.sep)) {
        if (!segment || segment === "." || segment === "..") {
            throw new Error(`Codex app-server stderr log directory is unsafe: ${target}`);
        }
        current = path.join(current, segment);
        const stat = await lstatOrNull(current);
        if (!stat) {
            await fs.mkdir(current, { mode: 0o700 });
            continue;
        }
        if (stat.isSymbolicLink() || !stat.isDirectory()) {
            throw new Error(`Codex app-server stderr log refuses unsafe directories: ${current}`);
        }
    }
}
async function assertSafeDirectory(targetPath) {
    const stat = await fs.lstat(targetPath);
    if (stat.isSymbolicLink() || !stat.isDirectory()) {
        throw new Error(`Codex app-server stderr log refuses unsafe directories: ${targetPath}`);
    }
}
async function lstatOrNull(targetPath) {
    try {
        return await fs.lstat(targetPath);
    }
    catch (error) {
        if (error.code === "ENOENT") {
            return null;
        }
        throw error;
    }
}
function isPathInside(basePath, targetPath) {
    const relative = path.relative(path.resolve(basePath), path.resolve(targetPath));
    return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
