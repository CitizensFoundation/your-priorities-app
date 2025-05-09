# Service: SubscriptionManager

The `SubscriptionManager` class provides business logic for managing subscription plans, user subscriptions, payment processing (via Stripe), agent workflow cloning, and agent run lifecycle management. It interacts with various database models, Stripe API, and utility functions to facilitate subscription-based agent product workflows.

---

## Methods

| Name                                   | Parameters                                                                                                    | Return Type                                                                                                   | Description                                                                                                 |
|---------------------------------------- |---------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| `getPlans`                             | none                                                                                                          | `Promise<YpSubscriptionPlan[]>`                                                                               | Retrieves all available subscription plans, including related agent products and bundles.                   |
| `cloneCommunityTemplate`                | `communityTemplateId: number, toDomainId: number`                                                             | `Promise<any>`                                                                                                | Clones a community template to a new domain using the `copyCommunity` utility.                              |
| `cloneCommunityWorkflowTemplate`        | `agentProduct: YpAgentProduct, domainId: number, currentUser: UserClass`                                      | `Promise<{ workflow: YpAgentRunWorkflowConfiguration; requiredQuestions?: any[] }>`                           | Clones a workflow community template, including agents, groups, and workflow configuration.                 |
| `createSubscriptions`                   | `userId: number, planIds: number[], paymentMethodId: string \| null`                                          | `Promise<{ clientSecret?: string; subscriptionId?: string; freeSubscription?: boolean }>`                     | Creates Stripe payment intent for selected plans, or returns free subscription if total is zero.            |
| `handleSuccessfulPayment`               | `paymentIntentId: string`                                                                                     | `Promise<YpSubscription[]>`                                                                                   | Handles post-payment logic, creating subscriptions after successful Stripe payment.                         |
| `startAgentRun`                        | `subscriptionId: number, wsClients: Map<string, WebSocket>, wsClientId: string, currentUser: UserClass`       | `Promise<{ agentRun: YpAgentProductRun, subscription: YpSubscription }>`                                      | Starts a new agent product run for a subscription, cloning workflow and incrementing usage.                 |
| `startFirstAgent`                      | `agentProductRun: YpAgentProductRun, wsClients: Map<string, WebSocket>, wsClientId: string`                   | `Promise<boolean>`                                                                                            | Initiates the first agent in a workflow run, using WebSocket for notifications.                             |
| `stopAgentRun`                         | `agentProductRunId: number`                                                                                   | `Promise<void>`                                                                                               | Stops an agent run, marking it as completed and recording duration.                                         |
| `calculateNextBillingDate` (private)   | `planId: number`                                                                                              | `Promise<Date>`                                                                                               | Calculates the next billing date based on the plan's billing cycle.                                         |
| `incrementRunsUsed` (private)           | `subscription: YpSubscription`                                                                                | `Promise<void>`                                                                                               | Increments the number of runs used in a subscription and checks for limits.                                 |
| `checkRunsLimit` (private)              | `subscription: YpSubscription`                                                                                | `Promise<void>`                                                                                               | Throws an error if the subscription has reached its maximum allowed runs per cycle.                         |

---

## Method Details

### getPlans

Retrieves all available subscription plans, including their associated agent products and bundles.

#### Parameters

_None_

#### Returns

- `Promise<YpSubscriptionPlan[]>`: Array of subscription plan instances.

---

### cloneCommunityTemplate

Clones a community template to a new domain using the `copyCommunity` utility.

#### Parameters

| Name                | Type   | Description                                 |
|---------------------|--------|---------------------------------------------|
| communityTemplateId | number | ID of the community template to clone.      |
| toDomainId          | number | Target domain ID for the new community.     |

#### Returns

- `Promise<any>`: The newly created community object.

---

### cloneCommunityWorkflowTemplate

Clones a workflow community template, including agents, groups, and workflow configuration.

#### Parameters

| Name         | Type           | Description                                      |
|--------------|----------------|--------------------------------------------------|
| agentProduct | YpAgentProduct | The agent product whose workflow is to be cloned.|
| domainId     | number         | Target domain ID.                                |
| currentUser  | UserClass      | The user performing the operation.               |

#### Returns

- `Promise<{ workflow: YpAgentRunWorkflowConfiguration; requiredQuestions?: any[] }>`: The cloned workflow configuration and any required questions.

---

### createSubscriptions

Creates Stripe payment intent for selected plans, or returns free subscription if total is zero.

#### Parameters

| Name           | Type                | Description                                 |
|----------------|---------------------|---------------------------------------------|
| userId         | number              | ID of the user purchasing the subscription. |
| planIds        | number[]            | Array of subscription plan IDs.             |
| paymentMethodId| string \| null      | Stripe payment method ID, or null.          |

#### Returns

- `Promise<{ clientSecret?: string; subscriptionId?: string; freeSubscription?: boolean }>`: Stripe client secret and payment intent ID, or free subscription flag.

