import { z } from "zod";
import { ByteCountSchema, ISODateTimeSchema, JsonSchema, ScopeTypes, UUIDSchema, } from "./core.js";
import { AgentSessionEventSchema, ArtifactSchema, } from "./execution.js";
import { ApprovalTaskSchema } from "./review.js";
import { AgentSessionRefSchema } from "./session.js";
import { isSafeRelativePath } from "./pathSafety.js";
export const YP_LIVE_WORKFLOW_CLIENT_PROTOCOL = "yp-live-workflow.client.v1";
export const YP_LIVE_WORKFLOW_VM_PROTOCOL = "yp-live-workflow.vm.v1";
export const BrowserCommands = [
    "subscribe",
    "unsubscribe",
    "session.turn.start",
    "session.turn.steer",
    "session.interrupt",
    "session.inject_items",
    "session.approval.respond",
    "session.review.start",
    "session.aux_terminal.open",
    "session.aux_terminal.input",
    "session.aux_terminal.resize",
    "session.aux_terminal.close",
    "review.case.claim",
    "review.case.comment",
    "review.case.vote",
    "review.case.resolve",
    "brief.mark_read",
    "paper.patch.accept",
    "paper.patch.reject",
    "signal.promote_to_experiment",
    "signal.attach_to_paper",
    "run.cancel",
    "run.pause",
    "run.resume",
];
export const BrowserEvents = [
    "session.snapshot",
    "session.event",
    "session.stream.delta",
    "session.status.changed",
    "session.step_boundary.created",
    "chief_scientist.decision.applied",
    "chief_scientist.decision.failed",
    "session.approval.pending",
    "session.approval.resolved",
    "session.aux_terminal.opened",
    "session.aux_terminal.chunk",
    "session.aux_terminal.closed",
    "human_case.created",
    "human_case.updated",
    "finding.created",
    "finding.updated",
    "artifact.ready",
    "planning_job.updated",
    "infographic_job.updated",
    "sweep.job.updated",
    "signal.created",
    "signal.updated",
    "paper.updated",
    "brief.ready",
    "evolution.archive.updated",
    "run.status.changed",
    "run.step.status.changed",
    "run.monitor.updated",
    "workflow.worker.updated",
    "vm.telemetry",
    "usage.updated",
    "live.updated",
    "notification",
];
export const NormalizedSessionEvents = [
    "thread.started",
    "thread.status.changed",
    "thread.closed",
    "turn.started",
    "turn.plan.updated",
    "turn.diff.updated",
    "turn.completed",
    "session.error",
    "message.delta",
    "message.completed",
    "command.output.delta",
    "command.terminal.input",
    "file.output.delta",
    "item.started",
    "item.completed",
    "approval.requested",
    "approval.resolved",
    "review.entered",
    "review.exited",
    "metrics.updated",
    "quota.updated",
    "usage.routing.switched",
    "usage.routing.unavailable",
    "codex.raw",
];
export const VmCommands = [
    "workflow.attach",
    "workflow.graph",
    "workflow.snapshot",
    "workflow.inputs",
    "workflow.run",
    "workflow.control",
    "workflow.models",
    "workflow.remove-input",
    "workflow.restore",
    "workflow.storage",
    "workflow.prune",
    "workspace.prepare",
    "workspace.file.materialize",
    "workspace.file.read",
    "workspace.archive",
    "runtime.ensure_image",
    "codex.auth.login.start",
    "codex.auth.login.complete",
    "codex.auth.login.cancel",
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
    "session.aux_terminal.open",
    "session.aux_terminal.input",
    "session.aux_terminal.resize",
    "session.aux_terminal.close",
    "session.terminate",
    "artifact.collect",
    "dataset.promote",
    "dataset.output.normalize",
    "dataset.validate",
    "dataset.file.preview",
    "import.start",
];
export const VmSessionControlCommands = [
    "workspace.archive",
    "session.pause",
    "session.resume",
    "session.thread.fork",
    "session.turn.start",
    "session.turn.steer",
    "session.inject_items",
    "session.interrupt",
    "session.approval.respond",
    "session.review.start",
    "session.terminate",
];
export const VmEvents = [
    "vm.register",
    "vm.heartbeat",
    "vm.telemetry",
    "workspace.prepared",
    "workspace.file.ready",
    "codex.auth.login.started",
    "codex.auth.login.completed",
    "codex.auth.login.cancelled",
    "codex.auth.material.updated",
    "session.started",
    "session.status.changed",
    "session.event",
    "session.approval.pending",
    "session.approval.resolved",
    "session.aux_terminal.opened",
    "session.aux_terminal.chunk",
    "session.aux_terminal.closed",
    "artifact.ready",
    "dataset.promoted",
    "dataset.output.normalized",
    "dataset.validated",
    "dataset.file.preview.ready",
    "import.progress",
    "vm.error",
];
export const VmGpuTelemetryStatuses = ["ok", "unavailable", "error"];
export const CodexRetryClassificationSchema = z.enum([
    "server_overloaded",
    "usage_limit",
    "transient_connection",
    "internal_server_error",
]);
export const CodexHarnessRetryMetadataSchema = z
    .object({
    owner: z.literal("yp-live-workflow"),
    scheduled: z.boolean(),
    classification: CodexRetryClassificationSchema,
    attempt: z.number().int().positive(),
    nominalDelayMs: z.number().int().nonnegative(),
    delayMs: z.number().int().nonnegative(),
    nextRetryAt: ISODateTimeSchema,
})
    .strict();
export const VmPendingLogicalTurnRetrySchema = z
    .object({
    method: z.enum(["turn/start", "review/start"]),
    params: z.record(z.string(), JsonSchema),
    metadata: CodexHarnessRetryMetadataSchema,
    turnId: z.string().min(1).optional(),
})
    .strict();
/**
 * True while either Codex itself or the LiveWorkflow harness owns recovery for an
 * otherwise terminal-looking app-server event.
 */
export function codexSessionEventWillRetry(payload) {
    if (payload.willRetry === true) {
        return true;
    }
    const retry = jsonRecordValue(payload.ypLiveWorkflowRetry);
    return retry?.owner === "yp-live-workflow" && retry.scheduled === true;
}
/**
 * Classifies failures that are safe for the automated harness to replay. The
 * structured Codex error code is authoritative; text matching is retained for
 * older app-server versions and provider-specific errors.
 */
