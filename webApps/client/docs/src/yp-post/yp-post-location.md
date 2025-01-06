# YpPostLocation

`YpPostLocation` is a custom web component that extends `YpBaseElement`. It integrates with Google Maps to display and manage location data for posts.

## Properties

| Name                  | Type                          | Description                                                                 |
|-----------------------|-------------------------------|-----------------------------------------------------------------------------|
| map                   | YpLitGoogleMapElement \| undefined | The Google Map element used for displaying the map.                         |
| group                 | YpGroupData \| undefined      | The group data associated with the location.                                |
| post                  | YpPostData \| undefined       | The post data associated with the location.                                 |
| defaultLatitude       | number                        | The default latitude for the map.                                           |
| defaultLongitude      | number                        | The default longitude for the map.                                          |
| mapSearchString       | string                        | The search string used for map queries.                                     |
| mapSearchResultAddress| string                        | The address result from a map search.                                       |
| location              | YpLocationData \| undefined   | The current location data.                                                  |
| encodedLocation       | string \| undefined           | The JSON string representation of the current location.                     |
| marker                | HTMLElement \| undefined      | The marker element on the map.                                              |
| active                | boolean                       | Indicates if the component is active.                                       |
| narrowPad             | boolean                       | Indicates if the component is in narrow pad mode.                           |

## Methods

| Name               | Parameters                                      | Return Type | Description                                                                 |
|--------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| updated            | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method called when properties change. Handles changes to `group`, `location`, and `post`. |
| render             |                                                 | TemplateResult | Renders the component's HTML template.                                      |
| _mapZoomChanged    | event: CustomEvent                              | void        | Updates the map zoom level when the map zoom changes.                       |
| mapZoom            |                                                 | number      | Gets the current map zoom level.                                            |
| _submitOnEnter     | event: KeyboardEvent                            | void        | Submits the map search when the Enter key is pressed.                       |
| _searchMap         |                                                 | void        | Performs a map search using the Google Places API.                         |
| connectedCallback  |                                                 | void        | Lifecycle method called when the component is added to the document. Initializes geolocation if available. |
| _zoomChanged       | event: CustomEvent                              | void        | Updates the location's zoom level and encodes the location as a JSON string.|
| _mapTypeChanged    | event: CustomEvent                              | void        | Updates the location's map type and encodes the location as a JSON string.  |
| _locationChanged   |                                                 | void        | Handles changes to the location property, updating the map and markers.     |
| _setLocation       | event: CustomEvent                              | void        | Sets the location based on a map click event.                               |
| _groupChanged      |                                                 | void        | Updates default latitude and longitude based on group configuration.        |
| _postChanged       |                                                 | void        | Resets the location when the post changes.                                  |

## Examples

```typescript
// Example usage of the YpPostLocation component
import './yp-post-location.js';

const postLocationElement = document.createElement('yp-post-location');
document.body.appendChild(postLocationElement);

postLocationElement.group = {
  // Group data
};

postLocationElement.post = {
  // Post data
};
```