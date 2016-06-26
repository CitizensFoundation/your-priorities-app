var models = require('../models');
var async = require('async');
var ip = require('ip');

models.AcDelayedNotification.findAll({
  include: [
    {
      model: models.AcActivity,
      as: 'AcDelayedNotifications'
    }
  ]
}).then(function (notifications) {
  async.eachSeries(notifications, function (notification, seriesCallback) {
    console.log("Notification: "+notification.id);
    console.log("User id: "+notification.user_id);
    console.log("Number of delayed notifications:" + notification.AcActivity.length);
    seriesCallback();
  });
});