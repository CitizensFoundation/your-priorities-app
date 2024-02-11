# YpMagicTextDialog

`YpMagicTextDialog` is a custom web component that extends `YpMagicText` to display text content within a dialog. It uses Material Design components for the dialog and buttons.

## Properties

| Name                      | Type      | Description                                           |
|---------------------------|-----------|-------------------------------------------------------|
| content                   | `string`  | The text content to be displayed in the dialog.       |
| contentId                 | `number`  | An identifier for the content.                        |
| extraId                   | `number`  | An additional identifier related to the content.      |
| additionalId              | `number`  | Another identifier used in conjunction with content.  |
| textType                  | `string`  | The type of text content being displayed.             |
| contentLanguage           | `string`  | The language of the text content.                     |
| closeDialogText           | `string`  | The text for the close button of the dialog.          |
| structuredQuestionsConfig | `string`  | Configuration for structured questions.               |
| skipSanitize              | `boolean` | Whether to skip sanitization of the content.          |
| disableTranslation        | `boolean` | Whether to disable translation of the content.        |
| isDialog                  | `boolean` | Indicates if the current component is a dialog.       |
| processedContent          | `string`  | The processed content with certain transformations.   |

## Methods

| Name   | Parameters                                                                                                      | Return Type | Description                                                                                   |
|--------|-----------------------------------------------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------------------------|
| open   | content: `string`, contentId: `number`, extraId: `number`, additionalId: `number`, textType: `string`, contentLanguage: `string`, closeDialogText: `string`, structuredQuestionsConfig: `string`, skipSanitize: `boolean`, disableTranslation: `boolean` | `void`      | Opens the dialog with the provided parameters, setting up the content and configuration.      |
| render | -                                                                                                               | `TemplateResult` | Generates the HTML template for the dialog, including the content and close button.           |
| subClassProcessing | -                                                                                                               | `void`      | Processes the content, replacing newline characters with HTML line breaks (`<br />`).         |

## Events

- **iron-resize**: Emitted after the dialog is opened and a resize is triggered.

## Examples

```typescript
// Example usage of the YpMagicTextDialog component
const dialog = document.createElement('yp-magic-text-dialog');
dialog.open(
  'Sample content for the dialog.',
  123,
  456,
  789,
  'info',
  'en',
  'Close',
  '{}',
  false,
  false
);
document.body.appendChild(dialog);
```