import assert from "node:assert/strict";
import test from "node:test";
import {
  aggregateRunMonitorActivityState,
  BrowserCommands,
  BrowserEvents,
  BrowserSessionInjectItemsCommandDataSchema,
  BrowserSessionInterruptCommandDataSchema,
  BrowserSessionApprovalRespondCommandDataSchema,
  BrowserSessionReviewStartCommandDataSchema,
  BrowserSessionTurnStartCommandDataSchema,
  BrowserSessionTurnSteerCommandDataSchema,
  BrowserSubscribeCommandDataSchema,
  BrowserUnsubscribeCommandDataSchema,
  BrowserAuxTerminalCloseCommandDataSchema,
  BrowserAuxTerminalInputCommandDataSchema,
  BrowserAuxTerminalOpenCommandDataSchema,
  BrowserAuxTerminalResizeCommandDataSchema,
  ArtifactCollectPayloadSchema,
  ArtifactCollectResponsePayloadSchema,
  AgentRuntimeDockerPolicySchema,
  AgentAuthProfileSchema,
  AgentRuntimeProfileSchema,
  normalizeAgentRuntimeDockerPolicy,
  AgentSessionRefSchema,
  AgentStepBoundarySchema,
  ApprovalTaskSchema,
  ChiefScientistDecisionRecordSchema,
  ChiefScientistDecisionSchema,
  ClientWsEnvelopeSchema,
  CodexAuthOptionSchema,
  CodexAuthMaterialSchema,
  CodexChatGptConnectionSchema,
  CodexChatGptLoginStartedSchema,
  CodexCoreModelSettingsSchema,
  CodexUsageBillingContextSchema,
  codexRetryClassification,
  codexSessionEventWillRetry,
  DefaultCodexModel,
  CodexSessionWorkflowStepOutputPayloadSchema,
  GroupLaunchResourcesSchema,
  DatasetAssetSchema,
  DatasetComponentSchema,
  DatasetLeaseSchema,
  DatasetLocationSchema,
  DatasetSchema,
  DatasetSourceSchema,
  DatasetVersionSchema,
  YP_LIVE_WORKFLOW_CLIENT_PROTOCOL,
  YP_LIVE_WORKFLOW_VM_PROTOCOL,
  LiveWorkflowModelDefaultsSchema,
  ExperimentRunStepSchema,
  ExperimentSchema,
  HumanReviewWorkflowStepOutputPayloadSchema,
  HumanReviewCaseSchema,
  HumanReviewCaseMemberSchema,
  HumanReviewDirectionInputSchema,
  HumanReviewDirectionSchema,
  HumanReviewPlannerAdviceSchema,
  HumanReviewVoteSchema,
  InfographicSourceTypes,
  InfographicSourceTypeSchema,
  GroupLifecycleStatusSchema,
  LiveScopeSnapshotSchema,
  makeRunMonitorTopic,
  ModelCallSchema,
  NoopWorkflowStepOutputPayloadSchema,
  PlanningJobSchema,
  PromptBindingSchema,
  ReportBundleSchema,
  normalizeCodexModelDefaultsWithConfigFallback,
  normalizeCodexModelDefaults,
  normalizeRealtimeTopic,
  parseRealtimeTopic,
  ReviewPacketSchema,
  RunMonitorUpdateSchema,
  runMonitorActivityState,
  runMonitorPulseKind,
  runMonitorPulseMagnitude,
  ScopeTypeSchema,
  SessionConversationHistoryPageSchema,
  SessionConversationHistoryQuerySchema,
  SessionHistoryQuerySchema,
  SessionHistoryResponseSchema,
  SessionSnapshotPayloadSchema,
  VmAuxTerminalAckPayloadSchema,
  VmAuxTerminalBacklogPayloadSchema,
  VmAuxTerminalChunkPayloadSchema,
  VmAuxTerminalCloseCommandEnvelopeSchema,
  VmAuxTerminalClosedPayloadSchema,
  VmAuxTerminalInputCommandEnvelopeSchema,
  VmAuxTerminalOpenCommandEnvelopeSchema,
  VmAuxTerminalOpenedPayloadSchema,
  VmAuxTerminalResizeCommandEnvelopeSchema,
  VmCodexAuthLoginCancelCommandEnvelopeSchema,
  VmCodexAuthLoginCancelledResponseEnvelopeSchema,
  VmCodexAuthLoginCompleteCommandEnvelopeSchema,
  VmCodexAuthLoginCompletedResponseEnvelopeSchema,
  VmCodexAuthLoginStartCommandEnvelopeSchema,
  VmCodexAuthLoginStartedResponseEnvelopeSchema,
  VmCodexAuthMaterialUpdatedPayloadSchema,
  VmAgentAckPayloadSchema,
  VmArtifactCollectCommandEnvelopeSchema,
  VmArtifactCollectedResponseEnvelopeSchema,
  VmBrokerCommandErrorEnvelopeSchema,
  VmBrokerHelloAckEnvelopeSchema,
  VmBrokerHelloEnvelopeSchema,
  VmCodexUserInputSchema,
  VmDatasetOutputNormalizeCommandEnvelopeSchema,
  VmDatasetOutputNormalizedPayloadSchema,
  VmDatasetPromotedPayloadSchema,
  VmHeartbeatPayloadSchema,
  VmWsEnvelopeSchema,
  VmHostSchema,
  VmHostSystemSnapshotSchema,
  VmHostVolumeSnapshotSchema,
  VmHostVolumeSchema,
  VmRegisterPayloadSchema,
  VmSessionDatasetMountSchema,
  VmSessionEventPayloadSchema,
  VmSessionApprovalRespondCommandEnvelopeSchema,
  VmSessionCommandAckResponseEnvelopeSchema,
  VmSessionInjectItemsCommandEnvelopeSchema,
  VmSessionInterruptCommandEnvelopeSchema,
  VmSessionPauseCommandEnvelopeSchema,
  VmSessionResumeCommandEnvelopeSchema,
  VmSessionReviewStartCommandEnvelopeSchema,
  VmSessionStartCommandEnvelopeSchema,
  VmSessionStartPayloadSchema,
  VmSessionStartedResponseEnvelopeSchema,
  VmSessionTerminateCommandEnvelopeSchema,
  VmSessionThreadForkCommandEnvelopeSchema,
  VmSessionTurnStartCommandEnvelopeSchema,
  VmSessionTurnSteerCommandEnvelopeSchema,
  VmTelemetryPayloadSchema,
  UsageEventSchema,
  UsageQuotaSnapshotSchema,
  UsageSummarySchema,
  UpdateGroupLifecycleInputSchema,
  VmWorkspaceArchiveCommandEnvelopeSchema,
  VmWorkspaceFileReadCommandEnvelopeSchema,
  VmWorkspaceFileReadyResponseEnvelopeSchema,
  VmWorkspacePrepareCommandEnvelopeSchema,
  VmWorkspacePreparedResponseEnvelopeSchema,
  WorkspaceFileReadPayloadSchema,
  WorkspaceFileReadResponsePayloadSchema,
  WorkspaceFileMaterializePayloadSchema,
  WorkspacePrepareAuditContextSchema,
  WorkspacePreparePayloadSchema,
  WorkspacePreparedPayloadSchema,
  WorkspaceSchema,
  WorkflowWorkerHeartbeatSchema,
  WorkflowGraphDefinitionSchema,
  WorkflowNodeKinds,
  ScienceNodeWorkflowStepOutputPayloadSchema,
  WorkflowTemplateRevisionSchema,
  WorkflowTemplateSchema,
  WorkflowNormalizedErrorPayloadSchema,
  type ChiefScientistDecision,
  type ReviewPacket,
} from "../../index.js";

const now = "2026-05-16T13:00:00.000Z";
const sessionId = "11111111-1111-4111-8111-111111111111";
const runId = "22222222-2222-4222-8222-222222222222";
const runStepId = "33333333-3333-4333-8333-333333333333";
const vmHostId = "44444444-4444-4444-8444-444444444444";
const workspaceId = "55555555-5555-4555-8555-555555555555";

function sampleAgentSessionRef() {
  return {
    id: sessionId,
    runId,
    runStepId,
    kind: "codex_app_server",
    status: "active",
    vmHostId,
    workspaceId,
    threadId: "thread-1",
    activeTurnId: "turn-1",
    runtimeSnapshot: { cwd: "/mnt/experiments/workspace" },
    startedAt: now,
    endedAt: null,
    updatedAt: now,
  };
}

function sampleAgentSessionEvent(seq = 0) {
  return {
    id: `session-event-${seq}`,
    sessionId,
    seq,
    eventType: "turn.started",
    eventTs: now,
    turnId: "turn-1",
    itemId: null,
    vmHostId,
    vmEventStreamId: "event-stream-1",
    vmSeq: seq,
    vmTransport: "vm_broker_ws",
    vmBrokerConnectionId: "broker-connection-1",
    vmSequenceStatus: "ok",
    payload: { status: "running" },
    rawPayload: { method: "turn/started" },
    createdAt: now,
    updatedAt: now,
  };
}

function sampleApprovalTask() {
  return {
    id: "approval-1",
    sessionId,
    requestId: "request-1",
    kind: "command_execution",
    status: "pending",
    policyScope: null,
    payload: { command: "npm test" },
    resolvedByType: null,
    resolvedById: null,
    createdAt: now,
    updatedAt: now,
  };
}

function sampleArtifact() {
  return {
    id: "artifact-1",
    scope: { type: "session", id: sessionId },
    kind: "log",
    path: "logs/session.log",
    contentType: "text/plain",
    sizeBytes: 42,
    checksumSha256: "a".repeat(64),
    metadata: {},
    createdAt: now,
    updatedAt: now,
  };
}

test("protocol versions remain stable", () => {
  assert.equal(YP_LIVE_WORKFLOW_CLIENT_PROTOCOL, "yp-live-workflow.client.v1");
  assert.equal(YP_LIVE_WORKFLOW_VM_PROTOCOL, "yp-live-workflow.vm.v1");
});

test("A2 execution and review case schemas use API response contract shapes", () => {
  assert.equal(
    ExperimentSchema.parse({
      id: "experiment-1",
      groupId: 10,
      communityId: 20,
      domainId: 30,
      slug: "experiment-one",
      name: "Experiment One",
      description: null,
      status: "draft",
      metadata: {},
      followup: {
        isFollowup: false,
        approvalStatus: null,
        waitingForReplan: false,
        needsGroupPlanUpdate: false,
        reviewCaseId: null,
        sourceExperimentId: null,
        sourceRunId: null,
        sourceGraphEdgeId: null,
        replanGuidance: null,
        chiefReasoningSummary: null,
        plannedGroupPlanVersion: null,
        plannedGroupPlanPartId: null,
        blockedLaunchReason: null,
      },
      currentRunId: null,
      createdAt: now,
      updatedAt: now,
    }).groupId,
    10
  );

  assert.equal(
    HumanReviewCaseSchema.parse({
      id: "case-1",
      scope: { type: "run_step", id: "run-step-1" },
      status: "open",
      reviewBoardGroupId: 22,
      title: "Review suspicious result",
      summary: "Needs human judgement",
      priority: "high",
      metadata: {
        source: "chief_scientist_state_machine",
      },
      createdAt: now,
      updatedAt: now,
    }).metadata?.source,
    "chief_scientist_state_machine"
  );
  assert.equal(ScopeTypeSchema.parse("run_step"), "run_step");
});

