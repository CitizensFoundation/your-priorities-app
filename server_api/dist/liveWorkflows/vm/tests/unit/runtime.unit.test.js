import assert from "node:assert/strict";
import fsSync from "node:fs";
import { spawn as spawnChildProcess } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { pathToFileURL } from "node:url";
import test from "node:test";
import { YP_LIVE_WORKFLOW_VM_PROTOCOL, } from "../../../contracts/index.js";
import { WebSocketServer } from "ws";
import { VmAgentApiClient } from "../../apiClient.js";
import { CodexAdapter, } from "../../codex/codexAdapter.js";
import { DefaultCodexAppServerArgs } from "../../codex/codexAppServerDefaults.js";
import { codexAuthMaterialFingerprintSha256 } from "../../codex/codexAuthMaterial.js";
import { BoundedFileLogSink, StdioCodexAppServerTransport } from "../../codex/appServerTransport.js";
import { loadVmAgentConfig } from "../../config.js";
import { formatVmAgentConsoleEvent } from "../../consoleEvents.js";
import { startVmAgentControlServer } from "../../controlServer.js";
import { DatasetManager } from "../../datasets/datasetManager.js";
import { DockerImagePolicyError, DockerRuntimeManager, OfficialCodexAppServerImage, runUserForHostIdentity, } from "../../docker/dockerRuntimeManager.js";
import { MetricsReporter } from "../../metrics/metricsReporter.js";
import { startVmAgent } from "../../runtime.js";
import { FileVmAgentStateStore } from "../../stateStore.js";
import { AuxTerminalBridge, } from "../../terminal/auxTerminalBridge.js";
import { WorkspaceManager, } from "../../workspace/workspaceManager.js";
test("VM agent config applies defaults and validates required env", () => {
    assert.throws(() => loadVmAgentConfig({}));
    const config = loadVmAgentConfig({
        YP_LIVE_WORKFLOW_API_BASE_URL: "http://127.0.0.1:3000",
        YP_LIVE_WORKFLOW_VM_AGENT_TOKEN: "token",
    });
    assert.equal(config.apiBaseUrl, "http://127.0.0.1:3000");
    assert.equal(config.token, "token");
    assert.equal(config.brokerEnabled, true);
    assert.equal(config.brokerWsUrl, "ws://127.0.0.1:3000/api/live-workflows/vm/ws");
    assert.equal(config.brokerReconnectMinMs, 1000);
    assert.equal(config.brokerReconnectMaxMs, 30000);
    assert.equal(config.workspaceRoot, "/mnt/experiments");
    assert.equal(config.archiveRoot, "/mnt/archive");
    assert.equal(config.datasetsHotRoot, "/mnt/datasets-hot");
    assert.deepEqual(config.datasetsLocalRoots, []);
    assert.equal(config.heartbeatIntervalMs, 15000);
    assert.equal(config.telemetryIntervalMs, 15000);
    assert.equal(config.maxCodexSessions, 8);
    assert.equal(config.consoleEventsEnabled, false);
    assert.equal(config.dockerBin, "docker");
    assert.equal(config.dockerRunUser, "0:0");
    assert.equal(config.dockerDropAllCapabilities, false);
    assert.equal(config.dockerNoNewPrivileges, false);
    assert.equal(config.dockerRuntime, undefined);
    assert.equal(config.dockerNetworkMode, "bridge");
    assert.equal(config.codexContainerImage, OfficialCodexAppServerImage);
    assert.equal(config.codexContainerLdLibraryPath, undefined);
    assert.equal(config.codexServerRequestMode, "defer");
    assert.equal(config.auxTerminalEnabled, false);
    assert.equal(config.auxTerminalShell, undefined);
    assert.equal(config.auxTerminalBacklogBytes, 262144);
    assert.ok(config.statePath.endsWith(path.join(".yp-live-workflow", "vm-agent-state.json")));
    const dockerConfig = loadVmAgentConfig({
        YP_LIVE_WORKFLOW_API_BASE_URL: "http://127.0.0.1:3000",
        YP_LIVE_WORKFLOW_VM_AGENT_TOKEN: "token",
        YP_LIVE_WORKFLOW_DOCKER_BIN: "/usr/local/bin/docker",
        YP_LIVE_WORKFLOW_CODEX_CONTAINER_IMAGE: "researcher-runtime:latest",
        YP_LIVE_WORKFLOW_CODEX_ALLOWED_IMAGES: "researcher-runtime:latest,registry.example/codex@sha256:abc",
        YP_LIVE_WORKFLOW_CODEX_SERVER_REQUEST_MODE: "reject",
        YP_LIVE_WORKFLOW_GHCR_USERNAME: "robot",
        YP_LIVE_WORKFLOW_GHCR_TOKEN: "token",
        YP_LIVE_WORKFLOW_DOCKER_NETWORK_MODE: "bridge",
        YP_LIVE_WORKFLOW_VM_DATASETS_LOCAL_ROOTS: "/mnt/datasets-cold, /mnt/active-datasets",
        YP_LIVE_WORKFLOW_ARTIFACT_BUCKET: "private-artifacts",
        YP_LIVE_WORKFLOW_ARTIFACT_PREFIX: "yp-live-workflow-artifacts",
        YP_LIVE_WORKFLOW_ARTIFACT_UPLOAD_MAX_BYTES: "123456",
        YP_LIVE_WORKFLOW_ARTIFACT_COLLECTION_MAX_FILES: "1234",
        YP_LIVE_WORKFLOW_ARTIFACT_COLLECTION_MAX_FILE_BYTES: "55555",
        YP_LIVE_WORKFLOW_ARTIFACT_COLLECTION_MAX_TOTAL_BYTES: "987654321",
        YP_LIVE_WORKFLOW_VM_AUX_TERMINAL_ENABLED: "true",
        YP_LIVE_WORKFLOW_VM_AUX_TERMINAL_SHELL: "/bin/sh",
        YP_LIVE_WORKFLOW_VM_AUX_TERMINAL_BACKLOG_BYTES: "4096",
        YP_LIVE_WORKFLOW_VM_AGENT_BROKER_ENABLED: "false",
        YP_LIVE_WORKFLOW_VM_AGENT_BROKER_WS_URL: "wss://api.example.test/api/live-workflows/vm/ws",
        YP_LIVE_WORKFLOW_VM_AGENT_BROKER_RECONNECT_MIN_MS: "250",
        YP_LIVE_WORKFLOW_VM_AGENT_BROKER_RECONNECT_MAX_MS: "5000",
        YP_LIVE_WORKFLOW_VM_MAX_CODEX_SESSIONS: "12",
        YP_LIVE_WORKFLOW_VM_CONSOLE_EVENTS: "true",
        YP_LIVE_WORKFLOW_DOCKER_RUN_USER: "0:0",
        YP_LIVE_WORKFLOW_DOCKER_DROP_ALL_CAPABILITIES: "false",
        YP_LIVE_WORKFLOW_DOCKER_NO_NEW_PRIVILEGES: "true",
        YP_LIVE_WORKFLOW_DOCKER_RUNTIME: "sysbox-runc",
        YP_LIVE_WORKFLOW_DOCKER_GPU_MODE: "nvidia_direct",
        YP_LIVE_WORKFLOW_DOCKER_NVIDIA_DIRECT_DEVICES: "/dev/nvidia0,/dev/nvidiactl",
        YP_LIVE_WORKFLOW_DOCKER_NVIDIA_DIRECT_LIBRARY_MOUNTS: "/usr/lib/x86_64-linux-gnu/libcuda.so.1,/usr/lib/x86_64-linux-gnu/libnvidia-ml.so.1",
        YP_LIVE_WORKFLOW_DOCKER_NVIDIA_DIRECT_UTILITY_MOUNTS: "/usr/bin/nvidia-smi,/opt/nvidia/bin/nvidia-debugdump",
        YP_LIVE_WORKFLOW_CODEX_CONTAINER_LD_LIBRARY_PATH: "/usr/lib/x86_64-linux-gnu:/usr/local/cuda/targets/x86_64-linux/lib",
    });
    assert.equal(dockerConfig.brokerEnabled, false);
    assert.equal(dockerConfig.brokerWsUrl, "wss://api.example.test/api/live-workflows/vm/ws");
    assert.equal(dockerConfig.brokerReconnectMinMs, 250);
    assert.equal(dockerConfig.brokerReconnectMaxMs, 5000);
    assert.equal(dockerConfig.maxCodexSessions, 12);
    assert.equal(dockerConfig.consoleEventsEnabled, true);
    assert.equal(dockerConfig.dockerBin, "/usr/local/bin/docker");
    assert.equal(dockerConfig.dockerRunUser, "0:0");
    assert.equal(dockerConfig.dockerDropAllCapabilities, false);
    assert.equal(dockerConfig.dockerNoNewPrivileges, true);
    assert.equal(dockerConfig.dockerRuntime, "sysbox-runc");
    assert.equal(dockerConfig.dockerGpuMode, "nvidia_direct");
    assert.deepEqual(dockerConfig.dockerNvidiaDirectDevices, ["/dev/nvidia0", "/dev/nvidiactl"]);
    assert.deepEqual(dockerConfig.dockerNvidiaDirectLibraryMounts, [
        "/usr/lib/x86_64-linux-gnu/libcuda.so.1",
        "/usr/lib/x86_64-linux-gnu/libnvidia-ml.so.1",
    ]);
    assert.deepEqual(dockerConfig.dockerNvidiaDirectUtilityMounts, [
        "/usr/bin/nvidia-smi",
        "/opt/nvidia/bin/nvidia-debugdump",
    ]);
    assert.equal(dockerConfig.codexContainerImage, "researcher-runtime:latest");
    assert.equal(dockerConfig.codexContainerLdLibraryPath, "/usr/lib/x86_64-linux-gnu:/usr/local/cuda/targets/x86_64-linux/lib");
    assert.deepEqual(dockerConfig.codexAllowedImages, [
        "researcher-runtime:latest",
        "registry.example/codex@sha256:abc",
    ]);
    assert.equal(dockerConfig.codexServerRequestMode, "reject");
    assert.equal(dockerConfig.ghcrUsername, "robot");
    assert.equal(dockerConfig.ghcrToken, "token");
    assert.equal(dockerConfig.dockerNetworkMode, "bridge");
    assert.deepEqual(dockerConfig.datasetsLocalRoots, ["/mnt/datasets-cold", "/mnt/active-datasets"]);
    assert.equal(dockerConfig.artifactBucket, "private-artifacts");
    assert.equal(dockerConfig.artifactPrefix, "yp-live-workflow-artifacts");
    assert.equal(config.artifactUploadMaxBytes, 25 * 1024 * 1024);
    assert.equal(dockerConfig.artifactUploadMaxBytes, 123456);
    assert.equal(dockerConfig.artifactUploadEnabled, true);
    assert.equal(dockerConfig.artifactCollectionMaxFiles, 1234);
    assert.equal(config.artifactCollectionMaxFileBytes, 25 * 1024 * 1024);
    assert.equal(dockerConfig.artifactCollectionMaxFileBytes, 55555);
    assert.equal(dockerConfig.artifactCollectionMaxTotalBytes, 987654321);
    assert.equal(dockerConfig.auxTerminalEnabled, true);
    assert.equal(dockerConfig.auxTerminalShell, "/bin/sh");
    assert.equal(dockerConfig.auxTerminalBacklogBytes, 4096);
    assert.throws(() => loadVmAgentConfig({
        YP_LIVE_WORKFLOW_API_BASE_URL: "http://127.0.0.1:3000",
        YP_LIVE_WORKFLOW_VM_AGENT_TOKEN: "token",
        YP_LIVE_WORKFLOW_CODEX_SERVER_REQUEST_MODE: "drop",
    }), /YP_LIVE_WORKFLOW_CODEX_SERVER_REQUEST_MODE/);
});
test("VM agent console event formatter colors selected source prefixes", () => {
    assert.equal(formatVmAgentConsoleEvent({ source: "vm", event: "registered", fields: { host: "vm-host-id", codex: true } }, { colors: true }), "\x1b[36m[vm]\x1b[0m registered host=vm-host-id codex=true");
    assert.equal(formatVmAgentConsoleEvent({ source: "codex", event: "turn.start", fields: { model: "gpt-5.5", tier: "flex" } }, { colors: true }), "\x1b[35m[codex]\x1b[0m turn.start model=gpt-5.5 tier=flex");
    assert.equal(formatVmAgentConsoleEvent({ source: "codex", event: "error", fields: { message: "needs quoting" } }, { colors: false }), '[codex] error message="needs quoting"');
});
test("file state store reads and writes assigned VM host id", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-vm-agent-"));
    const statePath = path.join(tempDir, "state.json");
    const store = new FileVmAgentStateStore(statePath);
    assert.deepEqual(await store.read(), {});
    await store.write({ vmHostId: "vm-host-id" });
    assert.deepEqual(await store.read(), { vmHostId: "vm-host-id" });
});
test("VM agent API client posts VM protocol envelopes with bearer auth", async () => {
    const requests = [];
    const fetchImpl = async (input, init) => {
        requests.push({ input, init });
        return {
            ok: true,
            status: 200,
            text: async () => JSON.stringify({ ok: true, vmHostId: "vm-host-id", messageType: "vm.heartbeat" }),
        };
    };
    const client = new VmAgentApiClient({
        apiBaseUrl: "http://127.0.0.1:3000/",
        token: "secret",
        fetchImpl,
    });
    await client.sendEvent("vm.heartbeat", { vmHostId: "vm-host-id" });
    assert.equal(requests[0]?.input, "http://127.0.0.1:3000/api/live-workflows/vm/events");
    assert.equal(requests[0]?.init?.headers?.authorization, "Bearer secret");
    const body = JSON.parse(requests[0]?.init?.body ?? "{}");
    assert.equal(body.protocol, "yp-live-workflow.vm.v1");
    assert.equal(body.messageType, "vm.heartbeat");
});
test("Codex adapter starts app-server threads and turns over stdio transport", async () => {
    const transport = new FakeCodexTransport();
    const forwardedEvents = [];
    let launchOptions;
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const result = await adapter.startSession(vmSessionStartPayload(), {
        onEvent: (event) => {
            forwardedEvents.push(event.eventType);
        },
    });
    assert.equal(launchOptions?.cwd, "/workspace/root/workspace");
    assert.equal(launchOptions?.codexHomePath, "/workspace/root/codex-home");
    assert.equal(launchOptions?.env.CODEX_HOME, "/workspace/root/codex-home");
    assert.equal(launchOptions?.env.ARTIFACTS_DIR, "/workspace/root/artifacts");
    assert.equal(launchOptions?.env.OPENAI_API_KEY, undefined);
    assert.deepEqual(transport.requests.map((request) => request.method), [
        "initialize",
        "account/login/start",
        "thread/start",
        "turn/start",
    ]);
    assert.deepEqual(transport.notifications.map((notification) => notification.method), ["initialized"]);
    assert.deepEqual(transport.requests[1]?.params, { type: "apiKey", apiKey: "test-key" });
    assert.equal("threadSource" in (transport.requests[2]?.params ?? {}), false);
    assert.equal("sessionStartSource" in (transport.requests[2]?.params ?? {}), false);
    assert.deepEqual((transport.requests[2]?.params).config, {
        model_reasoning_effort: "xhigh",
    });
    assert.equal((transport.requests[2]?.params).serviceTier, "flex");
    assert.equal((transport.requests[3]?.params).effort, "xhigh");
    assert.equal((transport.requests[3]?.params).serviceTier, "flex");
    assert.deepEqual((transport.requests[3]?.params).input[0], {
        type: "text",
        text: "Start codex",
        text_elements: [],
    });
    assert.equal(result.codexThreadId, "thread-1");
    assert.equal(result.codexTurnId, "turn-1");
    assert.equal(result.vmEventStreamId, result.events[0]?.vmEventStreamId);
    assert.equal(result.vmEventSeqBoundary, 2);
    assert.deepEqual(result.events.map((event) => event.eventType), ["thread.started", "turn.started"]);
    assert.ok(result.events[0]?.vmEventStreamId);
    assert.equal(result.events[1]?.vmEventStreamId, result.events[0]?.vmEventStreamId);
    assert.deepEqual(forwardedEvents, ["thread.started", "turn.started"]);
    assert.equal(result.runtimeMetadata.authMode, "codex_chatgpt_with_api_fallback");
    transport.emit({
        method: "error",
        params: { threadId: "thread-1", turnId: "turn-1", message: "failed" },
    });
    await sleep(1);
    assert.equal(result.events.at(-1)?.eventType, "session.error");
    assert.equal(forwardedEvents.at(-1), "session.error");
    transport.emit({
        id: 41,
        method: "item/commandExecution/requestApproval",
        params: { itemId: "item-1", command: ["npm", "test"] },
    });
    await sleep(1);
    assert.equal(result.events.at(-1)?.eventType, "approval.requested");
    assert.equal(result.events.at(-1)?.itemId, "item-1");
    assert.equal(result.events.at(-1)?.payload.requestId, 41);
    adapter.respondToServerRequest("session-id", 41, { decision: "accept" });
    assert.deepEqual(transport.serverResponses, [{ id: 41, result: { decision: "accept" } }]);
});
test("Codex adapter clears requested flex tier on the ChatGPT lane", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    const consoleEvents = [];
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "fallback-key" },
        transportFactory: () => transport,
        consoleEventSink: (event) => consoleEvents.push(formatVmAgentConsoleEvent(event, { colors: false })),
    });
    const payload = vmSessionStartPayload({
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    const threadRequest = transport.requests.find((request) => request.method === "thread/start");
    const turnRequest = transport.requests.find((request) => request.method === "turn/start");
    assert.equal((threadRequest?.params).serviceTier, null);
    assert.equal((turnRequest?.params).serviceTier, null);
    assert.ok(consoleEvents.includes("[codex] turn.start session=session-id thread=thread-1 model=gpt-test tier=regular effort=xhigh"));
    transport.emit({
        method: "thread/tokenUsage/updated",
        params: {
            threadId: started.codexThreadId,
            tokenUsage: { total: { inputTokens: 10, outputTokens: 1, totalTokens: 11 } },
        },
    });
    const billingContext = events.find((event) => event.eventType === "metrics.updated")
        ?.payload.billingContext;
    assert.equal(billingContext?.lane, "chatgpt_plan");
    assert.equal(billingContext?.serviceTier, "regular");
    assert.equal(billingContext?.inferenceType, "normal");
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: started.codexThreadId,
            turnId: started.codexTurnId,
            turn: { id: started.codexTurnId, status: "completed" },
        },
    });
    await adapter.forkThread({
        commandId: "fork-chatgpt-flex-command",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    const forkRequest = transport.requests.find((request) => request.method === "thread/fork");
    assert.equal((forkRequest?.params).serviceTier, null);
    await adapter.closeAll();
});
test("Codex adapter bills a first deferred ChatGPT review at the effective regular tier", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "fallback-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    await adapter.startReview({
        commandId: "review-start-deferred-chatgpt",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        target: { type: "custom", instructions: "Review the current work." },
    });
    const threadRequest = transport.requests.find((request) => request.method === "thread/start");
    const reviewRequest = transport.requests.find((request) => request.method === "review/start");
    assert.equal((threadRequest?.params).serviceTier, null);
    assert.equal("serviceTier" in (reviewRequest?.params ?? {}), false);
    transport.emit({
        method: "thread/tokenUsage/updated",
        params: {
            threadId: started.codexThreadId,
            tokenUsage: { total: { inputTokens: 10, outputTokens: 1, totalTokens: 11 } },
        },
    });
    const billingContext = events.find((event) => event.eventType === "metrics.updated")
        ?.payload.billingContext;
    assert.equal(billingContext?.lane, "chatgpt_plan");
    assert.equal(billingContext?.serviceTier, "regular");
    assert.equal(billingContext?.inferenceType, "normal");
    await adapter.closeAll();
});
test("Codex adapter restores flex before an API review after quota fallback", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "fallback-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const requestOffset = transport.requests.length;
    const review = await adapter.startReview({
        commandId: "review-start-api-flex",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        target: { type: "custom", instructions: "Review through the API lane." },
    });
    assert.equal(usageRoutingLane(review.result), "openai_api");
    const requests = transport.requests.slice(requestOffset);
    assert.deepEqual(requests.map((request) => request.method), ["account/rateLimits/read", "account/login/start", "thread/settings/update", "review/start"]);
    assert.equal((requests[2]?.params).serviceTier, "flex");
    assert.equal("serviceTier" in (requests[3]?.params ?? {}), false);
    transport.emit({
        method: "thread/tokenUsage/updated",
        params: {
            threadId: started.codexThreadId,
            tokenUsage: { total: { inputTokens: 10, outputTokens: 1, totalTokens: 11 } },
        },
    });
    const billingContext = [...events].reverse().find((event) => event.eventType === "metrics.updated")
        ?.payload.billingContext;
    assert.equal(billingContext?.lane, "openai_api");
    assert.equal(billingContext?.serviceTier, "flex");
    assert.equal(billingContext?.inferenceType, "flex");
    await adapter.closeAll();
});
test("Codex adapter retries API tier reapplication after a transient settings failure", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "fallback-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    transport.requestErrors.set("thread/settings/update", new Error("settings response was lost"));
    await assert.rejects(adapter.startReview({
        commandId: "review-start-api-flex-failed-update",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        target: { type: "custom", instructions: "Review through the API lane." },
    }), /settings response was lost/);
    assert.equal(transport.requests.filter((request) => request.method === "thread/settings/update").length, 1);
    transport.requestErrors.delete("thread/settings/update");
    const retryRequestOffset = transport.requests.length;
    const review = await adapter.startReview({
        commandId: "review-start-api-flex-retry-update",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        target: { type: "custom", instructions: "Retry the review through the API lane." },
    });
    assert.equal(usageRoutingLane(review.result), "openai_api");
    const retryRequests = transport.requests.slice(retryRequestOffset);
    assert.deepEqual(retryRequests.map((request) => request.method), ["thread/settings/update", "review/start"]);
    assert.deepEqual(retryRequests[0]?.params, { threadId: started.codexThreadId, serviceTier: "flex" });
    await adapter.closeAll();
});
test("Codex adapter restores flex after post-resume and post-fork quota fallbacks", async () => {
    for (const transition of ["resume", "fork"]) {
        const transport = new FakeCodexTransport();
        const events = [];
        const adapter = new CodexAdapter({
            env: { OPENAI_API_KEY: "fallback-key" },
            transportFactory: () => transport,
        });
        const payload = vmSessionStartPayload({
            initialTurnMode: "deferred",
            auth: chatGptWithApiFallbackAuth(),
        });
        const started = await adapter.startSession(payload, {
            onEvent: (event) => {
                events.push(event);
            },
        });
        if (transition === "resume") {
            await adapter.pauseSession({
                commandId: "pause-before-quota-fallback",
                sessionId: payload.sessionId,
                codexThreadId: started.codexThreadId,
                interruptActiveTurn: false,
                keepWarm: true,
            });
        }
        transport.rateLimitsResponse = {
            rateLimitsByLimitId: {
                codex: {
                    primary: { usedPercent: 100, windowDurationMins: 300 },
                    rateLimitReachedType: "usage_limit",
                },
            },
        };
        const transitionRequestOffset = transport.requests.length;
        const stickyPermissionOverrides = {
            approvalPolicy: "never",
            sandbox: "read-only",
        };
        const transitioned = transition === "resume"
            ? await adapter.resumeSession({
                commandId: "resume-into-api-fallback",
                sessionId: payload.sessionId,
                codexThreadId: started.codexThreadId,
                overrides: stickyPermissionOverrides,
            })
            : await adapter.forkThread({
                commandId: "fork-into-api-fallback",
                sessionId: payload.sessionId,
                codexThreadId: started.codexThreadId,
                overrides: stickyPermissionOverrides,
            });
        const transitionedThreadId = transitioned.codexThreadId ?? started.codexThreadId;
        const transitionRequests = transport.requests.slice(transitionRequestOffset);
        assert.equal(usageRoutingLane(transitioned.result), "openai_api", transition);
        assert.deepEqual(transitionRequests.map((request) => request.method), [transition === "resume" ? "thread/resume" : "thread/fork", "account/rateLimits/read", "account/login/start", "thread/settings/update"], transition);
        assert.equal((transitionRequests[0]?.params).approvalPolicy, "never", transition);
        assert.equal((transitionRequests[0]?.params).sandbox, "read-only", transition);
        assert.deepEqual(transitionRequests[3]?.params, { threadId: transitionedThreadId, serviceTier: "flex" }, transition);
        transport.reviewThreadId = transitionedThreadId;
        const reviewRequestOffset = transport.requests.length;
        await adapter.startReview({
            commandId: `review-after-${transition}-fallback`,
            sessionId: payload.sessionId,
            codexThreadId: transitionedThreadId,
            target: { type: "custom", instructions: "Review through restored API Flex." },
        });
        assert.deepEqual(transport.requests.slice(reviewRequestOffset).map((request) => request.method), ["review/start"], transition);
        transport.emit({
            method: "thread/tokenUsage/updated",
            params: {
                threadId: transitionedThreadId,
                tokenUsage: { total: { inputTokens: 10, outputTokens: 1, totalTokens: 11 } },
            },
        });
        const billingContext = [...events].reverse().find((event) => event.eventType === "metrics.updated")
            ?.payload.billingContext;
        assert.equal(billingContext?.lane, "openai_api", transition);
        assert.equal(billingContext?.serviceTier, "flex", transition);
        assert.equal(billingContext?.inferenceType, "flex", transition);
        await adapter.closeAll();
    }
});
test("Codex adapter appends Git safe-directory config env for host sessions", async () => {
    const transport = new FakeCodexTransport();
    let launchOptions;
    const rootPath = "/mnt/experiments/groups/201/experiments/e03-33333333";
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "test-key",
            GIT_CONFIG_COUNT: "1",
            GIT_CONFIG_KEY_0: "safe.directory",
            GIT_CONFIG_VALUE_0: "/existing/repo",
        },
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    await adapter.startSession(vmSessionStartPayload({
        layout: sessionLayout(rootPath),
        sensitiveHostPaths: [
            `${rootPath}/workspace/morpho-core/.git/yp-live-workflow-github-credential-helper.sh`,
            `${rootPath}/workspace/morpho-core/.git/yp-live-workflow-github-credential-helper.sh`,
        ],
    }));
    assert.equal(launchOptions?.env.GIT_CONFIG_COUNT, "2");
    assert.equal(launchOptions?.env.GIT_CONFIG_KEY_0, "safe.directory");
    assert.equal(launchOptions?.env.GIT_CONFIG_VALUE_0, "/existing/repo");
    assert.equal(launchOptions?.env.GIT_CONFIG_KEY_1, "safe.directory");
    assert.equal(launchOptions?.env.GIT_CONFIG_VALUE_1, `${rootPath}/workspace/morpho-core`);
});
test("Codex adapter maps legacy approval results to Codex app-server response payloads", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const requestedPermissions = {
        fileSystem: null,
        network: { enabled: true },
    };
    await adapter.startSession(vmSessionStartPayload({ initialTurnMode: "deferred" }));
    transport.emit({
        id: 41,
        method: "item/commandExecution/requestApproval",
        params: { itemId: "command-item", threadId: "thread-1", turnId: "turn-1", command: ["npm", "test"] },
    });
    transport.emit({
        id: 42,
        method: "item/fileChange/requestApproval",
        params: { itemId: "file-item", threadId: "thread-1", turnId: "turn-1", changes: [] },
    });
    transport.emit({
        id: 43,
        method: "item/permissions/requestApproval",
        params: {
            itemId: "permissions-item",
            threadId: "thread-1",
            turnId: "turn-1",
            cwd: "/workspace/root",
            startedAtMs: 1,
            permissions: requestedPermissions,
        },
    });
    transport.emit({
        id: 44,
        method: "item/permissions/requestApproval",
        params: {
            itemId: "permissions-session-item",
            threadId: "thread-1",
            turnId: "turn-1",
            cwd: "/workspace/root",
            startedAtMs: 1,
            permissions: requestedPermissions,
        },
    });
    await sleep(1);
    await adapter.respondToApproval({
        commandId: "approval-command-1",
        sessionId: "session-id",
        requestId: 41,
        result: { decision: "approved" },
    });
    await adapter.respondToApproval({
        commandId: "approval-command-2",
        sessionId: "session-id",
        requestId: 42,
        result: { decision: "approved" },
    });
    await adapter.respondToApproval({
        commandId: "approval-command-3",
        sessionId: "session-id",
        requestId: 43,
        result: { decision: "approved" },
    });
    await adapter.respondToApproval({
        commandId: "approval-command-4",
        sessionId: "session-id",
        requestId: 44,
        result: { decision: "acceptForSession" },
    });
    assert.deepEqual(transport.serverResponses, [
        { id: 41, result: { decision: "accept" } },
        { id: 42, result: { decision: "accept" } },
        { id: 43, result: { permissions: requestedPermissions } },
        { id: 44, result: { permissions: requestedPermissions, scope: "session" } },
    ]);
    await adapter.respondToApproval({
        commandId: "approval-command-1-retry",
        sessionId: "session-id",
        requestId: 41,
        result: { decision: "approved" },
    });
    assert.equal(transport.serverResponses.length, 4);
});
test("Codex adapter does not relaunch while answering approval responses from a dead transport", async () => {
    const transport = new FakeCodexTransport();
    let launchCount = 0;
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => {
            launchCount += 1;
            return transport;
        },
    });
    await adapter.startSession(vmSessionStartPayload());
    transport.emit({
        id: 45,
        method: "item/commandExecution/requestApproval",
        params: {
            itemId: "command-item",
            threadId: "thread-1",
            turnId: "turn-1",
            command: "python script.py",
            cwd: "/workspace/root",
        },
    });
    transport.emitExit({ exitCode: 137, signal: null, error: "app-server exited" });
    await assert.rejects(adapter.respondToApproval({
        commandId: "approval-command-dead-transport",
        sessionId: "session-id",
        requestId: 45,
        result: { decision: "approved" },
    }), /app-server transport exited/);
    assert.equal(launchCount, 1);
    assert.deepEqual(transport.serverResponses, []);
});
test("Codex adapter rejects stale approvals after an unrelated warm relaunch", async () => {
    const oldTransport = new FakeCodexTransport();
    const newTransport = new FakeCodexTransport();
    const transports = [oldTransport, newTransport];
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => {
            const transport = transports.shift();
            if (!transport) {
                throw new Error("unexpected extra transport launch");
            }
            return transport;
        },
    });
    const started = await adapter.startSession(vmSessionStartPayload({ initialTurnMode: "deferred" }));
    oldTransport.emit({
        id: 45,
        method: "item/commandExecution/requestApproval",
        params: {
            itemId: "command-item",
            threadId: "thread-1",
            turnId: "turn-1",
            command: "python script.py",
            cwd: "/workspace/root",
        },
    });
    oldTransport.emitExit({ exitCode: 137, signal: null, error: "app-server exited" });
    await adapter.startTurn({
        commandId: "turn-start-after-exit",
        sessionId: "session-id",
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    });
    await assert.rejects(adapter.respondToApproval({
        commandId: "approval-command-stale-after-relaunch",
        sessionId: "session-id",
        requestId: 45,
        result: { decision: "approved" },
    }), /app-server transport exited/);
    assert.deepEqual(oldTransport.serverResponses, []);
    assert.deepEqual(newTransport.serverResponses, []);
});
test("Codex adapter rejects stale approvals after an intentional transport replacement", async () => {
    const oldTransport = new FakeCodexTransport();
    const newTransport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => oldTransport,
    });
    await adapter.startSession(vmSessionStartPayload({ initialTurnMode: "deferred" }));
    oldTransport.emit({
        id: 46,
        method: "item/commandExecution/requestApproval",
        params: {
            itemId: "command-item",
            threadId: "thread-1",
            turnId: "turn-1",
            command: "python script.py",
            cwd: "/workspace/root",
        },
    });
    const internals = adapter;
    const state = internals.sessions.get("session-id");
    assert.ok(state);
    internals.replaceSessionTransportFromLaunch(state, {
        transport: newTransport,
        codexCwd: "/workspace/root",
        codexHomePath: "/codex-home",
        networkMode: null,
        runtimeMetadata: {},
    });
    await assert.rejects(adapter.respondToApproval({
        commandId: "approval-command-stale-after-intentional-replace",
        sessionId: "session-id",
        requestId: 46,
        result: { decision: "approved" },
    }), /app-server transport exited/);
    assert.deepEqual(oldTransport.serverResponses, []);
    assert.deepEqual(newTransport.serverResponses, []);
});
test("Codex adapter emits selected console lifecycle events", async () => {
    const transport = new FakeCodexTransport();
    const consoleEvents = [];
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
        consoleEventSink: (event) => consoleEvents.push(formatVmAgentConsoleEvent(event, { colors: false })),
    });
    await adapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            modelDefaults: { model: "gpt-5.5", serviceTier: "flex", reasoningEffort: "xhigh" },
            codexConfig: {},
        },
    }));
    transport.emit({
        method: "item/started",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            item: { id: "web-search-1", type: "webSearch", query: "latest H3K27me3 senescence preprint" },
        },
    });
    transport.emit({
        method: "item/completed",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            item: {
                id: "web-search-1",
                type: "webSearch",
                query: "latest H3K27me3 senescence preprint",
                action: { type: "search", query: "latest H3K27me3 senescence preprint" },
            },
        },
    });
    transport.emit({
        method: "turn/completed",
        params: { threadId: "thread-1", turnId: "turn-1", turn: { id: "turn-1", status: "completed" } },
    });
    assert.deepEqual(consoleEvents, [
        "[codex] auth.ready session=session-id mode=codex_chatgpt_with_api_fallback login=apiKey lane=openai_api fallback=enabled",
        "[codex] thread.started session=session-id thread=thread-1",
        "[codex] turn.start session=session-id thread=thread-1 model=gpt-5.5 tier=flex effort=xhigh",
        "[codex] turn.started session=session-id thread=thread-1 turn=turn-1",
        '[codex] web_search.started session=session-id thread=thread-1 turn=turn-1 item=web-search-1 query="latest H3K27me3 senescence preprint"',
        '[codex] web_search.completed session=session-id thread=thread-1 turn=turn-1 item=web-search-1 action=search query="latest H3K27me3 senescence preprint"',
        "[codex] turn.completed session=session-id thread=thread-1 turn=turn-1 status=completed",
    ]);
});
test("Codex adapter can defer the initial turn after thread start", async () => {
    const transport = new FakeCodexTransport();
    const forwardedEvents = [];
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const result = await adapter.startSession(vmSessionStartPayload({ initialTurnMode: "deferred" }), {
        onEvent: (event) => {
            forwardedEvents.push(event.eventType);
        },
    });
    assert.deepEqual(transport.requests.map((request) => request.method), [
        "initialize",
        "account/login/start",
        "thread/start",
    ]);
    assert.equal(result.codexThreadId, "thread-1");
    assert.equal(result.codexTurnId, null);
    assert.deepEqual(result.events.map((event) => event.eventType), ["thread.started"]);
    assert.deepEqual(forwardedEvents, ["thread.started"]);
    assert.equal(result.runtimeMetadata.initialTurnMode, "deferred");
});
test("Codex adapter schedules a retry when the session's initial turn request rejects transiently", async () => {
    const transport = new FakeCodexTransport();
    const forwardedEvents = [];
    transport.requestErrors.set("turn/start", new Error("Model is at full capacity"));
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "20",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "20",
        },
        transportFactory: () => transport,
        retryRandom: () => 1,
    });
    const result = await adapter.startSession(vmSessionStartPayload(), {
        onEvent: (event) => {
            forwardedEvents.push(event);
        },
    });
    assert.equal(result.codexTurnId, null);
    assert.equal(result.runtimeMetadata.initialTurnRetryScheduled, true);
    assert.equal(result.pendingLogicalTurnRetry?.method, "turn/start");
    assert.equal(result.pendingLogicalTurnRetry?.metadata.attempt, 1);
    assert.equal(forwardedEvents.at(-1)?.eventType, "session.error");
    transport.requestErrors.delete("turn/start");
    await waitFor(() => transport.requests.filter((request) => request.method === "turn/start").length >= 2);
    assert.equal(transport.requests.filter((request) => request.method === "turn/start").length, 2);
    const retriedTurnStarted = forwardedEvents.find((event) => event.eventType === "turn.started");
    assert.equal(retriedTurnStarted?.payload.logicalTurnRetryStarted?.method, "turn/start");
    await adapter.closeAll();
});
test("Codex adapter releases VM capacity when app-server emits a session error", async () => {
    const transport = new FakeCodexTransport();
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        defaultImage: OfficialCodexAppServerImage,
        maxCodexSessions: 1,
        transportFactory: () => transport,
    });
    const adapter = new CodexAdapter({
        dockerRuntime,
        env: { OPENAI_API_KEY: "test-key" },
    });
    await adapter.startSession(vmSessionStartPayload({ initialTurnMode: "deferred" }));
    assert.equal(dockerRuntime.getStatus().activeCodexSessions, 1);
    transport.emit({
        method: "error",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            error: { message: "usage limit exceeded" },
        },
    });
    assert.equal(dockerRuntime.getSession("session-id")?.status, "failed");
    assert.equal(dockerRuntime.getStatus().activeCodexSessions, 0);
    assert.deepEqual(dockerRuntime.getStatus().sessionCountsByStatus, { failed: 1 });
});
test("Codex adapter keeps sessions active for app-server reconnect progress errors", async () => {
    const transport = new FakeCodexTransport();
    const forwardedEvents = [];
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        defaultImage: OfficialCodexAppServerImage,
        maxCodexSessions: 1,
        transportFactory: () => transport,
    });
    const adapter = new CodexAdapter({
        dockerRuntime,
        env: { OPENAI_API_KEY: "test-key" },
    });
    await adapter.startSession(vmSessionStartPayload({ initialTurnMode: "deferred" }), {
        onEvent: (event) => {
            forwardedEvents.push(event);
        },
    });
    assert.equal(dockerRuntime.getStatus().activeCodexSessions, 1);
    transport.emit({
        method: "error",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            message: "Reconnecting... 2/5",
        },
    });
    assert.equal(forwardedEvents.at(-1)?.eventType, "session.error");
    assert.equal(dockerRuntime.getSession("session-id")?.status, "running");
    assert.equal(dockerRuntime.getStatus().activeCodexSessions, 1);
});
test("Codex adapter keeps sessions active while app-server owns an overloaded turn retry", async () => {
    const transport = new FakeCodexTransport();
    const forwardedEvents = [];
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        defaultImage: OfficialCodexAppServerImage,
        maxCodexSessions: 1,
        transportFactory: () => transport,
    });
    const adapter = new CodexAdapter({
        dockerRuntime,
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "1",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "1",
        },
        retryRandom: () => 1,
    });
    await adapter.startSession(vmSessionStartPayload(), {
        onEvent: (event) => {
            forwardedEvents.push(event);
        },
    });
    const initialTurnStarts = transport.requests.filter((request) => request.method === "turn/start").length;
    transport.emit({
        method: "error",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            willRetry: true,
            error: { message: "Model is at full capacity", codexErrorInfo: "serverOverloaded" },
        },
    });
    await sleep(10);
    assert.equal(dockerRuntime.getSession("session-id")?.status, "running");
    assert.equal(dockerRuntime.getStatus().activeCodexSessions, 1);
    assert.equal(transport.requests.filter((request) => request.method === "turn/start").length, initialTurnStarts);
    assert.equal(forwardedEvents.at(-1)?.payload.willRetry, true);
    await adapter.closeAll();
});
test("Codex adapter replays exhausted capacity failures without releasing the session", async () => {
    const transport = new FakeCodexTransport();
    const forwardedEvents = [];
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        defaultImage: OfficialCodexAppServerImage,
        maxCodexSessions: 1,
        transportFactory: () => transport,
    });
    const adapter = new CodexAdapter({
        dockerRuntime,
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "1",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "1",
        },
        retryRandom: () => 1,
    });
    await adapter.startSession(vmSessionStartPayload(), {
        onEvent: (event) => {
            forwardedEvents.push(event);
        },
    });
    transport.emit({
        method: "error",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            willRetry: false,
            error: { message: "Try a different model; this one is at full capacity", codexErrorInfo: "serverOverloaded" },
        },
    });
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            turn: { id: "turn-1", status: "failed" },
        },
    });
    await waitFor(() => transport.requests.filter((request) => request.method === "turn/start").length >= 2);
    const retryingEvents = forwardedEvents.filter((event) => {
        const retry = event.payload.ypLiveWorkflowRetry;
        return Boolean(retry && typeof retry === "object" && !Array.isArray(retry));
    });
    assert.equal(retryingEvents.some((event) => event.eventType === "session.error"), true);
    assert.equal(retryingEvents.some((event) => event.eventType === "turn.completed"), true);
    assert.equal(dockerRuntime.getSession("session-id")?.status, "running");
    assert.equal(dockerRuntime.getStatus().activeCodexSessions, 1);
    const retriedTurnStarted = forwardedEvents.find((event) => event.eventType === "turn.started" && event.codexTurnId === "turn-2");
    assert.equal(retriedTurnStarted?.payload.logicalTurnRetryStarted?.turnId, "turn-1");
    const steered = await adapter.steerTurn({
        commandId: "steer-retried-turn-command-1",
        sessionId: "session-id",
        codexThreadId: "thread-1",
        codexTurnId: "turn-1",
        input: [{ type: "text", text: "Focus the retried turn." }],
    });
    assert.equal(steered.codexTurnId, "turn-1");
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            turn: { id: "turn-1", status: "completed" },
        },
    });
    await sleep(5);
    assert.equal(transport.requests.filter((request) => request.method === "turn/start").length, 2);
    await adapter.closeAll();
});
test("Codex adapter does not restore a completed turn from a late turn start response", async () => {
    const transport = new FakeCodexTransport();
    const forwardedEvents = [];
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "1",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "1",
        },
        transportFactory: () => transport,
        retryRandom: () => 1,
    });
    const payload = vmSessionStartPayload({ initialTurnMode: "deferred" });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            forwardedEvents.push(event);
        },
    });
    transport.turnStartResponseHook = async (turnId) => {
        transport.turnStartResponseHook = undefined;
        transport.emit({
            method: "error",
            params: {
                threadId: started.codexThreadId,
                turnId,
                willRetry: false,
                error: { message: "Model is at full capacity", codexErrorInfo: "serverOverloaded" },
            },
        });
        transport.emit({
            method: "turn/completed",
            params: {
                threadId: started.codexThreadId,
                turnId,
                turn: { id: turnId, status: "failed" },
            },
        });
        transport.turnStartId = "turn-2";
    };
    const ack = await adapter.startTurn({
        commandId: "late-turn-start-response-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    });
    assert.equal(ack.codexTurnId, null);
    assert.equal(typeof ack.result?.vmEventStreamId, "string");
    assert.equal(typeof ack.result?.vmEventSeqBoundary, "number");
    const retryEvent = forwardedEvents.find((event) => event.eventType === "turn.completed");
    const pendingRetry = retryEvent?.payload.pendingLogicalTurnRetry;
    assert.equal(pendingRetry?.method, "turn/start");
    assert.equal(pendingRetry?.params?.threadId, started.codexThreadId);
    await waitFor(() => transport.requests.filter((request) => request.method === "turn/start").length >= 2);
    await waitFor(() => forwardedEvents.some((event) => event.eventType === "turn.started" && event.codexTurnId === "turn-2"));
    await adapter.closeAll();
});
test("Codex adapter keeps retrying exhausted credits with exponential delays capped by configuration", async () => {
    const transport = new FakeCodexTransport();
    const forwardedEvents = [];
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "2",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "4",
        },
        transportFactory: () => transport,
        retryRandom: () => 1,
    });
    const started = await adapter.startSession(vmSessionStartPayload(), {
        onEvent: (event) => {
            forwardedEvents.push(event);
        },
    });
    transport.requestErrors.set("turn/start", new Error("429 insufficient_quota: credits depleted"));
    transport.emit({
        method: "error",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            willRetry: false,
            error: { message: "Credits depleted", codexErrorInfo: "usageLimitExceeded" },
        },
    });
    transport.emit({
        method: "turn/completed",
        params: { threadId: "thread-1", turnId: "turn-1", turn: { id: "turn-1", status: "failed" } },
    });
    await waitFor(() => forwardedEvents.some((event) => {
        const retry = event.payload.ypLiveWorkflowRetry;
        return retry?.attempt === 2;
    }));
    const secondRetryEvent = forwardedEvents.find((event) => {
        const retry = event.payload.ypLiveWorkflowRetry;
        return Boolean(retry && typeof retry === "object" && !Array.isArray(retry) && retry.attempt === 2);
    });
    const secondRetry = secondRetryEvent?.payload.ypLiveWorkflowRetry;
    assert.equal(secondRetry.classification, "usage_limit");
    assert.equal(secondRetry.nominalDelayMs, 4);
    assert.equal(secondRetryEvent?.payload.pendingLogicalTurnRetry?.turnId, started.codexTurnId);
    const interrupted = await adapter.interruptTurn({
        commandId: "interrupt-retry-request-failure-command-1",
        sessionId: "session-id",
        codexThreadId: started.codexThreadId,
    });
    assert.equal(interrupted.result?.interruptedRetry, true);
    assert.equal(interrupted.result?.interruptedTurnId, started.codexTurnId);
    await adapter.closeAll();
});
test("Codex adapter schedules a retry when the initial turn request rejects transiently", async () => {
    const transport = new FakeCodexTransport();
    const forwardedEvents = [];
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "20",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "20",
        },
        transportFactory: () => transport,
        retryRandom: () => 1,
    });
    const payload = vmSessionStartPayload({ initialTurnMode: "deferred" });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            forwardedEvents.push(event);
        },
    });
    transport.requestErrors.set("turn/start", new Error("Model is at full capacity"));
    const ack = await adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    });
    assert.equal(ack.result?.retryScheduled, true);
    assert.equal(ack.codexTurnId, null);
    assert.equal(ack.result?.pendingLogicalTurnRetry?.method, "turn/start");
    assert.equal(forwardedEvents.at(-1)?.eventType, "session.error");
    assert.equal(forwardedEvents.at(-1)?.payload.ypLiveWorkflowRetry?.attempt, 1);
    transport.requestErrors.delete("turn/start");
    await waitFor(() => transport.requests.filter((request) => request.method === "turn/start").length >= 2);
    assert.equal(transport.requests.filter((request) => request.method === "turn/start").length, 2);
    await adapter.closeAll();
});
test("Codex adapter keeps flex in retry state while translating each physical lane request", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "20",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "20",
        },
        transportFactory: () => transport,
        retryRandom: () => 1,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    transport.requestErrors.set("turn/start", new Error("Model is at full capacity"));
    const ack = await adapter.startTurn({
        commandId: "turn-start-flex-lane-retry",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    });
    const pendingRetry = ack.result?.pendingLogicalTurnRetry;
    const pendingParams = pendingRetry?.params;
    assert.equal(pendingParams?.serviceTier, "flex");
    const firstTurnParams = transport.requests.find((request) => request.method === "turn/start")
        ?.params;
    assert.equal(firstTurnParams.serviceTier, null);
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1779000000 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    transport.requestErrors.delete("turn/start");
    await waitFor(() => transport.requests.filter((request) => request.method === "turn/start").length >= 2);
    const physicalTurns = transport.requests.filter((request) => request.method === "turn/start");
    assert.equal((physicalTurns[1]?.params).serviceTier, "flex");
    await adapter.closeAll();
});
test("Codex adapter cancels a turnless pending retry through session interrupt", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "30",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "30",
        },
        transportFactory: () => transport,
        retryRandom: () => 1,
    });
    const payload = vmSessionStartPayload({ initialTurnMode: "deferred" });
    const started = await adapter.startSession(payload);
    transport.requestErrors.set("turn/start", new Error("Model is at full capacity"));
    await adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    });
    const interrupted = await adapter.interruptTurn({
        commandId: "interrupt-retry-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.equal(interrupted.result?.interruptedRetry, true);
    assert.equal(interrupted.result?.interruptedTurnId, null);
    transport.requestErrors.delete("turn/start");
    await sleep(50);
    assert.equal(transport.requests.filter((request) => request.method === "turn/start").length, 1);
    await assert.rejects(adapter.interruptTurn({
        commandId: "interrupt-without-turn-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    }), /requires a turn id/);
    await adapter.closeAll();
});
test("Codex adapter preserves the completed turn id when cancelling its pending retry", async () => {
    const transport = new FakeCodexTransport();
    const forwardedEvents = [];
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "30",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "30",
        },
        transportFactory: () => transport,
        retryRandom: () => 1,
    });
    const payload = vmSessionStartPayload();
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            forwardedEvents.push(event);
        },
    });
    transport.emit({
        method: "error",
        params: {
            threadId: started.codexThreadId,
            turnId: started.codexTurnId,
            willRetry: false,
            error: { message: "Model is at full capacity", codexErrorInfo: "serverOverloaded" },
        },
    });
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: started.codexThreadId,
            turnId: started.codexTurnId,
            turn: { id: started.codexTurnId, status: "failed" },
        },
    });
    const retryingCompletion = forwardedEvents.find((event) => event.eventType === "turn.completed");
    assert.equal(retryingCompletion?.payload.ypLiveWorkflowRetry?.scheduled, true);
    const interrupted = await adapter.interruptTurn({
        commandId: "interrupt-completed-retry-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.equal(interrupted.result?.interruptedRetry, true);
    assert.equal(interrupted.result?.interruptedTurnId, started.codexTurnId);
    assert.equal(transport.requests.filter((request) => request.method === "turn/interrupt").length, 0);
    await sleep(50);
    assert.equal(transport.requests.filter((request) => request.method === "turn/start").length, 1);
    await adapter.closeAll();
});
test("Codex adapter interrupts an active turn before cancelling its scheduled retry", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "30",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "30",
        },
        transportFactory: () => transport,
        retryRandom: () => 1,
    });
    const payload = vmSessionStartPayload();
    const started = await adapter.startSession(payload);
    transport.emit({
        method: "error",
        params: {
            threadId: started.codexThreadId,
            turnId: started.codexTurnId,
            willRetry: false,
            error: { message: "Model is at full capacity", codexErrorInfo: "serverOverloaded" },
        },
    });
    const interrupted = await adapter.interruptTurn({
        commandId: "interrupt-active-retry-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        codexTurnId: "stale-api-turn",
    });
    const interruptRequest = [...transport.requests].reverse().find((request) => request.method === "turn/interrupt");
    assert.deepEqual(interruptRequest?.params, {
        threadId: started.codexThreadId,
        turnId: started.codexTurnId,
    });
    assert.equal(interrupted.result?.interruptedRetry, true);
    assert.equal(interrupted.result?.interruptedTurnId, started.codexTurnId);
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: started.codexThreadId,
            turnId: started.codexTurnId,
            turn: { id: started.codexTurnId, status: "interrupted" },
        },
    });
    await sleep(50);
    assert.equal(transport.requests.filter((request) => request.method === "turn/start").length, 1);
    await adapter.closeAll();
});
test("Codex adapter preserves a suspended retry after a pause interruption completes", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "20",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "20",
        },
        transportFactory: () => transport,
        retryRandom: () => 1,
    });
    const payload = vmSessionStartPayload();
    const started = await adapter.startSession(payload);
    transport.emit({
        method: "error",
        params: {
            threadId: started.codexThreadId,
            turnId: started.codexTurnId,
            willRetry: false,
            error: { message: "Model is at full capacity", codexErrorInfo: "serverOverloaded" },
        },
    });
    const paused = await adapter.pauseSession({
        commandId: "pause-active-retry-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        codexTurnId: started.codexTurnId,
        interruptActiveTurn: true,
        keepWarm: true,
    });
    assert.equal(paused.result?.pendingLogicalTurnRetry?.method, "turn/start");
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: started.codexThreadId,
            turnId: started.codexTurnId,
            turn: { id: started.codexTurnId, status: "interrupted" },
        },
    });
    await sleep(30);
    assert.equal(transport.requests.filter((request) => request.method === "turn/start").length, 1);
    await adapter.resumeSession({
        commandId: "resume-active-retry-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    await waitFor(() => transport.requests.filter((request) => request.method === "turn/start").length >= 2);
    assert.equal(transport.requests.filter((request) => request.method === "turn/start").length, 2);
    await adapter.closeAll();
});
test("Codex adapter waits for pause interruption completion before rearming a resumed retry", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "1",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "1",
        },
        transportFactory: () => transport,
        retryRandom: () => 1,
    });
    const payload = vmSessionStartPayload();
    const started = await adapter.startSession(payload);
    transport.emit({
        method: "error",
        params: {
            threadId: started.codexThreadId,
            turnId: started.codexTurnId,
            willRetry: false,
            error: { message: "Model is at full capacity", codexErrorInfo: "serverOverloaded" },
        },
    });
    await adapter.pauseSession({
        commandId: "pause-before-interrupt-completion-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        codexTurnId: started.codexTurnId,
        interruptActiveTurn: true,
        keepWarm: true,
    });
    await adapter.resumeSession({
        commandId: "resume-before-interrupt-completion-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    await sleep(10);
    assert.equal(transport.requests.filter((request) => request.method === "turn/start").length, 1);
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: started.codexThreadId,
            turnId: started.codexTurnId,
            turn: { id: started.codexTurnId, status: "interrupted" },
        },
    });
    await waitFor(() => transport.requests.filter((request) => request.method === "turn/start").length >= 2);
    assert.equal(transport.requests.filter((request) => request.method === "turn/start").length, 2);
    await adapter.closeAll();
});
test("Codex adapter suspends retries that are first scheduled after pause", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "20",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "20",
        },
        transportFactory: () => transport,
        retryRandom: () => 1,
    });
    const payload = vmSessionStartPayload();
    const started = await adapter.startSession(payload);
    await adapter.pauseSession({
        commandId: "pause-before-retry-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        codexTurnId: started.codexTurnId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    transport.emit({
        method: "error",
        params: {
            threadId: started.codexThreadId,
            turnId: started.codexTurnId,
            willRetry: false,
            error: { message: "Model is at full capacity", codexErrorInfo: "serverOverloaded" },
        },
    });
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: started.codexThreadId,
            turnId: started.codexTurnId,
            turn: { id: started.codexTurnId, status: "failed" },
        },
    });
    await sleep(30);
    assert.equal(transport.requests.filter((request) => request.method === "turn/start").length, 1);
    await adapter.resumeSession({
        commandId: "resume-after-late-retry-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    await waitFor(() => transport.requests.filter((request) => request.method === "turn/start").length >= 2);
    assert.equal(transport.requests.filter((request) => request.method === "turn/start").length, 2);
    await adapter.closeAll();
});
test("Codex adapter ignores retry completion after session ownership is lost", async () => {
    const transport = new FakeCodexTransport();
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        defaultImage: OfficialCodexAppServerImage,
        maxCodexSessions: 1,
        transportFactory: () => transport,
    });
    let releaseRetryRequest = () => undefined;
    const retryRequestGate = new Promise((resolve) => {
        releaseRetryRequest = resolve;
    });
    let notifyRetryRequestStarted = () => undefined;
    const retryRequestStarted = new Promise((resolve) => {
        notifyRetryRequestStarted = resolve;
    });
    let turnStartCount = 0;
    transport.requestHook = async (method) => {
        if (method !== "turn/start") {
            return;
        }
        turnStartCount += 1;
        if (turnStartCount === 2) {
            notifyRetryRequestStarted();
            await retryRequestGate;
        }
    };
    const forwardedEvents = [];
    const adapter = new CodexAdapter({
        dockerRuntime,
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "1",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "1",
        },
        retryRandom: () => 1,
    });
    const payload = vmSessionStartPayload();
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            forwardedEvents.push(event);
        },
    });
    transport.emit({
        method: "error",
        params: {
            threadId: started.codexThreadId,
            turnId: started.codexTurnId,
            willRetry: false,
            error: { message: "Model is at full capacity", codexErrorInfo: "serverOverloaded" },
        },
    });
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: started.codexThreadId,
            turnId: started.codexTurnId,
            turn: { id: started.codexTurnId, status: "failed" },
        },
    });
    await retryRequestStarted;
    await adapter.closeSession(payload.sessionId);
    await dockerRuntime.terminateSession(payload.sessionId);
    const eventCountAfterClose = forwardedEvents.length;
    releaseRetryRequest();
    await sleep(10);
    assert.equal(dockerRuntime.getSession(payload.sessionId)?.status, "stopped");
    assert.equal(forwardedEvents.length, eventCountAfterClose);
});
test("Codex adapter persists and restores a pending retry across a cold pause", async () => {
    const initialTransport = new FakeCodexTransport();
    const initialAdapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "30",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "30",
        },
        transportFactory: () => initialTransport,
        retryRandom: () => 1,
    });
    const payload = vmSessionStartPayload({ initialTurnMode: "deferred" });
    const started = await initialAdapter.startSession(payload);
    initialTransport.requestErrors.set("turn/start", new Error("Model is at full capacity"));
    await initialAdapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue after resume." }],
    });
    const paused = await initialAdapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: false,
    });
    const pendingLogicalTurnRetry = paused.result?.pendingLogicalTurnRetry;
    assert.equal(pendingLogicalTurnRetry?.method, "turn/start");
    assert.equal(pendingLogicalTurnRetry?.metadata.attempt, 1);
    assert.equal(initialTransport.closeCount, 1);
    const resumedTransport = new FakeCodexTransport();
    const resumedAdapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => resumedTransport,
    });
    const coldStarted = await resumedAdapter.startSession(vmSessionStartPayload({
        commandId: "cold-start-command-1",
        codexThreadId: started.codexThreadId,
        initialTurnMode: "deferred",
        pendingLogicalTurnRetry,
    }));
    assert.equal(coldStarted.runtimeMetadata.logicalTurnRetryRestored, true);
    await sleep(50);
    assert.equal(resumedTransport.requests.filter((request) => request.method === "turn/start").length, 0);
    await resumedAdapter.resumeSession({
        commandId: "resume-retry-command-1",
        sessionId: payload.sessionId,
        codexThreadId: coldStarted.codexThreadId,
    });
    await waitFor(() => resumedTransport.requests.some((request) => request.method === "turn/start"));
    const retried = resumedTransport.requests.find((request) => request.method === "turn/start");
    const retriedParams = retried?.params;
    assert.equal(retriedParams.threadId, coldStarted.codexThreadId);
    assert.deepEqual(retriedParams.input, [{ type: "text", text: "Continue after resume.", text_elements: [] }]);
    await resumedAdapter.closeAll();
});
test("Codex adapter restores the completed turn id when cancelling a cold pending retry", async () => {
    const initialTransport = new FakeCodexTransport();
    const initialAdapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "1000",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "1000",
        },
        transportFactory: () => initialTransport,
        retryRandom: () => 1,
    });
    const payload = vmSessionStartPayload();
    const started = await initialAdapter.startSession(payload);
    initialTransport.emit({
        method: "error",
        params: {
            threadId: started.codexThreadId,
            turnId: started.codexTurnId,
            willRetry: false,
            error: { message: "Model is at full capacity", codexErrorInfo: "serverOverloaded" },
        },
    });
    initialTransport.emit({
        method: "turn/completed",
        params: {
            threadId: started.codexThreadId,
            turnId: started.codexTurnId,
            turn: { id: started.codexTurnId, status: "failed" },
        },
    });
    const paused = await initialAdapter.pauseSession({
        commandId: "pause-completed-retry-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: false,
    });
    const pendingLogicalTurnRetry = paused.result?.pendingLogicalTurnRetry;
    assert.equal(pendingLogicalTurnRetry?.turnId, started.codexTurnId);
    const resumedTransport = new FakeCodexTransport();
    const resumedAdapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => resumedTransport,
    });
    const coldStarted = await resumedAdapter.startSession(vmSessionStartPayload({
        commandId: "cold-start-completed-retry-command-1",
        codexThreadId: started.codexThreadId,
        initialTurnMode: "deferred",
        pendingLogicalTurnRetry,
    }));
    assert.equal(coldStarted.pendingLogicalTurnRetry?.turnId, started.codexTurnId);
    const interrupted = await resumedAdapter.interruptTurn({
        commandId: "interrupt-cold-completed-retry-command-1",
        sessionId: payload.sessionId,
        codexThreadId: coldStarted.codexThreadId,
    });
    assert.equal(interrupted.result?.interruptedRetry, true);
    assert.equal(interrupted.result?.interruptedTurnId, started.codexTurnId);
    assert.equal(resumedTransport.requests.filter((request) => request.method === "turn/interrupt").length, 0);
    await resumedAdapter.closeAll();
});
test("Codex adapter schedules a retry when the initial review request rejects transiently", async () => {
    const transport = new FakeCodexTransport();
    const forwardedEvents = [];
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "20",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "20",
        },
        transportFactory: () => transport,
        retryRandom: () => 1,
    });
    const payload = vmSessionStartPayload({ initialTurnMode: "deferred" });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            forwardedEvents.push(event);
        },
    });
    transport.requestErrors.set("review/start", new Error("429 rate limit exceeded"));
    const ack = await adapter.startReview({
        commandId: "review-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        target: { type: "custom", instructions: "Review the current work." },
    });
    assert.equal(ack.result?.retryScheduled, true);
    assert.equal(ack.codexTurnId, null);
    assert.equal(ack.result?.pendingLogicalTurnRetry?.method, "review/start");
    assert.equal(forwardedEvents.at(-1)?.eventType, "session.error");
    assert.equal(forwardedEvents.at(-1)?.payload.ypLiveWorkflowRetry?.classification, "usage_limit");
    transport.requestErrors.delete("review/start");
    await waitFor(() => transport.requests.filter((request) => request.method === "review/start").length >= 2);
    assert.equal(transport.requests.filter((request) => request.method === "review/start").length, 2);
    await adapter.closeAll();
});
test("Codex adapter restores flex before a review retry crosses to API fallback", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "30",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "30",
        },
        transportFactory: () => transport,
        retryRandom: () => 1,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    transport.requestErrors.set("review/start", new Error("429 rate limit exceeded"));
    const ack = await adapter.startReview({
        commandId: "review-start-before-api-fallback",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        target: { type: "custom", instructions: "Retry this review through the API lane." },
    });
    assert.equal(ack.result?.retryScheduled, true);
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    transport.requestErrors.delete("review/start");
    const retryRequestOffset = transport.requests.length;
    await waitFor(() => transport.requests.filter((request) => request.method === "review/start").length >= 2);
    const retryRequests = transport.requests.slice(retryRequestOffset);
    assert.deepEqual(retryRequests.map((request) => request.method), ["account/rateLimits/read", "account/login/start", "thread/settings/update", "review/start"]);
    assert.equal((retryRequests[2]?.params).serviceTier, "flex");
    assert.equal("serviceTier" in (retryRequests[3]?.params ?? {}), false);
    transport.emit({
        method: "thread/tokenUsage/updated",
        params: {
            threadId: started.codexThreadId,
            tokenUsage: { total: { inputTokens: 10, outputTokens: 1, totalTokens: 11 } },
        },
    });
    const billingContext = [...events].reverse().find((event) => event.eventType === "metrics.updated")
        ?.payload.billingContext;
    assert.equal(billingContext?.lane, "openai_api");
    assert.equal(billingContext?.serviceTier, "flex");
    assert.equal(billingContext?.inferenceType, "flex");
    await adapter.closeAll();
});
test("Codex adapter preserves detached review retry identity across pause and restart", async () => {
    const transport = new FakeCodexTransport();
    transport.reviewThreadId = "thread-detached-review-1";
    const forwardedEvents = [];
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "100",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "100",
        },
        transportFactory: () => transport,
        retryRandom: () => 1,
    });
    const payload = vmSessionStartPayload({ initialTurnMode: "deferred" });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            forwardedEvents.push(event);
        },
    });
    await adapter.startReview({
        commandId: "detached-review-before-pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        target: { type: "custom", instructions: "Review the current work." },
        delivery: "detached",
    });
    transport.emit({
        method: "error",
        params: {
            threadId: "thread-detached-review-1",
            turnId: "review-turn-1",
            willRetry: false,
            error: { message: "429 rate limit exceeded", codexErrorInfo: "usageLimit" },
        },
    });
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: "thread-detached-review-1",
            turnId: "review-turn-1",
            turn: { id: "review-turn-1", status: "failed" },
        },
    });
    const paused = await adapter.pauseSession({
        commandId: "pause-detached-review-retry-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    assert.equal(paused.result?.pendingLogicalTurnRetry?.method, "review/start");
    transport.reviewThreadId = "thread-detached-review-2";
    transport.reviewTurnId = "review-turn-2";
    await adapter.resumeSession({
        commandId: "resume-detached-review-retry-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    await waitFor(() => transport.requests.filter((request) => request.method === "review/start").length >= 2);
    const restartedReview = forwardedEvents.find((event) => event.eventType === "turn.started" && event.codexTurnId === "review-turn-2");
    assert.equal(restartedReview?.codexThreadId, "thread-detached-review-2");
    assert.equal(restartedReview?.payload.logicalTurnRetryStarted?.method, "review/start");
    await adapter.closeAll();
});
test("Codex adapter preserves primary retry tracking while a detached review runs", async () => {
    const transport = new FakeCodexTransport();
    transport.reviewThreadId = "thread-detached-review";
    const forwardedEvents = [];
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "10",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "10",
        },
        transportFactory: () => transport,
        retryRandom: () => 1,
    });
    const payload = vmSessionStartPayload();
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            forwardedEvents.push(event);
        },
    });
    await adapter.startReview({
        commandId: "detached-review-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        target: { type: "custom", instructions: "Review the current work." },
        delivery: "detached",
    });
    transport.emit({
        method: "error",
        params: {
            threadId: started.codexThreadId,
            turnId: started.codexTurnId,
            willRetry: false,
            error: { message: "Model is at full capacity", codexErrorInfo: "serverOverloaded" },
        },
    });
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: started.codexThreadId,
            turnId: started.codexTurnId,
            turn: { id: started.codexTurnId, status: "failed" },
        },
    });
    const primaryError = forwardedEvents.find((event) => event.eventType === "session.error" && event.codexTurnId === started.codexTurnId);
    assert.equal(primaryError?.payload.ypLiveWorkflowRetry?.classification, "server_overloaded");
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: "thread-detached-review",
            turnId: "review-turn-1",
            turn: { id: "review-turn-1", status: "completed" },
        },
    });
    await waitFor(() => transport.requests.filter((request) => request.method === "turn/start").length >= 2);
    assert.equal(transport.requests.filter((request) => request.method === "turn/start").length, 2);
    await adapter.closeAll();
});
test("Codex adapter persists and restores concurrent primary and detached review retries", async () => {
    const initialTransport = new FakeCodexTransport();
    initialTransport.reviewThreadId = "thread-detached-review";
    const initialAdapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "1000",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "1000",
        },
        transportFactory: () => initialTransport,
        retryRandom: () => 1,
    });
    const payload = vmSessionStartPayload();
    const started = await initialAdapter.startSession(payload);
    await initialAdapter.startReview({
        commandId: "detached-review-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        target: { type: "custom", instructions: "Review the current work." },
        delivery: "detached",
    });
    initialTransport.emit({
        method: "error",
        params: {
            threadId: started.codexThreadId,
            turnId: started.codexTurnId,
            willRetry: false,
            error: { message: "Model is at full capacity", codexErrorInfo: "serverOverloaded" },
        },
    });
    initialTransport.emit({
        method: "turn/completed",
        params: {
            threadId: started.codexThreadId,
            turnId: started.codexTurnId,
            turn: { id: started.codexTurnId, status: "failed" },
        },
    });
    initialTransport.emit({
        method: "error",
        params: {
            threadId: "thread-detached-review",
            turnId: "review-turn-1",
            willRetry: false,
            error: { message: "429 rate limit exceeded", codexErrorInfo: "usageLimit" },
        },
    });
    initialTransport.emit({
        method: "turn/completed",
        params: {
            threadId: "thread-detached-review",
            turnId: "review-turn-1",
            turn: { id: "review-turn-1", status: "failed" },
        },
    });
    const paused = await initialAdapter.pauseSession({
        commandId: "pause-concurrent-retries-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: false,
    });
    const pendingLogicalTurnRetries = paused.result?.pendingLogicalTurnRetries;
    assert.deepEqual(pendingLogicalTurnRetries?.map((retry) => retry.method), ["turn/start", "review/start"]);
    const resumedTransport = new FakeCodexTransport();
    const resumedAdapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => resumedTransport,
    });
    const coldStarted = await resumedAdapter.startSession(vmSessionStartPayload({
        commandId: "cold-start-concurrent-retries-command-1",
        codexThreadId: started.codexThreadId,
        initialTurnMode: "deferred",
        pendingLogicalTurnRetry: pendingLogicalTurnRetries?.[0] ?? null,
        pendingLogicalTurnRetries,
    }));
    const pausedAgain = await resumedAdapter.pauseSession({
        commandId: "pause-restored-concurrent-retries-command-1",
        sessionId: payload.sessionId,
        codexThreadId: coldStarted.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    const restoredRetries = pausedAgain.result?.pendingLogicalTurnRetries;
    assert.deepEqual(restoredRetries?.map((retry) => retry.method), ["turn/start", "review/start"]);
    await resumedAdapter.closeAll();
});
test("Codex adapter ignores primary-turn completion while a detached review retry is unstarted", async () => {
    const transport = new FakeCodexTransport();
    transport.reviewThreadId = "thread-detached-review";
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "20",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "20",
        },
        transportFactory: () => transport,
        retryRandom: () => 1,
    });
    const payload = vmSessionStartPayload();
    const started = await adapter.startSession(payload);
    transport.requestErrors.set("review/start", new Error("429 rate limit exceeded"));
    const ack = await adapter.startReview({
        commandId: "detached-review-retry-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        target: { type: "custom", instructions: "Review the current work." },
        delivery: "detached",
    });
    assert.equal(ack.codexTurnId, null);
    assert.equal(ack.result?.pendingLogicalTurnRetry?.method, "review/start");
    transport.requestErrors.delete("review/start");
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: started.codexThreadId,
            turnId: started.codexTurnId,
            turn: { id: started.codexTurnId, status: "completed" },
        },
    });
    await waitFor(() => transport.requests.filter((request) => request.method === "review/start").length >= 2);
    assert.equal(transport.requests.filter((request) => request.method === "review/start").length, 2);
    await adapter.closeAll();
});
test("Codex adapter preserves the primary thread for detached review notifications", async () => {
    const transport = new FakeCodexTransport();
    transport.reviewThreadId = "thread-detached-review";
    transport.suppressReviewStartedNotification = true;
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({ initialTurnMode: "deferred" });
    const started = await adapter.startSession(payload);
    await adapter.startReview({
        commandId: "review-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        target: { type: "custom", instructions: "Review the current work." },
        delivery: "detached",
    });
    const paused = await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        interruptActiveTurn: true,
        keepWarm: true,
    });
    assert.equal(paused.codexThreadId, started.codexThreadId);
    const interruptRequest = [...transport.requests].reverse().find((request) => request.method === "turn/interrupt");
    assert.deepEqual(interruptRequest?.params, {
        threadId: "thread-detached-review",
        turnId: "review-turn-1",
    });
    await adapter.closeAll();
});
test("Codex adapter retains the primary thread after detached review completion notifications", async () => {
    const transport = new FakeCodexTransport();
    transport.reviewThreadId = "thread-detached-review";
    transport.suppressReviewStartedNotification = true;
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({ initialTurnMode: "deferred" });
    const started = await adapter.startSession(payload);
    await adapter.startReview({
        commandId: "review-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        target: { type: "custom", instructions: "Review the current work." },
        delivery: "detached",
    });
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: "thread-detached-review",
            turn: { id: "review-turn-1", status: "completed" },
        },
    });
    transport.emit({
        method: "thread/status/changed",
        params: { threadId: "thread-detached-review", status: "idle" },
    });
    transport.emit({
        method: "thread/closed",
        params: { threadId: "thread-detached-review" },
    });
    const paused = await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    assert.equal(paused.codexThreadId, started.codexThreadId);
    await adapter.closeAll();
});
test("Codex adapter releases VM capacity when app-server emits a failed turn completion", async () => {
    const transport = new FakeCodexTransport();
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        defaultImage: OfficialCodexAppServerImage,
        maxCodexSessions: 1,
        transportFactory: () => transport,
    });
    const adapter = new CodexAdapter({
        dockerRuntime,
        env: { OPENAI_API_KEY: "test-key" },
    });
    await adapter.startSession(vmSessionStartPayload({ initialTurnMode: "deferred" }));
    assert.equal(dockerRuntime.getStatus().activeCodexSessions, 1);
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            turn: { id: "turn-1", status: "failed" },
        },
    });
    assert.equal(dockerRuntime.getSession("session-id")?.status, "failed");
    assert.equal(dockerRuntime.getStatus().activeCodexSessions, 0);
    assert.deepEqual(dockerRuntime.getStatus().sessionCountsByStatus, { failed: 1 });
});
test("Codex adapter keeps chief-managed sessions running after failed turn completion", async () => {
    const transport = new FakeCodexTransport();
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        defaultImage: OfficialCodexAppServerImage,
        maxCodexSessions: 1,
        transportFactory: () => transport,
    });
    const adapter = new CodexAdapter({
        dockerRuntime,
        env: { OPENAI_API_KEY: "test-key" },
    });
    await adapter.startSession(vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            codexSession: { chiefManaged: true },
        },
    }));
    assert.equal(dockerRuntime.getStatus().activeCodexSessions, 1);
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            turn: { id: "turn-1", status: "failed" },
        },
    });
    assert.equal(dockerRuntime.getSession("session-id")?.status, "running");
    assert.equal(dockerRuntime.getStatus().activeCodexSessions, 1);
    assert.deepEqual(dockerRuntime.getStatus().sessionCountsByStatus, { running: 1 });
});
test("Codex adapter keeps group-final-review sessions running between turns", async () => {
    const transport = new FakeCodexTransport();
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        defaultImage: OfficialCodexAppServerImage,
        maxCodexSessions: 1,
        transportFactory: () => transport,
    });
    const adapter = new CodexAdapter({
        dockerRuntime,
        env: { OPENAI_API_KEY: "test-key" },
    });
    await adapter.startSession(vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Review the group", launchMode: "group_final_review" },
    }));
    assert.equal(dockerRuntime.getStatus().activeCodexSessions, 1);
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            turn: { id: "turn-1", status: "failed" },
        },
    });
    assert.equal(dockerRuntime.getSession("session-id")?.status, "running");
    assert.equal(dockerRuntime.getStatus().activeCodexSessions, 1);
    assert.deepEqual(dockerRuntime.getStatus().sessionCountsByStatus, { running: 1 });
});
test("Codex adapter keeps code-data-review sessions running between correction turns", async () => {
    const transport = new FakeCodexTransport();
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        defaultImage: OfficialCodexAppServerImage,
        maxCodexSessions: 1,
        transportFactory: () => transport,
    });
    const adapter = new CodexAdapter({
        dockerRuntime,
        env: { OPENAI_API_KEY: "test-key" },
    });
    await adapter.startSession(vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Audit code and data", launchMode: "code_data_review" },
    }));
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            turn: { id: "turn-1", status: "failed" },
        },
    });
    assert.equal(dockerRuntime.getSession("session-id")?.status, "running");
    assert.equal(dockerRuntime.getStatus().activeCodexSessions, 1);
});
test("Codex adapter maps snapshotted Researcher settings to app-server requests", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    await adapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            researcher: {
                model: "gpt-fast",
                reasoningEffort: "max",
                serviceTier: "fast",
            },
            codexConfig: {
                config: { existing_config: true },
            },
        },
    }));
    const threadParams = transport.requests[2]?.params;
    const turnParams = transport.requests[3]?.params;
    assert.equal(threadParams.model, "gpt-fast");
    assert.equal(threadParams.serviceTier, "fast");
    assert.equal(threadParams.approvalPolicy, "never");
    assert.equal(threadParams.sandbox, "danger-full-access");
    assert.deepEqual(threadParams.config, {
        existing_config: true,
        model_reasoning_effort: "max",
    });
    assert.equal(turnParams.model, "gpt-fast");
    assert.equal(turnParams.serviceTier, "fast");
    assert.equal(turnParams.effort, "max");
    assert.equal(turnParams.approvalPolicy, "never");
    assert.deepEqual(turnParams.sandboxPolicy, {
        type: "externalSandbox",
        networkAccess: "enabled",
    });
});
test("Codex adapter bills with the configured Researcher model provider", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        runtimeSnapshot: {
            researcher: {
                model: "researcher-model",
                modelProvider: "configured-provider",
                reasoningEffort: "high",
                serviceTier: "regular",
            },
            codexConfig: {},
        },
    });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    transport.emit({
        method: "thread/tokenUsage/updated",
        params: {
            threadId: started.codexThreadId,
            tokenUsage: { total: { inputTokens: 10, outputTokens: 1, totalTokens: 11 } },
        },
    });
    const threadParams = transport.requests[2]?.params;
    const billingContext = events.find((event) => event.eventType === "metrics.updated")
        ?.payload.billingContext;
    assert.equal(threadParams.modelProvider, "configured-provider");
    assert.equal(billingContext?.provider, "configured-provider");
});
test("Codex adapter preserves legacy codex config model fallback", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    await adapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            modelDefaults: {
                reasoningEffort: "medium",
                serviceTier: "regular",
            },
            codexConfig: {
                model: "legacy-codex-config-model",
            },
        },
    }));
    const threadParams = transport.requests[2]?.params;
    const turnParams = transport.requests[3]?.params;
    assert.equal(threadParams.model, "legacy-codex-config-model");
    assert.equal(turnParams.model, "legacy-codex-config-model");
    assert.equal(turnParams.effort, "medium");
});
test("Codex adapter maps legacy on-failure approval policy to on-request app-server requests", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        runtimeSnapshot: {
            codexConfig: {
                approvalPolicy: "on-failure",
            },
        },
    });
    const started = await adapter.startSession(payload);
    assert.equal((transport.requests[2]?.params).approvalPolicy, "on-request");
    assert.equal((transport.requests[3]?.params).approvalPolicy, "on-request");
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    const resumeRequestOffset = transport.requests.length;
    await adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.equal((transport.requests[resumeRequestOffset]?.params).approvalPolicy, "on-request");
    const forkRequestOffset = transport.requests.length;
    await adapter.forkThread({
        commandId: "fork-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.equal((transport.requests[forkRequestOffset]?.params).approvalPolicy, "on-request");
});
test("Codex adapter maps legacy on-failure approval overrides to on-request app-server requests", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        runtimeSnapshot: {
            codexConfig: {
                approvalPolicy: "never",
            },
        },
    });
    const started = await adapter.startSession(payload);
    const turnRequestOffset = transport.requests.length;
    await adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
        overrides: { approvalPolicy: "on-failure" },
    });
    assert.equal((transport.requests[turnRequestOffset]?.params).approvalPolicy, "on-request");
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    const resumeRequestOffset = transport.requests.length;
    await adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        overrides: { approvalPolicy: "on-failure" },
    });
    assert.equal((transport.requests[resumeRequestOffset]?.params).approvalPolicy, "on-request");
    const forkRequestOffset = transport.requests.length;
    await adapter.forkThread({
        commandId: "fork-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        overrides: { approvalPolicy: "on-failure" },
    });
    assert.equal((transport.requests[forkRequestOffset]?.params).approvalPolicy, "on-request");
});
test("Codex adapter preserves permission settings on continuation turn starts", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        runtimeSnapshot: {
            modelDefaults: {
                model: "gpt-fast",
                reasoningEffort: "low",
                serviceTier: "fast",
            },
            codexConfig: {
                approvalPolicy: "never",
                approvalsReviewer: "reviewer-1",
            },
        },
    });
    const started = await adapter.startSession(payload);
    const turnRequestOffset = transport.requests.length;
    await adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    });
    const turnRequest = transport.requests[turnRequestOffset];
    const turnParams = turnRequest?.params;
    assert.equal(turnRequest?.method, "turn/start");
    assert.equal(turnParams.cwd, "/workspace/root/workspace");
    assert.equal(turnParams.model, "gpt-fast");
    assert.equal(turnParams.serviceTier, "fast");
    assert.equal(turnParams.effort, "low");
    assert.equal(turnParams.approvalPolicy, "never");
    assert.equal(turnParams.approvalsReviewer, "reviewer-1");
    assert.deepEqual(turnParams.sandboxPolicy, {
        type: "externalSandbox",
        networkAccess: "enabled",
    });
});
test("Codex adapter preserves null overrides on continuation turn starts", async (t) => {
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-codex-turn-overrides-"));
    const transport = new FakeCodexTransport();
    const events = [];
    const adapter = new CodexAdapter({
        env: {},
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        layout: sessionLayout(rootPath),
        auth: {
            provider: "openai",
            authMode: "openai_api_key",
            metadata: { openAiApiKeyMaterial: { apiKey: "sk-fake-turn-overrides-only" } },
        },
        runtimeSnapshot: {
            modelDefaults: {
                model: "gpt-fast",
                reasoningEffort: "low",
                serviceTier: "fast",
            },
            codexConfig: {
                approvalPolicy: "never",
                approvalsReviewer: "reviewer-1",
            },
        },
    });
    t.after(async () => {
        await adapter.closeAll();
        await fs.rm(rootPath, { recursive: true, force: true });
    });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    const turnRequestOffset = transport.requests.length;
    await adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
        overrides: {
            approvalPolicy: null,
            approvalsReviewer: null,
            cwd: null,
            model: null,
            reasoningEffort: null,
            sandboxPolicy: null,
            serviceTier: null,
        },
    });
    const turnRequest = transport.requests[turnRequestOffset];
    const turnParams = turnRequest?.params;
    assert.equal(turnRequest?.method, "turn/start");
    assert.equal("approvalPolicy" in turnParams, true);
    assert.equal("approvalsReviewer" in turnParams, true);
    assert.equal("cwd" in turnParams, true);
    assert.equal("effort" in turnParams, true);
    assert.equal("sandboxPolicy" in turnParams, true);
    assert.equal("serviceTier" in turnParams, true);
    assert.equal(turnParams.approvalPolicy, null);
    assert.equal(turnParams.approvalsReviewer, null);
    assert.equal(turnParams.cwd, null);
    assert.equal(turnParams.model, null);
    assert.equal(turnParams.effort, null);
    assert.equal(turnParams.sandboxPolicy, null);
    assert.equal(turnParams.serviceTier, null);
    assert.equal(turnParams.threadId, started.codexThreadId);
    transport.emit({
        method: "thread/tokenUsage/updated",
        params: {
            threadId: started.codexThreadId,
            tokenUsage: { total: { inputTokens: 10, outputTokens: 1, totalTokens: 11 } },
        },
    });
    const billingContext = events.find((event) => event.eventType === "metrics.updated")
        ?.payload.billingContext;
    assert.equal(billingContext?.model, "gpt-fast");
    assert.equal(billingContext?.serviceTier, "regular");
    assert.equal(billingContext?.inferenceType, "normal");
});
test("Codex adapter resets billing to the session model when a continuation clears its model override", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        runtimeSnapshot: {
            modelDefaults: {
                model: "gpt-session-default",
                reasoningEffort: "low",
                serviceTier: "regular",
            },
            codexConfig: {},
        },
    });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    await adapter.startTurn({
        commandId: "turn-model-override",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Use the override." }],
        overrides: { model: "gpt-turn-override" },
    });
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: started.codexThreadId,
            turnId: "turn-1",
            turn: { id: "turn-1", status: "completed" },
        },
    });
    const secondTurnRequestOffset = transport.requests.length;
    await adapter.startTurn({
        commandId: "turn-model-reset",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Return to the default." }],
        overrides: { model: null },
    });
    const secondTurnParams = transport.requests[secondTurnRequestOffset]?.params;
    assert.equal(secondTurnParams.model, null);
    transport.emit({
        method: "thread/tokenUsage/updated",
        params: {
            threadId: started.codexThreadId,
            tokenUsage: { total: { inputTokens: 10, outputTokens: 1, totalTokens: 11 } },
        },
    });
    const billingContext = [...events].reverse().find((event) => event.eventType === "metrics.updated")
        ?.payload.billingContext;
    assert.equal(billingContext?.model, "gpt-session-default");
});
test("Codex adapter preserves null overrides on thread resume", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            codexConfig: {
                approvalPolicy: "never",
                approvalsReviewer: "reviewer-1",
            },
        },
    });
    const started = await adapter.startSession(payload);
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    const resumeRequestOffset = transport.requests.length;
    await adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        persistExtendedHistory: true,
        overrides: {
            approvalPolicy: null,
            approvalsReviewer: null,
            cwd: null,
            sandbox: null,
        },
    });
    const resumeRequest = transport.requests[resumeRequestOffset];
    const resumeParams = resumeRequest?.params;
    assert.equal(resumeRequest?.method, "thread/resume");
    assert.equal("approvalPolicy" in resumeParams, true);
    assert.equal("approvalsReviewer" in resumeParams, true);
    assert.equal("cwd" in resumeParams, true);
    assert.equal(resumeParams.approvalPolicy, null);
    assert.equal(resumeParams.approvalsReviewer, null);
    assert.equal(resumeParams.cwd, null);
    assert.equal(resumeParams.sandbox, null);
    assert.equal(resumeParams.threadId, started.codexThreadId);
    assert.equal(resumeParams.persistExtendedHistory, true);
    assert.equal("model" in resumeParams, false);
    assert.equal("serviceTier" in resumeParams, false);
});
test("Codex adapter replays only permission settings on warm thread resume", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        runtimeSnapshot: {
            modelDefaults: {
                model: "gpt-fast",
                reasoningEffort: "low",
                serviceTier: "fast",
            },
            codexConfig: {
                approvalPolicy: "never",
                approvalsReviewer: "reviewer-1",
                developerInstructions: "Keep long-running commands in their live exec sessions.",
                config: {
                    background_terminal_max_timeout: 1800000,
                    model: "must-not-be-replayed",
                },
            },
        },
    });
    const started = await adapter.startSession(payload);
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    const resumeRequestOffset = transport.requests.length;
    await adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.deepEqual(transport.requests[resumeRequestOffset]?.params, {
        approvalPolicy: "never",
        approvalsReviewer: "reviewer-1",
        sandbox: "danger-full-access",
        threadId: started.codexThreadId,
        persistExtendedHistory: false,
    });
});
test("Codex adapter rejects thread forks while a logical turn retry is pending", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "test-key",
            YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "1000",
            YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS: "1000",
        },
        transportFactory: () => transport,
        retryRandom: () => 1,
    });
    const payload = vmSessionStartPayload({ initialTurnMode: "deferred" });
    const started = await adapter.startSession(payload);
    transport.requestErrors.set("turn/start", new Error("Model is at full capacity"));
    await adapter.startTurn({
        commandId: "turn-retry-before-fork-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    });
    await assert.rejects(() => adapter.forkThread({
        commandId: "fork-with-pending-retry-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    }), /logical turn retry is already pending/);
    assert.equal(transport.requests.some((request) => request.method === "thread/fork"), false);
    await adapter.closeAll();
});
test("Codex adapter replays full thread settings on thread fork", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        runtimeSnapshot: {
            modelDefaults: {
                model: "gpt-fast",
                reasoningEffort: "low",
                serviceTier: "fast",
            },
            codexConfig: {
                approvalPolicy: "never",
                approvalsReviewer: "reviewer-1",
            },
        },
    });
    const started = await adapter.startSession(payload);
    const forkRequestOffset = transport.requests.length;
    await adapter.forkThread({
        commandId: "fork-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        persistExtendedHistory: true,
    });
    assert.deepEqual(transport.requests[forkRequestOffset]?.params, {
        config: {
            model_reasoning_effort: "low",
        },
        cwd: "/workspace/root/workspace",
        model: "gpt-fast",
        serviceTier: "fast",
        approvalPolicy: "never",
        approvalsReviewer: "reviewer-1",
        sandbox: "danger-full-access",
        threadId: started.codexThreadId,
        persistExtendedHistory: true,
    });
});
test("Codex adapter preserves null overrides on thread fork", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        runtimeSnapshot: {
            modelDefaults: {
                model: "gpt-fast",
                reasoningEffort: "low",
                serviceTier: "fast",
            },
            codexConfig: {
                approvalPolicy: "never",
                approvalsReviewer: "reviewer-1",
            },
        },
    });
    const started = await adapter.startSession(payload);
    const forkRequestOffset = transport.requests.length;
    await adapter.forkThread({
        commandId: "fork-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        overrides: {
            approvalPolicy: null,
            approvalsReviewer: null,
            config: null,
            cwd: null,
            model: null,
            sandbox: null,
            serviceTier: null,
        },
    });
    const forkParams = transport.requests[forkRequestOffset]?.params;
    assert.equal(forkParams.approvalPolicy, null);
    assert.equal(forkParams.approvalsReviewer, null);
    assert.equal(forkParams.config, null);
    assert.equal(forkParams.cwd, null);
    assert.equal(forkParams.model, null);
    assert.equal(forkParams.sandbox, null);
    assert.equal(forkParams.serviceTier, null);
    assert.equal(forkParams.threadId, started.codexThreadId);
    assert.equal(forkParams.persistExtendedHistory, false);
});
test("Codex adapter does not advertise network access when Docker policy disables networking", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    await adapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            codexConfig: {},
            resourcePolicy: { network: "none" },
        },
    }));
    const threadParams = transport.requests[2]?.params;
    const turnParams = transport.requests[3]?.params;
    assert.equal(threadParams.sandbox, "danger-full-access");
    assert.deepEqual(turnParams.sandboxPolicy, {
        type: "externalSandbox",
        networkAccess: "restricted",
    });
});
test("Codex adapter does not combine permissions profiles with sandbox defaults", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    await adapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            codexConfig: { permissions: "full-auto" },
        },
    }));
    const threadParams = transport.requests[2]?.params;
    const turnParams = transport.requests[3]?.params;
    assert.equal(threadParams.permissions, "full-auto");
    assert.equal("sandbox" in threadParams, false);
    assert.equal("sandboxPolicy" in turnParams, false);
});
test("Codex adapter does not combine permissions profiles with continuation sandbox defaults", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            codexConfig: { permissions: "full-auto" },
        },
    });
    const started = await adapter.startSession(payload);
    const turnRequestOffset = transport.requests.length;
    await adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    });
    const turnParams = transport.requests[turnRequestOffset]?.params;
    assert.equal("sandboxPolicy" in turnParams, false);
});
test("Codex adapter does not combine permissions profiles with resume sandbox defaults", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            codexConfig: { permissions: "full-auto" },
        },
    });
    const started = await adapter.startSession(payload);
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    const resumeRequestOffset = transport.requests.length;
    await adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    const resumeParams = transport.requests[resumeRequestOffset]?.params;
    assert.equal(resumeParams.permissions, "full-auto");
    assert.equal(resumeParams.approvalPolicy, "never");
    assert.equal("sandbox" in resumeParams, false);
});
test("Codex adapter materializes stored ChatGPT auth outside the archived workspace root", async () => {
    const transport = new FakeCodexTransport();
    let launchOptions;
    const adapter = new CodexAdapter({
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const payload = vmSessionStartPayload({
        auth: {
            provider: "openai",
            authMode: "codex_chatgpt_with_api_fallback",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                codexAuthMaterial: {
                    format: "codex_home_files_v1",
                    files: [
                        {
                            path: "auth.json",
                            dataBase64: Buffer.from(JSON.stringify({ token: "stored" })).toString("base64"),
                            mode: 0o600,
                        },
                    ],
                },
            },
        },
    });
    await adapter.startSession(payload);
    assert.ok(launchOptions?.codexHomePath);
    assert.notEqual(launchOptions?.codexHomePath, payload.layout.codexHomePath);
    assert.equal(path.relative(payload.layout.rootPath, launchOptions.codexHomePath).startsWith(".."), true);
    assert.equal(await fs.readFile(path.join(launchOptions.codexHomePath, "auth.json"), "utf8"), JSON.stringify({ token: "stored" }));
    assert.equal(await pathExists(path.join(payload.layout.codexHomePath, "auth.json")), false);
    assert.deepEqual(transport.requests[1]?.params, { refreshToken: false });
    const sensitiveAuthRoot = path.dirname(launchOptions.codexHomePath);
    await adapter.closeSession(payload.sessionId);
    assert.equal(await pathExists(sensitiveAuthRoot), false);
});
test("Codex adapter publishes changed ChatGPT auth material before cleanup", async () => {
    const transport = new FakeCodexTransport();
    let launchOptions;
    const updates = [];
    const storedAuthMaterial = {
        format: "codex_home_files_v1",
        files: [
            {
                path: "auth.json",
                dataBase64: Buffer.from(JSON.stringify({ token: "stored" })).toString("base64"),
                mode: 0o600,
            },
        ],
    };
    const baseFingerprintSha256 = codexAuthMaterialFingerprintSha256(storedAuthMaterial);
    const adapter = new CodexAdapter({
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
        authMaterialUpdateSink: {
            publishCodexAuthMaterialUpdated: async (payload) => {
                updates.push(payload);
            },
        },
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        auth: {
            provider: "openai",
            authMode: "codex_chatgpt_with_api_fallback",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                codexAuthMaterial: storedAuthMaterial,
                codexAuthMaterialFingerprintSha256: baseFingerprintSha256,
            },
        },
    });
    await adapter.startSession(payload);
    assert.ok(launchOptions?.codexHomePath);
    await fs.writeFile(path.join(launchOptions.codexHomePath, "auth.json"), JSON.stringify({ token: "refreshed" }));
    await adapter.closeSession(payload.sessionId);
    assert.equal(updates.length, 1);
    assert.equal(updates[0]?.authProfileId, payload.authProfileId);
    assert.equal(updates[0]?.baseFingerprintSha256, baseFingerprintSha256);
    assert.notEqual(updates[0]?.currentFingerprintSha256, baseFingerprintSha256);
    assert.equal(Buffer.from(updates[0]?.authMaterial.files[0]?.dataBase64 ?? "", "base64").toString("utf8"), JSON.stringify({ token: "refreshed" }));
    assert.equal(await pathExists(path.dirname(launchOptions.codexHomePath)), false);
});
test("Codex adapter switches from ChatGPT auth to API key on reached quota without publishing API auth material", async () => {
    const transport = new FakeCodexTransport();
    const forwardedEvents = [];
    const authMaterialUpdates = [];
    let launchOptions;
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                limitName: "Codex",
                planType: "pro",
                primary: {
                    usedPercent: 100,
                    windowDurationMins: 300,
                    resetsAt: 1779000000,
                },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "fallback-key" },
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
        authMaterialUpdateSink: {
            publishCodexAuthMaterialUpdated: async (payload) => {
                authMaterialUpdates.push(payload);
            },
        },
    });
    const payload = vmSessionStartPayload({
        auth: {
            provider: "openai",
            authMode: "codex_chatgpt_with_api_fallback",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                openAiApiKeyMaterial: { apiKey: "fallback-key" },
                codexAuthMaterial: {
                    format: "codex_home_files_v1",
                    files: [
                        {
                            path: "auth.json",
                            dataBase64: Buffer.from(JSON.stringify({ token: "stored" })).toString("base64"),
                            mode: 0o600,
                        },
                    ],
                },
            },
        },
    });
    const result = await adapter.startSession(payload, {
        onEvent: (event) => {
            forwardedEvents.push(event.eventType);
        },
    });
    assert.deepEqual(transport.requests.map((request) => request.method), [
        "initialize",
        "account/read",
        "account/rateLimits/read",
        "account/login/start",
        "thread/start",
        "turn/start",
    ]);
    assert.deepEqual(transport.requests[3]?.params, {
        type: "apiKey",
        apiKey: "fallback-key",
    });
    assert.equal((transport.requests[4]?.params).serviceTier, "flex");
    assert.equal((transport.requests[5]?.params).serviceTier, "flex");
    assert.deepEqual(forwardedEvents.slice(0, 2), ["quota.updated", "usage.routing.switched"]);
    assert.equal(result.runtimeMetadata.activeLane, "openai_api");
    assert.ok(launchOptions?.codexHomePath);
    await fs.writeFile(path.join(launchOptions.codexHomePath, "auth.json"), JSON.stringify({ auth_mode: "apikey", OPENAI_API_KEY: "fallback-key" }));
    await adapter.closeSession(payload.sessionId);
    assert.equal(authMaterialUpdates.length, 0);
});
test("Codex adapter pins API billing context per turn as model and tier change", async (t) => {
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-codex-billing-context-"));
    const transport = new FakeCodexTransport();
    const events = [];
    const adapter = new CodexAdapter({
        env: {},
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        layout: sessionLayout(rootPath),
        auth: {
            provider: "openai",
            authMode: "openai_api_key",
            metadata: { openAiApiKeyMaterial: { apiKey: "sk-fake-turn-billing-test-only" } },
        },
    });
    t.after(async () => {
        await adapter.closeSession(payload.sessionId);
        await fs.rm(rootPath, { recursive: true, force: true });
    });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    await adapter.startTurn({
        commandId: "turn-start-standard",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "First turn" }],
        overrides: { model: "gpt-standard-turn", serviceTier: "regular" },
    });
    transport.emit({
        method: "thread/tokenUsage/updated",
        params: {
            threadId: started.codexThreadId,
            tokenUsage: { total: { inputTokens: 100, outputTokens: 10, totalTokens: 110 } },
        },
    });
    transport.emit({
        method: "turn/completed",
        params: { threadId: started.codexThreadId, turnId: "turn-1", turn: { id: "turn-1", status: "completed" } },
    });
    const secondTurnRequestOffset = transport.requests.length;
    await adapter.startTurn({
        commandId: "turn-start-api",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Second turn" }],
        overrides: { model: "gpt-api-turn", serviceTier: "fast" },
    });
    transport.emit({
        method: "thread/tokenUsage/updated",
        params: {
            threadId: started.codexThreadId,
            tokenUsage: { total: { inputTokens: 160, outputTokens: 25, totalTokens: 185 } },
        },
    });
    const metrics = events.filter((event) => event.eventType === "metrics.updated");
    const firstBilling = metrics[0]?.payload.billingContext;
    const secondBilling = metrics[1]?.payload.billingContext;
    assert.equal(firstBilling?.lane, "openai_api");
    assert.equal(firstBilling?.model, "gpt-standard-turn");
    assert.equal(firstBilling?.serviceTier, "regular");
    assert.equal(firstBilling?.inferenceType, "normal");
    assert.equal(firstBilling?.turnId, "turn-1");
    assert.equal(secondBilling?.lane, "openai_api");
    assert.equal(secondBilling?.model, "gpt-api-turn");
    assert.equal(secondBilling?.serviceTier, "fast");
    assert.equal(secondBilling?.inferenceType, "priority");
    assert.equal(secondBilling?.turnId, "turn-2");
    const secondTurnRequests = transport.requests.slice(secondTurnRequestOffset).map((request) => request.method);
    assert.deepEqual(secondTurnRequests, ["turn/start"]);
    const physicalTurnParams = transport.requests
        .filter((request) => request.method === "turn/start")
        .map((request) => request.params);
    assert.equal(physicalTurnParams[0]?.serviceTier, null);
    assert.equal(physicalTurnParams[1]?.serviceTier, "fast");
});
test("Codex adapter prefers an in-flight continuation billing context for turnless metrics", async (t) => {
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-codex-pending-billing-context-"));
    const transport = new FakeCodexTransport();
    const events = [];
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "fallback-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        layout: sessionLayout(rootPath),
        auth: chatGptWithApiFallbackAuth(),
    });
    t.after(async () => {
        await adapter.closeSession(payload.sessionId);
        await fs.rm(rootPath, { recursive: true, force: true });
    });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    await adapter.startTurn({
        commandId: "turn-old-context",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "First turn" }],
        overrides: { model: "gpt-old-context", serviceTier: "regular" },
    });
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: started.codexThreadId,
            turnId: "turn-1",
            turn: { id: "turn-1", status: "completed" },
        },
    });
    transport.requestHook = (method, params) => {
        const request = params && typeof params === "object" && !Array.isArray(params)
            ? params
            : {};
        if (method === "turn/start" && request.model === "gpt-pending-context") {
            transport.emit({
                method: "thread/tokenUsage/updated",
                params: {
                    threadId: started.codexThreadId,
                    tokenUsage: { total: { inputTokens: 25, outputTokens: 5, totalTokens: 30 } },
                },
            });
        }
    };
    await adapter.startTurn({
        commandId: "turn-pending-context",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Second turn" }],
        overrides: { model: "gpt-pending-context", serviceTier: "fast" },
    });
    const metric = events.find((event) => event.eventType === "metrics.updated");
    const billing = metric?.payload.billingContext;
    assert.equal(billing?.threadId, started.codexThreadId);
    assert.equal(billing?.model, "gpt-pending-context");
    assert.equal(billing?.serviceTier, "fast");
    assert.equal(billing?.inferenceType, "priority");
});
test("Codex adapter resolves turnless token metrics by emitting thread during a detached review", async (t) => {
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-codex-thread-billing-context-"));
    const transport = new FakeCodexTransport();
    transport.reviewThreadId = "thread-detached-review";
    const events = [];
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "fallback-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        layout: sessionLayout(rootPath),
        auth: chatGptWithApiFallbackAuth(),
    });
    t.after(async () => {
        await adapter.closeSession(payload.sessionId);
        await fs.rm(rootPath, { recursive: true, force: true });
    });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    await adapter.startTurn({
        commandId: "primary-turn",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Primary work" }],
        overrides: { model: "gpt-primary" },
    });
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1779000000 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    await adapter.startReview({
        commandId: "detached-review",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        target: { type: "custom", instructions: "Review concurrently." },
        delivery: "detached",
    });
    transport.emit({
        method: "thread/tokenUsage/updated",
        params: {
            threadId: started.codexThreadId,
            tokenUsage: { total: { inputTokens: 100, outputTokens: 10, totalTokens: 110 } },
        },
    });
    transport.emit({
        method: "thread/tokenUsage/updated",
        params: {
            threadId: "thread-detached-review",
            tokenUsage: { total: { inputTokens: 120, outputTokens: 12, totalTokens: 132 } },
        },
    });
    const metrics = events.filter((event) => event.eventType === "metrics.updated");
    const primaryBilling = metrics[0]?.payload.billingContext;
    const reviewBilling = metrics[1]?.payload.billingContext;
    assert.equal(primaryBilling?.threadId, started.codexThreadId);
    assert.equal(primaryBilling?.turnId, "turn-1");
    assert.equal(primaryBilling?.lane, "chatgpt_plan");
    assert.equal(primaryBilling?.serviceTier, "regular");
    assert.equal(primaryBilling?.inferenceType, "normal");
    assert.equal(reviewBilling?.threadId, "thread-detached-review");
    assert.equal(reviewBilling?.turnId, "review-turn-1");
    assert.equal(reviewBilling?.lane, "openai_api");
    assert.equal(reviewBilling?.serviceTier, "flex");
    assert.equal(reviewBilling?.inferenceType, "flex");
});
test("Codex adapter publishes rotated ChatGPT auth before quota fallback switches to API", async () => {
    const transport = new FakeCodexTransport();
    const authMaterialUpdates = [];
    let launchOptions;
    const storedAuthMaterial = {
        format: "codex_home_files_v1",
        files: [
            {
                path: "auth.json",
                dataBase64: Buffer.from(JSON.stringify({ token: "stored" })).toString("base64"),
                mode: 0o600,
            },
        ],
    };
    const baseFingerprintSha256 = codexAuthMaterialFingerprintSha256(storedAuthMaterial);
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "fallback-key" },
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
        authMaterialUpdateSink: {
            publishCodexAuthMaterialUpdated: async (payload) => {
                authMaterialUpdates.push(payload);
            },
        },
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        auth: {
            provider: "openai",
            authMode: "codex_chatgpt_with_api_fallback",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                openAiApiKeyMaterial: { apiKey: "fallback-key" },
                codexAuthMaterial: storedAuthMaterial,
                codexAuthMaterialFingerprintSha256: baseFingerprintSha256,
            },
        },
    });
    const started = await adapter.startSession(payload);
    assert.ok(launchOptions?.codexHomePath);
    transport.rateLimitsReadHook = async () => {
        await fs.writeFile(path.join(launchOptions?.codexHomePath ?? "", "auth.json"), JSON.stringify({ token: "rotated" }));
    };
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const turn = await adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    });
    assert.equal(usageRoutingLane(turn.result), "openai_api");
    assert.equal(authMaterialUpdates.length, 1);
    assert.equal(authMaterialUpdates[0]?.source, "chatgpt_quota_fallback");
    assert.equal(authMaterialUpdates[0]?.baseFingerprintSha256, baseFingerprintSha256);
    assert.equal(Buffer.from(authMaterialUpdates[0]?.authMaterial.files[0]?.dataBase64 ?? "", "base64").toString("utf8"), JSON.stringify({ token: "rotated" }));
    await adapter.closeSession(payload.sessionId);
});
test("Codex adapter publishes captured ChatGPT auth on close after API-lane fallback publish failure", async () => {
    const transport = new FakeCodexTransport();
    const authMaterialUpdates = [];
    let launchOptions;
    let publishAttempts = 0;
    let failedPublishSource;
    const storedAuthMaterial = {
        format: "codex_home_files_v1",
        files: [
            {
                path: "auth.json",
                dataBase64: Buffer.from(JSON.stringify({ token: "stored" })).toString("base64"),
                mode: 0o600,
            },
        ],
    };
    const baseFingerprintSha256 = codexAuthMaterialFingerprintSha256(storedAuthMaterial);
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "fallback-key" },
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
        authMaterialUpdateSink: {
            publishCodexAuthMaterialUpdated: async (payload) => {
                publishAttempts += 1;
                if (publishAttempts === 1) {
                    failedPublishSource = payload.source;
                    throw new Error("temporary publish failure");
                }
                authMaterialUpdates.push(payload);
            },
        },
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        auth: {
            provider: "openai",
            authMode: "codex_chatgpt_with_api_fallback",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                openAiApiKeyMaterial: { apiKey: "fallback-key" },
                codexAuthMaterial: storedAuthMaterial,
                codexAuthMaterialFingerprintSha256: baseFingerprintSha256,
            },
        },
    });
    const started = await adapter.startSession(payload);
    assert.ok(launchOptions?.codexHomePath);
    transport.rateLimitsReadHook = async () => {
        await fs.writeFile(path.join(launchOptions?.codexHomePath ?? "", "auth.json"), JSON.stringify({ token: "rotated" }));
    };
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    await adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    });
    assert.equal(failedPublishSource, "chatgpt_quota_fallback");
    assert.equal(publishAttempts, 1);
    assert.equal(authMaterialUpdates.length, 0);
    await fs.writeFile(path.join(launchOptions.codexHomePath, "auth.json"), JSON.stringify({ auth_mode: "apikey", OPENAI_API_KEY: "fallback-key" }));
    await adapter.closeSession(payload.sessionId);
    assert.equal(publishAttempts, 2);
    assert.equal(authMaterialUpdates.length, 1);
    assert.equal(authMaterialUpdates[0]?.source, "session_close");
    assert.equal(authMaterialUpdates[0]?.baseFingerprintSha256, baseFingerprintSha256);
    assert.equal(Buffer.from(authMaterialUpdates[0]?.authMaterial.files[0]?.dataBase64 ?? "", "base64").toString("utf8"), JSON.stringify({ token: "rotated" }));
});
test("Codex adapter switches startup lane to API when stored ChatGPT auth resolves to API key", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    transport.accountType = "apiKey";
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "fallback-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        auth: chatGptWithApiFallbackAuth(),
    });
    const result = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    assert.equal(result.runtimeMetadata.activeLane, "openai_api");
    assert.deepEqual(transport.requests.map((request) => request.method), [
        "initialize",
        "account/read",
        "account/login/start",
        "thread/start",
    ]);
    assert.deepEqual(transport.requests[2]?.params, {
        type: "apiKey",
        apiKey: "fallback-key",
    });
    const routing = events.find((event) => event.eventType === "usage.routing.switched");
    assert.equal(routing?.payload.previousLane, "chatgpt_plan");
    assert.equal(routing?.payload.activeLane, "openai_api");
    assert.equal(routing?.payload.reason, "session_auth_api_key");
});
test("Codex adapter preserves ChatGPT thread rollouts across cold resume", async () => {
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-chatgpt-rollout-root-"));
    let launchCount = 0;
    let firstCodexHomePath;
    let secondCodexHomePath;
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "fallback-key" },
        transportFactory: (options) => {
            launchCount += 1;
            if (launchCount === 1) {
                firstCodexHomePath = options.codexHomePath;
            }
            else {
                secondCodexHomePath = options.codexHomePath;
            }
            const transport = new FakeCodexTransport();
            transport.requestHook = async (method, params) => {
                const markerPath = path.join(options.codexHomePath, "sessions", "thread-1", "rollout.jsonl");
                if (method === "thread/start") {
                    await fs.mkdir(path.dirname(markerPath), { recursive: true });
                    await fs.writeFile(markerPath, "rollout", "utf8");
                }
                if (method === "thread/resume") {
                    assert.equal(await fs.readFile(markerPath, "utf8"), "rollout");
                    assert.equal(params.persistExtendedHistory, true);
                }
            };
            return transport;
        },
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        layout: sessionLayout(rootPath),
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    assert.equal(started.codexThreadId, "thread-1");
    assert.ok(firstCodexHomePath);
    assert.notEqual(firstCodexHomePath, path.join(rootPath, "codex-home"));
    await adapter.closeSession(payload.sessionId);
    assert.equal(await pathExists(firstCodexHomePath), false);
    assert.equal(await fs.readFile(path.join(rootPath, "codex-home", "sessions", "thread-1", "rollout.jsonl"), "utf8"), "rollout");
    const resumed = await adapter.startSession({
        ...payload,
        commandId: "session-command-2",
        codexThreadId: started.codexThreadId,
        persistExtendedHistory: true,
    });
    assert.equal(resumed.codexThreadId, "thread-1");
    assert.ok(secondCodexHomePath);
    assert.notEqual(secondCodexHomePath, firstCodexHomePath);
    assert.equal(await fs.readFile(path.join(secondCodexHomePath, "sessions", "thread-1", "rollout.jsonl"), "utf8"), "rollout");
    await adapter.closeSession(payload.sessionId);
});
test("Codex adapter does not reactivate an interrupted turn from replayed cold-resume metrics", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    transport.requestHook = (method) => {
        if (method !== "thread/resume") {
            return;
        }
        transport.emit({
            method: "thread/status/changed",
            params: {
                threadId: "thread-1",
                status: { type: "idle" },
            },
        });
        transport.emit({
            method: "thread/tokenUsage/updated",
            params: {
                threadId: "thread-1",
                turnId: "interrupted-turn-1",
                tokenUsage: {
                    total: { inputTokens: 10, outputTokens: 1, totalTokens: 11 },
                },
            },
        });
    };
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        codexThreadId: "thread-1",
    });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    assert.equal(started.codexThreadId, "thread-1");
    assert.equal(started.codexTurnId, null);
    assert.equal(events.find((event) => event.eventType === "metrics.updated")?.codexTurnId, "interrupted-turn-1");
    transport.emit({
        method: "thread/tokenUsage/updated",
        params: {
            threadId: "thread-1",
            turnId: "interrupted-turn-1",
            tokenUsage: {
                total: { inputTokens: 12, outputTokens: 1, totalTokens: 13 },
            },
        },
    });
    const paused = await adapter.pauseSession({
        commandId: "pause-after-cold-resume-command",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: true,
        keepWarm: true,
    });
    assert.equal(paused.result?.interrupted, false);
    assert.equal(paused.codexTurnId, null);
    assert.equal(transport.requests.some((request) => request.method === "turn/interrupt"), false);
    await adapter.closeAll();
});
test("Codex adapter restores an active cold-resume turn from metrics after active status", async () => {
    const transport = new FakeCodexTransport();
    transport.requestHook = (method) => {
        if (method !== "thread/resume") {
            return;
        }
        transport.emit({
            method: "thread/status/changed",
            params: {
                threadId: "thread-1",
                status: { type: "active", activeFlags: [] },
            },
        });
        transport.emit({
            method: "thread/tokenUsage/updated",
            params: {
                threadId: "thread-1",
                turnId: "active-cold-turn-1",
                tokenUsage: {
                    total: { inputTokens: 10, outputTokens: 1, totalTokens: 11 },
                },
            },
        });
    };
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        codexThreadId: "thread-1",
    });
    const started = await adapter.startSession(payload);
    assert.equal(started.codexTurnId, "active-cold-turn-1");
    const paused = await adapter.pauseSession({
        commandId: "pause-active-cold-turn-command",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: true,
        keepWarm: true,
    });
    assert.equal(paused.result?.interrupted, true);
    assert.deepEqual(transport.requests.find((request) => request.method === "turn/interrupt")?.params, { threadId: "thread-1", turnId: "active-cold-turn-1" });
    await adapter.closeAll();
});
test("Codex adapter restores an active cold-resume turn from the thread response", async () => {
    const transport = new FakeCodexTransport();
    transport.threadResumeResponse = {
        thread: {
            id: "thread-1",
            status: { type: "active", activeFlags: [] },
            turns: [
                { id: "completed-response-turn-1", status: "completed", items: [] },
                { id: "active-response-turn-1", status: "inProgress", items: [] },
            ],
        },
    };
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        codexThreadId: "thread-1",
    });
    const started = await adapter.startSession(payload);
    assert.equal(started.codexTurnId, "active-response-turn-1");
    transport.emit({
        method: "thread/tokenUsage/updated",
        params: {
            threadId: "thread-1",
            turnId: "completed-response-turn-1",
            tokenUsage: {
                total: { inputTokens: 12, outputTokens: 1, totalTokens: 13 },
            },
        },
    });
    const paused = await adapter.pauseSession({
        commandId: "pause-active-response-turn-command",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: true,
        keepWarm: true,
    });
    assert.equal(paused.result?.interrupted, true);
    assert.deepEqual(transport.requests.find((request) => request.method === "turn/interrupt")?.params, { threadId: "thread-1", turnId: "active-response-turn-1" });
    await adapter.closeAll();
});
test("Codex adapter restores a still-running warm turn from post-resume metrics", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({ codexThreadId: "thread-1" });
    const started = await adapter.startSession(payload);
    const paused = await adapter.pauseSession({
        commandId: "pause-running-turn-without-interrupt-command",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        codexTurnId: started.codexTurnId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    assert.equal(paused.result?.interrupted, false);
    assert.equal(paused.codexTurnId, "turn-1");
    const resumed = await adapter.resumeSession({
        commandId: "resume-running-turn-command",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.equal(resumed.codexTurnId, null);
    transport.emit({
        method: "thread/tokenUsage/updated",
        params: {
            threadId: started.codexThreadId,
            turnId: "turn-1",
            tokenUsage: {
                total: { inputTokens: 12, outputTokens: 1, totalTokens: 13 },
            },
        },
    });
    const interrupted = await adapter.pauseSession({
        commandId: "pause-restored-running-turn-command",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: true,
        keepWarm: true,
    });
    assert.equal(interrupted.result?.interrupted, true);
    assert.equal(interrupted.codexTurnId, null);
    assert.deepEqual([...transport.requests].reverse().find((request) => request.method === "turn/interrupt")?.params, { threadId: started.codexThreadId, turnId: "turn-1" });
    await adapter.closeAll();
});
test("Codex adapter treats API-key shaped stored Codex auth material as API lane", async () => {
    const transport = new FakeCodexTransport();
    const authMaterialUpdates = [];
    let launchOptions;
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "fallback-key" },
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
        authMaterialUpdateSink: {
            publishCodexAuthMaterialUpdated: async (payload) => {
                authMaterialUpdates.push(payload);
            },
        },
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        auth: {
            provider: "openai",
            authMode: "codex_chatgpt_with_api_fallback",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                openAiApiKeyMaterial: { apiKey: "fallback-key" },
                codexAuthMaterial: {
                    format: "codex_home_files_v1",
                    files: [
                        {
                            path: "auth.json",
                            dataBase64: Buffer.from(JSON.stringify({ token: "benign-first-entry" })).toString("base64"),
                            mode: 0o600,
                        },
                        {
                            path: "auth.json",
                            dataBase64: Buffer.from(JSON.stringify({ auth_mode: "apikey", OPENAI_API_KEY: "fallback-key" })).toString("base64"),
                            mode: 0o600,
                        },
                    ],
                },
            },
        },
    });
    const result = await adapter.startSession(payload);
    assert.equal(result.runtimeMetadata.activeLane, "openai_api");
    assert.deepEqual(transport.requests.map((request) => request.method), [
        "initialize",
        "account/login/start",
        "thread/start",
    ]);
    assert.ok(launchOptions?.codexHomePath);
    await adapter.closeSession(payload.sessionId);
    assert.equal(authMaterialUpdates.length, 0);
});
test("Codex adapter snapshots host ChatGPT auth before API fallback", async () => {
    const transport = new FakeCodexTransport();
    let launchOptions;
    let refreshedBeforeFallback = false;
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    transport.rateLimitsReadHook = async () => {
        if (refreshedBeforeFallback || transport.accountType !== "chatgpt" || !launchOptions?.codexHomePath) {
            return;
        }
        refreshedBeforeFallback = true;
        await fs.writeFile(path.join(launchOptions.codexHomePath, "auth.json"), JSON.stringify({ token: "refreshed-before-fallback" }));
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    assert.equal(started.runtimeMetadata.activeLane, "openai_api");
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    await sleep(5);
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 0, windowDurationMins: 300, resetsAt: 1779000000 },
            },
        },
    };
    restoreStoredChatGptOnAccountRead(transport);
    const resumed = await adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.equal(usageRoutingLane(resumed.result), "chatgpt_plan");
    assert.ok(launchOptions?.codexHomePath);
    assert.equal(await fs.readFile(path.join(launchOptions.codexHomePath, "auth.json"), "utf8"), JSON.stringify({ token: "refreshed-before-fallback" }));
});
test("Codex adapter probes ChatGPT before Chief warm resume and switches back after reset", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                secondary: { usedPercent: 25, windowDurationMins: 10080, resetsAt: 4102444800 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "50",
        },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            codexConfig: {
                developerInstructions: "Keep long-running commands in their live exec sessions.",
                config: {
                    background_terminal_max_timeout: 1800000,
                    model: "must-not-be-replayed",
                },
            },
        },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    assert.equal(started.runtimeMetadata.activeLane, "openai_api");
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    await sleep(60);
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 0, windowDurationMins: 300, resetsAt: 1779000000 },
            },
        },
    };
    restoreStoredChatGptOnAccountRead(transport);
    const resumeRequestOffset = transport.requests.length;
    const resumed = await adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.equal(usageRoutingLane(resumed.result), "chatgpt_plan");
    assert.deepEqual(transport.requests.slice(resumeRequestOffset).map((request) => request.method), ["initialize", "account/read", "account/rateLimits/read", "thread/resume", "account/rateLimits/read"]);
    const resumeParams = transport.requests[resumeRequestOffset + 3]?.params;
    assert.equal(resumeParams.developerInstructions, "Keep long-running commands in their live exec sessions.");
    assert.deepEqual(resumeParams.config, {
        background_terminal_max_timeout: 1800000,
    });
    assert.equal("model" in resumeParams, false);
    assert.equal(resumeParams.serviceTier, null);
    const switches = events.filter((event) => event.eventType === "usage.routing.switched");
    assert.equal(switches.at(-1)?.payload.previousLane, "openai_api");
    assert.equal(switches.at(-1)?.payload.activeLane, "chatgpt_plan");
});
test("Codex adapter relaunches API transport after return-probe launch failure", async () => {
    const initialTransport = new FakeCodexTransport();
    const restoredTransport = new FakeCodexTransport();
    let launchCount = 0;
    initialTransport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        transportFactory: () => {
            launchCount += 1;
            if (launchCount === 1) {
                return initialTransport;
            }
            if (launchCount === 2) {
                throw new Error("transient docker launch failure");
            }
            return restoredTransport;
        },
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            codexConfig: {
                developerInstructions: "Keep long-running commands in their live exec sessions.",
                config: {
                    background_terminal_max_timeout: 1800000,
                    model: "must-not-be-replayed",
                },
            },
        },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    assert.equal(started.runtimeMetadata.activeLane, "openai_api");
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    await sleep(5);
    const resumed = await adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.equal(usageRoutingLane(resumed.result), "openai_api");
    assert.equal(launchCount, 3);
    assert.equal(initialTransport.closeCount, 1);
    assert.deepEqual(restoredTransport.requests.map((request) => request.method), [
        "initialize",
        "account/login/start",
        "thread/resume",
    ]);
    assert.deepEqual(restoredTransport.requests[1]?.params, {
        type: "apiKey",
        apiKey: "fallback-key",
    });
    const resumeParams = restoredTransport.requests[2]?.params;
    assert.equal(resumeParams.developerInstructions, "Keep long-running commands in their live exec sessions.");
    assert.deepEqual(resumeParams.config, {
        background_terminal_max_timeout: 1800000,
    });
    assert.equal("model" in resumeParams, false);
});
test("Codex adapter resumes active thread after return-probe relaunch restores API transport", async () => {
    const initialTransport = new FakeCodexTransport();
    const restoredTransport = new FakeCodexTransport();
    let launchCount = 0;
    initialTransport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        transportFactory: () => {
            launchCount += 1;
            if (launchCount === 1) {
                return initialTransport;
            }
            if (launchCount === 2) {
                throw new Error("transient docker launch failure");
            }
            return restoredTransport;
        },
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    assert.equal(started.runtimeMetadata.activeLane, "openai_api");
    await sleep(5);
    const turn = await adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    });
    assert.equal(usageRoutingLane(turn.result), "openai_api");
    assert.equal(launchCount, 3);
    assert.equal(initialTransport.closeCount, 1);
    assert.deepEqual(restoredTransport.requests.map((request) => request.method), [
        "initialize",
        "account/login/start",
        "thread/resume",
        "turn/start",
    ]);
    assert.deepEqual(restoredTransport.requests[1]?.params, {
        type: "apiKey",
        apiKey: "fallback-key",
    });
    assert.equal((restoredTransport.requests[2]?.params).threadId, started.codexThreadId);
    assert.equal((restoredTransport.requests[2]?.params).serviceTier, "flex");
    assert.equal((restoredTransport.requests[3]?.params).threadId, started.codexThreadId);
    assert.equal((restoredTransport.requests[3]?.params).serviceTier, "flex");
});
test("Codex adapter closes failed replacement transport before return-probe relaunch retry", async () => {
    const initialTransport = new FakeCodexTransport();
    const failedReplacementTransport = new FakeCodexTransport();
    const restoredTransport = new FakeCodexTransport();
    let launchCount = 0;
    initialTransport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    failedReplacementTransport.requestHook = (method) => {
        if (method === "initialize") {
            throw new Error("replacement initialize failed");
        }
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        transportFactory: () => {
            launchCount += 1;
            if (launchCount === 1) {
                return initialTransport;
            }
            if (launchCount === 2) {
                return failedReplacementTransport;
            }
            assert.equal(failedReplacementTransport.closeCount, 1);
            return restoredTransport;
        },
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    await sleep(5);
    const turn = await adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    });
    assert.equal(usageRoutingLane(turn.result), "openai_api");
    assert.equal(launchCount, 3);
    assert.equal(initialTransport.closeCount, 1);
    assert.equal(failedReplacementTransport.closeCount, 1);
    assert.deepEqual(restoredTransport.requests.map((request) => request.method), [
        "initialize",
        "account/login/start",
        "thread/resume",
        "turn/start",
    ]);
});
test("Codex adapter retries active thread resume after transient post-relaunch resume failure", async () => {
    const initialTransport = new FakeCodexTransport();
    const restoredTransport = new FakeCodexTransport();
    let launchCount = 0;
    let restoredResumeAttempts = 0;
    initialTransport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    restoredTransport.requestHook = (method) => {
        if (method !== "thread/resume") {
            return;
        }
        restoredResumeAttempts += 1;
        if (restoredResumeAttempts === 1) {
            throw new Error("transient thread resume failure");
        }
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        transportFactory: () => {
            launchCount += 1;
            if (launchCount === 1) {
                return initialTransport;
            }
            if (launchCount === 2) {
                throw new Error("transient docker launch failure");
            }
            return restoredTransport;
        },
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    await sleep(5);
    await assert.rejects(adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    }), /OpenAI API fallback could not be restored after ChatGPT return probe/);
    const retryOffset = restoredTransport.requests.length;
    const turn = await adapter.startTurn({
        commandId: "turn-start-command-2",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue after retry." }],
    });
    assert.equal(usageRoutingLane(turn.result), "openai_api");
    assert.equal(launchCount, 3);
    assert.deepEqual(restoredTransport.requests.slice(retryOffset).map((request) => request.method), [
        "account/login/start",
        "thread/resume",
        "turn/start",
    ]);
    assert.equal(restoredResumeAttempts, 2);
    assert.equal((restoredTransport.requests[retryOffset + 1]?.params).threadId, started.codexThreadId);
    assert.equal((restoredTransport.requests[retryOffset + 2]?.params).threadId, started.codexThreadId);
});
test("Codex adapter backs off repeated non-auth-invalid ChatGPT return probe failures", async () => {
    const transport = new FakeCodexTransport();
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "20",
        },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    assert.equal(started.runtimeMetadata.activeLane, "openai_api");
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    await sleep(25);
    const firstProbeOffset = transport.requests.length;
    await adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.deepEqual(transport.requests.slice(firstProbeOffset).map((request) => request.method), ["initialize", "account/read", "account/login/start", "thread/resume"]);
    await adapter.pauseSession({
        commandId: "pause-command-2",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    await sleep(25);
    const secondProbeOffset = transport.requests.length;
    await adapter.resumeSession({
        commandId: "resume-command-2",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.deepEqual(transport.requests.slice(secondProbeOffset).map((request) => request.method), ["initialize", "account/read", "account/login/start", "thread/resume"]);
    await adapter.pauseSession({
        commandId: "pause-command-3",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    await sleep(25);
    const backedOffResumeOffset = transport.requests.length;
    await adapter.resumeSession({
        commandId: "resume-command-3",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.deepEqual(transport.requests.slice(backedOffResumeOffset).map((request) => request.method), ["thread/resume"]);
});
test("Codex adapter serializes pause with in-flight ChatGPT return probe", async () => {
    const transport = new FakeCodexTransport();
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "20",
        },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    await sleep(25);
    let resolveAccountReadStarted;
    let releaseAccountRead;
    const accountReadStarted = new Promise((resolve) => {
        resolveAccountReadStarted = resolve;
    });
    const accountReadReleased = new Promise((resolve) => {
        releaseAccountRead = resolve;
    });
    transport.accountReadHook = async () => {
        resolveAccountReadStarted?.();
        await accountReadReleased;
    };
    const resume = adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    await accountReadStarted;
    let pauseResolved = false;
    const pause = adapter.pauseSession({
        commandId: "pause-command-2",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    }).then((ack) => {
        pauseResolved = true;
        return ack;
    });
    await sleep(10);
    assert.equal(pauseResolved, false);
    assert.ok(releaseAccountRead);
    releaseAccountRead();
    await resume;
    await pause;
    assert.equal(pauseResolved, true);
});
test("Codex adapter uses env override for ChatGPT return probe delay", async () => {
    const transport = new FakeCodexTransport();
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "50",
        },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    assert.equal(started.runtimeMetadata.activeLane, "openai_api");
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    await sleep(60);
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 0, windowDurationMins: 300 },
            },
        },
    };
    restoreStoredChatGptOnAccountRead(transport);
    const resumeRequestOffset = transport.requests.length;
    const resumed = await adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.equal(usageRoutingLane(resumed.result), "chatgpt_plan");
    assert.deepEqual(transport.requests.slice(resumeRequestOffset).map((request) => request.method), ["initialize", "account/read", "account/rateLimits/read", "thread/resume", "account/rateLimits/read"]);
});
test("Codex adapter probes ChatGPT before next Chief turn after prior turn completed", async () => {
    const transport = new FakeCodexTransport();
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            codexConfig: {
                approvalPolicy: "never",
                approvalsReviewer: "reviewer-1",
            },
        },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    assert.equal(started.codexTurnId, "turn-1");
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            turn: { id: "turn-1", status: "completed" },
        },
    });
    await sleep(5);
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 0, windowDurationMins: 300 },
            },
        },
    };
    restoreStoredChatGptOnAccountRead(transport);
    const turnRequestOffset = transport.requests.length;
    const turn = await adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    });
    assert.equal(usageRoutingLane(turn.result), "chatgpt_plan");
    assert.equal(transport.accountType, "chatgpt");
    const probeRequests = transport.requests.slice(turnRequestOffset);
    assert.deepEqual(probeRequests.map((request) => request.method), ["initialize", "account/read", "account/rateLimits/read", "thread/resume", "account/rateLimits/read", "turn/start"]);
    const probeResumeParams = probeRequests[3]?.params;
    assert.deepEqual(probeResumeParams, {
        approvalPolicy: "never",
        approvalsReviewer: "reviewer-1",
        sandbox: "danger-full-access",
        serviceTier: null,
        threadId: "thread-1",
        persistExtendedHistory: false,
    });
    const turnParams = probeRequests[5]?.params;
    assert.equal(turnParams.cwd, "/workspace/root/workspace");
    assert.equal(turnParams.approvalPolicy, "never");
    assert.equal(turnParams.approvalsReviewer, "reviewer-1");
    assert.equal(turnParams.serviceTier, null);
    assert.deepEqual(turnParams.sandboxPolicy, {
        type: "externalSandbox",
        networkAccess: "enabled",
    });
});
test("Codex adapter continues on API after a return-probe resume failure and reprobes ChatGPT", async () => {
    const transport = new FakeCodexTransport();
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    assert.equal(started.codexTurnId, "turn-1");
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            turn: { id: "turn-1", status: "completed" },
        },
    });
    await sleep(5);
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 0, windowDurationMins: 300 },
            },
        },
    };
    restoreStoredChatGptOnAccountRead(transport);
    let threadResumeAttempts = 0;
    transport.requestHook = (method) => {
        if (method !== "thread/resume") {
            return;
        }
        threadResumeAttempts += 1;
        if (threadResumeAttempts === 1) {
            throw new Error("thread resume failed");
        }
    };
    const fallbackRequestOffset = transport.requests.length;
    const fallbackTurn = await adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    });
    assert.equal(usageRoutingLane(fallbackTurn.result), "openai_api");
    assert.equal(fallbackTurn.codexTurnId, "turn-2");
    assert.deepEqual(transport.requests.slice(fallbackRequestOffset).map((request) => request.method), ["initialize", "account/read", "account/rateLimits/read", "thread/resume", "account/login/start", "thread/resume", "turn/start"]);
    assert.equal((transport.requests[fallbackRequestOffset + 3]?.params).serviceTier, null);
    assert.equal((transport.requests[fallbackRequestOffset + 5]?.params).serviceTier, "flex");
    assert.equal((transport.requests[fallbackRequestOffset + 6]?.params).serviceTier, "flex");
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: "thread-1",
            turnId: "turn-2",
            turn: { id: "turn-2", status: "completed" },
        },
    });
    await sleep(5);
    const retryRequestOffset = transport.requests.length;
    const turn = await adapter.startTurn({
        commandId: "turn-start-command-2",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue after retry." }],
    });
    assert.equal(usageRoutingLane(turn.result), "chatgpt_plan");
    assert.deepEqual(transport.requests.slice(retryRequestOffset).map((request) => request.method), ["initialize", "account/read", "account/rateLimits/read", "thread/resume", "account/rateLimits/read", "turn/start"]);
    assert.equal((transport.requests[retryRequestOffset + 3]?.params).serviceTier, null);
    assert.equal((transport.requests[retryRequestOffset + 5]?.params).serviceTier, null);
});
test("Codex adapter classifies return-probe resume failures by the attempted ChatGPT lane", async () => {
    const cases = [
        {
            name: "quota",
            error: new Error("429 rate limit exceeded"),
            forbiddenApiReason: "openai_api_quota_reached",
            expectedChatGptReason: null,
        },
        {
            name: "auth",
            error: new Error("failed to refresh token: 401 unauthorized"),
            forbiddenApiReason: "openai_api_auth_failed",
            expectedChatGptReason: "chatgpt_auth_invalid_api_fallback_active",
        },
    ];
    for (const testCase of cases) {
        const transport = new FakeCodexTransport();
        const events = [];
        transport.rateLimitsResponse = {
            rateLimitsByLimitId: {
                codex: {
                    primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                    rateLimitReachedType: "usage_limit",
                },
            },
        };
        const adapter = new CodexAdapter({
            env: {
                OPENAI_API_KEY: "fallback-key",
                YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "50",
                YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS: "60000",
            },
            transportFactory: () => transport,
        });
        const payload = vmSessionStartPayload({
            inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
            auth: chatGptWithApiFallbackAuth(),
        });
        const started = await adapter.startSession(payload, {
            onEvent: (event) => {
                events.push(event);
            },
        });
        transport.emit({
            method: "turn/completed",
            params: {
                threadId: started.codexThreadId,
                turnId: started.codexTurnId,
                turn: { id: started.codexTurnId, status: "completed" },
            },
        });
        await sleep(60);
        transport.rateLimitsResponse = {
            rateLimitsByLimitId: {
                codex: {
                    primary: { usedPercent: 0, windowDurationMins: 300 },
                },
            },
        };
        restoreStoredChatGptOnAccountRead(transport);
        let threadResumeAttempts = 0;
        transport.requestHook = (method) => {
            if (method !== "thread/resume") {
                return;
            }
            threadResumeAttempts += 1;
            if (threadResumeAttempts === 1) {
                throw testCase.error;
            }
        };
        const fallbackTurn = await adapter.startTurn({
            commandId: `turn-after-${testCase.name}-probe-failure`,
            sessionId: payload.sessionId,
            codexThreadId: started.codexThreadId,
            input: [{ type: "text", text: "Continue through the API fallback." }],
        });
        assert.equal(usageRoutingLane(fallbackTurn.result), "openai_api", testCase.name);
        const unavailableReasons = () => events
            .filter((event) => event.eventType === "usage.routing.unavailable")
            .map((event) => event.payload.reason);
        assert.equal(unavailableReasons().includes(testCase.forbiddenApiReason), false, testCase.name);
        if (testCase.expectedChatGptReason) {
            assert.equal(unavailableReasons().includes(testCase.expectedChatGptReason), true, testCase.name);
        }
        if (testCase.name === "quota") {
            transport.emit({
                method: "turn/completed",
                params: {
                    threadId: started.codexThreadId,
                    turnId: fallbackTurn.codexTurnId,
                    turn: { id: fallbackTurn.codexTurnId, status: "completed" },
                },
            });
            await sleep(1);
            transport.requestErrors.set("turn/start", new Error("429 rate limit exceeded"));
            await adapter.startTurn({
                commandId: "turn-with-genuine-api-quota-failure",
                sessionId: payload.sessionId,
                codexThreadId: started.codexThreadId,
                input: [{ type: "text", text: "This API request should fail." }],
            });
            assert.equal(unavailableReasons().filter((reason) => reason === "openai_api_quota_reached").length, 1);
        }
        await adapter.closeAll();
    }
});
test("Codex adapter preserves a persisted fast tier through ChatGPT probe and API restore resumes", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "50",
        },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    assert.equal(started.runtimeMetadata.activeLane, "openai_api");
    const fastTurn = await adapter.startTurn({
        commandId: "turn-start-fast-api",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue quickly." }],
        overrides: { serviceTier: "fast" },
    });
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: started.codexThreadId,
            turnId: fastTurn.codexTurnId,
            turn: { id: fastTurn.codexTurnId, status: "completed" },
        },
    });
    await sleep(60);
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 0, windowDurationMins: 300 },
            },
        },
    };
    restoreStoredChatGptOnAccountRead(transport);
    let threadResumeAttempts = 0;
    transport.requestHook = (method) => {
        if (method !== "thread/resume") {
            return;
        }
        threadResumeAttempts += 1;
        if (threadResumeAttempts === 1) {
            throw new Error("thread resume failed");
        }
    };
    const requestOffset = transport.requests.length;
    const review = await adapter.startReview({
        commandId: "review-start-after-fast-api",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        target: { type: "custom", instructions: "Review the fast turn." },
    });
    assert.equal(usageRoutingLane(review.result), "openai_api");
    const requests = transport.requests.slice(requestOffset);
    assert.deepEqual(requests.map((request) => request.method), ["initialize", "account/read", "account/rateLimits/read", "thread/resume", "account/login/start", "thread/resume", "review/start"]);
    assert.equal((requests[3]?.params).serviceTier, "fast");
    assert.equal((requests[5]?.params).serviceTier, "fast");
    assert.equal("serviceTier" in (requests[6]?.params ?? {}), false);
    transport.emit({
        method: "thread/tokenUsage/updated",
        params: {
            threadId: started.codexThreadId,
            tokenUsage: { total: { inputTokens: 20, outputTokens: 2, totalTokens: 22 } },
        },
    });
    const billingContext = [...events].reverse().find((event) => event.eventType === "metrics.updated")
        ?.payload.billingContext;
    assert.equal(billingContext?.lane, "openai_api");
    assert.equal(billingContext?.serviceTier, "fast");
    assert.equal(billingContext?.inferenceType, "priority");
    await adapter.closeAll();
});
test("Codex adapter resumes active-idle thread before continuing on API fallback when return probe is still quota-limited", async () => {
    const transport = new FakeCodexTransport();
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    assert.equal(started.codexTurnId, "turn-1");
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            turn: { id: "turn-1", status: "completed" },
        },
    });
    await sleep(5);
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1779000000 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    restoreStoredChatGptOnAccountRead(transport);
    const turnRequestOffset = transport.requests.length;
    const turn = await adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    });
    assert.equal(usageRoutingLane(turn.result), "openai_api");
    assert.equal(transport.accountType, "apiKey");
    assert.deepEqual(transport.requests.slice(turnRequestOffset).map((request) => request.method), ["initialize", "account/read", "account/rateLimits/read", "account/login/start", "thread/resume", "turn/start"]);
    assert.equal((transport.requests[turnRequestOffset + 4]?.params).serviceTier, "flex");
    assert.equal((transport.requests[turnRequestOffset + 5]?.params).serviceTier, "flex");
});
test("Codex adapter skips ChatGPT return probe for active Chief turn start with current turn", async () => {
    const transport = new FakeCodexTransport();
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    assert.equal(started.codexTurnId, "turn-1");
    await sleep(5);
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 0, windowDurationMins: 300 },
            },
        },
    };
    restoreStoredChatGptOnAccountRead(transport);
    const turnRequestOffset = transport.requests.length;
    const turn = await adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    });
    assert.equal(usageRoutingLane(turn.result), "openai_api");
    assert.equal(transport.accountType, "apiKey");
    assert.deepEqual(transport.requests.slice(turnRequestOffset).map((request) => request.method), ["turn/start"]);
});
test("Docker-backed active-idle ChatGPT return probe keeps Docker session running if turn start fails", async () => {
    const transport = new FakeCodexTransport();
    const cli = new FakeDockerCli();
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        hostPlatform: "linux",
        transportFactory: () => transport,
    });
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        dockerRuntime,
    });
    const payload = dockerBackedChatGptPayload({ initialTurnMode: undefined });
    const started = await adapter.startSession(payload);
    assert.equal(started.codexTurnId, "turn-1");
    transport.emit({
        method: "turn/completed",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            turn: { id: "turn-1", status: "completed" },
        },
    });
    await sleep(5);
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 0, windowDurationMins: 300 },
            },
        },
    };
    restoreStoredChatGptOnAccountRead(transport);
    transport.requestErrors.set("turn/start", new Error("turn start failed"));
    await assert.rejects(adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    }), /turn start failed/);
    assert.equal(dockerRuntime.getSession(payload.sessionId)?.status, "running");
    await adapter.closeSession(payload.sessionId).catch(() => undefined);
});
test("Codex adapter does not probe ChatGPT during Chief turn steer", async () => {
    const transport = new FakeCodexTransport();
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    await sleep(60);
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 0, windowDurationMins: 300 },
            },
        },
    };
    restoreStoredChatGptOnAccountRead(transport);
    const steerRequestOffset = transport.requests.length;
    const steered = await adapter.steerTurn({
        commandId: "steer-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        codexTurnId: "turn-1",
        input: [{ type: "text", text: "Narrow the scope." }],
    });
    assert.equal(usageRoutingLane(steered.result), "openai_api");
    assert.deepEqual(transport.requests.slice(steerRequestOffset).map((request) => request.method), ["turn/steer"]);
    assert.equal(transport.accountType, "apiKey");
});
test("Codex adapter probes ChatGPT before Chief review start and switches back after reset", async () => {
    const transport = new FakeCodexTransport();
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    await sleep(60);
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 0, windowDurationMins: 300 },
            },
        },
    };
    restoreStoredChatGptOnAccountRead(transport);
    const reviewRequestOffset = transport.requests.length;
    const reviewed = await adapter.startReview({
        commandId: "review-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        target: { type: "custom", instructions: "Review the current work." },
    });
    assert.equal(usageRoutingLane(reviewed.result), "chatgpt_plan");
    assert.equal(reviewed.codexTurnId, "review-turn-1");
    assert.deepEqual(transport.requests.slice(reviewRequestOffset).map((request) => request.method), ["initialize", "account/read", "account/rateLimits/read", "account/rateLimits/read", "review/start"]);
});
test("Codex adapter keeps using API fallback when a ChatGPT return probe finds invalid auth", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    await sleep(5);
    events.length = 0;
    transport.requestErrors.set("account/read", new Error("Failed to refresh token: 401 Unauthorized: refresh_token_reused"));
    const resumed = await adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    const unavailable = events.find((event) => event.eventType === "usage.routing.unavailable");
    assert.ok(unavailable);
    assert.equal(unavailable.payload.code, "codex_chatgpt_auth_invalid");
    assert.equal(unavailable.payload.reason, "chatgpt_auth_invalid_api_fallback_active");
    assert.equal(unavailable.payload.authInvalidReason, "refresh_token_reused");
    assert.equal(unavailable.payload.recoverable, true);
    assert.equal(events.some((event) => event.eventType === "session.error"), false);
    assert.equal(usageRoutingLane(resumed.result), "openai_api");
    assert.equal(transport.accountType, "apiKey");
    const continued = await adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue" }],
    });
    assert.equal(usageRoutingLane(continued.result), "openai_api");
});
test("Codex adapter fails command when API lane restore fails after still-limited return probe", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    await sleep(5);
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1779000000 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    restoreStoredChatGptOnAccountRead(transport);
    transport.requestErrors.set("account/login/start", new Error("401 Unauthorized invalid API key"));
    await assert.rejects(adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    }), /OpenAI API fallback could not be restored/);
    const unavailable = events.find((event) => event.eventType === "usage.routing.unavailable");
    assert.ok(unavailable);
    assert.equal(unavailable.payload.reason, "openai_api_auth_failed");
    assert.equal(unavailable.payload.lane, "openai_api");
    assert.equal(transport.accountType, "chatgpt");
    transport.requestErrors.delete("account/login/start");
    const retryRequestOffset = transport.requests.length;
    const retried = await adapter.resumeSession({
        commandId: "resume-command-2",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.equal(usageRoutingLane(retried.result), "openai_api");
    assert.equal(transport.accountType, "apiKey");
    assert.deepEqual(transport.requests.slice(retryRequestOffset).map((request) => request.method), ["account/login/start", "thread/resume"]);
});
test("Codex adapter restores pending API lane before Chief turn steer", async () => {
    const transport = new FakeCodexTransport();
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    await sleep(5);
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1779000000 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    restoreStoredChatGptOnAccountRead(transport);
    transport.requestErrors.set("account/login/start", new Error("401 Unauthorized invalid API key"));
    await assert.rejects(adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    }), /OpenAI API fallback could not be restored/);
    assert.equal(transport.accountType, "chatgpt");
    transport.requestErrors.delete("account/login/start");
    const steerRequestOffset = transport.requests.length;
    const steered = await adapter.steerTurn({
        commandId: "steer-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        codexTurnId: "turn-1",
        input: [{ type: "text", text: "Narrow the scope." }],
    });
    assert.equal(usageRoutingLane(steered.result), "openai_api");
    assert.equal(transport.accountType, "apiKey");
    assert.deepEqual(transport.requests.slice(steerRequestOffset).map((request) => request.method), ["account/login/start", "turn/steer"]);
});
test("Codex adapter parses string reset timestamps and floors stale probe deadlines", async () => {
    const transport = new FakeCodexTransport();
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: "1" },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "50",
        },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    const firstResumeOffset = transport.requests.length;
    const skipped = await adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.equal(usageRoutingLane(skipped.result), "openai_api");
    assert.deepEqual(transport.requests.slice(firstResumeOffset).map((request) => request.method), ["thread/resume"]);
    await adapter.pauseSession({
        commandId: "pause-command-2",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    await sleep(60);
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 0, windowDurationMins: 300, resetsAt: new Date(Date.now() + 60000).toISOString() },
            },
        },
    };
    restoreStoredChatGptOnAccountRead(transport);
    const secondResumeOffset = transport.requests.length;
    const recovered = await adapter.resumeSession({
        commandId: "resume-command-2",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.equal(usageRoutingLane(recovered.result), "chatgpt_plan");
    assert.deepEqual(transport.requests.slice(secondResumeOffset).map((request) => request.method), ["initialize", "account/read", "account/rateLimits/read", "thread/resume", "account/rateLimits/read"]);
});
test("Codex adapter restores API lane when Chief warm resume probe is still quota-limited", async () => {
    const transport = new FakeCodexTransport();
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    await sleep(5);
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1779000000 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    restoreStoredChatGptOnAccountRead(transport);
    const resumeRequestOffset = transport.requests.length;
    const resumed = await adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.equal(usageRoutingLane(resumed.result), "openai_api");
    assert.deepEqual(transport.requests.slice(resumeRequestOffset).map((request) => request.method), ["initialize", "account/read", "account/rateLimits/read", "account/login/start", "thread/resume"]);
    assert.deepEqual(transport.requests[resumeRequestOffset + 3]?.params, {
        type: "apiKey",
        apiKey: "fallback-key",
    });
    assert.equal((transport.requests[resumeRequestOffset + 4]?.params).serviceTier, "flex");
    assert.equal(transport.accountType, "apiKey");
});
test("Codex adapter publishes refreshed ChatGPT auth during still-limited return probe", async () => {
    const transport = new FakeCodexTransport();
    const authMaterialUpdates = [];
    let launchOptions;
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
        authMaterialUpdateSink: {
            publishCodexAuthMaterialUpdated: async (payload) => {
                authMaterialUpdates.push(payload);
            },
        },
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    assert.ok(launchOptions?.codexHomePath);
    assert.equal(started.runtimeMetadata.activeLane, "openai_api");
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    await sleep(5);
    transport.accountReadHook = async () => {
        transport.accountType = "chatgpt";
        await fs.writeFile(path.join(launchOptions?.codexHomePath ?? "", "auth.json"), JSON.stringify({ token: "refreshed" }));
    };
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1779000000 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const resumed = await adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.equal(usageRoutingLane(resumed.result), "openai_api");
    assert.equal(authMaterialUpdates.length, 1);
    assert.equal(authMaterialUpdates[0]?.source, "chatgpt_return_probe");
    assert.equal(Buffer.from(authMaterialUpdates[0]?.authMaterial.files[0]?.dataBase64 ?? "", "base64").toString("utf8"), JSON.stringify({ token: "refreshed" }));
    assert.equal(transport.accountType, "apiKey");
});
test("Docker-backed Codex quota fallback backs up ChatGPT auth in the container", async () => {
    const transport = new FakeCodexTransport();
    const cli = new FakeDockerCli();
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        hostPlatform: "linux",
        transportFactory: () => transport,
    });
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        dockerRuntime,
    });
    const payload = dockerBackedChatGptPayload();
    const started = await adapter.startSession(payload);
    assert.equal(started.runtimeMetadata.activeLane, "openai_api");
    assert.ok(cli.calls.some(isChatGptAuthBackupCall));
    assert.ok(transport.requests.some((request) => request.method === "account/login/start" &&
        JSON.stringify(request.params) === JSON.stringify({ type: "apiKey", apiKey: "fallback-key" })));
    await adapter.closeSession(payload.sessionId);
});
test("Docker-backed Codex return probe restores ChatGPT auth from the container backup", async () => {
    const transport = new FakeCodexTransport();
    const cli = new FakeDockerCli();
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        hostPlatform: "linux",
        transportFactory: () => transport,
    });
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        dockerRuntime,
    });
    const payload = dockerBackedChatGptPayload();
    const started = await adapter.startSession(payload);
    const session = dockerRuntime.getSession(payload.sessionId);
    const hostAuthJsonPath = path.join(session?.layout.codexHomePath ?? "", "auth.json");
    assert.ok(session);
    assert.equal(started.runtimeMetadata.activeLane, "openai_api");
    try {
        await fs.chmod(hostAuthJsonPath, 0o400);
        await adapter.pauseSession({
            commandId: "pause-command-1",
            sessionId: payload.sessionId,
            codexThreadId: started.codexThreadId,
            interruptActiveTurn: false,
            keepWarm: true,
        });
        await sleep(5);
        transport.rateLimitsResponse = {
            rateLimitsByLimitId: {
                codex: {
                    primary: { usedPercent: 0, windowDurationMins: 300, resetsAt: 1779000000 },
                },
            },
        };
        restoreStoredChatGptOnAccountRead(transport);
        const resumed = await adapter.resumeSession({
            commandId: "resume-command-1",
            sessionId: payload.sessionId,
            codexThreadId: started.codexThreadId,
        });
        assert.equal(usageRoutingLane(resumed.result), "chatgpt_plan");
        assert.ok(cli.calls.some(isChatGptAuthRestoreCall));
    }
    finally {
        await fs.chmod(hostAuthJsonPath, 0o600).catch(() => undefined);
        await adapter.closeSession(payload.sessionId).catch(() => undefined);
    }
});
test("Docker-backed Codex return probe stays on API lane when container backup restore fails", async () => {
    const transport = new FakeCodexTransport();
    const dockerCalls = [];
    const events = [];
    const cli = {
        async run(args) {
            dockerCalls.push(args);
            return isChatGptAuthRestoreCall(args)
                ? dockerCliResult(1, "", "restore failed")
                : dockerCliResult(0);
        },
    };
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        hostPlatform: "linux",
        transportFactory: () => transport,
    });
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        dockerRuntime,
    });
    const payload = dockerBackedChatGptPayload();
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    await sleep(5);
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 0, windowDurationMins: 300, resetsAt: 1779000000 },
            },
        },
    };
    const resumeRequestOffset = transport.requests.length;
    const resumed = await adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.equal(usageRoutingLane(resumed.result), "openai_api");
    assert.ok(dockerCalls.some(isChatGptAuthRestoreCall));
    assert.deepEqual(transport.requests.slice(resumeRequestOffset).map((request) => request.method), ["account/login/start", "thread/resume"]);
    assert.equal(events.some((event) => event.eventType === "session.error"), false);
    await adapter.closeSession(payload.sessionId);
});
test("Codex adapter does not probe ChatGPT for non-Chief warm resumes", async () => {
    const transport = new FakeCodexTransport();
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload);
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    await sleep(5);
    transport.rateLimitsResponse = { rateLimitsByLimitId: {} };
    const resumeRequestOffset = transport.requests.length;
    const resumed = await adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.equal(usageRoutingLane(resumed.result), "openai_api");
    assert.deepEqual(transport.requests.slice(resumeRequestOffset).map((request) => request.method), ["thread/resume"]);
});
test("Codex adapter keeps API lane when Chief warm resume stored ChatGPT auth restore fails", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "fallback-key",
            YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
        },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        auth: chatGptWithApiFallbackAuth(),
    });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    await sleep(5);
    const resumeRequestOffset = transport.requests.length;
    const resumed = await adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.equal(usageRoutingLane(resumed.result), "openai_api");
    assert.deepEqual(transport.requests.slice(resumeRequestOffset).map((request) => request.method), ["initialize", "account/read", "account/login/start", "thread/resume"]);
    assert.deepEqual(transport.requests[resumeRequestOffset + 2]?.params, {
        type: "apiKey",
        apiKey: "fallback-key",
    });
    assert.equal(events.some((event) => event.eventType === "session.error"), false);
    assert.equal(transport.accountType, "apiKey");
});
test("Codex adapter reports reached ChatGPT quota when API fallback is unavailable", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1779000000 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        auth: {
            provider: "openai",
            authMode: "codex_chatgpt",
            secretRef: null,
            metadata: {
                codexAuthMaterial: {
                    format: "codex_home_files_v1",
                    files: [
                        {
                            path: "auth.json",
                            dataBase64: Buffer.from(JSON.stringify({ token: "stored" })).toString("base64"),
                            mode: 0o600,
                        },
                    ],
                },
            },
        },
    });
    const result = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    const unavailable = events.find((event) => event.eventType === "usage.routing.unavailable");
    assert.ok(unavailable);
    assert.equal(unavailable.payload.reason, "chatgpt_quota_no_api_fallback");
    assert.equal(unavailable.payload.lane, "chatgpt_plan");
    assert.equal(unavailable.payload.attemptedFallbackLane, "openai_api");
    assert.equal(events.some((event) => event.eventType === "usage.routing.switched"), false);
    assert.equal(transport.requests.some((request) => request.method === "account/login/start"), false);
    assert.equal(result.runtimeMetadata.activeLane, "chatgpt_plan");
});
test("Codex adapter reports API fallback login failures", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1779000000 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    transport.requestErrors.set("account/login/start", new Error("401 Unauthorized invalid API key"));
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "fallback-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        auth: {
            provider: "openai",
            authMode: "codex_chatgpt_with_api_fallback",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                openAiApiKeyMaterial: { apiKey: "fallback-key" },
                codexAuthMaterial: {
                    format: "codex_home_files_v1",
                    files: [
                        {
                            path: "auth.json",
                            dataBase64: Buffer.from(JSON.stringify({ token: "stored" })).toString("base64"),
                            mode: 0o600,
                        },
                    ],
                },
            },
        },
    });
    await assert.rejects(adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    }), /invalid API key/);
    const unavailable = events.find((event) => event.eventType === "usage.routing.unavailable");
    assert.ok(unavailable);
    assert.equal(unavailable.payload.reason, "openai_api_auth_failed");
    assert.equal(unavailable.payload.lane, "chatgpt_plan");
    assert.equal(unavailable.payload.attemptedFallbackLane, "openai_api");
});
test("Codex adapter reports OpenAI API fallback quota failures", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1779000000 },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "fallback-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        auth: {
            provider: "openai",
            authMode: "codex_chatgpt_with_api_fallback",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                openAiApiKeyMaterial: { apiKey: "fallback-key" },
                codexAuthMaterial: {
                    format: "codex_home_files_v1",
                    files: [
                        {
                            path: "auth.json",
                            dataBase64: Buffer.from(JSON.stringify({ token: "stored" })).toString("base64"),
                            mode: 0o600,
                        },
                    ],
                },
            },
        },
    });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    assert.equal(started.runtimeMetadata.activeLane, "openai_api");
    events.length = 0;
    transport.requestErrors.set("turn/start", new Error("429 rate limit exceeded"));
    const turn = await adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue" }],
    });
    assert.equal(turn.result?.retryScheduled, true);
    const unavailable = events.find((event) => event.eventType === "usage.routing.unavailable");
    assert.ok(unavailable);
    assert.equal(unavailable.payload.reason, "openai_api_quota_reached");
    assert.equal(unavailable.payload.lane, "openai_api");
    assert.equal(unavailable.payload.attemptedFallbackLane, null);
    await adapter.closeAll();
});
test("Codex adapter reports primary OpenAI API quota failures without fallback wording", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "primary-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        auth: {
            provider: "openai",
            authMode: "openai_api_key",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                openAiApiKeyMaterial: { apiKey: "primary-key" },
            },
        },
    });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    assert.equal(started.runtimeMetadata.activeLane, "openai_api");
    events.length = 0;
    transport.requestErrors.set("turn/start", new Error("429 rate limit exceeded"));
    const turn = await adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue" }],
    });
    assert.equal(turn.result?.retryScheduled, true);
    const unavailable = events.find((event) => event.eventType === "usage.routing.unavailable");
    assert.ok(unavailable);
    assert.equal(unavailable.payload.reason, "primary_openai_api_quota_reached");
    assert.equal(unavailable.payload.message, "OpenAI API quota was reached.");
    assert.equal(unavailable.payload.lane, "openai_api");
    assert.equal(unavailable.payload.attemptedFallbackLane, null);
    await adapter.closeAll();
});
test("Codex adapter reports primary OpenAI API auth failures without fallback wording", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "primary-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        auth: {
            provider: "openai",
            authMode: "openai_api_key",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                openAiApiKeyMaterial: { apiKey: "primary-key" },
            },
        },
    });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    assert.equal(started.runtimeMetadata.activeLane, "openai_api");
    events.length = 0;
    transport.requestErrors.set("turn/start", new Error("401 Unauthorized invalid API key"));
    await assert.rejects(adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue" }],
    }), /invalid API key/);
    const unavailable = events.find((event) => event.eventType === "usage.routing.unavailable");
    assert.ok(unavailable);
    assert.equal(unavailable.payload.reason, "primary_openai_api_auth_failed");
    assert.equal(unavailable.payload.message, "OpenAI API key could not be used. Check the configured API key.");
    assert.equal(unavailable.payload.lane, "openai_api");
    assert.equal(unavailable.payload.attemptedFallbackLane, null);
});
test("Codex adapter publishes ChatGPT auth-invalid session error from refresh-token stderr", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    transport.accountReadStderr = `[codex app-server stderr] ERROR Failed to refresh token: 401 Unauthorized: {"error":{"message":"Your refresh token has already been used to generate a new access token. Please try signing in again.","type":"invalid_request_error","code":"refresh_token_reused"}}`;
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "fallback-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        auth: {
            provider: "openai",
            authMode: "codex_chatgpt_with_api_fallback",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                openAiApiKeyMaterial: { apiKey: "fallback-key" },
                codexAuthMaterial: {
                    format: "codex_home_files_v1",
                    files: [
                        {
                            path: "auth.json",
                            dataBase64: Buffer.from(JSON.stringify({ token: "stored" })).toString("base64"),
                            mode: 0o600,
                        },
                    ],
                },
            },
        },
    });
    await assert.rejects(adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    }), /ChatGPT Codex login has expired/);
    const authError = events.find((event) => event.eventType === "session.error");
    assert.ok(authError);
    assert.deepEqual(transport.requests.map((request) => request.method), ["initialize", "account/read"]);
    assert.equal(authError.payload.code, "codex_chatgpt_auth_invalid");
    assert.equal(authError.payload.reason, "refresh_token_reused");
    assert.equal(authError.payload.authProfileId, "auth-profile-id");
    assert.match(String(authError.payload.authFingerprintSha256), /^[a-f0-9]{64}$/);
    assert.equal(authError.payload.recoverable, true);
    assert.equal(transport.closeCount, 1);
});
test("Codex adapter publishes ChatGPT auth-invalid session error from warm request rejection", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "fallback-key" },
        transportFactory: () => transport,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        auth: {
            provider: "openai",
            authMode: "codex_chatgpt_with_api_fallback",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                openAiApiKeyMaterial: { apiKey: "fallback-key" },
                codexAuthMaterial: {
                    format: "codex_home_files_v1",
                    files: [
                        {
                            path: "auth.json",
                            dataBase64: Buffer.from(JSON.stringify({ token: "stored" })).toString("base64"),
                            mode: 0o600,
                        },
                    ],
                },
            },
        },
    });
    const started = await adapter.startSession(payload, {
        onEvent: (event) => {
            events.push(event);
        },
    });
    assert.ok(started.codexThreadId);
    events.length = 0;
    transport.requestErrors.set("turn/start", new Error("Failed to refresh token: 401 Unauthorized: refresh_token_reused"));
    await assert.rejects(adapter.startTurn({
        commandId: "turn-start-command-1",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue" }],
    }), /refresh_token_reused/);
    const authError = events.find((event) => event.eventType === "session.error");
    assert.ok(authError);
    assert.equal(authError.payload.code, "codex_chatgpt_auth_invalid");
    assert.equal(authError.payload.reason, "refresh_token_reused");
    assert.equal(authError.payload.authProfileId, "auth-profile-id");
    assert.match(String(authError.payload.authFingerprintSha256), /^[a-f0-9]{64}$/);
    await assert.rejects(adapter.startTurn({
        commandId: "turn-start-command-2",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue again" }],
    }), /ChatGPT Codex login has expired/);
    assert.equal(events.filter((event) => event.eventType === "session.error").length, 1);
});
test("Codex adapter cleans materialized auth when launch fails", async () => {
    let codexHomePath;
    const adapter = new CodexAdapter({
        transportFactory: (options) => {
            codexHomePath = options.codexHomePath;
            throw new Error("launch failed");
        },
    });
    const payload = vmSessionStartPayload({
        auth: {
            provider: "openai",
            authMode: "codex_chatgpt_with_api_fallback",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                codexAuthMaterial: {
                    format: "codex_home_files_v1",
                    files: [
                        {
                            path: "auth.json",
                            dataBase64: Buffer.from(JSON.stringify({ token: "stored" })).toString("base64"),
                            mode: 0o600,
                        },
                    ],
                },
            },
        },
    });
    await assert.rejects(adapter.startSession(payload), /launch failed/);
    assert.ok(codexHomePath);
    assert.equal(await pathExists(path.dirname(codexHomePath)), false);
});
test("Codex adapter preserves launch error when materialized auth cleanup is denied", async () => {
    if (process.platform === "win32") {
        return;
    }
    let sensitiveRootPath;
    let deniedPath;
    const originalConsoleError = console.error;
    const adapter = new CodexAdapter({
        transportFactory: (options) => {
            sensitiveRootPath = path.dirname(options.codexHomePath);
            deniedPath = path.join(options.codexHomePath, "tmp", "arg0");
            fsSync.mkdirSync(deniedPath, { recursive: true });
            fsSync.chmodSync(sensitiveRootPath, 0o000);
            throw new Error("launch failed before cleanup");
        },
    });
    const payload = vmSessionStartPayload({
        auth: {
            provider: "openai",
            authMode: "codex_chatgpt_with_api_fallback",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                codexAuthMaterial: {
                    format: "codex_home_files_v1",
                    files: [
                        {
                            path: "auth.json",
                            dataBase64: Buffer.from(JSON.stringify({ token: "stored" })).toString("base64"),
                            mode: 0o600,
                        },
                    ],
                },
            },
        },
    });
    console.error = () => undefined;
    try {
        await assert.rejects(adapter.startSession(payload), /launch failed before cleanup/);
        assert.ok(sensitiveRootPath);
        assert.equal(await pathExists(sensitiveRootPath), true);
    }
    finally {
        console.error = originalConsoleError;
        if (sensitiveRootPath) {
            await fs.chmod(sensitiveRootPath, 0o700).catch(() => undefined);
        }
        if (deniedPath) {
            await fs.chmod(deniedPath, 0o700).catch(() => undefined);
        }
        if (sensitiveRootPath) {
            await fs.rm(sensitiveRootPath, { recursive: true, force: true }).catch(() => undefined);
        }
    }
});
test("Codex adapter surfaces materialized auth cleanup failures on normal close", async () => {
    if (process.platform === "win32") {
        return;
    }
    let sensitiveRootPath;
    const originalConsoleError = console.error;
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        transportFactory: (options) => {
            sensitiveRootPath = path.dirname(options.codexHomePath);
            return transport;
        },
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        auth: {
            provider: "openai",
            authMode: "codex_chatgpt_with_api_fallback",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                codexAuthMaterial: {
                    format: "codex_home_files_v1",
                    files: [
                        {
                            path: "auth.json",
                            dataBase64: Buffer.from(JSON.stringify({ token: "stored" })).toString("base64"),
                            mode: 0o600,
                        },
                    ],
                },
            },
        },
    });
    await adapter.startSession(payload);
    assert.ok(sensitiveRootPath);
    await fs.chmod(sensitiveRootPath, 0o000);
    console.error = () => undefined;
    try {
        await assert.rejects(adapter.closeSession(payload.sessionId), /EACCES|EPERM|permission denied/i);
        assert.equal(await pathExists(sensitiveRootPath), true);
    }
    finally {
        console.error = originalConsoleError;
        await fs.chmod(sensitiveRootPath, 0o700).catch(() => undefined);
        await fs.rm(sensitiveRootPath, { recursive: true, force: true }).catch(() => undefined);
    }
});
test("Codex adapter surfaces materialized auth cleanup failures on cold pause", async () => {
    if (process.platform === "win32") {
        return;
    }
    let sensitiveRootPath;
    const originalConsoleError = console.error;
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        transportFactory: (options) => {
            sensitiveRootPath = path.dirname(options.codexHomePath);
            return transport;
        },
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        auth: {
            provider: "openai",
            authMode: "codex_chatgpt_with_api_fallback",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                codexAuthMaterial: {
                    format: "codex_home_files_v1",
                    files: [
                        {
                            path: "auth.json",
                            dataBase64: Buffer.from(JSON.stringify({ token: "stored" })).toString("base64"),
                            mode: 0o600,
                        },
                    ],
                },
            },
        },
    });
    await adapter.startSession(payload);
    assert.ok(sensitiveRootPath);
    await fs.chmod(sensitiveRootPath, 0o000);
    console.error = () => undefined;
    try {
        await assert.rejects(adapter.pauseSession({
            commandId: "pause-command-1",
            sessionId: payload.sessionId,
            keepWarm: false,
            interruptActiveTurn: false,
        }), /EACCES|EPERM|permission denied/i);
        assert.equal(await pathExists(sensitiveRootPath), true);
    }
    finally {
        console.error = originalConsoleError;
        await fs.chmod(sensitiveRootPath, 0o700).catch(() => undefined);
        await fs.rm(sensitiveRootPath, { recursive: true, force: true }).catch(() => undefined);
    }
});
test("Codex adapter completes ChatGPT device login and archives auth material", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-codex-auth-login-"));
    const transport = new FakeCodexTransport();
    const consoleEvents = [];
    const adapter = new CodexAdapter({
        transportFactory: () => transport,
        consoleEventSink: (event) => consoleEvents.push(formatVmAgentConsoleEvent(event, { colors: false })),
    });
    const authProfileId = "11111111-1111-4111-8111-111111111111";
    const vmHostId = "22222222-2222-4222-8222-222222222222";
    const started = await adapter.startAuthLogin({
        commandId: "codex-auth-start-1",
        authProfileId,
        vmHostId,
        rootPath: tempDir,
        loginType: "chatgptDeviceCode",
    });
    const authJson = JSON.stringify({ token: "stored" });
    await fs.writeFile(path.join(tempDir, "codex-home", "auth.json"), authJson);
    const completed = await adapter.completeAuthLogin({
        commandId: "codex-auth-complete-1",
        authProfileId,
        vmHostId,
        rootPath: tempDir,
        loginId: started.loginId,
        timeoutMs: 1000,
    });
    assert.equal(started.loginId, "login-1");
    assert.equal(started.userCode, "ABCD-EFGH");
    assert.equal(completed.account?.type, "chatgpt");
    assert.equal(completed.authMaterial.files[0]?.path, "auth.json");
    assert.equal(Buffer.from(completed.authMaterial.files[0]?.dataBase64 ?? "", "base64").toString("utf8"), authJson);
    assert.deepEqual(transport.requests.map((request) => request.method), [
        "initialize",
        "account/login/start",
        "account/read",
    ]);
    assert.deepEqual(transport.requests[1]?.params, { type: "chatgptDeviceCode" });
    assert.equal(transport.closeCount, 1);
    assert.equal(await pathExists(tempDir), false);
    assert.deepEqual(consoleEvents, [
        `[codex] auth.login.start profile=${authProfileId} vmHost=${vmHostId} login=chatgptDeviceCode`,
        `[codex] auth.login.started profile=${authProfileId} vmHost=${vmHostId} loginId=login-1`,
        `[codex] auth.login.complete profile=${authProfileId} vmHost=${vmHostId} loginId=login-1`,
        `[codex] auth.login.account profile=${authProfileId} vmHost=${vmHostId} loginId=login-1 account=chatgpt`,
        `[codex] auth.login.completed profile=${authProfileId} vmHost=${vmHostId} loginId=login-1 authJsonCount=1`,
    ]);
});
test("Codex adapter starts ChatGPT device login without key-like OpenAI or Codex env aliases", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-codex-auth-login-env-"));
    const transport = new FakeCodexTransport();
    let launchOptions;
    const adapter = new CodexAdapter({
        env: {
            OPENAI_API_KEY: "openai-key",
            CODEX_API_KEY: "codex-key",
            PS_AGENT_OVERRIDE_OPENAI_API_KEY: "override-key",
            AZURE_OPENAI_API_KEY: "azure-openai-key",
            OPENAI_BASE_URL: "https://example.invalid",
        },
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const authProfileId = "11111111-1111-4111-8111-111111111111";
    const vmHostId = "22222222-2222-4222-8222-222222222222";
    try {
        await adapter.startAuthLogin({
            commandId: "codex-auth-start-1",
            authProfileId,
            vmHostId,
            rootPath: tempDir,
            loginType: "chatgptDeviceCode",
        });
        assert.equal(launchOptions?.env.OPENAI_API_KEY, undefined);
        assert.equal(launchOptions?.env.CODEX_API_KEY, undefined);
        assert.equal(launchOptions?.env.PS_AGENT_OVERRIDE_OPENAI_API_KEY, undefined);
        assert.equal(launchOptions?.env.AZURE_OPENAI_API_KEY, undefined);
        assert.equal(launchOptions?.env.OPENAI_BASE_URL, "https://example.invalid");
    }
    finally {
        await adapter.closeAll();
    }
});
test("Codex adapter keeps ChatGPT device login alive after pending completion timeout", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-codex-auth-login-pending-"));
    const transport = new FakeCodexTransport();
    const consoleEvents = [];
    const adapter = new CodexAdapter({
        transportFactory: () => transport,
        consoleEventSink: (event) => consoleEvents.push(formatVmAgentConsoleEvent(event, { colors: false })),
    });
    const authProfileId = "11111111-1111-4111-8111-111111111111";
    const vmHostId = "22222222-2222-4222-8222-222222222222";
    const started = await adapter.startAuthLogin({
        commandId: "codex-auth-start-1",
        authProfileId,
        vmHostId,
        rootPath: tempDir,
        loginType: "chatgptDeviceCode",
    });
    transport.accountType = "apiKey";
    await assert.rejects(adapter.completeAuthLogin({
        commandId: "codex-auth-complete-1",
        authProfileId,
        vmHostId,
        rootPath: tempDir,
        loginId: started.loginId,
        timeoutMs: 1,
    }), /Timed out waiting for Codex ChatGPT login completion/);
    assert.equal(transport.closeCount, 0);
    assert.equal(await pathExists(tempDir), true);
    const authJson = JSON.stringify({ token: "stored-after-pending" });
    await fs.writeFile(path.join(tempDir, "codex-home", "auth.json"), authJson);
    transport.accountType = "chatgpt";
    const completed = await adapter.completeAuthLogin({
        commandId: "codex-auth-complete-2",
        authProfileId,
        vmHostId,
        rootPath: tempDir,
        loginId: started.loginId,
        timeoutMs: 1000,
    });
    assert.equal(completed.account?.type, "chatgpt");
    assert.equal(Buffer.from(completed.authMaterial.files[0]?.dataBase64 ?? "", "base64").toString("utf8"), authJson);
    assert.equal(transport.closeCount, 1);
    assert.equal(await pathExists(tempDir), false);
    assert.ok(consoleEvents.some((event) => event.includes("auth.login.pending")));
});
test("Codex adapter keeps ChatGPT device login alive after transient account read failure", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-codex-auth-login-read-error-"));
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        transportFactory: () => transport,
    });
    const authProfileId = "11111111-1111-4111-8111-111111111111";
    const vmHostId = "22222222-2222-4222-8222-222222222222";
    const started = await adapter.startAuthLogin({
        commandId: "codex-auth-start-1",
        authProfileId,
        vmHostId,
        rootPath: tempDir,
        loginType: "chatgptDeviceCode",
    });
    let accountReadAttempts = 0;
    transport.accountReadHook = () => {
        accountReadAttempts += 1;
        if (accountReadAttempts === 1) {
            throw new Error("authorization_pending");
        }
    };
    const authJson = JSON.stringify({ token: "stored-after-read-retry" });
    await fs.writeFile(path.join(tempDir, "codex-home", "auth.json"), authJson);
    const completed = await adapter.completeAuthLogin({
        commandId: "codex-auth-complete-1",
        authProfileId,
        vmHostId,
        rootPath: tempDir,
        loginId: started.loginId,
        timeoutMs: 1500,
    });
    assert.equal(accountReadAttempts, 2);
    assert.equal(completed.account?.type, "chatgpt");
    assert.equal(Buffer.from(completed.authMaterial.files[0]?.dataBase64 ?? "", "base64").toString("utf8"), authJson);
    assert.equal(transport.closeCount, 1);
    assert.equal(await pathExists(tempDir), false);
});
test("Codex adapter cleans up ChatGPT device login after terminal account read failure", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-codex-auth-login-terminal-read-error-"));
    const transport = new FakeCodexTransport();
    const consoleEvents = [];
    const adapter = new CodexAdapter({
        transportFactory: () => transport,
        consoleEventSink: (event) => consoleEvents.push(formatVmAgentConsoleEvent(event, { colors: false })),
    });
    const authProfileId = "11111111-1111-4111-8111-111111111111";
    const vmHostId = "22222222-2222-4222-8222-222222222222";
    const started = await adapter.startAuthLogin({
        commandId: "codex-auth-start-1",
        authProfileId,
        vmHostId,
        rootPath: tempDir,
        loginType: "chatgptDeviceCode",
    });
    transport.requestErrors.set("account/read", new Error("Codex app-server exited (1)"));
    await assert.rejects(adapter.completeAuthLogin({
        commandId: "codex-auth-complete-1",
        authProfileId,
        vmHostId,
        rootPath: tempDir,
        loginId: started.loginId,
        timeoutMs: 1500,
    }), /Codex app-server exited/);
    assert.equal(transport.closeCount, 1);
    assert.equal(await pathExists(tempDir), false);
    assert.ok(consoleEvents.some((event) => event.includes("auth.login.failed")));
    assert.equal(consoleEvents.some((event) => event.includes("auth.login.pending")), false);
});
test("Codex adapter rejects ChatGPT device login that archives API-key auth material", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-codex-auth-login-api-key-"));
    const transport = new FakeCodexTransport();
    const consoleEvents = [];
    const adapter = new CodexAdapter({
        transportFactory: () => transport,
        consoleEventSink: (event) => consoleEvents.push(formatVmAgentConsoleEvent(event, { colors: false })),
    });
    const authProfileId = "11111111-1111-4111-8111-111111111111";
    const vmHostId = "22222222-2222-4222-8222-222222222222";
    const started = await adapter.startAuthLogin({
        commandId: "codex-auth-start-1",
        authProfileId,
        vmHostId,
        rootPath: tempDir,
        loginType: "chatgptDeviceCode",
    });
    await fs.writeFile(path.join(tempDir, "codex-home", "auth.json"), JSON.stringify({ auth_mode: "apikey", OPENAI_API_KEY: "fallback-key" }));
    await assert.rejects(adapter.completeAuthLogin({
        commandId: "codex-auth-complete-1",
        authProfileId,
        vmHostId,
        rootPath: tempDir,
        loginId: started.loginId,
        timeoutMs: 1000,
    }), /OpenAI API key auth material/);
    assert.equal(transport.closeCount, 1);
    assert.equal(await pathExists(tempDir), false);
    const invalidEvent = consoleEvents.find((event) => event.includes("auth.login.invalid_material"));
    assert.ok(invalidEvent, consoleEvents.join("\n"));
    assert.match(invalidEvent, /authJsonAuthMode=apikey/u);
    assert.match(invalidEvent, /authJsonHasOpenAiApiKey=true/u);
    assert.match(invalidEvent, /OPENAI_API_KEY/u);
    assert.match(invalidEvent, /auth_mode/u);
});
test("Codex adapter accepts current ChatGPT auth material with token bundle and top-level OpenAI key", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-codex-auth-login-current-chatgpt-"));
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        transportFactory: () => transport,
    });
    const authProfileId = "11111111-1111-4111-8111-111111111111";
    const vmHostId = "22222222-2222-4222-8222-222222222222";
    const started = await adapter.startAuthLogin({
        commandId: "codex-auth-start-1",
        authProfileId,
        vmHostId,
        rootPath: tempDir,
        loginType: "chatgptDeviceCode",
    });
    const authJson = JSON.stringify({
        OPENAI_API_KEY: "redacted-token-proxy",
        auth_mode: "chatgpt",
        last_refresh: "2026-07-02T02:54:46.000Z",
        tokens: { access_token: "access", refresh_token: "refresh" },
    });
    await fs.writeFile(path.join(tempDir, "codex-home", "auth.json"), authJson);
    const completed = await adapter.completeAuthLogin({
        commandId: "codex-auth-complete-1",
        authProfileId,
        vmHostId,
        rootPath: tempDir,
        loginId: started.loginId,
        timeoutMs: 1000,
    });
    assert.equal(completed.account?.type, "chatgpt");
    assert.equal(Buffer.from(completed.authMaterial.files[0]?.dataBase64 ?? "", "base64").toString("utf8"), authJson);
});
test("Codex adapter reports ChatGPT auth cleanup failures after archiving auth material", async () => {
    if (process.platform === "win32") {
        return;
    }
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-codex-auth-cleanup-fail-"));
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        transportFactory: () => transport,
    });
    const authProfileId = "11111111-1111-4111-8111-111111111111";
    const vmHostId = "22222222-2222-4222-8222-222222222222";
    const started = await adapter.startAuthLogin({
        commandId: "codex-auth-start-1",
        authProfileId,
        vmHostId,
        rootPath: tempDir,
        loginType: "chatgptDeviceCode",
    });
    await fs.writeFile(path.join(tempDir, "codex-home", "auth.json"), JSON.stringify({ token: "stored" }));
    await fs.chmod(tempDir, 0o500);
    const originalConsoleError = console.error;
    console.error = () => undefined;
    try {
        await assert.rejects(adapter.completeAuthLogin({
            commandId: "codex-auth-complete-1",
            authProfileId,
            vmHostId,
            rootPath: tempDir,
            loginId: started.loginId,
            timeoutMs: 1000,
        }), /EACCES|EPERM|ENOTEMPTY|permission denied/i);
        assert.equal(transport.closeCount, 1);
        assert.equal(await pathExists(tempDir), true);
    }
    finally {
        console.error = originalConsoleError;
        await fs.chmod(tempDir, 0o700).catch(() => undefined);
        await fs.rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
    }
});
test("Codex adapter cancels ChatGPT device login and removes plaintext staging files", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-codex-auth-cancel-"));
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        transportFactory: () => transport,
    });
    const authProfileId = "11111111-1111-4111-8111-111111111111";
    const vmHostId = "22222222-2222-4222-8222-222222222222";
    const started = await adapter.startAuthLogin({
        commandId: "codex-auth-start-1",
        authProfileId,
        vmHostId,
        rootPath: tempDir,
        loginType: "chatgptDeviceCode",
    });
    await fs.writeFile(path.join(tempDir, "codex-home", "auth.json"), JSON.stringify({ token: "stored" }));
    const cancelled = await adapter.cancelAuthLogin({
        commandId: "codex-auth-cancel-1",
        authProfileId,
        vmHostId,
        rootPath: tempDir,
        loginId: started.loginId,
    });
    assert.equal(cancelled.loginId, "login-1");
    assert.equal(transport.closeCount, 1);
    assert.equal(await pathExists(tempDir), false);
});
test("Codex adapter advertises only A3-supported session commands", () => {
    const adapter = new CodexAdapter({ transportFactory: () => new FakeCodexTransport() });
    assert.deepEqual(adapter.supportedCommands, [
        "session.start",
        "session.pause",
        "session.resume",
        "session.thread.fork",
        "session.turn.start",
        "session.turn.steer",
        "session.inject_items",
        "session.interrupt",
        "session.approval.respond",
        "session.review.start",
    ]);
});
test("Codex adapter pauses warm sessions and resumes through the active transport", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    await adapter.startSession(vmSessionStartPayload());
    const paused = await adapter.pauseSession({
        commandId: "pause-command-1",
        sessionId: "session-id",
        codexThreadId: "thread-1",
        codexTurnId: "turn-1",
        interruptActiveTurn: true,
        keepWarm: true,
    });
    const resumed = await adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: "session-id",
        codexThreadId: "thread-1",
    });
    const pausedAgain = await adapter.pauseSession({
        commandId: "pause-command-2",
        sessionId: "session-id",
        codexThreadId: "thread-1",
        interruptActiveTurn: true,
        keepWarm: true,
    });
    assert.equal(paused.result?.status, "paused");
    assert.equal(paused.result?.interrupted, true);
    assert.equal(paused.codexTurnId, null);
    assert.equal(resumed.codexThreadId, "thread-1");
    assert.equal(resumed.codexTurnId, null);
    assert.equal(pausedAgain.result?.interrupted, false);
    assert.equal(transport.closeCount, 0);
    assert.deepEqual(transport.requests.map((request) => request.method), ["initialize", "account/login/start", "thread/start", "turn/start", "turn/interrupt", "thread/resume"]);
});
test("Codex adapter refuses to cold-close an active turn without interruption", async () => {
    const transport = new FakeCodexTransport();
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const started = await adapter.startSession(vmSessionStartPayload());
    await assert.rejects(adapter.pauseSession({
        commandId: "idle-auth-reload-pause-command",
        sessionId: "session-id",
        codexThreadId: started.codexThreadId,
        codexTurnId: started.codexTurnId,
        interruptActiveTurn: false,
        keepWarm: false,
    }), /active turn; refusing to close/);
    assert.equal(transport.closeCount, 0);
    assert.equal(transport.requests.some((request) => request.method === "turn/interrupt"), false);
    await adapter.closeAll();
});
test("Codex adapter rejects warm resume when Codex session capacity is full", async () => {
    const firstTransport = new FakeCodexTransport();
    const secondTransport = new FakeCodexTransport();
    const transports = [firstTransport, secondTransport];
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        defaultImage: OfficialCodexAppServerImage,
        maxCodexSessions: 1,
        transportFactory: () => transports.shift() ?? new FakeCodexTransport(),
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    await adapter.startSession(vmSessionStartPayload({
        sessionId: "session-one",
        commandId: "session-command-one",
        layout: sessionLayout("/workspace/root-one"),
    }));
    await adapter.pauseSession({
        commandId: "pause-command-one",
        sessionId: "session-one",
        codexThreadId: "thread-1",
        codexTurnId: "turn-1",
        interruptActiveTurn: true,
        keepWarm: true,
    });
    await adapter.startSession(vmSessionStartPayload({
        sessionId: "session-two",
        commandId: "session-command-two",
        layout: sessionLayout("/workspace/root-two"),
    }));
    await assert.rejects(() => adapter.resumeSession({
        commandId: "resume-command-one",
        sessionId: "session-one",
        codexThreadId: "thread-1",
    }), /capacity is full/u);
    assert.equal(dockerRuntime.getSession("session-one")?.status, "paused");
    assert.equal(dockerRuntime.getSession("session-two")?.status, "running");
    assert.equal(firstTransport.requests.filter((request) => request.method === "thread/resume").length, 0);
});
test("Codex adapter keeps Docker session paused when boundary fallback fails before a warm turn", async () => {
    const transport = new FakeCodexTransport();
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        defaultImage: OfficialCodexAppServerImage,
        maxCodexSessions: 1,
        transportFactory: () => transport,
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "fallback-key" },
        dockerRuntime,
    });
    const payload = vmSessionStartPayload({
        auth: {
            provider: "openai",
            authMode: "codex_chatgpt_with_api_fallback",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                openAiApiKeyMaterial: { apiKey: "fallback-key" },
                codexAuthMaterial: {
                    format: "codex_home_files_v1",
                    files: [
                        {
                            path: "auth.json",
                            dataBase64: Buffer.from(JSON.stringify({ token: "stored" })).toString("base64"),
                            mode: 0o600,
                        },
                    ],
                },
            },
        },
    });
    const started = await adapter.startSession(payload);
    await adapter.pauseSession({
        commandId: "pause-command-one",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        codexTurnId: started.codexTurnId,
        interruptActiveTurn: true,
        keepWarm: true,
    });
    transport.rateLimitsResponse = {
        rateLimitsByLimitId: {
            codex: {
                limitName: "Codex",
                planType: "pro",
                primary: {
                    usedPercent: 100,
                    windowDurationMins: 300,
                    resetsAt: 1779000000,
                },
                rateLimitReachedType: "usage_limit",
            },
        },
    };
    transport.requestErrors.set("account/login/start", new Error("401 Unauthorized invalid API key"));
    await assert.rejects(() => adapter.startTurn({
        commandId: "turn-start-command-one",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue" }],
    }), /invalid API key/u);
    assert.equal(dockerRuntime.getSession(payload.sessionId)?.status, "paused");
    assert.equal(dockerRuntime.getStatus().activeCodexSessions, 0);
    assert.equal(transport.requests.filter((request) => request.method === "turn/start").length, 1);
    assert.equal(transport.requests.filter((request) => request.method === "account/login/start").length, 1);
});
test("Codex adapter rejects warm activation when Docker session is already failed", async () => {
    const transport = new FakeCodexTransport();
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        defaultImage: OfficialCodexAppServerImage,
        maxCodexSessions: 1,
        transportFactory: () => transport,
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    const started = await adapter.startSession(vmSessionStartPayload());
    await adapter.pauseSession({
        commandId: "pause-command-one",
        sessionId: "session-id",
        codexThreadId: started.codexThreadId,
        codexTurnId: started.codexTurnId,
        interruptActiveTurn: true,
        keepWarm: true,
    });
    dockerRuntime.markSessionFailed("session-id", new Error("container exited"));
    await assert.rejects(() => adapter.resumeSession({
        commandId: "resume-command-one",
        sessionId: "session-id",
        codexThreadId: started.codexThreadId,
    }), /cannot be activated from failed state/u);
    assert.equal(dockerRuntime.getSession("session-id")?.status, "failed");
    assert.equal(dockerRuntime.getSession("session-id")?.error, "container exited");
    assert.equal(transport.requests.filter((request) => request.method === "thread/resume").length, 0);
});
test("Codex adapter reports not-warm when resuming without an in-memory transport", async () => {
    const adapter = new CodexAdapter({ transportFactory: () => new FakeCodexTransport() });
    await assert.rejects(() => adapter.resumeSession({
        commandId: "resume-command-1",
        sessionId: "missing-session",
        codexThreadId: "thread-1",
    }), /not warm/);
});
test("stdio Codex transport captures bounded stderr logs when configured", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-stdio-log-"));
    const logPath = path.join(tempDir, "logs", "codex-app-server.stderr.log");
    const sink = new BoundedFileLogSink(logPath, 128);
    const transport = new StdioCodexAppServerTransport({
        command: process.execPath,
        args: ["-e", echoInitializeScript("captured stderr\n")],
        cwd: tempDir,
        codexHomePath: tempDir,
        env: process.env,
        stderrLogSink: sink,
    });
    await transport.request("initialize", {});
    await transport.close();
    await sink.close();
    assert.equal(await fs.readFile(logPath, "utf8"), "captured stderr\n");
});
test("bounded stderr log sink writes a truncation marker within the byte limit", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-stdio-log-"));
    const logPath = path.join(tempDir, "stderr.log");
    const sink = new BoundedFileLogSink(logPath, 80);
    sink.writeStderr("x".repeat(200));
    await sink.close();
    const content = await fs.readFile(logPath, "utf8");
    assert.ok(Buffer.byteLength(content) <= 80);
    assert.match(content, /truncated/);
});
test("bounded stderr log sink refuses symlinked log files", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-stdio-log-"));
    const logsPath = path.join(tempDir, "logs");
    const logPath = path.join(logsPath, "codex-app-server.stderr.log");
    const outsidePath = path.join(tempDir, "outside.log");
    await fs.mkdir(logsPath, { recursive: true });
    await fs.writeFile(outsidePath, "outside\n");
    await fs.symlink(outsidePath, logPath);
    const originalConsoleError = console.error;
    console.error = () => undefined;
    const sink = new BoundedFileLogSink(logPath, 128, tempDir);
    try {
        sink.writeStderr("do not append outside\n");
        await sink.close();
    }
    finally {
        console.error = originalConsoleError;
    }
    assert.equal(await fs.readFile(outsidePath, "utf8"), "outside\n");
});
test("stdio Codex transport waits for stderr sink close before publishing exits", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-stdio-exit-"));
    const events = [];
    let releaseClose;
    let closeStarted;
    const closeStartedPromise = new Promise((resolve) => {
        closeStarted = resolve;
    });
    const closeReleasePromise = new Promise((resolve) => {
        releaseClose = resolve;
    });
    const originalConsoleError = console.error;
    console.error = () => undefined;
    const transport = new StdioCodexAppServerTransport({
        command: process.execPath,
        args: ["-e", "process.stderr.write('final stderr\\n'); process.exit(7);"],
        cwd: tempDir,
        codexHomePath: tempDir,
        env: process.env,
        stderrLogSink: {
            writeStderr(chunk) {
                events.push(`write:${chunk}`);
            },
            async close() {
                events.push("close:start");
                closeStarted?.();
                await closeReleasePromise;
                events.push("close:done");
            },
        },
    });
    const exitPromise = new Promise((resolve) => {
        transport.onExit((exit) => {
            events.push("exit");
            resolve(exit);
        });
    });
    try {
        await Promise.race([
            closeStartedPromise,
            sleep(1000).then(() => {
                throw new Error("Timed out waiting for stderr sink close");
            }),
        ]);
        assert.equal(events.includes("exit"), false);
        releaseClose?.();
        const exit = await exitPromise;
        assert.equal(exit.exitCode, 7);
        assert.deepEqual(events.slice(-2), ["close:done", "exit"]);
    }
    finally {
        console.error = originalConsoleError;
        await transport.close().catch(() => undefined);
        releaseClose?.();
    }
});
test("stdio Codex transport drains stderr without a configured log sink", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-stdio-drain-"));
    const originalConsoleError = console.error;
    const errors = [];
    console.error = (...args) => {
        errors.push(args.map(String).join(" "));
    };
    const transport = new StdioCodexAppServerTransport({
        command: process.execPath,
        args: ["-e", echoInitializeScript("drained stderr\n")],
        cwd: tempDir,
        codexHomePath: tempDir,
        env: process.env,
    });
    try {
        await transport.request("initialize", {});
        await transport.close();
    }
    finally {
        console.error = originalConsoleError;
    }
    assert.match(errors.join("\n"), /drained stderr/);
});
test("Codex adapter launches app-server through Docker by default", async () => {
    const transport = new FakeCodexTransport();
    const cli = new FakeDockerCli();
    let launchOptions;
    const rootPath = "/mnt/experiments/groups/201/experiments/e03-33333333";
    const previousArtifactsPath = "/mnt/experiments/groups/201/experiments/e02-22222222/artifacts";
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        hostPlatform: "linux",
        containerLdLibraryPath: "/usr/lib/x86_64-linux-gnu:/usr/local/cuda/targets/x86_64-linux/lib",
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    const payload = vmSessionStartPayload({
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
            resourcePolicy: {
                network: "provider",
                memoryBytes: 1024,
                cpus: "1.5",
            },
        },
        layout: sessionLayout(rootPath),
        previousArtifactMounts: [{
                sourcePath: previousArtifactsPath,
                containerPath: "/previous-artifacts/E02",
                readOnly: true,
                metadata: {
                    groupPlanPartId: "E02",
                },
            }],
    });
    const result = await adapter.startSession(payload);
    const args = launchOptions?.args ?? [];
    const threadParams = transport.requests[2]?.params;
    const turnParams = transport.requests[3]?.params;
    assert.equal(launchOptions?.command, "docker");
    assert.equal(launchOptions?.cwd, `${rootPath}/workspace`);
    assert.equal(args[0], "run");
    assert.equal(args.includes("--rm"), true);
    assert.equal(args.includes("-i"), true);
    assert.equal(args.includes("--runtime"), true);
    assert.equal(args[args.indexOf("--runtime") + 1], "sysbox-runc");
    assert.equal(args.includes("--privileged"), false);
    assert.equal(args.includes("--network"), true);
    assert.equal(args[args.indexOf("--network") + 1], "bridge");
    assert.equal(args.includes("--cap-drop"), false);
    assert.equal(args.includes("--security-opt"), false);
    assert.equal(args.includes("--init"), true);
    assert.equal(args.includes("--pids-limit"), true);
    assert.equal(args[args.indexOf("--pids-limit") + 1], "4096");
    assert.equal(args.includes("--ulimit"), true);
    assert.equal(args[args.indexOf("--ulimit") + 1], "nofile=1024:4096");
    assert.equal(args.includes("--read-only"), false);
    assert.equal(args.includes("--gpus"), false);
    assert.equal(args.includes("--device"), true);
    assert.equal(args[args.indexOf("--device") + 1], "/dev/nvidia0");
    assert.equal(args.includes("/dev/nvidiactl"), true);
    assert.equal(args.includes("/dev/nvidia-uvm"), true);
    assert.equal(args.includes("/dev/nvidia-uvm-tools"), true);
    assert.equal(args.includes("--user"), true);
    assert.equal(args[args.indexOf("--user") + 1], "0:0");
    assert.equal(args.includes(`type=bind,source=${rootPath}/workspace,target=/workspace`), true);
    assert.equal(args.includes(`type=bind,source=${rootPath}/codex-home,target=/codex-home`), true);
    assert.equal(args.includes(`type=bind,source=${rootPath}/artifacts,target=/artifacts`), true);
    assert.equal(args.includes(`type=bind,source=${rootPath}/cache,target=/cache`), true);
    assert.equal(args.includes(`type=bind,source=${previousArtifactsPath},target=/previous-artifacts/E02,readonly`), true);
    assert.equal(args.includes("type=bind,source=/usr/lib/x86_64-linux-gnu/libcuda.so.1,target=/usr/lib/x86_64-linux-gnu/libcuda.so.1,readonly"), true);
    assert.equal(args.includes("type=bind,source=/usr/lib/x86_64-linux-gnu/libnvidia-ml.so.1,target=/usr/lib/x86_64-linux-gnu/libnvidia-ml.so.1,readonly"), true);
    assert.equal(args.includes("type=bind,source=/usr/bin/nvidia-smi,target=/usr/bin/nvidia-smi,readonly"), true);
    assert.equal(args.includes("CODEX_HOME=/codex-home"), true);
    assert.equal(args.includes("HOME=/codex-home"), true);
    assert.equal(args.includes("ARTIFACTS_DIR=/artifacts"), true);
    assert.equal(args.includes("LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu:/usr/local/cuda/targets/x86_64-linux/lib"), true);
    assert.equal(args.some((arg) => arg.startsWith("PATH=")), false);
    assert.equal(args.includes("YP_LIVE_WORKFLOW_START_INNER_DOCKER=1"), true);
    assert.equal(args.includes("OPENAI_API_KEY"), false);
    assert.equal(launchOptions?.env.OPENAI_API_KEY, undefined);
    assert.ok(launchOptions?.stderrLogSink);
    assert.equal(args.includes("--memory"), true);
    assert.equal(args[args.indexOf("--memory") + 1], "1024b");
    assert.equal(args.includes("--cpus"), true);
    assert.equal(args[args.indexOf("--cpus") + 1], "1.5");
    assert.equal(args.includes(OfficialCodexAppServerImage), true);
    assert.deepEqual(args.slice(args.indexOf(OfficialCodexAppServerImage) + 1), ["codex", ...DefaultCodexAppServerArgs]);
    assert.equal(threadParams.cwd, "/workspace");
    assert.equal(turnParams.cwd, "/workspace");
    assert.equal(result.runtimeMetadata.execution, "docker");
    assert.equal(result.runtimeMetadata.containerImage, OfficialCodexAppServerImage);
    assert.equal(result.runtimeMetadata.dockerRuntime, "sysbox-runc");
    assert.equal(result.runtimeMetadata.dockerRuntimeMode, "linux_sysbox");
    assert.equal(result.runtimeMetadata.dockerGpuMode, "nvidia_direct");
    assert.equal(result.runtimeMetadata.privileged, false);
    assert.deepEqual(result.runtimeMetadata.nvidiaDirectGpu, {
        devices: [
            "/dev/nvidia0",
            "/dev/nvidiactl",
            "/dev/nvidia-uvm",
            "/dev/nvidia-uvm-tools",
        ],
        libraryMounts: [
            "/usr/lib/x86_64-linux-gnu/libcuda.so.1",
            "/usr/lib/x86_64-linux-gnu/libnvidia-ml.so.1",
        ],
        utilityMounts: [
            "/usr/bin/nvidia-smi",
        ],
    });
    assert.deepEqual(result.runtimeMetadata.logs, {
        appServerStderr: {
            path: `${rootPath}/artifacts/logs/codex-app-server.stderr.log`,
            relativePath: "logs/codex-app-server.stderr.log",
            maxBytes: 5 * 1024 * 1024,
        },
    });
    assert.deepEqual(result.runtimeMetadata.dockerPolicy, {
        network: "provider",
        gpus: "all",
        memoryBytes: 1024,
        cpus: "1.5",
        pidsLimit: 4096,
        nofileSoft: 1024,
        nofileHard: 4096,
        readOnlyRootFilesystem: false,
    });
    assert.deepEqual(result.runtimeMetadata.securityHardening, {
        capDrop: null,
        noNewPrivileges: false,
        init: true,
        pidsLimit: 4096,
        nofileSoft: 1024,
        nofileHard: 4096,
        readOnlyRootFilesystem: false,
    });
    assert.equal(dockerRuntime.getSession("session-id")?.status, "running");
    assert.deepEqual(dockerRuntime.getSession("session-id")?.securityHardening, {
        capDrop: null,
        noNewPrivileges: false,
        init: true,
        pidsLimit: 4096,
        nofileSoft: 1024,
        nofileHard: 4096,
        readOnlyRootFilesystem: false,
    });
    assert.equal(dockerRuntime.getSession("session-id")?.imagePreflightStatus, "present");
    assert.equal(result.runtimeMetadata.cwd, "/workspace");
    assert.equal(result.runtimeMetadata.codexHomePath, "/codex-home");
    await adapter.closeSession("session-id");
    assert.equal(dockerRuntime.getSession("session-id")?.status, "stopped");
    assert.deepEqual(cli.calls, [
        ["image", "inspect", OfficialCodexAppServerImage],
        ["stop", "yp-live-workflow-session-session-id"],
        ["rm", "-f", "yp-live-workflow-session-session-id"],
    ]);
});
test("Codex adapter mounts durable Codex sessions into Docker ChatGPT auth homes", async () => {
    const transport = new FakeCodexTransport();
    const cli = new FakeDockerCli();
    let launchOptions;
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-docker-chatgpt-sessions-"));
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        hostPlatform: "linux",
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "fallback-key" },
        dockerRuntime,
    });
    const result = await adapter.startSession(dockerBackedChatGptPayload({
        layout: sessionLayout(rootPath),
    }));
    const args = launchOptions?.args ?? [];
    const mounts = result.runtimeMetadata.mounts;
    const codexHomeMountIndex = mounts.findIndex((mount) => mount.target === "/codex-home");
    const sessionsMountIndex = mounts.findIndex((mount) => mount.target === "/codex-home/sessions");
    assert.ok(codexHomeMountIndex >= 0);
    assert.ok(sessionsMountIndex > codexHomeMountIndex);
    assert.notEqual(mounts[codexHomeMountIndex]?.source, path.join(rootPath, "codex-home"));
    assert.deepEqual(mounts[sessionsMountIndex], {
        source: path.join(rootPath, "codex-home", "sessions"),
        target: "/codex-home/sessions",
        readOnly: false,
    });
    assert.equal(args.includes(`type=bind,source=${path.join(rootPath, "codex-home", "sessions")},target=/codex-home/sessions`), true);
    assert.equal(await pathExists(path.join(rootPath, "codex-home", "sessions")), true);
    await adapter.closeSession("session-id");
});
test("Codex adapter injects Git safe-directory env for GitHub folder repos in Docker sessions", async () => {
    const transport = new FakeCodexTransport();
    const cli = new FakeDockerCli();
    let launchOptions;
    const rootPath = "/mnt/experiments/groups/201/experiments/e03-33333333";
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        hostPlatform: "linux",
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    await adapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
        layout: sessionLayout(rootPath),
        sensitiveHostPaths: [
            `${rootPath}/workspace/morpho-core/.git/yp-live-workflow-github-credential-helper.sh`,
        ],
    }));
    const args = launchOptions?.args ?? [];
    assert.equal(launchOptions?.env.GIT_CONFIG_COUNT, "1");
    assert.equal(launchOptions?.env.GIT_CONFIG_KEY_0, "safe.directory");
    assert.equal(launchOptions?.env.GIT_CONFIG_VALUE_0, "/workspace/morpho-core");
    assert.equal(args.includes("GIT_CONFIG_COUNT"), true);
    assert.equal(args.includes("GIT_CONFIG_KEY_0"), true);
    assert.equal(args.includes("GIT_CONFIG_VALUE_0"), true);
    await adapter.closeSession("session-id");
});
test("Codex adapter passes only workspace GitHub credential helpers as payload sensitive host paths", async () => {
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-codex-sensitive-helper-"));
    const archiveRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-codex-sensitive-helper-archive-"));
    const helperPath = path.join(rootPath, "workspace", "repo", ".git", "yp-live-workflow-github-credential-helper.sh");
    await fs.mkdir(path.dirname(helperPath), { recursive: true });
    await fs.mkdir(path.join(rootPath, "codex-home"), { recursive: true });
    await fs.mkdir(path.join(rootPath, "artifacts"), { recursive: true });
    await fs.mkdir(path.join(rootPath, "cache"), { recursive: true });
    await fs.writeFile(helperPath, "secret", "utf8");
    const transport = new FakeCodexTransport();
    const dockerRuntime = new DockerRuntimeManager({
        archiveRoot,
        cli: new FakeDockerCli(),
        transportFactory: () => transport,
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    await adapter.startSession(vmSessionStartPayload({
        layout: sessionLayout(rootPath),
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
        sensitiveHostPaths: [helperPath],
    }));
    dockerRuntime.markSessionRunning("session-id");
    await dockerRuntime.archiveSession("session-id");
    assert.equal(await pathExists(helperPath), false);
});
test("Codex adapter rejects arbitrary payload sensitive host paths", async () => {
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-codex-sensitive-reject-"));
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        transportFactory: () => new FakeCodexTransport(),
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    await assert.rejects(adapter.startSession(vmSessionStartPayload({
        layout: sessionLayout(rootPath),
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
        sensitiveHostPaths: ["/tmp/yp-live-workflow-should-not-delete"],
    })), /Sensitive host path is not an expected workspace GitHub credential helper path/u);
    assert.equal(dockerRuntime.getSession("session-id"), null);
});
test("Codex adapter rejects previous artifact source outside the VM workspace root before Docker launch", async () => {
    const transport = new FakeCodexTransport();
    const cli = new FakeDockerCli();
    let launchOptions;
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        hostPlatform: "linux",
        workspaceRootPath: "/mnt/experiments",
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    await assert.rejects(adapter.startSession(vmSessionStartPayload({
        layout: sessionLayout("/mnt/experiments/groups/201/experiments/e03-33333333"),
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
        previousArtifactMounts: [{
                sourcePath: "/etc/artifacts",
                containerPath: "/previous-artifacts/E02",
                readOnly: true,
            }],
    })), (error) => {
        const errorText = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
        assert.match(errorText, /Invalid previous artifact mount at index 0/u);
        assert.match(errorText, /sourcePath must stay inside the VM workspace root/u);
        return true;
    });
    assert.equal(launchOptions, undefined);
    assert.equal(transport.requests.length, 0);
});
test("Codex adapter allows previous artifact source roots under the VM workspace root", async () => {
    const transport = new FakeCodexTransport();
    const cli = new FakeDockerCli();
    let launchOptions;
    const rootPath = "/mnt/experiments/custom/current/e03-33333333";
    const previousArtifactsPath = "/mnt/experiments/custom/upstream/e02-22222222/artifacts";
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        hostPlatform: "linux",
        workspaceRootPath: "/mnt/experiments",
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    await adapter.startSession(vmSessionStartPayload({
        layout: sessionLayout(rootPath),
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
        previousArtifactMounts: [{
                sourcePath: previousArtifactsPath,
                containerPath: "/previous-artifacts/E02",
                readOnly: true,
            }],
    }));
    const args = launchOptions?.args ?? [];
    assert.equal(args.includes(`type=bind,source=${previousArtifactsPath},target=/previous-artifacts/E02,readonly`), true);
    assert.equal(transport.requests.length > 0, true);
    await adapter.closeSession("session-id");
});
test("Codex adapter mounts all group review experiment evidence trees read-only", async () => {
    const trustedRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-group-review-mounts-"));
    const currentRoot = path.join(trustedRoot, "groups", "7", "final-reviews", "job", "attempt");
    const sourceRoot = path.join(trustedRoot, "groups", "7", "experiments", "experiment-one");
    for (const root of [currentRoot, sourceRoot]) {
        for (const directory of ["workspace", "artifacts", "cache", "codex-home"]) {
            await fs.mkdir(path.join(root, directory), { recursive: true });
        }
    }
    const transport = new FakeCodexTransport();
    let launchOptions;
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        hostPlatform: "linux",
        workspaceRootPath: trustedRoot,
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({ env: { OPENAI_API_KEY: "test-key" }, dockerRuntime });
    const experimentId = "20000000-0000-4000-8000-000000000002";
    await adapter.startSession(vmSessionStartPayload({
        layout: sessionLayout(currentRoot),
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
        reviewEvidenceMounts: ["workspace", "artifacts", "cache"].map((evidenceType) => ({
            sourcePath: path.join(sourceRoot, evidenceType),
            containerPath: `/review-sources/experiments/experiment-one/${evidenceType}`,
            readOnly: true,
            evidenceType,
            experimentId,
        })),
    }));
    const args = launchOptions?.args ?? [];
    for (const evidenceType of ["workspace", "artifacts", "cache"]) {
        assert.equal(args.includes(`type=bind,source=${path.join(sourceRoot, evidenceType)},target=/review-sources/experiments/experiment-one/${evidenceType},readonly`), true);
    }
    assert.deepEqual(dockerRuntime.resolveSessionEvidenceFile("session-id", "/review-sources/experiments/experiment-one/artifacts/results/table.csv"), {
        rootPath: path.join(sourceRoot, "artifacts"),
        relativePath: "results/table.csv",
    });
    assert.deepEqual(dockerRuntime.resolveSessionEvidenceFile("session-id", "/review-sources/experiments/experiment-one/artifacts"), {
        rootPath: path.join(sourceRoot, "artifacts"),
        relativePath: "",
    });
    await adapter.closeSession("session-id");
    assert.throws(() => dockerRuntime.resolveSessionEvidenceFile("session-id", "/review-sources/experiments/experiment-one/artifacts/results/table.csv"), /unavailable for inactive session/u);
});
test("Codex adapter mounts dataset producer output as trusted read-only review evidence", async () => {
    const trustedRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-dataset-review-workspaces-"));
    const datasetsHotRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-dataset-review-hot-"));
    const currentRoot = path.join(trustedRoot, "groups", "7", "code-data-reviews", "job");
    const datasetOutput = path.join(datasetsHotRoot, "outputs", "groups", "7", "experiments", "dataset-one");
    for (const directory of ["workspace", "artifacts", "cache", "codex-home"]) {
        await fs.mkdir(path.join(currentRoot, directory), { recursive: true });
    }
    await fs.mkdir(datasetOutput, { recursive: true });
    const transport = new FakeCodexTransport();
    let launchOptions;
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        hostPlatform: "linux",
        workspaceRootPath: trustedRoot,
        datasetsHotRootPath: datasetsHotRoot,
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({ env: { OPENAI_API_KEY: "test-key" }, dockerRuntime });
    await adapter.startSession(vmSessionStartPayload({
        layout: sessionLayout(currentRoot),
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
        reviewEvidenceMounts: [{
                sourcePath: datasetOutput,
                containerPath: "/review-sources/experiments/dataset-one/dataset-output",
                readOnly: true,
                evidenceType: "dataset-output",
                experimentId: "20000000-0000-4000-8000-000000000002",
            }],
    }));
    assert.equal(launchOptions?.args.includes(`type=bind,source=${datasetOutput},target=/review-sources/experiments/dataset-one/dataset-output,readonly`), true);
    assert.deepEqual(dockerRuntime.resolveSessionEvidenceFile("session-id", "/review-sources/experiments/dataset-one/dataset-output/raw/table.csv"), { rootPath: datasetOutput, relativePath: "raw/table.csv" });
});
test("Codex adapter rejects untrusted dataset-output review evidence before Docker launch", async () => {
    const trustedRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-dataset-review-reject-workspaces-"));
    const datasetsHotRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-dataset-review-reject-hot-"));
    const outsideRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-dataset-review-reject-outside-"));
    const currentRoot = path.join(trustedRoot, "groups", "7", "code-data-reviews", "job");
    const realDatasetOutput = path.join(datasetsHotRoot, "outputs", "groups", "7", "experiments", "dataset-one");
    const symlinkDatasetOutput = path.join(datasetsHotRoot, "outputs", "groups", "7", "experiments", "dataset-link");
    for (const directory of ["workspace", "artifacts", "cache", "codex-home"]) {
        await fs.mkdir(path.join(currentRoot, directory), { recursive: true });
    }
    await fs.mkdir(realDatasetOutput, { recursive: true });
    await fs.mkdir(path.dirname(symlinkDatasetOutput), { recursive: true });
    await fs.symlink(realDatasetOutput, symlinkDatasetOutput);
    const payload = (sourcePath) => vmSessionStartPayload({
        layout: sessionLayout(currentRoot),
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
        reviewEvidenceMounts: [{
                sourcePath,
                containerPath: "/review-sources/experiments/dataset-one/dataset-output",
                readOnly: true,
                evidenceType: "dataset-output",
                experimentId: "20000000-0000-4000-8000-000000000002",
            }],
    });
    const adapterFor = (datasetsHotRootPath) => new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime: new DockerRuntimeManager({
            cli: new FakeDockerCli(),
            hostPlatform: "linux",
            workspaceRootPath: trustedRoot,
            datasetsHotRootPath,
        }),
    });
    await assert.rejects(adapterFor().startSession(payload(realDatasetOutput)), /dataset-output evidence requires the VM hot dataset root/u);
    await assert.rejects(adapterFor(datasetsHotRoot).startSession(payload(outsideRoot)), /dataset-output sourcePath must stay inside the VM hot dataset root/u);
    await assert.rejects(adapterFor(datasetsHotRoot).startSession(payload(symlinkDatasetOutput)), /sourcePath must be a real directory/u);
    await assert.rejects(adapterFor(datasetsHotRoot).startSession(payload(path.join(datasetsHotRoot, "missing"))), /sourcePath must exist/u);
});
test("Codex adapter masks credential helpers retained by active review workspaces", async () => {
    const trustedRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-group-review-secret-"));
    const currentRoot = path.join(trustedRoot, "groups", "7", "final-reviews", "job", "attempt");
    const sourceWorkspace = path.join(trustedRoot, "groups", "7", "experiments", "experiment-one", "workspace");
    for (const directory of ["workspace", "artifacts", "cache", "codex-home"]) {
        await fs.mkdir(path.join(currentRoot, directory), { recursive: true });
    }
    const helperRelativePath = "repo/.git/yp-live-workflow-github-credential-helper.sh";
    await fs.mkdir(path.dirname(path.join(sourceWorkspace, helperRelativePath)), { recursive: true });
    await fs.writeFile(path.join(sourceWorkspace, helperRelativePath), "#!/bin/sh\necho token\n", "utf8");
    let launchOptions;
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        hostPlatform: "linux",
        workspaceRootPath: trustedRoot,
        transportFactory: (options) => {
            launchOptions = options;
            return new FakeCodexTransport();
        },
    });
    const adapter = new CodexAdapter({ env: { OPENAI_API_KEY: "test-key" }, dockerRuntime });
    await adapter.startSession(vmSessionStartPayload({
        layout: sessionLayout(currentRoot),
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
        reviewEvidenceMounts: [{
                sourcePath: sourceWorkspace,
                containerPath: "/review-sources/experiments/experiment-one/workspace",
                readOnly: true,
                evidenceType: "workspace",
                experimentId: "20000000-0000-4000-8000-000000000002",
                forbiddenRelativePaths: [helperRelativePath],
            }],
    }));
    assert.ok(launchOptions);
    assert.ok(launchOptions.args.includes(`type=bind,source=/dev/null,target=/review-sources/experiments/experiment-one/workspace/${helperRelativePath},readonly`));
});
test("Codex adapter rejects missing group review evidence roots before Docker launch", async () => {
    const trustedRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-group-review-missing-"));
    const currentRoot = path.join(trustedRoot, "groups", "7", "final-reviews", "job", "attempt");
    for (const directory of ["workspace", "artifacts", "cache", "codex-home"]) {
        await fs.mkdir(path.join(currentRoot, directory), { recursive: true });
    }
    let launchOptions;
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        hostPlatform: "linux",
        workspaceRootPath: trustedRoot,
        transportFactory: (options) => {
            launchOptions = options;
            return new FakeCodexTransport();
        },
    });
    const adapter = new CodexAdapter({ env: { OPENAI_API_KEY: "test-key" }, dockerRuntime });
    await assert.rejects(adapter.startSession(vmSessionStartPayload({
        layout: sessionLayout(currentRoot),
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
        reviewEvidenceMounts: [{
                sourcePath: path.join(trustedRoot, "groups", "7", "experiments", "missing", "artifacts"),
                containerPath: "/review-sources/experiments/missing/artifacts",
                readOnly: true,
                evidenceType: "artifacts",
                experimentId: "20000000-0000-4000-8000-000000000002",
            }],
    })), /Invalid review evidence mount at index 0: sourcePath must exist/u);
    assert.equal(launchOptions, undefined);
});
test("Codex adapter rejects previous artifact mounts when the current root is outside the VM workspace root", async () => {
    const transport = new FakeCodexTransport();
    const cli = new FakeDockerCli();
    let launchOptions;
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        hostPlatform: "linux",
        workspaceRootPath: "/mnt/experiments",
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    await assert.rejects(adapter.startSession(vmSessionStartPayload({
        layout: sessionLayout("/tmp/current/e03-33333333"),
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
        previousArtifactMounts: [{
                sourcePath: "/mnt/experiments/custom/upstream/e02-22222222/artifacts",
                containerPath: "/previous-artifacts/E02",
                readOnly: true,
            }],
    })), /Current experiment root must stay inside the VM workspace root/u);
    assert.equal(launchOptions, undefined);
    assert.equal(transport.requests.length, 0);
});
test("Codex adapter rejects previous artifact container targets outside /previous-artifacts before Docker launch", async () => {
    const transport = new FakeCodexTransport();
    const cli = new FakeDockerCli();
    let launchOptions;
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        hostPlatform: "linux",
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    await assert.rejects(adapter.startSession(vmSessionStartPayload({
        layout: sessionLayout("/mnt/experiments/groups/201/experiments/e03-33333333"),
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
        previousArtifactMounts: [{
                sourcePath: "/mnt/experiments/groups/201/experiments/e02-22222222/artifacts",
                containerPath: "/workspace/E02",
                readOnly: true,
            }],
    })), (error) => {
        const errorText = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
        assert.match(errorText, /Invalid previous artifact mount at index 0/u);
        assert.match(errorText, /containerPath must be under \/previous-artifacts/u);
        return true;
    });
    assert.equal(launchOptions, undefined);
    assert.equal(transport.requests.length, 0);
});
test("Docker-backed Codex auth material is made host-readable without persisting the chmod mode", async () => {
    const transport = new FakeCodexTransport();
    const cli = new FakeDockerCli();
    const storedAuthMaterial = {
        format: "codex_home_files_v1",
        files: [
            {
                path: "auth.json",
                dataBase64: Buffer.from(JSON.stringify({ token: "stored" })).toString("base64"),
                mode: 0o600,
            },
            {
                path: "config.toml",
                dataBase64: Buffer.from("model = \"gpt-5.5\"\n").toString("base64"),
                mode: 0o600,
            },
        ],
    };
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        hostPlatform: "linux",
        transportFactory: () => transport,
    });
    const adapter = new CodexAdapter({
        dockerRuntime,
        authMaterialUpdateSink: {
            publishCodexAuthMaterialUpdated: async () => undefined,
        },
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
        auth: {
            provider: "openai",
            authMode: "codex_chatgpt_with_api_fallback",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                codexAuthMaterial: storedAuthMaterial,
                codexAuthMaterialFingerprintSha256: codexAuthMaterialFingerprintSha256(storedAuthMaterial),
            },
        },
    });
    await adapter.startSession(payload);
    await adapter.closeSession(payload.sessionId);
    const authPrepareCalls = cli.calls.filter((call) => call[0] === "exec");
    assert.ok(authPrepareCalls.length >= 1);
    assert.deepEqual(authPrepareCalls[0], [
        "exec",
        "yp-live-workflow-session-session-id",
        "sh",
        "-c",
        "[ ! -e /codex-home/auth.json ] || chmod a+r /codex-home/auth.json",
    ]);
    assert.ok(authPrepareCalls.some((call) => call[4]?.includes("find /codex-home -xdev -type d")));
    assert.equal(authPrepareCalls.some((call) => call[4]?.includes("chmod -R a+rwX /codex-home")), false);
    assert.deepEqual(cli.calls.at(-2), ["stop", "yp-live-workflow-session-session-id"]);
    assert.deepEqual(cli.calls.at(-1), ["rm", "-f", "yp-live-workflow-session-session-id"]);
});
test("Docker-backed Codex close prepares sensitive auth homes before closing the docker client", async () => {
    const order = [];
    const transport = new FakeCodexTransport();
    const originalClose = transport.close.bind(transport);
    transport.close = async () => {
        order.push("transport.close");
        await originalClose();
    };
    const cli = {
        async run(args) {
            if (args[0] === "exec") {
                order.push("docker.exec");
            }
            else if (args[0] === "stop") {
                order.push("docker.stop");
            }
            return dockerCliResult(0);
        },
    };
    const storedAuthMaterial = {
        format: "codex_home_files_v1",
        files: [
            {
                path: "auth.json",
                dataBase64: Buffer.from(JSON.stringify({ token: "stored" })).toString("base64"),
                mode: 0o600,
            },
        ],
    };
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        hostPlatform: "linux",
        transportFactory: () => transport,
    });
    const adapter = new CodexAdapter({ dockerRuntime });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
        auth: {
            provider: "openai",
            authMode: "codex_chatgpt_with_api_fallback",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                codexAuthMaterial: storedAuthMaterial,
                codexAuthMaterialFingerprintSha256: codexAuthMaterialFingerprintSha256(storedAuthMaterial),
            },
        },
    });
    await adapter.startSession(payload);
    await adapter.closeSession(payload.sessionId);
    assert.deepEqual(order, ["docker.exec", "docker.stop", "transport.close"]);
});
test("Docker runtime can explicitly use Docker GPU hooks on Linux Sysbox hosts", async () => {
    const transport = new FakeCodexTransport();
    let launchOptions;
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        gpuMode: "docker_gpus",
        hostPlatform: "linux",
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    const result = await adapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
            resourcePolicy: { gpus: "all" },
        },
    }));
    const args = launchOptions?.args ?? [];
    assert.equal(args.includes("--runtime"), true);
    assert.equal(args[args.indexOf("--runtime") + 1], "sysbox-runc");
    assert.equal(args.includes("--gpus"), true);
    assert.equal(args[args.indexOf("--gpus") + 1], "all");
    assert.equal(args.includes("--device"), false);
    assert.equal(result.runtimeMetadata.dockerGpuMode, "docker_gpus");
    assert.equal(result.runtimeMetadata.nvidiaDirectGpu, null);
    await adapter.closeSession("session-id");
});
test("Docker runtime can launch Codex with a configured outer container runtime", async () => {
    const transport = new FakeCodexTransport();
    let launchOptions;
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        containerRuntime: "sysbox-runc",
        hostPlatform: "darwin",
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    const result = await adapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
    }));
    const args = launchOptions?.args ?? [];
    assert.equal(args.includes("--runtime"), true);
    assert.equal(args[args.indexOf("--runtime") + 1], "sysbox-runc");
    assert.equal(args.includes("--privileged"), false);
    assert.equal(args.includes("YP_LIVE_WORKFLOW_START_INNER_DOCKER=1"), true);
    assert.equal(result.runtimeMetadata.dockerRuntime, "sysbox-runc");
    assert.equal(result.runtimeMetadata.dockerRuntimeMode, "explicit_runtime");
    await adapter.closeSession("session-id");
});
test("Docker runtime can use direct NVIDIA mounts under Sysbox instead of Docker GPU hooks", async () => {
    const transport = new FakeCodexTransport();
    let launchOptions;
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        containerRuntime: "sysbox-runc",
        gpuMode: "nvidia_direct",
        nvidiaDirectDevices: ["/dev/nvidia0", "/dev/nvidiactl"],
        nvidiaDirectLibraryMounts: [
            "/usr/lib/x86_64-linux-gnu/libcuda.so.1",
            "/usr/lib/x86_64-linux-gnu/libnvidia-ml.so.1",
        ],
        nvidiaDirectUtilityMounts: ["/custom/bin/nvidia-smi"],
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    const result = await adapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
            resourcePolicy: { gpus: "all" },
        },
    }));
    const args = launchOptions?.args ?? [];
    assert.equal(args.includes("--runtime"), true);
    assert.equal(args[args.indexOf("--runtime") + 1], "sysbox-runc");
    assert.equal(args.includes("--gpus"), false);
    assert.equal(args.includes("--device"), true);
    assert.equal(args[args.indexOf("--device") + 1], "/dev/nvidia0");
    assert.equal(args.includes("/dev/nvidiactl"), true);
    assert.equal(args.includes("type=bind,source=/usr/lib/x86_64-linux-gnu/libcuda.so.1,target=/usr/lib/x86_64-linux-gnu/libcuda.so.1,readonly"), true);
    assert.equal(args.includes("type=bind,source=/usr/lib/x86_64-linux-gnu/libnvidia-ml.so.1,target=/usr/lib/x86_64-linux-gnu/libnvidia-ml.so.1,readonly"), true);
    assert.equal(args.includes("type=bind,source=/custom/bin/nvidia-smi,target=/custom/bin/nvidia-smi,readonly"), true);
    assert.equal(result.runtimeMetadata.dockerRuntime, "sysbox-runc");
    assert.equal(result.runtimeMetadata.dockerGpuMode, "nvidia_direct");
    assert.deepEqual(result.runtimeMetadata.nvidiaDirectGpu, {
        devices: ["/dev/nvidia0", "/dev/nvidiactl"],
        libraryMounts: [
            "/usr/lib/x86_64-linux-gnu/libcuda.so.1",
            "/usr/lib/x86_64-linux-gnu/libnvidia-ml.so.1",
        ],
        utilityMounts: [
            "/custom/bin/nvidia-smi",
        ],
    });
    await adapter.closeSession("session-id");
});
test("Docker runtime uses privileged local Docker-in-Docker defaults on macOS", async () => {
    const transport = new FakeCodexTransport();
    let launchOptions;
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        hostPlatform: "darwin",
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    const result = await adapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
    }));
    const args = launchOptions?.args ?? [];
    assert.equal(args.includes("--runtime"), false);
    assert.equal(args.includes("--privileged"), true);
    assert.equal(args.includes("--gpus"), false);
    assert.equal(args.includes("YP_LIVE_WORKFLOW_START_INNER_DOCKER=1"), true);
    assert.equal(result.runtimeMetadata.dockerRuntime, null);
    assert.equal(result.runtimeMetadata.dockerRuntimeMode, "macos_privileged_dind");
    assert.equal(result.runtimeMetadata.hostPlatform, "darwin");
    assert.equal(result.runtimeMetadata.privileged, true);
    assert.deepEqual(result.runtimeMetadata.dockerPolicy, {
        network: "provider",
        gpus: "none",
        pidsLimit: 4096,
        nofileSoft: 1024,
        nofileHard: 4096,
        readOnlyRootFilesystem: false,
    });
    await adapter.closeSession("session-id");
});
test("Docker runtime can disable GPU passthrough through runtime policy", async () => {
    const transport = new FakeCodexTransport();
    let launchOptions;
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        hostPlatform: "linux",
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    await adapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
            resourcePolicy: {
                gpus: "none",
            },
        },
    }));
    const args = launchOptions?.args ?? [];
    assert.equal(args.includes("--gpus"), false);
    await adapter.closeSession("session-id");
});
test("Docker runtime container stats include writable storage and read-only dataset mounts", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-container-telemetry-"));
    const layout = sessionLayout(root);
    await Promise.all([
        fs.mkdir(layout.workspacePath, { recursive: true }),
        fs.mkdir(layout.codexHomePath, { recursive: true }),
        fs.mkdir(layout.artifactsPath, { recursive: true }),
        fs.mkdir(layout.cachePath, { recursive: true }),
    ]);
    await fs.writeFile(path.join(layout.artifactsPath, "result.txt"), Buffer.alloc(42));
    await fs.writeFile(path.join(layout.cachePath, "cache.bin"), Buffer.alloc(7));
    const containerName = "yp-live-workflow-session-session-id";
    const cli = new FakeDockerCli([dockerCliResult(0, JSON.stringify({
            Name: containerName,
            CPUPerc: "12.5%",
            MemPerc: "3.2%",
            MemUsage: "256MiB / 8GiB",
        }))]);
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        defaultImage: OfficialCodexAppServerImage,
        transportFactory: () => new FakeCodexTransport(),
    });
    try {
        dockerRuntime.createCodexAppServerTransport({
            payload: vmSessionStartPayload({ layout }),
            env: {},
            datasetMounts: [{
                    source: "/host/datasets/reference",
                    target: "/datasets/reference",
                    readOnly: true,
                    datasetVersionId: "dataset-version-1",
                    name: "reference",
                    versionLabel: "v1",
                    sizeBytes: 5000,
                    sourceUri: "file:///host/datasets/reference",
                    manifestChecksumSha256: null,
                }],
        });
        dockerRuntime.markSessionRunning("session-id");
        const stats = await dockerRuntime.collectContainerStats();
        const storage = stats[0]?.storage;
        const artifacts = storage?.writableMounts?.find((mount) => mount.containerPath === "/artifacts");
        const cache = storage?.writableMounts?.find((mount) => mount.containerPath === "/cache");
        assert.equal(stats[0]?.containerName, containerName);
        assert.equal(stats[0]?.cpuPercent, 12.5);
        assert.equal(artifacts?.usedBytes, 42);
        assert.equal(cache?.usedBytes, 7);
        assert.deepEqual(storage?.datasetMounts, [{
                containerPath: "/datasets/reference",
                datasetVersionId: "dataset-version-1",
                name: "reference",
                versionLabel: "v1",
                readOnly: true,
                sizeBytes: 5000,
            }]);
    }
    finally {
        await fs.rm(root, { recursive: true, force: true });
    }
});
test("Docker runtime rejects new sessions when Codex session capacity is full", () => {
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        defaultImage: OfficialCodexAppServerImage,
        maxCodexSessions: 1,
        transportFactory: () => new FakeCodexTransport(),
    });
    dockerRuntime.createCodexAppServerTransport({
        payload: vmSessionStartPayload({
            sessionId: "session-one",
            commandId: "session-command-one",
        }),
        env: {},
    });
    assert.throws(() => dockerRuntime.createCodexAppServerTransport({
        payload: vmSessionStartPayload({
            sessionId: "session-two",
            commandId: "session-command-two",
        }),
        env: {},
    }), /capacity is full/u);
});
test("Docker runtime excludes paused warm sessions from Codex session capacity", () => {
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        defaultImage: OfficialCodexAppServerImage,
        maxCodexSessions: 1,
        transportFactory: () => new FakeCodexTransport(),
    });
    dockerRuntime.createCodexAppServerTransport({
        payload: vmSessionStartPayload({
            sessionId: "session-one",
            commandId: "session-command-one",
        }),
        env: {},
    });
    dockerRuntime.markSessionPaused("session-one");
    dockerRuntime.createCodexAppServerTransport({
        payload: vmSessionStartPayload({
            sessionId: "session-two",
            commandId: "session-command-two",
        }),
        env: {},
    });
    assert.equal(dockerRuntime.getStatus().activeCodexSessions, 1);
    assert.deepEqual(dockerRuntime.getStatus().sessionCountsByStatus, {
        paused: 1,
        starting: 1,
    });
});
test("Docker runtime does not reap tracked paused warm sessions as stale orphans", async () => {
    const cli = new FakeDockerCli([dockerCliResult(0, "yp-live-workflow-session-session-id\tsession-id\trunning\n")]);
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        defaultImage: OfficialCodexAppServerImage,
        maxCodexSessions: 1,
        transportFactory: () => new FakeCodexTransport(),
    });
    dockerRuntime.createCodexAppServerTransport({
        payload: vmSessionStartPayload({
            sessionId: "session-id",
            commandId: "session-command-one",
        }),
        env: {},
    });
    dockerRuntime.markSessionPaused("session-id");
    const cleanup = await dockerRuntime.cleanupOrphans();
    assert.equal(dockerRuntime.getStatus().activeCodexSessions, 0);
    assert.equal(cleanup.stopped, 0);
    assert.deepEqual(cleanup.containerNames, []);
    assert.deepEqual(cleanup.containers.map((container) => ({
        sessionId: container.sessionId,
        dockerState: container.dockerState,
        classification: container.classification,
    })), [
        { sessionId: "session-id", dockerState: "running", classification: "active" },
    ]);
    assert.deepEqual(cli.calls, [
        ["ps", "-a", "--filter", "label=yp-live-workflow.managed_by=yp-live-workflow-vm-agent", "--format", "{{.Names}}\t{{.Label \"yp-live-workflow.session_id\"}}\t{{.State}}"],
    ]);
});
test("Docker runtime includes running orphan containers in Codex session capacity", async () => {
    const cli = new FakeDockerCli([dockerCliResult(0, "old-one\told-session\trunning\nold-two\tother-session\texited\n")]);
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        defaultImage: OfficialCodexAppServerImage,
        maxCodexSessions: 1,
        transportFactory: () => new FakeCodexTransport(),
    });
    const scan = await dockerRuntime.scanOrphans();
    assert.equal(dockerRuntime.getStatus().activeCodexSessions, 1);
    assert.deepEqual(scan.containers.map((container) => ({
        sessionId: container.sessionId,
        dockerState: container.dockerState,
        classification: container.classification,
    })), [
        { sessionId: "old-session", dockerState: "running", classification: "active" },
        { sessionId: "other-session", dockerState: "exited", classification: "stale" },
    ]);
    assert.throws(() => dockerRuntime.createCodexAppServerTransport({
        payload: vmSessionStartPayload({
            sessionId: "session-two",
            commandId: "session-command-two",
        }),
        env: {},
    }), /capacity is full/u);
});
test("Codex adapter promotes cold dataset buckets and mounts hot cache read-only", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-datasets-hot-"));
    const manifest = Buffer.from(JSON.stringify({ files: [] }));
    const checksum = await sha256(manifest);
    const storage = new FakeObjectStorage({ [".yp-live-workflow-dataset-manifest.json"]: manifest });
    const transport = new FakeCodexTransport();
    let launchOptions;
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
        datasetManager: new DatasetManager({
            hotRoot: tempDir,
            objectStorage: storage,
            now: () => new Date("2026-05-16T13:00:00.000Z"),
        }),
    });
    const result = await adapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
        datasetMounts: [
            {
                datasetVersionId: "dataset-version-1",
                name: "reference",
                versionLabel: "v1",
                containerPath: "/datasets/reference/v1",
                access: "read_only",
                required: true,
                locations: [{ kind: "gcs", tier: "cold", uri: "gs://private-datasets/reference/v1" }],
                manifestChecksumSha256: checksum,
            },
        ],
    }));
    const args = launchOptions?.args ?? [];
    const hotPath = path.join(tempDir, "dataset-version-1");
    assert.deepEqual(storage.downloads, [
        { uri: "gs://private-datasets/reference/v1", targetPath: `${hotPath}.tmp-${process.pid}` },
    ]);
    assert.equal(args.includes(`type=bind,source=${hotPath},target=/datasets/reference/v1,readonly`), true);
    assert.deepEqual(result.runtimeMetadata.datasetMounts, [
        {
            datasetVersionId: "dataset-version-1",
            source: hotPath,
            target: "/datasets/reference/v1",
            readOnly: true,
            sourceUri: "gs://private-datasets/reference/v1",
            manifestChecksumSha256: checksum,
        },
    ]);
    await adapter.closeSession("session-id");
});
test("Dataset manager skips optional mounts when no dataset location can be promoted", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-datasets-hot-"));
    const manager = new DatasetManager({ hotRoot: tempDir });
    const result = await manager.prepareSessionMounts(vmSessionStartPayload({
        datasetMounts: [
            {
                datasetVersionId: "optional-dataset",
                name: "optional",
                versionLabel: "v1",
                containerPath: "/datasets/optional/v1",
                access: "read_only",
                required: false,
                locations: [],
            },
        ],
    }));
    assert.deepEqual(result.mounts, []);
    assert.deepEqual(result.runtimeMetadata.datasetMounts, []);
});
test("Dataset manager rejects local cold promotion outside trusted dataset roots", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-datasets-hot-"));
    const manager = new DatasetManager({ hotRoot: tempDir });
    await assert.rejects(manager.prepareSessionMounts(vmSessionStartPayload({
        datasetMounts: [
            {
                datasetVersionId: "untrusted-local",
                name: "untrusted",
                versionLabel: "v1",
                containerPath: "/datasets/untrusted/v1",
                access: "read_only",
                required: true,
                locations: [{ kind: "local", tier: "cold", uri: "/etc" }],
            },
        ],
    })), /outside the trusted dataset roots/);
});
test("Dataset manager rejects local cold promotion through trusted-root symlink escapes", async () => {
    const hotRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-datasets-hot-"));
    const trustedRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-datasets-cold-"));
    const outsideSource = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-datasets-outside-"));
    const symlinkPath = path.join(trustedRoot, "outside-link");
    await fs.symlink(outsideSource, symlinkPath, "dir");
    const manager = new DatasetManager({ hotRoot, trustedLocalRoots: [trustedRoot] });
    await assert.rejects(manager.prepareSessionMounts(vmSessionStartPayload({
        datasetMounts: [
            {
                datasetVersionId: "symlink-escape",
                name: "symlink",
                versionLabel: "v1",
                containerPath: "/datasets/symlink/v1",
                access: "read_only",
                required: true,
                locations: [{ kind: "local", tier: "cold", uri: symlinkPath }],
            },
        ],
    })), /outside the trusted dataset roots/);
});
test("Dataset manager promotes local cold datasets only from configured trusted roots", async () => {
    const hotRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-datasets-hot-"));
    const trustedRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-datasets-cold-"));
    const sourcePath = path.join(trustedRoot, "reference", "v1");
    const manifest = Buffer.from(JSON.stringify({ files: [{ path: "table.tsv" }] }));
    const checksum = await sha256(manifest);
    await fs.mkdir(sourcePath, { recursive: true });
    await fs.writeFile(path.join(sourcePath, ".yp-live-workflow-dataset-manifest.json"), manifest);
    await fs.writeFile(path.join(sourcePath, "table.tsv"), "gene\tvalue\nHDAC1\t1\n");
    const manager = new DatasetManager({
        hotRoot,
        trustedLocalRoots: [trustedRoot],
        now: () => new Date("2026-05-16T13:00:00.000Z"),
    });
    const result = await manager.prepareSessionMounts(vmSessionStartPayload({
        datasetMounts: [
            {
                datasetVersionId: "trusted-local",
                name: "trusted",
                versionLabel: "v1",
                containerPath: "/datasets/trusted/v1",
                access: "read_only",
                required: true,
                locations: [{ kind: "local", tier: "cold", uri: sourcePath }],
                manifestChecksumSha256: checksum,
            },
        ],
    }));
    const hotPath = path.join(hotRoot, "trusted-local");
    assert.equal(result.mounts[0]?.source, hotPath);
    assert.equal(result.mounts[0]?.target, "/datasets/trusted/v1");
    assert.equal(result.mounts[0]?.sourceUri, sourcePath);
    assert.equal(await fs.readFile(path.join(hotPath, "table.tsv"), "utf8"), "gene\tvalue\nHDAC1\t1\n");
});
test("Dataset manager decodes file URLs for local dataset paths", async () => {
    const hotRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-datasets-hot-"));
    const trustedRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-datasets-cold-"));
    const sourcePath = path.join(trustedRoot, "Reference Data", "v1");
    await fs.mkdir(sourcePath, { recursive: true });
    await fs.writeFile(path.join(sourcePath, "table.tsv"), "gene\tvalue\nHDAC1\t1\n");
    const manager = new DatasetManager({
        hotRoot,
        trustedLocalRoots: [trustedRoot],
    });
    const result = await manager.prepareSessionMounts(vmSessionStartPayload({
        datasetMounts: [
            {
                datasetVersionId: "trusted-file-url",
                name: "trusted",
                versionLabel: "v1",
                containerPath: "/datasets/trusted/file-url",
                access: "read_only",
                required: true,
                locations: [{ kind: "local", tier: "cold", uri: pathToFileURL(sourcePath).toString() }],
            },
        ],
    }));
    const hotPath = path.join(hotRoot, "trusted-file-url");
    assert.equal(result.mounts[0]?.source, hotPath);
    assert.equal(result.mounts[0]?.target, "/datasets/trusted/file-url");
    assert.equal(await fs.readFile(path.join(hotPath, "table.tsv"), "utf8"), "gene\tvalue\nHDAC1\t1\n");
});
test("Dataset manager verifies local hot dataset manifests before mounting", async () => {
    const hotRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-datasets-hot-"));
    const sourcePath = path.join(hotRoot, "reference", "v1");
    const expectedManifest = Buffer.from(JSON.stringify({ files: [{ path: "expected.tsv" }] }));
    const staleManifest = Buffer.from(JSON.stringify({ files: [{ path: "stale.tsv" }] }));
    await fs.mkdir(sourcePath, { recursive: true });
    await fs.writeFile(path.join(sourcePath, ".yp-live-workflow-dataset-manifest.json"), staleManifest);
    const manager = new DatasetManager({ hotRoot });
    await assert.rejects(manager.prepareSessionMounts(vmSessionStartPayload({
        datasetMounts: [
            {
                datasetVersionId: "hot-local",
                name: "hot",
                versionLabel: "v1",
                containerPath: "/datasets/hot/v1",
                access: "read_only",
                required: true,
                locations: [{ kind: "local", tier: "hot", uri: sourcePath }],
                manifestChecksumSha256: await sha256(expectedManifest),
            },
        ],
    })), /Dataset manifest checksum mismatch/);
});
test("Dataset manager mounts non-writable local hot dataset outputs without cache marker writes", async () => {
    const hotRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-datasets-hot-readonly-"));
    const sourcePath = path.join(hotRoot, "outputs", "groups", "201", "experiments", "dataset", "reference");
    const manifest = Buffer.from(JSON.stringify({ files: [{ path: "table.tsv" }] }));
    const checksum = await sha256(manifest);
    const manager = new DatasetManager({ hotRoot });
    try {
        await fs.mkdir(sourcePath, { recursive: true });
        await fs.writeFile(path.join(sourcePath, ".yp-live-workflow-dataset-manifest.json"), manifest);
        await fs.writeFile(path.join(sourcePath, "table.tsv"), "gene\tvalue\nHDAC1\t1\n");
        await fs.chmod(sourcePath, 0o555);
        const result = await manager.prepareSessionMounts(vmSessionStartPayload({
            datasetMounts: [
                {
                    datasetVersionId: "readonly-local-hot",
                    name: "readonly",
                    versionLabel: "v1",
                    containerPath: "/datasets/readonly/v1",
                    access: "read_only",
                    required: true,
                    locations: [{ kind: "local", tier: "hot", uri: sourcePath }],
                    manifestChecksumSha256: checksum,
                },
            ],
        }));
        assert.equal(result.mounts[0]?.source, sourcePath);
        assert.equal(result.mounts[0]?.target, "/datasets/readonly/v1");
        await assert.rejects(fs.access(path.join(sourcePath, ".yp-live-workflow-dataset-cache.json")), /ENOENT/);
    }
    finally {
        await fs.chmod(sourcePath, 0o755).catch(() => undefined);
        await fs.rm(hotRoot, { recursive: true, force: true });
    }
});
test("Dataset manager falls back from missing local hot locations to cold GCS locations", async () => {
    const hotRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-datasets-hot-"));
    const missingHotPath = path.join(hotRoot, "outputs", "groups", "4", "experiments", "stale", "reference");
    const manifest = Buffer.from(JSON.stringify({ files: [{ path: "table.tsv" }] }));
    const checksum = await sha256(manifest);
    const storage = new FakeObjectStorage({
        [".yp-live-workflow-dataset-manifest.json"]: manifest,
        "table.tsv": "gene\tvalue\nHDAC1\t1\n",
    });
    const manager = new DatasetManager({ hotRoot, objectStorage: storage });
    const result = await manager.prepareSessionMounts(vmSessionStartPayload({
        datasetMounts: [
            {
                datasetVersionId: "stale-hot-with-gcs",
                name: "reference",
                versionLabel: "v1",
                containerPath: "/datasets/reference/v1",
                access: "read_only",
                required: true,
                locations: [
                    { kind: "local", tier: "hot", uri: pathToFileURL(missingHotPath).href },
                    { kind: "gcs", tier: "cold", uri: "gs://private-datasets/reference/v1" },
                ],
                manifestChecksumSha256: checksum,
            },
        ],
    }));
    const promotedPath = path.join(hotRoot, "stale-hot-with-gcs");
    assert.equal(result.mounts[0]?.source, promotedPath);
    assert.equal(result.mounts[0]?.sourceUri, "gs://private-datasets/reference/v1");
    assert.equal(storage.downloads.length, 1);
    assert.equal(await fs.readFile(path.join(promotedPath, "table.tsv"), "utf8"), "gene\tvalue\nHDAC1\t1\n");
});
test("Dataset manager reports missing required local hot locations without fallback as stale", async () => {
    const hotRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-datasets-hot-"));
    const missingHotPath = path.join(hotRoot, "outputs", "groups", "4", "experiments", "stale", "reference");
    const manager = new DatasetManager({ hotRoot });
    await assert.rejects(manager.prepareSessionMounts(vmSessionStartPayload({
        datasetMounts: [
            {
                datasetVersionId: "stale-hot-only",
                name: "reference",
                versionLabel: "v1",
                containerPath: "/datasets/reference/v1",
                access: "read_only",
                required: true,
                locations: [{ kind: "local", tier: "hot", uri: pathToFileURL(missingHotPath).href }],
            },
        ],
    })), /Required dataset local hot location is missing or stale for stale-hot-only/);
});
test("Dataset manager skips optional missing local hot locations without fallback", async () => {
    const hotRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-datasets-hot-"));
    const missingHotPath = path.join(hotRoot, "outputs", "groups", "4", "experiments", "stale", "reference");
    const manager = new DatasetManager({ hotRoot });
    const result = await manager.prepareSessionMounts(vmSessionStartPayload({
        datasetMounts: [
            {
                datasetVersionId: "optional-stale-hot-only",
                name: "reference",
                versionLabel: "v1",
                containerPath: "/datasets/reference/v1",
                access: "read_only",
                required: false,
                locations: [{ kind: "local", tier: "hot", uri: pathToFileURL(missingHotPath).href }],
            },
        ],
    }));
    assert.deepEqual(result.mounts, []);
    assert.deepEqual(result.runtimeMetadata.datasetMounts, []);
});
test("Dataset manager still rejects missing local hot locations outside the hot root", async () => {
    const hotRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-datasets-hot-"));
    const outsideRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-datasets-outside-"));
    const outsideMissingPath = path.join(outsideRoot, "missing", "reference");
    const manager = new DatasetManager({ hotRoot });
    await assert.rejects(manager.prepareSessionMounts(vmSessionStartPayload({
        datasetMounts: [
            {
                datasetVersionId: "outside-stale-hot",
                name: "reference",
                versionLabel: "v1",
                containerPath: "/datasets/reference/v1",
                access: "read_only",
                required: false,
                locations: [{ kind: "local", tier: "hot", uri: pathToFileURL(outsideMissingPath).href }],
            },
        ],
    })), /outside the VM hot dataset root/);
});
test("Dataset manager shares promotion sources without reusing session mount targets", async () => {
    const hotRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-datasets-hot-"));
    const manifest = Buffer.from(JSON.stringify({ files: [] }));
    const checksum = await sha256(manifest);
    const storage = new FakeObjectStorage({ [".yp-live-workflow-dataset-manifest.json"]: manifest });
    const manager = new DatasetManager({ hotRoot, objectStorage: storage });
    const baseMount = {
        datasetVersionId: "shared-dataset",
        name: "shared",
        versionLabel: "v1",
        access: "read_only",
        required: true,
        locations: [{ kind: "gcs", tier: "cold", uri: "gs://private-datasets/shared/v1" }],
        manifestChecksumSha256: checksum,
    };
    const [first, second] = await Promise.all([
        manager.prepareSessionMounts(vmSessionStartPayload({
            sessionId: "session-a",
            datasetMounts: [{ ...baseMount, containerPath: "/datasets/shared/a" }],
        })),
        manager.prepareSessionMounts(vmSessionStartPayload({
            sessionId: "session-b",
            datasetMounts: [{ ...baseMount, containerPath: "/datasets/shared/b" }],
        })),
    ]);
    assert.equal(storage.downloads.length, 1);
    assert.equal(first.mounts[0]?.source, path.join(hotRoot, "shared-dataset"));
    assert.equal(second.mounts[0]?.source, path.join(hotRoot, "shared-dataset"));
    assert.equal(first.mounts[0]?.target, "/datasets/shared/a");
    assert.equal(second.mounts[0]?.target, "/datasets/shared/b");
});
test("Dataset manager does not share optional promotion misses with required mounts", async () => {
    const hotRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-datasets-hot-"));
    const manifest = Buffer.from(JSON.stringify({ files: [] }));
    const checksum = await sha256(manifest);
    const storage = new FakeObjectStorage({ [".yp-live-workflow-dataset-manifest.json"]: manifest });
    const manager = new DatasetManager({ hotRoot, objectStorage: storage });
    const baseMount = {
        datasetVersionId: "optional-required-shared",
        name: "shared",
        versionLabel: "v1",
        access: "read_only",
        manifestChecksumSha256: checksum,
    };
    const [optional, required] = await Promise.all([
        manager.prepareSessionMounts(vmSessionStartPayload({
            sessionId: "optional-session",
            datasetMounts: [
                {
                    ...baseMount,
                    containerPath: "/datasets/shared/optional",
                    required: false,
                    locations: [{ kind: "local", tier: "cold", uri: "/etc" }],
                },
            ],
        })),
        manager.prepareSessionMounts(vmSessionStartPayload({
            sessionId: "required-session",
            datasetMounts: [
                {
                    ...baseMount,
                    containerPath: "/datasets/shared/required",
                    required: true,
                    locations: [{ kind: "gcs", tier: "cold", uri: "gs://private-datasets/shared/v1" }],
                },
            ],
        })),
    ]);
    assert.deepEqual(optional.mounts, []);
    assert.equal(required.mounts[0]?.target, "/datasets/shared/required");
    assert.equal(required.mounts[0]?.source, path.join(hotRoot, "optional-required-shared"));
    assert.equal(storage.downloads.length, 1);
});
test("Docker app-server hardening accepts only tightening numeric resource overrides", async () => {
    const transport = new FakeCodexTransport();
    let launchOptions;
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    const result = await adapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
            resourcePolicy: {
                pidsLimit: 128,
                nofileSoft: 512,
                nofileHard: 1024,
            },
        },
    }));
    const args = launchOptions?.args ?? [];
    assert.equal(args[args.indexOf("--pids-limit") + 1], "128");
    assert.equal(args[args.indexOf("--ulimit") + 1], "nofile=512:1024");
    assert.deepEqual(result.runtimeMetadata.securityHardening, {
        capDrop: null,
        noNewPrivileges: false,
        init: true,
        pidsLimit: 128,
        nofileSoft: 512,
        nofileHard: 1024,
        readOnlyRootFilesystem: false,
    });
    await adapter.closeSession("session-id");
    const invalidTransport = new FakeCodexTransport();
    const invalidRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        transportFactory: () => invalidTransport,
    });
    const invalidAdapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime: invalidRuntime,
    });
    await assert.rejects(invalidAdapter.startSession(vmSessionStartPayload({
        sessionId: "invalid-session",
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
            resourcePolicy: {
                pidsLimit: 999999,
            },
        },
    })), /pidsLimit/);
});
test("Docker app-server can run rootful without dropping capabilities", async () => {
    const transport = new FakeCodexTransport();
    let launchOptions;
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        defaultImage: OfficialCodexAppServerImage,
        dropAllCapabilities: false,
        runUser: "0:0",
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    const result = await adapter.startSession(vmSessionStartPayload());
    const args = launchOptions?.args ?? [];
    assert.equal(args.includes("--user"), true);
    assert.equal(args[args.indexOf("--user") + 1], "0:0");
    assert.equal(args.includes("--cap-drop"), false);
    assert.equal(args.includes("--security-opt"), false);
    assert.deepEqual(result.runtimeMetadata.securityHardening, {
        capDrop: null,
        noNewPrivileges: false,
        init: true,
        pidsLimit: 4096,
        nofileSoft: 1024,
        nofileHard: 4096,
        readOnlyRootFilesystem: false,
    });
});
test("Docker app-server rejects read-only root profiles because inner Docker is mandatory", async () => {
    const cli = new FakeDockerCli();
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        transportFactory: () => new FakeCodexTransport(),
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    await assert.rejects(adapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
            resourcePolicy: {
                readOnlyRootFilesystem: true,
            },
        },
    })), /require a writable root filesystem/);
    assert.equal(cli.calls.length, 0);
    assert.equal(dockerRuntime.getSession("session-id")?.status, "failed");
    assert.equal(dockerRuntime.getSession("session-id")?.imagePreflightStatus, "failed");
});
test("Codex adapter records pulled and failed Docker image preflight states", async () => {
    const pulledImage = "registry.example/yp-live-workflow/researcher-runtime:test";
    const pulledTransport = new FakeCodexTransport();
    const pulledRuntime = new DockerRuntimeManager({
        allowedImages: [pulledImage],
        cli: new FakeDockerCli([dockerCliResult(1, "", "missing"), dockerCliResult(0, "pulled")]),
        transportFactory: () => pulledTransport,
    });
    const pulledAdapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime: pulledRuntime,
    });
    await pulledAdapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: pulledImage,
        },
    }));
    assert.equal(pulledRuntime.getSession("session-id")?.imagePreflightStatus, "pulled");
    await pulledAdapter.closeSession("session-id");
    const failedRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        allowedImages: ["allowed-image:latest"],
    });
    const failedAdapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime: failedRuntime,
    });
    await assert.rejects(failedAdapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: "disallowed-image:latest",
        },
    })), /not allowed/);
    assert.equal(failedRuntime.getSession("session-id")?.status, "failed");
    assert.equal(failedRuntime.getSession("session-id")?.imagePreflightStatus, "failed");
});
test("Docker app-server container keeps provider network access by default", async () => {
    const transport = new FakeCodexTransport();
    let launchOptions;
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        runUser: "1234:5678",
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    await adapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
            resourcePolicy: { network: "provider" },
        },
    }));
    const args = launchOptions?.args ?? [];
    assert.equal(args[args.indexOf("--network") + 1], "bridge");
    await adapter.closeSession("session-id");
});
test("Docker app-server provider network uses the VM configured fallback", async () => {
    const transport = new FakeCodexTransport();
    let launchOptions;
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        defaultNetworkMode: "yp-live-workflow-provider-net",
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    await adapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
            resourcePolicy: { network: "provider" },
        },
    }));
    const args = launchOptions?.args ?? [];
    assert.equal(args[args.indexOf("--network") + 1], "yp-live-workflow-provider-net");
    assert.equal(transport.requests.length, 4);
    await adapter.closeSession("session-id");
});
test("Codex adapter does not advertise network access when resolved Docker network is none", async () => {
    const transport = new FakeCodexTransport();
    let launchOptions;
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        defaultNetworkMode: "none",
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    await adapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
            resourcePolicy: { network: "provider" },
        },
    }));
    const args = launchOptions?.args ?? [];
    const turnParams = transport.requests[3]?.params;
    assert.equal(args[args.indexOf("--network") + 1], "none");
    assert.deepEqual(turnParams.sandboxPolicy, {
        type: "externalSandbox",
        networkAccess: "restricted",
    });
    await adapter.closeSession("session-id");
});
test("Docker app-server container preserves the image user when no run user is selected", async () => {
    assert.equal(runUserForHostIdentity(0, 0), null);
    assert.equal(runUserForHostIdentity(1234, 5678), "1234:5678");
    const transport = new FakeCodexTransport();
    let launchOptions;
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        runUser: null,
        transportFactory: (options) => {
            launchOptions = options;
            return transport;
        },
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    await adapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
    }));
    assert.equal((launchOptions?.args ?? []).includes("--user"), false);
    await adapter.closeSession("session-id");
});
test("Docker runtime marks sessions failed when app-server exits unexpectedly", async () => {
    const transport = new FakeCodexTransport();
    const events = [];
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        transportFactory: () => transport,
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    await adapter.startSession(vmSessionStartPayload({
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
    }), {
        onEvent: (event) => {
            events.push(event);
        },
    });
    transport.emitExit({ exitCode: 2, signal: null, error: "app-server crashed" });
    assert.equal(dockerRuntime.getSession("session-id")?.status, "failed");
    assert.equal(dockerRuntime.getSession("session-id")?.exitCode, 2);
    assert.equal(dockerRuntime.getSession("session-id")?.error, "app-server crashed");
    const exitEvent = events.at(-1);
    assert.equal(exitEvent?.eventType, "session.error");
    assert.equal(exitEvent?.codexTurnId, "turn-1");
    assert.deepEqual(exitEvent?.payload, {
        code: "codex_app_server_exited",
        message: "app-server crashed",
        recoverable: true,
        exitCode: 2,
        signal: null,
    });
});
test("Codex adapter recovers a paused warm Docker session after app-server exit", async () => {
    const initialTransport = new FakeCodexTransport();
    const restoredTransport = new FakeCodexTransport();
    const transports = [initialTransport, restoredTransport];
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        transportFactory: () => transports.shift() ?? new FakeCodexTransport(),
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            codexConfig: {
                developerInstructions: "Keep long-running commands in their live exec sessions.",
                config: {
                    background_terminal_max_timeout: 1800000,
                    model: "must-not-be-replayed",
                },
            },
            containerImage: OfficialCodexAppServerImage,
        },
    });
    const started = await adapter.startSession(payload);
    await adapter.pauseSession({
        commandId: "pause-command-one",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        interruptActiveTurn: false,
        keepWarm: true,
    });
    initialTransport.emitExit({ exitCode: 137, signal: null, error: "container oom" });
    assert.equal(dockerRuntime.getSession(payload.sessionId)?.status, "failed");
    const resumed = await adapter.resumeSession({
        commandId: "resume-command-one",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
    });
    assert.equal(resumed.codexThreadId, started.codexThreadId);
    assert.equal(dockerRuntime.getSession(payload.sessionId)?.status, "running");
    assert.deepEqual(restoredTransport.requests.map((request) => request.method), [
        "initialize",
        "account/login/start",
        "thread/resume",
    ]);
    const resumeParams = restoredTransport.requests[2]?.params;
    assert.equal(resumeParams.developerInstructions, "Keep long-running commands in their live exec sessions.");
    assert.deepEqual(resumeParams.config, {
        background_terminal_max_timeout: 1800000,
    });
    assert.equal("model" in resumeParams, false);
});
test("Codex adapter relaunches and resumes an active warm Docker session before turn start", async () => {
    const initialTransport = new FakeCodexTransport();
    const restoredTransport = new FakeCodexTransport();
    const transports = [initialTransport, restoredTransport];
    const cli = new FakeDockerCli();
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        transportFactory: () => transports.shift() ?? new FakeCodexTransport(),
    });
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
    });
    const started = await adapter.startSession(payload);
    initialTransport.emitExit({ exitCode: 137, signal: null, error: "container oom" });
    const turn = await adapter.startTurn({
        commandId: "turn-command-one",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    });
    assert.equal(turn.codexThreadId, started.codexThreadId);
    assert.equal(dockerRuntime.getSession(payload.sessionId)?.status, "running");
    assert.deepEqual(restoredTransport.requests.map((request) => request.method), [
        "initialize",
        "account/login/start",
        "thread/resume",
        "turn/start",
    ]);
    assert.equal((restoredTransport.requests[2]?.params).threadId, started.codexThreadId);
    assert.equal((restoredTransport.requests[3]?.params).threadId, started.codexThreadId);
    assert.deepEqual(cli.calls, [
        ["image", "inspect", OfficialCodexAppServerImage],
        ["rm", "-f", "yp-live-workflow-session-session-id"],
        ["image", "inspect", OfficialCodexAppServerImage],
    ]);
});
test("Codex adapter replays requested tiers after warm relaunch for automatic and caller-owned resumes", async () => {
    const cases = [
        {
            command: "review",
            requestedServiceTier: "fast",
            expectedResumeServiceTier: "fast",
        },
        {
            command: "resume",
            requestedServiceTier: "flex",
            expectedResumeServiceTier: null,
        },
    ];
    for (const testCase of cases) {
        const initialTransport = new FakeCodexTransport();
        const restoredTransport = new FakeCodexTransport();
        const transports = [initialTransport, restoredTransport];
        const adapter = new CodexAdapter({
            env: { OPENAI_API_KEY: "fallback-key" },
            transportFactory: () => {
                const transport = transports.shift();
                if (!transport) {
                    throw new Error("unexpected extra transport launch");
                }
                return transport;
            },
        });
        const payload = vmSessionStartPayload({
            initialTurnMode: "deferred",
            auth: chatGptWithApiFallbackAuth(),
        });
        const started = await adapter.startSession(payload);
        const turn = await adapter.startTurn({
            commandId: `turn-before-${testCase.command}-relaunch`,
            sessionId: payload.sessionId,
            codexThreadId: started.codexThreadId,
            input: [{ type: "text", text: "Remember this tier." }],
            overrides: { serviceTier: testCase.requestedServiceTier },
        });
        const turnId = turn.codexTurnId ?? "turn-1";
        initialTransport.emit({
            method: "turn/completed",
            params: {
                threadId: started.codexThreadId,
                turnId,
                turn: { id: turnId, status: "completed" },
            },
        });
        await sleep(1);
        if (testCase.command === "resume") {
            await adapter.pauseSession({
                commandId: "pause-before-relaunch",
                sessionId: payload.sessionId,
                codexThreadId: started.codexThreadId,
                interruptActiveTurn: false,
                keepWarm: true,
            });
        }
        initialTransport.emitExit({ exitCode: 137, signal: null, error: "app-server exited" });
        if (testCase.command === "review") {
            await adapter.startReview({
                commandId: "review-after-relaunch",
                sessionId: payload.sessionId,
                codexThreadId: started.codexThreadId,
                target: { type: "custom", instructions: "Review with the restored tier." },
            });
        }
        else {
            await adapter.resumeSession({
                commandId: "resume-after-relaunch",
                sessionId: payload.sessionId,
                codexThreadId: started.codexThreadId,
            });
        }
        const resumeRequest = restoredTransport.requests.find((request) => request.method === "thread/resume");
        assert.ok(resumeRequest, testCase.command);
        assert.equal(resumeRequest.params.serviceTier, testCase.expectedResumeServiceTier, testCase.command);
        if (testCase.command === "review") {
            const reviewRequest = restoredTransport.requests.find((request) => request.method === "review/start");
            assert.ok(reviewRequest);
            assert.equal("serviceTier" in (reviewRequest.params ?? {}), false);
        }
        await adapter.closeAll();
    }
});
test("Codex adapter resumes relaunched API-fallback threads before non-probing commands", async () => {
    for (const command of ["steer", "interrupt", "inject"]) {
        const initialTransport = new FakeCodexTransport();
        const restoredTransport = new FakeCodexTransport();
        let launchCount = 0;
        initialTransport.rateLimitsResponse = {
            rateLimitsByLimitId: {
                codex: {
                    primary: { usedPercent: 100, windowDurationMins: 300, resetsAt: 1 },
                    rateLimitReachedType: "usage_limit",
                },
            },
        };
        const adapter = new CodexAdapter({
            env: {
                OPENAI_API_KEY: "fallback-key",
                YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS: "1",
            },
            transportFactory: () => {
                launchCount += 1;
                return launchCount === 1 ? initialTransport : restoredTransport;
            },
        });
        const payload = vmSessionStartPayload({
            initialTurnMode: "deferred",
            inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
            auth: chatGptWithApiFallbackAuth(),
        });
        const started = await adapter.startSession(payload);
        await sleep(5);
        initialTransport.emitExit({ exitCode: 137, signal: null, error: "container oom" });
        let commandMethod = "turn/steer";
        if (command === "steer") {
            await adapter.steerTurn({
                commandId: "steer-command-1",
                sessionId: payload.sessionId,
                codexThreadId: started.codexThreadId,
                codexTurnId: "turn-1",
                input: [{ type: "text", text: "Narrow the scope." }],
            });
        }
        else if (command === "interrupt") {
            commandMethod = "turn/interrupt";
            await adapter.interruptTurn({
                commandId: "interrupt-command-1",
                sessionId: payload.sessionId,
                codexThreadId: started.codexThreadId,
                codexTurnId: "turn-1",
            });
        }
        else {
            commandMethod = "thread/inject_items";
            await adapter.injectItems({
                commandId: "inject-command-1",
                sessionId: payload.sessionId,
                codexThreadId: started.codexThreadId,
                items: [{ type: "agentMessage", text: "Injected context." }],
            });
        }
        const methods = restoredTransport.requests.map((request) => request.method);
        assert.deepEqual(methods.slice(0, methods.indexOf(commandMethod) + 1), ["initialize", "account/login/start", "thread/resume", commandMethod], command);
        const resumeRequest = restoredTransport.requests.find((request) => request.method === "thread/resume");
        assert.equal(resumeRequest?.params?.serviceTier, "flex", command);
        assert.equal(launchCount, 2);
    }
});
test("Codex adapter retries auth restore after a warm transport relaunch failure", async () => {
    const initialTransport = new FakeCodexTransport();
    const restoredTransport = new FakeCodexTransport();
    let launchCount = 0;
    let loginAttempts = 0;
    restoredTransport.requestHook = (method) => {
        if (method !== "account/login/start") {
            return;
        }
        loginAttempts += 1;
        if (loginAttempts === 1) {
            throw new Error("transient auth restore failure");
        }
    };
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => {
            launchCount += 1;
            return launchCount === 1 ? initialTransport : restoredTransport;
        },
    });
    const payload = vmSessionStartPayload({ initialTurnMode: "deferred" });
    const started = await adapter.startSession(payload);
    initialTransport.emitExit({ exitCode: 137, signal: null, error: "container oom" });
    await assert.rejects(adapter.startTurn({
        commandId: "turn-command-one",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    }), /transient auth restore failure/);
    assert.equal(launchCount, 2);
    assert.deepEqual(restoredTransport.requests.map((request) => request.method), ["initialize", "account/login/start"]);
    const retryOffset = restoredTransport.requests.length;
    await adapter.startTurn({
        commandId: "turn-command-two",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue after auth retry." }],
    });
    assert.equal(launchCount, 2);
    assert.deepEqual(restoredTransport.requests.slice(retryOffset).map((request) => request.method), [
        "account/login/start",
        "thread/resume",
        "turn/start",
    ]);
});
test("Codex adapter ignores exits from stale replaced transports", async () => {
    const initialTransport = new FakeCodexTransport();
    const restoredTransport = new FakeCodexTransport();
    let launchCount = 0;
    const adapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => {
            launchCount += 1;
            return launchCount === 1 ? initialTransport : restoredTransport;
        },
    });
    const payload = vmSessionStartPayload({
        initialTurnMode: "deferred",
    });
    const started = await adapter.startSession(payload);
    initialTransport.emitExit({ exitCode: 137, signal: null, error: "container oom" });
    await adapter.startTurn({
        commandId: "turn-command-one",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue." }],
    });
    const requestOffset = restoredTransport.requests.length;
    initialTransport.emitExit({ exitCode: 1, signal: null, error: "late stale exit" });
    await adapter.startTurn({
        commandId: "turn-command-two",
        sessionId: payload.sessionId,
        codexThreadId: started.codexThreadId,
        input: [{ type: "text", text: "Continue again." }],
    });
    assert.equal(launchCount, 2);
    assert.deepEqual(restoredTransport.requests.slice(requestOffset).map((request) => request.method), ["turn/start"]);
});
test("Docker runtime ensures images with inspect before pull", async () => {
    const cli = new FakeDockerCli([dockerCliResult(1, "", "missing"), dockerCliResult(0, "pulled")]);
    const runtime = new DockerRuntimeManager({
        defaultImage: "docker.io/researcher-runtime:latest",
        allowedImages: ["docker.io/researcher-runtime:latest"],
        cli,
    });
    assert.deepEqual(await runtime.ensureImage(), {
        image: "docker.io/researcher-runtime:latest",
        present: true,
        pulled: true,
    });
    assert.deepEqual(cli.calls, [
        ["image", "inspect", "docker.io/researcher-runtime:latest"],
        ["pull", "docker.io/researcher-runtime:latest"],
    ]);
    const presentCli = new FakeDockerCli([dockerCliResult(0, "[]")]);
    const presentRuntime = new DockerRuntimeManager({ cli: presentCli, allowedImages: ["profile-image:1"] });
    assert.deepEqual(await presentRuntime.ensureImage("profile-image:1"), {
        image: "profile-image:1",
        present: true,
        pulled: false,
    });
    assert.deepEqual(presentCli.calls, [["image", "inspect", "profile-image:1"]]);
});
test("Docker runtime fails closed when the local-only Researcher runtime image is missing", async () => {
    const cli = new FakeDockerCli([dockerCliResult(1, "", "missing")]);
    const runtime = new DockerRuntimeManager({
        defaultImage: OfficialCodexAppServerImage,
        allowedImages: [OfficialCodexAppServerImage],
        cli,
    });
    await assert.rejects(runtime.ensureImage(), (error) => error instanceof DockerImagePolicyError &&
        error.code === "codex_container_image_not_present" &&
        /Build it on this host/u.test(error.message));
    assert.deepEqual(cli.calls, [["image", "inspect", OfficialCodexAppServerImage]]);
});
test("Docker runtime logs in to GHCR before private image preflight", async () => {
    const privateImage = "ghcr.io/yp-live-workflow/researcher-runtime:private-test";
    const cli = new FakeDockerCli([dockerCliResult(0, "login"), dockerCliResult(1, "", "missing"), dockerCliResult(0, "pulled")]);
    const runtime = new DockerRuntimeManager({
        allowedImages: [privateImage],
        cli,
        registryCredentials: {
            registry: "ghcr.io",
            username: "robot",
            token: "secret-token",
        },
    });
    assert.deepEqual(await runtime.ensureImage(privateImage), {
        image: privateImage,
        present: true,
        pulled: true,
    });
    assert.deepEqual(cli.calls, [
        ["login", "ghcr.io", "-u", "robot", "--password-stdin"],
        ["image", "inspect", privateImage],
        ["pull", privateImage],
    ]);
    assert.equal(cli.runOptions[0]?.stdin, "secret-token\n");
    assert.equal(cli.calls.flat().includes("secret-token"), false);
});
test("Docker runtime fails private image preflight when GHCR login fails", async () => {
    const privateImage = "ghcr.io/yp-live-workflow/researcher-runtime:private-test";
    const cli = new FakeDockerCli([dockerCliResult(1, "", "denied")]);
    const runtime = new DockerRuntimeManager({
        allowedImages: [privateImage],
        cli,
        registryCredentials: {
            registry: "ghcr.io",
            username: "robot",
            token: "secret-token",
        },
    });
    await assert.rejects(runtime.ensureImage(privateImage), /Docker registry login failed.*denied/);
    assert.deepEqual(cli.calls, [["login", "ghcr.io", "-u", "robot", "--password-stdin"]]);
});
test("Docker runtime enforces allowed image policy including digest-pinned images", async () => {
    const digestImage = "registry.example/codex@sha256:abcdef1234567890";
    const cli = new FakeDockerCli([dockerCliResult(0, "[]")]);
    const runtime = new DockerRuntimeManager({
        cli,
        allowedImages: [digestImage],
    });
    assert.deepEqual(await runtime.ensureImage(digestImage), {
        image: digestImage,
        present: true,
        pulled: false,
    });
    await assert.rejects(new DockerRuntimeManager({ cli: new FakeDockerCli(), allowedImages: [digestImage] }).ensureImage("registry.example/codex:latest"), /not allowed/);
    await assert.rejects(new DockerRuntimeManager({ cli: new FakeDockerCli() }).ensureImage(), /not configured/);
});
test("Docker runtime can preflight registered capability images without the Codex allowlist", async () => {
    const cli = new FakeDockerCli([dockerCliResult(0, "[]")]);
    const runtime = new DockerRuntimeManager({
        cli,
        allowedImages: ["researcher-runtime:latest"],
        allowUnlistedImages: true,
    });
    assert.deepEqual(await runtime.ensureImage("quay.io/biocontainers/samtools:1.19--h50ea8bc_0"), {
        image: "quay.io/biocontainers/samtools:1.19--h50ea8bc_0",
        present: true,
        pulled: false,
    });
    assert.deepEqual(cli.calls, [["image", "inspect", "quay.io/biocontainers/samtools:1.19--h50ea8bc_0"]]);
});
test("Docker runtime cleans up stale labeled containers", async () => {
    const cli = new FakeDockerCli([dockerCliResult(0, "old-one\told-session\nold-two\t\n"), dockerCliResult(0), dockerCliResult(0)]);
    const runtime = new DockerRuntimeManager({ cli });
    const cleanup = await runtime.cleanupOrphans();
    assert.equal(cleanup.mode, "cleanup");
    assert.equal(cleanup.stopped, 2);
    assert.deepEqual(cleanup.containerNames, ["old-one", "old-two"]);
    assert.deepEqual(cleanup.containers.map((container) => container.classification), ["stale", "unknown"]);
    assert.equal(runtime.getStatus().orphanCleanup?.stopped, 2);
    assert.deepEqual(cli.calls, [
        ["ps", "-a", "--filter", "label=yp-live-workflow.managed_by=yp-live-workflow-vm-agent", "--format", "{{.Names}}\t{{.Label \"yp-live-workflow.session_id\"}}\t{{.State}}"],
        ["stop", "old-one"],
        ["stop", "old-two"],
    ]);
});
test("Docker runtime scans stale labeled containers without stopping them", async () => {
    const cli = new FakeDockerCli([dockerCliResult(0, "old-one\told-session\nold-two\t\n")]);
    const runtime = new DockerRuntimeManager({ cli });
    const scan = await runtime.scanOrphans();
    assert.equal(scan.mode, "scan");
    assert.equal(scan.stopped, 0);
    assert.deepEqual(scan.containerNames, []);
    assert.deepEqual(scan.containers.map((container) => container.classification), ["stale", "unknown"]);
    assert.equal(runtime.getStatus().orphanCleanup?.mode, "scan");
    assert.deepEqual(cli.calls, [
        ["ps", "-a", "--filter", "label=yp-live-workflow.managed_by=yp-live-workflow-vm-agent", "--format", "{{.Names}}\t{{.Label \"yp-live-workflow.session_id\"}}\t{{.State}}"],
    ]);
});
test("Codex app-server transport defers approval callbacks by default", async () => {
    const script = `
const readline = require("node:readline");
const rl = readline.createInterface({ input: process.stdin });
rl.on("line", (line) => {
  console.log(JSON.stringify({ method: "test/response", params: JSON.parse(line) }));
  setTimeout(() => process.exit(0), 10);
});
setTimeout(() => {
  console.log(JSON.stringify({
    id: 7,
    method: "item/commandExecution/requestApproval",
    params: { itemId: "item-1" }
  }));
}, 10);
`;
    const transport = new StdioCodexAppServerTransport({
        command: process.execPath,
        args: ["-e", script],
        cwd: process.cwd(),
        codexHomePath: process.cwd(),
        env: process.env,
    });
    const notifications = [];
    const approvalRequest = new Promise((resolve) => {
        transport.onNotification((message) => {
            notifications.push(message);
            if (message.method === "item/commandExecution/requestApproval") {
                resolve(message);
            }
        });
    });
    const response = new Promise((resolve) => {
        transport.onNotification((message) => {
            if (message.method === "test/response") {
                resolve(message);
            }
        });
    });
    try {
        const request = await Promise.race([
            approvalRequest,
            sleep(1000).then(() => {
                throw new Error("Timed out waiting for Codex approval request");
            }),
        ]);
        assert.equal(request.id, 7);
        transport.respondToServerRequest(7, { decision: "approved" });
        const message = await Promise.race([
            response,
            sleep(1000).then(() => {
                throw new Error("Timed out waiting for Codex transport response");
            }),
        ]);
        const params = message.params;
        const result = params.result;
        assert.equal(params.id, 7);
        assert.deepEqual(result, { decision: "approved" });
        assert.equal(notifications.some((notification) => notification.method === "item/commandExecution/requestApproval"), true);
    }
    finally {
        await transport.close().catch(() => undefined);
    }
});
test("Codex app-server transport reports exit for deferred approvals cleared by process exit", async () => {
    const script = `
setInterval(() => undefined, 1000);
`;
    const transport = new StdioCodexAppServerTransport({
        command: process.execPath,
        args: ["-e", script],
        cwd: process.cwd(),
        codexHomePath: process.cwd(),
        env: process.env,
    });
    try {
        const internals = transport;
        internals.pendingServerRequests.add(7);
        internals.rejectPending(new Error("Codex app-server exited (1)"));
        assert.throws(() => transport.respondToServerRequest(7, { decision: "approved" }), /Codex app-server exited/);
    }
    finally {
        await transport.close().catch(() => undefined);
    }
});
test("Codex app-server transport keeps explicit reject mode for approval callbacks", async () => {
    const script = `
const readline = require("node:readline");
const rl = readline.createInterface({ input: process.stdin });
rl.on("line", (line) => {
  console.log(JSON.stringify({ method: "test/response", params: JSON.parse(line) }));
  setTimeout(() => process.exit(0), 10);
});
setTimeout(() => {
  console.log(JSON.stringify({
    id: 7,
    method: "item/commandExecution/requestApproval",
    params: { itemId: "item-1" }
  }));
}, 10);
`;
    const transport = new StdioCodexAppServerTransport({
        command: process.execPath,
        args: ["-e", script],
        cwd: process.cwd(),
        codexHomePath: process.cwd(),
        env: process.env,
        serverRequestMode: "reject",
    });
    const notifications = [];
    const response = new Promise((resolve) => {
        transport.onNotification((message) => {
            notifications.push(message);
            if (message.method === "test/response") {
                resolve(message);
            }
        });
    });
    try {
        const message = await Promise.race([
            response,
            sleep(1000).then(() => {
                throw new Error("Timed out waiting for Codex transport response");
            }),
        ]);
        const params = message.params;
        const error = params.error;
        assert.equal(params.id, 7);
        assert.equal(error.code, -32000);
        assert.equal(error.message, "LiveWorkflow VM agent approval responder is not configured");
        assert.equal(notifications.some((notification) => notification.method === "item/commandExecution/requestApproval"), true);
    }
    finally {
        await transport.close().catch(() => undefined);
    }
});
test("VM agent runtime registers persists heartbeats telemeters and closes offline", async () => {
    const events = [];
    const stateStore = new MemoryStateStore();
    const metricsReporter = new FakeGpuMetricsReporter();
    const fetchImpl = async (_input, init) => {
        const body = JSON.parse(init?.body ?? "{}");
        events.push({ messageType: body.messageType, data: body.data });
        return {
            ok: true,
            status: 200,
            text: async () => JSON.stringify({
                ok: true,
                vmHostId: body.messageType === "vm.register" ? "registered-vm-host-id" : body.data.vmHostId,
                messageType: body.messageType,
            }),
        };
    };
    const runtime = await startVmAgent({
        config: testConfig(),
        fetchImpl,
        stateStore,
        metricsReporter,
        dockerRuntime: fakeDockerRuntime(false),
    });
    assert.equal(runtime.vmHostId, "registered-vm-host-id");
    assert.deepEqual(stateStore.state, { vmHostId: "registered-vm-host-id" });
    assert.deepEqual(events.map((event) => event.messageType), ["vm.register", "vm.heartbeat", "vm.telemetry"]);
    assert.equal((events[0]?.data.capabilities).workspacePreparation, false);
    assert.equal((events[0]?.data.capabilities).gpu, true);
    assert.equal((events[1]?.data.capabilities).gpu, true);
    assert.equal((events[2]?.data.capabilities).gpu, true);
    assert.equal(runtime.getStatus().closed, false);
    assert.ok(runtime.getStatus().lastHeartbeatAt);
    assert.ok(runtime.getStatus().lastTelemetryAt);
    await runtime.close();
    assert.equal(runtime.getStatus().closed, true);
    assert.equal(events.at(-1)?.messageType, "vm.heartbeat");
    assert.equal(events.at(-1)?.data.status, "offline");
});
test("VM agent runtime starts broker websocket after registration", async () => {
    const server = http.createServer();
    const wss = new WebSocketServer({ server, path: "/api/live-workflows/vm/ws" });
    const hellos = [];
    const events = [];
    wss.on("connection", (socket, req) => {
        assert.equal(req.headers.authorization, "Bearer secret");
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            hellos.push(message);
            if (message.messageType === "vm.broker.hello") {
                socket.send(JSON.stringify({
                    ok: true,
                    protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
                    messageType: "vm.broker.hello.ack",
                    ts: "2026-05-18T12:00:00.000Z",
                    data: {
                        ok: true,
                        vmHostId: "registered-vm-host-id",
                        connectionId: "connection-1",
                    },
                }));
            }
        });
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    const fetchImpl = async (_input, init) => {
        const body = JSON.parse(init?.body ?? "{}");
        events.push({ messageType: body.messageType, data: body.data });
        return {
            ok: true,
            status: 200,
            text: async () => JSON.stringify({
                ok: true,
                vmHostId: body.messageType === "vm.register" ? "registered-vm-host-id" : body.data.vmHostId,
                messageType: body.messageType,
            }),
        };
    };
    const runtime = await startVmAgent({
        config: {
            ...testConfig(),
            brokerEnabled: true,
            brokerWsUrl: `ws://127.0.0.1:${address.port}/api/live-workflows/vm/ws`,
            brokerReconnectMinMs: 10000,
            brokerReconnectMaxMs: 10000,
        },
        fetchImpl,
        stateStore: new MemoryStateStore(),
        metricsReporter: new FakeMetricsReporter(),
        dockerRuntime: fakeDockerRuntime(false),
    });
    try {
        await waitFor(() => hellos.some((message) => message.messageType === "vm.broker.hello"));
        const hello = hellos.find((message) => message.messageType === "vm.broker.hello");
        assert.equal((hello?.data).vmHostId, "registered-vm-host-id");
        assert.equal(events[0]?.messageType, "vm.register");
    }
    finally {
        await runtime.close();
        for (const socket of wss.clients) {
            socket.terminate();
        }
        await new Promise((resolve, reject) => wss.close((error) => (error ? reject(error) : resolve())));
        await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    }
});
test("VM agent runtime advertises workspace preparation only when the control server is running", async () => {
    const events = [];
    const fetchImpl = async (_input, init) => {
        const body = JSON.parse(init?.body ?? "{}");
        events.push({ messageType: body.messageType, data: body.data });
        return {
            ok: true,
            status: 200,
            text: async () => JSON.stringify({
                ok: true,
                vmHostId: body.messageType === "vm.register" ? "registered-vm-host-id" : body.data.vmHostId,
                messageType: body.messageType,
            }),
        };
    };
    const runtime = await startVmAgent({
        config: {
            ...testConfig(),
            controlPort: 0,
        },
        fetchImpl,
        stateStore: new MemoryStateStore(),
        metricsReporter: new FakeMetricsReporter(),
        dockerRuntime: fakeDockerRuntime(false),
    });
    try {
        const capabilities = events[0]?.data.capabilities;
        assert.equal(capabilities.workspacePreparation, true);
        assert.equal(capabilities.auxTerminal, false);
        const metadata = events[0]?.data.metadata;
        assert.match(String(metadata.vmAgent?.controlBaseUrl), /^http:\/\/127\.0\.0\.1:\d+$/);
        assert.deepEqual(metadata.vmAgent?.capacity, {
            maxCodexSessions: 8,
            activeCodexSessions: 0,
            availableCodexSessions: 8,
            sessionCountsByStatus: {},
        });
    }
    finally {
        await runtime.close();
    }
});
test("VM agent runtime advertises Docker-backed Codex only after Docker probe succeeds", async () => {
    const events = [];
    const fetchImpl = async (_input, init) => {
        const body = JSON.parse(init?.body ?? "{}");
        events.push({ messageType: body.messageType, data: body.data });
        return {
            ok: true,
            status: 200,
            text: async () => JSON.stringify({
                ok: true,
                vmHostId: body.messageType === "vm.register" ? "registered-vm-host-id" : body.data.vmHostId,
                messageType: body.messageType,
            }),
        };
    };
    const runtime = await startVmAgent({
        config: {
            ...testConfig(),
            controlPort: 0,
            codexContainerImage: OfficialCodexAppServerImage,
            codexAllowedImages: [OfficialCodexAppServerImage],
            auxTerminalEnabled: true,
        },
        fetchImpl,
        stateStore: new MemoryStateStore(),
        metricsReporter: new FakeMetricsReporter(),
        dockerRuntime: fakeDockerRuntime(true, "24.0.0"),
    });
    try {
        const capabilities = events[0]?.data.capabilities;
        const metadata = events[0]?.data.metadata;
        const dockerMetadata = metadata.vmAgent?.docker;
        assert.equal(capabilities.docker, true);
        assert.equal(capabilities.codexAppServer, true);
        assert.equal(capabilities.auxTerminal, true);
        assert.equal(dockerMetadata.available, true);
        assert.equal(dockerMetadata.version, "24.0.0");
        assert.equal(dockerMetadata.defaultContainerImage, OfficialCodexAppServerImage);
        assert.deepEqual(dockerMetadata.allowedImages, [OfficialCodexAppServerImage]);
    }
    finally {
        await runtime.close();
    }
});
test("VM agent runtime does not advertise host Codex when Docker is unavailable", async () => {
    const events = [];
    const fetchImpl = async (_input, init) => {
        const body = JSON.parse(init?.body ?? "{}");
        events.push({ messageType: body.messageType, data: body.data });
        return {
            ok: true,
            status: 200,
            text: async () => JSON.stringify({
                ok: true,
                vmHostId: body.messageType === "vm.register" ? "registered-vm-host-id" : body.data.vmHostId,
                messageType: body.messageType,
            }),
        };
    };
    const runtime = await startVmAgent({
        config: {
            ...testConfig(),
            controlPort: 0,
            codexArgs: [...DefaultCodexAppServerArgs],
        },
        fetchImpl,
        stateStore: new MemoryStateStore(),
        metricsReporter: new FakeMetricsReporter(),
        dockerRuntime: fakeDockerRuntime(false),
    });
    try {
        const capabilities = events[0]?.data.capabilities;
        assert.equal(capabilities.docker, false);
        assert.equal(capabilities.codexAppServer, false);
        assert.equal(capabilities.auxTerminal, false);
    }
    finally {
        await runtime.close();
    }
});
test("VM agent runtime scans but does not reap stale Docker containers on startup", async () => {
    const events = [];
    const cli = new FakeDockerCli([
        dockerCliResult(0, "24.0.0"),
        dockerCliResult(0, "old-one\told-session\nold-two\t\n"),
    ]);
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        transportFactory: () => new FakeCodexTransport(),
    });
    const fetchImpl = async (_input, init) => {
        const body = JSON.parse(init?.body ?? "{}");
        events.push({ messageType: body.messageType, data: body.data });
        return {
            ok: true,
            status: 200,
            text: async () => JSON.stringify({
                ok: true,
                vmHostId: body.messageType === "vm.register" ? "registered-vm-host-id" : body.data.vmHostId,
                messageType: body.messageType,
            }),
        };
    };
    const runtime = await startVmAgent({
        config: testConfig(),
        fetchImpl,
        stateStore: new MemoryStateStore(),
        metricsReporter: new FakeMetricsReporter(),
        dockerRuntime,
    });
    try {
        assert.equal(events[0]?.messageType, "vm.register");
        assert.equal(dockerRuntime.getStatus().orphanCleanup?.mode, "scan");
        assert.equal(dockerRuntime.getStatus().orphanCleanup?.stopped, 0);
        assert.deepEqual(cli.calls, [
            ["version", "--format", "{{.Server.Version}}"],
            ["ps", "-a", "--filter", "label=yp-live-workflow.managed_by=yp-live-workflow-vm-agent", "--format", "{{.Names}}\t{{.Label \"yp-live-workflow.session_id\"}}\t{{.State}}"],
        ]);
    }
    finally {
        await runtime.close();
    }
});
test("VM agent runtime records Docker scan failures without blocking registration", async () => {
    const events = [];
    const cli = new FakeDockerCli([
        dockerCliResult(0, "24.0.0"),
        dockerCliResult(1, "", "scan failed"),
    ]);
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        transportFactory: () => new FakeCodexTransport(),
    });
    const fetchImpl = async (_input, init) => {
        const body = JSON.parse(init?.body ?? "{}");
        events.push({ messageType: body.messageType, data: body.data });
        return {
            ok: true,
            status: 200,
            text: async () => JSON.stringify({
                ok: true,
                vmHostId: body.messageType === "vm.register" ? "registered-vm-host-id" : body.data.vmHostId,
                messageType: body.messageType,
            }),
        };
    };
    const runtime = await startVmAgent({
        config: testConfig(),
        fetchImpl,
        stateStore: new MemoryStateStore(),
        metricsReporter: new FakeMetricsReporter(),
        dockerRuntime,
    });
    try {
        assert.equal(events[0]?.messageType, "vm.register");
        assert.match(String(dockerRuntime.getStatus().orphanCleanup?.error), /scan failed/);
    }
    finally {
        await runtime.close();
    }
});
test("VM agent runtime catches periodic heartbeat and telemetry failures", async () => {
    let requestCount = 0;
    const errors = [];
    const originalConsoleError = console.error;
    console.error = (...args) => {
        errors.push(args);
    };
    try {
        const fetchImpl = async (_input, init) => {
            requestCount += 1;
            const body = JSON.parse(init?.body ?? "{}");
            if (requestCount > 3) {
                throw new Error("temporary control plane outage");
            }
            return {
                ok: true,
                status: 200,
                text: async () => JSON.stringify({
                    ok: true,
                    vmHostId: body.messageType === "vm.register" ? "registered-vm-host-id" : body.data.vmHostId,
                    messageType: body.messageType,
                }),
            };
        };
        const runtime = await startVmAgent({
            config: {
                ...testConfig(),
                heartbeatIntervalMs: 5,
                telemetryIntervalMs: 5,
            },
            fetchImpl,
            stateStore: new MemoryStateStore(),
            metricsReporter: new FakeMetricsReporter(),
            dockerRuntime: fakeDockerRuntime(false),
        });
        await sleep(25);
        await runtime.close();
        assert.equal(runtime.getStatus().closed, true);
        assert.ok(errors.length > 0);
    }
    finally {
        console.error = originalConsoleError;
    }
});
test("VM agent runtime bounds shutdown drain before sending offline heartbeat", async () => {
    const events = [];
    let availableHeartbeatCount = 0;
    const fetchImpl = async (_input, init) => {
        const body = JSON.parse(init?.body ?? "{}");
        events.push({ messageType: body.messageType, data: body.data });
        if (body.messageType === "vm.heartbeat" && body.data.status === "available") {
            availableHeartbeatCount += 1;
            if (availableHeartbeatCount > 1) {
                return new Promise(() => undefined);
            }
        }
        return {
            ok: true,
            status: 200,
            text: async () => JSON.stringify({
                ok: true,
                vmHostId: body.messageType === "vm.register" ? "registered-vm-host-id" : body.data.vmHostId,
                messageType: body.messageType,
            }),
        };
    };
    const runtime = await startVmAgent({
        config: {
            ...testConfig(),
            heartbeatIntervalMs: 1,
            telemetryIntervalMs: 999999,
        },
        fetchImpl,
        stateStore: new MemoryStateStore(),
        metricsReporter: new FakeMetricsReporter(),
        shutdownDrainTimeoutMs: 5,
        dockerRuntime: fakeDockerRuntime(false),
    });
    for (let i = 0; i < 50 && availableHeartbeatCount < 2; i += 1) {
        await sleep(1);
    }
    assert.equal(availableHeartbeatCount, 2);
    await runtime.close();
    assert.equal(runtime.getStatus().closed, true);
    assert.equal(events.at(-1)?.messageType, "vm.heartbeat");
    assert.equal(events.at(-1)?.data.status, "offline");
});
test("VM agent runtime suppresses late periodic telemetry after offline heartbeat", async () => {
    const events = [];
    const metricsReporter = new DelayedPeriodicMetricsReporter();
    const fetchImpl = async (_input, init) => {
        const body = JSON.parse(init?.body ?? "{}");
        events.push({ messageType: body.messageType, data: body.data });
        return {
            ok: true,
            status: 200,
            text: async () => JSON.stringify({
                ok: true,
                vmHostId: body.messageType === "vm.register" ? "registered-vm-host-id" : body.data.vmHostId,
                messageType: body.messageType,
            }),
        };
    };
    const runtime = await startVmAgent({
        config: {
            ...testConfig(),
            heartbeatIntervalMs: 999999,
            telemetryIntervalMs: 1,
        },
        fetchImpl,
        stateStore: new MemoryStateStore(),
        metricsReporter,
        shutdownDrainTimeoutMs: 5,
        dockerRuntime: fakeDockerRuntime(false),
    });
    await metricsReporter.waitForDelayedSnapshot();
    await runtime.close();
    metricsReporter.resolveDelayedSnapshot();
    await sleep(5);
    assert.equal(events.at(-1)?.messageType, "vm.heartbeat");
    assert.equal(events.at(-1)?.data.status, "offline");
    assert.equal(events.filter((event) => event.messageType === "vm.telemetry").length, 1);
});
test("metrics reporter returns CPU memory disk telemetry with injectable probes", async () => {
    const reporter = new MetricsReporter({
        hostname: () => "vm-a",
        platform: () => "linux",
        arch: () => "x64",
        cpus: () => [{ model: "CPU", speed: 1, times: { user: 1, nice: 0, sys: 1, idle: 10, irq: 0 } }],
        loadavg: () => [0.1, 0.2, 0.3],
        uptime: () => 10,
        totalmem: () => 1000,
        freemem: () => 500,
        statfs: async () => ({ blocks: 10, bsize: 100, bavail: 4 }),
        gpuProbe: async () => "",
    });
    const snapshot = await reporter.collectSnapshot({
        workspaceRoot: "/mnt/experiments",
        archiveRoot: "/mnt/archive",
    });
    assert.equal(snapshot.system.hostname, "vm-a");
    assert.equal(snapshot.system.cpuCount, 1);
    assert.equal(snapshot.volumes.length, 2);
    assert.equal(snapshot.volumes[0]?.totalBytes, 1000);
    assert.deepEqual(snapshot.telemetry.gpu, {
        available: false,
        status: "unavailable",
        deviceCount: 0,
        devices: [],
    });
});
test("workspace manager prepares layout materialized files and empty workspaces", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-prepare-"));
    const payload = workspacePreparePayload(tempDir, {
        materialization: {
            agentsMd: "Project agents",
            codexHomeAgentsOverrideMd: "Global agents",
            codexConfigToml: "model = \"gpt-5.5\"",
            rules: [{ name: "safety", content: "Run tests" }],
            skills: [{ name: "analysis", skillMd: "# Analysis", files: [{ path: "references/notes.md", content: "Notes" }] }],
            fullPlanMd: "# Full Plan",
            researchPlanMd: "# Research Plan",
            files: [
                { path: "docs/context.md", content: "Context" },
                { path: "papers/example.pdf", contentBase64: Buffer.from([0x25, 0x50, 0x44, 0x46, 0x00, 0xff]).toString("base64"), encoding: "base64" },
            ],
            cacheFiles: [
                { path: "capabilities/bin/samtools", content: "#!/usr/bin/env bash\nexec echo samtools \"$@\"\n", mode: 0o755 },
            ],
        },
    });
    const manager = new WorkspaceManager({
        now: () => new Date("2026-05-16T13:02:00.000Z"),
    });
    const prepared = await manager.prepareWorkspace(payload);
    assert.equal(prepared.repo.status, "empty");
    assert.equal(prepared.preparedAt, "2026-05-16T13:02:00.000Z");
    assert.equal(await fs.readFile(path.join(tempDir, "workspace", "AGENTS.md"), "utf8"), "Project agents");
    assert.equal(await fs.readFile(path.join(tempDir, "codex-home", "AGENTS.override.md"), "utf8"), "Global agents");
    assert.equal(await fs.readFile(path.join(tempDir, "workspace", ".codex", "rules", "safety.rules"), "utf8"), "Run tests");
    assert.equal(await fs.readFile(path.join(tempDir, "workspace", ".codex", "skills", "analysis", "references", "notes.md"), "utf8"), "Notes");
    assert.ok(prepared.materializedFiles.includes("workspace/docs/context.md"));
    assert.ok(prepared.materializedFiles.includes("cache/capabilities/bin/samtools"));
    assert.deepEqual(await fs.readFile(path.join(tempDir, "workspace", "papers", "example.pdf")), Buffer.from([0x25, 0x50, 0x44, 0x46, 0x00, 0xff]));
    const wrapperStats = await fs.stat(path.join(tempDir, "cache", "capabilities", "bin", "samtools"));
    assert.equal(wrapperStats.mode & 0o777, 0o755);
});
test("workspace manager clones and updates repositories through the injected git adapter", async () => {
    const cloneRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-clone-"));
    const git = new FakeGitAdapter();
    const manager = new WorkspaceManager({ git });
    await manager.prepareWorkspace(workspacePreparePayload(cloneRoot, {
        repoUrl: "https://example.test/repo.git",
        repoRef: "main",
    }));
    assert.deepEqual(git.calls, [
        ["clone", "https://example.test/repo.git", path.join(cloneRoot, "workspace")],
        ["checkout", path.join(cloneRoot, "workspace"), "main"],
        ["currentRef", path.join(cloneRoot, "workspace")],
    ]);
    const updateRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-update-"));
    await fs.mkdir(path.join(updateRoot, "workspace", ".git"), { recursive: true });
    git.calls.length = 0;
    await manager.prepareWorkspace(workspacePreparePayload(updateRoot, {
        repoUrl: "https://example.test/repo.git",
        repoRef: "feature",
    }));
    assert.deepEqual(git.calls, [
        ["fetch", path.join(updateRoot, "workspace")],
        ["checkout", path.join(updateRoot, "workspace"), "feature"],
        ["currentRef", path.join(updateRoot, "workspace")],
        ["pull", path.join(updateRoot, "workspace")],
        ["currentRef", path.join(updateRoot, "workspace")],
    ]);
});
test("workspace manager prepares GitHub folder repositories under workspace repo name", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-github-"));
    const git = new FakeGitAdapter();
    const manager = new WorkspaceManager({ git });
    const prepared = await manager.prepareWorkspace(workspacePreparePayload(root, {
        githubFolder: {
            repositoryFullName: "example/repo",
            cloneUrl: "https://github.com/example/repo.git",
            branchName: "yp-live-workflow/groups/42",
            repoDirectoryName: "repo",
            folderPath: "src/tools",
            commitAuthorName: "LiveWorkflow Scientist",
            commitAuthorEmail: "scientist@yp-live-workflow.ai",
            htmlUrl: "https://github.com/example/repo/tree/yp-live-workflow/groups/42/src/tools",
            accessToken: "ghp_secret",
            tokenUsername: "x-access-token",
        },
    }));
    const repoPath = path.join(root, "workspace", "repo");
    const helperPath = path.join(repoPath, ".git", "yp-live-workflow-github-credential-helper.sh");
    const cloneCredentialHelperPath = expectedGitHubCloneCredentialHelperPath(root, {
        repositoryFullName: "example/repo",
        repoDirectoryName: "repo",
        branchName: "yp-live-workflow/groups/42",
    });
    assert.equal(prepared.repo.status, "empty");
    assert.equal(prepared.githubFolder?.status, "cloned");
    assert.equal(prepared.githubFolder?.workspacePath, repoPath);
    assert.equal(prepared.githubFolder?.credentialHelperPath, helperPath);
    assert.equal(prepared.githubFolder?.checkedOutCommitSha, "abc123");
    assert.deepEqual(git.calls, [
        ["clone", "https://github.com/example/repo.git", repoPath, cloneCredentialHelperPath],
        ["setLocalConfig", repoPath, "credential.helper", "!/workspace/repo/.git/yp-live-workflow-github-credential-helper.sh", "allowUnsafeCredentialHelper"],
        ["setLocalConfig", repoPath, "credential.useHttpPath", "true"],
        ["setRemoteUrl", repoPath, "origin", "https://github.com/example/repo.git"],
        ["checkout", repoPath, "yp-live-workflow/groups/42"],
        ["setLocalConfig", repoPath, "user.name", "LiveWorkflow Scientist"],
        ["setLocalConfig", repoPath, "user.email", "scientist@yp-live-workflow.ai"],
        ["currentRef", repoPath],
        ["currentCommit", repoPath],
    ]);
    assert.match(await fs.readFile(helperPath, "utf8"), /ghp_secret/u);
    assert.match(await runCredentialHelper(helperPath, "protocol=https\nhost=github.com\npath=example/repo.git\n\n"), /password=ghp_secret/u);
    assert.equal(await runCredentialHelper(helperPath, "protocol=https\nhost=attacker.example\npath=example/repo.git\n\n"), "");
    assert.equal(await runCredentialHelper(helperPath, "protocol=https\nhost=github.com\npath=attacker/repo.git\n\n"), "");
    assert.equal(await pathExists(cloneCredentialHelperPath), false);
});
test("workspace manager leaves GitHub folder credentials container-visible after host updates", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-github-update-"));
    const repoPath = path.join(root, "workspace", "repo");
    await fs.mkdir(path.join(repoPath, ".git"), { recursive: true });
    const outsideHelperPath = path.join(await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-github-helper-outside-")), "helper.sh");
    await fs.writeFile(outsideHelperPath, "outside");
    const helperPath = path.join(repoPath, ".git", "yp-live-workflow-github-credential-helper.sh");
    await fs.symlink(outsideHelperPath, helperPath);
    const git = new FakeGitAdapter();
    const manager = new WorkspaceManager({ git });
    const prepared = await manager.prepareWorkspace(workspacePreparePayload(root, {
        githubFolder: {
            repositoryFullName: "example/repo",
            cloneUrl: "https://github.com/example/repo.git",
            branchName: "yp-live-workflow/groups/42",
            repoDirectoryName: "repo",
            folderPath: ".",
            commitAuthorName: "LiveWorkflow Scientist",
            commitAuthorEmail: "scientist@yp-live-workflow.ai",
            htmlUrl: "https://github.com/example/repo/tree/yp-live-workflow/groups/42",
            accessToken: "ghp_secret",
            tokenUsername: "x-access-token",
        },
    }));
    const helperStats = await fs.lstat(helperPath);
    assert.equal(prepared.githubFolder?.status, "updated");
    assert.equal(prepared.githubFolder?.credentialHelperPath, helperPath);
    assert.equal(helperStats.isSymbolicLink(), false);
    assert.equal(await fs.readFile(outsideHelperPath, "utf8"), "outside");
    assert.deepEqual(git.calls, [
        ["setLocalConfig", repoPath, "credential.helper", `!${helperPath}`, "allowUnsafeCredentialHelper"],
        ["setLocalConfig", repoPath, "credential.useHttpPath", "true"],
        ["setRemoteUrl", repoPath, "origin", "https://github.com/example/repo.git"],
        ["fetch", repoPath],
        ["checkout", repoPath, "yp-live-workflow/groups/42"],
        ["currentRef", repoPath],
        ["pull", repoPath],
        ["setLocalConfig", repoPath, "credential.helper", "!/workspace/repo/.git/yp-live-workflow-github-credential-helper.sh", "allowUnsafeCredentialHelper"],
        ["setLocalConfig", repoPath, "credential.useHttpPath", "true"],
        ["setLocalConfig", repoPath, "user.name", "LiveWorkflow Scientist"],
        ["setLocalConfig", repoPath, "user.email", "scientist@yp-live-workflow.ai"],
        ["currentRef", repoPath],
        ["currentCommit", repoPath],
    ]);
});
test("workspace manager reclones GitHub folder when repo path is a symlink", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-github-repo-symlink-"));
    const repoPath = path.join(root, "workspace", "repo");
    const outsideRepoPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-github-outside-repo-"));
    await fs.mkdir(path.join(root, "workspace"), { recursive: true });
    await fs.mkdir(path.join(outsideRepoPath, ".git"), { recursive: true });
    await fs.symlink(outsideRepoPath, repoPath, "dir");
    const git = new FakeGitAdapter();
    const manager = new WorkspaceManager({ git });
    const prepared = await manager.prepareWorkspace(workspacePreparePayload(root, {
        githubFolder: {
            repositoryFullName: "example/repo",
            cloneUrl: "https://github.com/example/repo.git",
            branchName: "yp-live-workflow/groups/42",
            repoDirectoryName: "repo",
            folderPath: ".",
            commitAuthorName: "LiveWorkflow Scientist",
            commitAuthorEmail: "scientist@yp-live-workflow.ai",
            htmlUrl: "https://github.com/example/repo/tree/yp-live-workflow/groups/42",
            accessToken: "ghp_secret",
            tokenUsername: "x-access-token",
        },
    }));
    const repoStats = await fs.lstat(repoPath);
    const cloneCredentialHelperPath = expectedGitHubCloneCredentialHelperPath(root, {
        repositoryFullName: "example/repo",
        repoDirectoryName: "repo",
        branchName: "yp-live-workflow/groups/42",
    });
    assert.equal(prepared.githubFolder?.status, "cloned");
    assert.equal(repoStats.isSymbolicLink(), false);
    assert.equal(repoStats.isDirectory(), true);
    assert.equal(await pathExists(path.join(outsideRepoPath, ".git", "yp-live-workflow-github-credential-helper.sh")), false);
    assert.deepEqual(git.calls, [
        ["clone", "https://github.com/example/repo.git", repoPath, cloneCredentialHelperPath],
        ["setLocalConfig", repoPath, "credential.helper", "!/workspace/repo/.git/yp-live-workflow-github-credential-helper.sh", "allowUnsafeCredentialHelper"],
        ["setLocalConfig", repoPath, "credential.useHttpPath", "true"],
        ["setRemoteUrl", repoPath, "origin", "https://github.com/example/repo.git"],
        ["checkout", repoPath, "yp-live-workflow/groups/42"],
        ["setLocalConfig", repoPath, "user.name", "LiveWorkflow Scientist"],
        ["setLocalConfig", repoPath, "user.email", "scientist@yp-live-workflow.ai"],
        ["currentRef", repoPath],
        ["currentCommit", repoPath],
    ]);
});
test("workspace manager reclones GitHub folder when git directory is a symlink", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-github-dotgit-symlink-"));
    const repoPath = path.join(root, "workspace", "repo");
    const outsideGitPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-github-outside-git-"));
    await fs.mkdir(repoPath, { recursive: true });
    await fs.symlink(outsideGitPath, path.join(repoPath, ".git"), "dir");
    const git = new FakeGitAdapter();
    const manager = new WorkspaceManager({ git });
    const prepared = await manager.prepareWorkspace(workspacePreparePayload(root, {
        githubFolder: {
            repositoryFullName: "example/repo",
            cloneUrl: "https://github.com/example/repo.git",
            branchName: "yp-live-workflow/groups/42",
            repoDirectoryName: "repo",
            folderPath: ".",
            commitAuthorName: "LiveWorkflow Scientist",
            commitAuthorEmail: "scientist@yp-live-workflow.ai",
            htmlUrl: "https://github.com/example/repo/tree/yp-live-workflow/groups/42",
            accessToken: "ghp_secret",
            tokenUsername: "x-access-token",
        },
    }));
    const gitStats = await fs.lstat(path.join(repoPath, ".git"));
    const cloneCredentialHelperPath = expectedGitHubCloneCredentialHelperPath(root, {
        repositoryFullName: "example/repo",
        repoDirectoryName: "repo",
        branchName: "yp-live-workflow/groups/42",
    });
    assert.equal(prepared.githubFolder?.status, "cloned");
    assert.equal(gitStats.isSymbolicLink(), false);
    assert.equal(gitStats.isDirectory(), true);
    assert.equal(await pathExists(path.join(outsideGitPath, "yp-live-workflow-github-credential-helper.sh")), false);
    assert.deepEqual(git.calls, [
        ["clone", "https://github.com/example/repo.git", repoPath, cloneCredentialHelperPath],
        ["setLocalConfig", repoPath, "credential.helper", "!/workspace/repo/.git/yp-live-workflow-github-credential-helper.sh", "allowUnsafeCredentialHelper"],
        ["setLocalConfig", repoPath, "credential.useHttpPath", "true"],
        ["setRemoteUrl", repoPath, "origin", "https://github.com/example/repo.git"],
        ["checkout", repoPath, "yp-live-workflow/groups/42"],
        ["setLocalConfig", repoPath, "user.name", "LiveWorkflow Scientist"],
        ["setLocalConfig", repoPath, "user.email", "scientist@yp-live-workflow.ai"],
        ["currentRef", repoPath],
        ["currentCommit", repoPath],
    ]);
});
test("workspace manager rejects unsafe materialized file paths", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-unsafe-"));
    const manager = new WorkspaceManager();
    await assert.rejects(manager.prepareWorkspace(workspacePreparePayload(tempDir, {
        materialization: {
            files: [{ path: "../escape.md", content: "bad" }],
        },
    })));
});
test("workspace manager refuses symlinked materialized files and directories", async () => {
    const fileRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-symlink-file-"));
    const outsideFile = path.join(await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-symlink-outside-")), "AGENTS.md");
    await fs.writeFile(outsideFile, "original", "utf8");
    await fs.mkdir(path.join(fileRoot, "workspace"), { recursive: true });
    await fs.symlink(outsideFile, path.join(fileRoot, "workspace", "AGENTS.md"));
    await assert.rejects(new WorkspaceManager().prepareWorkspace(workspacePreparePayload(fileRoot, {
        materialization: { agentsMd: "replacement" },
    })), /symlink/);
    assert.equal(await fs.readFile(outsideFile, "utf8"), "original");
    const directoryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-symlink-dir-"));
    const outsideDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-symlink-target-"));
    await fs.mkdir(path.join(directoryRoot, "workspace"), { recursive: true });
    await fs.symlink(outsideDirectory, path.join(directoryRoot, "workspace", ".codex"));
    await assert.rejects(new WorkspaceManager().prepareWorkspace(workspacePreparePayload(directoryRoot, {
        materialization: { codexConfigToml: "model = \"gpt-5.5\"" },
    })), /symlink/);
});
test("workspace manager restricts roots to the configured VM workspace root", async () => {
    const allowedRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-root-"));
    const outsideRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-outside-"));
    const manager = new WorkspaceManager({ allowedRootPath: allowedRoot });
    await manager.prepareWorkspace(workspacePreparePayload(path.join(allowedRoot, "experiment-1")));
    await assert.rejects(manager.prepareWorkspace(workspacePreparePayload(outsideRoot)), /outside the VM workspace root/);
});
test("workspace manager rejects allowed roots that traverse symlink components", async () => {
    const allowedRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-allowed-root-"));
    const outsideRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-outside-root-"));
    await fs.symlink(outsideRoot, path.join(allowedRoot, "link"));
    const manager = new WorkspaceManager({ allowedRootPath: allowedRoot });
    await assert.rejects(manager.prepareWorkspace(workspacePreparePayload(path.join(allowedRoot, "link", "workspace-1"))), /symlink/);
});
test("workspace manager validates session layouts against derived workspace paths", async () => {
    const allowedRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-session-layout-root-"));
    const manager = new WorkspaceManager({ allowedRootPath: allowedRoot });
    const rootPath = path.join(allowedRoot, "workspace-1");
    await manager.validateSessionLayout(sessionLayout(rootPath));
    await assert.rejects(manager.validateSessionLayout({
        ...sessionLayout(rootPath),
        workspacePath: path.join(allowedRoot, "escape"),
    }), /does not match/);
});
test("VM agent control server authenticates and handles workspace.prepare commands", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-control-server-"));
    const workspaceManager = new WorkspaceManager({
        git: new FakeGitAdapter(),
        now: () => new Date("2026-05-16T13:03:00.000Z"),
    });
    const server = await startVmAgentControlServer({
        host: "127.0.0.1",
        port: 0,
        token: "secret",
        workspaceManager,
    });
    try {
        const forbidden = await fetch(`${server.baseUrl}/commands/workspace.prepare`, {
            method: "POST",
            headers: {
                authorization: "Bearer wrong",
                "content-type": "application/json",
            },
            body: "{}",
        });
        assert.equal(forbidden.status, 403);
        const payload = workspacePreparePayload(tempDir, {
            materialization: { agentsMd: "Project agents" },
        });
        const response = await fetch(`${server.baseUrl}/commands/workspace.prepare`, {
            method: "POST",
            headers: {
                authorization: "Bearer secret",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
                messageType: "workspace.prepare",
                commandId: payload.commandId,
                ts: "2026-05-16T13:00:00.000Z",
                data: payload,
            }),
        });
        const body = await response.json();
        assert.equal(response.status, 200);
        assert.equal(body.messageType, "workspace.prepared");
        assert.equal(body.commandId, payload.commandId);
        assert.equal(body.data.repo.status, "empty");
    }
    finally {
        await server.close();
    }
});
test("VM agent control server accepts larger artifact collect command bodies", async () => {
    const workspaceManager = new WorkspaceManager({ git: new FakeGitAdapter() });
    const commandHandler = {
        path: "/commands/artifact.collect",
        async handle(body) {
            const record = body;
            return {
                ok: true,
                messageType: "artifact.ready",
                commandId: record.commandId,
                paddingLength: record.data.padding.length,
            };
        },
    };
    const server = await startVmAgentControlServer({
        host: "127.0.0.1",
        port: 0,
        token: "secret",
        workspaceManager,
        commandHandlers: [commandHandler],
    });
    try {
        const padding = "x".repeat(1100000);
        const response = await fetch(`${server.baseUrl}/commands/artifact.collect`, {
            method: "POST",
            headers: {
                authorization: "Bearer secret",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
                messageType: "artifact.collect",
                commandId: "large-artifact-collect-command",
                ts: "2026-05-16T13:00:00.000Z",
                data: { padding },
            }),
        });
        const body = await response.json();
        assert.equal(response.status, 200);
        assert.equal(body.messageType, "artifact.ready");
        assert.equal(body.paddingLength, padding.length);
    }
    finally {
        await server.close();
    }
});
test("WorkspaceManager materializes transferred workspace files with checksum validation", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-transfer-"));
    const content = Buffer.from("researcher attachment\n", "utf8");
    const manager = new WorkspaceManager({
        git: new FakeGitAdapter(),
        now: () => new Date("2026-05-16T13:14:00.000Z"),
        allowedRootPath: tempDir,
    });
    const rootPath = path.join(tempDir, "experiment-1");
    const result = await manager.materializeWorkspaceFile({
        commandId: "transfer-command-1",
        workspaceId: "workspace-id",
        vmHostId: "vm-host-id",
        rootPath,
        path: "input-attachments/notes/notes.txt",
        contentType: "text/plain",
        sizeBytes: content.byteLength,
        checksumSha256: createHash("sha256").update(content).digest("hex"),
    }, [content]);
    assert.equal(result.path, "input-attachments/notes/notes.txt");
    assert.equal(await fs.readFile(path.join(rootPath, "workspace/input-attachments/notes/notes.txt"), "utf8"), "researcher attachment\n");
    const artifactResult = await manager.materializeWorkspaceFile({
        commandId: "transfer-command-artifact",
        workspaceId: "workspace-id",
        vmHostId: "vm-host-id",
        rootPath,
        target: "artifacts",
        path: "group-final-review/PRE_PRINT_PAPER_DRAFT.md",
        mode: 0o444,
        sizeBytes: content.byteLength,
        checksumSha256: createHash("sha256").update(content).digest("hex"),
    }, [content]);
    const artifactPath = path.join(rootPath, "artifacts/group-final-review/PRE_PRINT_PAPER_DRAFT.md");
    assert.equal(artifactResult.target, "artifacts");
    assert.equal(await fs.readFile(artifactPath, "utf8"), "researcher attachment\n");
    assert.equal((await fs.stat(artifactPath)).mode & 0o777, 0o444);
    const replacementContent = Buffer.from("recollected researcher attachment\n", "utf8");
    await manager.materializeWorkspaceFile({
        commandId: "transfer-command-artifact-retry",
        workspaceId: "workspace-id",
        vmHostId: "vm-host-id",
        rootPath,
        target: "artifacts",
        path: "group-final-review/PRE_PRINT_PAPER_DRAFT.md",
        mode: 0o444,
        sizeBytes: replacementContent.byteLength,
        checksumSha256: createHash("sha256").update(replacementContent).digest("hex"),
    }, [replacementContent]);
    assert.equal(await fs.readFile(artifactPath, "utf8"), "recollected researcher attachment\n");
    assert.equal((await fs.stat(artifactPath)).mode & 0o777, 0o444);
    await assert.rejects(() => manager.materializeWorkspaceFile({
        commandId: "transfer-command-2",
        workspaceId: "workspace-id",
        vmHostId: "vm-host-id",
        rootPath,
        path: "../escape.txt",
        sizeBytes: content.byteLength,
        checksumSha256: createHash("sha256").update(content).digest("hex"),
    }, [content]), /path/u);
});
test("VM agent control server handles workspace.file.materialize binary uploads", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-control-transfer-"));
    const content = Buffer.from("transferred bytes\n", "utf8");
    const workspaceManager = new WorkspaceManager({
        git: new FakeGitAdapter(),
        now: () => new Date("2026-05-16T13:14:00.000Z"),
        allowedRootPath: tempDir,
    });
    const server = await startVmAgentControlServer({
        host: "127.0.0.1",
        port: 0,
        token: "secret",
        workspaceManager,
    });
    const rootPath = path.join(tempDir, "experiment-1");
    const payload = {
        commandId: "transfer-command-1",
        workspaceId: "workspace-id",
        vmHostId: "vm-host-id",
        rootPath,
        path: "input-attachments/a/file.txt",
        contentType: "text/plain",
        sizeBytes: content.byteLength,
        checksumSha256: createHash("sha256").update(content).digest("hex"),
    };
    try {
        const forbidden = await fetch(`${server.baseUrl}/commands/workspace.file.materialize`, {
            method: "POST",
            headers: {
                authorization: "Bearer wrong",
                "content-type": "text/plain",
                "x-yp-live-workflow-workspace-file": Buffer.from(JSON.stringify(payload), "utf8").toString("base64url"),
            },
            body: content,
        });
        assert.equal(forbidden.status, 403);
        const response = await fetch(`${server.baseUrl}/commands/workspace.file.materialize`, {
            method: "POST",
            headers: {
                authorization: "Bearer secret",
                "content-type": "text/plain",
                "x-yp-live-workflow-workspace-file": Buffer.from(JSON.stringify(payload), "utf8").toString("base64url"),
            },
            body: content,
        });
        const body = await response.json();
        assert.equal(response.status, 200);
        assert.equal(body.path, "input-attachments/a/file.txt");
        assert.equal(await fs.readFile(path.join(rootPath, "workspace/input-attachments/a/file.txt"), "utf8"), "transferred bytes\n");
    }
    finally {
        await server.close();
    }
});
test("VM agent control server handles session.start commands through Codex adapter", async () => {
    const transport = new FakeCodexTransport();
    const sessionEvents = [];
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-session-start-"));
    const codexAdapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        transportFactory: () => transport,
    });
    const server = await startVmAgentControlServer({
        host: "127.0.0.1",
        port: 0,
        token: "secret",
        workspaceManager: new WorkspaceManager({ git: new FakeGitAdapter() }),
        codexAdapter,
        sessionEventSink: {
            async publishSessionEvent(event) {
                sessionEvents.push(event);
            },
        },
        now: () => new Date("2026-05-16T13:05:00.000Z"),
    });
    const payload = vmSessionStartPayload({
        layout: sessionLayout(tempDir),
    });
    try {
        const response = await fetch(`${server.baseUrl}/commands/session.start`, {
            method: "POST",
            headers: {
                authorization: "Bearer secret",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
                messageType: "session.start",
                commandId: payload.commandId,
                ts: "2026-05-16T13:00:00.000Z",
                data: payload,
            }),
        });
        const body = await response.json();
        assert.equal(response.status, 200);
        assert.equal(body.messageType, "session.started");
        assert.equal(body.commandId, payload.commandId);
        assert.equal(body.data.codexThreadId, "thread-1");
        assert.equal(body.data.codexTurnId, "turn-1");
        transport.emit({
            method: "turn/completed",
            params: { threadId: "thread-1", turn: { id: "turn-1", status: "completed" } },
        });
        await sleep(1);
        assert.deepEqual(sessionEvents.map((event) => event.eventType), [
            "thread.started",
            "turn.started",
            "turn.completed",
        ]);
    }
    finally {
        await server.close();
    }
});
test("VM agent control server handles runtime.ensure_image with the default Docker handler", async () => {
    const cli = new FakeDockerCli([dockerCliResult(0, "[]")]);
    const server = await startVmAgentControlServer({
        host: "127.0.0.1",
        port: 0,
        token: "secret",
        workspaceManager: new WorkspaceManager({ git: new FakeGitAdapter() }),
        dockerRuntime: new DockerRuntimeManager({ cli }),
    });
    try {
        const response = await fetch(`${server.baseUrl}/commands/runtime.ensure_image`, {
            method: "POST",
            headers: {
                authorization: "Bearer secret",
                "content-type": "application/json",
            },
            body: JSON.stringify({ image: OfficialCodexAppServerImage }),
        });
        const body = await response.json();
        assert.equal(response.status, 200);
        assert.equal(body.ok, true);
        assert.equal(body.command, "runtime.ensure_image");
        assert.equal(body.image, OfficialCodexAppServerImage);
        assert.equal(body.pulled, false);
        assert.deepEqual(cli.calls, [["image", "inspect", OfficialCodexAppServerImage]]);
    }
    finally {
        await server.close();
    }
});
test("VM agent control server exposes A3 local health metrics workspaces and container reap endpoints", async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-control-workspaces-"));
    const archiveRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-control-archive-"));
    const workspacePath = path.join(workspaceRoot, "experiment-a");
    await fs.mkdir(path.join(workspacePath, "workspace"), { recursive: true });
    await fs.mkdir(path.join(workspacePath, "artifacts"), { recursive: true });
    const cli = new FakeDockerCli([
        dockerCliResult(0, "old-one\told-session\nold-two\t\n"),
        dockerCliResult(0),
        dockerCliResult(0),
    ]);
    const server = await startVmAgentControlServer({
        host: "127.0.0.1",
        port: 0,
        token: "secret",
        workspaceRoot,
        archiveRoot,
        workspaceManager: new WorkspaceManager({ allowedRootPath: workspaceRoot, git: new FakeGitAdapter() }),
        dockerRuntime: new DockerRuntimeManager({ cli }),
        metricsReporter: new FakeMetricsReporter(),
    });
    try {
        const unauthorized = await fetch(`${server.baseUrl}/healthz`);
        assert.equal(unauthorized.status, 403);
        const headers = { authorization: "Bearer secret" };
        const healthResponse = await fetch(`${server.baseUrl}/healthz`, { headers });
        const healthBody = await healthResponse.json();
        assert.equal(healthResponse.status, 200);
        assert.equal(healthBody.status, "healthy");
        const metricsResponse = await fetch(`${server.baseUrl}/metrics`, { headers });
        const metricsBody = await metricsResponse.json();
        assert.equal(metricsResponse.status, 200);
        assert.equal(metricsBody.metrics?.system?.hostname, "vm-a");
        const workspacesResponse = await fetch(`${server.baseUrl}/workspaces`, { headers });
        const workspacesBody = await workspacesResponse.json();
        const workspaces = workspacesBody.workspaces ?? [];
        const directories = workspaces[0]?.directories;
        assert.equal(workspacesResponse.status, 200);
        assert.equal(workspaces[0]?.rootPath, workspacePath);
        assert.deepEqual(directories, {
            workspace: true,
            codexHome: false,
            artifacts: true,
            cache: false,
        });
        const reapResponse = await fetch(`${server.baseUrl}/containers/reap`, {
            method: "POST",
            headers,
        });
        const reapBody = await reapResponse.json();
        assert.equal(reapResponse.status, 200);
        assert.equal(reapBody.cleanup?.stopped, 2);
        assert.deepEqual(cli.calls, [
            ["ps", "-a", "--filter", "label=yp-live-workflow.managed_by=yp-live-workflow-vm-agent", "--format", "{{.Names}}\t{{.Label \"yp-live-workflow.session_id\"}}\t{{.State}}"],
            ["stop", "old-one"],
            ["stop", "old-two"],
        ]);
    }
    finally {
        await server.close();
    }
});
test("VM agent control server exposes Docker session status and termination endpoints", async () => {
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-control-terminate-"));
    const helperPath = path.join(rootPath, "workspace", "repo", ".git", "yp-live-workflow-github-credential-helper.sh");
    await fs.mkdir(path.dirname(helperPath), { recursive: true });
    await fs.writeFile(helperPath, "secret", "utf8");
    const cli = new FakeDockerCli();
    const transport = new FakeCodexTransport();
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        transportFactory: () => transport,
    });
    const codexAdapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
    });
    await codexAdapter.startSession({
        ...vmSessionStartPayload({
            layout: sessionLayout(rootPath),
            runtimeSnapshot: {
                ...vmSessionStartPayload().runtimeSnapshot,
                containerImage: OfficialCodexAppServerImage,
            },
        }),
        sensitiveHostPaths: [helperPath],
    });
    const server = await startVmAgentControlServer({
        host: "127.0.0.1",
        port: 0,
        token: "secret",
        workspaceManager: new WorkspaceManager({ git: new FakeGitAdapter() }),
        dockerRuntime,
        codexAdapter,
    });
    try {
        const statusResponse = await fetch(`${server.baseUrl}/status`, {
            headers: { authorization: "Bearer secret" },
        });
        const statusBody = await statusResponse.json();
        const statusSessions = statusBody.sessions;
        assert.equal(statusResponse.status, 200);
        assert.equal(statusSessions[0]?.sessionId, "session-id");
        const sessionsResponse = await fetch(`${server.baseUrl}/sessions`, {
            headers: { authorization: "Bearer secret" },
        });
        const sessionsBody = await sessionsResponse.json();
        const sessions = sessionsBody.sessions;
        assert.equal(sessionsResponse.status, 200);
        assert.equal(sessions[0]?.sessionId, "session-id");
        assert.equal(sessions[0]?.status, "running");
        const terminateResponse = await fetch(`${server.baseUrl}/sessions/session-id/terminate`, {
            method: "POST",
            headers: { authorization: "Bearer secret" },
        });
        const terminateBody = await terminateResponse.json();
        assert.equal(terminateResponse.status, 200);
        assert.equal(terminateBody.session?.status, "stopped");
        assert.equal(await pathExists(helperPath), false);
        assert.equal(transport.closeCount, 1);
        assert.equal(await codexAdapter.closeSession("session-id"), false);
        assert.deepEqual(cli.calls.filter((call) => call[0] !== "exec"), [
            ["image", "inspect", OfficialCodexAppServerImage],
            ["stop", "yp-live-workflow-session-session-id"],
            ["rm", "-f", "yp-live-workflow-session-session-id"],
        ]);
    }
    finally {
        await server.close();
    }
});
test("Aux terminal bridge opens a Docker container terminal target and captures backlog", async () => {
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-aux-terminal-root-"));
    await fs.mkdir(path.join(rootPath, "workspace"), { recursive: true });
    await fs.mkdir(path.join(rootPath, "artifacts"), { recursive: true });
    const cli = new FakeDockerCli([dockerCliResult(0)]);
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        transportFactory: () => new FakeCodexTransport(),
    });
    dockerRuntime.createCodexAppServerTransport({
        payload: vmSessionStartPayload({
            layout: sessionLayout(rootPath),
            runtimeSnapshot: {
                ...vmSessionStartPayload().runtimeSnapshot,
                containerImage: OfficialCodexAppServerImage,
            },
        }),
        env: {},
    });
    dockerRuntime.markSessionRunning("session-id");
    const session = dockerRuntime.getSession("session-id");
    assert.ok(session);
    const backend = new FakeAuxTerminalBackend();
    const terminal = new AuxTerminalBridge({
        enabled: true,
        shell: "/bin/bash",
        allowedRootPath: rootPath,
        backlogBytes: 4096,
        terminalBackend: backend,
    });
    try {
        const target = await dockerRuntime.createAuxTerminalTarget(session, {
            preferredShell: terminal.preferredShell,
        });
        const opened = await terminal.openTerminal("terminal-command-1", session, { cols: 100, rows: 30, target });
        assert.equal(opened.cwd, "/workspace");
        assert.equal(opened.shell, "/bin/bash");
        assert.equal(opened.runtime, "container");
        assert.equal(opened.cols, 100);
        assert.equal(opened.rows, 30);
        assert.equal(backend.spawns[0]?.command, "docker");
        assert.deepEqual(backend.spawns[0]?.args, [
            "exec",
            "-i",
            "-t",
            "--workdir",
            "/workspace",
            "--env",
            "TERM=xterm-256color",
            "--env",
            "YP_LIVE_WORKFLOW_SESSION_ID=session-id",
            "--env",
            "YP_LIVE_WORKFLOW_WORKSPACE_ROOT=/workspace",
            "yp-live-workflow-session-session-id",
            "/bin/bash",
        ]);
        assert.deepEqual(cli.calls, [["exec", "yp-live-workflow-session-session-id", "test", "-x", "/bin/bash"]]);
        assert.equal(backend.spawns[0]?.cwd, await fs.realpath(path.join(rootPath, "workspace")));
        terminal.writeInput("terminal-command-2", "session-id", opened.terminalId, "printf 'hello aux\\n'\n");
        await waitFor(() => {
            const chunks = terminal.backlog("session-id", opened.terminalId)?.chunks ?? [];
            return chunks.some((chunk) => chunk.data.includes("hello aux"));
        });
        const backlog = terminal.backlog("session-id", opened.terminalId);
        const chunks = backlog?.chunks ?? [];
        assert.equal(chunks.at(-1)?.stream, "stdout");
        assert.match(chunks.map((chunk) => chunk.data).join(""), /hello aux/);
        const resized = terminal.resizeTerminal("terminal-command-3", "session-id", opened.terminalId, 80, 24);
        assert.equal(resized.cols, 80);
        assert.equal(resized.rows, 24);
        const closed = terminal.closeTerminal("terminal-command-4", "session-id", opened.terminalId);
        assert.equal(closed.ok, true);
    }
    finally {
        await terminal.closeAll();
    }
});
test("Docker runtime resolves aux terminal shell with configured shell then bash then sh", async () => {
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-aux-terminal-shell-"));
    await fs.mkdir(path.join(rootPath, "workspace"), { recursive: true });
    const cli = new FakeDockerCli([
        dockerCliResult(1, "", "missing custom shell"),
        dockerCliResult(1, "", "missing bash"),
        dockerCliResult(0),
    ]);
    const dockerRuntime = new DockerRuntimeManager({
        cli,
        transportFactory: () => new FakeCodexTransport(),
    });
    dockerRuntime.createCodexAppServerTransport({
        payload: vmSessionStartPayload({
            layout: sessionLayout(rootPath),
            runtimeSnapshot: {
                ...vmSessionStartPayload().runtimeSnapshot,
                containerImage: OfficialCodexAppServerImage,
            },
        }),
        env: {},
    });
    dockerRuntime.markSessionRunning("session-id");
    const session = dockerRuntime.getSession("session-id");
    assert.ok(session);
    const target = await dockerRuntime.createAuxTerminalTarget(session, { preferredShell: "/custom/shell" });
    assert.equal(target.shell, "/bin/sh");
    assert.deepEqual(cli.calls, [
        ["exec", "yp-live-workflow-session-session-id", "test", "-x", "/custom/shell"],
        ["exec", "yp-live-workflow-session-session-id", "test", "-x", "/bin/bash"],
        ["exec", "yp-live-workflow-session-session-id", "test", "-x", "/bin/sh"],
    ]);
});
test("Docker runtime rejects aux terminals for non-running sessions", async () => {
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-aux-terminal-nonrunning-"));
    await fs.mkdir(path.join(rootPath, "workspace"), { recursive: true });
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        transportFactory: () => new FakeCodexTransport(),
    });
    dockerRuntime.createCodexAppServerTransport({
        payload: vmSessionStartPayload({
            layout: sessionLayout(rootPath),
            runtimeSnapshot: {
                ...vmSessionStartPayload().runtimeSnapshot,
                containerImage: OfficialCodexAppServerImage,
            },
        }),
        env: {},
    });
    const session = dockerRuntime.getSession("session-id");
    assert.ok(session);
    await assert.rejects(dockerRuntime.createAuxTerminalTarget(session), /must be running/);
});
test("Aux terminal bridge rejects workspace paths outside the trusted root", async () => {
    const trustedRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-aux-terminal-trusted-"));
    const outsideRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-aux-terminal-outside-"));
    await fs.mkdir(path.join(outsideRoot, "workspace"), { recursive: true });
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        transportFactory: () => new FakeCodexTransport(),
    });
    dockerRuntime.createCodexAppServerTransport({
        payload: vmSessionStartPayload({
            layout: sessionLayout(outsideRoot),
            runtimeSnapshot: {
                ...vmSessionStartPayload().runtimeSnapshot,
                containerImage: OfficialCodexAppServerImage,
            },
        }),
        env: {},
    });
    const session = dockerRuntime.getSession("session-id");
    assert.ok(session);
    const terminal = new AuxTerminalBridge({
        enabled: true,
        shell: "/bin/sh",
        allowedRootPath: trustedRoot,
    });
    await assert.rejects(terminal.openTerminal("terminal-command-1", session), /outside the trusted VM workspace root/);
});
test("VM agent control server handles aux terminal commands and backlog polling", async () => {
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-control-aux-terminal-"));
    await fs.mkdir(path.join(rootPath, "workspace"), { recursive: true });
    await fs.mkdir(path.join(rootPath, "artifacts"), { recursive: true });
    const dockerRuntime = new DockerRuntimeManager({
        cli: new FakeDockerCli(),
        transportFactory: () => new FakeCodexTransport(),
    });
    dockerRuntime.createCodexAppServerTransport({
        payload: vmSessionStartPayload({
            layout: sessionLayout(rootPath),
            runtimeSnapshot: {
                ...vmSessionStartPayload().runtimeSnapshot,
                containerImage: OfficialCodexAppServerImage,
            },
        }),
        env: {},
    });
    dockerRuntime.markSessionRunning("session-id");
    const backend = new FakeAuxTerminalBackend();
    const auxTerminalBridge = new AuxTerminalBridge({
        enabled: true,
        shell: "/bin/sh",
        allowedRootPath: rootPath,
        terminalBackend: backend,
    });
    const server = await startVmAgentControlServer({
        host: "127.0.0.1",
        port: 0,
        token: "secret",
        workspaceRoot: rootPath,
        workspaceManager: new WorkspaceManager({ allowedRootPath: rootPath, git: new FakeGitAdapter() }),
        dockerRuntime,
        auxTerminalBridge,
    });
    const headers = {
        authorization: "Bearer secret",
        "content-type": "application/json",
    };
    try {
        const openResponse = await fetch(`${server.baseUrl}/commands/session.aux_terminal.open`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
                messageType: "session.aux_terminal.open",
                commandId: "terminal-command-1",
                ts: "2026-05-16T13:00:00.000Z",
                data: {
                    commandId: "terminal-command-1",
                    sessionId: "session-id",
                    cols: 100,
                    rows: 30,
                },
            }),
        });
        const opened = await openResponse.json();
        const terminalId = String(opened.terminalId);
        assert.equal(openResponse.status, 200);
        assert.equal(opened.sessionId, "session-id");
        assert.equal(opened.cwd, "/workspace");
        assert.equal(opened.runtime, "container");
        assert.equal(backend.spawns[0]?.command, "docker");
        const inputResponse = await fetch(`${server.baseUrl}/commands/session.aux_terminal.input`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
                messageType: "session.aux_terminal.input",
                commandId: "terminal-command-2",
                ts: "2026-05-16T13:00:00.000Z",
                data: {
                    commandId: "terminal-command-2",
                    sessionId: "session-id",
                    terminalId,
                    data: "printf 'control aux\\n'\n",
                },
            }),
        });
        assert.equal(inputResponse.status, 200);
        await waitFor(async () => {
            const response = await fetch(`${server.baseUrl}/sessions/session-id/aux-terminal/${terminalId}/backlog`, {
                headers: { authorization: "Bearer secret" },
            });
            const body = await response.json();
            const chunks = body.chunks;
            return chunks.some((chunk) => String(chunk.data).includes("control aux"));
        });
        const resizeResponse = await fetch(`${server.baseUrl}/commands/session.aux_terminal.resize`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
                messageType: "session.aux_terminal.resize",
                commandId: "terminal-command-3",
                ts: "2026-05-16T13:00:00.000Z",
                data: {
                    commandId: "terminal-command-3",
                    sessionId: "session-id",
                    terminalId,
                    cols: 80,
                    rows: 24,
                },
            }),
        });
        const resized = await resizeResponse.json();
        assert.equal(resizeResponse.status, 200);
        assert.equal(resized.cols, 80);
        assert.equal(resized.rows, 24);
        const closeResponse = await fetch(`${server.baseUrl}/commands/session.aux_terminal.close`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
                messageType: "session.aux_terminal.close",
                commandId: "terminal-command-4",
                ts: "2026-05-16T13:00:00.000Z",
                data: {
                    commandId: "terminal-command-4",
                    sessionId: "session-id",
                    terminalId,
                },
            }),
        });
        const closed = await closeResponse.json();
        assert.equal(closeResponse.status, 200);
        assert.equal(closed.ok, true);
    }
    finally {
        await server.close();
    }
});
test("VM agent control server archives Docker sessions under the archive root", async () => {
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-session-archive-root-"));
    const archiveRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-session-archive-target-"));
    await fs.mkdir(path.join(rootPath, "workspace"), { recursive: true });
    await fs.writeFile(path.join(rootPath, "workspace", "result.txt"), "result", "utf8");
    const cli = new FakeDockerCli();
    const transport = new FakeCodexTransport();
    const authMaterialUpdates = [];
    const dockerRuntime = new DockerRuntimeManager({
        archiveRoot,
        cli,
        transportFactory: () => transport,
    });
    const codexAdapter = new CodexAdapter({
        env: { OPENAI_API_KEY: "test-key" },
        dockerRuntime,
        authMaterialUpdateSink: {
            async publishCodexAuthMaterialUpdated(payload) {
                authMaterialUpdates.push(payload);
            },
        },
    });
    await codexAdapter.startSession(vmSessionStartPayload({
        layout: sessionLayout(rootPath),
        auth: chatGptWithApiFallbackAuth(),
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
    }));
    const server = await startVmAgentControlServer({
        host: "127.0.0.1",
        port: 0,
        token: "secret",
        workspaceManager: new WorkspaceManager({ git: new FakeGitAdapter() }),
        dockerRuntime,
        codexAdapter,
    });
    try {
        const archiveResponse = await fetch(`${server.baseUrl}/sessions/session-id/archive`, {
            method: "POST",
            headers: { authorization: "Bearer secret" },
        });
        const archiveBody = await archiveResponse.json();
        const archivePath = archiveBody.session?.archivePath;
        assert.equal(archiveResponse.status, 200);
        assert.equal(archiveBody.session?.status, "archived");
        assert.ok(archivePath);
        assert.equal(await fs.readFile(path.join(archivePath, "workspace", "result.txt"), "utf8"), "result");
        assert.equal(transport.closeCount, 1);
        assert.equal(await codexAdapter.closeSession("session-id"), false);
        assert.equal(authMaterialUpdates.length, 0);
        const authPrepareIndex = cli.calls.findIndex((call) => call[0] === "exec" &&
            call[1] === "yp-live-workflow-session-session-id" &&
            call[4] === "[ ! -e /codex-home/auth.json ] || chmod a+r /codex-home/auth.json");
        const stopIndex = cli.calls.findIndex((call) => call[0] === "stop" && call[1] === "yp-live-workflow-session-session-id");
        const removeIndex = cli.calls.findIndex((call) => call[0] === "rm" &&
            call[1] === "-f" &&
            call[2] === "yp-live-workflow-session-session-id");
        assert.deepEqual(cli.calls[0], ["image", "inspect", OfficialCodexAppServerImage]);
        assert.ok(authPrepareIndex > 0);
        assert.ok(stopIndex > authPrepareIndex);
        assert.ok(removeIndex > stopIndex);
    }
    finally {
        await server.close();
    }
});
test("Docker runtime treats already archived sessions as idempotent archive success", async () => {
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-session-archive-retry-root-"));
    const archiveRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-session-archive-retry-target-"));
    await fs.mkdir(path.join(rootPath, "workspace"), { recursive: true });
    await fs.writeFile(path.join(rootPath, "workspace", "result.txt"), "result", "utf8");
    const cli = new FakeDockerCli();
    const dockerRuntime = new DockerRuntimeManager({
        archiveRoot,
        cli,
        transportFactory: () => new FakeCodexTransport(),
    });
    dockerRuntime.createCodexAppServerTransport({
        payload: vmSessionStartPayload({
            layout: sessionLayout(rootPath),
            runtimeSnapshot: {
                ...vmSessionStartPayload().runtimeSnapshot,
                containerImage: OfficialCodexAppServerImage,
            },
        }),
        env: {},
    });
    dockerRuntime.markSessionRunning("session-id");
    const firstArchive = await dockerRuntime.archiveSession("session-id");
    const secondArchive = await dockerRuntime.archiveSession("session-id");
    assert.equal(firstArchive?.status, "archived");
    assert.equal(secondArchive?.status, "archived");
    assert.equal(secondArchive?.archivePath, firstArchive?.archivePath);
    assert.deepEqual(cli.calls, [
        ["stop", "yp-live-workflow-session-session-id"],
        ["rm", "-f", "yp-live-workflow-session-session-id"],
    ]);
});
test("Docker runtime stops paused warm containers before archiving", async () => {
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-session-archive-paused-root-"));
    const archiveRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-session-archive-paused-target-"));
    await fs.mkdir(path.join(rootPath, "workspace"), { recursive: true });
    await fs.writeFile(path.join(rootPath, "workspace", "result.txt"), "result", "utf8");
    const cli = new FakeDockerCli();
    const dockerRuntime = new DockerRuntimeManager({
        archiveRoot,
        cli,
        transportFactory: () => new FakeCodexTransport(),
    });
    dockerRuntime.createCodexAppServerTransport({
        payload: vmSessionStartPayload({
            layout: sessionLayout(rootPath),
            runtimeSnapshot: {
                ...vmSessionStartPayload().runtimeSnapshot,
                containerImage: OfficialCodexAppServerImage,
            },
        }),
        env: {},
    });
    dockerRuntime.markSessionPaused("session-id");
    const archived = await dockerRuntime.archiveSession("session-id");
    assert.equal(archived?.status, "archived");
    assert.equal(await fs.readFile(path.join(archived?.archivePath ?? "", "workspace", "result.txt"), "utf8"), "result");
    assert.deepEqual(cli.calls, [
        ["stop", "yp-live-workflow-session-session-id"],
        ["rm", "-f", "yp-live-workflow-session-session-id"],
    ]);
});
test("Docker runtime archives workspace roots without external sensitive Codex auth homes", async () => {
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-session-archive-auth-root-"));
    const sensitiveRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-session-archive-auth-home-"));
    const archiveRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-session-archive-auth-target-"));
    const externalCodexHome = path.join(sensitiveRoot, "codex-home");
    await fs.mkdir(path.join(rootPath, "workspace"), { recursive: true });
    await fs.mkdir(externalCodexHome, { recursive: true });
    await fs.writeFile(path.join(rootPath, "workspace", "result.txt"), "result", "utf8");
    await fs.writeFile(path.join(externalCodexHome, "auth.json"), JSON.stringify({ token: "stored" }), "utf8");
    const cli = new FakeDockerCli();
    const dockerRuntime = new DockerRuntimeManager({
        archiveRoot,
        cli,
        transportFactory: () => new FakeCodexTransport(),
    });
    dockerRuntime.createCodexAppServerTransport({
        payload: vmSessionStartPayload({
            layout: {
                ...sessionLayout(rootPath),
                codexHomePath: externalCodexHome,
            },
            runtimeSnapshot: {
                ...vmSessionStartPayload().runtimeSnapshot,
                containerImage: OfficialCodexAppServerImage,
            },
        }),
        env: {},
        sensitiveHostPaths: [sensitiveRoot],
    });
    dockerRuntime.markSessionRunning("session-id");
    const archived = await dockerRuntime.archiveSession("session-id");
    assert.equal(archived?.status, "archived");
    assert.equal(await fs.readFile(path.join(archived?.archivePath ?? "", "workspace", "result.txt"), "utf8"), "result");
    assert.equal(await pathExists(path.join(archived?.archivePath ?? "", "codex-home", "auth.json")), false);
    assert.equal(await pathExists(sensitiveRoot), false);
    assert.equal(cli.calls[0]?.[0], "exec");
    assert.ok(cli.calls[0]?.[4]?.includes("find /codex-home -xdev -type d"));
    assert.equal(cli.calls[0]?.[4]?.includes("chmod -R a+rwX /codex-home"), false);
    assert.deepEqual(cli.calls[1], ["stop", "yp-live-workflow-session-session-id"]);
    assert.deepEqual(cli.calls[2], ["rm", "-f", "yp-live-workflow-session-session-id"]);
});
test("Docker runtime reports sensitive Codex auth cleanup failures and preserves retry state", async () => {
    if (process.platform === "win32") {
        return;
    }
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-session-archive-auth-cleanup-root-"));
    const sensitiveRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-session-archive-auth-cleanup-home-"));
    const archiveRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-session-archive-auth-cleanup-target-"));
    const externalCodexHome = path.join(sensitiveRoot, "codex-home");
    await fs.mkdir(path.join(rootPath, "workspace"), { recursive: true });
    await fs.mkdir(externalCodexHome, { recursive: true });
    await fs.writeFile(path.join(rootPath, "workspace", "result.txt"), "result", "utf8");
    await fs.writeFile(path.join(externalCodexHome, "auth.json"), JSON.stringify({ token: "stored" }), "utf8");
    const cli = new FakeDockerCli();
    const dockerRuntime = new DockerRuntimeManager({
        archiveRoot,
        cli,
        transportFactory: () => new FakeCodexTransport(),
    });
    dockerRuntime.createCodexAppServerTransport({
        payload: vmSessionStartPayload({
            layout: {
                ...sessionLayout(rootPath),
                codexHomePath: externalCodexHome,
            },
            runtimeSnapshot: {
                ...vmSessionStartPayload().runtimeSnapshot,
                containerImage: OfficialCodexAppServerImage,
            },
        }),
        env: {},
        sensitiveHostPaths: [sensitiveRoot],
    });
    dockerRuntime.markSessionRunning("session-id");
    await fs.chmod(sensitiveRoot, 0o500);
    const originalConsoleError = console.error;
    console.error = () => undefined;
    try {
        await assert.rejects(dockerRuntime.archiveSession("session-id"), /EACCES|EPERM|ENOTEMPTY|permission denied/i);
        assert.notEqual(dockerRuntime.getSession("session-id")?.status, "archived");
        assert.equal(await pathExists(sensitiveRoot), true);
        await fs.chmod(sensitiveRoot, 0o700);
        const archived = await dockerRuntime.archiveSession("session-id");
        assert.equal(archived?.status, "archived");
        assert.equal(await pathExists(sensitiveRoot), false);
        assert.equal(await fs.readFile(path.join(archived?.archivePath ?? "", "workspace", "result.txt"), "utf8"), "result");
        assert.equal(await pathExists(path.join(archived?.archivePath ?? "", "codex-home", "auth.json")), false);
    }
    finally {
        console.error = originalConsoleError;
        await fs.chmod(sensitiveRoot, 0o700).catch(() => undefined);
        await fs.rm(sensitiveRoot, { recursive: true, force: true }).catch(() => undefined);
        await fs.rm(rootPath, { recursive: true, force: true }).catch(() => undefined);
        await fs.rm(archiveRoot, { recursive: true, force: true }).catch(() => undefined);
    }
});
test("Docker runtime does not archive a running session when container stop fails", async () => {
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-session-archive-stop-root-"));
    const archiveRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-session-archive-stop-target-"));
    await fs.mkdir(path.join(rootPath, "workspace"), { recursive: true });
    const dockerRuntime = new DockerRuntimeManager({
        archiveRoot,
        cli: new FakeDockerCli([dockerCliResult(1, "", "permission denied")]),
        transportFactory: () => new FakeCodexTransport(),
    });
    dockerRuntime.createCodexAppServerTransport({
        payload: vmSessionStartPayload({
            layout: sessionLayout(rootPath),
            runtimeSnapshot: {
                ...vmSessionStartPayload().runtimeSnapshot,
                containerImage: OfficialCodexAppServerImage,
            },
        }),
        env: {},
    });
    dockerRuntime.markSessionRunning("session-id");
    await assert.rejects(dockerRuntime.archiveSession("session-id"), /permission denied/);
    assert.equal(dockerRuntime.getSession("session-id")?.status, "failed");
    await assert.rejects(fs.access(path.join(archiveRoot, "workspace-id", "session-id")), /ENOENT/);
});
test("VM agent control server dispatches registered command handlers", async () => {
    const handler = {
        path: "/commands/runtime.ensure_image",
        async handle(body) {
            return {
                ok: true,
                command: "runtime.ensure_image",
                body,
            };
        },
    };
    const server = await startVmAgentControlServer({
        host: "127.0.0.1",
        port: 0,
        token: "secret",
        workspaceManager: new WorkspaceManager({ git: new FakeGitAdapter() }),
        commandHandlers: [handler],
    });
    try {
        const response = await fetch(`${server.baseUrl}/commands/runtime.ensure_image`, {
            method: "POST",
            headers: {
                authorization: "Bearer secret",
                "content-type": "application/json",
            },
            body: JSON.stringify({ image: "researcher-runtime:latest" }),
        });
        const body = await response.json();
        assert.equal(response.status, 200);
        assert.equal(body.command, "runtime.ensure_image");
        assert.deepEqual(body.body, { image: "researcher-runtime:latest" });
    }
    finally {
        await server.close();
    }
});
test("VM agent control server accepts large dataset validation command payloads", async () => {
    const handler = {
        path: "/commands/dataset.validate",
        async handle(body) {
            return {
                ok: true,
                payloadSize: typeof body.payload === "string"
                    ? body.payload.length
                    : 0,
            };
        },
    };
    const server = await startVmAgentControlServer({
        host: "127.0.0.1",
        port: 0,
        token: "secret",
        workspaceManager: new WorkspaceManager({ git: new FakeGitAdapter() }),
        commandHandlers: [handler],
    });
    const payload = "x".repeat(1250000);
    try {
        const response = await fetch(`${server.baseUrl}/commands/dataset.validate`, {
            method: "POST",
            headers: {
                authorization: "Bearer secret",
                "content-type": "application/json",
            },
            body: JSON.stringify({ payload }),
        });
        const body = await response.json();
        assert.equal(response.status, 200);
        assert.equal(body.ok, true);
        assert.equal(body.payloadSize, payload.length);
    }
    finally {
        await server.close();
    }
});
class FakeCodexTransport {
    constructor() {
        this.requests = [];
        this.notifications = [];
        this.serverResponses = [];
        this.serverRejections = [];
        this.requestErrors = new Map();
        this.accountType = "chatgpt";
        this.rateLimitsResponse = { rateLimitsByLimitId: {} };
        this.reviewThreadId = "thread-1";
        this.reviewTurnId = "review-turn-1";
        this.deferReviewStartedNotification = false;
        this.suppressReviewStartedNotification = false;
        this.closeCount = 0;
        this.turnStartRequestCount = 0;
        this.handlers = new Set();
        this.exitHandlers = new Set();
        this.stderrHandlers = new Set();
    }
    async request(method, params) {
        this.requests.push({ method, params });
        await this.requestHook?.(method, params);
        const requestError = this.requestErrors.get(method);
        if (requestError) {
            throw requestError;
        }
        if (method === "initialize") {
            return { serverInfo: { name: "fake-codex", version: "0.143.0" } };
        }
        if (method === "account/login/start") {
            const record = params && typeof params === "object" && !Array.isArray(params)
                ? params
                : {};
            if (record.type === "chatgptDeviceCode") {
                this.accountType = "chatgpt";
                return {
                    loginId: "login-1",
                    verificationUrl: "https://auth.openai.com/codex/device",
                    userCode: "ABCD-EFGH",
                };
            }
            if (record.type === "chatgpt") {
                if (this.chatGptLoginError) {
                    throw this.chatGptLoginError;
                }
                this.accountType = "chatgpt";
                return { type: "chatgpt" };
            }
            this.accountType = "apiKey";
            return { type: "apiKey" };
        }
        if (method === "account/login/cancel") {
            return { cancelled: true };
        }
        if (method === "account/read") {
            if (this.accountReadStderr) {
                this.emitStderr(this.accountReadStderr);
            }
            await this.accountReadHook?.();
            return this.accountType === "chatgpt"
                ? { account: { type: "chatgpt", email: "user@example.com" }, requiresOpenaiAuth: true }
                : { account: { type: "apiKey" }, requiresOpenaiAuth: true };
        }
        if (method === "account/rateLimits/read") {
            await this.rateLimitsReadHook?.();
            return this.rateLimitsResponse;
        }
        if (method === "thread/start" || method === "thread/resume") {
            const request = params && typeof params === "object" && !Array.isArray(params)
                ? params
                : {};
            const threadId = method === "thread/resume" && typeof request.threadId === "string"
                ? request.threadId
                : "thread-1";
            this.emit({
                method: "thread/started",
                params: { thread: { id: threadId } },
            });
            return method === "thread/resume" && this.threadResumeResponse !== undefined
                ? this.threadResumeResponse
                : { thread: { id: threadId } };
        }
        if (method === "thread/fork") {
            this.emit({
                method: "thread/started",
                params: { thread: { id: "thread-forked-1" } },
            });
            return { thread: { id: "thread-forked-1" } };
        }
        if (method === "thread/settings/update") {
            return {};
        }
        if (method === "turn/start") {
            this.turnStartRequestCount += 1;
            const turnId = this.turnStartId ?? `turn-${this.turnStartRequestCount}`;
            this.emit({
                method: "turn/started",
                params: { threadId: "thread-1", turn: { id: turnId, status: "running" } },
            });
            await this.turnStartResponseHook?.(turnId);
            return { turn: { id: turnId } };
        }
        if (method === "turn/steer") {
            return { turn: { id: "turn-1" } };
        }
        if (method === "review/start") {
            const emitStarted = () => this.emit({
                method: "turn/started",
                params: { threadId: this.reviewThreadId, turn: { id: this.reviewTurnId, status: "running" } },
            });
            if (!this.suppressReviewStartedNotification) {
                if (this.deferReviewStartedNotification) {
                    setTimeout(emitStarted, 0);
                }
                else {
                    emitStarted();
                }
            }
            return { reviewThreadId: this.reviewThreadId, turn: { id: this.reviewTurnId } };
        }
        if (method === "turn/interrupt") {
            return { interrupted: true };
        }
        if (method === "thread/inject_items") {
            return { injected: true };
        }
        throw new Error(`Unexpected Codex request: ${method}`);
    }
    notify(method, params) {
        this.notifications.push({ method, params });
    }
    onNotification(handler) {
        this.handlers.add(handler);
    }
    onExit(handler) {
        this.exitHandlers.add(handler);
    }
    onStderr(handler) {
        this.stderrHandlers.add(handler);
    }
    respondToServerRequest(id, result) {
        this.serverResponses.push({ id, result });
    }
    rejectServerRequest(id, error) {
        this.serverRejections.push({ id, error });
    }
    async close() {
        this.closeCount += 1;
        return undefined;
    }
    emit(message) {
        for (const handler of this.handlers) {
            handler(message);
        }
    }
    emitExit(exit) {
        for (const handler of this.exitHandlers) {
            handler(exit);
        }
    }
    emitStderr(chunk) {
        for (const handler of this.stderrHandlers) {
            handler(chunk);
        }
    }
}
function sessionLayout(rootPath) {
    return {
        rootPath,
        workspacePath: path.join(rootPath, "workspace"),
        codexHomePath: path.join(rootPath, "codex-home"),
        artifactsPath: path.join(rootPath, "artifacts"),
        cachePath: path.join(rootPath, "cache"),
    };
}
function echoInitializeScript(stderrChunk) {
    return `
    const readline = require("node:readline");
    const lines = readline.createInterface({ input: process.stdin });
    lines.on("line", (line) => {
      const message = JSON.parse(line);
      if (message.method === "initialize") {
        process.stderr.write(${JSON.stringify(stderrChunk)});
        console.log(JSON.stringify({ id: message.id, result: { serverInfo: { name: "fake", version: "0.0.0" } } }));
      }
    });
  `;
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
function vmSessionStartPayload(overrides = {}) {
    return {
        commandId: "session-command-1",
        sessionId: "session-id",
        runId: "run-id",
        runStepId: "run-step-id",
        nodeId: "node-id",
        workspaceId: "workspace-id",
        vmHostId: "vm-host-id",
        runtimeProfileId: "runtime-profile-id",
        authProfileId: "auth-profile-id",
        layout: sessionLayout("/workspace/root"),
        runtimeSnapshot: {
            modelDefaults: { model: "gpt-test" },
            codexConfig: { approvalPolicy: "on-request" },
        },
        inputPayload: { objective: "Start codex" },
        auth: {
            provider: "openai",
            authMode: "codex_chatgpt_with_api_fallback",
            secretRef: "OPENAI_API_KEY",
            metadata: {
                openAiApiKeyMaterial: { apiKey: "test-key" },
            },
        },
        ...overrides,
    };
}
function chatGptWithApiFallbackAuth(apiKey = "fallback-key") {
    return {
        provider: "openai",
        authMode: "codex_chatgpt_with_api_fallback",
        secretRef: "OPENAI_API_KEY",
        metadata: {
            openAiApiKeyMaterial: { apiKey },
            codexAuthMaterial: {
                format: "codex_home_files_v1",
                files: [
                    {
                        path: "auth.json",
                        dataBase64: Buffer.from(JSON.stringify({ token: "stored" })).toString("base64"),
                        mode: 0o600,
                    },
                ],
            },
        },
    };
}
function dockerBackedChatGptPayload(overrides = {}) {
    return vmSessionStartPayload({
        initialTurnMode: "deferred",
        inputPayload: { objective: "Start codex", launchMode: "chief_managed" },
        runtimeSnapshot: {
            ...vmSessionStartPayload().runtimeSnapshot,
            containerImage: OfficialCodexAppServerImage,
        },
        auth: chatGptWithApiFallbackAuth(),
        ...overrides,
    });
}
function usageRoutingLane(result) {
    const record = result && typeof result === "object" && !Array.isArray(result)
        ? result
        : {};
    const routing = record.usageRouting && typeof record.usageRouting === "object" && !Array.isArray(record.usageRouting)
        ? record.usageRouting
        : {};
    return typeof routing.activeLane === "string" ? routing.activeLane : undefined;
}
function isChatGptAuthBackupCall(call) {
    return call[0] === "exec" &&
        call[4]?.includes("cp -f /codex-home/auth.json /codex-home/.yp-live-workflow/chatgpt-auth/auth.json") === true;
}
function isChatGptAuthRestoreCall(call) {
    return call[0] === "exec" &&
        call[4]?.includes("cp -f /codex-home/.yp-live-workflow/chatgpt-auth/auth.json /codex-home/auth.json") === true;
}
function restoreStoredChatGptOnAccountRead(transport) {
    transport.accountReadHook = () => {
        transport.accountType = "chatgpt";
    };
}
function testConfig() {
    return {
        apiBaseUrl: "http://127.0.0.1:3000",
        token: "secret",
        brokerEnabled: false,
        brokerWsUrl: "ws://127.0.0.1:3000/api/live-workflows/vm/ws",
        brokerReconnectMinMs: 1000,
        brokerReconnectMaxMs: 30000,
        statePath: "/tmp/yp-live-workflow-test-state.json",
        name: "vm-a",
        workspaceRoot: "/mnt/experiments",
        archiveRoot: "/mnt/archive",
        datasetsHotRoot: "/mnt/datasets-hot",
        datasetsLocalRoots: [],
        artifactPrefix: "artifacts",
        artifactUploadMaxBytes: 25 * 1024 * 1024,
        artifactCollectionMaxFiles: 25000,
        artifactCollectionMaxFileBytes: 25 * 1024 * 1024,
        artifactCollectionMaxTotalBytes: 250 * 1024 * 1024 * 1024,
        controlHost: "127.0.0.1",
        heartbeatIntervalMs: 999999,
        telemetryIntervalMs: 999999,
        maxCodexSessions: 8,
        consoleEventsEnabled: false,
        dockerBin: "docker",
        dockerRunUser: "0:0",
        dockerDropAllCapabilities: false,
        dockerNoNewPrivileges: false,
        codexServerRequestMode: "defer",
        dockerNetworkMode: "bridge",
        auxTerminalEnabled: false,
        auxTerminalBacklogBytes: 262144,
    };
}
class MemoryStateStore {
    constructor() {
        this.state = {};
    }
    async read() {
        return this.state;
    }
    async write(state) {
        this.state = state;
    }
}
class FakeMetricsReporter extends MetricsReporter {
    async collectSnapshot() {
        return {
            system: {
                hostname: "vm-a",
                platform: "linux",
                arch: "x64",
                cpuCount: 2,
                loadAverage: [0, 0, 0],
                uptimeSeconds: 1,
                totalMemoryBytes: 1000,
                freeMemoryBytes: 500,
            },
            volumes: [{ mountPath: "/mnt/experiments", role: "workspace", totalBytes: 1000, availableBytes: 900 }],
            telemetry: { gpu: { available: false } },
        };
    }
}
class FakeGpuMetricsReporter extends FakeMetricsReporter {
    async collectSnapshot() {
        const snapshot = await super.collectSnapshot();
        return {
            ...snapshot,
            telemetry: {
                ...snapshot.telemetry,
                gpu: {
                    available: true,
                    status: "ok",
                    deviceCount: 1,
                    utilizationPercent: 25,
                    devices: [{
                            index: 0,
                            uuid: "GPU-0",
                            name: "NVIDIA L4",
                            utilizationPercent: 25,
                            memoryUsedBytes: 1024,
                            memoryTotalBytes: 4096,
                        }],
                },
            },
        };
    }
}
class DelayedPeriodicMetricsReporter extends FakeMetricsReporter {
    constructor() {
        super(...arguments);
        this.collectionCount = 0;
        this.delayedSnapshotStartedResolve = () => undefined;
        this.delayedSnapshotStarted = new Promise((resolve) => {
            this.delayedSnapshotStartedResolve = resolve;
        });
    }
    async collectSnapshot() {
        this.collectionCount += 1;
        if (this.collectionCount <= 2) {
            return super.collectSnapshot();
        }
        if (!this.delayedSnapshot) {
            this.delayedSnapshotStartedResolve();
            this.delayedSnapshot = new Promise((resolve) => {
                this.delayedSnapshotResolve = resolve;
            });
        }
        return this.delayedSnapshot;
    }
    async waitForDelayedSnapshot() {
        await this.delayedSnapshotStarted;
    }
    resolveDelayedSnapshot() {
        void super.collectSnapshot().then((snapshot) => {
            this.delayedSnapshotResolve?.(snapshot);
        });
    }
}
class FakeGitAdapter {
    constructor() {
        this.calls = [];
    }
    async clone(repoUrl, workspacePath, options) {
        const credentialHelperPath = options?.credentialHelperPath?.trim() || null;
        this.calls.push(credentialHelperPath
            ? ["clone", repoUrl, workspacePath, credentialHelperPath]
            : ["clone", repoUrl, workspacePath]);
        await fs.mkdir(path.join(workspacePath, ".git"), { recursive: true });
    }
    async fetch(workspacePath) {
        this.calls.push(["fetch", workspacePath]);
    }
    async pull(workspacePath) {
        this.calls.push(["pull", workspacePath]);
    }
    async checkout(workspacePath, ref) {
        this.calls.push(["checkout", workspacePath, ref]);
    }
    async currentRef(workspacePath) {
        this.calls.push(["currentRef", workspacePath]);
        return "main";
    }
    async currentCommit(workspacePath) {
        this.calls.push(["currentCommit", workspacePath]);
        return "abc123";
    }
    async setRemoteUrl(workspacePath, remoteName, repoUrl) {
        this.calls.push(["setRemoteUrl", workspacePath, remoteName, repoUrl]);
    }
    async setLocalConfig(workspacePath, key, value, options) {
        this.calls.push(options?.allowUnsafeCredentialHelper
            ? ["setLocalConfig", workspacePath, key, value, "allowUnsafeCredentialHelper"]
            : ["setLocalConfig", workspacePath, key, value]);
    }
}
class FakeObjectStorage {
    constructor(files) {
        this.files = files;
        this.downloads = [];
    }
    async downloadPrefixToDirectory(uri, targetPath) {
        this.downloads.push({
            uri,
            targetPath: targetPath.replace(new RegExp(`\\.tmp-${process.pid}-\\d+$`), `.tmp-${process.pid}`),
        });
        for (const [relativePath, content] of Object.entries(this.files)) {
            const destination = path.join(targetPath, relativePath);
            await fs.mkdir(path.dirname(destination), { recursive: true });
            await fs.writeFile(destination, content);
        }
        return { objectCount: Object.keys(this.files).length };
    }
}
class FakeAuxTerminalBackend {
    constructor() {
        this.spawns = [];
        this.processes = [];
    }
    spawn(options) {
        const process = new FakeAuxTerminalProcess();
        this.spawns.push(options);
        this.processes.push(process);
        return process;
    }
}
class FakeAuxTerminalProcess {
    constructor() {
        this.pid = 1234;
        this.writes = [];
        this.resizes = [];
        this.dataHandlers = new Set();
        this.exitHandlers = new Set();
    }
    write(data) {
        this.writes.push(data);
        this.emitData(data);
    }
    resize(cols, rows) {
        this.resizes.push({ cols, rows });
    }
    kill(signal) {
        this.emitExit({ exitCode: null, signal: signal ?? "SIGHUP" });
    }
    onData(handler) {
        this.dataHandlers.add(handler);
    }
    onExit(handler) {
        this.exitHandlers.add(handler);
    }
    emitData(data) {
        for (const handler of this.dataHandlers) {
            handler(data);
        }
    }
    emitExit(exit) {
        for (const handler of this.exitHandlers) {
            handler(exit);
        }
    }
}
class FakeDockerCli {
    constructor(results = []) {
        this.results = results;
        this.calls = [];
        this.runOptions = [];
    }
    async run(args, options = {}) {
        this.calls.push(args);
        this.runOptions.push(options);
        return this.results.shift() ?? dockerCliResult(0);
    }
}
function dockerCliResult(exitCode, stdout = "", stderr = "") {
    return {
        exitCode,
        signal: null,
        stdout,
        stderr,
        timedOut: false,
    };
}
async function waitFor(predicate, timeoutMs = 1000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        if (await predicate()) {
            return;
        }
        await sleep(10);
    }
    assert.fail("Timed out waiting for condition");
}
async function sha256(content) {
    return createHash("sha256").update(content).digest("hex");
}
async function runCredentialHelper(helperPath, input) {
    const child = spawnChildProcess(helperPath, ["get"], {
        stdio: ["pipe", "pipe", "pipe"],
    });
    const stdoutChunks = [];
    const stderrChunks = [];
    child.stdout.on("data", (chunk) => stdoutChunks.push(Buffer.from(chunk)));
    child.stderr.on("data", (chunk) => stderrChunks.push(Buffer.from(chunk)));
    child.stdin.end(input);
    const exitCode = await new Promise((resolve, reject) => {
        child.on("error", reject);
        child.on("close", resolve);
    });
    if (exitCode !== 0) {
        throw new Error(`Credential helper exited with ${String(exitCode)}: ${Buffer.concat(stderrChunks).toString("utf8")}`);
    }
    return Buffer.concat(stdoutChunks).toString("utf8");
}
function expectedGitHubCloneCredentialHelperPath(rootPath, githubFolder) {
    const cacheKey = createHash("sha256")
        .update(githubFolder.repositoryFullName)
        .update("\0")
        .update(githubFolder.repoDirectoryName)
        .update("\0")
        .update(githubFolder.branchName)
        .digest("hex")
        .slice(0, 16);
    return path.join(rootPath, "cache", "github-credential-helpers", `github-folder-${cacheKey}.sh`);
}
function fakeDockerRuntime(available, version = null) {
    return new DockerRuntimeManager({
        cli: new FakeDockerCli([available ? dockerCliResult(0, version ?? "") : dockerCliResult(1, "", "unavailable")]),
        transportFactory: () => new FakeCodexTransport(),
    });
}
function workspacePreparePayload(rootPath, overrides = {}) {
    return {
        commandId: "command-1",
        auditContext: {
            commandId: "command-1",
            requestedByUserId: 13,
            groupId: "42",
            experimentId: "experiment-id",
            workspaceId: "workspace-id",
            vmHostId: "vm-host-id",
            requestedAt: "2026-05-16T13:00:00.000Z",
        },
        workspaceId: "workspace-id",
        vmHostId: "vm-host-id",
        rootPath,
        ...overrides,
    };
}
