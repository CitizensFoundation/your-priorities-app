# YpPost

The `YpPost` class extends the `YpCollection` class and represents a component that displays a post with various tabs such as debate, news, location, and photos. It includes features like scrolling to a specific point, updating debate and photo counts, and handling new post creation.

## Properties

| Name              | Type                      | Description                                                                 |
|-------------------|---------------------------|-----------------------------------------------------------------------------|
| isAdmin           | Boolean                   | Indicates if the current user is an admin.                                  |
| disableNewPosts   | Boolean                   | Determines whether new posts can be created.                                |
| currentPage       | String \| undefined       | The current page being viewed.                                              |
| post              | YpPostData \| undefined   | The post data to be displayed.                                              |
| scrollToPointId   | Number \| undefined       | The ID of the point to scroll to in the post.                               |
| debateCount       | String \| undefined       | The count of debates related to the post, as a string.                      |
| photosCount       | String \| undefined       | The count of photos related to the post, as a string.                       |

## Methods

| Name                        | Parameters | Return Type | Description                                                                 |
|-----------------------------|------------|-------------|-----------------------------------------------------------------------------|
| scrollToCollectionItemSubClass | None       | void        | Placeholder method for scrolling to a collection item.                      |
| renderPostHeader            | None       | TemplateResult | Renders the header of the post.                                             |
| renderPostTabs              | None       | TemplateResult \| undefined | Renders the tabs for the post.                                              |
| renderCurrentPostTabPage    | None       | TemplateResult \| undefined | Renders the content of the currently selected post tab.                     |
| _selectedTabChanged         | None       | void        | Handles changes to the selected tab.                                        |
| _newPost                    | None       | void        | Handles the creation of a new post.                                         |
| _updatePostImageCount       | event: CustomEvent | void | Updates the count of images in the post.                                    |
| _updateDebateInfo           | event: CustomEvent | void | Updates the debate information for the post.                                |
| _mainContainerClasses       | None       | String      | Returns the CSS classes for the main container based on the layout.         |
| _headerClasses              | None       | String      | Returns the CSS classes for the header based on the layout.                 |
| postName                    | None       | String      | Returns the truncated and trimmed name of the post.                         |
| postDescription             | None       | String      | Returns the truncated and trimmed description of the post.                  |
| _getPost                    | None       | Promise<void> | Fetches the post data from the server.                                      |
| collectionIdChanged         | None       | void        | Handles changes to the collection ID and fetches the post if necessary.     |
| _processIncomingPost        | fromCache: Boolean | void | Processes the incoming post data and updates the cache if needed.           |
| _processRecommendation      | recommendedPost: YpPostData | void | Processes the recommended post data.                                        |
| refresh                     | None       | void        | Refreshes the component and updates various properties based on the post.   |

## Events (if any)

- **yp-new-post**: Emitted when a new post is created.
- **yp-debate-info**: Emitted when debate information is updated.
- **yp-post-image-count**: Emitted when the post image count is updated.
- **yp-change-header**: Emitted when the header information needs to be updated.
- **yp-set-next-post**: Emitted when setting the next post in a sequence.
- **yp-set-home-link**: Emitted when setting the home link data.
- **yp-refresh**: Emitted when the component needs to be refreshed.

## Examples

```typescript
// Example usage of the YpPost component
const ypPostElement = document.createElement('yp-post');
ypPostElement.isAdmin = true;
ypPostElement.disableNewPosts = false;
ypPostElement.currentPage = 'post';
ypPostElement.post = {
  id: 123,
  name: 'Example Post',
  description: 'This is an example post description.',
  Group: {
    id: 456,
    name: 'Example Group',
    configuration: {
      hideAllTabs: false,
      canAddNewPosts: true
    }
  }
};
document.body.appendChild(ypPostElement);
```

Note: The example above is a simplified usage scenario. In a real-world application, the `YpPost` component would be used within a larger context where properties are bound to application state and events are handled accordingly.