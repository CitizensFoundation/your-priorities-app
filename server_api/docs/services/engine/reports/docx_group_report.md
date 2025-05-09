# Service Module: docxReportExport.cjs

This module provides functionality to generate a DOCX report for a group, including posts, points, ratings, and group metadata, and uploads the generated report to S3. It is designed for use in the "Your Priorities" platform and is typically invoked as part of a background job.

---

## Exported Functions

| Name             | Parameters                | Return Type | Description                                                                 |
|------------------|--------------------------|-------------|-----------------------------------------------------------------------------|
| createDocxReport | workPackage: object, callback: function | void        | Orchestrates the process of generating a DOCX report and uploading it to S3. |

---

## Function: createDocxReport

Orchestrates the process of generating a DOCX report for a group, including fetching group and post data, generating the DOCX file, and uploading it to S3. Updates the background job status throughout the process.

### Parameters

| Name        | Type     | Description                                                                                 |
|-------------|----------|---------------------------------------------------------------------------------------------|
| workPackage | object   | Contains jobId, groupId, userId, exportType, and is mutated to include group and filename.  |
| callback    | function | Callback function to be called upon completion or error.                                    |

### workPackage Object Structure

| Property   | Type   | Description                                      |
|------------|--------|--------------------------------------------------|
| jobId      | number | Background job ID.                               |
| groupId    | number | ID of the group to export.                       |
| userId     | number | ID of the user requesting the export.            |
| exportType | string | File extension/type for export (e.g., "docx").   |
| group      | object | (Populated) Group data from the database.        |
| filename   | string | (Populated) Generated filename for the export.   |

### Callback Signature

```js
function callback(error?: Error): void
```

### Process Overview

1. **Fetch Group Data**: Loads group and logo image data from the database.
2. **Prepare Posts**: Prepares post data for export (via `preparePosts`).
3. **Update Job Progress**: Sets job progress to 5%.
4. **Generate DOCX**: Calls `exportToDocx` to generate the DOCX file as a Buffer.
5. **Upload to S3**: Uploads the generated file to S3 and updates the job with the report URL.
6. **Error Handling**: On error, updates the job with error status.

---

## Internal Utility Functions

### createDocWithStyles

Creates a new `docx.Document` instance with custom styles for headings, asides, and well-spaced paragraphs.

#### Parameters

| Name  | Type   | Description         |
|-------|--------|---------------------|
| title | string | Title for the DOCX. |

#### Returns

| Type           | Description                |
|----------------|---------------------------|
| docx.Document  | A new DOCX document object|

---

### setDescriptions

Appends structured question/answer or description paragraphs to a DOCX section, based on group configuration and post data.

#### Parameters

| Name      | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| group     | object | Group object with configuration.                 |
| post      | object | The original post object.                        |
| builtPost | object | The processed post object (with translations).   |
| children  | array  | Array to which Paragraphs are pushed.            |

---

### cleanText

Cleans a string by removing vertical tab characters.

#### Parameters

| Name | Type   | Description         |
|------|--------|---------------------|
| text | string | Text to be cleaned. |

#### Returns

| Type   | Description         |
|--------|---------------------|
| string | Cleaned text string.|

---

### addPointTranslationIfNeeded

Appends a point's content (translated if available) and any admin comment to the DOCX section.

#### Parameters

| Name   | Type   | Description                                      |
|--------|--------|--------------------------------------------------|
| group  | object | Group object with configuration.                 |
| post   | object | The processed post object.                       |
| point  | object | The point object (for/against).                  |
| children | array | Array to which Paragraphs are pushed.           |

---

### addPostToDoc

Adds a post and its details (description, user info, endorsements, points, etc.) to the DOCX document.

#### Parameters

| Name  | Type           | Description                |
|-------|----------------|----------------------------|
| doc   | docx.Document  | The DOCX document object.  |
| post  | object         | The processed post object. |
| group | object         | The group object.          |

---

### setupGroup

Adds the group header, logo, objectives, and ratings options to the DOCX document.

#### Parameters

| Name          | Type           | Description                                 |
|---------------|----------------|---------------------------------------------|
| doc           | docx.Document  | The DOCX document object.                   |
| group         | object         | The group object.                           |
| ratingsHeaders| string         | Ratings header string.                      |
| title         | string         | Title for the DOCX.                         |
| done          | function       | Callback function(error?: Error).           |

---

### exportToDocx

Generates the DOCX file for the group, including all posts, points, and categories, and returns the file as a Buffer.

#### Parameters

| Name     | Type   | Description                                                                 |
|----------|--------|-----------------------------------------------------------------------------|
| options  | object | Contains jobId, groupId, group, posts, categories, customRatings, etc.      |
| callback | function | Callback function(error: Error, data: Buffer).                            |

---

## Dependencies

- [docx](https://www.npmjs.com/package/docx): For DOCX document creation.
- [async](https://caolan.github.io/async/): For control flow.
- [moment](https://momentjs.com/): For date formatting.
- [lodash](https://lodash.com/): For utility functions.
- [sanitize-filename](https://www.npmjs.com/package/sanitize-filename): For safe filenames.
- [fs](https://nodejs.org/api/fs.html): For file system operations.
- [logger.cjs](../../utils/logger.cjs): For logging.
- [common_utils.cjs](./common_utils.cjs): For various data preparation and utility functions (see [common_utils.cjs.md](./common_utils.cjs.md)).

---

## Example Usage

```js
const { createDocxReport } = require('./docxReportExport.cjs');

const workPackage = {
  jobId: 123,
  groupId: 456,
  userId: 789,
  exportType: 'docx'
};

createDocxReport(workPackage, (error) => {
  if (error) {
    console.error('Export failed:', error);
  } else {
    console.log('Export completed successfully!');
  }
});
```

---

## Related Modules

- [common_utils.cjs](./common_utils.cjs.md): Provides data preparation, S3 upload, and other utility functions used throughout the export process.
- [logger.cjs](../../utils/logger.cjs): Logging utility.

---

## Notes

- This module is intended to be used as part of a background job system.
- The generated DOCX file is uploaded to S3, and the job record is updated with the report URL.
- Error handling is robust; any error in the process will update the job status accordingly.

---

## Configuration

No direct configuration is required for this module, but it relies on group configuration fields (such as `structuredQuestionsJson`, `customAdminCommentsTitle`, etc.) for customizing the export content.

---

## Exported Constants

None.

---

## See Also

- [docx documentation](https://docx.js.org/)
- [common_utils.cjs.md](./common_utils.cjs.md) for details on utility functions used in this module.
