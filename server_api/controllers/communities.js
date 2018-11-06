var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var _ = require('lodash');
var async = require('async');
var crypto = require("crypto");
var queue = require('../active-citizen/workers/queue');

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
        models.User.find({
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
      callback(null, community, user);
    }
  });
};

var getCommunity = function(req, done) {
  var community;

  async.series([
    function (seriesCallback) {
      models.Community.find({
        where: { id: req.params.id },
        order: [
          [ { model: models.Group }, 'counter_users', 'desc' ],
          [ { model: models.Image, as: 'CommunityLogoImages' } , 'created_at', 'asc' ],
          [ { model: models.Image, as: 'CommunityHeaderImages' } , 'created_at', 'asc' ],
          [ models.Group, { model: models.Image, as: 'GroupLogoImages' }, 'created_at', 'asc' ],
          [ { model: models.Video, as: "CommunityLogoVideos" }, 'updated_at', 'desc' ]
        ],
        attributes: models.Community.defaultAttributesPublic,
        include: [
          {
            model: models.Domain,
            attributes: models.Domain.defaultAttributesPublic
          },
          {
            model: models.Image,
            as: 'CommunityLogoImages',
            attributes:  models.Image.defaultAttributesPublic,
            required: false
          },
          {
            model: models.Image,
            as: 'CommunityHeaderImages',
            attributes:  models.Image.defaultAttributesPublic,
            required: false
          },
          {
            model: models.Video,
            as: 'CommunityLogoVideos',
            attributes:  ['id','formats','viewable'],
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
                model: models.Image,
                as: 'GroupLogoImages',
                attributes:  models.Image.defaultAttributesPublic,
                required: false
              }
            ]
          }
        ]
      }).then(function(communityIn) {
        community = communityIn;
        if (community) {
          log.info('Community Viewed', { community: toJson(community.simple()), context: 'view', user: toJson(req.user) });
          seriesCallback()
        } else {
          seriesCallback("Not found");
        }
        return null;
      }).catch(function(error) {
        seriesCallback(error);
      });
    },
    function (seriesCallback) {
      if (req.user && community) {
        var adminGroups, userGroups;

        async.parallel(
          [
          function (parallelCallback) {
            models.Group.findAll({
              where: {
                community_id: community.id
              },
              order: [
                [ 'counter_users', 'desc'],
                [ {model: models.Image, as: 'GroupLogoImages'}, 'created_at', 'asc']
              ],
              include: [
                {
                  model: models.Image, as: 'GroupLogoImages',
                  required: false
                },
                {
                  model: models.User,
                  as: 'GroupAdmins',
                  attributes: ['id'],
                  required: true,
                  where: {
                    id: req.user.id
                  }
                }
              ]
            }).then(function (groups) {
              adminGroups = groups;
              parallelCallback(null, "admin");
            }).catch(function (error) {
              parallelCallback(error)
            });
          },

          function (parallelCallback) {
            models.Group.findAll({
              where: {
                community_id: community.id
              },
              order: [
                [ 'counter_users', 'desc'],
                [ {model: models.Image, as: 'GroupLogoImages'}, 'created_at', 'asc']
              ],
              include: [
                {
                  model: models.Image, as: 'GroupLogoImages',
                  required: false
                },
                {
                  model: models.User,
                  as: 'GroupUsers',
                  attributes: ['id'],
                  required: true,
                  where: {
                    id: req.user.id
                  }
                }
              ]
            }).then(function (groups) {
              userGroups = groups;
              parallelCallback(null, "users");
            }).catch(function (error) {
              parallelCallback(error)
            });
          }
        ], function (error) {
          var combinedGroups = _.concat(userGroups, community.dataValues.Groups);
          if (adminGroups) {
            combinedGroups = _.concat(adminGroups, combinedGroups);
          }
          combinedGroups = _.uniqBy(combinedGroups, function (group) {
            if (!group) {
              log.error("Can't find group in combinedGroups", { combinedGroupsL: combinedGroups.length, err: "Cant find group in combinedGroups" });
              return null;
            } else {
              return group.id;
            }
          });

          community.dataValues.Groups = combinedGroups;

          seriesCallback(error);
        });
      } else {
        seriesCallback();
      }
    }
  ], function (error) {
    done(error, community);
  });
};

