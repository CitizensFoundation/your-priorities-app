"use strict";
// https://gist.github.com/mojodna/1251812
const models = require("../../models/index.cjs");
const log = require('../utils/logger.cjs');
const toJson = require('../utils/to_json.cjs');
const async = require('async');
let airbrake = null;
if (process.env.AIRBRAKE_PROJECT_ID) {
    airbrake = require('../utils/airbrake.cjs');
}
const generatePostNotification = require('../engine/notifications/generate_post_notifications.cjs');
const generatePointNotification = require('../engine/notifications/generate_point_notifications.cjs');
const generateRecommendationEvent = require('../engine/recommendations/events_manager.cjs').generateRecommendationEvent;
const generatePostStatusChangeNotification = require('../engine/notifications/generate_post_status_change_notifications.cjs');
const ActivityWorker = function () { };
ActivityWorker.prototype.process = (activityJson, callback) => {
    let activity;
    log.info('Processing activity Started');
    async.series([
        (seriesCallback) => {
            models.AcActivity.findOne({
                where: { id: activityJson.id },
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
                        model: models.Post.unscoped(),
                        required: false
                    },
                    {
                        model: models.Point,
                        required: false,
                        include: [
                            {
                                model: models.Post,
                                required: false
                            }
                        ]
                    }
                ]
            }).then((results) => {
                if (results) {
                    activity = results;
                    seriesCallback();
                }
                else {
                    seriesCallback('Activity not found');
                }
            }).catch((error) => {
                seriesCallback(error);
            });
        },
        (seriesCallback) => {
            log.info('Processing Activity Started', { type: activity.type });
            try {
                switch (activity.type) {
                    case "activity.user.invite":
                        models.AcNotification.createNotificationFromActivity(activity.actor.user_id, activity, "notification.user.invite", "priority", 70, (error) => {
                            log.info('Processing activity.user.invite Completed', { type: activity.type, err: error });
                            seriesCallback(error);
                        });
                        break;
                    case "activity.password.recovery":
                        models.AcNotification.createNotificationFromActivity(activity.actor.user, activity, "notification.password.recovery", "priority", 100, (error) => {
                            log.info('Processing activity.password.recovery Completed', { type: activity.type, err: error });
                            seriesCallback(error);
                        });
                        break;
                    case "activity.password.changed":
                        models.AcNotification.createNotificationFromActivity(activity.actor.user, activity, "notification.password.changed", "priority", 100, (error) => {
                            log.info('Processing activity.password.changed Completed', { type: activity.type, err: error });
                            seriesCallback(error);
                        });
                        break;
                    case "activity.system.generalUserNotification":
                        models.AcNotification.createNotificationFromActivity(activity.actor.userId, activity, "notification.generalUserNotification", "priority", 100, (error) => {
                            log.info('Processing activity.system.generalUserNotification', { type: activity.type, err: error });
                            seriesCallback(error);
                        });
                        break;
                    case "activity.report.content":
                        models.AcNotification.createReportNotifications(activity.actor.user, activity, (error) => {
                            log.info('Processing activity.report.content Completed', { type: activity.type, err: error });
                            seriesCallback(error);
                        });
                        break;
                    case "activity.bulk.status.update":
                        models.AcNotification.createNotificationFromActivity(activity.actor.user, activity, "notification.bulk.status.update", "priority", 100, (error) => {
                            log.info('Processing activity.bulk.status.update Completed', { type: activity.type, err: error });
                            seriesCallback(error);
                        });
                        break;
                    case "activity.post.new":
                    case "activity.post.opposition.new":
                    case "activity.post.endorsement.new":
                        generatePostNotification(activity, activity.User, (error) => {
                            if (error) {
                                log.error('Processing activity.post.* Error', { type: activity.type, err: error });
                                seriesCallback(error);
                            }
                            else {
                                log.info('Processing activity.post.* Completed', { type: activity.type });
                                seriesCallback();
                            }
                        });
                        break;
                    case "activity.point.new":
                    case "activity.point.helpful.new":
                    case "activity.point.unhelpful.new":
                    case "activity.point.newsStory.new":
                    case "activity.point.comment.new":
                        generatePointNotification(activity, activity.User, (error) => {
                            if (error) {
                                log.error('Processing activity.point.* Completed', { type: activity.type, err: error });
                                seriesCallback(error);
                            }
                            else {
                                log.info('Processing activity.point.* Completed', { type: activity.type });
                                seriesCallback();
                            }
                        });
                        break;
                    case "activity.post.status.change":
                        if (activity.object && activity.object.bulkStatusUpdate) {
                            log.info('Processing activity.post.status.change not creating notifications', { type: activity.type });
                            seriesCallback();
                        }
                        else {
                            generatePostStatusChangeNotification(activity, activity.User, (error) => {
                                if (error) {
                                    log.error('Processing activity.post.status.change Completed', { type: activity.type, err: error });
                                    seriesCallback(error);
                                }
                                else {
                                    log.info('Processing activity.post.status.change Completed', { type: activity.type });
                                    seriesCallback();
                                }
                            });
                        }
                        break;
                    default:
                        seriesCallback();
                }
            }
            catch (error) {
                log.error("Processing Activity Error", { err: error });
                seriesCallback(error);
            }
        },
        (seriesCallback) => {
            generateRecommendationEvent(activity, seriesCallback);
        }
    ], (error) => {
        if (error) {
            log.error("Processing Activity Error", { err: error });
            if (airbrake) {
                airbrake.notify(error).then((airbrakeErr) => {
                    if (airbrakeErr.error) {
                        log.error("AirBrake Error", { context: 'airbrake', err: airbrakeErr.error, errorStatus: 500 });
                    }
                    callback(error);
                });
            }
            else {
                callback(error);
            }
        }
        else {
            log.info('Processing Activity and Recommendation Completed', { type: activity.type });
            callback();
        }
    });
};
module.exports = new ActivityWorker();
