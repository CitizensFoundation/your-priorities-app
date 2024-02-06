var express = require('express');
var router = express.Router();
var models = require("../models/index.cjs");
var auth = require('../authorization.cjs');
var log = require('../utils/logger.cjs');
var toJson = require('../utils/to_json.cjs');
var url = require('url');

var hostPartOfUrl = function (req) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host')
  });
};

router.get('/:id', function(req, res) {
  var cleanLegacyId = req.params.id.split("-")[0];
  models.Post.findOne({
    where: { legacy_post_id: cleanLegacyId },
    include: [
      {
        model: models.Group,
        required: true,
        attributes: ['id'],
        include: [
          {
            model: models.Community,
            required: true,
            attributes: ['id'],
            include: [
              {
                model: models.Domain,
                attributes: ['id'],
                where: {
                  id: req.ypDomain.id
                },
                required: true
              }
            ]

          }
        ]
      }
    ]
  }).then(function(post) {
    if (post) {
      var returnUrl = hostPartOfUrl(req)+"/post/" + post.id;
      res.redirect(301, returnUrl);
    } else {
      res.sendStatus(404);
    }
  }).catch(function(error) {
    log.error({err: error, context: 'legacy_post_id'});
    res.sendStatus(404);
  });
});

module.exports = router;
