# YpStructuredQuestionEdit

A custom web component for editing structured questions, providing various input types such as text fields, text areas, checkboxes, radio buttons, and dropdowns. It supports rich text editing, validation, and dynamic rendering based on question properties.

## Properties

| Name                   | Type                                      | Description                                                                 |
|------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| question               | YpStructuredQuestionData                  | The structured question data to be rendered and edited.                     |
| index                  | number \| undefined                       | The index of the question in the form.                                      |
| hideQuestionIndex      | boolean                                   | Whether to hide the question index in the display.                          |
| formName               | string \| undefined                       | The name of the form to which the question belongs.                         |
| dontFocusFirstQuestion | boolean                                   | Whether to prevent focusing on the first question automatically.            |
| useSmallFont           | boolean                                   | Whether to use a smaller font size for the question text.                   |
| longFocus              | boolean                                   | Whether the question has long focus.                                        |
| isLastRating           | boolean                                   | Whether the question is the last in a series of rating questions.           |
| isFirstRating          | boolean                                   | Whether the question is the first in a series of rating questions.          |
| isFromNewPost          | boolean                                   | Whether the question is from a new post.                                    |
| structuredAnswers      | Array<YpStructuredAnswer> \| undefined    | The structured answers associated with the question.                        |
| debounceTimeMs         | number                                    | The debounce time in milliseconds for change events. Default is 2000ms.     |
| disabled               | boolean                                   | Whether the question inputs are disabled.                                   |

## Methods

| Name                        | Parameters                          | Return Type | Description                                                                 |
|-----------------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| updated                     | changedProperties: Map<string \| number \| symbol, unknown> | void        | Called when the element's properties change.                                |
| get value                   |                                     | any         | Gets the current value of the question.                                     |
| set value                   | value: any                          | void        | Sets the value of the question and updates the UI.                          |
| setAnswerAfterUpdate        | value: any                          | Promise<void> | Sets the answer after the component has updated.                            |
| renderTextField             | skipLabel: boolean = false          | TemplateResult | Renders a text field input.                                                 |
| renderTextFieldLong         |                                     | TemplateResult | Renders a long text field input.                                            |
| renderTextArea              | skipLabel: boolean = false          | TemplateResult | Renders a text area input.                                                  |
| renderTextAreaLong          |                                     | TemplateResult | Renders a long text area input.                                             |
| renderTextHeader            |                                     | TemplateResult | Renders a text header.                                                      |
| renderTextDescription       |                                     | TemplateResult | Renders a text description.                                                 |
| renderSeperator             |                                     | TemplateResult | Renders a separator line.                                                   |
| renderRadioButton           | radioButton: YpRadioButtonData, buttonIndex: number | TemplateResult | Renders a radio button.                                                     |
| renderRadios                |                                     | TemplateResult | Renders a group of radio buttons.                                           |
| renderCheckbox              | text: string, buttonIndex: number, useTopLevelId: boolean = false | TemplateResult | Renders a checkbox.                                                         |
| renderCheckboxes            |                                     | TemplateResult | Renders a group of checkboxes.                                              |
| renderDropdown              |                                     | TemplateResult | Renders a dropdown select input.                                            |
| _dropDownChanged            |                                     | void        | Handles changes in the dropdown selection.                                  |
| render                      |                                     | TemplateResult | Renders the question based on its type.                                     |
| setLongUnFocus              |                                     | void        | Sets the long focus state to false.                                         |
| setLongFocus                |                                     | void        | Sets the long focus state to true.                                          |
| isNumberSubType             |                                     | boolean     | Checks if the question subtype is number.                                   |
| _keyPressed                 | event: KeyboardEvent                | void        | Handles key press events for navigation.                                    |
| setRadioEventType           |                                     | void        | Sets the radio keypress event type.                                         |
| _sendDebouncedChange        | event: CustomEvent                  | void        | Sends a debounced change event.                                             |
| _debounceChangeEvent        | event: any                          | void        | Debounces change events.                                                    |
| textWithIndex               |                                     | string      | Gets the question text with its index.                                      |
| _getRadioClass              |                                     | string      | Gets the CSS class for radio button groups.                                 |
| textWithLinks               |                                     | string      | Converts question text to include HTML links.                               |
| _resizeScrollerIfNeeded     |                                     | void        | Fires an event to resize the scroller if needed.                            |
| checkValidity               |                                     | boolean     | Checks the validity of the question input.                                  |
| isInputField                |                                     | boolean     | Checks if the question is an input field type.                              |
| focus                       |                                     | void        | Focuses on the question input.                                              |
| cleanValue                  | value: string                       | string      | Cleans the input value by removing certain characters.                      |
| checkRadioButtonValidity    |                                     | boolean     | Checks the validity of radio button selections.                             |
| getAnswer                   | suppressNotFoundError: boolean = false | YpStructuredAnswer \| undefined | Gets the current answer for the question.                                    |
| setAnswer                   | value: string                       | void        | Sets the answer for the question.                                           |
| hide                        |                                     | void        | Hides the question.                                                         |
| show                        |                                     | void        | Shows the question.                                                         |
| _checkboxChanged            | event: CustomEvent                  | void        | Handles changes in checkbox selections.                                     |
| _radioChanged               | event: CustomEvent                  | void        | Handles changes in radio button selections.                                 |
| _structuredAnsweredChanged  |                                     | void        | Updates the UI when structured answers change.                              |
| connectedCallback           |                                     | void        | Lifecycle method called when the element is added to the document.          |

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
  ],
  uniqueId: "colorQuestion"
};
document.body.appendChild(questionEdit);
```