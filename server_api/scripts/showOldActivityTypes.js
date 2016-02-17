var models = require('../models');
var async = require('async');
var ip = require('ip');

var allActivities = {};

models.AcActivity.findAll({attributes: [[models.Sequelize.literal("DISTINCT 'type'"), 'type']]}).then(function(activityTypes) {
  console.log(activityTypes.length);
  async.eachSeries(activityTypes, function iteratee(activityType, callback) {
    console.log(activityType.type);
    allActivities[activityType.type] = activityType.type;
  }, function done() {
    console.log(allActivities);
  });
});

