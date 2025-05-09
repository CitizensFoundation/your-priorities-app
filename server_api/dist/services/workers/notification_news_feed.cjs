"use strict";
// https://gist.github.com/mojodna/1251812
var async = require("async");
var models = require("../../models/index.cjs");
var log = require('../utils/logger.cjs');
var queue = require('./queue.cjs');
var i18n = require('../utils/i18n.cjs');
var toJson = require('../utils/to_json.cjs');
var airbrake = null;
if (process.env.AIRBRAKE_PROJECT_ID) {
    airbrake = require('../utils/airbrake.cjs');
}
var GenerateNewsFeedFromNotifications = require('../engine/news_feeds/generate_from_notifications.cjs');
/**
 * @class NotificationNewsFeedWorker
 * @constructor
 */
function NotificationNewsFeedWorker() { }
/**
 * Processes a notification to generate a news feed item.
 * @param {object} notificationJson - The notification JSON object.
 * @param {(error?: any) => void} callback - The callback function.
 * @memberof NotificationNewsFeedWorker
 */
NotificationNewsFeedWorker.prototype.process = function (notificationJson, callback) {
    var user;
    var notification;
    var domain;
    var community;
    async.series([
        function (seriesCallback) {
            models.AcNotification.findOne({
                where: { id: notificationJson.id },
                order: [
                    [{ model: models.AcActivity, as: 'AcActivities' }, 'updated_at', 'asc']
                ],
                include: [
                    {
                        model: models.User,
                        attributes: ['id', 'notifications_settings', 'email', 'name', 'created_at'],
                        required: false
                    },
                    {
                        model: models.AcActivity,
                        as: 'AcActivities',
                        required: true,
                        include: [
                            {
                                model: models.User,
                                attributes: ['id', 'notifications_settings', 'email', 'name', 'created_at'],
                                required: false
                            },
                            {
                                model: models.Domain,
                                required: false
                            },
                            {
                                model: models.Community,
                                required: false
                            },
                            {
                                model: models.Group,
                                required: false
                            },
                            {
                                model: models.Post,
                                required: false
                            },
                            {
                                model: models.Point,
                                required: false
                            }
                        ]
                    }
                ]
            }).then(function (results) {
                if (results) {
                    notification = results;
                    domain = notification.AcActivities[0].Domain;
                    community = notification.AcActivities[0].Community;
                    seriesCallback();
                }
                else {
                    seriesCallback('Notification not found');
                }
            }).catch(function (error) {
                seriesCallback(error);
            });
        },
        function (seriesCallback) {
            models.User.findOne({
                where: { id: notification.user_id },
                attributes: ['id', 'notifications_settings', 'email', 'name', 'created_at']
            }).then(function (userResults) {
                if (userResults) {
                    user = userResults;
                    seriesCallback();
                }
                else {
                    seriesCallback();
                }
            }).catch(function (error) {
                seriesCallback(error);
            });
        },
        function (seriesCallback) {
            if (user) {
                user.setLocale(i18n, domain, community, function () {
                    seriesCallback();
                });
            }
            else {
                seriesCallback();
            }
        },
        function (seriesCallback) {
            log.info('Processing NotificationNewsFeedWorker Started', { type: notification.type, user: user ? user.simple() : null });
            switch (notification.type) {
                case "notification.post.new":
                case "notification.post.endorsement":
                case "notification.point.new":
                case "notification.point.quality":
                    GenerateNewsFeedFromNotifications(notification, user, function (error) {
                        log.info('Processing GenerateNewsFeedFromNotifications Completed', { type: notification.type, user: user.simple() });
                        seriesCallback(error);
                    });
                    break;
                default:
                    seriesCallback();
            }
        }
    ], function (error) {
        if (error) {
            log.error("NotificationNewsFeedWorker Error", { err: error });
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
            callback();
        }
    });
};
/** @type {NotificationNewsFeedWorker} */
module.exports = new NotificationNewsFeedWorker();
