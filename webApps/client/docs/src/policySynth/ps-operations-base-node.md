# PsOperationsBaseNode

An abstract base class for operations nodes, extending `PsBaseWithRunningAgentObserver`. It provides properties and methods to manage node operations, including position and interaction with a server API.

## Properties

| Name   | Type   | Description                                      |
|--------|--------|--------------------------------------------------|
| nodeId | string | The unique identifier for the node.              |
| posX   | number | The x-coordinate position of the node. Defaults to 0. |
| posY   | number | The y-coordinate position of the node. Defaults to 0. |
| api    | PsServerApi | An instance of `PsServerApi` for server interactions. |

## Methods

| Name     | Parameters | Return Type | Description                                      |
|----------|------------|-------------|--------------------------------------------------|
| editNode | None       | void        | Fires an 'edit-node' event with the node's ID and element reference. |

## Examples

```typescript
// Example usage of the ps-operations-base-node component
import './ps-operations-base-node.js';

const node = document.createElement('ps-operations-base-node');
node.nodeId = 'node-123';
node.posX = 100;
node.posY = 200;
document.body.appendChild(node);

node.addEventListener('edit-node', (event) => {
  console.log('Edit node event fired:', event.detail);
});
```

This class is designed to be extended by other components that require node operations functionality, providing a base set of properties and methods for managing node state and interactions.