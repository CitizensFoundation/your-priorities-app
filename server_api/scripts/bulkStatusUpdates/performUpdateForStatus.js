var models = require('../../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var moment = require('moment');

const id = process.argv[2];
const userIdToPostNewsStory = process.argv[3];
const statusesToProcess = process.argv[4];
const alsoDoIds = process.argv[5];

const statusesToUse = [];
const splitStatuses = statusesToProcess.split(",");
if (splitStatuses.length>0) {
  for (let i=0;i<splitStatuses.length;i++) {
    statusesToUse.push(parseInt(splitStatuses[i]));
  }
}

console.log(statusesToUse);

const otherIds = [];
if (alsoDoIds) {
  const splitIds = alsoDoIds.split(",");
  if (splitIds.length>0) {
    for (let i=0;i<splitIds.length;i++) {
      otherIds.push(parseInt(splitIds[i]));
    }
  }
}

console.log(otherIds);

var getTemplateContent = function (templates, title) {
  var returnContent;
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

models.BulkStatusUpdate.findOne({
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
              if (!templateContent && post.uniqueStatusMessage) {
                templateContent = post.uniqueStatusMessage;
              }
              if (templateContent) {
                async.series([
                  function (doCallback) {
                    models.User.findOne({
                      where: {
                        id: userIdToPostNewsStory
                      }
                    }).then(function (user) {
                      if (user) {
                        doCallback();
                      } else {
                        doCallback("ERROR: User to post from not found!");
                      }
                    });
                  },
                  function (doCallback) {
                    models.Post.findOne({
                      where: {
                        id: post.id
                      }
                    }).then(function (postToUpdate) {
                      if (postToUpdate) {
                        if (statusesToUse.indexOf(postToUpdate.official_status)>-1 ||
                            otherIds.indexOf(postToUpdate.id)>-1) {
                          console.log(`Performing for ${postToUpdate.official_status}`);
                          postToUpdate.official_status = post.newOfficialStatus;
                          console.log(post.id+": "+templateContent);
                          postToUpdate.save().then(function () {
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
                          });
                        } else {
                          console.error("Not processing post with status: "+postToUpdate.official_status);
                          doCallback();
                        }
                      } else {
                        doCallback("ERROR: Cant find post: "+post.id)
                      }
                    });
                  },
                ], function (error) {
                  postCallback(error);
                });
              } else {
                console.log("WARNING: No template content for postId: "+post.id);
                postCallback();
              }
            } else {
              postCallback();
            }
          }, function (error) {
            groupCallback(error);
          });

        } else {
          console.log("Not performing group id: "+group.id);
          groupCallback();
        }
    }, function (error) {
      if (error) {
        console.error(error);
      }
      console.log("Bulk status update has been applied.");
      process.exit();
    });
  }
}).catch(function(error) {
  console.error(error);
});
