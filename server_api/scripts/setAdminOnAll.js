var models = require('../models');
var async = require('async');
var ip = require('ip');

var userEmail = process.argv[2];
var user;

console.log("Adding "+userEmail+" as admin to all public communities and groups + domains");

async.series([
  function(callback) {
    models.User.find({where: {email: userEmail}}).then(function(incomingUser) {
      if (incomingUser) {
        user = incomingUser;
        console.log("Found user "+user.name);
        callback();
      } else {
        console.log("Can't find user");
      }
    });
  },
  function(callback) {
    models.Domain.findAll({}).then(function (models) {
        async.eachSeries(models, function (model, seriesCallback) {
          model.hasDomainAdmins(user).then(function (results) {
            if (!results) {
              console.log("Adding admin user for: "+model.name);
              model.addDomainAdmins(user).then(seriesCallback);
            } else {
              console.log("Already admin for for: "+model.name);
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
              console.log("Adding admin user for: "+model.name);
              model.addOrganizationAdmins(user).then(seriesCallback);
            } else {
              console.log("Already admin for for: "+model.name);
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
    }).then(function (models) {
      async.eachSeries(models, function (model, seriesCallback) {
        model.hasCommunityAdmins(user).then(function (results) {
          if (!results) {
            console.log("Adding admin user for community: "+model.name);
            model.addCommunityAdmins(user).then(function () {
              console.log("Im back");
              seriesCallback();
            });
          } else {
            console.log("Already admin for for: "+model.name);
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
    }).then(function (models) {
      async.eachSeries(models, function (model, seriesCallback) {
        model.hasGroupAdmins(user).then(function (results) {
          if (!results) {
            console.log("Adding admin user for group: "+model.name);
            model.addGroupAdmins(user).then(function () {
              console.log("Im back");
              seriesCallback();
            });
          } else {
            console.log("Already admin for for: "+model.name);
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
  console.log("Finished");
  process.exit();
});
