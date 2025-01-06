# YpAssistant

The `YpAssistant` class is a custom web component that extends the `YpAssistantBase` class. It is designed to handle chat interactions, sending messages to a server, and managing the chat interface.

## Properties

| Name            | Type   | Description                                                                 |
|-----------------|--------|-----------------------------------------------------------------------------|
| domainId        | string | The domain identifier used for sending messages to the server.              |
| wsClientId      | string | The WebSocket client identifier.                                            |
| simplifiedChatLog | any  | A simplified log of the chat messages.                                      |
| language        | string | The language code used for the chat interface.                              |
| currentMode     | string | The current mode of the assistant, affecting how messages are processed.    |
| chatInputField  | HTMLInputElement | The input field element for entering chat messages.               |
| sendButton      | HTMLButtonElement | The button element used to send chat messages.                   |
| serverApi       | YpAssistantServerApi | The API interface for sending messages to the server.         |

## Methods

| Name            | Parameters          | Return Type | Description                                                                 |
|-----------------|---------------------|-------------|-----------------------------------------------------------------------------|
| sendChatMessage | message?: string    | Promise<void> | Sends a chat message to the server. If no message is provided, it uses the value from the chat input field. |

## Examples

```typescript
// Example usage of the YpAssistant web component
const assistant = document.createElement('yp-assistant') as YpAssistant;
document.body.appendChild(assistant);

// Sending a chat message
assistant.sendChatMessage("Hello, how can I assist you today?");
```