# API Documentation: `routes/points.cjs`

This file defines the main Express.js router for handling "Point" resources, including creation, editing, reporting, commenting, voting (quality), transcript status, and Open Graph URL preview. It also contains several utility functions for internal logic.

---

## Table of Contents

- [API Endpoints](#api-endpoints)
- [Internal Utility Functions](#internal-utility-functions)
- [Exported Router](#exported-router)

---

# API Endpoints

---

## API Endpoint: `PUT /:id/report`

Report a point as inappropriate or problematic.

### Request

#### Parameters

| Name | Type   | In   | Description         | Required |
|------|--------|------|---------------------|----------|
| id   | string | path | ID of the point     | Yes      |

#### Headers

| Name          | Type   | Description         | Required |
|---------------|--------|---------------------|----------|
| Authorization | string | User auth token     | Yes      |

#### Body

_No body required._

### Response

#### Success (200)

```json
{}
```
Point was successfully reported.

#### Error (404, 500)

```json
{}
```
- 404: Point not found.
- 500: Internal error.

---

## API Endpoint: `GET /:parentPointId/comments`

Get all comments for a parent point.

### Request

#### Parameters

| Name           | Type   | In   | Description                | Required |
|----------------|--------|------|----------------------------|----------|
| parentPointId  | string | path | ID of the parent point     | Yes      |

#### Headers

| Name          | Type   | Description         | Required |
|---------------|--------|---------------------|----------|
| Authorization | string | User auth token     | Yes      |

#### Body

_No body required._

### Response

#### Success (200)

```json
[
  {
    // Point object with PointRevisions and User info
  }
]
```
Array of comment points.

#### Error (500)

```json
{}
```
Internal error.

---

## API Endpoint: `GET /:parentPointId/commentsCount`

Get the count of comments for a parent point.

### Request

#### Parameters

| Name           | Type   | In   | Description                | Required |
|----------------|--------|------|----------------------------|----------|
| parentPointId  | string | path | ID of the parent point     | Yes      |

#### Headers

| Name          | Type   | Description         | Required |
|---------------|--------|---------------------|----------|
| Authorization | string | User auth token     | Yes      |

#### Body

_No body required._

### Response

#### Success (200)

```json
{ "count": 3 }
```
Number of comments.

#### Error (500)

```json
{}
```
Internal error.

---

## API Endpoint: `POST /:parentPointId/comment`

Add a comment to a parent point.

### Request

#### Parameters

| Name           | Type   | In   | Description                | Required |
|----------------|--------|------|----------------------------|----------|
| parentPointId  | string | path | ID of the parent point     | Yes      |

#### Headers

| Name          | Type   | Description         | Required |
|---------------|--------|---------------------|----------|
| Authorization | string | User auth token     | Yes      |

#### Body

```json
{
  "comment": "string"
}
```
- `comment`: The comment text (string, required).

### Response

#### Success (200)

```json
{}
```
Comment created.

#### Error (500)

```json
{}
```
Internal error.

---

## API Endpoint: `PUT /:pointId`

Edit a point (if not too many quality votes).

### Request

#### Parameters

| Name     | Type   | In   | Description         | Required |
|----------|--------|------|---------------------|----------|
| pointId  | string | path | ID of the point     | Yes      |

#### Headers

| Name          | Type   | Description         | Required |
|---------------|--------|---------------------|----------|
| Authorization | string | User auth token     | Yes      |

#### Body

```json
{
  "content": "string"
}
```
- `content`: New content for the point (string, optional).

### Response

#### Success (200)

```json
{
  // Full loaded point object
}
```
Updated point.

#### Error (401, 500)

```json
{}
```
- 401: Too many quality votes to edit.
- 500: Internal error.

---

## API Endpoint: `GET /:id/translatedText`

Get the translated text for a point.

### Request

#### Parameters

| Name | Type   | In   | Description         | Required |
|------|--------|------|---------------------|----------|
| id   | string | path | ID of the point     | Yes      |

#### Query

| Name     | Type   | Description                | Required |
|----------|--------|----------------------------|----------|
| textType | string | Should include "point"     | Yes      |

#### Headers

| Name          | Type   | Description         | Required |
|---------------|--------|---------------------|----------|
| Authorization | string | User auth token     | Yes      |

### Response

#### Success (200)

```json
{
  // Translation object
}
```
Translated text.

#### Error (401, 404, 500)

```json
{}
```
- 401: Wrong textType.
- 404: Point not found.
- 500: Internal error.

---

## API Endpoint: `GET /:id/videoTranscriptStatus`

Get the status of the video transcript for a point.

### Request

#### Parameters

| Name | Type   | In   | Description         | Required |
|------|--------|------|---------------------|----------|
| id   | string | path | ID of the point     | Yes      |

#### Headers

| Name          | Type   | Description         | Required |
|---------------|--------|---------------------|----------|
| Authorization | string | User auth token     | Yes      |

### Response

#### Success (200)

```json
{
  "point": { /* loaded point object */ }
}
```
Transcript is available and point updated.

```json
{ "inProgress": true }
```
Transcript is being processed.

```json
{ "error": "error message" }
```
Transcript error.

#### Error (500)

```json
{}
```
Internal error.

---

## API Endpoint: `GET /:id/audioTranscriptStatus`

Get the status of the audio transcript for a point.

### Request

#### Parameters

| Name | Type   | In   | Description         | Required |
|------|--------|------|---------------------|----------|
| id   | string | path | ID of the point     | Yes      |

#### Headers

| Name          | Type   | Description         | Required |
|---------------|--------|---------------------|----------|
| Authorization | string | User auth token     | Yes      |

### Response

#### Success (200)

```json
{
  "point": { /* loaded point object */ }
}
```
Transcript is available and point updated.

```json
{ "inProgress": true }
```
Transcript is being processed.

```json
{ "error": "error message" }
```
Transcript error.

#### Error (500)

```json
{}
```
Internal error.

---

## API Endpoint: `POST /:groupId`

Create a new point in a group.

### Request

#### Parameters

| Name     | Type   | In   | Description         | Required |
|----------|--------|------|---------------------|----------|
| groupId  | string | path | ID of the group     | Yes      |

#### Headers

| Name          | Type   | Description         | Required |
|---------------|--------|---------------------|----------|
| Authorization | string | User auth token     | Yes      |

#### Body

```json
{
  "postId": "string",
  "content": "string",
  "value": number,
  "pointBaseId": "string",
  "pointValCode": "string",
  "pointConf": number,
  "originalQueryString": "string",
  "userLocale": "string",
  "userAutoTranslate": boolean,
  "referrer": "string",
  "url": "string",
  "screen_width": number,
  "videoId": "string",
  "audioId": "string",
  "appLanguage": "string"
}
```
- `postId`: ID of the post (string, required)
- `content`: Content of the point (string, optional)
- `value`: Value of the point (number, optional)
- `pointBaseId`, `pointValCode`, `pointConf`, etc.: Metadata for tracking and analytics.
- `videoId`, `audioId`: If present, attach video/audio to point.

### Response

#### Success (200)

```json
{
  // Full loaded point object
}
```
Created point.

#### Error (500)

```json
{}
```
Internal error.

---

## API Endpoint: `DELETE /:id`

Delete a point (soft delete).

### Request

#### Parameters

| Name | Type   | In   | Description         | Required |
|------|--------|------|---------------------|----------|
| id   | string | path | ID of the point     | Yes      |

#### Headers

| Name          | Type   | Description         | Required |
|---------------|--------|---------------------|----------|
| Authorization | string | User auth token     | Yes      |

### Response

#### Success (200)

```json
{}
```
Point deleted.

#### Error (500)

```json
{}
```
Internal error.

---

## API Endpoint: `POST /:id/pointQuality`

Vote on the quality of a point (helpful/unhelpful).

### Request

#### Parameters

| Name | Type   | In   | Description         | Required |
|------|--------|------|---------------------|----------|
| id   | string | path | ID of the point     | Yes      |

#### Headers

| Name          | Type   | Description         | Required |
|---------------|--------|---------------------|----------|
| Authorization | string | User auth token     | Yes      |

#### Body

```json
{
  "value": number,
  "qualityBaseId": "string",
  "qualityValCode": "string",
  "qualityConf": number
}
```
- `value`: 1 (helpful), -1 (unhelpful), or 0 (neutral).
- `qualityBaseId`, `qualityValCode`, `qualityConf`: Metadata for tracking.

### Response

#### Success (200)

```json
{
  "pointQuality": { /* PointQuality object */ },
  "oldPointQualityValue": 1
}
```
Quality vote created or updated.

#### Error (500)

```json
{}
```
Internal error.

---

## API Endpoint: `DELETE /:id/pointQuality`

Remove a user's quality vote from a point.

### Request

#### Parameters

| Name | Type   | In   | Description         | Required |
|------|--------|------|---------------------|----------|
| id   | string | path | ID of the point     | Yes      |

#### Headers

| Name          | Type   | Description         | Required |
|---------------|--------|---------------------|----------|
| Authorization | string | User auth token     | Yes      |

### Response

#### Success (200)

```json
{
  "pointQuality": { /* PointQuality object */ },
  "oldPointQualityValue": 1
}
```
Vote removed.

#### Error (404)

```json
{}
```
Vote not found.

---

## API Endpoint: `GET /url_preview`

Get Open Graph preview data for a URL.

### Request

#### Query

| Name | Type   | Description         | Required |
|------|--------|---------------------|----------|
| url  | string | URL to preview      | Yes      |

#### Headers

| Name          | Type   | Description         | Required |
|---------------|--------|---------------------|----------|
| Authorization | string | User auth token     | Yes      |

### Response

#### Success (200)

```json
[
  {
    "url": "string",
    "type": "string",
    "title": "string",
    "version": "1.0",
    "description": "string",
    "provider_url": "string",
    "request_url": "string",
    "provider_name": "string",
    "thumbnail_url": "string",
    "thumbnail_width": "string",
    "thumbnail_height": "string"
  }
]
```
Open Graph preview data.

#### Error (404, 500)

```json
[{}]
```
- 404: URL not found or invalid.
- 500: Open Graph fetch failed.

---

# Internal Utility Functions

---

## Function: `changePointCounter(pointId, column, upDown, next)`

Increment or decrement a counter column on a Point.

### Parameters

| Name    | Type     | Description                                 |
|---------|----------|---------------------------------------------|
| pointId | string   | ID of the point                             |
| column  | string   | Column to increment/decrement               |
| upDown  | number   | 1 for increment, -1 for decrement           |
| next    | function | Callback to invoke after operation          |

---

## Function: `decrementOldPointQualityCountersIfNeeded(oldPointQualityValue, pointId, pointQuality, next)`

Decrement the appropriate quality counter if the old value was positive or negative.

### Parameters

| Name                | Type     | Description                                 |
|---------------------|----------|---------------------------------------------|
| oldPointQualityValue| number   | Previous value (1, -1, or 0)                |
| pointId             | string   | ID of the point                             |
| pointQuality        | object   | PointQuality instance                       |
| next                | function | Callback to invoke after operation          |

---

## Function: `sendPointOrError(res, point, context, user, error, errorStatus)`

Send a point or an error response, with logging.

### Parameters

| Name        | Type     | Description                                 |
|-------------|----------|---------------------------------------------|
| res         | Response | Express response object                     |
| point       | object   | Point object (may be null)                  |
| context     | string   | Context string for logging                  |
| user        | object   | User object                                 |
| error       | any      | Error object or message                     |
| errorStatus | number   | HTTP status code for error                  |

---

## Function: `validateEmbedUrl(urlIn)`

Validate if a string is a valid URL for embedding.

### Parameters

| Name  | Type   | Description         |
|-------|--------|---------------------|
| urlIn | string | URL to validate     |

### Returns

- `boolean`: True if valid, false otherwise.

---

## Function: `loadPointWithAll(pointId, callback)`

Load a point with all related data (revisions, user, videos, audios, etc.).

### Parameters

| Name     | Type     | Description                                 |
|----------|----------|---------------------------------------------|
| pointId  | string   | ID of the point                             |
| callback | function | Callback with (error, loadedPoint)          |

---

## Function: `translateToObsFormat(json)`

Convert Open Graph data to oEmbed/OBS format.

### Parameters

| Name | Type   | Description         |
|------|--------|---------------------|
| json | object | Open Graph result   |

### Returns

- `Array<object>`: Array with one formatted object.

---

# Exported Router

This file exports an Express router with all the above endpoints.

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

---

**Note:** This file relies on several models and utility modules. For details on the data models (e.g., `Point`, `PointRevision`, `PointQuality`, `User`, etc.), see the [models documentation](./models/index.md). For authorization middleware, see [authorization.cjs](./authorization.md).