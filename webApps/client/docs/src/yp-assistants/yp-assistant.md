# YpAssistant

A custom web component for handling chat interactions with an assistant, extending `YpAssistantBase`. It manages sending chat messages, toggling voice mode, updating the UI, and communicating with the assistant server API.

## Properties

| Name             | Type                                         | Description                                                                                 |
|------------------|----------------------------------------------|---------------------------------------------------------------------------------------------|
| chatInputField   | HTMLInputElement \| undefined                | Reference to the chat input field element.                                                  |
| sendButton       | HTMLButtonElement \| undefined               | Reference to the send button element.                                                       |
| voiceEnabled     | boolean                                      | Indicates if voice mode is enabled.                                                         |
| serverApi        | YpAssistantServerApi                         | Instance of the assistant server API for backend communication.                             |
| domainId         | string                                       | Identifier for the current domain/context.                                                  |
| wsClientId       | string                                       | WebSocket client identifier.                                                                |
| simplifiedChatLog| any                                          | Simplified representation of the chat log to be sent to the server.                         |
| language         | string                                       | Current language code.                                                                      |
| currentMode      | string                                       | Current mode of the assistant.                                                              |

*Note: These properties are inherited from `YpAssistantBase` and/or set in this class.*

## Methods

| Name            | Parameters                | Return Type | Description                                                                                 |
|-----------------|--------------------------|-------------|---------------------------------------------------------------------------------------------|
| sendChatMessage | message?: string         | Promise<void> | Sends a chat message to the assistant. Handles UI updates, toggles voice mode, and communicates with the server API. If no message is provided, uses the value from the chat input field. |

## Examples

```typescript
import "./yp-assistant.js";

const assistant = document.createElement("yp-assistant");
document.body.appendChild(assistant);

// Sending a chat message programmatically
assistant.sendChatMessage("Hello, assistant!");

// Or, the user can type in the input field and trigger sendChatMessage without parameters
assistant.sendChatMessage();
```
