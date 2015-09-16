var express = require('express');
var router = express.Router();
var models = require("../models");

router.get('/', function(req, res) {
  if (req.ypCommunity) {
    res.send({community: req.ypCommunity, domain: req.ypDomain})
  } else {
    res.send({domain: req.ypDomain})
  }
});

router.get('/:id', function(req, res) {
  models.Domain.find({
    where: { id: req.params.id },
    include: [
      { model: models.Community,
        include: [
          {
            model: models.Image, as: 'CommunityLogoImages', order: 'updatedAt DESC'
          },
          {
            model: models.Image, as: 'CommunityHeaderImages', order: 'updatedAt DESC'
          }
        ],
        order: 'Community.created_at DESC'
      }
    ]
  }).then(function(community) {
    res.send(community);
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
