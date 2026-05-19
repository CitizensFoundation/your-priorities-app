import crypto from "crypto";

import { PolicySynthSimpleAgentBase } from "@policysynth/agents/base/simpleAgent.js";
import { SimplePairwiseRankingsAgent } from "@policysynth/agents/base/simplePairwiseRanking.js";

import models from "../../models/index.cjs";
import log from "../../utils/loggerTs.js";
import queue from "../workers/queue.cjs";
import { EvidenceResearchService } from "./evidenceResearchService.js";
import { EvidenceSourceService } from "./evidenceSourceService.js";
import { EvidenceSynthesisService } from "./evidenceSynthesisService.js";

const dbModels: Models = models;

type DeepResearchConfig = {
  generations: number;
  maxQueriesPerGeneration: number;
  maxSearchResultsPerQuery: number;
  maxCandidatesToAnalyze: number;
  maxPairwisePrompts: number;
  maxSelectedSources: number;
};

type PlannedQuery = {
  query: string;
  evidence_type: string;
  priority?: number;
  reasoning?: string;
};

type DeepResearchPlan = {
  queries?: PlannedQuery[];
  seedUrls?: Array<{
    url: string;
    title?: string;
    evidence_type?: string;
    reasoning?: string;
  }>;
};

type CandidateAnalysis = {
  summary?: string;
  extracted_claims?: string[];
  score_relevance?: number;
  score_quality?: number;
  score_confidence?: number;
  score_freshness?: number;
  score_diversity?: number;
};

const evidenceTypes = [
  "officialData",
  "positiveEvidence",
  "negativeEvidence",
  "neutralEvidence",
  "economicEvidence",
  "scientificEvidence",
  "legalEvidence",
  "technologicalEvidence",
  "ethicalConsiderations",
  "implementationFeasibility",
  "caseStudies",
  "expertOpinions",
  "publicOpinions",
  "localPerspective",
  "globalPerspective",
];

class EvidenceDeepResearchPlanningAgent extends PolicySynthSimpleAgentBase {
  constructor(groupId?: number) {
    super({
      groupId,
      stages: {},
      totalCost: 0,
    } as PsSimpleAgentMemoryData);
    this.maxModelTokensOut = 1400;
    this.modelTemperature = 0.2;
  }

  async plan(question: string): Promise<DeepResearchPlan> {
    const messages = [
      {
        role: "system",
        message: [
          "You design large-scale evidence research for a civic consultation.",
          "Create varied evidence-search queries across official data, legal, economic, ethical, public opinion, expert opinion, implementation, and case-study angles.",
          "Prefer Icelandic, Nordic, EU, OECD, and official open data sources when relevant.",
          "Return JSON only: { queries: [{query,evidence_type,priority,reasoning}], seedUrls: [{url,title,evidence_type,reasoning}] }.",
        ].join(" "),
      },
      {
        role: "user",
        message: JSON.stringify({
          question,
          evidenceTypes,
        }),
      },
    ];

    return (await this.callLLM(
      "betterIcelandDeepEvidencePlanning",
      messages,
      true,
      1400
    )) as DeepResearchPlan;
  }
}

class EvidenceCandidateAnalysisAgent extends PolicySynthSimpleAgentBase {
  constructor(groupId?: number) {
    super({
      groupId,
      stages: {},
      totalCost: 0,
    } as PsSimpleAgentMemoryData);
    this.maxModelTokensOut = 1200;
    this.modelTemperature = 0.1;
  }

  async analyze(packet: Record<string, unknown>): Promise<CandidateAnalysis> {
    const messages = [
      {
        role: "system",
        message: [
          "You evaluate a web source as evidence for a public consultation debate.",
          "Use only the supplied source text. Rate each score from 0 to 100.",
          "Return JSON only with summary, extracted_claims, score_relevance, score_quality, score_confidence, score_freshness, score_diversity.",
          "Keep extracted claims short and cite-worthy.",
        ].join(" "),
      },
      {
        role: "user",
        message: JSON.stringify(packet),
      },
    ];

    return (await this.callLLM(
      "betterIcelandEvidenceCandidateAnalysis",
      messages,
      true,
      1200
    )) as CandidateAnalysis;
  }
}

