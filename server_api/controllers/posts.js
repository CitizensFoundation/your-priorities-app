var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');

function changePostCounter(req, postId, column, upDown, next) {
  models.Post.find({
    where: { id: postId }
  }).then(function(post) {
    if (post && upDown === 1) {
      post.increment(column);
    } else if (post && upDown === -1) {
      post.decrement(column);
    }
    models.Group.addUserToGroupIfNeeded(post.group_id, req, function () {
      next();
    });
  });
}

function decrementOldCountersIfNeeded(req, oldEndorsementValue, postId, endorsement, next) {
  if (oldEndorsementValue) {
    if (oldEndorsementValue>0) {
      changePostCounter(req, postId, 'counter_endorsements_up', -1, function () {
        next();
      })
    } else if (oldEndorsementValue<0) {
      changePostCounter(req, postId, 'counter_endorsements_down', -1, function () {
        next();
      })
    } else {
      console.error("Strange state of endorsements");
      next();
    }
  } else {
    next();
  }
}

router.get('/:id/endorsements', auth.can('view post'), function(req, res) {
  console.log("ID Endorsements");
  models.Endorsement.findAll({
    where: {post_id: req.params.id, status: 'active'},
    order: "created_at DESC",
    include: [
      { model: models.User,
        attributes: ["id", "name", "facebook_uid", "buddy_icon_file_name"]
      }
    ]
  }).then(function(endorsements) {
    res.send(endorsements);
  });
});

router.get('/:id', auth.can('view post'), function(req, res) {
  models.Post.find({
    where: { id: req.params.id },
    include: [
      {
        model: models.Category,
        include: [
          {
            model: models.Image,
            as: 'CategoryIconImages'
          }
        ]
      },
      {
        model: models.Group,
        include: [
          models.Category
        ]
      },
      models.User,
      {
        model: models.Image,
        as: 'PostHeaderImages'
      },
      models.PostRevision,
      { model: models.Point,
        order: 'Point.position DESC',
        include: [
          { model: models.PointRevision ,
            include: [
              { model: models.User, attributes: ["id", "name", "facebook_uid", "buddy_icon_file_name"] }
            ]
          },
          { model: models.PointQuality ,
            include: [
              { model: models.User, attributes: ["id", "name", "facebook_uid", "buddy_icon_file_name"] }
            ]
          }
        ]
      }
    ]
  }).then(function(post) {
    res.send(post);
  });
});

router.post('/:groupId', auth.can('create post'), function(req, res) {
  var post = models.Post.build({
    name: req.body.name,
    description: req.body.description,
    group_id: req.params.groupId,
    category_id: req.body.categoryId != "" ? req.body.categoryId : null,
    location: req.body.location != "" ? JSON.parse(req.body.location) : null,
    cover_media_type: req.body.coverMediaType,
    user_id: req.user.id,
    status: 'published'
  });
  post.save().then(function() {
    post.setupAfterSave(req, res, function () {
      post.updateAllExternalCounters(req, 'up', function () {
        models.Group.addUserToGroupIfNeeded(post.group_id, req, function () {
          post.setupImages(req.body, function (err) {
            if (err) {
              res.sendStatus(403);
              console.error(err);
            } else {
              res.send(post);
            }
          })
        })
      })
    });
  });
});

router.put('/:id', auth.can('edit post'), function(req, res) {
  models.Post.find({
    where: {id: req.params.id, user_id: req.user.id }
  }).then(function (post) {
    post.name = req.body.name;
    post.description = req.body.description;
    post.category_id = req.body.categoryId != "" ? req.body.categoryId : null;
    post.location = req.body.location != "" ? JSON.parse(req.body.location) : null;
    post.cover_media_type = req.body.coverMediaType;
    post.save().then(function () {
      post.setupImages(req.body, function (err) {
        if (err) {
          res.sendStatus(403);
          console.error(err);
        } else {
          res.send(post);
        }
      })
    });
  });
});

router.post('/:id/endorse', auth.can('vote on post'), function(req, res) {
  models.Endorsement.find({
    where: {
      post_id: req.params.id,
      user_id: req.user.id
    },
    include: [
        models.Post
    ]
  }).then(function(endorsement) {
    var oldEndorsementValue;
    if (endorsement) {
      if (endorsement.value>0)
        oldEndorsementValue = 1;
      else if (endorsement.value<0)
        oldEndorsementValue = -1;
      endorsement.value = req.body.value;
      endorsement.status = 'active';
    } else {
      endorsement = models.Endorsement.build({
        post_id: req.params.id,
        value: req.body.value,
        user_id: req.user.id,
        status: 'active'
      })
    }
    endorsement.save().then(function() {
      decrementOldCountersIfNeeded(req, oldEndorsementValue, req.params.id, endorsement, function () {
        if (endorsement.value>0) {
          changePostCounter(req, req.params.id, 'counter_endorsements_up', 1, function () {
            res.send({ endorsement: endorsement, oldEndorsementValue: oldEndorsementValue });
          })
        } else if (endorsement.value<0) {
          changePostCounter(req, req.params.id, 'counter_endorsements_down', 1, function () {
            res.send({ endorsement: endorsement, oldEndorsementValue: oldEndorsementValue });
          })
        } else {
          console.error("Strange state of endorsements");
          res.status(500);
        }
      });
    });
  });
});

router.delete('/:id/endorse', auth.can('vote on post'), function(req, res) {
  console.log("user: "+req.user.id + " post: " + req.params.id);
  models.Endorsement.find({
    where: { post_id: req.params.id, user_id: req.user.id }
  }).then(function(endorsement) {
    if (endorsement) {
      var oldEndorsementValue;
      if (endorsement.value>0)
        oldEndorsementValue = 1;
      else if (endorsement.value<0)
        oldEndorsementValue = -1;
      endorsement.value = 0;
      endorsement.save().then(function() {
        if (oldEndorsementValue>0) {
          changePostCounter(req, req.params.id, 'counter_endorsements_up', -1, function () {
            res.status(200).send({ endorsement: endorsement, oldEndorsementValue: oldEndorsementValue });
          })
        } else if (oldEndorsementValue<0) {
          changePostCounter(req, req.params.id, 'counter_endorsements_down', -1, function () {
            res.status(200).send({ endorsement: endorsement, oldEndorsementValue: oldEndorsementValue });
          })
        } else {
          console.error("Strange state of endorsements")
          res.status(200).send({ endorsement: endorsement, oldEndorsementValue: oldEndorsementValue });
        }
      });
    } else {
      console.error("Can't find endorsement to delete");
      res.sendStatus(500);
    }
  });
});

router.delete('/:id', auth.can('edit post'), function(req, res) {
  models.Post.find({
    where: {id: req.params.id, user_id: req.user.id }
  }).then(function (post) {
    post.deleted = true;
    post.save().then(function () {
      post.updateAllExternalCounters(req, 'down', function () {
        res.sendStatus(200);
      });
    });
  });
});

module.exports = router;
