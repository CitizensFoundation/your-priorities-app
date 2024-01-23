# YpAutoTranslateDialog

This class represents a dialog component for auto-translation functionality. It extends `YpBaseElement` and uses Material Web components to create a dialog that prompts the user to choose whether to auto-translate content or not.

## Properties

| Name             | Type   | Description                                      |
|------------------|--------|--------------------------------------------------|
| confirmationText | string \| undefined | Optional text for confirmation. |

## Methods

| Name                             | Parameters | Return Type | Description                                                                 |
|----------------------------------|------------|-------------|-----------------------------------------------------------------------------|
| _no                              |            | void        | Sets a session storage item to prevent auto-translation prompt.             |
| _dontAskAgain                    |            | void        | Sets a local storage item to prevent auto-translation prompt permanently.   |
| _startAutoTranslateAndDoSoAlways |            | void        | Starts auto-translation and sets a local storage item to always do so.      |
| _startAutoTranslate              |            | void        | Initiates the auto-translation process.                                     |
| openLaterIfAutoTranslationEnabled|            | void        | Opens the dialog after a delay if auto-translation is enabled and not active.|

## Events

- **No events are emitted by this class.**

## Examples

```typescript
// Example usage of the YpAutoTranslateDialog component
const autoTranslateDialog = document.createElement('yp-autotranslate-dialog');
document.body.appendChild(autoTranslateDialog);

// To open the dialog later if auto-translation is enabled
autoTranslateDialog.openLaterIfAutoTranslationEnabled();
```

Please note that the actual usage of the dialog would depend on the context in which it is used, including the surrounding logic that determines when and how the dialog should be presented to the user.