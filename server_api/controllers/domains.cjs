var express = require('express');
var router = express.Router();
var models = require("../models/index.cjs");
var auth = require('../authorization.cjs');
var log = require('../utils/logger.cjs');
var toJson = require('../utils/to_json.cjs');
var _ = require('lodash');
var async = require('async');
var queue = require('../active-citizen/workers/queue.cjs');
var performSingleModerationAction = require('../active-citizen/engine/moderation/process_moderation_items.cjs').performSingleModerationAction;
const getAllModeratedItemsByDomain = require('../active-citizen/engine/moderation/get_moderation_items.cjs').getAllModeratedItemsByDomain;
const getLoginsExportDataForDomain = require('../utils/export_utils.cjs').getLoginsExportDataForDomain;
var sanitizeFilename = require("sanitize-filename");
var moment = require('moment');
const {plausibleStatsProxy} = require("../active-citizen/engine/analytics/plausible/manager.cjs");
const {countAllModeratedItemsByDomain} = require("../active-citizen/engine/moderation/get_moderation_items.cjs");
const {isValidDbId} = require("../utils/is_valid_db_id.cjs");
const getFromAnalyticsApi = require('../active-citizen/engine/analytics/manager.cjs').getFromAnalyticsApi;
const triggerSimilaritiesTraining = require('../active-citizen/engine/analytics/manager.cjs').triggerSimilaritiesTraining;
const sendBackAnalyticsResultsOrError = require('../active-citizen/engine/analytics/manager.cjs').sendBackAnalyticsResultsOrError;
const countModelRowsByTimePeriod = require('../active-citizen/engine/analytics/statsCalc.cjs').countModelRowsByTimePeriod;
const getDomainIncludes = require('../active-citizen/engine/analytics/statsCalc.cjs').getDomainIncludes;
const getPointDomainIncludes = require('../active-citizen/engine/analytics/statsCalc.cjs').getPointDomainIncludes;
const getParsedSimilaritiesContent = require('../active-citizen/engine/analytics/manager.cjs').getParsedSimilaritiesContent;

