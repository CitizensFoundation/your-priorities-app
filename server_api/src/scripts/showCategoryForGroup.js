var models = require('../models/index.cjs');
var async = require('async');
var groupId = process.argv[2];
var _ = require('lodash');

models.Category.findAll({
  where: {
    group_id: groupId
  }
}).then(function(categories) {

  var json = "{ ";
  _.forEach(categories, function (category) {
    json+='"'+category.name+'":'+category.id+', \n'
  });
  json += "}";
  log.info(json.toLowerCase());
  process.exit();

});




