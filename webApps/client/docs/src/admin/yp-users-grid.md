# YpUsersGrid

The `YpUsersGrid` class is a custom web component that extends `YpBaseElement`. It provides a grid interface for managing users, including functionalities for inviting users, adding admins, and managing user selections within groups, communities, or domains.

## Properties

| Name                             | Type                                      | Description                                                                 |
|----------------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| `addAdminEmail`                  | `HTMLInputElement \| undefined`           | Reference to the input element for adding admin email.                      |
| `inviteUserEmail`                | `HTMLInputElement \| undefined`           | Reference to the input element for inviting user email.                     |
| `headerText`                     | `string \| undefined`                     | The header text displayed in the grid.                                      |
| `users`                          | `Array<YpUserData> \| undefined`          | List of users displayed in the grid.                                        |
| `groupId`                        | `number \| undefined`                     | ID of the group associated with the grid.                                   |
| `communityId`                    | `number \| undefined`                     | ID of the community associated with the grid.                               |
| `domainId`                       | `number \| undefined`                     | ID of the domain associated with the grid.                                  |
| `adminUsers`                     | `boolean`                                 | Flag indicating if the grid is displaying admin users.                      |
| `selected`                       | `YpUserData \| undefined`                 | The currently selected user.                                                |
| `modelType`                      | `string \| undefined`                     | The type of model (group, community, domain) being managed.                 |
| `availableOrganizations`         | `Array<YpOrganizationData> \| undefined`  | List of available organizations for user assignment.                        |
| `userIdForSelectingOrganization` | `number \| undefined`                     | ID of the user for selecting an organization.                               |
| `selectedUsers`                  | `Array<YpUserData> \| undefined`          | List of currently selected users.                                           |
| `selectedUsersCount`             | `number`                                  | Count of selected users.                                                    |
| `selectedUsersEmpty`             | `boolean`                                 | Flag indicating if no users are selected.                                   |
| `selectedUserIds`                | `Array<number> \| undefined`              | List of IDs of selected users.                                              |
| `selectedUserId`                 | `number \| undefined`                     | ID of the currently selected user.                                          |
| `collectionName`                 | `string`                                  | Name of the collection being managed.                                       |
| `usersCountText`                 | `string \| undefined`                     | Text displaying the count of users.                                         |
| `showReload`                     | `boolean`                                 | Flag indicating if the reload button should be shown.                       |
| `forceSpinner`                   | `boolean`                                 | Flag to force the display of a loading spinner.                             |
| `lastFethedId`                   | `number \| undefined`                     | ID of the last fetched user.                                                |
| `inviteType`                     | `string`                                  | Type of invite being sent (e.g., "sendInviteByEmail").                      |
| `resizeTimeout`                  | `any \| undefined`                        | Timeout for resize throttling.                                              |

## Methods

