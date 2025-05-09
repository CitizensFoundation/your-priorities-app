# Model: YpSubscription

Represents a subscription for a user to an agent product within a specific domain. This model tracks the subscription's lifecycle, billing, configuration, and associations to users, products, plans, runs, and discounts.

## Properties

| Name                | Type                                                                 | Description                                                                                 |
|---------------------|----------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| id                  | number                                                               | Primary key. Auto-incremented integer.                                                      |
| uuid                | string (UUID)                                                        | Universally unique identifier for the subscription.                                         |
| user_id             | number                                                               | Foreign key referencing the user who owns the subscription.                                 |
| domain_id           | number                                                               | Foreign key referencing the domain in which the subscription exists.                        |
| agent_product_id    | number                                                               | Foreign key referencing the agent product being subscribed to.                              |
| subscription_plan_id| number                                                               | Foreign key referencing the subscription plan.                                              |
| start_date          | Date                                                                 | Date when the subscription started. Defaults to current date.                               |
| end_date            | Date \| undefined                                                    | Date when the subscription ended or will end. Optional.                                     |
| next_billing_date   | Date                                                                 | Date of the next billing cycle.                                                             |
| status              | 'active' \| 'paused' \| 'cancelled' \| 'expired'                     | Current status of the subscription.                                                         |
| payment_method      | string \| undefined                                                  | Payment method used for the subscription. Optional.                                         |
| transaction_id      | string \| undefined                                                  | Transaction identifier for the last payment. Optional.                                      |
| configuration       | YpSubscriptionConfiguration \| undefined                             | JSONB configuration object for custom subscription settings. Optional.                      |
| metadata            | any                                                                  | Additional metadata as a JSONB object. Optional.                                            |
| created_at          | Date                                                                 | Timestamp when the subscription was created.                                                |
| updated_at          | Date                                                                 | Timestamp when the subscription was last updated.                                           |

### Associations

| Association Name | Type                        | Description                                                                                 |
|------------------|----------------------------|---------------------------------------------------------------------------------------------|
| User             | [YpSubscriptionUser](./subscriptionUser.md) | The user who owns the subscription.                                                          |
| AgentProduct     | [YpAgentProduct](./agentProduct.md)         | The agent product being subscribed to.                                                       |
| Plan             | [YpSubscriptionPlan](./subscriptionPlan.md) | The subscription plan associated with this subscription.                                     |
| Runs             | [YpAgentProductRun](./agentProductRun.md)[] | The runs (usages/executions) associated with this subscription.                              |
| Discounts        | [YpDiscount](./discount.md)[]               | Discounts applied to this subscription (many-to-many through `subscription_discounts`).      |

## Sequelize Model Configuration

- **Table Name:** `subscriptions`
- **Timestamps:** `created_at`, `updated_at` (managed by Sequelize)
- **Indexes:**
  - Unique index on `uuid`
  - Index on `user_id`
  - Index on `agent_product_id`
  - Index on `subscription_plan_id`
- **Underscored:** true (snake_case columns)
- **Associations:** See above

## Example

```typescript
import { YpSubscription } from './subscription';

const subscription = await YpSubscription.create({
  user_id: 1,
  domain_id: 2,
  agent_product_id: 3,
  subscription_plan_id: 4,
  start_date: new Date(),
  next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  status: 'active',
});
```

## Associations Setup

The model defines the following associations (typically called in your Sequelize setup):

```typescript
(YpSubscription as any).associate = (models: any) => {
  YpSubscription.belongsTo(models.YpSubscriptionUser, {
    foreignKey: 'user_id',
    as: 'User'
  });

  YpSubscription.belongsTo(models.YpAgentProduct, {
    foreignKey: 'agent_product_id',
    as: 'AgentProduct',
  });

  YpSubscription.belongsTo(models.YpSubscriptionPlan, {
    foreignKey: 'subscription_plan_id',
    as: 'Plan',
  });

  YpSubscription.hasMany(models.YpAgentProductRun, {
    foreignKey: 'subscription_id',
    as: 'Runs',
  });

  YpSubscription.belongsToMany(models.YpDiscount, {
    through: 'subscription_discounts',
    foreignKey: 'subscription_id',
    otherKey: 'discount_id',
    as: 'Discounts',
  });
};
```

## Related Models

- [YpSubscriptionUser](./subscriptionUser.md)
- [YpAgentProduct](./agentProduct.md)
- [YpSubscriptionPlan](./subscriptionPlan.md)
- [YpAgentProductRun](./agentProductRun.md)
- [YpDiscount](./discount.md)

---

**Note:**  
- The `YpSubscriptionConfiguration` type is referenced but not defined in this file. Ensure it is documented elsewhere if used.
- This model is intended for use with Sequelize ORM and expects a PostgreSQL database (due to use of JSONB and ENUM types).