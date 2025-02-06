# YpAssistantBase

The `YpAssistantBase` class is an abstract web component that extends `YpChatbotBase`. It provides a base implementation for a voice-enabled assistant with chat capabilities. This component manages voice recording, chat interactions, and server communication.

## Properties

| Name                    | Type                              | Description                                                                 |
|-------------------------|-----------------------------------|-----------------------------------------------------------------------------|
| voiceEnabled            | boolean                           | Indicates if voice mode is enabled.                                         |
| domainId                | number                            | The domain ID associated with the assistant.                                |
| mainAssistantAvatarUrl  | string \| undefined               | URL for the main assistant's avatar.                                        |
| directAgentAvatarUrl    | string \| undefined               | URL for the direct agent's avatar.                                          |
| useMainWindowScroll     | boolean                           | Overrides the use of main window scroll.                                    |
| directAgentName         | string \| null                    | Name of the direct agent.                                                   |
| welcomeScreenOpen       | boolean                           | Indicates if the welcome screen is open.                                    |
| currentAgentId          | string \| undefined               | ID of the current agent.                                                    |
| welcomeTextHtml         | string                            | HTML content for the welcome text.                                          |
| onlyUseTextField        | boolean                           | Overrides to use only the text field.                                       |
| chatLogFromServer       | YpAssistantMessage[] \| undefined | Chat log retrieved from the server.                                         |
| textInputLabel          | string                            | Label for the text input field.                                             |
| defaultInfoMessage      | string \| undefined               | Default informational message for the assistant.                            |
| chatbotItemComponentName| string                            | Name of the chatbot item component.                                         |

## Methods

| Name                          | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| setupServerApi                | -                                                                          | Promise<void> | Sets up the server API for the assistant.                                   |
| connectedCallback             | -                                                                          | void        | Lifecycle method called when the component is added to the DOM.             |
| disconnectedCallback          | -                                                                          | void        | Lifecycle method called when the component is removed from the DOM.         |
| sendEmailInvitesForAnons      | event: CustomEvent                                                         | Promise<void> | Sends email invites for anonymous users.                                    |
| startNextWorkflowStep         | event: CustomEvent                                                         | Promise<void> | Starts the next workflow step.                                              |
| stopCurrentWorkflowStep       | event: CustomEvent                                                         | Promise<void> | Stops the current workflow step.                                            |
| openMarkdownReport            | event: CustomEvent                                                         | Promise<void> | Opens a markdown report.                                                    |
| agentConfigurationSubmitted   | -                                                                          | Promise<void> | Handles agent configuration submission.                                     |
| agentRunChanged               | -                                                                          | Promise<void> | Handles changes in the agent run.                                           |
| userLoggedIn                  | event: CustomEvent                                                         | Promise<void> | Handles user login events.                                                  |
| firstUpdated                  | changedProperties: PropertyValueMap<any> \| Map<PropertyKey, unknown>      | void        | Lifecycle method called after the component's first update.                 |
| getMemoryFromServer           | -                                                                          | Promise<void> | Retrieves memory data from the server.                                      |
| setupCanvasRendering          | -                                                                          | void        | Sets up the canvas rendering for voice visualization.                       |
| renderLoop                    | -                                                                          | void        | The rendering loop for updating the canvas.                                 |
| stopCanvasRendering           | -                                                                          | void        | Stops the canvas rendering loop.                                            |
| setupVoiceCapabilities        | -                                                                          | Promise<void> | Sets up voice capabilities for the assistant.                               |
| startInVoiceMode              | -                                                                          | Promise<void> | Starts the assistant in voice mode.                                         |
| startInTextMode               | -                                                                          | Promise<void> | Starts the assistant in text mode.                                          |
| closeMarkdownReport           | -                                                                          | Promise<void> | Closes the markdown report.                                                 |
| handleDownloadReport          | -                                                                          | Promise<void> | Handles the download of a report.                                           |
| toggleRecording               | -                                                                          | void        | Toggles the recording state.                                                |
| startRecording                | -                                                                          | Promise<void> | Starts voice recording.                                                     |
| stopRecording                 | -                                                                          | void        | Stops voice recording.                                                      |
| handleVoiceInput              | data: { mono: ArrayBuffer; raw: ArrayBuffer }                              | Promise<void> | Handles voice input data.                                                   |
| saveLastDirectAvatarUrlAndName| -                                                                          | void        | Saves the last direct avatar URL and name to local storage.                 |
| loadLastDirectAvatarUrlAndName| -                                                                          | void        | Loads the last direct avatar URL and name from local storage.               |
| resetLastDirectAvatarUrlAndName| -                                                                         | void        | Resets the last direct avatar URL and name in local storage.                |
| resetWaveformPlayer           | -                                                                          | Promise<void> | Resets the waveform player.                                                 |
| onMessage                     | event: MessageEvent                                                        | Promise<void> | Handles incoming messages from the server.                                  |
| base64ToArrayBuffer           | base64: string                                                             | ArrayBuffer | Converts a base64 string to an ArrayBuffer.                                 |
| toggleVoiceMode               | -                                                                          | Promise<void> | Toggles the voice mode.                                                     |
| reallyClearHistory            | -                                                                          | Promise<void> | Clears the chat history and resets the assistant.                           |
| clearHistory                  | -                                                                          | Promise<void> | Prompts the user to confirm clearing the chat history.                      |
| render                        | -                                                                          | TemplateResult | Renders the component's template.                                           |
| renderVoiceTalkingHead        | -                                                                          | TemplateResult | Renders the voice talking head image.                                       |
| renderMarkdownReport          | -                                                                          | TemplateResult | Renders the markdown report.                                                |
| renderChatAssistantInput      | -                                                                          | TemplateResult | Renders the chat assistant input field.                                     |
| renderVoiceInput              | -                                                                          | TemplateResult | Renders the voice input section.                                            |
| handleDialogOpen              | -                                                                          | void        | Handles the opening of a dialog.                                            |
| handleDialogClose             | -                                                                          | void        | Handles the closing of a dialog.                                            |

## Events

- **yp-logged-in**: Emitted when the user logs in.
- **agent-configuration-submitted**: Emitted when the agent configuration is submitted.
- **yp-open-markdown-report**: Emitted to open a markdown report.
- **yp-start-next-workflow-step**: Emitted to start the next workflow step.
- **yp-stop-current-workflow-step**: Emitted to stop the current workflow step.
- **yp-send-email-invites-for-anons**: Emitted to send email invites for anonymous users.
- **yp-dialog-opened**: Emitted when a dialog is opened.
- **yp-dialog-closed**: Emitted when a dialog is closed.

## Examples

```typescript
// Example usage of the YpAssistantBase component
import { html, LitElement } from 'lit';
import './yp-assistant-base.js';

class MyAssistant extends LitElement {
  render() {
    return html`
      <yp-assistant-base
        .domainId="${123}"
        .voiceEnabled="${true}"
        .mainAssistantAvatarUrl="${'https://example.com/avatar.png'}"
      ></yp-assistant-base>
    `;
  }
}

customElements.define('my-assistant', MyAssistant);
```