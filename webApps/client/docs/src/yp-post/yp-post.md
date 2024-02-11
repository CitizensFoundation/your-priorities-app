# YpPost

The `YpPost` class extends `YpCollection` and represents a component for displaying and interacting with posts. It includes features such as rendering post headers, tabs for different post sections, and handling new post creation.

## Properties

| Name              | Type                | Description                                                                 |
|-------------------|---------------------|-----------------------------------------------------------------------------|
| isAdmin           | Boolean             | Indicates if the current user is an admin.                                  |
| disableNewPosts   | Boolean             | If true, new post creation is disabled.                                     |
| currentPage       | String \| undefined | The current page identifier.                                                 |
| post              | YpPostData \| undefined | The post data to be displayed.                                              |
| scrollToPointId   | Number \| undefined | The ID of the point to scroll to within the post.                            |
| debateCount       | String \| undefined | The count of debates related to the post, as a string.                      |
| photosCount       | String \| undefined | The count of photos related to the post, as a string.                       |

## Methods

| Name                        | Parameters | Return Type | Description                                                                 |
|-----------------------------|------------|-------------|-----------------------------------------------------------------------------|
| scrollToCollectionItemSubClass | None       | void        | Placeholder method, currently does nothing.                                 |
| renderPostHeader            | None       | TemplateResult | Renders the header of the post.                                             |
| renderPostTabs              | None       | TemplateResult \| undefined | Renders the tabs for different post sections.                               |
| renderCurrentPostTabPage    | None       | TemplateResult \| undefined | Renders the content of the currently selected post tab.                     |
| _selectedTabChanged         | None       | void        | Handles changes to the selected tab.                                        |
| _newPost                    | None       | void        | Handles the creation of a new post.                                         |
| _updatePostImageCount       | event: CustomEvent | void | Updates the count of images related to the post.                            |
| _updateDebateInfo           | event: CustomEvent | void | Updates the debate count information.                                       |
| _mainContainerClasses       | None       | String      | Returns the CSS classes for the main container based on the `wide` property.|
| _headerClasses              | None       | String      | Returns the CSS classes for the header based on the `wide` property.        |
| postName                    | None       | String      | Returns the truncated and trimmed name of the post.                         |
| postDescription             | None       | String      | Returns the truncated and trimmed description of the post.                  |
| _getPost                    | None       | Promise<void> | Fetches the post data from the server.                                      |
| collectionIdChanged         | None       | void        | Handles changes to the `collectionId` property.                             |
| _processIncomingPost        | fromCache: Boolean | void | Processes the incoming post data, optionally from cache.                    |
| _processRecommendation      | recommendedPost: YpPostData | void | Processes the recommended post data.                                        |
| refresh                     | None       | void        | Refreshes the component based on the current post data.                     |

## Events (if any)

- **yp-new-post**: Emitted when a new post is created.
- **yp-debate-info**: Emitted to update debate information.
- **yp-post-image-count**: Emitted to update the post image count.
- **yp-change-header**: Emitted to change the header information.
- **yp-set-next-post**: Emitted to set the next post information.
- **yp-set-home-link**: Emitted to set the home link data.

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
      hideNewPost: false,
      hideNewPostOnPostPage: false
    }
  }
};
document.body.appendChild(ypPostElement);
```

Note: The example above is a simplified usage scenario. In a real-world application, the `yp-post` component would be used within a larger context where properties are bound to application state and events are handled accordingly.