var express = require('express');
var router = express.Router();
var models = require("../models");

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.send(401, 'Unauthorized');
};

/* GET ideas listing. */
router.get('/', function(req, res) {
  models.Community.findAll({
      include: [ models.Image ]
  }).then(function(communities) {
    res.send(communities);
  });
});

router.get('/:id', function(req, res) {
  models.Community.find({
    where: { id: req.params.id },
    include: [
      { model: models.Group,
        order: 'Group.created_at DESC'
      },
      {
        model: models.Image, as: 'CommunityLogoImages', order: 'updated_at DESC'
      },
      {
        model: models.Image, as: 'CommunityHeaderImages', order: 'updated_at DESC'
      }
    ]
  }).then(function(community) {
    res.send(community);
  });
});

router.post('/', isAuthenticated, function(req, res) {
  var community = models.Community.build({
    name: req.body.name,
    description: req.body.description,
    access: models.Community.convertAccessFromRadioButtons(req.body),
    domain_id: req.ypDomain.id,
    user_id: req.user.id,
    website: req.body.website
  });
  community.save().then(function() {
    community.setupImages(req.body, function(err) {
      if (err) {
        res.sendStatus(403);
        console.error(err);
      } else {
        res.send(community);
      }
    });
  });
});

router.put('/:id', isAuthenticated, function(req, res) {
  models.Community.find({
    where: { id: req.params.id }
  }).then(function(community) {
    community.name = req.body.name;
    community.description = req.body.description;
    community.access = models.Community.convertAccessFromRadioButtons(req.body);
    community.save().then(function () {
      community.setupImages(req.body, function(err) {
        if (err) {
          res.sendStatus(403);
          console.error(err);
        } else {
          res.send(community);
        }
      });
    });
  });
});

module.exports = router;
