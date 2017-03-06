var models = require('../../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var moment = require('moment');

var id = process.argv[2];
var userIdToPostNewsStory = process.argv[3];

var getTemplateContent = function (templates, title) {
  var returnContent = "Nil";
  if (title) {
    _.forEach(templates, function (template) {
      //  console.log(template);
      if (title==template.title) {
        returnContent = template.content;
      }
    });
  }

  return returnContent;
};

models.BulkStatusUpdate.find({
  where: {
    id: id
  }
}).then(function(update) {
  console.log("Update: "+update.id + " name: "+update.name);
  console.log(update.config);
  console.log(update.templates);

  if (update.config.groups) {
    async.eachSeries(update.config.groups,
      function (group, groupCallback) {
        if (group.posts) {
          async.eachSeries(group.posts, function (post, postCallback) {
//            console.log("New status: "+post.newOfficialStatus+" template: "+post.selectedTemplateName+ " content: "+getTemplateContent(update.templates,post.selectedTemplateName));
            if (post.newOfficialStatus) {
              var templateContent = getTemplateContent(update.templates,post.selectedTemplateName);
              console.log(post.id+": "+getTemplateContent(update.templates,post.selectedTemplateName));
              async.series([
                function (doCallback) {
                  models.User.find({
                    where: {
                      id: userIdToPostNewsStory
                    }
                  }).then(function (user) {
                    if (user) {
                      doCallback();
                    } else {
                      doCallback("User to post from not found!");
                    }
                  });
                },
                function (doCallback) {
                  models.Post.find({
                    where: {
                      id: post.id
                    }
                  }).then(function (postToUpdate) {
                    if (postToUpdate) {
                      postToUpdate.official_status = post.newOfficialStatus;
                      postToUpdate.save().then(function () {
                        doCallback();
                      });
                    } else {
                      doCallback("Cant find post: "+post.id)
                    }
                  });
                },
                function (doCallback) {
                  models.Point.createNewsStory({
                    useragent: { source: 'performBulkUpdateScript' },
                    clientIp: '127.0.0.1',
                    user: { id: userIdToPostNewsStory }
                  }, {
                    subType: 'bulkOperation',
                    post_id: post.id,
                    user_id: userIdToPostNewsStory,
                    point: { content: templateContent }
                  }, function (error) {
                    doCallback(error);
                  })
                }
              ], function (error) {
                postCallback(error);
              });
            } else {
              postCallback();
            }
          }, function (error) {
            groupCallback(error);
          });
        } else {
          groupCallback();
        }
    }, function (error) {
      if (error) {
        console.error(error);
      }
      process.exit();
    });
  }
}).catch(function(error) {
  console.error(error);
});
