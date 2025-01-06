# YpPostsGrid

`YpPostsGrid` is a custom web component that extends `YpPostsList` to display a grid of posts with filtering and search capabilities.

## Properties

| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| noPosts       | boolean | Indicates if there are no posts to display. |
| group         | object | Configuration object for the group of posts. |
| subTitle      | string | Subtitle for the filter component. |
| statusFilter  | string | Current status filter applied to the posts. |
| filter        | object | Filter object for the posts. |
| searchingFor  | string | Current search query. |
| categoryId    | string | ID of the category being filtered. |
| postsCount    | number | Number of posts available. |
| posts         | array  | Array of posts to be displayed. |
| grid          | boolean | Determines if the grid layout should be used. |
| showSearchIcon | boolean | Determines if the search icon should be displayed. |

## Methods

| Name               | Parameters        | Return Type | Description                 |
|--------------------|-------------------|-------------|-----------------------------|
| render             | none              | TemplateResult | Renders the component's template. |
| _tapOnFilter       | none              | void        | Handles the click event on the filter component. |
| refreshGroupFromFilter | none          | void        | Refreshes the group based on the filter changes. |
| _searchKey         | event: KeyboardEvent | void     | Handles the keydown event for the search input. |
| _clearSearch       | none              | void        | Clears the current search input. |
| _search            | none              | void        | Initiates a search based on the current input. |
| renderPostItem     | item: any         | TemplateResult | Renders an individual post item. |
| scrollEvent        | event: Event      | void        | Handles the scroll event for the virtualizer. |

## Examples

```typescript
// Example usage of the yp-posts-grid component
import './yp-posts-grid.js';

const postsGrid = document.createElement('yp-posts-grid');
document.body.appendChild(postsGrid);

postsGrid.posts = [
  { title: 'Post 1', content: 'Content of post 1' },
  { title: 'Post 2', content: 'Content of post 2' },
];

postsGrid.noPosts = false;
postsGrid.group = { configuration: { allPostsBlockedByDefault: false, hidePostFilterAndSearch: false } };
postsGrid.subTitle = 'Latest Posts';
postsGrid.statusFilter = 'active';
postsGrid.searchingFor = '';
postsGrid.categoryId = '123';
postsGrid.postsCount = 2;
postsGrid.grid = true;
postsGrid.showSearchIcon = true;
```