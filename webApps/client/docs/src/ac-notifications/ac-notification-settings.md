# AcNotificationSettings

The `AcNotificationSettings` class is a custom web component that extends `YpBaseElement`. It is used to manage and display notification settings for various types of notifications.

## Properties

| Name                  | Type                        | Description                                      |
|-----------------------|-----------------------------|--------------------------------------------------|
| notificationsSettings | AcNotificationSettingsData  | The data object containing notification settings.|

## Methods

| Name                  | Parameters | Return Type | Description                                                                 |
|-----------------------|------------|-------------|-----------------------------------------------------------------------------|
| render                | None       | TemplateResult | Renders the notification settings using the `ac-notification-selection` component. |
| connectedCallback     | None       | void        | Lifecycle method called when the element is added to the document. Adds an event listener for notification changes. |
| disconnectedCallback  | None       | void        | Lifecycle method called when the element is removed from the document. Removes the event listener for notification changes. |
| _settingsChanged      | None       | void        | Internal method that fires a custom event when notification settings change. |

## Events

- **yp-notifications-changed**: Emitted when the notification settings are changed.

## Examples

```typescript
// Example usage of the AcNotificationSettings component
import './ac-notification-settings.js';

const notificationSettingsElement = document.createElement('ac-notification-settings');
notificationSettingsElement.notificationsSettings = {
  my_posts: true,
  my_posts_endorsements: false,
  my_points: true,
  my_points_endorsements: false,
  all_community: true,
  all_group: false
};

document.body.appendChild(notificationSettingsElement);
```