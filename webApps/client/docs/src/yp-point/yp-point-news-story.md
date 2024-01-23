# YpPointNewsStory

A custom element that represents a news story with associated actions and comments.

## Properties

| Name          | Type            | Description                                       |
|---------------|-----------------|---------------------------------------------------|
| point         | YpPointData     | The data object for the point (news story).       |
| user          | YpUserData \| undefined | The user data object associated with the point. |
| withComments  | boolean         | Indicates if comments should be displayed.        |
| open          | boolean         | Indicates if the comments section is open.         |
| hideUser      | boolean         | Indicates if the user information should be hidden.|
| commentsCount | number          | The count of comments associated with the point.   |

## Methods

| Name               | Parameters                        | Return Type | Description                                         |
|--------------------|-----------------------------------|-------------|-----------------------------------------------------|
| updated            | changedProperties: Map<string \| number \| symbol, unknown> | void        | Called when the element's properties have changed.  |
| render             |                                   | TemplateResult | Generates the template for the element.            |
| _setOpenToValue    |                                   | void        | Toggles the open state of the comments section.     |
| _openChanged       |                                   | void        | Called when the 'open' property changes.            |
| noComments         |                                   | boolean     | Returns true if there are no comments.              |
| _setOpen           |                                   | void        | Sets the comments section to be open.               |
| _setClosed         |                                   | void        | Sets the comments section to be closed.             |
| _setCommentsCount  | event: CustomEvent                | void        | Sets the comments count based on an event.          |
| _pointChanged      |                                   | void        | Called when the 'point' property changes.           |
| loginName          |                                   | string      | Returns the login name of the user who created the point. |

## Events

- **yp-set-comments-count**: Emitted when the comments count is set.

## Examples

```typescript
// Example usage of the YpPointNewsStory element
<yp-point-news-story
  .point="${yourPointData}"
  .user="${yourUserData}"
  withComments="${true}"
  open="${false}"
  hideUser="${false}"
  commentsCount="${0}">
</yp-point-news-story>
```

Please replace `yourPointData` and `yourUserData` with the actual data objects you want to pass to the element.