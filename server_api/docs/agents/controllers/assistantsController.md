# Controller: AssistantController

The `AssistantController` class defines a set of API endpoints for managing AI assistant chat and workflow sessions, agent configuration, memory management, and workflow conversations. It integrates with WebSocket clients, Redis for session/memory storage, and various database models for agent products, subscriptions, and workflows. The controller is designed for use in an Express.js application and provides both RESTful and real-time (WebSocket) interactions.

---

## Table of Contents

- [Routes](#routes)
- [Class Properties](#class-properties)
- [Constructor](#constructor)
- [Key Methods](#key-methods)
- [Internal Utility Methods](#internal-utility-methods)
- [Models Used](#models-used)
- [Dependencies](#dependencies)
- [Type Definitions](#type-definitions)

---

## Routes

Below are the documented API endpoints exposed by `AssistantController`. All endpoints are prefixed with `/api/assistants`.

---

### API Endpoint: `PUT /api/assistants/:domainId/chat`

Send a chat message to the assistant and initialize a chat session.

#### Request

##### Parameters

| Name      | Type   | In   | Description                | Required |
|-----------|--------|------|----------------------------|----------|
| domainId  | string | path | The domain identifier      | Yes      |

##### Headers

| Name          | Type   | Description                | Required |
|---------------|--------|----------------------------|----------|
| Authorization | string | Bearer token (if required) | Yes      |

##### Body

```json
{
  "wsClientId": "string",
  "chatLog": [ /* chat log array */ ],
  "currentMode": "string"
}
```
- `wsClientId`: WebSocket client identifier.
- `chatLog`: Array of chat messages.
- `currentMode`: (Optional) Current assistant mode.

#### Response

##### Success (200)

```json
{
  "message": "Chat session initialized",
  "wsClientId": "string"
}
```

##### Error (4xx, 5xx)

```json
{
  "error": "Internal server error"
}
```
Or HTTP status 401/403 if unauthorized.

---

### API Endpoint: `POST /api/assistants/:domainId/voice`

Start a voice session with the assistant.

#### Request

##### Parameters

| Name      | Type   | In   | Description                | Required |
|-----------|--------|------|----------------------------|----------|
| domainId  | string | path | The domain identifier      | Yes      |

##### Body

```json
{
  "wsClientId": "string",
  "currentMode": "string"
}
```
- `wsClientId`: WebSocket client identifier.
- `currentMode`: (Optional) Current assistant mode.

#### Response

##### Success (200)

```json
{
  "message": "Voice session initialized",
  "wsClientId": "string"
}
```

##### Error (4xx, 5xx)

```json
{
  "error": "Internal server error"
}
```

---

### API Endpoint: `GET /api/assistants/:domainId/memory`

Get the current assistant memory for the user/session.

#### Request

##### Parameters

| Name      | Type   | In   | Description                | Required |
|-----------|--------|------|----------------------------|----------|
| domainId  | string | path | The domain identifier      | Yes      |

#### Response

##### Success (200)

```json
{
  // YpBaseAssistantMemoryData object
}
```

##### Error (4xx, 5xx)

```json
{
  "error": "Unauthorized"
}
```
Or HTTP status 401/403 if unauthorized.

---

### API Endpoint: `DELETE /api/assistants/:domainId/chatlog`

Clear the current chat log and reset assistant memory.

#### Request

##### Parameters

| Name      | Type   | In   | Description                | Required |
|-----------|--------|------|----------------------------|----------|
| domainId  | string | path | The domain identifier      | Yes      |

#### Response

##### Success (200)

No content.

##### Error (4xx, 5xx)

```json
{
  "error": "Internal server error"
}
```

---

### API Endpoint: `PUT /api/assistants/:domainId/updateAssistantMemoryLoginStatus`

Update the assistant memory to reflect the user's login status.

#### Request

##### Parameters

| Name      | Type   | In   | Description                | Required |
|-----------|--------|------|----------------------------|----------|
| domainId  | string | path | The domain identifier      | Yes      |

#### Response

##### Success (200)

No content.

##### Error (4xx, 5xx)

```json
{
  "error": "Unauthorized"
}
```
Or HTTP status 401/403 if unauthorized.

---

### API Endpoint: `PUT /api/assistants/:domainId/:subscriptionId/submitAgentConfiguration`

Submit answers to required agent configuration questions for a subscription.

#### Request

##### Parameters

| Name           | Type   | In   | Description                | Required |
|----------------|--------|------|----------------------------|----------|
| domainId       | string | path | The domain identifier      | Yes      |
| subscriptionId | string | path | The subscription ID        | Yes      |

##### Body

```json
{
  "requiredQuestionsAnswers": [ /* array of answers */ ]
}
```

#### Response

##### Success (200)

No content.

##### Error (4xx, 5xx)

```json
{
  "error": "Internal server error"
}
```

---

### API Endpoint: `GET /api/assistants/:domainId/:subscriptionId/getConfigurationAnswers`

Get the answers to required agent configuration questions for a subscription.

#### Request

##### Parameters

| Name           | Type   | In   | Description                | Required |
|----------------|--------|------|----------------------------|----------|
| domainId       | string | path | The domain identifier      | Yes      |
| subscriptionId | string | path | The subscription ID        | Yes      |

#### Response

##### Success (200)

```json
{
  "success": true,
  "data": [ /* array of answers */ ]
}
```

##### Error (4xx, 5xx)

```json
{
  "error": "Unauthorized"
}
```
Or HTTP status 404 if subscription not found.

---

### API Endpoint: `PUT /api/assistants/:groupId/:agentId/startWorkflowAgent`

Start a workflow agent for a group and agent.

#### Request

##### Parameters

| Name    | Type   | In   | Description                | Required |
|---------|--------|------|----------------------------|----------|
| groupId | string | path | The group identifier       | Yes      |
| agentId | string | path | The agent identifier       | Yes      |

##### Body

```json
{
  "wsClientId": "string"
}
```

#### Response

##### Success (200)

No content.

##### Error (4xx, 5xx)

```json
{
  "error": "Internal server error"
}
```

---

### API Endpoint: `GET /api/assistants/:groupId/:runId/updatedWorkflow`

Get the updated workflow and status for a given run.

#### Request

##### Parameters

| Name   | Type   | In   | Description                | Required |
|--------|--------|------|----------------------------|----------|
| groupId| string | path | The group identifier       | Yes      |
| runId  | string | path | The run identifier         | Yes      |

#### Response

##### Success (200)

```json
{
  "workflow": { /* workflow object */ },
  "status": "string"
}
```

##### Error (4xx, 5xx)

```json
{
  "error": "Unauthorized"
}
```
Or HTTP status 500 on error.

---

### API Endpoint: `POST /api/assistants/:groupId/:agentId/startNextWorkflowStep`

Start the next step in a workflow for a group and agent.

#### Request

##### Parameters

| Name    | Type   | In   | Description                | Required |
|---------|--------|------|----------------------------|----------|
| groupId | string | path | The group identifier       | Yes      |
| agentId | string | path | The agent identifier       | Yes      |

#### Response

##### Success (200)

No content.

##### Error (4xx, 5xx)

```json
{
  "error": "Internal server error"
}
```

---

### API Endpoint: `POST /api/assistants/:groupId/:agentId/stopCurrentWorkflowStep`

Stop the current step in a workflow for a group and agent.

#### Request

##### Parameters

| Name    | Type   | In   | Description                | Required |
|---------|--------|------|----------------------------|----------|
| groupId | string | path | The group identifier       | Yes      |
| agentId | string | path | The agent identifier       | Yes      |

#### Response

##### Success (200)

No content.

##### Error (4xx, 5xx)

```json
{
  "error": "Internal server error"
}
```

---

### API Endpoint: `PUT /api/assistants/:groupId/:agentId/:runId/advanceOrStopWorkflow`

Advance or stop the current workflow step for a run.

#### Request

##### Parameters

| Name    | Type   | In   | Description                | Required |
|---------|--------|------|----------------------------|----------|
| groupId | string | path | The group identifier       | Yes      |
| agentId | string | path | The agent identifier       | Yes      |
| runId   | string | path | The run identifier         | Yes      |

##### Body

```json
{
  "status": "string",
  "wsClientId": "string"
}
```

#### Response

##### Success (200)

No content.

##### Error (4xx, 5xx)

```json
{
  "error": "Internal server error"
}
```

---

### API Endpoint: `GET /api/assistants/:groupId/:agentId/getDocxReport`

Get a DOCX report generated from the last status message's markdown report.

#### Request

##### Parameters

| Name    | Type   | In   | Description                | Required |
|---------|--------|------|----------------------------|----------|
| groupId | string | path | The group identifier       | Yes      |
| agentId | string | path | The agent identifier       | Yes      |

#### Response

##### Success (200)

- Returns a DOCX file as an attachment.

##### Error (4xx, 5xx)

- 404 if no status message found.
- 400 if no markdown report found.
- 500 on server error.

---

### API Endpoint: `GET /api/assistants/:domainId/workflowConversations/running`

Get all running workflow conversations for the current user.

#### Request

##### Parameters

| Name      | Type   | In   | Description                | Required |
|-----------|--------|------|----------------------------|----------|
| domainId  | string | path | The domain identifier      | Yes      |

#### Response

##### Success (200)

```json
{
  "success": true,
  "data": { "workflows": [ /* array of workflows */ ] },
  "message": "Running workflows retrieved successfully"
}
```

##### Error (4xx, 5xx)

```json
{
  "error": "Unauthorized"
}
```
Or HTTP status 500 on error.

---

### API Endpoint: `GET /api/assistants/:domainId/workflowConversations/all`

Get all workflow conversations for the current user.

#### Request

##### Parameters

| Name      | Type   | In   | Description                | Required |
|-----------|--------|------|----------------------------|----------|
| domainId  | string | path | The domain identifier      | Yes      |

#### Response

##### Success (200)

```json
{
  "success": true,
  "data": { "workflows": [ /* array of workflows */ ] },
  "message": "All workflows retrieved successfully"
}
```

##### Error (4xx, 5xx)

```json
{
  "error": "Unauthorized"
}
```
Or HTTP status 500 on error.

---

### API Endpoint: `PUT /api/assistants/:domainId/workflowConversations/connect`

Connect to a workflow conversation.

#### Request

##### Parameters

| Name      | Type   | In   | Description                | Required |
|-----------|--------|------|----------------------------|----------|
| domainId  | string | path | The domain identifier      | Yes      |

##### Body

```json
{
  "workflowConversationId": "string",
  "connectionData": { /* optional connection data */ }
}
```

#### Response

##### Success (200)

```json
{
  "success": true,
  "data": { /* updated workflow conversation */ },
  "message": "Connected to workflow conversation <id> successfully"
}
```

##### Error (4xx, 5xx)

```json
{
  "error": "Unauthorized"
}
```
Or HTTP status 500 on error.

---

## Class Properties

| Name                        | Type                                      | Description                                      |
|-----------------------------|-------------------------------------------|--------------------------------------------------|
| path                        | string                                    | Base path for the controller routes.             |
| router                      | express.Router                            | Express router instance.                         |
| wsClients                   | Map<string, WebSocket>                    | Map of WebSocket clients.                        |
| chatAssistantInstances      | Map<string, YpAgentAssistant>             | Map of chat assistant instances.                 |
| voiceAssistantInstances     | Map<string, YpAgentAssistant>             | Map of voice assistant instances.                |
| agentQueueManager           | AgentQueueManager                         | Manages agent queue operations.                  |
| workflowConversationManager | WorkflowConversationManager               | Manages workflow conversations.                  |
| defaultStartAgentMode       | YpAssistantMode                           | Default assistant mode.                          |

---

## Constructor

```typescript
constructor(wsClients: Map<string, WebSocket>)
```
- Initializes the controller, sets up models, managers, and routes.

---

## Key Methods

### initializeModels

Initializes all Sequelize models and their associations.

### initializeRoutes

Registers all Express routes for the controller.

### getDocxReport

Generates and returns a DOCX report from the last status message's markdown report.

### advanceOrStopCurrentWorkflowStep

Advances or stops the current workflow step for a run.

### startNextWorkflowStep

Starts the next step in a workflow.

### stopCurrentWorkflowStep

Stops the current step in a workflow.

### getAgentConfigurationAnswers

Returns the answers to required agent configuration questions for a subscription.

### getUpdatedWorkflow

Returns the updated workflow and status for a given run.

### startWorkflowAgent

Starts a workflow agent for a group and agent.

### submitAgentConfiguration

Submits answers to required agent configuration questions for a subscription.

### updateAssistantMemoryLoginStatus

Updates the assistant memory to reflect the user's login status.

### clearChatLog

Clears the current chat log and resets assistant memory.

### getMemory

Returns the current assistant memory for the user/session.

### startVoiceSession

Starts a voice session with the assistant.

### sendChatMessage

Sends a chat message to the assistant and initializes a chat session.

### getRunningWorkflowConversations

Returns all running workflow conversations for the current user.

### getAllWorkflowConversations

Returns all workflow conversations for the current user.

### connectToWorkflowConversation

Connects to a workflow conversation.

---

## Internal Utility Methods

### getLastStatusMessageFromDB

Fetches the last status message for an agent from the database.

### getMemoryRedisKey

Generates the Redis key for assistant memory based on the request.

### loadMemoryWithOwnership

Loads assistant memory from Redis, ensuring the current user has ownership or upgrades ownership if possible.

---

## Models Used

- [YpAgentProduct](./agentProduct.md)
- [YpAgentProductBundle](./agentProductBundle.md)
- [YpAgentProductBoosterPurchase](./agentProductBoosterPurchase.md)
- [YpAgentProductRun](./agentProductRun.md)
- [YpSubscription](./subscription.md)
- [YpSubscriptionPlan](./subscriptionPlan.md)
- [YpSubscriptionUser](./subscriptionUser.md)
- [YpDiscount](./discount.md)

---

## Dependencies

- `express` (Express.js web framework)
- `ws` (WebSocket)
- `marked` (Markdown to HTML converter)
- `html-to-docx` (HTML to DOCX converter)
- `@policysynth/agents/dbModels/index.js` (Sequelize models)
- `@policysynth/agents/operations/agentQueueManager.js` ([AgentQueueManager](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/operations/agentQueueManager.ts))
- `../assistants/agentAssistant.js` ([YpAgentAssistant](./agentAssistant.md))
- `../managers/notificationAgentQueueManager.js` ([NotificationAgentQueueManager](./notificationAgentQueueManager.md))
- `../managers/workflowConversationManager.js` ([WorkflowConversationManager](./workflowConversationManager.md))
- `../../authorization.cjs` (Authorization middleware)

---

## Type Definitions

### YpRequest

Custom Express request interface with additional properties.

| Name           | Type    | Description                                 |
|----------------|---------|---------------------------------------------|
| ypDomain       | any     | Domain context                              |
| ypCommunity    | any     | Community context                           |
| sso            | any     | SSO context                                 |
| redisClient    | any     | Redis client instance                       |
| user           | any     | Authenticated user object                   |
| clientAppPath  | string  | Path to client app                          |
| adminAppPath   | string  | Path to admin app                           |
| dirName        | string  | Directory name                              |
| useNewVersion  | boolean | Use new version flag                        |

---

## Example Usage

```typescript
import { AssistantController } from './controllers/assistantController';
import express from 'express';
import WebSocket from 'ws';

const app = express();
const wsClients = new Map<string, WebSocket>();

const assistantController = new AssistantController(wsClients);

app.use(assistantController.path, assistantController.router);
```

---

## See Also

- [YpAgentAssistant](./agentAssistant.md)
- [NotificationAgentQueueManager](./notificationAgentQueueManager.md)
- [WorkflowConversationManager](./workflowConversationManager.md)
- [AgentQueueManager](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/operations/agentQueueManager.ts)
- [YpAgentProduct](./agentProduct.md)
- [YpSubscription](./subscription.md)

---

**Note:** This controller expects certain middleware (such as authentication and Redis client injection) to be present in the Express app. Some endpoints require the user to be authenticated and/or authorized.