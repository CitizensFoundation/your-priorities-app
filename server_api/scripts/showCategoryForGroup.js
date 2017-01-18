var models = require('../models');
var async = require('async');
var ip = require('ip');
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
  console.log(json.toLowerCase());
  process.exit();

});




