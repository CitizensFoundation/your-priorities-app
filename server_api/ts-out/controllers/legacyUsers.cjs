"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
router.get('/:id', function (req, res) {
    var cleanLegacyId = req.params.id.split("-")[0];
    models.User.findOne({
        where: {
            legacy_user_id: cleanLegacyId,
            legacy_new_domain_id: req.ypDomain.id
        },
        attributes: ['id', 'name', 'created_at']
    }).then(function (user) {
        if (user) {
            var returnUrl = hostPartOfUrl(req) + "/user/" + user.id;
            res.redirect(301, returnUrl);
        }
        else {
            res.sendStatus(404);
        }
    }).catch(function (error) {
        log.error({ err: error, context: 'legacy_user_id' });
        res.sendStatus(404);
    });
});
module.exports = router;
