# YpPostsFilter

A web component for filtering and categorizing posts within a group, providing UI controls for selecting filters and categories, and managing the state and navigation for filtered post lists.

## Properties

| Name                | Type                                      | Description                                                                                 |
|---------------------|-------------------------------------------|---------------------------------------------------------------------------------------------|
| group               | YpGroupData                               | The group data object containing group and category information.                             |
| filterName          | string \| undefined                       | The translated name of the current filter.                                                  |
| filter              | string                                    | The current filter applied to the posts (e.g., "newest", "top").                            |
| categoryId          | number \| undefined                       | The ID of the currently selected category.                                                  |
| categoryName        | string \| undefined                       | The name of the currently selected category.                                                |
| subTitle            | string                                    | The subtitle displayed in the filter UI.                                                    |
| searchingFor        | string \| undefined                       | The current search query string, if searching is active.                                    |
| showFilter          | boolean                                   | Whether to show the filter dropdown UI.                                                     |
| postsCount          | number \| undefined                       | The number of posts currently shown (filtered).                                             |
| allPostCount        | number                                    | The total number of posts across all categories.                                            |
| tabName             | string \| undefined                       | The name of the current tab (used in URL construction).                                     |
| category            | YpCategoryData \| undefined               | The currently selected category object.                                                     |
| categoriesWithCount | Array&lt;YpCategoryData&gt; \| undefined  | The list of categories with their post counts, for populating the category dropdown.        |

## Methods

| Name                        | Parameters                                                                 | Return Type | Description                                                                                                 |
|-----------------------------|----------------------------------------------------------------------------|-------------|-------------------------------------------------------------------------------------------------------------|
| render                      | —                                                                          | unknown     | Renders the component's template.                                                                           |
| _getCategoryCount           | id: number, categoryCounts: Array&lt;YpCategoriesCount&gt;                 | number      | Returns the post count for a given category ID from a list of category counts.                              |
| _oldCategory                | category: YpCategoryData                                                   | boolean     | Determines if a category is considered "old" (ID less than 804).                                            |
| _openDropDown               | —                                                                          | void        | Opens the dropdown menu for category selection.                                                             |
| openFilter                  | —                                                                          | void        | Triggers an activity event for opening the filter.                                                          |
| _languageEvent              | event: CustomEvent                                                         | void        | Handles language change events and updates the title accordingly.                                            |
| searchFor                   | value: string                                                              | void        | Initiates a search for posts matching the given value, updates navigation, and fires a refresh event.       |
| _updateTitle                | —                                                                          | void        | Updates the subtitle based on the current filter, category, or search state.                                |
| _changeFilter               | event: CustomEvent                                                         | Promise&lt;void&gt; | Handles changes to the post filter dropdown and updates the filter state.                                    |
| _changeCategory             | event: CustomEvent                                                         | void        | Handles changes to the category dropdown, updates state, and fires a category change event.                 |
| buildPostsUrlPath           | —                                                                          | string      | Constructs the URL path for the current filter and category selection.                                      |
| _updateAfterFiltering       | —                                                                          | void        | Updates navigation and fires a refresh event after filtering.                                               |
| _ifCategories               | —                                                                          | boolean     | Returns true if the group has categories.                                                                   |
| resetSelection              | id?: string \| undefined                                                   | void        | Resets the category dropdown selection to the specified ID or clears it.                                    |
| _setupCategories            | —                                                                          | Promise&lt;void&gt; | Fetches category counts from the server and sets up the categoriesWithCount property.                        |
| _updateMainListMenuValue    | —                                                                          | void        | Updates the main filter dropdown to reflect the current filter value.                                       |
| updated                     | changedProperties: Map&lt;string \| number \| symbol, unknown&gt;          | void        | Lifecycle method called after properties are updated; manages state and UI updates.                         |
| chunk                       | input: Array&lt;any&gt;, size: number                                      | Array&lt;any[]&gt; | Splits an array into chunks of the specified size.                                                          |
| _categoryItems              | —                                                                          | Array&lt;any[]&gt; | Returns the group categories split into chunks of 7 for display purposes.                                   |
| _categoryImageSrc           | category: YpCategoryData                                                   | string      | Returns the image URL for a category's icon using YpMediaHelpers.                                           |

## Events

- **refresh-group**: Fired after filtering or searching to indicate the group data should be refreshed.
- **yp-filter-category-change**: Fired when the category filter changes, with the new category ID as detail.
- **yp-filter-changed**: Fired when the main filter changes, with the new filter value as detail.

## Examples

```typescript
import "./yp-posts-filter.js";

const filter = document.createElement("yp-posts-filter");
filter.group = myGroupData;
filter.tabName = "discussion";
document.body.appendChild(filter);

filter.addEventListener("yp-filter-category-change", (e) => {
  console.log("Category changed to:", e.detail);
});

filter.addEventListener("yp-filter-changed", (e) => {
  console.log("Filter changed to:", e.detail);
});
```
