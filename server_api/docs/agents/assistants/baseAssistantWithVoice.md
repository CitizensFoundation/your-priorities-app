# Class: YpBaseAssistantWithVoice

An abstract base class extending [YpBaseAssistant](./baseAssistant.md) to add voice assistant capabilities. It manages the lifecycle and event forwarding for a voice-enabled chatbot, integrating with WebSocket clients and Redis for state management. This class is designed to be subclassed for assistants that require both text and voice interaction modes.

## Inheritance

- **Extends:** [YpBaseAssistant](./baseAssistant.md)

## Dependencies

- [`ws`](https://www.npmjs.com/package/ws): For WebSocket communication.
- [`ioredis`](https://www.npmjs.com/package/ioredis): For Redis client.
- [YpBaseChatBotWithVoice](./voiceAssistant.md): Voice-enabled chatbot logic.

---

## Constructor

```typescript
constructor(
  wsClientId: string,
  wsClients: Map<string, WebSocket>,
  redis: ioredis.Redis,
  voiceEnabled: boolean,
  redisKey: string,
  domainId: number
)
```

### Parameters

| Name         | Type                          | Description                                               |
|--------------|-------------------------------|-----------------------------------------------------------|
| wsClientId   | `string`                      | Unique identifier for the WebSocket client.               |
| wsClients    | `Map<string, WebSocket>`      | Map of all connected WebSocket clients.                   |
| redis        | `ioredis.Redis`               | Redis client instance for state management.               |
| voiceEnabled | `boolean`                     | Whether voice mode is enabled for this assistant.         |
| redisKey     | `string`                      | Redis key for storing assistant state.                    |
| domainId     | `number`                      | Domain identifier (required, throws if not provided).     |

---

## Properties

| Name                  | Type                                 | Description                                                                 |
|-----------------------|--------------------------------------|-----------------------------------------------------------------------------|
| voiceBot              | `YpBaseChatBotWithVoice \| undefined`| The voice-enabled chatbot instance.                                         |
| mainBotWsHandler      | `((data: Buffer) => void) \| undefined` | Handler for main bot WebSocket messages (voice events).                     |
| forwardEventHandler   | `((data: Buffer) => void) \| undefined` | Handler for forwarding events from the voice bot to the client.             |
| voiceEnabled          | `boolean`                            | Indicates if voice mode is enabled.                                         |

---

## Methods

### destroy()

```typescript
public override destroy(): void
```

Cleans up all resources, removes WebSocket listeners, destroys the voice bot, and calls the parent class's `destroy()` method.

---

### initialize()

```typescript
async initialize(): Promise<void>
```

Initializes the assistant, including modes and (if enabled) the voice bot.

---

### createVoiceBot()

```typescript
async createVoiceBot(): Promise<void>
```

Creates and initializes the `voiceBot` instance, sets up event forwarding, and configures the voice bot with the current system prompt, tools, and modalities. Also attaches a WebSocket message handler for voice-related events.

---

### destroyVoiceBot()

```typescript
destroyVoiceBot(): void
```

Destroys the `voiceBot` instance and removes its event listeners.

---

### setVoiceMode(enabled: boolean)

```typescript
async setVoiceMode(enabled: boolean): Promise<void>
```

Enables or disables voice mode. If disabling, destroys the voice bot. Notifies the client of the mode change via WebSocket.

#### Parameters

| Name    | Type      | Description                |
|---------|-----------|----------------------------|
| enabled | `boolean` | Whether to enable voice mode|

---

### handleModeSwitch(newMode, reason, params)

```typescript
async handleModeSwitch(
  newMode: YpAssistantMode,
  reason: string,
  params: any
): Promise<void>
```

Handles switching between assistant modes. Updates the voice bot's configuration and manages direct agent voice connections as needed.

#### Parameters

| Name    | Type              | Description                                 |
|---------|-------------------|---------------------------------------------|
| newMode | `YpAssistantMode` | The new mode to switch to.                  |
| reason  | `string`          | Reason for the mode switch.                 |
| params  | `any`             | Additional parameters for the mode switch.  |

---

### conversation(chatLog)

```typescript
async conversation(chatLog: YpSimpleChatLog[]): Promise<any>
```

Handles a conversation turn. If voice is enabled, updates the voice bot's config and delegates the conversation to it; otherwise, uses the parent class's conversation logic.

#### Parameters

| Name    | Type                   | Description                |
|---------|------------------------|----------------------------|
| chatLog | `YpSimpleChatLog[]`    | The chat log for the session.|

---

### Private: setupVoiceEventForwarder()

```typescript
private setupVoiceEventForwarder(): void
```

Sets up a handler to forward all relevant voice bot events to the client WebSocket. Handles both direct event forwarding and fallback to parent class message sending.

---

## Internal Event Handling

- **WebSocket "message" events:**  
  - Listens for `"voice_mode"` and `"voice_input"` messages from the client.
  - Forwards specific voice events from the voice bot to the client.

---

## Types

### VoiceToolResult

```typescript
interface VoiceToolResult extends ToolExecutionResult {
  data?: {
    message?: string;
    html?: string;
    [key: string]: any;
  };
}
```

Represents the result of a tool execution in voice mode, with optional message and HTML data.

---

## Usage Example

```typescript
class MyVoiceAssistant extends YpBaseAssistantWithVoice {
  // Implement abstract methods and extend as needed
}
```

---

## See Also

- [YpBaseAssistant](./baseAssistant.md)
- [YpBaseChatBotWithVoice](./voiceAssistant.md)
- [`ws` WebSocket](https://www.npmjs.com/package/ws)
- [`ioredis` Redis](https://www.npmjs.com/package/ioredis)

---

## Notes

- This class is **abstract** and should be subclassed.
- Requires a valid `domainId` on construction.
- Manages both text and voice modalities for chatbots.
- Handles WebSocket event routing for both main assistant and voice bot.

---

## Exported Types

- `VoiceToolResult` (interface)

---

## Exported Class

- `YpBaseAssistantWithVoice` (abstract class)