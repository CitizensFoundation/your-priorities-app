# YpRegistrationQuestions

This class represents a custom element that handles the display and interaction with registration questions for a group. It allows users to answer structured questions, which can be automatically translated if needed.

## Properties

| Name                | Type                                                  | Description                                                                                   |
|---------------------|-------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| group               | YpGroupData \| undefined                              | The group data containing registration questions.                                             |
| structuredAnswers   | Array<Record<string, string>> \| undefined            | The structured answers provided by the user.                                                  |
| translatedQuestions | Array<YpStructuredQuestionData> \| undefined          | The translated versions of the registration questions.                                        |
| autoTranslate       | boolean                                               | Indicates whether automatic translation is enabled.                                           |
| selectedSegment     | string \| undefined                                   | The currently selected segment for which questions should be displayed.                       |
| segments            | Array<YpStructuredQuestionData> \| undefined          | The available segments for the registration questions.                                        |
| liveQuestionIds     | Array<number>                                         | An array of IDs for questions that are currently active and should be displayed.              |
| uniqueIdsToElementIndexes | Record<string, number>                          | A mapping from unique question IDs to their corresponding element indexes.                    |
| liveUniqueIds       | Array<string>                                         | An array of unique IDs for questions that are currently active.                               |
| liveUniqueIdsAll    | Array<{ uniqueId: string; atIndex: number }>          | An array of objects containing unique IDs and their corresponding indexes for all questions.  |

## Methods

| Name             | Parameters                  | Return Type | Description                                                                                   |
|------------------|-----------------------------|-------------|-----------------------------------------------------------------------------------------------|
| connectedCallback |                            | void        | Lifecycle method that runs when the element is added to the DOM.                              |
| disconnectedCallback |                        | void        | Lifecycle method that runs when the element is removed from the DOM.                          |
| render           |                            | TemplateResult \| nothing | Renders the element's HTML template.                                                         |
| structuredQuestions |                        | Array<YpStructuredQuestionData> \| undefined | Getter for the structured questions based on the group configuration.                        |
| filteredQuestions |                          | Array<YpStructuredQuestionData> \| null | Getter for the questions filtered by the selected segment.                                   |
| _autoTranslateEvent | event: CustomEvent     | void        | Handles the auto-translate event and updates the translation if needed.                       |
| _getTranslationsIfNeeded |                    | Promise<void> | Retrieves translations for the registration questions if auto-translate is enabled.          |
| _setupQuestions  |                            | void        | Sets up the questions for display based on the selected segment and other criteria.           |
| _checkForSegments |                          | void        | Checks if there are any segments within the structured questions and sets them up.            |
| getAnswers       |                            | Array<Record<string, string>> | Retrieves the answers provided by the user for the structured questions.                    |
| validate         |                            | boolean     | Validates the answers provided by the user and ensures all required questions are answered.  |
| updated          | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method that runs when the element's properties have changed.                       |
| _radioChanged    | event: CustomEvent         | void        | Handles the change event for the segment radio buttons and updates the selected segment.      |

## Events (if any)

- **yp-auto-translate**: Emitted when the auto-translate setting is toggled.
- **yp-skip-to-unique-id**: Emitted when the user needs to skip to a specific question by its unique ID.
- **yp-goto-next-index**: Emitted when the user needs to go to the next question in the sequence.

## Examples

```typescript
// Example usage of the YpRegistrationQuestions custom element
<yp-registration-questions
  .group="${this.groupData}"
  .structuredAnswers="${this.structuredAnswers}"
  .translatedQuestions="${this.translatedQuestions}"
  .autoTranslate="${this.autoTranslate}"
  .selectedSegment="${this.selectedSegment}"
  .segments="${this.segments}"
></yp-registration-questions>
```

Note: The above example assumes that `this.groupData`, `this.structuredAnswers`, `this.translatedQuestions`, `this.autoTranslate`, `this.selectedSegment`, and `this.segments` are properties defined in the context where the `YpRegistrationQuestions` element is used.