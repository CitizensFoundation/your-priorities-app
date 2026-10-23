import { z } from "zod";
import { ISODateTimeSchema, JsonSchema, ScopeRefSchema, UUIDSchema, } from "./core.js";
const jsonObjectSchema = z.record(z.string(), JsonSchema);
const scoreSchema = z.number().min(0).max(1);
const nullableDateSchema = ISODateTimeSchema.nullable().optional();
export const FindingKinds = [
    "result",
    "risk",
    "question",
    "suspicion",
    "recommendation",
];
export const FindingStatuses = ["draft", "accepted", "rejected", "published"];
export const KnowledgeSourceTypes = [
    "arxiv",
    "biorxiv",
    "pubmed",
    "patent",
    "github",
    "conference",
    "registry",
    "blog",
    "manual",
];
export const KnowledgeAccessLevels = ["public", "restricted", "private", "unknown"];
export const SweepJobTriggerKinds = [
    "scheduled",
    "manual",
    "signal_followup",
    "experiment_followup",
];
export const SweepJobStatuses = ["queued", "running", "completed", "failed", "cancelled"];
export const KnowledgeDocumentTypes = [
    "paper",
    "preprint",
    "patent",
    "github_commit",
    "registry_entry",
    "blog_post",
    "manual",
    "dataset",
    "report",
];
export const KnowledgeDocumentStatuses = ["discovered", "fetched", "parsed", "failed", "ignored"];
export const KnowledgeDocumentChunkSectionKinds = [
    "title",
    "abstract",
    "intro",
    "methods",
    "results",
    "discussion",
    "references",
    "code",
    "table",
    "figure",
    "body",
];
export const KnowledgeSignalKinds = [
    "new_result",
    "contradiction",
    "method",
    "dataset",
    "tool",
    "patent",
    "trial",
    "risk",
    "opportunity",
];
export const KnowledgeSignalStatuses = ["candidate", "accepted", "rejected", "triaged", "escalated"];
export const ProjectCorpusStatuses = ["active", "paused", "archived"];
export const HypothesisStatuses = [
    "proposed",
    "active",
    "evaluating",
    "supported",
    "refuted",
    "superseded",
];
export const ScienceAgentRunStatuses = ["queued", "running", "completed", "failed", "cancelled"];
export const ScienceAgentRunTerminalStatuses = ["completed", "failed", "cancelled"];
const ScienceAgentRunTerminalStatusSet = new Set(ScienceAgentRunTerminalStatuses);
export function isScienceAgentRunTerminalStatus(value) {
    return typeof value === "string" && ScienceAgentRunTerminalStatusSet.has(value);
}
export const ScienceAgentEventTypes = [
    "progress",
    "stage_started",
    "stage_completed",
    "model_call_started",
    "model_call_completed",
    "tool_call",
    "artifact",
    "research_memory_write",
    "partial_output",
    "final_output",
    "failed",
    "cancelled",
];
export const ResearchMemoryAggregateTypes = [
    "knowledge_document",
    "knowledge_signal",
    "finding",
    "hypothesis",
    "morning_brief",
    "dynamic_paper",
    "dynamic_paper_revision",
    "dynamic_paper_claim",
    "dynamic_paper_update",
    "evolution_program",
    "evolution_candidate",
    "evolution_evaluation",
    "evolution_archive_cell",
    "artifact",
    "dataset",
];
export const ProjectionCheckpointStatuses = ["active", "paused", "failed"];
export const ResearchEmbeddingChunkKinds = [
    "document_chunk",
    "claim",
    "finding",
    "signal",
    "hypothesis",
    "candidate",
];
export const EmbeddingJobStatuses = ["queued", "running", "completed", "failed", "cancelled"];
export const MorningBriefStatuses = ["draft", "generated", "published", "archived"];
export const DynamicPaperStatuses = ["draft", "active", "paused", "archived"];
export const DynamicPaperRevisionStatuses = ["draft", "proposed", "approved", "published", "superseded"];
export const DynamicPaperBodyFormats = ["markdown", "html", "latex", "json"];
export const DynamicPaperClaimStatuses = [
    "proposed",
    "supported",
    "contested",
    "retracted",
];
export const DynamicPaperClaimTypes = [
    "result",
    "method",
    "interpretation",
    "limitation",
    "recommendation",
];
export const DynamicPaperEvidenceRelations = [
    "supports",
    "contradicts",
    "qualifies",
    "motivates",
    "replaces",
];
export const DynamicPaperEvidenceLinkStatuses = ["proposed", "accepted", "rejected"];
export const DynamicPaperUpdateKinds = [
    "claim_added",
    "claim_changed",
    "claim_retracted",
    "evidence_added",
    "section_patch",
];
export const DynamicPaperUpdateStatuses = ["proposed", "approved", "rejected", "published"];
export const DynamicPaperUpdateImpactLevels = ["low", "medium", "high"];
export const EvolutionProgramStatuses = ["draft", "active", "paused", "completed", "archived"];
export const EvolutionRoundStatuses = ["queued", "running", "generating", "evaluating", "archiving", "completed", "failed"];
export const EvolutionCandidateKinds = [
    "proposal",
    "hypothesis",
    "protocol",
    "model",
    "code",
    "parameter_set",
    "intervention",
];
export const EvolutionCandidateStatuses = [
    "proposed",
    "materialized",
    "queued_for_evaluation",
    "evaluating",
    "evaluated",
    "archived",
    "rejected",
    "needs_review",
    "selected_for_followup",
];
export const EvolutionCandidateParentRelations = [
    "mutation",
    "crossover",
    "refinement",
    "imported",
    "seeded_from_signal",
];
export const EvolutionEvaluationKinds = ["computational", "wetlab", "review", "simulation", "benchmark"];
export const EvolutionEvaluationStatuses = ["queued", "running", "completed", "failed", "invalidated"];
export const FindingKindSchema = z.enum(FindingKinds);
export const FindingStatusSchema = z.enum(FindingStatuses);
export const KnowledgeSourceTypeSchema = z.enum(KnowledgeSourceTypes);
export const KnowledgeAccessLevelSchema = z.enum(KnowledgeAccessLevels);
export const SweepJobTriggerKindSchema = z.enum(SweepJobTriggerKinds);
export const SweepJobStatusSchema = z.enum(SweepJobStatuses);
export const KnowledgeDocumentTypeSchema = z.enum(KnowledgeDocumentTypes);
export const KnowledgeDocumentStatusSchema = z.enum(KnowledgeDocumentStatuses);
export const KnowledgeDocumentChunkSectionKindSchema = z.enum(KnowledgeDocumentChunkSectionKinds);
export const KnowledgeSignalKindSchema = z.enum(KnowledgeSignalKinds);
export const KnowledgeSignalStatusSchema = z.enum(KnowledgeSignalStatuses);
export const ProjectCorpusStatusSchema = z.enum(ProjectCorpusStatuses);
export const HypothesisStatusSchema = z.enum(HypothesisStatuses);
export const ScienceAgentRunStatusSchema = z.enum(ScienceAgentRunStatuses);
export const ScienceAgentEventTypeSchema = z.enum(ScienceAgentEventTypes);
export const ResearchMemoryAggregateTypeSchema = z.enum(ResearchMemoryAggregateTypes);
export const ProjectionCheckpointStatusSchema = z.enum(ProjectionCheckpointStatuses);
export const ResearchEmbeddingChunkKindSchema = z.enum(ResearchEmbeddingChunkKinds);
export const EmbeddingJobStatusSchema = z.enum(EmbeddingJobStatuses);
export const MorningBriefStatusSchema = z.enum(MorningBriefStatuses);
export const DynamicPaperStatusSchema = z.enum(DynamicPaperStatuses);
export const DynamicPaperRevisionStatusSchema = z.enum(DynamicPaperRevisionStatuses);
export const DynamicPaperBodyFormatSchema = z.enum(DynamicPaperBodyFormats);
export const DynamicPaperClaimStatusSchema = z.enum(DynamicPaperClaimStatuses);
export const DynamicPaperClaimTypeSchema = z.enum(DynamicPaperClaimTypes);
export const DynamicPaperEvidenceRelationSchema = z.enum(DynamicPaperEvidenceRelations);
export const DynamicPaperEvidenceLinkStatusSchema = z.enum(DynamicPaperEvidenceLinkStatuses);
export const DynamicPaperUpdateKindSchema = z.enum(DynamicPaperUpdateKinds);
export const DynamicPaperUpdateStatusSchema = z.enum(DynamicPaperUpdateStatuses);
export const DynamicPaperUpdateImpactLevelSchema = z.enum(DynamicPaperUpdateImpactLevels);
export const EvolutionProgramStatusSchema = z.enum(EvolutionProgramStatuses);
export const EvolutionRoundStatusSchema = z.enum(EvolutionRoundStatuses);
export const EvolutionCandidateKindSchema = z.enum(EvolutionCandidateKinds);
export const EvolutionCandidateStatusSchema = z.enum(EvolutionCandidateStatuses);
export const EvolutionCandidateParentRelationSchema = z.enum(EvolutionCandidateParentRelations);
export const EvolutionEvaluationKindSchema = z.enum(EvolutionEvaluationKinds);
export const EvolutionEvaluationStatusSchema = z.enum(EvolutionEvaluationStatuses);
export const FindingSchema = z
    .object({
    id: UUIDSchema,
    scope: ScopeRefSchema,
    kind: FindingKindSchema,
    title: z.string().min(1),
    summary: z.string().min(1),
    confidence: scoreSchema.optional(),
    noveltyScore: scoreSchema.optional(),
    importanceScore: scoreSchema.optional(),
    status: FindingStatusSchema,
    artifactIds: z.array(UUIDSchema).optional(),
})
    .strict();
