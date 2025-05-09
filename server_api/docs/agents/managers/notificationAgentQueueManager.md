# Service: NotificationAgentQueueManager

The `NotificationAgentQueueManager` class extends [AgentQueueManager](./agentQueueManager.md) and manages agent workflow notifications, queue operations, and status updates for Policy Synth agents. It integrates with BullMQ for job queues, Redis for status storage, and WebSocket for real-time notifications. It also handles email notifications to group admins when workflow steps are completed.

---

## Constructor

### `constructor(wsClients: Map<string, WebSocket>)`

Initializes the NotificationAgentQueueManager, sets up Redis, queues, and WebSocket clients.

#### Parameters

| Name      | Type                          | Description                                 |
|-----------|-------------------------------|---------------------------------------------|
| wsClients | Map<string, WebSocket>        | Map of WebSocket client IDs to connections. |

---

## Methods

### `sendNotification(agent, agentRun, action, wsClientId, status, result, agentRunId?, updatedWorkflow?)`

Sends a workflow update notification to a WebSocket client and, if applicable, sends an email notification to group admins.

#### Parameters

| Name            | Type                                         | Description                                      |
|-----------------|----------------------------------------------|--------------------------------------------------|
| agent           | [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts) | The agent instance.                              |
| agentRun        | YpAgentProductRun                            | The agent run instance.                          |
| action          | string                                       | The action performed.                            |
| wsClientId      | string                                       | WebSocket client ID.                             |
| status          | string                                       | Status of the workflow step.                     |
| result          | any                                          | Result data to send.                             |
| agentRunId      | number (optional)                            | ID of the agent run.                             |
| updatedWorkflow | YpAgentRunWorkflowConfiguration (optional)   | Updated workflow configuration.                  |

#### WebSocket Notification Payload Example

```json
{
  "type": "updated_workflow",
  "action": "string",
  "status": "string",
  "result": {},
  "agentRunId": 123,
  "updatedWorkflow": {
    "workflow": {},
    "status": "string",
    "currentWorkflowStep": {}
  }
}
```

---

### `sendNotificationEmail(agent, agentRun, updatedWorkflow)`

Sends an email notification to group admins when a workflow step is completed.

#### Parameters

| Name            | Type                                         | Description                                      |
|-----------------|----------------------------------------------|--------------------------------------------------|
| agent           | [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts) | The agent instance.                              |
| agentRun        | YpAgentProductRun                            | The agent run instance.                          |
| updatedWorkflow | YpAgentRunWorkflowConfiguration              | Updated workflow configuration.                  |

---

### `goBackOneWorkflowStepIfNeeded(agentRunId, status, wsClientId, currentWorkflowStepIndex?)`

Moves the workflow one step back if needed, updating the agent run status and workflow.

#### Parameters

| Name                     | Type     | Description                                 |
|--------------------------|----------|---------------------------------------------|
| agentRunId               | number   | ID of the agent run.                        |
| status                   | string   | Current status of the agent run.            |
| wsClientId               | string   | WebSocket client ID.                        |
| currentWorkflowStepIndex | number (optional) | Current workflow step index.        |

---

### `advanceWorkflowStepOrCompleteAgentRun(agentRunId, status, wsClientId, currentWorkflowStepIndex?)`

Advances the workflow to the next step or marks the agent run as completed. Updates the agent run status and workflow.

#### Parameters

| Name                     | Type     | Description                                 |
|--------------------------|----------|---------------------------------------------|
| agentRunId               | number   | ID of the agent run.                        |
| status                   | string   | Current status of the agent run.            |
| wsClientId               | string   | WebSocket client ID.                        |
| currentWorkflowStepIndex | number (optional) | Current workflow step index.        |

#### Returns

- `Promise<YpAgentRunWorkflowConfiguration | undefined>`

---

### `static getAgentRun(agentRunId)`

Fetches a detailed agent run record, including related subscription, plan, product, and bundle information.

#### Parameters

| Name        | Type   | Description                |
|-------------|--------|----------------------------|
| agentRunId  | number | ID of the agent run.       |

#### Returns

- `Promise<YpAgentProductRun | null>`

---

### `getQueue(queueName)`

Retrieves or creates a BullMQ queue for the given name, sets up event listeners for job lifecycle events.

#### Parameters

| Name      | Type   | Description                |
|-----------|--------|----------------------------|
| queueName | string | Name of the queue.         |

#### Returns

- `Queue` (BullMQ Queue instance)

