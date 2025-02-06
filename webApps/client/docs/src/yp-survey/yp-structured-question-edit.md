# YpStructuredQuestionEdit

A custom web component for editing structured questions, providing various input types such as text fields, text areas, checkboxes, radio buttons, and dropdowns.

## Properties

| Name                   | Type                                      | Description                                                                 |
|------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| question               | YpStructuredQuestionData                  | The data for the structured question being edited.                          |
| index                  | number \| undefined                       | The index of the question in the form.                                      |
| hideQuestionIndex      | boolean                                   | Whether to hide the question index.                                         |
| formName               | string \| undefined                       | The name of the form.                                                       |
| dontFocusFirstQuestion | boolean                                   | Whether to prevent focusing on the first question automatically.            |
| useSmallFont           | boolean                                   | Whether to use a smaller font size for the question text.                   |
| longFocus              | boolean                                   | Whether the question has long focus.                                        |
| isLastRating           | boolean                                   | Whether the question is the last rating question.                           |
| isFirstRating          | boolean                                   | Whether the question is the first rating question.                          |
| isFromNewPost          | boolean                                   | Whether the question is from a new post.                                    |
| structuredAnswers      | Array<YpStructuredAnswer> \| undefined    | The structured answers associated with the question.                        |
| debounceTimeMs         | number                                    | The debounce time in milliseconds for change events.                        |
| disabled               | boolean                                   | Whether the question inputs are disabled.                                   |
| radioKeypress          | boolean                                   | Whether a radio button keypress event has occurred.                         |
| debunceChangeEventTimer| ReturnType<typeof setTimeout> \| undefined| Timer for debouncing change events.                                         |

## Methods

| Name                        | Parameters                          | Return Type | Description                                                                 |
|-----------------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| updated                     | changedProperties: Map<string \| number \| symbol, unknown> | void        | Called when the element's properties have changed.                          |
| get value                   |                                     | any         | Gets the current value of the question.                                     |
| set value                   | value: any                          | void        | Sets the value of the question.                                             |
| setAnswerAfterUpdate        | value: any                          | Promise<void> | Sets the answer after the component has updated.                            |
| renderTextField             | skipLabel: boolean = false          | TemplateResult | Renders a text field for the question.                                      |
| renderTextFieldLong         |                                     | TemplateResult | Renders a long text field for the question.                                 |
| renderTextArea              | skipLabel: boolean = false          | TemplateResult | Renders a text area for the question.                                       |
| renderTextAreaLong          |                                     | TemplateResult | Renders a long text area for the question.                                  |
| renderTextHeader            |                                     | TemplateResult | Renders a text header for the question.                                     |
| renderTextDescription       |                                     | TemplateResult | Renders a text description for the question.                                |
| renderSeperator             |                                     | TemplateResult | Renders a separator line.                                                   |
| renderRadioButton           | radioButton: YpRadioButtonData, buttonIndex: number | TemplateResult | Renders a radio button for the question.                                    |
| renderRadios                |                                     | TemplateResult | Renders a group of radio buttons for the question.                          |
| renderCheckbox              | text: string, buttonIndex: number, useTopLevelId: boolean = false | TemplateResult | Renders a checkbox for the question.                                        |
| renderCheckboxes            |                                     | TemplateResult | Renders a group of checkboxes for the question.                             |
| renderDropdown              |                                     | TemplateResult | Renders a dropdown for the question.                                        |
| _dropDownChanged            |                                     | void        | Handles changes to the dropdown selection.                                  |
| render                      |                                     | TemplateResult | Renders the question based on its type.                                     |
| setLongUnFocus              |                                     | void        | Sets the long focus state to false.                                         |
| setLongFocus                |                                     | void        | Sets the long focus state to true.                                          |
| get isNumberSubType         |                                     | boolean     | Checks if the question's subtype is number.                                 |
| _keyPressed                 | event: KeyboardEvent                | void        | Handles keypress events for the question.                                   |
| setRadioEventType           |                                     | void        | Sets the radio keypress event type.                                         |
| _sendDebouncedChange        | event: CustomEvent                  | void        | Sends a debounced change event.                                             |
| _debounceChangeEvent        | event: any                          | void        | Debounces change events.                                                    |
| get textWithIndex           |                                     | string      | Gets the question text with its index.                                      |
| _getRadioClass              |                                     | string      | Gets the CSS class for the radio button group.                              |
| get textWithLinks           |                                     | string      | Gets the question text with links converted to HTML.                        |
| _resizeScrollerIfNeeded     |                                     | void        | Resizes the scroller if needed.                                             |
| checkValidity               |                                     | boolean     | Checks the validity of the question's input.                                |
| get isInputField            |                                     | boolean     | Checks if the question is an input field type.                              |
| focus                       |                                     | void        | Focuses the question's input field.                                         |
| cleanValue                  | value: string                       | string      | Cleans the input value by removing commas and colons.                       |
| checkRadioButtonValidity    |                                     | boolean     | Checks the validity of the radio button selection.                          |
| getAnswer                   | suppressNotFoundError: boolean = false | YpStructuredAnswer \| undefined | Gets the answer for the question.                                            |
| setAnswer                   | value: string                       | void        | Sets the answer for the question.                                           |
| hide                        |                                     | void        | Hides the question.                                                         |
| show                        |                                     | void        | Shows the question.                                                         |
| _checkboxChanged            | event: CustomEvent                  | void        | Handles changes to the checkbox selection.                                  |
| _radioChanged               | event: CustomEvent                  | void        | Handles changes to the radio button selection.                              |
| _structuredAnsweredChanged  |                                     | void        | Handles changes to the structured answers.                                  |
| connectedCallback           |                                     | void        | Called when the element is added to the document.                           |

## Events

- **yp-goto-next-index**: Emitted when the user presses enter on a question input to navigate to the next question.
- **yp-answer-content-changed**: Emitted when the content of an answer changes.
- **yp-answer-content-changed-debounced**: Emitted when the content of an answer changes with debounce.
- **resize-scroller**: Emitted to resize the scroller if needed.
- **yp-skip-to-unique-id**: Emitted to skip to a specific unique ID based on radio button selection.
- **yp-open-to-unique-id**: Emitted to open to a specific unique ID based on radio button selection.

## Examples

```typescript
// Example usage of the web component
const questionEdit = document.createElement('yp-structured-question-edit');
questionEdit.question = {
  text: "What is your favorite color?",
  type: "radios",
  radioButtons: [
    { text: "Red" },
    { text: "Blue" },
    { text: "Green" }
  ]
};
document.body.appendChild(questionEdit);
```