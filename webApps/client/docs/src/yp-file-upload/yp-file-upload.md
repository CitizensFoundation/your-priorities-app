# YpFileUpload

An element providing a solution to no problem in particular. This component is used for uploading files to a specified target URL. It supports various configurations such as allowing multiple file uploads, setting upload limits, and handling different media types like video and audio.

## Properties

| Name                             | Type                              | Description                                                                 |
|----------------------------------|-----------------------------------|-----------------------------------------------------------------------------|
| `target`                         | `string`                          | The target URL to upload the files to.                                      |
| `uploadLimitSeconds`             | `number \| undefined`             | The maximum time allowed for an upload in seconds.                          |
| `progressHidden`                 | `boolean`                         | Indicates whether the progress bar should be hidden.                        |
| `droppable`                      | `boolean`                         | Indicates whether file drop is allowed.                                     |
| `dropText`                       | `string`                          | The text to display in the file drop area.                                  |
| `multi`                          | `boolean`                         | Indicates whether multiple files can be uploaded.                           |
| `autoChooseFirstVideoFrameAsPost`| `boolean`                         | Automatically choose the first video frame as post.                         |
| `files`                          | `Array<YpUploadFileData>`         | The list of files to be uploaded.                                           |
| `method`                         | `string`                          | The HTTP method to be used during upload.                                   |
| `raised`                         | `boolean`                         | Indicates whether the button should be raised.                              |
| `subText`                        | `string \| undefined`             | Additional text to display below the button.                                |
| `noink`                          | `boolean`                         | Indicates that the button should not have an ink effect.                    |
| `useIconButton`                  | `boolean`                         | Use an icon button instead of a regular button.                             |
| `headers`                        | `Record<string, string>`          | A key-value map of header names and values.                                 |
| `retryText`                      | `string`                          | The text for the tooltip to retry an upload.                                |
| `removeText`                     | `string`                          | The text for the tooltip to remove an upload.                               |
| `successText`                    | `string`                          | The text for the tooltip of a successful upload.                            |
| `errorText`                      | `string`                          | The text to display for a failed upload.                                    |
| `noDefaultCoverImage`            | `boolean`                         | Indicates whether to use a default cover image.                             |
| `shownDropText`                  | `boolean`                         | Indicates whether the drop text should be shown.                            |
| `videoUpload`                    | `boolean`                         | Indicates whether the upload is for a video.                                |
| `audioUpload`                    | `boolean`                         | Indicates whether the upload is for audio.                                  |
| `coverImageSelected`             | `boolean`                         | Indicates whether a cover image has been selected.                          |
| `attachmentUpload`               | `boolean`                         | Indicates whether the upload is for an attachment.                          |
| `currentVideoId`                 | `number \| undefined`             | The ID of the current video being uploaded.                                 |
| `currentAudioId`                 | `number \| undefined`             | The ID of the current audio being uploaded.                                 |
| `transcodingJobId`               | `number \| undefined`             | The ID of the transcoding job.                                              |
| `transcodingComplete`            | `boolean`                         | Indicates whether transcoding is complete.                                  |
| `currentFile`                    | `YpUploadFileData \| undefined`   | The current file being uploaded.                                            |
| `isPollingForTranscoding`        | `boolean`                         | Indicates whether polling for transcoding is active.                        |
| `indeterminateProgress`          | `boolean`                         | Indicates whether the progress is indeterminate.                            |
| `uploadStatus`                   | `string \| undefined`             | The current status of the upload.                                           |
| `accept`                         | `string`                          | The accepted file types for upload.                                         |
| `group`                          | `YpGroupData \| undefined`        | The group data associated with the upload.                                  |
| `capture`                        | `boolean`                         | Indicates whether to capture media directly.                                |
| `hideStatus`                     | `boolean`                         | Indicates whether to hide the upload status.                                |
| `containerType`                  | `string \| undefined`             | The type of container for the upload.                                       |
| `selectedVideoCoverIndex`        | `number`                          | The index of the selected video cover.                                      |
| `videoAspect`                    | `string \| undefined`             | The aspect ratio of the video.                                              |
| `useMainPhotoForVideoCover`      | `boolean`                         | Use the main photo as the video cover.                                      |
| `buttonText`                     | `string`                          | The text to display on the upload button.                                   |
| `buttonIcon`                     | `string`                          | The icon to display on the upload button.                                   |

## Methods

| Name                  | Parameters                      | Return Type | Description                                                                 |
|-----------------------|---------------------------------|-------------|-----------------------------------------------------------------------------|
| `clear`               | `skipEvents: boolean = false`   | `void`      | Clears the list of files and resets the component state.                    |
| `connectedCallback`   |                                 | `void`      | Lifecycle method called when the element is added to the document.          |
| `setupDrop`           |                                 | `void`      | Sets up a drop area for drag-and-drop file uploads.                         |
| `_hasRecorderApp`     |                                 | `boolean`   | Checks if the device has a recorder app available.                          |
| `_fileClick`          |                                 | `void`      | Handles the file input click event.                                         |
| `_openFileInput`      | `aspect?: string`               | `void`      | Opens the file input dialog.                                                |
| `_openMediaRecorder`  |                                 | `void`      | Opens the media recorder dialog.                                            |
| `_dataFromMediaRecorder` | `file: YpUploadFileData`     | `void`      | Handles data received from the media recorder.                              |
| `_fileChange`         | `e: { target: { files: Array<YpUploadFileData> } }` | `void` | Handles changes to the file input.                                          |
| `cancel`              | `file: YpUploadFileData`        | `void`      | Cancels the file upload for a specific file.                                |
| `_cancelUpload`       | `e: { model: { __data__: { item: YpUploadFileData } } }` | `void` | Cancels the file upload.                                                    |
| `_retryUpload`        | `e: { model: { item: YpUploadFileData; __data__: { item: any } } }` | `void` | Retries the file upload.                                                    |
| `_showDropText`       |                                 | `void`      | Determines whether to display the drop text.                                |
| `uploadFile`          | `file: YpUploadFileData`        | `Promise<void>` | Initiates the file upload process.                                          |
| `_checkTranscodingJob`| `jobId: string`                 | `void`      | Checks the status of a transcoding job.                                     |
| `_setVideoCover`      | `event: CustomEvent`            | `void`      | Sets the video cover based on the selected index.                           |
| `_setDefaultImageAsVideoCover` | `event: CustomEvent`   | `void`      | Sets the default image as the video cover.                                  |
| `reallyUploadFile`    | `file: YpUploadFileData`        | `void`      | Performs the actual file upload.                                            |

## Events

- **success**: Fired when a response is received with status code 200.
- **error**: Fired when a response is received with a status code other than 200.
- **before-upload**: Fired when a file is about to be uploaded.
- **file-upload-starting**: Fired when a file upload is starting.
- **file-upload-complete**: Fired when a file upload is complete.

## Examples

```typescript
// Example usage of the web component
<yp-file-upload target="/path/to/destination"></yp-file-upload>
```