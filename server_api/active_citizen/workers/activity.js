// https://gist.github.com/mojodna/1251812

var ActivityWorker = function () {};
var models = require("../models");
var log = require('../utils/logger');

ActivityWorker.prototype.process = function (activity, done) {
  log.info('Processing Activity Started', { type: activity.type });
  switch(activity.type) {
    case models.AcActivity.ACTIVITY_PASSWORD_RECOVERY:
      models.AcNotification.createPasswordRecovery(activity, function (err) {
        log.info('Processing Activity Completed', { type: activity.type, err: err });
        done();
      });
      break;
  }
};

module.exports = new ActivityWorker();
