// https://gist.github.com/mojodna/1251812

var ActivityWorker = function () {};
var path = require('path');
var models = require("../models");

ActivityWorker.prototype.process = function (activity, done) {
  switch(activity.type) {
    case models.AcActivity.ACTIVITY_PASSWORD_RECOVERY:
      models.AcNotification.createPasswordRecovery(activity, function (err) {
        done();
      });
      break;
  }
};

module.exports = new ActivityWorker();
