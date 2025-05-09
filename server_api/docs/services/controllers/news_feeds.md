# API Routes: News Feed Endpoints

This module defines Express.js routes for fetching curated news feed items for various entities: domains, communities, groups, and posts. Each endpoint is protected by authorization middleware and returns a list of activities and the timestamp of the oldest processed activity.

---

## API Endpoint: GET /domains/:id

Fetch curated news feed activities for a specific domain.

### Request

#### Parameters

| Name      | Type   | In   | Description                  | Required |
|-----------|--------|------|------------------------------|----------|
| id        | string | path | The ID of the domain         | Yes      |
| afterDate | string | query| ISO date string; only activities after this date will be included | No       |
| beforeDate| string | query| ISO date string; only activities before this date will be included | No       |

#### Headers

| Name          | Type   | Description                | Required |
|---------------|--------|----------------------------|----------|
| Authorization | string | Bearer token for auth      | Yes      |

#### Body

No request body.

### Response

#### Success (200)
```json
{
  "activities": [ /* array of activity objects */ ],
  "oldestProcessedActivityAt": "2024-06-01T12:00:00.000Z"
}
```
- `activities`: Array of curated activity objects (structure defined by the news feed engine).
- `oldestProcessedActivityAt`: ISO timestamp string of the oldest processed activity.

#### Error (500)
```json
{
  "error": "Internal Server Error"
}
```
Returned if an error occurs during news feed generation.

---

## API Endpoint: GET /communities/:id

Fetch curated news feed activities for a specific community.

### Request

#### Parameters

| Name      | Type   | In   | Description                  | Required |
|-----------|--------|------|------------------------------|----------|
| id        | string | path | The ID of the community      | Yes      |
| afterDate | string | query| ISO date string; only activities after this date will be included | No       |
| beforeDate| string | query| ISO date string; only activities before this date will be included | No       |

#### Headers

| Name          | Type   | Description                | Required |
|---------------|--------|----------------------------|----------|
| Authorization | string | Bearer token for auth      | Yes      |

#### Body

No request body.

### Response

#### Success (200)
```json
{
  "activities": [ /* array of activity objects */ ],
  "oldestProcessedActivityAt": "2024-06-01T12:00:00.000Z"
}
```
- `activities`: Array of curated activity objects.
- `oldestProcessedActivityAt`: ISO timestamp string.

#### Error (500)
```json
{
  "error": "Internal Server Error"
}
```
Returned if an error occurs during news feed generation.

---

## API Endpoint: GET /groups/:id

Fetch curated news feed activities for a specific group.

### Request

#### Parameters

| Name      | Type   | In   | Description                  | Required |
|-----------|--------|------|------------------------------|----------|
| id        | string | path | The ID of the group          | Yes      |
| afterDate | string | query| ISO date string; only activities after this date will be included | No       |
| beforeDate| string | query| ISO date string; only activities before this date will be included | No       |

#### Headers

| Name          | Type   | Description                | Required |
|---------------|--------|----------------------------|----------|
| Authorization | string | Bearer token for auth      | Yes      |

#### Body

No request body.

### Response

#### Success (200)
```json
{
  "activities": [ /* array of activity objects */ ],
  "oldestProcessedActivityAt": "2024-06-01T12:00:00.000Z"
}
```
- `activities`: Array of curated activity objects.
- `oldestProcessedActivityAt`: ISO timestamp string.

#### Error (500)
```json
{
  "error": "Internal Server Error"
}
```
Returned if an error occurs during news feed generation.

---

## API Endpoint: GET /posts/:id

Fetch curated news feed activities for a specific post.

### Request

#### Parameters

| Name      | Type   | In   | Description                  | Required |
|-----------|--------|------|------------------------------|----------|
| id        | string | path | The ID of the post           | Yes      |
| afterDate | string | query| ISO date string; only activities after this date will be included | No       |
| beforeDate| string | query| ISO date string; only activities before this date will be included | No       |

#### Headers

| Name          | Type   | Description                | Required |
|---------------|--------|----------------------------|----------|
| Authorization | string | Bearer token for auth      | Yes      |

#### Body

No request body.

### Response

#### Success (200)
```json
{
  "activities": [ /* array of activity objects */ ],
  "oldestProcessedActivityAt": "2024-06-01T12:00:00.000Z"
}
```
- `activities`: Array of curated activity objects.
- `oldestProcessedActivityAt`: ISO timestamp string.

#### Error (500)
```json
{
  "error": "Internal Server Error"
}
```
Returned if an error occurs during news feed generation.

---

# Middleware

## Middleware: auth.can(permission)

Authorization middleware that checks if the current user has the specified permission (e.g., `'view domain'`, `'view community'`, etc.).

### Parameters

| Name       | Type     | Description                        |
|------------|----------|------------------------------------|
| permission | string   | The required permission string      |

## Middleware: auth.isLoggedInNoAnonymousCheck

Ensures the user is authenticated (not anonymous). Used after `auth.can()` to enforce login.

### Parameters

| Name | Type     | Description                  |
|------|----------|------------------------------|
| req  | Request  | Express request object       |
| res  | Response | Express response object      |
| next | Function | Express next function        |

---

# Controller Logic

Each route handler performs the following steps:
1. Calls `setupOptions(req)` to build an options object from the request.
2. Adds the relevant entity ID (`domain_id`, `community_id`, `group_id`, or `post_id`) to the options.
3. Calls `getCuratedNewsItems(options, callback)` to fetch activities.
4. Handles errors by logging and returning HTTP 500, or returns the activities and timestamp.

---

# Utility Function: setupOptions

Builds an options object for fetching curated news items, based on the request's user and optional date filters.

## Parameters

| Name | Type     | Description                  |
|------|----------|------------------------------|
| req  | Request  | Express request object       |

## Returns

| Type   | Description                                      |
|--------|--------------------------------------------------|
| object | Options object for `getCuratedNewsItems`         |

### Options Object Properties

| Name      | Type    | Description                                 |
|-----------|---------|---------------------------------------------|
| user_id   | string  | ID of the current user (`req.user.id`)      |
| afterDate | Date    | (Optional) Only include after this date     |
| beforeDate| Date    | (Optional) Only include before this date    |

---

# Service: getCuratedNewsItems

Imported from: `../engine/news_feeds/generate_dynamically.cjs`

Fetches curated news feed activities based on the provided options.

## Parameters

| Name    | Type     | Description                                 |
|---------|----------|---------------------------------------------|
| options | object   | Options for filtering news feed items       |
| callback| function | Callback: `(error, activities, oldestProcessedActivityAt)` |

## Callback Parameters

| Name                     | Type     | Description                                 |
|--------------------------|----------|---------------------------------------------|
| error                    | Error    | Error object, if any                        |
| activities               | array    | Array of activity objects                   |
| oldestProcessedActivityAt| string   | ISO timestamp string                        |

---

# Logging Utility

## Utility Module: log

Imported from: `../utils/logger.cjs`

Used for logging errors with context, e.g., when news feed generation fails.

---

# Export

This module exports the configured Express router with all news feed endpoints.

---

# See Also

- [authorization.cjs](../../authorization.cjs) - Authorization middleware.
- [logger.cjs](../utils/logger.cjs) - Logging utility.
- [generate_dynamically.cjs](../engine/news_feeds/generate_dynamically.cjs) - News feed generation logic.
