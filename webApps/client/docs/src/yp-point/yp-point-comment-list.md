# YpPointCommentList

A custom element that displays a list of comments for a specific point or image, with the ability to open and close the list.

## Properties

| Name             | Type                        | Description                                                                 |
|------------------|-----------------------------|-----------------------------------------------------------------------------|
| comments         | Array<YpPointData>          | An array of comments associated with the point or image.                    |
| point            | YpPointData                 | The point data for which comments are being displayed.                      |
| image            | YpImageData                 | The image data for which comments are being displayed.                      |
| open             | boolean                     | Indicates whether the comment list is open or closed.                       |
| loadingList      | boolean                     | Indicates whether the comment list is currently loading.                    |
| disableOpenClose | boolean                     | If true, disables the ability to open or close the comment list.            |
| commentsCount    | number                      | The total number of comments for the point or image.                        |
| commentType      | 'points' \| 'images'        | The type of comments being displayed, either for points or images.          |

## Methods

| Name              | Parameters | Return Type | Description                                                                 |
|-------------------|------------|-------------|-----------------------------------------------------------------------------|
| updated           | changedProperties: Map<string \| number \| symbol, unknown> | void | Called when the properties of the component have been updated.              |
| renderComment     | comment: YpPointData, index: number | TemplateResult | Renders a single comment within the list.                                   |
| render            | -          | TemplateResult | Renders the entire comment list component.                                  |
| scrollEvent       | event: any | void | Handles the scroll event for the virtualized list of comments.              |
| connectedCallback | -          | void | Lifecycle callback called when the element is added to the document's DOM.  |
| disconnectedCallback | -      | void | Lifecycle callback called when the element is removed from the document's DOM. |
| _openChanged      | -          | void | Called when the 'open' property changes.                                    |
| noComments        | -          | boolean | Returns true if there are no comments.                                      |
| setOpen           | -          | void | Sets the comment list to be open.                                           |
| setClosed         | -          | void | Sets the comment list to be closed.                                         |
| _pointChanged     | -          | void | Called when the 'point' property changes.                                   |
| refresh           | -          | void | Refreshes the comments and comment count.                                   |
| _imageChanged     | -          | void | Called when the 'image' property changes.                                   |
| hasContent        | -          | boolean | Returns true if there is either point or image content.                      |
| _getComments      | -          | Promise<void> | Asynchronously retrieves the comments for the point or image.               |
| _getCommentsCount | -          | Promise<void> | Asynchronously retrieves the comment count for the point or image.          |

## Events (if any)

- **iron-resize**: Emitted when the component requests a resize.
- **yp-point-deleted**: Emitted when a point is deleted, triggering a refresh.
- **yp-set-comments-count**: Emitted when the comments count is set, with the count as detail.

## Examples

```typescript
// Example usage of the YpPointCommentList component
<yp-point-comment-list
  .comments=${this.comments}
  .point=${this.point}
  .image=${this.image}
  .open=${this.open}
  .loadingList=${this.loadingList}
  .disableOpenClose=${this.disableOpenClose}
  .commentsCount=${this.commentsCount}
  .commentType=${this.commentType}
></yp-point-comment-list>
```

Please note that the `YpPointData`, `YpImageData`, and `YpCommentCountsResponse` types are not defined in the provided code and should be defined elsewhere in your codebase.