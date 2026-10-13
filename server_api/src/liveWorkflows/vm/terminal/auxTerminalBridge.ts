import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import pty, { type IPty } from "node-pty";
import type {
  VmAuxTerminalAckPayload,
  VmAuxTerminalBacklogPayload,
  VmAuxTerminalChunkPayload,
  VmAuxTerminalClosedPayload,
  VmAuxTerminalOpenedPayload,
} from "../../contracts/index.js";
import type { DockerContainerSession } from "../docker/dockerRuntimeManager.js";

export type AuxTerminalBridgeOptions = {
  enabled?: boolean;
  shell?: string;
  backlogBytes?: number;
  allowedRootPath?: string;
  env?: NodeJS.ProcessEnv;
  now?: () => Date;
  terminalBackend?: AuxTerminalBackend;
};

export class AuxTerminalError extends Error {
  constructor(
    message: string,
    readonly statusCode = 400
  ) {
    super(message);
    this.name = "AuxTerminalError";
  }
}

export type AuxTerminalSpawnOptions = {
  command: string;
  args: string[];
  cwd: string;
  env: NodeJS.ProcessEnv;
  cols: number;
  rows: number;
};

export type AuxTerminalRuntime = "container" | "host";

export type AuxTerminalOpenTarget = {
  runtime: AuxTerminalRuntime;
  command: string;
  args: string[];
  displayCwd: string;
  shell: string;
  env?: NodeJS.ProcessEnv;
};

export interface AuxTerminalProcess {
  readonly pid: number;
  write(data: string): void;
  resize(cols: number, rows: number): void;
  kill(signal?: string): void;
  onData(handler: (data: string) => void): void;
  onExit(handler: (exit: { exitCode: number | null; signal?: string | number | null }) => void): void;
}

export interface AuxTerminalBackend {
  spawn(options: AuxTerminalSpawnOptions): AuxTerminalProcess;
}

type AuxTerminalRecord = {
  sessionId: string;
  terminalId: string;
  cwd: string;
  shell: string;
  runtime: AuxTerminalRuntime;
  pid: number;
  openedAt: string;
  cols: number;
  rows: number;
  terminal: AuxTerminalProcess;
  chunks: VmAuxTerminalChunkPayload[];
  chunkBytes: number;
  nextSeq: number;
  closed: boolean;
  exitCode: number | null;
  signal: string | null;
};

const DefaultBacklogBytes = 262144;
const DefaultCols = 120;
const DefaultRows = 32;

export class AuxTerminalBridge {
  readonly supportsAnsiScrollback = true;
  readonly enabled: boolean;

  private readonly shell: string;
  private readonly backlogBytes: number;
  private readonly allowedRootPath?: string;
  private readonly env: NodeJS.ProcessEnv;
  private readonly now: () => Date;
  private readonly terminalBackend: AuxTerminalBackend;
  private readonly terminals = new Map<string, AuxTerminalRecord>();
  private readonly activeTerminalBySession = new Map<string, string>();

  constructor(options: AuxTerminalBridgeOptions = {}) {
    this.enabled = options.enabled ?? false;
    this.shell = options.shell ?? defaultShell();
    this.backlogBytes = positiveInteger(options.backlogBytes, DefaultBacklogBytes);
    this.allowedRootPath = options.allowedRootPath;
    this.env = options.env ?? process.env;
    this.now = options.now ?? (() => new Date());
    this.terminalBackend = options.terminalBackend ?? new NodePtyTerminalBackend();
  }

  get preferredShell(): string {
    return this.shell;
  }

  async openTerminal(
    commandId: string,
    session: DockerContainerSession,
    options: { cols?: number; rows?: number; target?: AuxTerminalOpenTarget } = {}
  ): Promise<VmAuxTerminalOpenedPayload> {
    this.assertEnabled();

    const existing = this.activeTerminal(session.sessionId);

    if (existing) {
      return openedPayload(existing, commandId);
    }

    const hostCwd = await this.safeWorkspacePath(session);
    const target = options.target ?? this.hostTerminalTarget(session, hostCwd);
    const cols = positiveInteger(options.cols, DefaultCols);
    const rows = positiveInteger(options.rows, DefaultRows);
    const terminalProcess = this.terminalBackend.spawn({
      command: target.command,
      args: target.args,
      cwd: hostCwd,
      env: {
        ...this.env,
        TERM: "xterm-256color",
        ...(target.env ?? {}),
      },
      cols,
      rows,
    });
    const terminalId = randomUUID();
    const terminal: AuxTerminalRecord = {
      sessionId: session.sessionId,
      terminalId,
      cwd: target.displayCwd,
      shell: target.shell,
      runtime: target.runtime,
      pid: terminalProcess.pid,
      openedAt: this.now().toISOString(),
      cols,
      rows,
      terminal: terminalProcess,
      chunks: [],
      chunkBytes: 0,
      nextSeq: 0,
      closed: false,
      exitCode: null,
      signal: null,
    };

    terminalProcess.onData((data) => this.appendChunk(terminal, "stdout", data));
    terminalProcess.onExit((exit) => {
      terminal.closed = true;
      terminal.exitCode = exit.exitCode;
      terminal.signal = exit.signal === undefined || exit.signal === null ? null : String(exit.signal);
    });

    if (!terminalProcess.pid) {
      terminalProcess.kill("SIGTERM");
      throw new AuxTerminalError("Aux terminal shell did not start", 500);
    }

    this.terminals.set(terminalId, terminal);
    this.activeTerminalBySession.set(session.sessionId, terminalId);

    return openedPayload(terminal, commandId);
  }

