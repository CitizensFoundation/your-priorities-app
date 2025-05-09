# Model: YpDiscount

Represents a discount or coupon that can be applied to agent products, boosters, or subscriptions. This model supports both percentage and fixed amount discounts, tracks usage, and can be limited by date or number of uses. It is associated with subscriptions and booster purchases.

## Properties

| Name            | Type                                              | Description                                                                                  |
|-----------------|---------------------------------------------------|----------------------------------------------------------------------------------------------|
| id              | number                                            | Primary key. Auto-incremented integer.                                                       |
| uuid            | string (UUID)                                     | Universally unique identifier for the discount.                                              |
| code            | string                                            | Unique code for the discount (max 50 characters).                                            |
| description     | string \| undefined                               | Optional description of the discount.                                                        |
| discount_type   | 'percentage' \| 'fixed'                           | Type of discount: percentage or fixed amount.                                                |
| discount_value  | number                                            | Value of the discount (decimal, up to 2 decimal places).                                     |
| max_uses        | number \| undefined                               | Optional maximum number of times this discount can be used.                                  |
| uses            | number                                            | Number of times this discount has been used. Defaults to 0.                                  |
| start_date      | Date \| undefined                                 | Optional start date for when the discount becomes valid.                                     |
| end_date        | Date \| undefined                                 | Optional end date for when the discount expires.                                             |
| applicable_to   | 'agent_product' \| 'booster' \| 'subscription' \| 'both' | Specifies what the discount can be applied to.                                               |
| created_at      | Date                                              | Timestamp when the discount was created.                                                     |
| updated_at      | Date                                              | Timestamp when the discount was last updated.                                                |
| Subscriptions   | [YpSubscription](./subscription.md)[] \| undefined| Associated subscriptions (many-to-many via `subscription_discounts`).                        |
| BoosterPurchases| [YpAgentProductBoosterPurchase](./agentProductBoosterPurchase.md)[] \| undefined | Associated booster purchases (one-to-many).                                                  |

## Associations

- **Many-to-Many** with [YpSubscription](./subscription.md) through the `subscription_discounts` join table.
- **One-to-Many** with [YpAgentProductBoosterPurchase](./agentProductBoosterPurchase.md).

## Sequelize Model Definition

- **Table Name:** `discounts`
- **Indexes:** Unique on `uuid` and `code`
- **Timestamps:** `created_at`, `updated_at` (managed by Sequelize)
- **Underscored:** Field names use snake_case in the database.

## Example

```typescript
import { YpDiscount } from './discount.js';

const discount = await YpDiscount.create({
  code: 'SUMMER2024',
  discount_type: 'percentage',
  discount_value: 15.0,
  applicable_to: 'subscription',
  start_date: new Date('2024-06-01'),
  end_date: new Date('2024-08-31'),
});
```

## Initialization

The model is initialized with the following schema:

```typescript
YpDiscount.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false },
    code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    discount_type: { type: DataTypes.ENUM('percentage', 'fixed'), allowNull: false },
    discount_value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    max_uses: { type: DataTypes.INTEGER, allowNull: true },
    uses: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    start_date: { type: DataTypes.DATE, allowNull: true },
    end_date: { type: DataTypes.DATE, allowNull: true },
    applicable_to: { type: DataTypes.ENUM('agent_product', 'booster', 'subscription', 'both'), allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'discounts',
    indexes: [
      { fields: ['uuid'], unique: true },
      { fields: ['code'], unique: true },
    ],
    timestamps: true,
    underscored: true,
  }
);
```

## Methods

### static associate(models: any)

Sets up model associations. Should be called after all models are defined.

#### Parameters

| Name   | Type  | Description                                 |
|--------|-------|---------------------------------------------|
| models | any   | An object containing all Sequelize models.   |

#### Description

- Sets up a many-to-many relationship with [YpSubscription](./subscription.md) via the `subscription_discounts` join table.
- Sets up a one-to-many relationship with [YpAgentProductBoosterPurchase](./agentProductBoosterPurchase.md).

---

**See also:**
- [YpSubscription](./subscription.md)
- [YpAgentProductBoosterPurchase](./agentProductBoosterPurchase.md)
- [YpAgentProduct](./agentProduct.md) (for related agent product context)
- [Sequelize Documentation](https://sequelize.org/master/class/lib/model.js~Model.html)