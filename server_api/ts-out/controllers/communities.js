"use strict";
var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var _ = require('lodash');
var async = require('async');
var crypto = require("crypto");
var queue = require('../active-citizen/workers/queue');
const getAllModeratedItemsByCommunity = require('../active-citizen/engine/moderation/get_moderation_items').getAllModeratedItemsByCommunity;
const performSingleModerationAction = require('../active-citizen/engine/moderation/process_moderation_items').performSingleModerationAction;
const getLoginsExportDataForCommunity = require('../utils/export_utils').getLoginsExportDataForCommunity;
const getUsersForCommunity = require('../utils/export_utils').getUsersForCommunity;
var sanitizeFilename = require("sanitize-filename");
var moment = require('moment');
var multer = require('multer');
var multerMultipartResolver = multer({ dest: 'uploads/' }).single('file');
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');
const { getMapForCommunity } = require("../utils/community_mapping_tools");
const { getPlausibleStats, plausibleStatsProxy } = require("../active-citizen/engine/analytics/plausible/manager");
const { countAllModeratedItemsByCommunity } = require("../active-citizen/engine/moderation/get_moderation_items");
const { isValidDbId } = require("../utils/is_valid_db_id");
const { copyGroup, copyCommunity } = require("../utils/copy_utils");
const { recountCommunity } = require("../utils/recount_utils");
const getFromAnalyticsApi = require('../active-citizen/engine/analytics/manager').getFromAnalyticsApi;
const triggerSimilaritiesTraining = require('../active-citizen/engine/analytics/manager').triggerSimilaritiesTraining;
const sendBackAnalyticsResultsOrError = require('../active-citizen/engine/analytics/manager').sendBackAnalyticsResultsOrError;
const countModelRowsByTimePeriod = require('../active-citizen/engine/analytics/statsCalc').countModelRowsByTimePeriod;
const getCommunityIncludes = require('../active-citizen/engine/analytics/statsCalc').getCommunityIncludes;
const getPointCommunityIncludes = require('../active-citizen/engine/analytics/statsCalc').getPointCommunityIncludes;
const getParsedSimilaritiesContent = require('../active-citizen/engine/analytics/manager').getParsedSimilaritiesContent;
const getTranslatedTextsForCommunity = require('../active-citizen/utils/translation_helpers').getTranslatedTextsForCommunity;
const updateTranslationForCommunity = require('../active-citizen/utils/translation_helpers').updateTranslationForCommunity;
var sendCommunityOrError = function (res, community, context, user, error, errorStatus) {
    if (error || !community) {
        if (errorStatus === 404 || (error && error.message && error.message.indexOf("invalid input syntax for type integer") > -1)) {
            log.warn("Community Not Found", { context: context, community: toJson(community), user: toJson(user), err: error,
                errorStatus: 404 });
            errorStatus = 404;
        }
        else {
            log.error("Community Error", { context: context, community: toJson(community), user: toJson(user), err: error,
                errorStatus: errorStatus ? errorStatus : 500 });
        }
        if (errorStatus) {
            res.sendStatus(errorStatus);
        }
        else {
            res.sendStatus(500);
        }
    }
    else {
        res.send(community);
    }
};
var getCommunityFolder = function (req, communityFolderId, done) {
    var communityFolder, openCommunities, combinedCommunities;
    async.series([
        function (seriesCallback) {
            models.Community.findOne({
                where: {
                    id: communityFolderId
                },
                attributes: models.Community.defaultAttributesPublic,
                order: [
                    [{ model: models.Image, as: 'CommunityLogoImages' }, 'created_at', 'asc'],
                    [{ model: models.Image, as: 'CommunityHeaderImages' }, 'created_at', 'asc']
                ],
                include: [
                    {
                        model: models.Image,
                        as: 'CommunityLogoImages',
                        attributes: models.Image.defaultAttributesPublic,
                        required: false
                    },
                    {
                        model: models.Domain,
                        required: true,
                        attributes: models.Domain.defaultAttributesPublic
                    },
                    {
                        model: models.Community,
                        as: 'CommunityFolders',
                        attributes: ['id', 'name', 'counter_users', 'counter_posts', 'counter_groups'],
                        required: false,
                    },
                    {
                        model: models.Image,
                        as: 'CommunityHeaderImages',
                        attributes: models.Image.defaultAttributesPublic,
                        required: false
                    },
                    {
                        model: models.Community,
                        required: false,
                        as: 'CommunityFolder',
                        attributes: ['id', 'name', 'description']
                    }
                ]
            }).then(function (community) {
                communityFolder = community;
                seriesCallback(null);
                return null;
            }).catch(function (error) {
                seriesCallback(error);
            });
        },
        function (seriesCallback) {
            models.Community.findAll({
                where: {
                    access: {
                        $ne: models.Community.ACCESS_SECRET
                    },
                    status: {
                        $ne: 'hidden'
                    },
                    in_community_folder_id: communityFolderId
                },
                attributes: models.Community.defaultAttributesPublic,
                order: [
                    ['counter_users', 'desc'],
                    [{ model: models.Image, as: 'CommunityLogoImages' }, 'created_at', 'asc']
                ],
                include: [
                    {
                        model: models.Image,
                        as: 'CommunityLogoImages',
                        attributes: models.Image.defaultAttributesPublic,
                        required: false
                    },
                    {
                        model: models.Domain,
                        required: true,
                        attributes: models.Domain.defaultAttributesPublic
                    },
                    {
                        model: models.Community,
                        as: 'CommunityFolders',
                        attributes: ['id', 'name', 'counter_users', 'counter_posts', 'counter_groups'],
                        required: false,
                    },
                    {
                        model: models.Community,
                        required: false,
                        as: 'CommunityFolder',
                        attributes: ['id', 'name', 'description']
                    },
                    {
                        model: models.Image,
                        as: 'CommunityHeaderImages',
                        attributes: models.Image.defaultAttributesPublic,
                        required: false
                    }
                ]
            }).then(function (communities) {
                openCommunities = communities;
                seriesCallback(null);
                return null;
            }).catch(function (error) {
                seriesCallback(error);
            });
        },
        function (seriesCallback) {
            if (req.user) {
                var adminCommunities, userCommunities;
                async.parallel([
                    function (parallelCallback) {
                        models.Community.findAll({
                            where: {
                                in_community_folder_id: communityFolderId
                            },
                            attributes: models.Community.defaultAttributesPublic,
                            order: [
                                ['counter_users', 'desc'],
                                [{ model: models.Image, as: 'CommunityLogoImages' }, 'created_at', 'asc']
                            ],
                            include: [
                                {
                                    model: models.Image, as: 'CommunityLogoImages',
                                    attributes: models.Image.defaultAttributesPublic,
                                    required: false
                                },
                                {
                                    model: models.Image, as: 'CommunityHeaderImages',
                                    attributes: models.Image.defaultAttributesPublic,
                                    required: false
                                },
                                {
                                    model: models.Community,
                                    as: 'CommunityFolders',
                                    attributes: ['id', 'name', 'counter_users', 'counter_posts', 'counter_groups'],
                                    required: false,
                                },
                                {
                                    model: models.Domain,
                                    required: true,
                                    attributes: models.Domain.defaultAttributesPublic
                                },
                                {
                                    model: models.Community,
                                    required: false,
                                    as: 'CommunityFolder',
                                    attributes: ['id', 'name', 'description']
                                },
                                {
                                    model: models.User,
                                    as: 'CommunityAdmins',
                                    attributes: ['id'],
                                    required: true,
                                    where: {
                                        id: req.user.id
                                    }
                                }
                            ]
                        }).then(function (communities) {
                            adminCommunities = communities;
                            parallelCallback();
                        }).catch(function (error) {
                            parallelCallback(error);
                        });
                    },
                    function (parallelCallback) {
                        models.Community.findAll({
                            where: {
                                in_community_folder_id: communityFolderId
                            },
                            attributes: models.Community.defaultAttributesPublic,
                            order: [
                                ['counter_users', 'desc'],
                                [{ model: models.Image, as: 'CommunityLogoImages' }, 'created_at', 'asc']
                            ],
                            include: [
                                {
                                    model: models.Image, as: 'CommunityLogoImages',
                                    attributes: models.Image.defaultAttributesPublic,
                                    required: false
                                },
                                {
                                    model: models.Image, as: 'CommunityHeaderImages',
                                    attributes: models.Image.defaultAttributesPublic,
                                    required: false
                                },
                                {
                                    model: models.Community,
                                    required: false,
                                    as: 'CommunityFolder',
                                    attributes: ['id', 'name', 'description']
                                },
                                {
                                    model: models.User,
                                    as: 'CommunityUsers',
                                    attributes: ['id'],
                                    required: true,
                                    where: {
                                        id: req.user.id
                                    }
                                }
                            ]
                        }).then(function (communities) {
                            userCommunities = communities;
                            parallelCallback();
                        }).catch(function (error) {
                            parallelCallback(error);
                        });
                    }
                ], function (error) {
                    combinedCommunities = _.concat(userCommunities, openCommunities);
                    combinedCommunities = _.concat(adminCommunities, combinedCommunities);
                    combinedCommunities = _.uniqBy(combinedCommunities, function (community) {
                        return community.id;
                    });
                    seriesCallback(error);
                });
            }
            else {
                combinedCommunities = openCommunities;
                seriesCallback();
            }
        }
    ], function (error) {
        if (communityFolder) {
            communityFolder.dataValues.Communities = combinedCommunities;
        }
        done(error, communityFolder);
    });
};
var getCommunityAndUser = function (communityId, userId, userEmail, callback) {
    var user, community;
    async.series([
        function (seriesCallback) {
            models.Community.findOne({
                where: {
                    id: communityId
                },
                attributes: models.Community.defaultAttributesPublic,
            }).then(function (communityIn) {
                if (communityIn) {
                    community = communityIn;
                }
                seriesCallback();
            }).catch(function (error) {
                seriesCallback(error);
            });
        },
        function (seriesCallback) {
            if (userId) {
                models.User.findOne({
                    where: {
                        id: userId
                    },
                    attributes: ['id', 'email', 'name', 'created_at']
                }).then(function (userIn) {
                    if (userIn) {
                        user = userIn;
                    }
                    seriesCallback();
                }).catch(function (error) {
                    seriesCallback(error);
                });
            }
            else {
                seriesCallback();
            }
        },
        function (seriesCallback) {
            if (userEmail) {
                models.User.findOne({
                    where: {
                        email: userEmail
                    },
                    attributes: ['id', 'email', 'name', 'created_at']
                }).then(function (userIn) {
                    if (userIn) {
                        user = userIn;
                    }
                    seriesCallback();
                }).catch(function (error) {
                    seriesCallback(error);
                });
            }
            else {
                seriesCallback();
            }
        }
    ], function (error) {
        if (error) {
            callback(error);
        }
        else {
            callback(null, community, user);
        }
    });
};
const getCommunity = function (req, done) {
    var community;
    log.info("getCommunity");
    async.series([
        function (seriesCallback) {
            models.Community.findOne({
                where: { id: req.params.id },
                order: [
                    [{ model: models.Image, as: 'CommunityLogoImages' }, 'created_at', 'asc'],
                    [{ model: models.Image, as: 'CommunityHeaderImages' }, 'created_at', 'asc']
                ],
                attributes: models.Community.defaultAttributesPublic,
                include: [
                    {
                        model: models.Domain,
                        attributes: models.Domain.defaultAttributesPublic
                    },
                    {
                        model: models.Image,
                        as: 'CommunityLogoImages',
                        attributes: models.Image.defaultAttributesPublic,
                        required: false
                    },
                    {
                        model: models.Image,
                        as: 'CommunityHeaderImages',
                        attributes: models.Image.defaultAttributesPublic,
                        required: false
                    },
                    {
                        model: models.Community,
                        required: false,
                        as: 'CommunityFolder',
                        attributes: ['id', 'name', 'description']
                    }
                ]
            }).then(function (communityIn) {
                community = communityIn;
                if (community) {
                    log.info('Community Viewed', { communityId: community.id, userId: req.user ? req.user.id : -1 });
                    models.Community.addVideosToCommunity(community, error => {
                        seriesCallback(error);
                    });
                }
                else {
                    seriesCallback("Not found");
                }
                return null;
            }).catch(function (error) {
                seriesCallback(error);
            });
        },
        function (seriesCallback) {
            const redisKey = "cache:community_groups:" + community.id + `:${req.user ? req.user.id : 0}`;
            req.redisClient.get(redisKey).then(groups => {
                if (groups) {
                    community.dataValues.Groups = JSON.parse(groups);
                    seriesCallback();
                }
                else {
                    models.Group.findAll({
                        where: {
                            community_id: community.id,
                            access: {
                                $ne: models.Group.ACCESS_SECRET
                            },
                            status: {
                                $ne: 'hidden'
                            },
                            in_group_folder_id: {
                                $eq: null
                            }
                        },
                        attributes: models.Group.defaultAttributesPublic,
                        required: false,
                        order: [
                            ['counter_users', 'desc'],
                        ],
                        include: models.Group.masterGroupIncludes(models)
                    }).then(function (groups) {
                        models.Group.addVideosAndCommunityLinksToGroups(groups, videoError => {
                            community.dataValues.Groups = groups;
                            req.redisClient.setEx(redisKey, process.env.GROUPS_CACHE_TTL ? parseInt(process.env.GROUPS_CACHE_TTL) : 3, JSON.stringify(groups));
                            seriesCallback(videoError);
                        });
                    }).catch(error => {
                        seriesCallback(error);
                    });
                }
            }).catch(error => {
                seriesCallback(error);
            });
        },
        function (seriesCallback) {
            if (req.user && community) {
                var adminGroups, userGroups;
                async.parallel([
                    function (parallelCallback) {
                        models.Group.findAll({
                            where: {
                                community_id: community.id,
                                in_group_folder_id: {
                                    $eq: null
                                }
                            },
                            attributes: models.Group.defaultAttributesPublic,
                            order: [
                                ['counter_users', 'desc'],
                            ],
                            include: [
                                {
                                    model: models.User,
                                    as: 'GroupAdmins',
                                    attributes: ['id'],
                                    required: true,
                                    where: {
                                        id: req.user.id
                                    }
                                }
                            ].concat(models.Group.masterGroupIncludes(models))
                        }).then(function (groups) {
                            adminGroups = groups;
                            parallelCallback(null, "admin");
                        }).catch(function (error) {
                            parallelCallback(error);
                        });
                    },
                    function (parallelCallback) {
                        models.Group.findAll({
                            where: {
                                community_id: community.id,
                                in_group_folder_id: {
                                    $eq: null
                                }
                            },
                            attributes: models.Group.defaultAttributesPublic,
                            order: [
                                ['counter_users', 'desc'],
                            ],
                            include: [
                                {
                                    model: models.User,
                                    as: 'GroupUsers',
                                    attributes: ['id'],
                                    required: true,
                                    where: {
                                        id: req.user.id
                                    }
                                }
                            ].concat(models.Group.masterGroupIncludes(models))
                        }).then(function (groups) {
                            userGroups = groups;
                            parallelCallback(null, "users");
                        }).catch(function (error) {
                            parallelCallback(error);
                        });
                    }
                ], function (error) {
                    if (error) {
                        seriesCallback(error);
                    }
                    else {
                        var combinedGroups = _.concat(userGroups, community.dataValues.Groups);
                        if (adminGroups) {
                            combinedGroups = _.concat(adminGroups, combinedGroups);
                        }
                        combinedGroups = _.uniqBy(combinedGroups, function (group) {
                            if (!group) {
                                log.error("Can't find group in combinedGroups", { combinedGroupsL: combinedGroups.length, err: "Cant find group in combinedGroups" });
                                return null;
                            }
                            else {
                                return group.id;
                            }
                        });
                        combinedGroups.forEach(group => {
                            if (group.GroupLogoImages) {
                                group.GroupLogoImages = _.orderBy(group.GroupLogoImages, ['created_at'], ['asc']);
                            }
                            if (group.GroupHeaderImages) {
                                group.GroupHeaderImages = _.orderBy(group.GroupHeaderImages, ['created_at'], ['asc']);
                            }
                            if (group.Category && group.Category.CategoryIconImages) {
                                group.Category.CategoryIconImages = _.orderBy(group.Category.CategoryIconImages, ['updated_at'], ['asc']);
                            }
                            if (group.Categories) {
                                group.Categories = _.orderBy(group.Categories, ['name'], ['asc']);
                            }
                        });
                        models.Group.addVideosAndCommunityLinksToGroups(combinedGroups, videoError => {
                            community.dataValues.Groups = combinedGroups;
                            seriesCallback(videoError);
                        });
                    }
                });
            }
            else {
                models.Group.addVideosAndCommunityLinksToGroups(community.dataValues.Groups, videoError => {
                    seriesCallback(videoError);
                });
            }
        }
    ], function (error) {
        log.error("getCommunity", { error: error });
        done(error, community);
    });
};
var truthValueFromBody = function (bodyParameter) {
    return (bodyParameter && bodyParameter !== "");
};
var updateCommunityConfigParameters = function (req, community) {
    if (!community.configuration) {
        community.set('configuration', {});
    }
    community.set('configuration.alternativeHeader', (req.body.alternativeHeader && req.body.alternativeHeader != "") ? req.body.alternativeHeader : null);
    community.set('configuration.disableDomainUpLink', (req.body.disableDomainUpLink && req.body.disableDomainUpLink != "") ? true : false);
    community.set('configuration.defaultLocationLongLat', (req.body.defaultLocationLongLat && req.body.defaultLocationLongLat != "") ? req.body.defaultLocationLongLat : null);
    community.set('configuration.facebookPixelId', (req.body.facebookPixelId && req.body.facebookPixelId != "") ? req.body.facebookPixelId : null);
    community.set('configuration.disableNameAutoTranslation', (req.body.disableNameAutoTranslation && req.body.disableNameAutoTranslation != "") ? true : false);
    community.set('configuration.redirectToGroupId', (req.body.redirectToGroupId && req.body.redirectToGroupId != "") ? req.body.redirectToGroupId : null);
    community.set('configuration.customBackURL', (req.body.customBackURL && req.body.customBackURL != "") ? req.body.customBackURL : null);
    community.set('configuration.customBackName', (req.body.customBackName && req.body.customBackName != "") ? req.body.customBackName : null);
    community.set('configuration.welcomeHTML', (req.body.welcomeHTML && req.body.welcomeHTML != "") ? req.body.welcomeHTML : null);
    community.set('configuration.externalId', (req.body.externalId && req.body.externalId != "") ? req.body.externalId : null);
    community.set('configuration.communityId', (req.body.communityId && req.body.communityId != "") ? req.body.communityId : null);
    community.set('configuration.customSamlDeniedMessage', (req.body.customSamlDeniedMessage && req.body.customSamlDeniedMessage != "") ? req.body.customSamlDeniedMessage : null);
    community.set('configuration.customSamlLoginMessage', (req.body.customSamlLoginMessage && req.body.customSamlLoginMessage != "") ? req.body.customSamlLoginMessage : null);
    community.set('configuration.forceSecureSamlLogin', truthValueFromBody(req.body.forceSecureSamlLogin));
    community.set('configuration.hideRecommendationOnNewsFeed', truthValueFromBody(req.body.hideRecommendationOnNewsFeed));
    community.set('configuration.closeNewsfeedSubmissions', truthValueFromBody(req.body.closeNewsfeedSubmissions));
    community.set('configuration.useCommunityIdForAnalytics', truthValueFromBody(req.body.useCommunityIdForAnalytics));
    community.set('configuration.disableGroupDynamicFontSizes', truthValueFromBody(req.body.disableGroupDynamicFontSizes));
    community.set('configuration.hideGroupListCardObjectives', truthValueFromBody(req.body.hideGroupListCardObjectives));
    community.set('configuration.recalculateCountersRecursively', truthValueFromBody(req.body.recalculateCountersRecursively));
    if (req.body.google_analytics_code && req.body.google_analytics_code != "") {
        community.google_analytics_code = req.body.google_analytics_code;
    }
    else {
        community.google_analytics_code = null;
    }
    community.only_admins_can_create_groups = req.body.onlyAdminsCanCreateGroups ? true : false;
    if (req.body.defaultLocale && req.body.defaultLocale != "") {
        community.default_locale = req.body.defaultLocale;
    }
    community.theme_id = req.body.themeId ? parseInt(req.body.themeId) : null;
    if (req.body.status && req.body.status != "") {
        community.status = req.body.status;
    }
    if (truthValueFromBody(req.body.appHomeScreenIconImageId)) {
        community.set('configuration.appHomeScreenIconImageId', req.body.appHomeScreenIconImageId);
    }
    const theme = (req.body.theme && req.body.theme != "") ? req.body.theme : null;
    if (theme) {
        try {
            const cleaned = theme.trim().replace(/\n/g, '').replace(/\r/g, '');
            const parsedJson = JSON.parse(cleaned);
            community.set('configuration.theme', parsedJson);
        }
        catch (error) {
            community.set('configuration.theme', null);
            log.error("Error in parsing theme", { error });
        }
    }
    else {
        community.set('configuration.theme', null);
    }
    community.set('configuration.appHomeScreenShortName', (req.body.appHomeScreenShortName && req.body.appHomeScreenShortName != null) ? req.body.appHomeScreenShortName : null);
    community.set('configuration.signupTermsPageId', (req.body.signupTermsPageId && req.body.signupTermsPageId != "") ? req.body.signupTermsPageId : null);
    community.set('configuration.welcomePageId', (req.body.welcomePageId && req.body.welcomePageId != "") ? req.body.welcomePageId : null);
    community.set('configuration.useVideoCover', truthValueFromBody(req.body.useVideoCover));
    community.set('configuration.hideAllTabs', truthValueFromBody(req.body.hideAllTabs));
    community.set('configuration.alwaysShowOnDomainPage', truthValueFromBody(req.body.alwaysShowOnDomainPage));
    community.set('configuration.useReadMoreForDescription', truthValueFromBody(req.body.useReadMoreForDescription));
    community.set('configuration.hideLogoBoxExceptOnMobile', truthValueFromBody(req.body.hideLogoBoxExceptOnMobile));
    community.set('configuration.hideInfoBoxExceptForAdmins', truthValueFromBody(req.body.hideInfoBoxExceptForAdmins));
    community.set('configuration.hideLogoBoxShadow', truthValueFromBody(req.body.hideLogoBoxShadow));
    community.set('configuration.muteNotificationsForEndorsements', truthValueFromBody(req.body.muteNotificationsForEndorsements));
    community.set('configuration.useTextOnlyInfoBox', truthValueFromBody(req.body.useTextOnlyInfoBox));
    const ltpConfigText = (req.body.ltp && req.body.ltp != "") ? req.body.ltp : null;
    if (ltpConfigText) {
        try {
            const cleaned = ltpConfigText.trim().replace(/\n/g, '').replace(/\r/g, '');
            const parsedJson = JSON.parse(cleaned);
            community.set('configuration.ltp', parsedJson);
        }
        catch (error) {
            community.set('configuration.ltp', null);
            log.error("Error in parsing ltp", { error });
        }
    }
    else {
        community.set('configuration.ltp', null);
    }
    community.set('configuration.themeOverrideColorPrimary', (req.body.themeOverrideColorPrimary && req.body.themeOverrideColorPrimary != "") ? req.body.themeOverrideColorPrimary : null);
    community.set('configuration.themeOverrideColorAccent', (req.body.themeOverrideColorAccent && req.body.themeOverrideColorAccent != "") ? req.body.themeOverrideColorAccent : null);
    community.set('configuration.themeOverrideBackgroundColor', (req.body.themeOverrideBackgroundColor && req.body.themeOverrideBackgroundColor != "") ? req.body.themeOverrideBackgroundColor : null);
    community.set('configuration.sortBySortOrder', truthValueFromBody(req.body.sortBySortOrder));
    community.set('configuration.orderByRandom', truthValueFromBody(req.body.orderByRandom));
    community.set('configuration.enableFraudDetection', truthValueFromBody(req.body.enableFraudDetection));
    community.set('configuration.useZiggeo', truthValueFromBody(req.body.useZiggeo));
    community.set('configuration.highlightedLanguages', (req.body.highlightedLanguages && req.body.highlightedLanguages != "") ? req.body.highlightedLanguages : null);
    community.set('configuration.actAsLinkToExternalYPSite', (req.body.actAsLinkToExternalYPSite && req.body.actAsLinkToExternalYPSite != "") ? req.body.actAsLinkToExternalYPSite : null);
    community.set('configuration.registrationQuestions', (req.body.registrationQuestions && req.body.registrationQuestions != "") ? req.body.registrationQuestions : null);
    if (community.configuration.registrationQuestions) {
        try {
            const cleaned = community.configuration.registrationQuestions.trim().replace(/\n/g, '').replace(/\r/g, '').replace(/"/, '"');
            const jsonArray = JSON.parse(cleaned);
            community.set('configuration.registrationQuestionsJson', jsonArray);
        }
        catch (error) {
            community.set('configuration.registrationQuestionsJson', null);
            log.error("Error in parsing registrationQuestions", { error });
        }
    }
    else {
        community.set('configuration.registrationQuestionsJson', null);
    }
};
router.get('/:communityFolderId/communityFolders', auth.can('view community'), function (req, res) {
    getCommunityFolder(req, req.params.communityFolderId, function (error, communityFolder) {
        if (error) {
            log.error('Could not get communityFolder', { err: error, communityFolderId: req.params.communityFolderId, user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(500);
        }
        else if (communityFolder) {
            res.send(communityFolder);
        }
        else {
            res.sendStatus(404);
        }
    });
});
router.delete('/:communityId/:activityId/delete_activity', auth.can('edit community'), function (req, res) {
    models.AcActivity.findOne({
        where: {
            community_id: req.params.communityId,
            id: req.params.activityId
        }
    }).then(function (activity) {
        activity.deleted = true;
        activity.save().then(function () {
            res.send({ activityId: activity.id });
        });
    }).catch(function (error) {
        log.error('Could not delete activity for community', {
            err: error,
            context: 'delete_activity',
            user: toJson(req.user.simple())
        });
        res.sendStatus(500);
    });
});
router.delete('/:communityId/user_membership', auth.isLoggedInNoAnonymousCheck, auth.can('view community'), function (req, res) {
    getCommunityAndUser(req.params.communityId, req.user.id, null, function (error, community, user) {
        if (error) {
            log.error('Could not remove user', { err: error, communityId: req.params.communityId, userRemovedId: req.user.id, context: 'user_membership', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else if (user && community) {
            community.removeCommunityUsers(user).then(function (results) {
                log.info('User removed', { context: 'user_membership', communityId: req.params.communityId, userRemovedId: req.user.id, user: toJson(req.user.simple()) });
                res.send({ membershipValue: false, name: community.name });
            });
        }
        else {
            res.sendStatus(404);
        }
    });
});
router.post('/:communityId/user_membership', auth.isLoggedInNoAnonymousCheck, auth.can('view community'), function (req, res) {
    getCommunityAndUser(req.params.communityId, req.user.id, null, function (error, community, user) {
        if (error) {
            log.error('Could not add user', { err: error, communityId: req.params.communityId, userRemovedId: req.user.id, context: 'user_membership', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else if (user && community) {
            community.addCommunityUsers(user).then(function (results) {
                log.info('User Added', { context: 'user_membership', communityId: req.params.communityId, userRemovedId: req.user.id, user: toJson(req.user.simple()) });
                res.send({ membershipValue: true, name: community.name });
            });
        }
        else {
            res.sendStatus(404);
        }
    });
});
router.post('/:communityId/:userEmail/invite_user', auth.can('edit community'), function (req, res) {
    var invite, user, token;
    async.series([
        function (callback) {
            crypto.randomBytes(20, function (error, buf) {
                token = buf.toString('hex');
                callback(error);
            });
        },
        function (callback) {
            models.User.findOne({
                where: { email: req.params.userEmail },
                attributes: ['id', 'email']
            }).then(function (userIn) {
                if (userIn) {
                    user = userIn;
                }
                callback();
            }).catch(function (error) {
                callback(error);
            });
        },
        function (callback) {
            if (!req.query.addToCommunityDirectly) {
                models.Invite.create({
                    token: token,
                    expires_at: Date.now() + (3600000 * 24 * 30 * 365 * 1000),
                    type: models.Invite.INVITE_TO_COMMUNITY,
                    community_id: req.params.communityId,
                    user_id: user ? user.id : null,
                    from_user_id: req.user.id,
                    metadata: { toEmail: req.params.userEmail }
                }).then(function (inviteIn) {
                    if (inviteIn) {
                        invite = inviteIn;
                        callback();
                    }
                    else {
                        callback('Invite not found');
                    }
                }).catch(function (error) {
                    callback(error);
                });
            }
            else {
                callback();
            }
        },
        function (callback) {
            if (!req.query.addToCommunityDirectly) {
                models.AcActivity.inviteCreated({
                    email: req.params.userEmail,
                    user_id: user ? user.id : null,
                    sender_user_id: req.user.id,
                    community_id: req.params.communityId,
                    sender_name: req.user.name,
                    domain_id: req.ypDomain.id,
                    invite_id: invite.id,
                    token: token
                }, function (error) {
                    callback(error);
                });
            }
            else {
                callback();
            }
        },
        function (callback) {
            if (user && req.query.addToCommunityDirectly) {
                models.Community.findOne({
                    where: {
                        id: req.params.communityId
                    },
                    attributes: ['id']
                }).then(community => {
                    if (community) {
                        community.addCommunityUsers(user).then(() => {
                            callback();
                        }).catch(error => {
                            callback(error);
                        });
                    }
                    else {
                        callback("Can't find community");
                    }
                }).catch(error => {
                    callback(error);
                });
            }
            else {
                callback();
            }
        }
    ], function (error) {
        if (error) {
            log.error('Send Invite Error', { user: user ? toJson(user) : null, context: 'invite_user_community', loggedInUser: toJson(req.user), err: error, errorStatus: 500 });
            res.sendStatus(500);
        }
        else {
            if (!user && req.query.addToCommunityDirectly) {
                log.info('Send Invite User Not Found To add', { userEmail: req.params.userEmail, user: user ? toJson(user) : null, context: 'invite_user_community', loggedInUser: toJson(req.user) });
                res.sendStatus(404);
            }
            else {
                log.info('Send Invite Created', { userEmail: req.params.userEmail, user: user ? toJson(user) : null, context: 'invite_user_community', loggedInUser: toJson(req.user) });
                res.sendStatus(200);
            }
        }
    });
});
router.delete('/:communityId/remove_many_admins', auth.can('edit community'), (req, res) => {
    queue.add('process-deletion', {
        type: 'remove-many-community-admins', userIds: req.body.userIds, communityId: req.params.communityId
    }, 'high');
    log.info('Remove many community admins started', { context: 'remove_many_admins', communityId: req.params.communityId, user: toJson(req.user.simple()) });
    res.sendStatus(200);
});
router.delete('/:communityId/remove_many_promoters', auth.can('edit community'), (req, res) => {
    queue.add('process-deletion', {
        type: 'remove-many-community-promoters', userIds: req.body.userIds, communityId: req.params.communityId
    }, 'high');
    log.info('Remove many community promoters started', { context: 'remove_many_promoters', communityId: req.params.communityId, user: toJson(req.user.simple()) });
    res.sendStatus(200);
});
router.delete('/:communityId/remove_many_users_and_delete_content', auth.can('edit community'), function (req, res) {
    queue.add('process-deletion', { type: 'remove-many-community-users-and-delete-content', userIds: req.body.userIds, communityId: req.params.communityId
    }, 'high');
    log.info('Remove many and delete many community users content', { context: 'remove_many_users_and_delete_content', communityId: req.params.communityId, user: toJson(req.user.simple()) });
    res.sendStatus(200);
});
router.delete('/:communityId/remove_many_users', auth.can('edit community'), function (req, res) {
    queue.add('process-deletion', {
        type: 'remove-many-community-users', userIds: req.body.userIds, communityId: req.params.communityId
    }, 'high');
    log.info('Remove many community admins started', { context: 'remove_many_users', communityId: req.params.communityId, user: toJson(req.user.simple()) });
    res.sendStatus(200);
});
router.delete('/:communityId/:userId/remove_and_delete_user_content', auth.can('edit community'), function (req, res) {
    getCommunityAndUser(req.params.communityId, req.params.userId, null, function (error, community, user) {
        if (error) {
            log.error('Could not remove_user', { err: error, communityId: req.params.communityId, userRemovedId: req.params.userId, context: 'remove_user', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else if (user && community) {
            community.removeCommunityUsers(user).then(function (results) {
                if (community.counter_users > 0) {
                    community.decrement("counter_users");
                }
                queue.add('process-deletion', {
                    type: 'delete-community-user-content', userId: req.params.userId, communityId: req.params.communityId
                }, 'high');
                log.info('User removed from community', { context: 'remove_and_delete_user_content', communityId: req.params.communityId, userRemovedId: req.params.userId, user: toJson(req.user.simple()) });
                res.sendStatus(200);
            });
        }
        else {
            res.sendStatus(404);
        }
    });
});
router.delete('/:communityId/:userId/remove_admin', auth.can('edit community'), function (req, res) {
    getCommunityAndUser(req.params.communityId, req.params.userId, null, function (error, community, user) {
        if (error) {
            log.error('Could not remove admin', { err: error, communityId: req.params.communityId, userRemovedId: req.params.userId, context: 'remove_admin', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(500);
        }
        else if (user && community) {
            community.removeCommunityAdmins(user).then(function (results) {
                log.info('Admin removed', { context: 'remove_admin', communityId: req.params.communityId, userRemovedId: req.params.userId, user: req.user ? toJson(req.user.simple()) : null });
                res.sendStatus(200);
            });
        }
        else {
            res.sendStatus(404);
        }
    });
});
router.delete('/:communityId/:userId/remove_promoter', auth.can('edit community'), function (req, res) {
    getCommunityAndUser(req.params.communityId, req.params.userId, null, function (error, community, user) {
        if (error) {
            log.error('Could not remove promoter', { err: error, communityId: req.params.communityId, userRemovedId: req.params.userId, context: 'remove_admin', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(500);
        }
        else if (user && community) {
            community.removeCommunityPromoters(user).then(function (results) {
                log.info('Promoter removed', { context: 'remove_promoter', communityId: req.params.communityId, userRemovedId: req.params.userId, user: req.user ? toJson(req.user.simple()) : null });
                res.sendStatus(200);
            });
        }
        else {
            res.sendStatus(404);
        }
    });
});
router.delete('/:communityId/:userId/remove_user', auth.can('edit community'), function (req, res) {
    getCommunityAndUser(req.params.communityId, req.params.userId, null, function (error, community, user) {
        if (error) {
            log.error('Could not remove_user', { err: error, communityId: req.params.communityId, userRemovedId: req.params.userId, context: 'remove_user', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(500);
        }
        else if (user && community) {
            community.removeCommunityUsers(user).then(function (results) {
                if (community.counter_users > 0) {
                    community.decrement("counter_users");
                }
                log.info('User removed', { context: 'remove_user', communityId: req.params.communityId, userRemovedId: req.params.userId, user: req.user ? toJson(req.user.simple()) : null });
                res.sendStatus(200);
            });
        }
        else {
            res.sendStatus(404);
        }
    });
});
router.post('/:communityId/:email/add_admin', auth.can('edit community'), function (req, res) {
    getCommunityAndUser(req.params.communityId, null, req.params.email, function (error, community, user) {
        if (error) {
            log.error('Could not add admin', { err: error, communityId: req.params.communityId, userAddEmail: req.params.email, context: 'remove_admin', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(500);
        }
        else if (user && community) {
            community.addCommunityAdmins(user).then(function (results) {
                log.info('Admin Added', { context: 'add_admin', communityId: req.params.communityId, userAddEmail: req.params.email, user: req.user ? toJson(req.user.simple()) : null });
                res.sendStatus(200);
            });
        }
        else {
            res.sendStatus(404);
        }
    });
});
router.post('/:communityId/:email/add_promoter', auth.can('edit community'), function (req, res) {
    getCommunityAndUser(req.params.communityId, null, req.params.email, function (error, community, user) {
        if (error) {
            log.error('Could not add admin', { err: error, communityId: req.params.communityId, userAddEmail: req.params.email, context: 'remove_admin', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(500);
        }
        else if (user && community) {
            community.addCommunityPromoters(user).then(function (results) {
                log.info('Promoter Added', { context: 'add_promoter', communityId: req.params.communityId, userAddEmail: req.params.email, user: req.user ? toJson(req.user.simple()) : null });
                res.sendStatus(200);
            });
        }
        else {
            res.sendStatus(404);
        }
    });
});
router.get('/:communityId/pages', auth.can('view community'), function (req, res) {
    models.Community.findOne({
        where: { id: req.params.communityId },
        attributes: ['id', 'domain_id']
    }).then(function (community) {
        models.Page.getPages(req, { community_id: req.params.communityId, domain_id: community.domain_id }, function (error, pages) {
            if (error) {
                log.error('Could not get pages for community', { err: error, context: 'pages', user: req.user ? toJson(req.user.simple()) : null });
                res.sendStatus(500);
            }
            else {
                log.info('Got Pages', { context: 'pages', userId: req.user ? req.user.id : null });
                res.send(pages);
            }
        });
        return null;
    }).catch(function (error) {
        log.error('Could not get pages for community', { err: error, context: 'pages', user: req.user ? toJson(req.user.simple()) : null });
        res.sendStatus(500);
    });
});
router.get('/:communityId/pages_for_admin', auth.can('edit community'), function (req, res) {
    models.Page.getPagesForAdmin(req, { community_id: req.params.communityId }, function (error, pages) {
        if (error) {
            log.error('Could not get page for admin for community', { err: error, context: 'pages_for_admin', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(500);
        }
        else {
            log.info('Got Pages For Admin', { context: 'pages_for_admin', userId: req.user ? req.user.id : null });
            res.send(pages);
        }
    });
});
router.post('/:communityId/add_page', auth.can('edit community'), function (req, res) {
    models.Page.newPage(req, { community_id: req.params.communityId, content: {}, title: {} }, function (error, pages) {
        if (error) {
            log.error('Could not create page for admin for community', { err: error, context: 'new_page', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(500);
        }
        else {
            log.info('New Community Page', { context: 'new_page', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(200);
        }
    });
});
router.put('/:communityId/:pageId/update_page_locale', auth.can('edit community'), function (req, res) {
    models.Page.updatePageLocale(req, { community_id: req.params.communityId, id: req.params.pageId }, function (error) {
        if (error) {
            log.error('Could not update locale for admin for community', { err: error, context: 'update_page_locale', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(500);
        }
        else {
            log.info('Community Page Locale Updated', { context: 'update_page_locale', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(200);
        }
    });
});
router.put('/:communityId/:pageId/update_page_weight', auth.can('edit community'), function (req, res) {
    models.Page.updatePageWeight(req, { community_id: req.params.communityId, id: req.params.pageId }, function (error) {
        if (error) {
            log.error('Could not update locale for admin for community', { err: error, context: 'update_page_locale', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(500);
        }
        else {
            log.info('Community Page Locale Updated', { context: 'update_page_locale', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(200);
        }
    });
});
router.put('/:communityId/:pageId/publish_page', auth.can('edit community'), function (req, res) {
    models.Page.publishPage(req, { community_id: req.params.communityId, id: req.params.pageId }, function (error) {
        if (error) {
            log.error('Could not publish page for admin for community', { err: error, context: 'publish_page', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(500);
        }
        else {
            log.info('Community Page Published', { context: 'publish_page', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(200);
        }
    });
});
router.put('/:communityId/:pageId/un_publish_page', auth.can('edit community'), function (req, res) {
    models.Page.unPublishPage(req, { community_id: req.params.communityId, id: req.params.pageId }, function (error) {
        if (error) {
            log.error('Could not un-publish page for admin for community', { err: error, context: 'un_publish_page', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(500);
        }
        else {
            log.info('Community Page Un-Published', { context: 'un_publish_page', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(200);
        }
    });
});
router.delete('/:communityId/:pageId/delete_page', auth.can('edit community'), function (req, res) {
    models.Page.deletePage(req, { community_id: req.params.communityId, id: req.params.pageId }, function (error) {
        if (error) {
            log.error('Could not delete page for admin for community', { err: error, context: 'delete_page', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(500);
        }
        else {
            log.info('Commuity Page Published', { context: 'delete_page', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(200);
        }
    });
});
router.post('/:communityId/news_story', auth.isLoggedInNoAnonymousCheck, auth.can('view community'), function (req, res) {
    models.Point.createNewsStory(req, req.body, function (error) {
        if (error) {
            log.error('Could not save news story point on community', { err: error, context: 'news_story', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(500);
        }
        else {
            log.info('Point News Story Created', { context: 'news_story', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(200);
        }
    });
});
router.get('/:communityId/admin_users', auth.can('edit community'), function (req, res) {
    models.Community.findOne({
        where: {
            id: req.params.communityId
        },
        include: [
            {
                model: models.User,
                attributes: _.concat(models.User.defaultAttributesWithSocialMediaPublicAndEmail, ['created_at', 'last_login_at']),
                as: 'CommunityAdmins',
                required: true,
                include: [
                    {
                        model: models.Organization,
                        attributes: ['id', 'name'],
                        as: 'OrganizationUsers',
                        required: false
                    }
                ]
            }
        ]
    }).then(function (community) {
        log.info('Got admin users', { context: 'admin_users', user: toJson(req.user.simple()) });
        if (community) {
            res.send(community.CommunityAdmins);
        }
        else {
            res.send([]);
        }
    }).catch(function (error) {
        log.error('Could not get admin users', { err: error, context: 'admin_users', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    });
});
router.get('/:communityId/promotion_users', auth.can('edit community'), function (req, res) {
    models.Community.findOne({
        where: {
            id: req.params.communityId
        },
        include: [
            {
                model: models.User,
                attributes: _.concat(models.User.defaultAttributesWithSocialMediaPublicAndEmail, ['created_at', 'last_login_at']),
                as: 'CommunityPromoters',
                required: true,
                include: [
                    {
                        model: models.Organization,
                        attributes: ['id', 'name'],
                        as: 'OrganizationUsers',
                        required: false
                    }
                ]
            }
        ]
    }).then(function (community) {
        log.info('Got promotion users', { context: 'promotion_users', user: toJson(req.user.simple()) });
        if (community) {
            res.send(community.CommunityPromoters);
        }
        else {
            res.send([]);
        }
    }).catch(function (error) {
        log.error('Could not get promotion users', { err: error, context: 'promotion_users', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    });
});
router.get('/:communityId/users', auth.can('edit community'), function (req, res) {
    models.Community.findOne({
        where: {
            id: req.params.communityId
        },
        include: [
            {
                model: models.User,
                attributes: _.concat(models.User.defaultAttributesWithSocialMediaPublicAndEmail, ['created_at', 'last_login_at']),
                as: 'CommunityUsers',
                required: true,
                include: [
                    {
                        model: models.Organization,
                        attributes: ['id', 'name'],
                        as: 'OrganizationUsers',
                        required: false
                    }
                ]
            }
        ]
    }).then(function (community) {
        log.info('Got users', { context: 'users', user: toJson(req.user.simple()) });
        if (community) {
            res.send(community.CommunityUsers);
        }
        else {
            res.send([]);
        }
    }).catch(function (error) {
        log.error('Could not get admin users', { err: error, context: 'users', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    });
});
router.get('/:communityId/posts', auth.can('view community'), function (req, res) {
    var where = { status: 'published', deleted: false };
    var postOrder = "(counter_endorsements_up-counter_endorsements_down) DESC";
    if (req.query.sortBy == "newest") {
        postOrder = "created_at DESC";
    }
    else if (req.query.sortBy == "most_debated") {
        postOrder = "counter_points DESC";
    }
    else if (req.query.sortBy == "random") {
        postOrder = "created_at DESC";
    }
    var limit = req.query.limit ? Math.max(req.query.limit, 25) : 7;
    models.Post.findAll({
        where: where,
        attributes: ['id', 'name', 'description', 'status', 'official_status', 'counter_endorsements_up', 'cover_media_type',
            'counter_endorsements_down', 'counter_points', 'counter_flags', 'data', 'location', 'created_at'],
        order: [
            models.sequelize.literal(postOrder),
            [{ model: models.Image, as: 'PostHeaderImages' }, 'updated_at', 'asc'],
            [{ model: models.Group }, { model: models.Image, as: 'GroupLogoImages' }, 'updated_at', 'asc']
        ],
        include: [
            {
                model: models.Group,
                required: true,
                where: { access: { $in: [models.Group.ACCESS_OPEN_TO_COMMUNITY, models.Group.ACCESS_PUBLIC] } },
                attributes: ['id', 'configuration'],
                include: [
                    {
                        model: models.Image, as: 'GroupLogoImages',
                        attributes: models.Image.defaultAttributesPublic,
                        required: false
                    },
                    {
                        model: models.Community,
                        required: true,
                        where: {
                            id: req.params.communityId
                        },
                        attributes: ['id', 'configuration']
                    }
                ]
            },
            { model: models.Image,
                attributes: models.Image.defaultAttributesPublic,
                as: 'PostHeaderImages',
                required: false
            }
        ]
    }).then(function (posts) {
        log.info('Got posts', { context: 'posts' });
        if (posts) {
            res.send(_.dropRight(posts, limit));
        }
        else {
            res.send([]);
        }
    }).catch(function (error) {
        log.error('Could not get posts', { err: error, context: 'posts' });
        res.sendStatus(500);
    });
});
router.get('/:id', auth.can('view community'), function (req, res) {
    if (isValidDbId(req.params.id)) {
        getCommunity(req, function (error, community) {
            if (community) {
                res.send(community);
            }
            else if (error && error != "Not found") {
                sendCommunityOrError(res, null, 'view', req.user, error);
            }
            else {
                sendCommunityOrError(res, req.params.id, 'view', req.user, 'Not found', 404);
            }
        });
    }
    else {
        res.sendStatus(404);
    }
});
router.get('/:id/basic', auth.can('view community'), function (req, res) {
    models.Community.findOne({
        where: {
            id: req.params.id
        },
        order: [
            [{ model: models.Image, as: 'CommunityLogoImages' }, 'created_at', 'asc'],
            [{ model: models.Image, as: 'CommunityHeaderImages' }, 'created_at', 'asc'],
            [{ model: models.Video, as: "CommunityLogoVideos" }, 'updated_at', 'desc'],
            [{ model: models.Video, as: "CommunityLogoVideos" }, { model: models.Image, as: 'VideoImages' }, 'updated_at', 'asc']
        ],
        attributes: models.Community.defaultAttributesPublic,
        include: [
            {
                model: models.Domain,
                attributes: models.Domain.defaultAttributesPublic
            },
            {
                model: models.Image,
                as: 'CommunityLogoImages',
                attributes: models.Image.defaultAttributesPublic,
                required: false
            },
            {
                model: models.Image,
                as: 'CommunityHeaderImages',
                attributes: models.Image.defaultAttributesPublic,
                required: false
            },
            {
                model: models.Community,
                required: false,
                as: 'CommunityFolder',
                attributes: ['id', 'name', 'description']
            },
            {
                model: models.Video,
                as: 'CommunityLogoVideos',
                attributes: ['id', 'formats', 'viewable', 'public_meta'],
                required: false,
                include: [
                    {
                        model: models.Image,
                        as: 'VideoImages',
                        attributes: ["formats", 'updated_at'],
                        required: false
                    },
                ]
            }
        ]
    }).then(community => {
        if (community) {
            res.send(community);
        }
        else if (error && error != "Not found") {
            sendCommunityOrError(res, null, 'view', req.user, error);
        }
        else {
            sendCommunityOrError(res, req.params.id, 'view', req.user, 'Not found', 404);
        }
    }).catch(error => {
        sendCommunityOrError(res, null, 'view', req.user, error);
    });
});
router.get('/:id/translatedText', auth.can('view community'), function (req, res) {
    if (req.query.textType && req.query.textType.indexOf("community") > -1) {
        models.Community.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'name', 'description']
        }).then(function (community) {
            if (community) {
                models.AcTranslationCache.getTranslation(req, community, function (error, translation) {
                    if (error) {
                        sendCommunityOrError(res, req.params.id, 'translated', req.user, error, 500);
                    }
                    else {
                        res.send(translation);
                    }
                });
                log.info('Community translatedTitle', { context: 'translated' });
            }
            else {
                sendCommunityOrError(res, req.params.id, 'translated', req.user, 'Not found', 404);
            }
        }).catch(function (error) {
            sendCommunityOrError(res, null, 'translated', req.user, error);
        });
    }
    else {
        sendCommunityOrError(res, req.params.id, 'translated', req.user, 'Wrong textType or missing textType', 401);
    }
});
const createNewCommunity = (req, res) => {
    var admin_email = req.user.email;
    var admin_name = "Administrator";
    var community = models.Community.build({
        name: req.body.name,
        description: req.body.description,
        access: models.Community.convertAccessFromRadioButtons(req.body),
        domain_id: req.params.domainId,
        user_id: req.user.id,
        hostname: req.body.hostname,
        website: req.body.website,
        in_community_folder_id: (req.body.in_community_folder_id && req.body.in_community_folder_id != '-1') ?
            req.body.in_community_folder_id : null,
        is_community_folder: (req.body.is_community_folder && req.body.is_community_folder != '-1') ?
            req.body.is_community_folder : null,
        admin_email: admin_email,
        admin_name: admin_name,
        user_agent: req.useragent.source,
        ip_address: req.clientIp
    });
    updateCommunityConfigParameters(req, community);
    community.save().then(function () {
        log.info('Community Created', { community: toJson(community), context: 'create', user: toJson(req.user) });
        queue.add('process-similarities', { type: 'update-collection', communityId: community.id }, 'low');
        community.updateAllExternalCounters(req, 'up', 'counter_communities', function () {
            community.setupImages(req.body, function (error) {
                community.addCommunityAdmins(req.user).then(function (results) {
                    queue.add('process-moderation', {
                        type: 'estimate-collection-toxicity',
                        collectionId: community.id,
                        collectionType: 'community'
                    }, 'high');
                    queue.add('process-moderation', {
                        type: 'collection-review-and-annotate-images',
                        collectionId: community.id,
                        collectionType: 'community'
                    }, 'medium');
                    sendCommunityOrError(res, community, 'setupImages', req.user, error);
                });
            });
        });
    }).catch(function (error) {
        sendCommunityOrError(res, null, 'create', req.user, error);
    });
};
router.post('/:domainId', auth.can('create community'), function (req, res) {
    if (req.body.hostname && req.body.hostname !== '') {
        models.Community.findOne({
            where: {
                hostname: req.body.hostname
            }
        }).then(function (oldCommunity) {
            if (oldCommunity) {
                log.error("Can't save community, hostname already taken", { hostname: req.body.hostname });
                res.send({ hostnameTaken: true, isError: true });
            }
            else {
                createNewCommunity(req, res);
            }
        });
    }
    else {
        createNewCommunity(req, res);
    }
});
router.put('/:id', auth.can('edit community'), function (req, res) {
    models.Community.findOne({
        where: { id: req.params.id }
    }).then(function (community) {
        if (community) {
            community.name = req.body.name;
            community.description = req.body.description;
            community.in_community_folder_id = (req.body.in_community_folder_id && req.body.in_community_folder_id != '-1') ?
                req.body.in_community_folder_id : null;
            community.is_community_folder = (req.body.is_community_folder && req.body.is_community_folder != '-1') ?
                req.body.is_community_folder : null;
            if (req.body.hostname && req.body.hostname != "") {
                community.hostname = req.body.hostname;
            }
            community.access = models.Community.convertAccessFromRadioButtons(req.body);
            updateCommunityConfigParameters(req, community);
            community.save().then(function () {
                log.info('Community Updated', { community: toJson(community), context: 'update', user: toJson(req.user) });
                queue.add('process-similarities', { type: 'update-collection', communityId: community.id }, 'low');
                community.setupImages(req.body, function (error) {
                    queue.add('process-moderation', {
                        type: 'estimate-collection-toxicity',
                        collectionId: community.id,
                        collectionType: 'community'
                    }, 'high');
                    queue.add('process-moderation', {
                        type: 'collection-review-and-annotate-images',
                        collectionId: community.id,
                        collectionType: 'community'
                    }, 'medium');
                    sendCommunityOrError(res, community, 'setupImages', req.user, error);
                });
            });
        }
        else {
            sendCommunityOrError(res, req.params.id, 'update', req.user, 'Not found', 404);
        }
    }).catch(function (error) {
        sendCommunityOrError(res, null, 'update', req.user, error);
    });
});
router.delete('/:id', auth.can('edit community'), function (req, res) {
    models.Community.findOne({
        where: { id: req.params.id }
    }).then(function (community) {
        if (community) {
            community.deleted = true;
            community.save().then(function () {
                log.info('Community Deleted', { community: toJson(community), user: toJson(req.user) });
                queue.add('process-similarities', { type: 'update-collection', communityId: community.id }, 'low');
                queue.add('process-deletion', { type: 'delete-community-content', communityName: community.name, communityId: community.id, userId: req.user.id }, 'high');
                community.updateAllExternalCounters(req, 'down', 'counter_communities', function () {
                    res.sendStatus(200);
                });
            });
        }
        else {
            sendCommunityOrError(res, req.params.id, 'delete', req.user, 'Not found', 404);
        }
    }).catch(function (error) {
        sendCommunityOrError(res, null, 'delete', req.user, error);
    });
});
router.delete('/:id/delete_content', auth.can('edit community'), function (req, res) {
    models.Community.findOne({
        where: { id: req.params.id }
    }).then(function (community) {
        if (community) {
            log.info('Community Delete Content', { community: toJson(community), user: toJson(req.user) });
            queue.add('process-deletion', { type: 'delete-community-content', communityName: community.name,
                communityId: community.id, userId: req.user.id, useNotification: true,
                resetCounters: true }, 'critical');
            res.sendStatus(200);
        }
        else {
            sendCommunityOrError(res, req.params.id, 'delete', req.user, 'Not found', 404);
        }
    }).catch(function (error) {
        sendCommunityOrError(res, null, 'delete', req.user, error);
    });
});
router.delete('/:id/anonymize_content', auth.can('edit community'), function (req, res) {
    models.Community.findOne({
        where: { id: req.params.id }
    }).then(function (community) {
        if (community) {
            const anonymizationDelayMs = 1000 * 60 * 60 * 24 * 7;
            log.info('Community Anonymize Content', { community: toJson(community), user: toJson(req.user) });
            queue.add('process-anonymization', { type: 'notify-community-users', communityName: community.name,
                userId: req.user.id, communityId: community.id, delayMs: anonymizationDelayMs }, 'high');
            queue.add('process-anonymization', { type: 'anonymize-community-content', communityName: community.name,
                communityId: community.id, userId: req.user.id, useNotification: true,
                resetCounters: true }, 'high', { delay: anonymizationDelayMs });
            res.sendStatus(200);
        }
        else {
            sendCommunityOrError(res, req.params.id, 'delete', req.user, 'Not found', 404);
        }
    }).catch(function (error) {
        sendCommunityOrError(res, null, 'delete', req.user, error);
    });
});
router.get('/:id/post_locations', auth.can('view community'), function (req, res) {
    models.Post.findAll({
        where: {
            location: {
                $ne: null
            }
        },
        attributes: models.Post.defaultAttributesPublic,
        order: [
            [{ model: models.Image, as: 'PostHeaderImages' }, 'updated_at', 'asc']
        ],
        select: ['id', 'name', 'location'],
        include: [
            { model: models.Image,
                as: 'PostHeaderImages',
                attributes: models.Image.defaultAttributesPublic,
                required: false
            },
            {
                model: models.Group,
                attributes: models.Group.defaultAttributesPublic,
                where: {
                    access: { $in: [models.Group.ACCESS_OPEN_TO_COMMUNITY, models.Group.ACCESS_PUBLIC] }
                },
                required: true,
                include: [
                    {
                        model: models.Community,
                        attributes: models.Community.defaultAttributesPublic,
                        where: { id: req.params.id },
                        required: true
                    }
                ]
            }
        ]
    }).then(function (posts) {
        if (posts) {
            log.info('Community Post Locations Viewed', { communityId: req.params.id, context: 'view', user: toJson(req.user) });
            var collectedIds = _.map(posts, function (post) {
                return post.id;
            });
            models.Post.getVideosForPosts(collectedIds, (error, videos) => {
                if (error) {
                    sendCommunityOrError(res, null, 'view post locations', req.user, 'Not found', 404);
                }
                else {
                    if (videos.length > 0) {
                        models.Post.addVideosToAllPosts(posts, videos);
                    }
                    res.send(posts);
                }
            });
        }
        else {
            sendCommunityOrError(res, null, 'view post locations', req.user, 'Not found', 404);
        }
    }).catch(function (error) {
        sendCommunityOrError(res, null, 'view post locations', req.user, error);
    });
});
// Moderation
router.delete('/:communityId/:itemId/:itemType/:actionType/process_one_moderation_item', auth.can('edit community'), (req, res) => {
    performSingleModerationAction(req, res, {
        communityId: req.params.communityId,
        itemId: req.params.itemId,
        itemType: req.params.itemType,
        actionType: req.params.actionType
    });
});
router.delete('/:communityId/:actionType/process_many_moderation_item', auth.can('edit community'), (req, res) => {
    queue.add('process-moderation', {
        type: 'perform-many-moderation-actions',
        items: req.body.items,
        actionType: req.params.actionType,
        communityId: req.params.communityId
    }, 'critical');
    res.send({});
});
router.get('/:communityId/flagged_content', auth.can('edit community'), (req, res) => {
    getAllModeratedItemsByCommunity({ communityId: req.params.communityId }, (error, items) => {
        if (error) {
            log.error("Error getting items for moderation", { error });
            res.sendStatus(500);
        }
        else {
            res.send(items);
        }
    });
});
router.get('/:communityId/moderate_all_content', auth.can('edit community'), (req, res) => {
    getAllModeratedItemsByCommunity({ communityId: req.params.communityId, allContent: true }, (error, items) => {
        if (error) {
            log.error("Error getting items for moderation", { error });
            res.sendStatus(500);
        }
        else {
            res.send(items);
        }
    });
});
router.get('/:communityId/flagged_content_count', auth.can('edit community'), (req, res) => {
    countAllModeratedItemsByCommunity({ communityId: req.params.communityId }, (error, count) => {
        if (error) {
            log.error("Error getting items for moderation", { error });
            res.sendStatus(500);
        }
        else {
            res.send({ count });
        }
    });
});
router.get('/:communityId/export_users', auth.can('edit community'), function (req, res) {
    getUsersForCommunity(req.params.communityId, function (error, fileData) {
        if (error) {
            log.error('Could not export users for community', { err: error, context: 'export_users', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else {
            models.Community.findOne({
                where: {
                    id: req.params.communityId
                },
                attributes: ["id", "name"]
            }).then(function (model) {
                if (model) {
                    log.info('Got Users Exports', { context: 'export_users', user: toJson(req.user.simple()) });
                    var communityName = sanitizeFilename(model.name).replace(/ /g, '');
                    var dateString = moment(new Date()).format("DD_MM_YY_HH_mm");
                    var filename = 'users_export_for_community_id_' + model.id + '_' +
                        communityName + '_' + dateString + '.csv';
                    res.set({ 'content-type': 'application/octet-stream; charset=utf-8' });
                    res.charset = 'utf-8';
                    res.attachment(filename);
                    res.send(fileData);
                }
                else {
                    log.error('Cant find community', { err: error, context: 'export_users', user: toJson(req.user.simple()) });
                    res.sendStatus(404);
                }
            }).catch(function (error) {
                log.error('Could not export for community', { err: error, context: 'export_users', user: toJson(req.user.simple()) });
                res.sendStatus(500);
            });
        }
    });
});
router.get('/:communityId/export_logins', auth.can('edit community'), function (req, res) {
    getLoginsExportDataForCommunity(req.params.communityId, req.ypDomain.domain_name, function (error, fileData) {
        if (error) {
            log.error('Could not export logins for commnity', { err: error, context: 'export_group', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else {
            models.Community.findOne({
                where: {
                    id: req.params.communityId
                },
                attributes: ["id", "name"]
            }).then(function (model) {
                if (model) {
                    log.info('Got Login Exports', { context: 'export_logins', user: toJson(req.user.simple()) });
                    var communityName = sanitizeFilename(model.name).replace(/ /g, '');
                    var dateString = moment(new Date()).format("DD_MM_YY_HH_mm");
                    var filename = 'logins_export_for_community_id_' + model.id + '_' +
                        communityName + '_' + dateString + '.csv';
                    res.set({ 'content-type': 'application/octet-stream; charset=utf-8' });
                    res.charset = 'utf-8';
                    res.attachment(filename);
                    res.send(fileData);
                }
                else {
                    log.error('Cant find community', { err: error, context: 'export_logins', user: toJson(req.user.simple()) });
                    res.sendStatus(404);
                }
            }).catch(function (error) {
                log.error('Could not export for community', { err: error, context: 'export_logins', user: toJson(req.user.simple()) });
                res.sendStatus(500);
            });
        }
    });
});
router.get('/:communityId/:ssnListId/ssn_login_list_count', auth.can('edit community'), function (req, res) {
    models.GeneralDataStore.findOne({
        where: {
            id: req.params.ssnListId
        }
    }).then((dataItem) => {
        if (dataItem.data.ssns) {
            res.send({ count: dataItem.data.ssns.length });
        }
        else {
            log.error('Could not get ssl login list count', { context: 'ssn_login_list_count', user: toJson(req.user.simple()) });
            res.sendStatus(404);
        }
    }).catch((error) => {
        log.error('Could not get ssl login list count', { context: 'ssn_login_list_count', error, user: toJson(req.user.simple()) });
        res.sendStatus(500);
    });
});
router.delete('/:communityId/:ssnListId/delete_ssn_login_list', auth.can('edit community'), function (req, res) {
    models.GeneralDataStore.destroy({
        where: {
            id: req.params.ssnListId
        }
    }).then(() => {
        models.Community.findOne({
            where: {
                id: req.params.communityId
            },
            attributes: ['id', 'configuration']
        }).then((community) => {
            community.set('configuration.ssnLoginListDataId', null);
            community.save().then(() => {
                res.sendStatus(200);
            }).catch((error) => {
                log.error('Could not destroy ssl login list count', { context: 'delete_ssn_login_list', error, user: toJson(req.user.simple()) });
                res.sendStatus(500);
            });
        }).catch((error) => {
            log.error('Could not destroy ssl login list count', { context: 'delete_ssn_login_list', error, user: toJson(req.user.simple()) });
            res.sendStatus(500);
        });
    }).catch((error) => {
        log.error('Could not destroy ssl login list count', { context: 'delete_ssn_login_list', error, user: toJson(req.user.simple()) });
        res.sendStatus(500);
    });
});
router.post('/:communityId/upload_ssn_login_list', auth.can('edit community'), function (req, res) {
    let ssnLoginListDataId;
    let mainDataItem;
    multerMultipartResolver(req, res, function (error) {
        if (!error && req.file && req.file.path) {
            const instream = fs.createReadStream(req.file.path);
            const outstream = new stream();
            const rl = readline.createInterface(instream, outstream);
            const ssns = [];
            rl.on('line', (line) => {
                var fixedLine = line.replace("-", "");
                const isnum = /^\d+$/.test(fixedLine);
                if (isnum && fixedLine.length == 10) {
                    ssns.push(fixedLine);
                }
                else {
                    log.warn("Malformatted line in upload_ssn_login_list", { fixedLine });
                }
            });
            rl.on('close', () => {
                models.GeneralDataStore.create({ data: { ssns: ssns } }).then((dataItem) => {
                    mainDataItem = dataItem;
                    let community;
                    async.series([
                        (seriesCallback) => {
                            models.Community.findOne({
                                where: {
                                    id: req.params.communityId
                                },
                                attributes: ['id', 'configuration']
                            }).then((communityIn) => {
                                community = communityIn;
                                seriesCallback();
                            }).catch((error) => {
                                seriesCallback(error);
                            });
                        },
                        (seriesCallback) => {
                            if (community && community.configuration && community.configuration.ssnLoginListDataId) {
                                models.GeneralDataStore.destroy({
                                    where: {
                                        id: community.configuration.ssnLoginListDataId
                                    }
                                }).then(() => {
                                    seriesCallback();
                                }).catch((error) => {
                                    seriesCallback(error);
                                });
                            }
                            else {
                                seriesCallback();
                            }
                        },
                        (seriesCallback) => {
                            community.set('configuration.ssnLoginListDataId', dataItem.id);
                            ssnLoginListDataId = dataItem.id;
                            community.save().then(() => {
                                seriesCallback();
                            }).catch((error) => {
                                seriesCallback(error);
                            });
                        }
                    ], (error) => {
                        if (error) {
                            log.error('Could not upload ssl to community', { context: 'upload_ssn_login_list', error, user: toJson(req.user.simple()) });
                            res.sendStatus(500);
                        }
                        else {
                            res.send({ ssnLoginListDataId, numberOfSsns: mainDataItem.data.ssns.length });
                        }
                    });
                }).catch((error) => {
                    log.error('Could not upload ssl to community', { context: 'upload_ssn_login_list', error, user: toJson(req.user.simple()) });
                    res.sendStatus(500);
                });
            });
            rl.on('error', (error) => {
                log.error('Could not upload ssl to community', { context: 'upload_ssn_login_list', error, user: toJson(req.user.simple()) });
                res.sendStatus(500);
            });
        }
        else {
            log.error('Could not upload ssl to community', { context: 'upload_ssn_login_list', error, user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
    });
});
// WORD CLOUD
router.get('/:id/wordcloud', auth.can('edit community'), function (req, res) {
    getFromAnalyticsApi(req, "wordclouds", "community", req.params.id, function (error, content) {
        sendBackAnalyticsResultsOrError(req, res, error, content);
    });
});
// SIMILARITIES
router.get('/:id/similarities_weights', auth.can('edit community'), function (req, res) {
    getFromAnalyticsApi(req, "similarities_weights", "community", req.params.id, function (error, content) {
        sendBackAnalyticsResultsOrError(req, res, error ? error : content.body ? null : 'noBody', getParsedSimilaritiesContent(content));
    });
});
// STATS
router.get('/:id/stats_posts', auth.can('edit community'), function (req, res) {
    countModelRowsByTimePeriod(req, "stats_posts_" + req.params.id + "_community", models.Post, {}, getCommunityIncludes(req.params.id), (error, results) => {
        sendBackAnalyticsResultsOrError(req, res, error, results);
    });
});
router.get('/:id/stats_points', auth.can('edit community'), function (req, res) {
    countModelRowsByTimePeriod(req, "stats_points_" + req.params.id + "_community", models.Point, {}, getPointCommunityIncludes(req.params.id), (error, results) => {
        sendBackAnalyticsResultsOrError(req, res, error, results);
    });
});
router.get('/:id/stats_votes', auth.can('edit community'), function (req, res) {
    countModelRowsByTimePeriod(req, "stats_votes_" + req.params.id + "_community", models.AcActivity, {
        type: {
            $in: [
                "activity.post.opposition.new", "activity.post.endorsement.new",
                "activity.point.helpful.new", "activity.point.unhelpful.new"
            ]
        }
    }, getCommunityIncludes(req.params.id), (error, results) => {
        sendBackAnalyticsResultsOrError(req, res, error, results);
    });
});
router.get('/:id/get_translation_texts', auth.can('edit community'), function (req, res) {
    getTranslatedTextsForCommunity(req.query.targetLocale, req.params.id, (results, error) => {
        if (error) {
            log.error("Error in getting translated texts", { error });
            res.sendStatus(500);
        }
        else {
            res.send(results);
        }
    });
});
router.put('/:id/update_translation', auth.can('edit community'), function (req, res) {
    updateTranslationForCommunity(req.params.id, req.body, (results, error) => {
        if (error) {
            log.error("Error in updating translation", { error });
            res.sendStatus(500);
        }
        else {
            res.send(results);
        }
    });
});
router.get('/:id/recursiveMap', auth.can('edit community'), async (req, res) => {
    try {
        let map = await getMapForCommunity(req.params.id, { targetLocale: req.query.useEnglish ? "en" : undefined });
        if (map.children && map.children.length > 0) {
            map = map.children[0];
        }
        res.send(map);
    }
    catch (error) {
        log.error("Error in getting recursiveMap", { error });
        res.sendStatus(500);
    }
});
router.put('/:communityId/:type/start_report_creation', auth.can('edit community'), function (req, res) {
    models.AcBackgroundJob.createJob({}, {}, (error, jobId) => {
        if (error) {
            log.error('Could not create backgroundJob', { err: error, context: 'start_report_creation', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else {
            let reportType;
            if (req.params.type === 'usersxls') {
                reportType = 'start-xls-users-community-report-generation';
            }
            else if (req.params.type === 'fraudAuditReport') {
                reportType = 'start-fraud-audit-report-generation';
            }
            queue.add('process-reports', {
                type: reportType,
                userId: req.user.id,
                exportType: req.params.type,
                fileEnding: req.params.fileEnding ? req.params.fileEnding : 'xlsx',
                translateLanguage: req.query.translateLanguage,
                selectedFraudAuditId: req.body.selectedFraudAuditId,
                jobId: jobId,
                communityId: req.params.communityId
            }, 'critical');
            res.send({ jobId });
        }
    });
});
router.post('/:id/clone', auth.can('edit community'), function (req, res) {
    models.Community.findOne({
        attributes: ['id', 'domain_id'],
        where: { id: req.params.id },
        include: [
            {
                model: models.Domain,
                attributes: ['id']
            }
        ]
    }).then(function (community) {
        if (community) {
            copyCommunity(community.id, community.domain_id, { skipUser: true, skipActivities: true, copyGroups: true }, null, (error, newCommunity) => {
                if (error) {
                    log.error('Community Clone Failed', { error, communityId: req.params.id });
                    res.sendStatus(500);
                }
                else if (newCommunity) {
                    recountCommunity(newCommunity.id, () => {
                        log.info('Community Cloned', { communityId: req.params.id });
                        res.sendStatus(200);
                    });
                }
                else {
                    log.error('Community Clone Failed', { error: "Unknown", communityId: req.params.id });
                    res.sendStatus(500);
                }
            });
        }
        else {
            sendCommunityOrError(res, req.params.id, 'clone', req.user, 'Not found', 404);
        }
    }).catch(function (error) {
        sendCommunityOrError(res, null, 'clone', req.user, error);
    });
});
router.get('/:communityId/:jobId/report_creation_progress', auth.can('edit community'), function (req, res) {
    models.AcBackgroundJob.findOne({
        where: {
            id: req.params.jobId
        },
        attributes: ['id', 'progress', 'error', 'data']
    }).then(job => {
        res.send(job);
    }).catch(error => {
        log.error('Could not get backgroundJob', { err: error, context: 'start_report_creation', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    });
});
router.put('/:communityId/:type/:selectedMethod/:collectionType/start_endorsement_fraud_action', auth.can('edit community'), function (req, res) {
    models.AcBackgroundJob.createJob({}, {
        idsToDelete: req.body.idsToDelete
    }, (error, jobId) => {
        if (error) {
            log.error('Could not create backgroundJob', { err: error, context: 'start_report_creation', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else {
            queue.add('process-fraud-action', {
                type: req.params.type,
                collectionType: req.params.collectionType,
                selectedMethod: req.params.selectedMethod,
                userId: req.user.id,
                jobId: jobId,
                communityId: req.params.communityId
            }, 'critical');
            res.send({ jobId });
        }
    });
});
router.get('/:communityId/:jobId/endorsement_fraud_action_status', auth.can('edit community'), function (req, res) {
    models.AcBackgroundJob.findOne({
        where: {
            id: req.params.jobId
        },
        attributes: ['id', 'progress', 'error', 'data']
    }).then(job => {
        if (job.progress === 100) {
            queue.add('process-fraud-action', {
                type: "delete-job",
                jobId: job.id,
            }, 'critical', { delay: 30000 });
        }
        res.send(job);
    }).catch(error => {
        log.error('Could not get backgroundJob', { err: error, context: 'endorsement_fraud_action_status', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    });
});
router.get('/:communityId/getFraudAudits', auth.can('edit community'), function (req, res) {
    models.Community.findOne({
        where: {
            id: req.params.communityId
        },
        attributes: ['data']
    }).then(community => {
        if (community) {
            if (community.data) {
                res.send(community.data.fraudDeletionsAuditLogs);
            }
            else {
                res.send(null);
            }
        }
        else {
            res.sendStatus(404);
        }
    }).catch(error => {
        log.error('Could not get backgroundJob', { err: error, context: 'endorsement_fraud_action_status', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    });
});
router.get('/:communityId/:type/getPlausibleSeries', auth.can('edit community marketing'), async (req, res) => {
    // Example: "timeseries?site_id=your-priorities&period=7d";
    try {
        const questionMarkIndex = req.url.indexOf('?');
        const queryString = req.url.substr(questionMarkIndex + 1);
        const siteId = process.env.PLAUSIBLE_SITE_NAME;
        const type = req.params.type.replace('realtime-visitors', 'realtime/visitors');
        const plausibleString = `${type}?${queryString}&site_id=${siteId}`;
        const plausibleData = await getPlausibleStats(plausibleString);
        log.info("GOT DATA");
        log.info(plausibleData);
        res.send(plausibleData);
    }
    catch (error) {
        log.error('Could not get getPlausibleSeries', { err: error, context: 'getPlausibleSeries', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    }
});
router.put('/:communityId/plausibleStatsProxy', auth.can('edit community marketing'), async (req, res) => {
    const plausibleParams = {};
    if (req.query.communityId) {
        //TODO: check if user is allowed to see this community
        plausibleParams.communityId = req.query.communityId;
    }
    else {
        plausibleParams.communityId = req.params.communityId;
    }
    try {
        const plausibleData = await plausibleStatsProxy(req.body.plausibleUrl, plausibleParams);
        res.send(plausibleData);
    }
    catch (error) {
        log.error('Could not get plausibleStatsProxy', { err: error, context: 'getPlausibleSeries', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    }
});
router.get('/:communityId/get_campaigns', auth.can('edit community marketing'), async (req, res) => {
    try {
        const campaigns = await models.Campaign.findAll({
            where: {
                community_id: req.params.communityId,
                active: true
            },
            order: [
                ['created_at', 'desc']
            ],
            attributes: ['id', 'configuration']
        });
        res.send(campaigns);
    }
    catch (error) {
        log.error('Could not get campaigns', { err: error, context: 'get_campaigns', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    }
});
router.post('/:communityId/create_campaign', auth.can('edit community marketing'), async (req, res) => {
    try {
        const campaign = models.Campaign.build({
            community_id: req.params.communityId,
            configuration: req.body.configuration,
            user_id: req.user.id
        });
        await campaign.save();
        //TODO: Toxicity check
        res.send(campaign);
    }
    catch (error) {
        log.error('Could not create_campaign campaigns', { err: error, context: 'create_campaign', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    }
});
router.put('/:communityId/:campaignId/update_campaign', auth.can('edit community marketing'), async (req, res) => {
    try {
        const campaign = await models.Campaign.findOne({
            where: {
                id: req.params.campaignId,
                community_id: req.params.communityId
            },
            attributes: ['id', 'configuration']
        });
        campaign.configuration = req.body.configuration;
        await campaign.save();
        //TODO: Toxicity check
        res.send(campaign);
    }
    catch (error) {
        log.error('Could not create_campaign campaigns', { err: error, context: 'create_campaign', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    }
});
router.delete('/:communityId/:campaignId/delete_campaign', auth.can('edit community marketing'), async (req, res) => {
    try {
        const campaign = await models.Campaign.findOne({
            where: {
                id: req.params.campaignId,
                community_id: req.params.communityId
            },
            attributes: ['id']
        });
        campaign.deleted = true;
        await campaign.save();
        res.sendStatus(200);
    }
    catch (error) {
        log.error('Could not delete_campaign campaigns', { err: error, context: 'delete_campaign', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    }
});
router.get('/:communityId/group_folders_simple', auth.can('edit community'), async (req, res) => {
    try {
        const groupFolders = await models.Group.findAll({
            where: {
                community_id: req.params.communityId,
                is_group_folder: true
            },
            attributes: ['id', 'name', 'is_group_folder'],
        });
        res.send(groupFolders);
    }
    catch (error) {
        log.error('Could not get group_folders_simple', { err: error, context: 'group_folders_simple', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    }
});
router.post('/:communityId/:start_generating_ai_image', auth.can('edit community'), function (req, res) {
    models.AcBackgroundJob.createJob({}, {}, (error, jobId) => {
        if (error) {
            log.error('Could not create backgroundJob', { err: error, context: 'start_generating_ai_image', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else {
            queue.add('process-generative-ai', {
                type: "collection-image",
                userId: req.user.id,
                jobId: jobId,
                collectionId: req.params.communityId,
                collectionType: "community",
                prompt: req.body.prompt,
                imageType: req.body.imageType
            }, 'critical');
            res.send({ jobId });
        }
    });
});
router.get('/:communityId/:jobId/poll_for_generating_ai_image', auth.can('edit community'), function (req, res) {
    models.AcBackgroundJob.findOne({
        where: {
            id: req.params.jobId
        },
        attributes: ['id', 'progress', 'error', 'data']
    }).then(job => {
        res.send(job);
    }).catch(error => {
        log.error('Could not get backgroundJob', { err: error, context: 'poll_for_generating_ai_image', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    });
});
module.exports = router;
