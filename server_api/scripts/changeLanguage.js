var models = require('../models/index.cjs');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');

const modelType = process.argv[2];
const modelId = process.argv[3];
const language = process.argv[4];

if (modelType==="post") {
  models.Post.findOne({
    where: {
      id: modelId
    },
    attributes: ['id','language']
  }).then((post)=>{
    if (post) {
      post.language = language;
      post.save().then(()=> {
        console.log("Done");
        process.exit();
      })
    } else {
      console.error("No post");
      process.exit();
    }
  });
} else if (modelType==="point") {
  models.Point.findOne({
    where: {
      id: modelId
    },
    attributes: ['id','language']
  }).then((point)=>{
    if (point) {
      point.language = language;
      point.save().then(()=> {
        console.log("Done");
        process.exit();
      })
    } else {
      console.error("No point");
      process.exit();
    }
  });
} else {
  process.exit();
}