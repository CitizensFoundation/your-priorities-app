var models = require('../models/index.cjs');
var async = require('async');
var ip = require('ip');

var userEmail = process.argv[2];
var domainId = process.argv[3];
var user;

console.log("Adding "+userEmail+" as admin to domain "+domainId);

async.series([
  function(callback) {
    models.User.findOne({where: {email: userEmail}}).then(function(incomingUser) {
      if (incomingUser) {
        user = incomingUser;
        console.log("Found user "+user.name);
        callback();
      } else {
        console.log("Can't find user");
        callback("Cant find user");
      }
    });
  },
  function(callback) {
    models.Domain.findOne({
      where: {
        id: domainId
      }
    }).then(function (domain) {
      domain.hasDomainAdmins(user).then(function (results) {
        if (!results) {
          console.log("Adding admin user for: "+domain.name);
          domain.addDomainAdmins(user).then(callback);
        } else {
          console.log("Already admin for for: "+domain.name);
          callback();
        }
      });
    });
  }
], function (error) {
  console.log("Finished");
  process.exit();
});
