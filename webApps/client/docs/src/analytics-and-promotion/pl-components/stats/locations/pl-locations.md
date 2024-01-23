# PlausableLocations

The `PlausableLocations` class is a web component that provides an interface for displaying location-based data such as countries, regions, and cities. It allows users to switch between different views (map, countries, regions, cities) and handles user interactions to filter the displayed data.

## Properties

| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| tabKey        | String | Unique key for storing the current tab state. |
| storedTab     | String \| undefined | The stored tab state, if any. |
| mode          | String \| undefined | The current mode of the component (map, countries, regions, cities). |
| countriesRestoreMode | String \| undefined | The mode to restore to when a country filter is removed. |

## Methods

| Name             | Parameters        | Return Type | Description                 |
|------------------|-------------------|-------------|-----------------------------|
| setMode          | mode: string      | void        | Sets the current mode and stores it. |
| onCountryFilter  | mode: string      | void        | Handles the country filter event and sets the mode to 'regions'. |
| onRegionFilter   | -                 | void        | Sets the mode to 'cities' when a region is filtered. |
| renderCountries  | -                 | unknown     | Renders the countries list report. |
| renderRegions    | -                 | unknown     | Renders the regions list report. |
| renderCities     | -                 | unknown     | Renders the cities list report. |
| renderContent    | -                 | unknown     | Renders the content based on the current mode. |
| renderPill       | name: string, mode: string | unknown | Renders a navigation pill for switching modes. |

## Events

- **click**: Emitted when a country, region, or city is clicked to filter the data.

## Examples

```typescript
// Example usage of the PlausableLocations web component
<pl-locations></pl-locations>
```

Please note that the actual rendering logic uses Lit-html and is not represented in TypeScript. The `renderCountries`, `renderRegions`, `renderCities`, and `renderContent` methods return Lit-html templates, which are not directly representable in TypeScript. The `render` method is also overridden to provide the component's HTML structure using Lit-html.