# API Documentation: activities.cjs

This module defines Express.js routes for fetching activity feeds related to domains, communities, groups, and posts. It provides endpoints to retrieve recent activities, with support for filtering by date and entity, and includes related media and user information.

---

# API Endpoint: GET /domains/:id

Fetches the latest activities for a specific domain.

## Request

### Parameters

| Name      | Type   | In   | Description                | Required |
|-----------|--------|------|----------------------------|----------|
| id        | string | path | The ID of the domain       | Yes      |
| afterDate | string | query| ISO date string; fetch activities after this date | No |
| beforeDate| string | query| ISO date string; fetch activities before this date | No |

### Headers

| Name          | Type   | Description                        | Required |
|---------------|--------|------------------------------------|----------|
| Authorization | string | Bearer token for authentication    | Yes      |

### Body

Not required.

## Response

### Success (200)
```json
{
  "activities": [ /* Array of activity objects */ ],
  "oldestProcessedActivityAt": "2024-06-01T12:34:56.000Z"
}
```
- `activities`: Array of activity objects (see [AcActivity Model](../../models/index.cjs)).
- `oldestProcessedActivityAt`: ISO date string of the oldest activity returned, or `null` if none.

### Error (500)
```json
{
  "error": "Internal Server Error"
}
```
Returned if an error occurs during processing.

---

# API Endpoint: GET /communities/:id

Fetches the latest activities for a specific community.

## Request

### Parameters

| Name      | Type   | In   | Description                | Required |
|-----------|--------|------|----------------------------|----------|
| id        | string | path | The ID of the community    | Yes      |
| afterDate | string | query| ISO date string; fetch activities after this date | No |
| beforeDate| string | query| ISO date string; fetch activities before this date | No |

### Headers

| Name          | Type   | Description                        | Required |
|---------------|--------|------------------------------------|----------|
| Authorization | string | Bearer token for authentication    | Yes      |

### Body

Not required.

## Response

### Success (200)
```json
{
  "activities": [ /* Array of activity objects */ ],
  "oldestProcessedActivityAt": "2024-06-01T12:34:56.000Z"
}
```
- `activities`: Array of activity objects.
- `oldestProcessedActivityAt`: ISO date string of the oldest activity returned, or `null` if none.

### Error (500)
```json
{
  "error": "Internal Server Error"
}
```
Returned if an error occurs during processing.

---

# API Endpoint: GET /groups/:id

Fetches the latest activities for a specific group.

## Request

### Parameters

| Name      | Type   | In   | Description                | Required |
|-----------|--------|------|----------------------------|----------|
| id        | string | path | The ID of the group        | Yes      |
| afterDate | string | query| ISO date string; fetch activities after this date | No |
| beforeDate| string | query| ISO date string; fetch activities before this date | No |

### Headers

| Name          | Type   | Description                        | Required |
|---------------|--------|------------------------------------|----------|
| Authorization | string | Bearer token for authentication    | Yes      |

### Body

Not required.

## Response

### Success (200)
```json
{
  "activities": [ /* Array of activity objects */ ],
  "oldestProcessedActivityAt": "2024-06-01T12:34:56.000Z"
}
```
- `activities`: Array of activity objects.
- `oldestProcessedActivityAt`: ISO date string of the oldest activity returned, or `null` if none.

### Error (500)
```json
{
  "error": "Internal Server Error"
}
```
Returned if an error occurs during processing.

---

# API Endpoint: GET /posts/:id

Fetches the latest activities for a specific post.

## Request

### Parameters

| Name      | Type   | In   | Description                | Required |
|-----------|--------|------|----------------------------|----------|
| id        | string | path | The ID of the post         | Yes      |
| afterDate | string | query| ISO date string; fetch activities after this date | No |
| beforeDate| string | query| ISO date string; fetch activities before this date | No |

### Headers

| Name          | Type   | Description                        | Required |
|---------------|--------|------------------------------------|----------|
| Authorization | string | Bearer token for authentication    | Yes      |

### Body

Not required.

## Response

### Success (200)
```json
{
  "activities": [ /* Array of activity objects */ ],
  "oldestProcessedActivityAt": "2024-06-01T12:34:56.000Z"
}
```
- `activities`: Array of activity objects.
- `oldestProcessedActivityAt`: ISO date string of the oldest activity returned, or `null` if none.

### Error (500)
```json
{
  "error": "Internal Server Error"
}
```
Returned if an error occurs during processing.

