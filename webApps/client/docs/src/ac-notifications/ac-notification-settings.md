# AcNotificationSettings

`AcNotificationSettings` is a custom web component that extends `YpBaseElement` to manage and display notification settings for a user. It uses `ac-notification-selection` components to render individual notification settings.

## Properties

| Name                 | Type                           | Description                                      |
|----------------------|--------------------------------|--------------------------------------------------|
| notificationsSettings| AcNotificationSettingsData     | Holds the notification settings for the user.    |

## Methods

| Name                | Parameters | Return Type | Description                                      |
|---------------------|------------|-------------|--------------------------------------------------|
| render              |            | TemplateResult | Generates a template for the component.         |
| connectedCallback   |            | void        | Lifecycle method called when the component is added to the DOM. It sets up event listeners. |
| disconnectedCallback|            | void        | Lifecycle method called when the component is removed from the DOM. It removes event listeners. |
| _settingsChanged    |            | void        | Handles changes to the notification settings and emits an event. |

## Events

- **yp-notification-changed**: Emitted when a notification setting is changed.
- **yp-notifications-changed**: Emitted when the notification settings have been updated.

## Examples

```typescript
// Example usage of the AcNotificationSettings web component
<ac-notification-settings .notificationsSettings=${yourSettingsObject}></ac-notification-settings>
```

Please note that `AcNotificationSettingsData` type was referenced but not defined in the provided code. You should define this type in your TypeScript codebase to match the structure of the `notificationsSettings` property.