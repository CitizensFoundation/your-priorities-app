var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');

var changePostCounter = function (req, postId, column, upDown, next) {
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
};

var decrementOldCountersIfNeeded = function (req, oldEndorsementValue, postId, endorsement, next) {
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
};

var sendPostOrError = function (res, post, context, user, error, errorStatus) {
  if (error || !post) {
    if (errorStatus == 404) {
      log.warn("Post Not Found", { context: context, post: toJson(post), user: toJson(user), err: error,
        errorStatus: 404 });
    } else {
      log.error("Post Error", { context: context, post: toJson(post), user: toJson(user), err: error,
        errorStatus: errorStatus ? errorStatus : 500 });
    }
    if (errorStatus) {
      res.sendStatus(errorStatus);
    } else {
      res.sendStatus(500);
    }
  } else {
    res.send(post);
  }
};

router.get('/:id', auth.can('view post'), function(req, res) {
  models.Post.find({
    where: { id: req.params.id },
    include: [
      {
        // Category
        model: models.Category,
        required: false,
        include: [
          {
            model: models.Image,
            required: false,
            as: 'CategoryIconImages'
          }
        ]
      },
      // Group
      {
        model: models.Group,
        required: false,
        include: [{
          model: models.Category,
          required: false
        }
        ]
      },
      // User
      {
        model: models.User,
        required: false
      },
      // Image
      {
        model: models.Image,
        required: false,
        as: 'PostHeaderImages'
      },
      // PointRevision
      {
        model: models.PostRevision,
        required: false
      },
      // Point
      { model: models.Point,
        required: false,
        order: 'Point.position DESC',
        include: [
          { model: models.PointRevision ,
            required: false,
            include: [
              { model: models.User,
                attributes: ["id", "name", "facebook_id", "buddy_icon_file_name"],
                required: false
              }
            ]
          },
          { model: models.PointQuality,
            required: false,
            include: [
              { model: models.User,
                attributes: ["id", "name", "facebook_id", "buddy_icon_file_name"],
                required: false
              }
            ]
          }
        ]
      }
    ]
  }).then(function(post) {
    if (post) {
      log.info('Post Viewed', { post: toJson(post), context: 'view', user: toJson(req.user) });
      res.send(post);
    } else {
      sendPostOrError(res, req.params.id, 'view', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendPostOrError(res, null, 'view', req.user, error);
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
    status: 'published',
    content_type: models.Post.CONTENT_IDEA
  });
  post.save().then(function() {
    log.info('Post Created', { post: toJson(post), context: 'create', user: toJson(req.user) });
    post.setupAfterSave(req, res, function () {
      post.updateAllExternalCounters(req, 'up', function () {
        models.Group.addUserToGroupIfNeeded(post.group_id, req, function () {
          post.setupImages(req.body, function (error) {
            sendPostOrError(res, post, 'setupImages', req.user, error);
          })
        })
      })
    });
  }).catch(function(error) {
    sendPostOrError(res, null, 'view', req.user, error);
  });
});

router.put('/:id', auth.can('edit post'), function(req, res) {
  models.Post.find({
    where: {id: req.params.id, user_id: req.user.id }
  }).then(function (post) {
    if (post) {
      post.name = req.body.name;
      post.description = req.body.description;
      post.category_id = req.body.categoryId != "" ? req.body.categoryId : null;
      post.location = req.body.location != "" ? JSON.parse(req.body.location) : null;
      post.cover_media_type = req.body.coverMediaType;
      post.save().then(function () {
        log.info('Post Update', { post: toJson(post), context: 'create', user: toJson(req.user) });
        post.setupImages(req.body, function (err) {
          sendPostOrError(res, post, 'setupImages', req.user, error);
        })
      });
    } else {
      sendPostOrError(res, req.params.id, 'update', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendPostOrError(res, null, 'update', req.user, error);
  });
});

router.delete('/:id', auth.can('edit post'), function(req, res) {
  models.Post.find({
    where: {id: req.params.id, user_id: req.user.id }
  }).then(function (post) {
    post.deleted = true;
    post.save().then(function () {
      log.info('Post Deleted', { post: toJson(post), context: 'delete', user: toJson(req.user) });
      post.updateAllExternalCounters(req, 'down', function () {
        res.sendStatus(200);
      });
    });
  }).catch(function(error) {
    sendPostOrError(res, null, 'delete', req.user, error);
  });
});

router.get('/:id/endorsements', auth.can('view post'), function(req, res) {
  models.Endorsement.findAll({
    where: {post_id: req.params.id, status: 'active'},
    order: "created_at DESC",
    include: [
      { model: models.User,
        attributes: ["id", "name", "facebook_id", "buddy_icon_file_name"]
      }
    ]
  }).then(function(endorsements) {
    if (endorsements) {
      log.info('Endorsements Viewed', { endorsements: toJson(endorsements), context: 'view', user: toJson(req.user) });
      res.send(endorsements);
    } else {
      log.warn("Endorsements Not found", { context: 'view', post: toJson(post), user: toJson(req.user),
        err: error, errorStatus: 404 });
    }
  }).catch(function(error) {
    log.error("Endorsements Error", { context: 'view', endorsements: req.params.id, user: toJson(req.user),
      err: error, errorStatus: 500 });
  });
});

router.post('/:id/endorse', auth.isLoggedIn, auth.can('vote on post'), function(req, res) {
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
      log.info('Endorsements Created', { endorsement: toJson(endorsement), context: 'create', user: toJson(req.user) });
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
          log.error("Endorsements Error State", { context: 'create', endorsement: toJson(endorsement), user: toJson(req.user),
                                                  err: error, errorStatus: 500 });
          res.sendStatus(500);
        }
      });
    });
  }).catch(function(error) {
    log.error("Endorsements Error", { context: 'create', post: req.params.id, user: toJson(req.user),
                                      err: error, errorStatus: 500 });
    res.sendStatus(500);
  });
});

router.delete('/:id/endorse', auth.isLoggedIn, auth.can('vote on post'), function(req, res) {
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
      //endorsement.deleted = true;
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
          console.error("Strange state of endorsements");
          log.error("Endorsement Strange state", { context: 'delete', post: req.params.id, user: toJson(req.user),
                                                   err: "Strange state of endorsements", errorStatus: 500 });
          res.sendStatus(500);
        }
      });
    } else {
      log.error("Endorsement Not found", { context: 'delete', post: req.params.id, user: toJson(req.user),
                                           err: error, errorStatus: 404 });
      res.sendStatus(404);
    }
  }).catch(function(error) {
    log.error("Endorsements Error", { context: 'delete', post: req.params.id, user: toJson(req.user),
                                      err: error, errorStatus: 500 });
    res.sendStatus(500);
  });
});

module.exports = router;
