const models = require('../models/index.cjs');
const async = require('async');
const _ = require('lodash');
const fs = require('fs');
const request = require('request');
/*
const urlToConfig = "https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/WBMoveIdeas160221.csv"//process.argv[1];
const urlToAddAddFront = "https://kyrgyz-aris.yrpri.org/"; // process.argv[2];
*/
const urlToConfig = process.argv[2];
const urlToAddAddFront = process.argv[3];
let config;
let finalTargetOutput = '';
const countAllInGroup = (groupId, done) => {
    let postCount = 0;
    let pointCount = 0;
    let userCount = 0;
    async.series([
        (seriesCallback) => {
            countPostInGroup(groupId, (error, count) => {
                if (error) {
                    seriesCallback(error);
                }
                else {
                    postCount = count;
                    seriesCallback();
                }
            });
        },
        (seriesCallback) => {
            countPointsInGroup(groupId, (error, count) => {
                if (error) {
                    seriesCallback(error);
                }
                else {
                    pointCount = count;
                    seriesCallback();
                }
            });
        },
        (seriesCallback) => {
            countUsersInGroup(groupId, (error, count) => {
                if (error) {
                    seriesCallback(error);
                }
                else {
                    userCount = count;
                    seriesCallback();
                }
            });
        }
    ], error => {
        if (error) {
            done(error);
        }
        else {
            done(null, postCount, pointCount, userCount);
        }
    });
};
const countPostInGroup = (groupId, done) => {
    models.Post.count({
        where: {
            group_id: groupId
        }
    }).then(count => {
        done(null, count);
    }).catch(error => {
        done(error);
    });
};
const countPointsInGroup = (groupId, done) => {
    models.Point.count({
        where: {
            group_id: groupId
        }
    }).then(count => {
        done(null, count);
    }).catch(error => {
        done(error);
    });
};
const countUsersInGroup = (groupId, done) => {
    const userIds = [];
    async.series([
        (seriesCallback) => {
            models.Endorsement.findAll({
                attributes: ['user_id'],
                include: [
                    {
                        model: models.Post,
                        attributes: ['id'],
                        where: {
                            group_id: groupId
                        }
                    }
                ]
            }).then(endorsements => {
                endorsements.forEach(endorsement => {
                    userIds.push(endorsement.user_id);
                });
                seriesCallback();
            });
        },
        (seriesCallback) => {
            models.Point.findAll({
                attributes: ['user_id'],
                include: [
                    {
                        model: models.Post,
                        attributes: ['id'],
                        where: {
                            group_id: groupId
                        }
                    }
                ]
            }).then(points => {
                points.forEach(point => {
                    userIds.push(point.user_id);
                });
                seriesCallback();
            });
        }
    ], error => {
        done(error, _.uniq(userIds).length);
    });
};
const moveOnePost = (postId, groupId, done) => {
    var group, post, communityId, domainId, oldGroupId, newCommunity;
    async.series([
        function (callback) {
            models.Group.findOne({
                where: {
                    id: groupId
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
                newCommunity = group.Community;
                callback();
            }).catch(function (error) {
                callback(error);
            });
        },
        function (callback) {
            models.Post.findOne({
                where: {
                    id: postId
                }
            }).then(function (postIn) {
                post = postIn;
                oldGroupId = post.group_id;
                post.set('group_id', group.id);
                post.save().then(function (results) {
                    log.info("Have changed group id");
                    callback();
                });
            }).catch(function (error) {
                callback(error);
            });
        },
        function (callback) {
            models.Point.findAll({
                where: {
                    post_id: post.id,
                    status: 'published'
                }
            }).then(function (pointsIn) {
                async.eachSeries(pointsIn, function (point, innerSeriesCallback) {
                    point.set('group_id', group.id);
                    point.set('community_id', communityId);
                    point.set('domain_id', domainId);
                    point.save().then(function () {
                        log.info("Have changed group and all for point: " + point.id);
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
        },
        function (callback) {
            models.Group.findOne({
                where: {
                    id: oldGroupId
                }
            }).then(function (oldGroup) {
                countAllInGroup(group.id, (error, postCount, pointCount, userCount) => {
                    if (error) {
                        callback(error);
                    }
                    else {
                        group.set('counter_points', pointCount);
                        group.set('counter_users', userCount);
                        group.set('counter_posts', postCount);
                        group.save().then(() => {
                            newCommunity.set('counter_points', pointCount);
                            newCommunity.set('counter_users', userCount);
                            newCommunity.set('counter_posts', postCount);
                            newCommunity.save().then(() => {
                                callback();
                            }).catch(error => {
                                callback(error);
                            });
                        }).catch(error => {
                            callback(error);
                        });
                    }
                });
            }).catch(function (error) {
                callback(error);
            });
        }
    ], function (error) {
        finalTargetOutput += "Move postId " + postId + " to " + groupId + "\n";
        finalTargetOutput += urlToAddAddFront + "group/" + groupId + "\n\n";
        done(error);
    });
};
async.series([
    (seriesCallback) => {
        const options = {
            url: urlToConfig,
        };
        request.get(options, (error, content) => {
            if (content && content.statusCode != 200) {
                seriesCallback(content.statusCode);
            }
            else if (content) {
                config = content.body;
                seriesCallback();
            }
            else {
                seriesCallback("No content");
            }
        });
    },
    (seriesCallback) => {
        let index = 0;
        async.forEachSeries(config.split('\r\n'), (configLine, forEachCallback) => {
            const splitLine = configLine.split(",");
            if (index === 0 || !configLine || configLine.length < 3 || !splitLine || splitLine.length !== 2) {
                index += 1;
                forEachCallback();
            }
            else {
                index += 1;
                const postId = splitLine[0];
                const toGroupId = splitLine[1];
                moveOnePost(postId, toGroupId, forEachCallback);
            }
        }, error => {
            seriesCallback();
        });
    },
], error => {
    if (error)
        log.error(error);
    log.info("All done move");
    log.info(finalTargetOutput);
    process.exit();
});
export {};
