var models = require('../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var moment = require('moment');

var allUsers = {};

var size = function(obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

/*models.AcNotification.findAll({
  attributes: ['id','type'],
  include: [
  {
    model: models.AcActivity, as: 'AcActivities',
    attributes: ['id','point_id','type','post_id','user_id'],
    required: true,
    where: {
      post_id: 7212
    }
  }
]}).then(function(notifications) {
  console.log("Hello: "+notifications.length);
  _.forEach(notifications, function (notification) {
    if (true || notification.AcActivities.length>1 && notification.type=="notification.post.endorsement") {
      console.log("================================================");
      _.forEach(notification.AcActivities, function (activity) {
        console.log("Activity: "+notification.type+" id: "+notification.id+" activity: "+activity.type+" userId: "+activity.user_id+" postId: "+activity.post_id+" pointId: "+activity.point_id);
      });
    }
  });
});
*/

models.AcNotification.find({
  attributes: ['id','type'],
  include: [
    {
      model: models.AcActivity, as: 'AcActivities',
      attributes: ['id','point_id','type','post_id','user_id'],
      required: true,
      where: {
        post_id: 8528
      }
    }
  ]}).then(function(notification) {
    debugger;
  if (true || notification.AcActivities.length>1 && notification.type=="notification.post.endorsement") {
    console.log(notification.type+" ================================================ "+notification.AcActivities.length);
    _.forEach(notification.AcActivities, function (activity) {
      console.log("Activity: "+notification.type+" id: "+notification.id+" activity: "+activity.type+" userId: "+activity.user_id+" postId: "+activity.post_id+" pointId: "+activity.point_id);
    });
  }
});