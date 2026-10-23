import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import pty from "node-pty";
export class AuxTerminalError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AuxTerminalError";
    }
}
const DefaultBacklogBytes = 262144;
const DefaultCols = 120;
const DefaultRows = 32;
export class AuxTerminalBridge {
    constructor(options = {}) {
        this.supportsAnsiScrollback = true;
        this.terminals = new Map();
        this.activeTerminalBySession = new Map();
        this.enabled = options.enabled ?? false;
        this.shell = options.shell ?? defaultShell();
        this.backlogBytes = positiveInteger(options.backlogBytes, DefaultBacklogBytes);
        this.allowedRootPath = options.allowedRootPath;
        this.env = options.env ?? process.env;
        this.now = options.now ?? (() => new Date());
        this.terminalBackend = options.terminalBackend ?? new NodePtyTerminalBackend();
    }
    get preferredShell() {
        return this.shell;
    }
    async openTerminal(commandId, session, options = {}) {
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
        const terminal = {
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
    writeInput(commandId, sessionId, terminalId, data) {
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
    resizeTerminal(commandId, sessionId, terminalId, cols, rows) {
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
    closeTerminal(commandId, sessionId, terminalId) {
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
    backlog(sessionId, terminalId) {
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
    closeSession(sessionId) {
        for (const terminal of this.terminals.values()) {
            if (terminal.sessionId === sessionId) {
                this.stopTerminal(terminal);
            }
        }
    }
    async closeAll() {
        for (const terminal of this.terminals.values()) {
            this.stopTerminal(terminal);
        }
    }
    activeTerminal(sessionId) {
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
    requireTerminal(sessionId, terminalId) {
        const terminal = this.terminals.get(terminalId);
        if (!terminal || terminal.sessionId !== sessionId) {
            throw new AuxTerminalError(`Aux terminal was not found: ${terminalId}`, 404);
        }
        return terminal;
    }
    assertEnabled() {
        if (!this.enabled) {
            throw new AuxTerminalError("Aux terminal support is disabled", 400);
        }
    }
    safeShell() {
        if (path.isAbsolute(this.shell) && !existsSync(this.shell)) {
            throw new AuxTerminalError(`Aux terminal shell does not exist: ${this.shell}`, 500);
        }
        return this.shell;
    }
    hostTerminalTarget(session, cwd) {
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
    async safeWorkspacePath(session) {
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
    appendChunk(terminal, stream, chunk) {
        const data = boundedChunk(String(chunk), this.backlogBytes);
        const entry = {
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
    stopTerminal(terminal) {
        if (terminal.closed) {
            return;
        }
        terminal.closed = true;
        terminal.signal = "SIGHUP";
        terminal.terminal.kill("SIGHUP");
    }
}
class NodePtyTerminalBackend {
    spawn(options) {
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
class NodePtyTerminalProcess {
    constructor(terminal) {
        this.terminal = terminal;
    }
    get pid() {
        return this.terminal.pid;
    }
    write(data) {
        this.terminal.write(data);
    }
    resize(cols, rows) {
        this.terminal.resize(cols, rows);
    }
    kill(signal) {
        this.terminal.kill(signal);
    }
    onData(handler) {
        this.terminal.onData(handler);
    }
    onExit(handler) {
        this.terminal.onExit(handler);
    }
}
function openedPayload(terminal, commandId) {
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
function defaultShell() {
    if (existsSync("/bin/bash")) {
        return "/bin/bash";
    }
    if (existsSync("/bin/sh")) {
        return "/bin/sh";
    }
    return "sh";
}
function positiveInteger(value, fallback) {
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
        return fallback;
    }
    return Math.trunc(value);
}
function boundedChunk(value, maxBytes) {
    if (Buffer.byteLength(value, "utf8") <= maxBytes) {
        return value;
    }
    return Buffer.from(value, "utf8").subarray(-maxBytes).toString("utf8");
}
function isPathInside(basePath, targetPath) {
    const relative = path.relative(basePath, targetPath);
    return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
