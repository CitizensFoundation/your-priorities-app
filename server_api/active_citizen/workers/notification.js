// https://gist.github.com/mojodna/1251812
var async = require("async");
var models = require("../../models");
var log = require('../utils/logger');
var queue = require('./queue');
var i18n = require('../utils/i18n');
var toJson = require('../utils/to_json');
var postNotificationFilter = require('../engine/filters/post_notifications.js');
var pointNotificationFilter = require('../engine/filters/point_notifications.js');

var NotificationWorker = function () {};

NotificationWorker.prototype.process = function (notificationJson, callback) {
  try {
    var user;
    var notification;
    var domain;
    var community;

    async.series([
      function(callback){
        models.AcNotification.find({
          where: { id: notificationJson.id },
          include: [
            {
              model: models.AcActivity,
              as: 'AcActivities',
              required: true,
              include: [
                {
                  model: models.Domain,
                  required: false
                },
                {
                  model: models.Community,
                  required: false
                },
                {
                  model: models.Group,
                  required: false
                },
                {
                  model: models.Post,
                  required: false
                },
                {
                  model: models.Point,
                  required: false
                }
              ]
            }
          ]
        }).then(function(results) {
          if (results) {
            notification = results;
            domain = notification.AcActivities[0].Domain;
            community = notification.AcActivities[0].Community;
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
          where: { id: notification.user_id }
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
        callback();
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
            callback();
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
            callback();
            break;
          case "notification.post.new":
          case "notification.post.endorsement":
            postNotificationFilter(notification, user, function () {
              log.info('Processing notification.post.* Completed', { type: notification.type, user: user });
              callback();
            });
            break;
          case "notification.point.new":
          case "notification.point.quality":
            pointNotificationFilter(notification, user, function () {
              log.info('Processing notification.point.* Completed', { type: notification.type, user: user });
              callback();
            });
            break;
          default:
            callback();
        }
      }
    });
  } catch (error) {
    log.error("Processing Activity Error", {err: error});
    callback();
  }
};

module.exports = new NotificationWorker();
