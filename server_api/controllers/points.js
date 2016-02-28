var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var async = require('async');

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
    status: 'active',
    user_agent: req.useragent.source,
    ip_address: req.clientIp
  });
  point.save().then(function() {
    log.info('Point Created', { point: toJson(point), context: 'create', user: toJson(req.user) });
    var pointRevision = models.PointRevision.build({
      group_id: point.group_id,
      post_id: point.post_id,
      content: point.content,
      user_id: req.user.id,
      status: point.status,
      value: point.value,
      point_id: point.id,
      user_agent: req.useragent.source,
      ip_address: req.clientIp
    });
    pointRevision.save().then(function() {
      log.info('PointRevision Created', { pointRevision: toJson(pointRevision), context: 'create', user: toJson(req.user) });
      models.AcActivity.createActivity({
        type:'activity.point.new',
        userId: point.user_id,
        domainId: req.ypDomain.id,
        communityId: req.ypCommunity ?  req.ypCommunity.id : null,
        groupId : point.group_id,
        postId : point.post_id,
        pointId: point.id,
        access: models.AcActivity.ACCESS_PUBLIC
      }, function (error) {
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
            post.updateAllExternalCounters(req, 'up', 'counter_points', function () {
              post.increment('counter_points');
              res.send(point);
            });
          });
        });
      });
    });
  }).catch(function(error) {
    sendPointOrError(res, null, 'create', req.user, error);
  });
});

router.delete('/:id', auth.can('edit point'), function(req, res) {
  models.Point.find({
    where: {id: req.params.id }
  }).then(function (point) {
    point.deleted = true;
    point.save().then(function () {
      log.info('Point Deleted', { point: toJson(point), context: 'delete', user: toJson(req.user) });
      models.Post.find({
        where: { id: point.post_id }
      }).then(function(post) {
        post.updateAllExternalCounters(req, 'down', 'counter_points', function () {
          post.decrement('counter_points');
          res.sendStatus(200);
        });
      });
    });
  }).catch(function(error) {
    sendPointOrError(res, null, 'delete', req.user, error);
  });
});

router.post('/:id/pointQuality', auth.isLoggedIn, auth.can('vote on point'), function(req, res) {
  var point, post;
  models.PointQuality.find({
    where: { point_id: req.params.id, user_id: req.user.id },
    include: [
      {
        model: models.Point,
        attributes: ['id','group_id'],
        include: [
          {
            model: models.Post,
            attributes: ['id','group_id']
          }
        ]
      }
    ]
  }).then(function(pointQuality) {
    var oldPointQualityValue;
    if (pointQuality) {
      point = pointQuality.Point;
      post = point.Post;
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
        user_agent: req.useragent.source,
        ip_address: req.clientIp
      })
    }
    pointQuality.save().then(function() {
      log.info('PointQuality Created or Updated', { pointQuality: toJson(pointQuality), context: 'createOrUpdate', user: toJson(req.user) });
      async.series([
        function (seriesCallback) {
          if (point) {
            seriesCallback();
          } else {
            models.Point.find({
              where: { id: pointQuality.point_id },
              attributes: ['id','post_id','group_id']
            }).then(function (results) {
              if (results) {
                point = results;
                seriesCallback();
              } else {
                seriesCallback("Can't find point")
              }
            });
          }
        },
        function (seriesCallback) {
          if (post) {
            seriesCallback();
          } else {
            models.Post.find({
              where: { id: point.post_id },
              attributes: ['id','group_id']
            }).then(function (results) {
              if (results) {
                post = results;
                seriesCallback();
              } else {
                seriesCallback("Can't find post")
              }
            });
          }
        },
        function (seriesCallback) {
          models.AcActivity.createActivity({
            type: pointQuality.value > 0 ? 'activity.point.helpful.new' :  'activity.point.unhelpful.new',
            userId: pointQuality.user_id,
            domainId: req.ypDomain.id,
            communityId: req.ypCommunity ?  req.ypCommunity.id : null,
            groupId : point.group_id,
            postId : point.post_id,
            pointId: point.id,
            access: models.AcActivity.ACCESS_PUBLIC
          }, function (error) {
            seriesCallback(error);
          });
        }
      ], function (error) {
        if (error) {
          log.error("Point Quality Error", { context: 'create', pointQuality: toJson(pointQuality), user: toJson(req.user),
            err: error, errorStatus: 500 });
          res.sendStatus(500);
        } else {
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
        }
      });

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
