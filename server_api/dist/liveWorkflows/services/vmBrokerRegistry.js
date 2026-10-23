import { YP_LIVE_WORKFLOW_VM_PROTOCOL, VmBrokerCommandErrorEnvelopeSchema, } from "../contracts/index.js";
import { LiveWorkflowServiceError } from "./errors.js";
export const DefaultVmBrokerCommandTimeoutMs = 30000;
const WebSocketOpenReadyState = 1;
export class VmBrokerRegistry {
    constructor() {
        this.connectionsByHost = new Map();
        this.connectionsById = new Map();
    }
    bindConnection(input) {
        const existing = this.connectionsByHost.get(input.vmHostId);
        const now = input.now ?? (() => new Date());
        if (existing && existing.socket !== input.socket) {
            this.failConnection(existing, new LiveWorkflowServiceError("VM broker connection was superseded", 502, "vm_broker_connection_superseded", { vmHostId: input.vmHostId, connectionId: existing.connectionId }));
            safeClose(existing.socket, 4000, "VM broker connection superseded");
        }
        const connection = {
            vmHostId: input.vmHostId,
            connectionId: input.connectionId,
            socket: input.socket,
            connectedAt: now().toISOString(),
            pending: new Map(),
        };
        this.connectionsByHost.set(input.vmHostId, connection);
        this.connectionsById.set(input.connectionId, connection);
        return {
            supersededConnectionId: existing?.connectionId,
        };
    }
    removeConnection(vmHostId, connectionId, socket, reason = "VM broker connection closed") {
        const connection = this.connectionsByHost.get(vmHostId);
        if (!connection || connection.connectionId !== connectionId || (socket && connection.socket !== socket)) {
            return false;
        }
        this.failConnection(connection, new LiveWorkflowServiceError(reason, 502, "vm_broker_connection_closed", {
            vmHostId,
            connectionId,
        }));
        return true;
    }
    isConnected(vmHostId) {
        const connection = this.connectionsByHost.get(vmHostId);
        return Boolean(connection && connection.socket.readyState === WebSocketOpenReadyState);
    }
    snapshot(vmHostId) {
        const connection = this.connectionsByHost.get(vmHostId);
        if (!connection) {
            return null;
        }
        return {
            vmHostId,
            connectionId: connection.connectionId,
            connectedAt: connection.connectedAt,
            pendingCommandCount: connection.pending.size,
        };
    }
    async dispatchCommand(input) {
        const connection = this.connectionsByHost.get(input.vmHostId);
        if (!connection || connection.socket.readyState !== WebSocketOpenReadyState) {
            throw new LiveWorkflowServiceError("VM broker connection is not available", 503, "vm_broker_unavailable", {
                vmHostId: input.vmHostId,
            });
        }
        if (connection.pending.has(input.commandId)) {
            throw new LiveWorkflowServiceError("VM broker command is already pending", 409, "vm_broker_command_pending", {
                vmHostId: input.vmHostId,
                commandId: input.commandId,
            });
        }
        const now = input.now ?? (() => new Date());
        const timeoutMs = input.timeoutMs ?? DefaultVmBrokerCommandTimeoutMs;
        const envelope = {
            protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
            messageType: input.messageType,
            commandId: input.commandId,
            ts: now().toISOString(),
            data: input.data,
        };
        return await new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                connection.pending.delete(input.commandId);
                reject(new LiveWorkflowServiceError("VM broker command timed out", 504, "vm_broker_command_timeout", {
                    vmHostId: input.vmHostId,
                    commandId: input.commandId,
                    messageType: input.messageType,
                }));
            }, timeoutMs);
            connection.pending.set(input.commandId, {
                commandId: input.commandId,
                messageType: input.messageType,
                sessionId: input.sessionId,
                expectedMessageTypes: input.expectedMessageTypes
                    ? new Set(input.expectedMessageTypes)
                    : undefined,
                timer,
                resolve,
                reject,
            });
            connection.socket.send(JSON.stringify(envelope), (error) => {
                if (!error) {
                    return;
                }
                const pending = connection.pending.get(input.commandId);
                if (pending) {
                    clearTimeout(pending.timer);
                    connection.pending.delete(input.commandId);
                }
                reject(new LiveWorkflowServiceError("VM broker command could not be delivered", 502, "vm_broker_command_send_failed", {
                    vmHostId: input.vmHostId,
                    commandId: input.commandId,
                    message: error.message,
                }));
            });
        });
    }
    handleCommandFrame(connectionId, frame) {
        const connection = this.connectionsById.get(connectionId);
        if (!connection) {
            return false;
        }
        const errorEnvelope = VmBrokerCommandErrorEnvelopeSchema.safeParse(frame);
        if (errorEnvelope.success) {
            const pending = connection.pending.get(errorEnvelope.data.commandId);
            if (!pending) {
                return true;
            }
            if (errorEnvelope.data.data.commandId !== pending.commandId ||
                errorEnvelope.data.data.messageType !== pending.messageType ||
                !sessionIdMatches(pending.sessionId, errorEnvelope.data.data.sessionId)) {
                this.rejectPending(connection, pending, new LiveWorkflowServiceError("VM broker command error did not match pending command", 502, "vm_broker_command_invalid_response", {
                    commandId: pending.commandId,
                    messageType: pending.messageType,
                }));
                return true;
            }
            this.rejectPending(connection, pending, new LiveWorkflowServiceError(errorEnvelope.data.data.message, 502, "vm_broker_command_error", {
                commandId: pending.commandId,
                messageType: pending.messageType,
                vmCode: errorEnvelope.data.data.code,
                code: errorEnvelope.data.data.code,
                details: errorEnvelope.data.data.details,
            }));
            return true;
        }
        const commandId = stringField(frame, "commandId");
        if (!commandId) {
            return false;
        }
        const pending = connection.pending.get(commandId);
        if (!pending) {
            return true;
        }
        const messageType = stringField(frame, "messageType");
        const data = recordField(frame, "data");
        const sessionId = data ? stringField(data, "sessionId") : null;
        if ((pending.expectedMessageTypes && (!messageType || !pending.expectedMessageTypes.has(messageType))) ||
            !sessionIdMatches(pending.sessionId, sessionId)) {
            this.rejectPending(connection, pending, new LiveWorkflowServiceError("VM broker command response did not match pending command", 502, "vm_broker_command_invalid_response", {
                commandId,
                expectedMessageTypes: [...(pending.expectedMessageTypes ?? [])],
                receivedMessageType: messageType,
                expectedSessionId: pending.sessionId ?? null,
                receivedSessionId: sessionId,
            }));
            return true;
        }
        this.resolvePending(connection, pending, frame);
        return true;
    }
    resolvePending(connection, pending, value) {
        clearTimeout(pending.timer);
        connection.pending.delete(pending.commandId);
        pending.resolve(value);
    }
    rejectPending(connection, pending, error) {
        clearTimeout(pending.timer);
        connection.pending.delete(pending.commandId);
        pending.reject(error);
    }
    failConnection(connection, error) {
        this.connectionsByHost.delete(connection.vmHostId);
        this.connectionsById.delete(connection.connectionId);
        for (const pending of connection.pending.values()) {
            clearTimeout(pending.timer);
            pending.reject(error);
        }
        connection.pending.clear();
    }
}
export function isVmBrokerDeliveryFailure(error) {
    return error instanceof LiveWorkflowServiceError && [
        "vm_broker_unavailable",
        "vm_broker_command_timeout",
        "vm_broker_command_send_failed",
        "vm_broker_connection_closed",
        "vm_broker_connection_superseded",
    ].includes(error.code);
}
function safeClose(socket, code, reason) {
    try {
        socket.close(code, reason);
    }
    catch {
        try {
            socket.terminate();
        }
        catch {
            // best effort cleanup
        }
    }
}
function sessionIdMatches(expected, received) {
    return !expected || !received || expected === received;
}
function recordField(value, field) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return null;
    }
    const candidate = value[field];
    return candidate && typeof candidate === "object" && !Array.isArray(candidate)
        ? candidate
        : null;
}
function stringField(value, field) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return null;
    }
    const candidate = value[field];
    return typeof candidate === "string" && candidate.length > 0 ? candidate : null;
}
