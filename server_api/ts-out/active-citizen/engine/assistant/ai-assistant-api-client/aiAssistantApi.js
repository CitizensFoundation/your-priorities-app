"use strict";
TEMP_LANGUAGE_LOCALE = "is";
const _ = require('lodash');
const request = require('request');
const models = require('../../../../models');
// import farmhash
const farmhash = require('farmhash');
// import Op
const Op = models.Sequelize.Op;
const convertToString = (integer, type) => {
    if (integer) {
        return integer.toString();
    }
    else {
        console.error("Cant find integer to string for: " + type);
    }
};
const readCommunityAIConfigurationFromTestFolder = (cluster_id, communityId) => {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, `./testConfigurations/${cluster_id}/${communityId}/configuration.json`);
    if (fs.existsSync(filePath)) {
        let configuration = fs.readFileSync(filePath, 'utf8');
        if (configuration) {
            return JSON.stringify(JSON.parse(configuration));
        }
        else {
            return "{}";
        }
    }
    else {
        return "{}";
    }
};
const importDomain = (domain, done) => {
    var properties = {};
    properties = _.merge(properties, {
        name: domain.name,
        description: domain.description,
        language: domain.default_locale,
        created_at: domain.created_at,
        updated_at: domain.updated_at,
        status: domain.deleted ? 'deleted' : 'published'
    });
    const options = {
        url: process.env["AC_AI_ASSISTANT_BASE_URL"] + "domains/" + process.env.AC_AI_ASSISTANT_CLUSTER_ID + "/" + domain.id,
        headers: {
            'X-API-KEY': process.env["AC_AI_ASSISTANT_KEY"]
        },
        json: properties
    };
    request.post(options, (error) => {
        done(error);
    });
};
const importCommunity = (community, done) => {
    var properties = {};
    properties = _.merge(properties, {
        name: community.name,
        description: community.description,
        domain_id: community.Domain.id,
        community_id: community.id,
        created_at: community.created_at,
        updated_at: community.updated_at,
        language: community.default_locale ? community.default_locale : community.Domain.default_locale,
        status: community.deleted ? 'deleted' : 'published',
        assistantConfiguration: readCommunityAIConfigurationFromTestFolder(process.env.AC_AI_ASSISTANT_CLUSTER_ID, community.id)
    });
    console.log(properties);
    const options = {
        url: process.env["AC_AI_ASSISTANT_BASE_URL"] + "communities/" + process.env.AC_AI_ASSISTANT_CLUSTER_ID + "/" + community.id,
        headers: {
            'X-API-KEY': process.env["AC_AI_ASSISTANT_KEY"]
        },
        json: properties
    };
    request.put(options, (error) => {
        done(error);
    });
};
const importGroup = (group, done) => {
    var properties = {};
    properties = _.merge(properties, {
        name: group.name,
        objectives: group.objectives,
        community_id: group.Community.id,
        created_at: group.created_at,
        updated_at: group.updated_at,
        language: group.Community.default_locale ? group.Community.default_locale : group.Community.Domain.default_locale,
        status: group.deleted ? 'deleted' : 'published'
    });
    const options = {
        url: process.env["AC_AI_ASSISTANT_BASE_URL"] + "groups/" + process.env.AC_AI_ASSISTANT_CLUSTER_ID + "/" + group.id,
        headers: {
            'X-API-KEY': process.env["AC_AI_ASSISTANT_KEY"]
        },
        json: properties
    };
    request.post(options, (error) => {
        done(error);
    });
};
getEnglishPoint = async (point, textType) => {
    return new Promise(async (resolve, reject) => {
        models.AcTranslationCache.getTranslation({ query: { textType: textType, targetLanguage: "en" } }, point, async (error, translation) => {
            if (!error && translation) {
                resolve(translation.content);
            }
            else
                resolve("");
        });
    });
};
const getPoints = async (points, forPoints, language) => {
    let outPoints = "";
    for (let i = 0; i < points.length; i += 1) {
        if (forPoints === true && points[i].value > 0 || forPoints === false && points[i].value < 0) {
            const point = points[i];
            if (point.PointRevisions && point.PointRevisions.length > 0) {
                let pointContent = point.PointRevisions[point.PointRevisions.length - 1].content;
                if (pointContent) {
                    const finalPoint = language == "en" ? await getEnglishPoint(point, "pointContent") : pointContent;
                    outPoints += `${cleanup_text(finalPoint)}\n\n`;
                }
            }
            else {
                if (point.content) {
                    const finalPoint = language == "en" ? await getEnglishPoint(point, "pointContent") : point.content;
                    ;
                    outPoints += `${cleanup_text(finalPoint)}\n\n`;
                }
            }
        }
    }
    console.error("=====================outPoints: " + outPoints);
    return outPoints;
};
const getPointsForPost = async (points, language) => {
    return await getPoints(points, true, language);
};
const getPointsAgainstPost = async (points, language) => {
    return await getPoints(points, false, language);
};
const cleanup_text = (text) => {
    if (typeof text === 'object') {
        text = text.toString();
    }
    if (typeof text === 'string') {
        return text.replace(/'/g, '').replace(/"/g, '').replace(/\\/g, '').replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " ").trim();
    }
    else {
        return `XXXXXXXXXXXXXXXXXXX wrong type: ${typeof text} - ${text}}`;
    }
};
const get_english_translation = async (modelInstance, textType) => {
    const targetLanguage = "en";
    return new Promise(async (resolve, reject) => {
        if (textType == "PostAnswer") {
            models.AcTranslationCache.getSurveyAnswerTranslations(modelInstance.id, targetLanguage, async (error, translation) => {
                if (!error && translation) {
                    resolve(translation);
                }
                else
                    resolve("");
            });
        }
        else {
            models.AcTranslationCache.getTranslation({ query: { textType: textType, targetLanguage } }, modelInstance, async (error, translation) => {
                if (!error && translation) {
                    resolve(translation.content);
                }
                else
                    resolve("");
            });
        }
    });
};
const importPost = async (post, done) => {
    var properties = {};
    if (post.category_id) {
        properties = _.merge(properties, {
            category_id: convertToString(post.category_id)
        });
    }
    let language;
    if (post.language && post.language !== "??") {
        language = post.language;
    }
    else if (post.Group.default_locale) {
        language = post.Group.default_locale;
    }
    else if (post.Group.Community.default_locale) {
        language = post.Group.Community.default_locale;
    }
    else if (post.Group.Community.Domain.default_locale) {
        language = post.Group.Community.Domain.default_locale;
    }
    let description = "";
    if (post.description) {
        description = post.description;
    }
    else if (post.Points[0]) {
        description = post.Points[0].content;
    }
    if (post.public_data && post.public_data.structuredAnswersJson) {
        const answers = post.public_data.structuredAnswersJson;
        for (let i = 0; i < answers.length; i += 1) {
            if (answers[i]) {
                if (answers[i].value) {
                    description += " ";
                    description += answers[i].value.trim();
                }
            }
        }
    }
    else if (post.public_data && post.public_data.structuredAnswers) {
        const answers = post.public_data.structuredAnswers.split("%!#x");
        description = answers.join(" ");
    }
    let publicAccess = false;
    if ((post.Group.access === models.Group.ACCESS_PUBLIC &&
        post.Group.Community.access === models.Community.ACCESS_PUBLIC) ||
        (post.Group.access === models.Group.ACCESS_OPEN_TO_COMMUNITY &&
            post.Group.Community.access === models.Community.ACCESS_PUBLIC)) {
        publicAccess = true;
    }
    let communityAccess = false;
    if (post.Group.access === models.Group.ACCESS_PUBLIC || post.Group.access === models.Group.ACCESS_OPEN_TO_COMMUNITY) {
        communityAccess = true;
    }
    let formats, audioUrl, videoUrl;
    let imageUrl = null;
    if (_hasCoverMediaType(post, "image") && post.PostHeaderImages && post.PostHeaderImages.length > 0) {
        imageUrl = _getImageFormatUrl(post.PostHeaderImages, 0);
    }
    else if (_hasCoverMediaType(post, "video") && post.Videos && post.Videos.length > 0) {
        imageUrl = _getVideoPosterURL(post.Videos, post.Images, 0);
        videoUrl = _getVideoURL(post.Videos);
    }
    else if (_hasCoverMediaType(post, "audio") && post.Audios && post.Audios.length > 0) {
        audioUrl = _getAudioURL(post.Audios);
    }
    console.log("Image URL before: " + imageUrl);
    if (!imageUrl) {
        if (post.Group.GroupLogoImages && post.Group.GroupLogoImages.length > 0) {
            formats = JSON.parse(post.Group.GroupLogoImages[0].formats);
            imageUrl = formats[0];
        }
        else if (post.Group.Community.CommunityLogoImages && post.Group.Community.CommunityLogoImages.length > 0) {
            formats = JSON.parse(post.Group.Community.CommunityLogoImages[0].formats);
            imageUrl = formats[0];
        }
    }
    console.log("Image URL after: " + imageUrl);
    console.log("Language: " + language);
    console.log(description);
    //TODO: Add endorsements up and down for ratings for 3d maps
    //TODO: Add English translation if there and make train english maps for all items
    let postName = post.name;
    const englishName = await get_english_translation(post, "postName", postName);
    const englishDescription = await get_english_translation(post, "PostAnswer", description);
    console.log(`English name: ${englishName} English description: ${englishDescription}`);
    if (englishName && TEMP_LANGUAGE_LOCALE === "en") {
        postName = englishName;
    }
    if (englishDescription && TEMP_LANGUAGE_LOCALE === "en") {
        description = englishDescription;
    }
    console.log(`Name: ${postName} Description: ${description}`);
    const pointsFor = await getPointsForPost(post.Points, TEMP_LANGUAGE_LOCALE);
    const pointsAgainst = await getPointsAgainstPost(post.Points, TEMP_LANGUAGE_LOCALE);
    properties = _.merge(properties, {
        domain_id: convertToString(post.Group.Community.Domain.id, 'domain_id'),
        community_id: convertToString(post.Group.Community.id, 'community_id'),
        group_id: convertToString(post.Group.id, 'group_id'),
        user_id: convertToString(post.user_id, 'user_id'),
        description: cleanup_text(description),
        counter_endorsements_up: post.counter_endorsements_up,
        counter_endorsements_down: post.counter_endorsements_down,
        counter_points_for: 0, //post.counter_points,
        counter_points_against: 0, //post.counter_points,
        counter_flags: post.counter_flags,
        group_name: post.Group.name,
        created_at: post.created_at,
        updated_at: post.updated_at,
        name: cleanup_text(postName),
        total_number_of_posts: 1,
        image_url: imageUrl,
        video_url: videoUrl,
        points_for: pointsFor,
        points_against: pointsAgainst,
        community_access: communityAccess,
        audio_url: audioUrl,
        public_access: publicAccess,
        status: post.deleted ? 'deleted' : post.status,
        official_status: convertToString(post.official_status, 'official_status'),
        language: language
    });
    properties = _.merge(properties, {
        date: post.created_at.toISOString()
    });
    console.error(properties);
    const options = {
        url: process.env["AC_AI_ASSISTANT_BASE_URL"] + "posts/" + process.env.AC_AI_ASSISTANT_CLUSTER_ID + "/" + post.id,
        headers: {
            'X-API-KEY': process.env["AC_AI_ASSISTANT_KEY"]
        },
        json: properties
    };
    request.put(options, (error) => {
        done(error);
    });
};
const importPoint = (point, done) => {
    const post = point.Post;
    var properties = {};
    if (post.category_id) {
        properties = _.merge(properties, {
            category_id: convertToString(post.category_id)
        });
    }
    let language;
    if (point.language && point.language !== "??") {
        language = point.language;
    }
    else if (post.language && post.language !== "??") {
        language = post.language;
    }
    else if (post.Group.default_locale) {
        language = post.Group.default_locale;
    }
    else if (post.Group.Community.default_locale) {
        language = post.Group.Community.default_locale;
    }
    else if (post.Group.Community.Domain.default_locale) {
        language = post.Group.Community.Domain.default_locale;
    }
    let content = "";
    if (point.PointRevisions && point.PointRevisions.length > 0) {
        content = point.PointRevisions[point.PointRevisions.length - 1].content;
    }
    else {
        content = point.content;
    }
    let publicAccess = false;
    if ((post.Group.access === models.Group.ACCESS_PUBLIC &&
        post.Group.Community.access === models.Community.ACCESS_PUBLIC) ||
        (post.Group.access === models.Group.ACCESS_OPEN_TO_COMMUNITY &&
            post.Group.Community.access === models.Community.ACCESS_PUBLIC)) {
        publicAccess = true;
    }
    let communityAccess = false;
    if (post.Group.access === models.Group.ACCESS_PUBLIC || post.Group.access === models.Group.ACCESS_OPEN_TO_COMMUNITY) {
        communityAccess = true;
    }
    let audioUrl, videoUrl;
    if (point.PointVideos && point.PointVideos.length > 0) {
        videoUrl = _getVideoURL(point.PointVideos);
    }
    if (point.PointAudios && point.PointAudios.length > 0) {
        audioUrl = _getAudioURL(point.PointAudios);
    }
    console.log("Language: " + language);
    console.log(point.id);
    //TODO: Add endorsements up and down for ratings for 3d maps
    //TODO: Add English translation if there and make train english maps for all items
    properties = _.merge(properties, {
        domain_id: convertToString(post.Group.Community.Domain.id, 'domainId'),
        community_id: convertToString(post.Group.Community.id, 'community_id'),
        group_id: convertToString(post.Group.id, 'group_id'),
        post_id: convertToString(post.id, 'post_id'),
        user_id: convertToString(point.user_id, 'user_id'),
        content: content,
        counter_quality_up: point.counter_quality_up,
        counter_quality_down: point.counter_quality_down,
        counter_flags: point.counter_flags,
        name: point.name,
        value: point.value,
        video_url: videoUrl,
        audio_url: audioUrl,
        community_access: communityAccess,
        public_access: publicAccess,
        status: point.deleted ? 'deleted' : point.status,
        post_status: post.deleted ? 'deleted' : post.status,
        post_official_status: convertToString(post.official_status, 'post_official_status'),
        language: language
    });
    properties = _.merge(properties, {
        date: point.created_at.toISOString()
    });
    const options = {
        url: process.env["AC_AI_ASSISTANT_BASE_URL"] + "points/" + process.env.AC_AI_ASSISTANT_CLUSTER_ID + "/" + point.id,
        headers: {
            'X-API-KEY': process.env["AC_AI_ASSISTANT_KEY"]
        },
        json: properties
    };
    request.post(options, (error) => {
        done(error);
    });
};
const _getVideoURL = function (videos) {
    if (videos &&
        videos.length > 0 &&
        videos[0].formats &&
        videos[0].formats.length > 0) {
        return videos[0].formats[0];
    }
    else {
        return null;
    }
};
const _getAudioURL = function (audios) {
    if (audios &&
        audios.length > 0 &&
        audios[0].formats &&
        audios[0].formats.length > 0) {
        return audios[0].formats[0];
    }
    else {
        return null;
    }
};
const _getVideoPosterURL = function (videos, images, selectedImageIndex) {
    if (videos &&
        videos.length > 0 &&
        videos[0].VideoImages &&
        videos[0].VideoImages.length > 0) {
        if (!selectedImageIndex)
            selectedImageIndex = 0;
        if (videos[0].public_meta && videos[0].public_meta.selectedVideoFrameIndex) {
            selectedImageIndex = parseInt(videos[0].public_meta.selectedVideoFrameIndex);
        }
        if (selectedImageIndex > videos[0].VideoImages.length - 1) {
            selectedImageIndex = 0;
        }
        if (selectedImageIndex === -2 && images) {
            return this.getImageFormatUrl(images, 0);
        }
        else {
            if (selectedImageIndex < 0)
                selectedImageIndex = 0;
            return JSON.parse(videos[0].VideoImages[selectedImageIndex].formats)[0];
        }
    }
    else {
        return null;
    }
};
const _getImageFormatUrl = function (images, formatId) {
    if (images && images.length > 0) {
        var formats = JSON.parse(images[images.length - 1].formats);
        if (formats && formats.length > 0)
            return formats[formatId];
    }
    else {
        return "";
    }
};
const _hasCoverMediaType = function (post, mediaType) {
    if (!post) {
        console.info("No post for " + mediaType);
        return false;
    }
    else {
        if (mediaType === 'none') {
            return (!post.Category && (!post.cover_media_type || post.cover_media_type === 'none'));
        }
        else if ((mediaType === 'category' && post.Category) && (!post.cover_media_type || post.cover_media_type === 'none')) {
            return true;
        }
        else {
            return (post && post.cover_media_type === mediaType);
        }
    }
};
module.exports = {
    importDomain, importCommunity, importGroup, importPost, importPoint
};
