# AcNotificationToast

`AcNotificationToast` is a custom web component that extends the `Snackbar` component from `@material/mwc-snackbar`. It is designed to display notifications with optional user information, an icon, and customizable text size.

## Properties

| Name             | Type                  | Description                                      |
|------------------|-----------------------|--------------------------------------------------|
| notificationText | String                | The text to be displayed in the notification.    |
| user             | YpUserData \| undefined | Optional user data to display in the notification. |
| icon             | String \| undefined   | Optional icon to display in the notification.    |
| largerFont       | Boolean               | Whether to use a larger font size for the text.  |

## Methods

| Name       | Parameters                                                                                   | Return Type | Description                                                                                   |
|------------|----------------------------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------------------------|
| openDialog | user: YpUserData \| undefined, notificationText: String, systemNotification: Boolean, icon: String \| undefined, timeoutMs: Number \| undefined, largerFont: Boolean \| undefined | void        | Opens the notification dialog with the provided parameters, displaying the notification toast. |

## Events

- **keydown**: Emitted when a keydown event occurs on the component.
- **click**: Emitted when the action or dismiss slots are clicked.

## Examples

```typescript
// Example usage of AcNotificationToast
const notificationToast = document.createElement('ac-notification-toast');
notificationToast.openDialog(
  userData, // YpUserData or undefined
  'Notification text here',
  false, // systemNotification
  'info', // icon (optional)
  5000, // timeoutMs (optional)
  true // largerFont (optional)
);
document.body.appendChild(notificationToast);
```

Please note that the `YpUserData` type is not defined in the provided code snippet and should be defined elsewhere in your codebase.