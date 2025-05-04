# YpPostPoints

`<yp-post-points>` is a web component for displaying and managing "points" (arguments for or against a post) in a debate or discussion context. It supports text, audio, and video points, and adapts its UI for both wide (desktop) and small (mobile) layouts. The component handles point creation, listing, media uploads, emoji selection, and admin/debate configuration.

## Properties

| Name                      | Type                                      | Description                                                                                 |
|---------------------------|-------------------------------------------|---------------------------------------------------------------------------------------------|
| fetchActive               | boolean                                   | Indicates if points are being fetched from the server.                                      |
| isAdmin                   | boolean                                   | Indicates if the current user is an admin.                                                  |
| disableDebate             | boolean                                   | If true, disables the debate (point adding) functionality.                                  |
| points                    | Array<YpPointData> \| undefined           | All points (for and against), used in mobile/small layout.                                  |
| downPoints                | Array<YpPointData> \| undefined           | Points against the post.                                                                    |
| upPoints                  | Array<YpPointData> \| undefined           | Points for the post.                                                                        |
| newPointTextCombined      | string \| undefined                       | Combined text for the latest added point (for notification/toast).                          |
| post                      | YpPostData                                | The post object for which points are being managed.                                         |
| labelMobileUpOrDown       | string \| undefined                       | Label for the mobile up/down point input.                                                   |
| labelUp                   | string \| undefined                       | Label for the "for" point input.                                                            |
| labelDown                 | string \| undefined                       | Label for the "against" point input.                                                        |
| pointUpOrDownSelected     | string                                    | Indicates which point type is selected in mobile ("pointFor" or "pointAgainst").            |
| latestPointCreatedAt      | Date \| undefined                         | Timestamp of the latest point created.                                                      |
| scrollToId                | number \| undefined                       | If set, scrolls to the point with this ID.                                                  |
| addPointDisabled          | boolean                                   | If true, disables the add point button.                                                     |
| uploadedVideoUpId         | number \| undefined                       | Uploaded video ID for "for" point.                                                          |
| uploadedVideoDownId       | number \| undefined                       | Uploaded video ID for "against" point.                                                      |
| uploadedVideoMobileId     | number \| undefined                       | Uploaded video ID for mobile point.                                                         |
| currentVideoId            | number \| undefined                       | Currently active video ID.                                                                  |
| hideUpVideo               | boolean                                   | If true, hides the video upload for "for" point.                                            |
| hideDownVideo             | boolean                                   | If true, hides the video upload for "against" point.                                        |
| hideMobileVideo           | boolean                                   | If true, hides the video upload for mobile point.                                           |
| uploadedAudioUpId         | number \| undefined                       | Uploaded audio ID for "for" point.                                                          |
| uploadedAudioDownId       | number \| undefined                       | Uploaded audio ID for "against" point.                                                      |
| uploadedAudioMobileId     | number \| undefined                       | Uploaded audio ID for mobile point.                                                         |
| currentAudioId            | number \| undefined                       | Currently active audio ID.                                                                  |
| hideUpAudio               | boolean                                   | If true, hides the audio upload for "for" point.                                            |
| hideDownAudio             | boolean                                   | If true, hides the audio upload for "against" point.                                        |
| hideMobileAudio           | boolean                                   | If true, hides the audio upload for mobile point.                                           |
| hideUpText                | boolean                                   | If true, hides the text input for "for" point.                                              |
| hideDownText              | boolean                                   | If true, hides the text input for "against" point.                                          |
| hideMobileText            | boolean                                   | If true, hides the text input for mobile point.                                             |
| selectedPointForMobile    | boolean                                   | If true, the mobile point input is for "for" point.                                         |
| isAndroid                 | boolean                                   | If true, the user is on an Android device.                                                  |
| hasCurrentUpVideo         | string \| undefined                       | File name or ID of the current "for" point video.                                           |
| hasCurrentDownVideo       | string \| undefined                       | File name or ID of the current "against" point video.                                       |
| hasCurrentMobileVideo     | string \| undefined                       | File name or ID of the current mobile point video.                                          |
| hasCurrentUpAudio         | string \| undefined                       | File name or ID of the current "for" point audio.                                           |
| hasCurrentDownAudio       | string \| undefined                       | File name or ID of the current "against" point audio.                                       |
| hasCurrentMobileAudio     | string \| undefined                       | File name or ID of the current mobile point audio.                                          |
| storedPoints              | Array<YpPointData> \| undefined           | All points fetched from the server, used for pagination and processing.                     |

**Internal/Private Properties:**

| Name                      | Type                                      | Description                                                                                 |
|---------------------------|-------------------------------------------|---------------------------------------------------------------------------------------------|
| loadedPointIds            | Record<number, boolean>                    | Tracks which point IDs have been loaded.                                                    |
| loadMoreInProgress        | boolean                                   | Indicates if more points are being loaded.                                                  |
| totalCount                | number \| undefined                       | Total number of points for the post.                                                        |
| storedUpPointsCount       | number                                    | Number of "for" points stored.                                                              |
| storedDownPointsCount     | number                                    | Number of "against" points stored.                                                          |
| noMorePoints              | boolean                                   | If true, no more points can be loaded.                                                      |

## Methods

| Name                          | Parameters                                                                                                    | Return Type         | Description                                                                                       |
|-------------------------------|---------------------------------------------------------------------------------------------------------------|---------------------|---------------------------------------------------------------------------------------------------|
| get textValueUp               | —                                                                                                             | string              | Gets the value of the "for" point text input.                                                     |
| _clearTextValueUp             | —                                                                                                             | void                | Clears the "for" point text input.                                                                |
| get textValueDown             | —                                                                                                             | string              | Gets the value of the "against" point text input.                                                 |
| _clearTextValueDown           | —                                                                                                             | void                | Clears the "against" point text input.                                                            |
| get textValueMobileUpOrDown   | —                                                                                                             | string              | Gets the value of the mobile point text input.                                                    |
| _clearTextValueMobileUpOrDown | —                                                                                                             | void                | Clears the mobile point text input.                                                               |
| updated                      | changedProperties: Map<string \| number \| symbol, unknown>                                                   | void                | Lifecycle method called when properties change.                                                   |
| static get styles             | —                                                                                                             | CSSResult[]         | Returns the component's styles.                                                                   |
| renderAudioUpload             | type: string, hideAudio: boolean, hasCurrentAudio: string \| undefined, uploadAudioPointHeader: string        | TemplateResult      | Renders the audio upload UI for a point.                                                          |
| renderVideoUpload             | type: string, hideVideo: boolean, hasCurrentVideo: string \| undefined, uploadVideoHeader: string, videoUploadedFunc: Function, uploadedVideoId: number \| undefined | TemplateResult      | Renders the video upload UI for a point.                                                          |
| renderMobilePointSelection    | —                                                                                                             | void                | Renders the mobile up/down radio selection.                                                       |
| renderPointItem               | point: YpPointData, index: number                                                                             | TemplateResult      | Renders a single point item.                                                                      |
| renderHeaderIcon              | headerTextType: string                                                                                        | TemplateResult      | Renders the icon for the point header.                                                            |
| renderPointHeader             | header: string, alternativeHeader: string \| undefined, headerTextType: string, pointsLength: number          | TemplateResult      | Renders the header for a point list.                                                              |
| renderPointList               | type: string, header: string, alternativeHeader: string \| undefined, headerTextType: string, label: string \| undefined, hideVideo: boolean, hideText: boolean, hasCurrentVideo: string \| undefined, videoUploadedFunc: Function, uploadVideoHeader: string, uploadedVideoId: number \| undefined, pointFocusFunction: Function, hideAudio: boolean, hasCurrentAudio: string \| undefined, uploadAudioPointHeader: string, ifLengthIsRight: boolean, addPointFunc: Function, points: Array<YpPointData> \| undefined, mobile?: boolean | TemplateResult      | Renders a list of points (for, against, or mobile).                                               |
| scrollEvent                   | event: any                                                                                                    | void                | Handles scroll events for the virtualizer.                                                        |
| renderTranslationPlaceholders | —                                                                                                             | TemplateResult      | Renders hidden translation placeholders for alternative labels.                                   |
| renderPointInfo               | —                                                                                                             | TemplateResult      | Renders the info section about upvoting/downvoting points.                                        |
| render                        | —                                                                                                             | TemplateResult      | Main render method for the component.                                                             |
| _chooseUpOrDownRadio          | —                                                                                                             | void                | Handles selection of up/down radio in mobile.                                                     |
| get wideReady                 | —                                                                                                             | boolean             | Returns true if in wide layout and post is set.                                                   |
| get smallReady                | —                                                                                                             | boolean             | Returns true if in small layout and post is set.                                                  |
| get pointMaxLength            | —                                                                                                             | number              | Gets the maximum allowed length for a point.                                                      |
| _openLogin                    | —                                                                                                             | void                | Fires an event to open the login dialog.                                                          |
| _videoUpUploaded              | event: CustomEvent                                                                                            | void                | Handles successful upload of "for" point video.                                                   |
| _videoDownUploaded            | event: CustomEvent                                                                                            | void                | Handles successful upload of "against" point video.                                               |
| _videoMobileUploaded          | event: CustomEvent                                                                                            | void                | Handles successful upload of mobile point video.                                                  |
| _audioUpUploaded              | event: CustomEvent                                                                                            | void                | Handles successful upload of "for" point audio.                                                   |
| _audioDownUploaded            | event: CustomEvent                                                                                            | void                | Handles successful upload of "against" point audio.                                               |
| _audioMobileUploaded          | event: CustomEvent                                                                                            | void                | Handles successful upload of mobile point audio.                                                  |
| get mobileScrollOffset        | —                                                                                                             | number              | Gets the scroll offset for the mobile list.                                                       |
| get listResizeScrollThreshold | —                                                                                                             | number              | Gets the scroll threshold for list resize.                                                        |
| get listPaddingTop            | —                                                                                                             | number              | Gets the padding top for the list.                                                                |
| connectedCallback             | —                                                                                                             | void                | Lifecycle method called when the component is attached to the DOM.                                |
| disconnectedCallback          | —                                                                                                             | void                | Lifecycle method called when the component is detached from the DOM.                              |
| _listResize                   | —                                                                                                             | void                | Handles list resize events.                                                                       |
| _loadNewPointsIfNeeded        | event: CustomEvent                                                                                            | void                | Loads new points if needed (when a new point is added elsewhere).                                 |
| _loadMorePoints               | —                                                                                                             | void                | Loads more points for pagination.                                                                 |
| _interleaveMorePoints         | points: Array<YpPointData>                                                                                    | Array<YpPointData>  | Interleaves up and down points for display.                                                       |
| _getMorePoints                | —                                                                                                             | Promise<void>       | Fetches more points from the server.                                                              |
| _clearScrollTrigger           | —                                                                                                             | void                | Clears scroll triggers (for infinite scroll, not currently implemented).                          |
| _getNewPoints                 | —                                                                                                             | Promise<void>       | Fetches new points created after the latest point.                                                |
| _pointDeleted                 | —                                                                                                             | void                | Handles point deletion event.                                                                     |
| _pointsChanged                | —                                                                                                             | void                | Handles changes to the points property.                                                           |
| _updateEmojiBindings          | —                                                                                                             | void                | Binds emoji selectors to the correct input fields.                                                |
| _pointUpOrDownSelectedChanged | —                                                                                                             | void                | Handles changes to the selected up/down point in mobile.                                          |
| _clearVideo                   | —                                                                                                             | void                | Clears all video uploads and resets related state.                                                |
| _clearAudio                   | —                                                                                                             | void                | Clears all audio uploads and resets related state.                                                |
| _isAdminChanged               | —                                                                                                             | void                | Handles changes to the isAdmin property and updates debate state.                                 |
| _getPoints                    | —                                                                                                             | Promise<void>       | Fetches all points for the current post.                                                          |
| _postChanged                  | —                                                                                                             | void                | Handles changes to the post property and resets state.                                            |
| removeElementsByClass         | rootElement: HTMLElement, className: string                                                                   | void                | Removes elements by class name from the DOM.                                                      |
| _updatePointLabels            | —                                                                                                             | void                | Updates the labels for up/down points based on translations.                                      |
| _processStoredPoints          | —                                                                                                             | void                | Processes stored points and splits them into up/down arrays.                                      |
| _updatePointInLists           | event: CustomEvent                                                                                            | void                | Updates a point in the up/down/points arrays when it changes.                                    |
| _checkForMultipleLanguages    | —                                                                                                             | void                | Checks if points are in multiple languages and prompts for translation if needed.                 |
| interleaveArrays              | arrayA: Array<YpPointData>, arrayB: Array<YpPointData>                                                        | Array<YpPointData>  | Interleaves two arrays for display.                                                               |
| _scrollPointIntoView          | —                                                                                                             | void                | Scrolls to a specific point if scrollToId is set.                                                |
| _preProcessPoints             | points: Array<YpPointData>                                                                                    | Array<YpPointData>  | Preprocesses points (sets latest content, updates latestPointCreatedAt, etc.).                    |
| _updateCounterInfo            | —                                                                                                             | void                | Fires an event with the current debate info (count, first point).                                 |
| _insertNewPoint               | point: YpPointData                                                                                            | Promise<void>       | Inserts a new point at the top of the list(s).                                                   |
| _addMorePoint                 | point: YpPointData                                                                                            | boolean             | Adds a point to the end of the list(s) if not already present.                                   |
| _completeNewPointResponse     | point: YpPointData                                                                                            | void                | Handles the response after a new point is added.                                                 |
| addPointUp                    | —                                                                                                             | void                | Adds a "for" point using the current input values.                                               |
| addPointDown                  | —                                                                                                             | void                | Adds an "against" point using the current input values.                                          |
| addMobilePointUpOrDown        | —                                                                                                             | void                | Adds a point in mobile mode, depending on the selected type.                                     |
| addPoint                      | content: string, value: number, videoId: number \| undefined, audioId: number \| undefined                   | Promise<void>       | Adds a point (for or against) with optional media.                                               |
| focusUpPoint                  | —                                                                                                             | void                | Tracks focus on the "for" point input.                                                           |
| focusDownPoint                | —                                                                                                             | void                | Tracks focus on the "against" point input.                                                       |
| focusMobilePoint              | —                                                                                                             | void                | Tracks focus on the mobile point input.                                                          |
| focusOutlinedTextField        | event: CustomEvent                                                                                            | void                | Handles focus on outlined text fields (for elevation, not currently implemented).                |
| blurOutlinedTextField         | event: CustomEvent                                                                                            | void                | Handles blur on outlined text fields (for elevation, not currently implemented).                 |
| _hasCurrentUpVideo            | —                                                                                                             | void                | Updates UI state when a "for" point video is present.                                            |
| _hasCurrentDownVideo          | —                                                                                                             | void                | Updates UI state when an "against" point video is present.                                       |
| _hasCurrentUpAudio            | —                                                                                                             | void                | Updates UI state when a "for" point audio is present.                                            |
| _hasCurrentDownAudio          | —                                                                                                             | void                | Updates UI state when an "against" point audio is present.                                       |
| _hasCurrentMobileVideo        | —                                                                                                             | void                | Updates UI state when a mobile point video is present.                                           |
| _hasCurrentMobileAudio        | —                                                                                                             | void                | Updates UI state when a mobile point audio is present.                                           |
| get ifLengthUpIsRight         | —                                                                                                             | boolean             | Returns true if the "for" point input is valid for submission.                                   |
| get ifLengthDownIsRight       | —                                                                                                             | boolean             | Returns true if the "against" point input is valid for submission.                               |
| get ifLengthMobileIsRight     | —                                                                                                             | boolean             | Returns true if the mobile point input is valid for submission.                                  |
| ifLengthIsRight               | type: string, textValue: string \| undefined, hasVideoId: number \| undefined, hasAudioId: number \| undefined| boolean             | Checks if the input for a point is valid for submission, based on text or media presence.        |

## Examples

```typescript
import "./yp-post-points.js";

const post = /* fetch or define your YpPostData object */;
const isAdmin = true;

const postPoints = document.createElement("yp-post-points");
postPoints.post = post;
postPoints.isAdmin = isAdmin;
document.body.appendChild(postPoints);

// Listen for debate info events
postPoints.addEventListener("yp-debate-info", (e) => {
  console.log("Debate info:", e.detail);
});
```
