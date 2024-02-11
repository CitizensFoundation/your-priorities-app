# YpAiChatbotItemBase

This class represents a base element for a chatbot item, handling the display and functionality of chat messages, including those from the user and the bot, as well as special types of messages like errors, thinking states, and follow-up questions.

## Properties

| Name                   | Type                                  | Description                                                                 |
|------------------------|---------------------------------------|-----------------------------------------------------------------------------|
| message                | string                                | The chat message content.                                                   |
| updateMessage          | string \| undefined                   | An optional updated message content.                                        |
| sender                 | "you" \| "bot"                        | The sender of the message, either "you" for the user or "bot" for the bot.  |
| detectedLanguage       | string                                | The language detected in the message.                                       |
| clusterId              | number                                | The ID of the cluster associated with the message.                          |
| type                   | "start" \| "error" \| "moderation_error" \| "info" \| "message" \| "thinking" \| "noStreaming" \| undefined | The type of the message, indicating its purpose or state.                   |
| spinnerActive          | boolean                               | Indicates whether a spinner should be active, typically for loading states. |
| fullReferencesOpen     | boolean                               | Indicates whether full references are open or not.                          |
| followUpQuestionsRaw   | string                                | Raw string containing follow-up questions.                                  |
| followUpQuestions      | string[]                              | An array of follow-up questions parsed from the raw string.                 |
| jsonLoading            | boolean                               | Indicates whether JSON content is currently loading.                        |

## Methods

| Name                    | Parameters | Return Type | Description                                                                 |
|-------------------------|------------|-------------|-----------------------------------------------------------------------------|
| stopJsonLoading         |            | void        | Stops the JSON loading indicator.                                           |
| handleJsonLoadingStart  |            | void        | Handles the start of JSON loading, setting the loading state to true.       |
| handleJsonLoadingEnd    | event: any | void        | Handles the end of JSON loading, updating the state and processing content. |
| isError                 |            | boolean     | Checks if the current message type is an error.                             |
| renderCGImage           |            | TemplateResult | Renders the chatbot image for the bot.                                      |
| renderRoboImage         |            | TemplateResult | Renders the user image for the chat.                                        |
| renderJson              |            | TemplateResult | Renders JSON content if applicable.                                         |
| renderChatGPT           |            | TemplateResult | Renders the chatbot's message in the chat interface.                        |
| parseFollowUpQuestions  |            | void        | Parses the raw follow-up questions string and populates the questions array.|
| renderUser              |            | TemplateResult | Renders the user's message in the chat interface.                           |
| renderNoStreaming       |            | TemplateResult | Renders the no streaming state with an optional spinner or done icon.       |
| renderThinking          |            | TemplateResult | Renders the thinking state with an optional spinner or done icon.           |
| getThinkingText         |            | string      | Retrieves the localized text for the thinking state.                        |
| renderMessage           |            | TemplateResult | Renders the appropriate message based on the sender and type.               |

## Events (if any)

- **jsonLoadingStart**: Emitted when JSON loading starts.
- **jsonLoadingEnd**: Emitted when JSON loading ends, with the JSON content as detail.

## Examples

```typescript
// Example usage of the YpAiChatbotItemBase element
const chatbotItem = document.createElement('yp-chatbot-item-base');
chatbotItem.message = 'Hello, how can I assist you today?';
chatbotItem.sender = 'bot';
chatbotItem.type = 'message';
document.body.appendChild(chatbotItem);
```

Note: The actual usage of the component would involve more property settings and potentially handling events, especially for interactive elements like follow-up questions.