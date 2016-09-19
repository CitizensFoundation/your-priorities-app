var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var url = require('url');

var hostPartOfUrl = function (req) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host')
  });
};

router.get('/:id', function(req, res) {
  var cleanLegacyId = req.params.id.split("-")[0];
  models.Page.find({
    where: {
      legacy_page_id: cleanLegacyId,
      legacy_new_domain_id: req.ypDomain.id
    }
  }).then(function(page) {
    if (page) {
      var returnUrl = hostPartOfUrl(req)+"/page/" + page.id;
      res.redirect(301, returnUrl);
    } else {
      res.sendStatus(404);
    }
  }).catch(function(error) {
    log.error({err: error, context: 'legacy_page_id'});
    res.sendStatus(500);
  });
});

module.exports = router;
