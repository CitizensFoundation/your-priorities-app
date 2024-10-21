"use strict";
var express = require("express");
var router = express.Router();
var models = require("../models/index.cjs");
var auth = require("../authorization.cjs");
var log = require("../utils/logger.cjs");
var toJson = require("../utils/to_json.cjs");
var async = require("async");
var _ = require("lodash");
var queue = require("../active-citizen/workers/queue.cjs");
const getAnonymousUser = require("../active-citizen/utils/get_anonymous_system_user.cjs");
const moment = require("moment");
const { plausibleStatsProxy, } = require("../active-citizen/engine/analytics/plausible/manager.cjs");
const { isValidDbId } = require("../utils/is_valid_db_id.cjs");
var changePostCounter = function (req, postId, column, upDown, next) {
    models.Post.findOne({
        where: { id: postId },
    }).then(function (post) {
        if (post) {
            if (upDown === 1) {
                post.increment(column);
            }
            else if (upDown === -1) {
                post.decrement(column);
            }
            models.Group.addUserToGroupIfNeeded(post.group_id, req, function () {
                next();
            });
        }
        else {
            log.error("No post for changePostCounter");
            next();
        }
    });
};
//TODO: Refactor this as not to repeate it in controlelrs
const addAgentFabricUserToSessionIfNeeded = async (req) => {
    let userId = (req.user && req.user.id) ? req.user.id : null;
    if (!userId &&
        req.query.agentFabricUserId &&
        process.env.PS_TEMP_AGENTS_FABRIC_GROUP_API_KEY &&
        req.headers["x-api-key"] === process.env.PS_TEMP_AGENTS_FABRIC_GROUP_API_KEY) {
        log.info(`Creating group with temp agents fabric group api key ${req.query.agentFabricUserId}`);
        userId = req.query.agentFabricUserId;
        try {
            const loadedUser = await models.User.findByPk(userId);
            req.user = loadedUser;
        }
        catch (error) {
            log.error(`Could not find user with id ${userId}`, {
                context: "create",
                userId: userId,
                error: error,
            });
            throw error;
        }
    }
    else {
        log.info("Creating group with user id: " + userId);
    }
};
var decrementOldCountersIfNeeded = function (req, oldEndorsementValue, postId, endorsement, next) {
    if (oldEndorsementValue) {
        if (oldEndorsementValue > 0) {
            changePostCounter(req, postId, "counter_endorsements_up", -1, function () {
                next();
            });
        }
        else if (oldEndorsementValue < 0) {
            changePostCounter(req, postId, "counter_endorsements_down", -1, function () {
                next();
            });
        }
        else {
            log.error("Strange state of endorsements");
            next();
        }
    }
    else {
        next();
    }
};
var sendPostOrError = function (res, post, context, user, error, errorStatus) {
    if (error || !post) {
        if (errorStatus === 404 ||
            (error &&
                error.message &&
                error.message.indexOf("invalid input syntax for type integer") > -1)) {
            log.warn("Post Not Found", {
                context: context,
                post: toJson(post),
                user: toJson(user),
                err: error,
                errorStatus: 404,
            });
            errorStatus = 404;
        }
        else {
            log.error("Post Error", {
                context: context,
                post: toJson(post),
                user: toJson(user),
                err: error,
                errorStatus: errorStatus ? errorStatus : 500,
            });
        }
        if (errorStatus) {
            res.sendStatus(errorStatus);
        }
        else {
            res.sendStatus(500);
        }
    }
    else {
        res.send(post);
    }
};
router.delete("/:postId/:activityId/delete_activity", auth.can("edit post"), function (req, res) {
    models.AcActivity.findOne({
        where: {
            post_id: req.params.postId,
            id: req.params.activityId,
        },
    })
        .then(function (activity) {
        activity.deleted = true;
        activity.save().then(function () {
            res.send({ activityId: activity.id });
        });
    })
        .catch(function (error) {
        log.error("Could not delete activity for post", {
            err: error,
            context: "delete_activity",
            user: toJson(req.user.simple()),
        });
        res.sendStatus(500);
    });
});
router.post("/:id/status_change_no_emails", auth.can("send status change"), function (req, res) {
    models.Post.findOne({
        where: {
            id: req.params.id,
        },
        attributes: ["id", "official_status"],
    }).then(function (post) {
        if (post) {
            if (post.official_status != parseInt(req.body.official_status)) {
                post.official_status = req.body.official_status;
                post.save().then(function (results) {
                    log.info("Post Status Change Created And New Status", {
                        post: toJson(post),
                        context: "status_change",
                        user: toJson(req.user),
                    });
                    res.sendStatus(200);
                });
            }
            else {
                log.info("Post Status Change Created", {
                    post: toJson(post),
                    context: "status_change",
                    user: toJson(req.user),
                });
                res.sendStatus(200);
            }
        }
    });
});
router.post("/:id/status_change", auth.can("send status change"), function (req, res) {
    models.Post.findOne({
        where: {
            id: req.params.id,
        },
        include: [
            {
                model: models.Group,
                required: true,
                attributes: ["id"],
                include: [
                    {
                        model: models.Community,
                        required: true,
                        attributes: ["id"],
                        include: [
                            {
                                model: models.Domain,
                                required: true,
                                attributes: ["id"],
                            },
                        ],
                    },
                ],
            },
        ],
    }).then(function (post) {
        if (post) {
            models.PostStatusChange.build({
                post_id: post.id,
                status_changed_to: post.official_status != parseInt(req.body.official_status)
                    ? req.body.official_status
                    : null,
                content: req.body.content,
                user_id: req.user.id,
                status: "active",
                user_agent: req.useragent.source,
                ip_address: req.clientIp,
            })
                .save()
                .then(function (post_status_change) {
                if (post_status_change) {
                    models.AcActivity.createActivity({
                        type: "activity.post.status.change",
                        userId: req.user.id,
                        postId: post.id,
                        postStatusChangeId: post_status_change.id,
                        groupId: post.Group.id,
                        communityId: post.Group.Community.id,
                        domainId: post.Group.Community.Domain.id,
                    }, function (error) {
                        if (error) {
                            log.error("Post Status Change Error", {
                                context: "status_change",
                                post: toJson(post),
                                user: toJson(req.user),
                                err: error,
                            });
                            res.sendStatus(500);
                        }
                        else {
                            if (post.official_status != parseInt(req.body.official_status)) {
                                post.official_status = req.body.official_status;
                                post.save().then(function (results) {
                                    log.info("Post Status Change Created And New Status", {
                                        post: toJson(post),
                                        context: "status_change",
                                        user: toJson(req.user),
                                    });
                                    res.sendStatus(200);
                                });
                            }
                            else {
                                log.info("Post Status Change Created", {
                                    post: toJson(post),
                                    context: "status_change",
                                    user: toJson(req.user),
                                });
                                res.sendStatus(200);
                            }
                        }
                    });
                }
                else {
                    log.error("Post Status Change Error", {
                        context: "status_change",
                        post: toJson(post),
                        user: toJson(req.user),
                        err: "Could not created status change",
                    });
                    res.sendStatus(500);
                }
            })
                .catch(function (error) {
                log.error("Post Status Change Error", {
                    context: "status_change",
                    post: toJson(post),
                    user: toJson(req.user),
                    err: error,
                });
                res.sendStatus(500);
            });
        }
        else {
            log.error("Post Status Change Post Not Found", {
                context: "status_change",
                postId: req.params.id,
                user: toJson(req.user),
                err: "Could not created status change",
            });
            res.sendStatus(404);
        }
    });
});
router.get("/:id", auth.can("view post"), function (req, res) {
    if (isValidDbId(req.params.id)) {
        let post;
        let videos;
        async.parallel([
            (parallelCallback) => {
                models.Post.findOne({
                    where: {
                        id: req.params.id,
                    },
                    attributes: [
                        "id",
                        "name",
                        "description",
                        "public_data",
                        "status",
                        "content_type",
                        "official_status",
                        "counter_endorsements_up",
                        "cover_media_type",
                        "counter_endorsements_down",
                        "group_id",
                        "language",
                        "counter_points",
                        "counter_flags",
                        "location",
                        "created_at",
                        "category_id",
                    ],
                    order: [
                        [
                            { model: models.Image, as: "PostHeaderImages" },
                            "updated_at",
                            "asc",
                        ],
                        [
                            { model: models.Category },
                            { model: models.Image, as: "CategoryIconImages" },
                            "updated_at",
                            "asc",
                        ],
                        [{ model: models.Audio, as: "PostAudios" }, "updated_at", "desc"],
                        [
                            { model: models.Group },
                            { model: models.Category },
                            "name",
                            "asc",
                        ],
                    ],
                    include: [
                        {
                            // Category
                            model: models.Category,
                            attributes: { exclude: ["ip_address", "user_agent"] },
                            required: false,
                            include: [
                                {
                                    model: models.Image,
                                    required: false,
                                    as: "CategoryIconImages",
                                },
                            ],
                        },
                        // Group
                        {
                            model: models.Group,
                            attributes: [
                                "id",
                                "configuration",
                                "name",
                                "theme_id",
                                "access",
                                "language",
                            ],
                            include: [
                                {
                                    model: models.Category,
                                    required: false,
                                },
                                {
                                    model: models.Community,
                                    attributes: [
                                        "id",
                                        "name",
                                        "theme_id",
                                        "google_analytics_code",
                                        "configuration",
                                        "only_admins_can_create_groups",
                                    ],
                                    required: true,
                                    //TODO: See if this is slowing things down
                                    include: [
                                        {
                                            model: models.Domain,
                                            attributes: models.Domain.defaultAttributesPublic,
                                        },
                                    ],
                                },
                            ],
                        },
                        // User
                        {
                            model: models.User,
                            required: false,
                            attributes: models.User.defaultAttributesWithSocialMediaPublic,
                            include: [
                                {
                                    model: models.Image,
                                    as: "UserProfileImages",
                                    attributes: ["id", "formats", "updated_at"],
                                    required: false,
                                    through: { attributes: [] },
                                },
                            ],
                        },
                        // Image
                        {
                            model: models.Image,
                            required: false,
                            as: "PostHeaderImages",
                            attributes: models.Image.defaultAttributesPublic,
                        },
                        {
                            model: models.Audio,
                            required: false,
                            attributes: ["id", "formats", "updated_at", "listenable"],
                            as: "PostAudios",
                        },
                    ],
                })
                    .then(function (postIn) {
                    post = postIn;
                    models.Post.setOrganizationUsersForPosts([post], (error) => {
                        parallelCallback(error);
                    });
                })
                    .catch((error) => {
                    parallelCallback(error);
                });
            },
            (parallelCallback) => {
                models.Post.getVideosForPosts([req.params.id], (error, videosIn) => {
                    if (error) {
                        parallelCallback(error);
                    }
                    else {
                        videos = videosIn;
                        parallelCallback();
                    }
                });
            },
        ], (error) => {
            if (error) {
                sendPostOrError(res, req.params.id, "view", req.user, error, 500);
            }
            else if (post) {
                log.info("Post Viewed", {
                    postId: post.id,
                    userId: req.user ? req.user.id : -1,
                });
                post.dataValues.PostVideos = videos;
                res.send(post);
            }
            else {
                sendPostOrError(res, req.params.id, "view", req.user, "Not found", 404);
            }
        });
    }
    else {
        res.sendStatus(404);
    }
});
router.get("/:id/translatedSurvey", auth.can("view post"), function (req, res) {
    const targetLanguage = req.query.targetLanguage;
    const groupId = req.query.groupId;
    let questions, answers;
    async.parallel([
        (parallelCallback) => {
            models.AcTranslationCache.getSurveyQuestionTranslations(groupId, targetLanguage, (error, translations) => {
                if (error) {
                    parallelCallback(error);
                }
                else {
                    questions = translations;
                    parallelCallback();
                }
            });
        },
        (parallelCallback) => {
            models.AcTranslationCache.getSurveyAnswerTranslations(req.params.id, targetLanguage, (error, translations) => {
                if (error) {
                    parallelCallback(error);
                }
                else {
                    answers = translations;
                    parallelCallback();
                }
            });
        },
    ], (error) => {
        if (error) {
            sendPostOrError(res, req.params.id, "translatedSurvey", req.user, error, 500);
        }
        else {
            res.send([questions, answers]);
        }
    });
});
router.get("/:id/translatedText", auth.can("view post"), function (req, res) {
    if (req.query.textType.indexOf("post") > -1) {
        models.Post.findOne({
            where: {
                id: req.params.id,
            },
            attributes: ["id", "name", "description", "public_data"],
        })
            .then(function (post) {
            if (post) {
                models.AcTranslationCache.getTranslation(req, post, function (error, translation) {
                    if (error) {
                        sendPostOrError(res, req.params.id, "translated", req.user, error, 500);
                    }
                    else {
                        res.send(translation);
                    }
                });
            }
            else {
                sendPostOrError(res, req.params.id, "translated", req.user, "Not found", 404);
            }
        })
            .catch(function (error) {
            sendPostOrError(res, null, "translated", req.user, error);
        });
    }
    else {
        sendPostOrError(res, req.params.id, "translated", req.user, "Wrong textType", 401);
    }
});
router.get("/:id/:statusId/translatedStatusText", auth.can("view post"), function (req, res) {
    if (req.query.textType.indexOf("statusChangeContent") > -1) {
        models.PostStatusChange.findOne({
            where: {
                id: req.params.statusId,
                post_id: req.params.id,
            },
            attributes: ["id", "content"],
        })
            .then(function (change) {
            if (change) {
                models.AcTranslationCache.getTranslation(req, change, function (error, translation) {
                    if (error) {
                        sendPostOrError(res, req.params.id, "translatedStatusText", req.user, error, 500);
                    }
                    else {
                        res.send(translation);
                    }
                });
                log.info("Post Status Change translatedStatusText", {
                    context: "view",
                });
            }
            else {
                sendPostOrError(res, req.params.id, "translated", req.user, "Not found", 404);
            }
        })
            .catch(function (error) {
            sendPostOrError(res, null, "translated", req.user, error);
        });
    }
    else {
        sendPostOrError(res, req.params.id, "translated", req.user, "Wrong textType", 401);
    }
});
router.put("/:id/report", auth.can("vote on post"), function (req, res) {
    models.Post.findOne({
        where: {
            id: req.params.id,
        },
        include: [
            {
                model: models.Group,
                required: true,
                attributes: ["id"],
                include: [
                    {
                        model: models.Community,
                        required: true,
                        attributes: ["id"],
                        include: [
                            {
                                model: models.Domain,
                                required: true,
                                attributes: ["id"],
                            },
                        ],
                    },
                ],
            },
        ],
    })
        .then(function (post) {
        if (post) {
            post.report(req, "user", (error) => {
                if (error) {
                    log.error("Post Report Error", {
                        context: "report",
                        post: toJson(post),
                        user: toJson(req.user),
                        err: error,
                    });
                    res.sendStatus(500);
                }
                else {
                    log.info("Post Report Created", {
                        postId: post ? post.id : -1,
                        userId: req.user ? req.user.id : -1,
                    });
                    res.sendStatus(200);
                }
            });
        }
        else {
            log.error("Post Report", {
                context: "report",
                post: toJson(post),
                user: toJson(req.user),
                err: "Could not created post",
            });
            res.sendStatus(500);
        }
    })
        .catch(function (error) {
        log.error("Post Report", {
            context: "report",
            post: toJson(post),
            user: toJson(req.user),
            err: error,
        });
        res.sendStatus(500);
    });
});
router.get("/:id/newPoints", auth.can("view post"), function (req, res) {
    if (req.query.latestPointCreatedAt &&
        req.query.latestPointCreatedAt !== "" &&
        req.query.latestPointCreatedAt !== "undefined") {
        models.Point.findAll({
            where: {
                post_id: req.params.id,
                created_at: {
                    $gt: req.query.latestPointCreatedAt,
                },
                status: "published",
            },
            attributes: { exclude: ["ip_address", "user_agent"] },
            order: [
                ["created_at", "asc"],
                [models.PointRevision, "created_at", "asc"],
                [
                    models.User,
                    { model: models.Image, as: "UserProfileImages" },
                    "created_at",
                    "asc",
                ],
                [{ model: models.Audio, as: "PointAudios" }, "updated_at", "desc"],
            ],
            include: [
                {
                    model: models.User,
                    attributes: [
                        "id",
                        "name",
                        "facebook_id",
                        "twitter_id",
                        "google_id",
                        "github_id",
                    ],
                    required: false,
                    include: [
                        {
                            model: models.Image,
                            as: "UserProfileImages",
                            required: false,
                            through: { attributes: [] }
                        },
                    ],
                },
                {
                    model: models.PointRevision,
                    attributes: { exclude: ["ip_address", "user_agent"] },
                    required: false,
                },
                {
                    model: models.Audio,
                    required: false,
                    attributes: ["id", "formats", "updated_at", "listenable"],
                    as: "PointAudios",
                },
                {
                    model: models.PointQuality,
                    attributes: { exclude: ["ip_address", "user_agent"] },
                    required: false,
                    include: [
                        { model: models.User, attributes: ["id", "name"], required: false },
                    ],
                },
                {
                    model: models.Post,
                    required: false,
                },
            ],
        })
            .then(function (points) {
            async.parallel([
                (parallelCallback) => {
                    models.Point.setVideosForPoints(points, (error) => {
                        parallelCallback(error);
                    });
                },
                (parallelCallback) => {
                    models.Point.setOrganizationUsersForPoints(points, (error) => {
                        parallelCallback(error);
                    });
                },
            ], (error) => {
                if (error) {
                    sendPostOrError(res, null, "view", req.user, error);
                }
                else {
                    if (points) {
                        log.info("Points New Viewed", {
                            postId: req.params.id,
                            userId: req.user ? req.user.id : -1,
                        });
                        res.send(points);
                    }
                    else {
                        sendPostOrError(res, null, "view", req.user, "Not found", 404);
                    }
                }
            });
        })
            .catch(function (error) {
            sendPostOrError(res, null, "view", req.user, error);
        });
    }
    else {
        log.warn("Points New Viewed Empty missing latestPointCreatedAt", {
            postId: req.params.id,
            context: "view",
            user: toJson(req.user),
        });
        res.send([]);
    }
});
const sendPostPoints = (req, res, redisKey) => {
    let upPointsIn, downPointsIn, upCount, downCount;
    async.parallel([
        (parallelCallback) => {
            models.Point.findAndCountAll({
                where: {
                    post_id: req.params.id,
                    value: 1,
                    status: "published",
                },
                attributes: ["id"],
                order: [
                    models.sequelize.literal("(counter_quality_up-counter_quality_down) desc"),
                ],
                limit: 100,
                offset: req.query.offsetUp ? req.query.offsetUp : 0,
            })
                .then((pointsIn) => {
                upPointsIn = pointsIn.rows;
                upCount = pointsIn.count;
                parallelCallback();
            })
                .catch((error) => {
                parallelCallback(error);
            });
        },
        (parallelCallback) => {
            models.Point.findAndCountAll({
                where: {
                    post_id: req.params.id,
                    value: -1,
                    status: "published",
                },
                attributes: ["id"],
                order: [
                    models.sequelize.literal("(counter_quality_up-counter_quality_down) desc"),
                ],
                limit: 100,
                offset: req.query.offsetDown ? req.query.offsetDown : 0,
            })
                .then((pointsIn) => {
                downPointsIn = pointsIn.rows;
                downCount = pointsIn.count;
                parallelCallback();
            })
                .catch((error) => {
                parallelCallback(error);
            });
        },
    ], (error) => {
        if (error) {
            sendPostOrError(res, null, "postPoints", req.user, error);
        }
        else {
            models.Point.findAll({
                where: {
                    id: {
                        $in: _.map(upPointsIn, (pointIn) => {
                            return pointIn.id;
                        }).concat(_.map(downPointsIn, (pointIn) => {
                            return pointIn.id;
                        })),
                    },
                },
                attributes: [
                    "id",
                    "name",
                    "content",
                    "user_id",
                    "value",
                    "counter_quality_up",
                    "counter_quality_down",
                    "embed_data",
                    "language",
                    "created_at",
                    "public_data",
                ],
                order: [
                    models.sequelize.literal("(counter_quality_up-counter_quality_down) desc"),
                    [models.PointRevision, "created_at", "asc"],
                    [
                        models.User,
                        { model: models.Image, as: "UserProfileImages" },
                        "created_at",
                        "asc",
                    ],
                    [{ model: models.Audio, as: "PointAudios" }, "updated_at", "desc"],
                ],
                include: [
                    {
                        model: models.User,
                        attributes: [
                            "id",
                            "name",
                            "facebook_id",
                            "twitter_id",
                            "google_id",
                            "github_id",
                        ],
                        required: true,
                        include: [
                            {
                                model: models.Image,
                                as: "UserProfileImages",
                                attributes: ["id", "formats"],
                                required: false,
                                through: { attributes: [] }
                            },
                        ],
                    },
                    {
                        model: models.PointRevision,
                        attributes: ["content", "value", "embed_data", "created_at"],
                        required: false,
                    },
                    {
                        model: models.Audio,
                        required: false,
                        attributes: ["id", "formats", "updated_at", "listenable"],
                        as: "PointAudios",
                    },
                    {
                        model: models.Post,
                        attributes: ["id", "group_id"],
                        required: false,
                    },
                ],
            })
                .then(function (points) {
                if (points) {
                    async.parallel([
                        (parallelCallback) => {
                            models.Point.setVideosForPoints(points, (error) => {
                                parallelCallback(error);
                            });
                        },
                        (parallelCallback) => {
                            models.Point.setOrganizationUsersForPoints(points, (error) => {
                                parallelCallback(error);
                            });
                        },
                    ], (error) => {
                        if (error) {
                            sendPostOrError(res, null, "view", req.user, "Point org users", 404);
                        }
                        else {
                            const pointsInfo = {
                                points: points,
                                count: upCount + downCount,
                            };
                            log.info("Points", {
                                postId: req.params.id,
                                userId: req.user ? req.user.id : -1,
                            });
                            if (redisKey) {
                                req.redisClient.setEx(redisKey, process.env.POINTS_CACHE_TTL
                                    ? parseInt(process.env.POINTS_CACHE_TTL)
                                    : 3, JSON.stringify(pointsInfo));
                            }
                            res.send(pointsInfo);
                        }
                    });
                }
                else {
                    sendPostOrError(res, null, "view", req.user, "Not found", 404);
                }
            })
                .catch(function (error) {
                sendPostOrError(res, null, "view", req.user, error);
            });
        }
    });
};
const shouldDisablePointRedisCache = (req, done) => {
    if (req.user && req.user.id) {
        const newPointRedisKey = `newUserPoint_${req.user.id}`;
        req.redisClient
            .get(newPointRedisKey)
            .then((found) => {
            done(null, found != null);
        })
            .catch((error) => {
            done(error);
        });
    }
    else {
        done(null, false);
    }
};
router.get("/:id/points", auth.can("view post"), function (req, res) {
    const redisKey = "cache:post_points:" +
        req.params.id +
        (req.query.offsetUp ? ":offsetup:" + req.query.offsetUp : "") +
        ":" +
        (req.query.offsetDown ? ":offsetdown:" + req.query.offsetDown : "");
    shouldDisablePointRedisCache(req, (error, disableRedisCache) => {
        if (disableRedisCache || process.env.DISABLE_POST_POINTS_CACHE) {
            sendPostPoints(req, res);
        }
        else {
            req.redisClient
                .get(redisKey)
                .then((points) => {
                if (points) {
                    res.send(JSON.parse(points));
                }
                else {
                    sendPostPoints(req, res, redisKey);
                }
            })
                .catch((error) => {
                sendPostOrError(res, null, "viewPoints", req.user, error);
            });
        }
    });
});
var truthValueFromBody = function (bodyParameter) {
    if (bodyParameter && bodyParameter != "") {
        return true;
    }
    else {
        return false;
    }
};
var updatePostData = function (req, post) {
    if (!post.data) {
        post.set("data", {
            browserId: req.body.postBaseId,
            browserFingerprint: req.body.postValCode,
            browserFingerprintConfidence: req.body.postConf,
            originalQueryString: req.body.originalQueryString,
            userLocale: req.body.userLocale,
            userAutoTranslate: req.body.userAutoTranslate,
            referrer: req.body.referrer,
            url: req.body.url,
            screen_width: req.body.screen_width,
        });
    }
    if (req.body.publicPrivateData) {
        try {
            post.set("data.publicPrivateData", JSON.parse(req.body.publicPrivateData));
        }
        catch (error) {
            log.error("Error in parsing json for publicPrivateData", error);
        }
    }
    if (!post.data.contact) {
        post.set("data.contact", {});
    }
    if (!post.data.attachment) {
        post.set("data.attachment", {});
    }
    if (req.body.contactName ||
        req.body.contactEmail ||
        req.body.contacTelephone) {
        post.set("data.contact.name", req.body.contactName && req.body.contactName != ""
            ? req.body.contactName
            : null);
        post.set("data.contact.email", req.body.contactEmail && req.body.contactEmail != ""
            ? req.body.contactEmail
            : null);
        post.set("data.contact.telephone", req.body.contacTelephone && req.body.contacTelephone != ""
            ? req.body.contacTelephone
            : null);
        post.set("data.contact.address", req.body.contactAddress && req.body.contactAddress != ""
            ? req.body.contactAddress
            : null);
    }
    if (req.body.uploadedDocumentUrl && req.body.uploadedDocumentUrl != "") {
        post.set("data.attachment.url", req.body.uploadedDocumentUrl && req.body.uploadedDocumentUrl != ""
            ? req.body.uploadedDocumentUrl
            : null);
        post.set("data.attachment.filename", req.body.uploadedDocumentFilename &&
            req.body.uploadedDocumentFilename != ""
            ? req.body.uploadedDocumentFilename
            : null);
    }
    if (req.body.deleteAttachment && req.body.deleteAttachment !== "") {
        post.set("data.attachment", {});
    }
    if (!post.public_data) {
        post.set("public_data", {});
    }
    if (req.body.tags && req.body.tags !== "") {
        post.set("public_data.tags", req.body.tags);
    }
    if (req.body.displayUserNameWithIdea &&
        req.body.displayUserNameWithIdea !== "") {
        post.set("public_data.displayUserNameWithIdea", true);
    }
    else if (post.public_data &&
        post.public_data.displayUserNameWithIdea === true) {
        post.set("public_data.displayUserNameWithIdea", false);
    }
    if (req.body.structuredAnswers && req.body.structuredAnswers != "") {
        post.set("public_data.structuredAnswers", req.body.structuredAnswers);
    }
    if (req.body.structuredAnswersJson && req.body.structuredAnswersJson != "") {
        try {
            post.set("public_data.structuredAnswersJson", JSON.parse(req.body.structuredAnswersJson));
        }
        catch (e) {
            log.error("JSON error", { error: e });
        }
    }
};
router.put("/:id/editTranscript", auth.can("edit post"), function (req, res) {
    models.Post.findOne({
        where: {
            id: req.params.id,
        },
    })
        .then((post) => {
        if (post) {
            post.set("public_data.transcript.text", req.body.content);
            post.set("public_data.transcript.userEdited", true);
            post
                .save()
                .then(() => {
                res.sendStatus(200);
            })
                .catch((error) => {
                sendPostOrError(res, req.params.id, "editTranscript", req.user, error, 500);
            });
        }
        else {
            sendPostOrError(res, req.params.id, "editTranscript", req.user, "Not found", 404);
        }
    })
        .catch((error) => {
        sendPostOrError(res, req.params.id, "editTranscript", req.user, error, 500);
    });
});
router.post("/:groupId", auth.can("create post"), async function (req, res) {
    if (!req.user || !req.user.id) {
        try {
            await addAgentFabricUserToSessionIfNeeded(req);
        }
        catch (error) {
            log.error("Could not add agent fabric user to session", {
                context: "create",
                userId: req.user.id,
                error: error,
            });
            res.sendStatus(500);
            return;
        }
    }
    models.Group.findOne({
        where: {
            id: req.params.groupId,
        },
        attributes: ["id", "configuration"],
    })
        .then((group) => {
        var post = models.Post.build({
            name: req.body.name,
            description: req.body.description || "",
            group_id: req.params.groupId,
            category_id: req.body.categoryId != "" ? req.body.categoryId : null,
            location: req.body.location != "" ? JSON.parse(req.body.location) : null,
            cover_media_type: req.body.coverMediaType,
            user_id: req.user.id,
            status: group &&
                group.configuration &&
                group.configuration.allPostsBlockedByDefault === true
                ? "blocked"
                : "published",
            counter_endorsements_up: 1,
            content_type: models.Post.CONTENT_IDEA,
            user_agent: req.useragent.source,
            ip_address: req.clientIp,
        });
        updatePostData(req, post);
        post
            .save()
            .then(function () {
            log.info("Post Created", {
                id: post ? post.id : -1,
                userId: req.user ? req.user.id : -1,
            });
            queue.add("process-similarities", { type: "update-collection", postId: post.id }, "low");
            post.setupAfterSave(req, res, function () {
                post.updateAllExternalCounters(req, "up", "counter_posts", function () {
                    models.Group.addUserToGroupIfNeeded(post.group_id, req, function () {
                        post.setupImages(req.body, function (error) {
                            models.Endorsement.build({
                                post_id: post.id,
                                value: 1,
                                user_id: req.user.id,
                                status: "active",
                                user_agent: req.useragent.source,
                                ip_address: req.clientIp,
                            })
                                .save()
                                .then(function (endorsement) {
                                models.AcActivity.createActivity({
                                    type: "activity.post.new",
                                    userId: post.user_id,
                                    domainId: req.ypDomain.id,
                                    groupId: post.group_id,
                                    //                communityId: req.ypCommunity ?  req.ypCommunity.id : null,
                                    postId: post.id,
                                    access: models.AcActivity.ACCESS_PUBLIC,
                                }, function (error) {
                                    if (!error && post) {
                                        post.setDataValue("newEndorsement", endorsement);
                                        log.info("process-moderation post toxicity in post controller");
                                        queue.add("process-moderation", {
                                            type: "estimate-post-toxicity",
                                            postId: post.id,
                                        }, "high");
                                        queue.add("process-moderation", {
                                            type: "post-review-and-annotate-images",
                                            postId: post.id,
                                        }, "medium");
                                        sendPostOrError(res, post, "setupImages", req.user, error);
                                    }
                                    else {
                                        sendPostOrError(res, post, "setupImages", req.user, error);
                                    }
                                });
                            });
                        });
                    });
                });
            });
        })
            .catch(function (error) {
            sendPostOrError(res, null, "view", req.user, error);
        });
    })
        .catch((error) => {
        sendPostOrError(res, null, "viewGroupNotFound", req.user, error);
    });
});
router.get("/:id/videoTranscriptStatus", auth.can("edit post"), function (req, res) {
    models.Post.findOne({
        where: {
            id: req.params.id,
        },
    })
        .then((post) => {
        if (post && post.public_data && post.public_data.transcript) {
            if (post.public_data.transcript.inProgress === true &&
                post.public_data.transcript.videoId) {
                const timeOutDate = moment().add(-15, "minutes").toDate();
                let startDate;
                if (post.public_data.transcript.inProgressDate) {
                    startDate = moment(post.public_data.transcript.inProgressDate).toDate();
                }
                if (!post.public_data.transcript.inProgressDate ||
                    startDate < timeOutDate) {
                    post.set("public_data.transcript.inProgress", false);
                    post.set("public_data.transcript.error", "Timeout");
                    post
                        .save()
                        .then((savedPost) => {
                        res.send({ error: "Timeout" });
                    })
                        .catch((error) => {
                        sendPostOrError(res, req.params.id, "videoTranscriptStatus", req.user, error, 500);
                    });
                }
                else {
                    models.Video.findOne({
                        where: {
                            id: post.public_data.transcript.videoId,
                        },
                    })
                        .then((video) => {
                        if (video.meta.transcript && video.meta.transcript.text) {
                            post.set("public_data.transcript.inProgress", false);
                            post.set("public_data.transcript.text", video.meta.transcript.text);
                            post
                                .save()
                                .then((savedPost) => {
                                log.info("process-moderation post toxicity after video transcript");
                                queue.add("process-moderation", {
                                    type: "estimate-post-toxicity",
                                    postId: savedPost.id,
                                }, "high");
                                res.send({ text: video.meta.transcript.text });
                            })
                                .catch((error) => {
                                sendPostOrError(res, req.params.id, "videoTranscriptStatus", req.user, error, 500);
                            });
                        }
                        else if (video.meta.transcript &&
                            video.meta.transcript.error) {
                            post.set("public_data.transcript.inProgress", false);
                            post.set("public_data.transcript.error", video.meta.transcript.error);
                            post
                                .save()
                                .then((savedPost) => {
                                res.send({ error: video.meta.transcript.error });
                            })
                                .catch((error) => {
                                sendPostOrError(res, req.params.id, "videoTranscriptStatus", req.user, error, 500);
                            });
                        }
                        else {
                            res.send({ inProgress: true });
                        }
                    })
                        .catch((error) => {
                        sendPostOrError(res, req.params.id, "videoTranscriptStatus", req.user, error, 500);
                    });
                }
            }
            else {
                res.send({ noInProgress: true });
            }
        }
        else {
            sendPostOrError(res, req.params.id, "videoPostTranscriptStatus", req.user, "not found", 404);
        }
    })
        .catch((error) => {
        sendPostOrError(res, req.params.id, "videoPostTranscriptStatus", req.user, error, 500);
    });
});
router.get("/:id/audioTranscriptStatus", auth.can("edit post"), function (req, res) {
    models.Post.findOne({
        where: {
            id: req.params.id,
        },
    })
        .then((post) => {
        if (post && post.public_data && post.public_data.transcript) {
            const timeOutDate = moment().add(-15, "minutes").toDate();
            let startDate;
            if (post.public_data.transcript.inProgressDate) {
                startDate = moment(post.public_data.transcript.inProgressDate).toDate();
            }
            if (!post.public_data.transcript.inProgressDate ||
                startDate < timeOutDate) {
                post.set("public_data.transcript.inProgress", false);
                post.set("public_data.transcript.error", "Timeout");
                post
                    .save()
                    .then((savedPost) => {
                    res.send({ error: "Timeout" });
                })
                    .catch((error) => {
                    sendPostOrError(res, req.params.id, "videoTranscriptStatus", req.user, error, 500);
                });
            }
            else {
                if (post.public_data.transcript.inProgress === true &&
                    post.public_data.transcript.audioId) {
                    models.Audio.findOne({
                        where: {
                            id: post.public_data.transcript.audioId,
                        },
                    })
                        .then((audio) => {
                        if (audio.meta.transcript && audio.meta.transcript.text) {
                            post.set("public_data.transcript.inProgress", false);
                            post.set("public_data.transcript.text", audio.meta.transcript.text);
                            post
                                .save()
                                .then((savedPost) => {
                                log.info("process-moderation post toxicity after audio transcript");
                                queue.add("process-moderation", {
                                    type: "estimate-post-toxicity",
                                    postId: savedPost.id,
                                }, "high");
                                res.send({ text: audio.meta.transcript.text });
                            })
                                .catch((error) => {
                                sendPostOrError(res, req.params.id, "audioTranscriptStatus", req.user, error, 500);
                            });
                        }
                        else if (audio.meta.transcript &&
                            audio.meta.transcript.error) {
                            post.set("public_data.transcript.inProgress", false);
                            post.set("public_data.transcript.error", audio.meta.transcript.error);
                            post
                                .save()
                                .then((savedPost) => {
                                res.send({ error: audio.meta.transcript.error });
                            })
                                .catch((error) => {
                                sendPostOrError(res, req.params.id, "audioTranscriptStatus", req.user, error, 500);
                            });
                        }
                        else {
                            res.send({ inProgress: true });
                        }
                    })
                        .catch((error) => {
                        sendPostOrError(res, req.params.id, "audioTranscriptStatus", req.user, error, 500);
                    });
                }
                else {
                    res.send({ noInProgress: true });
                }
            }
        }
        else {
            sendPostOrError(res, req.params.id, "audioPostTranscriptStatus", req.user, "not found", 404);
        }
    })
        .catch((error) => {
        sendPostOrError(res, req.params.id, "audioPostTranscriptStatus", req.user, error, 500);
    });
});
router.put("/:id", auth.can("edit post"), function (req, res) {
    models.Post.findOne({
        where: {
            id: req.params.id,
        },
    })
        .then(function (post) {
        if (post) {
            post.name = req.body.name;
            post.description = req.body.description;
            post.category_id =
                req.body.categoryId != "" ? req.body.categoryId : null;
            post.location =
                req.body.location != "" ? JSON.parse(req.body.location) : null;
            post.cover_media_type = req.body.coverMediaType;
            updatePostData(req, post);
            post.save().then(function () {
                log.info("Post Update", {
                    post: toJson(post),
                    context: "create",
                    user: toJson(req.user),
                });
                queue.add("process-similarities", { type: "update-collection", postId: post.id }, "low");
                queue.add("process-moderation", { type: "estimate-post-toxicity", postId: post.id }, "high");
                queue.add("process-moderation", { type: "post-review-and-annotate-images", postId: post.id }, "medium");
                post.setupImages(req.body, function (error) {
                    sendPostOrError(res, post, "setupImages", req.user, error);
                });
            });
        }
        else {
            sendPostOrError(res, req.params.id, "update", req.user, "Not found", 404);
        }
    })
        .catch(function (error) {
        sendPostOrError(res, null, "update", req.user, error);
    });
});
router.put("/:id/:groupId/move", auth.can("edit post"), function (req, res) {
    var group, post, communityId, domainId;
    async.series([
        function (callback) {
            models.Group.findOne({
                where: {
                    id: req.params.groupId,
                },
                include: [
                    {
                        model: models.Community,
                        required: true,
                        include: [
                            {
                                model: models.Domain,
                                required: true,
                            },
                        ],
                    },
                ],
            })
                .then(function (groupIn) {
                group = groupIn;
                communityId = group.Community.id;
                domainId = group.Community.Domain.id;
                callback();
            })
                .catch(function (error) {
                callback(error);
            });
        },
        function (callback) {
            models.Post.findOne({
                where: {
                    id: req.params.id,
                },
            })
                .then(function (postIn) {
                post = postIn;
                post.set("group_id", group.id);
                post.save().then(function (results) {
                    console.log("Have changed group id");
                    callback();
                });
            })
                .catch(function (error) {
                callback(error);
            });
        },
        function (callback) {
            models.Point.findAll({
                where: {
                    post_id: post.id,
                    status: "published",
                },
            }).then(function (pointsIn) {
                async.eachSeries(pointsIn, function (point, innerSeriesCallback) {
                    point.set("group_id", group.id);
                    point.set("community_id", communityId);
                    point.set("domain_id", domainId);
                    point.save().then(function () {
                        console.log("Have changed group and all for point: " + point.id);
                        innerSeriesCallback();
                    });
                }, function (error) {
                    callback(error);
                });
            });
        },
        function (callback) {
            models.AcActivity.findAll({
                where: {
                    post_id: post.id,
                },
            })
                .then(function (activities) {
                async.eachSeries(activities, function (activity, innerSeriesCallback) {
                    activity.set("group_id", group.id);
                    activity.set("community_id", communityId);
                    activity.set("domain_id", domainId);
                    activity.save().then(function (results) {
                        console.log("Have changed group and all: " + activity.id);
                        innerSeriesCallback();
                    });
                }, function (error) {
                    callback();
                });
            })
                .catch(function (error) {
                callback(error);
            });
        },
    ], function (error) {
        if (error) {
            sendPostOrError(res, null, "move", req.user, error);
        }
        else {
            log.info("Moved post to group", { postId: post.id, groupId: group.id });
            res.sendStatus(200);
        }
    });
});
router.delete("/:id", auth.can("edit post"), function (req, res) {
    var postId = req.params.id;
    log.info("Post Deleted Got Start", {
        context: "delete",
        user: toJson(req.user),
    });
    models.Post.findOne({
        where: { id: postId },
    })
        .then(function (post) {
        log.info("Post Deleted Got Post", {
            context: "delete",
            user: toJson(req.user),
        });
        post.deleted = true;
        post.save().then(function () {
            log.info("Post Deleted Completed", {
                post: toJson(post),
                context: "delete",
                user: toJson(req.user),
            });
            queue.add("process-similarities", { type: "update-collection", postId: post.id }, "low");
            post.updateAllExternalCounters(req, "down", "counter_posts", function () {
                log.info("Post Deleted Counters updates", {
                    context: "delete",
                    user: toJson(req.user),
                });
                models.Point.count({
                    where: {
                        post_id: post.id,
                    },
                }).then(function (countInfo) {
                    post.updateAllExternalCountersBy(req, "down", "counter_points", countInfo, function () {
                        log.info("Post Deleted Point Counters updates", {
                            numberDeleted: countInfo,
                            context: "delete",
                            user: toJson(req.user),
                        });
                        queue.add("process-deletion", {
                            type: "delete-post-content",
                            postName: post.name,
                            postId: post.id,
                            includePoints: true,
                            userId: req.user.id,
                        }, "critical");
                        res.sendStatus(200);
                    });
                });
            });
        });
    })
        .catch(function (error) {
        sendPostOrError(res, null, "delete", req.user, error);
    });
});
router.delete("/:id/delete_content", auth.can("edit post"), function (req, res) {
    var postId = req.params.id;
    log.info("Post Deleted Got Start", {
        context: "delete",
        user: toJson(req.user),
    });
    models.Post.findOne({
        where: { id: postId },
    })
        .then(function (post) {
        log.info("Post Deleted Post Content", {
            context: "delete",
            user: toJson(req.user),
        });
        queue.add("process-deletion", {
            type: "delete-post-content",
            postName: post.name,
            postId: post.id,
            includePoints: true,
            userId: req.user.id,
            useNotification: true,
            resetCounters: true,
        }, "critical");
        res.sendStatus(200);
    })
        .catch(function (error) {
        sendPostOrError(res, null, "delete", req.user, error);
    });
});
router.delete("/:id/anonymize_content", auth.can("edit post"), function (req, res) {
    var postId = req.params.id;
    log.info("Post Anonymize Got Start", {
        context: "delete",
        user: toJson(req.user),
    });
    getAnonymousUser((error, anonUser) => {
        if (anonUser && !error) {
            models.Post.findOne({
                where: { id: postId },
            })
                .then(function (post) {
                log.info("Post Anonymize Got Post", {
                    context: "delete",
                    user: toJson(req.user),
                });
                post.user_id = anonUser.id;
                post.ip_address = "127.0.0.1";
                post.save().then(function () {
                    log.info("Post Anonymize Completed", {
                        post: toJson(post),
                        context: "delete",
                        user: toJson(req.user),
                    });
                    queue.add("process-anonymization", {
                        type: "anonymize-post-content",
                        postName: post.name,
                        postId: post.id,
                        includePoints: true,
                        userId: req.user.id,
                        useNotification: true,
                    }, "high");
                    res.sendStatus(200);
                });
            })
                .catch(function (error) {
                sendPostOrError(res, null, "delete", req.user, error);
            });
        }
        else {
            log.error("Can't find anonymous user", { error: error });
            res.sendStatus(500);
        }
    });
});
router.post("/:id/endorse", auth.can("vote on post"), async function (req, res) {
    if (!req.user) {
        try {
            await addAgentFabricUserToSessionIfNeeded(req);
        }
        catch (error) {
            log.error("Could not add agent fabric user to session", {
                context: "create",
                userId: req.user.id,
                error: error,
            });
            res.sendStatus(500);
            return;
        }
    }
    var post;
    models.Post.findOne({
        where: {
            id: req.params.id,
        },
        include: [
            {
                model: models.Group,
                attributes: ["id", "configuration"],
            },
        ],
    })
        .then((corePost) => {
        if (corePost) {
            if (corePost.Group.configuration &&
                corePost.Group.configuration.canVote === true) {
                models.Endorsement.findOne({
                    where: {
                        post_id: req.params.id,
                        user_id: req.user.id,
                    },
                    include: [
                        {
                            model: models.Post,
                            attributes: ["id", "group_id"],
                        },
                    ],
                })
                    .then(function (endorsement) {
                    var oldEndorsementValue;
                    if (endorsement) {
                        post = endorsement.Post;
                        if (endorsement.value > 0)
                            oldEndorsementValue = 1;
                        else if (endorsement.value < 0)
                            oldEndorsementValue = -1;
                        endorsement.value = req.body.value;
                        endorsement.status = "active";
                        endorsement.set("data", {
                            browserId: req.body.endorsementBaseId,
                            browserFingerprint: req.body.endorsementValCode,
                            browserFingerprintConfidence: req.body.endorsementConf,
                        });
                    }
                    else {
                        endorsement = models.Endorsement.build({
                            post_id: req.params.id,
                            value: req.body.value,
                            user_id: req.user.id,
                            data: {
                                browserId: req.body.endorsementBaseId,
                                browserFingerprint: req.body.endorsementValCode,
                                browserFingerprintConfidence: req.body.endorsementConf,
                            },
                            status: "active",
                            user_agent: req.useragent.source,
                            ip_address: req.clientIp,
                        });
                    }
                    endorsement.save().then(function () {
                        log.info("Endorsements Created", {
                            endorsementId: endorsement ? endorsement.id : -1,
                            userId: req.user ? req.user.id : -1,
                        });
                        async.series([
                            function (seriesCallback) {
                                if (post) {
                                    endorsement.dataValues.Post = post;
                                    seriesCallback();
                                }
                                else {
                                    models.Post.findOne({
                                        where: { id: endorsement.post_id },
                                        attributes: ["id", "group_id"],
                                    }).then(function (results) {
                                        if (results) {
                                            post = results;
                                            endorsement.dataValues.Post = post;
                                            seriesCallback();
                                        }
                                        else {
                                            seriesCallback("Can't find post");
                                        }
                                    });
                                }
                            },
                            function (seriesCallback) {
                                models.AcActivity.createActivity({
                                    type: endorsement.value > 0
                                        ? "activity.post.endorsement.new"
                                        : "activity.post.opposition.new",
                                    userId: endorsement.user_id,
                                    domainId: req.ypDomain.id,
                                    endorsementId: endorsement.id,
                                    //            communityId: req.ypCommunity ?  req.ypCommunity.id : null,
                                    groupId: post.group_id,
                                    postId: post.id,
                                    access: models.AcActivity.ACCESS_PRIVATE,
                                }, function (error) {
                                    seriesCallback(error);
                                });
                            },
                        ], function (error) {
                            if (error) {
                                log.error("Endorsements Error", {
                                    context: "create",
                                    endorsement: toJson(endorsement),
                                    user: toJson(req.user),
                                    err: error,
                                    errorStatus: 500,
                                });
                                res.sendStatus(500);
                            }
                            else {
                                decrementOldCountersIfNeeded(req, oldEndorsementValue, req.params.id, endorsement, function () {
                                    if (endorsement.value > 0) {
                                        changePostCounter(req, req.params.id, "counter_endorsements_up", 1, function () {
                                            res.send({
                                                endorsement: endorsement,
                                                oldEndorsementValue: oldEndorsementValue,
                                            });
                                        });
                                    }
                                    else if (endorsement.value < 0) {
                                        changePostCounter(req, req.params.id, "counter_endorsements_down", 1, function () {
                                            res.send({
                                                endorsement: endorsement,
                                                oldEndorsementValue: oldEndorsementValue,
                                            });
                                        });
                                    }
                                    else {
                                        log.error("Endorsements Error State", {
                                            context: "create",
                                            endorsement: toJson(endorsement),
                                            user: toJson(req.user),
                                            err: error,
                                            errorStatus: 500,
                                        });
                                        res.sendStatus(500);
                                    }
                                });
                            }
                        });
                    });
                })
                    .catch(function (error) {
                    log.error("Endorsements Error", {
                        context: "create",
                        post: req.params.id,
                        user: toJson(req.user),
                        err: error,
                        errorStatus: 500,
                    });
                    res.sendStatus(500);
                });
            }
            else {
                log.error("Trying to vote but cant", {
                    context: "endorse",
                    post: req.params.id,
                });
                res.sendStatus(401);
            }
        }
        else {
            log.error("Post not found", {
                context: "endorse",
                post: req.params.id,
            });
            res.sendStatus(404);
        }
    })
        .catch((error) => {
        log.error("Endorsements Error", {
            context: "endorse",
            post: req.params.id,
            user: toJson(req.user),
            err: error,
            errorStatus: 500,
        });
        res.sendStatus(500);
    });
});
router.delete("/:id/endorse", auth.can("vote on post"), function (req, res) {
    models.Post.findOne({
        where: {
            id: req.params.id,
        },
        include: [
            {
                model: models.Group,
                attributes: ["id", "configuration"],
            },
        ],
    })
        .then((corePost) => {
        if (corePost) {
            if (corePost.Group.configuration &&
                corePost.Group.configuration.canVote === true) {
                models.Endorsement.findOne({
                    where: { post_id: req.params.id, user_id: req.user.id },
                    include: [
                        {
                            model: models.Post,
                            attributes: ["id", "group_id"],
                        },
                    ],
                })
                    .then(function (endorsement) {
                    if (endorsement) {
                        var oldEndorsementValue;
                        if (endorsement.value > 0)
                            oldEndorsementValue = 1;
                        else if (endorsement.value < 0)
                            oldEndorsementValue = -1;
                        endorsement.value = 0;
                        //endorsement.deleted = true;
                        endorsement.save().then(function () {
                            if (oldEndorsementValue > 0) {
                                changePostCounter(req, req.params.id, "counter_endorsements_up", -1, function () {
                                    res
                                        .status(200)
                                        .send({
                                        endorsement: endorsement,
                                        oldEndorsementValue: oldEndorsementValue,
                                    });
                                });
                            }
                            else if (oldEndorsementValue < 0) {
                                changePostCounter(req, req.params.id, "counter_endorsements_down", -1, function () {
                                    res
                                        .status(200)
                                        .send({
                                        endorsement: endorsement,
                                        oldEndorsementValue: oldEndorsementValue,
                                    });
                                });
                            }
                            else {
                                log.error("Endorsement Strange state", {
                                    context: "delete",
                                    post: req.params.id,
                                    user: toJson(req.user),
                                    err: "Strange state of endorsements",
                                    errorStatus: 500,
                                });
                                res.sendStatus(500);
                            }
                        });
                    }
                    else {
                        log.error("Endorsement Not found", {
                            context: "delete",
                            post: req.params.id,
                            user: toJson(req.user),
                            errorStatus: 404,
                        });
                        res.sendStatus(404);
                    }
                })
                    .catch(function (error) {
                    log.error("Endorsements Error", {
                        context: "delete",
                        post: req.params.id,
                        user: toJson(req.user),
                        err: error,
                        errorStatus: 500,
                    });
                    res.sendStatus(500);
                });
            }
            else {
                log.error("Trying to vote but cant", {
                    context: "endorse",
                    post: req.params.id,
                });
                res.sendStatus(401);
            }
        }
        else {
            log.error("Post not found", {
                context: "endorse",
                post: req.params.id,
            });
            res.sendStatus(404);
        }
    })
        .catch((error) => {
        log.error("Endorsements Error", {
            context: "endorse",
            post: req.params.id,
            user: toJson(req.user),
            err: error,
            errorStatus: 500,
        });
        res.sendStatus(500);
    });
});
router.put("/:postId/plausibleStatsProxy", auth.can("edit post"), async (req, res) => {
    try {
        const plausibleData = await plausibleStatsProxy(req.body.plausibleUrl, {
            postId: req.params.postId,
        });
        res.send(plausibleData);
    }
    catch (error) {
        log.error("Could not get plausibleStatsProxy", {
            err: error,
            context: "getPlausibleSeries",
            user: toJson(req.user.simple()),
        });
        res.sendStatus(500);
    }
});
router.get("/:postId/get_campaigns", auth.can("edit post"), async (req, res) => {
    try {
        const campaigns = await models.Campaign.findAll({
            where: {
                post_id: req.params.postId,
                active: true,
            },
            order: [["created_at", "desc"]],
            attributes: ["id", "configuration"],
        });
        res.send(campaigns);
    }
    catch (error) {
        log.error("Could not get campaigns", {
            err: error,
            context: "get_campaigns",
            user: toJson(req.user.simple()),
        });
        res.sendStatus(500);
    }
});
router.post("/:postId/create_campaign", auth.can("edit post"), async (req, res) => {
    try {
        const campaign = models.Campaign.build({
            post_id: req.params.postId,
            configuration: req.body.configuration,
            user_id: req.user.id,
        });
        await campaign.save();
        //TODO: Toxicity check
        res.send(campaign);
    }
    catch (error) {
        log.error("Could not create_campaign campaigns", {
            err: error,
            context: "create_campaign",
            user: toJson(req.user.simple()),
        });
        res.sendStatus(500);
    }
});
router.put("/:postId/:campaignId/update_campaign", auth.can("edit post"), async (req, res) => {
    try {
        const campaign = await models.Campaign.findOne({
            where: {
                id: req.params.campaignId,
                post_id: req.params.postId,
            },
            attributes: ["id", "configuration"],
        });
        campaign.configuration = req.body.configuration;
        await campaign.save();
        //TODO: Toxicity check
        res.send(campaign);
    }
    catch (error) {
        log.error("Could not create_campaign campaigns", {
            err: error,
            context: "create_campaign",
            user: toJson(req.user.simple()),
        });
        res.sendStatus(500);
    }
});
router.delete("/:postId/:campaignId/delete_campaign", auth.can("edit post"), async (req, res) => {
    try {
        const campaign = await models.Campaign.findOne({
            where: {
                id: req.params.campaignId,
                post_id: req.params.postId,
            },
            attributes: ["id"],
        });
        campaign.deleted = true;
        await campaign.save();
        res.sendStatus(200);
    }
    catch (error) {
        log.error("Could not delete_campaign campaigns", {
            err: error,
            context: "delete_campaign",
            user: toJson(req.user.simple()),
        });
        res.sendStatus(500);
    }
});
module.exports = router;
