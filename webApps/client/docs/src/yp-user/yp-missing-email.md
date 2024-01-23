# YpMissingEmail

`YpMissingEmail` is a custom web component that provides a dialog interface for users to input their email and optionally their password. It is used for confirming an email address, setting an email for a user, or linking accounts if the email is already registered. The component is part of a larger application and interacts with global application state and server API.

## Properties

| Name                      | Type                  | Description                                                                 |
|---------------------------|-----------------------|-----------------------------------------------------------------------------|
| emailErrorMessage         | string \| undefined   | An error message to display if there is an issue with the email input.      |
| passwordErrorMessage      | string \| undefined   | An error message to display if there is an issue with the password input.   |
| needPassword              | boolean               | Indicates if a password is required for linking accounts.                   |
| linkAccountText           | boolean               | Indicates if the link account text should be displayed.                     |
| onlyConfirmingEmail       | boolean               | Indicates if the component is only being used to confirm an email address.  |
| originalConfirmationEmail | string \| undefined   | The original email address to be confirmed, if applicable.                  |
| email                     | string \| undefined   | The email address input by the user.                                        |
| password                  | string \| undefined   | The password input by the user, if needed for linking accounts.             |
| heading                   | string \| undefined   | The heading text for the dialog.                                            |
| target                    | HTMLElement \| undefined | The target element that the dialog is related to, if any.                |

## Methods

| Name              | Parameters                | Return Type | Description                                                                 |
|-------------------|---------------------------|-------------|-----------------------------------------------------------------------------|
| submitButtonLabel | none                      | string      | Computes the label for the submit button based on the component's state.     |
| _onEnter          | event: KeyboardEvent      | void        | Handles the enter key press to trigger form submission.                      |
| _notNow           | none                      | void        | Handles the action when the user decides to deal with the email later.       |
| _logout           | none                      | void        | Logs out the user from the application.                                      |
| _forgotPassword   | none                      | void        | Triggers the forgot password flow for the user.                              |
| connectedCallback | none                      | void        | Lifecycle callback that sets the default heading when the component connects.|
| credentials       | none                      | object      | Retrieves the email and password input by the user.                          |
| _validateAndSend  | none                      | Promise<boolean> | Validates the form and sends the data to the server.                   |
| open              | onlyConfirming: boolean, email: string | void | Opens the dialog with the specified email and confirmation state. |
| close             | none                      | void        | Closes the dialog.                                                           |

## Events (if any)

- **yp-forgot-password**: Emitted when the user clicks the forgot password button.
- **yp-error**: Emitted when there is an error in form validation or server response.

## Examples

```typescript
// Example usage of the YpMissingEmail component
const ypMissingEmail = document.createElement('yp-missing-email');
document.body.appendChild(ypMissingEmail);

// Open the dialog for confirming an email
ypMissingEmail.open(true, 'user@example.com');

// Open the dialog for setting an email
ypMissingEmail.open(false, '');

// Listen for the forgot password event
ypMissingEmail.addEventListener('yp-forgot-password', (event) => {
  console.log('Forgot password for email:', event.detail.email);
});

// Listen for errors
ypMissingEmail.addEventListener('yp-error', (event) => {
  console.error('Error:', event.detail);
});
```