test("A2 configuration registry schemas use API response contract shapes", () => {
  assert.equal(
    WorkflowTemplateSchema.parse({
      id: "workflow-template-1",
      scope: { type: "group", id: "10" },
      name: "Codex workflow",
      description: null,
      status: "draft",
      metadata: {},
      createdAt: now,
      updatedAt: now,
    }).scope.type,
    "group"
  );

  assert.equal(
    WorkflowTemplateRevisionSchema.parse({
      id: "workflow-template-revision-1",
      workflowTemplateId: "workflow-template-1",
      revisionNo: 1,
      definition: { nodes: [] },
      status: "published",
      createdByUserId: 13,
      createdAt: now,
      updatedAt: now,
    }).revisionNo,
    1
  );

  assert.equal(
    PromptBindingSchema.parse({
      id: "prompt-binding-1",
      scope: { type: "group", id: "10" },
      targetKind: "chief_scientist_review",
      postId: 100,
      postRevisionId: 101,
      priority: 0,
      metadata: {},
      createdAt: now,
      updatedAt: now,
    }).targetKind,
    "chief_scientist_review"
  );

  assert.equal(
    AgentRuntimeProfileSchema.parse({
      id: "runtime-profile-1",
      scope: { type: "group", id: "10" },
      name: "Default Codex runtime",
      runtimeKind: "codex_app_server",
      containerImage: null,
      modelDefaults: {},
      codexConfig: {},
      resourcePolicy: {},
      reviewPolicy: {},
      createdAt: now,
      updatedAt: now,
    }).runtimeKind,
    "codex_app_server"
  );

  assert.equal(
    AgentAuthProfileSchema.parse({
      id: "auth-profile-1",
      scope: { type: "user", id: "13" },
      provider: "openai",
      authMode: "codex_chatgpt_with_api_fallback",
      secretRef: "OPENAI_API_KEY",
      metadata: {},
      createdAt: now,
      updatedAt: now,
    }).provider,
    "openai"
  );

  assert.equal(
    CodexAuthOptionSchema.parse({
      authProfileId: "auth-profile-1",
      provider: "openai",
      kind: "chatgpt_with_api_fallback",
      label: "My ChatGPT account with API fallback",
      configured: true,
      selected: true,
      scope: { type: "user", id: "13" },
      fallbackAuthProfileId: "99999999-9999-4999-8999-999999999999",
      fallbackConfigured: true,
    }).kind,
    "chatgpt_with_api_fallback"
  );

  assert.equal(
    CodexChatGptConnectionSchema.parse({
      authProfileId: "auth-profile-1",
      provider: "openai",
      connected: true,
      account: { email: "scientist@example.com" },
      loginStatus: "completed",
      loginId: "login-1",
      updatedAt: now,
    }).connected,
    true
  );

  assert.equal(
    GroupLaunchResourcesSchema.parse({
      authProfiles: [{
        id: "auth-profile-1",
        scope: { type: "group", id: "42" },
        provider: "openai",
        authMode: "openai_api_key",
        secretRef: null,
        metadata: {},
        createdAt: now,
        updatedAt: now,
      }],
      chatGptConnection: {
        authProfileId: null,
        provider: "openai",
        connected: false,
      },
      codexAuthOptions: [],
      runtimeProfiles: [{
        id: "runtime-profile-1",
        scope: { type: "group", id: "42" },
        name: "Runtime",
        runtimeKind: "codex_app_server",
        containerImage: null,
        modelDefaults: {},
        codexConfig: {},
        resourcePolicy: {},
        reviewPolicy: {},
        createdAt: now,
        updatedAt: now,
      }],
      vmHosts: [{
        id: vmHostId,
        name: "vm-a",
        status: "available",
        capabilities: {},
        lastSeenAt: now,
        metadata: {},
        createdAt: now,
        updatedAt: now,
      }],
    }).vmHosts.length,
    1
  );

  assert.equal(
    CodexChatGptLoginStartedSchema.parse({
      authProfileId: "auth-profile-1",
      vmHostId,
      rootPath: "/mnt/experiments/.codex-auth/auth-profile-1",
      loginType: "chatgptDeviceCode",
      loginId: "login-1",
      verificationUrl: "https://auth.openai.com/codex/device",
      userCode: "ABCD-EFGH",
    }).userCode,
    "ABCD-EFGH"
  );

  assert.equal(
    VmCodexAuthMaterialUpdatedPayloadSchema.parse({
      vmHostId,
      sessionId,
      authProfileId: "11111111-1111-4111-8111-999999999999",
      baseFingerprintSha256: "a".repeat(64),
      currentFingerprintSha256: "b".repeat(64),
      authMaterial: {
        format: "codex_home_files_v1",
        files: [{ path: "auth.json", dataBase64: Buffer.from("{}").toString("base64"), mode: 0o600 }],
      },
      account: { type: "chatgpt" },
      source: "turn_completed",
      updatedAt: now,
    }).currentFingerprintSha256,
    "b".repeat(64)
  );

  assert.equal(
    VmAgentAckPayloadSchema.parse({
      ok: true,
      vmHostId,
      messageType: "codex.auth.material.updated",
    }).messageType,
    "codex.auth.material.updated"
  );
});

test("A3 Docker runtime policy validates and normalizes explicit profile controls", () => {
  assert.deepEqual(normalizeAgentRuntimeDockerPolicy({}), {
    network: "provider",
    gpus: "none",
    pidsLimit: 4096,
    nofileSoft: 1024,
    nofileHard: 4096,
    readOnlyRootFilesystem: false,
  });
  assert.deepEqual(
    normalizeAgentRuntimeDockerPolicy({
      network: "none",
      gpus: "none",
      memoryBytes: 1024,
      cpus: "1.5",
      pidsLimit: 128,
      nofileSoft: 512,
      nofileHard: 1024,
      readOnlyRootFilesystem: true,
    }),
    {
      network: "none",
      gpus: "none",
      memoryBytes: 1024,
      cpus: "1.5",
      pidsLimit: 128,
      nofileSoft: 512,
      nofileHard: 1024,
      readOnlyRootFilesystem: true,
    }
  );
  assert.equal(AgentRuntimeDockerPolicySchema.safeParse({ network: "restricted" }).success, false);
  assert.equal(AgentRuntimeDockerPolicySchema.safeParse({ gpus: "one" }).success, false);
  assert.equal(AgentRuntimeDockerPolicySchema.safeParse({ unknown: true }).success, false);
  assert.equal(AgentRuntimeDockerPolicySchema.safeParse({ pidsLimit: 999_999 }).success, false);
  assert.deepEqual(
    normalizeAgentRuntimeDockerPolicy(
      { network: "restricted", unknown: true },
      { allowLegacyNetworkValues: true, allowUnknownFields: true }
    ),
    {
      network: "provider",
      gpus: "none",
      pidsLimit: 4096,
      nofileSoft: 1024,
      nofileHard: 4096,
      readOnlyRootFilesystem: false,
    }
  );
});

test("A4 Codex core model settings validate and normalize defaults", () => {
  assert.equal(DefaultCodexModel, "gpt-5.5");
  assert.deepEqual(normalizeCodexModelDefaults({}), {
    model: DefaultCodexModel,
    reasoningEffort: "xhigh",
    serviceTier: "flex",
  });
  assert.deepEqual(normalizeCodexModelDefaults({ model: "gpt-5.4-mini" }), {
    model: "gpt-5.4-mini",
    reasoningEffort: "xhigh",
    serviceTier: "flex",
  });
  assert.deepEqual(
    normalizeCodexModelDefaultsWithConfigFallback({}, { model: "legacy-codex-config-model" }),
    {
      reasoningEffort: "xhigh",
      serviceTier: "flex",
    }
  );
  assert.deepEqual(
    normalizeCodexModelDefaultsWithConfigFallback({ model: "profile-model" }, { model: "legacy-codex-config-model" }),
    {
      model: "profile-model",
      reasoningEffort: "xhigh",
      serviceTier: "flex",
    }
  );
  assert.deepEqual(
    CodexCoreModelSettingsSchema.parse({
      reasoningEffort: "minimal",
      serviceTier: "fast",
    }),
    {
      model: DefaultCodexModel,
      reasoningEffort: "minimal",
      serviceTier: "fast",
    }
  );
  assert.equal(CodexCoreModelSettingsSchema.safeParse({ model: "" }).success, false);
  assert.equal(CodexCoreModelSettingsSchema.safeParse({ reasoningEffort: "max" }).success, true);
  assert.equal(CodexCoreModelSettingsSchema.safeParse({ serviceTier: "auto" }).success, false);
  assert.equal(
    LiveWorkflowModelDefaultsSchema.parse({
      workflow: {
        assignments: {
          "review.chief": {
          model: "gpt-5.5",
          reasoningEffort: "xhigh",
          providerOptions: { openai: { reasoningMode: "pro" } },
          },
        },
      },
    }).workflow?.assignments?.["review.chief"]?.reasoningEffort,
    "xhigh"
  );
  assert.equal(LiveWorkflowModelDefaultsSchema.safeParse({
    workflow: {
      rosters: {
        "council.default": {
          members: [
            { id: "duplicate", selector: { provider: "openai", model: "gpt-5.6-sol" } },
            { id: "duplicate", selector: { provider: "google", model: "gemini-3.1-pro-preview" } },
          ],
        },
      },
    },
  }).success, false);
  assert.equal(LiveWorkflowModelDefaultsSchema.safeParse({
    workflow: {
      rosters: {
        "council.unknown": {
          members: [{ id: "member", selector: { provider: "openai", model: "gpt-5.6-sol" } }],
        },
      },
    },
  }).success, false);
});

test("A2 execution record schemas use API response contract shapes", () => {
  assert.equal(
    ExperimentRunStepSchema.parse({
      id: "run-step-1",
      runId: "run-1",
      nodeId: "node-1",
      attempt: 1,
      status: "queued",
      runtimeProfileId: null,
      authProfileId: null,
      assignedVmHostId: null,
      agentSessionId: null,
      inputPayload: { objective: "test" },
      outputPayload: null,
      errorPayload: null,
      claimedByWorkerId: null,
      claimedAt: null,
      leaseExpiresAt: null,
      createdAt: now,
      updatedAt: now,
    }).nodeId,
    "node-1"
  );

  assert.equal(
    VmHostSchema.parse({
      id: "vm-host-1",
      name: "vm-a",
      status: "available",
      capabilities: { docker: true },
      lastSeenAt: now,
      metadata: {},
      createdAt: now,
      updatedAt: now,
    }).status,
    "available"
  );

  assert.equal(
    WorkflowWorkerHeartbeatSchema.parse({
      id: "worker-heartbeat-1",
      workerId: "worker-a",
      queueName: "yp-live-workflow-workflow-steps",
      status: "active",
      startedAt: now,
      lastHeartbeatAt: now,
      stoppedAt: null,
      metadata: { pid: 123 },
      createdAt: now,
      updatedAt: now,
    }).workerId,
    "worker-a"
  );

  assert.equal(
    VmHostVolumeSchema.parse({
      id: "vm-volume-1",
      vmHostId: "vm-host-1",
      mountPath: "/workspaces",
      role: "workspace",
      totalBytes: "1000",
      availableBytes: "900",
      metadata: {},
      createdAt: now,
      updatedAt: now,
    }).mountPath,
    "/workspaces"
  );

  assert.equal(
    WorkspaceSchema.parse({
      id: "workspace-1",
      experimentId: "experiment-1",
      vmHostId: "vm-host-1",
      rootPath: "/workspaces/experiment-1",
      repoUrl: null,
      repoRef: null,
      status: "ready",
      metadata: {},
      createdAt: now,
      updatedAt: now,
    }).status,
    "ready"
  );

  assert.equal(
    AgentSessionRefSchema.parse({
      id: "session-1",
      runId: "run-1",
      runStepId: "run-step-1",
      kind: "codex_app_server",
      status: "active",
      vmHostId: "vm-host-1",
      workspaceId: "workspace-1",
      threadId: "thread-1",
      activeTurnId: "turn-1",
      turnStartClaim: {
        actorType: "user",
        claimedAt: now,
        commandId: "browser-command-1",
        source: "browser_session_command",
      },
      turnStartOwner: null,
      runtimeSnapshot: { cwd: "/workspaces/experiment-1" },
      startedAt: now,
      endedAt: null,
      updatedAt: now,
    }).runtimeSnapshot?.cwd,
    "/workspaces/experiment-1"
  );

  assert.equal(
    DatasetSchema.parse({
      id: "dataset-1",
      scope: { type: "group", id: "42" },
      name: "Reference genome",
      description: null,
      status: "active",
      metadata: {},
      createdAt: now,
      updatedAt: now,
    }).scope.type,
    "group"
  );
  assert.equal(
    DatasetVersionSchema.parse({
      id: "dataset-version-1",
      datasetId: "dataset-1",
      versionLabel: "v1",
      manifestChecksumSha256: "a".repeat(64),
      sizeBytes: "5000",
      logicalSizeBytes: "5000",
      physicalSizeBytes: "5000",
      fileCount: 2,
      componentCount: 1,
      versionKind: "raw",
      verificationStatus: "manifest_verified",
      completenessStatus: "complete",
      accessLevel: "public",
      license: "CC-BY-4.0",
      status: "available",
      metadata: {},
      createdAt: now,
      updatedAt: now,
    }).versionLabel,
    "v1"
  );
  assert.equal(
    DatasetLocationSchema.parse({
      id: "dataset-location-1",
      datasetVersionId: "dataset-version-1",
      kind: "gcs",
      tier: "cold",
      uri: "gs://private-datasets/reference/v1",
      resolvedUri: "gs://private-datasets/reference/v1",
      storageClass: "STANDARD",
      physicalSizeBytes: "5000",
      storageIdentity: "gcs:private-datasets/reference/v1",
      aliasOfLocationId: null,
      status: "available",
      metadata: {},
      createdAt: now,
      updatedAt: now,
    }).tier,
    "cold"
  );
  assert.equal(
    DatasetSourceSchema.parse({
      id: "dataset-source-1",
      datasetVersionId: "dataset-version-1",
      kind: "geo",
      accession: "GSE123",
      uri: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE123",
      title: "Reference dataset",
      license: "CC-BY-4.0",
      accessLevel: "public",
      acquiredAt: now,
      metadata: {},
      createdAt: now,
      updatedAt: now,
    }).kind,
    "geo"
  );
  assert.equal(
    DatasetComponentSchema.parse({
      id: "dataset-component-1",
      datasetVersionId: "dataset-version-1",
      parentComponentId: null,
      name: "raw",
      role: "raw",
      pathPrefix: "raw",
      fileCount: 2,
      sizeBytes: "5000",
      metadata: {},
      createdAt: now,
      updatedAt: now,
    }).role,
    "raw"
  );
  assert.equal(
    DatasetAssetSchema.parse({
      id: "dataset-asset-1",
      datasetVersionId: "dataset-version-1",
      componentId: "dataset-component-1",
      role: "raw",
      relativePath: "raw/sample.fastq.gz",
      sizeBytes: "5000",
      checksumSha256: "a".repeat(64),
      checksumMd5: "b".repeat(32),
      format: "fastq",
      compression: "gzip",
      recordCount: "100",
      status: "verified",
      sourceUri: "https://example.test/sample.fastq.gz",
      downloadedAt: now,
      verifiedAt: now,
      metadata: {},
      createdAt: now,
      updatedAt: now,
    }).status,
    "verified"
  );
  assert.throws(() => DatasetVersionSchema.parse({
    id: "dataset-version-1",
    datasetId: "dataset-1",
    versionLabel: "v1",
    versionKind: "not-a-kind",
    verificationStatus: "unverified",
    completenessStatus: "complete",
    accessLevel: "unknown",
    status: "available",
    metadata: {},
    createdAt: now,
    updatedAt: now,
  }));
  assert.equal(
    DatasetLeaseSchema.parse({
      id: "dataset-lease-1",
      datasetVersionId: "dataset-version-1",
      workspaceId: "workspace-1",
      sessionId: "session-1",
      vmHostId: "vm-1",
      hotPath: "/mnt/datasets-hot/dataset-version-1",
      status: "active",
      expiresAt: null,
      lastSeenAt: now,
      metadata: {},
      createdAt: now,
      updatedAt: now,
    }).status,
    "active"
  );
});

