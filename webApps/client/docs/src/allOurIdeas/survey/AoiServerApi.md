# AoiServerApi

The `AoiServerApi` class extends the `YpServerApi` and provides methods to interact with the All Our Ideas server API. It includes functionalities for fetching data, submitting ideas, voting, and more.

## Properties

| Name        | Type   | Description                        |
|-------------|--------|------------------------------------|
| baseUrlPath | string | The base URL path for API requests |

## Methods

| Name                      | Parameters                                                                                          | Return Type                        | Description                                                                 |
|---------------------------|-----------------------------------------------------------------------------------------------------|------------------------------------|-----------------------------------------------------------------------------|
| constructor               | urlPath: string = "/api/allOurIdeas"                                                                | void                               | Initializes a new instance of the `AoiServerApi` class with a base URL path.|
| getEarlData               | groupId: number                                                                                     | AoiEarlResponse                    | Fetches EARL data for a specific group.                                     |
| getPrompt                 | groupId: number, questionId: number                                                                 | Promise<AoiPromptData>             | Retrieves the prompt for a specific question in a group.                    |
| getSurveyResults          | groupId: number                                                                                     | Promise<AoiChoiceData[]>           | Fetches survey results for a specific group.                                |
| getSurveyAnalysis         | groupId: number, wsClientId: string, analysisIndex: number, analysisTypeIndex: number, languageName: string | AoiAnalysisResponse                | Retrieves survey analysis data.                                             |
| checkLogin                |                                                                                                     | Promise<boolean>                   | Checks if the user is logged in, and attempts anonymous registration if not.|
| submitIdea                | groupId: number, questionId: number, newIdea: string                                                | Promise<AoiAddIdeaResponse \| null>| Submits a new idea for a specific question in a group.                      |
| postVote                  | groupId: number, questionId: number, promptId: number, locale: string, body: AoiVoteData, direction: "left" \| "right" \| "skip" | Promise<AoiVoteResponse \| null>   | Posts a vote for a specific prompt in a question.                           |
| postVoteSkip              | groupId: number, questionId: number, promptId: number, locale: string, body: AoiVoteSkipData        | Promise<AoiVoteResponse \| null>   | Posts a vote skip for a specific prompt in a question.                      |
| getResults                | groupId: number, questionId: number, showAll: boolean = false                                       | Promise<AoiChoiceData[]>           | Retrieves results for a specific question, optionally showing all results.  |
| llmAnswerConverstation    | groupId: number, wsClientId: string, chatLog: YpSimpleChatLog[], languageName: string               | Promise<void>                      | Sends a conversation log for LLM answer explanation.                        |

## Examples

```typescript
// Example usage of the AoiServerApi class
const api = new AoiServerApi();

// Fetch EARL data
const earlData = api.getEarlData(123);

// Get a prompt for a question
api.getPrompt(123, 456).then(prompt => {
  console.log(prompt);
});

// Submit a new idea
api.submitIdea(123, 456, "New Idea").then(response => {
  if (response) {
    console.log("Idea submitted successfully");
  } else {
    console.log("Failed to submit idea");
  }
});

// Post a vote
api.postVote(123, 456, 789, "en", { choiceId: 1 }, "left").then(response => {
  if (response) {
    console.log("Vote submitted successfully");
  } else {
    console.log("Failed to submit vote");
  }
});
```