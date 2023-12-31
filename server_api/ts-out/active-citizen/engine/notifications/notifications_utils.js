"use strict";
const models = require("../../../models");
const async = require('async');
const _ = require('lodash');
const getModelAndUsersByType = (model, userType, id, notification_setting_type, callback) => {
    const userWhere = {};
    userWhere["notifications_settings." + notification_setting_type + ".method"] = {
        $gt: 0
    };
    //log.info("getModelAndUsersByType", { type: notification_setting_type, userWhere: userWhere });
    // TODO: Use streams when ready https://github.com/sequelize/sequelize/issues/2454
    model.findOne({
        where: { id: id },
        include: [
            {
                model: models.User,
                attributes: ['id', 'notifications_settings', 'email'],
                as: userType,
                where: userWhere
            }
        ]
    }).then((results) => {
        //log.info("Notification Processing found users", { numberOfUsers: results ? results.length : null, userWhere: userWhere });
        if (results) {
            callback(null, results);
        }
        else {
            callback();
        }
    }).catch((error) => {
        callback(error);
    });
};
const addNotificationsForUsers = (activity, users, notification_type, notification_setting_type, uniqueUserIds, callback) => {
    async.eachSeries(users, (user, seriesCallback) => {
        if (_.includes(uniqueUserIds.users, user.id)) {
            seriesCallback();
        }
        else {
            models.AcNotification.createNotificationFromActivity(user, activity, notification_type, notification_setting_type, 50, (error) => {
                uniqueUserIds.users.push(user.id);
                seriesCallback(error);
            });
        }
    }, (error) => {
        callback(error);
    });
};
// type: 'notification.post.endorsement';
const addOrPossiblyGroupNotification = (model, notification_type, notification_setting_type, activity, user, priority, callback) => {
    let modelWhereOptions;
    if (model.constructor.options.tableName == 'posts') {
        modelWhereOptions = {
            post_id: model.id
        };
    }
    else {
        modelWhereOptions = {
            point_id: model.id
        };
    }
    // Look for already generated notification for this content in the group ttl time
    models.AcNotification.findAll({
        where: {
            user_id: user.id,
            type: notification_type,
            created_at: {
                $lt: new Date(),
                $gt: new Date(new Date() - models.AcNotification.ENDORSEMENT_GROUPING_TTL)
            }
        },
        attributes: ['id', 'type', 'user_id', 'created_at'],
        order: [
            ["created_at", "desc"]
        ],
        include: [
            {
                model: models.AcActivity,
                as: 'AcActivities',
                attributes: ['id', 'post_id', 'point_id', 'type'],
                required: true,
                where: modelWhereOptions
            }
        ]
    }).then((notifications) => {
        const notification = notifications[0];
        if (notification) {
            // We check for repeated activity by the same user on the same content and  then don't create or update the notification
            models.AcNotification.findAll({
                where: {
                    user_id: user.id,
                    type: notification_type,
                    created_at: {
                        $lt: new Date(),
                        $gt: new Date(new Date() - models.AcNotification.ENDORSEMENT_GROUPING_TTL)
                    }
                },
                order: [
                    ["created_at", "desc"]
                ],
                include: [
                    {
                        model: models.AcActivity,
                        as: 'AcActivities',
                        required: true,
                        where: _.merge(modelWhereOptions, {
                            user_id: activity.user_id,
                            type: activity.type
                        })
                    }
                ]
            }).then((specificNotifications) => {
                const specificNotification = specificNotifications[0];
                if (specificNotification) {
                    specificNotification.changed('viewed', false);
                    specificNotification.changed('updated_at', true);
                    specificNotification.save().then(() => {
                        callback();
                    }).catch((error) => {
                        callback(error);
                    });
                }
                else {
                    notification.addAcActivities(activity).then((results) => {
                        if (results) {
                            // Create events for the worker queue
                            models.AcNotification.processNotification(notification, user, activity, callback);
                        }
                        else {
                            callback("Notification Error Can't add activity");
                        }
                    });
                }
            });
        }
        else {
            // If not already found and grouped we
            models.AcNotification.createNotificationFromActivity(user, activity, notification_type, notification_setting_type, priority, (error) => {
                callback(error);
            });
        }
    });
};
module.exports = {
    getModelAndUsersByType: getModelAndUsersByType,
    addNotificationsForUsers: addNotificationsForUsers,
    addOrPossiblyGroupNotification: addOrPossiblyGroupNotification
};
