// https://gist.github.com/mojodna/1251812

var ActivityWorker = function () {};
var models = require("../../models");
var log = require('../utils/logger');
var toJson = require('../utils/to_json');

var loadActivityFromJsonObject = function(activityJson, done) {
  models.AcActivity.find({
    where: { id: activityJson.id }
  }).then(function(activity) {
    if (activity) {
      done(null, activity);
    } else {
      done('Activity not found');
    }
  }).catch(function(error) {
    done(error);
  });
};

ActivityWorker.prototype.process = function (activity, done) {
  log.info('Processing Activity Started', { type: activity.type });
  try {
    switch(activity.type) {
      case models.AcActivity.ACTIVITY_PASSWORD_RECOVERY:
        models.AcNotification.createPasswordRecovery( activity, function (error) {
          log.info('Processing Activity Completed', { type: activity.type, err: error });
          done();
        });
        break;
      default:
        done();
    }
  } catch (err) {
    log.error("Processing Activity Error", {err: err});
    done();
  }
};

module.exports = new ActivityWorker();
