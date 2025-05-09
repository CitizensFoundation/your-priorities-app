# Utility Module: plausible.cjs

This module provides utility functions for interacting with the [Plausible Analytics](https://plausible.io/) API, including event tracking, goal management, statistics retrieval, and favicon fetching. It is designed to be used in a Node.js/Express.js backend and relies on environment variables for configuration.

---

## Configuration

The following environment variables must be set for the module to function correctly:

| Name                      | Description                                      | Required |
|---------------------------|--------------------------------------------------|----------|
| PLAUSIBLE_BASE_URL        | Base URL for the Plausible API (e.g., `https://user:pass@plausible.io/api/v1/`) | Yes      |
| PLAUSIBLE_API_KEY         | API key for authenticating with Plausible        | Yes      |
| PLAUSIBLE_EVENT_BASE_URL  | Base URL for Plausible event API (e.g., `https://plausible.io/api/event/`) | For event tracking |
| PLAUSIBLE_SITE_NAME       | The site name as registered in Plausible         | For goal/event management |

---

## Exported Constants

### `allGoals`
An array of strings representing all possible event/goal names that can be registered with Plausible.

---

## Functions

### addPlausibleEvent

Tracks a custom event in Plausible Analytics, enriching it with contextual properties (community, group, post, user, etc.).

#### Parameters

| Name      | Type     | Description                                                                 |
|-----------|----------|-----------------------------------------------------------------------------|
| eventName | string   | The name of the event to track.                                             |
| workData  | object   | Data object containing event context and user/session information.           |

- `workData.body` should include: `user_agent`, `url`, `screen_width`, `referrer`, `ipAddress`, `userLocale`, `userAutoTranslate`, `originalQueryString`, and optionally `props`.
- `workData` may also include: `groupId`, `postId`, `communityId`, `domainId`, `pointId`, `userId`.

#### Returns

- `Promise<void>` — Resolves when the event is sent or if configuration is missing. Rejects on error.

#### Example

```javascript
await addPlausibleEvent('newPost - completed', {
  body: {
    user_agent: 'Mozilla/5.0 ...',
    url: 'https://example.com/post/123',
    screen_width: 1920,
    referrer: 'https://google.com',
    ipAddress: '1.2.3.4',
    userLocale: 'en',
    userAutoTranslate: 'true'
  },
  postId: 123,
  userId: 456
});
```

---

### getPlausibleStats

Fetches statistics from the Plausible API for a given stats parameter string.

#### Parameters

| Name        | Type   | Description                                 |
|-------------|--------|---------------------------------------------|
| statsParams | string | The stats query string (e.g., `timeseries?site_id=...`). |

#### Returns

- `Promise<string>` — Resolves with the raw response body from Plausible, or `undefined` if configuration is missing.

#### Example

```javascript
const stats = await getPlausibleStats('timeseries?site_id=my-site&period=30d');
```

---

### addAllPlausibleGoals

Registers all goals defined in `allGoals` with the Plausible API for the configured site.

#### Parameters

_None_

#### Returns

- `Promise<void>` — Resolves when all goals have been processed.

#### Example

```javascript
await addAllPlausibleGoals();
```

---

### addPlausibleGoal

Registers a single goal/event with the Plausible API.

#### Parameters

| Name      | Type   | Description                        |
|-----------|--------|------------------------------------|
| eventName | string | The name of the event/goal to add. |

#### Returns

- `Promise<string|undefined>` — Resolves with the response body or `undefined` if configuration is missing.

#### Example

```javascript
await addPlausibleGoal('newPost - completed');
```

---

### plausibleStatsProxy

Proxies a request to the Plausible API, modifying filters and query parameters as needed for custom analytics.

#### Parameters

| Name         | Type    | Description                                                                 |
|--------------|---------|-----------------------------------------------------------------------------|
| plausibleUrl | string  | The Plausible API endpoint URL (with query string).                         |
| props        | object  | Custom properties to inject into the Plausible query (for filtering, etc.). |

#### Returns

- `Promise<string|undefined>` — Resolves with the raw response body from Plausible, or `undefined` if configuration is missing.

#### Example

```javascript
const result = await plausibleStatsProxy(
  '/stats/timeseries?site_id=my-site&period=30d&filters={}',
  { communityId: 123 }
);
```

---

### sendPlausibleFavicon

Fetches the favicon for a given source from the Plausible API.

#### Parameters

| Name       | Type   | Description                        |
|------------|--------|------------------------------------|
| sourceName | string | The name of the favicon source.    |

#### Returns

- `Promise<Buffer|undefined>` — Resolves with the favicon binary data, or `undefined` if configuration is missing.

#### Example

```javascript
const favicon = await sendPlausibleFavicon('my-site');
```

---

## Internal Dependencies

- [models](../../../../models/index.cjs): Used for fetching `Group`, `Post`, and `Community` data to enrich event properties.
- [logger](../../../utils/logger.cjs): Used for logging debug, info, warning, and error messages.
- [request](https://www.npmjs.com/package/request): Used for making HTTP requests to the Plausible API.
- [moment](https://momentjs.com/): Used for date manipulation and formatting.

---

## Error Handling

- All functions return Promises and reject with error messages or status codes on failure.
- If required environment variables are missing, functions log a warning and resolve with `undefined` or no value.

---

## See Also

- [Plausible API Documentation](https://plausible.io/docs/api)
- [models/index.cjs](../../../../models/index.cjs)
- [logger.cjs](../../../utils/logger.cjs)

---

## Exported Functions

| Name                  | Description                                               |
|-----------------------|-----------------------------------------------------------|
| addPlausibleEvent     | Tracks a custom event in Plausible.                       |
| getPlausibleStats     | Fetches statistics from Plausible.                        |
| addAllPlausibleGoals  | Registers all predefined goals with Plausible.            |
| plausibleStatsProxy   | Proxies and customizes Plausible stats API requests.      |
| sendPlausibleFavicon  | Fetches a favicon from Plausible for a given source name. |

---

## Example Usage

```javascript
const plausible = require('./plausible.cjs');

await plausible.addPlausibleEvent('newPost - completed', workData);
const stats = await plausible.getPlausibleStats('timeseries?site_id=my-site&period=30d');
await plausible.addAllPlausibleGoals();
const proxyResult = await plausible.plausibleStatsProxy('/stats/timeseries?site_id=my-site&period=30d&filters={}', { communityId: 123 });
const favicon = await plausible.sendPlausibleFavicon('my-site');
```
