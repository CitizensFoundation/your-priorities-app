# Service: YpBaseAssistant

An abstract base class for building AI assistant/chatbot services using OpenAI's API, WebSockets, Redis, and a domain-driven workflow. It manages conversation state, tool/function execution, mode transitions, and streaming responses to clients. Subclasses must implement the `defineAvailableModes` method to specify available assistant modes and their tools.

---

## Inheritance

- Extends: [`YpBaseChatBot`](../../services/llms/baseChatBot.md)

---

## Constructor

```typescript
constructor(
  wsClientId: string,
  wsClients: Map<string, WebSocket>,
  redis: ioredis.Redis,
  redisKey: string,
  domainId: number
)
```

**Parameters:**

| Name         | Type                        | Description                                 |
|--------------|-----------------------------|---------------------------------------------|
| wsClientId   | `string`                    | Unique WebSocket client identifier.         |
| wsClients    | `Map<string, WebSocket>`    | Map of all active WebSocket clients.        |
| redis        | `ioredis.Redis`             | Redis client instance.                      |
| redisKey     | `string`                    | Redis key for session/memory storage.       |
| domainId     | `number`                    | Domain identifier (required).               |

---

## Properties

| Name                        | Type                                      | Description                                                                                 |
|-----------------------------|-------------------------------------------|---------------------------------------------------------------------------------------------|
| `voiceEnabled`              | `boolean`                                 | Whether voice is enabled for the assistant.                                                 |
| `openaiClient`              | `OpenAI`                                  | OpenAI API client instance.                                                                 |
| `memory`                    | `YpBaseAssistantMemoryData`               | Assistant's memory/session data.                                                            |
| `persistMemory`             | `boolean`                                 | Whether to persist memory to Redis.                                                         |
| `domainId`                  | `number`                                  | Domain identifier.                                                                          |
| `DEBUG`                     | `boolean`                                 | Debug flag for verbose logging.                                                             |
| `modes`                     | `Map<YpAssistantMode, AssistantChatbotMode>` | Registered assistant modes.                                                             |
| `availableTools`            | `Map<string, AssistantChatbotTool>`       | Registered tools/functions available to the assistant.                                      |
| `toolCallTimeout`           | `number`                                  | Timeout for tool calls in milliseconds (default: 30000).                                    |
| `maxModeTransitions`        | `number`                                  | Maximum allowed mode transitions (default: 10).                                             |
| `redis`                     | `ioredis.Redis`                           | Redis client instance.                                                                      |
| `modelName`                 | `string`                                  | OpenAI model name (from env or default).                                                    |
| `defaultSystemPrompt`       | `string`                                  | Default system prompt for the assistant.                                                    |

---

## Methods

### Abstract

#### `defineAvailableModes()`

```typescript
abstract defineAvailableModes(): Promise<AssistantChatbotMode[]>
```
- **Description:** Subclasses must implement this to define available assistant modes and their tools.

---

### Memory & State Management

#### `setupMemoryAsync()`

```typescript
async setupMemoryAsync(): Promise<void>
```
- Loads memory if not already loaded.

#### `loadMemoryAsync()`

```typescript
async loadMemoryAsync(): Promise<void>
```
- Loads memory from storage.

#### `getCleanedParams<T>(params: string | T): T`

- Converts stringified params to object if needed.

#### `setCurrentMode(mode: YpAssistantMode)`

- Sets the current assistant mode and saves memory.

#### `initializeModes()`

- Loads and registers all available modes and their tools.

#### `getCurrentModeFunctions(): AssistantChatbotTool[]`

- Returns the tools/functions available in the current mode.

#### `get isLoggedIn(): boolean`

- Returns `true` if a user is logged in (based on memory).

#### `renderLoginStatus(): string`

- Returns an HTML snippet indicating login status.

#### `getCurrentSystemPrompt(): string`

- Returns the system prompt for the current mode, including login status and further instructions.

#### `setModeData<T>(type: string, data: T): Promise<void>`

- Sets mode-specific data in memory.

#### `getModeData<T>(): T | undefined`

- Gets mode-specific data from memory.

---

### Conversation & Streaming

#### `conversation(chatLog: YpSimpleChatLog[])`

- Main conversation handler. Prepares messages, tools, and streams OpenAI responses to the client.

#### `streamWebSocketResponses(stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>)`

- Handles streaming OpenAI responses, including tool/function calls, and sends data to the client via WebSocket.

#### `convertToOpenAIMessages(chatLog: YpSimpleChatLog[]): ChatCompletionMessageParam[]`

- Converts internal chat log to OpenAI message format.

---

### Tool/Function Handling

#### `handleToolCalls(toolCalls: Map<string, ToolCall>): Promise<void>`

- Executes all tool calls, sends results to the client, and updates memory.

#### `handleToolResponses(toolResponses: ToolResponseMessage[]): Promise<void>`

- Handles tool responses by creating a new OpenAI completion and streaming the result.

#### `convertToolResultToMessage(toolCall: ToolCall, result: ToolExecutionResult): ToolResponseMessage`

