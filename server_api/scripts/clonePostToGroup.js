var models = require('../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var csvParser = require('csv-parse');
var fs = require('fs');

var onePostId = process.argv[2];
var oneGroupId = process.argv[3];
var csvFileName = process.argv[4];
var userIdToPostNewsStory = process.argv[5];

var reykjavikThinRoddCategoryLookup =
  { 3: "skipulagsmál",
    4: "ýmislegt",
    5: "stjórnsýsla",
    6: "mannréttindi",
    7: "menning og listir",
    8: "íþróttir",
    9: "frítími og útivist",
    10: "menntamál",
    11: "umhverfismál",
    12: "ferðamál",
    13: "velferð",
    14: "framkvæmdir",
    15: "samgöngur"
  };

// This skips status updates

var getContentForOldPost = function (newPostId) {
  return "Þessi hugmynd hefur verið færð í Þín Rödd í ráðum borgarinnar og hægt er að finna hana hér: https://thin-rodd.betrireykjavik.is/post/"+newPostId;
};

var getContentForNewPost = function (oldPostId) {
  return "Þessi hugmynd var upphaflega send inn í Hverfið mitt 2016 og hægt er að finna hana hér: https://hverfid-mitt-2016.betrireykjavik.is/post/"+oldPostId;
};

var cloneOnePost = function (groupId, postId, categoryId, done) {
  var group, post, domainId, communityId;
  var newPost;
  var oldPost;

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
        },
        order: [
          [ { model: models.Image, as: 'PostHeaderImages' } ,'updated_at', 'asc' ]
        ],
        include: [
          {
            model: models.Image,
            as: 'PostHeaderImages',
            required: false
          }
        ]
      }).then(function (postIn) {
        oldPost = postIn;
        var postJson = postIn.toJSON();
        delete postJson['id'];
        newPost = models.Post.build(postJson);
        newPost.set('group_id', group.id);
        if (categoryId) {
          newPost.set('category_id', categoryId);
        }
        newPost.save().then(function () {
          async.series(
            [
              function (postSeriesCallback) {
                models.Endorsement.findAll({
                  where: {
                    post_id: oldPost.id
                  }
                }).then(function (endorsements) {
                  async.forEach(endorsements, function (endorsement, endorsementCallback) {
                    var endorsementJson = endorsement.toJSON();
                    delete endorsementJson.id;
                    var newPointQuality = models.PointQuality.build(endorsementJson);
                    newPointQuality.set('post_id', newPost.id);
                    newPointQuality.save().then(function () {
                      endorsementCallback();
                    });
                  }, function (error) {
                    postSeriesCallback(error);
                  });
                });
              },
              function (postSeriesCallback) {
                models.PostRevision.findAll({
                  where: {
                    post_id: oldPost.id
                  }
                }).then(function (postRevisions) {
                  async.forEach(postRevisions, function (postRevision, postRevisionCallback) {
                    var postRevisionJson = postRevision.toJSON();
                    delete postRevisionJson.id;
                    var newPointRevision = models.PostRevision.build(postRevisionJson);
                    newPointRevision.set('post_id', newPost.id);
                    newPointRevision.save().then(function () {
                      postRevisionCallback();
                    });
                  }, function (error) {
                    postSeriesCallback(error);
                  });
                });
              },
              function (postSeriesCallback) {
                if (oldPost.PostHeaderImages && oldPost.PostHeaderImages.length>0) {
                  newPost.addPostHeaderImage(oldPost.PostHeaderImages[0]).then(function (error) {
                    postSeriesCallback()
                  });
                } else {
                  postSeriesCallback()
                }
              }
            ], function (error) {
              console.log("Have copied post to group id");
              callback(error);
            });
        });
      })
    },
    function (callback) {
      models.Point.findAll({
        where: {
          post_id: postId
        }
      }).then(function (pointsIn) {
        async.eachSeries(pointsIn, function (point, innerSeriesCallback) {
          var pointJson = point.toJSON();
          delete pointJson['id'];
          var newPoint = models.Point.build(pointJson);
          newPoint.set('group_id', group.id);
          newPoint.set('community_id', communityId);
          newPoint.set('domain_id', domainId);
          newPoint.set('post_id', newPost.id);
          newPoint.save().then(function () {
            async.series(
              [
                function (pointSeriesCallback) {
                  models.PointQuality.findAll({
                    where: {
                      point_id: point.id
                    }
                  }).then(function (pointQualities) {
                    async.forEach(pointQualities, function (pointQuality, pointQualityCallback) {
                      var pointQualityJson = pointQuality.toJSON();
                      delete pointQualityJson.id;
                      var newPointQuality = models.PointQuality.build(pointQualityJson);
                      newPointQuality.set('point_id', newPoint.id);
                      newPointQuality.save().then(function () {
                        pointQualityCallback();
                      });
                    }, function (error) {
                     pointSeriesCallback(error);
                    });
                  });
                },
                function (pointSeriesCallback) {
                  models.PointRevision.findAll({
                    where: {
                      point_id: point.id
                    }
                  }).then(function (pointRevisions) {
                    async.forEach(pointRevisions, function (pointRevision, pointRevisionCallback) {
                      var pointRevisionJson = pointRevision.toJSON();
                      delete pointRevisionJson.id;
                      var newPointRevision = models.PointRevision.build(pointRevisionJson);
                      newPointRevision.set('point_id', newPoint.id);
                      newPointRevision.save().then(function () {
                        pointRevisionCallback();
                      });
                    }, function (error) {
                      pointSeriesCallback(error);
                    });
                  });
                },
                function (pointSeriesCallback) {
                  models.AcActivity.findAll({
                    where: {
                      point_id: pointIn.id
                    }
                  }).then(function (activities) {
                    async.eachSeries(activities, function (activity, activitesSeriesCallback) {
                      var activityJson = activity.toJSON();
                      delete activityJson.id;
                      var newActivity = models.AcActivity.build(activityJson);
                      newActivity.set('group_id', group.id);
                      newActivity.set('community_id', communityId);
                      newActivity.set('domain_id', domainId);
                      newActivity.set('point_id', newPoint.id);
                      newActivity.save().then(function (results) {
                        console.log("Have changed group and all activity: "+activity.id);
                        activitesSeriesCallback();
                      });
                    }, function (error) {
                      pointSeriesCallback(error);
                    })
                  });
                }
              ], function (error) {
                innerSeriesCallback(error);
              });
          })}, function (error) {
            console.log("Have changed group and all for point: "+point.id);
            callback();
          });
      });
    },
    function (callback) {
      models.AcActivity.findAll({
        where: {
          post_id: oldPost.id
        }
      }).then(function (activities) {
        async.eachSeries(activities, function (activity, innerSeriesCallback) {
          var activityJson = activity.toJSON();
          delete activityJson.id;
          var newActivity = models.AcActivity.build(activityJson);
          newActivity.set('group_id', group.id);
          newActivity.set('community_id', communityId);
          newActivity.set('domain_id', domainId);
          newActivity.set('post_id', newPost.id);
          newActivity.save().then(function (results) {
            console.log("Have changed group and all activity: "+activity.id);
            innerSeriesCallback(error);
          });
        }, function (error) {
          callback(error);
        })
      });
    },
    function (callback) {
      models.Point.createNewsStory({
        useragent: { source: 'clonePostScript' },
        clientIp: '127.0.0.1',
        user: { id: userIdToPostNewsStory }
      }, {
        post_id: oldPost.id,
        user_id: userIdToPostNewsStory,
        content: getContentForOldPost(newPost.id)
      }, function (error) {
        callback(error);
      })
    },
    function (callback) {
      models.Point.createNewsStory({
        useragent: { source: 'clonePostScript' },
        clientIp: '127.0.0.1',
        user: { id: userIdToPostNewsStory }
      }, {
        post_id: newPost.id,
        user_id: userIdToPostNewsStory,
        content: getContentForNewPost(post.id)
      }, function (error) {
        callback(error);
      })
    }
  ], function (error) {
    console.log("Done");
    if (error)
      console.error(error);
    done(error);
  })
};

var getPostIdFromUrl = function (url) {
  var splitted = url.split('/');
  return splitted[splitted.length-1]
};

var moveManyFromCsv = function (csvFileName, done) {
  fs.readFile(csvFileName, 'utf8', function(error, contents) {
    console.log(contents);
    if (!error) {
      csvParser(contents, {}, function(err, allPosts) {
        async.forEach(allPosts, function (post, seriesCallback) {
          moveOnePost(getPostIdFromUrl(post[0]), post[1], post[2], function (error) {
            seriesCallback(error);
          });
        }, function (error) {
          done(error);
        });
      });
    } else {
      done(error);
    }
  });
};

if (onePostId!='null') {
  moveOnePost(oneGroupId, onePostId, null, function (error) {
    if (error)
      console.error(error);
    process.exit();
  });
} else if (csvFileName && userIdToPostNewsStory) {
  moveManyFromCsv(csvFileName, function (error) {
    if (error)
      console.error(error);
    process.exit();
  });
} else {
  console.error("Invalid start state");
  process.exit();
}
