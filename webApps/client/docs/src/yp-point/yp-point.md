# YpPoint

The `YpPoint` class is a custom web component that extends `YpBaseElement`. It represents a point in a discussion or post, with various properties and methods to manage its state, rendering, and interactions.

## Properties

| Name                                | Type                              | Description                                                                 |
|-------------------------------------|-----------------------------------|-----------------------------------------------------------------------------|
| `point`                             | `YpPointData`                     | The data object representing the point.                                     |
| `post`                              | `YpPostData`                      | The data object representing the post associated with the point.            |
| `group`                             | `YpGroupData`                     | The data object representing the group associated with the point.           |
| `user`                              | `YpUserData \| undefined`         | The user data associated with the point.                                    |
| `linkPoint`                         | `boolean`                         | Indicates if the point should be linked.                                    |
| `openTranscript`                    | `boolean`                         | Indicates if the transcript should be open.                                 |
| `hideUser`                          | `boolean`                         | Indicates if the user information should be hidden.                         |
| `hideActions`                       | `boolean`                         | Indicates if the action buttons should be hidden.                           |
| `isEditing`                         | `boolean`                         | Indicates if the point is in editing mode.                                  |
| `isUpVoted`                         | `boolean`                         | Indicates if the point is upvoted.                                          |
| `isDownVoted`                       | `boolean`                         | Indicates if the point is downvoted.                                        |
| `isAdminCommentEditing`             | `boolean`                         | Indicates if the admin comment is in editing mode.                          |
| `hasAdminComments`                  | `boolean`                         | Indicates if there are admin comments.                                      |
| `maxNumberOfPointsBeforeEditFrozen` | `number`                          | The maximum number of points before editing is frozen.                      |
| `editText`                          | `string \| undefined`             | The text being edited for the point.                                        |
| `editAdminCommentText`              | `string \| undefined`             | The text being edited for the admin comment.                                |
| `videoActive`                       | `boolean`                         | Indicates if a video is active for the point.                               |
| `pointVideoPath`                    | `string \| undefined`             | The path to the point's video.                                              |
| `pointImageVideoPath`               | `string \| undefined`             | The path to the point's video image.                                        |
| `pointVideoId`                      | `number \| undefined`             | The ID of the point's video.                                                |
| `audioActive`                       | `boolean`                         | Indicates if audio is active for the point.                                 |
| `pointAudioPath`                    | `string \| undefined`             | The path to the point's audio.                                              |
| `pointAudioId`                      | `number \| undefined`             | The ID of the point's audio.                                                |
| `checkingTranscript`                | `boolean`                         | Indicates if the transcript is being checked.                               |
| `portraitVideo`                     | `boolean`                         | Indicates if the video is in portrait mode.                                 |
| `checkTranscriptError`              | `boolean`                         | Indicates if there was an error checking the transcript.                    |
| `playStartedAt`                     | `Date \| undefined`               | The date and time when playback started.                                    |
| `videoPlayListener`                 | `Function \| undefined`           | The listener function for video play events.                                |
| `videoPauseListener`                | `Function \| undefined`           | The listener function for video pause events.                               |
| `videoEndedListener`                | `Function \| undefined`           | The listener function for video ended events.                               |
| `audioPlayListener`                 | `Function \| undefined`           | The listener function for audio play events.                                |
| `audioPauseListener`                | `Function \| undefined`           | The listener function for audio pause events.                               |
| `audioEndedListener`                | `Function \| undefined`           | The listener function for audio ended events.                               |

## Methods

