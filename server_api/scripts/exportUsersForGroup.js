var models = require('../models/index.cjs');
var async = require('async');
var ip = require('ip');

var groupId = process.argv[2];

models.Group.findOne({
  where: {
    id: groupId
  },
  include: [
    {
      model: models.User,
      as: 'GroupUsers'
    }
  ]
}).then(function (group) {
  console.log(group.GroupUsers.length);
  console.log("email, Name");
  async.eachSeries(group.GroupUsers, function (user, seriesCallback) {
    console.log('"'+user.email+'","'+user.name+'"');
    seriesCallback();
  }, function () {
    process.exit();
  });
});
