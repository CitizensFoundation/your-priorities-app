# Service Module: generatePointNotification.cjs

This module is responsible for generating notifications related to "points" (posts, comments, news stories, and helpfulness endorsements) in the application. It determines the type of activity and dispatches notifications to relevant users based on their notification settings and the context of the activity (e.g., post, community, group).

## Exported Function

### generatePointNotification(activity, user, callback)

Main entry point for generating point-related notifications. Delegates to specialized functions based on the activity type.

#### Parameters

| Name     | Type     | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| activity | object   | The activity object describing the event (type, context, post_id, etc.).    |
| user     | object   | The user who triggered the activity (not always used in this module).       |
| callback | function | Callback function to be called after notifications are processed.           |

#### Usage

```javascript
const generatePointNotification = require('./generatePointNotification.cjs');
generatePointNotification(activity, user, (err) => {
  if (err) { /* handle error */ }
});
```

#### Behavior

- For new points, news stories, or comments, calls `generateNotificationsForNewPoint`.
- For helpfulness (endorsement) activities, calls `generateNotificationsForHelpfulness`.
- Calls the callback with an error if the activity type is unexpected.

---

## Internal Functions

### generateNotificationsForNewPoint(activity, callback)

Generates notifications for new points, news stories, or comments. Handles multiple notification channels:

- **My Posts**: Notifies users who have enabled notifications for their posts.
- **My Points**: Notifies users who have enabled notifications for their points.
- **All Community**: Notifies all users in the community if applicable.
- **All Group**: Notifies all users in the group if applicable.

#### Parameters

| Name     | Type     | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| activity | object   | The activity object describing the event.                                   |
| callback | function | Callback function to be called after notifications are processed.           |

#### Notification Logic

- Avoids duplicate notifications to the same user.
- Respects notification settings (`notifications_settings`) for each user.
- Handles "silentMode" and "bulkOperation" to suppress notifications as needed.
- Uses helper functions from `notifications_utils.cjs` for user selection and notification creation.

---

### generateNotificationsForHelpfulness(activity, callback)

Generates notifications when a point receives a helpful or unhelpful endorsement.

#### Parameters

| Name     | Type     | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| activity | object   | The activity object describing the event.                                   |
| callback | function | Callback function to be called after notifications are processed.           |

#### Notification Logic

- Notifies the creator of the point if they have enabled notifications for point endorsements.
- Uses `addOrPossiblyGroupNotification` to create or group notifications.
- Logs a warning if the point or user is not found or muted.

---

## Dependencies

- **models**: Sequelize models for User, Post, Point, Community, Group, etc. ([models/index.cjs](../../../models/index.cjs))
- **log**: Logger utility ([../../utils/logger.cjs](../../utils/logger.cjs))
- **async**: Async control flow library
- **lodash**: Utility library for array/object manipulation
- **notifications_utils.cjs**: Helper functions for notification logic:
  - `getModelAndUsersByType`
  - `addNotificationsForUsers`
  - `addOrPossiblyGroupNotification`

---

## Notification Types

- `notification.point.newsStory`: For new news stories.
- `notification.point.comment`: For new comments.
- `notification.point.new`: For new points.
- `notification.point.quality`: For helpful/unhelpful endorsements.

---

## Example Activity Object

```json
{
  "type": "activity.point.new",
  "sub_type": null,
  "post_id": 123,
  "user_id": 456,
  "context": {},
  "Community": { "id": 1 },
  "Group": { "id": 2 }
}
```

---

## Error Handling

- If an error occurs during notification generation, it is passed to the callback.
- If the activity type is not recognized, the callback is called with an error message.

---

## Related Utility Functions

See [notifications_utils.cjs](./notifications_utils.cjs.md) for documentation on:

- `getModelAndUsersByType`
- `addNotificationsForUsers`
- `addOrPossiblyGroupNotification`

---

## Configuration

- `process.env.POINT_NOTIFICATIONS_USERS_LIMIT`: Limits the number of users notified for large point discussions (default: 250).

---

## Export

```javascript
module.exports = (activity, user, callback) => { ... }
```

---

## See Also

- [models/index.cjs](../../../models/index.cjs)
- [../../utils/logger.cjs](../../utils/logger.cjs)
- [notifications_utils.cjs](./notifications_utils.cjs.md)
- [async](https://caolan.github.io/async/)
- [lodash](https://lodash.com/)