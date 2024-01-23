# YpCollectionItemsGrid

A custom element that displays a grid or list of collection items using virtualization for performance.

## Properties

| Name                  | Type                             | Description                                                                 |
|-----------------------|----------------------------------|-----------------------------------------------------------------------------|
| collection            | YpCollectionData \| undefined    | The collection data object.                                                 |
| collectionItems       | Array\<YpCollectionData> \| undefined | An array of collection items.                                               |
| collectionItemType    | string                           | The type of collection items, e.g., 'community', 'group', or 'post'.       |
| sortedCollectionItems | Array\<YpCollectionData> \| undefined | An array of sorted collection items.                                        |
| grid                  | boolean                          | A flag indicating whether to display items in a grid layout.                |
| resetListSize         | Function \| undefined            | A function to reset the size of the list.                                   |
| skipIronListWidth     | boolean                          | A flag to skip setting the width of the iron list.                          |

## Methods

| Name                | Parameters                        | Return Type | Description                                                                 |
|---------------------|-----------------------------------|-------------|-----------------------------------------------------------------------------|
| renderItem          | item: YpCollectionData, index: number | TemplateResult | Renders a single collection item card.                                      |
| pluralItemType      |                                   | string      | Returns the plural form of the collection item type.                        |
| _keypress           | event: KeyboardEvent              | void        | Handles keypress events, specifically for the 'Enter' key to select an item.|
| refresh             |                                   | Promise<void> | Refreshes the collection items grid.                                        |
| firstUpdated        | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle callback for when the element is first updated.                  |
| connectedCallback   |                                   | Promise<void> | Lifecycle callback for when the element is connected to the DOM.            |
| disconnectedCallback|                                   | void        | Lifecycle callback for when the element is disconnected from the DOM.       |
| _selectedItemChanged| event: CustomEvent                | void        | Handles the selection of an item.                                           |
| scrollToItem        | item: YpDatabaseItem \| undefined | void        | Scrolls to a specific item in the collection.                               |

## Events (if any)

- **yp-refresh-activities-scroll-threshold**: Emitted when the scroll threshold for activities needs to be refreshed.

## Examples

```typescript
// Example usage of the YpCollectionItemsGrid element
<yp-collection-items-grid
  .collection="${this.collection}"
  .collectionItems="${this.collectionItems}"
  collectionItemType="community"
  grid="${this.isGridView}">
</yp-collection-items-grid>
```

Note: The above example assumes `this.collection`, `this.collectionItems`, and `this.isGridView` are defined in the context where this element is used.