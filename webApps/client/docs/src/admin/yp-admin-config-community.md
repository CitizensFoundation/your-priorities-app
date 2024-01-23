# YpAdminConfigCommunity

This class is a LitElement web component for managing the configuration of a community within an application. It extends from `YpAdminConfigBase` and provides properties and methods to handle community-specific settings such as hostname, access type, status, and various configurations related to appearance, authentication, and web app settings.

## Properties

| Name                        | Type                                  | Description                                                                 |
|-----------------------------|---------------------------------------|-----------------------------------------------------------------------------|
| appHomeScreenIconImageId    | number \| undefined                   | ID of the image used for the app's home screen icon.                        |
| hostnameExample             | string \| undefined                   | Example of the hostname used for the community.                             |
| hasSamlLoginProvider        | boolean                               | Indicates if the community has a SAML login provider.                       |
| availableCommunityFolders   | Array<YpCommunityData> \| undefined   | List of available community folders.                                        |
| ssnLoginListDataId          | number \| undefined                   | ID of the SSN login list data.                                              |
| ssnLoginListDataCount       | number \| undefined                   | Count of SSN login list data.                                               |
| inCommunityFolderId         | number \| undefined                   | ID of the community folder the community is in.                             |
| signupTermsPageId           | number \| undefined                   | ID of the page containing signup terms.                                     |
| welcomePageId               | number \| undefined                   | ID of the welcome page.                                                     |
| status                      | string \| undefined                   | Status of the community (e.g., active, featured, archived, hidden).         |
| communityAccess             | YpCommunityAccessTypes                | Access type of the community (e.g., public, closed, secret).                |

## Methods

| Name                         | Parameters                            | Return Type | Description                                                                 |
|------------------------------|---------------------------------------|-------------|-----------------------------------------------------------------------------|
| renderHeader                 |                                       | TemplateResult \| typeof nothing | Renders the header of the community configuration page.                     |
| renderHiddenAccessSettings   |                                       | TemplateResult \| typeof nothing | Renders hidden input fields for access settings.                            |
| renderHiddenInputsNotActive  |                                       | TemplateResult | Renders hidden input fields for inactive settings.                          |
| renderHiddenInputs           |                                       | TemplateResult | Renders hidden input fields for various settings.                           |
| _hostnameChanged             |                                       | void        | Handles changes to the hostname input field.                                |
| updated                      | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle callback invoked when properties change.                          |
| languageChanged              |                                       | void        | Handles language changes.                                                   |
| _communityChanged            |                                       | void        | Handles changes to the community data.                                      |
| _deleteSsnLoginList          |                                       | void        | Deletes the SSN login list.                                                 |
| _ssnLoginListDataUploaded    | event: CustomEvent                    | void        | Handles the upload of SSN login list data.                                  |
| _getSsnListCount             |                                       | Promise<void> | Retrieves the count of SSN login list data.                                 |
| _collectionIdChanged         |                                       | void        | Handles changes to the collection ID.                                       |
| _checkCommunityFolders       | community: YpCommunityData            | Promise<void> | Checks for available community folders.                                     |
| _setupTranslations           |                                       | void        | Sets up translations for the component.                                      |
| _formResponse                | event: CustomEvent                    | void        | Handles the form response event.                                            |
| _finishRedirect              | community: YpCommunityData            | void        | Redirects to the appropriate page after form submission.                    |
| _statusSelected              | event: CustomEvent                    | void        | Handles selection of community status.                                      |
| _accessRadioChanged          | event: CustomEvent                    | void        | Handles changes to the access radio buttons.                                |
| _getAccessTab                |                                       | YpConfigTabData | Returns the configuration data for the access tab.                          |
| _getBasicTab                 |                                       | YpConfigTabData | Returns the configuration data for the basic settings tab.                  |
| _welcomePageSelected         | event: CustomEvent                    | void        | Handles selection of the welcome page.                                      |
| _signupTermsPageSelected     | event: CustomEvent                    | void        | Handles selection of the signup terms page.                                 |
| _communityFolderSelected     | event: CustomEvent                    | void        | Handles selection of the community folder.                                  |
| _getLookAndFeelTab           |                                       | YpConfigTabData | Returns the configuration data for the look and feel tab.                   |
| _getWebAppTab                |                                       | YpConfigTabData | Returns the configuration data for the web app settings tab.                |
| _getSamlTab                  |                                       | YpConfigTabData | Returns the configuration data for the SAML authentication tab.             |
| setupConfigTabs              |                                       | Array<YpConfigTabData> | Sets up the configuration tabs for the component.                           |
| _appHomeScreenIconImageUploaded | event: CustomEvent                    | void        | Handles the upload of the app home screen icon image.                       |

## Events (if any)

- **_hostnameChanged**: Emitted when the hostname input field is changed.
- **_ssnLoginListDataUploaded**: Emitted when SSN login list data is successfully uploaded.
- **_statusSelected**: Emitted when a new status is selected from the dropdown.
- **_accessRadioChanged**: Emitted when the access radio button selection changes.
- **_welcomePageSelected**: Emitted when a welcome page is selected from the dropdown.
- **_signupTermsPageSelected**: Emitted when a signup terms page is selected from the dropdown.
- **_communityFolderSelected**: Emitted when a community folder is selected from the dropdown.
- **_appHomeScreenIconImageUploaded**: Emitted when the app home screen icon image is successfully uploaded.

## Examples

```typescript
// Example usage of the YpAdminConfigCommunity component
<yp-admin-config-community
  .appHomeScreenIconImageId=${123}
  .hostnameExample=${"example.community.com"}
  .hasSamlLoginProvider=${true}
  .availableCommunityFolders=${[/* array of YpCommunityData */]}
  .ssnLoginListDataId=${456}
  .ssnLoginListDataCount=${10}
  .inCommunityFolderId=${789}
  .signupTermsPageId=${1011}
  .welcomePageId=${1213}
  .status=${"active"}
  .communityAccess=${"public"}
></yp-admin-config-community>
```

Note: The above example is a hypothetical usage within an HTML template. The actual usage will depend on the context of the application and how the component is integrated.