var express = require('express');
var router = express.Router();
var models = require("../models");

/* GET ideas listing. */
router.get('/', function(req, res) {
  models.Idea.findAll({
    limit: 300,
    where: "description IS NOT NULL AND sub_instance_id = 36 AND status != 'deleted'",
    include: [ models.Point, models.Category ]
  }).then(function(ideas) {
    res.send(ideas);
  });
});

router.get('/DSDS:id', function(req, res) {
  models.Idea.find(id, {
    include: [ models.Point, models.Category ]
  }).then(function(idea) {
    res.send(idea);
  });
});

module.exports = router;
