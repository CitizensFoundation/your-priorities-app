"use strict";
var express = require('express');
var router = express.Router();
var models = require("../../models");
var auth = require('../../authorization');
var log = require('../utils/logger');
var _ = require('lodash');
var async = require('async');
var getCommonWhereDateOptions = require('../engine/news_feeds/news_feeds_utils').getCommonWhereDateOptions;
var getNotifications = function (req, options, callback) {
    options = _.merge(options, {
        dateColumn: 'updated_at'
    });
    if (req.query.afterDate) {
        options = _.merge(options, {
            afterDate: new Date(req.query.afterDate)
        });
    }
    if (req.query.beforeDate) {
        options = _.merge(options, {
            beforeDate: new Date(req.query.beforeDate)
        });
    }
    var where = _.merge({
        user_id: req.user.id
    }, getCommonWhereDateOptions(options));
    var activityWhereOptions;
    //TODO: Enabled this when limit bug is fixed in Sequelize or de normalize domain_id to notifications
    /*
    if (process.env.NODE_ENV == 'production') {
      activityWhereOptions = { domain_id: req.ypDomain.id }
    }
    */
    var notifications, unViewedCount;
    async.series([
        function (seriesCallback) {
            models.AcNotification.findAll({
                where: where,
                attributes: ['id'],
                order: [
                    ["updated_at", "desc"]
                ],
                limit: 20
            }).then(function (inNotifications) {
                if (inNotifications) {
                    notifications = inNotifications;
                    seriesCallback();
                }
                else {
                    seriesCallback("Notifications return null");
                }
            }).catch(function (error) {
                seriesCallback(error);
            });
        },
        function (seriesCallback) {
            models.AcNotification.findAll({
                where: {
                    id: {
                        $in: _.map(notifications, (item) => { return item.id; })
                    }
                },
                attributes: ['id', 'type', 'created_at', 'updated_at', 'viewed'],
                order: [
                    ["updated_at", "desc"],
                    [{ model: models.AcActivity, as: 'AcActivities' }, 'created_at', 'desc'],
                    [{ model: models.AcActivity, as: 'AcActivities' }, models.User, { model: models.Image, as: 'UserProfileImages' }, 'created_at', 'asc'],
                ],
                include: [
                    {
                        model: models.AcActivity,
                        as: 'AcActivities',
                        attributes: ['id', 'type'],
                        where: activityWhereOptions,
                        required: true,
                        include: [
                            {
                                model: models.Post,
                                required: false,
                                attributes: ['id', 'name', 'user_id']
                            },
                            { model: models.User,
                                attributes: ["id", "name", "facebook_id", "twitter_id", "google_id", "github_id"],
                                required: false,
                                include: [
                                    {
                                        model: models.Image, as: 'UserProfileImages',
                                        attributes: ['id', 'formats'],
                                        required: false
                                    }
                                ]
                            },
                            {
                                model: models.Community,
                                required: false,
                                attributes: ['id', 'name']
                            },
                            {
                                model: models.Group,
                                required: false,
                                attributes: ['id', 'name']
                            },
                            {
                                model: models.Point,
                                required: false,
                                attributes: ['id', 'value', 'content']
                            }
                        ]
                    }
                ]
            }).then(function (inNotifications) {
                notifications = inNotifications;
                seriesCallback();
            }).catch(function (error) {
                seriesCallback(error);
            });
        },
        function (seriesCallback) {
            models.AcNotification.count({
                where: {
                    viewed: false,
                    user_id: req.user.id
                }
            }).then(function (count) {
                unViewedCount = count;
                seriesCallback();
            }).catch(function (error) {
                seriesCallback(error);
            });
        }
    ], function (error) {
        if (error) {
            callback(error);
        }
        else if (!notifications) {
            callback("No notifications found");
        }
        else {
            try {
                const allActivities = [];
                for (let n = 0; n < notifications.length; n++) {
                    if (notifications[n].AcActivities) {
                        for (let a = 0; a < notifications[n].AcActivities.length; a++) {
                            allActivities.push(notifications[n].AcActivities[a]);
                        }
                    }
                }
                models.AcActivity.setOrganizationUsersForActivities(allActivities, (error) => {
                    if (error) {
                        callback(error);
                    }
                    else {
                        callback(null, {
                            notifications: notifications,
                            unViewedCount: unViewedCount,
                            oldestProcessedNotificationAt: notifications.length > 0 ? _.last(notifications).created_at : null
                        });
                    }
                });
            }
            catch (error) {
                callback(error);
            }
        }
    });
};
router.get('/', auth.isLoggedInNoAnonymousCheck, function (req, res) {
    var options = {};
    getNotifications(req, options, function (error, notifications) {
        if (error) {
            log.error("Notifications Error", { userId: req.user ? req.user.id : null, errorStatus: 500, err: error });
            res.sendStatus(500);
        }
        else {
            res.send(notifications);
        }
    });
});
router.put('/markAllViewed', auth.isLoggedInNoAnonymousCheck, function (req, res) {
    models.AcNotification.update({
        viewed: true
    }, {
        where: { user_id: req.user.id },
        silent: true
    }).then(results => {
        const [affectedCount, affectedRows] = results;
        log.info("Notifications Have Marked All As Viewed", { affectedCount: affectedCount, affectedRows: affectedRows, userId: req.user ? req.user.id : null });
        res.sendStatus(200);
    }).catch(function (error) {
        log.error("Notifications Have Marked All As Viewed Error", { userId: req.user ? req.user.id : null, err: error, errorStatus: 500 });
        res.sendStatus(500);
    });
});
router.put('/setIdsViewed', auth.isLoggedInNoAnonymousCheck, function (req, res) {
    var viewedIds = req.body.viewedIds;
    var unViewedCount;
    async.series([
        function (seriesCallback) {
            models.AcNotification.update({
                viewed: true
            }, {
                where: {
                    user_id: req.user.id,
                    id: {
                        $in: viewedIds
                    }
                },
                silent: true
            }).then(results => {
                const [affectedCount, affectedRows] = results;
                log.info("Notifications Have Marked Ids As Viewed", { affectedCount: affectedCount, affectedRows: affectedRows, userId: req.user ? req.user.id : null });
                seriesCallback();
            }).catch(function (error) {
                seriesCallback(error);
            });
        },
        function (seriesCallback) {
            models.AcNotification.count({
                where: {
                    viewed: false,
                    user_id: req.user.id
                }
            }).then(function (count) {
                unViewedCount = count;
                seriesCallback();
            }).catch(function (error) {
                seriesCallback(error);
            });
        }
    ], function (error) {
        if (error) {
            log.error("Notifications Have Marked Ids As Viewed Error", { userId: req.user ? req.user.id : null, err: error, errorStatus: 500 });
            res.sendStatus(500);
        }
        else {
            res.send({
                viewedIds: viewedIds,
                unViewedCount: unViewedCount
            });
        }
    });
});
module.exports = router;
