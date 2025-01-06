# YpPointNewsStoryEdit

The `YpPointNewsStoryEdit` class is a custom web component that extends `YpBaseElementWithLogin`. It provides functionality for editing and posting news stories related to a specific point, with support for URL previews and embedded media.

## Properties

| Name             | Type                  | Description                                                                 |
|------------------|-----------------------|-----------------------------------------------------------------------------|
| loadingUrlPreview| Boolean               | Indicates if the URL preview is currently loading.                          |
| loadingPostStory | Boolean               | Indicates if the post story action is currently loading.                    |
| label            | string \| undefined   | The label for the text field, defaults to a translation key if not provided.|
| addLabel         | string \| undefined   | The label for the add button, defaults to a translation key if not provided.|
| point            | YpPointData \| undefined | The data object representing the point being edited.                        |
| postId           | number \| undefined   | The ID of the post associated with the story.                               |
| postGroupId      | number \| undefined   | The ID of the post group associated with the story.                         |
| groupId          | number \| undefined   | The ID of the group associated with the story.                              |
| communityId      | number \| undefined   | The ID of the community associated with the story.                          |
| domainId         | number \| undefined   | The ID of the domain associated with the story.                             |

## Methods

| Name               | Parameters                          | Return Type | Description                                                                 |
|--------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| render             | None                                | TemplateResult | Renders the component's HTML template.                                      |
| _clearButtonStat   | None                                | void        | Enables the story submit button.                                            |
| connectedCallback  | None                                | void        | Lifecycle method called when the element is added to the document.          |
| firstUpdated       | props: Map<string \| number \| symbol, unknown> | void | Lifecycle method called after the first update of the component.            |
| newPointContent    | None                                | string      | Gets the current content of the point news story text field.                |
| disconnectedCallback | None                              | void        | Lifecycle method called when the element is removed from the document.      |
| _reset             | None                                | void        | Resets the component's state and clears the input fields.                   |
| _sendStory         | None                                | Promise<void> | Sends the news story to the server and handles the response.                |
| _clearButtonState  | None                                | void        | Resets the state of the story submit button.                                |
| _keyDown           | event: KeyboardEvent                | void        | Handles keydown events in the text field, checking for URLs.                |
| _clearEmbed        | None                                | void        | Clears the embedded media data from the point.                              |
| _checkForUrl       | None                                | Promise<void> | Checks the text field content for URLs and fetches preview data if found.   |

## Examples

```typescript
// Example usage of the YpPointNewsStoryEdit component
import './yp-point-news-story-edit.js';

const storyEditElement = document.createElement('yp-point-news-story-edit');
document.body.appendChild(storyEditElement);

storyEditElement.point = {
  content: "Check out this amazing story!",
  embed_data: undefined
};

storyEditElement.addEventListener('refresh', () => {
  console.log('Story refreshed');
});
```