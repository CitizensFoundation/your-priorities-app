# AoiSurveyResults

A custom element that displays the results of an Area of Interest (AOI) survey. It includes functionality to fetch results, toggle score visibility, and export results to CSV.

## Properties

| Name        | Type                  | Description                                      |
|-------------|-----------------------|--------------------------------------------------|
| results     | AoiChoiceData[]       | The results data for the survey.                 |
| question    | AoiQuestionData       | The question data related to the survey.         |
| earl        | AoiEarlData           | Data related to the earl.                        |
| group       | YpGroupData           | Data related to the group.                       |
| groupId     | number                | The ID of the group.                             |
| showScores  | boolean               | Flag to show or hide the scores in the results.  |

## Methods

| Name                  | Parameters | Return Type | Description                                      |
|-----------------------|------------|-------------|--------------------------------------------------|
| connectedCallback     | -          | void        | Lifecycle method that runs when element is added to the DOM. |
| fetchResults          | -          | Promise<void> | Fetches the results from the server.            |
| updated               | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method that runs when properties change. |
| disconnectedCallback  | -          | void        | Lifecycle method that runs when element is removed from the DOM. |
| toggleScores          | -          | void        | Toggles the visibility of the scores.           |
| exportToCSV           | -          | void        | Exports the survey results to a CSV file.       |
| renderRow             | index: number, result: AoiChoiceData | TemplateResult | Renders a single row of survey results. |
| render                | -          | TemplateResult | Renders the component.                         |

## Events

- **None**

## Examples

```typescript
// Example usage of the AoiSurveyResults custom element
<aoi-survey-results
  .results=${surveyResults}
  .question=${surveyQuestion}
  .earl=${earlData}
  .group=${groupData}
  .groupId=${groupId}
  showScores=${true}
></aoi-survey-results>
```

Please note that the actual usage may vary depending on the context within which the component is used, including how the properties are set and managed.