# YpAgentChipSimple

A web component that displays a simplified agent chip with pricing, subscription, and agent information. Extends `YpAgentChip` and is registered as `<yp-agent-chip-simple>`. It supports different display states such as "coming soon", "free trial", and "paid", and visually indicates subscription status.

## Properties

| Name            | Type                | Description                                                                 |
|-----------------|---------------------|-----------------------------------------------------------------------------|
| price           | number              | The price of the agent.                                                     |
| type            | string              | The type of the agent chip. Defaults to `"coming_soon"`.                    |
| currency        | string              | The currency for the price (e.g., "USD").                                  |
| maxRunsPerCycle | number              | The maximum number of runs per cycle for the agent.                         |
| isSubscribed    | string \| undefined | Indicates if the user is subscribed to the agent.                           |

## Methods

| Name                | Parameters | Return Type | Description                                                                                 |
|---------------------|------------|-------------|---------------------------------------------------------------------------------------------|
| getSubscribedStatus |            | string      | Returns the localized string for "subscribed" if `isSubscribed` is set, otherwise an empty string. |
| render              |            | unknown     | Renders the component template. Overrides the `render` method from `YpAgentChip`.           |

## Examples

```typescript
import './yp-agent-chip-simple.js';

const chip = document.createElement('yp-agent-chip-simple');
chip.price = 10;
chip.type = 'paid';
chip.currency = 'USD';
chip.maxRunsPerCycle = 100;
chip.isSubscribed = 'true';
document.body.appendChild(chip);
```
