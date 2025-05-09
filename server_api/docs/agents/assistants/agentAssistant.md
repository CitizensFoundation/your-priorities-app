# Class: YpAgentAssistant

The `YpAgentAssistant` class extends [`YpBaseAssistantWithVoice`](./baseAssistantWithVoice.md) and provides advanced assistant functionality for managing and interacting with Policy Synth agents, including agent selection, direct conversation, subscription management, and workflow handling. It integrates with WebSocket clients, Redis, and various domain models related to agents and subscriptions.

## Inheritance

- **Extends:** [`YpBaseAssistantWithVoice`](./baseAssistantWithVoice.md)

## Constructor

```typescript
constructor(
  wsClientId: string,
  wsClients: Map<string, WebSocket>,
  redis: ioredis.Redis,
  voiceEnabled: boolean,
  redisKey: string,
  domainId: number
)
```

### Parameters

| Name         | Type                        | Description                                               |
|--------------|-----------------------------|-----------------------------------------------------------|
| wsClientId   | `string`                    | The WebSocket client ID.                                  |
| wsClients    | `Map<string, WebSocket>`    | Map of all WebSocket clients.                             |
| redis        | `ioredis.Redis`             | Redis client instance.                                    |
| voiceEnabled | `boolean`                   | Whether voice features are enabled.                       |
| redisKey     | `string`                    | Redis key for assistant state.                            |
| domainId     | `number`                    | Domain identifier for multi-domain support.               |

## Properties

| Name                        | Type                                                                 | Description                                                                                 |
|-----------------------------|----------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| availableAgents             | [`PsAgent[]`](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts) | List of available agents for the assistant.                                                 |
| runningAgents               | [`PsAgent[]`](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts) | List of currently running agents.                                                           |
| agentSelectionMode (private)| [`AgentSelectionMode`](./modes/agentSelectionMode.md)                | Mode handler for agent selection.                                                           |
| directConversationMode (private)| [`DirectConversationMode`](./modes/agentDirectConnection.md)      | Mode handler for direct agent conversation.                                                 |
| subscriptionManager         | [`SubscriptionManager`](../managers/subscriptionManager.md)          | Manages user subscriptions to agent products.                                               |

## Methods

### defineAvailableModes

```typescript
async defineAvailableModes(): Promise<AssistantChatbotMode[]>
```
Defines and returns the available assistant modes (agent selection and direct conversation).

**Returns:**  
`Promise<AssistantChatbotMode[]>` — Array of available assistant modes.

---

### simplifiedMemory

```typescript
get simplifiedMemory(): Partial<YpBaseAssistantMemoryData>
```
Returns a simplified snapshot of the assistant's memory, including only key properties.

**Returns:**  
`Partial<YpBaseAssistantMemoryData>`

---

### handleMemoryChanged

```typescript
handleMemoryChanged(memory: YpBaseAssistantMemoryData): void
```
Handles the "memory-changed" event, sending the simplified memory state to the client.

**Parameters:**

| Name   | Type                           | Description                        |
|--------|--------------------------------|------------------------------------|
| memory | `YpBaseAssistantMemoryData`    | The updated assistant memory state.|

---

### isLoggedIn

```typescript
get isLoggedIn(): boolean
```
Indicates whether a user is currently logged in.

**Returns:**  
`boolean`

---

### isSubscribedToCurrentAgentProduct

```typescript
get isSubscribedToCurrentAgentProduct(): boolean
```
Checks if the user is subscribed to the current agent product.

**Returns:**  
`boolean`

---

### hasConfiguredcurrentAgentProduct

```typescript
get hasConfiguredcurrentAgentProduct(): boolean
```
Checks if the current agent product has been configured.

**Returns:**  
`boolean`

---

### isCurrentAgentRunning

```typescript
async isCurrentAgentRunning(): Promise<boolean>
```
Checks if the current agent is running.

**Returns:**  
`Promise<boolean>`

---

### isCurrentAgentActive

```typescript
async isCurrentAgentActive(): Promise<boolean>
```
Checks if the current agent is in an active state (`running`, `ready`, `stopped`, or `waiting_on_user`).

**Returns:**  
`Promise<boolean>`

---

### haveShownConfigurationWidget

```typescript
get haveShownConfigurationWidget(): boolean
```
Indicates whether the configuration widget has been shown to the user.

**Returns:**  
`boolean`

---

### haveShownLoginWidget

```typescript
get haveShownLoginWidget(): boolean
```
Indicates whether the login widget has been shown to the user.

**Returns:**  
`boolean`

---

### getCurrentAgentWorkflow

```typescript
async getCurrentAgentWorkflow(): Promise<YpAgentRunWorkflowConfiguration | undefined>
```
Retrieves the workflow configuration for the current agent run.

**Returns:**  
`Promise<YpAgentRunWorkflowConfiguration | undefined>`

---

### getCurrentAgentWorkflowCurrentStep

```typescript
async getCurrentAgentWorkflowCurrentStep(): Promise<YpAgentRunWorkflowStep | undefined>
```
Retrieves the current step in the agent's workflow.

**Returns:**  
`Promise<YpAgentRunWorkflowStep | undefined>`

---

### isCurrentAgentWaitingOnUserInput

```typescript
async isCurrentAgentWaitingOnUserInput(): Promise<boolean>
```
Checks if the current agent workflow step is waiting for user input.

**Returns:**  
`Promise<boolean>`

---

### triggerResponseIfNeeded

```typescript
triggerResponseIfNeeded(message: string): void
```
Triggers a voice response if the voice bot is enabled.

**Parameters:**

| Name    | Type     | Description                |
|---------|----------|----------------------------|
| message | `string` | The message to respond with.|

---

## Dependencies

- [`YpBaseAssistantWithVoice`](./baseAssistantWithVoice.md)
- [`AgentSelectionMode`](./modes/agentSelectionMode.md)
- [`DirectConversationMode`](./modes/agentDirectConnection.md)
- [`SubscriptionManager`](../managers/subscriptionManager.md)
- [`PsAgent`](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)
- [`YpSubscriptionPlan`](../models/subscriptionPlan.md)
- [`YpAgentProductRun`](../models/agentProductRun.md)
- [`YpSubscription`](../models/subscription.md)
- [`YpAgentProduct`](../models/agentProduct.md)
- `WebSocket` (from `ws`)
- `ioredis.Redis`

## Example Usage

```typescript
import { YpAgentAssistant } from './YpAgentAssistant.js';
import WebSocket from 'ws';
import ioredis from 'ioredis';

const wsClients = new Map<string, WebSocket>();
const redis = new ioredis();
const assistant = new YpAgentAssistant(
  'client-id',
  wsClients,
  redis,
  true,
  'redis-key',
  1
);

// Use assistant methods as needed
await assistant.defineAvailableModes();
```

---

## See Also

- [`PsAgent`](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)
- [`YpBaseAssistantWithVoice`](./baseAssistantWithVoice.md)
- [`AgentSelectionMode`](./modes/agentSelectionMode.md)
- [`DirectConversationMode`](./modes/agentDirectConnection.md)
- [`SubscriptionManager`](../managers/subscriptionManager.md)
- [`YpAgentProductRun`](../models/agentProductRun.md)
- [`YpAgentProduct`](../models/agentProduct.md)
- [`YpSubscription`](../models/subscription.md)
- [`YpSubscriptionPlan`](../models/subscriptionPlan.md)