# YpPostCard

A custom element representing a post card, which is a visual component used to display a summary of a post, including its cover media, title, description, and actions.

## Properties

| Name              | Type                  | Description                                                                 |
|-------------------|-----------------------|-----------------------------------------------------------------------------|
| selectedMenuItem  | string \| undefined   | The currently selected menu item.                                           |
| mini              | boolean               | Determines if the post card is in mini mode.                                |
| isAudioCover      | boolean               | Indicates if the cover media is of type audio.                              |
| post              | YpPostData            | The post data to be displayed in the card.                                  |

## Methods

| Name                      | Parameters            | Return Type | Description                                                                 |
|---------------------------|-----------------------|-------------|-----------------------------------------------------------------------------|
| renderDescription         | -                     | TemplateResult | Renders the post description.                                               |
| renderTags                | -                     | TemplateResult | Renders the post tags.                                                      |
| render                    | -                     | TemplateResult | Renders the post card.                                                      |
| _sharedContent            | event: CustomEvent    | void        | Handles the shared content event.                                           |
| _fullPostUrl              | -                     | string      | Getter for the full URL of the post.                                        |
| structuredAnswersFormatted| -                     | string      | Formats the structured answers of the post.                                 |
| _onBottomClick            | event: CustomEvent    | void        | Handles the click event on the bottom of the card.                          |
| clickOnA                  | -                     | void        | Simulates a click on the main area of the card.                             |
| _getPostLink              | post: YpPostData      | string      | Gets the link to the post.                                                  |
| _shareTap                 | event: CustomEvent    | void        | Handles the share tap event.                                                |
| hideDescription           | -                     | boolean     | Determines if the description should be hidden.                             |
| goToPostIfNotHeader       | event: CustomEvent    | void        | Navigates to the post if not in header mode.                                |
| updated                   | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method called after the element’s properties have changed. |
| updateDescriptionIfEmpty  | description: string   | void        | Updates the post description if it is empty.                                |
| _refresh                  | -                     | void        | Refreshes the post card.                                                    |
| _openReport               | -                     | void        | Opens the report dialog for the post.                                       |
| _onReport                 | -                     | void        | Handles the report action.                                                  |

## Events (if any)

- **refresh**: Fired to refresh the post card.
- **sharedContent**: Emitted when content is shared.

## Examples

```typescript
// Example usage of the YpPostCard element
<yp-post-card .post="${this.postData}"></yp-post-card>
```

Note: The `YpPostData` type is assumed to be an object representing the data structure for a post, including properties such as `id`, `name`, `description`, `cover_media_type`, `public_data`, `Group`, and others relevant to the post. The `YpStructuredQuestionData` type is assumed to be an object representing structured question data, and `YpShareDialogData` is assumed to be an object representing share dialog data. These types are not explicitly defined in the provided code snippet.