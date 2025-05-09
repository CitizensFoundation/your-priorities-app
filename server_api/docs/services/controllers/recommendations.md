# API Router: recommendations.cjs

This module defines Express.js routes for fetching post recommendations based on domains, communities, and groups. It leverages a recommendation engine, handles error logging (with Airbrake integration if configured), and supports Redis caching for group recommendations. The endpoints return recommended posts with varying levels of detail.

---

## API Endpoints

---

### API Endpoint: GET /recommendations/domains/:id

Fetches recommended posts for a specific domain.

#### Request

##### Parameters

| Name | Type   | In   | Description                | Required |
|------|--------|------|----------------------------|----------|
| id   | string | path | Domain ID to get recommendations for | Yes      |

##### Headers

| Name          | Type   | Description                | Required |
|---------------|--------|----------------------------|----------|
| Authorization | string | Bearer token (if required) | Yes/No   |

##### Body

_No body required._

#### Response

##### Success (200)
```json
[
  {
    "id": 123,
    "name": "Post title",
    "description": "Post description",
    "public_data": {},
    "status": "active",
    "content_type": "text",
    "official_status": "official",
    "counter_endorsements_up": 10,
    "cover_media_type": "image",
    "counter_endorsements_down": 2,
    "group_id": 1,
    "language": "en",
    "counter_points": 5,
    "counter_flags": 0,
    "location": "Location",
    "created_at": "2023-01-01T00:00:00.000Z",
    // ... includes related models (Category, Group, Video, User, Image, PostRevision)
  }
]
```
Returns an array of recommended post objects with detailed information and related models.

##### Error (500)
```json
[]
```
Returns an empty array if an error occurs.

---

### API Endpoint: GET /recommendations/communities/:id

Fetches recommended posts for a specific community.

#### Request

##### Parameters

| Name | Type   | In   | Description                   | Required |
|------|--------|------|-------------------------------|----------|
| id   | string | path | Community ID to get recommendations for | Yes      |

##### Headers

| Name          | Type   | Description                | Required |
|---------------|--------|----------------------------|----------|
| Authorization | string | Bearer token (if required) | Yes/No   |

##### Body

_No body required._

#### Response

##### Success (200)
```json
[
  {
    "id": 123,
    "name": "Post title",
    "description": "Post description",
    // ... as above
  }
]
```
Returns an array of recommended post objects.

##### Error (500)
```json
[]
```
Returns an empty array if an error occurs.

---

### API Endpoint: GET /recommendations/groups/:id

Fetches recommended posts for a specific group.

#### Request

##### Parameters

| Name | Type   | In   | Description                | Required |
|------|--------|------|----------------------------|----------|
| id   | string | path | Group ID to get recommendations for | Yes      |

##### Headers

| Name          | Type   | Description                | Required |
|---------------|--------|----------------------------|----------|
| Authorization | string | Bearer token (if required) | Yes/No   |

##### Body

_No body required._

#### Response

##### Success (200)
```json
[
  {
    "id": 123,
    "name": "Post title",
    "description": "Post description",
    // ... as above
  }
]
```
Returns an array of recommended post objects.

##### Error (500)
```json
[]
```
Returns an empty array if an error occurs.

---

### API Endpoint: PUT /recommendations/groups/:id/getPostRecommendations

Fetches (and caches) lightweight post recommendations for a group. Uses Redis for caching.

#### Request

##### Parameters

| Name | Type   | In   | Description                | Required |
|------|--------|------|----------------------------|----------|
| id   | string | path | Group ID to get recommendations for | Yes      |

##### Headers

| Name          | Type   | Description                | Required |
|---------------|--------|----------------------------|----------|
| Authorization | string | Bearer token (if required) | Yes/No   |

##### Body

_No body required._

#### Response

##### Success (200)
```json
{
  "recommendations": [
    {
      "id": 123,
      "name": "Post title",
      "description": "Post description"
    }
  ],
  "groupId": "1"
}
```
Returns an object with a lightweight array of recommended posts and the group ID.