class EvidenceQueryEvolutionAgent extends PolicySynthSimpleAgentBase {
  constructor(groupId?: number) {
    super({
      groupId,
      stages: {},
      totalCost: 0,
    } as PsSimpleAgentMemoryData);
    this.maxModelTokensOut = 900;
    this.modelTemperature = 0.45;
  }

  async evolve(packet: Record<string, unknown>): Promise<DeepResearchPlan> {
    const messages = [
      {
        role: "system",
        message: [
          "You are improving evidence search queries using a genetic algorithm pattern.",
          "Mutate weak queries, recombine strong query/source patterns, and add a few immigrant queries from unexplored angles.",
          "Return JSON only: { queries: [{query,evidence_type,priority,reasoning}] }.",
        ].join(" "),
      },
      {
        role: "user",
        message: JSON.stringify(packet),
      },
    ];

    return (await this.callLLM(
      "betterIcelandEvidenceQueryEvolution",
      messages,
      true,
      900
    )) as DeepResearchPlan;
  }
}

class EvidenceCandidatePairwiseRanker extends SimplePairwiseRankingsAgent {
  constructor(
    private readonly question: string,
    private readonly recordComparison: (
      a: any,
      b: any,
      result: any,
      rationale: string
    ) => Promise<void>,
    private readonly useModel: boolean
  ) {
    super({
      groupId: 0,
      stages: {},
      totalCost: 0,
    } as PsSimpleAgentMemoryData);
    this.maxModelTokensOut = 3;
    this.modelTemperature = 0;
  }

  async voteOnPromptPair(
    subProblemIndex: number,
    promptPair: number[]
  ): Promise<any> {
    const itemOneIndex = promptPair[0];
    const itemTwoIndex = promptPair[1];
    const candidateOne = this.allItems[subProblemIndex]![itemOneIndex] as any;
    const candidateTwo = this.allItems[subProblemIndex]![itemTwoIndex] as any;

    if (!this.useModel) {
      const result = this.deterministicVote(
        subProblemIndex,
        itemOneIndex,
        itemTwoIndex,
        candidateOne,
        candidateTwo
      );
      await this.recordComparison(
        candidateOne,
        candidateTwo,
        result,
        "Deterministic composite-score fallback"
      );
      return result;
    }

    const messages = [
      {
        role: "system",
        message: [
          "You compare two evidence candidates for a public consultation.",
          "Choose the candidate that is more useful for fact-based debate.",
          "Prioritize relevance, source quality, confidence, directness, and usefulness to moderators.",
          'Always output exactly "One", "Two", or "Neither". No explanation.',
        ].join(" "),
      },
      {
        role: "user",
        message: `
Debate question:
${this.question}

Evidence Candidate One:
${this.renderCandidate(candidateOne)}

Evidence Candidate Two:
${this.renderCandidate(candidateTwo)}

The stronger evidence candidate is:
`,
      },
    ];

    const result = await this.getResultsFromLLM(
      subProblemIndex,
      "betterIcelandEvidencePairwiseRanking",
      messages as any,
      itemOneIndex,
      itemTwoIndex
    );
    await this.recordComparison(
      candidateOne,
      candidateTwo,
      result,
      "Policy Synth pairwise evidence vote"
    );
    return result;
  }

  private deterministicVote(
    subProblemIndex: number,
    itemOneIndex: number,
    itemTwoIndex: number,
    candidateOne: any,
    candidateTwo: any
  ) {
    const scoreOne = Number(candidateOne.composite_score || 0);
    const scoreTwo = Number(candidateTwo.composite_score || 0);
    if (Math.abs(scoreOne - scoreTwo) < 3) {
      return { subProblemIndex, wonItemIndex: -1, lostItemIndex: -1 };
    }
    return scoreOne > scoreTwo
      ? { subProblemIndex, wonItemIndex: itemOneIndex, lostItemIndex: itemTwoIndex }
      : { subProblemIndex, wonItemIndex: itemTwoIndex, lostItemIndex: itemOneIndex };
  }

