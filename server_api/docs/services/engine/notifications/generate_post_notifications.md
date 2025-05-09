# Service Module: notifications_generator.cjs

This module is responsible for generating notifications related to new posts and endorsements within communities and groups. It determines the appropriate users to notify based on the activity type and context, and ensures that duplicate notifications are not sent to the same user. The module interacts with the database models, logging utilities, and notification utility functions to perform its operations.

---

## Exported Function

### notificationsGenerator(activity, user, callback)

Main entry point for generating notifications based on the provided activity. Delegates to specific notification generation functions depending on the activity type.

#### Parameters

| Name     | Type     | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| activity | object   | The activity object describing the event (e.g., new post, endorsement, etc).|
| user     | object   | The user object (not directly used in this module, but passed for interface compatibility). |
| callback | function | Callback function to be called after notification processing is complete.    |

#### Usage

```javascript
const notificationsGenerator = require('./notifications_generator.cjs');
notificationsGenerator(activity, user, (err) => {
  if (err) {
    // handle error
  }
});
```

#### Behavior

- If `activity.type` is `"activity.post.new"`, calls `generateNotificationsForNewPost`.
- If `activity.type` is `"activity.post.endorsement.new"` or `"activity.post.opposition.new"`, calls `generateNotificationsForEndorsements`.

---

## Internal Functions

### generateNotificationsForNewPost(activity, callback)

Generates notifications for all users in a community or group when a new post is created. Ensures that duplicate notifications are not sent to the same user.

#### Parameters

| Name     | Type     | Description                                      |
|----------|----------|--------------------------------------------------|
| activity | object   | The activity object for the new post.            |
| callback | function | Callback function to be called after processing. |

#### Logic

- Checks if the activity is valid.
- For community posts:
  - Retrieves the community and its users using `getModelAndUsersByType`.
  - Calls `addNotificationsForUsers` to notify all community users.
- For group posts:
  - Retrieves the group and its users using `getModelAndUsersByType`.
  - Calls `addNotificationsForUsers` to notify all group users.
- Uses an internal `uniqueUserIds` object to prevent duplicate notifications.
- Logs a warning if the community or group is not found or notifications are muted.
- Calls the callback with an error if any step fails.

#### Dependencies

- [`getModelAndUsersByType`](./notifications_utils.md#getmodelandusersbytype)
- [`addNotificationsForUsers`](./notifications_utils.md#addnotificationsforusers)
- [`models.Community`](../../../models/index.cjs)
- [`models.Group`](../../../models/index.cjs)
- [`log`](../../utils/logger.cjs)

---

### generateNotificationsForEndorsements(activity, callback)

Generates notifications for endorsements (or oppositions) on posts created by users, respecting user notification settings and community configuration.

#### Parameters

| Name     | Type     | Description                                      |
|----------|----------|--------------------------------------------------|
| activity | object   | The activity object for the endorsement.         |
| callback | function | Callback function to be called after processing. |

#### Logic

- Checks if the activity is valid.
- Determines if notifications for endorsements are muted in the community configuration.
- Finds the post and its author, ensuring the author's notification settings allow for endorsement notifications.
- Calls `addOrPossiblyGroupNotification` to notify the post author.
- Logs a warning if the post is not found or notifications are muted.
- Calls the callback with an error if any step fails.

#### Dependencies

- [`addOrPossiblyGroupNotification`](./notifications_utils.md#addorpossiblygroupnotification)
- [`models.Post`](../../../models/index.cjs)
- [`models.User`](../../../models/index.cjs)
- [`log`](../../utils/logger.cjs)

---

## Dependencies

- **models**: Database models for Community, Group, Post, and User.  
  See: [`models/index.cjs`](../../../models/index.cjs)
- **log**: Logging utility.  
  See: [`logger.cjs`](../../utils/logger.cjs)
- **async**: Async control flow library.
- **notifications_utils.cjs**: Utility functions for notification handling.  
  - [`getModelAndUsersByType`](./notifications_utils.md#getmodelandusersbytype)
  - [`addNotificationsForUsers`](./notifications_utils.md#addnotificationsforusers)
  - [`addOrPossiblyGroupNotification`](./notifications_utils.md#addorpossiblygroupnotification)

---

## Error Handling

- If the `activity` parameter is null or undefined, the callback is called with an error message.
- If a database or utility function call fails, the callback is called with the error.
- If a community or group is not found or notifications are muted, a warning is logged and the callback is called without an error.

---

## TODOs

- Add notifications for "AcWatching" community and group users.
- Add notifications for "AcFollowing" users.

---

## Example Usage

```javascript
const notificationsGenerator = require('./notifications_generator.cjs');

const activity = {
  type: "activity.post.new",
  Community: { id: 1 },
  user_id: 42,
  // ...other activity properties
};

notificationsGenerator(activity, null, (err) => {
  if (err) {
    console.error("Notification generation failed:", err);
  } else {
    console.log("Notifications generated successfully.");
  }
});
```

---

## See Also

- [notifications_utils.cjs](./notifications_utils.md)
- [models/index.cjs](../../../models/index.cjs)
- [logger.cjs](../../utils/logger.cjs)