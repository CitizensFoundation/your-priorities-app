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
        log.info("Done");
        process.exit();
      })
    } else {
      log.error("No community");
      process.exit();
    }
  });
} else {
  log.error("Nothing is done!");
  process.exit();
}