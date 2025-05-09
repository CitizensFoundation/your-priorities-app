# Class: YourPrioritiesApi

The `YourPrioritiesApi` class is the main entry point and configuration for the Your Priorities Express.js application. It sets up the Express app, middleware, session management, Redis integration, static file serving, authentication, error handling, and API routes. It also manages WebSocket connections and provides hooks for initializing controllers and services.

---

## Table of Contents

- [Constructor](#constructor)
- [Methods](#methods)
- [Middleware](#middleware)
- [Error Handling](#error-handling)
- [Configuration](#configuration)
- [Interfaces](#interfaces)
- [Examples](#examples)

---

## Constructor

### `constructor(port?: number)`

Initializes the Express application, sets up Redis, middleware, static file serving, authentication, and routes.

**Parameters:**

| Name | Type   | Description                        |
|------|--------|------------------------------------|
| port | number | (Optional) Port to listen on.      |

---

## Methods

### `initialize(): Promise<void>`

Re-initializes the application, useful for programmatic restarts or reconfiguration.

---

### `async initializeRedis(): Promise<void>`

Initializes the Redis client for the application, using the `REDIS_URL` environment variable if present. Sets up event listeners for connection, error, and readiness.

---

### `addRedisToRequest(): void`

Middleware that attaches the Redis client to each request as `req.redisClient`.

---

### `addDirnameToRequest(): void`

Middleware that attaches the current directory name to each request as `req.dirName`.

---

### `addInviteAsAnonMiddleWare(): void`

Middleware that handles anonymous invites via query parameters. If a valid invite is found, it creates or finds an anonymous user, associates them with the relevant community/group, marks the invite as used, and logs the user in.

---

### `forceHttps(): void`

Middleware that redirects all HTTP requests to HTTPS, unless in development or explicitly disabled.

---

### `determineVersion(req: YpRequest): boolean`

Determines whether to use the new web app version based on query parameters, session, or domain configuration.

**Parameters:**

| Name | Type      | Description                |
|------|-----------|----------------------------|
| req  | YpRequest | The Express request object |

**Returns:** `boolean`

---

### `handleShortenedRedirects(): void`

Middleware that redirects shortened URLs (`/s/`, `/g/`, `/c/`) to their full forms (`/survey/`, `/group/`, `/community/`).

---

### `handleServiceWorker(req: YpRequest, res: express.Response): void`

Serves the appropriate service worker file based on the request path, with cache control headers.

---

### `setupDomainAndCommunity(): void`

Middleware that sets the current domain and community on the request using model methods.

---

### `async initializeRateLimiting(): Promise<void>`

Sets up rate limiting for bots and bad bots using `express-rate-limit` and custom logic.

---

### `setupSitemapRoute(): void`

Defines the `/sitemap.xml` route, serving a cached sitemap from Redis if available, or generating a new one.

---

### `bearerCallback(): void`

Logs when a user attempts to authenticate with a bearer token.

---

### `checkAuthForSsoInit(): void`

Middleware that initializes SSO for authentication-related routes.

---

### `initializeMiddlewares(): void`

Sets up core Express middlewares: logging, user agent parsing, IP detection, body parsing, CORS, compression, session management, and view engine.

---

### `async initializeEsControllers(): Promise<void>`

Dynamically imports and initializes ES module controllers (e.g., AllOurIdeas, PolicySynthAgents, Assistant), and sets up error handling.

---

### `setupStaticFileServing(): void`

Configures static file serving for various web apps, service workers, and sets cache headers. Also handles dynamic serving of index.html for SPA routes.

---

### `initializeRoutes(): void`

Sets up all main application routes, including API endpoints, legacy routes, authentication, and manifest generation.

---

### `initializePassportStrategies(): void`

Configures Passport.js for authentication, including serialization and deserialization of users for various providers (Facebook, SAML, OIDC, email).

---

### `completeRegisterUserLogin(user, loginType, req, done): void`

Updates the user's last login timestamp and logs a login activity.

**Parameters:**

| Name      | Type      | Description                |
|-----------|-----------|----------------------------|
| user      | any       | The user object            |
| loginType | string    | The login provider type    |
| req       | YpRequest | The request object         |
| done      | function  | Callback to invoke         |

---

### `registerUserLogin(user, userId, loginProvider, req, done): void`

Finds the user if necessary and completes the login registration process.

**Parameters:**

| Name         | Type      | Description                |
|--------------|-----------|----------------------------|
| user         | any|null  | The user object or null    |
| userId       | number    | The user ID                |
| loginProvider| string    | The login provider         |
| req          | YpRequest | The request object         |
| done         | function  | Callback to invoke         |

---

### `setupErrorHandler(): void`

Sets up error handling middleware for unauthorized errors, 404 not found, and general errors. Integrates with Airbrake for error reporting.

---

### `async listen(): Promise<void>`

Starts the HTTP(S) server and initializes the WebSockets manager.

---

### `setupHttpsServer(): any`

Creates and returns the HTTP(S) server, optionally binding to a specific host.

---

## Middleware

### Anonymous Invite Middleware

Handles anonymous invites via `anonInvite` and `token` query parameters. If a valid invite is found, creates or finds an anonymous user, associates them with the relevant community/group, marks the invite as used, and logs the user in.

**Parameters:**

| Name | Type      | Description                |
|------|-----------|----------------------------|
| req  | YpRequest | Express request object     |
| res  | Response  | Express response object    |
| next | NextFunction | Express next function   |

---

### Force HTTPS Middleware

Redirects HTTP requests to HTTPS unless in development or explicitly disabled.

---

### Redis Client Middleware

Attaches the Redis client to each request as `req.redisClient`.

---

### Dirname Middleware

Attaches the current directory name to each request as `req.dirName`.

---

### Rate Limiting Middleware

Applies rate limiting to bots and bad bots using `express-rate-limit` and custom logic.

---

### Domain and Community Middleware

Sets the current domain and community on the request using model methods.

---

### SSO Initialization Middleware

Initializes SSO for authentication-related routes.

---

### Static File Serving Middleware

Serves static files for various web apps, service workers, and sets cache headers. Handles dynamic serving of index.html for SPA routes.

---

## Error Handling

- **UnauthorizedError**: Returns 401 status and logs the error.
- **404 Not Found**: Returns 404 status and logs the error.
- **General Errors**: Returns appropriate status, logs the error, and optionally notifies Airbrake.

---

## Configuration

- **Redis**: Configured via `REDIS_URL` environment variable.
- **Session**: Uses RedisStore, session secret from `SESSION_SECRET`.
- **HTTPS**: Forced unless in development or `DISABLE_FORCE_HTTPS` is set.
- **Rate Limiting**: Configurable via `RATE_LIMITER_WINDOW_MS` and `RATE_LIMITER_MAX`.
- **Airbrake**: Error reporting if `AIRBRAKE_PROJECT_ID` and `AIRBRAKE_API_KEY` are set.
- **New Relic**: Dynamically imported if `NEW_RELIC_APP_NAME` is set.

---

## Interfaces

### `YpRequest`

Custom extension of `express.Request` with additional properties used throughout the app.

| Name           | Type      | Description                                 |
|----------------|-----------|---------------------------------------------|
| ypDomain       | any       | Current domain object                       |
| ypCommunity    | any       | Current community object                    |
| sso            | any       | SSO instance                               |
| redisClient    | any       | Redis client instance                       |
| user           | any       | Authenticated user object                   |
| clientAppPath  | string    | Path to client app static files             |
| adminAppPath   | string    | Path to admin app static files              |
| dirName        | string    | Directory name of the app                   |
| useNewVersion  | boolean   | Whether to use the new web app version      |

---

## Examples

```typescript
import { YourPrioritiesApi } from './yourPrioritiesApi';

const api = new YourPrioritiesApi(4242);
api.listen();
```

---

## Related Modules

- [controllers/index.cjs](./controllers/index.md)
- [controllers/posts.cjs](./controllers/posts.md)
- [controllers/groups.cjs](./controllers/groups.md)
- [controllers/communities.cjs](./controllers/communities.md)
- [controllers/domains.cjs](./controllers/domains.md)
- [controllers/organizations.cjs](./controllers/organizations.md)
- [controllers/points.cjs](./controllers/points.md)
- [controllers/users.cjs](./controllers/users.md)
- [controllers/categories.cjs](./controllers/categories.md)
- [controllers/images.cjs](./controllers/images.md)
- [controllers/externalIds.cjs](./controllers/externalIds.md)
- [controllers/ratings.cjs](./controllers/ratings.md)
- [controllers/bulkStatusUpdates.cjs](./controllers/bulkStatusUpdates.md)
- [controllers/videos.cjs](./controllers/videos.md)
- [controllers/audios.cjs](./controllers/audios.md)
- [controllers/legacyPosts.cjs](./controllers/legacyPosts.md)
- [controllers/legacyUsers.cjs](./controllers/legacyUsers.md)
- [controllers/legacyPages.cjs](./controllers/legacyPages.md)
- [controllers/nonSpa.cjs](./controllers/nonSpa.md)
- [services/controllers/news_feeds.cjs](./services/controllers/news_feeds.md)
- [services/controllers/activities.cjs](./services/controllers/activities.md)
- [services/controllers/notifications.cjs](./services/controllers/notifications.md)
- [services/controllers/recommendations.cjs](./services/controllers/recommendations.md)
- [utils/sitemap_generator.cjs](./utils/sitemap_generator.md)
- [utils/manifest_generator.cjs](./utils/manifest_generator.md)
- [utils/to_json.cjs](./utils/to_json.md)
- [utils/loggerTs.js](./utils/loggerTs.md)
- [webSockets.js](./webSockets.md)
- [bot_control.js](./bot_control.md)
- [models/index.cjs](./models/index.md)

---

## Notes

- This class is designed to be instantiated once per application instance.
- It is highly configurable via environment variables.
- Integrates with Passport.js for authentication, Redis for caching/session, and Airbrake for error reporting.
- Handles both legacy and modern (ES module) controllers.
- WebSocket support is managed via the [WebSocketsManager](./webSockets.md).

---

## See Also

- [Express.js Documentation](https://expressjs.com/)
- [Passport.js Documentation](http://www.passportjs.org/)
- [Redis Client for Node.js](https://github.com/redis/node-redis)
- [Airbrake Node Notifier](https://github.com/airbrake/node-airbrake)
- [Policy Synth Agents](https://github.com/CitizensFoundation/policy-synth/tree/main/agents)
