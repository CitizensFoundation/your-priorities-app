# YpPostsList

The `YpPostsList` class is a custom web component that extends `YpBaseElement`. It is designed to display a list of posts with various filtering and searching capabilities. The component uses the Lit library for rendering and managing state.

## Properties

| Name                  | Type                          | Description                                                                 |
|-----------------------|-------------------------------|-----------------------------------------------------------------------------|
| `searchingFor`        | `string \| undefined`         | The current search query string.                                            |
| `subTitle`            | `string \| undefined`         | Subtitle for the posts filter.                                              |
| `filter`              | `string`                      | The current filter applied to the posts, default is "newest".               |
| `statusFilter`        | `string`                      | The status filter applied to the posts, default is "open".                  |
| `hideCategories`      | `boolean`                     | Whether to hide categories in the filter.                                   |
| `posts`               | `Array<YpPostData> \| undefined` | The list of posts to display.                                               |
| `userId`              | `number \| undefined`         | The ID of the user whose posts are being displayed.                         |
| `group`               | `YpGroupData`                 | The group data associated with the posts.                                   |
| `categoryId`          | `number \| undefined`         | The ID of the selected category.                                            |
| `postsCount`          | `number \| undefined`         | The total number of posts available.                                        |
| `selectedCategoryName`| `string \| undefined`         | The name of the selected category.                                          |
| `selectedGroupTab`    | `number \| undefined`         | The index of the selected group tab.                                        |
| `noPosts`             | `boolean`                     | Whether there are no posts to display.                                      |
| `showSearchIcon`      | `boolean`                     | Whether to show the search icon.                                            |
| `grid`                | `boolean`                     | Whether to display posts in a grid layout. Reflects to attribute.           |
| `randomSeed`          | `number \| undefined`         | A random seed used for random sorting of posts.                             |

## Methods

| Name                        | Parameters                                                                 | Return Type     | Description                                                                 |
|-----------------------------|----------------------------------------------------------------------------|-----------------|-----------------------------------------------------------------------------|
| `render`                    | None                                                                       | `TemplateResult`| Renders the component's template.                                           |
| `renderPostItem`            | `post: YpPostData, index?: number`                                         | `TemplateResult`| Renders a single post item.                                                 |
| `desktopListFormat`         | None                                                                       | `boolean`       | Checks if the desktop list format should be used.                           |
| `wideNotListFormat`         | None                                                                       | `boolean`       | Checks if the wide not list format should be used.                          |
| `_isLastItem`               | `index: number`                                                            | `boolean`       | Determines if the given index is the last item in the list.                 |
| `_keypress`                 | `event: KeyboardEvent`                                                     | `void`          | Handles keypress events for selecting items.                                |
| `_categoryChanged`          | `event: CustomEvent`                                                       | `void`          | Handles category change events.                                             |
| `_filterChanged`            | `event: CustomEvent`                                                       | `void`          | Handles filter change events.                                               |
| `firstUpdated`              | `changedProperties: Map<string | number | symbol, unknown>`               | `void`          | Lifecycle method called after the component's first update.                 |
| `_clearSearch`              | None                                                                       | `void`          | Clears the current search query.                                            |
| `scrollEvent`               | `event: { last: number }`                                                  | `void`          | Handles scroll events to load more data.                                    |
| `scrollToPostForGroupId`    | `event: CustomEvent`                                                       | `void`          | Scrolls to a specific post for a given group ID.                            |
| `connectedCallback`         | None                                                                       | `Promise<void>` | Lifecycle method called when the component is added to the document.        |
| `disconnectedCallback`      | None                                                                       | `void`          | Lifecycle method called when the component is removed from the document.    |
| `_selectedItemChanged`      | `event: CustomEvent`                                                       | `void`          | Handles item selection changes.                                             |
| `_refreshPost`              | `event: CustomEvent`                                                       | `Promise<void>` | Refreshes a specific post.                                                  |
| `_getPostLink`              | `post: YpPostData`                                                         | `string \| undefined` | Gets the link for a specific post.                                          |
| `scrollOffset`              | None                                                                       | `number \| null` | Gets the scroll offset for the post list.                                   |
| `_tapOnFilter`              | None                                                                       | `void`          | Handles tap events on the filter.                                           |
| `_search`                   | None                                                                       | `void`          | Initiates a search with the current query.                                  |
| `buildPostsUrlPath`         | None                                                                       | `string`        | Builds the URL path for fetching posts.                                     |
| `scrollToPost`              | `post: YpPostData`                                                         | `Promise<void>` | Scrolls to a specific post in the list.                                     |
| `updated`                   | `changedProperties: Map<string | number | symbol, unknown>`               | `void`          | Lifecycle method called after the component's update.                       |
| `refreshGroupFromFilter`    | None                                                                       | `void`          | Refreshes the group data based on the current filter.                       |
| `_loadMoreData`             | None                                                                       | `Promise<void>` | Loads more post data from the server.                                       |
| `_checkForMultipleLanguages`| `posts: Array<YpPostData>`                                                 | `void`          | Checks for multiple languages in the posts.                                 |
| `_processCategories`        | None                                                                       | `void`          | Processes the categories for the current group.                             |

## Events

- **yp-filter-category-change**: Emitted when the category filter changes.
- **yp-filter-changed**: Emitted when the post filter changes.
- **yp-scroll-to-post-for-group-id**: Emitted to scroll to a specific post for a group ID.
- **refresh**: Emitted to refresh a post.

## Examples

```typescript
// Example usage of the YpPostsList component
import './yp-posts-list.js';

const postsList = document.createElement('yp-posts-list');
postsList.group = { id: 1, configuration: { hidePostFilterAndSearch: false } };
document.body.appendChild(postsList);
```