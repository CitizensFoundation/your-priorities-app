var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');

router.get('/:id', auth.can('view community'), function(req, res) {
  models.Community.find({
    where: { id: req.params.id },
    order: [
      [ { model: models.Group }, 'user_id', 'asc' ],
      [ { model: models.Group }, 'created_at', 'asc' ],
      [ { model: models.Image, as: 'CommunityLogoImages' }, 'created_at', 'asc' ]
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
    if (community) {
      res.sendStatus(404);
      log.warning('Community Not found', { communityId: req.params.id, user: req.user });
    } else {
      log.info('Community Viewed', { community: community, user: req.user });
      res.send(community);
    }
  }).catch(function(error) {
    log.error('Community Error', { err: error, communityId: req.params.id, user: req.user });
    res.sendStatus(500);
  });
});

router.post('/', auth.can('create community'), function(req, res) {
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
          res.sendStatus(500);
          log.error('Community Error', { err: error, user: req.user });
        } else {
          log.info('Community Created', { community: community, user: req.user });
          res.send(community);
        }
      });
    });
  }).catch(function(error) {
    log.error('Community Error', { err: error, user: req.user });
    res.sendStatus(500);
  });
});

router.put('/:id', auth.can('edit community'), function(req, res) {
  models.Community.find({
    where: { id: req.params.id, user_id: req.user.id }
  }).then(function(community) {
    community.name = req.body.name;
    community.description = req.body.description;
    community.access = models.Community.convertAccessFromRadioButtons(req.body);
    community.save().then(function () {
      log.info('Community Updated', { community: community, user: req.user });
      community.setupImages(req.body, function(err) {
        if (err) {
          res.sendStatus(500);
          log.error('Community Error', { community: community, err: error, user: req.user });
        } else {
          res.send(community);
        }
      });
    });
  }).catch(function(error) {
    log.error('Community Error', { err: error, user: req.user });
    res.sendStatus(500);
  });
});

router.delete('/:id', auth.can('edit community'), function(req, res) {
  models.Community.find({
    where: {id: req.params.id, user_id: req.user.id }
  }).then(function (community) {
    community.deleted = true;
    community.save().then(function () {
      log.info('Community Deleted', { community: community, user: req.user });
      community.updateAllExternalCounters(req, 'down', function () {
        res.sendStatus(200);
      });
    });
  }).catch(function(error) {
    log.error('Community Error', { err: error, user: req.user });
    res.sendStatus(500);
  });
});

module.exports = router;
