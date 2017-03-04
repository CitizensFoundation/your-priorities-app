var models = require('../../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var moment = require('moment');

var id = process.argv[2];

models.BulkStatusUpdate.find({
  where: {
    id: id
  }
}).then(function(update) {
  console.log("Update: "+update.id + " name: "+update.name);
  console.log(update.config);
  if (update.config.groups) {
    _.forEach(update.config.groups, function (group) {
      if (group.posts) {
        _.forEach(group.posts, function (post) {
          console.log("New status: "+post.newOfficialStatus+" template: "+post.selectedTemplateName);
        })
      }
    });
  }
  process.exit();
}).catch(function(error) {
  console.error(error);
});



