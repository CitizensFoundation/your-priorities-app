# YpSimpleHtmlEditor

A simple HTML editor web component that extends `YpBaseElement` to provide rich text editing capabilities.

## Properties

| Name                   | Type                        | Description                                                                 |
|------------------------|-----------------------------|-----------------------------------------------------------------------------|
| question               | YpStructuredQuestionData    | The structured question data object.                                        |
| index                  | number \| undefined         | The index of the editor instance, if applicable.                            |
| useSmallFont           | boolean                     | Determines if the editor should use a smaller font size.                    |
| value                  | string                      | The current HTML content of the editor.                                     |
| characterCount         | number                      | The current character count of the editor's content.                        |
| hasFocus               | boolean                     | Indicates whether the editor currently has focus.                           |
| allowFirefoxFocusHack  | boolean                     | Allows a focus hack for Firefox to work around a specific issue.            |
| showErrorLine          | boolean                     | Determines if an error line should be shown, typically for validation.      |

## Methods

| Name                   | Parameters                  | Return Type | Description                                                                 |
|------------------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| _setFocus              |                             | void        | Sets the focus state to true and applies a focus hack for Firefox if needed.|
| _setBlur               | event: CustomEvent          | void        | Sets the focus state to false.                                              |
| setRichValue           | value: string               | void        | Sets the rich text value of the editor.                                     |
| _updateCharacterCounter|                             | void        | Updates the character count based on the editor's content.                  |
| _keydown               | event: KeyboardEvent        | void        | Handles keydown events for character count and input restrictions.          |
| _paste                 | event: ClipboardEvent \| CustomEvent | void | Handles paste events with character count restrictions.                    |
| _changed               |                             | void        | Updates the value and character count after content changes.                |
| validate               |                             | boolean     | Validates the editor's content based on the question requirements.          |
| _isSafariOrIe11        |                             | boolean     | Checks if the browser is Safari or Internet Explorer 11.                    |
| _isFirefox             |                             | boolean     | Checks if the browser is Firefox.                                           |
| _clearFormat           |                             | void        | Clears formatting from the selected text.                                   |
| _clearFormatM          |                             | void        | Clears formatting on Safari or IE11.                                        |
| _toggleH1              |                             | void        | Toggles H1 formatting on the selected text.                                 |
| _toggleH1M             |                             | void        | Toggles H1 formatting on Safari or IE11.                                    |
| _toggleH2              |                             | void        | Toggles H2 formatting on the selected text.                                 |
| _toggleH2M             |                             | void        | Toggles H2 formatting on Safari or IE11.                                    |
| _toggleH3              |                             | void        | Toggles H3 formatting on the selected text.                                 |
| _toggleH3M             |                             | void        | Toggles H3 formatting on Safari or IE11.                                    |
| _toggleH4              |                             | void        | Toggles H4 formatting on the selected text.                                 |
| _toggleH4M             |                             | void        | Toggles H4 formatting on Safari or IE11.                                    |
| _toggleH5              |                             | void        | Toggles H5 formatting on the selected text.                                 |
| _toggleH5M             |                             | void        | Toggles H5 formatting on Safari or IE11.                                    |
| _toggleH6              |                             | void        | Toggles H6 formatting on the selected text.                                 |
| _toggleH6M             |                             | void        | Toggles H6 formatting on Safari or IE11.                                    |
| _toggleP               |                             | void        | Toggles paragraph formatting on the selected text.                          |
| _togglePM              |                             | void        | Toggles paragraph formatting on Safari or IE11.                             |
| _toggleAlignLeft       |                             | void        | Aligns the selected text to the left.                                       |
| _toggleAlignLeftM      |                             | void        | Aligns text to the left on Safari or IE11.                                  |
| _toggleAlignRight      |                             | void        | Aligns the selected text to the right.                                      |
| _toggleAlignRightM     |                             | void        | Aligns text to the right on Safari or IE11.                                 |
| _toggleAlignCenter     |                             | void        | Centers the selected text.                                                  |
| _toggleAlignCenterM    |                             | void        | Centers text on Safari or IE11.                                             |
| _toggleAlignJustify    |                             | void        | Justifies the selected text.                                                |
| _toggleAlignJustifyM   |                             | void        | Justifies text on Safari or IE11.                                           |
| _toggleBold            |                             | void        | Toggles bold formatting on the selected text.                               |
| _toggleBoldM           |                             | void        | Toggles bold formatting on Safari or IE11.                                  |
| _toggleItalic          |                             | void        | Toggles italic formatting on the selected text.                             |
| _toggleItalicM         |                             | void        | Toggles italic formatting on Safari or IE11.                                |
| _toggleUnderline       |                             | void        | Toggles underline formatting on the selected text.                          |
| _toggleUnderlineM      |                             | void        | Toggles underline formatting on Safari or IE11.                             |
| _toggleListBullets     |                             | void        | Toggles bullet list formatting on the selected text.                        |
| _toggleListBulletsM    |                             | void        | Toggles bullet list formatting on Safari or IE11.                           |
| _toggleListNumbers     |                             | void        | Toggles numbered list formatting on the selected text.                      |
| _toggleListNumbersM    |                             | void        | Toggles numbered list formatting on Safari or IE11.                         |
| _masterCommand         | commandName: string, showDefaultUI: boolean = false, value: string = "" | void | Executes a document command for formatting. |

## Examples

```typescript
// Example usage of the web component
const editor = document.createElement('yp-simple-html-editor');
editor.question = {
  // ... structured question data
};
editor.index = 1;
editor.useSmallFont = false;
document.body.appendChild(editor);

// Set the value of the editor
editor.setRichValue('<p>Hello, world!</p>');

// Validate the editor content
const isValid = editor.validate();
console.log(`Is the editor content valid? ${isValid}`);
```