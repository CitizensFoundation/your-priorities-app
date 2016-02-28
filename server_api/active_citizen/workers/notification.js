// https://gist.github.com/mojodna/1251812
var async = require("async");
var models = require("../../models");
var log = require('../utils/logger');
var queue = require('./queue');
var i18n = require('../utils/i18n');
var toJson = require('../utils/to_json');
var postNotificationFilter = require('../engine/filters/post_notifications.js');

var NotificationWorker = function () {};

NotificationWorker.prototype.process = function (notificationJson, done) {

  try {
    var user;
    var notification;
    var domain;
    var community;

    async.series([
      function(callback){
        models.AcNotification.find({
          where: { id: notificationJson.id },
          include: [ models.AcActivity ]
        }).then(function(results) {
          if (results) {
            notification = results;
            domain = notification.AcActivites[0].object.domain;
            community = notification.AcActivites[0].activity.object.community;
            callback();
          } else {
            callback('Notification not found');
          }
        }).catch(function(error) {
          callback(error);
        });
      },
      function(callback){
        models.User.find({
          where: { id: notification.user.id }
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
          case "notification.password.recovery":
            queue.create('send-one-email', {
              subject: i18n.t('email.password_recovery'),
              template: 'password_recovery',
              user: user,
              domain: domain,
              community: community,
              token: notification.AcActivites[0].object.token
            }).priority('critical').removeOnComplete(true).save();
            log.info('Processing notification.password.recovery Completed', { type: notification.type, user: user });
            done();
            break;
          case "notification.password.changed":
            queue.create('send-one-email', {
              subject: i18n.t('email.password_changed'),
              template: 'password_changed',
              user: user,
              domain: domain,
              community: community,
              token: notification.activity.object.token
            }).priority('critical').removeOnComplete(true).save();
            log.info('Processing notification.password.changed Completed', { type: notification.type, user: user });
            done();
            break;
          case "notification.post.new":
            postNotificationFilter(notification, user, function () {
              log.info('Processing notification.post.new Completed', { type: notification.type, user: user });
              done();
            });
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
