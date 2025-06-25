var models = require('../models/index.cjs');
var async = require('async');
const communityId = process.argv[2];
const newUserId = process.argv[3];
let postsCount = 0;
let postRevisionCount = 0;
let pointsCount = 0;
let pointRevisionCount = 0;
if (newUserId && newUserId.length > 1) {
    models.User.findOne({
        where: {
            id: newUserId
        }
    }).then(user => {
        if (user) {
            async.series([
                (seriesCallback) => {
                    models.Post.findAll({
                        attributes: ['id', 'user_id'],
                        include: [
                            {
                                model: models.Group,
                                attributes: ['id'],
                                required: true,
                                include: [
                                    {
                                        model: models.Community,
                                        attributes: ['id'],
                                        where: {
                                            id: communityId
                                        }
                                    }
                                ]
                            }
                        ]
                    }).then(function (posts) {
                        async.eachSeries(posts, function (post, callback) {
                            postsCount++;
                            post.set('user_id', newUserId);
                            post.save().then(function (results) {
                                callback();
                            });
                        }, function (error) {
                            seriesCallback(error);
                        });
                    });
                },
                (seriesCallback) => {
                    models.PostRevision.findAll({
                        attributes: ['id', 'user_id'],
                        include: [
                            {
                                model: models.Post,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: models.Group,
                                        attributes: ['id'],
                                        required: true,
                                        include: [
                                            {
                                                model: models.Community,
                                                attributes: ['id'],
                                                where: {
                                                    id: communityId
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }).then(function (postRevisions) {
                        async.eachSeries(postRevisions, function (postRevision, callback) {
                            postRevisionCount++;
                            postRevision.set('user_id', newUserId);
                            postRevision.save().then(function (results) {
                                callback();
                            });
                        }, function (error) {
                            seriesCallback(error);
                        });
                    });
                },
                (seriesCallback) => {
                    models.Point.findAll({
                        attributes: ['id', 'user_id'],
                        include: [
                            {
                                model: models.Post,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: models.Group,
                                        attributes: ['id'],
                                        required: true,
                                        include: [
                                            {
                                                model: models.Community,
                                                attributes: ['id'],
                                                where: {
                                                    id: communityId
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }).then(function (points) {
                        async.eachSeries(points, function (point, callback) {
                            pointsCount++;
                            point.set('user_id', newUserId);
                            point.save().then(function (results) {
                                callback();
                            });
                        }, function (error) {
                            seriesCallback(error);
                        });
                    });
                },
                (seriesCallback) => {
                    models.PointRevision.findAll({
                        attributes: ['id', 'user_id'],
                        include: [
                            {
                                model: models.Point,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: models.Post,
                                        attributes: ['id'],
                                        include: [
                                            {
                                                model: models.Group,
                                                attributes: ['id'],
                                                required: true,
                                                include: [
                                                    {
                                                        model: models.Community,
                                                        attributes: ['id'],
                                                        where: {
                                                            id: communityId
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }).then(function (pointRevisions) {
                        async.eachSeries(pointRevisions, function (pointRevision, callback) {
                            pointRevisionCount++;
                            pointRevision.set('user_id', newUserId);
                            pointRevision.save().then(function (results) {
                                callback();
                            });
                        }, function (error) {
                            seriesCallback(error);
                        });
                    });
                }
            ], (error) => {
                if (error)
                    log.error(error);
                log.info("Done updating owners");
                log.info("Posts: " + postsCount);
                log.info("PostRevisions: " + postRevisionCount);
                log.info("Points: " + pointsCount);
                log.info("PointRevisions: " + pointRevisionCount);
                process.exit();
            });
        }
        else {
            log.error("User not found");
            process.exit();
        }
    }).catch(error => {
        log.error(error);
        process.exit();
    });
}
else {
    log.error("No new user id provided");
    process.exit();
}
export {};
