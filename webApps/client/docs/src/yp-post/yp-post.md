# YpPost

A custom web component for displaying and managing a single post within a group context. It provides navigation between posts, tabbed views (debate, news, location, photos), and integrates with group/community theming, analytics, and access control. Inherits from `YpCollection`.

## Properties

| Name                | Type                        | Description                                                                                 |
|---------------------|-----------------------------|---------------------------------------------------------------------------------------------|
| isAdmin             | boolean                     | Indicates if the current user has admin privileges for the post.                            |
| disableNewPosts     | boolean                     | If true, disables the ability to add new posts.                                             |
| currentPage         | string \| undefined         | The current page context (e.g., "post").                                                    |
| post                | YpPostData \| undefined     | The post data object being displayed.                                                       |
| scrollToPointId     | number \| undefined         | If set, scrolls to a specific point within the post.                                        |
| debateCount         | string \| undefined         | The number of debates associated with the post (formatted).                                 |
| photosCount         | string \| undefined         | The number of photos associated with the post (formatted).                                  |
| currentPostIndex    | number \| undefined         | The index of the current post within the group.                                             |
| totalPosts          | number \| undefined         | The total number of posts in the group.                                                     |
| postPositionCounter | string                      | A string representing the current post's position (e.g., "2 / 10").                         |

## Methods

| Name                                 | Parameters                                                                 | Return Type         | Description                                                                                                 |
|-------------------------------------- |----------------------------------------------------------------------------|---------------------|-------------------------------------------------------------------------------------------------------------|
| scrollToCollectionItemSubClass        | none                                                                       | void                | Resets `scrollToPointId` to undefined.                                                                      |
| constructor                          | none                                                                       | YpPost              | Initializes the component with default values and parent constructor.                                        |
| scrollToCollection_processIncomingPostItemSubClass | none                                                        | void                | Placeholder for processing incoming post item (currently does nothing).                                      |
| setupTheme                           | none                                                                       | void                | Sets up the theme for the post based on group/community configuration.                                       |
| static get styles                    | none                                                                       | CSSResult[]         | Returns the component's styles.                                                                              |
| leftArrowDisabled (getter)           | none                                                                       | boolean             | Returns true if the left navigation arrow should be disabled.                                                |
| rightArrowDisabled (getter)          | none                                                                       | boolean             | Returns true if the right navigation arrow should be disabled.                                               |
| bothArrowsDisabled (getter)          | none                                                                       | boolean             | Returns true if both navigation arrows should be disabled.                                                   |
| handleKeydown                        | event: KeyboardEvent                                                       | void                | Handles keyboard navigation (left/right arrows, escape).                                                     |
| renderPostStaticHeader               | none                                                                       | TemplateResult      | Renders the static post header.                                                                              |
| renderPostHeader                     | none                                                                       | TemplateResult      | Renders the main post header.                                                                                |
| renderPostTabs                       | none                                                                       | TemplateResult      | Renders the tab navigation for the post (debate, news, location, photos).                                   |
| renderCurrentPostTabPage             | none                                                                       | TemplateResult \| undefined | Renders the content for the currently selected tab.                                                          |
| goToPreviousPost                     | none                                                                       | void                | Navigates to the previous post in the group.                                                                 |
| goToNextPost                         | none                                                                       | void                | Navigates to the next post in the group.                                                                     |
| renderNavigationButtons              | none                                                                       | TemplateResult      | Renders the left/right navigation buttons.                                                                   |
| isEditingPost (getter)               | none                                                                       | boolean             | Returns true if the post is currently being edited.                                                          |
| forAgentBundle (getter)              | none                                                                       | any                 | Returns the `forAgentBundle` query parameter from global state.                                              |
| render (override)                    | none                                                                       | TemplateResult      | Main render method for the component.                                                                        |
| tabDebateCount (getter)              | none                                                                       | string              | Returns the label for the debate tab, including the debate count.                                            |
| tabPhotosCount (getter)              | none                                                                       | string              | Returns the label for the photos tab, including the photos count.                                            |
| _selectedTabChanged                  | none                                                                       | void                | Handles logic when the selected tab changes.                                                                 |
| updated (override)                   | changedProperties: Map<string \| number \| symbol, unknown>                | void                | Lifecycle method called when properties are updated.                                                         |
| isPostPage (getter)                  | none                                                                       | boolean             | Returns true if the current page is "post".                                                                  |
| _newPost                             | none                                                                       | void                | Fires an event to create a new post.                                                                         |
| connectedCallback (override)         | none                                                                       | void                | Lifecycle method called when the component is added to the DOM.                                              |
| disconnectedCallback (override)      | none                                                                       | void                | Lifecycle method called when the component is removed from the DOM.                                          |
| _updatePostImageCount                | event: CustomEvent                                                         | void                | Updates the photos count when the image count changes.                                                       |
| _updateDebateInfo                    | event: CustomEvent                                                         | void                | Updates the debate count when debate info changes.                                                           |
| _mainContainerClasses                | none                                                                       | string              | Returns the CSS classes for the main container based on layout.                                              |
| _headerClasses                       | none                                                                       | string              | Returns the CSS classes for the header based on layout.                                                      |
| postName (getter)                    | none                                                                       | string              | Returns the truncated and trimmed post name.                                                                 |
| postDescription (getter)             | none                                                                       | string              | Returns the truncated and trimmed post description.                                                          |
| getCollection (override)             | none                                                                       | Promise<void>       | Warns if trying to get a collection in the post context.                                                     |
| _getPost                             | none                                                                       | Promise<void>       | Fetches the post data from the server and processes it.                                                      |
| collectionIdChanged (override)       | none                                                                       | void                | Handles logic when the collection ID changes (fetches from cache or server as needed).                       |
| _processIncomingPost                 | fromCache?: boolean                                                        | void                | Processes the incoming post data, updates cache, and sets admin status.                                      |
| updatePostPosition                   | postsList: YpPostData[]                                                    | void                | Updates the current post index and total posts based on the posts list.                                      |
| fetchGroupPosts                      | none                                                                       | Promise<void>       | Fetches the list of posts for the group and updates cache and position.                                      |
| setPostPositionCounter               | none                                                                       | void                | Sets the `postPositionCounter` string based on current index and total posts.                                |
| _processRecommendation               | recommendedPost: YpPostData                                                | void                | Processes a recommended post and fires an event for navigation.                                              |
| refresh (override)                   | none                                                                       | void                | Refreshes the component, updates analytics, access, and other group/post-related state.                      |

## Events

- **yp-scroll-to-post-for-group-id**: Fired when navigating to a previous or next post, with `{ groupId, postId }`.
- **yp-new-post**: Fired when the user initiates creating a new post, with `{ group }`.
- **yp-set-next-post**: Fired when a recommended post is processed, with `{ currentPostId, goForwardToPostId, goForwardPostName }`.
- **yp-change-header**: Fired to update the app header, with `{ headerTitle, documentTitle, headerDescription, backPath, backListItem, hideHelpIcon }`.
- **yp-set-home-link**: Fired to set the home link, with `{ type, id, name }`.
- **yp-set-next-post**: Fired when a new recommended post is available for navigation.

## Examples

```typescript
import './yp-post.js';

const postElement = document.createElement('yp-post');
postElement.collectionId = 12345; // Set the post ID to display
document.body.appendChild(postElement);

// Listen for new post event
postElement.addEventListener('yp-new-post', (e) => {
  console.log('Create new post for group:', e.detail.group);
});
```
