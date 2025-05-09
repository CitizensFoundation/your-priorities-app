# Service: SubscriptionTools

The `SubscriptionTools` class provides a set of assistant tools for managing agent subscriptions, including listing, subscribing, and unsubscribing to agent plans. It is designed to be used within an assistant context (such as [YpAgentAssistant](../../agentAssistant.js)), and interacts with the [SubscriptionModels](./models/subscriptions.md) service for data operations. Each tool is exposed as a function with a handler suitable for integration with an AI assistant or API.

---

## Class: SubscriptionTools

Extends: `BaseAssistantTools`

### Constructor

```typescript
constructor(assistant: YpAgentAssistant)
```
- **assistant**: [`YpAgentAssistant`](../../agentAssistant.js)  
  The assistant instance to bind the tools to.

---

## Properties

| Name                         | Type                    | Description                                      |
|------------------------------|-------------------------|--------------------------------------------------|
| subscriptionModels           | SubscriptionModels      | Instance for subscription-related data operations |

---

## Methods / Tools

### listMyAgentSubscriptions

Lists all agent subscriptions for the current user.

#### Tool Definition

| Name        | Type     | Description                                         |
|-------------|----------|-----------------------------------------------------|
| name        | string   | "list_my_agent_subscriptions"                       |
| description | string   | List all agent subscriptions for the current user.  |
| type        | string   | "function"                                          |
| parameters  | object   | `{}` (no parameters)                                |
| handler     | function | `listMyAgentSubscriptionsHandler`                   |

#### Handler

```typescript
async listMyAgentSubscriptionsHandler(params: YpAgentEmptyProperties): Promise<ToolExecutionResult>
```

##### Parameters

| Name   | Type                   | Description                |
|--------|------------------------|----------------------------|
| params | YpAgentEmptyProperties | No parameters (empty obj)  |

##### Returns

- `Promise<ToolExecutionResult>`

##### Success Response

```json
{
  "success": true,
  "data": { /* subscription status object */ },
  "html": "<div class=\"agent-chips\">...</div>",
  "metadata": {
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```
- `data`: The user's current agent subscriptions.
- `html`: Rendered HTML for UI display.
- `metadata`: Contains a timestamp.

##### Error Response

```json
{
  "success": false,
  "data": "Failed to load agent status",
  "error": "Failed to load agent status"
}
```
- `error`: Error message.

---

### listAllAgentsAvailableForSubscription

Lists all agent subscriptions available for purchase.

#### Tool Definition

| Name        | Type     | Description                                         |
|-------------|----------|-----------------------------------------------------|
| name        | string   | "list_all_agents_available_for_subscription"        |
| description | string   | List all agent subscriptions available for purchase |
| type        | string   | "function"                                          |
| parameters  | object   | `{}` (no parameters)                                |
| handler     | function | `listAllAgentsAvailableForSubscriptionHandler`      |

#### Handler

```typescript
async listAllAgentsAvailableForSubscriptionHandler(params: YpAgentEmptyProperties): Promise<ToolExecutionResult>
```

##### Parameters

| Name   | Type                   | Description                |
|--------|------------------------|----------------------------|
| params | YpAgentEmptyProperties | No parameters (empty obj)  |

##### Returns

- `Promise<ToolExecutionResult>`

##### Success Response

```json
{
  "success": true,
  "data": {
    "messageToAssistant": "You have shown the user the available agents for purchase with a UI widget, now the user needs to choose which one to connect to then subscribe to",
    "status": { /* available plans object */ }
  },
  "html": "<div class=\"agent-chips\">...</div>",
  "metadata": {
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```
- `data.status`: List of available agent plans.
- `html`: Rendered HTML for UI display.
- `metadata`: Contains a timestamp.

##### Error Response

```json
{
  "success": false,
  "data": "Failed to load agent status",
  "error": "Failed to load agent status"
}
```
- `error`: Error message.

---

### subscribeToCurrentAgentPlan

Subscribes the user to the current agent plan. The user must confirm the subscription with the agent name before proceeding.

#### Tool Definition

| Name        | Type     | Description                                                                                                    |
|-------------|----------|----------------------------------------------------------------------------------------------------------------|
| name        | string   | "subscribe_to_current_agent_plan"                                                                              |
| description | string   | Subscribe to the current agent plan. User must confirm subscription with the agent name before proceeding.      |
| type        | string   | "function"                                                                                                     |
| parameters  | object   | `{ useHasVerballyConfirmedSubscribeWithTheAgentName: boolean }`                                                |
| handler     | function | `subscribeToCurrentAgentPlanHandler`                                                                           |

#### Handler

```typescript
async subscribeToCurrentAgentPlanHandler(params: YpAgentSubscribeParams): Promise<ToolExecutionResult>
```

