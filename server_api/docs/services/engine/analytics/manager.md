# Service Module: similaritiesService

This module provides a set of service functions for updating and synchronizing various collection types (Domain, Community, Group, Post, Point) with an external analytics/similarities engine. It also provides utility functions for interacting with the analytics API, triggering training, parsing results, and converting DOCX surveys to JSON.

---

## Methods

| Name                              | Parameters                                                                                                   | Return Type | Description                                                                                      |
|------------------------------------|--------------------------------------------------------------------------------------------------------------|-------------|--------------------------------------------------------------------------------------------------|
| updateCollection                   | workPackage: object, done: function                                                                          | void        | Updates a collection (domain, community, group, post, or point) in the similarities engine.      |
| getFromAnalyticsApi                | req: Request, featureType: string, collectionType: string, collectionId: string\|number, done: function      | void        | Fetches analytics data for a collection, using Redis for caching.                                |
| triggerSimilaritiesTraining        | req: Request, collectionType: string, collectionId: string\|number, done: function                           | void        | Triggers the similarities engine to retrain on a specific collection.                            |
| sendBackAnalyticsResultsOrError    | req: Request, res: Response, error: any, results: any                                                        | void        | Sends analytics results or an error response to the client.                                      |
| getParsedSimilaritiesContent       | content: any                                                                                                 | any         | Parses and returns the JSON body from analytics API content.                                     |
| convertDocxSurveyToJson            | formData: object, done: function                                                                             | void        | Converts a DOCX survey to JSON using the analytics API.                                          |

---

## Function: updateCollection

Updates a collection (domain, community, group, post, or point) in the similarities engine, based on the provided workPackage. Determines the type of collection and calls the appropriate update function.

### Parameters

| Name        | Type   | Description                                                                 |
|-------------|--------|-----------------------------------------------------------------------------|
| workPackage | object | Object containing one of: domainId, communityId, groupId, postId, pointId.  |
| done        | function | Callback function (error?: any)                                            |

### Description

- Checks for required analytics environment variables.
- Determines which collection type to update based on the presence of IDs in `workPackage`.
- Calls the corresponding update function (`updateDomain`, `updateCommunity`, etc.).
- If environment variables are missing, logs a warning and calls `done()`.

---

## Function: getFromAnalyticsApi

Fetches analytics data for a given collection from the analytics API, using Redis for caching.

### Parameters

| Name          | Type     | Description                                                                                 |
|---------------|----------|---------------------------------------------------------------------------------------------|
| req           | Request  | Express request object, must have `redisClient` property.                                   |
| featureType   | string   | The analytics feature type (e.g., "similarities").                                          |
| collectionType| string   | The type of collection (e.g., "group", "post").                                             |
| collectionId  | string\|number | The ID of the collection.                                                             |
| done          | function | Callback function (error: any, content: any)                                                |

### Description

- Attempts to retrieve analytics data from Redis cache.
- If not cached, makes a GET request to the analytics API.
- Stores the result in Redis with a TTL (default 15 minutes, configurable via `SIMILARITIES_CACHE_TTL`).
- Calls `done` with the result or error.

---

## Function: triggerSimilaritiesTraining

Triggers the similarities engine to retrain on a specific collection.

### Parameters

| Name          | Type     | Description                                                                                 |
|---------------|----------|---------------------------------------------------------------------------------------------|
| req           | Request  | Express request object.                                                                     |
| collectionType| string   | The type of collection (e.g., "group", "post").                                             |
| collectionId  | string\|number | The ID of the collection.                                                             |
| done          | function | Callback function (error: any, content: any)                                                |

### Description

- Sends a PUT request to the analytics API endpoint to trigger training.
- Calls `done` with the result or error.

---

## Function: sendBackAnalyticsResultsOrError

Sends analytics results or an error response to the client.

### Parameters

| Name    | Type     | Description                                                                                      |
|---------|----------|--------------------------------------------------------------------------------------------------|
| req     | Request  | Express request object.                                                                          |
| res     | Response | Express response object.                                                                         |
| error   | any      | Error object or status code.                                                                     |
| results | any      | Analytics results to send if no error.                                                           |

### Description

- If `error` is present, logs the error and sends `{ nodata: true }`.
- Otherwise, sends the analytics results.

---

## Function: getParsedSimilaritiesContent

Parses and returns the JSON body from analytics API content.

### Parameters

| Name    | Type | Description                                  |
|---------|------|----------------------------------------------|
| content | any  | The content object returned from the API.    |

### Returns

- `any`: The parsed JSON object from `content.body`, or `undefined` if parsing fails.

### Description

- Attempts to parse `content.body` as JSON.
- Logs an error if parsing fails.

---

## Function: convertDocxSurveyToJson

Converts a DOCX survey to JSON using the analytics API.

### Parameters

| Name     | Type   | Description                                 |
|----------|--------|---------------------------------------------|
| formData | object | Form data containing the DOCX file.         |
| done     | function | Callback function (error: any, content: any) |

### Description

- Sends a PUT request to the analytics API endpoint for DOCX survey conversion.
- Calls `done` with the result or error.

---

# Dependencies

- [models](../../../models/index.cjs): Sequelize models for Domain, Community, Group, Post, Point, etc.
- [log](../../../utils/logger.cjs): Logger utility.
- [importDomain, importCommunity, importGroup, importPost, importPoint](./utils.cjs): Import functions for each collection type.
- [request](https://www.npmjs.com/package/request): HTTP client for making API requests.

---

# Exported Functions

This module exports the following functions:

- `updateCollection`
- `getFromAnalyticsApi`
- `triggerSimilaritiesTraining`
- `sendBackAnalyticsResultsOrError`
- `getParsedSimilaritiesContent`
- `convertDocxSurveyToJson`

---

# Example Usage

```javascript
const similaritiesService = require('./similaritiesService.cjs');

// Update a group in the similarities engine
similaritiesService.updateCollection({ groupId: 123 }, (err) => {
  if (err) {
    console.error('Update failed:', err);
  } else {
    console.log('Update successful');
  }
});

// Fetch analytics data for a post
similaritiesService.getFromAnalyticsApi(req, 'similarities', 'post', 456, (err, data) => {
  if (err) {
    res.status(500).send({ error: 'Failed to fetch analytics' });
  } else {
    res.send(data);
  }
});
```

---

# Environment Variables

- `AC_ANALYTICS_KEY`: API key for the analytics engine (required).
- `AC_ANALYTICS_CLUSTER_ID`: Cluster ID for the analytics engine (required).
- `AC_ANALYTICS_BASE_URL`: Base URL for the analytics engine (required).
- `SIMILARITIES_CACHE_TTL`: (optional) Cache TTL in seconds for analytics results (default: 900).

---

# See Also

- [importDomain, importCommunity, importGroup, importPost, importPoint](./utils.md)
- [models](../../../models/index.md)
- [logger](../../../utils/logger.md)
