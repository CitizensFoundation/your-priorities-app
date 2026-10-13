import { z } from "zod";
import {
  ByteCountSchema,
  ISODateTimeSchema,
  JsonSchema,
  ScopeTypes,
  UUIDSchema,
  type ByteCount,
  type ISODateTime,
  type Json,
  type ScopeRef,
  type ScopeType,
  type UUID,
} from "./core.js";
import {
  AgentSessionEventSchema,
  ArtifactSchema,
  type AgentSessionEvent,
  type Artifact,
} from "./execution.js";
import { ApprovalTaskSchema, type ApprovalTask } from "./review.js";
import { AgentSessionRefSchema, type AgentSessionRef } from "./session.js";
import { isSafeRelativePath } from "./pathSafety.js";

export const YP_LIVE_WORKFLOW_CLIENT_PROTOCOL =
  "yp-live-workflow.client.v1" as const;
export const YP_LIVE_WORKFLOW_VM_PROTOCOL = "yp-live-workflow.vm.v1" as const;

export type LiveWorkflowProtocol =
  | typeof YP_LIVE_WORKFLOW_CLIENT_PROTOCOL
  | typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;

export interface WsEnvelope<T = Record<string, Json>> {
  protocol: LiveWorkflowProtocol;
  messageType: string;
  requestId?: string;
  seq?: number;
  cursor?: string;
  ts: ISODateTime;
  data: T;
}

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
] as const;

export type BrowserCommand = (typeof BrowserCommands)[number];

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
] as const;

export type BrowserEvent = (typeof BrowserEvents)[number];

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
] as const;

export type NormalizedSessionEvent = (typeof NormalizedSessionEvents)[number];

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
] as const;

export type VmCommand = (typeof VmCommands)[number];

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
] as const satisfies readonly VmCommand[];

export type VmSessionControlCommand = (typeof VmSessionControlCommands)[number];

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
] as const;

export type VmEvent = (typeof VmEvents)[number];

export type VmHostVolumeSnapshot = {
  mountPath: string;
  role: string;
  totalBytes?: ByteCount | null;
  availableBytes?: ByteCount | null;
  metadata?: Record<string, Json>;
};

export type VmHostSystemSnapshot = {
  hostname: string;
  platform: string;
  arch: string;
  cpuCount: number;
  cpuModel?: string | null;
  loadAverage: number[];
  uptimeSeconds: number;
  totalMemoryBytes: number;
  freeMemoryBytes: number;
};

export const VmGpuTelemetryStatuses = ["ok", "unavailable", "error"] as const;
export type VmGpuTelemetryStatus = (typeof VmGpuTelemetryStatuses)[number];

export type VmGpuDeviceTelemetrySnapshot = {
  index: number;
  uuid: string;
  name: string;
  utilizationPercent: number | null;
  memoryUsedBytes: ByteCount | null;
  memoryTotalBytes: ByteCount | null;
};

export type VmGpuTelemetrySnapshot = {
  available: boolean;
  status: VmGpuTelemetryStatus;
  deviceCount: number;
  utilizationPercent?: number | null;
  devices: VmGpuDeviceTelemetrySnapshot[];
};

export type VmRegisterPayload = {
  vmHostId?: UUID | null;
  name: string;
  capabilities: Record<string, Json>;
  metadata?: Record<string, Json>;
  volumes?: VmHostVolumeSnapshot[];
  system?: VmHostSystemSnapshot;
};

export type VmHeartbeatPayload = {
  vmHostId: UUID;
  status?: string;
  capabilities?: Record<string, Json>;
  metadata?: Record<string, Json>;
  system?: VmHostSystemSnapshot;
};

export type VmContainerStatsSnapshot = {
  containerName: string;
  sessionId?: string | null;
  runId?: string | null;
  cpuPercent?: number | null;
  memoryBytes?: number | null;
  memoryLimitBytes?: number | null;
  memoryPercent?: number | null;
  storage?: VmContainerStorageSnapshot;
};

export type VmContainerWritableMountSnapshot = {
  containerPath: string;
  role: string;
  readOnly?: false;
  usedBytes?: ByteCount | null;
  totalBytes?: ByteCount | null;
  availableBytes?: ByteCount | null;
  truncated?: boolean;
  error?: string | null;
};

export type VmContainerDatasetMountSnapshot = {
  containerPath: string;
  datasetVersionId: string;
  name?: string | null;
  versionLabel?: string | null;
  readOnly: true;
  sizeBytes?: ByteCount | null;
};

export type VmContainerStorageSnapshot = {
  writableMounts?: VmContainerWritableMountSnapshot[];
  datasetMounts?: VmContainerDatasetMountSnapshot[];
};

export type VmTelemetryPayload = {
  vmHostId: UUID;
  telemetry: Record<string, Json>;
  volumes?: VmHostVolumeSnapshot[];
  capabilities?: Record<string, Json>;
  metadata?: Record<string, Json>;
  system?: VmHostSystemSnapshot;
  containers?: VmContainerStatsSnapshot[];
};

export type WorkspacePrepareAuditContext = {
  commandId: string;
  requestedByUserId?: number | null;
  requestedByType?: "user" | "system";
  groupId: string;
  experimentId: UUID;
  workspaceId: UUID;
  vmHostId: UUID;
  requestedAt: ISODateTime;
  runId?: UUID | null;
  runStepId?: UUID | null;
};

export type WorkspaceMaterializationFile =
  | {
      path: string;
      content: string;
      mode?: number | null;
    }
  | {
      path: string;
      contentBase64: string;
      encoding: "base64";
      mode?: number | null;
    };

export type WorkspaceMaterializationRule = {
  name: string;
  content: string;
};

export type WorkspaceMaterializationSkill = {
  name: string;
  skillMd: string;
  files?: WorkspaceMaterializationFile[];
};

export type WorkspaceMaterialization = {
  agentsMd?: string;
  codexHomeAgentsOverrideMd?: string;
  codexConfigToml?: string;
  rules?: WorkspaceMaterializationRule[];
  skills?: WorkspaceMaterializationSkill[];
  fullPlanMd?: string;
  researchPlanMd?: string;
  files?: WorkspaceMaterializationFile[];
  cacheFiles?: WorkspaceMaterializationFile[];
};

export type WorkspaceGitHubFolder = {
  repositoryFullName: string;
  cloneUrl: string;
  branchName: string;
  repoDirectoryName: string;
  folderPath: string;
  commitAuthorName: string;
  commitAuthorEmail: string;
  htmlUrl?: string | null;
  accessToken?: string | null;
  tokenUsername?: string | null;
};

export type WorkspacePreparePayload = {
  commandId: string;
  auditContext: WorkspacePrepareAuditContext;
  workspaceId: UUID;
  vmHostId: UUID;
  rootPath: string;
  datasetOutputPath?: string;
  repoUrl?: string | null;
  repoRef?: string | null;
  githubFolder?: WorkspaceGitHubFolder | null;
  materialization?: WorkspaceMaterialization;
};

export type WorkspacePreparedLayout = {
  rootPath: string;
  workspacePath: string;
  codexHomePath: string;
  artifactsPath: string;
  cachePath: string;
  datasetOutputPath?: string;
};

export type WorkspaceRepoPrepareResult = {
  status: "cloned" | "updated" | "empty";
  repoUrl?: string | null;
  repoRef?: string | null;
  checkedOutRef?: string | null;
};

export type WorkspaceGitHubFolderPrepareResult = {
  status: "cloned" | "updated";
  repositoryFullName: string;
  branchName: string;
  repoDirectoryName: string;
  folderPath: string;
  workspacePath: string;
  credentialHelperPath?: string | null;
  checkedOutRef?: string | null;
  checkedOutCommitSha?: string | null;
};

export type WorkspacePreparedPayload = {
  commandId: string;
  auditContext: WorkspacePrepareAuditContext;
  workspaceId: UUID;
  vmHostId: UUID;
  rootPath: string;
  preparedAt: ISODateTime;
  layout: WorkspacePreparedLayout;
  repo: WorkspaceRepoPrepareResult;
  githubFolder?: WorkspaceGitHubFolderPrepareResult | null;
  materializedFiles: string[];
};

export type VmPreviousArtifactMount = {
  sourcePath: string;
  containerPath: string;
  readOnly: true;
  metadata?: Record<string, Json>;
};

export type VmReviewEvidenceMount = {
  sourcePath: string;
  containerPath: string;
  readOnly: true;
  evidenceType: "workspace" | "artifacts" | "cache" | "dataset-output";
  experimentId: UUID;
  forbiddenRelativePaths?: string[];
  metadata?: Record<string, Json>;
};

export type WorkspaceFileMaterializePayload = {
  commandId: string;
  workspaceId: UUID;
  vmHostId: UUID;
  rootPath: string;
  target?: "workspace" | "artifacts";
  path: string;
  mode?: number | null;
  contentType?: string | null;
  sizeBytes: ByteCount;
  checksumSha256: string;
};

export type WorkspaceFileMaterializedPayload = {
  commandId: string;
  workspaceId: UUID;
  vmHostId: UUID;
  rootPath: string;
  target?: "workspace" | "artifacts";
  path: string;
  contentChecksumSha256: string;
  sizeBytes: ByteCount;
  materializedAt: ISODateTime;
};

