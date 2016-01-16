var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');

router.get('/', function(req, res) {
  if (req.ypCommunity) {
    log.info('Domain Lookup Found Community', { community: eq.ypCommunity, user: req.user });
    res.send({community: req.ypCommunity, domain: req.ypDomain});
  } else {
    log.info('Domain Lookup Found Domain', { domain: req.ypDomain, user: req.user });
    res.send({domain: req.ypDomain})
  }
});

router.get('/:id', auth.can('view domain'), function(req, res) {
  models.Domain.find({
    where: { id: req.params.id },
    order: [
      [ { model: models.Community } ,'user_id', 'asc' ],
      [ { model: models.Community } ,'created_at', 'asc' ],
      [ { model: models.Image, as: 'DomainLogoImages' } , 'created_at', 'asc' ]
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
        where: {
          access: {
            $ne: models.Community.ACCESS_SECRET
          }
        },
        order: [
          [ { model: models.Image, as: 'CommunityLogoImages' }, 'created_at', 'asc' ],
          [ { model: models.Image, as: 'CommunityHeaderImages' }, 'created_at', 'asc' ]
        ],
        include: [
          {
            model: models.Image, as: 'CommunityLogoImages',
            order: [
              [ { model: models.Image, as: 'CommunityLogoImages' }, 'created_at', 'asc' ],
              [ { model: models.Image, as: 'CommunityHeaderImages' }, 'created_at', 'asc' ]
            ]
          },
          {
            model: models.Image, as: 'CommunityHeaderImages', order: 'created_at asc'
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
    if (domain) {
      res.sendStatus(404);
      log.warning('Domain Not found', { domainId: req.params.id, user: req.user });
    } else {
      log.info('Domain Viewed', { domain: domain, user: req.user });
      res.send(domain);
    }
    res.send(domain);
  }).catch(function(error) {
    log.error('Domain Error', { err: error, domainId: req.params.id, user: req.user });
    res.sendStatus(500);
  });
});

router.put('/:id', auth.can('edit domain'), function(req, res) {
  models.Domain.find({
    where: { id: req.params.id }
  }).then(function(domain) {
    domain.name = req.body.name;
    domain.description = req.body.description;
    domain.save().then(function () {
      log.info('Domain Updated', { domain: domain, user: req.user });
      domain.setupImages(req.body, function(err) {
        if (err) {
          res.sendStatus(500);
          log.error('Domain Error Setup images', { domain: domain, user: req.user, err: err });
        } else {
          res.send(domain);
        }
      });
    });
  }).catch(function(error) {
    log.error('Domain Error', { err: error, domainId: req.params.id, user: req.user });
    res.sendStatus(500);
  });
});

router.delete('/:id', auth.can('edit domain'), function(req, res) {
  models.Domain.find({
    where: {id: req.params.id}
  }).then(function (domain) {
    domain.deleted = true;
    domain.save().then(function () {
      res.sendStatus(200);
    });
  }).catch(function(error) {
    log.error('Domain Error', { err: error, domainId: req.params.id, user: req.user });
    res.sendStatus(500);
  });
});

module.exports = router;
