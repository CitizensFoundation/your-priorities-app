# PlausibleLineGraph

The `PlausibleLineGraph` class is a custom web component that extends `PlausibleBaseElementWithState` to display line graphs using Chart.js. It is responsible for rendering a line graph based on the provided graph data and metric, handling user interactions, and updating the graph when necessary.

## Properties

| Name          | Type                                      | Description                                                                                   |
|---------------|-------------------------------------------|-----------------------------------------------------------------------------------------------|
| graphData     | any                                       | The data used to plot the graph.                                                              |
| metric        | string                                    | The metric to be displayed on the graph.                                                      |
| ctx           | CanvasRenderingContext2D \| null          | The rendering context for the canvas element.                                                 |
| darkTheme     | boolean                                   | Indicates whether the dark theme is enabled.                                                  |
| chart         | Chart \| undefined                        | The Chart.js instance used to render the graph.                                               |
| updateMetric  | Function \| undefined                     | A function to update the metric being displayed.                                              |
| history       | any                                       | The browsing history object.                                                                  |
| topStatData   | PlausibleTopStatsData \| undefined        | Data for the top statistics component.                                                        |
| canvasElement | HTMLCanvasElement                         | The canvas element where the graph is drawn.                                                  |
| exported      | boolean                                   | Indicates whether the data has been exported.                                                 |

## Methods

| Name                  | Parameters        | Return Type | Description                                                                                   |
|-----------------------|-------------------|-------------|-----------------------------------------------------------------------------------------------|
| regenerateChart       |                   | Chart       | Regenerates the chart instance with the current graph data and metric.                        |
| repositionTooltip     | e: MouseEvent     | void        | Repositions the tooltip based on the mouse event.                                             |
| updateWindowDimensions| chart: Chart, dimensions: any | void | Updates the chart's tick limits based on the new dimensions.                                  |
| onClick               | e: CustomEvent    | void        | Handles click events on the graph, potentially navigating to a different query.               |
| pollExportReady       |                   | void        | Polls to check if the export is ready and updates the `exported` property accordingly.        |
| downloadSpinner       |                   | void        | Initiates the download spinner animation and starts the export readiness polling.             |
| downloadLink          |                   | TemplateResult \| nothing | Returns the download link HTML or nothing if not applicable.       |
| samplingNotice        |                   | TemplateResult \| nothing | Returns the sampling notice HTML or nothing if not applicable.     |
| importedNotice        |                   | TemplateResult \| nothing | Returns the imported notice HTML or nothing if not applicable.     |

## Events (if any)

- **mousemove**: The `mousemove` event is used to reposition the tooltip when the mouse moves over the graph.

## Examples

```typescript
// Example usage of the PlausibleLineGraph web component
<pl-line-graph
  .graphData=${this.graphData}
  .metric=${this.metric}
  .darkTheme=${this.darkTheme}
  .updateMetric=${this.updateMetric}
  .history=${this.history}
  .topStatData=${this.topStatData}
></pl-line-graph>
```

Note: The actual usage of the component would depend on the context in which it is used, including the data passed to the properties and the surrounding HTML or web component structure.