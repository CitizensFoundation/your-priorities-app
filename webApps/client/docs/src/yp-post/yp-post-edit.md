# YpPostEdit

A comprehensive web component for editing and creating posts, supporting structured questions, media uploads, location selection, category selection, and advanced group-based configuration. Extends `YpEditBase` and integrates with Material Web Components and custom YP components.

## Properties

| Name                           | Type                                              | Description                                                                                 |
|---------------------------------|---------------------------------------------------|---------------------------------------------------------------------------------------------|
| action                         | string                                            | The form action URL for submitting the post.                                                |
| newPost                        | boolean                                           | Indicates if the form is for creating a new post.                                           |
| selectedCategoryArrayId         | number \| undefined                               | The index of the selected category in the categories array.                                 |
| initialStructuredAnswersJson    | Array<YpStructuredAnswer> \| undefined            | Initial structured answers for the post, if any.                                            |
| structuredQuestions             | Array<YpStructuredQuestionData> \| undefined      | The list of structured questions to display.                                                |
| post                            | YpPostData \| undefined                          | The post data being edited or created.                                                      |
| group                           | YpGroupData \| undefined                         | The group context for the post.                                                             |
| saveSurveyAnswers               | boolean                                           | Whether to save survey answers to local storage.                                            |
| disableDialog                   | boolean                                           | If true, disables the dialog wrapper.                                                       |
| skipIfSavedSurveyAnswers        | boolean                                           | If true, skips if survey answers are already saved.                                         |
| locationHidden                  | boolean                                           | If true, hides the location tab.                                                            |
| location                        | YpLocationData \| undefined                      | The current location data for the post.                                                     |
| encodedLocation                 | string \| undefined                              | The encoded location string for form submission.                                            |
| selectedCategoryId              | number \| undefined                              | The selected category ID.                                                                   |
| uploadedVideoId                 | number \| undefined                              | The ID of the uploaded video.                                                               |
| uploadedAudioId                 | number \| undefined                              | The ID of the uploaded audio.                                                               |
| response                        | object \| undefined                              | The response object from the form submission.                                               |
| errorText                       | string \| undefined                              | The error text to display in the error dialog.                                              |
| currentVideoId                  | number \| undefined                              | The ID of the current video associated with the post.                                       |
| currentAudioId                  | number \| undefined                              | The ID of the current audio associated with the post.                                       |
| selected                        | number                                           | The currently selected tab index.                                                           |
| mapActive                       | boolean                                          | Whether the map tab is active.                                                              |
| hasOnlyOneTab                   | boolean                                          | Whether there is only one tab to display.                                                   |
| postDescriptionLimit            | number \| undefined                              | The character limit for the post description.                                               |
| sructuredAnswersString          | string \| undefined                              | (Deprecated) String representation of structured answers.                                   |
| structuredAnswersJson           | string                                           | JSON string of structured answers.                                                          |
| structuredAnswersString         | string                                           | String representation of structured answers.                                                |
| translatedQuestions             | Array<YpStructuredQuestionData> \| undefined      | The translated structured questions, if auto-translate is enabled.                          |
| autoTranslate                   | boolean                                          | Whether to auto-translate structured questions.                                             |
| submitDisabled                  | boolean                                          | Whether the submit button is disabled.                                                      |
| uploadedDocumentUrl             | string \| undefined                              | The URL of the uploaded document.                                                           |
| uploadedVideoUrl                | string \| undefined                              | The URL of the uploaded video.                                                              |
| uploadedDocumentFilename        | string \| undefined                              | The filename of the uploaded document.                                                      |
| selectedCoverMediaType          | string                                           | The selected cover media type (`none`, `image`, `video`, `audio`, `map`, `streetView`).     |
| uploadedHeaderImageId           | number \| undefined                              | The ID of the uploaded header image.                                                        |
| customTitleQuestionText         | string \| undefined                              | Custom text for the title question.                                                         |
| formElement                     | YpForm \| undefined                              | Reference to the form element.                                                              |
| emailValidationPattern          | string                                           | Regex pattern for email validation.                                                         |
| liveQuestionIds                 | Array<number>                                    | Indices of live structured questions.                                                       |
| uniqueIdsToElementIndexes       | Record<string, number>                           | Mapping from unique question IDs to their element indexes.                                  |
| liveUniqueIds                   | Array<string>                                    | List of live unique question IDs.                                                           |
| imagePreviewUrl                 | string \| undefined                              | The preview URL for the uploaded image (set internally).                                    |
| saveText                        | string \| undefined                              | The text for the save button (set internally).                                              |
| editHeaderText                  | string \| undefined                              | The text for the edit header (set internally).                                              |
| snackbarText                    | string \| undefined                              | The text for the snackbar notification (set internally).                                    |
| refreshFunction                 | Function \| undefined                            | Function to call to refresh the parent context (set internally).                            |
| params                          | any                                              | Additional parameters for the form (set internally).                                        |
| new                             | boolean                                          | Whether the form is in "new" mode (set internally).                                         |

