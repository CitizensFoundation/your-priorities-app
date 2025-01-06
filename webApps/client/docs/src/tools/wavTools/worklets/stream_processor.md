# StreamProcessor

The `StreamProcessor` class extends `AudioWorkletProcessor` to handle audio data processing in a web audio context. It manages audio data buffers, processes incoming messages, and handles audio stream interruptions.

## Properties

| Name                | Type                  | Description                                                                 |
|---------------------|-----------------------|-----------------------------------------------------------------------------|
| hasStarted          | boolean               | Indicates if the audio processing has started.                              |
| hasInterrupted      | boolean               | Indicates if the audio processing has been interrupted.                     |
| outputBuffers       | Array<{ buffer: Float32Array, trackId: string \| null }> | Stores the output audio buffers.                                            |
| bufferLength        | number                | The length of the buffer used for audio data.                               |
| write               | { buffer: Float32Array, trackId: string \| null } | The current buffer being written to and its associated track ID.            |
| writeOffset         | number                | The current offset in the write buffer.                                     |
| trackSampleOffsets  | Record<string, number> | Keeps track of sample offsets for each track ID.                            |

## Methods

| Name       | Parameters                                      | Return Type | Description                                                                 |
|------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| writeData  | float32Array: Float32Array, trackId?: string \| null | boolean     | Writes audio data to the buffer and manages buffer overflow.                |
| process    | inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array> | boolean     | Processes audio data, outputs it, and handles interruptions and stops.      |

## Events

- **write**: Triggered when new audio data is received to be written to the buffer.
- **offset**: Triggered to request the current sample offset for a track.
- **interrupt**: Triggered to handle interruptions in the audio stream.
- **stop**: Emitted when the audio processing should stop due to an interruption or completion.

## Examples

```typescript
// Example usage of the StreamProcessor in an AudioWorklet
const audioContext = new AudioContext();
await audioContext.audioWorklet.addModule(StreamProcessorSrc);

const streamProcessorNode = new AudioWorkletNode(audioContext, 'stream_processor');

// Sending a message to write data
streamProcessorNode.port.postMessage({
  event: 'write',
  buffer: new Int16Array([/* audio data */]),
  trackId: 'track1'
});

// Handling messages from the processor
streamProcessorNode.port.onmessage = (event) => {
  if (event.data.event === 'stop') {
    console.log('Audio processing stopped.');
  }
};
```