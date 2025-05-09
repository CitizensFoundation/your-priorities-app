# Service: ImagenImageGenerator

The `ImagenImageGenerator` class provides an implementation of the [`IImageGenerator`](./iImageGenerator.md) interface for generating images using Google Vertex AI's Imagen model. It handles the process of sending a text prompt to the Imagen API, retrieving the generated image, saving it temporarily, uploading it to an S3 bucket, and returning a public URL to the image. The service includes retry logic and supports optional Cloudflare proxying for image URLs.

## Constructor

```typescript
constructor(s3Service: S3Service)
```
- **s3Service** (`S3Service`): An instance of the S3 service used to upload generated images to an S3 bucket.

### Environment Variables

- `GOOGLE_CLOUD_PROJECT_ID` (string, required): Google Cloud project ID for Vertex AI.
- `GOOGLE_CLOUD_IMAGEN_LOCATION` (string, optional, default: `"us-east1"`): Vertex AI location/region.
- `S3_BUCKET` (string, required): Name of the S3 bucket to upload images.
- `CLOUDFLARE_IMAGE_PROXY_DOMAIN` (string, optional): If set, image URLs will be proxied through this domain.

## Methods

### generateImageUrl

```typescript
async generateImageUrl(
  prompt: string,
  type: YpAiGenerateImageTypes = "logo"
): Promise<string | undefined>
```

Generates an image from a text prompt using Vertex AI Imagen and returns a public S3 URL to the uploaded image.

#### Parameters

| Name   | Type                    | Description                                      | Required |
|--------|-------------------------|--------------------------------------------------|----------|
| prompt | `string`                | The text prompt describing the desired image.    | Yes      |
| type   | `YpAiGenerateImageTypes`| The type of image to generate (default: "logo"). | No       |

#### Returns

- `Promise<string | undefined>`: The public URL of the generated image, or `undefined` if generation failed after retries.

#### Description

1. **Prompt Preparation**: Prepares the prompt and parameters for the Imagen model.
2. **API Request**: Sends a prediction request to the Vertex AI Imagen endpoint.
3. **Image Extraction**: Extracts the base64-encoded image from the response.
4. **Temporary File Handling**: Decodes and writes the image to a temporary file.
5. **S3 Upload**: Uploads the image to the configured S3 bucket using the provided [`S3Service`](./s3Service.md).
6. **URL Construction**: Returns a public URL to the image, optionally using a Cloudflare proxy if configured.
7. **Retry Logic**: Retries up to 3 times on failure, with increasing backoff.

#### Example Usage

```typescript
const s3Service = new S3Service();
const generator = new ImagenImageGenerator(s3Service);

const imageUrl = await generator.generateImageUrl("A futuristic city skyline at sunset");
console.log(imageUrl); // e.g., https://my-bucket.s3.amazonaws.com/imagenAi/uuid.png
```

#### Error Handling

- Logs warnings and errors to the console.
- Retries up to 3 times if image generation fails.
- Returns `undefined` if all retries fail.

## Properties

| Name         | Type     | Description                                                                 |
|--------------|----------|-----------------------------------------------------------------------------|
| maxRetryCount| `number` | Maximum number of retries for image generation (default: 3).                |
| projectId    | `string` | Google Cloud project ID (from env).                                         |
| location     | `string` | Vertex AI location/region (from env or default `"us-east1"`).               |
| endpoint     | `string` | Full Vertex AI Imagen endpoint for the configured project and location.      |
| s3Bucket     | `string` | S3 bucket name for image uploads (from env).                                |
| s3Service    | `S3Service` | Instance of the S3 service for uploading images.                         |

## Dependencies

- [`IImageGenerator`](./iImageGenerator.md): Interface implemented by this class.
- [`S3Service`](./s3Service.md): Used for uploading images to S3.
- `@google-cloud/aiplatform`: Used for interacting with Vertex AI.
- `uuid`: For generating unique filenames.
- `fs`, `path`: For temporary file handling.

---

## See Also

- [IImageGenerator](./iImageGenerator.md)
- [S3Service](./s3Service.md)
- [Google Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/overview)
- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts) (if relevant for agent-based image generation workflows)

---

**Note:** This service is intended for backend use only and requires proper configuration of Google Cloud and AWS credentials.