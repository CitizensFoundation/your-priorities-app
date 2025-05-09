# Service: NotificationDeliveryWorker

The `NotificationDeliveryWorker` is a service responsible for processing and delivering various types of user notifications in the system. It orchestrates the retrieval of notification data, user and context resolution, and dispatches the appropriate notification delivery logic (such as sending emails or invoking notification-specific handlers). This worker is typically used as part of a background job or queue system to handle notification delivery asynchronously.

---

## Methods

| Name    | Parameters                                                                 | Return Type | Description                                                                                  |
|---------|----------------------------------------------------------------------------|-------------|----------------------------------------------------------------------------------------------|
| process | notificationJson: `object`, callback: `(error?: any) => void`              | `void`      | Processes a notification for delivery, handling all supported notification types.            |

---

## Method: process

Processes a notification for delivery. This method fetches the notification and its related entities (user, domain, community, group, etc.), determines the notification type, and dispatches the appropriate delivery logic (such as sending an email or invoking a notification handler). Handles errors and reports them to Airbrake if configured.

### Parameters

| Name             | Type                                   | Description                                                                                 |
|------------------|----------------------------------------|---------------------------------------------------------------------------------------------|
| notificationJson | `object`                               | The notification JSON object. Must contain at least an `id` property.                       |
| callback         | `(error?: any) => void`                | Callback function to be called after processing (with error if any).                        |

### Notification Types Handled

- `notification.user.invite`
- `notification.password.recovery`
- `notification.report.content`
- `notification.password.changed`
- `notification.post.status.change`
- `notification.bulk.status.update`
- `notification.post.new`
- `notification.post.endorsement`
- `notification.point.new`
- `notification.point.quality`
- `notification.point.newsStory`
- `notification.point.comment`
- `notification.generalUserNotification`

### Processing Steps

1. **Fetch Notification**: Loads the notification and all related models (user, activities, domain, community, group, post, point, etc.) from the database.
2. **Resolve User**: Fetches the user associated with the notification, or uses fallback data if not found.
3. **Set User Locale**: Sets the user's locale for i18n purposes.
4. **Dispatch Notification**: Based on the notification type, dispatches the appropriate delivery logic:
    - For most types, adds an email job to the queue with the correct template and context.
    - For post/point notifications, delegates to specialized delivery functions.
    - For general user notifications, calls a general notification processor.
5. **Error Handling**: Logs errors and, if Airbrake is configured, reports them.

### Example Usage

```javascript
const notificationWorker = require('./path/to/NotificationDeliveryWorker.cjs');

notificationWorker.process({ id: 12345 }, function(error) {
  if (error) {
    // handle error
  } else {
    // success
  }
});
```

---

## Dependencies

- **models**: Database models (e.g., User, AcNotification, AcActivity, etc.)
- **log**: Logging utility.
- **queue**: Job queue for sending emails.
- **i18n**: Internationalization utility.
- **toJson**: Utility for converting models to JSON.
- **deliverPostNotification**: Handler for post-related notifications.
- **deliverPointNotification**: Handler for point-related notifications.
- **processGeneralNotification**: Handler for general user notifications.
- **airbrake**: (Optional) Error reporting service.

---

## Error Handling

- All errors are logged using the `log` utility.
- If Airbrake is configured (via `AIRBRAKE_PROJECT_ID`), errors are also reported to Airbrake.
- The callback is always called with the error (if any) after processing.

---

## Export

This module exports a singleton instance of `NotificationDeliveryWorker`:

```javascript
module.exports = new NotificationDeliveryWorker();
```

---

## Related Modules

- [queue.cjs](./queue.md): Job queue for sending emails and other async tasks.
- [logger.cjs](./logger.md): Logging utility.
- [i18n.cjs](./i18n.md): Internationalization utility.
- [to_json.cjs](./to_json.md): Model-to-JSON conversion utility.
- [post_delivery.cjs](./post_delivery.md): Post notification delivery handler.
- [point_delivery.cjs](./point_delivery.md): Point notification delivery handler.
- [process_general_notifications.cjs](./process_general_notifications.md): General notification processor.
- [models](../../models/index.md): Sequelize models for database access.

---

## Configuration

- **AIRBRAKE_PROJECT_ID**: If set, enables Airbrake error reporting.
- **DEFAULT_HOSTNAME**: Used as a fallback for community hostname in invite notifications.

---

## Example Notification JSON

```json
{
  "id": 12345
}
```

---

## See Also

- [AcNotification Model](../../models/AcNotification.md)
- [User Model](../../models/User.md)
- [AcActivity Model](../../models/AcActivity.md)
- [Domain Model](../../models/Domain.md)
- [Community Model](../../models/Community.md)
- [Group Model](../../models/Group.md)
- [Post Model](../../models/Post.md)
- [Point Model](../../models/Point.md)
- [BulkStatusUpdate Model](../../models/BulkStatusUpdate.md)
