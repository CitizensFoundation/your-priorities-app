"use strict";
var filterNotificationForDelivery = require('./emails_utils.cjs').filterNotificationForDelivery;
module.exports = function (notification, user, callback) {
    if (notification && user && notification.AcActivities && notification.AcActivities.length > 0) {
        var post = notification.AcActivities[0].Post;
        var postName = post ? post.name : "?";
        if (!post) {
            callback("No public post found for notification delivery");
        }
        else if (notification.type == 'notification.post.new') {
            filterNotificationForDelivery(notification, user, 'post_activity', { translateToken: 'notification.email.postNew', contentName: postName }, callback);
        }
        else if (notification.type == 'notification.post.endorsement') {
            var subjectTranslateToken = (notification.AcActivities[0].type.indexOf('activity.post.endorsement') > -1) ? 'notification.email.postEndorsement' : 'notification.email.postOpposition';
            filterNotificationForDelivery(notification, user, 'post_activity', { translateToken: subjectTranslateToken, contentName: postName }, callback);
        }
        else {
            callback();
        }
    }
    else {
        callback("Missing data for notification delivery");
    }
};
