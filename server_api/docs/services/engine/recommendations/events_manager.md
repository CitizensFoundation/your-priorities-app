# Service Module: eventsManager

This module provides functions for interacting with the AC Analytics API, specifically for logging user actions, generating recommendation events, retrieving recommendations, and checking if an item is recommended. It integrates with external analytics services, handles error reporting (optionally via Airbrake), and logs events for auditing and debugging.

---

## Exported Functions

| Name                        | Parameters                                                                                                    | Return Type | Description                                                                                  |
|-----------------------------|---------------------------------------------------------------------------------------------------------------|-------------|----------------------------------------------------------------------------------------------|
| generateRecommendationEvent | activity: object, callback: (error: any) => void                                                              | void        | Generates and logs a recommendation event based on the provided activity object.              |
| getRecommendationFor        | req: Request, userId: string \| number, dateOptions: object, options: object, callback: Function, userLocale?: string | void        | Retrieves recommendations for a user in a specific collection (domain, community, or group).  |
| isItemRecommended           | req: Request, itemId: string \| number, userId: string \| number, dateRange: object, options: object, callback: Function | void        | Checks if a specific item is recommended for a user.                                         |
| createAction                | userAgent: string, ipAddress: string, postId: string \| number, userId: string \| number, date: string, action: string, callback: Function | void        | Logs a single user action to the analytics API.                                               |
| createManyActions           | posts: Array<object>, callback: Function                                                                      | void        | Logs multiple user actions in a single request to the analytics API.                          |

---

## Function: generateRecommendationEvent

Generates and logs a recommendation event based on the provided activity object. Determines the type of event and calls the appropriate action logging function.

### Parameters

| Name      | Type     | Description                                                                 |
|-----------|----------|-----------------------------------------------------------------------------|
| activity  | object   | The activity object describing the event (e.g., endorsement, rating, etc.). |
| callback  | Function | Callback function to be called after the event is processed.                |

### Description

- Handles various activity types such as endorsements, ratings, oppositions, new posts, points, and point quality.
- Calls `createAction` or `createEndorsementTypeAction` as appropriate.
- Logs information and warnings using the logger utility.
- If the analytics API is not configured, logs a warning and calls the callback.

---

## Function: getRecommendationFor

Retrieves recommendations for a user in a specific collection (domain, community, or group) from the analytics API.

### Parameters

| Name        | Type     | Description                                                                                   |
|-------------|----------|-----------------------------------------------------------------------------------------------|
| req         | Request  | Express request object (used for user agent and IP address extraction).                       |
| userId      | string \| number | The ID of the user for whom recommendations are requested.                      |
| dateOptions | object   | Date options for filtering recommendations (currently not used in backend).                   |
| options     | object   | Options object containing at least one of: domain_id, community_id, or group_id.              |
| callback    | Function | Callback function with signature (error, results) to handle the response.                     |
| userLocale  | string   | (Optional) User locale for localization (not currently used).                                 |

### Description

- Determines the collection type and ID based on the options provided.
- Sends a PUT request to the analytics API to retrieve recommendations.
- Passes the results or error to the callback.

---

## Function: isItemRecommended

Checks if a specific item is recommended for a user by retrieving recommendations and checking for the item's presence.

### Parameters

| Name      | Type     | Description                                                                 |
|-----------|----------|-----------------------------------------------------------------------------|
| req       | Request  | Express request object.                                                     |
| itemId    | string \| number | The ID of the item to check.                                   |
| userId    | string \| number | The ID of the user.                                            |
| dateRange | object   | Date range options for filtering recommendations.                           |
| options   | object   | Options object for collection context.                                      |
| callback  | Function | Callback function with signature (isRecommended: boolean).                  |

### Description

- Calls `getRecommendationFor` to retrieve recommended items.
- Checks if the specified itemId is included in the recommendations.
- Handles errors by logging and optionally reporting to Airbrake.

---

## Function: createAction

