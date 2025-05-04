# YpLogin

A comprehensive login and registration web component for user authentication, supporting email/password, SAML, Facebook, anonymous, and one-time login methods. It provides dialogs for login, registration, and password reset, and supports custom registration questions, terms, and domain-specific configuration.

## Properties

| Name                          | Type                                         | Description                                                                                 |
|-------------------------------|----------------------------------------------|---------------------------------------------------------------------------------------------|
| userSpinner                   | boolean                                      | Indicates if the user spinner (loading indicator) is active.                                |
| domain                        | YpDomainData \| undefined                    | The current domain configuration object.                                                    |
| reCaptchaSiteKey              | string                                       | The reCAPTCHA site key for bot protection.                                                  |
| emailErrorMessage             | string \| undefined                          | Error message for the email field.                                                          |
| passwordErrorMessage          | string \| undefined                          | Error message for the password field.                                                       |
| name                          | string                                       | The user's name (for registration).                                                         |
| email                         | string                                       | The user's email address.                                                                   |
| password                      | string                                       | The user's password.                                                                        |
| submitText                    | string                                       | The text for the submit/login button.                                                       |
| redirectToURL                 | string \| undefined                          | URL to redirect to after successful login.                                                  |
| forgotPasswordOpen            | boolean                                      | Whether the forgot password dialog is open.                                                 |
| heading                       | string \| undefined                          | Optional heading for the login dialog.                                                      |
| createEnabled                 | boolean                                      | Whether user registration is enabled.                                                       |
| customUserRegistrationText    | string \| undefined                          | Custom text to display for user registration.                                               |
| opened                        | boolean                                      | Whether the login dialog is open.                                                           |
| dialogMode                    | boolean                                      | Whether the component is in dialog mode.                                                    |
| target                        | any \| undefined                             | Optional target for dialog actions.                                                         |
| forceSecureSamlLogin          | boolean                                      | Whether SAML login is enforced.                                                             |
| directSamlIntegration         | boolean                                      | Whether direct SAML integration is enabled.                                                 |
| assistantMode                 | boolean                                      | Whether the component is in assistant mode.                                                 |
| hasAnonymousLogin             | boolean                                      | Whether anonymous login is available.                                                       |
| disableFacebookLoginForGroup  | boolean                                      | Whether Facebook login is disabled for the current group.                                   |
| credentials                   | Record<string, unknown> \| undefined         | The credentials object for login/registration.                                              |
| pollingStartedAt              | Date \| undefined                            | Timestamp when polling for login started.                                                   |
| signupTermsId                 | number \| undefined                          | ID of the signup terms page.                                                                |
| samlLoginButtonUrl            | string \| undefined                          | URL for the SAML login button image.                                                        |
| customSamlLoginText           | string \| undefined                          | Custom text for SAML login.                                                                 |
| oneTimeLoginName              | string \| undefined                          | Name for one-time login.                                                                    |
| hasOneTimeLoginWithName       | boolean                                      | Whether one-time login with name is enabled.                                                |
| fullWithLoginButton           | boolean                                      | Whether the login button should be full width.                                              |
| alwaysShowCreateUser          | boolean                                      | Whether to always show the create user option.                                              |
| registrationQuestionsGroup    | YpGroupData \| undefined                     | Group data for custom registration questions.                                               |
| onLoginFunction               | Function \| undefined                        | Optional callback function to call after login.                                             |
| isSending                     | boolean                                      | Whether a login or registration request is in progress.                                     |
| reloadPageOnDialogClose       | boolean                                      | Whether to reload the page when the login dialog closes.                                    |

## Methods

