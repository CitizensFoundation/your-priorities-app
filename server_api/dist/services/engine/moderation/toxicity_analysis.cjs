"use strict";
const models = require("../../../models/index.cjs");
const async = require("async");
const log = require("../../utils/logger.cjs");
const TOXICITY_THRESHOLD = 0.5;
const TOXICITY_EMAIL_THRESHOLD = 0.75;
const Perspective = require("./perspective_api_client.cjs");
const queue = require("../../workers/queue.cjs");
let perspectiveApi;
if (process.env.GOOGLE_PERSPECTIVE_API_KEY) {
    perspectiveApi = new Perspective({
        apiKey: process.env.GOOGLE_PERSPECTIVE_API_KEY,
        projectId: process.env.GOOGLE_TRANSLATE_PROJECT_ID
            ? process.env.GOOGLE_TRANSLATE_PROJECT_ID
            : undefined,
    });
}
const getToxicityScoreForText = (text, doNotStore, callback) => {
    log.info("getToxicityScoreForText starting", { doNotStore });
    if (text && text !== "") {
        perspectiveApi
            .analyze(text, {
            doNotStore,
            attributes: [
                "TOXICITY",
                "SEVERE_TOXICITY",
                "IDENTITY_ATTACK",
                "THREAT",
                "INSULT",
                "PROFANITY",
                "SEXUALLY_EXPLICIT",
                "FLIRTATION",
                // New experimental attributes
                "AFFINITY_EXPERIMENTAL",
                "COMPASSION_EXPERIMENTAL",
                "CURIOSITY_EXPERIMENTAL",
                "NUANCE_EXPERIMENTAL",
                "PERSONAL_STORY_EXPERIMENTAL",
                "REASONING_EXPERIMENTAL",
                "RESPECT_EXPERIMENTAL",
            ],
        })
            .then((result) => {
            log.info("getToxicityScoreForText results");
            callback(null, result);
        })
            .catch((error) => {
            if (error &&
                error.stack &&
                error.stack.indexOf("ResponseError: Attribute") > -1 &&
                error.stack.indexOf("does not support request languages") > -1) {
                log.warn("getToxicityScoreForText warning", { warning: error });
                callback();
            }
            else {
                log.error("getToxicityScoreForText error", { error });
                callback(error);
            }
        });
    }
    else {
        callback("No text for toxicity score");
    }
};
const setupModelPublicDataScore = (model, text, results) => {
    if (!model.data)
        model.set("data", {});
    if (!model.data.moderation)
        model.set("data.moderation", {});
    model.set("data.moderation.rawToxicityResults", results);
    // Existing attributes
    let toxicityScore, severeToxicityScore, identityAttackScore, threatScore, insultScore, profanityScore, sexuallyExplicitScore, flirtationScore;
    // New attributes
    let affinityScore, compassionScore, curiosityScore, nuanceScore, personalStoryScore, reasoningScore, respectScore;
    try {
        // Existing scores
        toxicityScore = results.attributeScores["TOXICITY"].summaryScore.value;
        severeToxicityScore =
            results.attributeScores["SEVERE_TOXICITY"].summaryScore.value;
        identityAttackScore =
            results.attributeScores["IDENTITY_ATTACK"].summaryScore.value;
        threatScore = results.attributeScores["THREAT"].summaryScore.value;
        insultScore = results.attributeScores["INSULT"].summaryScore.value;
        profanityScore = results.attributeScores["PROFANITY"].summaryScore.value;
        sexuallyExplicitScore =
            results.attributeScores["SEXUALLY_EXPLICIT"].summaryScore.value;
        flirtationScore = results.attributeScores["FLIRTATION"].summaryScore.value;
        affinityScore =
            results.attributeScores["AFFINITY_EXPERIMENTAL"].summaryScore.value;
        compassionScore =
            results.attributeScores["COMPASSION_EXPERIMENTAL"].summaryScore.value;
        curiosityScore =
            results.attributeScores["CURIOSITY_EXPERIMENTAL"].summaryScore.value;
        nuanceScore =
            results.attributeScores["NUANCE_EXPERIMENTAL"].summaryScore.value;
        personalStoryScore =
            results.attributeScores["PERSONAL_STORY_EXPERIMENTAL"].summaryScore.value;
        reasoningScore =
            results.attributeScores["REASONING_EXPERIMENTAL"].summaryScore.value;
        respectScore =
            results.attributeScores["RESPECT_EXPERIMENTAL"].summaryScore.value;
    }
    catch (error) {
        log.error(error);
    }
    model.set("data.moderation.toxicityScore", toxicityScore);
    model.set("data.moderation.severeToxicityScore", severeToxicityScore);
    model.set("data.moderation.identityAttackScore", identityAttackScore);
    model.set("data.moderation.threatScore", threatScore);
    model.set("data.moderation.insultScore", insultScore);
    model.set("data.moderation.profanityScore", profanityScore);
    model.set("data.moderation.sexuallyExplicitScore", sexuallyExplicitScore);
    model.set("data.moderation.flirtationScore", flirtationScore);
    model.set("data.moderation.textUsedForScore", text);
    model.set("data.moderation.affinityScore", affinityScore);
    model.set("data.moderation.compassionScore", compassionScore);
    model.set("data.moderation.curiosityScore", curiosityScore);
    model.set("data.moderation.nuanceScore", nuanceScore);
    model.set("data.moderation.personalStoryScore", personalStoryScore);
    model.set("data.moderation.reasoningScore", reasoningScore);
    model.set("data.moderation.respectScore", respectScore);
};
const hasModelBreachedToxicityThreshold = (model) => {
    if (model.data &&
        model.data.moderation &&
        (model.data.moderation.toxicityScore ||
            model.data.moderation.severeToxicityScore)) {
        if (model.data.moderation.toxicityScore > TOXICITY_THRESHOLD) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
};
const hasModelBreachedToxicityEmailThreshold = (model) => {
    if (model.data &&
        model.data.moderation &&
        (model.data.moderation.toxicityScore ||
            model.data.moderation.severeToxicityScore)) {
        if (model.data.moderation.toxicityScore > TOXICITY_EMAIL_THRESHOLD) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
};
const getTranslatedTextForCollection = (collectionType, model, callback) => {
    let name, content;
    async.parallel([
        (parallelCallback) => {
            const req = {
                query: {
                    textType: collectionType === "community" ? "communityName" : "groupName",
                    targetLanguage: "en",
                },
            };
            models.AcTranslationCache.getTranslation(req, model, (error, translation) => {
                if (error) {
                    parallelCallback(error);
                }
                else {
                    name = translation;
                    parallelCallback();
                }
            });
        },
        (parallelCallback) => {
            const req = {
                query: {
                    textType: collectionType === "community"
                        ? "communityContent"
                        : "groupContent",
                    targetLanguage: "en",
                },
            };
            models.AcTranslationCache.getTranslation(req, model, (error, translation) => {
                if (error) {
                    parallelCallback(error);
                }
                else {
                    content = translation;
                    parallelCallback();
                }
            });
        },
    ], (error) => {
        if (name && content) {
            callback(error, `${name.content} ${content.content}`);
        }
        else {
            log.error("No collection name or content for toxicity!", { error });
            callback(error);
        }
    });
};
const getTranslatedTextForPoint = (point, callback) => {
    const req = {
        query: {
            textType: "pointContent",
            targetLanguage: "en",
        },
    };
    models.AcTranslationCache.getTranslation(req, point, (error, translation) => {
        if (error) {
            callback(error);
        }
        else {
            callback(null, translation);
        }
    });
};
const getTranslatedTextForPost = (post, callback) => {
    let postName, postDescription, postTranscript;
    let postStructuredAnswers = "";
    async.parallel([
        (parallelCallback) => {
            const req = {
                query: {
                    textType: "postName",
                    targetLanguage: "en",
                },
            };
            models.AcTranslationCache.getTranslation(req, post, (error, translation) => {
                if (error) {
                    parallelCallback(error);
                }
                else {
                    postName = translation;
                    parallelCallback();
                }
            });
        },
        (parallelCallback) => {
            const req = {
                query: {
                    textType: "postContent",
                    targetLanguage: "en",
                },
            };
            models.AcTranslationCache.getTranslation(req, post, (error, translation) => {
                if (error) {
                    parallelCallback(error);
                }
                else {
                    postDescription = translation;
                    parallelCallback();
                }
            });
        },
        (parallelCallback) => {
            const req = {
                query: {
                    textType: "postTranscriptContent",
                    targetLanguage: "en",
                },
            };
            models.AcTranslationCache.getTranslation(req, post, (error, translation) => {
                if (error) {
                    log.warn("No text from translate", { error });
                    parallelCallback();
                }
                else {
                    postTranscript = translation;
                    parallelCallback();
                }
            });
        },
        (parallelCallback) => {
            if (post.public_data &&
                post.public_data.structuredAnswersJson &&
                post.public_data.structuredAnswersJson.length > 0) {
                models.AcTranslationCache.getSurveyAnswerTranslations(post.id, "en", (error, translations) => {
                    if (error) {
                        parallelCallback(error);
                    }
                    else if (translations) {
                        const safeTranslations = translations.map((val) => {
                            return typeof val === "string" ? val : String(val);
                        });
                        postStructuredAnswers = safeTranslations.join(". ");
                        parallelCallback();
                    }
                    else {
                        log.warn("No translations for survey answers");
                        parallelCallback();
                    }
                });
            }
            else {
                parallelCallback();
            }
        },
    ], (error) => {
        if (postName && (postDescription || postStructuredAnswers)) {
            callback(error, `${postName.content} ${postDescription ? postDescription.content : ""} ${postStructuredAnswers} ${postTranscript ? postTranscript.content : ""}`);
        }
        else {
            log.error("No postname for toxicity!", { error });
            callback(error);
        }
    });
};
const estimateToxicityScoreForCollection = (options, callback) => {
    if (process.env.GOOGLE_PERSPECTIVE_API_KEY) {
        log.info("getToxicityScoreForText collection preparing", { options });
        const model = options.collectionType === "community" ? models.Community : models.Group;
        let collectionIncludes = [];
        let attributes = [];
        if (options.collectionType === "group") {
            collectionIncludes = [
                {
                    model: models.Community,
                    attributes: ["id", "access", "domain_id"],
                },
            ];
            attributes = ["id", "language", "name", "objectives", "data"];
        }
        else {
            attributes = [
                "id",
                "language",
                "name",
                "domain_id",
                "description",
                "data",
            ];
        }
        model
            .unscoped()
            .findOne({
            where: {
                id: options.collectionId,
            },
            include: collectionIncludes,
            attributes: attributes,
        })
            .then((collection) => {
            if (collection) {
                let doNotStoreValue = collection.access === 0;
                if (options.collectionType === "group" &&
                    collection.Community.access === 0)
                    doNotStoreValue = true;
                let textContent, textUsed, transcriptText;
                textContent = `${collection.name}`;
                if (textContent !== "") {
                    log.info("getToxicityScoreForText collection getting translated text");
                    getTranslatedTextForCollection(options.collectionType, collection, (error, translatedText) => {
                        log.info("getToxicityScoreForText collection got translated text", { translatedText, error });
                        if (error)
                            callback(error);
                        else
                            textUsed = translatedText;
                        getToxicityScoreForText(textUsed, doNotStoreValue, (error, results) => {
                            if (error) {
                                callback(error);
                            }
                            else if (results) {
                                collection.reload().then(() => {
                                    setupModelPublicDataScore(collection, textUsed, results);
                                    collection
                                        .save()
                                        .then(() => {
                                        if (hasModelBreachedToxicityThreshold(collection)) {
                                            collection.report({
                                                disableNotification: !hasModelBreachedToxicityEmailThreshold(collection),
                                            }, "perspectiveAPI", callback);
                                        }
                                        else {
                                            callback();
                                        }
                                    })
                                        .catch((error) => {
                                        callback(error);
                                    });
                                });
                            }
                            else {
                                log.warn("No results from getToxicityScoreForText");
                                callback();
                            }
                        });
                    });
                }
                else {
                    log.warn("getToxicityScoreForText collection No text for toxicity");
                    callback();
                }
            }
            else {
                log.error("getToxicityScoreForText collection could not find collection");
                callback("Could not find collection");
            }
        })
            .catch((error) => {
            log.error("getToxicityScoreForText collection error", { error });
            callback(error);
        });
    }
    else {
        log.warn("getToxicityScoreForText: No API key");
        callback();
    }
};
const estimateToxicityScoreForPost = (options, callback) => {
    if (process.env.GOOGLE_PERSPECTIVE_API_KEY) {
        log.info("getToxicityScoreForText post preparing");
        models.Post.unscoped()
            .findOne({
            where: {
                id: options.postId,
            },
            include: [
                {
                    model: models.Audio,
                    as: "PostAudios",
                    required: false,
                },
                {
                    model: models.Video,
                    as: "PostVideos",
                    required: false,
                },
                {
                    model: models.Group,
                    attributes: ["id", "access"],
                    include: [
                        {
                            model: models.Community,
                            required: true,
                            attributes: ["id", "access"],
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
                {
                    model: models.User,
                    attribues: ["id", "age_group"],
                },
            ],
            attributes: [
                "id",
                "name",
                "description",
                "language",
                "data",
                "group_id",
                "public_data",
                "user_id",
                "user_agent",
                "ip_address",
            ],
        })
            .then((post) => {
            if (post) {
                let doNotStoreValue = post.Group.access === 0 && post.Group.Community.access === 0
                    ? false
                    : true;
                if (post.User.age_group &&
                    (post.User.age_group === "0-12" || post.User.age_group === "0"))
                    doNotStoreValue = true;
                let textContent, textUsed, transcriptText;
                if (post.public_data &&
                    post.public_data.transcript &&
                    post.public_data.transcript.text) {
                    transcriptText = post.public_data.transcript.text;
                }
                textContent = `${post.name} ${post.description} ${transcriptText ? transcriptText : ""}`;
                if (textContent !== "") {
                    log.info("getToxicityScoreForText post getting translated text");
                    getTranslatedTextForPost(post, (error, translatedText) => {
                        //log.info("getToxicityScoreForText post got translated text", { translatedText, error });
                        if (error) {
                            callback(error);
                        }
                        else {
                            textUsed = translatedText;
                            getToxicityScoreForText(textUsed, doNotStoreValue, (error, results) => {
                                if (error) {
                                    callback(error);
                                }
                                else if (results) {
                                    post.reload().then(() => {
                                        setupModelPublicDataScore(post, textUsed, results);
                                        post
                                            .save()
                                            .then(() => {
                                            sendPostAnalyticsEvent(post);
                                            if (hasModelBreachedToxicityThreshold(post)) {
                                                post.report({
                                                    disableNotification: !hasModelBreachedToxicityEmailThreshold(post),
                                                }, "perspectiveAPI", callback);
                                            }
                                            else {
                                                callback();
                                            }
                                        })
                                            .catch((error) => {
                                            callback(error);
                                        });
                                    });
                                }
                                else {
                                    log.warn("No results for toxicity");
                                    callback();
                                }
                            });
                        }
                    });
                }
                else {
                    log.warn("getToxicityScoreForText post No text for toxicity");
                    callback();
                }
            }
            else {
                log.error("getToxicityScoreForText post could not find post");
                callback("Could not find post");
            }
        })
            .catch((error) => {
            log.error("getToxicityScoreForText post error", { error });
            callback(error);
        });
    }
    else {
        log.warn("getToxicityScoreForText: No API key");
        callback();
    }
};
const estimateToxicityScoreForPoint = (options, callback) => {
    if (process.env.GOOGLE_PERSPECTIVE_API_KEY) {
        log.info("getToxicityScoreForText preparing");
        models.Point.unscoped()
            .findOne({
            attributes: [
                "id",
                "language",
                "data",
                "post_id",
                "group_id",
                "user_id",
                "user_agent",
                "ip_address",
            ],
            where: {
                id: options.pointId,
            },
            order: [[models.PointRevision, "created_at", "asc"]],
            include: [
                {
                    model: models.Audio,
                    as: "PointAudios",
                    required: false,
                },
                {
                    model: models.Video,
                    as: "PointVideos",
                    required: false,
                },
                {
                    model: models.Group,
                    attributes: ["id", "access"],
                    required: false,
                    include: [
                        {
                            model: models.Community,
                            required: false,
                            attributes: ["id", "access"],
                            include: [
                                {
                                    model: models.Domain,
                                    required: false,
                                    attributes: ["id"],
                                },
                            ],
                        },
                    ],
                },
                {
                    model: models.PointRevision,
                    attribues: ["id", "content"],
                },
                {
                    model: models.User,
                    attribues: ["id", "age_group"],
                },
            ],
        })
            .then((point) => {
            if (point) {
                let doNotStoreValue = true;
                if (point.Group &&
                    point.Group.access === 0 &&
                    (!point.Group.Community || point.Group.Community.access === 0))
                    doNotStoreValue = false;
                if (point.User &&
                    point.User.age_group &&
                    (point.User.age_group === "0-12" || point.User.age_group === "0"))
                    doNotStoreValue = true;
                let textContent, textUsed;
                textContent =
                    point.PointRevisions[point.PointRevisions.length - 1].content;
                if (textContent && textContent !== "") {
                    log.info("getToxicityScoreForText getting translated text");
                    getTranslatedTextForPoint(point, (error, translatedText) => {
                        //log.info("getToxicityScoreForText got translated text", { translatedText, error });
                        if (error)
                            callback(error);
                        else if (translatedText.content == null)
                            callback("Can't find translatedText.content");
                        else
                            textUsed = translatedText.content;
                        getToxicityScoreForText(textUsed, doNotStoreValue, (error, results) => {
                            if (error) {
                                callback(error);
                            }
                            else if (results) {
                                point.reload().then(() => {
                                    setupModelPublicDataScore(point, textUsed, results);
                                    point
                                        .save()
                                        .then(() => {
                                        sendPointAnalyticsEvent(point);
                                        if (hasModelBreachedToxicityThreshold(point)) {
                                            if (point.post_id) {
                                                models.Post.unscoped()
                                                    .findOne({
                                                    where: {
                                                        id: point.post_id,
                                                    },
                                                    attributes: ["id", "data"],
                                                    include: [
                                                        {
                                                            model: models.Group,
                                                            attributes: ["id"],
                                                            include: [
                                                                {
                                                                    model: models.Community,
                                                                    attributes: ["id"],
                                                                    include: [
                                                                        {
                                                                            model: models.Domain,
                                                                            attributes: ["id"],
                                                                        },
                                                                    ],
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                })
                                                    .then((post) => {
                                                    point.report({
                                                        disableNotification: !hasModelBreachedToxicityEmailThreshold(point),
                                                    }, "perspectiveAPI", post, callback);
                                                })
                                                    .catch((error) => {
                                                    callback(error);
                                                });
                                            }
                                            else {
                                                point.report({
                                                    disableNotification: !hasModelBreachedToxicityEmailThreshold(point),
                                                }, "perspectiveAPI", null, callback);
                                            }
                                        }
                                        else {
                                            callback();
                                        }
                                    })
                                        .catch((error) => {
                                        callback(error);
                                    });
                                });
                            }
                            else {
                                log.warn("No results for toxicity");
                                callback();
                            }
                        });
                    });
                }
                else {
                    log.warn("getToxicityScoreForText No text for toxicity");
                    callback();
                }
            }
            else {
                log.error("getToxicityScoreForText could not find point");
                callback("Could not find point");
            }
        })
            .catch((error) => {
            log.error("getToxicityScoreForText error", { error });
            callback(error);
        });
    }
    else {
        log.warn("getToxicityScoreForText: No Google API key");
        callback();
    }
};
const sendPostAnalyticsEvent = (post) => {
    try {
        if (post.data &&
            post.data.moderation &&
            post.data.moderation.toxicityScore) {
            const moderationScore = JSON.parse(JSON.stringify(post.data.moderation));
            moderationScore.rawToxicityResults = undefined;
            moderationScore.textUsedForScore = undefined;
            const analyticsEvent = {
                postId: post.id,
                groupId: post.Group.id,
                communityId: post.Group.Community.id,
                domainId: post.Group.Community.Domain.id,
                userId: post.user_id,
                body: {
                    type: "evaluated - post toxicity",
                    useTypeNameUnchanged: true,
                    originalQueryString: post.data.originalQueryString,
                    userLocale: post.data.userLocale,
                    userAutoTranslate: post.data.userAutoTranslate,
                    referrer: post.data.referrer || "",
                    url: post.data.url || "",
                    screen_width: post.data.screen_width || "1200",
                    props: moderationScore,
                    user_agent: post.user_agent || "Internal systems",
                    ipAddress: post.ip_address || "127.0.0.1",
                    server_timestamp: Date.now(),
                },
            };
            if (hasModelBreachedToxicityEmailThreshold(post)) {
                analyticsEvent.body.type = "evaluated - post toxicity high";
            }
            else if (hasModelBreachedToxicityThreshold(post)) {
                analyticsEvent.body.type = "evaluated - post toxicity medium";
            }
            else {
                analyticsEvent.body.type = "evaluated - post toxicity low";
            }
            queue.add("delayed-job", { type: "create-activity-from-app", workData: analyticsEvent }, "medium");
        }
    }
    catch (error) {
        log.error(error);
    }
};
const sendPointAnalyticsEvent = (point) => {
    try {
        if (point.data &&
            point.data.moderation &&
            point.data.moderation.toxicityScore) {
            const moderationScore = JSON.parse(JSON.stringify(point.data.moderation));
            moderationScore.rawToxicityResults = undefined;
            moderationScore.textUsedForScore = undefined;
            const analyticsEvent = {
                postId: point.post_id,
                groupId: point.Group.id,
                communityId: point.Group.Community.id,
                domainId: point.Group.Community.Domain.id,
                userId: point.user_id,
                pointId: point.id,
                body: {
                    useTypeNameUnchanged: true,
                    originalQueryString: point.data.originalQueryString,
                    userLocale: point.data.userLocale,
                    userAutoTranslate: point.data.userAutoTranslate,
                    referrer: point.data.referrer || "",
                    url: point.data.url || "",
                    screen_width: point.data.screen_width || "1200",
                    props: moderationScore,
                    user_agent: point.user_agent || "Internal systems",
                    ipAddress: point.ip_address || "127.0.0.1",
                    server_timestamp: Date.now(),
                },
            };
            if (hasModelBreachedToxicityEmailThreshold(point)) {
                analyticsEvent.body.type = "evaluated - point toxicity high";
            }
            else if (hasModelBreachedToxicityThreshold(point)) {
                analyticsEvent.body.type = "evaluated - point toxicity medium";
            }
            else {
                analyticsEvent.body.type = "evaluated - point toxicity low";
            }
            queue.add("delayed-job", { type: "create-activity-from-app", workData: analyticsEvent }, "medium");
        }
    }
    catch (error) {
        log.error(error);
    }
};
module.exports = {
    estimateToxicityScoreForPoint,
    estimateToxicityScoreForPost,
    estimateToxicityScoreForCollection,
};
