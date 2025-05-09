# Type: YpAiGenerateImageTypes

A TypeScript union type representing the allowed image generation types.

## Allowed Values

| Value   | Description                |
|---------|----------------------------|
| "logo"  | Generate a logo image      |
| "icon"  | Generate an icon image     |
| "other" | Generate another image type|

---

# Interface: IImageGenerator

Defines the contract for an image generator service that can generate image URLs based on a prompt and a specified type.

## Methods

| Name              | Parameters                                      | Return Type                | Description                                                                                 |
|-------------------|------------------------------------------------|----------------------------|---------------------------------------------------------------------------------------------|
| generateImageUrl  | prompt: string, type: YpAiGenerateImageTypes    | Promise<string \| undefined>| Generates an image URL given a prompt and a type (logo, icon, etc.). Returns the URL string or undefined if generation fails. |

### Method: generateImageUrl

Generates an image URL given a prompt and a type (logo, icon, etc.).

#### Parameters

| Name   | Type                    | Description                                 |
|--------|-------------------------|---------------------------------------------|
| prompt | string                  | The text prompt describing the desired image|
| type   | YpAiGenerateImageTypes  | The type of image to generate ("logo", "icon", or "other") |

#### Returns

- `Promise<string | undefined>`: A promise that resolves to the generated image URL as a string, or `undefined` if the image could not be generated.

---

## Example Usage

```typescript
const generator: IImageGenerator = ...;

const url = await generator.generateImageUrl("A futuristic city skyline", "logo");
if (url) {
  console.log("Generated image URL:", url);
} else {
  console.log("Image generation failed.");
}
```

---

## See Also

- [YpAiGenerateImageTypes](#type-ypaigenerateimagetypes)