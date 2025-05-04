# AoiServerApi

AoiServerApi is an API client for interacting with the "All Our Ideas" server endpoints. It extends `YpServerApi` and provides methods for fetching data, submitting ideas, voting, and handling user authentication for group-based idea surveys.

## Properties

| Name         | Type     | Description                                      |
|--------------|----------|--------------------------------------------------|
| baseUrlPath  | string   | The base URL path for API requests. Inherited from `YpServerApi`. |

## Methods

| Name                      | Parameters                                                                                                                                                                                                 | Return Type                              | Description                                                                                                    |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| constructor               | urlPath?: string = "/api/allOurIdeas"                                                                                                                               | AoiServerApi                             | Constructs a new instance with the given base URL path.                                                        |
| getEarlData               | groupId: number                                                                                                                                                     | AoiEarlResponse                          | Fetches Earl data for a specific group.                                                                        |
| getPrompt                 | groupId: number, questionId: number                                                                                                                                 | Promise<AoiPromptData>                   | Fetches the prompt data for a specific group and question.                                                     |
| getSurveyResults          | groupId: number                                                                                                                                                     | Promise<AoiChoiceData[]>                 | Fetches survey results for a specific group.                                                                   |
| getSurveyAnalysis         | groupId: number, wsClientId: string, analysisIndex: number, analysisTypeIndex: number, languageName: string                                                         | AoiAnalysisResponse                      | Fetches survey analysis data for a group and analysis parameters.                                              |
| checkLogin                | None                                                                                                                                                                | Promise<boolean>                         | Checks if the user is logged in, and if not, attempts anonymous registration if possible.                      |
| submitIdea                | groupId: number, questionId: number, newIdea: string                                                                                                                | Promise<AoiAddIdeaResponse \| null>      | Submits a new idea for a specific group and question. Requires user to be logged in.                           |
| postVote                  | groupId: number, questionId: number, promptId: number, locale: string, body: AoiVoteData, direction: "left" \| "right" \| "skip"                                    | Promise<AoiVoteResponse \| null>         | Submits a vote or skip for a prompt. Requires user to be logged in.                                            |
| postVoteSkip              | groupId: number, questionId: number, promptId: number, locale: string, body: AoiVoteSkipData                                                                        | Promise<AoiVoteResponse \| null>         | Submits a skip vote for a prompt. Requires user to be logged in.                                               |
| getResults                | groupId: number, questionId: number, showAll?: boolean = false                                                                                                      | Promise<AoiChoiceData[]>                 | Fetches the results for a specific group and question, optionally showing all results.                         |
| llmAnswerConverstation    | groupId: number, wsClientId: string, chatLog: YpSimpleChatLog[], languageName: string                                                                              | Promise<void>                            | Sends a conversation log for LLM answer explanation.                                                           |

## Examples

```typescript
// Create an instance of the API
const api = new AoiServerApi();

// Fetch Earl data for a group
const earlData = api.getEarlData(123);

// Fetch prompt data
api.getPrompt(123, 456).then(prompt => {
  console.log(prompt);
});

// Submit a new idea
api.submitIdea(123, 456, "My new idea").then(response => {
  if (response) {
    console.log("Idea submitted:", response);
  }
});

// Post a vote
api.postVote(123, 456, 789, "en", { vote: "left" }, "left").then(response => {
  if (response) {
    console.log("Vote submitted:", response);
  }
});

// Get survey results
api.getSurveyResults(123).then(results => {
  console.log("Survey results:", results);
});
```
