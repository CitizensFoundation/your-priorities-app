# YpCollectionItemCard

A custom element that represents a card for a collection item, which can be a group, community, or other types of collections. It displays the collection's logo, name, description, and stats, and can handle different statuses like archived or featured.

## Properties

| Name        | Type                  | Description                                                                 |
|-------------|-----------------------|-----------------------------------------------------------------------------|
| item        | YpCollectionData      | The collection item data.                                                   |
| itemType    | string                | The type of the collection item (e.g., 'group', 'community').               |
| collection  | YpCollectionData      | The parent collection data of the item.                                     |

## Methods

| Name                  | Parameters            | Return Type | Description                                                                 |
|-----------------------|-----------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback     | none                  | void        | Lifecycle method that runs when the element is added to the DOM.            |
| goToItem              | event: CustomEvent    | void        | Navigates to the item's detail page when the card is clicked.               |
| _setupFontNameFontSize| none                  | void        | Sets up the font size for the collection name based on the screen width.    |
| updated               | changedProperties: Map| void        | Lifecycle method that runs when the element's properties have been updated. |
| renderLogoImage       | none                  | TemplateResult | Renders the logo image of the collection item.                            |
| renderDataViz         | none                  | TemplateResult | Renders the data visualization for the collection item if available.       |
| renderCardInfo        | none                  | TemplateResult | Renders the information section of the card.                               |
| render                | none                  | TemplateResult | Renders the entire card element.                                           |

## Events (if any)

- **None**

## Examples

```typescript
// Example usage of the YpCollectionItemCard
<yp-collection-item-card
  .item=${myCollectionItem}
  .itemType=${'group'}
  .collection=${myParentCollection}
></yp-collection-item-card>
```

Please note that the actual usage may require additional setup for properties and handling of events, which is not shown in this simple example.