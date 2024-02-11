# YpGroup

YpGroup is a custom web component that extends the functionality of YpCollection. It represents a group within a platform, allowing users to interact with posts, activities, and other group-related features. It includes tabs for different post statuses, a map view, and integration with analytics and theming.

## Properties

| Name               | Type                                  | Description                                                                 |
|--------------------|---------------------------------------|-----------------------------------------------------------------------------|
| collection         | YpGroupData \| undefined              | The group data object associated with this component.                       |
| searchingFor       | string \| undefined                   | A string used for searching within the group.                               |
| hasNonOpenPosts    | boolean                               | Indicates if there are posts with statuses other than 'Open'.               |
| disableNewPosts    | boolean                               | If true, disables the ability to create new posts.                          |
| selectedGroupTab   | number                                | The index of the currently selected tab in the group.                       |
| configCheckTimer   | ReturnType<typeof setTimeout> \| undefined | A timer for checking group configuration updates.                           |
| newGroupRefresh    | boolean                               | A flag to indicate if the group data should be refreshed.                   |
| tabCounters        | Record<string, number>                | An object holding the count of posts for each tab.                          |
| configCheckTTL     | number                                | Time to live for the configuration check timer.                             |

## Methods

| Name                   | Parameters                  | Return Type | Description                                                                 |
|------------------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback      |                             | void        | Lifecycle method that runs when the component is added to the DOM.          |
| disconnectedCallback   |                             | void        | Lifecycle method that runs when the component is removed from the DOM.       |
| _cancelConfigCheckTimer |                           | void        | Cancels the configuration check timer.                                      |
| _startConfigCheckTimer |                           | void        | Starts the configuration check timer.                                       |
| _getGroupConfig        |                             | Promise<void> | Fetches the group configuration from the server.                            |
| _doesGroupRequireRefresh | groupConfigA: YpGroupConfiguration, groupConfigB: YpGroupConfiguration | boolean | Checks if the group configuration has changed and requires a refresh.       |
| _updateTabPostCount    | event: CustomEvent          | void        | Updates the post count for a specific tab based on an event.                |
| _setupOpenTab          |                             | void        | Sets up the 'Open' tab based on the post counts.                            |
| tabLabelWithCount      | type: string                | string      | Returns the label for a tab with the count of posts.                        |
| getCurrentTabElement   |                             | HTMLElement \| undefined | Returns the current tab element based on the selected tab index.            |
| getCollection          |                             | Promise<void> | Fetches the group collection data from the server.                          |
| renderGroupTabs        |                             | TemplateResult | Renders the tabs for the group.                                             |
| renderPostList         | statusFilter: string        | TemplateResult | Renders the list of posts filtered by status.                               |
| renderCurrentGroupTabPage |                         | TemplateResult \| undefined | Renders the content of the currently selected group tab.                    |
| renderHeader           |                             | TemplateResult | Renders the header for the group.                                           |
| render                 |                             | TemplateResult | Renders the component.                                                      |
| renderYpGroup          |                             | TemplateResult | Renders the YpGroup component.                                              |
| _selectGroupTab        | event: CustomEvent          | void        | Handles the selection of a group tab.                                       |
| _openHelpPageIfNeededOnce |                         | void        | Opens the help page for the group if needed.                                |
| _refreshAjax           |                             | void        | Refreshes the group data and related components.                            |
| _newPost               |                             | void        | Opens the dialog to create a new post.                                      |
| _clearScrollThreshold  |                             | void        | Clears the scroll threshold for lazy loading.                               |
| _setSelectedTabFromRoute | routeTabName: string      | void        | Sets the selected tab based on the route.                                   |
| _isCurrentPostsTab     |                             | boolean     | Checks if the current tab is one of the posts tabs.                         |
| _loadMoreData          |                             | void        | Loads more data for the current tab if it's a posts tab.                    |
| goToPostOrNewsItem     |                             | void        | Scrolls to a specific post or news item if applicable.                      |
| refresh                | fromMainApp: boolean = false | void        | Refreshes the group data and updates the UI accordingly.                    |
| _setupGroupSaml        | group: YpGroupData          | void        | Sets up SAML configuration for the group.                                   |
| scrollToCollectionItemSubClass |                     | void        | Scrolls to a specific collection item if needed.                            |

## Events (if any)

- **yp-post-count**: Emitted when the post count for a tab needs to be updated.
- **yp-refresh-activities-scroll-threshold**: Emitted to clear the scroll threshold for lazy loading.

## Examples

```typescript
// Example usage of the YpGroup component
<yp-group
  .collection="${this.groupData}"
  .searchingFor="${this.searchQuery}"
  .hasNonOpenPosts="${this.hasStatusOtherThanOpen}"
  .disableNewPosts="${this.isNewPostsDisabled}"
  .selectedGroupTab="${this.currentTab}"
></yp-group>
```

Note: The above example assumes that `this.groupData`, `this.searchQuery`, `this.hasStatusOtherThanOpen`, `this.isNewPostsDisabled`, and `this.currentTab` are properties defined in the context where the `YpGroup` component is used.