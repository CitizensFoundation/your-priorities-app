var models = require('../models/index.cjs');
var async = require('async');
var _ = require('lodash');

var groupId = process.argv[2];

const deletePostEndorsements = (postId, callback) => {
  models.Endorsement.findAll({
    attributes: ['id', 'post_id', 'deleted','value'],
    where: {
      post_id: postId
    },
    include: [
      {
        model: models.Post,
        attributes: ['id', 'counter_endorsements_up', 'counter_endorsements_down']
      }
    ]
  }).then(function (endorsements) {
    async.forEach(endorsements, function (endorsement, forEachCallback) {
      endorsement.deleted = true;
      endorsement.save().then(function () {
        forEachCallback();
      }).catch((error) => {
        forEachCallback(error);
      });
    }, function (error) {
      if (error) {
        callback(error);
      } else {
        console.log('User Endorsements Deleted', { context: 'ac-delete', postId: postId});
        callback();
      }
    });
  }).catch((error) => {
    callback(error);
  });
};


models.Post.findAll({
  where: {
    group_id: groupId
  }
}).then(function (posts) {
  async.forEach(posts, (post, forEachCallback) => {
    post.counter_endorsements_up = 0;
    post.counter_endorsements_down = 0;
    post.save().then(() => {
      deletePostEndorsements(post.id, forEachCallback);
    });
  }, (error) => {
    if (error) {
      console.error(error);
    }
    console.log("Completed reset of endorsements for group: "+groupId);
    process.exit();
  });
});


