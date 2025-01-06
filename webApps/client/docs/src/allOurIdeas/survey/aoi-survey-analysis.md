# AoiSurveyAnalysis

The `AoiSurveyAnalysis` class is a custom web component that extends `YpBaseElement`. It is designed to handle and render survey analysis data, utilizing various properties and methods to manage the analysis process.

## Properties

| Name     | Type           | Description                                      |
|----------|----------------|--------------------------------------------------|
| groupId  | number         | The ID of the group associated with the analysis.|
| group    | YpGroupData    | The group data object containing group details.  |
| question | AoiQuestionData| The question data object related to the analysis.|
| earl     | AoiEarlData    | The earl data object containing configuration and analysis details.|

## Methods

| Name                   | Parameters                                      | Return Type | Description                                                                 |
|------------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback      | None                                            | Promise<void>| Called when the element is added to the document's DOM. Logs activity start.|
| disconnectedCallback   | None                                            | void        | Called when the element is removed from the document's DOM. Logs activity end.|
| renderStreamingAnalysis| None                                            | TemplateResult | Renders the streaming analysis components based on the earl configuration.  |
| updated                | changedProperties: Map<string | number | symbol, unknown> | void        | Called when the element's properties change.                                |
| renderAnalysis         | None                                            | TemplateResult | Renders the analysis components based on the earl configuration.            |
| render                 | None                                            | TemplateResult | Renders the main template of the component, including analysis information. |

## Examples

```typescript
// Example usage of the AoiSurveyAnalysis component
import './aoi-survey-analysis.js';

const surveyAnalysis = document.createElement('aoi-survey-analysis');
surveyAnalysis.groupId = 1;
surveyAnalysis.group = { id: 1, language: 'en' }; // Example group data
surveyAnalysis.question = { id: 1, name: 'Sample Question' }; // Example question data
surveyAnalysis.earl = { configuration: { analysis_config: { analyses: [] } } }; // Example earl data

document.body.appendChild(surveyAnalysis);
```

This component is styled using a combination of shared styles and specific CSS rules defined within the class. It also utilizes other components such as `aoi-streaming-analysis` and `yp-magic-text` to display analysis results and question details.