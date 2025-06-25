var models = require('../models/index.cjs');
var async = require('async');
log.info("Setting up locales");
async.series([
    function (callback) {
        models.Domain.findOne({ where: { domain_name: 'betrireykjavik.is' } }).then(function (domain) {
            domain.default_locale = 'is';
            domain.save().then(function () {
                callback();
            });
        });
    },
    function (callback) {
        models.Domain.findOne({ where: { domain_name: 'betraisland.is' } }).then(function (domain) {
            domain.default_locale = 'is';
            domain.save().then(function () {
                callback();
            });
        });
    },
    function (callback) {
        models.Domain.findOne({ where: { domain_name: 'yrpri.org' } }).then(function (domain) {
            domain.default_locale = 'en';
            domain.save().then(function () {
                callback();
            });
        });
    }
], function (error) {
    log.info("Finished");
    process.exit();
});
export {};
