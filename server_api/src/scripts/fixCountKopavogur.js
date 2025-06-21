var models = require('../models/index.cjs');
var async = require('async');

models.Group.findOne({where: {id: 752}}).then(function(group) {
  group.counter_points = 0;
  group.save().then(function () {
    log.info("log");
  });
});

