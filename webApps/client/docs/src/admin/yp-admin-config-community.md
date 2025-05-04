# YpAdminConfigCommunity

A LitElement-based admin configuration component for managing community settings in a web application. Extends `YpAdminConfigBase` and provides a rich UI for editing community properties, access, look and feel, web app settings, SAML authentication, and more. Supports advanced features like community cloning, template management, and integration with Material Web Components.

## Properties

| Name                        | Type                                         | Description                                                                                 |
|-----------------------------|----------------------------------------------|---------------------------------------------------------------------------------------------|
| appHomeScreenIconImageId    | number \| undefined                          | ID of the uploaded app home screen icon image.                                              |
| hostnameExample             | string \| undefined                          | Example hostname for the community.                                                         |
| hasSamlLoginProvider        | boolean                                      | Whether the domain has a SAML login provider.                                               |
| availableCommunityFolders   | Array&lt;YpCommunityData&gt; \| undefined    | List of available community folders for selection.                                          |
| ssnLoginListDataId          | number \| undefined                          | ID of the uploaded SSN login list data.                                                     |
| ssnLoginListDataCount       | number \| undefined                          | Count of entries in the SSN login list data.                                                |
| inCommunityFolderId         | number \| undefined                          | ID of the community folder this community belongs to.                                       |
| signupTermsPageId           | number \| undefined                          | ID of the signup terms page.                                                                |
| welcomePageId               | number \| undefined                          | ID of the welcome page.                                                                     |
| communityAccess             | YpCommunityAccessTypes                       | Access type for the community ("public", "closed", "secret").                              |
| hideHostnameInput           | boolean                                      | Whether to hide the hostname input field.                                                   |
| templates                   | Array&lt;YpCommunityData&gt; \| undefined    | List of available community templates for cloning.                                          |
| cloning                     | boolean                                      | Whether a community cloning operation is in progress.                                       |
| cloningTemplateId           | number \| null                               | ID of the template currently being cloned, or null if not cloning.                          |

## Methods

