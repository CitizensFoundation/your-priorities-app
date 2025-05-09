# Service Module: NewAiModelSetup

This module provides a set of static methods for initializing, seeding, and configuring AI models and related agent classes in a Policy Synth application. It is responsible for:

- Initializing Sequelize models and their associations.
- Seeding the database with default/test AI models for Anthropic, OpenAI, and Google providers.
- Seeding a top-level agent class if it does not exist.
- Setting up API keys for groups based on the latest active AI models.

It interacts with various [Policy Synth data models](https://github.com/CitizensFoundation/policy-synth/tree/main/agents/src/dbModels) such as [PsAiModel](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/aiModel.ts), [PsAgentClass](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agentClass.ts), and others.

---

## Exported Class: `NewAiModelSetup`

### Methods

| Name                              | Parameters                                   | Return Type     | Description                                                                                  |
|------------------------------------|----------------------------------------------|-----------------|----------------------------------------------------------------------------------------------|
| `initializeModels`                 | —                                            | `Promise<void>` | Initializes all models and their associations.                                               |
| `seedAnthropicModels`              | `userId: number`                             | `Promise<void>` | Seeds the "Anthropic Sonnet 3.5" model if it does not exist.                                 |
| `seedAnthropic37Models`            | `userId: number`                             | `Promise<void>` | Seeds the "Anthropic Sonnet 3.7" model if it does not exist.                                 |
| `seedOpenAiModels`                 | `userId: number`                             | `Promise<void>` | Seeds a set of OpenAI models (GPT-4o, GPT-4o Mini, o1 Mini, o1 Preview, o1 24, o3 mini, etc).|
| `seedGoogleModels`                 | `userId: number`                             | `Promise<void>` | Seeds a set of Google Gemini models.                                                         |
| `seedAiModels`                     | `userId: number`                             | `Promise<void>` | Master seeding function: calls all provider-specific seeders and seeds a top-level agent class.|
| `setupAiModels`                    | `userId: number`                             | `void`          | Helper to delay model seeding slightly and ensure the user exists before seeding.            |
| `setupApiKeysForGroup`             | `group: any`                                 | `Promise<void>` | Sets up API keys for a group based on the latest active AI models and environment variables.  |

---

### Method Details

---

#### `static async initializeModels(): Promise<void>`

Initializes all Sequelize models by calling their `associate` methods (if present) and synchronizes the database if in development mode or if `FORCE_DB_SYNC` is set.

**Parameters:** None

**Returns:** `Promise<void>`

**Behavior:**
- Calls `psSequelize.sync()` if in development or forced sync mode.
- Iterates over all models in `psModels` and calls their `associate` method if it exists.
- Logs status and errors.

---

#### `static async seedAnthropicModels(userId: number): Promise<void>`

Seeds the "Anthropic Sonnet 3.5" AI model if it does not already exist.

**Parameters:**

| Name   | Type   | Description                        |
|--------|--------|------------------------------------|
| userId | number | The user ID to associate with the new model. |

**Returns:** `Promise<void>`

---

#### `static async seedAnthropic37Models(userId: number): Promise<void>`

Seeds the "Anthropic Sonnet 3.7" AI model if it does not already exist.

**Parameters:**

| Name   | Type   | Description                        |
|--------|--------|------------------------------------|
| userId | number | The user ID to associate with the new model. |

**Returns:** `Promise<void>`

---

#### `static async seedOpenAiModels(userId: number): Promise<void>`

Seeds a set of OpenAI models, including:
- GPT-4o
- GPT-4o Mini
- o1 Mini
- o1 Preview
- o1 24
- o3 mini
- GPT-4.5 Preview
- o3
- o4 mini
- GPT-4.1

If a model already exists, it may update its configuration.

**Parameters:**

| Name   | Type   | Description                        |
|--------|--------|------------------------------------|
| userId | number | The user ID to associate with the new models. |

**Returns:** `Promise<void>`

---

#### `static async seedGoogleModels(userId: number): Promise<void>`

Seeds a set of Google Gemini models, including:
- Gemini 1.5 Pro 2
- Gemini 1.5 Flash 2
- Gemini 2.0 Flash

**Parameters:**

| Name   | Type   | Description                        |
|--------|--------|------------------------------------|
| userId | number | The user ID to associate with the new models. |

**Returns:** `Promise<void>`

---

#### `static async seedAiModels(userId: number): Promise<void>`

Master seeding function. Calls all provider-specific seeding functions and seeds a top-level agent class ("Operations") if it does not exist.

**Parameters:**

| Name   | Type   | Description                        |
|--------|--------|------------------------------------|
| userId | number | The user ID to associate with the new models and agent class. |

**Returns:** `Promise<void>`

---

#### `static setupAiModels(userId: number): void`

Helper to delay model seeding slightly (100ms). Ensures the user exists before seeding.

**Parameters:**

| Name   | Type   | Description                        |
|--------|--------|------------------------------------|
| userId | number | The user ID to associate with the new models. |

**Returns:** `void`

---

#### `static async setupApiKeysForGroup(group: any): Promise<void>`

Sets up the API keys for a given group based on the latest active AI models and environment variables.

**Parameters:**

| Name  | Type | Description                                 |
|-------|------|---------------------------------------------|
| group | any  | The group instance on which to set the API keys. |

**Returns:** `Promise<void>`

**Behavior:**
- Looks up the latest active model for each supported model name.
- Associates the correct API key (from environment variables) with each model.
- Updates the group's `private_access_configuration` property.

---

## Internal/Referenced Models

- [PsAiModel](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/aiModel.ts)
- [PsAgentClass](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agentClass.ts)
- [PsAgentClassCategories](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/agentCategories.ts)
- [PsExternalApiUsage](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/externalApiUsage.ts)
- [PsExternalApi](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/externalApis.ts)
- [PsModelUsage](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/modelUsage.ts)
- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)
- [PsAgentAuditLog](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agentAuditLog.ts)
- [PsAgentConnector](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agentConnector.ts)
- [PsAgentConnectorClass](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agentConnectorClass.ts)
- [PsAgentRegistry](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agentRegistry.ts)
- [PsAiModelSize, PsAiModelType](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/aiModelTypes.ts)

---

## Configuration

### Environment Variables Used

| Name                        | Description                                      |
|-----------------------------|--------------------------------------------------|
| `FORCE_DB_SYNC`             | If set, forces Sequelize to sync the DB schema.  |
| `NODE_ENV`                  | If set to "development", enables DB sync.        |
| `ANTHROPIC_CLAUDE_API_KEY`  | API key for Anthropic models.                    |
| `OPENAI_API_KEY`            | API key for OpenAI models.                       |
| `GEMINI_API_KEY`            | API key for Google Gemini models.                |

---

## Example Usage

```typescript
import { NewAiModelSetup } from './path/to/NewAiModelSetup';

// Initialize models and associations
await NewAiModelSetup.initializeModels();

// Seed all AI models and agent classes for a given user
await NewAiModelSetup.seedAiModels(1);

// Set up API keys for a group instance
await NewAiModelSetup.setupApiKeysForGroup(groupInstance);
```

---

## See Also

- [PsAiModel](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/aiModel.ts)
- [PsAgentClass](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agentClass.ts)
- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)
- [PsAgentClassCategories](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/agentCategories.ts)
- [PsAiModelType, PsAiModelSize](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/aiModelTypes.ts)
