"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var filterNotificationForDelivery = require('./emails_utils.cjs').filterNotificationForDelivery;
module.exports = function (notification, user, callback) {
    var contentName = "";
    if (notification.AcActivities[0].Post) {
        contentName = notification.AcActivities[0].Post.name;
    }
    else if (notification.AcActivities[0].Point.Group && notification.AcActivities[0].Point.Group.name != "hidden_public_group_for_domain_level_points") {
        contentName = notification.AcActivities[0].Point.Group.name;
    }
    else if (notification.AcActivities[0].Point.Community) {
        contentName = notification.AcActivities[0].Point.Community.name;
    }
    else if (notification.AcActivities[0].Point.Domain) {
        contentName = notification.AcActivities[0].Point.Group.Domain.name;
    }
    if (notification.type == 'notification.point.new') {
        filterNotificationForDelivery(notification, user, 'point_activity', { translateToken: 'notification.email.newPointOnMyPoint', contentName: contentName }, callback);
    }
    else if (notification.type == 'notification.point.newsStory') {
        filterNotificationForDelivery(notification, user, 'point_news_story', { translateToken: 'notification.email.newsStory', contentName: contentName }, callback);
    }
    else if (notification.type == 'notification.point.comment') {
        filterNotificationForDelivery(notification, user, 'point_comment', { translateToken: 'notification.email.comment', contentName: contentName }, callback);
    }
    else if (notification.type == 'notification.point.quality') {
        var subjectTranslateToken = (notification.AcActivities[0].type.indexOf('activity.point.helpful') > -1) ? 'notification.email.pointHelpful' : 'notification.email.pointUnhelpful';
        filterNotificationForDelivery(notification, user, 'point_activity', { translateToken: subjectTranslateToken, contentName: contentName }, callback);
    }
    else {
        callback("Unknown state for notification filtering: " + notification.type);
    }
};