---

### handleSuccessfulPayment

Handles post-payment logic, creating subscriptions after successful Stripe payment.

#### Parameters

| Name           | Type     | Description                                 |
|----------------|----------|---------------------------------------------|
| paymentIntentId| string   | Stripe payment intent ID.                   |

#### Returns

- `Promise<YpSubscription[]>`: Array of created subscription instances.

---

### startAgentRun

Starts a new agent product run for a subscription, cloning workflow and incrementing usage.

#### Parameters

| Name           | Type                           | Description                                 |
|----------------|--------------------------------|---------------------------------------------|
| subscriptionId | number                         | ID of the subscription.                     |
| wsClients      | Map<string, WebSocket>         | Map of WebSocket clients.                   |
| wsClientId     | string                         | WebSocket client ID.                        |
| currentUser    | UserClass                      | The user starting the run.                  |

#### Returns

- `Promise<{ agentRun: YpAgentProductRun, subscription: YpSubscription }>`: The created agent run and the subscription.

---

### startFirstAgent

Initiates the first agent in a workflow run, using WebSocket for notifications.

#### Parameters

| Name            | Type                           | Description                                 |
|-----------------|--------------------------------|---------------------------------------------|
| agentProductRun | YpAgentProductRun              | The agent product run instance.             |
| wsClients       | Map<string, WebSocket>         | Map of WebSocket clients.                   |
| wsClientId      | string                         | WebSocket client ID.                        |

#### Returns

- `Promise<boolean>`: `true` if the agent started successfully, `false` otherwise.

---

### stopAgentRun

Stops an agent run, marking it as completed and recording duration.

#### Parameters

| Name              | Type     | Description                                 |
|-------------------|----------|---------------------------------------------|
| agentProductRunId | number   | ID of the agent product run to stop.        |

#### Returns

- `Promise<void>`

---

### calculateNextBillingDate (private)

Calculates the next billing date based on the plan's billing cycle.

#### Parameters

| Name   | Type   | Description                                 |
|--------|--------|---------------------------------------------|
| planId | number | ID of the subscription plan.                |

#### Returns

- `Promise<Date>`: The next billing date.

---

### incrementRunsUsed (private)

Increments the number of runs used in a subscription and checks for limits.

#### Parameters

| Name         | Type           | Description                                 |
|--------------|----------------|---------------------------------------------|
| subscription | YpSubscription | The subscription instance.                  |

#### Returns

- `Promise<void>`

---

### checkRunsLimit (private)

Throws an error if the subscription has reached its maximum allowed runs per cycle.

#### Parameters

| Name         | Type           | Description                                 |
|--------------|----------------|---------------------------------------------|
| subscription | YpSubscription | The subscription instance.                  |

#### Returns

- `Promise<void>`

---

## Dependencies

- **Models:**  
  - [YpSubscriptionPlan](../models/subscriptionPlan.js)
  - [YpSubscription](../models/subscription.js)
  - [YpAgentProduct](../models/agentProduct.js)
  - [YpAgentProductRun](../models/agentProductRun.js)
  - [YpAgentProductBundle](../models/agentProductBundle.js)
  - [PsAgentConnector](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agentConnector.ts)
  - [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)
  - [PsAgentClass, PsAiModel, User](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/index.ts)
- **Utilities:**  
  - `copyCommunity`, `copyGroup` from `../../utils/copy_utils.cjs`
- **External:**  
  - [Stripe](https://www.npmjs.com/package/stripe)
  - [WebSocket](https://www.npmjs.com/package/ws)
- **Other Services:**  
  - [NotificationAgentQueueManager](./notificationAgentQueueManager.md)

---

## Example Usage

```typescript
import { SubscriptionManager } from './SubscriptionManager';

const manager = new SubscriptionManager();

// Get all plans
const plans = await manager.getPlans();

// Create a subscription (with Stripe payment)
const result = await manager.createSubscriptions(userId, [planId], paymentMethodId);

// Handle payment confirmation
const subscriptions = await manager.handleSuccessfulPayment(paymentIntentId);

// Start an agent run
const { agentRun, subscription } = await manager.startAgentRun(subscriptionId, wsClients, wsClientId, currentUser);

// Start the first agent in the run
const started = await manager.startFirstAgent(agentRun, wsClients, wsClientId);

// Stop an agent run
await manager.stopAgentRun(agentProductRunId);
```

---

## See Also

- [YpSubscriptionPlan](../models/subscriptionPlan.js)
- [YpSubscription](../models/subscription.js)
- [YpAgentProduct](../models/agentProduct.js)
- [YpAgentProductRun](../models/agentProductRun.js)
- [NotificationAgentQueueManager](./notificationAgentQueueManager.md)
- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)
- [PsAgentConnector](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agentConnector.ts)
- [copyCommunity Utility](../../utils/copy_utils.cjs)
