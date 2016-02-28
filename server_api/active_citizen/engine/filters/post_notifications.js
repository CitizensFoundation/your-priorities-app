var queue = require('../../workers/queue');

var filterNewPostNotificationForDelivery = function (notification, user, callback) {
  if (user.notification_settings.my_posts.method != models.AcNotification.METHOD_MUTED) {
    if (user.notification_settings.my_posts.frequency==models.AcNotification.FREQENCY_AS_IT_HAPPENS) {
      queue.create('send-one-email', {
        subject: i18n.t('email.new_post'),
        template: 'post_activity',
        user: user,
        domain: notfication.AcActivites[0].Domain,
        community: notfication.AcActivites[0].Community,
        post: notfication.AcActivites[0].Post
      }).priority('critical').removeOnComplete(true).save();
      callback();
    } else if (user.notification_settings.my_posts.method != models.AcNotification.METHOD_MUTED) {
      AcDelayedNotification.findOrCreate({
        where: {
          user_id: user.id,
          method: user.notification_settings.my_posts.method,
          frequency: user.notification_settings.my_posts.frequency
        },
        defaults: {
          user_id: user.id,
          method: user.notification_settings.my_posts.method,
          frequency: user.notification_settings.my_posts.frequency
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
        callback(error)
      });
    }
  } else {
    callback();
  }
};

exports = function (notification, user, callback) {
  if (notification.type=='notification.post.new') {
    filterNewPostNotificationForDelivery(notification, user, callback);
  } else {
    callback();
  }
};
