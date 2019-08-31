var models = require('../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var csvParser = require('csv-parse');
var fs = require('fs');

var onePostId = process.argv[2];
var toGroupId = process.argv[3];
var csvFileName = process.argv[4];
var userIdToPostNewsStory = process.argv[5];

var reykjavikThinRoddCategoryLookup =
  { "skipulagsmál":3,
    "ýmislegt":4,
    "stjórnsýsla":5,
    "mannréttindi":6,
    "menning og listir":7,
    "íþróttir":8,
    "frítími útivist":9,
    "menntamál":10,
    "umhverfismál":11,
    "ferðamál":12,
    "velferð":13,
    "framkvæmdir":14,
    "samgöngur":15
  };

// This skips status updates

var getContentForOldPost = function (newPostId) {
  return "Þessi hugmynd hefur verið færð í Þín Rödd í ráðum borgarinnar og hægt er að finna hana hér: https://thin-rodd.betrireykjavik.is/post/"+newPostId;
};

var getContentForNewPost = function (oldPostId) {
  return "Þessi hugmynd var færð úr Hverfið mitt 2016 og hægt er að finna hana hér: https://hverfid-mitt-2016.betrireykjavik.is/post/"+oldPostId;
};

var getCategoryIdForPost = function (categoryName) {
  if (categoryName=="umhverfi") {
    categoryName = "umhverfismál";
  } else if (categoryName=="tómstundir") {
    categoryName = "frítími útivist";
  } else if (categoryName=="listir og menning") {
    categoryName = "menning og listir";
  } else if (categoryName=="skipulag") {
    categoryName = "skipulagsmál";
  }

  var id = reykjavikThinRoddCategoryLookup[categoryName];
  if (!id) {
    console.error("Can't find category");
  }
  return id;
};

var getDataFromUrl = function (url, done) {
  var https = require('https');

  var results = "";

  var req = https.request(url, function(res) {
    res.on('data', function(data) {
      results+=data.toString();
    });
    res.on('end', function (d) {
      done(results);
    });
  });
  req.end();};

var copyOnePost = function (groupId, postId, categoryId, done) {
  var group, post, domainId, communityId;
  var domain;
  var newPost;
  var oldPost;
  var skipPointActivitiesIdsForPostCopy = [];

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
        domain = group.Community.Domain;
        callback();
      }).catch(function (error) {
        callback(error);
      });
    },
    function (callback) {
      models.Post.find({
        where: {
          id: postId
        },
        order: [
          [ { model: models.Image, as: 'PostHeaderImages' } ,'updated_at', 'desc' ]
        ],
        include: [
          {
            model: models.Image,
            as: 'PostHeaderImages',
            required: false
          },
          {
            model: models.Image,
            as: 'PostUserImages',
            required: false
          }
        ]
      }).then(function (postIn) {
        oldPost = postIn;
        if (!postIn) {
          console.error("No post in");
          callback("no post");
        } else {
          var postJson = JSON.parse(JSON.stringify(postIn.toJSON()));
          delete postJson['id'];
          postJson.counter_points = 0;
          newPost = models.Post.build(postJson);
          newPost.set('group_id', group.id);
          if (categoryId) {
            newPost.set('category_id', categoryId);
          }
          newPost.save().then(function () {
            newPost.updateAllExternalCounters({ ypDomain: domain }, 'up', 'counter_posts', function () {
              async.series(
                [
                  function (postSeriesCallback) {
                    models.Endorsement.findAll({
                      where: {
                        post_id: oldPost.id
                      }
                    }).then(function (endorsements) {
                      async.eachSeries(endorsements, function (endorsement, endorsementCallback) {
                        var endorsementJson = JSON.parse(JSON.stringify(endorsement.toJSON()));
                        delete endorsementJson.id;
                        var endorsementModel = models.Endorsement.build(endorsementJson);
                        endorsementModel.set('post_id', newPost.id);
                        endorsementModel.save().then(function () {
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
                      async.eachSeries(postRevisions, function (postRevision, postRevisionCallback) {
                        var postRevisionJson =  JSON.parse(JSON.stringify(postRevision.toJSON()));
                        delete postRevisionJson.id;
                        var newPostRevision = models.PostRevision.build(postRevisionJson);
                        newPostRevision.set('post_id', newPost.id);
                        newPostRevision.save().then(function () {
                          postRevisionCallback();
                        });
                      }, function (error) {
                        postSeriesCallback(error);
                      });
                    });
                  },
                  function (postSeriesCallback) {
                    if (oldPost.PostUserImages && oldPost.PostUserImages.length>0) {
                      async.eachSeries(oldPost.PostUserImages, function (userImage, userImageCallback) {
                        newPost.addPostUserImage(userImage).then(function () {
                          userImageCallback();
                        });
                      }, function (error) {
                        postSeriesCallback(error);
                      });
                    } else {
                      postSeriesCallback();
                    }
                  },
                  function (postSeriesCallback) {
                    if (oldPost.PostHeaderImages && oldPost.PostHeaderImages.length>0) {
                      newPost.addPostHeaderImage(oldPost.PostHeaderImages[0]).then(function () {
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
          });
        }
      })
    },
    function (callback) {
      models.Point.findAll({
        where: {
          post_id: postId
        }
      }).then(function (pointsIn) {
        async.eachSeries(pointsIn, function (point, innerSeriesCallback) {
          var pointJson = JSON.parse(JSON.stringify(point.toJSON()));
          var currentOldPoint = point;
          delete pointJson['id'];
          var newPoint = models.Point.build(pointJson);
          newPoint.set('group_id', group.id);
          newPoint.set('community_id', communityId);
          newPoint.set('domain_id', domainId);
          newPoint.set('post_id', newPost.id);
          newPoint.save().then(function () {
            newPost.updateAllExternalCounters({ ypDomain: domain }, 'up', 'counter_points', function () {
              async.series(
                [
                  function (pointSeriesCallback) {
                    models.PointQuality.findAll({
                      where: {
                        point_id: currentOldPoint.id
                      }
                    }).then(function (pointQualities) {
                      async.eachSeries(pointQualities, function (pointQuality, pointQualityCallback) {
                        var pointQualityJson = JSON.parse(JSON.stringify(pointQuality.toJSON()));
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
                        point_id: currentOldPoint.id
                      }
                    }).then(function (pointRevisions) {
                      async.eachSeries(pointRevisions, function (pointRevision, pointRevisionCallback) {
                        var pointRevisionJson = JSON.parse(JSON.stringify(pointRevision.toJSON()));
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
                        point_id: currentOldPoint.id
                      }
                    }).then(function (activities) {
                      async.eachSeries(activities, function (activity, activitesSeriesCallback) {
                        skipPointActivitiesIdsForPostCopy.push(activity.id);
                        var activityJson = JSON.parse(JSON.stringify(activity.toJSON()));
                        delete activityJson.id;
                        var newActivity = models.AcActivity.build(activityJson);
                        newActivity.set('group_id', group.id);
                        newActivity.set('community_id', communityId);
                        newActivity.set('domain_id', domainId);
                        newActivity.set('point_id', newPoint.id);
                        newActivity.save().then(function (results) {
                          console.log("Have changed group and all activity: "+newActivity.id);
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
            });
          })}, function (error) {
            console.log("Have changed group and all for point");
            callback();
          });
      });
    },
    function (callback) {
      models.AcActivity.findAll({
        where: {
          post_id: oldPost.id,
          id: {
            $notIn: skipPointActivitiesIdsForPostCopy
          }
        }
      }).then(function (activities) {
        async.eachSeries(activities, function (activity, innerSeriesCallback) {
          var activityJson = JSON.parse(JSON.stringify(activity.toJSON()));
          delete activityJson.id;
          var newActivity = models.AcActivity.build(activityJson);
          newActivity.set('group_id', group.id);
          newActivity.set('community_id', communityId);
          newActivity.set('domain_id', domainId);
          newActivity.set('post_id', newPost.id);
          newActivity.save().then(function (results) {
            console.log("Have changed group and all activity: "+newActivity.id);
            innerSeriesCallback();
          });
        }, function (error) {
          callback(error);
        })
      });
    },
    function (callback) {
      models.Point.createNewsStory({
        useragent: { source: 'copyPostScript' },
        clientIp: '127.0.0.1',
        user: { id: userIdToPostNewsStory }
      }, {
        subType: 'bulkOperation',
        post_id: oldPost.id,
        user_id: userIdToPostNewsStory,
        point: { content: getContentForOldPost(newPost.id) }
      }, function (error) {
        callback(error);
      })
    },
    function (callback) {
      models.Point.createNewsStory({
        useragent: { source: 'copyPostScript' },
        clientIp: '127.0.0.1',
        user: { id: userIdToPostNewsStory }
      }, {
        subType: 'bulkOperation',
        post_id: newPost.id,
        user_id: userIdToPostNewsStory,
        point: { content: getContentForNewPost(oldPost.id) }
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

var parsePosts = function (allPosts, done) {
  async.eachSeries(allPosts, function (post, seriesCallback) {
    console.log("Post: "+post[0]);
    copyOnePost(toGroupId, getPostIdFromUrl(post[6]), getCategoryIdForPost(post[5]), function (error) {
      seriesCallback(error);
    });
  }, function (error) {
    done(error);
  });
};

var getPostIdFromUrl = function (url) {
  var splitted = url.split('/');
  return splitted[splitted.length-1]
};

var copyManyFromCsv = function (csvUrl, done) {
  getDataFromUrl(csvUrl, function (contents) {
    csvParser(contents, {}, function(err, allPosts) {
      parsePosts(allPosts, done);
    });
  });
};

if (onePostId!='null') {
  copyOnePost(toGroupId, onePostId, null, function (error) {
    if (error)
      console.error(error);
    process.exit();
  });
} else if (csvFileName && userIdToPostNewsStory) {
  copyManyFromCsv(csvFileName, function (error) {
    if (error)
      console.error(error);
    process.exit();
  });
} else {
  console.error("Invalid start state");
  process.exit();
}
