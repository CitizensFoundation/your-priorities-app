# YpAgentChipForPurchase

A web component that extends `YpAgentChip` to include purchase-related information such as price, currency, and subscription status.

## Properties

| Name             | Type                | Description                                                                 |
|------------------|---------------------|-----------------------------------------------------------------------------|
| price            | number              | The price of the agent chip.                                                |
| type             | string              | The type of the agent chip, default is "coming_soon".                       |
| currency         | string              | The currency in which the price is denoted.                                 |
| maxRunsPerCycle  | number              | The maximum number of runs allowed per cycle.                               |
| isSubscribed     | string \| undefined | Indicates if the user is subscribed. If subscribed, it shows a status.      |

## Methods

| Name               | Parameters | Return Type | Description                                      |
|--------------------|------------|-------------|--------------------------------------------------|
| getSubscribedStatus | None       | string      | Returns the subscription status as a string.     |

## Examples

```typescript
// Example usage of the YpAgentChipForPurchase component
import './yp-agent-chip-for-purchase.js';

const chip = document.createElement('yp-agent-chip-for-purchase');
chip.price = 29.99;
chip.type = 'paid';
chip.currency = 'USD';
chip.maxRunsPerCycle = 10;
chip.isSubscribed = 'true';

document.body.appendChild(chip);
```

This component is styled to visually indicate different states such as "coming soon", "free trial", and "subscribed" using CSS classes. It uses the `unsafeHTML` directive to safely render HTML content within the component.