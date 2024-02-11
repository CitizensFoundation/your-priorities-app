# YpAdminConfigBase

Abstract class that extends `YpAdminPage` and provides functionality for admin configuration pages.

## Properties

| Name                  | Type                          | Description                                                                 |
|-----------------------|-------------------------------|-----------------------------------------------------------------------------|
| configTabs            | Array<YpConfigTabData>        | Array of configuration tabs.                                                |
| selectedTab           | Number                        | Index of the currently selected tab.                                        |
| configChanged         | Boolean                       | Flag indicating if the configuration has changed.                           |
| method                | String                        | HTTP method for form submission (POST or PUT).                              |
| currentLogoImages     | Array<YpImageData>            | Array of current logo images.                                               |
| collectionVideoId     | Number                        | ID of the collection's video.                                               |
| action                | String                        | Form action URL.                                                            |
| subRoute              | String                        | Sub-route for the configuration.                                            |
| hasVideoUpload        | Boolean                       | Flag indicating if video upload is available.                               |
| status                | String                        | Status of the collection.                                                   |
| hasAudioUpload        | Boolean                       | Flag indicating if audio upload is available.                               |
| uploadedLogoImageId   | Number                        | ID of the uploaded logo image.                                              |
| uploadedHeaderImageId | Number                        | ID of the uploaded header image.                                            |
| uploadedVideoId       | Number                        | ID of the uploaded video.                                                   |
| editHeaderText        | String                        | Text for the edit header.                                                   |
| toastText             | String                        | Text for the toast message.                                                 |
| saveText              | String                        | Text for the save button.                                                   |
| imagePreviewUrl       | String                        | URL for the image preview.                                                  |
| themeId               | Number                        | ID of the theme.                                                            |
| translatedPages       | Array<YpHelpPageData>         | Array of translated help pages.                                             |
| descriptionMaxLength  | Number                        | Maximum length for the description.                                         |
| tabsHidden            | Boolean                       | Flag indicating if tabs should be hidden.                                   |
| parentCollectionId    | Number                        | ID of the parent collection.                                                |
| parentCollection      | YpCollectionData              | Data of the parent collection.                                              |
| gettingImageColor     | Boolean                       | Flag indicating if the image color is being retrieved.                      |
| detectedThemeColor    | String                        | Detected theme color from the image.                                        |

## Methods

| Name                  | Parameters                    | Return Type | Description                                                                 |
|-----------------------|-------------------------------|-------------|-----------------------------------------------------------------------------|
| setupConfigTabs       | None                          | Array       | Abstract method to set up configuration tabs.                               |
| renderHeader          | None                          | TemplateResult | Abstract method to render the header.                                      |
| renderHiddenInputs    | None                          | TemplateResult | Abstract method to render hidden input fields.                             |
| _formResponse         | event: CustomEvent            | void        | Handles form response event.                                               |
| _selectTab            | event: CustomEvent            | void        | Handles tab selection event.                                               |
| getColorFromLogo      | None                          | Promise     | Retrieves color from the logo image.                                       |
| _updateCollection     | event: CustomEvent            | void        | Updates the collection with event details.                                 |
| _logoImageUploaded    | event: CustomEvent            | void        | Handles logo image upload event.                                           |
| _headerImageUploaded  | event: CustomEvent            | void        | Handles header image upload event.                                         |
| _statusSelected       | event: CustomEvent            | void        | Handles status selection event.                                            |
| _ltpConfigChanged     | event: CustomEvent            | void        | Handles LTP configuration change event.                                    |
| tabsPostSetup         | tabs: Array<YpConfigTabData>  | void        | Post-setup for tabs, can be overridden in child class.                     |
| _themeChanged         | event: CustomEvent            | void        | Handles theme change event.                                                |
| renderSaveButton      | None                          | TemplateResult | Renders the save button.                                                  |
| renderTabs            | None                          | TemplateResult | Renders the tabs.                                                         |
| renderTabPages        | None                          | TemplateResult | Renders the tab pages.                                                    |
| _generateLogo         | event: CustomEvent            | void        | Handles logo generation event.                                             |
| renderTabPage         | configItems: Array<YpStructuredConfigData>, itemIndex: Number | TemplateResult | Renders a tab page. |
| renderCoverMediaContent | None                        | TemplateResult | Renders the cover media content.                                          |
| renderLogoMedia       | None                          | TemplateResult | Renders the logo media section.                                           |
| renderHeaderImageUploads | None                        | TemplateResult | Renders the header image uploads section.                                 |
| renderVideoUpload     | None                          | TemplateResult | Renders the video upload section.                                         |
| renderNameAndDescription | hideDescription: Boolean   | TemplateResult | Renders the name and description fields.                                  |
| _descriptionChanged   | event: CustomEvent            | void        | Handles description change event.                                         |
| _save                 | event: CustomEvent            | Promise     | Saves the configuration.                                                  |
| _showErrorDialog      | errorText: String             | void        | Shows an error dialog.                                                    |
| _configChanged        | None                          | void        | Sets the configChanged flag to true.                                      |
| _videoUploaded        | event: CustomEvent            | void        | Handles video upload event.                                               |
| _getSaveCollectionPath | path: String                  | Any         | Retrieves a value from the collection based on the given path.             |
| _clear                | None                          | void        | Clears the configuration.                                                 |

## Events

- **yp-theme-color-detected**: Emitted when a new theme color is detected from the image.
- **yp-refresh-domain**: Emitted when the domain needs to be refreshed.
- **yp-refresh-community**: Emitted when the community needs to be refreshed.
- **yp-refresh-group**: Emitted when the group needs to be refreshed.
- **yp-error**: Emitted when there is an error in the form.

## Examples

```typescript
// Example usage of the class is not provided as it is an abstract class and should be extended to implement specific functionality.
```

Note: This documentation is based on the provided TypeScript class and may not cover all properties, methods, and events if they are not used or visible in the provided code.