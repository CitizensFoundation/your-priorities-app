var express = require('express');
var router = express.Router();
var models = require("../models");

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.send(401, 'Unauthorized');
};

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
        attributes: ["id", "login", "facebook_uid", "buddy_icon_file_name"]
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
              { model: models.User, attributes: ["id", "login", "facebook_uid", "buddy_icon_file_name"] }
            ]
          },
          { model: models.PointQuality ,
            include: [
              { model: models.User, attributes: ["id", "login", "facebook_uid", "buddy_icon_file_name"] }
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
        content: req.body.pointFor,
        group_id: idea.groupId,
        user_id: req.user.id,
        idea_id: idea.id
      });
      point.save().then(function() {
        var pointRevision = models.PointRevision.build({
          content: point.content,
          group_id: point.groupId,
          user_id: req.user.id,
          idea_id: idea.id
        });
        pointRevision.save().then(function() {
          res.send(idea);
        });
      });
    });
  });
});

module.exports = router;
