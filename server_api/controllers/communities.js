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
  var access = 0;
  if (req.body.public) {
    access = 2;
  } else if (req.body.closed) {
    access = 1;
  } else if (req.body.secret) {
    access = 0;
  }
  var community = models.Community.build({
    name: req.body.name,
    description: req.body.description,
    access:access,
    website: req.body.website
  });

  community.save().then(function() {
     res.send(community);
  }).catch(function(error) {
    res.sendStatus(403);
  });
});

module.exports = router;
