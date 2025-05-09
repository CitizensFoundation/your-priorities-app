# Service Module: generateNotificationsForPostStatusChange.cjs

This module provides functionality to generate and send notifications to users when the status of a post changes. It ensures that duplicate notifications are not sent to the same user. The module interacts with the database models for `Endorsement` and `User`, and utilizes a utility function to add notifications for users.

---

## Exported Functions

### Default Export

```javascript
module.exports = function (activity, user, callback) { ... }
```

#### Description

This is the main exported function of the module. It initiates the process of generating notifications for users related to a post status change. It ensures that each user receives only one notification per activity.

#### Parameters

| Name      | Type     | Description                                                                 |
|-----------|----------|-----------------------------------------------------------------------------|
| activity  | object   | The activity object representing the post status change. Should contain `post_id`. |
| user      | object   | The user object (not used in the current implementation, but reserved for future use). |
| callback  | function | Callback function to be called after notifications are processed. Signature: `function(error)` |

#### Example Usage

```javascript
const generateNotifications = require('./generateNotificationsForPostStatusChange.cjs');
generateNotifications(activity, user, (err) => {
  if (err) {
    // handle error
  }
});
```

---

### Internal Function: generateNotificationsForPostStatusChange

```javascript
var generateNotificationsForPostStatusChange = function (activity, uniqueUserIds, callback) { ... }
```

#### Description

Finds all users who have endorsed a post (via the `Endorsement` model) and sends them a notification about the post's status change. Uses a utility to avoid duplicate notifications.

#### Parameters

| Name          | Type     | Description                                                                 |
|---------------|----------|-----------------------------------------------------------------------------|
| activity      | object   | The activity object, must include `post_id`.                                |
| uniqueUserIds | object   | An object used to track user IDs that have already received a notification. Format: `{ users: [] }` |
| callback      | function | Callback function to be called after notifications are processed. Signature: `function(error)` |

---

## Dependencies

- **models**: Database models, including `Endorsement` and `User`. Imported from `../../../models/index.cjs`.
- **async**: Used for managing asynchronous control flow.
- **addNotificationsForUsers**: Utility function to add notifications for a list of users. Imported from `./notifications_utils.cjs`.
- **lodash (\_)**: Used for mapping and manipulating arrays/objects.

---

## Workflow

1. **Find Endorsements**: If the `activity` object contains a `post_id`, the function queries the `Endorsement` model for all endorsements related to that post, including the associated `User` data.
2. **Extract Users**: Uses lodash to extract the `User` objects from the endorsements.
3. **Send Notifications**: Calls `addNotificationsForUsers` to send a notification to each user, passing the activity, user list, notification type (`notification.post.status.change`), priority, and the `uniqueUserIds` tracker.
4. **Avoid Duplicates**: The `uniqueUserIds` object ensures that no user receives more than one notification for the same activity.
5. **Callback**: Calls the provided callback with an error (if any) after processing.

---

## Related Utility

- [addNotificationsForUsers](./notifications_utils.md): Utility function used to actually create and send notifications to users.

---

## Example Usage

```javascript
const generateNotifications = require('./generateNotificationsForPostStatusChange.cjs');

const activity = {
  post_id: 123,
  // ...other activity properties
};

const user = {
  id: 1,
  // ...other user properties
};

generateNotifications(activity, user, (err) => {
  if (err) {
    console.error('Failed to generate notifications:', err);
  } else {
    console.log('Notifications generated successfully.');
  }
});
```

---

## Notes

- The `user` parameter in the default export is currently unused but may be reserved for future enhancements.
- The function is designed to be used as part of a notification system triggered by post status changes.
- The module expects the `Endorsement` and `User` models to be defined and associated appropriately in the Sequelize ORM.

---

## See Also

- [notifications_utils.cjs](./notifications_utils.md)
- [Endorsement Model](../../../models/index.md) (see your project's models for details)
- [User Model](../../../models/index.md) (see your project's models for details)
