# Service Module: FraudAuditReport Service

This module provides functionality to generate a fraud audit report for a community, export the data to an Excel file, and upload the report to S3. It is designed to be used as part of a background job system for reporting on potentially fraudulent user activity (endorsements, ratings, point qualities, points, posts) within a community.

---

## Exported Functions

| Name                    | Parameters                       | Return Type | Description                                                                 |
|-------------------------|----------------------------------|-------------|-----------------------------------------------------------------------------|
| createFraudAuditReport  | workPackage: object, done: func  | Promise<void> | Main entry point. Generates and uploads a fraud audit report for a work package. |

---

# Class: FraudAuditReport

Handles the process of generating a fraud audit report, including data fetching, Excel file creation, and S3 upload.

## Constructor

| Parameter    | Type   | Description                        |
|--------------|--------|------------------------------------|
| workPackage  | object | The work package containing job, user, and audit report context. |

---

## Methods

### async getPointQualityItems(ids: number[]): Promise<PointQuality[]>

Fetches PointQuality items by IDs, including related User, Point, Post, Group, and Community data.

| Parameter | Type     | Description                |
|-----------|----------|----------------------------|
| ids       | number[] | Array of PointQuality IDs. |

**Returns:**  
`Promise<PointQuality[]>` - Array of PointQuality model instances with associations.

---

### async getPostDependedItems(model: Model, ids: number[]): Promise<any[]>

Fetches items (endorsements, ratings, points) by IDs, including related User, Post, Group, and Community data.

| Parameter | Type   | Description                        |
|-----------|--------|------------------------------------|
| model     | Model  | Sequelize model (Endorsement, Rating, Point). |
| ids       | number[] | Array of item IDs.                |

**Returns:**  
`Promise<any[]>` - Array of model instances with associations, sorted by post_id and user_agent.

---

### async getPostItems(ids: number[]): Promise<any[]>

Fetches Post items by IDs, including related User, Group, and Community data.

| Parameter | Type     | Description                |
|-----------|----------|----------------------------|
| ids       | number[] | Array of Post IDs.         |

**Returns:**  
`Promise<any[]>` - Array of Post model instances with associations.

---

### async setupXls(): Promise<void>

Initializes the Excel workbook and worksheet, and sets up columns based on the report type.

**Returns:**  
`Promise<void>`

---

### setupFilename(): void

Generates and sets a sanitized filename for the report in the work package.

**Returns:**  
`void`

---

### async getCommunity(): Promise<void>

Fetches and attaches the Community object to the work package.

**Returns:**  
`Promise<void>`

---

### async uploadToS3(): Promise<void>

Uploads the generated Excel report to S3 and updates the background job with the report URL.

**Returns:**  
`Promise<void>`

---

### async setupItems(): Promise<void>

Fetches and sets the items to be included in the report, based on the collection type in the work package.

**Returns:**  
`Promise<void>`

---

### async populateXls(): Promise<void>

Populates the Excel worksheet with the fetched items.

**Returns:**  
`Promise<void>`

---

### async createReport(): Promise<void>

Main method to orchestrate the report generation process: fetches audit data, community, items, creates the Excel file, uploads to S3, and updates job progress.

**Returns:**  
`Promise<void>`

---

# Function: createFraudAuditReport

Main entry point for generating a fraud audit report as a background job.

## Parameters

| Name        | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| workPackage | object   | The work package containing job, user, and audit report context. |
| done        | function | Callback to be called when the job is done or fails. |

**Returns:**  
`Promise<void>`

**Usage Example:**
```javascript
const { createFraudAuditReport } = require('./fraud_audit_report.cjs');
createFraudAuditReport(workPackage, (err) => {
  if (err) {
    // handle error
  } else {
    // success
  }
});
```

---

# Utility Function: formatWorksheet

Formats the first row of the worksheet to be bold.

## Parameters

| Name      | Type      | Description                        |
|-----------|-----------|------------------------------------|
| worksheet | Worksheet | ExcelJS worksheet instance.         |

**Returns:**  
`void`

---

# Dependencies

- **models**: Sequelize models for User, Point, Post, Group, Community, Endorsement, Rating, PointQuality, GeneralDataStore, AcBackgroundJob.
- **moment**: For date formatting.
- **lodash**: For sorting.
- **exceljs**: For Excel file creation.
- **sanitize-filename**: For safe filenames.
- **setJobError**: Utility to set job error status.
- **uploadToS3**: Utility to upload files to S3.

---

# Configuration / WorkPackage Structure

The `workPackage` object is expected to have the following structure:

| Property                | Type     | Description                                  |
|-------------------------|----------|----------------------------------------------|
| jobId                   | number   | Background job ID.                           |
| userId                  | number   | User ID who initiated the report.            |
| communityId             | number   | Community ID for the report.                 |
| selectedFraudAuditId    | number   | ID of the audit report to use.               |
| auditReportData         | object   | Data from the audit report (populated during execution). |
| filename                | string   | (Set during execution) Generated filename.   |
| fileEnding              | string   | (Set during execution) File extension.       |
| community               | object   | (Set during execution) Community object.     |
| userName                | string   | (Optional) Name of the user.                 |

---

# Related Files

- [../../../../models/index.cjs](../../../../models/index.md) - Sequelize models.
- [../../reports/common_utils.cjs](../../reports/common_utils.md) - Utilities for job error handling and S3 upload.

---

# Example Usage

```javascript
const { createFraudAuditReport } = require('./fraud_audit_report.cjs');

const workPackage = {
  jobId: 123,
  userId: 456,
  communityId: 789,
  selectedFraudAuditId: 1011,
  // ...other properties as required
};

createFraudAuditReport(workPackage, (err) => {
  if (err) {
    console.error('Report generation failed:', err);
  } else {
    console.log('Report generated and uploaded successfully.');
  }
});
```

---

# Notes

- This module is intended for use in a background job processing context.
- The report is generated as an Excel file and uploaded to S3; the job progress is updated throughout the process.
- Errors are handled and reported via the background job system.

---

For more details on the models used, see the [models documentation](../../../../models/index.md).  
For S3 upload and job error handling, see [common_utils.cjs](../../reports/common_utils.md).