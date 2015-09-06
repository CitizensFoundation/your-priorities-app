var express = require('express');
var router = express.Router();
var models = require("../models");

/* GET ideas listing. */
router.get('/', function(req, res) {
  models.Community.findAll({
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
      }
    ]
  }).then(function(community) {
    res.send(community);
  });
});

router.post('/', function(req, res) {

  var community = models.Community.build({
    name: req.body.name,
    description: req.body.description,
    access: models.Community.convertAccessFromCheckboxes(req.body),
    domain_id: req.ypDomain.id,
    website: req.body.website
  });

  community.save().then(function() {
     // Automatically add user to community
     res.send(community);
  }).catch(function(error) {
    res.sendStatus(403);
  });
});

module.exports = router;
