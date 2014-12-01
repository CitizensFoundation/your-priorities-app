var express = require('express');
var router = express.Router();
var models = require("../models");

/* GET ideas listing. */
router.get('/', function(req, res) {
  models.Group.findAll({
    limit: 300,
    order: "counter_ideas DESC",
    where: "top_banner_file_name IS NOT NULL"
  }).then(function(groups) {
    res.send(groups);
  });
});

router.get('/:id/ideas', function(req, res) {
  models.Idea.findAll({
    limit: 50,
    order: 'position DESC',
    where: "description IS NOT NULL AND sub_instance_id = "+req.params.id+" AND status = 'published'",
    include: [ models.Group, models.Point, models.Category, models.IdeaRevision, models.Endorsement ]
  }).then(function(ideas) {
    res.send(ideas);
  });
});

module.exports = router;
