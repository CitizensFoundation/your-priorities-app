# YpPostEdit

The `YpPostEdit` class is a web component that extends `YpEditBase` and provides functionality for editing or creating posts. It includes various properties and methods to handle form submission, media uploads, structured questions, and more.

## Properties

| Name                          | Type                                      | Description                                                                 |
|-------------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| action                        | string                                    | The form action URL for submitting the post.                                |
| newPost                       | boolean                                   | Indicates if the post is new.                                               |
| selectedCategoryArrayId       | number \| undefined                       | The selected category array index.                                          |
| initialStructuredAnswersJson  | Array<YpStructuredAnswer> \| undefined    | Initial structured answers in JSON format.                                  |
| structuredQuestions           | Array<YpStructuredQuestionData> \| undefined | Structured questions data.                                                  |
| post                          | YpPostData \| undefined                   | The post data being edited or created.                                      |
| group                         | YpGroupData \| undefined                  | The group data associated with the post.                                    |
| saveSurveyAnswers             | boolean                                   | Indicates if survey answers should be saved.                                |
| disableDialog                 | boolean                                   | Indicates if the dialog should be disabled.                                 |
| skipIfSavedSurveyAnswers      | boolean                                   | Indicates if the form should skip if survey answers are saved.              |
| locationHidden                | boolean                                   | Indicates if the location input is hidden.                                  |
| location                      | YpLocationData \| undefined               | The location data for the post.                                             |
| encodedLocation               | string \| undefined                       | The encoded location string.                                                |
| selectedCategoryId            | number \| undefined                       | The selected category ID.                                                   |
| uploadedVideoId               | number \| undefined                       | The ID of the uploaded video.                                               |
| uploadedAudioId               | number \| undefined                       | The ID of the uploaded audio.                                               |
| response                      | object \| undefined                       | The response object from form submission.                                   |
| errorText                     | string \| undefined                       | The error text to display in the dialog.                                    |
| currentVideoId                | number \| undefined                       | The current video ID.                                                       |
| currentAudioId                | number \| undefined                       | The current audio ID.                                                       |
| selected                      | number                                    | The index of the selected tab.                                              |
| mapActive                     | boolean                                   | Indicates if the map is active.                                             |
| hasOnlyOneTab                 | boolean                                   | Indicates if there is only one tab.                                         |
| postDescriptionLimit          | number \| undefined                       | The character limit for the post description.                               |
| sructuredAnswersString        | string \| undefined                       | The structured answers as a string.                                         |
| structuredAnswersJson         | string                                    | The structured answers in JSON format.                                      |
| structuredAnswersString       | string                                    | The structured answers as a string.                                         |
| translatedQuestions           | Array<YpStructuredQuestionData> \| undefined | Translated structured questions data.                                       |
| autoTranslate                 | boolean                                   | Indicates if auto-translation is enabled.                                   |
| submitDisabled                | boolean                                   | Indicates if the submit button is disabled.                                 |
| uploadedDocumentUrl           | string \| undefined                       | The URL of the uploaded document.                                           |
| uploadedVideoUrl              | string \| undefined                       | The URL of the uploaded video.                                              |
| uploadedDocumentFilename      | string \| undefined                       | The filename of the uploaded document.                                      |
| selectedCoverMediaType        | string                                    | The selected cover media type.                                              |
| uploadedHeaderImageId         | number \| undefined                       | The ID of the uploaded header image.                                        |
| customTitleQuestionText       | string \| undefined                       | Custom title question text.                                                 |
| formElement                   | YpForm \| undefined                       | The form element reference.                                                 |
| emailValidationPattern        | string                                    | The regex pattern for email validation.                                     |
| liveQuestionIds               | Array<number>                             | Array of live question IDs.                                                 |
| uniqueIdsToElementIndexes     | Record<string, number>                    | Mapping of unique IDs to element indexes.                                   |
| liveUniqueIds                 | Array<string>                             | Array of live unique IDs.                                                   |

## Methods

