var models = require("../../../models");
var log = require('../../utils/logger');
var toJson = require('../../utils/to_json');
var async = require('async');

var filterNotificationForDelivery = function (notification, user, notification_settings_type, template, subject, callback) {
  var method = user.notifications_settings[notification_settings_type].method;
  var frequency = user.notifications_settings[notification_settings_type].frequency;

  if (method != models.AcNotification.METHOD_MUTED) {
    if (frequency == models.AcNotification.FREQUENCY_AS_IT_HAPPENS) {
      queue.create('send-one-email', {
        subject: subject,
        template: template,
        user: user,
        domain: notification.AcActivities[0].Domain,
        community: notification.AcActivities[0].Community,
        activity: notification.AcActivities[0],
        post: notification.AcActivities[0].Post,
        post: notification.AcActivities[0].Point
      }).priority('critical').removeOnComplete(true).save();
      callback();
    } else if (user.notifications_settings.my_posts.method != models.AcNotification.METHOD_MUTED) {
      AcDelayedNotification.findOrCreate({
        where: {
          user_id: user.id,
          method: method,
          frequency: frequency,
          type: notification.type
        },
        defaults: {
          user_id: user.id,
          method: method,
          frequency: frequency,
          type: notification.type
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


module.exports = {
  filterNotificationForDelivery: filterNotificationForDelivery
};