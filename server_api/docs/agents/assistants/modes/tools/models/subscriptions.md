# Service Module: SubscriptionModels

The `SubscriptionModels` class provides business logic for managing agent subscription plans, user subscriptions, and related agent product data. It interacts with several Sequelize models, including [YpSubscription](../../../../models/subscription.js), [YpSubscriptionPlan](../../../../models/subscriptionPlan.js), [YpAgentProduct](../../../../models/agentProduct.js), [YpAgentProductBundle](../../../../models/agentProductBundle.js), and [YpAgentProductRun](../../../../models/agentProductRun.js). The class is designed to be used in the context of an [YpAgentAssistant](../../../agentAssistant.js) instance.

---

## Constructor

### `new SubscriptionModels(assistant: YpAgentAssistant)`

Creates a new instance of `SubscriptionModels` bound to a specific assistant context.

| Name      | Type                | Description                                 |
|-----------|---------------------|---------------------------------------------|
| assistant | YpAgentAssistant    | The assistant instance (user/session context)|

---

## Methods

| Name                                              | Parameters                                                                                 | Return Type                                                                                       | Description                                                                                      |
|---------------------------------------------------|--------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| loadAgentSubscriptionPlans                        | none                                                                                       | `Promise<AssistantAgentPlanStatus>`                                                               | Loads all available agent subscription plans and the first available agent product bundle.        |
| loadAgentProductPlanAndSubscription               | `subscriptionPlanId: number`                                                               | `Promise<{ plan: YpSubscriptionPlanAttributes \| null; subscription: YpSubscriptionAttributes \| null; }>` | Loads a specific agent product plan and the current user's subscription to it, if any.           |
| loadUserAgentSubscriptions                        | none                                                                                       | `Promise<AssistantAgentSubscriptionStatus>`                                                       | Loads all active agent subscriptions for the current user and running agent product runs.         |
| unsubscribeFromAgentPlan                          | `subscriptionId: number`                                                                   | `Promise<UnsubscribeResult>`                                                                      | Cancels (unsubscribes) a user's active subscription to an agent plan.                            |
| subscribeToAgentPlan                              | `agentProductId: number, subscriptionPlanId: number, returnCurrentSubscription?: boolean`  | `Promise<SubscribeResult>`                                                                        | Subscribes the user to an agent plan, or returns the current subscription if requested.          |

---

### Method: `loadAgentSubscriptionPlans()`

Loads all available agent subscription plans (with their associated agent products and bundles) for the assistant's domain.

#### Returns

`Promise<AssistantAgentPlanStatus>`

- `availablePlans`: Array of available subscription plans with details.
- `availableBundle`: The first available agent product bundle, or a string if none found.
- `systemStatus`: Health and last update info.

#### Example Success Response

```json
{
  "availablePlans": [
    {
      "subscriptionPlanId": 1,
      "type": "standard",
      "name": "Pro Agent",
      "description": "Full-featured agent",
      "imageUrl": ""
    }
  ],
  "availableBundle": {
    "agentBundleId": 2,
    "name": "Starter Bundle",
    "description": "",
    "imageUrl": ""
  },
  "systemStatus": {
    "healthy": true,
    "lastUpdated": "2024-06-01T12:00:00.000Z"
  }
}
```

#### Example Error Response

```json
{
  "availablePlans": [],
  "availableBundle": "No bundle available",
  "systemStatus": {
    "healthy": false,
    "lastUpdated": "2024-06-01T12:00:00.000Z",
    "error": "Error message"
  }
}
```

---

### Method: `loadAgentProductPlanAndSubscription(subscriptionPlanId: number)`

Loads a specific agent product plan and the current user's subscription to it, if any.

#### Parameters

| Name               | Type   | Description                                 |
|--------------------|--------|---------------------------------------------|
| subscriptionPlanId | number | The ID of the subscription plan to load.    |

#### Returns

`Promise<{ plan: YpSubscriptionPlanAttributes | null; subscription: YpSubscriptionAttributes | null; }>`

- `plan`: The subscription plan details (with agent product), or `null` if not found.
- `subscription`: The user's active subscription to the plan, or `null` if not subscribed.

#### Throws

- `Error` if the plan is not found.

---

### Method: `loadUserAgentSubscriptions()`

Loads all active agent subscriptions for the current user and running agent product runs for the assistant's domain.

#### Returns

`Promise<AssistantAgentSubscriptionStatus>`

