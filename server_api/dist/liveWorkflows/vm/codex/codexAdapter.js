import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { codexRetryClassification, codexSessionEventWillRetry, } from "../../contracts/index.js";
import { normalizeCodexNotification, publishSessionEvent, } from "./appServerEvents.js";
import { codexUserInputs, extractReviewThreadId, extractThreadId, extractTurnId, threadForkParams, threadParams, threadResumeParams, turnStartParams, turnParams, } from "./appServerRequests.js";
import { StdioCodexAppServerTransport, } from "./appServerTransport.js";
import { DefaultCodexAppServerArgs } from "./codexAppServerDefaults.js";
import { defaultCodexCommand } from "./codexBinary.js";
import { resolveAuthEnvironment } from "./codexAuth.js";
import { archiveCodexAuthMaterial, codexAuthMaterialFingerprintSha256, materializeCodexAuthMaterial, } from "./codexAuthMaterial.js";
import { jsonRecord } from "./jsonUtils.js";
import { DockerRuntimeManager, } from "../docker/dockerRuntimeManager.js";
import { DatasetManager } from "../datasets/datasetManager.js";
const CodexVersion = "0.146.0";
const DefaultAuthLoginCompleteTimeoutMs = 10000;
const AuthLoginPollIntervalMs = 500;
const ChatGptReturnProbeDelayMsEnv = "YP_LIVE_WORKFLOW_CODEX_CHATGPT_RETURN_PROBE_DELAY_MS";
const DefaultChatGptReturnProbeDelayMs = 15 * 60 * 1000;
const ChatGptReturnProbeResetBufferMs = 60 * 1000;
const MaxChatGptReturnProbeFailureBackoffMs = 6 * 60 * 60 * 1000;
const CodexRetryInitialDelayMsEnv = "YP_LIVE_WORKFLOW_CODEX_RETRY_INITIAL_DELAY_MS";
const CodexRetryMaxDelayMsEnv = "YP_LIVE_WORKFLOW_CODEX_RETRY_MAX_DELAY_MS";
const DefaultCodexRetryInitialDelayMs = 5000;
const DefaultCodexRetryMaxDelayMs = 15 * 60 * 1000;
const CodexRetryActiveTurnPollMs = 250;
const CodexChatGptAuthInvalidCode = "codex_chatgpt_auth_invalid";
const CodexChatGptAuthInvalidMessage = "Your ChatGPT Codex login has expired. Please sign in to ChatGPT again before launching or continuing this experiment.";
const CodexChatGptAuthMaterialInvalidMessage = "Codex ChatGPT login produced OpenAI API key auth material";
const CodexChatGptLoginPendingMessage = "Timed out waiting for Codex ChatGPT login completion";
const CodexAppServerExitedCode = "codex_app_server_exited";
const UsageRoutingUnavailableMessages = {
    chatgpt_quota_no_api_fallback: "ChatGPT quota was reached and no OpenAI API fallback is configured.",
    chatgpt_auth_invalid_api_fallback_active: "ChatGPT login expired; the session is continuing with the OpenAI API fallback until ChatGPT is reconnected.",
    api_fallback_login_failed: "OpenAI API fallback could not be used. Check the configured API key.",
    openai_api_quota_reached: "OpenAI API fallback quota was reached.",
    openai_api_auth_failed: "OpenAI API fallback could not be used. Check the configured API key.",
    primary_openai_api_quota_reached: "OpenAI API quota was reached.",
    primary_openai_api_auth_failed: "OpenAI API key could not be used. Check the configured API key.",
};
export class CodexSessionNotActiveError extends Error {
    constructor(sessionId) {
        super(`Codex session is not warm: ${sessionId}`);
        this.name = "CodexSessionNotActiveError";
    }
}
export class CodexAdapter {
    constructor(options = {}) {
        this.supportedCommands = [
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
        ];
        this.sessions = new Map();
        this.authLogins = new Map();
        this.authProfileLocks = new Map();
        this.sessionOperationLocks = new Map();
        this.env = options.env ?? process.env;
        this.resolveAuth = options.resolveAuth ?? resolveAuthEnvironment;
        this.transportFactory =
            options.transportFactory ??
                (options.codexCommand || options.codexArgs
                    ? (launchOptions) => new StdioCodexAppServerTransport({
                        ...launchOptions,
                        command: options.codexCommand ?? defaultCodexCommand(),
                        args: options.codexArgs ?? [...DefaultCodexAppServerArgs],
                        serverRequestMode: options.serverRequestMode ?? "defer",
                    })
                    : undefined);
        this.dockerRuntime =
            options.dockerRuntime ??
                new DockerRuntimeManager({
                    dockerBin: options.dockerBin,
                    defaultImage: options.containerImage,
                    defaultNetworkMode: options.dockerNetworkMode,
                    allowedImages: options.allowedImages,
                });
        this.codexCommand = options.codexCommand;
        this.codexArgs = options.codexArgs;
        this.serverRequestMode = options.serverRequestMode ?? "defer";
        this.datasetManager = options.datasetManager ?? new DatasetManager();
        this.consoleEventSink = options.consoleEventSink;
        this.authMaterialUpdateSink = options.authMaterialUpdateSink;
        this.chatGptReturnProbeDelayMs = chatGptReturnProbeDelayMsFromEnv(this.env);
        this.retryInitialDelayMs = positiveIntegerEnv(this.env, CodexRetryInitialDelayMsEnv, DefaultCodexRetryInitialDelayMs);
        this.retryMaxDelayMs = Math.max(this.retryInitialDelayMs, positiveIntegerEnv(this.env, CodexRetryMaxDelayMsEnv, DefaultCodexRetryMaxDelayMs));
        this.retryRandom = options.retryRandom ?? Math.random;
    }
    async startSession(payload, options = {}) {
        const auth = this.resolveAuth(payload.auth, this.env);
        const events = [];
        let materializedAuth = null;
        let transport = null;
        let state = null;
        try {
            materializedAuth = await this.materializeAuth(auth, payload.layout.codexHomePath);
            const authMaterialBaseFingerprintSha256 = auth.codexAuthMaterial
                ? (normalizedSha256(auth.codexAuthMaterialFingerprintSha256) ??
                    codexAuthMaterialFingerprintSha256(auth.codexAuthMaterial))
                : null;
            const launchPayload = materializedAuth.codexHomePath
                ? withCodexHomePath(payload, materializedAuth.codexHomePath)
                : payload;
            const launched = await this.launchTransport(launchPayload, auth.env, materializedAuth.sensitiveAuthRootPath, materializedAuth.durableSessionsPath);
            transport = launched.transport;
            state = {
                transport,
                status: "active",
                sessionPayload: payload,
                auth,
                activeLane: auth.codexAuthMaterial &&
                    authMaterialCanPublishAsChatGpt(auth.codexAuthMaterial)
                    ? "chatgpt_plan"
                    : "openai_api",
                codexCwd: launched.codexCwd,
                resolvedNetworkMode: launched.networkMode ?? null,
                codexThreadId: payload.codexThreadId ?? null,
                codexTurnId: null,
                activeTurnThreadId: null,
                completedTurnIds: new Set(),
                pendingTurnBillingContexts: [],
                turnBillingContexts: new Map(),
                threadBillingContexts: new Map(),
                threadRequestedServiceTiers: new Map(),
                detachedReviewThreadIds: new Set(),
                chatGptAuthInvalidReason: null,
                chatGptAuthInvalidPublished: false,
                lastChatGptFallbackAt: null,
                nextChatGptProbeAt: null,
                chatGptReturnProbeFailureCount: 0,
                apiFallbackRestoreRequired: false,
                transportRelaunchRequired: false,
                transportAuthRestoreRequired: false,
                transportClosedForRelaunch: false,
                threadResumeRequired: false,
                coldThreadRestorePending: Boolean(payload.codexThreadId),
                idleThreadRestorePending: false,
                usageRoutingUnavailablePublishedReasons: new Set(),
                pausedAt: null,
                nextEventSeq: 0,
                eventStreamId: randomUUID(),
                pendingApprovalRequests: new Map(),
                resolvedApprovalRequestKeys: new Set(),
                staleApprovalRequestKeys: new Set(),
                sensitiveAuthRootPath: materializedAuth.sensitiveAuthRootPath ?? null,
                authMaterialCodexHomePath: materializedAuth.codexHomePath ?? null,
                durableCodexSessionsPath: materializedAuth.durableSessionsPath ?? null,
                chatGptAuthMaterial: auth.codexAuthMaterial ?? null,
                authMaterialBaseFingerprintSha256,
                authMaterialLastPublishedFingerprintSha256: authMaterialBaseFingerprintSha256,
                logicalTurnRetry: null,
                detachedReviewRetry: null,
                pauseRetryInterruptPending: false,
                onEvent: options.onEvent,
            };
            const sessionState = state;
            this.sessions.set(payload.sessionId, sessionState);
            this.logAuthReady(payload, auth, sessionState.activeLane);
            this.attachSessionTransportHandlers(sessionState, events);
            await transport.request("initialize", {
                clientInfo: {
                    name: "yp-live-workflow-vm-agent",
                    title: "LiveWorkflow VM Agent",
                    version: "0.1.0",
                },
                capabilities: {
                    experimentalApi: true,
                },
            });
            transport.notify("initialized");
            this.dockerRuntime.markSessionRunning(payload.sessionId);
            await this.withSessionAuthProfileLock(sessionState, () => this.ensureAppServerAuth(sessionState));
            await this.tryPublishAuthMaterialUpdateIfChanged(sessionState, "account_read");
            this.throwIfChatGptAuthInvalid(sessionState);
            await this.readQuotaAndMaybeFallback(sessionState, "session_start");
            await this.tryPublishAuthMaterialUpdateIfChanged(sessionState, "session_start_quota");
            this.throwIfChatGptAuthInvalid(sessionState);
            const threadResponse = payload.codexThreadId
                ? await this.requestThreadWithChatGptAuthInvalidHandling(sessionState, "thread/resume", threadParams(payload, {
                    threadId: payload.codexThreadId,
                    cwd: launched.codexCwd,
                    persistExtendedHistory: payload.persistExtendedHistory ?? false,
                }))
                : await this.requestThreadWithChatGptAuthInvalidHandling(sessionState, "thread/start", threadParams(payload, { cwd: launched.codexCwd }));
            const codexThreadId = extractThreadId(threadResponse) ?? payload.codexThreadId;
            if (!codexThreadId) {
                throw new Error("Codex app-server did not return a thread id");
            }
            sessionState.codexThreadId = codexThreadId;
            this.finishColdThreadRestore(sessionState, threadResponse, codexThreadId);
            const initialTurnMode = payload.initialTurnMode ?? "start";
            let initialTurnRetryScheduled = false;
            let logicalTurnRetryRestored = false;
            const pendingLogicalTurnRetries = payload.pendingLogicalTurnRetries
                ?.length
                ? payload.pendingLogicalTurnRetries
                : payload.pendingLogicalTurnRetry
                    ? [payload.pendingLogicalTurnRetry]
                    : [];
            if (pendingLogicalTurnRetries.length > 0 &&
                initialTurnMode !== "deferred") {
                throw new Error("A restored logical turn retry requires a deferred initial turn");
            }
            if (initialTurnMode !== "deferred") {
                const initialTurnParams = {
                    ...turnParams(payload, {
                        cwd: launched.codexCwd,
                        resolvedNetworkMode: launched.networkMode,
                    }),
                    threadId: codexThreadId,
                };
                await this.readQuotaAndMaybeFallback(sessionState, "initial_turn_boundary");
                const logicalTurnRetry = this.beginLogicalTurn(sessionState, "turn/start", initialTurnParams);
                let initialTurnRequestSucceeded = false;
                try {
                    const turnResponse = await this.requestPhysicalTurn(sessionState, "turn/start", initialTurnParams, { logTurnStart: true });
                    initialTurnRequestSucceeded = true;
                    this.throwIfChatGptAuthInvalid(sessionState);
                    this.recordLogicalTurnStarted(sessionState, logicalTurnRetry, extractTurnId(turnResponse), codexThreadId);
                    await this.tryPublishAuthMaterialUpdateIfChanged(sessionState, "initial_turn_start");
                    this.throwIfChatGptAuthInvalid(sessionState);
                }
                catch (error) {
                    if (initialTurnRequestSucceeded) {
                        throw error;
                    }
                    initialTurnRetryScheduled = Boolean(this.scheduleLogicalTurnRetryForRequestFailure(sessionState, logicalTurnRetry, error));
                    if (!initialTurnRetryScheduled) {
                        throw error;
                    }
                }
            }
            sessionState.status = "active";
            sessionState.pausedAt = null;
            for (const pendingLogicalTurnRetry of pendingLogicalTurnRetries) {
                this.restoreLogicalTurnRetry(sessionState, pendingLogicalTurnRetry, codexThreadId);
                logicalTurnRetryRestored = true;
            }
            await this.tryPublishAuthMaterialUpdateIfChanged(sessionState, "session_started");
            const pendingLogicalTurnRetrySnapshots = this.pendingLogicalTurnRetrySnapshots(sessionState);
            const pendingLogicalTurnRetry = pendingLogicalTurnRetrySnapshots[0] ?? null;
            const startedCodexTurnId = sessionState.codexTurnId ?? null;
            return {
                commandId: payload.commandId,
                sessionId: payload.sessionId,
                workspaceId: payload.workspaceId,
                vmHostId: payload.vmHostId,
                codexThreadId,
                codexTurnId: startedCodexTurnId,
                vmEventStreamId: sessionState.eventStreamId,
                vmEventSeqBoundary: sessionState.nextEventSeq,
                pendingLogicalTurnRetry,
                pendingLogicalTurnRetries: pendingLogicalTurnRetrySnapshots,
                transport: "stdio",
                runtimeMetadata: {
                    codexVersion: CodexVersion,
                    transport: "stdio",
                    cwd: launched.codexCwd,
                    codexHomePath: launched.codexHomePath,
                    authProvider: auth.provider,
                    authMode: auth.authMode,
                    secretRef: auth.secretRef,
                    apiFallback: auth.apiFallback,
                    activeLane: sessionState.activeLane,
                    initialTurnMode,
                    initialTurnRetryScheduled,
                    logicalTurnRetryRestored,
                    ...launched.runtimeMetadata,
                },
                events,
            };
        }
        catch (error) {
            if (state) {
                this.publishCodexChatGptAuthInvalidIfNeeded(state, codexChatGptAuthInvalidReason(error));
                this.clearAllLogicalTurnRetries(state);
            }
            this.sessions.delete(payload.sessionId);
            await transport?.close().catch(() => undefined);
            await cleanupSensitiveAuthRootBestEffort(materializedAuth?.sensitiveAuthRootPath);
            this.dockerRuntime.markSessionFailed(payload.sessionId, error);
            throw error;
        }
    }
    async closeSession(sessionId) {
        const state = this.sessions.get(sessionId);
        if (!state) {
            return false;
        }
        this.sessions.delete(sessionId);
        this.clearAllLogicalTurnRetries(state);
        await this.tryPublishSessionEndAuthMaterialUpdateIfChanged(state, "session_close");
        await state.transport.close();
        await cleanupSensitiveAuthRoot(state.sensitiveAuthRootPath);
        return true;
    }
    async pauseSession(payload) {
        const state = this.requireSessionState(payload.sessionId);
        return this.withSessionOperationLock(state, async () => {
            const keepWarm = payload.keepWarm ?? true;
            const interruptActiveTurn = payload.interruptActiveTurn ?? true;
            const codexThreadId = payload.codexThreadId ?? state.codexThreadId ?? null;
            const retryPending = logicalTurnRetries(state).some((retry) => Boolean(retry.timer || retry.metadata));
            const codexTurnId = retryPending
                ? (state.codexTurnId ?? null)
                : (payload.codexTurnId ?? state.codexTurnId ?? null);
            const activeTurnThreadId = codexTurnId && (!state.codexTurnId || state.codexTurnId === codexTurnId)
                ? (state.activeTurnThreadId ?? codexThreadId)
                : codexThreadId;
            let interrupted = false;
            if (!keepWarm &&
                !interruptActiveTurn &&
                activeTurnThreadId &&
                codexTurnId) {
                throw new Error("Codex session has an active turn; refusing to close it without interruption");
            }
            if (interruptActiveTurn && activeTurnThreadId && codexTurnId) {
                const suspendedRetryForInterrupt = retryPending;
                if (suspendedRetryForInterrupt) {
                    this.suspendLogicalTurnRetry(state);
                    state.pauseRetryInterruptPending = true;
                }
                try {
                    await state.transport.request("turn/interrupt", {
                        threadId: activeTurnThreadId,
                        turnId: codexTurnId,
                    });
                }
                catch (error) {
                    if (suspendedRetryForInterrupt) {
                        state.pauseRetryInterruptPending = false;
                        this.resumeLogicalTurnRetry(state);
                    }
                    throw error;
                }
                interrupted = true;
            }
            const nextCodexTurnId = interrupted ? null : codexTurnId;
            state.status = "paused";
            state.codexThreadId = codexThreadId;
            state.codexTurnId = nextCodexTurnId;
            state.activeTurnThreadId = nextCodexTurnId ? activeTurnThreadId : null;
            state.pausedAt = new Date().toISOString();
            this.suspendLogicalTurnRetry(state);
            this.dockerRuntime.markSessionPaused(payload.sessionId);
            if (!keepWarm) {
                this.sessions.delete(payload.sessionId);
                await this.tryPublishSessionEndAuthMaterialUpdateIfChanged(state, "session_pause_close");
                await state.transport.close();
                await cleanupSensitiveAuthRoot(state.sensitiveAuthRootPath);
            }
            return sessionCommandAck(payload, {
                codexThreadId,
                codexTurnId: nextCodexTurnId,
                result: {
                    status: "paused",
                    keepWarm,
                    interrupted,
                    reason: payload.reason ?? null,
                    ...this.pendingLogicalTurnRetryFields(state),
                },
            });
        });
    }
    async resumeSession(payload) {
        const state = this.requireSessionState(payload.sessionId);
        return this.withSessionOperationLock(state, async () => {
            this.throwIfChatGptAuthInvalid(state);
            const readiness = await this.ensureWarmTransportReadyForCommand(state, {
                resumeThread: false,
            });
            const activation = this.dockerRuntime.beginSessionActivation(payload.sessionId);
            let activationRequestSucceeded = false;
            try {
                let returnProbeAttempted = false;
                if (!readiness.restoredApiFallback) {
                    returnProbeAttempted = await this.maybeProbeChatGptReturn(state, "thread_resume_probe");
                }
                const resumedAcrossAuthTransition = readiness.restoredApiFallback ||
                    returnProbeAttempted ||
                    state.threadResumeRequired === true;
                const resumeOverrides = resumedAcrossAuthTransition
                    ? this.authTransitionThreadResumeOverrides(state, payload.codexThreadId, payload.overrides)
                    : payload.overrides;
                const response = await this.requestThreadWithChatGptAuthInvalidHandling(state, "thread/resume", threadResumeParams(state.sessionPayload, {
                    threadId: payload.codexThreadId,
                    persistExtendedHistory: payload.persistExtendedHistory ?? false,
                    replayRuntimeConfig: state.threadResumeRequired === true,
                }, resumeOverrides));
                activationRequestSucceeded = true;
                const codexThreadId = extractThreadId(response) ?? payload.codexThreadId;
                const codexTurnId = extractTurnId(response) ?? null;
                state.status = "active";
                state.codexThreadId = codexThreadId;
                state.codexTurnId = codexTurnId;
                state.activeTurnThreadId = codexTurnId ? codexThreadId : null;
                state.threadResumeRequired = false;
                state.pausedAt = null;
                this.resumeLogicalTurnRetry(state);
                this.dockerRuntime.markSessionRunning(payload.sessionId);
                await this.readQuotaAndMaybeFallback(state, "thread_resume");
                await this.ensureRequestedServiceTierForApiLane(state, codexThreadId);
                await this.tryPublishAuthMaterialUpdateIfChanged(state, "thread_resume");
                this.throwIfChatGptAuthInvalid(state);
                return sessionCommandAck(payload, {
                    codexThreadId,
                    codexTurnId,
                    result: withUsageRouting(jsonResponse(response), state),
                });
            }
            catch (error) {
                if (!activationRequestSucceeded) {
                    activation.rollback();
                }
                throw error;
            }
        });
    }
    async forkThread(payload) {
        const state = this.requireSessionState(payload.sessionId);
        return this.withSessionOperationLock(state, async () => {
            this.throwIfChatGptAuthInvalid(state);
            this.throwIfLogicalTurnRetryPending(state);
            const readiness = await this.ensureWarmTransportReadyForCommand(state, {
                deferThreadResumeForDueProbe: true,
            });
            const activation = this.dockerRuntime.beginSessionActivation(payload.sessionId);
            let activationRequestSucceeded = false;
            try {
                if (!readiness.restoredApiFallback) {
                    await this.maybeProbeChatGptReturn(state, "thread_fork_probe");
                }
                const response = await this.requestThreadWithChatGptAuthInvalidHandling(state, "thread/fork", threadForkParams(state.sessionPayload, {
                    threadId: payload.codexThreadId,
                    cwd: state.codexCwd,
                    persistExtendedHistory: payload.persistExtendedHistory ?? false,
                }, payload.overrides));
                activationRequestSucceeded = true;
                this.throwIfChatGptAuthInvalid(state);
                const codexThreadId = extractThreadId(response);
                if (!codexThreadId) {
                    throw new Error("Codex app-server did not return a forked thread id");
                }
                state.status = "active";
                state.codexThreadId = codexThreadId;
                state.codexTurnId = extractTurnId(response) ?? null;
                state.activeTurnThreadId = state.codexTurnId ? codexThreadId : null;
                state.pausedAt = null;
                this.dockerRuntime.markSessionRunning(payload.sessionId);
                await this.readQuotaAndMaybeFallback(state, "thread_fork");
                await this.ensureRequestedServiceTierForApiLane(state, codexThreadId);
                await this.tryPublishAuthMaterialUpdateIfChanged(state, "thread_fork");
                this.throwIfChatGptAuthInvalid(state);
                return sessionCommandAck(payload, {
                    codexThreadId,
                    codexTurnId: state.codexTurnId,
                    result: withUsageRouting(jsonResponse(response), state),
                });
            }
            catch (error) {
                if (!activationRequestSucceeded) {
                    activation.rollback();
                }
                throw error;
            }
        });
    }
    async startTurn(payload) {
        const state = this.requireSessionState(payload.sessionId);
        return this.withSessionOperationLock(state, async () => {
            this.throwIfChatGptAuthInvalid(state);
            this.throwIfLogicalTurnRetryPending(state);
            const readiness = await this.ensureWarmTransportReadyForCommand(state, {
                deferThreadResumeForDueProbe: true,
            });
            const activation = this.dockerRuntime.beginSessionActivation(payload.sessionId);
            let activationRequestSucceeded = false;
            let logicalTurnRetry = null;
            try {
                if (!readiness.restoredApiFallback) {
                    await this.maybeProbeChatGptReturn(state, "turn_start_probe");
                }
                await this.readQuotaAndMaybeFallback(state, "turn_start_boundary");
                const requestParams = {
                    ...turnStartParams(state.sessionPayload, payload.input, payload.overrides, {
                        cwd: state.codexCwd,
                        resolvedNetworkMode: state.resolvedNetworkMode,
                    }),
                    threadId: payload.codexThreadId,
                };
                logicalTurnRetry = this.beginLogicalTurn(state, "turn/start", requestParams);
                const response = await this.requestPhysicalTurn(state, "turn/start", requestParams, { logTurnStart: true });
                activationRequestSucceeded = true;
                this.throwIfChatGptAuthInvalid(state);
                this.recordLogicalTurnStarted(state, logicalTurnRetry, extractTurnId(response), payload.codexThreadId);
                state.status = "active";
                state.codexThreadId = payload.codexThreadId;
                state.pausedAt = null;
                this.dockerRuntime.markSessionRunning(payload.sessionId);
                await this.tryPublishAuthMaterialUpdateIfChanged(state, "turn_start");
                this.throwIfChatGptAuthInvalid(state);
                const codexTurnId = state.codexTurnId ?? null;
                return sessionCommandAck(payload, {
                    codexThreadId: payload.codexThreadId,
                    codexTurnId,
                    result: withUsageRouting({
                        ...(jsonResponse(response) ?? {}),
                        ...this.pendingLogicalTurnRetryFields(state, logicalTurnRetry),
                    }, state),
                });
            }
            catch (error) {
                if (!activationRequestSucceeded && logicalTurnRetry) {
                    const retry = this.scheduleLogicalTurnRetryForRequestFailure(state, logicalTurnRetry, error);
                    if (retry) {
                        state.status = "active";
                        state.codexThreadId = payload.codexThreadId;
                        state.codexTurnId = null;
                        state.pausedAt = null;
                        this.dockerRuntime.markSessionRunning(payload.sessionId);
                        return sessionCommandAck(payload, {
                            codexThreadId: payload.codexThreadId,
                            codexTurnId: null,
                            result: withUsageRouting({
                                retryScheduled: true,
                                ypLiveWorkflowRetry: retry,
                                ...this.pendingLogicalTurnRetryFields(state, logicalTurnRetry),
                            }, state),
                        });
                    }
                    activation.rollback();
                    this.clearLogicalTurnRetry(state, logicalTurnRetry);
                }
                if (!activationRequestSucceeded && !logicalTurnRetry) {
                    activation.rollback();
                }
                throw error;
            }
        });
    }
    async steerTurn(payload) {
        const state = this.requireSessionState(payload.sessionId);
        return this.withSessionOperationLock(state, async () => {
            this.throwIfChatGptAuthInvalid(state);
            this.throwIfLogicalTurnRetryPending(state);
            await this.ensureWarmTransportReadyForCommand(state);
            const activeTurnThreadId = state.codexTurnId === payload.codexTurnId
                ? (state.activeTurnThreadId ?? payload.codexThreadId)
                : payload.codexThreadId;
            const activation = this.dockerRuntime.beginSessionActivation(payload.sessionId);
            let activationRequestSucceeded = false;
            try {
                const response = await this.requestWithChatGptAuthInvalidHandling(state, "turn/steer", {
                    ...payload.overrides,
                    threadId: activeTurnThreadId,
                    expectedTurnId: payload.codexTurnId,
                    input: codexUserInputs(payload.input),
                });
                activationRequestSucceeded = true;
                this.throwIfChatGptAuthInvalid(state);
                const codexTurnId = extractTurnId(response) ?? payload.codexTurnId;
                state.status = "active";
                state.codexThreadId = payload.codexThreadId;
                state.codexTurnId = codexTurnId;
                state.activeTurnThreadId = activeTurnThreadId;
                state.pausedAt = null;
                this.dockerRuntime.markSessionRunning(payload.sessionId);
                await this.tryPublishAuthMaterialUpdateIfChanged(state, "turn_steer");
                this.throwIfChatGptAuthInvalid(state);
                return sessionCommandAck(payload, {
                    codexThreadId: payload.codexThreadId,
                    codexTurnId,
                    result: withUsageRouting({
                        ...(jsonResponse(response) ?? {}),
                        ...this.pendingLogicalTurnRetryFields(state),
                    }, state),
                });
            }
            catch (error) {
                if (!activationRequestSucceeded) {
                    activation.rollback();
                }
                throw error;
            }
        });
    }
    async interruptTurn(payload) {
        const state = this.requireSessionState(payload.sessionId);
        return this.withSessionOperationLock(state, async () => {
            this.throwIfChatGptAuthInvalid(state);
            const pendingRetries = logicalTurnRetries(state).filter((retry) => Boolean(retry.timer || retry.metadata || retry.suspended));
            const retryPending = pendingRetries.length > 0;
            const activeTurnId = state.codexTurnId ?? payload.codexTurnId ?? null;
            if (retryPending && !activeTurnId) {
                const interruptedTurnId = pendingRetries
                    .map(logicalTurnRetrySourceTurnId)
                    .find((turnId) => Boolean(turnId)) ?? null;
                this.clearAllLogicalTurnRetries(state);
                state.codexThreadId = payload.codexThreadId;
                state.codexTurnId = null;
                state.activeTurnThreadId = null;
                return sessionCommandAck(payload, {
                    codexThreadId: payload.codexThreadId,
                    codexTurnId: null,
                    result: { interruptedRetry: true, interruptedTurnId },
                });
            }
            if (!activeTurnId) {
                throw new Error("Codex turn interrupt requires a turn id when no logical retry is pending");
            }
            await this.ensureWarmTransportReadyForCommand(state);
            const activeTurnThreadId = state.codexTurnId === activeTurnId
                ? (state.activeTurnThreadId ?? payload.codexThreadId)
                : payload.codexThreadId;
            const response = await state.transport.request("turn/interrupt", {
                threadId: activeTurnThreadId,
                turnId: activeTurnId,
            });
            if (retryPending) {
                this.clearAllLogicalTurnRetries(state);
            }
            state.codexThreadId = payload.codexThreadId;
            state.codexTurnId = null;
            state.activeTurnThreadId = null;
            return sessionCommandAck(payload, {
                codexThreadId: payload.codexThreadId,
                codexTurnId: null,
                result: {
                    ...(jsonResponse(response) ?? {}),
                    ...(retryPending ? { interruptedRetry: true } : {}),
                    interruptedTurnId: activeTurnId,
                },
            });
        });
    }
    async injectItems(payload) {
        const state = this.requireSessionState(payload.sessionId);
        return this.withSessionOperationLock(state, async () => {
            this.throwIfChatGptAuthInvalid(state);
            await this.ensureWarmTransportReadyForCommand(state);
            const response = await state.transport.request("thread/inject_items", {
                threadId: payload.codexThreadId,
                items: payload.items,
            });
            state.codexThreadId = payload.codexThreadId;
            return sessionCommandAck(payload, {
                codexThreadId: payload.codexThreadId,
                result: jsonResponse(response),
            });
        });
    }
    async respondToApproval(payload) {
        const state = this.requireSessionState(payload.sessionId);
        return this.withSessionOperationLock(state, async () => {
            this.throwIfChatGptAuthInvalid(state);
            if (state.transportRelaunchRequired) {
                throw new Error("Codex approval request cannot be answered because the app-server transport exited");
            }
            if (state.resolvedApprovalRequestKeys.has(approvalRequestKey(payload.requestId))) {
                return sessionCommandAck(payload);
            }
            if (state.staleApprovalRequestKeys.has(approvalRequestKey(payload.requestId))) {
                throw new Error("Codex approval request cannot be answered because the app-server transport exited");
            }
            if (payload.error) {
                state.transport.rejectServerRequest(payload.requestId, payload.error);
            }
            else {
                const response = this.codexApprovalResponse(state, payload.requestId, payload.result ?? {});
                if ("error" in response) {
                    state.transport.rejectServerRequest(payload.requestId, response.error);
                }
                else {
                    state.transport.respondToServerRequest(payload.requestId, response.result);
                }
            }
            this.forgetPendingApprovalRequest(state, payload.requestId);
            return sessionCommandAck(payload);
        });
    }
    async startReview(payload) {
        const state = this.requireSessionState(payload.sessionId);
        return this.withSessionOperationLock(state, async () => {
            this.throwIfChatGptAuthInvalid(state);
            this.throwIfLogicalTurnRetryPending(state);
            const readiness = await this.ensureWarmTransportReadyForCommand(state, {
                deferThreadResumeForDueProbe: true,
            });
            const activation = this.dockerRuntime.beginSessionActivation(payload.sessionId);
            let activationRequestSucceeded = false;
            let logicalTurnRetry = null;
            try {
                if (!readiness.restoredApiFallback) {
                    await this.maybeProbeChatGptReturn(state, "review_start_probe");
                }
                await this.readQuotaAndMaybeFallback(state, "review_start_boundary");
                await this.ensureRequestedServiceTierForApiLane(state, payload.codexThreadId);
                const requestParams = {
                    threadId: payload.codexThreadId,
                    target: reviewTargetParams(payload.target),
                    ...(payload.delivery ? { delivery: payload.delivery } : {}),
                };
                logicalTurnRetry = this.beginLogicalTurn(state, "review/start", requestParams);
                const response = await this.requestPhysicalTurn(state, "review/start", requestParams);
                activationRequestSucceeded = true;
                this.throwIfChatGptAuthInvalid(state);
                const responseCodexTurnId = extractTurnId(response) ??
                    logicalTurnRetry.currentTurnId ??
                    (isDetachedReviewRetry(logicalTurnRetry)
                        ? null
                        : (state.codexTurnId ?? null));
                const responseReviewThreadId = extractReviewThreadId(response);
                const reviewThreadId = responseReviewThreadId ?? payload.codexThreadId;
                if (payload.delivery === "detached" && responseReviewThreadId) {
                    state.detachedReviewThreadIds.add(responseReviewThreadId);
                }
                this.recordLogicalTurnStarted(state, logicalTurnRetry, responseCodexTurnId, reviewThreadId);
                state.status = "active";
                state.codexThreadId = payload.codexThreadId;
                state.pausedAt = null;
                this.dockerRuntime.markSessionRunning(payload.sessionId);
                await this.tryPublishAuthMaterialUpdateIfChanged(state, "review_start");
                this.throwIfChatGptAuthInvalid(state);
                const codexTurnId = state.codexTurnId ?? null;
                return sessionCommandAck(payload, {
                    codexThreadId: payload.codexThreadId,
                    codexTurnId,
                    result: withUsageRouting({
                        ...(jsonResponse(response) ?? {}),
                        ...this.pendingLogicalTurnRetryFields(state, logicalTurnRetry),
                    }, state),
                });
            }
            catch (error) {
                if (!activationRequestSucceeded && logicalTurnRetry) {
                    const retry = this.scheduleLogicalTurnRetryForRequestFailure(state, logicalTurnRetry, error);
                    if (retry) {
                        state.status = "active";
                        state.codexThreadId = payload.codexThreadId;
                        if (!isDetachedReviewRetry(logicalTurnRetry)) {
                            state.codexTurnId = null;
                            state.activeTurnThreadId = null;
                        }
                        state.pausedAt = null;
                        this.dockerRuntime.markSessionRunning(payload.sessionId);
                        return sessionCommandAck(payload, {
                            codexThreadId: payload.codexThreadId,
                            codexTurnId: null,
                            result: withUsageRouting({
                                retryScheduled: true,
                                ypLiveWorkflowRetry: retry,
                                ...this.pendingLogicalTurnRetryFields(state, logicalTurnRetry),
                            }, state),
                        });
                    }
                    activation.rollback();
                    this.clearLogicalTurnRetry(state, logicalTurnRetry);
                }
                if (!activationRequestSucceeded && !logicalTurnRetry) {
                    activation.rollback();
                }
                throw error;
            }
        });
    }
    respondToServerRequest(sessionId, requestId, result) {
        this.requireSessionTransport(sessionId).respondToServerRequest(requestId, result);
    }
    rejectServerRequest(sessionId, requestId, error) {
        this.requireSessionTransport(sessionId).rejectServerRequest(requestId, error);
    }
    rememberPendingApprovalRequest(state, message, event) {
        if (!isCodexApprovalRequestMethod(message.method) ||
            message.id === undefined) {
            return;
        }
        const request = {
            method: message.method,
            params: jsonRecord(message.params),
        };
        const messageKey = approvalRequestKey(message.id);
        state.pendingApprovalRequests.set(messageKey, request);
        state.resolvedApprovalRequestKeys.delete(messageKey);
        state.staleApprovalRequestKeys.delete(messageKey);
        const payloadRequestId = approvalRequestIdFromPayload(event.payload);
        if (payloadRequestId !== null) {
            const payloadKey = approvalRequestKey(payloadRequestId);
            state.pendingApprovalRequests.set(payloadKey, request);
            state.resolvedApprovalRequestKeys.delete(payloadKey);
            state.staleApprovalRequestKeys.delete(payloadKey);
        }
    }
    forgetPendingApprovalRequest(state, requestId) {
        const key = approvalRequestKey(requestId);
        const request = state.pendingApprovalRequests.get(key);
        state.pendingApprovalRequests.delete(key);
        if (!request) {
            return;
        }
        state.resolvedApprovalRequestKeys.add(key);
        state.staleApprovalRequestKeys.delete(key);
        for (const [candidateKey, candidateRequest,] of state.pendingApprovalRequests) {
            if (candidateRequest === request) {
                state.pendingApprovalRequests.delete(candidateKey);
                state.resolvedApprovalRequestKeys.add(candidateKey);
                state.staleApprovalRequestKeys.delete(candidateKey);
            }
        }
    }
    codexApprovalResponse(state, requestId, result) {
        const request = state.pendingApprovalRequests.get(approvalRequestKey(requestId));
        switch (request?.method) {
            case "item/commandExecution/requestApproval":
            case "item/fileChange/requestApproval":
                return { result: codexDecisionApprovalResult(result) };
            case "item/permissions/requestApproval":
                return codexPermissionsApprovalResponse(request.params, result);
            case "item/tool/requestUserInput":
            case undefined:
                return { result };
        }
    }
    async closeAll() {
        const sessionStates = Array.from(this.sessions.values());
        const transports = sessionStates.map((state) => state.transport);
        const authLoginStates = Array.from(this.authLogins.values());
        const authTransports = authLoginStates.map((state) => state.transport);
        const sensitiveAuthRoots = sessionStates.map((state) => state.sensitiveAuthRootPath);
        const authLoginRoots = authLoginStates.map((state) => state.rootPath);
        for (const state of sessionStates) {
            this.clearAllLogicalTurnRetries(state);
        }
        this.sessions.clear();
        this.authLogins.clear();
        await Promise.all(sessionStates.map((state) => this.tryPublishSessionEndAuthMaterialUpdateIfChanged(state, "adapter_close")));
        await Promise.all([...transports, ...authTransports].map((transport) => transport.close().catch(() => undefined)));
        await Promise.all([...sensitiveAuthRoots, ...authLoginRoots].map((rootPath) => cleanupSensitiveAuthRoot(rootPath)));
    }
    async startAuthLogin(payload) {
        const layout = authLoginLayout(payload.rootPath);
        await ensureAuthLoginDirectories(layout);
        const transport = this.createStandaloneTransport(layout.workspacePath, layout.codexHomePath);
        let loginId = null;
        let completed = null;
        this.consoleEventSink?.({
            source: "codex",
            event: "auth.login.start",
            fields: {
                profile: payload.authProfileId,
                vmHost: payload.vmHostId,
                login: payload.loginType,
            },
        });
        transport.onNotification((message) => {
            if (message.method !== "account/login/completed") {
                return;
            }
            const params = jsonResponse(message.params) ?? {};
            const notificationLoginId = typeof params.loginId === "string" ? params.loginId : null;
            if (!loginId || notificationLoginId === loginId) {
                completed = params;
            }
        });
        try {
            await initializeAuthTransport(transport);
            const response = jsonResponse(await transport.request("account/login/start", {
                type: payload.loginType,
            })) ?? {};
            loginId = stringResponse(response.loginId, "loginId");
            const verificationUrl = stringResponse(response.verificationUrl, "verificationUrl");
            const userCode = stringResponse(response.userCode, "userCode");
            const state = {
                transport,
                authProfileId: payload.authProfileId,
                vmHostId: payload.vmHostId,
                rootPath: payload.rootPath,
                codexHomePath: layout.codexHomePath,
                loginId,
                completed: () => completed,
            };
            this.authLogins.set(authLoginKey(payload.authProfileId, loginId), state);
            this.consoleEventSink?.({
                source: "codex",
                event: "auth.login.started",
                fields: {
                    profile: payload.authProfileId,
                    vmHost: payload.vmHostId,
                    loginId,
                },
            });
            return {
                ok: true,
                commandId: payload.commandId,
                authProfileId: payload.authProfileId,
                vmHostId: payload.vmHostId,
                rootPath: payload.rootPath,
                loginType: payload.loginType,
                loginId,
                verificationUrl,
                userCode,
            };
        }
        catch (error) {
            this.consoleEventSink?.({
                source: "codex",
                event: "auth.login.failed",
                fields: {
                    profile: payload.authProfileId,
                    vmHost: payload.vmHostId,
                    loginId,
                    phase: "start",
                    message: error instanceof Error ? error.message : "Unknown error",
                },
            });
            await transport.close().catch(() => undefined);
            await cleanupSensitiveAuthRoot(layout.rootPath);
            throw error;
        }
    }
    async completeAuthLogin(payload) {
        const state = this.requireAuthLogin(payload.authProfileId, payload.loginId);
        assertAuthLoginMatches(state, payload);
        this.consoleEventSink?.({
            source: "codex",
            event: "auth.login.complete",
            fields: {
                profile: payload.authProfileId,
                vmHost: payload.vmHostId,
                loginId: payload.loginId,
            },
        });
        let account;
        try {
            account = await this.waitForChatGptAccount(state, payload.timeoutMs ?? DefaultAuthLoginCompleteTimeoutMs);
            this.consoleEventSink?.({
                source: "codex",
                event: "auth.login.account",
                fields: {
                    profile: payload.authProfileId,
                    vmHost: payload.vmHostId,
                    loginId: payload.loginId,
                    account: optionalString(account.type),
                },
            });
        }
        catch (error) {
            if (isAuthLoginPendingError(error)) {
                this.consoleEventSink?.({
                    source: "codex",
                    event: "auth.login.pending",
                    fields: {
                        profile: payload.authProfileId,
                        vmHost: payload.vmHostId,
                        loginId: payload.loginId,
                        message: error.message,
                    },
                });
                throw error;
            }
            this.consoleEventSink?.({
                source: "codex",
                event: "auth.login.failed",
                fields: {
                    profile: payload.authProfileId,
                    vmHost: payload.vmHostId,
                    loginId: payload.loginId,
                    phase: "complete",
                    message: error instanceof Error ? error.message : "Unknown error",
                },
            });
            this.authLogins.delete(authLoginKey(payload.authProfileId, payload.loginId));
            await state.transport.close().catch(() => undefined);
            await cleanupSensitiveAuthRoot(state.rootPath);
            throw error;
        }
        try {
            const authMaterial = await archiveCodexAuthMaterial(state.codexHomePath);
            const authJsonCount = authMaterial.files.filter((file) => file.path === "auth.json").length;
            if (!authMaterialCanPublishAsChatGpt(authMaterial)) {
                this.consoleEventSink?.({
                    source: "codex",
                    event: "auth.login.invalid_material",
                    fields: {
                        profile: payload.authProfileId,
                        vmHost: payload.vmHostId,
                        loginId: payload.loginId,
                        authJsonCount,
                        ...authMaterialRedactedSummary(authMaterial),
                    },
                });
                throw new Error(CodexChatGptAuthMaterialInvalidMessage);
            }
            this.consoleEventSink?.({
                source: "codex",
                event: "auth.login.completed",
                fields: {
                    profile: payload.authProfileId,
                    vmHost: payload.vmHostId,
                    loginId: payload.loginId,
                    authJsonCount,
                },
            });
            return {
                ok: true,
                commandId: payload.commandId,
                authProfileId: payload.authProfileId,
                vmHostId: payload.vmHostId,
                rootPath: payload.rootPath,
                loginId: payload.loginId,
                account,
                authMaterial,
            };
        }
        catch (error) {
            this.consoleEventSink?.({
                source: "codex",
                event: "auth.login.failed",
                fields: {
                    profile: payload.authProfileId,
                    vmHost: payload.vmHostId,
                    loginId: payload.loginId,
                    phase: "complete",
                    message: error instanceof Error ? error.message : "Unknown error",
                },
            });
            throw error;
        }
        finally {
            this.authLogins.delete(authLoginKey(payload.authProfileId, payload.loginId));
            await state.transport.close().catch(() => undefined);
            await cleanupSensitiveAuthRoot(state.rootPath);
        }
    }
    async cancelAuthLogin(payload) {
        const state = this.requireAuthLogin(payload.authProfileId, payload.loginId);
        assertAuthLoginMatches(state, payload);
        await state.transport
            .request("account/login/cancel", { loginId: payload.loginId })
            .catch(() => undefined);
        this.authLogins.delete(authLoginKey(payload.authProfileId, payload.loginId));
        await state.transport.close().catch(() => undefined);
        await cleanupSensitiveAuthRoot(state.rootPath);
        return {
            ok: true,
            commandId: payload.commandId,
            authProfileId: payload.authProfileId,
            vmHostId: payload.vmHostId,
            rootPath: payload.rootPath,
            loginId: payload.loginId,
        };
    }
    async listModels(sessionId) {
        const transport = this.requireSessionTransport(sessionId);
        const models = [];
        let cursor;
        do {
            const response = jsonResponse(await transport.request("model/list", {
                limit: 100,
                includeHidden: false,
                ...(cursor ? { cursor } : {}),
            })) ?? {};
            if (!Array.isArray(response.data))
                throw new Error("Codex returned an invalid model catalog");
            models.push(...response.data);
            cursor =
                typeof response.nextCursor === "string"
                    ? response.nextCursor
                    : undefined;
            if (models.length > 1000)
                throw new Error("Codex model catalog pagination exceeded its limit");
        } while (cursor);
        return { models };
    }
    requireSessionState(sessionId) {
        const state = this.sessions.get(sessionId);
        if (!state) {
            throw new CodexSessionNotActiveError(sessionId);
        }
        return state;
    }
    requireSessionTransport(sessionId) {
        return this.requireSessionState(sessionId).transport;
    }
    ownsSessionState(state) {
        return this.sessions.get(state.sessionPayload.sessionId) === state;
    }
    beginLogicalTurn(state, method, params) {
        const detachedReview = method === "review/start" && params.delivery === "detached";
        this.clearLogicalTurnRetry(state, detachedReview ? state.detachedReviewRetry : state.logicalTurnRetry);
        if (!detachedReview) {
            state.activeTurnThreadId = null;
            state.coldThreadRestorePending = false;
            state.idleThreadRestorePending = false;
        }
        const retry = {
            method,
            params,
            attempt: 0,
            currentTurnId: null,
            currentThreadId: null,
            startedFromRetry: null,
            classification: null,
            metadata: null,
            timer: null,
            suspended: false,
        };
        if (detachedReview) {
            state.detachedReviewRetry = retry;
        }
        else {
            state.logicalTurnRetry = retry;
        }
        return retry;
    }
    recordLogicalTurnStarted(state, retry, turnId, threadId) {
        if (!turnId || state.completedTurnIds.has(turnId)) {
            return false;
        }
        if (!retry || !isDetachedReviewRetry(retry)) {
            state.coldThreadRestorePending = false;
            state.idleThreadRestorePending = false;
        }
        if (retry) {
            retry.currentTurnId = turnId;
            retry.currentThreadId = threadId ?? retry.currentThreadId;
        }
        state.codexTurnId = turnId;
        state.activeTurnThreadId =
            threadId ?? state.activeTurnThreadId ?? state.codexThreadId ?? null;
        return true;
    }
    rememberCompletedTurnId(state, turnId) {
        if (!turnId) {
            return;
        }
        state.completedTurnIds.add(turnId);
        if (state.completedTurnIds.size > 128) {
            const oldestCompletedTurnId = state.completedTurnIds
                .values()
                .next().value;
            if (oldestCompletedTurnId) {
                state.completedTurnIds.delete(oldestCompletedTurnId);
            }
        }
    }
    finishColdThreadRestore(state, response, threadId) {
        if (!state.coldThreadRestorePending) {
            return;
        }
        const status = threadStatusFromResponse(response);
        const activeTurnId = activeThreadTurnIdFromResponse(response);
        for (const completedTurnId of terminalThreadTurnIdsFromResponse(response)) {
            this.rememberCompletedTurnId(state, completedTurnId);
        }
        if (status === "idle") {
            state.idleThreadRestorePending = true;
            state.codexTurnId = null;
            state.activeTurnThreadId = null;
        }
        else if (status === "active" || (status === null && activeTurnId)) {
            state.idleThreadRestorePending = false;
            if (activeTurnId) {
                this.recordLogicalTurnStarted(state, null, activeTurnId, threadId);
            }
        }
        state.coldThreadRestorePending = false;
    }
    throwIfLogicalTurnRetryPending(state) {
        const pending = logicalTurnRetries(state).some((retry) => retry.timer || retry.metadata || retry.suspended);
        if (pending) {
            throw new Error(`Codex logical turn retry is already pending for session ${state.sessionPayload.sessionId}`);
        }
    }
    clearLogicalTurnRetry(state, retry = state.logicalTurnRetry) {
        if (retry?.timer) {
            clearTimeout(retry.timer);
        }
        if (state.logicalTurnRetry === retry) {
            state.logicalTurnRetry = null;
        }
        if (state.detachedReviewRetry === retry) {
            state.detachedReviewRetry = null;
        }
        if (logicalTurnRetries(state).length === 0) {
            state.pauseRetryInterruptPending = false;
        }
    }
    clearAllLogicalTurnRetries(state) {
        for (const retry of logicalTurnRetries(state)) {
            this.clearLogicalTurnRetry(state, retry);
        }
        state.pauseRetryInterruptPending = false;
    }
    suspendLogicalTurnRetry(state, target) {
        const retries = target ? [target] : logicalTurnRetries(state);
        for (const retry of retries) {
            if (!retry.timer && !retry.metadata) {
                continue;
            }
            if (retry.timer) {
                clearTimeout(retry.timer);
                retry.timer = null;
            }
            retry.suspended = true;
        }
    }
    resumeLogicalTurnRetry(state, target) {
        if (state.pauseRetryInterruptPending) {
            return;
        }
        const retries = target ? [target] : logicalTurnRetries(state);
        for (const retry of retries) {
            if (!retry.suspended || !retry.metadata) {
                continue;
            }
            retry.suspended = false;
            this.armLogicalTurnRetry(state, retry, remainingLogicalTurnRetryDelayMs(retry.metadata));
        }
    }
    pendingLogicalTurnRetrySnapshot(state, target) {
        const retry = target ??
            logicalTurnRetries(state).find((candidate) => Boolean(candidate.metadata && (candidate.timer || candidate.suspended))) ??
            null;
        if (!retry?.metadata || (!retry.timer && !retry.suspended)) {
            return null;
        }
        const turnId = logicalTurnRetrySourceTurnId(retry);
        return {
            method: retry.method,
            params: { ...retry.params },
            metadata: { ...retry.metadata },
            ...(turnId ? { turnId } : {}),
        };
    }
    pendingLogicalTurnRetrySnapshots(state) {
        return logicalTurnRetries(state).flatMap((retry) => {
            const snapshot = this.pendingLogicalTurnRetrySnapshot(state, retry);
            return snapshot ? [snapshot] : [];
        });
    }
    pendingLogicalTurnRetryFields(state, target) {
        const snapshots = this.pendingLogicalTurnRetrySnapshots(state);
        const pendingLogicalTurnRetry = target
            ? this.pendingLogicalTurnRetrySnapshot(state, target)
            : (snapshots[0] ?? null);
        return {
            pendingLogicalTurnRetry: pendingLogicalTurnRetry,
            pendingLogicalTurnRetries: snapshots,
        };
    }
    restoreLogicalTurnRetry(state, pending, codexThreadId) {
        if (!pending.metadata.scheduled) {
            throw new Error("A restored logical turn retry must be scheduled");
        }
        const metadata = { ...pending.metadata };
        const retry = {
            method: pending.method,
            params: { ...pending.params, threadId: codexThreadId },
            attempt: metadata.attempt,
            currentTurnId: pending.turnId ?? null,
            currentThreadId: null,
            startedFromRetry: null,
            classification: metadata.classification,
            metadata,
            timer: null,
            suspended: true,
        };
        if (isDetachedReviewRetry(retry)) {
            state.detachedReviewRetry = retry;
        }
        else {
            state.logicalTurnRetry = retry;
        }
    }
    withLogicalTurnRetryHandling(state, event) {
        const retry = logicalTurnRetryForEvent(state, event);
        if (!retry) {
            return event;
        }
        if (event.eventType === "session.error") {
            if (codexSessionEventWillRetry(event.payload) ||
                isTransientReconnectSessionError(event.payload)) {
                return event;
            }
            const classification = codexRetryClassification(event.payload);
            if (!classification || !logicalTurnMatchesEvent(retry, event)) {
                return event;
            }
            const metadata = this.scheduleLogicalTurnRetry(state, retry, classification);
            return metadata
                ? eventWithLiveWorkflowRetry(event, metadata, this.pendingLogicalTurnRetrySnapshot(state, retry), this.pendingLogicalTurnRetrySnapshots(state))
                : event;
        }
        if (event.eventType !== "turn.completed" ||
            !failedTurnCompletion(event.payload)) {
            return event;
        }
        if (!logicalTurnCompletionMatchesEvent(retry, event)) {
            return event;
        }
        const classification = retry.classification ?? codexRetryClassification(event.payload);
        if (!classification) {
            return event;
        }
        const metadata = retry.metadata ??
            this.scheduleLogicalTurnRetry(state, retry, classification);
        return metadata
            ? eventWithLiveWorkflowRetry(event, metadata, this.pendingLogicalTurnRetrySnapshot(state, retry), this.pendingLogicalTurnRetrySnapshots(state))
            : event;
    }
    finishLogicalTurnForEvent(state, event) {
        if (event.eventType !== "turn.completed") {
            return;
        }
        const retry = logicalTurnRetryForEvent(state, event);
        if (!retry || !logicalTurnCompletionMatchesEvent(retry, event)) {
            return;
        }
        const pauseRetryInterruptCompleted = state.pauseRetryInterruptPending === true &&
            interruptedTurnCompletion(event.payload);
        const preservePausedRetry = retry.suspended &&
            interruptedTurnCompletion(event.payload) &&
            (state.status === "paused" || state.pauseRetryInterruptPending === true);
        state.pauseRetryInterruptPending = false;
        if (pauseRetryInterruptCompleted && state.status === "active") {
            this.resumeLogicalTurnRetry(state);
        }
        if (preservePausedRetry) {
            return;
        }
        if (!failedTurnCompletion(event.payload)) {
            this.clearLogicalTurnRetry(state, retry);
            return;
        }
        if (!codexSessionEventWillRetry(event.payload)) {
            this.clearLogicalTurnRetry(state, retry);
        }
    }
    scheduleLogicalTurnRetry(state, retry, classification) {
        if (!ownsLogicalTurnRetry(state, retry)) {
            return null;
        }
        if (retry.metadata && (retry.timer || retry.suspended)) {
            return retry.metadata;
        }
        const attempt = retry.attempt + 1;
        const nominalDelayMs = retryDelayMs(this.retryInitialDelayMs, this.retryMaxDelayMs, attempt);
        const random = Math.max(0, Math.min(1, this.retryRandom()));
        const delayMs = Math.max(1, Math.floor(nominalDelayMs * (0.5 + random * 0.5)));
        const metadata = {
            owner: "yp-live-workflow",
            scheduled: true,
            classification,
            attempt,
            nominalDelayMs,
            delayMs,
            nextRetryAt: new Date(Date.now() + delayMs).toISOString(),
        };
        retry.attempt = attempt;
        retry.classification = classification;
        retry.metadata = metadata;
        if (state.status === "paused") {
            retry.suspended = true;
        }
        if (!retry.suspended) {
            this.armLogicalTurnRetry(state, retry, delayMs);
        }
        this.consoleEventSink?.({
            source: "codex",
            event: "turn.retry.scheduled",
            fields: {
                session: state.sessionPayload.sessionId,
                thread: state.codexThreadId ?? null,
                turn: retry.currentTurnId,
                classification,
                attempt,
                delayMs,
            },
        });
        return metadata;
    }
    scheduleLogicalTurnRetryForRequestFailure(state, retry, error) {
        const classification = codexRetryClassification(errorPayloadForRetry(error));
        if (!classification) {
            return null;
        }
        const metadata = this.scheduleLogicalTurnRetry(state, retry, classification);
        if (metadata) {
            this.publishSyntheticLogicalTurnError(state, retry, error, metadata);
        }
        return metadata;
    }
    armLogicalTurnRetry(state, retry, delayMs) {
        if (retry.timer) {
            clearTimeout(retry.timer);
        }
        retry.timer = setTimeout(() => {
            retry.timer = null;
            void this.executeLogicalTurnRetry(state, retry);
        }, delayMs);
    }
    async executeLogicalTurnRetry(state, retry) {
        if (!this.ownsSessionState(state)) {
            this.clearLogicalTurnRetry(state, retry);
            return;
        }
        if (!ownsLogicalTurnRetry(state, retry) ||
            retry.suspended ||
            state.pauseRetryInterruptPending ||
            state.status === "paused" ||
            state.status === "failed") {
            return;
        }
        if (state.codexTurnId) {
            this.armLogicalTurnRetry(state, retry, CodexRetryActiveTurnPollMs);
            return;
        }
        await this.withSessionOperationLock(state, async () => {
            if (!this.ownsSessionState(state) ||
                !ownsLogicalTurnRetry(state, retry) ||
                retry.suspended ||
                state.pauseRetryInterruptPending ||
                state.status === "paused" ||
                state.status === "failed") {
                return;
            }
            if (state.codexTurnId) {
                this.armLogicalTurnRetry(state, retry, CodexRetryActiveTurnPollMs);
                return;
            }
            try {
                this.throwIfChatGptAuthInvalid(state);
                const readiness = await this.ensureWarmTransportReadyForCommand(state, {
                    deferThreadResumeForDueProbe: true,
                });
                if (!this.ownsSessionState(state)) {
                    return;
                }
                if (!readiness.restoredApiFallback) {
                    await this.maybeProbeChatGptReturn(state, "logical_turn_retry_probe");
                    if (!this.ownsSessionState(state)) {
                        return;
                    }
                }
                await this.readQuotaAndMaybeFallback(state, "logical_turn_retry");
                if (retry.method === "review/start") {
                    const reviewThreadId = optionalString(retry.params.threadId) ??
                        state.codexThreadId ??
                        null;
                    if (reviewThreadId) {
                        await this.ensureRequestedServiceTierForApiLane(state, reviewThreadId);
                    }
                }
                if (!this.ownsSessionState(state)) {
                    return;
                }
                const sourceTurnId = logicalTurnRetrySourceTurnId(retry);
                retry.startedFromRetry = retry.metadata
                    ? {
                        method: retry.method,
                        params: { ...retry.params },
                        metadata: { ...retry.metadata },
                        ...(sourceTurnId ? { turnId: sourceTurnId } : {}),
                    }
                    : null;
                retry.currentTurnId = null;
                retry.currentThreadId = null;
                retry.metadata = null;
                retry.classification = null;
                if (!isDetachedReviewRetry(retry)) {
                    state.coldThreadRestorePending = false;
                    state.idleThreadRestorePending = false;
                }
                const response = await this.requestPhysicalTurn(state, retry.method, retry.params, { logTurnStart: true });
                if (!this.ownsSessionState(state)) {
                    return;
                }
                const turnId = extractTurnId(response);
                const requestThreadId = optionalString(retry.params.threadId) ?? state.codexThreadId ?? null;
                const reviewThreadId = retry.method === "review/start"
                    ? extractReviewThreadId(response)
                    : null;
                if (isDetachedReviewRetry(retry) && reviewThreadId) {
                    state.detachedReviewThreadIds.add(reviewThreadId);
                }
                this.recordLogicalTurnStarted(state, retry, turnId, reviewThreadId ?? requestThreadId);
                state.status = "active";
                state.pausedAt = null;
                this.dockerRuntime.markSessionRunning(state.sessionPayload.sessionId);
                await this.tryPublishAuthMaterialUpdateIfChanged(state, "logical_turn_retry");
                if (!this.ownsSessionState(state)) {
                    return;
                }
                this.throwIfChatGptAuthInvalid(state);
            }
            catch (error) {
                if (!this.ownsSessionState(state)) {
                    return;
                }
                const classification = codexRetryClassification(errorPayloadForRetry(error));
                if (classification) {
                    const metadata = this.scheduleLogicalTurnRetry(state, retry, classification);
                    if (metadata) {
                        this.publishSyntheticLogicalTurnError(state, retry, error, metadata);
                    }
                    return;
                }
                this.clearLogicalTurnRetry(state, retry);
                this.publishSyntheticTerminalLogicalTurnError(state, retry, error);
            }
        });
    }
    publishSyntheticLogicalTurnError(state, retry, error, metadata) {
        this.publishSyntheticLogicalTurnEvent(state, retry, error, metadata);
    }
    publishSyntheticTerminalLogicalTurnError(state, retry, error) {
        this.publishSyntheticLogicalTurnEvent(state, retry, error, null);
    }
    publishSyntheticLogicalTurnEvent(state, retry, error, metadata) {
        const message = error instanceof Error ? error.message : String(error);
        const event = {
            seq: state.nextEventSeq,
            vmEventStreamId: state.eventStreamId,
            sessionId: state.sessionPayload.sessionId,
            workspaceId: state.sessionPayload.workspaceId,
            vmHostId: state.sessionPayload.vmHostId,
            eventType: "session.error",
            codexThreadId: retry.currentThreadId ??
                optionalString(retry.params.threadId) ??
                state.codexThreadId ??
                null,
            codexTurnId: retry.currentTurnId,
            itemId: null,
            payload: {
                message,
                error: { message },
                willRetry: false,
                ...(metadata
                    ? { ypLiveWorkflowRetry: metadata }
                    : {}),
                ...(metadata ? this.pendingLogicalTurnRetryFields(state, retry) : {}),
            },
            rawPayload: {
                method: "yp-live-workflow/logicalTurnRetry/error",
                params: { message },
            },
        };
        state.nextEventSeq += 1;
        this.markSessionFailedForTerminalEvent(state, event);
        publishSessionEvent(state.onEvent, event);
        this.logSessionEvent(event);
        this.publishAuthMaterialUpdateAfterEvent(state, event);
    }
    markSessionFailedForTerminalEvent(state, event) {
        if (event.eventType === "turn.completed" &&
            isManagedMultiTurnLaunch(state.sessionPayload)) {
            return;
        }
        const failureMessage = terminalFailureMessageForEvent(event);
        if (!failureMessage || state.status === "failed") {
            return;
        }
        state.status = "failed";
        state.pausedAt = null;
        this.dockerRuntime.markSessionFailed(state.sessionPayload.sessionId, new Error(failureMessage));
    }
    requireAuthLogin(authProfileId, loginId) {
        const state = this.authLogins.get(authLoginKey(authProfileId, loginId));
        if (!state) {
            throw new Error(`Codex auth login is not active: ${loginId}`);
        }
        return state;
    }
    attachSessionTransportHandlers(state, events) {
        const attachedTransport = state.transport;
        attachedTransport.onNotification((message) => {
            if (!this.ownsSessionState(state) ||
                state.transport !== attachedTransport) {
                return;
            }
            let event = normalizeCodexNotification(state.sessionPayload, message, state.nextEventSeq, state.eventStreamId);
            if (!event) {
                return;
            }
            event = this.withLogicalTurnRetryHandling(state, event);
            if (event.eventType === "metrics.updated") {
                const metricThreadId = event.codexThreadId ?? null;
                const activeTurnId = event.codexTurnId ?? state.codexTurnId ?? null;
                const turnBillingContext = event.codexTurnId
                    ? state.turnBillingContexts.get(event.codexTurnId)
                    : undefined;
                const threadBillingContext = metricThreadId
                    ? state.threadBillingContexts.get(metricThreadId)
                    : undefined;
                const activeTurnBillingContext = activeTurnId
                    ? state.turnBillingContexts.get(activeTurnId)
                    : undefined;
                const activeThreadTurnId = metricThreadId
                    ? logicalTurnRetries(state).find((retry) => retry.currentTurnId && retry.currentThreadId === metricThreadId)?.currentTurnId
                    : null;
                const activeThreadTurnBillingContext = activeThreadTurnId
                    ? state.turnBillingContexts.get(activeThreadTurnId)
                    : undefined;
                // A continuation can emit its first turnless metric before turn/started
                // binds the new context. Detached reviews also name the parent thread
                // while their fork is starting. Keep a running turn pinned ahead of
                // later thread setting changes, while an in-flight continuation may
                // supersede the prior turn on that same thread.
                const pendingThreadBillingContext = metricThreadId
                    ? state.pendingTurnBillingContexts.find((pending) => pending.method === "turn/start" &&
                        pending.context.threadId === metricThreadId)?.context
                    : undefined;
                const fallbackContext = turnBillingContext ??
                    pendingThreadBillingContext ??
                    activeThreadTurnBillingContext ??
                    threadBillingContext ??
                    activeTurnBillingContext ??
                    state.pendingTurnBillingContexts[0]?.context ??
                    this.captureTurnBillingContext(state, {}, metricThreadId);
                event = {
                    ...event,
                    payload: {
                        ...event.payload,
                        billingContext: {
                            ...fallbackContext,
                            threadId: metricThreadId ?? fallbackContext.threadId ?? null,
                            turnId: event.codexTurnId ?? fallbackContext.turnId ?? null,
                        },
                    },
                };
            }
            state.nextEventSeq += 1;
            const eventLogicalTurnRetry = logicalTurnRetryForEvent(state, event);
            const logicalDetachedReviewEvent = isDetachedReviewTurnEvent(state.detachedReviewRetry ?? null, event);
            if (logicalDetachedReviewEvent && event.codexThreadId) {
                state.detachedReviewThreadIds.add(event.codexThreadId);
            }
            const detachedReviewEvent = logicalDetachedReviewEvent ||
                Boolean(event.codexThreadId &&
                    state.detachedReviewThreadIds.has(event.codexThreadId));
            if (event.codexThreadId && !detachedReviewEvent) {
                state.codexThreadId = event.codexThreadId;
            }
            if (state.coldThreadRestorePending &&
                event.eventType === "thread.status.changed") {
                const status = threadStatusType(event.payload.status);
                if (status === "idle") {
                    state.idleThreadRestorePending = true;
                    state.codexTurnId = null;
                    state.activeTurnThreadId = null;
                }
                else if (status === "active") {
                    state.idleThreadRestorePending = false;
                }
            }
            if (event.eventType === "turn.completed") {
                this.rememberCompletedTurnId(state, event.codexTurnId ?? null);
                if (!state.codexTurnId ||
                    (event.codexTurnId && state.codexTurnId === event.codexTurnId)) {
                    state.codexTurnId = null;
                    state.activeTurnThreadId = null;
                }
            }
            else if (event.eventType === "turn.started") {
                this.bindPendingTurnBillingContext(state, event.codexTurnId ?? null, event.codexThreadId ?? null);
                const logicalTurnRetryStarted = eventLogicalTurnRetry?.startedFromRetry ?? null;
                this.recordLogicalTurnStarted(state, eventLogicalTurnRetry, event.codexTurnId ?? null, event.codexThreadId ?? null);
                event = {
                    ...event,
                    payload: {
                        ...event.payload,
                        ...this.pendingLogicalTurnRetryFields(state),
                        ...(logicalTurnRetryStarted
                            ? {
                                logicalTurnRetryStarted: logicalTurnRetryStarted,
                            }
                            : {}),
                    },
                };
                if (eventLogicalTurnRetry) {
                    eventLogicalTurnRetry.startedFromRetry = null;
                }
            }
            else if (event.codexTurnId &&
                !state.completedTurnIds.has(event.codexTurnId) &&
                !(event.eventType === "metrics.updated" &&
                    state.idleThreadRestorePending)) {
                // Cold attachment of an idle thread can replay token usage for its
                // last interrupted turn. Suppress only during that restore window;
                // warm resumes need metrics to recover a still-running turn because
                // thread/resume usually returns no top-level turn id.
                const primaryEventWhileDetachedReviewActive = eventLogicalTurnRetry === state.logicalTurnRetry &&
                    Boolean(state.detachedReviewRetry?.currentTurnId);
                if (!primaryEventWhileDetachedReviewActive) {
                    state.codexTurnId = event.codexTurnId;
                    state.activeTurnThreadId =
                        event.codexThreadId ??
                            state.activeTurnThreadId ??
                            state.codexThreadId ??
                            null;
                    if (event.eventType !== "metrics.updated") {
                        state.coldThreadRestorePending = false;
                    }
                    state.idleThreadRestorePending = false;
                }
            }
            this.rememberPendingApprovalRequest(state, message, event);
            this.markSessionFailedForTerminalEvent(state, event);
            events?.push(event);
            publishSessionEvent(state.onEvent, event);
            this.logSessionEvent(event);
            this.publishAuthMaterialUpdateAfterEvent(state, event);
            this.finishLogicalTurnForEvent(state, event);
        });
        attachedTransport.onStderr?.((chunk) => this.handleAppServerStderr(state, chunk));
        attachedTransport.onExit?.((exit) => this.handleAppServerExit(state, attachedTransport, exit));
    }
    handleAppServerExit(state, transport, exit) {
        if (this.sessions.get(state.sessionPayload.sessionId) !== state ||
            state.transport !== transport) {
            return;
        }
        if (state.transportClosedForRelaunch) {
            return;
        }
        state.transportRelaunchRequired = true;
        state.transportClosedForRelaunch = true;
        if (state.codexThreadId) {
            state.threadResumeRequired = true;
        }
        this.publishSyntheticTransportExitError(state, exit);
        state.codexTurnId = null;
        this.markPendingApprovalRequestsStale(state);
        this.consoleEventSink?.({
            source: "codex",
            event: "transport.exited",
            fields: {
                session: state.sessionPayload.sessionId,
                status: state.status,
                exitCode: exit.exitCode,
                signal: exit.signal,
                error: exit.error ?? null,
            },
        });
    }
    async materializeAuth(auth, durableCodexHomePath) {
        if (auth.codexAuthMaterial || auth.apiKey) {
            const sensitiveAuthRootPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-codex-auth-"));
            const codexHomePath = path.join(sensitiveAuthRootPath, "codex-home");
            try {
                const durableSessionsPath = await prepareDurableCodexSessionsPath(durableCodexHomePath);
                if (auth.codexAuthMaterial)
                    await materializeCodexAuthMaterial(auth.codexAuthMaterial, codexHomePath);
                else
                    // API-key login writes auth.json via RPC. Keep it out of the durable
                    // workspace and delete it with this session's sensitive auth root.
                    await fs.mkdir(codexHomePath, { recursive: true, mode: 0o700 });
                if (durableSessionsPath && this.transportFactory) {
                    await linkDurableCodexSessionsPath(codexHomePath, durableSessionsPath);
                }
                return {
                    codexHomePath,
                    durableSessionsPath: durableSessionsPath ?? undefined,
                    sensitiveAuthRootPath,
                };
            }
            catch (error) {
                await cleanupSensitiveAuthRoot(sensitiveAuthRootPath);
                throw error;
            }
        }
        if (auth.authMode === "codex_chatgpt") {
            throw new Error("Codex ChatGPT auth requires stored Codex auth material");
        }
        return {};
    }
    async ensureAppServerAuth(state) {
        const auth = state.auth;
        if (auth.codexAuthMaterial &&
            authMaterialCanPublishAsChatGpt(auth.codexAuthMaterial)) {
            const account = jsonResponse(await state.transport.request("account/read", {
                refreshToken: false,
            }))?.account;
            const accountRecord = jsonResponse(account);
            if (accountRecord?.type === "chatgpt") {
                return;
            }
            if (!auth.apiKey) {
                throw new Error("Codex ChatGPT auth material did not produce a ChatGPT account");
            }
        }
        else if (auth.codexAuthMaterial && !auth.apiKey) {
            throw new Error("Codex ChatGPT auth material did not produce a ChatGPT account");
        }
        if (auth.apiKey) {
            await state.transport.request("account/login/start", {
                type: "apiKey",
                apiKey: auth.apiKey,
            });
            const previousLane = state.activeLane;
            state.activeLane = "openai_api";
            if (previousLane !== "openai_api") {
                this.publishSyntheticRoutingSwitch(state, previousLane, "openai_api", "session_auth_api_key");
            }
        }
    }
    async readQuotaAndMaybeFallback(state, reason) {
        if (!state.auth.codexAuthMaterial || state.activeLane !== "chatgpt_plan") {
            return;
        }
        let quotaResponse = null;
        try {
            quotaResponse =
                jsonResponse(await state.transport.request("account/rateLimits/read", {})) ?? null;
        }
        catch (error) {
            this.publishCodexChatGptAuthInvalidIfNeeded(state, codexChatGptAuthInvalidReason(error));
            return;
        }
        if (quotaResponse) {
            this.publishSyntheticNotification(state, {
                method: "account/rateLimits/updated",
                params: quotaResponse,
            });
        }
        if (!quotaLimitReached(quotaResponse)) {
            return;
        }
        if (!state.auth.apiFallback || !state.auth.apiKey) {
            this.publishSyntheticRoutingUnavailable(state, "chatgpt_quota_no_api_fallback", "openai_api");
            return;
        }
        await this.tryBackupWarmChatGptAuthMaterial(state, "chatgpt_quota_fallback");
        await this.tryPublishCapturedChatGptAuthMaterialIfChanged(state, "chatgpt_quota_fallback");
        try {
            await state.transport.request("account/login/start", {
                type: "apiKey",
                apiKey: state.auth.apiKey,
            });
            state.transportAuthRestoreRequired = false;
        }
        catch (error) {
            this.publishSyntheticRoutingUnavailable(state, apiKeyAuthFailureReason(error) ?? "api_fallback_login_failed", "openai_api");
            throw error;
        }
        const previousLane = state.activeLane;
        const now = Date.now();
        state.lastChatGptFallbackAt = now;
        state.nextChatGptProbeAt = nextChatGptProbeAtFromRateLimits(quotaResponse, now, this.chatGptReturnProbeDelayMs);
        state.chatGptReturnProbeFailureCount = 0;
        state.apiFallbackRestoreRequired = false;
        state.activeLane = "openai_api";
        this.publishSyntheticRoutingSwitch(state, previousLane, "openai_api", reason);
    }
    // Returns true when an auth return/restore was attempted, so a caller-owned
    // thread resume can explicitly reapply lane-sensitive runtime settings.
    async maybeProbeChatGptReturn(state, reason) {
        if (state.activeLane !== "openai_api" ||
            !state.auth.codexAuthMaterial ||
            !state.auth.apiFallback ||
            !state.auth.apiKey ||
            state.chatGptAuthInvalidReason ||
            !isManagedMultiTurnLaunch(state.sessionPayload)) {
            return false;
        }
        if (state.apiFallbackRestoreRequired) {
            const restored = await this.restoreOpenAiApiLaneAfterChatGptProbe(state);
            if (!restored) {
                throw new Error("OpenAI API fallback could not be restored after ChatGPT return probe");
            }
            return true;
        }
        if (!canRestartForChatGptReturnProbe(state)) {
            return false;
        }
        const now = Date.now();
        const nextProbeAt = state.nextChatGptProbeAt ??
            (state.lastChatGptFallbackAt
                ? state.lastChatGptFallbackAt + this.chatGptReturnProbeDelayMs
                : now + this.chatGptReturnProbeDelayMs);
        if (now < nextProbeAt) {
            return false;
        }
        let quotaResponse = null;
        let restartedActiveIdleTransport = false;
        try {
            await this.withSessionAuthProfileLock(state, async () => {
                await this.restoreStoredChatGptAuthForProbe(state);
                const restart = await this.restartPausedTransportForChatGptReturnProbe(state);
                restartedActiveIdleTransport = restart.previousStatus === "active";
                const accountResponse = jsonResponse(await state.transport.request("account/read", {
                    refreshToken: true,
                })) ?? {};
                const account = jsonResponse(accountResponse.account);
                if (account?.type !== "chatgpt") {
                    throw new Error("Codex ChatGPT auth probe did not restore a ChatGPT account");
                }
                await this.tryPublishAuthMaterialUpdateIfChangedUnlocked(state, "chatgpt_return_probe", {
                    allowOpenAiApiLane: true,
                });
                await this.tryBackupWarmChatGptAuthMaterial(state, "chatgpt_return_probe");
                quotaResponse =
                    jsonResponse(await state.transport.request("account/rateLimits/read", {})) ?? null;
            });
        }
        catch (error) {
            const invalidReason = codexChatGptAuthInvalidReason(error);
            if (invalidReason) {
                state.nextChatGptProbeAt = Date.now() + this.chatGptReturnProbeDelayMs;
            }
            else {
                this.scheduleChatGptReturnProbeFailureRetry(state);
            }
            const restored = await this.restoreOpenAiApiLaneAfterChatGptProbe(state);
            if (invalidReason) {
                this.publishCodexChatGptAuthInvalidIfNeeded(state, invalidReason, {
                    allowOpenAiApiLane: true,
                    apiFallbackHealthy: restored,
                });
            }
            if (!restored) {
                throw new Error("OpenAI API fallback could not be restored after ChatGPT return probe");
            }
            return true;
        }
        if (quotaLimitReached(quotaResponse)) {
            state.chatGptReturnProbeFailureCount = 0;
            state.nextChatGptProbeAt = nextChatGptProbeAtFromRateLimits(quotaResponse, Date.now(), this.chatGptReturnProbeDelayMs);
            const restored = await this.restoreOpenAiApiLaneAfterChatGptProbe(state);
            if (!restored) {
                throw new Error("OpenAI API fallback could not be restored after ChatGPT return probe");
            }
            return true;
        }
        if (restartedActiveIdleTransport) {
            try {
                await this.resumeThreadAfterActiveReturnProbe(state, "chatgpt_plan");
            }
            catch (error) {
                const invalidReason = codexChatGptAuthInvalidReason(error);
                if (invalidReason) {
                    state.nextChatGptProbeAt =
                        Date.now() + this.chatGptReturnProbeDelayMs;
                }
                else {
                    this.scheduleChatGptReturnProbeFailureRetry(state);
                }
                const restored = await this.restoreOpenAiApiLaneAfterChatGptProbe(state, {
                    resumeActiveThread: false,
                });
                if (!restored) {
                    this.publishCodexChatGptAuthInvalidIfNeeded(state, invalidReason, {
                        allowOpenAiApiLane: true,
                        apiFallbackHealthy: false,
                    });
                    throw new Error("OpenAI API fallback could not be restored after ChatGPT return probe");
                }
                await this.resumeThreadAfterRestoredActiveReturnProbe(state);
                if (invalidReason) {
                    this.publishCodexChatGptAuthInvalidIfNeeded(state, invalidReason, {
                        allowOpenAiApiLane: true,
                        apiFallbackHealthy: true,
                    });
                }
                return true;
            }
        }
        const previousLane = state.activeLane;
        state.activeLane = "chatgpt_plan";
        state.nextChatGptProbeAt = null;
        state.lastChatGptFallbackAt = null;
        state.chatGptReturnProbeFailureCount = 0;
        state.apiFallbackRestoreRequired = false;
        state.usageRoutingUnavailablePublishedReasons.clear();
        this.publishSyntheticRoutingSwitch(state, previousLane, "chatgpt_plan", reason);
        if (quotaResponse) {
            this.publishSyntheticNotification(state, {
                method: "account/rateLimits/updated",
                params: quotaResponse,
            });
        }
        return true;
    }
    async restoreStoredChatGptAuthForProbe(state) {
        const restoredFromWarmBackup = await this.dockerRuntime.restoreSessionChatGptAuthMaterialBackup(state.sessionPayload.sessionId);
        if (restoredFromWarmBackup) {
            return;
        }
        this.consoleEventSink?.({
            source: "codex",
            event: "auth.chatgpt_restore_host_fallback",
            fields: {
                session: state.sessionPayload.sessionId,
                profile: state.sessionPayload.authProfileId ?? null,
            },
        });
        const authMaterial = state.chatGptAuthMaterial ?? state.auth.codexAuthMaterial;
        if (!authMaterial || !state.authMaterialCodexHomePath) {
            throw new Error("Codex ChatGPT auth probe has no stored ChatGPT auth material");
        }
        await materializeCodexAuthMaterial(authMaterial, state.authMaterialCodexHomePath);
    }
    scheduleChatGptReturnProbeFailureRetry(state) {
        const failureCount = (state.chatGptReturnProbeFailureCount ?? 0) + 1;
        state.chatGptReturnProbeFailureCount = failureCount;
        state.nextChatGptProbeAt =
            Date.now() +
                chatGptReturnProbeFailureBackoffMs(this.chatGptReturnProbeDelayMs, failureCount);
    }
    async restartPausedTransportForChatGptReturnProbe(state) {
        if (!canRestartForChatGptReturnProbe(state)) {
            throw new Error("Codex ChatGPT return probe requires a paused or idle warm session restart");
        }
        if (!state.authMaterialCodexHomePath) {
            throw new Error("Codex ChatGPT return probe has no auth home to restart from");
        }
        const previousStatus = state.status;
        await this.closeTransportBeforeRelaunch(state);
        await this.dockerRuntime.removeSessionContainerNameBeforeRelaunch(state.sessionPayload.sessionId);
        state.transportRelaunchRequired = true;
        if (state.codexThreadId) {
            state.threadResumeRequired = true;
        }
        const launchPayload = withCodexHomePath(state.sessionPayload, state.authMaterialCodexHomePath);
        const launched = await this.launchTransport(launchPayload, state.auth.env, state.sensitiveAuthRootPath ?? undefined, state.durableCodexSessionsPath ?? undefined);
        this.replaceSessionTransportFromLaunch(state, launched);
        await initializeAuthTransport(state.transport);
        state.transportRelaunchRequired = false;
        state.transportAuthRestoreRequired = false;
        if (previousStatus === "paused") {
            this.dockerRuntime.markSessionPaused(state.sessionPayload.sessionId);
        }
        else {
            this.dockerRuntime.markSessionRunning(state.sessionPayload.sessionId);
        }
        return { previousStatus };
    }
    async resumeThreadAfterActiveReturnProbe(state, targetLane) {
        const threadId = state.codexThreadId;
        if (!threadId) {
            throw new Error("Codex ChatGPT return probe cannot resume an active session without a thread id");
        }
        const response = await this.requestThreadWithChatGptAuthInvalidHandling(state, "thread/resume", threadResumeParams(state.sessionPayload, {
            threadId,
            persistExtendedHistory: false,
            replayRuntimeConfig: true,
        }, this.authTransitionThreadResumeOverrides(state, threadId)), targetLane);
        state.codexThreadId = extractThreadId(response) ?? threadId;
        state.codexTurnId = extractTurnId(response) ?? null;
        state.threadResumeRequired = false;
    }
    async resumeThreadAfterRestoredActiveReturnProbe(state) {
        try {
            await this.resumeThreadAfterActiveReturnProbe(state, "openai_api");
        }
        catch (error) {
            state.nextChatGptProbeAt = 0;
            throw error;
        }
    }
    async tryBackupWarmChatGptAuthMaterial(state, source) {
        if (!state.auth.codexAuthMaterial) {
            return;
        }
        try {
            await this.dockerRuntime.backupSessionChatGptAuthMaterial(state.sessionPayload.sessionId);
            await this.backupHostChatGptAuthMaterial(state, source);
        }
        catch (error) {
            this.consoleEventSink?.({
                source: "codex",
                event: "auth.chatgpt_backup_failed",
                fields: {
                    session: state.sessionPayload.sessionId,
                    profile: state.sessionPayload.authProfileId ?? null,
                    trigger: source,
                    reason: error instanceof Error ? error.message : String(error),
                },
            });
        }
    }
    async backupHostChatGptAuthMaterial(state, source) {
        if (!state.authMaterialCodexHomePath) {
            return;
        }
        await this.dockerRuntime.prepareSessionCodexHomeAuthMaterialForHostRead(state.sessionPayload.sessionId);
        const authMaterial = await archiveCodexAuthMaterial(state.authMaterialCodexHomePath);
        if (!authMaterialCanPublishAsChatGpt(authMaterial)) {
            this.consoleEventSink?.({
                source: "codex",
                event: "auth.chatgpt_backup_skipped",
                fields: {
                    session: state.sessionPayload.sessionId,
                    profile: state.sessionPayload.authProfileId ?? null,
                    trigger: source,
                    reason: "not_chatgpt_auth_material",
                },
            });
            return;
        }
        state.chatGptAuthMaterial = authMaterial;
    }
    async restoreOpenAiApiLaneAfterChatGptProbe(state, options = {}) {
        state.activeLane = "openai_api";
        const resumeActiveThread = options.resumeActiveThread ?? true;
        try {
            await this.relaunchTransportForOpenAiApiRestoreIfNeeded(state);
            await state.transport.request("account/login/start", {
                type: "apiKey",
                apiKey: state.auth.apiKey,
            });
            if (resumeActiveThread &&
                state.threadResumeRequired &&
                state.status === "active" &&
                state.codexThreadId) {
                await this.resumeThreadAfterRestoredActiveReturnProbe(state);
            }
            state.apiFallbackRestoreRequired = false;
            return true;
        }
        catch (error) {
            state.apiFallbackRestoreRequired = true;
            state.nextChatGptProbeAt = Date.now() + this.chatGptReturnProbeDelayMs;
            this.publishSyntheticRoutingUnavailable(state, apiKeyAuthFailureReason(error) ?? "api_fallback_login_failed", "openai_api");
            return false;
        }
    }
    async ensureWarmTransportReadyForCommand(state, options = {}) {
        const resumeThread = options.resumeThread ?? true;
        const deferThreadResumeForDueProbe = options.deferThreadResumeForDueProbe ?? false;
        if (state.apiFallbackRestoreRequired) {
            const restored = await this.restoreOpenAiApiLaneAfterChatGptProbe(state, {
                resumeActiveThread: resumeThread,
            });
            if (!restored) {
                throw new Error("OpenAI API fallback could not be restored after ChatGPT return probe");
            }
            return { restoredApiFallback: true };
        }
        const relaunched = await this.relaunchWarmTransportIfNeeded(state);
        if (relaunched || state.transportAuthRestoreRequired) {
            await this.restoreAuthAfterWarmTransportRelaunch(state);
            state.transportAuthRestoreRequired = false;
        }
        if (resumeThread &&
            !(deferThreadResumeForDueProbe &&
                this.shouldDeferThreadResumeToDueChatGptReturnProbe(state))) {
            await this.resumeThreadAfterRequiredRelaunch(state);
        }
        return { restoredApiFallback: false };
    }
    shouldDeferThreadResumeToDueChatGptReturnProbe(state) {
        if (!state.threadResumeRequired ||
            state.activeLane !== "openai_api" ||
            !state.auth.codexAuthMaterial ||
            !state.auth.apiFallback ||
            !state.auth.apiKey ||
            state.chatGptAuthInvalidReason ||
            !isManagedMultiTurnLaunch(state.sessionPayload) ||
            !canRestartForChatGptReturnProbe(state)) {
            return false;
        }
        return (state.nextChatGptProbeAt ?? Number.POSITIVE_INFINITY) <= Date.now();
    }
    async restoreAuthAfterWarmTransportRelaunch(state) {
        await this.withSessionAuthProfileLock(state, async () => {
            if (state.activeLane === "openai_api") {
                if (!state.auth.apiKey) {
                    throw new Error("Codex OpenAI API lane has no API key to restore after transport relaunch");
                }
                await this.requestWithChatGptAuthInvalidHandling(state, "account/login/start", {
                    type: "apiKey",
                    apiKey: state.auth.apiKey,
                });
                return;
            }
            await this.ensureAppServerAuth(state);
        });
    }
    async relaunchWarmTransportIfNeeded(state) {
        if (!state.transportRelaunchRequired) {
            return false;
        }
        await this.closeTransportBeforeRelaunch(state);
        await this.dockerRuntime.removeSessionContainerNameBeforeRelaunch(state.sessionPayload.sessionId);
        const launchPayload = state.authMaterialCodexHomePath
            ? withCodexHomePath(state.sessionPayload, state.authMaterialCodexHomePath)
            : state.sessionPayload;
        const launched = await this.launchTransport(launchPayload, state.auth.env, state.sensitiveAuthRootPath ?? undefined, state.durableCodexSessionsPath ?? undefined);
        this.replaceSessionTransportFromLaunch(state, launched);
        await initializeAuthTransport(state.transport);
        state.transportRelaunchRequired = false;
        state.transportAuthRestoreRequired = true;
        if (state.codexThreadId) {
            state.threadResumeRequired = true;
        }
        this.markDockerRuntimeStateAfterWarmRelaunch(state);
        return true;
    }
    markDockerRuntimeStateAfterWarmRelaunch(state) {
        if (state.status === "paused") {
            this.dockerRuntime.markSessionPaused(state.sessionPayload.sessionId);
        }
        else if (state.status === "active") {
            this.dockerRuntime.markSessionRunning(state.sessionPayload.sessionId);
        }
    }
    async relaunchTransportForOpenAiApiRestoreIfNeeded(state) {
        if (!state.transportRelaunchRequired) {
            return false;
        }
        if (!state.authMaterialCodexHomePath) {
            throw new Error("Codex OpenAI API restore has no auth home to relaunch from");
        }
        await this.closeTransportBeforeRelaunch(state);
        await this.dockerRuntime.removeSessionContainerNameBeforeRelaunch(state.sessionPayload.sessionId);
        const launchPayload = withCodexHomePath(state.sessionPayload, state.authMaterialCodexHomePath);
        const launched = await this.launchTransport(launchPayload, state.auth.env, state.sensitiveAuthRootPath ?? undefined, state.durableCodexSessionsPath ?? undefined);
        this.replaceSessionTransportFromLaunch(state, launched);
        await initializeAuthTransport(state.transport);
        state.transportRelaunchRequired = false;
        if (state.codexThreadId) {
            state.threadResumeRequired = true;
        }
        if (state.status === "paused") {
            this.dockerRuntime.markSessionPaused(state.sessionPayload.sessionId);
        }
        else if (state.status === "active") {
            this.dockerRuntime.markSessionRunning(state.sessionPayload.sessionId);
        }
        return true;
    }
    async resumeThreadAfterRequiredRelaunch(state) {
        if (!state.threadResumeRequired) {
            return;
        }
        const threadId = state.codexThreadId;
        if (!threadId) {
            throw new Error("Codex transport relaunch cannot resume a session without a thread id");
        }
        const response = await this.requestThreadWithChatGptAuthInvalidHandling(state, "thread/resume", threadResumeParams(state.sessionPayload, {
            threadId,
            persistExtendedHistory: false,
            replayRuntimeConfig: true,
        }, this.authTransitionThreadResumeOverrides(state, threadId)));
        state.codexThreadId = extractThreadId(response) ?? threadId;
        state.codexTurnId = extractTurnId(response) ?? null;
        state.threadResumeRequired = false;
    }
    async closeTransportBeforeRelaunch(state) {
        if (state.transportClosedForRelaunch) {
            return;
        }
        state.transportClosedForRelaunch = true;
        await state.transport.close();
    }
    replaceSessionTransportFromLaunch(state, launched) {
        this.markPendingApprovalRequestsStale(state);
        state.transport = launched.transport;
        state.codexCwd = launched.codexCwd;
        state.resolvedNetworkMode = launched.networkMode ?? null;
        state.transportClosedForRelaunch = false;
        state.resolvedApprovalRequestKeys.clear();
        this.attachSessionTransportHandlers(state);
    }
    markPendingApprovalRequestsStale(state) {
        for (const key of state.pendingApprovalRequests.keys()) {
            state.staleApprovalRequestKeys.add(key);
        }
        state.pendingApprovalRequests.clear();
        state.resolvedApprovalRequestKeys.clear();
    }
    handleAppServerStderr(state, chunk) {
        this.publishCodexChatGptAuthInvalidIfNeeded(state, codexChatGptAuthInvalidReason(chunk));
    }
    async requestWithChatGptAuthInvalidHandling(state, method, params, lane = state.activeLane) {
        try {
            return await state.transport.request(method, effectiveRequestParamsForLane(params, lane));
        }
        catch (error) {
            if (lane === "chatgpt_plan") {
                this.publishCodexChatGptAuthInvalidIfNeeded(state, codexChatGptAuthInvalidReason(error));
            }
            else {
                this.publishSyntheticRoutingUnavailableIfNeeded(state, apiKeyAuthFailureReason(error));
            }
            throw error;
        }
    }
    async requestThreadWithChatGptAuthInvalidHandling(state, method, params, lane = state.activeLane) {
        const effectiveParams = effectiveRequestParamsForLane(params, lane);
        const response = await this.requestWithChatGptAuthInvalidHandling(state, method, effectiveParams, lane);
        const threadId = extractThreadId(response) ?? optionalString(effectiveParams.threadId);
        if (!threadId) {
            return response;
        }
        this.rememberThreadRequestedServiceTier(state, threadId, params);
        const hasEffectiveServiceTier = Object.prototype.hasOwnProperty.call(effectiveParams, "serviceTier");
        if (method === "thread/start" || hasEffectiveServiceTier) {
            const billingParams = hasEffectiveServiceTier
                ? effectiveParams
                : { ...effectiveParams, serviceTier: null };
            this.rememberThreadBillingContext(state, threadId, this.captureTurnBillingContext(state, billingParams, threadId, undefined, lane));
        }
        return response;
    }
    authTransitionThreadResumeOverrides(state, threadId, overrides = undefined) {
        if (overrides &&
            Object.prototype.hasOwnProperty.call(overrides, "serviceTier")) {
            return overrides;
        }
        if (state.threadRequestedServiceTiers.has(threadId)) {
            return {
                ...(overrides ?? {}),
                serviceTier: state.threadRequestedServiceTiers.get(threadId) ?? null,
            };
        }
        const defaultServiceTier = turnParams(state.sessionPayload).serviceTier;
        return defaultServiceTier === undefined
            ? overrides
            : {
                ...(overrides ?? {}),
                serviceTier: defaultServiceTier,
            };
    }
    async ensureRequestedServiceTierForApiLane(state, threadId) {
        if (state.activeLane !== "openai_api" ||
            !state.threadRequestedServiceTiers.has(threadId)) {
            return;
        }
        const requestedServiceTier = state.threadRequestedServiceTiers.get(threadId) ?? null;
        const effectiveServiceTierParams = effectiveRequestParamsForLane({ serviceTier: requestedServiceTier }, state.activeLane);
        const effectiveServiceTier = optionalString(effectiveServiceTierParams.serviceTier) ?? "regular";
        if (state.threadBillingContexts.get(threadId)?.serviceTier ===
            effectiveServiceTier) {
            return;
        }
        const settingsParams = {
            threadId,
            serviceTier: requestedServiceTier,
        };
        const effectiveSettingsParams = effectiveRequestParamsForLane(settingsParams, state.activeLane);
        await this.requestWithChatGptAuthInvalidHandling(state, "thread/settings/update", settingsParams);
        this.rememberThreadRequestedServiceTier(state, threadId, settingsParams);
        this.rememberThreadBillingContext(state, threadId, this.captureTurnBillingContext(state, effectiveSettingsParams, threadId, undefined, state.activeLane));
    }
    async requestPhysicalTurn(state, method, params, options = {}) {
        const effectiveParams = effectiveRequestParamsForLane(params, state.activeLane);
        if (options.logTurnStart) {
            this.logTurnStart(state.sessionPayload.sessionId, optionalString(effectiveParams.threadId) ??
                state.codexThreadId ??
                "unknown", effectiveParams);
        }
        const context = this.captureTurnBillingContext(state, effectiveParams, optionalString(effectiveParams.threadId) ?? state.codexThreadId ?? null, method);
        const pending = {
            method,
            context,
        };
        state.pendingTurnBillingContexts.push(pending);
        try {
            const response = await this.requestWithChatGptAuthInvalidHandling(state, method, effectiveParams);
            const requestThreadId = optionalString(params.threadId) ?? state.codexThreadId ?? null;
            if (requestThreadId) {
                this.rememberThreadRequestedServiceTier(state, requestThreadId, params);
            }
            const turnId = extractTurnId(response);
            if (turnId) {
                this.rememberTurnBillingContext(state, turnId, {
                    ...context,
                    turnId,
                    threadId: extractReviewThreadId(response) ?? context.threadId ?? null,
                });
            }
            return response;
        }
        finally {
            const pendingIndex = state.pendingTurnBillingContexts.indexOf(pending);
            if (pendingIndex >= 0) {
                state.pendingTurnBillingContexts.splice(pendingIndex, 1);
            }
        }
    }
    captureTurnBillingContext(state, params, threadId, method, lane = state.activeLane) {
        const defaults = turnParams(state.sessionPayload, {
            cwd: state.codexCwd,
            resolvedNetworkMode: state.resolvedNetworkMode,
        });
        const runtimeSnapshot = state.sessionPayload.runtimeSnapshot;
        const researcher = jsonRecord(runtimeSnapshot.researcher);
        const modelDefaults = Object.keys(researcher).length > 0
            ? researcher
            : jsonRecord(runtimeSnapshot.modelDefaults);
        const codexConfig = jsonRecord(runtimeSnapshot.codexConfig);
        const threadContext = threadId
            ? state.threadBillingContexts.get(threadId)
            : undefined;
        const hasModel = Object.prototype.hasOwnProperty.call(params, "model");
        const model = hasModel
            ? (optionalString(params.model) ?? optionalString(defaults.model) ?? null)
            : (threadContext?.model ?? optionalString(defaults.model) ?? null);
        const hasServiceTier = Object.prototype.hasOwnProperty.call(params, "serviceTier");
        const serviceTier = hasServiceTier
            ? (optionalString(params.serviceTier) ?? "regular")
            : method === "review/start"
                ? (threadContext?.serviceTier ??
                    optionalString(modelDefaults.serviceTier) ??
                    optionalString(defaults.serviceTier) ??
                    null)
                : (optionalString(modelDefaults.serviceTier) ??
                    optionalString(defaults.serviceTier) ??
                    threadContext?.serviceTier ??
                    null);
        const inferenceType = inferenceTypeForCodexServiceTier(serviceTier) ??
            optionalString(params.inferenceType) ??
            threadContext?.inferenceType ??
            optionalString(modelDefaults.inferenceType) ??
            null;
        return {
            lane,
            provider: optionalString(params.modelProvider) ??
                threadContext?.provider ??
                optionalString(modelDefaults.modelProvider) ??
                optionalString(codexConfig.modelProvider) ??
                (state.auth.provider || "openai"),
            model,
            serviceTier,
            inferenceType,
            threadId,
            turnId: null,
            capturedAt: new Date().toISOString(),
        };
    }
    bindPendingTurnBillingContext(state, turnId, threadId) {
        if (!turnId) {
            return;
        }
        const existing = state.turnBillingContexts.get(turnId);
        if (existing) {
            this.rememberTurnBillingContext(state, turnId, {
                ...existing,
                threadId: threadId ?? existing.threadId ?? null,
            });
            return;
        }
        const pending = state.pendingTurnBillingContexts.shift()?.context ??
            this.captureTurnBillingContext(state, {}, threadId);
        this.rememberTurnBillingContext(state, turnId, {
            ...pending,
            threadId: threadId ?? pending.threadId ?? null,
            turnId,
        });
    }
    rememberTurnBillingContext(state, turnId, context) {
        state.turnBillingContexts.set(turnId, context);
        if (context.threadId) {
            this.rememberThreadBillingContext(state, context.threadId, context);
        }
        while (state.turnBillingContexts.size > 256) {
            const oldestTurnId = state.turnBillingContexts.keys().next().value;
            if (!oldestTurnId) {
                break;
            }
            state.turnBillingContexts.delete(oldestTurnId);
        }
    }
    rememberThreadBillingContext(state, threadId, context) {
        state.threadBillingContexts.delete(threadId);
        state.threadBillingContexts.set(threadId, context);
        while (state.threadBillingContexts.size > 256) {
            const oldestThreadId = state.threadBillingContexts.keys().next().value;
            if (!oldestThreadId) {
                break;
            }
            state.threadBillingContexts.delete(oldestThreadId);
        }
    }
    rememberThreadRequestedServiceTier(state, threadId, params) {
        if (!Object.prototype.hasOwnProperty.call(params, "serviceTier")) {
            return;
        }
        state.threadRequestedServiceTiers.delete(threadId);
        state.threadRequestedServiceTiers.set(threadId, optionalString(params.serviceTier) ?? null);
        while (state.threadRequestedServiceTiers.size > 256) {
            const oldestThreadId = state.threadRequestedServiceTiers
                .keys()
                .next().value;
            if (!oldestThreadId) {
                break;
            }
            state.threadRequestedServiceTiers.delete(oldestThreadId);
        }
    }
    publishCodexChatGptAuthInvalidIfNeeded(state, reason, options = {}) {
        const allowedApiLane = options.allowOpenAiApiLane === true && state.activeLane === "openai_api";
        const laneAllowsPublication = state.activeLane === "chatgpt_plan" || allowedApiLane;
        if (!reason ||
            state.chatGptAuthInvalidPublished ||
            !state.auth.codexAuthMaterial ||
            !laneAllowsPublication) {
            return;
        }
        state.chatGptAuthInvalidReason = reason;
        state.chatGptAuthInvalidPublished = true;
        if (allowedApiLane && options.apiFallbackHealthy === true) {
            this.publishSyntheticRoutingUnavailable(state, "chatgpt_auth_invalid_api_fallback_active", null, {
                authProfileId: state.sessionPayload.authProfileId ?? null,
                authFingerprintSha256: state.authMaterialBaseFingerprintSha256 ?? null,
                authInvalidReason: reason,
                code: CodexChatGptAuthInvalidCode,
            });
            return;
        }
        const event = {
            seq: state.nextEventSeq,
            vmEventStreamId: state.eventStreamId,
            sessionId: state.sessionPayload.sessionId,
            workspaceId: state.sessionPayload.workspaceId,
            vmHostId: state.sessionPayload.vmHostId,
            eventType: "session.error",
            codexThreadId: state.codexThreadId ?? state.sessionPayload.codexThreadId ?? null,
            codexTurnId: state.codexTurnId ?? null,
            itemId: null,
            payload: {
                authProfileId: state.sessionPayload.authProfileId ?? null,
                authFingerprintSha256: state.authMaterialBaseFingerprintSha256 ?? null,
                code: CodexChatGptAuthInvalidCode,
                message: CodexChatGptAuthInvalidMessage,
                reason,
                recoverable: true,
            },
            rawPayload: {
                method: "yp-live-workflow/codexChatGptAuthInvalid",
                params: {
                    code: CodexChatGptAuthInvalidCode,
                    reason,
                    authFingerprintSha256: state.authMaterialBaseFingerprintSha256 ?? null,
                },
            },
        };
        state.nextEventSeq += 1;
        publishSessionEvent(state.onEvent, event);
        this.logSessionEvent(event);
    }
    throwIfChatGptAuthInvalid(state) {
        if (state.chatGptAuthInvalidReason && state.activeLane !== "openai_api") {
            throw new Error(CodexChatGptAuthInvalidMessage);
        }
    }
    publishAuthMaterialUpdateAfterEvent(state, event) {
        if (event.eventType !== "turn.completed" &&
            event.eventType !== "thread.closed" &&
            event.eventType !== "session.error") {
            return;
        }
        void this.tryPublishAuthMaterialUpdateIfChanged(state, event.eventType);
    }
    async tryPublishSessionEndAuthMaterialUpdateIfChanged(state, source) {
        await this.tryPublishAuthMaterialUpdateIfChanged(state, source);
        await this.tryPublishCapturedChatGptAuthMaterialIfChanged(state, source);
    }
    async tryPublishAuthMaterialUpdateIfChanged(state, source) {
        try {
            await this.publishAuthMaterialUpdateIfChanged(state, source);
        }
        catch (error) {
            this.consoleEventSink?.({
                source: "codex",
                event: "auth.material_update_failed",
                fields: {
                    session: state.sessionPayload.sessionId,
                    profile: state.sessionPayload.authProfileId ?? null,
                    reason: error instanceof Error ? error.message : String(error),
                },
            });
        }
    }
    async tryPublishCapturedChatGptAuthMaterialIfChanged(state, source) {
        try {
            await this.publishCapturedChatGptAuthMaterialIfChanged(state, source);
        }
        catch (error) {
            this.consoleEventSink?.({
                source: "codex",
                event: "auth.material_update_failed",
                fields: {
                    session: state.sessionPayload.sessionId,
                    profile: state.sessionPayload.authProfileId ?? null,
                    reason: error instanceof Error ? error.message : String(error),
                },
            });
        }
    }
    async tryPublishAuthMaterialUpdateIfChangedUnlocked(state, source, options = {}) {
        try {
            await this.publishAuthMaterialUpdateIfChangedUnlocked(state, source, options);
        }
        catch (error) {
            this.consoleEventSink?.({
                source: "codex",
                event: "auth.material_update_failed",
                fields: {
                    session: state.sessionPayload.sessionId,
                    profile: state.sessionPayload.authProfileId ?? null,
                    reason: error instanceof Error ? error.message : String(error),
                },
            });
        }
    }
    async publishAuthMaterialUpdateIfChanged(state, source) {
        const authProfileId = state.sessionPayload.authProfileId;
        if (!this.authMaterialUpdateSink ||
            !authProfileId ||
            !state.auth.codexAuthMaterial ||
            state.activeLane !== "chatgpt_plan" ||
            !state.authMaterialCodexHomePath ||
            !state.authMaterialBaseFingerprintSha256 ||
            state.chatGptAuthInvalidReason) {
            return;
        }
        await this.withAuthProfileLock(authProfileId, () => this.publishAuthMaterialUpdateIfChangedUnlocked(state, source));
    }
    async publishCapturedChatGptAuthMaterialIfChanged(state, source) {
        const authProfileId = state.sessionPayload.authProfileId;
        if (!this.authMaterialUpdateSink ||
            !authProfileId ||
            !state.auth.codexAuthMaterial ||
            !state.chatGptAuthMaterial ||
            !state.authMaterialBaseFingerprintSha256 ||
            state.chatGptAuthInvalidReason) {
            return;
        }
        await this.withAuthProfileLock(authProfileId, () => this.publishCapturedChatGptAuthMaterialIfChangedUnlocked(state, source));
    }
    async publishCapturedChatGptAuthMaterialIfChangedUnlocked(state, source) {
        const authMaterial = state.chatGptAuthMaterial;
        if (!authMaterial || !authMaterialCanPublishAsChatGpt(authMaterial)) {
            return;
        }
        await this.publishKnownAuthMaterialUpdateIfChangedUnlocked(state, source, authMaterial);
    }
    async publishAuthMaterialUpdateIfChangedUnlocked(state, source, options = {}) {
        const authProfileId = state.sessionPayload.authProfileId;
        const baseFingerprintSha256 = state.authMaterialBaseFingerprintSha256;
        const laneAllowsPublication = state.activeLane === "chatgpt_plan" ||
            (options.allowOpenAiApiLane === true &&
                state.activeLane === "openai_api");
        if (!authProfileId ||
            !state.auth.codexAuthMaterial ||
            !state.authMaterialCodexHomePath ||
            !baseFingerprintSha256 ||
            !laneAllowsPublication ||
            state.chatGptAuthInvalidReason) {
            return;
        }
        await this.dockerRuntime.prepareSessionCodexHomeAuthMaterialForHostRead(state.sessionPayload.sessionId);
        const authMaterial = await archiveCodexAuthMaterial(state.authMaterialCodexHomePath);
        if (!authMaterialCanPublishAsChatGpt(authMaterial)) {
            this.consoleEventSink?.({
                source: "codex",
                event: "auth.material_update_skipped",
                fields: {
                    session: state.sessionPayload.sessionId,
                    profile: authProfileId,
                    reason: "not_chatgpt_auth_material",
                    trigger: source,
                },
            });
            return;
        }
        if (state.activeLane !== "chatgpt_plan" &&
            !(options.allowOpenAiApiLane === true && state.activeLane === "openai_api")) {
            return;
        }
        state.chatGptAuthMaterial = authMaterial;
        await this.publishKnownAuthMaterialUpdateIfChangedUnlocked(state, source, authMaterial);
    }
    async publishKnownAuthMaterialUpdateIfChangedUnlocked(state, source, authMaterial) {
        const authProfileId = state.sessionPayload.authProfileId;
        const baseFingerprintSha256 = state.authMaterialBaseFingerprintSha256;
        if (!this.authMaterialUpdateSink ||
            !authProfileId ||
            !baseFingerprintSha256 ||
            state.chatGptAuthInvalidReason) {
            return;
        }
        const currentFingerprintSha256 = codexAuthMaterialFingerprintSha256(authMaterial);
        if (currentFingerprintSha256 === baseFingerprintSha256 ||
            currentFingerprintSha256 ===
                state.authMaterialLastPublishedFingerprintSha256) {
            return;
        }
        await this.authMaterialUpdateSink.publishCodexAuthMaterialUpdated({
            vmHostId: state.sessionPayload.vmHostId,
            sessionId: state.sessionPayload.sessionId,
            authProfileId,
            baseFingerprintSha256,
            currentFingerprintSha256,
            authMaterial,
            source,
            updatedAt: new Date().toISOString(),
        });
        state.authMaterialBaseFingerprintSha256 = currentFingerprintSha256;
        state.authMaterialLastPublishedFingerprintSha256 = currentFingerprintSha256;
    }
    async withSessionAuthProfileLock(state, fn) {
        const authProfileId = state.sessionPayload.authProfileId;
        if (!authProfileId || !state.auth.codexAuthMaterial) {
            return fn();
        }
        return this.withAuthProfileLock(authProfileId, fn);
    }
    async withSessionOperationLock(state, fn) {
        return this.withLock(this.sessionOperationLocks, state.sessionPayload.sessionId, fn);
    }
    async withAuthProfileLock(authProfileId, fn) {
        return this.withLock(this.authProfileLocks, authProfileId, fn);
    }
    async withLock(locks, key, fn) {
        const previous = locks.get(key) ?? Promise.resolve();
        let release = () => undefined;
        const waitForRelease = new Promise((resolve) => {
            release = resolve;
        });
        const current = previous.catch(() => undefined).then(() => waitForRelease);
        locks.set(key, current);
        await previous.catch(() => undefined);
        try {
            return await fn();
        }
        finally {
            release();
            if (locks.get(key) === current) {
                locks.delete(key);
            }
        }
    }
    publishSyntheticNotification(state, message) {
        const event = normalizeCodexNotification(state.sessionPayload, message, state.nextEventSeq, state.eventStreamId);
        if (!event) {
            return;
        }
        state.nextEventSeq += 1;
        publishSessionEvent(state.onEvent, event);
        this.logSessionEvent(event);
    }
    publishSyntheticRoutingSwitch(state, previousLane, activeLane, reason) {
        const event = {
            seq: state.nextEventSeq,
            vmEventStreamId: state.eventStreamId,
            sessionId: state.sessionPayload.sessionId,
            workspaceId: state.sessionPayload.workspaceId,
            vmHostId: state.sessionPayload.vmHostId,
            eventType: "usage.routing.switched",
            codexThreadId: state.codexThreadId ?? state.sessionPayload.codexThreadId ?? null,
            codexTurnId: state.codexTurnId ?? null,
            itemId: null,
            payload: {
                previousLane,
                activeLane,
                reason,
            },
            rawPayload: {
                method: "yp-live-workflow/usageRouting/switched",
                params: {
                    previousLane,
                    activeLane,
                    reason,
                },
            },
        };
        state.nextEventSeq += 1;
        publishSessionEvent(state.onEvent, event);
        this.logSessionEvent(event);
    }
    publishSyntheticTransportExitError(state, exit) {
        if (state.status !== "active") {
            return;
        }
        const message = exit.error ??
            `Codex app-server exited (${exit.signal ?? exit.exitCode ?? "unknown"})`;
        const event = {
            seq: state.nextEventSeq,
            vmEventStreamId: state.eventStreamId,
            sessionId: state.sessionPayload.sessionId,
            workspaceId: state.sessionPayload.workspaceId,
            vmHostId: state.sessionPayload.vmHostId,
            eventType: "session.error",
            codexThreadId: state.codexThreadId ?? state.sessionPayload.codexThreadId ?? null,
            codexTurnId: state.codexTurnId ?? null,
            itemId: null,
            payload: {
                code: CodexAppServerExitedCode,
                message,
                recoverable: true,
                exitCode: exit.exitCode,
                signal: exit.signal,
            },
            rawPayload: {
                method: "yp-live-workflow/codexAppServer/exited",
                params: {
                    code: CodexAppServerExitedCode,
                    exitCode: exit.exitCode,
                    signal: exit.signal,
                    error: exit.error ?? null,
                    recoverable: true,
                },
            },
        };
        state.nextEventSeq += 1;
        publishSessionEvent(state.onEvent, event);
        this.logSessionEvent(event);
        this.publishAuthMaterialUpdateAfterEvent(state, event);
    }
    publishSyntheticRoutingUnavailableIfNeeded(state, reason) {
        if (!reason || state.activeLane !== "openai_api") {
            return;
        }
        this.publishSyntheticRoutingUnavailable(state, usageRoutingUnavailableReasonForState(state, reason), null);
    }
    publishSyntheticRoutingUnavailable(state, reason, attemptedFallbackLane, details = {}) {
        if (state.usageRoutingUnavailablePublishedReasons.has(reason)) {
            return;
        }
        state.usageRoutingUnavailablePublishedReasons.add(reason);
        const message = UsageRoutingUnavailableMessages[reason];
        const event = {
            seq: state.nextEventSeq,
            vmEventStreamId: state.eventStreamId,
            sessionId: state.sessionPayload.sessionId,
            workspaceId: state.sessionPayload.workspaceId,
            vmHostId: state.sessionPayload.vmHostId,
            eventType: "usage.routing.unavailable",
            codexThreadId: state.codexThreadId ?? state.sessionPayload.codexThreadId ?? null,
            codexTurnId: state.codexTurnId ?? null,
            itemId: null,
            payload: {
                ...details,
                lane: state.activeLane,
                attemptedFallbackLane,
                reason,
                message,
                recoverable: true,
            },
            rawPayload: {
                method: "yp-live-workflow/usageRouting/unavailable",
                params: {
                    ...details,
                    lane: state.activeLane,
                    attemptedFallbackLane,
                    reason,
                    message,
                    recoverable: true,
                },
            },
        };
        state.nextEventSeq += 1;
        publishSessionEvent(state.onEvent, event);
        this.logSessionEvent(event);
    }
    logAuthReady(payload, auth, activeLane) {
        this.consoleEventSink?.({
            source: "codex",
            event: "auth.ready",
            fields: {
                session: payload.sessionId,
                mode: auth.authMode,
                login: authLoginType(auth),
                lane: activeLane,
                fallback: auth.apiFallback ? "enabled" : "disabled",
            },
        });
    }
    logTurnStart(sessionId, threadId, params) {
        this.consoleEventSink?.({
            source: "codex",
            event: "turn.start",
            fields: {
                session: sessionId,
                thread: threadId,
                model: optionalString(params.model),
                tier: optionalString(params.serviceTier) ?? "regular",
                effort: optionalString(params.effort),
            },
        });
    }
    logSessionEvent(event) {
        switch (event.eventType) {
            case "thread.started":
                this.consoleEventSink?.({
                    source: "codex",
                    event: "thread.started",
                    fields: {
                        session: event.sessionId,
                        thread: event.codexThreadId,
                    },
                });
                return;
            case "turn.started":
                this.consoleEventSink?.({
                    source: "codex",
                    event: "turn.started",
                    fields: {
                        session: event.sessionId,
                        thread: event.codexThreadId,
                        turn: event.codexTurnId,
                    },
                });
                return;
            case "turn.completed": {
                const turn = jsonResponse(event.payload.turn);
                this.consoleEventSink?.({
                    source: "codex",
                    event: "turn.completed",
                    fields: {
                        session: event.sessionId,
                        thread: event.codexThreadId,
                        turn: event.codexTurnId,
                        status: optionalString(event.payload.status) ??
                            optionalString(turn?.status),
                    },
                });
                return;
            }
            case "usage.routing.switched":
                this.consoleEventSink?.({
                    source: "codex",
                    event: "usage.routing.switched",
                    fields: {
                        session: event.sessionId,
                        from: optionalString(event.payload.previousLane),
                        to: optionalString(event.payload.activeLane),
                        reason: optionalString(event.payload.reason),
                    },
                });
                return;
            case "usage.routing.unavailable":
                this.consoleEventSink?.({
                    source: "codex",
                    event: "usage.routing.unavailable",
                    fields: {
                        session: event.sessionId,
                        lane: optionalString(event.payload.lane),
                        reason: optionalString(event.payload.reason),
                    },
                });
                return;
            case "item.started":
            case "item.completed": {
                const fields = webSearchConsoleFields(event);
                if (fields) {
                    this.consoleEventSink?.({
                        source: "codex",
                        event: event.eventType === "item.started"
                            ? "web_search.started"
                            : "web_search.completed",
                        fields,
                    });
                }
                return;
            }
            case "session.error": {
                const error = jsonResponse(event.payload.error);
                this.consoleEventSink?.({
                    source: "codex",
                    event: "error",
                    fields: {
                        session: event.sessionId,
                        thread: event.codexThreadId,
                        turn: event.codexTurnId,
                        message: optionalString(event.payload.message) ??
                            optionalString(error?.message),
                    },
                });
                return;
            }
            default:
                return;
        }
    }
    async waitForChatGptAccount(state, timeoutMs) {
        const startedAt = Date.now();
        while (Date.now() - startedAt <= timeoutMs) {
            const completed = state.completed();
            if (completed && completed.success === false) {
                throw new Error(typeof completed.error === "string"
                    ? completed.error
                    : "Codex ChatGPT login failed");
            }
            let account = null;
            try {
                const accountResponse = jsonResponse(await state.transport.request("account/read", {
                    refreshToken: true,
                })) ?? {};
                account = jsonResponse(accountResponse.account) ?? null;
            }
            catch (error) {
                if (!isTransientAuthAccountReadError(error)) {
                    throw error;
                }
                await sleep(AuthLoginPollIntervalMs);
                continue;
            }
            if (account?.type === "chatgpt") {
                return account;
            }
            await sleep(AuthLoginPollIntervalMs);
        }
        throw new Error(CodexChatGptLoginPendingMessage);
    }
    async launchTransport(payload, authEnv, sensitiveAuthRootPath, durableCodexSessionsPath) {
        const baseEnv = launchBaseEnv(this.env);
        const hostEnv = withGitSafeDirectoryEnv({
            ...baseEnv,
            ...authEnv,
        }, payload, "host");
        const dockerEnv = withGitSafeDirectoryEnv(authEnv, payload, "container");
        if (this.transportFactory) {
            return {
                transport: this.transportFactory({
                    cwd: payload.layout.workspacePath,
                    codexHomePath: payload.layout.codexHomePath,
                    env: {
                        ...hostEnv,
                        CODEX_HOME: payload.layout.codexHomePath,
                        ARTIFACTS_DIR: payload.layout.artifactsPath,
                    },
                }),
                codexCwd: payload.layout.workspacePath,
                codexHomePath: payload.layout.codexHomePath,
                runtimeMetadata: {
                    execution: "host",
                    command: this.codexCommand ?? defaultCodexCommand(),
                    args: this.codexArgs ?? [...DefaultCodexAppServerArgs],
                },
            };
        }
        const datasetPreparation = await this.datasetManager.prepareSessionMounts(payload);
        await this.dockerRuntime.preflightSessionImage(payload);
        return this.dockerRuntime.createCodexAppServerTransport({
            payload,
            env: dockerEnv,
            serverRequestMode: this.serverRequestMode,
            datasetMounts: datasetPreparation.mounts,
            sensitiveHostPaths: [
                ...(sensitiveAuthRootPath ? [sensitiveAuthRootPath] : []),
                ...trustedPayloadSensitiveHostPaths(payload),
            ],
            durableCodexSessionsPath,
            runtimeMetadata: datasetPreparation.runtimeMetadata,
        });
    }
    createStandaloneTransport(cwd, codexHomePath) {
        const env = {
            ...launchBaseEnv(this.env),
            CODEX_HOME: codexHomePath,
        };
        if (this.transportFactory) {
            return this.transportFactory({ cwd, codexHomePath, env });
        }
        return new StdioCodexAppServerTransport({
            cwd,
            codexHomePath,
            env,
            command: this.codexCommand ?? defaultCodexCommand(),
            args: this.codexArgs ?? [...DefaultCodexAppServerArgs],
            serverRequestMode: this.serverRequestMode,
        });
    }
}
function launchBaseEnv(env) {
    const baseEnv = {};
    for (const [key, value] of Object.entries(env)) {
        if (isCodexAuthSecretEnvKey(key)) {
            continue;
        }
        baseEnv[key] = value;
    }
    return baseEnv;
}
function isCodexAuthSecretEnvKey(key) {
    const normalized = key.toUpperCase();
    return (normalized === "OPENAI_API_KEY" ||
        normalized === "CODEX_API_KEY" ||
        ((normalized.includes("OPENAI") || normalized.includes("CODEX")) &&
            normalized.includes("API_KEY")));
}
function authLoginLayout(rootPath) {
    const resolvedRoot = path.resolve(rootPath);
    return {
        rootPath: resolvedRoot,
        workspacePath: path.join(resolvedRoot, "workspace"),
        codexHomePath: path.join(resolvedRoot, "codex-home"),
    };
}
function withCodexHomePath(payload, codexHomePath) {
    return {
        ...payload,
        layout: {
            ...payload.layout,
            codexHomePath,
        },
    };
}
async function prepareDurableCodexSessionsPath(durableCodexHomePath) {
    const resolvedCodexHomePath = path.resolve(durableCodexHomePath);
    try {
        await fs.mkdir(resolvedCodexHomePath, {
            recursive: true,
            mode: 0o700,
        });
    }
    catch (error) {
        if (isDurableCodexSessionsUnavailableError(error)) {
            return null;
        }
        throw error;
    }
    await assertDurableCodexDirectory(resolvedCodexHomePath, "Codex durable home");
    const sessionsPath = path.join(resolvedCodexHomePath, "sessions");
    try {
        await assertDurableCodexDirectory(sessionsPath, "Codex durable sessions path");
    }
    catch (error) {
        if (error.code !== "ENOENT") {
            throw error;
        }
        try {
            await fs.mkdir(sessionsPath, { recursive: true, mode: 0o700 });
        }
        catch (mkdirError) {
            if (isDurableCodexSessionsUnavailableError(mkdirError)) {
                return null;
            }
            throw mkdirError;
        }
        await assertDurableCodexDirectory(sessionsPath, "Codex durable sessions path");
    }
    return sessionsPath;
}
async function linkDurableCodexSessionsPath(codexHomePath, durableSessionsPath) {
    const linkPath = path.join(codexHomePath, "sessions");
    try {
        await fs.lstat(linkPath);
        throw new Error(`Codex auth home sessions path already exists: ${linkPath}`);
    }
    catch (error) {
        if (error.code !== "ENOENT") {
            throw error;
        }
    }
    await fs.symlink(path.resolve(durableSessionsPath), linkPath, process.platform === "win32" ? "junction" : "dir");
}
async function assertDurableCodexDirectory(directoryPath, label) {
    const stats = await fs.lstat(directoryPath);
    if (stats.isSymbolicLink()) {
        throw new Error(`${label} must not be a symlink: ${directoryPath}`);
    }
    if (!stats.isDirectory()) {
        throw new Error(`${label} must be a directory: ${directoryPath}`);
    }
}
function isDurableCodexSessionsUnavailableError(error) {
    const code = error.code;
    return code === "EACCES" || code === "EPERM" || code === "EROFS";
}
function trustedPayloadSensitiveHostPaths(payload) {
    const paths = payload.sensitiveHostPaths ?? [];
    if (paths.length === 0) {
        return [];
    }
    return paths.map((hostPath) => trustedPayloadSensitiveHostPath(payload, hostPath));
}
function withGitSafeDirectoryEnv(env, payload, mode) {
    const safeDirectories = trustedPayloadGitSafeDirectories(payload, mode);
    if (safeDirectories.length === 0) {
        return env;
    }
    return appendGitConfigEnv(env, safeDirectories.map((safeDirectory) => ({
        key: "safe.directory",
        value: safeDirectory,
    })));
}
function trustedPayloadGitSafeDirectories(payload, mode) {
    const helpers = trustedPayloadGitHubCredentialHelpers(payload);
    const seen = new Set();
    const directories = [];
    for (const helper of helpers) {
        const safeDirectory = mode === "host" ? helper.hostRepoPath : helper.containerRepoPath;
        if (!seen.has(safeDirectory)) {
            seen.add(safeDirectory);
            directories.push(safeDirectory);
        }
    }
    return directories;
}
function appendGitConfigEnv(env, entries) {
    const existingCount = gitConfigEnvCount(env);
    const existingEntries = gitConfigEnvEntries(env, existingCount);
    const existingSafeDirectories = new Set(existingEntries
        .filter((entry) => entry.key.trim().toLowerCase() === "safe.directory")
        .map((entry) => entry.value));
    const entriesToAppend = entries.filter((entry) => !existingSafeDirectories.has(entry.value));
    if (entriesToAppend.length === 0) {
        return env;
    }
    const output = {
        ...env,
        GIT_CONFIG_COUNT: String(existingCount + entriesToAppend.length),
    };
    for (const [offset, entry] of entriesToAppend.entries()) {
        const index = existingCount + offset;
        output[`GIT_CONFIG_KEY_${index}`] = entry.key;
        output[`GIT_CONFIG_VALUE_${index}`] = entry.value;
    }
    return output;
}
function gitConfigEnvCount(env) {
    const raw = env.GIT_CONFIG_COUNT;
    if (!raw) {
        return 0;
    }
    const value = Number(raw);
    return Number.isInteger(value) && value >= 0 ? value : 0;
}
function gitConfigEnvEntries(env, count) {
    const entries = [];
    for (let index = 0; index < count; index += 1) {
        const key = env[`GIT_CONFIG_KEY_${index}`];
        const value = env[`GIT_CONFIG_VALUE_${index}`];
        if (key !== undefined && value !== undefined) {
            entries.push({ key, value });
        }
    }
    return entries;
}
function trustedPayloadGitHubCredentialHelpers(payload) {
    return (payload.sensitiveHostPaths ?? []).map((hostPath) => trustedPayloadGitHubCredentialHelper(payload, hostPath));
}
function trustedPayloadSensitiveHostPath(payload, hostPath) {
    return trustedPayloadGitHubCredentialHelper(payload, hostPath).hostPath;
}
function trustedPayloadGitHubCredentialHelper(payload, hostPath) {
    const resolvedWorkspacePath = path.resolve(payload.layout.workspacePath);
    const resolvedHostPath = path.resolve(hostPath);
    const relativePath = path.relative(resolvedWorkspacePath, resolvedHostPath);
    const parts = relativePath.split(path.sep);
    const repoDirectoryName = parts[0] ?? "";
    if (relativePath === "" ||
        relativePath.startsWith("..") ||
        path.isAbsolute(relativePath) ||
        parts.length !== 3 ||
        !isSafeWorkspacePathSegment(repoDirectoryName) ||
        parts[1] !== ".git" ||
        parts[2] !== "yp-live-workflow-github-credential-helper.sh") {
        throw new Error(`Sensitive host path is not an expected workspace GitHub credential helper path: ${hostPath}`);
    }
    return {
        hostPath: resolvedHostPath,
        hostRepoPath: path.join(resolvedWorkspacePath, repoDirectoryName),
        containerRepoPath: `/workspace/${repoDirectoryName}`,
    };
}
function isSafeWorkspacePathSegment(value) {
    return /^[A-Za-z0-9._-]+$/u.test(value) && value !== "." && value !== "..";
}
async function cleanupSensitiveAuthRoot(rootPath) {
    const error = await cleanupSensitiveAuthRootError(rootPath);
    if (error) {
        throw error;
    }
}
async function cleanupSensitiveAuthRootBestEffort(rootPath) {
    await cleanupSensitiveAuthRootError(rootPath);
}
async function cleanupSensitiveAuthRootError(rootPath) {
    if (!rootPath) {
        return null;
    }
    try {
        await fs.rm(rootPath, { recursive: true, force: true });
        return null;
    }
    catch (error) {
        console.error("Failed to remove sensitive Codex auth root", {
            path: rootPath,
            error: error instanceof Error ? error.message : String(error),
        });
        return error;
    }
}
async function ensureAuthLoginDirectories(layout) {
    await fs.mkdir(layout.workspacePath, { recursive: true, mode: 0o700 });
    await fs.mkdir(layout.codexHomePath, { recursive: true, mode: 0o700 });
}
async function initializeAuthTransport(transport) {
    await transport.request("initialize", {
        clientInfo: {
            name: "yp-live-workflow-vm-agent",
            title: "LiveWorkflow VM Agent",
            version: "0.1.0",
        },
        capabilities: {
            experimentalApi: true,
        },
    });
    transport.notify("initialized");
}
function authLoginKey(authProfileId, loginId) {
    return `${authProfileId}:${loginId}`;
}
function isAuthLoginPendingError(error) {
    return (error instanceof Error && error.message === CodexChatGptLoginPendingMessage);
}
function isTransientAuthAccountReadError(error) {
    if (!(error instanceof Error)) {
        return false;
    }
    const message = error.message.toLowerCase();
    return [
        "authorization_pending",
        "authorization pending",
        "login pending",
        "auth pending",
        "not ready",
        "not logged in",
        "no account",
    ].some((marker) => message.includes(marker));
}
function assertAuthLoginMatches(state, payload) {
    if (state.authProfileId !== payload.authProfileId ||
        state.vmHostId !== payload.vmHostId ||
        path.resolve(state.rootPath) !== path.resolve(payload.rootPath) ||
        state.loginId !== payload.loginId) {
        throw new Error("Codex auth login payload does not match the active login");
    }
}
function stringResponse(value, fieldName) {
    if (typeof value !== "string" || value.length === 0) {
        throw new Error(`Codex auth login response missing ${fieldName}`);
    }
    return value;
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function sessionCommandAck(payload, data = {}) {
    return {
        ok: true,
        commandId: payload.commandId,
        sessionId: payload.sessionId,
        ...data,
    };
}
function withUsageRouting(result, state) {
    return {
        ...(result ?? {}),
        vmEventStreamId: state.eventStreamId,
        vmEventSeqBoundary: state.nextEventSeq,
        usageRouting: {
            activeLane: state.activeLane,
        },
    };
}
function authLoginType(auth) {
    if (auth.codexAuthMaterial &&
        authMaterialCanPublishAsChatGpt(auth.codexAuthMaterial)) {
        return "chatgpt";
    }
    return auth.apiKey ? "apiKey" : "none";
}
function authMaterialCanPublishAsChatGpt(material) {
    const authFiles = material.files.filter((file) => file.path === "auth.json");
    if (authFiles.length === 0) {
        return false;
    }
    return authFiles.every((authFile) => authFileCanPublishAsChatGpt(authFile));
}
function authMaterialRedactedSummary(material) {
    const authFile = material.files.find((file) => file.path === "auth.json");
    if (!authFile) {
        return { authJsonPresent: false };
    }
    try {
        const parsed = JSON.parse(Buffer.from(authFile.dataBase64, "base64").toString("utf8"));
        const record = jsonResponse(parsed);
        if (!record) {
            return { authJsonPresent: true, authJsonShape: "non_object" };
        }
        return {
            authJsonPresent: true,
            authJsonTopKeys: Object.keys(record).sort().join(","),
            authJsonType: optionalString(record.type),
            authJsonAuthMode: optionalString(record.auth_mode),
            authJsonAccountType: optionalString(record.account_type),
            authJsonHasOpenAiApiKey: Object.prototype.hasOwnProperty.call(record, "OPENAI_API_KEY"),
            authJsonHasApiKey: Object.prototype.hasOwnProperty.call(record, "apiKey") ||
                Object.prototype.hasOwnProperty.call(record, "api_key"),
            authJsonHasAccessToken: Object.prototype.hasOwnProperty.call(record, "access_token"),
            authJsonHasRefreshToken: Object.prototype.hasOwnProperty.call(record, "refresh_token"),
        };
    }
    catch {
        return { authJsonPresent: true, authJsonShape: "invalid_json" };
    }
}
function authFileCanPublishAsChatGpt(authFile) {
    try {
        const parsed = JSON.parse(Buffer.from(authFile.dataBase64, "base64").toString("utf8"));
        const record = jsonResponse(parsed);
        if (!record) {
            return false;
        }
        const type = optionalString(record?.type)?.toLowerCase();
        const authMode = optionalString(record?.auth_mode)?.toLowerCase();
        const chatGptTokenBundle = jsonResponse(record.tokens);
        const hasApiKey = Object.prototype.hasOwnProperty.call(record, "apiKey") ||
            Object.prototype.hasOwnProperty.call(record, "api_key");
        if (isApiKeyAuthMarker(type) || isApiKeyAuthMarker(authMode) || hasApiKey) {
            return false;
        }
        if (authMode === "chatgpt" ||
            type === "chatgpt" ||
            optionalString(record.account_type)?.toLowerCase() === "chatgpt") {
            return (!!chatGptTokenBundle ||
                Object.prototype.hasOwnProperty.call(record, "access_token") ||
                Object.prototype.hasOwnProperty.call(record, "refresh_token"));
        }
        return !Object.prototype.hasOwnProperty.call(record, "OPENAI_API_KEY");
    }
    catch {
        return false;
    }
}
function isApiKeyAuthMarker(value) {
    const normalized = value?.replace(/[-_\s]/gu, "").toLowerCase();
    return normalized === "apikey" || normalized === "openaiapikey";
}
function isManagedMultiTurnLaunch(payload) {
    const runtimeCodexSession = jsonResponse(payload.runtimeSnapshot.codexSession);
    const launch = jsonResponse(runtimeCodexSession?.launch);
    const launchInputPayload = jsonResponse(launch?.inputPayload);
    const directLaunchMode = optionalString(payload.inputPayload.launchMode);
    const snapshottedLaunchMode = optionalString(launchInputPayload?.launchMode);
    return (runtimeCodexSession?.chiefManaged === true ||
        directLaunchMode === "chief_managed" ||
        directLaunchMode === "group_final_review" ||
        directLaunchMode === "code_data_review" ||
        snapshottedLaunchMode === "chief_managed" ||
        snapshottedLaunchMode === "group_final_review" ||
        snapshottedLaunchMode === "code_data_review");
}
function canRestartForChatGptReturnProbe(state) {
    if (state.status === "paused") {
        return true;
    }
    return state.status === "active" && !state.codexTurnId;
}
function terminalFailureMessageForEvent(event) {
    if (codexSessionEventWillRetry(event.payload)) {
        return null;
    }
    if (event.eventType === "session.error") {
        if (isTransientReconnectSessionError(event.payload)) {
            return null;
        }
        const error = jsonResponse(event.payload.error);
        return (optionalString(event.payload.message) ??
            optionalString(error?.message) ??
            "Codex session error");
    }
    if (event.eventType !== "turn.completed") {
        return null;
    }
    const turn = jsonResponse(event.payload.turn);
    const status = optionalString(event.payload.status) ?? optionalString(turn?.status);
    if (status !== "failed" && status !== "error") {
        return null;
    }
    return (optionalString(event.payload.message) ??
        `Codex turn completed with status ${status}`);
}
function isTransientReconnectSessionError(payload) {
    const error = jsonResponse(payload.error);
    const message = optionalString(payload.message) ?? optionalString(error?.message);
    return Boolean(message && /^Reconnecting\.\.\.\s+\d+\/\d+$/iu.test(message.trim()));
}
function codexChatGptAuthInvalidReason(value) {
    const text = typeof value === "string"
        ? value
        : value instanceof Error
            ? value.message
            : "";
    const normalized = text.toLowerCase();
    if (normalized.includes("refresh_token_reused") ||
        normalized.includes("refresh token has already been used")) {
        return "refresh_token_reused";
    }
    if (normalized.includes("failed to refresh token") &&
        normalized.includes("401")) {
        return "refresh_failed";
    }
    return null;
}
function apiKeyAuthFailureReason(value) {
    const text = typeof value === "string"
        ? value
        : value instanceof Error
            ? value.message
            : "";
    const normalized = text.toLowerCase();
    if (normalized.includes("429") ||
        normalized.includes("rate limit") ||
        normalized.includes("rate_limit") ||
        normalized.includes("quota") ||
        normalized.includes("insufficient_quota")) {
        return "openai_api_quota_reached";
    }
    if (normalized.includes("401") ||
        normalized.includes("403") ||
        normalized.includes("unauthorized") ||
        normalized.includes("forbidden") ||
        normalized.includes("invalid api key") ||
        normalized.includes("invalid_api_key")) {
        return "openai_api_auth_failed";
    }
    return null;
}
function usageRoutingUnavailableReasonForState(state, reason) {
    if (state.auth.codexAuthMaterial) {
        return reason;
    }
    switch (reason) {
        case "openai_api_quota_reached":
            return "primary_openai_api_quota_reached";
        case "openai_api_auth_failed":
            return "primary_openai_api_auth_failed";
        default:
            return reason;
    }
}
function threadStatusType(value) {
    const status = jsonRecord(value);
    const type = optionalString(status.type) ?? optionalString(value) ?? null;
    return type === "running" ? "active" : type;
}
function threadStatusFromResponse(value) {
    const response = jsonRecord(value);
    const thread = jsonRecord(response.thread);
    return threadStatusType(thread.status);
}
function activeThreadTurnIdFromResponse(value) {
    const directTurnId = extractTurnId(value);
    if (directTurnId) {
        return directTurnId;
    }
    const response = jsonRecord(value);
    const thread = jsonRecord(response.thread);
    const turns = Array.isArray(thread.turns) ? thread.turns : [];
    for (let index = turns.length - 1; index >= 0; index -= 1) {
        const turn = jsonRecord(turns[index]);
        const status = optionalString(turn.status);
        if (status === "inProgress" || status === "running") {
            return optionalString(turn.id) ?? null;
        }
    }
    return null;
}
function terminalThreadTurnIdsFromResponse(value) {
    const response = jsonRecord(value);
    const thread = jsonRecord(response.thread);
    const turns = Array.isArray(thread.turns) ? thread.turns : [];
    const turnIds = [];
    for (const value of turns) {
        const turn = jsonRecord(value);
        const status = optionalString(turn.status);
        if (status !== "completed" &&
            status !== "interrupted" &&
            status !== "failed") {
            continue;
        }
        const turnId = optionalString(turn.id);
        if (turnId) {
            turnIds.push(turnId);
        }
    }
    return turnIds;
}
function optionalString(value) {
    return typeof value === "string" && value.length > 0 ? value : undefined;
}
function effectiveRequestParamsForLane(params, lane) {
    if (!params || typeof params !== "object" || Array.isArray(params)) {
        return params;
    }
    const record = params;
    if (record.serviceTier !== "flex") {
        return params;
    }
    // ChatGPT-backed Codex does not accept Flex. Null explicitly clears the
    // non-regular tier, while API-backed requests retain the requested value.
    return {
        ...record,
        serviceTier: lane === "chatgpt_plan" ? null : "flex",
    };
}
function inferenceTypeForCodexServiceTier(serviceTier) {
    switch (serviceTier?.trim().toLowerCase()) {
        case "fast":
        case "priority":
            return "priority";
        case "flex":
            return "flex";
        case "regular":
        case "standard":
        case "normal":
            return "normal";
        default:
            return null;
    }
}
function normalizedSha256(value) {
    return typeof value === "string" && /^[a-f0-9]{64}$/i.test(value)
        ? value.toLowerCase()
        : null;
}
function chatGptReturnProbeDelayMsFromEnv(env) {
    const raw = env[ChatGptReturnProbeDelayMsEnv];
    if (typeof raw !== "string" || raw.trim().length === 0) {
        return DefaultChatGptReturnProbeDelayMs;
    }
    const parsed = Number(raw.trim());
    return Number.isInteger(parsed) && parsed > 0
        ? parsed
        : DefaultChatGptReturnProbeDelayMs;
}
function positiveIntegerEnv(env, name, fallback) {
    const value = Number(env[name]);
    return Number.isInteger(value) && value > 0 ? value : fallback;
}
function retryDelayMs(initialDelayMs, maxDelayMs, attempt) {
    const exponent = Math.max(0, Math.min(attempt - 1, 30));
    return Math.min(maxDelayMs, initialDelayMs * 2 ** exponent);
}
function remainingLogicalTurnRetryDelayMs(metadata) {
    const nextRetryAt = Date.parse(metadata.nextRetryAt);
    return Number.isFinite(nextRetryAt)
        ? Math.max(0, nextRetryAt - Date.now())
        : metadata.delayMs;
}
function logicalTurnRetries(state) {
    return [state.logicalTurnRetry, state.detachedReviewRetry].filter((retry) => Boolean(retry));
}
function ownsLogicalTurnRetry(state, retry) {
    return (state.logicalTurnRetry === retry || state.detachedReviewRetry === retry);
}
function isDetachedReviewRetry(retry) {
    return (retry.method === "review/start" && retry.params.delivery === "detached");
}
function logicalTurnRetrySourceTurnId(retry) {
    return retry.currentTurnId ?? retry.startedFromRetry?.turnId ?? null;
}
function logicalTurnRetryForEvent(state, event) {
    const retries = logicalTurnRetries(state);
    if (event.codexTurnId) {
        const turnMatch = retries.find((retry) => retry.currentTurnId === event.codexTurnId);
        if (turnMatch) {
            return turnMatch;
        }
    }
    else {
        const requestInFlight = retries.filter((retry) => !retry.currentTurnId &&
            !retry.metadata &&
            !retry.timer &&
            !retry.suspended);
        if (requestInFlight.length === 1) {
            return requestInFlight[0] ?? null;
        }
    }
    if (event.codexThreadId) {
        const threadMatches = retries.filter((retry) => retry.currentThreadId === event.codexThreadId);
        if (threadMatches.length === 1) {
            return threadMatches[0] ?? null;
        }
    }
    const matches = retries.filter((retry) => logicalTurnMatchesEvent(retry, event));
    return matches.length === 1 ? (matches[0] ?? null) : null;
}
function logicalTurnMatchesEvent(retry, event) {
    if (retry.currentTurnId) {
        return !event.codexTurnId || retry.currentTurnId === event.codexTurnId;
    }
    return !retry.metadata && !retry.timer && !retry.suspended;
}
function logicalTurnCompletionMatchesEvent(retry, event) {
    return Boolean(retry.currentTurnId &&
        event.codexTurnId &&
        retry.currentTurnId === event.codexTurnId);
}
function isDetachedReviewTurnEvent(retry, event) {
    return Boolean(retry &&
        retry.method === "review/start" &&
        retry.params.delivery === "detached" &&
        event.codexTurnId &&
        (retry.currentTurnId === event.codexTurnId ||
            (!retry.currentTurnId &&
                event.eventType === "turn.started" &&
                !retry.metadata &&
                !retry.timer &&
                !retry.suspended)));
}
function failedTurnCompletion(payload) {
    const turn = jsonResponse(payload.turn);
    const status = optionalString(payload.status) ?? optionalString(turn?.status);
    return status === "failed" || status === "error";
}
function interruptedTurnCompletion(payload) {
    const turn = jsonResponse(payload.turn);
    const status = optionalString(payload.status) ?? optionalString(turn?.status);
    return (status === "interrupted" || status === "cancelled" || status === "canceled");
}
function eventWithLiveWorkflowRetry(event, metadata, pendingLogicalTurnRetry, pendingLogicalTurnRetries) {
    return {
        ...event,
        payload: {
            ...event.payload,
            ypLiveWorkflowRetry: metadata,
            ...(pendingLogicalTurnRetry
                ? {
                    pendingLogicalTurnRetry: pendingLogicalTurnRetry,
                }
                : {}),
            pendingLogicalTurnRetries: pendingLogicalTurnRetries,
        },
    };
}
function errorPayloadForRetry(error) {
    const message = error instanceof Error ? error.message : String(error);
    const record = error && typeof error === "object" && !Array.isArray(error)
        ? error
        : {};
    const status = typeof record.statusCode === "number"
        ? record.statusCode
        : typeof record.status === "number"
            ? record.status
            : null;
    return {
        error: {
            message,
            ...(status !== null ? { httpStatusCode: status } : {}),
        },
    };
}
function webSearchConsoleFields(event) {
    const item = jsonResponse(event.payload.item);
    if (optionalString(item?.type) !== "webSearch") {
        return null;
    }
    const action = jsonResponse(item?.action);
    const queries = stringArray(action?.queries);
    const query = optionalString(item?.query) ?? optionalString(action?.query) ?? queries[0];
    return {
        session: event.sessionId,
        thread: event.codexThreadId ?? undefined,
        turn: event.codexTurnId ?? undefined,
        item: event.itemId ?? optionalString(item?.id),
        status: optionalString(item?.status),
        action: optionalString(action?.type),
        query: truncateConsoleField(query, 160),
        queryCount: queries.length > 1 ? queries.length : undefined,
        url: truncateConsoleField(optionalString(action?.url), 200),
        pattern: truncateConsoleField(optionalString(action?.pattern), 120),
    };
}
function stringArray(value) {
    return Array.isArray(value)
        ? value.filter((item) => typeof item === "string" && item.length > 0)
        : [];
}
function truncateConsoleField(value, maxLength) {
    if (!value || value.length <= maxLength) {
        return value;
    }
    return `${value.slice(0, Math.max(0, maxLength - 3))}...`;
}
function jsonResponse(response) {
    if (!response || typeof response !== "object" || Array.isArray(response)) {
        return undefined;
    }
    return response;
}
function approvalRequestKey(requestId) {
    return String(requestId);
}
function approvalRequestIdFromPayload(payload) {
    const requestId = payload.requestId;
    if (typeof requestId === "string" && requestId.length > 0) {
        return requestId;
    }
    return typeof requestId === "number" ? requestId : null;
}
function isCodexApprovalRequestMethod(method) {
    return (method === "item/commandExecution/requestApproval" ||
        method === "item/fileChange/requestApproval" ||
        method === "item/permissions/requestApproval" ||
        method === "item/tool/requestUserInput");
}
function codexDecisionApprovalResult(result) {
    const decision = result.decision;
    if (typeof decision !== "string") {
        return result;
    }
    if (isLegacyApprovedDecision(decision)) {
        return { ...result, decision: "accept" };
    }
    if (isLegacyRejectedDecision(decision)) {
        return { ...result, decision: "decline" };
    }
    return result;
}
function codexPermissionsApprovalResponse(params, result) {
    const decision = typeof result.decision === "string" ? result.decision : null;
    if (decision &&
        (isLegacyRejectedDecision(decision) ||
            decision === "decline" ||
            decision === "cancel")) {
        return {
            error: {
                code: -32000,
                message: "Rejected by LiveWorkflow approval task",
            },
        };
    }
    if (decision &&
        !isLegacyApprovedDecision(decision) &&
        decision !== "accept" &&
        decision !== "acceptForSession") {
        return { result };
    }
    const { decision: _decision, permissions: resultPermissions, ...rest } = result;
    const hasResultPermissions = Boolean(resultPermissions) &&
        typeof resultPermissions === "object" &&
        !Array.isArray(resultPermissions);
    const permissions = jsonRecord(resultPermissions);
    const requestedPermissions = jsonRecord(params.permissions);
    return {
        result: {
            ...rest,
            permissions: hasResultPermissions ? permissions : requestedPermissions,
            ...(decision === "acceptForSession" ? { scope: "session" } : {}),
        },
    };
}
function isLegacyApprovedDecision(decision) {
    return decision === "approved" || decision === "approve";
}
function isLegacyRejectedDecision(decision) {
    return (decision === "rejected" ||
        decision === "reject" ||
        decision === "declined" ||
        decision === "deny" ||
        decision === "denied");
}
function quotaLimitReached(response) {
    if (!response) {
        return false;
    }
    return reachedRateLimitRecords(response).length > 0;
}
function nextChatGptProbeAtFromRateLimits(response, nowMs, fallbackDelayMs) {
    const resetsAtMs = response
        ? reachedRateLimitRecords(response)
            .flatMap(reachedRateLimitResetTimestampsMs)
            .filter((value) => typeof value === "number")
        : [];
    if (resetsAtMs.length === 0) {
        return nowMs + fallbackDelayMs;
    }
    const nextProbeAt = Math.max(...resetsAtMs) + ChatGptReturnProbeResetBufferMs;
    return nextProbeAt > nowMs ? nextProbeAt : nowMs + fallbackDelayMs;
}
function chatGptReturnProbeFailureBackoffMs(baseDelayMs, failureCount) {
    const multiplier = 2 ** Math.max(0, Math.min(failureCount - 1, 10));
    return Math.min(baseDelayMs * multiplier, MaxChatGptReturnProbeFailureBackoffMs);
}
function reachedRateLimitRecords(response) {
    return rateLimitRecords(response).filter(rateLimitReached);
}
function rateLimitReached(limit) {
    const reachedType = typeof limit.rateLimitReachedType === "string"
        ? limit.rateLimitReachedType
        : null;
    const primary = jsonResponse(limit.primary) ?? {};
    const secondary = jsonResponse(limit.secondary) ?? {};
    return (Boolean(reachedType) ||
        rateLimitWindowReached(primary) ||
        rateLimitWindowReached(secondary));
}
function reachedRateLimitResetTimestampsMs(limit) {
    const reachedType = typeof limit.rateLimitReachedType === "string"
        ? limit.rateLimitReachedType
        : null;
    const primary = jsonResponse(limit.primary) ?? {};
    const secondary = jsonResponse(limit.secondary) ?? {};
    const primaryReached = rateLimitWindowReached(primary);
    const secondaryReached = rateLimitWindowReached(secondary);
    const resetsAtMs = [];
    const primaryResetAtMs = resetTimestampMs(primary.resetsAt);
    const secondaryResetAtMs = resetTimestampMs(secondary.resetsAt);
    if (primaryReached && primaryResetAtMs !== null) {
        resetsAtMs.push(primaryResetAtMs);
    }
    if (secondaryReached && secondaryResetAtMs !== null) {
        resetsAtMs.push(secondaryResetAtMs);
    }
    if (primaryReached || secondaryReached || !reachedType) {
        return resetsAtMs;
    }
    const normalizedReachedType = reachedType.toLowerCase();
    if (normalizedReachedType.includes("secondary")) {
        return secondaryResetAtMs !== null ? [secondaryResetAtMs] : [];
    }
    if (normalizedReachedType.includes("primary")) {
        return primaryResetAtMs !== null ? [primaryResetAtMs] : [];
    }
    if (primaryResetAtMs !== null) {
        return [primaryResetAtMs];
    }
    return secondaryResetAtMs !== null ? [secondaryResetAtMs] : [];
}
function rateLimitWindowReached(window) {
    const usedPercent = typeof window.usedPercent === "number" ? window.usedPercent : 0;
    return usedPercent >= 100;
}
function resetTimestampMs(value) {
    if (typeof value === "number") {
        return numericResetTimestampMs(value);
    }
    if (typeof value !== "string") {
        return null;
    }
    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }
    const numeric = Number(trimmed);
    if (Number.isFinite(numeric)) {
        return numericResetTimestampMs(numeric);
    }
    const parsed = Date.parse(trimmed);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}
function numericResetTimestampMs(value) {
    if (!Number.isFinite(value) || value <= 0) {
        return null;
    }
    return value < 10000000000 ? value * 1000 : value;
}
function rateLimitRecords(response) {
    const byLimitId = jsonResponse(response.rateLimitsByLimitId);
    if (byLimitId && Object.keys(byLimitId).length > 0) {
        return Object.values(byLimitId).flatMap((value) => {
            const record = jsonResponse(value);
            return record ? [record] : [];
        });
    }
    const single = jsonResponse(response.rateLimits);
    return single ? [single] : [];
}
function reviewTargetParams(target) {
    switch (target.type) {
        case "uncommittedChanges":
            return { type: "uncommittedChanges" };
        case "baseBranch":
            return { type: "baseBranch", branch: target.branch };
        case "commit":
            return {
                type: "commit",
                sha: target.sha,
                title: target.title ?? null,
            };
        case "custom":
            return { type: "custom", instructions: target.instructions };
    }
}
