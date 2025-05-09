# Service Module: setupAgentProductsConfiguration

This module provides a service function to configure agent products and subscription plans in the database. It sets up workflow configurations for specific agent products and updates structured question requirements and plan types for various subscription plans. The function is intended to be run as a script to initialize or update the configuration of agent products and subscription plans in the system.

---

## Functions

| Name                          | Parameters | Return Type | Description                                                                                 |
|-------------------------------|------------|-------------|---------------------------------------------------------------------------------------------|
| setupAgentProductsConfiguration | none       | Promise<void> | Configures agent products and subscription plans in the database with specific workflows and settings. |

---

## Function: setupAgentProductsConfiguration

Configures agent products and subscription plans in the database. This includes:

- Setting up multi-step workflow configurations for competitor and funding agent products.
- Updating structured question requirements for funding and competitor subscription plans.
- Marking certain subscription plans as "coming_soon" or "paid".

### Parameters

_None_

### Return Type

`Promise<void>`

### Description

This function performs the following actions:

1. **Configures Workflow for Competitor Agent Products**  
   - Sets a multi-step workflow for agent products with IDs 1 (free trial) and 2 (paid).
   - Each workflow step includes metadata such as name, description, agent class UUID, type, colors, and optional email instructions.

2. **Configures Workflow for Funding Agent Product**  
   - Sets a multi-step workflow for the agent product with ID 6.
   - Steps are similar in structure to the competitor workflow but tailored for funding/investor search.

3. **Updates Funding Subscription Plan (ID 6)**  
   - Sets required structured questions for the funding agent, such as business description, investor geographic focus, and industry focus.

4. **Updates Subscription Plans 2-5**  
   - Sets the configuration type to `"coming_soon"` for plans 3-5 and `"paid"` for plan 2.

5. **Updates Required Structured Questions for Plans 1 and 2**  
   - Ensures that plans 1 and 2 require a business description as a structured question.

6. **Logs to console if any product or plan is not found.**

### Example Usage

```typescript
import { setupAgentProductsConfiguration } from './path/to/this/module';

setupAgentProductsConfiguration();
```

---

## Interactions

- **Models Used:**
  - [YpAgentProduct](../../agentProduct.js): Used to fetch and update agent product records by primary key.
  - [YpSubscriptionPlan](../../subscriptionPlan.js): Used to fetch and update subscription plan records by primary key.

- **Configuration Objects:**
  - `YpAgentRunWorkflowConfiguration`: Workflow configuration object for agent products, containing steps with metadata.
  - Structured question objects for subscription plans, specifying required fields for user input.

---

## Configuration Objects

### YpAgentRunWorkflowConfiguration

Represents the workflow configuration for an agent product.

#### Properties

| Name              | Type     | Description                                                                 |
|-------------------|----------|-----------------------------------------------------------------------------|
| currentStepIndex  | number   | The index of the current step in the workflow.                              |
| steps             | Array<YpAgentRunWorkflowStep> | List of workflow steps, each with metadata.                |

#### YpAgentRunWorkflowStep

| Name                | Type     | Description                                                                 |
|---------------------|----------|-----------------------------------------------------------------------------|
| name                | string   | Full name of the workflow step.                                             |
| shortName           | string   | Short name for the step.                                                    |
| description         | string   | Detailed description of the step.                                           |
| shortDescription    | string   | Short description for the step.                                             |
| agentClassUuid      | string   | UUID of the agent class to use for this step.                               |
| type                | string   | Type of step (e.g., "agentOps", "engagmentFromOutputConnector").            |
| stepBackgroundColor | string   | Background color for the step (hex code).                                   |
| stepTextColor       | string   | Text color for the step (hex code).                                         |
| emailCallForAction  | string   | (Optional) Call-to-action for email notifications.                          |
| emailInstructions   | string   | (Optional) Instructions for email notifications.                            |

---

### Structured Question Object

Represents a required structured question for a subscription plan.

| Name          | Type     | Description                                                                 |
|---------------|----------|-----------------------------------------------------------------------------|
| uniqueId      | string   | Unique identifier for the question.                                         |
| type          | string   | Type of input (e.g., "textAreaLong", "textFieldLong").                      |
| description   | string   | Description of the question.                                                |
| value         | string   | Default value.                                                              |
| maxLength     | number   | Maximum allowed length of the input.                                        |
| required      | boolean  | Whether the question is required.                                           |
| rows          | number   | Number of rows for textarea input.                                          |
| charCounter   | boolean  | Whether to show a character counter.                                        |
| text          | string   | Display text for the question.                                              |

---

## Exported Entities

- `setupAgentProductsConfiguration` (default export): The main function to run the configuration script.

---

## Notes

- This script is intended to be run in a Node.js environment with access to the database.
- It is not an Express route or middleware, but a service/utility script for system initialization or migration.
- The function is invoked at the end of the file, so running this file will execute the configuration process immediately.

---

## Related Models

- [YpAgentProduct](../../agentProduct.js)
- [YpSubscriptionPlan](../../subscriptionPlan.js)

---

## Example Output

No direct output is returned, but the function updates records in the database. Console logs are produced if any expected product or plan is not found.

---

## Error Handling

- If a product or plan is not found by its primary key, a message is logged to the console.
- No exceptions are thrown for missing records; the script continues execution.

---

## See Also

- [YpAgentProduct Model](../../agentProduct.js)
- [YpSubscriptionPlan Model](../../subscriptionPlan.js)