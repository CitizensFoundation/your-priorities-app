# YpDataVisualization

A custom web component that extends `YpBaseElement` to visualize data in the form of charts. It is designed to display group data and targets in a graphical format.

## Properties

| Name   | Type         | Description                                      |
|--------|--------------|--------------------------------------------------|
| group  | YpGroupData  | The group data object containing visualization information. |

## Methods

| Name          | Parameters                                | Return Type | Description                 |
|---------------|-------------------------------------------|-------------|-----------------------------|
| canvasSize    |                                           | number      | Getter that calculates and returns the canvas size based on the `wide` property. |
| firstUpdated  | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method that is called after the component's first render. It invokes the `_drawCharts` method. |
| formatAmount  | amount: number                            | string      | Formats the given amount as a string with a currency symbol and 'm' suffix. |
| _drawCharts   |                                           | void        | Private method that initializes the drawing of charts based on the group's configuration data. |
| _drawChart    | chartId: string, percentDone: number, labelText: string, color: string, hideGray: boolean | void        | Private method that creates a Chart.js doughnut chart on a given canvas element. |

## Events

- No custom events are emitted by this component.

## Examples

```typescript
// Example usage of YpDataVisualization
<yp-data-visualization .group="{...}"></yp-data-visualization>
```

**Note:** The actual usage would depend on the context in which this component is used and the data provided to the `group` property.