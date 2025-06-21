var models = require('../models/index.cjs');
var async = require('async');

var userEmail = process.argv[2];
var user;

log.info("Adding "+userEmail+" as admin to all public communities and groups + domains");

async.series([
  function(callback) {
    models.User.findOne({where: {email: userEmail}}).then(function(incomingUser) {
      if (incomingUser) {
        user = incomingUser;
        log.info("Found user "+user.name);
        callback();
      } else {
        log.info("Can't find user");
      }
    });
  },
  function(callback) {
    models.Domain.findAll({
      attributes: ['id','name']
    }).then(function (models) {
        async.eachSeries(models, function (model, seriesCallback) {
          model.hasDomainAdmins(user).then(function (results) {
            if (!results) {
              log.info("Adding admin user for: "+model.name);
              model.addDomainAdmins(user).then(seriesCallback);
            } else {
              log.info("Already admin for for: "+model.name);
              seriesCallback();
            }
          });
        },
        function() {
          callback();
        });
    });
  },
  function(callback) {
    models.Organization.findAll({}).then(function (models) {
      async.eachSeries(models, function (model, seriesCallback) {
          model.hasOrganizationAdmins(user).then(function (results) {
            if (!results) {
              log.info("Adding admin user for: "+model.name);
              model.addOrganizationAdmins(user).then(seriesCallback);
            } else {
              log.info("Already admin for for: "+model.name);
              seriesCallback();
            }
          });
        },
        function() {
          callback();
        });
    });
  },
  function(callback) {
    models.Community.findAll({
      attributes: ['id','name']
    }).then(function (models) {
      async.eachSeries(models, function (model, seriesCallback) {
        model.hasCommunityAdmins(user).then(function (results) {
          if (!results) {
            log.info("Adding admin user for community: "+model.name);
            model.addCommunityAdmins(user).then(function () {
              log.info("Im back");
              seriesCallback();
            });
          } else {
            log.info("Already admin for for: "+model.name);
            seriesCallback();
          }
        });
      },
      function() {
        callback();
      });
    });
  },
  function(callback) {
    models.Group.findAll({
      attributes: ['id','name']
    }).then(function (models) {
      async.eachSeries(models, function (model, seriesCallback) {
        model.hasGroupAdmins(user).then(function (results) {
          if (!results) {
            log.info("Adding admin user for group: "+model.name);
            model.addGroupAdmins(user).then(function () {
              log.info("Im back");
              seriesCallback();
            });
          } else {
            log.info("Already admin for for: "+model.name);
            seriesCallback();
          }
        });
      },
      function() {
        callback();
      });
    });
  }
], function (error) {
  log.info("Finished");
  process.exit();
});
