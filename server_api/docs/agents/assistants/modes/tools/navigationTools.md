# Service: NavigationTools

The `NavigationTools` class provides a set of assistant tools for navigating between agent workflows, connecting directly to agents, and listing available agents for connection. It extends `BaseAssistantTools` and interacts with agent and subscription models to manage agent selection and subscription logic. This class is designed to be used within the context of a [YpAgentAssistant](../../agentAssistant.js) instance.

---

## Class: NavigationTools

### Extends
- [BaseAssistantTools](./baseTools.md)

### Constructor

#### `new NavigationTools(assistant: YpAgentAssistant)`

| Name      | Type              | Description                                 |
|-----------|-------------------|---------------------------------------------|
| assistant | YpAgentAssistant  | The assistant instance to bind the tools to |

---

## Properties

| Name                         | Type                | Description                                                                                 |
|------------------------------|---------------------|---------------------------------------------------------------------------------------------|
| agentModels                  | AgentModels         | Instance for agent-related data/model operations                                            |
| subscriptionModels           | SubscriptionModels  | Instance for subscription-related data/model operations                                     |
| connectDirectlyToAgent       | object              | Tool definition for connecting directly to an agent (see below for schema)                  |
| listAllAgentsAvailableForConnection | object        | Tool definition for listing all available agents for connection (see below for schema)       |

---

## Methods

### goBackToMainAssistant

#### `goBackToMainAssistant(): Promise<ToolExecutionResult>`

Switches the assistant back to the main agent selection mode.

**Returns:**  
- `Promise<ToolExecutionResult>`: Result object indicating success and a message.

---

### connectToOneOfTheAgentsHandler

#### `connectToOneOfTheAgentsHandler(params: YpAgentSelectParams): Promise<ToolExecutionResult>`

Handles the logic for connecting directly to a selected agent by subscribing to the agent's plan and updating the assistant's state.

**Parameters:**

| Name   | Type                | Description                                 |
|--------|---------------------|---------------------------------------------|
| params | YpAgentSelectParams | Parameters for selecting the agent (see below)|

**Returns:**  
- `Promise<ToolExecutionResult>`: Result object with HTML UI, selected agent info, or error.

---

### listAllAgentsAvailableForConnectionsHandler

#### `listAllAgentsAvailableForConnectionsHandler(params: YpAgentEmptyProperties): Promise<ToolExecutionResult>`

Lists all agent workflows available for connection, sorted by type and price, and returns a UI widget for selection.

**Parameters:**

| Name   | Type                   | Description                                 |
|--------|------------------------|---------------------------------------------|
| params | YpAgentEmptyProperties | Empty object for compatibility              |

**Returns:**  
- `Promise<ToolExecutionResult>`: Result object with HTML UI, agent status, or error.

---

## Tool Definitions

### connectDirectlyToAgent

A tool definition object for connecting directly to an agent.

| Property     | Type                        | Description                                                                 |
|--------------|-----------------------------|-----------------------------------------------------------------------------|
| name         | string                      | Tool name: `"connect_directly_to_one_of_the_agents"`                        |
| description  | string                      | Description of the tool                                                     |
| type         | string                      | `"function"`                                                                |
| parameters   | object                      | Parameter schema (see below)                                                |
| handler      | function                    | Bound handler: `connectToOneOfTheAgentsHandler`                             |

#### Parameters Schema

| Name               | Type   | Description                        | Required |
|--------------------|--------|------------------------------------|----------|
| subscriptionPlanId | number | The ID of the agent subscription plan to connect to | Yes      |

---

### listAllAgentsAvailableForConnection

A tool definition object for listing all available agents for connection.

| Property     | Type                        | Description                                                                 |
|--------------|-----------------------------|-----------------------------------------------------------------------------|
| name         | string                      | Tool name: `"list_all_agents_available_for_connection"`                      |
| description  | string                      | Description of the tool                                                     |
| type         | string                      | `"function"`                                                                |
| parameters   | object                      | Parameter schema (empty object)                                             |
| handler      | function                    | Bound handler: `listAllAgentsAvailableForConnectionsHandler`                |

---

## Types Used

- **YpAgentAssistant**: The main assistant class ([source](../../agentAssistant.js))
- **AgentModels**: Agent data/model operations ([source](./models/agents.js))
- **SubscriptionModels**: Subscription data/model operations ([source](./models/subscriptions.js))
- **BaseAssistantTools**: Base class for assistant tools ([source](./baseTools.js))
- **ToolExecutionResult**: Result object for tool execution (should be defined elsewhere in the codebase)
- **YpAgentSelectParams**: Parameters for agent selection (should be defined elsewhere)
- **YpAgentSelectProperties**: Properties for agent selection (should be defined elsewhere)
- **YpAgentEmptyProperties**: Empty properties object (should be defined elsewhere)

---

## Example Usage

```typescript
import { NavigationTools } from './commonTools';
import { YpAgentAssistant } from '../../agentAssistant';

const assistant = new YpAgentAssistant(/* ... */);
const navTools = new NavigationTools(assistant);

// Go back to main assistant
await navTools.goBackToMainAssistant();

// Connect directly to an agent
await navTools.connectToOneOfTheAgentsHandler({ subscriptionPlanId: 123 });

// List all available agents
await navTools.listAllAgentsAvailableForConnectionsHandler({});
```

---

## See Also

- [YpAgentAssistant](../../agentAssistant.js)
- [AgentModels](./models/agents.md)
- [SubscriptionModels](./models/subscriptions.md)
- [BaseAssistantTools](./baseTools.md)

---

## Exported Class

- `NavigationTools`