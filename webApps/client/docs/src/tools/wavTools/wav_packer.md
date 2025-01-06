# WavPacker

Utility class for assembling PCM16 "audio/wav" data.

## Properties

| Name | Type | Description |
|------|------|-------------|
| None |      |             |

## Methods

| Name              | Parameters                                                                 | Return Type         | Description                                                                 |
|-------------------|----------------------------------------------------------------------------|---------------------|-----------------------------------------------------------------------------|
| floatTo16BitPCM   | float32Array: Float32Array                                                 | ArrayBuffer         | Converts Float32Array of amplitude data to ArrayBuffer in Int16Array format.|
| mergeBuffers      | leftBuffer: ArrayBuffer, rightBuffer: ArrayBuffer                          | ArrayBuffer         | Concatenates two ArrayBuffers.                                              |
| pack              | sampleRate: number, audio: AudioData                                       | WavPackerAudioType  | Packs audio into "audio/wav" Blob.                                          |

## Events

None

## Examples

```typescript
// Example usage of the WavPacker class

// Create an instance of WavPacker
const wavPacker = new WavPacker();

// Example audio data
const audioData: AudioData = {
  bitsPerSample: 16,
  channels: [new Float32Array([0.5, -0.5]), new Float32Array([0.5, -0.5])],
  data: new Int16Array([32767, -32768, 32767, -32768])
};

// Pack the audio data into a WAV format
const wavAudio = wavPacker.pack(44100, audioData);

// Access the Blob and URL
console.log(wavAudio.blob);
console.log(wavAudio.url);
```

## Interfaces

### WavPackerAudioType

| Name         | Type   | Description                        |
|--------------|--------|------------------------------------|
| blob         | Blob   | The audio data as a Blob object.   |
| url          | string | The URL for the audio Blob.        |
| channelCount | number | Number of audio channels.          |
| sampleRate   | number | Sample rate of the audio.          |
| duration     | number | Duration of the audio in seconds.  |

### AudioData

| Name          | Type          | Description                        |
|---------------|---------------|------------------------------------|
| bitsPerSample | number        | Number of bits per audio sample.   |
| channels      | Float32Array[]| Array of audio channels.           |
| data          | Int16Array    | Audio data in Int16Array format.   |