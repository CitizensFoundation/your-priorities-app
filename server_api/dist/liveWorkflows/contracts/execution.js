import { z } from "zod";
import { ByteCountSchema, ISODateTimeSchema, JsonSchema, ScopeRefSchema, UUIDSchema, } from "./core.js";
export const ExperimentStatuses = ["draft", "active", "paused", "completed", "archived"];
export const GroupReviewReadyExperimentStatuses = ["completed", "archived"];
const GroupReviewReadyExperimentStatusSet = new Set(GroupReviewReadyExperimentStatuses);
export function isGroupReviewReadyExperimentStatus(value) {
    return typeof value === "string" && GroupReviewReadyExperimentStatusSet.has(value);
}
export function experimentSystemRole(metadata) {
    if (!metadata || typeof metadata !== "object" || Array.isArray(metadata))
        return null;
    const role = metadata.systemRole;
    return typeof role === "string" && role.trim().length > 0 ? role.trim() : null;
}
export function isSystemExperimentMetadata(metadata) {
    return experimentSystemRole(metadata) !== null;
}
export function hasExperimentSystemRole(metadata, role) {
    const expectedRole = role.trim();
    return expectedRole.length > 0 && experimentSystemRole(metadata) === expectedRole;
}
export const ExperimentRunStatuses = ["queued", "running", "paused", "completed", "failed", "cancelled"];
export const ExperimentRunTerminalStatuses = ["completed", "failed", "cancelled"];
const ExperimentRunTerminalStatusSet = new Set(ExperimentRunTerminalStatuses);
export function isExperimentRunTerminalStatus(value) {
    return typeof value === "string" && ExperimentRunTerminalStatusSet.has(value);
}
export const ExperimentRunUnsuccessfulTerminalStatuses = ["failed", "cancelled"];
const ExperimentRunUnsuccessfulTerminalStatusSet = new Set(ExperimentRunUnsuccessfulTerminalStatuses);
export function isExperimentRunUnsuccessfulTerminalStatus(value) {
    return typeof value === "string" && ExperimentRunUnsuccessfulTerminalStatusSet.has(value);
}
export const ExperimentRunStepStatuses = ["queued", "running", "completed", "failed", "cancelled", "skipped"];
export const ExperimentRunStepTerminalStatuses = ["completed", "failed", "cancelled", "skipped"];
const ExperimentRunStepTerminalStatusSet = new Set(ExperimentRunStepTerminalStatuses);
export function isExperimentRunStepTerminalStatus(value) {
    return typeof value === "string" && ExperimentRunStepTerminalStatusSet.has(value);
}
export const ExperimentRunTimingSpanCategories = [
    "run",
    "workflow_queue",
    "workflow_step",
    "codex",
    "chief",
    "model_call",
    "human_review",
    "other",
];
export const ExperimentRunTimingSpanStatuses = ["open", "closed", "cancelled"];
export const WorkflowWorkerHeartbeatStatuses = ["active", "stopping", "stopped"];
export const WorkflowWorkerFreshnessStates = ["fresh", "stale", "stopped"];
export const ReportBundleKind = "generated_papers_and_summaries";
export const ReportBundleStatuses = ["running", "completed", "failed", "partial"];
export const ReportBundleStepStatuses = ["pending", "running", "completed", "failed", "missing"];
export const CompleteReportBundleTargets = [
    "paper_draft",
    "paper_distill",
    "paper_lay_summary",
];
export function isCompleteReportBundle(bundle) {
    if (bundle.status !== "completed") {
        return false;
    }
    return CompleteReportBundleTargets.every((targetKind) => {
        const step = bundle.steps.find((candidate) => candidate.targetKind === targetKind);
        return step?.status === "completed" && Boolean(step.artifactId ?? step.artifact?.id);
    });
}
export function latestCompleteReportBundleForExperiment(reportBundles, experimentId) {
    if (!experimentId) {
        return undefined;
    }
    return reportBundles
        .filter((bundle) => String(bundle.experimentId) === experimentId && isCompleteReportBundle(bundle))
        .sort(compareCompleteReportBundlesNewestFirst)[0];
}
export function latestCompleteReportBundle(reportBundles) {
    return reportBundles.filter(isCompleteReportBundle).sort(compareCompleteReportBundlesNewestFirst)[0];
}
function compareCompleteReportBundlesNewestFirst(left, right) {
    const completed = String(right.completedAt ?? right.updatedAt).localeCompare(String(left.completedAt ?? left.updatedAt));
    return completed !== 0 ? completed : right.bundleId.localeCompare(left.bundleId);
}
export const VmHostStatuses = ["registered", "available", "busy", "offline", "draining", "disabled"];
export const WorkspaceStatuses = ["preparing", "ready", "active", "archived", "failed"];
export const DatasetStatuses = ["active", "archived", "disabled"];
export const DatasetVersionStatuses = ["available", "deprecated", "failed"];
export const DatasetVersionKinds = ["raw", "processed", "reference", "mirror", "derived", "manifest_only"];
export const DatasetVerificationStatuses = [
    "unverified",
    "size_verified",
    "checksum_verified",
    "manifest_verified",
    "failed",
];
export const DatasetCompletenessStatuses = [
    "complete",
    "partial",
    "missing_optional",
    "missing_required",
    "manifest_only",
];
export const DatasetAccessLevels = ["public", "restricted", "controlled", "private", "unknown"];
export const DatasetLocationKinds = ["gcs", "local"];
export const DatasetStorageTiers = ["cold", "hot"];
export const DatasetLocationStatuses = ["available", "unavailable", "failed"];
export const DatasetLeaseStatuses = ["active", "released", "expired"];
export const DatasetSourceKinds = [
    "geo",
    "sra",
    "ena",
    "pride",
    "zenodo",
    "physionet",
    "kaggle",
    "figshare",
    "doi",
    "url",
    "manual",
];
export const DatasetComponentRoles = [
    "raw",
    "processed",
    "reference",
    "metadata",
    "manifest",
    "logs",
    "models",
];
export const DatasetAssetRoles = [
    "raw",
    "processed",
    "metadata",
    "reference",
    "manifest",
    "checksum",
    "log",
    "model",
    "index",
    "archive",
];
export const DatasetAssetStatuses = [
    "present",
    "missing",
    "verified",
    "size_mismatch",
    "checksum_failed",
    "inaccessible",
    "excluded",
];
const jsonObjectSchema = z.record(z.string(), JsonSchema);
const nullableDateSchema = ISODateTimeSchema.nullable().optional();
export const ExperimentStatusSchema = z.enum(ExperimentStatuses);
export const ExperimentRunStatusSchema = z.enum(ExperimentRunStatuses);
export const ExperimentRunStepStatusSchema = z.enum(ExperimentRunStepStatuses);
export const ExperimentRunTimingSpanCategorySchema = z.enum(ExperimentRunTimingSpanCategories);
export const ExperimentRunTimingSpanStatusSchema = z.enum(ExperimentRunTimingSpanStatuses);
export const WorkflowWorkerHeartbeatStatusSchema = z.enum(WorkflowWorkerHeartbeatStatuses);
export const ReportBundleStatusSchema = z.enum(ReportBundleStatuses);
export const ReportBundleStepStatusSchema = z.enum(ReportBundleStepStatuses);
export const VmHostStatusSchema = z.enum(VmHostStatuses);
export const WorkspaceStatusSchema = z.enum(WorkspaceStatuses);
export const DatasetStatusSchema = z.enum(DatasetStatuses);
export const DatasetVersionStatusSchema = z.enum(DatasetVersionStatuses);
export const DatasetVersionKindSchema = z.enum(DatasetVersionKinds);
export const DatasetVerificationStatusSchema = z.enum(DatasetVerificationStatuses);
export const DatasetCompletenessStatusSchema = z.enum(DatasetCompletenessStatuses);
export const DatasetAccessLevelSchema = z.enum(DatasetAccessLevels);
export const DatasetLocationKindSchema = z.enum(DatasetLocationKinds);
export const DatasetStorageTierSchema = z.enum(DatasetStorageTiers);
export const DatasetLocationStatusSchema = z.enum(DatasetLocationStatuses);
export const DatasetLeaseStatusSchema = z.enum(DatasetLeaseStatuses);
export const DatasetSourceKindSchema = z.enum(DatasetSourceKinds);
export const DatasetComponentRoleSchema = z.enum(DatasetComponentRoles);
export const DatasetAssetRoleSchema = z.enum(DatasetAssetRoles);
export const DatasetAssetStatusSchema = z.enum(DatasetAssetStatuses);
export const ExperimentFollowupStateSchema = z
    .object({
    isFollowup: z.boolean(),
    approvalStatus: z.string().nullable().optional(),
    waitingForReplan: z.boolean(),
    needsGroupPlanUpdate: z.boolean(),
    reviewCaseId: z.string().nullable().optional(),
    sourceExperimentId: z.string().nullable().optional(),
    sourceRunId: z.string().nullable().optional(),
    sourceGraphEdgeId: z.string().nullable().optional(),
    replanGuidance: z.string().nullable().optional(),
    chiefReasoningSummary: z.string().nullable().optional(),
    plannedGroupPlanVersion: z.number().int().positive().nullable().optional(),
    plannedGroupPlanPartId: z.string().nullable().optional(),
    blockedLaunchReason: z.string().nullable().optional(),
})
    .strict();
