# YpUsersGrid

The `YpUsersGrid` class is a custom web component that extends `YpBaseElement` to display a grid of users. It allows for various operations such as inviting users, adding admins, removing users, and managing user organizations within a group, community, or domain context.

## Properties

| Name                          | Type                          | Description                                                                 |
|-------------------------------|-------------------------------|-----------------------------------------------------------------------------|
| addAdminEmail                 | HTMLInputElement \| undefined | Input element for adding an admin's email.                                   |
| inviteUserEmail               | HTMLInputElement \| undefined | Input element for inviting a user by email.                                  |
| headerText                    | string \| undefined           | Text displayed in the header of the grid.                                    |
| users                         | Array<YpUserData> \| undefined| Array of user data to be displayed in the grid.                              |
| groupId                       | number \| undefined           | ID of the group context for the grid.                                        |
| communityId                   | number \| undefined           | ID of the community context for the grid.                                    |
| domainId                      | number \| undefined           | ID of the domain context for the grid.                                       |
| adminUsers                    | boolean                       | Flag indicating if the grid is for admin users.                              |
| selected                      | YpUserData \| undefined       | Currently selected user data.                                                |
| modelType                     | string \| undefined           | Type of model (group, community, domain) for the grid context.               |
| availableOrganizations        | Array<YpOrganizationData> \| undefined | Array of available organizations for user association.                 |
| userIdForSelectingOrganization| number \| undefined           | ID of the user for selecting an organization.                                |
| selectedUsers                 | Array<YpUserData> \| undefined| Array of currently selected users.                                           |
| selectedUsersCount            | number                        | Count of currently selected users.                                           |
| selectedUsersEmpty            | boolean                       | Flag indicating if the selection of users is empty.                          |
| selectedUserIds               | Array<number> \| undefined    | Array of IDs of currently selected users.                                    |
| selectedUserId                | number \| undefined           | ID of the currently selected user.                                           |
| collectionName                | string                        | Name of the collection to which the grid belongs.                            |
| usersCountText                | string \| undefined           | Text displaying the count of users.                                          |
| showReload                    | boolean                       | Flag indicating if the reload button should be shown.                        |
| forceSpinner                  | boolean                       | Flag indicating if the spinner should be forced to show.                     |
| lastFethedId                  | number \| undefined           | ID of the last fetched entity for the grid.                                  |
| inviteType                    | string                        | Type of invite operation (sendInviteByEmail, addUserDirectly).               |
| resizeTimeout                 | any \| undefined              | Timeout handle for window resize throttling.                                 |

## Methods