- Converts a tool execution result to a message format for OpenAI.

---

### Mode Switching

#### `handleModeSwitch(newMode: YpAssistantMode, reason: string, params: any): Promise<void>`

- Handles switching between assistant modes, including validation, cleanup, and notification.

#### `validateModeTransition(fromMode: YpAssistantMode, toMode: YpAssistantMode): boolean`

- Validates if a mode transition is allowed.

#### `cleanupMode(mode: YpAssistantMode): Promise<void>`

- Cleans up resources for a mode, archives mode data if needed.

---

### WebSocket & Event Handling

#### `destroy()`

- Cleans up event listeners and references.

#### `removeClientSystemMessageListener()`

- Removes the WebSocket message listener.

#### `handleClientSystemMessage(data: Buffer)`

- Handles incoming system messages from the client.

#### `setupClientSystemMessageListener()`

- Sets up the WebSocket message listener.

#### `emit(event: string, ...args: any[])`

- Emits an event on the assistant's internal event emitter.

#### `on(event: string, listener: (...args: any[]) => void)`

- Registers an event listener.

---

### Client System Message Processing

#### `processClientSystemMessage(clientEvent: YpAssistantClientSystemMessage)`

- Handles specific client system messages (e.g., user login, agent configuration submission, agent run changes), updates memory, and emits events.

---

### Subscription & Agent Data

#### `getCurrentAgentProduct(): Promise<YpAgentProductAttributes | undefined>`

- Returns the current agent product based on memory.

#### `getCurrentSubscriptionPlan(): Promise<YpSubscriptionPlanAttributes | undefined>`

- Returns the current subscription plan.

#### `getCurrentSubscription(): Promise<YpSubscriptionAttributes | undefined>`

- Returns the current subscription.

#### `getCurrentAgentRun(): Promise<YpAgentProductRunAttributes | undefined>`

- Returns the current agent run.

#### `updateCurrentAgentProductPlan(subscriptionPlanId: number, subscriptionId: number | null): Promise<void>`

- Updates the current agent product plan in memory and saves it.

#### `getAgentProduct(agentProductId: number): Promise<YpAgentProduct | null>`

- Fetches an agent product by ID.

---

### Chat Log Management

#### `addUserMessage(message: string): Promise<void>`

- Adds a user message to the chat log.

#### `addAssistantMessage(message: string): Promise<void>`

- Adds an assistant message to the chat log.

#### `addAssistantHtmlMessage(html: string, uniqueToken?: string): Promise<void>`

- Adds an assistant HTML message to the chat log.

---

### Miscellaneous

#### `maybeSendTextResponse(message: string): Promise<void>`

- Sends a text response to the client if voice is not enabled.

#### `sendAvatarUrlChange(url: string | null, avatarName: string | null)`

- Sends an avatar URL change event to the client.

#### `updateAiModelSession(message: string): Promise<void>`

- Handles updating the AI model session (can be overridden).

---

## Types & Interfaces Used

- `YpBaseAssistantMemoryData`
- `YpAssistantMode`
- `AssistantChatbotMode`
- `AssistantChatbotTool`
- `ToolCall`
- `ToolExecutionResult`
- `ToolResponseMessage`
- `YpSimpleChatLog`
- `YpAssistantClientSystemMessage`
- `YpAssistantMessage`
- `YpAgentProductAttributes`
- `YpSubscriptionPlanAttributes`
- `YpSubscriptionAttributes`
- `YpAgentProductRunAttributes`
- [`YpAgentProduct`](../models/agentProduct.md)
- [`YpSubscription`](../models/subscription.md)
- [`YpSubscriptionPlan`](../models/subscriptionPlan.md)
- [`YpAgentProductRun`](../models/agentProductRun.md)

---

## Exported Enums

### `CommonModes`

| Name           | Value             | Description                        |
|----------------|-------------------|------------------------------------|
| ErrorRecovery  | "error_recovery"  | Used for error recovery mode.      |

---

## Example Usage

```typescript
class MyAssistant extends YpBaseAssistant {
  async defineAvailableModes(): Promise<AssistantChatbotMode[]> {
    // Return an array of modes and their tools
  }
}

// Usage
const assistant = new MyAssistant(wsClientId, wsClients, redis, redisKey, domainId);
await assistant.conversation(chatLog);
```

---

## Notes

- This class is **abstract** and must be subclassed.
- It is designed for use in a real-time, stateful, multi-user chatbot/assistant system.
- Integrates with OpenAI's streaming API, Redis for memory, and WebSocket for client communication.
- Handles complex workflows, tool/function execution, and robust error handling.

---

## See Also

- [`YpBaseChatBot`](../../services/llms/baseChatBot.md)
- [`YpAgentProduct`](../models/agentProduct.md)
- [`YpSubscription`](../models/subscription.md)
- [`YpSubscriptionPlan`](../models/subscriptionPlan.md)
- [`YpAgentProductRun`](../models/agentProductRun.md)
