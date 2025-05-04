# YpStreamingLlmScrolling

An abstract web component extending `YpStreamingLlmBase` that provides scrolling logic for chat-like interfaces, including auto-scroll management and user scroll detection. Designed for use with streaming LLM chat UIs.

## Properties

| Name                  | Type      | Description                                                                                  |
|-----------------------|-----------|----------------------------------------------------------------------------------------------|
| scrollElementSelector | string    | CSS selector for the element to be scrolled. Defaults to `#chat-messages`.                   |
| useMainWindowScroll   | boolean   | If true, uses the main window/document for scrolling instead of a specific element.          |
| userScrolled          | boolean   | Indicates whether the user has manually scrolled, disabling auto-scroll if true.             |

## Methods

| Name         | Parameters | Return Type | Description                                                                                                   |
|--------------|------------|-------------|---------------------------------------------------------------------------------------------------------------|
| scrollDown   | none       | void        | Scrolls to the bottom of the chat area unless auto-scroll is disabled or the user has manually scrolled.      |
| handleScroll | none       | void        | Handles scroll events, updating `userScrolled` and managing auto-scroll state based on user interaction.      |

## Examples

```typescript
import './yp-streaming-llm-scrolling.js';

class MyChatComponent extends YpStreamingLlmScrolling {
  // Implement abstract methods and use scrollDown/handleScroll as needed
}

const chat = document.createElement('my-chat-component');
document.body.appendChild(chat);

// Programmatically scroll to bottom
chat.scrollDown();
```