  private renderCandidate(candidate: any) {
    return JSON.stringify(
      {
        title: candidate.title,
        url: candidate.url,
        evidence_type: candidate.evidence_type,
        summary: candidate.summary,
        extracted_claims: candidate.extracted_claims,
        scores: {
          relevance: candidate.score_relevance,
          quality: candidate.score_quality,
          confidence: candidate.score_confidence,
          freshness: candidate.score_freshness,
          composite: candidate.composite_score,
        },
      },
      null,
      2
    );
  }
}

export class EvidenceDeepResearchService {
  private EvidenceBundle = dbModels.EvidenceBundle as any;
  private EvidenceBundleSource = dbModels.EvidenceBundleSource as any;
  private EvidenceResearchRun = dbModels.EvidenceResearchRun as any;
  private EvidenceResearchQuery = dbModels.EvidenceResearchQuery as any;
  private EvidenceResearchCandidate = dbModels.EvidenceResearchCandidate as any;
  private EvidenceResearchComparison = dbModels.EvidenceResearchComparison as any;
  private researchService = new EvidenceResearchService();
  private sourceService = new EvidenceSourceService();
  private synthesisService = new EvidenceSynthesisService();

  async createDeepResearchBundle(
    subjectType: YpEvidenceSubjectType,
    subjectId: number,
    userId: number | undefined,
    options: { question?: string; sourceUrls?: string[]; config?: Partial<DeepResearchConfig> } = {}
  ) {
    const bundle = await this.researchService.createResearchBundle(
      subjectType,
      subjectId,
      userId,
      {
        question: options.question,
        sourceUrls: options.sourceUrls,
        queue: false,
        researchMode: "deep",
      }
    );
    const config = { ...this.defaultConfig(), ...(options.config || {}) };
    const run = await this.EvidenceResearchRun.create({
      bundle_id: bundle.id,
      group_id: bundle.group_id,
      status: "queued",
      phase: "queued",
      config,
      requested_by_user_id: userId,
      metadata: {
        subjectType,
        subjectId,
      },
    });

    queue.add(
      "process-evidence",
      { type: "deepResearch", runId: run.id },
      "medium"
    );

    return { bundle, run };
  }

  async processDeepResearch(runId: number) {
    const run = await this.EvidenceResearchRun.findOne({
      where: { id: runId },
      include: [{ model: this.EvidenceBundle, as: "Bundle" }],
    });
    if (!run) throw new Error(`Evidence deep research run ${runId} not found`);

    const bundle = run.Bundle;
    if (!bundle) throw new Error(`Evidence bundle for run ${runId} not found`);

    try {
      await run.update({
        status: "running",
        phase: "planning",
        started_at: new Date(),
      });
      await bundle.update({ status: "researching" });

      const config = { ...this.defaultConfig(), ...(run.config || {}) };
      let queries = await this.planQueries(bundle, run);
      let generation = 0;

      while (generation < config.generations) {
        await run.update({ phase: `generation_${generation}_search` });
        const generationQueries = queries.slice(0, config.maxQueriesPerGeneration);
        await this.persistQueries(run, generationQueries, generation);
        await this.collectCandidates(run, bundle, generationQueries, generation, config);

        await run.update({ phase: `generation_${generation}_analyze` });
        await this.analyzePendingCandidates(run, bundle, config);

        if (generation + 1 < config.generations) {
          await run.update({ phase: `generation_${generation}_evolve_queries` });
          queries = await this.evolveQueries(bundle, run, generationQueries, generation);
        }

        generation += 1;
      }

      await run.update({ phase: "pairwise_ranking" });
      await this.rankCandidates(run, bundle, config);

      await run.update({ phase: "selecting_sources" });
      const selected = await this.selectAndAttachSources(run, bundle, config);
      const metrics = await this.buildRunMetrics(run, config, selected.length);

      await bundle.update({
        metadata: {
          ...(bundle.metadata || {}),
          deepResearch: {
            runId: run.id,
            status: "completed",
            completedAt: new Date().toISOString(),
            ...metrics,
          },
        },
      });

      await run.update({
        status: "completed",
        phase: "completed",
        metrics,
        finished_at: new Date(),
      });

      return this.synthesisService.synthesizeBundle(bundle.id);
    } catch (error: any) {
      log.error("Deep evidence research failed", { runId, error });
      await run.update({
        status: "failed",
        phase: "failed",
        finished_at: new Date(),
        metadata: {
          ...(run.metadata || {}),
          error: error?.message || String(error),
        },
      });
      await bundle.update({
        status: "failed",
        metadata: {
          ...(bundle.metadata || {}),
          deepResearch: {
            runId: run.id,
            status: "failed",
            error: error?.message || String(error),
          },
        },
      });
      throw error;
    }
  }