export const ExperimentSchema = z
    .object({
    id: UUIDSchema,
    groupId: z.number().int().positive(),
    communityId: z.number().int().positive(),
    domainId: z.number().int().positive(),
    slug: z.string().min(1),
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    status: z.string().min(1),
    metadata: jsonObjectSchema,
    followup: ExperimentFollowupStateSchema,
    currentRunId: UUIDSchema.nullable().optional(),
    artifactCount: z.number().int().nonnegative().optional(),
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const ExperimentRunSchema = z
    .object({
    id: UUIDSchema,
    experimentId: UUIDSchema,
    workflowTemplateRevisionId: UUIDSchema.nullable().optional(),
    status: z.string().min(1),
    triggerKind: z.string().min(1),
    triggeredByUserId: z.number().int().positive().nullable().optional(),
    contextSnapshot: jsonObjectSchema.nullable().optional(),
    schedulerSnapshot: jsonObjectSchema.nullable().optional(),
    startedAt: nullableDateSchema,
    finishedAt: nullableDateSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const ExperimentRunStepSchema = z
    .object({
    id: UUIDSchema,
    runId: UUIDSchema,
    nodeId: UUIDSchema,
    attempt: z.number().int().positive(),
    status: z.string().min(1),
    runtimeProfileId: UUIDSchema.nullable().optional(),
    authProfileId: UUIDSchema.nullable().optional(),
    assignedVmHostId: UUIDSchema.nullable().optional(),
    agentSessionId: UUIDSchema.nullable().optional(),
    inputPayload: jsonObjectSchema.nullable().optional(),
    outputPayload: jsonObjectSchema.nullable().optional(),
    errorPayload: jsonObjectSchema.nullable().optional(),
    claimedByWorkerId: z.string().nullable().optional(),
    claimedAt: nullableDateSchema,
    leaseExpiresAt: nullableDateSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const ExperimentRunTimingSpanSchema = z
    .object({
    id: UUIDSchema,
    experimentId: UUIDSchema,
    runId: UUIDSchema,
    runStepId: UUIDSchema.nullable().optional(),
    sessionId: UUIDSchema.nullable().optional(),
    modelCallId: UUIDSchema.nullable().optional(),
    reviewCaseId: UUIDSchema.nullable().optional(),
    category: z.string().min(1),
    label: z.string().min(1),
    spanKey: z.string().nullable().optional(),
    startedAt: ISODateTimeSchema,
    endedAt: nullableDateSchema,
    status: z.string().min(1),
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const ExperimentRunTimingCategorySummarySchema = z
    .object({
    category: z.string().min(1),
    label: z.string().min(1),
    elapsedMs: z.number().int().nonnegative(),
    spanCount: z.number().int().nonnegative(),
    openSpanCount: z.number().int().nonnegative(),
})
    .strict();
export const ExperimentRunTimingSummarySchema = z
    .object({
    runId: UUIDSchema,
    experimentId: UUIDSchema,
    status: z.string().min(1),
    startedAt: nullableDateSchema,
    endedAt: nullableDateSchema,
    generatedAt: ISODateTimeSchema,
    wallTimeMs: z.number().int().nonnegative(),
    running: z.boolean(),
    categories: z.array(ExperimentRunTimingCategorySummarySchema),
    spans: z.array(ExperimentRunTimingSpanSchema),
})
    .strict();
export const WorkflowWorkerHeartbeatSchema = z
    .object({
    id: UUIDSchema,
    workerId: z.string().min(1),
    queueName: z.string().min(1),
    status: z.string().min(1),
    startedAt: ISODateTimeSchema,
    lastHeartbeatAt: ISODateTimeSchema,
    stoppedAt: nullableDateSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const ExperimentGraphEdgeSchema = z
    .object({
    id: UUIDSchema,
    source: ScopeRefSchema,
    edgeType: z.string().min(1),
    target: ScopeRefSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const ExperimentGraphSchema = z
    .object({
    experiment: ExperimentSchema,
    edges: z.array(ExperimentGraphEdgeSchema),
})
    .strict();
export const VmHostSchema = z
    .object({
    id: UUIDSchema,
    name: z.string().min(1),
    status: z.string().min(1),
    capabilities: jsonObjectSchema,
    lastSeenAt: nullableDateSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const VmHostVolumeSchema = z
    .object({
    id: UUIDSchema,
    vmHostId: UUIDSchema,
    mountPath: z.string().min(1),
    role: z.string().min(1),
    totalBytes: ByteCountSchema.nullable().optional(),
    availableBytes: ByteCountSchema.nullable().optional(),
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const WorkspaceSchema = z
    .object({
    id: UUIDSchema,
    experimentId: UUIDSchema,
    vmHostId: UUIDSchema.nullable().optional(),
    rootPath: z.string().min(1),
    repoUrl: z.string().nullable().optional(),
    repoRef: z.string().nullable().optional(),
    status: z.string().min(1),
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const AgentSessionEventSchema = z
    .object({
    id: UUIDSchema,
    sessionId: UUIDSchema,
    seq: z.number().int().nonnegative(),
    eventType: z.string().min(1),
    eventTs: ISODateTimeSchema,
    turnId: z.string().nullable().optional(),
    itemId: z.string().nullable().optional(),
    vmHostId: UUIDSchema.nullable().optional(),
    vmEventStreamId: z.string().nullable().optional(),
    vmSeq: z.number().int().nonnegative().nullable().optional(),
    vmTransport: z.string().nullable().optional(),
    vmBrokerConnectionId: z.string().nullable().optional(),
    vmSequenceStatus: z.enum(["ok", "gap", "regression", "duplicate"]).nullable().optional(),
    payload: jsonObjectSchema,
    rawPayload: jsonObjectSchema.nullable().optional(),
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const ArtifactSchema = z
    .object({
    id: UUIDSchema,
    scope: ScopeRefSchema,
    kind: z.string().min(1),
    path: z.string().min(1),
    contentType: z.string().nullable().optional(),
    sizeBytes: ByteCountSchema.nullable().optional(),
    checksumSha256: z.string().nullable().optional(),
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const ReportBundleStepSchema = z
    .object({
    targetKind: z.string().min(1),
    outputFile: z.string().min(1),
    relativePath: z.string().min(1),
    status: z.string().min(1),
    artifactId: UUIDSchema.nullable().optional(),
    artifact: ArtifactSchema.nullable().optional(),
    turnId: z.string().nullable().optional(),
    commandId: z.string().nullable().optional(),
    promptBindingId: z.string().nullable().optional(),
    startedAt: nullableDateSchema,
    completedAt: nullableDateSchema,
    failedAt: nullableDateSchema,
    failure: jsonObjectSchema.nullable().optional(),
})
    .strict();
export const ReportBundleSchema = z
    .object({
    bundleId: z.string().min(1),
    kind: z.string().min(1),
    status: z.string().min(1),
    runId: UUIDSchema,
    experimentId: UUIDSchema,
    groupId: z.number().int().positive(),
    sessionId: UUIDSchema.nullable().optional(),
    artifactDirectory: z.string().min(1),
    startedAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
    completedAt: nullableDateSchema,
    failedAt: nullableDateSchema,
    failure: jsonObjectSchema.nullable().optional(),
    chiefActionAttemptId: z.string().nullable().optional(),
    chiefReviewModelCallId: UUIDSchema.nullable().optional(),
    decisionChecksumSha256: z.string().nullable().optional(),
    steps: z.array(ReportBundleStepSchema),
    supportingArtifacts: z.array(ArtifactSchema),
    warnings: z.array(z.string()),
})
    .strict();
export const DatasetSchema = z
    .object({
    id: UUIDSchema,
    scope: ScopeRefSchema,
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    status: DatasetStatusSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const DatasetVersionSchema = z
    .object({
    id: UUIDSchema,
    datasetId: UUIDSchema,
    versionLabel: z.string().min(1),
    manifestChecksumSha256: z.string().nullable().optional(),
    sizeBytes: ByteCountSchema.nullable().optional(),
    logicalSizeBytes: ByteCountSchema.nullable().optional(),
    physicalSizeBytes: ByteCountSchema.nullable().optional(),
    fileCount: z.number().int().nonnegative().nullable().optional(),
    componentCount: z.number().int().nonnegative().nullable().optional(),
    versionKind: DatasetVersionKindSchema,
    verificationStatus: DatasetVerificationStatusSchema,
    completenessStatus: DatasetCompletenessStatusSchema,
    accessLevel: DatasetAccessLevelSchema,
    license: z.string().nullable().optional(),
    status: DatasetVersionStatusSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const DatasetLocationSchema = z
    .object({
    id: UUIDSchema,
    datasetVersionId: UUIDSchema,
    kind: DatasetLocationKindSchema,
    tier: DatasetStorageTierSchema,
    uri: z.string().min(1),
    resolvedUri: z.string().nullable().optional(),
    storageClass: z.string().nullable().optional(),
    physicalSizeBytes: ByteCountSchema.nullable().optional(),
    storageIdentity: z.string().nullable().optional(),
    aliasOfLocationId: UUIDSchema.nullable().optional(),
    status: DatasetLocationStatusSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const DatasetLeaseSchema = z
    .object({
    id: UUIDSchema,
    datasetVersionId: UUIDSchema,
    workspaceId: UUIDSchema.nullable().optional(),
    sessionId: UUIDSchema.nullable().optional(),
    vmHostId: UUIDSchema.nullable().optional(),
    hotPath: z.string().nullable().optional(),
    status: DatasetLeaseStatusSchema,
    expiresAt: nullableDateSchema,
    lastSeenAt: nullableDateSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const DatasetSourceSchema = z
    .object({
    id: UUIDSchema,
    datasetVersionId: UUIDSchema,
    kind: DatasetSourceKindSchema,
    accession: z.string().nullable().optional(),
    uri: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    license: z.string().nullable().optional(),
    accessLevel: DatasetAccessLevelSchema,
    acquiredAt: nullableDateSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const DatasetComponentSchema = z
    .object({
    id: UUIDSchema,
    datasetVersionId: UUIDSchema,
    parentComponentId: UUIDSchema.nullable().optional(),
    name: z.string().min(1),
    role: DatasetComponentRoleSchema,
    pathPrefix: z.string().nullable().optional(),
    fileCount: z.number().int().nonnegative().nullable().optional(),
    sizeBytes: ByteCountSchema.nullable().optional(),
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const DatasetAssetSchema = z
    .object({
    id: UUIDSchema,
    datasetVersionId: UUIDSchema,
    componentId: UUIDSchema.nullable().optional(),
    role: DatasetAssetRoleSchema,
    relativePath: z.string().min(1),
    sizeBytes: ByteCountSchema.nullable().optional(),
    checksumSha256: z.string().nullable().optional(),
    checksumMd5: z.string().nullable().optional(),
    format: z.string().nullable().optional(),
    compression: z.string().nullable().optional(),
    recordCount: z.union([z.number(), z.string()]).nullable().optional(),
    status: DatasetAssetStatusSchema,
    sourceUri: z.string().nullable().optional(),
    downloadedAt: nullableDateSchema,
    verifiedAt: nullableDateSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
