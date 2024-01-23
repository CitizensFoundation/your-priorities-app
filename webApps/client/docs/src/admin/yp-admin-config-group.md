# YpAdminConfigGroup

This class is responsible for managing the configuration of a group within an application. It extends from `YpAdminConfigBase` and uses various web components to provide a user interface for editing group settings.

## Properties

| Name                          | Type                      | Description                                                                 |
|-------------------------------|---------------------------|-----------------------------------------------------------------------------|
| appHomeScreenIconImageId      | number \| undefined       | ID of the image used for the app's home screen icon.                        |
| hostnameExample               | string \| undefined       | Example hostname for the group.                                             |
| signupTermsPageId             | number \| undefined       | ID of the page containing signup terms.                                     |
| welcomePageId                 | number \| undefined       | ID of the welcome page for the group.                                       |
| status                        | string \| undefined       | Current status of the group.                                                |
| groupAccess                   | YpGroupAccessTypes        | Access level of the group (e.g., open_to_community).                        |
| gettingImageColor             | boolean                   | Indicates if the theme color is being extracted from an image.              |
| ypImageUrl                    | string \| undefined       | URL of the group's image.                                                   |
| groupTypeIndex                | number                    | Index representing the type of the group.                                   |
| group                         | YpGroupData               | Data object representing the group.                                         |
| detectedThemeColor            | string \| undefined       | Detected theme color from the group's image.                                |
| isDataVisualizationGroup      | any                       | Indicates if the group is for data visualization.                           |
| dataForVisualizationJsonError | any                       | Error related to JSON data for visualization.                               |
| groupMoveToOptions            | any                       | Options for moving the group to another parent group.                       |
| moveGroupToId                 | any                       | ID of the target group to move the current group to.                        |
| pages                         | any                       | Pages associated with the group.                                            |
| endorsementButtons            | string \| undefined       | Configuration for endorsement buttons.                                      |
| endorsementButtonsDisabled    | boolean                   | Indicates if endorsement buttons are disabled.                              |
| apiEndpoint                   | unknown                   | API endpoint for server interactions.                                       |
| isGroupFolder                 | any                       | Indicates if the group is a folder.                                         |
| structuredQuestionsJsonError  | any                       | Error related to JSON structured questions.                                 |
| collectionStatusOptions       | any                       | Options for the status of the group collection.                             |
| statusIndex                   | any                       | Index representing the status of the group collection.                      |
| hasSamlLoginProvider          | any                       | Indicates if SAML login provider is available.                              |
| groupTypeOptions              | string[]                  | Array of strings representing the available group types.                    |

## Methods

| Name                          | Parameters                | Return Type | Description                                                                 |
|-------------------------------|---------------------------|-------------|-----------------------------------------------------------------------------|
| imageLoaded                   | event: CustomEvent        | void        | Handles the event when an image is loaded.                                  |
| _setGroupType                 | event: CustomEvent        | void        | Sets the group type based on the selected index.                            |
| renderGroupTypeSelection      | none                      | TemplateResult | Renders the group type selection UI.                                        |
| renderHeader                  | none                      | TemplateResult | Renders the header section of the configuration UI.                         |
| renderImage                   | none                      | TemplateResult | Renders the group's image.                                                  |
| getAccessTokenName            | none                      | string      | Returns the access token name based on the group access level.              |
| renderHiddenInputs            | none                      | TemplateResult | Renders hidden input elements for form submission.                          |
| _descriptionChanged           | event: CustomEvent        | void        | Handles changes to the group description.                                   |
| _logoImageUploaded            | event: CustomEvent        | void        | Handles the event when a logo image is uploaded.                            |
| connectedCallback             | none                      | void        | Lifecycle callback that runs when the component is added to the DOM.        |
| _clear                        | none                      | void        | Clears the configuration data.                                              |
| _collectionIdChanged          | none                      | void        | Handles changes to the collection ID.                                       |
| _setupTranslations            | none                      | void        | Sets up translations for UI text.                                           |
| _formResponse                 | event: CustomEvent        | void        | Handles the response from a form submission.                                |
| _finishRedirect               | group: YpGroupData        | void        | Redirects the user after a successful form submission.                      |
| _getAccessTab                 | none                      | YpConfigTabData | Returns the configuration data for the access tab.                          |
| _groupAccessChanged           | event: CustomEvent        | void        | Handles changes to the group access level.                                  |
| _statusSelected               | event: CustomEvent        | void        | Handles selection of a new status.                                          |
| _getThemeTab                  | none                      | YpConfigTabData | Returns the configuration data for the theme settings tab.                  |
| _inheritThemeChanged          | event: CustomEvent        | void        | Handles changes to the inherit theme setting.                               |
| _themeChanged                 | event: CustomEvent        | void        | Handles changes to the theme.                                               |
| _getPostSettingsTab           | none                      | YpConfigTabData \| null | Returns the configuration data for the post settings tab, if applicable.   |
| _defaultDataImageUploaded     | event: CustomEvent        | void        | Handles the event when a default data image is uploaded.                    |
| _defaultPostImageUploaded     | event: CustomEvent        | void        | Handles the event when a default post image is uploaded.                    |
| _haveUploadedDocxSurvey       | event: CustomEvent        | void        | Handles the event when a DOCX survey is uploaded and converted to JSON.     |
| _getVoteSettingsTab           | none                      | YpConfigTabData | Returns the configuration data for the vote settings tab.                  |
| _endorsementButtonsSelected   | event: CustomEvent        | void        | Handles selection of endorsement buttons.                                   |
| _customRatingsTextChanged     | event: CustomEvent        | void        | Handles changes to custom ratings text.                                     |
| _getPointSettingsTab          | none                      | YpConfigTabData | Returns the configuration data for the point settings tab.                  |
| _getAdditionalConfigTab       | none                      | YpConfigTabData | Returns the configuration data for the additional group config tab.        |
| _categorySelected             | event: CustomEvent        | void        | Handles category selection.                                                 |
| _categoryImageSrc             | category: any             | string      | Returns the image source URL for the category icon.                         |
| _welcomePageSelected          | event: CustomEvent        | void        | Handles selection of a welcome page.                                        |
| _isDataVisualizationGroupClick| event: CustomEvent        | void        | Handles click event for isDataVisualizationGroup checkbox.                  |
| _dataForVisualizationChanged  | event: CustomEvent        | void        | Handles change event for dataForVisualization textarea.                     |
| _moveGroupToSelected          | event: CustomEvent        | void        | Handles selection of a target group to move the current group to.           |
| setupConfigTabs               | none                      | Array<YpConfigTabData> | Sets up the configuration tabs for the UI.                                 |
| _appHomeScreenIconImageUploaded| event: CustomEvent       | void        | Handles the event when an app home screen icon image is uploaded.           |

## Events

- **yp-theme-color**: Emitted when a new theme color is detected from an image.
- **loaded**: Emitted when an image is successfully loaded.

## Examples

```typescript
// Example usage of the YpAdminConfigGroup class
const configGroup = new YpAdminConfigGroup();
configGroup.group = {
  id: 1,
  name: "My Group",
  description: "A group for discussion",
  access: 0,
  status: "active",
  configuration: {
    groupType: 0,
    canVote: true,
    canAddNewPosts: true
  }
};
configGroup.connectedCallback();
```

Note: The above example is a simplified usage scenario. In a real-world application, the `YpAdminConfigGroup` class would be used as part of a larger system, typically involving user interactions through a web interface.