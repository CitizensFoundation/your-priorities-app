var kue = require('kue')
  , url = require('url')
  , redis = require('kue/node_modules/redis');
var log = require('../utils/logger');
var email = require('./email');
var activity = require('./activity');
var toJson = require('../utils/to_json');

// make sure we use the Heroku Redis To Go URL
// (put REDISTOGO_URL=redis://localhost:6379 in .env for local testing)

log.info("Starting app access to Kue Queue", {redis_url: process.env.REDIS_URL});
var redisUrl = process.env.REDIS_URL ? process.env.REDIS_URL : "localhost:6379";

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

module.exports = queue;