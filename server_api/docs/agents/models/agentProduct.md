# Model: YpAgentProduct

Represents an agent product entity in the system, encapsulating configuration, ownership, grouping, and relationships to subscriptions, bundles, and other agent products. This model is defined using Sequelize ORM and maps to the `agent_products` table in the database.

## Properties

| Name                     | Type                                  | Description                                                                                 |
|--------------------------|---------------------------------------|---------------------------------------------------------------------------------------------|
| id                       | number                                | Primary key. Auto-incremented integer.                                                      |
| uuid                     | string (UUID)                         | Universally unique identifier for the agent product.                                         |
| name                     | string                                | Name of the agent product.                                                                  |
| description              | string \| null                        | Optional description of the agent product.                                                  |
| user_id                  | number                                | Foreign key referencing the user who owns this agent product.                               |
| group_id                 | number \| null                        | Optional foreign key referencing the group this agent product belongs to.                   |
| domain_id                | number                                | Foreign key referencing the domain this agent product is associated with.                   |
| parent_agent_product_id  | number \| null                        | Optional foreign key referencing the parent agent product (for hierarchical relationships). |
| configuration            | YpAgentProductConfiguration (object)  | JSONB field containing the configuration for the agent product.                             |
| status                   | YpAgentProductStatus (object) \| null | Optional JSONB field for status information.                                                |
| created_at               | Date                                  | Timestamp of creation.                                                                      |
| updated_at               | Date                                  | Timestamp of last update.                                                                   |

### Associations

| Name                | Type                                         | Description                                                                                 |
|---------------------|----------------------------------------------|---------------------------------------------------------------------------------------------|
| User                | [YpSubscriptionUser](./subscriptionUser.md)  | The user who owns this agent product.                                                       |
| Group               | [YpGroupData](./ypGroup.md)                  | The group this agent product belongs to.                                                    |
| BoosterPurchases    | [YpAgentProductBoosterPurchase][]            | Booster purchases associated with this agent product.                                       |
| Subscriptions       | [YpSubscription][]                           | Subscriptions associated with this agent product.                                           |
| SubscriptionPlans   | [YpSubscriptionPlan][]                       | Subscription plans associated with this agent product.                                      |
| Runs                | [YpAgentProductRun][]                        | Runs associated with this agent product.                                                    |
| AgentBundles        | [YpAgentProductBundle][]                     | Bundles this agent product is part of (many-to-many).                                      |
| AgentBundle         | [YpAgentProductBundle](./agentProductBundle.md) | The bundle this agent product is directly associated with (hasOne).                         |
| ParentAgentProduct  | YpAgentProduct                               | The parent agent product in a hierarchy.                                                    |
| ChildAgentProducts  | YpAgentProduct[]                             | Child agent products in a hierarchy.                                                        |

## Sequelize Model Definition

- **Table Name:** `agent_products`
- **Indexes:** 
  - Unique on `uuid`
  - Non-unique on `user_id`, `group_id`, `domain_id`, `parent_agent_product_id`
- **Timestamps:** `created_at`, `updated_at` (managed by Sequelize)
- **Underscored:** true (column names use snake_case)

## Example

```typescript
import { YpAgentProduct } from './agentProduct';

// Creating a new agent product
const agentProduct = await YpAgentProduct.create({
  name: "My Agent Product",
  uuid: "generated-uuid",
  user_id: 1,
  domain_id: 2,
  configuration: { /* ... */ },
});
```

## Associations

The `associate` static method sets up all model relationships. This is typically called by the Sequelize initialization code.

### Association Details

- **belongsTo** `YpSubscriptionUser` as `User` via `user_id`
- **belongsTo** `Group` as `Group` via `group_id`
- **hasOne** `YpAgentProductBundle` as `AgentBundle` via `agent_bundle_id`
- **hasMany** `YpAgentProductBoosterPurchase` as `BoosterPurchases` via `agent_product_id`
- **hasMany** `YpSubscription` as `Subscriptions` via `agent_product_id`
- **hasMany** `YpSubscriptionPlan` as `SubscriptionPlans` via `agent_product_id`
- **hasMany** `YpAgentProductRun` as `Runs` via `agent_product_id`
- **belongsToMany** `YpAgentProductBundle` as `AgentBundles` through `agent_product_bundles_products`
- **belongsTo** `YpAgentProduct` as `ParentAgentProduct` via `parent_agent_product_id`
- **hasMany** `YpAgentProduct` as `ChildAgentProducts` via `parent_agent_product_id`

## Related Models

- [YpSubscriptionUser](./subscriptionUser.md)
- [Group](./ypGroup.md)
- [YpAgentProductBoosterPurchase](./agentProductBoosterPurchase.md)
- [YpSubscription](./subscription.md)
- [YpAgentProductRun](./agentProductRun.md)
- [YpSubscriptionPlan](./subscriptionPlan.md)
- [YpAgentProductBundle](./agentProductBundle.md)

## Configuration

The model uses the imported `sequelize` instance from [`@policysynth/agents/dbModels/sequelize.js`](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/sequelize.js).

## Exported Constants

- **YpAgentProduct**: The Sequelize model class for agent products.

---

**Note:**  
- `YpAgentProductConfiguration` and `YpAgentProductStatus` are assumed to be TypeScript types/interfaces for the JSONB fields.  
- The actual structure of these types should be documented where they are defined.
- The association setup is not automatically run; ensure your Sequelize initialization code calls the `associate` method.

---

[Back to Models Index](./README.md)