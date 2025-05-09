# Service Module: notificationDeliveryFilter

This module exports a function responsible for filtering and preparing notifications for delivery to users, specifically for point-related activities. It determines the appropriate notification type, content name, and translation token, then delegates to the `filterNotificationForDelivery` utility for further processing.

## Exported Function

### notificationDeliveryFilter(notification, user, callback)

Filters a notification for delivery based on its type and associated activity data. Determines the context (such as post, group, community, or domain) and selects the appropriate translation token for the notification email. Delegates the actual filtering and delivery logic to [`filterNotificationForDelivery`](./emails_utils.md#function-filternotificationfordelivery).

#### Parameters

| Name         | Type       | Description                                                                                 |
|--------------|------------|---------------------------------------------------------------------------------------------|
| notification | `object`   | The notification object, expected to contain an `AcActivities` array and a `type` property. |
| user         | `object`   | The user object representing the notification recipient.                                    |
| callback     | `function` | Callback function to be called with the result or error.                                    |

#### Notification Types Handled

- `notification.point.new`: New point activity.
- `notification.point.newsStory`: News story related to a point.
- `notification.point.comment`: Comment on a point.
- `notification.point.quality`: Quality assessment (helpful/unhelpful) of a point.

#### Logic Overview

1. **Validation**: Checks that `notification`, `user`, and `notification.AcActivities` are present and valid.
2. **Content Name Resolution**: Determines the `contentName` based on the first activity's associated `Post`, `Point.Group`, `Point.Community`, or `Point.Domain`.
3. **Notification Type Handling**: Depending on `notification.type`, selects the appropriate translation token and notification type, then calls `filterNotificationForDelivery`.
4. **Error Handling**: If the notification type is unknown or required data is missing, calls the callback with an error message.

#### Example Usage

```javascript
const notificationDeliveryFilter = require('./notificationDeliveryFilter.cjs');

notificationDeliveryFilter(notification, user, function(err, result) {
  if (err) {
    // Handle error
  } else {
    // Handle successful filtering/delivery
  }
});
```

## Dependencies

- [`filterNotificationForDelivery`](./emails_utils.md#function-filternotificationfordelivery): Handles the actual filtering and delivery logic for notifications.

## Error Handling

- If required data is missing, the callback is invoked with `"Missing data for notification delivery"`.
- If the notification type is unknown, the callback is invoked with `"Unknown state for notification filtering: " + notification.type`.

---

**See also:**  
- [emails_utils.cjs](./emails_utils.md) for the implementation of `filterNotificationForDelivery`.