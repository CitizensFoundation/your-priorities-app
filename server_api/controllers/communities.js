var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var _ = require('lodash');
var async = require('async');

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

var getCommunityAndUser = function (communityId, userId, userEmail, callback) {
  var user, community;

  async.series([
    function (seriesCallback) {
      models.Community.find({
        where: {
          id: communityId
        }
      }).then(function (communityIn) {
        if (communityIn) {
          community = communityIn;
        }
        seriesCallback();
      }).catch(function (error) {
        seriesCallback(error);
      });
    },
    function (seriesCallback) {
      if (userId) {
        models.User.find({
          where: {
            id: userId
          }
        }).then(function (userIn) {
          if (userIn) {
            user = userIn;
          }
          seriesCallback();
        }).catch(function (error) {
          seriesCallback(error);
        });
      } else {
        seriesCallback();
      }
    },
    function (seriesCallback) {
      if (userEmail) {
        models.User.find({
          where: {
            email: userEmail
          }
        }).then(function (userIn) {
          if (userIn) {
            user = userIn;
          }
          seriesCallback();
        }).catch(function (error) {
          seriesCallback(error);
        });
      } else {
        seriesCallback();
      }
    }
  ], function (error) {
    if (error) {
      callback(error)
    } else {
      callback(null, community, user);
    }
  });
};

