# YpSurveyGroup

A custom element that represents a survey group, allowing users to complete surveys with structured questions and answers.

## Properties

| Name                   | Type                                      | Description                                                                 |
|------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| surveyGroupId          | number \| undefined                       | The ID of the survey group.                                                 |
| surveySubmitError      | string \| undefined                       | Error message if the survey submission fails.                               |
| surveyCompleted        | boolean                                   | Indicates if the survey has been completed.                                 |
| submitHidden           | boolean                                   | Controls the visibility of the submit button.                               |
| surveyGroup            | YpGroupData \| undefined                  | The survey group data object.                                               |
| structuredQuestions    | Array<YpStructuredQuestionData> \| undefined | The list of structured questions for the survey.                            |
| structuredAnswers      | Array<YpStructuredAnswer> \| undefined    | The list of structured answers provided by the user.                        |
| initiallyLoadedAnswers | Array<YpStructuredAnswer> \| undefined    | The list of structured answers initially loaded, possibly from local storage. |

## Methods

| Name                  | Parameters | Return Type | Description                                                                 |
|-----------------------|------------|-------------|-----------------------------------------------------------------------------|
| updated               | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method called after the element’s properties have changed.        |
| render                |            | TemplateResult \| typeof nothing | Renders the survey group content.                                           |
| connectedCallback     |            | void        | Lifecycle method called when the element is added to the document’s DOM.    |
| disconnectedCallback  |            | void        | Lifecycle method called when the element is removed from the document’s DOM. |
| _isLastRating         | index: number | boolean     | Checks if the current question is the last rating question.                 |
| _isFirstRating        | index: number | boolean     | Checks if the current question is the first rating question.                |
| _openToId             | event: CustomEvent | void        | Opens the survey to a specific question ID.                                 |
| _skipToId             | event: CustomEvent, showItems: boolean | void        | Skips to a specific question ID in the survey.                              |
| _goToNextIndex        | event: CustomEvent | void        | Scrolls to the next question index.                                         |
| _serializeAnswers     |            | void        | Serializes the answers from the survey.                                     |
| _submit               |            | Promise<void> | Submits the survey answers.                                                 |
| _saveState            | event: CustomEvent | void        | Saves the current state of the survey answers.                              |
| _clearState           |            | void        | Clears the saved state of the survey answers.                               |
| _checkAndLoadState    |            | void        | Checks and loads the saved state of the survey answers.                     |
| _isIpad               |            | boolean     | Checks if the device is an iPad.                                            |
| _surveyGroupIdChanged |            | void        | Called when the survey group ID changes.                                    |
| _getSurveyGroup       |            | Promise<void> | Retrieves the survey group data.                                            |
| refresh               |            | void        | Refreshes the survey group settings and configurations.                     |

## Events (if any)

- **yp-skip-to-unique-id**: Emitted to skip to a specific question ID in the survey.
- **yp-open-to-unique-id**: Emitted to open the survey to a specific question ID.
- **yp-goto-next-index**: Emitted to go to the next question index.
- **yp-answer-content-changed**: Emitted when the content of an answer changes.

## Examples

```typescript
// Example usage of the YpSurveyGroup element
<yp-survey-group survey-group-id="123"></yp-survey-group>
```

Note: The actual usage of the element would depend on the context within the application and the data provided to it.