var express = require('express');
var router = express.Router();
var models = require("../models");

/* GET ideas listing. */
router.get('/', function(req, res) {
  models.Group.findAll({
    limit: 565,
    order: "counter_ideas DESC",
    include: [ models.IsoCountry ]
  }).then(function(groups) {
    res.send(groups);
  });
});

router.get('/:id/search/:term', function(req, res) {
  models.Idea.search(req.params.term,req.params.id, models.Category)
      .then(function(ideas) {
        res.send(ideas);
      });
});

router.get('/:id/ideas/:filter/:categoryId?', function(req, res) {

  var where = "group_id = "+req.params.id;
  var order = "(counter_endorsements_up-counter_endorsements_down) DESC";

  if (req.params.filter!="inProgress") {
    where+=" AND status = 'published'";
  } else {
    where+=" AND status != 'published' AND status != 'deleted'";
  }

  if (req.params.filter=="newest") {
    order = "created_at DESC";
  } else if (req.params.filter=="random") {
    order = "random()";
  }
  console.log("a1");

  console.log(req.param["categoryId"]);
  console.log(req.params);

  if (req.params.categoryId!=undefined) {
    where+=" AND category_id = "+ req.params.categoryId;
  }
  console.log("A2");

  console.log(where);
  console.log(order);

  models.Idea.findAll({
    order: order,
    where: [where, []],
    limit: 42,
    include: [ models.Category, models.IdeaRevision, models.Point ]
  }).then(function(ideas) {
    res.send(ideas);
  });
});

router.get('/:id/categories', function(req, res) {
  var groupId;

  console.log(req.params.id);

  if (req.params.id=="default") {
    groupId = 262;
  } else {
    groupId = req.params.id;
  }

  models.Category.findAll({
    where: { group_id: groupdId },
    limit: 20
  }).then(function(categories) {
    res.send(categories);
  });
});

module.exports = router;
