# Utility Module: logger

This module provides a logging utility for the application. It conditionally exports either a [bunyan](https://github.com/trentm/node-bunyan) logger (optionally with pretty-printing for development), or the native `console` object, depending on environment variables.

## Description

- If `USE_BUNYAN_LOGGER` is set in the environment:
  - In **non-production** (`NODE_ENV !== 'production'`), it uses [bunyan-prettystream](https://github.com/robertklep/bunyan-prettystream) to pretty-print logs to `stdout` at the `debug` level.
  - In **production**, it uses a standard bunyan logger with the name `"your-priorities"`.
- If `USE_BUNYAN_LOGGER` is **not** set, it falls back to the native `console` object.

This allows for flexible logging configuration based on deployment environment and developer preference.

## Exported Value

| Name   | Type         | Description                                                                                 |
|--------|--------------|---------------------------------------------------------------------------------------------|
| logger | Bunyan Logger \| Console | The logger instance. Either a Bunyan logger or the native `console` object, depending on configuration. |

## Configuration

The behavior of this module is controlled by the following environment variables:

| Variable             | Description                                                                                  |
|----------------------|----------------------------------------------------------------------------------------------|
| USE_BUNYAN_LOGGER    | If set (to any value), enables use of Bunyan logger.                                         |
| NODE_ENV             | If set to `'production'`, disables pretty-printing and uses a standard Bunyan logger.        |

## Usage Example

```javascript
const logger = require('./logger');

// Logging an info message
logger.info('Application started');

// Logging an error
logger.error('Something went wrong', err);
```

## Dependencies

- [bunyan](https://github.com/trentm/node-bunyan): A simple and fast JSON logging library for Node.js services.
- [bunyan-prettystream](https://github.com/robertklep/bunyan-prettystream): Used for pretty-printing logs in development.

## Internal Logic

- In development (when `NODE_ENV !== 'production'`), logs are pretty-printed for easier reading.
- In production, logs are output in standard Bunyan JSON format for compatibility with log aggregation tools.
- If Bunyan is not enabled, the standard `console` object is used, ensuring logging is always available.

---

**Note:**  
This module is typically required at the top of your application files to provide a consistent logging interface throughout your codebase.