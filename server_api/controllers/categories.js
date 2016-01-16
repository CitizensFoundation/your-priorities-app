var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');

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
      res.sendStatus(404);
      log.warning('Category Not found', { categoryId: req.params.id, user: req.user });
    } else {
      log.info('Category Viewed', { category: category, user: req.user });
      res.send(category);
    }
  }).catch(function(error) {
    log.error('Category Error', { err: error, categoryId: req.params.id, user: req.user });
    res.sendStatus(500);
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
    log.info('Category Created', { category: category, user: req.user });
    category.setupImages(req.body, function(err) {
      if (err) {
        res.sendStatus(500);
        log.error('Category Setup images failed', { category: category, user: req.user, err: err });
      } else {
        res.send(category);
      }
    });
  }).catch(function(error) {
    log.error('Category Error', { err: error, user: req.user });
    res.sendStatus(500);
  });
});

router.put('/:id', auth.can('edit category'), function(req, res) {
  models.Category.find({
    where: { id: req.params.id }
  }).then(function(category) {
    category.name = req.body.name;
    category.description = req.body.description;
    category.save().then(function () {
      log.info('Category Updated', { category: category, user: req.user });
      category.setupImages(req.body, function(err) {
        if (err) {
          res.sendStatus(500);
          log.error('Category Setup images failed', { category: category, user: req.user, err: err });
        } else {
          res.send(category);
        }
      });
    });
  }).catch(function(error) {
    log.error('Category Error', { err: error, user: req.user });
    res.sendStatus(500);
  });
});

router.delete('/:id', auth.can('edit category'), function(req, res) {
  models.Category.find({
    where: {id: req.params.id, user_id: req.user.id }
  }).then(function (category) {
    category.deleted = true;
    category.save().then(function () {
      log.info('Category Deleted', { category: category, user: req.user });
      res.sendStatus(200);
    });
  }).catch(function(error) {
    log.error('Category Error', { err: error, user: req.user });
    res.sendStatus(500);
  });
});

module.exports = router;