export const KnowledgeSourceSchema = z
    .object({
    id: UUIDSchema,
    scope: ScopeRefSchema,
    sourceType: KnowledgeSourceTypeSchema,
    name: z.string().min(1),
    baseUri: z.string().min(1).nullable().optional(),
    externalKey: z.string().min(1).nullable().optional(),
    authProfileId: UUIDSchema.nullable().optional(),
    cadenceCron: z.string().min(1).nullable().optional(),
    enabled: z.boolean(),
    ingestionPolicy: jsonObjectSchema,
    license: z.string().min(1).nullable().optional(),
    accessLevel: KnowledgeAccessLevelSchema,
    lastCheckedAt: nullableDateSchema,
    lastSuccessAt: nullableDateSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const SweepJobSchema = z
    .object({
    id: UUIDSchema,
    scope: ScopeRefSchema,
    sourceId: UUIDSchema.nullable().optional(),
    projectCorpusId: UUIDSchema.nullable().optional(),
    triggerKind: SweepJobTriggerKindSchema,
    status: SweepJobStatusSchema,
    query: jsonObjectSchema,
    cursorBefore: jsonObjectSchema.nullable().optional(),
    cursorAfter: jsonObjectSchema.nullable().optional(),
    stats: jsonObjectSchema,
    runId: UUIDSchema.nullable().optional(),
    runStepId: UUIDSchema.nullable().optional(),
    modelCallId: UUIDSchema.nullable().optional(),
    startedAt: nullableDateSchema,
    finishedAt: nullableDateSchema,
    errorPayload: jsonObjectSchema.nullable().optional(),
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const KnowledgeDocumentSchema = z
    .object({
    id: UUIDSchema,
    sourceId: UUIDSchema,
    sweepJobId: UUIDSchema.nullable().optional(),
    documentType: KnowledgeDocumentTypeSchema,
    externalId: z.string().min(1),
    canonicalUri: z.string().min(1).nullable().optional(),
    doi: z.string().min(1).nullable().optional(),
    pmid: z.string().min(1).nullable().optional(),
    arxivId: z.string().min(1).nullable().optional(),
    title: z.string().min(1),
    abstract: z.string().nullable().optional(),
    authors: z.array(JsonSchema),
    publishedAt: nullableDateSchema,
    fetchedAt: nullableDateSchema,
    checksumSha256: z.string().min(1).nullable().optional(),
    contentArtifactId: UUIDSchema.nullable().optional(),
    normalizedArtifactId: UUIDSchema.nullable().optional(),
    status: KnowledgeDocumentStatusSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const KnowledgeDocumentChunkSchema = z
    .object({
    id: UUIDSchema,
    documentId: UUIDSchema,
    sectionKind: KnowledgeDocumentChunkSectionKindSchema,
    sectionPath: z.string(),
    chunkIndex: z.number().int().min(0),
    text: z.string().min(1),
    tokenCount: z.number().int().min(0).nullable().optional(),
    checksumSha256: z.string().min(1),
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const KnowledgeSignalSchema = z
    .object({
    id: UUIDSchema,
    scope: ScopeRefSchema,
    documentId: UUIDSchema.nullable().optional(),
    sourceId: UUIDSchema.nullable().optional(),
    sweepJobId: UUIDSchema.nullable().optional(),
    signalKind: KnowledgeSignalKindSchema,
    title: z.string().min(1),
    summary: z.string().min(1),
    noveltyScore: scoreSchema.nullable().optional(),
    surpriseScore: scoreSchema.nullable().optional(),
    contradictionScore: scoreSchema.nullable().optional(),
    relevanceScore: scoreSchema.nullable().optional(),
    confidence: scoreSchema.nullable().optional(),
    actionabilityScore: scoreSchema.nullable().optional(),
    importanceScore: scoreSchema.nullable().optional(),
    status: KnowledgeSignalStatusSchema,
    detectedByRunStepId: UUIDSchema.nullable().optional(),
    modelCallId: UUIDSchema.nullable().optional(),
    evidenceRefs: z.array(ScopeRefSchema),
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const ProjectCorpusSchema = z
    .object({
    id: UUIDSchema,
    scope: ScopeRefSchema,
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    inclusionQuery: jsonObjectSchema,
    exclusionQuery: jsonObjectSchema.nullable().optional(),
    sourcePolicy: jsonObjectSchema,
    status: ProjectCorpusStatusSchema,
    lastSweepJobId: UUIDSchema.nullable().optional(),
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const HypothesisSchema = z
    .object({
    id: UUIDSchema,
    scope: ScopeRefSchema,
    statement: z.string().min(1),
    rationale: z.string().nullable().optional(),
    status: HypothesisStatusSchema,
    confidence: scoreSchema.nullable().optional(),
    noveltyScore: scoreSchema.nullable().optional(),
    importanceScore: scoreSchema.nullable().optional(),
    sourceSignalId: UUIDSchema.nullable().optional(),
    parentHypothesisId: UUIDSchema.nullable().optional(),
    currentBestEvidenceSummary: z.string().nullable().optional(),
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const ScienceAgentRunSchema = z
    .object({
    id: UUIDSchema,
    scope: ScopeRefSchema,
    runId: UUIDSchema,
    runStepId: UUIDSchema,
    nodeId: UUIDSchema,
    nodeKind: z.string().min(1),
    runnerKind: z.string().min(1),
    attempt: z.number().int().min(1),
    status: z.union([ScienceAgentRunStatusSchema, z.string().min(1)]),
    progress: jsonObjectSchema,
    finalOutputPayload: jsonObjectSchema.nullable().optional(),
    errorPayload: jsonObjectSchema.nullable().optional(),
    startedAt: nullableDateSchema,
    finishedAt: nullableDateSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const ScienceAgentEventSchema = z
    .object({
    id: z.union([z.string().min(1), z.number()]),
    scienceAgentRunId: UUIDSchema,
    sequenceNo: z.number().int().min(1),
    eventType: z.union([ScienceAgentEventTypeSchema, z.string().min(1)]),
    payload: jsonObjectSchema,
    modelCallId: UUIDSchema.nullable().optional(),
    artifactId: UUIDSchema.nullable().optional(),
    createdAt: ISODateTimeSchema,
})
    .strict();
export const LiteratureSweepFinalOutputSchema = z
    .object({
    summary: z.string().min(1),
    sweepJobId: UUIDSchema,
    documentIds: z.array(UUIDSchema),
    chunkIds: z.array(UUIDSchema),
    signalIds: z.array(UUIDSchema),
    stats: jsonObjectSchema,
})
    .strict();
export const SignalRankFinalOutputSchema = z
    .object({
    summary: z.string().min(1),
    rankedSignalIds: z.array(UUIDSchema),
    acceptedSignalIds: z.array(UUIDSchema),
    rejectedSignalIds: z.array(UUIDSchema),
})
    .strict();
export const HypothesisGenerateFinalOutputSchema = z
    .object({
    summary: z.string().min(1),
    hypothesisIds: z.array(UUIDSchema),
    sourceSignalIds: z.array(UUIDSchema),
})
    .strict();
export const BriefGenerateFinalOutputSchema = z
    .object({
    summary: z.string().min(1),
    morningBriefId: UUIDSchema,
})
    .strict();
export const EvolutionRoundFinalOutputSchema = z
    .object({
    summary: z.string().min(1),
    programId: UUIDSchema,
    roundId: UUIDSchema,
    roundNo: z.number().int().min(1),
    candidateIds: z.array(UUIDSchema),
    selectedCandidateIds: z.array(UUIDSchema),
    rejectedCandidateIds: z.array(UUIDSchema),
    archiveCellIds: z.array(UUIDSchema),
    stats: jsonObjectSchema,
})
    .strict();
export const ResearchMemoryEventSchema = z
    .object({
    id: z.union([z.string().min(1), z.number()]),
    aggregateType: ResearchMemoryAggregateTypeSchema,
    aggregateId: UUIDSchema,
    eventType: z.string().min(1),
    version: z.number().int().min(1),
    payload: jsonObjectSchema,
    idempotencyKey: z.string().min(1),
    createdAt: ISODateTimeSchema,
})
    .strict();
export const ProjectionCheckpointSchema = z
    .object({
    projectorName: z.string().min(1),
    lastEventId: z.union([z.string().min(1), z.number()]).nullable().optional(),
    lastProcessedAt: nullableDateSchema,
    status: ProjectionCheckpointStatusSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const ResearchEmbeddingSchema = z
    .object({
    id: UUIDSchema,
    scope: ScopeRefSchema,
    chunkKind: ResearchEmbeddingChunkKindSchema,
    chunkRef: jsonObjectSchema,
    contentHash: z.string().min(1),
    embeddingModel: z.string().min(1),
    embeddingDimension: z.number().int().min(1),
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const EmbeddingJobSchema = z
    .object({
    id: UUIDSchema,
    targetScope: ScopeRefSchema,
    embeddingModel: z.string().min(1),
    status: EmbeddingJobStatusSchema,
    priority: z.number().int(),
    inputHash: z.string().min(1),
    errorPayload: jsonObjectSchema.nullable().optional(),
    startedAt: nullableDateSchema,
    finishedAt: nullableDateSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const MorningBriefSchema = z
    .object({
    id: UUIDSchema,
    scope: ScopeRefSchema,
    generatedAt: ISODateTimeSchema,
    headline: z.string().min(1),
    summary: z.string().nullable().optional(),
    status: MorningBriefStatusSchema,
    findingRefs: z.array(ScopeRefSchema),
    openQuestionRefs: z.array(ScopeRefSchema),
    suspiciousItemRefs: z.array(ScopeRefSchema),
    wetLabRequestRefs: z.array(ScopeRefSchema),
    artifactId: UUIDSchema.nullable().optional(),
    modelCallId: UUIDSchema.nullable().optional(),
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const DynamicPaperSchema = z
    .object({
    id: UUIDSchema,
    scope: ScopeRefSchema,
    title: z.string().min(1),
    slug: z.string().min(1),
    status: DynamicPaperStatusSchema,
    currentRevisionId: UUIDSchema.nullable().optional(),
    ownerGroupId: z.number().int().positive().nullable().optional(),
    policy: jsonObjectSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const DynamicPaperRefSchema = DynamicPaperSchema;
export const DynamicPaperRevisionSchema = z
    .object({
    id: UUIDSchema,
    paperId: UUIDSchema,
    revisionNo: z.number().int().min(1),
    status: DynamicPaperRevisionStatusSchema,
    title: z.string().min(1),
    abstract: z.string().nullable().optional(),
    bodyArtifactId: UUIDSchema.nullable().optional(),
    bodyFormat: DynamicPaperBodyFormatSchema,
    patchFromRevisionId: UUIDSchema.nullable().optional(),
    generatedByRunStepId: UUIDSchema.nullable().optional(),
    modelCallId: UUIDSchema.nullable().optional(),
    reviewCaseId: UUIDSchema.nullable().optional(),
    checksumSha256: z.string().min(1).nullable().optional(),
    summary: z.string().nullable().optional(),
    publishedAt: nullableDateSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const DynamicPaperSectionSchema = z
    .object({
    id: UUIDSchema,
    paperId: UUIDSchema,
    revisionId: UUIDSchema,
    sectionKey: z.string().min(1),
    heading: z.string().min(1),
    ordinal: z.number().int().min(0),
    content: z.string(),
    checksumSha256: z.string().min(1),
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const DynamicPaperClaimSchema = z
    .object({
    id: UUIDSchema,
    paperId: UUIDSchema,
    revisionId: UUIDSchema,
    stableClaimKey: z.string().min(1),
    sectionKey: z.string().min(1).nullable().optional(),
    claimText: z.string().min(1),
    claimType: DynamicPaperClaimTypeSchema,
    status: DynamicPaperClaimStatusSchema,
    confidence: scoreSchema.nullable().optional(),
    importanceScore: scoreSchema.nullable().optional(),
    supersedesClaimId: UUIDSchema.nullable().optional(),
    lastEvaluatedAt: nullableDateSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const DynamicPaperEvidenceLinkSchema = z
    .object({
    id: UUIDSchema,
    claimId: UUIDSchema,
    evidence: ScopeRefSchema,
    relation: DynamicPaperEvidenceRelationSchema,
    strength: scoreSchema.nullable().optional(),
    confidence: scoreSchema.nullable().optional(),
    quote: z.string().nullable().optional(),
    locator: jsonObjectSchema.nullable().optional(),
    status: DynamicPaperEvidenceLinkStatusSchema,
    createdByRunStepId: UUIDSchema.nullable().optional(),
    modelCallId: UUIDSchema.nullable().optional(),
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const DynamicPaperUpdateSchema = z
    .object({
    id: UUIDSchema,
    paperId: UUIDSchema,
    fromRevisionId: UUIDSchema.nullable().optional(),
    toRevisionId: UUIDSchema.nullable().optional(),
    updateKind: DynamicPaperUpdateKindSchema,
    status: DynamicPaperUpdateStatusSchema,
    impactLevel: DynamicPaperUpdateImpactLevelSchema,
    reason: z.string().min(1),
    patch: jsonObjectSchema,
    reviewCaseId: UUIDSchema.nullable().optional(),
    modelCallId: UUIDSchema.nullable().optional(),
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const EvolutionProgramSchema = z
    .object({
    id: UUIDSchema,
    scope: ScopeRefSchema,
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    targetObjectType: z.string().min(1),
    status: EvolutionProgramStatusSchema,
    objectiveSpec: jsonObjectSchema,
    archiveSchema: jsonObjectSchema,
    noveltyMetricSpec: jsonObjectSchema,
    fitnessMetricSpec: jsonObjectSchema,
    constraintSpec: jsonObjectSchema,
    budgetPolicy: jsonObjectSchema,
    selectionPolicy: jsonObjectSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const EvolutionRoundSchema = z
    .object({
    id: UUIDSchema,
    programId: UUIDSchema,
    roundNo: z.number().int().min(1),
    runId: UUIDSchema.nullable().optional(),
    runStepId: UUIDSchema.nullable().optional(),
    status: EvolutionRoundStatusSchema,
    selectionSnapshot: jsonObjectSchema,
    generatorConfig: jsonObjectSchema,
    stats: jsonObjectSchema,
    startedAt: nullableDateSchema,
    finishedAt: nullableDateSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const EvolutionCandidateSchema = z
    .object({
    id: UUIDSchema,
    programId: UUIDSchema,
    roundId: UUIDSchema.nullable().optional(),
    candidateKind: EvolutionCandidateKindSchema,
    name: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    genome: jsonObjectSchema,
    bodySpec: jsonObjectSchema,
    materializationArtifactId: UUIDSchema.nullable().optional(),
    sourceHypothesisId: UUIDSchema.nullable().optional(),
    sourceSignalId: UUIDSchema.nullable().optional(),
    status: EvolutionCandidateStatusSchema,
    noveltyScore: scoreSchema.nullable().optional(),
    fitnessScore: scoreSchema.nullable().optional(),
    diversityCoordinates: jsonObjectSchema.nullable().optional(),
    constraintViolations: jsonObjectSchema.nullable().optional(),
    createdByRunStepId: UUIDSchema.nullable().optional(),
    modelCallId: UUIDSchema.nullable().optional(),
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const EvolutionCandidateParentSchema = z
    .object({
    candidateId: UUIDSchema,
    parentCandidateId: UUIDSchema,
    relation: EvolutionCandidateParentRelationSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const EvolutionEvaluationSchema = z
    .object({
    id: UUIDSchema,
    candidateId: UUIDSchema,
    programId: UUIDSchema,
    roundId: UUIDSchema.nullable().optional(),
    experimentId: UUIDSchema.nullable().optional(),
    runId: UUIDSchema.nullable().optional(),
    runStepId: UUIDSchema.nullable().optional(),
    evaluatorKind: EvolutionEvaluationKindSchema,
    status: EvolutionEvaluationStatusSchema,
    metrics: jsonObjectSchema,
    fitnessScore: scoreSchema.nullable().optional(),
    noveltyScore: scoreSchema.nullable().optional(),
    confidence: scoreSchema.nullable().optional(),
    cost: jsonObjectSchema.nullable().optional(),
    artifactId: UUIDSchema.nullable().optional(),
    findingId: UUIDSchema.nullable().optional(),
    modelCallId: UUIDSchema.nullable().optional(),
    startedAt: nullableDateSchema,
    finishedAt: nullableDateSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const EvolutionArchiveCellSchema = z
    .object({
    id: UUIDSchema,
    programId: UUIDSchema,
    archiveSchemaVersion: z.string().min(1),
    coordinateKey: z.string().min(1),
    coordinates: jsonObjectSchema,
    occupantCandidateId: UUIDSchema.nullable().optional(),
    qualityScore: scoreSchema.nullable().optional(),
    noveltyScore: scoreSchema.nullable().optional(),
    updatedRoundId: UUIDSchema.nullable().optional(),
    history: jsonObjectSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const EvolutionSeedCandidateSchema = z
    .object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    genome: jsonObjectSchema.optional(),
    bodySpec: jsonObjectSchema.optional(),
    metadata: jsonObjectSchema.optional(),
})
    .strict();
export const CreateEvolutionProgramInputSchema = z
    .object({
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    targetObjectType: z.string().min(1).optional(),
    status: EvolutionProgramStatusSchema.optional(),
    objectiveSpec: jsonObjectSchema.optional(),
    archiveSchema: jsonObjectSchema.optional(),
    noveltyMetricSpec: jsonObjectSchema.optional(),
    fitnessMetricSpec: jsonObjectSchema.optional(),
    constraintSpec: jsonObjectSchema.optional(),
    budgetPolicy: jsonObjectSchema.optional(),
    selectionPolicy: jsonObjectSchema.optional(),
    metadata: jsonObjectSchema.optional(),
})
    .strict();
export const UpdateEvolutionProgramInputSchema = z
    .object({
    name: z.string().min(1).optional(),
    description: z.string().nullable().optional(),
    status: EvolutionProgramStatusSchema.optional(),
    objectiveSpec: jsonObjectSchema.optional(),
    archiveSchema: jsonObjectSchema.optional(),
    noveltyMetricSpec: jsonObjectSchema.optional(),
    fitnessMetricSpec: jsonObjectSchema.optional(),
    constraintSpec: jsonObjectSchema.optional(),
    budgetPolicy: jsonObjectSchema.optional(),
    selectionPolicy: jsonObjectSchema.optional(),
    metadata: jsonObjectSchema.optional(),
})
    .strict();
export const StartEvolutionRoundInputSchema = z
    .object({
    runId: UUIDSchema.nullable().optional(),
    runStepId: UUIDSchema.nullable().optional(),
    candidateKind: EvolutionCandidateKindSchema.optional(),
    seedCandidates: z.array(EvolutionSeedCandidateSchema).optional(),
    generatorConfig: jsonObjectSchema.optional(),
    selectionPolicy: jsonObjectSchema.optional(),
    budgetPolicy: jsonObjectSchema.optional(),
    metadata: jsonObjectSchema.optional(),
})
    .strict();
export const EvolutionCandidateListFiltersSchema = z
    .object({
    roundId: UUIDSchema.optional(),
    status: EvolutionCandidateStatusSchema.optional(),
    candidateKind: EvolutionCandidateKindSchema.optional(),
    limit: z.number().int().min(1).max(500).optional(),
})
    .strict();
