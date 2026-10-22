import { z } from "zod";
import {
  ISODateTimeSchema,
  JsonSchema,
  ScopeRefSchema,
  UUIDSchema,
  type ISODateTime,
  type Json,
  type ScopeRef,
  type UUID,
} from "./core.js";

export type JsonObject = Record<string, Json>;

const jsonObjectSchema = z.record(z.string(), JsonSchema) satisfies z.ZodType<JsonObject>;
const scoreSchema = z.number().min(0).max(1);
const nullableDateSchema = ISODateTimeSchema.nullable().optional();

export const FindingKinds = [
  "result",
  "risk",
  "question",
  "suspicion",
  "recommendation",
] as const;

export type FindingKind = (typeof FindingKinds)[number];

export const FindingStatuses = ["draft", "accepted", "rejected", "published"] as const;
export type FindingStatus = (typeof FindingStatuses)[number];

export interface Finding {
  id: UUID;
  scope: ScopeRef;
  kind: FindingKind;
  title: string;
  summary: string;
  confidence?: number;
  noveltyScore?: number;
  importanceScore?: number;
  status: FindingStatus;
  artifactIds?: UUID[];
}

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
] as const;

export type KnowledgeSourceType = (typeof KnowledgeSourceTypes)[number];

export const KnowledgeAccessLevels = ["public", "restricted", "private", "unknown"] as const;
export type KnowledgeAccessLevel = (typeof KnowledgeAccessLevels)[number];

