import { z } from "zod";
import {
  ByteCountSchema,
  ISODateTimeSchema,
  JsonSchema,
  ScopeRefSchema,
  UUIDSchema,
  type ByteCount,
  type ISODateTime,
  type Json,
  type ScopeRef,
  type UUID,
} from "./core.js";

export const ExperimentStatuses = ["draft", "active", "paused", "completed", "archived"] as const;
export type ExperimentStatus = (typeof ExperimentStatuses)[number];

export const GroupReviewReadyExperimentStatuses = ["completed", "archived"] as const;
export type GroupReviewReadyExperimentStatus = (typeof GroupReviewReadyExperimentStatuses)[number];

const GroupReviewReadyExperimentStatusSet: ReadonlySet<string> = new Set(GroupReviewReadyExperimentStatuses);

export function isGroupReviewReadyExperimentStatus(value: unknown): value is GroupReviewReadyExperimentStatus {
  return typeof value === "string" && GroupReviewReadyExperimentStatusSet.has(value);
}

export function experimentSystemRole(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;
  const role = (metadata as Record<string, unknown>).systemRole;
  return typeof role === "string" && role.trim().length > 0 ? role.trim() : null;
}

export function isSystemExperimentMetadata(metadata: unknown): boolean {
  return experimentSystemRole(metadata) !== null;
}

export function hasExperimentSystemRole(metadata: unknown, role: string): boolean {
  const expectedRole = role.trim();
  return expectedRole.length > 0 && experimentSystemRole(metadata) === expectedRole;
}

