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
import {
  CodexDiffSummarySchema,
  CodexPlanStepSchema,
  type CodexDiffSummary,
  type CodexPlanStep,
} from "./session.js";
import {
  PromptTemplateReferenceSchema,
  ResearcherModelSelectorSchema,
  WorkflowModelRosterMemberSchema,
  type DynamicCodexReasoningEffort,
  type PromptTemplateReference,
  type ResearcherModelSelector,
  type WorkflowModelRosterMember,
} from "./workflow.js";

export const StepBoundaryTriggers = [
  "codex_question",
  "approval_requested",
  "turn_completed",
  "turn_stalled",
  "review_completed",
  "repeated_failure",
  "plan_drift",
  "suspicious_result",
  "finding_detected",
  "success_reached",
  "manual_checkpoint",
] as const;

export type StepBoundaryTrigger = (typeof StepBoundaryTriggers)[number];

export interface AgentStepBoundary {
  id: UUID;
  sessionId: UUID;
  runId: UUID;
  runStepId: UUID;
  trigger: StepBoundaryTrigger | string;
  createdAt: ISODateTime;
  status: AgentStepBoundaryStatus | string;
  snapshot: Record<string, Json>;
  resolvedAt?: ISODateTime | null;
  latestPlan?: CodexPlanStep[];
  latestDiff?: CodexDiffSummary;
  metadata?: Record<string, Json>;
  updatedAt: ISODateTime;
}

export const AgentStepBoundaryStatuses = ["open", "reviewing", "resolved"] as const;
export type AgentStepBoundaryStatus = (typeof AgentStepBoundaryStatuses)[number];

export const PendingApprovalKinds = [
  "command_execution",
  "file_change",
  "network_access",
  "tool_input",
] as const;

export type PendingApprovalKind = (typeof PendingApprovalKinds)[number];

export const ApprovalTaskStatuses = ["pending", "approved", "rejected", "cancelled", "resolved"] as const;
export type ApprovalTaskStatus = (typeof ApprovalTaskStatuses)[number];

