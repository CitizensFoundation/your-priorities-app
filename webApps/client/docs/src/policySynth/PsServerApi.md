# PsServerApi

The `PsServerApi` class extends the `YpServerApiBase` and provides methods to interact with server-side APIs related to agents, models, connectors, and workflows. It facilitates operations such as fetching, updating, and managing agents and their configurations.

## Properties

| Name            | Type   | Description                           |
|-----------------|--------|---------------------------------------|
| baseAgentsPath  | string | The base path for agent-related APIs. |
| baseUrlPath     | string | The base URL path for the API.        |

## Methods

| Name                          | Parameters                                                                 | Return Type                              | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------------|------------------------------------------|-----------------------------------------------------------------------------|
| constructor                   | urlPath: string = "/api"                                                   |                                          | Initializes a new instance of the `PsServerApi` class with a base URL path. |
| getAgent                      | groupId: number                                                            | Promise<PsAgentAttributes>               | Fetches the attributes of a specific agent.                                 |
| getAgentMemory                | groupId: number, agentId: number                                           | Promise<object>                          | Retrieves the memory of a specific agent.                                   |
| replaceAgentMemory            | groupId: number, agentId: number, memory: object                           | Promise<void>                            | Replaces the memory of a specific agent.                                    |
| removeAgentAiModel            | groupId: number, agentId: number, modelId: number                          | Promise<void>                            | Removes an AI model from a specific agent.                                  |
| getDetailedAgentCosts         | groupId: number, agentId: number                                           | Promise<PsDetailedAgentCostResults[]>    | Retrieves detailed cost information for a specific agent.                   |
| addAgentAiModel               | groupId: number, agentId: number, modelId: number, size: PsAiModelSize     | Promise<void>                            | Adds an AI model to a specific agent.                                       |
| updateAgentConfiguration      | groupId: number, agentId: number, updatedConfig: Partial<PsAgentAttributes["configuration"]> | Promise<void>                            | Updates the configuration of a specific agent.                              |
| addExistingConnector          | groupId: number, agentId: number, connectorId: number, type: "input" \| "output" | Promise<void>                            | Adds an existing connector to a specific agent.                             |
| createAgent                   | name: string, agentClassId: number, aiModels: { [key: string]: number }, parentAgentId: number, groupId?: number | Promise<PsAgentAttributes>               | Creates a new agent with specified attributes.                              |
| getAgentAiModels              | groupId: number, agentId: number                                           | Promise<PsAiModelAttributes[]>           | Retrieves AI models associated with a specific agent.                       |
| getActiveAiModels             | groupId: number                                                            | Promise<PsAiModelAttributes[]>           | Retrieves active AI models for a specific group.                            |
| getActiveAgentClasses         | groupId: number                                                            | Promise<PsAgentClassAttributes[]>        | Retrieves active agent classes for a specific group.                        |
| getActiveConnectorClasses     | groupId: number                                                            | Promise<PsAgentConnectorClassAttributes[]>| Retrieves active connector classes for a specific group.                    |
| getAgentCosts                 | groupId: number, agentId: number                                           | Promise<number>                          | Retrieves the total cost for a specific agent.                              |
| createConnector               | groupId: number, agentId: number, connectorClassId: number, name: string, type: "input" \| "output" | Promise<PsAgentConnectorAttributes>      | Creates a new connector for a specific agent.                               |
| updateNode                    | groupId: number, agentId: number, updatedNode: PsAgentAttributes           | Promise<void>                            | Updates a node with new attributes.                                         |
| updateNodeConfiguration       | groupId: number, nodeType: "agent" \| "connector", nodeId: number, updatedConfig: Partial<PsAgentAttributes["configuration"] \| PsAgentConnectorAttributes["configuration"]> | Promise<void> | Updates the configuration of a node.                                       |
| getAgentStatus                | groupId: number, agentId: number                                           | Promise<PsAgentStatus>                   | Retrieves the status of a specific agent.                                   |
| advanceOrStopCurrentAgentRun  | groupId: number, agentId: number, runId: number, status: string, wsClientId: string |                                          | Advances or stops the current run of an agent.                              |
| getUpdatedWorkflow            | groupId: number, runId: number                                             | Promise<{ workflow: YpWorkflowConfiguration; status: YpAgentProductRunStatus; } \| null> | Retrieves the updated workflow for a specific run.                          |
| startWorkflowAgent            | groupId: number, agentId: number, wsClientId: string                       |                                          | Starts the workflow agent for a specific agent.                             |
| controlAgent                  | groupId: number, agentId: number, action: "start" \| "pause" \| "stop"     |                                          | Controls the state of a specific agent.                                     |
| startAgent                    | groupId: number, agentId: number                                           |                                          | Starts a specific agent.                                                    |
| pauseAgent                    | groupId: number, agentId: number                                           |                                          | Pauses a specific agent.                                                    |
| stopAgent                     | groupId: number, agentId: number                                           |                                          | Stops a specific agent.                                                     |

## Examples

```typescript
const api = new PsServerApi("/customApiPath");

// Fetch an agent's attributes
api.getAgent(1).then(agent => console.log(agent));

// Add a new AI model to an agent
api.addAgentAiModel(1, 2, 3, PsAiModelSize.Large).then(() => console.log("Model added"));

// Start an agent
api.startAgent(1, 2).then(() => console.log("Agent started"));
```