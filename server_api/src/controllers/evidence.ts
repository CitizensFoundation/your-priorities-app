import express, { NextFunction, Response } from "express";

import auth from "../authorization.cjs";
import models from "../models/index.cjs";
import log from "../utils/loggerTs.js";
import queue from "../services/workers/queue.cjs";
import { EvidenceDeepResearchService } from "../services/evidence/evidenceDeepResearchService.js";
import { EvidencePortalService } from "../services/evidence/evidencePortalService.js";
import { EvidenceResearchService } from "../services/evidence/evidenceResearchService.js";
import { EvidenceSynthesisService } from "../services/evidence/evidenceSynthesisService.js";

interface YpRequest extends express.Request {
  user?: any;
}

const router = express.Router();
const dbModels: Models = models;
const EvidenceBundle = dbModels.EvidenceBundle as any;
const Group = dbModels.Group as any;

const researchService = new EvidenceResearchService();
const deepResearchService = new EvidenceDeepResearchService();
const synthesisService = new EvidenceSynthesisService();
const portalService = new EvidencePortalService();

const asyncHandler =
  (
    fn: (
      req: YpRequest,
      res: Response,
      next: NextFunction
    ) => Promise<void>
  ) =>
  (req: YpRequest, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((error) => {
      log.error("Evidence controller error", { error });
      next(error);
    });
  };

router.get(
  "/posts/:postId/bundles",
  auth.can("view post"),
  asyncHandler(async (req, res) => {
    const postId = Number(req.params.postId);
    const groupId = await groupIdForPost(postId);
    const includeReviewStatuses = await canEditGroupId(req, groupId);
    const bundles = await loadBundles("post", postId, includeReviewStatuses);
    res.send(bundles);
  })
);

router.post(
  "/posts/:postId/research",
  auth.can("edit post"),
  asyncHandler(async (req, res) => {
    const bundle = await researchService.createResearchBundle(
      "post",
      Number(req.params.postId),
      req.user?.id,
      {
        question: req.body?.question,
        sourceUrls: normalizeSourceUrls(req.body?.sourceUrls),
      }
    );

    res.send({ bundle, queued: true } as YpEvidenceResearchStartResponse);
  })
);

router.post(
  "/posts/:postId/deep_research",
  auth.can("edit post"),
  asyncHandler(async (req, res) => {
    const { bundle, run } = await deepResearchService.createDeepResearchBundle(
      "post",
      Number(req.params.postId),
      req.user?.id,
      {
        question: req.body?.question,
        sourceUrls: normalizeSourceUrls(req.body?.sourceUrls),
        config: normalizeDeepResearchConfig(req.body?.config),
      }
    );

    res.send({ bundle, run, queued: true } as YpEvidenceResearchStartResponse);
  })
);

router.get(
  "/points/:pointId/bundles",
  auth.can("view point"),
  asyncHandler(async (req, res) => {
    const pointId = Number(req.params.pointId);
    const groupId = await groupIdForPoint(pointId);
    const includeReviewStatuses = await canEditGroupId(req, groupId);
    const bundles = await loadBundles("point", pointId, includeReviewStatuses);
    res.send(bundles);
  })
);

router.post(
  "/points/:pointId/research",
  auth.can("edit point"),
  asyncHandler(async (req, res) => {
    const bundle = await researchService.createResearchBundle(
      "point",
      Number(req.params.pointId),
      req.user?.id,
      {
        question: req.body?.question,
        sourceUrls: normalizeSourceUrls(req.body?.sourceUrls),
      }
    );

    res.send({ bundle, queued: true } as YpEvidenceResearchStartResponse);
  })
);

router.post(
  "/points/:pointId/deep_research",
  auth.can("edit point"),
  asyncHandler(async (req, res) => {
    const { bundle, run } = await deepResearchService.createDeepResearchBundle(
      "point",
      Number(req.params.pointId),
      req.user?.id,
      {
        question: req.body?.question,
        sourceUrls: normalizeSourceUrls(req.body?.sourceUrls),
        config: normalizeDeepResearchConfig(req.body?.config),
      }
    );

    res.send({ bundle, run, queued: true } as YpEvidenceResearchStartResponse);
  })
);

router.get(
  "/groups/:groupId/portal",
  auth.can("view group"),
  asyncHandler(async (req, res) => {
    const portal = await portalService.getPortal(Number(req.params.groupId));
    res.send(portal);
  })
);

