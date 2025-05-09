# Service: CollectionImageGenerator

The `CollectionImageGenerator` class is a service responsible for orchestrating the generation of collection images using various AI image generators (Flux, DALL·E, Imagen, or ChatGPT), downloading the generated image, uploading it to S3, and saving a record in the database. It abstracts the complexity of choosing the appropriate image generator and handling the full image lifecycle from generation to storage.

---

## Constructor

### `new CollectionImageGenerator()`

Initializes the service and its dependencies, including S3, image processing, and available image generators. The choice of generator is determined by environment variables and feature flags.

#### Dependencies

- [S3Service](./s3Service.md)
- [ImageProcessorService](./imageProcessorService.md)
- [FluxImageGenerator](./fluxImageGenerator.md) (optional)
- [DalleImageGenerator](./dalleImageGenerator.md)
- [ImagenImageGenerator](./imagenImageGenerator.md) (optional)
- [ChatGptImageGenerator](./chatGptImageGenerator.md)

#### Environment Variables Used

| Name                                 | Description                                               |
|-------------------------------------- |----------------------------------------------------------|
| CLOUDFLARE_API_KEY                   | Cloudflare API key for S3Service                         |
| CLOUDFLARE_ZONE_ID                   | Cloudflare zone ID for S3Service                         |
| REPLICATE_API_TOKEN                  | API token for FluxImageGenerator                         |
| FLUX_PRO_MODEL_NAME                   | Model name for FluxImageGenerator                        |
| AZURE_OPENAI_API_BASE                | Azure OpenAI API base URL for DalleImageGenerator        |
| AZURE_OPENAI_API_KEY                 | Azure OpenAI API key for DalleImageGenerator             |
| AZURE_OPENAI_API_DALLE_DEPLOYMENT_NAME| DALL·E deployment name for DalleImageGenerator           |
| OPENAI_API_KEY                       | OpenAI API key for DalleImageGenerator/ChatGptImageGenerator |
| GOOGLE_CLOUD_PROJECT_ID              | Google Cloud project ID for ImagenImageGenerator         |
| S3_BUCKET                            | S3 bucket name for image storage                         |
| CLOUDFLARE_IMAGE_PROXY_DOMAIN        | Optional Cloudflare proxy domain for public image URLs    |
| USE_CHATGPT_IMAGE_GENERATOR          | If set, uses ChatGptImageGenerator                      |

---

## Methods

### `createCollectionImage(workPackage: YpGenerativeAiWorkPackageData): Promise<{ imageId: number; imageUrl: string }>`

Orchestrates the process of generating an image for a collection, downloading it, uploading it to S3, and saving a record in the database.

#### Parameters

| Name         | Type                              | Description                                                                 |
|--------------|-----------------------------------|-----------------------------------------------------------------------------|
| workPackage  | YpGenerativeAiWorkPackageData     | Data describing the image generation request, including prompt, user, etc.  |

#### Returns

- `Promise<{ imageId: number; imageUrl: string }>`  
  Resolves with the new image's database ID and its public URL.

#### Workflow

1. **Selects the image generator** based on available services and environment flags.
2. **Generates the image** using the selected generator.
3. **Downloads the image** to a temporary file (unless using Imagen, which may provide a direct URL).
4. **Uploads the image** to S3 storage.
5. **Constructs a public URL** for the image, optionally using a Cloudflare proxy.
6. **Saves a record** in the database for the generated image.
7. **Returns** the image's database ID and public URL.

#### Throws

- Rejects the promise with an error if any step fails (e.g., image generation, download, upload, or DB save).

#### Example Usage

```typescript
const generator = new CollectionImageGenerator();
const result = await generator.createCollectionImage({
  prompt: "A futuristic cityscape at sunset",
  imageType: "art",
  collectionType: "gallery",
  collectionId: 42,
  userId: 7,
});
console.log(result.imageId, result.imageUrl);
```

---

## Dependencies

- [IImageGenerator, YpAiGenerateImageTypes](./iImageGenerator.md)
- [FluxImageGenerator](./fluxImageGenerator.md)
- [DalleImageGenerator](./dalleImageGenerator.md)
- [ImagenImageGenerator](./imagenImageGenerator.md)
- [ChatGptImageGenerator](./chatGptImageGenerator.md)
- [ImageProcessorService](./imageProcessorService.md)
- [S3Service](./s3Service.md)
- `models.Image` (Sequelize or similar ORM model for image records)
- `models.AcBackgroundJob` (not directly used in this file)

---

## Configuration

### Feature Flags

| Constant      | Type    | Description                                      |
|---------------|---------|--------------------------------------------------|
| disableFlux   | boolean | If true, disables Flux image generator           |
| useImagen     | boolean | If true, enables Imagen image generator          |

---

## Related Models

### Image

Represents the image record in the database.  
See the model definition in your codebase for full schema.

| Property           | Type    | Description                        |
|--------------------|---------|------------------------------------|
| id                 | number  | Primary key                        |
| user_id            | number  | ID of the user who owns the image  |
| s3_bucket_name     | string  | S3 bucket where the image is stored|
| original_filename  | string  | Original filename (set to "n/a")   |
| formats            | string  | JSON string of image URLs          |
| user_agent         | string  | User agent string ("AI worker")    |
| ip_address         | string  | IP address ("127.0.0.1")           |

---

## See Also

- [IImageGenerator](./iImageGenerator.md)
- [FluxImageGenerator](./fluxImageGenerator.md)
- [DalleImageGenerator](./dalleImageGenerator.md)
- [ImagenImageGenerator](./imagenImageGenerator.md)
- [ChatGptImageGenerator](./chatGptImageGenerator.md)
- [ImageProcessorService](./imageProcessorService.md)
- [S3Service](./s3Service.md)
- [Image Model](../../../models/index.cjs)
