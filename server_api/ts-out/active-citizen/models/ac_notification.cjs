"use strict";
const async = require("async");
const log = require('../utils/logger.cjs');
const toJson = require('../utils/to_json.cjs');
const _ = require('lodash');
const queue = require('../workers/queue.cjs');
module.exports = (sequelize, DataTypes) => {
    const AcNotification = sequelize.define("AcNotification", {
        priority: { type: DataTypes.INTEGER, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
        sent_email: { type: DataTypes.INTEGER, default: false },
        sent_push: { type: DataTypes.INTEGER, default: false },
        processed_at: DataTypes.DATE,
        user_interaction_profile: DataTypes.JSONB,
        from_notification_setting: DataTypes.STRING,
        viewed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    }, {
        defaultScope: {
            where: {
                deleted: false
            }
        },
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                name: 'notification_by_type_and_user_id',
                fields: ['type', 'user_id']
            },
            { name: 'notification_user_id_deleted_viewed',
                fields: ['user_id', 'deleted', 'viewed']
            },
            { name: 'ac_notifications_idx_user_id_type_deleted_created_at',
                fields: ['user_id', 'type', 'deleted', 'created_at']
            },
            {
                fields: ['user_interaction_profile'],
                using: 'gin',
                operator: 'jsonb_path_ops'
            },
            {
                name: 'ac_notifications_idx_deleted_id',
                fields: ['deleted', 'id']
            }
        ],
        // Add following index manually for high throughput sites
        // CREATE INDEX notification_activit_idx_ac_id ON notification_activities (ac_notification_id);
        underscored: true,
        tableName: 'ac_notifications'
    });
    AcNotification.associate = (models) => {
        AcNotification.belongsToMany(models.AcActivity, { as: 'AcActivities', through: 'notification_activities' });
        AcNotification.belongsToMany(models.AcDelayedNotification, { as: 'AcDelayedNotifications', through: 'delayed_notifications' });
        AcNotification.belongsTo(models.User, { foreignKey: 'user_id' });
    };
    AcNotification.METHOD_MUTED = 0;
    AcNotification.METHOD_BROWSER = 1;
    AcNotification.METHOD_EMAIL = 2;
    AcNotification.METHOD_PUSH = 3;
    AcNotification.METHOD_SMS = 4;
    AcNotification.FREQUENCY_AS_IT_HAPPENS = 0;
    AcNotification.FREQUENCY_HOURLY = 1;
    AcNotification.FREQUENCY_DAILY = 2;
    AcNotification.FREQUENCY_WEEKLY = 3;
    AcNotification.FREQUENCY_BI_WEEKLY = 4;
    AcNotification.FREQUENCY_MONTHLY = 5;
    AcNotification.defaultNotificationSettings = {
        my_posts: {
            method: 2,
            frequency: 0
        },
        my_posts_endorsements: {
            method: 2,
            frequency: 2
        },
        my_points: {
            method: 2,
            frequency: 1
        },
        my_points_endorsements: {
            method: 2,
            frequency: 2
        },
        all_community: {
            method: 0,
            frequency: 3
        },
        all_group: {
            method: 0,
            frequency: 3
        },
        newsletter: {
            method: 2,
            frequency: 4
        }
    };
    AcNotification.anonymousNotificationSettings = {
        my_posts: {
            method: 1,
            frequency: 2
        },
        my_posts_endorsements: {
            method: 1,
            frequency: 2
        },
        my_points: {
            method: 1,
            frequency: 2
        },
        my_points_endorsements: {
            method: 1,
            frequency: 2
        },
        all_community: {
            method: 0,
            frequency: 3
        },
        all_group: {
            method: 0,
            frequency: 3
        },
        newsletter: {
            method: 1,
            frequency: 4
        }
    };
    AcNotification.ENDORSEMENT_GROUPING_TTL = 6 * 60 * 60 * 1000; // milliseconds
    AcNotification.processNotification = (notification, user, activity, callback) => {
        let queuePriority;
        if (user.last_login_at && ((new Date().getDate() - 5) < user.last_login_at)) {
            queuePriority = 'medium';
        }
        else {
            queuePriority = 'low';
        }
        queue.add('process-notification-delivery', { id: notification.id }, queuePriority);
        // Disabled for now
        //queue.add('process-notification-news-feed', { id: notification.id }, queuePriority);
        // Its being updated and is not new
        if (callback) {
            notification.viewed = false;
            notification.changed('updated_at', true);
            notification.save().then((notificationIn) => {
                callback();
            }).catch((error) => {
                callback(error);
            });
        }
    };
    AcNotification.createReportNotifications = (user, activity, callback) => {
        log.info('createReportNotifications');
        let activityWithAdmins;
        let allAdmins;
        async.series([
            (seriesCallback) => {
                sequelize.models.AcActivity.findOne({
                    where: { id: activity.id },
                    include: [
                        {
                            model: sequelize.models.Community,
                            required: true,
                            include: [
                                {
                                    model: sequelize.models.User,
                                    attributes: _.concat(sequelize.models.User.defaultAttributesWithSocialMediaPublicAndEmail, ['created_at', 'last_login_at']),
                                    as: 'CommunityAdmins',
                                    required: false
                                }
                            ]
                        },
                        {
                            model: sequelize.models.Group,
                            required: true,
                            include: [
                                {
                                    model: sequelize.models.User,
                                    attributes: _.concat(sequelize.models.User.defaultAttributesWithSocialMediaPublicAndEmail, ['created_at', 'last_login_at']),
                                    as: 'GroupAdmins',
                                    required: false
                                }
                            ]
                        },
                        {
                            model: sequelize.models.Post,
                            required: false
                        },
                        {
                            model: sequelize.models.Point,
                            required: false
                        }
                    ]
                }).then((results) => {
                    if (results && (results.Community.CommunityAdmins || results.Community.GroupAdmins)) {
                        activityWithAdmins = results;
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
                allAdmins = _.concat(activityWithAdmins.Community.CommunityAdmins, activityWithAdmins.Group.GroupAdmins);
                allAdmins = _.uniqBy(allAdmins, (admin) => {
                    return admin.email;
                });
                async.eachSeries(allAdmins, (admin, innerSeriesCallback) => {
                    sequelize.models.AcNotification.build({
                        type: 'notification.report.content',
                        priority: 100,
                        status: 'active',
                        ac_activity_id: activity.id,
                        from_notification_setting: "reportContent",
                        user_id: admin.id
                    }).save().then((notification) => {
                        if (notification) {
                            notification.addAcActivities(activity).then((results) => {
                                if (results) {
                                    const notificationJson = { id: notification.id };
                                    queue.add('process-notification-delivery', notificationJson, 'high');
                                    log.info('Notification Created', { notificationId: notification.id, userId: admin.id });
                                    innerSeriesCallback();
                                }
                                else {
                                    innerSeriesCallback("Notification Error Can't add activity");
                                }
                            });
                        }
                        else {
                            log.error('Notification Creation Error', { err: "No notification", user: user.id });
                            innerSeriesCallback("Could not create notification");
                        }
                    }).catch((error) => {
                        log.error('Notification Creation Error', { err: error, user: user.id });
                        innerSeriesCallback(error);
                    });
                }, (error) => {
                    seriesCallback(error);
                });
            }
        ], (error) => {
            callback(error);
        });
    };
    AcNotification.createNotificationFromActivity = (user, activity, type, notification_setting_type, priority, callback) => {
        log.info('AcNotification Notification', { type: type, priority: priority });
        if (user == null) {
            user = { id: null };
        }
        if (typeof user == "number") {
            user = { id: user };
        }
        if (typeof user == "string" && user.length > 0) {
            user = { id: user };
        }
        //TODO: Check AcMute and mute if needed
        sequelize.models.AcNotification.build({
            type: type,
            priority: priority,
            status: 'active',
            ac_activity_id: activity.id,
            from_notification_setting: notification_setting_type,
            user_id: user.id
        }).save().then((notification) => {
            if (notification) {
                notification.addAcActivities(activity).then((results) => {
                    if (results) {
                        sequelize.models.AcNotification.processNotification(notification, user, activity);
                        log.info('Notification Created', { notificationId: notification ? notification.id : -1, userId: user.id });
                        callback();
                    }
                    else {
                        callback("Notification Error Can't add activity");
                    }
                });
            }
            else {
                log.error('Notification Creation Error', { err: "No notification", user: user.id });
                callback("Notification Create Error");
            }
        }).catch((error) => {
            log.error('Notification Creation Error', { err: error, user: user.id });
            callback(error);
        });
    };
    return AcNotification;
};
