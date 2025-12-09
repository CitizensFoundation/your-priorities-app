var kue = require('kue')
  , url = require('url')
var log = require('../../utils/logger.cjs');
var email = require('./email.js');
var activity = require('./activity.js');
var toJson = require('../utils/to_json.cjs');

var airbrake = null;
if(process.env.AIRBRAKE_PROJECT_ID) {
  airbrake = require('../utils/airbrake.cjs');
}

// make sure we use the Heroku Redis To Go URL
// (put REDISTOGO_URL=redis://localhost:6379 in .env for local testing)

var redisUrl = process.env.REDIS_WORKER_URL ?? process.env.REDIS_URL ?? "redis://localhost:6379";
log.info("Starting app access to Kue Queue", {redis_url: redisUrl});

var queue = kue.createQueue({
  redis: redisUrl,
  "socket_keepalive" : true
});

queue.activeCount(log.info);
queue.inactiveCount(log.info);
queue.failedCount(log.info);
queue.delayedCount(log.info);
queue.completeCount(log.info);

module.exports = queue;