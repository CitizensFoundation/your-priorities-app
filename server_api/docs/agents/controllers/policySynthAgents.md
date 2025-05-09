# Controller: PolicySynthAgentsController

The `PolicySynthAgentsController` is an Express.js controller class that manages API endpoints for Policy Synth agents, including agent creation, configuration, memory management, connector management, AI model assignment, cost tracking, and status control. It integrates with various Policy Synth agent managers and models, and enforces authorization via middleware.

## Constructor

```typescript
constructor(wsClients: Map<string, WebSocket>)
```
- **wsClients**: `Map<string, WebSocket>`  
  A map of WebSocket clients, used for real-time communication with agent clients.

Initializes all agent-related managers and sets up API routes. Also seeds AI models for testing.

---

## API Endpoints

### [GET] /api/agents/:groupId

Retrieve agent information for a specific group.

#### Request

##### Parameters

| Name    | Type   | In   | Description           | Required |
|---------|--------|------|-----------------------|----------|
| groupId | string | path | The group identifier. | Yes      |

##### Headers

| Name          | Type   | Description                | Required |
|---------------|--------|----------------------------|----------|
| Authorization | string | Bearer token (if required) | Yes      |

#### Response

##### Success (200)
```json
{
  // Agent object
}
```
Returns the agent object for the specified group.

##### Error (500)
```json
{
  "error": "Internal Server Error"
}
```
Internal server error.

---

### [PUT] /api/agents/:groupId/:agentId/:nodeType/:nodeId/configuration

Update configuration for an agent or connector node.

#### Request

##### Parameters

| Name     | Type   | In   | Description                        | Required |
|----------|--------|------|------------------------------------|----------|
| groupId  | string | path | The group identifier.              | Yes      |
| agentId  | string | path | The agent identifier.              | Yes      |
| nodeType | string | path | "agent" or "connector".            | Yes      |
| nodeId   | string | path | The node (agent/connector) ID.     | Yes      |

##### Body

```json
{
  // Configuration object
}
```
The new configuration for the node.

#### Response

##### Success (200)
```json
{
  "message": "agent configuration updated successfully"
}
```
or
```json
{
  "message": "connector configuration updated successfully"
}
```

##### Error (400)
```json
{
  "error": "Invalid node type"
}
```

##### Error (500)
```json
{
  "error": "Internal Server Error"
}
```

---

### [POST] /api/agents/:groupId

Create a new agent in a group.

#### Request

##### Parameters

| Name    | Type   | In   | Description           | Required |
|---------|--------|------|-----------------------|----------|
| groupId | string | path | The group identifier. | Yes      |

##### Body

```json
{
  "name": "string",
  "agentClassId": "number",
  "aiModels": ["string"],
  "parentAgentId": "number | null"
}
```
- **name**: Name of the agent.
- **agentClassId**: ID of the agent class.
- **aiModels**: Array of AI model IDs.
- **parentAgentId**: (Optional) Parent agent ID.

#### Response

##### Success (201)
```json
{
  // Created agent object
}
```

##### Error (400)
```json
{
  "error": "Error message"
}
```

##### Error (500)
```json
{
  "error": "Internal Server Error"
}
```

---

### [POST] /api/agents/:groupId/:agentId/outputConnectors

Create a new output connector for an agent.

#### Request

##### Parameters

| Name    | Type   | In   | Description           | Required |
|---------|--------|------|-----------------------|----------|
| groupId | string | path | The group identifier. | Yes      |
| agentId | string | path | The agent identifier. | Yes      |

##### Body

```json
{
  "connectorClassId": "number",
  "name": "string"
}
```
- **connectorClassId**: ID of the connector class.
- **name**: Name of the connector.

#### Response

##### Success (201)
```json
{
  // Created connector object
}
```

##### Error (400)
```json
{
  "error": "Agent ID, connector class ID, name, and type (input/output) are required"
}
```

##### Error (500)
```json
{
  "error": "Internal Server Error"
}
```

---

### [POST] /api/agents/:groupId/:agentId/inputConnectors

