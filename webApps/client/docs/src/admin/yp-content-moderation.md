# YpContentModeration

The `YpContentModeration` class extends `YpBaseElement` and is responsible for rendering and managing content moderation features within a web application. It allows users to moderate content based on various criteria such as group, community, domain, or user-specific content. It provides functionalities like approving, blocking, deleting, anonymizing content, and clearing flags.

## Properties

| Name                     | Type                                                      | Description                                                                 |
|--------------------------|-----------------------------------------------------------|-----------------------------------------------------------------------------|
| multiSortEnabled         | Boolean                                                   | Indicates if multi-sorting is enabled on the grid.                           |
| opened                   | Boolean                                                   | Indicates if the moderation panel is open.                                   |
| showReload               | Boolean                                                   | Determines whether to show the reload button.                                |
| forceSpinner             | Boolean                                                   | Forces the spinner to be active, indicating a loading state.                 |
| selectedItemsEmpty       | Boolean                                                   | Indicates if the selected items list is empty.                               |
| items                    | Array<YpModerationItem> \| undefined                      | The list of items to be moderated.                                           |
| selectedItems            | Array<YpModerationItem> \| undefined                      | The list of currently selected items for batch actions.                      |
| headerText               | String \| undefined                                       | The text displayed in the header of the moderation panel.                    |
| groupId                  | Number \| undefined                                       | The ID of the group for which content is being moderated.                    |
| communityId              | Number \| undefined                                       | The ID of the community for which content is being moderated.                |
| domainId                 | Number \| undefined                                       | The ID of the domain for which content is being moderated.                   |
| userId                   | Number \| undefined                                       | The ID of the user whose content is being moderated.                         |
| selected                 | YpDatabaseItem \| undefined                               | The currently selected item in the grid.                                     |
| modelType                | String \| undefined                                       | The type of model being moderated (e.g., groups, communities, domains, users). |
| selectedItemsCount       | Number                                                    | The count of currently selected items.                                       |
| selectedItemIdsAndType   | Array<SelectedItemIdsAndType> \| undefined                | The list of selected item IDs and their corresponding model types.           |
| selectedItemId           | Number \| undefined                                       | The ID of the currently selected item for single actions.                    |
| selectedModelClass       | String \| undefined \| null                               | The class of the model of the currently selected item.                       |
| collectionName           | String \| undefined                                       | The name of the collection being moderated.                                  |
| itemsCountText           | String \| undefined                                       | The text describing the count of items (e.g., "5 items").                    |
| resizeTimeout            | any \| undefined                                          | A timeout used for throttling resize events.                                 |
| typeOfModeration         | "moderate_all_content" \| "flagged_content"               | The type of moderation being performed.                                      |
| activeItem               | YpDatabaseItem \| undefined                               | The currently active item in the grid.                                       |
| allowGridEventsAfterMenuOpen | Boolean                                               | Allows grid events to be processed after a menu is opened.                   |

## Methods

