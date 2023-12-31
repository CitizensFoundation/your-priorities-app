"use strict";
var models = require('../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
const groupId = process.argv[2];
let masterPostCount = 0;
let masterPointCount = 0;
let masterEndorsementCount = 0;
let masterQualityCount = 0;
const recountOnePoint = (pointId, done) => {
    var endorsementsCount;
    var oppositionCount;
    let revisionsCount;
    async.parallel([
        (parallelCallback) => {
            models.PointQuality.count({
                where: {
                    value: 1,
                    point_id: pointId
                }
            }).then(function (count) {
                endorsementsCount = count;
                masterQualityCount += count;
                parallelCallback();
            }).catch(function (error) {
                parallelCallback(error);
            });
        },
        (parallelCallback) => {
            models.PointQuality.count({
                where: {
                    value: -1,
                    point_id: pointId
                }
            }).then(function (count) {
                oppositionCount = count;
                masterQualityCount += count;
                parallelCallback();
            }).catch(function (error) {
                parallelCallback(error);
            });
        },
        (parallelCallback) => {
            models.PointRevision.count({
                where: {
                    point_id: pointId
                }
            }).then(function (count) {
                pointCount = count;
                revisionsCount = count;
                parallelCallback();
            }).catch(function (error) {
                parallelCallback(error);
            });
        }
    ], function (error) {
        if (error) {
            done(error);
        }
        else {
            models.Point.findOne({
                where: {
                    id: pointId
                },
                attributes: ['id', 'counter_revisions', 'counter_quality_up', 'counter_quality_down']
            }).then(function (point) {
                point.counter_revisions = revisionsCount;
                point.counter_quality_up = endorsementsCount;
                point.counter_quality_down = oppositionCount;
                point.save().then(() => {
                    done();
                });
            }).catch(error => {
                done(error);
            });
        }
    });
};
const recountOnePost = (postId, done) => {
    var endorsementsCount;
    var oppositionCount;
    var pointCount;
    async.parallel([
        (parallelCallback) => {
            models.Endorsement.count({
                where: {
                    value: 1,
                    post_id: postId
                }
            }).then(function (count) {
                endorsementsCount = count;
                masterEndorsementCount += count;
                parallelCallback();
            }).catch(function (error) {
                parallelCallback(error);
            });
        },
        (parallelCallback) => {
            models.Endorsement.count({
                where: {
                    value: -1,
                    post_id: postId
                }
            }).then(function (count) {
                oppositionCount = count;
                masterEndorsementCount += count;
                parallelCallback();
            }).catch(function (error) {
                parallelCallback(error);
            });
        },
        (parallelCallback) => {
            models.Point.count({
                where: {
                    $or: [
                        { value: -1 },
                        { value: 1 }
                    ],
                    post_id: postId
                }
            }).then(function (count) {
                pointCount = count;
                masterPointCount += count;
                parallelCallback();
            }).catch(function (error) {
                parallelCallback(error);
            });
        }
    ], function (error) {
        if (error) {
            done(error);
        }
        else {
            models.Post.findOne({
                where: {
                    id: postId
                },
                attributes: ['id', 'counter_endorsements_up', 'counter_endorsements_down', 'counter_points']
            }).then(function (post) {
                post.counter_points = pointCount;
                post.counter_endorsements_up = endorsementsCount;
                post.counter_endorsements_down = oppositionCount;
                post.save().then(function (results) {
                    console.log(`Recount for post ${post.id} done`);
                    done();
                });
            }).catch(function (error) {
                done(error);
            });
        }
    });
};
const recountGroupPosts = (groupId, done) => {
    models.Post.findAll({
        where: {
            group_id: groupId
        },
        attribute: ['id']
    }).then(function (posts) {
        masterPostCount = posts.length;
        async.eachSeries(posts, (post, forEachCallback) => {
            recountOnePost(post.id, (error) => {
                forEachCallback();
            });
        }, error => {
            done(error);
        });
    });
};
const recountPostPoints = (postId, done) => {
    models.Point.findAll({
        where: {
            post_id: postId
        },
        attribute: ['id']
    }).then(function (points) {
        async.eachSeries(points, (point, forEachCallback) => {
            recountOnePoint(point.id, forEachCallback);
        }, error => {
            done(error);
        });
    });
};
recountGroupPosts(groupId, error => {
    if (error) {
        console.error(error);
        process.exit();
    }
    else {
        models.Group.findOne({
            where: {
                id: groupId
            },
            include: [
                {
                    model: models.User,
                    as: 'GroupUsers',
                    attributes: ['id'],
                    required: false
                }
            ],
            attributes: ['id', 'counter_posts', 'counter_points', 'counter_users']
        }).then(group => {
            group.counter_posts = masterPostCount;
            group.counter_points = masterPointCount;
            //group.counter_users = group.GroupUsers.length;
            group.save().then(() => {
                console.log(`Done recounting group ${groupId}`);
                process.exit();
            }).catch(error => {
                console.error(error);
                process.exit();
            });
        }).catch(error => {
            console.error(error);
            process.exit();
        });
    }
});
