# PlausableCountriesMap

A custom web component that renders an interactive map displaying visitor data for different countries.

## Properties

| Name        | Type                             | Description                                       |
|-------------|----------------------------------|---------------------------------------------------|
| countries   | PlausibleCountryData[] \| undefined | An array of country data for the map.             |
| loading     | boolean                          | Indicates whether the map is currently loading.   |
| darkTheme   | boolean                          | Determines if the dark theme is applied to the map.|
| history     | BrowserHistory \| undefined      | Browser history object for navigation.            |
| map         | any                              | The map instance.                                 |

## Methods

| Name                  | Parameters | Return Type | Description                                      |
|-----------------------|------------|-------------|--------------------------------------------------|
| connectedCallback     | -          | void        | Lifecycle method called when the element is added to the DOM. |
| updated               | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method called after the element's properties have been updated. |
| disconnectedCallback  | -          | void        | Lifecycle method called when the element is removed from the DOM. |
| firstUpdated          | -          | void        | Lifecycle method called after the element's first render. |
| getDataset            | -          | Record<string, { fillColor: string }> | Generates a dataset for the map based on the countries property. |
| updateCountries       | -          | Promise<void> | Fetches country data and updates the map colors. |
| fetchCountries        | -          | Promise<void> | Fetches country data from the API. |
| resizeMap             | -          | void        | Resizes the map to fit the container. |
| drawMap               | -          | void        | Draws the map with country data. |
| onClick               | -          | void        | Placeholder method for click events on the map. |
| geolocationDbNotice   | -          | html \| null | Renders a notice about the geolocation service provider. |
| renderBody            | -          | html \| null | Renders the main content of the map component. |
| render                | -          | html        | Renders the component. |

## Events

- **No custom events are defined for this component.**

## Examples

```typescript
// Example usage of the PlausableCountriesMap web component
<pl-countries-map
  .countries=${this.countriesData}
  .loading=${this.isLoading}
  .darkTheme=${this.isDarkThemeEnabled}
  .history=${this.browserHistory}
></pl-countries-map>
```

Please note that the actual usage may vary depending on the context and the data provided to the component.