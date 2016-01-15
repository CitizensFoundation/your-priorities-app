var kue = require('kue')
  , url = require('url')
  , redis = require('kue/node_modules/redis');
var log = require('../utils/logger');
var email = require('./email');
var activity = require('./activity');

// make sure we use the Heroku Redis To Go URL
// (put REDISTOGO_URL=redis://localhost:6379 in .env for local testing)

kue.redis.createClient = function() {
  var redisUrl = url.parse(process.env.REDISTOGO_URL)
    , client = redis.createClient(redisUrl.port, redisUrl.hostname);
  if (redisUrl.auth) {
    client.auth(redisUrl.auth.split(":")[1]);
  }
  log.info('KUE Queue has been created');

  return client;
};

var jobs = kue.createQueue();

module.exports = jobs;