| Name                                 | Parameters                                                                 | Return Type         | Description                                                                                      |
|--------------------------------------|----------------------------------------------------------------------------|---------------------|--------------------------------------------------------------------------------------------------|
| constructor                          |                                                                            | void                | Initializes the component and sets the default action endpoint.                                   |
| _generateRandomHostname              |                                                                            | string              | Generates a random hostname string.                                                               |
| static get styles                    |                                                                            | CSSResultGroup      | Returns the component's styles, including inherited styles.                                       |
| renderHostname                       |                                                                            | TemplateResult      | Renders the hostname input or hidden field based on `hideHostnameInput`.                         |
| renderHeader                         |                                                                            | TemplateResult      | Renders the header section with logo, name, description, and action buttons.                      |
| renderActionMenu                     |                                                                            | TemplateResult      | Renders the action menu for community actions (delete, clone, etc.).                             |
| _onDeleted                           |                                                                            | void                | Handles post-delete logic, dispatches refresh event and redirects.                                |
| _openDelete                          |                                                                            | void                | Opens the delete confirmation dialog for the community.                                           |
| _menuSelection                       | event: CustomEvent                                                         | void                | Handles selection from the action menu (delete, clone, etc.).                                     |
| _openClone                           |                                                                            | Promise&lt;void&gt; | Initiates the community cloning process and redirects on success.                                 |
| renderHiddenAccessSettings           |                                                                            | TemplateResult      | Renders hidden input for community access type.                                                   |
| renderHiddenInputsNotActive          |                                                                            | TemplateResult      | Renders hidden input for theme ID.                                                                |
| renderHiddenInputs                   |                                                                            | TemplateResult      | Renders all hidden inputs required for form submission.                                           |
| _hostnameChanged                     |                                                                            | void                | Handles changes to the hostname input and updates the example.                                    |
| _clear                               |                                                                            | void                | Clears the form and resets relevant properties.                                                   |
| updated                              | changedProperties: Map&lt;string \| number \| symbol, unknown&gt;           | void                | Handles property updates and triggers related logic.                                              |
| languageChanged                      |                                                                            | void                | Handles language change events and updates translations.                                          |
| _communityChanged                    |                                                                            | void                | Handles changes to the community data and updates related properties.                             |
| _deleteSsnLoginList                  |                                                                            | void                | Deletes the uploaded SSN login list data.                                                         |
| _ssnLoginListDataUploaded            | event: CustomEvent                                                         | void                | Handles successful upload of SSN login list data.                                                 |
| _getSsnListCount                     |                                                                            | Promise&lt;void&gt; | Fetches the count of entries in the SSN login list.                                               |
| _collectionIdChanged                 |                                                                            | Promise&lt;void&gt; | Handles changes to the collection ID (new, newFolder, or existing).                               |
| checkDomainName                      | id: number                                                                 | Promise&lt;void&gt; | Checks the domain name and updates hostname input visibility.                                     |
| _checkCommunityFolders               | community: YpCommunityData                                                 | Promise&lt;void&gt; | Fetches available community folders for the current domain.                                       |
| _setupTranslations                   |                                                                            | void                | Sets up translation strings for UI elements.                                                      |
| _formResponse                        | event: CustomEvent                                                         | Promise&lt;void&gt; | Handles the form submission response, including hostname taken and video upload logic.            |
| _finishRedirect                      | community: YpCommunityData                                                 | void                | Redirects to the appropriate page after saving or creating a community.                          |
| _accessRadioChanged                  | event: CustomEvent                                                         | void                | Handles changes to the access radio buttons.                                                      |
| _getAccessTab                        |                                                                            | YpConfigTabData     | Returns the configuration tab for access settings.                                                |
| _getBasicTab                         |                                                                            | YpConfigTabData     | Returns the configuration tab for basic settings.                                                 |
| _welcomePageSelected                 | event: CustomEvent                                                         | void                | Handles selection of the welcome page.                                                            |
| welcomePageIndex                     |                                                                            | number              | Gets the index of the selected welcome page.                                                      |
| _signupTermsPageSelected             | event: CustomEvent                                                         | void                | Handles selection of the signup terms page.                                                       |
| signupTermsPageIndex                 |                                                                            | number              | Gets the index of the selected signup terms page.                                                 |
| _communityFolderSelected             | event: CustomEvent                                                         | void                | Handles selection of the community folder.                                                        |
| communityFolderIndex                 |                                                                            | number              | Gets the index of the selected community folder.                                                  |
| _getLookAndFeelTab                   |                                                                            | YpConfigTabData     | Returns the configuration tab for look and feel settings.                                         |
| _getWebAppTab                        |                                                                            | YpConfigTabData     | Returns the configuration tab for web app settings.                                               |
| _getSamlTab                          |                                                                            | YpConfigTabData     | Returns the configuration tab for SAML authentication settings.                                   |
| setupConfigTabs                      |                                                                            | Array&lt;YpConfigTabData&gt; | Sets up all configuration tabs for the admin UI.                                         |
| _appHomeScreenIconImageUploaded      | event: CustomEvent                                                         | void                | Handles successful upload of the app home screen icon image.                                      |
| _openTemplatesDialog                 |                                                                            | Promise&lt;void&gt; | Opens the dialog for selecting and cloning community templates.                                   |
| _cloneTemplate                       | template: YpCommunityData, event: Event                                    | Promise&lt;void&gt; | Initiates cloning of a selected community template.                                               |
| renderTemplatesDialog                |                                                                            | TemplateResult      | Renders the dialog for selecting and cloning community templates.                                 |

## Examples

```typescript
import "./yp-admin-config-community.js";

const adminConfig = document.createElement("yp-admin-config-community");
document.body.appendChild(adminConfig);

// Set properties as needed
adminConfig.collectionId = "new";
adminConfig.parentCollectionId = 1;
```
