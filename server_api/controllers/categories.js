var express = require('express');
var router = express.Router();
var models = require("../models");

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.send(401, 'Unauthorized');
}

/* GET ideas listing. */
router.get('/', function(req, res) {
  models.Category.findAll({
      include: [ models.Image ]
  }).then(function(categories) {
    res.send(categories);
  });
});

router.get('/:id', function(req, res) {
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

router.post('/:groupId', isAuthenticated, function(req, res) {
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

router.put('/:id', isAuthenticated, function(req, res) {
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

module.exports = router;
