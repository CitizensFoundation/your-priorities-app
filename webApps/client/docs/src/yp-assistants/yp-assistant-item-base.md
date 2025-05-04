# YpAssistantItemBase

A base web component for rendering assistant/chatbot items with support for voice mode, avatars, markdown rendering, and dynamic HTML content. Extends `YpAiChatbotItemBase` and provides additional UI and logic for assistant interactions, including voice status and avatar display.

## Properties

| Name         | Type      | Description                                                                 |
|--------------|-----------|-----------------------------------------------------------------------------|
| isVoiceMode  | boolean   | Indicates if the assistant is in voice mode.                                |
| isListening  | boolean   | Indicates if the assistant is currently listening for voice input.          |
| isSpeaking   | boolean   | Indicates if the assistant is currently speaking. Overrides base property.  |
| htmlToRender | string \| undefined | Optional HTML string to render as part of the assistant's response.         |
| avatarUrl    | string \| undefined | Optional URL for the assistant's avatar image.                              |

## Methods

| Name             | Parameters                | Return Type | Description                                                                                  |
|------------------|--------------------------|-------------|----------------------------------------------------------------------------------------------|
| firstUpdated     | changedProps: Map<string, any> | void        | Lifecycle method called after the component's first update. Calls the superclass method.      |
| updated          | changedProps: Map<string, any> | void        | Lifecycle method called after each update. Calls the superclass method.                       |
| renderAvatar     | none                     | unknown     | Renders the assistant's avatar image if `avatarUrl` is set, otherwise calls `renderCGImage`.  |
| renderChatGPT    | none                     | unknown     | Renders the assistant's chat message, including avatar, markdown, and optional HTML content.  |
| renderUser       | none                     | unknown     | Renders the user's chat message.                                                              |

## Examples

```typescript
import './yp-assistant-item-base.js';

const assistantItem = document.createElement('yp-assistant-item-base');
assistantItem.message = "Hello! How can I help you today?";
assistantItem.isVoiceMode = true;
assistantItem.avatarUrl = "https://example.com/avatar.png";
assistantItem.htmlToRender = "<b>Special offer!</b>";
document.body.appendChild(assistantItem);
```
