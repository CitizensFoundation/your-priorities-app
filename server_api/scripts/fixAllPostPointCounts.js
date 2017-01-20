var models = require('../models');
var async = require('async');
var ip = require('ip');

var postsCount = 0;
models.Post.findAll({}).then(function (posts) {
  async.eachSeries(posts, function (post, callback) {
    postsCount+=1;
    models.Point.count({
      where: {
        post_id: post.id
      }
    }).then(function (count) {
      post.set('counter_points', count);
      post.save().then(function (results) {
        callback();
      });
    });
  }, function (error) {
    console.log("Done updating posts: "+postsCount);
    process.exit();
  });
});