var truthValueFromBody = function(bodyParameter) {
  return (bodyParameter && bodyParameter!=="");
};

var updateCommunityConfigParameters = function (req, community) {
  if (!community.configuration) {
    community.set('configuration', {});
  }
  community.set('configuration.alternativeHeader', (req.body.alternativeHeader && req.body.alternativeHeader!="") ? req.body.alternativeHeader : null);
  community.set('configuration.disableDomainUpLink', (req.body.disableDomainUpLink && req.body.disableDomainUpLink!="") ? true : false);
  community.set('configuration.defaultLocationLongLat', (req.body.defaultLocationLongLat && req.body.defaultLocationLongLat!="") ? req.body.defaultLocationLongLat : null);
  community.set('configuration.facebookPixelId', (req.body.facebookPixelId && req.body.facebookPixelId!="") ? req.body.facebookPixelId : null);
  community.set('configuration.disableNameAutoTranslation', (req.body.disableNameAutoTranslation && req.body.disableNameAutoTranslation!="") ? true : false);

  community.set('configuration.welcomeHTML', (req.body.welcomeHTML && req.body.welcomeHTML!="") ? req.body.welcomeHTML : null);

  if (req.body.google_analytics_code && req.body.google_analytics_code!="") {
    community.google_analytics_code = req.body.google_analytics_code;
  } else {
    community.google_analytics_code = null;
  }

  community.only_admins_can_create_groups = req.body.onlyAdminsCanCreateGroups ? true : false;

  if (req.body.defaultLocale && req.body.defaultLocale!="") {
    community.default_locale = req.body.defaultLocale;
  }

  community.theme_id = req.body.themeId ? parseInt(req.body.themeId) : null;

  if (req.body.status && req.body.status!="") {
    community.status = req.body.status;
  }

  if (truthValueFromBody(req.body.appHomeScreenIconImageId)) {
    community.set('configuration.appHomeScreenIconImageId', req.body.appHomeScreenIconImageId);
  }

  community.set('configuration.appHomeScreenShortName', (req.body.appHomeScreenShortName && req.body.appHomeScreenShortName!=null)? req.body.appHomeScreenShortName : null);
  community.set('configuration.signupTermsPageId', (req.body.signupTermsPageId && req.body.signupTermsPageId!="") ? req.body.signupTermsPageId : null);
  community.set('configuration.useVideoCover', truthValueFromBody(req.body.useVideoCover));
};

router.delete('/:communityId/:activityId/delete_activity', auth.can('edit community'), function(req, res) {
  models.AcActivity.find({
    where: {
      community_id: req.params.communityId,
      id: req.params.activityId
    }
  }).then(function (activity) {
    activity.deleted = true;
    activity.save().then(function () {
      res.send( { activityId: activity.id });
    })
  }).catch(function (error) {
    log.error('Could not delete activity for community', {
      err: error,
      context: 'delete_activity',
      user: toJson(req.user.simple())
    });
    res.sendStatus(500);
  });
});

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

