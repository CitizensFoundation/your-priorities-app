# YpAssistantWelcome

The `YpAssistantWelcome` class is a custom web component that extends `YpBaseElementWithLogin`. It provides a welcome interface for users to interact with a voice assistant, offering both voice and text interaction modes.

## Properties

| Name            | Type   | Description                                      |
|-----------------|--------|--------------------------------------------------|
| welcomeTextHtml | string | HTML content to display as the welcome message.  |
| avatarUrl       | string | URL of the avatar image to display.              |

## Methods

| Name              | Parameters          | Return Type | Description                                                                 |
|-------------------|---------------------|-------------|-----------------------------------------------------------------------------|
| startInVoiceMode  | event: CustomEvent  | void        | Fires an event to start the assistant in voice mode.                        |
| startInTextMode   | event: CustomEvent  | void        | Fires an event to start the assistant in text mode.                         |
| renderVoiceStartIcon | None             | TemplateResult | Renders the SVG icon for starting voice mode.                               |
| renderVoiceIconButton | None            | TemplateResult | Renders the icon button for toggling voice mode.                            |
| renderVoiceButton | None                | TemplateResult | Renders the button to initiate voice interaction with the assistant.        |
| renderVoiceTalkingHead | None           | TemplateResult | Renders the avatar image of the voice assistant.                            |
| render            | None                | TemplateResult | Renders the complete welcome interface, including buttons and text.         |

## Events

- **yp-start-voice-mode**: Emitted when the user chooses to start interacting with the assistant in voice mode.
- **yp-start-text-mode**: Emitted when the user chooses to start interacting with the assistant in text mode.

## Examples

```typescript
// Example usage of the YpAssistantWelcome component
import './yp-assistant-welcome.js';

const welcomeElement = document.createElement('yp-assistant-welcome');
welcomeElement.welcomeTextHtml = '<p>Welcome to your personal assistant!</p>';
welcomeElement.avatarUrl = 'https://example.com/avatar.png';
document.body.appendChild(welcomeElement);

welcomeElement.addEventListener('yp-start-voice-mode', (event) => {
  console.log('Voice mode started', event);
});

welcomeElement.addEventListener('yp-start-text-mode', (event) => {
  console.log('Text mode started', event);
});
```