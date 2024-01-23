# PlausibleBaseGraph

Abstract class that serves as a base for graph components in a web application. It extends `PlausibleBaseElementWithState` and manages the state and rendering of a graph using Chart.js.

## Properties

| Name                         | Type                                      | Description                                                                 |
|------------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| graphData                    | any                                       | Data used to render the graph.                                               |
| ctx                          | CanvasRenderingContext2D \| null          | The rendering context for the canvas, used to draw the graph.                |
| darkTheme                    | boolean                                   | Indicates if the dark theme is enabled.                                      |
| chart                        | Chart \| undefined                        | Instance of Chart.js used to render the graph.                               |
| canvasElement                | HTMLCanvasElement                         | The canvas element where the graph is drawn.                                 |
| exported                     | boolean                                   | Indicates if the graph data is being exported.                               |
| history                      | any                                       | Browser history object used for navigation.                                  |
| chartTitle                   | string                                    | Title of the chart.                                                          |
| label                        | string                                    | Label for the dataset in the graph.                                          |
| gradientColorStop1           | string                                    | First color stop for the gradient.                                           |
| gradientColorStop2           | string                                    | Second color stop for the gradient.                                          |
| prevGradientColorStop1       | string                                    | First color stop for the previous period's gradient.                         |
| prevGradientColorStop2       | string                                    | Second color stop for the previous period's gradient.                        |
| borderColor                  | string                                    | Color of the graph's border.                                                 |
| pointBackgroundColor         | string                                    | Background color of the graph's points.                                      |
| pointHoverBackgroundColor    | string                                    | Background color of the graph's points when hovered.                         |
| prevPointHoverBackgroundColor| string                                    | Background color of the previous period's points when hovered.               |
| prevBorderColor              | string                                    | Border color of the previous period's graph.                                 |
| chartHeigh                   | number                                    | Height of the chart.                                                         |
| chartWidth                   | number                                    | Width of the chart.                                                          |
| metrics                      | PlausibleTimeseriesMetricsOptions         | Metrics option for the timeseries data.                                      |
| method                       | "aggregate" \| "timeseries"               | Method used to fetch the graph data.                                         |

## Methods

| Name                        | Parameters                                | Return Type | Description                                                                 |
|-----------------------------|-------------------------------------------|-------------|-----------------------------------------------------------------------------|
| regenerateChart             |                                           | any         | Regenerates the chart with the current data.                                |
| fetchGraphData              |                                           | any         | Fetches the data required to render the graph.                              |
| buildDataSet                | plot: string \| any[], present_index: number, ctx: { createLinearGradient: (arg0: number, arg1: number, arg2: number, arg3: number) => any }, isPrevious: boolean = false | Array       | Builds the dataset for the chart with gradients and styling.                |
| transformCustomDateForStatsQuery | query: PlausibleQueryData            | PlausibleQueryData | Transforms custom date range into a format suitable for stats query.        |
| repositionTooltip           | e: MouseEvent                             | void        | Repositions the tooltip based on mouse events.                              |
| updateWindowDimensions      | chart: Chart, dimensions: any             | void        | Updates the chart's dimensions based on the window size.                    |
| pollExportReady             |                                           | void        | Polls to check if the export is ready and updates the exported property.    |
| downloadSpinner             |                                           | void        | Initiates the download spinner animation and sets a cookie.                 |
| graphTooltip                | graphData: { interval: string; labels: { [x: string]: any } }, mainCanvasElement: { getBoundingClientRect: () => any }, tooltipElement: any | Function    | Returns a function to create and manage the graph tooltip.                  |
| onClick                     | e: CustomEvent                            | void        | Handles click events on the graph to navigate based on the selected date.   |
| downloadLink                |                                           | TemplateResult \| nothing | Renders the download link or spinner for exporting data.                   |
| renderHeader                |                                           | void        | Renders the header of the graph component.                                  |

## Events (if any)

- **No custom events are defined in this class.**

## Examples

```typescript
// Example usage of the PlausibleBaseGraph class is not provided as it is an abstract class.
```

**Note:** The `PlausibleBaseGraph` class is abstract and is intended to be extended by other classes that implement the abstract methods and provide additional functionality specific to the graph being rendered. The properties and methods listed are part of the base functionality provided by this class.