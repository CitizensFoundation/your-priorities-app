# AoiGenerateAiLogos

A subclass of `YpGenerateAiImage` that specializes in generating AI logos with specific color schemes.

## Properties

| Name            | Type   | Description                                       |
|-----------------|--------|---------------------------------------------------|
| imageType       | `YpAiGenerateImageTypes` | The type of image to generate, set to "icon".     |
| hexColor        | `string` | The hex color value used for the logo background. |
| promptFromUser  | `string \| undefined` | An optional prompt provided by the user for image generation. |

## Methods

| Name                  | Parameters                  | Return Type | Description                                                                 |
|-----------------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| hexToRgb              | hex: `string`               | `{ r: number; g: number; b: number }` | Converts a hex color string to an RGB object.                               |
| rgbToHsl              | r: `number`, g: `number`, b: `number` | `{ h: number; s: number; l: number }` | Converts RGB color values to an HSL object.                                 |
| hslToHex              | h: `number`, s: `number`, l: `number` | `string` | Converts HSL color values to a hex color string.                            |
| getComplementaryColor | hex: `string`               | `string` | Calculates the complementary color for a given hex color.                   |
| hexToColorDescription | hex: `string`               | `string` | Provides a textual description of the color represented by the hex value.   |
| generateImage         |                             | `Promise<object>` | Generates an image based on the current properties and returns a promise.   |
| generateIcon          | answer: `string`, promptFromUser: `string` | `Promise<object>` | Generates an icon based on the given answer and user prompt.                |

## Examples

```typescript
// Example usage of AoiGenerateAiLogos
const logoGenerator = new AoiGenerateAiLogos("#FF5733");
const rgb = logoGenerator.hexToRgb("#FF5733");
console.log(rgb); // { r: 255, g: 87, b: 51 }

const hsl = logoGenerator.rgbToHsl(255, 87, 51);
console.log(hsl); // { h: 9.411764705882353, s: 100, l: 60 }

const hex = logoGenerator.hslToHex(9, 100, 60);
console.log(hex); // "#ff5733"

const complementaryColor = logoGenerator.getComplementaryColor("#FF5733");
console.log(complementaryColor); // Complementary color hex value

const colorDescription = logoGenerator.hexToColorDescription("#FF5733");
console.log(colorDescription); // "red"

// Generating an image (async operation)
logoGenerator.generateImage().then(imageDetails => {
  console.log(imageDetails);
}).catch(error => {
  console.error(error);
});

// Generating an icon with a user prompt (async operation)
logoGenerator.generateIcon("Your Answer", "Simple shapes").then(iconDetails => {
  console.log(iconDetails);
}).catch(error => {
  console.error(error);
});
```