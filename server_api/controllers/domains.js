var express = require('express');
var router = express.Router();
var models = require("../models");

/* GET ideas listing. */
router.get('/', function(req, res) {
  models.Domain.findAll({
  }).then(function(communities) {
    res.send(communities);
  });
});

router.post('/', function(req, res) {
  var domain = models.Domain.build({
    name: req.body.name,
    description: req.body.description,
    domain_name: req.body.domain_name
  });

  domain.save().then(function() {
     res.send(domain);
  }).catch(function(error) {
    res.sendStatus(403);
  });
});

module.exports = router;
