# API Documentation: posts.cjs

This file defines the main Express.js router for handling operations related to "posts" in the application. It provides endpoints for creating, updating, deleting, endorsing, reporting, and retrieving posts, as well as managing related entities such as campaigns, translations, and transcripts. The router also includes several utility and helper functions for internal logic.

---

## Table of Contents

- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)
- [Controllers / Route Handlers](#controllers--route-handlers)
- [Utility Functions](#utility-functions)
- [Exported Router](#exported-router)

---

# API Endpoints

## [DELETE] /:postId/:activityId/delete_activity

Delete an activity associated with a post.

### Request

#### Parameters

| Name        | Type   | In   | Description                  | Required |
|-------------|--------|------|------------------------------|----------|
| postId      | string | path | ID of the post               | Yes      |
| activityId  | string | path | ID of the activity to delete | Yes      |

#### Headers

| Name         | Type   | Description                | Required |
|--------------|--------|----------------------------|----------|
| Authorization| string | User's auth token/session  | Yes      |

### Response

#### Success (200)

```json
{
  "activityId": 123
}
```
Returns the ID of the deleted activity.

#### Error (500)

```json
{
  "error": "Could not delete activity for post"
}
```
Internal server error.

---

## [POST] /:id/status_change_no_emails

Change the official status of a post without sending emails.

### Request

#### Parameters

| Name | Type   | In   | Description      | Required |
|------|--------|------|------------------|----------|
| id   | string | path | ID of the post   | Yes      |

#### Body

```json
{
  "official_status": 2
}
```
- `official_status`: `number` (required) - New status value.

### Response

#### Success (200)

No content.

#### Error (500)

Internal server error.

---

## [POST] /:id/status_change

Change the official status of a post and create a status change activity.

### Request

#### Parameters

| Name | Type   | In   | Description      | Required |
|------|--------|------|------------------|----------|
| id   | string | path | ID of the post   | Yes      |

#### Body

```json
{
  "official_status": 2,
  "content": "Status changed for reason X"
}
```
- `official_status`: `number` (required) - New status value.
- `content`: `string` (optional) - Reason or content for the status change.

### Response

#### Success (200)

No content.

#### Error (404, 500)

Not found or internal server error.

---

## [GET] /:id

Get a post by ID, including related entities (group, user, images, etc.).

### Request

#### Parameters

| Name | Type   | In   | Description      | Required |
|------|--------|------|------------------|----------|
| id   | string | path | ID of the post   | Yes      |

### Response

#### Success (200)

```json
{
  "id": 1,
  "name": "Post Title",
  "description": "...",
  ...
}
```
Returns the post object with related data.

#### Error (404, 500)

Not found or internal server error.

---

## [GET] /:id/translatedSurvey

Get translated survey questions and answers for a post.

### Request

#### Parameters

| Name           | Type   | In    | Description                | Required |
|----------------|--------|-------|----------------------------|----------|
| id             | string | path  | ID of the post             | Yes      |
| targetLanguage | string | query | Target language code       | Yes      |
| groupId        | string | query | Group ID                   | Yes      |

### Response

#### Success (200)

```json
[
  [ /* questions */ ],
  [ /* answers */ ]
]
```
Returns arrays of translated questions and answers.

#### Error (500)

Internal server error.

---

## [GET] /:id/translatedText

Get translated text for a post.

### Request

#### Parameters

| Name     | Type   | In    | Description                | Required |
|----------|--------|-------|----------------------------|----------|
| id       | string | path  | ID of the post             | Yes      |
| textType | string | query | Type of text to translate  | Yes      |

### Response

#### Success (200)

```json
{
  "translation": "..."
}
```
Returns the translated text.

#### Error (401, 404, 500)

Unauthorized, not found, or internal server error.

---

## [GET] /:id/:statusId/translatedStatusText

Get translated status change content for a post.

### Request

#### Parameters

| Name     | Type   | In   | Description                  | Required |
|----------|--------|------|------------------------------|----------|
| id       | string | path | ID of the post               | Yes      |
| statusId | string | path | ID of the status change      | Yes      |
| textType | string | query| Type of text to translate    | Yes      |

### Response

#### Success (200)

```json
{
  "translation": "..."
}
```
Returns the translated status change content.

#### Error (401, 404, 500)

Unauthorized, not found, or internal server error.

---

## [PUT] /:id/report

Report a post as inappropriate.

### Request

#### Parameters

| Name | Type   | In   | Description      | Required |
|------|--------|------|------------------|----------|
| id   | string | path | ID of the post   | Yes      |

### Response

#### Success (200)

No content.

#### Error (500)

Internal server error.

---

## [GET] /:id/newPoints

Get new points for a post created after a specific timestamp.

### Request

#### Parameters

| Name                | Type   | In    | Description                        | Required |
|---------------------|--------|-------|------------------------------------|----------|
| id                  | string | path  | ID of the post                     | Yes      |
| latestPointCreatedAt| string | query | ISO timestamp of the latest point  | Yes      |

### Response

#### Success (200)

```json
[ /* array of points */ ]
```
Returns an array of new points.

#### Error (500)

Internal server error.

---

## [GET] /:id/points

Get points (up and down) for a post, with optional Redis caching.

### Request

#### Parameters

| Name      | Type   | In    | Description                | Required |
|-----------|--------|-------|----------------------------|----------|
| id        | string | path  | ID of the post             | Yes      |
| offsetUp  | number | query | Offset for up points       | No       |
| offsetDown| number | query | Offset for down points     | No       |

### Response

#### Success (200)

```json
{
  "points": [ /* array of points */ ],
  "count": 42
}
```
Returns points and their count.

#### Error (500)

Internal server error.

---

## [PUT] /:id/editTranscript

Edit the transcript text of a post.

### Request

#### Parameters

| Name | Type   | In   | Description      | Required |
|------|--------|------|------------------|----------|
| id   | string | path | ID of the post   | Yes      |

#### Body

```json
{
  "content": "New transcript text"
}
```
- `content`: `string` (required) - The new transcript text.

### Response

#### Success (200)

No content.

#### Error (404, 500)

Not found or internal server error.

---

## [POST] /:groupId

Create a new post in a group.

### Request

#### Parameters

| Name    | Type   | In   | Description      | Required |
|---------|--------|------|------------------|----------|
| groupId | string | path | ID of the group  | Yes      |

#### Body

```json
{
  "name": "Post Title",
  "description": "Post description",
  "categoryId": 1,
  "location": "{\"lat\":0,\"lng\":0}",
  "coverMediaType": "image",
  // ... other fields as handled by updatePostData
}
```
- `name`: `string` (required) - Title of the post.
- `description`: `string` (optional) - Description.
- `categoryId`: `number` (optional) - Category ID.
- `location`: `string` (optional) - JSON stringified location.
- `coverMediaType`: `string` (optional) - Cover media type.
- Additional fields for post data, contact, attachments, etc.

### Response

#### Success (200)

```json
{
  "id": 1,
  "name": "Post Title",
  ...
}
```
Returns the created post object.

#### Error (500)

Internal server error.

---

## [GET] /:id/videoTranscriptStatus

Get the status of the video transcript for a post.

### Request

#### Parameters

| Name | Type   | In   | Description      | Required |
|------|--------|------|------------------|----------|
| id   | string | path | ID of the post   | Yes      |

### Response

#### Success (200)

```json
{ "text": "Transcript text" }
```
or
```json
{ "error": "Timeout" }
```
or
```json
{ "inProgress": true }
```
or
```json
{ "noInProgress": true }
```

#### Error (404, 500)

Not found or internal server error.

---

## [GET] /:id/audioTranscriptStatus

Get the status of the audio transcript for a post.

### Request

#### Parameters

| Name | Type   | In   | Description      | Required |
|------|--------|------|------------------|----------|
| id   | string | path | ID of the post   | Yes      |

### Response

#### Success (200)

```json
{ "text": "Transcript text" }
```
or
```json
{ "error": "Timeout" }
```
or
```json
{ "inProgress": true }
```
or
```json
{ "noInProgress": true }
```

#### Error (404, 500)

Not found or internal server error.

---

## [PUT] /:id

Update a post.

### Request

#### Parameters

| Name | Type   | In   | Description      | Required |
|------|--------|------|------------------|----------|
| id   | string | path | ID of the post   | Yes      |

#### Body

```json
{
  "name": "Updated Title",
  "description": "Updated description",
  "categoryId": 2,
  "location": "{\"lat\":1,\"lng\":1}",
  "coverMediaType": "video",
  // ... other fields as handled by updatePostData
}
```
- Fields as in post creation.

### Response

#### Success (200)

No content.

#### Error (404, 500)

Not found or internal server error.

---

## [PUT] /:id/:groupId/move

Move a post to another group, updating all related points and activities.

### Request

#### Parameters

| Name    | Type   | In   | Description      | Required |
|---------|--------|------|------------------|----------|
| id      | string | path | ID of the post   | Yes      |
| groupId | string | path | ID of the group  | Yes      |

### Response

#### Success (200)

No content.

#### Error (500)

Internal server error.

---

## [DELETE] /:id

Delete a post (soft delete).

### Request

#### Parameters

| Name | Type   | In   | Description      | Required |
|------|--------|------|------------------|----------|
| id   | string | path | ID of the post   | Yes      |

### Response

#### Success (200)

No content.

#### Error (500)

Internal server error.

---

## [DELETE] /:id/delete_content

Delete the content of a post (hard delete).

### Request

#### Parameters

| Name | Type   | In   | Description      | Required |
|------|--------|------|------------------|----------|
| id   | string | path | ID of the post   | Yes      |

### Response

#### Success (200)

No content.

#### Error (500)

Internal server error.

---

## [DELETE] /:id/anonymize_content

Anonymize the content of a post (assign to anonymous user).

### Request

#### Parameters

| Name | Type   | In   | Description      | Required |
|------|--------|------|------------------|----------|
| id   | string | path | ID of the post   | Yes      |

### Response

#### Success (200)

No content.

#### Error (500)

Internal server error.

---

## [POST] /:id/endorse

Endorse or oppose a post.

### Request

#### Parameters

| Name | Type   | In   | Description      | Required |
|------|--------|------|------------------|----------|
| id   | string | path | ID of the post   | Yes      |

#### Body

```json
{
  "value": 1,
  "endorsementBaseId": "...",
  "endorsementValCode": "...",
  "endorsementConf": 0.9
}
```
- `value`: `number` (required) - 1 for endorse, -1 for oppose.
- Other fields for browser fingerprinting.

### Response

#### Success (200)

```json
{
  "endorsement": { /* endorsement object */ },
  "oldEndorsementValue": 1
}
```
Returns the endorsement and previous value.

#### Error (401, 404, 500)

Unauthorized, not found, or internal server error.

---

## [DELETE] /:id/endorse

Remove an endorsement from a post.

### Request

#### Parameters

| Name | Type   | In   | Description      | Required |
|------|--------|------|------------------|----------|
| id   | string | path | ID of the post   | Yes      |

### Response

#### Success (200)

```json
{
  "endorsement": { /* endorsement object */ },
  "oldEndorsementValue": 1
}
```
Returns the endorsement and previous value.

#### Error (401, 404, 500)

Unauthorized, not found, or internal server error.

---

## [PUT] /:postId/plausibleStatsProxy

Proxy Plausible analytics stats for a post.

### Request

#### Parameters

| Name   | Type   | In   | Description      | Required |
|--------|--------|------|------------------|----------|
| postId | string | path | ID of the post   | Yes      |

#### Body

```json
{
  "plausibleUrl": "https://plausible.io/api/event"
}
```
- `plausibleUrl`: `string` (required) - Plausible API URL.

### Response

#### Success (200)

```json
{ /* plausible data */ }
```
Returns Plausible analytics data.

#### Error (500)

Internal server error.

---

## [GET] /:postId/get_campaigns

Get all active campaigns for a post.

### Request

#### Parameters

| Name   | Type   | In   | Description      | Required |
|--------|--------|------|------------------|----------|
| postId | string | path | ID of the post   | Yes      |

### Response

#### Success (200)

```json
[
  { "id": 1, "configuration": { ... } }
]
```
Returns an array of campaigns.

#### Error (500)

Internal server error.

---

## [POST] /:postId/create_campaign

Create a new campaign for a post.

### Request

#### Parameters

| Name   | Type   | In   | Description      | Required |
|--------|--------|------|------------------|----------|
| postId | string | path | ID of the post   | Yes      |

#### Body

```json
{
  "configuration": { /* campaign config */ }
}
```
- `configuration`: `object` (required) - Campaign configuration.

### Response

#### Success (200)

```json
{ "id": 1, "configuration": { ... } }
```
Returns the created campaign.

#### Error (500)

Internal server error.

---

## [PUT] /:postId/:campaignId/update_campaign

Update a campaign for a post.

### Request

#### Parameters

| Name       | Type   | In   | Description      | Required |
|------------|--------|------|------------------|----------|
| postId     | string | path | ID of the post   | Yes      |
| campaignId | string | path | ID of the campaign | Yes    |

#### Body

```json
{
  "configuration": { /* updated config */ }
}
```
- `configuration`: `object` (required) - Updated campaign configuration.

### Response

#### Success (200)

```json
{ "id": 1, "configuration": { ... } }
```
Returns the updated campaign.

#### Error (500)

Internal server error.

---

## [DELETE] /:postId/:campaignId/delete_campaign

Delete a campaign for a post.

### Request

#### Parameters

| Name       | Type   | In   | Description      | Required |
|------------|--------|------|------------------|----------|
| postId     | string | path | ID of the post   | Yes      |
| campaignId | string | path | ID of the campaign | Yes    |

### Response

#### Success (200)

No content.

#### Error (500)

Internal server error.

---

# Middleware

## auth.can(permission)

Authorization middleware to check if the user has the required permission for the route.

### Parameters

| Name       | Type     | Description                        |
|------------|----------|------------------------------------|
| permission | string   | Permission string (e.g., "edit post") |

---

# Controllers / Route Handlers

Each route handler is defined inline in the router. See [API Endpoints](#api-endpoints) for details.

---

# Utility Functions

## changePostCounter

Change a post's endorsement counter (up or down).

### Parameters

| Name    | Type     | Description                                 |
|---------|----------|---------------------------------------------|
| req     | Request  | Express request object                      |
| postId  | string   | ID of the post                              |
| column  | string   | Counter column name ("counter_endorsements_up" or "counter_endorsements_down") |
| upDown  | number   | 1 to increment, -1 to decrement             |
| next    | Function | Callback to call after operation            |

---

## addAgentFabricUserToSessionIfNeeded

Adds an agent fabric user to the session if needed, based on API key and query params.

### Parameters

| Name | Type     | Description                |
|------|----------|----------------------------|
| req  | Request  | Express request object     |

---

## decrementOldCountersIfNeeded

Decrements old endorsement counters if the endorsement value has changed.

### Parameters

| Name                | Type     | Description                |
|---------------------|----------|----------------------------|
| req                 | Request  | Express request object     |
| oldEndorsementValue | number   | Previous endorsement value |
| postId              | string   | ID of the post             |
| endorsement         | object   | Endorsement object         |
| next                | Function | Callback                   |

---

## sendPostOrError

Send a post object or an error response.

### Parameters

| Name        | Type     | Description                |
|-------------|----------|----------------------------|
| res         | Response | Express response object    |
| post        | object   | Post object or ID          |
| context     | string   | Context string for logging |
| user        | object   | User object                |
| error       | any      | Error object or message    |
| errorStatus | number   | HTTP status code           |

---

## truthValueFromBody

Converts a body parameter to a boolean.

### Parameters

| Name         | Type   | Description                |
|--------------|--------|----------------------------|
| bodyParameter| any    | Value from request body    |

### Returns

- `boolean`

---

## updatePostData

Updates the post's data and public_data fields from the request body.

### Parameters

| Name | Type     | Description                |
|------|----------|----------------------------|
| req  | Request  | Express request object     |
| post | object   | Post model instance        |

---

## sendPostPoints

Helper to send up/down points for a post, with optional Redis caching.

### Parameters

| Name     | Type     | Description                |
|----------|----------|----------------------------|
| req      | Request  | Express request object     |
| res      | Response | Express response object    |
| redisKey | string   | Redis cache key (optional) |

---

## shouldDisablePointRedisCache

Checks if Redis cache for points should be disabled for the user.

### Parameters

| Name | Type     | Description                |
|------|----------|----------------------------|
| req  | Request  | Express request object     |
| done | Function | Callback (error, boolean)  |

---

# Exported Router

The module exports the configured Express router for use in the main application.

```js
module.exports = router;
```

---

# See Also

- [models/index.cjs](./models/index.md)
- [authorization.cjs](./authorization.md)
- [utils/logger.cjs](./utils/logger.md)
- [utils/to_json.cjs](./utils/to_json.md)
- [services/workers/queue.cjs](./services/workers/queue.md)
- [services/utils/get_anonymous_system_user.cjs](./services/utils/get_anonymous_system_user.md)
- [services/engine/analytics/plausible/manager.cjs](./services/engine/analytics/plausible/manager.md)
- [utils/is_valid_db_id.cjs](./utils/is_valid_db_id.md)

---

**Note:** For detailed model schemas and additional service logic, refer to the respective files in the codebase.