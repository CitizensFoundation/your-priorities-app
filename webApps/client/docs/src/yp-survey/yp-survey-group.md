# YpSurveyGroup

The `YpSurveyGroup` class is a custom web component that extends `YpBaseElement`. It is designed to handle survey groups, manage survey questions and answers, and submit survey responses.

## Properties

| Name                   | Type                                      | Description                                                                 |
|------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| surveyGroupId          | number \| undefined                       | The ID of the survey group.                                                 |
| surveySubmitError      | string \| undefined                       | Error message if the survey submission fails.                               |
| surveyCompleted        | boolean                                   | Indicates if the survey has been completed.                                 |
| submitHidden           | boolean                                   | Determines if the submit button is hidden.                                  |
| surveyGroup            | YpGroupData \| undefined                  | The data of the survey group.                                               |
| structuredQuestions    | Array<YpStructuredQuestionData> \| undefined | The list of structured questions in the survey.                             |
| structuredAnswers      | Array<YpStructuredAnswer> \| undefined    | The list of structured answers provided by the user.                        |
| initiallyLoadedAnswers | Array<YpStructuredAnswer> \| undefined    | The list of answers initially loaded from local storage.                    |
| liveQuestionIds        | Array<number>                             | The list of live question indices.                                          |
| uniqueIdsToElementIndexes | Record<string, number>                 | Mapping of unique IDs to their respective element indices.                  |
| liveUniqueIds          | Array<string>                             | The list of live unique IDs.                                                |
| liveUniqueIdsAll       | Array<{ uniqueId: string; atIndex: number }> | The list of all live unique IDs with their indices.                         |

## Methods

| Name                  | Parameters                                                                 | Return Type | Description                                                                 |
|-----------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| updated               | changedProperties: Map<string \| number \| symbol, unknown>                | void        | Called when the element's properties change.                                |
| render                | None                                                                       | TemplateResult | Renders the component's template.                                           |
| connectedCallback     | None                                                                       | void        | Called when the element is added to the document.                           |
| disconnectedCallback  | None                                                                       | void        | Called when the element is removed from the document.                       |
| _isLastRating         | index: number                                                              | boolean     | Checks if the question at the given index is the last rating question.      |
| _isFirstRating        | index: number                                                              | boolean     | Checks if the question at the given index is the first rating question.     |
| _openToId             | event: CustomEvent                                                         | void        | Opens the survey to a specific question ID.                                 |
| _skipToId             | event: CustomEvent, showItems: boolean                                     | void        | Skips to a specific question ID, optionally showing items.                  |
| _goToNextIndex        | event: CustomEvent                                                         | void        | Navigates to the next question index.                                       |
| _serializeAnswers     | None                                                                       | void        | Serializes the answers from the survey questions.                           |
| _submit               | None                                                                       | Promise<void> | Submits the survey answers to the server.                                   |
| _saveState            | event: CustomEvent                                                         | void        | Saves the current state of the survey answers to local storage.             |
| _clearState           | None                                                                       | void        | Clears the saved state of the survey answers from local storage.            |
| _checkAndLoadState    | None                                                                       | void        | Checks and loads the saved state of the survey answers from local storage.  |
| _isIpad               | None                                                                       | boolean     | Checks if the current device is an iPad.                                    |
| _surveyGroupIdChanged | None                                                                       | void        | Called when the survey group ID changes.                                    |
| _getSurveyGroup       | None                                                                       | Promise<void> | Fetches the survey group data from the server.                              |
| refresh               | None                                                                       | void        | Refreshes the component's state and configuration.                          |

## Events

- **yp-skip-to-unique-id**: Emitted to skip to a specific unique ID in the survey.
- **yp-open-to-unique-id**: Emitted to open to a specific unique ID in the survey.
- **yp-goto-next-index**: Emitted to navigate to the next question index.
- **yp-answer-content-changed-debounced**: Emitted when the answer content changes and needs to be saved.

## Examples

```typescript
// Example usage of the YpSurveyGroup component
<yp-survey-group surveyGroupId="123"></yp-survey-group>
```