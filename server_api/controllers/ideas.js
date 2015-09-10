var express = require('express');
var router = express.Router();
var models = require("../models");

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.send(401, 'Unauthorized');
}

function changeIdeaCounter(ideaId, column, upDown, next) {
  models.Idea.find({
    where: { id: ideaId }
  }).then(function(idea) {
    if (idea && upDown===1) {
      idea.increment(column).then(function(){
        next();
      });
    } else if (idea && upDown===-1) {
      idea.decrement(column).then(function(){
        next();
      });
    } else {
      next();
    }
  });
}

function decrementOldCountersIfNeeded(oldEndorsementValue, ideaId, endorsement, next) {
  if (oldEndorsementValue) {
    if (oldEndorsementValue>0) {
      changeIdeaCounter(ideaId, 'counter_endorsements_up', -1, function () {
        next();
      })
    } else if (oldEndorsementValue<0) {
      changeIdeaCounter(ideaId, 'counter_endorsements_down', -1, function () {
        next();
      })
    } else {
      console.error("Strange state of endorsements")
      next();
    }
  } else {
    next();
  }
}

/* GET ideas listing. */
router.get('/', function(req, res) {
  models.Idea.findAll({
    limit: 300,
    order: 'position DESC',
    where: ["description IS NOT NULL AND group_id = 36 AND status != 'deleted'",[]],
    include: [ models.Point, models.Category, models.IdeaRevision, models.Endorsement ]
  }).then(function(ideas) {
    res.send(ideas);
  });
});

router.get('/:id/endorsements', function(req, res) {
  console.log("ID Endorsements");
  models.Endorsement.findAll({
    where: {idea_id: req.params.id, status: 'active'},
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

router.get('/:id', function(req, res) {
  models.Idea.find({
    where: { id: req.params.id },
    include: [
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
      },
      models.Category,
      models.Group,
      models.User,
      models.IdeaRevision
    ]
  }).then(function(idea) {
    res.send(idea);
  });
});

router.post('/:groupId', isAuthenticated, function(req, res) {
  var idea = models.Idea.build({
    name: req.body.name,
    description: req.body.description,
    group_id: req.params.groupId,
    user_id: req.user.id,
    status: 'published'
  });
  idea.save().then(function() {
    var ideaRevision = models.IdeaRevision.build({
      name: idea.name,
      description: idea.description,
      group_id: idea.groupId,
      user_id: req.user.id,
      idea_id: idea.id
    });
    ideaRevision.save().then(function() {
      var point = models.Point.build({
        group_id: idea.groupId,
        idea_id: idea.id,
        content: req.body.pointFor,
        value: 1,
        user_id: req.user.id
      });
      point.save().then(function() {
        var pointRevision = models.PointRevision.build({
          group_id: point.groupId,
          idea_id: idea.id,
          content: point.content,
          user_id: req.user.id,
          point_id: point.id
        });
        pointRevision.save().then(function() {
          res.send(idea);
        });
      });
    });
  });
});

router.post('/:id/endorse', isAuthenticated, function(req, res) {
  models.Endorsement.find({
    where: { idea_id: req.params.id, user_id: req.user.id}
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
        idea_id: req.params.id,
        value: req.body.value,
        user_id: req.user.id,
        status: 'active'
      })
    }
    endorsement.save().then(function() {
      decrementOldCountersIfNeeded(oldEndorsementValue, req.params.id, endorsement, function () {
        if (endorsement.value>0) {
          changeIdeaCounter(req.params.id, 'counter_endorsements_up', 1, function () {
            res.send({ endorsement: endorsement, oldEndorsementValue: oldEndorsementValue });
          })
        } else if (endorsement.value<0) {
          changeIdeaCounter(req.params.id, 'counter_endorsements_down', 1, function () {
            res.send({ endorsement: endorsement, oldEndorsementValue: oldEndorsementValue });
          })
        } else {
          console.error("Strange state of endorsements")
          res.status(500);
        }
      })
    });
  });
});

router.delete('/:id/endorse', isAuthenticated, function(req, res) {
  console.log("User id "+req.user.id);
  models.Endorsement.find({
    where: { idea_id: req.params.id, user_id: req.user.id }
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
          changeIdeaCounter(req.params.id, 'counter_endorsements_up', -1, function () {
            res.status(200).send({ endorsement: endorsement, oldEndorsementValue: oldEndorsementValue });
          })
        } else if (oldEndorsementValue<0) {
          changeIdeaCounter(req.params.id, 'counter_endorsements_down', -1, function () {
            res.status(200).send({ endorsement: endorsement, oldEndorsementValue: oldEndorsementValue });
          })
        } else {
          console.error("Strange state of endorsements")
          res.status(200).send({ endorsement: endorsement, oldEndorsementValue: oldEndorsementValue });
        }
      });
    } else {
      res.sendStatus(404);
    }
  });
});

module.exports = router;
