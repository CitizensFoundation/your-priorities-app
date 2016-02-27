var models = require("../../../models");
var auth = require('../../authorization');
var log = require('../../utils/logger');
var toJson = require('../../utils/to_json');
var async = require('async');

var generateNotifcationsFromNewIdea = function (activity, callback) {

  var userId = activity.object.userId;
  var postId = activity.object.postId;


};

exports = function (activity, callback) {
  if (activity.type=='activity.post.new') {
    generateNotifcationsFromNewIdea(activity, callback);
  }
};
