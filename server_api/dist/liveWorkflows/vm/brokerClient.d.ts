import { type Json, type VmSessionEventPayload } from "../contracts/index.js";
import type { VmCommandRouter } from "./commands/vmCommandRouter.js";
export type VmAgentBrokerClientOptions = {
    wsUrl: string;
    token: string;
    vmHostId: string;
    capabilities: Record<string, Json>;
    metadata?: Record<string, Json>;
    commandRouter: VmCommandRouter;
    reconnectMinMs?: number;
    reconnectMaxMs?: number;
    now?: () => Date;
    helloTimeoutMs?: number;
};
export declare class VmAgentBrokerClient {
    private readonly options;
    private readonly reconnectMinMs;
    private readonly reconnectMaxMs;
    private readonly now;
    private socket;
    private closed;
    private connected;
    private reconnectTimer;
    private reconnectSleepResolve;
    private loopPromise;
    private connectionId;
    constructor(options: VmAgentBrokerClientOptions);
    start(): void;
    close(): Promise<void>;
    isConnected(): boolean;
    sendSessionEvent(event: VmSessionEventPayload): Promise<void>;
    private runReconnectLoop;
    private connectUntilClosed;
    private handleMessage;
    private sleep;
}
