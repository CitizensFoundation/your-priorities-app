# YpAssistantBase

An abstract base class for Evoly AI's assistant chat interface, supporting both text and voice interactions. Extends `YpChatbotBase` and provides advanced features such as voice recording/playback, markdown report rendering, chat log management, and agent avatar handling. Designed for use as a Lit web component.

## Properties

| Name                      | Type                                      | Description                                                                                      |
|---------------------------|-------------------------------------------|--------------------------------------------------------------------------------------------------|
| voiceEnabled              | boolean                                   | Whether voice mode is enabled.                                                                   |
| domainId                  | number                                    | The domain ID for the assistant context.                                                         |
| mainAssistantAvatarUrl    | string \| undefined                       | URL for the main assistant's avatar.                                                             |
| directAgentAvatarUrl      | string \| undefined                       | URL for the direct agent's avatar.                                                               |
| useMainWindowScroll       | boolean                                   | Whether to use main window scroll. Overrides base property.                                       |
| directAgentName           | string \| null                            | Name of the direct agent.                                                                        |
| welcomeScreenOpen         | boolean                                   | Whether the welcome screen is open.                                                              |
| currentAgentId            | string \| undefined                       | The current agent's ID.                                                                          |
| welcomeTextHtml           | string                                    | HTML content for the welcome text.                                                               |
| onlyUseTextField          | boolean                                   | Whether to only use the text field for input. Overrides base property.                           |
| chatLogFromServer         | YpAssistantMessage[] \| undefined         | Chat log loaded from the server.                                                                 |
| textInputLabel            | string                                    | Label for the chat input field. Overrides base property.                                         |
| defaultInfoMessage        | string \| undefined                       | Default info message for the assistant. Overrides base property.                                 |
| chatbotItemComponentName  | ReturnType<typeof literal>                | Name of the chat item component.                                                                 |

## State (private/protected)

| Name                  | Type                        | Description                                      |
|-----------------------|-----------------------------|--------------------------------------------------|
| mediaRecorder         | WavRecorder \| null         | The current WAV recorder instance.               |
| wavStreamPlayer       | WavStreamPlayer \| null     | The current WAV stream player instance.          |
| isRecording           | boolean                     | Whether recording is active.                     |
| userIsSpeaking        | boolean                     | Whether the user is currently speaking.          |
| aiIsSpeaking          | boolean                     | Whether the AI is currently speaking.            |
| currentMode           | string                      | The current assistant mode.                      |
| markdownReportOpen    | boolean                     | Whether the markdown report is open.             |
| currentMarkdownReport | string \| undefined         | The current markdown report content.             |
| isExpanded            | boolean                     | Whether the chat window is expanded.             |
| dialogOpen            | boolean                     | Whether a dialog is open.                        |
| isDownloading         | boolean                     | Whether a report is being downloaded.            |

## Queries

| Name             | Type                | Description                                 |
|------------------|---------------------|---------------------------------------------|
| voiceButton      | HTMLElement         | Reference to the voice button element.      |
| waveformCanvas   | HTMLCanvasElement   | Reference to the waveform canvas element.   |

## Methods

