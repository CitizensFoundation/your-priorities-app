var email = require('./email');
var activity = require('./activity');
var jobs = require('./jobs');

// see https://github.com/learnBoost/kue/ for how to do more than one job at a time
jobs.process('send-one-email', function(job, done) {
  email.sendOne(job.data, done);
});

jobs.process('process-activity', function(job, done) {
  activity.process(job.data, done);
});
