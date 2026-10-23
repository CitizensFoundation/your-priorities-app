import assert from "node:assert/strict";
import test from "node:test";
import { DynamicPaperRefSchema, DynamicPaperRevisionSchema, EmbeddingJobSchema, CreateEvolutionProgramInputSchema, EvolutionCandidateSchema, EvolutionCandidateListFiltersSchema, EvolutionProgramSchema, EvolutionRoundSchema, EvolutionRoundFinalOutputSchema, StartEvolutionRoundInputSchema, BriefGenerateFinalOutputSchema, HypothesisGenerateFinalOutputSchema, KnowledgeSignalSchema, LiteratureSweepFinalOutputSchema, MorningBriefSchema, ResearchEmbeddingSchema, ResearchMemoryEventSchema, ScienceAgentEventSchema, ScienceAgentRunSchema, SignalRankFinalOutputSchema, } from "../../index.js";
const now = "2026-06-15T12:00:00.000Z";
const uuid = "11111111-1111-4111-8111-111111111111";
test("science schemas use scoped research-memory records", () => {
    const signal = KnowledgeSignalSchema.parse({
        id: uuid,
        scope: { type: "group", id: uuid },
        signalKind: "contradiction",
        title: "New result changes priority",
        summary: "A new paper contradicts an active assumption.",
        noveltyScore: 0.8,
        status: "candidate",
        evidenceRefs: [{ type: "knowledge_document_chunk", id: uuid }],
        metadata: { reviewer: "cip" },
        createdAt: now,
        updatedAt: now,
    });
    assert.equal(signal.scope.type, "group");
    assert.equal(signal.signalKind, "contradiction");
    assert.throws(() => KnowledgeSignalSchema.parse({
        ...signal,
        communityId: uuid,
    }));
    const paper = DynamicPaperRefSchema.parse({
        id: uuid,
        scope: { type: "project_corpus", id: uuid },
        title: "Living review",
        slug: "living-review",
        status: "active",
        currentRevisionId: null,
        ownerGroupId: 7,
        policy: { highImpactReview: true },
        metadata: {},
        createdAt: now,
        updatedAt: now,
    });
    assert.equal(paper.scope.type, "project_corpus");
    assert.throws(() => DynamicPaperRefSchema.parse({
        ...paper,
        communityId: uuid,
    }));
});
test("research memory event schema captures idempotent projection events", () => {
    const event = ResearchMemoryEventSchema.parse({
        id: "1",
        aggregateType: "knowledge_signal",
        aggregateId: uuid,
        eventType: "knowledge_signal.created",
        version: 1,
        payload: { status: "candidate" },
        idempotencyKey: "knowledge_signal.created:11111111-1111-4111-8111-111111111111:1",
        createdAt: now,
    });
    assert.equal(event.aggregateType, "knowledge_signal");
    assert.equal(event.version, 1);
});
test("science-agent run, event, and V1 final output schemas parse durable runner records", () => {
    const run = ScienceAgentRunSchema.parse({
        id: uuid,
        scope: { type: "run", id: uuid },
        runId: uuid,
        runStepId: uuid,
        nodeId: uuid,
        nodeKind: "signal_rank",
        runnerKind: "policy_synth_task",
        attempt: 1,
        status: "running",
        progress: { message: "Ranking" },
        finalOutputPayload: null,
        errorPayload: null,
        startedAt: now,
        finishedAt: null,
        metadata: {},
        createdAt: now,
        updatedAt: now,
    });
    assert.equal(run.status, "running");
    const event = ScienceAgentEventSchema.parse({
        id: uuid,
        scienceAgentRunId: uuid,
        sequenceNo: 1,
        eventType: "model_call_started",
        payload: { role: "signal_rank" },
        modelCallId: uuid,
        artifactId: null,
        createdAt: now,
    });
    assert.equal(event.eventType, "model_call_started");
    assert.equal(LiteratureSweepFinalOutputSchema.parse({
        summary: "Sweep complete",
        sweepJobId: uuid,
        documentIds: [uuid],
        chunkIds: [uuid],
        signalIds: [uuid],
        stats: { documents: 1 },
    }).signalIds.length, 1);
    assert.equal(SignalRankFinalOutputSchema.parse({
        summary: "Ranked",
        rankedSignalIds: [uuid],
        acceptedSignalIds: [uuid],
        rejectedSignalIds: [],
    }).acceptedSignalIds.length, 1);
    assert.equal(HypothesisGenerateFinalOutputSchema.parse({
        summary: "Generated",
        hypothesisIds: [uuid],
        sourceSignalIds: [uuid],
    }).hypothesisIds.length, 1);
    assert.equal(BriefGenerateFinalOutputSchema.parse({
        summary: "Brief ready",
        morningBriefId: uuid,
    }).morningBriefId, uuid);
});
test("dynamic paper, evolution, and embedding schemas parse table-backed records", () => {
    const paperRevision = DynamicPaperRevisionSchema.parse({
        id: uuid,
        paperId: uuid,
        revisionNo: 1,
        status: "draft",
        title: "Living review",
        abstract: null,
        bodyArtifactId: null,
        bodyFormat: "markdown",
        patchFromRevisionId: null,
        generatedByRunStepId: null,
        modelCallId: null,
        reviewCaseId: null,
        checksumSha256: "abc123",
        summary: null,
        publishedAt: null,
        createdAt: now,
        updatedAt: now,
    });
    assert.equal(paperRevision.bodyFormat, "markdown");
    const program = EvolutionProgramSchema.parse({
        id: uuid,
        scope: { type: "group", id: uuid },
        name: "Protocol search",
        description: null,
        targetObjectType: "protocol",
        status: "active",
        objectiveSpec: {},
        archiveSchema: { version: "v1" },
        noveltyMetricSpec: {},
        fitnessMetricSpec: {},
        constraintSpec: {},
        budgetPolicy: {},
        selectionPolicy: {},
        metadata: {},
        createdAt: now,
        updatedAt: now,
    });
    assert.equal(program.targetObjectType, "protocol");
    const round = EvolutionRoundSchema.parse({
        id: uuid,
        programId: uuid,
        roundNo: 1,
        runId: null,
        runStepId: null,
        status: "running",
        selectionSnapshot: {},
        generatorConfig: {},
        stats: {},
        startedAt: null,
        finishedAt: null,
        metadata: {},
        createdAt: now,
        updatedAt: now,
    });
    assert.equal(round.status, "running");
    const candidate = EvolutionCandidateSchema.parse({
        id: uuid,
        programId: uuid,
        roundId: uuid,
        candidateKind: "proposal",
        name: "Candidate A",
        description: null,
        genome: {},
        bodySpec: {},
        materializationArtifactId: null,
        sourceHypothesisId: null,
        sourceSignalId: null,
        status: "proposed",
        noveltyScore: 0.4,
        fitnessScore: null,
        diversityCoordinates: null,
        constraintViolations: null,
        createdByRunStepId: null,
        modelCallId: null,
        metadata: {},
        createdAt: now,
        updatedAt: now,
    });
    assert.equal(candidate.candidateKind, "proposal");
    const roundOutput = EvolutionRoundFinalOutputSchema.parse({
        summary: "Completed one round",
        programId: uuid,
        roundId: uuid,
        roundNo: 1,
        candidateIds: [uuid],
        selectedCandidateIds: [uuid],
        rejectedCandidateIds: [],
        archiveCellIds: [uuid],
        stats: { comparisonCount: 1 },
    });
    assert.equal(roundOutput.roundNo, 1);
    const createProgramInput = CreateEvolutionProgramInputSchema.parse({
        name: "Generic proposals",
        targetObjectType: "proposal",
        budgetPolicy: { populationSize: 4 },
    });
    assert.equal(createProgramInput.targetObjectType, "proposal");
    const startRoundInput = StartEvolutionRoundInputSchema.parse({
        candidateKind: "proposal",
        seedCandidates: [{ name: "Seed A", description: "Use this seed" }],
    });
    assert.equal(startRoundInput.candidateKind, "proposal");
    const candidateFilters = EvolutionCandidateListFiltersSchema.parse({
        candidateKind: "proposal",
        status: "evaluated",
        limit: 25,
    });
    assert.equal(candidateFilters.limit, 25);
    const embedding = ResearchEmbeddingSchema.parse({
        id: uuid,
        scope: { type: "knowledge_document_chunk", id: uuid },
        chunkKind: "document_chunk",
        chunkRef: { documentId: uuid },
        contentHash: "hash",
        embeddingModel: "text-embedding",
        embeddingDimension: 1536,
        metadata: {},
        createdAt: now,
        updatedAt: now,
    });
    assert.equal(embedding.chunkKind, "document_chunk");
    const job = EmbeddingJobSchema.parse({
        id: uuid,
        targetScope: { type: "knowledge_signal", id: uuid },
        embeddingModel: "text-embedding",
        status: "queued",
        priority: 0,
        inputHash: "hash",
        errorPayload: null,
        startedAt: null,
        finishedAt: null,
        createdAt: now,
        updatedAt: now,
    });
    assert.equal(job.status, "queued");
    const brief = MorningBriefSchema.parse({
        id: uuid,
        scope: { type: "group", id: uuid },
        generatedAt: now,
        headline: "Signals changed",
        summary: null,
        status: "generated",
        findingRefs: [],
        openQuestionRefs: [],
        suspiciousItemRefs: [],
        wetLabRequestRefs: [],
        artifactId: null,
        modelCallId: null,
        metadata: {},
        createdAt: now,
        updatedAt: now,
    });
    assert.equal(brief.headline, "Signals changed");
});
