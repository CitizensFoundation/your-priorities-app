const models = require('../models/index.cjs');
const async = require('async');
const _ = require('lodash');
const randomWords = require('random-words');

const groupId = process.argv[2];
let addedPosts = 0;

async.doUntil( (innerCallback)  => {
  models.Post.create({
    name: randomWords({ min: 5, max: 11 }).join(" "),
    description: randomWords({ min: 10, max: 110 }).join(" "),
    status: 'published',
    official_status: 0,
    language: 'en',
    group_id: groupId,
    content_type: models.Post.CONTENT_IDEA,
    user_agent: "script",
    ip_address: ip.address()
  }).then((post) => {
    addedPosts += 1;
    console.log("Added post id: "+post.id);
    innerCallback();
  })
}, () => addedPosts>5000, (error) => {
  console.error(error);
  process.exit();
});
