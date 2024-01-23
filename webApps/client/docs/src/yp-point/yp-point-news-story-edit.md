# YpPointNewsStoryEdit

This class represents a custom element for editing news stories related to a point. It allows users to add or edit the content of a news story, post it, and manage embedded media.

## Properties

| Name              | Type            | Description                                                                 |
|-------------------|-----------------|-----------------------------------------------------------------------------|
| loadingUrlPreview | Boolean         | Indicates if the URL preview is loading.                                    |
| loadingPostStory  | Boolean         | Indicates if the post story action is loading.                              |
| point             | YpPointData     | The point data associated with the news story.                              |
| postId            | Number          | The ID of the post associated with the news story.                          |
| postGroupId       | Number          | The ID of the group where the post is located.                              |
| groupId           | Number          | The ID of the group associated with the news story.                         |
| communityId       | Number          | The ID of the community associated with the news story.                     |
| domainId          | Number          | The ID of the domain associated with the news story.                        |

## Methods

| Name                | Parameters | Return Type | Description                                                                                   |
|---------------------|------------|-------------|-----------------------------------------------------------------------------------------------|
| _clearButtonStat    |            | void        | Clears the disabled state of the story submit button.                                         |
| connectedCallback   |            | void        | Lifecycle callback that is called when the element is inserted into the DOM.                  |
| firstUpdated        | props: Map | void        | Lifecycle callback that is called after the element's first render.                           |
| newPointContent     |            | String      | Gets the current content of the point news story from the text field.                         |
| disconnectedCallback|            | void        | Lifecycle callback that is called when the element is removed from the DOM.                   |
| _reset              |            | void        | Resets the element to its default state.                                                      |
| _sendStory          |            | Promise     | Sends the news story to the server.                                                           |
| _clearButtonState   |            | void        | Clears the disabled state of the story submit button.                                         |
| _keyDown            | event: KeyboardEvent | void | Handles keydown events to check for URLs when space or enter is pressed. |
| _clearEmbed         |            | void        | Clears the embedded media data.                                                               |
| _checkForUrl        |            | Promise     | Checks the content for URLs and fetches preview data for the first URL found.                 |

## Events (if any)

- **refresh**: Emitted after successfully posting a news story to refresh the view.
- **yp-error**: Emitted when an error occurs, such as when the news story content is too short.

## Examples

```typescript
// Example usage of the YpPointNewsStoryEdit custom element
<yp-point-news-story-edit
  .loadingUrlPreview="${this.loadingUrlPreview}"
  .loadingPostStory="${this.loadingPostStory}"
  .point="${this.point}"
  .postId="${this.postId}"
  .postGroupId="${this.postGroupId}"
  .groupId="${this.groupId}"
  .communityId="${this.communityId}"
  .domainId="${this.domainId}"
></yp-point-news-story-edit>
```

Note: The above example assumes that the properties are set accordingly in the context where the custom element is used.