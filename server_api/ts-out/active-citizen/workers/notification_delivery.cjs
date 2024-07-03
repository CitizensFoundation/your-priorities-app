"use strict";
// https://gist.github.com/mojodna/1251812
var async = require("async");
var models = require("../../models/index.cjs");
var log = require('../utils/logger.cjs');
var queue = require('./queue.cjs');
var i18n = require('../utils/i18n.cjs');
var toJson = require('../utils/to_json.cjs');
var deliverPostNotification = require('../engine/notifications/post_delivery.cjs');
var deliverPointNotification = require('../engine/notifications/point_delivery.cjs');
const processGeneralNotification = require('../engine/notifications/process_general_notifications.cjs');
var airbrake = null;
if (process.env.AIRBRAKE_PROJECT_ID) {
    airbrake = require('../utils/airbrake.cjs');
}
var NotificationDeliveryWorker = function () { };
NotificationDeliveryWorker.prototype.process = function (notificationJson, callback) {
    var user;
    var notification;
    var domain;
    var community;
    var group;
    async.series([
        function (seriesCallback) {
            models.AcNotification.findOne({
                where: { id: notificationJson.id },
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
                                model: models.Domain,
                                required: false
                            },
                            {
                                model: models.Community,
                                required: false
                            },
                            {
                                model: models.Group,
                                required: false,
                                include: [
                                    {
                                        model: models.Community,
                                        required: false,
                                        include: [
                                            {
                                                model: models.Domain,
                                                required: false
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                model: models.Post.unscoped(),
                                required: false
                            },
                            {
                                model: models.PostStatusChange,
                                required: false
                            },
                            {
                                model: models.Point.unscoped(),
                                required: false,
                                include: [
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
                                        model: models.User,
                                        required: false,
                                        attributes: ['id', 'name']
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }).then(function (results) {
                if (results) {
                    notification = results;
                    group = notification.AcActivities[0].Group;
                    if (notification.AcActivities[0].Domain) {
                        domain = notification.AcActivities[0].Domain;
                    }
                    else if (notification.AcActivities[0].Group &&
                        notification.AcActivities[0].Group.Community &&
                        notification.AcActivities[0].Group.Community.Domain) {
                        domain = notification.AcActivities[0].Group.Community.Domain;
                    }
                    else {
                        log.error("Couldn't find domain for NotificationDeliveryWorker");
                    }
                    if (notification.AcActivities[0].Community) {
                        community = notification.AcActivities[0].Community;
                    }
                    else if (notification.AcActivities[0].Group &&
                        notification.AcActivities[0].Group.Community) {
                        community = notification.AcActivities[0].Group.Community;
                    }
                    else {
                        log.error("Couldn't find community for NotificationDeliveryWorker");
                    }
                    seriesCallback();
                }
                else {
                    seriesCallback('NotificationDeliveryWorker Notification not found');
                }
            }).catch(function (error) {
                seriesCallback(error);
            });
        },
        function (seriesCallback) {
            if (notification.user_id) {
                models.User.findOne({
                    where: { id: notification.user_id },
                    attributes: ['id', 'notifications_settings', 'email', 'name', 'created_at']
                }).then(function (userResults) {
                    if (userResults) {
                        user = userResults;
                        seriesCallback();
                    }
                    else {
                        if (notification.AcActivities[0].object.email) {
                            seriesCallback();
                        }
                        else {
                            seriesCallback('User not found');
                        }
                    }
                }).catch(function (error) {
                    seriesCallback(error);
                });
            }
            else {
                seriesCallback();
            }
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
            log.info('Processing NotificationDeliveryWorker Started', { type: notification.type, userId: user ? user.id : null });
            switch (notification.type) {
                case "notification.user.invite":
                    var inviteFromName;
                    if (notification.AcActivities[0].group_id) {
                        inviteFromName = notification.AcActivities[0].Group.name;
                    }
                    else if (notification.AcActivities[0].community_id) {
                        inviteFromName = notification.AcActivities[0].Community.name;
                    }
                    queue.add('send-one-email', {
                        subject: { translateToken: 'notification.email.user_invite', contentName: inviteFromName },
                        template: 'user_invite',
                        user: user ? user : { id: null, email: notification.AcActivities[0].object.email, name: notification.AcActivities[0].object.email },
                        sender_name: notification.AcActivities[0].object.sender_name,
                        domain: domain,
                        community: community,
                        group: group,
                        token: notification.AcActivities[0].object.token
                    }, 'critical');
                    log.info('NotificationDeliveryWorker notification.user.invite Queued', { type: notification.type, userId: user ? user.id : null });
                    seriesCallback();
                    break;
                case "notification.password.recovery":
                    queue.add('send-one-email', {
                        subject: { translateToken: 'notification.email.password_recovery' },
                        template: 'password_recovery',
                        user: user,
                        domain: domain,
                        community: community,
                        token: notification.AcActivities[0].object.token
                    }, 'now');
                    log.info('NotificationDeliveryWorker notification.password.recovery Completed', { type: notification.type, userId: user ? user.id : null });
                    seriesCallback();
                    break;
                case "notification.report.content":
                    var template, translateToken, moderation, source, toxicity;
                    if (notification.AcActivities[0].Point) {
                        template = 'point_activity';
                        translateToken = 'notification.email.pointReport';
                        const point = notification.AcActivities[0].Point;
                        if (point.data && point.data.moderation) {
                            moderation = point.data.moderation;
                            if (moderation.lastReportedBy && moderation.lastReportedBy.length > 0) {
                                source = moderation.lastReportedBy[moderation.lastReportedBy.length - 1].source;
                            }
                        }
                    }
                    else {
                        template = 'post_activity';
                        translateToken = 'notification.email.postReport';
                        const post = notification.AcActivities[0].Post;
                        if (post && post.data && post.data.moderation) {
                            moderation = post.data.moderation;
                            if (moderation.lastReportedBy && moderation.lastReportedBy.length > 0) {
                                source = moderation.lastReportedBy[moderation.lastReportedBy.length - 1].source;
                            }
                        }
                    }
                    if (moderation && moderation.toxicityScore) {
                        moderation.toxicityScorePercent = Math.round(moderation.toxicityScore * 100) + '%';
                    }
                    queue.add('send-one-email', {
                        subject: { translateToken: translateToken },
                        template: template,
                        user: user,
                        domain: domain,
                        moderation: moderation,
                        source: source,
                        isAutomated: source && (source !== 'user' && source !== 'fromUser'),
                        isAutomatedVision: source && (source === 'visionAPI'),
                        isReportingContent: true,
                        community: community,
                        post: notification.AcActivities[0].Post ? notification.AcActivities[0].Post.toJSON() : null,
                        point: notification.AcActivities[0].Point ? notification.AcActivities[0].Point.toJSON() : null,
                        activity: notification.AcActivities[0].toJSON()
                    }, 'critical');
                    log.info('NotificationDeliveryWorker notification.report.content Completed', { type: notification.type, userId: user ? user.id : null });
                    seriesCallback();
                    break;
                case "notification.password.changed":
                    if (notification.activity && notification.activity.object && notification.activity.object.token) {
                        queue.add('send-one-email', {
                            subject: { translateToken: 'email.password_changed' },
                            template: 'password_changed',
                            user: user,
                            domain: domain,
                            community: community,
                            token: notification.activity.object.token
                        }, 'critical');
                        log.info('NotificationDeliveryWorker notification.password.changed Completed', { type: notification.type, userId: user ? user.id : null });
                        seriesCallback();
                    }
                    else {
                        log.error('NotificationDeliveryWorker notification.password.changed cant find token!', { type: notification.type, userId: user ? user.id : null });
                        seriesCallback();
                    }
                    break;
                case "notification.post.status.change":
                    if (notification.AcActivities[0].object && notification.AcActivities[0].object.bulkStatusUpdate) {
                        log.info('Processing notification.status.change Not Sent Due To Bulk Status Update', { type: notification.type, userId: user ? user.id : null });
                        seriesCallback();
                    }
                    else {
                        var post = notification.AcActivities[0].Post;
                        var content = notification.AcActivities[0].PostStatusChange.content;
                        queue.add('send-one-email', {
                            subject: { translateToken: 'notification.post.statusChangeSubject', contentName: post.name },
                            template: 'post_status_change',
                            user: user,
                            domain: domain,
                            community: community,
                            post: post,
                            content: content ? content : "",
                            status_changed_to: notification.AcActivities[0].PostStatusChange.status_changed_to
                        }, 'high');
                        log.info('Processing notification.status.change Completed', { type: notification.type, userId: user ? user.id : null });
                        seriesCallback();
                    }
                    break;
                case "notification.bulk.status.update":
                    var bulkStatusUpdateId = notification.AcActivities[0].object.bulkStatusUpdateId;
                    var groupUpdate = notification.AcActivities[0].object.groupUpdate;
                    models.BulkStatusUpdate.findOne({
                        where: {
                            id: bulkStatusUpdateId
                        }
                    }).then(function (statusUpdate) {
                        if (statusUpdate) {
                            queue.add('send-one-email', {
                                subject: { translateToken: 'notification.bulkStatusUpdate', contentName: groupUpdate ? group.name : community.name },
                                template: 'bulk_status_update',
                                user: user,
                                domain: domain,
                                community: community,
                                post: post,
                                bulkStatusUpdateId: bulkStatusUpdateId,
                                emailHeader: statusUpdate.config.emailHeader,
                                emailFooter: statusUpdate.config.emailFooter
                            }, 'high');
                            log.info('Processing notification.bulk.status.change Completed', { type: notification.type, userId: user ? user.id : null });
                            seriesCallback();
                        }
                        else {
                            seriesCallback("Can't find bulk status update");
                        }
                    }).catch(function (error) {
                        seriesCallback(error);
                    });
                    break;
                case "notification.post.new":
                case "notification.post.endorsement":
                    deliverPostNotification(notification, user, function (error) {
                        log.info('Processing notification.post.* Completed', { type: notification.type, userId: user ? user.id : null });
                        seriesCallback(error);
                    });
                    break;
                case "notification.point.new":
                case "notification.point.quality":
                case "notification.point.newsStory":
                case "notification.point.comment":
                    deliverPointNotification(notification, user, function (error) {
                        log.info('Processing notification.point.* Completed', { type: notification.type, userId: user ? user.id : null });
                        seriesCallback(error);
                    });
                    break;
                case "notification.generalUserNotification":
                    processGeneralNotification(notification, domain, community, group, user, (error) => {
                        log.info('Processing notification.generalUserNotification Completed', { type: notification.type, userId: user ? user.id : null });
                        seriesCallback(error);
                    });
                    break;
                default:
                    seriesCallback();
            }
        }
    ], (error) => {
        if (error) {
            if (error.stack)
                log.error("NotificationDeliveryWorker Error", { err: error, stack: error.stack.split("\n") });
            else
                log.error("NotificationDeliveryWorker Error", { err: error });
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
module.exports = new NotificationDeliveryWorker();
