# AudioProcessor

The `AudioProcessor` class extends `AudioWorkletProcessor` and is responsible for processing audio data in a web audio context. It handles audio data chunks, formats them, and communicates with the main thread via messages.

## Properties

| Name         | Type    | Description                                      |
|--------------|---------|--------------------------------------------------|
| foundAudio   | boolean | Indicates if audio data has been detected.       |
| recording    | boolean | Indicates if the processor is currently recording audio. |
| chunks       | Array   | Stores chunks of audio data.                     |

## Methods

| Name              | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| initialize        | -                                                                          | void        | Initializes the processor's state.                                          |
| readChannelData   | chunks: Array, channel: number = -1, maxChannels: number = 9               | Array       | Concatenates sampled chunks into channels.                                  |
| formatAudioData   | channels: Array                                                            | Object      | Combines parallel audio data into the correct format.                       |
| floatTo16BitPCM   | float32Array: Float32Array                                                 | ArrayBuffer | Converts 32-bit float data to 16-bit integers.                              |
| getValues         | channel: number = -1                                                       | Object      | Retrieves the most recent amplitude values from the audio stream.           |
| export            | -                                                                          | Object      | Exports chunks as an audio/wav file.                                        |
| receive           | e: MessageEvent                                                            | void        | Handles incoming messages from the main thread.                             |
| sendChunk         | chunk: Array                                                               | void        | Sends processed audio chunk data back to the main thread.                   |
| process           | inputList: Array, outputList: Array, parameters: Object                    | boolean     | Processes audio data, copying input to output and storing chunks if recording. |

## Events

- **receipt**: Emitted after processing a message, containing the result of the requested operation.
- **chunk**: Emitted when a new audio chunk is processed, containing raw and mono audio data.

## Examples

```typescript
// Example usage of the AudioProcessor in a web audio context
const audioContext = new AudioContext();
await audioContext.audioWorklet.addModule(AudioProcessorSrc);
const audioProcessorNode = new AudioWorkletNode(audioContext, 'audio_processor');

audioProcessorNode.port.onmessage = (event) => {
  if (event.data.event === 'receipt') {
    console.log('Received receipt:', event.data);
  } else if (event.data.event === 'chunk') {
    console.log('Received audio chunk:', event.data);
  }
};

// Start recording
audioProcessorNode.port.postMessage({ event: 'start' });

// Stop recording
audioProcessorNode.port.postMessage({ event: 'stop' });

// Export recorded audio
audioProcessorNode.port.postMessage({ event: 'export' });
```