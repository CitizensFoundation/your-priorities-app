# YpPostEdit

A web component for editing posts, with support for structured questions and media uploads.

## Properties

| Name                          | Type    | Description                                                                 |
|-------------------------------|---------|-----------------------------------------------------------------------------|
| action                        | String  | The API endpoint for submitting the form.                                   |
| newPost                       | Boolean | Indicates if the form is for creating a new post.                           |
| selectedCategoryArrayId       | Number  | The index of the selected category in the categories array.                 |
| initialStructuredAnswersJson  | Array   | Initial structured answers in JSON format.                                  |
| structuredQuestions           | Array   | Array of structured questions data.                                         |
| post                          | Object  | The post data being edited.                                                 |
| group                         | Object  | The group data associated with the post.                                    |
| saveSurveyAnswers             | Boolean | Whether to save survey answers locally.                                     |
| skipIfSavedSurveyAnswers      | Boolean | Whether to skip saving survey answers if already saved.                     |
| locationHidden                | Boolean | Whether the location input is hidden.                                       |
| location                      | Object  | The location data associated with the post.                                 |
| encodedLocation               | String  | The encoded location data in string format.                                 |
| selectedCategoryId            | Number  | The ID of the selected category.                                            |
| uploadedVideoId               | Number  | The ID of the uploaded video.                                               |
| uploadedAudioId               | Number  | The ID of the uploaded audio.                                               |
| currentVideoId                | Number  | The ID of the current video associated with the post.                       |
| currentAudioId                | Number  | The ID of the current audio associated with the post.                       |
| selected                      | Number  | The index of the currently selected tab.                                    |
| mapActive                     | Boolean | Whether the map is currently active.                                        |
| hasOnlyOneTab                 | Boolean | Whether there is only one tab available.                                    |
| postDescriptionLimit          | Number  | The character limit for the post description.                               |
| sructuredAnswersString        | String  | The structured answers in string format.                                    |
| structuredAnswersJson         | String  | The structured answers in JSON format.                                      |
| structuredAnswersString       | String  | The structured answers in string format.                                    |
| translatedQuestions           | Array   | Array of translated structured questions data.                              |
| autoTranslate                 | Boolean | Whether to automatically translate content.                                 |
| uploadedDocumentUrl           | String  | The URL of the uploaded document.                                           |
| uploadedDocumentFilename      | String  | The filename of the uploaded document.                                      |
| selectedCoverMediaType        | String  | The type of media selected for the post cover.                              |
| uploadedHeaderImageId         | Number  | The ID of the uploaded header image.                                        |
| customTitleQuestionText       | String  | Custom text for the title question.                                         |
| emailValidationPattern        | String  | The regex pattern for email validation.                                     |
| liveQuestionIds               | Array   | Array of live question IDs.                                                 |
| uniqueIdsToElementIndexes     | Record  | Mapping of unique IDs to element indexes.                                   |
| liveUniqueIds                 | Array   | Array of live unique IDs.                                                   |

## Methods

