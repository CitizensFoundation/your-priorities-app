var models = require('../models');
var async = require('async');
var ip = require('ip');

var femalePostCount = 0;
var malePostCount = 0;
var unknownPostCount = 0;

var translateOfficialStatus = function (status) {
  if (status==[0]) {
    return "Open";
  } else if (status==[-2]) {
    return "Failed";
  } else if (status==[-1,1]) {
    return "InProgress";
  } else if (status==[2]) {
    return "Successful";
  }

};

models.Domain.find({where: {id: 1}}).then(function(domain) {
  domain.getDomainUsers().then(function (users) {
    async.eachSeries([[0], [-2], [-1, 1], [2]], function (officialStatus, outerSeriesCallback) {
      async.eachSeries(users, function (user, callback) {
        async.series([
          function (innerCallback) {
            models.Post.findAll({
              where: {
                user_id: user.id,
                official_status: {
                  $in: officialStatus
                }
              }
            }).then(function (posts) {
              if ((user.name.indexOf('dottir') > -1) || (user.name.indexOf('dóttir') > -1)) {
                femalePostCount += posts.length;
              } else if ((user.name.indexOf('sson') > -1) || (user.name.indexOf('son') > -1)) {
                malePostCount += posts.length;
              } else {
                unknownPostCount += posts.length
              }
              innerCallback();
            });
          }
        ], function () {
          callback();
        });
      }, function () {
        console.log("Ideas " + translateOfficialStatus(officialStatus));
        console.log("femalePostCount: " + femalePostCount);
        console.log("malePostCount: " + malePostCount);
        console.log("unknownPostCount: " + unknownPostCount);
        femalePostCount = 0;
        malePostCount = 0;
        unknownPostCount = 0;
        outerSeriesCallback();
      });
    });
  });
});



