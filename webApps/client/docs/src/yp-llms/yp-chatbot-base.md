# YpChatbotBase

Abstract class that provides the base functionality for a chatbot component.

## Properties

| Name                | Type                  | Description                                       |
|---------------------|-----------------------|---------------------------------------------------|
| infoMessage         | string \| undefined   | Message to display as information to the user.    |
| defaultInfoMessage  | string \| undefined   | Default message when the chatbot is initialized.  |
| inputIsFocused      | boolean               | Indicates if the input field is focused.          |
| onlyUseTextField    | boolean               | Flag to use only the text field for input.        |
| clusterId           | number                | Identifier for the cluster.                       |
| communityId         | number                | Identifier for the community.                     |
| textInputLabel      | string                | Label for the text input field.                   |
| showCleanupButton   | boolean               | Flag to show or hide the cleanup button.          |
| showCloseButton     | boolean               | Flag to show or hide the close button.            |
| chatbotItemComponentName | TemplateResult   | Name of the chatbot item component.               |

## Methods

| Name                   | Parameters                                  | Return Type | Description                                      |
|------------------------|---------------------------------------------|-------------|--------------------------------------------------|
| setupServerApi         |                                             | void        | Abstract method to set up the server API.        |
| calcVH                 |                                             | void        | Calculates the viewport height.                  |
| connectedCallback      |                                             | void        | Lifecycle method for when the component connects.|
| firstUpdated           | _changedProperties: PropertyValueMap<any> \| Map<PropertyKey, unknown> | void | Lifecycle method for the first update. |
| updated                | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method for updates. |
| disconnectedCallback   |                                             | void        | Lifecycle method for when the component disconnects. |
| addToChatLogWithMessage| data: PsAiChatWsMessage, message: string \| undefined, changeButtonDisabledState: boolean \| undefined, changeButtonLabelTo: string \| undefined, refinedCausesSuggestions: string[] \| undefined, rawMessage: string \| undefined | void | Adds a message to the chat log. |
| lastChatUiElement      |                                             | YpAiChatbotItemBase | Gets the last chat UI element. |
| addChatBotElement      | wsMessage: PsAiChatWsMessage               | Promise<void> | Adds a chatbot element based on the message type. |
| sendChatMessage        |                                             | Promise<void> | Abstract method to send a chat message.          |

## Events (if any)

- **reset-chat**: Emitted when the chat needs to be reset.
- **chatbot-close**: Emitted when the chatbot is closed.
- **llm-total-cost-update**: Emitted when the total cost of the live LLM is updated.
- **server-memory-id-created**: Emitted when a server memory ID is created.
- **scroll-down-enabled**: Emitted when the user enables scrolling down.

## Examples

```typescript
// Example usage of the chatbot base class
@customElement('my-chatbot')
export class MyChatbot extends YpChatbotBase {
  setupServerApi(): void {
    // Implementation for setting up server API
  }

  async sendChatMessage(): Promise<void> {
    // Implementation for sending a chat message
  }
}
```