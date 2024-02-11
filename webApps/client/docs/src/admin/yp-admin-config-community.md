# YpAdminConfigCommunity

This class is a LitElement web component for configuring community settings in an admin interface. It extends `YpAdminConfigBase` and provides a UI for managing various community configurations such as access settings, basic information, look and feel, web app settings, and SAML authentication.

## Properties

| Name                        | Type                              | Description                                                                 |
|-----------------------------|-----------------------------------|-----------------------------------------------------------------------------|
| appHomeScreenIconImageId    | number \| undefined               | ID of the image used for the app's home screen icon.                        |
| hostnameExample             | string \| undefined               | Example of the hostname for the community.                                  |
| hasSamlLoginProvider        | boolean                           | Indicates if the community has a SAML login provider.                       |
| availableCommunityFolders   | Array<YpCommunityData> \| undefined | List of available community folders.                                        |
| ssnLoginListDataId          | number \| undefined               | ID of the SSN login list data.                                              |
| ssnLoginListDataCount       | number \| undefined               | Count of SSN login list data.                                               |
| inCommunityFolderId         | number \| undefined               | ID of the community folder the community is in.                             |
| signupTermsPageId           | number \| undefined               | ID of the page containing signup terms.                                     |
| welcomePageId               | number \| undefined               | ID of the welcome page.                                                     |
| communityAccess             | YpCommunityAccessTypes            | Access type of the community (e.g., "public", "closed", "secret").          |

## Methods

| Name                   | Parameters                          | Return Type | Description                                                                 |
|------------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| renderHeader           |                                     | TemplateResult \| typeof nothing | Renders the header of the community configuration page.                     |
| renderHiddenAccessSettings |                                 | TemplateResult \| typeof nothing | Renders hidden input fields for access settings.                            |
| renderHiddenInputsNotActive |                               | TemplateResult | Renders hidden input fields for inactive settings.                          |
| renderHiddenInputs     |                                     | TemplateResult | Renders hidden input fields for various settings.                           |
| _hostnameChanged       |                                     | void        | Handles changes to the hostname input field.                                |
| updated                | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method called after the element’s properties have changed.       |
| languageChanged        |                                     | void        | Handles changes to the language.                                            |
| _communityChanged      |                                     | void        | Handles changes to the community data.                                      |
| _deleteSsnLoginList    |                                     | void        | Deletes the SSN login list.                                                 |
| _ssnLoginListDataUploaded | event: CustomEvent               | void        | Handles the upload of SSN login list data.                                  |
| _getSsnListCount       |                                     | Promise<void> | Retrieves the count of SSN login list data.                                 |
| _collectionIdChanged   |                                     | void        | Handles changes to the collection ID.                                       |
| _checkCommunityFolders | community: YpCommunityData          | Promise<void> | Checks for available community folders.                                     |
| _setupTranslations     |                                     | void        | Sets up translations for UI text.                                           |
| _formResponse          | event: CustomEvent                  | Promise<void> | Handles the form response after saving community settings.                  |
| _finishRedirect        | community: YpCommunityData          | void        | Redirects the user after saving community settings.                         |
| _accessRadioChanged    | event: CustomEvent                  | void        | Handles changes to the access radio buttons.                                |
| _getAccessTab          |                                     | YpConfigTabData | Returns the configuration data for the access tab.                          |
| _getBasicTab           |                                     | YpConfigTabData | Returns the configuration data for the basic settings tab.                  |
| _welcomePageSelected   | event: CustomEvent                  | void        | Handles selection of the welcome page.                                      |
| _signupTermsPageSelected | event: CustomEvent                | void        | Handles selection of the signup terms page.                                 |
| _communityFolderSelected | event: CustomEvent                | void        | Handles selection of the community folder.                                  |
| _getLookAndFeelTab     |                                     | YpConfigTabData | Returns the configuration data for the look and feel tab.                   |
| _getWebAppTab          |                                     | YpConfigTabData | Returns the configuration data for the web app settings tab.                |
| _getSamlTab            |                                     | YpConfigTabData | Returns the configuration data for the SAML authentication tab.             |
| setupConfigTabs        |                                     | Array<YpConfigTabData> | Sets up the configuration tabs for the community settings.                  |
| _appHomeScreenIconImageUploaded | event: CustomEvent        | void        | Handles the upload of the app home screen icon image.                       |

## Events (if any)

- **None specified**

## Examples

```typescript
// Example usage of the YpAdminConfigCommunity component
<yp-admin-config-community
  .appHomeScreenIconImageId=${123}
  .hostnameExample=${"example.community.com"}
  .hasSamlLoginProvider=${true}
  .availableCommunityFolders=${[/* array of YpCommunityData */]}
  .ssnLoginListDataId=${456}
  .ssnLoginListDataCount=${789}
  .inCommunityFolderId=${101112}
  .signupTermsPageId=${131415}
  .welcomePageId=${161718}
  .communityAccess=${"public"}
></yp-admin-config-community>
```

Note: The example provided is a hypothetical usage scenario of the `YpAdminConfigCommunity` component within an HTML template. The actual implementation may vary based on the context in which the component is used.