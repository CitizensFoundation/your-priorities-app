# YpRealtime

`YpRealtime` is a custom web component that extends `PlausibleRealtime` to provide real-time analytics for a specific collection. It includes various sub-components to display filters, date pickers, visitor graphs, campaigns analytics, goal graphs, sources lists, pages, locations, and devices related to the collection's analytics data.

## Properties

| Name            | Type                | Description                                           |
|-----------------|---------------------|-------------------------------------------------------|
| collection      | YpCollectionData    | The data object representing the collection.          |
| collectionType  | string              | The type of the collection (e.g., 'post', 'user').    |
| collectionId    | number              | The unique identifier for the collection.             |

## Methods

| Name       | Parameters        | Return Type | Description                 |
|------------|-------------------|-------------|-----------------------------|
| constructor | none             | none        | Initializes the component with default values and highlighted goals. |
| render     | none             | TemplateResult | Generates the HTML template for the component, including all sub-components and their interactions. |

## Events

- **exit-to-app**: Emitted when the user clicks the close button to exit the app.

## Examples

```typescript
// Example usage of the YpRealtime component
<yp-realtime
  .collection="${yourCollectionData}"
  collectionType="post"
  collectionId={123}
></yp-realtime>
```

Please note that the actual usage may require additional setup for properties like `site`, `query`, `history`, `proxyUrl`, `proxyFaviconBaseUrl`, and `timer`, which are used by the sub-components within `YpRealtime`.