export type WorkspaceFileReadPayload = {
  commandId: string;
  sessionId: UUID;
  workspaceId: UUID;
  path: string;
  scope?: "workspace" | "review_evidence";
  maxBytes?: number;
  checksumOnly?: boolean;
  statOnly?: boolean;
};

export type WorkspaceFileReadResponsePayload = {
  commandId: string;
  sessionId: UUID;
  workspaceId: UUID;
  path: string;
  scope?: "workspace" | "review_evidence";
  content: string;
  contentChecksumSha256: string;
  sizeBytes: ByteCount;
  maxBytes: number;
  checksumOnly?: boolean;
  statOnly?: boolean;
  entryType?: "file" | "directory";
  truncated: boolean;
  readAt: ISODateTime;
};

export type VmDatasetPromotePayload = {
  commandId: string;
  workspaceId: UUID;
  vmHostId: UUID;
  datasetVersionId: UUID;
  sourcePath: string;
  allowedSourceRootPath: string;
  manifestChecksumSha256?: string | null;
  metadata?: Record<string, Json>;
};

export type VmDatasetPromotedPayload = {
  ok: true;
  commandId: string;
  workspaceId: UUID;
  vmHostId: UUID;
  datasetVersionId: UUID;
  hotPath: string;
  uri: string;
  sourcePath: string;
  promotedAt: ISODateTime;
  sizeBytes?: ByteCount | null;
  mountedFiles?: string[];
  mountedFileCount?: number;
  mountedFilesTruncated?: boolean;
  metadata?: Record<string, Json>;
};

export type VmDatasetOutputNormalizePayload = {
  commandId: string;
  workspaceId: UUID;
  vmHostId: UUID;
  sourcePath: string;
  allowedSourceRootPath: string;
  sessionId?: string | null;
  metadata?: Record<string, Json>;
};

export type VmDatasetOutputNormalizedPayload = {
  ok: true;
  commandId: string;
  workspaceId: UUID;
  vmHostId: UUID;
  sourcePath: string;
  normalizedAt: ISODateTime;
  mode: "host" | "container_fallback";
  fileCount: number;
  directoryCount: number;
  metadata?: Record<string, Json>;
};

export type VmDatasetValidationAsset = {
  relativePath: string;
  status?: string | null;
  sizeBytes?: ByteCount | null;
  checksumSha256?: string | null;
};

export type VmDatasetValidationFile = {
  relativePath: string;
  sizeBytes: ByteCount;
  checksumSha256?: string | null;
  format?: string | null;
  compression?: string | null;
};

export type VmDatasetValidatePayload = {
  commandId: string;
  workspaceId: UUID;
  vmHostId: UUID;
  sourcePath: string;
  allowedSourceRootPath: string;
  expectedFiles?: string[];
  assets?: VmDatasetValidationAsset[];
  metadata?: Record<string, Json>;
};

export type VmDatasetValidatedPayload = {
  ok: true;
  commandId: string;
  workspaceId: UUID;
  vmHostId: UUID;
  sourcePath: string;
  uri: string;
  validatedAt: ISODateTime;
  sizeBytes?: ByteCount | null;
  mountedFiles?: string[];
  mountedFileCount?: number;
  mountedFilesTruncated?: boolean;
  files?: VmDatasetValidationFile[];
  missingExpectedFiles?: string[];
  missingAssetFiles?: string[];
  checksumFailures?: string[];
  sizeMismatches?: string[];
  metadata?: Record<string, Json>;
};

export type VmDatasetFilePreviewPayload = {
  commandId: string;
  vmHostId: UUID;
  datasetVersionId: UUID;
  datasetLocationId: UUID;
  locationUri: string;
  path: string;
  maxBytes?: number;
};

export type VmDatasetFilePreviewReadyPayload = {
  ok: true;
  commandId: string;
  vmHostId: UUID;
  datasetVersionId: UUID;
  datasetLocationId: UUID;
  locationUri: string;
  path: string;
  content: string;
  contentChecksumSha256: string;
  sizeBytes: ByteCount;
  maxBytes: number;
  truncated: boolean;
  readAt: ISODateTime;
};

export type VmAgentAckPayload = {
  ok: true;
  vmHostId: UUID;
  messageType:
    | "vm.register"
    | "vm.heartbeat"
    | "vm.telemetry"
    | "session.event"
    | "codex.auth.material.updated";
};

export type VmBrokerHelloPayload = {
  vmHostId: UUID;
  connectionId?: string | null;
  capabilities: Record<string, Json>;
  metadata?: Record<string, Json>;
};

export type VmBrokerHelloAckPayload = {
  ok: true;
  vmHostId: UUID;
  connectionId: string;
};

export type VmBrokerCommandErrorPayload = {
  ok: false;
  commandId: string;
  messageType: VmCommand;
  sessionId?: UUID | null;
  code: string;
  message: string;
  details?: Record<string, Json>;
};

export type VmBrokerHelloEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "vm.broker.hello";
  ts: ISODateTime;
  data: VmBrokerHelloPayload;
};

export type VmBrokerHelloAckEnvelope = {
  ok: true;
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "vm.broker.hello.ack";
  ts: ISODateTime;
  data: VmBrokerHelloAckPayload;
};

export type VmBrokerCommandErrorEnvelope = {
  ok: false;
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "vm.command.error";
  commandId: string;
  ts: ISODateTime;
  data: VmBrokerCommandErrorPayload;
};

export type VmWorkspacePrepareCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "workspace.prepare";
  commandId: string;
  ts: ISODateTime;
  data: WorkspacePreparePayload;
};

export type VmWorkspacePreparedResponseEnvelope = {
  ok: true;
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "workspace.prepared";
  commandId: string;
  ts: ISODateTime;
  data: WorkspacePreparedPayload;
};

export type VmSessionStartAuth = {
  provider?: string | null;
  authMode?: string | null;
  secretRef?: string | null;
  metadata?: Record<string, Json>;
};

export type CodexAuthMaterialFile = {
  path: string;
  dataBase64: string;
  mode?: number | null;
};

export type CodexAuthMaterial = {
  format: "codex_home_files_v1";
  files: CodexAuthMaterialFile[];
  metadata?: Record<string, Json>;
};

export type VmCodexAuthMaterialUpdatedPayload = {
  vmHostId: UUID;
  sessionId: UUID;
  authProfileId: UUID;
  baseFingerprintSha256: string;
  currentFingerprintSha256: string;
  authMaterial: CodexAuthMaterial;
  account?: Record<string, Json> | null;
  source?: string | null;
  updatedAt: ISODateTime;
};

export type VmCodexAuthLoginStartPayload = {
  commandId: string;
  authProfileId: UUID;
  vmHostId: UUID;
  rootPath: string;
  loginType: "chatgptDeviceCode";
};

export type VmCodexAuthLoginStartedPayload = {
  ok: true;
  commandId: string;
  authProfileId: UUID;
  vmHostId: UUID;
  rootPath: string;
  loginType: "chatgptDeviceCode";
  loginId: string;
  verificationUrl: string;
  userCode: string;
};

export type VmCodexAuthLoginCompletePayload = {
  commandId: string;
  authProfileId: UUID;
  vmHostId: UUID;
  rootPath: string;
  loginId: string;
  timeoutMs?: number | null;
};

export type VmCodexAuthLoginCompletedPayload = {
  ok: true;
  commandId: string;
  authProfileId: UUID;
  vmHostId: UUID;
  rootPath: string;
  loginId: string;
  account: Record<string, Json> | null;
  authMaterial: CodexAuthMaterial;
};

export type VmCodexAuthLoginCancelPayload = {
  commandId: string;
  authProfileId: UUID;
  vmHostId: UUID;
  rootPath: string;
  loginId: string;
};

export type VmCodexAuthLoginCancelledPayload = {
  ok: true;
  commandId: string;
  authProfileId: UUID;
  vmHostId: UUID;
  rootPath: string;
  loginId: string;
};

export type VmSessionDatasetMountLocation = {
  kind: "gcs" | "local";
  tier: "cold" | "hot";
  uri: string;
  storageClass?: string | null;
  metadata?: Record<string, Json>;
};

export type VmSessionDatasetMount = {
  datasetVersionId: UUID;
  name: string;
  versionLabel: string;
  containerPath: string;
  access: "read_only";
  required: boolean;
  locations: VmSessionDatasetMountLocation[];
  manifestChecksumSha256?: string | null;
  sizeBytes?: ByteCount | null;
  metadata?: Record<string, Json>;
};

export type VmSessionStartPayload = {
  commandId: string;
  sessionId: UUID;
  runId: UUID;
  runStepId: UUID;
  nodeId: UUID;
  workspaceId: UUID;
  vmHostId: UUID;
  runtimeProfileId: UUID;
  authProfileId?: UUID | null;
  layout: WorkspacePreparedLayout;
  runtimeSnapshot: Record<string, Json>;
  inputPayload: Record<string, Json>;
  auth?: VmSessionStartAuth | null;
  codexThreadId?: string | null;
  persistExtendedHistory?: boolean;
  initialTurnMode?: "start" | "deferred";
  pendingLogicalTurnRetry?: VmPendingLogicalTurnRetry | null;
  pendingLogicalTurnRetries?: VmPendingLogicalTurnRetry[];
  datasetMounts?: VmSessionDatasetMount[];
  previousArtifactMounts?: VmPreviousArtifactMount[];
  reviewEvidenceMounts?: VmReviewEvidenceMount[];
  sensitiveHostPaths?: string[];
};

