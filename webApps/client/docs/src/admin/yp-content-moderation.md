# YpContentModeration

The `YpContentModeration` class is a custom web component that extends `YpBaseElement`. It provides a user interface for moderating content items, such as posts and points, within a group, community, domain, or user context. The component includes features for sorting, filtering, and performing actions on selected content items.

## Properties

| Name                    | Type                                                                 | Description                                                                 |
|-------------------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------|
| `multiSortEnabled`      | `boolean`                                                            | Indicates if multi-sort is enabled for the grid.                            |
| `opened`                | `boolean`                                                            | Indicates if the component is opened.                                       |
| `showReload`            | `boolean`                                                            | Indicates if the reload button should be shown.                             |
| `forceSpinner`          | `boolean`                                                            | Forces the display of a loading spinner.                                    |
| `selectedItemsEmpty`    | `boolean`                                                            | Indicates if there are no selected items.                                   |
| `items`                 | `Array<YpModerationItem> \| undefined`                               | The list of moderation items to display.                                    |
| `selectedItems`         | `Array<YpModerationItem> \| undefined`                               | The list of currently selected moderation items.                            |
| `headerText`            | `string \| undefined`                                                | The text to display in the header.                                          |
| `groupId`               | `number \| undefined`                                                | The ID of the group being moderated.                                        |
| `communityId`           | `number \| undefined`                                                | The ID of the community being moderated.                                    |
| `domainId`              | `number \| undefined`                                                | The ID of the domain being moderated.                                       |
| `userId`                | `number \| undefined`                                                | The ID of the user being moderated.                                         |
| `selected`              | `YpDatabaseItem \| undefined`                                        | The currently selected database item.                                       |
| `modelType`             | `string \| undefined`                                                | The type of model being moderated (e.g., groups, communities).              |
| `selectedItemsCount`    | `number`                                                             | The count of selected items.                                                |
| `selectedItemIdsAndType`| `Array<SelectedItemIdsAndType> \| undefined`                         | The IDs and types of selected items.                                        |
| `selectedItemId`        | `number \| undefined`                                                | The ID of the selected item.                                                |
| `selectedModelClass`    | `string \| undefined \| null`                                        | The class of the selected model.                                            |
| `collectionName`        | `string \| undefined`                                                | The name of the collection being moderated.                                 |
| `itemsCountText`        | `string \| undefined`                                                | The text to display for the item count.                                     |
| `resizeTimeout`         | `any \| undefined`                                                   | Timeout for resizing operations.                                            |
| `typeOfModeration`      | `"moderate_all_content" \| "flagged_content"`                        | The type of moderation being performed.                                     |
| `activeItem`            | `YpDatabaseItem \| undefined`                                        | The currently active item in the grid.                                      |
| `allowGridEventsAfterMenuOpen` | `boolean`                                                     | Allows grid events after a menu is opened.                                  |

## Methods