| Name                                 | Parameters                                                                 | Return Type | Description                                                                 |
|--------------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| updated                              | changedProperties: Map<string \| number \| symbol, unknown>                | void        | Called when the component is updated.                                       |
| _getQuestionLengthWithSubOptions     | questions: string \| any[]                                                 | number      | Calculates the length of questions with sub-options.                        |
| customValidation                     | none                                                                       | boolean     | Performs custom validation on the form.                                     |
| _getTranslationsIfNeeded             | none                                                                       | Promise<void> | Fetches translations if needed.                                             |
| _groupChanged                        | none                                                                       | void        | Handles changes to the group property.                                      |
| _generateLogo                        | event: CustomEvent                                                         | void        | Generates a logo using AI.                                                  |
| _setSelectedTab                      | event: CustomEvent                                                         | void        | Sets the selected tab index.                                                |
| renderMoreContactInfo                | none                                                                       | TemplateResult | Renders additional contact information fields.                              |
| titleQuestionText                    | none                                                                       | string      | Gets the title question text.                                               |
| renderCoverMediaContent              | none                                                                       | TemplateResult | Renders the cover media content.                                            |
| renderDescriptionInputs              | none                                                                       | TemplateResult | Renders the description input fields.                                       |
| renderPointTab                       | none                                                                       | TemplateResult | Renders the point tab content.                                              |
| renderLocationTab                    | none                                                                       | TemplateResult | Renders the location tab content.                                           |
| renderCoverMediaSelection            | none                                                                       | TemplateResult | Renders the cover media selection options.                                  |
| renderMediaTab                       | none                                                                       | TemplateResult | Renders the media tab content.                                              |
| _setSelectedCoverMediaType           | event: CustomEvent                                                         | void        | Sets the selected cover media type.                                         |
| _pointPageHidden                     | none                                                                       | boolean     | Determines if the point page is hidden.                                     |
| _mediaPageHidden                     | none                                                                       | boolean     | Determines if the media page is hidden.                                     |
| renderMediaAndLocation               | none                                                                       | TemplateResult | Renders the media and location content.                                     |
| renderHiddenInputs                   | none                                                                       | TemplateResult | Renders hidden input fields.                                                |
| renderClose                          | none                                                                       | TemplateResult | Renders the close button.                                                   |
| submit                               | validate: boolean                                                          | Promise<void> | Submits the form.                                                            |
| renderSaveButton                     | none                                                                       | TemplateResult | Renders the save button.                                                    |
| renderHeader                         | none                                                                       | TemplateResult | Renders the header content.                                                 |
| render                               | none                                                                       | TemplateResult | Renders the component.                                                      |
| _gotAiImage                          | event: CustomEvent                                                         | void        | Handles the event when an AI image is generated.                            |
| _alternativeTextForNewIdeaSaveButtonTranslation | none                                                                       | void        | Handles translation for the save button text.                               |
| _updatePostTitle                     | none                                                                       | void        | Updates the post title.                                                     |
| connectedCallback                    | none                                                                       | void        | Called when the component is connected to the DOM.                          |
| disconnectedCallback                 | none                                                                       | void        | Called when the component is disconnected from the DOM.                     |
| _formSubmitted                       | none                                                                       | void        | Handles form submission.                                                    |
| _formError                           | event: CustomEvent                                                         | void        | Handles form errors.                                                        |
| _showErrorDialog                     | errorText: string                                                          | void        | Shows an error dialog.                                                      |
| _clearErrorText                      | none                                                                       | void        | Clears the error text.                                                      |
| hasLongSaveText                      | none                                                                       | boolean     | Determines if the save text is long.                                        |
| _autoTranslateEvent                  | event: CustomEvent                                                         | void        | Handles auto-translate events.                                              |
| _isLastRating                        | index: number                                                              | boolean     | Determines if the question is the last rating question.                     |
| _isFirstRating                       | index: number                                                              | boolean     | Determines if the question is the first rating question.                    |
| _openToId                            | event: CustomEvent                                                         | void        | Opens to a specific ID.                                                     |
| _goToNextIndex                       | event: CustomEvent                                                         | void        | Goes to the next index.                                                     |
| _skipToId                            | event: CustomEvent, showItems: boolean                                     | void        | Skips to a specific ID.                                                     |
| _skipToWithHideId                    | event: CustomEvent, showItems: boolean                                     | void        | Skips to a specific ID with hiding.                                         |
| firstUpdated                         | none                                                                       | void        | Called after the first update.                                              |
| replacedName                         | none                                                                       | string \| null | Gets the replaced name.                                                     |
| pointMaxLength                       | none                                                                       | number      | Gets the maximum length for the point.                                      |
| _floatIfValueOrIE                    | value: boolean                                                             | boolean     | Determines if the value should be floated or if the browser is IE.          |
| newPointShown                        | none                                                                       | boolean     | Determines if the new point is shown.                                       |
| _submitWithStructuredQuestionsJson   | none                                                                       | void        | Submits the form with structured questions in JSON format.                  |
| _submitWithStructuredQuestionsString | none                                                                       | void        | Submits the form with structured questions as a string.                     |
| customSubmit                         | none                                                                       | void        | Custom submit handler.                                                      |
| _resizeScrollerIfNeeded              | none                                                                       | void        | Resizes the scroller if needed.                                             |
| _getStructuredQuestionsString        | none                                                                       | Array<YpStructuredQuestionData> | Gets the structured questions as a string.                                   |
| _setupStructuredQuestions            | none                                                                       | void        | Sets up the structured questions.                                           |
| showVideoCover                       | none                                                                       | boolean     | Determines if the video cover is shown.                                     |
| showAudioCover                       | none                                                                       | boolean     | Determines if the audio cover is shown.                                     |
| _videoUploaded                       | event: CustomEvent                                                         | void        | Handles video upload events.                                                |
| _audioUploaded                       | event: CustomEvent                                                         | void        | Handles audio upload events.                                                |
| _documentUploaded                    | event: CustomEvent                                                         | void        | Handles document upload events.                                             |
| customFormResponse                   | none                                                                       | void        | Custom form response handler.                                               |
| _updateEmojiBindings                 | none                                                                       | void        | Updates emoji bindings.                                                     |
| _locationHiddenChanged               | none                                                                       | void        | Handles changes to the location hidden property.                            |
| _formInvalid                         | none                                                                       | void        | Handles form invalid events.                                                |
| _locationChanged                     | none                                                                       | void        | Handles changes to the location property.                                   |
| _uploadedHeaderImageIdChanged        | none                                                                       | void        | Handles changes to the uploaded header image ID.                            |
| _getTabLength                        | none                                                                       | number      | Gets the length of the tabs.                                                |
| _nextTab                             | none                                                                       | void        | Goes to the next tab.                                                       |
| _selectedChanged                     | none                                                                       | void        | Handles changes to the selected tab.                                        |
| _selectedCategory                    | event: CustomEvent                                                         | void        | Handles category selection events.                                          |
| _selectedCategoryChanged             | none                                                                       | void        | Handles changes to the selected category.                                   |
| showCategories                       | none                                                                       | boolean     | Determines if categories are shown.                                         |
| getPositionInArrayFromId             | collection: Array<YpCategoryData>, id: number                              | number \| undefined | Gets the position in the array from the ID.                                  |
| _postChanged                         | none                                                                       | void        | Handles changes to the post property.                                       |
| _updateInitialCategory               | group: YpGroupData                                                         | void        | Updates the initial category.                                               |
| _imageUploaded                       | event: CustomEvent                                                         | void        | Handles image upload events.                                                |
| _redirectAfterVideo                  | post: YpPostData                                                           | Promise<void> | Redirects after a video is uploaded.                                        |
| _redirectAfterAudio                  | post: YpPostData                                                           | Promise<void> | Redirects after an audio is uploaded.                                       |
| surveyAnswerLocalstorageKey          | none                                                                       | string      | Gets the local storage key for survey answers.                              |
| saveSurveyAnswersToLocalStorage      | none                                                                       | void        | Saves survey answers to local storage.                                      |
| checkSurveyAnswers                   | none                                                                       | Promise<void> | Checks for saved survey answers.                                            |
| customRedirect                       | post: YpPostData                                                           | void        | Custom redirect handler.                                                    |
| _finishRedirect                      | post: YpPostData                                                           | void        | Finishes the redirect process.                                              |
| clear                                | none                                                                       | void        | Clears the form data.                                                       |
| setup                                | post: YpPostData \| undefined, newItem: boolean, refreshFunction: Function \| undefined, group: YpGroupData, params: any \| undefined | Promise<void> | Sets up the component with the given parameters.                            |
| _setupGroup                          | group: YpGroupData \| undefined                                            | void        | Sets up the group data.                                                     |
| mediaHidden                          | none                                                                       | boolean     | Determines if the media input is hidden.                                    |
| setupAfterOpen                       | params: YpEditFormParams                                                   | void        | Sets up the component after opening.                                        |
| _alternativeTextForNewIdeaButtonHeaderTranslation | none                                                                       | void        | Handles translation for the new idea button header text.                    |
| setupTranslation                     | none                                                                       | void        | Sets up translations for the component.                                     |

## Events

- **yp-form-invalid**: Emitted when the form is invalid.
- **yp-form-submit**: Emitted when the form is submitted.
- **yp-form-response**: Emitted when the form receives a response.
- **yp-form-error**: Emitted when there is an error with the form.
- **yp-open-to-unique-id**: Emitted to open to a specific unique ID.
- **yp-skip-to-unique-id**: Emitted to skip to a specific unique ID.
- **yp-goto-next-index**: Emitted to go to the next index.
- **yp-auto-translate**: Emitted for auto-translate events.
- **yp-language-loaded**: Emitted when the language is loaded.

## Examples

```typescript
// Example usage of the YpPostEdit component
<yp-post-edit></yp-post-edit>
```