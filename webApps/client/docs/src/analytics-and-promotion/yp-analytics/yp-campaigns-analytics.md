# YpCampaignsAnalytics

`YpCampaignsAnalytics` is a custom web component that extends `PlausibleBaseElementWithState` to display analytics for campaigns associated with a collection. It fetches campaign data and related statistics, and renders individual campaign analysis components.

## Properties

| Name           | Type                          | Description                                                                 |
|----------------|-------------------------------|-----------------------------------------------------------------------------|
| collectionType | `String`                      | The type of the collection to which the campaigns belong.                   |
| collectionId   | `Number`                      | The identifier of the collection to which the campaigns belong.             |
| collection     | `YpCollectionData` \| `undefined` | The collection data object.                                                 |
| campaigns      | `YpCampaignAnalyticsData[]` \| `undefined` | An array of campaign analytics data.                                        |
| foundCampaigns | `YpCampaignAnalyticsData[]` \| `undefined` | An array of found campaign analytics data based on the current query.       |
| noData         | `Boolean`                     | A flag indicating whether there is no data available for the campaigns.     |

## Methods

| Name            | Parameters | Return Type | Description                                                                                   |
|-----------------|------------|-------------|-----------------------------------------------------------------------------------------------|
| connectedCallback | None       | `void`      | Lifecycle method that runs when the component is inserted into the DOM. Sets up a timer tick. |
| updated         | `changedProperties: Map<string \| number \| symbol, unknown>` | `void` | Lifecycle method that runs when the component's properties change.                            |
| getCampaigns    | None       | `Promise<void>` | Fetches campaign data and updates the component's state.                                       |
| getSourceData   | `campaign: YpCampaignAnalyticsData`, `utmMediums: any` | `Promise<YpCampaignAnalyticsData>` | Fetches source data for a given campaign.                                                      |
| renderCampaign  | `campaign: YpCampaignAnalyticsData` | `TemplateResult` | Renders a single campaign analysis component.                                                  |
| render          | None       | `TemplateResult` | Renders the component's HTML template.                                                         |

## Events

- No custom events are emitted by this component.

## Examples

```typescript
// Example usage of the YpCampaignsAnalytics component
<yp-campaigns-analytics
  collectionType="someType"
  collectionId={123}
  .collection=${someCollectionData}
></yp-campaigns-analytics>
```

Please note that the above example assumes that `someCollectionData` is an instance of `YpCollectionData` and is available in the context where the component is used.