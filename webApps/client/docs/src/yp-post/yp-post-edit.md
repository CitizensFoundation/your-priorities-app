# YpPostEdit

This class represents a custom element for editing posts within a web application. It extends from `YpEditBase` and is decorated with `@customElement("yp-post-edit")`.

## Properties

| Name                          | Type                                             | Description                                                                 |
|-------------------------------|--------------------------------------------------|-----------------------------------------------------------------------------|
| action                        | String                                           | The action URL for the form submission.                                     |
| newPost                       | Boolean                                          | Indicates if the post being edited is a new post.                           |
| selectedCategoryArrayId       | Number \| undefined                              | The selected category's array index.                                        |
| initialStructuredAnswersJson  | Array<YpStructuredAnswer> \| undefined          | Initial JSON structured answers.                                            |
| structuredQuestions           | Array<YpStructuredQuestionData> \| undefined     | Array of structured questions.                                              |
| post                          | YpPostData \| undefined                          | The post data being edited.                                                 |
| group                         | YpGroupData \| undefined                         | The group data associated with the post.                                    |
| saveSurveyAnswers             | Boolean                                          | Flag to determine if survey answers should be saved.                        |
| skipIfSavedSurveyAnswers      | Boolean                                          | Flag to skip saving survey answers if they are already saved.               |
| locationHidden                | Boolean                                          | Flag to hide the location input.                                            |
| location                      | YpLocationData \| undefined                     | The location data associated with the post.                                 |
| encodedLocation               | String \| undefined                              | The encoded location data.                                                  |
| selectedCategoryId            | Number \| undefined                              | The selected category ID.                                                   |
| uploadedVideoId               | Number \| undefined                              | The ID of the uploaded video.                                               |
| uploadedAudioId               | Number \| undefined                              | The ID of the uploaded audio.                                               |
| currentVideoId                | Number \| undefined                              | The ID of the current video.                                                |
| currentAudioId                | Number \| undefined                              | The ID of the current audio.                                                |
| selected                      | Number                                           | The index of the selected tab.                                              |
| mapActive                     | Boolean                                          | Flag to indicate if the map is active.                                      |
| hasOnlyOneTab                 | Boolean                                          | Flag to indicate if there is only one tab.                                  |
| postDescriptionLimit          | Number \| undefined                              | The character limit for the post description.                               |
| sructuredAnswersString        | String \| undefined                              | The structured answers as a string.                                         |
| structuredAnswersJson         | String                                           | The structured answers as a JSON string.                                    |
| structuredAnswersString       | String                                           | The structured answers as a string.                                         |
| translatedQuestions           | Array<YpStructuredQuestionData> \| undefined     | Array of translated structured questions.                                   |
| autoTranslate                 | Boolean                                          | Flag to enable automatic translation.                                       |
| uploadedDocumentUrl           | String \| undefined                              | The URL of the uploaded document.                                           |
| uploadedDocumentFilename      | String \| undefined                              | The filename of the uploaded document.                                      |
| selectedCoverMediaType        | String                                           | The selected type of cover media.                                           |
| uploadedHeaderImageId         | Number \| undefined                              | The ID of the uploaded header image.                                        |
| customTitleQuestionText       | String \| undefined                              | Custom text for the title question.                                         |
| emailValidationPattern        | String                                           | The regex pattern for email validation.                                     |
| liveQuestionIds               | Array<Number>                                    | Array of live question IDs.                                                 |
| uniqueIdsToElementIndexes     | Record<String, Number>                           | Mapping of unique IDs to element indexes.                                   |
| liveUniqueIds                 | Array<String>                                    | Array of live unique IDs.                                                   |

## Methods