export function codexRetryClassification(payload) {
    const error = jsonRecordValue(payload.error);
    const turn = jsonRecordValue(payload.turn);
    const turnError = jsonRecordValue(turn?.error);
    const candidate = error ?? turnError ?? payload;
    const info = candidate.codexErrorInfo ?? payload.codexErrorInfo;
    const infoName = codexErrorInfoName(info);
    const infoStatus = codexErrorHttpStatus(info);
    const status = infoStatus ??
        numericValue(candidate.httpStatusCode) ??
        numericValue(payload.httpStatusCode);
    if (infoName === "serverOverloaded") {
        return "server_overloaded";
    }
    if (infoName === "usageLimitExceeded") {
        return "usage_limit";
    }
    if (infoName === "internalServerError") {
        return "internal_server_error";
    }
    if (infoName === "httpConnectionFailed" ||
        infoName === "responseStreamConnectionFailed" ||
        infoName === "responseStreamDisconnected" ||
        infoName === "responseTooManyFailedAttempts") {
        if (status === null) {
            return "transient_connection";
        }
        if (status === 429) {
            return "usage_limit";
        }
        if (status === 408) {
            return "transient_connection";
        }
        return status >= 500 ? "internal_server_error" : null;
    }
    if (infoName === "unauthorized" ||
        infoName === "badRequest" ||
        infoName === "contextWindowExceeded" ||
        infoName === "sessionBudgetExceeded" ||
        infoName === "cyberPolicy" ||
        infoName === "threadRollbackFailed" ||
        infoName === "sandboxError") {
        return null;
    }
    if (status === 429) {
        return "usage_limit";
    }
    if (status !== null && (status === 408 || status >= 500)) {
        return status >= 500 ? "internal_server_error" : "transient_connection";
    }
    const message = [
        stringValueOrNull(payload.message),
        stringValueOrNull(candidate.message),
        stringValueOrNull(candidate.additionalDetails),
    ]
        .filter((value) => Boolean(value))
        .join(" ")
        .toLowerCase();
    if (/\b(full|at|over) capacity\b|server.?overload|temporar(?:y|ily) unavailable|try (?:a )?different (?:model|mode)/iu.test(message)) {
        return "server_overloaded";
    }
    if (/\b429\b|rate.?limit|usage.?limit|insufficient.?quota|quota|credits? (?:exhausted|depleted|reached|used)/iu.test(message)) {
        return "usage_limit";
    }
    if (/\b(?:ECONNRESET|ETIMEDOUT|EAI_AGAIN)\b|timed? ?out|connection (?:failed|reset|closed)|stream (?:failed|disconnected)/iu.test(message)) {
        return "transient_connection";
    }
    if (/internal server error|service unavailable|bad gateway|gateway timeout/iu.test(message)) {
        return "internal_server_error";
    }
    return null;
}
function codexErrorInfoName(value) {
    if (typeof value === "string") {
        return value;
    }
    const record = jsonRecordValue(value);
    return record ? (Object.keys(record)[0] ?? null) : null;
}
function codexErrorHttpStatus(value) {
    const record = jsonRecordValue(value);
    if (!record) {
        return null;
    }
    const details = jsonRecordValue(Object.values(record)[0]);
    return numericValue(details?.httpStatusCode);
}
function jsonRecordValue(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value)
        ? value
        : null;
}
function stringValueOrNull(value) {
    return typeof value === "string" && value.length > 0 ? value : null;
}
function numericValue(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
}
export const SessionConversationEventTypes = [
    "codex.input.started",
    "codex.input.steered",
    "message.completed",
];
export const ClientMessageTypes = [
    ...BrowserCommands,
    ...BrowserEvents,
];
export const VmMessageTypes = [...VmCommands, ...VmEvents];
export const WorkflowWorkersTopic = "workflow:workers";
export const ReviewJobTopicScopeType = "review_job";
export const PlanningJobTopicScopeType = "planning_job";
export const InfographicJobTopicScopeType = "infographic_job";
export const RunMonitorTopicPrefix = "monitor:run";
export function makeScopeTopic(scope) {
    return `${scope.type}:${scope.id}`;
}
export function makeReviewJobTopic(reviewJobId) {
    return `${ReviewJobTopicScopeType}:${reviewJobId}`;
}
export function makePlanningJobTopic(planningJobId) {
    return `${PlanningJobTopicScopeType}:${planningJobId}`;
}
export function makeInfographicJobTopic(infographicJobId) {
    return `${InfographicJobTopicScopeType}:${infographicJobId}`;
}
export function makeRunMonitorTopic(runId) {
    return `${RunMonitorTopicPrefix}:${runId}`;
}
export function makeBriefTopic(scopeType, scopeId) {
    return `brief:${scopeType}:${scopeId}`;
}
export function parseRealtimeTopic(topic) {
    const normalized = topic.trim();
    if (normalized === WorkflowWorkersTopic) {
        return { type: "workflow_workers" };
    }
    const parts = normalized.split(":");
    if (parts[0] === "monitor") {
        if (parts.length !== 3 || parts[1] !== "run" || parts[2].length === 0) {
            return null;
        }
        return { type: "run_monitor", runId: parts[2] };
    }
    if (parts[0] === "brief") {
        if (parts.length !== 3 || !isScopeType(parts[1]) || parts[2].length === 0) {
            return null;
        }
        return { type: "brief", scope: { type: parts[1], id: parts[2] } };
    }
    if (parts.length !== 2 || parts[1].length === 0) {
        return null;
    }
    if (parts[0] === ReviewJobTopicScopeType) {
        return { type: "review_job", reviewJobId: parts[1] };
    }
    if (parts[0] === PlanningJobTopicScopeType) {
        return { type: "planning_job", planningJobId: parts[1] };
    }
    if (parts[0] === InfographicJobTopicScopeType) {
        return { type: "infographic_job", infographicJobId: parts[1] };
    }
    if (isScopeType(parts[0])) {
        return { type: "scope", scope: { type: parts[0], id: parts[1] } };
    }
    return null;
}
export function normalizeRealtimeTopic(topic) {
    const parsed = parseRealtimeTopic(topic);
    if (!parsed) {
        return null;
    }
    switch (parsed.type) {
        case "scope":
            return makeScopeTopic(parsed.scope);
        case "review_job":
            return makeReviewJobTopic(parsed.reviewJobId);
        case "planning_job":
            return makePlanningJobTopic(parsed.planningJobId);
        case "infographic_job":
            return makeInfographicJobTopic(parsed.infographicJobId);
        case "run_monitor":
            return makeRunMonitorTopic(parsed.runId);
        case "workflow_workers":
            return WorkflowWorkersTopic;
        case "brief":
            return makeBriefTopic(parsed.scope.type, parsed.scope.id);
    }
}
export function isScopeType(value) {
    return ScopeTypes.includes(value);
}
export function isBrowserCommand(value) {
    return BrowserCommands.includes(value);
}
export function isBrowserEvent(value) {
    return BrowserEvents.includes(value);
}
export function isClientMessageType(value) {
    return ClientMessageTypes.includes(value);
}
export function isVmCommand(value) {
    return VmCommands.includes(value);
}
export function isVmEvent(value) {
    return VmEvents.includes(value);
}
export function isVmMessageType(value) {
    return VmMessageTypes.includes(value);
}
export const WsEnvelopeSchema = z
    .object({
    protocol: z.enum([
        YP_LIVE_WORKFLOW_CLIENT_PROTOCOL,
        YP_LIVE_WORKFLOW_VM_PROTOCOL,
    ]),
    messageType: z.string().min(1),
    requestId: z.string().optional(),
    seq: z.number().int().nonnegative().optional(),
    cursor: z.string().optional(),
    ts: ISODateTimeSchema,
    data: JsonSchema,
})
    .strict();
export const ClientWsEnvelopeSchema = WsEnvelopeSchema.extend({
    protocol: z.literal(YP_LIVE_WORKFLOW_CLIENT_PROTOCOL),
    messageType: z.string().refine(isClientMessageType, {
        message: "Unknown yp-live-workflow.client.v1 message type",
    }),
});
export const VmWsEnvelopeSchema = WsEnvelopeSchema.extend({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.string().refine(isVmMessageType, {
        message: "Unknown yp-live-workflow.vm.v1 message type",
    }),
});
export const BrowserSubscribeCommandDataSchema = z
    .object({
    topic: z.string().min(1).optional(),
    topics: z.array(z.string().min(1)).optional(),
    cursors: z.record(z.string().min(1), z.string().min(1)).optional(),
    includeArtifacts: z.boolean().optional(),
    snapshot: z.boolean().optional(),
    replayLimit: z.number().int().positive().optional(),
})
    .strict();
export const BrowserUnsubscribeCommandDataSchema = z
    .object({
    topic: z.string().min(1).optional(),
    topics: z.array(z.string().min(1)).optional(),
})
    .strict();
