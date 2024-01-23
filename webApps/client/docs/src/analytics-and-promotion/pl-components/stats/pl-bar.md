# PlausibleBar

`PlausibleBar` is a custom web component that extends `PlausibleBaseElement` to display a horizontal bar, typically used to represent data such as visitor counts in a bar chart. The width of the bar is dynamically calculated based on the `count` property and the maximum value within the `all` array for the specified `plot` property.

## Properties

| Name              | Type                             | Description                                                                 |
|-------------------|----------------------------------|-----------------------------------------------------------------------------|
| count             | number                           | The value that the bar represents.                                          |
| all               | Array<Record<string, number>>    | An array of objects with numeric values used to calculate the bar's width.  |
| maxWidthDeduction | string                           | A string representing a CSS value to deduct from the bar's maximum width.   |
| plot              | string                           | The key within the `all` array objects to use for calculating the bar width.|
| bg                | string \| undefined              | An optional background class to apply to the bar element.                   |

## Methods

| Name       | Parameters        | Return Type | Description                 |
|------------|-------------------|-------------|-----------------------------|
| barWidth   | count: number, all: Array<Record<string, number>>, plot: string | number | Calculates the width of the bar as a percentage based on the count and the maximum value in the all array for the given plot. |

## Events

None.

## Examples

```typescript
// Example usage of the PlausibleBar web component
<pl-bar
  count={100}
  all={[{ visitors: 150 }, { visitors: 100 }, { visitors: 200 }]}
  maxWidthDeduction="20px"
  plot="visitors"
  bg="bg-blue-500"
></pl-bar>
```

Note: The above example assumes you have a web component setup with the `pl-bar` tag name and the necessary properties bound accordingly. The `bg` property is used to apply a background color class, which should be defined in your CSS.