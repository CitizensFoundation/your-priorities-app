var express = require('express');
var router = express.Router();
var models = require("../models");

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.send(401, 'Unauthorized');
}

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
    order: [
      [ { model: models.Community } ,'user_id', 'asc' ],
      [ { model: models.Community } ,'created_at', 'asc' ],
      [ { model: models.Image, as: 'DomainLogoImages' } , 'created_at', 'asc' ],
      [ { model: models.Image, as: 'CommunityLogoImages' }, 'created_at', 'asc' ]
    ],
    include: [
      {
        model: models.User, as: 'DomainUsers',
        attributes: ['id'],
        required: false
      },
      {
        model: models.Image, as: 'DomainLogoImages'
      },
      {
        model: models.Image, as: 'DomainHeaderImages'
      },
      { model: models.Community,
        include: [
          {
            model: models.Image, as: 'CommunityLogoImages', order: 'updatedAt DESC'
          },
          {
            model: models.Image, as: 'CommunityHeaderImages', order: 'updatedAt DESC'
          },
          {
            model: models.User, as: 'CommunityUsers',
            attributes: ['id'],
            required: false
          }
        ],
        required: false
      }
    ]
  }).then(function(domain) {
    res.send(domain);
  });
});

router.put('/:id', isAuthenticated, function(req, res) {
  models.Domain.find({
    where: { id: req.params.id }
  }).then(function(domain) {
    domain.name = req.body.name;
    domain.description = req.body.description;
    domain.save().then(function () {
      domain.setupImages(req.body, function(err) {
        if (err) {
          res.sendStatus(403);
          console.error(err);
        } else {
          res.send(domain);
        }
      });
    });
  });
});

router.delete('/:id', isAuthenticated, function(req, res) {
  models.Domain.find({
    where: {id: req.params.id}
  }).then(function (domain) {
    domain.deleted = true;
    domain.save().then(function () {
      res.sendStatus(200);
    });
  });
});

module.exports = router;
