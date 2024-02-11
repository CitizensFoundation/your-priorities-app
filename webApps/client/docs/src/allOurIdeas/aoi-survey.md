# AoiSurvey

AoiSurvey is a custom web component that integrates with the All Our Ideas (AOI) platform to create and manage surveys. It allows users to participate in voting, view results, and analyze survey data. The component is part of a larger application that includes various other components and services.

## Properties

| Name                  | Type                                              | Description                                                                 |
|-----------------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| pageIndex             | number                                            | The index of the currently displayed page in the survey.                     |
| totalNumberOfVotes    | number                                            | The total number of votes cast in the survey.                                |
| collectionId          | number                                            | The unique identifier for the collection associated with the survey.         |
| collection            | YpGroupData                                       | The data for the collection associated with the survey.                      |
| lastSnackbarText      | string \| undefined                               | The text to display in the last snackbar message.                            |
| currentError          | string \| undefined                               | The current error message, if any.                                           |
| earl                  | AoiEarlData                                       | The data for the AOI survey.                                                 |
| question              | AoiQuestionData                                   | The current question data for the survey.                                    |
| prompt                | AoiPromptData                                     | The current prompt data for the survey.                                      |
| isAdmin               | boolean                                           | Indicates whether the current user has admin privileges.                     |
| surveyClosed          | boolean                                           | Indicates whether the survey is closed.                                      |
| appearanceLookup      | string                                            | A lookup string for the survey's appearance.                                 |
| currentLeftAnswer     | AoiAnswerToVoteOnData \| undefined                | The current left answer option for voting.                                   |
| currentRightAnswer    | AoiAnswerToVoteOnData \| undefined                | The current right answer option for voting.                                  |
| currentPromptId       | number \| undefined                               | The unique identifier for the current prompt.                                |

## Methods

| Name                  | Parameters              | Return Type | Description                                                                 |
|-----------------------|-------------------------|-------------|-----------------------------------------------------------------------------|
| snackbarclosed        | -                       | void        | Handles the closure of the snackbar.                                        |
| tabChanged            | event: CustomEvent      | void        | Handles the change of tabs in the navigation bar.                            |
| exitToMainApp         | -                       | void        | Exits the survey and returns to the main application.                       |
| _displaySnackbar      | event: CustomEvent      | Promise     | Displays a snackbar with a message.                                         |
| _setupEventListeners  | -                       | void        | Sets up event listeners for the component.                                  |
| _removeEventListeners | -                       | void        | Removes event listeners from the component.                                 |
| externalGoalTrigger   | -                       | void        | Triggers an external goal URL if configured.                                |
| updated               | changedProperties: Map  | void        | Called after the component's properties have been updated.                  |
| _appError             | event: CustomEvent      | void        | Handles application errors.                                                 |
| _settingsColorChanged | event: CustomEvent      | void        | Fires a global event to update the theme color.                             |
| changeTabTo           | tabId: number           | void        | Changes the active tab to the specified tab ID.                             |
| updateThemeColor      | event: CustomEvent      | void        | Updates the theme color based on the event detail.                          |
| sendVoteAnalytics     | -                       | void        | Sends analytics data after a certain number of votes have been cast.        |
| updateappearanceLookup| event: CustomEvent      | void        | Updates the appearance lookup and prompt details based on the event detail. |
| renderIntroduction    | -                       | TemplateResult | Renders the introduction page of the survey.                               |
| renderShare           | -                       | TemplateResult | Renders the share page of the survey.                                      |
| startVoting           | -                       | void        | Starts the voting process in the survey.                                    |
| openResults           | -                       | void        | Opens the results page of the survey.                                       |
| triggerExternalGoalUrl| -                       | void        | Redirects to the external goal URL if configured.                           |
| _renderPage           | -                       | TemplateResult | Renders the current page based on the page index.                          |
| renderScore           | -                       | TemplateResult | Renders the score view of the survey.                                      |
| renderNavigationBar   | -                       | TemplateResult | Renders the navigation bar for the survey.                                 |

## Events (if any)

- **display-snackbar**: Emitted when a snackbar message needs to be displayed.
- **yp-network-error**: Emitted when there is a network error.
- **set-ids**: Emitted to set the question and prompt IDs globally.
- **yp-theme-color**: Emitted to update the theme color globally.
- **update-appearance-lookup**: Emitted when the appearance lookup and prompt details need to be updated.

## Examples

```typescript
// Example usage of the AoiSurvey component
<aoi-survey
  .pageIndex="${1}"
  .totalNumberOfVotes="${100}"
  .collectionId="${123}"
  .collection="${myCollectionData}"
  .earl="${myEarlData}"
  .question="${myQuestionData}"
  .prompt="${myPromptData}"
  .isAdmin="${false}"
  .surveyClosed="${false}"
  .appearanceLookup="${'appearanceString'}"
  .currentLeftAnswer="${myLeftAnswerData}"
  .currentRightAnswer="${myRightAnswerData}"
  .currentPromptId="${456}"
></aoi-survey>
```

Note: The example assumes that `myCollectionData`, `myEarlData`, `myQuestionData`, `myLeftAnswerData`, and `myRightAnswerData` are predefined variables containing the respective data objects.