# YpChatbotBase

An abstract base class for creating a chatbot component using LitElement. It extends `YpStreamingLlmBase` and provides a structure for handling chat messages, rendering chat UI, and interacting with a server API.

## Properties

| Name                | Type      | Description                                                                 |
|---------------------|-----------|-----------------------------------------------------------------------------|
| infoMessage         | string \| undefined | The current informational message displayed in the chat.                     |
| defaultInfoMessage  | string \| undefined | The default informational message shown when no other message is set.        |
| inputIsFocused      | boolean   | Indicates whether the input field is focused.                                |
| onlyUseTextField    | boolean   | Determines if only a text field should be used for input.                     |
| clusterId           | number    | The ID of the cluster associated with the chatbot.                           |
| communityId         | number    | The ID of the community associated with the chatbot.                         |
| textInputLabel      | string    | The label for the text input field.                                          |
| showCleanupButton   | boolean   | Determines if the cleanup button should be displayed.                        |
| showCloseButton     | boolean   | Determines if the close button should be displayed.                          |
| sendButton          | MdFilledTonalButton \| undefined | Reference to the send button element.                                      |
| chatElements        | YpAiChatbotItemBase[] \| undefined | Collection of chat elements in the chat window.                           |
| chatInputField      | MdOutlinedTextField \| undefined | Reference to the chat input field element.                                |
| chatWindow          | HTMLElement \| undefined | Reference to the chat window element.                                      |
| chatMessagesElement | HTMLElement \| undefined | Reference to the chat messages container element.                          |
| chatbotItemComponentName | string | The name of the chatbot item component used in the chat log.                  |

## Methods

| Name                        | Parameters                                                                 | Return Type | Description                                                                 |
|-----------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| setupServerApi              | None                                                                       | void        | Abstract method to set up the server API.                                   |
| calcVH                      | None                                                                       | void        | Calculates and sets the viewport height for the chat window.                |
| connectedCallback           | None                                                                       | void        | Lifecycle method called when the element is added to the document.          |
| firstUpdated                | _changedProperties: PropertyValueMap<any> \| Map<PropertyKey, unknown>     | void        | Lifecycle method called after the first update of the element.              |
| updated                     | changedProperties: Map<string \| number \| symbol, unknown>                | void        | Lifecycle method called after each update of the element.                   |
| disconnectedCallback        | None                                                                       | void        | Lifecycle method called when the element is removed from the document.      |
| addToChatLogWithMessage     | data: YpAssistantMessage, message?: string, changeButtonDisabledState?: boolean, changeButtonLabelTo?: string, refinedCausesSuggestions?: string[], rawMessage?: string | void | Adds a message to the chat log with optional parameters for button state.   |
| lastChatUiElement           | None                                                                       | YpAiChatbotItemBase | Returns the last chat UI element in the chat log.                           |
| addChatBotElement           | wsMessage: YpAssistantMessage                                              | Promise<void> | Adds a chatbot element to the chat log based on the message type.           |
| sendChatMessage             | message?: string                                                           | Promise<void> | Abstract method to send a chat message.                                     |
| followUpQuestion            | event: CustomEvent                                                         | void        | Handles follow-up questions from the chat elements.                         |
| renderChatInput             | None                                                                       | TemplateResult | Renders the chat input field and associated buttons.                        |
| render                      | None                                                                       | TemplateResult | Renders the entire chat window and its components.                          |

## Events

- **reset-chat**: Emitted when the chat is reset.
- **chatbot-close**: Emitted when the chatbot is closed.
- **llm-total-cost-update**: Emitted when the total cost of the LLM is updated.
- **server-memory-id-created**: Emitted when a server memory ID is created.

## Examples

```typescript
// Example usage of the YpChatbotBase component
import './yp-chatbot-base.js';

const chatbot = document.createElement('yp-chatbot-base');
document.body.appendChild(chatbot);

chatbot.addEventListener('reset-chat', () => {
  console.log('Chat has been reset.');
});

chatbot.addEventListener('chatbot-close', () => {
  console.log('Chatbot has been closed.');
});
```