var models = require('../models');
var async = require('async');
var ip = require('ip');


models.AcNewsFeedItem.destroy({ truncate: true }).then(function(results) {
  var a = 3;
});

models.AcNewsFeedProcessedRange.destroy({ truncate: true }).then(function(results) {
  var a = 3;
});


