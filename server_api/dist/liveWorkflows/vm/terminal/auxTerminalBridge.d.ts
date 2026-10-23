import type { VmAuxTerminalAckPayload, VmAuxTerminalBacklogPayload, VmAuxTerminalClosedPayload, VmAuxTerminalOpenedPayload } from "../../contracts/index.js";
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
export declare class AuxTerminalError extends Error {
    readonly statusCode: number;
    constructor(message: string, statusCode?: number);
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
    onExit(handler: (exit: {
        exitCode: number | null;
        signal?: string | number | null;
    }) => void): void;
}
export interface AuxTerminalBackend {
    spawn(options: AuxTerminalSpawnOptions): AuxTerminalProcess;
}
export declare class AuxTerminalBridge {
    readonly supportsAnsiScrollback = true;
    readonly enabled: boolean;
    private readonly shell;
    private readonly backlogBytes;
    private readonly allowedRootPath?;
    private readonly env;
    private readonly now;
    private readonly terminalBackend;
    private readonly terminals;
    private readonly activeTerminalBySession;
    constructor(options?: AuxTerminalBridgeOptions);
    get preferredShell(): string;
    openTerminal(commandId: string, session: DockerContainerSession, options?: {
        cols?: number;
        rows?: number;
        target?: AuxTerminalOpenTarget;
    }): Promise<VmAuxTerminalOpenedPayload>;
    writeInput(commandId: string, sessionId: string, terminalId: string, data: string): VmAuxTerminalAckPayload;
    resizeTerminal(commandId: string, sessionId: string, terminalId: string, cols: number, rows: number): VmAuxTerminalAckPayload;
    closeTerminal(commandId: string, sessionId: string, terminalId: string): VmAuxTerminalClosedPayload;
    backlog(sessionId: string, terminalId: string): VmAuxTerminalBacklogPayload | null;
    closeSession(sessionId: string): void;
    closeAll(): Promise<void>;
    private activeTerminal;
    private requireTerminal;
    private assertEnabled;
    private safeShell;
    private hostTerminalTarget;
    private safeWorkspacePath;
    private appendChunk;
    private stopTerminal;
}
