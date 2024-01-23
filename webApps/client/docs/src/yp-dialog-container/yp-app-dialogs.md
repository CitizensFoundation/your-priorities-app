# YpAppDialogs

This class is responsible for managing various dialogs within an application, such as login, password reset, and confirmation dialogs. It extends `YpBaseElement`, which is a custom base class for elements in the application.

## Properties

| Name                      | Type      | Description                                                  |
|---------------------------|-----------|--------------------------------------------------------------|
| selectedDialog            | string    | The identifier of the currently selected dialog.             |
| confirmationDialogOpen    | boolean   | Indicates if the confirmation dialog is open.                |
| pageDialogOpen            | boolean   | Indicates if the page dialog is open.                        |
| magicTextDialogOpen       | boolean   | Indicates if the magic text dialog is open.                  |
| mediaRecorderOpen         | boolean   | Indicates if the media recorder dialog is open.              |
| loadingDialogOpen         | boolean   | Indicates if the loading dialog is open.                     |
| needsPixelCookieConfirm   | boolean   | Indicates if the pixel cookie confirmation is needed.        |
| apiActionDialogOpen       | boolean   | Indicates if the API action dialog is open.                  |
| registrationQuestionsOpen | boolean   | Indicates if the registration questions dialog is open.      |
| autoTranslateDialogOpen   | boolean   | Indicates if the auto-translate dialog is open.              |
| hasLoggedInUser           | boolean   | Indicates if there is a logged-in user.                      |
| facebookPixelTrackingId   | string    | The Facebook Pixel tracking ID, if applicable.               |

## Methods

| Name                     | Parameters                        | Return Type | Description                                                                 |
|--------------------------|-----------------------------------|-------------|-----------------------------------------------------------------------------|
| renderSelectedDialog     |                                   | TemplateResult \| {} | Renders the currently selected dialog based on `selectedDialog`.            |
| override render          |                                   | TemplateResult       | Renders the dialogs and associated elements.                                |
| constructor              |                                   | void        | Initializes the component and sets up global event listeners.               |
| override connectedCallback |                               | void        | Performs actions when the component is added to the DOM.                    |
| openPixelCookieConfirm   | facebookPixelTrackingId: string  | Promise<void> | Opens the pixel cookie confirmation dialog.                                 |
| _disableFaceookPixelTracking |                             | void        | Disables Facebook Pixel tracking.                                           |
| _agreeToFacebookPixelTracking |                             | void        | Agrees to Facebook Pixel tracking.                                         |
| _loggedInUser            | event: CustomEvent               | void        | Handles the event when a user logs in.                                      |
| closeDialog              | idName: string                   | void        | Closes the dialog with the given ID.                                        |
| dialogClosed             | event: CustomEvent               | void        | Handles the event when a dialog is closed.                                  |
| _closeActionDialog       |                                   | void        | Closes the API action dialog.                                               |
| _closeRegistrationQuestionsDialog |                         | void        | Closes the registration questions dialog.                                   |
| loadDataViz              |                                   | void        | Loads the data visualization components.                                    |
| openLoadingDialog        |                                   | Promise<void> | Opens the loading dialog.                                                   |
| closeLoadingDialog       |                                   | Promise<void> | Closes the loading dialog.                                                  |
| getRatingsDialogAsync    | callback: Function               | void        | Asynchronously retrieves the ratings dialog.                                |
| getMediaRecorderAsync    | callback: Function               | void        | Asynchronously retrieves the media recorder dialog.                         |
| getDialogAsync           | idName: string, callback: Function | void        | Asynchronously retrieves a dialog by ID and executes a callback.            |
| _forgotPassword          |                                   | void        | Opens the forgot password dialog.                                           |

## Events (if any)

- **yp-logged-in-user**: Emitted when a user logs in.

## Examples

```typescript
// Example usage to open a dialog
const appDialogs = document.createElement('yp-app-dialogs');
appDialogs.getDialogAsync('userLogin', (dialog) => {
  dialog.open = true;
});
```

```typescript
// Example usage to close a dialog
const appDialogs = document.createElement('yp-app-dialogs');
appDialogs.closeDialog('userLogin');
```

```typescript
// Example usage to handle a logged-in user event
const appDialogs = document.createElement('yp-app-dialogs');
appDialogs.addEventListener('yp-logged-in-user', (event) => {
  console.log('User logged in:', event.detail);
});
```

Please note that the actual import and usage of the dialogs would depend on the specific application's structure and the dialogs' implementations.