var models = require('../models');
var async = require('async');

console.log("Fix group");

models.Group.findAll({where: {access: 1}}).then(function(groups) {
  async.eachSeries(groups, function (group, seriesCallback) {
    group.access = models.Group.ACCESS_OPEN_TO_COMMUNITY;
    group.save().then(function () {
      console.log("Changed to open to community "+group.name);
      seriesCallback();
    })
  }, function (error) {
      console.log("Finished");
      process.exit();
    }
  )
});

