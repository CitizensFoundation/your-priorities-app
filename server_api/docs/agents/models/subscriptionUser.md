# Model: YpSubscriptionUser

Represents a user in the system who can have multiple agent products, agent product booster purchases, and subscriptions. This model is mapped to the `users` table in the database and uses Sequelize for ORM functionality.

## Properties

| Name                              | Type                                 | Description                                                                 |
|------------------------------------|--------------------------------------|-----------------------------------------------------------------------------|
| id                                | number                               | Unique identifier for the user.                                             |
| name                              | string                               | Name of the user.                                                           |
| AgentProducts                     | YpAgentProduct[] (optional)          | Associated agent products for the user. See [YpAgentProduct](./agentProduct.md). |
| AgentProductBoosterPurchases       | YpAgentProductBoosterPurchase[] (optional) | Associated booster purchases for the user. See [YpAgentProductBoosterPurchase](./agentProductBoosterPurchase.md). |
| Subscriptions                     | YpSubscription[] (optional)          | Associated subscriptions for the user. See [YpSubscription](./subscription.md). |

> **Note:** The actual user fields (besides `id` and `name`) should be defined in the `init` method. This file currently only declares `id` and `name`.

## Sequelize Model Configuration

- **Table Name:** `users`
- **Timestamps:** `true` (automatically manages `created_at` and `updated_at` fields)
- **Underscored:** `true` (uses snake_case for automatically added fields)

## Associations

The model defines the following associations:

| Association Name                | Type      | Target Model                        | Foreign Key | Description                                                                 |
|---------------------------------|-----------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| AgentProducts                   | hasMany   | [YpAgentProduct](./agentProduct.md) | user_id     | A user can have many agent products.                                        |
| AgentProductBoosterPurchases    | hasMany   | [YpAgentProductBoosterPurchase](./agentProductBoosterPurchase.md) | user_id     | A user can have many agent product booster purchases.                       |
| Subscriptions                   | hasMany   | [YpSubscription](./subscription.md) | user_id     | A user can have many subscriptions.                                         |

## Example

```typescript
import { YpSubscriptionUser } from './subscriptionUser';

// Creating a new user (fields must be defined in the init method)
const user = await YpSubscriptionUser.create({ name: 'Alice' });

// Fetching associated agent products
const agentProducts = await user.getAgentProducts();
```

## Related Models

- [YpAgentProduct](./agentProduct.md)
- [YpAgentProductBoosterPurchase](./agentProductBoosterPurchase.md)
- [YpSubscription](./subscription.md)

## Configuration

| Option         | Value      | Description                                      |
|----------------|------------|--------------------------------------------------|
| sequelize      | sequelize  | Sequelize instance imported from the agents package. |
| tableName      | 'users'    | Name of the table in the database.               |
| timestamps     | true       | Enables automatic timestamp fields.              |
| underscored    | true       | Uses snake_case for field names.                 |

---

**Note:**  
- The actual user fields (besides `id` and `name`) should be defined in the `init` method.  
- The `associate` function is used by Sequelize to set up model relationships and should be called after all models are loaded.

---

**See also:**  
- [Sequelize Model Documentation](https://sequelize.org/docs/v6/core-concepts/model-basics/)  
- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)