| Name                              | Parameters                                                                                                   | Return Type         | Description                                                                                                 |
|----------------------------------- |-------------------------------------------------------------------------------------------------------------|---------------------|-------------------------------------------------------------------------------------------------------------|
| renderSamlLogin                   | none                                                                                                        | unknown             | Renders the SAML login button or image.                                                                     |
| renderAdditionalMethods            | none                                                                                                        | unknown             | Renders additional authentication methods (Facebook, SAML, anonymous, one-time).                            |
| renderLoginButton                  | none                                                                                                        | unknown             | Renders the login button.                                                                                   |
| renderLoginInput                   | none                                                                                                        | unknown             | Renders the email and password input fields.                                                                |
| renderSamlInfo                     | none                                                                                                        | unknown             | Renders SAML login information or custom text.                                                              |
| renderCustomUserRegistrationText   | none                                                                                                        | unknown             | Renders custom user registration text if provided.                                                          |
| renderDomainImage                  | none                                                                                                        | unknown             | Renders the domain image if available.                                                                      |
| renderLanguage                     | none                                                                                                        | unknown             | Renders the language selector.                                                                              |
| renderLoginSurface                 | none                                                                                                        | unknown             | Renders the main login surface (inputs, buttons, etc.).                                                     |
| renderCreateUserButton             | none                                                                                                        | unknown             | Renders the create user button.                                                                             |
| renderForgotPasswordButton         | none                                                                                                        | unknown             | Renders the forgot password button.                                                                         |
| renderLoginDialog                  | none                                                                                                        | unknown             | Renders the login dialog.                                                                                   |
| renderCreateUserSurface            | none                                                                                                        | unknown             | Renders the registration (create user) surface.                                                             |
| closeCreateUserDialog              | none                                                                                                        | void                | Closes the create user dialog.                                                                              |
| renderCreateUserDialog             | none                                                                                                        | unknown             | Renders the create user dialog.                                                                             |
| renderButtons                      | none                                                                                                        | unknown             | Renders the action buttons (login, cancel, etc.).                                                           |
| closeAndReset                      | none                                                                                                        | void                | Closes the login dialog and resets state.                                                                   |
| renderOneTimeDialog                | none                                                                                                        | unknown             | Renders the one-time login dialog.                                                                          |
| openCreateUser                     | none                                                                                                        | void                | Opens the create user dialog and closes the login dialog.                                                   |
| cancelRegistration                 | none                                                                                                        | void                | Cancels registration and returns to the login dialog.                                                       |
| _setupJsonCredentials              | registerMode: boolean                                                                                       | void                | Sets up the credentials object for login or registration.                                                   |
| _updateOneTimeLoginName            | event: KeyboardEvent                                                                                        | void                | Updates the one-time login name from the input field.                                                       |
| renderForgotPassword               | none                                                                                                        | unknown             | Renders the forgot password dialog component.                                                               |
| render                            | none                                                                                                        | unknown             | Main render method for the component.                                                                       |
| _registrationQuestionsChanged      | none                                                                                                        | void                | Handles changes to registration questions.                                                                  |
| _setupCustomRegistrationQuestions  | none                                                                                                        | void                | Sets up custom registration questions from global config.                                                   |
| _keySaml                           | event: KeyboardEvent                                                                                        | void                | Handles keyboard events for SAML login.                                                                     |
| updated                            | changedProperties: Map<string \| number \| symbol, unknown>                                                 | void                | Lit lifecycle method, handles property updates.                                                             |
| customTermsIntroText (getter)      | none                                                                                                        | string              | Gets the custom terms intro text from group config or default.                                              |
| userNameText (getter)              | none                                                                                                        | string              | Gets the custom user name prompt from group config or default.                                              |
| showSignupTerms (getter)           | none                                                                                                        | number \| undefined | Returns the signup terms ID if available.                                                                   |
| _isiOsInApp                        | none                                                                                                        | boolean             | Detects if running inside an iOS/Android in-app browser.                                                    |
| _openTerms                         | none                                                                                                        | void                | Fires an event to open the signup terms page.                                                               |
| _facebookLogin                     | none                                                                                                        | void                | Initiates Facebook login flow.                                                                              |
| oneTimeLogin                       | none                                                                                                        | void                | Opens the one-time login dialog.                                                                            |
| finishOneTimeLoginWithName         | none                                                                                                        | void                | Completes the one-time login with name and registration answers.                                            |
| anonymousLogin                     | loginSubType?: string, registrationAnswers?: Record<string, string>[] \| undefined                          | Promise<boolean>    | Performs anonymous login (optionally with registration answers).                                            |
| _isInApp                           | none                                                                                                        | boolean             | Detects if running inside an in-app browser.                                                                |
| _openSamlLogin                     | none                                                                                                        | void                | Initiates SAML login flow.                                                                                  |
| firstUpdated                       | none                                                                                                        | void                | Lit lifecycle method, called after first render.                                                            |
| _startSpinner                      | none                                                                                                        | void                | Starts the user spinner/loading indicator.                                                                  |
| _cancel                            | none                                                                                                        | void                | Cancels login polling and shows spinner.                                                                    |
| _domainEvent                       | event: CustomEvent                                                                                          | void                | Handles domain change events.                                                                               |
| hasAdditionalAuthMethods (getter)  | none                                                                                                        | boolean             | Returns true if additional auth methods (Facebook, SAML, anonymous, one-time) are available.                |
| hasFacebookLogin (getter)          | none                                                                                                        | boolean             | Returns true if Facebook login is available for the domain.                                                 |
| hasGoogleLogin (getter)            | none                                                                                                        | boolean             | Returns true if Google login is available for the domain (currently always false).                          |
| hasSamlLogin (getter)              | none                                                                                                        | boolean             | Returns true if SAML login is available for the domain.                                                     |
| _openedChanged                     | none                                                                                                        | void                | Handles changes when the login dialog is opened.                                                            |
| onEnterLogin                       | event: KeyboardEvent                                                                                        | void                | Handles Enter key for login input.                                                                          |
| onEnterRegistration                | event: KeyboardEvent                                                                                        | void                | Handles Enter key for registration input.                                                                   |
| onEnterOneTimeLogin                | event: KeyboardEvent                                                                                        | void                | Handles Enter key for one-time login input.                                                                 |
| _networkError                      | event: CustomEvent                                                                                          | void                | Handles network error events for login/registration.                                                        |
| _forgotPassword                    | none                                                                                                        | void                | Opens the forgot password dialog.                                                                           |
| connectedCallback                  | none                                                                                                        | void                | Lit lifecycle method, sets up listeners and initializes state.                                              |
| disconnectedCallback               | none                                                                                                        | void                | Lit lifecycle method, removes listeners.                                                                    |
| logout                             | none                                                                                                        | void                | Logs out the current user.                                                                                  |
| setupCreateOptions                  | none                                                                                                        | void                | Sets up whether user creation is enabled based on config and query params.                                  |
| setup                              | onLoginFunction: Function, domain: YpDomainData                                                             | void                | Sets up the login component with a callback and domain.                                                     |
| _setTexts                          | none                                                                                                        | void                | Sets up error and button texts from translations.                                                           |
| emailValue                         | registerMode?: boolean \| undefined                                                                         | string              | Gets the email value from the appropriate input field.                                                      |
| passwordValue                      | registerMode?: boolean \| undefined                                                                         | string              | Gets the password value from the appropriate input field.                                                   |
| fullnameValue (getter)             | none                                                                                                        | string \| void      | Gets the full name value from the input field.                                                              |
| _registerUser                      | none                                                                                                        | Promise<void>       | Registers a new user with the current credentials.                                                          |
| _loginUser                         | none                                                                                                        | Promise<void>       | Logs in a user with the current credentials.                                                                |
| _validateAndSend                   | registerMode: boolean                                                                                       | boolean             | Validates the form and sends login or registration request.                                                 |
| _loginAfterSavePassword            | user: YpUserData                                                                                            | void                | Handles login after saving password credentials (if supported).                                             |
| _loginCompleted                    | user: YpUserData                                                                                            | void                | Handles post-login actions and fires global events.                                                         |
| openDialog                         | redirectToURL: string \| undefined, email: string \| undefined, collectionConfiguration: YpCollectionConfiguration \| undefined | Promise<void>       | Opens the login dialog, optionally pre-filling email and setting up config.                                 |
| close                              | none                                                                                                        | void                | Closes the login dialog and resets state.                                                                   |

## Events

- **yp-dialog-closed**: Emitted when the create user dialog is closed.
- **yp-open-page**: Emitted when the signup terms page should be opened.
- **yp-error**: Emitted when there is an error during login or registration.
- **yp-logged-in**: Emitted when a user has successfully logged in.
- **yp-dialog-opened**: Emitted when a dialog is opened.

## Examples

```typescript
import "./yp-login.js";

// Open the login dialog with optional redirect and email
const ypLogin = document.createElement("yp-login") as YpLogin;
document.body.appendChild(ypLogin);

ypLogin.openDialog(
  "/dashboard", // redirectToURL
  "user@example.com", // email
  undefined // collectionConfiguration
);

// Listen for login event
ypLogin.addEventListener("yp-logged-in", (event) => {
  const user = event.detail;
  console.log("User logged in:", user);
});
```
