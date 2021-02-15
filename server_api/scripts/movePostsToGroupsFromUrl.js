const models = require('../models');
const async = require('async');
const ip = require('ip');
const _ = require('lodash');
const fs = require('fs');
const request = require('request');
const copyCommunityWithEverything = require('../utils/copy_utils').copyCommunityWithEverything;

const urlToConfig = process.argv[1];
const urlToAddAddFront = process.argv[2];

let config;
let finalTargetOutput = '';

const moveOnePost = (postId, groupId, done) => {
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
    finalTargetOutput+="Move postId "+postId+" to "+groupId+"\n";
    finalTargetOutput+=urlToAddAddFront+"/group/"+groupId+"\n\n";
    done(error);
  });
}

async.series([
  (seriesCallback) => {
    const options = {
      url: urlToConfig,
    };

    request.get(options, (error, content) => {
      if (content && content.statusCode!=200) {
        seriesCallback(content.statusCode);
      } else {
        config = content.body;
        seriesCallback();
      }
    });
  },
  (seriesCallback) => {
    async.forEachSeries(config.split('\r\n'), (configLine, forEachCallback) => {
      const splitLine = configLine.split(",");

      if (!configLine || configLine.length < 3 || !splitLine || splitLine.length !== 2) {
        forEachCallback();
      } else {
        const postId = splitLine[0];
        const toGroupId = splitLine[1];
        moveOnePost(postId, toGroupId, forEachCallback);
      }
    });
  },
], error => {
  if (error)
    console.error(error);
  console.log("All done move");
  console.log(finalTargetOutput);
  process.exit();
});