---

### `controlAgent(agentId, action)`

Adds a control job (e.g., start/stop) for an agent to the appropriate queue.

#### Parameters

| Name    | Type   | Description                |
|---------|--------|----------------------------|
| agentId | number | ID of the agent.           |
| action  | string | Action to perform.         |

#### Returns

- `Promise<string>` (Confirmation message)

---

### `startAgentProcessingWithWsClient(agentId, agentRunId, wsClientId, structuredAnswersOverrides?)`

Starts agent processing by adding a job to the queue and updating the agent status.

#### Parameters

| Name                      | Type                 | Description                                 |
|---------------------------|----------------------|---------------------------------------------|
| agentId                   | number               | ID of the agent.                            |
| agentRunId                | number               | ID of the agent run.                        |
| wsClientId                | string               | WebSocket client ID.                        |
| structuredAnswersOverrides| YpStructuredAnswer[] (optional) | Structured answer overrides.      |

#### Returns

- `Promise<string | undefined>` (Job ID or undefined if failed)

---

### `stopAgentProcessing(agentId, wsClientId, agentRunId)`

Stops agent processing by adding a stop job to the queue and updating the agent status.

#### Parameters

| Name        | Type   | Description                |
|-------------|--------|----------------------------|
| agentId     | number | ID of the agent.           |
| wsClientId  | string | WebSocket client ID.       |
| agentRunId  | number | ID of the agent run.       |

#### Returns

- `Promise<boolean>` (True if successful, false otherwise)

---

### `getAgentStatus(agentId)`

Fetches the current status of an agent from Redis.

#### Parameters

| Name    | Type   | Description                |
|---------|--------|----------------------------|
| agentId | number | ID of the agent.           |

#### Returns

- `Promise<PsAgentStatus | null>`

---

### `updateAgentStatus(agentId, state, progress?, message?, details?)`

Updates the agent's status in Redis.

#### Parameters

| Name     | Type                        | Description                                 |
|----------|-----------------------------|---------------------------------------------|
| agentId  | number                      | ID of the agent.                            |
| state    | PsAgentStatus["state"]      | New state for the agent.                    |
| progress | number (optional)           | Progress value.                             |
| message  | string (optional)           | Status message to append.                   |
| details  | Record<string, any> (optional) | Additional details to merge.             |

#### Returns

- `Promise<boolean>` (True if successful, false otherwise)

---

## Properties

| Name       | Type                        | Description                                 |
|------------|-----------------------------|---------------------------------------------|
| redisClient| Redis                       | Redis client instance.                      |
| queues     | Map<string, Queue>          | Map of queue names to BullMQ Queue objects. |
| wsClients  | Map<string, WebSocket>      | Map of WebSocket client IDs to connections. |

---

## Dependencies

- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)
- [PsAgentClass](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agentClass.ts)
- [YpAgentProductRun](../models/agentProductRun.md)
- [YpSubscriptionPlan](../models/subscriptionPlan.md)
- [YpAgentProduct](../models/agentProduct.md)
- [YpSubscription](../models/subscription.md)
- [YpAgentProductBundle](../models/agentProductBundle.md)
- [EmailTemplateRenderer](./emailTemplateRenderer.md)
- BullMQ (`Queue`, `QueueEvents`)
- ioredis (`Redis`)
- WebSocket (`ws`)

---

## Example Usage

```typescript
import { NotificationAgentQueueManager } from './path/to/NotificationAgentQueueManager';
import WebSocket from 'ws';

const wsClients = new Map<string, WebSocket>();
const manager = new NotificationAgentQueueManager(wsClients);

// Start agent processing
await manager.startAgentProcessingWithWsClient(agentId, agentRunId, wsClientId);

// Stop agent processing
await manager.stopAgentProcessing(agentId, wsClientId, agentRunId);

// Get agent status
const status = await manager.getAgentStatus(agentId);
```

---

## See Also

- [AgentQueueManager](./agentQueueManager.md)
- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)
- [EmailTemplateRenderer](./emailTemplateRenderer.md)
- [YpAgentProductRun](../models/agentProductRun.md)
- [BullMQ Documentation](https://docs.bullmq.io/)

---

## Notes

- This class is designed for use in a Policy Synth backend environment.
- It assumes the presence of a Redis instance and BullMQ-compatible worker setup.
- Email notifications are sent using a queue-based approach for scalability.
- WebSocket notifications require clients to be registered in the `wsClients` map.