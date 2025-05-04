# YpAdminConfigGroup

A comprehensive admin configuration web component for managing group settings in a community platform. This component provides a rich UI for editing group properties, access, theme, post/vote/point settings, AllOurIdeas (AOI) survey configuration, HTML content, and more. It extends `YpAdminConfigBase` and leverages Material Web Components and custom elements for advanced admin workflows.

## Properties

| Name                              | Type                                         | Description                                                                                  |
|------------------------------------|----------------------------------------------|----------------------------------------------------------------------------------------------|
| appHomeScreenIconImageId           | number \| undefined                         | ID of the image used as the app home screen icon.                                            |
| hostnameExample                    | string \| undefined                         | Example hostname for the group.                                                              |
| signupTermsPageId                  | number \| undefined                         | ID of the signup terms page.                                                                 |
| welcomePageId                      | number \| undefined                         | ID of the welcome page.                                                                      |
| aoiQuestionName                    | string \| undefined                         | Name of the AllOurIdeas question.                                                            |
| groupAccess                        | YpGroupAccessTypes                           | Access type for the group (e.g., "open_to_community").                                       |
| groupTypeIndex                     | number                                      | Index of the group type (see `GroupType`).                                                   |
| group                              | YpGroupData                                 | The group data object being edited.                                                          |
| cloning                            | boolean                                     | Indicates if the group is currently being cloned.                                            |
| templates                          | Array<YpGroupData> \| undefined             | List of available group templates for cloning.                                               |
| cloningTemplateId                  | number \| null                              | ID of the template currently being cloned.                                                   |
| isDataVisualizationGroup           | any                                         | Indicates if the group is a data visualization group.                                        |
| dataForVisualizationJsonError      | any                                         | Error state for data visualization JSON.                                                     |
| groupMoveToOptions                 | any                                         | Options for moving the group to another parent.                                              |
| moveGroupToId                      | any                                         | ID of the group to move to.                                                                  |
| pages                              | any                                         | List of available pages for selection.                                                       |
| endorsementButtons                 | string \| undefined                         | Selected endorsement button type.                                                            |
| endorsementButtonsDisabled         | boolean                                     | If true, disables the endorsement buttons selection.                                         |
| apiEndpoint                        | unknown                                     | API endpoint for file uploads and other actions.                                             |
| isGroupFolder                      | any                                         | Indicates if the group is a folder.                                                          |
| structuredQuestionsJsonError       | any                                         | Error state for structured questions JSON.                                                   |
| hasSamlLoginProvider               | any                                         | Indicates if SAML login provider is available.                                               |
| questionNameHasChanged             | boolean                                     | Tracks if the AOI question name has changed.                                                 |
| registrationQuestionsJsonError     | boolean                                     | Error state for registration questions JSON.                                                 |
| groupTypeOptions                   | string[]                                    | List of group type option tokens.                                                            |
| static GroupType                   | { ideaGeneration: 0, allOurIdeas: 1, htmlContent: 2, policySynthAgentsWorkflow: 3 } | Enum for group type indices.                                                                 |
| groupAccessOptions                 | Record<number, YpGroupAccessTypes>          | Mapping of access option indices to access type strings.                                     |

## Methods