| Name                          | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| `connectedCallback`           | None                                                                       | `void`      | Lifecycle method called when the element is added to the document.          |
| `disconnectedCallback`        | None                                                                       | `void`      | Lifecycle method called when the element is removed from the document.      |
| `_updateQualitiesFromSignal`  | None                                                                       | `void`      | Updates the qualities of the point from a signal.                           |
| `_updateQualities`            | None                                                                       | `void`      | Updates the upvote and downvote status of the point.                        |
| `updated`                     | `changedProperties: Map<string \| number \| symbol, unknown>`              | `void`      | Lifecycle method called when properties are updated.                        |
| `renderAdminComments`         | None                                                                       | `TemplateResult` | Renders the admin comments section.                                         |
| `renderUserHeader`            | None                                                                       | `TemplateResult \| nothing` | Renders the user header section.                                             |
| `renderTextPoint`             | None                                                                       | `TemplateResult` | Renders the text content of the point.                                      |
| `renderVideoOrAudio`          | None                                                                       | `TemplateResult` | Renders the video or audio content of the point.                            |
| `renderEditPoint`             | None                                                                       | `TemplateResult` | Renders the edit point section.                                             |
| `renderEditMenu`              | None                                                                       | `TemplateResult` | Renders the edit menu section.                                              |
| `render`                      | None                                                                       | `TemplateResult` | Renders the entire component.                                               |
| `_setOpen`                    | None                                                                       | `void`      | Sets the transcript to open.                                                |
| `_setClosed`                  | None                                                                       | `void`      | Sets the transcript to closed.                                              |
| `isEditingSomething`          | None                                                                       | `boolean`   | Returns true if the point or admin comment is being edited.                 |
| `showAdminComments`           | None                                                                       | `boolean`   | Returns true if admin comments should be shown.                             |
| `hasAdminCommentAccess`       | None                                                                       | `boolean`   | Returns true if the user has access to edit admin comments.                 |
| `videoOrAudioActive`          | None                                                                       | `boolean`   | Returns true if either video or audio is active.                            |
| `_isEditingChanged`           | None                                                                       | `void`      | Handles changes to the editing state.                                       |
| `_isAdminCommentEditingChanged` | None                                                                     | `void`      | Handles changes to the admin comment editing state.                         |
| `_shareTap`                   | `event: CustomEvent`                                                       | `void`      | Handles the share button tap event.                                         |
| `pointUrl`                    | None                                                                       | `string`    | Returns the URL of the point.                                               |
| `_linkIfNeeded`               | None                                                                       | `void`      | Navigates to the post if the point is linked.                               |
| `_updateEmojiBindings`        | None                                                                       | `void`      | Updates the emoji bindings for the point or admin comment editor.           |
| `_cancelEdit`                 | None                                                                       | `void`      | Cancels the point editing.                                                  |
| `_saveEdit`                   | None                                                                       | `Promise<void>` | Saves the edited point content.                                             |
| `_cancelAdminCommentEdit`     | None                                                                       | `void`      | Cancels the admin comment editing.                                          |
| `_saveAdminCommentEdit`       | None                                                                       | `Promise<void>` | Saves the edited admin comment content.                                     |
| `_deletePoint`                | None                                                                       | `void`      | Initiates the point deletion process.                                       |
| `_reallyDeletePoint`          | None                                                                       | `Promise<void>` | Deletes the point.                                                          |
| `_reportPoint`                | None                                                                       | `void`      | Reports the point.                                                          |
| `_onReport`                   | None                                                                       | `void`      | Handles the report confirmation.                                            |
| `_editPoint`                  | None                                                                       | `void`      | Initiates the point editing process.                                        |
| `_editAdminComment`           | None                                                                       | `void`      | Initiates the admin comment editing process.                                |
| `hasPointAccess`              | None                                                                       | `boolean`   | Returns true if the user has access to the point.                           |
| `canEditPoint`                | None                                                                       | `boolean`   | Returns true if the point can be edited.                                    |
| `firstUpdated`                | `changedProperties: Map<string \| number \| symbol, unknown>`              | `void`      | Lifecycle method called after the first update.                             |
| `_pauseMediaPlayback`         | None                                                                       | `void`      | Pauses media playback.                                                      |
| `_pointChanged`               | None                                                                       | `void`      | Handles changes to the point property.                                      |
| `_checkTranscriptStatus`      | None                                                                       | `Promise<void>` | Checks the status of the transcript.                                        |
| `_resetMedia`                 | None                                                                       | `void`      | Resets the media properties.                                                |
| `loginName`                   | None                                                                       | `string \| undefined` | Returns the login name of the user associated with the point.               |
| `isUpVote`                    | None                                                                       | `boolean`   | Returns true if the point is upvoted.                                       |
| `isDownVote`                  | None                                                                       | `boolean`   | Returns true if the point is downvoted.                                     |

## Events

- **yp-got-admin-rights**: Emitted when admin rights are obtained.
- **yp-logged-in**: Emitted when a user logs in.
- **yp-pause-media-playback**: Emitted to pause media playback.
- **yp-got-endorsements-and-qualities**: Emitted when endorsements and qualities are updated.
- **yp-list-resize**: Emitted to request a list resize.
- **yp-point-deleted**: Emitted when a point is deleted.
- **yp-update-point-in-list**: Emitted to update a point in the list.

## Examples

```typescript
// Example usage of the YpPoint component
import { html } from "lit";
import "./yp-point.js";

const template = html`
  <yp-point
    .point="${pointData}"
    .post="${postData}"
    .group="${groupData}"
    .user="${userData}"
  ></yp-point>
`;
```