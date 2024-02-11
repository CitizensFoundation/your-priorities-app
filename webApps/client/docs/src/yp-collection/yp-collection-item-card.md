# YpCollectionItemCard

A custom element that represents a card for a collection item, which can be a group, community, or other types of collections. It displays the collection's logo, name, description, and stats, and can handle different statuses like archived or featured.

## Properties

| Name        | Type                  | Description                                                                 |
|-------------|-----------------------|-----------------------------------------------------------------------------|
| item        | YpCollectionData      | The collection item data.                                                   |
| itemType    | string                | The type of the collection item (e.g., 'group', 'community').               |
| collection  | YpCollectionData      | The parent collection data of the item.                                     |

## Methods

| Name            | Parameters           | Return Type | Description                                                                 |
|-----------------|----------------------|-------------|-----------------------------------------------------------------------------|
| goToItem        | event: CustomEvent   | void        | Navigates to the collection item when clicked.                              |
| _setupFontNameFontSize | none             | void        | Sets up the font size for the collection name based on the screen width.    |
| renderLogoImage | none                 | TemplateResult | Renders the logo image of the collection item.                             |
| renderDataViz   | none                 | TemplateResult | Renders the data visualization for the collection item if available.       |
| renderCardInfo  | none                 | TemplateResult | Renders the information section of the card including name and description.|

## Events (if any)

- **None**

## Examples

```typescript
// Example usage of the YpCollectionItemCard custom element
<yp-collection-item-card
  .item=${collectionItemData}
  .itemType=${'group'}
  .collection=${parentCollectionData}
></yp-collection-item-card>
```

Please note that the actual usage may vary depending on the context in which the `YpCollectionItemCard` element is used, and the properties may need to be bound differently in a real-world application.