  private async planQueries(bundle: any, run: any): Promise<PlannedQuery[]> {
    let plan: DeepResearchPlan | undefined;
    if (this.hasAiModelConfig()) {
      try {
        plan = await new EvidenceDeepResearchPlanningAgent(bundle.group_id).plan(
          bundle.question_or_claim
        );
      } catch (error) {
        log.warn("Deep evidence planning agent failed", { runId: run.id, error });
      }
    }

    const plannedQueries = this.normalizeQueries(plan?.queries || []);
    const seedUrlQueries = (plan?.seedUrls || []).map((seed, index) => ({
      query: seed.url,
      evidence_type: seed.evidence_type || "agentSeedUrl",
      priority: 0.9 - index * 0.01,
      reasoning: seed.reasoning || seed.title,
    }));

    return this.normalizeQueries([
      ...plannedQueries,
      ...seedUrlQueries,
      ...this.fallbackQueries(bundle.question_or_claim),
    ]);
  }

  private async persistQueries(
    run: any,
    queries: PlannedQuery[],
    generation: number
  ) {
    for (const plannedQuery of queries) {
      await this.EvidenceResearchQuery.findOrCreate({
        where: {
          run_id: run.id,
          query: plannedQuery.query,
          evidence_type: plannedQuery.evidence_type,
          generation,
        },
        defaults: {
          run_id: run.id,
          query: plannedQuery.query,
          evidence_type: plannedQuery.evidence_type,
          generation,
          priority: plannedQuery.priority ?? 0.5,
          metadata: { reasoning: plannedQuery.reasoning },
        },
      });
    }
  }

  private async collectCandidates(
    run: any,
    bundle: any,
    queries: PlannedQuery[],
    generation: number,
    config: DeepResearchConfig
  ) {
    for (const plannedQuery of queries) {
      const candidates = plannedQuery.query.startsWith("http")
        ? [{ url: plannedQuery.query, sourceRole: plannedQuery.evidence_type }]
        : await this.sourceService.searchWebCandidates(
            plannedQuery.query,
            config.maxSearchResultsPerQuery
          );
      const fallbackCandidates =
        candidates.length > 0
          ? candidates
          : this.sourceService.seedSourcesForResearch(bundle.question_or_claim);

      let resultCount = 0;
      for (const candidate of fallbackCandidates) {
        if (
          (await this.EvidenceResearchCandidate.count({
            where: { run_id: run.id },
          })) >= config.maxCandidatesToAnalyze
        ) {
          break;
        }

        const { source, snapshot } = await this.sourceService.upsertSourceSnapshot(
          candidate.url,
          {
            title: candidate.title,
            sourceRole: candidate.sourceRole || plannedQuery.evidence_type,
            deepResearchRunId: run.id,
          }
        );

        await this.EvidenceResearchCandidate.findOrCreate({
          where: {
            run_id: run.id,
            url_hash: this.hashText(source.canonical_url),
            evidence_type: plannedQuery.evidence_type,
          },
          defaults: {
            run_id: run.id,
            source_id: source.id,
            snapshot_id: snapshot.id,
            url: source.canonical_url,
            url_hash: this.hashText(source.canonical_url),
            title: source.title,
            query: plannedQuery.query,
            evidence_type: plannedQuery.evidence_type,
            stage: "fetched",
            generation,
            metadata: {
              fetchStatus: snapshot.status,
              publisher: source.publisher,
              trustTier: source.trust_tier,
            },
          },
        });
        resultCount += 1;
      }

      await this.EvidenceResearchQuery.update(
        { result_count: resultCount, status: "completed" },
        {
          where: {
            run_id: run.id,
            query: plannedQuery.query,
            evidence_type: plannedQuery.evidence_type,
            generation,
          },
        }
      );
    }
  }

