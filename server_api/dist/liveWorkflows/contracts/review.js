import { z } from "zod";
import { ByteCountSchema, ISODateTimeSchema, JsonSchema, ScopeRefSchema, UUIDSchema, } from "./core.js";
import { CodexDiffSummarySchema, CodexPlanStepSchema, } from "./session.js";
import { PromptTemplateReferenceSchema, ResearcherModelSelectorSchema, WorkflowModelRosterMemberSchema, } from "./workflow.js";
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
];
export const AgentStepBoundaryStatuses = ["open", "reviewing", "resolved"];
export const PendingApprovalKinds = [
    "command_execution",
    "file_change",
    "network_access",
    "tool_input",
];
export const ApprovalTaskStatuses = ["pending", "approved", "rejected", "cancelled", "resolved"];
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
];
export const ModelCallStatuses = ["queued", "running", "completed", "failed", "cancelled"];
export const ModelCallTerminalStatuses = ["completed", "failed", "cancelled"];
const ModelCallTerminalStatusSet = new Set(ModelCallTerminalStatuses);
export function isModelCallTerminalStatus(value) {
    return typeof value === "string" && ModelCallTerminalStatusSet.has(value);
}
export const PlanningJobStatuses = ["queued", "running", "waiting_for_input", "completed", "failed", "cancelled"];
export const PlanningJobTerminalStatuses = ["completed", "failed", "cancelled"];
const PlanningJobTerminalStatusSet = new Set(PlanningJobTerminalStatuses);
export function isPlanningJobTerminalStatus(value) {
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
];
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
];
export const GroupFinalReviewExecutionSystemRole = "group_final_review_execution";
export const CodeDataReviewExecutionSystemRole = "code_data_review_execution";
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
];
const GroupFinalReviewTurnPhaseDescriptorByPhase = new Map(GroupFinalReviewTurnPhaseDescriptors.flatMap((descriptor) => [
    [descriptor.resultPhase, descriptor],
    [descriptor.commandPhase, descriptor],
]));
export function getGroupFinalReviewTurnPhaseDescriptor(value) {
    return typeof value === "string" ? GroupFinalReviewTurnPhaseDescriptorByPhase.get(value) ?? null : null;
}
export function groupFinalReviewTurnAttempt(result, descriptor) {
    return result[descriptor.attemptField] ?? 1;
}
export function groupFinalReviewEditorialRevisionCommandAttempt(ratificationRound, validationAttempt) {
    return ratificationRound * 100 + validationAttempt;
}
export function groupFinalReviewTurnCommandAttempt(result, descriptor) {
    const validationAttempt = groupFinalReviewTurnAttempt(result, descriptor);
    return descriptor.commandPhase === "preprint-revision" && result.phase === "codex_revision_running"
        ? groupFinalReviewEditorialRevisionCommandAttempt(result.ratificationRound, validationAttempt)
        : validationAttempt;
}
export function groupFinalReviewTurnId(result, descriptor) {
    const turnId = result[descriptor.turnIdField];
    return typeof turnId === "string" && turnId.trim().length > 0 ? turnId.trim() : null;
}
export function withGroupFinalReviewTurnId(result, descriptor, turnId) {
    return { ...result, [descriptor.turnIdField]: turnId };
}
export function resetGroupFinalReviewTurnAttempt(result, descriptor) {
    return { ...result, [descriptor.attemptField]: 1 };
}
export const GroupFinalReviewDispositions = ["clear", "caution", "blocked"];
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
];
export const GroupReviewPreprintFormats = ["attributed_v1"];
export const GroupReviewPreprintOmissionReasons = [
    "no_completed_bundle",
    "paper_draft_missing",
    "artifact_unreadable",
    "artifact_not_mounted",
];
export const GroupFinalReviewPromptTemplateTargetKinds = [
    "group_final_review_agents_md",
    "group_final_review_reviewer",
    "group_final_review_reviewer_correction",
    "paper_distill",
    "group_final_review_distill_correction",
    "paper_lay_summary",
    "group_final_review_lay_summary_correction",
];
export const GroupFinalReviewEditorialPromptTemplateTargetKinds = [
    "group_final_review_preprint_draft",
    "group_final_review_preprint_draft_correction",
    "group_final_review_preprint_revision",
    "group_final_review_preprint_revision_correction",
    "group_final_review_council_member_system",
    "group_final_review_council_chair_system",
];
export const GroupFinalReviewCouncilStages = [
    "reviewer_validated",
    "editorial_review",
    "ratification",
    "council_completed",
    "artifacts_materialized",
];
export const InfographicJobStatuses = ["queued", "running", "completed", "failed", "cancelled"];
export const InfographicJobTerminalStatuses = ["completed", "failed", "cancelled"];
const InfographicJobTerminalStatusSet = new Set(InfographicJobTerminalStatuses);
export function isInfographicJobTerminalStatus(value) {
    return typeof value === "string" && InfographicJobTerminalStatusSet.has(value);
}
export const InfographicSlideStatuses = ["queued", "running", "completed", "failed", "cancelled"];
export const InfographicSlideTerminalStatuses = ["completed", "failed", "cancelled"];
const InfographicSlideTerminalStatusSet = new Set(InfographicSlideTerminalStatuses);
export function isInfographicSlideTerminalStatus(value) {
    return typeof value === "string" && InfographicSlideTerminalStatusSet.has(value);
}
export const InfographicSourceTypes = ["group_plan", "experiment_plan", "preprint"];
export const InfographicSlideCountModes = ["auto", "fixed"];
export const InfographicImageArchiveSchemaVersion = 1;
export const ChiefScientistDecisionApplyStatuses = ["pending", "applied", "failed", "skipped"];
export const ReviewPriorities = ["low", "normal", "high", "critical"];
export const HumanReviewCaseStatuses = [
    "open",
    "claimed",
    "in_discussion",
    "waiting_vote",
    "resolved",
    "rejected",
    "superseded",
];
export const HumanReviewCaseTerminalStatuses = ["resolved", "rejected", "superseded"];
const HumanReviewCaseTerminalStatusSet = new Set(HumanReviewCaseTerminalStatuses);
export function isHumanReviewCaseTerminalStatus(value) {
    return typeof value === "string" && HumanReviewCaseTerminalStatusSet.has(value);
}
export const HumanReviewDirectionTextMaxLength = 35000;
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
    recommendation: z.string().trim().min(1).max(12000),
    rationale: z.string().trim().min(1).max(12000),
    benefits: z.array(z.string().trim().min(1).max(4000)).max(12),
    risks: z.array(z.string().trim().min(1).max(4000)).max(12),
    chiefInstruction: z.string().trim().min(1).max(12000),
})
    .strict();
