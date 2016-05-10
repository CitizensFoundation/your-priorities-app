var models = require('../models');
var async = require('async');

console.log("Fix group");

models.Group.findAll({where: {access: 2}}).then(function(groups) {
  async.eachSeries(groups, function (group, seriesCallback) {
    group.access = 1;
    group.save().then(function () {
      seriesCallback();
    })
  }, function (error) {
      console.log("Finished");
      process.exit();
    }
  )
});

