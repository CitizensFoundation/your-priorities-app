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
export declare class BoundedFileLogSink implements CodexAppServerLogSink {
    readonly filePath: string;
    readonly maxBytes: number;
    private readonly trustedRootPath?;
    private bytesWritten;
    private truncated;
    private pending;
    private writeFailed;
    private parentReady;
    private handlePromise?;
    constructor(filePath: string, maxBytes?: number, trustedRootPath?: string | undefined);
    writeStderr(chunk: string): void;
    close(): Promise<void>;
    private appendBounded;
    private logHandle;
    private openLogHandle;
    private ensureParentDirectory;
}
export declare class StdioCodexAppServerTransport implements CodexAppServerTransport {
    private readonly child;
    private readonly pending;
    private readonly pendingServerRequests;
    private readonly notificationHandlers;
    private readonly exitHandlers;
    private readonly stderrHandlers;
    private readonly serverRequestMode;
    private readonly stderrLogSink?;
    private childError?;
    private exitPublished;
    private terminalError?;
    private nextId;
    constructor(options: CodexAppServerLaunchOptions & {
        command: string;
        args: string[];
        serverRequestMode?: CodexServerRequestMode;
    });
    request(method: string, params?: unknown): Promise<unknown>;
    notify(method: string, params?: unknown): void;
    onNotification(handler: (message: JsonRpcMessage) => void): void;
    onExit(handler: (exit: CodexAppServerExit) => void): void;
    onStderr(handler: (chunk: string) => void): void;
    respondToServerRequest(id: JsonRpcId, result?: unknown): void;
    rejectServerRequest(id: JsonRpcId, error: JsonRpcError): void;
    close(): Promise<void>;
    private handleLine;
    private publish;
    private publishExit;
    private publishStderr;
    private publishExitAfterStderrDrain;
    private write;
    private rejectUnsupportedServerRequest;
    private rejectUnconfiguredServerRequest;
    private rejectPending;
}
