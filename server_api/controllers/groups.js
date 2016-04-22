var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var _ = require('lodash');
var async = require('async');

var sendGroupOrError = function (res, group, context, user, error, errorStatus) {
  if (error || !group) {
    if (errorStatus == 404) {
      log.warn("Group Not Found", { context: context, group: toJson(group), user: toJson(user), err: error,
                                       errorStatus: 404 });
    } else {
      log.error("Group Error", { context: context, group: toJson(group), user: toJson(user), err: error,
                                 errorStatus: errorStatus ? errorStatus : 500 });
    }
    if (errorStatus) {
      res.sendStatus(errorStatus);
    } else {
      res.sendStatus(500);
    }
  } else {
    res.send(group);
  }
};

var getGroupAndUser = function (groupId, userId, userEmail, callback) {
  var user, group;

  async.series([
    function (seriesCallback) {
      models.Group.find({
        where: {
          id: groupId
        }
      }).then(function (groupIn) {
        if (groupIn) {
          group = groupIn;
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
      callback(null, group, user);
    }
  });
};

router.delete('/:groupId/user_membership', auth.isLoggedIn, auth.can('view group'), function(req, res) {
  getGroupAndUser(req.params.groupId, req.user.id, null, function (error, group, user) {
    if (error) {
      log.error('Could not remove user', { err: error, groupId: req.params.groupId, userRemovedId: req.user.id, context: 'user_membership', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else if (user && group) {
      group.removeGroupUsers(user).then(function (results) {
        log.info('User removed', {context: 'remove_admin', groupId: req.params.groupId, userRemovedId: req.user.id, user: toJson(req.user.simple()) });
        res.send({ membershipValue: false, name: group.name });
      });
    } else {
      res.sendStatus(404);
    }
  });
});

router.post('/:groupId/user_membership', auth.isLoggedIn, auth.can('view group'), function(req, res) {
  getGroupAndUser(req.params.groupId, req.user.id, null, function (error, group, user) {
    if (error) {
      log.error('Could not add user', { err: error, groupId: req.params.groupId, userRemovedId: req.user.id, context: 'user_membership', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else if (user && group) {
      group.addGroupUsers(user).then(function (results) {
        log.info('User Added', {context: 'user_membership', groupId: req.params.groupId, userRemovedId: req.user.id, user: toJson(req.user.simple()) });
        res.send({ membershipValue: true, name: group.name });
      });
    } else {
      res.sendStatus(404);
    }
  });
});

router.delete('/:groupId/:userId/remove_admin', auth.can('edit group'), function(req, res) {
  getGroupAndUser(req.params.groupId, req.params.userId, null, function (error, group, user) {
    if (error) {
      log.error('Could not remove admin', { err: error, groupId: req.params.groupId, userRemovedId: req.params.userId, context: 'remove_admin', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else if (user && group) {
      group.removeGroupAdmins(user).then(function (results) {
        log.info('Admin removed', {context: 'remove_admin', groupId: req.params.groupId, userRemovedId: req.params.userId, user: toJson(req.user.simple()) });
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(404);
    }
  });
});

router.post('/:groupId/:email/add_admin', auth.can('edit group'), function(req, res) {
  getGroupAndUser(req.params.groupId, null, req.params.email, function (error, group, user) {
    if (error) {
      log.error('Could not add admin', { err: error, groupId: req.params.groupId, userAddEmail: req.params.email, context: 'remove_admin', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else if (user && group) {
      group.addGroupAdmins(user).then(function (results) {
        log.info('Admin Added', {context: 'add_admin', groupId: req.params.groupId, userAddEmail: req.params.email, user: toJson(req.user.simple()) });
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(404);
    }
  });
});

router.get('/:groupId/pages', auth.can('view group'), function(req, res) {
  models.Group.find({
    where: { id: req.params.groupId},
    attributes: ['id'],
    include: [
      {
        model: models.Community,
        attributes: ['id'],
        include: [
          {
            model: models.Domain,
            attributes: ['id']
          }
        ]
      }
    ]
  }).then(function (group) {
    models.Page.getPages(req, { group_id: req.params.groupId , community_id: group.Community.id, domain_id: group.Community.Domain.id }, function (error, pages) {
      if (error) {
        log.error('Could not get pages for group', { err: error, context: 'pages', user: toJson(req.user.simple()) });
        res.sendStatus(500);
      } else {
        log.info('Got Pages', {context: 'pages', user: toJson(req.user.simple()) });
        res.send(pages);
      }
    });
  }).catch(function (error) {
    log.error('Could not get pages for group', { err: error, context: 'pages', user: toJson(req.user.simple()) });
    res.sendStatus(500);
  });
});

router.get('/:groupId/pages_for_admin', auth.can('edit group'), function(req, res) {
  models.Page.getPagesForAdmin(req, { group_id: req.params.groupId }, function (error, pages) {
    if (error) {
      log.error('Could not get page for admin for group', { err: error, context: 'pages_for_admin', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Got Pages For Admin', {context: 'pages_for_admin', user: toJson(req.user.simple()) });
      res.send(pages);
    }
  });
});

router.post('/:groupId/add_page', auth.can('edit group'), function(req, res) {
  models.Page.newPage(req, { group_id: req.params.groupId, content: {}, title: {} }, function (error, pages) {
    if (error) {
      log.error('Could not create page for admin for group', { err: error, context: 'new_page', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('New Community Page', {context: 'new_page', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.put('/:groupId/:pageId/update_page_locale', auth.can('edit group'), function(req, res) {
  models.Page.updatePageLocale(req, { group_id: req.params.groupId, id: req.params.pageId }, function (error) {
    if (error) {
      log.error('Could not update locale for admin for group', { err: error, context: 'update_page_locale', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Community Page Locale Updated', {context: 'update_page_locale', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.put('/:groupId/:pageId/publish_page', auth.can('edit group'), function(req, res) {
  models.Page.publishPage(req, { group_id: req.params.groupId, id: req.params.pageId }, function (error) {
    if (error) {
      log.error('Could not publish page for admin for group', { err: error, context: 'publish_page', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Community Page Published', {context: 'publish_page', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.put('/:groupId/:pageId/un_publish_page', auth.can('edit group'), function(req, res) {
  models.Page.unPublishPage(req, { group_id: req.params.groupId, id: req.params.pageId }, function (error) {
    if (error) {
      log.error('Could not un-publish page for admin for group', { err: error, context: 'un_publish_page', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Community Page Un-Published', {context: 'un_publish_page', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.delete('/:groupId/:pageId/delete_page', auth.can('edit group'), function(req, res) {
  models.Page.deletePage(req, { group_id: req.params.groupId, id: req.params.pageId }, function (error) {
    if (error) {
      log.error('Could not delete page for admin for group', { err: error, context: 'delete_page', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Commuity Page Published', {context: 'delete_page', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.post('/:groupId/post/news_story', auth.isLoggedIn, auth.can('view group'), function(req, res) {
  models.Point.createNewsStory(req, req.body, function (error) {
    if (error) {
      log.error('Could not save news story point on post', { err: error, context: 'news_story', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Point News Story Created', {context: 'news_story', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.post('/:groupId/news_story', auth.isLoggedIn, auth.can('view group'), function(req, res) {
  models.Point.createNewsStory(req, req.body, function (error) {
    if (error) {
      log.error('Could not save news story point on group', { err: error, context: 'news_story', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Point News Story Created', {context: 'news_story', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.get('/:groupId/admin_users', auth.can('edit group'), function (req, res) {
  models.Group.find({
    where: {
      id: req.params.groupId
    },
    include: [
      {
        model: models.User,
        attributes: _.concat(models.User.defaultAttributesWithSocialMedia, ['created_at', 'last_login_at']),
        as: 'GroupAdmins',
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
  }).then(function (group) {
    log.info('Got admin users', { context: 'admin_users', user: toJson(req.user.simple()) });
    if (group) {
      res.send(group.GroupAdmins);
    } else {
      res.send([]);
    }
  }).catch(function (error) {
    log.error('Could not get admin users', { err: error, context: 'admin_users', user: toJson(req.user.simple()) });
    res.sendStatus(500);
  });
});

router.get('/:groupId/users', auth.can('edit group'), function (req, res) {
  models.Group.find({
    where: {
      id: req.params.groupId
    },
    include: [
      {
        model: models.User,
        attributes: _.concat(models.User.defaultAttributesWithSocialMedia, ['created_at', 'last_login_at']),
        as: 'GroupUsers',
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
  }).then(function (group) {
    log.info('Got users', { context: 'users', user: toJson(req.user.simple()) });
    if (group) {
      res.send(group.GroupUsers);
    } else {
      res.send([]);
    }
  }).catch(function (error) {
    log.error('Could not get admin users', { err: error, context: 'users', user: toJson(req.user.simple()) });
    res.sendStatus(500);
  });
});

router.post('/:communityId', auth.can('create group'), function(req, res) {
  var group = models.Group.build({
    name: req.body.name,
    objectives: req.body.objectives,
    access: models.Community.convertAccessFromRadioButtons(req.body),
    domain_id: req.ypDomain.id,
    user_id: req.user.id,
    community_id: req.params.communityId,
    user_agent: req.useragent.source,
    ip_address: req.clientIp
  });

  group.save().then(function(group) {
    log.info('Group Created', { group: toJson(group), context: 'create', user: toJson(req.user) });
    group.updateAllExternalCounters(req, 'up', 'counter_groups', function () {
      models.Group.addUserToGroupIfNeeded(group.id, req, function () {
        group.addGroupAdmins(req.user).then(function (results) {
          group.setupImages(req.body, function(error) {
            sendGroupOrError(res, group, 'setupImages', req.user, error);
          });
        });
      });
    })
  }).catch(function(error) {
    sendGroupOrError(res, null, 'create', req.user, error);
  });
});

router.put('/:id', auth.can('edit group'), function(req, res) {
  models.Group.find({
    where: {id: req.params.id }
  }).then(function (group) {
    if (group) {
      group.name =req.body.name;
      group.objectives = req.body.objectives;
      group.theme_id = parseInt(req.body.themeId);
      group.access = models.Community.convertAccessFromRadioButtons(req.body);
      if (req.body.status && req.body.status!="") {
        group.status = req.body.status;
      }
      group.save().then(function () {
        log.info('Group Updated', { group: toJson(group), context: 'update', user: toJson(req.user) });
        group.setupImages(req.body, function(error) {
          sendGroupOrError(res, group, 'setupImages', req.user, error);
        });
      });
    } else {
      sendGroupOrError(res, req.params.id, 'update', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendGroupOrError(res, null, 'update', req.user, error);
  });
});

router.delete('/:id', auth.can('edit group'), function(req, res) {
  models.Group.find({
    where: {id: req.params.id }
  }).then(function (group) {
    if (group) {
      group.deleted = true;
      group.save().then(function () {
        log.info('Group Deleted', { group: toJson(group), context: 'delete', user: toJson(req.user) });
        group.updateAllExternalCounters(req, 'down', 'counter_groups', function () {
          res.sendStatus(200);
        });
      });
    } else {
      sendGroupOrError(res, req.params.id, 'delete', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendGroupOrError(res, null, 'delete', req.user, error);
  });
});

router.get('/:id', auth.can('view group'), function(req, res) {
  models.Group.find({
    where: { id: req.params.id },
    order: [
      [ { model: models.Image, as: 'GroupLogoImages' } , 'created_at', 'asc' ],
      [ { model: models.Image, as: 'GroupHeaderImages' } , 'created_at', 'asc' ]
    ],
    include: [
      {
        model: models.Community,
        attributes: ['id','theme_id'],
        include: [
          {
            model: models.Domain,
            attributes: ['id','theme_id']
          }
        ]
      },
      {
        model: models.Category,
        required: false,
        include: [
          {
            model: models.Image,
            required: false,
            as: 'CategoryIconImages',
            order: [
              [ { model: models.Image, as: 'CategoryIconImages' } ,'updated_at', 'asc' ]
            ]
          }
        ]
      },
      {
        model: models.Image, as: 'GroupLogoImages',
        required: false
      },
      {
        model: models.Image, as: 'GroupHeaderImages',
        required: false
      }
    ]
  }).then(function(group) {
    if (group) {
      log.info('Group Viewed', { group: toJson(group), context: 'view', user: toJson(req.user) });
      var PostsByNotOpen = models.Post.scope('not_open');
      PostsByNotOpen.count({ where: { status: { $in: ['published','inactive']}, group_id: req.params.id} }).then(function (count) {
        res.send({group: group, hasNonOpenPosts: count != 0});
      }).catch(function (error) {
        sendGroupOrError(res, null, 'count_posts', req.user, error);
      });
    } else {
      sendGroupOrError(res, req.params.id, 'view', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendGroupOrError(res, null, 'view', req.user, error);
  });
});

router.get('/:id/search/:term', auth.can('view group'), function(req, res) {
    log.info('Group Search', { groupId: req.params.id, context: 'view', user: toJson(req.user) });
    models.Post.search(req.params.term, req.params.id, models.Category).then(function(posts) {
      res.send(posts);
    });
});

router.get('/:id/posts/:filter/:categoryId/:status?', auth.can('view group'), function(req, res) {

  var where = { status: { $in: ['published','inactive']}, group_id: req.params.id };

  var postOrder = "(counter_endorsements_up-counter_endorsements_down) DESC";

  if (req.params.filter=="newest") {
    postOrder = "created_at DESC";
  } else if (req.params.filter=="random") {
    postOrder = "random()";
  }

  console.log(req.param["categoryId"]);
  console.log(req.params);

  if (req.params.categoryId!='null') {
    where['category_id'] = req.params.categoryId;
  }

  log.info('Group Posts Viewed', { groupID: req.params.id, context: 'view', user: toJson(req.user) });

  var offset = 0;
  if (req.query.offset) {
    offset = parseInt(req.query.offset);
  }

  var PostsByStatus = models.Post.scope(req.params.status);
  PostsByStatus.findAndCountAll({
    where: where,
    attributes: ['id','name','description','status','official_status','counter_endorsements_up','cover_media_type',
                 'counter_endorsements_down','counter_points','counter_flags','data','location','created_at'],
    order: [
//          [models.sequelize.fn('-', models.sequelize.col('counter_endorsements_up'), models.sequelize.col('counter_endorsements_down')), 'DESC'],
      models.sequelize.literal(postOrder),
      [ { model: models.Image, as: 'PostHeaderImages' } ,'updated_at', 'asc' ]
    ],
    include: [
      {
        model: models.Category,
        required: false,
        include: [
          {
            model: models.Image,
            required: false,
            as: 'CategoryIconImages',
            order: [
              [ { model: models.Image, as: 'CategoryIconImages' } ,'updated_at', 'asc' ]
            ]
          }
        ]
      },
      {
        model: models.PostRevision,
        required: false
      },
      {
        model: models.Point,
        attributes: ['id','content'],
        required: false
      },
      { model: models.Image,
        as: 'PostHeaderImages',
        required: false
      }
    ]
  }).then(function(posts) {
    var rows = [];
    if (offset<posts.rows.length) {
      var toValue = offset+8;
      rows = _.slice(posts.rows, offset, toValue);
    }
    res.send({
      posts: rows,
      totalPostsCount: posts.count
    });
  });
});

router.get('/:id/categories', auth.can('view group'), function(req, res) {
  models.Category.findAll({
    where: { group_id: req.params.id },
    limit: 20
  }).then(function(categories) {
    if (categories) {
      log.info('Group Categories Viewed', { group: req.params.id, context: 'view', user: toJson(req.user) });
      res.send(categories);
    } else {
      sendGroupOrError(res, req.params.id, 'view', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendGroupOrError(res, null, 'view categories', req.user, error);
  });
});


router.get('/:id/post_locations', auth.can('view group'), function(req, res) {
  models.Post.findAll({
    where: {
      location: {
        $ne: null
      },
      group_id: req.params.id
    },
    select: ['id', 'name', 'location']
  }).then(function (posts) {
    if (posts) {
      log.info('Group Post Locations Viewed', {
        communityId: req.params.id,
        context: 'view',
        user: toJson(req.user)
      });
      res.send(posts);
    } else {
      sendCommunityOrError(res, null, 'view post locations', req.user, 'Not found', 404);
    }
  }).catch(function (error) {
    sendCommunityOrError(res, null, 'view post locations', req.user, error);
  });
});

module.exports = router;
