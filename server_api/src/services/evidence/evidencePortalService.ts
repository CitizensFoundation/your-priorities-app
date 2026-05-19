import { PolicySynthSimpleAgentBase } from "@policysynth/agents/base/simpleAgent.js";

import models from "../../models/index.cjs";
import log from "../../utils/loggerTs.js";
import { EvidenceSynthesisService } from "./evidenceSynthesisService.js";

const dbModels: Models = models;

type PortalAgentResult = {
  title?: string;
  short_analysis?: string;
  theme_summaries?: YpEvidencePortalThemeData[];
};

class EvidencePortalAgent extends PolicySynthSimpleAgentBase {
  constructor(groupId?: number) {
    super({
      groupId,
      stages: {},
      totalCost: 0,
    } as PsSimpleAgentMemoryData);
    this.maxModelTokensOut = 1600;
    this.modelTemperature = 0.25;
  }

  async analyze(packet: Record<string, unknown>): Promise<PortalAgentResult> {
    const messages = [
      {
        role: "system",
        message: [
          "You write concise big-picture analysis for an evidence portal in a public consultation.",
          "Use only the supplied evidence bundles and connected debate references.",
          "Return JSON only with title, short_analysis, and theme_summaries.",
          "Each theme summary must include title, summary, bundleIds, sourceIds, and connectedDebate.",
        ].join(" "),
      },
      {
        role: "user",
        message: JSON.stringify(packet),
      },
    ];

    return (await this.callLLM(
      "betterIcelandEvidencePortal",
      messages,
      true,
      1600
    )) as PortalAgentResult;
  }
}

export class EvidencePortalService {
  private EvidencePortalAnalysis = dbModels.EvidencePortalAnalysis as any;
  private EvidenceBundle = dbModels.EvidenceBundle as any;
  private EvidenceBundleSource = dbModels.EvidenceBundleSource as any;
  private EvidenceSource = dbModels.EvidenceSource as any;
  private EvidenceSnapshot = dbModels.EvidenceSnapshot as any;
  private Group = dbModels.Group as any;
  private synthesisService = new EvidenceSynthesisService();

  async getPortal(groupId: number) {
    const portal = await this.EvidencePortalAnalysis.findOne({
      where: { group_id: groupId, status: "published" },
      order: [["updated_at", "DESC"]],
    });

    if (portal) return portal;

    return this.derivePortalAnalysis(groupId, false);
  }

  async analyzePortal(groupId: number, userId?: number) {
    const derived = await this.derivePortalAnalysis(groupId, true);
    const packet = this.buildPortalPacket(derived);
    let agentResult: PortalAgentResult | undefined;
    let mode = "deterministic";

    if (this.hasAiModelConfig()) {
      try {
        const agent = new EvidencePortalAgent(groupId);
        agentResult = await agent.analyze(packet);
        mode = "policysynth_simple_agent";
      } catch (error) {
        log.error("Evidence portal agent failed", { groupId, error });
      }
    }

    const title = agentResult?.title || derived.title;
    const shortAnalysis = agentResult?.short_analysis || derived.short_analysis;
    const themeSummaries =
      Array.isArray(agentResult?.theme_summaries) &&
      agentResult!.theme_summaries!.length > 0
        ? agentResult!.theme_summaries
        : derived.theme_summaries;

    return this.EvidencePortalAnalysis.create({
      group_id: groupId,
      title,
      short_analysis: shortAnalysis,
      theme_summaries: themeSummaries,
      source_refs: derived.source_refs,
      bundle_refs: derived.bundle_refs,
      connected_debate: derived.connected_debate,
      status: "published",
      language: derived.language,
      model_metadata: {
        mode,
        generatedAt: new Date().toISOString(),
        generatedByUserId: userId,
        promptVersion: "evidence-portal-v1",
      },
    });
  }

  private async derivePortalAnalysis(
    groupId: number,
    includeDrafts: boolean
  ): Promise<YpEvidencePortalAnalysisData> {
    const group = await this.Group.findOne({
      where: { id: groupId },
      attributes: ["id", "name", "language"],
    });
    const statusFilter = includeDrafts
      ? ["published", "needs_review"]
      : ["published"];
    const bundles = await this.EvidenceBundle.findAll({
      where: {
        group_id: groupId,
        status: statusFilter,
      },
      order: [["updated_at", "DESC"]],
      include: this.synthesisService.bundleIncludes(),
      limit: 50,
    });

    const connectedDebate = this.uniqueConnectedDebate(
      bundles.flatMap((bundle: any) => bundle.connected_debate || [])
    );
    const themes = this.buildThemes(bundles);
    const sourceRefs = this.sourceRefsFromBundles(bundles);
    const bundleRefs = bundles.map((bundle: any) => ({
      id: bundle.id,
      subjectType: bundle.subject_type,
      subjectId: bundle.subject_id,
      status: bundle.status,
      title: bundle.question_or_claim,
    }));

    return {
      group_id: groupId,
      title: "Evidence and context",
      short_analysis:
        bundles.length > 0
          ? `This portal summarizes ${bundles.length} evidence bundle${bundles.length === 1 ? "" : "s"} connected to ${group?.name || "this consultation"}.`
          : "No published evidence bundles have been added to this consultation yet.",
      theme_summaries: themes,
      source_refs: sourceRefs,
      bundle_refs: bundleRefs,
      connected_debate: connectedDebate,
      status: includeDrafts ? "draft" : "published",
      language: group?.language,
      model_metadata: {
        mode: "deterministic",
      },
    };
  }

