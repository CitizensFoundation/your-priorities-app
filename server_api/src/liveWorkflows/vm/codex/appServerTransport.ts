import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { constants as fsConstants } from "node:fs";
import fs, { type FileHandle } from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import type { Writable } from "node:stream";

export type JsonRpcId = string | number;

export type JsonRpcError = {
  code: number;
  message: string;
  data?: unknown;
};

export type JsonRpcMessage = {
  id?: JsonRpcId;
  method?: string;
  params?: unknown;
  result?: unknown;
  error?: JsonRpcError;
};

export type CodexAppServerExit = {
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  error?: string | null;
};

export type CodexAppServerLaunchOptions = {
  cwd: string;
  codexHomePath: string;
  env: NodeJS.ProcessEnv;
  stderrLogSink?: CodexAppServerLogSink;
};

export type CodexServerRequestMode = "reject" | "defer";

export interface CodexAppServerLogSink {
  writeStderr(chunk: string): void;
  close?(): Promise<void>;
}

export interface CodexAppServerTransport {
  request(method: string, params?: unknown): Promise<unknown>;
  notify(method: string, params?: unknown): void;
  onNotification(handler: (message: JsonRpcMessage) => void): void;
  onExit?(handler: (exit: CodexAppServerExit) => void): void;
  onStderr?(handler: (chunk: string) => void): void;
  respondToServerRequest(id: JsonRpcId, result?: unknown): void;
  rejectServerRequest(id: JsonRpcId, error: JsonRpcError): void;
  close(): Promise<void>;
}

export type CodexAppServerTransportFactory = (options: CodexAppServerLaunchOptions) => CodexAppServerTransport;

export class BoundedFileLogSink implements CodexAppServerLogSink {
  private bytesWritten = 0;
  private truncated = false;
  private pending = Promise.resolve();
  private writeFailed = false;
  private parentReady = false;
  private handlePromise?: Promise<FileHandle>;

  constructor(
    readonly filePath: string,
    readonly maxBytes = 5 * 1024 * 1024,
    private readonly trustedRootPath?: string
  ) {}

  writeStderr(chunk: string): void {
    if (!chunk || this.truncated || this.maxBytes <= 0) {
      return;
    }

    const content = Buffer.from(chunk);
    this.pending = this.pending
      .then(() => this.appendBounded(content))
      .catch((error: unknown) => {
        if (!this.writeFailed) {
          this.writeFailed = true;
          console.error("Failed to write Codex app-server stderr log", error);
        }
      });
  }

  async close(): Promise<void> {
    await this.pending.catch(() => undefined);
    const handle = await this.handlePromise?.catch(() => undefined);
    await handle?.close().catch(() => undefined);
  }

  private async appendBounded(content: Buffer): Promise<void> {
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

  private async logHandle(): Promise<FileHandle> {
    this.handlePromise ??= this.openLogHandle();
    return this.handlePromise;
  }

  private async openLogHandle(): Promise<FileHandle> {
    await this.ensureParentDirectory();

    try {
      return await fs.open(
        this.filePath,
        fsConstants.O_WRONLY | fsConstants.O_CREAT | fsConstants.O_APPEND | fsConstants.O_NOFOLLOW,
        0o600
      );
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ELOOP") {
        throw new Error(`Codex app-server stderr log refuses symlinks: ${this.filePath}`);
      }

      throw error;
    }
  }

  private async ensureParentDirectory(): Promise<void> {
    if (this.parentReady) {
      return;
    }

    const parentPath = path.dirname(path.resolve(this.filePath));

    if (this.trustedRootPath) {
      await ensureSafeDirectoryUnderRoot(this.trustedRootPath, parentPath);
    } else {
      await fs.mkdir(parentPath, { recursive: true });
      await assertSafeDirectory(parentPath);
    }

    this.parentReady = true;
  }
}

export class StdioCodexAppServerTransport implements CodexAppServerTransport {
  private readonly child: ChildProcessWithoutNullStreams;
  private readonly pending = new Map<JsonRpcId, { resolve(value: unknown): void; reject(error: Error): void }>();
  private readonly pendingServerRequests = new Set<JsonRpcId>();
  private readonly notificationHandlers = new Set<(message: JsonRpcMessage) => void>();
  private readonly exitHandlers = new Set<(exit: CodexAppServerExit) => void>();
  private readonly stderrHandlers = new Set<(chunk: string) => void>();
  private readonly serverRequestMode: CodexServerRequestMode;
  private readonly stderrLogSink?: CodexAppServerLogSink;
  private childError?: Error;
  private exitPublished = false;
  private terminalError?: Error;
  private nextId = 1;