Create a new input connector for an agent.

#### Request

Same as outputConnectors, but for input connectors.

---

### [POST] /api/agents/:groupId/:agentId/inputConnectors/existing

Add an existing input connector to an agent.

#### Request

##### Parameters

| Name     | Type   | In   | Description           | Required |
|----------|--------|------|-----------------------|----------|
| groupId  | string | path | The group identifier. | Yes      |
| agentId  | string | path | The agent identifier. | Yes      |

##### Body

```json
{
  "connectorId": "number"
}
```
- **connectorId**: ID of the existing connector.

#### Response

##### Success (200)
```json
{
  "message": "Existing <connectorId> connector added successfully"
}
```

##### Error (400)
```json
{
  "error": "Group ID, agent ID and connector ID (input/output) are required"
}
```

##### Error (500)
```json
{
  "error": "An unexpected error occurred"
}
```

---

### [POST] /api/agents/:groupId/:agentId/outputConnectors/existing

Add an existing output connector to an agent.

#### Request

Same as inputConnectors/existing, but for output connectors.

---

### [PUT] /api/agents/:groupId/:agentId/memory

Replace the memory contents of an agent.

#### Request

##### Parameters

| Name    | Type   | In   | Description           | Required |
|---------|--------|------|-----------------------|----------|
| groupId | string | path | The group identifier. | Yes      |
| agentId | string | path | The agent identifier. | Yes      |

##### Body

```json
{
  // Arbitrary memory object
}
```
The new memory contents for the agent.

#### Response

##### Success (200)
```json
{
  "message": "Memory replaced successfully"
}
```

##### Error (400)
```json
{
  "error": "Cannot save empty memory"
}
```
or
```json
{
  "error": "Invalid JSON format for memory"
}
```

##### Error (404)
```json
{
  "error": "Memory key not found for the specified agent"
}
```

##### Error (500)
```json
{
  "error": "An unexpected error occurred"
}
```

---

### [GET] /api/agents/:groupId/:agentId/memory

Retrieve the memory contents of an agent.

#### Request

##### Parameters

| Name    | Type   | In   | Description           | Required |
|---------|--------|------|-----------------------|----------|
| groupId | string | path | The group identifier. | Yes      |
| agentId | string | path | The agent identifier. | Yes      |

#### Response

##### Success (200)
```json
{
  // Memory contents object
}
```

##### Error (404)
```json
{
  "error": "Memory key not found for the specified agent"
}
```
or
```json
{
  "error": "Memory contents not found"
}
```

##### Error (500)
```json
{
  "error": "An unexpected error occurred"
}
```

---

### [GET] /api/agents/:groupId/:id/ai-models

Get all AI models assigned to an agent.

#### Request

##### Parameters

| Name    | Type   | In   | Description           | Required |
|---------|--------|------|-----------------------|----------|
| groupId | string | path | The group identifier. | Yes      |
| id      | string | path | The agent identifier. | Yes      |

#### Response

##### Success (200)
```json
[
  // Array of AI model objects
]
```

##### Error (500)
```json
{
  "error": "Internal Server Error"
}
```

---

### [POST] /api/agents/:groupId/:agentId/ai-models

Assign an AI model to an agent.

#### Request

##### Parameters

| Name    | Type   | In   | Description           | Required |
|---------|--------|------|-----------------------|----------|
| groupId | string | path | The group identifier. | Yes      |
| agentId | string | path | The agent identifier. | Yes      |

##### Body

```json
{
  "modelId": "string",
  "size": "string"
}
```
- **modelId**: ID of the AI model.
- **size**: Size of the model.

#### Response

##### Success (201)
```json
{
  "message": "AI model added successfully"
}
```

##### Error (500)
```json
{
  "error": "Internal Server Error"
}
```

---

### [DELETE] /api/agents/:groupId/:agentId/ai-models/:modelId

Remove an AI model from an agent.

#### Request

##### Parameters

