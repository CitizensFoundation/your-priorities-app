// https://gist.github.com/mojodna/1251812

var ActivityWorker = function () {};
var AcActivity = require("../models/ac_activity");
var log = require('../utils/logger');
var toJson = require('../utils/to_json');

ActivityWorker.prototype.process = function (activity, done) {
  log.info('Processing Activity Started', { type: activity.type });
  switch(activity.type) {
    case AcActivity.ACTIVITY_PASSWORD_RECOVERY:
      models.AcNotification.createPasswordRecovery(activity, function (err) {
        log.info('Processing Activity Completed', { type: activity.type, err: err });
        done();
      });
      break;
  }
};

module.exports = new ActivityWorker();
