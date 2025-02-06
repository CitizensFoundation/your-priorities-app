# YpLogin

The `YpLogin` class is a custom web component that provides a user interface for logging in, registering, and handling authentication through various methods such as email, Facebook, and SAML. It extends the `YpBaseElement` and utilizes the Lit library for rendering and property management.

## Properties

| Name                          | Type                                      | Description                                                                 |
|-------------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| `userSpinner`                 | `boolean`                                 | Indicates if the user spinner is active.                                    |
| `domain`                      | `YpDomainData \| undefined`               | The domain data associated with the login.                                  |
| `reCaptchaSiteKey`            | `string`                                  | The site key for reCAPTCHA integration.                                     |
| `emailErrorMessage`           | `string \| undefined`                     | Error message for email input validation.                                   |
| `passwordErrorMessage`        | `string \| undefined`                     | Error message for password input validation.                                |
| `name`                        | `string`                                  | The name of the user.                                                       |
| `email`                       | `string`                                  | The email address of the user.                                              |
| `password`                    | `string`                                  | The password of the user.                                                   |
| `submitText`                  | `string`                                  | The text displayed on the submit button.                                    |
| `redirectToURL`               | `string \| undefined`                     | URL to redirect to after successful login.                                  |
| `forgotPasswordOpen`          | `boolean`                                 | Indicates if the forgot password dialog is open.                            |
| `heading`                     | `string \| undefined`                     | The heading text for the login component.                                   |
| `createEnabled`               | `boolean`                                 | Indicates if user creation is enabled.                                      |
| `customUserRegistrationText`  | `string \| undefined`                     | Custom text for user registration.                                          |
| `opened`                      | `boolean`                                 | Indicates if the login dialog is open.                                      |
| `dialogMode`                  | `boolean`                                 | Indicates if the component is in dialog mode.                               |
| `target`                      | `any \| undefined`                        | The target element for certain operations.                                  |
| `forceSecureSamlLogin`        | `boolean`                                 | Indicates if secure SAML login is enforced.                                 |
| `directSamlIntegration`       | `boolean`                                 | Indicates if direct SAML integration is enabled.                            |
| `assistantMode`               | `boolean`                                 | Indicates if the component is in assistant mode.                            |
| `hasAnonymousLogin`           | `boolean`                                 | Indicates if anonymous login is available.                                  |
| `disableFacebookLoginForGroup`| `boolean`                                 | Indicates if Facebook login is disabled for the group.                      |
| `credentials`                 | `Record<string, unknown> \| undefined`    | The credentials used for login or registration.                             |
| `pollingStartedAt`            | `Date \| undefined`                       | The date when polling started.                                              |
| `signupTermsId`               | `number \| undefined`                     | The ID of the signup terms page.                                            |
| `samlLoginButtonUrl`          | `string \| undefined`                     | The URL for the SAML login button image.                                    |
| `customSamlLoginText`         | `string \| undefined`                     | Custom text for SAML login.                                                 |
| `oneTimeLoginName`            | `string \| undefined`                     | The name used for one-time login.                                           |
| `hasOneTimeLoginWithName`     | `boolean`                                 | Indicates if one-time login with name is available.                         |
| `fullWithLoginButton`         | `boolean`                                 | Indicates if the login button should be full width.                         |
| `alwaysShowCreateUser`        | `boolean`                                 | Indicates if the create user option should always be shown.                 |
| `registrationQuestionsGroup`  | `YpGroupData \| undefined`                | The group data for registration questions.                                  |
| `onLoginFunction`             | `Function \| undefined`                   | The function to call upon successful login.                                 |
| `isSending`                   | `boolean`                                 | Indicates if a request is currently being sent.                             |
| `reloadPageOnDialogClose`     | `boolean`                                 | Indicates if the page should reload when the dialog closes.                 |

## Methods