| Name    | Type   | In   | Description           | Required |
|---------|--------|------|-----------------------|----------|
| groupId | string | path | The group identifier. | Yes      |
| agentId | string | path | The agent identifier. | Yes      |
| modelId | string | path | The AI model ID.      | Yes      |

#### Response

##### Success (200)
```json
{
  "message": "AI model removed successfully"
}
```

##### Error (500)
```json
{
  "error": "Internal Server Error"
}
```

---

### [GET] /api/agents/:groupId/registry/agentClasses

Get all active agent classes for the current user.

#### Request

##### Parameters

| Name    | Type   | In   | Description           | Required |
|---------|--------|------|-----------------------|----------|
| groupId | string | path | The group identifier. | Yes      |

#### Response

##### Success (200)
```json
[
  // Array of agent class objects
]
```

##### Error (500)
```json
{
  "error": "Internal Server Error"
}
```

---

### [GET] /api/agents/:groupId/registry/connectorClasses

Get all active connector classes for the current user.

#### Request

##### Parameters

| Name    | Type   | In   | Description           | Required |
|---------|--------|------|-----------------------|----------|
| groupId | string | path | The group identifier. | Yes      |

#### Response

##### Success (200)
```json
[
  // Array of connector class objects
]
```

##### Error (500)
```json
{
  "error": "Internal Server Error"
}
```

---

### [GET] /api/agents/:groupId/registry/aiModels

Get all active AI models.

#### Request

##### Parameters

| Name    | Type   | In   | Description           | Required |
|---------|--------|------|-----------------------|----------|
| groupId | string | path | The group identifier. | Yes      |

#### Response

##### Success (200)
```json
[
  // Array of AI model objects
]
```

##### Error (500)
```json
{
  "error": "Internal Server Error"
}
```

---

### [POST] /api/agents/:groupId/:id/control

Control an agent (e.g., start, stop, pause).

#### Request

##### Parameters

| Name    | Type   | In   | Description           | Required |
|---------|--------|------|-----------------------|----------|
| groupId | string | path | The group identifier. | Yes      |
| id      | string | path | The agent identifier. | Yes      |

##### Body

```json
{
  "action": "string"
}
```
- **action**: The control action to perform (e.g., "start", "pause", "stop").

#### Response

##### Success (200)
```json
{
  "message": "Action result message"
}
```

##### Error (500)
```json
{
  "error": "An unexpected error occurred"
}
```

---

### [GET] /api/agents/:groupId/:id/status

Get the status of an agent.

#### Request

##### Parameters

| Name    | Type   | In   | Description           | Required |
|---------|--------|------|-----------------------|----------|
| groupId | string | path | The group identifier. | Yes      |
| id      | string | path | The agent identifier. | Yes      |

#### Response

##### Success (200)
```json
{
  // Status object
}
```

##### Error (404)
```json
{
  "error": "Agent status not found"
}
```

##### Error (500)
```json
{
  "error": "Internal Server Error"
}
```

---

### [GET] /api/agents/:groupId/:id/costs

Get the total costs for an agent.

#### Request

##### Parameters

| Name    | Type   | In   | Description           | Required |
|---------|--------|------|-----------------------|----------|
| groupId | string | path | The group identifier. | Yes      |
| id      | string | path | The agent identifier. | Yes      |

#### Response

##### Success (200)
```json
{
  // Total costs object
}
```

##### Error (500)
```json
{
  "error": "Internal Server Error"
}
```

---

### [GET] /api/agents/:groupId/:id/costs/detail

Get detailed cost breakdown for an agent.

#### Request

##### Parameters

| Name    | Type   | In   | Description           | Required |
|---------|--------|------|-----------------------|----------|
| groupId | string | path | The group identifier. | Yes      |
| id      | string | path | The agent identifier. | Yes      |

#### Response

##### Success (200)
```json
[
  // Array of cost detail objects
]
```

##### Error (500)
```json
{
  "error": "Internal Server Error"
}
```

---

## Static Methods

### setupApiKeysForGroup

A proxy for setting up API keys for a group.

