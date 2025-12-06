const log = require('../../utils/logger.cjs');
const url = require('url');

var airbrake = null;
if(process.env.AIRBRAKE_PROJECT_ID) {
  airbrake = require('../utils/airbrake.cjs');
}

const { Queue, Worker } = require('bullmq');

let redisUrl = process.env.REDIS_URL ? process.env.REDIS_URL : "redis://localhost:6379";

if (redisUrl.startsWith("redis://h:")) {
  redisUrl = redisUrl.replace("redis://h:","redis://:")
}

const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 100;

// Parse redis URL to get connection options
const parsedRedisUrl = new URL(redisUrl);
const redisConnection = {
  host: parsedRedisUrl.hostname,
  port: parseInt(parsedRedisUrl.port) || 6379,
  password: parsedRedisUrl.password || undefined,
  username: parsedRedisUrl.username || undefined,
};

// Add TLS options for rediss:// URLs
if (redisUrl.startsWith("rediss://")) {
  redisConnection.tls = {
    rejectUnauthorized: false,
  };
}

log.info("Starting app access to BullMQ Queue", {redis_url: redisUrl});

const queuePrefix =
    process.env.MAIN_WORKER_QUEUE_NAME ||
    process.env.MAIN_QUEUE_NAME ||
    process.env.BULL_PREFIX ||
    'mainYpQueue';

class YpQueue {
  constructor() {
    log.info("Create YpQueue")
    this.processors = new Map(); // Store processors per job name
    this.workers = new Map(); // Store workers per job name
    this.queues = new Map(); // Store queues per job name
    this.queuePrefix = queuePrefix;
  }

  get defaultJobOptions() {
    return {
      attempts: 1,
      removeOnComplete: true,
      removeOnFail: true
    }
  }

  // Wrap callback-style processor to work with BullMQ's promise-based API
  wrapProcessor(processor) {
    return (job) => {
      return new Promise((resolve, reject) => {
        // Call the processor with job and a done callback
        processor(job, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    };
  }

  process(name, concurrency, processor) {
    if (this.workers.has(name)) {
      log.warn('Processor already registered, skipping re-registration', { name });
      return;
    }

    const wrappedProcessor = this.wrapProcessor(processor);
    this.processors.set(name, wrappedProcessor);

    const queue = this.getQueue(name);

    log.info('Registered processor', { name, concurrency, queue: queue.name });

    const worker = new Worker(queue.name, wrappedProcessor, {
      connection: redisConnection,
      concurrency,
      name
    });

    this.workers.set(name, worker);
    this.setupWorkerEvents(worker);
  }

  add(name, workPackage, priority, options) {
    const queue = this.getQueue(name);
    const jobOptions = { ...this.defaultJobOptions, ...(options || {}) };

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

    queue.add(name, workPackage, jobOptions);
  }

  getQueue(name) {
    if (this.queues.has(name)) {
      return this.queues.get(name);
    }

    const queueName = `${this.queuePrefix}-${name}`;

    const queue = new Queue(queueName, {
      connection: redisConnection,
      defaultJobOptions: this.defaultJobOptions
    });

    queue.on('error', (error) => {
      log.error('Queue Error', { error });
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

    this.queues.set(name, queue);
    return queue;
  }

  setupWorkerEvents(worker) {
    worker.on('active', (job) => {
      log.info('JQ', { id: job.id, name: job.name });
    });

    worker.on('completed', (job) => {
      log.info('JC', { id: job.id, name: job.name });
    });

    worker.on('failed', (job, error) => {
      log.error('Job Failed', { id: job ? job.id : null, name: job ? job.name : null, data: job ? job.data : null, error });
    });

    worker.on('stalled', (jobId) => {
      log.info('Job Stalled', { id: jobId });
    });

    worker.on('progress', (job, progress) => {
      log.info('Job Progress', { id: job.id, progress });
    });

    worker.on('error', (error) => {
      log.error('Worker Error', { error });
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