export interface KnowledgeSource {
  id: UUID;
  scope: ScopeRef;
  sourceType: KnowledgeSourceType;
  name: string;
  baseUri?: string | null;
  externalKey?: string | null;
  authProfileId?: UUID | null;
  cadenceCron?: string | null;
  enabled: boolean;
  ingestionPolicy: JsonObject;
  license?: string | null;
  accessLevel: KnowledgeAccessLevel;
  lastCheckedAt?: ISODateTime | null;
  lastSuccessAt?: ISODateTime | null;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const SweepJobTriggerKinds = [
  "scheduled",
  "manual",
  "signal_followup",
  "experiment_followup",
] as const;

export type SweepJobTriggerKind = (typeof SweepJobTriggerKinds)[number];

export const SweepJobStatuses = ["queued", "running", "completed", "failed", "cancelled"] as const;
export type SweepJobStatus = (typeof SweepJobStatuses)[number];

export interface SweepJob {
  id: UUID;
  scope: ScopeRef;
  sourceId?: UUID | null;
  projectCorpusId?: UUID | null;
  triggerKind: SweepJobTriggerKind;
  status: SweepJobStatus;
  query: JsonObject;
  cursorBefore?: JsonObject | null;
  cursorAfter?: JsonObject | null;
  stats: JsonObject;
  runId?: UUID | null;
  runStepId?: UUID | null;
  modelCallId?: UUID | null;
  startedAt?: ISODateTime | null;
  finishedAt?: ISODateTime | null;
  errorPayload?: JsonObject | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

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
] as const;

export type KnowledgeDocumentType = (typeof KnowledgeDocumentTypes)[number];

export const KnowledgeDocumentStatuses = ["discovered", "fetched", "parsed", "failed", "ignored"] as const;
export type KnowledgeDocumentStatus = (typeof KnowledgeDocumentStatuses)[number];

export interface KnowledgeDocument {
  id: UUID;
  sourceId: UUID;
  sweepJobId?: UUID | null;
  documentType: KnowledgeDocumentType;
  externalId: string;
  canonicalUri?: string | null;
  doi?: string | null;
  pmid?: string | null;
  arxivId?: string | null;
  title: string;
  abstract?: string | null;
  authors: Json[];
  publishedAt?: ISODateTime | null;
  fetchedAt?: ISODateTime | null;
  checksumSha256?: string | null;
  contentArtifactId?: UUID | null;
  normalizedArtifactId?: UUID | null;
  status: KnowledgeDocumentStatus;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

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
] as const;

export type KnowledgeDocumentChunkSectionKind = (typeof KnowledgeDocumentChunkSectionKinds)[number];

export interface KnowledgeDocumentChunk {
  id: UUID;
  documentId: UUID;
  sectionKind: KnowledgeDocumentChunkSectionKind;
  sectionPath: string;
  chunkIndex: number;
  text: string;
  tokenCount?: number | null;
  checksumSha256: string;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

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
] as const;

export type KnowledgeSignalKind = (typeof KnowledgeSignalKinds)[number];

export const KnowledgeSignalStatuses = ["candidate", "accepted", "rejected", "triaged", "escalated"] as const;
export type KnowledgeSignalStatus = (typeof KnowledgeSignalStatuses)[number];

export interface KnowledgeSignal {
  id: UUID;
  scope: ScopeRef;
  documentId?: UUID | null;
  sourceId?: UUID | null;
  sweepJobId?: UUID | null;
  signalKind: KnowledgeSignalKind;
  title: string;
  summary: string;
  noveltyScore?: number | null;
  surpriseScore?: number | null;
  contradictionScore?: number | null;
  relevanceScore?: number | null;
  confidence?: number | null;
  actionabilityScore?: number | null;
  importanceScore?: number | null;
  status: KnowledgeSignalStatus;
  detectedByRunStepId?: UUID | null;
  modelCallId?: UUID | null;
  evidenceRefs: ScopeRef[];
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const ProjectCorpusStatuses = ["active", "paused", "archived"] as const;
export type ProjectCorpusStatus = (typeof ProjectCorpusStatuses)[number];

export interface ProjectCorpus {
  id: UUID;
  scope: ScopeRef;
  name: string;
  description?: string | null;
  inclusionQuery: JsonObject;
  exclusionQuery?: JsonObject | null;
  sourcePolicy: JsonObject;
  status: ProjectCorpusStatus;
  lastSweepJobId?: UUID | null;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const HypothesisStatuses = [
  "proposed",
  "active",
  "evaluating",
  "supported",
  "refuted",
  "superseded",
] as const;

export type HypothesisStatus = (typeof HypothesisStatuses)[number];

export interface Hypothesis {
  id: UUID;
  scope: ScopeRef;
  statement: string;
  rationale?: string | null;
  status: HypothesisStatus;
  confidence?: number | null;
  noveltyScore?: number | null;
  importanceScore?: number | null;
  sourceSignalId?: UUID | null;
  parentHypothesisId?: UUID | null;
  currentBestEvidenceSummary?: string | null;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const ScienceAgentRunStatuses = ["queued", "running", "completed", "failed", "cancelled"] as const;
export type ScienceAgentRunStatus = (typeof ScienceAgentRunStatuses)[number];

export const ScienceAgentRunTerminalStatuses = ["completed", "failed", "cancelled"] as const;
export type ScienceAgentRunTerminalStatus = (typeof ScienceAgentRunTerminalStatuses)[number];

const ScienceAgentRunTerminalStatusSet: ReadonlySet<string> = new Set(ScienceAgentRunTerminalStatuses);

export function isScienceAgentRunTerminalStatus(value: unknown): value is ScienceAgentRunTerminalStatus {
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
] as const;
export type ScienceAgentEventType = (typeof ScienceAgentEventTypes)[number];

export interface ScienceAgentRun {
  id: UUID;
  scope: ScopeRef;
  runId: UUID;
  runStepId: UUID;
  nodeId: UUID;
  nodeKind: string;
  runnerKind: string;
  attempt: number;
  status: ScienceAgentRunStatus | string;
  progress: JsonObject;
  finalOutputPayload?: JsonObject | null;
  errorPayload?: JsonObject | null;
  startedAt?: ISODateTime | null;
  finishedAt?: ISODateTime | null;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface ScienceAgentEvent {
  id: string | number;
  scienceAgentRunId: UUID;
  sequenceNo: number;
  eventType: ScienceAgentEventType | string;
  payload: JsonObject;
  modelCallId?: UUID | null;
  artifactId?: UUID | null;
  createdAt: ISODateTime;
}

export interface LiteratureSweepFinalOutput {
  summary: string;
  sweepJobId: UUID;
  documentIds: UUID[];
  chunkIds: UUID[];
  signalIds: UUID[];
  stats: JsonObject;
}

export interface SignalRankFinalOutput {
  summary: string;
  rankedSignalIds: UUID[];
  acceptedSignalIds: UUID[];
  rejectedSignalIds: UUID[];
}

export interface HypothesisGenerateFinalOutput {
  summary: string;
  hypothesisIds: UUID[];
  sourceSignalIds: UUID[];
}

export interface BriefGenerateFinalOutput {
  summary: string;
  morningBriefId: UUID;
}

export interface EvolutionRoundFinalOutput {
  summary: string;
  programId: UUID;
  roundId: UUID;
  roundNo: number;
  candidateIds: UUID[];
  selectedCandidateIds: UUID[];
  rejectedCandidateIds: UUID[];
  archiveCellIds: UUID[];
  stats: JsonObject;
}

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
] as const;

export type ResearchMemoryAggregateType = (typeof ResearchMemoryAggregateTypes)[number];

export interface ResearchMemoryEvent {
  id: string | number;
  aggregateType: ResearchMemoryAggregateType;
  aggregateId: UUID;
  eventType: string;
  version: number;
  payload: JsonObject;
  idempotencyKey: string;
  createdAt: ISODateTime;
}

export const ProjectionCheckpointStatuses = ["active", "paused", "failed"] as const;
export type ProjectionCheckpointStatus = (typeof ProjectionCheckpointStatuses)[number];

export interface ProjectionCheckpoint {
  projectorName: string;
  lastEventId?: string | number | null;
  lastProcessedAt?: ISODateTime | null;
  status: ProjectionCheckpointStatus;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const ResearchEmbeddingChunkKinds = [
  "document_chunk",
  "claim",
  "finding",
  "signal",
  "hypothesis",
  "candidate",
] as const;

export type ResearchEmbeddingChunkKind = (typeof ResearchEmbeddingChunkKinds)[number];

export interface ResearchEmbedding {
  id: UUID;
  scope: ScopeRef;
  chunkKind: ResearchEmbeddingChunkKind;
  chunkRef: JsonObject;
  contentHash: string;
  embeddingModel: string;
  embeddingDimension: number;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const EmbeddingJobStatuses = ["queued", "running", "completed", "failed", "cancelled"] as const;
export type EmbeddingJobStatus = (typeof EmbeddingJobStatuses)[number];

export interface EmbeddingJob {
  id: UUID;
  targetScope: ScopeRef;
  embeddingModel: string;
  status: EmbeddingJobStatus;
  priority: number;
  inputHash: string;
  errorPayload?: JsonObject | null;
  startedAt?: ISODateTime | null;
  finishedAt?: ISODateTime | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const MorningBriefStatuses = ["draft", "generated", "published", "archived"] as const;
export type MorningBriefStatus = (typeof MorningBriefStatuses)[number];

export interface MorningBrief {
  id: UUID;
  scope: ScopeRef;
  generatedAt: ISODateTime;
  headline: string;
  summary?: string | null;
  status: MorningBriefStatus;
  findingRefs: ScopeRef[];
  openQuestionRefs: ScopeRef[];
  suspiciousItemRefs: ScopeRef[];
  wetLabRequestRefs: ScopeRef[];
  artifactId?: UUID | null;
  modelCallId?: UUID | null;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const DynamicPaperStatuses = ["draft", "active", "paused", "archived"] as const;
export type DynamicPaperStatus = (typeof DynamicPaperStatuses)[number];

export interface DynamicPaper {
  id: UUID;
  scope: ScopeRef;
  title: string;
  slug: string;
  status: DynamicPaperStatus;
  currentRevisionId?: UUID | null;
  ownerGroupId?: number | null;
  policy: JsonObject;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export type DynamicPaperRef = DynamicPaper;

export const DynamicPaperRevisionStatuses = ["draft", "proposed", "approved", "published", "superseded"] as const;
export type DynamicPaperRevisionStatus = (typeof DynamicPaperRevisionStatuses)[number];

export const DynamicPaperBodyFormats = ["markdown", "html", "latex", "json"] as const;
export type DynamicPaperBodyFormat = (typeof DynamicPaperBodyFormats)[number];

export interface DynamicPaperRevision {
  id: UUID;
  paperId: UUID;
  revisionNo: number;
  status: DynamicPaperRevisionStatus;
  title: string;
  abstract?: string | null;
  bodyArtifactId?: UUID | null;
  bodyFormat: DynamicPaperBodyFormat;
  patchFromRevisionId?: UUID | null;
  generatedByRunStepId?: UUID | null;
  modelCallId?: UUID | null;
  reviewCaseId?: UUID | null;
  checksumSha256?: string | null;
  summary?: string | null;
  publishedAt?: ISODateTime | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface DynamicPaperSection {
  id: UUID;
  paperId: UUID;
  revisionId: UUID;
  sectionKey: string;
  heading: string;
  ordinal: number;
  content: string;
  checksumSha256: string;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const DynamicPaperClaimStatuses = [
  "proposed",
  "supported",
  "contested",
  "retracted",
] as const;

export type DynamicPaperClaimStatus = (typeof DynamicPaperClaimStatuses)[number];

export const DynamicPaperClaimTypes = [
  "result",
  "method",
  "interpretation",
  "limitation",
  "recommendation",
] as const;

export type DynamicPaperClaimType = (typeof DynamicPaperClaimTypes)[number];

export interface DynamicPaperClaim {
  id: UUID;
  paperId: UUID;
  revisionId: UUID;
  stableClaimKey: string;
  sectionKey?: string | null;
  claimText: string;
  claimType: DynamicPaperClaimType;
  status: DynamicPaperClaimStatus;
  confidence?: number | null;
  importanceScore?: number | null;
  supersedesClaimId?: UUID | null;
  lastEvaluatedAt?: ISODateTime | null;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const DynamicPaperEvidenceRelations = [
  "supports",
  "contradicts",
  "qualifies",
  "motivates",
  "replaces",
] as const;

export type DynamicPaperEvidenceRelation = (typeof DynamicPaperEvidenceRelations)[number];

export const DynamicPaperEvidenceLinkStatuses = ["proposed", "accepted", "rejected"] as const;
export type DynamicPaperEvidenceLinkStatus = (typeof DynamicPaperEvidenceLinkStatuses)[number];

export interface DynamicPaperEvidenceLink {
  id: UUID;
  claimId: UUID;
  evidence: ScopeRef;
  relation: DynamicPaperEvidenceRelation;
  strength?: number | null;
  confidence?: number | null;
  quote?: string | null;
  locator?: JsonObject | null;
  status: DynamicPaperEvidenceLinkStatus;
  createdByRunStepId?: UUID | null;
  modelCallId?: UUID | null;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const DynamicPaperUpdateKinds = [
  "claim_added",
  "claim_changed",
  "claim_retracted",
  "evidence_added",
  "section_patch",
] as const;

export type DynamicPaperUpdateKind = (typeof DynamicPaperUpdateKinds)[number];

export const DynamicPaperUpdateStatuses = ["proposed", "approved", "rejected", "published"] as const;
export type DynamicPaperUpdateStatus = (typeof DynamicPaperUpdateStatuses)[number];

export const DynamicPaperUpdateImpactLevels = ["low", "medium", "high"] as const;
export type DynamicPaperUpdateImpactLevel = (typeof DynamicPaperUpdateImpactLevels)[number];

export interface DynamicPaperUpdate {
  id: UUID;
  paperId: UUID;
  fromRevisionId?: UUID | null;
  toRevisionId?: UUID | null;
  updateKind: DynamicPaperUpdateKind;
  status: DynamicPaperUpdateStatus;
  impactLevel: DynamicPaperUpdateImpactLevel;
  reason: string;
  patch: JsonObject;
  reviewCaseId?: UUID | null;
  modelCallId?: UUID | null;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const EvolutionProgramStatuses = ["draft", "active", "paused", "completed", "archived"] as const;
export type EvolutionProgramStatus = (typeof EvolutionProgramStatuses)[number];

export interface EvolutionProgram {
  id: UUID;
  scope: ScopeRef;
  name: string;
  description?: string | null;
  targetObjectType: string;
  status: EvolutionProgramStatus;
  objectiveSpec: JsonObject;
  archiveSchema: JsonObject;
  noveltyMetricSpec: JsonObject;
  fitnessMetricSpec: JsonObject;
  constraintSpec: JsonObject;
  budgetPolicy: JsonObject;
  selectionPolicy: JsonObject;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const EvolutionRoundStatuses = ["queued", "running", "generating", "evaluating", "archiving", "completed", "failed"] as const;
export type EvolutionRoundStatus = (typeof EvolutionRoundStatuses)[number];

export interface EvolutionRound {
  id: UUID;
  programId: UUID;
  roundNo: number;
  runId?: UUID | null;
  runStepId?: UUID | null;
  status: EvolutionRoundStatus;
  selectionSnapshot: JsonObject;
  generatorConfig: JsonObject;
  stats: JsonObject;
  startedAt?: ISODateTime | null;
  finishedAt?: ISODateTime | null;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const EvolutionCandidateKinds = [
  "proposal",
  "hypothesis",
  "protocol",
  "model",
  "code",
  "parameter_set",
  "intervention",
] as const;

export type EvolutionCandidateKind = (typeof EvolutionCandidateKinds)[number];

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
] as const;

export type EvolutionCandidateStatus = (typeof EvolutionCandidateStatuses)[number];

export interface EvolutionCandidate {
  id: UUID;
  programId: UUID;
  roundId?: UUID | null;
  candidateKind: EvolutionCandidateKind;
  name?: string | null;
  description?: string | null;
  genome: JsonObject;
  bodySpec: JsonObject;
  materializationArtifactId?: UUID | null;
  sourceHypothesisId?: UUID | null;
  sourceSignalId?: UUID | null;
  status: EvolutionCandidateStatus;
  noveltyScore?: number | null;
  fitnessScore?: number | null;
  diversityCoordinates?: JsonObject | null;
  constraintViolations?: JsonObject | null;
  createdByRunStepId?: UUID | null;
  modelCallId?: UUID | null;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const EvolutionCandidateParentRelations = [
  "mutation",
  "crossover",
  "refinement",
  "imported",
  "seeded_from_signal",
] as const;

export type EvolutionCandidateParentRelation = (typeof EvolutionCandidateParentRelations)[number];

export interface EvolutionCandidateParent {
  candidateId: UUID;
  parentCandidateId: UUID;
  relation: EvolutionCandidateParentRelation;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const EvolutionEvaluationKinds = ["computational", "wetlab", "review", "simulation", "benchmark"] as const;
export type EvolutionEvaluationKind = (typeof EvolutionEvaluationKinds)[number];

export const EvolutionEvaluationStatuses = ["queued", "running", "completed", "failed", "invalidated"] as const;
export type EvolutionEvaluationStatus = (typeof EvolutionEvaluationStatuses)[number];

export interface EvolutionEvaluation {
  id: UUID;
  candidateId: UUID;
  programId: UUID;
  roundId?: UUID | null;
  experimentId?: UUID | null;
  runId?: UUID | null;
  runStepId?: UUID | null;
  evaluatorKind: EvolutionEvaluationKind;
  status: EvolutionEvaluationStatus;
  metrics: JsonObject;
  fitnessScore?: number | null;
  noveltyScore?: number | null;
  confidence?: number | null;
  cost?: JsonObject | null;
  artifactId?: UUID | null;
  findingId?: UUID | null;
  modelCallId?: UUID | null;
  startedAt?: ISODateTime | null;
  finishedAt?: ISODateTime | null;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface EvolutionArchiveCell {
  id: UUID;
  programId: UUID;
  archiveSchemaVersion: string;
  coordinateKey: string;
  coordinates: JsonObject;
  occupantCandidateId?: UUID | null;
  qualityScore?: number | null;
  noveltyScore?: number | null;
  updatedRoundId?: UUID | null;
  history: JsonObject;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

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
  .strict() satisfies z.ZodType<Finding>;

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
  .strict() satisfies z.ZodType<KnowledgeSource>;

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
  .strict() satisfies z.ZodType<SweepJob>;

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
  .strict() satisfies z.ZodType<KnowledgeDocument>;

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
  .strict() satisfies z.ZodType<KnowledgeDocumentChunk>;

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
  .strict() satisfies z.ZodType<KnowledgeSignal>;

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
  .strict() satisfies z.ZodType<ProjectCorpus>;

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
  .strict() satisfies z.ZodType<Hypothesis>;

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
  .strict() satisfies z.ZodType<ScienceAgentRun>;

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
  .strict() satisfies z.ZodType<ScienceAgentEvent>;

export const LiteratureSweepFinalOutputSchema = z
  .object({
    summary: z.string().min(1),
    sweepJobId: UUIDSchema,
    documentIds: z.array(UUIDSchema),
    chunkIds: z.array(UUIDSchema),
    signalIds: z.array(UUIDSchema),
    stats: jsonObjectSchema,
  })
  .strict() satisfies z.ZodType<LiteratureSweepFinalOutput>;

export const SignalRankFinalOutputSchema = z
  .object({
    summary: z.string().min(1),
    rankedSignalIds: z.array(UUIDSchema),
    acceptedSignalIds: z.array(UUIDSchema),
    rejectedSignalIds: z.array(UUIDSchema),
  })
  .strict() satisfies z.ZodType<SignalRankFinalOutput>;

export const HypothesisGenerateFinalOutputSchema = z
  .object({
    summary: z.string().min(1),
    hypothesisIds: z.array(UUIDSchema),
    sourceSignalIds: z.array(UUIDSchema),
  })
  .strict() satisfies z.ZodType<HypothesisGenerateFinalOutput>;

export const BriefGenerateFinalOutputSchema = z
  .object({
    summary: z.string().min(1),
    morningBriefId: UUIDSchema,
  })
  .strict() satisfies z.ZodType<BriefGenerateFinalOutput>;

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
  .strict() satisfies z.ZodType<EvolutionRoundFinalOutput>;

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
  .strict() satisfies z.ZodType<ResearchMemoryEvent>;

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
  .strict() satisfies z.ZodType<ProjectionCheckpoint>;

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
  .strict() satisfies z.ZodType<ResearchEmbedding>;

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
  .strict() satisfies z.ZodType<EmbeddingJob>;

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
  .strict() satisfies z.ZodType<MorningBrief>;

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
  .strict() satisfies z.ZodType<DynamicPaper>;

export const DynamicPaperRefSchema = DynamicPaperSchema satisfies z.ZodType<DynamicPaperRef>;

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
  .strict() satisfies z.ZodType<DynamicPaperRevision>;

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
  .strict() satisfies z.ZodType<DynamicPaperSection>;

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
  .strict() satisfies z.ZodType<DynamicPaperClaim>;

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
  .strict() satisfies z.ZodType<DynamicPaperEvidenceLink>;

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
  .strict() satisfies z.ZodType<DynamicPaperUpdate>;

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
  .strict() satisfies z.ZodType<EvolutionProgram>;

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
  .strict() satisfies z.ZodType<EvolutionRound>;

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
  .strict() satisfies z.ZodType<EvolutionCandidate>;

export const EvolutionCandidateParentSchema = z
  .object({
    candidateId: UUIDSchema,
    parentCandidateId: UUIDSchema,
    relation: EvolutionCandidateParentRelationSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
  })
  .strict() satisfies z.ZodType<EvolutionCandidateParent>;

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
  .strict() satisfies z.ZodType<EvolutionEvaluation>;

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
  .strict() satisfies z.ZodType<EvolutionArchiveCell>;

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

export type EvolutionSeedCandidate = z.infer<typeof EvolutionSeedCandidateSchema>;
export type CreateEvolutionProgramInput = z.infer<typeof CreateEvolutionProgramInputSchema>;
export type UpdateEvolutionProgramInput = z.infer<typeof UpdateEvolutionProgramInputSchema>;
export type StartEvolutionRoundInput = z.infer<typeof StartEvolutionRoundInputSchema>;
export type EvolutionCandidateListFilters = z.infer<typeof EvolutionCandidateListFiltersSchema>;
