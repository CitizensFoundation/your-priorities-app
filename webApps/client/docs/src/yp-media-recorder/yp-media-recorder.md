# YpMediaRecorder

The `YpMediaRecorder` class is a custom web component that provides functionality for recording audio and video. It allows users to record media, preview the recording, and upload files. It also supports selecting input devices and setting video aspect ratios.

## Properties

| Name                | Type                        | Description                                                                 |
|---------------------|-----------------------------|-----------------------------------------------------------------------------|
| recorder            | RecordRTC \| undefined      | The recorder instance used for recording media.                             |
| mediaStream         | MediaStream \| undefined    | The media stream being recorded.                                            |
| captureStream       | MediaStream \| undefined    | The media stream used for capturing media.                                  |
| audioRecording      | boolean                     | Indicates if audio recording is enabled.                                    |
| videoRecording      | boolean                     | Indicates if video recording is enabled.                                    |
| maxLength           | number                      | The maximum length of the recording in seconds.                             |
| recordedData        | File \| undefined           | The recorded media file.                                                    |
| recordingFinished   | boolean                     | Indicates if the recording has finished.                                    |
| isRecording         | boolean                     | Indicates if recording is currently in progress.                            |
| rememberDevice      | boolean                     | Indicates if the selected input device should be remembered.                |
| previewActive       | boolean                     | Indicates if the preview of the recorded media is active.                   |
| callbackFunction    | Function \| undefined       | A callback function to be called with the recorded data.                    |
| captureCallback     | Function \| undefined       | A callback function to be called when the media capture is ready.           |
| uploadFileFunction  | Function \| undefined       | A function to handle file uploads.                                          |
| selectDeviceFunction| Function \| undefined       | A function to handle device selection.                                      |
| error               | string \| undefined         | An error message to be displayed if something goes wrong.                   |
| selectDeviceTitle   | string \| undefined         | The title for the device selection dialog.                                  |
| recordSecondsLeft   | number                      | The number of seconds left in the recording.                                |
| audioDevices        | Array<MediaDeviceInfo> \| undefined | The list of available audio input devices.                       |
| videoDevices        | Array<MediaDeviceInfo> \| undefined | The list of available video input devices.                       |
| allDevices          | Array<MediaDeviceInfo> \| undefined | The list of all available input devices.                           |
| videoOptions        | object \| undefined         | Options for the video recording.                                            |
| surfer              | WaveSurfer \| undefined     | The WaveSurfer instance used for displaying audio waveforms.                |
| videoAspect         | string                      | The aspect ratio of the video ('portrait' or 'landscape').                  |
| selectedCamera      | string                      | The selected camera for video recording.                                    |
| hasFacingMode       | boolean                     | Indicates if the device has a facing mode option for cameras.               |
| isMobile            | boolean                     | Indicates if the device is mobile.                                          |
| selectedAudioDeviceId | string \| null             | The ID of the selected audio input device.                                  |
| selectedVideoDeviceId | string \| null             | The ID of the selected video input device.                                  |
| videoSettings       | { width: number; height: number; deviceId?: string } \| undefined | The settings for the video recording. |

## Methods

| Name                  | Parameters        | Return Type | Description                                                                 |
|-----------------------|-------------------|-------------|-----------------------------------------------------------------------------|
| _closeMediaStream     |                   | void        | Stops the media stream and destroys the WaveSurfer instance if it exists.   |
| _uploadFileThroughPhoneCamera |           | void        | Initiates the upload process through the phone camera.                      |
| _openRecorderDialog   |                   | Promise<void> | Opens the recorder dialog and sets up the recording environment.         |
| _setVideoAspect       | event: CustomEvent| void        | Sets the video aspect ratio based on the selected option.                   |
| _selectAudioDevice    | event: CustomEvent| void        | Selects the audio input device based on the user's choice.                  |
| _selectVideoDevice    | event: CustomEvent| void        | Selects the video input device based on the user's choice.                  |
| _checkAudioDevices    |                   | Promise<void> | Checks for available audio devices and handles device selection.         |
| _checkVideoDevices    |                   | Promise<void> | Checks for available video devices and handles device selection.         |
| _close                |                   | void        | Closes the media stream and the dialog.                                     |
| _uploadFile           |                   | void        | Initiates the file upload process.                                          |
| _sendBack             |                   | void        | Sends the recorded data back through the callback function.                 |
| checkDevices          |                   | void        | Checks for available media devices.                                         |
| connectedCallback     |                   | void        | Lifecycle callback that runs when the component is added to the DOM.        |
| captureUserMedia      | callback: Function| void        | Captures user media and calls the provided callback with the media stream.  |
| _openMediaSession     | callback: Function \| undefined | void | Opens a media session with the selected devices.                        |
| open                  | options: object   | Promise<void> | Opens the media recorder with the provided options.                      |
| _generateRandomString |                   | string      | Generates a random string for file naming.                                  |
| _startRecording       |                   | void        | Starts the recording process.                                               |
| _stopRecording        |                   | void        | Stops the recording process.                                                |
| _deleteRecording      |                   | void        | Deletes the current recording and resets the recorder.                      |
| _storeRecordedData    |                   | void        | Stores the recorded data into a file.                                       |
| _recordingTimer       |                   | void        | Handles the recording timer and updates the seconds left.                   |
| setupRecorders        |                   | void        | Sets up the recorders for audio or video based on the selected options.     |

## Events (if any)

- **noDevicesFound**: Emitted when no media devices are found.
- **userError**: Emitted when there is an error capturing user media.

## Examples

```typescript
// Example usage of the YpMediaRecorder component
const mediaRecorder = document.createElement('yp-media-recorder');

// Set up options for recording
const options = {
  callbackFunction: (recordedData) => {
    console.log('Recorded data:', recordedData);
  },
  videoRecording: true,
  audioRecording: false,
  maxLength: 60,
  uploadFileFunction: (videoAspect) => {
    console.log('Uploading file with aspect:', videoAspect);
  }
};

// Open the media recorder with the specified options
mediaRecorder.open(options);
```

Note: The above example assumes that the `yp-media-recorder` component is already defined and registered as a custom element in the browser.