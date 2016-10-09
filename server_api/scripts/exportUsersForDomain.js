var models = require('../models');
var async = require('async');
var ip = require('ip');

var domainId = process.argv[2];

models.Domain.find({
  where: {
    id: domainId
  },
  include: [
    {
      model: models.User,
      as: 'DomainUsers'
    }
  ]
}).then(function (domain) {
  console.log(domain.DomainUsers.length);
  console.log("email, Name");
  async.eachSeries(domain.DomainUsers, function (user, seriesCallback) {
    console.log('"'+user.email+'","'+user.name+'"');
    seriesCallback();
  }, function () {
    process.exit();
  });
});