export type VmSessionStartedPayload = {
  commandId: string;
  sessionId: UUID;
  workspaceId: UUID;
  vmHostId: UUID;
  codexThreadId: string;
  codexTurnId?: string | null;
  vmEventStreamId?: string | null;
  vmEventSeqBoundary?: number | null;
  pendingLogicalTurnRetry?: VmPendingLogicalTurnRetry | null;
  pendingLogicalTurnRetries?: VmPendingLogicalTurnRetry[];
  transport: "stdio";
  runtimeMetadata: Record<string, Json>;
};

export type VmCodexTextInput = {
  type: "text";
  text: string;
};

export type VmCodexUserInput = VmCodexTextInput;

export type VmSessionResumePayload = {
  commandId: string;
  sessionId: UUID;
  codexThreadId: string;
  persistExtendedHistory?: boolean;
  overrides?: Record<string, Json>;
};

export type VmSessionPausePayload = {
  commandId: string;
  sessionId: UUID;
  codexThreadId?: string | null;
  codexTurnId?: string | null;
  interruptActiveTurn?: boolean;
  keepWarm?: boolean;
  reason?: string | null;
};

export type VmSessionThreadForkPayload = {
  commandId: string;
  sessionId: UUID;
  codexThreadId: string;
  persistExtendedHistory?: boolean;
  overrides?: Record<string, Json>;
};

export type VmSessionTurnStartPayload = {
  commandId: string;
  sessionId: UUID;
  codexThreadId: string;
  input: VmCodexUserInput[];
  overrides?: Record<string, Json>;
};

export type VmSessionTurnSteerPayload = {
  commandId: string;
  sessionId: UUID;
  codexThreadId: string;
  codexTurnId: string;
  input: VmCodexUserInput[];
  overrides?: Record<string, Json>;
};

export type VmSessionInterruptPayload = {
  commandId: string;
  sessionId: UUID;
  codexThreadId: string;
  codexTurnId?: string | null;
};

export type VmSessionInjectItemsPayload = {
  commandId: string;
  sessionId: UUID;
  codexThreadId: string;
  items: Json[];
};

export type VmSessionApprovalError = {
  code: number;
  message: string;
  data?: Json;
};

export type VmSessionApprovalRespondPayload = {
  commandId: string;
  sessionId: UUID;
  requestId: string | number;
  result?: Record<string, Json>;
  error?: VmSessionApprovalError;
};

export type BrowserSessionApprovalRespondCommandData = {
  approvalTaskId: UUID;
  status?: string;
  result?: Record<string, Json>;
  error?: VmSessionApprovalError;
};

export type BrowserSubscribeCommandData = {
  topic?: string;
  topics?: string[];
  cursors?: Record<string, string>;
  includeArtifacts?: boolean;
  snapshot?: boolean;
  replayLimit?: number;
};

export type BrowserUnsubscribeCommandData = {
  topic?: string;
  topics?: string[];
};

export type VmSessionReviewTarget =
  | { type: "uncommittedChanges" }
  | { type: "baseBranch"; branch: string }
  | { type: "commit"; sha: string; title?: string | null }
  | { type: "custom"; instructions: string };

export type VmSessionReviewDelivery = "inline" | "detached";

export type VmSessionReviewStartPayload = {
  commandId: string;
  sessionId: UUID;
  codexThreadId: string;
  target: VmSessionReviewTarget;
  delivery?: VmSessionReviewDelivery;
};

export type BrowserSessionTurnStartCommandData = {
  sessionId: UUID;
  input: VmCodexUserInput[];
  overrides?: Record<string, Json>;
};

export type BrowserSessionTurnSteerCommandData = {
  sessionId: UUID;
  input: VmCodexUserInput[];
  codexTurnId?: string;
  overrides?: Record<string, Json>;
};

export type BrowserSessionInterruptCommandData = {
  sessionId: UUID;
  codexTurnId?: string;
};

export type BrowserSessionInjectItemsCommandData = {
  sessionId: UUID;
  items: Json[];
};

export type BrowserSessionReviewStartCommandData = {
  sessionId: UUID;
  target: VmSessionReviewTarget;
  delivery?: VmSessionReviewDelivery;
};

export type VmSessionTerminatePayload = {
  commandId: string;
  sessionId: UUID;
};

export type VmWorkspaceArchivePayload = {
  commandId: string;
  sessionId: UUID;
  workspaceId?: UUID;
};

export type VmSessionCommandAckPayload = {
  ok: true;
  commandId: string;
  sessionId: UUID;
  codexThreadId?: string | null;
  codexTurnId?: string | null;
  result?: Record<string, Json>;
};

export type VmAuxTerminalOpenPayload = {
  commandId: string;
  sessionId: UUID;
  cols?: number;
  rows?: number;
};

export type VmAuxTerminalInputPayload = {
  commandId: string;
  sessionId: UUID;
  terminalId: string;
  data: string;
};

export type VmAuxTerminalResizePayload = {
  commandId: string;
  sessionId: UUID;
  terminalId: string;
  cols: number;
  rows: number;
};

export type VmAuxTerminalClosePayload = {
  commandId: string;
  sessionId: UUID;
  terminalId: string;
};

export type VmAuxTerminalChunkPayload = {
  sessionId: UUID;
  terminalId: string;
  seq: number;
  stream: "stdout" | "stderr";
  data: string;
  ts: ISODateTime;
};

export type VmAuxTerminalOpenedPayload = {
  commandId: string;
  sessionId: UUID;
  terminalId: string;
  runtime?: "container" | "host";
  cwd: string;
  shell: string;
  pid: number;
  openedAt: ISODateTime;
  cols: number;
  rows: number;
  backlog: VmAuxTerminalChunkPayload[];
};

export type VmAuxTerminalAckPayload = {
  ok: true;
  commandId: string;
  sessionId: UUID;
  terminalId: string;
  cols?: number;
  rows?: number;
};

export type VmAuxTerminalClosedPayload = {
  ok: true;
  commandId: string;
  sessionId: UUID;
  terminalId: string;
  closed: boolean;
  exitCode?: number | null;
  signal?: string | null;
};

export type VmAuxTerminalBacklogPayload = {
  sessionId: UUID;
  terminalId: string;
  chunks: VmAuxTerminalChunkPayload[];
  closed: boolean;
  exitCode?: number | null;
  signal?: string | null;
};

export type BrowserAuxTerminalOpenCommandData = {
  sessionId: UUID;
  cols?: number;
  rows?: number;
};

export type BrowserAuxTerminalInputCommandData = {
  sessionId: UUID;
  terminalId: string;
  data: string;
};

export type BrowserAuxTerminalResizeCommandData = {
  sessionId: UUID;
  terminalId: string;
  cols: number;
  rows: number;
};

export type BrowserAuxTerminalCloseCommandData = {
  sessionId: UUID;
  terminalId: string;
};

export type ArtifactCollectPayload = {
  commandId: string;
  sessionId: UUID;
  runId: UUID;
  runStepId: UUID;
  workspaceId: UUID;
  vmHostId: UUID;
  artifactsPath: string;
  includeGlobs?: string[];
  excludeGlobs?: string[];
  upload?: boolean;
  knownArtifacts?: ArtifactCollectKnownArtifact[];
};

export type ArtifactCollectKnownArtifact = {
  artifactId?: UUID | null;
  relativePath: string;
  checksumSha256: string;
  sizeBytes?: ByteCount;
  objectUri?: string | null;
};

export type CollectedArtifact = {
  artifactId?: UUID | null;
  relativePath: string;
  localPath: string;
  localUri: string;
  objectUri?: string | null;
  kind: string;
  contentType?: string | null;
  sizeBytes: ByteCount;
  checksumSha256: string;
  collectedAt: ISODateTime;
  metadata?: Record<string, Json>;
};

export type ArtifactCollectResponsePayload = {
  commandId: string;
  sessionId: UUID;
  runId: UUID;
  runStepId: UUID;
  workspaceId: UUID;
  vmHostId: UUID;
  artifactsPath: string;
  uploadEnabled: boolean;
  collectedAt: ISODateTime;
  artifacts: CollectedArtifact[];
};

export type VmSessionEventPayload = {
  /**
   * VM-local stream sequence for transport ordering. The API assigns the
   * durable AgentSessionEvent.seq used by history and replay cursors.
   */
  seq: number;
  vmEventStreamId?: string | null;
  sessionId: UUID;
  workspaceId: UUID;
  vmHostId: UUID;
  eventType: NormalizedSessionEvent;
  codexThreadId?: string | null;
  codexTurnId?: string | null;
  itemId?: string | null;
  payload: Record<string, Json>;
  rawPayload?: Record<string, Json> | null;
};

