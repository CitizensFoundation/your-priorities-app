# YpPostsFilter

The `YpPostsFilter` class is a custom web component that extends `YpBaseElement`. It provides functionality for filtering and categorizing posts within a group, allowing users to select different filters and categories to view posts accordingly.

## Properties

| Name                | Type                              | Description                                                                 |
|---------------------|-----------------------------------|-----------------------------------------------------------------------------|
| group               | YpGroupData                       | The group data associated with the posts.                                   |
| filterName          | string \| undefined               | The name of the current filter applied.                                     |
| filter              | string                            | The current filter applied to the posts. Defaults to "newest".              |
| categoryId          | number \| undefined               | The ID of the selected category.                                            |
| categoryName        | string \| undefined               | The name of the selected category.                                          |
| subTitle            | string                            | The subtitle displayed, indicating the current filter and category.         |
| searchingFor        | string \| undefined               | The search term used for filtering posts.                                   |
| showFilter          | boolean                           | Indicates whether the filter options should be displayed. Defaults to true. |
| postsCount          | number \| undefined               | The count of posts available.                                               |
| allPostCount        | number                            | The total count of all posts. Defaults to 0.                                |
| tabName             | string \| undefined               | The name of the current tab.                                                |
| category            | YpCategoryData \| undefined       | The data of the selected category.                                          |
| categoriesWithCount | Array<YpCategoryData> \| undefined| The list of categories with their respective post counts.                   |

## Methods

| Name                     | Parameters                                                                 | Return Type | Description                                                                 |
|--------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| render                   | None                                                                       | TemplateResult | Renders the HTML template for the component.                                |
| _getCategoryCount        | id: number, categoryCounts: Array<YpCategoriesCount>                       | number      | Retrieves the count of posts for a specific category ID.                    |
| _oldCategory             | category: YpCategoryData                                                   | boolean     | Determines if a category is considered old based on its ID.                 |
| _openDropDown            | None                                                                       | void        | Opens the dropdown menu for category selection.                             |
| openFilter               | None                                                                       | void        | Triggers an activity indicating the filter is opened.                       |
| _languageEvent           | event: CustomEvent                                                         | void        | Handles language change events and updates the title accordingly.           |
| searchFor                | value: string                                                              | void        | Initiates a search for posts based on the provided search term.             |
| _updateTitle             | None                                                                       | void        | Updates the subtitle based on the current filter and category.              |
| _changeFilter            | event: CustomEvent                                                         | Promise<void> | Changes the current filter based on user selection.                         |
| _changeCategory          | event: CustomEvent                                                         | void        | Changes the current category based on user selection.                       |
| buildPostsUrlPath        | None                                                                       | string      | Constructs the URL path for the current posts view based on filter and category. |
| _updateAfterFiltering    | None                                                                       | void        | Updates the view after a filter or category change.                         |
| _ifCategories            | None                                                                       | boolean     | Checks if the group has categories available.                               |
| resetSelection           | id: string \| undefined = undefined                                        | void        | Resets the category selection to the specified ID or clears it.             |
| _setupCategories         | None                                                                       | Promise<void> | Sets up the categories with their respective post counts.                   |
| _updateMainListMenuValue | None                                                                       | void        | Updates the main list menu value to reflect the current filter.             |
| updated                  | changedProperties: Map<string \| number \| symbol, unknown>                | void        | Lifecycle method called when properties change, updating the component state. |
| chunk                    | input: Array<any>, size: number                                            | Array<any>  | Splits an array into chunks of the specified size.                          |
| _categoryItems           | None                                                                       | Array<any>  | Retrieves the categories in chunks for display.                             |
| _categoryImageSrc        | category: YpCategoryData                                                   | string      | Retrieves the image source URL for a category's icon.                       |

## Examples

```typescript
// Example usage of the YpPostsFilter component
import './path/to/yp-posts-filter.js';

const filterElement = document.createElement('yp-posts-filter');
filterElement.group = { /* YpGroupData object */ };
document.body.appendChild(filterElement);
```

This documentation provides a comprehensive overview of the `YpPostsFilter` class, detailing its properties, methods, and usage example.