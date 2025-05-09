# Model: AcNotification

Represents a notification entity in the system, used for delivering various types of notifications (email, push, browser, etc.) to users. This Sequelize model includes methods for creating, processing, and managing notifications, as well as static configuration for notification methods and frequencies.

## Properties

| Name                      | Type                | Description                                                                 |
|---------------------------|---------------------|-----------------------------------------------------------------------------|
| priority                  | number              | Priority of the notification. Required.                                     |
| type                      | string              | Type/category of the notification. Required.                                |
| status                    | string              | Status of the notification (default: `'active'`). Required.                 |
| sent_email                | number              | Whether the notification was sent via email (0/1). Default: `false`.        |
| sent_push                 | number              | Whether the notification was sent via push (0/1). Default: `false`.         |
| processed_at              | Date                | Timestamp when the notification was processed.                              |
| user_interaction_profile  | object (JSONB)      | JSONB field for storing user interaction profile data.                      |
| from_notification_setting | string              | Source notification setting type.                                           |
| viewed                    | boolean             | Whether the notification has been viewed. Default: `false`. Required.       |
| deleted                   | boolean             | Whether the notification has been deleted. Default: `false`. Required.      |
| created_at                | Date                | Timestamp when the notification was created.                                |
| updated_at                | Date                | Timestamp when the notification was last updated.                           |

## Indexes

- `notification_by_type_and_user_id`: (`type`, `user_id`)
- `notification_user_id_deleted_viewed`: (`user_id`, `deleted`, `viewed`)
- `ac_notifications_idx_user_id_type_deleted_created_at`: (`user_id`, `type`, `deleted`, `created_at`)
- GIN index on `user_interaction_profile` (for JSONB queries)
- `ac_notifications_idx_deleted_id`: (`deleted`, `id`)

## Associations

- **BelongsToMany**: `AcActivity` (as `AcActivities`, through `notification_activities`)
- **BelongsToMany**: `AcDelayedNotification` (as `AcDelayedNotifications`, through `delayed_notifications`)
- **BelongsTo**: `User` (foreign key: `user_id`)

---

# Exported Constants

## Notification Methods

| Name                        | Value | Description                |
|-----------------------------|-------|----------------------------|
| METHOD_MUTED                | 0     | Muted (no notification)    |
| METHOD_BROWSER              | 1     | Browser notification       |
| METHOD_EMAIL                | 2     | Email notification         |
| METHOD_PUSH                 | 3     | Push notification          |
| METHOD_SMS                  | 4     | SMS notification           |

## Notification Frequencies

| Name                        | Value | Description                |
|-----------------------------|-------|----------------------------|
| FREQUENCY_AS_IT_HAPPENS     | 0     | As it happens              |
| FREQUENCY_HOURLY            | 1     | Hourly                     |
| FREQUENCY_DAILY             | 2     | Daily                      |
| FREQUENCY_WEEKLY            | 3     | Weekly                     |
| FREQUENCY_BI_WEEKLY         | 4     | Bi-weekly                  |
| FREQUENCY_MONTHLY           | 5     | Monthly                    |

## Default Notification Settings

### `AcNotification.defaultNotificationSettings`
Default notification settings for registered users.

```js
{
  my_posts: { method: 2, frequency: 0 },
  my_posts_endorsements: { method: 2, frequency: 2 },
  my_points: { method: 2, frequency: 1 },
  my_points_endorsements: { method: 2, frequency: 2 },
  all_community: { method: 0, frequency: 3 },
  all_group: { method: 0, frequency: 3 },
  newsletter: { method: 2, frequency: 4 }
}
```

### `AcNotification.anonymousNotificationSettings`
Default notification settings for anonymous users.

```js
{
  my_posts: { method: 1, frequency: 2 },
  my_posts_endorsements: { method: 1, frequency: 2 },
  my_points: { method: 1, frequency: 2 },
  my_points_endorsements: { method: 1, frequency: 2 },
  all_community: { method: 0, frequency: 3 },
  all_group: { method: 0, frequency: 3 },
  newsletter: { method: 1, frequency: 4 }
}
```

## Other Constants

| Name                           | Type   | Description                                  |
|--------------------------------|--------|----------------------------------------------|
| ENDORSEMENT_GROUPING_TTL       | number | Time-to-live for grouping endorsements (ms). |

---

# Static Methods

## AcNotification.processNotification

Processes a notification for a user and activity, queues delivery, and updates the notification as needed.

### Parameters

| Name         | Type      | Description                                      |
|--------------|-----------|--------------------------------------------------|
| notification | Object    | The notification instance to process.            |
| user         | Object    | The user object (should have `last_login_at`).   |
| activity     | Object    | The related activity instance.                   |
| callback     | Function  | Optional callback to be called after processing. |

### Description

- Determines queue priority based on user's last login.
- Adds a job to the notification delivery queue.
- Optionally updates the notification as not viewed and saves it.
- Calls the callback on completion or error.

---

## AcNotification.createReportNotifications

Creates report notifications for all admins of the community and group related to an activity.

### Parameters

| Name     | Type      | Description                                      |
|----------|-----------|--------------------------------------------------|
| user     | Object    | The user who triggered the report.               |
| activity | Object    | The activity being reported.                     |
| callback | Function  | Callback to be called after all notifications.   |

### Description

- Finds the activity and includes related community/group and their admins.
- For each admin, creates a notification and associates it with the activity.
- Queues delivery for each notification.
- Calls the callback on completion or error.

---

## AcNotification.createNotificationFromActivity

Creates a notification from an activity for a user, with a given type, notification setting, and priority.

### Parameters

| Name                     | Type      | Description                                      |
|--------------------------|-----------|--------------------------------------------------|
| user                     | Object\|number\|string | The user object, user ID, or user ID string.     |
| activity                 | Object    | The activity instance.                           |
| type                     | string    | The notification type.                           |
| notification_setting_type| string    | The notification setting type.                   |
| priority                 | number    | The priority of the notification.                |
| callback                 | Function  | Callback to be called after creation.            |

### Description

- Normalizes the user parameter to an object with an `id`.
- Builds and saves a new notification.
- Associates the notification with the activity.
- Calls `processNotification` to queue delivery.
- Calls the callback on completion or error.

---

# Configuration

- **Timestamps**: Enabled (`created_at`, `updated_at`)
- **Table Name**: `ac_notifications`
- **Default Scope**: Only non-deleted notifications (`deleted: false`)
- **Underscored**: Field names use snake_case in the database.

---

# Related Modules

- [logger.cjs](./../utils/logger.md): Logging utility.
- [to_json.cjs](./../utils/to_json.md): Utility for converting objects to JSON.
- [queue.cjs](./../workers/queue.md): Job queue for processing notification delivery.

---

# Example Usage

```javascript
// Creating a notification from an activity
AcNotification.createNotificationFromActivity(
  user, 
  activity, 
  'notification.type', 
  'settingType', 
  100, 
  (err) => {
    if (err) {
      // handle error
    }
  }
);

// Processing a notification
AcNotification.processNotification(notification, user, activity, (err) => {
  if (err) {
    // handle error
  }
});
```

---

# See Also

- [User](./User.md)
- [AcActivity](./AcActivity.md)
- [AcDelayedNotification](./AcDelayedNotification.md)
- [queue.cjs](./../workers/queue.md)
- [logger.cjs](./../utils/logger.md)
