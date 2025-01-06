# YpSimpleHtmlEditor

A custom web component for a simple HTML editor with rich text formatting capabilities.

## Properties

| Name                  | Type                          | Description                                                                 |
|-----------------------|-------------------------------|-----------------------------------------------------------------------------|
| question              | YpStructuredQuestionData      | The structured question data, including maxLength, text, and type.          |
| index                 | number \| undefined           | The index of the editor, if applicable.                                     |
| useSmallFont          | boolean                       | Determines if a smaller font should be used.                                |
| value                 | string                        | The current HTML content of the editor.                                     |
| characterCount        | number                        | The current character count of the editor's content.                        |
| hasFocus              | boolean                       | Indicates if the editor currently has focus.                                |
| allowFirefoxFocusHack | boolean                       | Allows a focus hack for Firefox browsers.                                   |
| showErrorLine         | boolean                       | Indicates if an error line should be shown.                                 |
| selectedImage         | HTMLImageElement \| undefined | The currently selected image element for editing.                           |

## Methods

| Name                   | Parameters                                                                 | Return Type | Description                                                                 |
|------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| _onWidthInput          | event: CustomEvent                                                         | void        | Validates the width input for images.                                       |
| _onHeightInput         | event: CustomEvent                                                         | void        | Validates the height input for images.                                      |
| _onMarginInput         | event: CustomEvent                                                         | void        | Validates the margin input for images.                                      |
| closeImageDialog       | none                                                                       | void        | Closes the image resize dialog.                                             |
| applyImageSize         | none                                                                       | void        | Applies the size and margin to the selected image.                          |
| selectImage            | image: HTMLImageElement                                                    | void        | Selects an image for editing and opens the dialog.                          |
| renderImageEditDialog  | none                                                                       | TemplateResult \| typeof nothing | Renders the image edit dialog if an image is selected.                      |
| render                 | none                                                                       | TemplateResult | Renders the HTML editor and its controls.                                   |
| deselectImage          | none                                                                       | void        | Deselects the currently selected image.                                     |
| _setFocus              | none                                                                       | void        | Sets the focus state and applies a Firefox-specific focus hack if needed.   |
| connectedCallback      | none                                                                       | void        | Lifecycle method called when the element is added to the document.          |
| update                 | changedProperties: PropertyValueMap<any> \| Map<PropertyKey, unknown>      | void        | Updates the component when properties change.                               |
| firstUpdated           | _changedProperties: PropertyValueMap<any> \| Map<PropertyKey, unknown>     | void        | Lifecycle method called after the first update.                             |
| _setBlur               | event: CustomEvent                                                         | void        | Sets the blur state of the editor.                                          |
| setRichValue           | value: string                                                              | void        | Sets the HTML content of the editor.                                        |
| _updateCharacterCounter| none                                                                       | void        | Updates the character count based on the editor's content.                  |
| _keydown               | event: KeyboardEvent                                                       | void        | Handles keydown events for character counting and max length enforcement.   |
| _paste                 | event: ClipboardEvent \| CustomEvent                                       | void        | Handles paste events, enforcing max length if applicable.                   |
| _changed               | none                                                                       | void        | Updates the value and character count when the content changes.             |
| validate               | none                                                                       | boolean     | Validates the editor's content based on the question's requirements.        |
| _isSafariOrIe11        | none                                                                       | boolean     | Checks if the browser is Safari or Internet Explorer 11.                    |
| _isFirefox             | none                                                                       | boolean     | Checks if the browser is Firefox.                                           |
| _clearFormat           | none                                                                       | void        | Clears formatting from the selected text.                                   |
| _toggleH1              | none                                                                       | void        | Toggles the selected text to a heading level 1.                             |
| _toggleH2              | none                                                                       | void        | Toggles the selected text to a heading level 2.                             |
| _toggleH3              | none                                                                       | void        | Toggles the selected text to a heading level 3.                             |
| _toggleH4              | none                                                                       | void        | Toggles the selected text to a heading level 4.                             |
| _toggleH5              | none                                                                       | void        | Toggles the selected text to a heading level 5.                             |
| _toggleH6              | none                                                                       | void        | Toggles the selected text to a heading level 6.                             |
| _toggleP               | none                                                                       | void        | Toggles the selected text to a paragraph.                                   |
| _toggleAlignLeft       | none                                                                       | void        | Aligns the selected text to the left.                                       |
| _toggleAlignRight      | none                                                                       | void        | Aligns the selected text to the right.                                      |
| _toggleAlignCenter     | none                                                                       | void        | Centers the selected text.                                                  |
| _toggleAlignJustify    | none                                                                       | void        | Justifies the selected text.                                                |
| _toggleBold            | none                                                                       | void        | Toggles bold formatting on the selected text.                               |
| _toggleItalic          | none                                                                       | void        | Toggles italic formatting on the selected text.                             |
| _toggleUnderline       | none                                                                       | void        | Toggles underline formatting on the selected text.                          |
| _toggleListBullets     | none                                                                       | void        | Toggles a bulleted list on the selected text.                               |
| _toggleListNumbers     | none                                                                       | void        | Toggles a numbered list on the selected text.                               |
| _masterCommand         | commandName: string, showDefaultUI?: boolean, value?: string               | void        | Executes a document command for rich text editing.                          |

## Examples

```typescript
// Example usage of the YpSimpleHtmlEditor component
import './path/to/yp-simple-html-editor.js';

const editor = document.createElement('yp-simple-html-editor');
document.body.appendChild(editor);

editor.question = { maxLength: 500, text: "Edit your content", type: "html" };
editor.value = "<p>Initial content</p>";
```