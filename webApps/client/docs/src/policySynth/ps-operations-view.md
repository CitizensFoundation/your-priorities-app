# PsOperationsView

The `PsOperationsView` class is a custom web component that extends `PsBaseWithRunningAgentObserver`. It provides a visual interface for managing and interacting with agents and connectors using a graphical representation. The component utilizes the JointJS library for rendering and manipulating the graph of agents and connectors.

## Properties

| Name              | Type                                                      | Description                                                                 |
|-------------------|-----------------------------------------------------------|-----------------------------------------------------------------------------|
| currentAgent      | `PsAgentAttributes`                                       | The currently selected agent.                                               |
| groupId           | `number`                                                  | The ID of the group to which the agents belong.                             |
| minimizeWorkflow  | `boolean`                                                 | Flag to determine if the workflow should be minimized.                      |
| group             | `YpGroupData`                                             | Data representing the group of agents.                                      |
| connectorRegistry | `{ [key: number]: PsAgentConnectorAttributes }`           | Registry of connectors associated with agents.                              |
| api               | `PsServerApi`                                             | Instance of the server API for communication.                               |

## Methods

| Name                          | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| constructor                   | -                                                                          | `void`      | Initializes the component and sets up the server API.                       |
| connectedCallback             | -                                                                          | `Promise<void>` | Lifecycle method called when the component is added to the DOM.            |
| zoom                          | `factor: number, x: number, y: number`                                     | `void`      | Zooms the paper view by a given factor centered at (x, y).                  |
| zoomIn                        | -                                                                          | `void`      | Zooms in the paper view.                                                    |
| zoomOut                       | -                                                                          | `void`      | Zooms out the paper view.                                                   |
| resetZoom                     | -                                                                          | `void`      | Resets the zoom level to the default.                                       |
| firstUpdated                  | `_changedProperties: PropertyValueMap<any> \| Map<PropertyKey, unknown>`   | `void`      | Lifecycle method called after the first update of the component.            |
| updated                       | `changedProperties: Map<string \| number \| symbol, unknown>`              | `void`      | Lifecycle method called when the component is updated.                      |
| disconnectedCallback          | -                                                                          | `void`      | Lifecycle method called when the component is removed from the DOM.         |
| handleNodeDoubleClick         | `element: dia.Element, zoomOut: boolean = false`                           | `void`      | Handles double-click events on nodes for zooming in or out.                 |
| createLink                    | `source: dia.Element, target: dia.Element, isInputConnector: boolean`      | `dia.Link \| null` | Creates a link between two elements.                                        |
| initializeJointJS             | -                                                                          | `Promise<void>` | Initializes the JointJS paper and graph.                                    |
| applyDirectedGraphLayout      | -                                                                          | `void`      | Applies a directed graph layout to the elements.                            |
| centerParentNodeOnScreen      | `parentNodeId: string`                                                     | `void`      | Centers a parent node on the screen.                                        |
| updatePaperSize               | -                                                                          | `void`      | Updates the size of the paper to fit the content.                           |
| createAgentElement            | `agent: PsAgentAttributes`                                                 | `dia.Element` | Creates a graphical element for an agent.                                   |
| createConnectorElement        | `connector: PsAgentConnectorAttributes, sourceAgent: PsAgentAttributes`    | `dia.Element \| null \| undefined` | Creates a graphical element for a connector.                                |
| getUniqueConnectorId          | `connector: PsAgentConnectorAttributes`                                    | `string`    | Generates a unique ID for a connector.                                      |
| getUniqueAgentId              | `agent: PsAgentAttributes`                                                 | `string`    | Generates a unique ID for an agent.                                         |
| updateGraphWithAgentData      | -                                                                          | `void`      | Updates the graph with the current agent data.                              |
| selectElement                 | `el: dia.Element \| null`                                                  | `void`      | Selects and highlights an element in the graph.                             |
| highlightCell                 | `cell: Cell`                                                               | `void`      | Highlights a cell in the graph.                                             |
| unhighlightCell               | `cell: Cell`                                                               | `void`      | Removes the highlight from a cell in the graph.                             |
| pan                           | `direction: string`                                                        | `void`      | Pans the view in a specified direction.                                     |
| renderHeader                  | -                                                                          | `TemplateResult` | Renders the header of the component.                                        |
| stop                          | -                                                                          | `void`      | Stops the current agent.                                                    |
| start                         | -                                                                          | `void`      | Starts the current agent.                                                   |
| render                        | -                                                                          | `TemplateResult` | Renders the component's template.                                           |

## Examples

```typescript
// Example usage of the PsOperationsView component
const operationsView = document.createElement('ps-operations-view');
document.body.appendChild(operationsView);
operationsView.currentAgent = someAgentData;
operationsView.groupId = 123;
operationsView.minimizeWorkflow = false;
```