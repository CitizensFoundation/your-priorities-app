var models = require('../models');
var async = require('async');
var ip = require('ip');

var userEmail = process.argv[2];
var user;

console.log("Adding "+userEmail+" to all public communities and groups + domains");

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
          model.hasDomainUsers(user).then(function (results) {
            if (!results) {
              console.log("Adding users user for: "+model.name);
              model.addDomainUsers(user).then(seriesCallback);
            } else {
              console.log("Already users for for: "+model.name);
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
          model.hasOrganizationUsers(user).then(function (results) {
            if (!results) {
              console.log("Adding users user for: "+model.name);
              model.addOrganizationUsers(user).then(seriesCallback);
            } else {
              console.log("Already users for for: "+model.name);
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
        model.hasCommunityUsers(user).then(function (results) {
          if (!results) {
            console.log("Adding users user for community: "+model.name);
            model.addCommunityUsers(user).then(function () {
              console.log("Im back");
              seriesCallback();
            });
          } else {
            console.log("Already users for for: "+model.name);
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
        model.hasGroupUsers(user).then(function (results) {
          if (!results) {
            console.log("Adding users user for group: "+model.name);
            model.addGroupUsers(user).then(function () {
              console.log("Im back");
              seriesCallback();
            });
          } else {
            console.log("Already users for for: "+model.name);
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
