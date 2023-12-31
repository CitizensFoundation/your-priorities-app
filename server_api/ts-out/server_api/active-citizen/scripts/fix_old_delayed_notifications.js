"use strict";
var models = require('../../models');
var async = require('async');
var log = require('../utils/logger');
var _ = require('lodash');
var moment = require('moment');
var i18n = require('../utils/i18n');
var Backend = require('i18next-node-fs-backend');
var latestNotification;
models.User.findAll({
    attributes: ['id']
}).then(function (users) {
    async.eachSeries(users, function (user, userSeriesCallback) {
        models.AcDelayedNotification.findAll({
            where: {
                user_id: user.id
            },
            include: [
                {
                    model: models.AcNotification, as: 'AcNotifications',
                    required: true
                }
            ]
        }).then(function (delayedNotifications) {
            if (delayedNotifications && delayedNotifications.length > 0) {
                models.AcDelayedNotification.create({
                    user_id: user.id,
                    frequency: 2,
                    method: 2,
                    created_at: moment().subtract('days', 2),
                    type: 'fromScript'
                }).then(function (newDelayedNotification) {
                    async.eachSeries(delayedNotifications, function (delayedNotification, delayedNotificationSeriesCallback) {
                        async.eachSeries(delayedNotification.AcNotifications, function (notification, notificationSeriesCallback) {
                            console.error("NOTID:" + notification.id);
                            latestNotification = notification;
                            newDelayedNotification.addAcNotification(notification).then(function () {
                                notificationSeriesCallback();
                            }).catch(function (error) {
                                console.error("COULD NOT SAVE NOTIFICATION - COULD NOT SAVE NOTIFICATION - COULD NOT SAVE NOTIFICATION - COULD NOT SAVE NOTIFICATION - COULD NOT SAVE NOTIFICATION");
                                notificationSeriesCallback();
                            });
                        }, function (error) {
                            delayedNotification.deleted = true;
                            delayedNotification.save().then(function () {
                                delayedNotificationSeriesCallback();
                            });
                        });
                    }, function (error) {
                        userSeriesCallback();
                    });
                }).catch(function (error) {
                    userSeriesCallback(error);
                });
            }
            else {
                userSeriesCallback();
            }
        }).catch(function (error) {
            userSeriesCallback(error);
        });
    });
});
