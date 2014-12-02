var express = require('express');
var router = express.Router();
var models = require("../models");

/* GET ideas listing. */
router.get('/', function(req, res) {
  models.Group.findAll({
    limit: 100,
    order: "counter_ideas DESC",
    include: [ models.IsoCountry ]
  }).then(function(groups) {
    res.send(groups);
  });
});

router.get('/:id/ideas', function(req, res) {
  models.Idea.findAll({
    order: '(counter_endorsements_up-counter_endorsements_down) DESC',
    where: "sub_instance_id = "+req.params.id+" AND status = 'published'",
    limit: 100,
    include: [ models.Category, models.IdeaRevision, models.Point ]
  }).then(function(ideas) {
    res.send(ideas);
  });
});

router.get('/:id/categories', function(req, res) {
  models.Category.findAll({
    where: "sub_instance_id = "+req.params.id,
    limit: 20
  }).then(function(categories) {
    res.send(categories);
  });
});

module.exports = router;
