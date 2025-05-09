# Utility Module: xlsCommunityUsersReport.cjs

This module provides functionality to generate an Excel report of community and group users, including their registration answers, and upload the resulting file to S3. It is designed for use in background jobs and integrates with Sequelize models, ExcelJS, and various utility functions.

---

## Exported Functions

| Name                         | Parameters                                 | Return Type | Description                                                                                 |
|------------------------------|--------------------------------------------|-------------|---------------------------------------------------------------------------------------------|
| createXlsCommunityUsersReport | workPackage: object, callback: Function    | void        | Orchestrates the process of generating and uploading the community users Excel report.       |
| getAnswerFor                 | text: string, answers: object[]            | string      | Retrieves the answer for a given registration question from a user's answers array.          |

---

## Function: createXlsCommunityUsersReport

Orchestrates the process of generating an Excel report of all users in a community and its groups, including registration answers, and uploads the report to S3. Updates job progress and handles errors.

### Parameters

| Name        | Type    | Description                                                                                 |
|-------------|---------|---------------------------------------------------------------------------------------------|
| workPackage | object  | Contains job and community information. Must include `communityId`, `jobId`, `userId`, `fileEnding`. |
| callback    | Function| Node-style callback function `(error?: Error) => void`.                                     |

### workPackage Object Structure

| Property      | Type    | Description                                  |
|---------------|---------|----------------------------------------------|
| communityId   | number  | ID of the community to export                |
| jobId         | number  | Background job ID for progress tracking      |
| userId        | number  | ID of the user requesting the export         |
| fileEnding    | string  | File extension for the export (e.g., 'xlsx') |
| filename      | string  | (Set internally) Generated filename          |
| community     | object  | (Set internally) Community instance with groups |

### Process Overview

1. Loads the community and its groups from the database.
2. Updates job progress.
3. Generates the Excel workbook with user data and registration answers.
4. Uploads the workbook to S3.
5. Updates the job with the report URL and final progress.
6. Handles errors and updates job status accordingly.

### Example Usage

```javascript
const { createXlsCommunityUsersReport } = require('./xlsCommunityUsersReport.cjs');

createXlsCommunityUsersReport({
  communityId: 1,
  jobId: 123,
  userId: 456,
  fileEnding: 'xlsx'
}, (err) => {
  if (err) {
    console.error('Report generation failed:', err);
  } else {
    console.log('Report generated and uploaded successfully.');
  }
});
```

---

## Function: getAnswerFor

Retrieves the answer for a specific registration question from a user's answers array.

### Parameters

| Name   | Type      | Description                                 |
|--------|-----------|---------------------------------------------|
| text   | string    | The question text to look for               |
| answers| object[]  | Array of answer objects `{ [question]: answer }` |

### Returns

- `string` — The answer value if found, otherwise an empty string.

### Example

```javascript
const answers = [{ "Age": "30" }, { "Country": "Iceland" }];
const age = getAnswerFor("Age", answers); // "30"
```

---

## Internal Functions

### cleanText

Removes special characters from a string to sanitize worksheet names.

#### Parameters

| Name | Type   | Description         |
|------|--------|---------------------|
| text | string | The text to clean   |

#### Returns

- `string` — Cleaned text.

---

### formatWorksheet

Applies formatting to the worksheet (e.g., bolds the header row).

#### Parameters

| Name      | Type     | Description                |
|-----------|----------|----------------------------|
| worksheet | Worksheet| ExcelJS worksheet instance |

---

### addUsers

Adds user rows to a worksheet for a given model (Community or Group), including registration answers.

#### Parameters

| Name                | Type     | Description                                                                 |
|---------------------|----------|-----------------------------------------------------------------------------|
| worksheet           | Worksheet| ExcelJS worksheet instance                                                  |
| model               | Model    | Sequelize model (Community or Group)                                        |
| modelId             | number   | ID of the model instance                                                    |
| asUsersCode         | string   | Association name for users (e.g., "CommunityUsers", "GroupUsers")           |
| registrationQuestions| object[]| Array of registration question objects                                      |

---

### addCommunity

Adds a worksheet to the workbook for community users, including registration answers.

#### Parameters

| Name      | Type     | Description                        |
|-----------|----------|------------------------------------|
| workbook  | Workbook | ExcelJS workbook instance          |
| community | object   | Community instance with config     |

---

### addGroup

Adds a worksheet to the workbook for group users, including registration answers.

#### Parameters

| Name      | Type     | Description                        |
|-----------|----------|------------------------------------|
| workbook  | Workbook | ExcelJS workbook instance          |
| group     | object   | Group instance with config         |

---

### exportToXls

Generates the Excel workbook for the community and its groups, updating job progress.

#### Parameters

| Name    | Type    | Description                                      |
|---------|---------|--------------------------------------------------|
| options | object  | `{ jobId, community }`                           |
| callback| Function| Node-style callback `(error, buffer) => void`     |

---

## Dependencies

- [Sequelize models](../../../models/index.cjs)
- [ExcelJS](https://github.com/exceljs/exceljs)
- [async](https://caolan.github.io/async/)
- [moment](https://momentjs.com/)
- [lodash](https://lodash.com/)
- [sanitize-filename](https://www.npmjs.com/package/sanitize-filename)
- [logger utility](../../utils/logger.cjs)
- [common_utils.cjs](./common_utils.cjs) (for S3 upload, registration answer helpers, etc.)

---

## Related Utility Functions (from common_utils.cjs)

- `uploadToS3(jobId, userId, filename, fileEnding, data, callback)`
- `setJobError(jobId, errorType, error, callback)`

---

## Example Workflow

1. **Job starts**: `createXlsCommunityUsersReport` is called with a work package.
2. **Community and groups loaded**: Community and its groups are fetched from the database.
3. **Excel workbook generated**: User data and registration answers are written to the workbook.
4. **Progress updated**: Job progress is updated at various stages.
5. **File uploaded**: Workbook is uploaded to S3.
6. **Job completed**: Job is marked as complete, and the report URL is saved.

---

## See Also

- [common_utils.cjs](./common_utils.cjs.md) — for S3 upload, registration answer helpers, and other utilities.
- [AcBackgroundJob Model](../../../models/index.cjs) — for job progress and error handling.
- [ExcelJS Documentation](https://github.com/exceljs/exceljs)

---

## Exported Members

```javascript
module.exports = {
  createXlsCommunityUsersReport,
  getAnswerFor
};
```
