// https://gist.github.com/mojodna/1251812

var models = require("../../models");
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var async = require('async');

var postNotificationGenerator = require('../engine/generators/post_notifications.js');
var pointNotificationGenerator = require('../engine/generators/point_notifications.js');

var ActivityWorker = function () {};

ActivityWorker.prototype.process = function (activityJson, callback) {
  var activity;

  async.series([
      function (callback) {
        models.AcActivity.find({
          where: { id: activityJson.id },
          include: [
            {
              model: models.User,
              required: true
            },
            {
              model: models.Domain,
              required: true
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
        }).then(function (results) {
          if (results) {
            activity = results;
            callback();
          } else {
            callback('Activity not found');
          }
        }).catch(function (error) {
          callback(error);
        });
      }
    ],
    function (error) {
      if (error) {
        log.error("ActivityWorker Error", {err: error});
        callback();
      } else {
        log.info('Processing Activity Started', {type: activity.type});
        try {
          switch (activity.type) {
            case "activity.password.recovery":
              models.AcNotification.createNotificationFromActivity(activity.actor.user, activity, "notification.password.recovery", 100, function (error) {
                log.info('Processing activity.password.recovery Completed', {type: activity.type, err: error});
                callback();
              });
              break;
            case "activity.password.changed":
              models.AcNotification.createNotificationFromActivity(activity.actor.user, activity, "notification.password.changed", 100, function (error) {
                log.info('Processing activity.password.changed Completed', {type: activity.type, err: error});
                callback();
              });
              break;
            case "activity.post.new":
            case "activity.post.opposition.new":
            case "activity.post.endorsement.new":
              postNotificationGenerator(activity, activity.User, function (error) {
                log.info('Processing activity.post.* Completed', {type: activity.type, err: error});
                callback();
              });
              break;
            case "activity.point.new":
            case "activity.point.helpful.new":
            case "activity.point.unhelpful.new":
              pointNotificationGenerator(activity, activity.User, function (error) {
                log.info('Processing activity.point.* Completed', {type: activity.type, err: error});
                callback();
              });
              break;
            default:
              callback();
          }
        } catch (err) {
          log.error("Processing Activity Error", {err: err});
          callback();
        }
      }
    }
  );
};

module.exports = new ActivityWorker();
