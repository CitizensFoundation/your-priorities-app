var email = require('./email');
var activity = require('./activity');
var notifications = require('./notifications');

var jobs = require('./jobs');

var i18n = require('i18next');
var Backend = require('i18next-sync-fs-backend');

i18n
  .use(Backend)
  .init({
    // this is the defaults
    backend: {
      // path where resources get loaded from
      loadPath: '../locales/{{lng}}/{{ns}}.json',

      // path to post missing resources
      addPath: '../locales/{{lng}}/{{ns}}.missing.json',

      // jsonIndent to use when storing json files
      jsonIndent: 2
    }
  });

// see https://github.com/learnBoost/kue/ for how to do more than one job at a time
jobs.process('send-one-email', function(job, done) {
  email.sendOne(job.data, i18n, done);
});

jobs.process('process-activity', function(job, done) {
  activity.process(job.data, i18n, done);
});

jobs.process('process-notification', function(job, done) {
  activity.process(job.data, i18n, done);
});
