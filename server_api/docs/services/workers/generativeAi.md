# Service: GenerativeAiWorker

The `GenerativeAiWorker` class is responsible for processing generative AI work packages, specifically for generating collection images (icons or other types) using AI-powered generators. It interacts with image generation modules and updates job statuses in the database accordingly.

## Methods

| Name     | Parameters                                                                 | Return Type | Description                                                                                  |
|----------|----------------------------------------------------------------------------|-------------|----------------------------------------------------------------------------------------------|
| process  | workPackage: YpGenerativeAiWorkPackageData, callback: any                  | Promise<void> | Processes a generative AI work package, generates images, and updates job status in the DB.  |

---

## Method: process

Processes a generative AI work package. Depending on the `type` of the work package, it generates an image (icon or collection image) using the appropriate generator, updates the job record in the database, and invokes the callback with the result or error.

### Parameters

| Name         | Type                                 | Description                                                                                 |
|--------------|--------------------------------------|---------------------------------------------------------------------------------------------|
| workPackage  | YpGenerativeAiWorkPackageData        | The work package data specifying the type of image to generate and job information.          |
| callback     | any                                  | Callback function to be called after processing, with an error argument if any.              |

### Workflow

- Logs the incoming work package.
- Switches on `workPackage.type`:
  - If `"collection-image"`:
    - Chooses the generator based on `workPackage.imageType` (`AoiIconGenerator` for `"icon"`, otherwise `CollectionImageGenerator`).
    - Calls `createCollectionImage` on the generator with the work package.
    - If an image is generated (`imageId` exists):
      - Updates the background job with the new image data using `AcBackgroundJob.updateDataAsync`.
    - If image generation fails:
      - Updates the job with an error message using `AcBackgroundJob.update`.
    - Calls the callback (with or without error).
  - If an error occurs during processing:
    - Logs the error.
    - Updates the job with the error using `AcBackgroundJob.updateErrorAsync`.
    - Calls the callback with the error.
  - For unknown types:
    - Calls the callback with an error message.

### Example Usage

```typescript
const worker = new GenerativeAiWorker();
worker.process(workPackage, (err) => {
  if (err) {
    // handle error
  } else {
    // success
  }
});
```

---

## Dependencies

- [AoiIconGenerator](../engine/allOurIdeas/iconGenerator.js): Used for generating icon images.
- [CollectionImageGenerator](../llms/imageGeneration/collectionImageGenerator.js): Used for generating collection images.
- `models` (from `../../models/index.cjs`): Provides access to database models.
  - `Image`: Image model (type: `ImageClass`).
  - `AcBackgroundJob`: Background job model (type: `AcBackgroundJobClass`).

---

## Related Models

- **Image**: Represents image records in the database.
- **AcBackgroundJob**: Represents background job records, used for tracking the status and results of generative AI jobs.

---

## Work Package Data Structure

### YpGenerativeAiWorkPackageData

> **Note:** The exact structure is not defined in this file, but based on usage, it should include at least:

| Name      | Type     | Description                                      |
|-----------|----------|--------------------------------------------------|
| type      | string   | The type of work package (e.g., `"collection-image"`). |
| imageType | string   | The type of image to generate (e.g., `"icon"`).  |
| jobId     | string   | The ID of the background job to update.          |
| ...       | any      | Other fields required by the image generators.   |

---

## Error Handling

- If image generation fails, the job is updated with an error message.
- If an exception is thrown, the error is logged and the job is updated with the error details.
- If the work package type is unknown, the callback is called with an error message.

---

## Exported

- `GenerativeAiWorker` (class)

---

## See Also

- [AoiIconGenerator](../engine/allOurIdeas/iconGenerator.md)
- [CollectionImageGenerator](../llms/imageGeneration/collectionImageGenerator.md)
- [Image Model](../../models/index.cjs)
- [AcBackgroundJob Model](../../models/index.cjs)