export interface ApprovalTask {
  id: UUID;
  sessionId: UUID;
  requestId: string;
  kind: PendingApprovalKind | string;
  status: ApprovalTaskStatus | string;
  policyScope?: string | null;
  payload: Record<string, Json>;
  resolvedByType?: string | null;
  resolvedById?: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface ReviewPacket {
  id: UUID;
  boundaryId: UUID;
  experimentId: UUID;
  sessionId: UUID;
  objective: string;
  summary: string;
  pendingQuestion?: string;
  pendingApproval?: {
    requestId: string;
    kind: PendingApprovalKind;
    reason?: string;
  };
  plan?: CodexPlanStep[];
  diff?: CodexDiffSummary;
  changedFiles?: string[];
  recentOutput?: string[];
  artifactIds?: UUID[];
  relatedSignalIds?: UUID[];
  relatedExperimentIds?: UUID[];
  policySnapshot: Record<string, Json>;
}

// TODO: Keep the Chief review seed prompt and runtime output contract aligned with this action list.
export const ChiefScientistDecisionActions = [
  "continue",
  "answer_codex_question",
  "approve_pending_request",
  "reject_pending_request",
  "request_codex_review",
  "request_code_data_review",
  "generate_report_bundle",
  "spawn_followup_experiment",
  "pause_run",
  "finish_experiment",
  "request_human_review",
] as const;

export type ChiefScientistDecisionAction = (typeof ChiefScientistDecisionActions)[number];

export const ModelCallStatuses = ["queued", "running", "completed", "failed", "cancelled"] as const;
export type ModelCallStatus = (typeof ModelCallStatuses)[number];

export const ModelCallTerminalStatuses = ["completed", "failed", "cancelled"] as const;
export type ModelCallTerminalStatus = (typeof ModelCallTerminalStatuses)[number];

const ModelCallTerminalStatusSet: ReadonlySet<string> = new Set(ModelCallTerminalStatuses);

export function isModelCallTerminalStatus(value: unknown): value is ModelCallTerminalStatus {
  return typeof value === "string" && ModelCallTerminalStatusSet.has(value);
}

export const PlanningJobStatuses = ["queued", "running", "waiting_for_input", "completed", "failed", "cancelled"] as const;
export type PlanningJobStatus = (typeof PlanningJobStatuses)[number];

export const PlanningJobTerminalStatuses = ["completed", "failed", "cancelled"] as const;
export type PlanningJobTerminalStatus = (typeof PlanningJobTerminalStatuses)[number];

const PlanningJobTerminalStatusSet: ReadonlySet<string> = new Set(PlanningJobTerminalStatuses);

export function isPlanningJobTerminalStatus(value: unknown): value is PlanningJobTerminalStatus {
  return typeof value === "string" && PlanningJobTerminalStatusSet.has(value);
}

export const PlanningJobKinds = [
  "preview",
  "materialize",
  "group_continuation_preview",
  "group_continuation_materialize",
  "preprint_council_preview",
  "group_final_review",
  "code_data_review",
] as const;
export type PlanningJobKind = (typeof PlanningJobKinds)[number];

export const GroupFinalReviewPhases = [
  "needs_configuration",
  "reviewer_session_starting",
  "reviewer_running",
  "codex_draft_running",
  "council_running",
  "codex_revision_running",
  "distill_running",
  "lay_summary_running",
  "completed",
] as const;

export const GroupFinalReviewExecutionSystemRole = "group_final_review_execution";
export const CodeDataReviewExecutionSystemRole = "code_data_review_execution";
export type GroupFinalReviewPhase = (typeof GroupFinalReviewPhases)[number];

type GroupFinalReviewTurnPhaseDescriptorDefinition = {
  resultPhase: "reviewer_running" | "codex_draft_running" | "codex_revision_running" | "distill_running" | "lay_summary_running";
  commandPhase: "reviewer" | "preprint-draft" | "preprint-revision" | "distill" | "lay-summary";
  attemptField: "reviewerAttempt" | "draftAttempt" | "revisionAttempt" | "distillAttempt" | "laySummaryAttempt";
  turnIdField: "reviewerTurnId" | "draftTurnId" | "revisionTurnId" | "distillTurnId" | "laySummaryTurnId";
  validationKind: "reviewer" | "preprint_markdown" | "distill_html" | "lay_summary_html";
};

export const GroupFinalReviewTurnPhaseDescriptors = [
  {
    resultPhase: "reviewer_running",
    commandPhase: "reviewer",
    attemptField: "reviewerAttempt",
    turnIdField: "reviewerTurnId",
    validationKind: "reviewer",
  },
  {
    resultPhase: "codex_draft_running",
    commandPhase: "preprint-draft",
    attemptField: "draftAttempt",
    turnIdField: "draftTurnId",
    validationKind: "preprint_markdown",
  },
  {
    resultPhase: "codex_revision_running",
    commandPhase: "preprint-revision",
    attemptField: "revisionAttempt",
    turnIdField: "revisionTurnId",
    validationKind: "preprint_markdown",
  },
  {
    resultPhase: "distill_running",
    commandPhase: "distill",
    attemptField: "distillAttempt",
    turnIdField: "distillTurnId",
    validationKind: "distill_html",
  },
  {
    resultPhase: "lay_summary_running",
    commandPhase: "lay-summary",
    attemptField: "laySummaryAttempt",
    turnIdField: "laySummaryTurnId",
    validationKind: "lay_summary_html",
  },
] as const satisfies readonly GroupFinalReviewTurnPhaseDescriptorDefinition[];

export type GroupFinalReviewTurnPhaseDescriptor = (typeof GroupFinalReviewTurnPhaseDescriptors)[number];
export type GroupFinalReviewTurnResultPhase = GroupFinalReviewTurnPhaseDescriptor["resultPhase"];
export type GroupFinalReviewCommandPhase = GroupFinalReviewTurnPhaseDescriptor["commandPhase"];
export type GroupFinalReviewTurnAttemptField = GroupFinalReviewTurnPhaseDescriptor["attemptField"];
export type GroupFinalReviewTurnIdField = GroupFinalReviewTurnPhaseDescriptor["turnIdField"];
export type GroupFinalReviewValidationKind = GroupFinalReviewTurnPhaseDescriptor["validationKind"];
export type GroupFinalReviewTurnPhaseDescriptorForPhase<
  Phase extends GroupFinalReviewCommandPhase | GroupFinalReviewTurnResultPhase,
> = Phase extends GroupFinalReviewCommandPhase
  ? Extract<GroupFinalReviewTurnPhaseDescriptor, { commandPhase: Phase }>
  : Extract<GroupFinalReviewTurnPhaseDescriptor, { resultPhase: Phase }>;

const GroupFinalReviewTurnPhaseDescriptorByPhase = new Map<string, GroupFinalReviewTurnPhaseDescriptor>(
  GroupFinalReviewTurnPhaseDescriptors.flatMap((descriptor) => [
    [descriptor.resultPhase, descriptor] as const,
    [descriptor.commandPhase, descriptor] as const,
  ])
);

export function getGroupFinalReviewTurnPhaseDescriptor<
  Phase extends GroupFinalReviewCommandPhase | GroupFinalReviewTurnResultPhase,
>(value: Phase): GroupFinalReviewTurnPhaseDescriptorForPhase<Phase>;
export function getGroupFinalReviewTurnPhaseDescriptor(value: unknown): GroupFinalReviewTurnPhaseDescriptor | null;
export function getGroupFinalReviewTurnPhaseDescriptor(value: unknown): GroupFinalReviewTurnPhaseDescriptor | null {
  return typeof value === "string" ? GroupFinalReviewTurnPhaseDescriptorByPhase.get(value) ?? null : null;
}

export function groupFinalReviewTurnAttempt(
  result: GroupFinalReviewActiveResult,
  descriptor: GroupFinalReviewTurnPhaseDescriptor
): number {
  return result[descriptor.attemptField] ?? 1;
}

export function groupFinalReviewEditorialRevisionCommandAttempt(
  ratificationRound: 1 | 2 | 3,
  validationAttempt: number
): number {
  return ratificationRound * 100 + validationAttempt;
}

export function groupFinalReviewTurnCommandAttempt(
  result: GroupFinalReviewActiveResult,
  descriptor: GroupFinalReviewTurnPhaseDescriptor
): number {
  const validationAttempt = groupFinalReviewTurnAttempt(result, descriptor);
  return descriptor.commandPhase === "preprint-revision" && result.phase === "codex_revision_running"
    ? groupFinalReviewEditorialRevisionCommandAttempt(result.ratificationRound, validationAttempt)
    : validationAttempt;
}

export function groupFinalReviewTurnId(
  result: GroupFinalReviewActiveResult,
  descriptor: GroupFinalReviewTurnPhaseDescriptor
): string | null {
  const turnId = result[descriptor.turnIdField];
  return typeof turnId === "string" && turnId.trim().length > 0 ? turnId.trim() : null;
}

export function withGroupFinalReviewTurnId(
  result: GroupFinalReviewActiveResult,
  descriptor: GroupFinalReviewTurnPhaseDescriptor,
  turnId: string
): GroupFinalReviewActiveResult {
  return { ...result, [descriptor.turnIdField]: turnId };
}

export function resetGroupFinalReviewTurnAttempt(
  result: GroupFinalReviewActiveResult,
  descriptor: GroupFinalReviewTurnPhaseDescriptor
): GroupFinalReviewActiveResult {
  return { ...result, [descriptor.attemptField]: 1 };
}

export const GroupFinalReviewDispositions = ["clear", "caution", "blocked"] as const;
export type GroupFinalReviewDisposition = (typeof GroupFinalReviewDispositions)[number];

export const GroupFinalReviewStatuses = [
  "not_ready",
  "ready",
  "queued",
  "needs_configuration",
  "reviewing",
  "council",
  "distilling",
  "completed",
  "needs_attention",
  "failed",
  "stale",
] as const;
export type GroupFinalReviewStatus = (typeof GroupFinalReviewStatuses)[number];

export interface GroupFinalReviewConfiguration {
  autoStart?: boolean;
  vmHostId?: UUID | null;
  runtimeProfileId?: UUID | null;
  authProfileId?: UUID | null;
  reviewer?: ResearcherModelSelector;
  /** Reserved for a future release. It has no runtime effect yet. */
  autoContinueAfterReview?: boolean;
}

export interface CodeDataReviewConfiguration {
  enabled: boolean;
  interval: number;
}

export interface AiCouncilProceedingsPromptMessage {
  role: string;
  messageSha256: string;
  message?: string;
  payload?: Json;
}

export interface AiCouncilProceedingsCall {
  sequence: number;
  modelCallId: UUID;
  phase: string;
  memberId: string;
  surface: string;
  provider: string;
  model: string;
  status: string;
  promptMessages: AiCouncilProceedingsPromptMessage[];
  responseContent?: string | null;
  reasoningSummary?: string | null;
  usage: Record<string, Json>;
  providerMetadata: Record<string, Json>;
  error?: Record<string, Json> | null;
  startedAt?: ISODateTime | null;
  finishedAt?: ISODateTime | null;
}

export interface AiCouncilProceedings {
  version: 1;
  kind: "ai_council_proceedings";
  groupId: number;
  useCase: string;
  generatedAt: ISODateTime;
  reviewPackage: Record<string, Json>;
  reviewPackageSha256: string;
  deliverableSpec: Record<string, Json>;
  roster: Array<Record<string, Json>>;
  calls: AiCouncilProceedingsCall[];
  result: {
    drafts: Array<Record<string, Json>>;
    ballots: Array<Record<string, Json>>;
    aggregateRanking: Record<string, Json>;
    synthesis: Record<string, Json>;
    revision?: Record<string, Json> | null;
    ratifications: Array<Record<string, Json>>;
    ratifyOutcome: string;
    finalDeliverable: string;
  };
  warnings: string[];
}

export interface AiCouncilProceedingsSupplement {
  roster: Array<Record<string, Json>>;
  drafts: Array<Record<string, Json>>;
  ballots: Array<Record<string, Json>>;
  aggregateRanking: Record<string, Json>;
  ratifications: Array<Record<string, Json>>;
}

export interface GroupFinalReviewSourceManifestEntry {
  artifactId: UUID;
  experimentId: UUID;
  experimentName: string;
  experimentStatus: string;
  scope: ScopeRef;
  originalPath: string;
  stagedPath?: string | null;
  contentType?: string | null;
  sizeBytes: number;
  checksumSha256: string;
  currentRun: boolean;
  canonicalReport: boolean;
  available: boolean;
  unavailableReason?: string | null;
  createdAt: ISODateTime;
}

export interface GroupFinalReviewSourceManifest {
  version: 1;
  groupId: number;
  planningJobId: UUID;
  sourceFingerprint: string;
  generatedAt: ISODateTime;
  entries: GroupFinalReviewSourceManifestEntry[];
}

export interface GroupFinalReviewEvidenceReference {
  sourceKind: "preprint" | "workspace" | "artifact" | "cache" | "dataset";
  sourceRef: string;
  sourcePath: string;
  description: string;
  excerpt?: string | null;
}

export interface GroupFinalReviewFinding {
  rank: number;
  title: string;
  summary: string;
  significance: string;
  evidence: GroupFinalReviewEvidenceReference[];
}

export interface GroupFinalReviewSelectedFigure {
  artifactId: UUID;
  sourcePath: string;
  caption: string;
  altText: string;
}

export interface GroupFinalCodexReview {
  version: 2;
  disposition: GroupFinalReviewDisposition;
  executiveSummary: string;
  interestingResults: GroupFinalReviewFinding[];
  selectedFigures?: GroupFinalReviewSelectedFigure[];
  blockers: string[];
  dataProblems: string[];
  contradictions: string[];
  nullOrNegativeResults: string[];
  missingEvidence: string[];
  reproducibilityConcerns: string[];
  publicationCaveats: string[];
  councilInstructions: string[];
  checksRun: string[];
}

export const GroupReviewPreprintFormats = ["attributed_v1"] as const;
export type GroupReviewPreprintFormat = (typeof GroupReviewPreprintFormats)[number];

export const GroupReviewPreprintOmissionReasons = [
  "no_completed_bundle",
  "paper_draft_missing",
  "artifact_unreadable",
  "artifact_not_mounted",
] as const;
export type GroupReviewPreprintOmissionReason =
  (typeof GroupReviewPreprintOmissionReasons)[number];

export interface GroupReviewPreprintOmission {
  experimentId: UUID;
  experimentName: string;
  reason: GroupReviewPreprintOmissionReason;
}

export interface GroupReviewPreprintCoverage {
  expectedExperimentIds: UUID[];
  includedExperimentIds: UUID[];
  omittedExperiments: GroupReviewPreprintOmission[];
}

export interface GroupReviewAttributedPreprint {
  experimentId: UUID;
  experimentName: string;
  experimentStatus: string;
  reportBundleId: string | null;
  runId: UUID | null;
  artifactId: UUID;
  filename: string;
  checksumSha256: string;
  content: string;
  truncated: boolean;
}

export interface GroupFinalReviewSourceIndexArtifact {
  artifactId: UUID;
  sourcePath: string;
  filename: string;
  reportBundleId?: string | null;
  runId?: UUID | null;
  contentType?: string | null;
  checksumSha256?: string | null;
  sizeBytes?: ByteCount | null;
}

export interface GroupFinalReviewSourceIndexExperiment {
  experimentId: UUID;
  experimentName: string;
  experimentStatus: string;
  mounts: {
    workspace: string;
    artifacts: string;
    cache: string;
  };
  preprints: GroupFinalReviewSourceIndexArtifact[];
  canonicalFigures: GroupFinalReviewSourceIndexArtifact[];
}

export interface GroupFinalReviewSourceIndexDatasetVersion {
  datasetId: UUID;
  datasetVersionId: UUID;
  datasetName: string;
  versionLabel: string;
  sourcePath: string;
  manifestChecksumSha256?: string | null;
  sizeBytes?: ByteCount | null;
}

export interface GroupFinalReviewSourceIndex {
  version: 2;
  groupId: number;
  planningJobId: UUID;
  sourceFingerprint: string;
  generatedAt: ISODateTime;
  sourceGroup: {
    name: string | null;
    objectives: string | null;
  };
  fullPlan: GroupFinalReviewSourceIndexArtifact;
  experiments: GroupFinalReviewSourceIndexExperiment[];
  datasets: GroupFinalReviewSourceIndexDatasetVersion[];
  preprintCoverage?: GroupReviewPreprintCoverage;
  sourceWarnings?: string[];
}

export const GroupFinalReviewPromptTemplateTargetKinds = [
  "group_final_review_agents_md",
  "group_final_review_reviewer",
  "group_final_review_reviewer_correction",
  "paper_distill",
  "group_final_review_distill_correction",
  "paper_lay_summary",
  "group_final_review_lay_summary_correction",
] as const;
export type GroupFinalReviewPromptTemplateTargetKind =
  (typeof GroupFinalReviewPromptTemplateTargetKinds)[number];

export type GroupFinalReviewPromptTemplateReferences = Record<
  GroupFinalReviewPromptTemplateTargetKind,
  PromptTemplateReference
>;

export const GroupFinalReviewEditorialPromptTemplateTargetKinds = [
  "group_final_review_preprint_draft",
  "group_final_review_preprint_draft_correction",
  "group_final_review_preprint_revision",
  "group_final_review_preprint_revision_correction",
  "group_final_review_council_member_system",
  "group_final_review_council_chair_system",
] as const;
export type GroupFinalReviewEditorialPromptTemplateTargetKind =
  (typeof GroupFinalReviewEditorialPromptTemplateTargetKinds)[number];
export type GroupFinalReviewEditorialPromptTemplateReferences = Record<
  GroupFinalReviewEditorialPromptTemplateTargetKind,
  PromptTemplateReference
>;

export const GroupFinalReviewCouncilStages = [
  "reviewer_validated",
  "editorial_review",
  "ratification",
  "council_completed",
  "artifacts_materialized",
] as const;
export type GroupFinalReviewCouncilStage = (typeof GroupFinalReviewCouncilStages)[number];

export type GroupFinalReviewNeedsConfigurationResult = {
  phase: "needs_configuration";
  configurationErrors: string[];
  warnings?: string[];
};

type GroupFinalReviewActiveBase = {
  workflowVersion?: 1 | 2;
  reviewerAttempt: number;
  draftAttempt?: number;
  revisionAttempt?: number;
  distillAttempt: number;
  laySummaryAttempt: number;
  reviewerTurnId?: string | null;
  draftTurnId?: string | null;
  revisionTurnId?: string | null;
  revisionPacketJsonArtifactId?: UUID;
  revisionPacketMarkdownArtifactId?: UUID;
  distillTurnId?: string | null;
  laySummaryTurnId?: string | null;
  sourceFingerprint: string;
  experimentId: UUID;
  workspaceId: UUID;
  runId: UUID;
  reportBundleId: UUID;
  sourceIndexArtifactId: UUID;
  promptTemplateReferences: GroupFinalReviewPromptTemplateReferences;
  preprintCouncilPromptTemplateReference?: PromptTemplateReference;
  editorialPromptTemplateReferences?: GroupFinalReviewEditorialPromptTemplateReferences;
  editorialReviewPackageArtifactId?: UUID;
  warnings: string[];
};

type GroupFinalReviewSessionBase = GroupFinalReviewActiveBase & {
  sessionId: UUID;
};

type GroupFinalReviewReviewerCompletedBase = GroupFinalReviewSessionBase & {
  reviewerTurnId: string;
  disposition: GroupFinalReviewDisposition;
  reviewerJsonArtifactId: UUID;
  reviewerMarkdownArtifactId: UUID;
  reviewerEvidenceVerified: true;
  selectedFigureArtifactIds: UUID[];
  councilExecutionId: string;
};

type GroupFinalReviewCouncilCompletedBase = GroupFinalReviewReviewerCompletedBase & {
  councilModelCallIds: UUID[];
  councilRatifyOutcome: string;
  councilProceedingsSupplement?: AiCouncilProceedingsSupplement;
  codexDraftArtifactId?: UUID;
  editorialNotesModelCallIds?: UUID[];
  editorialDiscussionModelCallIds?: UUID[];
  editorialBriefModelCallId?: UUID;
  editorialBriefJsonArtifactId?: UUID;
  editorialBriefMarkdownArtifactId?: UUID;
  editorialCouncilModelCallIds?: UUID[];
  ratificationModelCallIds?: UUID[];
  ratificationRound?: 1 | 2 | 3;
};

type GroupFinalReviewEditorialReviewBase = GroupFinalReviewReviewerCompletedBase & {
  workflowVersion: 2;
  editorialRoster: WorkflowModelRosterMember[];
  editorialChair: WorkflowModelRosterMember;
  codexDraftArtifactId: UUID;
  editorialReviewPackageArtifactId: UUID;
  editorialNotesModelCallIds: UUID[];
  editorialDiscussionModelCallIds: UUID[];
  editorialBriefModelCallId: UUID;
  editorialBriefJsonArtifactId: UUID;
  editorialBriefMarkdownArtifactId: UUID;
  editorialCouncilModelCallIds: UUID[];
};

type GroupFinalReviewCouncilArtifactsBase = GroupFinalReviewCouncilCompletedBase & {
  councilStage: "artifacts_materialized";
  preprintArtifactId: UUID;
  councilProceedingsMarkdownArtifactId: UUID;
  councilProceedingsJsonArtifactId: UUID;
  supportingReportArtifactIds?: UUID[];
};

export type GroupFinalReviewReviewerSessionStartingResult = GroupFinalReviewActiveBase & {
  phase: "reviewer_session_starting";
};

export type GroupFinalReviewReviewerRunningResult = GroupFinalReviewSessionBase & {
  phase: "reviewer_running";
  reviewerTurnId: string | null;
};

export type GroupFinalReviewCodexDraftRunningResult = GroupFinalReviewReviewerCompletedBase & {
  workflowVersion: 2;
  phase: "codex_draft_running";
  draftAttempt: number;
  draftTurnId: string | null;
  editorialPromptTemplateReferences: GroupFinalReviewEditorialPromptTemplateReferences;
};

export type GroupFinalReviewCodexRevisionRunningResult = GroupFinalReviewEditorialReviewBase & {
  phase: "codex_revision_running";
  ratificationRound: 1 | 2 | 3;
  revisionAttempt: number;
  revisionTurnId: string | null;
  currentManuscriptArtifactId: UUID;
  ratificationModelCallIds: UUID[];
};

export type GroupFinalReviewCouncilRunningResult =
  | (GroupFinalReviewReviewerCompletedBase & {
      phase: "council_running";
      councilStage: "reviewer_validated";
    })
  | (GroupFinalReviewCouncilCompletedBase & {
      phase: "council_running";
      councilStage: "council_completed";
    })
  | (GroupFinalReviewCouncilArtifactsBase & {
      phase: "council_running";
      councilStage: "artifacts_materialized";
    })
  | (GroupFinalReviewReviewerCompletedBase & {
      workflowVersion: 2;
      phase: "council_running";
      councilStage: "editorial_review";
      codexDraftArtifactId: UUID;
    })
  | (GroupFinalReviewEditorialReviewBase & {
      phase: "council_running";
      councilStage: "ratification";
      ratificationRound: 1 | 2 | 3;
      currentManuscriptArtifactId: UUID;
      currentResponseArtifactId: UUID;
      ratificationModelCallIds: UUID[];
    });

export type GroupFinalReviewDistillRunningResult = GroupFinalReviewCouncilArtifactsBase & {
  phase: "distill_running";
  distillTurnId: string | null;
  distillArtifactId?: UUID;
};

export type GroupFinalReviewLaySummaryRunningResult = GroupFinalReviewCouncilArtifactsBase & {
  phase: "lay_summary_running";
  distillTurnId: string;
  distillArtifactId: UUID;
  laySummaryTurnId: string | null;
  laySummaryArtifactId?: UUID;
};

type GroupFinalReviewAcknowledgement =
  | { acknowledgedAt?: null; acknowledgedByUserId?: null }
  | { acknowledgedAt: ISODateTime; acknowledgedByUserId: number };

export type GroupFinalReviewCompletedResult = GroupFinalReviewCouncilArtifactsBase &
  GroupFinalReviewAcknowledgement & {
    phase: "completed";
    distillTurnId: string;
    distillArtifactId: UUID;
    laySummaryTurnId: string;
    laySummaryArtifactId: UUID;
    infographicJobId: UUID | null;
  };

export type GroupFinalReviewActiveResult =
  | GroupFinalReviewReviewerSessionStartingResult
  | GroupFinalReviewReviewerRunningResult
  | GroupFinalReviewCodexDraftRunningResult
  | GroupFinalReviewCouncilRunningResult
  | GroupFinalReviewCodexRevisionRunningResult
  | GroupFinalReviewDistillRunningResult
  | GroupFinalReviewLaySummaryRunningResult
  | GroupFinalReviewCompletedResult;

export type GroupFinalReviewResult =
  | GroupFinalReviewNeedsConfigurationResult
  | GroupFinalReviewActiveResult;

export interface GroupFinalReviewStatusResult {
  groupId: number;
  status: GroupFinalReviewStatus;
  ready: boolean;
  stale: boolean;
  planningJob?: PlanningJob | null;
  result?: GroupFinalReviewResult | null;
}

export const InfographicJobStatuses = ["queued", "running", "completed", "failed", "cancelled"] as const;
export type InfographicJobStatus = (typeof InfographicJobStatuses)[number];

export const InfographicJobTerminalStatuses = ["completed", "failed", "cancelled"] as const;
export type InfographicJobTerminalStatus = (typeof InfographicJobTerminalStatuses)[number];

const InfographicJobTerminalStatusSet: ReadonlySet<string> = new Set(InfographicJobTerminalStatuses);

export function isInfographicJobTerminalStatus(value: unknown): value is InfographicJobTerminalStatus {
  return typeof value === "string" && InfographicJobTerminalStatusSet.has(value);
}

export const InfographicSlideStatuses = ["queued", "running", "completed", "failed", "cancelled"] as const;
export type InfographicSlideStatus = (typeof InfographicSlideStatuses)[number];

export const InfographicSlideTerminalStatuses = ["completed", "failed", "cancelled"] as const;
export type InfographicSlideTerminalStatus = (typeof InfographicSlideTerminalStatuses)[number];

const InfographicSlideTerminalStatusSet: ReadonlySet<string> = new Set(InfographicSlideTerminalStatuses);

export function isInfographicSlideTerminalStatus(value: unknown): value is InfographicSlideTerminalStatus {
  return typeof value === "string" && InfographicSlideTerminalStatusSet.has(value);
}

export const InfographicSourceTypes = ["group_plan", "experiment_plan", "preprint"] as const;
export type InfographicSourceType = (typeof InfographicSourceTypes)[number];

export const InfographicSlideCountModes = ["auto", "fixed"] as const;
export type InfographicSlideCountMode = (typeof InfographicSlideCountModes)[number];

export interface PlanningJob {
  id: UUID;
  groupId: number;
  kind: PlanningJobKind;
  status: PlanningJobStatus;
  requestPayload: Record<string, Json>;
  resultPayload?: Record<string, Json> | null;
  errorPayload?: Record<string, Json> | null;
  modelCallId?: UUID | null;
  backgroundJobId?: string | null;
  requestedByUserId?: number | null;
  startedAt?: ISODateTime | null;
  finishedAt?: ISODateTime | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface InfographicSlide {
  id: UUID;
  jobId: UUID;
  slideIndex: number;
  title: string;
  status: InfographicSlideStatus | string;
  specPayload: Record<string, Json>;
  prompt?: string | null;
  imageModelCallId?: UUID | null;
  artifactId?: UUID | null;
  artifactChecksumSha256?: string | null;
  errorPayload?: Record<string, Json> | null;
  startedAt?: ISODateTime | null;
  finishedAt?: ISODateTime | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface InfographicJob {
  id: UUID;
  groupId: number;
  sourceType: InfographicSourceType | string;
  sourceId: string;
  status: InfographicJobStatus | string;
  slideCountMode: InfographicSlideCountMode | string;
  requestedSlideCount?: number | null;
  selectedSlideCount?: number | null;
  requestPayload: Record<string, Json>;
  resultPayload?: Record<string, Json> | null;
  errorPayload?: Record<string, Json> | null;
  designModelCallId?: UUID | null;
  backgroundJobId?: string | null;
  requestedByUserId?: number | null;
  startedAt?: ISODateTime | null;
  finishedAt?: ISODateTime | null;
  slides?: InfographicSlide[];
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export type CreateInfographicJobRequest = {
  sourceType?: InfographicSourceType | string;
  sourceId?: string | null;
  sourceInputKey?: string | null;
  sourceInput?: Record<string, Json> | null;
  autoGenerated?: boolean | null;
  autoGeneration?: Record<string, Json> | null;
  slideCountMode?: InfographicSlideCountMode | string;
  slideCount?: number | null;
  promptGuidance?: string | null;
  imageModel?: string | null;
  imageSize?: string | null;
  imageQuality?: string | null;
};

export type CreateInfographicJobResponse = {
  infographicJob: InfographicJob;
  topic: string;
  queue: Record<string, Json>;
};

export const InfographicImageArchiveSchemaVersion = 1 as const;

export interface InfographicImageArchiveSlide {
  slideIndex: number;
  title: string;
  filename: string;
  expectedWidth: number;
  expectedHeight: number;
  sourceStatus: string;
  sourceChecksumSha256?: string | null;
}

export interface InfographicImageArchiveManifest {
  schemaVersion: typeof InfographicImageArchiveSchemaVersion;
  infographicJobId: UUID;
  imageRevision: number;
  generatedAt: ISODateTime;
  slides: InfographicImageArchiveSlide[];
}

export interface InfographicImageReplacementSummary {
  replacementId: UUID;
  replacedAt: ISODateTime;
  replacedByUserId: number;
  previousJobStatus: string;
  slideCount: number;
  imageRevision: number;
}

export interface ReplaceInfographicImagesResponse {
  infographicJob: InfographicJob;
  replacement: InfographicImageReplacementSummary;
}

export interface ModelCall {
  id: UUID;
  scope: ScopeRef;
  role: string;
  provider: string;
  model: string;
  requestPayload?: Record<string, Json> | null;
  responsePayload?: Record<string, Json> | null;
  status: ModelCallStatus | string;
  backgroundJobId?: string | null;
  startedAt?: ISODateTime | null;
  finishedAt?: ISODateTime | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const ChiefScientistDecisionApplyStatuses = ["pending", "applied", "failed", "skipped"] as const;
export type ChiefScientistDecisionApplyStatus = (typeof ChiefScientistDecisionApplyStatuses)[number];

export interface ChiefScientistDecisionRecord {
  id: UUID;
  modelCallId: UUID;
  reviewPacket: Record<string, Json>;
  decisionPayload: Record<string, Json>;
  action: ChiefScientistDecisionAction | string;
  confidence: number;
  applyStatus: ChiefScientistDecisionApplyStatus | string;
  appliedAt?: ISODateTime | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const ReviewPriorities = ["low", "normal", "high", "critical"] as const;
export type ReviewPriority = (typeof ReviewPriorities)[number];

export interface ChiefScientistDecision {
  id: UUID;
  reviewPacketId: UUID;
  action: ChiefScientistDecisionAction;
  confidence: number;
  summary: string;
  rationale: string;
  operatorNote?: string;
  codexMessage?: string;
  codexReasoningEffort?: DynamicCodexReasoningEffort;
  approvalDecision?: string;
  humanEscalation?: {
    reviewBoardGroupId: number;
    priority: ReviewPriority;
    title: string;
    prompt: string;
  };
  followupExperiment?: {
    title: string;
    objective: string;
    workflowTemplateId?: UUID;
  };
  dynamicPaperPatch?: {
    paperId: UUID;
    patchTitle: string;
    claimChanges: Array<Record<string, Json>>;
  };
}

export const HumanReviewCaseStatuses = [
  "open",
  "claimed",
  "in_discussion",
  "waiting_vote",
  "resolved",
  "rejected",
  "superseded",
] as const;

export type HumanReviewCaseStatus = (typeof HumanReviewCaseStatuses)[number];

export const HumanReviewCaseTerminalStatuses = ["resolved", "rejected", "superseded"] as const;
export type HumanReviewCaseTerminalStatus = (typeof HumanReviewCaseTerminalStatuses)[number];

const HumanReviewCaseTerminalStatusSet: ReadonlySet<string> = new Set(HumanReviewCaseTerminalStatuses);

export function isHumanReviewCaseTerminalStatus(value: unknown): value is HumanReviewCaseTerminalStatus {
  return typeof value === "string" && HumanReviewCaseTerminalStatusSet.has(value);
}

export type HumanReviewPlannerOption = {
  id: string;
  title: string;
  recommendation: string;
  rationale: string;
  benefits: string[];
  risks: string[];
  chiefInstruction: string;
};

export type HumanReviewPlannerAdvice = {
  summary: string;
  fullLaySummary?: string;
  recommendedOptionId: string;
  options: [HumanReviewPlannerOption, HumanReviewPlannerOption, HumanReviewPlannerOption];
};

export type HumanReviewDirectionInput =
  | { kind: "planner_option"; optionId: string }
  | { kind: "custom"; text: string };

export const HumanReviewDirectionTextMaxLength = 35_000;

export type HumanReviewDirection =
  | {
      kind: "planner_option";
      optionId: string;
      option: HumanReviewPlannerOption;
    }
  | {
      kind: "custom";
      text: string;
    };

export interface HumanReviewCase {
  id: UUID;
  scope: ScopeRef;
  status: HumanReviewCaseStatus;
  reviewBoardGroupId: number;
  createdFromDecisionId?: UUID;
  title: string;
  summary: string;
  recommendedAction?: ChiefScientistDecisionAction;
  priority: ReviewPriority;
  metadata?: Record<string, Json>;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface HumanReviewCaseMember {
  id: UUID;
  caseId: UUID;
  userId: number;
  role: string;
  status: string;
  assignedAt: ISODateTime;
  resolvedAt?: ISODateTime | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface HumanReviewVote {
  id: UUID;
  caseId: UUID;
  userId: number;
  voteType: string;
  payload: Record<string, Json>;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const StepBoundaryTriggerSchema = z.enum(StepBoundaryTriggers);
export const AgentStepBoundaryStatusSchema = z.enum(AgentStepBoundaryStatuses);
export const ChiefScientistDecisionActionSchema = z.enum(ChiefScientistDecisionActions);
export const ModelCallStatusSchema = z.enum(ModelCallStatuses);
export const InfographicJobStatusSchema = z.enum(InfographicJobStatuses);
export const InfographicSlideStatusSchema = z.enum(InfographicSlideStatuses);
export const InfographicSourceTypeSchema = z.enum(InfographicSourceTypes);
export const InfographicSlideCountModeSchema = z.enum(InfographicSlideCountModes);
export const ChiefScientistDecisionApplyStatusSchema = z.enum(ChiefScientistDecisionApplyStatuses);
export const HumanReviewCaseStatusSchema = z.enum(HumanReviewCaseStatuses);
export const HumanReviewPlannerOptionSchema = z
  .object({
    id: z.string().trim().min(1).max(200),
    title: z.string().trim().min(1).max(500),
    recommendation: z.string().trim().min(1).max(12_000),
    rationale: z.string().trim().min(1).max(12_000),
    benefits: z.array(z.string().trim().min(1).max(4_000)).max(12),
    risks: z.array(z.string().trim().min(1).max(4_000)).max(12),
    chiefInstruction: z.string().trim().min(1).max(12_000),
  })
  .strict() satisfies z.ZodType<HumanReviewPlannerOption>;
export const HumanReviewPlannerAdviceSchema = z
  .object({
    summary: z.string().trim().min(1).max(12_000),
    fullLaySummary: z.string().trim().min(1).max(12_000).optional(),
    recommendedOptionId: z.string().trim().min(1).max(200),
    options: z.tuple([
      HumanReviewPlannerOptionSchema,
      HumanReviewPlannerOptionSchema,
      HumanReviewPlannerOptionSchema,
    ]),
  })
  .strict()
  .superRefine((advice, context) => {
    const ids = advice.options.map((option) => option.id);
    if (new Set(ids).size !== ids.length) {
      context.addIssue({
        code: "custom",
        message: "Human review planner option ids must be unique",
        path: ["options"],
      });
    }
    if (!ids.includes(advice.recommendedOptionId)) {
      context.addIssue({
        code: "custom",
        message: "recommendedOptionId must reference one of the three options",
        path: ["recommendedOptionId"],
      });
    }
  }) satisfies z.ZodType<HumanReviewPlannerAdvice>;
export const HumanReviewDirectionInputSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("planner_option"),
    optionId: z.string().trim().min(1).max(200),
  }).strict(),
  z.object({
    kind: z.literal("custom"),
    text: z.string().trim().min(1).max(HumanReviewDirectionTextMaxLength),
  }).strict(),
]) satisfies z.ZodType<HumanReviewDirectionInput>;
export const HumanReviewDirectionSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("planner_option"),
    optionId: z.string().trim().min(1).max(200),
    option: HumanReviewPlannerOptionSchema,
  }).strict(),
  z.object({
    kind: z.literal("custom"),
    text: z.string().trim().min(1).max(HumanReviewDirectionTextMaxLength),
  }).strict(),
]) satisfies z.ZodType<HumanReviewDirection>;
export const ReviewPrioritySchema = z.enum(ReviewPriorities);
export const PendingApprovalKindSchema = z.enum(PendingApprovalKinds);
export const ApprovalTaskStatusSchema = z.enum(ApprovalTaskStatuses);

export const AgentStepBoundarySchema = z
  .object({
    id: UUIDSchema,
    sessionId: UUIDSchema,
    runId: UUIDSchema,
    runStepId: UUIDSchema,
    trigger: z.string().min(1),
    createdAt: ISODateTimeSchema,
    status: z.string().min(1),
    snapshot: z.record(z.string(), JsonSchema),
    resolvedAt: ISODateTimeSchema.nullable().optional(),
    latestPlan: z.array(CodexPlanStepSchema).optional(),
    latestDiff: CodexDiffSummarySchema.optional(),
    metadata: z.record(z.string(), JsonSchema).optional(),
    updatedAt: ISODateTimeSchema,
  })
  .strict() satisfies z.ZodType<AgentStepBoundary>;

export const ApprovalTaskSchema = z
  .object({
    id: UUIDSchema,
    sessionId: UUIDSchema,
    requestId: z.string().min(1),
    kind: z.string().min(1),
    status: z.string().min(1),
    policyScope: z.string().nullable().optional(),
    payload: z.record(z.string(), JsonSchema),
    resolvedByType: z.string().nullable().optional(),
    resolvedById: z.string().nullable().optional(),
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
  })
  .strict() satisfies z.ZodType<ApprovalTask>;

export const ReviewPacketSchema = z
  .object({
    id: UUIDSchema,
    boundaryId: UUIDSchema,
    experimentId: UUIDSchema,
    sessionId: UUIDSchema,
    objective: z.string().min(1),
    summary: z.string().min(1),
    pendingQuestion: z.string().optional(),
    pendingApproval: z
      .object({
        requestId: z.string().min(1),
        kind: PendingApprovalKindSchema,
        reason: z.string().optional(),
      })
      .strict()
      .optional(),
    plan: z.array(CodexPlanStepSchema).optional(),
    diff: CodexDiffSummarySchema.optional(),
    changedFiles: z.array(z.string()).optional(),
    recentOutput: z.array(z.string()).optional(),
    artifactIds: z.array(UUIDSchema).optional(),
    relatedSignalIds: z.array(UUIDSchema).optional(),
    relatedExperimentIds: z.array(UUIDSchema).optional(),
    policySnapshot: z.record(z.string(), JsonSchema),
  })
  .strict() satisfies z.ZodType<ReviewPacket>;

export const ChiefScientistDecisionSchema = z
  .object({
    id: UUIDSchema,
    reviewPacketId: UUIDSchema,
    action: ChiefScientistDecisionActionSchema,
    confidence: z.number().min(0).max(1),
    summary: z.string().min(1),
    rationale: z.string().min(1),
    operatorNote: z.string().optional(),
    codexMessage: z.string().optional(),
    approvalDecision: z.string().optional(),
    humanEscalation: z
      .object({
        reviewBoardGroupId: z.number().int().positive(),
        priority: ReviewPrioritySchema,
        title: z.string().min(1),
        prompt: z.string().min(1),
      })
      .strict()
      .optional(),
    followupExperiment: z
      .object({
        title: z.string().min(1),
        objective: z.string().min(1),
        workflowTemplateId: UUIDSchema.optional(),
      })
      .strict()
      .optional(),
    dynamicPaperPatch: z
      .object({
        paperId: UUIDSchema,
        patchTitle: z.string().min(1),
        claimChanges: z.array(z.record(z.string(), JsonSchema)),
      })
      .strict()
      .optional(),
  })
  .strict() satisfies z.ZodType<ChiefScientistDecision>;

export const ModelCallSchema = z
  .object({
    id: UUIDSchema,
    scope: ScopeRefSchema,
    role: z.string().min(1),
    provider: z.string().min(1),
    model: z.string().min(1),
    requestPayload: z.record(z.string(), JsonSchema).nullable().optional(),
    responsePayload: z.record(z.string(), JsonSchema).nullable().optional(),
    status: z.string().min(1),
    backgroundJobId: z.string().nullable().optional(),
    startedAt: ISODateTimeSchema.nullable().optional(),
    finishedAt: ISODateTimeSchema.nullable().optional(),
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
  })
  .strict() satisfies z.ZodType<ModelCall>;

export const PlanningJobStatusSchema = z.enum(PlanningJobStatuses);

export const PlanningJobKindSchema = z.enum(PlanningJobKinds);

export const GroupFinalReviewPhaseSchema = z.enum(GroupFinalReviewPhases);
export const GroupFinalReviewDispositionSchema = z.enum(GroupFinalReviewDispositions);
export const GroupFinalReviewStatusSchema = z.enum(GroupFinalReviewStatuses);

export const GroupFinalReviewConfigurationSchema = z
  .object({
    autoStart: z.boolean().optional(),
    vmHostId: UUIDSchema.nullable().optional(),
    runtimeProfileId: UUIDSchema.nullable().optional(),
    authProfileId: UUIDSchema.nullable().optional(),
    reviewer: ResearcherModelSelectorSchema.optional(),
    autoContinueAfterReview: z.boolean().optional(),
  })
  .strict() satisfies z.ZodType<GroupFinalReviewConfiguration>;

export const CodeDataReviewConfigurationSchema = z
  .object({
    enabled: z.boolean().default(true),
    interval: z.number().int().min(1).max(50).default(3),
  })
  .strict() satisfies z.ZodType<CodeDataReviewConfiguration>;

export const AiCouncilProceedingsPromptMessageSchema = z
  .object({
    role: z.string().min(1),
    messageSha256: z.string().regex(/^[a-f0-9]{64}$/u),
    message: z.string().optional(),
    payload: JsonSchema.optional(),
  })
  .strict()
  .superRefine((message, context) => {
    if ((message.message === undefined) === (message.payload === undefined)) {
      context.addIssue({
        code: "custom",
        message: "Proceedings prompt messages require exactly one of message or payload",
      });
    }
  }) satisfies z.ZodType<AiCouncilProceedingsPromptMessage>;

export const AiCouncilProceedingsCallSchema = z
  .object({
    sequence: z.number().int().positive(),
    modelCallId: UUIDSchema,
    phase: z.string().min(1),
    memberId: z.string().min(1),
    surface: z.string().min(1),
    provider: z.string().min(1),
    model: z.string().min(1),
    status: z.string().min(1),
    promptMessages: z.array(AiCouncilProceedingsPromptMessageSchema).min(1),
    responseContent: z.string().nullable().optional(),
    reasoningSummary: z.string().nullable().optional(),
    usage: z.record(z.string(), JsonSchema),
    providerMetadata: z.record(z.string(), JsonSchema),
    error: z.record(z.string(), JsonSchema).nullable().optional(),
    startedAt: ISODateTimeSchema.nullable().optional(),
    finishedAt: ISODateTimeSchema.nullable().optional(),
  })
  .strict() satisfies z.ZodType<AiCouncilProceedingsCall>;

export const AiCouncilProceedingsSchema = z
  .object({
    version: z.literal(1),
    kind: z.literal("ai_council_proceedings"),
    groupId: z.number().int().positive(),
    useCase: z.string().min(1),
    generatedAt: ISODateTimeSchema,
    reviewPackage: z.record(z.string(), JsonSchema),
    reviewPackageSha256: z.string().regex(/^[a-f0-9]{64}$/u),
    deliverableSpec: z.record(z.string(), JsonSchema),
    roster: z.array(z.record(z.string(), JsonSchema)).min(1),
    calls: z.array(AiCouncilProceedingsCallSchema).min(1),
    result: z.object({
      drafts: z.array(z.record(z.string(), JsonSchema)).min(1),
      ballots: z.array(z.record(z.string(), JsonSchema)),
      aggregateRanking: z.record(z.string(), JsonSchema),
      synthesis: z.record(z.string(), JsonSchema),
      revision: z.record(z.string(), JsonSchema).nullable().optional(),
      ratifications: z.array(z.record(z.string(), JsonSchema)).min(1),
      ratifyOutcome: z.string().min(1),
      finalDeliverable: z.string().min(1),
    }).strict(),
    warnings: z.array(z.string()),
  })
  .strict() satisfies z.ZodType<AiCouncilProceedings>;

export const AiCouncilProceedingsSupplementSchema = z
  .object({
    roster: z.array(z.record(z.string(), JsonSchema)).min(1),
    drafts: z.array(z.record(z.string(), JsonSchema)).min(1),
    ballots: z.array(z.record(z.string(), JsonSchema)),
    aggregateRanking: z.record(z.string(), JsonSchema),
    ratifications: z.array(z.record(z.string(), JsonSchema)).min(1),
  })
  .strict() satisfies z.ZodType<AiCouncilProceedingsSupplement>;

export const GroupFinalReviewSourceManifestEntrySchema = z
  .object({
    artifactId: UUIDSchema,
    experimentId: UUIDSchema,
    experimentName: z.string().min(1),
    experimentStatus: z.string().min(1),
    scope: ScopeRefSchema,
    originalPath: z.string().min(1),
    stagedPath: z.string().min(1).nullable().optional(),
    contentType: z.string().min(1).nullable().optional(),
    sizeBytes: z.number().int().nonnegative(),
    checksumSha256: z.string().regex(/^[a-f0-9]{64}$/iu),
    currentRun: z.boolean(),
    canonicalReport: z.boolean(),
    available: z.boolean(),
    unavailableReason: z.string().min(1).nullable().optional(),
    createdAt: ISODateTimeSchema,
  })
  .strict() satisfies z.ZodType<GroupFinalReviewSourceManifestEntry>;

export const GroupFinalReviewSourceManifestSchema = z
  .object({
    version: z.literal(1),
    groupId: z.number().int().positive(),
    planningJobId: UUIDSchema,
    sourceFingerprint: z.string().regex(/^[a-f0-9]{64}$/iu),
    generatedAt: ISODateTimeSchema,
    entries: z.array(GroupFinalReviewSourceManifestEntrySchema),
  })
  .strict() satisfies z.ZodType<GroupFinalReviewSourceManifest>;

export const GroupFinalReviewEvidenceReferenceSchema = z
  .object({
    sourceKind: z.enum(["preprint", "workspace", "artifact", "cache", "dataset"]),
    sourceRef: z.string().min(1),
    sourcePath: z.string().min(1),
    description: z.string().min(1),
    excerpt: z.string().nullable().optional(),
  })
  .strict() satisfies z.ZodType<GroupFinalReviewEvidenceReference>;

export const GroupFinalReviewFindingSchema = z
  .object({
    rank: z.number().int().positive(),
    title: z.string().min(1),
    summary: z.string().min(1),
    significance: z.string().min(1),
    evidence: z.array(GroupFinalReviewEvidenceReferenceSchema).min(1),
  })
  .strict() satisfies z.ZodType<GroupFinalReviewFinding>;

export const GroupFinalReviewSelectedFigureSchema = z
  .object({
    artifactId: UUIDSchema,
    sourcePath: z.string().min(1),
    caption: z.string().min(1),
    altText: z.string().min(1),
  })
  .strict() satisfies z.ZodType<GroupFinalReviewSelectedFigure>;

export const GroupFinalCodexReviewSchema = z
  .object({
    version: z.literal(2),
    disposition: GroupFinalReviewDispositionSchema,
    executiveSummary: z.string().min(1),
    interestingResults: z.array(GroupFinalReviewFindingSchema),
    selectedFigures: z.array(GroupFinalReviewSelectedFigureSchema).max(20).optional(),
    blockers: z.array(z.string().min(1)),
    dataProblems: z.array(z.string().min(1)),
    contradictions: z.array(z.string().min(1)),
    nullOrNegativeResults: z.array(z.string().min(1)),
    missingEvidence: z.array(z.string().min(1)),
    reproducibilityConcerns: z.array(z.string().min(1)),
    publicationCaveats: z.array(z.string().min(1)),
    councilInstructions: z.array(z.string().min(1)),
    checksRun: z.array(z.string().min(1)),
  })
  .strict() satisfies z.ZodType<GroupFinalCodexReview>;

export const GroupReviewPreprintOmissionReasonSchema = z.enum(GroupReviewPreprintOmissionReasons);

export const GroupReviewPreprintOmissionSchema = z
  .object({
    experimentId: UUIDSchema,
    experimentName: z.string().min(1),
    reason: GroupReviewPreprintOmissionReasonSchema,
  })
  .strict() satisfies z.ZodType<GroupReviewPreprintOmission>;

export const GroupReviewPreprintCoverageSchema = z
  .object({
    expectedExperimentIds: z.array(UUIDSchema),
    includedExperimentIds: z.array(UUIDSchema),
    omittedExperiments: z.array(GroupReviewPreprintOmissionSchema),
  })
  .strict() satisfies z.ZodType<GroupReviewPreprintCoverage>;

export const GroupReviewAttributedPreprintSchema = z
  .object({
    experimentId: UUIDSchema,
    experimentName: z.string().min(1),
    experimentStatus: z.string().min(1),
    reportBundleId: z.string().min(1).nullable(),
    runId: UUIDSchema.nullable(),
    artifactId: UUIDSchema,
    filename: z.string().min(1),
    checksumSha256: z.string().regex(/^[a-f0-9]{64}$/iu),
    content: z.string(),
    truncated: z.boolean(),
  })
  .strict() satisfies z.ZodType<GroupReviewAttributedPreprint>;

export const GroupFinalReviewSourceIndexArtifactSchema = z
  .object({
    artifactId: UUIDSchema,
    sourcePath: z.string().min(1),
    filename: z.string().min(1),
    reportBundleId: z.string().min(1).nullable().optional(),
    runId: UUIDSchema.nullable().optional(),
    contentType: z.string().min(1).nullable().optional(),
    checksumSha256: z.string().regex(/^[a-f0-9]{64}$/iu).nullable().optional(),
    sizeBytes: ByteCountSchema.nullable().optional(),
  })
  .strict() satisfies z.ZodType<GroupFinalReviewSourceIndexArtifact>;

export const GroupFinalReviewSourceIndexExperimentSchema = z
  .object({
    experimentId: UUIDSchema,
    experimentName: z.string().min(1),
    experimentStatus: z.string().min(1),
    mounts: z.object({
      workspace: z.string().min(1),
      artifacts: z.string().min(1),
      cache: z.string().min(1),
    }).strict(),
    preprints: z.array(GroupFinalReviewSourceIndexArtifactSchema),
    canonicalFigures: z.array(GroupFinalReviewSourceIndexArtifactSchema),
  })
  .strict() satisfies z.ZodType<GroupFinalReviewSourceIndexExperiment>;

export const GroupFinalReviewSourceIndexDatasetVersionSchema = z
  .object({
    datasetId: UUIDSchema,
    datasetVersionId: UUIDSchema,
    datasetName: z.string().min(1),
    versionLabel: z.string().min(1),
    sourcePath: z.string().min(1),
    manifestChecksumSha256: z.string().min(1).nullable().optional(),
    sizeBytes: ByteCountSchema.nullable().optional(),
  })
  .strict() satisfies z.ZodType<GroupFinalReviewSourceIndexDatasetVersion>;

export const GroupFinalReviewSourceIndexSchema = z
  .object({
    version: z.literal(2),
    groupId: z.number().int().positive(),
    planningJobId: UUIDSchema,
    sourceFingerprint: z.string().regex(/^[a-f0-9]{64}$/iu),
    generatedAt: ISODateTimeSchema,
    sourceGroup: z.object({
      name: z.string().min(1).nullable(),
      objectives: z.string().min(1).nullable(),
    }).strict(),
    fullPlan: GroupFinalReviewSourceIndexArtifactSchema,
    experiments: z.array(GroupFinalReviewSourceIndexExperimentSchema).min(1),
    datasets: z.array(GroupFinalReviewSourceIndexDatasetVersionSchema),
    preprintCoverage: GroupReviewPreprintCoverageSchema.optional(),
    sourceWarnings: z.array(z.string().min(1)).optional(),
  })
  .strict() satisfies z.ZodType<GroupFinalReviewSourceIndex>;

export const GroupFinalReviewPromptTemplateReferencesSchema = z.record(
  z.enum(GroupFinalReviewPromptTemplateTargetKinds),
  PromptTemplateReferenceSchema
) satisfies z.ZodType<GroupFinalReviewPromptTemplateReferences>;

export const GroupFinalReviewEditorialPromptTemplateReferencesSchema = z.record(
  z.enum(GroupFinalReviewEditorialPromptTemplateTargetKinds),
  PromptTemplateReferenceSchema
) satisfies z.ZodType<GroupFinalReviewEditorialPromptTemplateReferences>;

const GroupFinalReviewActiveShape = {
  workflowVersion: z.union([z.literal(1), z.literal(2)]).optional(),
  reviewerAttempt: z.number().int().positive(),
  draftAttempt: z.number().int().positive().optional(),
  revisionAttempt: z.number().int().positive().optional(),
  distillAttempt: z.number().int().positive(),
  laySummaryAttempt: z.number().int().positive(),
  reviewerTurnId: z.string().min(1).nullable().optional(),
  draftTurnId: z.string().min(1).nullable().optional(),
  revisionTurnId: z.string().min(1).nullable().optional(),
  revisionPacketJsonArtifactId: UUIDSchema.optional(),
  revisionPacketMarkdownArtifactId: UUIDSchema.optional(),
  distillTurnId: z.string().min(1).nullable().optional(),
  laySummaryTurnId: z.string().min(1).nullable().optional(),
  sourceFingerprint: z.string().regex(/^[a-f0-9]{64}$/iu),
  experimentId: UUIDSchema,
  workspaceId: UUIDSchema,
  runId: UUIDSchema,
  reportBundleId: UUIDSchema,
  sourceIndexArtifactId: UUIDSchema,
  promptTemplateReferences: GroupFinalReviewPromptTemplateReferencesSchema,
  preprintCouncilPromptTemplateReference: PromptTemplateReferenceSchema.optional(),
  editorialPromptTemplateReferences: GroupFinalReviewEditorialPromptTemplateReferencesSchema.optional(),
  editorialReviewPackageArtifactId: UUIDSchema.optional(),
  warnings: z.array(z.string()),
};

const GroupFinalReviewSessionShape = {
  ...GroupFinalReviewActiveShape,
  sessionId: UUIDSchema,
};

const GroupFinalReviewReviewerCompletedShape = {
  ...GroupFinalReviewSessionShape,
  reviewerTurnId: z.string().min(1),
  disposition: GroupFinalReviewDispositionSchema,
  reviewerJsonArtifactId: UUIDSchema,
  reviewerMarkdownArtifactId: UUIDSchema,
  reviewerEvidenceVerified: z.literal(true),
  selectedFigureArtifactIds: z.array(UUIDSchema),
  councilExecutionId: z.string().min(1),
};

const GroupFinalReviewCouncilCompletedShape = {
  ...GroupFinalReviewReviewerCompletedShape,
  councilModelCallIds: z.array(UUIDSchema).min(1),
  councilRatifyOutcome: z.string().min(1),
  councilProceedingsSupplement: AiCouncilProceedingsSupplementSchema.optional(),
  codexDraftArtifactId: UUIDSchema.optional(),
  editorialNotesModelCallIds: z.array(UUIDSchema).optional(),
  editorialDiscussionModelCallIds: z.array(UUIDSchema).optional(),
  editorialBriefModelCallId: UUIDSchema.optional(),
  editorialBriefJsonArtifactId: UUIDSchema.optional(),
  editorialBriefMarkdownArtifactId: UUIDSchema.optional(),
  editorialCouncilModelCallIds: z.array(UUIDSchema).optional(),
  ratificationModelCallIds: z.array(UUIDSchema).optional(),
  ratificationRound: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
};

const GroupFinalReviewEditorialReviewShape = {
  ...GroupFinalReviewReviewerCompletedShape,
  workflowVersion: z.literal(2),
  editorialRoster: z.array(WorkflowModelRosterMemberSchema).min(1).max(7),
  editorialChair: WorkflowModelRosterMemberSchema,
  codexDraftArtifactId: UUIDSchema,
  editorialReviewPackageArtifactId: UUIDSchema,
  editorialNotesModelCallIds: z.array(UUIDSchema).min(1),
  editorialDiscussionModelCallIds: z.array(UUIDSchema).min(1),
  editorialBriefModelCallId: UUIDSchema,
  editorialBriefJsonArtifactId: UUIDSchema,
  editorialBriefMarkdownArtifactId: UUIDSchema,
  editorialCouncilModelCallIds: z.array(UUIDSchema).min(1),
};

const GroupFinalReviewCouncilArtifactsShape = {
  ...GroupFinalReviewCouncilCompletedShape,
  councilStage: z.literal("artifacts_materialized"),
  preprintArtifactId: UUIDSchema,
  councilProceedingsMarkdownArtifactId: UUIDSchema,
  councilProceedingsJsonArtifactId: UUIDSchema,
  supportingReportArtifactIds: z.array(UUIDSchema).optional(),
};

const GroupFinalReviewReviewerSessionStartingSchema = z.object({
  ...GroupFinalReviewActiveShape,
  phase: z.literal("reviewer_session_starting"),
}).strict();

const GroupFinalReviewReviewerRunningSchema = z.object({
  ...GroupFinalReviewSessionShape,
  phase: z.literal("reviewer_running"),
  reviewerTurnId: z.string().min(1).nullable(),
}).strict();

const GroupFinalReviewCodexDraftRunningSchema = z.object({
  ...GroupFinalReviewReviewerCompletedShape,
  workflowVersion: z.literal(2),
  phase: z.literal("codex_draft_running"),
  draftAttempt: z.number().int().positive(),
  draftTurnId: z.string().min(1).nullable(),
  editorialPromptTemplateReferences: GroupFinalReviewEditorialPromptTemplateReferencesSchema,
}).strict();

const GroupFinalReviewCodexRevisionRunningSchema = z.object({
  ...GroupFinalReviewEditorialReviewShape,
  phase: z.literal("codex_revision_running"),
  ratificationRound: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  revisionAttempt: z.number().int().positive(),
  revisionTurnId: z.string().min(1).nullable(),
  currentManuscriptArtifactId: UUIDSchema,
  ratificationModelCallIds: z.array(UUIDSchema),
}).strict();

const GroupFinalReviewCouncilRunningSchema = z.union([
  z.object({
    ...GroupFinalReviewReviewerCompletedShape,
    phase: z.literal("council_running"),
    councilStage: z.literal("reviewer_validated"),
  }).strict(),
  z.object({
    ...GroupFinalReviewCouncilCompletedShape,
    phase: z.literal("council_running"),
    councilStage: z.literal("council_completed"),
  }).strict(),
  z.object({
    ...GroupFinalReviewCouncilArtifactsShape,
    phase: z.literal("council_running"),
    councilStage: z.literal("artifacts_materialized"),
  }).strict(),
  z.object({
    ...GroupFinalReviewReviewerCompletedShape,
    workflowVersion: z.literal(2),
    phase: z.literal("council_running"),
    councilStage: z.literal("editorial_review"),
    codexDraftArtifactId: UUIDSchema,
  }).strict(),
  z.object({
    ...GroupFinalReviewEditorialReviewShape,
    phase: z.literal("council_running"),
    councilStage: z.literal("ratification"),
    ratificationRound: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    currentManuscriptArtifactId: UUIDSchema,
    currentResponseArtifactId: UUIDSchema,
    ratificationModelCallIds: z.array(UUIDSchema),
  }).strict(),
]);

const GroupFinalReviewDistillRunningSchema = z.object({
  ...GroupFinalReviewCouncilArtifactsShape,
  phase: z.literal("distill_running"),
  distillTurnId: z.string().min(1).nullable(),
  distillArtifactId: UUIDSchema.optional(),
}).strict();

const GroupFinalReviewLaySummaryRunningSchema = z.object({
  ...GroupFinalReviewCouncilArtifactsShape,
  phase: z.literal("lay_summary_running"),
  distillTurnId: z.string().min(1),
  distillArtifactId: UUIDSchema,
  laySummaryTurnId: z.string().min(1).nullable(),
  laySummaryArtifactId: UUIDSchema.optional(),
}).strict();

const GroupFinalReviewCompletedShape = {
  ...GroupFinalReviewCouncilArtifactsShape,
  phase: z.literal("completed"),
  distillTurnId: z.string().min(1),
  distillArtifactId: UUIDSchema,
  laySummaryTurnId: z.string().min(1),
  laySummaryArtifactId: UUIDSchema,
  infographicJobId: UUIDSchema.nullable(),
};

const GroupFinalReviewCompletedSchema = z.union([
  z.object({
    ...GroupFinalReviewCompletedShape,
    acknowledgedAt: z.null().optional(),
    acknowledgedByUserId: z.null().optional(),
  }).strict(),
  z.object({
    ...GroupFinalReviewCompletedShape,
    acknowledgedAt: ISODateTimeSchema,
    acknowledgedByUserId: z.number().int().positive(),
  }).strict(),
]);

export const GroupFinalReviewResultSchema = z.union([
  z.object({
    phase: z.literal("needs_configuration"),
    configurationErrors: z.array(z.string()),
    warnings: z.array(z.string()).optional(),
  }).strict(),
  GroupFinalReviewReviewerSessionStartingSchema,
  GroupFinalReviewReviewerRunningSchema,
  GroupFinalReviewCodexDraftRunningSchema,
  GroupFinalReviewCouncilRunningSchema,
  GroupFinalReviewCodexRevisionRunningSchema,
  GroupFinalReviewDistillRunningSchema,
  GroupFinalReviewLaySummaryRunningSchema,
  GroupFinalReviewCompletedSchema,
]) satisfies z.ZodType<GroupFinalReviewResult>;

export const PersistedGroupFinalReviewResultSchema = z.preprocess(
  legacyGroupFinalReviewCandidate,
  GroupFinalReviewResultSchema
);

function legacyGroupFinalReviewCandidate(value: unknown): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const {
    manifestArtifactId: _legacyManifestArtifactId,
    ...candidate
  } = value as Record<string, unknown>;
  if (candidate.phase === "needs_configuration") {
    return {
      ...candidate,
      configurationErrors: Array.isArray(candidate.configurationErrors)
        ? candidate.configurationErrors
        : [],
    };
  }
  if (!GroupFinalReviewPhases.includes(candidate.phase as GroupFinalReviewPhase)) return candidate;
  const normalized: Record<string, unknown> = {
    ...candidate,
    reviewerAttempt: candidate.reviewerAttempt ?? 1,
    distillAttempt: candidate.distillAttempt ?? 1,
    laySummaryAttempt: candidate.laySummaryAttempt ?? 1,
    warnings: Array.isArray(candidate.warnings) ? candidate.warnings : [],
  };
  if (
    candidate.phase === "council_running" &&
    candidate.councilStage === undefined
  ) {
    normalized.councilStage = candidate.preprintArtifactId &&
        candidate.councilProceedingsMarkdownArtifactId &&
        candidate.councilProceedingsJsonArtifactId
      ? "artifacts_materialized"
      : Array.isArray(candidate.councilModelCallIds) && candidate.councilModelCallIds.length > 0 &&
          candidate.councilRatifyOutcome && candidate.councilProceedingsSupplement
        ? "council_completed"
        : "reviewer_validated";
  }
  if (
    candidate.phase === "distill_running" ||
    candidate.phase === "lay_summary_running" ||
    candidate.phase === "completed"
  ) {
    normalized.councilStage = "artifacts_materialized";
  }
  if (candidate.phase === "completed" && candidate.infographicJobId === undefined) {
    normalized.infographicJobId = null;
  }
  return normalized;
}

