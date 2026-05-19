import { PolicySynthSimpleAgentBase } from "@policysynth/agents/base/simpleAgent.js";

import models from "../../models/index.cjs";
import log from "../../utils/loggerTs.js";

const dbModels: Models = models;

type SynthesisResult = {
  short_analysis?: string;
  key_findings?: string[];
  uncertainties?: string[];
  missing_data?: string[];
  source_highlights?: YpEvidenceSourceHighlightData[];
  claims?: Array<{
    claim_text: string;
    stance?: string;
    confidence?: number;
    source_refs?: Array<{
      citation_label?: string;
      source_id?: number;
      snapshot_id?: number;
    }>;
  }>;
};

class EvidenceSynthesisAgent extends PolicySynthSimpleAgentBase {
  constructor(groupId?: number) {
    super({
      groupId,
      stages: {},
      totalCost: 0,
    } as PsSimpleAgentMemoryData);
    this.maxModelTokensOut = 1400;
    this.modelTemperature = 0.2;
  }

  async synthesize(packet: Record<string, unknown>): Promise<SynthesisResult> {
    const messages = [
      {
        role: "system",
        message: [
          "You write short civic evidence cards for public consultation.",
          "Use only the provided source packet.",
          "Be careful, neutral, and cite source labels in every finding.",
          "Return JSON only with keys: short_analysis, key_findings, uncertainties, missing_data, source_highlights, claims.",
        ].join(" "),
      },
      {
        role: "user",
        message: JSON.stringify(packet),
      },
    ];

    return (await this.callLLM(
      "betterIcelandEvidenceSynthesis",
      messages,
      true,
      1400
    )) as SynthesisResult;
  }
}

export class EvidenceSynthesisService {
  private EvidenceBundle = dbModels.EvidenceBundle as any;
  private EvidenceBundleSource = dbModels.EvidenceBundleSource as any;
  private EvidenceSource = dbModels.EvidenceSource as any;
  private EvidenceSnapshot = dbModels.EvidenceSnapshot as any;
  private EvidenceClaim = dbModels.EvidenceClaim as any;

  async synthesizeBundle(bundleId: number) {
    const bundle = await this.loadBundle(bundleId);
    if (!bundle) {
      throw new Error(`Evidence bundle ${bundleId} not found`);
    }

    const packet = this.buildSynthesisPacket(bundle);
    let result: SynthesisResult | undefined;
    let synthesisMode = "fallback";

    if (this.hasAiModelConfig()) {
      try {
        const agent = new EvidenceSynthesisAgent(bundle.group_id);
        result = await agent.synthesize(packet);
        synthesisMode = "policysynth_simple_agent";
      } catch (error) {
        log.error("Evidence synthesis agent failed", { bundleId, error });
      }
    }

    if (!result) {
      result = this.fallbackSynthesis(bundle);
    }

    const normalizedResult = this.normalizeSynthesisResult(result, bundle);
    await this.EvidenceClaim.destroy({ where: { bundle_id: bundle.id } });
    for (const claim of normalizedResult.claims || []) {
      if (claim.claim_text) {
        await this.EvidenceClaim.create({
          bundle_id: bundle.id,
          claim_text: claim.claim_text,
          stance: claim.stance || "contextualizes",
          confidence: claim.confidence ?? 0.5,
          source_refs: claim.source_refs || [],
        });
      }
    }

    const nextStatus =
      bundle.status === "published" || bundle.status === "archived"
        ? bundle.status
        : "needs_review";

    await bundle.update({
      short_analysis: normalizedResult.short_analysis,
      key_findings: normalizedResult.key_findings,
      uncertainties: normalizedResult.uncertainties,
      missing_data: normalizedResult.missing_data,
      source_highlights: normalizedResult.source_highlights,
      status: nextStatus,
      metadata: {
        ...(bundle.metadata || {}),
        synthesis: {
          mode: synthesisMode,
          promptVersion: "evidence-card-v1",
          generatedAt: new Date().toISOString(),
          sourceSnapshotHashes: this.sourceSnapshotHashes(bundle),
        },
      },
    });

    return this.loadBundle(bundleId);
  }

  private loadBundle(bundleId: number) {
    return this.EvidenceBundle.findOne({
      where: { id: bundleId },
      include: this.bundleIncludes(),
    });
  }

  bundleIncludes() {
    return [
      {
        model: this.EvidenceBundleSource,
        as: "BundleSources",
        required: false,
        include: [
          { model: this.EvidenceSource, as: "Source", required: false },
          { model: this.EvidenceSnapshot, as: "Snapshot", required: false },
        ],
      },
      { model: this.EvidenceClaim, as: "Claims", required: false },
    ];
  }