export const HumanReviewPlannerAdviceSchema = z
    .object({
    summary: z.string().trim().min(1).max(12000),
    fullLaySummary: z.string().trim().min(1).max(12000).optional(),
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
});
export const HumanReviewDirectionInputSchema = z.discriminatedUnion("kind", [
    z.object({
        kind: z.literal("planner_option"),
        optionId: z.string().trim().min(1).max(200),
    }).strict(),
    z.object({
        kind: z.literal("custom"),
        text: z.string().trim().min(1).max(HumanReviewDirectionTextMaxLength),
    }).strict(),
]);
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
]);
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
    .strict();
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
    .strict();
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
    .strict();
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
    .strict();
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
    .strict();
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
    .strict();
export const CodeDataReviewConfigurationSchema = z
    .object({
    enabled: z.boolean().default(true),
    interval: z.number().int().min(1).max(50).default(3),
})
    .strict();
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
});
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
    .strict();
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
    .strict();
export const AiCouncilProceedingsSupplementSchema = z
    .object({
    roster: z.array(z.record(z.string(), JsonSchema)).min(1),
    drafts: z.array(z.record(z.string(), JsonSchema)).min(1),
    ballots: z.array(z.record(z.string(), JsonSchema)),
    aggregateRanking: z.record(z.string(), JsonSchema),
    ratifications: z.array(z.record(z.string(), JsonSchema)).min(1),
})
    .strict();
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
    .strict();
export const GroupFinalReviewSourceManifestSchema = z
    .object({
    version: z.literal(1),
    groupId: z.number().int().positive(),
    planningJobId: UUIDSchema,
    sourceFingerprint: z.string().regex(/^[a-f0-9]{64}$/iu),
    generatedAt: ISODateTimeSchema,
    entries: z.array(GroupFinalReviewSourceManifestEntrySchema),
})
    .strict();
export const GroupFinalReviewEvidenceReferenceSchema = z
    .object({
    sourceKind: z.enum(["preprint", "workspace", "artifact", "cache", "dataset"]),
    sourceRef: z.string().min(1),
    sourcePath: z.string().min(1),
    description: z.string().min(1),
    excerpt: z.string().nullable().optional(),
})
    .strict();
export const GroupFinalReviewFindingSchema = z
    .object({
    rank: z.number().int().positive(),
    title: z.string().min(1),
    summary: z.string().min(1),
    significance: z.string().min(1),
    evidence: z.array(GroupFinalReviewEvidenceReferenceSchema).min(1),
})
    .strict();
