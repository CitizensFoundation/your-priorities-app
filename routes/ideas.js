var express = require('express');
var router = express.Router();
var models = require("../models");

/* GET ideas listing. */
router.get('/', function(req, res) {
  models.Idea.findAll({
    limit: 10,
    include: [ models.Point ]
  }).success(function(ideas) {
    res.send(ideas);
  });
});

module.exports = router;
