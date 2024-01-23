# YpFileUpload

An element providing a solution to no problem in particular.

## Properties

| Name                     | Type                              | Description                                                                 |
|--------------------------|-----------------------------------|-----------------------------------------------------------------------------|
| target                   | String                            | The target URL to upload the files to.                                      |
| uploadLimitSeconds       | Number \| undefined               | The limit in seconds for the upload.                                        |
| progressHidden           | Boolean                           | Indicates whether or not the progress bar should be hidden.                 |
| droppable                | Boolean                           | Indicates whether or not to allow file drop.                                |
| dropText                 | String                            | The text to display in the file drop area.                                  |
| multi                    | Boolean                           | Indicates whether or not to allow multiple files to be uploaded.            |
| files                    | Array<YpUploadFileData>           | The list of files to be uploaded.                                           |
| method                   | String                            | The HTTP method to be used during upload.                                   |
| raised                   | Boolean                           | Indicates whether or not the button should be raised.                       |
| subText                  | String \| undefined               | Additional text to display.                                                 |
| noink                    | Boolean                           | Indicates that the button should not have an ink effect.                    |
| useIconButton            | Boolean                           | Indicates whether to use an icon button.                                    |
| headers                  | Record<string, string>            | A key-value map of header names and values.                                 |
| retryText                | String                            | The text for the tooltip to retry an upload.                                |
| removeText               | String                            | The text for the tooltip to remove an upload.                               |
| successText              | String                            | The text for the tooltip of a successful upload.                            |
| errorText                | String                            | The text to display for a failed upload.                                    |
| noDefaultCoverImage      | Boolean                           | Indicates whether or not to use a default cover image.                      |
| shownDropText            | Boolean                           | Indicates whether or not the drop text should be shown.                     |
| videoUpload              | Boolean                           | Indicates whether the upload is for a video.                                |
| audioUpload              | Boolean                           | Indicates whether the upload is for an audio.                               |
| attachmentUpload         | Boolean                           | Indicates whether the upload is for an attachment.                          |
| currentVideoId           | Number \| undefined               | The ID of the current video being uploaded.                                 |
| currentAudioId           | Number \| undefined               | The ID of the current audio being uploaded.                                 |
| transcodingJobId         | Number \| undefined               | The ID of the transcoding job.                                              |
| transcodingComplete      | Boolean                           | Indicates whether transcoding is complete.                                  |
| currentFile              | YpUploadFileData \| undefined     | The current file being uploaded.                                            |
| isPollingForTranscoding  | Boolean                           | Indicates whether the component is polling for transcoding status.          |
| indeterminateProgress    | Boolean                           | Indicates whether the progress bar should be indeterminate.                 |
| uploadStatus             | String \| undefined               | The status of the upload.                                                   |
| accept                   | String                            | The accepted types of files for the input.                                  |
| group                    | YpGroupData \| undefined          | The group data associated with the upload.                                  |
| capture                  | Boolean                           | Indicates whether the file input should capture media directly.             |
| hideStatus               | Boolean                           | Indicates whether to hide the upload status.                                |
| containerType            | String \| undefined               | The type of container for the upload.                                       |
| selectedVideoCoverIndex  | Number                            | The index of the selected video cover.                                      |
| videoAspect              | String \| undefined               | The aspect ratio of the video.                                              |
| useMainPhotoForVideoCover| Boolean                           | Indicates whether to use the main photo for the video cover.                |
| buttonText               | String                            | The text to display on the button.                                          |
| buttonIcon               | String                            | The icon to display on the button.                                          |

## Methods

| Name            | Parameters | Return Type | Description                           |
|-----------------|------------|-------------|---------------------------------------|
| clear           |            | void        | Clears the list of files.             |
| setupDrop       |            | void        | Sets up a drop area for file uploads. |
| _fileClick      |            | void        | Handles the file click action.        |
| _openFileInput  | aspect: String \| undefined | void | Opens the file input dialog.       |
| _openMediaRecorder |            | void        | Opens the media recorder.             |
| _dataFromMediaRecorder | file: YpUploadFileData | void | Processes data from the media recorder. |
| _fileChange     | e: Event   | void        | Handles changes to the file input.    |
| cancel          | file: YpUploadFileData | void | Cancels the file upload.             |
| _cancelUpload   | e: Event   | void        | Cancels the upload.                   |
| _retryUpload    | e: Event   | void        | Retries the file upload.              |
| _showDropText   |            | void        | Shows or hides the drop text.         |
| uploadFile      | file: YpUploadFileData | void | Initiates the file upload.           |
| _checkTranscodingJob | jobId: string | void | Checks the status of a transcoding job. |
| _setVideoCover  | event: CustomEvent | void | Sets the video cover.                |
| _setDefaultImageAsVideoCover | event: CustomEvent | void | Sets the default image as video cover. |
| reallyUploadFile | file: YpUploadFileData | void | Actually uploads the file.           |

## Events

- **success**: Fired when a response is received with status code 200.
- **error**: Fired when a response is received with a status code other than 200.
- **before-upload**: Fired when a file is about to be uploaded.

## Examples

```typescript
// Example usage of the YpFileUpload component
<yp-file-upload target="/path/to/destination"></yp-file-upload>
```