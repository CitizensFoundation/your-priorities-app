# YpStreamingLlmBase

Abstract class that provides base functionality for streaming chat messages over WebSockets.

## Properties

| Name                    | Type                                  | Description                                       |
|-------------------------|---------------------------------------|---------------------------------------------------|
| chatLog                 | PsAiChatWsMessage[]                   | Array to store chat messages.                     |
| wsClientId              | string                                | Unique identifier for the WebSocket client.       |
| webSocketsErrorCount    | number                                | Counter for WebSocket errors.                     |
| wsEndpoint              | string                                | WebSocket endpoint URL.                           |
| ws                      | WebSocket                             | WebSocket connection instance.                    |
| scrollElementSelector   | string                                | Selector for the chat messages scroll element.    |
| userScrolled            | boolean                               | Flag to indicate if the user has scrolled.        |
| currentFollowUpQuestions| string                                | Stores the current follow-up questions.           |
| programmaticScroll      | boolean                               | Flag to indicate if scrolling is done programmatically. |
| scrollStart             | number                                | Starting point of a scroll action.                |
| serverMemoryId          | string \| undefined                   | Identifier for the server memory.                 |
| defaultDevWsPort        | number                                | Default WebSocket port for development.           |
| heartbeatInterval       | number \| undefined                   | Interval ID for the heartbeat messages.           |
| disableWebsockets       | boolean                               | Flag to disable WebSocket connections.            |

## Methods

| Name                   | Parameters                     | Return Type | Description                                      |
|------------------------|--------------------------------|-------------|--------------------------------------------------|
| connectedCallback      |                                | void        | Lifecycle method for when the component connects.|
| initWebSockets         |                                | void        | Initializes the WebSocket connection.            |
| sendHeartbeat          |                                | void        | Sends a heartbeat message to keep the WebSocket connection alive. |
| onWsOpen               |                                | void        | Handler for when the WebSocket connection opens. |
| handleScroll           |                                | void        | Handles the scroll event for the chat messages.  |
| disconnectedCallback   |                                | void        | Lifecycle method for when the component disconnects. |
| onMessage              | event: MessageEvent            | Promise<void> | Handler for incoming WebSocket messages.       |
| scrollDown             |                                | void        | Scrolls the chat messages down.                  |
| addUserChatBotMessage  | userMessage: string            | void        | Adds a user message to the chat bot.             |
| addThinkingChatBotMessage |                            | void        | Adds a thinking message to the chat bot.         |
| addChatBotElement      | wsMessage: PsAiChatWsMessage   | Promise<void> | Abstract method to add a chat bot element.    |
| addChatUserElement     | data: PsAiChatWsMessage        | void        | Adds a chat user element to the chat log.        |
| simplifiedChatLog      |                                | PsSimpleChatLog[] | Gets a simplified version of the chat log.    |
| reset                  |                                | void        | Resets the chat log and WebSocket connection.    |

## Events

- **yp-ws-error**: Emitted when a WebSocket error occurs.
- **yp-ws-closed**: Emitted when the WebSocket connection is closed.
- **yp-ws-opened**: Emitted when the WebSocket connection is successfully opened.

## Examples

```typescript
// Example usage of the YpStreamingLlmBase class is not provided as it is an abstract class.
```