Logs a single user action to the analytics API.

### Parameters

| Name       | Type     | Description                                                                 |
|------------|----------|-----------------------------------------------------------------------------|
| userAgent  | string   | The user agent string of the client.                                        |
| ipAddress  | string   | The IP address of the client.                                               |
| postId     | string \| number | The ID of the post related to the action.                      |
| userId     | string \| number | The ID of the user performing the action.                      |
| date       | string   | The ISO string date of the action.                                          |
| action     | string   | The type of action (e.g., 'endorse', 'oppose', 'new-post').                |
| callback   | Function | Callback function to be called after the request completes.                 |

### Description

- Constructs a properties object with action details.
- Sends a POST request to the analytics API to log the action.
- Calls the callback with any error encountered.

---

## Function: createManyActions

Logs multiple user actions in a single request to the analytics API.

### Parameters

| Name   | Type           | Description                                              |
|--------|----------------|----------------------------------------------------------|
| posts  | Array<object>  | Array of post action objects to be logged.               |
| callback | Function     | Callback function to be called after the request.        |

### Description

- Sends a POST request to the analytics API with an array of post actions.
- Calls the callback with any error encountered.

---

## Internal Function: createEndorsementTypeAction

**Not exported.** Used internally to log endorsement, rating, or point quality actions.

### Parameters

| Name     | Type     | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| model    | Model    | Sequelize model (e.g., Endorsement, Rating, PointQuality).                  |
| activity | object   | The activity object.                                                        |
| itemId   | string \| number | The ID of the endorsement/rating/point quality item.           |
| type     | string   | The type of action (e.g., 'endorse', 'oppose', 'point-helpful').            |
| done     | Function | Callback function to be called after the action is logged.                  |

### Description

- Looks up the item in the database to retrieve user agent and IP address.
- Calls `createAction` with the retrieved information.

---

## Dependencies

- [lodash](https://lodash.com/): Utility functions for object manipulation.
- [async](https://caolan.github.io/async/): For managing asynchronous control flow.
- [request](https://github.com/request/request): For making HTTP requests to the analytics API.
- [logger](../../utils/logger.cjs): For logging info, warnings, and errors.
- [airbrake](../../utils/airbrake.cjs) (optional): For error reporting if configured.
- [models](../../../models/index.cjs): Sequelize models for database access.

---

## Environment Variables

| Name                      | Description                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| AC_ANALYTICS_BASE_URL     | Base URL for the AC Analytics API.                                          |
| AC_ANALYTICS_CLUSTER_ID   | Cluster ID for the analytics API.                                           |
| AC_ANALYTICS_KEY          | API key for authenticating requests to the analytics API.                   |
| AIRBRAKE_PROJECT_ID       | (Optional) If set, enables Airbrake error reporting.                        |

---

## Example Usage

```javascript
const eventsManager = require('./path/to/eventsManager.cjs');

// Log a new post action
eventsManager.createAction(
  'Mozilla/5.0',
  '192.168.1.1',
  123,
  456,
  new Date().toISOString(),
  'new-post',
  (err) => {
    if (err) console.error('Failed to log action:', err);
  }
);

// Generate a recommendation event
eventsManager.generateRecommendationEvent(activityObject, (err) => {
  if (err) console.error('Failed to generate event:', err);
});

// Get recommendations for a user
eventsManager.getRecommendationFor(req, 456, {}, { domain_id: 1 }, (err, recommendations) => {
  if (err) console.error('Failed to get recommendations:', err);
  else console.log('Recommendations:', recommendations);
});

// Check if an item is recommended
eventsManager.isItemRecommended(req, 123, 456, {}, { domain_id: 1 }, (isRecommended) => {
  console.log('Is item recommended?', isRecommended);
});
```

---

## See Also

- [logger Utility](../../utils/logger.md)
- [airbrake Utility](../../utils/airbrake.md)
- [Sequelize Models](../../../models/index.md)
