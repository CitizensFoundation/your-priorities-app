# Service Module: AgentModels

The `AgentModels` class provides high-level business logic for managing agent workflows, including starting, stopping, and querying the status of agent workflow steps. It acts as a service layer, orchestrating interactions between the agent assistant, workflow runs, notification queue manager, and subscription models.

## Constructor

```typescript
constructor(assistant: YpAgentAssistant)
```
- **assistant**: `YpAgentAssistant`  
  The agent assistant instance used for agent and workflow context.

---

## Properties

| Name               | Type                        | Description                                               |
|--------------------|-----------------------------|-----------------------------------------------------------|
| subscriptionModels | [SubscriptionModels](./subscriptions.md) | Handles subscription-related logic for agents.             |
| assistant          | [YpAgentAssistant](../../../agentAssistant.md) | The agent assistant instance.                              |
| queueManager       | [NotificationAgentQueueManager](../../../../managers/notificationAgentQueueManager.md) | Manages agent processing jobs and WebSocket notifications. |

---

## Methods

### getCurrentAgentAndWorkflow

```typescript
public async getCurrentAgentAndWorkflow(): Promise<{
  agent: YpAgentProductAttributes;
  run: YpAgentProductRunAttributes | undefined;
}>
```

Retrieves the current agent product and its associated workflow run from the assistant's context.

#### Returns

- **agent**: `YpAgentProductAttributes`  
  The current agent product attributes.
- **run**: `YpAgentProductRunAttributes | undefined`  
  The current agent product run attributes, or `undefined` if not found.

#### Throws

- `Error` if neither agent nor run is found.

---

### convertToUnderscoresWithMaxLength

```typescript
public convertToUnderscoresWithMaxLength(str: string): string
```

Converts a string to a lowercase, underscore-separated format, replacing spaces, hyphens, and camel case, and truncates to a maximum length of 34 characters.

#### Parameters

| Name | Type   | Description                |
|------|--------|----------------------------|
| str  | string | The input string to format |

#### Returns

- `string`: The formatted string.

---

### startCurrentWorkflowStep

```typescript
public async startCurrentWorkflowStep(
  agentRunId: number,
  structuredAnswersOverrides?: YpStructuredAnswer[]
): Promise<{
  agentRun: YpAgentProductRunAttributes;
  previousStep: YpAgentRunWorkflowStep;
  currentStep: YpAgentRunWorkflowStep;
  message: string;
}>
```

Starts the next step in the current agent workflow, updating the workflow state and queueing the agent for processing.

#### Parameters

| Name                     | Type                    | Description                                      |
|--------------------------|-------------------------|--------------------------------------------------|
| agentRunId               | number                  | The ID of the agent run to update.               |
| structuredAnswersOverrides| YpStructuredAnswer[] (optional) | Optional overrides for structured answers.        |

#### Returns

- **agentRun**: `YpAgentProductRunAttributes`  
  The updated agent run.
- **previousStep**: `YpAgentRunWorkflowStep`  
  The workflow step before the update.
- **currentStep**: `YpAgentRunWorkflowStep`  
  The current workflow step after the update.
- **message**: `string`  
  Status message.

#### Throws

- `Error` if the agent run or agent ID is not found, or if processing fails.

---

### getCurrentWorkflowStep

```typescript
public async getCurrentWorkflowStep(): Promise<YpAgentRunWorkflowStep>
```

Retrieves the current workflow step for the active agent run.

#### Returns

- `YpAgentRunWorkflowStep`: The current workflow step.

#### Throws

- `Error` if no current run is found.

---

### getNextWorkflowStep

```typescript
public async getNextWorkflowStep(): Promise<YpAgentRunWorkflowStep | undefined>
```

Retrieves the next workflow step for the active agent run, if available.

#### Returns

- `YpAgentRunWorkflowStep | undefined`: The next workflow step, or `undefined` if at the end.

---

### stopCurrentWorkflowStep

```typescript
public async stopCurrentWorkflowStep(): Promise<{
  agent: YpAgentProductAttributes;
  run: YpAgentProductRunAttributes;
  message: string;
}>
```

Stops the current workflow step, updates the run status, and notifies the queue manager.

#### Returns

- **agent**: `YpAgentProductAttributes`  
  The agent product attributes.
- **run**: `YpAgentProductRunAttributes`  
  The updated agent run.
- **message**: `string`  
  Status message.

#### Throws

- `Error` if no active workflow or agent is found, or if the current step is invalid.

---

### checkAgentStatus

```typescript
public async checkAgentStatus(): Promise<PsAgentStatus | null>
```

Checks the current status of the agent in the queue manager.

#### Returns

- `PsAgentStatus | null`: The agent's status, or `null` if not found.

#### Throws

- `Error` if no agent is found.

---

## Dependencies

- [NotificationAgentQueueManager](../../../../managers/notificationAgentQueueManager.md): Manages agent processing jobs and notifications.
- [YpAgentProductRun](../../../../models/agentProductRun.md): Sequelize model for agent workflow runs.
- [SubscriptionModels](./subscriptions.md): Handles subscription logic.
- [YpAgentAssistant](../../../agentAssistant.md): Provides agent context and memory.
- [YpAgentProduct](../../../../models/agentProduct.md): Sequelize model for agent products.
- [YpSubscription](../../../../models/subscription.md): Sequelize model for subscriptions.
- [WebSocket](https://github.com/websockets/ws): Used for real-time communication.

## Related Models and Types

- `YpAgentProductAttributes`: Attributes of an agent product ([YpAgentProduct](../../../../models/agentProduct.md)).
- `YpAgentProductRunAttributes`: Attributes of an agent product run ([YpAgentProductRun](../../../../models/agentProductRun.md)).
- `YpAgentRunWorkflowStep`: Workflow step object for an agent run.
- `YpStructuredAnswer`: Structured answer type for workflow overrides.
- `PsAgentStatus`: Status object for an agent in the queue ([PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)).

---

## Example Usage

```typescript
const agentModels = new AgentModels(assistant);

// Start a workflow step
await agentModels.startCurrentWorkflowStep(agentRunId);

// Get current workflow step
const step = await agentModels.getCurrentWorkflowStep();

// Stop the current workflow step
await agentModels.stopCurrentWorkflowStep();

// Check agent status
const status = await agentModels.checkAgentStatus();
```

---

## See Also

- [NotificationAgentQueueManager](../../../../managers/notificationAgentQueueManager.md)
- [YpAgentProductRun](../../../../models/agentProductRun.md)
- [YpAgentProduct](../../../../models/agentProduct.md)
- [SubscriptionModels](./subscriptions.md)
- [YpAgentAssistant](../../../agentAssistant.md)
- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)
