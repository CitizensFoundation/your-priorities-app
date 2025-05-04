# YpPostsList

A web component for displaying and managing a list of posts, with support for filtering, searching, infinite scrolling, and category management. It uses Lit and Material Web Components, and supports both list and grid layouts.

## Properties

| Name                  | Type                                 | Description                                                                                 |
|-----------------------|--------------------------------------|---------------------------------------------------------------------------------------------|
| searchingFor          | string \| undefined                  | The current search query string.                                                            |
| subTitle              | string \| undefined                  | Subtitle to display in the filter area.                                                     |
| filter                | string                               | The current filter applied to the posts (e.g., "newest", "top").                            |
| statusFilter          | string                               | The current status filter (e.g., "open", "closed").                                         |
| hideCategories        | boolean                              | Whether to hide the categories filter.                                                      |
| posts                 | Array&lt;YpPostData&gt; \| undefined | The array of post data currently displayed.                                                 |
| userId                | number \| undefined                  | The user ID for filtering posts by user.                                                    |
| group                 | YpGroupData                          | The group data object for which posts are displayed.                                        |
| categoryId            | number \| undefined                  | The currently selected category ID.                                                         |
| postsCount            | number \| undefined                  | The total number of posts available.                                                        |
| selectedCategoryName  | string \| undefined                  | The name of the currently selected category.                                                |
| selectedGroupTab      | number \| undefined                  | The index of the currently selected group tab.                                              |
| noPosts               | boolean                              | Whether there are no posts to display.                                                      |
| showSearchIcon        | boolean                              | Whether to show the search icon in the search box.                                          |
| grid                  | boolean                              | Whether to display posts in a grid layout.                                                  |
| randomSeed            | number \| undefined                  | Random seed used for random sorting/filtering. (internal state)                             |
| moreToLoad            | boolean                              | Whether there are more posts to load (for infinite scroll).                                 |
| moreFromScrollTriggerActive | boolean                        | Whether the scroll trigger for loading more posts is active.                                |
| resetListSize         | Function \| undefined                | Function to reset the list size (for YpIronListHelpers).                                    |
| skipIronListWidth     | boolean                              | Whether to skip setting the iron list width (for YpIronListHelpers).                        |

## Methods

| Name                        | Parameters                                                                 | Return Type         | Description                                                                                      |
|-----------------------------|----------------------------------------------------------------------------|---------------------|--------------------------------------------------------------------------------------------------|
| render                      | none                                                                       | TemplateResult      | Renders the component template.                                                                  |
| renderPostItem              | post: YpPostData, index?: number                                           | TemplateResult      | Renders a single post item for the virtualizer.                                                  |
| desktopListFormat           | none                                                                       | boolean             | Returns true if the layout is a desktop list format.                                             |
| wideNotListFormat           | none                                                                       | boolean             | Returns true if the layout is wide but not a list format.                                        |
| _isLastItem                 | index: number                                                              | boolean             | Returns true if the given index is the last item in the posts array.                             |
| _searchKey                  | event: KeyboardEvent                                                       | void                | Handles keydown events in the search input (triggers search on Enter).                           |
| _keypress                   | event: KeyboardEvent                                                       | void                | Handles keypress events on post items (triggers selection on Enter).                             |
| _categoryChanged            | event: CustomEvent                                                         | void                | Handles category change events.                                                                  |
| _filterChanged              | event: CustomEvent                                                         | void                | Handles filter change events.                                                                    |
| firstUpdated                | changedProperties: Map&lt;string \| number \| symbol, unknown&gt;          | void                | Lifecycle method called after the first update.                                                  |
| _clearSearch                | none                                                                       | void                | Clears the search input and resets the filter.                                                   |
| scrollEvent                 | event: { last: number }                                                    | void                | Handles scroll events for infinite loading.                                                      |
| scrollToPostForGroupId      | event: CustomEvent                                                         | void                | Scrolls to a specific post for a given group ID.                                                 |
| connectedCallback           | none                                                                       | Promise&lt;void&gt; | Lifecycle method called when the component is added to the DOM.                                  |
| disconnectedCallback        | none                                                                       | void                | Lifecycle method called when the component is removed from the DOM.                              |
| _selectedItemChanged        | event: CustomEvent                                                         | void                | Handles selection of a post item.                                                                |
| _refreshPost                | event: CustomEvent                                                         | Promise&lt;void&gt; | Refreshes a single post's data from the server.                                                  |
| _getPostLink                | post: YpPostData                                                           | string \| undefined | Returns the URL for a given post, based on group configuration.                                  |
| scrollOffset                | none                                                                       | number \| null      | Gets the scroll offset for the post list.                                                        |
| _tapOnFilter                | none                                                                       | void                | Handles tap/click on the filter area (for analytics).                                            |
| _search                     | none                                                                       | void                | Triggers a search using the current search input value.                                          |
| buildPostsUrlPath           | none                                                                       | string              | Builds the URL path for the current filter and category selection.                               |
| scrollToPost                | post: YpPostData                                                           | Promise&lt;void&gt; | Scrolls to a specific post in the list.                                                          |
| updated                     | changedProperties: Map&lt;string \| number \| symbol, unknown&gt;          | void                | Lifecycle method called after each update.                                                       |
| refreshGroupFromFilter      | none                                                                       | void                | Refreshes the group and reloads posts based on the current filter and search.                    |
| _loadMoreData               | none                                                                       | Promise&lt;void&gt; | Loads more posts from the server (for infinite scroll or filter changes).                        |
| _checkForMultipleLanguages  | posts: Array&lt;YpPostData&gt;                                             | void                | Checks if there are posts in multiple languages and prompts for auto-translation if needed.      |
| _processCategories          | none                                                                       | void                | Processes and updates the selected category name based on the current categoryId.                |

## Events

- **yp-post-count**: Fired when the post count is updated. Contains `{ type, count }`.
- **yp-refresh-activities-scroll-threshold**: Fired globally to refresh scroll thresholds for activities.
- **yp-filter-category-change**: Listens for category change events.
- **yp-filter-changed**: Listens for filter change events.
- **refresh**: Listens for refresh events to update posts.
- **yp-scroll-to-post-for-group-id**: Listens globally to scroll to a specific post for a group.

## Examples

```typescript
import "./yp-posts-list.js";

const groupData = { /* ...YpGroupData... */ };

html`
  <yp-posts-list
    .group="${groupData}"
    .posts="${[]}"
    filter="newest"
    statusFilter="open"
  ></yp-posts-list>
`;
```
