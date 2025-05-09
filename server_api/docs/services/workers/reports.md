# Service Module: ReportsWorker

The `ReportsWorker` module is responsible for processing various report generation tasks in the background. It acts as a worker that receives a "work package" describing the type of report to generate and delegates the task to the appropriate report generation function. This module supports DOCX, XLS, XLS (community users), AOI XLS, and fraud audit report generation.

## Methods

| Name     | Parameters                                 | Return Type | Description                                                                                 |
|----------|--------------------------------------------|-------------|---------------------------------------------------------------------------------------------|
| process  | workPackage: object, callback: Function    | void        | Processes a work package by dispatching to the correct report generation function based on the type. |

## process(workPackage, callback)

Processes a report generation work package. Depending on the `type` property of the `workPackage`, it delegates the task to the appropriate report generation function.

### Parameters

| Name        | Type     | Description                                                                 |
|-------------|----------|-----------------------------------------------------------------------------|
| workPackage | object   | An object describing the report generation task. Must include a `type` field.|
| callback    | Function | A callback function to be called upon completion or error.                   |

### Supported workPackage Types

| Type                                         | Description                                                      | Handler Function                                                                                      |
|-----------------------------------------------|------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| start-docx-report-generation                  | Generates a DOCX group report.                                   | [createDocxReport](../engine/reports/docx_group_report.cjs)                                           |
| start-xls-report-generation                   | Generates an XLS group report.                                   | [createXlsReport](../engine/reports/xls_group_report.cjs)                                             |
| start-aoi-xls-report-generation               | Generates an XLS export for "All Our Ideas" choice votes.        | [exportChoiceVotes](../engine/reports/xlsAllOurIdeasExport.js)                                        |
| start-xls-users-community-report-generation   | Generates an XLS report of community users.                      | [createXlsCommunityUsersReport](../engine/reports/xls_community_users_report.cjs)                     |
| start-fraud-audit-report-generation           | Generates a fraud audit report.                                  | [createFraudAuditReport](../engine/moderation/fraud/CreateFraudAuditReport.cjs)                       |

If the `type` is not recognized, the callback is called with an error message.

### Example workPackage

```json
{
  "type": "start-docx-report-generation",
  "data": {
    "groupId": 123,
    "userId": 456
  }
}
```

### Example Usage

```javascript
const reportsWorker = require('./path/to/ReportsWorker.cjs');

const workPackage = {
  type: 'start-xls-report-generation',
  data: { groupId: 42 }
};

reportsWorker.process(workPackage, (err, result) => {
  if (err) {
    console.error('Report generation failed:', err);
  } else {
    console.log('Report generated:', result);
  }
});
```

## Dependencies

- [async](https://caolan.github.io/async/)
- [models](../../models/index.cjs)
- [logger](../utils/logger.cjs)
- [queue](./queue.cjs)
- [i18n](../utils/i18n.cjs)
- [toJson](../utils/to_json.cjs)
- [lodash](https://lodash.com/)
- [fs](https://nodejs.org/api/fs.html)
- [createDocxReport](../engine/reports/docx_group_report.cjs)
- [createXlsReport](../engine/reports/xls_group_report.cjs)
- [createXlsCommunityUsersReport](../engine/reports/xls_community_users_report.cjs)
- [createFraudAuditReport](../engine/moderation/fraud/CreateFraudAuditReport.cjs)
- [exportChoiceVotes](../engine/reports/xlsAllOurIdeasExport.js) (dynamically imported)
- [airbrake](../utils/airbrake.cjs) (conditionally loaded if `AIRBRAKE_PROJECT_ID` is set)

## Export

This module exports a singleton instance of `ReportsWorker`:

```javascript
module.exports = new ReportsWorker();
```

## Notes

- The `process` method is only attached to the prototype after the dynamic import of `exportChoiceVotes` completes. This means that the worker will not process AOI XLS report generation until the import is resolved.
- Error handling for unknown types is performed by calling the callback with an error message.
- The module is designed to be used as a background worker, typically in a job queue or similar asynchronous processing system.

---

**See also:**
- [createDocxReport](../engine/reports/docx_group_report.cjs)
- [createXlsReport](../engine/reports/xls_group_report.cjs)
- [createXlsCommunityUsersReport](../engine/reports/xls_community_users_report.cjs)
- [createFraudAuditReport](../engine/moderation/fraud/CreateFraudAuditReport.cjs)
- [exportChoiceVotes](../engine/reports/xlsAllOurIdeasExport.js)