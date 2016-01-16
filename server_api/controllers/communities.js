var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');

var sendCommunityOrError = function (res, community, context, user, error, errorStatus) {
  if (error || !group) {
    if (errorStatus == 404) {
      log.warning("Community Not Found", { context: context, community: community, user: req.user, err: error,
        errorStatus: 404 });
    } else {
      log.error("Community Error", { context: context, community: community, user: req.user, err: error,
        errorStatus: errorStatus ? errorStatus : 500 });
    }
    if (errorStatus) {
      res.sendStatus(errorStatus);
    } else {
      res.sendStatus(500);
    }
  } else {
    res.send(community);
  }
};

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
      log.info('Community Viewed', { community: community, context: 'view', user: req.user });
      res.send(community);
    } else {
      sendCommunityOrError(res, req.params.id, 'view', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendCommunityOrError(res, null, 'view', req.user, error);
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
    log.info('Community Created', { community: community, context: 'create', user: req.user });
    community.updateAllExternalCounters(req, 'up', function () {
      community.setupImages(req.body, function(error) {
        sendCommunityOrError(res, community, 'setupImages', req.user, error);
      });
    });
  }).catch(function(error) {
    sendCommunityOrError(res, null, 'create', req.user, error);
  });
});

router.put('/:id', auth.can('edit community'), function(req, res) {
  models.Community.find({
    where: { id: req.params.id, user_id: req.user.id }
  }).then(function(community) {
    if (community) {
      community.name = req.body.name;
      community.description = req.body.description;
      community.access = models.Community.convertAccessFromRadioButtons(req.body);
      community.save().then(function () {
        log.info('Community Updated', { community: community, context: 'update', user: req.user });
        community.setupImages(req.body, function(error) {
          sendCommunityOrError(res, community, 'setupImages', req.user, error);
        });
      });
    } else {
      sendCommunityOrError(res, req.params.id, 'update', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendCommunityOrError(res, null, 'update', req.user, error);
  });
});

router.delete('/:id', auth.can('edit community'), function(req, res) {
  models.Community.find({
    where: {id: req.params.id, user_id: req.user.id }
  }).then(function (community) {
    if (community) {
      community.deleted = true;
      community.save().then(function () {
        log.info('Community Deleted', { community: community, user: req.user });
        community.updateAllExternalCounters(req, 'down', function () {
          res.sendStatus(200);
        });
      });
    } else {
      sendCommunityOrError(res, req.params.id, 'delete', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendCommunityOrError(res, null, 'delete', req.user, error);
  });
});

module.exports = router;
