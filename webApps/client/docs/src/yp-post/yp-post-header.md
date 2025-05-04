# YpPostHeader

A web component that renders the header section for a post, including cover media, user info, post actions, and admin menus. It provides controls for editing, reporting, sharing, and managing the post, and supports custom ratings, transcripts, and responsive layouts.

## Properties

| Name                    | Type                | Description                                                                                 |
|-------------------------|---------------------|---------------------------------------------------------------------------------------------|
| isAudioCover            | boolean             | Indicates if the cover media is audio.                                                      |
| hideActions             | boolean             | If true, hides the post action buttons.                                                     |
| transcriptActive        | boolean             | If true, displays the transcript for the post.                                              |
| onlyRenderTopActionBar  | boolean             | If true, only renders the top action bar, not the full header.                              |
| hideTopActionBar        | boolean             | If true, hides the top action bar.                                                          |
| hasNoLeftRightButtons   | boolean             | If true, disables left/right navigation buttons.                                            |
| post                    | YpPostData          | The post data object to display.                                                            |
| postPositionCounter     | string              | Optional counter to display the post's position (e.g., "1/10").                             |

## Methods

| Name                              | Parameters                                                                 | Return Type         | Description                                                                                      |
|----------------------------------- |----------------------------------------------------------------------------|---------------------|--------------------------------------------------------------------------------------------------|
| renderPostInformation              | none                                                                       | TemplateResult      | Renders the post's description or structured answers.                                             |
| renderMenu                        | none                                                                       | TemplateResult      | Renders the admin menu for post actions if the user has access.                                   |
| renderActions                     | none                                                                       | TemplateResult      | Renders either custom ratings or standard post actions.                                           |
| renderName                        | none                                                                       | TemplateResult      | Renders the post's name/title.                                                                    |
| renderUser                        | none                                                                       | TemplateResult      | Renders the user and organization info for the post.                                              |
| renderCoverMedia                  | none                                                                       | TemplateResult      | Renders the cover media (image, video, or audio) and transcript if active.                        |
| renderClose                       | none                                                                       | TemplateResult      | Renders the close or up-arrow button for navigation.                                              |
| renderTopActionButtons            | none                                                                       | TemplateResult      | Renders the top action buttons (edit, report, share).                                             |
| render                            | none                                                                       | TemplateResult      | Main render method for the component.                                                             |
| _openPostMenu                     | none                                                                       | void                | Opens the post action menu.                                                                       |
| _sharedContent                    | event: CustomEvent                                                         | void                | Handles the event when content is shared.                                                         |
| _shareTap                         | event: CustomEvent                                                         | void                | Handles the share button tap, opens the share dialog.                                             |
| hasPostAccess (getter)            | none                                                                       | boolean             | Returns true if the current user has access to post admin actions.                                |
| updated                           | changedProperties: Map<string \| number \| symbol, unknown>                | void                | Lifecycle method called when properties are updated.                                              |
| _postChanged                      | none                                                                       | void                | Handles logic when the post property changes (e.g., transcript, audio cover).                     |
| updateDescriptionIfEmpty          | description: string                                                        | void                | Updates the post's description if it is empty.                                                    |
| _refresh                          | none                                                                       | void                | Refreshes the post edit dialog and fires a refresh event.                                         |
| _openMovePost                     | none                                                                       | void                | Opens the move post dialog (not fully implemented).                                               |
| _openPostStatusChangeNoEmails     | none                                                                       | void                | Opens the post status change dialog without sending emails (not fully implemented).               |
| _openPostStatusChange             | none                                                                       | void                | Opens the post status change dialog (not fully implemented).                                      |
| _openEdit                         | none                                                                       | void                | Navigates to the post edit page.                                                                  |
| _openReport                       | none                                                                       | void                | Opens the report post dialog.                                                                     |
| _openDelete                       | none                                                                       | void                | Opens the delete post dialog.                                                                     |
| _openDeleteContent                | none                                                                       | void                | Opens the delete post content dialog.                                                             |
| _openAnonymizeContent             | none                                                                       | void                | Opens the anonymize post content dialog.                                                          |
| _onReport                         | none                                                                       | void                | Notifies the user that the post has been reported.                                                |
| _onDeleted                        | none                                                                       | void                | Dispatches a group refresh event and navigates to the group page after deletion.                  |

## Examples

```typescript
import './yp-post-header.js';

const postData = {
  id: 123,
  name: "Example Post",
  description: "This is an example post.",
  language: "en",
  group_id: 1,
  Group: {
    configuration: {
      showWhoPostedPosts: true,
      customRatings: false,
      hideSharing: false,
      descriptionTruncateAmount: 200,
      structuredQuestions: [],
      descriptionSimpleFormat: false
    }
  },
  User: {
    id: 1,
    name: "John Doe"
  },
  public_data: {},
  cover_media_type: "image"
};

const header = document.createElement('yp-post-header');
header.post = postData;
document.body.appendChild(header);
```
