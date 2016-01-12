var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');

function changePointCounter(pointId, column, upDown, next) {
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
}

function decrementOldPointQualityCountersIfNeeded(oldPointQualityValue, pointId, pointQuality, next) {
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
}

router.post('/', isAuthenticated, function(req, res) {
  var point = models.Point.build({
    group_id: req.body.groupId,
    idea_id: req.body.ideaId,
    content: req.body.content,
    value: req.body.value,
    user_id: req.user.id
  });
  point.save().then(function() {
    var pointRevision = models.PointRevision.build({
      group_id: point.group_id,
      idea_id: point.idea_id,
      content: point.content,
      user_id: req.user.id,
      point_id: point.id
    });
    pointRevision.save().then(function() {
      models.Point.find({
        where: { id: point.id },
        include: [
          { model: models.PointRevision ,
            include: [
              { model: models.User, attributes: ["id", "name", "facebook_uid", "buddy_icon_file_name"] }
            ]
          }
        ]
      }).then(function(point) {
        models.Idea.find({
          where: { id: point.idea_id }
        }).then(function(idea) {
            idea.increment('counter_points').then(function(){
              res.send(point);
            });
          });
      });
    });
  }).catch(function(error) {
    res.sendStatus(403);
  });
});

router.post('/:id/pointQuality', isAuthenticated, function(req, res) {
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
        status: 'active'
      })
    }
    pointQuality.save().then(function() {
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
          console.error("Strange state of pointQualities");
          res.status(500);
        }
      })
    });
  });
});

router.delete('/:id/pointQuality', isAuthenticated, function(req, res) {
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
      pointQuality.save().then(function() {
        if (oldPointQualityValue>0) {
          changePointCounter(req.params.id, 'counter_quality_up', -1, function () {
            res.status(200).send({ pointQuality: pointQuality, oldPointQualityValue: oldPointQualityValue });
          })
        } else if (oldPointQualityValue<0) {
          changePointCounter(req.params.id, 'counter_quality_down', -1, function () {
            res.status(200).send({ pointQuality: pointQuality, oldPointQualityValue: oldPointQualityValue });
          })
        } else {
          console.error("Strange state of pointQualities")
          res.status(200).send({ pointQuality: pointQuality, oldPointQualityValue: oldPointQualityValue });
        }
      });
    } else {
      res.sendStatus(404);
    }
  });
});

module.exports = router;
