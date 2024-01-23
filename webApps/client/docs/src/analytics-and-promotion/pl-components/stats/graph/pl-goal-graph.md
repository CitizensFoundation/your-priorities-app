# PlausibleGoalGraph

`PlausibleGoalGraph` is a custom web component that extends `PlausibleBaseGraph` to display goal-related data in a graph format. It is designed to work within the Plausible analytics ecosystem, fetching and displaying event data based on user-defined goals.

## Properties

| Name     | Type     | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| events   | string[] | An array of strings representing the events that are tied to the goals.     |

## Methods

| Name               | Parameters | Return Type | Description                                                                                   |
|--------------------|------------|-------------|-----------------------------------------------------------------------------------------------|
| filterInStatsFormat |            | string      | Generates a filter string in the stats format based on the current query filters.             |
| fetchGraphData     |            | Promise     | Fetches the graph data from the API based on the current query and sets the graph data.       |
| setGraphData       | data: any  | void        | Processes the raw data from the API and sets it in a format suitable for the graph.           |
| regenerateChart    |            | Chart       | Regenerates the chart using the current graph data and updates the chart's visual appearance. |
| renderHeader       |            | TemplateResult | Returns the HTML template for the header of the graph component.                            |

## Events

- **No custom events are defined in this component.**

## Examples

```typescript
// Example usage of the PlausibleGoalGraph component
<pl-goal-graph .events=${['SignUp', 'Purchase']}></pl-goal-graph>
```

Please note that the above example assumes that the `PlausibleGoalGraph` component is properly registered and that the necessary properties (like `.events`) are passed correctly. The actual implementation may require additional setup, such as providing a query object and handling data fetching.