| Name                          | Parameters                                                                 | Return Type         | Description                                                                                      |
|-------------------------------|----------------------------------------------------------------------------|---------------------|--------------------------------------------------------------------------------------------------|
| constructor                   |                                                                            | void                | Initializes the assistant, sets up voice and server API, manages client UUID.                    |
| clearClientMemoryUuid         |                                                                            | void                | Clears the client memory UUID from local storage and globals.                                     |
| setupServerApi                |                                                                            | Promise<void>       | Initializes the assistant server API.                                                            |
| connectedCallback             |                                                                            | void                | Lifecycle: sets up listeners and fetches memory from server.                                     |
| disconnectedCallback          |                                                                            | void                | Lifecycle: cleans up listeners and stops recording/canvas.                                       |
| sendEmailInvitesForAnons      | event: CustomEvent                                                         | Promise<void>       | Sends email invites for anonymous users via the server API.                                      |
| startNextWorkflowStep         | event: CustomEvent                                                         | Promise<void>       | Sends a message to start the next workflow step.                                                 |
| stopCurrentWorkflowStep       | event: CustomEvent                                                         | Promise<void>       | Sends a message to stop the current workflow step.                                               |
| openMarkdownReport            | event: CustomEvent                                                         | Promise<void>       | Opens a markdown report in the UI.                                                               |
| agentConfigurationSubmitted   |                                                                            | Promise<void>       | Notifies the server that agent configuration was submitted.                                      |
| agentRunChanged               |                                                                            | Promise<void>       | Notifies the server that the agent run has changed.                                              |
| userLoggedIn                  | event: CustomEvent                                                         | Promise<void>       | Handles user login event and updates server memory.                                              |
| firstUpdated                  | changedProperties: PropertyValueMap<any> \| Map<PropertyKey, unknown>      | void                | Lifecycle: called after first update.                                                            |
| getMemoryFromServer           |                                                                            | Promise<void>       | Loads chat log and mode data from the server.                                                    |
| setupVoiceCapabilities        |                                                                            | Promise<void>       | (Abstract) Sets up voice capabilities.                                                           |
| talkingHeadImageUrl           |                                                                            | string              | Returns the current talking head image URL.                                                      |
| renderVoiceTalkingHead        |                                                                            | unknown             | Renders the talking head image for voice mode.                                                   |
| chatLogWithDeduplicatedWidgets|                                                                            | YpAssistantMessage[]| Returns chat log with deduplicated widgets by unique token.                                      |
| startInVoiceMode              |                                                                            | Promise<void>       | Starts the assistant in voice mode.                                                              |
| wrapText                      | text: string, font: any, fontSize: number, maxWidth: number                | string[]            | Utility to wrap text for rendering.                                                              |
| startInTextMode               |                                                                            | Promise<void>       | Starts the assistant in text mode.                                                               |
| closeMarkdownReport           |                                                                            | Promise<void>       | Closes the markdown report view.                                                                 |
| handleDownloadReport          |                                                                            | Promise<void>       | Handles downloading the markdown report as a DOCX file.                                          |
| renderMarkdownReport          |                                                                            | unknown             | Renders the markdown report UI.                                                                  |
| render                        |                                                                            | unknown             | Main render method for the component.                                                            |
| toggleRecording               |                                                                            | void                | Toggles voice recording on/off.                                                                  |
| startRecording                |                                                                            | Promise<void>       | Starts voice recording and initializes audio streams.                                            |
| stopRecording                 |                                                                            | void                | Stops voice recording and cleans up audio streams.                                               |
| floatTo16BitPCM (static)      | float32Array: Float32Array                                                 | ArrayBuffer         | Converts a Float32Array to 16-bit PCM ArrayBuffer.                                               |
| arrayBufferToBase64 (static)  | arrayBuffer: ArrayBuffer \| Iterable<number>                               | string              | Converts an ArrayBuffer to a base64 string.                                                      |
| handleVoiceInput              | data: { mono: ArrayBuffer; raw: ArrayBuffer }                              | Promise<void>       | Handles sending voice input data to the server.                                                  |
| saveLastDirectAvatarUrlAndName|                                                                            | void                | Saves the last direct agent avatar URL and name to local storage.                                |
| loadLastDirectAvatarUrlAndName|                                                                            | void                | Loads the last direct agent avatar URL and name from local storage.                              |
| resetLastDirectAvatarUrlAndName|                                                                           | void                | Clears the last direct agent avatar URL and name from local storage.                             |
| resetWaveformPlayer           |                                                                            | Promise<void>       | Resets the waveform player for audio playback.                                                   |
| onMessage                     | event: MessageEvent                                                        | Promise<void>       | Handles incoming WebSocket messages and updates UI/state accordingly.                            |
| base64ToArrayBuffer           | base64: string                                                             | ArrayBuffer         | Converts a base64 string to an ArrayBuffer.                                                      |
| toggleVoiceMode               |                                                                            | Promise<void>       | Toggles voice mode on/off, manages recording and canvas rendering.                               |
| reallyClearHistory            |                                                                            | Promise<void>       | Clears chat history, resets state, and logs out the user.                                        |
| clearHistory                  |                                                                            | Promise<void>       | Prompts the user to confirm clearing chat history.                                               |
| renderVoiceStartButton        |                                                                            | unknown             | Renders the SVG for the voice start button.                                                      |
| renderBottomDisclaimer        |                                                                            | unknown             | Renders the bottom disclaimer text.                                                              |
| renderChatAssistantInput      |                                                                            | unknown             | Renders the chat input field and send button.                                                    |
| startVoiceButtonClick         |                                                                            | void                | Handles click on the start voice button.                                                         |
| stopVoiceButtonClick          |                                                                            | void                | Handles click on the stop voice button.                                                          |
| renderStartStopVoiceIconButton|                                                                            | unknown             | Renders the icon button for toggling voice mode.                                                 |
| renderStartStopVoiceButton    |                                                                            | unknown             | Renders the button for starting/stopping voice mode.                                             |
| renderResetChatButton         |                                                                            | unknown             | Renders the reset chat button.                                                                   |
| renderAssistantName           |                                                                            | unknown             | Renders the assistant's name.                                                                    |
| renderVoiceInput              |                                                                            | unknown             | Renders the voice input UI, including talking head and controls.                                 |
| handleDialogOpen              |                                                                            | void                | Handles dialog open event, sets dialog state.                                                    |
| handleDialogClose             |                                                                            | void                | Handles dialog close event, resets dialog state after a delay.                                   |

## Events

- **yp-logged-in**: Triggered when the user logs in; updates assistant memory and state.
- **agent-configuration-submitted**: Triggered when agent configuration is submitted.
- **yp-open-markdown-report**: Opens a markdown report in the assistant UI.
- **yp-start-next-workflow-step**: Requests the assistant to start the next workflow step.
- **yp-stop-current-workflow-step**: Requests the assistant to stop the current workflow step.
- **yp-send-email-invites-for-anons**: Sends email invites for anonymous users.
- **yp-dialog-opened**: Indicates a dialog has been opened.
- **yp-dialog-closed**: Indicates a dialog has been closed.

## Examples

```typescript
import "./yp-assistant-base.js";

const assistant = document.createElement("yp-assistant-base");
assistant.domainId = 123;
assistant.voiceEnabled = true;
document.body.appendChild(assistant);

// Start in voice mode
assistant.startInVoiceMode();

// Send a chat message
assistant.sendChatMessage("Hello, assistant!");

// Clear chat history
assistant.clearHistory();
```
