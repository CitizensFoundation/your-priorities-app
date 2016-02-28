var queue = require('../../workers/queue');
var models = require("../../../models");
var i18n = require('../../utils/i18n');

var filterPostNotificationForDelivery = function (notification, user, notification_settings_type, callback) {
  var method = user.notifications_settings[notification_settings_type].method;
  var frequency = user.notifications_settings[notification_settings_type].frequency;

  if (method != models.AcNotification.METHOD_MUTED) {
    if (frequency == models.AcNotification.FREQUENCY_AS_IT_HAPPENS) {
      queue.create('send-one-email', {
        subject: i18n.t('email.new_post'),
        template: 'post_activity',
        user: user,
        domain: notification.AcActivities[0].Domain,
        community: notification.AcActivities[0].Community,
        activity: notification.AcActivities[0],
        post: notification.AcActivities[0].Post
      }).priority('critical').removeOnComplete(true).save();
      callback();
    } else if (user.notifications_settings.my_posts.method != models.AcNotification.METHOD_MUTED) {
      AcDelayedNotification.findOrCreate({
        where: {
          user_id: user.id,
          method: method,
          frequency: frequency
        },
        defaults: {
          user_id: user.id,
          method: method,
          frequency: frequency
        }
      }).spread(function(delayedNotification, created) {
        if (created) {
          log.info('AcDelayedNotification Created', { delayedNotification: toJson(delayedNotification), context: 'create' });
        } else {
          log.info('AcDelayedNotification Loaded', { delayedNotification: toJson(delayedNotification), context: 'loaded' });
        }
        delayedNotification.addDelayedNotification(notification).then(function (results) {
          if (delayedNotification.delivered) {
            delayedNotification.delivered = false;
            delayedNotification.save().then(function (results) {
              callback();
            });
          } else {
            callback();
          }
        });
      }).catch(function (error) {
        callback(error);
      });
    }
  } else {
    callback();
  }
};

module.exports = function (notification, user, callback) {
  if (notification.type=='notification.post.new') {
    filterPostNotificationForDelivery(notification, user, 'my_posts', callback);
  } else if (notification.type=='notification.post.endorsement') {
    filterPostNotificationForDelivery(notification, user, 'my_posts_endorsements', callback);
    callback();
  }
};
