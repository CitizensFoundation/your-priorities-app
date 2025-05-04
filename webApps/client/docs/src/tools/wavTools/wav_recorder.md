# WavRecorder

Records live stream of user audio as PCM16 "audio/wav" data. Provides methods for device management, permission handling, audio analysis, and exporting audio data.

## Properties

| Name                    | Type                                                                                                   | Description                                                                                      |
|-------------------------|--------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| scriptSrc               | string                                                                                                | Source URL for the AudioWorklet processor script.                                                |
| sampleRate              | number                                                                                                | The sample rate for audio recording.                                                             |
| outputToSpeakers        | boolean                                                                                               | Whether to output audio to speakers during recording.                                            |
| debug                   | boolean                                                                                               | Enables debug logging if true.                                                                   |
| _deviceChangeCallback   | ((devices: (MediaDeviceInfo & { default: boolean })[]) => void) \| null                               | Callback for device change events.                                                               |
| _devices                | MediaDeviceInfo[]                                                                                     | List of available media devices.                                                                 |
| stream                  | MediaStream \| null                                                                                   | The current audio stream.                                                                        |
| processor               | AudioWorkletNode \| null                                                                              | The AudioWorkletNode processing the audio.                                                       |
| source                  | MediaStreamAudioSourceNode \| null                                                                    | The audio source node.                                                                           |
| node                    | AudioNode \| null                                                                                     | The connected audio node.                                                                        |
| recording               | boolean                                                                                               | Indicates if currently recording.                                                                |
| _lastEventId            | number                                                                                                | Last used event ID for worklet communication.                                                    |
| eventReceipts           | { [key: number]: any }                                                                                | Stores receipts for events sent to the AudioWorklet.                                             |
| eventTimeout            | number                                                                                                | Timeout in ms for event responses from the AudioWorklet.                                         |
| _chunkProcessor         | (data: { mono: Int16Array; raw: Int16Array }) => any                                                  | Function to process audio chunks.                                                                |
| _chunkProcessorSize     | number \| undefined                                                                                   | Size in bytes for chunk processing.                                                              |
| _chunkProcessorBuffer   | { raw: ArrayBuffer; mono: ArrayBuffer }                                                               | Buffer for accumulating audio chunks.                                                            |
| analyser                | AnalyserNode \| null                                                                                  | Analyser node for frequency analysis.                                                            |

## Methods

| Name                       | Parameters                                                                                                                                                                                                 | Return Type                                      | Description                                                                                                                        |
|----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| constructor                | { sampleRate?: number; outputToSpeakers?: boolean; debug?: boolean } = {}                                                                                                                                  | WavRecorder                                      | Create a new WavRecorder instance.                                                                                                 |
| static decode              | audioData: Blob \| Float32Array \| Int16Array \| ArrayBuffer \| number[], sampleRate?: number, fromSampleRate?: number                                              | Promise<DecodedAudioType>                        | Decodes audio data from multiple formats to a Blob, url, Float32Array, and AudioBuffer.                                            |
| log                        | ...args: any[]                                                                                                                                                                                            | true                                             | Logs data in debug mode.                                                                                                           |
| getSampleRate              | none                                                                                                                                                                                                      | number                                           | Retrieves the current sampleRate for the recorder.                                                                                 |
| getStatus                  | none                                                                                                                                                                                                      | 'ended' \| 'paused' \| 'recording'               | Retrieves the current status of the recording.                                                                                     |
| listenForDeviceChange      | callback: ((devices: (MediaDeviceInfo & { default: boolean })[]) => void) \| null                                                                                   | true                                             | Sets device change callback, remove if callback provided is `null`.                                                                |
| requestPermission          | none                                                                                                                                                                                                      | Promise<true>                                    | Manually request permission to use the microphone.                                                                                 |
| listDevices                | none                                                                                                                                                                                                      | Promise<(MediaDeviceInfo & { default?: boolean })[]> | List all eligible devices for recording, will request permission to use microphone.                                                |
| begin                      | deviceId?: string                                                                                                                                                                                         | Promise<true>                                    | Begins a recording session and requests microphone permissions if not already granted.                                             |
| getFrequencies             | analysisType?: 'frequency' \| 'music' \| 'voice', minDecibels?: number, maxDecibels?: number                                                                       | AudioAnalysisOutputType                          | Gets the current frequency domain data from the recording track.                                                                   |
| pause                      | none                                                                                                                                                                                                      | Promise<true>                                    | Pauses the recording. Keeps microphone stream open but halts storage of audio.                                                     |
| record                     | chunkProcessor?: (data: { mono: Int16Array; raw: Int16Array }) => any, chunkSize?: number                                                                          | Promise<true>                                    | Start recording stream and storing to memory from the connected audio source.                                                      |
| clear                      | none                                                                                                                                                                                                      | Promise<true>                                    | Clears the audio buffer, empties stored recording.                                                                                 |
| read                       | none                                                                                                                                                                                                      | Promise<{ meanValues: Float32Array; channels: Float32Array[] }> | Reads the current audio stream data.                                                                                                |
| save                       | force?: boolean                                                                                                                                                                                           | Promise<WavPackerAudioType>                      | Saves the current audio stream to a file.                                                                                          |
| end                        | none                                                                                                                                                                                                      | Promise<WavPackerAudioType>                      | Ends the current recording session and saves the result.                                                                           |
| quit                       | none                                                                                                                                                                                                      | Promise<true>                                    | Performs a full cleanup of WavRecorder instance. Stops actively listening via microphone and removes existing listeners.            |

## Examples

```typescript
// Create a new recorder
const recorder = new WavRecorder({ sampleRate: 16000, debug: true });

// List available devices
recorder.listDevices().then(devices => {
  console.log(devices);
});

// Begin a session (optionally with a deviceId)
await recorder.begin();

// Start recording
await recorder.record((chunk) => {
  // Process audio chunk
  console.log(chunk);
});

// Pause recording
await recorder.pause();

// Save the recording
const wavData = await recorder.save();

// End the session and cleanup
await recorder.end();

// Quit and cleanup everything
await recorder.quit();
```
