# Model: YpAgentProductBundle

Represents a bundle of agent products in the system. This Sequelize model defines the schema and associations for agent product bundles, which can group multiple [YpAgentProduct](./agentProduct.md) entities together. Each bundle has a unique UUID, a name, an optional description, and an optional configuration object.

## Properties

| Name           | Type                                         | Description                                                      |
|----------------|----------------------------------------------|------------------------------------------------------------------|
| id             | number                                       | Auto-incrementing primary key.                                   |
| uuid           | string (UUID)                                | Universally unique identifier for the bundle.                    |
| name           | string                                       | Name of the product bundle.                                      |
| description    | string \| undefined                          | Optional description of the bundle.                              |
| configuration  | YpAgentProductBundleConfiguration \| undefined| Optional JSONB configuration object for the bundle.               |
| created_at     | Date                                         | Timestamp when the bundle was created.                           |
| updated_at     | Date                                         | Timestamp when the bundle was last updated.                      |
| AgentProducts  | [YpAgentProduct](./agentProduct.md)[] \| undefined | Associated agent products in this bundle (via many-to-many). |

## Table

- **Table Name:** `agent_product_bundles`
- **Timestamps:** `created_at`, `updated_at` (managed by Sequelize)
- **Indexes:**
  - Unique index on `uuid`
  - Index on `name`
- **Naming Convention:** Underscored column names

## Associations

### belongsToMany: AgentProducts

- **Target Model:** [YpAgentProduct](./agentProduct.md)
- **Through Table:** `agent_product_bundles_products`
- **Alias:** `AgentProducts`
- **Foreign Key:** `agent_product_bundle_id`
- **Other Key:** `agent_product_id`

This association allows a bundle to contain multiple agent products.

## Initialization

The model is initialized with the following schema:

```typescript
YpAgentProductBundle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    configuration: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'agent_product_bundles',
    timestamps: true,
    indexes: [
      { fields: ['uuid'], unique: true },
      { fields: ['name'] },
    ],
    underscored: true,
  }
);
```

## Association Setup

The following static method is used to set up associations:

```typescript
(YpAgentProductBundle as any).associate = (models: any) => {
  YpAgentProductBundle.belongsToMany(models.YpAgentProduct, {
    through: 'agent_product_bundles_products',
    as: 'AgentProducts',
    foreignKey: 'agent_product_bundle_id',
    otherKey: 'agent_product_id',
  });
};
```

## Related Models

- [YpAgentProduct](./agentProduct.md): The agent product model associated with bundles.

## Example Usage

```typescript
// Creating a new bundle
const bundle = await YpAgentProductBundle.create({
  name: "Premium Bundle",
  description: "A bundle of premium agent products",
  configuration: { features: ["feature1", "feature2"] }
});

// Associating products with a bundle
await bundle.setAgentProducts([product1, product2]);
```

---

# Model: YpAgentProduct

> **Note:** Only the association part is shown here. For the full model, see [YpAgentProduct](./agentProduct.md).

## Associations

### belongsToMany: AgentBundles

- **Target Model:** [YpAgentProductBundle](./YpAgentProductBundle.md)
- **Through Table:** `agent_product_bundles_products`
- **Alias:** `AgentBundles`
- **Foreign Key:** `agent_product_id`
- **Other Key:** `agent_product_bundle_id`

This association allows an agent product to belong to multiple bundles.

---

# Configuration

## YpAgentProductBundleConfiguration

> **Note:** The type `YpAgentProductBundleConfiguration` is referenced but not defined in this file. Ensure it is defined elsewhere in your codebase and properly imported if used.

---

# Exported Entities

- `YpAgentProductBundle` (Sequelize Model)

---

# See Also

- [YpAgentProduct](./agentProduct.md)
- [Sequelize Documentation](https://sequelize.org/)
- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)