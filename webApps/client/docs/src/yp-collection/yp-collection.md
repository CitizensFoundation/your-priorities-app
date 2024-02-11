# YpCollection

`YpCollection` is an abstract class that extends `YpBaseElementWithLogin` and represents a collection component in a web application. It manages the display and interaction with a collection of items, such as communities or groups, and includes functionality for handling tabs, refreshing data, and creating new items within the collection.

## Properties

| Name               | Type                                                         | Description                                                                                   |
|--------------------|--------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| noHeader           | boolean                                                      | Determines whether the header should be displayed or not.                                      |
| tabsHidden         | boolean                                                      | Determines whether the tabs should be hidden or not.                                           |
| collectionId       | number \| undefined                                          | The ID of the collection being displayed.                                                      |
| collectionName     | string \| undefined                                          | The name of the collection being displayed.                                                    |
| collection         | YpCollectionData \| undefined                                | The collection data object.                                                                    |
| subRoute           | string \| undefined                                          | The sub-route for the collection page.                                                         |
| selectedTab        | number                                                       | The index of the currently selected tab.                                                       |
| collectionItems    | Array<YpCommunityData \| YpGroupData> \| undefined           | An array of items within the collection.                                                       |
| hideNewsfeed       | boolean                                                      | Determines whether the newsfeed tab should be hidden or not.                                   |
| locationHidden     | boolean                                                      | Determines whether the location tab should be hidden or not.                                   |
| hideCollection     | boolean                                                      | Determines whether the collection tab should be hidden or not.                                 |
| createFabIcon      | string \| undefined                                          | The icon to display on the floating action button for creating new items.                      |
| createFabLabel     | string \| undefined                                          | The label to display on the floating action button for creating new items.                     |
| collectionType     | string                                                       | The type of the collection (e.g., 'domain', 'community').                                      |
| collectionItemType | string \| null                                               | The type of items within the collection.                                                       |
| collectionCreateFabIcon | string                                                   | The icon to display on the floating action button specific to the collection type.             |
| collectionCreateFabLabel | string                                                  | The label to display on the floating action button specific to the collection type.            |

## Methods

| Name                        | Parameters | Return Type | Description                                                                                   |
|-----------------------------|------------|-------------|-----------------------------------------------------------------------------------------------|
| loggedInUserCustom          |            | Promise<void> | Custom logic to be executed when a user logs in.                                              |
| scrollToCollectionItemSubClass |            | void        | Abstract method to scroll to a specific item within the collection.                           |
| connectedCallback           |            | void        | Lifecycle method called when the component is added to the DOM.                               |
| refresh                     |            | void        | Refreshes the collection data and updates the UI accordingly.                                 |
| getCollection               |            | Promise<void> | Fetches the collection data from the server.                                                  |
| _getHelpPages               | collectionTypeOverride?: string, collectionIdOverride?: number | Promise<void> | Fetches help pages for the collection. |
| collectionIdChanged         |            | void        | Called when the `collectionId` property changes.                                              |
| updated                     | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method called after the component’s properties have been updated.                  |
| _selectTab                  | event: CustomEvent | void | Handles the tab selection event.                                                             |
| _setSelectedTabFromRoute    | routeTabName: string | void | Sets the selected tab based on the route.                                                    |
| scrollToCachedItem          |            | void        | Scrolls to a cached item if one is available.                                                |
| scrollToCollectionItemSubClassDomain |            | void        | Scrolls to a collection item in a domain collection.                                         |
| setFabIconIfAccess          | onlyAdminCanCreate: boolean, hasCollectionAccess: boolean | void | Sets the FAB icon and label based on access rights.                                          |
| _useHardBack                | configuration: YpCollectionConfiguration | boolean | Determines if a hard back navigation should be used based on the collection configuration.   |

## Events (if any)

- **yp-logged-in**: Emitted when a user logs in.
- **yp-got-admin-rights**: Emitted when a user obtains admin rights.
- **yp-set-home-link**: Emitted to set the home link data.
- **yp-change-header**: Emitted to change the header information.
- **yp-set-pages**: Emitted to set help pages.

## Examples

```typescript
// Example usage of YpCollection is not provided as it is an abstract class and cannot be instantiated directly.
```

Please note that the `YpCollection` class is abstract and is meant to be extended by other classes that implement the abstract methods and provide additional functionality specific to the type of collection they represent.