# YpAssistantItemBase

The `YpAssistantItemBase` class is a custom web component that extends the `YpAiChatbotItemBase` class. It is designed to handle the rendering of chat messages and avatars, with additional support for voice mode and HTML content rendering.

## Properties

| Name         | Type      | Description                                                                 |
|--------------|-----------|-----------------------------------------------------------------------------|
| isVoiceMode  | boolean   | Indicates whether the voice mode is enabled.                                |
| isListening  | boolean   | Indicates whether the component is currently listening for voice input.     |
| isSpeaking   | boolean   | Overrides the base class property to indicate if the component is speaking. |
| htmlToRender | string    | Optional HTML content to render within the chat interface.                  |
| avatarUrl    | string    | Optional URL for the avatar image to display.                               |

## Methods

| Name            | Parameters                  | Return Type | Description                                                                 |
|-----------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| firstUpdated    | changedProps: Map<string, any> | void        | Lifecycle method called after the component's first update.                 |
| updated         | changedProps: Map<string, any> | void        | Lifecycle method called after each update of the component.                 |
| get styles      | None                        | CSSResult[] | Returns the styles for the component, including inherited styles.           |
| renderAvatar    | None                        | TemplateResult | Renders the avatar image or a default image if no URL is provided.          |
| renderChatGPT   | None                        | TemplateResult | Renders the chat interface for displaying messages from the assistant.      |
| renderUser      | None                        | TemplateResult | Renders the chat interface for displaying user messages.                    |

## Examples

```typescript
import './path/to/yp-assistant-item-base.js';

const assistantItem = document.createElement('yp-assistant-item-base');
assistantItem.isVoiceMode = true;
assistantItem.avatarUrl = 'https://example.com/avatar.png';
assistantItem.htmlToRender = '<p>Custom HTML content</p>';
document.body.appendChild(assistantItem);
```

This example demonstrates how to create an instance of the `YpAssistantItemBase` component, set some properties, and append it to the document body.