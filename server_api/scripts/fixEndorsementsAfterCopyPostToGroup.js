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

var fixOnePost = function (groupId, postId, done) {
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
          models.Post.find({
            where: {
              user_id: oldPost.user_id,
              name: oldPost.name,
              created_at: oldPost.created_at,
              id: {
                $ne: oldPost.id
              }
            }
          }).then(function (newPostIn) {
            newPost = newPostIn;
            if (newPost) {
              async.series(
                [
                  function (postSeriesCallback) {
                    models.Endorsement.findAll({
                      where: {
                        post_id: oldPost.id
                      }
                    }).then(function (endorsements) {
                      async.eachSeries(endorsements, function (endorsement, endorsementCallback) {
                        models.Endorsement.find({
                          where: {
                            post_id: newPost.id,
                            user_id: endorsement.user_id
                          }
                        }).then(function (alreadyUpdatedEndorsement) {
                          if (alreadyUpdatedEndorsement) {
                            console.warn("Already updated endorsement");
                            endorsementCallback();
                          } else {
                            var endorsementJson = JSON.parse(JSON.stringify(endorsement.toJSON()));
                            delete endorsementJson.id;
                            var endorsementModel = models.Endorsement.build(endorsementJson);
                            endorsementModel.set('post_id', newPost.id);
                            endorsementModel.save().then(function () {
                              endorsementCallback();
                            });
                          }
                        });
                      }, function (error) {
                        postSeriesCallback(error);
                      });
                    });
                  }
                ], function (error) {
                  console.log("Have fixed post to group id");
                  callback(error);
                });
            } else {
              console.error("Did not find post");
              callback();
            }
          }).catch(function (error) {
            callback(error);
          });
        }
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
    fixOnePost(toGroupId, getPostIdFromUrl(post[6]), function (error) {
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
