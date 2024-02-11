# AoiAdminServerApi

A subclass of `YpServerApi` that provides administrative functionalities for managing choices and ideas within the All Our Ideas platform.

## Properties

| Name         | Type   | Description                           |
|--------------|--------|---------------------------------------|
| baseUrlPath  | string | The base URL path for the API calls.  |

## Methods

| Name                      | Parameters                                      | Return Type            | Description                                                                                   |
|---------------------------|-------------------------------------------------|------------------------|-----------------------------------------------------------------------------------------------|
| getChoices                | communityId: number, questionId: number         | Promise<AoiChoiceData[]> | Fetches the choices for a given community and question.                                       |
| submitIdeasForCreation    | communityId: number, ideas: string[], questionName: string | Promise<AoiEarlData>    | Submits a list of ideas for creation under a specific question.                               |
| startGenerateIdeas        | question: string, communityId: number, wsClientSocketId: string, currentIdeas: string[] | Promise<void>           | Initiates the idea generation process for a given question.                                   |
| updateChoice              | communityId: number, questionId: number, choiceId: number, choiceData: AoiAnswerToVoteOnData | Promise<void>           | Updates the data for a specific choice.                                                       |
| updateGroupChoice         | groupId: number, questionId: number, choiceId: number, choiceData: AoiAnswerToVoteOnData | Promise<void>           | Updates the data for a specific choice through a group.                                       |
| updateActive              | communityId: number, questionId: number, choiceId: number, active: boolean | Promise<void>           | Updates the active status of a choice.                                                        |
| updateName                | communityId: number, questionId: number, name: string | Promise<void>           | Updates the name of a question.                                                               |
| toggleIdeaActive          | groupId: number, choiceId: number              | Promise<void>           | Toggles the active status of an idea.                                                         |

## Examples

```typescript
// Example usage of AoiAdminServerApi to fetch choices
const api = new AoiAdminServerApi();
const communityId = 1;
const questionId = 2;
api.getChoices(communityId, questionId).then((choices) => {
  console.log(choices);
});

// Example usage of AoiAdminServerApi to submit ideas for creation
const ideas = ['Idea 1', 'Idea 2'];
const questionName = 'New Question';
api.submitIdeasForCreation(communityId, ideas, questionName).then((response) => {
  console.log(response);
});

// Example usage of AoiAdminServerApi to start generating ideas
const wsClientSocketId = 'socket-id';
const currentIdeas = ['Existing Idea 1', 'Existing Idea 2'];
api.startGenerateIdeas(questionName, communityId, wsClientSocketId, currentIdeas).then(() => {
  console.log('Idea generation started');
});

// Example usage of AoiAdminServerApi to update a choice
const choiceId = 3;
const choiceData = { /* ... */ };
api.updateChoice(communityId, questionId, choiceId, choiceData).then(() => {
  console.log('Choice updated');
});

// Example usage of AoiAdminServerApi to update a group choice
const groupId = 4;
api.updateGroupChoice(groupId, questionId, choiceId, choiceData).then(() => {
  console.log('Group choice updated');
});

// Example usage of AoiAdminServerApi to update the active status of a choice
const active = true;
api.updateActive(communityId, questionId, choiceId, active).then(() => {
  console.log('Choice active status updated');
});

// Example usage of AoiAdminServerApi to update the name of a question
const newName = 'Updated Question Name';
api.updateName(communityId, questionId, newName).then(() => {
  console.log('Question name updated');
});

// Example usage of AoiAdminServerApi to toggle the active status of an idea
api.toggleIdeaActive(groupId, choiceId).then(() => {
  console.log('Idea active status toggled');
});
```