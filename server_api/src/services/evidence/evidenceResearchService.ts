import models from "../../models/index.cjs";
import log from "../../utils/loggerTs.js";
import queue from "../workers/queue.cjs";
import { EvidenceSourceService } from "./evidenceSourceService.js";
import { EvidenceSynthesisService } from "./evidenceSynthesisService.js";

const dbModels: Models = models;

type CreateResearchOptions = {
  question?: string;
  sourceUrls?: string[];
  queue?: boolean;
  researchMode?: "standard" | "deep";
};

type LoadedSubject = {
  question: string;
  language?: string;
  groupId?: number;
  postId?: number;
  pointId?: number;
  connectedDebate: YpEvidenceConnectedDebateData[];
};

export class EvidenceResearchService {
  private EvidenceBundle = dbModels.EvidenceBundle as any;
  private EvidenceBundleSource = dbModels.EvidenceBundleSource as any;
  private Group = dbModels.Group as any;
  private Post = dbModels.Post as any;
  private Point = dbModels.Point as any;
  private sourceService = new EvidenceSourceService();
  private synthesisService = new EvidenceSynthesisService();

  async createResearchBundle(
    subjectType: YpEvidenceSubjectType,
    subjectId: number,
    userId: number | undefined,
    options: CreateResearchOptions = {}
  ) {
    const subject = await this.loadSubject(subjectType, subjectId);
    const question = (options.question || subject.question || "").trim();

    if (!question) {
      throw new Error("No question or claim available for evidence research");
    }

    const bundle = await this.EvidenceBundle.create({
      subject_type: subjectType,
      subject_id: subjectId,
      group_id: subject.groupId,
      post_id: subject.postId,
      point_id: subject.pointId,
      question_or_claim: question.slice(0, 5000),
      connected_debate: subject.connectedDebate,
      language: subject.language,
      status: "queued",
      metadata: {
        requestedByUserId: userId,
        requestedAt: new Date().toISOString(),
        researchMode: options.researchMode || "standard",
        sourceUrls: options.sourceUrls || [],
      },
    });

    if (options.queue !== false) {
      queue.add(
        "process-evidence",
        { type: "research", bundleId: bundle.id },
        "medium"
      );
    }

    return bundle;
  }

  async processResearch(bundleId: number) {
    const bundle = await this.EvidenceBundle.findOne({
      where: { id: bundleId },
    });

    if (!bundle) {
      throw new Error(`Evidence bundle ${bundleId} not found`);
    }

    try {
      await bundle.update({ status: "researching" });
      const sourceUrls = Array.isArray(bundle.metadata?.sourceUrls)
        ? bundle.metadata.sourceUrls
        : [];
      const candidates = await this.sourceService.discoverSourcesForResearch(
        bundle.question_or_claim,
        sourceUrls
      );

      let sourceIndex = 1;
      for (const candidate of candidates) {
        const { source, snapshot } =
          await this.sourceService.upsertSourceSnapshot(candidate.url, {
            title: candidate.title,
            sourceRole: candidate.sourceRole,
            requestedForBundleId: bundle.id,
          });

        try {
          await this.EvidenceBundleSource.findOrCreate({
            where: {
              bundle_id: bundle.id,
              snapshot_id: snapshot.id,
            },
            defaults: {
              bundle_id: bundle.id,
              source_id: source.id,
              snapshot_id: snapshot.id,
              relevance_score: this.estimateSourceRelevance(
                bundle.question_or_claim,
                source,
                snapshot
              ),
              citation_label: `[${sourceIndex}]`,
              source_role: candidate.sourceRole || "context",
              quoted_ranges: this.extractQuoteRanges(snapshot),
            },
          });
          sourceIndex += 1;
        } catch (error) {
          log.warn("Could not link evidence source to bundle", {
            bundleId,
            sourceId: source.id,
            snapshotId: snapshot.id,
            error,
          });
        }
      }

      return await this.synthesisService.synthesizeBundle(bundle.id);
    } catch (error: any) {
      log.error("Evidence research processing failed", { bundleId, error });
      await bundle.update({
        status: "failed",
        metadata: {
          ...(bundle.metadata || {}),
          error: error?.message || String(error),
          failedAt: new Date().toISOString(),
        },
      });
      throw error;
    }
  }

