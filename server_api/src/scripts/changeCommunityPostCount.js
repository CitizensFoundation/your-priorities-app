var models = require('../models/index.cjs');
var async = require('async');
var _ = require('lodash');

const communityId = process.argv[2];
const postCount = process.argv[3];

if (communityId && postCount) {
  models.Community.findOne({
    where: {
      id: communityId
    },
    attributes: ['id','counter_posts']
  }).then((community)=>{
    if (community) {
      community.counter_posts = postCount;
      community.save().then(()=> {
        console.log("Done");
        process.exit();
      })
    } else {
      console.error("No community");
      process.exit();
    }
  });
} else {
  console.error("Nothing is done!");
  process.exit();
}