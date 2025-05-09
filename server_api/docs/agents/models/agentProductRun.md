# Model: YpAgentProductRun

Represents a run/execution instance of an agent product within the Policy Synth system. Tracks the lifecycle, input/output data, status, and relationships to subscriptions and parent/child runs. This model is mapped to the `agent_product_runs` table in the database.

## Properties

| Name                        | Type                                              | Description                                                                                  |
|-----------------------------|---------------------------------------------------|----------------------------------------------------------------------------------------------|
| id                          | number                                            | Primary key. Auto-incremented integer.                                                       |
| uuid                        | string (UUID)                                     | Universally unique identifier for the run.                                                   |
| subscription_id             | number                                            | Foreign key referencing the associated [YpSubscription](./subscription.md).                  |
| workflow                    | YpAgentRunWorkflowConfiguration (JSONB)           | Workflow configuration for the run.                                                          |
| start_time                  | Date                                              | Timestamp when the run started.                                                              |
| end_time                    | Date \| undefined                                 | Timestamp when the run ended.                                                                |
| duration                    | number \| undefined                               | Duration of the run in seconds (optional).                                                   |
| parent_agent_product_run_id | number \| undefined                               | Foreign key referencing the parent run, if this is a child run.                              |
| status                      | YpAgentProductRunStatus (string)                  | Status of the run (e.g., 'ready', 'running', 'completed', etc.).                             |
| input_data                  | any (JSONB)                                       | Input data for the run (optional, defaults to `{}`).                                         |
| output_data                 | any (JSONB)                                       | Output data from the run (optional, defaults to `{}`).                                       |
| error_message               | string \| undefined                               | Error message if the run failed (optional).                                                  |
| run_type                    | string \| undefined                               | Type of run (optional, max 50 characters).                                                   |
| metadata                    | any (JSONB)                                       | Additional metadata for the run (optional, defaults to `{}`).                                |
| created_at                  | Date                                              | Timestamp when the record was created.                                                       |
| updated_at                  | Date                                              | Timestamp when the record was last updated.                                                  |

## Associations

| Association Name         | Type                        | Description                                                                                  |
|-------------------------|-----------------------------|----------------------------------------------------------------------------------------------|
| Subscription            | YpSubscription              | The subscription this run is associated with.                                                |
| ParentAgentProductRun    | YpAgentProductRun           | The parent run, if this run is a child of another run.                                       |
| ChildAgentProductRuns    | YpAgentProductRun[]         | Array of child runs, if this run is a parent.                                                |

## Sequelize Model Configuration

- **Table Name:** `agent_product_runs`
- **Indexes:**
  - Unique index on `uuid`
  - Index on `subscription_id`
  - Index on `status`
- **Timestamps:** `created_at`, `updated_at` (managed by Sequelize)
- **Underscored:** true (snake_case column names)

## Example

```typescript
const run = await YpAgentProductRun.create({
  subscription_id: 123,
  workflow: { steps: [...] },
  status: 'ready',
  input_data: { prompt: "Hello" },
  run_type: "scheduled"
});
```

## Associations Setup

The model defines the following associations (to be called in your model index file):

```typescript
(YpAgentProductRun as any).associate = (models: any) => {
  YpAgentProductRun.belongsTo(models.YpSubscription, {
    foreignKey: 'subscription_id',
    as: 'Subscription',
  });

  YpAgentProductRun.belongsTo(models.YpAgentProductRun, {
    foreignKey: 'parent_agent_product_run_id',
    as: 'ParentAgentProduct',
  });

  YpAgentProductRun.hasMany(models.YpAgentProductRun, {
    foreignKey: 'parent_agent_product_run_id',
    as: 'ChildAgentProducts',
  });
};
```

## Related Models

- [YpSubscription](./subscription.md)
- [YpAgentProduct](./agentProduct.md)

## Types

- **YpAgentProductRunStatus**: Enum/string representing the status of the run (e.g., 'ready', 'running', 'completed', etc.).
- **YpAgentRunWorkflowConfiguration**: JSON structure describing the workflow for the run.

> **Note:** For the definitions of `YpAgentProductRunStatus` and `YpAgentRunWorkflowConfiguration`, refer to their respective type declarations in your codebase.

---

**See also:**
- [Sequelize Documentation](https://sequelize.org/)
- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)