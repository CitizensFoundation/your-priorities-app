# YpXlsDownload

The `YpXlsDownload` component is a web component that facilitates the generation and downloading of XLS reports. It interacts with a server to start the report creation process, polls for progress, and provides a download link once the report is ready.

## Properties

| Name            | Type     | Description                                                                 |
|-----------------|----------|-----------------------------------------------------------------------------|
| collectionType  | string   | Specifies the type of collection, e.g., "group" or "community".             |
| collectionId    | number   | The numeric ID of the group or community.                                   |
| generateLabel   | string   | The label for the button to generate the XLS report.                        |
| downloadLabel   | string   | The label for the button to download the XLS report.                        |

## Methods

| Name                          | Parameters | Return Type | Description                                                                 |
|-------------------------------|------------|-------------|-----------------------------------------------------------------------------|
| startXlsGeneration            | None       | Promise<void> | Initiates the XLS report generation process by sending a request to the server. |
| _startXlsCreationResponse     | data: YpReportData | void | Handles the server response after starting the XLS creation process.         |
| _pollXlsProgress              | None       | void        | Initiates polling to check the progress of the XLS report creation.          |
| _reportXlsCreationProgress    | None       | Promise<void> | Fetches the current progress of the XLS report creation from the server.     |
| _xlsReportCreationProgressResponse | response: YpReportData | void | Processes the server response regarding the progress of the XLS report creation. |

## Events

- **None**

## Examples

```typescript
// Example usage of the YpXlsDownload component
<yp-xls-download
  collectionType="group"
  .collectionId="${123}"
  language="en"
></yp-xls-download>
```

This component is designed to be used in a web application where users can request the generation of XLS reports for specific collections, such as groups or communities. It provides a user interface with buttons and progress indicators to guide the user through the process of generating and downloading the report.