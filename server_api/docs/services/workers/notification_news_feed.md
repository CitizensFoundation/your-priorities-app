# Service: NotificationNewsFeedWorker

The `NotificationNewsFeedWorker` is a service responsible for processing notification objects and generating corresponding news feed items. It orchestrates the retrieval of notification data, user information, localization, and the actual news feed generation logic. This worker is typically used in a background job or queue processing context.

---

## Methods

| Name    | Parameters                                      | Return Type | Description                                                                                  |
|---------|------------------------------------------------|-------------|----------------------------------------------------------------------------------------------|
| process | notificationJson: object, callback: function    | void        | Processes a notification to generate a news feed item.                                       |

---

## Method: process

Processes a notification to generate a news feed item. This involves:
- Fetching the notification and its related activities, user, domain, and community.
- Fetching the user associated with the notification.
- Setting the user's locale based on the domain and community.
- Depending on the notification type, generating a news feed item using the `GenerateNewsFeedFromNotifications` engine.
- Logging progress and errors, and reporting errors to Airbrake if configured.

### Parameters

| Name             | Type     | Description                                                                 |
|------------------|----------|-----------------------------------------------------------------------------|
| notificationJson | object   | The notification JSON object. Must contain at least an `id` property.        |
| callback         | function | Callback function to be called upon completion or error. Signature: `(error?: any) => void` |

### Workflow

1. **Fetch Notification**: Retrieves the notification by ID, including related activities and associated models (User, Domain, Community, Group, Post, Point).
2. **Fetch User**: Retrieves the user associated with the notification.
3. **Set Locale**: Sets the user's locale using the `setLocale` method, based on the domain and community.
4. **Generate News Feed**: If the notification type matches certain types, invokes `GenerateNewsFeedFromNotifications` to create a news feed item.
5. **Error Handling**: Logs errors and, if Airbrake is configured, reports them.

### Notification Types Handled

- `notification.post.new`
- `notification.post.endorsement`
- `notification.point.new`
- `notification.point.quality`

### Example Usage

```javascript
const worker = require('./path/to/NotificationNewsFeedWorker.cjs');

worker.process({ id: 123 }, function(error) {
  if (error) {
    // handle error
  } else {
    // success
  }
});
```

---

## Dependencies

- [async](https://caolan.github.io/async/v3/)
- [models](../../models/index.cjs): Sequelize models, including `AcNotification`, `User`, `AcActivity`, etc.
- [logger](../utils/logger.cjs): Logging utility.
- [queue](./queue.cjs): Queue management (not directly used in this file).
- [i18n](../utils/i18n.cjs): Internationalization utility.
- [toJson](../utils/to_json.cjs): Utility for JSON conversion (not directly used in this file).
- [airbrake](../utils/airbrake.cjs): Error reporting (optional, loaded if `AIRBRAKE_PROJECT_ID` is set).
- [GenerateNewsFeedFromNotifications](../engine/news_feeds/generate_from_notifications.cjs): Engine for generating news feed items from notifications.

---

## Error Handling

- Errors encountered during any step are logged using the logger.
- If Airbrake is configured, errors are also reported to Airbrake.
- The callback is always called with the error (if any) or with no arguments on success.

---

## Export

This module exports a singleton instance of `NotificationNewsFeedWorker`:

```javascript
module.exports = new NotificationNewsFeedWorker();
```

---

## Related Modules

- [models/index.cjs](../../models/index.cjs): Sequelize models used for database access.
- [logger.cjs](../utils/logger.cjs): Logging utility.
- [airbrake.cjs](../utils/airbrake.cjs): Error reporting utility.
- [generate_from_notifications.cjs](../engine/news_feeds/generate_from_notifications.cjs): News feed generation logic.

---

## See Also

- [AcNotification Model](../../models/index.cjs) (for notification schema)
- [User Model](../../models/index.cjs)
- [GenerateNewsFeedFromNotifications](../engine/news_feeds/generate_from_notifications.cjs)