export interface Experiment {
  id: UUID;
  groupId: number;
  communityId: number;
  domainId: number;
  slug: string;
  name: string;
  description?: string | null;
  status: ExperimentStatus | string;
  metadata: Record<string, Json>;
  followup: ExperimentFollowupState;
  currentRunId?: UUID | null;
  artifactCount?: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface ExperimentFollowupState {
  isFollowup: boolean;
  approvalStatus?: string | null;
  waitingForReplan: boolean;
  needsGroupPlanUpdate: boolean;
  reviewCaseId?: string | null;
  sourceExperimentId?: string | null;
  sourceRunId?: string | null;
  sourceGraphEdgeId?: string | null;
  replanGuidance?: string | null;
  chiefReasoningSummary?: string | null;
  plannedGroupPlanVersion?: number | null;
  plannedGroupPlanPartId?: string | null;
  blockedLaunchReason?: string | null;
}

export const ExperimentRunStatuses = ["queued", "running", "paused", "completed", "failed", "cancelled"] as const;
export type ExperimentRunStatus = (typeof ExperimentRunStatuses)[number];

export const ExperimentRunTerminalStatuses = ["completed", "failed", "cancelled"] as const;
export type ExperimentRunTerminalStatus = (typeof ExperimentRunTerminalStatuses)[number];

const ExperimentRunTerminalStatusSet: ReadonlySet<string> = new Set(ExperimentRunTerminalStatuses);

export function isExperimentRunTerminalStatus(value: unknown): value is ExperimentRunTerminalStatus {
  return typeof value === "string" && ExperimentRunTerminalStatusSet.has(value);
}

export const ExperimentRunUnsuccessfulTerminalStatuses = ["failed", "cancelled"] as const;
export type ExperimentRunUnsuccessfulTerminalStatus = (typeof ExperimentRunUnsuccessfulTerminalStatuses)[number];

const ExperimentRunUnsuccessfulTerminalStatusSet: ReadonlySet<string> = new Set(
  ExperimentRunUnsuccessfulTerminalStatuses
);

export function isExperimentRunUnsuccessfulTerminalStatus(
  value: unknown
): value is ExperimentRunUnsuccessfulTerminalStatus {
  return typeof value === "string" && ExperimentRunUnsuccessfulTerminalStatusSet.has(value);
}

export interface ExperimentRun {
  id: UUID;
  experimentId: UUID;
  workflowTemplateRevisionId?: UUID | null;
  status: ExperimentRunStatus | string;
  triggerKind: string;
  triggeredByUserId?: number | null;
  contextSnapshot?: Record<string, Json> | null;
  schedulerSnapshot?: Record<string, Json> | null;
  startedAt?: ISODateTime | null;
  finishedAt?: ISODateTime | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const ExperimentRunStepStatuses = ["queued", "running", "completed", "failed", "cancelled", "skipped"] as const;
export type ExperimentRunStepStatus = (typeof ExperimentRunStepStatuses)[number];

export const ExperimentRunStepTerminalStatuses = ["completed", "failed", "cancelled", "skipped"] as const;
export type ExperimentRunStepTerminalStatus = (typeof ExperimentRunStepTerminalStatuses)[number];

const ExperimentRunStepTerminalStatusSet: ReadonlySet<string> = new Set(ExperimentRunStepTerminalStatuses);

export function isExperimentRunStepTerminalStatus(value: unknown): value is ExperimentRunStepTerminalStatus {
  return typeof value === "string" && ExperimentRunStepTerminalStatusSet.has(value);
}

export interface ExperimentRunStep {
  id: UUID;
  runId: UUID;
  nodeId: UUID;
  attempt: number;
  status: ExperimentRunStepStatus | string;
  runtimeProfileId?: UUID | null;
  authProfileId?: UUID | null;
  assignedVmHostId?: UUID | null;
  agentSessionId?: UUID | null;
  inputPayload?: Record<string, Json> | null;
  outputPayload?: Record<string, Json> | null;
  errorPayload?: Record<string, Json> | null;
  claimedByWorkerId?: string | null;
  claimedAt?: ISODateTime | null;
  leaseExpiresAt?: ISODateTime | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
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
] as const;
export type ExperimentRunTimingSpanCategory = (typeof ExperimentRunTimingSpanCategories)[number];

export const ExperimentRunTimingSpanStatuses = ["open", "closed", "cancelled"] as const;
export type ExperimentRunTimingSpanStatus = (typeof ExperimentRunTimingSpanStatuses)[number];

export interface ExperimentRunTimingSpan {
  id: UUID;
  experimentId: UUID;
  runId: UUID;
  runStepId?: UUID | null;
  sessionId?: UUID | null;
  modelCallId?: UUID | null;
  reviewCaseId?: UUID | null;
  category: ExperimentRunTimingSpanCategory | string;
  label: string;
  spanKey?: string | null;
  startedAt: ISODateTime;
  endedAt?: ISODateTime | null;
  status: ExperimentRunTimingSpanStatus | string;
  metadata: Record<string, Json>;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface ExperimentRunTimingCategorySummary {
  category: ExperimentRunTimingSpanCategory | string;
  label: string;
  elapsedMs: number;
  spanCount: number;
  openSpanCount: number;
}

export interface ExperimentRunTimingSummary {
  runId: UUID;
  experimentId: UUID;
  status: string;
  startedAt?: ISODateTime | null;
  endedAt?: ISODateTime | null;
  generatedAt: ISODateTime;
  wallTimeMs: number;
  running: boolean;
  categories: ExperimentRunTimingCategorySummary[];
  spans: ExperimentRunTimingSpan[];
}

export const WorkflowWorkerHeartbeatStatuses = ["active", "stopping", "stopped"] as const;
export type WorkflowWorkerHeartbeatStatus = (typeof WorkflowWorkerHeartbeatStatuses)[number];
export const WorkflowWorkerFreshnessStates = ["fresh", "stale", "stopped"] as const;
export type WorkflowWorkerFreshness = (typeof WorkflowWorkerFreshnessStates)[number];

export interface WorkflowWorkerHeartbeat {
  id: UUID;
  workerId: string;
  queueName: string;
  status: WorkflowWorkerHeartbeatStatus | string;
  startedAt: ISODateTime;
  lastHeartbeatAt: ISODateTime;
  stoppedAt?: ISODateTime | null;
  metadata: Record<string, Json>;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface ExperimentGraphEdge {
  id: UUID;
  source: ScopeRef;
  edgeType: string;
  target: ScopeRef;
  metadata: Record<string, Json>;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface ExperimentGraph {
  experiment: Experiment;
  edges: ExperimentGraphEdge[];
}

export const ReportBundleKind = "generated_papers_and_summaries";
export const ReportBundleStatuses = ["running", "completed", "failed", "partial"] as const;
export type ReportBundleStatus = (typeof ReportBundleStatuses)[number];
export const ReportBundleStepStatuses = ["pending", "running", "completed", "failed", "missing"] as const;
export type ReportBundleStepStatus = (typeof ReportBundleStepStatuses)[number];

export interface ReportBundleStep {
  targetKind: string;
  outputFile: string;
  relativePath: string;
  status: ReportBundleStepStatus | string;
  artifactId?: UUID | null;
  artifact?: Artifact | null;
  turnId?: string | null;
  commandId?: string | null;
  promptBindingId?: string | null;
  startedAt?: ISODateTime | null;
  completedAt?: ISODateTime | null;
  failedAt?: ISODateTime | null;
  failure?: Record<string, Json> | null;
}

export interface ReportBundle {
  bundleId: string;
  kind: string;
  status: ReportBundleStatus | string;
  runId: UUID;
  experimentId: UUID;
  groupId: number;
  sessionId?: UUID | null;
  artifactDirectory: string;
  startedAt: ISODateTime;
  updatedAt: ISODateTime;
  completedAt?: ISODateTime | null;
  failedAt?: ISODateTime | null;
  failure?: Record<string, Json> | null;
  chiefActionAttemptId?: string | null;
  chiefReviewModelCallId?: UUID | null;
  decisionChecksumSha256?: string | null;
  steps: ReportBundleStep[];
  supportingArtifacts: Artifact[];
  warnings: string[];
}

export const CompleteReportBundleTargets = [
  "paper_draft",
  "paper_distill",
  "paper_lay_summary",
] as const;

export function isCompleteReportBundle(bundle: ReportBundle): boolean {
  if (bundle.status !== "completed") {
    return false;
  }

  return CompleteReportBundleTargets.every((targetKind) => {
    const step = bundle.steps.find((candidate) => candidate.targetKind === targetKind);
    return step?.status === "completed" && Boolean(step.artifactId ?? step.artifact?.id);
  });
}

export function latestCompleteReportBundleForExperiment(
  reportBundles: ReportBundle[],
  experimentId: string | undefined
): ReportBundle | undefined {
  if (!experimentId) {
    return undefined;
  }

  return reportBundles
    .filter((bundle) => String(bundle.experimentId) === experimentId && isCompleteReportBundle(bundle))
    .sort(compareCompleteReportBundlesNewestFirst)[0];
}

export function latestCompleteReportBundle(
  reportBundles: ReportBundle[]
): ReportBundle | undefined {
  return reportBundles.filter(isCompleteReportBundle).sort(compareCompleteReportBundlesNewestFirst)[0];
}

function compareCompleteReportBundlesNewestFirst(left: ReportBundle, right: ReportBundle): number {
  const completed = String(right.completedAt ?? right.updatedAt).localeCompare(
    String(left.completedAt ?? left.updatedAt)
  );
  return completed !== 0 ? completed : right.bundleId.localeCompare(left.bundleId);
}

export const VmHostStatuses = ["registered", "available", "busy", "offline", "draining", "disabled"] as const;
export type VmHostStatus = (typeof VmHostStatuses)[number];

export interface VmHost {
  id: UUID;
  name: string;
  status: VmHostStatus | string;
  capabilities: Record<string, Json>;
  lastSeenAt?: ISODateTime | null;
  metadata: Record<string, Json>;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface VmHostVolume {
  id: UUID;
  vmHostId: UUID;
  mountPath: string;
  role: string;
  totalBytes?: ByteCount | null;
  availableBytes?: ByteCount | null;
  metadata: Record<string, Json>;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const WorkspaceStatuses = ["preparing", "ready", "active", "archived", "failed"] as const;
export type WorkspaceStatus = (typeof WorkspaceStatuses)[number];

export interface Workspace {
  id: UUID;
  experimentId: UUID;
  vmHostId?: UUID | null;
  rootPath: string;
  repoUrl?: string | null;
  repoRef?: string | null;
  status: WorkspaceStatus | string;
  metadata: Record<string, Json>;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface AgentSessionEvent {
  id: UUID;
  sessionId: UUID;
  seq: number;
  eventType: string;
  eventTs: ISODateTime;
  turnId?: string | null;
  itemId?: string | null;
  vmHostId?: UUID | null;
  vmEventStreamId?: string | null;
  vmSeq?: number | null;
  vmTransport?: string | null;
  vmBrokerConnectionId?: string | null;
  vmSequenceStatus?: "ok" | "gap" | "regression" | "duplicate" | null;
  payload: Record<string, Json>;
  rawPayload?: Record<string, Json> | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface Artifact {
  id: UUID;
  scope: ScopeRef;
  kind: string;
  path: string;
  contentType?: string | null;
  sizeBytes?: ByteCount | null;
  checksumSha256?: string | null;
  metadata: Record<string, Json>;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const DatasetStatuses = ["active", "archived", "disabled"] as const;
export type DatasetStatus = (typeof DatasetStatuses)[number];

export const DatasetVersionStatuses = ["available", "deprecated", "failed"] as const;
export type DatasetVersionStatus = (typeof DatasetVersionStatuses)[number];

export const DatasetVersionKinds = ["raw", "processed", "reference", "mirror", "derived", "manifest_only"] as const;
export type DatasetVersionKind = (typeof DatasetVersionKinds)[number];

export const DatasetVerificationStatuses = [
  "unverified",
  "size_verified",
  "checksum_verified",
  "manifest_verified",
  "failed",
] as const;
export type DatasetVerificationStatus = (typeof DatasetVerificationStatuses)[number];

export const DatasetCompletenessStatuses = [
  "complete",
  "partial",
  "missing_optional",
  "missing_required",
  "manifest_only",
] as const;
export type DatasetCompletenessStatus = (typeof DatasetCompletenessStatuses)[number];

export const DatasetAccessLevels = ["public", "restricted", "controlled", "private", "unknown"] as const;
export type DatasetAccessLevel = (typeof DatasetAccessLevels)[number];

export const DatasetLocationKinds = ["gcs", "local"] as const;
export type DatasetLocationKind = (typeof DatasetLocationKinds)[number];

export const DatasetStorageTiers = ["cold", "hot"] as const;
export type DatasetStorageTier = (typeof DatasetStorageTiers)[number];

export const DatasetLocationStatuses = ["available", "unavailable", "failed"] as const;
export type DatasetLocationStatus = (typeof DatasetLocationStatuses)[number];

export const DatasetLeaseStatuses = ["active", "released", "expired"] as const;
export type DatasetLeaseStatus = (typeof DatasetLeaseStatuses)[number];

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
] as const;
export type DatasetSourceKind = (typeof DatasetSourceKinds)[number];

export const DatasetComponentRoles = [
  "raw",
  "processed",
  "reference",
  "metadata",
  "manifest",
  "logs",
  "models",
] as const;
export type DatasetComponentRole = (typeof DatasetComponentRoles)[number];

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
] as const;
export type DatasetAssetRole = (typeof DatasetAssetRoles)[number];

export const DatasetAssetStatuses = [
  "present",
  "missing",
  "verified",
  "size_mismatch",
  "checksum_failed",
  "inaccessible",
  "excluded",
] as const;
export type DatasetAssetStatus = (typeof DatasetAssetStatuses)[number];

export interface Dataset {
  id: UUID;
  scope: ScopeRef;
  name: string;
  description?: string | null;
  status: DatasetStatus;
  metadata: Record<string, Json>;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface DatasetVersion {
  id: UUID;
  datasetId: UUID;
  versionLabel: string;
  manifestChecksumSha256?: string | null;
  sizeBytes?: ByteCount | null;
  logicalSizeBytes?: ByteCount | null;
  physicalSizeBytes?: ByteCount | null;
  fileCount?: number | null;
  componentCount?: number | null;
  versionKind: DatasetVersionKind;
  verificationStatus: DatasetVerificationStatus;
  completenessStatus: DatasetCompletenessStatus;
  accessLevel: DatasetAccessLevel;
  license?: string | null;
  status: DatasetVersionStatus;
  metadata: Record<string, Json>;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface DatasetLocation {
  id: UUID;
  datasetVersionId: UUID;
  kind: DatasetLocationKind;
  tier: DatasetStorageTier;
  uri: string;
  resolvedUri?: string | null;
  storageClass?: string | null;
  physicalSizeBytes?: ByteCount | null;
  storageIdentity?: string | null;
  aliasOfLocationId?: UUID | null;
  status: DatasetLocationStatus;
  metadata: Record<string, Json>;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface DatasetLease {
  id: UUID;
  datasetVersionId: UUID;
  workspaceId?: UUID | null;
  sessionId?: UUID | null;
  vmHostId?: UUID | null;
  hotPath?: string | null;
  status: DatasetLeaseStatus;
  expiresAt?: ISODateTime | null;
  lastSeenAt?: ISODateTime | null;
  metadata: Record<string, Json>;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface DatasetSource {
  id: UUID;
  datasetVersionId: UUID;
  kind: DatasetSourceKind;
  accession?: string | null;
  uri?: string | null;
  title?: string | null;
  license?: string | null;
  accessLevel: DatasetAccessLevel;
  acquiredAt?: ISODateTime | null;
  metadata: Record<string, Json>;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface DatasetComponent {
  id: UUID;
  datasetVersionId: UUID;
  parentComponentId?: UUID | null;
  name: string;
  role: DatasetComponentRole;
  pathPrefix?: string | null;
  fileCount?: number | null;
  sizeBytes?: ByteCount | null;
  metadata: Record<string, Json>;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface DatasetAsset {
  id: UUID;
  datasetVersionId: UUID;
  componentId?: UUID | null;
  role: DatasetAssetRole;
  relativePath: string;
  sizeBytes?: ByteCount | null;
  checksumSha256?: string | null;
  checksumMd5?: string | null;
  format?: string | null;
  compression?: string | null;
  recordCount?: number | string | null;
  status: DatasetAssetStatus;
  sourceUri?: string | null;
  downloadedAt?: ISODateTime | null;
  verifiedAt?: ISODateTime | null;
  metadata: Record<string, Json>;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

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
  .strict() satisfies z.ZodType<ExperimentFollowupState>;

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
  .strict() satisfies z.ZodType<Experiment>;

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
  .strict() satisfies z.ZodType<ExperimentRun>;

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
  .strict() satisfies z.ZodType<ExperimentRunStep>;

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
  .strict() satisfies z.ZodType<ExperimentRunTimingSpan>;

export const ExperimentRunTimingCategorySummarySchema = z
  .object({
    category: z.string().min(1),
    label: z.string().min(1),
    elapsedMs: z.number().int().nonnegative(),
    spanCount: z.number().int().nonnegative(),
    openSpanCount: z.number().int().nonnegative(),
  })
  .strict() satisfies z.ZodType<ExperimentRunTimingCategorySummary>;

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
  .strict() satisfies z.ZodType<ExperimentRunTimingSummary>;

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
  .strict() satisfies z.ZodType<WorkflowWorkerHeartbeat>;

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
  .strict() satisfies z.ZodType<ExperimentGraphEdge>;

export const ExperimentGraphSchema = z
  .object({
    experiment: ExperimentSchema,
    edges: z.array(ExperimentGraphEdgeSchema),
  })
  .strict() satisfies z.ZodType<ExperimentGraph>;

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
  .strict() satisfies z.ZodType<VmHost>;

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
  .strict() satisfies z.ZodType<VmHostVolume>;

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
  .strict() satisfies z.ZodType<Workspace>;

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
  .strict() satisfies z.ZodType<AgentSessionEvent>;

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
  .strict() satisfies z.ZodType<Artifact>;

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
  .strict() satisfies z.ZodType<ReportBundleStep>;

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
  .strict() satisfies z.ZodType<ReportBundle>;

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
  .strict() satisfies z.ZodType<Dataset>;

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
  .strict() satisfies z.ZodType<DatasetVersion>;

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
  .strict() satisfies z.ZodType<DatasetLocation>;

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
  .strict() satisfies z.ZodType<DatasetLease>;

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
  .strict() satisfies z.ZodType<DatasetSource>;

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
  .strict() satisfies z.ZodType<DatasetComponent>;

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
  .strict() satisfies z.ZodType<DatasetAsset>;