router.post('/:communityId/:userEmail/invite_user', auth.can('edit community'), function(req, res) {
  var invite, user, token;
  async.series([
    function(callback) {
      crypto.randomBytes(20, function(error, buf) {
        token = buf.toString('hex');
        callback(error);
      });
    },
    function(callback) {
      models.User.find({
        where: { email: req.params.userEmail },
        attributes: ['id','email']
      }).then(function (userIn) {
        if (userIn) {
          user = userIn;
        }
        callback();
      }).catch(function (error) {
        callback(error);
      });
    },
    function(callback) {
      models.Invite.create({
        token: token,
        expires_at: Date.now() + (3600000*24*30*365*1000),
        type: models.Invite.INVITE_TO_COMMUNITY,
        community_id: req.params.communityId,
        user_id: user ? user.id : null,
        from_user_id: req.user.id,
        metadata:  { toEmail: req.params.userEmail}
      }).then(function (inviteIn) {
        if (inviteIn) {
          invite = inviteIn;
          callback();
        } else {
          callback('Invite not found')
        }
      }).catch(function (error) {
        callback(error);
      });
    },
    function(callback) {
      models.AcActivity.inviteCreated({
        email: req.params.userEmail,
        user_id: user ? user.id : null,
        sender_user_id: req.user.id,
        community_id: req.params.communityId,
        sender_name: req.user.name,
        domain_id: req.ypDomain.id,
        invite_id: invite.id,
        token: token}, function (error) {
        callback(error);
      });
    }
  ], function(error) {
    if (error) {
      log.error('Send Invite Error', { user: user ? toJson(user) : null, context: 'invite_user_community', loggedInUser: toJson(req.user), err: error, errorStatus: 500 });
      res.sendStatus(500);
    } else {
      log.info('Send Invite Activity Created', { userEmail: req.params.userEmail, user: user ? toJson(user) : null, context: 'invite_user_community', loggedInUser: toJson(req.user) });
      res.sendStatus(200);
    }
  });
});

router.delete('/:communityId/remove_many_admins', auth.can('edit community'), (req, res) => {
  queue.create('process-deletion', { type: 'remove-many-community-admins', userIds: req.body.userIds, communityId: req.params.communityId }).
        priority('high').removeOnComplete(true).save();
  log.info('Remove many community admins started', { context: 'remove_many_admins', communityId: req.params.communityId, user: toJson(req.user.simple()) });
  res.sendStatus(200);
});

router.delete('/:communityId/remove_many_users_and_delete_content', auth.can('edit community'), function(req, res) {
  queue.create('process-deletion', { type: 'remove-many-community-users-and-delete-content', userIds: req.body.userIds, communityId: req.params.communityId }).
        priority('high').removeOnComplete(true).save();
  log.info('Remove many and delete many community users content', { context: 'remove_many_users_and_delete_content', communityId: req.params.communityId, user: toJson(req.user.simple()) });
  res.sendStatus(200);
});

router.delete('/:communityId/remove_many_users', auth.can('edit community'), function(req, res) {
  queue.create('process-deletion', { type: 'remove-many-community-users', userIds: req.body.userIds, communityId: req.params.communityId }).
        priority('high').removeOnComplete(true).save();
  log.info('Remove many community admins started', { context: 'remove_many_users', communityId: req.params.communityId, user: toJson(req.user.simple()) });
  res.sendStatus(200);
});