| Name                          | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| `_logingDialogClose`          | -                                                                          | `void`      | Closes the login dialog and reloads the page if necessary.                  |
| `renderSamlLogin`             | -                                                                          | `TemplateResult` | Renders the SAML login button.                                              |
| `renderAdditionalMethods`     | -                                                                          | `TemplateResult` | Renders additional authentication methods.                                  |
| `renderLoginButton`           | -                                                                          | `TemplateResult` | Renders the login button.                                                   |
| `renderLoginInput`            | -                                                                          | `TemplateResult` | Renders the login input fields.                                             |
| `renderSamlInfo`              | -                                                                          | `TemplateResult` | Renders information related to SAML login.                                  |
| `renderCustomUserRegistrationText` | -                                                                     | `TemplateResult` | Renders custom user registration text.                                      |
| `renderDomainImage`           | -                                                                          | `TemplateResult` | Renders the domain image.                                                   |
| `renderLanguage`              | -                                                                          | `TemplateResult` | Renders the language selector.                                              |
| `renderLoginSurface`          | -                                                                          | `TemplateResult` | Renders the login surface.                                                  |
| `renderCreateUserButton`      | -                                                                          | `TemplateResult` | Renders the create user button.                                             |
| `renderForgotPasswordButton`  | -                                                                          | `TemplateResult` | Renders the forgot password button.                                         |
| `renderLoginDialog`           | -                                                                          | `TemplateResult` | Renders the login dialog.                                                   |
| `renderCreateUserSurface`     | -                                                                          | `TemplateResult` | Renders the create user surface.                                            |
| `closeCreateUserDialog`       | -                                                                          | `void`      | Closes the create user dialog.                                              |
| `renderCreateUserDialog`      | -                                                                          | `TemplateResult` | Renders the create user dialog.                                             |
| `renderButtons`               | -                                                                          | `TemplateResult` | Renders the action buttons.                                                 |
| `closeAndReset`               | -                                                                          | `void`      | Closes and resets the component.                                            |
| `renderOneTimeDialog`         | -                                                                          | `TemplateResult` | Renders the one-time login dialog.                                          |
| `openCreateUser`              | -                                                                          | `void`      | Opens the create user dialog.                                               |
| `cancelRegistration`          | -                                                                          | `void`      | Cancels the registration process.                                           |
| `_setupJsonCredentials`       | `registerMode: boolean`                                                    | `void`      | Sets up JSON credentials for login or registration.                         |
| `_updateOneTimeLoginName`     | `event: KeyboardEvent`                                                     | `void`      | Updates the one-time login name based on user input.                        |
| `renderForgotPassword`        | -                                                                          | `TemplateResult` | Renders the forgot password component.                                      |
| `render`                      | -                                                                          | `TemplateResult` | Renders the component based on the current mode.                            |
| `_registrationQuestionsChanged` | -                                                                        | `void`      | Handles changes to registration questions.                                  |
| `_setupCustomRegistrationQuestions` | -                                                                    | `void`      | Sets up custom registration questions.                                      |
| `_keySaml`                    | `event: KeyboardEvent`                                                     | `void`      | Handles key events for SAML login.                                          |
| `updated`                     | `changedProperties: Map<string \| number \| symbol, unknown>`              | `void`      | Lifecycle method called when properties are updated.                        |
| `customTermsIntroText`        | -                                                                          | `string`    | Gets the custom terms introduction text.                                    |
| `userNameText`                | -                                                                          | `string`    | Gets the custom user name prompt text.                                      |
| `showSignupTerms`             | -                                                                          | `boolean`   | Determines if signup terms should be shown.                                 |
| `_isiOsInApp`                 | -                                                                          | `boolean`   | Checks if the app is running in an iOS in-app browser.                      |
| `_openTerms`                  | -                                                                          | `void`      | Opens the signup terms page.                                                |
| `_facebookLogin`              | -                                                                          | `void`      | Initiates Facebook login.                                                   |
| `oneTimeLogin`                | -                                                                          | `void`      | Initiates one-time login.                                                   |
| `finishOneTimeLoginWithName`  | -                                                                          | `void`      | Completes the one-time login process.                                       |
| `anonymousLogin`              | `loginSubType: string, registrationAnswers: Record<string, string>[] \| undefined` | `Promise<boolean>` | Performs anonymous login.                                                   |
| `_isInApp`                    | -                                                                          | `boolean`   | Checks if the app is running in an in-app browser.                          |
| `_openSamlLogin`              | -                                                                          | `void`      | Opens the SAML login window.                                                |
| `firstUpdated`                | -                                                                          | `void`      | Lifecycle method called after the first update.                             |
| `_startSpinner`               | -                                                                          | `void`      | Starts the user spinner.                                                    |
| `_cancel`                     | -                                                                          | `void`      | Cancels the login process.                                                  |
| `_domainEvent`                | `event: CustomEvent`                                                       | `void`      | Handles domain change events.                                               |
| `hasAdditionalAuthMethods`    | -                                                                          | `boolean`   | Checks if additional authentication methods are available.                  |
| `hasFacebookLogin`            | -                                                                          | `boolean`   | Checks if Facebook login is available.                                      |
| `hasGoogleLogin`              | -                                                                          | `boolean`   | Checks if Google login is available.                                        |
| `hasSamlLogin`                | -                                                                          | `boolean`   | Checks if SAML login is available.                                          |
| `_openedChanged`              | -                                                                          | `void`      | Handles changes to the `opened` property.                                   |
| `onEnterLogin`                | `event: KeyboardEvent`                                                     | `void`      | Handles the Enter key event for login.                                      |
| `onEnterRegistration`         | `event: KeyboardEvent`                                                     | `void`      | Handles the Enter key event for registration.                               |
| `onEnterOneTimeLogin`         | `event: KeyboardEvent`                                                     | `void`      | Handles the Enter key event for one-time login.                             |
| `_networkError`               | `event: CustomEvent`                                                       | `void`      | Handles network error events.                                               |
| `_forgotPassword`             | -                                                                          | `void`      | Opens the forgot password dialog.                                           |
| `connectedCallback`           | -                                                                          | `void`      | Lifecycle method called when the component is added to the document.        |
| `disconnectedCallback`        | -                                                                          | `void`      | Lifecycle method called when the component is removed from the document.    |
| `logout`                      | -                                                                          | `void`      | Logs out the current user.                                                  |
| `setupCreateOptions`          | -                                                                          | `void`      | Sets up options for creating a user.                                        |
| `setup`                       | `onLoginFunction: Function, domain: YpDomainData`                          | `void`      | Sets up the component with a login function and domain data.                |
| `_setTexts`                   | -                                                                          | `void`      | Sets the text for various UI elements.                                      |
| `emailValue`                  | `registerMode: boolean \| undefined`                                       | `string`    | Gets the email value based on the mode.                                     |
| `passwordValue`               | `registerMode: boolean \| undefined`                                       | `string`    | Gets the password value based on the mode.                                  |
| `fullnameValue`               | -                                                                          | `string \| void` | Gets the full name value.                                                  |
| `_registerUser`               | -                                                                          | `Promise<void>` | Registers a new user.                                                      |
| `_loginUser`                  | -                                                                          | `Promise<void>` | Logs in an existing user.                                                  |
| `_validateAndSend`            | `registerMode: boolean`                                                    | `boolean`   | Validates the form and sends the login or registration request.             |
| `_loginAfterSavePassword`     | `user: YpUserData`                                                         | `void`      | Handles login after saving the password.                                    |
| `_loginCompleted`             | `user: YpUserData`                                                         | `void`      | Completes the login process.                                                |
| `openDialog`                  | `redirectToURL: string \| undefined, email: string \| undefined, collectionConfiguration: YpCollectionConfiguration \| undefined` | `Promise<void>` | Opens the login dialog.                                                    |
| `close`                       | -                                                                          | `void`      | Closes the login dialog.                                                    |

## Examples

```typescript
// Example usage of the YpLogin component
import { YpLogin } from './yp-login.js';

const loginComponent = document.createElement('yp-login');
document.body.appendChild(loginComponent);

loginComponent.setup((user) => {
  console.log('User logged in:', user);
}, domainData);

loginComponent.openDialog('https://example.com/redirect', 'user@example.com', collectionConfig);
```