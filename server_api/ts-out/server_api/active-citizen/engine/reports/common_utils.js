"use strict";
var models = require('../../../models/index');
var async = require('async');
var _ = require('lodash');
const moment = require('moment');
const skipEmail = false;
const aws = require('aws-sdk');
const log = require('../../utils/logger');
const request = require('request');
const fs = require('fs');
const downloadImage = (uri, filename, callback) => {
    request.head(uri, (err, res, body) => {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};
const getImageFromUrl = (url, done) => {
    const tmpFilename = "/tmp/" + Math.random() + (url.replace("http://", "").replace(/\//g, ''));
    downloadImage(url, tmpFilename, () => {
        done(null, tmpFilename);
    });
    /*  const options = {
      url: url,
    };
    request.get(options, (error, response, body) => {
      if (error || (response && response.statusCode!==200)) {
        done("Error getting image");
      } else {
  //      const data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
        const data = new Buffer(body);
        done(null, new Uint8Array(body));
      }
    });*/
};
const uploadToS3 = (jobId, userId, filename, exportType, data, done) => {
    const endPoint = process.env.S3_ENDPOINT || "s3.amazonaws.com";
    const s3 = new aws.S3({
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        endpoint: endPoint,
        region: process.env.S3_REGION || ((process.env.S3_ENDPOINT || process.env.S3_ACCELERATED_ENDPOINT) ? null : 'us-east-1'),
    });
    const keyName = "/" + exportType + "/" + userId + "/" + filename;
    s3.upload({
        Bucket: process.env.S3_REPORTS_BUCKET,
        Key: keyName,
        Body: data
    }, (error, data) => {
        if (error) {
            done(error);
        }
        else {
            s3.getSignedUrl('getObject', {
                Bucket: process.env.S3_REPORTS_BUCKET,
                Key: keyName,
                Expires: 60 * 60
            }, (error, url) => {
                if (error) {
                    done(error);
                }
                else {
                    done(null, url);
                }
            });
        }
    }).on('httpUploadProgress', function (progress) {
        updateUploadJobStatus(jobId, Math.round((progress.loaded / progress.total) * 100));
    });
};
async function preparePosts(workPackage, callback) {
    let customRatings;
    const group = workPackage.group;
    const hostName = workPackage.hostname;
    const targetLanguage = workPackage.translateLanguage;
    const jobId = workPackage.jobId;
    if (group.configuration && group.configuration.customRatings) {
        customRatings = group.configuration.customRatings;
    }
    if (targetLanguage) {
        group.translatedName = await getTranslation(group, 'groupName', targetLanguage);
        group.translatedObjectives = await getTranslation(group, 'groupContent', targetLanguage);
        group.targetTranslationLanguage = targetLanguage;
        if (group.configuration) {
            if (group.configuration.alternativePointForHeader) {
                group.translatedAlternativePointForHeader = await getTranslation(group, 'alternativePointForHeader', targetLanguage);
            }
            if (group.configuration.alternativePointForHeader) {
                group.translatedAlternativePointAgainstHeader = await getTranslation(group, 'alternativePointAgainstHeader', targetLanguage);
            }
            if (group.configuration.customTabTitleNewLocation) {
                group.customTabTitleNewLocation = await getTranslation(group, 'customTabTitleNewLocation', targetLanguage);
            }
            if (group.configuration.customAdminCommentsTitle) {
                group.translatedCustomAdminCommentsTitle = await getTranslation(group, 'customAdminCommentsTitle', targetLanguage);
            }
        }
    }
    getGroupPosts(group, hostName, async (postsIn, error, categories) => {
        if (error) {
            callback(error);
        }
        else {
            const posts = [];
            const totalPosts = postsIn.length;
            async.eachLimit(postsIn, 1, async (post) => {
                if (!post.deleted) {
                    const postRatings = (post.public_data && post.public_data.ratings) ? post.public_data.ratings : null;
                    posts.push({
                        id: post.id,
                        name: clean(post.name),
                        translatedName: targetLanguage ? await getTranslation(post, 'postName', targetLanguage) : null,
                        translatedDescription: targetLanguage ? await getTranslation(post, 'postContent', targetLanguage) : null,
                        realPost: post,
                        url: getPostUrl(post, hostName),
                        category: getCategory(post),
                        userEmail: getUserEmail(post),
                        userName: post.User.name,
                        location: getLocation(post),
                        endorsementsUp: post.counter_endorsements_up,
                        endorsementsDown: post.counter_endorsements_down,
                        status: post.status,
                        User: post.User,
                        counterPoints: post.counter_points,
                        pointsUp: getPointsUp(post),
                        Points: post.Points,
                        translatedPoints: targetLanguage ? await getTranslatedPoints(post.Points, targetLanguage) : null,
                        images: getImages(post),
                        pointsDown: getPointsDown(post),
                        contactData: getContactData(post),
                        attachmentData: getAttachmentData(post),
                        mediaURLs: getMediaURLs(post),
                        mediaTranscripts: getMediaTranscripts(post),
                        postRatings: getPostRatings(customRatings, postRatings)
                    });
                }
                //          seriesCallback();
            }, function (error) {
                if (error) {
                    callback(error);
                }
                else {
                    callback(null, { jobId, group, posts, customRatings, categories });
                }
            });
        }
    });
}
;
const getOrderedPosts = (posts) => {
    return _.orderBy(posts, [post => { return post.endorsementsUp - post.endorsementsDown; }], ['desc']);
};
const updateJobStatusIfNeeded = (jobId, totalPosts, processedCount, lastReportedCount, done) => {
    const countSinceLastSent = processedCount - lastReportedCount;
    const percentOfTotalSinceLast = countSinceLastSent / totalPosts;
    if (percentOfTotalSinceLast >= 0.1) {
        let progress = Math.round(((processedCount / totalPosts) * 100) / 2);
        models.AcBackgroundJob.update({ progress }, { where: { id: jobId } }).then(() => {
            done(null, true);
        }).catch((error) => {
            done(error);
        });
    }
    else {
        done();
    }
};
const updateUploadJobStatus = (jobId, uploadProgress) => {
    let progress = Math.min(Math.round(50 + uploadProgress / 2), 95);
    models.AcBackgroundJob.update({ progress }, { where: { id: jobId } }).then(() => {
    }).catch((error) => {
        log.error("updateUploadJobStatus", { error: error });
    });
};
const setJobError = (jobId, errorToUser, errorDetail, done) => {
    log.error("Error in background job", { error: errorDetail });
    models.AcBackgroundJob.update({ error: errorToUser, progress: 0 }, { where: { id: jobId } }).then(() => {
        done();
    }).catch((error) => {
        done(error);
    });
};
const getImageFormatUrl = function (image, formatId) {
    var formats = JSON.parse(image.formats);
    if (formats && formats.length > 0)
        return formats[formatId];
    else
        return "";
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
    return '' + imagesText.replace(/,/g, "") + '';
};
async function getTranslation(model, textType, targetLanguage) {
    return await new Promise(resolve => {
        models.AcTranslationCache.getTranslation({ query: { textType, targetLanguage } }, model, async (error, translation) => {
            if (error || !translation) {
                resolve(null);
            }
            else {
                resolve(translation.content);
            }
        });
    });
}
;
async function getTranslatedPoints(points, targetLanguage) {
    const translatedPoints = {};
    return await new Promise(resolve => {
        async.eachSeries(points, (point, seriesCallback) => {
            models.AcTranslationCache.getTranslation({ query: { textType: "pointContent", targetLanguage } }, point, async (error, translation) => {
                if (!error && translation) {
                    translatedPoints[point.id] = translation.content;
                    if (point.public_data && point.public_data.admin_comments) {
                        models.AcTranslationCache.getTranslation({ query: { textType: "pointAdminCommentContent", targetLanguage } }, point, async (error, translation) => {
                            if (!error && translation) {
                                translatedPoints[point.id + "adminComments"] = translation.content;
                                seriesCallback();
                            }
                            else {
                                log.warn("Docx translation error or no translation", { error: error ? error : null });
                                seriesCallback();
                            }
                        });
                    }
                    else {
                        seriesCallback();
                    }
                }
                else {
                    log.warn("Docx translation error or no translation", { error: error ? error : null });
                    seriesCallback();
                }
            });
        }, (error) => {
            resolve(translatedPoints);
        });
    });
}
const getPostUrl = function (post, hostname) {
    if (hostname) {
        return 'https://' + hostname + '/post/' + post.id;
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
    var points = _.filter(post.Points, function (point) {
        if (value > 0) {
            return point.value > 0;
        }
        else {
            return point.value < 0;
        }
    });
    return points.map((point) => { return { content: point.content, id: point.id, public_data: point.public_data, created_at: point.created_at, PointRevisions: point.PointRevisions, User: point.User }; });
};
const getPointsUp = function (post) {
    return getPointsUpOrDown(post, 1);
};
const getPointsDown = function (post) {
    return getPointsUpOrDown(post, -1);
};
var getNewFromUsers = function (post) {
    return "";
};
const getMediaFormatUrl = function (media, formatId) {
    var formats = media.formats;
    if (formats && formats.length > 0)
        return formats[formatId];
    else
        return "";
};
const getPointMediaUrls = function (post) {
    let mediaURLs = "";
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
    return mediaURLs;
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
                translatedQuestion: question,
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
                translatedQuestion: question,
                question: question,
                maxLength: maxLength, value: ""
            });
        }
        let columnsString = '';
        structuredQuestions.forEach((question) => {
            columnsString += '"' + question.translatedQuestion + '",';
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
        attributes: ['id', 'counter_endorsements_down', 'counter_endorsements_up', 'status', 'counter_points', 'public_data', 'name', 'description', 'language', 'location', 'data', 'created_at'],
        order: [
            ['created_at', 'asc'],
            [{ model: models.Point }, 'counter_quality_up', 'desc'],
            [{ model: models.Point }, models.PointRevision, 'created_at', 'asc'],
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
                attributes: ['id', 'content', 'value', 'language', 'created_at', 'public_data', 'counter_quality_up', 'counter_quality_down', 'status'],
                required: false,
                include: [
                    {
                        model: models.User,
                        required: true,
                        attributes: ['id', 'name', 'email', 'private_profile_data']
                    },
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
                required: true,
                attributes: ['id', 'name', 'email', 'private_profile_data']
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
    getPostRatings,
    updateJobStatusIfNeeded,
    getTranslatedPoints,
    getTranslation,
    getOrderedPosts,
    setJobError,
    preparePosts,
    uploadToS3,
    getImageFromUrl,
    getPointMediaUrls
};
