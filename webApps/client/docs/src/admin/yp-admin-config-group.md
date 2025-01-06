# YpAdminConfigGroup

The `YpAdminConfigGroup` class is a web component that extends `YpAdminConfigBase`. It is used to manage and configure group settings within an application. This component provides a user interface for configuring various aspects of a group, such as access, theme, post settings, voting settings, and more.

## Properties

| Name                          | Type                      | Description                                                                 |
|-------------------------------|---------------------------|-----------------------------------------------------------------------------|
| appHomeScreenIconImageId      | number \| undefined       | ID of the app home screen icon image.                                       |
| hostnameExample               | string \| undefined       | Example hostname for the group.                                             |
| signupTermsPageId             | number \| undefined       | ID of the signup terms page.                                                |
| welcomePageId                 | number \| undefined       | ID of the welcome page.                                                     |
| aoiQuestionName               | string \| undefined       | Name of the AOI question.                                                   |
| groupAccess                   | YpGroupAccessTypes        | Access type of the group. Default is "open_to_community".                   |
| groupTypeIndex                | number                    | Index of the group type. Default is 0.                                      |
| group                         | YpGroupData               | Data of the group being configured.                                         |
| isDataVisualizationGroup      | any                       | Indicates if the group is a data visualization group.                       |
| dataForVisualizationJsonError | any                       | Error related to data for visualization JSON.                               |
| groupMoveToOptions            | any                       | Options for moving the group.                                               |
| moveGroupToId                 | any                       | ID of the group to move to.                                                 |
| pages                         | any                       | Pages associated with the group.                                            |
| endorsementButtons            | string \| undefined       | Type of endorsement buttons used.                                           |
| endorsementButtonsDisabled    | boolean                   | Indicates if endorsement buttons are disabled. Default is false.            |
| apiEndpoint                   | unknown                   | API endpoint for the group.                                                 |
| isGroupFolder                 | any                       | Indicates if the group is a folder.                                         |
| structuredQuestionsJsonError  | any                       | Error related to structured questions JSON.                                 |
| hasSamlLoginProvider          | any                       | Indicates if the group has a SAML login provider.                           |
| questionNameHasChanged        | boolean                   | Indicates if the question name has changed. Default is false.               |
| groupTypeOptions              | string[]                  | Array of group type options.                                                |

## Methods

