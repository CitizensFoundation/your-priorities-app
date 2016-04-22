var models = require('../models');
var async = require('async');
var ip = require('ip');

var femalePostCount = 0;
var malePostCount = 0;
var unknownPostCount = 0;

var femalePointCount = 0;
var malePointCount = 0;
var unknownPointCount = 0;

var femaleEndorsementCount = 0;
var maleEndorsementCount = 0;
var unknownEndorsementCount = 0;

models.Domain.find({where: {id: 1}}).then(function(domain) {
  domain.getDomainUsers().then(function (users) {
    async.eachSeries(users, function (user, callback) {
      models.Post.findAll({ where: {user_id: user.id}}).then(function (posts) {
        if ((user.name.indexOf('dottir') > -1) || (user.name.indexOf('dóttir') > -1)) {
          femalePostCount += posts.length;
        } else if ((user.name.indexOf('sson') > -1) || (user.name.indexOf('son') > -1)) {
          malePostCount += posts.length;
        } else {
          console.log(user.name);
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
      console.log("femalePostCount: " + femalePostCount);
      console.log("malePostCount: " + malePostCount);
      console.log("unknownPostCount: " + unknownPostCount);

      console.log("femalePointCount: " + femalePointCount);
      console.log("malePointCount: " + malePointCount);
      console.log("unknownPointCount: " + unknownPointCount);

      console.log("femaleEndorsementCount: " + femaleEndorsementCount);
      console.log("maleEndorsementCount: " + maleEndorsementCount);
      console.log("unknownEndorsementCount: " + unknownEndorsementCount);
    });
  });
});




