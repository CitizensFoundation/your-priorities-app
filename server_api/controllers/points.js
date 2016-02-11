var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');

var changePointCounter = function (pointId, column, upDown, next) {
  models.Point.find({
    where: { id: pointId }
  }).then(function(point) {
    if (point && upDown===1) {
      point.increment(column).then(function(){
        next();
      });
    } else if (point && upDown===-1) {
      point.decrement(column).then(function(){
        next();
      });
    } else {
      next();
    }
  });
};

var decrementOldPointQualityCountersIfNeeded = function (oldPointQualityValue, pointId, pointQuality, next) {
  if (oldPointQualityValue) {
    if (oldPointQualityValue>0) {
      changePointCounter(pointId, 'counter_quality_up', -1, function () {
        next();
      })
    } else if (oldPointQualityValue<0) {
      changePointCounter(pointId, 'counter_quality_down', -1, function () {
        next();
      })
    } else {
      console.error("Strange state of pointQualities");
      next();
    }
  } else {
    next();
  }
};

var sendPointOrError = function (res, point, context, user, error, errorStatus) {
  if (error || !point) {
    if (errorStatus == 404) {
      log.warn("Point Not Found", { context: context, point: toJson(point), user: toJson(user), err: error,
                                       errorStatus: 404 });
    } else {
      log.error("Point Error", { context: context, point: toJson(point), user: toJson(user), err: error,
                                 errorStatus: errorStatus ? errorStatus : 500 });
    }
    if (errorStatus) {
      res.sendStatus(errorStatus);
    } else {
      res.sendStatus(500);
    }
  } else {
    res.send(point);
  }
};

router.post('/:groupId', auth.can('create point'), function(req, res) {
  var point = models.Point.build({
    group_id: req.params.groupId,
    post_id: req.body.postId,
    content: req.body.content,
    value: req.body.value,
    user_id: req.user.id,
    user_agent: req.useragent,
    ip_address: req.clientIp
  });
  point.save().then(function() {
    log.info('Point Created', { point: toJson(point), context: 'create', user: toJson(req.user) });
    var pointRevision = models.PointRevision.build({
      group_id: point.group_id,
      post_id: point.post_id,
      content: point.content,
      user_id: req.user.id,
      point_id: point.id,
      user_agent: req.useragent,
      ip_address: req.clientIp
    });
    pointRevision.save().then(function() {
      log.info('PointRevision Created', { pointRevision: toJson(pointRevision), context: 'create', user: toJson(req.user) });
      models.Point.find({
        where: { id: point.id },
        include: [
          { model: models.PointRevision ,
            include: [
              { model: models.User, attributes: ["id", "name", "facebook_id", "buddy_icon_file_name"] }
            ]
          }
        ]
      }).then(function(point) {
        models.Post.find({
          where: { id: point.post_id }
        }).then(function(post) {
            post.increment('counter_points').then(function(){
              res.send(point);
            });
          });
      });
    });
  }).catch(function(error) {
    sendPointOrError(res, null, 'create', req.user, error);
  });
});

router.post('/:id/pointQuality', auth.isLoggedIn, auth.can('vote on point'), function(req, res) {
  models.PointQuality.find({
    where: { point_id: req.params.id, user_id: req.user.id }
  }).then(function(pointQuality) {
    var oldPointQualityValue;
    if (pointQuality) {
      if (pointQuality.value>0)
        oldPointQualityValue = 1;
      else if (pointQuality.value<0)
        oldPointQualityValue = -1;
      pointQuality.value = req.body.value;
      pointQuality.status = 'active';
    } else {
      pointQuality = models.PointQuality.build({
        point_id: req.params.id,
        value: req.body.value,
        user_id: req.user.id,
        status: 'active',
        user_agent: req.useragent,
        ip_address: req.clientIp
      })
    }
    pointQuality.save().then(function() {
      log.info('PointQuality Created or Updated', { pointQuality: toJson(pointQuality), context: 'createOrUpdate', user: toJson(req.user) });
      decrementOldPointQualityCountersIfNeeded(oldPointQualityValue, req.params.id, pointQuality, function () {
        if (pointQuality.value>0) {
          changePointCounter(req.params.id, 'counter_quality_up', 1, function () {
            res.send({ pointQuality: pointQuality, oldPointQualityValue: oldPointQualityValue });
          })
        } else if (pointQuality.value<0) {
          changePointCounter(req.params.id, 'counter_quality_down', 1, function () {
            res.send({ pointQuality: pointQuality, oldPointQualityValue: oldPointQualityValue });
          })
        } else {
          log.error('PointQuality Error', { pointQuality: toJson(pointQuality), context: 'createOrUpdate', user: toJson(req.user) });
          res.status(500);
        }
      })
    });
  });
});

router.delete('/:id/pointQuality', auth.isLoggedIn, auth.can('vote on point'), function(req, res) {
  models.PointQuality.find({
    where: { point_id: req.params.id, user_id: req.user.id }
  }).then(function(pointQuality) {
    if (pointQuality) {
      var oldPointQualityValue;
      if (pointQuality.value>0)
        oldPointQualityValue = 1;
      else if (pointQuality.value<0)
        oldPointQualityValue = -1;
      pointQuality.value = 0;
      //pointQuality.deleted = true;
      pointQuality.save().then(function() {
        log.info('PointQuality Deleted', { pointQuality: toJson(pointQuality), context: 'delete', user: toJson(req.user) });
        if (oldPointQualityValue>0) {
          changePointCounter(req.params.id, 'counter_quality_up', -1, function () {
            res.status(200).send({ pointQuality: pointQuality, oldPointQualityValue: oldPointQualityValue });
          })
        } else if (oldPointQualityValue<0) {
          changePointCounter(req.params.id, 'counter_quality_down', -1, function () {
            res.status(200).send({ pointQuality: pointQuality, oldPointQualityValue: oldPointQualityValue });
          })
        } else {
          console.error("Strange state of pointQualities");
          res.status(200).send({ pointQuality: pointQuality, oldPointQualityValue: oldPointQualityValue });
        }
      });
    } else {
      log.error('PointQuality Not Found', { pointQuality: toJson(pointQuality), context: 'delete', user: toJson(req.user) });
      res.sendStatus(404);
    }
  });
});

module.exports = router;
