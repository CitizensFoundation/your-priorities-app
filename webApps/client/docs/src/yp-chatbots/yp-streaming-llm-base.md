# YpStreamingLlmBase

An abstract base class for handling WebSocket connections and chat message management in a streaming large language model (LLM) environment. It extends the `YpBaseElement` class and provides properties and methods to manage WebSocket connections, handle chat messages, and manage scrolling behavior.

## Properties

| Name                     | Type                      | Description                                                                 |
|--------------------------|---------------------------|-----------------------------------------------------------------------------|
| chatLog                  | YpAssistantMessage[]      | An array of chat messages exchanged with the assistant.                     |
| wsClientId               | string                    | The client ID for the WebSocket connection.                                 |
| webSocketsErrorCount     | number                    | The count of WebSocket errors encountered.                                  |
| wsEndpoint               | string                    | The WebSocket endpoint URL.                                                 |
| ws                       | WebSocket                 | The WebSocket instance used for communication.                              |
| scrollElementSelector    | string                    | The CSS selector for the scrollable element.                                |
| useMainWindowScroll      | boolean                   | Whether to use the main window for scrolling.                               |
| userScrolled             | boolean                   | Indicates if the user has scrolled manually.                                |
| currentFollowUpQuestions | string                    | The current follow-up questions in the chat.                                |
| programmaticScroll       | boolean                   | Indicates if the scroll was programmatically triggered.                     |
| disableAutoScroll        | boolean                   | Whether to disable automatic scrolling.                                     |
| scrollStart              | number                    | The initial scroll position.                                                |
| serverMemoryId           | string \| undefined       | The server memory ID, if any.                                               |
| defaultDevWsPort         | number                    | The default WebSocket port for development.                                 |
| heartbeatInterval        | number \| undefined       | The interval for sending heartbeat messages.                                |
| disableWebsockets        | boolean                   | Whether to disable WebSocket connections.                                   |
| wsManuallyClosed         | boolean                   | Indicates if the WebSocket was manually closed.                             |
| heartBeatRate            | number                    | The rate at which heartbeat messages are sent.                              |

## Methods

| Name                  | Parameters                  | Return Type | Description                                                                 |
|-----------------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback     |                             | void        | Lifecycle method called when the element is added to the document.          |
| initWebSockets        |                             | void        | Initializes the WebSocket connection and sets up event handlers.            |
| sendHeartbeat         |                             | void        | Sends a heartbeat message over the WebSocket connection.                    |
| onWsOpen              |                             | void        | Handles the WebSocket open event and sets up message handling.              |
| handleScroll          |                             | void        | Handles scroll events and manages auto-scrolling behavior.                  |
| disconnectedCallback  |                             | void        | Lifecycle method called when the element is removed from the document.      |
| onMessage             | event: MessageEvent         | Promise<void> | Handles incoming WebSocket messages and updates the chat log.               |
| scrollDown            |                             | void        | Scrolls the chat to the bottom if auto-scrolling is enabled.                |
| addUserChatBotMessage | userMessage: string         | void        | Adds a user message to the chat log.                                        |
| addThinkingChatBotMessage |                         | void        | Adds a "thinking" message from the assistant to the chat log.               |
| addChatBotElement     | wsMessage: YpAssistantMessage | Promise<void> | Abstract method to add a chat bot element to the chat log.                  |
| addChatUserElement    | data: YpAssistantMessage    | void        | Adds a user message to the chat log.                                        |
| simplifiedChatLog     |                             | YpSimpleChatLog[] | Returns a simplified version of the chat log, excluding certain message types. |
| reset                 |                             | void        | Resets the chat log and reinitializes the WebSocket connection.             |

## Events

- **yp-ws-error**: Emitted when a WebSocket error occurs.
- **yp-ws-closed**: Emitted when the WebSocket connection is closed.
- **yp-ws-opened**: Emitted when the WebSocket connection is successfully opened with a client ID.

## Examples

```typescript
// Example usage of the YpStreamingLlmBase class
class MyStreamingComponent extends YpStreamingLlmBase {
  async addChatBotElement(wsMessage: YpAssistantMessage): Promise<void> {
    // Implementation for adding a chat bot element
  }
}

const myComponent = new MyStreamingComponent();
document.body.appendChild(myComponent);
```