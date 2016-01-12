var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');

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
    res.send(category);
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
    category.setupImages(req.body, function(err) {
      if (err) {
        res.sendStatus(403);
        console.error(err);
      } else {
        res.send(category);
      }
    });
  });
});

router.put('/:id', auth.can('edit category'), function(req, res) {
  models.Category.find({
    where: { id: req.params.id }
  }).then(function(category) {
    category.name = req.body.name;
    category.description = req.body.description;
    category.save().then(function () {
      category.setupImages(req.body, function(err) {
        if (err) {
          res.sendStatus(403);
          console.error(err);
        } else {
          res.send(category);
        }
      });
    });
  });
});

router.delete('/:id', auth.can('edit category'), function(req, res) {
  models.Category.find({
    where: {id: req.params.id, user_id: req.user.id }
  }).then(function (category) {
    category.deleted = true;
    category.save().then(function () {
      res.sendStatus(200);
    });
  });
});

module.exports = router;
