"use strict";
var models = require('../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var recountOnePost = function (postId, done) {
    var endorsementsCount;
    var oppositionCount;
    var pointCount;
    async.parallel([
        function (parallelCallback) {
            models.Endorsement.count({
                where: {
                    value: 1,
                    post_id: postId
                }
            }).then(function (count) {
                endorsementsCount = count;
                parallelCallback();
            }).catch(function (error) {
                parallelCallback(error);
            });
        },
        function (parallelCallback) {
            models.Endorsement.count({
                where: {
                    value: -1,
                    post_id: postId
                }
            }).then(function (count) {
                oppositionCount = count;
                parallelCallback();
            }).catch(function (error) {
                parallelCallback(error);
            });
        },
        function (parallelCallback) {
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
                    console.log("Results: " + results);
                    done();
                });
            }).catch(function (error) {
                done(error);
            });
        }
    });
};
var recountAllPosts = function (done) {
    models.Post.findAll({
        attribute: ['id']
    }).then(function (postIds) {
        async.eachSeries(postIds, function (post, forEachCallback) {
            recountOnePost(post.id, forEachCallback);
        });
    });
};
async.series([
    function (seriesCallback) {
        recountAllPosts(seriesCallback);
    }
], function (error) {
    if (error) {
        console.error(error);
    }
    else {
        console.log("Done counting all");
    }
    process.exit();
});
