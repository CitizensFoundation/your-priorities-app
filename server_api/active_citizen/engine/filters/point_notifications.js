var queue = require('../../workers/queue');
var models = require("../../../models");
var i18n = require('../../utils/i18n');
var filterNotificationForDelivery = require('./notifications_utils').filterNotificationForDelivery;

module.exports = function (notification, user, callback) {
  if (notification.type=='notification.point.new') {
    filterNotificationForDelivery(notification, user, 'my_points', 'point_activity', i18n.t('email.post.subject.new'), callback);
  } else if (notification.type=='notification.point.helpfulness') {
    filterNotificationForDelivery(notification, user, 'my_points_endorsements', 'point_activity', i18n.t('email.post.subject.helpfulness'), callback);
  }
};
