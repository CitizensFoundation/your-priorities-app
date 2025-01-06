# YpPostMap

`YpPostMap` is a custom web component that extends `YpBaseElement` to display a map with markers representing posts. It integrates with Google Maps and provides functionality to handle post data and interactions with map markers.

## Properties

| Name           | Type                      | Description                                                                 |
|----------------|---------------------------|-----------------------------------------------------------------------------|
| posts          | Array<YpPostData> \| undefined | An array of post data to be displayed as markers on the map.                |
| groupId        | number \| undefined       | The ID of the group whose posts are to be displayed.                        |
| communityId    | number \| undefined       | The ID of the community whose posts are to be displayed.                    |
| noPosts        | boolean                   | Indicates whether there are no posts to display on the map.                 |
| selectedPost   | YpPostData \| undefined   | The currently selected post, typically when a marker is clicked.            |
| collectionId   | number                    | The ID of the collection (either group or community) to be displayed.       |
| collectionType | string                    | The type of collection, either 'community' or 'group'.                      |

## Methods

| Name                | Parameters                                      | Return Type | Description                                                                 |
|---------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| updated             | changedProperties: Map<string \| number \| symbol, unknown> | void        | Called when the element's properties change. Handles changes to `groupId` and `communityId`. |
| renderInfoCard      | post: YpPostData                                | TemplateResult \| typeof nothing | Renders an information card for a given post.                               |
| render              |                                                 | TemplateResult | Renders the component's template, including the map and markers.            |
| resetMapHeight      |                                                 | void        | Adjusts the map's height based on the window size and other conditions.     |
| connectedCallback   |                                                 | void        | Lifecycle method called when the element is added to the document. Sets up initial state and event listeners. |
| disconnectedCallback|                                                 | void        | Lifecycle method called when the element is removed from the document. Cleans up event listeners. |
| _groupChanged       |                                                 | Promise<void> | Fetches and updates post data when the `groupId` changes.                   |
| _communityChanged   |                                                 | Promise<void> | Fetches and updates post data when the `communityId` changes.               |
| _refreshAjax        |                                                 | void        | Refreshes the post data based on the current `groupId` or `communityId`.    |
| _response           | response: Array<YpPostData>                     | void        | Handles the response from the server, updating the posts and map display.   |
| markerClick         | post: YpPostData                                | void        | Handles the click event on a map marker, updating the selected post.        |

## Examples

```typescript
// Example usage of the YpPostMap component
import './yp-post-map.js';

const postMap = document.createElement('yp-post-map');
postMap.collectionId = 123;
postMap.collectionType = 'community';
document.body.appendChild(postMap);
```

This component is designed to work with a Google Maps API key and requires the `lit-google-map` and `yp-post-card` components to be available in the project. It listens for global events to refresh post data and adjusts the map view accordingly.