var models = require('../models');
var async = require('async');
var ip = require('ip');

console.log("Fixing Notifications Settings");

var loopyloop = true;
var numberOfRows = 25000;
var offset = 0;

async.whilst(
  function () { return loopyloop; },
  function (whilstCallback) {
    models.User.findAll(
      {
        limit: numberOfRows,
        offset: offset
      }
    ).then(function (users) {
      if (users && users.length>0) {
        offset += numberOfRows;
        async.eachSeries(users, function (user, seriesCallback) {
//          console.log(user.email);
          if (user.notifications_settings) {
            user.set('notifications_settings.all_group.method', 0);
            user.set('notifications_settings.all_community.method', 0);
          } else {
            user.notifications_settings = models.AcNotification.defaultNotificationSettings;
          }
          user.save().then(function (){
            seriesCallback();
          });
        },
        function (error) {
          console.log("Finished with rows continue");
          whilstCallback();
        });
      } else {
        console.log("Finished with rows ENDING");
        loopyloop = false;
        whilstCallback();
      }
    });
  },
  function (err, n) {
  }
);

