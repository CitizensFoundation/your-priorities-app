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
        as: 'IdeaHeaderImages'
      },
      models.IdeaRevision,
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
  }).then(function(idea) {
    res.send(idea);
  });
});

router.post('/:groupId', isAuthenticated, function(req, res) {
  var idea = models.Idea.build({
    name: req.body.name,
    description: req.body.description,
    group_id: req.params.groupId,
    category_id: req.body.categoryId != "" ? req.body.categoryId : null,
    location: req.body.location != "" ? JSON.parse(req.body.location) : null,
    cover_media_type: req.body.coverMediaType,
    user_id: req.user.id,
    status: 'published'
  });
  idea.save().then(function() {
    idea.setupAfterSave(req, res, function () {
      idea.setupImages(req.body, function (err) {
        if (err) {
          res.sendStatus(403);
          console.error(err);
        } else {
          res.send(idea);
        }
      })
    });
  });
});

router.put('/:id', isAuthenticated, function(req, res) {
  models.Idea.find({
    where: {id: req.params.id}
  }).then(function (idea) {
    idea.name = req.body.name;
    idea.description = req.body.description;
    idea.category_id = req.body.categoryId != "" ? req.body.categoryId : null;
    idea.location = req.body.location != "" ? JSON.parse(req.body.location) : null;
    idea.cover_media_type = req.body.coverMediaType;
    idea.save().then(function () {
      idea.setupImages(req.body, function (err) {
        if (err) {
          res.sendStatus(403);
          console.error(err);
        } else {
          res.send(idea);
        }
      })
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
  console.log("user: "+req.user.id + " idea: " + req.params.id);
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
      console.error("Can't find endorsement to delete");
      res.sendStatus(500);
    }
  });
});

module.exports = router;
