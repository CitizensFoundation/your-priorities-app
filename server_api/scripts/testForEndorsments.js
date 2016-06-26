var models = require('../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');

var userEmail = process.argv[2];
var ideaId = process.argv[3];

models.User.find({
  where: {
    email: userEmail
  },
  include: [
    {
      model: models.Endorsement
    }
  ]
}).then(function (user) {
  console.log(user.email);
  console.log(user.facebook_id);
  console.log(_.map(user.Endorsements, function (e) { return e.post_id+" "+e.created_at }));
  console.log(user.Endorsements);
});
