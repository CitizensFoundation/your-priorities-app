# YpAutoTranslateDialog

A custom element that provides a dialog interface for auto-translation settings, allowing users to choose whether to auto-translate, not to ask again, or always auto-translate.

## Properties

| Name             | Type   | Description                                      |
|------------------|--------|--------------------------------------------------|
| confirmationText | string | Optional text to display for confirmation prompt.|

## Methods

| Name                            | Parameters | Return Type | Description                                                                 |
|---------------------------------|------------|-------------|-----------------------------------------------------------------------------|
| _no                             |            | void        | Sets a session storage item to prevent prompting for auto translation.      |
| _dontAskAgain                   |            | void        | Sets a local storage item to prevent prompting for auto translation.        |
| _startAutoTranslateAndDoSoAlways|            | void        | Starts auto translation and sets a local storage item to always do so.      |
| _startAutoTranslate             |            | void        | Initiates the auto translation process.                                     |
| openLaterIfAutoTranslationEnabled|            | void        | Opens the dialog after a delay if auto translation is enabled and not active.|

## Events

- **None**: This component does not emit any custom events.

## Examples

```typescript
// Example usage of the YpAutoTranslateDialog
const autoTranslateDialog = document.createElement('yp-autotranslate-dialog');
document.body.appendChild(autoTranslateDialog);

// To open the dialog later if auto translation is enabled
autoTranslateDialog.openLaterIfAutoTranslationEnabled();
```

Please note that the actual usage of the dialog would depend on the context in which it is used, including the surrounding logic that determines when and how the dialog should be presented to the user.