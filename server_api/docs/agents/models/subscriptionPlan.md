# Model: YpSubscriptionPlan

Represents a subscription plan for an agent product in the system. This model defines the schema for the `subscription_plans` table and its associations with other models such as [YpAgentProduct](./agentProduct.md), [YpSubscription](./subscription.md), and [YpAgentProductBoosterPurchase](./agentProductBoosterPurchase.md).

## Properties

| Name                | Type                                         | Description                                                                                 |
|---------------------|----------------------------------------------|---------------------------------------------------------------------------------------------|
| id                  | number                                       | Primary key. Auto-incremented integer.                                                      |
| uuid                | string (UUID)                                | Universally unique identifier for the subscription plan.                                     |
| agent_product_id    | number                                       | Foreign key referencing the associated agent product.                                        |
| name                | string                                       | Name of the subscription plan (max 256 characters).                                          |
| description         | string \| undefined                          | Optional description of the subscription plan.                                               |
| configuration       | YpSubscriptionPlanConfiguration              | JSONB object containing configuration details for the plan.                                  |
| created_at          | Date                                         | Timestamp when the subscription plan was created.                                            |
| updated_at          | Date                                         | Timestamp when the subscription plan was last updated.                                       |
| AgentProduct        | [YpAgentProduct](./agentProduct.md) \| undefined | Associated agent product (Sequelize association, optional).                                  |
| Subscriptions       | [YpSubscription](./subscription.md)[] \| undefined | Associated subscriptions (Sequelize association, optional).                                  |
| BoosterPurchases    | [YpAgentProductBoosterPurchase](./agentProductBoosterPurchase.md)[] \| undefined | Associated booster purchases (Sequelize association, optional).                              |

> **Note:**  
> The `configuration` property is a JSONB object. The structure of `YpSubscriptionPlanConfiguration` should be defined elsewhere in your codebase.

## Table Configuration

- **Table Name:** `subscription_plans`
- **Indexes:**
  - Unique index on `uuid`
  - Index on `name`
- **Timestamps:** `created_at`, `updated_at` (managed by Sequelize)
- **Naming Convention:** Uses underscored column names (e.g., `created_at`).

## Associations

| Association Type | Target Model                                                                 | Foreign Key             | Alias              | Description                                      |
|------------------|------------------------------------------------------------------------------|-------------------------|--------------------|--------------------------------------------------|
| belongsTo        | [YpAgentProduct](./agentProduct.md)                                          | agent_product_id        | AgentProduct       | Each plan belongs to a single agent product.      |
| hasMany          | [YpSubscription](./subscription.md)                                          | subscription_plan_id    | Subscriptions      | A plan can have many subscriptions.               |
| hasMany          | [YpAgentProductBoosterPurchase](./agentProductBoosterPurchase.md)            | subscription_plan_id    | BoosterPurchases   | A plan can have many booster purchases.           |

## Sequelize Model Definition

```typescript
YpSubscriptionPlan.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false },
    agent_product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'agent_products',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    name: { type: DataTypes.STRING(256), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    configuration: { type: DataTypes.JSONB, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'subscription_plans',
    indexes: [
      { fields: ['uuid'], unique: true },
      { fields: ['name'] },
    ],
    timestamps: true,
    underscored: true,
  }
);
```

## Association Setup

```typescript
(YpSubscriptionPlan as any).associate = (models: any) => {
  YpSubscriptionPlan.hasMany(models.YpSubscription, {
    foreignKey: 'subscription_plan_id',
    as: 'Subscriptions',
  });

  YpSubscriptionPlan.hasMany(models.YpAgentProductBoosterPurchase, {
    foreignKey: 'subscription_plan_id',
    as: 'BoosterPurchases',
  });

  YpSubscriptionPlan.belongsTo(models.YpAgentProduct, {
    foreignKey: 'agent_product_id',
    as: 'AgentProduct',
  });
};
```

## Example

```typescript
import { YpSubscriptionPlan } from './subscriptionPlan';

// Creating a new subscription plan
const plan = await YpSubscriptionPlan.create({
  agent_product_id: 1,
  name: 'Pro Plan',
  description: 'Access to premium features',
  configuration: { maxUsers: 10, support: 'priority' },
});

// Fetching associated agent product
const agentProduct = await plan.getAgentProduct();
```

## Related Models

- [YpAgentProduct](./agentProduct.md)
- [YpSubscription](./subscription.md)
- [YpAgentProductBoosterPurchase](./agentProductBoosterPurchase.md)

---

**See also:**  
- [Sequelize Model Documentation](https://sequelize.org/docs/v6/core-concepts/model-basics/)
- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts) (for related agent product logic)