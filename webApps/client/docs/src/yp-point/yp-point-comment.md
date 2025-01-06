# YpPointComment

The `YpPointComment` class is a web component that extends `YpBaseElementWithLogin`. It is used to display a comment associated with a point, along with user information and actions related to the point.

## Properties

| Name   | Type                  | Description                                      |
|--------|-----------------------|--------------------------------------------------|
| point  | YpPointData \| undefined | The data of the point associated with the comment. |
| user   | YpUserData \| undefined | The user data associated with the point.          |
| hideUser | boolean              | Determines whether the user information should be hidden. |

## Methods

| Name                | Parameters                                      | Return Type | Description                                                                 |
|---------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| updated             | changedProperties: Map<string \| number \| symbol, unknown> | void        | Called when the element's properties change. Checks if the `point` property has changed and calls `_pointChanged`. |
| render              | none                                            | TemplateResult \| typeof nothing | Renders the component's template. Displays the point comment and associated actions. |
| connectedCallback   | none                                            | void        | Called when the element is added to the document. Adds global event listeners. |
| disconnectedCallback| none                                            | void        | Called when the element is removed from the document. Removes global event listeners. |
| _deletePoint        | none                                            | void        | Initiates the process to delete the point by opening a confirmation dialog. |
| _reallyDeletePoint  | none                                            | Promise<void> | Deletes the point from the server and fires events to notify about the deletion. |
| _reportPoint        | none                                            | void        | Opens a dialog to report the point.                                         |
| _onReport           | none                                            | void        | Notifies the user that the point has been reported.                         |
| _pointChanged       | none                                            | void        | Updates the user property based on the current point data.                  |
| hasPointAccess      | none                                            | boolean     | Checks if the current user has access to the point.                         |
| loginName           | none                                            | string \| undefined | Returns the name of the user associated with the point.                     |

## Events

- **yp-point-deleted**: Emitted when a point is successfully deleted. Contains the `pointId` of the deleted point.

## Examples

```typescript
// Example usage of the YpPointComment component
import './yp-point-comment.js';

const commentElement = document.createElement('yp-point-comment');
commentElement.point = {
  id: '123',
  content: 'This is a sample comment.',
  PointRevisions: [{ User: { name: 'John Doe' } }]
};
document.body.appendChild(commentElement);
```