- `availableSubscriptions`: Array of the user's active subscriptions (with plan and agent product details).
- `runningAgents`: Array of currently running agent product runs for the domain.
- `systemStatus`: Health and last update info.

#### Example Success Response

```json
{
  "availableSubscriptions": [
    {
      // YpSubscription instance with included Plan and AgentProduct
    }
  ],
  "runningAgents": [
    {
      "runId": 123,
      "agentProductId": 1,
      "agentRunId": 123,
      "agentName": "Pro Agent",
      "startTime": "2024-06-01T12:00:00.000Z",
      "status": "running",
      "workflow": "default",
      "subscriptionId": 456
    }
  ],
  "systemStatus": {
    "healthy": true,
    "lastUpdated": "2024-06-01T12:00:00.000Z"
  }
}
```

#### Example Error Response

```json
{
  "availableSubscriptions": [],
  "runningAgents": [],
  "systemStatus": {
    "healthy": false,
    "lastUpdated": "2024-06-01T12:00:00.000Z",
    "error": "Error message"
  }
}
```

---

### Method: `unsubscribeFromAgentPlan(subscriptionId: number)`

Cancels (unsubscribes) a user's active subscription to an agent plan.

#### Parameters

| Name           | Type   | Description                                 |
|----------------|--------|---------------------------------------------|
| subscriptionId | number | The ID of the subscription to cancel.       |

#### Returns

`Promise<UnsubscribeResult>`

- On success:
  ```json
  {
    "success": true,
    "subscriptionId": 123
  }
  ```
- On failure:
  ```json
  {
    "success": false,
    "error": "Subscription not found or already inactive"
  }
  ```

---

### Method: `subscribeToAgentPlan(agentProductId: number, subscriptionPlanId: number, returnCurrentSubscription?: boolean)`

Subscribes the user to an agent plan, or returns the current subscription if requested.

#### Parameters

| Name                     | Type    | Description                                                                 |
|--------------------------|---------|-----------------------------------------------------------------------------|
| agentProductId           | number  | The ID of the agent product to subscribe to.                                |
| subscriptionPlanId       | number  | The ID of the subscription plan.                                            |
| returnCurrentSubscription| boolean | If true, returns the current subscription if it exists (default: false).    |

#### Returns

`Promise<SubscribeResult>`

- On success:
  ```json
  {
    "success": true,
    "plan": { /* YpSubscriptionPlanAttributes */ },
    "subscription": { /* YpSubscriptionAttributes */ }
  }
  ```
- On failure:
  ```json
  {
    "success": false,
    "error": "User already subscribed to this plan"
  }
  ```

---

## Dependencies

- [YpSubscription](../../../../models/subscription.js)
- [YpSubscriptionPlan](../../../../models/subscriptionPlan.js)
- [YpAgentProduct](../../../../models/agentProduct.js)
- [YpAgentProductBundle](../../../../models/agentProductBundle.js)
- [YpAgentProductRun](../../../../models/agentProductRun.js)
- [YpAgentAssistant](../../../agentAssistant.js)
- [Sequelize Op](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators)

---

## Types Used

> **Note:** These types are assumed to be defined elsewhere in your codebase.

- `AssistantAgentPlanStatus`
- `AssistantAgentSubscriptionStatus`
- `YpSubscriptionPlanAttributes`
- `YpSubscriptionAttributes`
- `UnsubscribeResult`
- `SubscribeResult`

---

## Example Usage

```typescript
import { SubscriptionModels } from './path/to/SubscriptionModels';
import { YpAgentAssistant } from '../../../agentAssistant.js';

const assistant = new YpAgentAssistant(/* ... */);
const subscriptionModels = new SubscriptionModels(assistant);

// Load available plans
const plansStatus = await subscriptionModels.loadAgentSubscriptionPlans();

// Subscribe to a plan
const result = await subscriptionModels.subscribeToAgentPlan(1, 2);

// Unsubscribe from a plan
const unsubResult = await subscriptionModels.unsubscribeFromAgentPlan(123);
```

---

## See Also

- [YpSubscription Model](../../../../models/subscription.js)
- [YpSubscriptionPlan Model](../../../../models/subscriptionPlan.js)
- [YpAgentProduct Model](../../../../models/agentProduct.js)
- [YpAgentProductBundle Model](../../../../models/agentProductBundle.js)
- [YpAgentProductRun Model](../../../../models/agentProductRun.js)
- [YpAgentAssistant](../../../agentAssistant.js)
