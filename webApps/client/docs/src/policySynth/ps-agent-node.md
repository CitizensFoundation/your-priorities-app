# PsAgentNode

The `PsAgentNode` class is a custom web component that extends `PsOperationsBaseNode`. It represents an agent node with various functionalities such as managing agent status, memory, and connectors.

## Properties

| Name            | Type      | Description                                                                 |
|-----------------|-----------|-----------------------------------------------------------------------------|
| agent           | PsAgentAttributes | The attributes of the agent.                                          |
| agentId         | number    | The unique identifier for the agent.                                        |
| hasStaticTheme  | boolean   | Reflects whether the component has a static theme.                          |
| groupId         | number    | The group identifier to which the agent belongs.                            |
| running         | boolean   | Indicates if the agent is currently running.                                |

## Methods

| Name                    | Parameters                          | Return Type | Description                                                                 |
|-------------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| constructor             |                                     |             | Initializes a new instance of the `PsAgentNode` class.                      |
| firstUpdated            |                                     | void        | Called after the element’s DOM has been updated the first time.             |
| connectedCallback       |                                     | void        | Invoked each time the custom element is appended into a document-connected element. |
| disconnectedCallback    |                                     | void        | Invoked each time the custom element is disconnected from the document’s DOM. |
| getSafeFileName         | name: string                        | string      | Returns a safe file name based on the provided name and current date/time.  |
| saveMemoryToFile        |                                     | Promise<void> | Saves the agent's memory to a file.                                         |
| triggerFileInput        |                                     | void        | Triggers the file input for loading memory from a file.                     |
| handleFileSelect        | event: Event                        | void        | Handles the file selection event for loading memory.                        |
| confirmLoadMemory       | content: any                        | void        | Confirms loading and overriding memory with the provided content.           |
| loadMemoryFromContent   | content: any                        | Promise<void> | Loads memory from the provided content.                                     |
| toggleConnectorMenu     | e: Event                            | void        | Toggles the visibility of the connector menu.                               |
| toggleMainMenu          | e: Event                            | void        | Toggles the visibility of the main menu.                                    |
| fetchAgentMemory        |                                     | Promise<void> | Fetches the agent's memory from the server.                                 |
| openMemoryDialog        |                                     | void        | Opens the memory dialog to explore agent memory.                            |
| addInputConnector       |                                     | void        | Adds an input connector to the agent.                                       |
| addOutputConnector      |                                     | void        | Adds an output connector to the agent.                                      |
| addExistingConnector    | connectorId: number, type: string   | void        | Adds an existing connector to the agent.                                    |
| startStatusUpdates      |                                     | void        | Starts periodic updates of the agent's status.                              |
| stopStatusUpdates       |                                     | void        | Stops periodic updates of the agent's status.                               |
| updateAgentStatus       |                                     | Promise<void> | Updates the agent's status from the server.                                 |
| startAgent              |                                     | Promise<void> | Starts the agent.                                                           |
| pauseAgent              |                                     | Promise<void> | Pauses the agent.                                                           |
| stopAgent               |                                     | Promise<void> | Stops the agent.                                                            |
| editNode                |                                     | void        | Triggers the edit node event.                                               |
| renderMemoryDialog      |                                     | TemplateResult | Renders the memory dialog.                                                 |
| renderActionButtons     |                                     | TemplateResult | Renders the action buttons based on the agent's state.                     |
| renderProgress          |                                     | TemplateResult | Renders the progress bar for the agent's operation.                        |
| renderConnectorMenu     |                                     | TemplateResult | Renders the connector menu for adding connectors.                          |
| renderMainMenu          |                                     | TemplateResult | Renders the main menu for additional actions.                              |
| render                  |                                     | TemplateResult | Renders the component's template.                                          |

## Examples

```typescript
// Example usage of the PsAgentNode web component
const agentNode = document.createElement('ps-agent-node');
agentNode.agentId = 123;
agentNode.groupId = 456;
document.body.appendChild(agentNode);
```