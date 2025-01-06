# AoiSurvey

The `AoiSurvey` class is a custom web component that extends `YpBaseElement`. It is designed to manage and display a survey interface, allowing users to navigate through different pages such as introduction, voting, results, and analysis. The component integrates with various Material Web components and handles interactions with a server API for survey data.

## Properties

| Name                | Type                                      | Description                                                                 |
|---------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| `pageIndex`         | `number`                                  | The current page index of the survey.                                       |
| `totalNumberOfVotes`| `number`                                  | The total number of votes cast in the survey.                               |
| `collectionId`      | `number`                                  | The ID of the collection associated with the survey.                        |
| `collection`        | `YpGroupData`                             | The data of the group collection.                                           |
| `lastSnackbarText`  | `string \| undefined`                     | The text to display in the last snackbar notification.                      |
| `currentError`      | `string \| undefined`                     | The current error message, if any.                                          |
| `earl`              | `AoiEarlData`                             | The earl data associated with the survey.                                   |
| `question`          | `AoiQuestionData`                         | The question data for the survey.                                           |
| `prompt`            | `AoiPromptData`                           | The prompt data for the survey.                                             |
| `isAdmin`           | `boolean`                                 | Indicates if the current user is an admin.                                  |
| `surveyClosed`      | `boolean`                                 | Indicates if the survey is closed.                                          |
| `appearanceLookup`  | `string`                                  | The appearance lookup string for the survey.                                |
| `currentLeftAnswer` | `AoiAnswerToVoteOnData \| undefined`      | The current left answer to vote on.                                         |
| `currentRightAnswer`| `AoiAnswerToVoteOnData \| undefined`      | The current right answer to vote on.                                        |
| `currentPromptId`   | `number \| undefined`                     | The ID of the current prompt.                                               |
| `drawer`            | `NavigationDrawer`                        | The navigation drawer element.                                              |

## Methods

| Name                      | Parameters                                                                 | Return Type | Description                                                                 |
|---------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| `constructor`             | None                                                                       | `void`      | Initializes the component and sets up global variables.                     |
| `connectedCallback`       | None                                                                       | `void`      | Lifecycle method called when the component is added to the document.        |
| `getEarl`                 | None                                                                       | `Promise<void>` | Fetches earl data from the server and updates the component state.          |
| `disconnectedCallback`    | None                                                                       | `void`      | Lifecycle method called when the component is removed from the document.    |
| `scrollToCollectionItemSubClass` | None                                                               | `void`      | Placeholder method for scrolling to a collection item.                      |
| `getHexColor`             | `color: string`                                                            | `string \| undefined` | Converts a color string to a hex color format.                              |
| `snackbarclosed`          | None                                                                       | `void`      | Resets the last snackbar text when the snackbar is closed.                  |
| `tabChanged`              | `event: CustomEvent`                                                       | `void`      | Updates the page index based on the active tab.                             |
| `exitToMainApp`           | None                                                                       | `void`      | Placeholder method for exiting to the main app.                             |
| `_displaySnackbar`        | `event: CustomEvent`                                                       | `Promise<void>` | Displays a snackbar with the event detail text.                             |
| `_setupEventListeners`    | None                                                                       | `void`      | Sets up event listeners for the component.                                  |
| `_removeEventListeners`   | None                                                                       | `void`      | Removes event listeners from the component.                                 |
| `externalGoalTrigger`     | None                                                                       | `void`      | Triggers an external goal URL based on query parameters.                    |
| `updated`                 | `changedProperties: Map<string \| number \| symbol, unknown>`              | `void`      | Lifecycle method called when properties are updated.                        |
| `_appError`               | `event: CustomEvent`                                                       | `void`      | Handles application errors by logging and updating the current error.       |
| `adminConfirmed`          | None                                                                       | `boolean`   | Returns true if the admin is confirmed.                                     |
| `_settingsColorChanged`   | `event: CustomEvent`                                                       | `void`      | Fires a global event to update the theme color.                             |
| `changeTabTo`             | `tabId: number`                                                            | `void`      | Changes the active tab to the specified tab ID.                             |
| `updateThemeColor`        | `event: CustomEvent`                                                       | `void`      | Updates the theme color based on the event detail.                          |
| `sendVoteAnalytics`       | None                                                                       | `void`      | Sends analytics data when a certain number of votes are reached.            |
| `updateappearanceLookup`  | `event: CustomEvent`                                                       | `void`      | Updates the appearance lookup and prompt data based on the event detail.    |
| `renderIntroduction`      | None                                                                       | `TemplateResult` | Renders the introduction page content.                                      |
| `renderShare`             | None                                                                       | `TemplateResult` | Renders the share page content.                                             |
| `startVoting`             | None                                                                       | `void`      | Starts the voting process and updates the page index.                       |
| `openResults`             | None                                                                       | `void`      | Opens the results page and updates the page index.                          |
| `triggerExternalGoalUrl`  | None                                                                       | `void`      | Redirects to the external goal trigger URL.                                 |
| `_renderPage`             | None                                                                       | `TemplateResult` | Renders the current page based on the page index.                           |
| `renderScore`             | None                                                                       | `TemplateResult` | Renders the score page content.                                             |
| `renderNavigationBar`     | None                                                                       | `TemplateResult` | Renders the navigation bar based on the screen width.                       |
| `render`                  | None                                                                       | `TemplateResult` | Renders the entire component layout.                                        |

## Examples

```typescript
// Example usage of the AoiSurvey web component
import './aoi-survey.js';

const surveyElement = document.createElement('aoi-survey');
document.body.appendChild(surveyElement);
```