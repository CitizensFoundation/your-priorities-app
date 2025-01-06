# WavRecorder

The `WavRecorder` class is used to record live streams of user audio as PCM16 "audio/wav" data. It provides methods to manage audio recording sessions, process audio data, and handle device changes.

## Properties

| Name                   | Type                                                                 | Description                                                                 |
|------------------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------|
| scriptSrc              | string                                                               | The source of the audio processor script.                                   |
| sampleRate             | number                                                               | The sample rate for audio recording.                                        |
| outputToSpeakers       | boolean                                                              | Whether to output audio to speakers.                                        |
| debug                  | boolean                                                              | Whether to enable debug logging.                                            |
| _deviceChangeCallback  | ((devices: (MediaDeviceInfo & { default: boolean })[]) => void) \| null | Callback for device change events.                                          |
| _devices               | MediaDeviceInfo[]                                                    | List of available media devices.                                            |
| stream                 | MediaStream \| null                                                  | The media stream used for recording.                                        |
| processor              | AudioWorkletNode \| null                                             | The audio worklet node for processing audio.                                |
| source                 | MediaStreamAudioSourceNode \| null                                   | The audio source node for the media stream.                                 |
| node                   | AudioNode \| null                                                    | The audio node connected to the processor.                                  |
| recording              | boolean                                                              | Whether recording is currently active.                                      |
| _lastEventId           | number                                                               | The last event ID used for event handling.                                  |
| eventReceipts          | { [key: number]: any }                                               | Receipts for events sent to the audio worklet.                              |
| eventTimeout           | number                                                               | Timeout for waiting for event receipts.                                     |
| _chunkProcessor        | (data: { mono: Int16Array; raw: Int16Array }) => any                 | Function to process audio chunks.                                           |
| _chunkProcessorSize    | number \| undefined                                                  | Size of the audio chunk processor buffer.                                   |
| _chunkProcessorBuffer  | { raw: ArrayBuffer; mono: ArrayBuffer }                              | Buffer for storing audio chunks.                                            |
| analyser               | AnalyserNode \| null                                                 | Analyser node for frequency analysis.                                       |

## Methods

| Name                   | Parameters                                                                 | Return Type                  | Description                                                                 |
|------------------------|----------------------------------------------------------------------------|------------------------------|-----------------------------------------------------------------------------|
| constructor            | { sampleRate?: number, outputToSpeakers?: boolean, debug?: boolean }       | void                         | Creates a new instance of WavRecorder.                                      |
| static decode          | audioData: Blob \| Float32Array \| Int16Array \| ArrayBuffer \| number[], sampleRate?: number, fromSampleRate?: number | Promise<DecodedAudioType>    | Decodes audio data into a Blob, URL, Float32Array, and AudioBuffer.        |
| log                    | ...args: any[]                                                             | true                         | Logs data if debug mode is enabled.                                         |
| getSampleRate          |                                                                            | number                       | Retrieves the current sample rate for the recorder.                         |
| getStatus              |                                                                            | 'ended' \| 'paused' \| 'recording' | Retrieves the current status of the recording.                              |
| listenForDeviceChange  | callback: ((devices: (MediaDeviceInfo & { default: boolean })[]) => void) \| null | true                         | Sets or removes the device change callback.                                 |
| requestPermission      |                                                                            | Promise<true>                | Manually requests permission to use the microphone.                         |
| listDevices            |                                                                            | Promise<(MediaDeviceInfo & { default?: boolean })[]> | Lists all eligible devices for recording.                                   |
| begin                  | deviceId?: string                                                          | Promise<true>                | Begins a recording session and requests microphone permissions if needed.   |
| getFrequencies         | analysisType?: 'frequency' \| 'music' \| 'voice', minDecibels?: number, maxDecibels?: number | AudioAnalysisOutputType      | Gets the current frequency domain data from the recording track.            |
| pause                  |                                                                            | Promise<true>                | Pauses the recording, keeping the microphone stream open.                   |
| record                 | chunkProcessor?: (data: { mono: Int16Array; raw: Int16Array }) => any, chunkSize?: number | Promise<true>                | Starts recording and storing audio from the connected source.               |
| clear                  |                                                                            | Promise<true>                | Clears the audio buffer and empties stored recording.                       |
| read                   |                                                                            | Promise<{ meanValues: Float32Array; channels: Float32Array[] }> | Reads the current audio stream data.                                        |
| save                   | force?: boolean                                                            | Promise<WavPackerAudioType>  | Saves the current audio stream to a file.                                   |
| end                    |                                                                            | Promise<WavPackerAudioType>  | Ends the current recording session and saves the result.                    |
| quit                   |                                                                            | Promise<true>                | Performs a full cleanup of the WavRecorder instance.                        |

## Examples

```typescript
// Example usage of the WavRecorder class
const recorder = new WavRecorder({ sampleRate: 44100, outputToSpeakers: true, debug: true });
await recorder.begin();
await recorder.record((data) => {
  console.log('Audio chunk:', data);
});
setTimeout(async () => {
  await recorder.pause();
  const audioData = await recorder.save();
  console.log('Saved audio data:', audioData);
  await recorder.quit();
}, 5000);
```