# YpAdminConfigBase

An abstract base class for admin configuration pages, extending `YpAdminPage`. It provides a comprehensive set of properties and methods for managing configuration tabs, media uploads (images, videos), AI image generation, tabbed forms, and collection data for domains, communities, and groups. This class is designed to be extended by specific admin configuration implementations.

## Properties

| Name                        | Type                                         | Description                                                                                  |
|-----------------------------|----------------------------------------------|----------------------------------------------------------------------------------------------|
| configTabs                  | Array<YpConfigTabData> \| undefined          | The configuration tabs to display.                                                           |
| selectedTab                 | number                                       | The currently selected tab index.                                                            |
| configChanged               | boolean                                      | Indicates if the configuration has changed.                                                  |
| method                      | string                                       | HTTP method for form submission ("POST" or "PUT").                                           |
| currentLogoImages           | YpImageData[] \| undefined                   | The current logo images for the collection.                                                  |
| currentHeaderImages         | YpImageData[] \| undefined                   | The current header images for the collection.                                                |
| collectionVideoId           | number \| undefined                          | The ID of the current collection video.                                                      |
| generatingAiImageInBackground| boolean                                     | Whether AI image generation is running in the background.                                    |
| action                      | string \| undefined                          | The form action URL.                                                                         |
| subRoute                    | string \| undefined                          | The sub-route for the page.                                                                  |
| hasVideoUpload              | boolean                                      | Whether video upload is enabled.                                                             |
| status                      | string \| undefined                          | The current status of the collection.                                                        |
| hasAudioUpload              | boolean                                      | Whether audio upload is enabled.                                                             |
| uploadedLogoImageId         | number \| undefined                          | The ID of the uploaded logo image.                                                           |
| uploadedHeaderImageId       | number \| undefined                          | The ID of the uploaded header image.                                                         |
| uploadedVideoId             | number \| undefined                          | The ID of the uploaded video.                                                                |
| connectedVideoToCollection  | boolean                                      | Whether the video is connected to the collection.                                            |
| editHeaderText              | string \| undefined                          | The text for editing the header.                                                             |
| toastText                   | string \| undefined                          | The text for toast notifications.                                                            |
| saveText                    | string \| undefined                          | The text for the save button.                                                                |
| imagePreviewUrl             | string \| undefined                          | The preview URL for the image.                                                               |
| videoPreviewUrl             | string \| undefined                          | The preview URL for the video.                                                               |
| themeId                     | number \| undefined                          | The ID of the selected theme.                                                                |
| translatedPages             | Array<YpHelpPageData> \| undefined           | The translated help pages for the collection.                                                |
| descriptionMaxLength        | number                                       | The maximum length for the description field.                                                |
| tabsHidden                  | boolean                                      | Whether the tabs are hidden.                                                                 |
| parentCollectionId          | number \| undefined                          | The ID of the parent collection.                                                             |
| parentCollection            | YpCollectionData \| undefined                | The parent collection data.                                                                  |
| nameInput                   | HTMLInputElement                             | Reference to the name input element.                                                         |
| descriptionInput            | HTMLInputElement                             | Reference to the description input element.                                                  |
| gettingImageColor           | boolean                                      | Whether the image color is being extracted.                                                  |
| imageIdsUploadedByUser      | number[]                                     | IDs of images uploaded by the user.                                                          |
| videoIdsUploadedByUser      | number[]                                     | IDs of videos uploaded by the user.                                                          |
| detectedThemeColor          | string \| undefined                          | The detected theme color from the logo image.                                                |

## Methods

