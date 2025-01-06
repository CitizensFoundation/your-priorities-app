# YpCollectionItemsList

The `YpCollectionItemsList` class is a custom web component that extends `YpBaseElement`. It is designed to display a list of collection items, such as communities, groups, or posts, using a virtualized list for efficient rendering.

## Properties

| Name                   | Type                              | Description                                                                 |
|------------------------|-----------------------------------|-----------------------------------------------------------------------------|
| collection             | YpCollectionData \| undefined     | The collection data object.                                                 |
| collectionItems        | Array<YpCollectionData> \| undefined | An array of collection items to be displayed.                               |
| collectionItemType     | string                            | The type of collection item (e.g., "community", "group", "post").           |
| sortedCollectionItems  | Array<YpCollectionData> \| undefined | An array of sorted collection items.                                        |
| grid                   | boolean                           | Determines if the items should be displayed in a grid layout.               |
| useEvenOddItemLayout   | boolean                           | Determines if an even-odd item layout should be used.                       |
| resetListSize          | Function \| undefined             | A function to reset the list size.                                          |
| skipIronListWidth      | boolean                           | Determines if the iron list width should be skipped.                        |

## Methods

| Name                    | Parameters                                                                 | Return Type   | Description                                                                 |
|-------------------------|----------------------------------------------------------------------------|---------------|-----------------------------------------------------------------------------|
| render                  | None                                                                       | TemplateResult | Renders the component's template.                                           |
| renderItem              | item: YpCollectionData, index: number                                      | TemplateResult | Renders an individual item in the list.                                     |
| pluralItemType          | None                                                                       | string        | Returns the plural form of the collection item type.                        |
| _keypress               | event: KeyboardEvent                                                       | void          | Handles keypress events for item selection.                                 |
| refresh                 | None                                                                       | Promise<void> | Refreshes the component.                                                    |
| firstUpdated            | changedProperties: Map<string \| number \| symbol, unknown>                | void          | Lifecycle method called after the first update.                             |
| connectedCallback       | None                                                                       | Promise<void> | Lifecycle method called when the component is added to the document.        |
| disconnectedCallback    | None                                                                       | void          | Lifecycle method called when the component is removed from the document.    |
| _selectedItemChanged    | event: CustomEvent                                                         | void          | Handles item selection changes.                                             |
| scrollToItem            | item: YpDatabaseItem \| undefined                                          | void          | Scrolls to a specific item in the list.                                     |

## Examples

```typescript
// Example usage of the YpCollectionItemsList component
import './yp-collection-items-list.js';

const collectionItemsList = document.createElement('yp-collection-items-list');
collectionItemsList.collectionItemType = 'community';
collectionItemsList.collectionItems = [
  { id: '1', name: 'Community 1' },
  { id: '2', name: 'Community 2' }
];
document.body.appendChild(collectionItemsList);
```

This component uses the `lit-virtualizer` for efficient rendering of large lists and supports both flow and grid layouts. It also provides methods for handling item selection and scrolling to specific items.