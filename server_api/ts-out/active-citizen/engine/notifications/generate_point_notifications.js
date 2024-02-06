const models = require("../../../models/index.cjs");
const log = require('../../utils/logger.cjs');
const async = require('async');
const getModelAndUsersByType = require('./notifications_utils').getModelAndUsersByType;
const addNotificationsForUsers = require('./notifications_utils').addNotificationsForUsers;
const addOrPossiblyGroupNotification = require('./notifications_utils').addOrPossiblyGroupNotification;
const _ = require('lodash');
const generateNotificationsForNewPoint = (activity, callback) => {
    // Make sure not to create duplicate notifications to the same user
    const uniqueUserIds = { users: [] };
    let notificationType;
    if (activity.type === 'activity.point.newsStory.new') {
        notificationType = 'notification.point.newsStory';
    }
    else if (activity.type === 'activity.point.comment.new') {
        notificationType = 'notification.point.comment';
    }
    else {
        notificationType = 'notification.point.new';
    }
    async.series([
        (seriesCallback) => {
            if (activity.sub_type === "bulkOperation" &&
                activity.context &&
                activity.context.silentMode === true) {
                seriesCallback();
            }
            else {
                // Notifications for my posts
                const userWhere = {};
                userWhere["notifications_settings.my_posts.method"] = {
                    $gt: 0
                };
                if (activity.post_id) {
                    models.Post.findOne({
                        where: {
                            id: activity.post_id
                        },
                        include: [
                            {
                                model: models.User,
                                attributes: ['id', 'notifications_settings', 'email'],
                                where: userWhere,
                                required: true
                            }
                        ]
                    }).then((post) => {
                        if (post) {
                            addNotificationsForUsers(activity, [post.User], notificationType, 'my_posts', uniqueUserIds, seriesCallback);
                        }
                        else {
                            seriesCallback();
                        }
                    }).catch((error) => {
                        seriesCallback(error);
                    });
                }
                else {
                    // No post associated with this point
                    seriesCallback();
                }
            }
        },
        (seriesCallback) => {
            if (activity.sub_type === "bulkOperation") {
                seriesCallback();
            }
            else {
                // Notifications for my points
                const userWhere = {};
                userWhere["notifications_settings.my_points.method"] = {
                    $gt: 0
                };
                if (activity.post_id) {
                    models.Point.findAll({
                        where: {
                            post_id: activity.post_id,
                            status: 'published'
                        },
                        attributes: ['id'],
                        order: [
                            models.sequelize.literal('(counter_quality_up-counter_quality_down) desc')
                        ],
                        //TODO: Review this limit on notifications for large points discussions
                        limit: process.env.POINT_NOTIFICATIONS_USERS_LIMIT ? process.env.POINT_NOTIFICATIONS_USERS_LIMIT : 250
                    }).then((pointsIn) => {
                        models.Point.findAll({
                            where: {
                                id: {
                                    $in: _.map(pointsIn, (pointIn) => { return pointIn.id; })
                                }
                            },
                            attributes: ['id'],
                            include: [
                                {
                                    model: models.User,
                                    attributes: ['id', 'notifications_settings', 'email'],
                                    where: userWhere,
                                    required: true
                                }
                            ],
                            order: [
                                models.sequelize.literal('(counter_quality_up-counter_quality_down) desc')
                            ],
                        }).then((points) => {
                            if (points) {
                                const users = [];
                                const userIds = [];
                                async.eachSeries(points, (point, innerSeriesCallback) => {
                                    if (!_.includes(userIds, point.User.id)) {
                                        users.push(point.User);
                                        userIds.push(point.User.id);
                                    }
                                    innerSeriesCallback();
                                }, (error) => {
                                    addNotificationsForUsers(activity, users, notificationType, 'my_points', uniqueUserIds, seriesCallback);
                                });
                            }
                            else {
                                seriesCallback();
                            }
                        }).catch((error) => {
                            seriesCallback(error);
                        });
                    }).catch((error) => {
                        seriesCallback(error);
                    });
                }
                else {
                    // No post associated with this point
                    seriesCallback();
                }
            }
        },
        (seriesCallback) => {
            if (activity.sub_type === "bulkOperation") {
                seriesCallback();
            }
            else {
                if (activity.Community) {
                    // Notifications for all new points in community
                    getModelAndUsersByType(models.Community, 'CommunityUsers', activity.Community.id, "all_community", (error, community) => {
                        if (error) {
                            seriesCallback(error);
                        }
                        else if (community) {
                            addNotificationsForUsers(activity, community.CommunityUsers, notificationType, 'all_community', uniqueUserIds, seriesCallback);
                        }
                        else {
                            log.warn("Generate Point Notification Not found or muted", { userId: activity.user_id, type: activity.type });
                            seriesCallback();
                        }
                    });
                }
                else {
                    seriesCallback();
                }
            }
        },
        (seriesCallback) => {
            if (activity.sub_type === "bulkOperation") {
                seriesCallback();
            }
            else {
                if (activity.Group) {
                    // Notifications for all new points in group
                    getModelAndUsersByType(models.Group, 'GroupUsers', activity.Group.id, "all_group", (error, group) => {
                        if (error) {
                            seriesCallback(error);
                        }
                        else if (group) {
                            addNotificationsForUsers(activity, group.GroupUsers, notificationType, "all_group", uniqueUserIds, seriesCallback);
                        }
                        else {
                            log.warn("Generate Point Notification Not found or muted", { userId: activity.user_id, type: activity.type });
                            seriesCallback();
                        }
                    });
                }
                else {
                    seriesCallback();
                }
            }
        }
    ], (error) => {
        callback(error);
    });
    // TODO: Add AcWatching community and group users
};
const generateNotificationsForHelpfulness = (activity, callback) => {
    // Notifications for quality on posts I've created
    models.Point.findOne({
        where: { id: activity.point_id },
        include: [
            {
                model: models.User,
                required: true,
                attributes: ['id', 'notifications_settings', 'email', 'name'],
                where: {
                    "notifications_settings.my_points_endorsements.method": {
                        $gt: 0
                    }
                }
            }
        ]
    }).then((point) => {
        //TODO: do notifications for stories as well that are without a post_id
        if (point && point.post_id) {
            addOrPossiblyGroupNotification(point, 'notification.point.quality', 'my_points_endorsements', activity, point.User, 50, callback);
        }
        else {
            log.warn("Generate Point Notification Not found or muted", { userId: activity.user_id, type: activity.type });
            callback();
        }
    }).catch((error) => {
        callback(error);
    });
    // TODO: Add AcWatching users
};
module.exports = (activity, user, callback) => {
    if (activity.type === 'activity.point.new' ||
        activity.type === 'activity.point.newsStory.new' ||
        activity.type === 'activity.point.comment.new') {
        generateNotificationsForNewPoint(activity, callback);
    }
    else if (activity.type === 'activity.point.helpful.new' || activity.type === 'activity.point.unhelpful.new') {
        generateNotificationsForHelpfulness(activity, callback);
    }
    else {
        callback("Unexpected type for generatePointNotification");
    }
};
export {};
