var models = require("../../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var Promise = require('bluebird');
var async = require('async');

var mainActivities = ['activity.post.status.update', 'activity.post.officialStatus.successful',
  'activity.user.new','activity.point.new','activity.post.new', 'activity.post.officialStatus.failed',
  'activity.post.officialStatus.inProgress'];

var filterByMainEvents = function(activities, callback) {
  var resultFeed = [];
  async.eachSeries(activities, function (activity, seriesCallback) {
    if (mainActivities.indexOf(activity.type)) {
      resultFeed.push(activity);
    }
    seriesCallback();
  }, function() {
    callback(null, resultFeed);

  });
};

exports.filter = function (activities, user, callback) {
  filterByMainEvents(activities, function () {

  })
};