router.post(
  "/groups/:groupId/portal/analyze",
  auth.can("edit group"),
  asyncHandler(async (req, res) => {
    queue.add(
      "process-evidence",
      {
        type: "analyzePortal",
        groupId: Number(req.params.groupId),
        userId: req.user?.id,
      },
      "medium"
    );
    res.send({ queued: true });
  })
);

router.post(
  "/groups/:groupId/bundles/:bundleId/synthesize",
  auth.can("edit group"),
  asyncHandler(async (req, res) => {
    const bundle = await loadBundleInGroup(
      Number(req.params.groupId),
      Number(req.params.bundleId)
    );
    queue.add(
      "process-evidence",
      { type: "synthesize", bundleId: bundle.id },
      "medium"
    );
    res.send({ queued: true });
  })
);

router.post(
  "/groups/:groupId/bundles/:bundleId/publish",
  auth.can("edit group"),
  asyncHandler(async (req, res) => {
    const bundle = await loadBundleInGroup(
      Number(req.params.groupId),
      Number(req.params.bundleId)
    );
    await bundle.update({
      status: "published",
      reviewed_by_user_id: req.user?.id,
      published_at: new Date(),
    });
    res.send(await loadBundleById(bundle.id));
  })
);

router.post(
  "/groups/:groupId/bundles/:bundleId/archive",
  auth.can("edit group"),
  asyncHandler(async (req, res) => {
    const bundle = await loadBundleInGroup(
      Number(req.params.groupId),
      Number(req.params.bundleId)
    );
    await bundle.update({ status: "archived" });
    res.send(await loadBundleById(bundle.id));
  })
);

router.get(
  "/groups/:groupId/bundles/:bundleId",
  auth.can("view group"),
  asyncHandler(async (req, res, next) => {
    const groupId = Number(req.params.groupId);
    const bundle = await loadBundleInGroup(groupId, Number(req.params.bundleId));
    const canEdit = await canEditGroupId(req, groupId);
    if (bundle.status !== "published" && !canEdit) {
      next({ status: 401, error: "Not authorized" });
      return;
    }
    res.send(await loadBundleById(bundle.id));
  })
);

async function loadBundles(
  subjectType: YpEvidenceSubjectType,
  subjectId: number,
  includeReviewStatuses: boolean
) {
  const statuses = includeReviewStatuses
    ? ["published", "needs_review", "queued", "researching", "failed", "stale"]
    : ["published"];

  return EvidenceBundle.findAll({
    where: {
      subject_type: subjectType,
      subject_id: subjectId,
      status: statuses,
    },
    order: [["updated_at", "DESC"]],
    include: synthesisService.bundleIncludes(),
  });
}

async function loadBundleById(bundleId: number) {
  return EvidenceBundle.findOne({
    where: { id: bundleId },
    include: synthesisService.bundleIncludes(),
  });
}

async function loadBundleInGroup(groupId: number, bundleId: number) {
  const bundle = await EvidenceBundle.findOne({
    where: { id: bundleId, group_id: groupId },
  });

  if (!bundle) {
    throw { status: 404, error: "Evidence bundle not found" };
  }

  return bundle;
}

async function canEditGroupId(req: YpRequest, groupId?: number) {
  if (!req.user || !groupId) return false;

  const group = await Group.findOne({
    where: { id: groupId },
    attributes: ["id", "user_id"],
  });

  if (!group) return false;
  if (group.user_id === req.user.id) return true;
  return group.hasGroupAdmins(req.user);
}

async function groupIdForPost(postId: number): Promise<number | undefined> {
  const post = await (dbModels.Post as any).findOne({
    where: { id: postId },
    attributes: ["id", "group_id"],
  });
  return post?.group_id;
}

async function groupIdForPoint(pointId: number): Promise<number | undefined> {
  const point = await (dbModels.Point as any).findOne({
    where: { id: pointId },
    attributes: ["id", "group_id", "post_id"],
    include: [
      {
        model: dbModels.Post,
        attributes: ["id", "group_id"],
        required: false,
      },
    ],
  });
  return point?.group_id || point?.Post?.group_id;
}

function normalizeSourceUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 10);
}

function normalizeDeepResearchConfig(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object") return {};

  const input = value as Record<string, unknown>;
  const allowedKeys = [
    "generations",
    "maxQueriesPerGeneration",
    "maxSearchResultsPerQuery",
    "maxCandidatesToAnalyze",
    "maxPairwisePrompts",
    "maxSelectedSources",
  ];
  const output: Record<string, number> = {};

  for (const key of allowedKeys) {
    const numberValue = Number(input[key]);
    if (Number.isFinite(numberValue) && numberValue > 0) {
      output[key] = numberValue;
    }
  }

  return output;
}

export default router;