| Name                          | Parameters                                      | Return Type | Description                                                                 |
|-------------------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| updated                       | changedProperties: Map<String \| Number \| Symbol, unknown> | void        | Lifecycle method called after the element’s properties have changed.        |
| customValidation              |                                                 | Boolean     | Custom validation logic for the form.                                       |
| _getTranslationsIfNeeded      |                                                 | Promise<void> | Retrieves translations if needed.                                           |
| _groupChanged                 |                                                 | void        | Called when the group property changes.                                     |
| _generateLogo                 | event: CustomEvent                              | void        | Generates a logo based on the name and description.                         |
| static override get styles    |                                                 | Array       | Returns the styles for the element.                                         |
| _setSelectedTab               | event: CustomEvent                              | void        | Sets the selected tab based on the event.                                   |
| renderTabs                    |                                                 | TemplateResult | Renders the tabs for the element.                                           |
| renderMoreContactInfo         |                                                 | TemplateResult | Renders additional contact information fields.                             |
| titleQuestionText             |                                                 | String      | Returns the text for the title question.                                    |
| renderDescriptionTab          |                                                 | TemplateResult | Renders the description tab content.                                        |
| renderPointTab                |                                                 | TemplateResult | Renders the point tab content.                                              |
| renderLocationTab             |                                                 | TemplateResult | Renders the location tab content.                                           |
| renderCoverMediaSelection     |                                                 | TemplateResult | Renders the cover media selection options.                                  |
| renderMediaTab                |                                                 | TemplateResult | Renders the media tab content.                                              |
| _setSelectedCoverMediaType    | event: CustomEvent                              | void        | Sets the selected cover media type based on the event.                      |
| _pointPageHidden              |                                                 | Boolean     | Returns whether the point page should be hidden.                            |
| _mediaPageHidden              |                                                 | Boolean     | Returns whether the media page should be hidden.                            |
| renderCurrentTabPage          |                                                 | TemplateResult \| undefined \| {} | Renders the content of the currently selected tab.                          |
| renderHiddenInputs            |                                                 | TemplateResult | Renders hidden input fields for the form.                                   |
| override render               |                                                 | TemplateResult | Renders the element.                                                        |
| _gotAiImage                   | event: CustomEvent                              | void        | Handles the event when an AI-generated image is received.                   |
| _alternativeTextForNewIdeaSaveButtonTranslation |                     | void        | Updates the save button text with a new translation.                        |
| _updatePostTitle              |                                                 | void        | Updates the post title with a new translation.                              |
| connectedCallback             |                                                 | void        | Lifecycle method called when the element is added to the document’s DOM.    |
| disconnectedCallback          |                                                 | void        | Lifecycle method called when the element is removed from the document’s DOM. |
| hasLongSaveText               |                                                 | Boolean     | Checks if the save text is longer than 9 characters.                        |
| _autoTranslateEvent           | event: CustomEvent                              | void        | Handles the auto-translate event.                                           |
| _isLastRating                 | index: Number                                   | Boolean     | Checks if the current question is the last rating question.                 |
| _isFirstRating                | index: Number                                   | Boolean     | Checks if the current question is the first rating question.                |
| _openToId                     | event: CustomEvent                              | void        | Scrolls to the specified ID.                                                |
| _goToNextIndex                | event: CustomEvent                              | void        | Scrolls to the next index.                                                  |
| _skipToId                     | event: CustomEvent, showItems: Boolean          | void        | Skips to the specified ID.                                                  |
| _skipToWithHideId             | event: CustomEvent, showItems: Boolean          | void        | Skips to the specified ID with hiding items.                               |
| replacedName                  |                                                 | String \| null | Returns the replaced name for the post.                                     |
| pointMaxLength                |                                                 | Number      | Returns the maximum length for the point field.                             |
| _floatIfValueOrIE             | value: Boolean                                  | Boolean     | Floats the element if the value is true or if the browser is IE11.          |
| newPointShown                 |                                                 | Boolean     | Checks if the new point section should be shown.                            |
| _submitWithStructuredQuestionsJson |                                         | void        | Submits the form with structured questions in JSON format.                  |
| _submitWithStructuredQuestionsString |                                       | void        | Submits the form with structured questions as a string.                     |
| _customSubmit                 |                                                 | void        | Custom submit logic for the form.                                           |
| _resizeScrollerIfNeeded       |                                                 | void        | Resizes the scroller if needed.                                             |
| _getStructuredQuestionsString |                                                 | Array<YpStructuredQuestionData> | Returns structured questions as an array.                               |
| _setupStructuredQuestions     |                                                 | void        | Sets up the structured questions.                                           |
| _selectedCategory             | event: CustomEvent                              | void        | Sets the selected category based on the event.                              |
| _selectedCategoryChanged      |                                                 | void        | Called when the selected category changes.                                  |
| showCategories                |                                                 | Boolean     | Checks if categories should be shown.                                       |
| getPositionInArrayFromId      | collection: Array<YpCategoryData>, id: Number   | Number \| undefined | Returns the position in the array from the given ID.                        |
| _postChanged                  |                                                 | void        | Called when the post property changes.                                      |
| _updateInitialCategory        | group: YpGroupData                              | void        | Updates the initial category based on the group.                            |
| _imageUploaded                | event: CustomEvent                              | void        | Handles the event when an image is uploaded.                                |
| _redirectAfterVideo           | post: YpPostData                                | Promise<void> | Redirects after a video is uploaded.                                        |
| _redirectAfterAudio           | post: YpPostData                                | Promise<void> | Redirects after an audio is uploaded.                                       |
| surveyAnswerLocalstorageKey   |                                                 | String      | Returns the local storage key for survey answers.                           |
| saveSurveyAnswersToLocalStorage |                                             | void        | Saves survey answers to local storage.                                      |
| checkSurveyAnswers            |                                                 | void        | Checks if survey answers are available in local storage.                    |
| override customRedirect       | post: YpPostData                                | void        | Custom redirect logic after form submission.                                |
| _finishRedirect               | post: YpPostData                                | void        | Finishes the redirect process after form submission.                        |
| clear                         |                                                 | void        | Clears the form fields.                                                     |
| setup                         | post: YpPostData \| undefined, newItem: Boolean, refreshFunction: Function \| undefined, group: YpGroupData, params: any \| undefined | Promise<void> | Sets up the element for editing a post.                                      |
| _setupGroup                   | group: YpGroupData \| undefined                 | void        | Sets up the group data for the element.                                     |
| _videoUploaded                | event: CustomEvent                              | void        | Handles the event when a video is uploaded.                                 |
| _audioUploaded                | event: CustomEvent                              | void        | Handles the event when an audio is uploaded.                                |
| _documentUploaded             | event: CustomEvent                              | void        | Handles the event when a document is uploaded.                              |
| override customFormResponse   |                                                 | void        | Custom form response logic.                                                 |
| _updateEmojiBindings          |                                                 | void        | Updates emoji bindings for input fields.                                    |
| _locationHiddenChanged        |                                                 | void        | Called when the locationHidden property changes.                            |
| _formInvalid                  |                                                 | void        | Called when the form is invalid.                                            |
| _locationChanged              |                                                 | void        | Called when the location property changes.                                  |
| _uploadedHeaderImageIdChanged |                                                 | void        | Called when the uploadedHeaderImageId property changes.                     |
| _getTabLength                 |                                                 | Number      | Returns the number of tabs.                                                 |
| _nextTab                      |                                                 | void        | Moves to the next tab.                                                      |
| _selectedChanged              |                                                 | void        | Called when the selected property changes.                                  |
| showVideoCover                |                                                 | Boolean     | Checks if the video cover should be shown.                                  |
| showAudioCover                |                                                 | Boolean     | Checks if the audio cover should be shown.                                  |
| mediaHidden                   |                                                 | Boolean     | Checks if the media input should be hidden.                                 |
| override setupAfterOpen       | params: YpEditFormParams                        | void        | Sets up the element after it is opened.                                     |
| _alternativeTextForNewIdeaButtonHeaderTranslation |                         | void        | Updates the header text with a new translation.                             |
| setupTranslation              |                                                 | void        | Sets up translations for the element.                                       |

## Events

- **eventName**: Description of when and why the event is emitted.

## Examples

```typescript
// Example usage of the custom element
<yp-post-edit></yp-post-edit>
```

Note: The actual usage of this element would require setting up the necessary properties and handling events appropriately within the context of the web application.