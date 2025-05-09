# API Router: Notifications

This module defines the API endpoints for user notifications, including fetching notifications, marking all as viewed, and marking specific notifications as viewed. It uses authentication middleware to ensure only logged-in users can access these endpoints.

---

# API Endpoint: [GET] /notifications/

Fetches the latest notifications for the authenticated user, with optional date filtering.

## Request

### Parameters

| Name        | Type   | In    | Description                                 | Required |
|-------------|--------|-------|---------------------------------------------|----------|
| afterDate   | string | query | ISO date string. Only notifications after this date are returned. | No       |
| beforeDate  | string | query | ISO date string. Only notifications before this date are returned. | No       |

### Headers

| Name          | Type   | Description                        | Required |
|---------------|--------|------------------------------------|----------|
| Authorization | string | Bearer token for authentication.   | Yes      |

### Body

Not required.

## Response

### Success (200)
```json
{
  "notifications": [
    {
      "id": 123,
      "type": "string",
      "created_at": "2024-06-01T12:00:00.000Z",
      "updated_at": "2024-06-01T12:00:00.000Z",
      "viewed": false,
      "AcActivities": [
        {
          "id": 456,
          "type": "string",
          "Post": {
            "id": 789,
            "name": "string",
            "user_id": 1
          },
          "User": {
            "id": 1,
            "name": "string",
            "facebook_id": "string",
            "twitter_id": "string",
            "google_id": "string",
            "github_id": "string",
            "UserProfileImages": [
              {
                "id": 1,
                "formats": {}
              }
            ]
          },
          "Community": {
            "id": 1,
            "name": "string"
          },
          "Group": {
            "id": 1,
            "name": "string"
          },
          "Point": {
            "id": 1,
            "value": 10,
            "content": "string"
          }
        }
      ]
    }
  ],
  "unViewedCount": 3,
  "oldestProcessedNotificationAt": "2024-05-01T12:00:00.000Z"
}
```
- `notifications`: Array of notification objects with related activities and entities.
- `unViewedCount`: Number of notifications not yet viewed by the user.
- `oldestProcessedNotificationAt`: Timestamp of the oldest notification in the result set.

### Error (500)
```json
{
  "error": "Internal server error"
}
```
- Returned if there is a server-side error fetching notifications.

---

# API Endpoint: [PUT] /notifications/markAllViewed

Marks all notifications for the authenticated user as viewed.

## Request

### Headers

| Name          | Type   | Description                        | Required |
|---------------|--------|------------------------------------|----------|
| Authorization | string | Bearer token for authentication.   | Yes      |

### Body

Not required.

## Response

### Success (200)
No content. Returns HTTP 200 on success.

### Error (500)
No content. Returns HTTP 500 on error.

---

# API Endpoint: [PUT] /notifications/setIdsViewed

Marks specific notifications as viewed for the authenticated user.

## Request

### Headers

| Name          | Type   | Description                        | Required |
|---------------|--------|------------------------------------|----------|
| Authorization | string | Bearer token for authentication.   | Yes      |

### Body
```json
{
  "viewedIds": [1, 2, 3]
}
```
- `viewedIds`: Array of notification IDs to mark as viewed.

## Response

### Success (200)
```json
{
  "viewedIds": [1, 2, 3],
  "unViewedCount": 5
}
```
- `viewedIds`: The IDs that were marked as viewed.
- `unViewedCount`: The number of notifications still unviewed after the update.

### Error (500)
No content. Returns HTTP 500 on error.

---

# Middleware: auth.isLoggedInNoAnonymousCheck

Ensures the user is authenticated and not anonymous before allowing access to the route.

## Parameters

| Name | Type     | Description                    |
|------|----------|--------------------------------|
| req  | Request  | Express request object         |
| res  | Response | Express response object        |
| next | Function | Express next middleware function |

---

# Controller: getNotifications

Fetches notifications for the authenticated user, with optional date filtering and includes related activity data.

## Parameters

| Name    | Type     | Description                                      |
|---------|----------|--------------------------------------------------|
| req     | Request  | Express request object (must have `user` property) |
| options | object   | Additional options for filtering (merged internally) |
| callback| Function | Callback function `(error, result)`               |

- Merges date filters from query parameters.
- Fetches notification IDs, then fetches full notification objects with related activities and entities.
- Counts unviewed notifications.
- Calls `models.AcActivity.setOrganizationUsersForActivities` to enrich activity data.
- Returns notifications, unviewed count, and oldest notification date.

---

# Service: models.AcNotification

Represents the notification model in the database.

## Methods Used

| Name      | Parameters         | Return Type | Description                                 |
|-----------|--------------------|-------------|---------------------------------------------|
| findAll   | options: object    | Promise     | Finds all notifications matching criteria.  |
| update    | values: object, options: object | Promise | Updates notifications matching criteria.    |
| count     | options: object    | Promise     | Counts notifications matching criteria.     |

---

# Service: models.AcActivity

Represents the activity model in the database.

## Methods Used

| Name                              | Parameters                | Return Type | Description                                 |
|-----------------------------------|---------------------------|-------------|---------------------------------------------|
| setOrganizationUsersForActivities | activities: array, callback: function | void        | Enriches activities with organization user data. |

---

# Utility Function: getCommonWhereDateOptions

Imported from `../engine/news_feeds/news_feeds_utils.cjs`.

- Used to generate Sequelize `where` options for date filtering.
- Accepts an options object with `afterDate`, `beforeDate`, and `dateColumn`.

---

# Utility Module: logger

Imported as `log` from `../utils/logger.cjs`.

- Used for logging errors and info messages related to notification operations.

---

# Dependencies

- [lodash](https://lodash.com/): Used for object merging and mapping.
- [async](https://caolan.github.io/async/): Used for series control flow in asynchronous operations.
- [express](https://expressjs.com/): Router and middleware framework.

---

# Exported Router

This module exports an Express router with the following endpoints:

- `GET /` - Fetch notifications
- `PUT /markAllViewed` - Mark all notifications as viewed
- `PUT /setIdsViewed` - Mark specific notifications as viewed

---

# See Also

- [models/index.cjs](../../models/index.cjs) - Sequelize models, including `AcNotification` and `AcActivity`.
- [authorization.cjs](../../authorization.cjs) - Authentication middleware.
- [logger.cjs](../utils/logger.cjs) - Logging utility.
- [news_feeds_utils.cjs](../engine/news_feeds/news_feeds_utils.cjs) - Date filtering utility.

---

**Note:** This documentation assumes the router is mounted at `/notifications`. Adjust the base path as needed for your application.