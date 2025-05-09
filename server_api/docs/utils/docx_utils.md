# Service Module: exportGroupToDocx.cjs

This module provides functionality to export group data, posts, and related metadata from the "Your Priorities" platform into a styled DOCX document. It supports translation of group and post content, structured question/answer formatting, and includes media, ratings, and other post metadata. The main export is the `exportGroupToDocx` function, which orchestrates the export process.

---

## Exported Functions

| Name                | Parameters                                                                                 | Return Type | Description                                                                                 |
|---------------------|--------------------------------------------------------------------------------------------|-------------|---------------------------------------------------------------------------------------------|
| exportGroupToDocx   | group: object, hostName: string, targetLanguage: string \| null, callback: Function        | void        | Exports a group's posts and metadata to a DOCX file, invoking the callback with the result. |

---

## Function: exportGroupToDocx

Exports a group's posts and metadata to a DOCX file, optionally translating content to a target language. The resulting DOCX is returned as a Buffer via the callback.

### Parameters

| Name           | Type    | Description                                                                                  |
|----------------|---------|----------------------------------------------------------------------------------------------|
| group          | object  | The group object, including configuration and metadata.                                      |
| hostName       | string  | The hostname to use for generating post URLs.                                                |
| targetLanguage | string \| null | The target language code for translation (e.g., 'en', 'is'). If null, no translation. |
| callback       | Function| Callback function with signature `(error: any, result: Buffer)`.                             |

### Usage Example

```javascript
const { exportGroupToDocx } = require('./exportGroupToDocx.cjs');

exportGroupToDocx(group, 'yourdomain.com', 'en', (err, buffer) => {
  if (err) {
    // handle error
  } else {
    // buffer contains the DOCX file
  }
});
```

---

## Internal Utility Functions

### getMediaFormatUrl

Returns the URL for a specific media format.

| Name     | Type   | Description                |
|----------|--------|----------------------------|
| media    | object | Media object with formats. |
| formatId | number | Index of the format.       |

**Returns:** `string` — The URL of the media format, or an empty string.

---

### getMediaURLs

Aggregates all media URLs (videos and audios) from a post and its points.

| Name | Type   | Description         |
|------|--------|---------------------|
| post | object | The post object.    |

**Returns:** `string` — Newline-separated media URLs.

---

### getPointsUpOrDown

Filters points from a post by their value (positive or negative).

| Name  | Type    | Description                       |
|-------|---------|-----------------------------------|
| post  | object  | The post object.                  |
| value | number  | 1 for up points, -1 for down.     |

**Returns:** `Array<{content: string, id: number}>` — Array of point objects.

---

### getPointsUp

Returns all "up" points (value > 0) from a post.

| Name | Type   | Description      |
|------|--------|------------------|
| post | object | The post object. |

**Returns:** `Array<{content: string, id: number}>`

---

### getPointsDown

Returns all "down" points (value < 0) from a post.

| Name | Type   | Description      |
|------|--------|------------------|
| post | object | The post object. |

**Returns:** `Array<{content: string, id: number}>`

---

### createDocWithStyles

Creates a new DOCX `Document` with custom styles for headings, paragraphs, etc.

| Name  | Type   | Description         |
|-------|--------|---------------------|
| title | string | The document title. |

