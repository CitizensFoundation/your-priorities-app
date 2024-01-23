# YpPointComment

A custom element that represents a comment on a point, including user information, comment content, and actions related to the point.

## Properties

| Name       | Type            | Description                                      |
|------------|-----------------|--------------------------------------------------|
| point      | YpPointData     | The point data associated with the comment.      |
| user       | YpUserData      | The user data associated with the comment.       |
| hideUser   | boolean         | Whether to hide the user information or not.     |

## Methods

| Name                | Parameters | Return Type | Description                                      |
|---------------------|------------|-------------|--------------------------------------------------|
| updated             | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method called when properties change.  |
| render              |            | TemplateResult \| typeof nothing | Renders the HTML template for the component.    |
| connectedCallback   |            | void        | Lifecycle method called when element is added to the DOM. |
| disconnectedCallback|            | void        | Lifecycle method called when element is removed from the DOM. |
| _deletePoint        |            | void        | Initiates the deletion process for the point.    |
| _reallyDeletePoint  |            | Promise<void> | Actually performs the deletion of the point.    |
| _reportPoint        |            | void        | Initiates the report process for the point.      |
| _onReport           |            | void        | Callback for when a point is reported.           |
| _pointChanged       |            | void        | Called when the point property changes.          |
| hasPointAccess      |            | boolean     | Checks if the current user has access to the point. |
| loginName           |            | string \| undefined | Returns the login name of the user associated with the point. |

## Events

- **yp-logged-in**: Emitted when the user logs in.
- **yp-got-admin-rights**: Emitted when the user gets admin rights.
- **yp-point-deleted**: Emitted when a point is deleted.
- **iron-resize**: Emitted when an element's size changes.

## Examples

```typescript
// Example usage of the YpPointComment element
<yp-point-comment .point="${this.pointData}" .user="${this.userData}"></yp-point-comment>
```

Please note that `YpPointData`, `YpUserData`, and other types used in the properties and methods are not defined in the provided code snippet. You should define these types in your TypeScript codebase to ensure type safety and provide additional documentation for them if necessary.