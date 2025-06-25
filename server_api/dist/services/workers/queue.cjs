"use strict";
const log = require('../../utils/logger.cjs');
const url = require('url');
var airbrake = null;
if (process.env.AIRBRAKE_PROJECT_ID) {
    airbrake = require('../utils/airbrake.cjs');
}
const BullQueue = require('bull');
let redisUrl = process.env.REDIS_URL ? process.env.REDIS_URL : "redis://localhost:6379";
if (redisUrl.startsWith("redis://h:")) {
    redisUrl = redisUrl.replace("redis://h:", "redis://:");
}
const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 100;
const redissOptions = {
    tls: {
        rejectUnauthorized: false,
    },
};
log.info("Starting app access to Bull Queue", { redis_url: redisUrl });
class YpQueue {
    constructor() {
        log.info("Create YpQueue");
        this.createQueues();
    }
    get defaultQueueOptions() {
        return {
            redis: redisUrl.includes("rediss://") ? redissOptions : undefined,
            defaultJobOptions: {
                attempts: 1,
                removeOnComplete: true,
                removeOnFail: true
            }
        };
    }
    process(name, concurrency, processor) {
        this.mainQueue.process(name, concurrency, processor);
    }
    add(name, workPackage, priority, options) {
        const jobOptions = options || {};
        let priorityNumber = 1000;
        switch (priority) {
            case 'now':
                priorityNumber = 1;
                break;
            case 'critical':
                priorityNumber = 5;
                break;
            case 'high':
                priorityNumber = 100;
                break;
            case 'medium':
                priorityNumber = 1000;
                break;
            case 'low':
                priorityNumber = 10000;
                break;
        }
        jobOptions.priority = priorityNumber;
        this.mainQueue.add(name, workPackage, jobOptions);
    }
    createQueues() {
        this.mainQueue = new BullQueue('mainYpQueue', redisUrl, this.defaultQueueOptions);
        this.mainQueue.on('active', function (job) {
            log.info('JQ', { id: job.id, name: job.name });
        }).on('completed', function (job, result) {
            log.info('JC', { id: job.id, name: job.name });
        }).on('failed', function (job, error) {
            log.error('Job Failed', { id: job ? job.id : null, name: job ? job.name : null, data: job ? job.data : null, error });
        }).on('resumed', function (job) {
            log.info('Job Removed', { id: job.id });
        }).on('waiting', function (jobId) {
            log.info('Job Waiting', { id: jobId });
        }).on('stalled', function (job) {
            log.info('Job Stalled', { id: job.id, name: job.name, data: job.data, });
        }).on('progress', function (job, process) {
            log.info('Job Progress', { id: job.id, process });
        }).on('paused', function () {
            log.info('Queue Paused');
        }).on('cleaned', function (jobs, type) {
            log.info('Job Cleaned', { jobs, type });
        }).on('drained', function () {
            log.info('Queue Drained');
        }).on('error', function (error) {
            log.error('Job Error', { error });
            if (airbrake) {
                if (!(error instanceof Error)) {
                    error = new Error(error);
                }
                airbrake.notify(error).then((airbrakeErr) => {
                    if (airbrakeErr.error) {
                        log.error("AirBrake Error", { context: 'airbrake', err: airbrakeErr.error, errorStatus: 500 });
                    }
                });
            }
        });
    }
}
module.exports = new YpQueue();
