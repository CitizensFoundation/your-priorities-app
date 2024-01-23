# AcNotificationList

The `AcNotificationList` class is a custom element that extends `YpBaseElementWithLogin` to display a list of notifications. It uses LitElement for rendering and includes properties for managing notifications, user data, and UI state.

## Properties

| Name                           | Type                                      | Description                                                                 |
|--------------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| notifications                  | Array<AcNotificationData> \| undefined    | An array of notification data objects.                                      |
| notificationGetTTL             | Number                                    | Time to live for getting notifications, in milliseconds.                    |
| oldestProcessedNotificationAt  | Date \| undefined                         | The date of the oldest processed notification.                              |
| latestProcessedNotificationAt  | Date \| undefined                         | The date of the latest processed notification.                              |
| url                            | String                                    | The URL endpoint for fetching notifications.                                |
| user                           | YpUserData \| undefined                   | The user data object.                                                       |
| firstReponse                   | Boolean                                   | A flag indicating if the first response has been received.                  |
| timer                          | ReturnType<typeof setTimeout> \| undefined| A timer for scheduling notification fetches.                                |
| unViewedCount                  | Number                                    | The count of unviewed notifications.                                        |
| moreToLoad                     | Boolean                                   | A flag indicating if there are more notifications to load.                  |
| opened                         | Boolean                                   | A flag indicating if the notification list is opened.                       |
| route                          | String \| undefined                       | The current route.                                                          |
| lastFetchStartedAt             | Number \| undefined                       | The timestamp when the last fetch started.                                  |

## Methods

| Name                        | Parameters                                | Return Type | Description                                                                 |
|-----------------------------|-------------------------------------------|-------------|-----------------------------------------------------------------------------|
| updated                     | changedProperties: Map                    | void        | Lifecycle callback invoked when properties change.                          |
| renderNotification          | notification: AcNotificationData          | TemplateResult \| typeof nothing | Renders a single notification based on its type. |
| render                      |                                           | TemplateResult | Renders the notification list.                                              |
| scrollEvent                 | event: { last: number }                   | void        | Handles the scroll event to load more data if needed.                       |
| notificationsLength         |                                           | Number      | Returns the length of the notifications array.                              |
| _openedChanged              |                                           | void        | Handles changes to the `opened` property.                                   |
| _getNotificationTypeAndName | theType: string \| undefined, name: string \| undefined | String | Returns a formatted string with the notification type and name. |
| _openEdit                   |                                           | void        | Opens the user edit dialog.                                                 |
| _clearScrollThreshold       |                                           | void        | Clears the scroll threshold (if needed).                                    |
| _markAllAsViewed            |                                           | void        | Marks all notifications as viewed.                                          |
| _reallyMarkAllAsViewed      |                                           | Promise<void> | Confirms and marks all notifications as viewed.                            |
| _handleUnViewedCount        | unViewedCount: number                     | void        | Updates the unviewed count property.                                        |
| markCurrentAsViewed         |                                           | void        | Marks the current notifications as viewed.                                  |
| _markAsViewed               | notifications: Array<AcNotificationData>  | void        | Marks the given notifications as viewed.                                    |
| _setAsViewed                | body: { viewedIds: Array<number> }        | Promise<void> | Sets the given notifications as viewed on the server.                      |
| _setAllLocalCurrentAsViewed |                                           | void        | Marks all local notifications as viewed.                                    |
| _newNotificationsError      | event: CustomEvent                        | void        | Handles errors when fetching new notifications.                             |
| _getNotifications           | options: AcNotificationsDateFetchOptions \| undefined | Promise<AcNotificationsResponse> | Fetches notifications from the server. |
| _processNotifications       | notificationsResponse: AcNotificationsResponse | void    | Processes the fetched notifications.                                        |
| _userChanged                |                                           | Promise<void> | Handles changes to the `user` property.                                    |
| _loggedInUserChanged        |                                           | void        | Handles changes to the `loggedInUser` property.                             |
| cancelTimer                 |                                           | void        | Cancels the notification fetch timer.                                       |
| _notificationType           | notification: AcNotificationData, type: string | Boolean | Checks if the notification is of a specific type.                          |
| _startTimer                 |                                           | void        | Starts the notification fetch timer.                                        |
| _sendReloadPointsEvents     | notifications: Array<AcNotificationData>  | void        | Sends events to reload points for posts.                                    |
| _loadNewNotificationsResponse | notificationsResponse: AcNotificationsResponse | void    | Processes new notifications response.                                       |
| _removeOldIfExists          | notification: AcNotificationData          | void        | Removes old notifications if they exist.                                    |
| _getNotificationText        | notification: AcNotificationData          | String      | Returns the text for a notification.                                        |
| _displayToast               | notifications: Array<AcNotificationData>  | void        | Displays a toast for new notifications.                                     |
| _finalizeAfterResponse      | notifications: Array<AcNotificationData>  | void        | Finalizes processing after receiving a response.                            |
| _loadMoreData               |                                           | Promise<void> | Loads more notifications.                                                  |
| loadNewData                 |                                           | Promise<void> | Loads new notifications.                                                   |

## Events (if any)

- **yp-close-notification-list**: Emitted when the close button is clicked.
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

Please note that this documentation is a high-level overview and does not include all the internal logic, helper methods, and lifecycle callbacks that may be present in the actual component.