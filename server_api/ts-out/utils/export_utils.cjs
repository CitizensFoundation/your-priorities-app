"use strict";
var models = require('../models/index.cjs');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
const moment = require('moment');
var hostName;
var skipEmail = false;
const getPostUrl = function (post, hostname) {
    if (hostName) {
        return 'https://' + hostName + '/post/' + post.id;
    }
    else {
        return "https://yrpri.org/post/" + post.id;
    }
};
const getUserEmail = function (post) {
    if (skipEmail) {
        return "hidden";
    }
    else {
        return post.User.email;
    }
};
const clean = function (text) {
    //console.log("Before: "+ text);
    var newText = text.replace('"', "'").replace('\n', '').replace('\r', '').replace(/(\r\n|\n|\r)/gm, "").replace(/"/gm, "'").replace(/,/, ';').trim();
    //console.log("After:" + newText);
    return newText.replace(/´/g, '');
};
const cleanDescription = function (text) {
    //console.log("Before: "+ text);
    var newText = text.replace('"', "'").replace(/"/gm, "'").replace(/,/, ';').trim();
    //console.log("After:" + newText);
    return newText.replace(/´/g, '');
};
const getLocation = function (post) {
    if (post.location && post.location.latitude && post.location.longitude &&
        post.location.latitude != "" && post.location.longitude != "") {
        return post.location.latitude + ',' + post.location.longitude;
    }
    else {
        return '"",""';
    }
};
const getPoints = function (points) {
    var totalContent = "";
    _.each(points, function (point) {
        var content = clean(point.content) + "\n\n";
        if (content.startsWith(",")) {
            content = content.substr(1);
        }
        //console.log("content: "+content);
        totalContent += content;
    });
    return totalContent;
};
const getContactData = function (post) {
    if (post.data && post.data.contact && (post.data.contact.name || post.data.contact.email || post.data.contact.telephone)) {
        return `"${post.data.contact.name}","${post.data.contact.email}","${post.data.contact.telephone}"`;
    }
    else {
        return ",,";
    }
};
const getAttachmentData = function (post) {
    if (post.data && post.data.attachment && post.data.attachment.url) {
        return `"${post.data.attachment.url}","${post.data.attachment.filename}"`;
    }
    else {
        return ",";
    }
};
const getPointsUpOrDown = function (post, value) {
    var pointsText = '"';
    var points = _.filter(post.Points, function (point) {
        if (value > 0) {
            return point.value > 0;
        }
        else {
            return point.value < 0;
        }
    });
    pointsText += getPoints(points) + '"';
    if (pointsText.startsWith(",")) {
        pointsText = pointsText.substr(1);
    }
    //console.log("PointText: "+pointsText);
    return pointsText;
};
var getPointsUp = function (post) {
    return getPointsUpOrDown(post, 1);
};
var getPointsDown = function (post) {
    return getPointsUpOrDown(post, -1);
};
var getNewFromUsers = function (post) {
    return "";
};
const getImageFormatUrl = function (image, formatId) {
    var formats = JSON.parse(image.formats);
    if (formats && formats.length > 0)
        return formats[formatId];
    else
        return "";
};
const getMediaFormatUrl = function (media, formatId) {
    var formats = media.formats;
    if (formats && formats.length > 0)
        return formats[formatId];
    else
        return "";
};
const getMediaURLs = function (post) {
    var mediaURLs = "";
    if (post.Points && post.Points.length > 0) {
        _.forEach(post.Points, function (point) {
            if (point.PointVideos && point.PointVideos.length > 0) {
                mediaURLs += _.map(point.PointVideos, function (media) {
                    return "" + getMediaFormatUrl(media, 0) + "\n";
                });
            }
            if (point.PointAudios && point.PointAudios.length > 0) {
                mediaURLs += _.map(point.PointAudios, function (media) {
                    return "" + getMediaFormatUrl(media, 0) + "\n";
                });
            }
        });
    }
    if (post.PostVideos && post.PostVideos.length > 0) {
        mediaURLs += _.map(post.PostVideos, function (media) {
            return "" + getMediaFormatUrl(media, 0) + "\n";
        });
    }
    if (post.PostAudios && post.PostAudios.length > 0) {
        mediaURLs += _.map(post.PostAudios, function (media) {
            return "" + getMediaFormatUrl(media, 0) + "\n";
        });
    }
    return '"' + mediaURLs + '"';
};
const getMediaTranscripts = function (post) {
    if (post.public_data && post.public_data.transcript && post.public_data.transcript.text) {
        return '"' + post.public_data.transcript.text + '"';
    }
    else {
        return "";
    }
};
const getImages = function (post) {
    var imagesText = "";
    if (post.PostHeaderImages && post.PostHeaderImages.length > 0) {
        imagesText += _.map(post.PostHeaderImages, function (image) {
            return getImageFormatUrl(image, 0) + "\n";
        });
    }
    if (post.PostUserImages && post.PostUserImages.length > 0) {
        imagesText += _.map(post.PostUserImages, function (image) {
            return getImageFormatUrl(image, 0) + "\n";
        });
    }
    return '"' + imagesText.replace(/,/g, "") + '"';
};
const getCategory = function (post) {
    if (post.Category) {
        return post.Category.name;
    }
    else {
        return "";
    }
};
const getRatingHeaders = (customRatings) => {
    let out = "";
    if (customRatings && customRatings.length > 0) {
        customRatings.forEach((rating) => {
            out += ',"' + rating.name + ' count"';
            out += ',"' + rating.name + ' average"';
        });
    }
    return out;
};
const getPostRatings = (customRatings, postRatings) => {
    let out = "";
    if (customRatings && customRatings.length > 0) {
        customRatings.forEach((rating, index) => {
            out += ',' + (postRatings && postRatings[index] ? postRatings[index].count : '0');
            out += ',' + (postRatings && postRatings[index] && postRatings[index].averageRating ? postRatings[index].averageRating : '0');
        });
    }
    return out;
};
const getDescriptionColumns = (group, post) => {
    if (group && group.configuration && group.configuration.structuredQuestions && group.configuration.structuredQuestions !== "") {
        var structuredAnswers = [];
        var questionComponents = group.configuration.structuredQuestions.split(",");
        for (var i = 0; i < questionComponents.length; i += 2) {
            var question = questionComponents[i];
            var maxLength = questionComponents[i + 1];
            structuredAnswers.push({
                translatedContent: question,
                question: question,
                maxLength: maxLength, value: ""
            });
        }
        if (post.public_data && post.public_data.structuredAnswers && post.public_data.structuredAnswers !== "") {
            var answers = post.public_data.structuredAnswers.split("%!#x");
            for (i = 0; i < answers.length; i += 1) {
                if (structuredAnswers[i])
                    structuredAnswers[i].value = answers[i];
            }
        }
        else {
            structuredAnswers[0].value = post.description;
        }
        let columnsString = '';
        structuredAnswers.forEach((question) => {
            if (question.value) {
                columnsString += '"' + question.value + '",';
            }
            else {
                columnsString += '"",';
            }
        });
        return columnsString.substring(0, columnsString.length - 1);
    }
    else {
        return '"' + post.description + '"';
    }
};
const getDescriptionHeaders = (group) => {
    if (group && group.configuration.structuredQuestions && group.configuration.structuredQuestions !== "") {
        var structuredQuestions = [];
        var questionComponents = group.configuration.structuredQuestions.split(",");
        for (var i = 0; i < questionComponents.length; i += 2) {
            var question = questionComponents[i];
            var maxLength = questionComponents[i + 1];
            structuredQuestions.push({
                translatedContent: question,
                question: question,
                maxLength: maxLength, value: ""
            });
        }
        let columnsString = '';
        structuredQuestions.forEach((question) => {
            columnsString += '"' + question.translatedContent + '",';
        });
        return columnsString.substring(0, columnsString.length - 1);
    }
    else {
        return "Description";
    }
};
const getGroupPosts = (group, hostName, callback) => {
    models.Post.unscoped().findAll({
        where: {
            group_id: group.id
        },
        attributes: ['id', 'counter_endorsements_down', 'counter_endorsements_up', 'counter_points', 'public_data', 'name', 'description', 'language', 'location', 'data'],
        order: [
            ['created_at', 'asc']
        ],
        include: [
            {
                model: models.Category,
                required: false
            },
            {
                model: models.Group,
                attributes: ['id', 'configuration'],
                required: true
            },
            {
                model: models.PostRevision,
                required: false
            },
            {
                model: models.Point,
                attributes: ['id', 'content', 'value', 'language', 'public_data'],
                required: false,
                include: [
                    {
                        model: models.Audio,
                        as: 'PointAudios',
                        attributes: ['id', 'public_meta', 'formats'],
                        required: false
                    },
                    {
                        model: models.PointRevision,
                        required: true,
                        attributes: ['id', 'content']
                    },
                    {
                        model: models.Video,
                        as: 'PointVideos',
                        attributes: ['id', 'public_meta', 'formats'],
                        required: false
                    }
                ]
            },
            { model: models.Image,
                as: 'PostHeaderImages',
                required: false
            },
            {
                model: models.User,
                required: true
            },
            {
                model: models.Audio,
                as: 'PostAudios',
                attributes: ['id', 'public_meta', 'formats'],
                required: false
            },
            {
                model: models.Video,
                as: 'PostVideos',
                attributes: ['id', 'public_meta', 'formats'],
                required: false
            },
            {
                model: models.Image,
                as: 'PostUserImages',
                required: false,
                where: {
                    deleted: false
                }
            }
        ]
    }).then(function (posts) {
        let categories = [];
        posts.forEach((post) => {
            if (post.Category) {
                categories.push(post.Category.name);
            }
        });
        categories = _.uniq(categories);
        callback(posts, null, categories);
    }).catch(function (error) {
        callback(null, error);
    });
};
var getExportFileDataForGroup = function (group, hostName, callback) {
    getGroupPosts(group, hostName, (posts, error) => {
        if (error) {
            callback(error);
        }
        else {
            var outFileContent = "";
            let customRatings;
            if (group.configuration && group.configuration.customRatings) {
                customRatings = group.configuration.customRatings;
            }
            //console.log(posts.length);
            outFileContent += "Nr, Post id,email,User Name,Post Name," + getDescriptionHeaders(group) + ",Url,Category,Latitude,Longitude,Up Votes,Down Votes,Points Count,Points For,Points Against,Images,Contact Name,Contact Email,Contact telephone,Attachment URL,Attachment filename,Media URLs,Post transcript" + getRatingHeaders(customRatings) + "\n";
            let postCounter = 0;
            async.eachSeries(posts, function (post, seriesCallback) {
                postCounter += 1;
                if (!post.deleted) {
                    const postRatings = (post.public_data && post.public_data.ratings) ? post.public_data.ratings : null;
                    outFileContent += postCounter + ',' + post.id + ',"' + getUserEmail(post) + '","' + post.User.name +
                        '","' + clean(post.name) + '",' + getDescriptionColumns(group, post) + ',' +
                        '"' + getPostUrl(post) + '",' + '"' + getCategory(post) + '",' +
                        getLocation(post) + ',' + post.counter_endorsements_up + ',' + post.counter_endorsements_down +
                        ',' + post.counter_points + ',' + getPointsUp(post) + ',' + getPointsDown(post) + ',' +
                        getImages(post) + ',' +
                        getContactData(post) + ',' +
                        getAttachmentData(post) + ',' +
                        getMediaURLs(post) + ',' +
                        getMediaTranscripts(post) +
                        getPostRatings(customRatings, postRatings) + '\n';
                }
                else {
                    outFileContent += postCounter + ',' + post.id + ',DELETED,,,,,,,,,,,\n';
                }
                seriesCallback();
            }, function (error) {
                if (error) {
                    callback(error);
                }
                else {
                    callback(null, outFileContent);
                }
            });
        }
    });
};
const getLoginsExportDataForCommunity = (communityId, hostName, callback) => {
    let outFileContent = "Date, User id, Name, Email, Method, Department\n";
    models.AcActivity.findAll({
        where: {
            type: 'activity.user.login',
            community_id: communityId
        },
        order: [['created_at', 'DESC']],
        attributes: ['object', 'created_at'],
        include: [
            {
                model: models.User,
                attributes: ['id', 'email', 'name']
            }
        ]
    }).then((activities) => {
        async.eachSeries(activities, (activity, seriesCallback) => {
            const date = moment(activity.created_at).format("DD/MM/YY HH:mm");
            outFileContent += date + "," + activity.User.id + ',"' + activity.User.name + '",' + activity.User.email + "," + activity.object.loginType + "," + activity.object.userDepartment + "\n";
            seriesCallback();
        }, (error) => {
            callback(error, outFileContent);
        });
    }).catch((error) => {
        callback(error);
    });
};
const getUsersForCommunity = (communityId, callback) => {
    let outFileContent = "User id, Name, Email, Ssn\n";
    models.Community.findOne({
        where: {
            id: communityId
        },
        attributes: ['id'],
        include: [
            {
                model: models.User,
                attributes: ['id', 'email', 'name', 'ssn'],
                as: "CommunityUsers"
            }
        ]
    }).then((community) => {
        async.eachSeries(community.CommunityUsers, (user, seriesCallback) => {
            if (!user.ssn)
                user.ssn = "";
            if (!user.email)
                user.email = "";
            outFileContent += user.id + ',"' + user.name + '",' + user.email + "," + user.ssn + "\n";
            seriesCallback();
        }, (error) => {
            callback(error, outFileContent);
        });
    }).catch((error) => {
        callback(error);
    });
};
const getLoginsExportDataForDomain = (domainId, hostName, callback) => {
    let outFileContent = "Date, User id, Name, Email, Method, Department\n";
    models.AcActivity.findAll({
        where: {
            type: 'activity.user.login',
            domain_id: domainId
        },
        order: [['created_at', 'DESC']],
        attributes: ['object', 'created_at'],
        include: [
            {
                model: models.User,
                attributes: ['id', 'email', 'name']
            }
        ]
    }).then((activities) => {
        async.eachSeries(activities, (activity, seriesCallback) => {
            const date = moment(activity.created_at).format("DD/MM/YY HH:mm");
            outFileContent += date + "," + activity.User.id + ',"' + activity.User.name + '",' + activity.User.email + "," + activity.object.loginType + "," + activity.object.userDepartment + "\n";
            seriesCallback();
        }, (error) => {
            callback(error, outFileContent);
        });
    }).catch((error) => {
        callback(error);
    });
};
module.exports = {
    getExportFileDataForGroup: getExportFileDataForGroup,
    getLoginsExportDataForCommunity: getLoginsExportDataForCommunity,
    getLoginsExportDataForDomain: getLoginsExportDataForDomain,
    getGroupPosts: getGroupPosts,
    getUsersForCommunity,
    getDescriptionHeaders,
    getPostUrl,
    getCategory,
    getImages,
    clean,
    getDescriptionColumns,
    getPointsDown,
    getPointsUp,
    getUserEmail,
    getRatingHeaders,
    getContactData,
    getLocation,
    getAttachmentData,
    getMediaURLs,
    getMediaTranscripts,
    getPostRatings
};
