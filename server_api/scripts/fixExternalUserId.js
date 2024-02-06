var models = require('../models/index.cjs');
var async = require('async');
var ip = require('ip');

models.User.findAll({
  attributes: ['id','profile_data']
}).then((users) => {
  async.forEachSeries(users, (user, callback) => {
    if (user.profile_data && user.profile_data.trackingParameters && user.profile_data.trackingParameters.externalUserID) {
      user.set('profile_data.trackingParameters.externalUserId', user.profile_data.trackingParameters.externalUserID);
      user.save().then(()=> {
        callback();
      })
    } else {
      callback();
    }
  }, (error) => {
    console.log("Done");
    if (error)
      console.error(error);
    process.exit();
  })
});

// profile_data.trackingParameters.externalUserId


