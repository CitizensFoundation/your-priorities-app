# YpStructuredQuestionEdit

This class represents a custom element for editing structured questions. It extends `YpBaseElement` and provides various properties and methods to handle different types of questions such as text fields, text areas, checkboxes, radio buttons, and dropdowns.

## Properties

| Name                    | Type                                              | Description                                                                 |
|-------------------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| question                | YpStructuredQuestionData                          | The structured question data.                                               |
| index                   | number \| undefined                               | The index of the question in a list of questions.                           |
| hideQuestionIndex       | boolean                                           | Whether to hide the question index.                                         |
| formName                | string \| undefined                               | The name of the form that the question belongs to.                          |
| dontFocusFirstQuestion  | boolean                                           | Whether to prevent auto-focusing the first question.                        |
| useSmallFont            | boolean                                           | Whether to use a smaller font size for the question text.                   |
| longFocus               | boolean                                           | Whether the question has long focus.                                        |
| isLastRating            | boolean                                           | Whether the question is the last rating question.                           |
| isFirstRating           | boolean                                           | Whether the question is the first rating question.                          |
| isFromNewPost           | boolean                                           | Whether the question is from a new post.                                    |
| structuredAnswers       | Array<YpStructuredAnswer> \| undefined            | An array of structured answers.                                             |
| debounceTimeMs          | number                                            | The debounce time in milliseconds for change events.                        |
| disabled                | boolean                                           | Whether the question input is disabled.                                     |
| radioKeypress           | boolean                                           | Indicates if a keypress event occurred on a radio button.                   |
| debunceChangeEventTimer | ReturnType<typeof setTimeout> \| undefined        | Timer for debouncing change events.                                         |

## Methods

| Name                    | Parameters              | Return Type | Description                                                                 |
|-------------------------|-------------------------|-------------|-----------------------------------------------------------------------------|
| updated                 | changedProperties: Map  | void        | Lifecycle method called when properties change.                             |
| value                   |                         | any         | Getter/setter for the value of the question.                                |
| setAnswerAfterUpdate    | value: any              | Promise     | Sets the answer after the component has updated.                            |
| renderTextField         | skipLabel: boolean      | TemplateResult | Renders a text field.                                                    |
| renderTextFieldLong     |                         | TemplateResult | Renders a long text field.                                                |
| renderTextArea          | skipLabel: boolean      | TemplateResult | Renders a text area.                                                     |
| renderTextAreaLong      |                         | TemplateResult | Renders a long text area.                                                 |
| renderTextHeader        |                         | TemplateResult | Renders a text header.                                                    |
| renderTextDescription   |                         | TemplateResult | Renders a text description.                                               |
| renderSeperator         |                         | TemplateResult | Renders a separator.                                                      |
| renderRadioButton       | radioButton: YpRadioButtonData, buttonIndex: number | TemplateResult | Renders a radio button.                                                  |
| renderRadios            |                         | TemplateResult | Renders a group of radio buttons.                                         |
| renderCheckbox          | text: string, buttonIndex: number, useTopLevelId: boolean | TemplateResult | Renders a checkbox.                                                     |
| renderCheckboxes        |                         | TemplateResult | Renders a group of checkboxes.                                            |
| renderDropdown          |                         | TemplateResult | Renders a dropdown.                                                       |
| _dropDownChanged        |                         | void        | Handler for dropdown change events.                                        |
| render                  |                         | TemplateResult | Renders the component.                                                    |
| setLongUnFocus          |                         | void        | Sets long focus to false.                                                  |
| setLongFocus            |                         | void        | Sets long focus to true.                                                   |
| isNumberSubType         |                         | boolean     | Checks if the subtype of the question is a number.                          |
| _keyPressed             | event: KeyboardEvent    | void        | Handler for keypress events.                                               |
| setRadioEventType       |                         | void        | Sets the radio keypress event type.                                        |
| _sendDebouncedChange    | event: CustomEvent      | void        | Sends a debounced change event.                                            |
| _debounceChangeEvent    | event: CustomEvent      | void        | Debounces change events.                                                   |
| textWithIndex           |                         | string      | Returns the question text with index.                                      |
| _getRadioClass          |                         | string      | Returns the class for radio button groups.                                 |
| textWithLinks           |                         | string      | Returns the question text with links.                                      |
| _resizeScrollerIfNeeded |                         | void        | Fires an event to resize the scroller if needed.                           |
| checkValidity           |                         | boolean     | Checks the validity of the question input.                                 |
| isInputField            |                         | boolean     | Checks if the question is an input field.                                  |
| focus                   |                         | void        | Focuses the input field if it is an input field.                           |
| cleanValue              | value: string           | string      | Cleans the input value by removing commas and colons.                      |
| checkRadioButtonValidity|                         | boolean     | Checks the validity of radio button inputs.                                |
| getAnswer               | suppressNotFoundError: boolean | YpStructuredAnswer \| undefined | Gets the answer for the question.            |
| setAnswer               | value: string           | void        | Sets the answer for the question.                                          |
| hide                    |                         | void        | Hides the question input.                                                  |
| show                    |                         | void        | Shows the question input.                                                  |
| _checkboxChanged        | event: CustomEvent      | void        | Handler for checkbox change events.                                        |
| _radioChanged           | event: CustomEvent      | void        | Handler for radio button change events.                                    |
| _structuredAnsweredChanged |                      | void        | Handles changes to structured answers.                                     |
| connectedCallback       |                         | void        | Lifecycle method called when the component is added to the DOM.            |

## Events (if any)

- **yp-goto-next-index**: Emitted when the user presses enter on a text field to go to the next question.
- **yp-skip-to-unique-id**: Emitted when a radio button with a skip-to action is selected.
- **yp-open-to-unique-id**: Emitted when a radio button with an open-to action is selected.
- **yp-answer-content-changed**: Emitted when the content of an answer changes.
- **resize-scroller**: Emitted when the scroller needs to be resized.

## Examples

```typescript
// Example usage of the YpStructuredQuestionEdit component
<yp-structured-question-edit
  .question=${{
    uniqueId: 'q1',
    text: 'What is your favorite color?',
    type: 'textfield',
    required: true
  }}
  .index=${1}
  .formName=${'surveyForm'}
></yp-structured-question-edit>
```

Note: The above example assumes that `YpStructuredQuestionData`, `YpStructuredAnswer`, `YpRadioButtonData`, and other related types are defined elsewhere in the codebase.