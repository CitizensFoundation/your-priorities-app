# YpMagicTextDialog

`YpMagicTextDialog` is a custom web component that extends `YpMagicText` to display text content within a dialog. It uses Material Design components and `lit` library features to render a dialog with text content that can be styled and processed.

## Properties

| Name                     | Type      | Description                                           |
|--------------------------|-----------|-------------------------------------------------------|
| skipSanitize             | boolean   | If true, skips sanitization of the content.           |
| isDialog                 | boolean   | Indicates if the component is being used as a dialog. |
| content                  | string    | The text content to be displayed in the dialog.       |
| contentId                | number    | Identifier for the content.                           |
| extraId                  | number    | Additional identifier used in processing content.     |
| textType                 | string    | Type of the text content.                             |
| contentLanguage          | string    | Language of the text content.                         |
| structuredQuestionsConfig| string    | Configuration for structured questions.               |
| closeDialogText          | string    | Text for the close button in the dialog.              |
| disableTranslation       | boolean   | If true, disables translation of the content.         |
| processedContent         | string    | Processed content with certain transformations.       |

## Methods

| Name   | Parameters                                                                                                      | Return Type | Description                                                                                   |
|--------|-----------------------------------------------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------------------------|
| open   | content: string, contentId: number, extraId: number, textType: string, contentLanguage: string, closeDialogText: string, structuredQuestionsConfig: string, skipSanitize: boolean, disableTranslation: boolean | void        | Opens the dialog with the provided content and configuration, and applies necessary processing. |

## Events

- **iron-resize**: Emitted after the dialog is opened and a resize is required.

## Examples

```typescript
// Example usage of the YpMagicTextDialog component
const dialog = document.createElement('yp-magic-text-dialog');
dialog.open(
  'Sample content',
  1,
  2,
  'info',
  'en',
  'Close',
  '{}',
  false,
  false
);
document.body.appendChild(dialog);
```

Note: The `open` method includes a `setTimeout` call with a TODO comment, indicating that there is an intention to fire an event or perform an action after a delay, but the specifics are not provided in the code snippet.