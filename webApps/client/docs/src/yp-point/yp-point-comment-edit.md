# YpPointCommentEdit

A custom element that provides functionality for editing a comment on a point or image. It includes a text field for the comment content and a button to submit the comment. The element is styled with responsive design considerations.

## Properties

| Name     | Type            | Description                                      |
|----------|-----------------|--------------------------------------------------|
| comment  | YpPointData     | The comment object associated with the point.    |
| point    | YpPointData     | The point object associated with the comment.    |
| image    | YpImageData     | The image object associated with the comment.    |

## Methods

| Name            | Parameters                        | Return Type | Description                                                                 |
|-----------------|-----------------------------------|-------------|-----------------------------------------------------------------------------|
| newPointComment |                                   | string      | Getter that retrieves the current value of the point comment text field.    |
| _responseError  |                                   | void        | Disables the submit button to indicate an error response.                   |
| _reset          |                                   | void        | Resets the comment form to its initial state.                               |
| _sendComment    |                                   | Promise<void> | Submits the comment to the server API and handles the response.           |
| _keyDown        | event: KeyboardEvent              | void        | Handles the keydown event to submit the comment when the enter key is pressed. |

## Events

- **iron-resize**: Emitted when the comment property changes and meets specific conditions.
- **yp-error**: Emitted when there is an error, such as the comment being too short.
- **refresh**: Emitted after a comment is successfully submitted and the form is reset.

## Examples

```typescript
// Example usage of the YpPointCommentEdit element
<yp-point-comment-edit
  .comment=${this.comment}
  .point=${this.point}
  .image=${this.image}
></yp-point-comment-edit>
```

Note: The actual usage of the element would depend on the context in which it is placed, including the data passed to its properties.