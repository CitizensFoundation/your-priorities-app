var models = require('../models/index.cjs');
var async = require('async');
const communityId = process.argv[2];
const newOfficialStatus = parseInt(process.argv[3]);

var postsCount = 0;
models.Post.findAll({
  attributes: ['id','official_status'],
  include: [
    {
      model: models.Group,
      attributes: ['id'],
      required: true,
      include: [
        {
          model: models.Community,
          where: {
            id: communityId
          }
        }
      ]
    }
  ]
}).then(function (posts) {
  async.eachSeries(posts, function (post, callback) {
    postsCount++;
    post.set('official_status', newOfficialStatus);
    post.save().then(function (results) {
      callback();
    });
  }, function (error) {
    console.log("Done updating official status for posts: "+postsCount);
    process.exit();
  });
});

