# AoiLlmExplainDialog

A custom element that provides a dialog interface for explaining answers within a chatbot context. It extends `YpChatbotBase` and uses Material Web Components.

## Properties

| Name                | Type                  | Description                                           |
|---------------------|-----------------------|-------------------------------------------------------|
| earl                | AoiEarlData           | The EARL data associated with the dialog.             |
| groupId             | number                | The group ID for the conversation.                    |
| question            | AoiQuestionData       | The question data to be explained.                    |
| questionText        | string                | The text of the question to be explained.             |
| leftAnswerText      | string                | The text of the left answer option.                   |
| rightAnswerText     | string                | The text of the right answer option.                  |
| leftAnswer          | AoiAnswerToVoteOnData | The data for the left answer to vote on.              |
| rightAnswer         | AoiAnswerToVoteOnData | The data for the right answer to vote on.             |
| currentError        | string \| undefined   | The current error message, if any.                    |
| showCloseButton     | boolean               | Indicates if the close button should be shown.        |
| defaultInfoMessage  | string \| undefined   | The default informational message, if any.            |
| serverApi           | AoiServerApi          | The server API instance for communication.            |
| haveSentFirstQuestion | boolean             | Flag indicating if the first question has been sent.  |

## Methods

| Name                 | Parameters | Return Type | Description                                      |
|----------------------|------------|-------------|--------------------------------------------------|
| setupServerApi       | -          | void        | Sets up the server API instance.                 |
| connectedCallback    | -          | Promise<void> | Lifecycle method for when the element is connected to the DOM. |
| disconnectedCallback | -          | void        | Lifecycle method for when the element is disconnected from the DOM. |
| sendFirstQuestion    | -          | Promise<void> | Sends the first question to the chatbot.        |
| sendChatMessage      | -          | Promise<void> | Sends a chat message through the chatbot.       |
| open                 | -          | void        | Opens the dialog.                                |
| cancel               | -          | void        | Cancels the dialog and closes it.               |
| textAreaKeyDown      | e: KeyboardEvent | boolean | Handles key down events in the text area.      |

## Events

- **yp-ws-opened**: Emitted when the WebSocket connection is opened.
- **chatbot-close**: Emitted when the chatbot is closed.

## Examples

```typescript
// Example usage of the AoiLlmExplainDialog
const dialog = document.createElement('aoi-llm-explain-dialog');
dialog.earl = someEarlData;
dialog.groupId = 123;
dialog.question = someQuestionData;
dialog.questionText = "What is the capital of France?";
dialog.leftAnswerText = "Paris";
dialog.rightAnswerText = "Berlin";
dialog.leftAnswer = someLeftAnswerData;
dialog.rightAnswer = someRightAnswerData;
document.body.appendChild(dialog);
dialog.open();
```

Note: The `AoiEarlData`, `AoiQuestionData`, `AoiAnswerToVoteOnData`, and `AoiServerApi` types are assumed to be defined elsewhere in the codebase and are not detailed in this documentation.