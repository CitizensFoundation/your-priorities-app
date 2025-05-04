# YpPostCoverMedia

A web component for displaying the cover media of a post, supporting images, videos, audio, maps, and category icons. It adapts its display based on the post's configuration and media type, and integrates with Google Maps and Street View. It also handles media playback events and navigation to the post.

## Properties

| Name                        | Type                        | Description                                                                                      |
|-----------------------------|-----------------------------|--------------------------------------------------------------------------------------------------|
| post                        | YpPostData                  | The post data object to display media for.                                                       |
| topRadius                   | boolean                     | If true, applies a top border radius to the media container.                                     |
| topLeftRadius               | boolean                     | If true, applies a top-left border radius to the media container.                                |
| altTag                      | string \| undefined         | The alt text for images.                                                                         |
| postAudioId                 | number \| undefined         | The ID of the audio file associated with the post.                                               |
| postVideoId                 | number \| undefined         | The ID of the video file associated with the post.                                               |
| headerMode                  | boolean                     | If true, enables header mode, affecting media listeners and display.                             |
| disableMaps                 | boolean                     | If true, disables map and street view display.                                                   |
| mapActivated                | boolean                     | If true, activates the map display.                                                              |
| streetViewActivated         | boolean                     | If true, activates the street view display.                                                      |
| tiny                        | boolean                     | If true, displays a smaller version of the category icon.                                        |
| staticMapsApiKey            | string                      | The API key for Google Static Maps.                                                              |
| uploadedDefaultPostImageId  | number \| undefined         | The ID of the uploaded default post image for the group.                                         |
| defaultImageGroupId         | number \| undefined         | The group ID associated with the default post image.                                             |
| defaultPostImageEnabled     | boolean                     | If true, enables the use of a default post image.                                                |
| showVideo                   | boolean                     | If true, shows the video player.                                                                 |
| showAudio                   | boolean                     | If true, shows the audio player.                                                                 |
| portraitVideo               | boolean                     | If true, indicates the video is in portrait orientation.                                         |
| playStartedAt               | Date \| undefined           | The date and time when media playback started.                                                   |
| videoPlayListener           | Function \| undefined       | Listener for video play events.                                                                  |
| videoPauseListener          | Function \| undefined       | Listener for video pause events.                                                                 |
| videoEndedListener          | Function \| undefined       | Listener for video ended events.                                                                 |
| audioPlayListener           | Function \| undefined       | Listener for audio play events.                                                                  |
| audioPauseListener          | Function \| undefined       | Listener for audio pause events.                                                                 |
| audioEndedListener          | Function \| undefined       | Listener for audio ended events.                                                                 |

## Methods

| Name                    | Parameters                                                                 | Return Type | Description                                                                                                 |
|-------------------------|----------------------------------------------------------------------------|-------------|-------------------------------------------------------------------------------------------------------------|
| connectedCallback       | none                                                                       | void        | Lifecycle method called when the element is added to the DOM. Sets up media listeners if in header mode.    |
| disconnectedCallback    | none                                                                       | void        | Lifecycle method called when the element is removed from the DOM. Cleans up media listeners if in header mode.|
| updated                 | changedProperties: Map<string \| number \| symbol, unknown>                | void        | Lifecycle method called when properties are updated. Handles changes to post and headerMode.                |
| render                  | none                                                                       | unknown     | Renders the component's template based on the current state and post data.                                  |
| sizingMode (getter)     | none                                                                       | string      | Returns the image sizing mode ('contain' or 'cover') based on group configuration.                          |
| activeDefaultImageUrl (getter) | none                                                               | string \| undefined | Returns the URL for the group's default post image if enabled.                                              |
| _goToPost               | none                                                                       | void        | Navigates to the post, unless resourceLibraryLinkMode is enabled.                                           |
| latitude (getter)       | none                                                                       | number      | Returns the latitude from the post's location, or 0.0 if not available.                                     |
| longitude (getter)      | none                                                                       | number      | Returns the longitude from the post's location, or 0.0 if not available.                                    |
| isNoneActive (getter)   | none                                                                       | boolean     | Returns true if no cover media is active for the post.                                                      |
| isCategoryActive (getter)| none                                                                      | boolean     | Returns true if the category icon should be displayed (old category style).                                 |
| _isDomainWithOldCategories | none                                                                   | boolean     | Returns true if the current domain is configured for old category images.                                   |
| isCategoryLargeActive (getter)| none                                                                | boolean     | Returns true if the large category icon should be displayed (new category style).                           |
| isImageActive (getter)  | none                                                                       | boolean     | Returns true if an image is the active cover media.                                                         |
| isVideoActive (getter)  | none                                                                       | boolean     | Returns true if a video is the active cover media.                                                          |
| isAudioActive (getter)  | none                                                                       | boolean     | Returns true if audio is the active cover media.                                                            |
| isMapActive (getter)    | none                                                                       | boolean     | Returns true if a map is the active cover media.                                                            |
| isStreetViewActive (getter)| none                                                                   | boolean     | Returns true if street view is the active cover media.                                                      |
| zoomLevel (getter)      | none                                                                       | string \| number | Returns the zoom level for the map, or '10' if not specified.                                               |
| mapType (getter)        | none                                                                       | string      | Returns the map type for the map, or 'roadmap' if not specified.                                            |
| _withCoverMediaType     | post: YpPostData, mediaType: string                                        | boolean     | Checks if the post has the specified cover media type.                                                      |
| mapPosition (getter)    | none                                                                       | { lat: number, lng: number } | Returns the map position object for Google Maps/Street View.                                                |
| postImagePath (getter)  | none                                                                       | string      | Returns the URL for the post's header image, or an empty string if not available.                           |
| postVideoPath (getter)  | none                                                                       | string \| undefined | Returns the URL for the post's video, or undefined if not available.                                        |
| postAudioPath (getter)  | none                                                                       | string \| undefined | Returns the URL for the post's audio, or undefined if not available.                                        |
| postVideoPosterPath (getter)| none                                                                  | string \| undefined | Returns the URL for the post's video poster image, or undefined if not available.                           |
| categoryImagePath (getter)| none                                                                    | string      | Returns the URL for the category icon image, or an empty string if not available.                           |
| anyImagePath (getter)   | none                                                                       | string      | Returns the first available image path among post image, default image, or category image.                  |

## Examples

```typescript
import './yp-post-cover-media.js';

const postData = {
  id: 123,
  Group: {
    id: 1,
    configuration: {
      uploadedDefaultPostImageId: 10,
      useContainImageMode: true,
      resourceLibraryLinkMode: false
    }
  },
  Category: {
    name: "Environment",
    CategoryIconImages: [/* ... */]
  },
  location: {
    latitude: 64.1466,
    longitude: -21.9426,
    map_zoom: 12,
    mapType: "roadmap"
  },
  cover_media_type: "image",
  PostHeaderImages: [/* ... */],
  PostVideos: [/* ... */],
  PostAudios: [/* ... */]
};

html`
  <yp-post-cover-media
    .post="${postData}"
    .headerMode="${true}"
    .topRadius="${true}"
    .altTag="${'Post cover image'}">
  </yp-post-cover-media>
`;
```
