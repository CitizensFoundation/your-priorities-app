# YpPostTranscript

`YpPostTranscript` is a custom web component that handles the display and editing of transcripts for posts. It allows users with the appropriate access to edit the transcript text and provides functionality to check the status of transcript processing.

## Properties

| Name                | Type      | Description                                                                 |
|---------------------|-----------|-----------------------------------------------------------------------------|
| isEditing           | Boolean   | Indicates if the transcript is currently being edited.                      |
| editText            | String    | The text that is being edited.                                              |
| checkingTranscript  | Boolean   | Indicates if the component is currently checking the transcript status.     |
| checkTranscriptError| Boolean   | Indicates if there was an error while checking the transcript status.       |
| post                | YpPostData| The post data object containing information about the post and its transcript. |

## Methods

| Name                  | Parameters | Return Type | Description                                                                 |
|-----------------------|------------|-------------|-----------------------------------------------------------------------------|
| _isEditingChanged     |            | void        | Handles changes to the `isEditing` property.                                |
| _updateEmojiBindings  |            | void        | Updates emoji bindings when editing is enabled.                             |
| _cancelEdit           |            | void        | Cancels the editing of the transcript.                                      |
| _saveEdit             |            | Promise<void> | Saves the edited transcript.                                                |
| _editPostTranscript   |            | void        | Enables editing mode for the transcript.                                    |
| _checkTranscriptStatus|            | Promise<void> | Checks the status of the transcript processing and updates the component.  |
| hasPostAccess         |            | Boolean    | Checks if the current user has access to the post.                          |
| _postChanged          |            | void        | Handles changes to the `post` property.                                     |

## Events

- **iron-resize**: Emitted when the component needs to signal a resize, often after editing changes.

## Examples

```typescript
// Example usage of the YpPostTranscript component
<yp-post-transcript
  .post="${this.postData}"
  .isEditing="${this.isEditingTranscript}"
  @iron-resize="${this.handleResize}">
</yp-post-transcript>
```

Please note that the actual implementation of the `YpPostTranscript` component may require additional context and setup not provided in this example, such as the `YpPostData` type definition and the `handleResize` method.