router.delete('/:communityId/:userId/remove_and_delete_user_content', auth.can('edit community'), function(req, res) {
  getCommunityAndUser(req.params.communityId, req.params.userId, null, function (error, community, user) {
    if (error) {
      log.error('Could not remove_user', { err: error, communityId: req.params.communityId, userRemovedId: req.params.userId, context: 'remove_user', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else if (user && community) {
      community.removeCommunityUsers(user).then(function (results) {
        if (community.counter_users>0) {
          community.decrement("counter_users");
        }
        queue.create('process-deletion', { type: 'delete-community-user-content', userId: req.params.userId, communityId: req.params.communityId }).
        priority('high').removeOnComplete(true).save();
        log.info('User removed from community', {context: 'remove_and_delete_user_content', communityId: req.params.communityId, userRemovedId: req.params.userId, user: toJson(req.user.simple()) });
        res.sendStatus(200);
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

router.delete('/:communityId/:userId/remove_user', auth.can('edit community'), function(req, res) {
  getCommunityAndUser(req.params.communityId, req.params.userId, null, function (error, community, user) {
    if (error) {
      log.error('Could not remove_user', { err: error, communityId: req.params.communityId, userRemovedId: req.params.userId, context: 'remove_user', user: req.user ? toJson(req.user.simple()) : null });
      res.sendStatus(500);
    } else if (user && community) {
      community.removeCommunityUsers(user).then(function (results) {
        if (community.counter_users > 0) {
          community.decrement("counter_users")
        }
        log.info('User removed', {context: 'remove_user', communityId: req.params.communityId, userRemovedId: req.params.userId, user: req.user ? toJson(req.user.simple()) : null });
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
      return null;
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

router.get('/:communityId/admin_users', auth.can('edit community'), function (req, res) {
  models.Community.find({
    where: {
      id: req.params.communityId
    },
    include: [
      {
        model: models.User,
        attributes: _.concat(models.User.defaultAttributesWithSocialMediaPublicAndEmail, ['created_at', 'last_login_at']),
        as: 'CommunityAdmins',
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
  }).then(function (community) {
    log.info('Got admin users', { context: 'admin_users', user: toJson(req.user.simple()) });
    if (community) {
      res.send(community.CommunityAdmins);
    } else {
      res.send([]);
    }
  }).catch(function (error) {
    log.error('Could not get admin users', { err: error, context: 'admin_users', user: toJson(req.user.simple()) });
    res.sendStatus(500);
  });
});

router.get('/:communityId/users', auth.can('edit community'), function (req, res) {
  models.Community.find({
    where: {
      id: req.params.communityId
    },
    include: [
      {
        model: models.User,
        attributes: _.concat(models.User.defaultAttributesWithSocialMediaPublicAndEmail, ['created_at', 'last_login_at']),
        as: 'CommunityUsers',
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
  }).then(function (community) {
    log.info('Got users', { context: 'users', user: toJson(req.user.simple()) });
    if (community) {
      res.send(community.CommunityUsers);
    } else {
      res.send([]);
    }
  }).catch(function (error) {
    log.error('Could not get admin users', { err: error, context: 'users', user: toJson(req.user.simple()) });
    res.sendStatus(500);
  });
});

router.get('/:communityId/posts', auth.can('view community'), function (req, res) {
  var where = { status: { $in: ['published','inactive']}, deleted: false };

  var postOrder = "(counter_endorsements_up-counter_endorsements_down) DESC";

  if (req.query.sortBy=="newest") {
    postOrder = "created_at DESC";
  } else if (req.query.sortBy=="most_debated") {
    postOrder = "counter_points DESC";
  } else if (req.query.sortBy=="random") {
    postOrder = "created_at DESC";
  }

  var limit = req.query.limit ? Math.max(req.query.limit, 25) :  7;

  models.Post.findAll({
    where: where,
    attributes: ['id','name','description','status','official_status','counter_endorsements_up','cover_media_type',
      'counter_endorsements_down','counter_points','counter_flags','data','location','created_at'],
    order: [
      models.sequelize.literal(postOrder),
      [ { model: models.Image, as: 'PostHeaderImages' } ,'updated_at', 'asc' ],
      [ { model: models.Group }, { model: models.Image, as: 'GroupLogoImages' } ,'updated_at', 'asc' ]
    ],
    include: [
      {
        model: models.Group,
        required: true,
        where: { access: { $in: [models.Group.ACCESS_OPEN_TO_COMMUNITY, models.Group.ACCESS_PUBLIC]} },
        attributes: ['id','configuration'],
        include: [
          {
            model: models.Image, as: 'GroupLogoImages',
            required: false
          },
          {
            model: models.Community,
            required: true,
            where: {
              id: req.params.communityId
            },
            attributes: ['id','configuration']
          }
        ]
      },
      { model: models.Image,
        attributes: { exclude: ['ip_address', 'user_agent'] },
        as: 'PostHeaderImages',
        required: false
      }
    ]
  }).then(function(posts) {
    log.info('Got posts', { context: 'posts'});
    if (posts) {
      res.send(_.dropRight(posts, limit));
    } else {
      res.send([]);
    }
  }).catch(function (error) {
    log.error('Could not get posts', { err: error, context: 'posts' });
    res.sendStatus(500);
  });
});

router.get('/:id', auth.can('view community'), function(req, res) {
  getCommunity(req, function (error, community) {
    if (community) {
      res.send(community);
    } else if (error) {
      sendCommunityOrError(res, null, 'view', req.user, error);
    } else {
      sendCommunityOrError(res, req.params.id, 'view', req.user, 'Not found', 404);
    }
  });
});

router.get('/:id/translatedText', auth.can('view community'), function(req, res) {
  if (req.query.textType.indexOf("community") > -1) {
    models.Community.find({
      where: {
        id: req.params.id
      },
      attributes: ['id','name','description']
    }).then(function(community) {
      if (community) {
        models.TranslationCache.getTranslation(req, community, function (error, translation) {
          if (error) {
            sendCommunityOrError(res, req.params.id, 'translated', req.user, error, 500);
          } else {
            res.send(translation);
          }
        });
        log.info('Community translatedTitle', {  context: 'translated' });
      } else {
        sendCommunityOrError(res, req.params.id, 'translated', req.user, 'Not found', 404);
      }
    }).catch(function(error) {
      sendCommunityOrError(res, null, 'translated', req.user, error);
    });
  } else {
    sendCommunityOrError(res, req.params.id, 'translated', req.user, 'Wrong textType', 401);
  }
});

router.post('/:domainId', auth.can('create community'), function(req, res) {
  models.Community.find({
    where: {
      hostname: req.body.hostname
    }
  }).then(function (oldCommunity) {
    if (oldCommunity) {
      log.error("Can't save community, hostname already taken", {hostname:  req.body.hostname});
      res.send({hostnameTaken: true, isError: true});
    } else {
      var admin_email = req.user.email;
      var admin_name = "Administrator";
      var community = models.Community.build({
        name: req.body.name,
        description: req.body.description,
        access: models.Community.convertAccessFromRadioButtons(req.body),
        domain_id: req.params.domainId,
        user_id: req.user.id,
        hostname: req.body.hostname,
        website: req.body.website,
        admin_email: admin_email,
        admin_name: admin_name,
        user_agent: req.useragent.source,
        ip_address: req.clientIp
      });

      updateCommunityConfigParameters(req, community);
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
    }
  });
});

router.put('/:id', auth.can('edit community'), function(req, res) {
  models.Community.find({
    where: { id: req.params.id }
  }).then(function(community) {
    if (community) {
      community.name = req.body.name;
      community.description = req.body.description;

      if (req.body.hostname && req.body.hostname!="") {
        community.hostname = req.body.hostname;
      }

      community.access = models.Community.convertAccessFromRadioButtons(req.body);

      updateCommunityConfigParameters(req, community);
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
        queue.create('process-deletion', { type: 'delete-community-content', communityName: community.name, communityId: community.id, userId: req.user.id }).priority('high').removeOnComplete(true).save();
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

router.delete('/:id/delete_content', auth.can('edit community'), function(req, res) {
  models.Community.find({
    where: {id: req.params.id }
  }).then(function (community) {
    if (community) {
      log.info('Community Delete Content', { community: toJson(community), user: toJson(req.user) });
      queue.create('process-deletion', { type: 'delete-community-content', communityName: community.name,
                                         communityId: community.id, userId: req.user.id, useNotification: true,
                                         resetCounters: true }).priority('high').removeOnComplete(true).save();
      res.sendStatus(200);
    } else {
      sendCommunityOrError(res, req.params.id, 'delete', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendCommunityOrError(res, null, 'delete', req.user, error);
  });
});

router.delete('/:id/anonymize_content', auth.can('edit community'), function(req, res) {
  models.Community.find({
    where: {id: req.params.id }
  }).then(function (community) {
    if (community) {
      const anonymizationDelayMs = 1000*60*60*24*7;
      log.info('Community Anonymize Content', { community: toJson(community), user: toJson(req.user) });
      queue.create('process-anonymization', { type: 'notify-community-users', communityName: community.name,
        userId: req.user.id, communityId: community.id, delayMs: anonymizationDelayMs}).
      priority('high').removeOnComplete(true).save();
      queue.create('process-anonymization', { type: 'anonymize-community-content', communityName: community.name,
                                              communityId: community.id, userId: req.user.id, useNotification: true,
                                              resetCounters: true }).
                                              delay(anonymizationDelayMs).priority('high').removeOnComplete(true).save();
      res.sendStatus(200);
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
    order: [
      [ { model: models.Image, as: 'PostHeaderImages' } ,'updated_at', 'asc' ]
    ],
    select: ['id','name','location'],
    include: [
      { model: models.Image,
        as: 'PostHeaderImages',
        required: false
      },
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
