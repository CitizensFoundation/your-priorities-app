var models = require("../../../models");
var auth = require('../../authorization');
var log = require('../../utils/logger');
var toJson = require('../../utils/to_json');
var async = require('async');
var getModelAndUsersByType = require('./notifications_utils').getModelAndUsersByType;
var addNotificationsForUsers = require('./notifications_utils').addNotificationsForUsers;
var addOrPossiblyGroupNotification = require('./notifications_utils').addOrPossiblyGroupNotification;

var generateNotificationsForNewPoint = function (activity, uniqueUserIds, callback) {
  async.series([
    function(seriesCallback){
      // Notifications for my points
      var userWhere = {};

      userWhere["notifications_settings.my_points.method"] = {
        $gt: 0
      };

      models.Post.find({
        where: {
          id: activity.post_id
        },
        include: [
          {
            model: models.Point,
            include: [
              {
                model: models.User,
                attributes: ['id','notifications_settings','email'],
                where: userWhere,
                required: true
              }
            ]
          }
        ]
      }).then(function (post) {
        if (post) {
          var users = [];
          async.eachSeries(post.Points, function(point, innerSeriesCallback) {
            if (!uniqueUserIds[user.id]) {
              users.push(point.User);
              uniqueUserIds[user.id] = true;
            }
            innerSeriesCallback();
          }, function (error) {
            addNotificationsForUsers(activity, users, "notification.point.new", uniqueUserIds, seriesCallback);
          });
        } else {
          seriesCallback();
        }
      });
    },
    function(seriesCallback){
      if (activity.Community) {
        // Notifications for all new points in community
        getModelAndUsersByType(models.Community, 'CommunityUsers', activity.Community.id, "all_community", function(error, community) {
          if (error) {
            seriesCallback(error);
          } else {
            addNotificationsForUsers(activity, community.CommunityUsers, "notification.point.new", uniqueUserIds, seriesCallback);
          }
        });
      } else {
        seriesCallback();
      }
    },
    function(seriesCallback){
      // Notifications for all new points in group
      getModelAndUsersByType(models.Group, 'GroupUsers', activity.Group.id, "all_group", function(error, group) {
        if (error) {
          seriesCallback(error);
        } else {
          addNotificationsForUsers(activity, group.GroupUsers, "notification.point.new", uniqueUserIds, seriesCallback);
        }
      });
    }
  ], function (error) {
    callback(error);
  });

  // TODO: Add AcWatching community and group users
};

var generateNotificationsForHelpfulness = function (activity, callback) {
  // Notifications for helpfulness on posts I've created
  models.Point.find({
    where: { id: activity.point_id },
    include: [
      {
        model: models.User,
        required: true,
        where: {
          "notifications_settings.my_points_endorsements.method": {
            $gt: 0
          }
        }
      }
    ]
  }).then( function(point) {
    if (point) {
      addOrPossiblyGroupNotification(point, 'notification.point.helpfulness', activity, 50, callback);
    } else {
      callback();
    }
  }).catch(error, function() {
    callback(error);
  });

  // TODO: Add AcWatching users
};

module.exports = function (activity, user, callback) {

  // Make sure not to create duplicate notifications to the same user
  var uniqueUserIds = {};

  if (activity.type=='activity.point.new') {
    generateNotificationsForNewPoint(activity, uniqueUserIds, callback);
  } else if (activity.type=='activity.point.helpful.new' || activity.type=='activity.post.unhelpful.new') {
    generateNotificationsForHelpfulness(activity, callback)
  }
};
