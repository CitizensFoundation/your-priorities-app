var models = require('../models/index.cjs');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var csvParser = require('csv-parse');
var fs = require('fs');
var onePostId = process.argv[2];
var oneGroupId = process.argv[3];
var csvFileName = process.argv[4];
var reykjavikThinRoddCategoryLookup = { 3: "skipulagsmál",
    4: "ýmislegt",
    5: "stjórnsýsla",
    6: "mannréttindi",
    7: "menning og listir",
    8: "íþróttir",
    9: "frítími og útivist",
    10: "menntamál",
    11: "umhverfismál",
    12: "ferðamál",
    13: "velferð",
    14: "framkvæmdir",
    15: "samgöngur"
};
var moveOnePost = function (groupId, postId, categoryId, done) {
    var group, post, domainId, communityId;
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
                callback();
            });
        },
        function (callback) {
            models.Post.findOne({
                where: {
                    id: postId
                }
            }).then(function (postIn) {
                post = postIn;
                post.set('group_id', group.id);
                if (categoryId) {
                    post.set('category_id', categoryId);
                }
                post.save().then(function () {
                    console.log("Have changed group id for post");
                    callback();
                });
            });
        },
        function (callback) {
            models.Point.findAll({
                where: {
                    post_id: postId
                }
            }).then(function (pointsIn) {
                async.eachSeries(pointsIn, function (point, innerSeriesCallback) {
                    point.set('group_id', group.id);
                    point.set('community_id', communityId);
                    point.set('domain_id', domainId);
                    point.save().then(function () {
                        console.log("Have changed group and all for point: " + point.id);
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
                        console.log("Have changed group and all activity: " + activity.id);
                        innerSeriesCallback();
                    });
                }, function (error) {
                    callback();
                });
            });
        }
    ], function (error) {
        console.log("Done");
        if (error)
            console.error(error);
        done(error);
    });
};
var getPostIdFromUrl = function (url) {
    var splitted = url.split('/');
    return splitted[splitted.length - 1];
};
var moveManyFromCsv = function (csvFileName, done) {
    fs.readFile(csvFileName, 'utf8', function (error, contents) {
        console.log(contents);
        if (!error) {
            csvParser(contents, {}, function (err, allPosts) {
                async.forEach(allPosts, function (post, seriesCallback) {
                    moveOnePost(getPostIdFromUrl(post[0]), post[1], post[2], function (error) {
                        seriesCallback(error);
                    });
                }, function (error) {
                    done(error);
                });
            });
        }
        else {
            done(error);
        }
    });
};
if (onePostId != 'null') {
    moveOnePost(oneGroupId, onePostId, null, function (error) {
        if (error)
            console.error(error);
        process.exit();
    });
}
else if (csvFileName) {
    moveManyFromCsv(csvFileName, function (error) {
        if (error)
            console.error(error);
        process.exit();
    });
}
else {
    console.error("Invalid start state");
    process.exit();
}
export {};