  private async analyzePendingCandidates(
    run: any,
    bundle: any,
    _config: DeepResearchConfig
  ) {
    const candidates = await this.EvidenceResearchCandidate.findAll({
      where: { run_id: run.id },
      include: [
        { model: dbModels.EvidenceSource, as: "Source", required: false },
        { model: dbModels.EvidenceSnapshot, as: "Snapshot", required: false },
      ],
      order: [["generation", "ASC"], ["id", "ASC"]],
    });

    const analyzedUrls = new Set<string>();
    for (const candidate of candidates) {
      if (candidate.stage === "analyzed" || analyzedUrls.has(candidate.url)) {
        continue;
      }
      analyzedUrls.add(candidate.url);
      const analysis = await this.analyzeCandidate(bundle, candidate);
      await candidate.update({
        stage: "analyzed",
        summary: analysis.summary,
        extracted_claims: analysis.extracted_claims || [],
        score_relevance: analysis.score_relevance || 0,
        score_quality: analysis.score_quality || 0,
        score_confidence: analysis.score_confidence || 0,
        score_freshness: analysis.score_freshness || 0,
        score_diversity: analysis.score_diversity || 0,
        composite_score: this.compositeScore(analysis),
      });
    }
  }

  private async analyzeCandidate(bundle: any, candidate: any): Promise<CandidateAnalysis> {
    const source = candidate.Source;
    const snapshot = candidate.Snapshot;
    const text = String(
      snapshot?.markdown || snapshot?.extracted_text || snapshot?.raw_html || ""
    ).slice(0, 9000);

    if (this.hasAiModelConfig() && text.length > 0) {
      try {
        return this.normalizeAnalysis(
          await new EvidenceCandidateAnalysisAgent(bundle.group_id).analyze({
            question: bundle.question_or_claim,
            source: {
              title: source?.title,
              publisher: source?.publisher,
              url: source?.canonical_url,
              trustTier: source?.trust_tier,
              evidenceType: candidate.evidence_type,
            },
            text,
          })
        );
      } catch (error) {
        log.warn("Evidence candidate analysis agent failed", {
          candidateId: candidate.id,
          error,
        });
      }
    }

    return this.fallbackCandidateAnalysis(bundle, candidate, text);
  }

  private async evolveQueries(
    bundle: any,
    run: any,
    previousQueries: PlannedQuery[],
    generation: number
  ): Promise<PlannedQuery[]> {
    const topCandidates = await this.EvidenceResearchCandidate.findAll({
      where: { run_id: run.id },
      order: [
        ["composite_score", "DESC"],
        ["score_quality", "DESC"],
      ],
      limit: 12,
    });

    if (this.hasAiModelConfig()) {
      try {
        const result = await new EvidenceQueryEvolutionAgent(bundle.group_id).evolve({
          question: bundle.question_or_claim,
          generation,
          previousQueries,
          topCandidates: topCandidates.map((candidate: any) => ({
            title: candidate.title,
            url: candidate.url,
            evidenceType: candidate.evidence_type,
            summary: candidate.summary,
            score: candidate.composite_score,
          })),
        });
        return this.normalizeQueries([
          ...(result.queries || []),
          ...this.fallbackEvolvedQueries(bundle.question_or_claim, topCandidates),
        ]);
      } catch (error) {
        log.warn("Evidence query evolution agent failed", { runId: run.id, error });
      }
    }

    return this.fallbackEvolvedQueries(bundle.question_or_claim, topCandidates);
  }

