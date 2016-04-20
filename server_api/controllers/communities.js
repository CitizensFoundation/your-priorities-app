var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var _ = require('lodash');

var sendCommunityOrError = function (res, community, context, user, error, errorStatus) {
  if (error || !community) {
    if (errorStatus == 404) {
      log.warn("Community Not Found", { context: context, community: toJson(community), user: toJson(user), err: error,
        errorStatus: 404 });
    } else {
      log.error("Community Error", { context: context, community: toJson(community), user: toJson(user), err: error,
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

router.get('/:communityId/pages_for_admin', auth.can('edit community'), function(req, res) {
  models.Page.getPagesForAdmin(req, { community_id: req.params.communityId }, function (error, pages) {
    if (error) {
      log.error('Could not get page for admin for community', { err: error, context: 'pages_for_admin', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Point News Story Created', {context: 'pages_for_admin', user: toJson(req.user.simple()) });
      res.send(pages);
    }
  });
});

router.post('/:communityId/news_story', auth.isLoggedIn, auth.can('view community'), function(req, res) {
  models.Point.createNewsStory(req, req.body, function (error) {
    if (error) {
      log.error('Could not save news story point on community', { err: error, context: 'news_story', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Point News Story Created', {context: 'news_story', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.get('/:id', auth.can('view community'), function(req, res) {
  models.Community.find({
    where: { id: req.params.id },
    order: [
      [ { model: models.Group }, 'counter_users', 'desc' ],
      [ { model: models.Image, as: 'CommunityLogoImages' } , 'created_at', 'asc' ],
      [ { model: models.Image, as: 'CommunityHeaderImages' } , 'created_at', 'asc' ],
      [ models.Group, { model: models.Image, as: 'GroupLogoImages' }, 'created_at', 'asc' ]
    ],
    include: [
      {
        model: models.Domain
      },
      {
        model: models.Image, as: 'CommunityLogoImages',
        required: false
      },
      {
        model: models.Image, as: 'CommunityHeaderImages',
        required: false
      },
      {
        model: models.Group,
        where: {
          access: {
            $ne: models.Group.ACCESS_SECRET
          }
        },
        required: false,
        include: [
          {
            model: models.Image, as: 'GroupLogoImages',
            required: false
          }
        ]
      }
    ]
  }).then(function(community) {
    if (community) {
      log.info('Community Viewed', { community: toJson(community), context: 'view', user: toJson(req.user) });
      res.send(community);
    } else {
      sendCommunityOrError(res, req.params.id, 'view', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendCommunityOrError(res, null, 'view', req.user, error);
  });
});

router.post('/:domainId', auth.can('create community'), function(req, res) {
  var hostname;
  if (req.hostname=='localhost') {
    hostname = 'localhost';
  } else {
    hostname = models.Domain.extractHost(req.headers.host);
  }
  var admin_email = req.user.email;
  var admin_name = "Administrator";
  var community = models.Community.build({
    name: req.body.name,
    description: req.body.description,
    access: models.Community.convertAccessFromRadioButtons(req.body),
    domain_id: req.params.domainId,
    user_id: req.user.id,
    hostname: hostname,
    website: req.body.website,
    admin_email: admin_email,
    admin_name: admin_name,
    user_agent: req.useragent.source,
    ip_address: req.clientIp
  });
  community.save().then(function() {
    log.info('Community Created', { community: toJson(community), context: 'create', user: toJson(req.user) });
    community.updateAllExternalCounters(req, 'up', 'counter_communities', function () {
      community.setupImages(req.body, function(error) {
        community.addCommunityAdmins(req.user).then(function (results) {
          sendCommunityOrError(res, community, 'setupImages', req.user, error);
        });
      });
    });
  }).catch(function(error) {
    sendCommunityOrError(res, null, 'create', req.user, error);
  });
});

router.put('/:id', auth.can('edit community'), function(req, res) {
  models.Community.find({
    where: { id: req.params.id }
  }).then(function(community) {
    if (community) {
      community.name = req.body.name;
      community.description = req.body.description;
      if (req.body.status && req.body.status!="") {
        community.status = req.body.status;
      }
      community.access = models.Community.convertAccessFromRadioButtons(req.body);
      community.save().then(function () {
        log.info('Community Updated', { community: toJson(community), context: 'update', user: toJson(req.user) });
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
        log.info('Community Deleted', { community: toJson(community), user: toJson(req.user) });
        community.updateAllExternalCounters(req, 'down', 'counter_communities', function () {
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

router.get('/:id/post_locations', auth.can('view community'), function(req, res) {
  models.Post.findAll({
    where: {
      location: {
        $ne: null
      }
    },
    select: ['id','name','location'],
    include: [
      {
        model: models.Group,
        where: {
          access: models.Group.ACCESS_PUBLIC
        },
        required: true,
        include: [
          {
            model: models.Community,
            where: { id: req.params.id },
            required: true
          }
        ]
      }
    ]
  }).then(function(posts) {
    if (posts) {
      log.info('Community Post Locations Viewed', { communityId: req.params.id, context: 'view', user: toJson(req.user) });
      res.send(posts);
    } else {
      sendCommunityOrError(res, null, 'view post locations', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendCommunityOrError(res, null, 'view post locations', req.user, error);
  });
});

module.exports = router;
