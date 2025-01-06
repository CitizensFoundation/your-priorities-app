# AgentsShapeView

A custom view for rendering agent and connector nodes within a diagram, extending the `dia.ElementView` from the JointJS library.

## Properties

| Name     | Type                  | Description                                      |
|----------|-----------------------|--------------------------------------------------|
| observer | MutationObserver \| null | An observer to monitor attribute changes on nodes. |

## Methods

| Name                | Parameters | Return Type | Description                                                                 |
|---------------------|------------|-------------|-----------------------------------------------------------------------------|
| remove              | -          | this        | Disconnects the observer and removes the element from the DOM.              |
| render              | -          | this        | Renders the element, setting up the HTML structure and event listeners.     |
| setupRunningObserver| div: HTMLDivElement | void        | Sets up a MutationObserver to monitor the 'running' attribute on agent nodes. |
| updateNodePosition  | -          | void        | Debounced function to update the node's position in the server configuration. |

## Examples

```typescript
// Example usage of the AgentsShapeView
const agentShapeView = new AgentsShapeView();
agentShapeView.render();
```

# AgentShape

A custom shape class for agent nodes, extending the `shapes.standard.Rectangle` from the JointJS library.

## Properties

| Name | Type                  | Description                                      |
|------|-----------------------|--------------------------------------------------|
| view | typeof AgentsShapeView | The view class associated with this shape.       |

## Methods

| Name     | Parameters | Return Type | Description                                                                 |
|----------|------------|-------------|-----------------------------------------------------------------------------|
| defaults | -          | object      | Returns the default attributes for the shape, including type and markup.    |

## Examples

```typescript
// Example usage of the AgentShape
const agentShape = new AgentShape();
const defaults = agentShape.defaults();
console.log(defaults);
```

This documentation provides an overview of the `AgentsShapeView` and `AgentShape` classes, detailing their properties, methods, and usage examples.