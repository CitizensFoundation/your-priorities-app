import { z } from "zod";
import { type ByteCount, type ISODateTime, type Json, type ScopeRef, type ScopeType, type UUID } from "./core.js";
import { type AgentSessionEvent, type Artifact } from "./execution.js";
import { type ApprovalTask } from "./review.js";
import { type AgentSessionRef } from "./session.js";
export declare const YP_LIVE_WORKFLOW_CLIENT_PROTOCOL: "yp-live-workflow.client.v1";
export declare const YP_LIVE_WORKFLOW_VM_PROTOCOL: "yp-live-workflow.vm.v1";
export type LiveWorkflowProtocol = typeof YP_LIVE_WORKFLOW_CLIENT_PROTOCOL | typeof YP_LIVE_WORKFLOW_VM_PROTOCOL;
export interface WsEnvelope<T = Record<string, Json>> {
    protocol: LiveWorkflowProtocol;
    messageType: string;
    requestId?: string;
    seq?: number;
    cursor?: string;
    ts: ISODateTime;
    data: T;
}
export declare const BrowserCommands: readonly ["subscribe", "unsubscribe", "session.turn.start", "session.turn.steer", "session.interrupt", "session.inject_items", "session.approval.respond", "session.review.start", "session.aux_terminal.open", "session.aux_terminal.input", "session.aux_terminal.resize", "session.aux_terminal.close", "review.case.claim", "review.case.comment", "review.case.vote", "review.case.resolve", "brief.mark_read", "paper.patch.accept", "paper.patch.reject", "signal.promote_to_experiment", "signal.attach_to_paper", "run.cancel", "run.pause", "run.resume"];
export type BrowserCommand = (typeof BrowserCommands)[number];
export declare const BrowserEvents: readonly ["session.snapshot", "session.event", "session.stream.delta", "session.status.changed", "session.step_boundary.created", "chief_scientist.decision.applied", "chief_scientist.decision.failed", "session.approval.pending", "session.approval.resolved", "session.aux_terminal.opened", "session.aux_terminal.chunk", "session.aux_terminal.closed", "human_case.created", "human_case.updated", "finding.created", "finding.updated", "artifact.ready", "planning_job.updated", "infographic_job.updated", "sweep.job.updated", "signal.created", "signal.updated", "paper.updated", "brief.ready", "evolution.archive.updated", "run.status.changed", "run.step.status.changed", "run.monitor.updated", "workflow.worker.updated", "vm.telemetry", "usage.updated", "live.updated", "notification"];
export type BrowserEvent = (typeof BrowserEvents)[number];
export declare const NormalizedSessionEvents: readonly ["thread.started", "thread.status.changed", "thread.closed", "turn.started", "turn.plan.updated", "turn.diff.updated", "turn.completed", "session.error", "message.delta", "message.completed", "command.output.delta", "command.terminal.input", "file.output.delta", "item.started", "item.completed", "approval.requested", "approval.resolved", "review.entered", "review.exited", "metrics.updated", "quota.updated", "usage.routing.switched", "usage.routing.unavailable", "codex.raw"];
export type NormalizedSessionEvent = (typeof NormalizedSessionEvents)[number];
export declare const VmCommands: readonly ["workflow.attach", "workflow.graph", "workflow.snapshot", "workflow.inputs", "workflow.run", "workflow.control", "workflow.models", "workflow.remove-input", "workflow.restore", "workflow.storage", "workflow.prune", "workspace.prepare", "workspace.file.materialize", "workspace.file.read", "workspace.archive", "runtime.ensure_image", "codex.auth.login.start", "codex.auth.login.complete", "codex.auth.login.cancel", "session.start", "session.pause", "session.resume", "session.thread.fork", "session.turn.start", "session.turn.steer", "session.inject_items", "session.interrupt", "session.approval.respond", "session.review.start", "session.aux_terminal.open", "session.aux_terminal.input", "session.aux_terminal.resize", "session.aux_terminal.close", "session.terminate", "artifact.collect", "dataset.promote", "dataset.output.normalize", "dataset.validate", "dataset.file.preview", "import.start"];
export type VmCommand = (typeof VmCommands)[number];
export declare const VmSessionControlCommands: readonly ["workspace.archive", "session.pause", "session.resume", "session.thread.fork", "session.turn.start", "session.turn.steer", "session.inject_items", "session.interrupt", "session.approval.respond", "session.review.start", "session.terminate"];
export type VmSessionControlCommand = (typeof VmSessionControlCommands)[number];
export declare const VmEvents: readonly ["vm.register", "vm.heartbeat", "vm.telemetry", "workspace.prepared", "workspace.file.ready", "codex.auth.login.started", "codex.auth.login.completed", "codex.auth.login.cancelled", "codex.auth.material.updated", "session.started", "session.status.changed", "session.event", "session.approval.pending", "session.approval.resolved", "session.aux_terminal.opened", "session.aux_terminal.chunk", "session.aux_terminal.closed", "artifact.ready", "dataset.promoted", "dataset.output.normalized", "dataset.validated", "dataset.file.preview.ready", "import.progress", "vm.error"];
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
export declare const VmGpuTelemetryStatuses: readonly ["ok", "unavailable", "error"];
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
export type WorkspaceMaterializationFile = {
    path: string;
    content: string;
    mode?: number | null;
} | {
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
    messageType: "vm.register" | "vm.heartbeat" | "vm.telemetry" | "session.event" | "codex.auth.material.updated";
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
export type VmSessionReviewTarget = {
    type: "uncommittedChanges";
} | {
    type: "baseBranch";
    branch: string;
} | {
    type: "commit";
    sha: string;
    title?: string | null;
} | {
    type: "custom";
    instructions: string;
};
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
export type CodexRetryClassification = "server_overloaded" | "usage_limit" | "transient_connection" | "internal_server_error";
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
export declare const CodexRetryClassificationSchema: z.ZodEnum<{
    server_overloaded: "server_overloaded";
    usage_limit: "usage_limit";
    transient_connection: "transient_connection";
    internal_server_error: "internal_server_error";
}>;
export declare const CodexHarnessRetryMetadataSchema: z.ZodObject<{
    owner: z.ZodLiteral<"yp-live-workflow">;
    scheduled: z.ZodBoolean;
    classification: z.ZodEnum<{
        server_overloaded: "server_overloaded";
        usage_limit: "usage_limit";
        transient_connection: "transient_connection";
        internal_server_error: "internal_server_error";
    }>;
    attempt: z.ZodNumber;
    nominalDelayMs: z.ZodNumber;
    delayMs: z.ZodNumber;
    nextRetryAt: z.ZodString;
}, z.core.$strict>;
export declare const VmPendingLogicalTurnRetrySchema: z.ZodObject<{
    method: z.ZodEnum<{
        "turn/start": "turn/start";
        "review/start": "review/start";
    }>;
    params: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    metadata: z.ZodObject<{
        owner: z.ZodLiteral<"yp-live-workflow">;
        scheduled: z.ZodBoolean;
        classification: z.ZodEnum<{
            server_overloaded: "server_overloaded";
            usage_limit: "usage_limit";
            transient_connection: "transient_connection";
            internal_server_error: "internal_server_error";
        }>;
        attempt: z.ZodNumber;
        nominalDelayMs: z.ZodNumber;
        delayMs: z.ZodNumber;
        nextRetryAt: z.ZodString;
    }, z.core.$strict>;
    turnId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
/**
 * True while either Codex itself or the LiveWorkflow harness owns recovery for an
 * otherwise terminal-looking app-server event.
 */
export declare function codexSessionEventWillRetry(payload: Record<string, Json>): boolean;
/**
 * Classifies failures that are safe for the automated harness to replay. The
 * structured Codex error code is authoritative; text matching is retained for
 * older app-server versions and provider-specific errors.
 */
export declare function codexRetryClassification(payload: Record<string, Json>): CodexRetryClassification | null;
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
export declare const SessionConversationEventTypes: readonly ["codex.input.started", "codex.input.steered", "message.completed"];
export type SessionConversationEventType = (typeof SessionConversationEventTypes)[number];
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
export type VmSessionControlCommandEnvelope = VmWorkspaceArchiveCommandEnvelope | VmSessionPauseCommandEnvelope | VmSessionResumeCommandEnvelope | VmSessionThreadForkCommandEnvelope | VmSessionTurnStartCommandEnvelope | VmSessionTurnSteerCommandEnvelope | VmSessionInjectItemsCommandEnvelope | VmSessionInterruptCommandEnvelope | VmSessionApprovalRespondCommandEnvelope | VmSessionReviewStartCommandEnvelope | VmSessionTerminateCommandEnvelope;
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
export declare const ClientMessageTypes: readonly ["subscribe", "unsubscribe", "session.turn.start", "session.turn.steer", "session.interrupt", "session.inject_items", "session.approval.respond", "session.review.start", "session.aux_terminal.open", "session.aux_terminal.input", "session.aux_terminal.resize", "session.aux_terminal.close", "review.case.claim", "review.case.comment", "review.case.vote", "review.case.resolve", "brief.mark_read", "paper.patch.accept", "paper.patch.reject", "signal.promote_to_experiment", "signal.attach_to_paper", "run.cancel", "run.pause", "run.resume", "session.snapshot", "session.event", "session.stream.delta", "session.status.changed", "session.step_boundary.created", "chief_scientist.decision.applied", "chief_scientist.decision.failed", "session.approval.pending", "session.approval.resolved", "session.aux_terminal.opened", "session.aux_terminal.chunk", "session.aux_terminal.closed", "human_case.created", "human_case.updated", "finding.created", "finding.updated", "artifact.ready", "planning_job.updated", "infographic_job.updated", "sweep.job.updated", "signal.created", "signal.updated", "paper.updated", "brief.ready", "evolution.archive.updated", "run.status.changed", "run.step.status.changed", "run.monitor.updated", "workflow.worker.updated", "vm.telemetry", "usage.updated", "live.updated", "notification"];
export type ClientMessageType = (typeof ClientMessageTypes)[number];
export declare const VmMessageTypes: readonly ["workflow.attach", "workflow.graph", "workflow.snapshot", "workflow.inputs", "workflow.run", "workflow.control", "workflow.models", "workflow.remove-input", "workflow.restore", "workflow.storage", "workflow.prune", "workspace.prepare", "workspace.file.materialize", "workspace.file.read", "workspace.archive", "runtime.ensure_image", "codex.auth.login.start", "codex.auth.login.complete", "codex.auth.login.cancel", "session.start", "session.pause", "session.resume", "session.thread.fork", "session.turn.start", "session.turn.steer", "session.inject_items", "session.interrupt", "session.approval.respond", "session.review.start", "session.aux_terminal.open", "session.aux_terminal.input", "session.aux_terminal.resize", "session.aux_terminal.close", "session.terminate", "artifact.collect", "dataset.promote", "dataset.output.normalize", "dataset.validate", "dataset.file.preview", "import.start", "vm.register", "vm.heartbeat", "vm.telemetry", "workspace.prepared", "workspace.file.ready", "codex.auth.login.started", "codex.auth.login.completed", "codex.auth.login.cancelled", "codex.auth.material.updated", "session.started", "session.status.changed", "session.event", "session.approval.pending", "session.approval.resolved", "session.aux_terminal.opened", "session.aux_terminal.chunk", "session.aux_terminal.closed", "artifact.ready", "dataset.promoted", "dataset.output.normalized", "dataset.validated", "dataset.file.preview.ready", "import.progress", "vm.error"];
export type VmMessageType = (typeof VmMessageTypes)[number];
export declare const WorkflowWorkersTopic: "workflow:workers";
export declare const ReviewJobTopicScopeType: "review_job";
export declare const PlanningJobTopicScopeType: "planning_job";
export declare const InfographicJobTopicScopeType: "infographic_job";
export declare const RunMonitorTopicPrefix: "monitor:run";
export type RealtimeTopic = `${ScopeType}:${UUID}` | `${typeof ReviewJobTopicScopeType}:${UUID}` | `${typeof PlanningJobTopicScopeType}:${UUID}` | `${typeof InfographicJobTopicScopeType}:${UUID}` | `${typeof RunMonitorTopicPrefix}:${UUID}` | typeof WorkflowWorkersTopic | `brief:${ScopeType}:${UUID}`;
export type ParsedRealtimeTopic = {
    type: "scope";
    scope: ScopeRef;
} | {
    type: "review_job";
    reviewJobId: UUID;
} | {
    type: "planning_job";
    planningJobId: UUID;
} | {
    type: "infographic_job";
    infographicJobId: UUID;
} | {
    type: "run_monitor";
    runId: UUID;
} | {
    type: "workflow_workers";
} | {
    type: "brief";
    scope: ScopeRef;
};
export declare function makeScopeTopic(scope: ScopeRef): RealtimeTopic;
export declare function makeReviewJobTopic(reviewJobId: UUID): RealtimeTopic;
export declare function makePlanningJobTopic(planningJobId: UUID): RealtimeTopic;
export declare function makeInfographicJobTopic(infographicJobId: UUID): RealtimeTopic;
export declare function makeRunMonitorTopic(runId: UUID): RealtimeTopic;
export declare function makeBriefTopic(scopeType: ScopeType, scopeId: UUID): RealtimeTopic;
export declare function parseRealtimeTopic(topic: string): ParsedRealtimeTopic | null;
export declare function normalizeRealtimeTopic(topic: string): RealtimeTopic | null;
export declare function isScopeType(value: string): value is ScopeType;
export declare function isBrowserCommand(value: string): value is BrowserCommand;
export declare function isBrowserEvent(value: string): value is BrowserEvent;
export declare function isClientMessageType(value: string): value is ClientMessageType;
export declare function isVmCommand(value: string): value is VmCommand;
export declare function isVmEvent(value: string): value is VmEvent;
export declare function isVmMessageType(value: string): value is VmMessageType;
export declare const WsEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodEnum<{
        "yp-live-workflow.client.v1": "yp-live-workflow.client.v1";
        "yp-live-workflow.vm.v1": "yp-live-workflow.vm.v1";
    }>;
    messageType: z.ZodString;
    requestId: z.ZodOptional<z.ZodString>;
    seq: z.ZodOptional<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
    ts: z.ZodString;
    data: z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>;
}, z.core.$strict>;
export declare const ClientWsEnvelopeSchema: z.ZodObject<{
    requestId: z.ZodOptional<z.ZodString>;
    seq: z.ZodOptional<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
    ts: z.ZodString;
    data: z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>;
    protocol: z.ZodLiteral<"yp-live-workflow.client.v1">;
    messageType: z.ZodString & z.ZodType<"subscribe" | "unsubscribe" | "human_case.created" | "session.turn.start" | "session.turn.steer" | "session.interrupt" | "session.inject_items" | "session.approval.respond" | "session.review.start" | "session.aux_terminal.open" | "session.aux_terminal.input" | "session.aux_terminal.resize" | "session.aux_terminal.close" | "review.case.claim" | "review.case.comment" | "review.case.vote" | "review.case.resolve" | "brief.mark_read" | "paper.patch.accept" | "paper.patch.reject" | "signal.promote_to_experiment" | "signal.attach_to_paper" | "run.cancel" | "run.pause" | "run.resume" | "session.snapshot" | "session.event" | "session.stream.delta" | "session.status.changed" | "session.step_boundary.created" | "chief_scientist.decision.applied" | "chief_scientist.decision.failed" | "session.approval.pending" | "session.approval.resolved" | "session.aux_terminal.opened" | "session.aux_terminal.chunk" | "session.aux_terminal.closed" | "human_case.updated" | "finding.created" | "finding.updated" | "artifact.ready" | "planning_job.updated" | "infographic_job.updated" | "sweep.job.updated" | "signal.created" | "signal.updated" | "paper.updated" | "brief.ready" | "evolution.archive.updated" | "run.status.changed" | "run.step.status.changed" | "run.monitor.updated" | "workflow.worker.updated" | "vm.telemetry" | "usage.updated" | "live.updated" | "notification", string, z.core.$ZodTypeInternals<"subscribe" | "unsubscribe" | "human_case.created" | "session.turn.start" | "session.turn.steer" | "session.interrupt" | "session.inject_items" | "session.approval.respond" | "session.review.start" | "session.aux_terminal.open" | "session.aux_terminal.input" | "session.aux_terminal.resize" | "session.aux_terminal.close" | "review.case.claim" | "review.case.comment" | "review.case.vote" | "review.case.resolve" | "brief.mark_read" | "paper.patch.accept" | "paper.patch.reject" | "signal.promote_to_experiment" | "signal.attach_to_paper" | "run.cancel" | "run.pause" | "run.resume" | "session.snapshot" | "session.event" | "session.stream.delta" | "session.status.changed" | "session.step_boundary.created" | "chief_scientist.decision.applied" | "chief_scientist.decision.failed" | "session.approval.pending" | "session.approval.resolved" | "session.aux_terminal.opened" | "session.aux_terminal.chunk" | "session.aux_terminal.closed" | "human_case.updated" | "finding.created" | "finding.updated" | "artifact.ready" | "planning_job.updated" | "infographic_job.updated" | "sweep.job.updated" | "signal.created" | "signal.updated" | "paper.updated" | "brief.ready" | "evolution.archive.updated" | "run.status.changed" | "run.step.status.changed" | "run.monitor.updated" | "workflow.worker.updated" | "vm.telemetry" | "usage.updated" | "live.updated" | "notification", string>>;
}, z.core.$strict>;
export declare const VmWsEnvelopeSchema: z.ZodObject<{
    requestId: z.ZodOptional<z.ZodString>;
    seq: z.ZodOptional<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
    ts: z.ZodString;
    data: z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>;
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodString & z.ZodType<"session.turn.start" | "session.turn.steer" | "session.interrupt" | "session.inject_items" | "session.approval.respond" | "session.review.start" | "session.aux_terminal.open" | "session.aux_terminal.input" | "session.aux_terminal.resize" | "session.aux_terminal.close" | "session.event" | "session.status.changed" | "session.approval.pending" | "session.approval.resolved" | "session.aux_terminal.opened" | "session.aux_terminal.chunk" | "session.aux_terminal.closed" | "artifact.ready" | "vm.telemetry" | "workflow.attach" | "workflow.graph" | "workflow.snapshot" | "workflow.inputs" | "workflow.run" | "workflow.control" | "workflow.models" | "workflow.remove-input" | "workflow.restore" | "workflow.storage" | "workflow.prune" | "workspace.prepare" | "workspace.file.materialize" | "workspace.file.read" | "workspace.archive" | "runtime.ensure_image" | "codex.auth.login.start" | "codex.auth.login.complete" | "codex.auth.login.cancel" | "session.start" | "session.pause" | "session.resume" | "session.thread.fork" | "session.terminate" | "artifact.collect" | "dataset.promote" | "dataset.output.normalize" | "dataset.validate" | "dataset.file.preview" | "import.start" | "vm.register" | "vm.heartbeat" | "workspace.prepared" | "workspace.file.ready" | "codex.auth.login.started" | "codex.auth.login.completed" | "codex.auth.login.cancelled" | "codex.auth.material.updated" | "session.started" | "dataset.promoted" | "dataset.output.normalized" | "dataset.validated" | "dataset.file.preview.ready" | "import.progress" | "vm.error", string, z.core.$ZodTypeInternals<"session.turn.start" | "session.turn.steer" | "session.interrupt" | "session.inject_items" | "session.approval.respond" | "session.review.start" | "session.aux_terminal.open" | "session.aux_terminal.input" | "session.aux_terminal.resize" | "session.aux_terminal.close" | "session.event" | "session.status.changed" | "session.approval.pending" | "session.approval.resolved" | "session.aux_terminal.opened" | "session.aux_terminal.chunk" | "session.aux_terminal.closed" | "artifact.ready" | "vm.telemetry" | "workflow.attach" | "workflow.graph" | "workflow.snapshot" | "workflow.inputs" | "workflow.run" | "workflow.control" | "workflow.models" | "workflow.remove-input" | "workflow.restore" | "workflow.storage" | "workflow.prune" | "workspace.prepare" | "workspace.file.materialize" | "workspace.file.read" | "workspace.archive" | "runtime.ensure_image" | "codex.auth.login.start" | "codex.auth.login.complete" | "codex.auth.login.cancel" | "session.start" | "session.pause" | "session.resume" | "session.thread.fork" | "session.terminate" | "artifact.collect" | "dataset.promote" | "dataset.output.normalize" | "dataset.validate" | "dataset.file.preview" | "import.start" | "vm.register" | "vm.heartbeat" | "workspace.prepared" | "workspace.file.ready" | "codex.auth.login.started" | "codex.auth.login.completed" | "codex.auth.login.cancelled" | "codex.auth.material.updated" | "session.started" | "dataset.promoted" | "dataset.output.normalized" | "dataset.validated" | "dataset.file.preview.ready" | "import.progress" | "vm.error", string>>;
}, z.core.$strict>;
export declare const BrowserSubscribeCommandDataSchema: z.ZodObject<{
    topic: z.ZodOptional<z.ZodString>;
    topics: z.ZodOptional<z.ZodArray<z.ZodString>>;
    cursors: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    includeArtifacts: z.ZodOptional<z.ZodBoolean>;
    snapshot: z.ZodOptional<z.ZodBoolean>;
    replayLimit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export declare const BrowserUnsubscribeCommandDataSchema: z.ZodObject<{
    topic: z.ZodOptional<z.ZodString>;
    topics: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
export declare const VmHostVolumeSnapshotSchema: z.ZodObject<{
    mountPath: z.ZodString;
    role: z.ZodString;
    totalBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
    availableBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const VmHostSystemSnapshotSchema: z.ZodObject<{
    hostname: z.ZodString;
    platform: z.ZodString;
    arch: z.ZodString;
    cpuCount: z.ZodNumber;
    cpuModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    loadAverage: z.ZodArray<z.ZodNumber>;
    uptimeSeconds: z.ZodNumber;
    totalMemoryBytes: z.ZodNumber;
    freeMemoryBytes: z.ZodNumber;
}, z.core.$strict>;
export declare const VmRegisterPayloadSchema: z.ZodObject<{
    vmHostId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    capabilities: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    volumes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        mountPath: z.ZodString;
        role: z.ZodString;
        totalBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
        availableBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>>>;
    system: z.ZodOptional<z.ZodObject<{
        hostname: z.ZodString;
        platform: z.ZodString;
        arch: z.ZodString;
        cpuCount: z.ZodNumber;
        cpuModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        loadAverage: z.ZodArray<z.ZodNumber>;
        uptimeSeconds: z.ZodNumber;
        totalMemoryBytes: z.ZodNumber;
        freeMemoryBytes: z.ZodNumber;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const VmHeartbeatPayloadSchema: z.ZodObject<{
    vmHostId: z.ZodString;
    status: z.ZodOptional<z.ZodString>;
    capabilities: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    system: z.ZodOptional<z.ZodObject<{
        hostname: z.ZodString;
        platform: z.ZodString;
        arch: z.ZodString;
        cpuCount: z.ZodNumber;
        cpuModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        loadAverage: z.ZodArray<z.ZodNumber>;
        uptimeSeconds: z.ZodNumber;
        totalMemoryBytes: z.ZodNumber;
        freeMemoryBytes: z.ZodNumber;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const VmContainerWritableMountSnapshotSchema: z.ZodObject<{
    containerPath: z.ZodString;
    role: z.ZodString;
    readOnly: z.ZodOptional<z.ZodLiteral<false>>;
    usedBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
    totalBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
    availableBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
    truncated: z.ZodOptional<z.ZodBoolean>;
    error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const VmContainerDatasetMountSnapshotSchema: z.ZodObject<{
    containerPath: z.ZodString;
    datasetVersionId: z.ZodString;
    name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    versionLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    readOnly: z.ZodLiteral<true>;
    sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
}, z.core.$strict>;
export declare const VmContainerStorageSnapshotSchema: z.ZodObject<{
    writableMounts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        containerPath: z.ZodString;
        role: z.ZodString;
        readOnly: z.ZodOptional<z.ZodLiteral<false>>;
        usedBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
        totalBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
        availableBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
        truncated: z.ZodOptional<z.ZodBoolean>;
        error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>>>;
    datasetMounts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        containerPath: z.ZodString;
        datasetVersionId: z.ZodString;
        name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        versionLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        readOnly: z.ZodLiteral<true>;
        sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export declare const VmContainerStatsSnapshotSchema: z.ZodObject<{
    containerName: z.ZodString;
    sessionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    runId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    cpuPercent: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    memoryBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    memoryLimitBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    memoryPercent: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    storage: z.ZodOptional<z.ZodObject<{
        writableMounts: z.ZodOptional<z.ZodArray<z.ZodObject<{
            containerPath: z.ZodString;
            role: z.ZodString;
            readOnly: z.ZodOptional<z.ZodLiteral<false>>;
            usedBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
            totalBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
            availableBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
            truncated: z.ZodOptional<z.ZodBoolean>;
            error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strict>>>;
        datasetMounts: z.ZodOptional<z.ZodArray<z.ZodObject<{
            containerPath: z.ZodString;
            datasetVersionId: z.ZodString;
            name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            versionLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            readOnly: z.ZodLiteral<true>;
            sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
        }, z.core.$strict>>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const VmTelemetryPayloadSchema: z.ZodObject<{
    vmHostId: z.ZodString;
    telemetry: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    volumes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        mountPath: z.ZodString;
        role: z.ZodString;
        totalBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
        availableBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>>>;
    capabilities: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    system: z.ZodOptional<z.ZodObject<{
        hostname: z.ZodString;
        platform: z.ZodString;
        arch: z.ZodString;
        cpuCount: z.ZodNumber;
        cpuModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        loadAverage: z.ZodArray<z.ZodNumber>;
        uptimeSeconds: z.ZodNumber;
        totalMemoryBytes: z.ZodNumber;
        freeMemoryBytes: z.ZodNumber;
    }, z.core.$strict>>;
    containers: z.ZodOptional<z.ZodArray<z.ZodObject<{
        containerName: z.ZodString;
        sessionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        runId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        cpuPercent: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        memoryBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        memoryLimitBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        memoryPercent: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        storage: z.ZodOptional<z.ZodObject<{
            writableMounts: z.ZodOptional<z.ZodArray<z.ZodObject<{
                containerPath: z.ZodString;
                role: z.ZodString;
                readOnly: z.ZodOptional<z.ZodLiteral<false>>;
                usedBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
                totalBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
                availableBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
                truncated: z.ZodOptional<z.ZodBoolean>;
                error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strict>>>;
            datasetMounts: z.ZodOptional<z.ZodArray<z.ZodObject<{
                containerPath: z.ZodString;
                datasetVersionId: z.ZodString;
                name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                versionLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                readOnly: z.ZodLiteral<true>;
                sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
            }, z.core.$strict>>>;
        }, z.core.$strict>>;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export declare const WorkspacePrepareAuditContextSchema: z.ZodObject<{
    commandId: z.ZodString;
    requestedByUserId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    requestedByType: z.ZodOptional<z.ZodEnum<{
        user: "user";
        system: "system";
    }>>;
    groupId: z.ZodString;
    experimentId: z.ZodString;
    workspaceId: z.ZodString;
    vmHostId: z.ZodString;
    requestedAt: z.ZodString;
    runId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    runStepId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const WorkspaceMaterializationFileSchema: z.ZodUnion<readonly [z.ZodObject<{
    path: z.ZodString;
    content: z.ZodString;
    mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strict>, z.ZodObject<{
    path: z.ZodString;
    contentBase64: z.ZodString;
    encoding: z.ZodLiteral<"base64">;
    mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strict>]>;
export declare const WorkspaceMaterializationRuleSchema: z.ZodObject<{
    name: z.ZodString;
    content: z.ZodString;
}, z.core.$strict>;
export declare const WorkspaceMaterializationSkillSchema: z.ZodObject<{
    name: z.ZodString;
    skillMd: z.ZodString;
    files: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        path: z.ZodString;
        content: z.ZodString;
        mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strict>, z.ZodObject<{
        path: z.ZodString;
        contentBase64: z.ZodString;
        encoding: z.ZodLiteral<"base64">;
        mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strict>]>>>;
}, z.core.$strict>;
export declare const WorkspaceMaterializationSchema: z.ZodObject<{
    agentsMd: z.ZodOptional<z.ZodString>;
    codexHomeAgentsOverrideMd: z.ZodOptional<z.ZodString>;
    codexConfigToml: z.ZodOptional<z.ZodString>;
    rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        content: z.ZodString;
    }, z.core.$strict>>>;
    skills: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        skillMd: z.ZodString;
        files: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
            path: z.ZodString;
            content: z.ZodString;
            mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strict>, z.ZodObject<{
            path: z.ZodString;
            contentBase64: z.ZodString;
            encoding: z.ZodLiteral<"base64">;
            mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strict>]>>>;
    }, z.core.$strict>>>;
    fullPlanMd: z.ZodOptional<z.ZodString>;
    researchPlanMd: z.ZodOptional<z.ZodString>;
    files: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        path: z.ZodString;
        content: z.ZodString;
        mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strict>, z.ZodObject<{
        path: z.ZodString;
        contentBase64: z.ZodString;
        encoding: z.ZodLiteral<"base64">;
        mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strict>]>>>;
    cacheFiles: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        path: z.ZodString;
        content: z.ZodString;
        mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strict>, z.ZodObject<{
        path: z.ZodString;
        contentBase64: z.ZodString;
        encoding: z.ZodLiteral<"base64">;
        mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strict>]>>>;
}, z.core.$strict>;
export declare const WorkspaceGitHubFolderSchema: z.ZodObject<{
    repositoryFullName: z.ZodString;
    cloneUrl: z.ZodString;
    branchName: z.ZodString;
    repoDirectoryName: z.ZodString;
    folderPath: z.ZodString;
    commitAuthorName: z.ZodString;
    commitAuthorEmail: z.ZodString;
    htmlUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    accessToken: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tokenUsername: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const WorkspacePreparePayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    auditContext: z.ZodObject<{
        commandId: z.ZodString;
        requestedByUserId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        requestedByType: z.ZodOptional<z.ZodEnum<{
            user: "user";
            system: "system";
        }>>;
        groupId: z.ZodString;
        experimentId: z.ZodString;
        workspaceId: z.ZodString;
        vmHostId: z.ZodString;
        requestedAt: z.ZodString;
        runId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        runStepId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>;
    workspaceId: z.ZodString;
    vmHostId: z.ZodString;
    rootPath: z.ZodString;
    datasetOutputPath: z.ZodOptional<z.ZodString>;
    repoUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    repoRef: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    githubFolder: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        repositoryFullName: z.ZodString;
        cloneUrl: z.ZodString;
        branchName: z.ZodString;
        repoDirectoryName: z.ZodString;
        folderPath: z.ZodString;
        commitAuthorName: z.ZodString;
        commitAuthorEmail: z.ZodString;
        htmlUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        accessToken: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        tokenUsername: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>>>;
    materialization: z.ZodOptional<z.ZodObject<{
        agentsMd: z.ZodOptional<z.ZodString>;
        codexHomeAgentsOverrideMd: z.ZodOptional<z.ZodString>;
        codexConfigToml: z.ZodOptional<z.ZodString>;
        rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            content: z.ZodString;
        }, z.core.$strict>>>;
        skills: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            skillMd: z.ZodString;
            files: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
                path: z.ZodString;
                content: z.ZodString;
                mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strict>, z.ZodObject<{
                path: z.ZodString;
                contentBase64: z.ZodString;
                encoding: z.ZodLiteral<"base64">;
                mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strict>]>>>;
        }, z.core.$strict>>>;
        fullPlanMd: z.ZodOptional<z.ZodString>;
        researchPlanMd: z.ZodOptional<z.ZodString>;
        files: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
            path: z.ZodString;
            content: z.ZodString;
            mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strict>, z.ZodObject<{
            path: z.ZodString;
            contentBase64: z.ZodString;
            encoding: z.ZodLiteral<"base64">;
            mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strict>]>>>;
        cacheFiles: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
            path: z.ZodString;
            content: z.ZodString;
            mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strict>, z.ZodObject<{
            path: z.ZodString;
            contentBase64: z.ZodString;
            encoding: z.ZodLiteral<"base64">;
            mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strict>]>>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const WorkspacePreparedLayoutSchema: z.ZodObject<{
    rootPath: z.ZodString;
    workspacePath: z.ZodString;
    codexHomePath: z.ZodString;
    artifactsPath: z.ZodString;
    cachePath: z.ZodString;
    datasetOutputPath: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const WorkspaceRepoPrepareResultSchema: z.ZodObject<{
    status: z.ZodEnum<{
        empty: "empty";
        cloned: "cloned";
        updated: "updated";
    }>;
    repoUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    repoRef: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checkedOutRef: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const WorkspaceGitHubFolderPrepareResultSchema: z.ZodObject<{
    status: z.ZodEnum<{
        cloned: "cloned";
        updated: "updated";
    }>;
    repositoryFullName: z.ZodString;
    branchName: z.ZodString;
    repoDirectoryName: z.ZodString;
    folderPath: z.ZodString;
    workspacePath: z.ZodString;
    credentialHelperPath: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checkedOutRef: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checkedOutCommitSha: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const WorkspacePreparedPayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    auditContext: z.ZodObject<{
        commandId: z.ZodString;
        requestedByUserId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        requestedByType: z.ZodOptional<z.ZodEnum<{
            user: "user";
            system: "system";
        }>>;
        groupId: z.ZodString;
        experimentId: z.ZodString;
        workspaceId: z.ZodString;
        vmHostId: z.ZodString;
        requestedAt: z.ZodString;
        runId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        runStepId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>;
    workspaceId: z.ZodString;
    vmHostId: z.ZodString;
    rootPath: z.ZodString;
    preparedAt: z.ZodString;
    layout: z.ZodObject<{
        rootPath: z.ZodString;
        workspacePath: z.ZodString;
        codexHomePath: z.ZodString;
        artifactsPath: z.ZodString;
        cachePath: z.ZodString;
        datasetOutputPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    repo: z.ZodObject<{
        status: z.ZodEnum<{
            empty: "empty";
            cloned: "cloned";
            updated: "updated";
        }>;
        repoUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        repoRef: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        checkedOutRef: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>;
    githubFolder: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        status: z.ZodEnum<{
            cloned: "cloned";
            updated: "updated";
        }>;
        repositoryFullName: z.ZodString;
        branchName: z.ZodString;
        repoDirectoryName: z.ZodString;
        folderPath: z.ZodString;
        workspacePath: z.ZodString;
        credentialHelperPath: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        checkedOutRef: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        checkedOutCommitSha: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>>>;
    materializedFiles: z.ZodArray<z.ZodString>;
}, z.core.$strict>;
export declare const VmPreviousArtifactMountSchema: z.ZodObject<{
    sourcePath: z.ZodString;
    containerPath: z.ZodString;
    readOnly: z.ZodLiteral<true>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const VmReviewEvidenceMountSchema: z.ZodObject<{
    sourcePath: z.ZodString;
    containerPath: z.ZodString;
    readOnly: z.ZodLiteral<true>;
    evidenceType: z.ZodEnum<{
        workspace: "workspace";
        artifacts: "artifacts";
        cache: "cache";
        "dataset-output": "dataset-output";
    }>;
    experimentId: z.ZodString;
    forbiddenRelativePaths: z.ZodOptional<z.ZodArray<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const WorkspaceFileMaterializePayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    workspaceId: z.ZodString;
    vmHostId: z.ZodString;
    rootPath: z.ZodString;
    target: z.ZodOptional<z.ZodEnum<{
        workspace: "workspace";
        artifacts: "artifacts";
    }>>;
    path: z.ZodString;
    mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    contentType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sizeBytes: z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>;
    checksumSha256: z.ZodString;
}, z.core.$strict>;
export declare const WorkspaceFileMaterializedPayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    workspaceId: z.ZodString;
    vmHostId: z.ZodString;
    rootPath: z.ZodString;
    target: z.ZodOptional<z.ZodEnum<{
        workspace: "workspace";
        artifacts: "artifacts";
    }>>;
    path: z.ZodString;
    contentChecksumSha256: z.ZodString;
    sizeBytes: z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>;
    materializedAt: z.ZodString;
}, z.core.$strict>;
export declare const WorkspaceFileReadPayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    workspaceId: z.ZodString;
    path: z.ZodString;
    scope: z.ZodOptional<z.ZodEnum<{
        workspace: "workspace";
        review_evidence: "review_evidence";
    }>>;
    maxBytes: z.ZodOptional<z.ZodNumber>;
    checksumOnly: z.ZodOptional<z.ZodBoolean>;
    statOnly: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const WorkspaceFileReadResponsePayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    workspaceId: z.ZodString;
    path: z.ZodString;
    scope: z.ZodOptional<z.ZodEnum<{
        workspace: "workspace";
        review_evidence: "review_evidence";
    }>>;
    content: z.ZodString;
    contentChecksumSha256: z.ZodString;
    sizeBytes: z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>;
    maxBytes: z.ZodNumber;
    checksumOnly: z.ZodOptional<z.ZodBoolean>;
    statOnly: z.ZodOptional<z.ZodBoolean>;
    entryType: z.ZodOptional<z.ZodEnum<{
        file: "file";
        directory: "directory";
    }>>;
    truncated: z.ZodBoolean;
    readAt: z.ZodString;
}, z.core.$strict>;
export declare const VmDatasetPromotePayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    workspaceId: z.ZodString;
    vmHostId: z.ZodString;
    datasetVersionId: z.ZodString;
    sourcePath: z.ZodString;
    allowedSourceRootPath: z.ZodString;
    manifestChecksumSha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const VmDatasetPromotedPayloadSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    commandId: z.ZodString;
    workspaceId: z.ZodString;
    vmHostId: z.ZodString;
    datasetVersionId: z.ZodString;
    hotPath: z.ZodString;
    uri: z.ZodString;
    sourcePath: z.ZodString;
    promotedAt: z.ZodString;
    sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
    mountedFiles: z.ZodOptional<z.ZodArray<z.ZodString>>;
    mountedFileCount: z.ZodOptional<z.ZodNumber>;
    mountedFilesTruncated: z.ZodOptional<z.ZodBoolean>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const VmDatasetOutputNormalizePayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    workspaceId: z.ZodString;
    vmHostId: z.ZodString;
    sourcePath: z.ZodString;
    allowedSourceRootPath: z.ZodString;
    sessionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const VmDatasetOutputNormalizedPayloadSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    commandId: z.ZodString;
    workspaceId: z.ZodString;
    vmHostId: z.ZodString;
    sourcePath: z.ZodString;
    normalizedAt: z.ZodString;
    mode: z.ZodEnum<{
        host: "host";
        container_fallback: "container_fallback";
    }>;
    fileCount: z.ZodNumber;
    directoryCount: z.ZodNumber;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const VmDatasetValidationAssetSchema: z.ZodObject<{
    relativePath: z.ZodString;
    status: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
    checksumSha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const VmDatasetValidationFileSchema: z.ZodObject<{
    relativePath: z.ZodString;
    sizeBytes: z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>;
    checksumSha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    format: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    compression: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const VmDatasetValidatePayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    workspaceId: z.ZodString;
    vmHostId: z.ZodString;
    sourcePath: z.ZodString;
    allowedSourceRootPath: z.ZodString;
    expectedFiles: z.ZodOptional<z.ZodArray<z.ZodString>>;
    assets: z.ZodOptional<z.ZodArray<z.ZodObject<{
        relativePath: z.ZodString;
        status: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
        checksumSha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const VmDatasetValidatedPayloadSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    commandId: z.ZodString;
    workspaceId: z.ZodString;
    vmHostId: z.ZodString;
    sourcePath: z.ZodString;
    uri: z.ZodString;
    validatedAt: z.ZodString;
    sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
    mountedFiles: z.ZodOptional<z.ZodArray<z.ZodString>>;
    mountedFileCount: z.ZodOptional<z.ZodNumber>;
    mountedFilesTruncated: z.ZodOptional<z.ZodBoolean>;
    files: z.ZodOptional<z.ZodArray<z.ZodObject<{
        relativePath: z.ZodString;
        sizeBytes: z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>;
        checksumSha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        format: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        compression: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>>>;
    missingExpectedFiles: z.ZodOptional<z.ZodArray<z.ZodString>>;
    missingAssetFiles: z.ZodOptional<z.ZodArray<z.ZodString>>;
    checksumFailures: z.ZodOptional<z.ZodArray<z.ZodString>>;
    sizeMismatches: z.ZodOptional<z.ZodArray<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const VmDatasetFilePreviewPayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    vmHostId: z.ZodString;
    datasetVersionId: z.ZodString;
    datasetLocationId: z.ZodString;
    locationUri: z.ZodString;
    path: z.ZodString;
    maxBytes: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export declare const VmDatasetFilePreviewReadyPayloadSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    commandId: z.ZodString;
    vmHostId: z.ZodString;
    datasetVersionId: z.ZodString;
    datasetLocationId: z.ZodString;
    locationUri: z.ZodString;
    path: z.ZodString;
    content: z.ZodString;
    contentChecksumSha256: z.ZodString;
    sizeBytes: z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>;
    maxBytes: z.ZodNumber;
    truncated: z.ZodBoolean;
    readAt: z.ZodString;
}, z.core.$strict>;
export declare const VmAgentAckPayloadSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    vmHostId: z.ZodString;
    messageType: z.ZodEnum<{
        "session.event": "session.event";
        "vm.telemetry": "vm.telemetry";
        "vm.register": "vm.register";
        "vm.heartbeat": "vm.heartbeat";
        "codex.auth.material.updated": "codex.auth.material.updated";
    }>;
}, z.core.$strict>;
export declare const VmBrokerHelloPayloadSchema: z.ZodObject<{
    vmHostId: z.ZodString;
    connectionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    capabilities: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const VmBrokerHelloAckPayloadSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    vmHostId: z.ZodString;
    connectionId: z.ZodString;
}, z.core.$strict>;
export declare const VmBrokerCommandErrorPayloadSchema: z.ZodObject<{
    ok: z.ZodLiteral<false>;
    commandId: z.ZodString;
    messageType: z.ZodEnum<{
        "session.turn.start": "session.turn.start";
        "session.turn.steer": "session.turn.steer";
        "session.interrupt": "session.interrupt";
        "session.inject_items": "session.inject_items";
        "session.approval.respond": "session.approval.respond";
        "session.review.start": "session.review.start";
        "session.aux_terminal.open": "session.aux_terminal.open";
        "session.aux_terminal.input": "session.aux_terminal.input";
        "session.aux_terminal.resize": "session.aux_terminal.resize";
        "session.aux_terminal.close": "session.aux_terminal.close";
        "workflow.attach": "workflow.attach";
        "workflow.graph": "workflow.graph";
        "workflow.snapshot": "workflow.snapshot";
        "workflow.inputs": "workflow.inputs";
        "workflow.run": "workflow.run";
        "workflow.control": "workflow.control";
        "workflow.models": "workflow.models";
        "workflow.remove-input": "workflow.remove-input";
        "workflow.restore": "workflow.restore";
        "workflow.storage": "workflow.storage";
        "workflow.prune": "workflow.prune";
        "workspace.prepare": "workspace.prepare";
        "workspace.file.materialize": "workspace.file.materialize";
        "workspace.file.read": "workspace.file.read";
        "workspace.archive": "workspace.archive";
        "runtime.ensure_image": "runtime.ensure_image";
        "codex.auth.login.start": "codex.auth.login.start";
        "codex.auth.login.complete": "codex.auth.login.complete";
        "codex.auth.login.cancel": "codex.auth.login.cancel";
        "session.start": "session.start";
        "session.pause": "session.pause";
        "session.resume": "session.resume";
        "session.thread.fork": "session.thread.fork";
        "session.terminate": "session.terminate";
        "artifact.collect": "artifact.collect";
        "dataset.promote": "dataset.promote";
        "dataset.output.normalize": "dataset.output.normalize";
        "dataset.validate": "dataset.validate";
        "dataset.file.preview": "dataset.file.preview";
        "import.start": "import.start";
    }>;
    sessionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    code: z.ZodString;
    message: z.ZodString;
    details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const VmBrokerHelloEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"vm.broker.hello">;
    ts: z.ZodString;
    data: z.ZodObject<{
        vmHostId: z.ZodString;
        connectionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        capabilities: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmBrokerHelloAckEnvelopeSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"vm.broker.hello.ack">;
    ts: z.ZodString;
    data: z.ZodObject<{
        ok: z.ZodLiteral<true>;
        vmHostId: z.ZodString;
        connectionId: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmBrokerCommandErrorEnvelopeSchema: z.ZodObject<{
    ok: z.ZodLiteral<false>;
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"vm.command.error">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        ok: z.ZodLiteral<false>;
        commandId: z.ZodString;
        messageType: z.ZodEnum<{
            "session.turn.start": "session.turn.start";
            "session.turn.steer": "session.turn.steer";
            "session.interrupt": "session.interrupt";
            "session.inject_items": "session.inject_items";
            "session.approval.respond": "session.approval.respond";
            "session.review.start": "session.review.start";
            "session.aux_terminal.open": "session.aux_terminal.open";
            "session.aux_terminal.input": "session.aux_terminal.input";
            "session.aux_terminal.resize": "session.aux_terminal.resize";
            "session.aux_terminal.close": "session.aux_terminal.close";
            "workflow.attach": "workflow.attach";
            "workflow.graph": "workflow.graph";
            "workflow.snapshot": "workflow.snapshot";
            "workflow.inputs": "workflow.inputs";
            "workflow.run": "workflow.run";
            "workflow.control": "workflow.control";
            "workflow.models": "workflow.models";
            "workflow.remove-input": "workflow.remove-input";
            "workflow.restore": "workflow.restore";
            "workflow.storage": "workflow.storage";
            "workflow.prune": "workflow.prune";
            "workspace.prepare": "workspace.prepare";
            "workspace.file.materialize": "workspace.file.materialize";
            "workspace.file.read": "workspace.file.read";
            "workspace.archive": "workspace.archive";
            "runtime.ensure_image": "runtime.ensure_image";
            "codex.auth.login.start": "codex.auth.login.start";
            "codex.auth.login.complete": "codex.auth.login.complete";
            "codex.auth.login.cancel": "codex.auth.login.cancel";
            "session.start": "session.start";
            "session.pause": "session.pause";
            "session.resume": "session.resume";
            "session.thread.fork": "session.thread.fork";
            "session.terminate": "session.terminate";
            "artifact.collect": "artifact.collect";
            "dataset.promote": "dataset.promote";
            "dataset.output.normalize": "dataset.output.normalize";
            "dataset.validate": "dataset.validate";
            "dataset.file.preview": "dataset.file.preview";
            "import.start": "import.start";
        }>;
        sessionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmWorkspacePrepareCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"workspace.prepare">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        auditContext: z.ZodObject<{
            commandId: z.ZodString;
            requestedByUserId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            requestedByType: z.ZodOptional<z.ZodEnum<{
                user: "user";
                system: "system";
            }>>;
            groupId: z.ZodString;
            experimentId: z.ZodString;
            workspaceId: z.ZodString;
            vmHostId: z.ZodString;
            requestedAt: z.ZodString;
            runId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            runStepId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strict>;
        workspaceId: z.ZodString;
        vmHostId: z.ZodString;
        rootPath: z.ZodString;
        datasetOutputPath: z.ZodOptional<z.ZodString>;
        repoUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        repoRef: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        githubFolder: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            repositoryFullName: z.ZodString;
            cloneUrl: z.ZodString;
            branchName: z.ZodString;
            repoDirectoryName: z.ZodString;
            folderPath: z.ZodString;
            commitAuthorName: z.ZodString;
            commitAuthorEmail: z.ZodString;
            htmlUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            accessToken: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            tokenUsername: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strict>>>;
        materialization: z.ZodOptional<z.ZodObject<{
            agentsMd: z.ZodOptional<z.ZodString>;
            codexHomeAgentsOverrideMd: z.ZodOptional<z.ZodString>;
            codexConfigToml: z.ZodOptional<z.ZodString>;
            rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                content: z.ZodString;
            }, z.core.$strict>>>;
            skills: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                skillMd: z.ZodString;
                files: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
                    path: z.ZodString;
                    content: z.ZodString;
                    mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strict>, z.ZodObject<{
                    path: z.ZodString;
                    contentBase64: z.ZodString;
                    encoding: z.ZodLiteral<"base64">;
                    mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strict>]>>>;
            }, z.core.$strict>>>;
            fullPlanMd: z.ZodOptional<z.ZodString>;
            researchPlanMd: z.ZodOptional<z.ZodString>;
            files: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
                path: z.ZodString;
                content: z.ZodString;
                mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strict>, z.ZodObject<{
                path: z.ZodString;
                contentBase64: z.ZodString;
                encoding: z.ZodLiteral<"base64">;
                mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strict>]>>>;
            cacheFiles: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
                path: z.ZodString;
                content: z.ZodString;
                mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strict>, z.ZodObject<{
                path: z.ZodString;
                contentBase64: z.ZodString;
                encoding: z.ZodLiteral<"base64">;
                mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strict>]>>>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmWorkspacePreparedResponseEnvelopeSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"workspace.prepared">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        auditContext: z.ZodObject<{
            commandId: z.ZodString;
            requestedByUserId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            requestedByType: z.ZodOptional<z.ZodEnum<{
                user: "user";
                system: "system";
            }>>;
            groupId: z.ZodString;
            experimentId: z.ZodString;
            workspaceId: z.ZodString;
            vmHostId: z.ZodString;
            requestedAt: z.ZodString;
            runId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            runStepId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strict>;
        workspaceId: z.ZodString;
        vmHostId: z.ZodString;
        rootPath: z.ZodString;
        preparedAt: z.ZodString;
        layout: z.ZodObject<{
            rootPath: z.ZodString;
            workspacePath: z.ZodString;
            codexHomePath: z.ZodString;
            artifactsPath: z.ZodString;
            cachePath: z.ZodString;
            datasetOutputPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>;
        repo: z.ZodObject<{
            status: z.ZodEnum<{
                empty: "empty";
                cloned: "cloned";
                updated: "updated";
            }>;
            repoUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            repoRef: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            checkedOutRef: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strict>;
        githubFolder: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            status: z.ZodEnum<{
                cloned: "cloned";
                updated: "updated";
            }>;
            repositoryFullName: z.ZodString;
            branchName: z.ZodString;
            repoDirectoryName: z.ZodString;
            folderPath: z.ZodString;
            workspacePath: z.ZodString;
            credentialHelperPath: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            checkedOutRef: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            checkedOutCommitSha: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strict>>>;
        materializedFiles: z.ZodArray<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmSessionStartAuthSchema: z.ZodObject<{
    provider: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    authMode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    secretRef: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const CodexAuthMaterialFileSchema: z.ZodObject<{
    path: z.ZodString;
    dataBase64: z.ZodString;
    mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strict>;
export declare const CodexAuthMaterialSchema: z.ZodObject<{
    format: z.ZodLiteral<"codex_home_files_v1">;
    files: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        dataBase64: z.ZodString;
        mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strict>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const VmCodexAuthMaterialUpdatedPayloadSchema: z.ZodObject<{
    vmHostId: z.ZodString;
    sessionId: z.ZodString;
    authProfileId: z.ZodString;
    baseFingerprintSha256: z.ZodString;
    currentFingerprintSha256: z.ZodString;
    authMaterial: z.ZodObject<{
        format: z.ZodLiteral<"codex_home_files_v1">;
        files: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            dataBase64: z.ZodString;
            mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strict>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>;
    account: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
    source: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updatedAt: z.ZodString;
}, z.core.$strict>;
export declare const VmCodexAuthLoginStartPayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    authProfileId: z.ZodString;
    vmHostId: z.ZodString;
    rootPath: z.ZodString;
    loginType: z.ZodLiteral<"chatgptDeviceCode">;
}, z.core.$strict>;
export declare const VmCodexAuthLoginStartedPayloadSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    commandId: z.ZodString;
    authProfileId: z.ZodString;
    vmHostId: z.ZodString;
    rootPath: z.ZodString;
    loginType: z.ZodLiteral<"chatgptDeviceCode">;
    loginId: z.ZodString;
    verificationUrl: z.ZodString;
    userCode: z.ZodString;
}, z.core.$strict>;
export declare const VmCodexAuthLoginCompletePayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    authProfileId: z.ZodString;
    vmHostId: z.ZodString;
    rootPath: z.ZodString;
    loginId: z.ZodString;
    timeoutMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strict>;
export declare const VmCodexAuthLoginCompletedPayloadSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    commandId: z.ZodString;
    authProfileId: z.ZodString;
    vmHostId: z.ZodString;
    rootPath: z.ZodString;
    loginId: z.ZodString;
    account: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    authMaterial: z.ZodObject<{
        format: z.ZodLiteral<"codex_home_files_v1">;
        files: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            dataBase64: z.ZodString;
            mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strict>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmCodexAuthLoginCancelPayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    authProfileId: z.ZodString;
    vmHostId: z.ZodString;
    rootPath: z.ZodString;
    loginId: z.ZodString;
}, z.core.$strict>;
export declare const VmCodexAuthLoginCancelledPayloadSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    commandId: z.ZodString;
    authProfileId: z.ZodString;
    vmHostId: z.ZodString;
    rootPath: z.ZodString;
    loginId: z.ZodString;
}, z.core.$strict>;
export declare const VmSessionDatasetMountLocationSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        local: "local";
        gcs: "gcs";
    }>;
    tier: z.ZodEnum<{
        cold: "cold";
        hot: "hot";
    }>;
    uri: z.ZodString;
    storageClass: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const VmSessionDatasetMountSchema: z.ZodObject<{
    datasetVersionId: z.ZodString;
    name: z.ZodString;
    versionLabel: z.ZodString;
    containerPath: z.ZodString;
    access: z.ZodLiteral<"read_only">;
    required: z.ZodBoolean;
    locations: z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<{
            local: "local";
            gcs: "gcs";
        }>;
        tier: z.ZodEnum<{
            cold: "cold";
            hot: "hot";
        }>;
        uri: z.ZodString;
        storageClass: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>>;
    manifestChecksumSha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const VmSessionStartPayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    runId: z.ZodString;
    runStepId: z.ZodString;
    nodeId: z.ZodString;
    workspaceId: z.ZodString;
    vmHostId: z.ZodString;
    runtimeProfileId: z.ZodString;
    authProfileId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    layout: z.ZodObject<{
        rootPath: z.ZodString;
        workspacePath: z.ZodString;
        codexHomePath: z.ZodString;
        artifactsPath: z.ZodString;
        cachePath: z.ZodString;
        datasetOutputPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    runtimeSnapshot: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    inputPayload: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    auth: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        provider: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        authMode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        secretRef: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>>>;
    codexThreadId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    persistExtendedHistory: z.ZodOptional<z.ZodBoolean>;
    initialTurnMode: z.ZodOptional<z.ZodEnum<{
        start: "start";
        deferred: "deferred";
    }>>;
    pendingLogicalTurnRetry: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        method: z.ZodEnum<{
            "turn/start": "turn/start";
            "review/start": "review/start";
        }>;
        params: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        metadata: z.ZodObject<{
            owner: z.ZodLiteral<"yp-live-workflow">;
            scheduled: z.ZodBoolean;
            classification: z.ZodEnum<{
                server_overloaded: "server_overloaded";
                usage_limit: "usage_limit";
                transient_connection: "transient_connection";
                internal_server_error: "internal_server_error";
            }>;
            attempt: z.ZodNumber;
            nominalDelayMs: z.ZodNumber;
            delayMs: z.ZodNumber;
            nextRetryAt: z.ZodString;
        }, z.core.$strict>;
        turnId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>;
    pendingLogicalTurnRetries: z.ZodOptional<z.ZodArray<z.ZodObject<{
        method: z.ZodEnum<{
            "turn/start": "turn/start";
            "review/start": "review/start";
        }>;
        params: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        metadata: z.ZodObject<{
            owner: z.ZodLiteral<"yp-live-workflow">;
            scheduled: z.ZodBoolean;
            classification: z.ZodEnum<{
                server_overloaded: "server_overloaded";
                usage_limit: "usage_limit";
                transient_connection: "transient_connection";
                internal_server_error: "internal_server_error";
            }>;
            attempt: z.ZodNumber;
            nominalDelayMs: z.ZodNumber;
            delayMs: z.ZodNumber;
            nextRetryAt: z.ZodString;
        }, z.core.$strict>;
        turnId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>;
    datasetMounts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        datasetVersionId: z.ZodString;
        name: z.ZodString;
        versionLabel: z.ZodString;
        containerPath: z.ZodString;
        access: z.ZodLiteral<"read_only">;
        required: z.ZodBoolean;
        locations: z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<{
                local: "local";
                gcs: "gcs";
            }>;
            tier: z.ZodEnum<{
                cold: "cold";
                hot: "hot";
            }>;
            uri: z.ZodString;
            storageClass: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        }, z.core.$strict>>;
        manifestChecksumSha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>>>;
    previousArtifactMounts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        sourcePath: z.ZodString;
        containerPath: z.ZodString;
        readOnly: z.ZodLiteral<true>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>>>;
    reviewEvidenceMounts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        sourcePath: z.ZodString;
        containerPath: z.ZodString;
        readOnly: z.ZodLiteral<true>;
        evidenceType: z.ZodEnum<{
            workspace: "workspace";
            artifacts: "artifacts";
            cache: "cache";
            "dataset-output": "dataset-output";
        }>;
        experimentId: z.ZodString;
        forbiddenRelativePaths: z.ZodOptional<z.ZodArray<z.ZodString>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>>>;
    sensitiveHostPaths: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
export declare const VmSessionStartedPayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    workspaceId: z.ZodString;
    vmHostId: z.ZodString;
    codexThreadId: z.ZodString;
    codexTurnId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    vmEventStreamId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    vmEventSeqBoundary: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    pendingLogicalTurnRetry: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        method: z.ZodEnum<{
            "turn/start": "turn/start";
            "review/start": "review/start";
        }>;
        params: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        metadata: z.ZodObject<{
            owner: z.ZodLiteral<"yp-live-workflow">;
            scheduled: z.ZodBoolean;
            classification: z.ZodEnum<{
                server_overloaded: "server_overloaded";
                usage_limit: "usage_limit";
                transient_connection: "transient_connection";
                internal_server_error: "internal_server_error";
            }>;
            attempt: z.ZodNumber;
            nominalDelayMs: z.ZodNumber;
            delayMs: z.ZodNumber;
            nextRetryAt: z.ZodString;
        }, z.core.$strict>;
        turnId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>;
    pendingLogicalTurnRetries: z.ZodOptional<z.ZodArray<z.ZodObject<{
        method: z.ZodEnum<{
            "turn/start": "turn/start";
            "review/start": "review/start";
        }>;
        params: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        metadata: z.ZodObject<{
            owner: z.ZodLiteral<"yp-live-workflow">;
            scheduled: z.ZodBoolean;
            classification: z.ZodEnum<{
                server_overloaded: "server_overloaded";
                usage_limit: "usage_limit";
                transient_connection: "transient_connection";
                internal_server_error: "internal_server_error";
            }>;
            attempt: z.ZodNumber;
            nominalDelayMs: z.ZodNumber;
            delayMs: z.ZodNumber;
            nextRetryAt: z.ZodString;
        }, z.core.$strict>;
        turnId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>;
    transport: z.ZodLiteral<"stdio">;
    runtimeMetadata: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
}, z.core.$strict>;
export declare const VmCodexTextInputSchema: z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
}, z.core.$strict>;
export declare const VmCodexUserInputSchema: z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
}, z.core.$strict>;
export declare const VmSessionResumePayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    codexThreadId: z.ZodString;
    persistExtendedHistory: z.ZodOptional<z.ZodBoolean>;
    overrides: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const VmSessionPausePayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    codexThreadId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    codexTurnId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    interruptActiveTurn: z.ZodOptional<z.ZodBoolean>;
    keepWarm: z.ZodOptional<z.ZodBoolean>;
    reason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const VmSessionThreadForkPayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    codexThreadId: z.ZodString;
    persistExtendedHistory: z.ZodOptional<z.ZodBoolean>;
    overrides: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const VmSessionTurnStartPayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    codexThreadId: z.ZodString;
    input: z.ZodArray<z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.core.$strict>>;
    overrides: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const VmSessionTurnSteerPayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    codexThreadId: z.ZodString;
    codexTurnId: z.ZodString;
    input: z.ZodArray<z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.core.$strict>>;
    overrides: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const VmSessionInterruptPayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    codexThreadId: z.ZodString;
    codexTurnId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const VmSessionInjectItemsPayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    codexThreadId: z.ZodString;
    items: z.ZodArray<z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
}, z.core.$strict>;
export declare const VmSessionApprovalErrorSchema: z.ZodObject<{
    code: z.ZodNumber;
    message: z.ZodString;
    data: z.ZodOptional<z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
}, z.core.$strict>;
export declare const VmSessionApprovalRespondPayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    requestId: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    result: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodNumber;
        message: z.ZodString;
        data: z.ZodOptional<z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const BrowserSessionApprovalRespondCommandDataSchema: z.ZodObject<{
    approvalTaskId: z.ZodString;
    status: z.ZodOptional<z.ZodString>;
    result: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodNumber;
        message: z.ZodString;
        data: z.ZodOptional<z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const BrowserSessionTurnStartCommandDataSchema: z.ZodObject<{
    sessionId: z.ZodString;
    input: z.ZodArray<z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.core.$strict>>;
    overrides: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const BrowserSessionTurnSteerCommandDataSchema: z.ZodObject<{
    sessionId: z.ZodString;
    input: z.ZodArray<z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.core.$strict>>;
    codexTurnId: z.ZodOptional<z.ZodString>;
    overrides: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const BrowserSessionInterruptCommandDataSchema: z.ZodObject<{
    sessionId: z.ZodString;
    codexTurnId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const BrowserSessionInjectItemsCommandDataSchema: z.ZodObject<{
    sessionId: z.ZodString;
    items: z.ZodArray<z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
}, z.core.$strict>;
export declare const VmSessionReviewTargetSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"uncommittedChanges">;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"baseBranch">;
    branch: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"commit">;
    sha: z.ZodString;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"custom">;
    instructions: z.ZodString;
}, z.core.$strict>], "type">;
export declare const VmSessionReviewStartPayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    codexThreadId: z.ZodString;
    target: z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"uncommittedChanges">;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"baseBranch">;
        branch: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"commit">;
        sha: z.ZodString;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"custom">;
        instructions: z.ZodString;
    }, z.core.$strict>], "type">;
    delivery: z.ZodOptional<z.ZodEnum<{
        inline: "inline";
        detached: "detached";
    }>>;
}, z.core.$strict>;
export declare const BrowserSessionReviewStartCommandDataSchema: z.ZodObject<{
    sessionId: z.ZodString;
    target: z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"uncommittedChanges">;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"baseBranch">;
        branch: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"commit">;
        sha: z.ZodString;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"custom">;
        instructions: z.ZodString;
    }, z.core.$strict>], "type">;
    delivery: z.ZodOptional<z.ZodEnum<{
        inline: "inline";
        detached: "detached";
    }>>;
}, z.core.$strict>;
export declare const VmSessionTerminatePayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
}, z.core.$strict>;
export declare const VmWorkspaceArchivePayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    workspaceId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const VmSessionCommandAckPayloadSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    commandId: z.ZodString;
    sessionId: z.ZodString;
    codexThreadId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    codexTurnId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    result: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const VmAuxTerminalOpenPayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    cols: z.ZodOptional<z.ZodNumber>;
    rows: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export declare const VmAuxTerminalInputPayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    terminalId: z.ZodString;
    data: z.ZodString;
}, z.core.$strict>;
export declare const VmAuxTerminalResizePayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    terminalId: z.ZodString;
    cols: z.ZodNumber;
    rows: z.ZodNumber;
}, z.core.$strict>;
export declare const VmAuxTerminalClosePayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    terminalId: z.ZodString;
}, z.core.$strict>;
export declare const VmAuxTerminalChunkPayloadSchema: z.ZodObject<{
    sessionId: z.ZodString;
    terminalId: z.ZodString;
    seq: z.ZodNumber;
    stream: z.ZodEnum<{
        stdout: "stdout";
        stderr: "stderr";
    }>;
    data: z.ZodString;
    ts: z.ZodString;
}, z.core.$strict>;
export declare const VmAuxTerminalOpenedPayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    terminalId: z.ZodString;
    runtime: z.ZodOptional<z.ZodEnum<{
        host: "host";
        container: "container";
    }>>;
    cwd: z.ZodString;
    shell: z.ZodString;
    pid: z.ZodNumber;
    openedAt: z.ZodString;
    cols: z.ZodNumber;
    rows: z.ZodNumber;
    backlog: z.ZodArray<z.ZodObject<{
        sessionId: z.ZodString;
        terminalId: z.ZodString;
        seq: z.ZodNumber;
        stream: z.ZodEnum<{
            stdout: "stdout";
            stderr: "stderr";
        }>;
        data: z.ZodString;
        ts: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const VmAuxTerminalAckPayloadSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    commandId: z.ZodString;
    sessionId: z.ZodString;
    terminalId: z.ZodString;
    cols: z.ZodOptional<z.ZodNumber>;
    rows: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export declare const VmAuxTerminalClosedPayloadSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    commandId: z.ZodString;
    sessionId: z.ZodString;
    terminalId: z.ZodString;
    closed: z.ZodBoolean;
    exitCode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    signal: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const VmAuxTerminalBacklogPayloadSchema: z.ZodObject<{
    sessionId: z.ZodString;
    terminalId: z.ZodString;
    chunks: z.ZodArray<z.ZodObject<{
        sessionId: z.ZodString;
        terminalId: z.ZodString;
        seq: z.ZodNumber;
        stream: z.ZodEnum<{
            stdout: "stdout";
            stderr: "stderr";
        }>;
        data: z.ZodString;
        ts: z.ZodString;
    }, z.core.$strict>>;
    closed: z.ZodBoolean;
    exitCode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    signal: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const BrowserAuxTerminalOpenCommandDataSchema: z.ZodObject<{
    sessionId: z.ZodString;
    cols: z.ZodOptional<z.ZodNumber>;
    rows: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export declare const BrowserAuxTerminalInputCommandDataSchema: z.ZodObject<{
    sessionId: z.ZodString;
    terminalId: z.ZodString;
    data: z.ZodString;
}, z.core.$strict>;
export declare const BrowserAuxTerminalResizeCommandDataSchema: z.ZodObject<{
    sessionId: z.ZodString;
    terminalId: z.ZodString;
    cols: z.ZodNumber;
    rows: z.ZodNumber;
}, z.core.$strict>;
export declare const BrowserAuxTerminalCloseCommandDataSchema: z.ZodObject<{
    sessionId: z.ZodString;
    terminalId: z.ZodString;
}, z.core.$strict>;
export declare const ArtifactCollectPayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    runId: z.ZodString;
    runStepId: z.ZodString;
    workspaceId: z.ZodString;
    vmHostId: z.ZodString;
    artifactsPath: z.ZodString;
    includeGlobs: z.ZodOptional<z.ZodArray<z.ZodString>>;
    excludeGlobs: z.ZodOptional<z.ZodArray<z.ZodString>>;
    upload: z.ZodOptional<z.ZodBoolean>;
    knownArtifacts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        artifactId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        relativePath: z.ZodString;
        checksumSha256: z.ZodString;
        sizeBytes: z.ZodOptional<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>;
        objectUri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export declare const CollectedArtifactSchema: z.ZodObject<{
    artifactId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    relativePath: z.ZodString;
    localPath: z.ZodString;
    localUri: z.ZodString;
    objectUri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    kind: z.ZodString;
    contentType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sizeBytes: z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>;
    checksumSha256: z.ZodString;
    collectedAt: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const ArtifactCollectResponsePayloadSchema: z.ZodObject<{
    commandId: z.ZodString;
    sessionId: z.ZodString;
    runId: z.ZodString;
    runStepId: z.ZodString;
    workspaceId: z.ZodString;
    vmHostId: z.ZodString;
    artifactsPath: z.ZodString;
    uploadEnabled: z.ZodBoolean;
    collectedAt: z.ZodString;
    artifacts: z.ZodArray<z.ZodObject<{
        artifactId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        relativePath: z.ZodString;
        localPath: z.ZodString;
        localUri: z.ZodString;
        objectUri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        kind: z.ZodString;
        contentType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        sizeBytes: z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>;
        checksumSha256: z.ZodString;
        collectedAt: z.ZodString;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const VmSessionEventPayloadSchema: z.ZodObject<{
    seq: z.ZodNumber;
    vmEventStreamId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sessionId: z.ZodString;
    workspaceId: z.ZodString;
    vmHostId: z.ZodString;
    eventType: z.ZodEnum<{
        "thread.started": "thread.started";
        "thread.status.changed": "thread.status.changed";
        "thread.closed": "thread.closed";
        "turn.started": "turn.started";
        "turn.plan.updated": "turn.plan.updated";
        "turn.diff.updated": "turn.diff.updated";
        "turn.completed": "turn.completed";
        "session.error": "session.error";
        "message.delta": "message.delta";
        "message.completed": "message.completed";
        "command.output.delta": "command.output.delta";
        "command.terminal.input": "command.terminal.input";
        "file.output.delta": "file.output.delta";
        "item.started": "item.started";
        "item.completed": "item.completed";
        "approval.requested": "approval.requested";
        "approval.resolved": "approval.resolved";
        "review.entered": "review.entered";
        "review.exited": "review.exited";
        "metrics.updated": "metrics.updated";
        "quota.updated": "quota.updated";
        "usage.routing.switched": "usage.routing.switched";
        "usage.routing.unavailable": "usage.routing.unavailable";
        "codex.raw": "codex.raw";
    }>;
    codexThreadId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    codexTurnId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    itemId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    payload: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    rawPayload: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
}, z.core.$strict>;
export declare const SessionSnapshotPayloadSchema: z.ZodObject<{
    session: z.ZodObject<{
        id: z.ZodString;
        runId: z.ZodString;
        runStepId: z.ZodString;
        kind: z.ZodEnum<{
            codex_app_server: "codex_app_server";
        }>;
        status: z.ZodEnum<{
            active: "active";
            failed: "failed";
            completed: "completed";
            paused: "paused";
            archived: "archived";
            starting: "starting";
            waiting_on_review: "waiting_on_review";
            waiting_on_human: "waiting_on_human";
            interrupted: "interrupted";
        }>;
        vmHostId: z.ZodString;
        workspaceId: z.ZodString;
        threadId: z.ZodOptional<z.ZodString>;
        activeTurnId: z.ZodOptional<z.ZodString>;
        turnStartClaim: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            actorType: z.ZodEnum<{
                user: "user";
                system: "system";
                chief_scientist: "chief_scientist";
            }>;
            claimedAt: z.ZodString;
            commandId: z.ZodString;
            source: z.ZodString;
        }, z.core.$strict>>>;
        turnStartOwner: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            actorType: z.ZodEnum<{
                user: "user";
                system: "system";
                chief_scientist: "chief_scientist";
            }>;
            claimedAt: z.ZodString;
            commandId: z.ZodString;
            source: z.ZodString;
        }, z.core.$strict>>>;
        runtimeSnapshot: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
        startedAt: z.ZodString;
        endedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        updatedAt: z.ZodString;
    }, z.core.$strict>;
    lastSeq: z.ZodNullable<z.ZodNumber>;
    cursor: z.ZodString;
    generatedAt: z.ZodString;
    events: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sessionId: z.ZodString;
        seq: z.ZodNumber;
        eventType: z.ZodString;
        eventTs: z.ZodString;
        turnId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        itemId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        vmHostId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        vmEventStreamId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        vmSeq: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        vmTransport: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        vmBrokerConnectionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        vmSequenceStatus: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            duplicate: "duplicate";
            ok: "ok";
            gap: "gap";
            regression: "regression";
        }>>>;
        payload: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        rawPayload: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strict>>>;
    pendingApprovals: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sessionId: z.ZodString;
        requestId: z.ZodString;
        kind: z.ZodString;
        status: z.ZodString;
        policyScope: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        payload: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        resolvedByType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        resolvedById: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strict>>>;
    artifacts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        scope: z.ZodObject<{
            type: z.ZodEnum<{
                user: "user";
                domain: "domain";
                community: "community";
                group: "group";
                run: "run";
                signal: "signal";
                session: "session";
                experiment: "experiment";
                run_step: "run_step";
                boundary: "boundary";
                artifact: "artifact";
                dataset: "dataset";
                finding: "finding";
                paper: "paper";
                knowledge_source: "knowledge_source";
                sweep_job: "sweep_job";
                knowledge_document: "knowledge_document";
                knowledge_document_chunk: "knowledge_document_chunk";
                knowledge_signal: "knowledge_signal";
                science_agent_run: "science_agent_run";
                project_corpus: "project_corpus";
                hypothesis: "hypothesis";
                research_embedding: "research_embedding";
                embedding_job: "embedding_job";
                morning_brief: "morning_brief";
                dynamic_paper: "dynamic_paper";
                dynamic_paper_revision: "dynamic_paper_revision";
                dynamic_paper_section: "dynamic_paper_section";
                dynamic_paper_claim: "dynamic_paper_claim";
                dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
                dynamic_paper_update: "dynamic_paper_update";
                evolution_program: "evolution_program";
                evolution_round: "evolution_round";
                evolution_candidate: "evolution_candidate";
                evolution_evaluation: "evolution_evaluation";
                evolution_archive_cell: "evolution_archive_cell";
                review_case: "review_case";
                vm: "vm";
            }>;
            id: z.ZodString;
        }, z.core.$strict>;
        kind: z.ZodString;
        path: z.ZodString;
        contentType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
        checksumSha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        metadata: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export declare const SessionHistoryQuerySchema: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodString>;
    afterSeq: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
    includeRawTrace: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const SessionHistoryResponseSchema: z.ZodObject<{
    events: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sessionId: z.ZodString;
        seq: z.ZodNumber;
        eventType: z.ZodString;
        eventTs: z.ZodString;
        turnId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        itemId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        vmHostId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        vmEventStreamId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        vmSeq: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        vmTransport: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        vmBrokerConnectionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        vmSequenceStatus: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            duplicate: "duplicate";
            ok: "ok";
            gap: "gap";
            regression: "regression";
        }>>>;
        payload: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        rawPayload: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strict>>;
    lastSeq: z.ZodNullable<z.ZodNumber>;
    nextCursor: z.ZodString;
}, z.core.$strict>;
export declare const SessionConversationHistoryQuerySchema: z.ZodObject<{
    view: z.ZodLiteral<"conversation">;
    before: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export declare const SessionConversationHistoryPageSchema: z.ZodObject<{
    events: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sessionId: z.ZodString;
        seq: z.ZodNumber;
        eventType: z.ZodString;
        eventTs: z.ZodString;
        turnId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        itemId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        vmHostId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        vmEventStreamId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        vmSeq: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        vmTransport: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        vmBrokerConnectionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        vmSequenceStatus: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            duplicate: "duplicate";
            ok: "ok";
            gap: "gap";
            regression: "regression";
        }>>>;
        payload: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        rawPayload: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strict>>;
    olderCursor: z.ZodNullable<z.ZodString>;
    hasOlder: z.ZodBoolean;
}, z.core.$strict>;
export declare const VmCodexAuthLoginStartCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"codex.auth.login.start">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        authProfileId: z.ZodString;
        vmHostId: z.ZodString;
        rootPath: z.ZodString;
        loginType: z.ZodLiteral<"chatgptDeviceCode">;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmCodexAuthLoginStartedResponseEnvelopeSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"codex.auth.login.started">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        ok: z.ZodLiteral<true>;
        commandId: z.ZodString;
        authProfileId: z.ZodString;
        vmHostId: z.ZodString;
        rootPath: z.ZodString;
        loginType: z.ZodLiteral<"chatgptDeviceCode">;
        loginId: z.ZodString;
        verificationUrl: z.ZodString;
        userCode: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmCodexAuthLoginCompleteCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"codex.auth.login.complete">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        authProfileId: z.ZodString;
        vmHostId: z.ZodString;
        rootPath: z.ZodString;
        loginId: z.ZodString;
        timeoutMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmCodexAuthLoginCompletedResponseEnvelopeSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"codex.auth.login.completed">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        ok: z.ZodLiteral<true>;
        commandId: z.ZodString;
        authProfileId: z.ZodString;
        vmHostId: z.ZodString;
        rootPath: z.ZodString;
        loginId: z.ZodString;
        account: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        authMaterial: z.ZodObject<{
            format: z.ZodLiteral<"codex_home_files_v1">;
            files: z.ZodArray<z.ZodObject<{
                path: z.ZodString;
                dataBase64: z.ZodString;
                mode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strict>>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        }, z.core.$strict>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmCodexAuthLoginCancelCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"codex.auth.login.cancel">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        authProfileId: z.ZodString;
        vmHostId: z.ZodString;
        rootPath: z.ZodString;
        loginId: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmCodexAuthLoginCancelledResponseEnvelopeSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"codex.auth.login.cancelled">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        ok: z.ZodLiteral<true>;
        commandId: z.ZodString;
        authProfileId: z.ZodString;
        vmHostId: z.ZodString;
        rootPath: z.ZodString;
        loginId: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmSessionStartCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"session.start">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
        runId: z.ZodString;
        runStepId: z.ZodString;
        nodeId: z.ZodString;
        workspaceId: z.ZodString;
        vmHostId: z.ZodString;
        runtimeProfileId: z.ZodString;
        authProfileId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        layout: z.ZodObject<{
            rootPath: z.ZodString;
            workspacePath: z.ZodString;
            codexHomePath: z.ZodString;
            artifactsPath: z.ZodString;
            cachePath: z.ZodString;
            datasetOutputPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>;
        runtimeSnapshot: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        inputPayload: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        auth: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            provider: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            authMode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            secretRef: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        }, z.core.$strict>>>;
        codexThreadId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        persistExtendedHistory: z.ZodOptional<z.ZodBoolean>;
        initialTurnMode: z.ZodOptional<z.ZodEnum<{
            start: "start";
            deferred: "deferred";
        }>>;
        pendingLogicalTurnRetry: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            method: z.ZodEnum<{
                "turn/start": "turn/start";
                "review/start": "review/start";
            }>;
            params: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
            metadata: z.ZodObject<{
                owner: z.ZodLiteral<"yp-live-workflow">;
                scheduled: z.ZodBoolean;
                classification: z.ZodEnum<{
                    server_overloaded: "server_overloaded";
                    usage_limit: "usage_limit";
                    transient_connection: "transient_connection";
                    internal_server_error: "internal_server_error";
                }>;
                attempt: z.ZodNumber;
                nominalDelayMs: z.ZodNumber;
                delayMs: z.ZodNumber;
                nextRetryAt: z.ZodString;
            }, z.core.$strict>;
            turnId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        pendingLogicalTurnRetries: z.ZodOptional<z.ZodArray<z.ZodObject<{
            method: z.ZodEnum<{
                "turn/start": "turn/start";
                "review/start": "review/start";
            }>;
            params: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
            metadata: z.ZodObject<{
                owner: z.ZodLiteral<"yp-live-workflow">;
                scheduled: z.ZodBoolean;
                classification: z.ZodEnum<{
                    server_overloaded: "server_overloaded";
                    usage_limit: "usage_limit";
                    transient_connection: "transient_connection";
                    internal_server_error: "internal_server_error";
                }>;
                attempt: z.ZodNumber;
                nominalDelayMs: z.ZodNumber;
                delayMs: z.ZodNumber;
                nextRetryAt: z.ZodString;
            }, z.core.$strict>;
            turnId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        datasetMounts: z.ZodOptional<z.ZodArray<z.ZodObject<{
            datasetVersionId: z.ZodString;
            name: z.ZodString;
            versionLabel: z.ZodString;
            containerPath: z.ZodString;
            access: z.ZodLiteral<"read_only">;
            required: z.ZodBoolean;
            locations: z.ZodArray<z.ZodObject<{
                kind: z.ZodEnum<{
                    local: "local";
                    gcs: "gcs";
                }>;
                tier: z.ZodEnum<{
                    cold: "cold";
                    hot: "hot";
                }>;
                uri: z.ZodString;
                storageClass: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
            }, z.core.$strict>>;
            manifestChecksumSha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        }, z.core.$strict>>>;
        previousArtifactMounts: z.ZodOptional<z.ZodArray<z.ZodObject<{
            sourcePath: z.ZodString;
            containerPath: z.ZodString;
            readOnly: z.ZodLiteral<true>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        }, z.core.$strict>>>;
        reviewEvidenceMounts: z.ZodOptional<z.ZodArray<z.ZodObject<{
            sourcePath: z.ZodString;
            containerPath: z.ZodString;
            readOnly: z.ZodLiteral<true>;
            evidenceType: z.ZodEnum<{
                workspace: "workspace";
                artifacts: "artifacts";
                cache: "cache";
                "dataset-output": "dataset-output";
            }>;
            experimentId: z.ZodString;
            forbiddenRelativePaths: z.ZodOptional<z.ZodArray<z.ZodString>>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        }, z.core.$strict>>>;
        sensitiveHostPaths: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmSessionStartedResponseEnvelopeSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"session.started">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
        workspaceId: z.ZodString;
        vmHostId: z.ZodString;
        codexThreadId: z.ZodString;
        codexTurnId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        vmEventStreamId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        vmEventSeqBoundary: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        pendingLogicalTurnRetry: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            method: z.ZodEnum<{
                "turn/start": "turn/start";
                "review/start": "review/start";
            }>;
            params: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
            metadata: z.ZodObject<{
                owner: z.ZodLiteral<"yp-live-workflow">;
                scheduled: z.ZodBoolean;
                classification: z.ZodEnum<{
                    server_overloaded: "server_overloaded";
                    usage_limit: "usage_limit";
                    transient_connection: "transient_connection";
                    internal_server_error: "internal_server_error";
                }>;
                attempt: z.ZodNumber;
                nominalDelayMs: z.ZodNumber;
                delayMs: z.ZodNumber;
                nextRetryAt: z.ZodString;
            }, z.core.$strict>;
            turnId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        pendingLogicalTurnRetries: z.ZodOptional<z.ZodArray<z.ZodObject<{
            method: z.ZodEnum<{
                "turn/start": "turn/start";
                "review/start": "review/start";
            }>;
            params: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
            metadata: z.ZodObject<{
                owner: z.ZodLiteral<"yp-live-workflow">;
                scheduled: z.ZodBoolean;
                classification: z.ZodEnum<{
                    server_overloaded: "server_overloaded";
                    usage_limit: "usage_limit";
                    transient_connection: "transient_connection";
                    internal_server_error: "internal_server_error";
                }>;
                attempt: z.ZodNumber;
                nominalDelayMs: z.ZodNumber;
                delayMs: z.ZodNumber;
                nextRetryAt: z.ZodString;
            }, z.core.$strict>;
            turnId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        transport: z.ZodLiteral<"stdio">;
        runtimeMetadata: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmSessionResumeCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"session.resume">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
        codexThreadId: z.ZodString;
        persistExtendedHistory: z.ZodOptional<z.ZodBoolean>;
        overrides: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmSessionPauseCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"session.pause">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
        codexThreadId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        codexTurnId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        interruptActiveTurn: z.ZodOptional<z.ZodBoolean>;
        keepWarm: z.ZodOptional<z.ZodBoolean>;
        reason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmSessionThreadForkCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"session.thread.fork">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
        codexThreadId: z.ZodString;
        persistExtendedHistory: z.ZodOptional<z.ZodBoolean>;
        overrides: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmSessionTurnStartCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"session.turn.start">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
        codexThreadId: z.ZodString;
        input: z.ZodArray<z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.core.$strict>>;
        overrides: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmSessionTurnSteerCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"session.turn.steer">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
        codexThreadId: z.ZodString;
        codexTurnId: z.ZodString;
        input: z.ZodArray<z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.core.$strict>>;
        overrides: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmSessionInjectItemsCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"session.inject_items">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
        codexThreadId: z.ZodString;
        items: z.ZodArray<z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmSessionInterruptCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"session.interrupt">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
        codexThreadId: z.ZodString;
        codexTurnId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmSessionApprovalRespondCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"session.approval.respond">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
        requestId: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
        result: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        error: z.ZodOptional<z.ZodObject<{
            code: z.ZodNumber;
            message: z.ZodString;
            data: z.ZodOptional<z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmSessionReviewStartCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"session.review.start">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
        codexThreadId: z.ZodString;
        target: z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"uncommittedChanges">;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"baseBranch">;
            branch: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"commit">;
            sha: z.ZodString;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"custom">;
            instructions: z.ZodString;
        }, z.core.$strict>], "type">;
        delivery: z.ZodOptional<z.ZodEnum<{
            inline: "inline";
            detached: "detached";
        }>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmSessionTerminateCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"session.terminate">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmWorkspaceArchiveCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"workspace.archive">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
        workspaceId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmWorkspaceFileReadCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"workspace.file.read">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
        workspaceId: z.ZodString;
        path: z.ZodString;
        scope: z.ZodOptional<z.ZodEnum<{
            workspace: "workspace";
            review_evidence: "review_evidence";
        }>>;
        maxBytes: z.ZodOptional<z.ZodNumber>;
        checksumOnly: z.ZodOptional<z.ZodBoolean>;
        statOnly: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmWorkspaceFileReadyResponseEnvelopeSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"workspace.file.ready">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
        workspaceId: z.ZodString;
        path: z.ZodString;
        scope: z.ZodOptional<z.ZodEnum<{
            workspace: "workspace";
            review_evidence: "review_evidence";
        }>>;
        content: z.ZodString;
        contentChecksumSha256: z.ZodString;
        sizeBytes: z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>;
        maxBytes: z.ZodNumber;
        checksumOnly: z.ZodOptional<z.ZodBoolean>;
        statOnly: z.ZodOptional<z.ZodBoolean>;
        entryType: z.ZodOptional<z.ZodEnum<{
            file: "file";
            directory: "directory";
        }>>;
        truncated: z.ZodBoolean;
        readAt: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmDatasetPromoteCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"dataset.promote">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        workspaceId: z.ZodString;
        vmHostId: z.ZodString;
        datasetVersionId: z.ZodString;
        sourcePath: z.ZodString;
        allowedSourceRootPath: z.ZodString;
        manifestChecksumSha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmDatasetPromotedResponseEnvelopeSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"dataset.promoted">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        ok: z.ZodLiteral<true>;
        commandId: z.ZodString;
        workspaceId: z.ZodString;
        vmHostId: z.ZodString;
        datasetVersionId: z.ZodString;
        hotPath: z.ZodString;
        uri: z.ZodString;
        sourcePath: z.ZodString;
        promotedAt: z.ZodString;
        sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
        mountedFiles: z.ZodOptional<z.ZodArray<z.ZodString>>;
        mountedFileCount: z.ZodOptional<z.ZodNumber>;
        mountedFilesTruncated: z.ZodOptional<z.ZodBoolean>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmDatasetOutputNormalizeCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"dataset.output.normalize">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        workspaceId: z.ZodString;
        vmHostId: z.ZodString;
        sourcePath: z.ZodString;
        allowedSourceRootPath: z.ZodString;
        sessionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmDatasetOutputNormalizedResponseEnvelopeSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"dataset.output.normalized">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        ok: z.ZodLiteral<true>;
        commandId: z.ZodString;
        workspaceId: z.ZodString;
        vmHostId: z.ZodString;
        sourcePath: z.ZodString;
        normalizedAt: z.ZodString;
        mode: z.ZodEnum<{
            host: "host";
            container_fallback: "container_fallback";
        }>;
        fileCount: z.ZodNumber;
        directoryCount: z.ZodNumber;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmDatasetValidateCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"dataset.validate">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        workspaceId: z.ZodString;
        vmHostId: z.ZodString;
        sourcePath: z.ZodString;
        allowedSourceRootPath: z.ZodString;
        expectedFiles: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodArray<z.ZodObject<{
            relativePath: z.ZodString;
            status: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
            checksumSha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strict>>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmDatasetValidatedResponseEnvelopeSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"dataset.validated">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        ok: z.ZodLiteral<true>;
        commandId: z.ZodString;
        workspaceId: z.ZodString;
        vmHostId: z.ZodString;
        sourcePath: z.ZodString;
        uri: z.ZodString;
        validatedAt: z.ZodString;
        sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>>;
        mountedFiles: z.ZodOptional<z.ZodArray<z.ZodString>>;
        mountedFileCount: z.ZodOptional<z.ZodNumber>;
        mountedFilesTruncated: z.ZodOptional<z.ZodBoolean>;
        files: z.ZodOptional<z.ZodArray<z.ZodObject<{
            relativePath: z.ZodString;
            sizeBytes: z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>;
            checksumSha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            format: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            compression: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strict>>>;
        missingExpectedFiles: z.ZodOptional<z.ZodArray<z.ZodString>>;
        missingAssetFiles: z.ZodOptional<z.ZodArray<z.ZodString>>;
        checksumFailures: z.ZodOptional<z.ZodArray<z.ZodString>>;
        sizeMismatches: z.ZodOptional<z.ZodArray<z.ZodString>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmDatasetFilePreviewCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"dataset.file.preview">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        vmHostId: z.ZodString;
        datasetVersionId: z.ZodString;
        datasetLocationId: z.ZodString;
        locationUri: z.ZodString;
        path: z.ZodString;
        maxBytes: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmDatasetFilePreviewReadyResponseEnvelopeSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"dataset.file.preview.ready">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        ok: z.ZodLiteral<true>;
        commandId: z.ZodString;
        vmHostId: z.ZodString;
        datasetVersionId: z.ZodString;
        datasetLocationId: z.ZodString;
        locationUri: z.ZodString;
        path: z.ZodString;
        content: z.ZodString;
        contentChecksumSha256: z.ZodString;
        sizeBytes: z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>;
        maxBytes: z.ZodNumber;
        truncated: z.ZodBoolean;
        readAt: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmSessionCommandAckResponseEnvelopeSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodEnum<{
        "session.turn.start": "session.turn.start";
        "session.turn.steer": "session.turn.steer";
        "session.interrupt": "session.interrupt";
        "session.inject_items": "session.inject_items";
        "session.approval.respond": "session.approval.respond";
        "session.review.start": "session.review.start";
        "workspace.archive": "workspace.archive";
        "session.pause": "session.pause";
        "session.resume": "session.resume";
        "session.thread.fork": "session.thread.fork";
        "session.terminate": "session.terminate";
    }>;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        ok: z.ZodLiteral<true>;
        commandId: z.ZodString;
        sessionId: z.ZodString;
        codexThreadId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        codexTurnId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        result: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmAuxTerminalOpenCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"session.aux_terminal.open">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
        cols: z.ZodOptional<z.ZodNumber>;
        rows: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmAuxTerminalInputCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"session.aux_terminal.input">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
        terminalId: z.ZodString;
        data: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmAuxTerminalResizeCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"session.aux_terminal.resize">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
        terminalId: z.ZodString;
        cols: z.ZodNumber;
        rows: z.ZodNumber;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmAuxTerminalCloseCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"session.aux_terminal.close">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
        terminalId: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmArtifactCollectCommandEnvelopeSchema: z.ZodObject<{
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"artifact.collect">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
        runId: z.ZodString;
        runStepId: z.ZodString;
        workspaceId: z.ZodString;
        vmHostId: z.ZodString;
        artifactsPath: z.ZodString;
        includeGlobs: z.ZodOptional<z.ZodArray<z.ZodString>>;
        excludeGlobs: z.ZodOptional<z.ZodArray<z.ZodString>>;
        upload: z.ZodOptional<z.ZodBoolean>;
        knownArtifacts: z.ZodOptional<z.ZodArray<z.ZodObject<{
            artifactId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            relativePath: z.ZodString;
            checksumSha256: z.ZodString;
            sizeBytes: z.ZodOptional<z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>>;
            objectUri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strict>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const VmArtifactCollectedResponseEnvelopeSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    protocol: z.ZodLiteral<"yp-live-workflow.vm.v1">;
    messageType: z.ZodLiteral<"artifact.ready">;
    commandId: z.ZodString;
    ts: z.ZodString;
    data: z.ZodObject<{
        commandId: z.ZodString;
        sessionId: z.ZodString;
        runId: z.ZodString;
        runStepId: z.ZodString;
        workspaceId: z.ZodString;
        vmHostId: z.ZodString;
        artifactsPath: z.ZodString;
        uploadEnabled: z.ZodBoolean;
        collectedAt: z.ZodString;
        artifacts: z.ZodArray<z.ZodObject<{
            artifactId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            relativePath: z.ZodString;
            localPath: z.ZodString;
            localUri: z.ZodString;
            objectUri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            kind: z.ZodString;
            contentType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            sizeBytes: z.ZodCodec<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodNumber>;
            checksumSha256: z.ZodString;
            collectedAt: z.ZodString;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
}, z.core.$strict>;
