# YpUserEdit

`YpUserEdit` is a custom element that extends `YpEditBase` and provides a user interface for editing user details. It includes fields for user name, email, profile and header image uploads, language selection, API key management, and notification settings.

## Properties

| Name                             | Type                                  | Description                                                                 |
|----------------------------------|---------------------------------------|-----------------------------------------------------------------------------|
| action                           | String                                | The API endpoint for user actions.                                          |
| user                             | YpUserData \| undefined               | The user data object.                                                       |
| selected                         | Number                                | The currently selected tab index.                                           |
| encodedUserNotificationSettings  | String \| undefined                   | Encoded user notification settings as a JSON string.                        |
| currentApiKey                    | String \| undefined                   | The current API key if available.                                           |
| uploadedProfileImageId           | Number \| undefined                   | The ID of the uploaded profile image.                                       |
| uploadedHeaderImageId            | Number \| undefined                   | The ID of the uploaded header image.                                        |
| notificationSettings             | AcNotificationSettingsData \| undefined | The notification settings data object.                                      |

## Methods

| Name                        | Parameters | Return Type | Description                                                                 |
|-----------------------------|------------|-------------|-----------------------------------------------------------------------------|
| updated                     | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method called after properties have been updated.                 |
| render                      |            | TemplateResult \| typeof nothing | Renders the element template.                                               |
| connectedCallback           |            | void        | Lifecycle method called when the element is added to the document's DOM.    |
| disconnectedCallback        |            | void        | Lifecycle method called when the element is removed from the document's DOM.|
| _editResponse               | event: CustomEvent | void        | Handles the response after editing the user.                                |
| _checkIfValidEmail          |            | Boolean     | Checks if the user's email is valid.                                        |
| _disconnectFromFacebookLogin|            | void        | Initiates the process to disconnect the user from Facebook login.           |
| _reallyDisconnectFromFacebookLogin |    | Promise<void> | Actually disconnects the user from Facebook login.                          |
| _disconnectFromSamlLogin    |            | void        | Initiates the process to disconnect the user from SAML login.               |
| _reallyDisconnectFromSamlLogin |        | Promise<void> | Actually disconnects the user from SAML login.                              |
| _setNotificationSettings    | event: CustomEvent | void        | Sets the notification settings from an event.                               |
| _notificationSettingsChanged|            | void        | Called when the notification settings have changed.                         |
| _encodeNotificationsSettings| settings: AcNotificationSettingsData \| undefined | String \| undefined | Encodes the notification settings into a JSON string.                       |
| _userChanged                |            | void        | Called when the user property has changed.                                  |
| _profileImageUploaded       | event: CustomEvent | void        | Called when a profile image has been uploaded.                              |
| _headerImageUploaded        | event: CustomEvent | void        | Called when a header image has been uploaded.                               |
| customRedirect              |            | void        | Redirects the user after certain actions.                                   |
| clear                       |            | void        | Clears the user edit form.                                                  |
| _copyApiKey                 |            | void        | Copies the current API key to the clipboard.                                |
| _createApiKey               |            | Promise<void> | Creates a new API key for the user.                                         |
| _reCreateApiKey             |            | void        | Initiates the process to recreate the API key.                              |
| setup                       | user: YpUserData, newNotEdit: boolean, refreshFunction: Function \| undefined, openNotificationTab: boolean | void | Sets up the element with user data and other parameters.                    |
| setupTranslation            |            | void        | Sets up the translation for the element based on whether it's a new user or editing an existing one. |
| _deleteOrAnonymizeUser      |            | void        | Opens the dialog to delete or anonymize the user.                           |

## Events

- **yp-notifications-changed**: Emitted when the notification settings change.

## Examples

```typescript
// Example usage of YpUserEdit
const userEditElement = document.createElement('yp-user-edit');
userEditElement.user = {
  name: "John Doe",
  email: "john.doe@example.com",
  default_locale: "en",
  notifications_settings: {
    emailNotifications: true,
    pushNotifications: false
  }
};
document.body.appendChild(userEditElement);
```

Note: The actual usage of the `YpUserEdit` element would typically involve more setup and interaction with other components, as well as handling of events and API calls.