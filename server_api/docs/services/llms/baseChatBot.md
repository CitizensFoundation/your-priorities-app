# Class: YpBaseChatBot

The `YpBaseChatBot` class provides a foundational chatbot implementation that integrates with OpenAI's GPT models, manages chat memory using Redis, and communicates with clients via WebSocket. It is designed for extensibility and real-time conversational applications.

---

## Properties

| Name                        | Type                                      | Description                                                                                  |
|-----------------------------|-------------------------------------------|----------------------------------------------------------------------------------------------|
| wsClientId                  | `string`                                  | Unique identifier for the WebSocket client.                                                  |
| wsClientSocket              | `WebSocket`                               | The WebSocket connection for the current client.                                             |
| wsClients                   | `Map<string, WebSocket>`                  | Map of all connected WebSocket clients.                                                      |
| openaiClient                | `OpenAI`                                  | Instance of the OpenAI API client.                                                           |
| memory                      | `YpBaseChatBotMemoryData`                 | In-memory chat data for the current session.                                                 |
| redis                       | `ioredis.default`                         | Redis client instance for persistent memory.                                                 |
| redisKey                    | `string`                                  | Redis key used for storing/retrieving chat memory.                                           |
| temperature                 | `number`                                  | Temperature parameter for OpenAI completions (default: 0.7).                                 |
| maxTokens                   | `number`                                  | Maximum number of tokens for OpenAI completions (default: 16000).                            |
| llmModel                    | `string`                                  | OpenAI model name (default: "gpt-4o").                                                       |
| persistMemory               | `boolean`                                 | Whether to persist chat memory to Redis.                                                     |
| lastSentToUserAt            | `Date \| undefined`                       | Timestamp of the last message sent to the user.                                              |
| currentAssistantAvatarUrl   | `string \| undefined`                     | URL of the assistant's avatar image.                                                         |
| static redisMemoryKeyPrefix | `string`                                  | Prefix for Redis memory keys (`"yp-chatbot-memory-v4"`).                                     |

---

## Constructor

```typescript
constructor(
  wsClientId: string,
  wsClients: Map<string, WebSocket>,
  redisConnection: ioredis.default,
  redisKey: string
)
```

**Description:**  
Initializes a new instance of `YpBaseChatBot`, setting up WebSocket communication, Redis connection, and OpenAI client.

**Parameters:**

| Name            | Type                        | Description                                      |
|-----------------|----------------------------|--------------------------------------------------|
| wsClientId      | `string`                    | Unique client ID for the WebSocket connection.    |
| wsClients       | `Map<string, WebSocket>`    | Map of all WebSocket clients.                    |
| redisConnection | `ioredis.default`           | Redis client instance.                           |
| redisKey        | `string`                    | Redis key for storing chat memory.               |

---

## Methods

### destroy

```typescript
destroy(): void
```

**Description:**  
Destroys the current WebSocket client socket reference, effectively disconnecting the bot from the client.

---

### loadMemory

```typescript
loadMemory(): Promise<PsAgentBaseMemoryData | undefined>
```

**Description:**  
Loads chat memory from Redis using the configured `redisKey`. Returns the parsed memory object or `undefined` if not found.

---

### saveMemory

```typescript
saveMemory(): Promise<void>
```

**Description:**  
Saves the current in-memory chat data to Redis under the configured `redisKey`.

---

### renderSystemPrompt

```typescript
renderSystemPrompt(): string
```

**Description:**  
Returns a default system prompt string, encouraging the user to replace it in a fun and friendly way.

---

### sendAgentStart

```typescript
sendAgentStart(name: string, hasNoStreaming = true): void
```

**Description:**  
Sends a WebSocket message to the client indicating that an agent has started.

**Parameters:**

| Name           | Type      | Description                                 |
|----------------|-----------|---------------------------------------------|
| name           | `string`  | Name of the agent.                          |
| hasNoStreaming | `boolean` | Whether streaming is disabled (default: true). |

---

### sendAgentCompleted

```typescript
sendAgentCompleted(
  name: string,
  lastAgent?: boolean,
  error?: string
): void
```

**Description:**  
Sends a WebSocket message to the client indicating that an agent has completed its task.

**Parameters:**

| Name      | Type      | Description                                 |
|-----------|-----------|---------------------------------------------|
| name      | `string`  | Name of the agent.                          |
| lastAgent | `boolean` | Whether this is the last agent (default: false). |
| error     | `string`  | Error message, if any.                      |

---

### sendAgentUpdate

