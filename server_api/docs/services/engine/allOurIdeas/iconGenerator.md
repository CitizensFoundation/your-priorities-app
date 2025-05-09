# Service: AoiIconGenerator

The `AoiIconGenerator` class is a service responsible for generating collection images and processing them into icon images (400x400 pixels), uploading them to S3, and updating the corresponding database record with the new icon URL. It extends the [`CollectionImageGenerator`](./collectionImageGenerator.md) class, leveraging its base image generation logic and adding icon-specific processing.

## Extends

- [`CollectionImageGenerator`](./collectionImageGenerator.md)

## Methods

### createCollectionImage

Generates a collection image, processes it into a 400x400 icon, uploads the icon to S3, and updates the database record with the new icon URL.

#### Parameters

| Name         | Type                              | Description                                                                 |
|--------------|-----------------------------------|-----------------------------------------------------------------------------|
| workPackage  | YpGenerativeAiWorkPackageData     | The work package data containing collection type, collection ID, and other relevant information for image generation. |

#### Returns

`Promise<{ imageId: number; imageUrl: string }>`  
An object containing the image ID and the public URL of the generated icon image.

#### Description

1. Calls the base `createCollectionImage` method to generate the initial image and record.
2. Downloads the generated image to a temporary location.
3. Resizes the image to 400x400 pixels.
4. Uploads the resized icon image to S3 under a new path.
5. Constructs a public URL for the icon image, using either a Cloudflare proxy domain or the S3 bucket URL.
6. Updates the corresponding database record's `formats` field with the new icon URL.
7. Returns the image ID and the new icon URL.

#### Example Usage

```typescript
const generator = new AoiIconGenerator(/* dependencies */);
const result = await generator.createCollectionImage(workPackage);
// result: { imageId: 123, imageUrl: "https://..." }
```

## Dependencies

- **imageProcessorService**: Used for downloading and resizing images.
  - `downloadImage(url: string, destPath: string, axiosInstance: any): Promise<void>`
  - `resizeImage(srcPath: string, width: number, height: number): Promise<string>`
- **s3Service**: Used for uploading images to S3.
  - `uploadImageToS3(bucket: string, filePath: string, s3Path: string): Promise<void>`
- **Image (Model)**: Sequelize model for image records in the database.
  - `findOne({ where: { id } })`
  - `save()`

## Environment Variables

| Name                              | Description                                                                 |
|------------------------------------|-----------------------------------------------------------------------------|
| S3_BUCKET                         | Name of the S3 bucket where images are stored.                              |
| CLOUDFLARE_IMAGE_PROXY_DOMAIN      | (Optional) Domain for Cloudflare image proxy. If set, used for public URLs. |

## Related Models

- **Image**: The Sequelize model representing image records. See [Image Model](../../../models/index.cjs).

## Related Services

- [`CollectionImageGenerator`](./collectionImageGenerator.md): The base class for collection image generation.

---

## Configuration

- **Temporary File Path**: Images are downloaded to `/tmp` with a UUID-based filename.
- **S3 Path Structure**: `ypGenAi/{collectionType}/{collectionId}/{uuid}-icon.png`

---

## Exported Class

| Name              | Type     | Description                                      |
|-------------------|----------|--------------------------------------------------|
| AoiIconGenerator  | class    | Service for generating and processing icon images.|

---

## Example

```typescript
import { AoiIconGenerator } from './AoiIconGenerator';

const generator = new AoiIconGenerator(/* dependencies */);
const result = await generator.createCollectionImage(workPackage);
console.log(result.imageId, result.imageUrl);
```

---

## See Also

- [CollectionImageGenerator](./collectionImageGenerator.md)
- [Image Model](../../../models/index.cjs)
- [uuid](https://www.npmjs.com/package/uuid)
- [axios](https://www.npmjs.com/package/axios)
- [fs (Node.js)](https://nodejs.org/api/fs.html)
- [path (Node.js)](https://nodejs.org/api/path.html)