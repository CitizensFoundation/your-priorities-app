import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { DefaultCodexModel, YP_LIVE_WORKFLOW_VM_PROTOCOL, } from "../../../contracts/index.js";
import { CodexAdapter, CodexSessionNotActiveError, } from "../../codex/codexAdapter.js";
import { SessionApprovalRespondCommandHandler, SessionInjectItemsCommandHandler, SessionInterruptCommandHandler, SessionPauseCommandHandler, SessionResumeCommandHandler, SessionReviewStartCommandHandler, SessionTerminateCommandHandler, SessionThreadForkCommandHandler, SessionTurnStartCommandHandler, SessionTurnSteerCommandHandler, WorkspaceArchiveCommandHandler, } from "../../commands/sessionControlCommandHandlers.js";
import { DockerRuntimeManager } from "../../docker/dockerRuntimeManager.js";
import { AuxTerminalBridge } from "../../terminal/auxTerminalBridge.js";
const now = () => new Date("2026-05-16T13:00:00.000Z");
test("session control command handlers dispatch active Codex app-server requests", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: (_options) => transport,
    });
    await adapter.startSession(vmSessionStartPayload());
    const pause = await new SessionPauseCommandHandler(adapter).handle(envelope("session.pause", "pause-command-1", {
        commandId: "pause-command-1",
        sessionId: "session-1",
        codexThreadId: "thread-1",
        codexTurnId: "turn-1",
        interruptActiveTurn: true,
        keepWarm: true,
        reason: "operator hold",
    }), { now });
    const resume = await new SessionResumeCommandHandler(adapter).handle(envelope("session.resume", "resume-command-1", {
        commandId: "resume-command-1",
        sessionId: "session-1",
        codexThreadId: "thread-1",
    }), { now });
    const fork = await new SessionThreadForkCommandHandler(adapter).handle(envelope("session.thread.fork", "fork-command-1", {
        commandId: "fork-command-1",
        sessionId: "session-1",
        codexThreadId: "thread-1",
        persistExtendedHistory: true,
    }), { now });
    const turnStart = await new SessionTurnStartCommandHandler(adapter).handle(envelope("session.turn.start", "turn-start-command-1", {
        commandId: "turn-start-command-1",
        sessionId: "session-1",
        codexThreadId: "thread-1",
        input: [{ type: "text", text: "Continue the work." }],
        overrides: { model: DefaultCodexModel, reasoningEffort: "low", serviceTier: "fast" },
    }), { now });
    const turnSteer = await new SessionTurnSteerCommandHandler(adapter).handle(envelope("session.turn.steer", "turn-steer-command-1", {
        commandId: "turn-steer-command-1",
        sessionId: "session-1",
        codexThreadId: "thread-1",
        codexTurnId: "turn-2",
        input: [{ type: "text", text: "Narrow the scope." }],
    }), { now });
    const interrupt = await new SessionInterruptCommandHandler(adapter).handle(envelope("session.interrupt", "interrupt-command-1", {
        commandId: "interrupt-command-1",
        sessionId: "session-1",
        codexThreadId: "thread-1",
        codexTurnId: "turn-2",
    }), { now });
    await new SessionInjectItemsCommandHandler(adapter).handle(envelope("session.inject_items", "inject-command-1", {
        commandId: "inject-command-1",
        sessionId: "session-1",
        codexThreadId: "thread-1",
        items: [{ type: "note", text: "context" }],
    }), { now });
    await new SessionReviewStartCommandHandler(adapter).handle(envelope("session.review.start", "review-command-1", {
        commandId: "review-command-1",
        sessionId: "session-1",
        codexThreadId: "thread-1",
        target: { type: "commit", sha: "abc123" },
        delivery: "detached",
    }), { now });
    await new SessionApprovalRespondCommandHandler(adapter).handle(envelope("session.approval.respond", "approval-command-1", {
        commandId: "approval-command-1",
        sessionId: "session-1",
        requestId: 41,
        result: { decision: "approve" },
    }), { now });
    await new SessionApprovalRespondCommandHandler(adapter).handle(envelope("session.approval.respond", "approval-command-2", {
        commandId: "approval-command-2",
        sessionId: "session-1",
        requestId: "approval-2",
        error: { code: -32000, message: "rejected" },
    }), { now });
    assert.equal(pause.messageType, "session.pause");
    assert.equal(pause.data.result?.status, "paused");
    assert.equal(resume.messageType, "session.resume");
    assert.equal(fork.data.codexThreadId, "thread-forked-1");
    assert.equal(turnStart.data.codexTurnId, "turn-3");
    assert.equal(turnSteer.data.codexTurnId, "turn-2");
    assert.equal(interrupt.data.codexTurnId, null);
    assert.equal(interrupt.data.result?.interruptedTurnId, "turn-2");
    assert.deepEqual(transport.requests.map((request) => request.method), [
        "initialize",
        "account/login/start",
        "thread/start",
        "turn/start",
        "turn/interrupt",
        "thread/resume",
        "thread/fork",
        "turn/start",
        "turn/steer",
        "turn/interrupt",
        "thread/inject_items",
        "review/start",
    ]);
    assert.deepEqual(transport.requests[4]?.params, {
        threadId: "thread-1",
        turnId: "turn-1",
    });
    assert.deepEqual(transport.requests[5]?.params, {
        approvalPolicy: "never",
        sandbox: "danger-full-access",
        threadId: "thread-1",
        persistExtendedHistory: false,
    });
    assert.deepEqual(transport.requests[6]?.params, {
        config: {
            model_reasoning_effort: "xhigh",
        },
        cwd: "/workspace/root/workspace",
        model: DefaultCodexModel,
        serviceTier: "flex",
        approvalPolicy: "never",
        sandbox: "danger-full-access",
        threadId: "thread-1",
        persistExtendedHistory: true,
    });
    assert.deepEqual(transport.requests[7]?.params, {
        cwd: "/workspace/root/workspace",
        model: DefaultCodexModel,
        serviceTier: "fast",
        effort: "low",
        approvalPolicy: "never",
        sandboxPolicy: {
            type: "externalSandbox",
            networkAccess: "enabled",
        },
        threadId: "thread-1",
        input: [{ type: "text", text: "Continue the work.", text_elements: [] }],
    });
    assert.deepEqual(transport.requests[8]?.params, {
        threadId: "thread-1",
        expectedTurnId: "turn-2",
        input: [{ type: "text", text: "Narrow the scope.", text_elements: [] }],
    });
    assert.deepEqual(transport.requests[9]?.params, {
        threadId: "thread-1",
        turnId: "turn-2",
    });
    assert.deepEqual(transport.requests[10]?.params, {
        threadId: "thread-1",
        items: [{ type: "note", text: "context" }],
    });
    assert.deepEqual(transport.requests[11]?.params, {
        threadId: "thread-1",
        target: { type: "commit", sha: "abc123", title: null },
        delivery: "detached",
    });
    assert.deepEqual(transport.serverResponses, [{ id: 41, result: { decision: "approve" } }]);
    assert.deepEqual(transport.serverRejections, [{ id: "approval-2", error: { code: -32000, message: "rejected" } }]);
});
test("session turn start command applies Codex runtime defaults when overrides are absent", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: (_options) => transport,
    });
    await adapter.startSession(vmSessionStartPayload({
        initialTurnMode: "deferred",
        runtimeSnapshot: {
            codexConfig: {},
            modelDefaults: {
                model: "gpt-5.5",
                serviceTier: "flex",
                reasoningEffort: "xhigh",
            },
        },
    }));
    const turnStart = await new SessionTurnStartCommandHandler(adapter).handle(envelope("session.turn.start", "turn-start-command-1", {
        commandId: "turn-start-command-1",
        sessionId: "session-1",
        codexThreadId: "thread-1",
        input: [{ type: "text", text: "Continue with the plan." }],
    }), { now });
    assert.equal(turnStart.data.codexTurnId, "turn-2");
    assert.deepEqual(transport.requests.map((request) => request.method), [
        "initialize",
        "account/login/start",
        "thread/start",
        "turn/start",
    ]);
    assert.deepEqual(transport.requests[3]?.params, {
        cwd: "/workspace/root/workspace",
        model: "gpt-5.5",
        serviceTier: "flex",
        effort: "xhigh",
        approvalPolicy: "never",
        sandboxPolicy: {
            type: "externalSandbox",
            networkAccess: "enabled",
        },
        threadId: "thread-1",
        input: [{ type: "text", text: "Continue with the plan.", text_elements: [] }],
    });
});
test("session lifecycle control command handlers terminate and archive Docker sessions", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-session-control-"));
    const archiveRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-session-archive-"));
    const cli = new FakeDockerCli();
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        defaultImage: "researcher-runtime:test",
        allowedImages: ["researcher-runtime:test"],
        archiveRoot,
        runUser: null,
        now,
        transportFactory: () => new FakeCodexTransport(),
    });
    const auxTerminalBridge = new AuxTerminalBridge({ allowedRootPath: tempRoot });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    const terminateRoot = path.join(tempRoot, "terminate-root");
    const helperPath = path.join(terminateRoot, "workspace", "repo", ".git", "yp-live-workflow-github-credential-helper.sh");
    await fs.mkdir(path.dirname(helperPath), { recursive: true });
    await fs.writeFile(helperPath, "secret", "utf8");
    await adapter.startSession({
        ...vmSessionStartPayload({
            sessionId: "session-terminate",
            workspaceId: "workspace-terminate",
            rootPath: terminateRoot,
            runtimeSnapshot: { containerImage: "researcher-runtime:test" },
        }),
        sensitiveHostPaths: [helperPath],
    });
    const terminated = await new SessionTerminateCommandHandler(adapter, dockerRuntime, auxTerminalBridge).handle(envelope("session.terminate", "terminate-command-1", {
        commandId: "terminate-command-1",
        sessionId: "session-terminate",
    }), { now });
    assert.equal(terminated.data.result?.session?.status, "stopped");
    assert.equal(await pathExists(helperPath), false);
    const archiveRootPath = path.join(tempRoot, "archive-root");
    await fs.mkdir(path.join(archiveRootPath, "workspace"), { recursive: true });
    await fs.writeFile(path.join(archiveRootPath, "workspace", "result.txt"), "archived result");
    await dockerRuntime.preflightSessionImage(vmSessionStartPayload({
        sessionId: "session-archive",
        workspaceId: "workspace-archive",
        rootPath: archiveRootPath,
    }));
    const archived = await new WorkspaceArchiveCommandHandler(adapter, dockerRuntime, auxTerminalBridge).handle(envelope("workspace.archive", "archive-command-1", {
        commandId: "archive-command-1",
        sessionId: "session-archive",
        workspaceId: "workspace-archive",
    }), { now });
    assert.equal(archived.data.result?.session?.status, "archived");
    assert.equal(await pathExists(path.join(archiveRoot, "workspace-archive", "session-archive", "workspace", "result.txt")), true);
    assert.deepEqual(cli.calls.filter((call) => call[0] === "stop"), [
        ["stop", "yp-live-workflow-session-session-terminate"],
        ["stop", "yp-live-workflow-session-session-archive"],
    ]);
    await auxTerminalBridge.closeAll();
});
test("session control command handlers reject missing active sessions", async () => {
    const adapter = new CodexAdapter({ transportFactory: () => new FakeCodexTransport() });
    await assert.rejects(() => new SessionTurnStartCommandHandler(adapter).handle(envelope("session.turn.start", "turn-start-command-1", {
        commandId: "turn-start-command-1",
        sessionId: "missing-session",
        codexThreadId: "thread-1",
        input: [{ type: "text", text: "Continue." }],
    }), { now }), CodexSessionNotActiveError);
});
class FakeCodexTransport {
    constructor() {
        this.requests = [];
        this.notifications = [];
        this.serverResponses = [];
        this.serverRejections = [];
        this.nextTurn = 1;
    }
    async request(method, params) {
        this.requests.push({ method, params });
        switch (method) {
            case "initialize":
                return { serverInfo: { name: "fake-codex", version: "0.143.0" } };
            case "account/login/start":
                return { type: "apiKey" };
            case "thread/start":
            case "thread/resume":
                return { thread: { id: params?.threadId ?? "thread-1" } };
            case "thread/fork":
                return { thread: { id: "thread-forked-1" } };
            case "turn/start": {
                this.nextTurn += 1;
                return { turn: { id: `turn-${this.nextTurn}` } };
            }
            case "turn/steer":
                return { turn: { id: params.expectedTurnId } };
            case "turn/interrupt":
                return { interrupted: true };
            case "thread/inject_items":
                return { injected: true };
            case "review/start":
                return { review: { id: "review-1" } };
            default:
                throw new Error(`Unexpected Codex request: ${method}`);
        }
    }
    notify(method, params) {
        this.notifications.push({ method, params });
    }
    onNotification(handler) {
        void handler;
    }
    respondToServerRequest(id, result) {
        this.serverResponses.push({ id, result });
    }
    rejectServerRequest(id, error) {
        this.serverRejections.push({ id, error });
    }
    async close() {
        return undefined;
    }
}
class FakeDockerCli {
    constructor() {
        this.calls = [];
    }
    async run(args) {
        this.calls.push([...args]);
        return {
            exitCode: 0,
            signal: null,
            stdout: "",
            stderr: "",
            timedOut: false,
        };
    }
}
function envelope(messageType, commandId, data) {
    return {
        protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
        messageType,
        commandId,
        ts: now().toISOString(),
        data,
    };
}
async function pathExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    }
    catch {
        return false;
    }
}
function vmSessionStartPayload(input = {}) {
    const rootPath = input.rootPath ?? "/workspace/root";
    return {
        commandId: "session-command-1",
        sessionId: input.sessionId ?? "session-1",
        runId: "run-1",
        runStepId: "step-1",
        nodeId: "node-1",
        workspaceId: input.workspaceId ?? "workspace-1",
        vmHostId: "vm-1",
        runtimeProfileId: "runtime-profile-1",
        layout: {
            rootPath,
            workspacePath: path.join(rootPath, "workspace"),
            codexHomePath: path.join(rootPath, "codex-home"),
            artifactsPath: path.join(rootPath, "artifacts"),
            cachePath: path.join(rootPath, "cache"),
        },
        runtimeSnapshot: {
            codexConfig: {},
            modelDefaults: {},
            ...input.runtimeSnapshot,
        },
        initialTurnMode: input.initialTurnMode,
        inputPayload: {
            objective: "Start codex",
        },
        auth: {
            provider: "openai",
            authMode: "codex_chatgpt_with_api_fallback",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                openAiApiKeyMaterial: { apiKey: "test-key" },
            },
        },
    };
}
