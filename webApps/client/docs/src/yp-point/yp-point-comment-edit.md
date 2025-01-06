# YpPointCommentEdit

The `YpPointCommentEdit` class is a custom web component that extends `YpBaseElementWithLogin`. It provides functionality for editing and submitting comments related to points or images. The component includes a text field for input and a button to submit the comment.

## Properties

| Name    | Type             | Description                                      |
|---------|------------------|--------------------------------------------------|
| comment | YpPointData \| undefined | The comment data associated with the point or image. |
| point   | YpPointData \| undefined | The point data to which the comment is related.       |
| image   | YpImageData \| undefined | The image data to which the comment is related.       |

## Methods

| Name              | Parameters                                      | Return Type | Description                                                                 |
|-------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| render            | None                                            | TemplateResult | Renders the component's HTML template.                                      |
| updated           | changedProperties: Map<string \| number \| symbol, unknown> | void        | Called when the component's properties change.                              |
| newPointComment   | None                                            | string      | Retrieves the current value of the comment text field.                      |
| connectedCallback | None                                            | void        | Lifecycle method called when the component is added to the document.        |
| _responseError    | None                                            | void        | Handles errors by enabling the submit button.                               |
| _reset            | None                                            | void        | Resets the comment data and UI elements.                                    |
| _sendComment      | None                                            | Promise<void> | Sends the comment to the server and handles the response.                   |
| _keyDown          | event: KeyboardEvent                            | void        | Handles the keydown event to submit the comment when the Enter key is pressed. |

## Events

- **iron-resize**: Emitted when the comment value changes and meets specific conditions.
- **yp-error**: Emitted when there is an error, such as a comment being too short.
- **refresh**: Emitted after a comment is successfully sent to refresh the UI.

## Examples

```typescript
// Example usage of the yp-point-comment-edit component
import './path/to/yp-point-comment-edit.js';

const commentEditElement = document.createElement('yp-point-comment-edit');
commentEditElement.comment = { content: "Initial comment" };
commentEditElement.point = { id: 123 };
document.body.appendChild(commentEditElement);
```