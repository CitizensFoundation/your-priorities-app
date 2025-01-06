# YpPostTranscript

The `YpPostTranscript` class is a custom web component that extends `YpBaseElement`. It is designed to handle the display and editing of post transcripts, including checking the status of transcripts and managing user interactions for editing.

## Properties

| Name                | Type      | Description                                                                 |
|---------------------|-----------|-----------------------------------------------------------------------------|
| isEditing           | boolean   | Indicates whether the transcript is currently being edited.                 |
| editText            | string \| undefined | The current text being edited in the transcript.                              |
| checkingTranscript  | boolean   | Indicates whether the transcript status is currently being checked.         |
| checkTranscriptError| boolean   | Indicates if there was an error while checking the transcript status.       |
| post                | YpPostData| The post data object containing transcript and other related information.   |

## Methods

| Name                    | Parameters                                      | Return Type | Description                                                                 |
|-------------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| render                  | None                                            | TemplateResult | Renders the HTML template for the component.                                |
| _isEditingChanged       | None                                            | void        | Handles changes when the `isEditing` property changes.                      |
| _updateEmojiBindings    | None                                            | void        | Updates the emoji bindings when editing is enabled.                         |
| _cancelEdit             | None                                            | void        | Cancels the current edit operation.                                         |
| _saveEdit               | None                                            | Promise<void> | Saves the edited transcript text to the server.                             |
| _editPostTranscript     | None                                            | void        | Initiates the editing process for the transcript.                           |
| _checkTranscriptStatus  | None                                            | Promise<void> | Checks the status of the transcript and updates the component accordingly.  |
| hasPostAccess           | None                                            | boolean     | Checks if the current user has access to edit the post.                     |
| updated                 | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method called when properties are updated.                        |
| _postChanged            | None                                            | void        | Handles changes when the `post` property changes.                           |

## Examples

```typescript
// Example usage of the YpPostTranscript component
import './yp-post-transcript.js';

const transcriptElement = document.createElement('yp-post-transcript');
transcriptElement.post = {
  id: '123',
  public_data: {
    transcript: {
      text: 'This is a sample transcript.',
      language: 'en',
      userEdited: false,
      noMachineTranslation: false,
      inProgress: false
    }
  },
  cover_media_type: 'audio',
  description: 'Sample post description'
};

document.body.appendChild(transcriptElement);
```