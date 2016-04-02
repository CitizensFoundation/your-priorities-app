var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var _ = require('lodash');

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
        group.setupImages(req.body, function(error) {
          sendGroupOrError(res, group, 'setupImages', req.user, error);
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
      group.access = models.Community.convertAccessFromRadioButtons(req.body);
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
    where: {id: req.params.id, user_id: req.user.id }
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
      },
      {
        model: models.Community
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
