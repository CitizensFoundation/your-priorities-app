"use strict";
const { v4: uuidv4 } = require("uuid");
const models = require("../models/index.cjs");
const log = require("./logger.cjs");
const WINDOW_MS = 24 * 60 * 60 * 1000;
const WINDOW_TTL_SECONDS = 25 * 60 * 60;
const GENERATION_CONTEXTS = {
    AOI_ICON_PUBLIC: "aoiIconPublic",
    AOI_ICON_ADMIN: "aoiIconAdmin",
    REGULAR_AI_IMAGE: "regularAiImage",
};
const parseLimit = (name, defaultValue) => {
    const parsed = parseInt(process.env[name] || "", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
};
const getLimitForContext = (generationContext) => {
    switch (generationContext) {
        case GENERATION_CONTEXTS.AOI_ICON_PUBLIC:
            return parseLimit("AI_IMAGE_PUBLIC_AOI_ICON_LIMIT_PER_24H", 10);
        case GENERATION_CONTEXTS.AOI_ICON_ADMIN:
            return parseLimit("AI_IMAGE_ADMIN_AOI_ICON_LIMIT_PER_24H", 150);
        case GENERATION_CONTEXTS.REGULAR_AI_IMAGE:
            return parseLimit("AI_IMAGE_REGULAR_LIMIT_PER_24H", 25);
        default:
            return undefined;
    }
};
const deny = (status, body) => ({
    allowed: false,
    status,
    body,
});
const isSameId = (a, b) => a !== undefined && a !== null && b !== undefined && b !== null && Number(a) === Number(b);
const hasGroupAdmin = async (group, user) => {
    if (!group || !user)
        return false;
    if (isSameId(group.user_id, user.id))
        return true;
    return group.hasGroupAdmins ? await group.hasGroupAdmins(user) : false;
};
const hasCommunityAdmin = async (community, user) => {
    if (!community || !user)
        return false;
    if (isSameId(community.user_id, user.id))
        return true;
    return community.hasCommunityAdmins
        ? await community.hasCommunityAdmins(user)
        : false;
};
const hasDomainAdmin = async (domain, user) => {
    if (!domain || !user)
        return false;
    if (isSameId(domain.user_id, user.id))
        return true;
    return domain.hasDomainAdmins ? await domain.hasDomainAdmins(user) : false;
};
const loadCollection = async (collectionType, collectionId) => {
    switch (collectionType) {
        case "group":
            return await models.Group.findOne({
                where: { id: collectionId },
                attributes: ["id", "user_id", "access", "configuration", "community_id"],
                include: [
                    {
                        model: models.Community,
                        required: true,
                        attributes: ["id", "user_id", "access", "configuration", "domain_id"],
                    },
                ],
            });
        case "community":
            return await models.Community.findOne({
                where: { id: collectionId },
                attributes: [
                    "id",
                    "user_id",
                    "access",
                    "configuration",
                    "domain_id",
                    "only_admins_can_create_groups",
                ],
            });
        case "domain":
            return await models.Domain.findOne({
                where: { id: collectionId },
                attributes: [
                    "id",
                    "user_id",
                    "access",
                    "configuration",
                    "only_admins_can_create_communities",
                ],
            });
        default:
            return null;
    }
};
const canGenerateForContext = async ({ collection, collectionType, generationContext, imageType, user, }) => {
    if (!collection)
        return false;
    if (generationContext === GENERATION_CONTEXTS.AOI_ICON_PUBLIC ||
        generationContext === GENERATION_CONTEXTS.AOI_ICON_ADMIN) {
        if (imageType !== "icon")
            return false;
    }
    else if (imageType === "icon") {
        return false;
    }
    switch (generationContext) {
        case GENERATION_CONTEXTS.AOI_ICON_PUBLIC:
            return (collectionType === "group" &&
                Boolean(collection.configuration?.allOurIdeas?.earl));
        case GENERATION_CONTEXTS.AOI_ICON_ADMIN:
            if (collectionType === "group")
                return await hasGroupAdmin(collection, user);
            if (collectionType === "community") {
                return await hasCommunityAdmin(collection, user);
            }
            if (collectionType === "domain")
                return await hasDomainAdmin(collection, user);
            return false;
        case GENERATION_CONTEXTS.REGULAR_AI_IMAGE:
            if (collectionType === "group") {
                return ((await hasGroupAdmin(collection, user)) ||
                    Boolean(collection.configuration?.allowGenerativeImages));
            }
            if (collectionType === "community") {
                return ((await hasCommunityAdmin(collection, user)) ||
                    !collection.only_admins_can_create_groups);
            }
            if (collectionType === "domain") {
                return ((await hasDomainAdmin(collection, user)) ||
                    !collection.only_admins_can_create_communities);
            }
            return false;
        default:
            return false;
    }
};
const rollingLimitScript = `
redis.call("ZREMRANGEBYSCORE", KEYS[1], "-inf", ARGV[1])
local count = redis.call("ZCARD", KEYS[1])
local limit = tonumber(ARGV[3])
if count >= limit then
  local oldest = redis.call("ZRANGE", KEYS[1], 0, 0, "WITHSCORES")
  local nextAllowedAt = 0
  if oldest[2] then
    nextAllowedAt = tonumber(oldest[2]) + tonumber(ARGV[5])
  end
  redis.call("EXPIRE", KEYS[1], tonumber(ARGV[6]))
  return {0, count, nextAllowedAt}
end
redis.call("ZADD", KEYS[1], ARGV[2], ARGV[4])
redis.call("EXPIRE", KEYS[1], tonumber(ARGV[6]))
return {1, count + 1, 0}
`;
const checkAndConsumeRateLimit = async (redisClient, generationContext, userId) => {
    const limit = getLimitForContext(generationContext);
    if (!limit) {
        return {
            allowed: false,
            status: 400,
            body: { error: "invalid_generation_context" },
        };
    }
    if (!redisClient || typeof redisClient.eval !== "function") {
        log.error("Missing Redis client for AI image rate limit");
        return {
            allowed: false,
            status: 503,
            body: { error: "rate_limit_unavailable" },
        };
    }
    const now = Date.now();
    const oldestAllowed = now - WINDOW_MS;
    const key = `rate:aiImage:${generationContext}:user:${userId}`;
    const member = `${now}:${uuidv4()}`;
    const result = await redisClient.eval(rollingLimitScript, {
        keys: [key],
        arguments: [
            oldestAllowed.toString(),
            now.toString(),
            limit.toString(),
            member,
            WINDOW_MS.toString(),
            WINDOW_TTL_SECONDS.toString(),
        ],
    });
    const allowed = Number(result[0]) === 1;
    const usedImagesInLast24Hours = Number(result[1]);
    const nextAllowedAtMs = Number(result[2] || 0);
    if (allowed) {
        return {
            allowed: true,
            limit,
            usedImagesInLast24Hours,
        };
    }
    const retryAfterSeconds = Math.max(1, Math.ceil((nextAllowedAtMs - now) / 1000));
    return {
        allowed: false,
        status: 429,
        body: {
            error: "rate_limited",
            generationContext,
            maxImagesPer24Hours: limit,
            usedImagesInLast24Hours,
            nextImageAllowedAt: new Date(nextAllowedAtMs).toISOString(),
            retryAfterSeconds,
        },
    };
};
const validateImageGenerationStartRequest = async (req, { collectionType, collectionId }) => {
    const numericCollectionId = Number(collectionId);
    if (!Number.isInteger(numericCollectionId) || numericCollectionId <= 0) {
        return deny(400, { error: "invalid_collection_id" });
    }
    if (!req.user) {
        return deny(401, { error: "login_required" });
    }
    const generationContext = req.body?.generationContext;
    if (!Object.values(GENERATION_CONTEXTS).includes(generationContext)) {
        return deny(400, { error: "invalid_generation_context" });
    }
    const collection = await loadCollection(collectionType, numericCollectionId);
    if (!collection) {
        return deny(404, { error: "collection_not_found" });
    }
    const canGenerate = await canGenerateForContext({
        collection,
        collectionType,
        generationContext,
        imageType: req.body?.imageType,
        user: req.user,
    });
    if (!canGenerate) {
        return deny(403, { error: "image_generation_not_allowed" });
    }
    const rateLimit = await checkAndConsumeRateLimit(req.redisClient, generationContext, req.user.id);
    if (!rateLimit.allowed) {
        return deny(rateLimit.status, rateLimit.body);
    }
    return {
        allowed: true,
        userId: req.user.id,
        generationContext,
        internalData: {
            userId: req.user.id,
            generationContext,
            imageType: req.body?.imageType,
            collectionType,
            collectionId: numericCollectionId,
            createdAt: new Date().toISOString(),
            maxImagesPer24Hours: rateLimit.limit,
            usedImagesInLast24Hours: rateLimit.usedImagesInLast24Hours,
        },
    };
};
const canPollImageGenerationJob = (req, job) => Boolean(req.user && job?.internal_data?.userId === req.user.id);
const publicJobFields = (job) => ({
    id: job.id,
    progress: job.progress,
    error: job.error,
    data: job.data,
});
module.exports = {
    GENERATION_CONTEXTS,
    validateImageGenerationStartRequest,
    canPollImageGenerationJob,
    publicJobFields,
};
