# YpUserInfo

A web component that displays user information, including avatar, name, email, and action buttons for editing the user, logging out, and (optionally) creating a new organization. It extends `YpBaseElement` and uses Material Web buttons and a custom user image component.

## Properties

| Name                      | Type                | Description                                                                                 |
|---------------------------|---------------------|---------------------------------------------------------------------------------------------|
| user                      | YpUserData          | The user data object to display.                                                            |
| showCreateNewOrganization | boolean             | Whether to show the "Create New Organization" button, determined by domain access checking. |

## Methods

| Name                        | Parameters | Return Type | Description                                                                                      |
|-----------------------------|------------|-------------|--------------------------------------------------------------------------------------------------|
| render                      |            | unknown     | Renders the user info UI, including avatar, name, email, and action buttons.                     |
| connectedCallback           |            | void        | Lifecycle method called when the element is added to the DOM. Checks if organization creation is allowed. |
| _createNewOrganization      |            | void        | Redirects to the new organization creation page and fires a global event to close all drawers.   |
| _openAllContentModeration   |            | void        | Opens the content moderation dialog for the user (currently not fully implemented).              |
| _openEdit                   |            | void        | Fires an event to open the user edit dialog.                                                     |
| _logout                     |            | void        | Logs out the current user.                                                                       |

## Examples

```typescript
import "./yp-user-info.js";

const userInfo = document.createElement("yp-user-info");
userInfo.user = {
  id: 1,
  name: "Jane Doe",
  email: "jane@example.com",
  // ...other YpUserData fields
};
document.body.appendChild(userInfo);
```