| Name                                      | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| `updated`                                 | `changedProperties: Map<string \| number \| symbol, unknown>`               | `void`      | Lifecycle method called when properties are updated.                        |
| `renderSelectionHeader`                   | `root: HTMLElement, column?: GridColumn \| undefined`                      | `void`      | Renders the selection header for the grid.                                  |
| `selectionRenderer`                       | `root: HTMLElement, column: any, rowData: any`                             | `void`      | Renders the selection options for each row in the grid.                     |
| `_reloadFromButton`                       |                                                                            | `void`      | Reloads the grid data when the reload button is clicked.                    |
| `render`                                  |                                                                            | `TemplateResult` | Renders the component's template.                                           |
| `spinnerActive`                           |                                                                            | `boolean`   | Returns whether the spinner should be active.                               |
| `_generateRequest`                        | `id: number \| undefined = undefined`                                      | `Promise<void>` | Generates a request to fetch user data.                                     |
| `_ajaxError`                              | `error: any \| undefined = undefined`                                      | `void`      | Handles AJAX errors.                                                        |
| `constructor`                             | `collectionName: string`                                                   |             | Constructor for the component.                                              |
| `connectedCallback`                       |                                                                            | `void`      | Lifecycle method called when the component is added to the DOM.             |
| `_reload`                                 |                                                                            | `Promise<void>` | Reloads the grid data.                                                      |
| `_resizeThrottler`                        |                                                                            | `void`      | Throttles resize events to optimize performance.                            |
| `_setGridSize`                            |                                                                            | `void`      | Sets the size of the grid based on the window size.                         |
| `_menuSelection`                          | `event: CustomEvent`                                                       | `void`      | Handles menu selection events.                                              |
| `totalUserCount`                          |                                                                            | `string \| null` | Returns the total count of users.                                           |
| `_selectedUsersChanged`                   | `event: CustomEvent`                                                       | `void`      | Handles changes to the selected users.                                      |
| `_userOrganizationId`                     | `user: YpUserData`                                                         | `number \| null` | Returns the organization ID for a user.                                     |
| `_userOrganizationName`                   | `user: YpUserData`                                                         | `string \| null` | Returns the organization name for a user.                                   |
| `_availableOrganizations`                 |                                                                            | `YpOrganizationData[]` | Returns the list of available organizations.                                |
| `_addToOrganization`                      | `event: CustomEvent`                                                       | `Promise<void>` | Adds a user to an organization.                                             |
| `closeOrganizationDialog`                 |                                                                            | `void`      | Closes the organization selection dialog.                                   |
| `_removeFromOrganization`                 | `event: CustomEvent`                                                       | `Promise<void>` | Removes a user from an organization.                                        |
| `_selectOrganization`                     | `event: CustomEvent`                                                       | `Promise<void>` | Selects an organization for a user.                                         |
| `_removeAdmin`                            | `event: CustomEvent`                                                       | `Promise<void>` | Removes an admin from a group, community, or domain.                        |
| `_removeSelectedAdmins`                   | `event: CustomEvent`                                                       | `void`      | Removes selected admins after confirmation.                                 |
| `_removeAndDeleteContentSelectedUsers`    | `event: CustomEvent`                                                       | `void`      | Removes and deletes content of selected users after confirmation.           |
| `_removeSelectedUsersFromCollection`      | `event: CustomEvent`                                                       | `void`      | Removes selected users from the collection after confirmation.              |
| `_removeUserFromCollection`               | `event: CustomEvent`                                                       | `void`      | Removes a user from the collection after confirmation.                      |
| `_removeAndDeleteUserContent`             | `event: CustomEvent`                                                       | `void`      | Removes a user and deletes their content after confirmation.                |
| `_removeMaster`                           | `type: string, userIds: Array<number> \| undefined = undefined`            | `Promise<void>` | Master method for removing users or admins.                                 |
| `_reallyRemoveSelectedAdmins`             |                                                                            | `Promise<void>` | Confirms and removes selected admins.                                       |
| `_reallyRemoveAndDeleteContentSelectedUsers` |                                                                            | `Promise<void>` | Confirms and removes selected users and deletes their content.              |
| `_reallyRemoveSelectedUsersFromCollection` |                                                                            | `Promise<void>` | Confirms and removes selected users from the collection.                    |
| `_reallyRemoveUserFromCollection`         |                                                                            | `Promise<void>` | Confirms and removes a user from the collection.                            |
| `_reallyRemoveAndDeleteUserContent`       |                                                                            | `Promise<void>` | Confirms and removes a user and deletes their content.                      |
| `_setupUserIdFromEvent`                   | `event: CustomEvent`                                                       | `void`      | Sets up the user ID from an event.                                          |
| `_openAllMenu`                            | `event: CustomEvent`                                                       | `void`      | Opens the menu for all users.                                               |
| `_setSelected`                            | `event: CustomEvent`                                                       | `void`      | Sets a user as selected.                                                    |
| `_findUserFromId`                         | `id: Number`                                                               | `YpUserData \| undefined` | Finds a user by their ID.                                                   |
| `_addAdmin`                               | `event: CustomEvent`                                                       | `Promise<void>` | Adds an admin to a group, community, or domain.                             |
| `_inviteUser`                             | `event: CustomEvent`                                                       | `Promise<void>` | Invites a user to a group or community.                                     |
| `_manyItemsResponse`                      | `showToast = false`                                                        | `void`      | Handles responses for operations involving multiple items.                  |
| `_removeAdminResponse`                    |                                                                            | `void`      | Handles the response for removing an admin.                                 |
| `_removeManyAdminResponse`                |                                                                            | `void`      | Handles the response for removing multiple admins.                          |
| `_removeManyUsersResponse`                |                                                                            | `void`      | Handles the response for removing multiple users.                           |
| `_removeAndDeleteCompleted`               |                                                                            | `void`      | Handles the response for removing and deleting a user.                      |
| `_removeAndDeleteManyCompleted`           |                                                                            | `void`      | Handles the response for removing and deleting multiple users.              |
| `_removeUserResponse`                     |                                                                            | `void`      | Handles the response for removing a user.                                   |
| `_addAdminResponse`                       |                                                                            | `void`      | Handles the response for adding an admin.                                   |
| `_addOrganizationResponse`                | `event: CustomEvent`                                                       | `void`      | Handles the response for adding a user to an organization.                  |
| `_removeOrganizationResponse`             | `event: CustomEvent`                                                       | `void`      | Handles the response for removing a user from an organization.              |
| `_inviteUserResponse`                     |                                                                            | `void`      | Handles the response for inviting a user.                                   |
| `_domainIdChanged`                        |                                                                            | `void`      | Handles changes to the domain ID.                                           |
| `_groupIdChanged`                         |                                                                            | `void`      | Handles changes to the group ID.                                            |
| `_communityIdChanged`                     |                                                                            | `void`      | Handles changes to the community ID.                                        |
| `_usersResponse`                          | `event: CustomEvent`                                                       | `void`      | Handles the response for fetching users.                                    |
| `setup`                                   | `groupId: number \| undefined, communityId: number \| undefined, domainId: number \| undefined, adminUsers: boolean` | `void` | Sets up the grid with the specified parameters.                             |
| `_reset`                                  |                                                                            | `void`      | Resets the grid data.                                                       |
| `_resetSelectedAndClearCache`             |                                                                            | `void`      | Resets selected users and clears the grid cache.                            |
| `_setupHeaderText`                        |                                                                            | `void`      | Sets up the header text based on the current context.                       |

## Examples

```typescript
// Example usage of the YpUsersGrid component
const usersGrid = document.createElement('yp-users-grid');
usersGrid.collectionName = 'User Collection';
document.body.appendChild(usersGrid);
```