import {
  DefaultCodexServiceTier,
  CodexReasoningEffortSchema,
  CodexServiceTierSchema,
  normalizeAgentRuntimeDockerPolicy,
  normalizeResearcherModelSettingsWithLegacyConfigFallback,
  type Json,
  type VmCodexUserInput,
  type VmSessionStartPayload,
} from "../../contracts/index.js";
import { jsonRecord, stringValue, withoutNullish } from "./jsonUtils.js";

const DefaultCodexApprovalPolicy = "never";
const LegacyCodexApprovalPolicy = "on-failure";
const LegacyCodexApprovalPolicyFallback = "on-request";
const DefaultCodexSandbox = "danger-full-access";
const BackgroundTerminalMaxTimeoutKey = "background_terminal_max_timeout";
const DefaultNetworkEnabledCodexSandboxPolicy: Record<string, Json> = {
  type: "externalSandbox",
  networkAccess: "enabled",
};
const DefaultNetworkRestrictedCodexSandboxPolicy: Record<string, Json> = {
  type: "externalSandbox",
  networkAccess: "restricted",
};

export function threadParams(
  payload: VmSessionStartPayload,
  overrides: { threadId?: string; cwd?: string; persistExtendedHistory?: boolean } = {}
): Record<string, Json> {
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

export function threadResumeParams(
  payload: VmSessionStartPayload,
  options: {
    threadId: string;
    persistExtendedHistory?: boolean;
    replayRuntimeConfig?: boolean;
  },
  overrides: Record<string, Json> | undefined = undefined
): Record<string, Json> {
  return {
    ...threadResumePermissionParams(payload),
    ...(options.replayRuntimeConfig ? threadResumeRuntimeParams(payload) : {}),
    ...approvalPolicyOverrides(overrides),
    threadId: options.threadId,
    persistExtendedHistory: options.persistExtendedHistory ?? false,
  };
}

export function threadForkParams(
  payload: VmSessionStartPayload,
  options: { threadId: string; cwd?: string; persistExtendedHistory?: boolean },
  overrides: Record<string, Json> | undefined = undefined
): Record<string, Json> {
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

function threadResumePermissionParams(payload: VmSessionStartPayload): Record<string, Json> {
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

function threadResumeRuntimeParams(payload: VmSessionStartPayload): Record<string, Json> {
  const codexConfig = jsonRecord(payload.runtimeSnapshot.codexConfig);
  const config = jsonRecord(codexConfig.config);
  const backgroundTerminalMaxTimeoutMs = positiveIntegerValue(
    config[BackgroundTerminalMaxTimeoutKey]
  );

  return withoutNullish({
    developerInstructions: stringValue(codexConfig.developerInstructions),
    config: backgroundTerminalMaxTimeoutMs === null
      ? undefined
      : {
        [BackgroundTerminalMaxTimeoutKey]: backgroundTerminalMaxTimeoutMs,
      },
  });
}

export function turnParams(
  payload: VmSessionStartPayload,
  overrides: { cwd?: string; resolvedNetworkMode?: string | null } = {}
): Record<string, Json> {
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

export function turnStartParams(
  payload: VmSessionStartPayload,
  input: VmCodexUserInput[],
  overrides: Record<string, Json> | undefined,
  options: { cwd?: string; resolvedNetworkMode?: string | null } = {}
): Record<string, Json> {
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

export function turnStartOverrides(overrides: Record<string, Json> | undefined): Record<string, Json> {
  const raw = jsonRecord(overrides);
  const {
    approvalPolicy: rawApprovalPolicy,
    reasoningEffort: rawReasoningEffort,
    serviceTier: rawServiceTier,
    ...rest
  } = raw;
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

function turnStartDefaultParams(
  payload: VmSessionStartPayload,
  options: { cwd?: string; resolvedNetworkMode?: string | null } = {}
): Record<string, Json> {
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

export function codexUserInputs(input: VmCodexUserInput[]): Record<string, Json>[] {
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

export function extractThreadId(value: unknown): string | null {
  const response = jsonRecord(value);
  const thread = jsonRecord(response.thread);
  return stringValue(thread.id);
}

export function extractTurnId(value: unknown): string | null {
  const response = jsonRecord(value);
  const turn = jsonRecord(response.turn);
  return stringValue(turn.id);
}

export function extractReviewThreadId(value: unknown): string | null {
  return stringValue(jsonRecord(value).reviewThreadId);
}

function sessionObjective(inputPayload: Record<string, Json>): string {
  return (
    stringValue(inputPayload.objective) ??
    stringValue(inputPayload.prompt) ??
    stringValue(inputPayload.instructions) ??
    "Start the Codex session for this LiveWorkflow workflow step."
  );
}

function researcherSettings(
  runtimeSnapshot: Record<string, Json>,
  codexConfig: Record<string, Json>
): Record<string, Json> {
  const researcher = jsonRecord(runtimeSnapshot.researcher);
  return Object.keys(researcher).length > 0
    ? researcher
    : normalizeResearcherModelSettingsWithLegacyConfigFallback(
        runtimeSnapshot.modelDefaults,
        codexConfig
      );
}

function codexReasoningEffort(value: unknown): Json {
  return CodexReasoningEffortSchema.parse(value);
}

function codexServiceTier(value: unknown): Json | undefined {
  const serviceTier = CodexServiceTierSchema.parse(value ?? DefaultCodexServiceTier);
  return serviceTier === "regular" ? undefined : serviceTier;
}

function codexApprovalPolicy(value: Json | undefined): Json {
  return value === LegacyCodexApprovalPolicy
    ? LegacyCodexApprovalPolicyFallback
    : value ?? DefaultCodexApprovalPolicy;
}

function approvalPolicyOverrides(overrides: Record<string, Json> | undefined): Record<string, Json> {
  const raw = jsonRecord(overrides);

  if (!hasOwn(raw, "approvalPolicy")) {
    return raw;
  }

  return {
    ...raw,
    approvalPolicy: codexApprovalPolicyOverride(raw.approvalPolicy),
  };
}

function codexApprovalPolicyOverride(value: Json): Json {
  return value === LegacyCodexApprovalPolicy ? LegacyCodexApprovalPolicyFallback : value;
}

function defaultCodexSandbox(codexConfig: Record<string, Json>): string | undefined {
  return hasCodexPermissions(codexConfig) ? undefined : DefaultCodexSandbox;
}

function defaultCodexSandboxPolicy(
  runtimeSnapshot: Record<string, Json>,
  options: { codexConfig: Record<string, Json>; resolvedNetworkMode?: string | null }
): Record<string, Json> | undefined {
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

function hasCodexPermissions(codexConfig: Record<string, Json>): boolean {
  return codexConfig.permissions !== undefined && codexConfig.permissions !== null;
}

function hasOwn(record: Record<string, Json>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function positiveIntegerValue(value: unknown): number | null {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0
    ? value
    : null;
}

function withoutUndefined(value: Record<string, unknown>): Record<string, Json> {
  const result: Record<string, Json> = {};

  for (const [key, entry] of Object.entries(value)) {
    if (entry !== undefined) {
      result[key] = entry as Json;
    }
  }

  return result;
}