test("report bundle schemas support completed, running, failed, and partial registry records", () => {
  const base = {
    bundleId: "20260519T000000Z",
    kind: "generated_papers_and_summaries",
    runId: "run-1",
    experimentId: "experiment-1",
    groupId: 42,
    sessionId: "session-1",
    artifactDirectory: "generatedPapersAndSummaries/20260519T000000Z",
    startedAt: now,
    updatedAt: now,
    completedAt: null,
    failedAt: null,
    failure: null,
    chiefActionAttemptId: "chief-action-1",
    chiefReviewModelCallId: "model-call-1",
    decisionChecksumSha256: "a".repeat(64),
    steps: [
      {
        targetKind: "paper_draft",
        outputFile: "PRE_PRINT_PAPER_DRAFT.md",
        relativePath: "generatedPapersAndSummaries/20260519T000000Z/PRE_PRINT_PAPER_DRAFT.md",
        status: "completed",
        artifactId: "artifact-1",
        artifact: sampleArtifact(),
        turnId: "turn-1",
        commandId: "command-1",
        promptBindingId: "binding-1",
        startedAt: now,
        completedAt: now,
        failedAt: null,
        failure: null,
      },
    ],
    supportingArtifacts: [],
    warnings: [],
  };

  for (const status of ["completed", "running", "failed", "partial"]) {
    assert.equal(ReportBundleSchema.parse({ ...base, status }).status, status);
  }
});

test("A2 review persistence schemas use API response contract shapes", () => {
  assert.equal(
    AgentStepBoundarySchema.parse({
      id: "boundary-1",
      sessionId: "session-1",
      runId: "run-1",
      runStepId: "run-step-1",
      trigger: "manual_checkpoint",
      status: "open",
      snapshot: { metadata: { reason: "checkpoint" } },
      resolvedAt: null,
      createdAt: now,
      updatedAt: now,
    }).trigger,
    "manual_checkpoint"
  );

  assert.equal(
    ModelCallSchema.parse({
      id: "model-call-1",
      scope: { type: "run", id: "run-1" },
      role: "chief_scientist_review",
      provider: "openai",
      model: "gpt-5.3-codex",
      requestPayload: {},
      responsePayload: null,
      status: "queued",
      backgroundJobId: null,
      startedAt: null,
      finishedAt: null,
      createdAt: now,
      updatedAt: now,
    }).scope.type,
    "run"
  );

  assert.equal(
    PlanningJobSchema.parse({
      id: "planning-job-1",
      groupId: 10,
      kind: "preview",
      status: "queued",
      requestPayload: { description: "Plan work", dryRun: true },
      resultPayload: null,
      errorPayload: null,
      modelCallId: null,
      backgroundJobId: null,
      requestedByUserId: 1,
      startedAt: null,
      finishedAt: null,
      createdAt: now,
      updatedAt: now,
    }).kind,
    "preview"
  );
  const planningJob = {
    id: "planning-job-1",
    groupId: 10,
    kind: "preview",
    status: "queued",
    requestPayload: {},
    createdAt: now,
    updatedAt: now,
  };
  assert.throws(() => PlanningJobSchema.parse({ ...planningJob, kind: "future_kind" }));
  assert.throws(() => PlanningJobSchema.parse({ ...planningJob, status: "future_status" }));

  assert.equal(
    ChiefScientistDecisionRecordSchema.parse({
      id: "decision-1",
      modelCallId: "model-call-1",
      reviewPacket: {},
      decisionPayload: {},
      action: "continue",
      confidence: 0.8,
      applyStatus: "pending",
      appliedAt: null,
      createdAt: now,
      updatedAt: now,
    }).applyStatus,
    "pending"
  );

  assert.equal(
    ApprovalTaskSchema.parse({
      id: "approval-1",
      sessionId: "session-1",
      requestId: "request-1",
      kind: "command_execution",
      status: "pending",
      policyScope: null,
      payload: {},
      resolvedByType: null,
      resolvedById: null,
      createdAt: now,
      updatedAt: now,
    }).kind,
    "command_execution"
  );

  assert.equal(
    HumanReviewCaseMemberSchema.parse({
      id: "member-1",
      caseId: "case-1",
      userId: 13,
      role: "reviewer",
      status: "assigned",
      assignedAt: now,
      resolvedAt: null,
      createdAt: now,
      updatedAt: now,
    }).userId,
    13
  );

  assert.equal(
    HumanReviewVoteSchema.parse({
      id: "vote-1",
      caseId: "case-1",
      userId: 13,
      voteType: "approve",
      payload: {},
      createdAt: now,
      updatedAt: now,
    }).voteType,
    "approve"
  );
});

test("human review Planner advice and direction schemas preserve complete selected options", () => {
  const option = {
    id: "repair-first",
    title: "Repair first",
    recommendation: "Repair the evidence before continuing.",
    rationale: "The current evidence is incomplete.",
    benefits: ["Preserves scientific quality."],
    risks: ["Requires another iteration."],
    chiefInstruction: "Repair and validate the evidence, then return for Chief review.",
  };
  const advice = HumanReviewPlannerAdviceSchema.parse({
    summary: "Choose how to proceed.",
    fullLaySummary: "The available evidence is incomplete, so a person needs to decide how the research should proceed.",
    recommendedOptionId: option.id,
    options: [
      option,
      { ...option, id: "narrow", title: "Narrow scope" },
      { ...option, id: "pause", title: "Pause" },
    ],
  });

  assert.equal(advice.options.length, 3);
  assert.equal(
    advice.fullLaySummary,
    "The available evidence is incomplete, so a person needs to decide how the research should proceed."
  );
  const legacyAdvice = HumanReviewPlannerAdviceSchema.parse({
    summary: advice.summary,
    recommendedOptionId: advice.recommendedOptionId,
    options: advice.options,
  });
  assert.equal(legacyAdvice.fullLaySummary, undefined);
  assert.equal(HumanReviewDirectionInputSchema.parse({
    kind: "planner_option",
    optionId: option.id,
  }).kind, "planner_option");
  assert.equal(HumanReviewDirectionInputSchema.safeParse({
    kind: "custom",
    text: "x".repeat(35_000),
  }).success, true);
  assert.equal(HumanReviewDirectionInputSchema.safeParse({
    kind: "custom",
    text: "x".repeat(35_001),
  }).success, false);
  const direction = HumanReviewDirectionSchema.parse({
    kind: "planner_option",
    optionId: option.id,
    option,
  });
  assert.equal(direction.kind, "planner_option");
  assert.equal(direction.kind === "planner_option" ? direction.option.chiefInstruction : null, option.chiefInstruction);
  assert.equal(HumanReviewPlannerAdviceSchema.safeParse({
    ...advice,
    options: [option, option, option],
  }).success, false);
});

test("browser command list includes core session controls", () => {
  assert.ok(BrowserCommands.includes("subscribe"));
  assert.ok(BrowserCommands.includes("session.turn.start"));
  assert.ok(BrowserCommands.includes("session.inject_items"));
  assert.ok(BrowserCommands.includes("session.approval.respond"));
  assert.ok(BrowserCommands.includes("session.aux_terminal.open"));
  assert.ok(BrowserCommands.includes("session.aux_terminal.input"));
  assert.ok(BrowserEvents.includes("session.stream.delta"));
  assert.ok(BrowserEvents.includes("run.step.status.changed"));
  assert.ok(BrowserEvents.includes("session.aux_terminal.opened"));
  assert.ok(BrowserEvents.includes("session.aux_terminal.chunk"));
  assert.ok(BrowserEvents.includes("chief_scientist.decision.failed"));
  assert.ok(BrowserEvents.includes("chief_scientist.decision.applied"));
  assert.ok(BrowserEvents.includes("artifact.ready"));
  assert.ok(BrowserEvents.includes("planning_job.updated"));
  assert.ok(BrowserEvents.includes("infographic_job.updated"));
  assert.ok(BrowserEvents.includes("workflow.worker.updated"));
  assert.ok(BrowserEvents.includes("usage.updated"));
  assert.ok(BrowserEvents.includes("live.updated"));
  assert.ok(WorkflowNodeKinds.includes("noop"));
});

test("infographic source contract includes experiment research plans", () => {
  assert.ok(InfographicSourceTypes.includes("experiment_plan"));
  assert.equal(InfographicSourceTypeSchema.parse("experiment_plan"), "experiment_plan");
});

test("usage contracts validate ledger, quota, and summary payloads", () => {
  const billingContext = CodexUsageBillingContextSchema.parse({
    lane: "openai_api",
    provider: "openai",
    model: "gpt-5.5",
    serviceTier: "fast",
    inferenceType: "normal",
    threadId: "thread-1",
    turnId: "turn-1",
    capturedAt: now,
  });
  const usageEvent = UsageEventSchema.parse({
    id: "99999999-9999-4999-8999-999999999999",
    sourceType: "session_event",
    sourceId: "event-1",
    idempotencyKey: "session_event:event-1:metrics",
    eventTs: now,
    lane: "chatgpt_plan",
    provider: "openai",
    model: "gpt-5.5",
    userId: 1,
    authProfileId: "66666666-6666-4666-8666-666666666666",
    groupId: 10,
    experimentId: "77777777-7777-4777-8777-777777777777",
    runId,
    runStepId,
    sessionId,
    modelCallId: null,
    tokens: { inputTokens: 10, outputTokens: 2, totalTokens: 12 },
    cost: { pricingStatus: "not_applicable", toolCost: null, totalCost: null },
    quota: null,
    metadata: {},
    createdAt: now,
    updatedAt: now,
  });
  const quota = UsageQuotaSnapshotSchema.parse({
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    authProfileId: "66666666-6666-4666-8666-666666666666",
    provider: "openai",
    planType: "pro",
    limitId: "codex",
    limitName: null,
    usedPercent: 91,
    windowDurationMins: 15,
    resetsAt: now,
    rateLimitReachedType: null,
    credits: null,
    rawSnapshot: {},
    observedAt: now,
    createdAt: now,
    updatedAt: now,
  });

  assert.equal(usageEvent.lane, "chatgpt_plan");
  assert.equal(billingContext.model, "gpt-5.5");
  assert.equal(quota.usedPercent, 91);
  assert.equal(
    UsageSummarySchema.parse({
      scope: { type: "session", id: sessionId },
      generatedAt: now,
      from: null,
      to: null,
      totals: {
        inputTokens: 10,
        cachedInputTokens: 0,
        outputTokens: 2,
        reasoningTokens: 0,
        totalTokens: 12,
        toolCost: 0,
        totalCost: 0,
        eventCount: 1,
        modelUsageEventCount: 1,
        administrativeEventCount: 0,
        pricedEventCount: 0,
        missingPricingEventCount: 0,
      },
      byLane: [{ lane: "chatgpt_plan", totals: {
        inputTokens: 10,
        cachedInputTokens: 0,
        outputTokens: 2,
        reasoningTokens: 0,
        totalTokens: 12,
        toolCost: 0,
        totalCost: 0,
        eventCount: 1,
        modelUsageEventCount: 1,
        administrativeEventCount: 0,
        pricedEventCount: 0,
        missingPricingEventCount: 0,
      } }],
      quota: [quota],
    }).totals.eventCount,
    1
  );
});

