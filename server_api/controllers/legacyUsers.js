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
  models.User.find({
    where: {
      legacy_user_id: cleanLegacyId,
      legacy_new_domain_id: req.ypDomain.id
    },
    attributes: ['id','name','created_at']
  }).then(function(user) {
    if (user) {
      var returnUrl = hostPartOfUrl(req)+"/user/" + user.id;
      res.redirect(301, returnUrl);
    } else {
      res.sendStatus(404);
    }
  }).catch(function(error) {
    log.error({err: error, context: 'legacy_user_id'});
    res.sendStatus(500);
  });
});

module.exports = router;
