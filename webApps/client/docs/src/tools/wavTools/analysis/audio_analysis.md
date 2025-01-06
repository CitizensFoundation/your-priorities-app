# AudioAnalysis

Analyzes audio for visual output by processing frequency domain data from an audio source.

## Properties

| Name         | Type                               | Description                                                                 |
|--------------|------------------------------------|-----------------------------------------------------------------------------|
| fftResults   | Float32Array[]                     | Stores the FFT results for the audio analysis.                              |
| audio        | HTMLAudioElement                   | The HTML audio element being analyzed.                                      |
| context      | AudioContext \| OfflineAudioContext| The audio context used for processing the audio.                            |
| analyser     | AnalyserNode                       | The analyser node used to obtain frequency domain data.                     |
| sampleRate   | number                             | The sample rate of the audio context.                                       |
| audioBuffer  | AudioBuffer \| null                | The audio buffer used for offline analysis, if provided.                    |

## Methods

| Name                | Parameters                                                                 | Return Type              | Description                                                                 |
|---------------------|----------------------------------------------------------------------------|--------------------------|-----------------------------------------------------------------------------|
| getFrequencies      | analysisType: 'frequency' \| 'music' \| 'voice' = 'frequency', minDecibels: number = -100, maxDecibels: number = -30 | AudioAnalysisOutputType  | Gets the current frequency domain data from the playing audio track.        |
| resumeIfSuspended   | None                                                                       | Promise<true>            | Resumes the internal AudioContext if it was suspended due to lack of user interaction. |
| static getFrequencies | analyser: AnalyserNode, sampleRate: number, fftResult?: Float32Array, analysisType: 'frequency' \| 'music' \| 'voice' = 'frequency', minDecibels: number = -100, maxDecibels: number = -30 | AudioAnalysisOutputType  | Retrieves frequency domain data from an AnalyserNode adjusted to a decibel range and returns human-readable formatting and labels. |

## Examples

```typescript
// Example usage of the AudioAnalysis class
const audioElement = document.querySelector('audio');
const audioAnalysis = new AudioAnalysis(audioElement);

// Get frequency data
const frequencyData = audioAnalysis.getFrequencies('music');

// Resume audio context if needed
audioAnalysis.resumeIfSuspended().then(() => {
  console.log('Audio context resumed');
});
```