var models = require('../models/index.cjs');
var async = require('async');

var communityId = process.argv[2];

models.Post.findAll({
  where: {
    data: {
      $ne: null
    }
  },
  attribute: ['id', 'data'],
  include: [
    {
      model: models.Group,
      attribues: ['id', 'community_id'],
      required: true,
      include: [
        {
          model: models.Community,
          where: { id: communityId },
          attributes: ['id'],
          required: true
        }
      ]
    }
  ]
}).then((posts) => {
  if (posts && posts.length>0) {
    async.forEach(posts, (post, seriesCallback) => {
      post.set("data.contact", {});
      post.save().then(() => {
        seriesCallback();
      }).catch((error) => {
        seriesCallback(error);
      });
    }, (error) => {
      if (error) {
        console.error(error);
      } else {
        console.info("Have updated "+posts.length+" posts");
      }
      process.exit();
    });
  } else {
    console.log("No posts found for community");
    process.exit();
  }
}).catch((error) => {
  console.error(error);
  process.exit();
});
