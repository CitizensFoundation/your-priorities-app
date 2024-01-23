# PlausibleDashboard

The `PlausibleDashboard` class is a custom element that extends `PlausibleBaseElementWithState` to provide a dashboard interface for displaying real-time or historical data based on the provided site and query parameters. It uses the `lit` library for defining the component and managing its lifecycle.

## Properties

| Name             | Type            | Description                                                                 |
|------------------|-----------------|-----------------------------------------------------------------------------|
| history          | BrowserHistory  | An instance of `BrowserHistory` to manage navigation history.               |
| metric           | String          | The metric to display, defaulting to 'visitors'.                            |

## Methods

| Name              | Parameters | Return Type | Description                                                                 |
|-------------------|------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback |            | void        | Lifecycle method that sets up the timer, history, and query on connection.  |
| updated           | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method that reacts to property changes, specifically 'query'. |
| render            |            | TemplateResult \| typeof nothing | Renders the component based on the current state. |

## Events

- **No custom events are defined in this class.**

## Examples

```typescript
// Example usage of the PlausibleDashboard custom element
<pl-dashboard
  .history="${this.history}"
  .metric="${'visitors'}"
></pl-dashboard>
```

# Timer

A utility class used within `PlausibleDashboard` to manage a recurring timer that dispatches events at a set interval.

## Properties

| Name       | Type                     | Description                                   |
|------------|--------------------------|-----------------------------------------------|
| listeners  | Array<any>               | An array of listener functions for the timer. |
| intervalId | NodeJS.Timeout \| undefined | The ID of the interval timer.               |

## Methods

| Name       | Parameters | Return Type | Description                                      |
|------------|------------|-------------|--------------------------------------------------|
| onTick     | listener: any | void      | Adds a listener function to be called on each tick. |
| dispatchTick |            | void        | Calls all listener functions in the `listeners` array. |

## Events

- **No custom events are defined in this class.**

## Examples

```typescript
// Example usage of the Timer class
const timer = new Timer();
timer.onTick(() => {
  console.log('Tick event dispatched');
});
```

**Note:** The provided TypeScript file contains commented-out code and decorators that are not included in the documentation as they are not active parts of the codebase. Additionally, some properties and methods may be inherited from the base class `PlausibleBaseElementWithState` and are not documented here unless overridden.