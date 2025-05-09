# Service: FluxImageGenerator

The `FluxImageGenerator` class provides an implementation of the `IImageGenerator` interface for generating images using the Replicate API and the Flux Pro model. It handles prompt formatting, aspect ratio selection based on image type, and includes retry logic for robust image generation.

## Constructor

```typescript
constructor(replicateApiKey: string, fluxProModelName: string)
```
- **replicateApiKey** (`string`): The API key for authenticating with the Replicate service.
- **fluxProModelName** (`string`): The name of the Flux Pro model to use (format: `owner/model`).

## Methods

### generateImageUrl

```typescript
generateImageUrl(prompt: string, type?: YpAiGenerateImageTypes): Promise<string | undefined>
```

Generates an image URL by sending a prompt to the Flux Pro model on Replicate. Handles aspect ratio selection based on the image type and retries up to three times in case of errors.

#### Parameters

| Name   | Type                    | Description                                                                 | Required |
|--------|-------------------------|-----------------------------------------------------------------------------|----------|
| prompt | `string`                | The text prompt to generate the image from.                                 | Yes      |
| type   | `YpAiGenerateImageTypes`| The type of image to generate (`"logo"`, `"icon"`, etc.). Defaults to `"logo"`. | No       |

#### Returns

- `Promise<string | undefined>`: The URL of the generated image, or `undefined` if generation failed after retries.

#### Behavior

- Sets the aspect ratio based on the `type` parameter:
  - `"logo"`: `16:9`
  - `"icon"`: `1:1`
  - Other: `16:9`
- Retries up to 3 times on failure, with increasing wait times between attempts.
- Logs errors and warnings to the console.

#### Example

```typescript
const generator = new FluxImageGenerator("your-replicate-api-key", "owner/flux-pro-model");
const imageUrl = await generator.generateImageUrl("A futuristic cityscape", "logo");
if (imageUrl) {
  console.log("Generated image URL:", imageUrl);
} else {
  console.error("Image generation failed.");
}
```

---

# Interface: PsFluxProSchema

Defines the schema for the input sent to the Flux Pro model on Replicate.

## Properties

| Name             | Type     | Description                                      |
|------------------|----------|--------------------------------------------------|
| prompt           | `string` | The text prompt for image generation.            |
| seed             | `number` | (Optional) Random seed for reproducibility.      |
| steps            | `number` | (Optional) Number of inference steps.            |
| guidance         | `number` | (Optional) Guidance scale for the model.         |
| interval         | `number` | (Optional) Interval for intermediate outputs.    |
| aspect_ratio     | `string` | (Optional) Aspect ratio (e.g., `"16:9"`).        |
| safety_tolerance | `number` | (Optional) Safety tolerance parameter.           |

---

# Implements: [IImageGenerator](./iImageGenerator.md)

This class implements the `IImageGenerator` interface, which defines the contract for image generator services.

---

# Dependencies

- [Replicate](https://www.npmjs.com/package/replicate): Used for interacting with the Replicate API.
- [IImageGenerator](./iImageGenerator.md): The interface implemented by this class.
- `YpAiGenerateImageTypes`: Enum or type defining valid image types (e.g., `"logo"`, `"icon"`).

---

# Exported Constants

| Name           | Type    | Description                                  |
|----------------|---------|----------------------------------------------|
| maxRetryCount  | `number`| Maximum number of retries for image generation (default: 3). |

---

# Notes

- The `generateImageUrl` method is robust to transient errors, with exponential backoff between retries.
- The returned value from Replicate is expected to be a single URL (string).
- Errors and retry attempts are logged to the console for debugging purposes.