  private buildSynthesisPacket(bundle: any): Record<string, unknown> {
    const sources = (bundle.BundleSources || []).map((bundleSource: any) => {
      const source = bundleSource.Source;
      const snapshot = bundleSource.Snapshot;
      const text =
        snapshot?.markdown || snapshot?.extracted_text || snapshot?.raw_html || "";
      return {
        citation_label: bundleSource.citation_label,
        source_id: source?.id,
        snapshot_id: snapshot?.id,
        title: source?.title,
        publisher: source?.publisher,
        url: source?.canonical_url,
        trust_tier: source?.trust_tier,
        source_role: bundleSource.source_role,
        fetched_at: snapshot?.fetched_at,
        status: snapshot?.status,
        excerpt: String(text).slice(0, 2500),
      };
    });

    return {
      subject: {
        type: bundle.subject_type,
        id: bundle.subject_id,
        group_id: bundle.group_id,
        post_id: bundle.post_id,
        point_id: bundle.point_id,
      },
      question_or_claim: bundle.question_or_claim,
      connected_debate: bundle.connected_debate || [],
      sources,
    };
  }

  private fallbackSynthesis(bundle: any): SynthesisResult {
    const bundleSources = bundle.BundleSources || [];
    const sourceHighlights = bundleSources.map((bundleSource: any) =>
      this.sourceHighlightFromBundleSource(bundleSource)
    );

    return {
      short_analysis:
        `This evidence card gathers source material related to "${bundle.question_or_claim}". ` +
        "The sources below should be reviewed by moderators before publication.",
      key_findings: sourceHighlights.slice(0, 4).map((source: YpEvidenceSourceHighlightData) => {
        const label = source.citation_label;
        const title = source.title || source.url || "source material";
        const publisher = source.publisher ? ` from ${source.publisher}` : "";
        return `${label} ${title}${publisher} provides context for the debate.`;
      }),
      uncertainties: [
        "The evidence has not yet been reviewed by a moderator.",
        "Some source pages may need structured data extraction before final publication.",
      ],
      missing_data:
        bundleSources.length > 0
          ? []
          : ["No reusable source snapshots were available for this card."],
      source_highlights: sourceHighlights,
      claims: [],
    };
  }

  private normalizeSynthesisResult(
    result: SynthesisResult,
    bundle: any
  ): Required<SynthesisResult> {
    const fallback = this.fallbackSynthesis(bundle);
    return {
      short_analysis:
        this.cleanString(result.short_analysis) ||
        fallback.short_analysis ||
        "",
      key_findings: this.cleanStringArray(
        result.key_findings,
        fallback.key_findings
      ),
      uncertainties: this.cleanStringArray(
        result.uncertainties,
        fallback.uncertainties
      ),
      missing_data: this.cleanStringArray(
        result.missing_data,
        fallback.missing_data
      ),
      source_highlights:
        Array.isArray(result.source_highlights) &&
        result.source_highlights.length > 0
          ? result.source_highlights
          : fallback.source_highlights || [],
      claims: Array.isArray(result.claims) ? result.claims : [],
    };
  }

  private sourceHighlightFromBundleSource(
    bundleSource: any
  ): YpEvidenceSourceHighlightData {
    const source = bundleSource.Source;
    const snapshot = bundleSource.Snapshot;
    return {
      citation_label: bundleSource.citation_label,
      title: source?.title,
      publisher: source?.publisher,
      url: source?.canonical_url,
      fetched_at: snapshot?.fetched_at
        ? new Date(snapshot.fetched_at).toISOString()
        : undefined,
      why_it_matters:
        source?.trust_tier === "official"
          ? "Official source material for this topic."
          : "Background source material connected to this topic.",
    };
  }

  private sourceSnapshotHashes(bundle: any): string[] {
    return (bundle.BundleSources || [])
      .map((bundleSource: any) => bundleSource.Snapshot?.snapshot_hash)
      .filter(Boolean);
  }

  private hasAiModelConfig(): boolean {
    return !!(
      process.env.AI_MODEL_API_KEY &&
      process.env.AI_MODEL_NAME &&
      process.env.AI_MODEL_PROVIDER
    );
  }

  private cleanString(value: unknown): string | undefined {
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  private cleanStringArray(value: unknown, fallback: unknown): string[] {
    const source = Array.isArray(value) && value.length > 0 ? value : fallback;
    return Array.isArray(source)
      ? source
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter((item) => item.length > 0)
          .slice(0, 6)
      : [];
  }
}
