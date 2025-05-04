# YpCollection

An abstract base class for collection-based views in a Lit web component application. Handles rendering, tab navigation, data fetching, and user access logic for collections such as domains, communities, and groups. Designed to be extended for specific collection types.

## Properties

| Name                    | Type                                                                 | Description                                                                                 |
|-------------------------|----------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| noHeader                | boolean                                                              | If true, hides the collection header.                                                       |
| tabsHidden              | boolean                                                              | If true, hides the tab navigation.                                                          |
| collectionId            | number \| undefined                                                  | The ID of the current collection.                                                           |
| collectionName          | string \| undefined                                                  | The name of the current collection.                                                         |
| collection              | YpCollectionData \| undefined                                        | The collection data object.                                                                 |
| subRoute                | string \| undefined                                                  | The current sub-route for navigation.                                                       |
| selectedTab             | number                                                               | The currently selected tab index.                                                           |
| collectionItems         | Array&lt;YpCommunityData \| YpGroupData&gt; \| undefined             | The list of items in the collection.                                                        |
| hideNewsfeed            | boolean                                                              | If true, hides the newsfeed tab.                                                            |
| locationHidden          | boolean                                                              | If true, hides the location/map tab.                                                        |
| hideCollection          | boolean                                                              | If true, hides the collection tab.                                                          |
| createFabIcon           | string \| undefined                                                  | The icon for the floating action button (FAB) to create a new collection.                   |
| createFabLabel          | string \| undefined                                                  | The label for the FAB to create a new collection.                                           |
| headerImageUrl          | string \| undefined                                                  | The URL for the header image.                                                               |
| useEvenOddItemLayout    | boolean                                                              | If true, uses an even/odd layout for collection items.                                      |
| collectionHeaderHidden  | boolean                                                              | If true, hides the collection header (can be toggled by events).                            |
| collectionType          | string                                                               | The type of the collection (e.g., "domain", "community", "group").                          |
| collectionItemType      | string \| null                                                       | The type of items in the collection (e.g., "community", "group").                           |
| collectionCreateFabIcon | string                                                               | The default icon for the create FAB.                                                        |
| collectionCreateFabLabel| string                                                               | The default label for the create FAB.                                                       |

## Methods

| Name                              | Parameters                                                                                      | Return Type                | Description                                                                                                 |
|----------------------------------- |------------------------------------------------------------------------------------------------|----------------------------|-------------------------------------------------------------------------------------------------------------|
| constructor                       | collectionType: string, collectionItemType: string \| null, collectionCreateFabIcon: string, collectionCreateFabLabel: string | void                       | Initializes the collection with type, item type, FAB icon, and label. Sets up global event listeners.       |
| loggedInUserCustom                | none                                                                                           | Promise&lt;void&gt;        | Called when the user logs in; triggers a refresh.                                                           |
| scrollToCollectionItemSubClass    | none                                                                                           | void                       | Abstract method to scroll to a collection item; must be implemented by subclasses.                          |
| setupTheme                        | none                                                                                           | void                       | Placeholder for theme setup; should be implemented in subclasses.                                           |
| connectedCallback                 | none                                                                                           | void                       | Lifecycle method; sets up listeners and refreshes data as needed.                                           |
| hideCollectionHeader              | event: CustomEvent                                                                             | void                       | Handles hiding/showing the collection header based on event detail.                                         |
| themeApplied                      | none                                                                                           | Promise&lt;void&gt;        | Called when the theme is applied; requests a UI update.                                                     |
| disconnectedCallback              | none                                                                                           | void                       | Lifecycle method; removes global event listeners.                                                           |
| refresh                           | none                                                                                           | void                       | Refreshes the collection data and updates the UI.                                                           |
| getCollection                     | none                                                                                           | Promise&lt;void&gt;        | Fetches the collection data from the server and refreshes the UI.                                           |
| _getHelpPages                     | collectionTypeOverride?: string, collectionIdOverride?: number                                 | Promise&lt;void&gt;        | Fetches help pages for the collection and fires an event with the result.                                   |
| collectionTabLabel (getter)       | none                                                                                           | string                     | Returns the label for the collection tab, including the item count.                                         |
| collectionIdChanged               | none                                                                                           | void                       | Called when the collection ID changes; fetches new data and help pages.                                     |
| updated                           | changedProperties: Map&lt;string \| number \| symbol, unknown&gt;                              | void                       | Lifecycle method; handles changes to subRoute and collectionId.                                             |
| _selectTab                        | event: CustomEvent                                                                             | void                       | Handles tab selection changes.                                                                              |
| _openAdmin                        | none                                                                                           | void                       | Redirects to the admin page for the current collection.                                                     |
| _setSelectedTabFromRoute          | routeTabName: string                                                                           | void                       | Sets the selected tab based on the route name.                                                              |
| scrollToCachedItem                | none                                                                                           | void                       | Scrolls to a cached item in the activities or collection list, if available.                                |
| scrollToCollectionItemSubClassDomain | none                                                                                        | void                       | Scrolls to a cached domain community item, if available.                                                    |
| setFabIconIfAccess                | onlyAdminCanCreate: boolean, hasCollectionAccess: boolean                                      | void                       | Sets the FAB icon and label if the user has access.                                                         |
| _useHardBack                      | configuration: YpCollectionConfiguration                                                       | boolean                    | Determines if a hard back navigation should be used based on configuration.                                 |
| createNewCollection               | none                                                                                           | void                       | Initiates the creation of a new child collection and redirects to the admin page for it.                    |
| renderHeader                      | none                                                                                           | TemplateResult \| typeof nothing | Renders the collection header if available and not hidden.                                                  |
| renderAssistantTab                | none                                                                                           | TemplateResult             | Renders the (currently hidden) assistant tab.                                                               |
| renderNewsAndMapTabs              | none                                                                                           | TemplateResult             | Renders the newsfeed and map tabs, conditionally hidden.                                                    |
| renderTabs                        | none                                                                                           | TemplateResult \| typeof nothing | Renders the tab navigation if the collection is loaded and tabs are not hidden.                             |
| renderCurrentTabPage              | none                                                                                           | TemplateResult \| undefined | Renders the content for the currently selected tab.                                                         |
| render                            | none                                                                                           | TemplateResult             | Main render method; displays the collection UI or a loading indicator.                                      |

## Examples

```typescript
class MyCommunityCollection extends YpCollection {
  constructor() {
    super("community", "group", "add", "Create Group");
  }

  scrollToCollectionItemSubClass() {
    // Custom scroll logic for this subclass
  }

  setupTheme() {
    // Custom theme logic
  }
}

const myCollection = new MyCommunityCollection();
myCollection.collectionId = 123;
document.body.appendChild(myCollection);
```