router.delete('/:communityId/user_membership', auth.isLoggedIn, auth.can('view community'), function(req, res) {
  getCommunityAndUser(req.params.communityId, req.user.id, null, function (error, community, user) {
    if (error) {
      log.error('Could not remove user', { err: error, communityId: req.params.communityId, userRemovedId: req.user.id, context: 'user_membership', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(500);
    } else if (user && community) {
      community.removeCommunityUsers(user).then(function (results) {
        log.info('User removed', {context: 'user_membership', communityId: req.params.communityId, userRemovedId: req.user.id, user: req.user ? toJson(req.user.simple()) : null });
        res.send({ membershipValue: false, name: community.name });
      });
    } else {
      res.sendStatus(404);
    }
  });
});

router.post('/:communityId/user_membership', auth.isLoggedIn, auth.can('view community'), function(req, res) {
  getCommunityAndUser(req.params.communityId, req.user.id, null, function (error, community, user) {
    if (error) {
      log.error('Could not add user', { err: error, communityId: req.params.communityId, userRemovedId: req.user.id, context: 'user_membership', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(500);
    } else if (user && community) {
      community.addCommunityUsers(user).then(function (results) {
        log.info('User Added', {context: 'user_membership', communityId: req.params.communityId, userRemovedId: req.user.id, user: req.user ? toJson(req.user.simple()) : null });
        res.send({ membershipValue: true, name: community.name });
      });
    } else {
      res.sendStatus(404);
    }
  });
});

router.delete('/:communityId/:userId/remove_admin', auth.can('edit community'), function(req, res) {
  getCommunityAndUser(req.params.communityId, req.params.userId, null, function (error, community, user) {
    if (error) {
      log.error('Could not remove admin', { err: error, communityId: req.params.communityId, userRemovedId: req.params.userId, context: 'remove_admin', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(500);
    } else if (user && community) {
      community.removeCommunityAdmins(user).then(function (results) {
        log.info('Admin removed', {context: 'remove_admin', communityId: req.params.communityId, userRemovedId: req.params.userId, user: req.user ? toJson(req.user.simple()) : null });
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(404);
    }
  });
});

router.post('/:communityId/:email/add_admin', auth.can('edit community'), function(req, res) {
  getCommunityAndUser(req.params.communityId, null, req.params.email, function (error, community, user) {
    if (error) {
      log.error('Could not add admin', { err: error, communityId: req.params.communityId, userAddEmail: req.params.email, context: 'remove_admin', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(500);
    } else if (user && community) {
      community.addCommunityAdmins(user).then(function (results) {
        log.info('Admin Added', {context: 'add_admin', communityId: req.params.communityId, userAddEmail: req.params.email, user: req.user ? toJson(req.user.simple()) : null });
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(404);
    }
  });
});

router.get('/:communityId/pages', auth.can('view community'), function(req, res) {
  models.Community.find({
      where: { id: req.params.communityId},
      attributes: ['id', 'domain_id']
    }).then(function (community) {
    models.Page.getPages(req, { community_id: req.params.communityId, domain_id: community.domain_id }, function (error, pages) {
      if (error) {
        log.error('Could not get pages for community', { err: error, context: 'pages', user: req.user ? toJson(req.user.simple()) : null });
        res.sendStatus(500);
      } else {
        log.info('Got Pages', {context: 'pages', user: req.user ? toJson(req.user.simple()) : null });
        res.send(pages);
      }
    });
  }).catch(function (error) {
    log.error('Could not get pages for community', { err: error, context: 'pages', user: req.user ? toJson(req.user.simple()) : null });
    res.sendStatus(500);
  });
});

router.get('/:communityId/pages_for_admin', auth.can('edit community'), function(req, res) {
  models.Page.getPagesForAdmin(req, { community_id: req.params.communityId }, function (error, pages) {
    if (error) {
      log.error('Could not get page for admin for community', { err: error, context: 'pages_for_admin', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(500);
    } else {
      log.info('Got Pages For Admin', {context: 'pages_for_admin', user: req.user ? toJson(req.user.simple()) : null });
      res.send(pages);
    }
  });
});

router.post('/:communityId/add_page', auth.can('edit community'), function(req, res) {
  models.Page.newPage(req, { community_id: req.params.communityId, content: {}, title: {} }, function (error, pages) {
    if (error) {
      log.error('Could not create page for admin for community', { err: error, context: 'new_page', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(500);
    } else {
      log.info('New Community Page', {context: 'new_page', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(200);
    }
  });
});

router.put('/:communityId/:pageId/update_page_locale', auth.can('edit community'), function(req, res) {
  models.Page.updatePageLocale(req, { community_id: req.params.communityId, id: req.params.pageId }, function (error) {
    if (error) {
      log.error('Could not update locale for admin for community', { err: error, context: 'update_page_locale', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(500);
    } else {
      log.info('Community Page Locale Updated', {context: 'update_page_locale', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(200);
    }
  });
});

router.put('/:communityId/:pageId/publish_page', auth.can('edit community'), function(req, res) {
  models.Page.publishPage(req, { community_id: req.params.communityId, id: req.params.pageId }, function (error) {
    if (error) {
      log.error('Could not publish page for admin for community', { err: error, context: 'publish_page', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(500);
    } else {
      log.info('Community Page Published', {context: 'publish_page', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(200);
    }
  });
});

router.put('/:communityId/:pageId/un_publish_page', auth.can('edit community'), function(req, res) {
  models.Page.unPublishPage(req, { community_id: req.params.communityId, id: req.params.pageId }, function (error) {
    if (error) {
      log.error('Could not un-publish page for admin for community', { err: error, context: 'un_publish_page', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(500);
    } else {
      log.info('Community Page Un-Published', {context: 'un_publish_page', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(200);
    }
  });
});

router.delete('/:communityId/:pageId/delete_page', auth.can('edit community'), function(req, res) {
  models.Page.deletePage(req, { community_id: req.params.communityId, id: req.params.pageId }, function (error) {
    if (error) {
      log.error('Could not delete page for admin for community', { err: error, context: 'delete_page', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(500);
    } else {
      log.info('Commuity Page Published', {context: 'delete_page', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(200);
    }
  });
});

router.post('/:communityId/news_story', auth.isLoggedIn, auth.can('view community'), function(req, res) {
  models.Point.createNewsStory(req, req.body, function (error) {
    if (error) {
      log.error('Could not save news story point on community', { err: error, context: 'news_story', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(500);
    } else {
      log.info('Point News Story Created', {context: 'news_story', user: req.user ? toJson(req.user.simple()) : null });
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
    where: {id: req.params.id }
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
