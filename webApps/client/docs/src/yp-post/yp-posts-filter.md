# YpPostsFilter

The `YpPostsFilter` class is a custom element that provides filtering functionality for posts within a group. It allows users to filter posts by different criteria such as top, newest, most debated, and random. It also supports filtering by categories within a group.

## Properties

| Name               | Type                          | Description                                                                 |
|--------------------|-------------------------------|-----------------------------------------------------------------------------|
| group              | YpGroupData                   | The group data object containing information about the group.                |
| filterName         | string \| undefined           | The name of the current filter applied.                                     |
| filter             | string                        | The current filter criteria (e.g., "newest", "top").                        |
| categoryId         | number \| undefined           | The ID of the selected category for filtering.                              |
| categoryName       | string \| undefined           | The name of the selected category for filtering.                            |
| subTitle           | string                        | A subtitle that describes the current filtering criteria.                   |
| searchingFor       | string \| undefined           | The search term used for filtering posts.                                   |
| showFilter         | boolean                       | A flag indicating whether the filter options should be displayed.           |
| postsCount         | number \| undefined           | The count of posts that match the current filter criteria.                  |
| allPostCount       | number                        | The total count of all posts within the group.                              |
| tabName            | string \| undefined           | The name of the current tab.                                                |
| category           | YpCategoryData \| undefined   | The selected category data object for filtering.                            |
| categoriesWithCount| Array<YpCategoryData> \| undefined | An array of categories with their post counts for filtering options. |

## Methods

| Name               | Parameters                    | Return Type | Description                                                                 |
|--------------------|-------------------------------|-------------|-----------------------------------------------------------------------------|
| _getCategoryCount  | id: number, categoryCounts: Array<YpCategoriesCount> | number | Retrieves the count of posts for a given category ID.                       |
| _oldCategory       | category: YpCategoryData      | boolean     | Determines if the category is considered "old" based on its ID.             |
| _openDropDown      |                               | void        | Opens the dropdown menu for category selection.                             |
| openFilter         |                               | void        | Opens the filter interface for user interaction.                            |
| _languageEvent     | event: CustomEvent            | void        | Handles language change events and updates the title accordingly.           |
| searchFor          | value: string                 | void        | Initiates a search for posts with the given value.                          |
| _updateTitle       |                               | void        | Updates the subtitle based on the current filter and search criteria.       |
| _changeFilter      | event: CustomEvent            | Promise<void> | Handles changes to the filter selection and updates the view.             |
| _changeCategory    | event: CustomEvent            | void        | Handles changes to the category selection and updates the view.             |
| buildPostsUrlPath  |                               | string      | Constructs the URL path for the filtered posts based on the current criteria. |
| _updateAfterFiltering |                           | void        | Updates the view after a filter or category change.                         |
| _ifCategories      |                               | boolean     | Checks if the group has categories available for filtering.                 |
| resetSelection     | id: string \| undefined       | void        | Resets the category selection to the provided ID or clears it if undefined. |
| _setupCategories   |                               | Promise<void> | Sets up the categories with their post counts for filtering options.      |
| _updateMainListMenuValue |                       | void        | Updates the main list menu with the current filter value.                   |
| updated            | changedProperties: Map<string \| number \| symbol, unknown> | void | Handles updates to the component's properties. |
| chunk              | input: Array<any>, size: number | Array<Array<any>> | Splits an array into chunks of a specified size. |
| _categoryItems     |                               | Array<Array<YpCategoryData>> | Returns a chunked array of categories.        |
| _categoryImageSrc  | category: YpCategoryData      | string      | Returns the image source URL for a given category's icon.                   |

## Events (if any)

- **yp-filter-category-change**: Emitted when the category filter changes.
- **refresh-group**: Emitted when the group needs to be refreshed due to a filter change.
- **yp-filter-changed**: Emitted when the filter criteria changes.

## Examples

```typescript
// Example usage of the YpPostsFilter component
<yp-posts-filter
  .group=${yourGroupData}
  .filterName=${"newest"}
  .filter=${"top"}
  .categoryId=${123}
  .categoryName=${"General"}
  .subTitle=${"Top Posts - General"}
  .searchingFor=${"Environment"}
  .showFilter=${true}
  .postsCount=${100}
  .allPostCount=${500}
  .tabName=${"discussions"}
  .category=${yourCategoryData}
  .categoriesWithCount=${yourCategoriesWithCount}
></yp-posts-filter>
```

Note: The `YpGroupData`, `YpCategoryData`, `YpCategoriesCount`, and `YpCategoriesCountInfo` types are assumed to be defined elsewhere in the application and are used here for property typing.