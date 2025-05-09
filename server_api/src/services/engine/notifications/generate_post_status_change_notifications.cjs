var models = require("../../../models/index.cjs");
var async = require('async');
var addNotificationsForUsers = require('./notifications_utils.cjs').addNotificationsForUsers;
var _ = require('lodash');

var generateNotificationsForPostStatusChange = function (activity, uniqueUserIds, callback) {
  async.series([
    function(seriesCallback){
      if (activity.post_id) {
        models.Endorsement.findAll({
          where: {
            post_id: activity.post_id
          },
          attributes: ['id','user_id'],
          include: [
            {
              model: models.User,
              required: true,
              attributes: ['id','name','email']
            }
          ]
        }).then(function (endorsements) {
          var users = _.map(endorsements, function (item) { return item.User });
          addNotificationsForUsers(activity, users, "notification.post.status.change", "priority", uniqueUserIds, seriesCallback);
        }).catch(function (error) {
          seriesCallback(error);
        });
      } else {
        seriesCallback();
      }
    }
  ], function (error) {
    callback(error);
  });
};

module.exports = function (activity, user, callback) {
  // Make sure not to create duplicate notifications to the same user
  var uniqueUserIds = { users: [] };
  generateNotificationsForPostStatusChange(activity, uniqueUserIds, callback);
};
