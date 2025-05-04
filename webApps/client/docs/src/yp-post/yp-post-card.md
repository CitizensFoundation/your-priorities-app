# YpPostCard

A Lit-based web component that displays a post card with cover media, title, description, tags, and actions. It supports various display modes (mini, audio cover, etc.) and adapts its layout responsively. The card can show or hide elements based on the post's group configuration and provides sharing, reporting, and navigation functionalities.

## Properties

| Name             | Type                | Description                                                                                 |
|------------------|---------------------|---------------------------------------------------------------------------------------------|
| selectedMenuItem | string \| undefined | The currently selected menu item, if any.                                                   |
| mini             | boolean             | If true, displays the card in a compact "mini" mode.                                        |
| isAudioCover     | boolean             | If true, indicates the post cover is audio.                                                 |
| post             | YpPostData          | The post data object to display. Must be provided.                                          |

## Methods

| Name                        | Parameters                                                                 | Return Type | Description                                                                                                    |
|-----------------------------|----------------------------------------------------------------------------|-------------|----------------------------------------------------------------------------------------------------------------|
| renderDescription           | none                                                                       | unknown     | Renders the post description or structured answers using `<yp-magic-text>`.                                   |
| renderTags                  | none                                                                       | unknown     | Renders the post tags using `<yp-post-tags>`.                                                                 |
| render                      | none                                                                       | unknown     | Main render method for the component. Returns the card's HTML template.                                        |
| _sharedContent              | event: CustomEvent                                                         | void        | Handles the event when the post is shared, logs the activity.                                                  |
| _fullPostUrl (getter)       | none                                                                       | string      | Returns the encoded full URL for the post.                                                                     |
| structuredAnswersFormatted (getter) | none                                                               | string      | Returns a formatted string of structured answers for the post, if available.                                   |
| _onBottomClick              | event: CustomEvent                                                         | void        | Prevents event propagation for clicks on the bottom actions area.                                              |
| clickOnA                    | none                                                                       | void        | Programmatically clicks the main area anchor (`#mainArea`).                                                    |
| _getPostLink                | post: YpPostData                                                           | string      | Returns the appropriate link for the post based on group configuration.                                        |
| _shareTap                   | event: CustomEvent                                                         | void        | Handles the share button tap, opens the share dialog, and logs the activity.                                   |
| hideDescription (getter)    | none                                                                       | boolean     | Returns true if the description should be hidden (mini mode or group config).                                  |
| goToPostIfNotHeader         | event: CustomEvent                                                         | void        | Navigates to the post page unless disabled by group configuration. Caches the post if not in mini mode.        |
| updated                     | changedProperties: Map<string \| number \| symbol, unknown>                | void        | Lit lifecycle method. Updates `isAudioCover` if the post's cover media type is audio.                         |
| updateDescriptionIfEmpty    | description: string                                                        | void        | Updates the post's description if it is empty.                                                                 |
| _refresh                    | none                                                                       | void        | Opens the post edit dialog and fires a "refresh" event.                                                        |
| _openReport                 | none                                                                       | void        | Opens the report dialog for the post and logs the activity.                                                    |
| _onReport                   | none                                                                       | void        | Notifies the user via toast that the post has been reported.                                                   |

## Examples

```typescript
import './yp-post-card.js';

const postData = {
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
      usePostTagsForPostCards: false,
      customRatings: false,
      hideSharing: false,
      forceShowDebateCountOnPost: false,
      disablePostPageLink: false,
      resourceLibraryLinkMode: false,
      structuredQuestionsJson: [],
    }
  },
  public_data: {
    structuredAnswersJson: []
  }
};

const card = document.createElement('yp-post-card');
card.post = postData;
document.body.appendChild(card);
```
