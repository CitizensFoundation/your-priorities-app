# AcNotificationSelection

A custom element that allows users to select notification methods and frequencies.

## Properties

| Name       | Type                             | Description                                      |
|------------|----------------------------------|--------------------------------------------------|
| name       | string \| undefined              | The name of the notification setting.            |
| setting    | AcNotificationSettingsDataItem   | The current notification settings data item.     |
| frequency  | number \| undefined              | The selected frequency for notifications.        |
| method     | number \| undefined              | The selected method for notifications.           |

## Methods

| Name                | Parameters                  | Return Type | Description                                                                 |
|---------------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| updated             | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method called after the element’s properties have been updated.   |
| render              | -                           | unknown     | Renders the element's HTML template.                                        |
| _methodChanged      | event: CustomEvent          | void        | Handles changes to the notification method and emits an event.              |
| _frequencyChanged   | event: CustomEvent          | void        | Handles changes to the notification frequency and emits an event.           |
| _settingChanged     | -                           | void        | Updates the component state when the setting property changes.              |
| _isDelayed          | item: AcNotificationSettingMethod | boolean    | Determines if a notification method should be delayed.                      |
| availableMethods    | -                           | Array<AcNotificationSettingMethod> | Returns the available notification methods based on the current language. |
| availableFrequencies| -                           | Array<AcNotificationSettingFrequency> | Returns the available notification frequencies based on the current method and language. |

## Events

- **yp-notification-changed**: Emitted when the notification method or frequency is changed.

## Examples

```typescript
// Example usage of the AcNotificationSelection custom element
<ac-notification-selection
  .name="${'New Message'}"
  .setting="${{ method: 1, frequency: 0 }}"
></ac-notification-selection>
```

Please note that the actual usage may vary depending on the context within which the element is used, including how the `setting` property is provided and managed.