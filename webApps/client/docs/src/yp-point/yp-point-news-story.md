# YpPointNewsStory

The `YpPointNewsStory` class is a custom web component that extends `YpBaseElement`. It is designed to display a news story with optional comments and user information.

## Properties

| Name          | Type                  | Description                                                                 |
|---------------|-----------------------|-----------------------------------------------------------------------------|
| point         | YpPointData           | The data object representing the point (news story) to be displayed.        |
| user          | YpUserData \| undefined | The user associated with the point, if available.                           |
| withComments  | boolean               | Determines if comments should be displayed. Default is `false`.             |
| open          | boolean               | Indicates if the comments section is open. Default is `false`.              |
| hideUser      | boolean               | Determines if the user information should be hidden. Default is `false`.    |
| commentsCount | number                | The number of comments associated with the point. Default is `0`.           |

## Methods

| Name              | Parameters          | Return Type | Description                                                                 |
|-------------------|---------------------|-------------|-----------------------------------------------------------------------------|
| updated           | changedProperties: Map<string \| number \| symbol, unknown> | void        | Called when the element's properties change. Handles changes to `point` and `open`. |
| render            |                     | TemplateResult | Renders the HTML template for the component.                                |
| _setOpenToValue   |                     | void        | Toggles the open state of the comments section.                             |
| _openChanged      |                     | void        | Refreshes the comments list when the open state changes.                    |
| noComments        |                     | boolean     | Returns `true` if there are no comments, otherwise `false`.                 |
| _setOpen          |                     | void        | Sets the comments section to open.                                          |
| _setClosed        |                     | void        | Sets the comments section to closed.                                        |
| _setCommentsCount | event: CustomEvent  | void        | Updates the comments count based on the event detail.                       |
| _pointChanged     |                     | void        | Updates the user information and resets the open state when the point changes. |
| loginName         |                     | string      | Returns the name of the user associated with the first point revision.      |

## Examples

```typescript
// Example usage of the YpPointNewsStory component
import './yp-point-news-story.js';

const newsStoryElement = document.createElement('yp-point-news-story');
newsStoryElement.point = {
  id: '123',
  language: 'en',
  latestContent: 'This is a sample news story content.',
  embed_data: {},
  PointRevisions: [{ User: { name: 'John Doe' } }]
};
newsStoryElement.withComments = true;
document.body.appendChild(newsStoryElement);
```