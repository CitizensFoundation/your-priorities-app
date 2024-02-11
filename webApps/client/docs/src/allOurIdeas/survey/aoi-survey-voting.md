# AoiSurveyVoting

A custom element that handles the voting process for a survey, allowing users to vote on different answers, skip voting, or add their own answer. It also provides an explanation dialog for the voting process.

## Properties

| Name                     | Type                                  | Description                                                                 |
|--------------------------|---------------------------------------|-----------------------------------------------------------------------------|
| groupId                  | number                                | The ID of the group associated with the survey.                              |
| earl                     | AoiEarlData                           | Data related to the EARL (Explainable AI Recommendation Logic) system.      |
| question                 | AoiQuestionData                       | The current question data for which the voting is taking place.             |
| firstPrompt              | AoiPromptData                         | The first prompt data for the question.                                     |
| promptId                 | number                                | The ID of the current prompt.                                               |
| group                    | YpGroupData                           | Data about the group associated with the survey.                            |
| voteCount                | number                                | The count of votes made by the user.                                        |
| spinnersActive           | boolean                               | Indicates whether the spinner animations are active.                        |
| leftAnswer               | AoiAnswerToVoteOnData \| undefined    | The data for the answer option on the left side.                            |
| rightAnswer              | AoiAnswerToVoteOnData \| undefined    | The data for the answer option on the right side.                           |
| appearanceLookup         | string                                | A lookup string used for tracking the appearance of prompts.                |
| breakForVertical         | boolean                               | A flag to break the layout for vertical orientation.                        |
| llmExplainOpen           | boolean                               | Indicates whether the LLM explain dialog is open.                           |
| level                    | number                                | The current level of the voting process.                                    |
| currentLevelTargetVotes  | number \| undefined                   | The target number of votes for the current level.                           |
| timer                    | number \| undefined                   | A timer used for tracking the time viewed for a prompt.                     |

## Methods

| Name             | Parameters                        | Return Type | Description                                                                 |
|------------------|-----------------------------------|-------------|-----------------------------------------------------------------------------|
| resetTimer       | none                              | void        | Resets the timer to the current time.                                       |
| animateButtons   | direction: "left" \| "right" \| "skip" | Promise<void> | Animates the voting buttons based on the direction of the vote.             |
| resetAnimation   | event: any                        | void        | Resets the animation on the voting buttons.                                 |
| voteForAnswer    | direction: "left" \| "right" \| "skip" | Promise<void> | Handles the voting process for an answer based on the direction.            |
| removeAndInsertFromLeft | none                        | void        | Removes and inserts the voting buttons from the left side.                  |
| openNewIdeaDialog | none                             | void        | Opens the dialog for adding a new idea.                                     |
| openLlmExplainDialog | none                          | Promise<void> | Opens the dialog that explains the voting process.                          |

## Events

- **needs-new-earl**: Emitted when a new EARL data is needed.
- **display-snackbar**: Emitted to display a snackbar with a message.
- **update-appearance-lookup**: Emitted to update the appearance lookup data.
- **set-ids**: Emitted to set the IDs for the question and prompt.

## Examples

```typescript
// Example usage of the AoiSurveyVoting element
<aoi-survey-voting
  .groupId=${123}
  .earl=${earlData}
  .question=${questionData}
  .firstPrompt=${firstPromptData}
  .promptId=${456}
  .group=${groupData}
  .voteCount=${10}
  .spinnersActive=${false}
  .leftAnswer=${leftAnswerData}
  .rightAnswer=${rightAnswerData}
  .appearanceLookup=${"appearanceString"}
  .breakForVertical=${false}
  .llmExplainOpen=${false}
  .level=${1}
  .currentLevelTargetVotes=${30}
></aoi-survey-voting>
```

Please note that the actual usage would involve dynamically binding the properties with the corresponding data and handling the events emitted by the element.