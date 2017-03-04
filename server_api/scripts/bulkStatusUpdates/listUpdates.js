var models = require('../../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var moment = require('moment');

var id = process.argv[2];

models.BulkStatusUpdate.findAll({}).then(function(bulkStatusUpdates) {
  _.forEach(bulkStatusUpdates, function (update) {
    console.log("Update: "+update.id + " name: "+update.name);
  });
  process.exit();
}).catch(function(error) {
  console.error(error);
});



