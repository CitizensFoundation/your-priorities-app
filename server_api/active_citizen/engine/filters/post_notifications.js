var queue = require('../../workers/queue');

var filterNewPostNotificationForDelivery = function (notification, user, callback) {
  if (user.notification_settings.my_posts.method==models.AcNotification.METHOD_EMAIL) {
    queue.create('send-one-email', {
      subject: i18n.t('email.new_post'),
      template: 'post_activity',
      user: user,
      domain: notfication.AcActivites[0].object.domain,
      community:  notfication.AcActivites[0].object.community,
      post: notfication.AcActivites[0].object.post
    }).priority('critical').removeOnComplete(true).save();
  } else {
    callback();
  }
};

exports = function (notification, user, callback) {
  if (notification.type=='notification.post.new') {
    filterNewPostNotificationForDelivery(notification, user, callback);
  } else if (activity.type=='notification.post.endorsement') {
    filterPostEndorsementNotificationForDelivery(activity, uniqueUserIds, callback)
  }
};