  private async loadSubject(
    subjectType: YpEvidenceSubjectType,
    subjectId: number
  ): Promise<LoadedSubject> {
    switch (subjectType) {
      case "post":
        return this.loadPostSubject(subjectId);
      case "point":
        return this.loadPointSubject(subjectId);
      case "group":
        return this.loadGroupSubject(subjectId);
      default:
        throw new Error(`Unsupported evidence subject type: ${subjectType}`);
    }
  }

  private async loadPostSubject(postId: number): Promise<LoadedSubject> {
    const post = await this.Post.findOne({
      where: { id: postId },
      attributes: ["id", "name", "description", "group_id", "language"],
      include: [
        {
          model: this.Group,
          attributes: ["id", "name", "configuration", "language"],
          required: false,
        },
      ],
    });

    if (!post) throw new Error(`Post ${postId} not found`);

    return {
      question: [post.name, post.description].filter(Boolean).join("\n\n"),
      language: post.language || post.Group?.language,
      groupId: post.group_id,
      postId: post.id,
      connectedDebate: [
        {
          subjectType: "post",
          subjectId: post.id,
          title: post.name,
          url: `/post/${post.id}`,
        },
      ],
    };
  }

  private async loadPointSubject(pointId: number): Promise<LoadedSubject> {
    const point = await this.Point.findOne({
      where: { id: pointId },
      attributes: ["id", "content", "post_id", "group_id", "language"],
      include: [
        {
          model: this.Post,
          attributes: ["id", "name", "group_id", "language"],
          required: false,
        },
        {
          model: this.Group,
          attributes: ["id", "name", "configuration", "language"],
          required: false,
        },
      ],
    });

    if (!point) throw new Error(`Point ${pointId} not found`);

    const post = point.Post;
    const groupId = point.group_id || post?.group_id;

    return {
      question: point.content,
      language: point.language || post?.language || point.Group?.language,
      groupId,
      postId: point.post_id,
      pointId: point.id,
      connectedDebate: [
        post
          ? {
              subjectType: "post",
              subjectId: post.id,
              title: post.name,
              url: `/post/${post.id}`,
            }
          : undefined,
        {
          subjectType: "point",
          subjectId: point.id,
          title: this.trimText(point.content, 120),
          url: post ? `/post/${post.id}/${point.id}` : undefined,
        },
      ].filter(Boolean) as YpEvidenceConnectedDebateData[],
    };
  }

  private async loadGroupSubject(groupId: number): Promise<LoadedSubject> {
    const group = await this.Group.findOne({
      where: { id: groupId },
      attributes: ["id", "name", "objectives", "configuration", "language"],
    });

    if (!group) throw new Error(`Group ${groupId} not found`);

    return {
      question: [group.name, group.objectives].filter(Boolean).join("\n\n"),
      language: group.language,
      groupId: group.id,
      connectedDebate: [
        {
          subjectType: "group",
          subjectId: group.id,
          title: group.name,
          url: `/group/${group.id}`,
        },
      ],
    };
  }

  private estimateSourceRelevance(
    question: string,
    source: any,
    snapshot: any
  ): number {
    if (snapshot.status !== "ok") return 0;

    const text = [
      question,
      source.title,
      source.publisher,
      snapshot.extracted_text?.slice(0, 10000),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const keywords = ["ai", "gervigreind", "data", "open", "samrad", "island"];
    const hits = keywords.filter((keyword) => text.includes(keyword)).length;
    const trustBoost = source.trust_tier === "official" ? 0.25 : 0;
    return Math.min(1, 0.35 + hits * 0.08 + trustBoost);
  }

  private extractQuoteRanges(snapshot: any) {
    const text = snapshot.markdown || snapshot.extracted_text;
    if (!text || snapshot.status !== "ok") return [];

    return [
      {
        start: 0,
        end: Math.min(500, text.length),
        text: text.slice(0, 500),
      },
    ];
  }

  private trimText(text: string, maxLength: number): string {
    if (!text) return "";
    return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
  }
}
