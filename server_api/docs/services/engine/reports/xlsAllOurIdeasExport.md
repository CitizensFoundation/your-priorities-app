# Service Module: exportChoiceVotes and Related Utilities

This module provides functionality to export choice votes for a given question, including fetching choices and votes from an external API, calculating ELO ratings, generating an Excel report, and uploading the report to S3. It is designed for use in a background job or export workflow.

---

## Exported Functions

### exportChoiceVotes

Exports choice votes for a given question, generates an Excel report with choices and votes, calculates ELO ratings, uploads the report to S3, and updates job status.

#### Parameters

| Name        | Type                                                                 | Description                                                                                 |
|-------------|----------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| workPackage | [AcXlsExportJobData](#acxlsexportjobdata-interface)                  | The job data containing question ID, user ID, export type, UTM source, and job ID.          |
| done        | (error: Error \| undefined, url?: string \| undefined) => void       | Callback to be called when the export is complete or if an error occurs.                    |

#### Description

- Updates the job status to indicate progress.
- Fetches all choices for the specified question (optionally filtered by UTM source).
- For each choice, fetches its winning and losing votes.
- Generates an Excel workbook with three sheets: "Choices", "Winning Votes", and "Losing Votes".
- Calculates ELO ratings for each choice based on direct pairwise wins/losses.
- Uploads the generated Excel file to S3.
- Updates the job status and invokes the callback with the S3 URL or error.

#### Example Usage

```typescript
await exportChoiceVotes(workPackage, (error, url) => {
  if (error) {
    // handle error
  } else {
    // use the S3 URL
  }
});
```

---

## Internal Utility Functions

### fetchChoices

Fetches all choices for a given question from the Pairwise API.

#### Parameters

| Name       | Type     | Description                                 |
|------------|----------|---------------------------------------------|
| questionId | number   | The ID of the question.                     |
| utmSource  | string   | (Optional) UTM source for filtering.        |

#### Returns

`Promise<AoiChoiceData[]>` — Array of choice data objects.

#### Description

- Calls the Pairwise API to retrieve all choices for the specified question.
- Includes inactive and all choices.
- Optionally appends a UTM source to the request.

---

### fetchVotes

Fetches winning and losing votes for a specific choice of a question from the Pairwise API.

#### Parameters

| Name       | Type     | Description                                 |
|------------|----------|---------------------------------------------|
| questionId | number   | The ID of the question.                     |
| choiceId   | number   | The ID of the choice.                       |
| utmSource  | string   | (Optional) UTM source for filtering.        |

#### Returns

`Promise<{ winning_votes: AoiVoteData[]; losing_votes: AoiVoteData[] }>` — Object containing arrays of winning and losing votes.

---

### calculateElo

Calculates new ELO ratings for two choices based on their current ratings and scores.

#### Parameters

| Name    | Type   | Description                                 |
|---------|--------|---------------------------------------------|
| rating1 | number | Current ELO rating of the first choice.     |
| rating2 | number | Current ELO rating of the second choice.    |
| score1  | number | Score for the first choice (0.0–1.0).       |
| score2  | number | Score for the second choice (0.0–1.0).      |

#### Returns

`[number, number]` — New ELO ratings for the first and second choices.

---

## Dependencies

- [ExcelJS](https://github.com/exceljs/exceljs): For generating Excel workbooks.
- [node-fetch](https://www.npmjs.com/package/node-fetch): For making HTTP requests to the Pairwise API.
- [uuid](https://www.npmjs.com/package/uuid): For generating unique filenames.
- [fs](https://nodejs.org/api/fs.html), [path](https://nodejs.org/api/path.html): Node.js file system utilities.
- [commonUtils.js](./commonUtils.md): For `setJobError`, `updateUploadJobStatus`, and `uploadToS3`.
- [models/index.cjs](../../../models/index.cjs): For database models (not directly used in this file).

---

## Configuration

| Name                  | Type   | Description                                      |
|-----------------------|--------|--------------------------------------------------|
| PAIRWISE_API_HOST     | string | The base URL of the Pairwise API.                |
| PAIRWISE_USERNAME     | string | Username for Pairwise API basic authentication.  |
| PAIRWISE_PASSWORD     | string | Password for Pairwise API basic authentication.  |

---

## Data Interfaces

### AcXlsExportJobData Interface

Represents the data required to perform an export job.

| Property     | Type    | Description                                 |
|--------------|---------|---------------------------------------------|
| jobId        | string  | The unique job identifier.                  |
| questionId   | number  | The ID of the question to export.           |
| userId       | string  | The ID of the user requesting the export.   |
| exportType   | string  | The type of export (e.g., "choice_votes").  |
| utmSource    | string? | (Optional) UTM source for filtering.        |

---

### AoiChoiceData Interface

Represents a choice in the Pairwise system.

| Property      | Type    | Description                                 |
|---------------|---------|---------------------------------------------|
| id            | number  | Unique identifier for the choice.           |
| wins          | number  | Number of wins for this choice.             |
| losses        | number  | Number of losses for this choice.           |
| score         | number  | Score for this choice.                      |
| data          | string  | JSON-encoded data for the choice.           |
| user_created  | boolean | Whether the choice was user-created.        |
| ...           | any     | Other properties as returned by the API.    |

---

### AoiVoteData Interface

Represents a vote in the Pairwise system.

| Property         | Type    | Description                                 |
|------------------|---------|---------------------------------------------|
| id               | number  | Unique identifier for the vote.             |
| voter_id         | number  | ID of the voter.                            |
| question_id      | number  | ID of the question.                         |
| prompt_id        | number  | ID of the prompt.                           |
| choice_id        | number  | ID of the winning choice.                   |
| loser_choice_id  | number  | ID of the losing choice.                    |
| created_at       | string  | Creation timestamp.                         |
| updated_at       | string  | Update timestamp.                           |
| time_viewed      | number  | Time viewed in seconds.                     |
| tracking         | object  | UTM and tracking info (utm_source, etc.).   |

---

## S3 Upload

The generated Excel file is uploaded to S3 using the `uploadToS3` utility. The S3 URL is returned via the `done` callback.

---

## Error Handling

- If any step fails (fetching data, generating Excel, uploading), the job status is updated to error using `setJobError`, and the error is passed to the callback.

---

## Example Workflow

1. Call `exportChoiceVotes` with a valid `workPackage` and a callback.
2. The function fetches choices and votes, generates an Excel file, calculates ELO ratings, uploads the file to S3, and updates the job status.
3. The callback receives the S3 URL or an error.

---

## See Also

- [commonUtils.js](./commonUtils.md): For job status and S3 upload utilities.
- [models/index.cjs](../../../models/index.cjs): For database models.
- [ExcelJS Documentation](https://github.com/exceljs/exceljs)
- [node-fetch Documentation](https://www.npmjs.com/package/node-fetch)

---

## Exported Constants

None.

---

## Notes

- The ELO calculation is performed pairwise for all choices based on direct wins/losses.
- The Excel file contains three sheets: "Choices", "Winning Votes", and "Losing Votes".
- The function is designed to be used in a background job processing context.

---

## Types

> **Note:** The actual TypeScript interfaces for `AcXlsExportJobData`, `AoiChoiceData`, and `AoiVoteData` are assumed based on usage. If these are defined elsewhere, please refer to their source for exact definitions.

---

## Related Files

- [commonUtils.js](./commonUtils.md)
- [models/index.cjs](../../../models/index.cjs)

---