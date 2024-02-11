# YpPostHeader

This class represents a custom web component that displays the header of a post, including information such as the post's title, description, cover media, and actions that can be performed on the post. It extends `YpPostBaseWithAnswers` which in turn extends `YpBaseElementWithLogin`.

## Properties

| Name             | Type                | Description                                                                 |
|------------------|---------------------|-----------------------------------------------------------------------------|
| isAudioCover     | Boolean             | Indicates if the cover media is audio.                                      |
| hideActions      | Boolean             | Determines whether to hide the action buttons.                              |
| transcriptActive | Boolean             | Indicates if the transcript for the post is active.                         |
| post             | YpPostData          | The post data object containing all the information about the post.         |

## Methods

| Name                      | Parameters | Return Type | Description                                                                 |
|---------------------------|------------|-------------|-----------------------------------------------------------------------------|
| renderPostInformation     | -          | TemplateResult | Renders the post's information such as the description.                     |
| renderMenu                | -          | TemplateResult | Renders the menu for the post with options like edit, delete, etc.          |
| renderActions             | -          | TemplateResult | Renders the action buttons for the post.                                    |
| render                    | -          | TemplateResult | The main render method that outputs the HTML structure of the component.    |
| _openPostMenu             | -          | void        | Opens the post menu.                                                        |
| _sharedContent            | event: CustomEvent | void | Handles the shared content event.                                           |
| _shareTap                 | event: CustomEvent | void | Handles the share tap event.                                                |
| hasPostAccess             | -          | boolean     | Checks if the user has access to the post.                                  |
| updated                   | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method called when properties change.                             |
| _postChanged              | -          | void        | Called when the post property changes.                                      |
| updateDescriptionIfEmpty  | description: string | void | Updates the post description if it is empty.                                |
| _refresh                  | -          | void        | Refreshes the component.                                                    |
| _openMovePost             | -          | void        | Opens the dialog to move the post.                                          |
| _openPostStatusChangeNoEmails | -    | void        | Opens the dialog to change the post status without sending emails.          |
| _openPostStatusChange     | -          | void        | Opens the dialog to change the post status.                                 |
| _openEdit                 | -          | void        | Opens the edit dialog for the post.                                         |
| _openReport               | -          | void        | Opens the report dialog for the post.                                       |
| _openDelete               | -          | void        | Opens the delete dialog for the post.                                       |
| _openDeleteContent        | -          | void        | Opens the dialog to delete the content of the post.                         |
| _openAnonymizeContent     | -          | void        | Opens the dialog to anonymize the content of the post.                      |
| _onReport                 | -          | void        | Callback for when a report is made.                                         |
| _onDeleted                | -          | void        | Callback for when the post is deleted.                                      |

## Events (if any)

- **yp-refresh-group**: Emitted when the group needs to be refreshed after a post is deleted.
- **sharedContent**: Emitted when content is shared.

## Examples

```typescript
// Example usage of YpPostHeader
<yp-post-header
  .post="${this.postData}"
  .isAudioCover="${this.isAudio}"
  .hideActions="${false}"
  .transcriptActive="${this.hasTranscript}"
></yp-post-header>
```

Please note that the above example assumes that `this.postData`, `this.isAudio`, and `this.hasTranscript` are properties defined in the context where this component is used, and they hold the relevant data for the post, whether it's an audio post, and whether a transcript is available, respectively.