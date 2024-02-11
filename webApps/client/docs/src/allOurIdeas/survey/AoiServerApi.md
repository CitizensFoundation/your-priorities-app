# AoiServerApi

AoiServerApi is an extension of the YpServerApi class that provides methods to interact with the All Our Ideas API.

## Properties

| Name         | Type   | Description                           |
|--------------|--------|---------------------------------------|
| baseUrlPath  | string | The base URL path for the API calls.  |

## Methods

| Name                    | Parameters                                                                                   | Return Type            | Description                                                                                   |
|-------------------------|----------------------------------------------------------------------------------------------|------------------------|-----------------------------------------------------------------------------------------------|
| constructor             | urlPath: string = "/api/allOurIdeas"                                                         | none                   | Initializes a new instance of AoiServerApi with an optional URL path.                         |
| getEarlData             | groupId: number                                                                              | AoiEarlResponse        | Retrieves EARL data for a specified group ID.                                                 |
| getPrompt               | groupId: number, questionId: number                                                          | Promise<AoiPromptData> | Asynchronously retrieves a prompt for a specified group and question ID.                      |
| getSurveyResults        | groupId: number                                                                              | Promise<AoiChoiceData[]> | Asynchronously retrieves survey results for a specified group ID.                             |
| getSurveyAnalysis       | groupId: number, wsClientId: string, analysisIndex: number, analysisTypeIndex: number, languageName: string | AoiAnalysisResponse    | Retrieves survey analysis data for a specified group ID and analysis parameters.             |
| submitIdea              | groupId: number, questionId: number, newIdea: string                                        | AoiAddIdeaResponse     | Submits a new idea to a specified group and question ID.                                      |
| postVote                | groupId: number, questionId: number, promptId: number, locale: string, body: AoiVoteData, direction: "left" \| "right" \| "skip" | AoiVoteResponse        | Posts a vote for a specified group, question, and prompt ID, with additional parameters.      |
| postVoteSkip            | groupId: number, questionId: number, promptId: number, locale: string, body: AoiVoteSkipData | AoiVoteResponse        | Posts a vote skip for a specified group, question, and prompt ID, with additional parameters. |
| getResults              | groupId: number, questionId: number                                                          | Promise<AoiChoiceData[]> | Asynchronously retrieves results for a specified group and question ID.                       |
| llmAnswerConverstation  | groupId: number, wsClientId: string, chatLog: PsSimpleChatLog[]                              | Promise<void>          | Asynchronously sends a conversation log to the server for processing.                         |

## Examples

```typescript
// Example usage of AoiServerApi to get survey results
const api = new AoiServerApi();
const groupId = 123; // example group ID
api.getSurveyResults(groupId).then((results) => {
  console.log(results);
});
```

```typescript
// Example usage of AoiServerApi to submit a new idea
const api = new AoiServerApi();
const groupId = 123; // example group ID
const questionId = 456; // example question ID
const newIdea = "A new idea for the survey";
api.submitIdea(groupId, questionId, newIdea).then((response) => {
  console.log(response);
});
```

```typescript
// Example usage of AoiServerApi to post a vote
const api = new AoiServerApi();
const groupId = 123; // example group ID
const questionId = 456; // example question ID
const promptId = 789; // example prompt ID
const locale = "en-US"; // example locale
const body = { /* ... */ }; // example vote data
const direction = "left"; // example direction
api.postVote(groupId, questionId, promptId, locale, body, direction).then((response) => {
  console.log(response);
});
```

Please note that the actual implementation of the `AoiServerApi` class may require additional types such as `AoiEarlResponse`, `AoiPromptData`, `AoiChoiceData`, `AoiAnalysisResponse`, `AoiAddIdeaResponse`, `AoiVoteData`, `AoiVoteSkipData`, and `PsSimpleChatLog` to be defined elsewhere in your codebase.