| Name                              | Parameters                                                                 | Return Type                | Description                                                                                      |
|----------------------------------- |---------------------------------------------------------------------------|----------------------------|--------------------------------------------------------------------------------------------------|
| setupConfigTabs (abstract)         | none                                                                      | Array<YpConfigTabData>     | Abstract method to set up configuration tabs. Must be implemented by subclasses.                 |
| renderHeader (abstract)            | none                                                                      | TemplateResult \| {}       | Abstract method to render the header. Must be implemented by subclasses.                         |
| renderHiddenInputs (abstract)      | none                                                                      | TemplateResult \| {}       | Abstract method to render hidden inputs. Must be implemented by subclasses.                      |
| _formResponse                      | event: CustomEvent                                                        | Promise<void>              | Handles form response events.                                                                    |
| _selectTab                         | event: CustomEvent                                                        | void                       | Handles tab selection changes.                                                                   |
| getColorFromLogo                   | none                                                                      | Promise<void>              | Extracts the theme color from the logo image.                                                    |
| _updateCollection                  | event: CustomEvent                                                        | void                       | Updates the collection data from an event.                                                       |
| connectedCallback (override)       | none                                                                      | void                       | Lifecycle method called when the element is added to the DOM.                                    |
| disconnectedCallback (override)    | none                                                                      | void                       | Lifecycle method called when the element is removed from the DOM.                                |
| _logoImageUploaded                 | event: CustomEvent                                                        | void                       | Handles successful logo image upload.                                                            |
| _headerImageUploaded               | event: CustomEvent                                                        | void                       | Handles successful header image upload.                                                          |
| _statusSelected                    | event: CustomEvent                                                        | void                       | Handles status selection changes.                                                                |
| statusIndex (getter)               | none                                                                      | number                     | Gets the index of the current status in the status options.                                      |
| collectionStatusOptions (getter)   | none                                                                      | Array<{name: string, translatedName: string}> | Gets the available status options for the collection.                                            |
| _ltpConfigChanged                  | event: CustomEvent                                                        | void                       | Handles changes to LTP configuration.                                                            |
| tabsPostSetup                      | tabs: Array<YpConfigTabData>                                              | void                       | Hook for post-setup of tabs, can be overridden in subclasses.                                    |
| disableSaveButtonForCollection (getter) | none                                                                 | boolean                    | Determines if the save button should be disabled for the collection.                             |
| _themeChanged                      | event: CustomEvent                                                        | void                       | Handles theme changes.                                                                           |
| renderSaveButton                   | none                                                                      | TemplateResult             | Renders the save button and progress spinner.                                                    |
| renderTabs                         | none                                                                      | TemplateResult \| typeof nothing | Renders the configuration tabs.                                                            |
| renderTabPages                     | none                                                                      | TemplateResult \| typeof nothing | Renders the tab pages.                                                                     |
| _generateLogo                      | event: CustomEvent                                                        | void                       | Initiates AI logo image generation.                                                              |
| renderTabPage                      | configItems: Array<YpStructuredConfigData>, itemIndex: number             | TemplateResult             | Renders a single tab page with its configuration items.                                          |
| collectionVideoURL (getter)        | none                                                                      | string \| undefined        | Gets the URL of the collection video.                                                            |
| collectionVideoPosterURL (getter)  | none                                                                      | string \| undefined        | Gets the poster URL for the collection video.                                                    |
| collectionVideos (getter)          | none                                                                      | Array<YpVideoData> \| undefined | Gets the videos for the collection based on its type.                                       |
| clearVideos                        | none                                                                      | void                       | Clears the collection's videos.                                                                  |
| clearHeaderImage                   | none                                                                      | void                       | Clears the collection's header images.                                                           |
| clearImages                        | none                                                                      | void                       | Clears the collection's logo images.                                                             |
| renderCoverMediaContent            | none                                                                      | TemplateResult             | Renders the main cover media content (image, video, or welcome HTML).                            |
| reallyDeleteCurrentLogoImage       | none                                                                      | Promise<void>              | Deletes the current logo image from the server and clears it.                                    |
| reallyDeleteCurrentHeaderImage     | none                                                                      | Promise<void>              | Deletes the current header image from the server and clears it.                                  |
| reallyDeleteCurrentVideo           | none                                                                      | Promise<void>              | Deletes the current video from the server and clears it.                                         |
| deleteCurrentLogoImage             | event: CustomEvent                                                        | void                       | Prompts for confirmation and deletes the current logo image.                                     |
| deleteCurrentHeaderImage           | event: CustomEvent                                                        | void                       | Prompts for confirmation and deletes the current header image.                                   |
| deleteCurrentVideo                 | event: CustomEvent                                                        | void                       | Prompts for confirmation and deletes the current video.                                          |
| renderLogoMedia                    | none                                                                      | TemplateResult             | Renders the logo media upload and management UI.                                                 |
| renderHeaderImageUploads           | none                                                                      | TemplateResult             | Renders the header image upload and management UI.                                               |
| styles (static, override)          | none                                                                      | CSSResultGroup[]           | Returns the styles for the component.                                                            |
| _setVideoCover                     | event: CustomEvent                                                        | void                       | Toggles the use of video as cover.                                                               |
| renderNameAndDescription           | hideDescription?: boolean                                                 | TemplateResult             | Renders the name and description input fields.                                                   |
| _descriptionChanged                | event: CustomEvent                                                        | void                       | Handles changes to the description field and adjusts max length for URLs.                        |
| renderTemplatesDialog              | none                                                                      | TemplateResult             | Renders the templates dialog (empty by default).                                                 |
| render (override)                  | none                                                                      | TemplateResult \| typeof nothing | Renders the main component UI.                                                            |
| _logoGeneratingInBackground        | event: CustomEvent                                                        | void                       | Handles the start of AI image generation in the background.                                      |
| _gotAiImage                        | event: CustomEvent                                                        | void                       | Handles the result of AI image generation.                                                       |
| updated (override)                 | changedProperties: Map<string \| number \| symbol, unknown>               | void                       | Lifecycle method called after properties are updated.                                            |
| _getHelpPages                      | collectionTypeOverride?: string, collectionIdOverride?: number            | Promise<void>              | Loads help pages for the collection.                                                             |
| firstUpdated (override)            | _changedProperties: PropertyValueMap<any> \| Map<PropertyKey, unknown>    | void                       | Lifecycle method called after the first update.                                                  |
| _getLocalizePageTitle              | page: YpHelpPageData                                                      | string                     | Gets the localized title for a help page.                                                        |
| beforeSave                         | none                                                                      | void                       | Hook called before saving, can be overridden.                                                    |
| afterSave                          | none                                                                      | void                       | Hook called after saving, can be overridden.                                                     |
| sendUpdateCollectionEvents         | none                                                                      | void                       | Fires global events to update the collection in the app.                                         |
| _save                              | event: CustomEvent                                                        | Promise<void>              | Handles the save action for the form.                                                            |
| _showErrorDialog                   | errorText: string                                                         | void                       | Shows an error dialog with the given text.                                                       |
| _configChanged                     | none                                                                      | void                       | Marks the configuration as changed and requests an update.                                       |
| _videoUploaded                     | event: CustomEvent                                                        | void                       | Handles successful video upload.                                                                 |
| _getSaveCollectionPath             | path: string                                                              | any                        | Gets a value from the collection using a path string.                                            |
| _clear                             | none                                                                      | void                       | Clears the form and resets all media and collection references.                                  |
| _updateEmojiBindings               | none                                                                      | void                       | Binds the emoji selector to the description input.                                               |
| _getCurrentValue                   | question: YpStructuredQuestionData                                        | any                        | Gets the current value for a structured question from the collection configuration.              |

## Examples

```typescript
// Example subclass implementation
class MyAdminConfigPage extends YpAdminConfigBase {
  setupConfigTabs() {
    return [
      { name: "General", icon: "settings", items: [] },
      { name: "Media", icon: "image", items: [] }
    ];
  }

  renderHeader() {
    return html`<h2>My Admin Config</h2>`;
  }

  renderHiddenInputs() {
    return html``;
  }
}
```
