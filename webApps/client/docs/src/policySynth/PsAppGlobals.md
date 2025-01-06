# PsAppGlobals

The `PsAppGlobals` class extends `YpAppGlobals` and manages global application state, including agent and connector registries, and current running agent information.

## Properties

| Name                             | Type                                      | Description                                                                 |
|----------------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| originalReferrer                 | string                                    | Stores the original referrer URL of the document.                           |
| disableParentConstruction        | boolean                                   | Indicates whether parent construction is disabled. Defaults to `true`.      |
| exernalGoalParamsWhiteList       | string \| undefined                       | A whitelist of external goal parameters.                                    |
| agentsInstanceRegistry           | Map<number, PsAgentAttributes>            | Registry of agent instances keyed by their ID.                              |
| connectorsInstanceRegistry       | Map<number, PsAgentConnectorAttributes>   | Registry of connector instances keyed by their ID.                          |
| activeConnectorsInstanceRegistry | Map<number, PsAgentConnectorAttributes>   | Registry of active connector instances keyed by their ID.                   |
| currentRunningAgentId            | number \| undefined                       | ID of the currently running agent.                                          |
| currentAgentListeners            | any[]                                     | Listeners for changes to the current running agent.                         |

## Methods

| Name                        | Parameters                          | Return Type | Description                                                                 |
|-----------------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| constructor                 | serverApi: PsServerApi              | void        | Initializes a new instance of `PsAppGlobals` with the given server API.     |
| setCurrentRunningAgentId    | id: number \| undefined             | void        | Sets the current running agent ID and notifies listeners.                   |
| addCurrentAgentListener     | callback: Function                  | void        | Adds a listener for changes to the current running agent.                   |
| removeCurrentAgentListener  | callback: Function                  | void        | Removes a listener for changes to the current running agent.                |
| notifyCurrentAgentListeners |                                     | void        | Notifies all listeners of the current running agent ID change.              |
| addToAgentsRegistry         | agent: PsAgentAttributes            | void        | Adds an agent to the agents registry.                                       |
| addToConnectorsRegistry     | connector: PsAgentConnectorAttributes | void      | Adds a connector to the connectors registry.                                |
| getAgentInstance            | agentId: number                     | PsAgentAttributes \| undefined | Retrieves an agent instance by its ID.                                      |
| getConnectorInstance        | connectorId: number                 | PsAgentConnectorAttributes \| undefined | Retrieves a connector instance by its ID.                                   |

## Examples

```typescript
// Example usage of the PsAppGlobals class
const serverApi = new PsServerApi();
const appGlobals = new PsAppGlobals(serverApi);

appGlobals.setCurrentRunningAgentId(1);
appGlobals.addCurrentAgentListener((agentId) => {
  console.log(`Current running agent ID: ${agentId}`);
});

const agent = appGlobals.getAgentInstance(1);
if (agent) {
  console.log(`Agent found: ${agent.name}`);
}
```