# YpAdminConfigBase

The `YpAdminConfigBase` is an abstract class extending `YpAdminPage` designed to manage and render configuration settings for administrative pages. It provides a structured way to handle configuration tabs, media uploads, and form submissions.

## Properties

| Name                        | Type                              | Description                                                                 |
|-----------------------------|-----------------------------------|-----------------------------------------------------------------------------|
| configTabs                  | Array<YpConfigTabData> \| undefined | Configuration tabs data.                                                    |
| selectedTab                 | Number                            | Index of the currently selected tab.                                        |
| configChanged               | Boolean                           | Indicates if the configuration has been changed.                            |
| method                      | String                            | HTTP method for form submission, default is "POST".                         |
| currentLogoImages           | Array<YpImageData> \| undefined   | Current logo images data.                                                   |
| currentHeaderImages         | Array<YpImageData> \| undefined   | Current header images data.                                                 |
| collectionVideoId           | Number \| undefined               | ID of the collection video.                                                 |
| generatingAiImageInBackground | Boolean                         | Indicates if AI image generation is in progress in the background.          |
| action                      | String \| undefined               | Form action URL.                                                            |
| subRoute                    | String \| undefined               | Sub-route for navigation.                                                   |
| hasVideoUpload              | Boolean                           | Indicates if video upload is enabled.                                       |
| status                      | String \| undefined               | Current status of the collection.                                           |
| hasAudioUpload              | Boolean                           | Indicates if audio upload is enabled.                                       |
| uploadedLogoImageId         | Number \| undefined               | ID of the uploaded logo image.                                              |
| uploadedHeaderImageId       | Number \| undefined               | ID of the uploaded header image.                                            |
| uploadedVideoId             | Number \| undefined               | ID of the uploaded video.                                                   |
| connectedVideoToCollection  | Boolean                           | Indicates if the video is connected to the collection.                      |
| editHeaderText              | String \| undefined               | Text for editing header.                                                    |
| toastText                   | String \| undefined               | Text for toast notifications.                                               |
| saveText                    | String \| undefined               | Text for the save button.                                                   |
| imagePreviewUrl             | String \| undefined               | URL for the image preview.                                                  |
| videoPreviewUrl             | String \| undefined               | URL for the video preview.                                                  |
| themeId                     | Number \| undefined               | ID of the theme.                                                            |
| translatedPages             | Array<YpHelpPageData> \| undefined | Translated help pages data.                                                 |
| descriptionMaxLength        | Number                            | Maximum length for the description, default is 300.                         |
| tabsHidden                  | Boolean                           | Indicates if tabs are hidden.                                               |
| parentCollectionId          | Number \| undefined               | ID of the parent collection.                                                |
| parentCollection            | YpCollectionData \| undefined     | Data of the parent collection.                                              |
| nameInput                   | HTMLInputElement                  | Reference to the name input element.                                        |
| descriptionInput            | HTMLInputElement                  | Reference to the description input element.                                 |
| gettingImageColor           | Boolean                           | Indicates if the image color is being retrieved.                            |
| imageIdsUploadedByUser      | Array<number>                     | List of image IDs uploaded by the user.                                     |
| videoIdsUploadedByUser      | Array<number>                     | List of video IDs uploaded by the user.                                     |
| detectedThemeColor          | String \| undefined               | Detected theme color from the image.                                        |

## Methods