export const PlanningJobSchema = z
  .object({
    id: UUIDSchema,
    groupId: z.number().int().positive(),
    kind: PlanningJobKindSchema,
    status: PlanningJobStatusSchema,
    requestPayload: z.record(z.string(), JsonSchema),
    resultPayload: z.record(z.string(), JsonSchema).nullable().optional(),
    errorPayload: z.record(z.string(), JsonSchema).nullable().optional(),
    modelCallId: UUIDSchema.nullable().optional(),
    backgroundJobId: z.string().nullable().optional(),
    requestedByUserId: z.number().int().positive().nullable().optional(),
    startedAt: ISODateTimeSchema.nullable().optional(),
    finishedAt: ISODateTimeSchema.nullable().optional(),
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
  })
  .strict() satisfies z.ZodType<PlanningJob>;

export const GroupFinalReviewStatusResultSchema = z
  .object({
    groupId: z.number().int().positive(),
    status: GroupFinalReviewStatusSchema,
    ready: z.boolean(),
    stale: z.boolean(),
    planningJob: PlanningJobSchema.nullable().optional(),
    result: GroupFinalReviewResultSchema.nullable().optional(),
  })
  .strict() satisfies z.ZodType<GroupFinalReviewStatusResult>;

export const InfographicSlideSchema = z
  .object({
    id: UUIDSchema,
    jobId: UUIDSchema,
    slideIndex: z.number().int().positive(),
    title: z.string(),
    status: z.string().min(1),
    specPayload: z.record(z.string(), JsonSchema),
    prompt: z.string().nullable().optional(),
    imageModelCallId: UUIDSchema.nullable().optional(),
    artifactId: UUIDSchema.nullable().optional(),
    artifactChecksumSha256: z.string().nullable().optional(),
    errorPayload: z.record(z.string(), JsonSchema).nullable().optional(),
    startedAt: ISODateTimeSchema.nullable().optional(),
    finishedAt: ISODateTimeSchema.nullable().optional(),
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
  })
  .strict() satisfies z.ZodType<InfographicSlide>;