  constructor(
    options: CodexAppServerLaunchOptions & {
      command: string;
      args: string[];
      serverRequestMode?: CodexServerRequestMode;
    }
  ) {
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
    this.child.stderr.on("data", (chunk: string) => {
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

  request(method: string, params?: unknown): Promise<unknown> {
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

  notify(method: string, params?: unknown): void {
    this.write(this.child.stdin, {
      method,
      ...(params !== undefined ? { params } : {}),
    });
  }

  onNotification(handler: (message: JsonRpcMessage) => void): void {
    this.notificationHandlers.add(handler);
  }

  onExit(handler: (exit: CodexAppServerExit) => void): void {
    this.exitHandlers.add(handler);
  }

  onStderr(handler: (chunk: string) => void): void {
    this.stderrHandlers.add(handler);
  }

  respondToServerRequest(id: JsonRpcId, result: unknown = null): void {
    if (!this.pendingServerRequests.delete(id)) {
      if (this.terminalError) {
        throw this.terminalError;
      }

      throw new Error(`Codex app-server request is not pending: ${String(id)}`);
    }

    this.write(this.child.stdin, { id, result });
  }

  rejectServerRequest(id: JsonRpcId, error: JsonRpcError): void {
    if (!this.pendingServerRequests.delete(id)) {
      if (this.terminalError) {
        throw this.terminalError;
      }

      throw new Error(`Codex app-server request is not pending: ${String(id)}`);
    }

    this.write(this.child.stdin, { id, error });
  }

  async close(): Promise<void> {
    if (!this.child.killed) {
      this.child.kill("SIGTERM");
    }

    await this.stderrLogSink?.close?.();
  }

  private handleLine(line: string): void {
    if (line.trim().length === 0) {
      return;
    }

    let message: JsonRpcMessage;
    try {
      message = JSON.parse(line) as JsonRpcMessage;
    } catch {
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
      } else {
        pending.resolve(message.result);
      }
      return;
    }

    if (message.id !== undefined && message.method) {
      if (isDeferredServerRequestMethod(message.method)) {
        if (this.serverRequestMode === "defer") {
          this.pendingServerRequests.add(message.id);
          this.publish(message);
        } else {
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

  private publish(message: JsonRpcMessage): void {
    for (const handler of this.notificationHandlers) {
      handler(message);
    }
  }

  private publishExit(exit: CodexAppServerExit): void {
    if (this.exitPublished) {
      return;
    }

    this.exitPublished = true;
    for (const handler of this.exitHandlers) {
      handler(exit);
    }
  }

  private publishStderr(chunk: string): void {
    for (const handler of this.stderrHandlers) {
      handler(chunk);
    }
  }

  private async publishExitAfterStderrDrain(exit: CodexAppServerExit): Promise<void> {
    await this.stderrLogSink?.close?.().catch((error: unknown) => {
      console.error("Failed to close Codex app-server stderr log", error);
    });
    this.publishExit(exit);
  }

  private write(stdin: Writable, message: JsonRpcMessage): void {
    stdin.write(`${JSON.stringify(message)}\n`);
  }

  private rejectUnsupportedServerRequest(message: JsonRpcMessage): void {
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

  private rejectUnconfiguredServerRequest(message: JsonRpcMessage): void {
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

  private rejectPending(error: Error): void {
    this.terminalError = error;
    for (const pending of this.pending.values()) {
      pending.reject(error);
    }
    this.pending.clear();
    this.pendingServerRequests.clear();
  }
}

function isDeferredServerRequestMethod(method: string): boolean {
  return (
    method === "item/commandExecution/requestApproval" ||
    method === "item/fileChange/requestApproval" ||
    method === "item/permissions/requestApproval" ||
    method === "item/tool/requestUserInput"
  );
}

async function ensureSafeDirectoryUnderRoot(rootPath: string, targetPath: string): Promise<void> {
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

async function assertSafeDirectory(targetPath: string): Promise<void> {
  const stat = await fs.lstat(targetPath);

  if (stat.isSymbolicLink() || !stat.isDirectory()) {
    throw new Error(`Codex app-server stderr log refuses unsafe directories: ${targetPath}`);
  }
}

async function lstatOrNull(targetPath: string) {
  try {
    return await fs.lstat(targetPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

function isPathInside(basePath: string, targetPath: string): boolean {
  const relative = path.relative(path.resolve(basePath), path.resolve(targetPath));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
