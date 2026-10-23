import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";
import { YP_LIVE_WORKFLOW_VM_PROTOCOL, } from "../../../contracts/index.js";
import { WebSocketServer } from "ws";
import { VmAgentBrokerClient } from "../../brokerClient.js";
import { VmCommandRouter } from "../../commands/vmCommandRouter.js";
const VmHostId = "vm-host-id";
const SessionId = "session-id";
test("VM broker client sends hello dispatches commands and returns acknowledgements", async () => {
    await withBrokerServer(async ({ wsUrl, messages, send }) => {
        const router = new VmCommandRouter([new AckHandler()]);
        const client = new VmAgentBrokerClient({
            wsUrl,
            token: "secret",
            vmHostId: VmHostId,
            capabilities: { codexAppServer: true },
            metadata: { runtime: "test" },
            commandRouter: router,
            reconnectMinMs: 10000,
            reconnectMaxMs: 10000,
            now: () => new Date("2026-05-18T12:00:00.000Z"),
        });
        try {
            client.start();
            await waitFor(() => messages.some((message) => message.messageType === "vm.broker.hello"));
            await waitFor(() => client.isConnected());
            send({
                protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
                messageType: "session.interrupt",
                commandId: "command-1",
                ts: "2026-05-18T12:00:01.000Z",
                data: {
                    commandId: "command-1",
                    sessionId: SessionId,
                    codexThreadId: "thread-1",
                    codexTurnId: "turn-1",
                },
            });
            await waitFor(() => messages.some((message) => message.commandId === "command-1" && message.messageType === "session.interrupt"));
            const response = messages.find((message) => message.commandId === "command-1" && message.messageType === "session.interrupt");
            assert.equal((response?.data).sessionId, SessionId);
        }
        finally {
            await client.close().catch(() => undefined);
        }
    });
});
test("VM broker client returns command error envelopes on handler failure", async () => {
    await withBrokerServer(async ({ wsUrl, messages, send }) => {
        const router = new VmCommandRouter([new FailingHandler()]);
        const client = new VmAgentBrokerClient({
            wsUrl,
            token: "secret",
            vmHostId: VmHostId,
            capabilities: { codexAppServer: true },
            commandRouter: router,
            reconnectMinMs: 10000,
            reconnectMaxMs: 10000,
        });
        client.start();
        await waitFor(() => messages.some((message) => message.messageType === "vm.broker.hello"));
        await waitFor(() => client.isConnected());
        send({
            protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
            messageType: "session.interrupt",
            commandId: "command-2",
            ts: "2026-05-18T12:00:01.000Z",
            data: {
                commandId: "command-2",
                sessionId: SessionId,
                codexThreadId: "thread-1",
                codexTurnId: "turn-1",
            },
        });
        await waitFor(() => messages.some((message) => message.commandId === "command-2" && message.messageType === "vm.command.error"));
        const response = messages.find((message) => message.commandId === "command-2" && message.messageType === "vm.command.error");
        assert.equal((response?.data).code, "vm_command_failed");
        await client.close();
    });
});
test("VM broker client streams session events after hello ack", async () => {
    await withBrokerServer(async ({ wsUrl, messages }) => {
        const client = new VmAgentBrokerClient({
            wsUrl,
            token: "secret",
            vmHostId: VmHostId,
            capabilities: { codexAppServer: true },
            commandRouter: new VmCommandRouter(),
            reconnectMinMs: 10000,
            reconnectMaxMs: 10000,
        });
        client.start();
        await waitFor(() => client.isConnected());
        await client.sendSessionEvent(sessionEvent(7));
        await waitFor(() => messages.some((message) => message.messageType === "session.event"));
        const event = messages.find((message) => message.messageType === "session.event");
        assert.equal((event?.data).seq, 7);
        await client.close();
    });
});
test("VM broker client close resolves while reconnect backoff is pending", async () => {
    const server = http.createServer();
    const wss = new WebSocketServer({ server, path: "/api/live-workflows/vm/ws" });
    const messages = [];
    const originalConsoleError = console.error;
    wss.on("connection", (socket) => {
        socket.on("message", (data) => {
            messages.push(JSON.parse(data.toString()));
            socket.close(1011, "test closes before hello ack");
        });
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    const client = new VmAgentBrokerClient({
        wsUrl: `ws://127.0.0.1:${address.port}/api/live-workflows/vm/ws`,
        token: "secret",
        vmHostId: VmHostId,
        capabilities: { codexAppServer: true },
        commandRouter: new VmCommandRouter(),
        reconnectMinMs: 10000,
        reconnectMaxMs: 10000,
    });
    try {
        console.error = (...args) => {
            if (args[0] === "LiveWorkflow VM broker websocket connection failed") {
                return;
            }
            originalConsoleError(...args);
        };
        client.start();
        await waitFor(() => messages.some((message) => message.messageType === "vm.broker.hello"));
        await delay(25);
        const closed = await Promise.race([
            client.close().then(() => true),
            delay(200).then(() => false),
        ]);
        assert.equal(closed, true);
    }
    finally {
        console.error = originalConsoleError;
        await client.close().catch(() => undefined);
        for (const socket of wss.clients) {
            socket.terminate();
        }
        await new Promise((resolve, reject) => wss.close((error) => (error ? reject(error) : resolve())));
        await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    }
});
async function withBrokerServer(callback) {
    const server = http.createServer();
    const wss = new WebSocketServer({ server, path: "/api/live-workflows/vm/ws" });
    const messages = [];
    let activeSocket;
    wss.on("connection", (socket, req) => {
        assert.equal(req.headers.authorization, "Bearer secret");
        activeSocket = socket;
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            messages.push(message);
            if (message.messageType === "vm.broker.hello") {
                socket.send(JSON.stringify({
                    ok: true,
                    protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
                    messageType: "vm.broker.hello.ack",
                    ts: "2026-05-18T12:00:00.000Z",
                    data: {
                        ok: true,
                        vmHostId: VmHostId,
                        connectionId: "connection-1",
                    },
                }));
            }
        });
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    try {
        await callback({
            wsUrl: `ws://127.0.0.1:${address.port}/api/live-workflows/vm/ws`,
            messages,
            send(message) {
                activeSocket?.send(JSON.stringify(message));
            },
        });
    }
    finally {
        for (const socket of wss.clients) {
            socket.terminate();
        }
        await new Promise((resolve, reject) => wss.close((error) => (error ? reject(error) : resolve())));
        await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    }
}
class AckHandler {
    constructor() {
        this.path = "/commands/session.interrupt";
    }
    async handle(body) {
        const record = body;
        return {
            ok: true,
            protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
            messageType: record.messageType,
            commandId: record.commandId,
            ts: "2026-05-18T12:00:02.000Z",
            data: {
                ok: true,
                commandId: record.commandId,
                sessionId: record.data.sessionId,
            },
        };
    }
}
class FailingHandler {
    constructor() {
        this.path = "/commands/session.interrupt";
    }
    async handle() {
        throw new Error("handler failed");
    }
}
function sessionEvent(seq) {
    return {
        seq,
        sessionId: SessionId,
        workspaceId: "workspace-id",
        vmHostId: VmHostId,
        eventType: "turn.started",
        codexThreadId: "thread-1",
        codexTurnId: "turn-1",
        payload: {},
    };
}
async function waitFor(predicate, timeoutMs = 5000) {
    const started = Date.now();
    while (!predicate()) {
        if (Date.now() - started > timeoutMs) {
            throw new Error("Timed out waiting for predicate");
        }
        await new Promise((resolve) => setTimeout(resolve, 5));
    }
}
async function delay(ms) {
    await new Promise((resolve) => setTimeout(resolve, ms));
}
