# YpGroup

The `YpGroup` class is a custom web component that extends the `YpCollection` class. It represents a group within a collection, providing functionalities to manage and display group-related data, such as posts, activities, and configurations. The component handles various group types and supports features like tab navigation, theme application, and data fetching.

## Properties

| Name                | Type                                      | Description                                                                 |
|---------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| collection          | YpGroupData \| undefined                  | The data of the group being represented.                                    |
| searchingFor        | string \| undefined                       | The search query for filtering posts.                                       |
| hasNonOpenPosts     | boolean                                   | Indicates if there are non-open posts in the group.                         |
| disableNewPosts     | boolean                                   | Determines if new posts can be added to the group.                          |
| minimizeWorkflow    | boolean                                   | Indicates if the workflow should be minimized.                              |
| selectedGroupTab    | number                                    | The currently selected tab in the group.                                    |
| configCheckTimer    | ReturnType<typeof setTimeout> \| undefined| Timer for checking group configuration updates.                             |
| newGroupRefresh     | boolean                                   | Indicates if the group is newly refreshed.                                  |
| isImportingCode     | boolean                                   | Indicates if code is being imported.                                        |
| haveLoadedAgentsOps | boolean                                   | Indicates if agent operations have been loaded.                             |
| haveLoadedAllOurIdeas | boolean                                 | Indicates if all ideas have been loaded.                                    |
| tabCounters         | Record<string, number>                    | Counters for the number of posts in each tab.                               |
| configCheckTTL      | number                                    | Time-to-live for configuration check timer.                                 |

## Methods

| Name                          | Parameters                          | Return Type | Description                                                                 |
|-------------------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| themeApplied                  | None                                | Promise<void> | Applies the theme to the group.                                             |
| connectedCallback             | None                                | void        | Lifecycle method called when the component is added to the DOM.             |
| disconnectedCallback          | None                                | void        | Lifecycle method called when the component is removed from the DOM.         |
| _cancelConfigCheckTimer       | None                                | void        | Cancels the configuration check timer.                                      |
| _startConfigCheckTimer        | None                                | void        | Starts the configuration check timer.                                       |
| _getGroupConfig               | None                                | Promise<void> | Fetches the group configuration from the server.                            |
| _doesGroupRequireRefresh      | groupConfigA: YpGroupConfiguration, groupConfigB: YpGroupConfiguration | boolean | Checks if the group configuration requires a refresh.                       |
| _updateTabPostCount           | event: CustomEvent                  | void        | Updates the post count for a tab based on an event.                         |
| _setupOpenTab                 | None                                | void        | Sets up the open tab based on post counts.                                  |
| tabLabelWithCount             | type: string                        | string      | Returns the label for a tab with the post count.                            |
| getCurrentTabElement          | None                                | HTMLElement \| undefined | Gets the current tab element.                                               |
| getCollection                 | None                                | Promise<void> | Fetches the collection data for the group.                                  |
| _selectGroupTab               | event: CustomEvent                  | void        | Selects a group tab based on an event.                                      |
| _openHelpPageIfNeededOnce     | None                                | void        | Opens the help page if needed.                                              |
| _refreshAjax                  | None                                | void        | Refreshes the group data via AJAX.                                          |
| _newPost                      | None                                | void        | Redirects to the new post creation page.                                    |
| _clearScrollThreshold         | None                                | void        | Clears the scroll threshold.                                                |
| _setSelectedTabFromRoute      | routeTabName: string                | void        | Sets the selected tab based on the route.                                   |
| _isCurrentPostsTab            | None                                | boolean     | Checks if the current tab is a posts tab.                                   |
| _loadMoreData                 | None                                | void        | Loads more data for the current tab.                                        |
| goToPostOrNewsItem            | None                                | void        | Navigates to a post or news item.                                           |
| setupTheme                    | None                                | void        | Sets up the theme for the group.                                            |
| setupThemeOld                 | None                                | void        | Sets up the old theme for the group.                                        |
| refresh                       | fromMainApp: boolean = false        | Promise<void> | Refreshes the group data and UI.                                            |
| _setupGroupSaml               | group: YpGroupData                  | void        | Sets up SAML configuration for the group.                                   |
| scrollToCollectionItemSubClass| None                                | void        | Scrolls to a specific collection item.                                      |
| renderTabs                    | None                                | TemplateResult | Renders the tabs for the group.                                             |
| renderXlsDownload             | None                                | TemplateResult | Renders the XLS download component.                                         |
| renderPostList                | statusFilter: string                | TemplateResult | Renders the post list for a specific status.                                |
| renderCurrentGroupTabPage     | None                                | TemplateResult \| undefined | Renders the current group tab page.                                         |
| renderAllOurIdeas             | None                                | TemplateResult | Renders the "All Our Ideas" component.                                      |
| renderStaticHtml              | None                                | TemplateResult | Renders static HTML content for the group.                                  |
| renderHeader                  | None                                | TemplateResult | Renders the header for the group.                                           |
| renderAgentsOps               | None                                | TemplateResult | Renders the agents operations manager.                                      |
| renderGroupFolder             | None                                | TemplateResult | Renders the group folder view.                                              |
| renderYpGroup                 | None                                | TemplateResult | Renders the main YpGroup view.                                              |

## Examples

```typescript
// Example usage of the YpGroup component
import './yp-group.js';

const groupElement = document.createElement('yp-group');
document.body.appendChild(groupElement);
```