export const GroupFinalReviewSelectedFigureSchema = z
    .object({
    artifactId: UUIDSchema,
    sourcePath: z.string().min(1),
    caption: z.string().min(1),
    altText: z.string().min(1),
})
    .strict();
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
    .strict();
export const GroupReviewPreprintOmissionReasonSchema = z.enum(GroupReviewPreprintOmissionReasons);
export const GroupReviewPreprintOmissionSchema = z
    .object({
    experimentId: UUIDSchema,
    experimentName: z.string().min(1),
    reason: GroupReviewPreprintOmissionReasonSchema,
})
    .strict();
export const GroupReviewPreprintCoverageSchema = z
    .object({
    expectedExperimentIds: z.array(UUIDSchema),
    includedExperimentIds: z.array(UUIDSchema),
    omittedExperiments: z.array(GroupReviewPreprintOmissionSchema),
})
    .strict();
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
    .strict();
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
    .strict();
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
    .strict();
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
    .strict();
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
    .strict();
export const GroupFinalReviewPromptTemplateReferencesSchema = z.record(z.enum(GroupFinalReviewPromptTemplateTargetKinds), PromptTemplateReferenceSchema);
export const GroupFinalReviewEditorialPromptTemplateReferencesSchema = z.record(z.enum(GroupFinalReviewEditorialPromptTemplateTargetKinds), PromptTemplateReferenceSchema);
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
]);
export const PersistedGroupFinalReviewResultSchema = z.preprocess(legacyGroupFinalReviewCandidate, GroupFinalReviewResultSchema);
function legacyGroupFinalReviewCandidate(value) {
    if (!value || typeof value !== "object" || Array.isArray(value))
        return value;
    const { manifestArtifactId: _legacyManifestArtifactId, ...candidate } = value;
    if (candidate.phase === "needs_configuration") {
        return {
            ...candidate,
            configurationErrors: Array.isArray(candidate.configurationErrors)
                ? candidate.configurationErrors
                : [],
        };
    }
    if (!GroupFinalReviewPhases.includes(candidate.phase))
        return candidate;
    const normalized = {
        ...candidate,
        reviewerAttempt: candidate.reviewerAttempt ?? 1,
        distillAttempt: candidate.distillAttempt ?? 1,
        laySummaryAttempt: candidate.laySummaryAttempt ?? 1,
        warnings: Array.isArray(candidate.warnings) ? candidate.warnings : [],
    };
    if (candidate.phase === "council_running" &&
        candidate.councilStage === undefined) {
        normalized.councilStage = candidate.preprintArtifactId &&
            candidate.councilProceedingsMarkdownArtifactId &&
            candidate.councilProceedingsJsonArtifactId
            ? "artifacts_materialized"
            : Array.isArray(candidate.councilModelCallIds) && candidate.councilModelCallIds.length > 0 &&
                candidate.councilRatifyOutcome && candidate.councilProceedingsSupplement
                ? "council_completed"
                : "reviewer_validated";
    }
    if (candidate.phase === "distill_running" ||
        candidate.phase === "lay_summary_running" ||
        candidate.phase === "completed") {
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
    .strict();
export const GroupFinalReviewStatusResultSchema = z
    .object({
    groupId: z.number().int().positive(),
    status: GroupFinalReviewStatusSchema,
    ready: z.boolean(),
    stale: z.boolean(),
    planningJob: PlanningJobSchema.nullable().optional(),
    result: GroupFinalReviewResultSchema.nullable().optional(),
})
    .strict();
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
    .strict();
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
    .strict();
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
    .strict();
export const CreateInfographicJobResponseSchema = z
    .object({
    infographicJob: InfographicJobSchema,
    topic: z.string().min(1),
    queue: z.record(z.string(), JsonSchema),
})
    .strict();
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
    .strict();
export const InfographicImageArchiveManifestSchema = z
    .object({
    schemaVersion: z.literal(InfographicImageArchiveSchemaVersion),
    infographicJobId: UUIDSchema,
    imageRevision: z.number().int().nonnegative(),
    generatedAt: ISODateTimeSchema,
    slides: z.array(InfographicImageArchiveSlideSchema).min(1).max(10),
})
    .strict();
export const InfographicImageReplacementSummarySchema = z
    .object({
    replacementId: UUIDSchema,
    replacedAt: ISODateTimeSchema,
    replacedByUserId: z.number().int().positive(),
    previousJobStatus: z.string().min(1),
    slideCount: z.number().int().positive(),
    imageRevision: z.number().int().positive(),
})
    .strict();
export const ReplaceInfographicImagesResponseSchema = z
    .object({
    infographicJob: InfographicJobSchema,
    replacement: InfographicImageReplacementSummarySchema,
})
    .strict();
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
    .strict();
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
    .strict();
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
    .strict();
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
    .strict();
