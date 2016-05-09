var models = require('../models');
var async = require('async');

console.log("Setting up locales");

async.series([
  function(callback) {
    models.Domain.find({where: {domain_name: 'betrireykjavik.is'}}).then(function(domain) {
      domain.default_locale = 'is';
      domain.save().then(function () {
        callback();
      });
    });
  },
  function(callback) {
    models.Domain.find({where: {domain_name: 'betraisland.is'}}).then(function(domain) {
      domain.default_locale = 'is';
      domain.save().then(function () {
        callback();
      });
    });
  },
  function(callback) {
    models.Domain.find({where: {domain_name: 'yrpri.org'}}).then(function(domain) {
      domain.default_locale = 'en';
      domain.save().then(function () {
        callback();
      });
    });
  }
], function (error) {
  console.log("Finished");
  process.exit();
});