##### Error (500)
```json
{
  "recommendations": [],
  "groupId": "1"
}
```
Returns an empty recommendations array and the group ID if an error occurs.

---

## Middleware

### Middleware: auth.can(permission)

Authorization middleware that checks if the user has the required permission to access the endpoint.

#### Parameters

| Name       | Type     | Description                        |
|------------|----------|------------------------------------|
| permission | string   | The permission string to check     |

---

## Controller/Handler Functions

### Function: setupOptions(req)

Builds the base options object for recommendation queries.

#### Parameters

| Name | Type   | Description                |
|------|--------|----------------------------|
| req  | Request| Express request object     |

#### Returns

| Type   | Description                |
|--------|----------------------------|
| object | Options object with user_id|

---

### Function: processRecommendations(levelType, req, res, recommendedItemIds, error)

Handles the response for detailed recommendations, including error logging and Airbrake notification.

#### Parameters

| Name              | Type     | Description                                  |
|-------------------|----------|----------------------------------------------|
| levelType         | string   | The type of recommendation (domain, group, etc.) |
| req               | Request  | Express request object                       |
| res               | Response | Express response object                      |
| recommendedItemIds| array    | Array of recommended post IDs                |
| error             | any      | Error object, if any                         |

---

### Function: processRecommendationsLight(groupId, req, res, recommendedItemIds, error, redisCacheKey)

Handles the response for lightweight recommendations, including error logging, Airbrake notification, and Redis caching.

#### Parameters

| Name              | Type     | Description                                  |
|-------------------|----------|----------------------------------------------|
| groupId           | string   | Group ID                                     |
| req               | Request  | Express request object                       |
| res               | Response | Express response object                      |
| recommendedItemIds| array    | Array of recommended post IDs                |
| error             | any      | Error object, if any                         |
| redisCacheKey     | string   | Redis cache key for storing recommendations  |

---

## Services

### Service: getRecommendationFor

Imported from `../engine/recommendations/events_manager.cjs`. This function is responsible for generating recommended post IDs for a user, given various options and filters.

#### Parameters

| Name         | Type     | Description                                  |
|--------------|----------|----------------------------------------------|
| req          | Request  | Express request object                       |
| userId       | number   | User ID                                      |
| dateOptions  | object   | Date filter options                          |
| options      | object   | Additional options for recommendation        |
| callback     | function | Callback function (error, recommendedItemIds)|
| locale       | string   | User locale (optional)                       |

---

## Configuration

### Constants

| Name           | Type   | Description                                      |
|----------------|--------|--------------------------------------------------|
| OVERALL_LIMIT  | number | Maximum number of recommendations to return (7)  |
| DATE_OPTIONS   | object | Default date filter for recommendations          |

---

## Utilities

### Utility: logger

Imported as `log` from `../utils/logger.cjs`. Used for logging errors and info throughout the module.

### Utility: airbrake

Optional error reporting utility, loaded if `AIRBRAKE_PROJECT_ID` is set in the environment. Used for reporting errors to Airbrake.

---

## Dependencies

- [models](../../models/index.cjs): Sequelize models for Post, Group, Category, etc.
- [auth](../../authorization.cjs): Authorization middleware.
- [logger](../utils/logger.cjs): Logging utility.
- [lodash](https://lodash.com/): Utility library.
- [moment](https://momentjs.com/): Date/time utility.
- [getRecommendationFor](../engine/recommendations/events_manager.cjs): Recommendation engine.
- [airbrake](../utils/airbrake.cjs): Error reporting (optional).

---

## Export

This module exports the configured Express router.

```js
module.exports = router;
```

---

## See Also

- [models/index.cjs](../../models/index.cjs)
- [authorization.cjs](../../authorization.cjs)
- [logger.cjs](../utils/logger.cjs)
- [engine/recommendations/events_manager.cjs](../engine/recommendations/events_manager.cjs)
- [airbrake.cjs](../utils/airbrake.cjs)
