var email = require('./email');
var activity = require('./activity');
var notifications = require('./notifications');
var queue = require('./jobs');

queue.process('send-one-email', 20, function(job, done) {
  email.sendOne(job.data, done);
});

queue.process('process-activity', 20, function(job, done) {
  activity.process(job.data, done);
});

queue.process('process-notification', 20, function(job, done) {
  activity.process(job.data, done);
});
