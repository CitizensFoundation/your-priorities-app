# Model: YpWorkflowConversation

Represents a workflow conversation in the system, associated with an agent product and optionally a user. This Sequelize model maps to the `workflow_conversations` table in the database and stores configuration data for each conversation.

## Properties

| Name             | Type                                         | Description                                                                 |
|------------------|----------------------------------------------|-----------------------------------------------------------------------------|
| id               | number                                       | Primary key. Unique identifier for the workflow conversation.               |
| agentProductId   | number \| null                               | Foreign key referencing the associated agent product.                       |
| userId           | number \| null                               | Foreign key referencing the user who owns the conversation.                 |
| configuration    | YpWorkflowConversationConfiguration (object)  | JSONB field storing configuration for the conversation.                     |
| created_at       | Date                                         | Timestamp when the conversation was created.                                |
| updated_at       | Date                                         | Timestamp when the conversation was last updated.                           |

> **Note:** The type `YpWorkflowConversationConfiguration` should be defined elsewhere in your codebase. It represents the schema for the configuration JSONB field.

## Methods

### static initModel(sequelizeInstance?: Sequelize): typeof YpWorkflowConversation

Initializes the model with the provided Sequelize instance. If no instance is provided, uses the default imported `sequelize` instance.

#### Parameters

| Name             | Type      | Description                                      |
|------------------|-----------|--------------------------------------------------|
| sequelizeInstance| Sequelize | (Optional) The Sequelize instance to use.        |

#### Returns

- `typeof YpWorkflowConversation` — The initialized model class.

#### Example

```typescript
import { YpWorkflowConversation } from './YpWorkflowConversation';
YpWorkflowConversation.initModel(); // Uses default sequelize instance
```

### static associate(models: Record<string, any>): void

Sets up model associations. Should be called after all models are initialized.

#### Parameters

| Name   | Type                  | Description                                 |
|--------|-----------------------|---------------------------------------------|
| models | Record<string, any>   | An object containing all initialized models. |

#### Associations

- **Belongs To:** [YpAgentProduct](./YpAgentProduct.md) (as `agentProduct`)
  - `foreignKey`: `agentProductId`
- **Has Many:** [YpAgentProductRun](./YpAgentProductRun.md) (as `agentProductRuns`)
  - `foreignKey`: `workflowId`

#### Example

```typescript
YpWorkflowConversation.associate({
  YpAgentProduct,
  YpAgentProductRun,
});
```

## Sequelize Table Mapping

- **Table Name:** `workflow_conversations`
- **Timestamps:** true (`created_at`, `updated_at`)

## Field Details

| Field Name         | DB Column           | Type         | Allow Null | Default Value      | Notes                        |
|--------------------|--------------------|--------------|------------|--------------------|------------------------------|
| id                 | id                 | INTEGER      | No         | Auto-increment     | Primary key                  |
| agentProductId     | agent_product_id   | INTEGER      | Yes        |                    | Foreign key                  |
| userId             | user_id            | INTEGER      | No         |                    | Foreign key                  |
| configuration      | configuration      | JSONB        | No         | `{}`               | JSON configuration           |
| created_at         | created_at         | DATE         | No         | NOW                | Creation timestamp           |
| updated_at         | updated_at         | DATE         | No         | NOW                | Last update timestamp        |

## Usage Example

```typescript
import { YpWorkflowConversation } from './YpWorkflowConversation';

// Initialize the model (usually done during app setup)
YpWorkflowConversation.initModel();

// Create a new workflow conversation
const conversation = await YpWorkflowConversation.create({
  agentProductId: 1,
  userId: 42,
  configuration: { step: 'start' },
});
```

---

**See also:**
- [YpAgentProduct](./YpAgentProduct.md)
- [YpAgentProductRun](./YpAgentProductRun.md)
- [Sequelize Documentation](https://sequelize.org/master/class/lib/model.js~Model.html)
- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)