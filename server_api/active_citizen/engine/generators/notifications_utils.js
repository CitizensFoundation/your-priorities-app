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
      callback();
    } else {
      models.AcNotification.createNotificationFromActivity(user, activity, notification_type, 50, function (error) {
        uniqueUserIds[user.id] = true;
        callback(error);
      });
    }
  }, function (error) {
    callback(error);
  });
};

module.exports = {
  getModelAndUsersByType: getModelAndUsersByType,
  addNotificationsForUsers: addNotificationsForUsers
};