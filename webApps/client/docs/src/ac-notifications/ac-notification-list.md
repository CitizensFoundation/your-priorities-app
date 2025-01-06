# AcNotificationList

The `AcNotificationList` class is a custom web component that extends `YpBaseElementWithLogin`. It is designed to display a list of notifications for a user, with features such as marking notifications as viewed, loading more notifications, and handling user interactions.

## Properties

| Name                          | Type                                      | Description                                                                 |
|-------------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| `notifications`               | `Array<AcNotificationData> \| undefined`  | The list of notifications to display.                                       |
| `notificationGetTTL`          | `number`                                  | Time-to-live for fetching notifications, in milliseconds. Default is 5000.  |
| `oldestProcessedNotificationAt` | `Date \| undefined`                     | The date of the oldest processed notification.                              |
| `latestProcessedNotificationAt` | `Date \| undefined`                     | The date of the latest processed notification.                              |
| `url`                         | `string`                                  | The API endpoint URL for fetching notifications. Default is `/api/notifications`. |
| `user`                        | `YpUserData \| undefined`                 | The current user data.                                                      |
| `firstReponse`                | `boolean`                                 | Indicates if the first response has been received. Default is `false`.      |
| `timer`                       | `ReturnType<typeof setTimeout> \| undefined` | Timer for scheduling notification fetches.                                  |
| `unViewedCount`               | `number`                                  | The count of unviewed notifications.                                        |
| `moreToLoad`                  | `boolean`                                 | Indicates if there are more notifications to load. Default is `false`.      |
| `opened`                      | `boolean`                                 | Indicates if the notification list is opened. Default is `false`.           |
| `route`                       | `string \| undefined`                     | The current route.                                                          |
| `lastFetchStartedAt`          | `number \| undefined`                     | Timestamp of the last fetch start.                                          |

## Methods

| Name                          | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| `updated`                     | `changedProperties: Map<string \| number \| symbol, unknown>`              | `void`      | Called when the element's properties change.                                |
| `renderNotification`          | `notification: AcNotificationData`                                         | `TemplateResult` | Renders a notification based on its type.                                   |
| `render`                      |                                                                             | `TemplateResult` | Renders the component's template.                                           |
| `scrollEvent`                 | `event: { last: number }`                                                  | `void`      | Handles scroll events to load more notifications if needed.                 |
| `notificationsLength`         |                                                                             | `number`    | Returns the length of the notifications array.                              |
| `_openedChanged`              |                                                                             | `void`      | Handles changes when the notification list is opened.                       |
| `_getNotificationTypeAndName` | `theType: string \| undefined, name: string \| undefined`                  | `string`    | Returns a formatted string of notification type and name.                   |
| `_clearScrollThreshold`       |                                                                             | `void`      | Clears the scroll threshold.                                                |
| `_markAllAsViewed`            |                                                                             | `void`      | Marks all notifications as viewed.                                          |
| `_reallyMarkAllAsViewed`      |                                                                             | `Promise<void>` | Marks all notifications as viewed on the server.                            |
| `_handleUnViewedCount`        | `unViewedCount: number`                                                    | `void`      | Updates the unviewed count and fires an event.                              |
| `markCurrentAsViewed`         |                                                                             | `void`      | Marks the current notifications as viewed.                                  |
| `_markAsViewed`               | `notifications: Array<AcNotificationData>`                                 | `void`      | Marks specified notifications as viewed.                                    |
| `_setAsViewed`                | `body: { viewedIds: Array<number> }`                                       | `Promise<void>` | Sets notifications as viewed on the server.                                 |
| `_setAllLocalCurrentAsViewed` |                                                                             | `void`      | Marks all local notifications as viewed.                                    |
| `_newNotificationsError`      | `event: CustomEvent`                                                       | `void`      | Handles errors when fetching new notifications.                             |
| `_getNotifications`           | `options: AcNotificationsDateFetchOptions \| undefined`                    | `Promise<AcNotificationsResponse>` | Fetches notifications from the server.                                      |
| `_processNotifications`       | `notificationsResponse: AcNotificationsResponse`                           | `void`      | Processes the notifications response.                                       |
| `_userChanged`                |                                                                             | `Promise<void>` | Handles changes to the user property.                                       |
| `_loggedInUserChanged`        |                                                                             | `void`      | Handles changes to the logged-in user.                                      |
| `cancelTimer`                 |                                                                             | `void`      | Cancels the notification fetch timer.                                       |
| `_notificationType`           | `notification: AcNotificationData, type: string`                           | `boolean`   | Checks if a notification is of a specific type.                             |
| `_startTimer`                 |                                                                             | `void`      | Starts the notification fetch timer.                                        |
| `_sendReloadPointsEvents`     | `notifications: Array<AcNotificationData>`                                 | `void`      | Sends events to reload points for specific notifications.                   |
| `_loadNewNotificationsResponse` | `notificationsResponse: AcNotificationsResponse`                         | `void`      | Loads new notifications from the response.                                  |
| `_removeOldIfExists`          | `notification: AcNotificationData`                                         | `void`      | Removes old notifications if they exist.                                    |
| `_getNotificationText`        | `notification: AcNotificationData`                                         | `string`    | Returns the text for a notification.                                        |
| `_displayToast`               | `notifications: Array<AcNotificationData>`                                 | `void`      | Displays a toast notification for new notifications.                        |
| `_finalizeAfterResponse`      | `notifications: Array<AcNotificationData>`                                 | `void`      | Finalizes the state after processing notifications.                         |
| `_loadMoreData`               |                                                                             | `Promise<void>` | Loads more notifications if available.                                      |
| `loadNewData`                 |                                                                             | `Promise<void>` | Loads new notifications.                                                    |

## Examples

```typescript
// Example usage of the AcNotificationList component
import './ac-notification-list.js';

const notificationList = document.createElement('ac-notification-list');
document.body.appendChild(notificationList);

// Set properties
notificationList.notifications = [
  { id: 1, type: 'postNotification', viewed: false, AcActivities: [] },
  // ... more notifications
];
notificationList.user = { id: 123, name: 'John Doe' };

// Listen to events
notificationList.addEventListener('yp-set-number-of-un-viewed-notifications', (event) => {
  console.log('Unviewed notifications count:', event.detail.count);
});
```