| Name                        | Parameters | Return Type | Description                                      |
|-----------------------------|------------|-------------|--------------------------------------------------|
| customValidation            |            | Boolean     | Custom validation logic for the form.            |
| _getTranslationsIfNeeded    |            | Promise     | Fetches translations for structured questions.   |
| _groupChanged               |            |             | Handles changes to the group property.           |
| _generateLogo               | event      |             | Generates a logo based on the name and description. |
| _setSelectedTab             | event      |             | Sets the selected tab based on user interaction. |
| renderTabs                  |            | TemplateResult | Renders the tabs for the form.                  |
| renderMoreContactInfo       |            | TemplateResult | Renders additional contact information fields. |
| titleQuestionText           |            | String      | Gets the text for the title question.            |
| renderDescriptionTab        |            | TemplateResult | Renders the description tab content.           |
| renderPointTab              |            | TemplateResult | Renders the point tab content.                 |
| renderLocationTab           |            | TemplateResult | Renders the location tab content.              |
| renderCoverMediaSelection   |            | TemplateResult | Renders the cover media selection options.     |
| renderMediaTab              |            | TemplateResult | Renders the media tab content.                 |
| _setSelectedCoverMediaType  | event      |             | Sets the selected cover media type.              |
| _pointPageHidden            |            | Boolean     | Determines if the point page should be hidden.   |
| _mediaPageHidden            |            | Boolean     | Determines if the media page should be hidden.   |
| renderCurrentTabPage        |            | TemplateResult | Renders the content of the current tab page.   |
| renderHiddenInputs          |            | TemplateResult | Renders hidden inputs for the form.            |
| _gotAiImage                 | event      |             | Handles the event when an AI-generated image is received. |
| _alternativeTextForNewIdeaSaveButtonTranslation | | | Updates the save button text with a translation. |
| _updatePostTitle            |            |             | Updates the post title with a translation.       |
| connectedCallback           |            |             | Lifecycle callback for when the component is connected to the DOM. |
| disconnectedCallback        |            |             | Lifecycle callback for when the component is disconnected from the DOM. |
| hasLongSaveText             |            | Boolean     | Checks if the save text is longer than 9 characters. |
| _autoTranslateEvent         | event      |             | Handles the auto-translate event.                |
| _isLastRating               | index      | Boolean     | Checks if the current question is the last rating question. |
| _isFirstRating              | index      | Boolean     | Checks if the current question is the first rating question. |
| _openToId                   | event      |             | Scrolls to a specific question ID.               |
| _goToNextIndex              | event      |             | Scrolls to the next question index.              |
| _skipToId                   | event      |             | Skips to a specific question ID.                 |
| _skipToWithHideId           | event      |             | Skips to a specific question ID with hidden items. |
| _selectedCategory           | event      |             | Handles the selection of a category.             |
| _selectedCategoryChanged    |            |             | Handles changes to the selected category.        |
| _postChanged                |            |             | Handles changes to the post property.            |
| _updateInitialCategory      | group      |             | Updates the initial category based on the group. |
| _imageUploaded              | event      |             | Handles the event when an image is uploaded.     |
| _redirectAfterVideo         | post       | Promise     | Redirects after a video is uploaded.             |
| _redirectAfterAudio         | post       | Promise     | Redirects after an audio is uploaded.            |
| _finishRedirect             | post       |             | Finalizes the redirect after a post is created or updated. |
| clear                       |            |             | Clears the form fields.                          |
| setup                       | post, newItem, refreshFunction, group, params | Promise | Sets up the component for editing or creating a post. |
| _setupGroup                 | group      |             | Sets up the group-related properties.            |
| _videoUploaded              | event      |             | Handles the event when a video is uploaded.      |
| _audioUploaded              | event      |             | Handles the event when an audio is uploaded.      |
| _documentUploaded           | event      |             | Handles the event when a document is uploaded.    |
| customFormResponse          |            |             | Custom response logic for the form submission.    |
| _updateEmojiBindings        |            |             | Updates emoji selector bindings.                  |
| _locationHiddenChanged      |            |             | Handles changes to the locationHidden property.   |
| _formInvalid                |            |             | Handles invalid form submission.                  |
| _locationChanged            |            |             | Handles changes to the location property.         |
| _uploadedHeaderImageIdChanged |          |             | Handles changes to the uploadedHeaderImageId property. |
| _getStructuredQuestionsString |          | Array      | Gets structured questions as a string.            |
| _setupStructuredQuestions   |            |             | Sets up structured questions.                     |
| _selectedChanged            |            |             | Handles changes to the selected tab index.        |
| _selectedCategory           | event      |             | Handles category selection.                       |
| _selectedCategoryChanged    |            |             | Handles changes to the selected category.         |
| showCategories              |            | Boolean     | Determines if categories should be shown.         |
| getPositionInArrayFromId    | collection, id | Number  | Gets the position of an item in an array by ID.   |
| _postChanged                |            |             | Handles changes to the post property.             |
| _updateInitialCategory      | group      |             | Updates the initial category based on the group.  |
| _imageUploaded              | event      |             | Handles the event when an image is uploaded.      |
| _redirectAfterVideo         | post       | Promise     | Redirects after a video is uploaded.              |
| _redirectAfterAudio         | post       | Promise     | Redirects after an audio is uploaded.             |
| _finishRedirect             | post       |             | Finalizes the redirect after a post is created or updated. |
| clear                       |            |             | Clears the form fields.                           |
| setup                       | post, newItem, refreshFunction, group, params | Promise | Sets up the component for editing or creating a post. |
| _setupGroup                 | group      |             | Sets up the group-related properties.             |
| _videoUploaded              | event      |             | Handles the event when a video is uploaded.       |
| _audioUploaded              | event      |             | Handles the event when an audio is uploaded.      |
| _documentUploaded           | event      |             | Handles the event when a document is uploaded.    |
| customFormResponse          |            |             | Custom response logic for the form submission.    |
| _updateEmojiBindings        |            |             | Updates emoji selector bindings.                  |
| _locationHiddenChanged      |            |             | Handles changes to the locationHidden property.   |
| _formInvalid                |            |             | Handles invalid form submission.                  |
| _locationChanged            |            |             | Handles changes to the location property.         |
| _uploadedHeaderImageIdChanged |          |             | Handles changes to the uploadedHeaderImageId property. |
| _getStructuredQuestionsString |          | Array      | Gets structured questions as a string.            |
| _setupStructuredQuestions   |            |             | Sets up structured questions.                     |
| _selectedChanged            |            |             | Handles changes to the selected tab index.        |
| _selectedCategory           | event      |             | Handles category selection.                       |
| _selectedCategoryChanged    |            |             | Handles changes to the selected category.         |
| showCategories              |            | Boolean     | Determines if categories should be shown.         |
| getPositionInArrayFromId    | collection, id | Number  | Gets the position of an item in an array by ID.   |
| _postChanged                |            |             | Handles changes to the post property.             |
| _updateInitialCategory      | group      |             | Updates the initial category based on the group.  |
| _imageUploaded              | event      |             | Handles the event when an image is uploaded.      |
| _redirectAfterVideo         | post       | Promise     | Redirects after a video is uploaded.              |
| _redirectAfterAudio         | post       | Promise     | Redirects after an audio is uploaded.             |
| _finishRedirect             | post       |             | Finalizes the redirect after a post is created or updated. |
| clear                       |            |             | Clears the form fields.                           |
| setup                       | post, newItem, refreshFunction, group, params | Promise | Sets up the component for editing or creating a post. |
| _setupGroup                 | group      |             | Sets up the group-related properties.             |
| _videoUploaded              | event      |             | Handles the event when a video is uploaded.       |
| _audioUploaded              | event      |             | Handles the event when an audio is uploaded.      |
| _documentUploaded           | event      |             | Handles the event when a document is uploaded.    |
| customFormResponse          |            |             | Custom response logic for the form submission.    |
| _updateEmojiBindings        |            |             | Updates emoji selector bindings.                  |
| _locationHiddenChanged      |            |             | Handles changes to the locationHidden property.   |
| _formInvalid                |            |             | Handles invalid form submission.                  |
| _locationChanged            |            |             | Handles changes to the location property.         |
| _uploadedHeaderImageIdChanged |          |             | Handles changes to the uploadedHeaderImageId property. |
| _getStructuredQuestionsString |          | Array      | Gets structured questions as a string.            |
| _setupStructuredQuestions   |            |             | Sets up structured questions.                     |
| _selectedChanged            |            |             | Handles changes to the selected tab index.        |
| _selectedCategory           | event      |             | Handles category selection.                       |
| _selectedCategoryChanged    |            |             | Handles changes to the selected category.         |
| showCategories              |            | Boolean     | Determines if categories should be shown.         |
| getPositionInArrayFromId    | collection, id | Number  | Gets the position of an item in an array by ID.   |
| _postChanged                |            |             | Handles changes to the post property.             |
| _updateInitialCategory      | group      |             | Updates the initial category based on the group.  |
| _imageUploaded              | event      |             | Handles the event when an image is uploaded.      |
| _redirectAfterVideo         | post       | Promise     | Redirects after a video is uploaded.              |
| _redirectAfterAudio         | post       | Promise     | Redirects after an audio is uploaded.             |
| _finishRedirect             | post       |             | Finalizes the redirect after a post is created or updated. |
| clear                       |            |             | Clears the form fields.                           |
| setup                       | post, newItem, refreshFunction, group, params | Promise | Sets up the component for editing or creating a post. |
| _setupGroup                 | group      |             | Sets up the group-related properties.             |
| _videoUploaded              | event      |             | Handles the event when a video is uploaded.       |
| _audioUploaded              | event      |             | Handles the event when an audio is uploaded.      |
| _documentUploaded           | event      |             | Handles the event when a document is uploaded.    |
| customFormResponse          |            |             | Custom response logic for the form submission.    |
| _updateEmojiBindings        |            |             | Updates emoji selector bindings.                  |
| _locationHiddenChanged      |            |             | Handles changes to the locationHidden property.   |
| _formInvalid                |            |             | Handles invalid form submission.                  |
| _locationChanged            |            |             | Handles changes to the location property.         |
| _uploadedHeaderImageIdChanged |          |             | Handles changes to the uploadedHeaderImageId property. |
| _getStructuredQuestionsString |          | Array      | Gets structured questions as a string.            |
| _setupStructuredQuestions   |            |             | Sets up structured questions.                     |
| _selectedChanged            |            |             | Handles changes to the selected tab index.        |
| _selectedCategory           | event      |             | Handles category selection.                       |
| _selectedCategoryChanged    |            |             | Handles changes to the selected category.         |
| showCategories              |            | Boolean     | Determines if categories should be shown.         |
| getPositionInArrayFromId    | collection, id | Number  | Gets the position of an item in an array by ID.   |
| _postChanged                |            |             | Handles changes to the post property.             |
| _updateInitialCategory      | group      |             | Updates the initial category based on the group.  |
| _imageUploaded              | event      |             | Handles the event when an image is uploaded.      |
| _redirectAfterVideo         | post       | Promise     | Redirects after a video is uploaded.              |
| _redirectAfterAudio         | post       | Promise     | Redirects after an audio is uploaded.             |
| _finishRedirect             | post       |             | Finalizes the redirect after a post is created or updated. |
| clear                       |            |             | Clears the form fields.                           |
| setup                       | post, newItem, refreshFunction, group, params | Promise | Sets up the component for editing or creating a post. |
| _setupGroup                 | group      |             | Sets up the group-related properties.             |
| _videoUploaded              | event      |             | Handles the event when a video is uploaded.       |
| _audioUploaded              | event      |             | Handles the event when an audio is uploaded.      |
| _documentUploaded           | event      |             | Handles the event when a document is uploaded.    |
| customFormResponse          |            |             | Custom response logic for the form submission.    |
| _updateEmojiBindings        |            |             | Updates emoji selector bindings.                  |
| _locationHiddenChanged      |            |             | Handles changes to the locationHidden property.   |
| _formInvalid                |            |             | Handles invalid form submission.                  |
| _locationChanged            |            |             | Handles changes to the location property.         |
| _uploadedHeaderImageIdChanged |          |             | Handles changes to the uploadedHeaderImageId property. |
| _getStructuredQuestionsString |          | Array      | Gets structured questions as a string.            |
| _setupStructuredQuestions   |            |             | Sets up structured questions.                     |
| _selectedChanged            |            |             | Handles changes to the selected tab index.        |
| _selectedCategory           | event      |             | Handles category selection.                       |
| _selectedCategoryChanged    |            |             | Handles changes to the selected category.         |
| showCategories              |            | Boolean     | Determines if categories should be shown.         |
| getPositionInArrayFromId    | collection, id | Number  | Gets the position of an item in an array by ID.   |
| _postChanged                |            |             | Handles changes to the post property.             |
| _updateInitialCategory      | group      |             | Updates the initial category based on the group.  |
| _imageUploaded