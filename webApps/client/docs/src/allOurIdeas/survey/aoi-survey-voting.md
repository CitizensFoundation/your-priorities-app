# AoiSurveyVoting

The `AoiSurveyVoting` class is a custom web component that extends `YpBaseElement`. It is designed to handle survey voting functionality, allowing users to vote on different answers to a question. The component manages the voting process, animations, and UI updates.

## Properties

| Name                      | Type                                | Description                                                                 |
|---------------------------|-------------------------------------|-----------------------------------------------------------------------------|
| `groupId`                 | `number`                            | The ID of the group associated with the survey.                             |
| `earl`                    | `AoiEarlData`                       | The data object containing configuration and other details for the survey.  |
| `question`                | `AoiQuestionData`                   | The data object representing the current question being voted on.           |
| `firstPrompt`             | `AoiPromptData`                     | The data object for the first prompt in the survey.                         |
| `promptId`                | `number`                            | The ID of the current prompt.                                               |
| `group`                   | `YpGroupData`                       | The data object representing the group details.                             |
| `voteCount`               | `number`                            | The current count of votes.                                                 |
| `spinnersActive`          | `boolean`                           | Indicates if the spinners are active during loading.                        |
| `leftAnswer`              | `AoiAnswerToVoteOnData \| undefined`| The data object for the left answer option.                                 |
| `rightAnswer`             | `AoiAnswerToVoteOnData \| undefined`| The data object for the right answer option.                                |
| `appearanceLookup`        | `string`                            | A string used for appearance lookup.                                        |
| `breakForVertical`        | `boolean`                           | Determines if the layout should break for vertical alignment.               |
| `breakButtonsForVertical` | `boolean`                           | Determines if the button layout should break for vertical alignment.        |
| `llmExplainOpen`          | `boolean`                           | Indicates if the LLM explain dialog is open.                                |
| `level`                   | `number`                            | The current level of voting progress.                                       |
| `currentLevelTargetVotes` | `number \| undefined`               | The target number of votes for the current level.                           |
| `timer`                   | `number \| undefined`               | A timer used to track the time spent on voting.                             |

## Methods

| Name                    | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| `connectedCallback`     | -                                                                          | `Promise<void>` | Lifecycle method called when the component is added to the DOM. Initializes listeners and timers. |
| `disconnectedCallback`  | -                                                                          | `void`      | Lifecycle method called when the component is removed from the DOM. Cleans up listeners. |
| `resetTimer`            | -                                                                          | `void`      | Resets the timer used for tracking time spent on voting.                    |
| `animateButtons`        | `direction: "left" \| "right" \| "skip"`                                   | `Promise<void>` | Animates the buttons based on the voting direction.                         |
| `resetAnimation`        | `event: any`                                                               | `void`      | Resets the animation classes on the buttons.                                |
| `voteForAnswer`         | `direction: "left" \| "right" \| "skip"`                                   | `Promise<void>` | Handles the voting logic and updates the UI based on the selected direction. |
| `setLabelOnMdButton`    | -                                                                          | `Promise<void>` | Sets the label on custom buttons to ensure proper styling.                  |
| `firstUpdated`          | `_changedProperties: PropertyValueMap<any> \| Map<PropertyKey, unknown>`   | `void`      | Lifecycle method called after the first update. Sets up button labels.      |
| `removeAndInsertFromLeft`| -                                                                         | `void`      | Animates the buttons to slide in from the left.                             |
| `openNewIdeaDialog`     | -                                                                          | `void`      | Opens the dialog for adding a new idea.                                     |
| `openLlmExplainDialog`  | -                                                                          | `Promise<void>` | Opens the LLM explain dialog.                                               |
| `renderProgressBar`     | -                                                                          | `TemplateResult \| typeof nothing` | Renders the progress bar based on the current voting progress.              |
| `render`                | -                                                                          | `TemplateResult \| typeof nothing` | Renders the component's template.                                           |

## Examples

```typescript
// Example usage of the AoiSurveyVoting component
import './aoi-survey-voting.js';

const surveyVoting = document.createElement('aoi-survey-voting');
surveyVoting.groupId = 1;
surveyVoting.earl = { /* AoiEarlData object */ };
surveyVoting.question = { /* AoiQuestionData object */ };
document.body.appendChild(surveyVoting);
```