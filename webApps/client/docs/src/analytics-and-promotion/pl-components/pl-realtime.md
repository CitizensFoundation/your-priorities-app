# PlausibleRealtime

`PlausibleRealtime` is a custom web component that extends `PlausibleBaseElementWithState` to display real-time analytics data. It includes various sub-components like graphs, lists, and filters to present the data in an interactive and user-friendly manner.

## Properties

| Name              | Type                          | Description                                           |
|-------------------|-------------------------------|-------------------------------------------------------|
| history           | BrowserHistory                | An instance of BrowserHistory used for navigation.    |
| stuck             | boolean                       | Indicates if the navigation is stuck at the top.      |
| highlightedGoals  | string[] \| undefined         | An array of goal identifiers to highlight.            |

## Methods

| Name      | Parameters                                      | Return Type | Description                                                 |
|-----------|-------------------------------------------------|-------------|-------------------------------------------------------------|
| updated   | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method called after the component's properties have been updated. |
| render    | -                                               | unknown     | Renders the component's HTML template.                      |
| renderConversions | -                                               | unknown     | Renders the conversions component if the site has goals.    |

## Events

- **No custom events are defined in this component.**

## Examples

```typescript
// Example usage of the PlausibleRealtime component
<pl-realtime
  .history="${new BrowserHistory()}"
  .stuck="${true}"
  .highlightedGoals="${['goal1', 'goal2']}"
></pl-realtime>
```

Please note that the example provided is a basic illustration of how to use the `PlausibleRealtime` component in a web page. The actual implementation would require proper initialization of properties like `history`, `stuck`, and `highlightedGoals`, and it would be used within the context of a larger application where `PlausibleBaseElementWithState` and related components are defined.