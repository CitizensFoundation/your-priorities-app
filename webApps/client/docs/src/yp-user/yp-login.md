# YpLogin

This class represents a login component for a web application, providing user authentication functionality. It includes properties for managing user input, error messages, and various authentication methods such as Facebook and SAML. The class also handles anonymous and one-time login features, and it can display additional registration questions if configured.

## Properties

| Name                          | Type                        | Description                                                                 |
|-------------------------------|-----------------------------|-----------------------------------------------------------------------------|
| userSpinner                   | Boolean                     | Indicates if a spinner should be shown to represent a loading state.        |
| domain                        | YpDomainData \| undefined   | Domain data for the login component.                                        |
| reCaptchaSiteKey              | String                      | Site key for reCAPTCHA integration.                                         |
| emailErrorMessage             | string \| undefined         | Error message for email validation.                                         |
| passwordErrorMessage          | string \| undefined         | Error message for password validation.                                      |
| name                          | String                      | Name of the user.                                                           |
| email                         | String                      | Email address of the user.                                                  |
| password                      | String                      | Password of the user.                                                       |
| submitText                    | String                      | Text for the submit button.                                                 |
| redirectToURL                 | string \| undefined         | URL to redirect to after successful login.                                  |
| forgotPasswordOpen            | Boolean                     | Indicates if the forgot password dialog is open.                            |
| heading                       | string \| undefined         | Heading text for the login component.                                       |
| customUserRegistrationText    | string \| undefined         | Custom text for user registration.                                          |
| opened                        | Boolean                     | Indicates if the login dialog is open.                                      |
| target                        | any \| undefined            | Target element for the login dialog.                                        |
| forceSecureSamlLogin          | Boolean                     | Forces a secure SAML login if true.                                         |
| hasAnonymousLogin             | Boolean                     | Enables anonymous login if true.                                            |
| disableFacebookLoginForGroup  | Boolean                     | Disables Facebook login for specific groups if true.                        |
| credentials                   | Record<string, unknown> \| undefined | Credentials object for the user.                                      |
| pollingStartedAt              | Date \| undefined           | Timestamp indicating when polling for login started.                        |
| signupTermsId                 | number \| undefined         | ID of the signup terms page.                                                |
| samlLoginButtonUrl            | string \| undefined         | URL for the SAML login button image.                                        |
| customSamlLoginText           | string \| undefined         | Custom text for SAML login.                                                 |
| oneTimeLoginName              | string \| undefined         | Name for one-time login.                                                    |
| hasOneTimeLoginWithName       | Boolean                     | Enables one-time login with name if true.                                   |
| registrationQuestionsGroup    | YpGroupData \| undefined    | Group data for additional registration questions.                           |

## Methods

| Name                          | Parameters                  | Return Type | Description                                                                 |
|-------------------------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| onLoginFunction               | Function \| undefined       | -           | Callback function to be called after successful login.                      |
| isSending                     | Boolean                     | -           | Indicates if the login request is currently being sent.                     |
| reloadPageOnDialogClose       | Boolean                     | -           | Determines if the page should be reloaded when the dialog is closed.        |
| _logingDialogClose            | -                           | -           | Handles the closing of the login dialog.                                    |
| renderSamlLogin               | -                           | TemplateResult | Renders the SAML login button.                                          |
| renderAdditionalMethods       | -                           | TemplateResult | Renders additional authentication methods.                              |
| renderLogin                   | -                           | TemplateResult | Renders the login dialog.                                                |
| renderCreateUser              | -                           | TemplateResult | Renders the create user dialog.                                          |
| renderButtons                 | -                           | TemplateResult | Renders the buttons for the login component.                             |
| closeAndReset                 | -                           | -           | Closes the login dialog and resets any state.                              |
| renderOneTimeDialog           | -                           | TemplateResult | Renders the one-time login dialog.                                      |
| openCreateUser                | -                           | -           | Opens the create user dialog.                                              |
| cancelRegistration            | -                           | -           | Cancels the registration process and returns to the login dialog.           |
| _setupJsonCredentials         | registerMode: Boolean       | -           | Sets up the credentials object for the user.                                |
| _updateOneTimeLoginName       | event: KeyboardEvent        | -           | Updates the name for one-time login.                                       |
| renderForgotPassword          | -                           | TemplateResult | Renders the forgot password dialog.                                      |
| _registrationQuestionsChanged | -                           | -           | Handles changes to the registration questions.                              |
| _setupCustomRegistrationQuestions | -                           | -           | Sets up custom registration questions if configured.                        |
| _keySaml                      | event: KeyboardEvent        | -           | Handles key events for SAML login.                                         |
| _openTerms                    | -                           | -           | Opens the terms and conditions page.                                       |
| _facebookLogin                | -                           | -           | Initiates Facebook login process.                                          |
| oneTimeLogin                  | -                           | -           | Initiates one-time login process.                                           |
| finishOneTimeLoginWithName    | -                           | -           | Completes the one-time login process with a name.                           |
| anonymousLogin                | loginSubType: string, registrationAnswers: Record<string, string>[] \| undefined | - | Initiates anonymous login process. |
| _isInApp                      | -                           | Boolean     | Checks if the login is occurring within an app.                             |
| _openSamlLogin                | -                           | -           | Initiates SAML login process.                                               |
| _startSpinner                 | -                           | -           | Starts the spinner to indicate a loading state.                             |
| _cancel                       | -                           | -           | Cancels the login process.                                                  |
| _domainEvent                  | event: CustomEvent          | -           | Handles domain-related events.                                              |
| _networkError                 | event: CustomEvent          | -           | Handles network errors during the login process.                            |
| _forgotPassword               | -                           | -           | Opens the forgot password dialog.                                           |
| setup                         | onLoginFunction: Function, domain: YpDomainData | - | Sets up the login component with a callback and domain data.            |
| _setTexts                     | -                           | -           | Sets up the text for various elements in the login component.               |
| emailValue                    | registerMode: boolean \| undefined | String | Returns the email value based on the mode.                              |
| passwordValue                 | registerMode: boolean \| undefined | String | Returns the password value based on the mode.                            |
| fullnameValue                 | -                           | String \| void | Returns the full name value.                                            |
| _registerUser                 | -                           | -           | Registers a new user with the provided credentials.                         |
| _loginUser                    | -                           | -           | Logs in a user with the provided credentials.                               |
| _validateAndSend              | registerMode: boolean       | Boolean     | Validates the input and sends the login or registration request.            |
| _loginAfterSavePassword       | user: YpUserData            | -           | Handles actions after saving the password and logging in.                   |
| _loginCompleted               | user: YpUserData            | -           | Completes the login process and updates the user state.                     |
| open                          | redirectToURL: string \| undefined, email: string \| undefined, collectionConfiguration: YpCollectionConfiguration \| undefined | - | Opens the login dialog with optional redirect URL, email, and configuration. |
| close                         | -                           | -           | Closes the login dialog.                                                    |

## Events

- **eventName**: Description of when and why the event is emitted.

## Examples

```typescript
// Example usage of the YpLogin component
const loginComponent = document.createElement('yp-login');
loginComponent.setup(() => console.log('Logged in!'), domainData);
document.body.appendChild(loginComponent);
loginComponent.open();
```

Note: The actual usage of the component would depend on the context of the application and the specific configuration required.