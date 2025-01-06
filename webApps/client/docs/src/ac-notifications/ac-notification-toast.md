# AcNotificationToast

A custom notification toast component that extends `YpSnackbar` to display user notifications with optional user information and icons.

## Properties

| Name       | Type                     | Description                                                                 |
|------------|--------------------------|-----------------------------------------------------------------------------|
| user       | YpUserData \| undefined  | The user data to display in the notification, if applicable.                |
| icon       | string \| undefined      | The icon to display in the notification, if applicable.                     |
| largerFont | boolean                  | Determines if the notification text should be displayed in a larger font.   |

## Methods

| Name        | Parameters                                                                                                      | Return Type | Description                                                                                           |
|-------------|-----------------------------------------------------------------------------------------------------------------|-------------|-------------------------------------------------------------------------------------------------------|
| openDialog  | user: YpUserData \| undefined, notificationText: string, systemNotification: boolean, icon: string \| undefined, timeoutMs: number \| undefined, largerFont: boolean \| undefined | void        | Opens the notification dialog with the specified parameters, setting user data, icon, and other options. |

## Examples

```typescript
// Example usage of the AcNotificationToast component
const notificationToast = document.createElement('ac-notification-toast') as AcNotificationToast;
notificationToast.openDialog(
  { name: 'John Doe', organization: 'Example Corp' }, // user data
  'This is a notification message.',                  // notification text
  false,                                              // system notification flag
  'info',                                             // icon
  3000,                                               // timeout in milliseconds
  true                                                // larger font
);
document.body.appendChild(notificationToast);
```