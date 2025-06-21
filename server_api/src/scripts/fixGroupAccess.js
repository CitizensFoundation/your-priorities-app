var models = require('../models/index.cjs');
var async = require('async');

log.info("Fix group");

models.Group.findAll({where: {access: 1}}).then(function(groups) {
  async.eachSeries(groups, function (group, seriesCallback) {
    group.access = models.Group.ACCESS_OPEN_TO_COMMUNITY;
    group.save().then(function () {
      log.info("Changed to open to community "+group.name);
      seriesCallback();
    })
  }, function (error) {
      log.info("Finished");
      process.exit();
    }
  )
});

