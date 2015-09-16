var express = require('express');
var router = express.Router();
var models = require("../models");

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.send(401, 'Unauthorized');
};

/* GET ideas listing. */
router.get('/', function(req, res) {
  models.Community.findAll({
      include: [ models.Image ]
  }).then(function(communities) {
    res.send(communities);
  });
});

router.get('/:id', function(req, res) {
  models.Community.find({
    where: { id: req.params.id },
    include: [
      { model: models.Group,
        order: 'Group.created_at DESC'
      },
      {
        model: models.Image, as: 'CommunityLogoImages', order: 'updated_at DESC'
      },
      {
        model: models.Image, as: 'CommunityHeaderImages', order: 'updated_at DESC'
      }
    ]
  }).then(function(community) {
    res.send(community);
  });
});

router.post('/', isAuthenticated, function(req, res) {
  var community = models.Community.build({
    name: req.body.name,
    description: req.body.description,
    access: models.Community.convertAccessFromRadioButtons(req.body),
    domain_id: req.ypDomain.id,
    user_id: req.user.id,
    website: req.body.website
  });
  community.save().then(function() {
    async.parallel([
      function(callback) {
        community.setupImages(req.body, function (err) {
          if (err) return callback(err);
           callback();
        }
      },
      function(callback) {
        db.save('xxx', 'b', callback); //If we just pass in the task callback, it will automatically be called with an eror, if the db.save() call fails
      }
    ], function(err) {
      if (err) {
        throw err; //Or pass it on to an outer callback, log it or whatever suits your needs
      }
      console.log('Both a and b are saved now');
    });

    community.setupImages(req.body, function () {
      res.send(community);
    });
     // Automatically add user to community
  }).catch(function(error) {
    res.sendStatus(403);
  });
});

router.put('/:id', isAuthenticated, function(req, res) {
  models.Community.find({
    where: { id: req.params.id }
  }).then(function(community) {
    community.name = req.body.name;
    community.description = req.body.description;
    community.access = models.Community.convertAccessFromRadioButtons(req.body);
    community.save().then(function () {
      community.setupImages(req.body, function () {
        res.send(community);
      });
    });
  }).catch(function(error) {
    res.sendStatus(403);
  });
});


module.exports = router;
