var kue = require('kue'), url = require('url');
var log = require('../../utils/logger.cjs');
var toJson = require('../utils/to_json.cjs');
var airbrake = null;
if (process.env.AIRBRAKE_PROJECT_ID) {
    airbrake = require('../utils/airbrake.cjs');
}
// make sure we use the Heroku Redis To Go URL
// (put REDISTOGO_URL=redis://localhost:6379 in .env for local testing)
var redisUrl = process.env.REDIS_WORKER_URL ?? process.env.REDIS_URL ?? "redis://localhost:6379";
log.info("Starting app access to Kue Queue", { redis_url: redisUrl });
var queue = kue.createQueue({
    redis: redisUrl,
    "socket_keepalive": true
});
queue.watchStuckJobs(1000);
log.info("active");
queue.activeCount(log.info);
log.info("inactiveCount");
queue.inactiveCount(log.info);
log.info("failedCount");
queue.failedCount(log.info);
log.info("delayedCount");
queue.delayedCount(log.info);
log.info("completeCount");
queue.completeCount(log.info);
setTimeout(function () {
    process.exit();
}, 5000);
module.exports = queue;
export {};
