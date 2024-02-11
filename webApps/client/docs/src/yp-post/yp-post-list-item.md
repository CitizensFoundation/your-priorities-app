# YpPostListItem

This class represents a custom element `yp-post-list-item` which is a list item component for displaying posts. It extends `YpPostBaseWithAnswers` which in turn extends `YpBaseElement`. The component is used to render a post with various interactive elements like cover media, post name, description, and actions.

## Properties

| Name              | Type                  | Description                                                                 |
|-------------------|-----------------------|-----------------------------------------------------------------------------|
| selectedMenuItem  | string \| undefined   | The currently selected menu item.                                           |
| elevation         | number                | The elevation level for the shadow effect on the card.                      |
| post              | YpPostData            | The post data to be displayed. This property is marked as required.         |
| mini              | boolean               | A flag indicating if the post should be displayed in a mini format.         |
| isAudioCover      | boolean               | A flag indicating if the cover media is of type audio.                      |
| isEndorsed        | boolean               | A flag indicating if the post is endorsed.                                  |

## Methods

| Name                     | Parameters | Return Type | Description                                                                                   |
|--------------------------|------------|-------------|-----------------------------------------------------------------------------------------------|
| computeSpanHidden        | items: Array<string>, index: number \| string | boolean | Determines if a span should be hidden based on the index in a list of items. |
| postTags                 | -          | Array<string> | Retrieves the tags associated with the post, split by commas.                                |
| _onBottomClick           | event: CustomEvent | void | Handles the click event on the bottom part of the post card.                                 |
| clickOnA                 | -          | void | Simulates a click on the main anchor element.                                                |
| _savePostToBackCache     | -          | void | Saves the current post to the back cache.                                                    |
| _getPostLink             | post: YpPostData | string | Generates the URL link for the post.                                                         |
| _shareTap                | event: CustomEvent | void | Handles the tap event on the share button.                                                   |
| hideDescription          | -          | boolean | Determines if the post description should be hidden.                                          |
| hasPostAccess            | -          | boolean | Checks if the user has access to the post.                                                   |
| goToPostIfNotHeader      | -          | void | Navigates to the post page unless navigation is disabled.                                    |
| updated                  | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle callback invoked when properties change.                                            |
| _postChanged             | -          | void | Called when the `post` property changes.                                                     |
| updateDescriptionIfEmpty | description: string | void | Updates the post description if it is empty.                                                 |
| _refresh                 | -          | void | Refreshes the component.                                                                     |
| _openReport              | -          | void | Opens the report dialog for the post.                                                        |
| _onReport                | -          | void | Callback for when a report is submitted.                                                     |

## Events (if any)

- **refresh**: Emitted when the component needs to be refreshed.

## Examples

```typescript
// Example usage of the yp-post-list-item component
<yp-post-list-item
  .post="${somePostData}"
  elevation="3"
  mini="${false}"
  isAudioCover="${somePostData.cover_media_type === 'audio'}"
></yp-post-list-item>
```

Note: The actual usage of the component would depend on the context within the application and the data provided for the post.