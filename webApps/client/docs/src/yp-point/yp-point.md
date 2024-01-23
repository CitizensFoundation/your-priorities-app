# YpPoint

The `YpPoint` class is a LitElement web component that represents a point in a discussion or debate. It is part of a larger application and interacts with various other components and services to display and manage points made by users.

## Properties

| Name                               | Type                      | Description                                                                 |
|------------------------------------|---------------------------|-----------------------------------------------------------------------------|
| point                              | YpPointData               | The data for the point being displayed.                                     |
| post                               | YpPostData                | The data for the post that the point is associated with.                    |
| group                              | YpGroupData               | The data for the group that the point is associated with.                   |
| user                               | YpUserData \| undefined   | The data for the user who created the point.                                |
| linkPoint                          | boolean                   | Indicates if the point should be a link to a detailed view.                 |
| openTranscript                     | boolean                   | Indicates if the transcript should be open or collapsed.                    |
| hideUser                           | boolean                   | Indicates if the user information should be hidden.                         |
| hideActions                        | boolean                   | Indicates if the action buttons should be hidden.                           |
| isEditing                          | boolean                   | Indicates if the point is currently being edited.                           |
| isAdminCommentEditing              | boolean                   | Indicates if the admin comment is currently being edited.                   |
| hasAdminComments                   | boolean                   | Indicates if there are admin comments on the point.                         |
| maxNumberOfPointsBeforeEditFrozen  | number                    | The maximum number of points before editing is frozen.                      |
| editText                           | string \| undefined       | The text being edited.                                                      |
| editAdminCommentText               | string \| undefined       | The admin comment text being edited.                                        |
| videoActive                        | boolean                   | Indicates if a video is associated with the point.                          |
| pointVideoPath                     | string \| undefined       | The path to the video associated with the point.                            |
| pointImageVideoPath                | string \| undefined       | The path to the video poster image.                                         |
| pointVideoId                       | number \| undefined       | The ID of the video associated with the point.                              |
| audioActive                        | boolean                   | Indicates if an audio is associated with the point.                         |
| pointAudioPath                     | string \| undefined       | The path to the audio associated with the point.                            |
| pointAudioId                       | number \| undefined       | The ID of the audio associated with the point.                              |
| checkingTranscript                 | boolean                   | Indicates if the transcript is being checked.                               |
| portraitVideo                      | boolean                   | Indicates if the video is in portrait mode.                                 |
| checkTranscriptError               | boolean                   | Indicates if there was an error checking the transcript.                    |
| playStartedAt                      | Date \| undefined         | The date and time when playback started.                                    |
| videoPlayListener                  | Function \| undefined     | The listener function for video play events.                                |
| videoPauseListener                 | Function \| undefined     | The listener function for video pause events.                               |
| videoEndedListener                 | Function \| undefined     | The listener function for video ended events.                               |
| audioPlayListener                  | Function \| undefined     | The listener function for audio play events.                                |
| audioPauseListener                 | Function \| undefined     | The listener function for audio pause events.                               |
| audioEndedListener                 | Function \| undefined     | The listener function for audio ended events.                               |

## Methods

