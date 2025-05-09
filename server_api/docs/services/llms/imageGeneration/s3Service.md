# Service: S3Service

The `S3Service` class provides methods for interacting with AWS S3 for image upload and deletion, as well as optional Cloudflare cache purging. It is designed to handle image file uploads to S3, remove images (by making them private), and clear CDN caches when necessary. It also includes utility methods for parsing S3 URLs and batch-deleting multiple image formats.

---

## Constructor

```typescript
constructor(cloudflareApiKey?: string, cloudflareZoneId?: string)
```

- **cloudflareApiKey** (`string`, optional): Cloudflare API key for cache purging.
- **cloudflareZoneId** (`string`, optional): Cloudflare Zone ID for cache purging.

---

## Methods

### uploadImageToS3

Uploads an image file to an S3 bucket and deletes the local file after upload.

```typescript
async uploadImageToS3(bucket: string, filePath: string, key: string): Promise<any>
```

#### Parameters

| Name      | Type   | Description                                 |
|-----------|--------|---------------------------------------------|
| bucket    | string | The name of the S3 bucket.                  |
| filePath  | string | Local file path to the image to upload.     |
| key       | string | The S3 object key (path in the bucket).     |

#### Returns

- `Promise<any>`: Resolves with the S3 upload response data.

#### Description

- Reads the file from the local filesystem.
- Uploads it to the specified S3 bucket with public-read access, `image/png` content type, and inline disposition.
- Deletes the local file after successful upload.

---

### deleteS3Url

Makes an S3 object private (effectively "deleting" it from public access) and optionally purges the corresponding Cloudflare cache.

```typescript
async deleteS3Url(imageUrl: string): Promise<any>
```

#### Parameters

| Name      | Type   | Description                                 |
|-----------|--------|---------------------------------------------|
| imageUrl  | string | The full S3 image URL to "delete".          |

#### Returns

- `Promise<any>`: Resolves with the S3 response data.

#### Description

- Parses the S3 bucket and key from the image URL.
- Sets the object's ACL to `private` in S3.
- If Cloudflare credentials are provided, purges the cache for the image URL.
- Handles and logs errors for both S3 and Cloudflare operations.

---

### parseImageUrl

Parses an S3 image URL (or a Cloudflare image proxy URL) to extract the bucket and key.

```typescript
parseImageUrl(imageUrl: string): { bucket?: string, key?: string }
```

#### Parameters

| Name      | Type   | Description                                 |
|-----------|--------|---------------------------------------------|
| imageUrl  | string | The image URL to parse.                     |

#### Returns

- `{ bucket?: string, key?: string }`: The parsed bucket and key, or undefined if parsing fails.

#### Description

- Supports both direct S3 URLs and Cloudflare image proxy URLs.
- Uses environment variables `CLOUDFLARE_IMAGE_PROXY_DOMAIN` and `S3_BUCKET` for proxy URL parsing.

---

### deleteMediaFormatsUrls

Deletes (makes private) multiple S3 image URLs, one by one.

```typescript
async deleteMediaFormatsUrls(formats: string[]): Promise<void>
```

#### Parameters

| Name      | Type     | Description                                 |
|-----------|----------|---------------------------------------------|
| formats   | string[] | Array of image URLs to delete.              |

#### Returns

- `Promise<void>`

#### Description

- Iterates over the array of URLs and calls `deleteS3Url` for each.
- Logs each deletion.

---

## Example Usage

```typescript
import { S3Service } from './S3Service';

const s3Service = new S3Service(process.env.CLOUDFLARE_API_KEY, process.env.CLOUDFLARE_ZONE_ID);

// Upload an image
await s3Service.uploadImageToS3('my-bucket', '/tmp/image.png', 'uploads/image.png');

// Delete an image and purge Cloudflare cache
await s3Service.deleteS3Url('https://my-bucket.s3.amazonaws.com/uploads/image.png');

// Delete multiple image formats
await s3Service.deleteMediaFormatsUrls([
  'https://my-bucket.s3.amazonaws.com/uploads/image1.png',
  'https://my-bucket.s3.amazonaws.com/uploads/image2.png'
]);
```

---

## Dependencies

- [aws-sdk](https://www.npmjs.com/package/aws-sdk): For S3 operations.
- [fs](https://nodejs.org/api/fs.html): For file system operations.
- [axios](https://www.npmjs.com/package/axios): For HTTP requests to Cloudflare API.

---

## Environment Variables

- `CLOUDFLARE_IMAGE_PROXY_DOMAIN`: Used for parsing Cloudflare image proxy URLs.
- `S3_BUCKET`: Used as the default bucket when parsing proxy URLs.

---

## Exported

- `S3Service` (class): Main service for S3 and Cloudflare image management.

---

## See Also

- [AWS S3 Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html)
- [Cloudflare Cache Purge API](https://api.cloudflare.com/#zone-purge-all-files)
