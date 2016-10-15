var models = require('../models');
var async = require('async');
var ip = require('ip');

var communityId = process.argv[2];

models.Community.find({
  where: {
    id: communityId
  },
  include: [
    {
      model: models.User,
      as: 'CommunityUsers'
    }
  ]
}).then(function (community) {
  console.log(community.CommunityUsers.length);
  console.log("email, Name");
  async.eachSeries(community.CommunityUsers, function (user, seriesCallback) {
    console.log('"'+user.email+'","'+user.name+'"');
    seriesCallback();
  }, function () {
    process.exit();
  });
});
