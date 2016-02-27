var models = require("../../../models");
var auth = require('../../authorization');
var log = require('../../utils/logger');
var toJson = require('../../utils/to_json');
var async = require('async');

var generateNotificationsFromNewIdea = function (activity, callback) {

  var userId = activity.object.userId;
  var postId = activity.object.postId;
  var groupId = activity.object.groupId;
  var communityId = activity.object.communityId;

  var userNotifications = {};

  // Notify everybody that wants to get activities from community
  models.Community.find({
    where: { id: communityId },
    include: [
      {
        model: models.User,
        where: {
          "notifications_settings.community.method": {
            $gt: 0
          }
        }
      }
    ]
  }).then( function(community) {
    community.Users
  });


  // Notify everybody that wants to get activities from group
  models.Group.find({where: { id: group.id }})



};

exports = function (activity, callback) {
  if (activity.type=='activity.post.new') {
    generateNotificationsFromNewIdea(activity, callback);
  }
};
