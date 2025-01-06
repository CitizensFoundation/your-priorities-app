# ConnectorShape

The `ConnectorShape` class is a custom shape that extends the `Rectangle` shape from the JointJS library. It is designed to represent a connector with specific default attributes and a custom view.

## Properties

| Name  | Type                | Description                                      |
|-------|---------------------|--------------------------------------------------|
| view  | typeof AgentsShapeView | The view associated with the `ConnectorShape`. |

## Methods

| Name       | Parameters | Return Type | Description                                                                 |
|------------|------------|-------------|-----------------------------------------------------------------------------|
| defaults   | None       | object      | Overrides the default attributes of the shape, providing custom attributes. |

## Examples

```typescript
import { ConnectorShape } from './connector-shape';

// Create a new instance of ConnectorShape
const connector = new ConnectorShape();

// Access the default attributes
console.log(connector.defaults());

// Use the custom view
console.log(connector.view);
```

This class is useful for creating custom connector shapes in diagrams, with the ability to specify custom attributes and a custom view.