| Name                          | Parameters                    | Return Type | Description                                                                 |
|-------------------------------|-------------------------------|-------------|-----------------------------------------------------------------------------|
| renderSelectionHeader         | root: HTMLElement, column?: GridColumn \| undefined | void | Renders the selection header for the grid. |
| selectionRenderer             | root: HTMLElement, column: any, rowData: any | void | Renders the selection controls for each row in the grid. |
| _reloadFromButton             | -                             | void        | Reloads the grid data when the reload button is clicked.                     |
| spinnerActive                 | -                             | boolean     | Returns true if the spinner should be active, false otherwise.               |
| _generateRequest              | id: number \| undefined = undefined | Promise<void> | Generates a request to fetch grid data. |
| _ajaxError                    | error: any \| undefined = undefined | void | Handles AJAX errors. |
| constructor                   | collectionName: string        | -           | Initializes the component with the given collection name.                    |
| connectedCallback             | -                             | void        | Lifecycle callback for when the component is added to the DOM.               |
| _reload                       | -                             | Promise<void> | Reloads the grid data. |
| _resizeThrottler              | -                             | void        | Throttles the resize event handler.                                          |
| _setGridSize                  | -                             | void        | Sets the size of the grid based on the window size.                          |
| _menuSelection                | event: CustomEvent            | void        | Handles menu selection events.                                               |
| totalUserCount                | -                             | string \| null | Returns the total count of users as a formatted string. |
| _selectedUsersChanged         | event: CustomEvent            | void        | Handles changes in the selected users.                                       |
| _userOrganizationId           | user: YpUserData              | number \| null | Returns the organization ID associated with the user. |
| _userOrganizationName         | user: YpUserData              | string \| null | Returns the organization name associated with the user. |
| _availableOrganizations       | -                             | YpOrganizationData[] | Returns the available organizations for the user. |
| _addToOrganization            | event: CustomEvent            | Promise<void> | Adds a user to an organization. |
| closeOrganizationDialog       | -                             | void        | Closes the organization selection dialog.                                     |
| _removeFromOrganization       | event: CustomEvent            | Promise<void> | Removes a user from an organization. |
| _selectOrganization           | event: CustomEvent            | Promise<void> | Selects an organization for a user. |
| _removeAdmin                  | event: CustomEvent            | Promise<void> | Removes an admin from the collection. |
| _removeSelectedAdmins         | event: CustomEvent            | void        | Prepares to remove selected admins.                                           |
| _removeAndDeleteContentSelectedUsers | event: CustomEvent    | void        | Prepares to remove selected users and delete their content.                   |
| _removeSelectedUsersFromCollection | event: CustomEvent      | void        | Prepares to remove selected users from the collection.                        |
| _removeUserFromCollection     | event: CustomEvent            | void        | Prepares to remove a user from the collection.                                |
| _removeAndDeleteUserContent   | event: CustomEvent            | void        | Prepares to remove a user and delete their content.                           |
| _removeMaster                 | type: string, userIds: Array<number> \| undefined = undefined | Promise<void> | Removes users based on the specified type and user IDs. |
| _reallyRemoveSelectedAdmins   | -                             | Promise<void> | Confirms and removes selected admins. |
| _reallyRemoveAndDeleteContentSelectedUsers | -               | Promise<void> | Confirms and removes selected users and deletes their content. |
| _reallyRemoveSelectedUsersFromCollection | -                 | Promise<void> | Confirms and removes selected users from the collection. |
| _reallyRemoveUserFromCollection | -                          | Promise<void> | Confirms and removes a user from the collection. |
| _reallyRemoveAndDeleteUserContent | -                        | Promise<void> | Confirms and removes a user and deletes their content. |
| _setupUserIdFromEvent         | event: CustomEvent            | void        | Sets up the selected user ID from the event.                                  |
| _openAllMenu                  | event: CustomEvent            | void        | Opens the menu for all selected users.                                        |
| _setSelected                  | event: CustomEvent            | void        | Sets the selected user based on the event.                                    |
| _findUserFromId               | id: Number                    | YpUserData \| undefined | Finds a user from the given ID. |
| _addAdmin                     | event: CustomEvent            | Promise<void> | Adds an admin to the collection. |
| _inviteUser                   | event: CustomEvent            | Promise<void> | Invites a user to the collection. |
| _manyItemsResponse            | showToast: boolean = false    | void        | Handles the response for operations affecting many items.                     |
| _removeAdminResponse          | -                             | void        | Handles the response for removing an admin.                                   |
| _removeManyAdminResponse      | -                             | void        | Handles the response for removing many admins.                                |
| _removeManyUsersResponse      | -                             | void        | Handles the response for removing many users.                                 |
| _removeAndDeleteCompleted     | -                             | void        | Handles the completion of removing and deleting a user.                       |
| _removeAndDeleteManyCompleted | -                             | void        | Handles the completion of removing and deleting many users.                   |
| _removeUserResponse           | -                             | void        | Handles the response for removing a user.                                     |
| _addAdminResponse             | -                             | void        | Handles the response for adding an admin.                                     |
| _addOrganizationResponse      | event: CustomEvent            | void        | Handles the response for adding a user to an organization.                    |
| _removeOrganizationResponse   | event: CustomEvent            | void        | Handles the response for removing a user from an organization.                |
| _inviteUserResponse           | -                             | void        | Handles the response for inviting a user.                                     |
| _domainIdChanged              | -                             | void        | Handles changes to the domain ID.                                             |
| _groupIdChanged               | -                             | void        | Handles changes to the group ID.                                              |
| _communityIdChanged           | -                             | void        | Handles changes to the community ID.                                          |
| _usersResponse                | event: CustomEvent            | void        | Handles the response for user data.                                           |
| setup                         | groupId: number \| undefined, communityId: number \| undefined, domainId: number \| undefined, adminUsers: boolean | void | Sets up the grid with the given parameters. |
| _reset                        | -                             | void        | Resets the grid data.                                                         |
| _resetSelectedAndClearCache   | -                             | void        | Resets the selected users and clears the grid cache.                          |
| _setupHeaderText              | -                             | void        | Sets up the header text based on the current context.                         |

## Events (if any)

- **updated**: Emitted when the component's properties are updated.
- **selected-items-changed**: Emitted when the selection of users changes.

## Examples

```typescript
// Example usage of the YpUsersGrid component
const usersGrid = document.createElement('yp-users-grid');
usersGrid.setup(undefined, undefined, 1, false); // Setup for domain users
document.body.appendChild(usersGrid);
```

Note: The above example assumes that the necessary environment and context for the component to function are already set up, such as the `window.adminServerApi` and `window.appGlobals` objects.