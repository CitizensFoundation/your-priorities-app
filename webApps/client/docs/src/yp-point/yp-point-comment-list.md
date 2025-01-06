# YpPointCommentList

A custom web component for displaying and managing a list of comments associated with a point or image. It extends the `YpBaseElement` and provides functionalities to open, close, and refresh the comment list.

## Properties

| Name            | Type                              | Description                                                                 |
|-----------------|-----------------------------------|-----------------------------------------------------------------------------|
| comments        | Array<YpPointData> \| undefined   | An array of comments associated with the point or image.                    |
| point           | YpPointData \| undefined          | The point data associated with the comments.                                |
| image           | YpImageData \| undefined          | The image data associated with the comments.                                |
| open            | boolean                           | Indicates whether the comment list is open.                                 |
| loadingList     | boolean                           | Indicates whether the comment list is currently loading.                    |
| disableOpenClose| boolean                           | Disables the open/close functionality of the comment list.                  |
| commentsCount   | number \| undefined               | The count of comments available for the point or image.                     |
| commentType     | 'points' \| 'images' \| undefined | The type of comments being displayed, either for points or images.          |

## Methods

| Name             | Parameters                                      | Return Type | Description                                                                 |
|------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| updated          | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method called when properties are updated.                        |
| renderComment    | comment: YpPointData, index: number             | TemplateResult | Renders a single comment.                                                   |
| render           |                                                 | TemplateResult | Renders the component's template.                                           |
| scrollEvent      | event: any                                      | void        | Handles the scroll event for loading more comments.                         |
| connectedCallback|                                                 | void        | Lifecycle method called when the element is added to the document.          |
| disconnectedCallback |                                             | void        | Lifecycle method called when the element is removed from the document.      |
| _openChanged     |                                                 | void        | Handles changes to the `open` property.                                     |
| noComments       |                                                 | boolean     | Returns true if there are no comments.                                      |
| setOpen          |                                                 | void        | Opens the comment list.                                                     |
| setClosed        |                                                 | void        | Closes the comment list.                                                    |
| _pointChanged    |                                                 | void        | Handles changes to the `point` property.                                    |
| refresh          |                                                 | void        | Refreshes the comments and comment count.                                   |
| _imageChanged    |                                                 | void        | Handles changes to the `image` property.                                    |
| hasContent       |                                                 | boolean     | Returns true if there is either a point or an image.                        |
| _getComments     |                                                 | Promise<void> | Fetches the comments from the server.                                       |
| _getCommentsCount|                                                 | Promise<void> | Fetches the comment count from the server.                                  |

## Examples

```typescript
// Example usage of the YpPointCommentList component
import './yp-point-comment-list.js';

const commentList = document.createElement('yp-point-comment-list');
commentList.point = { id: 'point1', ... }; // YpPointData object
commentList.image = { id: 'image1', ... }; // YpImageData object
document.body.appendChild(commentList);
```

This component is designed to work with a server API that provides methods `getComments` and `getCommentsCount` to fetch comments and their count, respectively. It also listens for a custom event `yp-point-deleted` to refresh the comment list when a point is deleted.