# YpPostHeader

The `YpPostHeader` class is a custom web component that extends `YpPostBaseWithAnswers` and `YpBaseElementWithLogin`. It is designed to render the header of a post, including actions, media, and user information.

## Properties

| Name                   | Type                  | Description                                                                 |
|------------------------|-----------------------|-----------------------------------------------------------------------------|
| isAudioCover           | boolean               | Indicates if the post cover is an audio type.                               |
| hideActions            | boolean               | Determines if the actions should be hidden.                                 |
| transcriptActive       | boolean               | Indicates if the transcript is active.                                      |
| onlyRenderTopActionBar | boolean               | Determines if only the top action bar should be rendered.                   |
| hideTopActionBar       | boolean               | Determines if the top action bar should be hidden.                          |
| hasNoLeftRightButtons  | boolean               | Indicates if there are no left or right buttons.                            |
| post                   | YpPostData            | The post data object.                                                       |
| postPositionCounter    | string                | The position counter for the post.                                          |

## Methods

| Name                          | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| renderPostInformation         | None                                                                       | TemplateResult | Renders the post information section.                                       |
| renderMenu                    | None                                                                       | TemplateResult | Renders the menu for post actions.                                          |
| renderActions                 | None                                                                       | TemplateResult | Renders the actions related to the post.                                    |
| renderName                    | None                                                                       | TemplateResult | Renders the name of the post.                                               |
| renderUser                    | None                                                                       | TemplateResult | Renders the user information.                                               |
| renderCoverMedia              | None                                                                       | TemplateResult | Renders the cover media of the post.                                        |
| renderClose                   | None                                                                       | TemplateResult | Renders the close button.                                                   |
| renderTopActionButtons        | None                                                                       | TemplateResult | Renders the top action buttons.                                             |
| render                        | None                                                                       | TemplateResult | Renders the entire component.                                               |
| _openPostMenu                 | None                                                                       | void        | Opens the post menu.                                                        |
| _sharedContent                | event: CustomEvent                                                         | void        | Handles the shared content event.                                           |
| _shareTap                     | event: CustomEvent                                                         | void        | Handles the share tap event.                                                |
| hasPostAccess                 | None                                                                       | boolean     | Checks if the user has access to the post.                                  |
| updated                       | changedProperties: Map<string \| number \| symbol, unknown>                | void        | Lifecycle method called when properties are updated.                        |
| _postChanged                  | None                                                                       | void        | Handles changes to the post property.                                       |
| updateDescriptionIfEmpty      | description: string                                                        | void        | Updates the post description if it is empty.                                |
| _refresh                      | None                                                                       | void        | Refreshes the component.                                                    |
| _openMovePost                 | None                                                                       | void        | Opens the move post dialog.                                                 |
| _openPostStatusChangeNoEmails | None                                                                       | void        | Opens the post status change dialog without sending emails.                 |
| _openPostStatusChange         | None                                                                       | void        | Opens the post status change dialog.                                        |
| _openEdit                     | None                                                                       | void        | Opens the edit post page.                                                   |
| _openReport                   | None                                                                       | void        | Opens the report post dialog.                                               |
| _openDelete                   | None                                                                       | void        | Opens the delete post dialog.                                               |
| _openDeleteContent            | None                                                                       | void        | Opens the delete post content dialog.                                       |
| _openAnonymizeContent         | None                                                                       | void        | Opens the anonymize post content dialog.                                    |
| _onReport                     | None                                                                       | void        | Handles the report action.                                                  |
| _onDeleted                    | None                                                                       | void        | Handles the post deletion action.                                           |

## Examples

```typescript
// Example usage of the YpPostHeader component
import './yp-post-header.js';

const postHeader = document.createElement('yp-post-header');
postHeader.post = {
  id: 1,
  name: 'Sample Post',
  description: 'This is a sample post description.',
  language: 'en',
  Group: {
    configuration: {
      showWhoPostedPosts: true,
      customRatings: false,
      descriptionTruncateAmount: 100,
    },
  },
  User: {
    name: 'John Doe',
  },
  public_data: {
    transcript: {
      text: 'Sample transcript text.',
    },
  },
  cover_media_type: 'image',
};

document.body.appendChild(postHeader);
```