export const InfographicJobSchema = z
  .object({
    id: UUIDSchema,
    groupId: z.number().int().positive(),
    sourceType: z.string().min(1),
    sourceId: z.string().min(1),
    status: z.string().min(1),
    slideCountMode: z.string().min(1),
    requestedSlideCount: z.number().int().positive().nullable().optional(),
    selectedSlideCount: z.number().int().positive().nullable().optional(),
    requestPayload: z.record(z.string(), JsonSchema),
    resultPayload: z.record(z.string(), JsonSchema).nullable().optional(),
    errorPayload: z.record(z.string(), JsonSchema).nullable().optional(),
    designModelCallId: UUIDSchema.nullable().optional(),
    backgroundJobId: z.string().nullable().optional(),
    requestedByUserId: z.number().int().positive().nullable().optional(),
    startedAt: ISODateTimeSchema.nullable().optional(),
    finishedAt: ISODateTimeSchema.nullable().optional(),
    slides: z.array(InfographicSlideSchema).optional(),
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
  })
  .strict() satisfies z.ZodType<InfographicJob>;

export const CreateInfographicJobRequestSchema = z
  .object({
    sourceType: z.string().min(1).optional(),
    sourceId: z.string().trim().min(1).nullable().optional(),
    sourceInputKey: z.string().trim().min(1).nullable().optional(),
    sourceInput: z.record(z.string(), JsonSchema).nullable().optional(),
    autoGenerated: z.boolean().nullable().optional(),
    autoGeneration: z.record(z.string(), JsonSchema).nullable().optional(),
    slideCountMode: z.string().min(1).optional(),
    slideCount: z.number().int().positive().nullable().optional(),
    promptGuidance: z.string().nullable().optional(),
    imageModel: z.string().trim().min(1).nullable().optional(),
    imageSize: z.string().trim().min(1).nullable().optional(),
    imageQuality: z.string().trim().min(1).nullable().optional(),
  })
  .strict() satisfies z.ZodType<CreateInfographicJobRequest>;

