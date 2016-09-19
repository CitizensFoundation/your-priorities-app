var models = require('../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');

var postId = process.argv[2];
var groupId = process.argv[3];
var group, post, domainId, communityId;

async.series([
  function (callback) {
    models.Group.find({
      where: {
        id: groupId
      },
      include: [
        {
          model: models.Community,
          required: true,
          include: [
            {
              model: models.Domain,
              required: true
            }
          ]
        }
      ]
    }).then(function (groupIn) {
      group = groupIn;
      communityId = group.Community.id;
      domainId = group.Community.Domain.id;
      callback();
    });
  },
  function (callback) {
    models.Post.find({
      where: {
        id: postId
      }
    }).then(function (postIn) {
      post = postIn;
      post.set('group_id', group.id);
      post.save().then(function (results) {
        console.log("Have changed group id");
        callback();
      });
    })
  },
  function (callback) {
    models.AcActivity.findAll({
      where: {
        post_id: post.id
      }
    }).then(function (activities) {
      async.eachSeries(activities, function (activity, innerSeriesCallback) {
        activity.set('group_id', group.id);
        activity.set('community_id', communityId);
        activity.set('domain_id', domainId);
        activity.save().then(function (results) {
          console.log("Have changed group and all: "+activity.id);
          innerSeriesCallback();
        });
      }, function (error) {
        callback();
      })
    });
  }
], function (error) {
  console.log("Done");
  process.exit();
});