import { YP_LIVE_WORKFLOW_VM_PROTOCOL, VmBrokerCommandErrorEnvelopeSchema, VmBrokerHelloAckEnvelopeSchema, VmBrokerHelloEnvelopeSchema, isVmCommand, } from "../contracts/index.js";
import WebSocket from "ws";
const DefaultReconnectMinMs = 1000;
const DefaultReconnectMaxMs = 30000;
const DefaultHelloTimeoutMs = 5000;
export class VmAgentBrokerClient {
    constructor(options) {
        this.options = options;
        this.closed = true;
        this.connected = false;
        this.reconnectMinMs = options.reconnectMinMs ?? DefaultReconnectMinMs;
        this.reconnectMaxMs = options.reconnectMaxMs ?? DefaultReconnectMaxMs;
        this.now = options.now ?? (() => new Date());
    }
    start() {
        if (this.loopPromise) {
            return;
        }
        this.closed = false;
        this.loopPromise = this.runReconnectLoop();
    }
    async close() {
        this.closed = true;
        this.connected = false;
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = undefined;
        }
        this.reconnectSleepResolve?.();
        this.reconnectSleepResolve = undefined;
        const socket = this.socket;
        this.socket = undefined;
        if (socket && socket.readyState === WebSocket.OPEN) {
            await new Promise((resolve) => {
                socket.once("close", () => resolve());
                socket.close(1000, "VM agent broker client closed");
                setTimeout(resolve, 1000);
            });
        }
        else {
            socket?.terminate();
        }
        await this.loopPromise?.catch(() => undefined);
        this.loopPromise = undefined;
    }
    isConnected() {
        return this.connected && this.socket?.readyState === WebSocket.OPEN;
    }
    async sendSessionEvent(event) {
        if (!this.isConnected() || !this.socket) {
            throw new Error("VM broker websocket is not connected");
        }
        await sendJson(this.socket, {
            protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
            messageType: "session.event",
            ts: this.now().toISOString(),
            data: event,
        });
    }
    async runReconnectLoop() {
        let delayMs = this.reconnectMinMs;
        while (!this.closed) {
            try {
                await this.connectUntilClosed();
                delayMs = this.reconnectMinMs;
            }
            catch (error) {
                if (!this.closed) {
                    console.error("LiveWorkflow VM broker websocket connection failed", error);
                }
            }
            if (!this.closed) {
                await this.sleep(delayMs);
                delayMs = Math.min(delayMs * 2, this.reconnectMaxMs);
            }
        }
    }
    async connectUntilClosed() {
        const socket = new WebSocket(this.options.wsUrl, {
            headers: {
                authorization: `Bearer ${this.options.token}`,
            },
        });
        this.socket = socket;
        this.connected = false;
        await waitForOpen(socket);
        await sendJson(socket, VmBrokerHelloEnvelopeSchema.parse({
            protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
            messageType: "vm.broker.hello",
            ts: this.now().toISOString(),
            data: {
                vmHostId: this.options.vmHostId,
                connectionId: this.connectionId ?? null,
                capabilities: this.options.capabilities,
                metadata: this.options.metadata,
            },
        }));
        const ack = await readHelloAck(socket, this.options.helloTimeoutMs ?? DefaultHelloTimeoutMs);
        if (ack.data.vmHostId !== this.options.vmHostId) {
            throw new Error("VM broker hello ack returned a different vmHostId");
        }
        this.connectionId = ack.data.connectionId;
        this.connected = true;
        socket.on("message", (data) => {
            void this.handleMessage(socket, data.toString()).catch((error) => {
                console.error("LiveWorkflow VM broker command handling failed", error);
            });
        });
        await waitForClose(socket);
        if (this.socket === socket) {
            this.socket = undefined;
        }
        this.connected = false;
    }
    async handleMessage(socket, raw) {
        let decoded;
        try {
            decoded = JSON.parse(raw);
        }
        catch (error) {
            console.error("LiveWorkflow VM broker command was not JSON", error);
            return;
        }
        const record = isRecord(decoded) ? decoded : {};
        const protocol = record.protocol;
        const messageType = record.messageType;
        const commandId = record.commandId;
        if (protocol !== YP_LIVE_WORKFLOW_VM_PROTOCOL || typeof messageType !== "string" || !isVmCommand(messageType)) {
            return;
        }
        if (typeof commandId !== "string" || commandId.length === 0) {
            return;
        }
        try {
            const response = await this.options.commandRouter.dispatch(`/commands/${messageType}`, decoded, {
                now: this.now,
            });
            if (response === undefined) {
                throw new Error(`Unsupported VM command: ${messageType}`);
            }
            await sendJson(socket, response);
        }
        catch (error) {
            await sendJson(socket, commandErrorEnvelope(messageType, commandId, record.data, error, this.now));
        }
    }
    async sleep(delayMs) {
        await new Promise((resolve) => {
            this.reconnectSleepResolve = resolve;
            this.reconnectTimer = setTimeout(() => {
                this.reconnectTimer = undefined;
                this.reconnectSleepResolve = undefined;
                resolve();
            }, delayMs);
        });
    }
}
function commandErrorEnvelope(messageType, commandId, data, error, now) {
    const sessionId = isRecord(data) && typeof data.sessionId === "string" ? data.sessionId : undefined;
    return VmBrokerCommandErrorEnvelopeSchema.parse({
        ok: false,
        protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
        messageType: "vm.command.error",
        commandId,
        ts: now().toISOString(),
        data: {
            ok: false,
            commandId,
            messageType,
            sessionId,
            code: commandErrorCode(error),
            message: error instanceof Error ? error.message : "VM command failed",
            details: {},
        },
    });
}
function commandErrorCode(error) {
    if (error instanceof Error) {
        if (error.name === "ZodError") {
            return "vm_command_invalid";
        }
        if (error.name === "VmCommandDeduplicationError") {
            return "vm_command_duplicate";
        }
    }
    return "vm_command_failed";
}
async function readHelloAck(socket, timeoutMs) {
    return await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("VM broker hello ack timed out")), timeoutMs);
        socket.once("message", (data) => {
            clearTimeout(timer);
            try {
                resolve(VmBrokerHelloAckEnvelopeSchema.parse(JSON.parse(data.toString())));
            }
            catch (error) {
                reject(error);
            }
        });
        socket.once("close", (code, reason) => {
            clearTimeout(timer);
            const closeReason = reason.toString();
            reject(new Error(`VM broker websocket closed before hello ack (code ${code}${closeReason ? `: ${closeReason}` : ""})`));
        });
        socket.once("error", (error) => {
            clearTimeout(timer);
            reject(error);
        });
    });
}
async function waitForOpen(socket) {
    if (socket.readyState === WebSocket.OPEN) {
        return;
    }
    await new Promise((resolve, reject) => {
        socket.once("open", () => resolve());
        socket.once("error", reject);
        socket.once("close", () => reject(new Error("VM broker websocket closed before open")));
    });
}
async function waitForClose(socket) {
    if (socket.readyState === WebSocket.CLOSED) {
        return;
    }
    await new Promise((resolve) => {
        socket.once("close", () => resolve());
    });
}
async function sendJson(socket, value) {
    await new Promise((resolve, reject) => {
        socket.send(JSON.stringify(value), (error) => (error ? reject(error) : resolve()));
    });
}
function isRecord(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