test("realtime topics use canonical scope names", () => {
  assert.equal(normalizeRealtimeTopic(" run_step:run-step-1 "), "run_step:run-step-1");
  assert.equal(normalizeRealtimeTopic("review_case:case-1"), "review_case:case-1");
  assert.equal(normalizeRealtimeTopic("review_job:model-call-1"), "review_job:model-call-1");
  assert.equal(normalizeRealtimeTopic("planning_job:plan-job-1"), "planning_job:plan-job-1");
  assert.equal(normalizeRealtimeTopic("infographic_job:infographic-job-1"), "infographic_job:infographic-job-1");
  assert.equal(normalizeRealtimeTopic("workflow:workers"), "workflow:workers");
  assert.equal(
    makeRunMonitorTopic("22222222-2222-4222-8222-222222222222"),
    "monitor:run:22222222-2222-4222-8222-222222222222"
  );
  assert.deepEqual(parseRealtimeTopic("planning_job:plan-job-1"), {
    type: "planning_job",
    planningJobId: "plan-job-1",
  });
  assert.deepEqual(parseRealtimeTopic("infographic_job:infographic-job-1"), {
    type: "infographic_job",
    infographicJobId: "infographic-job-1",
  });
  assert.deepEqual(parseRealtimeTopic("brief:group:10"), {
    type: "brief",
    scope: { type: "group", id: "10" },
  });
  assert.deepEqual(parseRealtimeTopic("monitor:run:22222222-2222-4222-8222-222222222222"), {
    type: "run_monitor",
    runId: "22222222-2222-4222-8222-222222222222",
  });

  assert.equal(normalizeRealtimeTopic("runStep:run-step-1"), null);
  assert.equal(normalizeRealtimeTopic("reviewCase:case-1"), null);
  assert.equal(normalizeRealtimeTopic("reviewJob:model-call-1"), null);
  assert.equal(normalizeRealtimeTopic("planningJob:plan-job-1"), null);
  assert.equal(normalizeRealtimeTopic("infographicJob:infographic-job-1"), null);
  assert.equal(normalizeRealtimeTopic("monitor:session:22222222-2222-4222-8222-222222222222"), null);
  assert.equal(normalizeRealtimeTopic("unknown:topic"), null);
});

test("run monitor updates stay compact and classify activity consistently", () => {
  const update = RunMonitorUpdateSchema.parse({
    runId: "22222222-2222-4222-8222-222222222222",
    emittedAt: "2026-05-17T12:00:00.250Z",
    resources: {
      sampledAt: "2026-05-17T12:00:00.000Z",
      hosts: [{
        vmHostId: "44444444-4444-4444-8444-444444444444",
        telemetry: {
          system: { cpuCount: 8, loadAverage: [2, 1, 0.5] },
          gpu: { available: true, utilizationPercent: 31 },
        },
        containers: [{
          containerName: "researcher-1",
          sessionId: "11111111-1111-4111-8111-111111111111",
          cpuPercent: 17.5,
          memoryBytes: 1024,
          memoryLimitBytes: 4096,
        }],
      }],
    },
    activity: {
      windowStartedAt: "2026-05-17T12:00:00.000Z",
      windowEndedAt: "2026-05-17T12:00:00.250Z",
      state: "working",
      pulses: [{
        at: "2026-05-17T12:00:00.100Z",
        kind: "command",
        magnitude: 0.5,
        count: 3,
      }],
    },
  });

  assert.equal(update.resources?.hosts[0]?.containers[0]?.cpuPercent, 17.5);
  assert.equal(update.activity?.pulses[0]?.count, 3);
  assert.equal(runMonitorPulseKind("session.event", "command.output.delta"), "command");
  assert.equal(runMonitorPulseKind("session.snapshot"), undefined);
  assert.equal(runMonitorActivityState({
    messageType: "session.status.changed",
    status: "waiting_on_human",
  }), "waiting-human");
  assert.equal(runMonitorActivityState({
    messageType: "run.status.changed",
    status: "completed",
  }), "terminal");
  assert.ok(runMonitorPulseMagnitude(20_000) > runMonitorPulseMagnitude(200));
  assert.equal(aggregateRunMonitorActivityState({
    sessionStates: ["waiting-chief", "working"],
  }), "working");
  assert.equal(aggregateRunMonitorActivityState({
    sessionStates: ["waiting-human", "working"],
  }), "waiting-human");
  assert.equal(aggregateRunMonitorActivityState({
    runState: "paused",
    sessionStates: ["working"],
  }), "paused");
});

test("workflow step output and error payload schemas validate current executor payloads", () => {
  assert.equal(
    NoopWorkflowStepOutputPayloadSchema.parse({
      executor: "noop",
      runId: "run-1",
      runStepId: "run-step-1",
      nodeId: "node-1",
      attempt: 1,
    }).executor,
    "noop"
  );
  assert.equal(
    CodexSessionWorkflowStepOutputPayloadSchema.parse({
      executor: "codex_session",
      sessionId: "session-1",
      workspaceId: "workspace-1",
      vmHostId: "vm-1",
      runtimeProfileId: "runtime-profile-1",
      authProfileId: null,
      brokerCommand: { dispatched: true },
    }).executor,
    "codex_session"
  );
  assert.equal(
    HumanReviewWorkflowStepOutputPayloadSchema.parse({
      executor: "human_review",
      reviewCaseId: "case-1",
      reviewBoardGroupId: 10,
      priority: "normal",
      scope: { type: "run_step", id: "run-step-1" },
    }).reviewCaseId,
    "case-1"
  );
  assert.equal(
    ScienceNodeWorkflowStepOutputPayloadSchema.parse({
      executor: "science_node_runner",
      nodeKind: "signal_rank",
      scienceAgentRunId: "science-run-1",
      runnerKind: "policy_synth_task",
      terminalScienceAgentRunStatus: "completed",
      finalOutput: { summary: "Ranked signals", rankedSignalIds: [], acceptedSignalIds: [], rejectedSignalIds: [] },
    }).scienceAgentRunId,
    "science-run-1"
  );
  assert.equal(WorkflowNormalizedErrorPayloadSchema.parse({ code: "failed", detail: true }).code, "failed");

  assert.equal(HumanReviewWorkflowStepOutputPayloadSchema.safeParse({ executor: "human_review" }).success, false);
  assert.equal(WorkflowNormalizedErrorPayloadSchema.safeParse({ detail: true }).success, false);
});

test("workflow graph definitions validate executable node topology", () => {
  const rootNodeId = "11111111-1111-4111-8111-111111111111";
  const childNodeId = "22222222-2222-4222-8222-222222222222";

  assert.equal(
    WorkflowGraphDefinitionSchema.parse({
      version: 1,
      nodes: [
        {
          id: rootNodeId,
          kind: "noop",
          name: "Root",
          config: { objective: "start" },
        },
        {
          id: childNodeId,
          kind: "noop",
          name: "Child",
          config: {},
          dependsOn: [rootNodeId],
        },
      ],
    }).nodes.length,
    2
  );

  for (const definition of [
    { version: 2, nodes: [] },
    {
      version: 1,
      nodes: [
        { id: rootNodeId, kind: "noop", name: "Root", config: {} },
        { id: rootNodeId, kind: "noop", name: "Duplicate", config: {} },
      ],
    },
    {
      version: 1,
      nodes: [{ id: rootNodeId, kind: "noop", name: "Missing dependency", config: {}, dependsOn: [childNodeId] }],
    },
    {
      version: 1,
      nodes: [{ id: rootNodeId, kind: "noop", name: "Duplicate dependency", config: {}, dependsOn: [childNodeId, childNodeId] }],
    },
    {
      version: 1,
      nodes: [{ id: rootNodeId, kind: "unsupported", name: "Unsupported", config: {} }],
    },
    {
      version: 1,
      nodes: [
        { id: rootNodeId, kind: "noop", name: "Root", config: {}, dependsOn: [childNodeId] },
        { id: childNodeId, kind: "noop", name: "Child", config: {}, dependsOn: [rootNodeId] },
      ],
    },
  ]) {
    assert.equal(WorkflowGraphDefinitionSchema.safeParse(definition).success, false);
  }
});

test("client and VM websocket envelopes validate known messages", () => {
  assert.equal(
    ClientWsEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_CLIENT_PROTOCOL,
      messageType: "session.snapshot",
      ts: now,
      data: { sessionId: "session-1" },
    }).messageType,
    "session.snapshot"
  );

  assert.equal(
    VmWsEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "vm.heartbeat",
      seq: 1,
      ts: now,
      data: { vmHostId: "vm-1" },
    }).messageType,
    "vm.heartbeat"
  );
});

test("VM agent register heartbeat telemetry and acknowledgement payloads parse", () => {
  const system = VmHostSystemSnapshotSchema.parse({
    hostname: "vm-a",
    platform: "linux",
    arch: "x64",
    cpuCount: 8,
    cpuModel: "Example CPU",
    loadAverage: [0.1, 0.2, 0.3],
    uptimeSeconds: 120,
    totalMemoryBytes: 1024,
    freeMemoryBytes: 512,
  });
  const volume = VmHostVolumeSnapshotSchema.parse({
    mountPath: "/mnt/experiments",
    role: "workspace",
    totalBytes: "1000",
    availableBytes: 900,
  });

  assert.equal(
    VmRegisterPayloadSchema.parse({
      name: "vm-a",
      capabilities: { hostTelemetry: true, docker: false },
      metadata: { region: "local" },
      volumes: [volume],
      system,
    }).name,
    "vm-a"
  );
  assert.equal(
    VmHeartbeatPayloadSchema.parse({
      vmHostId: "vm-1",
      status: "available",
      capabilities: { hostTelemetry: true },
      system,
    }).vmHostId,
    "vm-1"
  );
  assert.equal(
    VmTelemetryPayloadSchema.parse({
      vmHostId: "vm-1",
      telemetry: { system, gpu: { available: false } },
      volumes: [volume],
      containers: [{
        containerName: "yp-live-workflow-session-1",
        sessionId: "session-1",
        runId: "run-1",
        cpuPercent: 12.5,
        memoryBytes: 512,
        storage: {
          writableMounts: [{
            containerPath: "/artifacts",
            role: "artifacts",
            readOnly: false,
            usedBytes: "100",
            totalBytes: 1000,
            availableBytes: 900,
            truncated: true,
            error: "scan_limited",
          }],
          datasetMounts: [{
            containerPath: "/datasets/reference",
            datasetVersionId: "dataset-version-1",
            name: "reference",
            versionLabel: "v1",
            readOnly: true,
            sizeBytes: "5000",
          }],
        },
      }],
    }).volumes?.length,
    1
  );
  assert.equal(
    VmAgentAckPayloadSchema.parse({
      ok: true,
      vmHostId: "vm-1",
      messageType: "vm.telemetry",
    }).messageType,
    "vm.telemetry"
  );
});

test("A3 workspace prepare command and prepared response payloads parse", () => {
  const payload = WorkspacePreparePayloadSchema.parse({
    commandId: "command-1",
    auditContext: {
      commandId: "command-1",
      requestedByUserId: 13,
      groupId: "42",
      experimentId: "experiment-1",
      workspaceId: "workspace-1",
      vmHostId: "vm-1",
      requestedAt: now,
    },
    workspaceId: "workspace-1",
    vmHostId: "vm-1",
    rootPath: "/mnt/experiments/domain/community/group/experiment",
    repoUrl: "https://example.test/repo.git",
    repoRef: "main",
    githubFolder: {
      repositoryFullName: "example/repo",
      cloneUrl: "https://github.com/example/repo.git",
      branchName: "yp-live-workflow/groups/42",
      repoDirectoryName: "repo",
      folderPath: "src/tools",
      commitAuthorName: "LiveWorkflow Scientist",
      commitAuthorEmail: "scientist@yp-live-workflow.ai",
      htmlUrl: "https://github.com/example/repo/tree/yp-live-workflow/groups/42/src/tools",
      accessToken: "ghp_example",
      tokenUsername: "x-access-token",
    },
    materialization: {
      agentsMd: "Follow the project plan.",
      codexHomeAgentsOverrideMd: "Domain instructions.",
      codexConfigToml: "model = \"gpt-5.5\"",
      rules: [{ name: "safety", content: "Always run tests." }],
      skills: [{ name: "analysis", skillMd: "# Analysis", files: [{ path: "references/notes.md", content: "Notes" }] }],
      fullPlanMd: "# Full Plan",
      researchPlanMd: "# Research Plan",
      files: [
        { path: "docs/context.md", content: "Context" },
        { path: "papers/example.pdf", contentBase64: Buffer.from("%PDF-1.7\n").toString("base64"), encoding: "base64" },
      ],
      cacheFiles: [
        { path: "capabilities/bin/samtools", content: "#!/usr/bin/env bash\n", mode: 0o755 },
      ],
    },
  });

  assert.equal(payload.materialization?.rules?.[0]?.name, "safety");
  assert.equal(payload.materialization?.files?.[1]?.path, "papers/example.pdf");
  assert.equal(payload.materialization?.cacheFiles?.[0]?.mode, 0o755);
  assert.equal(payload.githubFolder?.repoDirectoryName, "repo");
  assert.equal(payload.githubFolder?.folderPath, "src/tools");
  assert.equal(payload.githubFolder?.commitAuthorName, "LiveWorkflow Scientist");
  assert.equal(payload.githubFolder?.commitAuthorEmail, "scientist@yp-live-workflow.ai");

  const prepared = WorkspacePreparedPayloadSchema.parse({
    commandId: "command-1",
    auditContext: payload.auditContext,
    workspaceId: "workspace-1",
    vmHostId: "vm-1",
    rootPath: payload.rootPath,
    preparedAt: now,
    layout: {
      rootPath: payload.rootPath,
      workspacePath: `${payload.rootPath}/workspace`,
      codexHomePath: `${payload.rootPath}/codex-home`,
      artifactsPath: `${payload.rootPath}/artifacts`,
      cachePath: `${payload.rootPath}/cache`,
    },
    repo: {
      status: "cloned",
      repoUrl: payload.repoUrl,
      repoRef: payload.repoRef,
      checkedOutRef: "main",
    },
    githubFolder: {
      status: "cloned",
      repositoryFullName: "example/repo",
      branchName: "yp-live-workflow/groups/42",
      repoDirectoryName: "repo",
      folderPath: ".",
      workspacePath: `${payload.rootPath}/workspace/repo`,
      credentialHelperPath: `${payload.rootPath}/workspace/repo/.git/yp-live-workflow-github-credential-helper.sh`,
      checkedOutRef: "yp-live-workflow/groups/42",
      checkedOutCommitSha: "abc123",
    },
    materializedFiles: ["workspace/AGENTS.md", "codex-home/AGENTS.override.md"],
  });

  assert.equal(prepared.repo.status, "cloned");
  assert.equal(prepared.githubFolder?.folderPath, ".");
  assert.match(prepared.githubFolder?.credentialHelperPath ?? "", /credential-helper/u);
  assert.equal(
    VmWorkspacePrepareCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "workspace.prepare",
      commandId: "command-1",
      ts: now,
      data: payload,
    }).messageType,
    "workspace.prepare"
  );
  assert.equal(
    VmWorkspacePreparedResponseEnvelopeSchema.parse({
      ok: true,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "workspace.prepared",
      commandId: "command-1",
      ts: now,
      data: prepared,
    }).messageType,
    "workspace.prepared"
  );
});