```typescript
sendAgentUpdate(message: string): void
```

**Description:**  
Sends an update message from the agent to the client via WebSocket.

**Parameters:**

| Name    | Type     | Description                |
|---------|----------|----------------------------|
| message | `string` | Update message to send.    |

---

### sendToClient

```typescript
sendToClient(
  sender: YpSenderType,
  message: string,
  type: YpAssistantMessageType = "stream",
  uniqueToken?: string,
  hiddenContextMessage?: boolean
): void
```

**Description:**  
Sends a message to the client via WebSocket, supporting different message types and optional avatar URLs.

**Parameters:**

| Name                | Type                        | Description                                         |
|---------------------|-----------------------------|-----------------------------------------------------|
| sender              | `YpSenderType`              | Sender type ("assistant", etc.).                    |
| message             | `string`                    | Message content.                                    |
| type                | `YpAssistantMessageType`    | Message type ("stream", "html", etc.).              |
| uniqueToken         | `string \| undefined`       | Optional unique token for the message.              |
| hiddenContextMessage| `boolean`                   | Whether the message is a hidden context message.    |

---

### streamWebSocketResponses

```typescript
streamWebSocketResponses(
  stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>
): Promise<void>
```

**Description:**  
Streams OpenAI chat completion responses to the client in real-time via WebSocket, updating the chat log and saving memory as needed.

**Parameters:**

| Name   | Type                                                        | Description                        |
|--------|-------------------------------------------------------------|------------------------------------|
| stream | `Stream<OpenAI.Chat.Completions.ChatCompletionChunk>`        | OpenAI streaming response object.  |

---

### saveMemoryIfNeeded

```typescript
saveMemoryIfNeeded(): Promise<void>
```

**Description:**  
Saves chat memory to Redis if `persistMemory` is enabled.

---

### setChatLog

```typescript
setChatLog(chatLog: YpSimpleChatLog[]): Promise<void>
```

**Description:**  
Sets the chat log in memory and persists it if required.

**Parameters:**

| Name    | Type                 | Description         |
|---------|----------------------|---------------------|
| chatLog | `YpSimpleChatLog[]`  | Array of chat log entries. |

---

### conversation

```typescript
conversation(chatLog: YpSimpleChatLog[]): Promise<void>
```

**Description:**  
Handles a conversation by updating the chat log, preparing messages for OpenAI, and streaming the response to the client.

**Parameters:**

| Name    | Type                 | Description         |
|---------|----------------------|---------------------|
| chatLog | `YpSimpleChatLog[]`  | Array of chat log entries. |

---

## Exported Constants

| Name      | Type     | Description                                                                 |
|-----------|----------|-----------------------------------------------------------------------------|
| DEBUG     | `boolean`| Debug flag for logging.                                                     |
| url       | `string` | Redis connection URL, from environment or default.                          |
| tlsOptions| `object \| undefined` | TLS options for Redis if using `rediss://`.                    |

---

## Configuration

- **Redis URL:**  
  The Redis connection URL is determined by the following environment variables (in order of precedence):  
  - `REDIS_MEMORY_URL`
  - `REDIS_URL`
  - Defaults to `"redis://localhost:6379"`

- **OpenAI API Key:**  
  The OpenAI client is initialized with the API key from the `OPENAI_API_KEY` environment variable.

---

## Types & Interfaces Used

> **Note:** The following types/interfaces are referenced but not defined in this file. They must be defined elsewhere in your codebase:

- `YpBaseChatBotMemoryData`
- `PsAgentBaseMemoryData`
- `PsAgentStartWsOptions`
- `PsAgentCompletedWsOptions`
- `PsValidationAgentResult`
- `YpAssistantMessage`
- `YpSenderType`
- `YpAssistantMessageType`
- `YpSimpleChatLog`

---

## Example Usage

```typescript
import { YpBaseChatBot } from './YpBaseChatBot';
import WebSocket from 'ws';
import ioredis from 'ioredis';

const wsClients = new Map<string, WebSocket>();
const redis = new ioredis();
const wsClientId = 'client-123';
const redisKey = 'yp-chatbot-memory-v4:client-123';

const bot = new YpBaseChatBot(wsClientId, wsClients, redis, redisKey);

// Use bot methods to handle chat, memory, and WebSocket communication
```

---

## See Also

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [ioredis Documentation](https://github.com/luin/ioredis)
- [ws (WebSocket) Documentation](https://github.com/websockets/ws)
- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts) (for related agent memory types)

---

**File:** `YpBaseChatBot.ts`