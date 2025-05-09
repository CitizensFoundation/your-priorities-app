# Utility Function: setupAgentProductsConfiguration

Configures and updates agent product workflows and subscription plan settings for various agent products and subscription plans in the system. This function is typically used as a one-time setup or migration script to initialize or update the configuration of agent products and subscription plans in the database.

---

## Purpose

- Sets up workflow configurations for specific agent products (e.g., competitor analysis, funding agent).
- Updates structured question requirements and types for subscription plans.
- Ensures that the correct workflow and configuration are associated with each product and plan.

---

## Dependencies

- [YpAgentProduct](../agentProduct.md): Sequelize model for agent products.
- [YpSubscriptionPlan](../subscriptionPlan.md): Sequelize model for subscription plans.

---

## Function: setupAgentProductsConfiguration

### Signature

```typescript
async function setupAgentProductsConfiguration(): Promise<void>
```

### Description

- Configures workflow steps for agent products (e.g., competitor analysis, funding agent).
- Updates configuration fields for subscription plans, including required structured questions and plan types.
- Saves all changes to the database.
- Logs to the console if a product or plan is not found.

### Parameters

_None_

### Return Type

- `Promise<void>`

---

## Workflow Configuration Structures

### YpAgentRunWorkflowConfiguration

A configuration object describing the workflow for an agent product.

#### Properties

| Name              | Type     | Description                                                                 |
|-------------------|----------|-----------------------------------------------------------------------------|
| currentStepIndex  | number   | The index of the current step in the workflow.                              |
| steps             | Step[]   | Array of step objects describing each step in the workflow.                 |

#### Step

| Name                | Type     | Description                                                                 |
|---------------------|----------|-----------------------------------------------------------------------------|
| name                | string   | Name of the workflow step.                                                  |
| shortName           | string   | Short name for the step.                                                    |
| shortDescription    | string   | Short description of the step.                                              |
| description         | string   | Detailed description of the step.                                           |
| agentClassUuid      | string   | UUID of the agent class associated with this step.                          |
| type                | string   | Type of step (e.g., "agentOps", "engagmentFromOutputConnector").            |
| stepBackgroundColor | string   | Background color for the step (hex code).                                   |
| stepTextColor       | string   | Text color for the step (hex code).                                         |
| emailCallForAction  | string   | (Optional) Call-to-action text for emails.                                  |
| emailInstructions   | string   | (Optional) Instructions for emails.                                         |

---

## Structured Question Configuration

Each subscription plan can have required structured questions for users to answer.

#### Structured Question

| Name          | Type     | Description                                                                 |
|---------------|----------|-----------------------------------------------------------------------------|
| uniqueId      | string   | Unique identifier for the question.                                         |
| type          | string   | Type of input (e.g., "textAreaLong", "textFieldLong").                      |
| description   | string   | Description of the question.                                                |
| value         | string   | Default value.                                                              |
| maxLength     | number   | Maximum allowed length of the input.                                        |
| required      | boolean  | Whether the question is required.                                           |
| rows          | number   | Number of rows for textarea fields.                                         |
| charCounter   | boolean  | Whether to show a character counter.                                        |
| text          | string   | Label or prompt for the question.                                           |

---

## Database Operations

- **Find by Primary Key:** Uses `findByPk(id)` to fetch agent products and subscription plans.
- **Set Configuration:** Uses `.set(path, value)` to update nested configuration fields.
- **Mark as Changed:** Uses `.changed("configuration", true)` to mark the configuration as modified.
- **Save:** Uses `.save()` to persist changes to the database.

---

## Example Usage

This function is intended to be run as a script (e.g., via `node` or as part of a migration process):

```typescript
setupAgentProductsConfiguration();
```

---

## Console Output

- Logs a message if a required agent product or subscription plan is not found.

---

## Exported Entities

_None_ (This file is a script and does not export any functions or constants.)

---

## Related Models

- [YpAgentProduct](../agentProduct.md)
- [YpSubscriptionPlan](../subscriptionPlan.md)

---

## Configuration Changes Summary

- **Agent Products:**
  - Product IDs 1 & 2: Set to competitor analysis workflow.
  - Product ID 6: Set to funding agent workflow.

- **Subscription Plans:**
  - Plan ID 6: Sets required structured questions for funding.
  - Plans 2–5: Set type to `"coming_soon"` (except plan 2, which is set to `"paid"`).
  - Plans 1 & 2: Set required structured questions for business description.

---

## Error Handling

- If a product or plan is not found, logs a message to the console.
- No exceptions are thrown; errors are handled via logging.

---

## See Also

- [YpAgentProduct](../agentProduct.md)
- [YpSubscriptionPlan](../subscriptionPlan.md)

---

## Example Workflow Step Object

```json
{
  "name": "Wide search for competitors",
  "shortName": "Competitors wide search",
  "shortDescription": "A wide search for competitors based on your business description.",
  "description": "A wide search for competitors based on your business description. The wide search will result in a list of competitors that you and your team can vet as actual competitors.",
  "agentClassUuid": "a1b2c3d4-e5f6-c7c8-a9c0-c1225354f516",
  "type": "agentOps",
  "stepBackgroundColor": "#ffdc2f",
  "stepTextColor": "#211e1c"
}
```

---

## Example Structured Question Object

```json
{
  "uniqueId": "businessDescription",
  "type": "textAreaLong",
  "description": "Detailed description of the business, this is critical for the agent to understand the business and provide accurate results.",
  "value": "",
  "maxLength": 7500,
  "required": true,
  "rows": 5,
  "charCounter": true,
  "text": "Business Description"
}
```

---

## Notes

- This script should be run in an environment where the database models are properly initialized and connected.
- The function is asynchronous and should be awaited or run in a top-level async context.

---