test("workspace file read command and response payloads parse", () => {
  const payload = WorkspaceFileReadPayloadSchema.parse({
    commandId: "workspace-file-read-command-1",
    sessionId,
    workspaceId,
    path: "RESEARCH_PLAN.md",
    maxBytes: 1_000_000,
    checksumOnly: true,
  });
  const response = WorkspaceFileReadResponsePayloadSchema.parse({
    commandId: payload.commandId,
    sessionId,
    workspaceId,
    path: payload.path,
    content: "# Research plan",
    contentChecksumSha256: "0".repeat(64),
    sizeBytes: 15,
    maxBytes: payload.maxBytes,
    checksumOnly: payload.checksumOnly,
    truncated: false,
    readAt: now,
  });

  assert.equal(
    VmWorkspaceFileReadCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "workspace.file.read",
      commandId: payload.commandId,
      ts: now,
      data: payload,
    }).messageType,
    "workspace.file.read"
  );
  assert.equal(
    VmWorkspaceFileReadyResponseEnvelopeSchema.parse({
      ok: true,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "workspace.file.ready",
      commandId: payload.commandId,
      ts: now,
      data: response,
    }).messageType,
    "workspace.file.ready"
  );
  assert.equal(response.checksumOnly, true);

  const evidenceStat = WorkspaceFileReadPayloadSchema.parse({
    commandId: "workspace-evidence-stat-command-1",
    sessionId,
    workspaceId,
    path: "/datasets/historical/v1",
    scope: "review_evidence",
    statOnly: true,
  });
  const evidenceStatResponse = WorkspaceFileReadResponsePayloadSchema.parse({
    ...evidenceStat,
    content: "",
    contentChecksumSha256: "0".repeat(64),
    sizeBytes: 4_096,
    maxBytes: 1_000_000,
    entryType: "directory",
    truncated: false,
    readAt: now,
  });
  assert.equal(evidenceStatResponse.statOnly, true);
  assert.equal(evidenceStatResponse.entryType, "directory");
  assert.throws(() => WorkspaceFileReadPayloadSchema.parse({
    ...evidenceStat,
    checksumOnly: true,
  }));
});

test("system workspace transfers support artifacts targets and read-only modes", () => {
  const audit = WorkspacePrepareAuditContextSchema.parse({
    commandId: "workspace-system-prepare-1",
    requestedByUserId: null,
    requestedByType: "system",
    groupId: "7",
    experimentId: sessionId,
    workspaceId,
    vmHostId,
    requestedAt: now,
  });
  const transfer = WorkspaceFileMaterializePayloadSchema.parse({
    commandId: "workspace-system-transfer-1",
    workspaceId,
    vmHostId,
    rootPath: "/mnt/yp-live-workflow/groups/7/final-review",
    target: "artifacts",
    path: "group-final-review/job/PRE_PRINT_PAPER_DRAFT.md",
    mode: 0o444,
    sizeBytes: 12,
    checksumSha256: "a".repeat(64),
  });

  assert.equal(audit.requestedByType, "system");
  assert.equal(audit.requestedByUserId, null);
  assert.equal(transfer.target, "artifacts");
  assert.equal(transfer.mode, 0o444);
});

test("A4 Codex auth login command envelopes parse", () => {
  const authProfileId = "66666666-6666-4666-8666-666666666666";
  const loginId = "login-1";
  const rootPath = "/mnt/experiments/.codex-auth/66666666-6666-4666-8666-666666666666";
  const authMaterial = CodexAuthMaterialSchema.parse({
    format: "codex_home_files_v1",
    files: [
      {
        path: "auth.json",
        dataBase64: Buffer.from(JSON.stringify({ token: "stored" })).toString("base64"),
        mode: 0o600,
      },
    ],
    metadata: { archivedAt: now },
  });

  assert.equal(
    VmCodexAuthLoginStartCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "codex.auth.login.start",
      commandId: "codex-auth-start-1",
      ts: now,
      data: {
        commandId: "codex-auth-start-1",
        authProfileId,
        vmHostId,
        rootPath,
        loginType: "chatgptDeviceCode",
      },
    }).messageType,
    "codex.auth.login.start"
  );
  assert.equal(
    VmCodexAuthLoginStartedResponseEnvelopeSchema.parse({
      ok: true,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "codex.auth.login.started",
      commandId: "codex-auth-start-1",
      ts: now,
      data: {
        ok: true,
        commandId: "codex-auth-start-1",
        authProfileId,
        vmHostId,
        rootPath,
        loginType: "chatgptDeviceCode",
        loginId,
        verificationUrl: "https://auth.openai.com/codex/device",
        userCode: "ABCD-EFGH",
      },
    }).data.userCode,
    "ABCD-EFGH"
  );
  assert.equal(
    VmCodexAuthLoginCompleteCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "codex.auth.login.complete",
      commandId: "codex-auth-complete-1",
      ts: now,
      data: {
        commandId: "codex-auth-complete-1",
        authProfileId,
        vmHostId,
        rootPath,
        loginId,
        timeoutMs: 5000,
      },
    }).data.loginId,
    loginId
  );
  assert.equal(
    VmCodexAuthLoginCompletedResponseEnvelopeSchema.parse({
      ok: true,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "codex.auth.login.completed",
      commandId: "codex-auth-complete-1",
      ts: now,
      data: {
        ok: true,
        commandId: "codex-auth-complete-1",
        authProfileId,
        vmHostId,
        rootPath,
        loginId,
        account: { type: "chatgpt", email: "user@example.test" },
        authMaterial,
      },
    }).data.authMaterial.files[0]?.path,
    "auth.json"
  );
  assert.equal(
    VmCodexAuthLoginCancelCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "codex.auth.login.cancel",
      commandId: "codex-auth-cancel-1",
      ts: now,
      data: {
        commandId: "codex-auth-cancel-1",
        authProfileId,
        vmHostId,
        rootPath,
        loginId,
      },
    }).messageType,
    "codex.auth.login.cancel"
  );
  assert.equal(
    VmCodexAuthLoginCancelledResponseEnvelopeSchema.parse({
      ok: true,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "codex.auth.login.cancelled",
      commandId: "codex-auth-cancel-1",
      ts: now,
      data: {
        ok: true,
        commandId: "codex-auth-cancel-1",
        authProfileId,
        vmHostId,
        rootPath,
        loginId,
      },
    }).data.loginId,
    loginId
  );
  assert.equal(
    VmCodexAuthLoginStartedResponseEnvelopeSchema.safeParse({
      ok: true,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "codex.auth.login.started",
      commandId: "outer-command",
      ts: now,
      data: {
        ok: true,
        commandId: "inner-command",
        authProfileId,
        vmHostId,
        rootPath,
        loginType: "chatgptDeviceCode",
        loginId,
        verificationUrl: "https://auth.openai.com/codex/device",
        userCode: "ABCD-EFGH",
      },
    }).success,
    false
  );
});

test("A3 session start command started response and normalized event payloads parse", () => {
  const layout = {
    rootPath: "/mnt/experiments/domain/community/group/experiment",
    workspacePath: "/mnt/experiments/domain/community/group/experiment/workspace",
    codexHomePath: "/mnt/experiments/domain/community/group/experiment/codex-home",
    artifactsPath: "/mnt/experiments/domain/community/group/experiment/artifacts",
    cachePath: "/mnt/experiments/domain/community/group/experiment/cache",
  };
  const payload = {
    commandId: "session-command-1",
    sessionId: "session-1",
    runId: "run-1",
    runStepId: "step-1",
    nodeId: "node-1",
    workspaceId: "workspace-1",
    vmHostId: "vm-1",
    runtimeProfileId: "runtime-profile-1",
    authProfileId: "auth-profile-1",
    layout,
    runtimeSnapshot: {
      auth: {
        provider: "openai",
        authMode: "codex_chatgpt_with_api_fallback",
        secretRef: "OPENAI_API_KEY",
      },
      codexConfig: { approvalPolicy: "on-request" },
      modelDefaults: { model: DefaultCodexModel },
    },
    inputPayload: { objective: "Start Codex" },
    auth: {
      provider: "openai",
      authMode: "codex_chatgpt_with_api_fallback",
      secretRef: "OPENAI_API_KEY",
    },
    initialTurnMode: "deferred",
    persistExtendedHistory: true,
    pendingLogicalTurnRetry: {
      method: "turn/start",
      params: { threadId: "thread-1", input: [{ type: "text", text: "Continue." }] },
      turnId: "turn-retry-source-1",
      metadata: {
        owner: "yp-live-workflow",
        scheduled: true,
        classification: "server_overloaded",
        attempt: 2,
        nominalDelayMs: 10_000,
        delayMs: 8_000,
        nextRetryAt: "2026-05-16T13:00:08.000Z",
      },
    },
    datasetMounts: [
      {
        datasetVersionId: "dataset-version-1",
        name: "reference",
        versionLabel: "v1",
        containerPath: "/datasets/reference/v1",
        access: "read_only",
        required: true,
        locations: [
          {
            kind: "gcs",
            tier: "cold",
            uri: "gs://private-datasets/reference/v1",
            storageClass: "STANDARD",
          },
        ],
        manifestChecksumSha256: "a".repeat(64),
        sizeBytes: "5000",
      },
    ],
    previousArtifactMounts: [
      {
        sourcePath: "/mnt/experiments/groups/201/experiments/e02/artifacts",
        containerPath: "/previous-artifacts/E02",
        readOnly: true,
        metadata: {
          groupPlanPartId: "E02",
        },
      },
    ],
    reviewEvidenceMounts: [
      {
        sourcePath: "/mnt/experiments/group/e01/workspace",
        containerPath: "/review-sources/experiments/e01/workspace",
        readOnly: true,
        evidenceType: "workspace",
        experimentId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      },
      {
        sourcePath: "/mnt/datasets-hot/outputs/groups/1/experiments/e01",
        containerPath: "/review-sources/experiments/e01/dataset-output",
        readOnly: true,
        evidenceType: "dataset-output",
        experimentId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      },
    ],
    sensitiveHostPaths: [
      "/mnt/experiments/domain/community/group/experiment/workspace/repo/.git/yp-live-workflow-github-credential-helper.sh",
    ],
  };

  assert.equal(VmSessionStartPayloadSchema.parse(payload).initialTurnMode, "deferred");
  assert.equal(VmSessionStartPayloadSchema.parse(payload).persistExtendedHistory, true);
  assert.equal(VmSessionStartPayloadSchema.parse(payload).pendingLogicalTurnRetry?.metadata.attempt, 2);
  assert.equal(VmSessionStartPayloadSchema.parse(payload).pendingLogicalTurnRetry?.turnId, "turn-retry-source-1");
  assert.equal(VmSessionDatasetMountSchema.parse(payload.datasetMounts[0]).locations[0]?.kind, "gcs");
  assert.equal(VmSessionStartPayloadSchema.parse(payload).previousArtifactMounts?.[0]?.containerPath, "/previous-artifacts/E02");
  assert.equal(
    VmSessionStartPayloadSchema.parse(payload).reviewEvidenceMounts?.[1]?.evidenceType,
    "dataset-output"
  );
  assert.equal(VmSessionStartPayloadSchema.parse(payload).sensitiveHostPaths?.[0]?.endsWith("credential-helper.sh"), true);
  assert.equal(
    VmSessionStartCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.start",
      commandId: "session-command-1",
      ts: now,
      data: payload,
    }).messageType,
    "session.start"
  );
  assert.equal(
    VmSessionStartedResponseEnvelopeSchema.parse({
      ok: true,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.started",
      commandId: "session-command-1",
      ts: now,
      data: {
        commandId: "session-command-1",
        sessionId: "session-1",
        workspaceId: "workspace-1",
        vmHostId: "vm-1",
        codexThreadId: "thread-1",
        codexTurnId: null,
        vmEventStreamId: "event-stream-1",
        vmEventSeqBoundary: 2,
        pendingLogicalTurnRetry: payload.pendingLogicalTurnRetry,
        transport: "stdio",
        runtimeMetadata: { codexVersion: "0.143.0" },
      },
    }).data.pendingLogicalTurnRetry?.metadata.attempt,
    2
  );
  assert.equal(
    VmSessionEventPayloadSchema.parse({
      seq: 0,
      vmEventStreamId: "event-stream-1",
      sessionId: "session-1",
      workspaceId: "workspace-1",
      vmHostId: "vm-1",
      eventType: "turn.started",
      codexThreadId: "thread-1",
      codexTurnId: "turn-1",
      payload: { status: "running" },
      rawPayload: { method: "turn/started" },
    }).vmEventStreamId,
    "event-stream-1"
  );
  assert.equal(
    VmSessionEventPayloadSchema.parse({
      seq: 1,
      sessionId: "session-1",
      workspaceId: "workspace-1",
      vmHostId: "vm-1",
      eventType: "session.error",
      codexThreadId: "thread-1",
      codexTurnId: "turn-1",
      payload: { message: "Codex turn failed" },
      rawPayload: { method: "error" },
    }).eventType,
    "session.error"
  );
  assert.equal(
    VmSessionEventPayloadSchema.parse({
      seq: 2,
      sessionId: "session-1",
      workspaceId: "workspace-1",
      vmHostId: "vm-1",
      eventType: "command.output.delta",
      codexThreadId: "thread-1",
      codexTurnId: "turn-1",
      itemId: "item-1",
      payload: { delta: "stdout line\n" },
      rawPayload: { method: "item/commandExecution/outputDelta" },
    }).eventType,
    "command.output.delta"
  );
  assert.equal(
    VmSessionEventPayloadSchema.parse({
      seq: 3,
      sessionId: "session-1",
      workspaceId: "workspace-1",
      vmHostId: "vm-1",
      eventType: "message.completed",
      codexThreadId: "thread-1",
      codexTurnId: "turn-1",
      itemId: "message-1",
      payload: { text: "done" },
      rawPayload: { method: "item/completed" },
    }).eventType,
    "message.completed"
  );
  assert.equal(
    VmSessionEventPayloadSchema.parse({
      seq: 4,
      sessionId: "session-1",
      workspaceId: "workspace-1",
      vmHostId: "vm-1",
      eventType: "codex.raw",
      codexThreadId: "thread-1",
      payload: { method: "thread/tokenUsage/updated" },
      rawPayload: { method: "thread/tokenUsage/updated", params: { threadId: "thread-1" } },
    }).eventType,
    "codex.raw"
  );
  assert.equal(
    VmSessionEventPayloadSchema.parse({
      seq: 5,
      sessionId: "session-1",
      workspaceId: "workspace-1",
      vmHostId: "vm-1",
      eventType: "usage.routing.unavailable",
      codexThreadId: "thread-1",
      payload: {
        lane: "openai_api",
        attemptedFallbackLane: null,
        reason: "openai_api_quota_reached",
        message: "OpenAI API fallback quota was reached.",
        recoverable: true,
      },
      rawPayload: { method: "yp-live-workflow/usageRouting/unavailable" },
    }).eventType,
    "usage.routing.unavailable"
  );
});

