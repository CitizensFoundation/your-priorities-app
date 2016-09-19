var models = require('../models');
var async = require('async');
var ip = require('ip');

var ssn = process.argv[2];
console.log("Unlinking "+ssn+" from user");

models.User.find({
  where: {
    ssn: ssn
  }
}).then(function (user) {
  if (user) {
    console.log("Unlinking "+ssn+" from "+user.email);
    user.ssn = null;
    user.save().then(function () {
      console.log("Completed unlinking "+ssn+" from "+user.email);
      process.exit();
    })
  } else {
    console.log("Not found");
    process.exit();
  }
});
