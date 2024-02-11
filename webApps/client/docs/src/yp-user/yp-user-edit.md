# YpUserEdit

YpUserEdit is a custom element that provides a user interface for editing user details. It extends from YpEditBase and includes various fields and options for updating user information, such as name, email, profile image, and notification settings.

## Properties

| Name                              | Type                                  | Description                                                                 |
|-----------------------------------|---------------------------------------|-----------------------------------------------------------------------------|
| action                            | String                                | The API endpoint to which the form data will be submitted.                  |
| user                              | YpUserData \| undefined               | The user data object that is being edited.                                  |
| selected                          | Number                                | The index of the currently selected tab in the edit dialog.                 |
| encodedUserNotificationSettings   | String \| undefined                   | A JSON-encoded string of the user's notification settings.                  |
| currentApiKey                     | String \| undefined                   | The current API key for the user, if available.                             |
| uploadedProfileImageId            | Number \| undefined                   | The ID of the uploaded profile image.                                       |
| uploadedHeaderImageId             | Number \| undefined                   | The ID of the uploaded header image.                                        |
| notificationSettings              | AcNotificationSettingsData \| undefined | The user's notification settings object.                                    |

## Methods

| Name                        | Parameters | Return Type | Description                                                                 |
|-----------------------------|------------|-------------|-----------------------------------------------------------------------------|
| updated                     | changedProperties: Map<string \| number \| symbol, unknown> | void        | Called when the element's properties change. Handles user and notification settings changes. |
| render                      |            | TemplateResult \| typeof nothing | Renders the HTML template for the user edit dialog.                         |
| connectedCallback           |            | void        | Lifecycle method called when the element is added to the document's DOM.    |
| disconnectedCallback        |            | void        | Lifecycle method called when the element is removed from the document's DOM.|
| _editResponse               | event: CustomEvent | void        | Handles the response after editing the user.                                |
| _checkIfValidEmail          |            | Boolean     | Checks if the user's email is valid.                                        |
| _disconnectFromFacebookLogin|            | void        | Initiates the process to disconnect the user from Facebook login.           |
| _reallyDisconnectFromFacebookLogin |    | Promise<void> | Actually disconnects the user from Facebook login.                          |
| _disconnectFromSamlLogin    |            | void        | Initiates the process to disconnect the user from SAML login.               |
| _reallyDisconnectFromSamlLogin |        | Promise<void> | Actually disconnects the user from SAML login.                              |
| _setNotificationSettings    | event: CustomEvent | void        | Sets the notification settings based on an event.                           |
| _notificationSettingsChanged|            | void        | Called when the notification settings property changes.                     |
| _encodeNotificationsSettings| settings: AcNotificationSettingsData \| undefined | String \| undefined | Encodes the notification settings into a JSON string.                       |
| _userChanged                |            | void        | Called when the user property changes.                                      |
| _profileImageUploaded       | event: CustomEvent | void        | Handles the event when a profile image is uploaded.                         |
| _headerImageUploaded        | event: CustomEvent | void        | Handles the event when a header image is uploaded.                          |
| customRedirect              |            | void        | Redirects the user after certain actions.                                   |
| clear                       |            | void        | Clears the form fields and resets the user edit dialog.                     |
| _copyApiKey                 |            | void        | Copies the current API key to the clipboard.                                |
| _createApiKey               |            | Promise<void> | Creates a new API key for the user.                                         |
| _reCreateApiKey             |            | void        | Initiates the process to recreate the user's API key.                       |
| setup                       | user: YpUserData, newNotEdit: boolean, refreshFunction: Function \| undefined, openNotificationTab: boolean | void        | Sets up the user edit dialog with the provided user data and options.       |
| setupTranslation            |            | void        | Sets up the translation for the dialog based on whether it's a new user or editing an existing user. |
| _deleteOrAnonymizeUser      |            | void        | Opens the dialog to delete or anonymize the user.                           |

## Events (if any)

- **yp-notifications-changed**: Emitted when the user's notification settings change.
- **yp-error**: Emitted when an error occurs, such as trying to disconnect from Facebook without a valid email.

## Examples

```typescript
// Example usage of the YpUserEdit component
const userEditElement = document.createElement('yp-user-edit');
userEditElement.user = {
  name: "John Doe",
  email: "john.doe@example.com",
  notifications_settings: {
    emailNotifications: true,
    pushNotifications: false
  }
};
userEditElement.action = "/users";
document.body.appendChild(userEditElement);
```

Note: The above example assumes that the custom elements `yp-user-edit` and related dependencies are already defined and registered in the custom elements registry.