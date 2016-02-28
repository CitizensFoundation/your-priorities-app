var models = require("../../../models");
var auth = require('../../authorization');
var log = require('../../utils/logger');
var toJson = require('../../utils/to_json');
var async = require('async');
var getModelAndUsersByType = require('./notifications_utils').getModelAndUsersByType;
var addNotificationsForUsers = require('./notifications_utils').addNotificationsForUsers;
var addOrPossiblyGroupNotification = require('./notifications_utils').addOrPossiblyGroupNotification;

var generateNotificationsForNewPost = function (activity, uniqueUserIds, callback) {
  async.series([
    function(seriesCallback){
      if (activity.Community) {
        // Notifications for all new posts in community
        getModelAndUsersByType(models.Community, 'CommunityUsers', activity.Community.id, "all_community", function(error, community) {
          if (error) {
            seriesCallback(error);
          } else {
            addNotificationsForUsers(activity, community.CommunityUsers, "notification.post.new", uniqueUserIds, seriesCallback);
          }
        });
      } else {
        seriesCallback();
      }
    },
    function(seriesCallback){
      // Notifications for all new posts in group
      getModelAndUsersByType(models.Group, 'GroupUsers', activity.Group.id, "all_group", function(error, group) {
        if (error) {
          seriesCallback(error);
        } else {
          addNotificationsForUsers(activity, group.GroupUsers, "notification.post.new", uniqueUserIds, seriesCallback);
        }
      });
    }
  ], function (error) {
    callback(error);
  });

  // TODO: Add AcWatching community and group users
};

var generateNotificationsForEndorsements = function (activity, callback) {
  // Notifications for endorsement on posts I've created
  models.Post.find({
    where: { id: activity.post_id },
    include: [
      {
        model: models.User,
        required: true,
        where: {
          "notifications_settings.my_posts_endorsements.method": {
            $gt: 0
          }
        }
      }
    ]
  }).then( function(post) {
    if (post) {
      addOrPossiblyGroupNotification(post, 'notification.post.endorsement', activity, 50, callback);
    } else {
      callback('Not found or muted');
    }
  }).catch(error, function() {
    callback(error);
  });

  // TODO: Add AcWatching users
};

module.exports = function (activity, user, callback) {

  // Make sure not to create duplicate notifications to the same user
  var uniqueUserIds = {};

  if (activity.type=='activity.post.new') {
    generateNotificationsForNewPost(activity, uniqueUserIds, callback);
  } else if (activity.type=='activity.post.endorsement.new' || activity.type=='activity.post.opposition.new') {
    generateNotificationsForEndorsements(activity, callback)
  }
};