var sendDomainOrError = function (res, domain, context, user, error, errorStatus) {
  if (error || !domain) {
    if (errorStatus === 404 || (error && error.message && error.message.indexOf("invalid input syntax for type integer") > -1)) {
      log.warn("Domain Not Found", { context: context, domain: toJson(domain), user: toJson(user), err: error,
        errorStatus: 404 });
      errorStatus = 404;
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

var truthValueFromBody = function(bodyParameter) {
  return (bodyParameter && bodyParameter!=="");
};

var getAvailableCommunityFolders = function (req, domainId, done) {
  let adminCommunities = [];

  async.series([
    function (seriesCallback) {
      if (req.user) {
        async.parallel([
          function (parallelCallback) {
            models.Community.findAll({
              where: {
                is_community_folder: true,
                domain_id: domainId
              },
              attributes: ['id','name'],
              include: [
                {
                  model: models.User,
                  as: 'CommunityAdmins',
                  attributes: ['id'],
                  required: true,
                  where: {
                    id: req.user.id
                  }
                }
              ]
            }).then(function (communities) {
              adminCommunities = communities;
              parallelCallback();
            }).catch(function (error) {
              parallelCallback(error)
            });
          }
        ], function (error) {
          seriesCallback(error);
        });
      } else {
        seriesCallback();
      }
    }
  ], function (error) {
    if (!error) {
      done(error, adminCommunities);
    } else {
      done(error);
    }
  });
};

var getDomain = function (req, domainId, done) {
  var domain;
  var attributes = null;
  async.series([
    function (seriesCallback) {
      auth.hasDomainAdmin(domainId, req, function (error, isAdmin) {
          if (!isAdmin) {
            attributes = models.Domain.defaultAttributesPublic;
          }
        seriesCallback(error);
      });
    },
    function (seriesCallback) {
      models.Domain.findOne({
        where: {id: domainId},
        attributes: attributes,
        order: [
          [{model: models.Image, as: 'DomainLogoImages'}, 'created_at', 'asc'],
          [{model: models.Image, as: 'DomainHeaderImages'}, 'created_at', 'asc'],
          [{model: models.Video, as: "DomainLogoVideos" }, 'updated_at', 'desc' ],
          [{model: models.Video, as: "DomainLogoVideos" }, { model: models.Image, as: 'VideoImages' } ,'updated_at', 'asc' ]
        ],
        include: [
          {
            model: models.Image,
            as: 'DomainLogoImages',
            attributes:  models.Image.defaultAttributesPublic,
            required: false
          },
          {
            model: models.Video,
            as: 'DomainLogoVideos',
            attributes:  ['id','formats','viewable','public_meta'],
            required: false,
            include: [
              {
                model: models.Image,
                as: 'VideoImages',
                attributes:["formats",'updated_at'],
                required: false
              },
            ]
          },
          {
            model: models.Image,
            as: 'DomainHeaderImages',
            attributes:  models.Image.defaultAttributesPublic,
            required: false
          }
        ]
      }).then(function (domainIn) {
        domain = domainIn;
        if (domain) {
          models.Community.findAll({
            where: {
              domain_id: domain.id,
              access: {
                $ne: models.Community.ACCESS_SECRET
              },
              configuration: {
                [models.Sequelize.Op.or]: [
                  {
                    customBackURL: {
                      [models.Sequelize.Op.is]: null
                    }
                  },
                  {
                    alwaysShowOnDomainPage: true
                  }
                ]
              },
              $or: [
                {
                  counter_users: {
                    $gt: process.env.MINIMUM_USERS_FOR_COMMUNITY_TO_SHOW ? parseInt(process.env.MINIMUM_USERS_FOR_COMMUNITY_TO_SHOW) : 21
                  },
                },
                {
                  status: "featured"
                },
                {
                  is_community_folder: {
                    $ne: false
                  }
                }
              ],
              status: {
                $ne: 'hidden'
              },
              in_community_folder_id: null
            },
            limit: 500,
            attributes: models.Community.defaultAttributesPublic,
            order: [
              [ 'counter_users', 'desc'],
              [ {model: models.Image, as: 'CommunityLogoImages'}, 'created_at', 'asc']
            ],
            include: [
              {
                model: models.Image,
                as: 'CommunityLogoImages',
                attributes:  models.Image.defaultAttributesPublic,
                required: false
              },
              {
                model: models.Community,
                as: 'CommunityFolders',
                attributes: ['id','name','counter_users', 'counter_posts', 'counter_groups'],
                required: false,
              },
              {
                model: models.Domain,
                as: 'Domain',
                attributes: ['id','configuration','name'],
                required: false
              },
              {
                model: models.Image,
                as: 'CommunityHeaderImages',
                attributes:  models.Image.defaultAttributesPublic,
                required: false
              }
            ]
          }).then(function (communities) {
            log.info('Domain Viewed', {domainId: domain ? domain.id : -1, userId: req.user ? req.user.id : -1 });
            if (req.ypDomain && req.ypDomain.secret_api_keys &&
              req.ypDomain.secret_api_keys.saml && req.ypDomain.secret_api_keys.saml.entryPoint &&
              req.ypDomain.secret_api_keys.saml.entryPoint.length > 6) {
              domain.dataValues.samlLoginProvided = true;
            }
            if (req.ypDomain && req.ypDomain.secret_api_keys &&
              req.ypDomain.secret_api_keys.facebook && req.ypDomain.secret_api_keys.facebook.client_secret &&
              req.ypDomain.secret_api_keys.facebook.client_secret.length > 6) {
              domain.dataValues.facebookLoginProvided = true;
            }

            if (req.ypDomain && process.env.GOOGLE_MAPS_API_KEY) {
              domain.dataValues.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
            }

            if (req.ypDomain && process.env.ZIGGEO_ENABLED) {
              domain.dataValues.ziggeoEnabled = process.env.ZIGGEO_ENABLED;
            }

            if (req.ypDomain && process.env.OPENAI_API_KEY) {
              domain.dataValues.hasLlm = true;
            }

            domain.dataValues.Communities = communities;

            if (process.env.LOGIN_CALLBACK_CUSTOM_HOSTNAME) {
              domain.dataValues.loginCallbackCustomHostName = process.env.LOGIN_CALLBACK_CUSTOM_HOSTNAME;
            }

            seriesCallback(null);
            return null;
          }).catch(function (error) {
            seriesCallback(error)
          });
        } else {
          seriesCallback("Not found")
        }
        return null;
      }).catch(function (error) {
        seriesCallback(error)
      });
    },
    function (seriesCallback) {
      if (req.user && domain) {
        var adminCommunities, userCommunities;

        async.parallel([
          function (parallelCallback) {
            models.Community.findAll({
              where: {
                domain_id: domain.id,
                in_community_folder_id: null,
                configuration: {
                  [models.Sequelize.Op.or]: [
                    {
                      customBackURL: {
                        [models.Sequelize.Op.is]: null
                      }
                    },
                    {
                      alwaysShowOnDomainPage: true
                    }
                  ]
                },
              },
              limit: 500,
              attributes: models.Community.defaultAttributesPublic,
              order: [
                [ 'counter_users', 'desc'],
                [ {model: models.Image, as: 'CommunityLogoImages'}, 'created_at', 'asc']
              ],
              include: [
                {
                  model: models.Image, as: 'CommunityLogoImages',
                  attributes:  models.Image.defaultAttributesPublic,
                  required: false
                },
                {
                  model: models.Image, as: 'CommunityHeaderImages',
                  attributes:  models.Image.defaultAttributesPublic,
                  required: false
                },
                {
                  model: models.Community,
                  as: 'CommunityFolders',
                  attributes: ['id','name','counter_users', 'counter_posts', 'counter_groups'],
                  required: false,
                },
                {
                  model: models.Domain,
                  as: 'Domain',
                  attributes: ['id','configuration','name'],
                  required: false
                },
                {
                  model: models.User,
                  as: 'CommunityAdmins',
                  attributes: ['id'],
                  required: true,
                  where: {
                    id: req.user.id
                  }
                }
              ]
            }).then(function (communities) {
              adminCommunities = communities;
              parallelCallback();
            }).catch(function (error) {
              parallelCallback(error)
            });
          },
          function (parallelCallback) {
            models.Community.findAll({
              where: {
                domain_id: domain.id,
                in_community_folder_id: null,
                configuration: {
                  [models.Sequelize.Op.or]: [
                    {
                      customBackURL: {
                        [models.Sequelize.Op.is]: null
                      }
                    },
                    {
                      alwaysShowOnDomainPage: true
                    }
                  ]
                },
              },
              limit: 500,
              attributes: models.Community.defaultAttributesPublic,
              order: [
                [ 'counter_users', 'desc'],
                [ {model: models.Image, as: 'CommunityLogoImages'}, 'created_at', 'asc']
              ],
              include: [
                {
                  model: models.Image, as: 'CommunityLogoImages',
                  attributes:  models.Image.defaultAttributesPublic,
                  required: false
                },
                {
                  model: models.Community,
                  as: 'CommunityFolders',
                  attributes: ['id','name','counter_users', 'counter_posts', 'counter_groups'],
                  required: false,
                },
                {
                  model: models.Image, as: 'CommunityHeaderImages',
                  required: false
                },
                {
                  model: models.User,
                  as: 'CommunityUsers',
                  attributes: ['id'],
                  required: true,
                  where: {
                    id: req.user.id
                  }
                }
              ]
            }).then(function (communities) {
              userCommunities = communities;
              parallelCallback();
            }).catch(function (error) {
              parallelCallback(error)
            });
          }
        ], function (error) {
          var combinedCommunities = _.concat(adminCommunities, userCommunities);
          combinedCommunities = _.concat(domain.dataValues.Communities, combinedCommunities);
          combinedCommunities = _.uniqBy(combinedCommunities, function (community) {
            return community.id;
          });

          domain.dataValues.Communities = combinedCommunities;

          seriesCallback(error);
        });
      } else {
        seriesCallback();
      }
    }
  ], function (error) {
    done(error, domain);
  });
};

var getDomainAndUser = function (domainId, userId, userEmail, callback) {
  var user, domain;

  async.series([
    function (seriesCallback) {
      models.Domain.findOne({
        where: {
          id: domainId
        }
      }).then(function (domainIn) {
        if (domainIn) {
          domain = domainIn;
        }
        seriesCallback();
      }).catch(function (error) {
        seriesCallback(error);
      });
    },
    function (seriesCallback) {
      if (userId) {
        models.User.findOne({
          where: {
            id: userId
          },
          attributes: ['id','email','name','created_at']
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
        models.User.findOne({
          where: {
            email: userEmail
          },
          attributes: ['id','email','name','created_at']
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
      callback(null, domain, user);
    }
  });
};

router.get('/:domainId/availableCommunityFolders', auth.can('view domain'), function(req, res) {
  getAvailableCommunityFolders(req, req.params.domainId, function (error, availableCommunityFolders) {
    if (error) {
      log.error('Could not get availableCommunityFolders', { err: error, user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(500);
    } else if (availableCommunityFolders) {
      res.send(availableCommunityFolders);
    } else {
      res.sendStatus(404);
    }
  });
});

router.delete('/:domainId/:activityId/delete_activity', auth.can('edit domain'), function(req, res) {
  models.AcActivity.findOne({
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
      log.info('Got Pages', { userId: req.user ? req.user.id : null });
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
      log.info('Got Pages For Admin', { userId: req.user ? req.user.id : null });
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

router.get('/:domainId/users', auth.can('edit domain'), function (req, res) {
  models.Domain.findOne({
    where: {
      id: req.params.domainId
    },
    include: [
      {
        model: models.User,
        attributes: _.concat(models.User.defaultAttributesWithSocialMediaPublicAndEmail, ['created_at', 'last_login_at']),
        as: 'DomainUsers',
        required: true,
        include: [
          {
            model: models.Organization,
            attributes: ['id', 'name'],
            as: 'OrganizationUsers',
            required: false
          }
        ]
      }
    ]
  }).then(function (domain) {
    log.info('Got users for domain', { context: 'users', user: toJson(req.user.simple()) });
    if (domain) {
      res.send(domain.DomainUsers);
    } else {
      res.send([]);
    }
  }).catch(function (error) {
    log.error('Could not get users for domain', { err: error, context: 'users', user: toJson(req.user.simple()) });
    res.sendStatus(500);
  });
});

router.get('/:domainId/admin_users', auth.can('edit domain'), function (req, res) {
  models.Domain.findOne({
    where: {
      id: req.params.domainId
    },
    include: [
      {
        model: models.User,
        attributes: _.concat(models.User.defaultAttributesWithSocialMediaPublicAndEmail, ['created_at', 'last_login_at']),
        as: 'DomainAdmins',
        required: true,
        include: [
          {
            model: models.Organization,
            attributes: ['id', 'name'],
            as: 'OrganizationUsers',
            required: false
          }
        ]
      }
    ]
  }).then(function (domain) {
    log.info('Got admins for domain', { context: 'users', user: toJson(req.user.simple()) });
    if (domain) {
      res.send(domain.DomainAdmins);
    } else {
      res.send([]);
    }
  }).catch(function (error) {
    log.error('Could not get admin users for domain', { err: error, context: 'users', user: toJson(req.user.simple()) });
    res.sendStatus(500);
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

router.put('/:domainId/:pageId/update_page_weight', auth.can('edit domain'), function(req, res) {
  models.Page.updatePageWeight(req, { domain_id: req.params.domainId, id: req.params.pageId }, function (error) {
    if (error) {
      log.error('Could not update weight for admin for domain', { err: error, context: 'update_page_weight', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Community Page Weight Updated', {context: 'update_page_weight', user: toJson(req.user.simple()) });
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

router.post('/:domainId/news_story', auth.isLoggedInNoAnonymousCheck, auth.can('view domain'), function(req, res) {
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

router.get('/oldBoot', function(req, res) {
  getDomain(req, req.ypDomain.id, function (error, domain) {
    if (error) {
      if (error=='Not found')
        sendDomainOrError(res, null, 'view', req.user, error, 404);
      else
        sendDomainOrError(res, null, 'view', req.user, error);
    } else {
      if (req.ypCommunity && req.ypCommunity.id) {
        log.info('Domain Lookup Found Community', { community: req.ypCommunity.hostname, context: 'index', user: toJson(req.user) });
        res.send({community: req.ypCommunity, domain: domain});
      } else {
        log.info('Domain Lookup Found Domain', { domainId: domain ? domain.id : -1, context: 'index', userId: req.user ? req.user.id : -1 });
        res.send({domain: domain})
      }
    }
  });
});

router.get('/', function(req, res) {
  if (req.ypDomain.secret_api_keys &&
    req.ypDomain.secret_api_keys.saml && req.ypDomain.secret_api_keys.saml.entryPoint &&
    req.ypDomain.secret_api_keys.saml.entryPoint.length > 6) {
    req.ypDomain.dataValues.samlLoginProvided = true;
  }
  if (req.ypDomain.secret_api_keys &&
    req.ypDomain.secret_api_keys.facebook && req.ypDomain.secret_api_keys.facebook.client_secret &&
    req.ypDomain.secret_api_keys.facebook.client_secret.length > 6) {
    req.ypDomain.dataValues.facebookLoginProvided = true;
  }

  if (process.env.GOOGLE_MAPS_API_KEY) {
    req.ypDomain.dataValues.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  }

  if (process.env.ZIGGEO_ENABLED) {
    req.ypDomain.dataValues.ziggeoEnabled = process.env.ZIGGEO_ENABLED;
  }

  if (process.env.OPENAI_API_KEY) {
    req.ypDomain.dataValues.hasLlm = true;
  }

  if (process.env.CESIUM_ACCESS_TOKEN) {
    req.ypDomain.dataValues.ionToken = process.env.CESIUM_ACCESS_TOKEN;
  }

  if (process.env.LOGIN_CALLBACK_CUSTOM_HOSTNAME) {
    req.ypDomain.dataValues.loginCallbackCustomHostName = process.env.LOGIN_CALLBACK_CUSTOM_HOSTNAME;
  }

  const domain = {...req.ypDomain.dataValues}

  delete domain["secret_api_keys"];
  delete domain["user_agent"];
  delete domain["ip_address"];

  res.send({community: (req.ypCommunity && req.ypCommunity.id) ? req.ypCommunity : undefined, domain: domain});
});

router.get('/:id/translatedText', auth.can('view domain'), function(req, res) {
  if (req.query.textType.indexOf("domain") > -1) {
    models.Domain.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id','name','description','configuration']
    }).then(function(domain) {
      if (domain) {
        models.AcTranslationCache.getTranslation(req, domain, function (error, translation) {
          if (error) {
            sendDomainOrError(res, req.params.id, 'translated', req.user, error, 500);
          } else {
            res.send(translation);
          }
        });
        log.info('Domain translatedTitle', {  context: 'translated' });
      } else {
        sendDomainOrError(res, req.params.id, 'translated', req.user, 'Not found', 404);
      }
    }).catch(function(error) {
      sendDomainOrError(res, null, 'translated', req.user, error);
    });
  } else {
    sendDomainOrError(res, req.params.id, 'translated', req.user, 'Wrong textType', 401);
  }
});

router.get('/:id', auth.can('view domain'), function(req, res) {
  if (isValidDbId(req.params.id)) {
    getDomain(req, req.params.id, function (error, domain) {
      if (error) {
        sendDomainOrError(res, null, 'view', req.user, error);
      } else {
        log.info('Domain Viewed', { id: domain ? domain.id : -1, userId: req.user ? req.user.id : null });
        res.send(domain);
      }
    });
  } else {
    res.sendStatus(404);
  }
});

router.put('/:id', auth.can('edit domain'), function(req, res) {
  models.Domain.findOne({
    where: { id: req.params.id }
  }).then(function(domain) {
    if (domain) {
      queue.add('process-similarities', { type: 'update-collection', domainId: domain.id }, 'low');
      domain.ensureApiKeySetup();
      domain.set('secret_api_keys.facebook.client_id', req.body.facebookClientId);
      domain.set('secret_api_keys.facebook.client_secret', req.body.facebookClientSecret);
      domain.set('secret_api_keys.google.client_id', req.body.googleClientId);
      domain.set('secret_api_keys.google.client_secret', req.body.googleClientSecret);
      domain.set('secret_api_keys.twitter.client_id', req.body.twitterClientId);
      domain.set('secret_api_keys.twitter.client_secret', req.body.twitterClientSecret);
      domain.set('secret_api_keys.github.client_id', req.body.githubClientId);
      domain.set('secret_api_keys.github.client_secret', req.body.githubClientSecret);


      domain.set('configuration.welcomeHtmlInsteadOfCommunitiesList',
        (req.body.welcomeHtmlInsteadOfCommunitiesList && req.body.welcomeHtmlInsteadOfCommunitiesList!="") ? req.body.welcomeHtmlInsteadOfCommunitiesList : null);

      domain.set('configuration.hideAppBarIfWelcomeHtml', truthValueFromBody(req.body.hideAppBarIfWelcomeHtml));

      if (req.body.samlEntryPoint) {
        domain.set('secret_api_keys.saml.entryPoint', req.body.samlEntryPoint);
        domain.set('secret_api_keys.saml.callbackUrl', req.body.samlCallbackUrl);
        domain.set('secret_api_keys.saml.cert', req.body.samlCert);
        domain.set('secret_api_keys.saml.issuer', req.body.samlIssuer);
        domain.set('secret_api_keys.saml.identifierFormat', req.body.samlIdentifierFormat);
      }

      if (!domain.configuration) {
        domain.set('configuration', {});
      }

      domain.set('configuration.customSamlLoginText', (req.body.customSamlLoginText && req.body.customSamlLoginText!="") ? req.body.customSamlLoginText : null);
      domain.set('configuration.samlLoginButtonUrl', (req.body.samlLoginButtonUrl && req.body.samlLoginButtonUrl!="") ? req.body.samlLoginButtonUrl : null);
      domain.set('configuration.customSAMLErrorHTML', (req.body.customSAMLErrorHTML && req.body.customSAMLErrorHTML!="") ? req.body.customSAMLErrorHTML : null);

      domain.set('configuration.preloadCssUrl', (req.body.preloadCssUrl && req.body.preloadCssUrl!="") ? req.body.preloadCssUrl : null);

      domain.set('configuration.plausibleDataDomains', (req.body.plausibleDataDomains && req.body.plausibleDataDomains!="") ? req.body.plausibleDataDomains : null);
      domain.set('configuration.ziggeoApplicationToken', (req.body.ziggeoApplicationToken && req.body.ziggeoApplicationToken!="") ? req.body.ziggeoApplicationToken : null);
      domain.set('configuration.ga4Tag', (req.body.ga4Tag && req.body.ga4Tag!="") ? req.body.ga4Tag : null);

      if (req.body.google_analytics_code && req.body.google_analytics_code!="") {
        domain.google_analytics_code = req.body.google_analytics_code;
      } else {
        domain.google_analytics_code = null;
      }

      const ltpConfigText = (req.body.ltp && req.body.ltp!="") ? req.body.ltp : null;

      if (ltpConfigText) {
        try {
          const cleaned = ltpConfigText.trim().replace(/\n/g, '').replace(/\r/g, '');
          const parsedJson = JSON.parse(cleaned);
          domain.set('configuration.ltp', parsedJson);
        } catch (error) {
          domain.set('configuration.ltp', null);
          log.error("Error in parsing ltp", {error});
        }
      } else {
        domain.set('configuration.ltp', null);
      }

      const theme = (req.body.theme && req.body.theme!="") ? req.body.theme : null;

      if (theme) {
        try {
          const cleaned = theme.trim().replace(/\n/g, '').replace(/\r/g, '');
          const parsedJson = JSON.parse(cleaned);
          domain.set('configuration.theme', parsedJson);
        } catch (error) {
          domain.set('configuration.theme', null);
          log.error("Error in parsing theme", {error});
        }
      } else {
        domain.set('configuration.theme', null);
      }

      domain.set('configuration.customUserRegistrationText', (req.body.customUserRegistrationText && req.body.customUserRegistrationText!="") ? req.body.customUserRegistrationText : null);
      domain.set('configuration.forceSecureSamlEmployeeLogin', (req.body.forceSecureSamlEmployeeLogin && req.body.forceSecureSamlEmployeeLogin!="") ? true : false);

      domain.set('configuration.disableNameAutoTranslation', (req.body.disableNameAutoTranslation && req.body.disableNameAutoTranslation!="") ? true : false);



      if (req.body.appHomeScreenIconImageId && req.body.appHomeScreenIconImageId!="") {
        domain.set('configuration.appHomeScreenIconImageId', req.body.appHomeScreenIconImageId);
      }

      domain.set('configuration.appHomeScreenShortName', (req.body.appHomeScreenShortName && req.body.appHomeScreenShortName!="")? req.body.appHomeScreenShortName : null);
      domain.set('configuration.useVideoCover', truthValueFromBody(req.body.useVideoCover));
      domain.set('configuration.hideDomainNews', truthValueFromBody(req.body.hideDomainNews));
      domain.set('configuration.hideDomainTabs', truthValueFromBody(req.body.hideDomainTabs));
      domain.set('configuration.hideAllTabs', truthValueFromBody(req.body.hideAllTabs));

      domain.name = req.body.name;
      domain.description = req.body.description;
      domain.only_admins_can_create_communities = req.body.onlyAdminsCanCreateCommunities ? true : false;
      domain.theme_id = req.body.themeId ? parseInt(req.body.themeId) : null;
      if (req.body.defaultLocale && req.body.defaultLocale!="") {
        domain.default_locale = req.body.defaultLocale;
      }
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
  models.Domain.findOne({
    where: {id: req.params.id}
  }).then(function (domain) {
    if (domain) {
      domain.deleted = true;
      domain.save().then(function () {
        log.info('Domain Deleted', { group: toJson(group), context: 'delete', user: toJson(req.user) });
        queue.add('process-similarities', { type: 'update-collection', domainId: domain.id }, 'low');
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
  models.AcActivity.findOne({
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

// MODERATION

router.delete('/:domainId/:itemId/:itemType/:actionType/process_one_moderation_item', auth.can('edit domain'), (req, res) => {
  performSingleModerationAction(req, res, {
    domainId: req.params.domainId,
    itemId: req.params.itemId,
    itemType: req.params.itemType,
    actionType: req.params.actionType
  });
});

router.delete('/:domainId/:actionType/process_many_moderation_item', auth.can('edit domain'), (req, res) => {
  queue.add('process-moderation', {
      type: 'perform-many-moderation-actions',
      items: req.body.items,
      actionType: req.params.actionType,
      domainId: req.params.domainId
    }, 'critical');
  res.send({});
});

router.get('/:domainId/flagged_content', auth.can('edit domain'), (req, res) => {
  getAllModeratedItemsByDomain({ domainId: req.params.domainId }, (error, items) => {
    if (error) {
      log.error("Error getting items for moderation", { error });
      res.sendStatus(500)
    } else {
      res.send(items);
    }
  });
});

router.get('/:domainId/moderate_all_content', auth.can('edit domain'), (req, res) => {
  getAllModeratedItemsByDomain({ domainId: req.params.domainId, allContent: true }, (error, items) => {
    if (error) {
      log.error("Error getting items for moderation", { error });
      res.sendStatus(500)
    } else {
      res.send(items);
    }
  });
});

router.get('/:domainId/flagged_content_count',  auth.can('edit domain'), (req, res) => {
  countAllModeratedItemsByDomain({ domainId: req.params.domainId }, (error, count) => {
    if (error) {
      log.error("Error getting items for moderation", { error });
      res.sendStatus(500)
    } else {
      res.send({ count });
    }
  });
});

router.delete('/:domainId/remove_many_admins', auth.can('edit domain'), (req, res) => {
  queue.add('process-deletion', { type: 'remove-many-domain-admins', userIds: req.body.userIds, domainId: req.params.domainId }, 'high');
  log.info('Remove many domain admins started', { context: 'remove_many_admins', domainId: req.params.domainId, user: toJson(req.user.simple()) });
  res.sendStatus(200);
});

router.delete('/:domainId/remove_many_users_and_delete_content', auth.can('edit domain'), function(req, res) {
  queue.add('process-deletion', { type: 'remove-many-domain-users-and-delete-content', userIds: req.body.userIds, domainId: req.params.domainId }, 'high');
  log.info('Remove many and delete many domain users content', { context: 'remove_many_users_and_delete_content', domainId: req.params.domainId, user: toJson(req.user.simple()) });
  res.sendStatus(200);
});

router.delete('/:domainId/remove_many_users', auth.can('edit domain'), function(req, res) {
  queue.add('process-deletion', { type: 'remove-many-domain-users', userIds: req.body.userIds, domainId: req.params.domainId }, 'high');
  log.info('Remove many domain admins started', { context: 'remove_many_users', domainId: req.params.domainId, user: toJson(req.user.simple()) });
  res.sendStatus(200);
});

router.delete('/:domainId/:userId/remove_and_delete_user_content', auth.can('edit domain'), function(req, res) {
  getDomainAndUser(req.params.domainId, req.params.userId, null, function (error, domain, user) {
    if (error) {
      log.error('Could not remove_user', { err: error, domainId: req.params.domainId, userRemovedId: req.params.userId, context: 'remove_user', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else if (user && domain) {
      domain.removeDomainUsers(user).then(function (results) {
        queue.add('process-deletion', { type: 'delete-domain-user-content', userId: req.params.userId, domainId: req.params.domainId }, 'high');
        log.info('User removed from domain', {context: 'remove_and_delete_user_content', domainId: req.params.domainId, userRemovedId: req.params.userId, user: toJson(req.user.simple()) });
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(404);
    }
  });
});

router.delete('/:domainId/:userId/remove_admin', auth.can('edit domain'), function(req, res) {
  getDomainAndUser(req.params.domainId, req.params.userId, null, function (error, domain, user) {
    if (error) {
      log.error('Could not remove admin', { err: error, domainId: req.params.domainId, userRemovedId: req.params.userId, context: 'remove_admin', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(500);
    } else if (user && domain) {
      domain.removeDomainAdmins(user).then(function (results) {
        log.info('Admin removed', {context: 'remove_admin', domainId: req.params.domainId, userRemovedId: req.params.userId, user: req.user ? toJson(req.user.simple()) : null });
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(404);
    }
  });
});

router.post('/:domainId/:email/add_admin', auth.can('edit domain'), function(req, res) {
  getDomainAndUser(req.params.domainId, null, req.params.email, function (error, domain, user) {
    if (error) {
      log.error('Could not add admin', { err: error, domainId: req.params.domainId, userAddEmail: req.params.email, context: 'remove_admin', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(500);
    } else if (user && domain) {
      domain.addDomainAdmins(user).then(function (results) {
        log.info('Admin Added', {context: 'add_admin', domainId: req.params.domainId, userAddEmail: req.params.email, user: req.user ? toJson(req.user.simple()) : null });
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(404);
    }
  });
});

router.delete('/:domainId/:userId/remove_user', auth.can('edit domain'), function(req, res) {
  getDomainAndUser(req.params.domainId, req.params.userId, null, function (error, domain, user) {
    if (error) {
      log.error('Could not remove_user', { err: error, domainId: req.params.domainId, userRemovedId: req.params.userId, context: 'remove_user', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(500);
    } else if (user && domain) {
      domain.removeDomainUsers(user).then(function (results) {
        if (domain.counter_users > 0) {
          domain.decrement("counter_users")
        }
        log.info('User removed', {context: 'remove_user', domainId: req.params.domainId, userRemovedId: req.params.userId, user: req.user ? toJson(req.user.simple()) : null });
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(404);
    }
  });
});

router.get('/:domainId/export_logins', auth.can('edit domain'), function(req, res) {
  getLoginsExportDataForDomain(req.params.domainId, req.ypDomain.domain_name, function (error, fileData) {
    if (error) {
      log.error('Could not export logins for domain', { err: error, context: 'export_group', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      models.Domain.findOne({
        where: {
          id: req.params.domainId
        },
        attributes: ["id", "name"]
      }).then(function (model) {
        if (model) {
          log.info('Got Login Exports', {context: 'export_logins', user: toJson(req.user.simple()) });
          var domainName = sanitizeFilename(model.name).replace(/ /g,'');
          var dateString = moment(new Date()).format("DD_MM_YY_HH_mm");
          var filename = 'logins_export_for_domain_id_'+model.id+'_'+
            domainName+'_'+dateString+'.csv';
          res.set({ 'content-type': 'application/octet-stream; charset=utf-8' });
          res.charset = 'utf-8';
          res.attachment(filename);
          res.send(fileData);
        } else {
          log.error('Cant find domain', { err: error, context: 'export_logins', user: toJson(req.user.simple()) });
          res.sendStatus(404);
        }
      }).catch(function (error) {
        log.error('Could not export for domain', { err: error, context: 'export_logins', user: toJson(req.user.simple()) });
        res.sendStatus(500);
      });
    }
  });
});

// WORD CLOUD
router.get('/:id/wordcloud', auth.can('edit domain'), function(req, res) {
  getFromAnalyticsApi(req,"wordclouds", "domain", req.params.id, function (error, content) {
    sendBackAnalyticsResultsOrError(req,res,error,content);
  });
});

// SIMILARITIES
router.get('/:id/similarities_weights', auth.can('edit domain'), function(req, res) {
  getFromAnalyticsApi(req,"similarities_weights", "domain", req.params.id, function (error, content) {
    sendBackAnalyticsResultsOrError(req,res,error ? error : content.body ? null : 'noBody', getParsedSimilaritiesContent(content));
  });
});

// STATS
router.get('/:id/stats_posts', auth.can('edit domain'), function(req, res) {
  countModelRowsByTimePeriod(req,"stats_posts"+req.params.id+"_domain", models.Post, {}, getDomainIncludes(req.params.id), (error, results) => {
    sendBackAnalyticsResultsOrError(req,res,error, results);
  });
});

router.get('/:id/stats_points', auth.can('edit domain'), function(req, res) {
  countModelRowsByTimePeriod(req,"stats_points"+req.params.id+"_domain", models.Point, {}, getPointDomainIncludes(req.params.id), (error, results) => {
    sendBackAnalyticsResultsOrError(req,res,error, results);
  });
});

router.get('/:id/stats_votes', auth.can('edit domain'), function(req, res) {
  countModelRowsByTimePeriod(req,"stats_votes_"+req.params.id+"_domain", models.AcActivity, {
    type: {
      $in: [
        "activity.post.opposition.new","activity.post.endorsement.new",
        "activity.point.helpful.new","activity.point.unhelpful.new"
      ]
    }
  }, getDomainIncludes(req.params.id), (error, results) => {
    sendBackAnalyticsResultsOrError(req,res,error,results);
  });
});


router.put('/:domainId/plausibleStatsProxy', auth.can('edit domain'), async (req, res) => {
  try {
    const plausibleData = await plausibleStatsProxy(req.body.plausibleUrl, { domainId: req.params.domainId });
    res.send(plausibleData);
  } catch (error) {
    log.error('Could not get plausibleStatsProxy', { err: error, context: 'getPlausibleSeries', user: toJson(req.user.simple()) });
    res.sendStatus(500);
  }
});

router.get('/:domainId/get_campaigns', auth.can('edit domain'), async (req, res) => {
  try {
    const campaigns = await models.Campaign.findAll({
      where: {
        domain_id: req.params.domainId,
        active: true
      },
      order: [
        [ 'created_at', 'desc' ]
      ],
      attributes: ['id','configuration']
    });
    res.send(campaigns);
  } catch (error) {
    log.error('Could not get campaigns', { err: error, context: 'get_campaigns', user: toJson(req.user.simple()) });
    res.sendStatus(500);
  }
});

router.post('/:domainId/create_campaign', auth.can('edit domain'), async (req, res) => {
  try {
    const campaign = models.Campaign.build({
      domain_id: req.params.domainId,
      configuration: req.body.configuration,
      user_id: req.user.id
    });

    await campaign.save();
    //TODO: Toxicity check

    res.send(campaign);
  } catch (error) {
    log.error('Could not create_campaign campaigns', { err: error, context: 'create_campaign', user: toJson(req.user.simple()) });
    res.sendStatus(500);
  }
});

router.put('/:domainId/:campaignId/update_campaign', auth.can('edit domain'), async (req, res) => {
  try {
    const campaign = await models.Campaign.findOne({
      where: {
        id: req.params.campaignId,
        domain_id: req.params.domainId
      },
      attributes: ['id','configuration']
    });

    campaign.configuration = req.body.configuration;

    await campaign.save();
    //TODO: Toxicity check

    res.send(campaign);
  } catch (error) {
    log.error('Could not create_campaign campaigns', { err: error, context: 'create_campaign', user: toJson(req.user.simple()) });
    res.sendStatus(500);
  }
});

router.delete('/:domainId/:campaignId/delete_campaign', auth.can('edit domain'), async (req, res) => {
  try {
    const campaign = await models.Campaign.findOne({
      where: {
        id: req.params.campaignId,
        domain_id: req.params.domainId
      },
      attributes: ['id']
    });

    campaign.deleted = true;
    await campaign.save();
    res.sendStatus(200);
  } catch (error) {
    log.error('Could not delete_campaign campaigns', { err: error, context: 'delete_campaign', user: toJson(req.user.simple()) });
    res.sendStatus(500);
  }
});

//TODO: Move permission back to edit after figuring out how
router.post('/:domainId/:start_generating/ai_image', auth.can('view domain'), function(req, res) {
  models.AcBackgroundJob.createJob({}, {}, (error, jobId) => {
    if (error) {
      log.error('Could not create backgroundJob', { err: error, context: 'start_generating_ai_image', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      queue.add('process-generative-ai', {
        type: "collection-image",
        userId: req.user.id,
        jobId: jobId,
        collectionId: req.params.domainId,
        collectionType: "domain",
        prompt: req.body.prompt,
        imageType: req.body.imageType
      }, 'critical');

      res.send({ jobId });
    }
  });
});

//TODO: Move permission back to edit after figuring out how
router.get('/:domainId/:jobId/poll_for_generating_ai_image', auth.can('view domain'), function(req, res) {
  models.AcBackgroundJob.findOne({
    where: {
      id: req.params.jobId
    },
    attributes: ['id','progress','error','data']
  }).then( job => {
    res.send(job);
  }).catch( error => {
    log.error('Could not get backgroundJob', { err: error, context: 'poll_for_generating_ai_image', user: toJson(req.user.simple()) });
    res.sendStatus(500);
  });
});


module.exports = router;
