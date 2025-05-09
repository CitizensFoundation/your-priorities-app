# Service: ImageProcessorService

The `ImageProcessorService` is a utility service for handling image processing tasks, including downloading images from URLs and resizing images to specified dimensions. It leverages the [sharp](https://sharp.pixelplumbing.com/) library for image manipulation and supports a range of common image formats.

## Methods

| Name            | Parameters                                                                 | Return Type         | Description                                                                                 |
|-----------------|----------------------------------------------------------------------------|---------------------|---------------------------------------------------------------------------------------------|
| downloadImage   | imageUrl: `string`, imageFilePath: `string`, axiosInstance: `any`          | `Promise<void>`     | Downloads an image from a given URL and saves it to the specified file path.                |
| resizeImage     | imagePath: `string`, width: `number`, height: `number`                     | `Promise<string>`   | Resizes an image to the given dimensions, saves as PNG, and returns the new file path.      |

---

## Method: downloadImage

Downloads an image from a given URL and saves it to the specified file path using a provided Axios instance.

### Parameters

| Name           | Type     | Description                                                                 |
|----------------|----------|-----------------------------------------------------------------------------|
| imageUrl       | string   | The URL of the image to download.                                           |
| imageFilePath  | string   | The local file path where the image will be saved.                          |
| axiosInstance  | any      | An Axios instance to perform the HTTP request.                              |

### Returns

- `Promise<void>`: Resolves when the image has been successfully downloaded and saved.

### Example

```typescript
await imageProcessorService.downloadImage(
  "https://example.com/image.jpg",
  "/tmp/image.jpg",
  axios
);
```

---

## Method: resizeImage

Resizes an image to the specified width and height, maintaining aspect ratio and preventing enlargement. The resized image is saved as a PNG in `/tmp` with a unique filename. The original image file is deleted after processing.

### Parameters

| Name      | Type     | Description                                                                 |
|-----------|----------|-----------------------------------------------------------------------------|
| imagePath | string   | The path to the image file to be resized.                                   |
| width     | number   | The target width in pixels.                                                 |
| height    | number   | The target height in pixels.                                                |

### Returns

- `Promise<string>`: Resolves with the file path of the resized image.

### Behavior

- Only processes images in supported formats: `jpeg`, `png`, `webp`, `gif`, `tiff`, `avif`, `svg`.
- Uses EXIF orientation data to auto-rotate images.
- Resized image is saved as a PNG with 90% quality and progressive encoding.
- The original image file is deleted after resizing.
- If an error occurs, any partially written resized image is deleted.

### Example

```typescript
const resizedPath = await imageProcessorService.resizeImage(
  "/tmp/original.jpg",
  800,
  600
);
// resizedPath is the path to the new PNG file in /tmp
```

---

## Exported Constants

### validFormats

- **Type:** `string[]`
- **Description:** List of supported image formats for processing.
- **Values:** `["jpeg", "png", "webp", "gif", "tiff", "avif", "svg"]`

---

## Usage Example

```typescript
import { ImageProcessorService } from "./ImageProcessorService";
import axios from "axios";

const imageService = new ImageProcessorService();

async function processImage() {
  const url = "https://example.com/image.jpg";
  const downloadPath = "/tmp/image.jpg";
  await imageService.downloadImage(url, downloadPath, axios);

  const resizedPath = await imageService.resizeImage(downloadPath, 400, 300);
  console.log("Resized image saved at:", resizedPath);
}
```

---

## Dependencies

- [sharp](https://sharp.pixelplumbing.com/) for image processing.
- [uuid](https://www.npmjs.com/package/uuid) for generating unique file names.
- [fs](https://nodejs.org/api/fs.html) and [path](https://nodejs.org/api/path.html) for file system operations.
- An Axios instance for HTTP requests.

---

## Error Handling

- Throws an error if the image format is not supported.
- Cleans up any partially written files if an error occurs during resizing.
- Logs errors to the console.

---

## See Also

- [sharp documentation](https://sharp.pixelplumbing.com/)
- [Axios documentation](https://axios-http.com/)