export type CodexRetryClassification =
  | "server_overloaded"
  | "usage_limit"
  | "transient_connection"
  | "internal_server_error";

export type CodexHarnessRetryMetadata = {
  owner: "yp-live-workflow";
  scheduled: boolean;
  classification: CodexRetryClassification;
  attempt: number;
  nominalDelayMs: number;
  delayMs: number;
  nextRetryAt: ISODateTime;
};

export type VmPendingLogicalTurnRetry = {
  method: "turn/start" | "review/start";
  params: Record<string, Json>;
  metadata: CodexHarnessRetryMetadata;
  turnId?: string;
};

export const CodexRetryClassificationSchema = z.enum([
  "server_overloaded",
  "usage_limit",
  "transient_connection",
  "internal_server_error",
]) satisfies z.ZodType<CodexRetryClassification>;

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
  .strict() satisfies z.ZodType<CodexHarnessRetryMetadata>;

export const VmPendingLogicalTurnRetrySchema = z
  .object({
    method: z.enum(["turn/start", "review/start"]),
    params: z.record(z.string(), JsonSchema),
    metadata: CodexHarnessRetryMetadataSchema,
    turnId: z.string().min(1).optional(),
  })
  .strict() satisfies z.ZodType<VmPendingLogicalTurnRetry>;

/**
 * True while either Codex itself or the LiveWorkflow harness owns recovery for an
 * otherwise terminal-looking app-server event.
 */
export function codexSessionEventWillRetry(
  payload: Record<string, Json>,
): boolean {
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
export function codexRetryClassification(
  payload: Record<string, Json>,
): CodexRetryClassification | null {
  const error = jsonRecordValue(payload.error);
  const turn = jsonRecordValue(payload.turn);
  const turnError = jsonRecordValue(turn?.error);
  const candidate = error ?? turnError ?? payload;
  const info = candidate.codexErrorInfo ?? payload.codexErrorInfo;
  const infoName = codexErrorInfoName(info);
  const infoStatus = codexErrorHttpStatus(info);
  const status =
    infoStatus ??
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
  if (
    infoName === "httpConnectionFailed" ||
    infoName === "responseStreamConnectionFailed" ||
    infoName === "responseStreamDisconnected" ||
    infoName === "responseTooManyFailedAttempts"
  ) {
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

  if (
    infoName === "unauthorized" ||
    infoName === "badRequest" ||
    infoName === "contextWindowExceeded" ||
    infoName === "sessionBudgetExceeded" ||
    infoName === "cyberPolicy" ||
    infoName === "threadRollbackFailed" ||
    infoName === "sandboxError"
  ) {
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
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase();

  if (
    /\b(full|at|over) capacity\b|server.?overload|temporar(?:y|ily) unavailable|try (?:a )?different (?:model|mode)/iu.test(
      message,
    )
  ) {
    return "server_overloaded";
  }
  if (
    /\b429\b|rate.?limit|usage.?limit|insufficient.?quota|quota|credits? (?:exhausted|depleted|reached|used)/iu.test(
      message,
    )
  ) {
    return "usage_limit";
  }
  if (
    /\b(?:ECONNRESET|ETIMEDOUT|EAI_AGAIN)\b|timed? ?out|connection (?:failed|reset|closed)|stream (?:failed|disconnected)/iu.test(
      message,
    )
  ) {
    return "transient_connection";
  }
  if (
    /internal server error|service unavailable|bad gateway|gateway timeout/iu.test(
      message,
    )
  ) {
    return "internal_server_error";
  }

  return null;
}

function codexErrorInfoName(value: Json | undefined): string | null {
  if (typeof value === "string") {
    return value;
  }

  const record = jsonRecordValue(value);
  return record ? (Object.keys(record)[0] ?? null) : null;
}

function codexErrorHttpStatus(value: Json | undefined): number | null {
  const record = jsonRecordValue(value);
  if (!record) {
    return null;
  }

  const details = jsonRecordValue(Object.values(record)[0]);
  return numericValue(details?.httpStatusCode);
}

function jsonRecordValue(value: Json | undefined): Record<string, Json> | null {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, Json>)
    : null;
}

function stringValueOrNull(value: Json | undefined): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function numericValue(value: Json | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export type SessionSnapshotPayload = {
  session: AgentSessionRef;
  lastSeq: number | null;
  cursor: string;
  generatedAt: ISODateTime;
  events?: AgentSessionEvent[];
  pendingApprovals?: ApprovalTask[];
  artifacts?: Artifact[];
};

export type SessionHistoryQuery = {
  cursor?: string;
  afterSeq?: number;
  limit?: number;
  includeRawTrace?: boolean;
};

export type SessionHistoryResponse = {
  events: AgentSessionEvent[];
  lastSeq: number | null;
  nextCursor: string;
};

export const SessionConversationEventTypes = [
  "codex.input.started",
  "codex.input.steered",
  "message.completed",
] as const;
export type SessionConversationEventType =
  (typeof SessionConversationEventTypes)[number];

export type SessionConversationHistoryQuery = {
  view: "conversation";
  before?: string;
  limit?: number;
};

export type SessionConversationHistoryPage = {
  events: AgentSessionEvent[];
  olderCursor: string | null;
  hasOlder: boolean;
};

export type VmSessionStartCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "session.start";
  commandId: string;
  ts: ISODateTime;
  data: VmSessionStartPayload;
};

export type VmCodexAuthLoginStartCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "codex.auth.login.start";
  commandId: string;
  ts: ISODateTime;
  data: VmCodexAuthLoginStartPayload;
};

export type VmCodexAuthLoginStartedResponseEnvelope = {
  ok: true;
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "codex.auth.login.started";
  commandId: string;
  ts: ISODateTime;
  data: VmCodexAuthLoginStartedPayload;
};

export type VmCodexAuthLoginCompleteCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "codex.auth.login.complete";
  commandId: string;
  ts: ISODateTime;
  data: VmCodexAuthLoginCompletePayload;
};

export type VmCodexAuthLoginCompletedResponseEnvelope = {
  ok: true;
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "codex.auth.login.completed";
  commandId: string;
  ts: ISODateTime;
  data: VmCodexAuthLoginCompletedPayload;
};

export type VmCodexAuthLoginCancelCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "codex.auth.login.cancel";
  commandId: string;
  ts: ISODateTime;
  data: VmCodexAuthLoginCancelPayload;
};

export type VmCodexAuthLoginCancelledResponseEnvelope = {
  ok: true;
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "codex.auth.login.cancelled";
  commandId: string;
  ts: ISODateTime;
  data: VmCodexAuthLoginCancelledPayload;
};

export type VmSessionStartedResponseEnvelope = {
  ok: true;
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "session.started";
  commandId: string;
  ts: ISODateTime;
  data: VmSessionStartedPayload;
};

export type VmSessionResumeCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "session.resume";
  commandId: string;
  ts: ISODateTime;
  data: VmSessionResumePayload;
};

export type VmSessionPauseCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "session.pause";
  commandId: string;
  ts: ISODateTime;
  data: VmSessionPausePayload;
};

export type VmSessionThreadForkCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "session.thread.fork";
  commandId: string;
  ts: ISODateTime;
  data: VmSessionThreadForkPayload;
};

export type VmSessionTurnStartCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "session.turn.start";
  commandId: string;
  ts: ISODateTime;
  data: VmSessionTurnStartPayload;
};

export type VmSessionTurnSteerCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "session.turn.steer";
  commandId: string;
  ts: ISODateTime;
  data: VmSessionTurnSteerPayload;
};

export type VmSessionInjectItemsCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "session.inject_items";
  commandId: string;
  ts: ISODateTime;
  data: VmSessionInjectItemsPayload;
};

export type VmSessionInterruptCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "session.interrupt";
  commandId: string;
  ts: ISODateTime;
  data: VmSessionInterruptPayload;
};

export type VmSessionApprovalRespondCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "session.approval.respond";
  commandId: string;
  ts: ISODateTime;
  data: VmSessionApprovalRespondPayload;
};

export type VmSessionReviewStartCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "session.review.start";
  commandId: string;
  ts: ISODateTime;
  data: VmSessionReviewStartPayload;
};

export type VmSessionTerminateCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "session.terminate";
  commandId: string;
  ts: ISODateTime;
  data: VmSessionTerminatePayload;
};

export type VmWorkspaceArchiveCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "workspace.archive";
  commandId: string;
  ts: ISODateTime;
  data: VmWorkspaceArchivePayload;
};

export type VmWorkspaceFileReadCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "workspace.file.read";
  commandId: string;
  ts: ISODateTime;
  data: WorkspaceFileReadPayload;
};

export type VmWorkspaceFileReadyResponseEnvelope = {
  ok: true;
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "workspace.file.ready";
  commandId: string;
  ts: ISODateTime;
  data: WorkspaceFileReadResponsePayload;
};

export type VmDatasetPromoteCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "dataset.promote";
  commandId: string;
  ts: ISODateTime;
  data: VmDatasetPromotePayload;
};

export type VmDatasetPromotedResponseEnvelope = {
  ok: true;
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "dataset.promoted";
  commandId: string;
  ts: ISODateTime;
  data: VmDatasetPromotedPayload;
};

export type VmDatasetOutputNormalizeCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "dataset.output.normalize";
  commandId: string;
  ts: ISODateTime;
  data: VmDatasetOutputNormalizePayload;
};

export type VmDatasetOutputNormalizedResponseEnvelope = {
  ok: true;
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "dataset.output.normalized";
  commandId: string;
  ts: ISODateTime;
  data: VmDatasetOutputNormalizedPayload;
};

export type VmDatasetValidateCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "dataset.validate";
  commandId: string;
  ts: ISODateTime;
  data: VmDatasetValidatePayload;
};

export type VmDatasetValidatedResponseEnvelope = {
  ok: true;
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "dataset.validated";
  commandId: string;
  ts: ISODateTime;
  data: VmDatasetValidatedPayload;
};

export type VmDatasetFilePreviewCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "dataset.file.preview";
  commandId: string;
  ts: ISODateTime;
  data: VmDatasetFilePreviewPayload;
};

export type VmDatasetFilePreviewReadyResponseEnvelope = {
  ok: true;
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "dataset.file.preview.ready";
  commandId: string;
  ts: ISODateTime;
  data: VmDatasetFilePreviewReadyPayload;
};

export type VmSessionControlCommandEnvelope =
  | VmWorkspaceArchiveCommandEnvelope
  | VmSessionPauseCommandEnvelope
  | VmSessionResumeCommandEnvelope
  | VmSessionThreadForkCommandEnvelope
  | VmSessionTurnStartCommandEnvelope
  | VmSessionTurnSteerCommandEnvelope
  | VmSessionInjectItemsCommandEnvelope
  | VmSessionInterruptCommandEnvelope
  | VmSessionApprovalRespondCommandEnvelope
  | VmSessionReviewStartCommandEnvelope
  | VmSessionTerminateCommandEnvelope;

export type VmSessionCommandAckResponseEnvelope = {
  ok: true;
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: VmSessionControlCommand;
  commandId: string;
  ts: ISODateTime;
  data: VmSessionCommandAckPayload;
};

export type VmAuxTerminalOpenCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "session.aux_terminal.open";
  commandId: string;
  ts: ISODateTime;
  data: VmAuxTerminalOpenPayload;
};

export type VmAuxTerminalInputCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "session.aux_terminal.input";
  commandId: string;
  ts: ISODateTime;
  data: VmAuxTerminalInputPayload;
};

export type VmAuxTerminalResizeCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "session.aux_terminal.resize";
  commandId: string;
  ts: ISODateTime;
  data: VmAuxTerminalResizePayload;
};

export type VmAuxTerminalCloseCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "session.aux_terminal.close";
  commandId: string;
  ts: ISODateTime;
  data: VmAuxTerminalClosePayload;
};

export type VmArtifactCollectCommandEnvelope = {
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "artifact.collect";
  commandId: string;
  ts: ISODateTime;
  data: ArtifactCollectPayload;
};

export type VmArtifactCollectedResponseEnvelope = {
  ok: true;
  protocol: typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
  messageType: "artifact.ready";
  commandId: string;
  ts: ISODateTime;
  data: ArtifactCollectResponsePayload;
};

export const ClientMessageTypes = [
  ...BrowserCommands,
  ...BrowserEvents,
] as const;
export type ClientMessageType = (typeof ClientMessageTypes)[number];

export const VmMessageTypes = [...VmCommands, ...VmEvents] as const;
export type VmMessageType = (typeof VmMessageTypes)[number];

export const WorkflowWorkersTopic = "workflow:workers" as const;
export const ReviewJobTopicScopeType = "review_job" as const;
export const PlanningJobTopicScopeType = "planning_job" as const;
export const InfographicJobTopicScopeType = "infographic_job" as const;
export const RunMonitorTopicPrefix = "monitor:run" as const;

export type RealtimeTopic =
  | `${ScopeType}:${UUID}`
  | `${typeof ReviewJobTopicScopeType}:${UUID}`
  | `${typeof PlanningJobTopicScopeType}:${UUID}`
  | `${typeof InfographicJobTopicScopeType}:${UUID}`
  | `${typeof RunMonitorTopicPrefix}:${UUID}`
  | typeof WorkflowWorkersTopic
  | `brief:${ScopeType}:${UUID}`;

export type ParsedRealtimeTopic =
  | { type: "scope"; scope: ScopeRef }
  | { type: "review_job"; reviewJobId: UUID }
  | { type: "planning_job"; planningJobId: UUID }
  | { type: "infographic_job"; infographicJobId: UUID }
  | { type: "run_monitor"; runId: UUID }
  | { type: "workflow_workers" }
  | { type: "brief"; scope: ScopeRef };

export function makeScopeTopic(scope: ScopeRef): RealtimeTopic {
  return `${scope.type}:${scope.id}`;
}

export function makeReviewJobTopic(reviewJobId: UUID): RealtimeTopic {
  return `${ReviewJobTopicScopeType}:${reviewJobId}`;
}

export function makePlanningJobTopic(planningJobId: UUID): RealtimeTopic {
  return `${PlanningJobTopicScopeType}:${planningJobId}`;
}

export function makeInfographicJobTopic(infographicJobId: UUID): RealtimeTopic {
  return `${InfographicJobTopicScopeType}:${infographicJobId}`;
}

export function makeRunMonitorTopic(runId: UUID): RealtimeTopic {
  return `${RunMonitorTopicPrefix}:${runId}`;
}

export function makeBriefTopic(
  scopeType: ScopeType,
  scopeId: UUID,
): RealtimeTopic {
  return `brief:${scopeType}:${scopeId}`;
}

export function parseRealtimeTopic(topic: string): ParsedRealtimeTopic | null {
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

export function normalizeRealtimeTopic(topic: string): RealtimeTopic | null {
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

export function isScopeType(value: string): value is ScopeType {
  return ScopeTypes.includes(value as ScopeType);
}

export function isBrowserCommand(value: string): value is BrowserCommand {
  return BrowserCommands.includes(value as BrowserCommand);
}

export function isBrowserEvent(value: string): value is BrowserEvent {
  return BrowserEvents.includes(value as BrowserEvent);
}

export function isClientMessageType(value: string): value is ClientMessageType {
  return ClientMessageTypes.includes(value as ClientMessageType);
}

export function isVmCommand(value: string): value is VmCommand {
  return VmCommands.includes(value as VmCommand);
}

export function isVmEvent(value: string): value is VmEvent {
  return VmEvents.includes(value as VmEvent);
}

export function isVmMessageType(value: string): value is VmMessageType {
  return VmMessageTypes.includes(value as VmMessageType);
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
  .strict() satisfies z.ZodType<WsEnvelope<Json>>;

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
  .strict() satisfies z.ZodType<BrowserSubscribeCommandData>;

export const BrowserUnsubscribeCommandDataSchema = z
  .object({
    topic: z.string().min(1).optional(),
    topics: z.array(z.string().min(1)).optional(),
  })
  .strict() satisfies z.ZodType<BrowserUnsubscribeCommandData>;

export const VmHostVolumeSnapshotSchema = z
  .object({
    mountPath: z.string().min(1),
    role: z.string().min(1),
    totalBytes: ByteCountSchema.nullable().optional(),
    availableBytes: ByteCountSchema.nullable().optional(),
    metadata: z.record(z.string(), JsonSchema).optional(),
  })
  .strict() satisfies z.ZodType<VmHostVolumeSnapshot>;

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
  .strict() satisfies z.ZodType<VmHostSystemSnapshot>;

export const VmRegisterPayloadSchema = z
  .object({
    vmHostId: UUIDSchema.nullable().optional(),
    name: z.string().min(1),
    capabilities: z.record(z.string(), JsonSchema),
    metadata: z.record(z.string(), JsonSchema).optional(),
    volumes: z.array(VmHostVolumeSnapshotSchema).optional(),
    system: VmHostSystemSnapshotSchema.optional(),
  })
  .strict() satisfies z.ZodType<VmRegisterPayload>;

export const VmHeartbeatPayloadSchema = z
  .object({
    vmHostId: UUIDSchema,
    status: z.string().min(1).optional(),
    capabilities: z.record(z.string(), JsonSchema).optional(),
    metadata: z.record(z.string(), JsonSchema).optional(),
    system: VmHostSystemSnapshotSchema.optional(),
  })
  .strict() satisfies z.ZodType<VmHeartbeatPayload>;

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
  .strict() satisfies z.ZodType<VmContainerWritableMountSnapshot>;

export const VmContainerDatasetMountSnapshotSchema = z
  .object({
    containerPath: z.string().min(1),
    datasetVersionId: z.string().min(1),
    name: z.string().nullable().optional(),
    versionLabel: z.string().nullable().optional(),
    readOnly: z.literal(true),
    sizeBytes: VmTelemetryByteValueSchema.nullable().optional(),
  })
  .strict() satisfies z.ZodType<VmContainerDatasetMountSnapshot>;

export const VmContainerStorageSnapshotSchema = z
  .object({
    writableMounts: z.array(VmContainerWritableMountSnapshotSchema).optional(),
    datasetMounts: z.array(VmContainerDatasetMountSnapshotSchema).optional(),
  })
  .strict() satisfies z.ZodType<VmContainerStorageSnapshot>;

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
  .strict() satisfies z.ZodType<VmContainerStatsSnapshot>;

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
  .strict() satisfies z.ZodType<VmTelemetryPayload>;

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
  .strict() satisfies z.ZodType<WorkspacePrepareAuditContext>;

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
]) satisfies z.ZodType<WorkspaceMaterializationFile>;

export const WorkspaceMaterializationRuleSchema = z
  .object({
    name: SafePathSegmentSchema,
    content: z.string(),
  })
  .strict() satisfies z.ZodType<WorkspaceMaterializationRule>;

export const WorkspaceMaterializationSkillSchema = z
  .object({
    name: SafePathSegmentSchema,
    skillMd: z.string(),
    files: z.array(WorkspaceMaterializationFileSchema).optional(),
  })
  .strict() satisfies z.ZodType<WorkspaceMaterializationSkill>;

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
  .strict() satisfies z.ZodType<WorkspaceMaterialization>;

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
  .strict() satisfies z.ZodType<WorkspaceGitHubFolder>;

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
  }) satisfies z.ZodType<WorkspacePreparePayload>;

