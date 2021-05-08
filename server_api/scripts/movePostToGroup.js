var models = require('../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var fs = require('fs');

var postId = process.argv[2];
var groupId = process.argv[3];

var group, post, communityId, domainId;

async.series([
  function (callback) {
    models.Group.findOne({
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
    }).catch(function (error) {
      callback(error);
    });
  },
  function (callback) {
    models.Post.findOne({
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
    }).catch(function (error) {
      callback(error);
    });
  },
  function (callback) {
    models.Point.findAll({
      where: {
        post_id: post.id,
        status: 'published'
      }
    }).then(function (pointsIn) {
      async.eachSeries(pointsIn, function (point, innerSeriesCallback) {
        point.set('group_id', group.id);
        point.set('community_id', communityId);
        point.set('domain_id', domainId);
        point.save().then(function () {
          console.log("Have changed group and all for point: "+point.id);
          innerSeriesCallback();
        });
      }, function (error) {
        callback(error);
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
    }).catch(function (error) {
      callback(error);
    });
  }
], function (error) {
  if (error) {
   console.error(error);
  } else {
    console.log("Moved post to group", { postId: post.id, groupId: group.id });
  }

  process.exit();
});