  writeInput(commandId: string, sessionId: string, terminalId: string, data: string): VmAuxTerminalAckPayload {
    const terminal = this.requireTerminal(sessionId, terminalId);

    if (terminal.closed) {
      throw new AuxTerminalError(`Aux terminal is closed: ${terminalId}`, 400);
    }

    terminal.terminal.write(data);
    return {
      ok: true,
      commandId,
      sessionId,
      terminalId,
    };
  }

  resizeTerminal(
    commandId: string,
    sessionId: string,
    terminalId: string,
    cols: number,
    rows: number
  ): VmAuxTerminalAckPayload {
    const terminal = this.requireTerminal(sessionId, terminalId);
    terminal.cols = positiveInteger(cols, terminal.cols);
    terminal.rows = positiveInteger(rows, terminal.rows);
    terminal.terminal.resize(terminal.cols, terminal.rows);

    return {
      ok: true,
      commandId,
      sessionId,
      terminalId,
      cols: terminal.cols,
      rows: terminal.rows,
    };
  }

  closeTerminal(commandId: string, sessionId: string, terminalId: string): VmAuxTerminalClosedPayload {
    const terminal = this.requireTerminal(sessionId, terminalId);

    this.stopTerminal(terminal);

    return {
      ok: true,
      commandId,
      sessionId,
      terminalId,
      closed: terminal.closed,
      exitCode: terminal.exitCode,
      signal: terminal.signal,
    };
  }

  backlog(sessionId: string, terminalId: string): VmAuxTerminalBacklogPayload | null {
    const terminal = this.terminals.get(terminalId);

    if (!terminal || terminal.sessionId !== sessionId) {
      return null;
    }

    return {
      sessionId,
      terminalId,
      chunks: terminal.chunks.map((chunk) => ({ ...chunk })),
      closed: terminal.closed,
      exitCode: terminal.exitCode,
      signal: terminal.signal,
    };
  }

  closeSession(sessionId: string): void {
    for (const terminal of this.terminals.values()) {
      if (terminal.sessionId === sessionId) {
        this.stopTerminal(terminal);
      }
    }
  }

  async closeAll(): Promise<void> {
    for (const terminal of this.terminals.values()) {
      this.stopTerminal(terminal);
    }
  }

  private activeTerminal(sessionId: string): AuxTerminalRecord | null {
    const terminalId = this.activeTerminalBySession.get(sessionId);
    const terminal = terminalId ? this.terminals.get(terminalId) : undefined;

    if (!terminal || terminal.closed) {
      if (terminalId) {
        this.activeTerminalBySession.delete(sessionId);
      }

      return null;
    }

    return terminal;
  }

  private requireTerminal(sessionId: string, terminalId: string): AuxTerminalRecord {
    const terminal = this.terminals.get(terminalId);

    if (!terminal || terminal.sessionId !== sessionId) {
      throw new AuxTerminalError(`Aux terminal was not found: ${terminalId}`, 404);
    }

    return terminal;
  }

  private assertEnabled(): void {
    if (!this.enabled) {
      throw new AuxTerminalError("Aux terminal support is disabled", 400);
    }
  }

  private safeShell(): string {
    if (path.isAbsolute(this.shell) && !existsSync(this.shell)) {
      throw new AuxTerminalError(`Aux terminal shell does not exist: ${this.shell}`, 500);
    }

    return this.shell;
  }

