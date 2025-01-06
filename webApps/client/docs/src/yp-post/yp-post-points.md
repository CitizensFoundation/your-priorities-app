# YpPostPoints

The `YpPostPoints` class is a web component that extends `YpBaseElementWithLogin`. It is used to manage and display points related to a post, allowing users to add, view, and interact with points for or against a post. It supports features like video and audio uploads, emoji selection, and point interleaving for display.

## Properties

| Name                     | Type                          | Description                                                                 |
|--------------------------|-------------------------------|-----------------------------------------------------------------------------|
| fetchActive              | boolean                       | Indicates if data fetching is active.                                       |
| isAdmin                  | boolean                       | Indicates if the current user is an admin.                                  |
| disableDebate            | boolean                       | Indicates if debate is disabled.                                            |
| points                   | Array<YpPointData> \| undefined | Array of points related to the post.                                        |
| downPoints               | Array<YpPointData> \| undefined | Array of points against the post.                                           |
| upPoints                 | Array<YpPointData> \| undefined | Array of points for the post.                                               |
| newPointTextCombined     | string \| undefined           | Combined text for a new point.                                              |
| post                     | YpPostData                    | The post data associated with the points.                                   |
| labelMobileUpOrDown      | string \| undefined           | Label for mobile up or down selection.                                      |
| labelUp                  | string \| undefined           | Label for points for the post.                                              |
| labelDown                | string \| undefined           | Label for points against the post.                                          |
| pointUpOrDownSelected    | string                        | Indicates the selected point type ("pointFor" or "pointAgainst").           |
| latestPointCreatedAt     | Date \| undefined             | The creation date of the latest point.                                      |
| scrollToId               | number \| undefined           | ID of the point to scroll into view.                                        |
| addPointDisabled         | boolean                       | Indicates if adding a point is disabled.                                    |
| uploadedVideoUpId        | number \| undefined           | ID of the uploaded video for points for the post.                           |
| uploadedVideoDownId      | number \| undefined           | ID of the uploaded video for points against the post.                       |
| uploadedVideoMobileId    | number \| undefined           | ID of the uploaded video for mobile points.                                 |
| currentVideoId           | number \| undefined           | ID of the current video being processed.                                    |
| hideUpVideo              | boolean                       | Indicates if the video upload for points for the post is hidden.            |
| hideDownVideo            | boolean                       | Indicates if the video upload for points against the post is hidden.        |
| hideMobileVideo          | boolean                       | Indicates if the video upload for mobile points is hidden.                  |
| uploadedAudioUpId        | number \| undefined           | ID of the uploaded audio for points for the post.                           |
| uploadedAudioDownId      | number \| undefined           | ID of the uploaded audio for points against the post.                       |
| uploadedAudioMobileId    | number \| undefined           | ID of the uploaded audio for mobile points.                                 |
| currentAudioId           | number \| undefined           | ID of the current audio being processed.                                    |
| hideUpAudio              | boolean                       | Indicates if the audio upload for points for the post is hidden.            |
| hideDownAudio            | boolean                       | Indicates if the audio upload for points against the post is hidden.        |
| hideMobileAudio          | boolean                       | Indicates if the audio upload for mobile points is hidden.                  |
| hideUpText               | boolean                       | Indicates if the text input for points for the post is hidden.              |
| hideDownText             | boolean                       | Indicates if the text input for points against the post is hidden.          |
| hideMobileText           | boolean                       | Indicates if the text input for mobile points is hidden.                    |
| selectedPointForMobile   | boolean                       | Indicates if the selected point is for mobile.                              |
| isAndroid                | boolean                       | Indicates if the current device is Android.                                 |
| hasCurrentUpVideo        | string \| undefined           | Indicates if there is a current video for points for the post.              |
| hasCurrentDownVideo      | string \| undefined           | Indicates if there is a current video for points against the post.          |
| hasCurrentMobileVideo    | string \| undefined           | Indicates if there is a current video for mobile points.                    |
| hasCurrentUpAudio        | string \| undefined           | Indicates if there is a current audio for points for the post.              |
| hasCurrentDownAudio      | string \| undefined           | Indicates if there is a current audio for points against the post.          |
| hasCurrentMobileAudio    | string \| undefined           | Indicates if there is a current audio for mobile points.                    |
| storedPoints             | Array<YpPointData> \| undefined | Array of stored points.                                                     |
| loadedPointIds           | Record<number, boolean>       | Record of loaded point IDs.                                                 |
| loadMoreInProgress       | boolean                       | Indicates if loading more points is in progress.                            |
| totalCount               | number \| undefined           | Total count of points.                                                      |
| storedUpPointsCount      | number                        | Count of stored points for the post.                                        |
| storedDownPointsCount    | number                        | Count of stored points against the post.                                    |
| noMorePoints             | boolean                       | Indicates if there are no more points to load.                              |

## Methods