export const VmHostVolumeSnapshotSchema = z
    .object({
    mountPath: z.string().min(1),
    role: z.string().min(1),
    totalBytes: ByteCountSchema.nullable().optional(),
    availableBytes: ByteCountSchema.nullable().optional(),
    metadata: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
export const VmHostSystemSnapshotSchema = z
    .object({
    hostname: z.string().min(1),
    platform: z.string().min(1),
    arch: z.string().min(1),
    cpuCount: z.number().int().nonnegative(),
    cpuModel: z.string().nullable().optional(),
    loadAverage: z.array(z.number()),
    uptimeSeconds: z.number().nonnegative(),
    totalMemoryBytes: z.number().nonnegative(),
    freeMemoryBytes: z.number().nonnegative(),
})
    .strict();
export const VmRegisterPayloadSchema = z
    .object({
    vmHostId: UUIDSchema.nullable().optional(),
    name: z.string().min(1),
    capabilities: z.record(z.string(), JsonSchema),
    metadata: z.record(z.string(), JsonSchema).optional(),
    volumes: z.array(VmHostVolumeSnapshotSchema).optional(),
    system: VmHostSystemSnapshotSchema.optional(),
})
    .strict();
export const VmHeartbeatPayloadSchema = z
    .object({
    vmHostId: UUIDSchema,
    status: z.string().min(1).optional(),
    capabilities: z.record(z.string(), JsonSchema).optional(),
    metadata: z.record(z.string(), JsonSchema).optional(),
    system: VmHostSystemSnapshotSchema.optional(),
})
    .strict();
const VmTelemetryByteValueSchema = ByteCountSchema;
export const VmContainerWritableMountSnapshotSchema = z
    .object({
    containerPath: z.string().min(1),
    role: z.string().min(1),
    readOnly: z.literal(false).optional(),
    usedBytes: VmTelemetryByteValueSchema.nullable().optional(),
    totalBytes: VmTelemetryByteValueSchema.nullable().optional(),
    availableBytes: VmTelemetryByteValueSchema.nullable().optional(),
    truncated: z.boolean().optional(),
    error: z.string().nullable().optional(),
})
    .strict();
export const VmContainerDatasetMountSnapshotSchema = z
    .object({
    containerPath: z.string().min(1),
    datasetVersionId: z.string().min(1),
    name: z.string().nullable().optional(),
    versionLabel: z.string().nullable().optional(),
    readOnly: z.literal(true),
    sizeBytes: VmTelemetryByteValueSchema.nullable().optional(),
})
    .strict();
export const VmContainerStorageSnapshotSchema = z
    .object({
    writableMounts: z.array(VmContainerWritableMountSnapshotSchema).optional(),
    datasetMounts: z.array(VmContainerDatasetMountSnapshotSchema).optional(),
})
    .strict();
export const VmContainerStatsSnapshotSchema = z
    .object({
    containerName: z.string().min(1),
    sessionId: z.string().nullable().optional(),
    runId: z.string().nullable().optional(),
    cpuPercent: z.number().nullable().optional(),
    memoryBytes: z.number().nullable().optional(),
    memoryLimitBytes: z.number().nullable().optional(),
    memoryPercent: z.number().nullable().optional(),
    storage: VmContainerStorageSnapshotSchema.optional(),
})
    .strict();
export const VmTelemetryPayloadSchema = z
    .object({
    vmHostId: UUIDSchema,
    telemetry: z.record(z.string(), JsonSchema),
    volumes: z.array(VmHostVolumeSnapshotSchema).optional(),
    capabilities: z.record(z.string(), JsonSchema).optional(),
    metadata: z.record(z.string(), JsonSchema).optional(),
    system: VmHostSystemSnapshotSchema.optional(),
    containers: z.array(VmContainerStatsSnapshotSchema).optional(),
})
    .strict();
const SafeRelativePathSchema = z.string().min(1).refine(isSafeRelativePath, {
    message: "Path must be relative and stay inside the managed workspace",
});
const SafeGitHubFolderPathSchema = z
    .string()
    .min(1)
    .refine((value) => value === "." || isSafeRelativePath(value), {
    message: "GitHub folder path must be `.` or a safe relative path",
});
const SafePathSegmentSchema = z.string().min(1).refine(isSafePathSegment, {
    message: "Name must be a safe path segment",
});
export const WorkspacePrepareAuditContextSchema = z
    .object({
    commandId: z.string().min(1),
    requestedByUserId: z.number().int().positive().nullable().optional(),
    requestedByType: z.enum(["user", "system"]).optional(),
    groupId: z.string().min(1),
    experimentId: UUIDSchema,
    workspaceId: UUIDSchema,
    vmHostId: UUIDSchema,
    requestedAt: ISODateTimeSchema,
    runId: UUIDSchema.nullable().optional(),
    runStepId: UUIDSchema.nullable().optional(),
})
    .strict();
export const WorkspaceMaterializationFileSchema = z.union([
    z
        .object({
        path: SafeRelativePathSchema,
        content: z.string(),
        mode: z.number().int().min(0).max(0o777).nullable().optional(),
    })
        .strict(),
    z
        .object({
        path: SafeRelativePathSchema,
        contentBase64: z.string().min(1),
        encoding: z.literal("base64"),
        mode: z.number().int().min(0).max(0o777).nullable().optional(),
    })
        .strict(),
]);
export const WorkspaceMaterializationRuleSchema = z
    .object({
    name: SafePathSegmentSchema,
    content: z.string(),
})
    .strict();
export const WorkspaceMaterializationSkillSchema = z
    .object({
    name: SafePathSegmentSchema,
    skillMd: z.string(),
    files: z.array(WorkspaceMaterializationFileSchema).optional(),
})
    .strict();
export const WorkspaceMaterializationSchema = z
    .object({
    agentsMd: z.string().optional(),
    codexHomeAgentsOverrideMd: z.string().optional(),
    codexConfigToml: z.string().optional(),
    rules: z.array(WorkspaceMaterializationRuleSchema).optional(),
    skills: z.array(WorkspaceMaterializationSkillSchema).optional(),
    fullPlanMd: z.string().optional(),
    researchPlanMd: z.string().optional(),
    files: z.array(WorkspaceMaterializationFileSchema).optional(),
    cacheFiles: z.array(WorkspaceMaterializationFileSchema).optional(),
})
    .strict();
export const WorkspaceGitHubFolderSchema = z
    .object({
    repositoryFullName: z
        .string()
        .min(1)
        .regex(/^[^/\s]+\/[^/\s]+$/u),
    cloneUrl: z.string().min(1),
    branchName: z.string().min(1),
    repoDirectoryName: SafePathSegmentSchema,
    folderPath: SafeGitHubFolderPathSchema,
    commitAuthorName: z.string().min(1),
    commitAuthorEmail: z.string().min(1).email(),
    htmlUrl: z.string().min(1).nullable().optional(),
    accessToken: z.string().min(1).nullable().optional(),
    tokenUsername: z.string().min(1).nullable().optional(),
})
    .strict();
export const WorkspacePreparePayloadSchema = z
    .object({
    commandId: z.string().min(1),
    auditContext: WorkspacePrepareAuditContextSchema,
    workspaceId: UUIDSchema,
    vmHostId: UUIDSchema,
    rootPath: z.string().min(1),
    datasetOutputPath: z.string().min(1).optional(),
    repoUrl: z.string().min(1).nullable().optional(),
    repoRef: z.string().min(1).nullable().optional(),
    githubFolder: WorkspaceGitHubFolderSchema.nullable().optional(),
    materialization: WorkspaceMaterializationSchema.optional(),
})
    .strict()
    .superRefine((payload, context) => {
    if (payload.commandId !== payload.auditContext.commandId) {
        context.addIssue({
            code: "custom",
            path: ["auditContext", "commandId"],
            message: "auditContext.commandId must match commandId",
        });
    }
    if (payload.workspaceId !== payload.auditContext.workspaceId) {
        context.addIssue({
            code: "custom",
            path: ["auditContext", "workspaceId"],
            message: "auditContext.workspaceId must match workspaceId",
        });
    }
    if (payload.vmHostId !== payload.auditContext.vmHostId) {
        context.addIssue({
            code: "custom",
            path: ["auditContext", "vmHostId"],
            message: "auditContext.vmHostId must match vmHostId",
        });
    }
});
export const WorkspacePreparedLayoutSchema = z
    .object({
    rootPath: z.string().min(1),
    workspacePath: z.string().min(1),
    codexHomePath: z.string().min(1),
    artifactsPath: z.string().min(1),
    cachePath: z.string().min(1),
    datasetOutputPath: z.string().min(1).optional(),
})
    .strict();
export const WorkspaceRepoPrepareResultSchema = z
    .object({
    status: z.enum(["cloned", "updated", "empty"]),
    repoUrl: z.string().min(1).nullable().optional(),
    repoRef: z.string().min(1).nullable().optional(),
    checkedOutRef: z.string().min(1).nullable().optional(),
})
    .strict();
export const WorkspaceGitHubFolderPrepareResultSchema = z
    .object({
    status: z.enum(["cloned", "updated"]),
    repositoryFullName: z.string().min(1),
    branchName: z.string().min(1),
    repoDirectoryName: SafePathSegmentSchema,
    folderPath: SafeGitHubFolderPathSchema,
    workspacePath: z.string().min(1),
    credentialHelperPath: z.string().min(1).nullable().optional(),
    checkedOutRef: z.string().min(1).nullable().optional(),
    checkedOutCommitSha: z.string().min(1).nullable().optional(),
})
    .strict();
export const WorkspacePreparedPayloadSchema = z
    .object({
    commandId: z.string().min(1),
    auditContext: WorkspacePrepareAuditContextSchema,
    workspaceId: UUIDSchema,
    vmHostId: UUIDSchema,
    rootPath: z.string().min(1),
    preparedAt: ISODateTimeSchema,
    layout: WorkspacePreparedLayoutSchema,
    repo: WorkspaceRepoPrepareResultSchema,
    githubFolder: WorkspaceGitHubFolderPrepareResultSchema.nullable().optional(),
    materializedFiles: z.array(SafeRelativePathSchema),
})
    .strict()
    .superRefine((payload, context) => {
    if (payload.commandId !== payload.auditContext.commandId) {
        context.addIssue({
            code: "custom",
            path: ["auditContext", "commandId"],
            message: "auditContext.commandId must match commandId",
        });
    }
});
export const VmPreviousArtifactMountSchema = z
    .object({
    sourcePath: z.string().min(1),
    containerPath: z.string().min(1),
    readOnly: z.literal(true),
    metadata: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
export const VmReviewEvidenceMountSchema = z
    .object({
    sourcePath: z.string().min(1),
    containerPath: z.string().min(1),
    readOnly: z.literal(true),
    evidenceType: z.enum(["workspace", "artifacts", "cache", "dataset-output"]),
    experimentId: UUIDSchema,
    forbiddenRelativePaths: z.array(SafeRelativePathSchema).optional(),
    metadata: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
export const WorkspaceFileMaterializePayloadSchema = z
    .object({
    commandId: z.string().min(1),
    workspaceId: UUIDSchema,
    vmHostId: UUIDSchema,
    rootPath: z.string().min(1),
    target: z.enum(["workspace", "artifacts"]).optional(),
    path: SafeRelativePathSchema,
    mode: z.number().int().min(0).max(0o777).nullable().optional(),
    contentType: z.string().min(1).nullable().optional(),
    sizeBytes: ByteCountSchema,
    checksumSha256: z.string().regex(/^[a-f0-9]{64}$/i),
})
    .strict();
export const WorkspaceFileMaterializedPayloadSchema = z
    .object({
    commandId: z.string().min(1),
    workspaceId: UUIDSchema,
    vmHostId: UUIDSchema,
    rootPath: z.string().min(1),
    target: z.enum(["workspace", "artifacts"]).optional(),
    path: SafeRelativePathSchema,
    contentChecksumSha256: z.string().regex(/^[a-f0-9]{64}$/i),
    sizeBytes: ByteCountSchema,
    materializedAt: ISODateTimeSchema,
})
    .strict();
export const WorkspaceFileReadPayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    workspaceId: UUIDSchema,
    path: z.string().min(1),
    scope: z.enum(["workspace", "review_evidence"]).optional(),
    maxBytes: z.number().int().positive().max(1000000).optional(),
    checksumOnly: z.boolean().optional(),
    statOnly: z.boolean().optional(),
})
    .strict()
    .superRefine((payload, context) => {
    if (payload.checksumOnly && payload.statOnly) {
        context.addIssue({
            code: "custom",
            message: "Workspace file reads cannot request checksumOnly and statOnly together",
        });
    }
    const valid = payload.scope === "review_evidence"
        ? isSafeReviewEvidencePath(payload.path)
        : SafeRelativePathSchema.safeParse(payload.path).success;
    if (!valid) {
        context.addIssue({
            code: "custom",
            path: ["path"],
            message: payload.scope === "review_evidence"
                ? "Review evidence path must be normalized beneath /review-sources/experiments or /datasets"
                : "Workspace path must be a safe relative path",
        });
    }
});
export const WorkspaceFileReadResponsePayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    workspaceId: UUIDSchema,
    path: z.string().min(1),
    scope: z.enum(["workspace", "review_evidence"]).optional(),
    content: z.string(),
    contentChecksumSha256: z.string().regex(/^[a-f0-9]{64}$/i),
    sizeBytes: ByteCountSchema,
    maxBytes: z.number().int().positive(),
    checksumOnly: z.boolean().optional(),
    statOnly: z.boolean().optional(),
    entryType: z.enum(["file", "directory"]).optional(),
    truncated: z.boolean(),
    readAt: ISODateTimeSchema,
})
    .strict()
    .superRefine((payload, context) => {
    const valid = payload.scope === "review_evidence"
        ? isSafeReviewEvidencePath(payload.path)
        : SafeRelativePathSchema.safeParse(payload.path).success;
    if (!valid) {
        context.addIssue({
            code: "custom",
            path: ["path"],
            message: "Invalid file-read response path",
        });
    }
});
export const VmDatasetPromotePayloadSchema = z
    .object({
    commandId: z.string().min(1),
    workspaceId: UUIDSchema,
    vmHostId: UUIDSchema,
    datasetVersionId: UUIDSchema,
    sourcePath: z.string().min(1),
    allowedSourceRootPath: z.string().min(1),
    manifestChecksumSha256: z.string().min(1).nullable().optional(),
    metadata: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
export const VmDatasetPromotedPayloadSchema = z
    .object({
    ok: z.literal(true),
    commandId: z.string().min(1),
    workspaceId: UUIDSchema,
    vmHostId: UUIDSchema,
    datasetVersionId: UUIDSchema,
    hotPath: z.string().min(1),
    uri: z.string().min(1),
    sourcePath: z.string().min(1),
    promotedAt: ISODateTimeSchema,
    sizeBytes: ByteCountSchema.nullable().optional(),
    mountedFiles: z.array(z.string()).optional(),
    mountedFileCount: z.number().int().nonnegative().optional(),
    mountedFilesTruncated: z.boolean().optional(),
    metadata: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
export const VmDatasetOutputNormalizePayloadSchema = z
    .object({
    commandId: z.string().min(1),
    workspaceId: UUIDSchema,
    vmHostId: UUIDSchema,
    sourcePath: z.string().min(1),
    allowedSourceRootPath: z.string().min(1),
    sessionId: z.string().min(1).nullable().optional(),
    metadata: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
export const VmDatasetOutputNormalizedPayloadSchema = z
    .object({
    ok: z.literal(true),
    commandId: z.string().min(1),
    workspaceId: UUIDSchema,
    vmHostId: UUIDSchema,
    sourcePath: z.string().min(1),
    normalizedAt: ISODateTimeSchema,
    mode: z.enum(["host", "container_fallback"]),
    fileCount: z.number().int().nonnegative(),
    directoryCount: z.number().int().nonnegative(),
    metadata: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
export const VmDatasetValidationAssetSchema = z
    .object({
    relativePath: z.string().min(1),
    status: z.string().min(1).nullable().optional(),
    sizeBytes: ByteCountSchema.nullable().optional(),
    checksumSha256: z.string().min(1).nullable().optional(),
})
    .strict();
export const VmDatasetValidationFileSchema = z
    .object({
    relativePath: z.string().min(1),
    sizeBytes: ByteCountSchema,
    checksumSha256: z
        .string()
        .regex(/^[0-9a-f]{64}$/i)
        .nullable()
        .optional(),
    format: z.string().min(1).nullable().optional(),
    compression: z.string().min(1).nullable().optional(),
})
    .strict();
export const VmDatasetValidatePayloadSchema = z
    .object({
    commandId: z.string().min(1),
    workspaceId: UUIDSchema,
    vmHostId: UUIDSchema,
    sourcePath: z.string().min(1),
    allowedSourceRootPath: z.string().min(1),
    expectedFiles: z.array(z.string().min(1)).optional(),
    assets: z.array(VmDatasetValidationAssetSchema).optional(),
    metadata: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
export const VmDatasetValidatedPayloadSchema = z
    .object({
    ok: z.literal(true),
    commandId: z.string().min(1),
    workspaceId: UUIDSchema,
    vmHostId: UUIDSchema,
    sourcePath: z.string().min(1),
    uri: z.string().min(1),
    validatedAt: ISODateTimeSchema,
    sizeBytes: ByteCountSchema.nullable().optional(),
    mountedFiles: z.array(z.string()).optional(),
    mountedFileCount: z.number().int().nonnegative().optional(),
    mountedFilesTruncated: z.boolean().optional(),
    files: z.array(VmDatasetValidationFileSchema).optional(),
    missingExpectedFiles: z.array(z.string()).optional(),
    missingAssetFiles: z.array(z.string()).optional(),
    checksumFailures: z.array(z.string()).optional(),
    sizeMismatches: z.array(z.string()).optional(),
    metadata: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
export const VmDatasetFilePreviewPayloadSchema = z
    .object({
    commandId: z.string().min(1),
    vmHostId: UUIDSchema,
    datasetVersionId: UUIDSchema,
    datasetLocationId: UUIDSchema,
    locationUri: z.string().min(1),
    path: SafeRelativePathSchema,
    maxBytes: z.number().int().positive().max(1000000).optional(),
})
    .strict();
export const VmDatasetFilePreviewReadyPayloadSchema = z
    .object({
    ok: z.literal(true),
    commandId: z.string().min(1),
    vmHostId: UUIDSchema,
    datasetVersionId: UUIDSchema,
    datasetLocationId: UUIDSchema,
    locationUri: z.string().min(1),
    path: SafeRelativePathSchema,
    content: z.string(),
    contentChecksumSha256: z.string().regex(/^[a-f0-9]{64}$/i),
    sizeBytes: ByteCountSchema,
    maxBytes: z.number().int().positive(),
    truncated: z.boolean(),
    readAt: ISODateTimeSchema,
})
    .strict();
export const VmAgentAckPayloadSchema = z
    .object({
    ok: z.literal(true),
    vmHostId: UUIDSchema,
    messageType: z.enum([
        "vm.register",
        "vm.heartbeat",
        "vm.telemetry",
        "session.event",
        "codex.auth.material.updated",
    ]),
})
    .strict();
export const VmBrokerHelloPayloadSchema = z
    .object({
    vmHostId: UUIDSchema,
    connectionId: z.string().min(1).nullable().optional(),
    capabilities: z.record(z.string(), JsonSchema),
    metadata: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
export const VmBrokerHelloAckPayloadSchema = z
    .object({
    ok: z.literal(true),
    vmHostId: UUIDSchema,
    connectionId: z.string().min(1),
})
    .strict();
export const VmBrokerCommandErrorPayloadSchema = z
    .object({
    ok: z.literal(false),
    commandId: z.string().min(1),
    messageType: z.enum(VmCommands),
    sessionId: UUIDSchema.nullable().optional(),
    code: z.string().min(1),
    message: z.string().min(1),
    details: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
export const VmBrokerHelloEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("vm.broker.hello"),
    ts: ISODateTimeSchema,
    data: VmBrokerHelloPayloadSchema,
})
    .strict();
export const VmBrokerHelloAckEnvelopeSchema = z
    .object({
    ok: z.literal(true),
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("vm.broker.hello.ack"),
    ts: ISODateTimeSchema,
    data: VmBrokerHelloAckPayloadSchema,
})
    .strict();
export const VmBrokerCommandErrorEnvelopeSchema = z
    .object({
    ok: z.literal(false),
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("vm.command.error"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmBrokerCommandErrorPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmWorkspacePrepareCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("workspace.prepare"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: WorkspacePreparePayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmWorkspacePreparedResponseEnvelopeSchema = z
    .object({
    ok: z.literal(true),
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("workspace.prepared"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: WorkspacePreparedPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmSessionStartAuthSchema = z
    .object({
    provider: z.string().min(1).nullable().optional(),
    authMode: z.string().min(1).nullable().optional(),
    secretRef: z.string().min(1).nullable().optional(),
    metadata: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
export const CodexAuthMaterialFileSchema = z
    .object({
    path: z.string().min(1),
    dataBase64: z.string().min(1),
    mode: z.number().int().nonnegative().nullable().optional(),
})
    .strict();
export const CodexAuthMaterialSchema = z
    .object({
    format: z.literal("codex_home_files_v1"),
    files: z.array(CodexAuthMaterialFileSchema).min(1),
    metadata: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
const Sha256HexSchema = z.string().regex(/^[a-f0-9]{64}$/i);
export const VmCodexAuthMaterialUpdatedPayloadSchema = z
    .object({
    vmHostId: UUIDSchema,
    sessionId: UUIDSchema,
    authProfileId: UUIDSchema,
    baseFingerprintSha256: Sha256HexSchema,
    currentFingerprintSha256: Sha256HexSchema,
    authMaterial: CodexAuthMaterialSchema,
    account: z.record(z.string(), JsonSchema).nullable().optional(),
    source: z.string().min(1).nullable().optional(),
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const VmCodexAuthLoginStartPayloadSchema = z
    .object({
    commandId: z.string().min(1),
    authProfileId: UUIDSchema,
    vmHostId: UUIDSchema,
    rootPath: z.string().min(1),
    loginType: z.literal("chatgptDeviceCode"),
})
    .strict();
export const VmCodexAuthLoginStartedPayloadSchema = z
    .object({
    ok: z.literal(true),
    commandId: z.string().min(1),
    authProfileId: UUIDSchema,
    vmHostId: UUIDSchema,
    rootPath: z.string().min(1),
    loginType: z.literal("chatgptDeviceCode"),
    loginId: z.string().min(1),
    verificationUrl: z.string().min(1),
    userCode: z.string().min(1),
})
    .strict();
export const VmCodexAuthLoginCompletePayloadSchema = z
    .object({
    commandId: z.string().min(1),
    authProfileId: UUIDSchema,
    vmHostId: UUIDSchema,
    rootPath: z.string().min(1),
    loginId: z.string().min(1),
    timeoutMs: z.number().int().positive().nullable().optional(),
})
    .strict();
export const VmCodexAuthLoginCompletedPayloadSchema = z
    .object({
    ok: z.literal(true),
    commandId: z.string().min(1),
    authProfileId: UUIDSchema,
    vmHostId: UUIDSchema,
    rootPath: z.string().min(1),
    loginId: z.string().min(1),
    account: z.record(z.string(), JsonSchema).nullable(),
    authMaterial: CodexAuthMaterialSchema,
})
    .strict();
export const VmCodexAuthLoginCancelPayloadSchema = z
    .object({
    commandId: z.string().min(1),
    authProfileId: UUIDSchema,
    vmHostId: UUIDSchema,
    rootPath: z.string().min(1),
    loginId: z.string().min(1),
})
    .strict();
export const VmCodexAuthLoginCancelledPayloadSchema = z
    .object({
    ok: z.literal(true),
    commandId: z.string().min(1),
    authProfileId: UUIDSchema,
    vmHostId: UUIDSchema,
    rootPath: z.string().min(1),
    loginId: z.string().min(1),
})
    .strict();
export const VmSessionDatasetMountLocationSchema = z
    .object({
    kind: z.enum(["gcs", "local"]),
    tier: z.enum(["cold", "hot"]),
    uri: z.string().min(1),
    storageClass: z.string().min(1).nullable().optional(),
    metadata: z.record(z.string(), JsonSchema).optional(),
})
    .strict()
    .superRefine((location, context) => {
    if (location.kind === "gcs" && !location.uri.startsWith("gs://")) {
        context.addIssue({
            code: "custom",
            path: ["uri"],
            message: "GCS dataset locations must use gs:// URIs",
        });
    }
    if (location.kind === "local" &&
        !location.uri.startsWith("/") &&
        !location.uri.startsWith("file:///")) {
        context.addIssue({
            code: "custom",
            path: ["uri"],
            message: "Local dataset locations must be absolute paths or file:// URIs",
        });
    }
});
export const VmSessionDatasetMountSchema = z
    .object({
    datasetVersionId: UUIDSchema,
    name: SafePathSegmentSchema,
    versionLabel: SafePathSegmentSchema,
    containerPath: z.string().min(1).refine(isSafeDatasetContainerPath, {
        message: "Dataset container path must stay under /datasets",
    }),
    access: z.literal("read_only"),
    required: z.boolean(),
    locations: z.array(VmSessionDatasetMountLocationSchema),
    manifestChecksumSha256: z.string().min(1).nullable().optional(),
    sizeBytes: ByteCountSchema.nullable().optional(),
    metadata: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
export const VmSessionStartPayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    runId: UUIDSchema,
    runStepId: UUIDSchema,
    nodeId: UUIDSchema,
    workspaceId: UUIDSchema,
    vmHostId: UUIDSchema,
    runtimeProfileId: UUIDSchema,
    authProfileId: UUIDSchema.nullable().optional(),
    layout: WorkspacePreparedLayoutSchema,
    runtimeSnapshot: z.record(z.string(), JsonSchema),
    inputPayload: z.record(z.string(), JsonSchema),
    auth: VmSessionStartAuthSchema.nullable().optional(),
    codexThreadId: z.string().min(1).nullable().optional(),
    persistExtendedHistory: z.boolean().optional(),
    initialTurnMode: z.enum(["start", "deferred"]).optional(),
    pendingLogicalTurnRetry: VmPendingLogicalTurnRetrySchema.nullable().optional(),
    pendingLogicalTurnRetries: z
        .array(VmPendingLogicalTurnRetrySchema)
        .max(2)
        .optional(),
    datasetMounts: z.array(VmSessionDatasetMountSchema).optional(),
    previousArtifactMounts: z.array(VmPreviousArtifactMountSchema).optional(),
    reviewEvidenceMounts: z.array(VmReviewEvidenceMountSchema).optional(),
    sensitiveHostPaths: z.array(z.string().min(1)).optional(),
})
    .strict();
export const VmSessionStartedPayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    workspaceId: UUIDSchema,
    vmHostId: UUIDSchema,
    codexThreadId: z.string().min(1),
    codexTurnId: z.string().min(1).nullable().optional(),
    vmEventStreamId: z.string().min(1).nullable().optional(),
    vmEventSeqBoundary: z.number().int().nonnegative().nullable().optional(),
    pendingLogicalTurnRetry: VmPendingLogicalTurnRetrySchema.nullable().optional(),
    pendingLogicalTurnRetries: z
        .array(VmPendingLogicalTurnRetrySchema)
        .max(2)
        .optional(),
    transport: z.literal("stdio"),
    runtimeMetadata: z.record(z.string(), JsonSchema),
})
    .strict();
export const VmCodexTextInputSchema = z
    .object({
    type: z.literal("text"),
    text: z.string(),
})
    .strict();
export const VmCodexUserInputSchema = VmCodexTextInputSchema;
export const VmSessionResumePayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    codexThreadId: z.string().min(1),
    persistExtendedHistory: z.boolean().optional(),
    overrides: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
export const VmSessionPausePayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    codexThreadId: z.string().min(1).nullable().optional(),
    codexTurnId: z.string().min(1).nullable().optional(),
    interruptActiveTurn: z.boolean().optional(),
    keepWarm: z.boolean().optional(),
    reason: z.string().min(1).nullable().optional(),
})
    .strict();
export const VmSessionThreadForkPayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    codexThreadId: z.string().min(1),
    persistExtendedHistory: z.boolean().optional(),
    overrides: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
export const VmSessionTurnStartPayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    codexThreadId: z.string().min(1),
    input: z.array(VmCodexUserInputSchema).min(1),
    overrides: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
export const VmSessionTurnSteerPayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    codexThreadId: z.string().min(1),
    codexTurnId: z.string().min(1),
    input: z.array(VmCodexUserInputSchema).min(1),
    overrides: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
export const VmSessionInterruptPayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    codexThreadId: z.string().min(1),
    codexTurnId: z.string().min(1).nullable().optional(),
})
    .strict();
export const VmSessionInjectItemsPayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    codexThreadId: z.string().min(1),
    items: z.array(JsonSchema),
})
    .strict();
export const VmSessionApprovalErrorSchema = z
    .object({
    code: z.number().int(),
    message: z.string().min(1),
    data: JsonSchema.optional(),
})
    .strict();
export const VmSessionApprovalRespondPayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    requestId: z.union([z.string().min(1), z.number()]),
    result: z.record(z.string(), JsonSchema).optional(),
    error: VmSessionApprovalErrorSchema.optional(),
})
    .strict()
    .superRefine((payload, context) => {
    if ((payload.result === undefined && payload.error === undefined) ||
        (payload.result !== undefined && payload.error !== undefined)) {
        context.addIssue({
            code: "custom",
            path: ["result"],
            message: "Exactly one of result or error must be provided",
        });
    }
});
export const BrowserSessionApprovalRespondCommandDataSchema = z
    .object({
    approvalTaskId: UUIDSchema,
    status: z.string().min(1).optional(),
    result: z.record(z.string(), JsonSchema).optional(),
    error: VmSessionApprovalErrorSchema.optional(),
})
    .strict();
export const BrowserSessionTurnStartCommandDataSchema = z
    .object({
    sessionId: UUIDSchema,
    input: z.array(VmCodexUserInputSchema).min(1),
    overrides: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
export const BrowserSessionTurnSteerCommandDataSchema = z
    .object({
    sessionId: UUIDSchema,
    input: z.array(VmCodexUserInputSchema).min(1),
    codexTurnId: z.string().min(1).optional(),
    overrides: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
export const BrowserSessionInterruptCommandDataSchema = z
    .object({
    sessionId: UUIDSchema,
    codexTurnId: z.string().min(1).optional(),
})
    .strict();
export const BrowserSessionInjectItemsCommandDataSchema = z
    .object({
    sessionId: UUIDSchema,
    items: z.array(JsonSchema),
})
    .strict();
export const VmSessionReviewTargetSchema = z.discriminatedUnion("type", [
    z
        .object({
        type: z.literal("uncommittedChanges"),
    })
        .strict(),
    z
        .object({
        type: z.literal("baseBranch"),
        branch: z.string().min(1),
    })
        .strict(),
    z
        .object({
        type: z.literal("commit"),
        sha: z.string().min(1),
        title: z.string().nullable().optional(),
    })
        .strict(),
    z
        .object({
        type: z.literal("custom"),
        instructions: z.string().min(1),
    })
        .strict(),
]);
export const VmSessionReviewStartPayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    codexThreadId: z.string().min(1),
    target: VmSessionReviewTargetSchema,
    delivery: z.enum(["inline", "detached"]).optional(),
})
    .strict();
export const BrowserSessionReviewStartCommandDataSchema = z
    .object({
    sessionId: UUIDSchema,
    target: VmSessionReviewTargetSchema,
    delivery: z.enum(["inline", "detached"]).optional(),
})
    .strict();
export const VmSessionTerminatePayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
})
    .strict();
export const VmWorkspaceArchivePayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    workspaceId: UUIDSchema.optional(),
})
    .strict();
export const VmSessionCommandAckPayloadSchema = z
    .object({
    ok: z.literal(true),
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    codexThreadId: z.string().min(1).nullable().optional(),
    codexTurnId: z.string().min(1).nullable().optional(),
    result: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
const AuxTerminalDimensionSchema = z.number().int().min(1).max(1000);
const AuxTerminalIdSchema = z.string().min(1);
export const VmAuxTerminalOpenPayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    cols: AuxTerminalDimensionSchema.optional(),
    rows: AuxTerminalDimensionSchema.optional(),
})
    .strict();
export const VmAuxTerminalInputPayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    terminalId: AuxTerminalIdSchema,
    data: z.string(),
})
    .strict();
export const VmAuxTerminalResizePayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    terminalId: AuxTerminalIdSchema,
    cols: AuxTerminalDimensionSchema,
    rows: AuxTerminalDimensionSchema,
})
    .strict();
export const VmAuxTerminalClosePayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    terminalId: AuxTerminalIdSchema,
})
    .strict();
export const VmAuxTerminalChunkPayloadSchema = z
    .object({
    sessionId: UUIDSchema,
    terminalId: AuxTerminalIdSchema,
    seq: z.number().int().nonnegative(),
    stream: z.enum(["stdout", "stderr"]),
    data: z.string(),
    ts: ISODateTimeSchema,
})
    .strict();
export const VmAuxTerminalOpenedPayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    terminalId: AuxTerminalIdSchema,
    runtime: z.enum(["container", "host"]).optional(),
    cwd: z.string().min(1),
    shell: z.string().min(1),
    pid: z.number().int().positive(),
    openedAt: ISODateTimeSchema,
    cols: AuxTerminalDimensionSchema,
    rows: AuxTerminalDimensionSchema,
    backlog: z.array(VmAuxTerminalChunkPayloadSchema),
})
    .strict();
export const VmAuxTerminalAckPayloadSchema = z
    .object({
    ok: z.literal(true),
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    terminalId: AuxTerminalIdSchema,
    cols: AuxTerminalDimensionSchema.optional(),
    rows: AuxTerminalDimensionSchema.optional(),
})
    .strict();
export const VmAuxTerminalClosedPayloadSchema = z
    .object({
    ok: z.literal(true),
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    terminalId: AuxTerminalIdSchema,
    closed: z.boolean(),
    exitCode: z.number().int().nullable().optional(),
    signal: z.string().nullable().optional(),
})
    .strict();
export const VmAuxTerminalBacklogPayloadSchema = z
    .object({
    sessionId: UUIDSchema,
    terminalId: AuxTerminalIdSchema,
    chunks: z.array(VmAuxTerminalChunkPayloadSchema),
    closed: z.boolean(),
    exitCode: z.number().int().nullable().optional(),
    signal: z.string().nullable().optional(),
})
    .strict();
export const BrowserAuxTerminalOpenCommandDataSchema = z
    .object({
    sessionId: UUIDSchema,
    cols: AuxTerminalDimensionSchema.optional(),
    rows: AuxTerminalDimensionSchema.optional(),
})
    .strict();
export const BrowserAuxTerminalInputCommandDataSchema = z
    .object({
    sessionId: UUIDSchema,
    terminalId: AuxTerminalIdSchema,
    data: z.string(),
})
    .strict();
export const BrowserAuxTerminalResizeCommandDataSchema = z
    .object({
    sessionId: UUIDSchema,
    terminalId: AuxTerminalIdSchema,
    cols: AuxTerminalDimensionSchema,
    rows: AuxTerminalDimensionSchema,
})
    .strict();
export const BrowserAuxTerminalCloseCommandDataSchema = z
    .object({
    sessionId: UUIDSchema,
    terminalId: AuxTerminalIdSchema,
})
    .strict();
export const ArtifactCollectPayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    runId: UUIDSchema,
    runStepId: UUIDSchema,
    workspaceId: UUIDSchema,
    vmHostId: UUIDSchema,
    artifactsPath: z.string().min(1),
    includeGlobs: z.array(z.string().min(1)).optional(),
    excludeGlobs: z.array(z.string().min(1)).optional(),
    upload: z.boolean().optional(),
    knownArtifacts: z
        .array(z
        .object({
        artifactId: UUIDSchema.nullable().optional(),
        relativePath: SafeRelativePathSchema,
        checksumSha256: z.string().regex(/^[a-f0-9]{64}$/i),
        sizeBytes: ByteCountSchema.optional(),
        objectUri: z.string().min(1).nullable().optional(),
    })
        .strict())
        .optional(),
})
    .strict();
export const CollectedArtifactSchema = z
    .object({
    artifactId: UUIDSchema.nullable().optional(),
    relativePath: SafeRelativePathSchema,
    localPath: z.string().min(1),
    localUri: z.string().min(1),
    objectUri: z.string().min(1).nullable().optional(),
    kind: z.string().min(1),
    contentType: z.string().min(1).nullable().optional(),
    sizeBytes: ByteCountSchema,
    checksumSha256: z.string().regex(/^[a-f0-9]{64}$/i),
    collectedAt: ISODateTimeSchema,
    metadata: z.record(z.string(), JsonSchema).optional(),
})
    .strict();
export const ArtifactCollectResponsePayloadSchema = z
    .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    runId: UUIDSchema,
    runStepId: UUIDSchema,
    workspaceId: UUIDSchema,
    vmHostId: UUIDSchema,
    artifactsPath: z.string().min(1),
    uploadEnabled: z.boolean(),
    collectedAt: ISODateTimeSchema,
    artifacts: z.array(CollectedArtifactSchema),
})
    .strict();
export const VmSessionEventPayloadSchema = z
    .object({
    // VM-local stream sequence. This is not the durable persisted replay seq.
    seq: z.number().int().nonnegative(),
    vmEventStreamId: z.string().min(1).nullable().optional(),
    sessionId: UUIDSchema,
    workspaceId: UUIDSchema,
    vmHostId: UUIDSchema,
    eventType: z.enum(NormalizedSessionEvents),
    codexThreadId: z.string().min(1).nullable().optional(),
    codexTurnId: z.string().min(1).nullable().optional(),
    itemId: z.string().min(1).nullable().optional(),
    payload: z.record(z.string(), JsonSchema),
    rawPayload: z.record(z.string(), JsonSchema).nullable().optional(),
})
    .strict();
export const SessionSnapshotPayloadSchema = z
    .object({
    session: AgentSessionRefSchema,
    lastSeq: z.number().int().nonnegative().nullable(),
    cursor: z.string().min(1),
    generatedAt: ISODateTimeSchema,
    events: z.array(AgentSessionEventSchema).optional(),
    pendingApprovals: z.array(ApprovalTaskSchema).optional(),
    artifacts: z.array(ArtifactSchema).optional(),
})
    .strict();
export const SessionHistoryQuerySchema = z
    .object({
    cursor: z.string().min(1).optional(),
    afterSeq: z.number().int().nonnegative().optional(),
    limit: z.number().int().positive().optional(),
    includeRawTrace: z.boolean().optional(),
})
    .strict();
export const SessionHistoryResponseSchema = z
    .object({
    events: z.array(AgentSessionEventSchema),
    lastSeq: z.number().int().nonnegative().nullable(),
    nextCursor: z.string().min(1),
})
    .strict();
export const SessionConversationHistoryQuerySchema = z
    .object({
    view: z.literal("conversation"),
    before: z.string().min(1).optional(),
    limit: z.number().int().min(1).max(100).optional(),
})
    .strict();
export const SessionConversationHistoryPageSchema = z
    .object({
    events: z.array(AgentSessionEventSchema),
    olderCursor: z.string().min(1).nullable(),
    hasOlder: z.boolean(),
})
    .superRefine((page, context) => {
    if (page.hasOlder !== (page.olderCursor !== null)) {
        context.addIssue({
            code: "custom",
            message: "olderCursor must be present exactly when hasOlder is true",
            path: ["olderCursor"],
        });
    }
})
    .strict();
export const VmCodexAuthLoginStartCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("codex.auth.login.start"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmCodexAuthLoginStartPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmCodexAuthLoginStartedResponseEnvelopeSchema = z
    .object({
    ok: z.literal(true),
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("codex.auth.login.started"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmCodexAuthLoginStartedPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmCodexAuthLoginCompleteCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("codex.auth.login.complete"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmCodexAuthLoginCompletePayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmCodexAuthLoginCompletedResponseEnvelopeSchema = z
    .object({
    ok: z.literal(true),
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("codex.auth.login.completed"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmCodexAuthLoginCompletedPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmCodexAuthLoginCancelCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("codex.auth.login.cancel"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmCodexAuthLoginCancelPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmCodexAuthLoginCancelledResponseEnvelopeSchema = z
    .object({
    ok: z.literal(true),
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("codex.auth.login.cancelled"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmCodexAuthLoginCancelledPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmSessionStartCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("session.start"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmSessionStartPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmSessionStartedResponseEnvelopeSchema = z
    .object({
    ok: z.literal(true),
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("session.started"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmSessionStartedPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmSessionResumeCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("session.resume"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmSessionResumePayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmSessionPauseCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("session.pause"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmSessionPausePayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmSessionThreadForkCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("session.thread.fork"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmSessionThreadForkPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmSessionTurnStartCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("session.turn.start"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmSessionTurnStartPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmSessionTurnSteerCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("session.turn.steer"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmSessionTurnSteerPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmSessionInjectItemsCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("session.inject_items"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmSessionInjectItemsPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmSessionInterruptCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("session.interrupt"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmSessionInterruptPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmSessionApprovalRespondCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("session.approval.respond"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmSessionApprovalRespondPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmSessionReviewStartCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("session.review.start"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmSessionReviewStartPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmSessionTerminateCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("session.terminate"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmSessionTerminatePayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmWorkspaceArchiveCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("workspace.archive"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmWorkspaceArchivePayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmWorkspaceFileReadCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("workspace.file.read"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: WorkspaceFileReadPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmWorkspaceFileReadyResponseEnvelopeSchema = z
    .object({
    ok: z.literal(true),
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("workspace.file.ready"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: WorkspaceFileReadResponsePayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmDatasetPromoteCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("dataset.promote"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmDatasetPromotePayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmDatasetPromotedResponseEnvelopeSchema = z
    .object({
    ok: z.literal(true),
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("dataset.promoted"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmDatasetPromotedPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmDatasetOutputNormalizeCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("dataset.output.normalize"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmDatasetOutputNormalizePayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmDatasetOutputNormalizedResponseEnvelopeSchema = z
    .object({
    ok: z.literal(true),
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("dataset.output.normalized"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmDatasetOutputNormalizedPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmDatasetValidateCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("dataset.validate"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmDatasetValidatePayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmDatasetValidatedResponseEnvelopeSchema = z
    .object({
    ok: z.literal(true),
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("dataset.validated"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmDatasetValidatedPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmDatasetFilePreviewCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("dataset.file.preview"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmDatasetFilePreviewPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmDatasetFilePreviewReadyResponseEnvelopeSchema = z
    .object({
    ok: z.literal(true),
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("dataset.file.preview.ready"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmDatasetFilePreviewReadyPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmSessionCommandAckResponseEnvelopeSchema = z
    .object({
    ok: z.literal(true),
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.enum(VmSessionControlCommands),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmSessionCommandAckPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmAuxTerminalOpenCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("session.aux_terminal.open"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmAuxTerminalOpenPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmAuxTerminalInputCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("session.aux_terminal.input"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmAuxTerminalInputPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmAuxTerminalResizeCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("session.aux_terminal.resize"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmAuxTerminalResizePayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmAuxTerminalCloseCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("session.aux_terminal.close"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: VmAuxTerminalClosePayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmArtifactCollectCommandEnvelopeSchema = z
    .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("artifact.collect"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: ArtifactCollectPayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
export const VmArtifactCollectedResponseEnvelopeSchema = z
    .object({
    ok: z.literal(true),
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("artifact.ready"),
    commandId: z.string().min(1),
    ts: ISODateTimeSchema,
    data: ArtifactCollectResponsePayloadSchema,
})
    .strict()
    .superRefine((envelope, context) => {
    if (envelope.commandId !== envelope.data.commandId) {
        context.addIssue({
            code: "custom",
            path: ["data", "commandId"],
            message: "data.commandId must match commandId",
        });
    }
});
function isSafeReviewEvidencePath(value) {
    if (!value.startsWith("/review-sources/experiments/") &&
        !value.startsWith("/datasets/")) {
        return false;
    }
    return !value
        .split("/")
        .some((segment, index) => index > 0 &&
        (segment.length === 0 || segment === "." || segment === ".."));
}
function isSafePathSegment(value) {
    return /^[A-Za-z0-9._-]+$/.test(value) && value !== "." && value !== "..";
}
function isSafeDatasetContainerPath(value) {
    if (!value.startsWith("/datasets/")) {
        return false;
    }
    return !value
        .split("/")
        .some((segment) => segment === "." || segment === "..");
}
