// https://gist.github.com/mojodna/1251812

var async = require("async");
var NotificationWorker = function () {};
var models = require("../../models");
var log = require('../utils/logger');
var queue = require('./queue');
var i18n = require('../utils/i18n');
var toJson = require('../utils/to_json');

NotificationWorker.prototype.process = function (notification, done) {

  try {
    var user;
    var domain = notification.activity.object.domain;
    var community = notification.activity.object.community;

    async.series([
      function(callback){
        models.User.find({
          where: { id: notification.activity.actor.user.id }
        }).then(function(userResults) {
          if (userResults) {
            user = userResults;
            callback();
          } else {
            callback('User not found');
          }
        }).catch(function(error) {
          callback(error);
        });
      },
      function(callback){
        user.setLocale(i18n, domain, community, function () {
          callback();
        });
      }
    ],
    function(error) {
      if (error) {
        log.error("NotificationWorker Error", {err: error});
        done();
      } else {
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
          default:
            done();
        }
      }
    });
  } catch (error) {
    log.error("Processing Activity Error", {err: error});
    done();
  }
};

module.exports = new NotificationWorker();
