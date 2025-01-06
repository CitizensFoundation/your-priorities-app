# YpAdminReports

The `YpAdminReports` class is a web component that extends `YpAdminPage` and is used for generating and managing reports within an admin interface. It supports different types of reports such as fraud audit reports, DOCX, and XLS formats, and handles the report generation process including progress tracking and downloading.

## Properties

| Name                      | Type                                                                 | Description                                                                 |
|---------------------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------|
| `action`                  | `string`                                                             | The API endpoint for report actions.                                        |
| `type`                    | `"fraudAuditReport" \| "docx" \| "xls" \| "usersxls" \| undefined`   | The type of report to generate.                                             |
| `progress`                | `number \| undefined`                                                | The progress of the report generation process.                              |
| `selectedTab`             | `number`                                                             | The index of the currently selected tab.                                    |
| `error`                   | `string \| undefined`                                                | Error message if any error occurs during report generation.                 |
| `jobId`                   | `number \| undefined`                                                | The job ID for the report generation process.                               |
| `reportUrl`               | `string \| undefined`                                                | The URL to download the generated report.                                   |
| `reportGenerationUrl`     | `string \| undefined`                                                | The URL to initiate report generation.                                      |
| `downloadDisabled`        | `boolean`                                                            | Indicates if the download button is disabled.                               |
| `allOurIdeasQuestionId`   | `number \| undefined`                                                | The question ID for "All Our Ideas" configuration.                          |
| `toastText`               | `string \| undefined`                                                | Text to display in a toast notification.                                    |
| `autoTranslateActive`     | `boolean`                                                            | Indicates if auto-translation is active.                                    |
| `selectedFraudAuditId`    | `number \| undefined`                                                | The ID of the selected fraud audit.                                         |
| `fraudAuditSelectionActive` | `boolean`                                                          | Indicates if fraud audit selection is active.                               |
| `fraudAuditsAvailable`    | `YpFraudAuditData[] \| undefined`                                    | List of available fraud audits.                                             |
| `waitingOnFraudAudits`    | `boolean`                                                            | Indicates if the component is waiting for fraud audits to be fetched.       |
| `reportCreationProgressUrl` | `string \| undefined`                                              | The URL to check the progress of report creation.                           |

## Methods

| Name                             | Parameters                                                                 | Return Type | Description                                                                 |
|----------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| `refresh`                        | -                                                                          | `void`      | Resets the component state and refreshes the report data.                   |
| `connectedCallback`              | -                                                                          | `void`      | Lifecycle method called when the component is added to the document.        |
| `disconnectedCallback`           | -                                                                          | `void`      | Lifecycle method called when the component is removed from the document.    |
| `fraudItemSelection`             | `event: CustomEvent`                                                       | `void`      | Handles the selection of a fraud audit item.                                |
| `startReportCreation`            | -                                                                          | `void`      | Initiates the report creation process.                                      |
| `startReportCreationResponse`    | `data: YpReportData`                                                       | `void`      | Handles the response from the report creation initiation.                   |
| `pollLaterForProgress`           | -                                                                          | `void`      | Schedules a check for report creation progress.                             |
| `reportCreationProgress`         | -                                                                          | `void`      | Fetches the current progress of report creation.                            |
| `formatAuditReportDates`         | `data: YpFraudAuditData[]`                                                 | `YpFraudAuditData[]` | Formats the dates in the fraud audit data.                                  |
| `fraudAuditsAjaxResponse`        | `event: CustomEvent`                                                       | `void`      | Handles the response from fetching fraud audits.                            |
| `reportCreationProgressResponse` | `response: YpReportData`                                                   | `void`      | Handles the response from checking report creation progress.                |
| `updated`                        | `changedProperties: Map<string \| number \| symbol, unknown>`              | `void`      | Lifecycle method called when properties are updated.                        |
| `startGeneration`                | -                                                                          | `void`      | Starts the report generation process based on the selected type.            |
| `startReportCreationAjax`        | `url: string`                                                              | `void`      | Initiates report creation via an AJAX request.                              |
| `getFraudAuditsAjax`             | `url: string`                                                              | `void`      | Fetches available fraud audits via an AJAX request.                         |
| `firstUpdated`                   | `_changedProperties: PropertyValueMap<any> \| Map<PropertyKey, unknown>`   | `void`      | Lifecycle method called after the first update of the component.            |
| `_tabChanged`                    | -                                                                          | `void`      | Handles changes to the selected tab and updates report generation settings. |
| `renderStart`                    | -                                                                          | `TemplateResult` | Renders the start button and progress bar for report generation.            |
| `renderDownload`                 | -                                                                          | `TemplateResult` | Renders the download button and related information.                        |
| `render`                         | -                                                                          | `TemplateResult` | Renders the component's template.                                           |

## Examples

```typescript
// Example usage of the YpAdminReports component
import './yp-admin-reports.js';

const reportsElement = document.createElement('yp-admin-reports');
document.body.appendChild(reportsElement);
```