var models = require('../models/index.cjs');
var async = require('async');

var userIdArg = process.argv[2];
var organizationIdArg = process.argv[3];

var getOrganizationAndUser = function (organizationId, userId, callback) {
  var user, organization;

  async.parallel([
    function (seriesCallback) {
      models.Organization.findOne({
        where: {
          id: organizationId
        }
      }).then(function (organizationIn) {
        if (organizationIn) {
          organization = organizationIn;
        }
        seriesCallback();
      }).catch(function (error) {
        seriesCallback(error);
      });
    },
    function (seriesCallback) {
      if (userId) {
        models.User.findOne({
          where: {
            id: userId
          },
          attributes: ['id','email','name','created_at']
        }).then(function (userIn) {
          if (userIn) {
            user = userIn;
          }
          seriesCallback();
        }).catch(function (error) {
          seriesCallback(error);
        });
      } else {
        seriesCallback();
      }
    }
  ], function (error) {
    if (error) {
      callback(error)
    } else {
      callback(null, organization, user);
    }
  });
};

console.log(userIdArg);
console.log(organizationIdArg);

getOrganizationAndUser(organizationIdArg, userIdArg, function (error, organization, user) {
  console.log(error);
  console.log(user);
  console.log(organization);
  if (error) {
    console.error(error);
  } else if (user && organization) {
    organization.addOrganizationUsers(user).then(function (results) {
      console.log("Completed");
      process.exit();
    });
  } else {
    console.error("Not found");
    process.exit();
  }
});

