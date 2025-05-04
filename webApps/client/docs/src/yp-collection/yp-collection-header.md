# YpCollectionHeader

A Lit-based web component that displays a header for a collection (domain, community, or group) with support for images, videos, stats, and admin actions. It handles media playback, access control, and dynamic rendering based on the collection type and configuration.

## Properties

| Name                   | Type                                      | Description                                                                                 |
|------------------------|-------------------------------------------|---------------------------------------------------------------------------------------------|
| collection             | YpCollectionData \| undefined             | The collection data object to display.                                                      |
| collectionType         | string \| undefined                       | The type of the collection ("domain", "community", or "group").                             |
| hideImage              | boolean                                   | Whether to hide the collection's logo image. Default is `false`.                            |
| flaggedContentCount    | number \| undefined                       | The number of flagged content items in the collection.                                      |
| collectionVideoId      | number \| undefined                       | The ID of the currently displayed collection video.                                         |
| welcomeHTML            | string \| undefined                       | Optional HTML content to display as a welcome message.                                      |
| playStartedAt          | Date \| undefined                         | The date and time when media playback started.                                              |
| videoPlayListener      | Function \| undefined                     | Reference to the video play event listener.                                                 |
| videoPauseListener     | Function \| undefined                     | Reference to the video pause event listener.                                                |
| videoEndedListener     | Function \| undefined                     | Reference to the video ended event listener.                                                |
| audioPlayListener      | Function \| undefined                     | Reference to the audio play event listener.                                                 |
| audioPauseListener     | Function \| undefined                     | Reference to the audio pause event listener.                                                |
| audioEndedListener     | Function \| undefined                     | Reference to the audio ended event listener.                                                |

## Methods

| Name                        | Parameters                                                                 | Return Type | Description                                                                                                   |
|-----------------------------|----------------------------------------------------------------------------|-------------|---------------------------------------------------------------------------------------------------------------|
| connectedCallback           | none                                                                       | void        | Lifecycle method. Adds global event listeners for admin rights and media playback pause.                      |
| disconnectedCallback        | none                                                                       | void        | Lifecycle method. Removes global event listeners and detaches media listeners.                                |
| firstUpdated                | changedProperties: Map<string \| number \| symbol, unknown>                | void        | Lifecycle method. Attaches media listeners after the first update.                                            |
| updated                     | changedProperties: Map<string \| number \| symbol, unknown>                | void        | Lifecycle method. Updates media listeners when the collection changes.                                        |
| _pauseMediaPlayback         | none                                                                       | void        | Pauses any playing media in the component.                                                                    |
| _menuSelection              | event: CustomEvent                                                         | void        | Handles menu item selection for admin actions (edit, analytics).                                              |
| hasCollectionAccess         | none                                                                       | boolean     | Returns `true` if the user has admin access to the current collection.                                        |
| collectionVideos            | none                                                                       | Array<YpVideoData> \| undefined | Returns the array of videos associated with the collection, based on type.                                    |
| openMenuLabel               | none                                                                       | string      | Returns the localized label for the menu button, based on collection type.                                    |
| collectionHeaderImages      | none                                                                       | Array<YpImageData> \| undefined | Returns the array of header images for the collection, based on type.                                         |
| collectionVideoURL          | none                                                                       | string \| undefined | Returns the URL of the collection's video cover, if configured.                                               |
| collectionVideoPosterURL    | none                                                                       | string \| undefined | Returns the poster image URL for the collection's video cover, if configured.                                 |
| collectionHeaderImagePath   | none                                                                       | string \| undefined | Returns the path to the collection's header image.                                                            |
| _openAnalyticsAndPromotions | none                                                                       | void        | Redirects to the analytics and promotions page for the collection.                                            |
| _openAdmin                  | none                                                                       | void        | Redirects to the admin page for the collection.                                                               |
| _openCreateGroupFolder      | none                                                                       | void        | Placeholder for creating a group folder (currently empty).                                                    |
| renderMediaContent          | none                                                                       | unknown     | Renders the media content (welcome HTML, video, or image) for the collection.                                 |
| renderFooter                | none                                                                       | unknown     | Renders the footer section (currently empty).                                                                 |
| renderMenu                  | none                                                                       | unknown     | Renders the admin menu with action buttons (analytics, settings, etc.).                                       |
| renderStats                 | none                                                                       | unknown     | Renders the collection stats component.                                                                       |
| hideLogoImage               | none                                                                       | boolean     | Returns `true` if the logo image should be hidden based on collection configuration.                          |
| renderHeaderBanner          | none                                                                       | unknown     | Renders the header banner image if available.                                                                 |
| renderName                  | none                                                                       | unknown     | Renders the collection name using the magic text component.                                                   |
| renderDescription           | none                                                                       | unknown     | Renders the collection description or objectives using the magic text component.                              |
| render                      | none                                                                       | unknown     | Main render method. Renders the full collection header UI.                                                    |

## Examples

```typescript
import './yp-collection-header.js';

const header = document.createElement('yp-collection-header');
header.collection = {
  id: 1,
  name: "Example Community",
  description: "A sample description",
  language: "en",
  configuration: {},
  // ...other required properties
};
header.collectionType = "community";
document.body.appendChild(header);
```
