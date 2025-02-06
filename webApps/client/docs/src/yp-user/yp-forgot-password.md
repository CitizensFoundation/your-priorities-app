# YpForgotPassword

The `YpForgotPassword` class is a custom web component that provides a dialog interface for users to initiate a password reset process. It extends the `YpBaseElement` class and utilizes Material Design components for the dialog, text field, and buttons.

## Properties

| Name              | Type      | Description                                                                 |
|-------------------|-----------|-----------------------------------------------------------------------------|
| emailErrorMessage | string \| undefined | Error message related to the email input, if any.                                |
| email             | string    | The email address entered by the user.                                       |
| emailHasBeenSent  | boolean   | Indicates whether the password reset email has been sent.                    |
| isSending         | boolean   | Indicates whether the password reset request is currently being processed.   |

## Methods

| Name               | Parameters                | Return Type | Description                                                                 |
|--------------------|---------------------------|-------------|-----------------------------------------------------------------------------|
| closed             | None                      | void        | Fires a global event indicating the dialog has been closed.                 |
| render             | None                      | TemplateResult | Renders the HTML template for the component.                                |
| _onEnter           | event: KeyboardEvent      | void        | Handles the Enter key press event to trigger the password reset process.    |
| _validateAndSend   | None                      | Promise<boolean> | Validates the email input and sends the password reset request if valid.    |
| connectedCallback  | None                      | void        | Lifecycle method called when the element is added to the document.          |
| disconnectedCallback | None                    | void        | Lifecycle method called when the element is removed from the document.      |
| _forgotPasswordError | event: CustomEvent      | void        | Handles network error events related to the forgot password process.        |
| open               | detail: { email: string } | void        | Opens the dialog and optionally pre-fills the email field.                  |
| close              | None                      | void        | Closes the dialog.                                                          |

## Events

- **yp-dialog-closed**: Emitted when the dialog is closed.
- **yp-error**: Emitted when there is an error, such as incomplete form submission.
- **yp-dialog-opened**: Emitted when the dialog is opened.

## Examples

```typescript
// Example usage of the yp-forgot-password component
const forgotPasswordDialog = document.createElement('yp-forgot-password');
document.body.appendChild(forgotPasswordDialog);

// Open the dialog with a pre-filled email
forgotPasswordDialog.open({ email: 'user@example.com' });

// Listen for dialog closed event
forgotPasswordDialog.addEventListener('yp-dialog-closed', () => {
  console.log('Dialog was closed');
});
```