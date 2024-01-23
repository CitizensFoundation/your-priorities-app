# GraphData

Represents the data structure for graph data including labels and intervals.

## Properties

| Name     | Type     | Description                           |
|----------|----------|---------------------------------------|
| interval | string   | The interval of the graph data.       |
| labels   | string[] | An array of labels for the graph data.|

# TooltipModel

Represents the model for a tooltip in the graph.

## Properties

| Name       | Type                                     | Description                                      |
|------------|------------------------------------------|--------------------------------------------------|
| opacity    | number                                   | The opacity level of the tooltip.                |
| body       | { lines: string[] }[] \| undefined       | An array of body items, each with lines of text. |
| dataPoints | { dataIndex: number; raw: number }[]     | An array of data points for the tooltip.         |

# CanvasElement

Represents a canvas element with extended properties for graphing purposes.

## Properties

| Name                | Type                       | Description                                  |
|---------------------|----------------------------|----------------------------------------------|
| getBoundingClientRect | () => DOMRect             | A function to get the bounding client rect.  |

## Methods

Inherits methods from HTMLElement.

# dateFormatter

A function that formats dates based on the specified interval and form.

## Methods

| Name          | Parameters                        | Return Type | Description                                      |
|---------------|-----------------------------------|-------------|--------------------------------------------------|
| dateFormatter | interval: string, longForm: boolean | Function    | Returns a function that formats ISO date strings.|

# GraphTooltip

A function that creates a tooltip for a graph.

## Methods

| Name         | Parameters                                                                                   | Return Type | Description                                      |
|--------------|----------------------------------------------------------------------------------------------|-------------|--------------------------------------------------|
| GraphTooltip | graphData: GraphData, metric: string, mainCanvasElement: CanvasElement, tooltipElement: HTMLElement | Function    | Returns a function that handles tooltip rendering.|

# buildDataSet

A function that builds a dataset for a graph.

## Methods

| Name        | Parameters                                                                                   | Return Type | Description                                      |
|-------------|----------------------------------------------------------------------------------------------|-------------|--------------------------------------------------|
| buildDataSet | plot: Array<number \| undefined>, present_index: number \| null, ctx: CanvasRenderingContext2D, label: string, isPrevious: boolean | Array       | Returns an array of datasets for the graph.      |

## Examples

```typescript
// Example usage of dateFormatter
const formattedDate = dateFormatter('month', true)('2023-04-01');
console.log(formattedDate); // Outputs: April 2023

// Example usage of GraphTooltip
const tooltipFunction = GraphTooltip(graphData, 'visits', mainCanvasElement, tooltipElement);
chartInstance.options.tooltips.callbacks.label = tooltipFunction;

// Example usage of buildDataSet
const datasets = buildDataSet(plotData, presentIndex, chartContext, 'Visits', false);
chartInstance.data.datasets = datasets;
chartInstance.update();
```