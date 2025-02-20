var models = require('../models/index.cjs');
var async = require('async');
var _ = require('lodash');
var groupId = process.argv[2];
var postsCount = 0;
var pointsCount = 0;
async.series([
    function (seriesCallback) {
        models.Post.findAll({
            where: {
                group_id: groupId
            }
        }).then(function (posts) {
            postsCount = posts.length;
            seriesCallback();
        });
    },
    function (seriesCallback) {
        models.Point.findAll({
            include: [
                {
                    model: models.Post,
                    where: {
                        group_id: groupId
                    }
                }
            ]
        }).then(function (posts) {
            pointsCount = posts.length;
            seriesCallback();
        });
    }
], function (error) {
    if (error) {
        console.error(error);
        process.exit();
    }
    else {
        models.Group.findOne({ where: { id: groupId } }).then(function (group) {
            group.counter_posts = postsCount;
            group.counter_points = pointsCount;
            group.save().then(function () {
                console.log("Have updated group");
                process.exit();
            });
        });
    }
});
export {};
