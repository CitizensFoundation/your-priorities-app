# AoiLlmExplainDialog

The `AoiLlmExplainDialog` class is a custom web component that extends `YpChatbotBase`. It provides a dialog interface for explaining answers using a language model.

## Properties

| Name               | Type                          | Description                                                                 |
|--------------------|-------------------------------|-----------------------------------------------------------------------------|
| earl               | AoiEarlData                   | Data related to the earl object.                                            |
| groupId            | number                        | Identifier for the group.                                                   |
| question           | AoiQuestionData               | Data related to the question being asked.                                   |
| questionText       | string                        | The text of the question being asked.                                       |
| leftAnswerText     | string                        | The text of the left answer option.                                         |
| rightAnswerText    | string                        | The text of the right answer option.                                        |
| leftAnswer         | AoiAnswerToVoteOnData         | Data related to the left answer option.                                     |
| rightAnswer        | AoiAnswerToVoteOnData         | Data related to the right answer option.                                    |
| currentError       | string \| undefined           | Current error message, if any.                                              |
| showCloseButton    | boolean                       | Determines if the close button should be shown. Defaults to `true`.         |
| defaultInfoMessage | string \| undefined           | Default informational message.                                              |
| serverApi          | AoiServerApi                  | Instance of the server API used for communication.                          |
| haveSentFirstQuestion | boolean                    | Indicates if the first question has been sent. Defaults to `false`.         |

## Methods

| Name                  | Parameters | Return Type | Description                                                                 |
|-----------------------|------------|-------------|-----------------------------------------------------------------------------|
| setupServerApi        | None       | void        | Initializes the server API instance.                                        |
| connectedCallback     | None       | Promise<void> | Lifecycle method called when the element is added to the document.          |
| disconnectedCallback  | None       | void        | Lifecycle method called when the element is removed from the document.      |
| sendFirstQuestion     | None       | Promise<void> | Sends the first question to the server API.                                 |
| sendChatMessage       | None       | Promise<void> | Sends a chat message to the server API.                                     |
| open                  | None       | void        | Opens the dialog.                                                           |
| cancel                | None       | void        | Closes the dialog and fires a "closed" event.                               |
| textAreaKeyDown       | e: KeyboardEvent | boolean | Handles keydown events in the text area to prevent default behavior on Enter key. |
| render                | None       | TemplateResult | Renders the dialog component.                                               |

## Events

- **closed**: Emitted when the dialog is closed.

## Examples

```typescript
// Example usage of the AoiLlmExplainDialog component
const dialog = document.createElement('aoi-llm-explain-dialog');
dialog.earl = someEarlData;
dialog.groupId = 123;
dialog.question = someQuestionData;
dialog.questionText = "What is the capital of France?";
dialog.leftAnswerText = "Paris";
dialog.rightAnswerText = "Lyon";
document.body.appendChild(dialog);
dialog.open();
```