var express = require('express');
var router = express.Router();
var models = require("../models");

/* GET ideas listing. */
router.get('/', function(req, res) {
  models.Group.findAll({
    limit: 300,
    order: "counter_ideas DESC",
    where: "top_banner_file_name IS NOT NULL"
  }).then(function(groups) {
    res.send(groups);
  });
});

module.exports = router;
