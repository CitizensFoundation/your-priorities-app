# YpResetPassword

The `YpResetPassword` class is a web component that provides a user interface for resetting a user's password. It extends from `YpBaseElement` and includes a dialog with a form for entering a new password, handling the reset password process.

## Properties

| Name                | Type   | Description                                       |
|---------------------|--------|---------------------------------------------------|
| password            | String | The password entered by the user.                 |
| token               | String | The token used to identify the password reset.    |
| passwordErrorMessage| String | The error message to display for password errors. |

## Methods

| Name            | Parameters             | Return Type | Description                                                      |
|-----------------|------------------------|-------------|------------------------------------------------------------------|
| onEnter         | event: KeyboardEvent   | void        | Handles the Enter key press to trigger the password reset.       |
| _validateAndSend|                        | Promise<void> | Validates the password and sends the reset password request.    |
| _cancel         |                        | void        | Emits a cancel event and closes the dialog.                      |
| _loginCompleted | user: YpUserData      | void        | Sets the logged-in user and emits a logged-in event.             |
| open            | token: string          | void        | Opens the dialog and sets the token if provided.                 |
| close           |                        | void        | Closes the dialog.                                               |

## Events

- **yp-error**: Emitted when there is an error during the password reset process.
- **cancel**: Emitted when the password reset process is canceled.
- **logged-in**: Emitted when the user has successfully logged in after resetting the password.

## Examples

```typescript
// Example usage of the YpResetPassword web component
const resetPasswordComponent = document.createElement('yp-reset-password');
resetPasswordComponent.open('reset-token-string');
document.body.appendChild(resetPasswordComponent);

// Listen for the logged-in event
resetPasswordComponent.addEventListener('logged-in', () => {
  console.log('User has logged in after password reset.');
});

// Listen for the cancel event
resetPasswordComponent.addEventListener('cancel', () => {
  console.log('Password reset process has been canceled.');
});
```