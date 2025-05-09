# Utility Module: exportUtils

This module provides a comprehensive set of utility functions for exporting group, post, and user data, as well as handling file uploads to AWS S3, image downloads, translation utilities, and data formatting for CSV exports. It is designed for use in background jobs and export endpoints in a Node.js/Express.js application, particularly for the Policy Synth platform.

---

## Exported Functions

| Name                           | Parameters                                                                 | Return Type | Description                                                                                 |
|---------------------------------|----------------------------------------------------------------------------|-------------|---------------------------------------------------------------------------------------------|
| getExportFileDataForGroup       | group: object, hostName: string, callback: Function                        | void        | Generates CSV export data for all posts in a group.                                         |
| getLoginsExportDataForCommunity | communityId: number, hostName: string, callback: Function                  | void        | Generates CSV export data for user logins in a community.                                   |
| getLoginsExportDataForDomain    | domainId: number, hostName: string, callback: Function                     | void        | Generates CSV export data for user logins in a domain.                                      |
| getGroupPosts                   | group: object, hostName: string, callback: Function                        | void        | Retrieves all posts for a group, including related models.                                  |
| getUsersForCommunity            | communityId: number, callback: Function                                    | void        | Generates CSV export data for all users in a community.                                     |
| getDescriptionHeaders           | group: object                                                              | string      | Returns CSV header columns for post descriptions, supporting structured questions.           |
| getPostUrl                      | post: object, hostname?: string                                            | string      | Returns the URL for a post, using the provided hostname or a default.                       |
| getCategory                     | post: object                                                               | string      | Returns the category name for a post.                                                       |
| getImages                       | post: object                                                               | string      | Returns a string of image URLs for a post.                                                  |
| clean                           | text: string                                                               | string      | Cleans and formats a string for CSV output.                                                 |
| getDescriptionColumns           | group: object, post: object                                                | string      | Returns CSV columns for post descriptions, supporting structured questions.                  |
| getPointsDown                   | post: object                                                               | Array       | Returns an array of "down" points for a post.                                               |
| getPointsUp                     | post: object                                                               | Array       | Returns an array of "up" points for a post.                                                 |
| getUserEmail                    | post: object                                                               | string      | Returns the email of the post's user, or "hidden" if skipEmail is true.                     |
| getRatingHeaders                | customRatings: Array                                                       | string      | Returns CSV header columns for custom ratings.                                              |
| getContactData                  | post: object                                                               | string      | Returns CSV columns for contact data from a post.                                           |
| getLocation                     | post: object                                                               | string      | Returns latitude and longitude as a CSV string.                                             |
| getAttachmentData               | post: object                                                               | string      | Returns CSV columns for attachment data from a post.                                        |
| getMediaURLs                    | post: object                                                               | string      | Returns a string of media URLs (audio/video) for a post.                                    |
| getMediaTranscripts             | post: object                                                               | string      | Returns the transcript text for a post's media, if available.                               |
| getPostRatings                  | customRatings: Array, postRatings: Array                                   | string      | Returns CSV columns for post ratings.                                                       |
| updateJobStatusIfNeeded         | jobId: number, totalPosts: number, processedCount: number, lastReportedCount: number, done: Function | void        | Updates background job progress if enough posts have been processed.                        |
| getTranslatedPoints             | points: Array, targetLanguage: string                                      | Promise<object> | Returns a mapping of point IDs to their translated content.                                 |
| getTranslation                  | model: object, textType: string, targetLanguage: string                    | Promise<string|null> | Returns the translation for a given model and text type.                                    |
| getOrderedPosts                 | posts: Array                                                               | Array       | Returns posts ordered by (endorsementsUp - endorsementsDown) descending.                    |
| setJobError                     | jobId: number, errorToUser: string, errorDetail: any, done: Function       | void        | Sets an error state for a background job.                                                   |
| preparePosts                    | workPackage: object, callback: Function                                    | void        | Prepares post data for export, including translations and custom ratings.                   |
| uploadToS3                      | jobId: number, userId: number, filename: string, exportType: string, data: Buffer|string, done: Function | void        | Uploads a file to AWS S3 and returns a signed download URL.                                 |
| getImageFromUrl                 | url: string, done: Function                                                | void        | Downloads an image from a URL to a temporary file.                                          |
| getPointMediaUrls               | post: object                                                               | string      | Returns a string of media URLs for all points in a post.                                    |