export const CreateInfographicJobResponseSchema = z
  .object({
    infographicJob: InfographicJobSchema,
    topic: z.string().min(1),
    queue: z.record(z.string(), JsonSchema),
  })
  .strict() satisfies z.ZodType<CreateInfographicJobResponse>;

export const InfographicImageArchiveSlideSchema = z
  .object({
    slideIndex: z.number().int().positive(),
    title: z.string(),
    filename: z.string().min(1),
    expectedWidth: z.number().int().positive(),
    expectedHeight: z.number().int().positive(),
    sourceStatus: z.string().min(1),
    sourceChecksumSha256: z.string().min(1).nullable().optional(),
  })
  .strict() satisfies z.ZodType<InfographicImageArchiveSlide>;

export const InfographicImageArchiveManifestSchema = z
  .object({
    schemaVersion: z.literal(InfographicImageArchiveSchemaVersion),
    infographicJobId: UUIDSchema,
    imageRevision: z.number().int().nonnegative(),
    generatedAt: ISODateTimeSchema,
    slides: z.array(InfographicImageArchiveSlideSchema).min(1).max(10),
  })
  .strict() satisfies z.ZodType<InfographicImageArchiveManifest>;

export const InfographicImageReplacementSummarySchema = z
  .object({
    replacementId: UUIDSchema,
    replacedAt: ISODateTimeSchema,
    replacedByUserId: z.number().int().positive(),
    previousJobStatus: z.string().min(1),
    slideCount: z.number().int().positive(),
    imageRevision: z.number().int().positive(),
  })
  .strict() satisfies z.ZodType<InfographicImageReplacementSummary>;

