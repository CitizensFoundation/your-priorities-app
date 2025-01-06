# YpUserInfo

`YpUserInfo` is a custom web component that displays user information, including their avatar, name, and email. It provides buttons for editing user information, logging out, and optionally creating a new organization.

## Properties

| Name                      | Type      | Description                                                                 |
|---------------------------|-----------|-----------------------------------------------------------------------------|
| user                      | YpUserData | The user data object containing information about the user.                 |
| showCreateNewOrganization | boolean   | Determines whether the "Create New Organization" button is visible or not.  |

## Methods

| Name                        | Parameters | Return Type | Description                                                                 |
|-----------------------------|------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback           | None       | void        | Lifecycle method called when the element is added to the document.          |
| _createNewOrganization      | None       | void        | Redirects to the new organization creation page and closes all drawers.     |
| _openAllContentModeration   | None       | void        | Opens the user content moderation activity.                                 |
| _openEdit                   | None       | void        | Fires an event to open the user edit interface.                             |
| _logout                     | None       | void        | Logs out the current user.                                                  |

## Examples

```typescript
import './yp-user-info.js';

const userInfoElement = document.createElement('yp-user-info');
userInfoElement.user = {
  name: 'John Doe',
  email: 'john.doe@example.com'
};
document.body.appendChild(userInfoElement);
```

This example demonstrates how to create and use the `YpUserInfo` component, setting the `user` property to display user information.