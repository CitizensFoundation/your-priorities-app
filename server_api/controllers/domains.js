var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');

var sendDomainOrError = function (res, domain, context, user, error, errorStatus) {
  if (error || !domain) {
    if (errorStatus == 404) {
      log.warn("Domain Not Found", { context: context, domain: toJson(domain), user: toJson(user), err: error,
        errorStatus: 404 });
    } else {
      log.error("Domain Error", { context: context, domain: toJson(domain), user: toJson(user), err: error,
        errorStatus: errorStatus ? errorStatus : 500 });
    }
    if (errorStatus) {
      res.sendStatus(errorStatus);
    } else {
      res.sendStatus(500);
    }
  } else {
    res.send(domain);
  }
};

router.delete('/:domainId/:activityId/delete_activity', auth.can('edit domain'), function(req, res) {
  models.AcActivity.find({
    where: {
      domain_id: req.params.domainId,
      id: req.params.activityId
    }
  }).then(function (activity) {
    activity.deleted = true;
    activity.save().then(function () {
      res.send( { activityId: activity.id });
    })
  }).catch(function (error) {
    log.error('Could not delete activity for domain', {
      err: error,
      context: 'delete_activity',
      user: toJson(req.user.simple())
    });
    res.sendStatus(500);
  });
});

router.get('/:domainId/pages', auth.can('view domain'), function(req, res) {
  models.Page.getPages(req, { domain_id: req.params.domainId }, function (error, pages) {
    if (error) {
      log.error('Could not get pages for domain', { err: error, context: 'pages', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(500);
    } else {
      log.info('Got Pages', {context: 'pages', user: req.user ? toJson(req.user.simple()) : null });
      res.send(pages);
    }
  });
});

router.get('/:domainId/pages_for_admin', auth.can('edit domain'), function(req, res) {
  models.Page.getPagesForAdmin(req, { domain_id: req.params.domainId }, function (error, pages) {
    if (error) {
      log.error('Could not get page for admin for domain', { err: error, context: 'pages_for_admin', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Got Pages For Admin', {context: 'pages_for_admin', user: toJson(req.user.simple()) });
      res.send(pages);
    }
  });
});

router.post('/:domainId/add_page', auth.can('edit domain'), function(req, res) {
  models.Page.newPage(req, { domain_id: req.params.domainId, content: {}, title: {} }, function (error, pages) {
    if (error) {
      log.error('Could not create page for admin for domain', { err: error, context: 'new_page', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('New Community Page', {context: 'new_page', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.put('/:domainId/:pageId/update_page_locale', auth.can('edit domain'), function(req, res) {
  models.Page.updatePageLocale(req, { domain_id: req.params.domainId, id: req.params.pageId }, function (error) {
    if (error) {
      log.error('Could not update locale for admin for domain', { err: error, context: 'update_page_locale', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Community Page Locale Updated', {context: 'update_page_locale', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.put('/:domainId/:pageId/publish_page', auth.can('edit domain'), function(req, res) {
  models.Page.publishPage(req, { domain_id: req.params.domainId, id: req.params.pageId }, function (error) {
    if (error) {
      log.error('Could not publish page for admin for domain', { err: error, context: 'publish_page', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Community Page Published', {context: 'publish_page', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.put('/:domainId/:pageId/un_publish_page', auth.can('edit domain'), function(req, res) {
  models.Page.unPublishPage(req, { domain_id: req.params.domainId, id: req.params.pageId }, function (error) {
    if (error) {
      log.error('Could not un-publish page for admin for domain', { err: error, context: 'un_publish_page', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Community Page Un-Published', {context: 'un_publish_page', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.delete('/:domainId/:pageId/delete_page', auth.can('edit domain'), function(req, res) {
  models.Page.deletePage(req, { domain_id: req.params.domainId, id: req.params.pageId }, function (error) {
    if (error) {
      log.error('Could not delete page for admin for domain', { err: error, context: 'delete_page', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Commuity Page Published', {context: 'delete_page', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.post('/:domainId/news_story', auth.isLoggedIn, auth.can('view domain'), function(req, res) {
  models.Point.createNewsStory(req, req.body, function (error) {
    if (error) {
      log.error('Could not save news story point on domain', { err: error, context: 'news_story', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Point News Story Created', {context: 'news_story', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.get('/', function(req, res) {
  if (req.ypCommunity) {
    log.info('Domain Lookup Found Community', { domain: toJson(req.ypCommunity), context: 'index', user: toJson(req.user) });
    res.send({domain: req.ypCommunity, domain: req.ypDomain});
  } else {
    log.info('Domain Lookup Found Domain', { domain: toJson(req.ypDomain), context: 'index', user: toJson(req.user) });
    res.send({domain: req.ypDomain})
  }
});

router.get('/:id', auth.can('view domain'), function(req, res) {

  var attributes = null;

  auth.hasDomainAdmin(req.params.id, req, function (error, isAdmin) {
    if (!isAdmin) {
      attributes = models.Domain.defaultAttributesPublic;
    }
    
    models.Domain.find({
      where: { id: req.params.id },
      attributes: attributes,
      order: [
        [ { model: models.Community } ,'counter_users', 'desc' ],
        [ { model: models.Image, as: 'DomainLogoImages' } , 'created_at', 'asc' ],
        [ { model: models.Image, as: 'DomainHeaderImages' } , 'created_at', 'asc' ],
        [ models.Community, { model: models.Image, as: 'CommunityLogoImages' }, 'created_at', 'asc' ]
      ],
      include: [
        {
          model: models.Image, as: 'DomainLogoImages',
          required: false
        },
        {
          model: models.Image, as: 'DomainHeaderImages',
          required: false
        },
        { model: models.Community,
          where: {
            access: {
              $ne: models.Community.ACCESS_SECRET
            }
          },
          include: [
            {
              model: models.Image, as: 'CommunityLogoImages',
              required: false
            },
            {
              model: models.Image, as: 'CommunityHeaderImages', order: 'created_at asc',
              required: false
            }
          ],
          required: false
        }
      ]
    }).then(function(domain) {
      if (domain) {
        log.info('Domain Viewed', { domain: toJson(domain.simple()), context: 'view', user: toJson(req.user) });
        res.send(domain);
      } else {
        sendDomainOrError(res, req.params.id, 'view', req.user, 'Not found', 404);
      }
    }).catch(function(error) {
      sendDomainOrError(res, null, 'view', req.user, error);
    });
  });

});

router.put('/:id', auth.can('edit domain'), function(req, res) {
  models.Domain.find({
    where: { id: req.params.id }
  }).then(function(domain) {
    if (domain) {
      domain.ensureApiKeySetup();
      domain.set('secret_api_keys.facebook.client_id', req.body.facebookClientId);
      domain.set('secret_api_keys.facebook.client_secret', req.body.facebookClientSecret);
      domain.set('secret_api_keys.google.client_id', req.body.googleClientId);
      domain.set('secret_api_keys.google.client_secret', req.body.googleClientSecret);
      domain.set('secret_api_keys.twitter.client_id', req.body.twitterClientId);
      domain.set('secret_api_keys.twitter.client_secret', req.body.twitterClientSecret);
      domain.set('secret_api_keys.github.client_id', req.body.githubClientId);
      domain.set('secret_api_keys.github.client_secret', req.body.githubClientSecret);
      if (req.body.samlEntryPoint) {
        domain.set('secret_api_keys.saml.entryPoint', req.body.samlEntryPoint);
        domain.set('secret_api_keys.saml.callbackUrl', req.body.samlCallbackUrl);
        domain.set('secret_api_keys.saml.cert', req.body.samlCert);
      }
      domain.name = req.body.name;
      domain.description = req.body.description;
      domain.only_admins_can_create_communities = req.body.onlyAdminsCanCreateCommunities ? true : false;
      domain.theme_id = req.body.themeId ? parseInt(req.body.themeId) : null;
      domain.save().then(function () {
        log.info('Domain Updated', { domain: toJson(domain), user: toJson(req.user) });
        domain.setupImages(req.body, function(err) {
          if (err) {
            res.sendStatus(500);
            log.error('Domain Error Setup images', { domain: toJson(domain), user: toJson(req.user), err: err });
          } else {
            res.send(domain);
          }
        });
      });
    } else {
      sendDomainOrError(res, req.params.id, 'update', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendDomainOrError(res, null, 'update', req.user, error);
  });
});

router.delete('/:id', auth.can('edit domain'), function(req, res) {
  models.Domain.find({
    where: {id: req.params.id}
  }).then(function (domain) {
    if (domain) {
      domain.deleted = true;
      domain.save().then(function () {
        log.info('Domain Deleted', { group: toJson(group), context: 'delete', user: toJson(req.user) });
        res.sendStatus(200);
      });
    } else {
      sendDomainOrError(res, req.params.id, 'delete', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendDomainOrError(res, null, 'delete', req.user, error);
  });
});

router.get(':id/news', auth.can('view domain'), function(req, res) {
  models.AcActivity.find({
    where: { domain_id: req.params.id },
    order: [
      [ { model: models.Domain } ,'created_at', 'asc' ]
    ],
    limit: 200
  }).then(function(news) {
    if (news) {
      log.info('Domain News', { domain: toJson(news), context: 'get', user: toJson(req.user) });
      res.send(news);
    } else {
      log.warn("Domain News Not Found", {
        context: context, domain: toJson(domain), user: toJson(user), err: "Not found",
        errorStatus: errorStatus ? errorStatus : 404
      });
      res.sendStatus(404);
    }
  }).catch(function(error) {
    log.error("Domain News Error", { context: context, domain: toJson(domain), user: toJson(user), err: error,
      errorStatus: errorStatus ? errorStatus : 500 });
    res.sendStatus(500);
  });
});

module.exports = router;