export const ReplaceInfographicImagesResponseSchema = z
  .object({
    infographicJob: InfographicJobSchema,
    replacement: InfographicImageReplacementSummarySchema,
  })
  .strict() satisfies z.ZodType<ReplaceInfographicImagesResponse>;

export const ChiefScientistDecisionRecordSchema = z
  .object({
    id: UUIDSchema,
    modelCallId: UUIDSchema,
    reviewPacket: z.record(z.string(), JsonSchema),
    decisionPayload: z.record(z.string(), JsonSchema),
    action: z.string().min(1),
    confidence: z.number().min(0).max(1),
    applyStatus: z.string().min(1),
    appliedAt: ISODateTimeSchema.nullable().optional(),
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
  })
  .strict() satisfies z.ZodType<ChiefScientistDecisionRecord>;

export const HumanReviewCaseSchema = z
  .object({
    id: UUIDSchema,
    scope: ScopeRefSchema,
    status: HumanReviewCaseStatusSchema,
    reviewBoardGroupId: z.number().int().positive(),
    createdFromDecisionId: UUIDSchema.optional(),
    title: z.string().min(1),
    summary: z.string().min(1),
    recommendedAction: ChiefScientistDecisionActionSchema.optional(),
    priority: ReviewPrioritySchema,
    metadata: z.record(z.string(), JsonSchema).optional(),
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
  })
  .strict() satisfies z.ZodType<HumanReviewCase>;

export const HumanReviewCaseMemberSchema = z
  .object({
    id: UUIDSchema,
    caseId: UUIDSchema,
    userId: z.number().int().positive(),
    role: z.string().min(1),
    status: z.string().min(1),
    assignedAt: ISODateTimeSchema,
    resolvedAt: ISODateTimeSchema.nullable().optional(),
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
  })
  .strict() satisfies z.ZodType<HumanReviewCaseMember>;

export const HumanReviewVoteSchema = z
  .object({
    id: UUIDSchema,
    caseId: UUIDSchema,
    userId: z.number().int().positive(),
    voteType: z.string().min(1),
    payload: z.record(z.string(), JsonSchema),
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
  })
  .strict() satisfies z.ZodType<HumanReviewVote>;
