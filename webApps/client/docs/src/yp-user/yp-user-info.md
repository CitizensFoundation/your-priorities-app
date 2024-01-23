# YpUserInfo

`YpUserInfo` is a custom web component that extends `YpBaseElement` to display user information including avatar, name, email, and provides buttons to edit user details, view content moderation, and logout.

## Properties

| Name   | Type      | Description                           |
|--------|-----------|---------------------------------------|
| user   | YpUserData | The user data to be displayed.        |

## Methods

| Name                      | Parameters | Return Type | Description                                      |
|---------------------------|------------|-------------|--------------------------------------------------|
| _openAllContentModeration |            | void        | Opens the content moderation for the user.       |
| _openEdit                 |            | void        | Emits an event to open the user edit dialog.     |
| _logout                   |            | void        | Logs out the user.                               |

## Events

- **open-user-edit**: Description of when and why the event is emitted.

## Examples

```typescript
// Example usage of the YpUserInfo web component
<yp-user-info .user="${this.userData}"></yp-user-info>
```

Please note that the `YpUserData` type is not defined in the provided code snippet. You should define this type in your TypeScript codebase to match the expected structure of the user data object.