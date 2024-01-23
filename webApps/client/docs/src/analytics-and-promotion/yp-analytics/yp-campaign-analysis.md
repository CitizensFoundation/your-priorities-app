# YpCampaignAnalysis

`YpCampaignAnalysis` is a custom web component that extends `YpCampaign` and is used for rendering campaign analytics data. It provides a detailed view of the campaign's mediums and their respective top statistics.

## Properties

| Name          | Type                             | Description               |
|---------------|----------------------------------|---------------------------|
| orderedMedium | YpCampaignAnalyticsMediumData[] | Sorted array of campaign mediums based on their top statistics value. |

## Methods

| Name                | Parameters                                | Return Type | Description                 |
|---------------------|-------------------------------------------|-------------|-----------------------------|
| renderMediumTopStats| medium: YpCampaignAnalyticsMediumData     | TemplateResult | Renders the top statistics for a given medium. |
| renderMedium        | medium: YpCampaignAnalyticsMediumData     | TemplateResult | Renders a medium card with its image and top statistics. |
| render              |                                           | TemplateResult | Renders the main container with campaign name and mediums. |

## Events

- No custom events are emitted by this component.

## Examples

```typescript
// Example usage of the YpCampaignAnalysis component
<yp-campaign-analysis></yp-campaign-analysis>
```

Note: The `YpCampaignAnalyticsMediumData` type is assumed to be an interface or type that contains the necessary data for a campaign medium, including `topStats`, `utm_medium`, and an `active` state. This type is not defined within the provided code snippet, so its exact structure is not documented here.