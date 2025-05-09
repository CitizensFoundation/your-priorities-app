# Service: ChatGptImageGenerator

The `ChatGptImageGenerator` class provides an implementation of the `IImageGenerator` interface, enabling image generation via OpenAI's GPT-based image model (`gpt-image-1`). It generates image URLs from prompts, with built-in retry logic and support for different image types and sizes. The generated image URLs are temporary and should be downloaded or cached promptly.

- **Implements:** [`IImageGenerator`](./iImageGenerator.md)

## Constructor

### `new ChatGptImageGenerator(openAiKey?: string)`

Creates a new instance of `ChatGptImageGenerator`.

| Name      | Type    | Description                                                                 |
|-----------|---------|-----------------------------------------------------------------------------|
| openAiKey | string? | (Optional) OpenAI API key. If not provided, the SDK uses `process.env.OPENAI_API_KEY`. |

---

## Methods

### `generateImageUrl(prompt: string, type?: YpAiGenerateImageTypes): Promise<string | undefined>`

Generates an image URL from a prompt using OpenAI’s `gpt-image-1` model. The returned URL is valid for approximately 60 minutes. The method includes retry logic (up to 3 attempts) with exponential back-off in case of errors.

| Name   | Type                        | Description                                                                                 |
|--------|-----------------------------|---------------------------------------------------------------------------------------------|
| prompt | string                      | The prompt describing the image to generate.                                                |
| type   | YpAiGenerateImageTypes = "logo" | The type of image to generate. Determines the canvas size. Defaults to `"logo"`.            |

#### Returns

- `Promise<string | undefined>`  
  The URL of the generated image, or `undefined` if generation fails after retries.

#### Image Type to Size Mapping

- `"icon"`: `"1024x1024"`
- `"logo"`: `"1536x1024"` (default)
- `"other"`: `"1536x1024"`

#### Prompt Augmentation

The prompt is automatically appended with instructions to create a high-quality logo-like image and to avoid adding text unless specified.

#### Retry Logic

- Retries up to 3 times on failure.
- Exponential back-off: waits 5s, 10s, 15s between retries.

#### Example Usage

```typescript
import { ChatGptImageGenerator } from './chatGptImageGenerator.js';

const generator = new ChatGptImageGenerator('your-openai-key');
const url = await generator.generateImageUrl('A futuristic city skyline at sunset', 'logo');
if (url) {
  // Download or cache the image immediately
}
```

---

## Properties

| Name           | Type     | Description                                               |
|----------------|----------|-----------------------------------------------------------|
| maxRetryCount  | number   | Maximum number of retry attempts (default: 3).            |
| openAiKey      | string?  | The OpenAI API key used for authentication (optional).    |

---

## Exported

- `ChatGptImageGenerator` (class, default export)

---

## Dependencies

- [`OpenAI`](https://www.npmjs.com/package/openai): Used for image generation.
- [`IImageGenerator`, `YpAiGenerateImageTypes`](./iImageGenerator.md): Interface and type for image generation.

---

## Notes

- The generated image URL is temporary (valid for ~60 minutes). Download or cache the image promptly.
- Errors and failed attempts are logged to the console.
- The class is designed for use in backend services that need to generate images dynamically via OpenAI.

---

## See Also

- [IImageGenerator Interface](./iImageGenerator.md)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference/images/create)