## Methods

| Name                                 | Parameters                                                                                      | Return Type         | Description                                                                                      |
|--------------------------------------|-------------------------------------------------------------------------------------------------|---------------------|--------------------------------------------------------------------------------------------------|
| updated                              | changedProperties: Map<string \| number \| symbol, unknown>                                     | void                | Lifecycle method called when properties are updated.                                              |
| customValidation                     | none                                                                                            | boolean             | Validates all structured question components.                                                     |
| _getTranslationsIfNeeded             | none                                                                                            | Promise<void>       | Fetches and applies translations for structured questions if needed.                              |
| _groupChanged                        | none                                                                                            | void                | Handles changes to the group property.                                                            |
| _generateLogo                        | event: CustomEvent                                                                              | void                | Opens the AI image generator dialog.                                                              |
| static get styles                    | none                                                                                            | CSSResult[]         | Returns the component's styles.                                                                   |
| _setSelectedTab                      | event: CustomEvent                                                                              | void                | Sets the selected tab index.                                                                      |
| renderMoreContactInfo                | none                                                                                            | TemplateResult      | Renders additional contact information fields.                                                    |
| titleQuestionText                    | none                                                                                            | string              | Gets the text for the title question.                                                             |
| renderCoverMediaContent              | none                                                                                            | TemplateResult      | Renders the current cover media (image, video, or placeholder).                                   |
| renderDescriptionInputs              | none                                                                                            | TemplateResult      | Renders the description and related input fields.                                                 |
| renderPointTab                       | none                                                                                            | TemplateResult      | Renders the "point" tab content.                                                                  |
| renderLocationTab                    | none                                                                                            | TemplateResult      | Renders the location tab content.                                                                 |
| renderCoverMediaSelection            | none                                                                                            | TemplateResult      | Renders the cover media type selection controls.                                                  |
| renderMediaTab                       | none                                                                                            | TemplateResult      | Renders the media upload tab content.                                                             |
| _setSelectedCoverMediaType           | event: CustomEvent                                                                              | void                | Sets the selected cover media type.                                                               |
| renderMediaAndLocation               | none                                                                                            | TemplateResult \| undefined \| {} | Renders the media and location section.                                                           |
| renderHiddenInputs                   | none                                                                                            | TemplateResult      | Renders hidden form inputs for submission.                                                        |
| renderClose                          | none                                                                                            | TemplateResult      | Renders the close button.                                                                         |
| submit                               | validate?: boolean                                                                              | Promise<void>       | Submits the form, optionally validating first.                                                    |
| renderSaveButton                     | none                                                                                            | TemplateResult      | Renders the save button and spinner.                                                              |
| renderHeader                         | none                                                                                            | TemplateResult      | Renders the form header.                                                                          |
| render                               | none                                                                                            | TemplateResult      | Renders the entire component.                                                                     |
| _gotAiImage                          | event: CustomEvent                                                                              | void                | Handles the AI image generator's result.                                                          |
| _alternativeTextForNewIdeaSaveButtonTranslation | none                                                                                            | void                | Updates the save button text from a translation.                                                  |
| _updatePostTitle                     | none                                                                                            | void                | Updates the post title from a translation.                                                        |
| connectedCallback                    | none                                                                                            | void                | Lifecycle method called when the component is added to the DOM.                                   |
| disconnectedCallback                 | none                                                                                            | void                | Lifecycle method called when the component is removed from the DOM.                               |
| _formSubmitted                       | none                                                                                            | void                | Handles successful form submission.                                                               |
| _formError                           | event: CustomEvent                                                                              | void                | Handles form submission errors.                                                                   |
| _showErrorDialog                     | errorText: string                                                                               | void                | Shows the error dialog with the given text.                                                       |
| _clearErrorText                      | none                                                                                            | void                | Clears the error dialog.                                                                          |
| hasLongSaveText                      | none                                                                                            | boolean             | Returns true if the save button text is long.                                                     |
| _autoTranslateEvent                  | event: CustomEvent                                                                              | void                | Handles the auto-translate event.                                                                 |
| _isLastRating                        | index: number                                                                                   | boolean             | Checks if the question at the given index is the last rating question.                            |
| _isFirstRating                       | index: number                                                                                   | boolean             | Checks if the question at the given index is the first rating question.                           |
| _openToId                            | event: CustomEvent                                                                              | void                | Opens the form to a specific question by unique ID.                                               |
| _goToNextIndex                       | event: CustomEvent                                                                              | void                | Focuses the next structured question.                                                             |
| _skipToId                            | event: CustomEvent, showItems: boolean                                                          | void                | Skips to a specific question by unique ID.                                                        |
| _skipToWithHideId                    | event: CustomEvent, showItems: boolean                                                          | void                | Skips to a specific question and hides/shows intermediate questions.                              |
| firstUpdated                         | none                                                                                            | void                | Lifecycle method called after the first render.                                                   |
| replacedName                         | none                                                                                            | string \| null      | Gets the replaced name if the group is configured to hide the name input.                         |
| pointMaxLength                       | none                                                                                            | number              | Gets the maximum length for the "point" field.                                                    |
| _floatIfValueOrIE                    | value: boolean                                                                                  | boolean             | Returns true if IE11 or the value is true.                                                        |
| newPointShown                        | none                                                                                            | boolean             | Returns true if the "point" tab should be shown.                                                  |
| _submitWithStructuredQuestionsJson   | none                                                                                            | void                | Submits the form with structured questions as JSON.                                               |
| _submitWithStructuredQuestionsString | none                                                                                            | void                | Submits the form with structured questions as a string.                                           |
| customSubmit                         | none                                                                                            | void                | Handles custom form submission logic based on structured questions.                               |
| _resizeScrollerIfNeeded              | none                                                                                            | void                | Triggers a resize on the edit dialog scroller.                                                    |
| _getStructuredQuestionsString        | none                                                                                            | Array<YpStructuredQuestionData> | Gets structured questions as a string array.                                                      |
| _setupStructuredQuestions            | none                                                                                            | void \| undefined   | Sets up the structured questions for the form.                                                    |
| showVideoCover                       | none                                                                                            | number \| undefined | Returns the video ID if a video cover is available.                                               |
| showAudioCover                       | none                                                                                            | number \| undefined | Returns the audio ID if an audio cover is available.                                              |
| _videoUploaded                       | event: CustomEvent                                                                              | void                | Handles video upload success.                                                                     |
| _audioUploaded                       | event: CustomEvent                                                                              | void                | Handles audio upload success.                                                                     |
| _documentUploaded                    | event: CustomEvent                                                                              | void                | Handles document upload success.                                                                  |
| customFormResponse                   | none                                                                                            | void                | Handles custom form response logic.                                                               |
| _updateEmojiBindings                 | none                                                                                            | void                | Binds emoji selectors to their respective input fields.                                           |
| _locationHiddenChanged               | none                                                                                            | void                | Handles changes to the locationHidden property.                                                   |
| _formInvalid                         | none                                                                                            | void                | Handles form invalidation and focuses the appropriate tab.                                        |
| _locationChanged                     | none                                                                                            | void                | Handles changes to the location property.                                                         |
| _uploadedHeaderImageIdChanged        | none                                                                                            | void                | Handles changes to the uploadedHeaderImageId property.                                            |
| _getTabLength                        | none                                                                                            | number              | Gets the number of tabs to display.                                                               |
| _nextTab                             | none                                                                                            | void                | Advances to the next tab.                                                                         |
| _selectedChanged                     | none                                                                                            | void                | Handles changes to the selected tab index.                                                        |
| _selectedCategory                    | event: Event                                                                                    | void                | Handles category selection changes.                                                               |
| _selectedCategoryChanged             | none                                                                                            | void                | Updates the selected category ID based on the selected array index.                               |
| showCategories                       | none                                                                                            | boolean             | Returns true if categories should be shown.                                                       |
| getPositionInArrayFromId             | collection: Array<YpCategoryData>, id: number                                                   | number \| undefined | Gets the position of a category in the array by ID.                                               |
| _postChanged                         | none                                                                                            | void                | Handles changes to the post property.                                                             |
| _updateInitialCategory               | group: YpGroupData                                                                              | void                | Updates the initial category selection based on the post and group.                               |
| _imageUploaded                       | event: CustomEvent                                                                              | void                | Handles image upload success.                                                                     |
| _redirectAfterVideo                  | post: YpPostData                                                                                | Promise<void>       | Handles redirect logic after a video upload.                                                      |
| _redirectAfterAudio                  | post: YpPostData                                                                                | Promise<void>       | Handles redirect logic after an audio upload.                                                     |
| surveyAnswerLocalstorageKey          | none                                                                                            | string              | Gets the local storage key for survey answers.                                                    |
| saveSurveyAnswersToLocalStorage      | none                                                                                            | void                | Saves survey answers to local storage.                                                            |
| checkSurveyAnswers                   | none                                                                                            | Promise<void>       | Checks for saved survey answers in local storage and submits if found.                            |
| customRedirect                       | post: YpPostData                                                                                | void                | Handles custom redirect logic after form submission.                                              |
| _finishRedirect                      | post: YpPostData                                                                                | void                | Finalizes the redirect after form submission.                                                     |
| clear                                | none                                                                                            | void                | Clears the form fields for a new post.                                                            |
| setup                                | post: YpPostData \| undefined, newItem: boolean, refreshFunction: Function \| undefined, group: YpGroupData, params?: any | Promise<void>       | Sets up the form for editing or creating a post.                                                  |
| _setupGroup                          | group: YpGroupData \| undefined                                                                 | void                | Sets up the group context and configuration.                                                      |
| mediaHidden                          | none                                                                                            | boolean             | Returns true if the media tab should be hidden.                                                   |
| setupAfterOpen                       | params: YpEditFormParams                                                                        | void                | Called after the dialog is opened to set up the form.                                             |
| _alternativeTextForNewIdeaButtonHeaderTranslation | none                                                                                            | void                | Updates the edit header text from a translation.                                                  |
| setupTranslation                     | none                                                                                            | void                | Sets up translations for the form header, save button, and snackbar.                              |

## Events

- **yp-form-invalid**: Emitted when the form is invalid.
- **yp-form-submit**: Emitted when the form is submitted.
- **yp-form-response**: Emitted when a response is received from the form submission.
- **yp-form-error**: Emitted when an error occurs during form submission.
- **yp-open-to-unique-id**: Emitted to open the form to a specific structured question by unique ID.
- **yp-skip-to-unique-id**: Emitted to skip to a specific structured question by unique ID.
- **yp-goto-next-index**: Emitted to go to the next structured question.
- **yp-reset-keep-open-for-page**: Emitted to reset the keep-open state for the page.

## Examples

```typescript
import "./yp-post-edit.js";

const postEdit = document.createElement("yp-post-edit");
postEdit.group = myGroupData;
postEdit.post = myPostData;
postEdit.newPost = true;
document.body.appendChild(postEdit);

// Listen for form submission events
postEdit.addEventListener("yp-form-submit", (e) => {
  console.log("Form submitted!", e.detail);
});
```
