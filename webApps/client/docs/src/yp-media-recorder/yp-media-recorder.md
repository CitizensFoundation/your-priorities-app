# YpMediaRecorder

A custom web component for recording audio and video using the browser's media devices. It provides functionalities to start, stop, and manage recordings, as well as upload recorded files.

## Properties

| Name                 | Type                                      | Description                                                                 |
|----------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| recorder             | RecordRTC \| undefined                    | Instance of RecordRTC for handling media recording.                         |
| mediaStream          | MediaStream \| undefined                  | The media stream used for recording.                                        |
| captureStream        | MediaStream \| undefined                  | The media stream used for capturing.                                        |
| audioRecording       | boolean                                   | Indicates if audio recording is enabled.                                    |
| videoRecording       | boolean                                   | Indicates if video recording is enabled.                                    |
| maxLength            | number                                    | Maximum length of the recording in seconds.                                 |
| recordedData         | File \| undefined                         | The recorded media data as a file.                                          |
| recordingFinished    | boolean                                   | Indicates if the recording has finished.                                    |
| isRecording          | boolean                                   | Indicates if recording is currently in progress.                            |
| rememberDevice       | boolean                                   | Indicates if the selected device should be remembered.                      |
| previewActive        | boolean                                   | Indicates if the preview of the recording is active.                        |
| callbackFunction     | Function \| undefined                     | Callback function to be called after recording is finished.                 |
| captureCallback      | Function \| undefined                     | Callback function for capturing user media.                                 |
| uploadFileFunction   | Function \| undefined                     | Function to handle file upload.                                             |
| selectDeviceFunction | Function \| undefined                     | Function to handle device selection.                                        |
| error                | string \| undefined                       | Error message to be displayed.                                              |
| selectDeviceTitle    | string \| undefined                       | Title for the device selection dialog.                                      |
| recordSecondsLeft    | number                                    | Seconds left for the recording.                                             |
| audioDevices         | Array<MediaDeviceInfo> \| undefined       | List of available audio input devices.                                      |
| videoDevices         | Array<MediaDeviceInfo> \| undefined       | List of available video input devices.                                      |
| allDevices           | Array<MediaDeviceInfo> \| undefined       | List of all available media devices.                                        |
| videoOptions         | object \| undefined                       | Options for video recording.                                                |
| surfer               | WaveSurfer \| undefined                   | Instance of WaveSurfer for audio visualization.                             |
| videoAspect          | string                                    | Aspect ratio of the video ("portrait" or "landscape").                      |
| selectedCamera       | string                                    | The selected camera ("user" or "environment").                              |
| hasFacingMode        | boolean                                   | Indicates if the device has a facing mode.                                  |
| isMobile             | boolean                                   | Indicates if the device is mobile.                                          |
| selectedAudioDeviceId| string \| null                            | ID of the selected audio device.                                            |
| selectedVideoDeviceId| string \| null                            | ID of the selected video device.                                            |
| videoSettings        | { width: number; height: number; deviceId?: string } \| undefined | Settings for video recording.                                               |

## Methods

| Name                        | Parameters                                                                 | Return Type | Description                                                                 |
|-----------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| _closeMediaStream           | None                                                                       | void        | Closes the current media stream and stops the surfer.                       |
| _uploadFileThroughPhoneCamera | None                                                                     | void        | Uploads a file using the phone camera.                                      |
| _openRecorderDialog         | None                                                                       | Promise<void>| Opens the recorder dialog and sets up the recorder.                         |
| render                      | None                                                                       | TemplateResult | Renders the component's HTML template.                                      |
| _setVideoAspect             | event: CustomEvent                                                         | void        | Sets the video aspect ratio based on the event.                             |
| _selectAudioDevice          | event: CustomEvent                                                         | void        | Selects an audio device based on the event.                                 |
| _selectVideoDevice          | event: CustomEvent                                                         | void        | Selects a video device based on the event.                                  |
| _checkAudioDevices          | None                                                                       | Promise<void>| Checks available audio devices and opens media session if applicable.       |
| _checkVideoDevices          | None                                                                       | Promise<void>| Checks available video devices and opens media session if applicable.       |
| _close                      | None                                                                       | void        | Closes the media stream and dialogs.                                        |
| _uploadFile                 | None                                                                       | void        | Closes the media stream and uploads the file.                               |
| _sendBack                   | None                                                                       | void        | Sends the recorded data back using the callback function.                   |
| checkDevices                | None                                                                       | void        | Checks available media devices.                                             |
| connectedCallback           | None                                                                       | void        | Lifecycle method called when the component is added to the document.        |
| captureUserMedia            | callback: Function                                                         | void        | Captures user media and checks devices.                                     |
| _openMediaSession           | callback: Function \| undefined                                            | void        | Opens a media session with the specified callback.                          |
| open                        | options: { callbackFunction: Function \| undefined; videoRecording: boolean; audioRecording: boolean; maxLength: number; uploadFileFunction: Function \| undefined; } | Promise<void>| Opens the media recorder with the specified options.                        |
| _generateRandomString       | None                                                                       | string      | Generates a random string.                                                  |
| _startRecording             | None                                                                       | void        | Starts the recording process.                                               |
| _stopRecording              | None                                                                       | void        | Stops the recording process.                                                |
| _deleteRecording            | None                                                                       | void        | Deletes the current recording.                                              |
| _storeRecordedData          | None                                                                       | void        | Stores the recorded data as a file.                                         |
| _recordingTimer             | None                                                                       | void        | Manages the recording timer.                                                |
| setupRecorders              | None                                                                       | void        | Sets up the recorders for audio or video.                                   |

## Examples

```typescript
// Example usage of the YpMediaRecorder component
const mediaRecorder = document.createElement('yp-media-recorder');
document.body.appendChild(mediaRecorder);

mediaRecorder.open({
  callbackFunction: (data) => console.log('Recorded data:', data),
  videoRecording: true,
  audioRecording: false,
  maxLength: 10,
  uploadFileFunction: (aspect) => console.log('Upload file with aspect:', aspect),
});
```