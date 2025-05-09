var models = require('../models/index.cjs');
var async = require('async');
var _ = require('lodash');

const postId = process.argv[2];
const officialStatus = process.argv[3];

if (postId && officialStatus) {
  models.Post.findOne({
    where: {
      id: postId
    },
    attributes: ['id','user_id','official_status']
  }).then((post)=>{
    if (post) {
      post.official_status = officialStatus;
      post.save().then(()=> {
        console.log("Done changing status: "+officialStatus);
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