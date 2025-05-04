# YpChatbotBase

An abstract base class for a chatbot web component, built with Lit and Material Web Components. It provides the core logic for rendering a chat interface, handling chat messages, managing chat log state, and interacting with a server API. This class is intended to be extended by concrete chatbot implementations.

## Properties

| Name                   | Type                                 | Description                                                                                 |
|------------------------|--------------------------------------|---------------------------------------------------------------------------------------------|
| infoMessage            | string \| undefined                  | The current informational message displayed to the user.                                     |
| defaultInfoMessage     | string \| undefined                  | The default info message shown when no other info is present. Defaults to "I'm your friendly chat assistant". |
| inputIsFocused         | boolean                              | Indicates if the chat input field is currently focused.                                      |
| onlyUseTextField       | boolean                              | If true, only the text field is used for input, not a textarea.                             |
| clusterId              | number                               | The cluster ID associated with the chat context.                                             |
| communityId            | number                               | The community ID associated with the chat context.                                           |
| textInputLabel         | string                               | The label for the chat input field.                                                          |
| showCleanupButton      | boolean                              | If true, displays a cleanup (reset) button in the chat input area.                           |
| showCloseButton        | boolean                              | If true, displays a close button in the chat input area.                                     |
| sendButton             | MdFilledTonalButton \| undefined      | Reference to the send button element in the DOM.                                             |
| chatElements           | YpAiChatbotItemBase[] \| undefined   | References to all rendered chat item elements.                                               |
| chatInputField         | MdOutlinedTextField \| undefined      | Reference to the chat input field element in the DOM.                                        |
| chatWindow             | HTMLElement \| undefined              | Reference to the chat window container element.                                              |
| chatMessagesElement    | HTMLElement \| undefined              | Reference to the chat messages container element.                                            |
| chatbotItemComponentName | ReturnType<typeof literal>          | The tag name for the chat item component (default: `yp-chatbot-item-base`).                  |

## Methods

| Name                        | Parameters                                                                                                                      | Return Type         | Description                                                                                                   |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------|---------------------|---------------------------------------------------------------------------------------------------------------|
| constructor                 | —                                                                                                                               | void                | Initializes the component and sets up the server API.                                                          |
| setupServerApi (abstract)   | —                                                                                                                               | void                | Abstract method to set up the server API. Must be implemented by subclasses.                                   |
| calcVH                      | —                                                                                                                               | void                | Calculates and sets the chat window height to the viewport height.                                             |
| connectedCallback           | —                                                                                                                               | void                | Lifecycle method called when the component is added to the DOM.                                                |
| firstUpdated                | _changedProperties: PropertyValueMap<any> \| Map<PropertyKey, unknown>                                                          | void                | Lifecycle method called after the first update. Focuses the input and sets up scroll event listeners.          |
| updated                     | changedProperties: Map<string \| number \| symbol, unknown>                                                                     | void                | Lifecycle method called after each update. Handles theme changes.                                              |
| disconnectedCallback        | —                                                                                                                               | void                | Lifecycle method called when the component is removed from the DOM. Removes scroll event listeners.            |
| addToChatLogWithMessage     | data: YpAssistantMessage, message?: string, changeButtonDisabledState?: boolean, changeButtonLabelTo?: string, refinedCausesSuggestions?: string[], rawMessage?: string | void                | Adds a message to the chat log and updates the UI accordingly.                                                 |
| lastChatUiElement           | —                                                                                                                               | YpAiChatbotItemBase | Returns the last chat item element in the chat log.                                                            |
| addChatBotElement           | wsMessage: YpAssistantMessage                                                                                                   | Promise<void>       | Handles incoming WebSocket messages and updates the chat log/UI based on message type.                         |
| sendChatMessage (abstract)  | message?: string                                                                                                                | Promise<void>       | Abstract method to send a chat message. Must be implemented by subclasses.                                     |
| followUpQuestion            | event: CustomEvent                                                                                                              | void                | Handles follow-up question events and sends the follow-up as a new chat message.                               |
| renderChatInput             | —                                                                                                                               | unknown             | Renders the chat input area, including text field and optional buttons.                                        |
| render                      | —                                                                                                                               | unknown             | Renders the entire chat window, including messages and input area.                                             |

## Events

- **reset-chat**: Emitted when the cleanup (reset) button is clicked.
- **chatbot-close**: Emitted when the close button is clicked.
- **llm-total-cost-update**: Emitted when a live LLM cost update is received.
- **server-memory-id-created**: Emitted when a new server memory ID is created.

## Examples

```typescript
import { YpChatbotBase } from './yp-chatbot-base.js';

class MyChatbot extends YpChatbotBase {
  setupServerApi() {
    // Implement server API setup logic here
  }

  async sendChatMessage(message?: string) {
    // Implement message sending logic here
  }
}

customElements.define('my-chatbot', MyChatbot);
```