  private async rankCandidates(
    run: any,
    bundle: any,
    config: DeepResearchConfig
  ) {
    const candidates = await this.EvidenceResearchCandidate.findAll({
      where: { run_id: run.id },
      order: [
        ["composite_score", "DESC"],
        ["score_quality", "DESC"],
      ],
      limit: Math.max(config.maxSelectedSources * 4, 12),
    });

    if (candidates.length === 0) return;

    const rankableCandidates = candidates.map((candidate: any) =>
      candidate.toJSON ? candidate.toJSON() : candidate
    );
    const ranker = new EvidenceCandidatePairwiseRanker(
      bundle.question_or_claim,
      async (a, b, result, rationale) => {
        const winnerIndex = result.wonItemIndex;
        const winner =
          winnerIndex === -1 || winnerIndex === undefined
            ? undefined
            : rankableCandidates[winnerIndex];
        await this.EvidenceResearchComparison.create({
          run_id: run.id,
          candidate_a_id: a.id,
          candidate_b_id: b.id,
          winner_candidate_id: winner?.id,
          rationale,
          metadata: {
            candidateAComposite: a.composite_score,
            candidateBComposite: b.composite_score,
          },
        });
      },
      this.hasAiModelConfig()
    );
    ranker.setupRankingPrompts(
      0,
      rankableCandidates as any,
      Math.min(config.maxPairwisePrompts, Math.max(6, rankableCandidates.length * 4))
    );
    await ranker.performPairwiseRanking(0);

    for (let i = 0; i < rankableCandidates.length; i++) {
      await this.EvidenceResearchCandidate.update(
        {
          elo_rating: ranker.eloRatings[0][i],
          stage: "ranked",
        },
        { where: { id: rankableCandidates[i].id } }
      );
    }

    await this.updateWinLossCounts(run.id);
  }

  private async selectAndAttachSources(
    run: any,
    bundle: any,
    config: DeepResearchConfig
  ) {
    await this.EvidenceResearchCandidate.update(
      { selected: false },
      { where: { run_id: run.id } }
    );

    const candidates = await this.EvidenceResearchCandidate.findAll({
      where: { run_id: run.id },
      include: [{ model: dbModels.EvidenceSource, as: "Source", required: false }],
      order: [
        ["elo_rating", "DESC"],
        ["composite_score", "DESC"],
      ],
      limit: Math.max(config.maxSelectedSources * 4, 16),
    });
    const selected = this.selectDiverseCandidates(
      candidates,
      config.maxSelectedSources
    );
    const existingCount = await this.EvidenceBundleSource.count({
      where: { bundle_id: bundle.id },
    });

    for (let index = 0; index < selected.length; index++) {
      const candidate = selected[index];
      await candidate.update({ selected: true, stage: "selected" });
      if (candidate.source_id && candidate.snapshot_id) {
        await this.EvidenceBundleSource.findOrCreate({
          where: {
            bundle_id: bundle.id,
            snapshot_id: candidate.snapshot_id,
          },
          defaults: {
            bundle_id: bundle.id,
            source_id: candidate.source_id,
            snapshot_id: candidate.snapshot_id,
            relevance_score: Math.min(1, candidate.composite_score / 100),
            citation_label: `[${existingCount + index + 1}]`,
            quoted_ranges: this.quoteRangesFromCandidate(candidate),
            source_role: candidate.evidence_type,
          },
        });
      }
    }

    return selected;
  }

  private selectDiverseCandidates(candidates: any[], limit: number) {
    const selected: any[] = [];
    const publisherCounts = new Map<string, number>();
    const evidenceTypeCounts = new Map<string, number>();

    for (const candidate of candidates) {
      const publisher =
        candidate.Source?.publisher || this.hostname(candidate.url) || "unknown";
      const type = candidate.evidence_type || "general";
      if (
        (publisherCounts.get(publisher) || 0) >= 2 &&
        selected.length < limit - 2
      ) {
        continue;
      }
      if ((evidenceTypeCounts.get(type) || 0) >= 2 && selected.length < limit - 2) {
        continue;
      }

      selected.push(candidate);
      publisherCounts.set(publisher, (publisherCounts.get(publisher) || 0) + 1);
      evidenceTypeCounts.set(type, (evidenceTypeCounts.get(type) || 0) + 1);
      if (selected.length >= limit) break;
    }

    return selected;
  }

