# PlausibleDashboard

`PlausibleDashboard` is a custom web component that extends `PlausibleBaseElementWithState` to provide a dashboard interface for displaying real-time or historical data based on the provided site and query parameters. It manages its own state and responds to browser history changes.

## Properties

| Name          | Type            | Description                                           |
|---------------|-----------------|-------------------------------------------------------|
| history       | BrowserHistory  | An object to manage the browser history state.        |
| metric        | String          | The metric to display, defaulting to 'visitors'.      |

## Methods

| Name              | Parameters                                | Return Type | Description                                                                 |
|-------------------|-------------------------------------------|-------------|-----------------------------------------------------------------------------|
| resetState        |                                           | void        | Resets the component's state.                                               |
| connectedCallback |                                           | void        | Lifecycle method that runs when the component is added to the DOM.          |
| updated           | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method that runs when the component's properties have been updated. |
| render            |                                           | TemplateResult \| typeof nothing | Renders the component's HTML template.                                      |

## Events

- **No custom events are defined in this component.**

## Examples

```typescript
// Example usage of the PlausibleDashboard web component
<pl-dashboard
  .history="${this.history}"
  .metric="${'visitors'}"
></pl-dashboard>
```

Note: The actual usage of the component would depend on the context in which it is used, including the necessary properties and methods to interact with the component's functionality.