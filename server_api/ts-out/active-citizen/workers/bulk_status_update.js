"use strict";
// https://gist.github.com/mojodna/1251812
var async = require("async");
var models = require("../../models");
var log = require('../utils/logger');
var queue = require('./queue');
var i18n = require('../utils/i18n');
var toJson = require('../utils/to_json');
var airbrake = null;
if (process.env.AIRBRAKE_PROJECT_ID) {
    airbrake = require('../utils/airbrake');
}
var _ = require('lodash');
var BulkStatusUpdateWorker = function () { };
var verifyMode = true;
var verifiedMovedPostCount, verifiedStatusChangedPostsCount;
var movePostToGroupId = function (postId, toGroupId, done) {
    var group, post, communityId, domainId;
    async.series([
        function (callback) {
            models.Group.findOne({
                where: {
                    id: toGroupId
                },
                include: [
                    {
                        model: models.Community,
                        required: true,
                        include: [
                            {
                                model: models.Domain,
                                required: true
                            }
                        ]
                    }
                ]
            }).then(function (groupIn) {
                group = groupIn;
                communityId = group.Community.id;
                domainId = group.Community.Domain.id;
                callback();
            }).catch(function (error) {
                callback(error);
            });
        },
        function (callback) {
            models.Post.findOne({
                where: {
                    id: postid
                }
            }).then(function (postIn) {
                post = postIn;
                post.set('group_id', group.id);
                if (!verifyMode) {
                    post.save().then(function (results) {
                        log.info("Have changed group id");
                        callback();
                    });
                }
                else {
                    log.info("Not moving post, only verifying");
                    verifiedMovedPostCount += 1;
                }
            }).catch(function (error) {
                callback(error);
            });
        },
        function (callback) {
            if (!verifyMode) {
                models.AcActivity.findAll({
                    where: {
                        post_id: post.id
                    }
                }).then(function (activities) {
                    async.eachSeries(activities, function (activity, innerSeriesCallback) {
                        activity.set('group_id', group.id);
                        activity.set('community_id', communityId);
                        activity.set('domain_id', domainId);
                        activity.save().then(function (results) {
                            log.info("Have changed group and all: " + activity.id);
                            innerSeriesCallback();
                        });
                    }, function (error) {
                        callback();
                    });
                }).catch(function (error) {
                    callback(error);
                });
            }
            else {
                callback();
            }
        }
    ], function (error) {
        if (error) {
            done(error);
        }
        else {
            log.info("Moved post to group", { postId: post.id, groupId: group.id });
            done();
        }
    });
};
var createStatusUpdateForPostId = function (postId, official_status, content, userId, callback) {
    models.Post.findOne({
        where: {
            id: postId
        },
        include: [
            {
                model: models.Group,
                required: true,
                attributes: ['id'],
                include: [
                    {
                        model: models.Community,
                        required: true,
                        attributes: ['id'],
                        include: [
                            {
                                model: models.Domain,
                                required: true,
                                attributes: ['id']
                            }
                        ]
                    }
                ]
            }
        ]
    }).then(function (post) {
        if (post) {
            if (!verifyMode) {
                var postStatusChange = models.PostStatusChange.build({
                    post_id: post.id,
                    status_changed_to: post.official_status != parseInt(official_status) ? official_status : null,
                    content: content,
                    user_id: userId,
                    status: 'active',
                    user_agent: "Bulk Status Update",
                    ip_address: "127.0.0.1"
                });
                postStatusChange.save().then(function (post_status_change) {
                    if (post_status_change) {
                        models.AcActivity.createActivity({
                            type: 'activity.post.status.change',
                            userId: userId,
                            postId: post.id,
                            object: { bulkStatusUpdate: true },
                            postStatusChangeId: post_status_change.id,
                            groupId: post.Group.id,
                            communityId: post.Group.Community.id,
                            domainId: post.Group.Community.Domain.id
                        }, function (error) {
                            if (error) {
                                log.error("Post Status Change Error", {
                                    context: 'status_change',
                                    post: toJson(post),
                                    err: error
                                });
                                callback("Post Status Change Error");
                            }
                            else {
                                if (post.official_status != parseInt(official_status)) {
                                    post.official_status = official_status;
                                    post.save().then(function (results) {
                                        log.info('Post Status Change Created And New Status', {
                                            post: toJson(post),
                                            context: 'status_change'
                                        });
                                        callback();
                                    });
                                }
                                else {
                                    log.info('Post Status Change Created', {
                                        post: toJson(post),
                                        context: 'status_change'
                                    });
                                    callback();
                                }
                            }
                        });
                    }
                    else {
                        log.error("Post Status Change Error", {
                            context: 'status_change',
                            post: toJson(post),
                            err: "Could not created status change"
                        });
                        callback("Post Status Change Error");
                    }
                }).catch(function (error) {
                    log.error("Post Status Change Error", {
                        context: 'status_change',
                        post: toJson(post),
                        err: error
                    });
                    callback("Post Status Change Error");
                });
            }
            else {
                console.log("Not changing status, only verifying");
                verifiedStatusChangedPostsCount += 1;
            }
        }
        else {
            log.error("Post Status Change Post Not Found", {
                context: 'status_change',
                err: "Could not created status change"
            });
            callback("404");
        }
    }).catch(function (error) {
        callback(error);
    });
};
var getAllUsersWithEndorsements = function (config, callback) {
    var allPostIds = [];
    var allUsers = [];
    _.each(config.groups, function (group) {
        _.each(group.posts, function (post) {
            allPostIds.push(post.id);
        });
    });
    async.eachSeries(allPostIds, function (postId, seriesCallback) {
        models.Endorsement.findAll({
            where: {
                post_id: postId
            },
            include: [
                models.User
            ]
        }).then(function (endorsements) {
            _.each(endorsements, function (endorsement) {
                allUsers.push(endorsement.User);
                seriesCallback();
            });
        }).catch(function (error) {
            seriesCallback(error);
        });
    }, function (error) {
        allUsers = _.uniqBy(allUsers, function (user) {
            return user.id;
        });
        callback(error, allUsers);
    });
};
var changeStatusOfAllPost = function (config, userId, callback) {
    var allPosts = [];
    _.each(config.groups, function (group) {
        _.each(group.posts, function (post) {
            allPosts.push(post);
        });
    });
    async.eachSeries(allPosts, function (configPost, seriesCallback) {
        models.Post.findOne({
            where: {
                id: configPost.id
            },
            include: [
                models.User
            ]
        }).then(function (dbPost) {
            if (configPost.templateName || configPost.customMessage) {
                var statusMessage;
                if (configPost.templateName) {
                    statusMessage = config.templates[configPost.templateName].content;
                }
                else if (configPost.customMessage) {
                    statusMessage = configPost.customMessage;
                }
                createStatusUpdateForPostId(configPost.id, configPost.changeStatusTo, statusMessage, userId, seriesCallback);
            }
            else {
                seriesCallback();
            }
        }).catch(function (error) {
            seriesCallback(error);
        });
    }, function (error) {
        callback(error);
    });
};
var moveNeededPosts = function (config, callback) {
    async.eachSeries(config.groups, function (configGroup, groupSeriesCallback) {
        async.eachSeries(configGroup, function (configPost, postSeriesCallback) {
            models.Post.findOne({
                where: {
                    id: configPost.id
                },
                include: [
                    models.User
                ]
            }).then(function (dbPost) {
                if (configPost.moveToGroupId) {
                    movePostToGroupId(dbPost.id, moveToGroupId, postSeriesCallback);
                }
                else {
                    postSeriesCallback();
                }
            }).catch(function (error) {
                postSeriesCallback(error);
            });
        }, function (error) {
            groupSeriesCallback(error, allUsers);
        });
    }, function (error) {
        callback(error);
    });
};
const createBulkStatusUpdates = function (statusUpdateJson, users, callback) {
    models.BulkStatusUpdate.findOne({
        where: {
            id: statusUpdateJson.id
        },
        include: [
            {
                model: models.Community,
                required: true,
                attributes: ['id'],
                include: [
                    {
                        model: models.Domain,
                        required: true,
                        attributes: ['id']
                    }
                ]
            }
        ]
    }).then(function (statusUpdate) {
        if (statusUpdate) {
            async.eachSeries(users, function (user, seriesCallback) {
                models.AcActivity.createActivity({
                    type: 'activity.bulk.status.update',
                    userId: user.id,
                    object: {
                        bulkStatusUpdateId: statusUpdate.id
                    },
                    communityId: statusUpdate.Community.id,
                    domainId: statusUpdate.Community.Domain.id
                }, function (error) {
                    if (error) {
                        log.error("Bulk Status Change Error", {
                            context: 'status_change',
                            post: toJson(post),
                            err: error
                        });
                        seriesCallback("Bulk Status Change Error");
                    }
                    else {
                        if (post.official_status != parseInt(official_status)) {
                            post.official_status = official_status;
                            post.save().then(function (results) {
                                log.info('Bulk Status Change Created And New Status', {
                                    post: toJson(post),
                                    context: 'status_change'
                                });
                                seriesCallback();
                            });
                        }
                        else {
                            log.info('Bulk Status Change Created', {
                                post: toJson(post),
                                context: 'status_change'
                            });
                            seriesCallback();
                        }
                    }
                });
            });
        }
        else {
            callback("Can't find status upodate");
        }
    }).catch(function (error) {
        callback(error);
    });
};
BulkStatusUpdateWorker.prototype.process = function (bulkStatusUpdateInfo, callback) {
    var statusUpdate;
    var allUsersWithEndorsements;
    var allSuccessful, allFailed, allInProgress, allOpen;
    var allMoved;
    if (bulkStatusUpdateInfo.verifyMode) {
        verifyMode = true;
        verifiedMovedPostCount = verifiedStatusChangedPostsCount = 0;
    }
    else {
        verifyMode = false;
    }
    async.series([
        // Get Bulk Status Update
        function (seriesCallback) {
            models.BulkStatusUpdate.findOne({
                where: { id: bulkStatusUpdateInfo.bulkStatusUpdateId },
                include: [
                    {
                        model: models.Community,
                        required: true
                    },
                    {
                        model: models.User,
                        required: true
                    }
                ]
            }).then(function (results) {
                if (results) {
                    log.info("BulkStatusUpdateWorker Debug 1", { results: results.dataValues });
                    statusUpdate = results;
                    seriesCallback();
                }
                else {
                    seriesCallback('BulkStatusUpdateWorker Update not found');
                }
            }).catch(function (error) {
                seriesCallback(error);
            });
        },
        function (seriesCallback) {
            changeStatusOfAllPost(statusUpdate.config, statusUpdate.user_id, seriesCallback);
        },
        function (seriesCallback) {
            moveNeededPosts(statusUpdate.config, seriesCallback);
        },
        // Get All Users With Endorsements
        function (seriesCallback) {
            getAllUsersWithEndorsements(statusUpdate.config, function (error, users) {
                if (error) {
                    seriesCallback(error);
                }
                else {
                    createBulkStatusUpdates(statusUpdate, users, seriesCallback);
                }
            });
        }
    ], function (error) {
        if (error) {
            if (error.stack)
                log.error("BulkStatusUpdateWorker Error", { err: error, stack: error.stack.split("\n") });
            else
                log.error("BulkStatusUpdateWorker Error", { err: error });
            if (airbrake) {
                airbrake.notify(error).then((airbrakeErr) => {
                    if (airbrakeErr.error) {
                        log.error("AirBrake Error", { context: 'airbrake', err: airbrakeErr.error });
                    }
                    callback(error);
                });
            }
            else {
                callback(error);
            }
        }
        else {
            log.info('Processing BulkStatusUpdateWorker Started', { type: notification.type, user: user ? user.simple() : null });
        }
    });
};
module.exports = new BulkStatusUpdateWorker();