---

## Function Details

### getExportFileDataForGroup

Generates a CSV export of all posts in a group, including user, post, points, images, attachments, media, and ratings data.

#### Parameters

| Name     | Type   | Description                                 |
|----------|--------|---------------------------------------------|
| group    | object | The group object (with configuration).      |
| hostName | string | The hostname for generating post URLs.      |
| callback | Function | Callback function (error, csvString).     |

#### Example
```javascript
getExportFileDataForGroup(group, 'example.com', (err, csv) => { ... });
```

---

### getLoginsExportDataForCommunity

Exports user login activity for a community as CSV.

#### Parameters

| Name        | Type     | Description                                 |
|-------------|----------|---------------------------------------------|
| communityId | number   | The ID of the community.                    |
| hostName    | string   | Hostname (not used in output).              |
| callback    | Function | Callback function (error, csvString).       |

---

### getLoginsExportDataForDomain

Exports user login activity for a domain as CSV.

#### Parameters

| Name      | Type     | Description                                 |
|-----------|----------|---------------------------------------------|
| domainId  | number   | The ID of the domain.                       |
| hostName  | string   | Hostname (not used in output).              |
| callback  | Function | Callback function (error, csvString).       |

---

### getGroupPosts

Retrieves all posts for a group, including related models (category, user, points, images, media, etc.).

#### Parameters

| Name     | Type     | Description                                 |
|----------|----------|---------------------------------------------|
| group    | object   | The group object.                           |
| hostName | string   | Hostname for generating URLs.               |
| callback | Function | Callback function (posts, error, categories)|

---

### getUsersForCommunity

Exports all users for a community as CSV.

#### Parameters

| Name        | Type     | Description                                 |
|-------------|----------|---------------------------------------------|
| communityId | number   | The ID of the community.                    |
| callback    | Function | Callback function (error, csvString).       |

---

### getDescriptionHeaders

Returns CSV header columns for post descriptions, supporting structured questions if configured.

#### Parameters

| Name  | Type   | Description                        |
|-------|--------|------------------------------------|
| group | object | The group object.                  |

#### Returns

- `string`: CSV header columns.

---

### getPostUrl

Returns the URL for a post, using the provided hostname or a default.

#### Parameters

| Name     | Type   | Description                                 |
|----------|--------|---------------------------------------------|
| post     | object | The post object.                            |
| hostname | string | (Optional) Hostname for the URL.            |

#### Returns

- `string`: The post URL.

---

### getCategory

Returns the category name for a post.

#### Parameters

| Name | Type   | Description      |
|------|--------|------------------|
| post | object | The post object. |

#### Returns

- `string`: Category name or empty string.

---

### getImages

Returns a string of image URLs for a post.

#### Parameters

| Name | Type   | Description      |
|------|--------|------------------|
| post | object | The post object. |

#### Returns

- `string`: Image URLs separated by newlines.

---

### clean

Cleans and formats a string for CSV output.

#### Parameters

| Name | Type   | Description      |
|------|--------|------------------|
| text | string | The input text.  |

#### Returns

- `string`: Cleaned text.

---

### getDescriptionColumns

Returns CSV columns for post descriptions, supporting structured questions if configured.

#### Parameters

| Name  | Type   | Description      |
|-------|--------|------------------|
| group | object | The group object.|
| post  | object | The post object. |

#### Returns

- `string`: CSV columns for description.

---

### getPointsDown / getPointsUp

