var models = require('../models/index.cjs');
var async = require('async');
var _ = require('lodash');

var groupId = process.argv[2];

models.Post.findAll({
  where: {
    group_id: groupId,
    category_id: null
  }
}).then(function (posts) {
  log.info("Found "+posts.length+" post without category");
  _.each(posts, function (post) {
    log.info(post.id)
  });
  process.exit();
});

