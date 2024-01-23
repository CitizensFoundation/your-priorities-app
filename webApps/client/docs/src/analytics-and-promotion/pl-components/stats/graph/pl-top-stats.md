# PlausibleTopStats

`PlausibleTopStats` is a custom web component that extends `PlausibleBaseElement` to display top statistics for a given metric. It is designed to be used within the Plausible analytics dashboard.

## Properties

| Name          | Type                             | Description                                                                 |
|---------------|----------------------------------|-----------------------------------------------------------------------------|
| disabled      | Boolean                          | Indicates whether the component is disabled.                                |
| query         | PlausibleQueryData               | The query data used to fetch and display statistics.                        |
| updateMetric  | Function                         | A function to update the metric being displayed.                            |
| history       | any                              | The history object used for navigation.                                     |
| classsName    | String                           | The class name for the component.                                           |
| to            | PlausibleQueryData               | The query data for navigation purposes.                                     |
| metric        | String                           | The current metric being displayed.                                         |
| topStatData   | PlausibleTopStatsData \| undefined | The data object containing top statistics to be displayed.                  |

## Methods

| Name                | Parameters                | Return Type | Description                                                                                   |
|---------------------|---------------------------|-------------|-----------------------------------------------------------------------------------------------|
| renderComparison    | name: string, comparison: number | TemplateResult \| nothing | Renders the comparison of statistics with appropriate formatting and color based on the metric. |
| topStatNumberShort  | stat: PlausibleStatData   | string      | Formats the statistic number for display based on the type of metric.                         |
| topStatTooltip      | stat: PlausibleStatData   | string \| null | Generates a tooltip for the statistic if applicable.                                           |
| titleFor            | stat: PlausibleStatData   | string      | Generates a title for the statistic based on whether it is currently selected.                 |
| renderStat          | stat: PlausibleStatData   | TemplateResult | Renders a single statistic with its value and comparison.                                      |
| render              | -                         | TemplateResult \| TemplateResult[] | Renders the component with all the top statistics.                                             |

## Events (if any)

- **No custom events are defined in this component.**

## Examples

```typescript
// Example usage of the PlausibleTopStats component
<pl-top-stats
  .disabled=${false}
  .query=${yourQueryData}
  .updateMetric=${yourUpdateMetricFunction}
  .history=${yourHistoryObject}
  .classsName=${'yourClassName'}
  .to=${yourToQueryData}
  .metric=${'yourMetric'}
  .topStatData=${yourTopStatData}
></pl-top-stats>
```

Please replace `yourQueryData`, `yourUpdateMetricFunction`, `yourHistoryObject`, `yourClassName`, `yourToQueryData`, `yourMetric`, and `yourTopStatData` with the actual data and functions you intend to use with the component.