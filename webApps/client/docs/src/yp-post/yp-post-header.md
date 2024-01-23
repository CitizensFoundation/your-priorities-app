# YpPostHeader

The `YpPostHeader` class is a custom web component that extends `YpPostBaseWithAnswers` and `YpBaseElementWithLogin` to provide a header for a post with various functionalities such as editing, deleting, sharing, and displaying post information. It includes a cover media display, post information, and actions related to the post.

## Properties

| Name             | Type                | Description                                                                 |
|------------------|---------------------|-----------------------------------------------------------------------------|
| isAudioCover     | Boolean             | Indicates if the cover media is of type audio.                              |
| hideActions      | Boolean             | Determines whether to hide the action buttons.                              |
| transcriptActive | Boolean             | Indicates if the transcript for the post is active.                         |
| post             | YpPostData          | The post data object containing all the information about the post.         |

## Methods

| Name                     | Parameters | Return Type | Description                                                                 |
|--------------------------|------------|-------------|-----------------------------------------------------------------------------|
| renderPostInformation    | -          | TemplateResult | Renders the post information such as description and structured answers.    |
| renderMenu               | -          | TemplateResult | Renders the menu for post actions like editing and deleting.                |
| renderActions            | -          | TemplateResult | Renders the action buttons for the post.                                   |
| override render          | -          | TemplateResult | Renders the complete layout of the post header.                            |
| _openPostMenu            | -          | void        | Opens the post menu for additional actions.                                |
| _sharedContent           | event: CustomEvent | void | Handles the shared content event.                                          |
| _shareTap                | event: CustomEvent | void | Handles the share tap event.                                               |
| hasPostAccess            | -          | boolean     | Checks if the user has access to the post.                                 |
| override updated         | changedProperties: Map<string \| number \| symbol, unknown> | void | Updates the component when properties change. |
| _postChanged             | -          | void        | Handles changes to the post property.                                      |
| updateDescriptionIfEmpty | description: string | void | Updates the post description if it is empty.                               |
| _refresh                 | -          | void        | Refreshes the component.                                                   |
| _openMovePost            | -          | void        | Opens the dialog to move the post.                                         |
| _openPostStatusChangeNoEmails | -    | void        | Opens the dialog to change the post status without sending emails.         |
| _openPostStatusChange    | -          | void        | Opens the dialog to change the post status.                                |
| _openEdit                | -          | void        | Opens the dialog to edit the post.                                         |
| _openReport              | -          | void        | Opens the dialog to report the post.                                       |
| _openDelete              | -          | void        | Opens the dialog to delete the post.                                       |
| _openDeleteContent       | -          | void        | Opens the dialog to delete the post content.                               |
| _openAnonymizeContent    | -          | void        | Opens the dialog to anonymize the post content.                            |
| _onReport                | -          | void        | Handles the report action.                                                 |
| _onDeleted               | -          | void        | Handles the post deletion action.                                          |

## Events (if any)

- **yp-refresh-group**: Emitted when the group needs to be refreshed after a post action.
- **sharedContent**: Emitted when content is shared.
- **shareTap**: Emitted when the share button is tapped.

## Examples

```typescript
// Example usage of the YpPostHeader component
<yp-post-header
  .post="${this.postData}"
  .isAudioCover="${this.isAudio}"
  .hideActions="${false}"
  .transcriptActive="${this.hasTranscript}"
></yp-post-header>
```

Please note that the above example assumes that `postData`, `isAudio`, and `hasTranscript` are available in the context where the `YpPostHeader` component is used.