| Name                          | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| _setGroupType                 | event: CustomEvent                                                         | void        | Sets the group type based on the selected index from the event.             |
| renderGroupTypeSelection      | none                                                                       | TemplateResult | Renders the group type selection UI.                                        |
| renderHeader                  | none                                                                       | TemplateResult | Renders the header UI for the group configuration.                          |
| getAccessTokenName            | none                                                                       | string      | Returns the access token name based on the group access type.               |
| renderHiddenInputs            | none                                                                       | TemplateResult | Renders hidden input fields for form submission.                            |
| _descriptionChanged           | event: CustomEvent                                                         | void        | Handles changes to the group description.                                   |
| connectedCallback             | none                                                                       | void        | Lifecycle method called when the component is added to the document.        |
| _clear                        | none                                                                       | void        | Clears certain properties of the component.                                 |
| updated                       | changedProperties: Map<string \| number \| symbol, unknown>                | void        | Lifecycle method called when properties are updated.                        |
| _collectionIdChanged          | none                                                                       | Promise<void> | Handles changes to the collection ID.                                       |
| _setupTranslations            | none                                                                       | void        | Sets up translations for the component.                                     |
| _formResponse                 | event: CustomEvent                                                         | Promise<void> | Handles form response events.                                               |
| _finishRedirect               | group: YpGroupData                                                         | void        | Redirects to the group page after saving.                                   |
| _getAccessTab                 | none                                                                       | YpConfigTabData | Returns the configuration tab for access settings.                          |
| _groupAccessChanged           | event: CustomEvent                                                         | void        | Handles changes to the group access setting.                                |
| _getThemeTab                  | none                                                                       | YpConfigTabData | Returns the configuration tab for theme settings.                           |
| _inheritThemeChanged          | event: CustomEvent                                                         | void        | Handles changes to the inherit theme setting.                               |
| _getPostSettingsTab           | none                                                                       | YpConfigTabData \| null | Returns the configuration tab for post settings, or null if not applicable. |
| _defaultDataImageUploaded     | event: CustomEvent                                                         | void        | Handles the event when a default data image is uploaded.                    |
| _defaultPostImageUploaded     | event: CustomEvent                                                         | void        | Handles the event when a default post image is uploaded.                    |
| _haveUploadedDocxSurvey       | event: CustomEvent                                                         | void        | Handles the event when a DOCX survey is uploaded.                           |
| _getVoteSettingsTab           | none                                                                       | YpConfigTabData | Returns the configuration tab for vote settings.                            |
| endorsementButtonsOptions     | none                                                                       | { name: string, translatedName: string }[] | Returns the options for endorsement buttons.                                |
| _endorsementButtonsSelected   | event: CustomEvent                                                         | void        | Handles selection of endorsement buttons.                                   |
| endorsementButtonsIndex       | none                                                                       | number      | Returns the index of the selected endorsement button.                       |
| _customRatingsTextChanged     | event: CustomEvent                                                         | void        | Handles changes to custom ratings text.                                     |
| _getPointSettingsTab          | none                                                                       | YpConfigTabData | Returns the configuration tab for point settings.                           |
| _getAdditionalConfigTab       | none                                                                       | YpConfigTabData | Returns the configuration tab for additional group settings.                |
| renderActionMenu              | none                                                                       | TemplateResult | Renders the action menu UI.                                                 |
| _onDeleted                    | none                                                                       | void        | Handles the event when the group is deleted.                                |
| _openDelete                   | none                                                                       | void        | Opens the delete confirmation dialog.                                       |
| _menuSelection                | event: CustomEvent                                                         | void        | Handles menu selection events.                                              |
| earlConfigChanged             | event: CustomEvent                                                         | void        | Handles changes to the EARL configuration.                                  |
| staticHtmlConfigChanged       | event: CustomEvent                                                         | Promise<void> | Handles changes to the static HTML configuration.                           |
| themeConfigChanged            | event: CustomEvent                                                         | void        | Handles changes to the theme configuration.                                 |
| renderCreateEarl              | domainId: number \| undefined, communityId: number \| undefined            | TemplateResult | Renders the EARL ideas editor UI.                                           |
| renderHtmlContent             | domainId: number \| undefined, communityId: number \| undefined            | TemplateResult | Renders the HTML content editor UI.                                         |
| setupEarlConfigIfNeeded       | none                                                                       | void        | Sets up EARL configuration if needed.                                       |
| questionNameChanged           | event: CustomEvent                                                         | void        | Handles changes to the AOI question name.                                   |
| afterSave                     | none                                                                       | void        | Called after the group is saved.                                            |
| _getHtmlContentTab            | none                                                                       | YpConfigTabData | Returns the configuration tab for HTML content.                             |
| _getAllOurIdeaTab             | none                                                                       | YpConfigTabData | Returns the configuration tab for All Our Ideas.                            |
| set                           | obj: any, path: string, value: any                                         | void        | Sets a value at a specified path in an object.                              |
| _updateEarl                   | event: CustomEvent, earlUpdatePath: string, parseJson: boolean             | void        | Updates EARL configuration based on the event.                              |
| _getAllOurIdeaOptionsTab      | none                                                                       | YpConfigTabData | Returns the configuration tab for All Our Ideas options.                    |
| _categorySelected             | event: CustomEvent                                                         | void        | Handles category selection events.                                          |
| _categoryImageSrc             | category: any                                                              | string      | Returns the image source URL for a category icon.                           |
| _welcomePageSelected          | event: CustomEvent                                                         | void        | Handles selection of the welcome page.                                      |
| _isDataVisualizationGroupClick| event: CustomEvent                                                         | void        | Handles click events for the data visualization group checkbox.             |
| _dataForVisualizationChanged  | event: CustomEvent                                                         | void        | Handles changes to the data for visualization textarea.                     |
| _moveGroupToSelected          | event: CustomEvent                                                         | void        | Handles selection of the group to move to.                                  |
| setupConfigTabs               | none                                                                       | YpConfigTabData[] | Sets up the configuration tabs based on the group type.                     |
| _appHomeScreenIconImageUploaded| event: CustomEvent                                                        | void        | Handles the event when the app home screen icon image is uploaded.          |

## Examples

```typescript
// Example usage of the YpAdminConfigGroup web component
import { html, LitElement } from 'lit';
import './yp-admin-config-group.js';

class MyApp extends LitElement {
  render() {
    return html`
      <yp-admin-config-group></yp-admin-config-group>
    `;
  }
}

customElements.define('my-app', MyApp);
```