var models = require('../models');
var async = require('async');

models.Group.find({where: {id: 752}}).then(function(group) {
  group.counter_points = 0;
  group.save().then(function () {
    console.log("log");
  });
});

