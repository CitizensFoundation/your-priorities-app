# Class: YpBaseChatBotWithVoice

Extends [YpBaseChatBot](../../services/llms/baseChatBot.js) to add real-time voice capabilities for an assistant, including WebSocket-based audio streaming, voice state management, and integration with [YpBaseAssistant](./baseAssistant.js). Handles both main assistant and direct agent voice connections, voice activity detection (VAD), and OpenAI Realtime API integration.

---

## Interfaces

### VoiceMessage

Represents a message in the voice protocol.

| Name     | Type   | Description                        |
|----------|--------|------------------------------------|
| delta    | any    | Delta payload (e.g., audio chunk)  |
| type     | string | Event type                         |
| content  | string | (Optional) Text content            |
| audio    | string | (Optional) Base64 encoded audio    |
| metadata | any    | (Optional) Additional metadata     |

### VoiceState

Tracks the current state of the voice assistant.

| Name               | Type    | Description                        |
|--------------------|---------|------------------------------------|
| speaking           | boolean | Whether the assistant is speaking  |
| listening          | boolean | Whether the assistant is listening |
| processingAudio    | boolean | Whether audio is being processed   |
| lastAudioTimestamp | number  | (Optional) Last audio timestamp    |

### VoiceConnectionConfig

Configuration for a voice connection.

| Name         | Type                       | Description                                 |
|--------------|----------------------------|---------------------------------------------|
| model        | string                     | Model name (e.g., OpenAI model)             |
| voice        | string                     | Voice name                                  |
| instructions | string                     | (Optional) System prompt/instructions       |
| tools        | AssistantChatbotTool[]     | (Optional) List of available tools          |
| modalities   | ("text" \| "audio")[]      | Supported modalities                        |

### RealtimeVoiceConnection

Represents an active voice WebSocket connection.

| Name      | Type      | Description                |
|-----------|-----------|----------------------------|
| ws        | WebSocket | WebSocket instance         |
| connected | boolean   | Connection status          |
| model     | string    | Model name                 |
| voice     | string    | Voice name                 |

---

## Constructor

```typescript
constructor(
  wsClientId: string,
  wsClients: Map<string, WebSocket>,
  redisKey: string,
  redisConnection: ioredis.Redis,
  voiceEnabled: boolean = false,
  parentAssistant: YpBaseAssistant
)
```

- **wsClientId**: `string` — Unique client identifier.
- **wsClients**: `Map<string, WebSocket>` — Map of all WebSocket clients.
- **redisKey**: `string` — Redis key for session/memory.
- **redisConnection**: `ioredis.Redis` — Redis connection instance.
- **voiceEnabled**: `boolean` — Whether voice features are enabled.
- **parentAssistant**: `YpBaseAssistant` — Reference to the parent assistant.

---

## Properties

| Name                                    | Type                                 | Description                                                      |
|----------------------------------------- |--------------------------------------|------------------------------------------------------------------|
| voiceEnabled                            | boolean                              | Whether voice features are enabled                               |
| assistantVoiceConnection                | RealtimeVoiceConnection \| undefined | Main assistant voice connection                                  |
| directAgentVoiceConnection              | RealtimeVoiceConnection \| undefined | Direct agent voice connection                                    |
| voiceMainMessageHandler                 | (data: Buffer) => void \| undefined  | Handler for main assistant voice messages                        |
| voiceDirectMessageHandler               | (data: Buffer) => void \| undefined  | Handler for direct agent voice messages                          |
| voiceConfig                             | VoiceConnectionConfig                | Current voice connection configuration                           |
| voiceState                              | VoiceState                           | Current voice state                                              |
| VAD_TIMEOUT                             | number                               | Voice Activity Detection timeout (ms)                            |
| vadTimeout                              | NodeJS.Timeout \| undefined          | Timeout for VAD silence detection                                |
| parentAssistant                         | YpBaseAssistant                      | Reference to parent assistant                                    |
| sendTranscriptsToClient                 | boolean                              | Whether to send transcripts to client                            |
| isWaitingOnCancelResponseCompleted      | boolean                              | Flag for cancel response state                                   |
| lastNumberOfChatHistoryForInstructions  | number                               | Number of chat history items for instructions                    |
| exitMessageFromDirectAgentConversation  | string \| undefined                  | Message to send after direct agent conversation                  |
| DEBUG                                   | boolean                              | Debug flag                                                       |

---

## Methods

### Voice Connection Management

#### initializeMainAssistantVoiceConnection

```typescript
async initializeMainAssistantVoiceConnection(): Promise<void>
```
Establishes a WebSocket connection to the OpenAI Realtime API for the main assistant, sets up event handlers, and initializes the voice session.

#### initializeDirectAgentVoiceConnection

```typescript
async initializeDirectAgentVoiceConnection(): Promise<void>
```
Establishes a WebSocket connection for direct agent communication, handles subscription plan logic, and initializes the session.

#### destroyDirectAgentVoiceConnection

```typescript
async destroyDirectAgentVoiceConnection(): Promise<void>
```
Closes the direct agent voice connection, updates memory, and saves the session.

#### destroyAssistantVoiceConnection

```typescript
destroyAssistantVoiceConnection(): void
```
Closes the main assistant voice connection and resets voice state.

