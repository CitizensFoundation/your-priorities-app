# Service: AiHelper

The `AiHelper` class provides a set of methods for interacting with the OpenAI API, specifically for chat completions, moderation, streaming responses over WebSocket, and generating or analyzing answer ideas. It is designed to facilitate AI-powered moderation, idea generation, and analysis in real-time applications, with optional Redis caching for full responses.

## Constructor

### `new AiHelper(wsClientSocket?: WebSocket)`
Creates a new instance of `AiHelper`.

| Name           | Type      | Description                                 |
|----------------|-----------|---------------------------------------------|
| wsClientSocket | WebSocket \| undefined | Optional WebSocket client for streaming responses to the client. |

---

## Properties

| Name                       | Type      | Description                                                                                 |
|----------------------------|-----------|---------------------------------------------------------------------------------------------|
| openaiClient               | OpenAI    | Instance of the OpenAI client, initialized with the API key from environment variables.      |
| wsClientSocket             | WebSocket \| undefined | WebSocket client for sending streaming responses.                                 |
| modelName                  | string    | The OpenAI model to use (default: `"gpt-4o"`).                                              |
| maxTokens                  | number    | Maximum number of tokens for completions (default: `2048`).                                 |
| temperature                | number    | Sampling temperature for completions (default: `0.7`).                                      |
| cacheExpireTime            | number    | Expiry time for Redis cache in seconds (default: `3600`).                                   |
| redisClient                | any       | Optional Redis client for caching full responses.                                            |
| cacheKeyForFullResponse    | string \| undefined | Optional cache key for storing full responses in Redis.                          |

---

## Methods

### moderationSystemPrompt(instructions: string): string

Generates a system prompt for moderation tasks.

| Name         | Type   | Description                        |
|--------------|--------|------------------------------------|
| instructions | string | Moderation instructions to include. |

**Returns:** `string` — The formatted system prompt.

---

### moderationUserPrompt(question: string, answer: string): string

Generates a user prompt for moderation, including the question and answer.

| Name    | Type   | Description         |
|---------|--------|---------------------|
| question| string | The question text.  |
| answer  | string | The answer to moderate. |

**Returns:** `string` — The formatted user prompt.

---

### getModerationResponse(instructions: string, question: string, answerToModerate: string): Promise<boolean>

Checks if an answer passes moderation using OpenAI's chat completions.

| Name            | Type   | Description                        |
|-----------------|--------|------------------------------------|
| instructions    | string | Moderation instructions.           |
| question        | string | The question text.                 |
| answerToModerate| string | The answer to be moderated.        |

**Returns:** `Promise<boolean>` — `true` if the answer passes moderation, `false` otherwise.

---

### streamChatCompletions(messages: any[]): Promise<void>

Streams chat completions from OpenAI and sends the output to the WebSocket client.

| Name     | Type    | Description                        |
|----------|---------|------------------------------------|
| messages | any[]   | Array of chat message objects.      |

**Returns:** `Promise<void>`

---

### sendToClient(sender: string, message: string, type?: string): void

Sends a message to the WebSocket client.

| Name   | Type   | Description                                 |
|--------|--------|---------------------------------------------|
| sender | string | The sender identifier (e.g., "bot").        |
| message| string | The message content.                        |
| type   | string | The message type (default: `"stream"`).     |

**Returns:** `void`

---

### streamWebSocketResponses(stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>): Promise<void>

Streams OpenAI chat completion chunks to the WebSocket client, optionally caching the full response in Redis.

| Name   | Type   | Description                                 |
|--------|--------|---------------------------------------------|
| stream | Stream<OpenAI.Chat.Completions.ChatCompletionChunk> | The OpenAI streaming response. |

**Returns:** `Promise<void>`

---

### getAnswerIdeas(question: string, previousIdeas: string[] \| null, firstMessage: string \| null): Promise<string \| null \| undefined>

Generates answer ideas for a given question, optionally considering previous ideas and a first message. Moderates the question before generating ideas.

| Name          | Type                | Description                                         |
|---------------|---------------------|-----------------------------------------------------|
| question      | string              | The question to generate ideas for.                 |
| previousIdeas | string[] \| null    | Optional array of previous answer ideas.            |
| firstMessage  | string \| null      | Optional first message to guide the style/tone.     |

**Returns:** `Promise<string \| null \| undefined>` — Returns `null` if flagged by moderation, otherwise streams ideas to the client.

---

### getAiAnalysis(
  questionId: number,
  contextPrompt: string,
  answers: AoiChoiceData[],
  cacheKeyForFullResponse: string,
  redisClient: any,
  locale: string,
  topOrBottomIdeasText: string,
  typeOfAnalysisText: string
): Promise<string \| null \| undefined>

Performs AI-powered analysis of answer ideas, with moderation and streaming of the analysis to the client. Optionally caches the full response in Redis.

| Name                   | Type         | Description                                         |
|------------------------|--------------|-----------------------------------------------------|
| questionId             | number       | The ID of the question being analyzed.              |
| contextPrompt          | string       | Additional context for the system prompt.           |
| answers                | AoiChoiceData[] | Array of answer data objects (see below).        |
| cacheKeyForFullResponse| string       | Redis cache key for storing the full response.      |
| redisClient            | any          | Redis client instance.                              |
| locale                 | string       | Output language for the analysis.                   |
| topOrBottomIdeasText   | string       | Text indicating if analyzing top or bottom ideas.   |
| typeOfAnalysisText     | string       | Type of analysis to perform.                        |

**Returns:** `Promise<string \| null \| undefined>` — Returns `null` if flagged by moderation, otherwise streams analysis to the client.

---

## Types

### AoiChoiceData

**Note:** This type is referenced but not defined in the file. It is expected to have at least the following structure:

| Property | Type   | Description                        |
|----------|--------|------------------------------------|
| data     | { content: string } | The answer content.      |
| wins     | number | Number of wins for the answer.      |
| losses   | number | Number of losses for the answer.    |

---

## Example Usage

```typescript
import { AiHelper } from './AiHelper';
import { WebSocket } from 'ws';

const ws = new WebSocket('ws://localhost:8080');
const aiHelper = new AiHelper(ws);

const question = "What are the benefits of renewable energy?";
aiHelper.getAnswerIdeas(question, null, null);
```

---

## Dependencies

- [openai](https://www.npmjs.com/package/openai)
- [ws (WebSocket)](https://www.npmjs.com/package/ws)
- Redis client (type: `any`, not specified)

---

## See Also

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference/introduction)
- [WebSocket API (ws)](https://github.com/websockets/ws)

---

## Exported

- `AiHelper` (class)

---

## Notes

- The class expects the `OPENAI_API_KEY` environment variable to be set.
- Redis caching is optional and only used if `redisClient` and `cacheKeyForFullResponse` are provided.
- All streaming methods require a valid WebSocket client to send data to the client in real time.
- The `AoiChoiceData` type should be defined elsewhere in the codebase for type safety.

---