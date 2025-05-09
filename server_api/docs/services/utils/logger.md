# Utility Module: logger

This module provides a logging utility for the application, abstracting the use of [bunyan](https://github.com/trentm/node-bunyan) and [bunyan-prettystream](https://github.com/robertkowalski/bunyan-prettystream) for structured and optionally pretty-printed logs. It conditionally configures the logger based on environment variables, falling back to the native `console` if bunyan is not enabled.

## Description

- If `USE_BUNYAN_LOGGER` is set in the environment and `NODE_ENV` is not `'production'`, logs are output in a pretty, colorized format to stdout using bunyan and bunyan-prettystream.
- If `USE_BUNYAN_LOGGER` is set and `NODE_ENV` is `'production'`, logs are output in bunyan's default JSON format.
- If `USE_BUNYAN_LOGGER` is not set, the logger falls back to the native `console` object.

This allows for flexible logging configuration suitable for both development and production environments.

## Exported Constants

| Name   | Type    | Description                                                                 |
|--------|---------|-----------------------------------------------------------------------------|
| logger | Logger \| Console | The logger instance. Can be a bunyan logger or the native console object. |

- When bunyan is used, the logger supports all [bunyan logger methods](https://github.com/trentm/node-bunyan#log-methods), such as `info`, `warn`, `error`, `debug`, etc.
- When falling back to `console`, the logger supports standard console methods: `log`, `info`, `warn`, `error`, etc.

## Configuration

The logger's behavior is controlled by the following environment variables:

| Variable             | Description                                                                                 |
|----------------------|---------------------------------------------------------------------------------------------|
| USE_BUNYAN_LOGGER    | If set (to any value), enables bunyan logging.                                              |
| NODE_ENV             | If set to `'production'`, disables pretty printing and uses bunyan's default JSON output.    |

## Usage Example

```javascript
const logger = require('./logger');

// Logging an info message
logger.info('Application started');

// Logging an error
logger.error({ err: new Error('Something went wrong') }, 'An error occurred');
```

## Dependencies

- [bunyan](https://github.com/trentm/node-bunyan): For structured logging.
- [bunyan-prettystream](https://github.com/robertkowalski/bunyan-prettystream): For pretty-printing logs in development.

## Notes

- In development (when `NODE_ENV` is not `'production'`), logs are colorized and human-readable.
- In production, logs are structured JSON, suitable for log aggregation and analysis tools.
- If bunyan is not enabled, the logger is simply the native `console` object, ensuring that logging calls do not break the application.

---

**See also:**  
- [bunyan documentation](https://github.com/trentm/node-bunyan)  
- [bunyan-prettystream documentation](https://github.com/robertkowalski/bunyan-prettystream)