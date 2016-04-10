var models = require('../models');
var async = require('async');
var ip = require('ip');

var userEmail = 'robert@citizens.is';
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
    models.Community.findAll({
      where: {
        access: {
          $ne: models.Community.ACCESS_SECRET
        }
      }
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
      where: {
        access: {
          $ne: models.Group.ACCESS_SECRET
        }
      }
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
      });
    });
  }
]);
