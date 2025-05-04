# YpXlsDownload

A web component for generating and downloading XLS reports for a given collection (e.g., group, community). It handles starting the XLS generation job, polling for progress, displaying progress, and providing a download link when ready.

## Properties

| Name                        | Type                | Description                                                                                 |
|-----------------------------|---------------------|---------------------------------------------------------------------------------------------|
| collectionType              | string              | "group", "community", or whichever your server expects.                                     |
| collectionId                | number              | The numeric ID of your group or community.                                                  |
| generateLabel               | string              | Label for the "Generate XLS" button.                                                        |
| downloadLabel               | string              | Label for the "Download XLS" button.                                                        |
| xlsProgress (private)       | number \| undefined | The progress of the XLS creation (0-100). Shows a progress bar while < 100.                 |
| xlsError (private)          | string \| undefined | Error message from server or local fetch error.                                             |
| xlsReportUrl (private)      | string \| undefined | The final XLS URL to allow user to download from.                                           |
| xlsDownloadDisabled (private)| boolean            | If the link has expired after ~1 hour or we want to block future downloads.                 |
| xlsReportCreationProgressUrl (private) | string \| undefined | The URL for polling report creation progress.                                               |
| xlsJobId (private)          | number \| undefined | The job ID received from the server after starting the generation.                          |

## Methods

| Name                              | Parameters                | Return Type | Description                                                                                                    |
|-----------------------------------|---------------------------|-------------|----------------------------------------------------------------------------------------------------------------|
| render                            | none                      | unknown     | Renders the component UI.                                                                                      |
| startXlsGeneration                | none                      | Promise<void>| Initiates the XLS generation process: starts the job, handles errors, and begins polling for progress.         |
| _startXlsCreationResponse (private)| data: YpReportData        | void        | Handles the server response after starting the XLS generation job. Stores jobId, sets progress, starts polling.|
| _pollXlsProgress (private)        | none                      | void        | Sets a timeout to poll the server for XLS creation progress.                                                   |
| _reportXlsCreationProgress (private)| none                    | Promise<void>| Fetches the current progress of the XLS creation job from the server.                                          |
| _xlsReportCreationProgressResponse (private)| response: YpReportData | void        | Handles the server response for report creation progress. Updates progress, handles errors, sets download URL. |

## Examples

```typescript
import "@your-lib/yp-xls-download.js";

html`
  <yp-xls-download
    collectionType="group"
    .collectionId="${123}"
    generateLabel="Generate XLS"
    downloadLabel="Download XLS"
  ></yp-xls-download>
`
```
