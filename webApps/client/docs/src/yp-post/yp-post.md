# YpPost

The `YpPost` class is a custom web component that extends `YpCollection`. It represents a post within a group, providing functionalities to navigate between posts, render post details, and manage post-related actions.

## Properties

| Name               | Type                     | Description                                                                 |
|--------------------|--------------------------|-----------------------------------------------------------------------------|
| isAdmin            | boolean                  | Indicates if the current user has admin privileges for the post.            |
| disableNewPosts    | boolean                  | Determines if new posts can be added.                                       |
| currentPage        | string \| undefined      | The current page identifier.                                                |
| post               | YpPostData \| undefined  | The data object representing the current post.                              |
| scrollToPointId    | number \| undefined      | The ID of the point to scroll to within the post.                           |
| debateCount        | string \| undefined      | The count of debates associated with the post.                              |
| photosCount        | string \| undefined      | The count of photos associated with the post.                               |
| currentPostIndex   | number \| undefined      | The index of the current post in the group.                                 |
| totalPosts         | number \| undefined      | The total number of posts in the group.                                     |
| postPositionCounter| string                   | A string representing the position of the post within the group.            |

## Methods

| Name                                      | Parameters                          | Return Type | Description                                                                 |
|-------------------------------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| scrollToCollectionItemSubClass            | -                                   | void        | Resets the scroll point ID.                                                 |
| constructor                               | -                                   | -           | Initializes the component with default values.                              |
| scrollToCollection_processIncomingPostItemSubClass | -                                   | void        | Placeholder method for processing incoming post items.                      |
| setupTheme                                | -                                   | void        | Sets up the theme based on the post's group configuration.                  |
| get styles                                | -                                   | CSSResult[] | Returns the styles for the component.                                       |
| get leftArrowDisabled                     | -                                   | boolean     | Determines if the left navigation arrow should be disabled.                 |
| get rightArrowDisabled                    | -                                   | boolean     | Determines if the right navigation arrow should be disabled.                |
| get bothArrowsDisabled                    | -                                   | boolean     | Determines if both navigation arrows should be disabled.                    |
| handleKeydown                             | event: KeyboardEvent                | void        | Handles keyboard navigation for posts.                                      |
| renderPostStaticHeader                    | -                                   | TemplateResult | Renders the static header of the post.                                      |
| renderPostHeader                          | -                                   | TemplateResult | Renders the header of the post.                                             |
| renderPostTabs                            | -                                   | TemplateResult | Renders the tabs for the post.                                              |
| renderCurrentPostTabPage                  | -                                   | TemplateResult \| undefined | Renders the content of the currently selected post tab.                     |
| goToPreviousPost                          | -                                   | void        | Navigates to the previous post in the group.                                |
| goToNextPost                              | -                                   | void        | Navigates to the next post in the group.                                    |
| renderNavigationButtons                   | -                                   | TemplateResult | Renders the navigation buttons for the post.                                |
| get isEditingPost                         | -                                   | boolean     | Determines if the post is currently being edited.                           |
| get forAgentBundle                        | -                                   | boolean     | Checks if the post is for an agent bundle.                                  |
| render                                    | -                                   | TemplateResult | Renders the component.                                                      |
| get tabDebateCount                        | -                                   | string      | Returns the label for the debate tab with the count.                        |
| get tabPhotosCount                        | -                                   | string      | Returns the label for the photos tab with the count.                        |
| _selectedTabChanged                       | -                                   | void        | Handles changes to the selected tab.                                        |
| updated                                   | changedProperties: Map<string \| number \| symbol, unknown> | void | Called when the component is updated.                                       |
| get isPostPage                            | -                                   | boolean     | Determines if the current page is a post page.                              |
| _newPost                                  | -                                   | void        | Triggers the creation of a new post.                                        |
| connectedCallback                         | -                                   | void        | Lifecycle method called when the component is added to the DOM.             |
| disconnectedCallback                      | -                                   | void        | Lifecycle method called when the component is removed from the DOM.         |
| _updatePostImageCount                     | event: CustomEvent                  | void        | Updates the count of images in the post.                                    |
| _updateDebateInfo                         | event: CustomEvent                  | void        | Updates the debate information for the post.                                |
| _mainContainerClasses                     | -                                   | string      | Returns the CSS classes for the main container.                             |
| _headerClasses                            | -                                   | string      | Returns the CSS classes for the header.                                     |
| get postName                              | -                                   | string      | Returns the truncated name of the post.                                     |
| get postDescription                       | -                                   | string      | Returns the truncated description of the post.                              |
| getCollection                             | -                                   | Promise<void> | Placeholder method for getting the collection.                              |
| _getPost                                  | -                                   | Promise<void> | Fetches the post data from the server.                                      |
| collectionIdChanged                       | -                                   | void        | Handles changes to the collection ID.                                       |
| _processIncomingPost                      | fromCache: boolean = false          | void        | Processes the incoming post data.                                           |
| updatePostPosition                        | postsList: YpPostData[]             | void        | Updates the position of the post within the group.                          |
| fetchGroupPosts                           | -                                   | Promise<void> | Fetches the posts for the group from the server.                            |
| setPostPositionCounter                    | -                                   | void        | Sets the post position counter string.                                      |
| _processRecommendation                    | recommendedPost: YpPostData         | void        | Processes the recommended post data.                                        |
| refresh                                   | -                                   | void        | Refreshes the component with the latest post data.                          |

## Examples

```typescript
// Example usage of the YpPost component
import './yp-post.js';

const postElement = document.createElement('yp-post');
document.body.appendChild(postElement);

postElement.post = {
  id: 1,
  name: 'Sample Post',
  description: 'This is a sample post description.',
  group_id: 123,
  Group: {
    id: 123,
    name: 'Sample Group',
    configuration: {
      theme: 'dark',
    },
  },
};
```