# Service: DalleImageGenerator

The `DalleImageGenerator` class provides an implementation of the `IImageGenerator` interface for generating images using either Azure OpenAI or standard OpenAI DALL·E APIs. It supports configurable API credentials and deployment options, automatic fallback between Azure and OpenAI, and includes retry logic for robust image generation.

## Constructor

```typescript
constructor(
  azureOpenaAiBase: string | undefined,
  azureOpenAiApiKey: string | undefined,
  azureDalleDeployment: string | undefined,
  openAiKey: string | undefined
)
```

Initializes a new instance of the `DalleImageGenerator` class.

### Parameters

| Name                | Type     | Description                                                                 |
|---------------------|----------|-----------------------------------------------------------------------------|
| azureOpenaAiBase    | string \| undefined | The Azure OpenAI endpoint base URL. Optional.                |
| azureOpenAiApiKey   | string \| undefined | The Azure OpenAI API key. Optional.                          |
| azureDalleDeployment| string \| undefined | The Azure DALL·E deployment name. Optional.                  |
| openAiKey           | string \| undefined | The standard OpenAI API key. Optional.                       |

## Methods

### generateImageUrl

```typescript
async generateImageUrl(
  prompt: string,
  type: YpAiGenerateImageTypes = "logo"
): Promise<string | undefined>
```

Generates an image URL from a given prompt using DALL·E (via Azure OpenAI or standard OpenAI). The method automatically selects the appropriate API based on provided credentials and includes retry logic for transient failures.

#### Parameters

| Name   | Type                    | Description                                                                 |
|--------|-------------------------|-----------------------------------------------------------------------------|
| prompt | string                  | The text prompt to generate the image from.                                 |
| type   | YpAiGenerateImageTypes  | The type of image to generate (`"logo"` or `"icon"`). Defaults to `"logo"`. |

#### Returns

- `Promise<string | undefined>`: The URL of the generated image, or `undefined` if generation failed after retries.

#### Behavior

- Selects Azure OpenAI if all Azure credentials are provided; otherwise, falls back to standard OpenAI.
- Sets image size based on the `type` parameter:
  - `"logo"`: `1792x1024`
  - `"icon"`: `1024x1024`
- Uses `"standard"` quality for image generation.
- Retries up to 3 times on failure, with increasing backoff between attempts.
- Returns the image URL if successful, or `undefined` if all attempts fail.

#### Example

```typescript
const generator = new DalleImageGenerator(
  process.env.AZURE_OPENAI_BASE,
  process.env.AZURE_OPENAI_KEY,
  process.env.AZURE_DALLE_DEPLOYMENT,
  process.env.OPENAI_KEY
);

const imageUrl = await generator.generateImageUrl("A futuristic city skyline", "logo");
console.log(imageUrl); // Prints the generated image URL or undefined
```

## Properties

| Name                 | Type     | Description                                                      |
|----------------------|----------|------------------------------------------------------------------|
| maxRetryCount        | number   | Maximum number of retries for image generation (default: 3).     |
| azureOpenaAiBase     | string \| undefined | Azure OpenAI endpoint base URL.                      |
| azureOpenAiApiKey    | string \| undefined | Azure OpenAI API key.                                 |
| azureDalleDeployment | string \| undefined | Azure DALL·E deployment name.                         |
| openAiKey            | string \| undefined | Standard OpenAI API key.                               |

---

## Implements

- [IImageGenerator](./iImageGenerator.md)

## Dependencies

- [`AzureOpenAI`, `OpenAI`](https://www.npmjs.com/package/openai): Used for interacting with Azure OpenAI and standard OpenAI APIs.
- [`YpAiGenerateImageTypes`](./iImageGenerator.md): Enum/type for specifying image generation types.

---

## Error Handling

- Logs warnings and errors to the console.
- Retries on failure with exponential backoff.
- Returns `undefined` if image generation fails after all retries.

---

## See Also

- [IImageGenerator interface](./iImageGenerator.md)
- [OpenAI API documentation](https://platform.openai.com/docs/api-reference/images)
- [Azure OpenAI Service documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/)

---

## Exported Classes

| Name                | Description                                      |
|---------------------|--------------------------------------------------|
| DalleImageGenerator | Image generator using DALL·E via OpenAI/Azure.   |