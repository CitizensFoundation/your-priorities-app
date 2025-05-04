# YpPostListItem

A web component for displaying a post item in a list, with support for cover media, actions, tags, sharing, and structured answers. It is designed for use in a social or content-sharing platform and is highly configurable based on the post's group configuration.

## Properties

| Name             | Type                       | Description                                                                                 |
|------------------|----------------------------|---------------------------------------------------------------------------------------------|
| selectedMenuItem | `string \| undefined`      | The currently selected menu item, if any.                                                   |
| mini             | `boolean`                  | If true, renders the post in a compact "mini" mode.                                         |
| isAudioCover     | `boolean`                  | If true, indicates the post's cover media is audio.                                         |
| post             | `YpPostData`               | The post data object to render.                                                             |

## Methods

| Name                           | Parameters                                                                 | Return Type | Description                                                                                                   |
|--------------------------------|----------------------------------------------------------------------------|-------------|---------------------------------------------------------------------------------------------------------------|
| `structuredAnswerTruncateLength` | None                                                                     | `number`    | Gets the truncate length for structured answers, adjusting for URLs.                                          |
| `renderDescription`            | None                                                                      | `unknown`   | Renders the post description or structured answers using `<yp-magic-text>`.                                  |
| `renderTags`                   | None                                                                      | `unknown`   | Renders the post tags using `<yp-post-tags>`.                                                                 |
| `render`                       | None                                                                      | `unknown`   | Main render method for the component.                                                                         |
| `renderShare`                  | None                                                                      | `unknown`   | Renders the share button if sharing is enabled.                                                               |
| `renderDebate`                 | None                                                                      | `unknown`   | Renders the debate actions using `<yp-post-actions>`.                                                         |
| `renderActions`                | None                                                                      | `unknown`   | Renders the post actions or custom ratings, depending on group configuration.                                 |
| `_sharedContent`               | `event: CustomEvent`                                                      | `void`      | Handles the event when content is shared, logs the activity.                                                  |
| `_fullPostUrl`                 | None                                                                      | `string`    | Gets the full encoded URL for the post.                                                                       |
| `structuredAnswersFormatted`   | None                                                                      | `string`    | Returns a formatted string of structured answers for the post.                                                |
| `_onBottomClick`               | `event: CustomEvent`                                                      | `void`      | Prevents event propagation for bottom action bar clicks.                                                      |
| `clickOnA`                     | None                                                                      | `void`      | Programmatically clicks the main area anchor.                                                                 |
| `_getPostLink`                 | `post: YpPostData`                                                        | `string`    | Returns the URL for the post, based on group configuration.                                                   |
| `_shareTap`                    | `event: CustomEvent`                                                      | `void`      | Handles the share button tap, opens the share dialog.                                                         |
| `hideDescription`              | None                                                                      | `boolean`   | Returns true if the description should be hidden (mini mode or group config).                                 |
| `goToPostIfNotHeader`          | `event: CustomEvent`                                                      | `void`      | Navigates to the post page unless disabled by group configuration.                                            |
| `updated`                      | `changedProperties: Map<string \| number \| symbol, unknown>`             | `void`      | Lit lifecycle method, updates `isAudioCover` if the post's cover media type is audio.                        |
| `updateDescriptionIfEmpty`     | `description: string`                                                     | `void`      | Updates the post's description if it is empty.                                                                |
| `_refresh`                     | None                                                                      | `void`      | Opens the post edit dialog and fires a "refresh" event.                                                       |
| `_openReport`                  | None                                                                      | `void`      | Opens the report dialog for the post.                                                                         |
| `_onReport`                    | None                                                                      | `void`      | Notifies the user via toast that the post has been reported.                                                  |

## Examples

```typescript
import './yp-post-list-item.js';

const postData: YpPostData = {
  id: 123,
  name: "Example Post",
  description: "This is an example post.",
  language: "en",
  cover_media_type: "image",
  Group: {
    configuration: {
      hidePostCover: false,
      hidePostDescription: false,
      hidePostActionsInGrid: false,
      customRatings: false,
      usePostTagsForPostCards: false,
      structuredQuestionsJson: [],
      disablePostPageLink: false,
      resourceLibraryLinkMode: false,
      hideSharing: false,
      forceShowDebateCountOnPost: false
    }
  },
  public_data: {}
};

const postListItem = document.createElement('yp-post-list-item');
postListItem.post = postData;
document.body.appendChild(postListItem);
```