test("Codex retry helpers distinguish upstream and harness-owned transient failures", () => {
  assert.equal(codexSessionEventWillRetry({ willRetry: true }), true);
  assert.equal(codexSessionEventWillRetry({
    willRetry: false,
    ypLiveWorkflowRetry: {
      owner: "yp-live-workflow",
      scheduled: true,
      classification: "server_overloaded",
      attempt: 1,
      nominalDelayMs: 5_000,
      delayMs: 4_000,
      nextRetryAt: "2026-05-19T00:00:04.000Z",
    },
  }), true);
  assert.equal(codexRetryClassification({
    error: { message: "At capacity", codexErrorInfo: "serverOverloaded" },
  }), "server_overloaded");
  assert.equal(codexRetryClassification({
    error: { message: "Credits depleted", codexErrorInfo: "usageLimitExceeded" },
  }), "usage_limit");
  assert.equal(codexRetryClassification({
    error: { message: "Invalid request", codexErrorInfo: "badRequest" },
  }), null);
  assert.equal(codexRetryClassification({
    error: {
      message: "Request failed",
      codexErrorInfo: { httpConnectionFailed: { httpStatusCode: 400 } },
    },
  }), null);
  assert.equal(codexRetryClassification({
    error: {
      message: "Authentication failed",
      codexErrorInfo: { responseStreamConnectionFailed: { httpStatusCode: 401 } },
    },
  }), null);
  assert.equal(codexRetryClassification({
    error: {
      message: "Request timed out",
      codexErrorInfo: { httpConnectionFailed: { httpStatusCode: 408 } },
    },
  }), "transient_connection");
  assert.equal(codexRetryClassification({
    error: {
      message: "Rate limited",
      codexErrorInfo: { responseStreamDisconnected: { httpStatusCode: 429 } },
    },
  }), "usage_limit");
  assert.equal(codexRetryClassification({
    error: {
      message: "Upstream unavailable",
      codexErrorInfo: { responseTooManyFailedAttempts: { httpStatusCode: 503 } },
    },
  }), "internal_server_error");
  assert.equal(codexRetryClassification({
    error: {
      message: "Connection failed",
      codexErrorInfo: { httpConnectionFailed: { httpStatusCode: null } },
    },
  }), "transient_connection");
});

test("A3 dataset promoted payloads include mounted-file inventory status", () => {
  const payload = VmDatasetPromotedPayloadSchema.parse({
    ok: true,
    commandId: "dataset-promote-command-1",
    workspaceId,
    vmHostId,
    datasetVersionId: runStepId,
    hotPath: "/mnt/datasets-hot/reference",
    uri: "file:///mnt/datasets-hot/reference",
    sourcePath: "/mnt/experiments/reference",
    promotedAt: now,
    sizeBytes: 5000,
    mountedFiles: ["file-000.txt"],
    mountedFileCount: 501,
    mountedFilesTruncated: true,
  });

  assert.equal(payload.mountedFileCount, 501);
  assert.equal(payload.mountedFilesTruncated, true);
});

test("A3 dataset output normalization payloads capture chmod mode", () => {
  const envelope = VmDatasetOutputNormalizeCommandEnvelopeSchema.parse({
    protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
    messageType: "dataset.output.normalize",
    commandId: "dataset-normalize-command-1",
    ts: now,
    data: {
      commandId: "dataset-normalize-command-1",
      workspaceId,
      vmHostId,
      sourcePath: "/mnt/datasets-hot/outputs/groups/201/experiments/dataset/reference",
      allowedSourceRootPath: "/mnt/datasets-hot/outputs/groups/201/experiments/dataset",
      sessionId,
      metadata: { datasetSlug: "reference" },
    },
  });
  const payload = VmDatasetOutputNormalizedPayloadSchema.parse({
    ok: true,
    commandId: envelope.commandId,
    workspaceId,
    vmHostId,
    sourcePath: envelope.data.sourcePath,
    normalizedAt: now,
    mode: "container_fallback",
    fileCount: 2,
    directoryCount: 1,
  });

  assert.equal(envelope.messageType, "dataset.output.normalize");
  assert.equal(payload.mode, "container_fallback");
  assert.equal(payload.fileCount, 2);
});

test("A4 VM session events require monotonic sequence fields", () => {
  assert.equal(
    VmSessionEventPayloadSchema.parse({
      seq: 0,
      sessionId,
      workspaceId,
      vmHostId,
      eventType: "turn.started",
      codexThreadId: "thread-1",
      codexTurnId: "turn-1",
      payload: { status: "running" },
      rawPayload: { method: "turn/started" },
    }).seq,
    0
  );

  for (const invalidSeq of [undefined, -1, 1.5]) {
    const candidate: Record<string, unknown> = {
      seq: invalidSeq,
      sessionId,
      workspaceId,
      vmHostId,
      eventType: "turn.started",
      payload: { status: "running" },
    };

    if (invalidSeq === undefined) {
      delete candidate.seq;
    }

    assert.equal(VmSessionEventPayloadSchema.safeParse(candidate).success, false);
  }
});

test("A4 browser session command data schemas accept user intent only", () => {
  const textInput = { type: "text", text: "Continue with the next step." };

  assert.deepEqual(
    BrowserSubscribeCommandDataSchema.parse({
      topics: [`session:${sessionId}`],
      cursors: { [`session:${sessionId}`]: "session-event-cursor.v1:0" },
      includeArtifacts: false,
      snapshot: true,
      replayLimit: 100,
    }),
    {
      topics: [`session:${sessionId}`],
      cursors: { [`session:${sessionId}`]: "session-event-cursor.v1:0" },
      includeArtifacts: false,
      snapshot: true,
      replayLimit: 100,
    }
  );
  assert.equal(
    BrowserUnsubscribeCommandDataSchema.parse({ topic: `session:${sessionId}` }).topic,
    `session:${sessionId}`
  );
  assert.equal(
    BrowserSessionTurnStartCommandDataSchema.parse({
      sessionId,
      input: [textInput],
      overrides: { model: DefaultCodexModel },
    }).overrides?.model,
    DefaultCodexModel
  );
  assert.throws(
    () => BrowserSessionTurnStartCommandDataSchema.parse({
      sessionId,
      input: [textInput],
      conversationMetadata: {
        actorType: "chief_scientist",
        source: "chief_scientist_state_machine",
        chiefDecision: { action: "continue" },
      },
    }),
    /conversationMetadata/u
  );
  assert.equal(
    BrowserSessionTurnSteerCommandDataSchema.parse({
      sessionId,
      codexTurnId: "turn-1",
      input: [textInput],
    }).codexTurnId,
    "turn-1"
  );
  assert.throws(
    () => BrowserSessionTurnSteerCommandDataSchema.parse({
      sessionId,
      codexTurnId: "turn-1",
      input: [textInput],
      conversationMetadata: { actorType: "user" },
    }),
    /conversationMetadata/u
  );
  assert.equal(
    BrowserSessionInterruptCommandDataSchema.parse({
      sessionId,
      codexTurnId: "turn-1",
    }).codexTurnId,
    "turn-1"
  );
  assert.equal(
    BrowserSessionInjectItemsCommandDataSchema.parse({
      sessionId,
      items: [{ type: "note", text: "context" }],
    }).items.length,
    1
  );
  assert.equal(
    BrowserSessionReviewStartCommandDataSchema.parse({
      sessionId,
      target: { type: "baseBranch", branch: "main" },
      delivery: "inline",
    }).target.type,
    "baseBranch"
  );

  for (const schema of [
    BrowserSessionTurnStartCommandDataSchema,
    BrowserSessionTurnSteerCommandDataSchema,
    BrowserSessionInterruptCommandDataSchema,
    BrowserSessionInjectItemsCommandDataSchema,
    BrowserSessionReviewStartCommandDataSchema,
  ]) {
    assert.equal(
      schema.safeParse({
        sessionId,
        input: [textInput],
        items: [],
        target: { type: "uncommittedChanges" },
        commandId: "trusted-command-id",
      }).success,
      false
    );
    assert.equal(
      schema.safeParse({
        sessionId,
        input: [textInput],
        items: [],
        target: { type: "uncommittedChanges" },
        vmHostId,
      }).success,
      false
    );
    assert.equal(
      schema.safeParse({
        sessionId,
        input: [textInput],
        items: [],
        target: { type: "uncommittedChanges" },
        controlBaseUrl: "http://127.0.0.1:4789",
      }).success,
      false
    );
  }

  assert.equal(BrowserSessionTurnStartCommandDataSchema.safeParse({ sessionId, input: [] }).success, false);
  assert.equal(BrowserSessionInterruptCommandDataSchema.safeParse({ sessionId: "" }).success, false);
  assert.equal(BrowserSubscribeCommandDataSchema.safeParse({ cursor: "wrong-field" }).success, false);
  assert.equal(BrowserSubscribeCommandDataSchema.safeParse({ replayLimit: 0 }).success, false);
});

