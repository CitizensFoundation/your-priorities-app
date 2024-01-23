# YpHistorical

YpHistorical is a custom web component that extends PlausibleHistorical, providing a detailed view of historical data for a specific collection. It includes various sub-components to display statistics, graphs, and analytics related to the collection.

## Properties

| Name           | Type              | Description                                           |
|----------------|-------------------|-------------------------------------------------------|
| collection     | YpCollectionData  | The data object representing the collection.          |
| collectionType | String            | The type of the collection (e.g., 'post', 'user').    |
| collectionId   | Number            | The unique identifier for the collection.             |

## Methods

| Name    | Parameters | Return Type | Description |
|---------|------------|-------------|-------------|
| render  | -          | TemplateResult | Generates the template for the component. |

## Events

- **exit-to-app**: Emitted when the user clicks the close button to exit the app.

## Examples

```typescript
// Example usage of the YpHistorical component
<yp-historical
  .collection=${yourCollectionData}
  .collectionType=${"yourCollectionType"}
  .collectionId=${yourCollectionId}
></yp-historical>
```

Note: Replace `yourCollectionData`, `yourCollectionType`, and `yourCollectionId` with the actual data for the collection you want to display historical information for.