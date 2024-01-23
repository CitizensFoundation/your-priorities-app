# PlausibleCurrentVisitors

`PlausibleCurrentVisitors` is a custom web component that extends `PlausibleBaseElementWithState` to display the current number of visitors on a site. It uses the Plausible analytics API to fetch and display this data.

## Properties

| Name                             | Type                 | Description                                                                                   |
|----------------------------------|----------------------|-----------------------------------------------------------------------------------------------|
| currentVisitors                  | number \| undefined  | The current number of visitors on the site, or undefined if not yet loaded.                    |
| useTopStatsForCurrentVisitors    | boolean              | A flag to use top stats for current visitors as a workaround until the API supports it.       |

## Methods

| Name            | Parameters | Return Type | Description                                                                                   |
|-----------------|------------|-------------|-----------------------------------------------------------------------------------------------|
| connectedCallback |            | void        | Lifecycle method that runs when the component is added to the DOM. Sets up the timer and initial count update. |
| updateCount     |            | Promise<null \| void> | Fetches the current visitor count from the API and updates the `currentVisitors` property.    |
| render          |            | TemplateResult \| null | Renders the current visitor count or nothing if there are no visitors or filters applied.     |

## Events

- **No custom events are emitted by this component.**

## Examples

```typescript
// Example usage of the PlausibleCurrentVisitors web component
<pl-current-visitors
  .currentVisitors=${5}
  .useTopStatsForCurrentVisitors=${false}
></pl-current-visitors>
```

**Note:** The above example assumes that the component is already defined and registered as a custom element in the browser, and that the necessary properties (`currentVisitors` and `useTopStatsForCurrentVisitors`) are being passed correctly.