#### destroy

```typescript
destroy(): void
```
Removes all voice message handlers, closes connections, and calls the superclass destroy method.

---

### Voice Message/Event Handling

#### setupVoiceMessageHandlers

```typescript
protected setupVoiceMessageHandlers(
  ws: WebSocket,
  disableWhenAgentIsSpeaking: boolean
): void
```
Attaches a message handler to the given WebSocket for processing OpenAI Realtime API events. Optionally disables handling when the agent is speaking.

#### handleResponseDone

```typescript
async handleResponseDone(event: any): Promise<void>
```
Handles the completion of a response, sending transcripts to the client and updating the assistant's chat log.

#### handleAudioTranscriptDone

```typescript
async handleAudioTranscriptDone(event: any): Promise<void>
```
Handles completed audio transcription events, sending transcripts to the client and updating the chat log.

#### callFunctionHandler

```typescript
async callFunctionHandler(event: any): Promise<void>
```
Handles function/tool calls from the voice API, executes the tool, sends results to the client, and updates the session.

#### handleAudioDelta

```typescript
async handleAudioDelta(event: VoiceMessage): Promise<void>
```
Handles streaming audio delta events, sending audio to the client.

#### handleTextOutput

```typescript
private async handleTextOutput(event: VoiceMessage): Promise<void>
```
Handles text output events, updating the chat log and sending messages to the client.

#### handleAudioBufferCommitted

```typescript
private async handleAudioBufferCommitted(event: VoiceMessage): Promise<void>
```
Handles the event when the audio buffer is committed, updating processing state.

#### handleVoiceSessionCreated

```typescript
protected async handleVoiceSessionCreated(event: any): Promise<void>
```
Handles the creation of a new voice session.

#### handleVoiceSessionError

```typescript
protected async handleVoiceSessionError(event: any): Promise<void>
```
Handles errors in the voice session, notifies the client.

#### handleVoiceResponseStatus

```typescript
protected async handleVoiceResponseStatus(event: any): Promise<void>
```
Handles status updates for response generation (start/end).

---

### Audio Input/Output

#### handleIncomingAudio

```typescript
async handleIncomingAudio(audioData: Uint8Array): Promise<void>
```
Handles incoming audio from the client, manages VAD timeout, and sends audio to the OpenAI API.

#### handleVADSilence

```typescript
private async handleVADSilence(): Promise<void>
```
Handles silence detection (VAD), commits the audio buffer to the server.

#### handleSpeechStarted

```typescript
private handleSpeechStarted(): void
```
Handles the event when speech is detected as started.

#### handleSpeechStopped

```typescript
private async handleSpeechStopped(): Promise<void>
```
Handles the event when speech is detected as stopped, commits the buffer if not already processing.

---

### Session and State Management

#### updateAiModelSession

```typescript
async updateAiModelSession(message: string): Promise<void>
```
Handles updates to the AI model session, re-initializes the voice session.

#### initializeVoiceSession

```typescript
async initializeVoiceSession(customResponseMessage?: string): Promise<void>
```
Initializes or updates the voice session with the current configuration, chat history, and system prompt.

#### triggerResponse

```typescript
async triggerResponse(message: string, cancelResponse = true): Promise<void>
```
Triggers a new response from the assistant, optionally sending a cancel event first.

#### waitForCancelResponseCompleted

```typescript
async waitForCancelResponseCompleted(): Promise<void>
```
Waits for the cancel response to be completed, with a timeout.

#### sendCancelResponse

```typescript
async sendCancelResponse(): Promise<void>
```
Sends a cancel response event to the voice connection and waits for completion.

#### updateVoiceConfig

```typescript
async updateVoiceConfig(config: Partial<VoiceConnectionConfig>): Promise<void>
```
Updates the voice connection configuration.

---

### Utility Methods

#### getRandomStringAscii

```typescript
getRandomStringAscii(length: number = 10): string
```
Generates a random ASCII string of the given length.

#### proxyToClient

```typescript
async proxyToClient(event: any): Promise<void>
```
Proxies a raw event to the client WebSocket.

#### sendToVoiceConnection

```typescript
sendToVoiceConnection(message: any): void
```
Sends a message to the active voice connection (main or direct agent).

#### streamWebSocketResponses

```typescript
async streamWebSocketResponses(stream: any)
```
Overrides the base method to handle streaming responses. In voice mode, responses are handled by WebSocket event handlers.

---

## Usage Example

```typescript
const voiceBot = new YpBaseChatBotWithVoice(
  wsClientId,
  wsClients,
  redisKey,
  redisConnection,
  true,
  parentAssistant
);

await voiceBot.initializeMainAssistantVoiceConnection();
await voiceBot.handleIncomingAudio(audioBuffer);
```

---

## Dependencies

- [YpBaseChatBot](../../services/llms/baseChatBot.js)
- [YpBaseAssistant](./baseAssistant.js)
- [WebSocket](https://github.com/websockets/ws)
- [ioredis](https://github.com/luin/ioredis)

---

## See Also

- [YpBaseAssistant](./baseAssistant.md)
- [YpBaseChatBot](../../services/llms/baseChatBot.md)
- [OpenAI Realtime API Documentation](https://platform.openai.com/docs/guides/realtime)
