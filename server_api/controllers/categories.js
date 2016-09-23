var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');

var sendCategoryOrError = function (res, category, context, user, error, errorStatus) {
  if (error || !category) {
    if (errorStatus == 404) {
      log.warn("Category Not Found", { context: context, category: toJson(category), user: toJson(user), err: error,
        errorStatus: 404 });
    } else {
      log.error("Category Error", { context: context, group: toJson(group), user: toJson(user), err: error,
        errorStatus: errorStatus ? errorStatus : 500 });
    }
    if (errorStatus) {
      res.sendStatus(errorStatus);
    } else {
      res.sendStatus(500);
    }
  } else {
    res.send(category);
  }
};

router.get('/:id', auth.can('view category'), function(req, res) {
  models.Category.find({
    where: { id: req.params.id },
    include: [
      { model: models.Group,
        order: 'Group.created_at DESC'
      },
      {
        model: models.Image, as: 'CategoryIconImages'
      },
      {
        model: models.Image, as: 'CategoryHeaderImages'
      }
    ]
  }).then(function(category) {
    if (category) {
      log.info('Category Viewed', { category: toJson(category), context: 'view', user: toJson(req.user) });
      res.send(category);
    } else {
      sendCategoryOrError(res, req.params.id, 'view', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendCategoryOrError(res, null, 'view', req.user, error);
  });
});

router.post('/:groupId', auth.can('create category'), function(req, res) {
  var category = models.Category.build({
    name: req.body.name,
    description: req.body.description,
    user_id: req.user.id,
    group_id: req.params.groupId
  });
  category.save().then(function() {
    log.info('Category Created', { category: category, context: 'create', user: toJson(req.user) });
    models.AcActivity.createActivity({
      type: 'activity.category.created',
      userId: req.user.id,
      domainId: req.ypDomain.id,
      groupId: req.params.groupId,
//      communityId: req.ypCommunity ?  req.ypCommunity.id : null,
      object: { categoryId: category.id }
    }, function () {
      category.setupImages(req.body, function(error) {
        sendCategoryOrError(res, category, 'setupImages', req.user, error);
      });
    });
  }).catch(function(error) {
    sendCategoryOrError(res, null, 'view', req.user, error);
  });
});

router.put('/:id', auth.can('edit category'), function(req, res) {
  models.Category.find({
    where: { id: req.params.id }
  }).then(function(category) {
    if (category) {
      category.name = req.body.name;
      category.description = req.body.description;
      category.save().then(function () {
        log.info('Category Updated', { category: toJson(category), context: 'update', user: toJson(req.user) });
        category.setupImages(req.body, function(error) {
          sendCategoryOrError(res, category, 'setupImages', req.user, error);
        });
      });
    } else {
      sendCategoryOrError(res, req.params.id, 'update', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendCategoryOrError(res, null, 'update', req.user, error);
  });
});

router.delete('/:id', auth.can('edit category'), function(req, res) {
  models.Category.find({
    where: {id: req.params.id, user_id: req.user.id }
  }).then(function (category) {
    if (category) {
      category.deleted = true;
      category.save().then(function () {
        log.info('Category Deleted', { category: toJson(category), context: 'delete', user: toJson(req.user) });
        res.sendStatus(200);
      });
    } else {
      sendCategoryOrError(res, req.params.id, 'update', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendCategoryOrError(res, null, 'delete', req.user, error);
  });
});

module.exports = router;