  private buildThemes(bundles: any[]): YpEvidencePortalThemeData[] {
    const buckets = new Map<string, any[]>();

    for (const bundle of bundles) {
      const theme = this.themeForBundle(bundle);
      const existing = buckets.get(theme) || [];
      existing.push(bundle);
      buckets.set(theme, existing);
    }

    if (buckets.size === 0) {
      return [
        {
          title: "No evidence gathered yet",
          summary:
            "Evidence cards will appear here after moderators request research and publish reviewed bundles.",
          connectedDebate: [],
        },
      ];
    }

    return Array.from(buckets.entries()).map(([title, themeBundles]) => {
      const bundleIds = themeBundles.map((bundle) => bundle.id);
      const sources = this.sourceRefsFromBundles(themeBundles);
      const connectedDebate = this.uniqueConnectedDebate(
        themeBundles.flatMap((bundle) => bundle.connected_debate || [])
      );
      const summaries = themeBundles
        .map((bundle) => bundle.short_analysis || bundle.question_or_claim)
        .filter(Boolean)
        .slice(0, 3);

      return {
        title,
        summary: summaries.join(" "),
        bundleIds,
        sourceIds: sources.map((source) => Number(source.id)).filter(Boolean),
        imageUrl: this.firstSourceImage(themeBundles),
        connectedDebate,
      };
    });
  }

  private themeForBundle(bundle: any): string {
    const text = [
      bundle.question_or_claim,
      bundle.short_analysis,
      ...(bundle.key_findings || []),
    ]
      .join(" ")
      .toLowerCase();

    const checks: Array<[RegExp, string]> = [
      [/education|school|mennt|skol|skól/, "Education"],
      [/job|work|labor|labour|econom|atvinn|efnahag/, "Jobs and Economy"],
      [/language|icelandic|tungumal|tungumál|íslensk/, "Icelandic Language"],
      [/government|public service|stjorn|stjórn|þjonusta|þjónusta/, "Public Services"],
      [/privacy|data protection|right|personuvernd|rétt/, "Rights and Privacy"],
      [/democracy|debate|consultation|lydraedi|lýðræði|samrad|samráð/, "Democracy and Participation"],
      [/health|heilbrig/, "Health"],
      [/creative|culture|list|menning/, "Creative Industries"],
    ];

    return checks.find(([pattern]) => pattern.test(text))?.[1] || "General AI Context";
  }

  private sourceRefsFromBundles(bundles: any[]): Array<Record<string, unknown>> {
    const refs = new Map<number, Record<string, unknown>>();

    for (const bundle of bundles) {
      for (const bundleSource of bundle.BundleSources || []) {
        const source = bundleSource.Source;
        if (source && !refs.has(source.id)) {
          refs.set(source.id, {
            id: source.id,
            title: source.title,
            publisher: source.publisher,
            url: source.canonical_url,
            trustTier: source.trust_tier,
          });
        }
      }
    }

    return Array.from(refs.values());
  }

  private uniqueConnectedDebate(
    items: YpEvidenceConnectedDebateData[]
  ): YpEvidenceConnectedDebateData[] {
    const seen = new Set<string>();
    return items.filter((item) => {
      const key = `${item.subjectType}:${item.subjectId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private firstSourceImage(bundles: any[]): string | undefined {
    for (const bundle of bundles) {
      for (const bundleSource of bundle.BundleSources || []) {
        if (bundleSource.Source?.image_url) {
          return bundleSource.Source.image_url;
        }
      }
    }
    return undefined;
  }

  private buildPortalPacket(
    portal: YpEvidencePortalAnalysisData
  ): Record<string, unknown> {
    return {
      group_id: portal.group_id,
      deterministic_summary: {
        title: portal.title,
        short_analysis: portal.short_analysis,
        theme_summaries: portal.theme_summaries,
      },
      source_refs: portal.source_refs,
      bundle_refs: portal.bundle_refs,
      connected_debate: portal.connected_debate,
    };
  }

  private hasAiModelConfig(): boolean {
    return !!(
      process.env.AI_MODEL_API_KEY &&
      process.env.AI_MODEL_NAME &&
      process.env.AI_MODEL_PROVIDER
    );
  }
}
