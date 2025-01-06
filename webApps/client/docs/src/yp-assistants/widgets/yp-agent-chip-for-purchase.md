# YpAgentChipForPurchase

The `YpAgentChipForPurchase` class is a custom web component that extends the `YpAgentChip` class. It is designed to display information about an agent that can be purchased, including pricing, subscription status, and other relevant details.

## Properties

| Name             | Type    | Description                                                                 |
|------------------|---------|-----------------------------------------------------------------------------|
| price            | number  | The price of the agent.                                                     |
| type             | string  | The type of the agent, default is `"coming_soon"`.                          |
| currency         | string  | The currency in which the price is specified.                               |
| maxRunsPerCycle  | number  | The maximum number of runs allowed per cycle.                               |
| isSubscribed     | string \| undefined | Indicates if the user is subscribed to the agent.                  |

## Methods

| Name               | Parameters | Return Type | Description                                                                 |
|--------------------|------------|-------------|-----------------------------------------------------------------------------|
| getSubscribedStatus | None       | string      | Returns the subscription status as a string, indicating if the user is subscribed. |

## Examples

```typescript
// Example usage of the YpAgentChipForPurchase component
import './yp-agent-chip-for-purchase.js';

const agentChip = document.createElement('yp-agent-chip-for-purchase');
agentChip.price = 29.99;
agentChip.type = 'paid';
agentChip.currency = 'USD';
agentChip.maxRunsPerCycle = 10;
agentChip.isSubscribed = 'true';

document.body.appendChild(agentChip);
```

This component uses Lit for rendering and styling, and it provides a visual representation of an agent's purchase information, including price, subscription status, and more. The component also includes styles for different states, such as when the agent is coming soon or available for a free trial.