# YpForgotPassword

`YpForgotPassword` is a custom web component that provides a user interface for users to request a password reset if they have forgotten their password. It is part of a larger application and interacts with server APIs to send the password reset request.

## Properties

| Name             | Type                  | Description                                           |
|------------------|-----------------------|-------------------------------------------------------|
| emailErrorMessage| string \| undefined   | An optional message to display when there is an email error. |
| email            | string                | The email address entered by the user.                |
| emailHasBeenSent | boolean               | A flag indicating whether the password reset email has been sent. |
| isSending        | boolean               | A flag indicating whether the password reset request is currently being sent. |

## Methods

| Name                | Parameters           | Return Type | Description                                                                 |
|---------------------|----------------------|-------------|-----------------------------------------------------------------------------|
| _onEnter            | event: KeyboardEvent | void        | Handles the enter key press event to trigger the password reset request.    |
| _validateAndSend    | -                    | Promise<boolean> | Validates the email and sends the password reset request if valid. |
| connectedCallback   | -                    | void        | Lifecycle method called when the component is added to the DOM.             |
| disconnectedCallback| -                    | void        | Lifecycle method called when the component is removed from the DOM.          |
| _forgotPasswordError| event: CustomEvent   | void        | Handles the forgot password error event.                                    |
| open                | detail: { email: string } | void   | Opens the dialog and pre-fills the email if provided.                       |
| close               | -                    | void        | Closes the dialog.                                                          |

## Events

- **yp-error**: Emitted when there is an error in the form, such as when the email is not valid.

## Examples

```typescript
// Example usage of the YpForgotPassword component
const forgotPasswordComponent = document.createElement('yp-forgotPassword');
document.body.appendChild(forgotPasswordComponent);

// To open the dialog with a pre-filled email
forgotPasswordComponent.open({ email: 'user@example.com' });

// To close the dialog
forgotPasswordComponent.close();
```

Note: The actual usage may vary depending on the surrounding application infrastructure and how the component is integrated into the application.