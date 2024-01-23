# YpPromotionDashboard

The `YpPromotionDashboard` class extends `PlausibleDashboard` and is responsible for rendering the promotion dashboard with real-time or historical data based on the Plausible analytics for a specific site. It fetches the Plausible site name and sets up the dashboard configuration.

## Properties

| Name              | Type                        | Description                                                                 |
|-------------------|-----------------------------|-----------------------------------------------------------------------------|
| plausibleSiteName | string \| undefined         | The name of the Plausible site to display analytics for.                    |
| collection        | YpCollectionData            | The data for the collection that the dashboard is displaying analytics for. |
| collectionType    | string                      | The type of collection (e.g., 'community', 'project').                      |
| collectionId      | number \| string            | The ID of the collection.                                                   |
| useCommunityId    | number \| undefined         | An optional community ID to filter analytics by a specific community.       |

## Methods

| Name              | Parameters | Return Type | Description                                                                                   |
|-------------------|------------|-------------|-----------------------------------------------------------------------------------------------|
| connectedCallback |            | void        | Overrides the lifecycle callback to fetch the Plausible site name and initialize the dashboard. |
| render            |            | TemplateResult \| typeof nothing | Overrides the render method to display the appropriate dashboard based on the query period. |

## Events

- No custom events are emitted by this class.

## Examples

```typescript
// Example usage of YpPromotionDashboard
<yp-promotion-dashboard
  .plausibleSiteName="${'example.com'}"
  .collection="${collectionData}"
  .collectionType="${'community'}"
  .collectionId="${123}"
  .useCommunityId="${456}"
></yp-promotion-dashboard>
```

Please note that `YpCollectionData` and `TemplateResult` are types that should be defined elsewhere in your codebase, and `nothing` is a special value from the `lit` library used to render nothing.