---

# Middleware: auth.can(permission)

Authorization middleware that checks if the current user has the specified permission.

## Parameters

| Name       | Type     | Description                                 |
|------------|----------|---------------------------------------------|
| permission | string   | The permission string to check (e.g., 'view domain') |

## Usage

Used as route middleware to protect endpoints, e.g.:
```js
router.get('/domains/:id', auth.can('view domain'), handler);
```

---

# Controller: getActivities

Fetches activities based on provided options and request parameters, enriches them with related media and user data, and sends the result in the response.

## Parameters

| Name    | Type     | Description                                 |
|---------|----------|---------------------------------------------|
| req     | Request  | Express request object                      |
| res     | Response | Express response object                     |
| options | object   | Filtering options (e.g., domain_id, community_id, etc.) |
| callback| function | Callback to be called after processing      |

## Responsibilities

- Merges options with date filters from query parameters.
- Builds a Sequelize `where` clause using utility functions and constants.
- Fetches activities from the database, including related models and images.
- Enriches activities with videos and organization user data for posts and points.
- Handles errors and sends appropriate HTTP responses.

---

# Service: models (../../models/index.cjs)

The `models` object provides access to Sequelize models and related methods.

## Methods (relevant to this file)

| Name                                      | Parameters                | Return Type | Description                                 |
|-------------------------------------------|---------------------------|-------------|---------------------------------------------|
| AcActivity.findAll                        | options                   | Promise     | Fetches activities with given options       |
| Post.getVideosForPosts                    | postIds, callback         | void        | Fetches videos for given post IDs           |
| Post.addVideosToAllActivityPosts          | activities, videos        | void        | Attaches videos to activity posts           |
| Post.setOrganizationUsersForPosts         | posts, callback           | void        | Attaches organization users to posts        |
| Point.getVideosForPoints                  | pointIds, callback        | void        | Fetches videos for given point IDs          |
| Point.addVideosToAllActivityPoints        | activities, videos        | void        | Attaches videos to activity points          |
| Point.setOrganizationUsersForPoints       | points, callback          | void        | Attaches organization users to points       |
| AcActivity.setOrganizationUsersForActivities | activities, callback    | void        | Attaches organization users to activities   |

See [models/index.cjs](../../models/index.cjs) for full model documentation.

---

# Utility Module: news_feeds_utils.cjs

Utility functions and constants for news feed activity filtering and inclusion.

## Functions & Constants Used

| Name                    | Parameters         | Return Type | Description                                 |
|-------------------------|-------------------|-------------|---------------------------------------------|
| getCommonWhereOptions   | options: object   | object      | Returns a base `where` clause for activities|
| defaultKeyActivities    | -                 | array       | List of default activity types to include   |
| activitiesDefaultIncludes | options: object | array       | List of Sequelize include options for activities |

See [news_feeds_utils.cjs](../engine/news_feeds/news_feeds_utils.cjs) for details.

---

# Utility Module: logger.cjs

Logging utility for error and event logging.

## Functions

| Name    | Parameters         | Return Type | Description                 |
|---------|--------------------|-------------|-----------------------------|
| error   | error: any         | void        | Logs an error message       |

See [logger.cjs](../utils/logger.cjs) for details.

---

# Exported Router

The module exports an Express router with the following endpoints:

- `GET /domains/:id`
- `GET /communities/:id`
- `GET /groups/:id`
- `GET /posts/:id`

Each endpoint is protected by the appropriate authorization middleware and returns a list of recent activities for the specified entity.

---

# Dependencies

- [express](https://expressjs.com/)
- [lodash](https://lodash.com/)
- [async](https://caolan.github.io/async/)
- [models](../../models/index.cjs)
- [auth](../../authorization.cjs)
- [logger](../utils/logger.cjs)
- [news_feeds_utils](../engine/news_feeds/news_feeds_utils.cjs)

---

# Example Usage

```http
GET /domains/12345?afterDate=2024-06-01T00:00:00.000Z
Authorization: Bearer <token>
```

Response:
```json
{
  "activities": [
    {
      "id": 1,
      "type": "post_created",
      "created_at": "2024-06-01T12:34:56.000Z",
      // ...other activity fields
    }
  ],
  "oldestProcessedActivityAt": "2024-06-01T12:34:56.000Z"
}
```

---

For more details on the models and utility functions, see their respective documentation files.