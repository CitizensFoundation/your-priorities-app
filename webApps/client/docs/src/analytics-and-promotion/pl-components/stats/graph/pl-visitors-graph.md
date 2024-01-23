# PlausibleVisitorsGraph

A custom web component that extends `PlausibleBaseElementWithState` to display a visitors graph for a website using Plausible analytics.

## Properties

| Name                             | Type                                  | Description                                                                                   |
|----------------------------------|---------------------------------------|-----------------------------------------------------------------------------------------------|
| history                          | Object                                | The browsing history object.                                                                  |
| metric                           | String                                | The metric to display on the graph (e.g., 'visitors', 'pageviews').                           |
| topStatData                      | PlausibleTopStatsData \| undefined \| null | Data for the top stats section, may be undefined or null.                                     |
| graphData                        | any                                   | The data used to render the graph.                                                            |
| useTopStatsForCurrentVisitors    | Boolean                               | A flag to determine if top stats should be used for current visitors as a workaround.         |

## Methods

| Name            | Parameters | Return Type | Description                                                                                   |
|-----------------|------------|-------------|-----------------------------------------------------------------------------------------------|
| updateMetric    | newMetric: String | void        | Updates the metric property and stores the new metric in local storage.                       |
| fetchGraphData  |            | void        | Fetches the graph data from the API based on the current metric and updates the graphData property. |
| fetchTopStatData|            | void        | Fetches the top stats data from the API and updates the topStatData property.                 |

## Events

- **No custom events are defined in this class.**

## Examples

```typescript
// Example usage of the PlausibleVisitorsGraph web component
<pl-visitors-graph
  .history="${this.history}"
  .metric="${this.metric}"
  .topStatData="${this.topStatData}"
  .graphData="${this.graphData}"
  .useTopStatsForCurrentVisitors="${this.useTopStatsForCurrentVisitors}"
></pl-visitors-graph>
```

---

# PlausibleTopStatsData

This type is referenced in the `PlausibleVisitorsGraph` class but is not defined within the provided code. It likely represents the data structure for the top statistics of a website's analytics.

## Properties

| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| (not provided)| (not provided) | (not provided)        |

## Methods

| Name       | Parameters        | Return Type | Description                 |
|------------|-------------------|-------------|-----------------------------|
| (not provided) | (not provided) | (not provided)  | (not provided) |

## Events

- **No custom events are defined for this type.**

## Examples

```typescript
// Since the type is not fully defined, an example cannot be provided.
```

---

# METRIC_MAPPING

A constant object that maps human-readable metric names to their corresponding metric keys used in the application.

## Properties

| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| (keys)        | String | Human-readable metric names (e.g., 'Unique visitors (last 30 min)'). |
| (values)      | String | Corresponding metric keys (e.g., 'visitors').        |

## Methods

- **No methods are defined for this constant object.**

## Events

- **No custom events are defined for this constant object.**

## Examples

```typescript
// Example usage of METRIC_MAPPING
const metricKey = METRIC_MAPPING['Unique visitors (last 30 min)']; // 'visitors'
```

---

# METRIC_LABELS

A constant object that provides labels for different metrics.

## Properties

| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| (keys)        | String | Metric keys (e.g., 'visitors'). |
| (values)      | String | Human-readable labels for metrics (e.g., 'Visitors').        |

## Methods

- **No methods are defined for this constant object.**

## Events

- **No custom events are defined for this constant object.**

## Examples

```typescript
// Example usage of METRIC_LABELS
const metricLabel = METRIC_LABELS['visitors']; // 'Visitors'
```

---

# METRIC_FORMATTER

A constant object that provides formatter functions for different metrics.

## Properties

| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| (keys)        | String | Metric keys (e.g., 'visitors'). |
| (values)      | Function | Formatter functions for the corresponding metric.        |

## Methods

- **No methods are defined for this constant object.**

## Events

- **No custom events are defined for this constant object.**

## Examples

```typescript
// Example usage of METRIC_FORMATTER
const formattedVisitors = METRIC_FORMATTER['visitors'](1234); // '1,234'
```