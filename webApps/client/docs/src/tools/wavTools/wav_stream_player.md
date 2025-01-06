# WavStreamPlayer

Plays audio streams received in raw PCM16 chunks from the browser.

## Properties

| Name                  | Type                              | Description                                                                 |
|-----------------------|-----------------------------------|-----------------------------------------------------------------------------|
| scriptSrc             | string                            | Source of the stream processor script.                                      |
| sampleRate            | number                            | Sample rate for the audio context.                                          |
| context               | AudioContext \| null              | Audio context used for audio processing.                                    |
| stream                | AudioWorkletNode \| null          | Audio worklet node for processing audio streams.                            |
| analyser              | AnalyserNode \| null              | Analyser node for audio analysis.                                           |
| trackSampleOffsets    | Record<string, TrackSampleOffset> | Record of track sample offsets.                                             |
| interruptedTrackIds   | Record<string, boolean>           | Record of interrupted track IDs.                                            |

## Methods

| Name                  | Parameters                                                                 | Return Type                          | Description                                                                 |
|-----------------------|----------------------------------------------------------------------------|--------------------------------------|-----------------------------------------------------------------------------|
| constructor           | options: WavStreamPlayerOptions = {}                                       | WavStreamPlayer                      | Creates a new WavStreamPlayer instance.                                     |
| connect               | -                                                                          | Promise<true>                        | Connects the audio context and enables output to speakers.                  |
| getFrequencies        | analysisType: AnalysisType = 'frequency', minDecibels = -100, maxDecibels = -30 | ReturnType<typeof AudioAnalysis.getFrequencies> | Gets the current frequency domain data from the playing track.              |
| add16BitPCM           | arrayBuffer: ArrayBuffer \| Int16Array, trackId = 'default'                | Int16Array \| void                   | Adds 16BitPCM data to the currently playing audio stream.                   |
| getTrackSampleOffset  | interrupt = false                                                          | Promise<TrackSampleOffset \| null>   | Gets the offset (sample count) of the currently playing stream.             |
| interrupt             | -                                                                          | Promise<TrackSampleOffset \| null>   | Strips the current stream and returns the sample offset of the audio.       |

## Examples

```typescript
// Example usage of the WavStreamPlayer
const player = new WavStreamPlayer({ sampleRate: 48000 });
await player.connect();
const pcmData = new Int16Array([/* PCM data */]);
player.add16BitPCM(pcmData, 'track1');
const frequencies = player.getFrequencies('music');
console.log(frequencies);
const offset = await player.getTrackSampleOffset();
console.log(offset);
await player.interrupt();
```