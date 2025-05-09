# Service Module: YpQueue

This module provides a singleton queue service built on top of [Bull](https://github.com/OptimalBits/bull), a Redis-based job/task queue for Node.js. It manages a main queue (`mainYpQueue`) for background job processing, with support for job priorities, event logging, and error reporting (optionally via Airbrake).

## Configuration

- **Redis URL**: The queue connects to Redis using the `REDIS_URL` environment variable, defaulting to `redis://localhost:6379` if not set.
- **TLS Support**: If the Redis URL uses `rediss://`, TLS options are set to allow self-signed certificates.
- **Airbrake Integration**: If `AIRBRAKE_PROJECT_ID` is set in the environment, errors are reported to Airbrake.

## Exported Instance

The module exports a singleton instance of the `YpQueue` class.

---

## Class: YpQueue

Manages the main Bull queue, provides methods to add and process jobs, and handles queue events with logging and error reporting.

### Constructor

```js
new YpQueue()
```
- Initializes the main queue and sets up event listeners.

### Properties

| Name                | Type     | Description                                                                 |
|---------------------|----------|-----------------------------------------------------------------------------|
| mainQueue           | BullQueue| The main Bull queue instance (`mainYpQueue`).                               |
| defaultQueueOptions | object   | Default options for the Bull queue, including Redis and job options.         |

#### `defaultQueueOptions`

- If the Redis URL uses `rediss://`, applies TLS options.
- Sets default job options:
  - `attempts`: 1
  - `removeOnComplete`: true
  - `removeOnFail`: true

### Methods

#### process

Registers a processor function for a named job type.

```js
process(name: string, concurrency: number, processor: Function): void
```

| Name       | Type     | Description                                      |
|------------|----------|--------------------------------------------------|
| name       | string   | The job name/type to process.                    |
| concurrency| number   | Number of concurrent processors for this job.    |
| processor  | Function | The function to process jobs of this type.       |

**Usage Example:**
```js
YpQueue.process('email', 5, async (job) => { /* ... */ });
```

#### add

Adds a job to the main queue with a specified priority.

```js
add(name: string, workPackage: object, priority: string, options?: object): void
```

| Name        | Type     | Description                                                      |
|-------------|----------|------------------------------------------------------------------|
| name        | string   | The job name/type.                                               |
| workPackage | object   | The job data payload.                                            |
| priority    | string   | Priority level: 'now', 'critical', 'high', 'medium', 'low'.     |
| options     | object   | (Optional) Additional Bull job options.                          |

**Priority Mapping:**

| Priority   | Bull Priority Number |
|------------|---------------------|
| now        | 1                   |
| critical   | 5                   |
| high       | 100                 |
| medium     | 1000                |
| low        | 10000               |

**Usage Example:**
```js
YpQueue.add('sendEmail', { to: 'user@example.com' }, 'high');
```

#### createQueues

Initializes the main Bull queue and sets up event listeners for job lifecycle events.

```js
createQueues(): void
```

- Called internally by the constructor.
- Listens for events: `active`, `completed`, `failed`, `resumed`, `waiting`, `stalled`, `progress`, `paused`, `cleaned`, `drained`, `error`.
- Logs all events using the logger utility.
- On error, optionally reports to Airbrake.

---

## Event Listeners

The queue logs and/or reports the following events:

| Event      | Description                                                      | Logging/Reporting Action                |
|------------|------------------------------------------------------------------|-----------------------------------------|
| active     | Job has started processing.                                      | Logs job id and name.                   |
| completed  | Job has completed.                                               | Logs job id and name.                   |
| failed     | Job has failed.                                                  | Logs job id, name, data, and error.     |
| resumed    | Job has been resumed.                                            | Logs job id.                            |
| waiting    | Job is waiting to be processed.                                  | Logs job id.                            |
| stalled    | Job has stalled.                                                 | Logs job id, name, and data.            |
| progress   | Job progress update.                                             | Logs job id and progress.               |
| paused     | Queue has been paused.                                           | Logs event.                             |
| cleaned    | Jobs have been cleaned from the queue.                           | Logs job info and type.                 |
| drained    | All jobs have been processed.                                    | Logs event.                             |
| error      | An error occurred in the queue.                                  | Logs error and reports to Airbrake if configured. |

---

## Dependencies

- [Bull](https://github.com/OptimalBits/bull): Job queue.
- [logger.cjs](../utils/logger.cjs): Logging utility.
- [airbrake.cjs](../utils/airbrake.cjs): Airbrake error reporting (optional).
- [url](https://nodejs.org/api/url.html): Node.js URL utilities.
- [events](https://nodejs.org/api/events.html): Node.js EventEmitter.

---

## Export

```js
module.exports = new YpQueue();
```
Exports a singleton instance of the `YpQueue` class.

---

## Example Usage

```js
const YpQueue = require('./path/to/this/file');

// Register a processor for a job type
YpQueue.process('email', 5, async (job) => {
  // process job.data
});

// Add a job to the queue
YpQueue.add('email', { to: 'user@example.com', subject: 'Hello' }, 'high');
```

---

## Related Modules

- [logger.cjs](../utils/logger.cjs)
- [airbrake.cjs](../utils/airbrake.cjs)
- [Bull (npm)](https://www.npmjs.com/package/bull)
