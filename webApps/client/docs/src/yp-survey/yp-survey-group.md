# YpSurveyGroup

The `YpSurveyGroup` class is a custom element that represents a survey group in a web application. It extends `YpBaseElement` and is responsible for rendering and managing structured survey questions and answers, handling survey submission, and maintaining the state of the survey.

## Properties

| Name                   | Type                                  | Description                                                                 |
|------------------------|---------------------------------------|-----------------------------------------------------------------------------|
| surveyGroupId          | number \| undefined                   | The unique identifier for the survey group.                                 |
| surveySubmitError      | string \| undefined                   | A message indicating an error that occurred during survey submission.       |
| surveyCompleted        | boolean                               | A flag indicating whether the survey has been completed.                    |
| submitHidden           | boolean                               | A flag indicating whether the submit button should be hidden.               |
| surveyGroup            | YpGroupData \| undefined              | The data object representing the survey group.                              |
| structuredQuestions    | Array<YpStructuredQuestionData> \| undefined | An array of structured questions for the survey.                            |
| structuredAnswers      | Array<YpStructuredAnswer> \| undefined | An array of structured answers provided by the user.                        |
| initiallyLoadedAnswers | Array<YpStructuredAnswer> \| undefined | An array of structured answers initially loaded from local storage.         |

## Methods

| Name                  | Parameters                          | Return Type | Description                                                                 |
|-----------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| updated               | changedProperties: Map<string \| number \| symbol, unknown> | void        | Called after the element’s properties have been updated.                    |
| render                |                                     | TemplateResult \| typeof nothing | Renders the survey group content.                                           |
| connectedCallback     |                                     | void        | Lifecycle callback that is called when the element is added to the document.|
| disconnectedCallback  |                                     | void        | Lifecycle callback that is called when the element is removed from the document.|
| _isLastRating         | index: number                       | boolean     | Determines if the current question is the last rating question in a sequence.|
| _isFirstRating        | index: number                       | boolean     | Determines if the current question is the first rating question in a sequence.|
| _openToId             | event: CustomEvent                  | void        | Opens the survey to a specific question based on a unique ID.               |
| _skipToId             | event: CustomEvent, showItems: boolean | void        | Skips to a specific question in the survey based on a unique ID.            |
| _goToNextIndex        | event: CustomEvent                  | void        | Scrolls to the next question in the survey.                                 |
| _serializeAnswers     |                                     | void        | Serializes the answers from the survey questions.                           |
| _submit               |                                     | Promise<void> | Submits the survey answers to the server.                                   |
| _saveState            | event: CustomEvent                  | void        | Saves the current state of the survey answers to local storage.             |
| _clearState           |                                     | void        | Clears the saved state of the survey from local storage.                    |
| _checkAndLoadState    |                                     | void        | Checks for and loads the saved state of the survey from local storage.      |
| _isIpad               |                                     | boolean     | Checks if the current device is an iPad.                                    |
| _surveyGroupIdChanged |                                     | void        | Called when the `surveyGroupId` property changes.                           |
| _getSurveyGroup       |                                     | Promise<void> | Retrieves the survey group data from the server.                            |
| refresh               |                                     | void        | Refreshes the survey group settings and applies necessary configurations.   |

## Events (if any)

- **yp-skip-to-unique-id**: Emitted to skip to a specific question based on a unique ID.
- **yp-open-to-unique-id**: Emitted to open the survey to a specific question based on a unique ID.
- **yp-goto-next-index**: Emitted to go to the next question in the survey.
- **yp-answer-content-changed-debounced**: Emitted when the content of an answer changes and needs to be saved.

## Examples

```typescript
// Example usage of the YpSurveyGroup element
<yp-survey-group survey-group-id="123"></yp-survey-group>
```

Note: The `YpSurveyGroup` class interacts with various other components and services, such as `window.serverApi` for server communication and `localStorage` for state management. It also uses custom events for internal communication between components.