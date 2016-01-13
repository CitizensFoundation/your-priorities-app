var kue = require('kue')
  , url = require('url')
  , redis = require('kue/node_modules/redis');

var email = require('./email');

// make sure we use the Heroku Redis To Go URL
// (put REDISTOGO_URL=redis://localhost:6379 in .env for local testing)

kue.redis.createClient = function() {
  var redisUrl = url.parse(process.env.REDISTOGO_URL)
    , client = redis.createClient(redisUrl.port, redisUrl.hostname);
  if (redisUrl.auth) {
    client.auth(redisUrl.auth.split(":")[1]);
  }
  return client;
};

var jobs = kue.createQueue();

// see https://github.com/learnBoost/kue/ for how to do more than one job at a time
jobs.process('email', function(job, done) {
  email.sendOne(job.data, done);
});

