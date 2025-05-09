# Service Module: notificationService

This module provides core business logic for handling notifications in the application. It includes functions for retrieving users eligible for notifications, adding notifications for users, and grouping notifications to avoid duplicates. The module interacts with Sequelize models, especially `User`, `AcNotification`, and `AcActivity`.

---

## Methods

| Name                              | Parameters                                                                                                                                                                                                 | Return Type | Description                                                                                                 |
|------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|-------------------------------------------------------------------------------------------------------------|
| getModelAndUsersByType             | model: Model, userType: string, id: number \| string, notification_setting_type: string, callback: Function                                                                                              | void        | Retrieves a model instance and its associated users filtered by notification settings.                      |
| addNotificationsForUsers           | activity: Object, users: Array<User>, notification_type: string, notification_setting_type: string, uniqueUserIds: { users: number[] }, callback: Function                                               | void        | Adds notifications for a list of users, ensuring no duplicate notifications for the same user.              |
| addOrPossiblyGroupNotification     | model: Model, notification_type: string, notification_setting_type: string, activity: Object, user: User, priority: number, callback: Function                                                           | void        | Adds a notification or groups it with an existing one if within a grouping TTL, to avoid notification spam. |

---

## Method Details

---

### getModelAndUsersByType

Retrieves a model instance (e.g., Post, Point) and its associated users of a given type, filtered by their notification settings. Only users who have enabled a specific notification method are included.

#### Parameters

| Name                    | Type                | Description                                                                                 |
|-------------------------|---------------------|---------------------------------------------------------------------------------------------|
| model                   | Model               | Sequelize model (e.g., Post, Point) to query.                                               |
| userType                | string              | The association alias for the user relation (e.g., 'followers', 'supporters').              |
| id                      | number \| string    | The ID of the model instance to retrieve.                                                   |
| notification_setting_type| string              | The notification setting type to filter users by (e.g., 'email', 'push').                   |
| callback                | Function            | Node-style callback function (error, results).                                              |

#### Usage

- Filters users where `notifications_settings.[notification_setting_type].method > 0`.
- Returns the model instance with the filtered users included.

---

### addNotificationsForUsers

Adds notifications for a list of users based on an activity, notification type, and notification setting type. Ensures that each user only receives one notification per activity by tracking unique user IDs.

#### Parameters

| Name                    | Type                | Description                                                                                 |
|-------------------------|---------------------|---------------------------------------------------------------------------------------------|
| activity                | Object              | The activity object triggering the notification.                                            |
| users                   | Array<User>         | List of user objects to notify.                                                             |
| notification_type       | string              | The type of notification to create (e.g., 'notification.post.endorsement').                 |
| notification_setting_type| string              | The notification setting type (e.g., 'email', 'push').                                      |
| uniqueUserIds           | { users: number[] } | Object tracking user IDs that have already been notified.                                   |
| callback                | Function            | Node-style callback function (error).                                                       |

#### Usage

- Iterates over users, skipping those already in `uniqueUserIds.users`.
- Calls `models.AcNotification.createNotificationFromActivity` for each eligible user.

---

### addOrPossiblyGroupNotification

Adds a notification for a user and activity, or groups it with an existing notification if one exists within a defined time-to-live (TTL) window. This prevents spamming users with multiple notifications for similar activities in a short period.

#### Parameters

| Name                    | Type                | Description                                                                                 |
|-------------------------|---------------------|---------------------------------------------------------------------------------------------|
| model                   | Model               | The content model instance (e.g., Post, Point) related to the notification.                 |
| notification_type       | string              | The type of notification (e.g., 'notification.post.endorsement').                           |
| notification_setting_type| string              | The notification setting type (e.g., 'email', 'push').                                      |
| activity                | Object              | The activity object triggering the notification.                                            |
| user                    | User                | The user to notify.                                                                         |
| priority                | number              | Notification priority (e.g., 50).                                                           |
| callback                | Function            | Node-style callback function (error).                                                       |

#### Usage

- Checks for existing notifications for the user, type, and content within the grouping TTL.
- If found, updates the notification or adds the activity to the existing notification.
- If not found, creates a new notification.

---

## Dependencies

- [Sequelize models](../../../models/index.cjs): Used for querying and creating notifications, users, and activities.
- [async](https://caolan.github.io/async/): Used for serial asynchronous iteration.
- [lodash](https://lodash.com/): Used for utility functions (e.g., `_.includes`, `_.merge`).

---

## Example Usage

```javascript
const notificationService = require('./path/to/notificationService');

// Example: Get users to notify for a post
notificationService.getModelAndUsersByType(
  models.Post,
  'followers',
  123,
  'email',
  (err, postWithUsers) => {
    if (err) return console.error(err);
    // postWithUsers includes the post and its followers with email notifications enabled
  }
);

// Example: Add notifications for users
notificationService.addNotificationsForUsers(
  activityObj,
  userList,
  'notification.post.endorsement',
  'email',
  { users: [] },
  (err) => {
    if (err) console.error('Failed to add notifications:', err);
  }
);

// Example: Add or group notification
notificationService.addOrPossiblyGroupNotification(
  postInstance,
  'notification.post.endorsement',
  'email',
  activityObj,
  userObj,
  50,
  (err) => {
    if (err) console.error('Failed to add/group notification:', err);
  }
);
```

---

## Exported Functions

- `getModelAndUsersByType`
- `addNotificationsForUsers`
- `addOrPossiblyGroupNotification`

---

## See Also

- [AcNotification Model](../../../models/index.cjs) (for `createNotificationFromActivity`, `processNotification`, and constants like `ENDORSEMENT_GROUPING_TTL`)
- [User Model](../../../models/index.cjs)
- [AcActivity Model](../../../models/index.cjs)
