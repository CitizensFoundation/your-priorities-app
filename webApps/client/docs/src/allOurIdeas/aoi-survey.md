# AoiSurvey

The `AoiSurvey` class is a custom web component that extends `YpBaseElement`. It is designed to manage and display a survey interface, including navigation between different survey pages such as introduction, voting, results, and analysis.

## Properties

| Name                | Type                                      | Description                                                                 |
|---------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| pageIndex           | Number                                    | The current page index of the survey.                                       |
| totalNumberOfVotes  | Number                                    | The total number of votes cast in the survey.                               |
| collectionId        | Number                                    | The ID of the collection associated with the survey.                        |
| collection          | YpGroupData                               | The data of the group collection.                                           |
| lastSnackbarText    | string \| undefined                       | The text to display in the last snackbar notification.                      |
| currentError        | string \| undefined                       | The current error message, if any.                                          |
| earl                | AoiEarlData                               | The data related to the survey's earl.                                      |
| question            | AoiQuestionData                           | The data related to the current survey question.                            |
| prompt              | AoiPromptData                             | The data related to the current survey prompt.                              |
| isAdmin             | Boolean                                   | Indicates if the current user is an admin.                                  |
| surveyClosed        | Boolean                                   | Indicates if the survey is closed.                                          |
| appearanceLookup    | string                                    | The appearance lookup string for the survey.                                |
| currentLeftAnswer   | AoiAnswerToVoteOnData \| undefined        | The current left answer to vote on.                                         |
| currentRightAnswer  | AoiAnswerToVoteOnData \| undefined        | The current right answer to vote on.                                        |
| currentPromptId     | Number \| undefined                       | The ID of the current prompt.                                               |
| drawer              | NavigationDrawer                          | The navigation drawer element.                                              |

## Methods

| Name                      | Parameters                                      | Return Type | Description                                                                 |
|---------------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback         |                                                 | void        | Lifecycle method called when the element is added to the document.          |
| getEarl                   |                                                 | Promise<void> | Fetches the earl data for the survey.                                       |
| disconnectedCallback      |                                                 | void        | Lifecycle method called when the element is removed from the document.      |
| scrollToCollectionItemSubClass |                                           | void        | Placeholder method for scrolling to a collection item.                      |
| getHexColor               | color: string                                   | string \| undefined | Converts a color string to a hex color format.                              |
| snackbarclosed            |                                                 | void        | Resets the last snackbar text when the snackbar is closed.                  |
| tabChanged                | event: CustomEvent                              | void        | Handles tab change events to update the page index.                         |
| exitToMainApp             |                                                 | void        | Placeholder method for exiting to the main app.                             |
| _displaySnackbar          | event: CustomEvent                              | Promise<void> | Displays a snackbar with the event's detail text.                           |
| _setupEventListeners      |                                                 | void        | Sets up event listeners for the component.                                  |
| _removeEventListeners     |                                                 | void        | Removes event listeners from the component.                                 |
| externalGoalTrigger       |                                                 | void        | Triggers an external goal URL based on query parameters.                    |
| updated                   | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method called when properties are updated.                        |
| _appError                 | event: CustomEvent                              | void        | Handles application error events.                                           |
| adminConfirmed            |                                                 | boolean     | Returns true if the admin is confirmed.                                     |
| _settingsColorChanged     | event: CustomEvent                              | void        | Fires a global event to update the theme color.                             |
| changeTabTo               | tabId: number                                   | void        | Changes the active tab to the specified tab ID.                             |
| updateThemeColor          | event: CustomEvent                              | void        | Updates the theme color based on the event's detail.                        |
| sendVoteAnalytics         |                                                 | void        | Sends analytics data when a certain number of votes are reached.            |
| updateappearanceLookup    | event: CustomEvent                              | void        | Updates the appearance lookup and prompt details based on the event.        |
| renderIntroduction        |                                                 | TemplateResult | Renders the introduction page.                                              |
| renderShare               |                                                 | TemplateResult | Renders the share page.                                                     |
| startVoting               |                                                 | void        | Starts the voting process and updates the page index.                       |
| openResults               |                                                 | void        | Opens the results page and updates the page index.                          |
| triggerExternalGoalUrl    |                                                 | void        | Redirects to the external goal trigger URL.                                 |
| _renderPage               |                                                 | TemplateResult | Renders the current page based on the page index.                           |
| renderScore               |                                                 | TemplateResult | Renders the score section.                                                  |
| renderNavigationBar       |                                                 | TemplateResult | Renders the navigation bar based on the screen width.                       |
| render                    |                                                 | TemplateResult | Renders the entire component.                                               |

## Examples

```typescript
// Example usage of the AoiSurvey web component
import './aoi-survey.js';

const surveyElement = document.createElement('aoi-survey');
document.body.appendChild(surveyElement);
```