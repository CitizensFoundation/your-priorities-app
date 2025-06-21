var models = require('../../models/index.cjs');
var async = require('async');
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

log.info(statusesToUse);

const otherIds = [];
if (alsoDoIds) {
  const splitIds = alsoDoIds.split(",");
  if (splitIds.length>0) {
    for (let i=0;i<splitIds.length;i++) {
      otherIds.push(parseInt(splitIds[i]));
    }
  }
}

log.info(otherIds);

var getTemplateContent = function (templates, title) {
  var returnContent;
  if (title) {
    _.forEach(templates, function (template) {
      //  log.info(template);
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
  log.info("Update: "+update.id + " name: "+update.name);
  log.info(update.config);
  log.info(update.templates);

  if (update.config.groups) {
    async.eachSeries(update.config.groups,
      function (group, groupCallback) {
        if (group.posts) {
          async.eachSeries(group.posts, function (post, postCallback) {
//            log.info("New status: "+post.newOfficialStatus+" template: "+post.selectedTemplateName+ " content: "+getTemplateContent(update.templates,post.selectedTemplateName));
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
                          log.info(`Performing for ${postToUpdate.official_status}`);
                          postToUpdate.official_status = post.newOfficialStatus;
                          log.info(post.id+": "+templateContent);
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
                          log.error("Not processing post with status: "+postToUpdate.official_status);
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
                log.info("WARNING: No template content for postId: "+post.id);
                postCallback();
              }
            } else {
              postCallback();
            }
          }, function (error) {
            groupCallback(error);
          });

        } else {
          log.info("Not performing group id: "+group.id);
          groupCallback();
        }
    }, function (error) {
      if (error) {
        log.error(error);
      }
      log.info("Bulk status update has been applied.");
      process.exit();
    });
  }
}).catch(function(error) {
  log.error(error);
});
