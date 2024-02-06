var express = require('express');
var router = express.Router();
var models = require("../models/index.cjs");
var auth = require('../authorization.cjs');
var log = require('../utils/logger.cjs');
var toJson = require('../utils/to_json.cjs');

var sendCategoryOrError = function (res, category, context, user, error, errorStatus) {
  if (error || !category) {
    if (errorStatus == 404) {
      log.warn("Category Not Found", { context: context, category: toJson(category), user: toJson(user), err: error,
        errorStatus: 404 });
    } else {
      log.error("Category Error", { context: context, user: toJson(user), err: error,
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
  models.Category.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: models.Group,
        attributes: models.Group.defaultAttributesPublic
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

router.get('/:id/translatedText', auth.can('view category'), function(req, res) {
  if (req.query.textType.indexOf("category") > -1) {
    models.Category.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id','name']
    }).then(function(category) {
      if (category) {
        models.AcTranslationCache.getTranslation(req, category, function (error, translation) {
          if (error) {
            sendCategoryOrError(res, req.params.id, 'translated', req.user, error, 500);
          } else {
            res.send(translation);
          }
        });
        log.info('Category translatedTitle', {  context: 'translated' });
      } else {
        sendCategoryOrError(res, req.params.id, 'translated', req.user, 'Not found', 404);
      }
    }).catch(function(error) {
      sendCategoryOrError(res, null, 'translated', req.user, error);
    });
  } else {
    sendCategoryOrError(res, req.params.id, 'translated', req.user, 'Wrong textType', 401);
  }
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
  models.Category.findOne({
    where: { id: req.params.id },
    order:[[ { model: models.Image, as: 'CategoryIconImages' } ,'updated_at', 'asc' ]],
    include: [
      {
        model: models.Image,
        required: false,
        attributes: { exclude: ['ip_address', 'user_agent'] },
        as: 'CategoryIconImages'
      }
    ]
  }).then(function(category) {
    if (category) {
      category.name = req.body.name;
      category.description = req.body.description;
      category.save().then(function () {
        log.info('Category Updated', { category: toJson(category), context: 'update', user: toJson(req.user) });
        category.setupImages(req.body, function(error) {
          setTimeout(function () {
            models.Category.findOne({
              where: { id: req.params.id },
              order:[[ { model: models.Image, as: 'CategoryIconImages' } ,'updated_at', 'asc' ]],
              include: [
                {
                  model: models.Image,
                  required: false,
                  attributes: { exclude: ['ip_address', 'user_agent'] },
                  as: 'CategoryIconImages'
                }
              ]
            }).then(function(reloadedCategory) {
              sendCategoryOrError(res, reloadedCategory, 'setupImages', req.user, error);
            });
          }, 25);
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
  models.Post.count({
    where: {
      category_id: req.params.id
    }
  }).then(count=>{
    if (count===0) {
      models.Category.findOne({
        where: {id: req.params.id }
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
    } else {
      log.error("Trying to delete a category with posts")
      res.sendStatus(401);
    }
  }).catch(error=>{
    sendCategoryOrError(res, null, 'delete', req.user, error);
  })
});

router.get('/:id/getPostsCount', auth.can('edit category'), function(req, res) {
  models.Post.count({
    where: {
      category_id: req.params.id
    }
  }).then(count=>{
    res.send({ count });
  }).catch(error=>{
    sendCategoryOrError(res, null, 'delete', req.user, error);
  })
});

module.exports = router;