| Name                    | Parameters | Return Type | Description                                                                 |
|-------------------------|------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback       |            | void        | Lifecycle method called when the component is added to the DOM.             |
| disconnectedCallback    |            | void        | Lifecycle method called when the component is removed from the DOM.         |
| updated                 | Map        | void        | Lifecycle method called when the component's properties have changed.       |
| renderAdminComments     |            | TemplateResult | Renders the admin comments section.                                      |
| renderUserHeader        |            | TemplateResult | Renders the user header section.                                          |
| renderTextPoint         |            | TemplateResult | Renders the text content of the point.                                    |
| renderVideoOrAudio      |            | TemplateResult | Renders the video or audio content associated with the point.             |
| renderEditPoint         |            | TemplateResult | Renders the edit interface for the point.                                 |
| renderEditMenu          |            | TemplateResult | Renders the edit menu for the point.                                      |
| render                  |            | TemplateResult | Renders the component.                                                    |
| _setOpen                |            | void        | Opens the transcript section.                                              |
| _setClosed              |            | void        | Closes the transcript section.                                             |
| _isEditingChanged       |            | void        | Called when the `isEditing` property changes.                              |
| _isAdminCommentEditingChanged |     | void        | Called when the `isAdminCommentEditing` property changes.                  |
| _shareTap               | CustomEvent| void        | Handles the share tap event.                                               |
| _linkIfNeeded           |            | void        | Navigates to the detailed view if `linkPoint` is true.                     |
| _updateEmojiBindings    |            | void        | Updates the emoji bindings for the edit interfaces.                        |
| _cancelEdit             |            | void        | Cancels the editing of the point.                                          |
| _saveEdit               |            | Promise<void> | Saves the edited point content.                                           |
| _cancelAdminCommentEdit |            | void        | Cancels the editing of the admin comment.                                  |
| _saveAdminCommentEdit   |            | Promise<void> | Saves the edited admin comment.                                           |
| _deletePoint            |            | void        | Initiates the deletion of the point.                                       |
| _reallyDeletePoint      |            | Promise<void> | Confirms and performs the deletion of the point.                          |
| _reportPoint            |            | void        | Initiates the reporting of the point.                                      |
| _onReport               |            | void        | Handles the report confirmation.                                           |
| _editPoint              |            | void        | Initiates the editing of the point.                                        |
| _editAdminComment       |            | void        | Initiates the editing of the admin comment.                                |
| firstUpdated            | Map        | void        | Lifecycle method called after the component's first render.                |
| _pauseMediaPlayback     |            | void        | Pauses media playback.                                                     |
| _pointChanged           |            | void        | Called when the `point` property changes.                                  |
| _checkTranscriptStatus  |            | Promise<void> | Checks the status of the transcript.                                      |
| _resetMedia             |            | void        | Resets the media properties.                                               |
| loginName               |            | string \| undefined | Returns the login name of the user who created the point.                |
| isUpVote                |            | boolean     | Indicates if the point is an upvote.                                       |
| isDownVote              |            | boolean     | Indicates if the point is a downvote.                                      |

## Events (if any)

- **yp-got-admin-rights**: Emitted when the user gets admin rights.
- **yp-logged-in**: Emitted when the user logs in.
- **yp-pause-media-playback**: Emitted to pause media playback.
- **yp-point-deleted**: Emitted when a point is deleted.
- **yp-list-resize**: Emitted when the list needs to be resized.
- **yp-update-point-in-list**: Emitted when a point in the list needs to be updated.

## Examples

```typescript
// Example usage of the YpPoint component
<yp-point
  .point="${this.pointData}"
  .post="${this.postData}"
  .group="${this.groupData}"
  .user="${this.userData}"
  linkPoint="${true}"
  openTranscript="${true}"
  hideUser="${false}"
  hideActions="${false}"
  isEditing="${false}"
  isAdminCommentEditing="${false}"
  hasAdminComments="${true}"
  maxNumberOfPointsBeforeEditFrozen="${5}"
  editText="${'Some edited text'}"
  editAdminCommentText="${'Some edited admin comment'}"
  videoActive="${true}"
  pointVideoPath="${'path/to/video.mp4'}"
  pointImageVideoPath="${'path/to/video-poster.jpg'}"
  pointVideoId="${123}"
  audioActive="${true}"
  pointAudioPath="${'path/to/audio.mp3'}"
  pointAudioId="${456}"
  checkingTranscript="${false}"
  portraitVideo="${false}"
  checkTranscriptError="${false}"
></yp-point>
```

Note: The above example is a hypothetical usage within an HTML template. Actual usage may vary depending on the context within the application.