  private hostTerminalTarget(session: DockerContainerSession, cwd: string): AuxTerminalOpenTarget {
    const shell = this.safeShell();

    return {
      runtime: "host",
      command: shell,
      args: [],
      displayCwd: cwd,
      shell,
      env: {
        TERM: "xterm-256color",
        YP_LIVE_WORKFLOW_SESSION_ID: session.sessionId,
        YP_LIVE_WORKFLOW_WORKSPACE_ROOT: session.rootPath,
      },
    };
  }

  private async safeWorkspacePath(session: DockerContainerSession): Promise<string> {
    const workspacePath = path.resolve(session.layout.workspacePath);
    const boundaryPath = path.resolve(this.allowedRootPath ?? session.layout.rootPath);
    const [realWorkspacePath, realBoundaryPath, realSessionRootPath] = await Promise.all([
      fs.realpath(workspacePath),
      fs.realpath(boundaryPath),
      fs.realpath(path.resolve(session.layout.rootPath)),
    ]);

    if (!isPathInside(realBoundaryPath, realWorkspacePath)) {
      throw new AuxTerminalError(`Aux terminal workspace path is outside the trusted VM workspace root: ${workspacePath}`, 400);
    }

    if (!isPathInside(realSessionRootPath, realWorkspacePath)) {
      throw new AuxTerminalError(`Aux terminal workspace path is outside the session root: ${workspacePath}`, 400);
    }

    return realWorkspacePath;
  }

  private appendChunk(terminal: AuxTerminalRecord, stream: "stdout" | "stderr", chunk: Buffer | string): void {
    const data = boundedChunk(String(chunk), this.backlogBytes);
    const entry: VmAuxTerminalChunkPayload = {
      sessionId: terminal.sessionId,
      terminalId: terminal.terminalId,
      seq: terminal.nextSeq,
      stream,
      data,
      ts: this.now().toISOString(),
    };

    terminal.nextSeq += 1;
    terminal.chunks.push(entry);
    terminal.chunkBytes += Buffer.byteLength(data, "utf8");

    while (terminal.chunkBytes > this.backlogBytes && terminal.chunks.length > 0) {
      const removed = terminal.chunks.shift();

      if (removed) {
        terminal.chunkBytes -= Buffer.byteLength(removed.data, "utf8");
      }
    }
  }

  private stopTerminal(terminal: AuxTerminalRecord): void {
    if (terminal.closed) {
      return;
    }

    terminal.closed = true;
    terminal.signal = "SIGHUP";

    terminal.terminal.kill("SIGHUP");
  }
}

class NodePtyTerminalBackend implements AuxTerminalBackend {
  spawn(options: AuxTerminalSpawnOptions): AuxTerminalProcess {
    const terminal = pty.spawn(options.command, options.args, {
      name: "xterm-256color",
      cols: options.cols,
      rows: options.rows,
      cwd: options.cwd,
      env: options.env,
    });

    return new NodePtyTerminalProcess(terminal);
  }
}

class NodePtyTerminalProcess implements AuxTerminalProcess {
  constructor(private readonly terminal: IPty) {}

  get pid(): number {
    return this.terminal.pid;
  }

  write(data: string): void {
    this.terminal.write(data);
  }

  resize(cols: number, rows: number): void {
    this.terminal.resize(cols, rows);
  }

  kill(signal?: string): void {
    this.terminal.kill(signal);
  }

  onData(handler: (data: string) => void): void {
    this.terminal.onData(handler);
  }

  onExit(handler: (exit: { exitCode: number | null; signal?: string | number | null }) => void): void {
    this.terminal.onExit(handler);
  }
}

function openedPayload(terminal: AuxTerminalRecord, commandId: string): VmAuxTerminalOpenedPayload {
  return {
    commandId,
    sessionId: terminal.sessionId,
    terminalId: terminal.terminalId,
    cwd: terminal.cwd,
    shell: terminal.shell,
    runtime: terminal.runtime,
    pid: terminal.pid,
    openedAt: terminal.openedAt,
    cols: terminal.cols,
    rows: terminal.rows,
    backlog: terminal.chunks.map((chunk) => ({ ...chunk })),
  };
}

function defaultShell(): string {
  if (existsSync("/bin/bash")) {
    return "/bin/bash";
  }

  if (existsSync("/bin/sh")) {
    return "/bin/sh";
  }

  return "sh";
}

function positiveInteger(value: number | undefined, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return Math.trunc(value);
}

function boundedChunk(value: string, maxBytes: number): string {
  if (Buffer.byteLength(value, "utf8") <= maxBytes) {
    return value;
  }

  return Buffer.from(value, "utf8").subarray(-maxBytes).toString("utf8");
}

function isPathInside(basePath: string, targetPath: string): boolean {
  const relative = path.relative(basePath, targetPath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
