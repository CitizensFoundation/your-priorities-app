var models = require('../../models/index.cjs');
var async = require('async');
var _ = require('lodash');
var moment = require('moment');
const log = require('../../utils/logger.cjs');

var id = process.argv[2];
var userIdToPostNewsStory = process.argv[3];
var groupId = process.argv[4];

var getTemplate = function (templates, title) {
  var returnTemplate;
  if (title) {
    _.forEach(templates, function (template) {
      //  log.info(template);
      if (title==template.title) {
        returnTemplate = template;
      }
    });
  }
  return returnTemplate;
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
        if (group.id==groupId) {
          if (group.posts) {
            async.eachSeries(group.posts, function (post, postCallback) {
//            log.info("New status: "+post.newOfficialStatus+" template: "+post.selectedTemplateName+ " content: "+getTemplateContent(update.templates,post.selectedTemplateName));
              if (post.newOfficialStatus) {
                var template = getTemplate(update.templates,post.selectedTemplateName);
                var templateContent = template ? template.content : null;
                if (!templateContent && post.uniqueStatusMessage) {
                  templateContent = post.uniqueStatusMessage;
                }
                if (templateContent) {
                  log.info(post.id+": "+templateContent);
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
                          postToUpdate.official_status = post.newOfficialStatus;
                          postToUpdate.save().then(function () {
                            doCallback();
                          });
                        } else {
                          doCallback("ERROR: Cant find post: "+post.id)
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
                        context: (template && template.silentMode===true) ? { silentMode: true } : null,
                        point: { content: templateContent }
                      }, function (error) {
                        doCallback(error);
                      })
                    }
                  ], function (error) {
                    postCallback(error);
                  });
                } else {
                  postCallback("ERROR: No template content for postId: "+post.id);
                }
              } else {
                postCallback();
              }
            }, function (error) {
              groupCallback(error);
            });
          } else {
            log.info("No posts group id: "+group.id);
            groupCallback();
          }
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
