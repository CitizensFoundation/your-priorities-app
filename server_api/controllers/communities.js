var express = require('express');
var router = express.Router();
var models = require("../models");

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.send(401, 'Unauthorized');
}

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
    order: [
      [ { model: models.Group }, 'user_id', 'asc' ],
      [ { model: models.Group }, 'created_at', 'asc' ],
      [ { model: models.Image, as: 'GroupLogoImages' }, 'created_at', 'asc' ]
    ],
    include: [
      {
        model: models.User, as: 'CommunityUsers',
        attributes: ['id'],
        required: false
      },
      {
        model: models.Group,
        order: 'Group.created_at DESC',
        where: {
          deleted: false
        },
        required: false,
        order: [
          [ { model: models.Image, as: 'GroupLogoImages' }, 'created_at', 'asc' ]
        ],
        include: [
          {
            model: models.Image, as: 'GroupLogoImages',
            order: [
              [ { model: models.Image, as: 'GroupLogoImages' }, 'created_at', 'asc' ]
            ]
          },
          {
            model: models.User, as: 'GroupUsers',
            attributes: ['id'],
            required: false
          }
        ]
      },
      {
        model: models.Image, as: 'CommunityLogoImages'
      },
      {
        model: models.Image, as: 'CommunityHeaderImages'
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
    community.updateAllExternalCounters(req, 'up', function () {
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

router.put('/:id', isAuthenticated, function(req, res) {
  models.Community.find({
    where: { id: req.params.id, user_id: req.user.id }
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

router.delete('/:id', isAuthenticated, function(req, res) {
  models.Community.find({
    where: {id: req.params.id, user_id: req.user.id }
  }).then(function (community) {
    community.deleted = true;
    community.save().then(function () {
      community.updateAllExternalCounters(req, 'down', function () {
        res.sendStatus(200);
      });
    });
  });
});

module.exports = router;
