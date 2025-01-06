# AoiGenerateAiLogos

The `AoiGenerateAiLogos` class is a custom web component that extends the `YpGenerateAiImage` class. It is designed to generate AI-based logo images with specific color schemes and styles.

## Properties

| Name            | Type                              | Description                                                                 |
|-----------------|-----------------------------------|-----------------------------------------------------------------------------|
| imageType       | YpAiGenerateImageTypes            | Overrides the image type to "icon".                                         |
| hexColor        | string                            | The base hex color used for generating the image.                           |
| promptFromUser  | string \| undefined               | The user-provided prompt for generating the image.                          |

## Methods

| Name                      | Parameters                                                                 | Return Type                  | Description                                                                 |
|---------------------------|----------------------------------------------------------------------------|------------------------------|-----------------------------------------------------------------------------|
| hexToRgb                  | hex: string                                                                | { r: number; g: number; b: number } | Converts a hex color string to an RGB object.                               |
| rgbToHsl                  | r: number, g: number, b: number                                            | { h: number; s: number; l: number } | Converts RGB values to an HSL object.                                       |
| hslToHex                  | h: number, s: number, l: number                                            | string                       | Converts HSL values to a hex color string.                                  |
| getComplementaryColor     | hex: string                                                                | string                       | Calculates the complementary color for a given hex color.                   |
| hexToColorDescription     | hex: string                                                                | string                       | Provides a textual description of the color based on its RGB components.    |
| generateImage             |                                                                            | Promise<object>              | Initiates the image generation process and returns a promise with the result.|
| generateIcon              | answer: string, promptFromUser: string                                     | Promise<object>              | Generates an icon based on the provided text and style prompt.              |

## Events

- **got-image**: Emitted when the image generation is successful.
- **image-generation-error**: Emitted when there is an error during image generation.

## Examples

```typescript
// Example usage of the AoiGenerateAiLogos component
const logoGenerator = document.createElement('aoi-generate-ai-logos') as AoiGenerateAiLogos;
logoGenerator.hexColor = "#ff5733";
logoGenerator.generateIcon("Sample Text", "Minimalistic style").then((image) => {
  console.log("Generated Image:", image);
}).catch((error) => {
  console.error("Error generating image:", error);
});
```