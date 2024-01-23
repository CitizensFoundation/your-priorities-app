# YpLogin

The `YpLogin` class is a web component that provides a user interface for login and registration functionality. It is part of a larger application and interacts with various other components and services to authenticate users.

## Properties

| Name                           | Type                        | Description                                                                 |
|--------------------------------|-----------------------------|-----------------------------------------------------------------------------|
| userSpinner                    | Boolean                     | Indicates if a spinner should be shown to represent a loading state.        |
| domain                         | YpDomainData \| undefined   | Domain data for the current context.                                        |
| reCaptchaSiteKey               | String                      | Site key for Google reCAPTCHA integration.                                  |
| emailErrorMessage              | string \| undefined         | Error message for email validation.                                         |
| passwordErrorMessage           | string \| undefined         | Error message for password validation.                                      |
| name                           | String                      | Name of the user.                                                           |
| email                          | String                      | Email address of the user.                                                  |
| password                       | String                      | Password of the user.                                                       |
| submitText                     | String                      | Text for the submit button.                                                 |
| redirectToURL                  | string \| undefined         | URL to redirect to after successful login.                                  |
| forgotPasswordOpen             | Boolean                     | Indicates if the forgot password dialog is open.                            |
| heading                        | string \| undefined         | Heading text for the login dialog.                                          |
| customUserRegistrationText     | string \| undefined         | Custom text to display during user registration.                            |
| opened                         | Boolean                     | Indicates if the login dialog is open.                                      |
| target                         | any \| undefined            | Target element for certain actions.                                         |
| forceSecureSamlLogin           | Boolean                     | Forces a secure SAML login if true.                                         |
| hasAnonymousLogin              | Boolean                     | Indicates if anonymous login is allowed.                                    |
| disableFacebookLoginForGroup   | Boolean                     | Disables Facebook login for the current group if true.                      |
| credentials                    | Record<string, unknown> \| undefined | Credentials object for login or registration.                           |
| pollingStartedAt               | Date \| undefined           | Timestamp indicating when polling for login started.                        |
| signupTermsId                  | number \| undefined         | ID of the signup terms page.                                                |
| samlLoginButtonUrl             | string \| undefined         | URL for the SAML login button image.                                        |
| customSamlLoginText            | string \| undefined         | Custom text to display for SAML login.                                      |
| oneTimeLoginName               | string \| undefined         | Name for one-time login.                                                    |
| hasOneTimeLoginWithName        | Boolean                     | Indicates if one-time login with name is allowed.                           |
| registrationQuestionsGroup     | YpGroupData \| undefined    | Group data for registration questions.                                      |
| onLoginFunction                | Function \| undefined       | Callback function to execute after successful login.                        |
| isSending                      | Boolean                     | Indicates if a login or registration request is currently being sent.       |
| reloadPageOnDialogClose        | Boolean                     | Indicates if the page should be reloaded when the dialog is closed.         |

## Methods

