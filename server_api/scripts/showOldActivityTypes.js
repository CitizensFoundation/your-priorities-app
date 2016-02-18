var models = require('../models');
var async = require('async');
var ip = require('ip');

var allActivities = {};

models.AcActivity.findAll({attributes: [[models.Sequelize.literal("DISTINCT 'type'"), 'type'],'type']}).then(function(activityTypes) {
  console.log(activityTypes.length);
  async.eachSeries(activityTypes, function(activityType, callback) {
    console.log(activityType.type);
    allActivities[activityType.type] = activityType.type;
    callback();
  }, function done() {
    console.log(allActivities);
  });
});

