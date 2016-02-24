var models = require('../models');
var async = require('async');
var ip = require('ip');


models.Post.findAll().then(function(posts) {
  async.eachSeries(posts, function (post, callback) {
    console.log(post.official_status);
    if (post.status!='published') {
      console.log(post.status);
    }
    callback();
  }, function done() {
    console.log("DONE");
  });
});




