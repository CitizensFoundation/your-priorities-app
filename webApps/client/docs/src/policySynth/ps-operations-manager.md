# PsOperationsManager

The `PsOperationsManager` class is a custom web component that extends `PsBaseWithRunningAgentObserver`. It manages operations related to agents, including fetching agent data, handling dialogs for editing nodes, adding connectors, and managing costs.

## Properties

| Name                          | Type                                                                 | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------|
| `currentAgentId`              | `number \| undefined`                                                | The ID of the current agent.                                                |
| `totalCosts`                  | `number \| undefined`                                                | The total costs associated with the current agent.                          |
| `currentAgent`                | `PsAgentAttributes \| undefined`                                     | The current agent's attributes.                                             |
| `isFetchingAgent`             | `boolean`                                                            | Indicates if the agent data is being fetched.                               |
| `minimizeWorkflow`            | `boolean`                                                            | Indicates if the workflow should be minimized.                              |
| `nodeToEditInfo`              | `PsAgentAttributes \| PsAgentConnectorAttributes \| undefined`       | Information about the node to be edited.                                    |
| `activeTabIndex`              | `number`                                                             | The index of the currently active tab.                                      |
| `showEditNodeDialog`          | `boolean`                                                            | Indicates if the edit node dialog is visible.                               |
| `showAddAgentDialog`          | `boolean`                                                            | Indicates if the add agent dialog is visible.                               |
| `showAddConnectorDialog`      | `boolean`                                                            | Indicates if the add connector dialog is visible.                           |
| `selectedAgentIdForConnector` | `number \| null`                                                     | The ID of the selected agent for adding a connector.                        |
| `selectedInputOutputType`     | `string \| null`                                                     | The selected input/output type for the connector.                           |
| `agentElement`                | `PsOperationsView`                                                   | The `PsOperationsView` element.                                             |
| `groupId`                     | `number`                                                             | The ID of the group.                                                        |
| `group`                       | `YpGroupData`                                                        | The group data.                                                             |
| `detailedCosts`               | `PsDetailedAgentCostResults[]`                                       | The detailed costs associated with the agent.                               |
| `activeAiModels`              | `PsAiModelAttributes[]`                                              | The active AI models.                                                       |
| `api`                         | `PsServerApi`                                                        | The server API instance for fetching data.                                  |

## Methods

| Name                        | Parameters                                                                 | Return Type | Description                                                                 |
|-----------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| `constructor`               | -                                                                          | `void`      | Initializes the component and sets up the API instance.                     |
| `getAgent`                  | -                                                                          | `Promise<void>` | Fetches the current agent data.                                             |
| `updateConnectorRegistry`   | `agent: PsAgentAttributes`                                                 | `void`      | Updates the connector registry with the agent's connectors.                 |
| `connectedCallback`         | -                                                                          | `Promise<void>` | Lifecycle method called when the component is added to the DOM.             |
| `disconnectedCallback`      | -                                                                          | `Promise<void>` | Lifecycle method called when the component is removed from the DOM.         |
| `addExistingConnector`      | `event: CustomEvent`                                                       | `Promise<void>` | Adds an existing connector to the agent.                                    |
| `fetchAgentCosts`           | -                                                                          | `Promise<void>` | Fetches the total costs associated with the current agent.                  |
| `fetchActiveAiModels`       | -                                                                          | `Promise<void>` | Fetches the active AI models.                                               |
| `handleEditDialogSave`      | `event: CustomEvent`                                                       | `Promise<void>` | Handles saving the edited node configuration.                               |
| `openEditNodeDialog`        | `event: CustomEvent`                                                       | `void`      | Opens the edit node dialog.                                                 |
| `openAddConnectorDialog`    | `event: CustomEvent`                                                       | `void`      | Opens the add connector dialog.                                             |
| `openAddAgentDialog`        | `event: CustomEvent`                                                       | `void`      | Opens the add agent dialog.                                                 |
| `randomizeTheme`            | -                                                                          | `void`      | Randomizes the theme color.                                                 |
| `renderTotalCosts`          | -                                                                          | `TemplateResult` | Renders the total costs.                                                    |
| `getDetailedAgentCosts`     | -                                                                          | `Promise<void>` | Fetches detailed costs for the agent.                                       |
| `renderDetailedCostsTab`    | -                                                                          | `TemplateResult` | Renders the detailed costs tab.                                             |
| `tabChanged`                | -                                                                          | `void`      | Handles tab change events.                                                  |
| `renderHeader`              | -                                                                          | `TemplateResult` | Renders the header of the component.                                        |
| `render`                    | -                                                                          | `TemplateResult` | Renders the component.                                                      |
| `openConfig`                | -                                                                          | `void`      | Opens the configuration page for the group.                                 |
| `_openAnalyticsAndPromotions` | -                                                                        | `void`      | Opens the analytics and promotions page for the group.                      |

## Events

- **edit-node**: Emitted when a node is edited.
- **add-connector**: Emitted when a connector is added.
- **add-existing-connector**: Emitted when an existing connector is added.
- **get-costs**: Emitted to fetch agent costs.
- **add-agent**: Emitted when an agent is added.

## Examples

```typescript
// Example usage of the ps-operations-manager component
<ps-operations-manager></ps-operations-manager>
```