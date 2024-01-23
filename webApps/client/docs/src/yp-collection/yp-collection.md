# YpCollection

YpCollection is an abstract class that represents a collection within a platform, such as a community or group. It extends from YpBaseElementWithLogin and manages the state and behavior of a collection, including its items, tabs, and events.

## Properties

| Name               | Type                                                         | Description                                                                 |
|--------------------|--------------------------------------------------------------|-----------------------------------------------------------------------------|
| noHeader           | Boolean                                                      | Indicates if the header should be hidden.                                   |
| tabsHidden         | Boolean                                                      | Indicates if the tabs should be hidden.                                     |
| collectionId       | number \| undefined                                          | The unique identifier of the collection.                                    |
| collectionName     | string \| undefined                                          | The name of the collection.                                                 |
| collection         | YpCollectionData \| undefined                                | The collection data object.                                                 |
| subRoute           | string \| undefined                                          | The sub-route within the collection.                                        |
| selectedTab        | number                                                       | The index of the currently selected tab.                                    |
| collectionItems    | Array<YpCommunityData \| YpGroupData> \| undefined           | The items within the collection.                                            |
| hideNewsfeed       | Boolean                                                      | Indicates if the newsfeed tab should be hidden.                             |
| locationHidden     | Boolean                                                      | Indicates if the location tab should be hidden.                             |
| hideCollection     | Boolean                                                      | Indicates if the collection tab should be hidden.                           |
| createFabIcon      | string \| undefined                                          | The icon for the floating action button used to create new collection items.|
| createFabLabel     | string \| undefined                                          | The label for the floating action button used to create new collection items.|

## Methods

| Name                        | Parameters                                      | Return Type | Description                                                                 |
|-----------------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| scrollToCollectionItemSubClass | None                                            | void        | An abstract method that subclasses must implement to handle scrolling to a specific collection item. |
| connectedCallback           | None                                            | void        | Lifecycle method called when the element is added to the document's DOM.    |
| refresh                     | None                                            | void        | Refreshes the collection data and UI elements.                              |
| getCollection               | None                                            | Promise<void> | Fetches the collection data from the server.                                |
| _getHelpPages               | collectionTypeOverride: string \| undefined, collectionIdOverride: number \| undefined | Promise<void> | Fetches help pages for the collection.                                      |
| collectionTabLabel          | None                                            | string      | Gets the label for the collection tab with the count of items.              |
| renderHeader                | None                                            | TemplateResult \| undefined | Renders the collection header.                                              |
| renderNewsAndMapTabs        | None                                            | TemplateResult | Renders the newsfeed and map tabs.                                          |
| renderTabs                  | None                                            | TemplateResult \| undefined | Renders the tabs for the collection.                                        |
| renderCurrentTabPage        | None                                            | TemplateResult \| undefined | Renders the content of the currently selected tab.                          |
| createNewCollection         | None                                            | void        | Handles the creation of a new collection item.                              |
| collectionIdChanged         | None                                            | void        | Called when the collectionId property changes.                              |
| updated                     | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method called after the element’s properties have changed.        |
| _selectTab                  | event: CustomEvent                              | void        | Handles the selection of a tab.                                             |
| _setSelectedTabFromRoute    | routeTabName: string                            | void        | Sets the selected tab based on the route.                                   |
| scrollToCachedItem          | None                                            | void        | Scrolls to a cached item if available.                                      |
| scrollToCollectionItemSubClassDomain | None                                            | void        | Scrolls to a collection item in a domain collection.                        |
| setFabIconIfAccess          | onlyAdminCanCreate: boolean, hasCollectionAccess: boolean | void        | Sets the FAB icon and label based on access rights.                         |
| _useHardBack                | configuration: YpCollectionConfiguration        | boolean     | Determines if a hard back navigation should be used based on configuration. |

## Events (if any)

- **yp-logged-in**: Emitted when a user logs in, triggering a refresh of the collection data.
- **yp-got-admin-rights**: Emitted when a user gains admin rights, triggering a fetch of the collection data.

## Examples

```typescript
// Example usage of YpCollection is not provided as it is an abstract class.
// Subclasses would implement the abstract methods and use the properties and methods defined here.
```