// https://gist.github.com/mojodna/1251812

var NotificationWorker = function () {};
var models = require("../../models");
var log = require('../utils/logger');
var queue = require('./queue');
var i18n = require('../utils/i18n');
var toJson = require('../utils/to_json');

NotificationWorker.prototype.process = function (notification, done) {

  var user = notification.activity.actor.user;
  var domain = notification.activity.object.domain;
  var community = notification.activity.object.community;

  user.setLocale(i18n, domain, community, function () {
    log.info('Processing Notification Started', { type: notification.type, user: user });

    switch(notification.type) {
      case models.AcNotification.NOTIFICATION_PASSWORD_RECOVERY:
        queue.create('send-one-email', {
          subject: i18n.t('email.password_recovery'),
          template: 'password_recovery',
          user: user,
          domain: domain,
          community: community,
          token: notification.activity.object.token
        }).priority('critical').removeOnComplete(true).save();
        log.info('Processing Notification Completed', { type: notification.type, user: user });
        done();
        break;
    }
  });
};

module.exports = new NotificationWorker();