test("A4 session snapshot and history schemas describe replayable history", () => {
  const event = sampleAgentSessionEvent(0);
  const snapshot = SessionSnapshotPayloadSchema.parse({
    session: sampleAgentSessionRef(),
    lastSeq: 0,
    cursor: "session-event-cursor.v1:0",
    generatedAt: now,
    events: [event],
    pendingApprovals: [sampleApprovalTask()],
    artifacts: [sampleArtifact()],
  });

  assert.equal(snapshot.session.id, sessionId);
  assert.equal(snapshot.events?.[0]?.seq, 0);
  assert.equal(
    SessionHistoryQuerySchema.parse({
      cursor: snapshot.cursor,
      afterSeq: 0,
      limit: 100,
      includeRawTrace: false,
    }).limit,
    100
  );
  assert.equal(
    SessionHistoryResponseSchema.parse({
      events: [event, sampleAgentSessionEvent(1)],
      lastSeq: 1,
      nextCursor: "session-event-cursor.v1:1",
    }).lastSeq,
    1
  );
  assert.equal(
    SessionConversationHistoryQuerySchema.parse({
      view: "conversation",
      before: "conversation-cursor",
      limit: 20,
    }).before,
    "conversation-cursor"
  );
  assert.deepEqual(
    SessionConversationHistoryPageSchema.parse({
      events: [event],
      olderCursor: "older-conversation-cursor",
      hasOlder: true,
    }).events.map((item) => item.seq),
    [0]
  );

  assert.equal(
    SessionSnapshotPayloadSchema.safeParse({
      session: sampleAgentSessionRef(),
      lastSeq: 0,
      generatedAt: now,
    }).success,
    false
  );
  assert.equal(
    SessionSnapshotPayloadSchema.safeParse({
      session: sampleAgentSessionRef(),
      lastSeq: 1.25,
      cursor: "session-event-cursor.v1:0",
      generatedAt: now,
    }).success,
    false
  );
  assert.equal(
    SessionSnapshotPayloadSchema.safeParse({
      session: sampleAgentSessionRef(),
      lastSeq: 0,
      cursor: "session-event-cursor.v1:0",
      generatedAt: "not-a-date",
    }).success,
    false
  );
  assert.equal(SessionHistoryQuerySchema.safeParse({ afterSeq: -1 }).success, false);
  assert.equal(SessionHistoryQuerySchema.safeParse({ limit: 0 }).success, false);
  assert.equal(SessionHistoryQuerySchema.safeParse({ cursor: "" }).success, false);
  assert.equal(SessionConversationHistoryQuerySchema.safeParse({ view: "events" }).success, false);
  assert.equal(SessionConversationHistoryQuerySchema.safeParse({ view: "conversation", limit: 101 }).success, false);
  assert.equal(SessionConversationHistoryPageSchema.safeParse({ events: [], olderCursor: null }).success, false);
  assert.equal(
    SessionConversationHistoryPageSchema.safeParse({ events: [], olderCursor: null, hasOlder: true }).success,
    false
  );
});

test("A4 VM broker websocket frame contracts parse specialized envelopes", () => {
  assert.equal(
    VmBrokerHelloEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "vm.broker.hello",
      ts: now,
      data: {
        vmHostId,
        connectionId: "connection-1",
        capabilities: { codexAppServer: true },
        metadata: { region: "local" },
      },
    }).data.connectionId,
    "connection-1"
  );
  assert.equal(
    VmBrokerHelloAckEnvelopeSchema.parse({
      ok: true,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "vm.broker.hello.ack",
      ts: now,
      data: {
        ok: true,
        vmHostId,
        connectionId: "connection-1",
      },
    }).data.ok,
    true
  );
  assert.equal(
    VmBrokerCommandErrorEnvelopeSchema.parse({
      ok: false,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "vm.command.error",
      commandId: "command-1",
      ts: now,
      data: {
        ok: false,
        commandId: "command-1",
        messageType: "session.turn.start",
        sessionId,
        code: "codex_session_not_active",
        message: "Codex session is not warm",
        details: { retryable: true },
      },
    }).data.messageType,
    "session.turn.start"
  );

  assert.equal(
    VmBrokerCommandErrorEnvelopeSchema.safeParse({
      ok: false,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "vm.command.error",
      commandId: "",
      ts: now,
      data: {
        ok: false,
        commandId: "",
        messageType: "session.turn.start",
        code: "failed",
        message: "failed",
      },
    }).success,
    false
  );
  assert.equal(
    VmBrokerCommandErrorEnvelopeSchema.safeParse({
      ok: false,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "vm.command.error",
      commandId: "command-1",
      ts: now,
      data: {
        ok: false,
        commandId: "other-command",
        messageType: "session.turn.start",
        code: "failed",
        message: "failed",
      },
    }).success,
    false
  );
});

test("A3 aux terminal command and backlog payloads parse", () => {
  const browserSessionId = "11111111-1111-4111-8111-111111111111";
  assert.equal(
    BrowserSessionApprovalRespondCommandDataSchema.parse({
      approvalTaskId: "77777777-7777-4777-8777-777777777777",
      status: "approved",
      result: { decision: "approved" },
    }).approvalTaskId,
    "77777777-7777-4777-8777-777777777777"
  );
  assert.equal(
    BrowserAuxTerminalOpenCommandDataSchema.parse({
      sessionId: browserSessionId,
      cols: 120,
      rows: 32,
    }).cols,
    120
  );
  assert.equal(
    BrowserAuxTerminalInputCommandDataSchema.parse({
      sessionId: browserSessionId,
      terminalId: "terminal-1",
      data: "ls\n",
    }).data,
    "ls\n"
  );
  assert.equal(
    BrowserAuxTerminalResizeCommandDataSchema.parse({
      sessionId: browserSessionId,
      terminalId: "terminal-1",
      cols: 100,
      rows: 30,
    }).rows,
    30
  );
  assert.equal(
    BrowserAuxTerminalCloseCommandDataSchema.parse({
      sessionId: browserSessionId,
      terminalId: "terminal-1",
    }).terminalId,
    "terminal-1"
  );

  const openEnvelope = VmAuxTerminalOpenCommandEnvelopeSchema.parse({
    protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
    messageType: "session.aux_terminal.open",
    commandId: "terminal-command-1",
    ts: now,
    data: {
      commandId: "terminal-command-1",
      sessionId: "session-1",
      cols: 120,
      rows: 32,
    },
  });
  const opened = VmAuxTerminalOpenedPayloadSchema.parse({
    commandId: openEnvelope.commandId,
    sessionId: "session-1",
    terminalId: "terminal-1",
    runtime: "container",
    cwd: "/mnt/experiments/run/workspace",
    shell: "/bin/bash",
    pid: 123,
    openedAt: now,
    cols: 120,
    rows: 32,
    backlog: [],
  });
  const chunk = VmAuxTerminalChunkPayloadSchema.parse({
    sessionId: "session-1",
    terminalId: opened.terminalId,
    seq: 0,
    stream: "stdout",
    data: "hello\n",
    ts: now,
  });

  assert.equal(opened.terminalId, "terminal-1");
  assert.equal(opened.runtime, "container");
  assert.equal(
    VmAuxTerminalInputCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.aux_terminal.input",
      commandId: "terminal-command-2",
      ts: now,
      data: {
        commandId: "terminal-command-2",
        sessionId: "session-1",
        terminalId: opened.terminalId,
        data: "ls\n",
      },
    }).data.data,
    "ls\n"
  );
  assert.equal(
    VmAuxTerminalResizeCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.aux_terminal.resize",
      commandId: "terminal-command-3",
      ts: now,
      data: {
        commandId: "terminal-command-3",
        sessionId: "session-1",
        terminalId: opened.terminalId,
        cols: 100,
        rows: 30,
      },
    }).data.cols,
    100
  );
  assert.equal(
    VmAuxTerminalCloseCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.aux_terminal.close",
      commandId: "terminal-command-4",
      ts: now,
      data: {
        commandId: "terminal-command-4",
        sessionId: "session-1",
        terminalId: opened.terminalId,
      },
    }).data.terminalId,
    "terminal-1"
  );
  assert.equal(
    VmAuxTerminalAckPayloadSchema.parse({
      ok: true,
      commandId: "terminal-command-2",
      sessionId: "session-1",
      terminalId: opened.terminalId,
    }).ok,
    true
  );
  assert.equal(
    VmAuxTerminalClosedPayloadSchema.parse({
      ok: true,
      commandId: "terminal-command-4",
      sessionId: "session-1",
      terminalId: opened.terminalId,
      closed: true,
      exitCode: 0,
      signal: null,
    }).closed,
    true
  );
  assert.equal(
    VmAuxTerminalBacklogPayloadSchema.parse({
      sessionId: "session-1",
      terminalId: opened.terminalId,
      chunks: [chunk],
      closed: false,
    }).chunks[0]?.data,
    "hello\n"
  );
});

test("A3 Codex session control command payloads parse", () => {
  const sessionId = "session-1";
  const textInput = VmCodexUserInputSchema.parse({ type: "text", text: "Continue with the next step." });

  assert.equal(textInput.type, "text");
  assert.equal(
    VmSessionResumeCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.resume",
      commandId: "resume-command-1",
      ts: now,
      data: {
        commandId: "resume-command-1",
        sessionId,
        codexThreadId: "thread-1",
        persistExtendedHistory: false,
        overrides: { model: DefaultCodexModel },
      },
    }).data.codexThreadId,
    "thread-1"
  );
  assert.equal(
    VmSessionPauseCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.pause",
      commandId: "pause-command-1",
      ts: now,
      data: {
        commandId: "pause-command-1",
        sessionId,
        codexThreadId: "thread-1",
        codexTurnId: "turn-1",
        interruptActiveTurn: true,
        keepWarm: true,
        reason: "operator hold",
      },
    }).data.keepWarm,
    true
  );
  assert.equal(
    VmSessionThreadForkCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.thread.fork",
      commandId: "fork-command-1",
      ts: now,
      data: {
        commandId: "fork-command-1",
        sessionId,
        codexThreadId: "thread-1",
        persistExtendedHistory: true,
        overrides: { model: DefaultCodexModel },
      },
    }).messageType,
    "session.thread.fork"
  );
  assert.equal(
    VmSessionTurnStartCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.turn.start",
      commandId: "turn-start-command-1",
      ts: now,
      data: {
        commandId: "turn-start-command-1",
        sessionId,
        codexThreadId: "thread-1",
        input: [textInput],
      },
    }).data.input[0]?.text,
    "Continue with the next step."
  );
  assert.equal(
    VmSessionTurnSteerCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.turn.steer",
      commandId: "turn-steer-command-1",
      ts: now,
      data: {
        commandId: "turn-steer-command-1",
        sessionId,
        codexThreadId: "thread-1",
        codexTurnId: "turn-1",
        input: [{ type: "text", text: "Narrow the implementation." }],
      },
    }).data.codexTurnId,
    "turn-1"
  );
  assert.equal(
    VmSessionInterruptCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.interrupt",
      commandId: "interrupt-command-1",
      ts: now,
      data: {
        commandId: "interrupt-command-1",
        sessionId,
        codexThreadId: "thread-1",
        codexTurnId: "turn-1",
      },
    }).messageType,
    "session.interrupt"
  );
  assert.equal(
    VmSessionInterruptCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.interrupt",
      commandId: "interrupt-retry-command-1",
      ts: now,
      data: {
        commandId: "interrupt-retry-command-1",
        sessionId,
        codexThreadId: "thread-1",
      },
    }).data.codexTurnId,
    undefined
  );
  assert.equal(
    VmSessionInjectItemsCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.inject_items",
      commandId: "inject-command-1",
      ts: now,
      data: {
        commandId: "inject-command-1",
        sessionId,
        codexThreadId: "thread-1",
        items: [{ type: "note", text: "context" }],
      },
    }).data.items.length,
    1
  );
  assert.equal(
    VmSessionApprovalRespondCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.approval.respond",
      commandId: "approval-command-1",
      ts: now,
      data: {
        commandId: "approval-command-1",
        sessionId,
        requestId: 41,
        result: { decision: "approve" },
      },
    }).data.requestId,
    41
  );
  assert.equal(
    VmSessionReviewStartCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.review.start",
      commandId: "review-command-1",
      ts: now,
      data: {
        commandId: "review-command-1",
        sessionId,
        codexThreadId: "thread-1",
        target: { type: "baseBranch", branch: "main" },
        delivery: "inline",
      },
    }).data.target.type,
    "baseBranch"
  );
  assert.equal(
    VmSessionTerminateCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.terminate",
      commandId: "terminate-command-1",
      ts: now,
      data: {
        commandId: "terminate-command-1",
        sessionId,
      },
    }).messageType,
    "session.terminate"
  );
  assert.equal(
    VmWorkspaceArchiveCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "workspace.archive",
      commandId: "archive-command-1",
      ts: now,
      data: {
        commandId: "archive-command-1",
        sessionId,
        workspaceId: "workspace-1",
      },
    }).messageType,
    "workspace.archive"
  );
  assert.equal(
    VmSessionCommandAckResponseEnvelopeSchema.parse({
      ok: true,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.thread.fork",
      commandId: "fork-command-1",
      ts: now,
      data: {
        ok: true,
        commandId: "fork-command-1",
        sessionId,
        codexThreadId: "thread-2",
        result: { thread: { id: "thread-2" } },
      },
    }).data.codexThreadId,
    "thread-2"
  );

  assert.equal(
    VmSessionTurnStartCommandEnvelopeSchema.safeParse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.turn.start",
      commandId: "turn-start-command-1",
      ts: now,
      data: {
        commandId: "other-command",
        sessionId,
        codexThreadId: "thread-1",
        input: [textInput],
      },
    }).success,
    false
  );
  assert.equal(
    VmSessionApprovalRespondCommandEnvelopeSchema.safeParse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.approval.respond",
      commandId: "approval-command-1",
      ts: now,
      data: {
        commandId: "approval-command-1",
        sessionId,
        requestId: "approval-1",
        result: { decision: "approve" },
        error: { code: -32000, message: "rejected" },
      },
    }).success,
    false
  );
  assert.equal(
    VmSessionApprovalRespondCommandEnvelopeSchema.safeParse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.approval.respond",
      commandId: "approval-command-1",
      ts: now,
      data: {
        commandId: "approval-command-1",
        sessionId,
        requestId: "approval-1",
      },
    }).success,
    false
  );
});

