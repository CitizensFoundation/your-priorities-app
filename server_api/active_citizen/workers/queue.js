var kue = require('kue')
  , url = require('url')
  , redis = require('kue/node_modules/redis');
var log = require('../utils/logger');
var email = require('./email');
var activity = require('./activity');
var toJson = require('../utils/to_json');

// make sure we use the Heroku Redis To Go URL
// (put REDISTOGO_URL=redis://localhost:6379 in .env for local testing)

var redisUrl = process.env.REDIS_URL ? process.env.REDIS_URL : "redis://localhost:6379";
log.info("Starting app access to Kue Queue", {redis_url: redisUrl});

var queue = kue.createQueue({
  redis: redisUrl
});

queue.on('job enqueue', function(id, type){
  log.info('Job Enqueue', { id: id, type: type });
}).on('job complete', function(id, result){
  log.info('Job Completed', { id: id });
}).on( 'error', function( err ) {
  log.error('Job Error', { err: err }
  );
});

if (process.env.NODE_ENV === 'development' || process.env.FORCE_KUE_UI) {
  kue.app.listen(3000).on('error', function (error) {
    log.warn("Kue UI already started at port 3000", {err: error});
  });
}

module.exports = queue;