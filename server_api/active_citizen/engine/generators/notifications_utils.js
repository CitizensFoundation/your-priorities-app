var models = require("../../../models");
var log = require('../../utils/logger');
var toJson = require('../../utils/to_json');
var async = require('async');

var getModelAndUsersByType = function (model, id, notification_type, callback) {
  var userWhere = {};

  userWhere["notifications_settings."+notification_type+".method"] = {
    $gt: 0
  };

  model.find({
    where: { id: id },
    include: [
      {
        model: models.User,
        where: userWhere
      }
    ]
  }).then( function(results) {
    if (results) {
      callback(null, results)
    } else {
      callback('Not found');
    }
  }).catch(error, function() {
    callback(error);
  });
};

var addNotificationsForUsers = function (activity, users, notification_type, uniqueUsers, callback) {
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