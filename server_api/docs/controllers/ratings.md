# API Routes: Rating Endpoints

This module defines API endpoints for creating, updating, deleting, and retrieving translations for post ratings. It uses Express.js and interacts with models such as `Rating`, `Post`, `Group`, and `AcActivity`. Authorization is enforced via middleware.

---

# API Endpoint: POST /:post_id/:type_index

Create or update a rating for a specific post and rating type by the authenticated user.

## Request

### Parameters

| Name        | Type   | In   | Description                                 | Required |
|-------------|--------|------|---------------------------------------------|----------|
| post_id     | string | path | The ID of the post to rate                  | Yes      |
| type_index  | string | path | The index/type of the rating                | Yes      |

### Headers

| Name           | Type   | Description                        | Required |
|----------------|--------|------------------------------------|----------|
| Authorization  | string | Bearer token for authentication    | Yes      |

### Body

```json
{
  "value": 1,
  "ratingBaseId": "browserId",
  "ratingValCode": "browserFingerprint",
  "ratingConf": 0.95
}
```

- `value` (`number`): The rating value to assign.
- `ratingBaseId` (`string`): Browser ID for tracking.
- `ratingValCode` (`string`): Browser fingerprint.
- `ratingConf` (`number`): Confidence score for the fingerprint.

## Response

### Success (200)

```json
{
  "rating": { /* Rating object */ },
  "post": { /* Post object with updated ratings */ }
}
```

- `rating`: The created or updated rating object.
- `post`: The post object with updated ratings in `public_data`.

### Error (4xx, 5xx)

```json
{
  "error": "description of error"
}
```

- 500: Internal server error (e.g., database or save error).

---

# API Endpoint: DELETE /:post_id/:type_index

Delete (soft-delete) the authenticated user's rating for a specific post and rating type.

## Request

### Parameters

| Name        | Type   | In   | Description                                 | Required |
|-------------|--------|------|---------------------------------------------|----------|
| post_id     | string | path | The ID of the post whose rating is deleted  | Yes      |
| type_index  | string | path | The index/type of the rating                | Yes      |

### Headers

| Name           | Type   | Description                        | Required |
|----------------|--------|------------------------------------|----------|
| Authorization  | string | Bearer token for authentication    | Yes      |

### Body

_None_

## Response

### Success (200)

_No content (empty response)_

### Error (4xx, 5xx)

```json
{
  "error": "description of error"
}
```

- 404: Rating not found.
- 500: Internal server error.

---

# API Endpoint: GET /:post_id/:custom_rating_index/translatedText

Retrieve the translated text for a custom rating name for a post, if `textType` query parameter includes `"customRatingName"`.

## Request

### Parameters

| Name                | Type   | In   | Description                                 | Required |
|---------------------|--------|------|---------------------------------------------|----------|
| post_id             | string | path | The ID of the post                          | Yes      |
| custom_rating_index | string | path | The custom rating index                     | Yes      |

### Query

| Name      | Type   | In    | Description                                 | Required |
|-----------|--------|-------|---------------------------------------------|----------|
| textType  | string | query | Must include "customRatingName"             | Yes      |

### Headers

| Name           | Type   | Description                        | Required |
|----------------|--------|------------------------------------|----------|
| Authorization  | string | Bearer token for authentication    | Yes      |

### Body

_None_

## Response

### Success (200)

```json
"Translated text string"
```

- Returns the translated text for the custom rating name.

### Error (4xx, 5xx)

```json
{
  "error": "description of error"
}
```

- 401: `textType` does not include `"customRatingName"`.
- 404: Post not found.
- 500: Internal server error.

---

# Middleware: auth.can('rate post')

Authorization middleware that checks if the authenticated user has permission to rate a post.

## Parameters

| Name | Type     | Description                    |
|------|----------|--------------------------------|
| req  | Request  | Express request object         |
| res  | Response | Express response object        |
| next | Function | Express next middleware        |

---

# Controller: Rating Controller (Anonymous Route Handlers)

Handles rating creation, update, deletion, and translation retrieval. Interacts with the following services and models:

- `models.Rating`: For finding, creating, updating, and deleting ratings.
- `models.Post`: For updating post rating aggregates.
- `models.AcActivity`: For logging activity.
- `models.AcTranslationCache`: For translation retrieval.
- `models.Group`: For group membership management.

## Parameters

| Name | Type     | Description                    |
|------|----------|--------------------------------|
| req  | Request  | Express request object         |
| res  | Response | Express response object        |

---

# Service: models (Imported from ../models/index.cjs)

Main entry point for all ORM models. Used models in this file:

## Methods/Models

| Name                  | Description                                      |
|-----------------------|--------------------------------------------------|
| Rating                | Rating model (see [Rating Model](#model-rating)) |
| Post                  | Post model (see [Post Model](#model-post))       |
| Group                 | Group model                                      |
| AcActivity            | Activity logging model/service                   |
| AcTranslationCache    | Translation cache service                        |

---

# Model: Rating

Represents a user's rating for a post.

## Properties

| Name                          | Type    | Description                                 |
|-------------------------------|---------|---------------------------------------------|
| id                            | number  | Unique identifier for the rating            |
| post_id                       | string  | ID of the rated post                        |
| type_index                    | string  | Type/index of the rating                    |
| value                         | number  | The rating value                            |
| user_id                       | string  | ID of the user who rated                    |
| data                          | object  | Browser and fingerprinting data             |
| user_agent                    | string  | User agent string                           |
| ip_address                    | string  | IP address of the rater                     |
| deleted                       | boolean | Soft-delete flag                            |
| Post                          | object  | Associated Post object                      |

---

# Model: Post

Represents a post that can be rated.

## Properties

| Name          | Type    | Description                                 |
|---------------|---------|---------------------------------------------|
| id            | string  | Unique identifier for the post              |
| group_id      | string  | ID of the group the post belongs to         |
| public_data   | object  | Public data, including ratings              |
| name          | string  | Name/title of the post                      |
| description   | string  | Description of the post                     |
| ratings       | object  | Ratings aggregate data (in public_data)     |

---

# Utility Module: logger

Logging utility for info and error messages.

## Functions

| Name   | Parameters         | Return Type | Description                 |
|--------|--------------------|-------------|-----------------------------|
| info   | message: string, meta: object | void        | Log informational messages |
| error  | message: string, meta: object | void        | Log error messages         |

---

# Utility Module: to_json

Utility for serializing objects to JSON.

## Functions

| Name   | Parameters         | Return Type | Description                 |
|--------|--------------------|-------------|-----------------------------|
| toJson | obj: any           | string      | Serialize object to JSON    |

---

# Utility Module: async

Async control flow utility (from [caolan/async](https://caolan.github.io/async/)).

---

# Utility Module: lodash (_)

General-purpose utility library.

---

# Service: queue

Imported but not used in this file.

---

# Utility Module: moment

Date/time utility (from [moment.js](https://momentjs.com/)). Imported but not used in this file.

---

# Export

This module exports the Express router with all rating-related endpoints.

---

# See Also

- [models/index.cjs](../models/index.cjs.md)
- [authorization.cjs](../authorization.cjs.md)
- [utils/logger.cjs](../utils/logger.cjs.md)
- [utils/to_json.cjs](../utils/to_json.cjs.md)
- [services/workers/queue.cjs](../services/workers/queue.cjs.md)
- [Policy Synth PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)
