# YpAdminConfigBase

Abstract class for admin configuration pages in a web application.

## Properties

| Name                  | Type                          | Description                                                                 |
|-----------------------|-------------------------------|-----------------------------------------------------------------------------|
| configTabs            | Array<YpConfigTabData>        | The tabs to be displayed in the configuration page.                         |
| selectedTab           | Number                        | The index of the currently selected tab.                                    |
| configChanged         | Boolean                       | Flag indicating if the configuration has been changed.                      |
| method                | String                        | The HTTP method to be used when submitting the form.                        |
| currentLogoImages     | Array<YpImageData>            | The current logo images.                                                    |
| collectionVideoId     | Number                        | The ID of the video associated with the collection.                         |
| action                | String                        | The action URL for the form submission.                                     |
| subRoute              | String                        | The sub-route for the configuration page.                                   |
| hasVideoUpload        | Boolean                       | Flag indicating if video upload is supported.                               |
| hasAudioUpload        | Boolean                       | Flag indicating if audio upload is supported.                               |
| uploadedLogoImageId   | Number                        | The ID of the uploaded logo image.                                          |
| uploadedHeaderImageId | Number                        | The ID of the uploaded header image.                                        |
| uploadedVideoId       | Number                        | The ID of the uploaded video.                                               |
| editHeaderText        | String                        | The header text for the edit section.                                       |
| toastText             | String                        | The text to be displayed in a toast message.                                |
| saveText              | String                        | The text for the save button.                                               |
| imagePreviewUrl       | String                        | The URL for the image preview.                                              |
| themeId               | Number                        | The ID of the theme being used.                                             |
| translatedPages       | Array<YpHelpPageData>         | The translated help pages.                                                  |
| descriptionMaxLength  | Number                        | The maximum length for the description field.                               |
| tabsHidden            | Boolean                       | Flag indicating if tabs should be hidden.                                   |
| parentCollectionId    | Number                        | The ID of the parent collection.                                            |
| parentCollection      | YpCollectionData              | The parent collection data.                                                 |

## Methods

| Name                | Parameters | Return Type | Description                                                                 |
|---------------------|------------|-------------|-----------------------------------------------------------------------------|
| setupConfigTabs     |            | Array       | Abstract method to set up the configuration tabs.                           |
| renderHeader        |            | TemplateResult or {} | Abstract method to render the header of the configuration page. |
| renderHiddenInputs  |            | TemplateResult or {} | Abstract method to render hidden inputs in the form.            |
| _formResponse       | event: CustomEvent | void | Handles form response events.                                              |
| _selectTab          | event: CustomEvent | void | Handles tab selection events.                                              |
| _updateCollection   | event: CustomEvent | void | Updates the collection data.                                               |
| connectedCallback   |            | void       | Lifecycle callback for when the element is added to the DOM.                |
| disconnectedCallback|            | void       | Lifecycle callback for when the element is removed from the DOM.            |
| _logoImageUploaded  | event: CustomEvent | void | Handles logo image upload events.                                          |
| _headerImageUploaded| event: CustomEvent | void | Handles header image upload events.                                        |
| _ltpConfigChanged   | event: CustomEvent | void | Handles changes to the LTP configuration.                                  |
| tabsPostSetup       | tabs: Array<YpConfigTabData> | void | Post-setup processing for tabs. |
| renderSaveButton    |            | TemplateResult | Renders the save button.                                                   |
| renderTabs          |            | TemplateResult or nothing | Renders the tabs.                              |
| renderTabPages      |            | TemplateResult | Renders the content of the tab pages.                                      |
| _generateLogo       | event: CustomEvent | void | Handles logo generation events.                                            |
| renderTabPage       | configItems: Array<YpStructuredConfigData>, itemIndex: Number | TemplateResult | Renders a single tab page. |
| renderCoverMediaContent |      | TemplateResult | Renders the cover media content.                                           |
| renderLogoMedia     |            | TemplateResult | Renders the logo media section.                                            |
| renderHeaderImageUploads |      | TemplateResult | Renders the header image upload section.                                   |
| renderVideoUpload   |            | TemplateResult | Renders the video upload section.                                          |
| renderNameAndDescription | hideDescription: Boolean | TemplateResult | Renders the name and description fields. |
| _descriptionChanged | event: CustomEvent | void | Handles changes to the description field.                                  |
| render              |            | TemplateResult | Renders the component.                                                     |
| _gotAiImage         | event: CustomEvent | void | Handles events when an AI-generated image is received.                     |
| updated             | changedProperties: Map | void | Lifecycle callback for when the element's properties have changed.         |
| _getHelpPages       | collectionTypeOverride: String, collectionIdOverride: Number | Promise | Retrieves help pages. |
| _getLocalizePageTitle | page: YpHelpPageData | String | Gets the localized title of a help page.                                   |
| beforeSave          |            | void       | Hook for actions to perform before saving.                                  |
| sendUpdateCollectionEvents |    | void       | Sends events to update the collection.                                     |
| _save               | event: CustomEvent | Promise | Saves the configuration.                                                   |
| _showErrorDialog    | errorText: String | void | Displays an error dialog.                                                  |
| _configChanged      |            | void       | Marks the configuration as changed.                                        |
| _videoUploaded      | event: CustomEvent | void | Handles video upload events.                                               |
| _getSaveCollectionPath | path: String | any | Retrieves a value from the collection's path.                              |
| _clear              |            | void       | Clears the form and resets properties.                                     |

## Events

- **yp-has-video-upload**: Emitted when video upload is available.
- **yp-has-audio-upload**: Emitted when audio upload is available.
- **yp-form-response**: Emitted when the form responds.
- **yp-updated-collection**: Emitted when the collection is updated.

## Examples

```typescript
// Example usage of the YpAdminConfigBase class
@customElement('yp-admin-config')
class YpAdminConfig extends YpAdminConfigBase {
  // Implement abstract methods and properties
}
```

Note: The provided TypeScript code is an abstract class and cannot be instantiated directly. It is meant to be extended by concrete classes that implement the abstract methods and properties.