| Name                                | Parameters                                                                 | Return Type | Description                                                                                       |
|------------------------------------- |----------------------------------------------------------------------------|-------------|---------------------------------------------------------------------------------------------------|
| constructor                         | -                                                                          | void        | Initializes the component, sets up default group configuration.                                   |
| static get styles                   | -                                                                          | CSSResult[] | Returns the component's styles.                                                                   |
| _setGroupType                       | event: CustomEvent                                                         | void        | Handles group type selection changes.                                                             |
| renderGroupTypeSelection            | -                                                                          | TemplateResult | Renders the group type selection dropdown.                                                        |
| renderHeader                        | -                                                                          | TemplateResult \| typeof nothing | Renders the header section of the group config form.                                              |
| getAccessTokenName                  | -                                                                          | string      | Returns the access token name based on the current group access.                                  |
| renderHiddenInputs                  | -                                                                          | TemplateResult | Renders hidden input fields for form submission.                                                  |
| _descriptionChanged                 | event: CustomEvent                                                         | void        | Handles changes to the group description.                                                         |
| connectedCallback                   | -                                                                          | void        | Lifecycle method, sets up group configuration on connect.                                         |
| _clear                              | -                                                                          | void        | Clears the form and resets the app home screen icon image ID.                                     |
| updated                             | changedProperties: Map<string \| number \| symbol, unknown>                | void        | Lifecycle method, updates internal state when properties change.                                  |
| _collectionIdChanged                | -                                                                          | Promise<void> | Handles changes to the collection ID (e.g., new group creation).                                  |
| _setupTranslations                  | -                                                                          | void        | Sets up translation tokens for UI text.                                                           |
| _formResponse                       | event: CustomEvent                                                         | Promise<void> | Handles the form submission response, including video attachment and redirect.                    |
| _finishRedirect                     | group: YpGroupData                                                         | void        | Redirects to the group page after save/clone.                                                     |
| _getAccessTab                       | -                                                                          | YpConfigTabData | Returns the configuration tab for access settings.                                                |
| _groupAccessChanged                 | event: CustomEvent                                                         | void        | Handles changes to the group access radio buttons.                                                |
| _getThemeTab                        | -                                                                          | YpConfigTabData | Returns the configuration tab for theme settings.                                                 |
| _inheritThemeChanged                | event: CustomEvent                                                         | void        | Handles changes to the inherit theme checkbox.                                                    |
| _getPostSettingsTab                 | -                                                                          | YpConfigTabData \| null | Returns the configuration tab for post settings, or null if group is a folder.                    |
| _defaultDataImageUploaded           | event: CustomEvent                                                         | void        | Handles upload of the default data image.                                                         |
| _defaultPostImageUploaded           | event: CustomEvent                                                         | void        | Handles upload of the default post image.                                                         |
| _haveUploadedDocxSurvey             | event: CustomEvent                                                         | void        | Handles upload and conversion of a DOCX survey to JSON.                                           |
| _getVoteSettingsTab                 | -                                                                          | YpConfigTabData | Returns the configuration tab for vote settings.                                                  |
| endorsementButtonsOptions            | -                                                                          | Array<{ name: string, translatedName: string }> | Returns the available endorsement button options.                                                 |
| _endorsementButtonsSelected         | event: CustomEvent                                                         | void        | Handles selection of endorsement button type.                                                     |
| endorsementButtonsIndex             | -                                                                          | number      | Returns the index of the selected endorsement button.                                             |
| _customRatingsTextChanged           | event: CustomEvent                                                         | void        | Handles changes to custom ratings text.                                                           |
| _getPointSettingsTab                | -                                                                          | YpConfigTabData | Returns the configuration tab for point settings.                                                 |
| _getAdditionalConfigTab             | -                                                                          | YpConfigTabData | Returns the configuration tab for additional group settings.                                      |
| renderActionMenu                    | -                                                                          | TemplateResult | Renders the action menu for group actions (delete, clone, etc.).                                 |
| _onDeleted                          | -                                                                          | void        | Handles group deletion and redirects to the community page.                                       |
| _openDelete                         | -                                                                          | void        | Opens the delete confirmation dialog.                                                             |
| _menuSelection                      | event: CustomEvent                                                         | void        | Handles selection from the action menu.                                                           |
| _openClone                          | -                                                                          | Promise<void> | Initiates group cloning and redirects to the new group.                                           |
| earlConfigChanged                   | event: CustomEvent                                                         | void        | Handles changes to the AOI (AllOurIdeas) configuration.                                           |
| staticHtmlConfigChanged             | event: CustomEvent                                                         | Promise<void> | Handles changes to the static HTML configuration.                                                 |
| themeConfigChanged                  | event: CustomEvent                                                         | void        | Handles changes to the theme configuration.                                                       |
| renderCreateEarl                    | domainId: number \| undefined, communityId: number \| undefined            | TemplateResult | Renders the AOI ideas editor.                                                                     |
| renderHtmlContent                   | domainId: number \| undefined, communityId: number \| undefined            | TemplateResult | Renders the HTML content editor.                                                                  |
| setupEarlConfigIfNeeded             | -                                                                          | void        | Ensures AOI configuration is initialized.                                                        |
| questionNameChanged                 | event: CustomEvent                                                         | void        | Handles changes to the AOI question name.                                                         |
| afterSave                           | -                                                                          | void        | Called after saving the group, updates AOI question name if changed.                              |
| _getHtmlContentTab                  | -                                                                          | YpConfigTabData | Returns the configuration tab for HTML content.                                                   |
| _getAllOurIdeaTab                   | -                                                                          | YpConfigTabData | Returns the configuration tab for AllOurIdeas survey.                                             |
| set                                 | obj: any, path: string, value: any                                         | void        | Sets a value on an object at a given path (dot notation).                                         |
| _updateEarl                         | event: CustomEvent, earlUpdatePath: string, parseJson?: boolean            | void        | Updates AOI configuration at a given path, optionally parsing JSON.                               |
| _getAllOurIdeaOptionsTab            | -                                                                          | YpConfigTabData | Returns the configuration tab for AllOurIdeas options.                                            |
| _categorySelected                   | event: CustomEvent                                                         | void        | Handles category selection.                                                                       |
| _categoryImageSrc                   | category: any                                                              | string      | Returns the image source URL for a category icon.                                                 |
| _welcomePageSelected                | event: CustomEvent                                                         | void        | Handles selection of the welcome page.                                                            |
| _isDataVisualizationGroupClick      | event: CustomEvent                                                         | void        | Handles click event for the data visualization group checkbox.                                    |
| _dataForVisualizationChanged        | event: CustomEvent                                                         | void        | Handles changes to the data for visualization textarea.                                           |
| _moveGroupToSelected                | event: CustomEvent                                                         | void        | Handles selection of the group to move to.                                                        |
| setupConfigTabs                     | -                                                                          | Array<YpConfigTabData> | Sets up the configuration tabs based on group type.                                               |
| _appHomeScreenIconImageUploaded     | event: CustomEvent                                                         | void        | Handles upload of the app home screen icon image.                                                 |
| _openTemplatesDialog                | -                                                                          | Promise<void> | Opens the dialog for selecting a group template to clone.                                         |
| _cloneTemplate                      | template: YpGroupData                                                      | Promise<void> | Initiates cloning of a group template.                                                            |
| renderTemplatesDialog               | -                                                                          | TemplateResult | Renders the dialog for selecting and cloning group templates.                                     |
| _validateJson                       | value: string \| undefined \| null, errorProp: keyof YpAdminConfigGroup    | void        | Validates a JSON string and sets the error property accordingly.                                  |
| _structuredQuestionsChanged         | event: CustomEvent                                                         | void        | Handles changes to the structured questions textarea.                                             |
| _registrationQuestionsChanged       | event: CustomEvent                                                         | void        | Handles changes to the registration questions textarea.                                           |

## Examples

```typescript
import "./yp-admin-config-group.js";

const groupConfig = document.createElement("yp-admin-config-group");
groupConfig.collectionId = "123";
document.body.appendChild(groupConfig);

// Listen for save events
groupConfig.addEventListener("save", (e) => {
  console.log("Group saved!", e.detail);
});
```

```html
<yp-admin-config-group collection-id="new"></yp-admin-config-group>
```

## Events

- **yp-refresh-community**: Emitted after a group is deleted to refresh the parent community.
- **yp-request-update-on-parent**: Emitted when the group type changes to request parent update.
- **configuration-changed**: Emitted by child editors (e.g., AOI, HTML) when their configuration changes.
- **save**: Emitted when the group is saved.
- **success**: Emitted by file upload components on successful upload.
- **changed**: Emitted by language selector and other subcomponents on value change.

---

**Note:**  
- This component is intended for admin use and expects a rich set of data objects (`YpGroupData`, `YpConfigTabData`, etc.) and integration with a larger application context (e.g., `window.appGlobals`, `window.serverApi`).
- Many methods interact with external APIs, dialogs, and global helpers, and require the full application environment to function as intended.