```typescript
static async setupApiKeysForGroup(group: any): Promise<void>
```
- **group**: `any`  
  The group instance to configure.

Delegates to `NewAiModelSetup.setupApiKeysForGroup`.

---

## Internal Methods

These methods are used as route handlers and are not directly exposed as endpoints, but are important for understanding the controller's logic.

### replaceAgentMemory

Replaces the memory contents of an agent in Redis.

#### Parameters

| Name | Type            | Description                |
|------|-----------------|----------------------------|
| req  | YpRequest       | Express request object     |
| res  | express.Response| Express response object    |

---

### addExistingConnector

Adds an existing input or output connector to an agent.

#### Parameters

| Name | Type            | Description                |
|------|-----------------|----------------------------|
| req  | YpRequest       | Express request object     |
| res  | express.Response| Express response object    |

---

### getAgentMemory

Retrieves the memory contents of an agent from Redis.

#### Parameters

| Name | Type            | Description                |
|------|-----------------|----------------------------|
| req  | YpRequest       | Express request object     |
| res  | express.Response| Express response object    |

---

### createConnector

Creates a new input or output connector for an agent.

#### Parameters

| Name | Type            | Description                |
|------|-----------------|----------------------------|
| req  | YpRequest       | Express request object     |
| res  | express.Response| Express response object    |
| type | "input" \| "output" | Connector type         |

---

## Dependencies

- [AgentQueueManager](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/operations/agentQueueManager.js)
- [AgentCostManager](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/operations/agentCostsManager.js)
- [AgentManager](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/operations/agentManager.js)
- [AgentConnectorManager](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/operations/agentConnectorManager.js)
- [AgentRegistryManager](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/operations/agentRegistryManager.js)
- [PsAiModel](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/aiModel.ts)
- [PsAgentClass](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agentClass.ts)
- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)
- [PsAgentAuditLog](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agentAuditLog.ts)
- [PsAgentConnector](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agentConnector.ts)
- [PsAgentConnectorClass](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agentConnectorClass.ts)
- [PsAgentRegistry](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agentRegistry.ts)
- [PsExternalApiUsage](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/externalApiUsage.ts)
- [PsExternalApi](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/externalApis.ts)
- [PsModelUsage](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/modelUsage.ts)
- [PsAgentClassCategories](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/agentCategories.js)
- [NewAiModelSetup](./newAiModelSetup.md)
- [auth middleware](../../authorization.cjs)
- [models](../../models/index.cjs)

---

## Types

### YpRequest

Custom Express request interface with additional properties.

| Property      | Type   | Description                        |
|---------------|--------|------------------------------------|
| ypDomain      | any    | Domain context                     |
| ypCommunity   | any    | Community context                  |
| sso           | any    | SSO context                        |
| redisClient   | any    | Redis client instance              |
| user          | any    | Authenticated user object          |

---

## See Also

- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)
- [PsAiModel](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/aiModel.ts)
- [NewAiModelSetup](./newAiModelSetup.md)
- [AgentManager](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/operations/agentManager.js)
- [AgentConnectorManager](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/operations/agentConnectorManager.js)
- [AgentQueueManager](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/operations/agentQueueManager.js)
- [AgentCostManager](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/operations/agentCostsManager.js)
- [AgentRegistryManager](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/operations/agentRegistryManager.js)

---

## Example Usage

```typescript
import { PolicySynthAgentsController } from './controllers/PolicySynthAgentsController';
import express from 'express';
import WebSocket from 'ws';

const wsClients = new Map<string, WebSocket>();
const agentsController = new PolicySynthAgentsController(wsClients);

const app = express();
app.use(agentsController.path, agentsController.router);
```

---

**Note:**  
All endpoints require appropriate authorization middleware (e.g., `auth.can("view group")`, `auth.can("edit group")`).  
The controller expects a Redis client to be attached to the request object for memory operations.  
For more details on agent models and managers, see the [Policy Synth agents repository](https://github.com/CitizensFoundation/policy-synth/tree/main/agents/src).