var express = require('express');
var router = express.Router();
var models = require("../models");

router.get('/', function(req, res) {
  if (req.ypCommunity) {
    res.send({loadCommunityId: req.ypCommunity.id})
  } else {
    req.ypDomain.getCommunities().then(function (communities) {
      res.send({domain: req.ypDomain, communities: communities })
    });
  }
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
