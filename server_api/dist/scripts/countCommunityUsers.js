var models = require('../models/index.cjs');
var async = require('async');
var _ = require('lodash');
var communityId = process.argv[2];
var allUserIds = [];
var addToUsers = function (items) {
    _.forEach(items, function (item) {
        allUserIds.push(item.user_id);
    });
};
async.parallel([
    function (parallelCallback) {
        models.Rating.findAll({
            attributes: ['user_id'],
            include: [
                {
                    model: models.Post,
                    include: [
                        {
                            model: models.Group,
                            include: [
                                {
                                    model: models.Community,
                                    where: {
                                        id: communityId
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }).then(function (withUserIds) {
            addToUsers(withUserIds);
        });
    },
    function (parallelCallback) {
        models.Endorsement.findAll({
            attributes: ['user_id'],
            include: [
                {
                    model: models.Post,
                    include: [
                        {
                            model: models.Group,
                            include: [
                                {
                                    model: models.Community,
                                    where: {
                                        id: communityId
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }).then(function (withUserIds) {
            addToUsers(withUserIds);
            parallelCallback();
        });
    },
    function (parallelCallback) {
        models.PointQuality.findAll({
            attributes: ['user_id'],
            include: [
                {
                    model: models.Point,
                    include: [
                        {
                            model: models.Post,
                            include: [
                                {
                                    model: models.Group,
                                    include: [
                                        {
                                            model: models.Community,
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
        }).then(function (withUserIds) {
            addToUsers(withUserIds);
            parallelCallback();
        });
    },
    function (parallelCallback) {
        models.Point.findAll({
            attributes: ['user_id'],
            include: [
                {
                    model: models.Post,
                    include: [
                        {
                            model: models.Group,
                            include: [
                                {
                                    model: models.Community,
                                    where: {
                                        id: communityId
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }).then(function (withUserIds) {
            addToUsers(withUserIds);
            parallelCallback();
        });
    },
    function (parallelCallback) {
        models.Post.findAll({
            attributes: ['user_id'],
            include: [
                {
                    model: models.Group,
                    include: [
                        {
                            model: models.Community,
                            where: {
                                id: communityId
                            }
                        }
                    ]
                }
            ]
        }).then(function (withUserIds) {
            addToUsers(withUserIds);
            parallelCallback();
        });
    }
], function (error) {
    if (error) {
        log.error(error);
    }
    else {
        log.info("User action count: " + allUserIds.length);
        log.info(allUserIds);
        log.info("Community user count: " + _.uniq(allUserIds).length);
    }
    process.exit();
});
export {};