  private async updateWinLossCounts(runId: number) {
    const comparisons = await this.EvidenceResearchComparison.findAll({
      where: { run_id: runId },
    });
    const counts = new Map<number, { wins: number; losses: number }>();
    for (const comparison of comparisons) {
      const aId = comparison.candidate_a_id;
      const bId = comparison.candidate_b_id;
      const winnerId = comparison.winner_candidate_id;
      for (const id of [aId, bId]) {
        if (!counts.has(id)) counts.set(id, { wins: 0, losses: 0 });
      }
      if (winnerId) {
        counts.get(winnerId)!.wins += 1;
        const loserId = winnerId === aId ? bId : aId;
        counts.get(loserId)!.losses += 1;
      }
    }

    for (const [candidateId, count] of counts.entries()) {
      await this.EvidenceResearchCandidate.update(
        {
          pairwise_wins: count.wins,
          pairwise_losses: count.losses,
        },
        { where: { id: candidateId } }
      );
    }
  }

  private async buildRunMetrics(
    run: any,
    config: DeepResearchConfig,
    selectedCount: number
  ) {
    const [queryCount, candidateCount, comparisonCount] = await Promise.all([
      this.EvidenceResearchQuery.count({ where: { run_id: run.id } }),
      this.EvidenceResearchCandidate.count({ where: { run_id: run.id } }),
      this.EvidenceResearchComparison.count({ where: { run_id: run.id } }),
    ]);

    return {
      queryCount,
      candidateCount,
      comparisonCount,
      selectedCount,
      generationCount: config.generations,
    };
  }

  private quoteRangesFromCandidate(candidate: any) {
    const claims = Array.isArray(candidate.extracted_claims)
      ? candidate.extracted_claims
      : [];
    return claims.slice(0, 2).map((text: string) => ({ text }));
  }

