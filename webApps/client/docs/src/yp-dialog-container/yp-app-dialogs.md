# YpAppDialogs

The `YpAppDialogs` class is a custom web component that extends `YpBaseElement`. It manages various dialog components within an application, providing methods to open, close, and render different dialogs based on user interactions and application state.

## Properties

| Name                        | Type      | Description                                                                 |
|-----------------------------|-----------|-----------------------------------------------------------------------------|
| selectedDialog              | string \| undefined | The currently selected dialog to be rendered.                                |
| confirmationDialogOpen      | boolean   | Indicates if the confirmation dialog is open.                                |
| pageDialogOpen              | boolean   | Indicates if the page dialog is open.                                        |
| magicTextDialogOpen         | boolean   | Indicates if the magic text dialog is open.                                  |
| mediaRecorderOpen           | boolean   | Indicates if the media recorder dialog is open.                              |
| loadingDialogOpen           | boolean   | Indicates if the loading dialog is open.                                     |
| needsPixelCookieConfirm     | boolean   | Indicates if the pixel cookie confirmation is needed.                        |
| apiActionDialogOpen         | boolean   | Indicates if the API action dialog is open.                                  |
| registrationQuestionsOpen   | boolean   | Indicates if the registration questions dialog is open.                      |
| autoTranslateDialogOpen     | boolean   | Indicates if the auto-translate dialog is open.                              |
| hasLoggedInUser             | boolean   | Indicates if there is a logged-in user.                                      |
| haveLoadedDelayed           | boolean   | Indicates if the delayed dialog container has been loaded.                   |
| gotRatingsDialog            | boolean   | Indicates if the ratings dialog has been loaded.                             |
| gotMediaRecorder            | boolean   | Indicates if the media recorder has been loaded.                             |
| loadingStartedLoggedIn      | boolean   | Indicates if loading has started for logged-in users.                        |
| haveLoadedDataViz           | boolean   | Indicates if the data visualization dialog container has been loaded.        |
| waitForUpgradeCounter       | number    | Counter for waiting for element upgrade.                                     |
| facebookPixelTrackingId     | string \| undefined | The Facebook Pixel tracking ID.                                              |

## Methods

| Name                          | Parameters                          | Return Type | Description                                                                 |
|-------------------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| renderSelectedDialog          | -                                   | TemplateResult<any> \| {} | Renders the currently selected dialog based on `selectedDialog`.            |
| connectedCallback             | -                                   | void        | Lifecycle method called when the element is added to the document.          |
| openPixelCookieConfirm        | facebookPixelTrackingId: string     | Promise<void> | Opens the pixel cookie confirmation dialog.                                 |
| _disableFaceookPixelTracking  | -                                   | void        | Disables Facebook Pixel tracking and closes the confirmation dialog.        |
| _agreeToFacebookPixelTracking | -                                   | void        | Agrees to Facebook Pixel tracking and closes the confirmation dialog.       |
| _loggedInUser                 | event: CustomEvent                  | void        | Handles the event when a user logs in, loading necessary resources.         |
| closeDialog                   | idName: string                      | void        | Closes the dialog with the specified ID.                                    |
| dialogClosed                  | event: CustomEvent                  | void        | Handles the event when a dialog is closed, updating the selected dialog.    |
| _closeActionDialog            | -                                   | void        | Closes the API action dialog.                                               |
| _closeRegistrationQuestionsDialog | -                               | void        | Closes the registration questions dialog.                                   |
| loadDataViz                   | -                                   | void        | Loads the data visualization dialog container if not already loaded.        |
| openLoadingDialog             | -                                   | Promise<void> | Opens the loading dialog.                                                   |
| closeLoadingDialog            | -                                   | Promise<void> | Closes the loading dialog.                                                  |
| getRatingsDialogAsync         | callback: Function                  | void        | Asynchronously loads and opens the ratings dialog.                          |
| getMediaRecorderAsync         | callback: Function                  | void        | Asynchronously loads and opens the media recorder dialog.                   |
| getDialogAsync                | idName: string, callback: Function  | Promise<void> | Asynchronously loads and opens a dialog by ID, executing a callback.        |
| _forgotPassword               | -                                   | void        | Opens the forgot password dialog.                                           |

## Examples

```typescript
// Example usage of the YpAppDialogs component
const appDialogs = document.createElement('yp-app-dialogs') as YpAppDialogs;
document.body.appendChild(appDialogs);

// Open a specific dialog
appDialogs.selectedDialog = 'userLogin';

// Close a dialog by ID
appDialogs.closeDialog('userLogin');
```