##### Parameters

| Name                                         | Type    | Description                                               | Required |
|----------------------------------------------|---------|-----------------------------------------------------------|----------|
| useHasVerballyConfirmedSubscribeWithTheAgentName | boolean | User has verbally confirmed subscription with agent name. | Yes      |

##### Returns

- `Promise<ToolExecutionResult>`

##### Success Response

```json
{
  "success": true,
  "html": "<div class=\"agent-chips\">...</div>",
  "data": {
    "message": "Successfully subscribed to agent plan, now offer to show the configuration input tool/widget to configure the agent",
    "subscription": { /* subscription object */ },
    "subscriptionPlan": { /* plan object */ }
  }
}
```
- `html`: Rendered HTML for UI display.
- `data.subscription`: The new subscription object.
- `data.subscriptionPlan`: The plan details.

##### Error Response

```json
{
  "success": false,
  "error": "User must confirm subscription with the agent name before proceeding"
}
```
or
```json
{
  "success": false,
  "error": "Failed to subscribe to agent"
}
```
- `error`: Error message.

---

### unsubscribeFromCurrentAgentSubscription

Unsubscribes the user from an existing agent subscription. The user must verbally confirm unsubscription with the agent name before proceeding.

#### Tool Definition

| Name        | Type     | Description                                                                                                    |
|-------------|----------|----------------------------------------------------------------------------------------------------------------|
| name        | string   | "unsubscribe_from_current_agent_subscription"                                                                  |
| description | string   | Unsubscribe from an existing agent subscription. User must verbally confirm unsubscription with agent name.     |
| type        | string   | "function"                                                                                                     |
| parameters  | object   | `{ useHasVerballyConfirmedUnsubscribeWithTheAgentName: boolean }`                                              |
| handler     | function | `unsubscribeFromCurrentAgentSubscriptionHandler`                                                               |

#### Handler

```typescript
async unsubscribeFromCurrentAgentSubscriptionHandler(params: YpAgentUnsubscribeParams): Promise<ToolExecutionResult>
```

##### Parameters

| Name                                            | Type    | Description                                                  | Required |
|-------------------------------------------------|---------|--------------------------------------------------------------|----------|
| useHasVerballyConfirmedUnsubscribeWithTheAgentName | boolean | User has verbally confirmed unsubscription with agent name.  | Yes      |

##### Returns

- `Promise<ToolExecutionResult>`

##### Success Response

```json
{
  "success": true,
  "html": "<div class=\"agent-chips\">...</div>",
  "data": {
    "message": "Successfully unsubscribed from agent subscription",
    "subscriptionId": "string",
    "subscriptionPlan": { /* plan object */ }
  }
}
```
- `html`: Rendered HTML for UI display.
- `data.subscriptionId`: The unsubscribed subscription ID.
- `data.subscriptionPlan`: The plan details.

##### Error Response

```json
{
  "success": false,
  "error": "User must verbally confirm unsubscription with the agent name before proceeding"
}
```
or
```json
{
  "success": false,
  "error": "Failed to unsubscribe from agent"
}
```
- `error`: Error message.

---

## Dependencies

- [`YpAgentAssistant`](../../agentAssistant.js): The assistant context.
- [`SubscriptionModels`](./models/subscriptions.md): Handles subscription data operations.
- [`BaseAssistantTools`](./baseTools.md): Base class for assistant tools.

---

## Types Used

- `YpAgentEmptyProperties`: An empty object type for parameterless tools.
- `YpAgentSubscribeProperties`, `YpAgentSubscribeParams`: Types for subscribe tool parameters.
- `YpAgentUnsubscribeProperties`, `YpAgentUnsubscribeParams`: Types for unsubscribe tool parameters.
- `ToolExecutionResult`: Standard result object for tool handlers.

---

## Example Usage

```typescript
const tools = new SubscriptionTools(assistant);

// List current user's agent subscriptions
const result = await tools.listMyAgentSubscriptions.handler({});

// List all available agent plans
const result2 = await tools.listAllAgentsAvailableForSubscription.handler({});

// Subscribe to current agent plan (after user confirmation)
const result3 = await tools.subscribeToCurrentAgentPlan.handler({
  useHasVerballyConfirmedSubscribeWithTheAgentName: true
});

// Unsubscribe from current agent subscription (after user confirmation)
const result4 = await tools.unsubscribeFromCurrentAgentSubscription.handler({
  useHasVerballyConfirmedUnsubscribeWithTheAgentName: true
});
```

---

## See Also

- [SubscriptionModels](./models/subscriptions.md)
- [BaseAssistantTools](./baseTools.md)
- [YpAgentAssistant](../../agentAssistant.js)
- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts) (for agent product details)
