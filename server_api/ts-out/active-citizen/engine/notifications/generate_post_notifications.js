const models = require("../../../models/index.cjs");
const log = require('../../utils/logger.cjs');
const async = require('async');
const getModelAndUsersByType = require('./notifications_utils').getModelAndUsersByType;
const addNotificationsForUsers = require('./notifications_utils').addNotificationsForUsers;
const addOrPossiblyGroupNotification = require('./notifications_utils').addOrPossiblyGroupNotification;
const generateNotificationsForNewPost = (activity, callback) => {
    // Make sure not to create duplicate notifications to the same user
    const uniqueUserIds = { users: [] };
    async.series([
        (seriesCallback) => {
            if (activity.Community) {
                // Notifications for all new posts in community
                getModelAndUsersByType(models.Community, 'CommunityUsers', activity.Community.id, "all_community", (error, community) => {
                    if (error) {
                        seriesCallback(error);
                    }
                    else if (community) {
                        addNotificationsForUsers(activity, community.CommunityUsers, "notification.post.new", "all_community", uniqueUserIds, seriesCallback);
                    }
                    else {
                        log.warn("Generate Post Notification Not found or muted", { userId: activity.user_id, type: activity.type });
                        seriesCallback();
                    }
                });
            }
            else {
                seriesCallback();
            }
        },
        (seriesCallback) => {
            // Notifications for all new posts in group
            getModelAndUsersByType(models.Group, 'GroupUsers', activity.Group.id, "all_group", (error, group) => {
                if (error) {
                    seriesCallback(error);
                }
                else if (group) {
                    addNotificationsForUsers(activity, group.GroupUsers, "notification.post.new", "all_group", uniqueUserIds, seriesCallback);
                }
                else {
                    log.warn("Generate Post Notification Not found or muted", { userId: activity.user_id, type: activity.type });
                    seriesCallback();
                }
            });
        }
    ], (error) => {
        callback(error);
    });
    // TODO: Add AcWatching community and group users
    // TODO: Add AcFollowing
};
const generateNotificationsForEndorsements = (activity, callback) => {
    // Notifications for endorsement on posts I've created
    let mutePost = false;
    if (activity.Community &&
        activity.Community.configuration &&
        activity.Community.configuration.muteNotificationsForEndorsements) {
        mutePost = true;
    }
    models.Post.findOne({
        where: { id: activity.post_id },
        include: [
            {
                model: models.User,
                attributes: ['id', 'notifications_settings', 'email', 'name'],
                required: true,
                where: {
                    "notifications_settings.my_posts_endorsements.method": {
                        $gt: 0
                    }
                }
            }
        ]
    }).then((post) => {
        if (post && !mutePost) {
            addOrPossiblyGroupNotification(post, 'notification.post.endorsement', 'my_posts_endorsements', activity, post.User, 50, callback);
        }
        else {
            log.warn("Generate Post Notification Not found or muted", { userId: activity.user_id, type: activity.type });
            callback();
        }
    }).catch((error) => {
        callback(error);
    });
    // TODO: Add AcWatching users
};
module.exports = (activity, user, callback) => {
    if (activity.type == 'activity.post.new') {
        generateNotificationsForNewPost(activity, callback);
    }
    else if (activity.type == 'activity.post.endorsement.new' || activity.type == 'activity.post.opposition.new') {
        generateNotificationsForEndorsements(activity, callback);
    }
};
export {};
