# YpCollectionHeader

The `YpCollectionHeader` class is a custom web component that extends `YpBaseElement`. It is designed to display a header for a collection, including media content, description, and various actions related to the collection.

## Properties

| Name                  | Type                          | Description                                                                 |
|-----------------------|-------------------------------|-----------------------------------------------------------------------------|
| collection            | YpCollectionData \| undefined | The data object representing the collection.                                |
| collectionType        | string \| undefined           | The type of the collection (e.g., domain, community, group).                |
| hideImage             | boolean                       | Determines whether the image should be hidden. Default is `false`.          |
| flaggedContentCount   | number \| undefined           | The count of flagged content within the collection.                         |
| collectionVideoId     | number \| undefined           | The ID of the video associated with the collection.                         |
| welcomeHTML           | string \| undefined           | HTML content to be displayed as a welcome message.                          |
| playStartedAt         | Date \| undefined             | The date and time when media playback started.                              |
| videoPlayListener     | Function \| undefined         | Listener function for video play events.                                    |
| videoPauseListener    | Function \| undefined         | Listener function for video pause events.                                   |
| videoEndedListener    | Function \| undefined         | Listener function for video ended events.                                   |
| audioPlayListener     | Function \| undefined         | Listener function for audio play events.                                    |
| audioPauseListener    | Function \| undefined         | Listener function for audio pause events.                                   |
| audioEndedListener    | Function \| undefined         | Listener function for audio ended events.                                   |

## Methods

| Name                        | Parameters                                      | Return Type | Description                                                                 |
|-----------------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback           | None                                            | void        | Lifecycle method called when the element is added to the document.          |
| disconnectedCallback        | None                                            | void        | Lifecycle method called when the element is removed from the document.      |
| firstUpdated                | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method called after the element's first update.                   |
| updated                     | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method called after each update of the element.                   |
| _pauseMediaPlayback         | None                                            | void        | Pauses media playback for the element.                                      |
| _menuSelection              | event: CustomEvent                              | void        | Handles menu selection events.                                              |
| hasCollectionAccess         | None                                            | boolean     | Checks if the user has access to the collection.                            |
| collectionVideos            | None                                            | Array<YpVideoData> \| undefined | Retrieves the videos associated with the collection.                        |
| openMenuLabel               | None                                            | string      | Gets the label for opening the menu based on the collection type.           |
| collectionHeaderImages      | None                                            | Array<YpImageData> \| undefined | Retrieves the header images for the collection.                             |
| collectionVideoURL          | None                                            | string \| undefined | Gets the URL of the collection's video if available.                        |
| collectionVideoPosterURL    | None                                            | string \| undefined | Gets the poster URL for the collection's video if available.                |
| collectionHeaderImagePath   | None                                            | string \| undefined | Gets the path for the collection's header image.                            |
| _openAnalyticsAndPromotions | None                                            | void        | Redirects to the analytics and promotions page for the collection.          |
| _openAdmin                  | None                                            | void        | Redirects to the admin page for the collection.                             |
| _openCreateGroupFolder      | None                                            | void        | Opens the interface to create a group folder.                               |
| renderMediaContent          | None                                            | TemplateResult | Renders the media content for the collection.                               |
| renderFooter                | None                                            | TemplateResult | Renders the footer of the collection header.                                |
| renderMenu                  | None                                            | TemplateResult | Renders the menu for the collection header.                                 |
| renderStats                 | None                                            | TemplateResult | Renders the statistics for the collection.                                  |
| hideLogoImage               | None                                            | boolean     | Determines if the logo image should be hidden based on collection settings. |
| renderHeaderBanner          | None                                            | TemplateResult | Renders the header banner image for the collection.                         |
| renderName                  | None                                            | TemplateResult | Renders the name of the collection.                                         |
| renderDescription           | None                                            | TemplateResult | Renders the description of the collection.                                  |
| render                      | None                                            | TemplateResult | Renders the entire collection header component.                             |

## Examples

```typescript
// Example usage of the YpCollectionHeader web component
import './yp-collection-header.js';

const collectionHeader = document.createElement('yp-collection-header');
collectionHeader.collection = {
  id: 1,
  name: 'Sample Collection',
  description: 'This is a sample collection description.',
  configuration: {
    useVideoCover: true,
    alwaysHideLogoImage: false,
  },
  language: 'en',
};
document.body.appendChild(collectionHeader);
```