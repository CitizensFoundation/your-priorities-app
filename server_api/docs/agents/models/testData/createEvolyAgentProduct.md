# Service Script: createAgentProductsAndPlans.ts

This script is a standalone service utility for initializing and seeding the database with a set of default Agent Products, their associated Subscription Plans, and a Product Bundle for the Evoly platform. It is intended to be run as a one-off setup or migration script, not as part of a web API.

---

## Overview

- **Purpose:**  
  Seeds the database with a predefined set of agent products, their subscription plans, and a product bundle. It also creates a free trial subscription for the "Competitor Agent Free Trial" plan for a specific user and organization.
- **Database:**  
  Uses Sequelize ORM for all database operations, with full transaction support for atomicity.
- **Entities Involved:**  
  - [YpAgentProduct](../agentProduct.md)
  - [YpSubscriptionPlan](../subscriptionPlan.md)
  - [YpSubscriptionUser](../subscriptionUser.md)
  - [YpAgentProductBundle](../agentProductBundle.md)
  - [YpSubscription](../subscription.md)
  - [Group](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/ypGroup.ts)
  - [sequelize](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/dbModels/sequelize.js)

---

## Main Function

### `createAgentProductsAndPlans()`

Seeds the database with agent products, subscription plans, and a product bundle. Also creates a free trial subscription for the first product.

#### Parameters

_None (function is self-contained and uses hardcoded IDs for user and organization)._

#### Workflow

1. **Database Connection:**  
   Authenticates and connects to the database using Sequelize.

2. **Transaction Start:**  
   All operations are performed within a single transaction for atomicity.

3. **User and Organization Validation:**  
   - Checks for the existence of a user with `userId = 1`.
   - Uses `organizationId = 1` (assumed to exist).

4. **Agent Product Bundle Creation:**  
   - Creates a bundle named "Evoly Amplifier Agent Bundle" with a description and image.

5. **Agent Products and Subscription Plans Creation:**  
   - Iterates over a hardcoded array of agent product definitions.
   - For each product:
     - Creates a [YpAgentProduct](../agentProduct.md) record.
     - Creates a [YpSubscriptionPlan](../subscriptionPlan.md) associated with the product.
     - If the plan is a free trial, creates a [YpSubscription](../subscription.md) for the user.

6. **Transaction Commit:**  
   - Commits the transaction if all operations succeed.

7. **Error Handling:**  
   - Rolls back the transaction on any error.
   - Logs and rethrows the error.

8. **Cleanup:**  
   - Closes the database connection.

#### Example Usage

```bash
# Run as a script (Node.js)
node createAgentProductsAndPlans.js
```

---

## Configuration Objects

### Agent Bundle

| Name         | Type   | Description                                  |
|--------------|--------|----------------------------------------------|
| id           | number | Bundle ID (hardcoded: 1)                     |
| name         | string | Name of the bundle                           |
| description  | string | Description of the bundle                    |
| configuration| object | Bundle configuration (e.g., imageUrl)        |

### Agent Product Data

Each entry in `agentProductsData` contains:

| Name            | Type   | Description                                  |
|-----------------|--------|----------------------------------------------|
| name            | string | Name of the agent product                    |
| description     | string | Description of the agent product             |
| groupId         | number | (Optional) Group ID for the product          |
| configuration   | object | Product configuration (workflow, template)   |
| status          | object | Status object (e.g., `{ currentStatus: "active" }`) |
| subscriptionPlan| object | Associated subscription plan definition      |

### Subscription Plan Configuration

| Name                      | Type     | Description                                  |
|---------------------------|----------|----------------------------------------------|
| type                      | string   | "free" or "paid"                             |
| amount                    | number   | Price amount                                 |
| currency                  | string   | Currency code (e.g., "USD")                  |
| billing_cycle             | string   | Billing cycle (e.g., "monthly")              |
| max_runs_per_cycle        | number   | Max runs allowed per billing cycle           |
| boosters                  | array    | Booster options for extra runs/features      |
| structuredAnswersOverride | array    | Structured answer overrides                  |
| requiredStructuredQuestions| array   | Required structured questions for the plan   |
| imageUrl                  | string   | Image URL for the plan                       |

---

## Database Models Used

- [YpAgentProduct](../agentProduct.md)
- [YpSubscriptionPlan](../subscriptionPlan.md)
- [YpSubscriptionUser](../subscriptionUser.md)
- [YpAgentProductBundle](../agentProductBundle.md)
- [YpSubscription](../subscription.md)
- [Group](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/ypGroup.ts)

---

## Error Handling

- If the user with `userId = 1` does not exist, the script throws an error and aborts.
- Any error during the transaction causes a rollback and logs the error to the console.
- The error is rethrown for higher-level handling if the script is imported elsewhere.

---

## Exported Functions

This script does **not** export any functions or modules. It is intended to be run directly.

---

## Utility/Helper Types Used

- `YpAgentProductBundleAttributes`
- `YpAgentRunWorkflowConfiguration`
- `YpAgentProductConfiguration`
- `YpSubscriptionPlanType`
- `YpSubscriptionBillingCycle`
- `YpSubscriptionPlanConfiguration`
- `YpSubscriptionPlanAttributes`
- `YpSubscriptionAttributes`

These types are assumed to be defined in the respective model files and are used for type assertions and configuration objects.

---

## Example Output

On successful execution, the script logs:

```
Connection has been established successfully.
Created Agent Product: Competitor Agent Free Trial (ID: ...)
Created Free Trial Subscription (ID: ...)
Created Subscription Plan: Competitor Agent Free Trial (ID: ...)
...
All Agent Products and Subscription Plans have been created.
```

On error, logs:

```
Error creating Agent Products and Subscription Plans: <error details>
```

---

## See Also

- [YpAgentProduct](../agentProduct.md)
- [YpSubscriptionPlan](../subscriptionPlan.md)
- [YpSubscriptionUser](../subscriptionUser.md)
- [YpAgentProductBundle](../agentProductBundle.md)
- [YpSubscription](../subscription.md)
- [Group](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/ypGroup.ts)
- [sequelize](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/dbModels/sequelize.js)

---

## Notes

- This script is **destructive** if run multiple times (may create duplicate products/plans unless unique constraints are enforced).
- Hardcoded IDs (`userId = 1`, `organizationId = 1`) must exist in the database.
- Intended for development, testing, or initial production setup only.

---