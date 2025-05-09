# Utility Module: redisClient

This module provides a configured Redis client instance for use throughout the application. It handles connection setup, environment-based configuration, and event logging for Redis connectivity. The client is created using the [node-redis](https://github.com/redis/node-redis) library and is exported as a singleton.

## Configuration

The Redis client is configured based on the presence and value of the `REDIS_URL` environment variable:

- **If `REDIS_URL` is set:**
  - If the URL starts with `redis://h:`, it is rewritten to `redis://:` to ensure compatibility with certain Redis providers (e.g., Heroku).
  - If the URL contains `rediss://`, the client is created with TLS enabled (`socket: { tls: true, rejectUnauthorized: false }`) and `legacyMode: false`.
  - Otherwise, the client is created with `legacyMode: true`.
- **If `REDIS_URL` is not set:**
  - The client is created with `legacyMode: true` and default connection settings.

## Exported Constants

| Name         | Type         | Description                                      |
|--------------|--------------|--------------------------------------------------|
| redisClient  | RedisClient  | Configured and connected Redis client instance.   |

## Event Listeners

The client sets up the following event listeners for logging and debugging:

| Event         | Handler Description                                      |
|---------------|---------------------------------------------------------|
| error         | Logs Redis client errors to the console.                |
| connect       | Logs when the client successfully connects.             |
| reconnecting  | Logs when the client is attempting to reconnect.        |
| ready         | Logs when the client is ready to use.                   |

## Usage

You can import and use the `redisClient` instance in other modules to interact with Redis.

```javascript
const redisClient = require('./path/to/redisClient');

// Example: Set a value
await redisClient.set('key', 'value');

// Example: Get a value
const value = await redisClient.get('key');
```

## Example

```javascript
const redisClient = require('./redisClient');

async function cacheData(key, value) {
  await redisClient.set(key, value);
}

async function getCachedData(key) {
  return await redisClient.get(key);
}
```

## Notes

- The client is connected immediately upon module load via `redisClient.connect()`.
- Errors during connection are caught and logged.
- The configuration supports both standard and TLS-secured Redis connections.
- The `legacyMode` option is toggled based on the connection type for compatibility with older Redis command APIs.

## Related

- [node-redis documentation](https://github.com/redis/node-redis)
- [Heroku Redis documentation](https://devcenter.heroku.com/articles/heroku-redis)

---

**Exported by:**  
```js
module.exports = redisClient;
```
**Type:**  
`RedisClient` instance from the `redis` package.