Returns an array of "down" or "up" points for a post.

#### Parameters

| Name | Type   | Description      |
|------|--------|------------------|
| post | object | The post object. |

#### Returns

- `Array`: Array of point objects.

---

### getUserEmail

Returns the email of the post's user, or "hidden" if skipEmail is true.

#### Parameters

| Name | Type   | Description      |
|------|--------|------------------|
| post | object | The post object. |

#### Returns

- `string`: User email or "hidden".

---

### getRatingHeaders

Returns CSV header columns for custom ratings.

#### Parameters

| Name         | Type   | Description                |
|--------------|--------|----------------------------|
| customRatings| Array  | Array of custom rating objects.|

#### Returns

- `string`: CSV header columns for ratings.

---

### getContactData

Returns CSV columns for contact data from a post.

#### Parameters

| Name | Type   | Description      |
|------|--------|------------------|
| post | object | The post object. |

#### Returns

- `string`: CSV columns for contact data.

---

### getLocation

Returns latitude and longitude as a CSV string.

#### Parameters

| Name | Type   | Description      |
|------|--------|------------------|
| post | object | The post object. |

#### Returns

- `string`: CSV string of latitude,longitude.

---

### getAttachmentData

Returns CSV columns for attachment data from a post.

#### Parameters

| Name | Type   | Description      |
|------|--------|------------------|
| post | object | The post object. |

#### Returns

- `string`: CSV columns for attachment data.

---

### getMediaURLs

Returns a string of media URLs (audio/video) for a post.

#### Parameters

| Name | Type   | Description      |
|------|--------|------------------|
| post | object | The post object. |

#### Returns

- `string`: Media URLs.

---

### getMediaTranscripts

Returns the transcript text for a post's media, if available.

#### Parameters

| Name | Type   | Description      |
|------|--------|------------------|
| post | object | The post object. |

#### Returns

- `string`: Transcript text or empty string.

---

### getPostRatings

Returns CSV columns for post ratings.

#### Parameters

| Name         | Type   | Description                |
|--------------|--------|----------------------------|
| customRatings| Array  | Array of custom rating objects.|
| postRatings  | Array  | Array of post rating objects.|

#### Returns

- `string`: CSV columns for post ratings.

---

### updateJobStatusIfNeeded

Updates background job progress if enough posts have been processed.

#### Parameters

| Name              | Type     | Description                                 |
|-------------------|----------|---------------------------------------------|
| jobId             | number   | The background job ID.                      |
| totalPosts        | number   | Total number of posts.                      |
| processedCount    | number   | Number of posts processed so far.           |
| lastReportedCount | number   | Last reported processed count.              |
| done              | Function | Callback function (error, updated: boolean).|

---

### getTranslatedPoints

Returns a mapping of point IDs to their translated content.

#### Parameters

| Name          | Type   | Description                |
|---------------|--------|----------------------------|
| points        | Array  | Array of point objects.    |
| targetLanguage| string | Target language code.      |

#### Returns

- `Promise<object>`: Mapping of point IDs to translated content.

---

### getTranslation

Returns the translation for a given model and text type.

#### Parameters

| Name          | Type   | Description                |
|---------------|--------|----------------------------|
| model         | object | The model to translate.    |
| textType      | string | The type of text to translate.|
| targetLanguage| string | Target language code.      |

#### Returns

- `Promise<string|null>`: Translated content or null.

---

### getOrderedPosts

Returns posts ordered by (endorsementsUp - endorsementsDown) descending.

#### Parameters

| Name  | Type   | Description      |
|-------|--------|------------------|
| posts | Array  | Array of post objects.|

#### Returns

- `Array`: Ordered array of posts.

---

### setJobError

Sets an error state for a background job.

#### Parameters

| Name         | Type     | Description                                 |
|--------------|----------|---------------------------------------------|
| jobId        | number   | The background job ID.                      |
| errorToUser  | string   | Error message for the user.                 |
| errorDetail  | any      | Detailed error object.                      |
| done         | Function | Callback function (error).                  |

