var express = require('express');
var router = express.Router();
var models = require("../models");

/* GET ideas listing. */
router.get('/', function(req, res) {
  models.Community.findAll({
  }).then(function(communities) {
    res.send(communities);
  });
});

module.exports = router;
