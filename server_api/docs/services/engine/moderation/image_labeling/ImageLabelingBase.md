# Service: ImageLabelingBase

The `ImageLabelingBase` class provides a set of methods for automated image and video moderation using the Google Cloud Vision API. It is designed to review, label, and moderate images and videos by detecting labels and unsafe content, and to report content to moderators as needed. The class interacts with a data collection (typically a model instance) and supports both images and videos, including batch processing and reporting logic.

---

## Constructor

### `new ImageLabelingBase(workPackage: any)`

Initializes a new instance of the `ImageLabelingBase` class.

#### Parameters

| Name        | Type | Description                                  |
|-------------|------|----------------------------------------------|
| workPackage | any  | The work package context for moderation tasks.|

---

## Properties

| Name                          | Type                | Description                                                                                 |
|-------------------------------|---------------------|---------------------------------------------------------------------------------------------|
| workPackage                   | any                 | The work package context passed to the constructor.                                         |
| collection                    | any                 | The data collection/model instance to operate on.                                           |
| reportContent                 | boolean             | Indicates if content should be reported (without notification).                             |
| reportContentWithNotification | boolean             | Indicates if content should be reported with notification.                                  |
| visionClient                  | ImageAnnotatorClient| Google Cloud Vision API client instance.                                                    |
| visionRequesBase              | object              | Base request object for Vision API, specifying features for label and safe search detection. |

---

## Methods

### `reviewAndLabelUrl(imageUrl: string, mediaType: string, mediaId: string): Promise<{ imageLabels: object, imageReviews: object }>`

Downloads an image from a URL, analyzes it using the Google Vision API for labels and safe search, updates the collection with results, and evaluates moderation needs.

#### Parameters

| Name      | Type   | Description                                 |
|-----------|--------|---------------------------------------------|
| imageUrl  | string | The URL of the image to review.             |
| mediaType | string | The type of media ("Image" or "Video").     |
| mediaId   | string | The ID of the media item.                   |

#### Returns

A promise resolving to an object containing `imageLabels` and `imageReviews`.

---

### `reportImageToModerators(options: object): Promise<void>`

Reports the current collection's content to moderators, optionally disabling notifications.

#### Parameters

| Name    | Type   | Description                                 |
|---------|--------|---------------------------------------------|
| options | object | Options for reporting (e.g., disableNotification). |

#### Returns

A promise that resolves when reporting is complete.

---

### `hasImageIdBeenReviewed(imageId: string): boolean`

Checks if an image with the given ID has already been reviewed in the collection.

#### Parameters

| Name    | Type   | Description                                 |
|---------|--------|---------------------------------------------|
| imageId | string | The ID of the image to check.               |

#### Returns

`true` if the image has been reviewed, `false` otherwise.

---

### `reviewAndLabelImages(images: Array<{ id: string, formats: string }>): Promise<void>`

Reviews and labels a list of images, skipping those already reviewed.

#### Parameters

| Name   | Type   | Description                                  |
|--------|--------|----------------------------------------------|
| images | Array  | Array of image objects with `id` and `formats` properties. |

#### Returns

A promise that resolves when all images have been processed.

---

### `reviewAndLabelVideos(collectionModel: any, collectionId: string, collectionAssociation: string): Promise<void>`

Reviews and labels videos associated with a collection, analyzing up to three random images per video for moderation.

#### Parameters

| Name                 | Type   | Description                                  |
|----------------------|--------|----------------------------------------------|
| collectionModel      | any    | The model representing the collection.       |
| collectionId         | string | The ID of the collection.                    |
| collectionAssociation| string | The association name for the collection.     |

#### Returns

A promise that resolves when all videos have been processed.

---

### `evaluteImageReviews(imageReviews: object): Promise<void>`

Evaluates the results of image moderation and sets flags for reporting content.

#### Parameters

| Name         | Type   | Description                                  |
|--------------|--------|----------------------------------------------|
| imageReviews | object | The safe search annotation results from Vision API. |

#### Returns

A promise that resolves when evaluation is complete.

---

### `reportContentIfNeeded(): Promise<void>`

Reports content to moderators if the evaluation flags indicate it is necessary.

#### Returns

A promise that resolves when reporting is complete.

---

### `getCollection(): Promise<void>`

**Abstract/Stub.** Intended to be implemented in subclasses to fetch and set the `collection` property.

---

### `reviewImagesFromCollection(): Promise<void>`

**Abstract/Stub.** Intended to be implemented in subclasses to process images from the collection.

---

### `reviewAndLabelVisualMedia(): Promise<void>`

Main entry point for reviewing and labeling all visual media in the collection. Checks for credentials, fetches the collection, processes images, and reports content if needed.

#### Returns

A promise that resolves when the process is complete.

---

## Dependencies

- [@google-cloud/vision](https://www.npmjs.com/package/@google-cloud/vision): For image annotation.
- [download-file](https://www.npmjs.com/package/download-file): For downloading images.
- [fs](https://nodejs.org/api/fs.html): For file system operations.
- [models](../../../../models/index.cjs): For database/model access.
- [log](../../../utils/logger.cjs): For logging.

---

## Usage Example

```javascript
const ImageLabelingBase = require('./path/to/ImageLabelingBase');

class MyImageLabeler extends ImageLabelingBase {
  async getCollection() {
    // Implement logic to fetch and set this.collection
  }
  async reviewImagesFromCollection() {
    // Implement logic to process images from this.collection
  }
}

const labeler = new MyImageLabeler(workPackage);
await labeler.reviewAndLabelVisualMedia();
```

---

## Notes

- This class is intended to be subclassed, with `getCollection` and `reviewImagesFromCollection` implemented as needed.
- The class expects Google Cloud Vision credentials to be provided via the `GOOGLE_APPLICATION_CREDENTIALS_JSON` environment variable.
- The class is designed for use in moderation pipelines where images and videos need to be automatically reviewed for unsafe content.

---

## Export

This module exports the `ImageLabelingBase` class:

```javascript
module.exports = ImageLabelingBase;
```
