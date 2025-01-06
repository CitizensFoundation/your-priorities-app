# YpMediaHelpers

The `YpMediaHelpers` class provides a set of static utility methods for handling media elements such as video and audio within a web application. It includes methods for checking playback times, attaching and detaching event listeners, and retrieving media URLs.

## Methods

| Name                                | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| _checkVideoLongPlayTimeAndReset     | playbackElement: YpElementWithPlayback, videoPlayer: HTMLElement            | void        | Checks if a video has been played for a long time and resets the playback state. |
| _checkAudioLongPlayTimeAndReset     | playbackElement: YpElementWithPlayback, audioPlayer: HTMLElement            | void        | Checks if an audio has been played for a long time and resets the playback state. |
| getImageFormatUrl                   | images: Array<YpImageData> \| undefined, formatId: number = 0               | string      | Retrieves the URL of an image in a specified format.                        |
| setupTopHeaderImage (Deprecated)    | element: YpBaseElement, images: Array<YpImageData> \| null                  | void        | Sets up the top header image for an element.                                |
| attachMediaListeners                | targetElement: YpElementWithPlayback                                        | void        | Attaches media event listeners to a target element.                        |
| detachMediaListeners                | targetElement: YpElementWithPlayback                                        | void        | Detaches media event listeners from a target element.                      |
| pauseMediaPlayback                  | targetElement: YpElementWithPlayback                                        | void        | Pauses media playback for video and audio elements within a target element.|
| getVideoURL                         | videos: Array<YpVideoData> \| undefined                                     | string \| null | Retrieves the URL of a video from the provided video data.                 |
| isPortraitVideo                     | videos: Array<YpVideoData> \| undefined                                     | boolean     | Determines if a video is in portrait aspect ratio.                         |
| getAudioURL                         | audios: Array<YpAudioData> \| undefined                                     | string \| null | Retrieves the URL of an audio from the provided audio data.                |
| getVideoPosterURL                   | videos: Array<YpVideoData> \| undefined, images: Array<YpImageData> \| undefined, selectedImageIndex: number = 0 | string \| null | Retrieves the URL of a video poster image.                                 |

## Examples

```typescript
// Example usage of the YpMediaHelpers class

// Attaching media listeners to a target element
YpMediaHelpers.attachMediaListeners(targetElement);

// Detaching media listeners from a target element
YpMediaHelpers.detachMediaListeners(targetElement);

// Pausing media playback
YpMediaHelpers.pauseMediaPlayback(targetElement);

// Getting a video URL
const videoUrl = YpMediaHelpers.getVideoURL(videos);

// Checking if a video is portrait
const isPortrait = YpMediaHelpers.isPortraitVideo(videos);

// Getting an audio URL
const audioUrl = YpMediaHelpers.getAudioURL(audios);

// Getting a video poster URL
const posterUrl = YpMediaHelpers.getVideoPosterURL(videos, images);
```

Note: The `setupTopHeaderImage` method is marked as deprecated and should be used with caution.