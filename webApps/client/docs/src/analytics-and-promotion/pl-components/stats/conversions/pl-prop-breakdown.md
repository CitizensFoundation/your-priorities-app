# PlausiblePropBreakdown

A custom element that displays a breakdown of properties for a given goal in Plausible analytics.

## Properties

| Name                 | Type                             | Description                                                                 |
|----------------------|----------------------------------|-----------------------------------------------------------------------------|
| onClickFunction      | any                              | Function to execute on click events.                                        |
| goal                 | PlausibleGoalData                | The goal data object containing properties to display.                      |
| propKey              | string                           | The key of the property to display the breakdown for.                       |
| storageKey           | string                           | The key used for storing data in local storage.                             |
| loading              | boolean                          | Indicates whether the component is currently loading data.                  |
| viewport             | number                           | The width of the viewport, used for responsive design.                      |
| breakdown            | PlausiblePropValueData[]         | An array of property value data for the breakdown.                          |
| page                 | number                           | The current page number for pagination.                                     |
| moreResultsAvailable | boolean                          | Indicates whether there are more results available for pagination.          |

## Methods

| Name                  | Parameters | Return Type | Description                                                                 |
|-----------------------|------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback     |            | void        | Lifecycle method that runs when the element is added to the document's DOM. |
| disconnectedCallback  |            | void        | Lifecycle method that runs when the element is removed from the document's DOM. |
| handleResize          |            | void        | Handles the resize event and updates the viewport property.                 |
| getBarMaxWidth        |            | string      | Returns the maximum width for the bar based on the viewport size.           |
| fetchPropBreakdown    |            | void        | Fetches the property breakdown data from the API.                           |
| loadMore              |            | void        | Loads more property breakdown data.                                         |
| renderUrl             | value: PlausiblePropValueData | TemplateResult | Renders a URL if the value name is a valid HTTP URL.                        |
| renderPropContent     | value: PlausiblePropValueData, query: URLSearchParams | TemplateResult | Renders the content for a property value.                                   |
| renderPropValue       | value: PlausiblePropValueData | TemplateResult | Renders a single property value with its associated data.                   |
| changePropKey         | newKey: string | void        | Changes the current property key and fetches the associated breakdown data. |
| renderLoading         |            | TemplateResult | Renders the loading indicator or the load more button.                      |
| renderBody            |            | TemplateResult[] | Renders the body content with the breakdown of property values.             |
| renderPill            | key: string | TemplateResult | Renders a pill for each property key.                                       |
| render                |            | TemplateResult | Renders the component's HTML template.                                      |

## Events

- **No custom events are emitted by this component.**

## Examples

```typescript
// Example usage of the PlausiblePropBreakdown component
<pl-prop-breakdown
  .goal=${{ prop_names: ['source', 'medium'], name: 'signup', ... }}
  .onClickFunction=${() => console.log('Clicked')}
  .propKey=${'source'}
  .storageKey=${'goalPropTab__example.comsignup'}
  .loading=${false}
  .viewport=${1080}
  .breakdown=${[
    { name: 'Google', unique_conversions: 150, total_conversions: 200, conversion_rate: 75 },
    { name: 'Direct', unique_conversions: 100, total_conversions: 120, conversion_rate: 83.33 }
  ]}
  .page=${1}
  .moreResultsAvailable=${true}
></pl-prop-breakdown>
```
