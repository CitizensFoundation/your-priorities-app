# Model: YpAgentProductBoosterPurchase

Represents a purchase of additional "booster" runs for a specific agent product by a user, typically as an add-on to a subscription plan. This model tracks the purchase details, payment, and associations to users, products, plans, and discounts.

## Properties

| Name                | Type                | Description                                                                 |
|---------------------|---------------------|-----------------------------------------------------------------------------|
| id                  | number              | Primary key. Auto-incremented integer.                                      |
| uuid                | string (UUID)       | Universally unique identifier for the purchase.                             |
| user_id             | number              | Foreign key referencing the purchasing user ([YpSubscriptionUser](./subscriptionUser.md)). |
| agent_product_id    | number              | Foreign key referencing the agent product ([YpAgentProduct](./agentProduct.md)). |
| subscription_plan_id| number              | Foreign key referencing the subscription plan ([YpSubscriptionPlan](./subscriptionPlan.md)). |
| runs_purchased      | number              | Number of booster runs purchased.                                           |
| amount              | number (decimal)    | Total amount paid for the purchase.                                         |
| currency            | string              | Currency code (e.g., 'USD'). Default: 'USD'.                                |
| purchase_date       | Date                | Date and time of the purchase. Defaults to current timestamp.               |
| payment_method      | string (optional)   | Payment method used (e.g., 'credit_card', 'paypal').                        |
| status              | string              | Status of the purchase (e.g., 'completed'). Default: 'completed'.           |
| transaction_id      | string (optional)   | Payment processor transaction identifier.                                   |
| metadata            | any (JSON)          | Additional metadata as a JSON object. Default: `{}`.                        |
| discount_id         | number (optional)   | Foreign key referencing a discount ([YpDiscount](./discount.md)), if applied.|
| created_at          | Date                | Timestamp when the record was created.                                      |
| updated_at          | Date                | Timestamp when the record was last updated.                                 |

## Associations

| Association      | Model                                                                 | Foreign Key         | Description                                  |
|------------------|-----------------------------------------------------------------------|---------------------|----------------------------------------------|
| User             | [YpSubscriptionUser](./subscriptionUser.md)                          | user_id             | The user who made the purchase.              |
| AgentProduct     | [YpAgentProduct](./agentProduct.md)                                  | agent_product_id    | The agent product for which boosters were purchased. |
| SubscriptionPlan | [YpSubscriptionPlan](./subscriptionPlan.md)                          | subscription_plan_id| The subscription plan associated with the purchase. |
| Discount         | [YpDiscount](./discount.md)                                          | discount_id         | The discount applied to the purchase, if any.|

## Sequelize Model Configuration

- **Table Name:** `agent_product_booster_purchases`
- **Timestamps:** `created_at`, `updated_at` (managed by Sequelize)
- **Indexes:**
  - Unique index on `uuid`
  - Indexes on `user_id`, `agent_product_id`, `subscription_plan_id`, `discount_id`
- **Naming Convention:** Uses underscored column names (e.g., `created_at`).

## Example

```typescript
import { YpAgentProductBoosterPurchase } from './agentProductBoosterPurchase';

// Creating a new booster purchase
const purchase = await YpAgentProductBoosterPurchase.create({
  user_id: 123,
  agent_product_id: 456,
  subscription_plan_id: 789,
  runs_purchased: 10,
  amount: 49.99,
  currency: 'USD',
  payment_method: 'credit_card',
  status: 'completed',
  purchase_date: new Date(),
  metadata: { promo: 'SUMMER2024' }
});
```

## See Also

- [YpSubscriptionUser](./subscriptionUser.md)
- [YpAgentProduct](./agentProduct.md)
- [YpSubscriptionPlan](./subscriptionPlan.md)
- [YpDiscount](./discount.md)

---

**Note:**  
This model is part of the Policy Synth agent system. For more information on the agent data models, see [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts).