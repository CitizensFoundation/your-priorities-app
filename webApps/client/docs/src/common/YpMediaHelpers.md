# YpMediaHelpers

This class provides static helper methods for handling media elements such as videos and audios within a web application. It includes methods for checking play times, setting up images, attaching and detaching media event listeners, pausing media playback, and retrieving media URLs.

## Methods

| Name                        | Parameters                                      | Return Type | Description                                                                 |
|-----------------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| _checkVideoLongPlayTimeAndReset | playbackElement: YpElementWithPlayback, videoPlayer: HTMLElement | void        | Checks if a video has been played for a long time and resets the play time. |
| _checkAudioLongPlayTimeAndReset | playbackElement: YpElementWithPlayback, audioPlayer: HTMLElement | void        | Checks if an audio has been played for a long time and resets the play time.|
| getImageFormatUrl           | images: Array<YpImageData> \| undefined, formatId: number = 0 | string      | Returns the URL of the image in the specified format.                       |
| setupTopHeaderImage         | element: YpBaseElement, images: Array<YpImageData> \| null | void        | Sets up the top header image for an element.                                |
| attachMediaListeners        | targetElement: YpElementWithPlayback             | void        | Attaches media event listeners to the target element.                       |
| detachMediaListeners        | targetElement: YpElementWithPlayback             | void        | Detaches media event listeners from the target element.                     |
| pauseMediaPlayback          | targetElement: YpElementWithPlayback             | void        | Pauses media playback for the target element.                               |
| getVideoURL                 | videos: Array<YpVideoData> \| undefined          | string \| null | Returns the URL of the video.                                               |
| isPortraitVideo             | videos: Array<YpVideoData> \| undefined          | boolean     | Determines if the video is in portrait mode.                                |
| getAudioURL                 | audios: Array<YpAudioData> \| undefined          | string \| null | Returns the URL of the audio.                                               |
| getVideoPosterURL           | videos: Array<YpVideoData> \| undefined, images: Array<YpImageData> \| undefined, selectedImageIndex: number = 0 | string \| null | Returns the URL of the video poster image.                                  |

## Examples

```typescript
// Example usage of attaching media listeners to a target element
YpMediaHelpers.attachMediaListeners(targetElement);

// Example usage of detaching media listeners from a target element
YpMediaHelpers.detachMediaListeners(targetElement);

// Example usage of pausing media playback for a target element
YpMediaHelpers.pauseMediaPlayback(targetElement);

// Example usage of getting a video URL from an array of YpVideoData
const videoUrl = YpMediaHelpers.getVideoURL(videosArray);

// Example usage of checking if a video is in portrait mode
const isPortrait = YpMediaHelpers.isPortraitVideo(videosArray);

// Example usage of getting an audio URL from an array of YpAudioData
const audioUrl = YpMediaHelpers.getAudioURL(audiosArray);

// Example usage of getting a video poster URL
const posterUrl = YpMediaHelpers.getVideoPosterURL(videosArray, imagesArray);
```