export const WorkspacePreparedLayoutSchema = z
  .object({
    rootPath: z.string().min(1),
    workspacePath: z.string().min(1),
    codexHomePath: z.string().min(1),
    artifactsPath: z.string().min(1),
    cachePath: z.string().min(1),
    datasetOutputPath: z.string().min(1).optional(),
  })
  .strict() satisfies z.ZodType<WorkspacePreparedLayout>;

export const WorkspaceRepoPrepareResultSchema = z
  .object({
    status: z.enum(["cloned", "updated", "empty"]),
    repoUrl: z.string().min(1).nullable().optional(),
    repoRef: z.string().min(1).nullable().optional(),
    checkedOutRef: z.string().min(1).nullable().optional(),
  })
  .strict() satisfies z.ZodType<WorkspaceRepoPrepareResult>;

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
  .strict() satisfies z.ZodType<WorkspaceGitHubFolderPrepareResult>;

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
    githubFolder:
      WorkspaceGitHubFolderPrepareResultSchema.nullable().optional(),
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
  }) satisfies z.ZodType<WorkspacePreparedPayload>;

export const VmPreviousArtifactMountSchema = z
  .object({
    sourcePath: z.string().min(1),
    containerPath: z.string().min(1),
    readOnly: z.literal(true),
    metadata: z.record(z.string(), JsonSchema).optional(),
  })
  .strict() satisfies z.ZodType<VmPreviousArtifactMount>;

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
  .strict() satisfies z.ZodType<VmReviewEvidenceMount>;

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
  .strict() satisfies z.ZodType<WorkspaceFileMaterializePayload>;

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
  .strict() satisfies z.ZodType<WorkspaceFileMaterializedPayload>;

export const WorkspaceFileReadPayloadSchema = z
  .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    workspaceId: UUIDSchema,
    path: z.string().min(1),
    scope: z.enum(["workspace", "review_evidence"]).optional(),
    maxBytes: z.number().int().positive().max(1_000_000).optional(),
    checksumOnly: z.boolean().optional(),
    statOnly: z.boolean().optional(),
  })
  .strict()
  .superRefine((payload, context) => {
    if (payload.checksumOnly && payload.statOnly) {
      context.addIssue({
        code: "custom",
        message:
          "Workspace file reads cannot request checksumOnly and statOnly together",
      });
    }
    const valid =
      payload.scope === "review_evidence"
        ? isSafeReviewEvidencePath(payload.path)
        : SafeRelativePathSchema.safeParse(payload.path).success;
    if (!valid) {
      context.addIssue({
        code: "custom",
        path: ["path"],
        message:
          payload.scope === "review_evidence"
            ? "Review evidence path must be normalized beneath /review-sources/experiments or /datasets"
            : "Workspace path must be a safe relative path",
      });
    }
  }) satisfies z.ZodType<WorkspaceFileReadPayload>;

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
    const valid =
      payload.scope === "review_evidence"
        ? isSafeReviewEvidencePath(payload.path)
        : SafeRelativePathSchema.safeParse(payload.path).success;
    if (!valid) {
      context.addIssue({
        code: "custom",
        path: ["path"],
        message: "Invalid file-read response path",
      });
    }
  }) satisfies z.ZodType<WorkspaceFileReadResponsePayload>;

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
  .strict() satisfies z.ZodType<VmDatasetPromotePayload>;

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
  .strict() satisfies z.ZodType<VmDatasetPromotedPayload>;

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
  .strict() satisfies z.ZodType<VmDatasetOutputNormalizePayload>;

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
  .strict() satisfies z.ZodType<VmDatasetOutputNormalizedPayload>;

export const VmDatasetValidationAssetSchema = z
  .object({
    relativePath: z.string().min(1),
    status: z.string().min(1).nullable().optional(),
    sizeBytes: ByteCountSchema.nullable().optional(),
    checksumSha256: z.string().min(1).nullable().optional(),
  })
  .strict() satisfies z.ZodType<VmDatasetValidationAsset>;

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
  .strict() satisfies z.ZodType<VmDatasetValidationFile>;

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
  .strict() satisfies z.ZodType<VmDatasetValidatePayload>;

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
  .strict() satisfies z.ZodType<VmDatasetValidatedPayload>;

export const VmDatasetFilePreviewPayloadSchema = z
  .object({
    commandId: z.string().min(1),
    vmHostId: UUIDSchema,
    datasetVersionId: UUIDSchema,
    datasetLocationId: UUIDSchema,
    locationUri: z.string().min(1),
    path: SafeRelativePathSchema,
    maxBytes: z.number().int().positive().max(1_000_000).optional(),
  })
  .strict() satisfies z.ZodType<VmDatasetFilePreviewPayload>;

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
  .strict() satisfies z.ZodType<VmDatasetFilePreviewReadyPayload>;

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
  .strict() satisfies z.ZodType<VmAgentAckPayload>;

export const VmBrokerHelloPayloadSchema = z
  .object({
    vmHostId: UUIDSchema,
    connectionId: z.string().min(1).nullable().optional(),
    capabilities: z.record(z.string(), JsonSchema),
    metadata: z.record(z.string(), JsonSchema).optional(),
  })
  .strict() satisfies z.ZodType<VmBrokerHelloPayload>;

export const VmBrokerHelloAckPayloadSchema = z
  .object({
    ok: z.literal(true),
    vmHostId: UUIDSchema,
    connectionId: z.string().min(1),
  })
  .strict() satisfies z.ZodType<VmBrokerHelloAckPayload>;

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
  .strict() satisfies z.ZodType<VmBrokerCommandErrorPayload>;

export const VmBrokerHelloEnvelopeSchema = z
  .object({
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("vm.broker.hello"),
    ts: ISODateTimeSchema,
    data: VmBrokerHelloPayloadSchema,
  })
  .strict() satisfies z.ZodType<VmBrokerHelloEnvelope>;

export const VmBrokerHelloAckEnvelopeSchema = z
  .object({
    ok: z.literal(true),
    protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
    messageType: z.literal("vm.broker.hello.ack"),
    ts: ISODateTimeSchema,
    data: VmBrokerHelloAckPayloadSchema,
  })
  .strict() satisfies z.ZodType<VmBrokerHelloAckEnvelope>;

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
  }) satisfies z.ZodType<VmBrokerCommandErrorEnvelope>;

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
  }) satisfies z.ZodType<VmWorkspacePrepareCommandEnvelope>;

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
  }) satisfies z.ZodType<VmWorkspacePreparedResponseEnvelope>;

export const VmSessionStartAuthSchema = z
  .object({
    provider: z.string().min(1).nullable().optional(),
    authMode: z.string().min(1).nullable().optional(),
    secretRef: z.string().min(1).nullable().optional(),
    metadata: z.record(z.string(), JsonSchema).optional(),
  })
  .strict() satisfies z.ZodType<VmSessionStartAuth>;

export const CodexAuthMaterialFileSchema = z
  .object({
    path: z.string().min(1),
    dataBase64: z.string().min(1),
    mode: z.number().int().nonnegative().nullable().optional(),
  })
  .strict() satisfies z.ZodType<CodexAuthMaterialFile>;

export const CodexAuthMaterialSchema = z
  .object({
    format: z.literal("codex_home_files_v1"),
    files: z.array(CodexAuthMaterialFileSchema).min(1),
    metadata: z.record(z.string(), JsonSchema).optional(),
  })
  .strict() satisfies z.ZodType<CodexAuthMaterial>;

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
  .strict() satisfies z.ZodType<VmCodexAuthMaterialUpdatedPayload>;

export const VmCodexAuthLoginStartPayloadSchema = z
  .object({
    commandId: z.string().min(1),
    authProfileId: UUIDSchema,
    vmHostId: UUIDSchema,
    rootPath: z.string().min(1),
    loginType: z.literal("chatgptDeviceCode"),
  })
  .strict() satisfies z.ZodType<VmCodexAuthLoginStartPayload>;

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
  .strict() satisfies z.ZodType<VmCodexAuthLoginStartedPayload>;

