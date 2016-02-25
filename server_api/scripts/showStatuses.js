var models = require('../models');
var async = require('async');
var ip = require('ip');


models.Post.findAll().then(function(posts) {
  async.eachSeries(posts, function (post, callback) {
    if (post.official_status!=0) {
      console.log(post.official_status);
      console.log(post.group_id);
    }
    if (post.status!='published') {
      console.log(post.status);
    }
    callback();
  }, function done() {
    console.log("DONE");
  });
});




