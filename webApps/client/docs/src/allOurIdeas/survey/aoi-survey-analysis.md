# AoiSurveyAnalysis

A web component for rendering the analysis of survey data within a group, including streaming analysis components for each analysis type configured in the EARL (Experience API Reporting Language) data.

## Properties

| Name       | Type          | Description                                           |
|------------|---------------|-------------------------------------------------------|
| groupId    | number        | The unique identifier for the group.                  |
| group      | YpGroupData   | The group data object.                                |
| question   | AoiQuestionData | The question data object related to the survey.     |
| earl       | AoiEarlData   | The EARL data object containing analysis configuration. |

## Methods

| Name                    | Parameters                                             | Return Type | Description                                                                 |
|-------------------------|--------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback       | -                                                      | void        | Lifecycle method that runs when the component is added to the DOM.          |
| disconnectedCallback    | -                                                      | void        | Lifecycle method that runs when the component is removed from the DOM.      |
| renderStreamingAnalysis | -                                                      | TemplateResult | Renders the streaming analysis components based on the EARL configuration. |
| updated                 | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method that runs when the component's properties have changed.    |
| renderAnalysis          | -                                                      | TemplateResult | Renders the analysis components based on the EARL configuration.           |
| render                  | -                                                      | TemplateResult | Renders the component's HTML template.                                     |

## Events

- No custom events are emitted by this component.

## Examples

```typescript
// Example usage of the AoiSurveyAnalysis web component
<aoi-survey-analysis
  .groupId=${123}
  .group=${groupData}
  .question=${questionData}
  .earl=${earlData}
></aoi-survey-analysis>
```

Please note that the actual usage would require you to provide the appropriate data objects (`groupData`, `questionData`, `earlData`) that conform to the expected types (`YpGroupData`, `AoiQuestionData`, `AoiEarlData`).