| Name                        | Parameters                                                                 | Return Type | Description                                                                 |
|-----------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| `updated`                   | `changedProperties: Map<string \| number \| symbol, unknown>`              | `void`      | Called when the component is updated.                                       |
| `renderContent`             | `root: HTMLElement, column: any, rowData: RowData`                         | `void`      | Renders the content for a grid cell.                                        |
| `renderItemDetail`          | `root: HTMLElement, column: any, rowData: RowData`                         | `void`      | Renders the details for a grid row.                                         |
| `renderActionHeader`        | `root: HTMLElement, column?: GridColumnElement \| undefined`               | `void`      | Renders the action header for the grid.                                     |
| `renderAction`              | `root: HTMLElement, column: any, rowData: RowData`                         | `void`      | Renders the action menu for a grid cell.                                    |
| `render`                    | `none`                                                                     | `TemplateResult` | Renders the component's template.                                           |
| `spinnerActive`             | `none`                                                                     | `boolean`   | Returns whether the spinner is active.                                      |
| `_ajaxError`                | `error: any \| undefined`                                                  | `void`      | Handles AJAX errors.                                                        |
| `_reload`                   | `none`                                                                     | `Promise<void>` | Reloads the data.                                                           |
| `_masterRequest`            | `action: string, itemIdsAndType: Array<SelectedItemIdsAndType> \| undefined` | `Promise<void>` | Sends a master request for an action on items.                              |
| `_generateRequest`          | `id: number`                                                               | `Promise<void>` | Generates a request for items based on an ID.                               |
| `_itemsResponse`            | `items: Array<YpModerationItem>`                                           | `void`      | Handles the response for items.                                             |
| `onlyFlaggedItems`          | `none`                                                                     | `boolean`   | Returns whether only flagged items are being moderated.                     |
| `_manyItemsResponse`        | `none`                                                                     | `void`      | Handles the response for many items.                                        |
| `_singleItemResponse`       | `none`                                                                     | `void`      | Handles the response for a single item.                                     |
| `_menuSelection`            | `none`                                                                     | `void`      | Handles menu selection events.                                              |
| `_reallyAnonymize`          | `none`                                                                     | `Promise<void>` | Anonymizes the selected items.                                              |
| `_reallyAnonymizeSelected`  | `none`                                                                     | `Promise<void>` | Anonymizes the selected items.                                              |
| `_reallyDelete`             | `none`                                                                     | `Promise<void>` | Deletes the selected items.                                                 |
| `_reallyDeleteSelected`     | `none`                                                                     | `Promise<void>` | Deletes the selected items.                                                 |
| `_approve`                  | `event: CustomEvent`                                                       | `Promise<void>` | Approves a content item.                                                    |
| `_approveSelected`          | `event: CustomEvent`                                                       | `Promise<void>` | Approves selected content items.                                            |
| `_block`                    | `event: CustomEvent`                                                       | `Promise<void>` | Blocks a content item.                                                      |
| `_blockSelected`            | `event: CustomEvent`                                                       | `Promise<void>` | Blocks selected content items.                                              |
| `_clearFlags`               | `event: CustomEvent`                                                       | `Promise<void>` | Clears flags from a content item.                                           |
| `_clearSelectedFlags`       | `event: CustomEvent`                                                       | `Promise<void>` | Clears flags from selected content items.                                   |
| `_refreshAfterChange`       | `none`                                                                     | `Promise<void>` | Refreshes the component after a change.                                     |
| `_domainIdChanged`          | `none`                                                                     | `void`      | Handles changes to the domain ID.                                           |
| `_groupIdChanged`           | `none`                                                                     | `void`      | Handles changes to the group ID.                                            |
| `_communityIdChanged`       | `none`                                                                     | `void`      | Handles changes to the community ID.                                        |
| `_userIdChanged`            | `none`                                                                     | `void`      | Handles changes to the user ID.                                             |
| `_getType`                  | `type: string`                                                             | `string`    | Returns the translated type of a content item.                              |
| `_activeItemChanged`        | `item: YpDatabaseItem \| undefined, oldItem: YpDatabaseItem \| undefined`  | `void`      | Handles changes to the active item.                                         |
| `_refreshGridAsync`         | `none`                                                                     | `void`      | Refreshes the grid asynchronously.                                          |
| `_refreshGridAsyncDelay`    | `none`                                                                     | `void`      | Refreshes the grid asynchronously with a delay.                             |
| `_refreshGridAsyncBase`     | `ms: number`                                                               | `void`      | Base method for refreshing the grid asynchronously.                         |
| `connectedCallback`         | `none`                                                                     | `void`      | Called when the component is added to the document.                         |
| `firstUpdated`              | `_changedProperties: PropertyValueMap<any> \| Map<PropertyKey, unknown>`   | `void`      | Called after the component's first update.                                  |
| `_toPercent`                | `number: number \| undefined`                                              | `string \| null` | Converts a number to a percentage string.                                   |
| `_resizeThrottler`          | `none`                                                                     | `void`      | Throttles resize events.                                                    |
| `_setGridSize`              | `none`                                                                     | `void`      | Sets the size of the grid based on the window size.                         |
| `totalItemsCount`           | `none`                                                                     | `string \| null` | Returns the total count of items as a formatted string.                     |
| `_selectedItemsChanged`     | `none`                                                                     | `void`      | Handles changes to the selected items.                                      |
| `_setupItemIdFromEvent`     | `event: CustomEvent`                                                       | `void`      | Sets up the selected item ID from an event.                                 |
| `_deleteSelected`           | `event: CustomEvent`                                                       | `void`      | Deletes selected content items after confirmation.                          |
| `_delete`                   | `event: CustomEvent`                                                       | `void`      | Deletes a content item after confirmation.                                  |
| `_anonymizeSelected`        | `event: CustomEvent`                                                       | `void`      | Anonymizes selected content items after confirmation.                       |
| `_anonymize`                | `event: CustomEvent`                                                       | `void`      | Anonymizes a content item after confirmation.                               |
| `_menuOpened`               | `none`                                                                     | `void`      | Handles the event when a menu is opened.                                    |
| `_setSelected`              | `event: CustomEvent`                                                       | `void`      | Sets the selected item based on an event.                                   |
| `_findItemFromId`           | `id: number`                                                               | `YpModerationItem \| undefined` | Finds an item by its ID.                                                    |
| `setup`                     | `groupId: number \| undefined, communityId: number \| undefined, domainId: number \| undefined, typeOfModeration: "flagged_content" \| "moderate_all_content" \| undefined, userId: number \| undefined` | `void` | Sets up the component with the given parameters.                            |
| `open`                      | `name: string`                                                             | `void`      | Opens the component with the given collection name.                         |
| `_reset`                    | `none`                                                                     | `void`      | Resets the component's state.                                               |
| `_resetSelectedAndClearCache` | `none`                                                                   | `void`      | Resets the selected items and clears the grid cache.                        |
| `_setupHeaderText`          | `none`                                                                     | `void`      | Sets up the header text based on the current context.                       |

## Examples

```typescript
// Example usage of the YpContentModeration component
const moderationComponent = document.createElement('yp-content-moderation');
moderationComponent.setup(1, undefined, undefined, "flagged_content", undefined);
document.body.appendChild(moderationComponent);
```