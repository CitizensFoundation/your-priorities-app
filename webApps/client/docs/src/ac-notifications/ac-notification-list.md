# AcNotificationList

The `AcNotificationList` class is a custom element that extends `YpBaseElementWithLogin` and is responsible for displaying a list of notifications to the user. It fetches notifications from a server, handles user interactions, and updates the UI accordingly.

## Properties

| Name                            | Type                                      | Description                                                                 |
|---------------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| notifications                   | Array<AcNotificationData> \| undefined    | Holds the list of notifications to be displayed.                             |
| notificationGetTTL              | Number                                    | Time to live for getting notifications, in milliseconds.                     |
| oldestProcessedNotificationAt   | Date \| undefined                         | The date of the oldest processed notification.                               |
| latestProcessedNotificationAt   | Date \| undefined                         | The date of the latest processed notification.                               |
| url                             | String                                    | The URL endpoint to fetch notifications from.                                |
| user                            | YpUserData \| undefined                   | The current user's data.                                                     |
| firstReponse                    | Boolean                                   | A flag to indicate if the first response has been received.                  |
| timer                           | ReturnType<typeof setTimeout> \| undefined| A timer for fetching new notifications.                                      |
| unViewedCount                   | Number                                    | The count of notifications that have not been viewed by the user.            |
| moreToLoad                      | Boolean                                   | A flag to indicate if there are more notifications to load.                  |
| opened                          | Boolean                                   | A flag to indicate if the notification list is currently opened.             |
| route                           | String \| undefined                       | The current route.                                                           |
| lastFetchStartedAt              | Number \| undefined                       | The timestamp when the last fetch started.                                   |

## Methods

| Name                        | Parameters                  | Return Type | Description                                                                 |
|-----------------------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| renderNotification          | notification: AcNotificationData | nothing \| TemplateResult | Renders a single notification item based on its type.                       |
| scrollEvent                 | event: { last: number }     | void        | Handles the scroll event to load more data when reaching the end of the list.|
| notificationsLength         |                             | Number      | Returns the length of the notifications array.                              |
| _openedChanged              |                             | void        | Handles changes to the `opened` property.                                   |
| _getNotificationTypeAndName | theType: string \| undefined, name: string \| undefined | String | Returns a formatted string with the notification type and name.             |
| _openEdit                   |                             | void        | Opens the user edit dialog.                                                 |
| _clearScrollThreshold       |                             | void        | Clears the scroll threshold.                                                |
| _markAllAsViewed            |                             | void        | Marks all notifications as viewed after confirmation.                       |
| _reallyMarkAllAsViewed      |                             | Promise<void> | Actually marks all notifications as viewed.                                 |
| _handleUnViewedCount        | unViewedCount: number       | void        | Updates the `unViewedCount` property.                                       |
| markCurrentAsViewed         |                             | void        | Marks the current notifications as viewed.                                  |
| _markAsViewed               | notifications: Array<AcNotificationData> | void | Marks the given notifications as viewed.                                    |
| _setAsViewed                | body: { viewedIds: Array<number> } | Promise<void> | Sets the given notifications as viewed on the server.                        |
| _setAllLocalCurrentAsViewed |                             | void        | Sets all local notifications as viewed.                                     |
| _newNotificationsError      | event: CustomEvent          | void        | Handles errors when fetching new notifications.                             |
| _getNotifications           | options: AcNotificationsDateFetchOptions \| undefined | Promise<AcNotificationsResponse> | Fetches notifications from the server. |
| _processNotifications       | notificationsResponse: AcNotificationsResponse | void | Processes the fetched notifications.                                        |
| _userChanged                |                             | Promise<void> | Handles changes to the `user` property.                                     |
| _loggedInUserChanged        |                             | void        | Handles changes to the `loggedInUser` property.                             |
| cancelTimer                 |                             | void        | Cancels the notification fetch timer.                                       |
| _notificationType           | notification: AcNotificationData, type: string | Boolean | Checks if the notification is of a certain type.                            |
| _startTimer                 |                             | void        | Starts the notification fetch timer.                                        |
| _sendReloadPointsEvents     | notifications: Array<AcNotificationData> | void | Sends events to reload points for posts.                                    |
| _loadNewNotificationsResponse | notificationsResponse: AcNotificationsResponse | void | Processes new notifications response.                                       |
| _removeOldIfExists          | notification: AcNotificationData | void | Removes old notifications if they exist in the current list.                |
| _getNotificationText        | notification: AcNotificationData | String | Returns the text for a notification.                                        |
| _displayToast               | notifications: Array<AcNotificationData> | void | Displays a toast message for new notifications.                             |
| _finalizeAfterResponse      | notifications: Array<AcNotificationData> | void | Finalizes processing after receiving a response.                            |
| _loadMoreData               |                             | Promise<void> | Loads more notifications when the user scrolls to the end of the list.      |
| loadNewData                 |                             | Promise<void> | Loads new notifications.                                                    |

## Events (if any)

- **yp-close-notification-list**: Emitted when the user requests to close the notification list.
- **yp-set-number-of-un-viewed-notifications**: Emitted when the number of unviewed notifications is updated.
- **yp-update-points-for-post**: Emitted when points for a post need to be updated.

## Examples

```typescript
// Example usage of the AcNotificationList component
<ac-notification-list
  .notifications="${this.notifications}"
  .user="${this.user}"
  .opened="${this.opened}"
></ac-notification-list>
```

Please note that the above example assumes that `this.notifications`, `this.user`, and `this.opened` are properties available in the context where the `AcNotificationList` component is used.