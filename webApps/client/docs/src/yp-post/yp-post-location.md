# YpPostLocation

The `YpPostLocation` class is a custom element that extends `YpBaseElement` to provide a user interface for displaying and interacting with a map. It allows users to search for locations, display markers, and customize the map view. It is designed to be used within a web application that supports LitElement and Google Maps.

## Properties

| Name                     | Type                        | Description                                                                 |
|--------------------------|-----------------------------|-----------------------------------------------------------------------------|
| map                      | YpLitGoogleMapElement       | The map element used in the component.                                      |
| group                    | YpGroupData                 | The group data associated with the map.                                     |
| post                     | YpPostData                  | The post data associated with the map.                                      |
| defaultLatitude          | Number                      | The default latitude to center the map on.                                  |
| defaultLongitude         | Number                      | The default longitude to center the map on.                                 |
| mapSearchString          | String                      | The search string used to query the map.                                    |
| mapSearchResultAddress   | String                      | The address result from the map search.                                     |
| location                 | YpLocationData              | The location data for the current marker on the map.                        |
| encodedLocation          | String                      | A string representation of the location data, typically JSON-encoded.       |
| marker                   | HTMLElement                 | The marker element displayed on the map.                                    |
| active                   | Boolean                     | Indicates whether the map is currently active.                              |
| narrowPad                | Boolean                     | Indicates whether the map should use a narrow padding style.                |

## Methods

| Name             | Parameters                | Return Type | Description                                                                 |
|------------------|---------------------------|-------------|-----------------------------------------------------------------------------|
| updated          | changedProperties: Map    | void        | Lifecycle method called when properties have changed.                       |
| render           | -                         | TemplateResult | Returns the template for the component.                                    |
| _mapZoomChanged  | event: CustomEvent        | void        | Handles changes to the map zoom level.                                      |
| mapZoom          | -                         | Number      | Getter for the current map zoom level.                                      |
| _submitOnEnter   | event: KeyboardEvent      | void        | Submits the map search when the Enter key is pressed.                       |
| _searchMap       | -                         | void        | Initiates a search on the map based on the search string.                    |
| connectedCallback| -                         | void        | Lifecycle method called when the element is added to the document's DOM.    |
| _zoomChanged     | event: CustomEvent        | void        | Handles changes to the map zoom level.                                      |
| _mapTypeChanged  | event: CustomEvent        | void        | Handles changes to the map type.                                            |
| _locationChanged | -                         | void        | Called when the location property changes.                                  |
| _setLocation     | event: CustomEvent        | void        | Sets the location based on a map event.                                     |
| _groupChanged    | -                         | void        | Called when the group property changes.                                     |
| _postChanged     | -                         | void        | Called when the post property changes.                                      |

## Events (if any)

- **map-zoom-changed**: Emitted when the zoom level of the map changes.
- **map-type-changed**: Emitted when the type of the map changes.
- **zoom-changed**: Emitted when the zoom level of the map changes.

## Examples

```typescript
// Example usage of the YpPostLocation element
<yp-post-location
  .group="${this.group}"
  .post="${this.post}"
  .location="${this.location}"
  .active="${this.active}"
  .narrowPad="${this.narrowPad}"
></yp-post-location>
```

Please note that the above example assumes that `this.group`, `this.post`, `this.location`, `this.active`, and `this.narrowPad` are properties defined in the context where the `YpPostLocation` element is used.