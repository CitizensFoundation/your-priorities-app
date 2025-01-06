# YpCollection

The `YpCollection` class is an abstract web component that extends `YpBaseElementWithLogin`. It is designed to manage and display a collection of items, such as communities or groups, with various functionalities like tabs for different views, headers, and floating action buttons (FABs).

## Properties

| Name                   | Type                                                                 | Description                                                                 |
|------------------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------|
| noHeader               | boolean                                                              | Determines if the header should be hidden.                                  |
| tabsHidden             | boolean                                                              | Determines if the tabs should be hidden.                                    |
| collectionId           | number \| undefined                                                  | The ID of the collection.                                                   |
| collectionName         | string \| undefined                                                  | The name of the collection.                                                 |
| collection             | YpCollectionData \| undefined                                        | The data of the collection.                                                 |
| subRoute               | string \| undefined                                                  | The sub-route for navigation purposes.                                      |
| selectedTab            | number                                                               | The currently selected tab, default is `CollectionTabTypes.Collection`.     |
| collectionItems        | Array<YpCommunityData \| YpGroupData> \| undefined                   | The items within the collection.                                            |
| hideNewsfeed           | boolean                                                              | Determines if the newsfeed tab should be hidden.                            |
| locationHidden         | boolean                                                              | Determines if the location tab should be hidden.                            |
| hideCollection         | boolean                                                              | Determines if the collection tab should be hidden.                          |
| createFabIcon          | string \| undefined                                                  | The icon for the create FAB.                                                |
| createFabLabel         | string \| undefined                                                  | The label for the create FAB.                                               |
| headerImageUrl         | string \| undefined                                                  | The URL for the header image.                                               |
| useEvenOddItemLayout   | boolean                                                              | Determines if an even-odd layout should be used for items.                  |
| collectionHeaderHidden | boolean                                                              | Determines if the collection header should be hidden.                       |
| collectionType         | string                                                               | The type of the collection (e.g., domain, community).                       |
| collectionItemType     | string \| null                                                       | The type of items in the collection.                                        |
| collectionCreateFabIcon| string                                                               | The icon for creating a new collection item.                                |
| collectionCreateFabLabel| string                                                              | The label for creating a new collection item.                               |

## Methods

| Name                          | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| constructor                   | collectionType: string, collectionItemType: string \| null, collectionCreateFabIcon: string, collectionCreateFabLabel: string | void        | Initializes a new instance of the `YpCollection` class.                    |
| loggedInUserCustom            | none                                                                       | Promise<void> | Refreshes the component when the user logs in.                             |
| abstract scrollToCollectionItemSubClass | none                                                             | void        | Abstract method to scroll to a specific collection item.                   |
| setupTheme                    | none                                                                       | void        | Sets up the theme for the component.                                        |
| connectedCallback             | none                                                                       | void        | Lifecycle method called when the component is added to the DOM.            |
| hideCollectionHeader          | event: CustomEvent                                                         | void        | Hides the collection header based on the event detail.                     |
| themeApplied                  | none                                                                       | Promise<void> | Requests an update when the theme is applied.                              |
| disconnectedCallback          | none                                                                       | void        | Lifecycle method called when the component is removed from the DOM.        |
| refresh                       | none                                                                       | void        | Refreshes the component's data and UI.                                     |
| getCollection                 | none                                                                       | Promise<void> | Fetches the collection data from the server.                               |
| _getHelpPages                 | collectionTypeOverride: string \| undefined, collectionIdOverride: number \| undefined | Promise<void> | Fetches help pages related to the collection.                              |
| collectionTabLabel            | none                                                                       | string      | Gets the label for the collection tab.                                     |
| collectionIdChanged           | none                                                                       | void        | Handles changes to the collection ID.                                      |
| updated                       | changedProperties: Map<string \| number \| symbol, unknown>                | void        | Lifecycle method called when properties are updated.                       |
| _selectTab                    | event: CustomEvent                                                         | void        | Handles tab selection changes.                                             |
| _openAdmin                    | none                                                                       | void        | Redirects to the admin page for the collection.                            |
| _setSelectedTabFromRoute      | routeTabName: string                                                       | void        | Sets the selected tab based on the route.                                  |
| scrollToCachedItem            | none                                                                       | void        | Scrolls to a cached item if available.                                     |
| scrollToCollectionItemSubClassDomain | none                                                               | void        | Scrolls to a specific item in the domain collection.                       |
| setFabIconIfAccess            | onlyAdminCanCreate: boolean, hasCollectionAccess: boolean                  | void        | Sets the FAB icon and label based on access rights.                        |
| _useHardBack                  | configuration: YpCollectionConfiguration                                   | boolean     | Determines if a hard back URL should be used.                              |
| createNewCollection           | none                                                                       | void        | Creates a new collection item.                                             |
| renderHeader                  | none                                                                       | TemplateResult | Renders the header of the collection.                                      |
| renderAssistantTab            | none                                                                       | TemplateResult | Renders the assistant tab.                                                 |
| renderNewsAndMapTabs          | none                                                                       | TemplateResult | Renders the news and map tabs.                                             |
| renderTabs                    | none                                                                       | TemplateResult | Renders the tabs for the collection.                                       |
| renderCurrentTabPage          | none                                                                       | TemplateResult \| undefined | Renders the current tab page.                                              |
| render                        | none                                                                       | TemplateResult | Renders the entire component.                                              |

## Examples

```typescript
// Example usage of the YpCollection component
class MyCollection extends YpCollection {
  constructor() {
    super('community', 'group', 'add', 'Create Group');
  }

  scrollToCollectionItemSubClass(): void {
    // Implementation for scrolling to a specific collection item
  }

  setupTheme() {
    // Custom theme setup
  }
}
```