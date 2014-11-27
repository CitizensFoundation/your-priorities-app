var express = require('express');
var router = express.Router();
var models = require("../models");

/* GET ideas listing. */
router.get('/', function(req, res) {
  models.Idea.findAll({
    limit: 300,
    where: "description IS NOT NULL AND sub_instance_id = 36 AND status != 'deleted'",
    include: [ models.Point, models.Category, models.IdeaRevision, models.Endorsement ]
  }).then(function(ideas) {
    res.send(ideas);
  });
});

router.get('/:id', function(req, res) {
  models.Idea.find({
    where: {id: req.params.id},
    include: [
      { model: models.Point,
        include: [
          { model: models.PointRevision ,
            include: [
              { model: models.User, attributes: ["id", "login", "facebook_uid", "buddy_icon_file_name"] }
            ]
          },

        ]
      },
      models.Endorsement,
      models.Category,
      models.IdeaRevision
    ]
  }).then(function(idea) {
    res.send(idea);
  });
});

module.exports = router;