  private normalizeQueries(queries: PlannedQuery[]): PlannedQuery[] {
    const seen = new Set<string>();
    return queries
      .filter((query) => query && typeof query.query === "string")
      .map((query) => ({
        query: query.query.trim(),
        evidence_type: query.evidence_type || "general",
        priority: Number(query.priority ?? 0.5),
        reasoning: query.reasoning,
      }))
      .filter((query) => {
        const key = `${query.evidence_type}:${query.query.toLowerCase()}`;
        if (!query.query || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }

  private normalizeAnalysis(analysis: CandidateAnalysis): CandidateAnalysis {
    return {
      summary: this.cleanString(analysis.summary),
      extracted_claims: Array.isArray(analysis.extracted_claims)
        ? analysis.extracted_claims.filter((claim) => typeof claim === "string")
        : [],
      score_relevance: this.score(analysis.score_relevance),
      score_quality: this.score(analysis.score_quality),
      score_confidence: this.score(analysis.score_confidence),
      score_freshness: this.score(analysis.score_freshness),
      score_diversity: this.score(analysis.score_diversity),
    };
  }

  private fallbackCandidateAnalysis(
    bundle: any,
    candidate: any,
    text: string
  ): CandidateAnalysis {
    const source = candidate.Source;
    const snapshot = candidate.Snapshot;
    const officialBoost =
      source?.trust_tier === "official" ||
      source?.trust_tier === "official_international"
        ? 18
        : 0;
    const queryTerms = String(bundle.question_or_claim)
      .toLowerCase()
      .split(/\W+/)
      .filter((term) => term.length > 4)
      .slice(0, 12);
    const loweredText = text.toLowerCase();
    const hits = queryTerms.filter((term) => loweredText.includes(term)).length;
    const relevance = Math.min(100, 45 + hits * 5 + officialBoost);
    const quality = Math.min(100, 55 + officialBoost + (text.length > 1200 ? 12 : 0));
    const confidence = snapshot?.status === "ok" ? Math.min(100, 55 + officialBoost) : 20;

    return {
      summary: text
        ? text.slice(0, 450)
        : `${source?.title || candidate.url} was collected for review.`,
      extracted_claims: this.extractFallbackClaims(text),
      score_relevance: relevance,
      score_quality: quality,
      score_confidence: confidence,
      score_freshness: 70,
      score_diversity: 55,
    };
  }

  private fallbackQueries(question: string): PlannedQuery[] {
    return evidenceTypes.map((type, index) => ({
      query: `${question} ${this.queryKeywordsForType(type)}`,
      evidence_type: type,
      priority: Math.max(0.3, 0.95 - index * 0.03),
    }));
  }

  private fallbackEvolvedQueries(question: string, candidates: any[]): PlannedQuery[] {
    const topCandidates = candidates.slice(0, 8);
    const fromCandidates = topCandidates.map((candidate: any, index: number) => ({
      query: `${question} ${candidate.evidence_type} ${this.hostname(candidate.url)} evidence`,
      evidence_type: candidate.evidence_type,
      priority: 0.8 - index * 0.03,
      reasoning: `Mutated from high-scoring candidate ${candidate.id}`,
    }));
    const immigrants = [
      "Iceland official statistics AI public services",
      "Iceland AI governance legal privacy evidence",
      "Nordic AI public sector case study evidence",
      "Icelandic language artificial intelligence policy evidence",
    ].map((query, index) => ({
      query,
      evidence_type: index === 1 ? "legalEvidence" : "caseStudies",
      priority: 0.55,
      reasoning: "Random immigration query",
    }));
    return this.normalizeQueries([...fromCandidates, ...immigrants]);
  }

  private queryKeywordsForType(type: string) {
    const keywords: Record<string, string> = {
      officialData: "official data statistics Iceland",
      positiveEvidence: "benefits evidence",
      negativeEvidence: "risks harms evidence",
      neutralEvidence: "overview evidence",
      economicEvidence: "economic impact labour productivity",
      scientificEvidence: "research study evidence",
      legalEvidence: "law regulation privacy rights",
      technologicalEvidence: "technology adoption infrastructure",
      ethicalConsiderations: "ethics fairness accountability",
      implementationFeasibility: "implementation cost feasibility",
      caseStudies: "case study government public sector",
      expertOpinions: "expert analysis",
      publicOpinions: "public opinion survey",
      localPerspective: "Iceland local perspective",
      globalPerspective: "OECD EU global evidence",
    };
    return keywords[type] || "evidence";
  }

  private extractFallbackClaims(text: string): string[] {
    if (!text) return [];
    return text
      .split(/[.!?]\s+/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 80)
      .slice(0, 4);
  }

  private compositeScore(analysis: CandidateAnalysis): number {
    return Math.round(
      (analysis.score_relevance || 0) * 0.35 +
        (analysis.score_quality || 0) * 0.25 +
        (analysis.score_confidence || 0) * 0.2 +
        (analysis.score_freshness || 0) * 0.1 +
        (analysis.score_diversity || 0) * 0.1
    );
  }

  private score(value: unknown): number {
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue)) return 0;
    return Math.max(0, Math.min(100, numberValue));
  }

  private cleanString(value: unknown): string | undefined {
    return typeof value === "string" && value.trim().length > 0
      ? value.trim()
      : undefined;
  }

  private hostname(url: string): string | undefined {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch (_error) {
      return undefined;
    }
  }

  private hashText(text: string): string {
    return crypto.createHash("sha256").update(text).digest("hex");
  }

  private hasAiModelConfig(): boolean {
    return !!(
      process.env.AI_MODEL_API_KEY &&
      process.env.AI_MODEL_NAME &&
      process.env.AI_MODEL_PROVIDER
    );
  }

  private defaultConfig(): DeepResearchConfig {
    return {
      generations: Number(process.env.YP_EVIDENCE_DEEP_GENERATIONS || 2),
      maxQueriesPerGeneration: Number(
        process.env.YP_EVIDENCE_DEEP_MAX_QUERIES || 10
      ),
      maxSearchResultsPerQuery: Number(
        process.env.YP_EVIDENCE_DEEP_RESULTS_PER_QUERY || 5
      ),
      maxCandidatesToAnalyze: Number(
        process.env.YP_EVIDENCE_DEEP_MAX_CANDIDATES || 36
      ),
      maxPairwisePrompts: Number(
        process.env.YP_EVIDENCE_DEEP_MAX_PAIRWISE || 72
      ),
      maxSelectedSources: Number(
        process.env.YP_EVIDENCE_DEEP_SELECTED_SOURCES || 10
      ),
    };
  }
}
