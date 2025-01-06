# AoiAdminServerApi

The `AoiAdminServerApi` class extends the `YpServerApi` and provides methods to interact with the All Our Ideas API. It allows for managing choices, submitting ideas, generating ideas, and updating various properties related to questions and choices.

## Properties

| Name        | Type   | Description                        |
|-------------|--------|------------------------------------|
| baseUrlPath | string | The base URL path for the API calls.|

## Methods

| Name                  | Parameters                                                                                          | Return Type         | Description                                                                 |
|-----------------------|-----------------------------------------------------------------------------------------------------|---------------------|-----------------------------------------------------------------------------|
| getChoices            | domainId: number \| undefined, communityId: number \| undefined, questionId: number                 | Promise<AoiChoiceData[]> | Fetches the choices for a given question.                                   |
| submitIdeasForCreation| domainId: number \| undefined, communityId: number \| undefined, ideas: string[], questionName: string | Promise<AoiEarlData> | Submits new ideas for creation under a specific question.                   |
| startGenerateIdeas    | question: string, domainId: number \| undefined, communityId: number \| undefined, wsClientSocketId: string, currentIdeas: string[] | Promise<void>       | Initiates the generation of ideas for a given question.                     |
| updateChoice          | domainId: number \| undefined, communityId: number \| undefined, questionId: number, choiceId: number, choiceData: AoiAnswerToVoteOnData | Promise<void>       | Updates a specific choice with new data.                                    |
| updateGroupChoice     | groupId: number, questionId: number, choiceId: number, choiceData: AoiAnswerToVoteOnData            | Promise<void>       | Updates a choice within a group with new data.                              |
| updateActive          | domainId: number \| undefined, communityId: number \| undefined, questionId: number, choiceId: number, active: boolean | Promise<void>       | Updates the active status of a choice.                                      |
| updateName            | domainId: number \| undefined, communityId: number \| undefined, questionId: number, name: string   | Promise<void>       | Updates the name of a question.                                             |
| toggleIdeaActive      | groupId: number, choiceId: number                                                                   | Promise<void>       | Toggles the active status of an idea within a group.                        |

## Examples

```typescript
const api = new AoiAdminServerApi();

// Fetch choices for a question
api.getChoices(1, undefined, 42).then(choices => {
  console.log(choices);
});

// Submit new ideas for a question
api.submitIdeasForCreation(1, undefined, ['Idea 1', 'Idea 2'], 'New Question').then(response => {
  console.log(response);
});

// Start generating ideas
api.startGenerateIdeas('Question?', 1, undefined, 'socket123', ['Existing Idea']).then(() => {
  console.log('Idea generation started');
});

// Update a choice
api.updateChoice(1, undefined, 42, 7, { text: 'Updated Choice' }).then(() => {
  console.log('Choice updated');
});

// Toggle idea active status
api.toggleIdeaActive(3, 7).then(() => {
  console.log('Idea active status toggled');
});
```