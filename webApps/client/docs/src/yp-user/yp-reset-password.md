# YpResetPassword

The `YpResetPassword` class is a web component that provides a user interface for resetting a password. It extends the `YpBaseElement` and utilizes Material Design components for dialog, text field, and buttons.

## Properties

| Name                | Type   | Description                                      |
|---------------------|--------|--------------------------------------------------|
| password            | string | The new password entered by the user.            |
| token               | string | The token used to validate the password reset.   |
| passwordErrorMessage| string | Error message related to the password input.     |

## Methods

| Name               | Parameters          | Return Type | Description                                                                 |
|--------------------|---------------------|-------------|-----------------------------------------------------------------------------|
| render             | None                | TemplateResult | Renders the HTML template for the component.                                |
| onEnter            | event: KeyboardEvent| void        | Handles the Enter key press event to trigger password validation and sending. |
| _validateAndSend   | None                | Promise<void>| Validates the password and sends it to the server for resetting.            |
| _cancel            | None                | void        | Cancels the password reset process and redirects to the home page.          |
| _loginCompleted    | user: YpUserData    | void        | Completes the login process after a successful password reset.              |
| open               | token: string       | Promise<void>| Opens the dialog for password reset with the provided token.                |
| close              | None                | void        | Closes the password reset dialog.                                           |

## Events

- **yp-error**: Emitted when there is an error during the password reset process, such as an invalid or used token.
- **cancel**: Emitted when the password reset process is canceled.
- **logged-in**: Emitted when the user is successfully logged in after resetting the password.

## Examples

```typescript
// Example usage of the yp-reset-password component
const resetPasswordElement = document.createElement('yp-reset-password');
document.body.appendChild(resetPasswordElement);

// Open the reset password dialog with a token
resetPasswordElement.open('your-reset-token-here');
```