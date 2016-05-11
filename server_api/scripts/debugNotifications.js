var models = require('../models');
var async = require('async');
var log = require('../utils/logger');

var ip = require('ip');

emails = ["robert@citizens.is","christoffer.carlsson@thespace.se","afra@tnb.nu","solveighj@kopavogur.is"]

async.eachSeries(emails, function (email, seriesCallback) {
  models.User.find({
    where: {
      email: email
    }
  }).then(function (user) {
    log.info("User notifications settings", { email: user.email, settings: user.notifications_settings });
    seriesCallback();
  });
});
