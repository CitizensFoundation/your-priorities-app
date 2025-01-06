# YpAdminConfigCommunity

The `YpAdminConfigCommunity` class is a web component that extends `YpAdminConfigBase`. It is used to manage the configuration of a community within an application, including settings for access, appearance, and integration with external services.

## Properties

| Name                        | Type                                      | Description                                                                 |
|-----------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| appHomeScreenIconImageId    | number \| undefined                       | ID of the app home screen icon image.                                       |
| hostnameExample             | string \| undefined                       | Example hostname for the community.                                         |
| hasSamlLoginProvider        | boolean                                   | Indicates if the community has a SAML login provider.                       |
| availableCommunityFolders   | Array<YpCommunityData> \| undefined       | List of available community folders.                                        |
| ssnLoginListDataId          | number \| undefined                       | ID of the SSN login list data.                                              |
| ssnLoginListDataCount       | number \| undefined                       | Count of the SSN login list data.                                           |
| inCommunityFolderId         | number \| undefined                       | ID of the community folder the community is in.                             |
| signupTermsPageId           | number \| undefined                       | ID of the signup terms page.                                                |
| welcomePageId               | number \| undefined                       | ID of the welcome page.                                                     |
| communityAccess             | YpCommunityAccessTypes                    | Access type of the community (public, closed, secret).                      |
| hideHostnameInput           | boolean                                   | Indicates if the hostname input should be hidden.                           |

## Methods

| Name                          | Parameters                          | Return Type | Description                                                                 |
|-------------------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| constructor                   |                                     | void        | Initializes the component and sets the default action URL.                  |
| _generateRandomHostname       |                                     | string      | Generates a random hostname for the community.                              |
| renderHostname                |                                     | TemplateResult | Renders the hostname input field or a hidden input if `hideHostnameInput` is true. |
| renderHeader                  |                                     | TemplateResult | Renders the header section of the component.                                |
| renderActionMenu              |                                     | TemplateResult | Renders the action menu with various options.                               |
| _onDeleted                    |                                     | void        | Handles the deletion of the community and redirects to the domain page.     |
| _openDelete                   |                                     | void        | Opens the delete confirmation dialog.                                       |
| _menuSelection                | event: CustomEvent                  | void        | Handles menu item selection and performs the corresponding action.          |
| renderHiddenAccessSettings    |                                     | TemplateResult | Renders hidden input for community access settings.                         |
| renderHiddenInputsNotActive   |                                     | TemplateResult | Renders hidden inputs for inactive settings.                                |
| renderHiddenInputs            |                                     | TemplateResult | Renders hidden inputs for various community settings.                       |
| _hostnameChanged              |                                     | void        | Updates the hostname example when the hostname input changes.               |
| _clear                        |                                     | void        | Clears the component's properties and resets the file upload component.     |
| updated                       | changedProperties: Map              | void        | Handles updates to the component's properties and performs necessary actions. |
| languageChanged               |                                     | void        | Sets up translations when the language changes.                             |
| _communityChanged             |                                     | void        | Handles changes to the community data and updates the component accordingly. |
| _deleteSsnLoginList           |                                     | void        | Deletes the SSN login list data.                                            |
| _ssnLoginListDataUploaded     | event: CustomEvent                  | void        | Handles the upload of SSN login list data and updates the count.            |
| _getSsnListCount              |                                     | Promise<void> | Retrieves the count of the SSN login list data.                             |
| _collectionIdChanged          |                                     | Promise<void> | Handles changes to the collection ID and updates the component accordingly. |
| checkDomainName               | id: number                          | Promise<void> | Checks the domain name and updates the hostname input visibility.           |
| _checkCommunityFolders        | community: YpCommunityData          | Promise<void> | Checks for available community folders and updates the list.                |
| _setupTranslations            |                                     | void        | Sets up translations for the component based on the current state.          |
| _formResponse                 | event: CustomEvent                  | Promise<void> | Handles the form response and performs actions based on the community data. |
| _finishRedirect               | community: YpCommunityData          | void        | Redirects to the appropriate page after form submission.                    |
| _accessRadioChanged           | event: CustomEvent                  | void        | Handles changes to the access radio buttons and updates the community access. |
| _getAccessTab                 |                                     | YpConfigTabData | Returns the configuration tab data for access settings.                     |
| _getBasicTab                  |                                     | YpConfigTabData | Returns the configuration tab data for basic settings.                      |
| _welcomePageSelected          | event: CustomEvent                  | void        | Handles the selection of the welcome page.                                  |
| _signupTermsPageSelected      | event: CustomEvent                  | void        | Handles the selection of the signup terms page.                             |
| _communityFolderSelected      | event: CustomEvent                  | void        | Handles the selection of the community folder.                              |
| _getLookAndFeelTab            |                                     | YpConfigTabData | Returns the configuration tab data for look and feel settings.              |
| _getWebAppTab                 |                                     | YpConfigTabData | Returns the configuration tab data for web app settings.                    |
| _getSamlTab                   |                                     | YpConfigTabData | Returns the configuration tab data for SAML authentication settings.        |
| setupConfigTabs               |                                     | Array<YpConfigTabData> | Sets up the configuration tabs for the component.                           |
| _appHomeScreenIconImageUploaded | event: CustomEvent                | void        | Handles the upload of the app home screen icon image and updates the ID.    |

## Examples

```typescript
// Example usage of the YpAdminConfigCommunity component
import './path/to/yp-admin-config-community.js';

const communityConfig = document.createElement('yp-admin-config-community');
document.body.appendChild(communityConfig);
```