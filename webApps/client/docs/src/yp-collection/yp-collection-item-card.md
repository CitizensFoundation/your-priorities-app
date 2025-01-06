# YpCollectionItemCard

The `YpCollectionItemCard` is a custom web component that extends `YpBaseElement`. It is designed to display a card representation of a collection item, which can be a group, community, or domain. The card includes various details such as the item's name, description, type, and statistics.

## Properties

| Name                | Type                      | Description                                                                 |
|---------------------|---------------------------|-----------------------------------------------------------------------------|
| `item`              | `YpCollectionData \| undefined` | The data object representing the collection item.                           |
| `itemType`          | `string \| undefined`     | The type of the item, which can be "group", "community", or "domain".       |
| `collection`        | `YpCollectionData \| undefined` | The collection data associated with the item.                               |
| `useEvenOddItemLayout` | `boolean`              | Determines if the card should use an even-odd layout. Default is `false`.   |
| `index`             | `number`                  | The index of the item in the collection, used to determine layout styling.  |

## Methods

| Name                   | Parameters                                      | Return Type | Description                                                                 |
|------------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| `isEvenIndex`          | None                                            | `boolean`   | Returns `true` if the index is even, otherwise `false`.                     |
| `archived`             | None                                            | `boolean`   | Returns `true` if the item status is "archived".                            |
| `featured`             | None                                            | `boolean`   | Returns `true` if the item status is "featured".                            |
| `connectedCallback`    | None                                            | `void`      | Lifecycle method called when the element is added to the document.          |
| `groupTypeName`        | None                                            | `string`    | Returns the name of the group type based on the item's configuration.       |
| `goToItem`             | `event: CustomEvent`                            | `void`      | Navigates to the item's URL when the card is clicked.                       |
| `_setupFontNameFontSize` | None                                          | `void`      | Deprecated method for setting up font name and size.                        |
| `isGroupFolder`        | None                                            | `boolean`   | Returns `true` if the collection is a group folder.                         |
| `collectionItemCount`  | None                                            | `number`    | Returns the count of items in the collection based on its type.             |
| `updated`              | `changedProperties: Map<string \| number \| symbol, unknown>` | `void`      | Lifecycle method called when properties are updated.                        |
| `renderLogoImage`      | None                                            | `TemplateResult` | Renders the logo image for the collection item.                             |
| `renderDataViz`        | None                                            | `TemplateResult` | Renders the data visualization component for the item.                      |
| `renderCollectionType` | None                                            | `TemplateResult` | Renders the type of the collection if applicable.                           |
| `renderCollectionName` | None                                            | `TemplateResult` | Renders the name of the collection item.                                    |
| `renderCollectionDescription` | None                                    | `TemplateResult` | Renders the description of the collection item.                             |
| `renderMembershipButton` | None                                         | `TemplateResult` | Renders the membership button if applicable.                                |
| `renderCollectionStats` | None                                          | `TemplateResult` | Renders the statistics of the collection item.                              |
| `renderCardInfo`       | None                                            | `TemplateResult` | Renders the main content of the card including image and text.              |
| `statsCollection`      | None                                            | `YpCollectionData` | Returns the collection data used for statistics.                            |
| `statsCollectionType`  | None                                            | `string`    | Returns the type of the collection used for statistics.                     |
| `contentDescription`   | None                                            | `string`    | Returns the description of the content based on the item type.              |
| `contentName`          | None                                            | `string`    | Returns the name of the content based on the item type.                     |
| `contentId`            | None                                            | `string`    | Returns the ID of the content based on the item type.                       |
| `contentLanguage`      | None                                            | `string`    | Returns the language of the content based on the item type.                 |
| `contentUrlBase`       | None                                            | `string`    | Returns the base URL for the content based on the item type.                |
| `render`               | None                                            | `TemplateResult` | Renders the entire card component.                                          |

## Examples

```typescript
// Example usage of the YpCollectionItemCard component
import './yp-collection-item-card.js';

const card = document.createElement('yp-collection-item-card');
card.item = { /* YpCollectionData object */ };
card.itemType = 'group';
document.body.appendChild(card);
```