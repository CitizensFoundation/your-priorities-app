# YpPostListItem

A custom web component that represents a post list item, providing various functionalities such as rendering post details, handling user interactions, and managing post actions.

## Properties

| Name              | Type                  | Description                                                                 |
|-------------------|-----------------------|-----------------------------------------------------------------------------|
| selectedMenuItem  | `string \| undefined` | The currently selected menu item.                                           |
| mini              | `boolean`             | Determines if the component should be rendered in a compact form.           |
| isAudioCover      | `boolean`             | Indicates if the post cover is an audio type.                               |
| post              | `YpPostData`          | The data object representing the post.                                      |

## Methods

| Name                             | Parameters                                                                 | Return Type | Description                                                                 |
|----------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| structuredAnswerTruncateLength   | None                                                                       | `number`    | Calculates the truncate length for structured answers based on URL length.  |
| renderDescription                | None                                                                       | `TemplateResult` | Renders the description of the post.                                        |
| renderTags                       | None                                                                       | `TemplateResult` | Renders the tags associated with the post.                                  |
| render                           | None                                                                       | `TemplateResult` | Renders the entire post list item component.                                |
| renderShare                      | None                                                                       | `TemplateResult` | Renders the share button for the post.                                      |
| renderDebate                     | None                                                                       | `TemplateResult` | Renders the debate actions for the post.                                    |
| renderActions                    | None                                                                       | `TemplateResult` | Renders the action buttons for the post.                                    |
| _sharedContent                   | `event: CustomEvent`                                                       | `void`      | Handles the event when content is shared.                                   |
| _fullPostUrl                     | None                                                                       | `string`    | Constructs the full URL for the post.                                       |
| structuredAnswersFormatted       | None                                                                       | `string`    | Formats the structured answers for display.                                 |
| _onBottomClick                   | `event: CustomEvent`                                                       | `void`      | Prevents default behavior and stops event propagation for bottom clicks.    |
| clickOnA                         | None                                                                       | `void`      | Simulates a click on the main area of the post.                             |
| _getPostLink                     | `post: YpPostData`                                                         | `string`    | Generates the link for the post based on its configuration.                 |
| _shareTap                        | `event: CustomEvent`                                                       | `void`      | Handles the tap event for sharing the post.                                 |
| hideDescription                  | None                                                                       | `boolean`   | Determines if the description should be hidden based on configuration.      |
| goToPostIfNotHeader              | `event: CustomEvent`                                                       | `void`      | Navigates to the post page unless disabled by configuration.                |
| updated                          | `changedProperties: Map<string \| number \| symbol, unknown>`              | `void`      | Lifecycle method called when properties are updated.                        |
| updateDescriptionIfEmpty         | `description: string`                                                      | `void`      | Updates the post description if it is empty.                                |
| _refresh                         | None                                                                       | `void`      | Refreshes the component, typically after an edit.                           |
| _openReport                      | None                                                                       | `void`      | Opens the report dialog for the post.                                       |
| _onReport                        | None                                                                       | `void`      | Handles the report action for the post.                                     |

## Examples

```typescript
// Example usage of the YpPostListItem component
import './yp-post-list-item.js';

const postListItem = document.createElement('yp-post-list-item');
postListItem.post = {
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
      structuredQuestionsJson: [],
    },
  },
  public_data: {
    structuredAnswersJson: [],
  },
};

document.body.appendChild(postListItem);
```