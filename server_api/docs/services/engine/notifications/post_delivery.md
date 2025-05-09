# Utility Function: filterPostNotificationForDelivery

This module exports a function that processes a notification and user object to determine if a notification about a post (such as a new post or a post endorsement) should be delivered to the user. It uses the `filterNotificationForDelivery` utility from `emails_utils.cjs` to perform the actual filtering and formatting of the notification for email delivery.

## Purpose

- Validates the presence and structure of the notification and user objects.
- Determines the type of post-related notification (new post, endorsement, or opposition).
- Calls `filterNotificationForDelivery` with appropriate parameters to handle the notification delivery logic.
- Invokes the provided callback with an error message if required data is missing or if the notification type is not handled.

---

## Parameters

| Name         | Type     | Description                                                                 |
|--------------|----------|-----------------------------------------------------------------------------|
| notification | object   | The notification object, expected to contain `AcActivities` and `type`.     |
| user         | object   | The user object representing the notification recipient.                    |
| callback     | function | Callback function to be called with the result or error. Signature: `function(error, result?)` |

---

## Behavior

- Checks that `notification`, `user`, and `notification.AcActivities[0].type` exist.
- Extracts the post name from `notification.AcActivities[0].Post`.
- Handles the following notification types:
  - `"notification.post.new"`: Calls `filterNotificationForDelivery` with a translation token for new posts.
  - `"notification.post.endorsement"`: Determines if the activity is an endorsement or opposition and sets the translation token accordingly.
- If the notification type is not recognized, calls the callback with no arguments.
- If required data is missing, calls the callback with an error message.

---

## Example Usage

```javascript
const filterPostNotificationForDelivery = require('./filterPostNotificationForDelivery.cjs');

filterPostNotificationForDelivery(notification, user, function(error, result) {
  if (error) {
    // Handle error (e.g., missing data, no public post)
  } else {
    // Proceed with sending notification email
  }
});
```

---

## Dependencies

- [filterNotificationForDelivery](./emails_utils.md#function-filternotificationfordelivery): Utility function responsible for filtering and formatting the notification for delivery.

---

## Error Handling

- If `notification`, `user`, or required activity data is missing, the callback is invoked with an error message.
- If the post is not found, the callback is invoked with `"No public post found for notification delivery"`.
- If the notification type is not handled, the callback is invoked with no arguments.

---

## Related Utility

See [filterNotificationForDelivery](./emails_utils.md#function-filternotificationfordelivery) for details on the underlying delivery filtering logic.

---

## Export

This module exports a single function as described above.