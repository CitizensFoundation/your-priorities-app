# Class: ExplainAnswersAssistant

An AI assistant class for providing explanations and guidance during pairwise voting on answers to a question. It leverages OpenAI's GPT models to generate explanations, pros/cons, and clarifying questions, always responding in the user's preferred language. The assistant streams responses to a WebSocket client and manages chat history in Redis.

**Extends:** [YpBaseChatBot](../../llms/baseChatBot.md)

---

## Constructor

```typescript
constructor(
  wsClientId: string,
  wsClients: Map<string, WebSocket>,
  languageName: string
)
```

Initializes a new instance of `ExplainAnswersAssistant`.

### Parameters

| Name         | Type                          | Description                                                                 |
|--------------|-------------------------------|-----------------------------------------------------------------------------|
| wsClientId   | `string`                      | Unique identifier for the WebSocket client.                                 |
| wsClients    | `Map<string, WebSocket>`      | Map of all active WebSocket clients.                                        |
| languageName | `string`                      | The language in which the assistant should respond.                         |

---

## Properties

| Name         | Type         | Description                                                                 |
|--------------|--------------|-----------------------------------------------------------------------------|
| openaiClient | `OpenAI`     | Instance of the OpenAI API client.                                          |
| modelName    | `string`     | Name of the OpenAI model to use (default: `"gpt-4o"`).                      |
| maxTokens    | `number`     | Maximum number of tokens for the model's response (default: `4000`).        |
| temperature  | `number`     | Sampling temperature for the model (default: `0.8`).                        |
| languageName | `string`     | The language in which the assistant will answer.                            |

---

## Method: renderSystemPrompt

```typescript
renderSystemPrompt(): string
```

Generates the system prompt that instructs the AI model on how to respond to the user. The prompt includes formatting instructions, language requirements, and behavioral guidelines.

### Returns

- `string` — The system prompt to be used as the initial message for the AI model.

---

## Method: explainConversation

```typescript
explainConversation(chatLog: YpSimpleChatLog[]): Promise<void>
```

Processes a chat log, constructs a message sequence for the AI model, and streams the AI's response to the WebSocket client. The method ensures the system prompt is included and that the conversation is conducted in the specified language.

### Parameters

| Name     | Type                  | Description                                      |
|----------|-----------------------|--------------------------------------------------|
| chatLog  | `YpSimpleChatLog[]`   | Array of chat log messages to be explained.      |

### Returns

- `Promise<void>`

---

## Usage Example

```typescript
const assistant = new ExplainAnswersAssistant(
  wsClientId,
  wsClients,
  "en"
);

await assistant.explainConversation(chatLog);
```

---

## Dependencies

- [OpenAI](https://www.npmjs.com/package/openai): For interacting with OpenAI's GPT models.
- [ws (WebSocket)](https://www.npmjs.com/package/ws): For WebSocket communication.
- [ioredis](https://www.npmjs.com/package/ioredis): For Redis-based chat log storage.
- [uuid](https://www.npmjs.com/package/uuid): For generating unique Redis keys.
- [YpBaseChatBot](../../llms/baseChatBot.md): Base class providing chat bot infrastructure.

---

## Environment Variables

| Name                | Description                                              |
|---------------------|----------------------------------------------------------|
| OPENAI_API_KEY      | API key for authenticating with OpenAI.                  |
| REDIS_MEMORY_URL    | Redis connection string (supports `rediss://` for TLS).  |
| REDIS_URL           | Fallback Redis connection string.                        |

---

## Related Types

### YpSimpleChatLog

```typescript
interface YpSimpleChatLog {
  sender: string;
  message: string;
}
```

---

## See Also

- [YpBaseChatBot](../../llms/baseChatBot.md)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference/introduction)
- [ws (WebSocket) Documentation](https://github.com/websockets/ws)
- [ioredis Documentation](https://github.com/luin/ioredis)
