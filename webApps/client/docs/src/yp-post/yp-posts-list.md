# YpPostsList

A custom element that renders a list of posts with various filters and search functionality. It is part of a larger application and interacts with a server API to fetch and display posts.

## Properties

| Name                 | Type                          | Description                                                                 |
|----------------------|-------------------------------|-----------------------------------------------------------------------------|
| searchingFor         | string \| undefined           | The current search term used to filter posts.                               |
| subTitle             | string \| undefined           | A subtitle for the posts list.                                              |
| filter               | string                        | The current filter applied to the posts list (e.g., "newest").              |
| statusFilter         | string                        | The current status filter applied to the posts list (e.g., "open").         |
| posts                | Array<YpPostData> \| undefined| The array of posts to be displayed.                                         |
| userId               | number \| undefined           | The ID of the user whose posts are being displayed.                         |
| group                | YpGroupData                   | The group data associated with the posts.                                   |
| categoryId           | number \| undefined           | The ID of the category used to filter posts.                                |
| postsCount           | number \| undefined           | The total number of posts available.                                        |
| selectedCategoryName | string \| undefined           | The name of the selected category.                                          |
| selectedGroupTab     | number \| undefined           | The index of the selected group tab.                                        |
| noPosts              | boolean                       | Indicates whether there are no posts to display.                            |
| showSearchIcon       | boolean                       | Determines whether the search icon should be shown.                         |
| grid                 | boolean                       | Determines whether the posts should be displayed in a grid layout.          |
| randomSeed           | number \| undefined           | A random seed used for random sorting of posts.                             |
| moreToLoad           | boolean                       | Indicates whether there are more posts to load.                             |
| moreFromScrollTriggerActive | boolean               | Indicates whether the trigger to load more posts from scrolling is active.  |
| resetListSize        | Function \| undefined         | A function to reset the size of the list.                                   |
| skipIronListWidth    | boolean                       | Indicates whether the width of the iron list should be skipped.             |

## Methods

| Name                  | Parameters                   | Return Type | Description                                                                 |
|-----------------------|------------------------------|-------------|-----------------------------------------------------------------------------|
| renderPostItem        | post: YpPostData, index?: number \| undefined | TemplateResult | Renders a single post item.                                                 |
| desktopListFormat     | None                         | boolean     | Determines if the desktop list format should be used.                       |
| wideNotListFormat     | None                         | boolean     | Determines if the wide format that is not a list should be used.            |
| _isLastItem           | index: number                | boolean     | Checks if the given index corresponds to the last item in the posts list.   |
| _keypress             | event: KeyboardEvent         | void        | Handles keypress events on post items.                                      |
| _categoryChanged      | event: CustomEvent           | void        | Handles changes to the selected category.                                   |
| _filterChanged        | event: CustomEvent           | void        | Handles changes to the selected filter.                                     |
| _clearSearch          | None                         | void        | Clears the current search term.                                             |
| scrollEvent           | event: { last: number }      | void        | Handles scroll events for loading more data.                                |
| _selectedItemChanged  | event: CustomEvent           | void        | Handles selection changes of post items.                                    |
| _refreshPost          | event: CustomEvent           | Promise<void> | Refreshes a post in the list.                                              |
| _getPostLink          | post: YpPostData             | string \| undefined | Gets the link for a post.                                                  |
| scrollOffset          | None                         | number \| null | Gets the scroll offset for the list.                                       |
| _tapOnFilter          | None                         | void        | Handles tap events on the filter.                                           |
| _search               | None                         | void        | Initiates a search with the current search term.                            |
| buildPostsUrlPath     | None                         | string      | Builds the URL path for fetching posts based on current filters.            |
| scrollToPost          | post: YpPostData             | Promise<void> | Scrolls to a specific post in the list.                                    |
| refreshGroupFromFilter| None                         | void        | Refreshes the group data based on the current filter.                       |
| _loadMoreData         | None                         | Promise<void> | Loads more posts data from the server.                                     |
| _checkForMultipleLanguages | posts: Array<YpPostData> | void        | Checks if there are multiple languages in the posts and prompts for translation if necessary. |
| _processCategories    | None                         | void        | Processes the categories for the current group.                             |

## Events (if any)

- **yp-filter-category-change**: Emitted when the category filter changes.
- **yp-filter-changed**: Emitted when the filter changes.
- **refresh**: Emitted when a post needs to be refreshed.
- **yp-post-count**: Emitted with the post count information.
- **yp-refresh-activities-scroll-threshold**: Emitted to refresh the scroll threshold for activities.

## Examples

```typescript
// Example usage of the YpPostsList element
<yp-posts-list
  .group="${this.groupData}"
  .posts="${this.postsData}"
  .filter="${'newest'}"
  .statusFilter="${'open'}"
  .grid="${true}"
></yp-posts-list>
```

Note: The above example assumes that `this.groupData` and `this.postsData` are already defined and contain the necessary data to populate the `YpPostsList` element.