# AoiSurveyResults

The `AoiSurveyResults` class is a custom web component that displays survey results for a given question. It allows users to view results, toggle score visibility, and export results to a CSV file.

## Properties

| Name       | Type                | Description                                                                 |
|------------|---------------------|-----------------------------------------------------------------------------|
| results    | AoiChoiceData[]     | An array of survey results data.                                            |
| question   | AoiQuestionData     | The question data associated with the survey results.                       |
| earl       | AoiEarlData         | Configuration data for the survey results display.                          |
| group      | YpGroupData         | Group data associated with the survey.                                      |
| groupId    | number              | The ID of the group associated with the survey.                             |
| showScores | boolean             | A flag indicating whether to show scores in the results. Defaults to false. |

## Methods

| Name          | Parameters | Return Type | Description                                                                 |
|---------------|------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback | None       | Promise<void> | Lifecycle method called when the element is added to the document. Logs activity. |
| fetchResults  | None       | Promise<void> | Fetches survey results from the server based on the current group and question. |
| updated       | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method called when properties are updated. Fetches results if `earl` changes. |
| disconnectedCallback | None       | void        | Lifecycle method called when the element is removed from the document. Logs activity. |
| toggleScores  | None       | void        | Toggles the visibility of scores in the survey results. Logs activity.       |
| exportToCSV   | None       | void        | Exports the survey results to a CSV file and triggers a download. Logs activity. |

## Examples

```typescript
// Example usage of the aoi-survey-results web component
import './path/to/aoi-survey-results.js';

const surveyResultsElement = document.createElement('aoi-survey-results');
surveyResultsElement.groupId = 123;
surveyResultsElement.question = {
  id: 456,
  name: "Sample Question",
  votes_count: 100
};
surveyResultsElement.earl = {
  configuration: {
    minimum_ten_votes_to_show_results: true
  }
};
document.body.appendChild(surveyResultsElement);
```