| Name                | Parameters | Return Type | Description                                                                 |
|---------------------|------------|-------------|-----------------------------------------------------------------------------|
| updated             | changedProperties: Map<string \| number \| symbol, unknown> | void | Handles updates to properties, such as refreshing content after changes.   |
| renderContent       | root: HTMLElement, column: any, rowData: RowData | void | Renders the content of a grid cell.                                         |
| renderItemDetail    | root: HTMLElement, column: any, rowData: RowData | void | Renders the detailed view of an item in the grid.                           |
| renderActionHeader  | root: HTMLElement, column?: GridColumnElement \| undefined | void | Renders the header for the action column in the grid.                       |
| renderAction        | root: HTMLElement, column: any, rowData: RowData | void | Renders the action buttons for an item in the grid.                         |
| render              | -          | TemplateResult | Renders the content moderation panel.                                       |
| spinnerActive       | -          | Boolean | Returns true if the spinner should be active, indicating a loading state.   |
| _ajaxError          | error: any \| undefined = undefined | void | Handles AJAX errors.                                                        |
| _reload             | -          | Promise<void> | Reloads the content moderation panel.                                       |
| _masterRequest      | action: string, itemIdsAndType: Array<SelectedItemIdsAndType> \| undefined = undefined | Promise<void> | Sends a request to perform an action on selected items.                     |
| _generateRequest    | id: number | Promise<void> | Generates a request to retrieve items for moderation.                       |
| _itemsResponse      | items: Array<YpModerationItem> | void | Handles the response containing the items for moderation.                   |
| _manyItemsResponse  | -          | void | Handles the response for actions affecting many items.                      |
| _singleItemResponse | -          | void | Handles the response for actions affecting a single item.                   |
| _menuSelection      | -          | void | Handles the selection of an item from the menu.                             |
| _reallyAnonymize    | -          | Promise<void> | Confirms and performs the anonymization of an item.                         |
| _reallyAnonymizeSelected | -    | Promise<void> | Confirms and performs the anonymization of selected items.                  |
| _reallyDelete       | -          | Promise<void> | Confirms and performs the deletion of an item.                              |
| _reallyDeleteSelected | -        | Promise<void> | Confirms and performs the deletion of selected items.                       |
| _approve            | event: CustomEvent | Promise<void> | Approves an item.                                                          |
| _approveSelected    | event: CustomEvent | Promise<void> | Approves selected items.                                                   |
| _block              | event: CustomEvent | Promise<void> | Blocks an item.                                                            |
| _blockSelected      | event: CustomEvent | Promise<void> | Blocks selected items.                                                     |
| _clearFlags         | event: CustomEvent | Promise<void> | Clears flags on an item.                                                   |
| _clearSelectedFlags | event: CustomEvent | Promise<void> | Clears flags on selected items.                                            |
| _refreshAfterChange | -          | Promise<void> | Refreshes the content after a change in the criteria (group, community, etc.). |
| _getType            | type: string | String | Returns the translated type of an item (e.g., post, point).                 |
| _activeItemChanged  | item: YpDatabaseItem \| undefined, oldItem: YpDatabaseItem \| undefined | void | Handles changes to the active item in the grid.                            |
| _refreshGridAsync   | -          | void | Asynchronously refreshes the grid.                                          |
| _refreshGridAsyncDelay | -       | void | Delays the asynchronous refresh of the grid.                                |
| _refreshGridAsyncBase | ms: number | void | Base method for asynchronously refreshing the grid.                         |
| connectedCallback   | -          | void | Lifecycle callback for when the element is added to the DOM.                |
| firstUpdated        | _changedProperties: PropertyValueMap<any> \| Map<PropertyKey, unknown> | void | Lifecycle callback for when the element is first updated.                   |
| _toPercent          | number: number \| undefined | String \| null | Converts a number to a percentage string.                                   |
| _resizeThrottler    | -          | void | Throttles resize events to prevent excessive calls.                         |
| _setGridSize        | -          | void | Sets the size of the grid based on the window size.                         |
| totalItemsCount     | -          | String \| null | Returns the total count of items as a formatted string.                     |
| _selectedItemsChanged | -        | void | Handles changes to the selected items.                                      |
| _setupItemIdFromEvent | event: CustomEvent | void | Sets up the selected item ID from an event.                                 |
| _deleteSelected     | event: CustomEvent | void | Confirms and initiates the deletion of selected items.                      |
| _delete             | event: CustomEvent | void | Confirms and initiates the deletion of an item.                             |
| _anonymizeSelected  | event: CustomEvent | void | Confirms and initiates the anonymization of selected items.                 |
| _anonymize          | event: CustomEvent | void | Confirms and initiates the anonymization of an item.                        |
| _menuOpened         | -          | void | Handles the opening of a menu.                                              |
| _setSelected        | event: CustomEvent | void | Sets the selected item based on an event.                                   |
| _findItemFromId     | id: number | YpModerationItem \| undefined | Finds an item from its ID.                                                 |
| setup               | groupId: number \| undefined, communityId: number \| undefined, domainId: number \| undefined, typeOfModeration: "flagged_content" \| "moderate_all_content" \| undefined, userId: number \| undefined | void | Sets up the moderation panel with the given criteria.                       |
| open                | name: string | void | Opens the moderation panel with the given collection name.                  |
| _reset              | -          | void | Resets the moderation panel.                                                |
| _resetSelectedAndClearCache | - | void | Resets the selected items and clears the grid cache.                        |
| _setupHeaderText    | -          | void | Sets up the header text based on the moderation criteria.                   |

## Events (if any)

- **dismissBtn**: Emitted when the close button is clicked.
- **grid**: Emitted when the grid is interacted with, such as selecting items or resizing.

## Examples

```typescript
// Example usage of the YpContentModeration element
<yp-content-moderation
  .groupId="${this.groupId}"
  .communityId="${this.communityId}"
  .domainId="${this.domainId}"
  .userId="${this.userId}"
  .typeOfModeration="${this.typeOfModeration}"
></yp-content-moderation>
```

Note: The above example assumes that `groupId`, `communityId`, `domainId`, `userId`, and `typeOfModeration` are properties or state variables available in the context where the `YpContentModeration` element is used.