var models = require("../../../models");
var log = require('../../utils/logger');
var toJson = require('../../utils/to_json');
var async = require('async');

var getModelAndUsersByType = function (model, userType, id, notification_type, callback) {
  var userWhere = {};

  userWhere["notifications_settings."+notification_type+".method"] = {
    $gt: 0
  };

  // TODO: Use streams when ready https://github.com/sequelize/sequelize/issues/2454
  model.find({
    where: { id: id },
    include: [
      {
        model: models.User,
        attributes: ['id','notifications_settings','email'],
        as: userType,
        where: userWhere
      }
    ]
  }).then( function(results) {
    if (results) {
      callback(null, results)
    } else {
      callback();
    }
  }).catch(function(error) {
    callback(error);
  });
};

var addNotificationsForUsers = function (activity, users, notification_type, uniqueUserIds, callback) {
  async.eachSeries(users, function (user, seriesCallback) {
    if (uniqueUserIds[user.id]) {
      seriesCallback();
    } else {
      models.AcNotification.createNotificationFromActivity(user, activity, notification_type, 50, function (error) {
        uniqueUserIds[user.id] = true;
        seriesCallback(error);
      });
    }
  }, function (error) {
    callback(error);
  });
};
// type: 'notification.post.endorsement';

var addOrPossiblyGroupNotification = function (model, type, activity, priority, callback) {
  models.AcNotification.find({
    where: {
      user_id: model.User.id,
      type: type,
      created_at: {
        $lt: new Date(),
        $gt: new Date(new Date() - models.AcNotification.ENDORSEMENT_GROUPING_TTL)
      }
    }
  }).then(function(notification) {
    if (notification) {
      models.AcNotification.find({
        where: {
          user_id: post.User.id,
          type: type,
          created_at: {
            $lt: new Date(),
            $gt: new Date(new Date() - models.AcNotification.ENDORSEMENT_GROUPING_TTL)
          }
        },
        include: [
          {
            model: models.AcActivity,
            as: 'AcActivities',
            required: true,
            where: {
              user_id: activity.user_id,
              type: activity.type
            }
          }
        ]
      }).then(function(specificNotification) {
        if (specificNotification) {
          callback();
        } else {
          notification.addAcActivities(activity).then(function (results) {
            if (results) {
              models.AcNotification.processNotification(notification, activity);
              callback();
            } else {
              callback("Notification Error Can't add activity");
            }
          });
        }
      });
    } else {
      models.AcNotification.createNotificationFromActivity(post.User, activity, type, priority, function (error) {
        callback(error);
      });
    }
  });
};

module.exports = {
  getModelAndUsersByType: getModelAndUsersByType,
  addNotificationsForUsers: addNotificationsForUsers,
  addOrPossiblyGroupNotification: addOrPossiblyGroupNotification
};