---

### preparePosts

Prepares post data for export, including translations and custom ratings.

#### Parameters

| Name        | Type   | Description                                 |
|-------------|--------|---------------------------------------------|
| workPackage | object | Work package containing group, hostname, etc.|
| callback    | Function | Callback function (error, resultObject).   |

---

### uploadToS3

Uploads a file to AWS S3 and returns a signed download URL.

#### Parameters

| Name       | Type   | Description                                 |
|------------|--------|---------------------------------------------|
| jobId      | number | The background job ID.                      |
| userId     | number | The user ID.                                |
| filename   | string | The filename to use in S3.                  |
| exportType | string | The export type (used in S3 key).           |
| data       | Buffer/string | The file data to upload.              |
| done       | Function | Callback function (error, signedUrl).     |

---

### getImageFromUrl

Downloads an image from a URL to a temporary file.

#### Parameters

| Name | Type   | Description      |
|------|--------|------------------|
| url  | string | The image URL.   |
| done | Function | Callback function (error, tmpFilename).|

---

### getPointMediaUrls

Returns a string of media URLs for all points in a post.

#### Parameters

| Name | Type   | Description      |
|------|--------|------------------|
| post | object | The post object. |

#### Returns

- `string`: Media URLs.

---

## Internal Utility Functions

These are not exported but are used internally:

- **downloadImage(uri, filename, callback):** Downloads an image from a URI to a file.
- **updateUploadJobStatus(jobId, uploadProgress):** Updates the progress of a background job during S3 upload.
- **getImageFormatUrl(image, formatId):** Returns the URL for a specific image format.
- **getMediaFormatUrl(media, formatId):** Returns the URL for a specific media format.
- **cleanDescription(text):** Cleans and formats a description string for CSV.
- **getPointsUpOrDown(post, value):** Returns points with positive or negative value.
- **getNewFromUsers(post):** (Stub) Returns an empty string.
- **getDescriptionHeaders(group):** Returns CSV headers for structured questions.
- **getDescriptionColumns(group, post):** Returns CSV columns for structured answers.

---

## Configuration

- **skipEmail:** `boolean`  
  If true, user emails are hidden in exports.

---

## Dependencies

- [aws-sdk](https://www.npmjs.com/package/aws-sdk): For S3 uploads.
- [async](https://www.npmjs.com/package/async): For async control flow.
- [lodash](https://www.npmjs.com/package/lodash): For data manipulation.
- [moment](https://www.npmjs.com/package/moment): For date formatting.
- [request](https://www.npmjs.com/package/request): For HTTP requests.
- [fs](https://nodejs.org/api/fs.html): For file system operations.
- [logger.cjs](../../utils/logger.cjs): For logging errors and warnings.
- **models:** Sequelize models, including `Post`, `User`, `Point`, `Category`, `AcBackgroundJob`, `AcActivity`, `AcTranslationCache`, etc.

---

## Example Usage

```javascript
const exportUtils = require('./path/to/exportUtils.cjs');

exportUtils.getExportFileDataForGroup(group, 'example.com', (err, csv) => {
  if (err) throw err;
  // Do something with csv
});

exportUtils.uploadToS3(jobId, userId, 'export.csv', 'reports', csvData, (err, url) => {
  if (err) throw err;
  // url is the signed S3 download link
});
```

---

## See Also

- [AcBackgroundJob Model](../../../models/index.cjs)
- [AcTranslationCache Model](../../../models/index.cjs)
- [logger Utility](../../utils/logger.cjs)
- [AWS S3 Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html)

---

**Note:**  
This module is designed for internal use in background jobs and export endpoints. It assumes the presence of a configured Sequelize ORM and AWS credentials in environment variables. For translation and structured question support, the group configuration must be properly set.

---

**Source:** `exportUtils.cjs` (relative to your project structure)