| Name                     | Parameters        | Return Type | Description                                                                 |
|--------------------------|-------------------|-------------|-----------------------------------------------------------------------------|
| _logingDialogClose       |                   | void        | Handles the closing of the login dialog and optionally reloads the page.    |
| renderSamlLogin          |                   | TemplateResult | Renders the SAML login button.                                           |
| renderAdditionalMethods  |                   | TemplateResult | Renders additional authentication methods.                                |
| renderLogin              |                   | TemplateResult | Renders the login dialog.                                                 |
| renderCreateUser         |                   | TemplateResult | Renders the create user dialog.                                           |
| renderButtons            |                   | TemplateResult | Renders the action buttons for the dialog.                                |
| closeAndReset            |                   | void        | Closes the dialog and resets any state.                                    |
| renderOneTimeDialog      |                   | TemplateResult | Renders the one-time login dialog.                                       |
| openCreateUser           |                   | void        | Opens the create user dialog.                                              |
| cancelRegistration       |                   | void        | Cancels the registration process and returns to the login dialog.           |
| _setupJsonCredentials    | registerMode: boolean | void        | Sets up the credentials object for login or registration.                  |
| _updateOneTimeLoginName  | event: KeyboardEvent | void        | Updates the one-time login name based on user input.                       |
| renderForgotPassword     |                   | TemplateResult | Renders the forgot password dialog.                                       |
| override render          |                   | TemplateResult | Renders the component.                                                    |
| _registrationQuestionsChanged |               | void        | Handles changes to the registration questions.                             |
| _setupCustomRegistrationQuestions |           | void        | Sets up custom registration questions if available.                        |
| _keySaml                 | event: KeyboardEvent | void        | Handles key events for SAML login.                                        |
| override updated         | changedProperties: Map<string \| number \| symbol, unknown> | void | Handles updates to the component's properties. |
| _isiOsInApp              |                   | boolean     | Determines if the current environment is an iOS in-app browser.            |
| _openTerms               |                   | void        | Opens the terms and conditions page.                                       |
| _facebookLogin           |                   | void        | Initiates Facebook login.                                                  |
| oneTimeLogin             |                   | void        | Initiates one-time login.                                                  |
| finishOneTimeLoginWithName |                   | void        | Completes the one-time login with name process.                            |
| anonymousLogin           | loginSubType?: string, registrationAnswers?: Record<string, string>[] | Promise<void> | Initiates anonymous login. |
| _isInApp                 |                   | boolean     | Determines if the current environment is an in-app browser.                |
| _openSamlLogin           |                   | void        | Initiates SAML login.                                                      |
| override firstUpdated    |                   | void        | Lifecycle callback for when the component is first updated.                |
| _startSpinner            |                   | void        | Starts the spinner to indicate a loading state.                            |
| _cancel                  |                   | void        | Cancels the current operation and stops the spinner.                       |
| _domainEvent             | event: CustomEvent | void        | Handles domain-related events.                                             |
| _networkError            | event: CustomEvent | void        | Handles network errors.                                                    |
| _forgotPassword          |                   | void        | Opens the forgot password dialog.                                          |
| override connectedCallback |                   | void        | Lifecycle callback for when the component is connected to the DOM.         |
| override disconnectedCallback |                   | void        | Lifecycle callback for when the component is disconnected from the DOM.    |
| setup                    | onLoginFunction: Function, domain: YpDomainData | void | Sets up the component with a login function and domain data.               |
| _setTexts                |                   | void        | Sets up the text properties for the component.                             |
| emailValue               | registerMode?: boolean | string \| void | Returns the email value based on the mode.                               |
| passwordValue            | registerMode?: boolean | string \| void | Returns the password value based on the mode.                             |
| get fullnameValue        |                   | string \| void | Returns the full name value.                                              |
| _registerUser            |                   | Promise<void> | Registers a new user with the provided credentials.                       |
| _loginUser               |                   | Promise<void> | Logs in a user with the provided credentials.                             |
| _validateAndSend         | registerMode: boolean | boolean | Validates the input and sends the login or registration request.           |
| _loginAfterSavePassword  | user: YpUserData  | void        | Handles actions after saving the password.                                 |
| _loginCompleted          | user: YpUserData  | void        | Completes the login process.                                               |
| open                     | redirectToURL: string \| undefined, email: string \| undefined, collectionConfiguration: YpCollectionConfiguration \| undefined | Promise<void> | Opens the login dialog with optional redirect URL and email.               |
| close                    |                   | void        | Closes the login dialog.                                                   |

## Events

- **eventName**: Description of when and why the event is emitted.

## Examples

```typescript
// Example usage of the YpLogin component
const loginComponent = document.createElement('yp-login');
loginComponent.setup(() => console.log('Logged in!'), domainData);
document.body.appendChild(loginComponent);
loginComponent.open('/redirect-url', 'user@example.com', collectionConfig);
```

Note: The actual implementation of the `YpLogin` class may include additional methods, properties, and events not listed here, as this is a summary of the key components. The class also relies on external services and components, such as `YpBaseElement`, `YpNavHelpers`, `YpRegistrationQuestions`, and various Material Web components.