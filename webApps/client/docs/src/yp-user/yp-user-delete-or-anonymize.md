# YpUserDeleteOrAnonymize

A custom web component that provides a user interface for deleting or anonymizing a user account. It extends `YpBaseElement` and includes a dialog with options to delete or anonymize the user account, along with confirmation dialogs for each action.

## Properties

| Name          | Type    | Description                                   |
|---------------|---------|-----------------------------------------------|
| spinnerActive | Boolean | Indicates if the spinner is currently active. |

## Methods

| Name                    | Parameters | Return Type | Description                                                                 |
|-------------------------|------------|-------------|-----------------------------------------------------------------------------|
| _deleteUser             |            | void        | Initiates the user deletion process by opening a confirmation dialog.       |
| _deleteUserFinalWarning |            | void        | Opens a final warning dialog before deleting the user.                      |
| _anonymizeUser          |            | void        | Initiates the user anonymization process by opening a confirmation dialog.  |
| _anonymizeUserFinalWarning |        | void        | Opens a final warning dialog before anonymizing the user.                   |
| _deleteUserForReal      |            | Promise<void> | Deletes the user after confirmation and indicates completion.             |
| _anonymizeUserForReal   |            | Promise<void> | Anonymizes the user after confirmation and indicates completion.           |
| open                    |            | void        | Opens the dialog component to show the delete/anonymize options.            |
| _completed              |            | void        | Closes the dialog and redirects to the home page after an action is completed. |

## Events

- **None specified**

## Examples

```typescript
// Example usage of the YpUserDeleteOrAnonymize component
const deleteUserComponent = document.createElement('yp-user-delete-or-anonymize');
document.body.appendChild(deleteUserComponent);

// To open the dialog
deleteUserComponent.open();

// To listen for completion (not directly provided by the component, but as a result of the action)
window.addEventListener('locationchange', () => {
  console.log('User has been deleted or anonymized and redirected to home.');
});
```
