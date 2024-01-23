# YpPostListItem

`YpPostListItem` is a custom web component that extends `YpPostBaseWithAnswers` and `YpBaseElement` to display a post item within a list. It includes properties to control the visibility and styling of various elements such as the post cover, description, and actions. It also handles user interactions like clicking on the post to navigate to its details or sharing the post.

## Properties

| Name              | Type                  | Description                                                                 |
|-------------------|-----------------------|-----------------------------------------------------------------------------|
| selectedMenuItem  | string \| undefined   | The currently selected menu item.                                           |
| elevation         | number                | The elevation level for the shadow effect.                                  |
| post              | YpPostData            | The post data to be displayed. This property is marked as `override`.       |
| mini              | boolean               | A flag indicating if the post item should be displayed in a mini version.   |
| isAudioCover      | boolean               | A flag indicating if the post cover is an audio type.                       |
| isEndorsed        | boolean               | A flag indicating if the post is endorsed.                                  |

## Methods

| Name                  | Parameters            | Return Type | Description                                                                 |
|-----------------------|-----------------------|-------------|-----------------------------------------------------------------------------|
| computeSpanHidden     | items: Array<string>, index: number \| string | boolean | Determines if a span should be hidden based on the index within an array.   |
| postTags              | -                     | Array<string> | Retrieves an array of tags from the post's public data.                     |
| _onBottomClick        | event: CustomEvent    | void        | Prevents propagation of the bottom click event.                             |
| clickOnA              | -                     | void        | Triggers a click event on the main anchor element.                          |
| _savePostToBackCache  | -                     | void        | Saves the current post to the back cache.                                   |
| _getPostLink          | post: YpPostData      | string      | Generates a link to the post's detail page.                                 |
| _shareTap             | event: CustomEvent    | void        | Handles the share tap event and logs the activity.                          |
| hideDescription       | -                     | boolean     | Determines if the post description should be hidden.                        |
| hasPostAccess         | -                     | boolean     | Checks if the user has access to the post.                                  |
| goToPostIfNotHeader   | -                     | void        | Navigates to the post's detail page if not disabled.                        |
| updated               | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method called when properties change. Handles post changes.      |
| _postChanged          | -                     | void        | Updates the component state when the post property changes.                 |
| updateDescriptionIfEmpty | description: string | void        | Updates the post description if it is empty.                                |
| _refresh              | -                     | void        | Refreshes the component, typically after editing.                           |
| _openReport           | -                     | void        | Opens the report dialog for the post.                                       |
| _onReport             | -                     | void        | Handles the report action and notifies the user.                            |

## Events

- **refresh**: Emitted when the component requests a refresh, usually after a post edit.
- **open**: Emitted when a dialog is opened, such as the report dialog.

## Examples

```typescript
// Example usage of YpPostListItem
const postListItem = document.createElement('yp-post-list-item');
postListItem.post = {
  id: 123,
  name: 'Example Post',
  description: 'This is an example post description.',
  cover_media_type: 'image',
  Group: {
    configuration: {
      hidePostCover: false,
      hidePostDescription: false,
      hidePostActionsInGrid: false,
      usePostTagsForPostListItems: false,
      customRatings: false,
      disablePostPageLink: false,
      resourceLibraryLinkMode: false,
      hideSharing: false,
      allowWhatsAppSharing: false,
      hideDownVoteForPost: false
    }
  },
  public_data: {
    tags: 'example,post'
  },
  language: 'en'
};
document.body.appendChild(postListItem);
```

Please note that the above example is a simplified usage scenario. In a real-world application, you would need to ensure that the custom elements are properly registered and that the necessary data bindings and event listeners are set up.