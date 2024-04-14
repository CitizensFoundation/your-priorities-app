"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var models = require("../models/index.cjs");
var auth = require('../authorization.cjs');
var log = require('../utils/logger.cjs');
var toJson = require('../utils/to_json.cjs');
var _ = require('lodash');
var async = require('async');
var crypto = require("crypto");
var seededShuffle = require("knuth-shuffle-seeded");
var multer = require('multer');
var s3multer = require('multer-s3');
var aws = require('aws-sdk');
var getExportFileDataForGroup = require('../utils/export_utils.cjs').getExportFileDataForGroup;
const exportGroupToDocx = require('../utils/docx_utils.cjs').exportGroupToDocx;
const { v4: uuidv4 } = require("uuid");
var moment = require('moment');
var sanitizeFilename = require("sanitize-filename");
var queue = require('../active-citizen/workers/queue.cjs');
const getAllModeratedItemsByGroup = require('../active-citizen/engine/moderation/get_moderation_items.cjs').getAllModeratedItemsByGroup;
const performSingleModerationAction = require('../active-citizen/engine/moderation/process_moderation_items.cjs').performSingleModerationAction;
const request = require('request');
const { updateAnswerTranslation } = require("../active-citizen/utils/translation_helpers.cjs");
const { updateSurveyTranslation } = require("../active-citizen/utils/translation_helpers.cjs");
const { plausibleStatsProxy, getPlausibleStats } = require("../active-citizen/engine/analytics/plausible/manager.cjs");
const { countAllModeratedItemsByGroup } = require("../active-citizen/engine/moderation/get_moderation_items.cjs");
const { isValidDbId } = require("../utils/is_valid_db_id.cjs");
const { Sequelize } = require("sequelize");
const getFromAnalyticsApi = require('../active-citizen/engine/analytics/manager.cjs').getFromAnalyticsApi;
const triggerSimilaritiesTraining = require('../active-citizen/engine/analytics/manager.cjs').triggerSimilaritiesTraining;
const sendBackAnalyticsResultsOrError = require('../active-citizen/engine/analytics/manager.cjs').sendBackAnalyticsResultsOrError;
const countModelRowsByTimePeriod = require('../active-citizen/engine/analytics/statsCalc.cjs').countModelRowsByTimePeriod;
const getGroupIncludes = require('../active-citizen/engine/analytics/statsCalc.cjs').getGroupIncludes;
const getPointGroupIncludes = require('../active-citizen/engine/analytics/statsCalc.cjs').getPointGroupIncludes;
const getParsedSimilaritiesContent = require('../active-citizen/engine/analytics/manager.cjs').getParsedSimilaritiesContent;
const getTranslatedTextsForGroup = require('../active-citizen/utils/translation_helpers.cjs').getTranslatedTextsForGroup;
const updateTranslationForGroup = require('../active-citizen/utils/translation_helpers.cjs').updateTranslationForGroup;
const convertDocxSurveyToJson = require('../active-citizen/engine/analytics/manager.cjs').convertDocxSurveyToJson;
const copyGroup = require('../utils/copy_utils.cjs').copyGroup;
var s3 = new aws.S3({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    endpoint: process.env.S3_ENDPOINT || null,
    acl: 'public-read',
    region: process.env.S3_REGION || (process.env.S3_ENDPOINT ? null : 'us-east-1'),
});
var sendGroupOrError = function (res, group, context, user, error, errorStatus) {
    if (error || !group) {
        if (errorStatus === 404 || (error && error.message && error.message.indexOf("invalid input syntax for type integer") > -1)) {
            log.warn("Group Not Found", { context: context, group: toJson(group), user: toJson(user), err: error,
                errorStatus: 404 });
            errorStatus = 404;
        }
        else {
            log.error("Group Error", { context: context, group: toJson(group), user: toJson(user), err: error,
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
        res.send(group);
    }
};
var getGroupAndUser = function (groupId, userId, userEmail, callback) {
    var user, group;
    async.series([
        function (seriesCallback) {
            models.Group.findOne({
                where: {
                    id: groupId
                },
                attributes: models.Group.defaultAttributesPublic
            }).then(function (groupIn) {
                if (groupIn) {
                    group = groupIn;
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
            callback(null, group, user);
        }
    });
};
var truthValueFromBody = function (bodyParameter) {
    if (bodyParameter && bodyParameter != "") {
        return true;
    }
    else {
        return false;
    }
};
const moveGroupTo = (req, group) => {
    const splitMoveTo = req.body.moveGroupTo.split(" - ");
    const id = splitMoveTo[0];
    if (id && id.indexOf("C") > -1) {
        group.set('in_group_folder_id', null);
    }
    else if (!isNaN(id)) {
        if (parseInt(id) !== 0) {
            group.set('in_group_folder_id', parseInt(id));
        }
    }
};
var updateGroupConfigParameters = function (req, group) {
    if (!group.configuration) {
        group.set('configuration', {});
    }
    group.set('configuration.canVote', truthValueFromBody(req.body.canVote));
    group.set('configuration.canAddNewPosts', truthValueFromBody(req.body.canAddNewPosts));
    group.set('configuration.disableDebate', truthValueFromBody(req.body.disableDebate));
    group.set('configuration.locationHidden', truthValueFromBody(req.body.locationHidden));
    group.set('configuration.showWhoPostedPosts', truthValueFromBody(req.body.showWhoPostedPosts));
    group.set('configuration.allowAnonymousUsers', truthValueFromBody(req.body.allowAnonymousUsers));
    group.set('configuration.allowAnonymousAutoLogin', truthValueFromBody(req.body.allowAnonymousAutoLogin));
    group.set('configuration.anonymousAskRegistrationQuestions', truthValueFromBody(req.body.anonymousAskRegistrationQuestions));
    group.set('configuration.hideAllTabs', truthValueFromBody(req.body.hideAllTabs));
    group.set('configuration.hideNewPostOnPostPage', truthValueFromBody(req.body.hideNewPostOnPostPage));
    group.set('configuration.newPointOptional', truthValueFromBody(req.body.newPointOptional));
    group.set('configuration.hideHelpIcon', truthValueFromBody(req.body.hideHelpIcon));
    group.set('configuration.hideEmoji', truthValueFromBody(req.body.hideEmoji));
    group.set('configuration.hideGroupHeader', truthValueFromBody(req.body.hideGroupHeader));
    group.set('configuration.hidePointAuthor', truthValueFromBody(req.body.hidePointAuthor));
    group.set('configuration.hidePostAuthor', truthValueFromBody(req.body.hidePostAuthor));
    group.set('configuration.hideDownVoteForPost', truthValueFromBody(req.body.hideDownVoteForPost));
    group.set('configuration.attachmentsEnabled', truthValueFromBody(req.body.attachmentsEnabled));
    group.set('configuration.moreContactInformation', truthValueFromBody(req.body.moreContactInformation));
    group.set('configuration.moreContactInformationAddress', truthValueFromBody(req.body.moreContactInformationAddress));
    group.set('configuration.useContainImageMode', truthValueFromBody(req.body.useContainImageMode));
    group.set('configuration.endorsementButtons', (req.body.endorsementButtons && req.body.endorsementButtons != "") ? req.body.endorsementButtons : "hearts");
    group.set('configuration.alternativeHeader', (req.body.alternativeHeader && req.body.alternativeHeader != "") ? req.body.alternativeHeader : null);
    group.set('configuration.defaultLocationLongLat', (req.body.defaultLocationLongLat && req.body.defaultLocationLongLat != "") ? req.body.defaultLocationLongLat : null);
    group.set('configuration.postDescriptionLimit', (req.body.postDescriptionLimit && req.body.postDescriptionLimit != "") ? req.body.postDescriptionLimit : "500");
    if (truthValueFromBody(req.body.status)) {
        group.status = req.body.status;
    }
    if (truthValueFromBody(req.body.defaultLocale)) {
        group.set('configuration.defaultLocale', req.body.defaultLocale);
    }
    if (truthValueFromBody(req.body.uploadedDefaultDataImageId)) {
        group.set('configuration.defaultDataImageId', req.body.uploadedDefaultDataImageId);
    }
    if (truthValueFromBody(req.body.uploadedDefaultPostImageId)) {
        group.set('configuration.uploadedDefaultPostImageId', req.body.uploadedDefaultPostImageId);
    }
    group.set('configuration.alternativeTextForNewIdeaButton', (req.body.alternativeTextForNewIdeaButton && req.body.alternativeTextForNewIdeaButton !== "") ? req.body.alternativeTextForNewIdeaButton : null);
    group.set('configuration.alternativeTextForNewIdeaButtonClosed', (req.body.alternativeTextForNewIdeaButtonClosed && req.body.alternativeTextForNewIdeaButtonClosed !== "") ? req.body.alternativeTextForNewIdeaButtonClosed : null);
    group.set('configuration.alternativeTextForNewIdeaButtonHeader', (req.body.alternativeTextForNewIdeaButtonHeader && req.body.alternativeTextForNewIdeaButtonHeader !== "") ? req.body.alternativeTextForNewIdeaButtonHeader : null);
    group.set('configuration.alternativeTextForNewIdeaSaveButton', (req.body.alternativeTextForNewIdeaSaveButton && req.body.alternativeTextForNewIdeaSaveButton !== "") ? req.body.alternativeTextForNewIdeaSaveButton : null);
    group.set('configuration.customCategoryQuestionText', (req.body.customCategoryQuestionText && req.body.customCategoryQuestionText !== "") ? req.body.customCategoryQuestionText : null);
    group.set('configuration.alternativePointForHeader', (req.body.alternativePointForHeader && req.body.alternativePointForHeader != "") ? req.body.alternativePointForHeader : null);
    group.set('configuration.alternativePointAgainstHeader', (req.body.alternativePointAgainstHeader && req.body.alternativePointAgainstHeader != "") ? req.body.alternativePointAgainstHeader : null);
    group.set('configuration.alternativePointForLabel', (req.body.alternativePointForLabel && req.body.alternativePointForLabel != "") ? req.body.alternativePointForLabel : null);
    group.set('configuration.alternativePointAgainstLabel', (req.body.alternativePointAgainstLabel && req.body.alternativePointAgainstLabel != "") ? req.body.alternativePointAgainstLabel : null);
    group.set('configuration.disableFacebookLoginForGroup', truthValueFromBody(req.body.disableFacebookLoginForGroup));
    group.set('configuration.disableNameAutoTranslation', truthValueFromBody(req.body.disableNameAutoTranslation));
    group.set('configuration.externalGoalTriggerUrl', (req.body.externalGoalTriggerUrl && req.body.externalGoalTriggerUrl != "") ? req.body.externalGoalTriggerUrl : null);
    group.set('configuration.hideNewPost', truthValueFromBody(req.body.hideNewPost));
    group.set('configuration.disableCollectionUpLink', truthValueFromBody(req.body.disableCollectionUpLink));
    group.set('configuration.makeCategoryRequiredOnNewPost', truthValueFromBody(req.body.makeCategoryRequiredOnNewPost));
    group.set('configuration.showVideoUploadDisclaimer', truthValueFromBody(req.body.showVideoUploadDisclaimer));
    group.set('configuration.welcomePageId', (req.body.welcomePageId && req.body.welcomePageId != "") ? req.body.welcomePageId : null);
    group.set('configuration.hideVoteCount', truthValueFromBody(req.body.hideVoteCount));
    group.set('configuration.hideVoteCountUntilVoteCompleted', truthValueFromBody(req.body.hideVoteCountUntilVoteCompleted));
    group.set('configuration.hidePostCover', truthValueFromBody(req.body.hidePostCover));
    group.set('configuration.hidePostDescription', truthValueFromBody(req.body.hidePostDescription));
    group.set('configuration.hideDebateIcon', truthValueFromBody(req.body.hideDebateIcon));
    group.set('configuration.hideSharing', truthValueFromBody(req.body.hideSharing));
    group.set('configuration.hidePointAgainst', truthValueFromBody(req.body.hidePointAgainst));
    group.set('configuration.disablePostPageLink', truthValueFromBody(req.body.disablePostPageLink));
    group.set('configuration.hidePostActionsInGrid', truthValueFromBody(req.body.hidePostActionsInGrid));
    group.set('configuration.forceSecureSamlLogin', truthValueFromBody(req.body.forceSecureSamlLogin));
    group.set('configuration.forceSecureSamlEmployeeLogin', truthValueFromBody(req.body.forceSecureSamlEmployeeLogin));
    group.set('configuration.galleryMode', truthValueFromBody(req.body.galleryMode));
    group.set('configuration.showNameUnderLogoImage', truthValueFromBody(req.body.showNameUnderLogoImage));
    group.set('configuration.alwaysHideLogoImage', truthValueFromBody(req.body.alwaysHideLogoImage));
    group.set('configuration.hideStatsAndMembership', truthValueFromBody(req.body.hideStatsAndMembership));
    group.set('configuration.centerGroupName', truthValueFromBody(req.body.centerGroupName));
    group.set('configuration.noGroupCardShadow', truthValueFromBody(req.body.noGroupCardShadow));
    group.set('configuration.hideNewestFromFilter', truthValueFromBody(req.body.hideNewestFromFilter));
    group.set('configuration.hideGroupLevelTabs', truthValueFromBody(req.body.hideGroupLevelTabs));
    group.set('configuration.hidePostFilterAndSearch', truthValueFromBody(req.body.hidePostFilterAndSearch));
    group.set('configuration.hidePostImageUploads', truthValueFromBody(req.body.hidePostImageUploads));
    group.set('configuration.hideNewPointOnNewIdea', truthValueFromBody(req.body.hideNewPointOnNewIdea));
    group.set('configuration.maxDaysBackForRecommendations', (req.body.maxDaysBackForRecommendations && req.body.maxDaysBackForRecommendations != "") ? req.body.maxDaysBackForRecommendations : null);
    group.set('configuration.groupType', (req.body.groupType && req.body.groupType != "") ? req.body.groupType : null);
    group.set('configuration.externalId', (req.body.externalId && req.body.externalId != "") ? req.body.externalId : null);
    group.set('configuration.usePostListFormatOnDesktop', truthValueFromBody(req.body.usePostListFormatOnDesktop));
    group.set('configuration.usePostTagsForPostListItems', truthValueFromBody(req.body.usePostTagsForPostListItems));
    group.set('configuration.usePostTagsForPostCards', truthValueFromBody(req.body.usePostTagsForPostCards));
    group.set('configuration.usePostTags', truthValueFromBody(req.body.usePostTags));
    group.set('configuration.closeNewsfeedSubmissions', truthValueFromBody(req.body.closeNewsfeedSubmissions));
    group.set('configuration.hideNewsfeeds', truthValueFromBody(req.body.hideNewsfeeds));
    group.set('configuration.allowGenerativeImages', truthValueFromBody(req.body.allowGenerativeImages));
    group.set('configuration.askUserIfNameShouldBeDisplayed', truthValueFromBody(req.body.askUserIfNameShouldBeDisplayed));
    group.set('configuration.allowPostVideoUploads', truthValueFromBody(req.body.allowPostVideoUploads));
    group.set('configuration.allowPointVideoUploads', truthValueFromBody(req.body.allowPointVideoUploads));
    group.set('configuration.useVideoCover', truthValueFromBody(req.body.useVideoCover));
    group.set('configuration.videoPostUploadLimitSec', (req.body.videoPostUploadLimitSec && req.body.videoPostUploadLimitSec != "") ? req.body.videoPostUploadLimitSec : "60");
    group.set('configuration.videoPointUploadLimitSec', (req.body.videoPointUploadLimitSec && req.body.videoPointUploadLimitSec != "") ? req.body.videoPointUploadLimitSec : "30");
    if (group.configuration.videoPostUploadLimitSec && parseInt(group.configuration.videoPostUploadLimitSec)) {
        if (parseInt(group.configuration.videoPostUploadLimitSec) > 600) {
            group.set('configuration.videoPostUploadLimitSec', 600);
        }
    }
    if (group.configuration.videoPointUploadLimitSec && parseInt(group.configuration.videoPointUploadLimitSec)) {
        if (parseInt(group.configuration.videoPointUploadLimitSec) > 600) {
            group.set('configuration.videoPointUploadLimitSec', 600);
        }
    }
    group.set('configuration.customTitleQuestionText', (req.body.customTitleQuestionText && req.body.customTitleQuestionText != "") ? req.body.customTitleQuestionText : null);
    group.set('configuration.customFilterText', (req.body.customFilterText && req.body.customFilterText != "") ? req.body.customFilterText : null);
    group.set('configuration.customBackURL', (req.body.customBackURL && req.body.customBackURL != "") ? req.body.customBackURL : null);
    group.set('configuration.customBackName', (req.body.customBackName && req.body.customBackName != "") ? req.body.customBackName : null);
    group.set('configuration.customVoteUpHoverText', (req.body.customVoteUpHoverText && req.body.customVoteUpHoverText != "") ? req.body.customVoteUpHoverText : null);
    group.set('configuration.customVoteDownHoverText', (req.body.customVoteDownHoverText && req.body.customVoteDownHoverText != "") ? req.body.customVoteDownHoverText : null);
    group.set('configuration.hideRecommendationOnNewsFeed', truthValueFromBody(req.body.hideRecommendationOnNewsFeed));
    group.set('configuration.disableMachineTranscripts', truthValueFromBody(req.body.disableMachineTranscripts));
    group.set('configuration.hideLogoBoxExceptOnMobile', truthValueFromBody(req.body.hideLogoBoxExceptOnMobile));
    group.set('configuration.hideInfoBoxExceptForAdmins', truthValueFromBody(req.body.hideInfoBoxExceptForAdmins));
    group.set('configuration.hideLogoBoxShadow', truthValueFromBody(req.body.hideLogoBoxShadow));
    group.set('configuration.descriptionTruncateAmount', (req.body.descriptionTruncateAmount && req.body.descriptionTruncateAmount != "") ? req.body.descriptionTruncateAmount : null);
    group.set('configuration.descriptionSimpleFormat', truthValueFromBody(req.body.descriptionSimpleFormat));
    group.set('configuration.transcriptSimpleFormat', truthValueFromBody(req.body.transcriptSimpleFormat));
    group.set('configuration.allowPostAudioUploads', truthValueFromBody(req.body.allowPostAudioUploads));
    group.set('configuration.allowPointAudioUploads', truthValueFromBody(req.body.allowPointAudioUploads));
    group.set('configuration.useAudioCover', truthValueFromBody(req.body.useAudioCover));
    group.set('configuration.audioPostUploadLimitSec', (req.body.audioPostUploadLimitSec && req.body.audioPostUploadLimitSec != "") ? req.body.audioPostUploadLimitSec : "60");
    group.set('configuration.audioPointUploadLimitSec', (req.body.audioPointUploadLimitSec && req.body.audioPointUploadLimitSec != "") ? req.body.audioPointUploadLimitSec : "30");
    if (group.configuration.audioPostUploadLimitSec && parseInt(group.configuration.audioPostUploadLimitSec)) {
        if (parseInt(group.configuration.audioPostUploadLimitSec) > 600) {
            group.set('configuration.audioPostUploadLimitSec', 600);
        }
    }
    group.set('configuration.maxNumberOfGroupVotes', (req.body.maxNumberOfGroupVotes && req.body.maxNumberOfGroupVotes != "") ? req.body.maxNumberOfGroupVotes : null);
    if (group.configuration.audioPointUploadLimitSec && parseInt(group.configuration.audioPointUploadLimitSec)) {
        if (parseInt(group.configuration.audioPointUploadLimitSec) > 600) {
            group.set('configuration.audioPointUploadLimitSec', 600);
        }
    }
    group.set('configuration.urlToReview', (req.body.urlToReview && req.body.urlToReview != "") ?
        req.body.urlToReview : null);
    group.set('configuration.urlToReviewActionText', (req.body.urlToReviewActionText && req.body.urlToReviewActionText != "") ?
        req.body.urlToReviewActionText : null);
    group.set('configuration.structuredQuestions', (req.body.structuredQuestions && req.body.structuredQuestions != "") ? req.body.structuredQuestions : null);
    if (group.configuration.structuredQuestions) {
        try {
            const cleaned = group.configuration.structuredQuestions.trim().replace(/\n/g, '').replace(/\r/g, '').replace(/"/, '"');
            const jsonArray = JSON.parse(cleaned);
            const updatedJsonArray = [];
            let questionIndex = 0;
            jsonArray.forEach((question, index) => {
                if (question.type.toLowerCase() === "textfield" ||
                    question.type.toLowerCase() === "textfieldlong" ||
                    question.type.toLowerCase() === "textarea" ||
                    question.type.toLowerCase() === "textarealong" ||
                    question.type.toLowerCase() === "numberfield" ||
                    question.type.toLowerCase() === "checkboxes" ||
                    question.type.toLowerCase() === "radios" ||
                    question.type.toLowerCase() === "dropdown") {
                    question.questionIndex = questionIndex += 1;
                }
                updatedJsonArray.push(question);
            });
            group.set('configuration.structuredQuestionsJson', updatedJsonArray);
        }
        catch (error) {
            group.set('configuration.structuredQuestionsJson', null);
            log.error("Error in parsing structured questions", { error });
        }
    }
    else {
        group.set('configuration.structuredQuestionsJson', null);
    }
    group.set('configuration.registrationQuestions', (req.body.registrationQuestions && req.body.registrationQuestions != "") ? req.body.registrationQuestions : null);
    if (group.configuration.registrationQuestions) {
        try {
            const cleaned = group.configuration.registrationQuestions.trim().replace(/\n/g, '').replace(/\r/g, '');
            const jsonArray = JSON.parse(cleaned);
            group.set('configuration.registrationQuestionsJson', jsonArray);
        }
        catch (error) {
            group.set('configuration.registrationQuestionsJson', null);
            log.error("Error in parsing registrationQuestions", { error });
        }
    }
    else {
        group.set('configuration.registrationQuestionsJson', null);
    }
    group.set('configuration.isDataVisualizationGroup', truthValueFromBody(req.body.isDataVisualizationGroup));
    group.set('configuration.dataForVisualization', (req.body.dataForVisualization && req.body.dataForVisualization != "") ? req.body.dataForVisualization : null);
    if (group.configuration.dataForVisualization) {
        try {
            const cleaned = group.configuration.dataForVisualization.trim().replace(/\n/g, '').replace(/\r/g, '');
            const jsonArray = JSON.parse(cleaned);
            group.set('configuration.dataForVisualizationJson', jsonArray);
        }
        catch (error) {
            group.set('configuration.dataForVisualizationJson', null);
            log.error("Error in parsing dataForVisualization", { error });
        }
    }
    else {
        group.set('configuration.dataForVisualizationJson', null);
    }
    const ltpConfigText = (req.body.ltp && req.body.ltp != "") ? req.body.ltp : null;
    if (ltpConfigText) {
        try {
            const cleaned = ltpConfigText.trim().replace(/\n/g, '').replace(/\r/g, '');
            const parsedJson = JSON.parse(cleaned);
            group.set('configuration.ltp', parsedJson);
        }
        catch (error) {
            group.set('configuration.ltp', null);
            log.error("Error in parsing ltp", { error });
        }
    }
    else {
        group.set('configuration.ltp', null);
    }
    const allOurIdeas = (req.body.allOurIdeas && req.body.allOurIdeas != "") ? req.body.allOurIdeas : null;
    if (allOurIdeas) {
        try {
            const cleaned = allOurIdeas.trim().replace(/\n/g, '').replace(/\r/g, '');
            const parsedJson = JSON.parse(cleaned);
            group.set('configuration.allOurIdeas', parsedJson);
        }
        catch (error) {
            group.set('configuration.allOurIdeas', null);
            log.error("Error in parsing allOurIdeas", { error });
        }
    }
    else {
        group.set('configuration.allOurIdeas', null);
    }
    const staticHtml = (req.body.staticHtml && req.body.staticHtml != "") ? req.body.staticHtml : null;
    if (staticHtml) {
        try {
            const cleaned = staticHtml.trim().replace(/\n/g, '').replace(/\r/g, '');
            const parsedJson = JSON.parse(cleaned);
            group.set('configuration.staticHtml', parsedJson);
        }
        catch (error) {
            group.set('configuration.staticHtml', undefined);
            log.error("Error in parsing staticHtml", { error });
        }
    }
    else {
        group.set('configuration.staticHtml', undefined);
    }
    const theme = (req.body.theme && req.body.theme != "") ? req.body.theme : null;
    if (theme) {
        try {
            const cleaned = theme.trim().replace(/\n/g, '').replace(/\r/g, '');
            const parsedJson = JSON.parse(cleaned);
            group.set('configuration.theme', parsedJson);
        }
        catch (error) {
            group.set('configuration.theme', null);
            log.error("Error in parsing theme", { error });
        }
    }
    else {
        group.set('configuration.theme', null);
    }
    group.set('configuration.themeOverrideColorPrimary', (req.body.themeOverrideColorPrimary && req.body.themeOverrideColorPrimary != "") ? req.body.themeOverrideColorPrimary : null);
    group.set('configuration.themeOverrideColorAccent', (req.body.themeOverrideColorAccent && req.body.themeOverrideColorAccent != "") ? req.body.themeOverrideColorAccent : null);
    group.set('configuration.customUserNamePrompt', (req.body.customUserNamePrompt && req.body.customUserNamePrompt != "") ? req.body.customUserNamePrompt : null);
    group.set('configuration.customTermsIntroText', (req.body.customTermsIntroText && req.body.customTermsIntroText != "") ? req.body.customTermsIntroText : null);
    const customRatingsText = (req.body.customRatingsText && req.body.customRatingsText != "") ? req.body.customRatingsText : null;
    group.set('configuration.customRatingsText', customRatingsText);
    if (customRatingsText) {
        var ratingsComponents = customRatingsText.split(",");
        let ratings = [];
        if (ratingsComponents && ratingsComponents.length > 2) {
            for (var i = 0; i < ratingsComponents.length; i += 3) {
                ratings.push({ name: ratingsComponents[i], numberOf: ratingsComponents[i + 1], emoji: ratingsComponents[i + 2] });
            }
            group.set('configuration.customRatings', ratings);
        }
        else {
            log.error("Ratings not in correct format for customRatings");
        }
    }
    else {
        group.set('configuration.customRatings', null);
    }
    group.set('configuration.customTabTitleNewLocation', (req.body.customTabTitleNewLocation && req.body.customTabTitleNewLocation !== "") ? req.body.customTabTitleNewLocation : null);
    group.set('configuration.allowAdminsToDebate', truthValueFromBody(req.body.allowAdminsToDebate));
    group.set('configuration.allowAdminAnswersToPoints', truthValueFromBody(req.body.allowAdminAnswersToPoints));
    group.set('configuration.forcePostSortMethodAs', (req.body.forcePostSortMethodAs && req.body.forcePostSortMethodAs !== "") ? req.body.forcePostSortMethodAs : null);
    group.set('configuration.pointCharLimit', (req.body.pointCharLimit && req.body.pointCharLimit !== "") ? req.body.pointCharLimit : null);
    group.set('configuration.allPostsBlockedByDefault', truthValueFromBody(req.body.allPostsBlockedByDefault));
    group.set('configuration.customThankYouTextNewPosts', (req.body.customThankYouTextNewPosts && req.body.customThankYouTextNewPosts !== "") ? req.body.customThankYouTextNewPosts : null);
    group.set('configuration.useCommunityTopBanner', truthValueFromBody(req.body.useCommunityTopBanner));
    group.set('configuration.makeMapViewDefault', truthValueFromBody(req.body.makeMapViewDefault));
    group.set('configuration.allowOneTimeLoginWithName', truthValueFromBody(req.body.allowOneTimeLoginWithName));
    group.set('configuration.simpleFormatDescription', truthValueFromBody(req.body.simpleFormatDescription));
    group.set('configuration.resourceLibraryLinkMode', truthValueFromBody(req.body.resourceLibraryLinkMode));
    group.set('configuration.collapsableTranscripts', truthValueFromBody(req.body.collapsableTranscripts));
    group.set('configuration.customAdminCommentsTitle', (req.body.customAdminCommentsTitle && req.body.customAdminCommentsTitle !== "") ? req.body.customAdminCommentsTitle : null);
    group.set('configuration.themeOverrideBackgroundColor', (req.body.themeOverrideBackgroundColor && req.body.themeOverrideBackgroundColor != "") ? req.body.themeOverrideBackgroundColor : null);
    group.set('configuration.hideNameInputAndReplaceWith', (req.body.hideNameInputAndReplaceWith && req.body.hideNameInputAndReplaceWith != "") ? req.body.hideNameInputAndReplaceWith : null);
    group.set('configuration.hideMediaInput', truthValueFromBody(req.body.hideMediaInput));
    group.set('configuration.actAsLinkToCommunityId', (req.body.actAsLinkToCommunityId && req.body.actAsLinkToCommunityId != "") ? req.body.actAsLinkToCommunityId : null);
    group.set('configuration.hideQuestionIndexOnNewPost', truthValueFromBody(req.body.hideQuestionIndexOnNewPost));
    group.set('configuration.allowWhatsAppSharing', truthValueFromBody(req.body.allowWhatsAppSharing));
    group.set('configuration.inheritThemeFromCommunity', truthValueFromBody(req.body.inheritThemeFromCommunity));
    if (truthValueFromBody(req.body.inheritThemeFromCommunity) === true) {
        group.set('theme_id', null);
    }
    group.set('configuration.optionalSortOrder', (req.body.optionalSortOrder && req.body.optionalSortOrder != "") ? req.body.optionalSortOrder : null);
    group.set('configuration.exportSubCodesForRadiosAndCheckboxes', truthValueFromBody(req.body.exportSubCodesForRadiosAndCheckboxes));
    group.set('configuration.forceShowDebateCountOnPost', truthValueFromBody(req.body.forceShowDebateCountOnPost));
};
const getGroupFolder = function (req, done) {
    var groupFolder;
    log.info("getGroupFolder");
    async.series([
        function (seriesCallback) {
            models.Group.findOne({
                where: {
                    id: req.params.groupFolderId,
                    is_group_folder: true
                },
                attributes: models.Group.defaultAttributesPublic,
                required: false,
                order: [
                    ['counter_users', 'desc'],
                    [{ model: models.Image, as: 'GroupLogoImages' }, 'created_at', 'asc'],
                    [{ model: models.Image, as: 'GroupHeaderImages' }, 'created_at', 'asc'],
                    [{ model: models.Category }, 'name', 'asc']
                ],
                include: models.Group.masterGroupIncludes(models)
            }).then(function (group) {
                groupFolder = group;
                if (groupFolder) {
                    log.info('Group Folder Viewed', { groupFolderId: groupFolder.id, userId: req.user ? req.user.id : -1 });
                    models.Group.addVideosAndCommunityLinksToGroups([groupFolder], videoError => {
                        seriesCallback(videoError);
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
            const redisKey = "cache:groups_folder:" + groupFolder.id + ":" + models.Group.ACCESS_SECRET;
            req.redisClient.get(redisKey).then((groups) => {
                if (groups) {
                    groupFolder.dataValues.Groups = JSON.parse(groups);
                    seriesCallback();
                }
                else {
                    models.Group.findAll({
                        where: {
                            in_group_folder_id: groupFolder.id,
                            access: {
                                $ne: models.Group.ACCESS_SECRET
                            },
                            status: {
                                $ne: 'hidden'
                            },
                        },
                        attributes: models.Group.defaultAttributesPublic,
                        required: false,
                        order: [
                            ['counter_users', 'desc'],
                            [{ model: models.Image, as: 'GroupLogoImages' }, 'created_at', 'asc'],
                            [{ model: models.Image, as: 'GroupHeaderImages' }, 'created_at', 'asc'],
                            [{ model: models.Category }, 'name', 'asc']
                        ],
                        include: models.Group.masterGroupIncludes(models)
                    }).then(function (groups) {
                        groupFolder.dataValues.Groups = groups;
                        req.redisClient.setEx(redisKey, process.env.GROUPS_CACHE_TTL ? parseInt(process.env.GROUPS_CACHE_TTL) : 3, JSON.stringify(groups));
                        seriesCallback();
                    }).catch(error => {
                        seriesCallback(error);
                    });
                }
            }).catch(error => {
                seriesCallback(error);
            });
        },
        function (seriesCallback) {
            if (req.user && groupFolder) {
                var adminGroups, userGroups;
                async.parallel([
                    function (parallelCallback) {
                        models.Group.findAll({
                            where: {
                                in_group_folder_id: groupFolder.id
                            },
                            attributes: models.Group.defaultAttributesPublic,
                            order: [
                                ['counter_users', 'desc'],
                                [{ model: models.Image, as: 'GroupLogoImages' }, 'created_at', 'asc'],
                                [{ model: models.Image, as: 'GroupHeaderImages' }, 'created_at', 'asc'],
                                [{ model: models.Category }, 'name', 'asc']
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
                                in_group_folder_id: groupFolder.id
                            },
                            attributes: models.Group.defaultAttributesPublic,
                            order: [
                                ['counter_users', 'desc'],
                                [{ model: models.Image, as: 'GroupLogoImages' }, 'created_at', 'asc'],
                                [{ model: models.Image, as: 'GroupHeaderImages' }, 'created_at', 'asc'],
                                [{ model: models.Category }, 'name', 'asc']
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
                        var combinedGroups = _.concat(userGroups, groupFolder.dataValues.Groups);
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
                        models.Group.addVideosAndCommunityLinksToGroups(combinedGroups, videoError => {
                            groupFolder.dataValues.Groups = combinedGroups;
                            seriesCallback(videoError);
                        });
                    }
                });
            }
            else {
                models.Group.addVideosAndCommunityLinksToGroups(groupFolder.dataValues.Groups, videoError => {
                    seriesCallback(videoError);
                });
            }
        }
    ], function (error) {
        done(error, groupFolder);
    });
};
router.post('/:id/getPresignedAttachmentURL', auth.can('add to group'), function (req, res) {
    const endPoint = process.env.S3_ENDPOINT || "s3.amazonaws.com";
    const accelEndPoint = process.env.S3_ACCELERATED_ENDPOINT || process.env.S3_ENDPOINT || "s3.amazonaws.com";
    const s3 = new aws.S3({
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        endpoint: accelEndPoint,
        signatureVersion: 'v4',
        useAccelerateEndpoint: process.env.S3_ACCELERATED_ENDPOINT != null,
        region: process.env.S3_REGION ? process.env.S3_REGION : 'eu-west-1',
        s3ForcePathStyle: process.env.S3_FORCE_PATH_STYLE ? true : false
    });
    const signedUrlExpireSeconds = 60 * 60;
    const bucketName = process.env.S3_ATTACHMENTS_BUCKET;
    //  const contentType = req.body.contentType ? req.body.contentType : 'application/octet-stream';
    const contentType = req.body.contentType ? req.body.contentType : 'application/octet-stream';
    const randomCode = Math.random().toString(36).substring(2, 9);
    const fileKey = randomCode + "/" + req.body.filename;
    const s3Params = {
        Bucket: bucketName,
        Key: fileKey,
        Expires: signedUrlExpireSeconds,
        ACL: process.env.S3_FORCE_PATH_STYLE ? undefined : 'public-read',
        ContentType: contentType
    };
    s3.getSignedUrl('putObject', s3Params, (error, url) => {
        if (error) {
            log.error('Error getting presigned attachment url from AWS S3', { error });
            res.sendStatus(500);
        }
        else {
            log.info('Presigned URL:', { url });
            res.send({ presignedUrl: url });
        }
    });
});
router.delete('/:groupId/:activityId/delete_activity', auth.can('edit group'), function (req, res) {
    models.AcActivity.findOne({
        where: {
            group_id: req.params.groupId,
            id: req.params.activityId
        }
    }).then(function (activity) {
        activity.deleted = true;
        activity.save().then(function () {
            res.send({ activityId: activity.id });
        });
    }).catch(function (error) {
        log.error('Could not delete activity for group', {
            err: error,
            context: 'delete_activity',
            user: toJson(req.user.simple())
        });
        res.sendStatus(500);
    });
});
router.delete('/:groupId/user_membership', auth.isLoggedInNoAnonymousCheck, auth.can('view group'), function (req, res) {
    getGroupAndUser(req.params.groupId, req.user.id, null, function (error, group, user) {
        if (error) {
            log.error('Could not remove user', { err: error, groupId: req.params.groupId, userRemovedId: req.user.id, context: 'user_membership', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else if (user && group) {
            group.removeGroupUsers(user).then(function (results) {
                log.info('User removed', { context: 'remove_admin', groupId: req.params.groupId, userRemovedId: req.user.id, user: toJson(req.user.simple()) });
                res.send({ membershipValue: false, name: group.name });
            });
        }
        else {
            res.sendStatus(404);
        }
    });
});
router.post('/:groupId/user_membership', auth.isLoggedInNoAnonymousCheck, auth.can('add to group'), function (req, res) {
    getGroupAndUser(req.params.groupId, req.user.id, null, function (error, group, user) {
        if (error) {
            log.error('Could not add user', { err: error, groupId: req.params.groupId, userRemovedId: req.user.id, context: 'user_membership', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else if (user && group) {
            group.addGroupUsers(user).then(function (results) {
                log.info('User Added', { context: 'user_membership', groupId: req.params.groupId, userRemovedId: req.user.id, user: toJson(req.user.simple()) });
                res.send({ membershipValue: true, name: group.name });
            });
        }
        else {
            res.sendStatus(404);
        }
    });
});
router.post('/:groupId/:userEmail/invite_user', auth.can('edit group'), function (req, res) {
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
            if (!req.query.addToGroupDirectly) {
                models.Invite.create({
                    token: token,
                    expires_at: Date.now() + (3600000 * 24 * 30 * 365 * 1000),
                    type: models.Invite.INVITE_TO_GROUP,
                    group_id: req.params.groupId,
                    domain_id: req.ypDomain.id,
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
            if (!req.query.addToGroupDirectly) {
                models.AcActivity.inviteCreated({
                    email: req.params.userEmail,
                    user_id: user ? user.id : null,
                    sender_user_id: req.user.id,
                    sender_name: req.user.name,
                    group_id: req.params.groupId,
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
            if (user && req.query.addToGroupDirectly) {
                models.Group.findOne({
                    where: {
                        id: req.params.groupId
                    },
                    attributes: ['id']
                }).then(group => {
                    if (group) {
                        group.addGroupUsers(user).then(() => {
                            callback();
                        }).catch(error => {
                            callback(error);
                        });
                    }
                    else {
                        callback("Can't find group");
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
            log.error('Send Invite Error', { user: user ? toJson(user) : null, context: 'invite_user', loggedInUser: toJson(req.user), err: error, errorStatus: 500 });
            res.sendStatus(500);
        }
        else {
            if (!user && req.query.addToGroupDirectly) {
                log.info('Send Invite User Not Found To add', { userEmail: req.params.userEmail, user: null, context: 'invite_user_community', loggedInUser: toJson(req.user) });
                res.sendStatus(404);
            }
            else {
                log.info('Send Invite Activity Created', { userEmail: req.params.userEmail, user: user ? toJson(user) : null, context: 'invite_user', loggedInUser: toJson(req.user) });
                res.sendStatus(200);
            }
        }
    });
});
router.post('/:groupId/add_page', auth.can('edit group'), function (req, res) {
    models.Page.newPage(req, { group_id: req.params.groupId, content: {}, title: {} }, function (error, pages) {
        if (error) {
            log.error('Could not create page for admin for group', { err: error, context: 'new_page', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else {
            log.info('New Community Page', { context: 'new_page', user: toJson(req.user.simple()) });
            res.sendStatus(200);
        }
    });
});
router.post('/:domainId/create_community_for_group', auth.can('create community'), function (req, res) {
    log.info("Creating Community for Group", { context: 'create', user: toJson(req.user) });
    var admin_email = req.user.email;
    var admin_name = "Administrator";
    var community = models.Community.build({
        name: "Community for Group: " + req.body.name,
        description: "Community for Group",
        access: 0,
        status: "hidden",
        domain_id: req.params.domainId,
        user_id: req.user.id,
        admin_email: admin_email,
        admin_name: admin_name,
        configuration: {
            theme: {
                oneColorScheme: "tonal",
                variant: "monochrome"
            },
            onlyAdminsCanCreateGroups: true,
        },
        hostname: req.body.hostname || `${uuidv4()}.${req.ypDomain.domain_name}`,
        user_agent: req.useragent.source,
        ip_address: req.clientIp
    });
    community.save().then(function (newCommunity) {
        log.info('Community Created', { domainId: newCommunity.domain_id, context: 'create', user: toJson(req.user) });
        req.params.communityId = newCommunity.id;
        newCommunity.updateAllExternalCounters(req, 'up', 'counter_communities', function () {
            newCommunity.addCommunityAdmins(req.user).then(function (results) {
                createGroup(req, res);
            });
        });
    }).catch(function (error) {
        log.error('Could not create community for group', { err: error, context: 'create', user: toJson(req.user) });
        res.sendStatus(500);
    });
});
router.post('/:communityId', auth.can('create group'), function (req, res) {
    createGroup(req, res);
});
router.delete('/:groupId/:userId/remove_admin', auth.can('edit group'), function (req, res) {
    getGroupAndUser(req.params.groupId, req.params.userId, null, function (error, group, user) {
        if (error) {
            log.error('Could not remove admin', { err: error, groupId: req.params.groupId, userRemovedId: req.params.userId, context: 'remove_admin', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else if (user && group) {
            group.removeGroupAdmins(user).then(function (results) {
                log.info('Admin removed', { context: 'remove_admin', groupId: req.params.groupId, userRemovedId: req.params.userId, user: toJson(req.user.simple()) });
                res.sendStatus(200);
            });
        }
        else {
            res.sendStatus(404);
        }
    });
});
router.delete('/:groupId/:userId/remove_promoter', auth.can('edit group'), function (req, res) {
    getGroupAndUser(req.params.groupId, req.params.userId, null, function (error, group, user) {
        if (error) {
            log.error('Could not remove promoter', { err: error, groupId: req.params.groupId, userRemovedId: req.params.userId, context: 'remove_promoter', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else if (user && group) {
            group.removeGroupPromoters(user).then(function (results) {
                log.info('Promoter removed', { context: 'remove_promoter', groupId: req.params.groupId, userRemovedId: req.params.userId, user: toJson(req.user.simple()) });
                res.sendStatus(200);
            });
        }
        else {
            res.sendStatus(404);
        }
    });
});
router.get('/:groupId/has_promotion_access', auth.can('view group'), async (req, res) => {
    if (req.user) {
        if (await req.user.hasPromotionAccess(req.params.groupId)) {
            res.sendStatus(200);
        }
        else {
            res.sendStatus(401);
        }
        ;
    }
    else {
        res.sendStatus(401);
    }
});
router.delete('/:groupId/remove_many_admins', auth.can('edit group'), function (req, res) {
    queue.add('process-deletion', { type: 'remove-many-group-admins', userIds: req.body.userIds, groupId: req.params.groupId }, 'high');
    log.info('Remove many admins started', { context: 'remove_many_admins', groupId: req.params.groupId, user: toJson(req.user.simple()) });
    res.sendStatus(200);
});
router.delete('/:groupId/remove_many_promoters', auth.can('edit group'), function (req, res) {
    queue.add('process-deletion', { type: 'remove-many-group-promoters', userIds: req.body.userIds, groupId: req.params.groupId }, 'high');
    log.info('Remove many promoters started', { context: 'remove_many_promoters', groupId: req.params.groupId, user: toJson(req.user.simple()) });
    res.sendStatus(200);
});
router.delete('/:groupId/remove_many_users_and_delete_content', auth.can('edit group'), function (req, res) {
    queue.add('process-deletion', { type: 'remove-many-group-users-and-delete-content', userIds: req.body.userIds, groupId: req.params.groupId }, 'high');
    log.info('Remove many and delete many users content', { context: 'remove_many_users_and_delete_content', groupId: req.params.groupId, user: toJson(req.user.simple()) });
    res.sendStatus(200);
});
router.delete('/:groupId/remove_many_users', auth.can('edit group'), function (req, res) {
    queue.add('process-deletion', { type: 'remove-many-group-users', userIds: req.body.userIds, groupId: req.params.groupId }, 'high');
    log.info('Remove many admins started', { context: 'remove_many_users', groupId: req.params.groupId, user: toJson(req.user.simple()) });
    res.sendStatus(200);
});
router.delete('/:groupId/:userId/remove_and_delete_user_content', auth.can('edit group'), function (req, res) {
    getGroupAndUser(req.params.groupId, req.params.userId, null, function (error, group, user) {
        if (error) {
            log.error('Could not remove_user', { err: error, groupId: req.params.groupId, userRemovedId: req.params.userId, context: 'remove_user', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else if (user && group) {
            group.removeGroupUsers(user).then(function (results) {
                if (group.counter_users > 0) {
                    group.decrement("counter_users");
                }
                queue.add('process-deletion', { type: 'delete-group-user-content', userId: req.params.userId, groupId: req.params.groupId }, 'high');
                log.info('User removed', { context: 'remove_and_delete_user_content', groupId: req.params.groupId, userRemovedId: req.params.userId, user: toJson(req.user.simple()) });
                res.sendStatus(200);
            });
        }
        else {
            res.sendStatus(404);
        }
    });
});
router.delete('/:groupId/:userId/remove_user', auth.can('edit group'), function (req, res) {
    getGroupAndUser(req.params.groupId, req.params.userId, null, function (error, group, user) {
        if (error) {
            log.error('Could not remove_user', { err: error, groupId: req.params.groupId, userRemovedId: req.params.userId, context: 'remove_user', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else if (user && group) {
            group.removeGroupUsers(user).then(function (results) {
                if (group.counter_users > 0) {
                    group.decrement("counter_users");
                }
                log.info('User removed', { context: 'remove_user', groupId: req.params.groupId, userRemovedId: req.params.userId, user: toJson(req.user.simple()) });
                res.sendStatus(200);
            });
        }
        else {
            res.sendStatus(404);
        }
    });
});
router.post('/:groupId/:email/add_admin', auth.can('edit group'), function (req, res) {
    getGroupAndUser(req.params.groupId, null, req.params.email, function (error, group, user) {
        if (error) {
            log.error('Could not add admin', { err: error, groupId: req.params.groupId, userAddEmail: req.params.email, context: 'add_admin', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else if (user && group) {
            group.addGroupAdmins(user).then(function (results) {
                log.info('Admin Added', { context: 'add_admin', groupId: req.params.groupId, userAddEmail: req.params.email, user: toJson(req.user.simple()) });
                res.sendStatus(200);
            });
        }
        else {
            res.sendStatus(404);
        }
    });
});
router.post('/:groupId/:email/add_promoter', auth.can('edit group'), function (req, res) {
    getGroupAndUser(req.params.groupId, null, req.params.email, function (error, group, user) {
        if (error) {
            log.error('Could not add promoter', { err: error, groupId: req.params.groupId, userAddEmail: req.params.email, context: 'add_promoter', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else if (user && group) {
            group.addGroupPromoters(user).then(function (results) {
                log.info('Promoter Added', { context: 'add_promoter', groupId: req.params.groupId, userAddEmail: req.params.email, user: toJson(req.user.simple()) });
                res.sendStatus(200);
            });
        }
        else {
            res.sendStatus(404);
        }
    });
});
router.get('/:groupId/pages', auth.can('view group'), function (req, res) {
    const redisKey = "cache:groupPages:" + req.params.groupId;
    req.redisClient.get(redisKey).then(pages => {
        if (pages) {
            res.send(JSON.parse(pages));
        }
        else {
            models.Group.findOne({
                where: { id: req.params.groupId },
                attributes: ['id'],
                include: [
                    {
                        model: models.Community,
                        attributes: ['id'],
                        include: [
                            {
                                model: models.Domain,
                                attributes: ['id']
                            }
                        ]
                    }
                ]
            }).then(function (group) {
                models.Page.getPages(req, {
                    group_id: req.params.groupId,
                    community_id: group.Community.id,
                    domain_id: group.Community.Domain.id
                }, function (error, pages) {
                    if (error) {
                        log.error('Could not get pages for group', {
                            err: error,
                            context: 'pages',
                            user: req.user ? toJson(req.user.simple()) : null
                        });
                        res.sendStatus(500);
                    }
                    else {
                        log.info('Got Pages', { userId: req.user ? req.user.id : null });
                        req.redisClient.setEx(redisKey, process.env.PAGES_CACHE_TTL ? parseInt(process.env.PAGES_CACHE_TTL) : 3, JSON.stringify(pages));
                        res.send(pages);
                    }
                });
                return null;
            }).catch(function (error) {
                log.error('Could not get pages for group', {
                    err: error,
                    context: 'pages',
                    user: req.user ? toJson(req.user.simple()) : null
                });
                res.sendStatus(500);
            });
        }
    }).catch(error => {
        log.error('Could not get pages for group from redis', {
            err: error,
            context: 'pages',
            userId: req.user ? req.user.id : null
        });
        res.sendStatus(500);
    });
});
router.get('/:groupId/pages_for_admin', auth.can('edit group'), function (req, res) {
    models.Page.getPagesForAdmin(req, { group_id: req.params.groupId }, function (error, pages) {
        if (error) {
            log.error('Could not get page for admin for group', { err: error, context: 'pages_for_admin', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else {
            log.info('Got Pages For Admin', { context: 'pages_for_admin', userId: req.user ? req.user.id : null });
            res.send(pages);
        }
    });
});
router.put('/:groupId/:type/start_report_creation', auth.can('edit group'), function (req, res) {
    models.AcBackgroundJob.createJob({}, {}, (error, jobId) => {
        if (error) {
            log.error('Could not create backgroundJob', { err: error, context: 'start_report_creation', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else {
            let reportType;
            if (req.params.type === 'docx') {
                reportType = 'start-docx-report-generation';
            }
            else if (req.params.type === 'xls') {
                reportType = 'start-xls-report-generation';
            }
            queue.add('process-reports', {
                type: reportType,
                userId: req.user.id,
                exportType: req.params.type,
                translateLanguage: req.query.translateLanguage,
                jobId: jobId,
                groupId: req.params.groupId
            }, 'critical');
            res.send({ jobId });
        }
    });
});
router.get('/:groupId/:jobId/report_creation_progress', auth.can('edit group'), function (req, res) {
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
//TODO: Fix this permission back to edit
router.post('/:groupId/:start_generating_ai_image', auth.can('view group'), function (req, res) {
    models.AcBackgroundJob.createJob({}, {}, (error, jobId) => {
        if (error) {
            log.error('Could not create backgroundJob', { err: error, context: 'start_generating_ai_image', user: req.user ? toJson(req.user.simple()) : null });
            res.sendStatus(500);
        }
        else {
            queue.add('process-generative-ai', {
                type: "collection-image",
                //TODO: Look into this
                userId: req.user ? req.user.id : 1,
                jobId: jobId,
                collectionId: req.params.groupId,
                collectionType: "group",
                prompt: req.body.prompt,
                imageType: req.body.imageType
            }, 'critical');
            res.send({ jobId });
        }
    });
});
//TODO: Fix this permission back to edit
router.get('/:groupId/:jobId/poll_for_generating_ai_image', auth.can('view group'), function (req, res) {
    models.AcBackgroundJob.findOne({
        where: {
            id: req.params.jobId
        },
        attributes: ['id', 'progress', 'error', 'data']
    }).then(job => {
        res.send(job);
    }).catch(error => {
        log.error('Could not get backgroundJob', { err: error, context: 'poll_for_generating_ai_image', user: req.user ? toJson(req.user.simple()) : null });
        res.sendStatus(500);
    });
});
router.get('/:groupId/export_group', auth.can('edit group'), function (req, res) {
    models.Group.findOne({
        where: {
            id: req.params.groupId
        },
        attributes: ["id", "name", "community_id", "configuration"]
    }).then(function (group) {
        if (group) {
            getExportFileDataForGroup(group, req.ypDomain.domain_name, function (error, fileData) {
                if (error) {
                    log.error('Could not export for group', { err: error, context: 'export_group', user: toJson(req.user.simple()) });
                    res.sendStatus(500);
                }
                else {
                    log.info('Got Export Admin', { context: 'export_group', user: toJson(req.user.simple()) });
                    var groupName = sanitizeFilename(group.name).replace(/ /g, '');
                    var dateString = moment(new Date()).format("DD_MM_YY_HH_mm");
                    var filename = 'ideas_and_points_group_export_' + group.community_id + '_' + req.params.groupId + '_' +
                        groupName + '_' + dateString + '.csv';
                    res.set({ 'content-type': 'application/octet-stream; charset=utf-8' });
                    res.charset = 'utf-8';
                    res.attachment(filename);
                    res.send(fileData);
                }
            });
        }
        else {
            log.error('Cant find group', { err: error, context: 'export_group', user: toJson(req.user.simple()) });
            res.sendStatus(404);
        }
    }).catch(function (error) {
        log.error('Could not export for group', { err: error, context: 'export_group', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    });
});
router.get('/:groupId/export_group_docx', auth.can('edit group'), async (req, res) => {
    models.Group.findOne({
        where: {
            id: req.params.groupId
        },
        attributes: ["id", "name", "community_id", "objectives", "configuration", "language"]
    }).then(function (group) {
        if (group) {
            exportGroupToDocx(group, req.ypDomain.domain_name, req.query.translateLanguage, function (error, fileData) {
                if (error) {
                    log.error('Could not export for group', { err: error, context: 'export_group', user: toJson(req.user.simple()) });
                    res.sendStatus(500);
                }
                else {
                    log.info('Got Export Admin', { context: 'export_group', user: toJson(req.user.simple()) });
                    var groupName = sanitizeFilename(group.name).replace(/ /g, '');
                    var dateString = moment(new Date()).format("DD_MM_YY_HH_mm");
                    var filename = 'ideas_and_points_group_export_' + group.community_id + '_' + req.params.groupId + '_' +
                        groupName + '_' + dateString + '.docx';
                    res.set({ 'content-type': 'application/application/vnd.openxmlformats-officedocument.wordprocessingml.document; charset=utf-8' });
                    res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
                    res.charset = 'utf-8';
                    res.attachment(filename);
                    res.send(fileData);
                }
            });
        }
        else {
            log.error('Cant find group', { err: error, context: 'export_group', user: toJson(req.user.simple()) });
            res.sendStatus(404);
        }
    }).catch(function (error) {
        log.error('Could not export for group', { err: error, context: 'export_group', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    });
});
router.put('/:groupId/:pageId/update_page_locale', auth.can('edit group'), function (req, res) {
    models.Page.updatePageLocale(req, { group_id: req.params.groupId, id: req.params.pageId }, function (error) {
        if (error) {
            log.error('Could not update locale for admin for group', { err: error, context: 'update_page_locale', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else {
            log.info('Community Page Locale Updated', { context: 'update_page_locale', user: toJson(req.user.simple()) });
            res.sendStatus(200);
        }
    });
});
router.put('/:groupId/:pageId/update_page_weight', auth.can('edit group'), function (req, res) {
    models.Page.updatePageWeight(req, { group_id: req.params.groupId, id: req.params.pageId }, function (error) {
        if (error) {
            log.error('Could not update locale for admin for group', { err: error, context: 'update_page_locale', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else {
            log.info('Community Page Locale Updated', { context: 'update_page_locale', user: toJson(req.user.simple()) });
            res.sendStatus(200);
        }
    });
});
router.put('/:groupId/:pageId/publish_page', auth.can('edit group'), function (req, res) {
    models.Page.publishPage(req, { group_id: req.params.groupId, id: req.params.pageId }, function (error) {
        if (error) {
            log.error('Could not publish page for admin for group', { err: error, context: 'publish_page', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else {
            log.info('Community Page Published', { context: 'publish_page', user: toJson(req.user.simple()) });
            res.sendStatus(200);
        }
    });
});
router.put('/:groupId/:pageId/un_publish_page', auth.can('edit group'), function (req, res) {
    models.Page.unPublishPage(req, { group_id: req.params.groupId, id: req.params.pageId }, function (error) {
        if (error) {
            log.error('Could not un-publish page for admin for group', { err: error, context: 'un_publish_page', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else {
            log.info('Community Page Un-Published', { context: 'un_publish_page', user: toJson(req.user.simple()) });
            res.sendStatus(200);
        }
    });
});
router.delete('/:groupId/:pageId/delete_page', auth.can('edit group'), function (req, res) {
    models.Page.deletePage(req, { group_id: req.params.groupId, id: req.params.pageId }, function (error) {
        if (error) {
            log.error('Could not delete page for admin for group', { err: error, context: 'delete_page', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else {
            log.info('Commuity Page Published', { context: 'delete_page', user: toJson(req.user.simple()) });
            res.sendStatus(200);
        }
    });
});
router.post('/:groupId/post/news_story', auth.isLoggedInNoAnonymousCheck, auth.can('add to group'), function (req, res) {
    models.Point.createNewsStory(req, req.body, function (error) {
        if (error) {
            log.error('Could not save news story point on post', { err: error, context: 'news_story', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else {
            log.info('Point News Story Created', { context: 'news_story', user: toJson(req.user.simple()) });
            res.sendStatus(200);
        }
    });
});
router.post('/:groupId/news_story', auth.isLoggedInNoAnonymousCheck, auth.can('add to group'), function (req, res) {
    models.Point.createNewsStory(req, req.body, function (error, point) {
        if (error) {
            log.error('Could not save news story point on group', { err: error, context: 'news_story', user: toJson(req.user.simple()) });
            res.sendStatus(500);
        }
        else {
            log.info('Point News Story Created', { context: 'news_story', user: toJson(req.user.simple()) });
            res.send({
                point_id: point ? point.id : null
            });
        }
    });
});
router.get('/:groupId/admin_users', auth.can('edit group'), function (req, res) {
    models.Group.findOne({
        where: {
            id: req.params.groupId
        },
        include: [
            {
                model: models.User,
                attributes: _.concat(models.User.defaultAttributesWithSocialMediaPublicAndEmail, ['created_at', 'last_login_at']),
                as: 'GroupAdmins',
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
    }).then(function (group) {
        log.info('Got admin users', { context: 'admin_users', user: toJson(req.user.simple()) });
        if (group) {
            res.send(group.GroupAdmins);
        }
        else {
            res.send([]);
        }
    }).catch(function (error) {
        log.error('Could not get admin users', { err: error, context: 'admin_users', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    });
});
router.get('/:groupId/promotion_users', auth.can('edit group'), function (req, res) {
    models.Group.findOne({
        where: {
            id: req.params.groupId
        },
        include: [
            {
                model: models.User,
                attributes: _.concat(models.User.defaultAttributesWithSocialMediaPublicAndEmail, ['created_at', 'last_login_at']),
                as: 'GroupPromoters',
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
    }).then(function (group) {
        log.info('Got promotion users', { context: 'promotion_users', user: toJson(req.user.simple()) });
        if (group) {
            res.send(group.GroupPromoters);
        }
        else {
            res.send([]);
        }
    }).catch(function (error) {
        log.error('Could not get promotion users', { err: error, context: 'promotion_users', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    });
});
router.get('/:groupId/users', auth.can('edit group'), function (req, res) {
    models.Group.findOne({
        where: {
            id: req.params.groupId
        },
        include: [
            {
                model: models.User,
                attributes: _.concat(models.User.defaultAttributesWithSocialMediaPublicAndEmail, ['created_at', 'last_login_at']),
                as: 'GroupUsers',
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
    }).then(function (group) {
        log.info('Got users', { context: 'users', user: toJson(req.user.simple()) });
        if (group) {
            res.send(group.GroupUsers);
        }
        else {
            res.send([]);
        }
    }).catch(function (error) {
        log.error('Could not get admin users', { err: error, context: 'users', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    });
});
router.get('/:groupId/default_post_image/:imageId', auth.can('view group'), function (req, res) {
    models.Image.findOne({
        where: {
            id: req.params.imageId
        }
    }).then(function (image) {
        if (image) {
            var formats = JSON.parse(image.formats);
            res.redirect(formats[0]);
        }
        else {
            res.sendStatus(200);
        }
    }).catch(function (error) {
        log.error('Could not get image', { err: error, context: 'post_default_image' });
        res.sendStatus(500);
    });
});
const createGroup = (req, res) => {
    console.log("Creating group with community id: " + req.params.communityId);
    var group = models.Group.build({
        name: req.body.name,
        objectives: req.body.objectives || req.body.description,
        access: models.Group.convertAccessFromRadioButtons(req.body),
        domain_id: req.ypDomain.id,
        user_id: req.user.id,
        community_id: req.params.communityId,
        user_agent: req.useragent.source,
        ip_address: req.clientIp
    });
    group.theme_id = req.body.themeId ? parseInt(req.body.themeId) : null;
    if (req.body.in_group_folder_id) {
        group.in_group_folder_id = parseInt(req.body.in_group_folder_id);
    }
    if (req.body.is_group_folder && req.body.is_group_folder === "true") {
        group.is_group_folder = true;
    }
    group.access = models.Group.convertAccessFromRadioButtons(req.body);
    updateGroupConfigParameters(req, group);
    group.save().then(function (group) {
        log.info('Group Created', { groupId: group.id, context: 'create', userId: req.user.id });
        queue.add('process-similarities', { type: 'update-collection', groupId: group.id }, 'low');
        group.updateAllExternalCounters(req, 'up', 'counter_groups', function () {
            models.Group.addUserToGroupIfNeeded(group.id, req, function () {
                group.addGroupAdmins(req.user).then(function (results) {
                    group.setupImages(req, group.id, function (error) {
                        queue.add('process-moderation', {
                            type: 'estimate-collection-toxicity',
                            collectionId: group.id,
                            collectionType: 'group'
                        }, 'high');
                        queue.add('process-moderation', {
                            type: 'collection-review-and-annotate-images',
                            collectionId: group.id,
                            collectionType: 'group'
                        }, 'medium');
                        sendGroupOrError(res, group, 'setupImages', req.user, error);
                    });
                });
            });
        });
    }).catch(function (error) {
        sendGroupOrError(res, null, 'create', req.user, error);
    });
};
router.put('/:id', auth.can('edit group'), function (req, res) {
    models.Group.findOne({
        where: { id: req.params.id },
        order: [
            [{ model: models.Image, as: 'GroupLogoImages' }, 'created_at', 'asc'],
            [{ model: models.Image, as: 'GroupHeaderImages' }, 'created_at', 'asc'],
            [{ model: models.Video, as: "GroupLogoVideos" }, 'updated_at', 'desc'],
            [{ model: models.Video, as: "GroupLogoVideos" }, { model: models.Image, as: 'VideoImages' }, 'updated_at', 'asc'],
        ],
        include: [
            {
                model: models.Community,
                required: true,
                attributes: ['id', 'access']
            },
            {
                model: models.Image,
                as: 'GroupLogoImages',
                attributes: models.Image.defaultAttributesPublic,
                required: false
            },
            {
                model: models.Video,
                as: 'GroupLogoVideos',
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
            },
            {
                model: models.Image,
                as: 'GroupHeaderImages',
                attributes: models.Image.defaultAttributesPublic,
                required: false
            }
        ]
    }).then(function (group) {
        if (group) {
            group.name = req.body.name;
            group.objectives = req.body.objectives || req.body.description;
            group.theme_id = req.body.themeId ? parseInt(req.body.themeId) : null;
            group.access = models.Group.convertAccessFromRadioButtons(req.body);
            updateGroupConfigParameters(req, group);
            if (req.body.moveGroupTo) {
                moveGroupTo(req, group);
            }
            group.save().then(function () {
                log.info('Group Updated', { group: toJson(group), context: 'update', user: toJson(req.user) });
                queue.add('process-similarities', { type: 'update-collection', groupId: group.id }, 'low');
                group.setupImages(req, req.params.id, function (error) {
                    queue.add('process-moderation', {
                        type: 'estimate-collection-toxicity',
                        collectionId: group.id,
                        collectionType: 'group'
                    }, 'high');
                    queue.add('process-moderation', {
                        type: 'collection-review-and-annotate-images',
                        collectionId: group.id,
                        collectionType: 'group'
                    }, 'medium');
                    sendGroupOrError(res, group, 'setupImages', req.user, error);
                });
            }).catch(function (error) {
                sendGroupOrError(res, null, 'update', req.user, error);
            });
        }
        else {
            sendGroupOrError(res, req.params.id, 'update', req.user, 'Not found', 404);
        }
    }).catch(function (error) {
        sendGroupOrError(res, null, 'update', req.user, error);
    });
});
router.delete('/:id', auth.can('edit group'), function (req, res) {
    models.Group.findOne({
        where: { id: req.params.id }
    }).then(function (group) {
        if (group) {
            group.deleted = true;
            group.save().then(function () {
                log.info('Group Deleted', { group: toJson(group), context: 'delete', user: toJson(req.user) });
                queue.add('process-similarities', { type: 'update-collection', groupId: group.id }, 'low');
                queue.add('process-deletion', { type: 'delete-group-content', resetCounters: true, groupName: group.name,
                    userId: req.user.id, groupId: group.id }, 'critical');
                group.updateAllExternalCounters(req, 'down', 'counter_groups', function () {
                    res.sendStatus(200);
                });
            });
        }
        else {
            sendGroupOrError(res, req.params.id, 'delete', req.user, 'Not found', 404);
        }
    }).catch(function (error) {
        sendGroupOrError(res, null, 'delete', req.user, error);
    });
});
router.delete('/:id/delete_content', auth.can('edit group'), function (req, res) {
    models.Group.findOne({
        where: { id: req.params.id }
    }).then(function (group) {
        if (group) {
            log.info('Group Delete Content', { group: toJson(group), context: 'delete', user: toJson(req.user) });
            queue.add('process-deletion', { type: 'delete-group-content', groupName: group.name,
                userId: req.user.id, groupId: group.id, useNotification: true,
                resetCounters: true }, 'critical');
            res.sendStatus(200);
        }
        else {
            sendGroupOrError(res, req.params.id, 'delete', req.user, 'Not found', 404);
        }
    }).catch(function (error) {
        sendGroupOrError(res, null, 'delete', req.user, error);
    });
});
router.delete('/:id/anonymize_content', auth.can('edit group'), function (req, res) {
    const anonymizationDelayMs = 1000 * 60 * 60 * 24 * 7;
    models.Group.findOne({
        where: { id: req.params.id }
    }).then(function (group) {
        if (group) {
            log.info('Group Anonymize Content with delay', { group: toJson(group), anonymizationDelayMs: anonymizationDelayMs,
                context: 'delete', userId: toJson(req.user.id) });
            queue.add('process-anonymization', { type: 'notify-group-users', groupName: group.name,
                userId: req.user.id, groupId: group.id, delayMs: anonymizationDelayMs }, 'high');
            queue.add('process-anonymization', { type: 'anonymize-group-content', groupName: group.name,
                userId: req.user.id, groupId: group.id, useNotification: true,
                resetCounters: true }, 'high', { delay: anonymizationDelayMs });
            res.sendStatus(200);
        }
        else {
            sendGroupOrError(res, req.params.id, 'delete', req.user, 'Not found', 404);
        }
    }).catch(function (error) {
        sendGroupOrError(res, null, 'delete', req.user, error);
    });
});
router.post('/:id/clone', auth.can('edit group'), function (req, res) {
    models.Group.findOne({
        attributes: ['id', 'community_id'],
        where: { id: req.params.id },
        include: [
            {
                model: models.Community,
                attributes: ['id', 'domain_id'],
                include: [
                    {
                        model: models.Domain,
                        attributes: ['id']
                    }
                ]
            }
        ]
    }).then(function (group) {
        if (group) {
            copyGroup(group.id, group.Community, group.Community.domain_id, { skipUser: true, skipActivities: true }, (error) => {
                if (error) {
                    log.error('Group Cloned Failed', { error, groupId: req.params.id });
                    res.sendStatus(500);
                }
                else {
                    log.info('Group Cloned', { groupId: req.params.id });
                    res.sendStatus(200);
                }
            });
        }
        else {
            sendGroupOrError(res, req.params.id, 'delete', req.user, 'Not found', 404);
        }
    }).catch(function (error) {
        sendGroupOrError(res, null, 'delete', req.user, error);
    });
});
router.get('/:id/checkNonOpenPosts', auth.can('view group'), (req, res) => {
    var PostsByNotOpen = models.Post.scope('not_open');
    PostsByNotOpen.count({ where: { group_id: req.params.id } }).then(function (count) {
        res.send({ hasNonOpenPosts: count != 0 });
    }).catch(function (error) {
        sendGroupOrError(res, null, 'checkNonOpenPosts', req.user, error);
    });
});
router.get('/:id/configuration', auth.can('view group'), (req, res) => {
    models.Group.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'configuration']
    }).then(group => {
        res.send(group.configuration);
    }).catch(error => {
        sendGroupOrError(res, null, 'configuration', req.user, error);
    });
});
const addVideosToGroup = (group, done) => {
    models.Video.findAll({
        attributes: ['id', 'formats', 'viewable', 'created_at', 'public_meta'],
        include: [
            {
                model: models.Image,
                as: 'VideoImages',
                attributes: ["formats", 'created_at'],
                required: false
            },
            {
                model: models.Group,
                where: {
                    id: group.id
                },
                as: 'GroupLogoVideos',
                required: true,
                attributes: ['id']
            }
        ],
        order: [
            [{ model: models.Image, as: 'VideoImages' }, 'created_at', 'asc']
        ]
    }).then(videos => {
        group.dataValues.GroupLogoVideos = _.orderBy(videos, ['created_at'], ['desc']);
        done();
    }).catch(error => {
        done(error);
    });
};
router.get('/:groupFolderId/groupFolder', auth.can('view group'), function (req, res) {
    if (isValidDbId(req.params.groupFolderId)) {
        getGroupFolder(req, function (error, groupFolder) {
            if (error) {
                log.error('Could not get groupFolder', {
                    err: error,
                    groupFolderId: req.params.groupFolderId,
                    user: req.user ? toJson(req.user.simple()) : null
                });
                res.sendStatus(500);
            }
            else if (groupFolder) {
                res.send({ group: groupFolder });
            }
            else {
                res.sendStatus(404);
            }
        });
    }
    else {
        res.sendStatus(404);
    }
});
router.get('/:id', auth.can('view group'), function (req, res) {
    if (isValidDbId(req.params.id)) {
        models.Group.findOne({
            where: { id: req.params.id },
            attributes: models.Group.defaultAttributesPublic,
            order: [
                [{ model: models.Image, as: 'GroupLogoImages' }, 'created_at', 'asc'],
                [{ model: models.Image, as: 'GroupHeaderImages' }, 'created_at', 'asc'],
                [{ model: models.Category }, { model: models.Image, as: 'CategoryIconImages' }, 'updated_at', 'asc'],
                [{ model: models.Category }, 'name', 'asc'],
                [{ model: models.Community }, { model: models.Image, as: 'CommunityHeaderImages' }, 'created_at', 'asc']
            ],
            include: [
                {
                    model: models.Community,
                    attributes: ['id', 'theme_id', 'name', 'access', 'google_analytics_code', 'configuration', 'language', 'only_admins_can_create_groups'],
                    include: [
                        {
                            model: models.Domain,
                            attributes: ['id', 'theme_id', 'name', 'configuration']
                        },
                        {
                            model: models.Image,
                            as: 'CommunityHeaderImages',
                            attributes: models.Image.defaultAttributesPublic,
                            required: false
                        }
                    ]
                },
                {
                    model: models.Group,
                    required: false,
                    as: 'GroupFolder',
                    attributes: ['id', 'name']
                },
                {
                    model: models.Category,
                    required: false,
                    include: [
                        {
                            model: models.Image,
                            required: false,
                            as: 'CategoryIconImages',
                            attributes: models.Image.defaultAttributesPublic,
                            order: [
                                [{ model: models.Image, as: 'CategoryIconImages' }, 'updated_at', 'asc']
                            ]
                        }
                    ]
                },
                {
                    model: models.Image,
                    as: 'GroupLogoImages',
                    attributes: models.Image.defaultAttributesPublic,
                    required: false
                },
                {
                    model: models.Image,
                    as: 'GroupHeaderImages',
                    attributes: models.Image.defaultAttributesPublic,
                    required: false
                }
            ]
        }).then(function (group) {
            if (group) {
                addVideosToGroup(group, (error) => {
                    if (error) {
                        sendGroupOrError(res, null, 'count_posts', req.user, error);
                    }
                    else {
                        log.info('Group Viewed', { id: group.id, userId: req.user ? req.user.id : -1 });
                        var PostsByNotOpen = models.Post.scope('not_open');
                        PostsByNotOpen.count({ where: { group_id: req.params.id } }).then(function (count) {
                            res.send({ group: group, hasNonOpenPosts: count != 0 });
                        }).catch(function (error) {
                            sendGroupOrError(res, null, 'count_posts', req.user, error);
                        });
                    }
                });
            }
            else {
                sendGroupOrError(res, req.params.id, 'view', req.user, 'Not found', 404);
            }
            return null;
        }).catch(function (error) {
            sendGroupOrError(res, null, 'view', req.user, error);
        });
    }
    else {
        res.sendStatus(404);
    }
});
const allowedTextTypesForGroup = [
    "alternativeTextForNewIdeaButton",
    "alternativeTextForNewIdeaButtonClosed",
    "alternativeTextForNewIdeaButtonHeader",
    "alternativeTextForNewIdeaSaveButton",
    "customCategoryQuestionText",
    "alternativePointForHeader",
    "customThankYouTextNewPosts",
    "customTitleQuestionText",
    "customFilterText",
    "customTabTitleNewLocation",
    "alternativePointAgainstHeader",
    "alternativePointForLabel",
    "alternativePointAgainstLabel",
    "customAdminCommentsTitle",
    "urlToReviewActionText",
    "aoiWelcomeMessage",
    "aoiWelcomeHtml",
    "aoiQuestionText",
    "aoiAnswerText"
];
router.get('/:id/translatedText', auth.can('view group'), function (req, res) {
    if (req.query.textType.indexOf("group") > -1 || allowedTextTypesForGroup.indexOf(req.query.textType) > -1) {
        models.Group.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'name', 'objectives', 'configuration']
        }).then(function (group) {
            if (group) {
                models.AcTranslationCache.getTranslation(req, group, function (error, translation) {
                    if (error) {
                        sendGroupOrError(res, req.params.id, 'translated', req.user, error, 500);
                    }
                    else {
                        res.send(translation);
                    }
                });
                log.info('Group translatedTitle', { context: 'translated' });
            }
            else {
                sendGroupOrError(res, req.params.id, 'translated', req.user, 'Not found', 404);
            }
        }).catch(function (error) {
            sendGroupOrError(res, null, 'translated', req.user, error);
        });
    }
    else {
        sendGroupOrError(res, req.params.id, 'translated', req.user, 'Wrong textType', 401);
    }
});
router.get('/:id/translatedSurveyQuestions', auth.can('view group'), function (req, res) {
    const targetLanguage = req.query.targetLanguage;
    models.AcTranslationCache.getSurveyQuestionTranslations(req.params.id, targetLanguage, (error, translations) => {
        if (error) {
            sendGroupOrError(res, req.params.id, 'translatedSurveyQuestions', req.user, error, 500);
        }
        else {
            res.send(translations);
        }
    });
});
router.get('/:id/translatedRegistrationQuestions', auth.can('view group'), function (req, res) {
    const targetLanguage = req.query.targetLanguage;
    models.AcTranslationCache.getRegistrationQuestionTranslations(req.params.id, targetLanguage, (error, translations) => {
        if (error) {
            sendGroupOrError(res, req.params.id, 'translatedRegistrationQuestions', req.user, error, 500);
        }
        else {
            res.send(translations);
        }
    });
});
router.get('/:id/search/:term', auth.can('view group'), function (req, res) {
    log.info('Group Search', { groupId: req.params.id, context: 'view', user: toJson(req.user) });
    models.Post.search(req.params.term, req.params.id, models.Category).then(function (posts) {
        posts = _.reject(posts, function (post) {
            return post.deleted == true;
        });
        res.send({
            posts: posts,
            totalPostsCount: posts.length
        });
    });
});
var getPostsWithAllFromIds = function (postsWithIds, postOrder, done) {
    var collectedIds = _.map(postsWithIds, function (post) {
        return post.id;
    });
    let posts;
    let videos;
    async.parallel([
        parallelCallback => {
            models.Post.findAll({
                where: {
                    id: {
                        $in: collectedIds
                    }
                },
                attributes: ['id', 'name', 'description', 'public_data', 'status', 'content_type', 'official_status', 'counter_endorsements_up', 'cover_media_type',
                    'counter_endorsements_down', 'group_id', 'language', 'counter_points', 'counter_flags', 'location', 'created_at', 'category_id'],
                order: [
                    models.sequelize.literal(postOrder),
                ],
                include: [
                    {
                        model: models.Category,
                        attributes: { exclude: ['ip_address', 'user_agent'] },
                        required: false,
                        include: [
                            {
                                model: models.Image,
                                required: false,
                                attributes: models.Image.defaultAttributesPublic,
                                as: 'CategoryIconImages'
                            }
                        ]
                    },
                    {
                        model: models.Audio,
                        required: false,
                        attributes: ['id', 'formats', 'updated_at', 'listenable'],
                        as: 'PostAudios',
                    },
                    {
                        model: models.User,
                        required: false,
                        attributes: models.User.defaultAttributesWithSocialMediaPublic,
                        include: [
                            {
                                model: models.Image, as: 'UserProfileImages',
                                attributes: ['id', "formats", 'updated_at'],
                                required: false
                            }
                        ]
                    },
                    {
                        model: models.Group,
                        required: true,
                        attributes: ['id', 'configuration', 'name', 'theme_id', 'access'],
                        include: [
                            {
                                model: models.Category,
                                required: false
                            },
                            {
                                model: models.Community,
                                attributes: ['id', 'name', 'theme_id', 'access', 'google_analytics_code', 'configuration', 'only_admins_can_create_groups'],
                                required: true
                            }
                        ]
                    },
                    { model: models.Image,
                        attributes: models.Image.defaultAttributesPublic,
                        as: 'PostHeaderImages',
                        required: false
                    }
                ]
            }).then(function (postsIn) {
                posts = postsIn;
                log.info("FINISHED POSTS A");
                posts.forEach(post => {
                    if (post.PostHeaderImages) {
                        post.PostHeaderImages = _.orderBy(post.PostHeaderImages, ['updated_at'], ['asc']);
                    }
                    if (post.Category && post.Category.CategoryIconImages) {
                        post.Category.CategoryIconImages = _.orderBy(post.Category.CategoryIconImages, ['updated_at'], ['asc']);
                    }
                    if (post.PostAudios) {
                        post.PostAudios = _.orderBy(post.PostAudios, ['updated_at'], ['desc']);
                    }
                    if (post.Group && post.Group.Categories) {
                        post.Group.Categories = _.orderBy(post.Group.Categories, ['name'], ['asc']);
                    }
                });
                parallelCallback();
            }).catch(function (error) {
                parallelCallback(error);
            });
        },
        parallelCallback => {
            models.Post.getVideosForPosts(collectedIds, (error, videosIn) => {
                log.info("GOT VIDEOS 1");
                if (error) {
                    parallelCallback(error);
                }
                else {
                    videos = videosIn;
                    parallelCallback();
                }
            });
        },
    ], error => {
        if (error) {
            done(error);
        }
        else {
            if (videos && videos.length > 0) {
                log.info("GOT VIDEOS 2");
                models.Post.addVideosToAllPosts(posts, videos);
            }
            else if (!videos) {
                log.error("No videos for getVideosForPosts");
            }
            log.info("FINISHED POSTS B");
            done(null, posts);
        }
    });
};
router.get('/:id/posts/:filter/:categoryId/:status?', auth.can('view group'), function (req, res) {
    const redisKey = `cache:posts:${req.params.id}:${req.params.filter}:${req.params.categoryId}:${req.params.status}:${req.query.offset}:${req.query.randomSeed}`;
    req.redisClient.get(redisKey).then((postsInfo) => {
        if (postsInfo) {
            res.send(JSON.parse(postsInfo));
        }
        else {
            models.Group.findOne({
                where: {
                    id: req.params.id
                },
                attributes: ['id', 'configuration']
            }).then((group) => {
                var where = { group_id: req.params.id, deleted: false };
                let attributes = ['id', 'status', 'name', 'official_status', 'language', 'counter_endorsements_up',
                    'counter_endorsements_down', 'created_at'];
                const includes = [];
                var postOrder = "(counter_endorsements_up-counter_endorsements_down) DESC";
                if (req.params.filter === "newest") {
                    postOrder = "created_at DESC";
                }
                else if (req.params.filter === "most_debated") {
                    postOrder = "counter_points DESC";
                }
                else if (req.params.filter === "random") {
                    postOrder = "created_at DESC";
                }
                else if (req.params.filter === "oldest") {
                    postOrder = "created_at ASC";
                }
                else if (req.params.filter === "alphabetical") {
                    postOrder = "name ASC";
                }
                let postOrderFinal = [
                    models.sequelize.literal(postOrder)
                ];
                let seqGroup = null;
                let ratingOrderNeeded = false;
                let limit = 20;
                var offset = 0;
                if (req.query.offset) {
                    offset = parseInt(req.query.offset);
                }
                let ratingOffset = offset;
                const ratingsPostLookup = {};
                if (req.params.filter === "top" &&
                    group.configuration &&
                    group.configuration.customRatings != null &&
                    group.configuration.customRatings.length > 0) {
                    const attrIncludes = [];
                    attrIncludes.push([models.sequelize.literal(`(
                    SELECT AVG(value)
                    FROM ratings AS rating
                    WHERE
                        rating.post_id = "Post".id
                )`),
                        'RatingAverage']);
                    attrIncludes.push([models.sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM ratings AS rating
                    WHERE
                        rating.post_id = "Post".id
                )`),
                        'RatingCount']);
                    //TODO: Include also just the attributes from above
                    attributes = {
                        include: attrIncludes
                    };
                    //postOrderFinal =  models.sequelize.literal("RatingAverage ASC");
                    ratingOrderNeeded = true;
                    //TODO: Get postgres ordering working with a count limit ORDER BY flag CASE
                    limit = 1500;
                    offset = 0;
                }
                if (req.params.categoryId != 'null') {
                    where['category_id'] = req.params.categoryId;
                }
                log.info('Posts', { gId: req.params.id, f: req.params.filter, cId: req.params.categoryId, uId: req.user ? req.user.id : -1 });
                if (['open', 'failed', 'successful', 'in_progress'].indexOf(req.params.status) > -1) {
                    var PostsByStatus = models.Post.scope(req.params.status);
                    PostsByStatus.findAndCountAll({
                        where: where,
                        attributes: attributes,
                        include: includes,
                        group: seqGroup,
                        order: postOrderFinal,
                        limit: limit,
                        offset: offset
                    }).then(function (postResults) {
                        log.info("Posts 2");
                        const posts = postResults.rows;
                        var totalPostsCount = postResults.count;
                        var postRows = posts;
                        if (req.params.filter === "random" && req.query.randomSeed && postRows.length > 0) {
                            postRows = seededShuffle(postRows, req.query.randomSeed);
                        }
                        if (ratingOrderNeeded) {
                            postRows = _.forEach(postRows, (post) => {
                                if (post.dataValues.RatingCount && post.dataValues.RatingAverage) {
                                    const ratingCount = parseInt(post.dataValues.RatingCount);
                                    const ratingAverage = parseFloat(post.dataValues.RatingAverage);
                                    // More than one round of full ratings for the rating to count towards top rating calc
                                    if (ratingCount > group.configuration.customRatings.length) {
                                        ratingsPostLookup[post.dataValues.id] = ratingAverage;
                                    }
                                    else {
                                        ratingsPostLookup[post.dataValues.id] = 0.0;
                                    }
                                }
                                else {
                                    ratingsPostLookup[post.dataValues.id] = 0.0;
                                }
                            });
                            postRows = _.orderBy(postRows, [(post) => {
                                    return ratingsPostLookup[post.dataValues.id];
                                }], ['desc']);
                            if (ratingOffset) {
                                postRows = _.drop(postRows, ratingOffset);
                            }
                            if (postRows.length > 20) {
                                postRows = _.dropRight(postRows, postRows.length - 20);
                            }
                            totalPostsCount = postResults.rows.length;
                        }
                        log.info("Posts 3");
                        getPostsWithAllFromIds(postRows, postOrder, function (error, finalRows) {
                            log.info("Posts 4");
                            if (error) {
                                log.error("Error getting group", { err: error });
                                res.sendStatus(500);
                            }
                            else {
                                if (req.params.filter === "random" && req.query.randomSeed && finalRows && finalRows.length > 0) {
                                    finalRows = seededShuffle(finalRows, req.query.randomSeed);
                                }
                                else if (ratingOrderNeeded) {
                                    finalRows = _.orderBy(finalRows, [(post) => {
                                            return ratingsPostLookup[post.dataValues.id];
                                        }], ['desc']);
                                }
                                models.Post.setOrganizationUsersForPosts(finalRows, (error) => {
                                    log.info("Posts 2");
                                    if (error) {
                                        log.error("Error getting group", { err: error });
                                        res.sendStatus(500);
                                    }
                                    else {
                                        const postsOut = {
                                            posts: finalRows,
                                            totalPostsCount: totalPostsCount
                                        };
                                        req.redisClient.setEx(redisKey, process.env.POSTS_CACHE_TTL ? parseInt(process.env.POSTS_CACHE_TTL) : 3, JSON.stringify(postsOut));
                                        res.send(postsOut);
                                    }
                                });
                            }
                        });
                    }).catch(function (error) {
                        log.error("Error getting group", { err: error });
                        res.sendStatus(500);
                    });
                }
                else {
                    log.error("Cant find status", { status: req.params.status });
                    res.sendStatus(404);
                }
            }).catch((errorGroup) => {
                sendGroupOrError(res, null, 'getPostsFromGroup Group.find', req.user, errorGroup);
            });
        }
    }).catch((error) => {
        sendGroupOrError(res, null, 'getPostsFromGroup', req.user, error);
    });
});
router.get('/:id/categories', auth.can('view group'), function (req, res) {
    models.Category.findAll({
        where: { group_id: req.params.id },
        limit: 20
    }).then(function (categories) {
        if (categories) {
            log.info('Group Categories Viewed', { group: req.params.id, context: 'view', user: toJson(req.user) });
            res.send(categories);
        }
        else {
            sendGroupOrError(res, req.params.id, 'view', req.user, 'Not found', 404);
        }
    }).catch(function (error) {
        sendGroupOrError(res, null, 'view categories', req.user, error);
    });
});
router.get('/:id/post_locations', auth.can('view group'), function (req, res) {
    models.Post.findAll({
        where: {
            location: {
                $ne: null
            },
            group_id: req.params.id
        },
        attributes: models.Post.defaultAttributesPublic,
        order: [
            [{ model: models.Image, as: 'PostHeaderImages' }, 'updated_at', 'asc']
        ],
        include: [
            { model: models.Image,
                as: 'PostHeaderImages',
                attributes: models.Image.defaultAttributesPublic,
                required: false
            },
            {
                model: models.Group,
                attributes: ['id', 'configuration'],
                required: true
            }
        ],
        select: ['id', 'name', 'location']
    }).then(function (posts) {
        if (posts) {
            log.info('Group Post Locations Viewed', {
                communityId: req.params.id,
                userId: req.user ? req.user.id : -1
            });
            var collectedIds = _.map(posts, function (post) {
                return post.id;
            });
            models.Post.getVideosForPosts(collectedIds, (error, videos) => {
                if (error) {
                    sendGroupOrError(res, null, 'view post locations', req.user, 'Not found', 404);
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
            sendGroupOrError(res, null, 'view post locations', req.user, 'Not found', 404);
        }
    }).catch(function (error) {
        sendGroupOrError(res, null, 'view post locations', req.user, error);
    });
});
router.get('/:id/categories_count/:tabName', auth.can('view group'), function (req, res) {
    var categoriesCount, allPostCount;
    var status = null;
    if (req.params.tabName === "failed") {
        status = -2;
    }
    else if (req.params.tabName === "open") {
        status = 0;
    }
    else if (req.params.tabName === "in_progress") {
        status = -1;
    }
    else if (req.params.tabName === "successful") {
        status = 2;
    }
    if (status !== null) {
        async.parallel([
            function (parallelCallback) {
                models.Post.count({
                    attributes: ['category_id'],
                    where: {
                        group_id: req.params.id,
                        official_status: status
                    },
                    include: [{
                            model: models.Category
                        }],
                    group: ['category_id']
                }).then(function (results) {
                    categoriesCount = results;
                    parallelCallback();
                }).catch(function (error) {
                    parallelCallback(error);
                });
            },
            function (parallelCallback) {
                models.Post.count({
                    where: {
                        group_id: req.params.id,
                        official_status: status
                    }
                }).then(function (count) {
                    allPostCount = count;
                    parallelCallback();
                }).catch(function (error) {
                    parallelCallback(error);
                });
            }
        ], function (error) {
            if (error) {
                sendGroupOrError(res, null, 'categories_count', req.user, error);
            }
            else {
                res.send({ categoriesCount: categoriesCount, allPostCount: allPostCount });
            }
        });
    }
    else {
        sendGroupOrError(res, null, 'categories_count', req.user, "Cant find status for posts");
    }
});
router.put('/:id/:groupId/mergeWithGroup', auth.can('edit post'), function (req, res) {
    auth.authNeedsGroupAdminForCreate({ id: req.params.groupId }, req, function (error, isAuthorized) {
        if (isAuthorized) {
            var inGroup, outGroup, post, outCommunityId, outDomainId;
            async.series([
                function (callback) {
                    models.Group.findOne({
                        where: {
                            id: req.params.id
                        },
                        include: [
                            {
                                model: models.Community,
                                required: true,
                                include: [
                                    {
                                        model: models.Domain,
                                        required: true,
                                        attributes: models.Domain.defaultAttributesPublic
                                    }
                                ]
                            }
                        ]
                    }).then(function (group) {
                        inGroup = groupIn;
                        callback();
                    }).catch(function (error) {
                        callback(error);
                    });
                },
                function (callback) {
                    models.Group.findOne({
                        where: {
                            id: req.params.groupId
                        },
                        include: [
                            {
                                model: models.Community,
                                required: true,
                                include: [
                                    {
                                        model: models.Domain,
                                        required: true,
                                        attributes: models.Domain.defaultAttributesPublic
                                    }
                                ]
                            }
                        ]
                    }).then(function (group) {
                        outGroup = group;
                        outCommunityId = group.Community.id;
                        outDomainId = group.Community.Domain.id;
                        callback();
                    }).catch(function (error) {
                        callback(error);
                    });
                },
                function (callback) {
                    models.Post.findAll({
                        where: {
                            group_id: inGroup.id
                        }
                    }).then(function (posts) {
                        async.eachSeries(posts, function (post, seriesCallback) {
                            post.set('group_id', outGroup.id);
                            post.save().then(function (results) {
                                console.log("Have changed group id");
                                models.AcActivity.findAll({
                                    where: {
                                        post_id: post.id
                                    }
                                }).then(function (activities) {
                                    async.eachSeries(activities, function (activity, innerSeriesCallback) {
                                        activity.set('group_id', outGroup.id);
                                        activity.set('community_id', outCommunityId);
                                        activity.set('domain_id', outDomainId);
                                        activity.save().then(function (results) {
                                            console.log("Have changed group and all: " + activity.id);
                                            innerSeriesCallback();
                                        });
                                    }, function (error) {
                                        seriesCallback(error);
                                    });
                                }).catch(function (error) {
                                    seriesCallback(error);
                                });
                            }, function (error) {
                                callback(error);
                            });
                        });
                    }).catch(function (error) {
                        callback(error);
                    });
                }
            ], function (error) {
                if (error) {
                    log.error("Merge with group", { groupId: req.params.id, groupToId: req.params.groupId });
                    res.sendStatus(500);
                }
                else {
                    log.info("Merge with group", { groupId: req.params.id, groupToId: req.params.groupId });
                    res.sendStatus(200);
                }
            });
        }
        else {
            log.error("Merge with group", { groupId: req.params.id, groupToId: req.params.groupId });
            res.sendStatus(401);
        }
    });
});
// Moderation
router.delete('/:groupId/:itemId/:itemType/:actionType/process_one_moderation_item', auth.can('edit group'), (req, res) => {
    performSingleModerationAction(req, res, {
        groupId: req.params.groupId,
        itemId: req.params.itemId,
        itemType: req.params.itemType,
        actionType: req.params.actionType
    });
});
router.delete('/:groupId/:actionType/process_many_moderation_item', auth.can('edit group'), (req, res) => {
    queue.add('process-moderation', {
        type: 'perform-many-moderation-actions',
        items: req.body.items,
        actionType: req.params.actionType,
        groupId: req.params.groupId
    }, 'critical');
    res.send({});
});
router.get('/:groupId/flagged_content', auth.can('edit group'), (req, res) => {
    getAllModeratedItemsByGroup({ groupId: req.params.groupId }, (error, items) => {
        if (error) {
            log.error("Error getting items for moderation", { error });
            res.sendStatus(500);
        }
        else {
            res.send(items);
        }
    });
});
router.get('/:groupId/moderate_all_content', auth.can('edit group'), (req, res) => {
    getAllModeratedItemsByGroup({ groupId: req.params.groupId, allContent: true }, (error, items) => {
        if (error) {
            log.error("Error getting items for moderation", { error });
            res.sendStatus(500);
        }
        else {
            res.send(items);
        }
    });
});
router.get('/:groupId/flagged_content_count', auth.can('edit group'), (req, res) => {
    countAllModeratedItemsByGroup({ groupId: req.params.groupId }, (error, count) => {
        if (error) {
            log.error("Error getting items for moderation", { error });
            res.sendStatus(500);
        }
        else {
            res.send({ count });
        }
    });
});
// CAMPAIGNS
router.post('/:id/campaignCreateAndStart', auth.can('edit group'), (req, res) => {
    models.AcCampaign.createAndSendCampaign(req.body, (error) => {
        if (error) {
            log.error('Group createCampaign error', { context: 'campaignCreateAndStart', params: req.body, error });
            res.sendStatus(500);
        }
        else {
            log.info('Group createCampaign completed', { context: 'campaignCreateAndStart' });
            res.sendStatus(200);
        }
    });
});
router.get('/:groupId/:jobId/getCampaignSendStatus', auth.can('edit group'), function (req, res) {
    models.AcCampaign.getSendStatus(req.params.jobId, (error, results) => {
        if (error) {
            log.error('Group createCampaign error', { context: 'getCampaignSendStatus', error });
            res.sendStatus(500);
        }
        else {
            log.info('Group getCampaignSendStatus completed', { context: 'getCampaignSendStatus' });
            res.sendresults;
        }
    });
});
router.get('/:id/getCampaigns', auth.can('edit group'), (req, res) => {
    models.AcCampaign.find({
        where: {
            group_id: req.params.id
        }
    }).then(campaigns => {
        res.send(campaigns);
    }).catch(error => {
        log.info('Group createCampaign error', { context: 'createCampaign', params: req.body, error });
        res.sendStatus(500);
    });
});
// LISTS
router.get('/:id/getList', auth.can('edit group'), (req, res) => {
    models.AcList.getList(req.params.id, (error, results) => {
        if (error) {
            log.error('Group getList error', { context: 'getList', error });
            res.sendStatus(500);
        }
        else {
            log.info('Group getList completed', { context: 'getList' });
            res.send(results);
        }
    });
});
router.put('/:id/:listId/addListUsers', auth.can('edit group'), (req, res) => {
    models.AcList.addListUsers(req.params.listId, req.body, (error, results) => {
        if (error) {
            log.error('Group addListUsers error', { context: 'addListUsers', error });
            res.sendStatus(500);
        }
        else {
            log.info('Group addListUsers completed', { context: 'addListUsers' });
            res.send(results);
        }
    });
});
router.get('/:id/:listId/getListUsers', auth.can('edit group'), (req, res) => {
    models.AcListUser.find({
        where: {
            ac_list_id: req.params.listId
        },
    }).then(listUsers => {
        res.send(listUsers);
    }).catch(error => {
        log.error('Group getListUsers error', { context: 'createCampaign', error });
        res.sendStatus(500);
    });
});
router.post('/:id/marketingTrackingOpen', auth.can('view group'), (req, res) => {
    if (req.body && req.body.originalQueryParameters && req.body.originalQueryParameters.yu) {
        models.AcCampaign.updateCampaignAndUser(req.body.originalQueryParameters, 'openCount', (error) => {
            if (error) {
                log.error('Group marketingTracking error', { context: 'marketingTracking', params: req.body, error });
                res.sendStatus(500);
            }
            else {
                log.info('Group marketingTracking marketing completed', { context: 'marketingTracking', params: req.body });
                res.sendStatus(200);
            }
        });
    }
    else {
        log.warn("Group marketingTracking no tracking parameters");
        res.sendStatus(200);
    }
});
router.post('/:id/triggerTrackingGoal', auth.can('view group'), (req, res) => {
    if (req.body && req.body.originalQueryParameters && req.body.originalQueryParameters.yu) {
        models.AcCampaign.updateCampaignAndUser(req.body.originalQueryParameters, 'completeCount', (error) => {
            if (error) {
                log.error('Group triggerTrackingGoal error', { context: 'marketingTracking', params: req.body, error });
                res.sendStatus(500);
            }
            else {
                log.info('Group triggerTrackingGoal marketing completed', { context: 'triggerTrackingGoal', params: req.body });
                res.sendStatus(200);
            }
        });
    }
    else {
        models.Group.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'configuration']
        }).then(function (group) {
            if (group && group.configuration && group.configuration.externalGoalTriggerUrl) {
                log.info('Group triggerTrackingGoal starting', { context: 'triggerTrackingGoal', params: req.body, group: group });
                const options = {
                    url: group.configuration.externalGoalTriggerUrl,
                    qs: req.body
                };
                request.get(options, (response, message) => {
                    if ((response && response.errno) || (message && message.statusCode !== 200)) {
                        log.info('Group triggerTrackingGoal error', { context: 'triggerTrackingGoal', response: response, message: message, params: req.body, group: group });
                        res.sendStatus(500);
                    }
                    else {
                        log.info('Group triggerTrackingGoal completed', { context: 'triggerTrackingGoal', params: req.body, group: group });
                        res.sendStatus(200);
                    }
                });
                //
            }
            else {
                log.error("Error getting group for triggerTrackingGoal");
                res.sendStatus(404);
            }
        }).catch(function (error) {
            log.error("Error getting group for triggerTrackingGoal", { error });
            res.sendStatus(404);
        });
    }
});
router.put('/:id/:pointId/adminComment', auth.can('edit group'), function (req, res) {
    if (!req.body.content) {
        req.body.content = "";
    }
    models.Point.findOne({
        where: {
            id: req.params.pointId
        },
        attributes: ['id', 'public_data']
    }).then(function (point) {
        if (point) {
            if (!point.public_data) {
                point.set('public_data', {});
            }
            if (!point.public_data.admin_comment) {
                point.set('public_data.admin_comment', {});
            }
            point.set('public_data.admin_comment', { text: req.body.content, userId: req.user.id, userName: req.user.name, createdAt: new Date() });
            point.save().then(() => {
                res.send({ content: req.body.content });
            }).catch(function (error) {
                log.error("Error adminComment", { error });
                res.sendStatus(500);
            });
        }
        else {
            res.sendStatus(404);
        }
    }).catch(function (error) {
        log.error("Error adminComment", { error });
        res.sendStatus(500);
    });
});
router.get('/:groupId/survey', auth.can('view group'), (req, res) => {
    models.Group.findOne({
        where: { id: req.params.groupId },
        order: [
            [{ model: models.Image, as: 'GroupLogoImages' }, 'created_at', 'asc'],
            [{ model: models.Video, as: "GroupLogoVideos" }, 'updated_at', 'desc'],
            [{ model: models.Video, as: "GroupLogoVideos" }, { model: models.Image, as: 'VideoImages' }, 'updated_at', 'asc'],
        ],
        attributes: ['id', 'name', 'configuration', 'objectives'],
        include: [
            {
                model: models.Community,
                attributes: ['id', 'theme_id', 'name', 'access', 'google_analytics_code', 'configuration', 'only_admins_can_create_groups'],
                include: [
                    {
                        model: models.Domain,
                        attributes: ['id', 'theme_id', 'name']
                    }
                ]
            },
            {
                model: models.Image,
                as: 'GroupLogoImages',
                attributes: models.Image.defaultAttributesPublic,
                required: false
            },
            {
                model: models.Video,
                as: 'GroupLogoVideos',
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
    }).then(function (group) {
        if (group) {
            log.info('Survey Group Viewed', { groupId: group.id, context: 'view', userId: req.user ? req.user.id : -1 });
            res.send({ surveyGroup: group });
        }
        else {
            res.send({ error: 'notFound' });
        }
    }).catch(function (error) {
        sendGroupOrError(res, null, 'view survey', req.user, error);
    });
});
router.post('/:groupId/survey', auth.can('view group'), (req, res) => {
    let surveyGroup;
    let loggedInUser = req.user;
    async.series([
        (seriesCallback) => {
            models.Group.findOne({
                where: { id: req.params.groupId },
                attributes: ['id', 'configuration']
            }).then(group => {
                if (group) {
                    surveyGroup = group;
                    seriesCallback();
                }
                else {
                    seriesCallback("Group not found");
                }
            }).catch(error => {
                seriesCallback(error);
            });
        },
        (seriesCallback) => {
            if (loggedInUser) {
                seriesCallback();
            }
            else {
                const anonSurveyEmail = "survey_group_" + surveyGroup.id + "_user_anonymous@citizens.is";
                models.User.findOne({
                    where: {
                        email: anonSurveyEmail
                    }
                }).then(function (existingUser) {
                    if (existingUser) {
                        loggedInUser = existingUser;
                        seriesCallback();
                    }
                    else {
                        var user = models.User.build({
                            email: anonSurveyEmail,
                            name: "Anonymous Survey User",
                            notifications_settings: models.AcNotification.anonymousNotificationSettings,
                            status: 'active'
                        });
                        user.set('profile_data', {});
                        user.set('profile_data.isAnonymousUser', true);
                        user.save().then(() => {
                            loggedInUser = user;
                            seriesCallback();
                        }).catch(error => {
                            seriesCallback(error);
                        });
                    }
                }).catch(error => {
                    seriesCallback(error);
                });
            }
        },
        (seriesCallback) => {
            const post = models.Post.build({
                name: "Survey Response -" + moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
                description: "",
                group_id: surveyGroup.id,
                cover_media_type: "none",
                user_id: loggedInUser.id,
                status: 'blocked',
                counter_endorsements_up: 0,
                content_type: models.Post.CONTENT_SURVEY,
                user_agent: req.useragent.source,
                ip_address: req.clientIp
            });
            post.set('public_data', {});
            if (req.body.structuredAnswers) {
                post.set('public_data.structuredAnswersJson', req.body.structuredAnswers);
            }
            post.save().then(() => {
                log.info('Survey Post Created', { postId: post.id, context: 'create' });
                post.updateAllExternalCounters(req, 'up', 'counter_posts', function () {
                    seriesCallback();
                });
            }).catch(error => {
                seriesCallback(error);
            });
        }
    ], (error) => {
        if (error) {
            sendGroupOrError(res, null, 'post survey', req.user, error);
        }
        else {
            res.sendStatus(200);
        }
    });
});
// WORD CLOUD
router.get('/:id/wordcloud', auth.can('edit group'), function (req, res) {
    getFromAnalyticsApi(req, "wordclouds", "group", req.params.id, function (error, content) {
        sendBackAnalyticsResultsOrError(req, res, error, content);
    });
});
// SIMILARITIES
router.get('/:id/similarities_weights', auth.can('edit group'), function (req, res) {
    getFromAnalyticsApi(req, "similarities_weights", "group", req.params.id, function (error, content) {
        sendBackAnalyticsResultsOrError(req, res, error ? error : content.body ? null : 'noBody', getParsedSimilaritiesContent(content));
    });
});
// STATS
router.get('/:id/stats_posts', auth.can('edit group'), function (req, res) {
    countModelRowsByTimePeriod(req, "stats_posts_" + req.params.id + "_group", models.Post, {}, getGroupIncludes(req.params.id), (error, results) => {
        sendBackAnalyticsResultsOrError(req, res, error, results);
    });
});
router.get('/:id/stats_points', auth.can('edit group'), function (req, res) {
    countModelRowsByTimePeriod(req, "stats_points_" + req.params.id + "_group", models.Point, {}, getPointGroupIncludes(req.params.id), (error, results) => {
        sendBackAnalyticsResultsOrError(req, res, error, results);
    });
});
router.get('/:id/stats_votes', auth.can('edit group'), function (req, res) {
    countModelRowsByTimePeriod(req, "stats_votes_" + req.params.id + "_group", models.AcActivity, {
        type: {
            $in: [
                "activity.post.opposition.new", "activity.post.endorsement.new",
                "activity.point.helpful.new", "activity.point.unhelpful.new"
            ]
        }
    }, getGroupIncludes(req.params.id), (error, results) => {
        sendBackAnalyticsResultsOrError(req, res, error, results);
    });
});
router.get('/:id/get_translation_texts', auth.can('edit group'), function (req, res) {
    getTranslatedTextsForGroup(req.query.targetLocale, req.params.id, (results, error) => {
        if (error) {
            log.error("Error in getting translated texts", { error });
            res.sendStatus(500);
        }
        else {
            res.send(results);
        }
    });
});
router.put('/:id/update_translation', auth.can('edit group'), function (req, res) {
    updateTranslationForGroup(req.params.id, req.body, (results, error) => {
        if (error) {
            log.error("Error in updating translation", { error });
            res.sendStatus(500);
        }
        else {
            res.send(results);
        }
    });
});
router.put('/:id/update_structured_translations', auth.can('edit group'), function (req, res) {
    let textType;
    if (req.body.type == "registration") {
        textType = "GroupRegQuestions";
    }
    else if (req.body.type.indexOf("PostAnswer") > -1) {
        textType = "PostAnswer";
    }
    else {
        textType = "GroupQuestions";
    }
    if (textType === "PostAnswer") {
        let contentHash = req.body.type.split("-")[3];
        let postId = req.body.type.split("-")[1];
        updateAnswerTranslation(postId, textType, req.body.targetLocale, req.body.translations, contentHash, (results, error) => {
            if (error) {
                log.error("Error in updating survey translation", { error });
                res.sendStatus(500);
            }
            else {
                res.send(results);
            }
        });
    }
    else {
        updateSurveyTranslation(req.params.id, textType, req.body.targetLocale, req.body.translations, req.body.questions, (results, error) => {
            if (error) {
                log.error("Error in updating survey translation", { error });
                res.sendStatus(500);
            }
            else {
                res.send(results);
            }
        });
    }
});
var upload = multer({
    storage: s3multer({
        dirname: 'attachments',
        s3: s3,
        bucket: process.env.S3_BUCKET,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        endpoint: process.env.S3_ENDPOINT || null,
        acl: 'public-read',
        contentType: s3multer.AUTO_CONTENT_TYPE,
        region: process.env.S3_REGION || (process.env.S3_ENDPOINT ? null : 'us-east-1'),
        key: function (req, file, cb) {
            cb(null, Date.now() + "_" + file.originalname);
        }
    })
});
//TODO: Old remove only here for cached serviceworker clients
router.post('/:id/upload_document', auth.can('add to group'), upload.single('file'), function (req, res) {
    res.send({ filename: req.file.originalname, url: req.file.location });
});
var uploadDox = multer({});
router.put('/:id/convert_docx_survey_to_json', uploadDox.single('file'), function (req, res) {
    const formData = {
        file: {
            value: req.file.buffer,
            options: {
                filename: req.file.originalname
            }
        }
    };
    convertDocxSurveyToJson(formData, (error, results) => {
        if (error) {
            log.error("Error in converting docx to joson", { error });
            res.sendStatus(500);
        }
        else {
            if (results.body) {
                res.send({ jsonContent: JSON.parse(results.body) });
            }
            else {
                res.sendStatus(500);
            }
        }
    });
});
router.put('/:groupId/plausibleStatsProxy', auth.can('edit group marketing'), async (req, res) => {
    try {
        const plausibleData = await plausibleStatsProxy(req.body.plausibleUrl, {
            groupId: req.params.groupId
        });
        res.send(plausibleData);
    }
    catch (error) {
        log.error('Could not get plausibleStatsProxy', { err: error, context: 'getPlausibleSeries', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    }
});
router.get('/:groupId/:type/getPlausibleSeries', auth.can('edit group marketing'), async (req, res) => {
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
router.get('/:groupId/get_campaigns', auth.can('edit group marketing'), async (req, res) => {
    try {
        const campaigns = await models.Campaign.findAll({
            where: {
                group_id: req.params.groupId
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
router.post('/:groupId/create_campaign', auth.can('edit group marketing'), async (req, res) => {
    try {
        const campaign = models.Campaign.build({
            group_id: req.params.groupId,
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
router.put('/:groupId/:campaignId/update_campaign', auth.can('edit group marketing'), async (req, res) => {
    try {
        const campaign = await models.Campaign.findOne({
            where: {
                id: req.params.campaignId,
                group_id: req.params.groupId
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
router.delete('/:groupId/:campaignId/delete_campaign', auth.can('edit group marketing'), async (req, res) => {
    try {
        const campaign = await models.Campaign.findOne({
            where: {
                id: req.params.campaignId,
                group_id: req.params.groupId
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
router.get('/:groupId/get_posts_with_public_private', auth.can('view group'), async (req, res) => {
    try {
        const posts = await models.Post.findAll({
            where: {
                group_id: req.params.groupId,
                [Sequelize.Op.and]: [Sequelize.literal(`"data"->'publicPrivateData' IS NOT NULL`)]
            },
            order: [
                ['created_at', 'desc']
            ],
            attributes: [
                'id',
                [models.sequelize.literal('"data"->\'publicPrivateData\''), 'publicPrivateData']
            ]
        });
        res.send(posts);
    }
    catch (error) {
        log.error('Could not get get_posts_with_public_private', { err: error, context: 'get_campaigns', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    }
});
router.get('/:groupId/:pointId/get_parent_point', auth.can('view group'), async (req, res) => {
    try {
        const point = await models.Point.findOne({
            where: {
                group_id: req.params.groupId,
                id: req.params.pointId,
            },
            order: [
                [models.PointRevision, 'created_at', 'asc'],
                [models.User, { model: models.Image, as: 'UserProfileImages' }, 'created_at', 'asc'],
            ],
            attributes: [
                'id',
                'content'
            ],
            include: [
                {
                    model: models.PointRevision,
                    required: false
                },
                {
                    model: models.User,
                    required: true,
                    attributes: models.User.defaultAttributesWithSocialMediaPublic,
                    include: [
                        {
                            model: models.Image, as: 'UserProfileImages',
                            attributes: ['id', "formats", 'updated_at'],
                            required: false
                        }
                    ]
                }
            ]
        });
        res.send(point);
    }
    catch (error) {
        log.error('Could not get get_parent_point', { err: error, context: 'get_campaigns', user: toJson(req.user.simple()) });
        res.sendStatus(500);
    }
});
module.exports = router;
