import { type VmCommand } from "../contracts/index.js";
import type WebSocket from "ws";
export type VmBrokerCommandDispatchInput = {
    vmHostId: string;
    messageType: VmCommand;
    commandId: string;
    data: unknown;
    sessionId?: string | null;
    expectedMessageTypes?: string[];
    timeoutMs?: number;
    now?: () => Date;
};
export type VmBrokerConnectionSnapshot = {
    vmHostId: string;
    connectionId: string;
    connectedAt: string;
    pendingCommandCount: number;
};
export declare const DefaultVmBrokerCommandTimeoutMs = 30000;
export declare class VmBrokerRegistry {
    private readonly connectionsByHost;
    private readonly connectionsById;
    bindConnection(input: {
        vmHostId: string;
        connectionId: string;
        socket: WebSocket;
        now?: () => Date;
    }): {
        supersededConnectionId?: string;
    };
    removeConnection(vmHostId: string, connectionId: string, socket?: WebSocket, reason?: string): boolean;
    isConnected(vmHostId: string): boolean;
    snapshot(vmHostId: string): VmBrokerConnectionSnapshot | null;
    dispatchCommand(input: VmBrokerCommandDispatchInput): Promise<unknown>;
    handleCommandFrame(connectionId: string, frame: unknown): boolean;
    private resolvePending;
    private rejectPending;
    private failConnection;
}
export declare function isVmBrokerDeliveryFailure(error: unknown): boolean;
