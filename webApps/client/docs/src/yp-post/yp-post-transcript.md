# YpPostTranscript

`YpPostTranscript` is a custom web component that provides functionality for displaying and editing transcripts for posts. It allows users to view automatic transcripts, edit them if they have the necessary access, and check the status of transcript processing.

## Properties

| Name                | Type                  | Description                                                                 |
|---------------------|-----------------------|-----------------------------------------------------------------------------|
| isEditing           | Boolean               | Indicates if the transcript is currently being edited.                      |
| editText            | String \| undefined   | The text that is being edited.                                              |
| checkingTranscript  | Boolean               | Indicates if the component is currently checking the transcript status.     |
| checkTranscriptError| Boolean               | Indicates if there was an error while checking the transcript status.       |
| post                | YpPostData            | The post data associated with the transcript.                               |

## Methods

| Name                  | Parameters | Return Type | Description                                                                                   |
|-----------------------|------------|-------------|-----------------------------------------------------------------------------------------------|
| _isEditingChanged     |            | void        | Updates emoji bindings and triggers a resize event when the editing state changes.            |
| _updateEmojiBindings  |            | void        | Binds emoji selector to the text input if editing is enabled.                                 |
| _cancelEdit           |            | void        | Cancels the editing of the transcript.                                                        |
| _saveEdit             |            | Promise     | Saves the edited transcript content to the server and updates the local post data.            |
| _editPostTranscript   |            | void        | Enables editing mode and sets the editText to the current transcript text.                    |
| _checkTranscriptStatus|            | Promise     | Checks the status of the transcript processing and updates the component state accordingly.   |
| hasPostAccess         |            | Boolean     | Checks if the current user has access to edit the post.                                       |
| _postChanged          |            | void        | Resets checking states and initiates a transcript status check if conditions are met.         |

## Events

- **iron-resize**: Emitted after certain updates to notify that a resize might be needed.

## Examples

```typescript
// Example usage of the YpPostTranscript component
const postTranscriptElement = document.createElement('yp-post-transcript');
postTranscriptElement.post = somePostData; // YpPostData object
document.body.appendChild(postTranscriptElement);
```

Please note that the actual usage of this component would typically be within a larger application context where `YpPostData` and other required types are defined and managed.