export const VmCodexAuthLoginCompletePayloadSchema = z
  .object({
    commandId: z.string().min(1),
    authProfileId: UUIDSchema,
    vmHostId: UUIDSchema,
    rootPath: z.string().min(1),
    loginId: z.string().min(1),
    timeoutMs: z.number().int().positive().nullable().optional(),
  })
  .strict() satisfies z.ZodType<VmCodexAuthLoginCompletePayload>;

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
  .strict() satisfies z.ZodType<VmCodexAuthLoginCompletedPayload>;

export const VmCodexAuthLoginCancelPayloadSchema = z
  .object({
    commandId: z.string().min(1),
    authProfileId: UUIDSchema,
    vmHostId: UUIDSchema,
    rootPath: z.string().min(1),
    loginId: z.string().min(1),
  })
  .strict() satisfies z.ZodType<VmCodexAuthLoginCancelPayload>;

export const VmCodexAuthLoginCancelledPayloadSchema = z
  .object({
    ok: z.literal(true),
    commandId: z.string().min(1),
    authProfileId: UUIDSchema,
    vmHostId: UUIDSchema,
    rootPath: z.string().min(1),
    loginId: z.string().min(1),
  })
  .strict() satisfies z.ZodType<VmCodexAuthLoginCancelledPayload>;

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

    if (
      location.kind === "local" &&
      !location.uri.startsWith("/") &&
      !location.uri.startsWith("file:///")
    ) {
      context.addIssue({
        code: "custom",
        path: ["uri"],
        message:
          "Local dataset locations must be absolute paths or file:// URIs",
      });
    }
  }) satisfies z.ZodType<VmSessionDatasetMountLocation>;

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
  .strict() satisfies z.ZodType<VmSessionDatasetMount>;

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
    pendingLogicalTurnRetry:
      VmPendingLogicalTurnRetrySchema.nullable().optional(),
    pendingLogicalTurnRetries: z
      .array(VmPendingLogicalTurnRetrySchema)
      .max(2)
      .optional(),
    datasetMounts: z.array(VmSessionDatasetMountSchema).optional(),
    previousArtifactMounts: z.array(VmPreviousArtifactMountSchema).optional(),
    reviewEvidenceMounts: z.array(VmReviewEvidenceMountSchema).optional(),
    sensitiveHostPaths: z.array(z.string().min(1)).optional(),
  })
  .strict() satisfies z.ZodType<VmSessionStartPayload>;

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
    pendingLogicalTurnRetry:
      VmPendingLogicalTurnRetrySchema.nullable().optional(),
    pendingLogicalTurnRetries: z
      .array(VmPendingLogicalTurnRetrySchema)
      .max(2)
      .optional(),
    transport: z.literal("stdio"),
    runtimeMetadata: z.record(z.string(), JsonSchema),
  })
  .strict() satisfies z.ZodType<VmSessionStartedPayload>;

export const VmCodexTextInputSchema = z
  .object({
    type: z.literal("text"),
    text: z.string(),
  })
  .strict() satisfies z.ZodType<VmCodexTextInput>;

export const VmCodexUserInputSchema =
  VmCodexTextInputSchema satisfies z.ZodType<VmCodexUserInput>;

export const VmSessionResumePayloadSchema = z
  .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    codexThreadId: z.string().min(1),
    persistExtendedHistory: z.boolean().optional(),
    overrides: z.record(z.string(), JsonSchema).optional(),
  })
  .strict() satisfies z.ZodType<VmSessionResumePayload>;

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
  .strict() satisfies z.ZodType<VmSessionPausePayload>;

export const VmSessionThreadForkPayloadSchema = z
  .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    codexThreadId: z.string().min(1),
    persistExtendedHistory: z.boolean().optional(),
    overrides: z.record(z.string(), JsonSchema).optional(),
  })
  .strict() satisfies z.ZodType<VmSessionThreadForkPayload>;

export const VmSessionTurnStartPayloadSchema = z
  .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    codexThreadId: z.string().min(1),
    input: z.array(VmCodexUserInputSchema).min(1),
    overrides: z.record(z.string(), JsonSchema).optional(),
  })
  .strict() satisfies z.ZodType<VmSessionTurnStartPayload>;

export const VmSessionTurnSteerPayloadSchema = z
  .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    codexThreadId: z.string().min(1),
    codexTurnId: z.string().min(1),
    input: z.array(VmCodexUserInputSchema).min(1),
    overrides: z.record(z.string(), JsonSchema).optional(),
  })
  .strict() satisfies z.ZodType<VmSessionTurnSteerPayload>;

export const VmSessionInterruptPayloadSchema = z
  .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    codexThreadId: z.string().min(1),
    codexTurnId: z.string().min(1).nullable().optional(),
  })
  .strict() satisfies z.ZodType<VmSessionInterruptPayload>;

export const VmSessionInjectItemsPayloadSchema = z
  .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    codexThreadId: z.string().min(1),
    items: z.array(JsonSchema),
  })
  .strict() satisfies z.ZodType<VmSessionInjectItemsPayload>;

export const VmSessionApprovalErrorSchema = z
  .object({
    code: z.number().int(),
    message: z.string().min(1),
    data: JsonSchema.optional(),
  })
  .strict() satisfies z.ZodType<VmSessionApprovalError>;

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
    if (
      (payload.result === undefined && payload.error === undefined) ||
      (payload.result !== undefined && payload.error !== undefined)
    ) {
      context.addIssue({
        code: "custom",
        path: ["result"],
        message: "Exactly one of result or error must be provided",
      });
    }
  }) satisfies z.ZodType<VmSessionApprovalRespondPayload>;

export const BrowserSessionApprovalRespondCommandDataSchema = z
  .object({
    approvalTaskId: UUIDSchema,
    status: z.string().min(1).optional(),
    result: z.record(z.string(), JsonSchema).optional(),
    error: VmSessionApprovalErrorSchema.optional(),
  })
  .strict() satisfies z.ZodType<BrowserSessionApprovalRespondCommandData>;

export const BrowserSessionTurnStartCommandDataSchema = z
  .object({
    sessionId: UUIDSchema,
    input: z.array(VmCodexUserInputSchema).min(1),
    overrides: z.record(z.string(), JsonSchema).optional(),
  })
  .strict() satisfies z.ZodType<BrowserSessionTurnStartCommandData>;

export const BrowserSessionTurnSteerCommandDataSchema = z
  .object({
    sessionId: UUIDSchema,
    input: z.array(VmCodexUserInputSchema).min(1),
    codexTurnId: z.string().min(1).optional(),
    overrides: z.record(z.string(), JsonSchema).optional(),
  })
  .strict() satisfies z.ZodType<BrowserSessionTurnSteerCommandData>;

export const BrowserSessionInterruptCommandDataSchema = z
  .object({
    sessionId: UUIDSchema,
    codexTurnId: z.string().min(1).optional(),
  })
  .strict() satisfies z.ZodType<BrowserSessionInterruptCommandData>;

export const BrowserSessionInjectItemsCommandDataSchema = z
  .object({
    sessionId: UUIDSchema,
    items: z.array(JsonSchema),
  })
  .strict() satisfies z.ZodType<BrowserSessionInjectItemsCommandData>;

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
]) satisfies z.ZodType<VmSessionReviewTarget>;

export const VmSessionReviewStartPayloadSchema = z
  .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    codexThreadId: z.string().min(1),
    target: VmSessionReviewTargetSchema,
    delivery: z.enum(["inline", "detached"]).optional(),
  })
  .strict() satisfies z.ZodType<VmSessionReviewStartPayload>;

export const BrowserSessionReviewStartCommandDataSchema = z
  .object({
    sessionId: UUIDSchema,
    target: VmSessionReviewTargetSchema,
    delivery: z.enum(["inline", "detached"]).optional(),
  })
  .strict() satisfies z.ZodType<BrowserSessionReviewStartCommandData>;

export const VmSessionTerminatePayloadSchema = z
  .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
  })
  .strict() satisfies z.ZodType<VmSessionTerminatePayload>;

export const VmWorkspaceArchivePayloadSchema = z
  .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    workspaceId: UUIDSchema.optional(),
  })
  .strict() satisfies z.ZodType<VmWorkspaceArchivePayload>;

export const VmSessionCommandAckPayloadSchema = z
  .object({
    ok: z.literal(true),
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    codexThreadId: z.string().min(1).nullable().optional(),
    codexTurnId: z.string().min(1).nullable().optional(),
    result: z.record(z.string(), JsonSchema).optional(),
  })
  .strict() satisfies z.ZodType<VmSessionCommandAckPayload>;

const AuxTerminalDimensionSchema = z.number().int().min(1).max(1000);
const AuxTerminalIdSchema = z.string().min(1);

export const VmAuxTerminalOpenPayloadSchema = z
  .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    cols: AuxTerminalDimensionSchema.optional(),
    rows: AuxTerminalDimensionSchema.optional(),
  })
  .strict() satisfies z.ZodType<VmAuxTerminalOpenPayload>;

export const VmAuxTerminalInputPayloadSchema = z
  .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    terminalId: AuxTerminalIdSchema,
    data: z.string(),
  })
  .strict() satisfies z.ZodType<VmAuxTerminalInputPayload>;

