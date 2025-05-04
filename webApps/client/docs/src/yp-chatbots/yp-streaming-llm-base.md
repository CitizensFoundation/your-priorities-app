# YpStreamingLlmBase

An abstract base class for streaming Large Language Model (LLM) chat components using a shared WebSocket connection. Handles connection management, message dispatching, and chat log state for all subscribers. Designed to be extended for custom chat UI implementations.

## Properties

| Name                     | Type                        | Description                                                                                 |
|--------------------------|-----------------------------|---------------------------------------------------------------------------------------------|
| chatLog                  | YpAssistantMessage[]        | The current chat log containing all assistant and user messages.                            |
| wsClientId               | string                      | The client ID assigned by the WebSocket server.                                             |
| webSocketsErrorCount     | number                      | The number of WebSocket errors encountered.                                                 |
| wsEndpoint               | string                      | The WebSocket endpoint URL.                                                                 |
| currentFollowUpQuestions | string                      | The current follow-up questions as a string.                                                |
| programmaticScroll       | boolean                     | If true, enables programmatic scrolling of the chat view.                                   |
| disableAutoScroll        | boolean                     | If true, disables automatic scrolling to the bottom on new messages.                        |
| scrollStart              | number                      | The scroll position at the start of a scroll event.                                         |
| serverMemoryId           | string \| undefined         | The server memory ID associated with the chat session.                                      |
| defaultDevWsPort         | number                      | The default development WebSocket port (default: 4242).                                     |
| disableWebsockets        | boolean                     | If true, disables WebSocket event handling for this instance.                               |

## Methods

| Name                    | Parameters                                                                 | Return Type         | Description                                                                                                 |
|-------------------------|----------------------------------------------------------------------------|---------------------|-------------------------------------------------------------------------------------------------------------|
| connectedCallback       | none                                                                       | void                | Lifecycle method called when the element is added to the DOM. Sets up WebSocket subscription.                |
| disconnectedCallback    | none                                                                       | void                | Lifecycle method called when the element is removed from the DOM. Cleans up WebSocket and timers.            |
| sendClientMessage       | payload: string                                                            | void                | Sends a raw string message to the server via WebSocket.                                                     |
| sendMessage             | action: string, payload: any                                               | void                | Sends a structured message (with action and payload) to the server via WebSocket.                           |
| onMessage               | event: MessageEvent                                                        | Promise<void>       | Handles incoming WebSocket messages. Dispatches to chat log and scrolls as needed.                          |
| scrollDown              | none                                                                       | void                | **Abstract.** Scrolls the chat view to the bottom. Must be implemented by subclasses.                       |
| addUserChatBotMessage   | userMessage: string                                                        | void                | Adds a user message to the chat log as if sent by the assistant.                                            |
| addThinkingChatBotMessage | none                                                                     | void                | Adds a "thinking" message from the assistant to the chat log.                                               |
| addChatBotElement       | wsMessage: YpAssistantMessage                                              | Promise<void>       | **Abstract.** Adds a message from the assistant to the chat log. Must be implemented by subclasses.         |
| addChatUserElement      | data: YpAssistantMessage                                                   | void                | Adds a user message to the chat log.                                                                        |
| simplifiedChatLog       | (getter)                                                                   | YpSimpleChatLog[]   | Returns a simplified version of the chat log, filtering out system and thinking messages.                   |
| reset                   | none                                                                       | void                | Resets the chat log, closes and re-initializes the WebSocket connection, and clears server memory ID.       |
| scheduleReconnect       | doItNow?: boolean                                                          | void                | (static) Schedules a reconnection attempt for the shared WebSocket.                                         |
| initWebSocketsStatic    | instance?: YpStreamingLlmBase                                              | void                | (private static) Initializes the shared WebSocket connection and sets up event handlers.                    |

## Events

- **wsConnected**: Dispatched on the `window` object when the WebSocket connection is successfully established.

## Examples

```typescript
class MyLlmChatComponent extends YpStreamingLlmBase {
  async addChatBotElement(wsMessage: YpAssistantMessage): Promise<void> {
    this.chatLog = [...this.chatLog, wsMessage];
    // Custom rendering logic here
  }

  scrollDown(): void {
    // Custom scroll logic here
  }
}

const chatComponent = new MyLlmChatComponent();
chatComponent.sendMessage('ask', { question: 'What is AI?' });
```