| Name                          | Parameters                                                                 | Return Type  | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------------|--------------|-----------------------------------------------------------------------------|
| setupConfigTabs               | None                                                                       | Array<YpConfigTabData> | Abstract method to setup configuration tabs.                                |
| renderHeader                  | None                                                                       | TemplateResult \| {} | Abstract method to render the header.                                       |
| renderHiddenInputs            | None                                                                       | TemplateResult \| {} | Abstract method to render hidden inputs.                                    |
| _formResponse                 | event: CustomEvent                                                         | Promise<void> | Handles form response events.                                               |
| _selectTab                    | event: CustomEvent                                                         | void         | Handles tab selection events.                                               |
| getColorFromLogo              | None                                                                       | Promise<void> | Retrieves the theme color from the logo image.                              |
| _updateCollection             | event: CustomEvent                                                         | void         | Updates the collection data.                                                |
| connectedCallback             | None                                                                       | void         | Lifecycle method called when the element is added to the document.          |
| disconnectedCallback          | None                                                                       | void         | Lifecycle method called when the element is removed from the document.      |
| _logoImageUploaded            | event: CustomEvent                                                         | void         | Handles logo image upload success events.                                   |
| _headerImageUploaded          | event: CustomEvent                                                         | void         | Handles header image upload success events.                                 |
| _statusSelected               | event: CustomEvent                                                         | void         | Handles status selection events.                                            |
| statusIndex                   | None                                                                       | number       | Gets the index of the current status.                                       |
| collectionStatusOptions       | None                                                                       | Array<{name: string, translatedName: string}> | Gets the available collection status options.                               |
| _ltpConfigChanged             | event: CustomEvent                                                         | void         | Handles LTP configuration change events.                                    |
| tabsPostSetup                 | tabs: Array<YpConfigTabData>                                               | void         | Method to override in child class for additional tab setup.                 |
| disableSaveButtonForCollection | None                                                                      | boolean      | Determines if the save button should be disabled for the collection.        |
| _themeChanged                 | event: CustomEvent                                                         | void         | Handles theme change events.                                                |
| renderSaveButton              | None                                                                       | TemplateResult | Renders the save button.                                                    |
| renderTabs                    | None                                                                       | TemplateResult \| typeof nothing | Renders the configuration tabs.                                             |
| renderTabPages                | None                                                                       | TemplateResult | Renders the tab pages.                                                      |
| _generateLogo                 | event: CustomEvent                                                         | void         | Initiates the generation of a logo using AI.                                |
| renderTabPage                 | configItems: Array<YpStructuredConfigData>, itemIndex: number              | TemplateResult | Renders a single tab page.                                                  |
| collectionVideoURL            | None                                                                       | string \| undefined | Gets the URL of the collection video.                                       |
| collectionVideoPosterURL      | None                                                                       | string \| undefined | Gets the poster URL of the collection video.                                |
| collectionVideos              | None                                                                       | Array<YpVideoData> \| undefined | Gets the collection videos.                                                 |
| clearVideos                   | None                                                                       | void         | Clears the collection videos.                                               |
| clearHeaderImage              | None                                                                       | void         | Clears the header image.                                                    |
| clearImages                   | None                                                                       | void         | Clears the logo images.                                                     |
| renderCoverMediaContent       | None                                                                       | TemplateResult | Renders the cover media content.                                            |
| reallyDeleteCurrentLogoImage  | None                                                                       | Promise<void> | Deletes the current logo image.                                             |
| reallyDeleteCurrentHeaderImage | None                                                                      | Promise<void> | Deletes the current header image.                                           |
| reallyDeleteCurrentVideo      | None                                                                       | Promise<void> | Deletes the current video.                                                  |
| deleteCurrentLogoImage        | event: CustomEvent                                                         | void         | Initiates the deletion of the current logo image.                           |
| deleteCurrentHeaderImage      | event: CustomEvent                                                         | void         | Initiates the deletion of the current header image.                         |
| deleteCurrentVideo            | event: CustomEvent                                                         | void         | Initiates the deletion of the current video.                                |
| renderLogoMedia               | None                                                                       | TemplateResult | Renders the logo media section.                                             |
| renderHeaderImageUploads      | None                                                                       | TemplateResult | Renders the header image upload section.                                    |
| styles                        | None                                                                       | CSSResult[]  | Returns the styles for the component.                                       |
| _setVideoCover                | event: CustomEvent                                                         | void         | Sets the video cover option.                                                |
| renderNameAndDescription      | hideDescription: boolean = false                                           | TemplateResult | Renders the name and description fields.                                    |
| _descriptionChanged           | event: CustomEvent                                                         | void         | Handles changes to the description field.                                   |
| render                        | None                                                                       | TemplateResult | Renders the component.                                                      |
| _logoGeneratingInBackground   | event: CustomEvent                                                         | void         | Handles the event when logo generation is in progress in the background.    |
| _gotAiImage                   | event: CustomEvent                                                         | void         | Handles the event when an AI-generated image is received.                   |
| updated                       | changedProperties: Map<string \| number \| symbol, unknown>                | void         | Lifecycle method called when properties are updated.                        |
| _getHelpPages                 | collectionTypeOverride: string \| undefined, collectionIdOverride: number \| undefined | Promise<void> | Retrieves help pages for the collection.                                    |
| firstUpdated                  | _changedProperties: PropertyValueMap<any> \| Map<PropertyKey, unknown>     | void         | Lifecycle method called after the first update.                             |
| _getLocalizePageTitle         | page: YpHelpPageData                                                       | string       | Gets the localized title of a help page.                                    |
| beforeSave                    | None                                                                       | void         | Hook method called before saving the collection.                            |
| afterSave                     | None                                                                       | void         | Hook method called after saving the collection.                             |
| sendUpdateCollectionEvents    | None                                                                       | void         | Sends events to update the collection.                                      |
| _save                         | event: CustomEvent                                                         | Promise<void> | Saves the collection configuration.                                         |
| _showErrorDialog              | errorText: string                                                          | void         | Displays an error dialog.                                                   |
| _configChanged                | None                                                                       | void         | Marks the configuration as changed.                                         |
| _videoUploaded                | event: CustomEvent                                                         | void         | Handles video upload success events.                                        |
| _getSaveCollectionPath        | path: string                                                               | any          | Gets the value from the collection path.                                    |
| _clear                        | None                                                                       | void         | Clears the current collection data.                                         |
| _updateEmojiBindings          | None                                                                       | void         | Updates the emoji bindings for the description input.                       |
| _getCurrentValue              | question: YpStructuredQuestionData                                         | any          | Gets the current value for a structured question.                           |

## Events

- **yp-theme-color-detected**: Emitted when a new theme color is detected from the logo image.
- **yp-form-invalid**: Emitted when the form is invalid.
- **yp-error**: Emitted when an error occurs.
- **yp-refresh-domain**: Emitted to refresh the domain.
- **yp-refresh-community**: Emitted to refresh the community.
- **yp-refresh-group**: Emitted to refresh the group.

## Examples

```typescript
// Example usage of the YpAdminConfigBase class
class MyAdminConfig extends YpAdminConfigBase {
  setupConfigTabs() {
    // Implement setup for configuration tabs
  }

  renderHeader() {
    // Implement rendering of the header
  }

  renderHiddenInputs() {
    // Implement rendering of hidden inputs
  }
}
```