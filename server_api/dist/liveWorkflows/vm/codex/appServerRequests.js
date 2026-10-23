import { DefaultCodexServiceTier, CodexReasoningEffortSchema, CodexServiceTierSchema, normalizeAgentRuntimeDockerPolicy, normalizeResearcherModelSettingsWithLegacyConfigFallback, } from "../../contracts/index.js";
import { jsonRecord, stringValue, withoutNullish } from "./jsonUtils.js";
const DefaultCodexApprovalPolicy = "never";
const LegacyCodexApprovalPolicy = "on-failure";
const LegacyCodexApprovalPolicyFallback = "on-request";
const DefaultCodexSandbox = "danger-full-access";
const BackgroundTerminalMaxTimeoutKey = "background_terminal_max_timeout";
const DefaultNetworkEnabledCodexSandboxPolicy = {
    type: "externalSandbox",
    networkAccess: "enabled",
};
const DefaultNetworkRestrictedCodexSandboxPolicy = {
    type: "externalSandbox",
    networkAccess: "restricted",
};
export function threadParams(payload, overrides = {}) {
    const runtimeSnapshot = payload.runtimeSnapshot;
    const codexConfig = jsonRecord(runtimeSnapshot.codexConfig);
    const modelDefaults = researcherSettings(runtimeSnapshot, codexConfig);
    const config = jsonRecord(codexConfig.config);
    const reasoningEffort = codexReasoningEffort(modelDefaults.reasoningEffort);
    return withoutNullish({
        ...codexConfig,
        config: withoutNullish({
            ...config,
            model_reasoning_effort: reasoningEffort,
        }),
        cwd: overrides.cwd ?? payload.layout.workspacePath,
        model: stringValue(modelDefaults.model) ?? stringValue(codexConfig.model),
        modelProvider: stringValue(modelDefaults.modelProvider) ?? stringValue(codexConfig.modelProvider),
        serviceTier: codexServiceTier(modelDefaults.serviceTier),
        approvalPolicy: codexApprovalPolicy(codexConfig.approvalPolicy),
        approvalsReviewer: codexConfig.approvalsReviewer,
        sandbox: codexConfig.sandbox ?? defaultCodexSandbox(codexConfig),
        threadId: overrides.threadId,
        persistExtendedHistory: overrides.threadId ? overrides.persistExtendedHistory ?? false : undefined,
    });
}
export function threadResumeParams(payload, options, overrides = undefined) {
    return {
        ...threadResumePermissionParams(payload),
        ...(options.replayRuntimeConfig ? threadResumeRuntimeParams(payload) : {}),
        ...approvalPolicyOverrides(overrides),
        threadId: options.threadId,
        persistExtendedHistory: options.persistExtendedHistory ?? false,
    };
}
export function threadForkParams(payload, options, overrides = undefined) {
    return {
        ...threadParams(payload, {
            threadId: options.threadId,
            cwd: options.cwd,
            persistExtendedHistory: options.persistExtendedHistory ?? false,
        }),
        ...approvalPolicyOverrides(overrides),
        threadId: options.threadId,
        persistExtendedHistory: options.persistExtendedHistory ?? false,
    };
}
function threadResumePermissionParams(payload) {
    const codexConfig = jsonRecord(payload.runtimeSnapshot.codexConfig);
    // Codex restores model/cwd from rollout on resume, but re-derives
    // permission settings from the fresh app-server process unless we replay them.
    return withoutNullish({
        permissions: codexConfig.permissions,
        approvalPolicy: codexApprovalPolicy(codexConfig.approvalPolicy),
        approvalsReviewer: codexConfig.approvalsReviewer,
        sandbox: codexConfig.sandbox ?? defaultCodexSandbox(codexConfig),
    });
}
function threadResumeRuntimeParams(payload) {
    const codexConfig = jsonRecord(payload.runtimeSnapshot.codexConfig);
    const config = jsonRecord(codexConfig.config);
    const backgroundTerminalMaxTimeoutMs = positiveIntegerValue(config[BackgroundTerminalMaxTimeoutKey]);
    return withoutNullish({
        developerInstructions: stringValue(codexConfig.developerInstructions),
        config: backgroundTerminalMaxTimeoutMs === null
            ? undefined
            : {
                [BackgroundTerminalMaxTimeoutKey]: backgroundTerminalMaxTimeoutMs,
            },
    });
}
export function turnParams(payload, overrides = {}) {
    const runtimeSnapshot = payload.runtimeSnapshot;
    const codexConfig = jsonRecord(runtimeSnapshot.codexConfig);
    const modelDefaults = researcherSettings(runtimeSnapshot, codexConfig);
    return withoutNullish({
        cwd: overrides.cwd ?? payload.layout.workspacePath,
        model: stringValue(modelDefaults.model) ?? stringValue(codexConfig.model),
        serviceTier: codexServiceTier(modelDefaults.serviceTier),
        effort: codexReasoningEffort(modelDefaults.reasoningEffort),
        approvalPolicy: codexApprovalPolicy(codexConfig.approvalPolicy),
        approvalsReviewer: codexConfig.approvalsReviewer,
        sandboxPolicy: codexConfig.sandboxPolicy ?? defaultCodexSandboxPolicy(runtimeSnapshot, {
            codexConfig,
            resolvedNetworkMode: overrides.resolvedNetworkMode,
        }),
        input: codexUserInputs([{ type: "text", text: sessionObjective(payload.inputPayload) }]),
    });
}
export function turnStartParams(payload, input, overrides, options = {}) {
    const defaults = turnStartDefaultParams(payload, options);
    const rawOverrides = jsonRecord(overrides);
    const normalizedOverrides = turnStartOverrides(overrides);
    if (hasOwn(rawOverrides, "serviceTier") && !hasOwn(normalizedOverrides, "serviceTier")) {
        // Codex represents the regular tier by clearing a non-regular override.
        // Keep that clearing operation explicit so retries and billing attribution
        // retain the effective tier instead of falling back to session defaults.
        defaults.serviceTier = null;
    }
    return {
        ...defaults,
        ...normalizedOverrides,
        input: codexUserInputs(input),
    };
}
export function turnStartOverrides(overrides) {
    const raw = jsonRecord(overrides);
    const { approvalPolicy: rawApprovalPolicy, reasoningEffort: rawReasoningEffort, serviceTier: rawServiceTier, ...rest } = raw;
    const directEffort = raw.effort;
    const effort = rawReasoningEffort !== undefined
        ? rawReasoningEffort === null
            ? null
            : codexReasoningEffort(rawReasoningEffort)
        : directEffort !== undefined
            ? directEffort === null
                ? null
                : codexReasoningEffort(directEffort)
            : undefined;
    return withoutUndefined({
        ...rest,
        approvalPolicy: rawApprovalPolicy !== undefined
            ? codexApprovalPolicyOverride(rawApprovalPolicy)
            : undefined,
        serviceTier: rawServiceTier !== undefined
            ? rawServiceTier === null
                ? null
                : codexServiceTier(rawServiceTier)
            : undefined,
        effort,
    });
}
function turnStartDefaultParams(payload, options = {}) {
    const runtimeSnapshot = payload.runtimeSnapshot;
    const codexConfig = jsonRecord(runtimeSnapshot.codexConfig);
    const modelDefaults = researcherSettings(runtimeSnapshot, codexConfig);
    return withoutNullish({
        cwd: options.cwd ?? payload.layout.workspacePath,
        model: stringValue(modelDefaults.model) ?? stringValue(codexConfig.model),
        serviceTier: codexServiceTier(modelDefaults.serviceTier),
        effort: codexReasoningEffort(modelDefaults.reasoningEffort),
        approvalPolicy: codexApprovalPolicy(codexConfig.approvalPolicy),
        approvalsReviewer: codexConfig.approvalsReviewer,
        sandboxPolicy: codexConfig.sandboxPolicy ?? defaultCodexSandboxPolicy(runtimeSnapshot, {
            codexConfig,
            resolvedNetworkMode: options.resolvedNetworkMode,
        }),
    });
}
export function codexUserInputs(input) {
    return input.map((item) => {
        switch (item.type) {
            case "text":
                return {
                    type: "text",
                    text: item.text,
                    text_elements: [],
                };
        }
    });
}
export function extractThreadId(value) {
    const response = jsonRecord(value);
    const thread = jsonRecord(response.thread);
    return stringValue(thread.id);
}
export function extractTurnId(value) {
    const response = jsonRecord(value);
    const turn = jsonRecord(response.turn);
    return stringValue(turn.id);
}
export function extractReviewThreadId(value) {
    return stringValue(jsonRecord(value).reviewThreadId);
}
function sessionObjective(inputPayload) {
    return (stringValue(inputPayload.objective) ??
        stringValue(inputPayload.prompt) ??
        stringValue(inputPayload.instructions) ??
        "Start the Codex session for this LiveWorkflow workflow step.");
}
function researcherSettings(runtimeSnapshot, codexConfig) {
    const researcher = jsonRecord(runtimeSnapshot.researcher);
    return Object.keys(researcher).length > 0
        ? researcher
        : normalizeResearcherModelSettingsWithLegacyConfigFallback(runtimeSnapshot.modelDefaults, codexConfig);
}
function codexReasoningEffort(value) {
    return CodexReasoningEffortSchema.parse(value);
}
function codexServiceTier(value) {
    const serviceTier = CodexServiceTierSchema.parse(value ?? DefaultCodexServiceTier);
    return serviceTier === "regular" ? undefined : serviceTier;
}
function codexApprovalPolicy(value) {
    return value === LegacyCodexApprovalPolicy
        ? LegacyCodexApprovalPolicyFallback
        : value ?? DefaultCodexApprovalPolicy;
}
function approvalPolicyOverrides(overrides) {
    const raw = jsonRecord(overrides);
    if (!hasOwn(raw, "approvalPolicy")) {
        return raw;
    }
    return {
        ...raw,
        approvalPolicy: codexApprovalPolicyOverride(raw.approvalPolicy),
    };
}
function codexApprovalPolicyOverride(value) {
    return value === LegacyCodexApprovalPolicy ? LegacyCodexApprovalPolicyFallback : value;
}
function defaultCodexSandbox(codexConfig) {
    return hasCodexPermissions(codexConfig) ? undefined : DefaultCodexSandbox;
}
function defaultCodexSandboxPolicy(runtimeSnapshot, options) {
    if (hasCodexPermissions(options.codexConfig)) {
        return undefined;
    }
    if (options.resolvedNetworkMode === "none") {
        return DefaultNetworkRestrictedCodexSandboxPolicy;
    }
    const dockerPolicy = normalizeAgentRuntimeDockerPolicy(runtimeSnapshot.dockerPolicy ?? runtimeSnapshot.resourcePolicy);
    return dockerPolicy.network === "none"
        ? DefaultNetworkRestrictedCodexSandboxPolicy
        : DefaultNetworkEnabledCodexSandboxPolicy;
}
function hasCodexPermissions(codexConfig) {
    return codexConfig.permissions !== undefined && codexConfig.permissions !== null;
}
function hasOwn(record, key) {
    return Object.prototype.hasOwnProperty.call(record, key);
}
function positiveIntegerValue(value) {
    return typeof value === "number" && Number.isSafeInteger(value) && value > 0
        ? value
        : null;
}
function withoutUndefined(value) {
    const result = {};
    for (const [key, entry] of Object.entries(value)) {
        if (entry !== undefined) {
            result[key] = entry;
        }
    }
    return result;
}
