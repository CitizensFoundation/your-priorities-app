var queue = require('../../workers/queue');
var models = require("../../../models");
var i18n = require('../../utils/i18n');
var filterNotificationForDelivery = require('./notifications_utils').filterNotificationForDelivery;

module.exports = function (notification, user, callback) {
  if (notification.type=='notification.post.new') {
    filterNotificationForDelivery(notification, user, 'my_posts', 'post_activity', i18n.t('email.post.subject.new'), callback);
  } else if (notification.type=='notification.post.endorsement') {
    filterNotificationForDelivery(notification, user, 'my_posts_endorsements', 'post_activity', i18n.t('email.post.subject.new'), callback);
  } else {
    callback();
  }
};
