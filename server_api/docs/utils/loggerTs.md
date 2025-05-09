# Utility Module: logger

This module provides a configurable logging utility for the application. It conditionally exports either a [bunyan](https://github.com/trentm/node-bunyan) logger instance, a pretty-printed Bunyan logger for development, or the native `console` object as a fallback. The logger's behavior is controlled by the environment variables `USE_BUNYAN_LOGGER` and `NODE_ENV`.

## Description

- If `USE_BUNYAN_LOGGER` is set and `NODE_ENV` is not `'production'`, the logger outputs pretty-printed logs to `stdout` using [bunyan-prettystream](https://github.com/benbria/bunyan-prettystream).
- If `USE_BUNYAN_LOGGER` is set and `NODE_ENV` is `'production'`, a standard Bunyan logger is used.
- If `USE_BUNYAN_LOGGER` is not set, the logger falls back to the native `console` object (cast as `any` for compatibility).

This allows for flexible logging in different environments (development, production, or none).

## Exported Value

| Name   | Type         | Description                                                                 |
|--------|--------------|-----------------------------------------------------------------------------|
| logger | bunyan.Logger \| Console | The logger instance. Can be used as a drop-in replacement for `console` or as a Bunyan logger. |

## Configuration

| Environment Variable      | Description                                                                                  |
|--------------------------|----------------------------------------------------------------------------------------------|
| USE_BUNYAN_LOGGER        | If set (to any value), enables Bunyan logging.                                               |
| NODE_ENV                 | If set to `'production'`, disables pretty-printing and uses standard Bunyan logging.         |

## Usage

```typescript
import logger from './logger';

// Logging an info message
logger.info('Application started');

// Logging an error
logger.error({ err }, 'An error occurred');
```

## Behavior Table

| USE_BUNYAN_LOGGER | NODE_ENV      | Logger Type         | Output Format         |
|-------------------|---------------|---------------------|----------------------|
| unset/false       | any           | console             | Native console       |
| set (any value)   | not 'production' | bunyan (pretty)     | Pretty-printed Bunyan|
| set (any value)   | 'production'  | bunyan (standard)   | JSON Bunyan          |

## Notes

- When using the fallback `console` logger, only standard console methods are available.
- When using Bunyan, you can use Bunyan's structured logging features (e.g., passing objects as the first argument).
- The logger is always exported as the default export.

---

**Related:**  
- [bunyan documentation](https://github.com/trentm/node-bunyan)  
- [bunyan-prettystream documentation](https://github.com/benbria/bunyan-prettystream)