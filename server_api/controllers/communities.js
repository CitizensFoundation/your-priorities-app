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

router.post('/', function(req, res) {
  models.Community
    .create({ name: req.body.name, description: req.body.name, public: req.body.public })
    .save()
    .then(function(community) {
      res.send(community);
    }).catch(function(error) {
      res.sendStatus(403);
    });
});

module.exports = router;
