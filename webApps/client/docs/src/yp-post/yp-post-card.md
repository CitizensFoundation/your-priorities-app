# YpPostCard

The `YpPostCard` class is a custom web component that extends `YpBaseElement`. It represents a card UI component for displaying post information, including media, description, and actions.

## Properties

| Name             | Type                | Description                                                                 |
|------------------|---------------------|-----------------------------------------------------------------------------|
| selectedMenuItem | string \| undefined | The currently selected menu item.                                           |
| mini             | boolean             | Determines if the card should be displayed in a mini format.                |
| isAudioCover     | boolean             | Indicates if the post cover is an audio type.                               |
| post             | YpPostData          | The data object representing the post to be displayed.                      |

## Methods

| Name                        | Parameters                                                                 | Return Type | Description                                                                 |
|-----------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| renderDescription           | None                                                                       | TemplateResult | Renders the description of the post.                                        |
| renderTags                  | None                                                                       | TemplateResult | Renders the tags associated with the post.                                  |
| render                      | None                                                                       | TemplateResult | Renders the entire post card component.                                     |
| _sharedContent              | event: CustomEvent                                                         | void        | Handles the event when content is shared.                                   |
| _fullPostUrl                | None                                                                       | string      | Constructs the full URL for the post.                                       |
| structuredAnswersFormatted  | None                                                                       | string      | Formats structured answers for display.                                     |
| _onBottomClick              | event: CustomEvent                                                         | void        | Prevents default behavior and stops event propagation for bottom clicks.    |
| clickOnA                    | None                                                                       | void        | Simulates a click on the main area of the card.                             |
| _getPostLink                | post: YpPostData                                                           | string      | Generates the link for the post based on its configuration.                 |
| _shareTap                   | event: CustomEvent                                                         | void        | Handles the tap event for sharing the post.                                 |
| hideDescription             | None                                                                       | boolean     | Determines if the description should be hidden based on configuration.      |
| goToPostIfNotHeader         | event: CustomEvent                                                         | void        | Navigates to the post page unless disabled by configuration.                |
| updated                     | changedProperties: Map<string \| number \| symbol, unknown>                | void        | Lifecycle method called when properties are updated.                        |
| updateDescriptionIfEmpty    | description: string                                                        | void        | Updates the post description if it is empty.                                |
| _refresh                    | None                                                                       | void        | Refreshes the post card, typically after an edit.                           |
| _openReport                 | None                                                                       | void        | Opens a dialog to report the post.                                          |
| _onReport                   | None                                                                       | void        | Handles the report action for the post.                                     |

## Examples

```typescript
// Example usage of the YpPostCard component
import './yp-post-card.js';

const postCard = document.createElement('yp-post-card');
postCard.post = {
  id: 1,
  name: 'Sample Post',
  description: 'This is a sample post description.',
  language: 'en',
  Group: {
    configuration: {
      hidePostCover: false,
      hidePostDescription: false,
      hidePostActionsInGrid: false,
      customRatings: false,
      usePostTagsForPostCards: true,
      disablePostPageLink: false,
      resourceLibraryLinkMode: false,
      forceShowDebateCountOnPost: false,
    }
  },
  public_data: {
    structuredAnswersJson: [],
  },
  cover_media_type: 'image',
};

document.body.appendChild(postCard);
```

This documentation provides an overview of the `YpPostCard` class, its properties, methods, and an example of how to use it.