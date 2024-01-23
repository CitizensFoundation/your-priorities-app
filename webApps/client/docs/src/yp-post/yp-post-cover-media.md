# YpPostCoverMedia

The `YpPostCoverMedia` class is a custom element that extends `YpBaseElement` to display various types of media associated with a post, such as images, videos, audio, maps, and street views. It supports different configurations for displaying media, including default images, category icons, and header modes.

## Properties

| Name                        | Type                      | Description                                                                 |
|-----------------------------|---------------------------|-----------------------------------------------------------------------------|
| post                        | YpPostData                | The post data associated with the media.                                    |
| topRadius                   | boolean                   | Determines if the top radius is applied to the media container.              |
| topLeftRadius               | boolean                   | Determines if the top left radius is applied to the media container.         |
| altTag                      | string \| undefined       | The alt tag for the media, used for accessibility.                           |
| postAudioId                 | number \| undefined       | The ID of the audio associated with the post.                                |
| postVideoId                 | number \| undefined       | The ID of the video associated with the post.                                |
| headerMode                  | boolean                   | Indicates if the media is displayed in header mode.                          |
| disableMaps                 | boolean                   | Determines if maps should be disabled.                                       |
| mapActivated                | boolean                   | Indicates if the map is activated.                                           |
| streetViewActivated         | boolean                   | Indicates if the street view is activated.                                   |
| tiny                        | boolean                   | Determines if a tiny version of the category icon should be used.            |
| staticMapsApiKey            | string                    | The API key for Google Static Maps.                                          |
| uploadedDefaultPostImageId  | number \| undefined       | The ID of the default post image uploaded to the server.                     |
| defaultImageGroupId         | number \| undefined       | The ID of the group associated with the default post image.                  |
| defaultPostImageEnabled     | boolean                   | Indicates if the default post image is enabled.                              |
| showVideo                   | boolean                   | Determines if the video should be displayed.                                 |
| showAudio                   | boolean                   | Determines if the audio should be displayed.                                 |
| portraitVideo               | boolean                   | Indicates if the video is in portrait mode.                                  |
| playStartedAt               | Date \| undefined         | The date and time when playback started.                                     |
| videoPlayListener           | Function \| undefined     | The listener function for video play events.                                 |
| videoPauseListener          | Function \| undefined     | The listener function for video pause events.                                |
| videoEndedListener          | Function \| undefined     | The listener function for video ended events.                                |
| audioPlayListener           | Function \| undefined     | The listener function for audio play events.                                 |
| audioPauseListener          | Function \| undefined     | The listener function for audio pause events.                                |
| audioEndedListener          | Function \| undefined     | The listener function for audio ended events.                                |

## Methods

| Name                  | Parameters | Return Type | Description                                                                 |
|-----------------------|------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback     |            | void        | Lifecycle method that runs when the element is added to the DOM.            |
| disconnectedCallback  |            | void        | Lifecycle method that runs when the element is removed from the DOM.        |
| updated               | Map        | void        | Lifecycle method that runs when the element's properties have changed.      |
| render                |            | TemplateResult | Returns the template for rendering the element.                          |
| sizingMode            |            | string      | Determines the sizing mode for images based on the post's group settings.   |
| activeDefaultImageUrl |            | string \| undefined | Returns the URL for the active default image if enabled.               |
| _goToPost             |            | void        | Navigates to the post when the media is clicked.                            |
| latitude              |            | number      | Retrieves the latitude from the post's location.                            |
| longitude             |            | number      | Retrieves the longitude from the post's location.                           |
| isNoneActive          |            | boolean     | Checks if the 'none' media type is active.                                  |
| isCategoryActive      |            | boolean     | Checks if the 'category' media type is active.                              |
| _isDomainWithOldCategories |      | boolean     | Helper method to support old square category images.                        |
| isCategoryLargeActive |            | boolean     | Checks if the 'category' media type is active with large images.            |
| isImageActive         |            | boolean     | Checks if the 'image' media type is active.                                 |
| isVideoActive         |            | boolean     | Checks if the 'video' media type is active.                                 |
| isAudioActive         |            | boolean     | Checks if the 'audio' media type is active.                                 |
| isMapActive           |            | boolean     | Checks if the 'map' media type is active.                                   |
| isStreetViewActive    |            | boolean     | Checks if the 'streetView' media type is active.                            |
| zoomLevel             |            | string      | Retrieves the zoom level for maps.                                          |
| mapType               |            | string      | Retrieves the map type for maps.                                            |
| _withCoverMediaType   | post: YpPostData, mediaType: string | boolean | Helper method to check the cover media type of the post. |
| mapPosition           |            | Object      | Retrieves the map position from the post's location.                        |
| postImagePath         |            | string      | Retrieves the image path for the post's header image.                       |
| postVideoPath         |            | string \| undefined | Retrieves the video path for the post's video.                         |
| postAudioPath         |            | string \| undefined | Retrieves the audio path for the post's audio.                         |
| postVideoPosterPath   |            | string \| undefined | Retrieves the video poster path for the post's video.                  |
| categoryImagePath     |            | string      | Retrieves the image path for the post's category icon.                      |

## Events (if any)

- **yp-pause-media-playback**: Emitted when media playback should be paused.

## Examples

```typescript
// Example usage of the YpPostCoverMedia custom element
<yp-post-cover-media
  .post="${this.postData}"
  .topRadius="${true}"
  .topLeftRadius="${false}"
  .altTag="${'Post Cover Image'}"
  .headerMode="${false}"
  .disableMaps="${false}"
  .mapActivated="${true}"
  .streetViewActivated="${false}"
  .tiny="${false}"
  .defaultPostImageEnabled="${true}"
  .showVideo="${true}"
  .showAudio="${false}"
  .portraitVideo="${false}"
></yp-post-cover-media>
```

Note: The above example assumes that `this.postData` is an instance of `YpPostData` containing the necessary post information.