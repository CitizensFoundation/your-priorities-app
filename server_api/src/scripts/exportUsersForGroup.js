var models = require('../models/index.cjs');
var async = require('async');

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
  log.info(group.GroupUsers.length);
  log.info("email, Name");
  async.eachSeries(group.GroupUsers, function (user, seriesCallback) {
    log.info('"'+user.email+'","'+user.name+'"');
    seriesCallback();
  }, function () {
    process.exit();
  });
});
