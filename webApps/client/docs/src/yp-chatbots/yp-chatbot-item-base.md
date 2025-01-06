# YpAiChatbotItemBase

A web component that represents a chatbot item, handling different types of messages and states such as loading, errors, and follow-up questions.

## Properties

| Name                  | Type                                                                 | Description                                                                 |
|-----------------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------|
| message               | string                                                               | The main message content to be displayed.                                   |
| updateMessage         | string \| undefined                                                  | An optional updated message content.                                        |
| sender                | YpSenderType                                                         | The sender of the message, either "user" or "assistant".                    |
| detectedLanguage      | string                                                               | The language detected for the message.                                      |
| clusterId             | number                                                               | The cluster ID associated with the message.                                 |
| type                  | "start" \| "error" \| "moderation_error" \| "info" \| "message" \| "thinking" \| "noStreaming" \| undefined | The type of message or state.                                               |
| spinnerActive         | boolean                                                              | Indicates if a spinner is active, typically for loading states.             |
| fullReferencesOpen    | boolean                                                              | Indicates if full references are open.                                      |
| followUpQuestionsRaw  | string                                                               | Raw string containing follow-up questions.                                  |
| followUpQuestions     | string[]                                                             | Parsed array of follow-up questions.                                        |
| jsonLoading           | boolean                                                              | Indicates if JSON content is currently loading.                             |
| isSpeaking            | boolean                                                              | Indicates if the component is in a speaking state.                          |

## Methods

| Name                   | Parameters                                      | Return Type | Description                                                                 |
|------------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback      | none                                            | void        | Lifecycle method called when the element is added to the document.         |
| disconnectedCallback   | none                                            | void        | Lifecycle method called when the element is removed from the document.     |
| stopJsonLoading        | none                                            | void        | Stops the JSON loading process.                                             |
| handleJsonLoadingStart | none                                            | void        | Handles the start of JSON loading, setting the `jsonLoading` property.      |
| handleJsonLoadingEnd   | event: any                                      | void        | Handles the end of JSON loading, processing the event detail.               |
| isError                | none                                            | boolean     | Returns true if the message type is an error or moderation error.           |
| renderCGImage          | none                                            | TemplateResult | Renders the chatbot's image.                                                |
| renderRoboImage        | none                                            | TemplateResult | Renders the user's image.                                                   |
| renderJson             | none                                            | TemplateResult | Renders JSON content, if any.                                               |
| renderChatGPT          | none                                            | TemplateResult | Renders the ChatGPT message layout.                                         |
| parseFollowUpQuestions | none                                            | void        | Parses the raw follow-up questions string into an array.                    |
| updated                | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method called when properties change.                             |
| renderUser             | none                                            | TemplateResult | Renders the user's message layout.                                          |
| renderNoStreaming      | none                                            | TemplateResult | Renders the no streaming message layout.                                    |
| renderThinking         | none                                            | TemplateResult | Renders the thinking message layout.                                        |
| getThinkingText        | none                                            | string      | Returns the thinking text.                                                  |
| renderMessage          | none                                            | TemplateResult | Renders the appropriate message layout based on the sender and type.        |
| render                 | none                                            | TemplateResult | Main render method for the component.                                       |

## Events

- **jsonLoadingStart**: Triggered when JSON loading starts.
- **jsonLoadingEnd**: Triggered when JSON loading ends, with the JSON content as event detail.

## Examples

```typescript
// Example usage of the web component
import './path/to/yp-chatbot-item-base.js';

const chatbotItem = document.createElement('yp-chatbot-item-base');
chatbotItem.message = "Hello, how can I assist you today?";
chatbotItem.sender = "assistant";
document.body.appendChild(chatbotItem);
```