**Returns:** `Document` (from [docx](https://www.npmjs.com/package/docx))

---

### setDescriptions

Adds structured or plain descriptions to a DOCX section, based on group configuration.

| Name      | Type   | Description                                 |
|-----------|--------|---------------------------------------------|
| group     | object | The group object.                           |
| post      | object | The original post object.                   |
| builtPost | object | The processed post object.                  |
| children  | array  | Array to which Paragraphs are pushed.       |

---

### getImageFormatUrl

Returns the URL for a specific image format.

| Name     | Type   | Description                |
|----------|--------|----------------------------|
| image    | object | Image object with formats. |
| formatId | number | Index of the format.       |

**Returns:** `string` — The URL of the image format, or an empty string.

---

### getImages

Aggregates all image URLs from a post.

| Name | Type   | Description      |
|------|--------|------------------|
| post | object | The post object. |

**Returns:** `string` — Newline-separated image URLs.

---

### addPointTranslationIfNeeded

Adds a translated or original point content as a paragraph to the DOCX section.

| Name  | Type   | Description                        |
|-------|--------|------------------------------------|
| post  | object | The post object.                   |
| point | object | The point object.                  |
| children | array | Array to which Paragraphs are pushed. |

---

### addPostToDoc

Adds a post and its metadata as a section to the DOCX document.

| Name  | Type     | Description                |
|-------|----------|----------------------------|
| doc   | Document | The DOCX document object.  |
| post  | object   | The processed post object. |
| group | object   | The group object.          |

---

### setupGroup

Adds group metadata and ratings headers as a section to the DOCX document.

| Name          | Type     | Description                |
|---------------|----------|----------------------------|
| doc           | Document | The DOCX document object.  |
| group         | object   | The group object.          |
| ratingsHeaders| string   | Ratings headers string.    |
| title         | string   | The document title.        |

---

### getOrderedPosts

Orders posts by the difference between up and down endorsements, descending.

| Name  | Type   | Description      |
|-------|--------|------------------|
| posts | array  | Array of posts.  |

**Returns:** `array` — Ordered array of posts.

---

### exportToDocx

Orchestrates the DOCX export process, adding group and post sections, and invokes the callback with the resulting Buffer.

| Name         | Type    | Description                                      |
|--------------|---------|--------------------------------------------------|
| group        | object  | The group object.                                |
| posts        | array   | Array of processed post objects.                 |
| customRatings| any     | Custom ratings configuration.                    |
| categories   | array   | Array of category names.                         |
| callback     | Function| Callback with signature `(error, Buffer)`.       |

---

### getTranslation

Fetches a translation for a given model, text type, and target language using the AcTranslationCache model.

| Name           | Type   | Description                                 |
|----------------|--------|---------------------------------------------|
| model          | object | The model instance to translate.            |
| textType       | string | The type of text (e.g., 'groupName').       |
| targetLanguage | string | The target language code.                   |

**Returns:** `Promise<string \| null>` — The translated content or null.

---

### getTranslatedPoints

Fetches translations for an array of points in the target language.

| Name           | Type   | Description                                 |
|----------------|--------|---------------------------------------------|
| points         | array  | Array of point objects.                     |
| targetLanguage | string | The target language code.                   |

**Returns:** `Promise<object>` — Object mapping point IDs to translated content.

---

## Dependencies

- [docx](https://www.npmjs.com/package/docx): For DOCX document creation.
- [lodash](https://lodash.com/): For data manipulation.
- [async](https://caolan.github.io/async/): For asynchronous control flow.
- [moment](https://momentjs.com/): For date/time formatting (not directly used in this file).
- [logger.cjs](./logger.cjs): For logging warnings.
- [../models/index.cjs](../models/index.cjs): For database models, especially `AcTranslationCache`.
- [./export_utils.cjs](./export_utils.cjs): For various utility functions (e.g., `getGroupPosts`, `getRatingHeaders`, etc.).

---

## Related Utility Functions (from [export_utils.cjs](./export_utils.md))

- `getGroupPosts`
- `getRatingHeaders`
- `getContactData`
- `getAttachmentData`
- `getMediaTranscripts`
- `getPostRatings`
- `getPostUrl`
- `getLocation`
- `getCategory`
- `getUserEmail`
- `clean`

See [export_utils.cjs documentation](./export_utils.md) for details.

---

## Example Usage

```javascript
const { exportGroupToDocx } = require('./exportGroupToDocx.cjs');

const group = /* group object */;
const hostName = 'yourdomain.com';
const targetLanguage = 'en';

exportGroupToDocx(group, hostName, targetLanguage, (err, buffer) => {
  if (err) {
    console.error('Export failed:', err);
  } else {
    // buffer is a DOCX file, ready to be saved or sent
    require('fs').writeFileSync('group_export.docx', buffer);
  }
});
```

---

## Notes

- The exported DOCX includes group metadata, post content, points (for/against), media, images, ratings, and more.
- If `targetLanguage` is provided, group and post content will be machine-translated using the translation cache.
- The module is designed for use in the "Your Priorities" platform and expects data structures from that context.

---

## See Also

- [export_utils.cjs](./export_utils.md)
- [logger.cjs](./logger.md)
- [../models/index.cjs](../models/index.md)
- [docx documentation](https://www.npmjs.com/package/docx)
