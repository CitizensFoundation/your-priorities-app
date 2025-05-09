var models = require('../models/index.cjs');
var async = require('async');
var _ = require('lodash');

const groupId = process.argv[2];
const postCount = process.argv[3];

if (groupId && postCount) {
  models.Group.findOne({
    where: {
      id: groupId
    },
    attributes: ['id','counter_posts']
  }).then((group)=>{
    if (group) {
      group.counter_posts = postCount;
      group.save().then(()=> {
        console.log("Done");
        process.exit();
      })
    } else {
      console.error("No group");
      process.exit();
    }
  });
} else {
  console.error("Nothing is done!");
  process.exit();
}