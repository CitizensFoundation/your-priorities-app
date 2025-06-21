var models = require('../models/index.cjs');
var async = require('async');

var allActivities = {};

models.AcActivity.findAll({attributes: [[models.Sequelize.literal("DISTINCT 'type'"), 'type'],'type']}).then(function(activityTypes) {
  log.info(activityTypes.length);
  async.eachSeries(activityTypes, function(activityType, callback) {
    log.info(activityType.type);
    allActivities[activityType.type] = activityType.type;
    callback();
  }, function done() {
    log.info(allActivities);
  });
});

