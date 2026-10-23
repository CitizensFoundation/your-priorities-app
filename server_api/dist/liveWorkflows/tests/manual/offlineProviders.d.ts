import type { CodexAppServerTransport, JsonRpcMessage } from "../../vm/codex/appServerTransport.js";
import type { ProviderReply } from "../../modelGateway.js";
/** Rehearsal only. Unknown methods fail rather than accidentally reaching a provider. */
export declare class OfflineCodexTransport implements CodexAppServerTransport {
    private readonly scriptedTurn?;
    constructor(scriptedTurn?: (() => Promise<string>) | undefined);
    private listeners;
    private threadId;
    private turns;
    private timer?;
    request(method: string): Promise<unknown>;
    notify(): void;
    onNotification(listener: (message: JsonRpcMessage) => void): void;
    respondToServerRequest(): void;
    rejectServerRequest(): void;
    close(): Promise<void>;
}
export declare function offlineProcessing(_model: unknown, system: string, input: string): Promise<ProviderReply>;