test("A3 artifact collect command and collected response payloads parse", () => {
  const payload = ArtifactCollectPayloadSchema.parse({
    commandId: "artifact-command-1",
    sessionId: "session-1",
    runId: "run-1",
    runStepId: "step-1",
    workspaceId: "workspace-1",
    vmHostId: "vm-1",
    artifactsPath: "/mnt/experiments/domain/community/group/experiment/artifacts",
    includeGlobs: ["**/*.csv", "**/*.log"],
    excludeGlobs: ["tmp/**"],
    upload: true,
    knownArtifacts: [
      {
        relativePath: "results/table.csv",
        checksumSha256: "a".repeat(64),
        objectUri: "gs://private-artifacts/artifacts/runs/run-1/steps/step-1/sessions/session-1/results/table.csv",
      },
    ],
  });
  const response = ArtifactCollectResponsePayloadSchema.parse({
    commandId: payload.commandId,
    sessionId: payload.sessionId,
    runId: payload.runId,
    runStepId: payload.runStepId,
    workspaceId: payload.workspaceId,
    vmHostId: payload.vmHostId,
    artifactsPath: payload.artifactsPath,
    uploadEnabled: true,
    collectedAt: now,
    artifacts: [
      {
        relativePath: "results/table.csv",
        localPath: "/mnt/experiments/domain/community/group/experiment/artifacts/results/table.csv",
        localUri: "file:///mnt/experiments/domain/community/group/experiment/artifacts/results/table.csv",
        objectUri: "gs://private-artifacts/artifacts/runs/run-1/steps/step-1/sessions/session-1/results/table.csv",
        kind: "table",
        contentType: "text/csv",
        sizeBytes: 42,
        checksumSha256: "a".repeat(64),
        collectedAt: now,
      },
    ],
  });

  assert.equal(response.artifacts[0]?.kind, "table");
  assert.equal(
    VmArtifactCollectCommandEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "artifact.collect",
      commandId: "artifact-command-1",
      ts: now,
      data: payload,
    }).messageType,
    "artifact.collect"
  );
  assert.equal(
    VmArtifactCollectedResponseEnvelopeSchema.parse({
      ok: true,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "artifact.ready",
      commandId: "artifact-command-1",
      ts: now,
      data: response,
    }).data.artifacts[0]?.relativePath,
    "results/table.csv"
  );
});

test("VM agent payload schemas reject unsupported or incomplete payloads", () => {
  assert.equal(VmRegisterPayloadSchema.safeParse({ capabilities: {} }).success, false);
  assert.equal(VmHeartbeatPayloadSchema.safeParse({ status: "available" }).success, false);
  assert.equal(VmTelemetryPayloadSchema.safeParse({ vmHostId: "vm-1" }).success, false);
  assert.equal(
    WorkspacePreparePayloadSchema.safeParse({
      commandId: "command-1",
      auditContext: {
        commandId: "other-command",
        requestedByUserId: 13,
        groupId: "42",
        experimentId: "experiment-1",
        workspaceId: "workspace-1",
        vmHostId: "vm-1",
        requestedAt: now,
      },
      workspaceId: "workspace-1",
      vmHostId: "vm-1",
      rootPath: "/mnt/experiments/experiment",
    }).success,
    false
  );
  assert.equal(
    WorkspacePreparePayloadSchema.safeParse({
      commandId: "command-1",
      auditContext: {
        commandId: "command-1",
        requestedByUserId: 13,
        groupId: "42",
        experimentId: "experiment-1",
        workspaceId: "workspace-1",
        vmHostId: "vm-1",
        requestedAt: now,
      },
      workspaceId: "workspace-1",
      vmHostId: "vm-1",
      rootPath: "/mnt/experiments/experiment",
      materialization: { files: [{ path: "../escape.md", content: "bad" }] },
    }).success,
    false
  );
  assert.equal(
    WorkspacePreparePayloadSchema.safeParse({
      commandId: "command-1",
      auditContext: {
        commandId: "command-1",
        requestedByUserId: 13,
        groupId: "42",
        experimentId: "experiment-1",
        workspaceId: "workspace-1",
        vmHostId: "vm-1",
        requestedAt: now,
      },
      workspaceId: "workspace-1",
      vmHostId: "vm-1",
      rootPath: "/mnt/experiments/experiment",
      materialization: { cacheFiles: [{ path: "../escape", content: "bad", mode: 0o755 }] },
    }).success,
    false
  );
  assert.equal(
    WorkspacePreparePayloadSchema.safeParse({
      commandId: "command-1",
      auditContext: {
        commandId: "command-1",
        requestedByUserId: 13,
        groupId: "42",
        experimentId: "experiment-1",
        workspaceId: "workspace-1",
        vmHostId: "vm-1",
        requestedAt: now,
      },
      workspaceId: "workspace-1",
      vmHostId: "vm-1",
      rootPath: "/mnt/experiments/experiment",
      materialization: { files: [{ path: "papers/example.pdf", contentBase64: "abc" }] },
    }).success,
    false
  );
  assert.equal(
    VmAgentAckPayloadSchema.safeParse({
      ok: true,
      vmHostId: "vm-1",
      messageType: "session.start",
    }).success,
    false
  );
});

test("websocket envelope validation rejects protocol and message drift", () => {
  assert.throws(() =>
    ClientWsEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.snapshot",
      ts: now,
      data: {},
    })
  );

  assert.throws(() =>
    VmWsEnvelopeSchema.parse({
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.snapshot",
      ts: now,
      data: {},
    })
  );
});

test("review packet and chief scientist decision schemas accept canonical samples", () => {
  const packet: ReviewPacket = {
    id: "packet-1",
    boundaryId: "boundary-1",
    experimentId: "experiment-1",
    sessionId: "session-1",
    objective: "Verify the session boundary contract.",
    summary: "A Codex turn completed and needs review.",
    pendingApproval: {
      requestId: "approval-1",
      kind: "command_execution",
    },
    policySnapshot: {
      humanOnly: false,
    },
  };

  const decision: ChiefScientistDecision = {
    id: "decision-1",
    reviewPacketId: packet.id,
    action: "continue",
    confidence: 0.82,
    summary: "Continue with a narrower next step.",
    rationale: "The packet is complete enough for model-side steering.",
    codexMessage: "Narrow the implementation to the protocol contract first.",
  };

  assert.equal(ReviewPacketSchema.parse(packet).id, packet.id);
  assert.equal(ChiefScientistDecisionSchema.parse(decision).id, decision.id);
  assert.equal(
    ChiefScientistDecisionSchema.parse({ ...decision, action: "request_human_review" }).action,
    "request_human_review"
  );
  assert.equal(
    ChiefScientistDecisionSchema.parse({ ...decision, action: "finish_experiment" }).action,
    "finish_experiment"
  );
});

test("live scope snapshots preserve pending human review summaries", () => {
  const parsed = LiveScopeSnapshotSchema.parse({
    scope: { type: "domain", id: "7" },
    generatedAt: now,
    activeCount: 1,
    reviewRequiredCount: 1,
    rows: [{
      kind: "experiment",
      id: "experiment:44444444-4444-4444-8444-444444444444",
      groupId: 42,
      groupName: "Cancer Biology",
      experimentId: "44444444-4444-4444-8444-444444444444",
      experimentName: "Review target",
      activeRunCount: 1,
      currentRunIds: ["22222222-2222-4222-8222-222222222222"],
      currentSessionIds: [],
      artifactCount: 0,
      totalCost: 0,
      wallTimeMs: 1,
      currentRunStatus: "failed",
      running: false,
      failure: {
        runId: "22222222-2222-4222-8222-222222222222",
        runStepId: "33333333-3333-4333-8333-333333333333",
        message: "codex_session_failed",
        failedAt: now,
      },
      humanReview: {
        pendingCaseCount: 2,
        highestPriority: "critical",
        oldestRequestedAt: now,
        reviewCaseId: "13131313-1313-4131-8131-131313131313",
      },
    }],
    readyRows: [],
    finalReviewRows: [{
      id: "final-review:43",
      groupId: 43,
      groupName: "Completed cohort",
      status: "failed",
    }],
  });

  assert.equal(parsed.reviewRequiredCount, 1);
  assert.equal(parsed.rows[0]?.currentRunStatus, "failed");
  assert.equal(parsed.rows[0]?.failure?.message, "codex_session_failed");
  assert.equal(parsed.rows[0]?.humanReview?.pendingCaseCount, 2);
  assert.equal(parsed.finalReviewRows[0]?.status, "failed");
  assert.deepEqual(parsed.heldRows, []);
  assert.equal(parsed.heldCount, 0);
  assert.throws(() => LiveScopeSnapshotSchema.parse({
    ...parsed,
    rows: [{ ...parsed.rows[0], currentRunStatus: "completed" }],
  }));
});

test("live Running rows preserve distinct payment lanes, owner-safe accounts, and quota counters", () => {
  const parsed = LiveScopeSnapshotSchema.parse({
    scope: { type: "group", id: "42" },
    generatedAt: now,
    activeCount: 1,
    reviewRequiredCount: 0,
    rows: [{
      kind: "experiment",
      id: "experiment:44444444-4444-4444-8444-444444444444",
      groupId: 42,
      groupName: "Cancer Biology",
      experimentId: "44444444-4444-4444-8444-444444444444",
      experimentName: "Running target",
      activeRunCount: 1,
      currentRunIds: ["22222222-2222-4222-8222-222222222222"],
      currentSessionIds: ["11111111-1111-4111-8111-111111111111"],
      artifactCount: 0,
      totalCost: 0,
      wallTimeMs: 1,
      currentRunStatus: "running",
      running: true,
      humanReview: null,
      billingSummaries: [{
        activeLane: "chatgpt_plan",
        apiFallback: false,
        accountEmail: "scientist@example.test",
        quota: [{
          id: "16161616-1616-4616-8616-161616161616",
          authProfileId: "15151515-1515-4515-8515-151515151515",
          provider: "openai",
          planType: "pro",
          limitId: "codex",
          limitName: "Codex",
          usedPercent: 2,
          windowDurationMins: 300,
          resetsAt: null,
          rateLimitReachedType: null,
          credits: null,
          rawSnapshot: {},
          observedAt: now,
          createdAt: now,
          updatedAt: now,
        }],
      }, {
        activeLane: "openai_api",
        apiFallback: false,
        quota: [],
      }],
    }],
    readyRows: [],
    finalReviewRows: [],
  });

  assert.equal(parsed.rows[0]?.billingSummaries?.[0]?.accountEmail, "scientist@example.test");
  assert.equal(parsed.rows[0]?.billingSummaries?.[0]?.quota[0]?.windowDurationMins, 300);
  assert.equal(parsed.rows[0]?.billingSummaries?.[1]?.activeLane, "openai_api");
});

test("group lifecycle schemas validate transitions and held Live rows", () => {
  assert.equal(GroupLifecycleStatusSchema.parse("on_hold"), "on_hold");
  assert.deepEqual(UpdateGroupLifecycleInputSchema.parse({
    status: "on_hold",
    reason: "Waiting for data",
    revisitAt: now,
  }), {
    status: "on_hold",
    reason: "Waiting for data",
    revisitAt: now,
  });

  const parsed = LiveScopeSnapshotSchema.parse({
    scope: { type: "community", id: "42" },
    generatedAt: now,
    activeCount: 0,
    reviewRequiredCount: 0,
    rows: [],
    readyRows: [],
    finalReviewRows: [],
    heldCount: 1,
    heldRows: [{
      id: "group:42",
      groupId: 42,
      groupName: "Waiting cohort",
      lifecycleStatus: "on_hold",
      lifecycleReason: "Waiting for data",
      lifecycleRevisitAt: now,
      lifecycleChangedAt: now,
      activeRunCount: 0,
      currentRunIds: [],
      currentSessionIds: [],
      humanReview: null,
      canManageLifecycle: true,
    }],
  });

  assert.equal(parsed.heldRows?.[0]?.lifecycleStatus, "on_hold");
  assert.throws(() => UpdateGroupLifecycleInputSchema.parse({ status: "paused" }));
});
