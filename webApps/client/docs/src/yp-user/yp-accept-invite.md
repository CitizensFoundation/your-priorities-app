# YpAcceptInvite

`YpAcceptInvite` is a custom web component that handles the acceptance of an invitation by a user. It is responsible for displaying an invitation dialog, handling the acceptance process, and managing related errors.

## Properties

| Name                   | Type                             | Description                                           |
|------------------------|----------------------------------|-------------------------------------------------------|
| token                  | `string` \| `undefined`          | The unique token associated with the invitation.      |
| errorMessage           | `string` \| `undefined`          | An error message to be displayed if an error occurs.  |
| inviteName             | `string` \| `undefined`          | The name of the person or entity sending the invite.  |
| targetName             | `string` \| `undefined`          | The name of the target recipient of the invite.       |
| targetEmail            | `string` \| `undefined`          | The email address of the target recipient.            |
| collectionConfiguration| `YpCollectionConfiguration` \| `undefined` | Configuration details for the collection associated with the invite. |

## Methods

| Name               | Parameters                  | Return Type | Description                                                                 |
|--------------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| _inviteError       | event: `CustomEvent`        | `void`      | Handles errors related to the invitation process.                           |
| _checkInviteSender |                             | `Promise<void>` | Checks the sender of the invite using the provided token.                   |
| _acceptInvite      |                             | `void`      | Initiates the process to accept the invite if the user is logged in.        |
| afterLogin         | token: `string`             | `void`      | Called after the user logs in to continue the invite acceptance process.    |
| _reallyAcceptInvite|                             | `Promise<void>` | Finalizes the acceptance of the invite.                                     |
| _cancel            |                             | `void`      | Cancels the invitation process and redirects the user to the home page.     |
| open               | token: `string`             | `void`      | Opens the invitation dialog and checks the invite sender.                   |
| reOpen             | token: `string`             | `void`      | Reopens the invitation dialog.                                              |
| close              |                             | `void`      | Closes the invitation dialog.                                               |

## Events

- **yp-network-error**: Emitted when there is a network error during the invitation process.
- **yp-error**: Emitted when there is an error related to the invitation acceptance.

## Examples

```typescript
// Example usage of the YpAcceptInvite component
const inviteComponent = document.createElement('yp-accept-invite');
inviteComponent.open('invitation-token');
document.body.appendChild(inviteComponent);
```

Please note that the actual implementation of `YpCollectionConfiguration`, `YpInviteSenderInfoResponse`, `YpAcceptInviteResponse`, and other dependencies are not provided in the given code snippet. Ensure that these types are defined elsewhere in your codebase for the component to function correctly.