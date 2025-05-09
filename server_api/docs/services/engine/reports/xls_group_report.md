# Utility Module: xls_posts_report.cjs

This module provides utility functions for generating Excel (XLSX) reports of posts and points for a group, including detailed export logic, formatting, and S3 upload. It is designed for use in background jobs that export group data for reporting or archival purposes.

---

## Exported Functions

| Name             | Parameters                | Return Type | Description                                                                 |
|------------------|--------------------------|-------------|-----------------------------------------------------------------------------|
| createXlsReport  | workPackage, callback    | void        | Orchestrates the process of generating and uploading an XLSX report for posts and points in a group.              |

---

## Function: createXlsReport

Orchestrates the process of generating an XLSX report for a group, including fetching group data, preparing posts, generating the Excel file, and uploading it to S3. Updates job progress and handles errors.

### Parameters

| Name        | Type     | Description                                                                 |
|-------------|----------|-----------------------------------------------------------------------------|
| workPackage | object   | Contains jobId, groupId, userId, exportType, and is mutated with group and filename. |
| callback    | function | Node-style callback `(error?: Error) => void`.                              |

### Workflow

1. Fetches group data from the database and constructs a sanitized filename.
2. Prepares posts for export using `preparePosts`.
3. Updates the background job progress.
4. Calls `exportToXls` to generate the XLSX buffer.
5. Uploads the XLSX file to S3 using `uploadToS3`.
6. Updates the background job with the report URL and marks progress as complete.
7. Handles errors and updates job status accordingly.

---

## Internal Utility Functions

These functions are not exported but are central to the XLSX export logic.

### exportToXls

Generates an XLSX workbook containing posts and points for a group, with support for custom fields, ratings, and registration questions.

#### Parameters

| Name    | Type     | Description                                      |
|---------|----------|--------------------------------------------------|
| options | object   | Contains jobId, groupId, group, posts, categories, customRatings. |
| callback| function | Node-style callback `(error, buffer)`.           |

#### Key Steps

- Sets up workbook and worksheet columns based on group configuration.
- Iterates over posts (optionally grouped by category), adding rows for each post and its points.
- Adds custom fields, ratings, contact info, attachments, and registration answers as columns.
- Calls `addPostToSheet` and `addPostPointsToSheet` for each post.
- Updates job progress via `updateJobStatusIfNeeded`.
- Returns the XLSX buffer via callback.

---

### addPostToSheet

Adds a post's data as a row to the worksheet, including all configured fields, descriptions, ratings, and points.

#### Parameters

| Name      | Type     | Description                        |
|-----------|----------|------------------------------------|
| worksheet | Worksheet| ExcelJS worksheet instance         |
| post      | object   | Post data object                   |
| group     | object   | Group configuration object         |

---

### setDescriptions

Determines how to extract and format structured answers/descriptions for a post, supporting both new and old style group configurations.

#### Parameters

| Name      | Type     | Description                        |
|-----------|----------|------------------------------------|
| group     | object   | Group configuration object         |
| post      | object   | Post data object                   |
| builtPost | object   | Built post object (for fallback)   |

#### Returns

- `object` with keys for each structured answer.

---

### getPointTextWithEverything

Formats a point's content, author, and admin comments into a string for inclusion in the XLSX export.

#### Parameters

| Name  | Type   | Description                |
|-------|--------|----------------------------|
| group | object | Group configuration object |
| post  | object | Post data object           |
| point | object | Point data object          |

#### Returns

- `string` containing formatted point information.

---

### getContactDataRow, getAttachmentDataRow, getPostRatingsRow

Extracts contact, attachment, and ratings data from a post for inclusion in the export.

---

### getDescriptionHeaders, getRatingHeaders

Generates column definitions for structured answers and custom ratings, based on group configuration.

---

### setWrapping

Applies text wrapping and formatting to worksheet cells, especially for points columns.

#### Parameters

| Name      | Type     | Description                        |
|-----------|----------|------------------------------------|
| worksheet | Worksheet| ExcelJS worksheet instance         |

---

## Dependencies

- [models](../../../models/index.cjs): Sequelize models for database access.
- [async](https://caolan.github.io/async/): For control flow in asynchronous operations.
- [moment](https://momentjs.com/): For date formatting.
- [lodash](https://lodash.com/): Utility functions for object manipulation.
- [exceljs](https://github.com/exceljs/exceljs): For creating and manipulating Excel files.
- [sanitize-filename](https://www.npmjs.com/package/sanitize-filename): For safe filenames.
- [logger](../../utils/logger.cjs): Application logging utility.
- [common_utils.cjs](./common_utils.cjs): Shared utility functions for points, posts, S3 upload, etc.
- [xls_community_users_report.cjs](./xls_community_users_report.cjs): For extracting registration answers.
- [add_points_to_sheet.cjs](./add_points_to_sheet.cjs): For adding points data to the worksheet.

---

## Example Usage

```javascript
const { createXlsReport } = require('./xls_posts_report.cjs');

const workPackage = {
  jobId: 123,
  groupId: 456,
  userId: 789,
  exportType: 'xlsx'
};

createXlsReport(workPackage, (error) => {
  if (error) {
    console.error('Export failed:', error);
  } else {
    console.log('Export completed successfully!');
  }
});
```

---

## Related Modules

- [common_utils.cjs](./common_utils.cjs.md)
- [xls_community_users_report.cjs](./xls_community_users_report.cjs.md)
- [add_points_to_sheet.cjs](./add_points_to_sheet.cjs.md)
- [logger](../../utils/logger.cjs.md)
- [models](../../../models/index.cjs.md)

---

## Notes

- This module is intended for use in background job processing, not as a direct API endpoint.
- The export logic is highly dependent on group configuration and may need to be updated if group schema changes.
- Error handling is robust, with job status updates and error reporting to the database.

---