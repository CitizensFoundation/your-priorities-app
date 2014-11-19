var express = require('express');
var router = express.Router();
var models = require("../models");

/* GET ideas listing. */
router.get('/', function(req, res) {
  models.Idea.findAll({
    limit: 100,
    include: [ models.Point ]
  }).then(function(ideas) {
    res.send(ideas);
  });
});

module.exports = router;
