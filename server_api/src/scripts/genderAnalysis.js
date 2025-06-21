var models = require('../models/index.cjs');
var async = require('async');

var femalePostCount = 0;
var malePostCount = 0;
var unknownPostCount = 0;

var femalePointCount = 0;
var malePointCount = 0;
var unknownPointCount = 0;

var femaleEndorsementCount = 0;
var maleEndorsementCount = 0;
var unknownEndorsementCount = 0;

models.Domain.findOne({where: {id: 1}}).then(function(domain) {
  domain.getDomainUsers().then(function (users) {
    async.eachSeries(users, function (user, callback) {
      models.Post.findAll({ where: {user_id: user.id}}).then(function (posts) {
        if ((user.name.indexOf('dottir') > -1) || (user.name.indexOf('dóttir') > -1)) {
          femalePostCount += posts.length;
        } else if ((user.name.indexOf('sson') > -1) || (user.name.indexOf('son') > -1)) {
          malePostCount += posts.length;
        } else {
          log.info(user.name);
          unknownPostCount += posts.length
        }
        models.Point.findAll({ where: {user_id: user.id}}).then(function (points) {
          if ((user.name.indexOf('dottir') > -1) || (user.name.indexOf('dóttir') > -1)) {
            femalePointCount += points.length;
          } else if ((user.name.indexOf('sson') > -1) || (user.name.indexOf('son') > -1)) {
            malePointCount += points.length;
          } else {
            unknownPointCount += points.length
          }
          models.Endorsement.findAll({ where: {user_id: user.id}}).then(function (endorsements) {
            if ((user.name.indexOf('dottir') > -1) || (user.name.indexOf('dóttir') > -1)) {
              femaleEndorsementCount += endorsements.length;
            } else if ((user.name.indexOf('sson') > -1) || (user.name.indexOf('son') > -1)) {
              maleEndorsementCount += endorsements.length;
            } else {
              unknownEndorsementCount += endorsements.length
            }
            callback();
          });
        });
      });
    }, function done() {
      log.info("femalePostCount: " + femalePostCount);
      log.info("malePostCount: " + malePostCount);
      log.info("unknownPostCount: " + unknownPostCount);

      log.info("femalePointCount: " + femalePointCount);
      log.info("malePointCount: " + malePointCount);
      log.info("unknownPointCount: " + unknownPointCount);

      log.info("femaleEndorsementCount: " + femaleEndorsementCount);
      log.info("maleEndorsementCount: " + maleEndorsementCount);
      log.info("unknownEndorsementCount: " + unknownEndorsementCount);
    });
  });
});