# Utility Module: Background Job Utilities

This module provides utility functions for managing background job statuses, error handling, file downloads, and S3 uploads, primarily for use in asynchronous job processing and reporting workflows. It interacts with the `AcBackgroundJob` model and AWS S3, and supports Excel file handling.

---

## Exported Functions

### updateUploadJobStatus

Updates the progress status (and optionally, data) of a background job in the database. Progress is capped at 100 and calculated to reflect upload progress.

#### Parameters

| Name           | Type                | Description                                               |
|----------------|---------------------|-----------------------------------------------------------|
| jobId          | number              | The ID of the background job to update.                   |
| uploadProgress | number              | The current upload progress (0-100).                      |
| data           | object \| undefined | Optional. Additional data to store with the job.          |

#### Returns

`Promise<void>`

#### Example

```typescript
await updateUploadJobStatus(123, 75, { file: "report.xlsx" });
```

---

### setJobError

Sets an error message and resets progress for a background job. Logs the error details to the console.

#### Parameters

| Name         | Type        | Description                                      |
|--------------|-------------|--------------------------------------------------|
| jobId        | number      | The ID of the background job to update.          |
| errorToUser  | string      | The error message to display to the user.        |
| errorDetail  | Error \| undefined | Optional. Detailed error object for logging. |

#### Returns

`Promise<void>`

#### Example

```typescript
await setJobError(123, "Failed to process file", new Error("File not found"));
```

---

### downloadImage

Downloads an image from a given URI and saves it to a local file.

#### Parameters

| Name     | Type   | Description                        |
|----------|--------|------------------------------------|
| uri      | string | The URI of the image to download.  |
| filename | string | The local filename to save to.     |

#### Returns

`Promise<void>`

#### Example

```typescript
await downloadImage("https://example.com/image.png", "localfile.png");
```

---

### uploadToS3

Uploads a file (typically an Excel buffer) to AWS S3, updates job progress, and returns a signed download URL via a callback.

#### Parameters

| Name       | Type                                              | Description                                                                                 |
|------------|---------------------------------------------------|---------------------------------------------------------------------------------------------|
| jobId      | number                                            | The ID of the background job for progress updates.                                          |
| userId     | string                                            | The user ID (used in the S3 key path).                                                     |
| filename   | string                                            | The filename to use in S3.                                                                  |
| exportType | string                                            | The export type (used in the S3 key path).                                                 |
| data       | ExcelJS.Buffer                                    | The file data to upload (ExcelJS buffer).                                                  |
| done       | (error: Error \| null, url?: string) => void      | Callback invoked with error or the signed S3 URL on success.                               |

#### Returns

`void` (asynchronous via callback)

#### Example

```typescript
uploadToS3(
  123,
  "user-456",
  "report.xlsx",
  "exports",
  excelBuffer,
  (err, url) => {
    if (err) {
      console.error("Upload failed", err);
    } else {
      console.log("File available at", url);
    }
  }
);
```

---

## Internal/Private Constants

### pipeline

A promisified version of `stream.pipeline` for use with async/await.

---

## Dependencies

- [lodash](https://lodash.com/)
- [moment](https://momentjs.com/)
- [aws-sdk](https://www.npmjs.com/package/aws-sdk)
- [node-fetch](https://www.npmjs.com/package/node-fetch)
- [fs](https://nodejs.org/api/fs.html)
- [stream](https://nodejs.org/api/stream.html)
- [util.promisify](https://nodejs.org/api/util.html#util_util_promisify_original)
- [ExcelJS](https://github.com/exceljs/exceljs)
- [AcBackgroundJob](../../../models/index.cjs) (Sequelize model)

---

## Related Models

- [AcBackgroundJob](../../../models/index.cjs)  
  Sequelize model for background job tracking.  
  **Properties** (typical):
  | Name     | Type   | Description                  |
  |----------|--------|------------------------------|
  | id       | number | Job ID                       |
  | progress | number | Progress percentage (0-100)  |
  | data     | object | Arbitrary job data           |
  | error    | string | Error message (if any)       |

---

## Environment Variables

- `AWS_SECRET_ACCESS_KEY` — AWS credentials for S3.
- `AWS_ACCESS_KEY_ID` — AWS credentials for S3.
- `S3_ENDPOINT` — Optional custom S3 endpoint.
- `S3_REGION` — AWS region for S3.
- `S3_ACCELERATED_ENDPOINT` — Optional S3 accelerated endpoint.
- `S3_REPORTS_BUCKET` — S3 bucket name for report uploads.

---

## Usage Example

```typescript
import {
  updateUploadJobStatus,
  setJobError,
  downloadImage,
  uploadToS3
} from "./backgroundJobUtils";

// Update job progress
await updateUploadJobStatus(1, 80);

// Set job error
await setJobError(1, "Upload failed", new Error("Network error"));

// Download an image
await downloadImage("https://example.com/image.jpg", "local.jpg");

// Upload a file to S3
uploadToS3(
  1,
  "user-123",
  "report.xlsx",
  "exports",
  excelBuffer,
  (err, url) => {
    if (err) {
      // handle error
    } else {
      // use signed URL
    }
  }
);
```

---

## See Also

- [AcBackgroundJob Model](../../../models/index.cjs)
- [ExcelJS Documentation](https://github.com/exceljs/exceljs)
- [AWS S3 SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html)
