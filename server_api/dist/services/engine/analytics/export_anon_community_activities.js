const models = require('../../../models/index.cjs');
const _ = require('lodash');
const async = require('async');
const log = require('../../../utils/logger.cjs');
const crypto = require('crypto');
const fs = require('fs');
//const request = require('request');
const request = {
    post: (data, done) => {
        log.info(JSON.stringify(data, null, 4));
        done();
    }
};
const clean = (text) => {
    //log.info("Before: "+ text);
    var newText = text.replace('"', "'").replace('\n', '').replace('\r', '').replace(/(\r\n|\n|\r)/gm, "").replace(/"/gm, "'").replace(/,/, ';').trim();
    //log.info("After:" + newText);
    return newText.replace(/´/g, '');
};
const getEncryptedId = (id, key, iv) => {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(id.toString());
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
};
let csvPostsTxt = "Id,Date,Name,NameEn,Description,DescriptionEn,ToxicityScore\n";
const saveAnonymousPost = (post, accessKey, done) => {
    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    const properties = {
        id: post.id,
        name: post.name,
        name_en: post.name_en,
        date: post.created_at.toISOString(),
        description: post.description,
        description_en: post.description_en,
        toxicity_score: post.toxicity_score,
        access_key: accessKey,
        access_expires_at: expiryDate.toISOString()
    };
    csvPostsTxt += post.id + ',' + properties.date + ',"' + clean(post.name) + '","' + clean(post.name_en) + '",' + '"' + clean(post.description) + '",' + '"' + clean(post.description_en) + '",' + post.toxicity_score + '\n';
    const options = {
        url: process.env["AC_ANALYTICS_BASE_URL"] + "anonPosts/" + process.env.AC_ANALYTICS_CLUSTER_ID + "/" + `${accessKey}${post.id}`,
        headers: {
            'X-API-KEY': process.env["AC_ANALYTICS_KEY"]
        },
        json: properties
    };
    request.post(options, (error) => {
        done(error);
    });
};
let csvPointsTxt = "Id,Date,Content,ContentEn,Value,ToxicityScore\n";
const saveAnonymousPoint = (point, accessKey, done) => {
    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    const properties = {
        id: point.id,
        date: point.created_at.toISOString(),
        content: point.content,
        content_en: point.content_en,
        value: point.value,
        access_key: accessKey,
        toxicity_score: point.toxicity_score,
        access_expires_at: expiryDate.toISOString()
    };
    csvPointsTxt += point.id + ',' + properties.date + ',"' + clean(point.content) + '",' + '"' + clean(point.content_en) + '",' + point.value + ',' + point.toxicity_score + '\n';
    const options = {
        url: process.env["AC_ANALYTICS_BASE_URL"] + "anonPoints/" + process.env.AC_ANALYTICS_CLUSTER_ID + "/" + `${accessKey}${point.id}`,
        headers: {
            'X-API-KEY': process.env["AC_ANALYTICS_KEY"]
        },
        json: properties
    };
    request.post(options, (error) => {
        done(error);
    });
};
let csvActivitiesTxt = "Id,Date,Type,PointId,PostId,UserId\n";
const saveActivity = (activity, accessKey, done) => {
    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    const properties = {
        id: activity.id,
        date: activity.created_at.toISOString(),
        type: activity.type,
        point_id: activity.point_id,
        post_id: activity.post_id,
        user_id: activity.user_id,
        access_key: accessKey,
        access_expires_at: expiryDate.toISOString()
    };
    csvActivitiesTxt += activity.id + ',' + properties.date + ',"' + activity.type + '",' + '"' + activity.point_id + '",' + '"' + activity.post_id + '",' + '"' + activity.user_id + '"\n';
    const options = {
        url: process.env["AC_ANALYTICS_BASE_URL"] + "anonActivities/" + process.env.AC_ANALYTICS_CLUSTER_ID + "/" + `${accessKey}${activity.id}`,
        headers: {
            'X-API-KEY': process.env["AC_ANALYTICS_KEY"]
        },
        json: properties
    };
    request.post(options, (error) => {
        done(error);
    });
};
let csvUsersTxt = "Id\n";
const saveAnonymousUser = (user, accessKey, done) => {
    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    const properties = {
        id: user.id,
        access_key: accessKey,
        access_expires_at: expiryDate.toISOString()
    };
    csvUsersTxt += user.id + '\n';
    const options = {
        url: process.env["AC_ANALYTICS_BASE_URL"] + "anonUsers/" + process.env.AC_ANALYTICS_CLUSTER_ID + "/" + `${accessKey}${user.id}`,
        headers: {
            'X-API-KEY': process.env["AC_ANALYTICS_KEY"]
        },
        json: properties
    };
    request.post(options, (error) => {
        done(error);
    });
};
const collectAllPostsAndPoints = (activities, collectedPostIds, collectedPointIds) => {
    activities.forEach((item) => {
        if (item.Post) {
            collectedPostIds.push(item.Post.id);
        }
        if (item.Point) {
            collectedPointIds.push(item.Point.id);
        }
        if (!item.Point && !item.Post) {
            log.warn("Can't find post or point id for activity in anonymous export", { item });
        }
    });
};
const sendAllCollectedPostAndPoints = (accessKey, collectedPostIds, collectedPointIds, encryptionKey, encryptionIv, done) => {
    collectedPostIds = _.uniq(collectedPostIds);
    collectedPointIds = _.uniq(collectedPointIds);
    async.series([
        (seriesCallback) => {
            async.forEachSeries(collectedPostIds, (postId, forEachSeriesCallback) => {
                models.Post.findOne({
                    where: {
                        id: postId
                    },
                    attributes: ['id', 'name', 'description', 'public_data', 'created_at', 'data']
                }).then((post) => {
                    let req = {
                        query: {
                            textType: 'postContent',
                            targetLanguage: 'en'
                        }
                    };
                    models.AcTranslationCache.getTranslation(req, post, function (error, descriptionEn) {
                        req = {
                            query: {
                                textType: 'postName',
                                targetLanguage: 'en'
                            }
                        };
                        models.AcTranslationCache.getTranslation(req, post, function (error, nameEn) {
                            saveAnonymousPost({
                                id: getEncryptedId((post.id), encryptionKey, encryptionIv),
                                name: post.name,
                                name_en: nameEn ? nameEn.content : 'no translation',
                                created_at: post.created_at,
                                toxicity_score: (post.data && post.data.moderation) ? post.data.moderation.toxicityScore : null,
                                description: post.description,
                                description_en: descriptionEn ? descriptionEn.content : 'no translation',
                            }, accessKey, forEachSeriesCallback);
                        });
                    });
                }).catch((error) => {
                    forEachSeriesCallback(error);
                });
            }, (error) => {
                seriesCallback(error);
            });
        },
        (seriesCallback) => {
            async.forEachSeries(collectedPointIds, (pointId, forEachSeriesCallback) => {
                models.Point.findOne({
                    where: {
                        id: pointId
                    },
                    order: [
                        [models.PointRevision, 'created_at', 'asc'],
                    ],
                    attributes: ['id', 'created_at', 'content', 'value', 'data'],
                    include: [
                        {
                            model: models.PointRevision,
                            attributes: ['id', 'content']
                        }
                    ]
                }).then((point) => {
                    let req = {
                        query: {
                            textType: 'pointContent',
                            targetLanguage: 'en'
                        }
                    };
                    models.AcTranslationCache.getTranslation(req, point, function (error, contentEn) {
                        saveAnonymousPoint({
                            id: getEncryptedId((point.id), encryptionKey, encryptionIv),
                            content: point.content,
                            value: point.value,
                            toxicity_score: (point.data && point.data.moderation) ? point.data.moderation.toxicityScore : null,
                            created_at: point.created_at,
                            content_en: contentEn ? contentEn.content : 'no translation'
                        }, accessKey, forEachSeriesCallback);
                    });
                }).catch((error) => {
                    forEachSeriesCallback(error);
                });
            }, (error) => {
                seriesCallback(error);
            });
        },
    ], (error) => {
        done(error);
    });
};
const sendAllUserActivitiesWithContent = (userId, communityId, collectedPostIds, collectedPointIds, encryptionKey, encryptionIv, accessKey, done) => {
    models.AcActivity.findAll({
        where: {
            user_id: userId,
            community_id: communityId,
            type: {
                $in: [
                    "activity.post.new", "activity.post.opposition.new", "activity.post.endorsement.new",
                    "activity.point.new", "activity.point.helpful.new", "activity.point.unhelpful.new"
                ]
            }
        },
        attributes: ['id', 'type', 'created_at', 'user_id', 'post_id', 'point_id'],
        include: [
            {
                model: models.Post,
                required: false,
                attributes: ['id']
            },
            {
                model: models.Point,
                required: false,
                attributes: ['id']
            }
        ]
    }).then((activities) => {
        collectAllPostsAndPoints(activities, collectedPostIds, collectedPointIds);
        async.forEachSeries(activities, (activity, forEachSeriesCallback) => {
            if (activity.Post || activity.Point) {
                saveActivity({
                    id: getEncryptedId(activity.id, encryptionKey, encryptionIv),
                    type: activity.type,
                    created_at: activity.created_at,
                    post_id: activity.Post ? getEncryptedId(activity.Post.id, encryptionKey, encryptionIv) : null,
                    point_id: activity.Point ? getEncryptedId(activity.Point.id, encryptionKey, encryptionIv) : null,
                    user_id: getEncryptedId(activity.user_id, encryptionKey, encryptionIv)
                }, accessKey, forEachSeriesCallback);
            }
            else {
                log.warn("Can't find post or point for activity");
                forEachSeriesCallback();
            }
        }, (error) => {
            done(error);
        });
    }).catch(function (error) {
        done(error);
    });
};
const importCommunityUsersAndActivities = (communityId, accessKey, done) => {
    const encryptionKey = crypto.randomBytes(32);
    const encryptionIv = crypto.randomBytes(16);
    let collectedPostIds = [];
    let collectedPointIds = [];
    models.Community.findOne({
        where: {
            id: communityId
        },
        include: [
            {
                model: models.User,
                attributes: ['id'],
                as: 'CommunityUsers',
                required: true,
            }
        ]
    }).then(function (community) {
        if (community && community.CommunityUsers) {
            async.forEachSeries(community.CommunityUsers, (user, eachSeriesCallback) => {
                saveAnonymousUser({
                    id: getEncryptedId(user.id, encryptionKey, encryptionIv)
                }, accessKey, (error) => {
                    if (error) {
                        eachSeriesCallback(error);
                    }
                    else {
                        sendAllUserActivitiesWithContent(user.id, communityId, collectedPostIds, collectedPointIds, encryptionKey, encryptionIv, accessKey, eachSeriesCallback);
                    }
                });
            }, (error) => {
                if (error) {
                    done(error);
                }
                else {
                    sendAllCollectedPostAndPoints(accessKey, collectedPostIds, collectedPointIds, encryptionKey, encryptionIv, (error) => {
                        done(error);
                    });
                }
            });
        }
        else {
            done("Could not find community");
        }
    }).catch(function (error) {
        done(error);
    });
};
importCommunityUsersAndActivities(1017, "12345", () => {
    fs.writeFileSync("/home/robert/Scratch/MMU/users.csv", csvUsersTxt);
    fs.writeFileSync("/home/robert/Scratch/MMU/posts.csv", csvPostsTxt);
    fs.writeFileSync("/home/robert/Scratch/MMU/points.csv", csvPointsTxt);
    fs.writeFileSync("/home/robert/Scratch/MMU/activities.csv", csvActivitiesTxt);
    process.exit();
});
module.exports = {
    importCommunityUsersAndActivities
};
export {};
