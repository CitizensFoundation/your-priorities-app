# PlausibleHistorical

`PlausibleHistorical` is a custom web component that extends `PlausibleBaseElementWithState` to display historical data for a website's analytics. It includes various sub-components to show different statistics such as current visitors, visitor graphs, sources, pages, devices, locations, and conversions.

## Properties

| Name              | Type                         | Description                                           |
|-------------------|------------------------------|-------------------------------------------------------|
| history           | BrowserHistory               | An instance of BrowserHistory to manage navigation.   |
| stuck             | boolean                      | Indicates if the navigation is stuck at the top.      |
| highlightedGoals  | string[] \| undefined        | An array of goal identifiers to highlight.            |

## Methods

| Name              | Parameters                   | Return Type | Description                                      |
|-------------------|------------------------------|-------------|--------------------------------------------------|
| render            | -                            | TemplateResult | Generates the template for the historical data view. |
| renderConversions | -                            | TemplateResult \| typeof nothing | Generates the template for the conversions section, or returns `nothing` if there are no goals. |

## Events

- **No custom events are defined in this component.**

## Examples

```typescript
// Example usage of the PlausibleHistorical component
<pl-historical
  .history=${new BrowserHistory()}
  .stuck=${true}
  .highlightedGoals=${['goal1', 'goal2']}
></pl-historical>
```

Note: The actual usage of this component would require proper context setup, including providing the `site`, `currentUserRole`, `timer`, `query`, `proxyUrl`, and `proxyFaviconBaseUrl` properties, which are inherited from `PlausibleBaseElementWithState` and are not explicitly defined in this class.