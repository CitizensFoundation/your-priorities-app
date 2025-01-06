# YpAgentChip

The `YpAgentChip` is a custom web component that extends the `YpBaseElement`. It represents a visual chip element for displaying agent information, including an image, name, and description. The chip can be in a selected or unsubscribed state, which affects its appearance.

## Properties

| Name             | Type    | Description                                                                 |
|------------------|---------|-----------------------------------------------------------------------------|
| agentId          | number  | The unique identifier for the agent.                                        |
| agentName        | string  | The name of the agent.                                                      |
| agentDescription | string  | A brief description of the agent.                                           |
| agentImageUrl    | string  | The URL of the agent's image.                                               |
| isSelected       | boolean | Indicates whether the agent chip is currently selected.                     |
| isUnsubscribed   | string \| undefined | Indicates whether the agent is unsubscribed. If defined, the agent is unsubscribed. |

## Methods

| Name      | Parameters | Return Type | Description                                                                 |
|-----------|------------|-------------|-----------------------------------------------------------------------------|
| getStatus | None       | string      | Returns the status of the agent chip as a string: "unsubscribed", "selected", or an empty string if neither. |

## Examples

```typescript
// Example usage of the YpAgentChip component
import './path/to/yp-agent-chip.js';

const agentChip = document.createElement('yp-agent-chip');
agentChip.agentId = 1;
agentChip.agentName = 'Agent Smith';
agentChip.agentDescription = 'A highly skilled agent.';
agentChip.agentImageUrl = 'https://example.com/agent-smith.jpg';
agentChip.isSelected = true;
agentChip.isUnsubscribed = undefined;

document.body.appendChild(agentChip);
```

This example demonstrates how to create and configure a `YpAgentChip` element, setting its properties to display an agent's information. The chip is added to the document body, and it will render according to the specified properties.