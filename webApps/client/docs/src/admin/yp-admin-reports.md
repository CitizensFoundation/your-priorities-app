# YpAdminReports

YpAdminReports is a custom web component that extends YpAdminPage. It is used for generating and downloading various types of reports in an admin panel, such as fraud audit reports, DOCX, XLS, and user XLS reports. It handles the report generation process, including starting the report creation, polling for progress, and providing a download link once the report is ready.

## Properties

| Name                    | Type                                      | Description                                                                 |
|-------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| action                  | String                                    | The API endpoint to start report creation.                                  |
| type                    | "fraudAuditReport" \| "docx" \| "xls" \| "usersxls" \| undefined | The type of report to be generated.                                         |
| progress                | Number \| undefined                       | The progress of the report generation as a percentage.                      |
| selectedTab             | Number                                    | The index of the currently selected tab.                                    |
| error                   | String \| undefined                       | An error message that can be displayed to the user.                         |
| jobId                   | Number \| undefined                       | The job ID of the report generation process.                                |
| reportUrl               | String \| undefined                       | The URL where the generated report can be downloaded from.                  |
| reportGenerationUrl     | String \| undefined                       | The API endpoint to check the report generation progress or to get fraud audits. |
| downloadDisabled        | Boolean                                   | A flag indicating whether the download button should be disabled.           |
| toastText               | String \| undefined                       | Text to be displayed in a toast notification.                               |
| autoTranslateActive     | Boolean                                   | A flag indicating whether automatic translation is active.                  |
| selectedFraudAuditId    | Number \| undefined                       | The ID of the selected fraud audit.                                         |
| fraudAuditSelectionActive | Boolean                                   | A flag indicating whether the fraud audit selection is active.              |
| fraudAuditsAvailable    | YpFraudAuditData[] \| undefined           | An array of available fraud audits for selection.                           |
| waitingOnFraudAudits    | Boolean                                   | A flag indicating whether the component is waiting for fraud audits to load.|
| reportCreationProgressUrl | String \| undefined                       | The API endpoint to poll for report creation progress.                      |

## Methods

| Name                        | Parameters | Return Type | Description                                                                 |
|-----------------------------|------------|-------------|-----------------------------------------------------------------------------|
| fraudItemSelection          | event: CustomEvent | void        | Handles the selection of a fraud audit item.                                |
| startReportCreation         |            | void        | Initiates the report creation process.                                      |
| startReportCreationResponse | data: YpReportData | void        | Handles the response after starting report creation.                        |
| pollLaterForProgress        |            | void        | Schedules a poll for report creation progress.                              |
| reportCreationProgress      |            | void        | Polls for the current progress of report creation.                          |
| formatAuditReportDates      | data: YpFraudAuditData[] | YpFraudAuditData[] | Formats the dates of fraud audit reports.                                   |
| fraudAuditsAjaxResponse     | event: CustomEvent | void        | Handles the AJAX response for fraud audits.                                 |
| reportCreationProgressResponse | response: YpReportData | void        | Handles the response for report creation progress.                          |
| startGeneration             |            | void        | Starts the report generation process based on the selected type.            |
| startReportCreationAjax     | url: String | void        | Starts the report creation process via AJAX.                                |
| getFraudAuditsAjax          | url: String | void        | Fetches available fraud audits via AJAX.                                    |
| _tabChanged                 |            | void        | Handles the change of the selected tab.                                     |

## Events (if any)

- **None specified**

## Examples

```typescript
// Example usage of the YpAdminReports component
<yp-admin-reports
  action="/api/communities"
  type="fraudAuditReport"
  selectedTab={0}
  autoTranslateActive={true}
></yp-admin-reports>
```

Please note that the above example is a simplified usage scenario. In a real-world application, you would need to handle events, property changes, and integrate with the rest of your application logic.