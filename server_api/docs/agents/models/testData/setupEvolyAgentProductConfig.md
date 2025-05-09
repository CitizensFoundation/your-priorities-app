# Utility Module: createAgentProductsAndPlans

This module is a utility script designed to configure and update agent product and subscription plan records in the database. It is typically used for initial setup or migration tasks to ensure that agent products and their associated subscription plans have the correct names, descriptions, and configuration metadata.

The script interacts with the `YpAgentProduct` and `YpSubscriptionPlan` models, updating their properties and configuration fields with detailed prompts, display names, and descriptions for various agent types (e.g., Competitor Agent, Lead Generation Agent, Product Innovation Agent, Marketing Ops Agent, Funding Agent).

> **Note:** This script is intended to be run as a one-off setup or migration utility and does not export any functions or classes for use elsewhere.

---

## Functions

### setupAgentProductsConfiguration

Configures and updates agent products and subscription plans in the database with the correct names, descriptions, and configuration metadata.

#### Description

- Updates the names and descriptions of specific `YpSubscriptionPlan` records (IDs 1–4).
- Updates the configuration, display name, and description of specific `YpAgentProduct` records (IDs 1–6).
- Sets detailed system prompts and avatar metadata for each agent product, ensuring that each agent's configuration is tailored to its intended business function.
- The function is invoked immediately at the end of the script.

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| None |      |             |

#### Returns

| Type     | Description                |
|----------|----------------------------|
| Promise<void> | Resolves when all updates are complete. |

#### Example Usage

```typescript
// This script is intended to be run directly, not imported.
// To execute: `node createAgentProductsAndPlans.js`
```

---

## Models Used

### [YpAgentProduct](../agentProduct.md)

Represents an agent product in the system, including its configuration, display name, and description.

#### Key Properties Used

| Name          | Type   | Description                                   |
|---------------|--------|-----------------------------------------------|
| configuration | object | Configuration object for the agent product.   |
| name          | string | Name of the agent product.                    |
| description   | string | Description of the agent product.             |

### [YpSubscriptionPlan](../subscriptionPlan.md)

Represents a subscription plan associated with an agent product.

#### Key Properties Used

| Name        | Type   | Description                                   |
|-------------|--------|-----------------------------------------------|
| name        | string | Name of the subscription plan.                |
| description | string | Description of the subscription plan.         |

---

## Configuration Schema

The `configuration` object for each agent product typically includes:

| Name               | Type   | Description                                                                 |
|--------------------|--------|-----------------------------------------------------------------------------|
| avatar             | object | Metadata for the agent's avatar, including system prompt, image, and voice.  |
| displayName        | string | Display name for the agent product.                                         |
| displayDescription | string | HTML-formatted description for display in UI.                               |

#### Example `avatar` Object

| Name         | Type   | Description                                      |
|--------------|--------|--------------------------------------------------|
| systemPrompt | string | System prompt describing the agent's expertise.  |
| imageUrl     | string | URL to the avatar image.                         |
| voiceName    | string | Name of the voice for the agent.                 |

---

## Agent Products and Plans Configured

| Agent Product ID | Name                    | Description (Summary)                                                                                  |
|------------------|-------------------------|--------------------------------------------------------------------------------------------------------|
| 1                | Competitor Agent        | Market intelligence and competitor analysis.                                                           |
| 2                | Competitor Agent        | Market intelligence and competitor analysis (full plan).                                               |
| 3                | Lead Generation Agent   | Curated lead lists and CRM integration.                                                                |
| 4                | Product Innovation Agent| Innovative product/process ideas with market/user context.                                             |
| 5                | Marketing Ops Agent     | Automated content creation, distribution, and marketing operations optimization.                       |
| 6                | Funding Agent           | Identification and analysis of funding opportunities and investment strategies.                        |

---

## Exported Entities

This script does **not** export any functions, classes, or constants. It is intended to be run directly as a setup/migration script.

---

## Related Files

- [YpAgentProduct Model](../agentProduct.md)
- [YpSubscriptionPlan Model](../subscriptionPlan.md)

---

## Example Usage

```bash
# Run this script directly to update agent products and plans in the database
node createAgentProductsAndPlans.js
```

---

## Notes

- This script assumes that the database is already seeded with the relevant `YpAgentProduct` and `YpSubscriptionPlan` records (IDs 1–6).
- The script is idempotent: running it multiple times will not create duplicate records but will update existing ones.
- The configuration objects for each agent product are tailored to the specific business logic and user experience for each agent type.

---

## See Also

- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts) (for reference on agent data models in Policy Synth)
