var models = require('../models');
var async = require('async');
var ip = require('ip');


models.AcNewsFeedItem.destroy({ truncate: true }).then(function(results) {
  console.log("Have destroyed AcNewsFeedItems");
  models.AcNewsFeedProcessedRange.destroy({ truncate: true }).then(function(results) {
    console.log("Have destroyed AcNewsFeedProcessedRange");
    process.exit();
  });
});



