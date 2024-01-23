# YpDataVisualization

A custom web component for visualizing data, particularly for displaying charts related to targets and actuals. It extends `YpBaseElement` and uses Chart.js for rendering charts.

## Properties

| Name   | Type         | Description                                      |
|--------|--------------|--------------------------------------------------|
| group  | YpGroupData  | The group data object containing configuration and other relevant information for visualization. |

## Methods

| Name          | Parameters                                      | Return Type | Description                                                                 |
|---------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| canvasSize    |                                                 | number      | Getter that calculates and returns the canvas size based on the `wide` property. |
| firstUpdated  | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method that is called after the component's first render. It invokes `_drawCharts` method. |
| formatAmount  | amount: number                                  | string      | Formats the given number as a monetary value with 'm' as a suffix.          |
| _drawCharts   |                                                 | void        | Private method that initializes the drawing of charts using Chart.js.       |
| _drawChart    | chartId: string, percentDone: number, labelText: string, color: string, hideGray: boolean | void | Private method that draws an individual chart on the canvas element identified by `chartId`. |
| render        |                                                 | unknown     | Lifecycle method that renders the HTML template for the component.          |

## Events

- No custom events are emitted by this component.

## Examples

```typescript
// Example usage of YpDataVisualization
<yp-data-visualization .group="{...}"></yp-data-visualization>
```

Note: The actual usage requires a `YpGroupData` object to be passed to the `group` property.