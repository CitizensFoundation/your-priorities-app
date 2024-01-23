# YpCollectionHeader

The `YpCollectionHeader` class is a custom element that extends `YpBaseElement` to display a header for a collection, which can be a domain, community, or group. It includes an image or video, collection name, description, and additional stats or admin controls based on the collection type and user access rights.

## Properties

| Name                 | Type                      | Description                                                                 |
|----------------------|---------------------------|-----------------------------------------------------------------------------|
| collection           | YpCollectionData\|undefined | The collection data object for the header.                                  |
| collectionType       | string\|undefined          | The type of collection, such as "domain", "community", or "group".          |
| hideImage            | boolean                   | A flag to hide the image in the header.                                     |
| flaggedContentCount  | number\|undefined          | The count of flagged content within the collection.                         |
| collectionVideoId    | number\|undefined          | The ID of the video associated with the collection.                         |
| welcomeHTML          | string\|undefined          | Custom HTML content to welcome users to the collection.                     |
| playStartedAt        | Date\|undefined            | The date and time when video playback started.                              |
| videoPlayListener    | Function\|undefined        | A function to handle video play events.                                     |
| videoPauseListener   | Function\|undefined        | A function to handle video pause events.                                    |
| videoEndedListener   | Function\|undefined        | A function to handle video ended events.                                    |
| audioPlayListener    | Function\|undefined        | A function to handle audio play events.                                     |
| audioPauseListener   | Function\|undefined        | A function to handle audio pause events.                                    |
| audioEndedListener   | Function\|undefined        | A function to handle audio ended events.                                    |

## Methods

| Name                  | Parameters | Return Type | Description                                                                 |
|-----------------------|------------|-------------|-----------------------------------------------------------------------------|
| hasCollectionAccess   | -          | boolean     | Checks if the user has access to the collection based on its type.          |
| collectionVideos      | -          | Array\<YpVideoData\>\|undefined | Retrieves the collection's associated videos.                              |
| openMenuLabel         | -          | string      | Provides the label for the open menu button based on the collection type.   |
| collectionHeaderImages| -          | Array\<YpImageData\>\|undefined | Retrieves the collection's header images.                                  |
| collectionVideoURL    | -          | string\|undefined | Gets the URL of the collection's video if available.                        |
| collectionVideoPosterURL | -       | string\|undefined | Gets the URL of the collection's video poster if available.                |
| collectionHeaderImagePath | -      | string\|undefined | Gets the path of the collection's header image.                            |

## Events

- **yp-got-admin-rights**: Emitted when the user gets admin rights, triggering an update.
- **yp-pause-media-playback**: Emitted to pause media playback.

## Examples

```typescript
// Example usage of the YpCollectionHeader element
<yp-collection-header
  .collection="${this.collectionData}"
  collectionType="community"
  hideImage="${false}"
  .flaggedContentCount="${this.flaggedCount}"
  .collectionVideoId="${this.videoId}"
  .welcomeHTML="${this.welcomeMessage}"
></yp-collection-header>
```

Note: The actual usage of the `YpCollectionHeader` element will depend on the context in which it is used, including the data passed to its properties and the events it needs to handle.