| Name                          | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| textValueUp                   | None                                                                       | string      | Gets the text value for points for the post.                                |
| _clearTextValueUp             | None                                                                       | void        | Clears the text value for points for the post.                              |
| textValueDown                 | None                                                                       | string      | Gets the text value for points against the post.                            |
| _clearTextValueDown           | None                                                                       | void        | Clears the text value for points against the post.                          |
| textValueMobileUpOrDown       | None                                                                       | string      | Gets the text value for mobile points.                                      |
| _clearTextValueMobileUpOrDown | None                                                                       | void        | Clears the text value for mobile points.                                    |
| updated                       | changedProperties: Map<string \| number \| symbol, unknown>                | void        | Lifecycle method called when properties are updated.                        |
| styles                        | None                                                                       | CSSResult[] | Returns the styles for the component.                                       |
| renderAudioUpload             | type: string, hideAudio: boolean, hasCurrentAudio: string \| undefined, uploadAudioPointHeader: string | TemplateResult | Renders the audio upload section.                                           |
| renderVideoUpload             | type: string, hideVideo: boolean, hasCurrentVideo: string \| undefined, uploadVideoHeader: string, videoUploadedFunc: Function, uploadedVideoId: number \| undefined | TemplateResult | Renders the video upload section.                                           |
| renderMobilePointSelection    | None                                                                       | TemplateResult | Renders the mobile point selection section.                                 |
| renderPointItem               | point: YpPointData, index: number                                          | TemplateResult | Renders a point item.                                                       |
| renderHeaderIcon              | headerTextType: string                                                     | TemplateResult | Renders the header icon based on the header text type.                      |
| renderPointHeader             | header: string, alternativeHeader: string \| undefined, headerTextType: string, pointsLength: number | TemplateResult | Renders the point header.                                                   |
| renderPointList               | type: string, header: string, alternativeHeader: string \| undefined, headerTextType: string, label: string \| undefined, hideVideo: boolean, hideText: boolean, hasCurrentVideo: string \| undefined, videoUploadedFunc: Function, uploadVideoHeader: string, uploadedVideoId: number \| undefined, pointFocusFunction: Function, hideAudio: boolean, hasCurrentAudio: string \| undefined, uploadAudioPointHeader: string, ifLengthIsRight: boolean, addPointFunc: Function, points: Array<YpPointData> \| undefined, mobile: boolean | TemplateResult | Renders the point list.                                                     |
| scrollEvent                   | event: any                                                                 | void        | Handles the scroll event.                                                   |
| renderTranslationPlaceholders | None                                                                       | TemplateResult | Renders translation placeholders.                                           |
| renderPointInfo               | None                                                                       | TemplateResult | Renders point information.                                                  |
| render                        | None                                                                       | TemplateResult | Renders the component.                                                      |
| _chooseUpOrDownRadio          | None                                                                       | void        | Handles the selection of up or down radio button.                           |
| wideReady                     | None                                                                       | boolean     | Checks if the component is ready for wide display.                          |
| smallReady                    | None                                                                       | boolean     | Checks if the component is ready for small display.                         |
| pointMaxLength                | None                                                                       | number      | Gets the maximum length for a point.                                        |
| _openLogin                    | None                                                                       | void        | Opens the login dialog.                                                     |
| _videoUpUploaded              | event: CustomEvent                                                         | void        | Handles the event when a video for points for the post is uploaded.         |
| _videoDownUploaded            | event: CustomEvent                                                         | void        | Handles the event when a video for points against the post is uploaded.     |
| _videoMobileUploaded          | event: CustomEvent                                                         | void        | Handles the event when a video for mobile points is uploaded.               |
| _audioUpUploaded              | event: CustomEvent                                                         | void        | Handles the event when an audio for points for the post is uploaded.        |
| _audioDownUploaded            | event: CustomEvent                                                         | void        | Handles the event when an audio for points against the post is uploaded.    |
| _audioMobileUploaded          | event: CustomEvent                                                         | void        | Handles the event when an audio for mobile points is uploaded.              |
| mobileScrollOffset            | None                                                                       | number      | Gets the scroll offset for mobile.                                          |
| listResizeScrollThreshold     | None                                                                       | number      | Gets the scroll threshold for list resize.                                  |
| listPaddingTop                | None                                                                       | number      | Gets the padding top for the list.                                          |
| connectedCallback             | None                                                                       | void        | Lifecycle method called when the component is connected to the DOM.         |
| disconnectedCallback          | None                                                                       | void        | Lifecycle method called when the component is disconnected from the DOM.    |
| _listResize                   | None                                                                       | void        | Handles the list resize event.                                              |
| _loadNewPointsIfNeeded        | event: CustomEvent                                                         | void        | Loads new points if needed.                                                 |
| _loadMorePoints               | None                                                                       | void        | Loads more points.                                                          |
| _interleaveMorePoints         | points: Array<YpPointData>                                                 | Array<YpPointData> | Interleaves more points.                                                    |
| _getMorePoints                | None                                                                       | Promise<void> | Gets more points.                                                           |
| _clearScrollTrigger           | None                                                                       | void        | Clears the scroll trigger.                                                  |
| _getNewPoints                 | None                                                                       | Promise<void> | Gets new points.                                                            |
| _pointDeleted                 | None                                                                       | void        | Handles the point deleted event.                                            |
| _pointsChanged                | None                                                                       | void        | Handles the points changed event.                                           |
| _updateEmojiBindings          | None                                                                       | void        | Updates emoji bindings.                                                     |
| _pointUpOrDownSelectedChanged | None                                                                       | void        | Handles the change in point up or down selection.                           |
| _clearVideo                   | None                                                                       | void        | Clears video data.                                                          |
| _clearAudio                   | None                                                                       | void        | Clears audio data.                                                          |
| _isAdminChanged               | None                                                                       | void        | Handles the change in admin status.                                         |
| _getPoints                    | None                                                                       | Promise<void> | Gets points.                                                                |
| _postChanged                  | None                                                                       | void        | Handles the post changed event.                                             |
| removeElementsByClass         | rootElement: HTMLElement, className: string                                | void        | Removes elements by class name.                                             |
| _updatePointLabels            | None                                                                       | void        | Updates point labels.                                                       |
| _processStoredPoints          | None                                                                       | void        | Processes stored points.                                                    |
| _updatePointInLists           | event: CustomEvent                                                         | void        | Updates a point in the lists.                                               |
| _checkForMultipleLanguages    | None                                                                       | void        | Checks for multiple languages in points.                                    |
| interleaveArrays              | arrayA: Array<YpPointData>, arrayB: Array<YpPointData>                      | Array<YpPointData> | Interleaves two arrays of points.                                           |
| _scrollPointIntoView          | None                                                                       | void        | Scrolls a point into view.                                                  |
| _preProcessPoints             | points: Array<YpPointData>                                                 | Array<YpPointData> | Pre-processes points.                                                       |
| _updateCounterInfo            | None                                                                       | void        | Updates counter information.                                                |
| _insertNewPoint               | point: YpPointData                                                         | Promise<void> | Inserts a new point.                                                        |
| _addMorePoint                 | point: YpPointData                                                         | boolean     | Adds more points.                                                           |
| _completeNewPointResponse     | point: YpPointData                                                         | void        | Completes the response for a new point.                                     |
| addPointUp                    | None                                                                       | void        | Adds a point for the post.                                                  |
| addPointDown                  | None                                                                       | void        | Adds a point against the post.                                              |
| addMobilePointUpOrDown        | None                                                                       | void        | Adds a mobile point for or against the post.                                |
| addPoint                      | content: string, value: number, videoId: number \| undefined, audioId: number \| undefined | Promise<void> | Adds a point.                                                               |
| focusUpPoint                  | None                                                                       | void        | Focuses on the point for the post.                                          |
| focusDownPoint                | None                                                                       | void        | Focuses on the point against the post.                                      |
| focusMobilePoint              | None                                                                       | void        | Focuses on the mobile point.                                                |
| focusOutlinedTextField        | event: CustomEvent                                                         | void        | Focuses on the outlined text field.                                         |
| blurOutlinedTextField         | event: CustomEvent                                                         | void        | Blurs the outlined text field.                                              |
| _hasCurrentUpVideo            | None                                                                       | void        | Checks if there is a current video for points for the post.                 |
| _hasCurrentDownVideo          | None                                                                       | void        | Checks if there is a current video for points against the post.             |
| _hasCurrentUpAudio            | None                                                                       | void        | Checks if there is a current audio for points for the post.                 |
| _hasCurrentDownAudio          | None                                                                       | void        | Checks if there is a current audio for points against the post.             |
| _hasCurrentMobileVideo        | None                                                                       | void        | Checks if there is a current video for mobile points.                       |
| _hasCurrentMobileAudio        | None                                                                       | void        | Checks if there is a current audio for mobile points.                       |
| ifLengthUpIsRight             | None                                                                       | boolean     | Checks if the length of the text for points for the post is right.          |
| ifLengthDownIsRight           | None                                                                       | boolean     | Checks if the length of the text for points against the post is right.      |
| ifLengthMobileIsRight         | None                                                                       | boolean     | Checks if the length of the text for mobile points is right.                |
| ifLengthIsRight               | type: string, textValue: string \| undefined, hasVideoId: number \| undefined, hasAudioId: number \| undefined | boolean     | Checks if the length of the text is right based on the type and media IDs.  |

## Examples

```typescript
// Example usage of the YpPostPoints web component
import './path/to/yp-post-points.js';

const postPointsElement = document.createElement('yp-post-points');
postPointsElement.post = somePostData;
document.body.appendChild(postPointsElement);
```