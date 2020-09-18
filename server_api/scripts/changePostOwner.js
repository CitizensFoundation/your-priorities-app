var models = require('../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');

const postId = process.argv[2];
const userId = process.argv[3];

if (postId && userId) {
  models.Post.findOne({
    where: {
      id: postId
    },
    attributes: ['id','user_id']
  }).then((post)=>{
    if (post) {
      post.user_id = userId;
      post.save().then(()=> {
        console.log("Done");
        process.exit();
      })
    } else {
      console.error("No post");
      process.exit();
    }
  });
} else {
  console.error("Nothing is done!");
  process.exit();
}