export const VmAuxTerminalResizePayloadSchema = z
  .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    terminalId: AuxTerminalIdSchema,
    cols: AuxTerminalDimensionSchema,
    rows: AuxTerminalDimensionSchema,
  })
  .strict() satisfies z.ZodType<VmAuxTerminalResizePayload>;

export const VmAuxTerminalClosePayloadSchema = z
  .object({
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    terminalId: AuxTerminalIdSchema,
  })
  .strict() satisfies z.ZodType<VmAuxTerminalClosePayload>;

export const VmAuxTerminalChunkPayloadSchema = z
  .object({
    sessionId: UUIDSchema,
    terminalId: AuxTerminalIdSchema,
    seq: z.number().int().nonnegative(),
    stream: z.enum(["stdout", "stderr"]),
    data: z.string(),
    ts: ISODateTimeSchema,
  })
  .strict() satisfies z.ZodType<VmAuxTerminalChunkPayload>;

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
  .strict() satisfies z.ZodType<VmAuxTerminalOpenedPayload>;

export const VmAuxTerminalAckPayloadSchema = z
  .object({
    ok: z.literal(true),
    commandId: z.string().min(1),
    sessionId: UUIDSchema,
    terminalId: AuxTerminalIdSchema,
    cols: AuxTerminalDimensionSchema.optional(),
    rows: AuxTerminalDimensionSchema.optional(),
  })
  .strict() satisfies z.ZodType<VmAuxTerminalAckPayload>;

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
  .strict() satisfies z.ZodType<VmAuxTerminalClosedPayload>;

export const VmAuxTerminalBacklogPayloadSchema = z
  .object({
    sessionId: UUIDSchema,
    terminalId: AuxTerminalIdSchema,
    chunks: z.array(VmAuxTerminalChunkPayloadSchema),
    closed: z.boolean(),
    exitCode: z.number().int().nullable().optional(),
    signal: z.string().nullable().optional(),
  })
  .strict() satisfies z.ZodType<VmAuxTerminalBacklogPayload>;

export const BrowserAuxTerminalOpenCommandDataSchema = z
  .object({
    sessionId: UUIDSchema,
    cols: AuxTerminalDimensionSchema.optional(),
    rows: AuxTerminalDimensionSchema.optional(),
  })
  .strict() satisfies z.ZodType<BrowserAuxTerminalOpenCommandData>;

export const BrowserAuxTerminalInputCommandDataSchema = z
  .object({
    sessionId: UUIDSchema,
    terminalId: AuxTerminalIdSchema,
    data: z.string(),
  })
  .strict() satisfies z.ZodType<BrowserAuxTerminalInputCommandData>;

export const BrowserAuxTerminalResizeCommandDataSchema = z
  .object({
    sessionId: UUIDSchema,
    terminalId: AuxTerminalIdSchema,
    cols: AuxTerminalDimensionSchema,
    rows: AuxTerminalDimensionSchema,
  })
  .strict() satisfies z.ZodType<BrowserAuxTerminalResizeCommandData>;

export const BrowserAuxTerminalCloseCommandDataSchema = z
  .object({
    sessionId: UUIDSchema,
    terminalId: AuxTerminalIdSchema,
  })
  .strict() satisfies z.ZodType<BrowserAuxTerminalCloseCommandData>;

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
      .array(
        z
          .object({
            artifactId: UUIDSchema.nullable().optional(),
            relativePath: SafeRelativePathSchema,
            checksumSha256: z.string().regex(/^[a-f0-9]{64}$/i),
            sizeBytes: ByteCountSchema.optional(),
            objectUri: z.string().min(1).nullable().optional(),
          })
          .strict(),
      )
      .optional(),
  })
  .strict() satisfies z.ZodType<ArtifactCollectPayload>;

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
  .strict() satisfies z.ZodType<CollectedArtifact>;

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
  .strict() satisfies z.ZodType<ArtifactCollectResponsePayload>;

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
  .strict() satisfies z.ZodType<VmSessionEventPayload>;

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
  .strict() satisfies z.ZodType<SessionSnapshotPayload>;

export const SessionHistoryQuerySchema = z
  .object({
    cursor: z.string().min(1).optional(),
    afterSeq: z.number().int().nonnegative().optional(),
    limit: z.number().int().positive().optional(),
    includeRawTrace: z.boolean().optional(),
  })
  .strict() satisfies z.ZodType<SessionHistoryQuery>;

export const SessionHistoryResponseSchema = z
  .object({
    events: z.array(AgentSessionEventSchema),
    lastSeq: z.number().int().nonnegative().nullable(),
    nextCursor: z.string().min(1),
  })
  .strict() satisfies z.ZodType<SessionHistoryResponse>;

export const SessionConversationHistoryQuerySchema = z
  .object({
    view: z.literal("conversation"),
    before: z.string().min(1).optional(),
    limit: z.number().int().min(1).max(100).optional(),
  })
  .strict() satisfies z.ZodType<SessionConversationHistoryQuery>;

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
  .strict() satisfies z.ZodType<SessionConversationHistoryPage>;

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
  }) satisfies z.ZodType<VmCodexAuthLoginStartCommandEnvelope>;

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
  }) satisfies z.ZodType<VmCodexAuthLoginStartedResponseEnvelope>;

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
  }) satisfies z.ZodType<VmCodexAuthLoginCompleteCommandEnvelope>;

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
  }) satisfies z.ZodType<VmCodexAuthLoginCompletedResponseEnvelope>;

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
  }) satisfies z.ZodType<VmCodexAuthLoginCancelCommandEnvelope>;

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
  }) satisfies z.ZodType<VmCodexAuthLoginCancelledResponseEnvelope>;

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
  }) satisfies z.ZodType<VmSessionStartCommandEnvelope>;

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
  }) satisfies z.ZodType<VmSessionStartedResponseEnvelope>;

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
  }) satisfies z.ZodType<VmSessionResumeCommandEnvelope>;

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
  }) satisfies z.ZodType<VmSessionPauseCommandEnvelope>;

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
  }) satisfies z.ZodType<VmSessionThreadForkCommandEnvelope>;

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
  }) satisfies z.ZodType<VmSessionTurnStartCommandEnvelope>;

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
  }) satisfies z.ZodType<VmSessionTurnSteerCommandEnvelope>;

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
  }) satisfies z.ZodType<VmSessionInjectItemsCommandEnvelope>;

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
  }) satisfies z.ZodType<VmSessionInterruptCommandEnvelope>;

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
  }) satisfies z.ZodType<VmSessionApprovalRespondCommandEnvelope>;

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
  }) satisfies z.ZodType<VmSessionReviewStartCommandEnvelope>;

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
  }) satisfies z.ZodType<VmSessionTerminateCommandEnvelope>;

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
  }) satisfies z.ZodType<VmWorkspaceArchiveCommandEnvelope>;

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
  }) satisfies z.ZodType<VmWorkspaceFileReadCommandEnvelope>;

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
  }) satisfies z.ZodType<VmWorkspaceFileReadyResponseEnvelope>;

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
  }) satisfies z.ZodType<VmDatasetPromoteCommandEnvelope>;

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
  }) satisfies z.ZodType<VmDatasetPromotedResponseEnvelope>;

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
  }) satisfies z.ZodType<VmDatasetOutputNormalizeCommandEnvelope>;

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
  }) satisfies z.ZodType<VmDatasetOutputNormalizedResponseEnvelope>;

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
  }) satisfies z.ZodType<VmDatasetValidateCommandEnvelope>;

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
  }) satisfies z.ZodType<VmDatasetValidatedResponseEnvelope>;

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
  }) satisfies z.ZodType<VmDatasetFilePreviewCommandEnvelope>;

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
  }) satisfies z.ZodType<VmDatasetFilePreviewReadyResponseEnvelope>;

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
  }) satisfies z.ZodType<VmSessionCommandAckResponseEnvelope>;

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
  }) satisfies z.ZodType<VmAuxTerminalOpenCommandEnvelope>;

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
  }) satisfies z.ZodType<VmAuxTerminalInputCommandEnvelope>;

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
  }) satisfies z.ZodType<VmAuxTerminalResizeCommandEnvelope>;

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
  }) satisfies z.ZodType<VmAuxTerminalCloseCommandEnvelope>;

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
  }) satisfies z.ZodType<VmArtifactCollectCommandEnvelope>;

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
  }) satisfies z.ZodType<VmArtifactCollectedResponseEnvelope>;

function isSafeReviewEvidencePath(value: string): boolean {
  if (
    !value.startsWith("/review-sources/experiments/") &&
    !value.startsWith("/datasets/")
  ) {
    return false;
  }
  return !value
    .split("/")
    .some(
      (segment, index) =>
        index > 0 &&
        (segment.length === 0 || segment === "." || segment === ".."),
    );
}

function isSafePathSegment(value: string): boolean {
  return /^[A-Za-z0-9._-]+$/.test(value) && value !== "." && value !== "..";
}

function isSafeDatasetContainerPath(value: string): boolean {
  if (!value.startsWith("/datasets/")) {
    return false;
  }

  return !value
    .split("/")
    .some((segment) => segment === "." || segment === "..");
}
