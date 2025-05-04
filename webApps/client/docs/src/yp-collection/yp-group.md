# YpGroup

A web component for managing and displaying a group (collection) with posts, tabs, and various group-specific features. Extends `YpCollection` and provides advanced group management, tabbed navigation, and dynamic rendering based on group type and configuration.

## Properties

| Name                | Type                                         | Description                                                                                 |
|---------------------|----------------------------------------------|---------------------------------------------------------------------------------------------|
| collection          | YpGroupData \| undefined                     | The group data object for the current group.                                                |
| searchingFor        | string \| undefined                          | The current search query/filter for posts.                                                  |
| hasNonOpenPosts     | boolean                                      | Whether the group has posts that are not in the "Open" state.                               |
| disableNewPosts     | boolean                                      | If true, disables the ability to add new posts.                                             |
| minimizeWorkflow    | boolean                                      | If true, minimizes the workflow UI (used for agent workflow groups).                        |
| selectedGroupTab    | number                                       | The currently selected group tab index.                                                     |
| configCheckTimer    | ReturnType<typeof setTimeout> \| undefined   | Timer for periodic group configuration checks.                                              |
| newGroupRefresh     | boolean                                      | Internal state to trigger refresh when a new group is loaded.                               |
| isImportingCode     | boolean                                      | Internal state for import code process.                                                     |
| haveLoadedAgentsOps | boolean                                      | Whether the agent operations manager has been loaded.                                       |
| haveLoadedAllOurIdeas | boolean                                    | Whether the AllOurIdeas survey has been loaded.                                             |
| tabCounters         | Record<string, number>                       | Stores the count of posts for each tab type.                                                |
| configCheckTTL      | number                                       | Time-to-live for the config check timer (ms).                                               |

## Methods

| Name                        | Parameters                                                                 | Return Type         | Description                                                                                      |
|-----------------------------|----------------------------------------------------------------------------|---------------------|--------------------------------------------------------------------------------------------------|
| constructor                 |                                                                            | void                | Initializes the group component and sets up default values.                                       |
| themeApplied                |                                                                            | Promise<void>       | Called when the theme is applied; sets static theme and requests update.                         |
| connectedCallback           |                                                                            | void                | Lifecycle method; adds event listeners.                                                          |
| disconnectedCallback        |                                                                            | void                | Lifecycle method; removes event listeners.                                                       |
| _cancelConfigCheckTimer     |                                                                            | void                | Cancels the config check timer if running.                                                       |
| _startConfigCheckTimer      |                                                                            | void                | Starts the config check timer if a collection is loaded.                                         |
| _getGroupConfig             |                                                                            | Promise<void>       | Fetches the latest group configuration and refreshes if changed.                                 |
| _doesGroupRequireRefresh    | groupConfigA: YpGroupConfiguration, groupConfigB: YpGroupConfiguration      | boolean             | Compares two group configurations to determine if a refresh is needed.                           |
| _updateTabPostCount         | event: CustomEvent                                                         | void                | Updates the tab counters based on post count events.                                             |
| _setupOpenTab               |                                                                            | void                | Sets up the default open tab based on available post counts.                                     |
| tabLabelWithCount           | type: string                                                               | string              | Returns the tab label with the post count for the given type.                                    |
| getCurrentTabElement        |                                                                            | HTMLElement \| undefined | Returns the DOM element for the currently selected tab.                                          |
| getCollection               |                                                                            | Promise<void>       | Loads the group collection data, including items and configuration.                              |
| _selectGroupTab             | event: CustomEvent                                                         | void                | Handles tab selection changes.                                                                   |
| _openHelpPageIfNeededOnce   |                                                                            | void                | Opens the help page for the group if needed (once per session).                                  |
| _refreshAjax                |                                                                            | void                | Refreshes the group data and updates newsfeed/map as needed.                                     |
| _newPost                    |                                                                            | void                | Navigates to the new post creation page.                                                         |
| _clearScrollThreshold       |                                                                            | void                | Clears the scroll threshold triggers.                                                            |
| _setSelectedTabFromRoute    | routeTabName: string                                                       | void                | Sets the selected tab based on the route name.                                                   |
| _isCurrentPostsTab (getter) |                                                                            | boolean             | Returns true if the current tab is a posts tab.                                                  |
| _loadMoreData               |                                                                            | void                | Loads more data for the current posts tab.                                                       |
| goToPostOrNewsItem          |                                                                            | void                | Scrolls to a specific post or news item if applicable.                                           |
| setupTheme                  |                                                                            | void                | Applies the theme based on group and community configuration.                                    |
| setupThemeOld               |                                                                            | void                | Legacy theme setup logic.                                                                        |
| refresh                     | fromMainApp?: boolean                                                      | Promise<void>       | Refreshes the group data and updates UI, analytics, and configuration.                           |
| _setupGroupSaml             | group: YpGroupData                                                         | void                | Sets up SAML login/denied messages for the group.                                                |
| scrollToCollectionItemSubClass |                                                                        | void                | Scrolls to a specific collection item if returning from a community group.                       |
| renderTabs                  |                                                                            | TemplateResult \| typeof nothing | Renders the group tabs UI.                                                                       |
| renderXlsDownload           |                                                                            | TemplateResult      | Renders the XLS download button/component.                                                       |
| renderPostList              | statusFilter: string                                                       | TemplateResult      | Renders the posts list for a given status filter.                                                |
| renderCurrentGroupTabPage   |                                                                            | TemplateResult \| undefined | Renders the content for the currently selected group tab.                                        |
| renderAllOurIdeas           |                                                                            | TemplateResult      | Renders the AllOurIdeas survey component.                                                        |
| renderStaticHtml            |                                                                            | TemplateResult      | Renders static HTML content for the group.                                                       |
| renderHeader                |                                                                            | TemplateResult \| typeof nothing | Renders the group header.                                                                        |
| cleanedGroupType (getter)   |                                                                            | number              | Returns the cleaned group type as a number.                                                      |
| styles (static getter)      |                                                                            | CSSResultArray      | Returns the component styles.                                                                    |
| renderAgentsOps             |                                                                            | TemplateResult      | Renders the agent operations manager component.                                                  |
| renderGroupFolder           |                                                                            | TemplateResult      | Renders the group folder view.                                                                   |
| isNewPost (getter)          |                                                                            | boolean             | Returns true if the current route is for creating a new post.                                    |
| render                      |                                                                            | TemplateResult      | Main render method; renders the group UI based on group type and state.                          |
| hideBigHeaders (getter)     |                                                                            | boolean             | Returns true if big headers should be hidden (for agent bundle).                                 |
| renderYpGroup               |                                                                            | TemplateResult      | Renders the main group UI for idea generation and debate groups.                                 |

## Events

- **yp-post-count**: Emitted when the post count for a tab changes.
- **yp-refresh-activities-scroll-threshold**: Emitted to clear scroll threshold triggers.
- **yp-change-header**: Emitted to update the app header with group-specific information.
- **yp-open-page**: Emitted to open a help or welcome page for the group.

## Examples

```typescript
import "./yp-group.js";

const groupElement = document.createElement("yp-group");
groupElement.collectionId = 12345;
document.body.appendChild(groupElement);

// Listen for header changes
groupElement.addEventListener("yp-change-header", (e) => {
  console.log("Header changed:", e.detail);
});
```
