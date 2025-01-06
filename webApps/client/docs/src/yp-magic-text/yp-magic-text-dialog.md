# YpMagicTextDialog

`YpMagicTextDialog` is a custom web component that extends the `YpMagicText` class. It provides a dialog interface for displaying and interacting with text content.

## Properties

| Name                     | Type      | Description                                                                 |
|--------------------------|-----------|-----------------------------------------------------------------------------|
| content                  | string    | The main content to be displayed in the dialog.                             |
| contentId                | number    | Identifier for the content.                                                 |
| extraId                  | number    | Additional identifier for extra content.                                    |
| additionalId             | number    | Another identifier for additional content.                                  |
| textType                 | string    | The type of text being displayed.                                           |
| contentLanguage          | string    | The language of the content.                                                |
| closeDialogText          | string    | The text to display on the button used to close the dialog.                 |
| structuredQuestionsConfig| string    | Configuration for structured questions related to the content.              |
| skipSanitize             | boolean   | Flag to determine if content sanitization should be skipped.                |
| disableTranslation       | boolean   | Flag to disable translation of the content.                                 |

## Methods

| Name                | Parameters                                                                                                                                                                                                 | Return Type | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| open                | content: string, contentId: number, extraId: number, additionalId: number, textType: string, contentLanguage: string, closeDialogText: string, structuredQuestionsConfig: string, skipSanitize = false, disableTranslation = false | Promise<void> | Opens the dialog with the specified content and configuration.              |
| _onKeyDown          | event: KeyboardEvent                                                                                                                                                                                       | void        | Handles the keydown event to close the dialog when the Escape key is pressed. |
| subClassProcessing  | None                                                                                                                                                                                                      | void        | Processes the content by replacing newline characters with `<br />` tags.   |

## Examples

```typescript
// Example usage of the YpMagicTextDialog component
const dialog = document.createElement('yp-magic-text-dialog');
document.body.appendChild(dialog);

dialog.open(
  "Sample content",
  1,
  2,
  3,
  "text",
  "en",
  "Close",
  "{}",
  false,
  false
);
```