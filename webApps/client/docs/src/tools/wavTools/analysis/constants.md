# Musical Octaves and Frequencies

Type definitions and constants for musical octaves and frequencies, useful for mapping frequency ranges from Fast Fourier Transform to human-interpretable ranges, notably music ranges and human vocal ranges.

## Properties

| Name                     | Type                | Description                                                                 |
|--------------------------|---------------------|-----------------------------------------------------------------------------|
| octave8Frequencies       | readonly number[]   | Eighth octave frequencies in Hz.                                            |
| octave8FrequencyLabels   | readonly OctaveNote[] | Labels for each of the eighth octave frequencies.                           |
| noteFrequencies          | number[]            | All note frequencies from 1st to 8th octave in Hz.                          |
| noteFrequencyLabels      | string[]            | Labels for each of the note frequencies from 1st to 8th octave.             |
| voiceFrequencyRange      | FrequencyRange      | Subset of note frequencies between 32 and 2000 Hz, representing a 6 octave range from C1 to B6. |
| voiceFrequencies         | number[]            | Frequencies within the voice frequency range.                               |
| voiceFrequencyLabels     | string[]            | Labels for frequencies within the voice frequency range.                    |

## Examples

```typescript
// Example usage of the musical octaves and frequencies

// Accessing the eighth octave frequencies
console.log(octave8Frequencies); // [4186.01, 4434.92, 4698.63, 4978.03, 5274.04, 5587.65, 5919.91, 6271.93, 6644.88, 7040.0, 7458.62, 7902.13]

// Accessing the labels for the eighth octave frequencies
console.log(octave8FrequencyLabels); // ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

// Accessing all note frequencies from 1st to 8th octave
console.log(noteFrequencies);

// Accessing labels for all note frequencies from 1st to 8th octave
console.log(noteFrequencyLabels);

// Accessing frequencies within the voice frequency range
console.log(voiceFrequencies);

// Accessing labels for frequencies within the voice frequency range
console.log(voiceFrequencyLabels);
```